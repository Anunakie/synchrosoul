'use client';
import { useState } from 'react';

const FREQUENCIES = [
  { hz: 174, name: 'Foundation', color: '#6b7280', chakra: 'Earth Star',
    numbers: ['111','444'], element: 'Earth',
    effect: 'The lowest Solfeggio frequency acts as a natural anesthetic, reducing pain and stress. It gives organs a sense of security and love.',
    benefits: ['Pain relief','Stress reduction','Grounding','Security'],
    affirmation: 'I am safe and deeply rooted in the earth.' },
  { hz: 285, name: 'Quantum Cognition', color: '#8b5cf6', chakra: 'Root',
    numbers: ['333','777'], element: 'Earth',
    effect: 'Influences energy fields, sending them a message to restructure damaged organs. Leaves the body rejuvenated and energized.',
    benefits: ['Cellular healing','Energy field repair','Rejuvenation','Tissue regeneration'],
    affirmation: 'My body heals and renews itself perfectly.' },
  { hz: 396, name: 'Liberation', color: '#ef4444', chakra: 'Root',
    numbers: ['111','1111','444'], element: 'Earth',
    effect: 'Liberates you from fear and guilt. Cleanses the feeling of guilt which often represents one of the primary obstacles to realization.',
    benefits: ['Release fear','Clear guilt','Grounding','Liberation'],
    affirmation: 'I release all fear and guilt. I am free.' },
  { hz: 417, name: 'Transmutation', color: '#f97316', chakra: 'Sacral',
    numbers: ['222','555','1717'], element: 'Water',
    effect: 'Facilitates change and undoes situations and facilitates change. Cleanses traumatic experiences and clears destructive influences.',
    benefits: ['Facilitate change','Clear trauma','New beginnings','Transmutation'],
    affirmation: 'I embrace change and welcome new beginnings.' },
  { hz: 528, name: 'Miracle Tone', color: '#eab308', chakra: 'Solar Plexus',
    numbers: ['333','528','1111'], element: 'Fire',
    effect: 'Known as the Love frequency and Miracle tone. Repairs DNA, brings transformation and miracles into your life.',
    benefits: ['DNA repair','Transformation','Miracles','Love frequency'],
    affirmation: 'I am a miracle. Love flows through every cell of my being.' },
  { hz: 639, name: 'Harmonizing', color: '#22c55e', chakra: 'Heart',
    numbers: ['222','444','1212'], element: 'Air',
    effect: 'Enables creation of harmonious community and harmonious interpersonal relationships. Enhances communication, understanding, tolerance and love.',
    benefits: ['Harmonious relationships','Communication','Tolerance','Love'],
    affirmation: 'I attract and nurture harmonious, loving relationships.' },
  { hz: 741, name: 'Awakening', color: '#3b82f6', chakra: 'Throat',
    numbers: ['555','1155','777'], element: 'Ether',
    effect: 'Cleans the cells from electromagnetic radiation. Leads to a healthier, simpler life and awakens intuition.',
    benefits: ['Detoxification','Intuition','Problem solving','Awakening'],
    affirmation: 'I speak my truth and awaken to my highest wisdom.' },
  { hz: 852, name: 'Spiritual Order', color: '#6366f1', chakra: 'Third Eye',
    numbers: ['777','1111','888'], element: 'Light',
    effect: 'Returns spiritual order. Awakens intuition and enables you to see through illusions to the underlying reality.',
    benefits: ['Spiritual awakening','Intuition','See through illusions','Higher consciousness'],
    affirmation: 'I see clearly. My third eye is open and my intuition is strong.' },
  { hz: 963, name: 'Divine Connection', color: '#c9a84c', chakra: 'Crown',
    numbers: ['999','1111','777'], element: 'Consciousness',
    effect: 'Activates the pineal gland and raises positive energy and vibrations. Enables direct experience of the Oneness and our return to Oneness.',
    benefits: ['Pineal activation','Divine connection','Oneness','Enlightenment'],
    affirmation: 'I am one with the universe. I am divine light.' },
];

