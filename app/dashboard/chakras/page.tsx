'use client';
import { useState } from 'react';

const CHAKRAS = [
  {
    id: 'root', name: 'Root Chakra', sanskrit: 'Muladhara', number: 1,
    color: '#ef4444', position: 'Base of spine', element: 'Earth',
    angelNumbers: ['111', '444', '1111'],
    affirmation: 'I am safe, grounded, and supported by the universe.',
    blocked: 'Fear, anxiety, financial insecurity, feeling ungrounded',
    open: 'Stability, security, physical vitality, feeling at home',
    crystals: ['Red Jasper', 'Black Tourmaline', 'Hematite', 'Garnet'],
    frequency: '396 Hz',
    practices: ['Walking barefoot on earth', 'Grounding meditation', 'Physical exercise', 'Eating root vegetables'],
    emoji: '🔴'
  },
  {
    id: 'sacral', name: 'Sacral Chakra', sanskrit: 'Svadhisthana', number: 2,
    color: '#f97316', position: 'Lower abdomen', element: 'Water',
    angelNumbers: ['222', '2222', '525'],
    affirmation: 'I embrace pleasure, creativity, and the flow of life.',
    blocked: 'Emotional numbness, creative blocks, intimacy issues',
    open: 'Creative flow, emotional balance, sensual joy, passion',
    crystals: ['Carnelian', 'Orange Calcite', 'Sunstone', 'Tiger Eye'],
    frequency: '417 Hz',
    practices: ['Dance and movement', 'Creative expression', 'Water immersion', 'Journaling emotions'],
    emoji: '🟠'
  },
  {
    id: 'solar', name: 'Solar Plexus', sanskrit: 'Manipura', number: 3,
    color: '#eab308', position: 'Upper abdomen', element: 'Fire',
    angelNumbers: ['333', '3333', '555'],
    affirmation: 'I am powerful, confident, and worthy of all good things.',
    blocked: 'Low self-esteem, lack of purpose, digestive issues',
    open: 'Personal power, confidence, clear purpose, strong will',
    crystals: ['Citrine', 'Yellow Jasper', 'Pyrite', 'Amber'],
    frequency: '528 Hz',
    practices: ['Core strengthening', 'Sun gazing', 'Setting boundaries', 'Breathwork'],
    emoji: '🟡'
  },
  {
    id: 'heart', name: 'Heart Chakra', sanskrit: 'Anahata', number: 4,
    color: '#22c55e', position: 'Center of chest', element: 'Air',
    angelNumbers: ['444', '4444', '222', '1212'],
    affirmation: 'I give and receive love freely and unconditionally.',
    blocked: 'Grief, loneliness, inability to forgive, codependency',
    open: 'Unconditional love, compassion, deep connections, inner peace',
    crystals: ['Rose Quartz', 'Green Aventurine', 'Malachite', 'Rhodonite'],
    frequency: '639 Hz',
    practices: ['Heart-opening yoga', 'Forgiveness meditation', 'Acts of kindness', 'Time in nature'],
    emoji: '💚'
  },
  {
    id: 'throat', name: 'Throat Chakra', sanskrit: 'Vishuddha', number: 5,
    color: '#3b82f6', position: 'Throat', element: 'Ether',
    angelNumbers: ['555', '5555', '1155'],
    affirmation: 'I speak my truth with clarity, love, and confidence.',
    blocked: 'Fear of speaking, dishonesty, inability to express feelings',
    open: 'Clear communication, authentic expression, creative voice',
    crystals: ['Blue Lace Agate', 'Aquamarine', 'Sodalite', 'Lapis Lazuli'],
    frequency: '741 Hz',
    practices: ['Singing or chanting', 'Journaling', 'Speaking affirmations aloud', 'Neck stretches'],
    emoji: '🔵'
  },
  {
    id: 'third-eye', name: 'Third Eye', sanskrit: 'Ajna', number: 6,
    color: '#8b5cf6', position: 'Between eyebrows', element: 'Light',
    angelNumbers: ['666', '6666', '1111', '777'],
    affirmation: 'I trust my intuition and see the truth in all things.',
    blocked: 'Lack of intuition, confusion, inability to see the bigger picture',
    open: 'Strong intuition, clarity, psychic awareness, wisdom',
    crystals: ['Amethyst', 'Labradorite', 'Fluorite', 'Iolite'],
    frequency: '852 Hz',
    practices: ['Meditation', 'Dream journaling', 'Stargazing', 'Visualization'],
    emoji: '🟣'
  },
  {
    id: 'crown', name: 'Crown Chakra', sanskrit: 'Sahasrara', number: 7,
    color: '#c9a84c', position: 'Top of head', element: 'Consciousness',
    angelNumbers: ['777', '7777', '999', '1111'],
    affirmation: 'I am divinely connected to the universe and all that is.',
    blocked: 'Spiritual disconnection, cynicism, feeling lost or purposeless',
    open: 'Divine connection, enlightenment, unity consciousness, bliss',
    crystals: ['Clear Quartz', 'Selenite', 'Moonstone', 'Diamond'],
    frequency: '963 Hz',
    practices: ['Silent meditation', 'Prayer', 'Fasting', 'Spending time in silence'],
    emoji: '✨'
  }
];

