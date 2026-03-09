'use client'
import { useState, useEffect, useRef } from 'react'

const PATTERNS = [
  { id: 'box', name: 'Box Breathing', desc: '4-4-4-4 — Calm & focus', color: '#60a5fa', number: '444', phases: [{label:'Inhale',dur:4},{label:'Hold',dur:4},{label:'Exhale',dur:4},{label:'Hold',dur:4}], rounds: 8, benefit: 'Reduces stress, improves focus, used by Navy SEALs' },
  { id: '478', name: '4-7-8 Breath', desc: '4-7-8 — Deep relaxation', color: '#a78bfa', number: '777', phases: [{label:'Inhale',dur:4},{label:'Hold',dur:7},{label:'Exhale',dur:8}], rounds: 4, benefit: 'Activates parasympathetic nervous system, aids sleep' },
  { id: 'angel', name: 'Angel Breath', desc: '5-5-5 — Spiritual alignment', color: '#fbbf24', number: '555', phases: [{label:'Inhale',dur:5},{label:'Hold',dur:5},{label:'Exhale',dur:5}], rounds: 9, benefit: 'Aligns chakras, opens intuition, connects to angelic realm' },
  { id: 'fire', name: 'Breath of Fire', desc: '1-0-1 — Energize & activate', color: '#fb923c', number: '111', phases: [{label:'Inhale',dur:1},{label:'Exhale',dur:1}], rounds: 30, benefit: 'Energizes the body, clears stagnant energy, activates solar plexus' },
  { id: 'coherent', name: 'Coherent Breath', desc: '5-5 — Heart coherence', color: '#34d399', number: '222', phases: [{label:'Inhale',dur:5},{label:'Exhale',dur:5}], rounds: 12, benefit: 'Creates heart-brain coherence, reduces anxiety, balances nervous system' },
  { id: 'abundance', name: 'Abundance Breath', desc: '8-8-8 — Prosperity activation', color: '#c9a84c', number: '888', phases: [{label:'Inhale',dur:8},{label:'Hold',dur:8},{label:'Exhale',dur:8}], rounds: 8, benefit: 'Opens abundance channels, activates solar plexus and heart chakras' },
]

