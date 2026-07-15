'use client'

// /dashboard/cosmic-field — live Cosmic Field observatory.
// ADMIN-ONLY private beta: non-admins see a tasteful placeholder, zero data.

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { isCosmicFieldAdmin } from '@/lib/cosmic-field'
import CosmicFieldCard, { type CosmicFieldSnapshotWithNote } from '@/components/CosmicFieldCard'
import { useTheme } from '@/lib/theme-context'

const GOLD = '#c9a84c'
const PURPLE = '#a78bfa'

const COHERENCE_COLORS: Record<string, string> = {
  Normal: '#7dd3a0',
  Elevated: '#c9a84c',
  High: '#f5a623',
  'Very High': '#ff7849',
  Extreme: '#ff4d6d',
}

const COHERENCE_ORDER = ['Normal', 'Elevated', 'High', 'Very High', 'Extreme']

interface RecentMoment {
  id: string
  kind: 'log' | 'dream'
  label: string
  createdAt: string
  snapshot: CosmicFieldSnapshotWithNote
}

const glassCard: React.CSSProperties = {
  background: 'rgba(8,6,28,0.9)',
  backdropFilter: 'blur(16px)',
  border: `1px solid ${GOLD}26`,
  borderRadius: '24px',
  padding: '1.25rem',
  boxSizing: 'border-box',
}

function GaugeLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase',
      color: `${GOLD}99`, marginBottom: '0.5rem', fontWeight: 600,
    }}>{children}</div>
  )
}

