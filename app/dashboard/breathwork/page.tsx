'use client';
import { useState, useEffect, useRef } from 'react';

const EXERCISES = [
  { id: '478', name: '4-7-8 Breath', subtitle: 'Calm & Sleep', color: '#8b5cf6',
    phases: [{label:'Inhale',duration:4},{label:'Hold',duration:7},{label:'Exhale',duration:8}],
    benefit: 'Activates the parasympathetic nervous system. Perfect before sleep or during anxiety.',
    numbers: ['444','888','1111'], cycles: 4 },
  { id: 'box', name: 'Box Breathing', subtitle: 'Focus & Balance', color: '#3b82f6',
    phases: [{label:'Inhale',duration:4},{label:'Hold',duration:4},{label:'Exhale',duration:4},{label:'Hold',duration:4}],
    benefit: 'Used by Navy SEALs for stress control. Balances the nervous system and sharpens focus.',
    numbers: ['444','4444','1212'], cycles: 4 },
  { id: 'energize', name: 'Energizing Breath', subtitle: 'Energy & Clarity', color: '#f97316',
    phases: [{label:'Inhale',duration:2},{label:'Exhale',duration:2}],
    benefit: 'Rapid breathing to increase energy, clear the mind, and activate your solar plexus chakra.',
    numbers: ['333','555','111'], cycles: 8 },
  { id: 'coherence', name: 'Heart Coherence', subtitle: 'Love & Harmony', color: '#22c55e',
    phases: [{label:'Inhale',duration:5},{label:'Exhale',duration:5}],
    benefit: 'Creates heart-brain coherence. Opens the heart chakra and aligns you with love frequency.',
    numbers: ['222','444','1212'], cycles: 6 },
  { id: 'wim', name: 'Power Breath', subtitle: 'Strength & Awakening', color: '#c9a84c',
    phases: [{label:'Inhale',duration:2},{label:'Exhale',duration:1},{label:'Hold',duration:15}],
    benefit: 'Inspired by Wim Hof method. Floods body with oxygen, builds resilience and inner fire.',
    numbers: ['111','1111','777'], cycles: 3 },
];

export default function BreathworkPage() {
  const [selected, setSelected] = useState(EXERCISES[0]);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(selected.phases[0].duration);
  const [cycle, setCycle] = useState(0);
  const [scale, setScale] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setCount(prev => {
        if (prev <= 1) {
          setPhase(p => {
            const next = (p + 1) % selected.phases.length;
            if (next === 0) setCycle(c => c + 1);
            setScale(selected.phases[next].label === 'Inhale' ? 1.4 : selected.phases[next].label === 'Exhale' ? 0.8 : 1.1);
            return next;
          });
          return selected.phases[(phase + 1) % selected.phases.length].duration;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, phase, selected]);

  const start = () => { setPhase(0); setCount(selected.phases[0].duration); setCycle(0); setScale(1.4); setRunning(true); };
  const stop = () => { setRunning(false); setPhase(0); setCount(selected.phases[0].duration); setCycle(0); setScale(1); };
  const select = (ex: typeof EXERCISES[0]) => { stop(); setSelected(ex); };

  const currentPhase = selected.phases[phase];
  const progress = 1 - (count / currentPhase.duration);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Sacred Breathwork</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Align your breath with angel number frequencies</p>
      </div>

      {/* Exercise Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}>
        {EXERCISES.map(ex => (
          <button key={ex.id} onClick={() => select(ex)} style={{
            padding: '0.5rem 1rem', borderRadius: '999px', cursor: 'pointer',
            background: selected.id === ex.id ? ex.color : 'rgba(255,255,255,0.08)',
            color: selected.id === ex.id ? '#000' : 'rgba(255,255,255,0.7)',
            border: 'none', fontSize: '0.85rem', fontWeight: 600
          }}>{ex.name}</button>
        ))}
      </div>

      {/* Main Breathing Circle */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', width: '220px', height: '220px', marginBottom: '1.5rem' }}>
          {/* Outer ring */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `2px solid ${selected.color}30`,
          }} />
          {/* Breathing circle */}
          <div style={{
            position: 'absolute', inset: '20px', borderRadius: '50%',
            background: `radial-gradient(circle, ${selected.color}40, ${selected.color}10)`,
            border: `2px solid ${selected.color}60`,
            transform: `scale(${scale})`,
            transition: `transform ${currentPhase.duration * 0.9}s ease-in-out`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
            boxShadow: running ? `0 0 60px ${selected.color}40` : 'none'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff' }}>{count}</div>
            <div style={{ fontSize: '0.9rem', color: selected.color, fontWeight: 600 }}>{currentPhase.label}</div>
          </div>
        </div>

        {/* Phase indicators */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {selected.phases.map((p, i) => (
            <div key={i} style={{
              padding: '0.3rem 0.8rem', borderRadius: '999px', fontSize: '0.8rem',
              background: phase === i && running ? selected.color : 'rgba(255,255,255,0.08)',
              color: phase === i && running ? '#000' : 'rgba(255,255,255,0.5)',
              fontWeight: 600, transition: 'all 0.3s'
            }}>{p.label} {p.duration}s</div>
          ))}
        </div>

        {/* Cycle counter */}
        {running && (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Cycle {cycle + 1} of {selected.cycles}
          </div>
        )}

        {/* Control button */}
        <button onClick={running ? stop : start} style={{
          padding: '0.75rem 2.5rem', borderRadius: '999px', cursor: 'pointer',
          background: running ? 'rgba(255,255,255,0.1)' : selected.color,
          color: running ? 'rgba(255,255,255,0.8)' : '#000',
          border: running ? '1px solid rgba(255,255,255,0.2)' : 'none',
          fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em'
        }}>{running ? 'Stop' : 'Begin'}</button>
      </div>

      {/* Info Card */}
      <div style={{
        background: 'rgba(8,6,28,0.85)', borderRadius: '1.5rem',
        border: `1px solid ${selected.color}30`, padding: '1.5rem',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{selected.name}</h3>
            <p style={{ color: selected.color, fontSize: '0.85rem' }}>{selected.subtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {selected.numbers.map(n => (
              <span key={n} style={{
                background: `${selected.color}20`, border: `1px solid ${selected.color}40`,
                borderRadius: '999px', padding: '0.2rem 0.5rem',
                color: selected.color, fontSize: '0.75rem', fontWeight: 700
              }}>{n}</span>
            ))}
          </div>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>{selected.benefit}</p>
      </div>
    </div>
  );
}