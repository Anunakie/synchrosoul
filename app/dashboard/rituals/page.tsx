'use client'
import { useState, useEffect } from 'react'

interface Ritual {
  id: string
  number: string
  title: string
  duration: string
  timing: string
  steps: string[]
  intention: string
  materials: string[]
  emoji: string
  color: string
  completed?: boolean
  completedAt?: string
}

const ALL_RITUALS: Ritual[] = [
  {
    id: 'r111', number: '111', title: 'New Moon Manifestation', duration: '11 min', timing: 'Morning or at 1:11',
    emoji: '🌟', color: '#fbbf24',
    intention: 'Plant seeds of your deepest desires into the fertile field of new beginnings.',
    materials: ['A candle (white or gold)', 'Paper and pen', 'A quiet space'],
    steps: [
      'Light your candle and sit comfortably. Take 3 deep breaths.',
      'Write "I AM" at the top of your paper. Below it, write 11 things you are calling in — as if already true.',
      'Read each statement aloud with conviction. Feel the truth of each word.',
      'Fold the paper toward you (drawing things in) and hold it over your heart for 1 minute.',
      'Place the paper under your pillow or in a sacred space. Leave the candle burning safely for 11 minutes.',
      'Close with gratitude: "Thank you for these gifts already received."',
    ]
  },
  {
    id: 'r222', number: '222', title: 'Divine Patience Meditation', duration: '22 min', timing: 'Evening or at 2:22',
    emoji: '⚖️', color: '#60a5fa',
    intention: 'Surrender to divine timing and cultivate deep trust in the unfolding.',
    materials: ['Comfortable seating', 'Optional: calming music'],
    steps: [
      'Sit comfortably and close your eyes. Place one hand on your heart, one on your belly.',
      'Breathe in for 4 counts, hold for 2, out for 6. Repeat 11 times.',
      'Visualize a golden scale perfectly balanced before you. Place your worries on one side.',
      'Watch as angels gently place blessings on the other side until perfect balance is restored.',
      'Whisper: "I trust. I surrender. I receive." 22 times.',
      'Sit in silence for the remaining time, simply being present with what is.',
    ]
  },
  {
    id: 'r333', number: '333', title: 'Creative Channel Opening', duration: '33 min', timing: 'Anytime, especially midday',
    emoji: '🔺', color: '#a78bfa',
    intention: 'Open yourself as a clear channel for divine creative expression.',
    materials: ['Any creative medium (pen, paint, instrument)', 'Optional: purple candle'],
    steps: [
      'Begin with 3 minutes of free movement — shake your body, loosen your limbs.',
      'Sit with your creative medium. Set a timer for 27 minutes.',
      'Create without judgment. Let the ascended masters move through your hands.',
      'If you get stuck, write or draw the number 333 repeatedly until flow returns.',
      'When the timer ends, look at what you created. Find one thing that surprises you.',
      'Offer your creation to the universe: "I created this as a gift. May it serve the highest good."',
    ]
  },
  {
    id: 'r444', number: '444', title: 'Angel Protection Ritual', duration: '4 min', timing: 'Before sleep or at 4:44',
    emoji: '🏛️', color: '#34d399',
    intention: 'Call in your angelic guardians and seal your energy field with divine protection.',
    materials: ['Optional: salt (for boundary setting)', 'Optional: white candle'],
    steps: [
      'Stand in the center of your room. Face north.',
      'Call aloud: "Archangel Michael, stand to my north. Archangel Raphael, to my east. Archangel Uriel, to my south. Archangel Gabriel, to my west."',
      'Visualize pillars of golden light at each corner of your space.',
      'Place your hands on your heart and say: "I am divinely protected. Only love may enter this space."',
      'If using salt, sprinkle a small line across your doorway threshold.',
      'Sleep knowing you are held in the arms of angels.',
    ]
  },
  {
    id: 'r555', number: '555', title: 'Release & Transform Fire Ritual', duration: '15 min', timing: 'During transitions or at 5:55',
    emoji: '🌀', color: '#fb923c',
    intention: 'Consciously release what no longer serves and welcome transformative change.',
    materials: ['Paper and pen', 'Fireproof bowl or sink', 'Matches or lighter'],
    steps: [
      'Write everything you are ready to release — fears, habits, relationships, beliefs.',
      'Read each item aloud and say: "I release you with love and gratitude for the lessons."',
      'Safely burn the paper (or tear it into tiny pieces and flush it).',
      'As it burns/dissolves, visualize a phoenix rising from the ashes — that is you.',
      'Write on a fresh paper: "I now welcome..." and list what you are calling in to replace what you released.',
      'Keep this new paper in a visible place for 5 days.',
    ]
  },
  {
    id: 'r777', number: '777', title: 'Mystic Synchronicity Walk', duration: '30-60 min', timing: 'Anytime outdoors',
    emoji: '🔮', color: '#818cf8',
    intention: 'Open your awareness to divine signs and synchronicities in the physical world.',
    materials: ['Your phone (for notes)', 'Comfortable walking shoes', 'Open heart'],
    steps: [
      'Before leaving, set an intention: "Show me a sign that I am on the right path."',
      'Walk slowly and mindfully. Notice everything — numbers, animals, overheard conversations.',
      'When you notice something that feels significant, pause and ask: "What is this telling me?"',
      'Document every synchronicity in your phone notes.',
      'Look for patterns — the universe speaks in repetition.',
      'Return home and journal about the most significant sign you received and its message.',
    ]
  },
  {
    id: 'r888', number: '888', title: 'Abundance Activation', duration: '8 min', timing: 'Morning, especially on the 8th',
    emoji: '♾️', color: '#c9a84c',
    intention: 'Align your energy with the infinite flow of abundance in all its forms.',
    materials: ['Green or gold candle', 'Coins or cash (any amount)', 'Optional: citrine crystal'],
    steps: [
      'Place coins/cash and optional crystal on your altar or table. Light your candle.',
      'Hold the coins in both hands and feel their weight — this is the energy of abundance made physical.',
      'Say: "I am a clear channel for abundance. Money flows to me easily and joyfully."',
      'Visualize an infinity symbol (∞) of golden light flowing through your body.',
      'Write 8 ways you are already abundant (health, love, skills, etc.).',
      'Leave the coins on your altar for 8 days as an abundance anchor.',
    ]
  },
  {
    id: 'r999', number: '999', title: 'Sacred Completion Ceremony', duration: '20 min', timing: 'End of day, month, or cycle',
    emoji: '🌙', color: '#f472b6',
    intention: 'Honor what has been, complete the cycle with grace, and prepare for rebirth.',
    materials: ['Journal', 'Candle (black or deep purple)', 'Optional: bath or shower'],
    steps: [
      'If possible, take a cleansing bath or shower first — water washes away the old cycle.',
      'Light your candle and sit with your journal.',
      'Write: "In this cycle, I learned..." Fill the page.',
      'Write: "I am grateful for..." List 9 things from this cycle, even the hard ones.',
      'Write: "I am ready to release..." Let it all go on paper.',
      'Close your journal and say: "This cycle is complete. I am reborn. What comes next is beyond my imagination."',
    ]
  },
  {
    id: 'r1111', number: '1111', title: '11:11 Portal Activation', duration: '11 min', timing: 'Exactly at 11:11 AM or PM',
    emoji: '✦', color: '#fde68a',
    intention: 'Step through the most powerful manifestation portal available to you.',
    materials: ['Your wish list', 'Optional: mirror'],
    steps: [
      'Set an alarm for 11:10. Prepare your space and your wish.',
      'At exactly 11:11, close your eyes and visualize your wish as already fulfilled.',
      'Feel the emotions of having it — joy, gratitude, relief, excitement.',
      'If using a mirror, look into your own eyes and speak your wish aloud.',
      'Hold the vision for the full 11 minutes without doubt or wavering.',
      'At 11:22, say "It is done. It is done. It is done." and release it completely.',
    ]
  },
]

