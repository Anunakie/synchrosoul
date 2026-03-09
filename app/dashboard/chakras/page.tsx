'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_chakras'

const CHAKRAS = [
  { id: 'root', name: 'Root', sanskrit: 'Muladhara', number: 1, color: '#ef4444', emoji: '🔴', location: 'Base of spine', element: 'Earth', frequency: '396 Hz', affirmation: 'I am safe, grounded, and supported by the earth.', balanced: 'Feeling secure, grounded, financially stable, physically healthy.', imbalanced: 'Fear, anxiety, financial stress, feeling disconnected from body.', crystals: ['Red Jasper', 'Black Tourmaline', 'Hematite', 'Obsidian'], practices: ['Walking barefoot', 'Grounding meditation', 'Yoga', 'Eating root vegetables'], angelNumbers: ['444', '111', '888'] },
  { id: 'sacral', name: 'Sacral', sanskrit: 'Svadhisthana', number: 2, color: '#f97316', emoji: '🟠', location: 'Lower abdomen', element: 'Water', frequency: '417 Hz', affirmation: 'I embrace pleasure, creativity, and the flow of life.', balanced: 'Creative, passionate, emotionally fluid, sensually alive, joyful.', imbalanced: 'Emotional numbness, creative blocks, guilt, addiction, relationship issues.', crystals: ['Carnelian', 'Orange Calcite', 'Sunstone', 'Tiger Eye'], practices: ['Dance', 'Creative expression', 'Swimming', 'Hip-opening yoga'], angelNumbers: ['222', '333', '555'] },
  { id: 'solar', name: 'Solar Plexus', sanskrit: 'Manipura', number: 3, color: '#eab308', emoji: '🟡', location: 'Upper abdomen', element: 'Fire', frequency: '528 Hz', affirmation: 'I am powerful, confident, and worthy of all good things.', balanced: 'Confident, self-disciplined, motivated, strong sense of purpose.', imbalanced: 'Low self-esteem, control issues, victim mentality, digestive problems.', crystals: ['Citrine', 'Yellow Jasper', 'Pyrite', 'Amber'], practices: ['Core exercises', 'Sun gazing', 'Breathwork', 'Setting boundaries'], angelNumbers: ['333', '111', '777'] },
  { id: 'heart', name: 'Heart', sanskrit: 'Anahata', number: 4, color: '#22c55e', emoji: '💚', location: 'Center of chest', element: 'Air', frequency: '639 Hz', affirmation: 'I give and receive love freely and unconditionally.', balanced: 'Compassionate, loving, empathetic, forgiving, connected to others.', imbalanced: 'Grief, loneliness, codependency, inability to forgive, heart issues.', crystals: ['Rose Quartz', 'Green Aventurine', 'Malachite', 'Rhodonite'], practices: ['Heart-opening yoga', 'Forgiveness meditation', 'Acts of kindness', 'Time in nature'], angelNumbers: ['444', '222', '666'] },
  { id: 'throat', name: 'Throat', sanskrit: 'Vishuddha', number: 5, color: '#3b82f6', emoji: '🔵', location: 'Throat', element: 'Ether', frequency: '741 Hz', affirmation: 'I speak my truth with clarity, love, and confidence.', balanced: 'Authentic self-expression, clear communication, creative voice, honesty.', imbalanced: 'Fear of speaking, lying, inability to express feelings, throat issues.', crystals: ['Blue Lace Agate', 'Aquamarine', 'Sodalite', 'Lapis Lazuli'], practices: ['Singing', 'Journaling', 'Chanting', 'Speaking affirmations aloud'], angelNumbers: ['555', '111', '333'] },
  { id: 'third-eye', name: 'Third Eye', sanskrit: 'Ajna', number: 6, color: '#8b5cf6', emoji: '🟣', location: 'Between eyebrows', element: 'Light', frequency: '852 Hz', affirmation: 'I trust my intuition and see clearly with my inner eye.', balanced: 'Strong intuition, clear vision, wisdom, psychic awareness, insight.', imbalanced: 'Confusion, lack of direction, poor intuition, headaches, nightmares.', crystals: ['Amethyst', 'Labradorite', 'Fluorite', 'Iolite'], practices: ['Meditation', 'Dream journaling', 'Visualization', 'Stargazing'], angelNumbers: ['777', '1111', '333'] },
  { id: 'crown', name: 'Crown', sanskrit: 'Sahasrara', number: 7, color: '#a855f7', emoji: '🟣', location: 'Top of head', element: 'Thought', frequency: '963 Hz', affirmation: 'I am divinely connected to the infinite wisdom of the universe.', balanced: 'Spiritual connection, enlightenment, divine guidance, inner peace, unity.', imbalanced: 'Spiritual disconnection, cynicism, depression, feeling purposeless.', crystals: ['Clear Quartz', 'Selenite', 'Lepidolite', 'Moonstone'], practices: ['Silent meditation', 'Prayer', 'Fasting', 'Spending time in stillness'], angelNumbers: ['777', '1111', '999'] },
]

interface ChakraLog {
  id: number
  chakraId: string
  rating: number
  notes: string
  date: string
}