export default function SolfeggioPage() {
  const [selected, setSelected] = useState(FREQUENCIES[4]);
  const [playing, setPlaying] = useState(false);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Solfeggio Frequencies</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Ancient sacred tones for healing and spiritual awakening</p>
      </div>

      {/* Frequency Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
        {FREQUENCIES.map(f => (
          <button key={f.hz} onClick={() => setSelected(f)} style={{
            background: selected.hz === f.hz ? `${f.color}25` : 'rgba(255,255,255,0.04)',
            border: `1px solid ${selected.hz === f.hz ? f.color + '80' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: '1rem', padding: '1rem 0.75rem',
            cursor: 'pointer', textAlign: 'center',
            boxShadow: selected.hz === f.hz ? `0 0 20px ${f.color}20` : 'none',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: f.color, fontFamily: 'Cormorant Garamond, serif' }}>{f.hz}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.1rem' }}>Hz</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem', fontWeight: 600 }}>{f.name}</div>
          </button>
        ))}
      </div>

      {/* Detail Card */}
      <div style={{
        background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
        border: `1px solid ${selected.color}40`, padding: '2rem',
        backdropFilter: 'blur(12px)',
        boxShadow: `0 0 60px ${selected.color}15`
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: `radial-gradient(circle, ${selected.color}40, ${selected.color}10)`,
            border: `2px solid ${selected.color}60`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 30px ${selected.color}40`
          }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: selected.color }}>{selected.hz}</span>
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)' }}>Hz</span>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', fontFamily: 'Cormorant Garamond, serif' }}>{selected.name}</h2>
            <p style={{ color: selected.color, fontSize: '0.9rem' }}>{selected.chakra} Chakra · {selected.element}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {selected.numbers.map(n => (
              <span key={n} style={{
                background: `${selected.color}20`, border: `1px solid ${selected.color}50`,
                borderRadius: '999px', padding: '0.2rem 0.6rem',
                color: selected.color, fontSize: '0.8rem', fontWeight: 700
              }}>{n}</span>
            ))}
          </div>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>{selected.effect}</p>

        {/* Benefits */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {selected.benefits.map(b => (
            <span key={b} style={{
              background: `${selected.color}15`, border: `1px solid ${selected.color}30`,
              borderRadius: '999px', padding: '0.3rem 0.8rem',
              color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem'
            }}>{b}</span>
          ))}
        </div>

        {/* Affirmation */}
        <div style={{
          background: `${selected.color}10`, borderRadius: '1rem',
          padding: '1rem 1.25rem', borderLeft: `3px solid ${selected.color}`,
          marginBottom: '1.5rem'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>“{selected.affirmation}”</p>
        </div>

        {/* Visualization bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '48px', justifyContent: 'center' }}>
          {Array.from({length: 32}, (_, i) => {
            const h = Math.sin(i * 0.4 + selected.hz * 0.01) * 0.5 + 0.5;
            return (
              <div key={i} style={{
                width: '6px', height: `${Math.max(8, h * 48)}px`,
                background: `${selected.color}${playing ? 'cc' : '40'}`,
                borderRadius: '3px',
                transition: 'all 0.3s'
              }} />
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => setPlaying(!playing)} style={{
            padding: '0.6rem 2rem', borderRadius: '999px', cursor: 'pointer',
            background: playing ? 'rgba(255,255,255,0.1)' : selected.color,
            color: playing ? 'rgba(255,255,255,0.8)' : '#000',
            border: playing ? '1px solid rgba(255,255,255,0.2)' : 'none',
            fontSize: '0.9rem', fontWeight: 700
          }}>{playing ? '⏸ Pause Visualization' : '▶ Visualize Frequency'}</button>
        </div>
      </div>
    </div>
  );
}