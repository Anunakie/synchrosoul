'use client'
import { useState, useEffect, useRef } from 'react'

const KEY = 'synchrosoul_meditation_log'

const MEDITATIONS = [
  {
    id: 'angel-number-activation',
    name: 'Angel Number Activation',
    emoji: '✨',
    duration: 5,
    color: '#a78bfa',
    category: 'activation',
    description: 'Connect deeply with the angel numbers appearing in your life and receive their full message.',
    script: [
      { time: 0, text: 'Close your eyes and take three slow, deep breaths. Let your body relax completely.' },
      { time: 30, text: 'Bring to mind the angel number you have been seeing. See it glowing in golden light before you.' },
      { time: 60, text: 'Feel the vibration of this number in your chest. It carries a message specifically for you.' },
      { time: 90, text: 'Ask silently: What do you want me to know? Then simply listen. Receive without judgment.' },
      { time: 150, text: 'Feel gratitude for this divine communication. You are seen, guided, and deeply loved.' },
      { time: 240, text: 'Slowly bring your awareness back. Wiggle your fingers. When ready, open your eyes.' },
    ],
    benefits: ['Number connection', 'Intuitive downloads', 'Spiritual clarity'],
    angelNumbers: ['1111', '444', '777'],
  },
  {
    id: 'morning-light',
    name: 'Morning Light Activation',
    emoji: '🌅',
    duration: 7,
    color: '#f59e0b',
    category: 'morning',
    description: 'Begin your day by filling every cell of your body with golden divine light and clear intention.',
    script: [
      { time: 0, text: 'Sit comfortably. Spine tall. Hands resting open on your knees. Close your eyes.' },
      { time: 20, text: 'Imagine a golden sun above your head. With each breath, it grows brighter and warmer.' },
      { time: 60, text: 'On your next inhale, draw this golden light down through the crown of your head.' },
      { time: 100, text: 'Feel it filling your mind with clarity, your heart with love, your body with vitality.' },
      { time: 160, text: 'Set your intention for today. Say it silently three times with full feeling.' },
      { time: 220, text: 'You are a vessel of light. Everything you touch today is blessed. Open your eyes.' },
    ],
    benefits: ['Mental clarity', 'Energetic protection', 'Intentional living'],
    angelNumbers: ['111', '333', '888'],
  },
  {
    id: 'heart-opening',
    name: 'Heart Opening',
    emoji: '💚',
    duration: 10,
    color: '#34d399',
    category: 'healing',
    description: 'Gently dissolve walls around your heart and expand your capacity to give and receive love.',
    script: [
      { time: 0, text: 'Lie down or sit comfortably. Place both hands on your heart center.' },
      { time: 30, text: 'Feel the warmth of your own hands. Your heart is safe. You are safe.' },
      { time: 80, text: 'With each inhale, breathe in rose-pink light. With each exhale, release any grief or armor.' },
      { time: 150, text: 'Think of someone you love unconditionally. Feel that love expand in your chest.' },
      { time: 240, text: 'Now direct that same love toward yourself. You deserve it just as much.' },
      { time: 360, text: 'Expand this love outward — to your home, your city, the whole world. You are love itself.' },
      { time: 540, text: 'Rest here. Breathing. Loving. Being. When ready, gently open your eyes.' },
    ],
    benefits: ['Emotional healing', 'Self-love', 'Compassion'],
    angelNumbers: ['444', '222', '666'],
  },
  {
    id: 'manifestation-portal',
    name: 'Manifestation Portal',
    emoji: '🌌',
    duration: 12,
    color: '#e879f9',
    category: 'manifestation',
    description: 'Enter a deep meditative state to plant your desires directly into the quantum field.',
    script: [
      { time: 0, text: 'Find a comfortable position. Close your eyes. Take 5 deep breaths to arrive fully.' },
      { time: 40, text: 'Imagine you are standing before a shimmering portal of violet light. It pulses with possibility.' },
      { time: 100, text: 'Step through the portal. On the other side, your desires already exist as reality.' },
      { time: 180, text: 'See yourself living your dream life. What do you see? What do you feel? Make it vivid.' },
      { time: 280, text: 'Feel the emotions of this reality — the joy, the gratitude, the peace. Let it fill every cell.' },
      { time: 400, text: 'Know that this is real. The universe is already rearranging itself to match this vision.' },
      { time: 520, text: 'Step back through the portal, carrying this feeling with you. It is done. It is done. It is done.' },
      { time: 680, text: 'Slowly return. Wiggle your fingers and toes. Open your eyes when ready.' },
    ],
    benefits: ['Manifestation power', 'Visualization', 'Quantum alignment'],
    angelNumbers: ['1111', '888', '333'],
  },
  {
    id: 'chakra-scan',
    name: 'Full Chakra Scan',
    emoji: '🌀',
    duration: 15,
    color: '#c9a84c',
    category: 'healing',
    description: 'A complete journey through all seven chakras, clearing, balancing, and activating each one.',
    script: [
      { time: 0, text: 'Sit with spine straight. Close your eyes. Take 3 grounding breaths.' },
      { time: 30, text: 'Root Chakra: Breathe red light into the base of your spine. Feel safe, grounded, supported.' },
      { time: 90, text: 'Sacral Chakra: Breathe orange light into your lower belly. Feel creative, fluid, alive.' },
      { time: 150, text: 'Solar Plexus: Breathe yellow light into your upper belly. Feel powerful, confident, worthy.' },
      { time: 210, text: 'Heart Chakra: Breathe green light into your chest. Feel loving, open, connected.' },
      { time: 280, text: 'Throat Chakra: Breathe blue light into your throat. Feel expressive, honest, heard.' },
      { time: 350, text: 'Third Eye: Breathe indigo light between your brows. Feel intuitive, clear, wise.' },
      { time: 420, text: 'Crown Chakra: Breathe violet light into the top of your head. Feel connected to all that is.' },
      { time: 500, text: 'See all seven chakras spinning in perfect harmony — a rainbow pillar of light through your body.' },
      { time: 600, text: 'Rest in this wholeness. You are complete. You are aligned. You are divine.' },
      { time: 840, text: 'Slowly return to the room. Take a deep breath. Open your eyes.' },
    ],
    benefits: ['Energy alignment', 'Emotional balance', 'Full body healing'],
    angelNumbers: ['777', '333', '1111'],
  },
  {
    id: 'sleep-surrender',
    name: 'Sleep Surrender',
    emoji: '🌙',
    duration: 10,
    color: '#60a5fa',
    category: 'evening',
    description: 'Release the day completely and drift into deep, healing, dream-filled sleep.',
    script: [
      { time: 0, text: 'Lie down. Let your body sink into the bed. You have done enough today.' },
      { time: 30, text: 'Starting from your feet, consciously relax every muscle. Work slowly upward.' },
      { time: 90, text: 'Release your legs. Release your belly. Release your chest. Release your shoulders.' },
      { time: 150, text: 'Release your jaw. Release your eyes. Release your forehead. Completely let go.' },
      { time: 220, text: 'Imagine a gentle wave of silver moonlight washing over you from head to toe.' },
      { time: 300, text: 'Any worries, any thoughts — place them in a bubble and watch them float away.' },
      { time: 400, text: 'Set an intention for your dreams: Show me what I need to know. Then surrender.' },
      { time: 500, text: 'You are safe. You are loved. The universe watches over you as you sleep.' },
      { time: 580, text: 'Let yourself drift... deeper... and deeper... into peaceful, healing sleep.' },
    ],
    benefits: ['Deep sleep', 'Dream activation', 'Nervous system reset'],
    angelNumbers: ['444', '999', '222'],
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✦' },
  { id: 'morning', label: 'Morning', emoji: '🌅' },
  { id: 'evening', label: 'Evening', emoji: '🌙' },
  { id: 'healing', label: 'Healing', emoji: '💚' },
  { id: 'manifestation', label: 'Manifest', emoji: '🌌' },
  { id: 'activation', label: 'Activation', emoji: '✨' },
]

interface MeditationLog {
  id: number
  meditationId: string
  duration: number
  completedAt: string
}

export default function MeditationsPage() {
  const [logs, setLogs] = useState<MeditationLog[]>([])
  const [category, setCategory] = useState('all')
  const [active, setActive] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [scriptIndex, setScriptIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    const s = localStorage.getItem(KEY)
    if (s) setLogs(JSON.parse(s))
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  function startMeditation(id: string) {
    setActive(id)
    setElapsed(0)
    setScriptIndex(0)
    setCompleted(false)
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      const e = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setElapsed(e)
      const med = MEDITATIONS.find(m => m.id === id)!
      const nextIdx = med.script.filter(s => s.time <= e).length - 1
      setScriptIndex(Math.max(0, nextIdx))
      if (e >= med.duration * 60) {
        clearInterval(intervalRef.current!)
        setCompleted(true)
        const log: MeditationLog = { id: Date.now(), meditationId: id, duration: med.duration, completedAt: new Date().toISOString() }
        const next = [log, ...logs]
        setLogs(next)
        localStorage.setItem(KEY, JSON.stringify(next))
      }
    }, 1000)
  }

  function stopMeditation() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setActive(null)
    setCompleted(false)
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const filtered = category === 'all' ? MEDITATIONS : MEDITATIONS.filter(m => m.category === category)
  const activeMed = MEDITATIONS.find(m => m.id === active)
  const totalMinutes = logs.reduce((a, l) => a + l.duration, 0)
  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  if (active && activeMed) {
    const progress = Math.min((elapsed / (activeMed.duration * 60)) * 100, 100)
    const currentScript = activeMed.script[scriptIndex]
    const circumference = 2 * Math.PI * 54
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', justifyContent: 'center' }}>
        {/* Timer ring */}
        <div style={{ position: 'relative', width: '140px', height: '140px', marginBottom: '2rem' }}>
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="70" cy="70" r="54" fill="none" stroke={activeMed.color} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progress / 100)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{activeMed.emoji}</div>
            <div style={{ color: activeMed.color, fontSize: '1rem', fontWeight: 700 }}>{formatTime(elapsed)}</div>
          </div>
        </div>

        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.5rem', textAlign: 'center', fontWeight: 400 }}>{activeMed.name}</h2>
        <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.78rem', margin: '0 0 2rem' }}>{activeMed.duration} min · {Math.round(progress)}% complete</p>

        {/* Current guidance */}
        <div style={{ ...card, padding: '1.5rem', marginBottom: '2rem', textAlign: 'center', borderColor: `${activeMed.color}33`, minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <p style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.95rem', margin: 0, lineHeight: 1.7, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>&ldquo;{currentScript?.text}&rdquo;</p>
        </div>

        {completed ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✨</div>
            <p style={{ color: '#c9a84c', fontSize: '1rem', marginBottom: '1.5rem', fontFamily: 'Cormorant Garamond, serif' }}>Meditation Complete</p>
            <button onClick={stopMeditation} style={{ padding: '0.75rem 2rem', borderRadius: '2rem', background: `linear-gradient(135deg, ${activeMed.color}88, ${activeMed.color})`, border: 'none', color: 'white', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>Return ✦</button>
          </div>
        ) : (
          <button onClick={stopMeditation} style={{ padding: '0.65rem 1.5rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.15)', color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', cursor: 'pointer' }}>End Session</button>
        )}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Guided Meditations</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{logs.length} sessions · {totalMinutes} minutes of practice</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Sessions', value: logs.length, emoji: '🧘', color: '#a78bfa' },
          { label: 'Minutes', value: totalMinutes, emoji: '⏱', color: '#c9a84c' },
          { label: 'This Week', value: logs.filter(l => new Date(l.completedAt) > new Date(Date.now() - 7*86400000)).length, emoji: '🔥', color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{s.emoji}</div>
            <div style={{ color: s.color, fontSize: '1.2rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem', marginBottom: '1.25rem' }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{ flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: '2rem', border: category === c.id ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: category === c.id ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: category === c.id ? '#a78bfa' : 'rgba(180,160,255,0.45)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>{c.emoji} {c.label}</button>
        ))}
      </div>

      {/* Meditation cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(med => {
          const count = logs.filter(l => l.meditationId === med.id).length
          return (
            <div key={med.id} style={{ ...card, padding: '1.25rem', borderColor: `${med.color}22` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '0.875rem', background: `${med.color}18`, border: `1px solid ${med.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{med.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                    <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.95rem', fontWeight: 600 }}>{med.name}</div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                      <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: `${med.color}12`, border: `1px solid ${med.color}25`, color: med.color, fontSize: '0.65rem' }}>{med.duration} min</span>
                      {count > 0 && <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c', fontSize: '0.65rem' }}>{count}x</span>}
                    </div>
                  </div>
                  <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.8rem', margin: '0 0 0.75rem', lineHeight: 1.5 }}>{med.description}</p>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                    {med.benefits.map(b => <span key={b} style={{ padding: '0.15rem 0.45rem', borderRadius: '2rem', background: `${med.color}0d`, border: `1px solid ${med.color}20`, color: med.color, fontSize: '0.65rem' }}>{b}</span>)}
                  </div>
                  <button onClick={() => startMeditation(med.id)} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.875rem', background: `linear-gradient(135deg, ${med.color}66, ${med.color}cc)`, border: 'none', color: 'white', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, letterSpacing: '0.03em' }}>Begin Meditation ▶</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
