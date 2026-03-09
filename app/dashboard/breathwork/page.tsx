'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

const EXERCISES = [
  {
    id: 'box', name: 'Box Breathing', emoji: '□',
    description: 'Used by Navy SEALs to calm the nervous system instantly.',
    color: '#6366f1', rounds: 4,
    phases: [
      { label: 'Inhale', duration: 4, instruction: 'Breathe in slowly through your nose' },
      { label: 'Hold', duration: 4, instruction: 'Hold gently at the top' },
      { label: 'Exhale', duration: 4, instruction: 'Release slowly through your mouth' },
      { label: 'Hold', duration: 4, instruction: 'Rest at the bottom' },
    ],
    angelNumber: '444',
    benefit: 'Reduces stress, improves focus, balances nervous system',
  },
  {
    id: '478', name: '4-7-8 Breathing', emoji: '🌙',
    description: 'Dr. Weil’s relaxation technique. Fall asleep in minutes.',
    color: '#8b5cf6', rounds: 4,
    phases: [
      { label: 'Inhale', duration: 4, instruction: 'Breathe in quietly through your nose' },
      { label: 'Hold', duration: 7, instruction: 'Hold your breath completely' },
      { label: 'Exhale', duration: 8, instruction: 'Exhale completely through your mouth' },
    ],
    angelNumber: '478',
    benefit: 'Promotes sleep, reduces anxiety, lowers heart rate',
  },
  {
    id: 'coherent', name: 'Coherent Breathing', emoji: '❤',
    description: 'Synchronize heart and breath for deep coherence.',
    color: '#f472b6', rounds: 6,
    phases: [
      { label: 'Inhale', duration: 5, instruction: 'Breathe in smoothly and evenly' },
      { label: 'Exhale', duration: 5, instruction: 'Breathe out smoothly and evenly' },
    ],
    angelNumber: '555',
    benefit: 'Heart coherence, emotional balance, intuition',
  },
  {
    id: 'energize', name: 'Energizing Breath', emoji: '⚡',
    description: 'Kundalini-inspired breath of fire to raise your vibration.',
    color: '#fb923c', rounds: 3,
    phases: [
      { label: 'Inhale', duration: 2, instruction: 'Quick sharp inhale through nose' },
      { label: 'Exhale', duration: 2, instruction: 'Forceful exhale through nose' },
    ],
    angelNumber: '333',
    benefit: 'Increases energy, clears mind, raises vibration',
  },
  {
    id: 'angel', name: 'Angel Number Breath', emoji: '✦',
    description: 'Breathe in cycles of 1-1-1-1 to align with divine frequency.',
    color: '#c9a84c', rounds: 11,
    phases: [
      { label: 'Inhale', duration: 3, instruction: 'Breathe in divine light' },
      { label: 'Hold', duration: 3, instruction: 'Receive the message' },
      { label: 'Exhale', duration: 3, instruction: 'Release what no longer serves' },
      { label: 'Rest', duration: 3, instruction: 'Rest in the void' },
    ],
    angelNumber: '1111',
    benefit: 'Spiritual alignment, intuition, angelic connection',
  },
]

