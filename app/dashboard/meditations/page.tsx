'use client'
import { useState, useEffect } from 'react'
import { MEDITATIONS, getMeditationForNumber, Meditation } from '@/lib/meditations'
import { getLogs } from '@/lib/storage'

export default function MeditationsPage() {
  const [selected, setSelected] = useState<Meditation | null>(null)
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(0)
  const [recentNumbers, setRecentNumbers] = useState<string[]>([])

  useEffect(() => {
    const logs = getLogs()
    const nums = [...new Set(logs.slice(0, 20).map(l => l.number))].slice(0, 5)
    setRecentNumbers(nums)
  }, [])

  const allMeditations = Object.values(MEDITATIONS)
  const steps = selected ? ['intro', 'breathe', 'body', 'closing'] : []
  const stepContent = selected ? [selected.intro, `Breath pattern: ${selected.breathPattern}`, selected.body, selected.closing] : []
  const stepLabels = ['Prepare', 'Breathe', 'Journey', 'Return']
  const stepEmojis = ['🕯️', '🌬️', '🌌', '🌅']

  function startMeditation(m: Meditation) {
    setSelected(m)
    setStep(0)
    setPlaying(true)
  }

  function nextStep() {
    if (step < steps.length - 1) setStep(s => s + 1)
    else { setPlaying(false); setStep(0) }
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem 6rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧘</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', letterSpacing: '0.05em', margin: 0 }}>Guided Meditations</h1>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Attune to the frequency of your angel numbers</p>
      </div>

      {/* Active meditation player */}
      {selected && playing && (
        <div style={{ background: `${selected.color}11`, border: `1px solid ${selected.color}33`, borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.5rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {steps.map((_, i) => (
              <div key={i} style={{ width: i === step ? '1.5rem' : '0.5rem', height: '0.5rem', borderRadius: '9999px', background: i <= step ? selected.color : 'rgba(200,180,255,0.15)', transition: 'all 0.3s ease' }} />
            ))}
          </div>

          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{stepEmojis[step]}</div>
          <p style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>{stepLabels[step]}</p>
          <p style={{ color: 'rgba(220,200,255,0.9)', lineHeight: 1.9, fontSize: '0.95rem', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', marginBottom: '2rem' }}>{stepContent[step]}</p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button onClick={() => { setPlaying(false); setSelected(null) }} style={{ padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '9999px', color: 'rgba(200,180,255,0.4)', cursor: 'pointer', fontSize: '0.8rem' }}>End</button>
            <button onClick={nextStep} style={{ padding: '0.6rem 1.5rem', background: `${selected.color}22`, border: `1px solid ${selected.color}44`, borderRadius: '9999px', color: selected.color, cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              {step < steps.length - 1 ? 'Continue →' : 'Complete ✦'}
            </button>
          </div>
        </div>
      )}

      {/* Recommended from your numbers */}
      {recentNumbers.length > 0 && !playing && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: 'rgba(200,180,255,0.35)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>✦ Recommended for your recent numbers</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentNumbers.map(num => {
              const m = getMeditationForNumber(num)
              return (
                <button key={num} onClick={() => startMeditation(m)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', background: `${m.color}0d`, border: `1px solid ${m.color}33`, borderRadius: '1rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: `${m.color}22`, border: `1px solid ${m.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.8rem', color: m.color, fontWeight: 600 }}>{num}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{m.title}</div>
                    <div style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.75rem' }}>{m.duration} · {m.theme}</div>
                  </div>
                  <span style={{ color: m.color, fontSize: '1.1rem' }}>▶</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* All meditations */}
      {!playing && (
        <div>
          <p style={{ color: 'rgba(200,180,255,0.35)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>All meditations</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {allMeditations.map(m => (
              <button key={m.number} onClick={() => startMeditation(m)} style={{ padding: '1.25rem', background: `${m.color}0d`, border: `1px solid ${m.color}22`, borderRadius: '1rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: m.color, marginBottom: '0.4rem' }}>{m.number}</div>
                <div style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.8rem', marginBottom: '0.25rem', lineHeight: 1.3 }}>{m.title}</div>
                <div style={{ color: 'rgba(200,180,255,0.35)', fontSize: '0.7rem' }}>{m.duration}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
