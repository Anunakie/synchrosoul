import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'
import { getAngelMeaning } from '@/lib/angel-meanings'
import { ORACLE_MODEL, ORACLE_FALLBACK_MODEL } from '@/lib/groq-retry'

export const runtime = 'nodejs'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

type EventRow = {
  id: string
  created_at: string
  user_id: string | null
  feature: string
  status: string
  mode: string | null
  model: string | null
  error: string | null
  latency_ms: number | null
  has_thought: boolean | null
  reading_length: number | null
  reading_preview: string | null
}

type Counts = { total: number; ai: number; backup: number; fallback: number }

const DAY = 24 * 60 * 60 * 1000
const EVENT_DAYS = 14
const HISTORY_DAYS = 90

function emptyCounts(): Counts {
  return { total: 0, ai: 0, backup: 0, fallback: 0 }
}

function add(c: Counts, status: string) {
  c.total++
  if (status === 'ai') c.ai++
  else if (status === 'ai_backup') c.backup++
  else c.fallback++
}

function dayKey(iso: string) {
  return iso.slice(0, 10)
}

function lastDays(n: number) {
  const days: string[] = []
  for (let i = n - 1; i >= 0; i--) days.push(new Date(Date.now() - i * DAY).toISOString().slice(0, 10))
  return days
}

/** Read every row of a query in pages (Supabase returns at most 1000 per request). */
async function fetchAll<T>(build: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { code?: string; message: string } | null }>, max = 10000) {
  const rows: T[] = []
  for (let from = 0; from < max; from += 1000) {
    const { data, error } = await build(from, from + 999)
    if (error) return { rows, error }
    rows.push(...(data ?? []))
    if (!data || data.length < 1000) break
  }
  return { rows, error: null }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  try {
    const supabase = getSupabase()

    // Who's who: emails + paid status
    const { data: usersData } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const users = usersData?.users ?? []
    const emailById: Record<string, string> = {}
    const betaTierById: Record<string, string> = {}
    users.forEach(u => {
      emailById[u.id] = u.email || ''
      if (u.user_metadata?.beta_tier) betaTierById[u.id] = u.user_metadata.beta_tier
    })
    const { data: profiles } = await supabase.from('profiles').select('id, subscription_tier')
    const paidById: Record<string, boolean> = {}
    profiles?.forEach((p: { id: string; subscription_tier?: string | null }) => {
      const tier = p.subscription_tier && p.subscription_tier !== 'free' ? p.subscription_tier : betaTierById[p.id] || 'free'
      paidById[p.id] = tier !== 'free'
    })

    // ── 1. Live tracking (ai_reading_events) ─────────────────────────────
    const since = new Date(Date.now() - EVENT_DAYS * DAY).toISOString()
    const { rows: events, error: eventsError } = await fetchAll<EventRow>((from, to) =>
      supabase
        .from('ai_reading_events')
        .select('id, created_at, user_id, feature, status, mode, model, error, latency_ms, has_thought, reading_length, reading_preview')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .range(from, to)
    )
    const trackingReady = !eventsError
    const tableMissing = !!eventsError && (eventsError.code === '42P01' || eventsError.code === 'PGRST205' || /does not exist|could not find/i.test(eventsError.message))

    const now = Date.now()
    const last24h = emptyCounts()
    const last7d = emptyCounts()
    const byFeature: Record<string, Counts> = {}
    const dailyMap: Record<string, Counts> = {}
    const days14 = lastDays(EVENT_DAYS)
    days14.forEach(d => { dailyMap[d] = emptyCounts() })
    let lastSuccessAt: string | null = null
    let lastFailure: { at: string; feature: string; error: string | null; model: string | null } | null = null
    const latencies: number[] = []

    for (const e of events) {
      const age = now - new Date(e.created_at).getTime()
      if (age <= DAY) add(last24h, e.status)
      if (age <= 7 * DAY) {
        add(last7d, e.status)
        byFeature[e.feature] = byFeature[e.feature] || emptyCounts()
        add(byFeature[e.feature], e.status)
      }
      const k = dayKey(e.created_at)
      if (dailyMap[k]) add(dailyMap[k], e.status)
      const ok = e.status === 'ai' || e.status === 'ai_backup'
      if (ok && !lastSuccessAt) lastSuccessAt = e.created_at
      if (!ok && !lastFailure) lastFailure = { at: e.created_at, feature: e.feature, error: e.error, model: e.model }
      if (ok && e.latency_ms) latencies.push(e.latency_ms)
    }
    latencies.sort((a, b) => a - b)

    const recent = events.slice(0, 50).map(e => ({
      ...e,
      email: e.user_id ? emailById[e.user_id] || null : null,
      paid: e.user_id ? !!paidById[e.user_id] : false,
    }))

    // ── 2. History from saved angel logs (works without the new table) ────
    // A log with a thought should get a personalized reading. If its saved
    // reading is exactly the stock angel-number meaning, the user got generic text.
    const historySince = new Date(Date.now() - HISTORY_DAYS * DAY).toISOString()
    const { rows: logs } = await fetchAll<{ user_id: string; number: string; thought: string | null; mini_reading: string | null; created_at: string }>((from, to) =>
      supabase
        .from('angel_logs')
        .select('user_id, number, thought, mini_reading, created_at')
        .gte('created_at', historySince)
        .not('thought', 'is', null)
        .neq('thought', '')
        .order('created_at', { ascending: false })
        .range(from, to)
    )
    const historyDays = lastDays(HISTORY_DAYS)
    const history: Record<string, { paidPersonal: number; paidGeneric: number; freePersonal: number; freeGeneric: number }> = {}
    historyDays.forEach(d => { history[d] = { paidPersonal: 0, paidGeneric: 0, freePersonal: 0, freeGeneric: 0 } })
    for (const l of logs) {
      if (!l.thought?.trim()) continue
      const bucket = history[dayKey(l.created_at)]
      if (!bucket) continue
      const generic = !l.mini_reading || l.mini_reading.trim() === getAngelMeaning(l.number).message.trim()
      const paid = !!paidById[l.user_id]
      if (paid) generic ? bucket.paidGeneric++ : bucket.paidPersonal++
      else generic ? bucket.freeGeneric++ : bucket.freePersonal++
    }

    return NextResponse.json({
      models: { main: ORACLE_MODEL, backup: ORACLE_FALLBACK_MODEL },
      tracking: {
        ready: trackingReady,
        tableMissing,
        error: trackingReady ? null : eventsError?.message ?? null,
        last24h,
        last7d,
        byFeature,
        daily: days14.map(d => ({ day: d, ...dailyMap[d] })),
        lastSuccessAt,
        lastFailure,
        medianLatencyMs: latencies.length ? latencies[Math.floor(latencies.length / 2)] : null,
        recent,
      },
      history: historyDays.map(d => ({ day: d, ...history[d] })),
    })
  } catch (err: unknown) {
    console.error('Admin reading-quality error:', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
