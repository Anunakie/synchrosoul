'use client';
import { useState } from 'react';

const chakras = [
  { name: 'Root', sanskrit: 'Muladhara', emoji: '🔴', color: '#e53e3e', hz: 396, number: '1', location: 'Base of spine', element: 'Earth', affirmation: 'I am safe, grounded, and secure', blocked: 'Fear, anxiety, financial stress', open: 'Stability, security, belonging', crystals: ['Red Jasper', 'Black Tourmaline', 'Hematite'], angelNumbers: ['111', '444'] },
  { name: 'Sacral', sanskrit: 'Svadhisthana', emoji: '🟠', color: '#ed8936', hz: 417, number: '2', location: 'Below navel', element: 'Water', affirmation: 'I embrace pleasure and creative flow', blocked: 'Guilt, emotional numbness, creative blocks', open: 'Creativity, passion, joy', crystals: ['Carnelian', 'Orange Calcite', 'Sunstone'], angelNumbers: ['222', '555'] },
  { name: 'Solar Plexus', sanskrit: 'Manipura', emoji: '🟡', color: '#ecc94b', hz: 528, number: '3', location: 'Upper abdomen', element: 'Fire', affirmation: 'I am powerful, confident, and free', blocked: 'Shame, low self-worth, powerlessness', open: 'Confidence, willpower, purpose', crystals: ['Citrine', 'Tiger Eye', 'Yellow Jasper'], angelNumbers: ['333', '888'] },
  { name: 'Heart', sanskrit: 'Anahata', emoji: '💚', color: '#48bb78', hz: 639, number: '4', location: 'Center of chest', element: 'Air', affirmation: 'I give and receive love freely', blocked: 'Grief, loneliness, inability to forgive', open: 'Love, compassion, connection', crystals: ['Rose Quartz', 'Green Aventurine', 'Malachite'], angelNumbers: ['444', '1111'] },
  { name: 'Throat', sanskrit: 'Vishuddha', emoji: '🔵', color: '#4299e1', hz: 741, number: '5', location: 'Throat', element: 'Sound', affirmation: 'I speak my truth with clarity and love', blocked: 'Lies, fear of speaking, suppressed voice', open: 'Clear communication, authenticity', crystals: ['Blue Lace Agate', 'Sodalite', 'Aquamarine'], angelNumbers: ['555', '777'] },
  { name: 'Third Eye', sanskrit: 'Ajna', emoji: '🟣', color: '#805ad5', hz: 852, number: '6', location: 'Between eyebrows', element: 'Light', affirmation: 'I trust my intuition and inner wisdom', blocked: 'Confusion, lack of intuition, overthinking', open: 'Intuition, clarity, psychic awareness', crystals: ['Amethyst', 'Lapis Lazuli', 'Fluorite'], angelNumbers: ['666', '1111'] },
  { name: 'Crown', sanskrit: 'Sahasrara', emoji: '⚪', color: '#b794f4', hz: 963, number: '7', location: 'Top of head', element: 'Thought', affirmation: 'I am connected to divine wisdom and light', blocked: 'Disconnection, cynicism, spiritual emptiness', open: 'Enlightenment, unity, divine connection', crystals: ['Clear Quartz', 'Selenite', 'Amethyst'], angelNumbers: ['777', '999', '000'] },
];

export default function ChakrasPage() {
  const [selected, setSelected] = useState(3);
  const c = chakras[selected];
  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>⚡ Chakra Guide</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Align your energy centers with angel numbers</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {chakras.map((ch, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ width: '44px', height: '44px', borderRadius: '50%', border: selected === i ? '3px solid white' : '2px solid rgba(255,255,255,0.2)', background: ch.color, cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', transform: selected === i ? 'scale(1.2)' : 'scale(1)' }} title={ch.name}>{ch.emoji}</button>
        ))}
      </div>

      <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid ' + c.color + '44', borderRadius: '1.25rem', padding: '1.75rem', backdropFilter: 'blur(12px)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: c.color + '33', border: '2px solid ' + c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0 }}>{c.emoji}</div>
          <div>
            <h2 style={{ color: c.color, fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>{c.name} Chakra</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.85rem' }}>{c.sanskrit} · {c.location} · {c.hz}Hz</p>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem', borderLeft: '3px solid ' + c.color }}>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>“{c.affirmation}”</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(255,100,100,0.08)', borderRadius: '0.75rem', padding: '0.75rem' }}>
            <div style={{ color: '#fc8181', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>🔒 When Blocked</div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>{c.blocked}</p>
          </div>
          <div style={{ background: 'rgba(100,255,100,0.08)', borderRadius: '0.75rem', padding: '0.75rem' }}>
            <div style={{ color: '#68d391', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>✨ When Open</div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>{c.open}</p>
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>💎 Healing Crystals</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {c.crystals.map(cr => <span key={cr} style={{ background: c.color + '22', color: c.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', border: '1px solid ' + c.color + '44' }}>{cr}</span>)}
          </div>
        </div>
        <div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>🔢 Angel Numbers</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {c.angelNumbers.map(n => <span key={n} style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.85rem', border: '1px solid rgba(201,168,76,0.3)' }}>{n}</span>)}
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(10px)' }}>
        <h3 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>All 7 Chakras</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {chakras.map((ch, i) => (
            <button key={i} onClick={() => setSelected(i)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '0.6rem', background: selected === i ? ch.color + '22' : 'transparent', border: selected === i ? '1px solid ' + ch.color + '44' : '1px solid transparent', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <span style={{ fontSize: '1.1rem' }}>{ch.emoji}</span>
              <span style={{ color: selected === i ? ch.color : 'rgba(255,255,255,0.6)', fontWeight: selected === i ? 600 : 400, fontSize: '0.9rem' }}>{ch.name}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginLeft: 'auto' }}>{ch.hz}Hz</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
