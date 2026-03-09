'use client';
import { useState } from 'react';

const numbers = [
  { n: '000', color: '#b794f4', title: 'Divine Completion', meaning: 'You are at the beginning and end of a cycle. The universe is signaling infinite potential and divine wholeness. A reminder that you are one with everything.', action: 'Meditate on oneness. Release all that is complete. Prepare for a new cycle to begin.', keywords: ['Infinity', 'Wholeness', 'New cycle', 'Divine'] },
  { n: '111', color: '#ffd700', title: 'Manifestation Portal', meaning: 'Your thoughts are manifesting rapidly. The universe is amplifying your intentions. Be mindful of what you focus on — you are a powerful creator right now.', action: 'Write down your top 3 desires. Visualize them as already real. Avoid negative thoughts.', keywords: ['Manifestation', 'New beginnings', 'Alignment', 'Creation'] },
  { n: '222', color: '#48bb78', title: 'Divine Balance', meaning: 'Trust the process. Everything is unfolding in perfect divine timing. Your relationships and partnerships are being divinely guided toward harmony.', action: 'Practice patience. Trust without needing proof. Nurture your key relationships.', keywords: ['Balance', 'Partnership', 'Trust', 'Harmony'] },
  { n: '333', color: '#ed8936', title: 'Ascended Masters', meaning: 'The ascended masters — Jesus, Buddha, Quan Yin — are near. You are being supported, loved, and guided. Your creative energy is at its peak.', action: 'Create something. Express yourself. Ask for guidance from your spiritual team.', keywords: ['Creativity', 'Growth', 'Support', 'Expression'] },
  { n: '444', color: '#4299e1', title: 'Angelic Protection', meaning: 'Your angels are surrounding you right now. You are safe, protected, and deeply loved. The foundation you are building is solid and divinely supported.', action: 'Feel the protection around you. Ground yourself. Trust your foundation is strong.', keywords: ['Protection', 'Stability', 'Angels', 'Foundation'] },
  { n: '555', color: '#9b59b6', title: 'Major Change', meaning: 'Significant transformation is coming or already happening. Release resistance. This change is divinely orchestrated for your highest good, even if it feels uncertain.', action: 'Embrace change. Release control. Say yes to new opportunities appearing.', keywords: ['Change', 'Transformation', 'Freedom', 'Adventure'] },
  { n: '666', color: '#e53e3e', title: 'Rebalance', meaning: 'A gentle nudge to rebalance your thoughts between the material and spiritual. You may be overthinking or worrying. Shift focus to love and service.', action: 'Step away from screens. Spend time in nature. Refocus on what truly matters.', keywords: ['Balance', 'Reframe', 'Love', 'Service'] },
  { n: '777', color: '#c9a84c', title: 'Divine Magic', meaning: 'You are in perfect alignment with the universe. Magic is happening. Luck, synchronicity, and spiritual downloads are flowing to you. Keep going.', action: 'Follow your intuition completely. Notice synchronicities. You are on the right path.', keywords: ['Magic', 'Luck', 'Alignment', 'Spiritual gifts'] },
  { n: '888', color: '#f6ad55', title: 'Infinite Abundance', meaning: 'Abundance in all forms — financial, spiritual, emotional — is flowing to you. The universe is rewarding your efforts. Receive with gratitude and open hands.', action: 'Open yourself to receive. Express gratitude for current abundance. Take inspired action toward financial goals.', keywords: ['Abundance', 'Prosperity', 'Infinity', 'Reward'] },
  { n: '999', color: '#fc8181', title: 'Divine Completion', meaning: 'A major chapter of your life is completing. Release the old with love and gratitude. Your soul is ready for the next level of its evolution.', action: 'Let go of what is ending. Forgive and release. Celebrate how far you have come.', keywords: ['Completion', 'Release', 'Wisdom', 'Evolution'] },
  { n: '1010', color: '#76e4f7', title: 'Spiritual Awakening', meaning: 'You are awakening to your true spiritual nature. The universe is opening new doors of consciousness. Pay attention to your thoughts and inner guidance.', action: 'Meditate daily. Journal your insights. Trust your spiritual journey.', keywords: ['Awakening', 'Consciousness', 'New path', 'Enlightenment'] },
  { n: '1111', color: '#ffd700', title: 'Master Portal', meaning: 'The most powerful manifestation portal. A direct line to the universe. Your soul is fully awake. Make a wish, set an intention, and know it is already done.', action: 'Stop and make a wish or set a powerful intention. You are seen by the universe.', keywords: ['Master number', 'Portal', 'Soul awakening', 'Wish'] },
  { n: '1212', color: '#b794f4', title: 'Cosmic Alignment', meaning: 'You are exactly where you need to be. The universe is confirming your path. Step out of your comfort zone — your angels are cheering you forward.', action: 'Take that bold step you have been hesitating on. You are fully supported.', keywords: ['Alignment', 'Courage', 'Path confirmation', 'Support'] },
  { n: '1234', color: '#68d391', title: 'Step by Step', meaning: 'You are progressing perfectly, one step at a time. Trust the sequential unfolding of your journey. Each step is leading to something beautiful.', action: 'Focus on the next single step only. Trust the process. Celebrate small wins.', keywords: ['Progress', 'Steps', 'Trust', 'Journey'] },
  { n: '2222', color: '#48bb78', title: 'Deep Trust', meaning: 'An amplified message of trust and divine timing. Everything you have been working toward is coming together behind the scenes. Hold steady.', action: 'Do not give up. Hold your vision. Trust that unseen forces are working for you.', keywords: ['Trust', 'Patience', 'Divine timing', 'Manifestation'] },
];

