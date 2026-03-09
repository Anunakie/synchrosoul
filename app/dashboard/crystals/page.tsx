'use client'
import { useState } from 'react'

const CRYSTALS = [
  { number: '111', name: 'Clear Quartz', aka: 'The Master Amplifier', color: '#f0f9ff', hex: '#e0f2fe', emoji: '💎', element: 'All', chakra: 'Crown', affinity: 'Manifestation & Clarity', howToUse: 'Hold during meditation or place on your journal while writing intentions. Program it by speaking your desires into it under sunlight.', properties: ['Amplifies all intentions', 'Clears mental fog', 'Connects to higher self', 'Accelerates manifestation'], pairsWith: 'Citrine' },
  { number: '222', name: 'Rose Quartz', aka: 'The Heart Stone', color: '#fdf2f8', hex: '#fce7f3', emoji: '🌸', element: 'Water', chakra: 'Heart', affinity: 'Love & Harmony', howToUse: 'Sleep with it under your pillow to attract love. Place in the relationship corner of your home (far right from entrance).', properties: ['Opens the heart chakra', 'Attracts soul connections', 'Heals emotional wounds', 'Cultivates self-love'], pairsWith: 'Moonstone' },
  { number: '333', name: 'Amethyst', aka: 'The Ascension Stone', color: '#f5f3ff', hex: '#ede9fe', emoji: '🔮', element: 'Air', chakra: 'Third Eye', affinity: 'Creativity & Intuition', howToUse: 'Place on your third eye during meditation. Keep on your desk while creating. Charge under the full moon monthly.', properties: ['Enhances psychic abilities', 'Stimulates creativity', 'Connects to ascended masters', 'Promotes spiritual growth'], pairsWith: 'Labradorite' },
  { number: '444', name: 'Black Tourmaline', aka: 'The Protector', color: '#1c1917', hex: '#292524', emoji: '🖤', element: 'Earth', chakra: 'Root', affinity: 'Protection & Grounding', howToUse: 'Place at the four corners of your home or bedroom. Carry in your left pocket for personal protection. Cleanse weekly with smoke.', properties: ['Creates energetic shields', 'Grounds scattered energy', 'Repels negative forces', 'Builds solid foundations'], pairsWith: 'Selenite' },
  { number: '555', name: 'Labradorite', aka: 'The Transformation Stone', color: '#ecfdf5', hex: '#d1fae5', emoji: '🌊', element: 'Fire', chakra: 'Throat', affinity: 'Change & Magic', howToUse: 'Hold during times of transition. Gaze into its iridescent surface to receive visions. Wear as jewelry during major life changes.', properties: ['Facilitates transformation', 'Reveals hidden truths', 'Strengthens intuition', 'Protects during change'], pairsWith: 'Moldavite' },
  { number: '666', name: 'Green Aventurine', aka: 'The Balancer', color: '#f0fdf4', hex: '#dcfce7', emoji: '🍃', element: 'Earth', chakra: 'Heart', affinity: 'Balance & Healing', howToUse: 'Carry in your pocket for daily balance. Place on your heart during breathwork. Bury in your garden to heal the land around you.', properties: ['Restores energetic balance', 'Heals the heart', 'Attracts good luck', 'Soothes anxiety'], pairsWith: 'Rose Quartz' },
  { number: '777', name: 'Lapis Lazuli', aka: 'The Mystic Stone', color: '#eff6ff', hex: '#dbeafe', emoji: '⭐', element: 'Ether', chakra: 'Third Eye', affinity: 'Wisdom & Luck', howToUse: 'Wear around your neck to keep wisdom close to your heart. Meditate with it on your forehead. Journal with it nearby to access deeper truths.', properties: ['Activates spiritual luck', 'Enhances wisdom', 'Opens psychic channels', 'Reveals life purpose'], pairsWith: 'Amethyst' },
  { number: '888', name: 'Citrine', aka: 'The Merchant Stone', color: '#fffbeb', hex: '#fef3c7', emoji: '✨', element: 'Fire', chakra: 'Solar Plexus', affinity: 'Abundance & Success', howToUse: 'Place in your wallet or cash register. Keep in the wealth corner of your home (far left from entrance). Never cleanse with water — use sunlight.', properties: ['Attracts wealth and success', 'Boosts confidence', 'Energizes manifestation', 'Never absorbs negative energy'], pairsWith: 'Pyrite' },
  { number: '999', name: 'Obsidian', aka: 'The Completion Stone', color: '#0c0a09', hex: '#1c1917', emoji: '🌑', element: 'Fire', chakra: 'Root', affinity: 'Release & Completion', howToUse: 'Use during cord-cutting rituals. Gaze into a polished sphere to release the past. Bury with written intentions of what you are releasing.', properties: ['Cuts energetic cords', 'Reveals shadow self', 'Completes karmic cycles', 'Protects during endings'], pairsWith: 'Selenite' },
  { number: '1010', name: 'Selenite', aka: 'The Divine Channel', color: '#fafaf9', hex: '#f5f5f4', emoji: '🌙', element: 'Ether', chakra: 'Crown', affinity: 'Divine Connection', howToUse: 'Never cleanse with water. Use to cleanse other crystals by placing them on a selenite plate overnight. Hold during prayer or channeling.', properties: ['Opens divine channels', 'Cleanses other crystals', 'Connects to higher realms', 'Brings mental clarity'], pairsWith: 'Clear Quartz' },
  { number: '1111', name: 'Moldavite', aka: 'The Portal Stone', color: '#f0fdf4', hex: '#bbf7d0', emoji: '☄️', element: 'Ether', chakra: 'All', affinity: 'Rapid Transformation', howToUse: 'Use with caution — its energy is intense. Hold briefly during 11:11 portal activations. Combine with grounding stones like black tourmaline.', properties: ['Opens manifestation portals', 'Accelerates spiritual evolution', 'Extraterrestrial origin', 'Catalyzes rapid change'], pairsWith: 'Black Tourmaline' },
  { number: '1212', name: 'Moonstone', aka: 'The Twin Flame Stone', color: '#f8fafc', hex: '#f1f5f9', emoji: '🌕', element: 'Water', chakra: 'Sacral', affinity: 'Soul Connections', howToUse: 'Charge under the full moon. Carry when seeking your twin flame. Place under your pillow to receive dream messages from your soul mirror.', properties: ['Attracts twin flame connections', 'Enhances feminine energy', 'Reveals soul contracts', 'Deepens intuition'], pairsWith: 'Rose Quartz' },
]

