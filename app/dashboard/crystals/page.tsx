'use client'
import { useState, useEffect } from 'react'
import { getLogs } from '@/lib/storage'

const CRYSTAL_DB = [
  { name: 'Clear Quartz', emoji: '💎', color: '#e0e7ff', element: 'All', chakra: 'Crown', numbers: ['111','1111','777','000'], properties: 'Master healer. Amplifies intentions and energy. Enhances clarity and spiritual connection.', affirmation: 'I am clear, focused, and aligned with my highest purpose.', care: 'Cleanse in sunlight or moonlight. Charge on selenite.' },
  { name: 'Amethyst', emoji: '🔮', color: '#a78bfa', element: 'Air', chakra: 'Third Eye', numbers: ['777','333','999','1111'], properties: 'Enhances intuition, psychic abilities, and spiritual wisdom. Protects against negative energy.', affirmation: 'I trust my intuition. I am divinely guided.', care: 'Cleanse in moonlight. Avoid prolonged sunlight (fades color).' },
  { name: 'Rose Quartz', emoji: '🌸', color: '#f9a8d4', element: 'Water', chakra: 'Heart', numbers: ['222','444','6','66'], properties: 'Stone of unconditional love. Attracts romantic love, self-love, and compassion.', affirmation: 'I am worthy of love. Love flows to me effortlessly.', care: 'Cleanse in rose water or moonlight. Charge with rose petals.' },
  { name: 'Citrine', emoji: '🌟', color: '#fbbf24', element: 'Fire', chakra: 'Solar Plexus', numbers: ['888','333','555','3'], properties: 'Stone of abundance and manifestation. Attracts wealth, success, and positive energy.', affirmation: 'I attract abundance in all forms. I am a magnet for prosperity.', care: 'Cleanse in sunlight. Never needs cleansing (self-clearing).' },
  { name: 'Black Tourmaline', emoji: '🖤', color: '#6b7280', element: 'Earth', chakra: 'Root', numbers: ['444','000','4','8'], properties: 'Powerful protection stone. Shields against negative energy, EMF, and psychic attacks.', affirmation: 'I am protected. I am grounded. Only love enters my space.', care: 'Bury in earth overnight. Cleanse with sage.' },
  { name: 'Lapis Lazuli', emoji: '🌊', color: '#3b82f6', element: 'Water', chakra: 'Throat', numbers: ['555','741','33','5'], properties: 'Stone of truth and wisdom. Enhances communication, self-expression, and inner knowing.', affirmation: 'I speak my truth with confidence and grace.', care: 'Cleanse in moonlight. Avoid water (contains pyrite).' },
  { name: 'Selenite', emoji: '🤍', color: '#f1f5f9', element: 'Spirit', chakra: 'Crown', numbers: ['111','999','11','22'], properties: 'High vibration stone. Cleanses other crystals, opens crown chakra, connects to higher realms.', affirmation: 'I am connected to divine light and infinite wisdom.', care: 'Never cleanse in water (dissolves). Charge in moonlight.' },
  { name: 'Obsidian', emoji: '⚫', color: '#1f2937', element: 'Fire/Earth', chakra: 'Root', numbers: ['999','000','8','88'], properties: 'Volcanic glass. Reveals truth, releases past trauma, provides deep soul healing.', affirmation: 'I release the past. I am free to create my future.', care: 'Cleanse in running water or sage smoke.' },
  { name: 'Labradorite', emoji: '🌈', color: '#67e8f9', element: 'Water', chakra: 'Third Eye', numbers: ['1111','777','11','33'], properties: 'Stone of magic and transformation. Awakens psychic abilities and protects the aura.', affirmation: 'I embrace transformation. Magic flows through my life.', care: 'Cleanse in moonlight. Charge under northern lights or full moon.' },
  { name: 'Green Aventurine', emoji: '🍀', color: '#4ade80', element: 'Earth', chakra: 'Heart', numbers: ['444','888','4','6'], properties: 'Stone of opportunity and luck. Attracts prosperity, growth, and new beginnings.', affirmation: 'I am open to new opportunities. Luck flows to me naturally.', care: 'Cleanse in running water. Charge in sunlight.' },
  { name: 'Moonstone', emoji: '🌙', color: '#e2e8f0', element: 'Water', chakra: 'Crown/Sacral', numbers: ['222','2','11','1212'], properties: 'Stone of new beginnings and feminine energy. Enhances intuition and emotional balance.', affirmation: 'I flow with the cycles of life. I trust divine timing.', care: 'Charge under full moon. Cleanse in moonlight.' },
  { name: 'Pyrite', emoji: '✨', color: '#d97706', element: 'Earth/Fire', chakra: 'Solar Plexus', numbers: ['888','8','333','1234'], properties: 'Fools gold but real power. Attracts wealth, boosts confidence, shields against negativity.', affirmation: 'I am confident, powerful, and worthy of success.', care: 'Cleanse with dry salt. Avoid water (rusts).' },
]

