'use client';
import { useState, useEffect, useRef } from 'react';

const MEDITATIONS = [
  {
    id: 'angel-connection', title: 'Angel Number Connection', duration: 10, category: 'Manifestation',
    color: '#c9a84c', emoji: '✦',
    description: 'Open your channel to receive angel number messages with clarity and ease.',
    steps: [
      'Find a comfortable position and close your eyes.',
      'Take three deep breaths, releasing all tension.',
      'Visualize a golden light descending from above, entering through your crown.',
      'Feel this light filling your mind, heart, and body with divine awareness.',
      'Set the intention: "I am open to receiving messages from my angels."',
      'Breathe slowly and notice any numbers, colors, or feelings that arise.',
      'When ready, gently open your eyes and log any angel numbers you received.',
    ]
  },
  {
    id: 'manifestation-portal', title: '1111 Manifestation Portal', duration: 15, category: 'Manifestation',
    color: '#f59e0b', emoji: '🌟',
    description: 'Activate the 1111 portal to supercharge your manifestations.',
    steps: [
      'Sit upright, spine straight, hands on knees palms up.',
      'Breathe in for 4 counts, hold for 4, out for 4. Repeat 4 times.',
      'Visualize the number 1111 glowing in golden light before you.',
      'Step through the portal in your mind — feel the shift in energy.',
      'Clearly state your most important desire as if already true.',
      'Feel the emotions of having it now — joy, gratitude, peace.',
      'Seal the portal by saying: "It is done. So it is."',
    ]
  },
  {
    id: 'divine-protection', title: '444 Angelic Shield', duration: 8, category: 'Protection',
    color: '#22c55e', emoji: '🛡️',
    description: 'Surround yourself with the protective energy of the 444 frequency.',
    steps: [
      'Sit or lie comfortably. Close your eyes.',
      'Breathe deeply and feel your body relax completely.',
      'Visualize four angels standing at the four corners around you.',
      'See them extend their wings to form a luminous green shield.',
      'Feel completely safe, protected, and loved.',
      'Repeat silently: "I am divinely protected on all sides."',
      'Rest in this cocoon of angelic protection for as long as needed.',
    ]
  },
  {
    id: 'abundance-flow', title: '888 Abundance Flow', duration: 12, category: 'Abundance',
    color: '#f59e0b', emoji: '♾️',
    description: 'Align with the infinite abundance frequency of 888.',
    steps: [
      'Lie down comfortably. Place hands on your heart and solar plexus.',
      'Breathe in golden light. Breathe out any scarcity beliefs.',
      'Visualize the infinity symbol (∞) glowing gold in your chest.',
      'Feel it spinning, expanding, filling your entire energy field.',
      'Affirm: "I am a magnet for infinite abundance in all forms."',
      'See money, love, health, and joy flowing to you effortlessly.',
      'Give thanks for the abundance already in your life.',
    ]
  },
  {
    id: 'release-ceremony', title: '999 Release Ceremony', duration: 20, category: 'Release',
    color: '#ef4444', emoji: '🌀',
    description: 'Complete a cycle and release what no longer serves your highest path.',
    steps: [
      'Light a candle if possible. Sit in a quiet space.',
      'Write down what you are releasing on paper.',
      'Hold the paper and breathe deeply, feeling the weight of what you carry.',
      'Visualize a violet flame consuming everything written.',
      'Say: "I release this with love and gratitude for the lessons it brought."',
      'Breathe in freedom. Breathe out the past.',
      'Sit in the spaciousness of completion. You are free.',
    ]
  },
  {
    id: 'soul-mission', title: '1212 Soul Mission Activation', duration: 18, category: 'Purpose',
    color: '#60a5fa', emoji: '🧭',
    description: 'Activate your soul mission and align with your highest purpose.',
    steps: [
      'Sit in meditation posture. Breathe naturally.',
      'Ask your higher self: "What is my soul mission in this lifetime?"',
      'Visualize a compass in your heart pointing to your true north.',
      'Follow the compass in your mind — where does it lead?',
      'Notice images, feelings, or words that arise without judgment.',
      'Affirm: "I am aligned with my soul mission. I walk my path with courage."',
      'Journal immediately after to capture any insights received.',
    ]
  },
  {
    id: 'twin-flame', title: 'Twin Flame Connection', duration: 15, category: 'Love',
    color: '#ec4899', emoji: '🔥',
    description: 'Open your heart to divine love and soul connection.',
    steps: [
      'Lie down. Place both hands on your heart center.',
      'Breathe pink light into your heart with each inhale.',
      'Feel your heart expanding, softening, opening.',
      'Visualize a golden thread extending from your heart outward.',
      'Send love along this thread to your soul connection, wherever they are.',
      'Receive love back along the same thread.',
      'Rest in the knowing that love is your natural state.',
    ]
  },
  {
    id: 'morning-alignment', title: 'Morning Cosmic Alignment', duration: 7, category: 'Daily',
    color: '#a78bfa', emoji: '🌅',
    description: 'Start your day aligned with cosmic energy and divine guidance.',
    steps: [
      'Upon waking, before checking your phone, sit up in bed.',
      'Take 7 deep breaths, one for each chakra.',
      'Set your intention for the day in one sentence.',
      'Ask: "What angel numbers will guide me today?"',
      'Visualize your day unfolding perfectly.',
      'Say: "Today I am open, aware, and divinely guided."',
      'Open your eyes and log any numbers that came to mind.',
    ]
  },
];