export default function CrystalsPage() {
  const [selected, setSelected] = useState<typeof CRYSTALS[0] | null>(null)
  const [filter, setFilter] = useState('all')

  const numbers = ['all', ...CRYSTALS.map(c => c.number)]
  const visible = filter === 'all' ? CRYSTALS : CRYSTALS.filter(c => c.number === filter)
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  if (selected) return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1rem', padding: 0 }}>← All Crystals</button>
      <div style={{ ...card, padding: '1.75rem', borderColor: 'rgba(201,168,76,0.2)', marginBottom: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{selected.emoji}</div>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>Angel Number {selected.number}</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>{selected.name}</h2>
          <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.82rem', fontStyle: 'italic' }}>{selected.aka}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[{ label: 'Element', value: selected.element }, { label: 'Chakra', value: selected.chakra }, { label: 'Pairs With', value: selected.pairsWith }].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', padding: '0.625rem', textAlign: 'center' }}>
              <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{s.label}</div>
              <div style={{ color: 'rgba(220,200,255,0.75)', fontSize: '0.72rem', fontWeight: 600 }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '0.875rem', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ color: '#c9a84c', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>✦ Affinity: {selected.affinity}</div>
          <p style={{ color: 'rgba(180,160,255,0.7)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>{selected.howToUse}</p>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.625rem' }}>Properties</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {selected.properties.map(p => (
              <span key={p} style={{ padding: '0.3rem 0.75rem', borderRadius: '2rem', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: 'rgba(200,180,255,0.7)', fontSize: '0.72rem' }}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Crystal Guide</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Sacred stones aligned with your angel numbers</p>
      </div>
      <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
        {numbers.map(n => (
          <button key={n} onClick={() => setFilter(n)} style={{ flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: '2rem', border: filter===n ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(200,180,255,0.12)', background: filter===n ? 'rgba(201,168,76,0.15)' : 'rgba(8,6,28,0.6)', color: filter===n ? '#c9a84c' : 'rgba(180,160,255,0.4)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>{n === 'all' ? 'All' : n}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem' }}>
        {visible.map(c => (
          <button key={c.number} onClick={() => setSelected(c)} style={{ ...card, padding: '1.25rem', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(200,180,255,0.1)', transition: 'all 0.2s' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{c.emoji}</div>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>{c.number}</div>
            <div style={{ color: 'rgba(220,200,255,0.85)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 400, marginBottom: '0.2rem' }}>{c.name}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem' }}>{c.affinity}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
