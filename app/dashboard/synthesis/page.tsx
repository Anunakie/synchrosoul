'use client'
import { useState, useEffect } from 'react'
import { generateWeeklySynthesis, WeeklySynthesis } from '@/lib/cosmic-synthesis'
import Link from 'next/link'

export default function SynthesisPage() {
  const [synthesis, setSynthesis] = useState<WeeklySynthesis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const s = generateWeeklySynthesis()
    setSynthesis(s)
    setLoading(false)
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(200,180,255,0.6)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', letterSpacing: '0.1em' }}>Reading the cosmos...</div>
    </div>
  )

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem 6rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌌</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', letterSpacing: '0.05em', margin: 0 }}>Weekly Cosmic Synthesis</h1>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.5rem' }}>{synthesis?.weekStart} — {synthesis?.weekEnd}</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Sightings', value: synthesis?.totalLogs || 0, emoji: '👁️' },
          { label: 'Dominant', value: synthesis?.dominantNumber || '—', emoji: '✦' },
          { label: 'Verified', value: synthesis?.verifiedCount || 0, emoji: '✅' },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1rem', padding: '1rem', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{stat.emoji}</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#c9a84c', fontWeight: 300 }}>{stat.value}</div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(200,180,255,0.4)', marginTop: '0.2rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Cosmic Story */}
      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.1rem' }}>📖</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#c9a84c', letterSpacing: '0.05em' }}>Your Cosmic Story</span>
        </div>
        <p style={{ color: 'rgba(220,200,255,0.85)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0, fontStyle: 'italic' }}>{synthesis?.cosmicStory}</p>
      </div>

      {/* Number Patterns */}
      {synthesis && synthesis.patterns.length > 0 && (
        <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.1rem' }}>✦</span>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.9)', letterSpacing: '0.05em' }}>Number Patterns</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {synthesis.patterns.map((p, i) => (
              <div key={p.number} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: `${p.color}22`, border: `1px solid ${p.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.85rem', color: p.color, fontWeight: 600 }}>{p.number}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.85rem' }}>{p.keyword}</span>
                    <span style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.75rem' }}>{p.count}x</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(200,180,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (p.count / (synthesis.patterns[0]?.count || 1)) * 100)}%`, background: p.color, borderRadius: '2px', transition: 'width 1s ease' }} />
                  </div>
                </div>
                {i === 0 && <span style={{ fontSize: '0.7rem', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>Dominant</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insight */}
      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1.25rem', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.1rem' }}>💡</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.9)', letterSpacing: '0.05em' }}>Soul Insight</span>
        </div>
        <p style={{ color: 'rgba(200,180,255,0.75)', lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>{synthesis?.insight}</p>
      </div>

      {/* Affirmation */}
      <div style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(139,92,246,0.08))', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '1.25rem', padding: '1.5rem', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>🙏</div>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', color: '#c9a84c', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>{synthesis?.affirmation}</p>
      </div>

      {/* No logs state */}
      {synthesis && synthesis.totalLogs === 0 && (
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/dashboard" style={{ display: 'inline-block', padding: '0.75rem 2rem', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '9999px', color: 'rgba(200,180,255,0.9)', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Start Logging Numbers →</Link>
        </div>
      )}
    </div>
  )
}
