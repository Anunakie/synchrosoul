'use client';
import { useState } from 'react';

const CRYSTALS = [
  { name: 'Amethyst', color: '#8b5cf6', chakra: 'Third Eye', numbers: ['777','1111','333'], element: 'Air',
    properties: ['Intuition','Protection','Spiritual growth','Clarity'],
    meaning: "The stone of spiritual protection and purification. Amethyst opens the third eye and enhances psychic abilities.",
    affirmation: "I trust my intuition and am divinely guided.", emoji: '💜', hardness: '7' },
  { name: 'Rose Quartz', color: '#f9a8d4', chakra: 'Heart', numbers: ['222','444','1212'], element: 'Water',
    properties: ['Unconditional love','Self-love','Compassion','Healing'],
    meaning: "The stone of universal love. Rose Quartz opens the heart to all forms of love and promotes deep inner healing.",
    affirmation: "I am worthy of love and I give love freely.", emoji: '🌸', hardness: '7' },
  { name: 'Clear Quartz', color: '#e0f2fe', chakra: 'Crown', numbers: ['1111','111','999'], element: 'All',
    properties: ['Amplification','Clarity','Manifestation','Healing'],
    meaning: "The master healer. Clear Quartz amplifies energy and intention, connecting you to higher consciousness.",
    affirmation: "I am clear, focused, and aligned with my highest purpose.", emoji: '🔮', hardness: '7' },
  { name: 'Black Tourmaline', color: '#374151', chakra: 'Root', numbers: ['444','111','1111'], element: 'Earth',
    properties: ['Protection','Grounding','Purification','Security'],
    meaning: "The ultimate protection stone. Black Tourmaline creates a shield against negative energies and grounds your energy.",
    affirmation: "I am safe, protected, and deeply grounded.", emoji: '🖤', hardness: '7-7.5' },
  { name: 'Citrine', color: '#fbbf24', chakra: 'Solar Plexus', numbers: ['333','555','888'], element: 'Fire',
    properties: ['Abundance','Confidence','Creativity','Joy'],
    meaning: "The merchant stone of abundance. Citrine carries the energy of the sun, bringing warmth, joy, and prosperity.",
    affirmation: "I attract abundance and radiate golden light.", emoji: '💛', hardness: '7' },
  { name: 'Lapis Lazuli', color: '#1d4ed8', chakra: 'Throat', numbers: ['555','1155','333'], element: 'Water',
    properties: ['Truth','Wisdom','Communication','Enlightenment'],
    meaning: "The stone of truth and enlightenment. Lapis Lazuli stimulates wisdom and good judgment in the practical world.",
    affirmation: "I speak my truth with wisdom and clarity.", emoji: '💙', hardness: '5-6' },
  { name: 'Moonstone', color: '#c7d2fe', chakra: 'Crown', numbers: ['222','1222','777'], element: 'Water',
    properties: ['Intuition','New beginnings','Feminine energy','Cycles'],
    meaning: "The stone of new beginnings. Moonstone is strongly connected to the moon and to intuition, enhancing psychic abilities.",
    affirmation: "I flow with the cycles of life and trust new beginnings.", emoji: '🌙', hardness: '6-6.5' },
  { name: 'Labradorite', color: '#0891b2', chakra: 'Third Eye', numbers: ['1111','777','1212'], element: 'Water',
    properties: ['Magic','Transformation','Protection','Awakening'],
    meaning: "The stone of magic and transformation. Labradorite awakens your inner magic and protects your aura.",
    affirmation: "I embrace transformation and trust the magic within me.", emoji: '✨', hardness: '6-6.5' },
  { name: 'Selenite', color: '#f8fafc', chakra: 'Crown', numbers: ['999','1111','777'], element: 'Air',
    properties: ['Cleansing','Peace','Higher consciousness','Clarity'],
    meaning: "The stone of mental clarity and higher consciousness. Selenite cleanses and charges other crystals.",
    affirmation: "I am clear, peaceful, and connected to divine light.", emoji: '🤍', hardness: '2' },
  { name: 'Carnelian', color: '#ea580c', chakra: 'Sacral', numbers: ['222','333','555'], element: 'Fire',
    properties: ['Courage','Creativity','Motivation','Vitality'],
    meaning: "The stone of motivation and endurance. Carnelian stimulates creativity and gives courage to take action.",
    affirmation: "I am bold, creative, and full of vital energy.", emoji: '🔶', hardness: '7' },
  { name: 'Malachite', color: '#16a34a', chakra: 'Heart', numbers: ['444','1212','888'], element: 'Earth',
    properties: ['Transformation','Protection','Healing','Growth'],
    meaning: "The stone of transformation. Malachite absorbs negative energies and pollutants from the body and environment.",
    affirmation: "I embrace change and grow through every experience.", emoji: '💚', hardness: '3.5-4' },
  { name: 'Pyrite', color: '#ca8a04', chakra: 'Solar Plexus', numbers: ['888','333','1111'], element: 'Earth',
    properties: ['Abundance','Confidence','Manifestation','Willpower'],
    meaning: "Fool's gold with real power. Pyrite is a powerful manifestation stone that attracts wealth and abundance.",
    affirmation: "I manifest abundance with confidence and willpower.", emoji: '⭐', hardness: '6-6.5' },
];

