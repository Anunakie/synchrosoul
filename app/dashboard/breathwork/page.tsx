'use client';
import { useState, useEffect, useRef } from 'react';

const techniques = [
  { name: '4-7-8 Calm', inhale: 4, hold: 7, exhale: 8, cycles: 4, color: '#4299e1', desc: 'Activates parasympathetic nervous system. Perfect before sleep or during anxiety.', angelNumber: '444' },
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, cycles: 6, color: '#9370db', desc: 'Used by Navy SEALs. Balances the nervous system and sharpens focus.', angelNumber: '1111' },
  { name: '5-5 Balance', inhale: 5, hold: 0, exhale: 5, cycles: 8, color: '#48bb78', desc: 'Simple coherent breathing. Syncs heart rate variability and reduces stress.', angelNumber: '555' },
  { name: 'Energizing 2-1-4', inhale: 2, hold: 1, exhale: 4, cycles: 10, color: '#ed8936', desc: 'Quick energizing breath. Great for morning activation and mental clarity.', angelNumber: '333' },
  { name: 'Deep Release', inhale: 6, hold: 2, exhale: 8, cycles: 5, color: '#c9a84c', desc: 'Deep release breathing. Clears emotional blockages and promotes healing.', angelNumber: '999' },
];

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'done';

export default function BreathworkPage() {
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState<Phase>('idle');
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [scale, setScale] = useState(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const t = techniques[selected];

  const clearTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  const runPhase = (ph: Phase, duration: number, nextFn: () => void) => {
    setPhase(ph);
    setCount(duration);
    setScale(ph === 'inhale' ? 1.6 : ph === 'exhale' ? 0.8 : 1.2);
    let remaining = duration;
    clearTimer();
    timerRef.current = setInterval(() => {
      remaining -= 1;
      setCount(remaining);
      if (remaining <= 0) { clearTimer(); nextFn(); }
    }, 1000);
  };

  const startCycle = (cycleNum: number) => {
    if (cycleNum >= t.cycles) { setPhase('done'); setScale(1); return; }
    setCycle(cycleNum);
    runPhase('inhale', t.inhale, () => {
      if (t.hold > 0) {
        runPhase('hold', t.hold, () => runPhase('exhale', t.exhale, () => startCycle(cycleNum + 1)));
      } else {
        runPhase('exhale', t.exhale, () => startCycle(cycleNum + 1));
      }
    });
  };

  const start = () => { setCycle(0); startCycle(0); };
  const stop = () => { clearTimer(); setPhase('idle'); setScale(1); setCycle(0); };

  useEffect(() => () => clearTimer(), []);

  const phaseLabel: Record<Phase, string> = { idle: 'Ready', inhale: 'Breathe In', hold: 'Hold', exhale: 'Breathe Out', done: 'Complete' };
  const phaseColor: Record<Phase, string> = { idle: 'rgba(255,255,255,0.4)', inhale: '#48bb78', hold: '#c9a84c', exhale: '#4299e1', done: '#9370db' };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>🌬️ Breathwork</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Sacred breathing aligned with angel numbers</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
        {techniques.map((tech, i) => (
          <button key={i} onClick={() => { stop(); setSelected(i); }} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.9rem 1.1rem', borderRadius: '0.9rem', background: selected === i ? 'rgba(8,6,28,0.9)' : 'rgba(8,6,28,0.5)', border: selected === i ? '1px solid ' + tech.color + '66' : '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'left', backdropFilter: 'blur(8px)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: tech.color + '22', border: '2px solid ' + tech.color + '66', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: tech.color, fontSize: '0.75rem', fontWeight: 700 }}>{tech.angelNumber}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: selected === i ? tech.color : 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.95rem' }}>{tech.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{tech.inhale}s in {tech.hold > 0 ? '· ' + tech.hold + 's hold ' : ''}· {tech.exhale}s out · {tech.cycles} cycles</div>
            </div>
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: t.color + '15', border: '2px solid ' + t.color + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.8s ease-in-out', transform: 'scale(' + scale + ')', boxShadow: phase !== 'idle' ? '0 0 40px ' + t.color + '44' : 'none' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, color: phaseColor[phase] }}>{phase !== 'idle' && phase !== 'done' ? count : phase === 'done' ? '✓' : t.angelNumber}</div>
              <div style={{ color: phaseColor[phase], fontSize: '0.85rem', marginTop: '0.25rem' }}>{phaseLabel[phase]}</div>
            </div>
          </div>
        </div>

        {phase !== 'idle' && phase !== 'done' && (
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1rem' }}>Cycle {cycle + 1} of {t.cycles}</div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {(phase === 'idle' || phase === 'done') ? (
            <button onClick={start} style={{ background: t.color, color: 'white', border: 'none', padding: '0.8rem 2.5rem', borderRadius: '999px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>Begin</button>
          ) : (
            <button onClick={stop} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.8rem 2.5rem', borderRadius: '999px', fontSize: '1rem', cursor: 'pointer' }}>Stop</button>
          )}
        </div>
      </div>

      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(10px)' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0, fontSize: '0.9rem' }}>{t.desc}</p>
      </div>
    </div>
  );
}
