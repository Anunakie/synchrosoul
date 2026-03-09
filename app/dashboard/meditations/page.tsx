'use client';
import { useState } from 'react';

const MEDITATIONS = [
  { id: 'morning', title: 'Morning Angel Activation', emoji: '🌅', duration: '10 min', color: '#f59e0b', category: 'Morning', numbers: ['111','1111'], description: 'Begin your day by opening your energy field to receive angel number messages. This meditation activates your awareness so you notice synchronicities throughout the day.', script: [
    'Find a comfortable seated position. Close your eyes and take three deep breaths.',
    'Visualize a golden light entering through the crown of your head with each inhale.',
    'As the light fills your body, set your intention: Today I am open to receiving divine messages.',
    'Imagine the numbers 1, 1, 1, 1 floating before you in golden light. Feel their energy of new beginnings.',
    'Ask your angels: What message do you have for me today? Sit in silence for 2 minutes.',
    'When you are ready, slowly open your eyes. You are now activated to receive angel numbers.',
  ]},
  { id: 'chakra', title: 'Chakra Angel Number Journey', emoji: '🌈', duration: '20 min', color: '#a78bfa', category: 'Healing', numbers: ['777','333','1111'], description: 'Travel through all 7 chakras, activating each with its corresponding angel number frequency. A complete energetic reset.', script: [
    'Lie down comfortably. Close your eyes and breathe deeply.',
    'Root Chakra (444): Visualize red light at the base of your spine. Feel safe and grounded.',
    'Sacral Chakra (222): Orange light below your navel. Feel creative and balanced.',
    'Solar Plexus (888): Yellow light at your stomach. Feel powerful and abundant.',
    'Heart Chakra (222): Green light at your heart. Feel love flowing freely.',
    'Throat Chakra (333): Blue light at your throat. Feel free to express your truth.',
    'Third Eye (777): Indigo light between your brows. Feel your intuition awakening.',
    'Crown Chakra (1111): Violet light at the top of your head. Feel connected to the divine.',
    'Rest in this fully activated state for 5 minutes before slowly returning.',
  ]},
  { id: 'manifestation', title: 'Angel Number Manifestation', emoji: '✨', duration: '15 min', color: '#c9a84c', category: 'Manifestation', numbers: ['1111','555','888'], description: 'Use the power of 1111 portal energy to plant seeds of manifestation. Your angels amplify your intentions during this practice.', script: [
    'Sit comfortably. Take 7 deep breaths to center yourself.',
    'Visualize a portal of golden light opening before you. This is the 1111 gateway.',
    'Clearly see your desire as already manifested. Feel the emotions of having it now.',
    'Speak your intention aloud three times: I am grateful for [your desire], which is already mine.',
    'See the number 1111 surrounding your vision, amplifying and sealing it.',
    'Thank your angels for their support. Trust that it is done.',
    'Slowly return to the room, carrying the certainty of your manifestation.',
  ]},
  { id: 'release', title: '999 Release Ceremony', emoji: '🌊', duration: '12 min', color: '#6366f1', category: 'Release', numbers: ['999','555'], description: 'The 999 frequency helps you release what no longer serves. This meditation clears old patterns, relationships, and beliefs that block your highest path.', script: [
    'Sit or lie comfortably. Close your eyes.',
    'Breathe deeply and bring to mind something you are ready to release.',
    'Visualize it as an object in your hands. Examine it without judgment.',
    'See the number 999 appear in deep purple light. It represents completion.',
    'Say: I release this with love and gratitude for what it taught me.',
    'Visualize placing the object into a violet flame. Watch it transform into light.',
    'Feel the space that has opened within you. Breathe in new possibilities.',
    'Rest in the emptiness. This is sacred space for new blessings to enter.',
  ]},
  { id: 'sleep', title: 'Angel Number Dream Activation', emoji: '🌙', duration: '15 min', color: '#8b5cf6', category: 'Sleep', numbers: ['777','1111','333'], description: 'Prepare your subconscious to receive angel number messages in your dreams. Set intentions for divine guidance during sleep.', script: [
    'Lie in bed, ready for sleep. Close your eyes.',
    'Take 10 slow, deep breaths. With each exhale, release the day.',
    'Visualize a soft purple light surrounding your body like a cocoon.',
    'Set your dream intention: Tonight I receive clear messages from my angels.',
    'See the number 777 glowing softly above you. It is your dream portal.',
    'Ask a specific question you want answered in your dreams.',
    'Trust that the answer will come. Drift peacefully into sleep.',
  ]},
  { id: 'twin-flame', title: 'Soul Twin Connection', emoji: '💫', duration: '18 min', color: '#f472b6', category: 'Love', numbers: ['1111','222','1212'], description: 'Open your heart to your soul twin connection. This meditation aligns your energy with your highest love frequency.', script: [
    'Sit comfortably with your hands on your heart.',
    'Breathe deeply into your heart space. Feel it expand with each breath.',
    'Visualize a pink and gold light radiating from your heart.',
    'See the number 1212 before you — the soul twin activation code.',
    'Send love from your heart into the universe: I am ready to meet my soul twin.',
    'Feel the love returning to you, amplified by the universe.',
    'Trust that your soul twin is also seeking you. The connection is already made.',
    'Rest in this loving frequency for 5 minutes.',
  ]},
];