const CHAKRA_COLORS: Record<string, string> = {
  'Root': '#ef4444', 'Sacral': '#f97316', 'Solar Plexus': '#eab308',
  'Heart': '#22c55e', 'Throat': '#3b82f6', 'Third Eye': '#8b5cf6', 'Crown': '#c9a84c'
};

export default function CrystalsPage() {
  const [selected, setSelected] = useState(CRYSTALS[0]);
  const [filter, setFilter] = useState('All');
  const chakras = ['All', 'Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'];
  const filtered = filter === 'All' ? CRYSTALS : CRYSTALS.filter(c => c.chakra === filter);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Crystal Guide</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Discover crystals aligned with your angel numbers</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
        {chakras.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: '0.35rem 0.85rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem',
            background: filter === c ? (CHAKRA_COLORS[c] || '#c9a84c') : 'rgba(255,255,255,0.08)',
            color: filter === c ? '#000' : 'rgba(255,255,255,0.7)',
            border: 'none', fontWeight: 600
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Crystal Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map(c => (
            <button key={c.name} onClick={() => setSelected(c)} style={{
              background: selected.name === c.name ? `${c.color}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selected.name === c.name ? c.color + '80' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '1rem', padding: '0.75rem 1rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              cursor: 'pointer', textAlign: 'left', width: '100%'
            }}>
              <span style={{ fontSize: '1.5rem' }}>{c.emoji}</span>
              <div>
                <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{c.name}</div>
                <div style={{ color: CHAKRA_COLORS[c.chakra] || '#c9a84c', fontSize: '0.75rem' }}>{c.chakra}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div style={{
          background: 'rgba(8,6,28,0.85)', borderRadius: '1.5rem',
          border: `1px solid ${selected.color}40`, padding: '1.5rem',
          backdropFilter: 'blur(12px)', position: 'sticky', top: '1rem',
          alignSelf: 'start'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{selected.emoji}</div>
            <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{selected.name}</h2>
            <div style={{ color: CHAKRA_COLORS[selected.chakra] || '#c9a84c', fontSize: '0.85rem' }}>{selected.chakra} Chakra · {selected.element}</div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{selected.meaning}</p>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>ANGEL NUMBERS</p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {selected.numbers.map(n => (
                <span key={n} style={{
                  background: `${selected.color}20`, border: `1px solid ${selected.color}60`,
                  borderRadius: '999px', padding: '0.2rem 0.6rem',
                  color: selected.color, fontSize: '0.8rem', fontWeight: 700
                }}>{n}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>PROPERTIES</p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {selected.properties.map(p => (
                <span key={p} style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: '999px',
                  padding: '0.2rem 0.6rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem'
                }}>{p}</span>
              ))}
            </div>
          </div>

          <div style={{
            background: `${selected.color}10`, borderRadius: '0.75rem',
            padding: '0.75rem', borderLeft: `3px solid ${selected.color}`
          }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', fontSize: '0.85rem', fontFamily: 'Cormorant Garamond, serif' }}>“{selected.affirmation}”</p>
          </div>
        </div>
      </div>
    </div>
  );
}