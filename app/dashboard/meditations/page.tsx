'use client';
import { useState, useEffect, useRef } from 'react';

const MEDITATIONS = [
  { id: 'angel-connection', title: 'Angel Number Connection', duration: 10, color: '#c9a84c',
    category: 'Spiritual', level: 'Beginner', numbers: ['1111','444','777'],
    description: 'Open your awareness to angel number messages. This meditation attunes your consciousness to the frequency of divine guidance.',
    steps: [
      { time: 0, instruction: 'Find a comfortable position. Close your eyes and take three deep breaths.' },
      { time: 60, instruction: 'Visualize a golden light entering through the crown of your head with each inhale.' },
      { time: 180, instruction: 'In your mind’s eye, see the number 1111 glowing in golden light before you.' },
      { time: 300, instruction: 'Ask your angels: What message do you have for me today? Listen in the silence.' },
      { time: 480, instruction: 'Feel gratitude for the guidance you receive. Trust what comes.' },
      { time: 540, instruction: 'Slowly return your awareness to the room. Wiggle your fingers and toes.' },
    ]
  },
  { id: 'manifestation', title: 'Manifestation Activation', duration: 15, color: '#8b5cf6',
    category: 'Manifestation', level: 'Intermediate', numbers: ['111','333','888'],
    description: 'Align your energy with your deepest desires. This powerful meditation activates your manifestation portal.',
    steps: [
      { time: 0, instruction: 'Sit upright. Place your hands on your heart. Set your intention clearly.' },
      { time: 90, instruction: 'Breathe deeply into your heart center. Feel it expand with each breath.' },
      { time: 240, instruction: 'Visualize your desire as already manifested. Feel the joy, the gratitude.' },
      { time: 480, instruction: 'See the number 888 surrounding your vision, amplifying its energy.' },
      { time: 720, instruction: 'Declare: This or something better is manifesting for my highest good.' },
      { time: 840, instruction: 'Release the vision to the universe with complete trust and gratitude.' },
    ]
  },
  { id: 'chakra-balance', title: 'Chakra Balancing Journey', duration: 20, color: '#22c55e',
    category: 'Healing', level: 'Intermediate', numbers: ['777','333','1111'],
    description: 'Travel through all seven chakras, clearing and balancing each energy center with angelic assistance.',
    steps: [
      { time: 0, instruction: 'Lie down comfortably. Take 7 deep breaths, one for each chakra.' },
      { time: 120, instruction: 'Root Chakra: Visualize red light at the base of your spine. Feel grounded.' },
      { time: 240, instruction: 'Sacral Chakra: Orange light below your navel. Feel creative energy flow.' },
      { time: 360, instruction: 'Solar Plexus: Yellow light at your stomach. Feel your personal power.' },
      { time: 480, instruction: 'Heart Chakra: Green light at your chest. Feel unconditional love expand.' },
      { time: 600, instruction: 'Throat Chakra: Blue light at your throat. Feel your truth ready to speak.' },
      { time: 720, instruction: 'Third Eye: Indigo light between your brows. See with inner vision.' },
      { time: 900, instruction: 'Crown Chakra: Violet light at the top of your head. Feel divine connection.' },
      { time: 1080, instruction: 'All chakras glow in harmony. You are balanced, healed, and whole.' },
    ]
  },
  { id: 'twin-flame', title: 'Twin Flame Calling', duration: 12, color: '#ec4899',
    category: 'Love', level: 'Advanced', numbers: ['1111','222','1212'],
    description: 'Send a soul-level signal to your twin flame or divine partner. This meditation works across time and space.',
    steps: [
      { time: 0, instruction: 'Sit in a quiet space. Light a candle if possible. Breathe into your heart.' },
      { time: 90, instruction: 'Feel your heart expand into a sphere of rose-gold light.' },
      { time: 240, instruction: 'Visualize a golden thread extending from your heart into the universe.' },
      { time: 420, instruction: 'Send love along this thread: I am ready. I am open. I call you to me.' },
      { time: 540, instruction: 'See the number 1111 as a portal. Your twin flame steps through it toward you.' },
      { time: 660, instruction: 'Feel the recognition, the homecoming. Trust divine timing completely.' },
    ]
  },
  { id: 'release', title: 'Sacred Release Ceremony', duration: 8, color: '#ef4444',
    category: 'Healing', level: 'Beginner', numbers: ['999','555','333'],
    description: 'Release what no longer serves you. Clear old patterns, fears, and energies to make space for the new.',
    steps: [
      { time: 0, instruction: 'Sit comfortably. Think of what you wish to release. Name it clearly.' },
      { time: 60, instruction: 'Breathe in deeply. On the exhale, imagine releasing this energy as grey smoke.' },
      { time: 180, instruction: 'See the number 999 in your mind. It signals completion and release.' },
      { time: 300, instruction: 'Say internally: I release you with love. You no longer serve my highest good.' },
      { time: 420, instruction: 'Feel the lightness as the energy leaves. Breathe in golden light to fill the space.' },
    ]
  },
  { id: 'abundance', title: 'Abundance Frequency', duration: 11, color: '#f59e0b',
    category: 'Manifestation', level: 'Beginner', numbers: ['888','333','1111'],
    description: 'Tune your energy to the frequency of infinite abundance. Dissolve blocks and open to receive.',
    steps: [
      { time: 0, instruction: 'Sit comfortably. Place your hands palms-up in your lap, open to receive.' },
      { time: 90, instruction: 'Breathe in golden light. With each breath, feel more abundant.' },
      { time: 240, instruction: 'Repeat silently: I am worthy of abundance. I am open to receive.' },
      { time: 420, instruction: 'Visualize the number 888 as an infinity symbol of golden coins and light.' },
      { time: 540, instruction: 'Feel abundance flowing to you from all directions. You are a magnet.' },
      { time: 600, instruction: 'Give thanks for the abundance already in your life and what is coming.' },
    ]
  },
];

