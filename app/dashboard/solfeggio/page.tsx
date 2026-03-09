'use client';
import { useState, useEffect, useRef } from 'react';

const frequencies = [
  { hz: 174, name: 'Foundation', color: '#8B4513', desc: 'Reduces pain and stress. Gives organs a sense of security and love.', chakra: 'Root', angelNumber: '111', benefit: 'Pain relief, security, grounding' },
  { hz: 285, name: 'Quantum Cognition', color: '#228B22', desc: 'Influences energy fields. Heals tissues and organs, rejuvenates the body.', chakra: 'Sacral', angelNumber: '222', benefit: 'Tissue healing, energy field repair' },
  { hz: 396, name: 'Liberation', color: '#e53e3e', desc: 'Liberates guilt and fear. Turns grief into joy and guilt into forgiveness.', chakra: 'Root', angelNumber: '333', benefit: 'Release fear, guilt liberation' },
  { hz: 417, name: 'Transformation', color: '#ed8936', desc: 'Undoes situations and facilitates change. Clears traumatic experiences.', chakra: 'Sacral', angelNumber: '444', benefit: 'Change, trauma clearing, new beginnings' },
  { hz: 528, name: 'Miracle', color: '#ecc94b', desc: 'The Love frequency. DNA repair, transformation and miracles.', chakra: 'Solar Plexus', angelNumber: '555', benefit: 'DNA repair, love, miracles' },
  { hz: 639, name: 'Connection', color: '#48bb78', desc: 'Enhances communication, understanding, tolerance and love in relationships.', chakra: 'Heart', angelNumber: '666', benefit: 'Relationships, harmony, communication' },
  { hz: 741, name: 'Awakening', color: '#4299e1', desc: 'Awakens intuition. Cleans cells from toxins. Leads to a purer life.', chakra: 'Throat', angelNumber: '777', benefit: 'Intuition, detox, problem solving' },
  { hz: 852, name: 'Intuition', color: '#805ad5', desc: 'Returns to spiritual order. Awakens inner strength and self-realization.', chakra: 'Third Eye', angelNumber: '888', benefit: 'Spiritual awakening, inner strength' },
  { hz: 963, name: 'Divine', color: '#b794f4', desc: 'Connects to higher self and divine consciousness. Pure miracle tone.', chakra: 'Crown', angelNumber: '999', benefit: 'Divine connection, enlightenment' },
];

export default function SolfeggioPage() {
  const [playing, setPlaying] = useState<number | null>(null);
  const [selected, setSelected] = useState(4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const playFrequency = (hz: number, idx: number) => {
    stopSound();
    if (playing === idx) { setPlaying(null); return; }
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
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.5);
      osc.start();
      oscillatorRef.current = osc;
      gainRef.current = gain;
      setPlaying(idx);
    } catch(e) { console.error(e); }
  };

  const stopSound = () => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.3);
      setTimeout(() => { oscillatorRef.current?.stop(); audioCtxRef.current?.close(); }, 400);
    }
    setPlaying(null);
  };

  useEffect(() => () => stopSound(), []);
  const f = frequencies[selected];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>🎵 Solfeggio Frequencies</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Ancient healing tones aligned with sacred numerology</p>

      <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid ' + f.color + '55', borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '1.5rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', fontWeight: 800, color: f.color, marginBottom: '0.25rem', textShadow: '0 0 30px ' + f.color + '66' }}>{f.hz} Hz</div>
        <div style={{ color: '#e8d5b7', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{f.name}</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>{f.desc}</div>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid rgba(201,168,76,0.3)' }}>✨ {f.benefit}</span>
          <span style={{ background: f.color + '22', color: f.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid ' + f.color + '44' }}>🔢 {f.angelNumber}</span>
          <span style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem' }}>⚡ {f.chakra}</span>
        </div>
        <button onClick={() => playFrequency(f.hz, selected)} style={{ background: playing === selected ? 'rgba(255,100,100,0.2)' : f.color + '33', color: playing === selected ? '#fc8181' : f.color, border: '1px solid ' + (playing === selected ? 'rgba(255,100,100,0.4)' : f.color + '66'), padding: '0.8rem 2.5rem', borderRadius: '999px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
          {playing === selected ? '⏹ Stop' : '▶ Play ' + f.hz + 'Hz'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
        {frequencies.map((freq, i) => (
          <button key={i} onClick={() => { stopSound(); setSelected(i); }} style={{ padding: '0.9rem 0.5rem', borderRadius: '0.9rem', background: selected === i ? 'rgba(8,6,28,0.9)' : 'rgba(8,6,28,0.5)', border: selected === i ? '1px solid ' + freq.color + '66' : '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: freq.color }}>{freq.hz}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>{freq.name}</div>
            {playing === i && <div style={{ fontSize: '0.6rem', color: freq.color, marginTop: '0.2rem' }}>♪ playing</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
