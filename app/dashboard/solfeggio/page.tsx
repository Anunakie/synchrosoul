'use client';
import { useState } from 'react';

const FREQUENCIES = [
  { hz: 174, name: 'Foundation', color: '#ef4444', emoji: '🔴', angel: '444',
    benefit: 'Reduces pain and stress. Gives organs a sense of security and love.',
    chakra: 'Root', element: 'Earth', affirmation: 'I am safe, grounded, and secure.' },
  { hz: 285, name: 'Quantum Cognition', color: '#f97316', emoji: '🟠', angel: '333',
    benefit: 'Influences energy fields, rejuvenates tissues and organs.',
    chakra: 'Sacral', element: 'Water', affirmation: 'I am whole, healed, and restored.' },
  { hz: 396, name: 'Liberation', color: '#eab308', emoji: '🟡', angel: '999',
    benefit: 'Liberates guilt and fear. Turns grief into joy.',
    chakra: 'Solar Plexus', element: 'Fire', affirmation: 'I release all fear and guilt. I am free.' },
  { hz: 417, name: 'Transformation', color: '#84cc16', emoji: '🟢', angel: '555',
    benefit: 'Facilitates change. Clears traumatic experiences.',
    chakra: 'Heart', element: 'Air', affirmation: 'I embrace change and transformation.' },
  { hz: 432, name: 'Universal Harmony', color: '#22c55e', emoji: '💚', angel: '777',
    benefit: 'Tuned to the heartbeat of the Earth. Promotes peace and clarity.',
    chakra: 'Heart', element: 'Air', affirmation: 'I am in harmony with all of creation.' },
  { hz: 528, name: 'Miracle Tone', color: '#10b981', emoji: '✨', angel: '1111',
    benefit: 'DNA repair frequency. The love frequency. Transformation and miracles.',
    chakra: 'Heart', element: 'Air', affirmation: 'I am a miracle. Love flows through every cell.' },
  { hz: 639, name: 'Connection', color: '#06b6d4', emoji: '🔵', angel: '222',
    benefit: 'Enhances communication, understanding, tolerance and love.',
    chakra: 'Throat', element: 'Sound', affirmation: 'I communicate with love and clarity.' },
  { hz: 741, name: 'Awakening', color: '#3b82f6', emoji: '💙', angel: '1212',
    benefit: 'Awakens intuition. Cleanses cells from toxins.',
    chakra: 'Third Eye', element: 'Light', affirmation: 'My intuition is clear and powerful.' },
  { hz: 852, name: 'Spiritual Order', color: '#6366f1', emoji: '🟣', angel: '888',
    benefit: 'Returns to spiritual order. Awakens inner strength.',
    chakra: 'Third Eye', element: 'Light', affirmation: 'I am aligned with divine spiritual order.' },
  { hz: 963, name: 'Divine Consciousness', color: '#8b5cf6', emoji: '👑', angel: '9999',
    benefit: 'Activates the pineal gland. Connects to higher consciousness.',
    chakra: 'Crown', element: 'Thought', affirmation: 'I am one with divine consciousness.' },
];

export default function SolfeggioPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);

  const freq = selected !== null ? FREQUENCIES[selected] : null;

  const togglePlay = (hz: number) => {
    setPlaying(p => p === hz ? null : hz);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', fontFamily: 'Cormorant Garamond, serif' }}>Solfeggio Frequencies</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Sacred healing tones aligned with angel numbers</p>
      </div>

      {/* 528 Hz hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(8,6,28,0.95))',
        borderRadius: '1.5rem', border: '1px solid rgba(16,185,129,0.25)',
        padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem',
        display: 'flex', alignItems: 'center', gap: '1.25rem'
      }}>
        <div style={{ fontSize: '3rem' }}>✨</div>
        <div style={{ flex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.2rem' }}>Featured Frequency</p>
          <h2 style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>528 Hz — The Miracle Tone</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: '0.25rem' }}>DNA repair · Love frequency · Transformation</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981', fontFamily: 'Cormorant Garamond, serif' }}>528</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>Hz</div>
        </div>
      </div>

      {/* Detail panel */}
      {freq && (
        <div style={{
          background: `${freq.color}10`, borderRadius: '1.5rem',
          border: `1px solid ${freq.color}25`, padding: '1.5rem',
          backdropFilter: 'blur(12px)', marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{freq.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: freq.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{freq.hz}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Hz</span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{freq.name}</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '999px', width: '2rem', height: '2rem', cursor: 'pointer', color: 'rgba(255,255,255,0.4)' }}>✕</button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>{freq.benefit}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
            {[
              { label: 'Chakra', value: freq.chakra },
              { label: 'Element', value: freq.element },
              { label: 'Angel Number', value: freq.angel },
            ].map(item => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{item.label}</p>
                <p style={{ color: freq.color, fontWeight: 700, fontSize: '0.85rem' }}>{item.value}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.875rem', borderLeft: `3px solid ${freq.color}` }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Affirmation</p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', fontStyle: 'italic' }}>&ldquo;{freq.affirmation}&rdquo;</p>
          </div>
        </div>
      )}

      {/* Frequency grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {FREQUENCIES.map((f, i) => (
          <div key={f.hz} onClick={() => setSelected(selected === i ? null : i)} style={{
            background: selected === i ? `${f.color}12` : 'rgba(8,6,28,0.88)',
            borderRadius: '1.25rem',
            border: selected === i ? `1px solid ${f.color}30` : '1px solid rgba(255,255,255,0.07)',
            padding: '1rem 1.25rem', cursor: 'pointer', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', gap: '1rem'
          }}>
            <span style={{ fontSize: '1.5rem', width: '2rem', textAlign: 'center' }}>{f.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: f.color, fontFamily: 'Cormorant Garamond, serif' }}>{f.hz} Hz</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: 600 }}>{f.name}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginTop: '0.1rem' }}>{f.chakra} · {f.element}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ background: `${f.color}15`, border: `1px solid ${f.color}25`, borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.68rem', color: f.color }}>{f.angel}</span>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>{selected === i ? '▲' : '▼'}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', lineHeight: 1.6 }}>🎵 Use these frequencies with headphones for best results. Search YouTube or Spotify for &ldquo;528 Hz solfeggio&rdquo; or any frequency above.</p>
      </div>
    </div>
  );
}