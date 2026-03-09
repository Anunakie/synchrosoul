'use client';
import { useState, useEffect, useRef } from 'react';

const TECHNIQUES = [
  { id: 'box', name: 'Box Breathing', emoji: '⬜', color: '#22d3ee', numbers: ['444'], description: 'Used by Navy SEALs to stay calm under pressure. Balances the nervous system and clears the mind.', phases: [{label:'Inhale',secs:4},{label:'Hold',secs:4},{label:'Exhale',secs:4},{label:'Hold',secs:4}], rounds: 4, benefit: 'Calm, focus, stress relief' },
  { id: '478', name: '4-7-8 Breathing', emoji: '🌙', color: '#8b5cf6', numbers: ['777','444'], description: 'Dr. Andrew Weil’s relaxation technique. Acts as a natural tranquilizer for the nervous system.', phases: [{label:'Inhale',secs:4},{label:'Hold',secs:7},{label:'Exhale',secs:8}], rounds: 4, benefit: 'Sleep, anxiety relief, deep calm' },
  { id: 'coherent', name: 'Coherent Breathing', emoji: '💚', color: '#22c55e', numbers: ['555','222'], description: 'Breathing at 5 breaths per minute to achieve heart rate variability coherence and deep peace.', phases: [{label:'Inhale',secs:6},{label:'Exhale',secs:6}], rounds: 5, benefit: 'Heart coherence, emotional balance' },
  { id: 'wim', name: 'Energizing Breath', emoji: '🔥', color: '#f97316', numbers: ['111','333'], description: 'Inspired by Wim Hof. Rapid breathing followed by retention to flood the body with oxygen and energy.', phases: [{label:'Inhale',secs:2},{label:'Exhale',secs:1},{label:'Hold',secs:15},{label:'Recovery',secs:5}], rounds: 3, benefit: 'Energy, focus, immune boost' },
  { id: 'angel', name: 'Angel Number Breath', emoji: '✨', color: '#c9a84c', numbers: ['1111','777','333'], description: 'A sacred breathing pattern aligned with angel number frequencies. Breathe in divine light, exhale what no longer serves.', phases: [{label:'Inhale Light',secs:4},{label:'Hold Intention',secs:4},{label:'Exhale Release',secs:4},{label:'Receive',secs:4}], rounds: 11, benefit: 'Spiritual alignment, manifestation' },
];

export default function BreathworkPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [tick, setTick] = useState(0);
  const [round, setRound] = useState(1);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tech = TECHNIQUES.find(t => t.id === selected);

  const stopSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false); setPhase(0); setTick(0); setRound(1); setDone(false);
  };

  const startSession = () => {
    if (!tech) return;
    stopSession();
    setRunning(true); setDone(false);
    let p = 0, t = 0, r = 1;
    timerRef.current = setInterval(() => {
      t++;
      setTick(t);
      if (t >= tech.phases[p].secs) {
        t = 0; p++;
        if (p >= tech.phases.length) {
          p = 0; r++;
          setRound(r);
          if (r > tech.rounds) {
            clearInterval(timerRef.current!);
            setRunning(false); setDone(true); return;
          }
        }
        setPhase(p);
      }
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const currentPhase = tech?.phases[phase];
  const progress = currentPhase ? (tick / currentPhase.secs) : 0;
  const circumference = 2 * Math.PI * 70;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#22d3ee', fontFamily: 'Cormorant Garamond, serif' }}>Sacred Breathwork</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Breathe with intention, align with the divine</p>
      </div>

      {!selected ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {TECHNIQUES.map(t => (
            <div key={t.id} onClick={() => setSelected(t.id)} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem 1.25rem', backdropFilter: 'blur(12px)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{t.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.1rem' }}>{t.benefit}</p>
                <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                  {t.phases.map((ph, i) => <span key={i} style={{ background: `${t.color}10`, border: `1px solid ${t.color}20`, borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.62rem', color: t.color }}>{ph.label} {ph.secs}s</span>)}
                  <span style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>{t.rounds} rounds</span>
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1.2rem' }}>›</span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => { stopSession(); setSelected(null); }} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>← Back</button>

          {tech && (
            <div>
              <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: `1px solid ${tech.color}20`, padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1rem', textAlign: 'center' }}>
                <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem' }}>{tech.emoji} {tech.name}</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>{tech.description}</p>

                {/* Breathing circle */}
                <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 1.25rem' }}>
                  <svg width="180" height="180" style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
                    <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle cx="90" cy="90" r="70" fill="none" stroke={tech.color} strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={running ? circumference * (1 - progress) : circumference}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {done ? (
                      <><span style={{ fontSize: '2rem' }}>✨</span><p style={{ color: tech.color, fontWeight: 700, fontSize: '0.9rem', marginTop: '0.25rem' }}>Complete!</p></>
                    ) : running ? (
                      <><p style={{ color: tech.color, fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>{currentPhase?.label}</p><p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.5rem', fontWeight: 800 }}>{currentPhase ? currentPhase.secs - tick : 0}</p><p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>Round {round}/{tech.rounds}</p></>
                    ) : (
                      <><span style={{ fontSize: '2rem' }}>{tech.emoji}</span><p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.25rem' }}>Ready</p></>
                    )}
                  </div>
                </div>

                {!running && !done && <button onClick={startSession} style={{ background: `${tech.color}20`, border: `1px solid ${tech.color}40`, borderRadius: '999px', padding: '0.75rem 2rem', cursor: 'pointer', color: tech.color, fontWeight: 700, fontSize: '0.9rem' }}>Begin Session</button>}
                {running && <button onClick={stopSession} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '0.75rem 2rem', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: '0.9rem' }}>Stop</button>}
                {done && <button onClick={startSession} style={{ background: `${tech.color}20`, border: `1px solid ${tech.color}40`, borderRadius: '999px', padding: '0.75rem 2rem', cursor: 'pointer', color: tech.color, fontWeight: 700, fontSize: '0.9rem' }}>Again</button>}
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {tech.phases.map((ph, i) => <div key={i} style={{ background: phase === i && running ? `${tech.color}20` : 'rgba(8,6,28,0.88)', border: phase === i && running ? `1px solid ${tech.color}40` : '1px solid rgba(255,255,255,0.07)', borderRadius: '0.875rem', padding: '0.5rem 0.875rem', flex: 1, textAlign: 'center' }}><p style={{ color: phase === i && running ? tech.color : 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: 600 }}>{ph.label}</p><p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>{ph.secs}s</p></div>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}