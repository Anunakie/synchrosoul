'use client'
import { useState, useEffect, useRef } from 'react'

const FREQUENCIES = [
  { hz: 174, name: 'Foundation', color: '#ef4444', emoji: '🔴', angelNumber: '174', benefit: 'Reduces pain & stress. Gives organs a sense of security and love.', chakra: 'Root', affirmation: 'I am safe. I am grounded. I am supported.' },
  { hz: 285, name: 'Quantum Cognition', color: '#f97316', emoji: '🟠', angelNumber: '285', benefit: 'Heals tissues and organs. Sends a message to restructure damaged fields.', chakra: 'Sacral', affirmation: 'I am whole. My body heals with ease.' },
  { hz: 396, name: 'Liberation', color: '#eab308', emoji: '🟡', angelNumber: '396', benefit: 'Liberates guilt and fear. Turns grief into joy.', chakra: 'Root', affirmation: 'I release fear. I am free from guilt.' },
  { hz: 417, name: 'Transmutation', color: '#84cc16', emoji: '💚', angelNumber: '417', benefit: 'Undoes situations and facilitates change. Clears traumatic experiences.', chakra: 'Sacral', affirmation: 'I welcome change. I release the past.' },
  { hz: 528, name: 'Miracle Tone', color: '#22c55e', emoji: '✨', angelNumber: '528', benefit: 'DNA repair. Transformation and miracles. Increases life energy.', chakra: 'Solar Plexus', affirmation: 'I am a miracle. Love flows through every cell.' },
  { hz: 639, name: 'Connection', color: '#06b6d4', emoji: '💙', angelNumber: '639', benefit: 'Reconnecting and balancing relationships. Enhances communication.', chakra: 'Heart', affirmation: 'I attract loving, harmonious relationships.' },
  { hz: 741, name: 'Awakening', color: '#6366f1', emoji: '💜', angelNumber: '741', benefit: 'Awakening intuition. Solving problems. Cleansing infections.', chakra: 'Throat', affirmation: 'I speak my truth. My intuition guides me.' },
  { hz: 852, name: 'Spiritual Order', color: '#8b5cf6', emoji: '🔮', angelNumber: '852', benefit: 'Returning to spiritual order. Awakening inner strength.', chakra: 'Third Eye', affirmation: 'I see clearly. I trust divine order.' },
  { hz: 963, name: 'Divine Consciousness', color: '#c9a84c', emoji: '👑', angelNumber: '963', benefit: 'Connects to higher self and divine consciousness. Pure miracle tone.', chakra: 'Crown', affirmation: 'I am one with the universe. I am divine.' },
]

export default function SolfeggioPage() {
  const [playing, setPlaying] = useState<number | null>(null)
  const [volume, setVolume] = useState(0.4)
  const [duration, setDuration] = useState(300)
  const [timeLeft, setTimeLeft] = useState(0)
  const [sessions, setSessions] = useState<Record<number, number>>({})
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('synchrosoul_solfeggio_sessions') || '{}')
    setSessions(s)
    return () => stopTone()
  }, [])

  function stopTone() {
    if (timerRef.current) clearInterval(timerRef.current)
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.3)
    }
    setTimeout(() => {
      oscillatorRef.current?.stop()
      oscillatorRef.current?.disconnect()
      oscillatorRef.current = null
    }, 500)
    setPlaying(null)
    setTimeLeft(0)
  }

  function playTone(hz: number) {
    if (playing === hz) { stopTone(); return }
    stopTone()
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioCtxRef.current = ctx
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(hz, ctx.currentTime)
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.setTargetAtTime(volume, ctx.currentTime, 0.5)
    osc.start()
    oscillatorRef.current = osc
    gainRef.current = gain
    setPlaying(hz)
    setTimeLeft(duration)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopTone()
          const s = JSON.parse(localStorage.getItem('synchrosoul_solfeggio_sessions') || '{}')
          s[hz] = (s[hz] || 0) + 1
          localStorage.setItem('synchrosoul_solfeggio_sessions', JSON.stringify(s))
          setSessions({...s})
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Solfeggio Frequencies</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.25rem' }}>Ancient healing tones. Tap to play. Tap again to stop.</p>

      {/* Controls */}
      <div style={{ ...card, padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '140px' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Volume</div>
          <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => setVolume(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#a78bfa' }} />
        </div>
        <div style={{ flex: 1, minWidth: '140px' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Duration: {Math.floor(duration/60)}m {duration%60}s</div>
          <input type="range" min="60" max="1800" step="60" value={duration} onChange={e => setDuration(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#a78bfa' }} />
        </div>
        {playing && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#c9a84c', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{mins}:{secs.toString().padStart(2,'0')}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem' }}>remaining</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {FREQUENCIES.map(f => {
          const isPlaying = playing === f.hz
          return (
            <button key={f.hz} onClick={() => playTone(f.hz)}
              style={{ ...card, padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%',
                border: isPlaying ? `1px solid ${f.color}66` : '1px solid rgba(200,180,255,0.1)',
                background: isPlaying ? `radial-gradient(ellipse at 0% 50%, ${f.color}15 0%, rgba(8,6,28,0.95) 70%)` : 'rgba(8,6,28,0.88)',
                transition: 'all 0.3s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${f.color}18`, border: `1px solid ${f.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
                  boxShadow: isPlaying ? `0 0 16px ${f.color}55` : 'none', transition: 'box-shadow 0.3s' }} >
                  {isPlaying ? '⏸' : f.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                    <span style={{ color: f.color, fontSize: '1rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{f.hz} Hz</span>
                    <span style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.82rem' }}>{f.name}</span>
                    <span style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.65rem', marginLeft: 'auto' }}>{f.chakra}</span>
                  </div>
                  <div style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.72rem', lineHeight: 1.5 }}>{f.benefit}</div>
                  {isPlaying && <div style={{ color: f.color, fontSize: '0.72rem', marginTop: '0.3rem', fontStyle: 'italic' }}>“{f.affirmation}”</div>}
                </div>
                {sessions[f.hz] > 0 && (
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ color: f.color, fontSize: '0.85rem', fontWeight: 700 }}>{sessions[f.hz]}</div>
                    <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.55rem' }}>sessions</div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
