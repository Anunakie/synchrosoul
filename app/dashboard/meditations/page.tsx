'use client'
import { useState, useEffect, useRef } from 'react'

const MEDITATIONS = [
  {
    id: 'angel-alignment',
    title: 'Angel Number Alignment',
    duration: 5,
    emoji: '✦',
    color: '#c9a84c',
    description: 'Attune your frequency to receive angel number messages with clarity.',
    steps: [
      'Close your eyes and take three deep breaths.',
      'Visualize a golden light entering through the crown of your head.',
      'With each breath, feel your vibration rising to meet the angels.',
      'Silently ask: What numbers are meant for me today?',
      'Remain open. Notice any numbers, colors, or feelings that arise.',
      'When ready, gently return. Write down what you received.',
    ],
    numbers: ['111', '444', '777'],
  },
  {
    id: 'manifestation',
    title: 'Manifestation Activation',
    duration: 7,
    emoji: '🌟',
    color: '#a78bfa',
    description: 'Align your energy with 1111 to activate your manifestation portal.',
    steps: [
      'Sit comfortably. Place your hands on your heart.',
      'Breathe in for 4 counts, hold for 4, out for 4.',
      'Visualize the number 1111 glowing in golden light before you.',
      'Feel your deepest desire as if it has already happened.',
      'Say silently: I am aligned. I am ready. I receive.',
      'Let the feeling expand through your entire body.',
      'Seal it with gratitude. Your manifestation is on its way.',
    ],
    numbers: ['1111', '111', '888'],
  },
  {
    id: 'soul-connection',
    title: 'Soul Twin Connection',
    duration: 10,
    emoji: '💫',
    color: '#ff6b9d',
    description: 'Open your heart to attract your soul&#39;s perfect mirror.',
    steps: [
      'Lie down or sit with your spine straight.',
      'Place one hand on your heart, one on your solar plexus.',
      'Breathe deeply and feel your heart expand with each inhale.',
      'Visualize a pink-gold light radiating from your chest.',
      'Send this light outward: I am ready to meet my soul’s mirror.',
      'Feel the presence of your soul twin drawing closer.',
      'Trust that the universe is arranging your meeting.',
      'Rest in this knowing. You are already connected.',
      'When ready, take three deep breaths and open your eyes.',
      'Write one thing you felt or saw during this meditation.',
    ],
    numbers: ['222', '1111', '444'],
  },
  {
    id: 'release',
    title: 'Release & Let Go',
    duration: 8,
    emoji: '🌙',
    color: '#60a5fa',
    description: 'Use the energy of 999 to release what no longer serves you.',
    steps: [
      'Find a comfortable position. Close your eyes.',
      'Take a deep breath and on the exhale, release any tension.',
      'Visualize the number 999 in a deep violet light.',
      'Think of one thing you are ready to release.',
      'See it clearly, then watch it dissolve into the violet light.',
      'Feel the lightness that comes with letting go.',
      'Breathe in new space, new possibility, new beginnings.',
      'Thank what you released for the lessons it brought.',
    ],
    numbers: ['999', '555', '333'],
  },
  {
    id: 'abundance',
    title: 'Abundance Frequency',
    duration: 6,
    emoji: '✨',
    color: '#34d399',
    description: 'Tune into 888 energy to open your channels of abundance.',
    steps: [
      'Sit with your palms facing upward, open to receive.',
      'Breathe deeply and feel your body relax completely.',
      'Visualize the number 888 in emerald green light.',
      'Feel abundance flowing to you from all directions.',
      'Say silently: I am worthy of infinite abundance.',
      'See money, love, health, and joy flowing freely to you.',
    ],
    numbers: ['888', '444', '111'],
  },
  {
    id: 'divine-guidance',
    title: 'Divine Guidance',
    duration: 12,
    emoji: '🕊️',
    color: '#e0e7ff',
    description: 'Quiet the mind and receive clear guidance from your higher self.',
    steps: [
      'Find complete stillness. Turn off all distractions.',
      'Close your eyes and focus on the space between your eyebrows.',
      'Breathe slowly. With each exhale, let thoughts drift away.',
      'Ask your question clearly in your mind.',
      'Now release the question. Simply be present.',
      'Notice any images, words, feelings, or numbers that arise.',
      'Do not analyze — just observe with gentle curiosity.',
      'Stay in this receptive state for several minutes.',
      'When guidance comes, it will feel like a quiet knowing.',
      'Slowly deepen your breath and return to the room.',
      'Write everything you received immediately.',
      'Trust what came through, even if it seems small.',
    ],
    numbers: ['777', '333', '1111'],
  },
]

