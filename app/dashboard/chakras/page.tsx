'use client'
import { useState, useEffect } from 'react'

const CHAKRAS = [
  {
    id: 'root', name: 'Root', sanskrit: 'Muladhara', color: '#ef4444', glyph: '▽',
    location: 'Base of spine', element: 'Earth', frequency: '396 Hz',
    numbers: ['1', '4', '444', '111'],
    affirmation: 'I am safe. I am grounded. I belong here.',
    signs: ['Feeling unstable', 'Financial anxiety', 'Disconnected from body'],
    practices: ['Walk barefoot on grass', 'Eat red foods', 'Stomp your feet'],
    meaning: 'Foundation, survival, security, and your connection to the physical world.',
  },
  {
    id: 'sacral', name: 'Sacral', sanskrit: 'Svadhisthana', color: '#f97316', glyph: '●',
    location: 'Below navel', element: 'Water', frequency: '417 Hz',
    numbers: ['2', '222', '2222'],
    affirmation: 'I feel. I create. I flow with life.',
    signs: ['Creative blocks', 'Emotional numbness', 'Relationship issues'],
    practices: ['Dance freely', 'Create art', 'Spend time near water'],
    meaning: 'Creativity, pleasure, emotions, and the flow of life force energy.',
  },
  {
    id: 'solar', name: 'Solar Plexus', sanskrit: 'Manipura', color: '#eab308', glyph: '☀',
    location: 'Upper abdomen', element: 'Fire', frequency: '528 Hz',
    numbers: ['3', '333', '3333'],
    affirmation: 'I am powerful. I am confident. I trust myself.',
    signs: ['Low self-esteem', 'Indecision', 'Lack of direction'],
    practices: ['Sun gazing at dawn', 'Core exercises', 'Set one boundary today'],
    meaning: 'Personal power, confidence, will, and transformation.',
  },
  {
    id: 'heart', name: 'Heart', sanskrit: 'Anahata', color: '#22c55e', glyph: '♡',
    location: 'Center of chest', element: 'Air', frequency: '639 Hz',
    numbers: ['4', '6', '444', '666'],
    affirmation: 'I love. I am loved. Love flows through me freely.',
    signs: ['Difficulty trusting', 'Loneliness', 'Holding grudges'],
    practices: ['Practice forgiveness', 'Hug someone', 'Write a love letter to yourself'],
    meaning: 'Love, compassion, connection, and the bridge between body and spirit.',
  },
  {
    id: 'throat', name: 'Throat', sanskrit: 'Vishuddha', color: '#3b82f6', glyph: '○',
    location: 'Throat', element: 'Sound', frequency: '741 Hz',
    numbers: ['5', '555', '5555'],
    affirmation: 'I speak my truth. My voice matters. I am heard.',
    signs: ['Fear of speaking up', 'Lying to yourself', 'Sore throat'],
    practices: ['Sing or hum', 'Journal your truth', 'Say no when you mean no'],
    meaning: 'Communication, truth, self-expression, and authentic voice.',
  },
  {
    id: 'third-eye', name: 'Third Eye', sanskrit: 'Ajna', color: '#8b5cf6', glyph: '◈',
    location: 'Between eyebrows', element: 'Light', frequency: '852 Hz',
    numbers: ['6', '7', '777', '666'],
    affirmation: 'I see clearly. I trust my intuition. I am guided.',
    signs: ['Ignoring intuition', 'Overthinking', 'Lack of clarity'],
    practices: ['Meditate in darkness', 'Trust your first instinct today', 'Gaze at stars'],
    meaning: 'Intuition, insight, imagination, and spiritual vision.',
  },
  {
    id: 'crown', name: 'Crown', sanskrit: 'Sahasrara', color: '#a855f7', glyph: '✧',
    location: 'Top of head', element: 'Thought', frequency: '963 Hz',
    numbers: ['7', '9', '777', '999', '1111'],
    affirmation: 'I am connected to all that is. I am divine.',
    signs: ['Feeling disconnected from purpose', 'Spiritual emptiness', 'Cynicism'],
    practices: ['Sit in silence for 10 minutes', 'Pray or set an intention', 'Look at the night sky'],
    meaning: 'Spiritual connection, enlightenment, unity consciousness, and divine purpose.',
  },
]

const STORAGE_KEY = 'synchrosoul_logs'

