'use client'
import { useState } from 'react'
import { getAllRituals, getRitualForNumber, saveRitualLog, Ritual } from '@/lib/rituals'

export default function RitualsPage() {
  const [selected, setSelected] = useState<Ritual | null>(null)
  const [activeStep, setActiveStep] = useState(-1)
  const [reflection, setReflection] = useState('')
  const [completed, setCompleted] = useState(false)
  const [filter, setFilter] = useState('all')

  const rituals = getAllRituals()
  const filters = ['all', 'New Moon', 'Full Moon', 'Any phase']
  const filtered = filter === 'all' ? rituals : rituals.filter(r => r.moonPhase === filter)

  function startRitual(r: Ritual) {
    setSelected(r)
    setActiveStep(0)
    setCompleted(false)
    setReflection('')
  }

  function completeRitual() {
    if (!selected) return
    saveRitualLog({
      ritualId: selected.id,
      completedAt: new Date().toISOString(),
      intention: selected.intention,
      reflection,
    })
    setCompleted(true)
  }

  if (selected && !completed) return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem 6rem' }}>
      <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(200,180,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1.5rem', padding: 0 }}>← Back to rituals</button>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selected.emoji}</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', margin: '0 0 0.5rem' }}>{selected.title}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(200,180,255,0.4)', letterSpacing: '0.1em' }}>⏱ {selected.duration}</span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(200,180,255,0.4)', letterSpacing: '0.1em' }}>🌙 {selected.moonPhase}</span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(200,180,255,0.4)', letterSpacing: '0.1em' }}>✦ {selected.number}</span>
        </div>
      </div>

      <div style={{ background: `${selected.color}11`, border: `1px solid ${selected.color}33`, borderRadius: '1rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', backdropFilter: 'blur(12px)' }}>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.4rem' }}>Intention</p>
        <p style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>{selected.intention}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {selected.steps.map((step, i) => (
          <div key={i} onClick={() => setActiveStep(i)} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1rem 1.25rem', background: activeStep === i ? `${selected.color}15` : 'rgba(8,6,28,0.75)', border: `1px solid ${activeStep === i ? selected.color + '44' : 'rgba(200,180,255,0.1)'}`, borderRadius: '1rem', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}>
            <div style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: i < activeStep ? selected.color : activeStep === i ? `${selected.color}33` : 'rgba(200,180,255,0.08)', border: `1px solid ${i <= activeStep ? selected.color : 'rgba(200,180,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', color: i < activeStep ? '#050510' : selected.color, fontWeight: 600 }}>
              {i < activeStep ? '✓' : i + 1}
            </div>
            <p style={{ color: i < activeStep ? 'rgba(200,180,255,0.4)' : 'rgba(220,200,255,0.85)', fontSize: '0.9rem', margin: 0, lineHeight: 1.6, textDecoration: i < activeStep ? 'line-through' : 'none' }}>{step}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {activeStep > 0 && <button onClick={() => setActiveStep(s => s - 1)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '9999px', color: 'rgba(200,180,255,0.5)', cursor: 'pointer', fontSize: '0.85rem' }}>← Previous</button>}
        {activeStep < selected.steps.length - 1
          ? <button onClick={() => setActiveStep(s => s + 1)} style={{ flex: 2, padding: '0.75rem', background: `${selected.color}22`, border: `1px solid ${selected.color}44`, borderRadius: '9999px', color: selected.color, cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Next Step →</button>
          : <button onClick={() => setActiveStep(selected.steps.length)} style={{ flex: 2, padding: '0.75rem', background: `${selected.color}22`, border: `1px solid ${selected.color}44`, borderRadius: '9999px', color: selected.color, cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Complete Ritual ✦</button>
        }
      </div>

      {activeStep >= selected.steps.length && (
        <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: '#c9a84c', fontStyle: 'italic', textAlign: 'center', marginBottom: '1rem' }}>{selected.affirmation}</p>
          <textarea value={reflection} onChange={e => setReflection(e.target.value)} placeholder="How do you feel? What came up during this ritual? (optional)" rows={3} style={{ width: '100%', background: 'rgba(200,180,255,0.05)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '1rem' }} />
          <button onClick={completeRitual} style={{ width: '100%', padding: '0.875rem', background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '9999px', color: '#c9a84c', cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.1em' }}>Seal the Ritual ✦</button>
        </div>
      )}
    </div>
  )

  if (completed) return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '4rem 1rem 6rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '1rem' }}>Ritual Complete</h2>
      <p style={{ color: 'rgba(200,180,255,0.6)', lineHeight: 1.8, marginBottom: '2rem' }}>Your intention has been set. The universe has received it. Trust the unfolding.</p>
      <button onClick={() => { setSelected(null); setCompleted(false) }} style={{ padding: '0.75rem 2rem', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '9999px', color: 'rgba(200,180,255,0.9)', cursor: 'pointer', fontSize: '0.85rem', letterSpacing: '0.05em' }}>Back to Rituals</button>
    </div>
  )

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem 6rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🕯️</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', letterSpacing: '0.05em', margin: 0 }}>Manifestation Rituals</h1>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Sacred practices aligned with your angel numbers</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.35rem 0.85rem', background: filter === f ? 'rgba(139,92,246,0.25)' : 'rgba(8,6,28,0.7)', border: `1px solid ${filter === f ? 'rgba(139,92,246,0.5)' : 'rgba(200,180,255,0.12)'}`, borderRadius: '9999px', color: filter === f ? 'rgba(200,180,255,0.9)' : 'rgba(200,180,255,0.4)', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.05em' }}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(r => (
          <button key={r.id} onClick={() => startRitual(r)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: `${r.color}0d`, border: `1px solid ${r.color}22`, borderRadius: '1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '2rem', flexShrink: 0 }}>{r.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: 500 }}>{r.title}</div>
              <div style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.78rem', marginBottom: '0.4rem' }}>{r.intention}</div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(200,180,255,0.35)' }}>⏱ {r.duration}</span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(200,180,255,0.35)' }}>🌙 {r.moonPhase}</span>
                <span style={{ fontSize: '0.7rem', color: r.color }}>✦ {r.number}</span>
              </div>
            </div>
            <span style={{ color: r.color, fontSize: '1.2rem', flexShrink: 0 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  )
}