export default function DictionaryPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof numbers[0] | null>(null);
  const filtered = numbers.filter(n => n.n.includes(search) || n.title.toLowerCase().includes(search.toLowerCase()) || n.keywords.some(k => k.toLowerCase().includes(search.toLowerCase())));

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>📖 Angel Number Dictionary</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Complete guide to angel number meanings</p>
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search numbers, meanings, keywords...' style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem', borderRadius: '0.9rem', background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }} />
        <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem' }}>🔍</span>
      </div>
      {selected ? (
        <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid ' + selected.color + '44', borderRadius: '1.25rem', padding: '1.75rem', backdropFilter: 'blur(12px)' }}>
          <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', padding: '0.4rem 1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '1.25rem' }}>← Back</button>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: selected.color, textShadow: '0 0 30px ' + selected.color + '66', marginBottom: '0.25rem' }}>{selected.n}</div>
            <div style={{ color: '#e8d5b7', fontSize: '1.3rem', fontWeight: 600 }}>{selected.title}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.9rem', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ color: selected.color, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>✨ Meaning</div>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, margin: 0 }}>{selected.meaning}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.9rem', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ color: '#c9a84c', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>⚡ Action to Take</div>
            <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, margin: 0 }}>{selected.action}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {selected.keywords.map(k => <span key={k} style={{ background: selected.color + '22', color: selected.color, padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', border: '1px solid ' + selected.color + '44' }}>{k}</span>)}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map((num, i) => (
            <button key={i} onClick={() => setSelected(num)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.1rem', borderRadius: '0.9rem', background: 'rgba(8,6,28,0.75)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', textAlign: 'left', backdropFilter: 'blur(8px)', width: '100%' }}>
              <div style={{ minWidth: '60px', textAlign: 'center', fontSize: '1.3rem', fontWeight: 800, color: num.color }}>{num.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#e8d5b7', fontWeight: 600, fontSize: '0.95rem' }}>{num.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{num.keywords.slice(0,3).join(' · ')}</div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>›</span>
            </button>
          ))}
          {filtered.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '3rem' }}>No numbers found for "{search}"</div>}
        </div>
      )}
    </div>
  );
}