export default function CrystalsPage() {
  const [recentNumbers, setRecentNumbers] = useState<string[]>([])
  const [filter, setFilter] = useState<'all' | 'recommended'>('recommended')
  const [selected, setSelected] = useState<typeof CRYSTAL_DB[0] | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const logs = getLogs()
    const nums = [...new Set(logs.slice(0, 20).map(l => l.number))]
    setRecentNumbers(nums)
  }, [])

  const recommended = CRYSTAL_DB.filter(c =>
    recentNumbers.some(n => c.numbers.includes(n))
  )

  const displayed = (filter === 'recommended' && recommended.length > 0 ? recommended : CRYSTAL_DB)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.properties.toLowerCase().includes(search.toLowerCase()))

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  if (selected) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', marginBottom: '1.5rem', fontFamily: 'inherit' }}>← Back to Crystals</button>
        <div style={{ ...card, padding: '2rem', border: `1px solid ${selected.color}33`, background: `radial-gradient(ellipse at 50% 0%, ${selected.color}10 0%, rgba(8,6,28,0.95) 70%)` }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem', filter: `drop-shadow(0 0 16px ${selected.color}66)` }}>{selected.emoji}</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: selected.color, margin: '0 0 0.25rem', fontWeight: 400 }}>{selected.name}</h2>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(180,160,255,0.6)', fontSize: '0.7rem' }}>{selected.chakra} Chakra</span>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(180,160,255,0.6)', fontSize: '0.7rem' }}>{selected.element}</span>
            </div>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Properties</div>
            <p style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{selected.properties}</p>
          </div>
          <div style={{ ...card, padding: '1rem', marginBottom: '1rem', background: `${selected.color}08`, border: `1px solid ${selected.color}22` }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Affirmation</div>
            <p style={{ color: selected.color, fontSize: '1rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>“{selected.affirmation}”</p>
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Care Instructions</div>
            <p style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>{selected.care}</p>
          </div>
          <div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Resonates with Angel Numbers</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {selected.numbers.map(n => <span key={n} style={{ padding: '0.25rem 0.65rem', borderRadius: '2rem', background: `${selected.color}15`, border: `1px solid ${selected.color}33`, color: selected.color, fontSize: '0.78rem', fontWeight: 600 }}>{n}</span>)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Crystal Guide</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.25rem' }}>Crystals aligned with your angel numbers.</p>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search crystals..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.75rem', color: 'rgba(220,200,255,0.9)', padding: '0.65rem 1rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit', marginBottom: '0.75rem', boxSizing: 'border-box' }} />

      {recentNumbers.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          {(['recommended', 'all'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.35rem 0.9rem', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', background: filter === f ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: filter === f ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', color: filter === f ? '#a78bfa' : 'rgba(180,160,255,0.5)' }}>
              {f === 'recommended' ? `✨ For You (${recommended.length})` : 'All Crystals'}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {displayed.map(c => (
          <button key={c.name} onClick={() => setSelected(c)}
            style={{ ...card, padding: '1.1rem', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', border: `1px solid ${c.color}22`, transition: 'all 0.2s' }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', filter: `drop-shadow(0 0 8px ${c.color}55)` }}>{c.emoji}</div>
            <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>{c.name}</div>
            <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.68rem', marginBottom: '0.4rem' }}>{c.chakra} • {c.element}</div>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
              {c.numbers.slice(0,2).map(n => <span key={n} style={{ padding: '0.1rem 0.4rem', borderRadius: '2rem', background: `${c.color}12`, border: `1px solid ${c.color}25`, color: c.color, fontSize: '0.62rem' }}>{n}</span>)}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