export default function ChakrasPage() {
  const [logs, setLogs] = useState<ChakraLog[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [rating, setRating] = useState(5)
  const [notes, setNotes] = useState('')
  const [view, setView] = useState<'overview' | 'detail'>('overview')

  useEffect(() => {
    const s = localStorage.getItem(KEY)
    if (s) setLogs(JSON.parse(s))
  }, [])

  function saveLogs(next: ChakraLog[]) {
    setLogs(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  function logChakra(chakraId: string) {
    const entry: ChakraLog = { id: Date.now(), chakraId, rating, notes, date: new Date().toISOString() }
    saveLogs([entry, ...logs])
    setNotes('')
    setSelected(null)
  }

  function getLatestRating(chakraId: string): number | null {
    const chakraLogs = logs.filter(l => l.chakraId === chakraId)
    return chakraLogs.length > 0 ? chakraLogs[0].rating : null
  }

  const selectedChakra = CHAKRAS.find(c => c.id === selected)
  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Chakra Balance</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Track and align your energy centers</p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['overview','detail'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: '0.35rem 0.75rem', borderRadius: '2rem', border: view === v ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: view === v ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: view === v ? '#a78bfa' : 'rgba(180,160,255,0.45)', fontSize: '0.72rem', cursor: 'pointer', textTransform: 'capitalize' }}>{v}</button>
          ))}
        </div>
      </div>

      {view === 'overview' && (
        <>
          {/* Chakra body visualization */}
          <div style={{ ...card, padding: '1.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Your Energy Body</div>
            {[...CHAKRAS].reverse().map(chakra => {
              const latestRating = getLatestRating(chakra.id)
              const width = latestRating ? `${latestRating * 10}%` : '50%'
              return (
                <div key={chakra.id} onClick={() => setSelected(chakra.id === selected ? null : chakra.id)} style={{ width: '100%', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '1rem', width: '1.5rem', textAlign: 'center' }}>{chakra.emoji}</span>
                    <span style={{ color: chakra.color, fontSize: '0.78rem', fontWeight: 600, width: '6rem' }}>{chakra.name}</span>
                    <div style={{ flex: 1, height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width, background: `linear-gradient(90deg, ${chakra.color}88, ${chakra.color})`, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                    </div>
                    <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.7rem', width: '2rem', textAlign: 'right' }}>{latestRating ? `${latestRating}/10` : '—'}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected chakra log form */}
          {selected && selectedChakra && (
            <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem', borderColor: `${selectedChakra.color}44` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{selectedChakra.emoji}</span>
                <div>
                  <div style={{ color: selectedChakra.color, fontSize: '1rem', fontWeight: 600 }}>{selectedChakra.name} Chakra</div>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem' }}>{selectedChakra.sanskrit} · {selectedChakra.frequency}</div>
                </div>
              </div>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Energy Level Today: {rating}/10</div>
              <input type="range" min={1} max={10} value={rating} onChange={e => setRating(Number(e.target.value))} style={{ width: '100%', marginBottom: '0.75rem', accentColor: selectedChakra.color }} />
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="How does this chakra feel today?" rows={2} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.65rem 0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', resize: 'none', marginBottom: '0.75rem' }} />
              <button onClick={() => logChakra(selected)} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.75rem', background: `linear-gradient(135deg, ${selectedChakra.color}88, ${selectedChakra.color})`, border: 'none', color: 'white', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Log Energy Level</button>
            </div>
          )}

          {/* Tap to log prompt */}
          {!selected && (
            <p style={{ textAlign: 'center', color: 'rgba(180,160,255,0.35)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>Tap any chakra bar to log your energy level</p>
          )}
        </>
      )}

      {view === 'detail' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {CHAKRAS.map(chakra => (
            <div key={chakra.id} style={{ ...card, borderColor: `${chakra.color}22` }}>
              <div onClick={() => setSelected(chakra.id === selected ? null : chakra.id)} style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: `${chakra.color}18`, border: `1px solid ${chakra.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{chakra.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: chakra.color, fontSize: '0.95rem', fontWeight: 600 }}>{chakra.name} — {chakra.sanskrit}</div>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem' }}>{chakra.location} · {chakra.element} · {chakra.frequency}</div>
                </div>
                <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.8rem', transform: selected === chakra.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>⌄</span>
              </div>
              {selected === chakra.id && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(200,180,255,0.06)' }}>
                  <div style={{ paddingTop: '0.875rem' }}>
                    <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.85rem', margin: '0 0 0.875rem', lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{chakra.affirmation}&rdquo;</p>
                    {[{ label: 'When Balanced', text: chakra.balanced, color: '#34d399' }, { label: 'When Imbalanced', text: chakra.imbalanced, color: '#f87171' }].map(s => (
                      <div key={s.label} style={{ marginBottom: '0.75rem' }}>
                        <div style={{ color: s.color, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{s.label}</div>
                        <p style={{ color: 'rgba(200,180,255,0.65)', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{s.text}</p>
                      </div>
                    ))}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div style={{ background: `${chakra.color}08`, border: `1px solid ${chakra.color}22`, borderRadius: '0.75rem', padding: '0.75rem' }}>
                        <div style={{ color: chakra.color, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Crystals</div>
                        {chakra.crystals.map(c => <div key={c} style={{ color: 'rgba(200,180,255,0.65)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>◈ {c}</div>)}
                      </div>
                      <div style={{ background: `${chakra.color}08`, border: `1px solid ${chakra.color}22`, borderRadius: '0.75rem', padding: '0.75rem' }}>
                        <div style={{ color: chakra.color, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Practices</div>
                        {chakra.practices.map(p => <div key={p} style={{ color: 'rgba(200,180,255,0.65)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>✦ {p}</div>)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {chakra.angelNumbers.map(n => <span key={n} style={{ padding: '0.2rem 0.5rem', borderRadius: '2rem', background: `${chakra.color}12`, border: `1px solid ${chakra.color}25`, color: chakra.color, fontSize: '0.72rem' }}>{n}</span>)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