export default function CosmicFieldPage() {
  const { theme } = useTheme()
  const isSim = theme === 'simulation'
  const [checked, setChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [snapshot, setSnapshot] = useState<CosmicFieldSnapshotWithNote | null>(null)
  const [moments, setMoments] = useState<RecentMoment[]>([])
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  // Admin gate
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAdmin(isCosmicFieldAdmin(user?.email))
      setChecked(true)
    }).catch(() => setChecked(true))
  }, [])

  // Live field data with 60s auto-refresh
  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/cosmic-field')
      if (!res.ok) return
      const data = await res.json()
      setSnapshot(data)
      setLastRefreshed(new Date())
    } catch { /* keep last good reading */ }
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    refresh()
    const interval = setInterval(refresh, 60000)
    return () => clearInterval(interval)
  }, [isAdmin, refresh])

  // Recent moments with stored snapshots
  useEffect(() => {
    if (!isAdmin) return
    const loadMoments = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const collected: RecentMoment[] = []

        const { data: logs } = await supabase
          .from('angel_logs')
          .select('id, number, created_at, cosmic_field_snapshot')
          .eq('user_id', user.id)
          .not('cosmic_field_snapshot', 'is', null)
          .order('created_at', { ascending: false })
          .limit(6)
        for (const row of logs ?? []) {
          if (row.cosmic_field_snapshot) {
            collected.push({
              id: row.id, kind: 'log',
              label: isSim ? `Signal ${row.number}` : `Angel Number ${row.number}`,
              createdAt: row.created_at,
              snapshot: row.cosmic_field_snapshot as CosmicFieldSnapshotWithNote,
            })
          }
        }

        const { data: dreams } = await supabase
          .from('dreams')
          .select('id, title, created_at, cosmic_field_snapshot')
          .eq('user_id', user.id)
          .not('cosmic_field_snapshot', 'is', null)
          .order('created_at', { ascending: false })
          .limit(6)
        for (const row of dreams ?? []) {
          if (row.cosmic_field_snapshot) {
            collected.push({
              id: row.id, kind: 'dream',
              label: `${isSim ? 'Dream Sequence' : 'Dream'}: ${row.title || 'Untitled'}`,
              createdAt: row.created_at,
              snapshot: row.cosmic_field_snapshot as CosmicFieldSnapshotWithNote,
            })
          }
        }

        collected.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setMoments(collected.slice(0, 8))
      } catch { /* moments are optional */ }
    }
    loadMoments()
  }, [isAdmin, isSim])

  if (!checked) {
    return (
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1rem', textAlign: 'center' }}>
        <span style={{ color: `${GOLD}66`, fontSize: '0.8rem', letterSpacing: '0.15em' }}>✦</span>
      </div>
    )
  }

  // ── Non-admin: tasteful placeholder, zero trace of the feature ──
  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨</div>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: '1.6rem',
          color: 'rgba(220,200,255,0.85)', margin: '0 0 0.5rem',
        }}>This constellation is still forming</h1>
        <p style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.85rem', lineHeight: 1.6 }}>
          Return soon — new stars are being placed in the sky.
        </p>
      </div>
    )
  }

  const solar = snapshot?.solar
  const moon = snapshot?.moon
  const consciousness = snapshot?.consciousness

  // Overall state line
  let overallState = isSim ? 'Awaiting telemetry...' : 'Listening to the field...'
  if (solar) {
    const valveOpen = solar.bzDirection === 'southward'
    const kpWord = solar.kpLabel?.toLowerCase() ?? 'quiet'
    overallState = isSim
      ? `System ${kpWord} · magnetospheric coupling ${valveOpen ? 'OPEN' : 'CLOSED'} · lunar cycle ${moon?.illumination ?? '—'}%`
      : `Earth's field is ${kpWord} · the magnetic valve is ${valveOpen ? 'open — energy flowing in' : 'closed — Earth shielded'} · ${moon?.phase ?? ''}`
  }

  const coherence = consciousness?.available ? consciousness.coherence : undefined
  const coherenceColor = coherence ? (COHERENCE_COLORS[coherence] || GOLD) : 'rgba(200,180,255,0.35)'
  const coherenceIndex = coherence ? COHERENCE_ORDER.indexOf(coherence) : -1

  const kpValue = solar?.kp ?? null
  const kpColor = kpValue === null ? 'rgba(200,180,255,0.3)'
    : kpValue < 3 ? '#7dd3a0' : kpValue < 4 ? '#c9a84c' : kpValue < 5 ? '#f5a623' : '#ff4d6d'

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '1.5rem 1rem 3rem', boxSizing: 'border-box' }}>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{
          fontSize: '0.62rem', letterSpacing: '0.25em', textTransform: 'uppercase',
          color: `${PURPLE}aa`, marginBottom: '0.4rem',
        }}>{isSim ? 'PRIVATE TELEMETRY CHANNEL' : 'Private Beta ✦ Oracle Observatory'}</div>
        <h1 style={{
          fontFamily: isSim ? 'monospace' : 'Cormorant Garamond, serif',
          fontWeight: 300, fontSize: '2.4rem', margin: '0 0 0.5rem',
          background: `linear-gradient(135deg, ${GOLD}, ${PURPLE})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>{isSim ? 'FIELD_TELEMETRY.SYS' : 'Cosmic Field'}</h1>
        <p style={{ color: 'rgba(220,200,255,0.55)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
          {overallState}
        </p>
        {lastRefreshed && (
          <p style={{ color: 'rgba(200,180,255,0.25)', fontSize: '0.62rem', marginTop: '0.4rem' }}>
            {isSim ? 'last poll ' : 'field read '}{lastRefreshed.toLocaleTimeString()} · refreshes every 60s
          </p>
        )}
      </div>

      {/* ── Live gauges grid ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '0.75rem', marginBottom: '2rem',
      }}>

        {/* Solar Wind */}
        <div style={glassCard}>
          <GaugeLabel>☀️ Solar Wind</GaugeLabel>
          <div style={{ fontSize: '1.9rem', fontWeight: 300, color: 'rgba(240,230,255,0.95)', fontFamily: 'Cormorant Garamond, serif' }}>
            {solar?.windSpeed ?? '—'}<span style={{ fontSize: '0.85rem', color: 'rgba(200,180,255,0.4)', marginLeft: '0.3rem' }}>km/s</span>
          </div>
          <div style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.7rem', marginTop: '0.25rem' }}>
            {solar?.density != null ? `density ${solar.density} p/cm³` : 'density —'}
          </div>
        </div>

        {/* Bz valve */}
        <div style={glassCard}>
          <GaugeLabel>🧲 Bz {isSim ? 'Coupling' : '· The Valve'}</GaugeLabel>
          <div style={{ fontSize: '1.9rem', fontWeight: 300, color: 'rgba(240,230,255,0.95)', fontFamily: 'Cormorant Garamond, serif' }}>
            {solar?.bz != null ? `${solar.bz}` : '—'}<span style={{ fontSize: '0.85rem', color: 'rgba(200,180,255,0.4)', marginLeft: '0.3rem' }}>nT</span>
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem',
            padding: '0.15rem 0.6rem', borderRadius: '9999px', fontSize: '0.62rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: solar?.bzDirection === 'southward' ? 'rgba(255,120,73,0.12)' : 'rgba(125,211,160,0.1)',
            border: `1px solid ${solar?.bzDirection === 'southward' ? 'rgba(255,120,73,0.4)' : 'rgba(125,211,160,0.3)'}`,
            color: solar?.bzDirection === 'southward' ? '#ff7849' : '#7dd3a0',
          }}>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: solar?.bzDirection === 'southward' ? '#ff7849' : '#7dd3a0',
            }} />
            {solar?.bzDirection === 'southward'
              ? (isSim ? 'coupling open' : 'valve open')
              : (isSim ? 'coupling closed' : 'shielded')}
          </div>
        </div>

        {/* Kp bar */}
        <div style={glassCard}>
          <GaugeLabel>🌍 {isSim ? 'Geomagnetic Index' : 'Earth Field · Kp'}</GaugeLabel>
          <div style={{ fontSize: '1.9rem', fontWeight: 300, color: kpColor, fontFamily: 'Cormorant Garamond, serif' }}>
            {kpValue ?? '—'}<span style={{ fontSize: '0.8rem', color: 'rgba(200,180,255,0.45)', marginLeft: '0.4rem' }}>{solar?.kpLabel ?? ''}</span>
          </div>
          <div style={{ display: 'flex', gap: '3px', marginTop: '0.6rem' }}>
            {Array.from({ length: 10 }, (_, i) => {
              const filled = kpValue !== null && i <= kpValue
              const segColor = i < 3 ? '#7dd3a0' : i < 4 ? '#c9a84c' : i < 5 ? '#f5a623' : '#ff4d6d'
              return (
                <div key={i} style={{
                  flex: 1, height: '6px', borderRadius: '3px',
                  background: filled ? segColor : 'rgba(200,180,255,0.08)',
                  boxShadow: filled ? `0 0 6px ${segColor}55` : 'none',
                }} />
              )
            })}
          </div>
        </div>

        {/* Flare activity */}
        <div style={glassCard}>
          <GaugeLabel>🔥 {isSim ? 'X-Ray Level' : 'Flare Activity'}</GaugeLabel>
          <div style={{ fontSize: '1.9rem', fontWeight: 300, color: 'rgba(240,230,255,0.95)', fontFamily: 'Cormorant Garamond, serif' }}>
            {solar?.flareClass ?? '—'}
          </div>
          <div style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.7rem', marginTop: '0.25rem' }}>
            {isSim ? 'GOES long-band X-ray flux' : "the Sun's current whisper"}
          </div>
        </div>

        {/* Moon */}
        <div style={{ ...glassCard, textAlign: 'center' }}>
          <GaugeLabel>{isSim ? 'Lunar Cycle' : 'Moon'}</GaugeLabel>
          <div style={{ fontSize: '3rem', lineHeight: 1.1, filter: `drop-shadow(0 0 12px ${PURPLE}44)` }}>
            {moon?.emoji ?? '🌑'}
          </div>
          <div style={{ color: 'rgba(240,230,255,0.9)', fontSize: '0.85rem', marginTop: '0.35rem', fontFamily: 'Cormorant Garamond, serif' }}>
            {moon?.phase ?? '—'}
          </div>
          <div style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.68rem' }}>
            {moon ? `${moon.illumination}% illuminated` : ''}
          </div>
        </div>

        {/* Consciousness coherence */}
        <div style={glassCard}>
          <GaugeLabel>🧠 {isSim ? 'Network Variance' : 'Consciousness Field'}</GaugeLabel>
          {consciousness?.available && coherence ? (
            <>
              <div style={{ fontSize: '1.6rem', fontWeight: 400, color: coherenceColor, fontFamily: 'Cormorant Garamond, serif' }}>
                {coherence}
              </div>
              <div style={{ display: 'flex', gap: '3px', marginTop: '0.6rem' }}>
                {COHERENCE_ORDER.map((level, i) => (
                  <div key={level} title={level} style={{
                    flex: 1, height: '6px', borderRadius: '3px',
                    background: coherenceIndex >= i ? (COHERENCE_COLORS[level] || GOLD) : 'rgba(200,180,255,0.08)',
                    boxShadow: coherenceIndex >= i ? `0 0 6px ${COHERENCE_COLORS[level]}55` : 'none',
                  }} />
                ))}
              </div>
              {consciousness.value != null && (
                <div style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.68rem', marginTop: '0.4rem' }}>
                  {isSim ? 'netvar' : 'network variance'} {consciousness.value}
                </div>
              )}
            </>
          ) : (
            <div style={{ color: 'rgba(200,180,255,0.45)', fontSize: '0.8rem', fontStyle: 'italic', lineHeight: 1.5 }}>
              {isSim
                ? 'network telemetry unavailable — signal quiet'
                : 'Consciousness field signal quiet — data temporarily unavailable'}
            </div>
          )}
        </div>
      </div>

      {/* ── Your Recent Moments ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <h2 style={{
          fontFamily: isSim ? 'monospace' : 'Cormorant Garamond, serif', fontWeight: 300,
          fontSize: '1.4rem', color: 'rgba(220,200,255,0.9)', margin: 0,
        }}>{isSim ? 'LOGGED FIELD STATES' : 'Your Recent Moments'}</h2>
        <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${GOLD}33, transparent)` }} />
      </div>

      {moments.length === 0 ? (
        <div style={{ ...glassCard, textAlign: 'center', padding: '2rem 1.25rem' }}>
          <div style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>🌌</div>
          <p style={{ color: 'rgba(200,180,255,0.45)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
            {isSim
              ? 'No field states captured yet. Register a signal or log a dream sequence — the telemetry will be recorded with it.'
              : 'No field moments captured yet. Log a number or record a dream — the cosmic field will be sealed into that moment.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.75rem' }}>
          {moments.map(m => (
            <div key={`${m.kind}-${m.id}`}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', padding: '0 0.25rem' }}>
                <span style={{ color: 'rgba(230,215,255,0.85)', fontSize: '0.82rem', fontWeight: 600 }}>
                  {m.kind === 'log' ? '✦' : '🌙'} {m.label}
                </span>
                <span style={{ color: 'rgba(200,180,255,0.3)', fontSize: '0.62rem' }}>
                  {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <CosmicFieldCard snapshot={m.snapshot} simulation={isSim} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
