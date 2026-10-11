'use client'

import { useState } from 'react'

// Shapes returned by /api/admin/reading-quality
type Counts = { total: number; ai: number; backup: number; fallback: number }

export interface ReadingEventRow {
  id: string
  created_at: string
  email: string | null
  paid: boolean
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

export interface ReadingQualityData {
  models: { main: string; backup: string }
  tracking: {
    ready: boolean
    tableMissing: boolean
    error: string | null
    last24h: Counts
    last7d: Counts
    byFeature: Record<string, Counts>
    daily: ({ day: string } & Counts)[]
    lastSuccessAt: string | null
    lastFailure: { at: string; feature: string; error: string | null; model: string | null } | null
    medianLatencyMs: number | null
    recent: ReadingEventRow[]
  }
  history: { day: string; paidPersonal: number; paidGeneric: number; freePersonal: number; freeGeneric: number }[]
}

const card = {
  background: 'rgba(8,6,28,0.88)',
  borderRadius: '1.5rem',
  border: '1px solid rgba(255,255,255,0.07)',
  backdropFilter: 'blur(12px)',
  padding: '1.5rem',
}

const GREEN = '#4ade80'
const AMBER = '#fbbf24'
const RED = '#f87171'
const MUTED = 'rgba(180,160,255,0.5)'

const FEATURE_LABELS: Record<string, string> = {
  oracle_instant: 'Angel log reading',
  oracle_question: 'Ask the Oracle',
  dream_interpret: 'Dream interpretation',
  synthesis: 'Cosmic Synthesis',
}

const STATUS_INFO: Record<string, { label: string; color: string; help: string }> = {
  ai: { label: 'Personalized', color: GREEN, help: 'AI reading from the main model' },
  ai_backup: { label: 'Personalized (backup)', color: AMBER, help: 'Main model failed, the backup model answered' },
  empty: { label: 'Generic (empty AI answer)', color: RED, help: 'The AI answered with nothing, so the user saw stock text' },
  error: { label: 'Generic (AI failed)', color: RED, help: 'The AI call failed, so the user saw stock text' },
}

function pct(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0
}

function ago(iso: string | null) {
  if (!iso) return 'never'
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 48) return `${hrs} h ago`
  return `${Math.round(hrs / 24)} days ago`
}

export type Health = { level: 'good' | 'warn' | 'bad' | 'setup'; headline: string; detail: string }

/** One plain-language verdict: are users getting personalized readings right now? */
export function readingHealth(data: ReadingQualityData): Health {
  const t = data.tracking
  if (!t.ready) {
    return {
      level: 'setup',
      headline: 'Reading tracking is not switched on yet',
      detail: t.tableMissing
        ? 'Run AI_READING_EVENTS_SCHEMA.sql once in the Supabase SQL editor. Until then only the history chart below works.'
        : `Could not read tracking data: ${t.error}`,
    }
  }
  const { total, fallback, backup } = t.last24h
  if (total === 0) {
    return { level: 'good', headline: 'No AI readings in the last 24 hours', detail: `Last personalized reading: ${ago(t.lastSuccessAt)}.` }
  }
  const failRate = pct(fallback, total)
  const lastErr = t.lastFailure?.error ? ` Last error: ${t.lastFailure.error}` : ''
  if (failRate >= 25 || (total >= 3 && fallback === total)) {
    return {
      level: 'bad',
      headline: `${failRate}% of readings in the last 24h were generic`,
      detail: `${fallback} of ${total} users got stock text instead of a personalized reading.${lastErr}`,
    }
  }
  if (failRate >= 5 || backup > 0) {
    return {
      level: 'warn',
      headline: `${100 - failRate}% of readings in the last 24h were personalized`,
      detail: `${fallback} generic, ${backup} answered by the backup model.${lastErr}`,
    }
  }
  return {
    level: 'good',
    headline: `${100 - failRate}% of readings in the last 24h were personalized`,
    detail: `${total} readings, all from ${data.models.main}.`,
  }
}

const HEALTH_COLORS: Record<Health['level'], string> = { good: GREEN, warn: AMBER, bad: RED, setup: AMBER }
const HEALTH_ICONS: Record<Health['level'], string> = { good: '✅', warn: '⚠️', bad: '🚨', setup: '🛠️' }

export function ReadingHealthBanner({ data, onOpen }: { data: ReadingQualityData; onOpen?: () => void }) {
  const h = readingHealth(data)
  const color = HEALTH_COLORS[h.level]
  return (
    <div
      onClick={onOpen}
      style={{
        ...card,
        padding: '1rem 1.25rem',
        border: `1px solid ${color}55`,
        background: `${color}12`,
        cursor: onOpen ? 'pointer' : 'default',
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ fontSize: '1.4rem', lineHeight: 1 }}>{HEALTH_ICONS[h.level]}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color, fontWeight: 700, fontSize: '0.95rem' }}>{h.headline}</div>
        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', marginTop: '0.2rem', overflowWrap: 'anywhere' }}>{h.detail}</div>
      </div>
      {onOpen && <div style={{ color, fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Details →</div>}
    </div>
  )
}

