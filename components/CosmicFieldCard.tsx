'use client'

// CosmicFieldCard — renders a stored or live Cosmic Field snapshot under a
// reading. ADMIN-ONLY private beta: parents must gate rendering by admin email.

import type { CosmicSnapshot } from '@/lib/cosmic-field'

export interface CosmicFieldSnapshotWithNote extends CosmicSnapshot {
  fieldNote?: string | null
}

interface Props {
  snapshot?: CosmicFieldSnapshotWithNote | null
  loading?: boolean
  simulation?: boolean
  compact?: boolean
}

const GOLD = '#c9a84c'

const COHERENCE_COLORS: Record<string, string> = {
  Normal: '#7dd3a0',
  Elevated: '#c9a84c',
  High: '#f5a623',
  'Very High': '#ff7849',
  Extreme: '#ff4d6d',
}

function Row({ emoji, label, value, hint }: { emoji: string; label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: '0.6rem',
      padding: '0.4rem 0', borderBottom: '1px solid rgba(201,168,76,0.08)',
    }}>
      <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{emoji}</span>
      <span style={{
        color: 'rgba(201,168,76,0.65)', fontSize: '0.62rem', letterSpacing: '0.12em',
        textTransform: 'uppercase', flexShrink: 0, minWidth: '7rem', textAlign: 'left',
      }}>{label}</span>
      <span style={{ color: 'rgba(230,220,255,0.85)', fontSize: '0.78rem', textAlign: 'left' }}>
        {value}
        {hint && <span style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.68rem', marginLeft: '0.4rem' }}>{hint}</span>}
      </span>
    </div>
  )
}

export default function CosmicFieldCard({ snapshot, loading, simulation, compact }: Props) {
  const isSim = !!simulation

  // ── Loading shimmer ──
  if (loading && !snapshot) {
    return (
      <div style={{
        margin: '1rem 0 0', borderRadius: '1rem', overflow: 'hidden',
        border: `1px solid ${GOLD}33`, background: 'rgba(8,6,28,0.9)',
        padding: '1rem 1.25rem', textAlign: 'left',
      }}>
        <div style={{
          color: `${GOLD}99`, fontSize: '0.62rem', letterSpacing: '0.15em',
          textTransform: 'uppercase', marginBottom: '0.75rem',
        }}>
          {isSim ? '📡 Reading field telemetry...' : '🌌 Reading the cosmic field...'}
        </div>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            height: '0.9rem', borderRadius: '0.4rem', marginBottom: '0.5rem',
            background: `linear-gradient(90deg, rgba(201,168,76,0.06) 25%, rgba(201,168,76,0.14) 50%, rgba(201,168,76,0.06) 75%)`,
            backgroundSize: '200% 100%',
            animation: 'cosmicShimmer 1.4s ease-in-out infinite',
            width: `${88 - i * 14}%`,
          }} />
        ))}
        <style>{`@keyframes cosmicShimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      </div>
    )
  }

  if (!snapshot) return null

  const { solar, consciousness, moon } = snapshot
  const coherenceColor = consciousness.available && consciousness.coherence
    ? (COHERENCE_COLORS[consciousness.coherence] || GOLD)
    : 'rgba(200,180,255,0.4)'

  return (
    <div style={{
      margin: '1rem 0 0', borderRadius: '1rem', overflow: 'hidden',
      border: `1px solid ${GOLD}44`, background: 'rgba(8,6,28,0.9)',
      backdropFilter: 'blur(12px)', textAlign: 'left',
    }}>
      {/* Header */}
      <div style={{
        padding: '0.6rem 1.25rem',
        background: `linear-gradient(90deg, ${GOLD}14, transparent)`,
        borderBottom: `1px solid ${GOLD}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
      }}>
        <span style={{ color: GOLD, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 600 }}>
          {isSim ? '📡 Field Telemetry' : '🌌 Cosmic Field'}
        </span>
        <span style={{ color: 'rgba(200,180,255,0.3)', fontSize: '0.58rem' }}>
          {new Date(snapshot.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div style={{ padding: compact ? '0.5rem 1.25rem 0.75rem' : '0.75rem 1.25rem 1rem' }}>
        {solar.windSpeed !== null && (
          <Row emoji="☀️" label={isSim ? 'Solar Wind' : 'Solar Wind'}
            value={`${solar.windSpeed} km/s`}
            hint={solar.density !== null ? `${solar.density} p/cm³` : undefined} />
        )}
        {solar.bz !== null && (
          <Row emoji="🧲" label="Bz Field"
            value={`${solar.bz} nT ${solar.bzDirection ?? ''}`}
            hint={solar.bzDirection === 'southward'
              ? (isSim ? 'coupling open' : 'valve open — energy flowing in')
              : (isSim ? 'coupling closed' : 'shielded')} />
        )}
        {solar.kp !== null && (
          <Row emoji="🌍" label={isSim ? 'Geomagnetic Index' : 'Earth Field (Kp)'}
            value={`${solar.kp} · ${solar.kpLabel ?? ''}`} />
        )}
        {solar.flareClass && (
          <Row emoji="🔥" label={isSim ? 'X-Ray Level' : 'Flare Activity'} value={solar.flareClass} />
        )}
        <Row emoji={moon.emoji || '🌑'} label="Moon"
          value={moon.phase} hint={`${moon.illumination}% lit`} />
        {consciousness.available && consciousness.coherence ? (
          <Row emoji="🧠" label={isSim ? 'Network Variance' : 'Consciousness'}
            value={<span style={{ color: coherenceColor, fontWeight: 600 }}>{consciousness.coherence}</span>}
            hint={consciousness.value != null ? `${consciousness.value}` : undefined} />
        ) : (
          <Row emoji="🧠" label={isSim ? 'Network Variance' : 'Consciousness'}
            value={<span style={{ color: 'rgba(200,180,255,0.45)', fontStyle: 'italic' }}>
              {isSim ? 'signal quiet — no telemetry' : 'field signal quiet — data temporarily unavailable'}
            </span>} />
        )}

        {/* Oracle field note */}
        {snapshot.fieldNote && (
          <p style={{
            margin: '0.9rem 0 0', color: `${GOLD}cc`, fontSize: '0.82rem',
            fontStyle: 'italic', lineHeight: 1.65,
            fontFamily: isSim ? 'monospace' : 'Cormorant Garamond, serif',
          }}>
            {isSim ? '>> ' : '✦ '}{snapshot.fieldNote}
          </p>
        )}
      </div>
    </div>
  )
}