const CATEGORIES = ['All', 'Spiritual', 'Manifestation', 'Healing', 'Love'];

export default function MeditationsPage() {
  const [selected, setSelected] = useState(MEDITATIONS[0]);
  const [category, setCategory] = useState('All');
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const filtered = category === 'All' ? MEDITATIONS : MEDITATIONS.filter(m => m.category === category);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setElapsed(prev => {
        const next = prev + 1;
        // Update step
        const steps = selected.steps;
        for (let i = steps.length - 1; i >= 0; i--) {
          if (next >= steps[i].time) { setCurrentStep(i); break; }
        }
        if (next >= selected.duration * 60) {
          setRunning(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        return next;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, selected]);

  const start = () => { setElapsed(0); setCurrentStep(0); setRunning(true); };
  const stop = () => { setRunning(false); setElapsed(0); setCurrentStep(0); };
  const select = (m: typeof MEDITATIONS[0]) => { stop(); setSelected(m); };

  const progress = (elapsed / (selected.duration * 60)) * 100;
  const remaining = selected.duration * 60 - elapsed;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Guided Meditations</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Sacred journeys aligned with angel number frequencies</p>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            padding: '0.35rem 0.9rem', borderRadius: '999px', cursor: 'pointer',
            background: category === c ? '#c9a84c' : 'rgba(255,255,255,0.08)',
            color: category === c ? '#000' : 'rgba(255,255,255,0.7)',
            border: 'none', fontSize: '0.8rem', fontWeight: 600
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem' }}>
        {/* Meditation List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map(m => (
            <button key={m.id} onClick={() => select(m)} style={{
              background: selected.id === m.id ? `${m.color}15` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selected.id === m.id ? m.color + '60' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '1rem', padding: '0.85rem 1rem',
              cursor: 'pointer', textAlign: 'left', width: '100%'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{m.title}</div>
                <span style={{ color: m.color, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, marginLeft: '0.5rem' }}>{m.duration}m</span>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                <span style={{
                  background: `${m.color}20`, borderRadius: '999px',
                  padding: '0.1rem 0.5rem', color: m.color, fontSize: '0.7rem'
                }}>{m.category}</span>
                <span style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: '999px',
                  padding: '0.1rem 0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem'
                }}>{m.level}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Player */}
        <div style={{
          background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
          border: `1px solid ${selected.color}40`, padding: '1.5rem',
          backdropFilter: 'blur(12px)', alignSelf: 'start', position: 'sticky', top: '1rem'
        }}>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.25rem' }}>{selected.title}</h3>
          <p style={{ color: selected.color, fontSize: '0.8rem', marginBottom: '1rem' }}>{selected.category} · {selected.duration} min · {selected.level}</p>

          {/* Numbers */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
            {selected.numbers.map(n => (
              <span key={n} style={{
                background: `${selected.color}20`, border: `1px solid ${selected.color}40`,
                borderRadius: '999px', padding: '0.2rem 0.6rem',
                color: selected.color, fontSize: '0.8rem', fontWeight: 700
              }}>{n}</span>
            ))}
          </div>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>{selected.description}</p>

          {/* Progress */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{running ? 'In progress' : 'Ready'}</span>
              <span style={{ color: selected.color, fontSize: '0.85rem', fontWeight: 700 }}>{mins}:{secs.toString().padStart(2,'0')}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
              <div style={{ height: '100%', borderRadius: '3px', background: selected.color, width: `${progress}%`, transition: 'width 1s linear' }} />
            </div>
          </div>

          {/* Current instruction */}
          {running && (
            <div style={{
              background: `${selected.color}10`, borderRadius: '1rem',
              padding: '1rem', marginBottom: '1rem',
              border: `1px solid ${selected.color}30`,
              minHeight: '60px'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>
                {selected.steps[currentStep]?.instruction}
              </p>
            </div>
          )}

          {/* Steps preview */}
          {!running && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>JOURNEY STEPS</p>
              {selected.steps.slice(0,3).map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
                  <span style={{ color: selected.color, fontSize: '0.7rem', marginTop: '0.15rem', flexShrink: 0 }}>{Math.floor(step.time/60)}m</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', lineHeight: 1.4 }}>{step.instruction.substring(0,60)}...</span>
                </div>
              ))}
            </div>
          )}

          <button onClick={running ? stop : start} style={{
            width: '100%', padding: '0.75rem', borderRadius: '999px', cursor: 'pointer',
            background: running ? 'rgba(255,255,255,0.08)' : selected.color,
            color: running ? 'rgba(255,255,255,0.7)' : '#000',
            border: running ? '1px solid rgba(255,255,255,0.2)' : 'none',
            fontSize: '0.95rem', fontWeight: 700
          }}>{running ? '⏹ End Session' : '🧘 Begin Meditation'}</button>
        </div>
      </div>
    </div>
  );
}