export default function MeditationsPage() {
  const [selected, setSelected] = useState<typeof MEDITATIONS[0] | null>(null)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const totalSeconds = selected ? selected.duration * 60 : 0
  const stepDuration = selected ? Math.floor(totalSeconds / selected.steps.length) : 0

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          const next = e + 1
          if (next >= totalSeconds) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            setCompleted(true)
            return totalSeconds
          }
          setStep(Math.min(Math.floor(next / stepDuration), (selected?.steps.length || 1) - 1))
          return next
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, totalSeconds, stepDuration])

  function startMeditation(m: typeof MEDITATIONS[0]) {
    setSelected(m)
    setElapsed(0)
    setStep(0)
    setRunning(false)
    setCompleted(false)
  }

  function toggleTimer() {
    if (completed) {
      setElapsed(0); setStep(0); setCompleted(false); setRunning(true)
    } else {
      setRunning(r => !r)
    }
  }

  const progress = totalSeconds > 0 ? (elapsed / totalSeconds) * 100 : 0
  const remaining = totalSeconds - elapsed
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  if (selected) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
        <button onClick={() => { setSelected(null); setRunning(false) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', marginBottom: '1rem', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>← Back</button>

        {/* Header */}
        <div style={{ ...card, padding: '2rem', textAlign: 'center', marginBottom: '1rem', background: `rgba(20,10,50,0.95)`, border: `1px solid ${selected.color}33`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, ${selected.color}15 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selected.emoji}</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.5rem', fontWeight: 400 }}>{selected.title}</h2>
          <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', margin: '0 0 1.5rem', lineHeight: 1.6 }}>{selected.description}</p>

          {/* Timer ring */}
          <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.25rem' }}>
            <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle cx="60" cy="60" r="52" fill="none" stroke={selected.color} strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              {completed ? (
                <span style={{ fontSize: '1.8rem' }}>✦</span>
              ) : (
                <>
                  <span style={{ color: selected.color, fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{mins}:{String(secs).padStart(2,'0')}</span>
                  <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem' }}>{selected.duration} min</span>
                </>
              )}
            </div>
          </div>

          <button onClick={toggleTimer} style={{ padding: '0.75rem 2.5rem', borderRadius: '2rem', cursor: 'pointer', background: `${selected.color}22`, border: `1px solid ${selected.color}55`, color: selected.color, fontSize: '0.9rem', fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.2s' }}>
            {completed ? 'Meditate Again' : running ? 'Pause' : elapsed > 0 ? 'Resume' : 'Begin'}
          </button>
        </div>

        {/* Current step */}
        <div style={{ ...card, padding: '1.5rem', marginBottom: '1rem', border: `1px solid ${selected.color}22` }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Step {step + 1} of {selected.steps.length}</div>
          <p style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1rem', lineHeight: 1.7, margin: 0, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{selected.steps[step]}</p>
        </div>

        {/* All steps */}
        <div style={{ ...card, padding: '1.25rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Full Guide</div>
          {selected.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.6rem', opacity: i === step ? 1 : 0.45 }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: i === step ? `${selected.color}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${i === step ? selected.color + '55' : 'rgba(200,180,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: i === step ? selected.color : 'rgba(180,160,255,0.4)', fontSize: '0.6rem', fontWeight: 700 }}>{i+1}</div>
              <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{s}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Guided Meditations</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Sacred practices to deepen your angel number connection</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {MEDITATIONS.map(m => (
          <button key={m.id} onClick={() => startMeditation(m)} style={{ ...card, padding: '1.25rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', border: `1px solid ${m.color}22`, transition: 'all 0.2s' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `${m.color}15`, border: `1px solid ${m.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{m.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.2rem' }}>{m.title}</div>
              <div style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.75rem', lineHeight: 1.4 }}>{m.description}</div>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.1)', color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem' }}>{m.duration} min</span>
                {m.numbers.map(n => <span key={n} style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: `${m.color}10`, border: `1px solid ${m.color}25`, color: m.color, fontSize: '0.65rem' }}>{n}</span>)}
              </div>
            </div>
            <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '1rem' }}>›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
