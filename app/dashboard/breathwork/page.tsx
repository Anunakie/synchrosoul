'use client';
import { useState, useEffect, useRef } from 'react';

const TECHNIQUES = [
  {
    id: '444', name: '4-4-4-4 Box Breath', color: '#22c55e', emoji: '🟩',
    description: 'The angelic protection breath. Calms the nervous system and creates a shield of peace.',
    phases: [
      { label: 'Inhale', duration: 4, color: '#22c55e' },
      { label: 'Hold', duration: 4, color: '#86efac' },
      { label: 'Exhale', duration: 4, color: '#22c55e' },
      { label: 'Hold', duration: 4, color: '#86efac' },
    ],
    cycles: 8, benefit: 'Reduces anxiety, activates 444 protection frequency'
  },
  {
    id: '478', name: '4-7-8 Relaxation', color: '#6366f1', emoji: '🌙',
    description: 'The sleep and surrender breath. Activates the parasympathetic nervous system.',
    phases: [
      { label: 'Inhale', duration: 4, color: '#6366f1' },
      { label: 'Hold', duration: 7, color: '#a5b4fc' },
      { label: 'Exhale', duration: 8, color: '#6366f1' },
    ],
    cycles: 4, benefit: 'Induces deep relaxation, prepares for sleep or meditation'
  },
  {
    id: '555', name: '5-5-5 Transformation', color: '#8b5cf6', emoji: '🦋',
    description: 'The change breath. Aligns with 555 transformation energy to release the old.',
    phases: [
      { label: 'Inhale', duration: 5, color: '#8b5cf6' },
      { label: 'Hold', duration: 5, color: '#c4b5fd' },
      { label: 'Exhale', duration: 5, color: '#8b5cf6' },
    ],
    cycles: 6, benefit: 'Facilitates change, releases resistance, opens to transformation'
  },
  {
    id: '111', name: '1-1-1 Manifestation Pulse', color: '#f59e0b', emoji: '⚡',
    description: 'Rapid manifestation breath. Short, powerful pulses to activate the 111 portal.',
    phases: [
      { label: 'Inhale', duration: 1, color: '#f59e0b' },
      { label: 'Exhale', duration: 1, color: '#fde68a' },
    ],
    cycles: 11, benefit: 'Energizes, activates manifestation portal, raises vibration quickly'
  },
  {
    id: '888', name: '8-8 Abundance Breath', color: '#c9a84c', emoji: '♾️',
    description: 'The infinity breath. Continuous circular breathing to activate abundance flow.',
    phases: [
      { label: 'Inhale', duration: 8, color: '#c9a84c' },
      { label: 'Exhale', duration: 8, color: '#fde68a' },
    ],
    cycles: 8, benefit: 'Opens abundance channels, activates 888 infinite flow frequency'
  },
  {
    id: '333', name: '3-3-3 Creative Activation', color: '#f97316', emoji: '🎨',
    description: 'The creative masters breath. Activates the Ascended Masters and creative flow.',
    phases: [
      { label: 'Inhale', duration: 3, color: '#f97316' },
      { label: 'Hold', duration: 3, color: '#fdba74' },
      { label: 'Exhale', duration: 3, color: '#f97316' },
    ],
    cycles: 9, benefit: 'Activates creativity, connects with Ascended Masters, opens expression'
  },
];

export default function BreathworkPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [complete, setComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const tech = TECHNIQUES.find(t => t.id === selected);

  useEffect(() => {
    if (!running || !tech) return;
    intervalRef.current = setInterval(() => {
      setPhaseTime(pt => {
        const currentPhase = tech.phases[phase];
        if (pt + 1 >= currentPhase.duration) {
          const nextPhase = (phase + 1) % tech.phases.length;
          if (nextPhase === 0) {
            setCycle(c => {
              if (c + 1 >= tech.cycles) {
                setRunning(false);
                setComplete(true);
                return c;
              }
              return c + 1;
            });
          }
          setPhase(nextPhase);
          return 0;
        }
        return pt + 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, phase, tech]);

  const start = (id: string) => {
    setSelected(id); setPhase(0); setPhaseTime(0); setCycle(0); setComplete(false); setRunning(true);
  };

  const stop = () => {
    setRunning(false); setSelected(null); setPhase(0); setPhaseTime(0); setCycle(0); setComplete(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  if (tech && (running || complete)) {
    const currentPhase = tech.phases[phase];
    const progress = complete ? 100 : (phaseTime / currentPhase.duration) * 100;
    const size = 200;
    const circumference = 2 * Math.PI * 80;
    const strokeDash = (progress / 100) * circumference;

    return (
      <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.25rem', textAlign: 'center' }}>{tech.name}</h2>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginBottom: '2rem' }}>Cycle {Math.min(cycle + 1, tech.cycles)} of {tech.cycles}</p>

        {complete ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
            <h3 style={{ color: tech.color, fontSize: '1.5rem', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem' }}>Complete</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{tech.benefit}</p>
            <button onClick={stop} style={{ padding: '0.75rem 2rem', borderRadius: '999px', background: `${tech.color}20`, border: `1px solid ${tech.color}40`, color: tech.color, cursor: 'pointer', fontWeight: 700 }}>Done ✦</button>
          </div>
        ) : (
          <>
            <svg width={size} height={size} style={{ marginBottom: '1.5rem' }}>
              <circle cx={size/2} cy={size/2} r={80} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
              <circle cx={size/2} cy={size/2} r={80} fill="none" stroke={currentPhase.color} strokeWidth={8}
                strokeDasharray={`${strokeDash} ${circumference}`}
                strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
                style={{ transition: 'stroke-dasharray 0.9s ease' }} />
              <text x={size/2} y={size/2 - 10} textAnchor="middle" fill="#fff" fontSize={14} fontFamily="Cormorant Garamond, serif" opacity={0.6}>{currentPhase.label}</text>
              <text x={size/2} y={size/2 + 20} textAnchor="middle" fill={currentPhase.color} fontSize={36} fontWeight={700} fontFamily="Cormorant Garamond, serif">{currentPhase.duration - phaseTime}</text>
            </svg>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
              {tech.phases.map((p, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '40px', height: '4px', borderRadius: '999px', background: i === phase ? p.color : 'rgba(255,255,255,0.1)' }} />
                  <span style={{ color: i === phase ? p.color : 'rgba(255,255,255,0.25)', fontSize: '0.6rem' }}>{p.label}</span>
                </div>
              ))}
            </div>

            <button onClick={stop} style={{ padding: '0.6rem 1.5rem', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.85rem' }}>Stop</button>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'Cormorant Garamond, serif' }}>Sacred Breathwork</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Angel number breathing techniques</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {TECHNIQUES.map(t => (
          <div key={t.id} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${t.color}15`, border: `1px solid ${t.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{t.emoji}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{t.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>{t.description}</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  {t.phases.map((p, i) => (
                    <span key={i} style={{ background: `${t.color}12`, border: `1px solid ${t.color}20`, borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.68rem', color: t.color }}>{p.label} {p.duration}s</span>
                  ))}
                  <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{t.cycles} cycles</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', fontStyle: 'italic' }}>{t.benefit}</p>
                  <button onClick={() => start(t.id)} style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: `${t.color}20`, border: `1px solid ${t.color}35`, color: t.color, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0, marginLeft: '0.5rem' }}>Begin ▶</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}