export default function ChakrasPage() {
  const [selected, setSelected] = useState<typeof CHAKRAS[0] | null>(null)
  const [activatedChakras, setActivatedChakras] = useState<string[]>([])
  const [recentNumbers, setRecentNumbers] = useState<string[]>([])

  useEffect(() => {
    try {
      const logs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      const recent = logs.slice(0, 20).map((l: { number: string }) => l.number)
      setRecentNumbers(recent)
      // Find which chakras are activated by recent numbers
      const activated = CHAKRAS.filter(c =>
        c.numbers.some(n => recent.some((r: string) => r.includes(n) || n.includes(r)))
      ).map(c => c.id)
      setActivatedChakras(activated)
    } catch {}
  }, [])

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  if (selected) {
    const isActive = activatedChakras.includes(selected.id)
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', marginBottom: '1rem', fontFamily: 'inherit' }}>← All Chakras</button>

        <div style={{ ...card, padding: '2rem', marginBottom: '1rem', border: `1px solid ${selected.color}44`, background: 'rgba(10,6,30,0.95)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem', color: selected.color }}>{selected.glyph}</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.2rem', fontWeight: 400 }}>{selected.name} Chakra</h2>
          <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', marginBottom: '1rem', fontStyle: 'italic' }}>{selected.sanskrit} • {selected.location} • {selected.frequency}</div>
          {isActive && (
            <div style={{ display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '2rem', background: `${selected.color}20`, border: `1px solid ${selected.color}55`, color: selected.color, fontSize: '0.72rem', marginBottom: '1rem' }}>✦ Activated by your recent numbers</div>
          )}
          <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{selected.meaning}</p>
        </div>

        <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Affirmation</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.9)', fontStyle: 'italic', lineHeight: 1.6 }}>{selected.affirmation}</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ ...card, padding: '1.1rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Signs of Imbalance</div>
            {selected.signs.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <span style={{ color: selected.color, fontSize: '0.6rem', marginTop: '0.25rem', flexShrink: 0 }}>•</span>
                <span style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.75rem', lineHeight: 1.4 }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={{ ...card, padding: '1.1rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Healing Practices</div>
            {selected.practices.map((p, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <span style={{ color: selected.color, fontSize: '0.6rem', marginTop: '0.25rem', flexShrink: 0 }}>✦</span>
                <span style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.75rem', lineHeight: 1.4 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...card, padding: '1.1rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Angel Numbers That Activate This Chakra</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {selected.numbers.map(n => (
              <span key={n} style={{ padding: '0.25rem 0.65rem', borderRadius: '2rem', background: `${selected.color}15`, border: `1px solid ${selected.color}33`, color: selected.color, fontSize: '0.78rem', fontWeight: 600 }}>{n}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Chakra Alignment</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>
        {activatedChakras.length > 0
          ? `${activatedChakras.length} chakras activated by your recent angel numbers`
          : 'Log angel numbers to see which chakras are activated'}
      </p>

      {/* Chakra spine visualization */}
      <div style={{ ...card, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[...CHAKRAS].reverse().map((chakra, i) => {
            const isActive = activatedChakras.includes(chakra.id)
            return (
              <button
                key={chakra.id}
                onClick={() => setSelected(chakra)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.85rem 1rem', borderRadius: '0.85rem', cursor: 'pointer',
                  background: isActive ? `${chakra.color}12` : 'rgba(255,255,255,0.02)',
                  border: isActive ? `1px solid ${chakra.color}44` : '1px solid rgba(200,180,255,0.07)',
                  transition: 'all 0.2s', textAlign: 'left', fontFamily: 'inherit',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  background: isActive ? `${chakra.color}25` : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${isActive ? chakra.color : chakra.color + '44'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: chakra.color, fontSize: '1.1rem',
                  boxShadow: isActive ? `0 0 12px ${chakra.color}44` : 'none',
                  transition: 'all 0.3s',
                }}>{chakra.glyph}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', fontWeight: 600 }}>{chakra.name}</span>
                    {isActive && <span style={{ color: chakra.color, fontSize: '0.65rem' }}>✦ Active</span>}
                  </div>
                  <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.72rem' }}>{chakra.sanskrit} • {chakra.element}</div>
                </div>
                <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '1rem' }}>›</span>
              </button>
            )
          })}
        </div>
      </div>

      {recentNumbers.length === 0 && (
        <div style={{ ...card, padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.82rem' }}>Log angel numbers on the dashboard to see which chakras they activate.</div>
        </div>
      )}
    </div>
  )
}