export default function BreathworkPage() {
  const [selected, setSelected] = useState<typeof PATTERNS[0] | null>(null)
  const [running, setRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [round, setRound] = useState(0)
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  function startSession(p: typeof PATTERNS[0]) {
    setSelected(p)
    setPhaseIdx(0)
    setCountdown(p.phases[0].dur)
    setRound(1)
    setDone(false)
    setRunning(true)
    setProgress(0)
  }

  function stopSession() {
    setRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => {
    if (!running || !selected) return
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          // advance phase
          setPhaseIdx(pi => {
            const nextPi = (pi + 1) % selected.phases.length
            if (nextPi === 0) {
              setRound(r => {
                if (r >= selected.rounds) {
                  setRunning(false)
                  setDone(true)
                  return r
                }
                return r + 1
              })
            }
            setCountdown(selected.phases[nextPi].dur)
            return nextPi
          })
          return selected.phases[0].dur
        }
        return c - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [running, selected])

  useEffect(() => {
    if (!selected || !running) return
    const totalSecs = selected.phases.reduce((a, p) => a + p.dur, 0) * selected.rounds
    const elapsed = (round - 1) * selected.phases.reduce((a, p) => a + p.dur, 0) +
      selected.phases.slice(0, phaseIdx).reduce((a, p) => a + p.dur, 0) +
      (selected.phases[phaseIdx]?.dur - countdown)
    setProgress(Math.min(100, (elapsed / totalSecs) * 100))
  }, [countdown, phaseIdx, round, running, selected])

  const phase = selected?.phases[phaseIdx]
  const phaseColors: Record<string, string> = { Inhale: '#34d399', Hold: '#fbbf24', Exhale: '#60a5fa' }
  const phaseColor = phase ? (phaseColors[phase.label] || '#a78bfa') : '#a78bfa'
  const circleSize = phase?.label === 'Inhale' ? 160 : phase?.label === 'Exhale' ? 100 : 130

  if (selected && (running || done)) return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <button onClick={() => { stopSession(); setSelected(null); setDone(false) }} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1.5rem', padding: 0 }}>← Back</button>

      {done ? (
        <div style={{ ...card, padding: '2.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.5rem', fontWeight: 400 }}>Session Complete</h2>
          <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1.5rem' }}>{selected.rounds} rounds of {selected.name} complete. Take a moment to feel the shift in your energy.</p>
          <button onClick={() => startSession(selected)} style={{ padding: '0.75rem 2rem', borderRadius: '2rem', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', fontSize: '0.85rem', cursor: 'pointer', marginRight: '0.75rem' }}>Repeat</button>
          <button onClick={() => { setSelected(null); setDone(false) }} style={{ padding: '0.75rem 2rem', borderRadius: '2rem', border: '1px solid rgba(200,180,255,0.15)', background: 'transparent', color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', cursor: 'pointer' }}>Done</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>{selected.name}</div>
          <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.75rem', marginBottom: '2rem' }}>Round {round} of {selected.rounds}</div>

          {/* Animated circle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: circleSize + 'px', height: circleSize + 'px',
              borderRadius: '50%',
              background: phaseColor + '15',
              border: '2px solid ' + phaseColor + '60',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 40px ' + phaseColor + '30, 0 0 80px ' + phaseColor + '15',
              transition: 'all 1s ease',
            }}>
              <div style={{ color: phaseColor, fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{countdown}</div>
              <div style={{ color: phaseColor + 'cc', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.25rem' }}>{phase?.label}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ background: 'rgba(200,180,255,0.08)', borderRadius: '4px', height: '4px', marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: progress + '%', background: selected.color, borderRadius: '4px', transition: 'width 1s linear' }} />
          </div>

          {/* Phase indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            {selected.phases.map((p, i) => (
              <div key={i} style={{ padding: '0.3rem 0.75rem', borderRadius: '2rem', background: i === phaseIdx ? phaseColors[p.label] + '20' : 'rgba(200,180,255,0.05)', border: '1px solid ' + (i === phaseIdx ? phaseColors[p.label] + '50' : 'rgba(200,180,255,0.1)'), color: i === phaseIdx ? phaseColors[p.label] : 'rgba(180,160,255,0.3)', fontSize: '0.7rem', transition: 'all 0.3s' }}>{p.label} {p.dur}s</div>
            ))}
          </div>

          <button onClick={stopSession} style={{ padding: '0.75rem 2rem', borderRadius: '2rem', border: '1px solid rgba(244,114,182,0.3)', background: 'rgba(244,114,182,0.08)', color: '#f472b6', fontSize: '0.82rem', cursor: 'pointer' }}>Stop Session</button>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Breathwork</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Sacred breathing patterns aligned with angel numbers</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {PATTERNS.map(p => (
          <div key={p.id} style={{ ...card, padding: '1.25rem', borderColor: p.color + '20' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
              <div>
                <div style={{ color: p.color, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>{p.number}</div>
                <div style={{ color: 'rgba(220,200,255,0.9)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 400 }}>{p.name}</div>
                <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{p.desc}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {p.phases.map((ph, i) => (
                  <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: (phaseColors[ph.label] || '#a78bfa') + '15', border: '1px solid ' + (phaseColors[ph.label] || '#a78bfa') + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', color: phaseColors[ph.label] || '#a78bfa', fontSize: '0.6rem', fontWeight: 700 }}>{ph.dur}</div>
                ))}
              </div>
            </div>
            <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem', lineHeight: 1.5, margin: '0 0 0.875rem', fontStyle: 'italic' }}>{p.benefit}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.7rem' }}>{p.rounds} rounds · ~{Math.ceil(p.phases.reduce((a,ph)=>a+ph.dur,0)*p.rounds/60)} min</span>
              <button onClick={() => startSession(p)} style={{ padding: '0.45rem 1.25rem', borderRadius: '2rem', border: '1px solid ' + p.color + '40', background: p.color + '12', color: p.color, fontSize: '0.78rem', cursor: 'pointer' }}>Begin ▶</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