const CATEGORIES = ['All', 'Manifestation', 'Protection', 'Abundance', 'Release', 'Purpose', 'Love', 'Daily'];

export default function MeditationsPage() {
  const [category, setCategory] = useState('All');
  const [active, setActive] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const filtered = MEDITATIONS.filter(m => category === 'All' || m.category === category);
  const activeMed = MEDITATIONS.find(m => m.id === active);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running]);

  const startMeditation = (id: string) => {
    setActive(id); setStep(0); setElapsed(0); setRunning(true);
  };

  const stopMeditation = () => {
    setRunning(false); setActive(null); setStep(0); setElapsed(0);
  };

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  if (activeMed) {
    const progress = (step / (activeMed.steps.length - 1)) * 100;
    return (
      <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          background: `linear-gradient(135deg, ${activeMed.color}15, rgba(8,6,28,0.95))`,
          borderRadius: '1.5rem', border: `1px solid ${activeMed.color}30`,
          padding: '2rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem', textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{activeMed.emoji}</div>
          <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.25rem' }}>{activeMed.title}</h2>
          <div style={{ color: activeMed.color, fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Cormorant Garamond, serif' }}>{fmt(elapsed)}</div>
        </div>

        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${activeMed.color}, #fff)`, borderRadius: '999px', transition: 'width 0.5s ease' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {activeMed.steps.map((s, i) => (
            <div key={i} onClick={() => setStep(i)} style={{
              background: i === step ? `${activeMed.color}15` : i < step ? 'rgba(255,255,255,0.03)' : 'rgba(8,6,28,0.88)',
              borderRadius: '1rem', border: i === step ? `1px solid ${activeMed.color}35` : '1px solid rgba(255,255,255,0.06)',
              padding: '1rem 1.25rem', cursor: 'pointer', backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'flex-start', gap: '0.875rem'
            }}>
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: i < step ? activeMed.color : i === step ? `${activeMed.color}30` : 'rgba(255,255,255,0.06)',
                border: `1px solid ${i <= step ? activeMed.color : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', color: i < step ? '#000' : i === step ? activeMed.color : 'rgba(255,255,255,0.3)'
              }}>{i < step ? '✓' : i + 1}</div>
              <p style={{ color: i === step ? '#fff' : i < step ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.6 }}>{s}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {step < activeMed.steps.length - 1 && (
            <button onClick={() => setStep(s => s + 1)} style={{ flex: 1, padding: '0.875rem', borderRadius: '999px', background: `${activeMed.color}20`, border: `1px solid ${activeMed.color}40`, color: activeMed.color, cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>Next Step →</button>
          )}
          {step === activeMed.steps.length - 1 && (
            <button onClick={stopMeditation} style={{ flex: 1, padding: '0.875rem', borderRadius: '999px', background: `${activeMed.color}20`, border: `1px solid ${activeMed.color}40`, color: activeMed.color, cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>Complete ✦</button>
          )}
          <button onClick={stopMeditation} style={{ padding: '0.875rem 1.25rem', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem' }}>End</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'Cormorant Garamond, serif' }}>Guided Meditations</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Angel number frequency meditations</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            padding: '0.3rem 0.75rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.75rem',
            background: category === c ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)',
            border: category === c ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(255,255,255,0.07)',
            color: category === c ? '#a78bfa' : 'rgba(255,255,255,0.4)'
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(m => (
          <div key={m.id} style={{
            background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
            border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${m.color}15`, border: `1px solid ${m.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{m.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{m.title}</h3>
                  <span style={{ background: `${m.color}15`, border: `1px solid ${m.color}25`, borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', color: m.color }}>{m.category}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '0.875rem' }}>{m.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>⏱ {m.duration} min · {m.steps.length} steps</span>
                  <button onClick={() => startMeditation(m.id)} style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: `${m.color}20`, border: `1px solid ${m.color}35`, color: m.color, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>Begin ▶</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}