export default function BreathworkPage() {
  const [selected, setSelected] = useState<typeof EXERCISES[0] | null>(null)
  const [running, setRunning] = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [round, setRound] = useState(1)
  const [timeLeft, setTimeLeft] = useState(0)
  const [done, setDone] = useState(false)
  const [totalSessions, setTotalSessions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const s = parseInt(localStorage.getItem('synchrosoul_breathwork_sessions') || '0')
    setTotalSessions(s)
  }, [])

  const stopSession = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setRunning(false)
  }, [])

  useEffect(() => {
    if (!running || !selected) return
    const phase = selected.phases[phaseIdx]
    setTimeLeft(phase.duration)
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current!)
          // Move to next phase
          const nextPhase = phaseIdx + 1
          if (nextPhase >= selected.phases.length) {
            const nextRound = round + 1
            if (nextRound > selected.rounds) {
              setRunning(false)
              setDone(true)
              const s = parseInt(localStorage.getItem('synchrosoul_breathwork_sessions') || '0') + 1
              localStorage.setItem('synchrosoul_breathwork_sessions', String(s))
              setTotalSessions(s)
              return 0
            }
            setRound(nextRound)
            setPhaseIdx(0)
          } else {
            setPhaseIdx(nextPhase)
          }
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, phaseIdx, round, selected])

  function startSession(ex: typeof EXERCISES[0]) {
    setSelected(ex)
    setPhaseIdx(0)
    setRound(1)
    setDone(false)
    setRunning(true)
    setTimeLeft(ex.phases[0].duration)
  }

  function reset() {
    stopSession()
    setPhaseIdx(0)
    setRound(1)
    setDone(false)
    setTimeLeft(0)
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  // Active session view
  if (selected && (running || done)) {
    const phase = selected.phases[phaseIdx]
    const totalDuration = phase?.duration || 1
    const progress = done ? 1 : (totalDuration - timeLeft) / totalDuration
    const circumference = 2 * Math.PI * 70

    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1rem 2rem', textAlign: 'center' }}>
        <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'inherit' }}>← Back</button>

        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(220,200,255,0.9)', margin: '0 0 0.25rem', fontWeight: 400 }}>{selected.name}</h2>
        <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.75rem', marginBottom: '2rem' }}>Round {Math.min(round, selected.rounds)} of {selected.rounds}</div>

        {done ? (
          <div style={{ ...card, padding: '2.5rem', border: `1px solid ${selected.color}44` }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: selected.color, marginBottom: '0.5rem' }}>Session Complete</div>
            <div style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>{selected.rounds} rounds • {selected.benefit}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem', marginBottom: '1.5rem' }}>Angel number activated: <span style={{ color: selected.color, fontWeight: 700 }}>{selected.angelNumber}</span></div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => startSession(selected)} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer', background: `${selected.color}18`, border: `1px solid ${selected.color}44`, color: selected.color, fontSize: '0.85rem', fontFamily: 'inherit', fontWeight: 600 }}>Repeat</button>
              <button onClick={reset} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.1)', color: 'rgba(180,160,255,0.6)', fontSize: '0.85rem', fontFamily: 'inherit' }}>Choose Another</button>
            </div>
          </div>
        ) : (
          <div>
            {/* Breathing circle */}
            <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 2rem' }}>
              <svg width="180" height="180" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle cx="90" cy="90" r="70" fill="none" stroke={selected.color} strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.9s linear', filter: `drop-shadow(0 0 8px ${selected.color}88)` }}
                />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: selected.color, fontSize: '2.5rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, lineHeight: 1 }}>{timeLeft}</div>
                <div style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.75rem', marginTop: '0.25rem' }}>seconds</div>
              </div>
            </div>

            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: selected.color, marginBottom: '0.5rem', fontWeight: 400 }}>{phase?.label}</div>
            <div style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.85rem', marginBottom: '2rem' }}>{phase?.instruction}</div>

            <button onClick={stopSession} style={{ padding: '0.65rem 2rem', borderRadius: '2rem', cursor: 'pointer', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '0.82rem', fontFamily: 'inherit' }}>Stop</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Breathwork</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Breathe with intention. Align with the divine.</p>
        </div>
        {totalSessions > 0 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#a78bfa', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{totalSessions}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sessions</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {EXERCISES.map(ex => (
          <button
            key={ex.id}
            onClick={() => startSession(ex)}
            style={{ ...card, padding: '1.25rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', border: `1px solid ${ex.color}22`, transition: 'all 0.2s', display: 'block', width: '100%' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${ex.color}18`, border: `1px solid ${ex.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{ex.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.92rem', fontWeight: 600 }}>{ex.name}</span>
                  <span style={{ color: ex.color, fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '2rem', background: `${ex.color}15`, border: `1px solid ${ex.color}33` }}>{ex.angelNumber}</span>
                </div>
                <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem', marginBottom: '0.3rem' }}>{ex.description}</div>
                <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.68rem' }}>{ex.rounds} rounds • {ex.phases.map(p => p.duration).join('-')} pattern</div>
              </div>
              <span style={{ color: ex.color, fontSize: '1.2rem', flexShrink: 0 }}>▶</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