export default function MeditationsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [filter, setFilter] = useState('All');

  const med = MEDITATIONS.find(m => m.id === selected);
  const categories = ['All', ...Array.from(new Set(MEDITATIONS.map(m => m.category)))];
  const filtered = filter === 'All' ? MEDITATIONS : MEDITATIONS.filter(m => m.category === filter);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'Cormorant Garamond, serif' }}>Guided Meditations</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Angel number activations and sacred journeys</p>
      </div>

      {!selected ? (
        <div>
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{ flexShrink: 0, padding: '0.35rem 0.875rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: filter === c ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: filter === c ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(255,255,255,0.08)', color: filter === c ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}>{c}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {filtered.map(m => (
              <div key={m.id} onClick={() => { setSelected(m.id); setStep(0); setStarted(false); }} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem 1.25rem', backdropFilter: 'blur(12px)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{m.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{m.title}</p>
                    <span style={{ background: `${m.color}15`, border: `1px solid ${m.color}25`, borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.6rem', color: m.color }}>{m.duration}</span>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{m.category}</p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem' }}>›</span>
              </div>
            ))}
          </div>
        </div>
      ) : med ? (
        <div>
          <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>← All Meditations</button>
          <div style={{ background: 'rgba(8,6,28,0.92)', borderRadius: '1.5rem', border: `1px solid ${med.color}20`, padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '2.5rem' }}>{med.emoji}</span>
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem', fontFamily: 'Cormorant Garamond, serif', marginTop: '0.5rem' }}>{med.title}</h2>
              <p style={{ color: med.color, fontSize: '0.78rem', marginTop: '0.25rem' }}>{med.duration} · {med.category}</p>
            </div>
            {!started ? (
              <><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem', textAlign: 'center' }}>{med.description}</p>
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                {med.numbers.map(n => <span key={n} style={{ background: `${med.color}10`, border: `1px solid ${med.color}20`, borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', color: med.color, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{n}</span>)}
              </div>
              <div style={{ textAlign: 'center' }}><button onClick={() => setStarted(true)} style={{ background: `${med.color}20`, border: `1px solid ${med.color}40`, borderRadius: '999px', padding: '0.875rem 2.5rem', cursor: 'pointer', color: med.color, fontWeight: 700, fontSize: '1rem' }}>Begin Meditation</button></div></>
            ) : (
              <div>
                <div style={{ background: `${med.color}08`, borderRadius: '1.25rem', padding: '1.25rem', border: `1px solid ${med.color}15`, marginBottom: '1rem', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem', lineHeight: 1.8, textAlign: 'center', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>{med.script[step]}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}><div style={{ height: '100%', width: `${((step + 1) / med.script.length) * 100}%`, background: med.color, borderRadius: '999px', transition: 'width 0.3s ease' }} /></div>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>{step + 1}/{med.script.length}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', padding: '0.75rem', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>← Previous</button>}
                  {step < med.script.length - 1 ? (
                    <button onClick={() => setStep(s => s + 1)} style={{ flex: 1, background: `${med.color}20`, border: `1px solid ${med.color}40`, borderRadius: '999px', padding: '0.75rem', cursor: 'pointer', color: med.color, fontWeight: 700 }}>Next →</button>
                  ) : (
                    <button onClick={() => { setStarted(false); setStep(0); }} style={{ flex: 1, background: `${med.color}20`, border: `1px solid ${med.color}40`, borderRadius: '999px', padding: '0.75rem', cursor: 'pointer', color: med.color, fontWeight: 700 }}>Complete ✨</button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}