export default function ChakrasPage() {
  const [selected, setSelected] = useState(CHAKRAS[3]);
  const [tab, setTab] = useState<'info'|'crystals'|'practices'>('info');

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Chakra Alignment</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Align your energy centers with your angel numbers</p>
      </div>

      {/* Chakra Spine Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {CHAKRAS.map(c => (
          <button
            key={c.id}
            onClick={() => setSelected(c)}
            style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: selected.id === c.id ? c.color : 'rgba(255,255,255,0.08)',
              border: `2px solid ${c.color}`,
              cursor: 'pointer', fontSize: '1.4rem',
              boxShadow: selected.id === c.id ? `0 0 20px ${c.color}80` : 'none',
              transition: 'all 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title={c.name}
          >
            {c.emoji}
          </button>
        ))}
      </div>

      {/* Selected Chakra Card */}
      <div style={{
        background: 'rgba(8,6,28,0.85)', borderRadius: '1.5rem',
        border: `1px solid ${selected.color}40`,
        padding: '2rem', backdropFilter: 'blur(12px)',
        boxShadow: `0 0 40px ${selected.color}20`
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: `radial-gradient(circle, ${selected.color}, ${selected.color}60)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', boxShadow: `0 0 30px ${selected.color}60`
          }}>{selected.emoji}</div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', fontFamily: 'Cormorant Garamond, serif' }}>{selected.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{selected.sanskrit} · {selected.position} · {selected.element}</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ color: selected.color, fontSize: '1.1rem', fontWeight: 700 }}>{selected.frequency}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Solfeggio</div>
          </div>
        </div>

        {/* Angel Numbers */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>ANGEL NUMBERS</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {selected.angelNumbers.map(n => (
              <span key={n} style={{
                background: `${selected.color}20`, border: `1px solid ${selected.color}60`,
                borderRadius: '999px', padding: '0.25rem 0.75rem',
                color: selected.color, fontSize: '0.9rem', fontWeight: 700
              }}>{n}</span>
            ))}
          </div>
        </div>

        {/* Affirmation */}
        <div style={{
          background: `${selected.color}10`, borderRadius: '1rem',
          padding: '1rem 1.25rem', marginBottom: '1.5rem',
          borderLeft: `3px solid ${selected.color}`
        }}>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', fontSize: '1rem', fontFamily: 'Cormorant Garamond, serif' }}>“{selected.affirmation}”</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['info','crystals','practices'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.4rem 1rem', borderRadius: '999px', cursor: 'pointer',
              background: tab === t ? selected.color : 'rgba(255,255,255,0.08)',
              color: tab === t ? '#000' : 'rgba(255,255,255,0.6)',
              border: 'none', fontSize: '0.85rem', fontWeight: 600,
              textTransform: 'capitalize'
            }}>{t}</button>
          ))}
        </div>

        {tab === 'info' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1rem', padding: '1rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>WHEN BLOCKED</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{selected.blocked}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '1rem', padding: '1rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>WHEN OPEN</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{selected.open}</p>
            </div>
          </div>
        )}

        {tab === 'crystals' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {selected.crystals.map(c => (
              <div key={c} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '1rem',
                padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>💎</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{c}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'practices' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {selected.practices.map((p, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '1rem',
                padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: `${selected.color}30`, color: selected.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, flexShrink: 0
                }}>{i+1}</span>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>{p}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Chakras Grid */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>ALL CHAKRAS</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {CHAKRAS.map(c => (
            <button key={c.id} onClick={() => setSelected(c)} style={{
              background: selected.id === c.id ? `${c.color}15` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${selected.id === c.id ? c.color + '60' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '1rem', padding: '0.75rem 1rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              cursor: 'pointer', textAlign: 'left', width: '100%'
            }}>
              <span style={{ fontSize: '1.2rem' }}>{c.emoji}</span>
              <div style={{ flex: 1 }}>
                <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{c.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{c.sanskrit}</span>
              </div>
              <span style={{ color: c.color, fontSize: '0.8rem' }}>{c.frequency}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}