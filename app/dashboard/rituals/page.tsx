'use client'
import { useState, useEffect } from 'react'

const RITUALS = [
  {
    id: 'morning-alignment',
    title: 'Morning Angel Alignment',
    emoji: '🌅',
    color: '#c9a84c',
    duration: '5 min',
    timing: 'Morning',
    description: 'Start your day attuned to angelic frequencies.',
    steps: [
      { action: 'Breathe', detail: 'Take 3 deep breaths before looking at your phone.' },
      { action: 'Set Intention', detail: 'Ask: What angel numbers will guide me today?' },
      { action: 'Affirm', detail: 'Say aloud: I am open to receiving divine messages.' },
      { action: 'Log', detail: 'Open SynchroSoul and log any numbers from your dreams.' },
      { action: 'Gratitude', detail: 'Name 3 things you are grateful for right now.' },
    ],
    numbers: ['111', '444', '777'],
  },
  {
    id: 'number-sighting',
    title: 'Number Sighting Ritual',
    emoji: '✦',
    color: '#a78bfa',
    duration: '2 min',
    timing: 'When you see a number',
    description: 'A sacred pause to honor each angel number sighting.',
    steps: [
      { action: 'Pause', detail: 'Stop what you are doing for 30 seconds.' },
      { action: 'Breathe', detail: 'Take one deep breath and close your eyes briefly.' },
      { action: 'Notice', detail: 'What were you thinking the moment before you saw it?' },
      { action: 'Receive', detail: 'Feel the message without analyzing it yet.' },
      { action: 'Log', detail: 'Record the number and your thought in SynchroSoul.' },
    ],
    numbers: ['any'],
  },
  {
    id: 'full-moon',
    title: 'Full Moon Release',
    emoji: '🌕',
    color: '#e0e7ff',
    duration: '15 min',
    timing: 'Full Moon night',
    description: 'Release what no longer serves you under the full moon.',
    steps: [
      { action: 'Prepare', detail: 'Find a quiet space. Light a candle if possible.' },
      { action: 'Write', detail: 'List 3 things you are ready to release on paper.' },
      { action: 'Meditate', detail: 'Hold the paper and visualize 999 in violet light.' },
      { action: 'Release', detail: 'Safely burn or tear the paper, saying: I release this with love.' },
      { action: 'Receive', detail: 'Write 3 things you are calling in to replace what you released.' },
      { action: 'Log', detail: 'Record any numbers that appeared during this ritual.' },
    ],
    numbers: ['999', '555', '333'],
  },
  {
    id: 'new-moon',
    title: 'New Moon Intention Setting',
    emoji: '🌑',
    color: '#60a5fa',
    duration: '10 min',
    timing: 'New Moon night',
    description: 'Plant seeds of intention in the fertile new moon energy.',
    steps: [
      { action: 'Cleanse', detail: 'Open a window. Take 5 deep breaths of fresh air.' },
      { action: 'Write', detail: 'Write your top 3 intentions for this lunar cycle.' },
      { action: 'Visualize', detail: 'See each intention as already fulfilled. Feel it.' },
      { action: 'Seal', detail: 'Draw the number 111 next to each intention.' },
      { action: 'Trust', detail: 'Say: I plant these seeds and trust the universe to grow them.' },
    ],
    numbers: ['111', '1111', '222'],
  },
  {
    id: 'sync-calling',
    title: 'Soul Twin Calling',
    emoji: '💫',
    color: '#ff6b9d',
    duration: '8 min',
    timing: 'Evening',
    description: 'Send a cosmic signal to your soul&#39;s perfect match.',
    steps: [
      { action: 'Ground', detail: 'Sit with both feet on the floor. Feel rooted.' },
      { action: 'Open', detail: 'Place your hand on your heart. Feel it beating.' },
      { action: 'Visualize', detail: 'See a golden thread extending from your heart outward.' },
      { action: 'Send', detail: 'Imagine your energy traveling along the thread to your match.' },
      { action: 'Receive', detail: 'Feel their energy returning to you. Notice any numbers.' },
      { action: 'Log', detail: 'Record any numbers, feelings, or images that came through.' },
    ],
    numbers: ['222', '1111', '444'],
  },
  {
    id: 'abundance-activation',
    title: 'Abundance Activation',
    emoji: '✨',
    color: '#34d399',
    duration: '7 min',
    timing: 'Anytime',
    description: 'Activate the 888 frequency to open your abundance channels.',
    steps: [
      { action: 'Align', detail: 'Stand tall. Roll your shoulders back. Breathe deeply.' },
      { action: 'Declare', detail: 'Say: I am a magnet for abundance in all forms.' },
      { action: 'Visualize', detail: 'See the number 888 glowing in golden-green light.' },
      { action: 'Feel', detail: 'Let the feeling of abundance fill every cell of your body.' },
      { action: 'Act', detail: 'Take one small action toward your abundance goal today.' },
    ],
    numbers: ['888', '444', '111'],
  },
]