function StatCard({ label, value, sub, color = '#c9a84c' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ ...card, textAlign: 'center', padding: '1.1rem' }}>
      <div style={{ fontSize: '1.7rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: MUTED, marginTop: '0.25rem' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.65rem', color: 'rgba(180,160,255,0.35)', marginTop: '0.15rem' }}>{sub}</div>}
    </div>
  )
}

/** Stacked daily bars. Each segment is [value, color, label]. */
function DailyBars({ days, segments }: { days: string[]; segments: (i: number) => [number, string, string][] }) {
  const totals = days.map((_, i) => segments(i).reduce((s, [v]) => s + v, 0))
  const max = Math.max(...totals, 1)
  const labelEvery = Math.ceil(days.length / 7)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 120 }}>
        {days.map((d, i) => (
          <div
            key={d}
            title={`${d}: ` + segments(i).map(([v, , l]) => `${l} ${v}`).join(', ')}
            style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column-reverse', minWidth: 0 }}
          >
            {segments(i).map(([v, c, l]) => v > 0 && (
              <div key={l} style={{ height: `${(v / max) * 100}%`, background: c, borderTop: '1px solid rgba(8,6,28,0.9)' }} />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
        {days.map((d, i) => (
          <div key={d} style={{ flex: 1, fontSize: '0.6rem', color: 'rgba(180,160,255,0.4)', textAlign: 'center', minWidth: 0, overflow: 'visible', whiteSpace: 'nowrap' }}>
            {i % labelEvery === 0 ? d.slice(5) : ''}
          </div>
        ))}
      </div>
    </div>
  )
}

function Legend({ items }: { items: [string, string][] }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.6rem' }}>
      {items.map(([label, color]) => (
        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.65)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
          {label}
        </span>
      ))}
    </div>
  )
}

export function ReadingQualityPanel({ data, loading, error, onRefresh }: {
  data: ReadingQualityData | null
  loading: boolean
  error: string
  onRefresh: () => void
}) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [onlyGeneric, setOnlyGeneric] = useState(false)

  if (error) return <div style={{ color: RED, padding: '1rem', background: 'rgba(248,113,113,0.1)', borderRadius: '0.75rem' }}>{error}</div>
  if (!data) return <div style={{ color: MUTED }}>{loading ? 'Loading reading quality...' : 'No data'}</div>

  const t = data.tracking
  const recent = onlyGeneric ? t.recent.filter(r => r.status === 'error' || r.status === 'empty') : t.recent

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ReadingHealthBanner data={data} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: MUTED }}>
          Main model: <span style={{ color: '#c9a84c' }}>{data.models.main}</span> · Backup: <span style={{ color: '#c9a84c' }}>{data.models.backup}</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{ padding: '0.35rem 1rem', borderRadius: '999px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c', cursor: 'pointer', fontSize: '0.75rem' }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {t.ready && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <StatCard
              label="Personalized (24h)"
              value={t.last24h.total ? `${pct(t.last24h.ai + t.last24h.backup, t.last24h.total)}%` : '—'}
              sub={`${t.last24h.total} readings`}
              color={t.last24h.fallback > 0 ? AMBER : GREEN}
            />
            <StatCard
              label="Personalized (7 days)"
              value={t.last7d.total ? `${pct(t.last7d.ai + t.last7d.backup, t.last7d.total)}%` : '—'}
              sub={`${t.last7d.total} readings`}
              color={t.last7d.fallback > 0 ? AMBER : GREEN}
            />
            <StatCard label="Generic (7 days)" value={t.last7d.fallback} sub="users got stock text" color={t.last7d.fallback > 0 ? RED : GREEN} />
            <StatCard
              label="Typical wait"
              value={t.medianLatencyMs ? `${(t.medianLatencyMs / 1000).toFixed(1)}s` : '—'}
              sub={`last success ${ago(t.lastSuccessAt)}`}
              color="#a78bfa"
            />
          </div>

          <div style={card}>
            <h3 style={{ color: '#c9a84c', marginBottom: '0.25rem', fontSize: '0.95rem' }}>Readings per day (last 14 days)</h3>
            <p style={{ color: MUTED, fontSize: '0.75rem', marginBottom: '1rem' }}>Any red means users got generic text that day. Hover a bar for numbers.</p>
            <DailyBars
              days={t.daily.map(d => d.day)}
              segments={i => [
                [t.daily[i].ai, GREEN, 'personalized'],
                [t.daily[i].backup, AMBER, 'backup model'],
                [t.daily[i].fallback, RED, 'generic'],
              ]}
            />
            <Legend items={[['Personalized', GREEN], ['Personalized by backup model', AMBER], ['Generic fallback', RED]]} />
          </div>

          <div style={card}>
            <h3 style={{ color: '#c9a84c', marginBottom: '0.75rem', fontSize: '0.95rem' }}>By feature (last 7 days)</h3>
            {Object.keys(t.byFeature).length === 0 && <div style={{ color: MUTED, fontSize: '0.8rem' }}>No readings yet.</div>}
            {Object.entries(t.byFeature).sort((a, b) => b[1].total - a[1].total).map(([f, c]) => {
              const okPct = pct(c.ai + c.backup, c.total)
              return (
                <div key={f} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.75)' }}>{FEATURE_LABELS[f] || f}</span>
                    <span style={{ color: c.fallback > 0 ? AMBER : GREEN }}>{okPct}% personalized · {c.total} total{c.fallback ? ` · ${c.fallback} generic` : ''}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, display: 'flex', overflow: 'hidden' }}>
                    <div style={{ width: `${pct(c.ai, c.total)}%`, background: GREEN }} />
                    <div style={{ width: `${pct(c.backup, c.total)}%`, background: AMBER }} />
                    <div style={{ width: `${pct(c.fallback, c.total)}%`, background: RED }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ color: '#c9a84c', fontSize: '0.95rem' }}>Recent readings</h3>
              <label style={{ fontSize: '0.75rem', color: MUTED, display: 'flex', gap: '0.35rem', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={onlyGeneric} onChange={e => setOnlyGeneric(e.target.checked)} />
                Only generic
              </label>
            </div>
            {recent.length === 0 && <div style={{ color: MUTED, fontSize: '0.8rem' }}>Nothing here yet.</div>}
            {recent.map(r => {
              const s = STATUS_INFO[r.status] || { label: r.status, color: MUTED, help: '' }
              const open = expanded === r.id
              return (
                <div
                  key={r.id}
                  onClick={() => setExpanded(open ? null : r.id)}
                  style={{ padding: '0.55rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span title={s.help} style={{ color: s.color, background: s.color + '1f', border: `1px solid ${s.color}55`, borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                      {s.label}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{FEATURE_LABELS[r.feature] || r.feature}</span>
                    <span style={{ color: MUTED, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.email || 'signed-out user'}{r.paid ? ' · paid' : ''}
                    </span>
                    <span style={{ color: 'rgba(180,160,255,0.4)', whiteSpace: 'nowrap' }}>{ago(r.created_at)}</span>
                  </div>
                  {open && (
                    <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.6rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, overflowWrap: 'anywhere' }}>
                      <div style={{ color: MUTED, fontSize: '0.7rem', marginBottom: '0.35rem' }}>
                        {new Date(r.created_at).toLocaleString()} · {r.mode || 'spiritual'} · model {r.model || 'none'}
                        {r.latency_ms ? ` · ${(r.latency_ms / 1000).toFixed(1)}s` : ''}
                        {r.has_thought !== null ? ` · ${r.has_thought ? 'with' : 'without'} a thought` : ''}
                        {r.reading_length ? ` · ${r.reading_length} characters` : ''}
                      </div>
                      {r.error && <div style={{ color: RED, marginBottom: '0.35rem' }}>Error: {r.error}</div>}
                      {r.reading_preview ? <div style={{ whiteSpace: 'pre-wrap' }}>{r.reading_preview}{(r.reading_length ?? 0) > r.reading_preview.length ? '…' : ''}</div> : !r.error && <div>No reading text.</div>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )}

      <div style={card}>
        <h3 style={{ color: '#c9a84c', marginBottom: '0.25rem', fontSize: '0.95rem' }}>History from saved angel logs (last 90 days)</h3>
        <p style={{ color: MUTED, fontSize: '0.75rem', marginBottom: '1rem' }}>
          Every angel log where the user typed a thought. Gold means the saved reading was personalized, red means it was the stock meaning for that number.
          Paying members should never be red. Free members turn red once their trial readings run out, which is expected.
        </p>
        <DailyBars
          days={data.history.map(d => d.day)}
          segments={i => [
            [data.history[i].paidPersonal, '#c9a84c', 'paid personalized'],
            [data.history[i].paidGeneric, RED, 'paid generic'],
            [data.history[i].freePersonal, '#a78bfa', 'free personalized'],
            [data.history[i].freeGeneric, 'rgba(248,113,113,0.35)', 'free generic'],
          ]}
        />
        <Legend items={[['Paid, personalized', '#c9a84c'], ['Paid, generic', RED], ['Free, personalized', '#a78bfa'], ['Free, generic', 'rgba(248,113,113,0.35)']]} />
      </div>
    </div>
  )
}
