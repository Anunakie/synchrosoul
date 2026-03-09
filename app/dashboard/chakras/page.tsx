'use client';
import { useState } from 'react';

const CHAKRAS = [
  {
    id: 'root', name: 'Root Chakra', sanskrit: 'Muladhara', number: 1,
    color: '#ef4444', emoji: '🔴', location: 'Base of spine',
    element: 'Earth', sense: 'Smell', angel: '444',
    balanced: 'Grounded, secure, stable, safe, present',
    blocked: 'Fear, anxiety, insecurity, financial stress',
    affirmation: 'I am safe. I am grounded. I belong here.',
    practices: ['Walk barefoot on grass', 'Eat red foods', 'Practice 444 breathing', 'Spend time in nature'],
    crystals: ['Red Jasper', 'Black Tourmaline', 'Hematite', 'Obsidian'],
    solfeggio: 396,
  },
  {
    id: 'sacral', name: 'Sacral Chakra', sanskrit: 'Svadhisthana', number: 2,
    color: '#f97316', emoji: '🟠', location: 'Lower abdomen',
    element: 'Water', sense: 'Taste', angel: '333',
    balanced: 'Creative, passionate, joyful, emotionally fluid',
    blocked: 'Guilt, shame, creative blocks, emotional numbness',
    affirmation: 'I embrace pleasure and creativity. I flow with life.',
    practices: ['Dance freely', 'Create art', 'Swim or bathe', 'Journal emotions'],
    crystals: ['Carnelian', 'Orange Calcite', 'Sunstone', 'Tiger Eye'],
    solfeggio: 417,
  },
  {
    id: 'solar', name: 'Solar Plexus', sanskrit: 'Manipura', number: 3,
    color: '#eab308', emoji: '🟡', location: 'Upper abdomen',
    element: 'Fire', sense: 'Sight', angel: '111',
    balanced: 'Confident, powerful, purposeful, self-disciplined',
    blocked: 'Low self-esteem, powerlessness, victim mentality',
    affirmation: 'I am powerful. I am worthy. I stand in my truth.',
    practices: ['Sun gazing at sunrise', 'Core exercises', 'Set boundaries', 'Speak your truth'],
    crystals: ['Citrine', 'Yellow Jasper', 'Pyrite', 'Amber'],
    solfeggio: 528,
  },
  {
    id: 'heart', name: 'Heart Chakra', sanskrit: 'Anahata', number: 4,
    color: '#22c55e', emoji: '💚', location: 'Center of chest',
    element: 'Air', sense: 'Touch', angel: '222',
    balanced: 'Loving, compassionate, forgiving, connected',
    blocked: 'Grief, loneliness, bitterness, inability to love',
    affirmation: 'I give and receive love freely. My heart is open.',
    practices: ['Practice forgiveness', 'Hug someone', 'Gratitude journaling', 'Heart-opening yoga'],
    crystals: ['Rose Quartz', 'Green Aventurine', 'Malachite', 'Rhodonite'],
    solfeggio: 639,
  },
  {
    id: 'throat', name: 'Throat Chakra', sanskrit: 'Vishuddha', number: 5,
    color: '#06b6d4', emoji: '🔵', location: 'Throat',
    element: 'Sound', sense: 'Hearing', angel: '555',
    balanced: 'Expressive, honest, clear communicator, authentic',
    blocked: 'Fear of speaking, lying, inability to express self',
    affirmation: 'I speak my truth with love and clarity.',
    practices: ['Sing or hum', 'Write in journal', 'Speak affirmations aloud', 'Neck stretches'],
    crystals: ['Blue Lace Agate', 'Sodalite', 'Aquamarine', 'Lapis Lazuli'],
    solfeggio: 741,
  },
  {
    id: 'third-eye', name: 'Third Eye', sanskrit: 'Ajna', number: 6,
    color: '#6366f1', emoji: '👁️', location: 'Between eyebrows',
    element: 'Light', sense: 'Intuition', angel: '777',
    balanced: 'Intuitive, visionary, clear-sighted, wise',
    blocked: 'Confusion, lack of direction, poor intuition',
    affirmation: 'I trust my intuition. I see clearly.',
    practices: ['Meditation', 'Stargazing', 'Dream journaling', 'Visualization'],
    crystals: ['Amethyst', 'Labradorite', 'Fluorite', 'Iolite'],
    solfeggio: 852,
  },
  {
    id: 'crown', name: 'Crown Chakra', sanskrit: 'Sahasrara', number: 7,
    color: '#8b5cf6', emoji: '👑', location: 'Top of head',
    element: 'Thought', sense: 'Cosmic consciousness', angel: '999',
    balanced: 'Spiritually connected, enlightened, at peace',
    blocked: 'Disconnection, cynicism, spiritual crisis',
    affirmation: 'I am one with the divine. I am pure consciousness.',
    practices: ['Silent meditation', 'Prayer', 'Fasting', 'Spend time in silence'],
    crystals: ['Clear Quartz', 'Selenite', 'Amethyst', 'Moonstone'],
    solfeggio: 963,
  },
];