export default function RitualsPage() {
  const [selected, setSelected] = useState<typeof RITUALS[0] | null>(null)
  const [completed, setCompleted] = useState<Record<string, boolean[]>>({})

  useEffect(() => {
    try {
      const saved = localStorage.getItem('synchrosoul_ritual_progress')
      if (saved) setCompleted(JSON.parse(saved))
    } catch {}
  }, [])

  function toggleStep(ritualId: string, stepIdx: number) {
    setCompleted(prev => {
      const ritual = prev[ritualId] || []
      const updated = [...ritual]
      updated[stepIdx] = !updated[stepIdx]
      const next = { ...prev, [ritualId]: updated }
      localStorage.setItem('synchrosoul_ritual_progress', JSON.stringify(next))
      return next
    })
  }

  function resetRitual(ritualId: string) {
    setCompleted(prev => {
      const next = { ...prev, [ritualId]: [] }
      localStorage.setItem('synchrosoul_ritual_progress', JSON.stringify(next))
      return next
    })
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  if (selected) {
    const steps = completed[selected.id] || []
    const doneCount = steps.filter(Boolean).length
    const allDone = doneCount === selected.steps.length
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', marginBottom: '1rem', fontFamily: 'inherit' }}>← Back</button>
        <div style={{ ...card, padding: '1.75rem', marginBottom: '1rem', border: `1px solid ${selected.color}33`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: `radial-gradient(circle, ${selected.color}15 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>{selected.emoji}</span>
            <div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'rgba(220,200,255,0.95)', margin: 0, fontWeight: 400 }}>{selected.title}</h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.1)', color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem' }}>{selected.timing}</span>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.1)', color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem' }}>{selected.duration}</span>
              </div>
            </div>
          </div>
          <p style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1rem' }}>{selected.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, height: '4px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)' }}>
              <div style={{ height: '100%', width: `${(doneCount / selected.steps.length) * 100}%`, background: `linear-gradient(90deg, ${selected.color}88, ${selected.color})`, borderRadius: '9999px', transition: 'width 0.3s ease' }} />
            </div>
            <span style={{ color: selected.color, fontSize: '0.75rem', fontWeight: 600 }}>{doneCount}/{selected.steps.length}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {selected.steps.map((step, i) => {
            const done = steps[i] || false
            return (
              <button key={i} onClick={() => toggleStep(selected.id, i)} style={{ ...card, padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'flex-start', gap: '0.875rem', border: done ? `1px solid ${selected.color}44` : '1px solid rgba(200,180,255,0.1)', background: done ? `${selected.color}0d` : 'rgba(8,6,28,0.88)', transition: 'all 0.2s' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: `1.5px solid ${done ? selected.color : 'rgba(200,180,255,0.2)'}`, background: done ? `${selected.color}22` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px', transition: 'all 0.2s' }}>
                  {done && <span style={{ color: selected.color, fontSize: '0.65rem' }}>✓</span>}
                </div>
                <div>
                  <div style={{ color: done ? selected.color : 'rgba(220,200,255,0.85)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem', transition: 'color 0.2s' }}>{step.action}</div>
                  <div style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.78rem', lineHeight: 1.5 }}>{step.detail}</div>
                </div>
              </button>
            )
          })}
        </div>

        {allDone && (
          <div style={{ ...card, padding: '1.25rem', textAlign: 'center', border: `1px solid ${selected.color}44`, background: `${selected.color}0d` }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>✦</div>
            <div style={{ color: selected.color, fontSize: '0.95rem', fontWeight: 600 }}>Ritual Complete</div>
            <div style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.78rem', marginTop: '0.25rem' }}>You have aligned with the cosmic frequency.</div>
            <button onClick={() => resetRitual(selected.id)} style={{ marginTop: '0.75rem', padding: '0.4rem 1rem', borderRadius: '2rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', fontFamily: 'inherit' }}>Reset</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Sacred Rituals</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Spiritual practices to deepen your angel number connection</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {RITUALS.map(r => {
          const steps = completed[r.id] || []
          const doneCount = steps.filter(Boolean).length
          const progress = (doneCount / r.steps.length) * 100
          return (
            <button key={r.id} onClick={() => setSelected(r)} style={{ ...card, padding: '1.25rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', border: `1px solid ${r.color}22`, transition: 'all 0.2s' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `${r.color}15`, border: `1px solid ${r.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{r.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.15rem' }}>{r.title}</div>
                <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', marginBottom: '0.4rem' }}>{r.timing} · {r.duration}</div>
                {doneCount > 0 && (
                  <div style={{ height: '3px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)' }}>
                    <div style={{ height: '100%', width: `${progress}%`, background: `${r.color}`, borderRadius: '9999px' }} />
                  </div>
                )}
              </div>
              <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '1rem', flexShrink: 0 }}>›</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