const RITUALS_KEY = 'synchrosoul_rituals_completed'

export default function RitualsPage() {
  const [completed, setCompleted] = useState<Record<string, string>>({})
  const [active, setActive] = useState<Ritual | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [step, setStep] = useState(0)
  const [inProgress, setInProgress] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(RITUALS_KEY)
    if (saved) setCompleted(JSON.parse(saved))
  }, [])

  function markComplete(id: string) {
    const updated = { ...completed, [id]: new Date().toISOString() }
    setCompleted(updated)
    localStorage.setItem(RITUALS_KEY, JSON.stringify(updated))
  }

  function startRitual(r: Ritual) {
    setActive(r)
    setStep(0)
    setInProgress(true)
  }

  const numbers = ['all', ...Array.from(new Set(ALL_RITUALS.map(r => r.number)))]
  const visible = filter === 'all' ? ALL_RITUALS : ALL_RITUALS.filter(r => r.number === filter)
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  // Active ritual guide view
  if (active && inProgress) return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <button onClick={() => setInProgress(false)} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1rem', padding: 0 }}>← Back</button>
      <div style={{ ...card, padding: '1.5rem', borderColor: active.color + '30', background: active.color + '06', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>{active.emoji}</span>
          <div>
            <div style={{ color: active.color, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{active.number} Ritual</div>
            <div style={{ color: 'rgba(220,200,255,0.9)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', fontWeight: 400 }}>{active.title}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', marginTop: '0.15rem' }}>⏱ {active.duration} · {active.timing}</div>
          </div>
        </div>
        <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', lineHeight: 1.6, margin: '0 0 1rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{active.intention}</p>
        {active.materials.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>You will need</div>
            {active.materials.map((m, i) => <div key={i} style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.78rem', padding: '0.2rem 0' }}>· {m}</div>)}
          </div>
        )}
      </div>

      {/* Step progress */}
      <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1rem' }}>
        {active.steps.map((_, i) => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= step ? active.color : 'rgba(200,180,255,0.1)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* Current step */}
      <div style={{ ...card, padding: '1.5rem', borderColor: active.color + '25', marginBottom: '1rem' }}>
        <div style={{ color: active.color, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Step {step + 1} of {active.steps.length}</div>
        <p style={{ color: 'rgba(220,200,255,0.85)', fontSize: '1rem', lineHeight: 1.7, margin: 0, fontFamily: 'Cormorant Garamond, serif' }}>{active.steps[step]}</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '0.875rem', borderRadius: '0.875rem', border: '1px solid rgba(200,180,255,0.15)', background: 'rgba(8,6,28,0.7)', color: 'rgba(180,160,255,0.6)', fontSize: '0.85rem', cursor: 'pointer' }}>← Previous</button>
        )}
        {step < active.steps.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} style={{ flex: 1, padding: '0.875rem', borderRadius: '0.875rem', border: '1px solid ' + active.color + '40', background: active.color + '15', color: active.color, fontSize: '0.85rem', cursor: 'pointer' }}>Next Step →</button>
        ) : (
          <button onClick={() => { markComplete(active.id); setInProgress(false) }} style={{ flex: 1, padding: '0.875rem', borderRadius: '0.875rem', border: '1px solid rgba(52,211,153,0.4)', background: 'rgba(52,211,153,0.15)', color: '#34d399', fontSize: '0.85rem', cursor: 'pointer' }}>✓ Complete Ritual</button>
        )}
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Sacred Rituals</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Step-by-step practices for each angel number</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem', marginBottom: '1.25rem' }}>
        {[{ label: 'Completed', value: Object.keys(completed).length, color: '#34d399' }, { label: 'Available', value: ALL_RITUALS.length, color: '#a78bfa' }, { label: 'Remaining', value: ALL_RITUALS.length - Object.keys(completed).length, color: '#c9a84c' }].map(s => (
          <div key={s.label} style={{ ...card, padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ color: s.color, fontSize: '1.4rem', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Number filter */}
      <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
        {numbers.map(n => (
          <button key={n} onClick={() => setFilter(n)} style={{ flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: '2rem', border: filter===n ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(200,180,255,0.12)', background: filter===n ? 'rgba(201,168,76,0.15)' : 'rgba(8,6,28,0.6)', color: filter===n ? '#c9a84c' : 'rgba(180,160,255,0.4)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>{n === 'all' ? 'All' : n}</button>
        ))}
      </div>

      {/* Ritual cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {visible.map(r => {
          const done = !!completed[r.id]
          return (
            <div key={r.id} style={{ ...card, padding: '1.25rem', borderColor: done ? r.color + '30' : 'rgba(200,180,255,0.12)', background: done ? r.color + '06' : 'rgba(8,6,28,0.88)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.75rem' }}>{r.emoji}</span>
                  <div>
                    <div style={{ color: r.color, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{r.number}</div>
                    <div style={{ color: 'rgba(220,200,255,0.9)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 400 }}>{r.title}</div>
                    <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.68rem', marginTop: '0.1rem' }}>⏱ {r.duration} · {r.timing}</div>
                  </div>
                </div>
                {done && <span style={{ color: '#34d399', fontSize: '0.65rem', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '2rem', padding: '0.2rem 0.5rem', flexShrink: 0 }}>✓ Done</span>}
              </div>
              <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.78rem', lineHeight: 1.5, margin: '0 0 0.875rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{r.intention}</p>
              <button onClick={() => startRitual(r)} style={{ width: '100%', padding: '0.625rem', borderRadius: '0.75rem', border: '1px solid ' + r.color + '35', background: r.color + '10', color: r.color, fontSize: '0.78rem', cursor: 'pointer', letterSpacing: '0.05em' }}>{done ? '↺ Repeat Ritual' : '✦ Begin Ritual'}</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