export default function ChakrasPage() {
  const [selected, setSelected] = useState<string>('heart');
  const chakra = CHAKRAS.find(c => c.id === selected)!;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'Cormorant Garamond, serif' }}>Chakra System</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Balance your energy centers with angel numbers</p>
      </div>

      {/* Chakra spine selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {CHAKRAS.map(c => (
          <button key={c.id} onClick={() => setSelected(c.id)} style={{
            width: '44px', height: '44px', borderRadius: '50%', cursor: 'pointer',
            background: selected === c.id ? `${c.color}30` : 'rgba(255,255,255,0.04)',
            border: selected === c.id ? `2px solid ${c.color}` : '1px solid rgba(255,255,255,0.1)',
            fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: selected === c.id ? `0 0 20px ${c.color}40` : 'none',
            transition: 'all 0.2s'
          }}>{c.emoji}</button>
        ))}
      </div>

      {/* Selected chakra detail */}
      <div style={{
        background: `${chakra.color}10`, borderRadius: '1.5rem',
        border: `1px solid ${chakra.color}25`, padding: '1.5rem',
        backdropFilter: 'blur(12px)', marginBottom: '1.25rem',
        boxShadow: `0 0 40px ${chakra.color}08`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: `${chakra.color}20`, border: `2px solid ${chakra.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem',
            boxShadow: `0 0 30px ${chakra.color}30`
          }}>{chakra.emoji}</div>
          <div>
            <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{chakra.name}</h2>
            <p style={{ color: chakra.color, fontSize: '0.85rem' }}>{chakra.sanskrit} · Chakra {chakra.number}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {[
            { label: 'Location', value: chakra.location },
            { label: 'Element', value: chakra.element },
            { label: 'Angel Number', value: chakra.angel },
          ].map(item => (
            <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{item.label}</p>
              <p style={{ color: chakra.color, fontWeight: 700, fontSize: '0.82rem' }}>{item.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.875rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>When Balanced</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', lineHeight: 1.5 }}>{chakra.balanced}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.875rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>When Blocked</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', lineHeight: 1.5 }}>{chakra.blocked}</p>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.875rem', borderLeft: `3px solid ${chakra.color}`, marginBottom: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Affirmation</p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>&ldquo;{chakra.affirmation}&rdquo;</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.875rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Healing Practices</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {chakra.practices.map(p => (
                <li key={p} style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <span style={{ color: chakra.color, flexShrink: 0 }}>✦</span>{p}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.875rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Crystals</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {chakra.crystals.map(c => (
                <span key={c} style={{ background: `${chakra.color}12`, border: `1px solid ${chakra.color}20`, borderRadius: '999px', padding: '0.2rem 0.5rem', fontSize: '0.68rem', color: chakra.color }}>💎 {c}</span>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '0.75rem' }}>Solfeggio: {chakra.solfeggio} Hz</p>
          </div>
        </div>
      </div>
    </div>
  );
}