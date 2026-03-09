'use client';
import { useState } from 'react';

const crystals = [
  { name: 'Amethyst', color: '#9b59b6', emoji: '💜', chakra: 'Crown & Third Eye', angelNumbers: ['777', '999'], properties: ['Intuition', 'Protection', 'Spiritual growth'], desc: 'The stone of spiritual protection and purification. Enhances intuition and psychic abilities. Perfect for meditation and connecting with higher realms.', howToUse: 'Place on third eye during meditation. Keep under pillow for prophetic dreams. Wear as jewelry for continuous protection.', affirmation: 'I am divinely protected and spiritually awakened.' },
  { name: 'Rose Quartz', color: '#f48fb1', emoji: '🌸', chakra: 'Heart', angelNumbers: ['444', '222'], properties: ['Love', 'Compassion', 'Self-worth'], desc: 'The stone of unconditional love. Opens the heart to all forms of love — self-love, romantic love, and universal love.', howToUse: 'Hold over heart during meditation. Place in bedroom to attract love. Carry in pocket as a love talisman.', affirmation: 'I am worthy of deep, unconditional love.' },
  { name: 'Clear Quartz', color: '#e8f4f8', emoji: '🔮', chakra: 'Crown', angelNumbers: ['1111', '000'], properties: ['Clarity', 'Amplification', 'Healing'], desc: 'The master healer. Amplifies energy and intention of other crystals. Brings clarity of thought and enhances psychic abilities.', howToUse: 'Program with intention by holding and stating your goal. Place with other crystals to amplify their energy. Use in crystal grids.', affirmation: 'My mind is clear, my intentions are pure and powerful.' },
  { name: 'Black Tourmaline', color: '#2c3e50', emoji: '🖤', chakra: 'Root', angelNumbers: ['111', '444'], properties: ['Protection', 'Grounding', 'EMF shield'], desc: 'The ultimate protection stone. Creates a powerful shield against negative energies, psychic attacks, and electromagnetic frequencies.', howToUse: 'Place near electronics to absorb EMF. Keep at front door for home protection. Hold during stressful situations.', affirmation: 'I am grounded, protected, and safe in all situations.' },
  { name: 'Citrine', color: '#f39c12', emoji: '🌟', chakra: 'Solar Plexus', angelNumbers: ['888', '333'], properties: ['Abundance', 'Confidence', 'Joy'], desc: 'The merchant stone of abundance and manifestation. Carries the power of the sun, bringing warmth, energy, and positivity.', howToUse: 'Place in wealth corner of home (far left from entrance). Keep in wallet or cash register. Wear to boost confidence.', affirmation: 'Abundance flows to me naturally and effortlessly.' },
  { name: 'Lapis Lazuli', color: '#1a5276', emoji: '🔵', chakra: 'Third Eye & Throat', angelNumbers: ['555', '777'], properties: ['Truth', 'Wisdom', 'Communication'], desc: 'The stone of truth and wisdom. Stimulates the desire for knowledge and understanding. Enhances intellectual ability and memory.', howToUse: 'Wear at throat for clear communication. Place on third eye for enhanced intuition. Use during study or creative work.', affirmation: 'I speak my truth with wisdom and clarity.' },
  { name: 'Selenite', color: '#f0f0f0', emoji: '🤍', chakra: 'Crown', angelNumbers: ['999', '1111'], properties: ['Cleansing', 'Angelic connection', 'Peace'], desc: 'A high-vibration crystal that connects to angelic realms. Cleanses and charges other crystals. Brings deep peace and mental clarity.', howToUse: 'Place other crystals on selenite to cleanse them. Use wand to clear your aura. Keep in bedroom for peaceful sleep.', affirmation: 'I am connected to divine light and angelic guidance.' },
  { name: 'Malachite', color: '#27ae60', emoji: '💚', chakra: 'Heart', angelNumbers: ['444', '666'], properties: ['Transformation', 'Protection', 'Heart healing'], desc: 'The stone of transformation. Absorbs negative energies and pollutants. Encourages risk-taking and change, breaking unwanted patterns.', howToUse: 'Hold during times of change. Place on heart chakra for emotional healing. Use in meditation for transformation work.', affirmation: 'I embrace transformation and release what no longer serves me.' },
  { name: 'Labradorite', color: '#5dade2', emoji: '🌊', chakra: 'Third Eye', angelNumbers: ['777', '1111'], properties: ['Magic', 'Intuition', 'Synchronicity'], desc: 'The stone of magic and synchronicity. Awakens awareness of inner spirit and psychic abilities. Enhances coincidences and meaningful connections.', howToUse: 'Carry when seeking signs and synchronicities. Meditate with to enhance psychic gifts. Wear to attract magical experiences.', affirmation: 'Magic and synchronicity flow through my life constantly.' },
];

export default function CrystalsPage() {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState<'info'|'use'|'affirmation'>('info');
  const c = crystals[selected];
  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>💎 Crystal Guide</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Sacred stones aligned with angel numbers</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {crystals.map((cr, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{ padding: '0.75rem 0.5rem', borderRadius: '0.9rem', background: selected === i ? 'rgba(8,6,28,0.9)' : 'rgba(8,6,28,0.5)', border: selected === i ? '1px solid ' + cr.color + '88' : '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '1.5rem' }}>{cr.emoji}</div>
            <div style={{ fontSize: '0.7rem', color: selected === i ? cr.color : 'rgba(255,255,255,0.6)', marginTop: '0.25rem', fontWeight: selected === i ? 600 : 400 }}>{cr.name}</div>
          </button>
        ))}
      </div>
      <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid ' + c.color + '44', borderRadius: '1.25rem', padding: '1.75rem', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 15px ' + c.color + '88)' }}>{c.emoji}</div>
          <div>
            <h2 style={{ color: c.color, fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>{c.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.85rem' }}>{c.chakra} Chakra</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {c.properties.map(p => <span key={p} style={{ background: c.color + '22', color: c.color, padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid ' + c.color + '44' }}>{p}</span>)}
          {c.angelNumbers.map(n => <span key={n} style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid rgba(201,168,76,0.3)' }}>{n}</span>)}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {(['info','use','affirmation'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.6rem', background: tab === t ? c.color + '33' : 'rgba(255,255,255,0.05)', border: tab === t ? '1px solid ' + c.color + '66' : '1px solid rgba(255,255,255,0.08)', color: tab === t ? c.color : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', textTransform: 'capitalize' }}>{t === 'use' ? 'How to Use' : t}</button>
          ))}
        </div>
        {tab === 'info' && <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, margin: 0 }}>{c.desc}</p>}
        {tab === 'use' && <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, margin: 0 }}>{c.howToUse}</p>}
        {tab === 'affirmation' && <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.75rem', padding: '1.25rem', borderLeft: '3px solid ' + c.color }}><p style={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', margin: 0, lineHeight: 1.7, fontSize: '1.05rem' }}>“{c.affirmation}”</p></div>}
      </div>
    </div>
  );
}
