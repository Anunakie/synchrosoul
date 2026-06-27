'use client'

interface Props {
  remaining: number
  isSimulation?: boolean
}

/**
 * Small reusable banner showing how many free trial readings remain.
 * - remaining > 1: gold pill
 * - remaining === 1: amber warning
 * - remaining === 0: renders null (teaser takes over)
 */
export default function TrialReadingBanner({ remaining, isSimulation = false }: Props) {
  if (remaining <= 0) return null

  const readingLabel = isSimulation ? 'anomaly analyses' : 'Oracle readings'

  if (remaining === 1) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        padding: '0.3rem 0.85rem', borderRadius: '9999px', marginBottom: '0.75rem',
        background: 'rgba(255,170,60,0.1)', border: '1px solid rgba(255,170,60,0.35)',
        color: '#ffaa3c', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em',
      }}>
        ⚠️ Last free {readingLabel} — unlock unlimited
      </div>
    )
  }

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
      padding: '0.3rem 0.85rem', borderRadius: '9999px', marginBottom: '0.75rem',
      background: 'rgba(255,200,80,0.1)', border: '1px solid rgba(255,200,80,0.3)',
      color: '#ffc850', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em',
    }}>
      ✨ {remaining} free {readingLabel} left
    </div>
  )
}
