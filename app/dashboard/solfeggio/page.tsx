'use client';
import { useState, useRef, useEffect } from 'react';

const FREQUENCIES = [
  { hz: 174, name: 'Foundation', color: '#ef4444', emoji: '🔴', chakra: 'Root', numbers: ['444','111'], benefit: 'Pain relief, security, grounding', description: 'The lowest Solfeggio frequency acts as a natural anesthetic. It relieves pain and stress, giving organs a sense of security and love, encouraging them to do their best work.', affirmation: 'I am safe, grounded, and supported by the earth.' },
  { hz: 285, name: 'Quantum Cognition', color: '#f97316', emoji: '🟠', chakra: 'Sacral', numbers: ['222','333'], benefit: 'Tissue healing, cellular repair', description: 'This frequency influences energy fields, sending them a message to restructure damaged organs. It leaves your body rejuvenated and energized.', affirmation: 'My body heals perfectly and completely.' },
  { hz: 396, name: 'Liberation', color: '#f59e0b', emoji: '🟡', chakra: 'Solar Plexus', numbers: ['999','555'], benefit: 'Release guilt, fear, and grief', description: 'Liberates you from feelings of guilt and fear. It cleanses the feeling of guilt, which often represents one of the basic obstacles to realization.', affirmation: 'I release all guilt and fear. I am free.' },
  { hz: 417, name: 'Transmutation', color: '#22c55e', emoji: '🟢', chakra: 'Heart', numbers: ['555','777'], benefit: 'Undo situations, facilitate change', description: 'Puts you in touch with an inexhaustible source of energy that allows you to change your life. It cleanses traumatic experiences and clears destructive influences.', affirmation: 'I welcome positive change into every area of my life.' },
  { hz: 528, name: 'Love & Miracles', color: '#10b981', emoji: '💚', chakra: 'Heart', numbers: ['222','1212','444'], benefit: 'DNA repair, love, miracles', description: 'Known as the Love frequency and Miracle tone. It resonates at the heart of everything, connecting your heart, your spiritual nature, and the divine harmony.', affirmation: 'I am love. Miracles flow to me naturally.' },
  { hz: 639, name: 'Connection', color: '#3b82f6', emoji: '🔵', chakra: 'Throat', numbers: ['222','333','1111'], benefit: 'Relationships, communication, harmony', description: 'Enables creation of harmonious community and harmonious interpersonal relationships. It can be used for dealing with relationship problems.', affirmation: 'I attract loving, harmonious relationships.' },
  { hz: 741, name: 'Awakening', color: '#6366f1', emoji: '🟣', chakra: 'Third Eye', numbers: ['777','333','1111'], benefit: 'Intuition, problem solving, expression', description: 'Leads to a pure, stable, spiritual life. This frequency cleans the cells from electromagnetic radiation and toxins. It also leads to a healthier, simpler life.', affirmation: 'My intuition is clear and my expression is pure.' },
  { hz: 852, name: 'Inner Order', color: '#8b5cf6', emoji: '💜', chakra: 'Third Eye', numbers: ['777','888','1111'], benefit: 'Return to spiritual order, intuition', description: 'Directly connected to the principle of Light. It can be used as a means for opening a person up for communication with an all-embracing spirit.', affirmation: 'I am aligned with my highest spiritual truth.' },
  { hz: 963, name: 'Divine Connection', color: '#c9a84c', emoji: '✨', chakra: 'Crown', numbers: ['1111','777','999'], benefit: 'Crown activation, oneness, enlightenment', description: 'This frequency awakens any system to its original, perfect state. It is connected with the Light and all-embracing Spirit, and enables direct experience of the Oneness.', affirmation: 'I am one with the divine. I am pure light.' },
];

export default function SolfeggioPage() {
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [duration, setDuration] = useState(5);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTone = () => {
    if (oscillatorRef.current) { try { oscillatorRef.current.stop(); } catch {} oscillatorRef.current = null; }
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setPlaying(null);
    setTimer(0);
  };

  const playTone = (hz: number, idx: number) => {
    stopTone();
    if (playing === idx) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(hz, ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1);
      osc.start();
      oscillatorRef.current = osc;
      gainRef.current = gain;
      setPlaying(idx);
      setTimer(0);
      const totalSecs = duration * 60;
      let elapsed = 0;
      intervalRef.current = setInterval(() => {
        elapsed++;
        setTimer(elapsed);
        if (elapsed >= totalSecs) stopTone();
      }, 1000);
    } catch (e) { console.error(e); }
  };

  useEffect(() => () => stopTone(), []);

  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  const freq = active !== null ? FREQUENCIES[active] : null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Solfeggio Frequencies</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Ancient healing tones for body, mind and soul</p>
      </div>

      {/* Duration selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', padding: '0.875rem 1.25rem', border: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>Session:</span>
        {[3, 5, 10, 15, 20].map(d => (
          <button key={d} onClick={() => setDuration(d)} style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: duration === d ? 'rgba(201,168,76,0.2)' : 'transparent', border: duration === d ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)', color: duration === d ? '#c9a84c' : 'rgba(255,255,255,0.35)' }}>{d}m</button>
        ))}
      </div>

      {/* Frequency grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {FREQUENCIES.map((f, i) => (
          <div key={f.hz} onClick={() => setActive(active === i ? null : i)} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: active === i ? `1px solid ${f.color}40` : '1px solid rgba(255,255,255,0.07)', padding: '0.875rem 1rem', backdropFilter: 'blur(12px)', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${f.color}15`, border: `2px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '1.1rem' }}>{f.emoji}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: f.color, fontWeight: 800, fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem' }}>{f.hz}Hz</span>
                  <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>{f.name}</span>
                  {playing === i && <span style={{ background: `${f.color}20`, border: `1px solid ${f.color}30`, borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.6rem', color: f.color, fontWeight: 700 }}>PLAYING {fmt(timer)}</span>}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginTop: '0.1rem' }}>{f.chakra} Chakra · {f.benefit}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); playing === i ? stopTone() : playTone(f.hz, i); }} style={{ width: '36px', height: '36px', borderRadius: '50%', background: playing === i ? `${f.color}25` : 'rgba(255,255,255,0.05)', border: `1px solid ${f.color}30`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                {playing === i ? '⏹' : '▶'}
              </button>
            </div>
            {active === i && (
              <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.83rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{f.description}</p>
                <div style={{ background: `${f.color}08`, borderRadius: '0.875rem', padding: '0.75rem', border: `1px solid ${f.color}15`, marginBottom: '0.5rem' }}>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Affirmation</p>
                  <p style={{ color: f.color, fontSize: '0.85rem', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>&ldquo;{f.affirmation}&rdquo;</p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {f.numbers.map(n => <span key={n} style={{ background: `${f.color}10`, border: `1px solid ${f.color}20`, borderRadius: '999px', padding: '0.15rem 0.6rem', fontSize: '0.7rem', color: f.color }}>{n}</span>)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', lineHeight: 1.7 }}>Use headphones for best results. Find a quiet space, close your eyes, and breathe deeply while the frequency plays. Set an intention before each session.</p>
      </div>
    </div>
  );
}