'use client';
import SaveReadingButton from '@/components/SaveReadingButton';
import { useState, useEffect } from 'react';

const KARMIC_NUMBERS = {
  13: { title: 'Karmic Debt 13', color: '#ef4444', theme: 'Laziness & Hard Work', past: 'In a past life, you avoided hard work and took shortcuts at others’ expense.', lesson: 'Embrace discipline, focus, and consistent effort. Success comes through sustained work.', angel: '444', affirmation: 'I build my dreams with dedication and joy.', signs: ['Feeling blocked despite effort', 'Procrastination patterns', 'Projects left unfinished', 'Fear of commitment'] },
  14: { title: 'Karmic Debt 14', color: '#f97316', theme: 'Freedom & Responsibility', past: 'You misused freedom in a past life, indulging in excess and avoiding responsibility.', lesson: 'Find freedom through discipline. Moderation and commitment are your path to true liberation.', angel: '555', affirmation: 'I embrace freedom through responsibility and balance.', signs: ['Addiction tendencies', 'Commitment issues', 'Restlessness and boredom', 'Overindulgence patterns'] },
  16: { title: 'Karmic Debt 16', color: '#8b5cf6', theme: 'Ego & Humility', past: 'Pride and ego caused harm to others in a past life. Love was used for selfish gain.', lesson: 'Surrender the ego. True love is selfless. Spiritual growth comes through humility.', angel: '999', affirmation: 'I release my ego and open to divine love.', signs: ['Repeated relationship endings', 'Sudden life upheavals', 'Spiritual crises', 'Pride before falls'] },
  19: { title: 'Karmic Debt 19', color: '#c9a84c', theme: 'Independence & Interdependence', past: 'You misused power and refused help from others, acting selfishly in positions of authority.', lesson: 'Learn to receive help gracefully. True strength includes vulnerability and cooperation.', angel: '111', affirmation: 'I lead with love and receive support with grace.', signs: ['Difficulty asking for help', 'Feeling alone despite success', 'Power struggles', 'Stubborn independence'] },
};

const reduce = (n: number): number => {
  if (n <= 9 || n === 11 || n === 22 || n === 33) return n;
  return reduce(n.toString().split('').reduce((a, c) => a + parseInt(c), 0));
};

export default function KarmicDebtPage() {
  const [dob, setDob] = useState('');
  const [name, setName] = useState('');
  const [debts, setDebts] = useState<number[]>([]);
  const [calculated, setCalculated] = useState(false);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('synchrosoul_profile') || '{}');
      if (p.birthdate) setDob(p.birthdate);
      if (p.name) setName(p.name);
    } catch {}
  }, []);

  const calculate = () => {
    const found: number[] = [];
    if (dob) {
      const [y, m, d] = dob.split('-').map(Number);
      const lp = y.toString().split('').reduce((a,c)=>a+parseInt(c),0) + m + d;
      if ([13,14,16,19].includes(lp)) found.push(lp);
      if ([13,14,16,19].includes(d)) found.push(d);
    }
    if (name) {
      const letterVal: Record<string,number> = {A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8};
      const upper = name.toUpperCase().replace(/[^A-Z]/g,'');
      const destiny = upper.split('').reduce((a,c)=>a+(letterVal[c]||0),0);
      if ([13,14,16,19].includes(destiny)) found.push(destiny);
    }
    setDebts([...new Set(found)]);
    setCalculated(true);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#ef4444', fontFamily: 'Cormorant Garamond, serif' }}>Karmic Debt</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Discover and heal your soul’s karmic lessons</p>
      </div>
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', lineHeight: 1.7, marginBottom: '1rem' }}>Karmic debt numbers (13, 14, 16, 19) appear in your numerology chart when your soul carries lessons from past lives. They are not punishments — they are opportunities for profound growth.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div><label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>Date of Birth</label>
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box', colorScheme: 'dark' }} /></div>
          <div><label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>Full Birth Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Optional" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box' }} /></div>
          <button onClick={calculate} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '999px', padding: '0.875rem', cursor: 'pointer', color: '#ef4444', fontWeight: 700, fontSize: '0.95rem' }}>Reveal My Karmic Lessons</button>
        </div>
      </div>
      {calculated && (
        debts.length === 0 ? (
          <div style={{ background: 'rgba(34,197,94,0.08)', borderRadius: '1.5rem', border: '1px solid rgba(34,197,94,0.2)', padding: '2rem', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✨</div>
            <h3 style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.2rem', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem' }}>No Karmic Debt Found</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.7 }}>Your chart shows no karmic debt numbers. Your soul enters this life with a clean slate, free to focus on your life path purpose without heavy karmic burdens.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {debts.map(n => {
              const k = KARMIC_NUMBERS[n as keyof typeof KARMIC_NUMBERS];
              if (!k) return null;
              return (
                <div key={n} style={{ background: 'rgba(8,6,28,0.92)', borderRadius: '1.5rem', border: `1px solid ${k.color}25`, padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `${k.color}15`, border: `2px solid ${k.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: k.color, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', flexShrink: 0 }}>{n}</div>
                    <div><p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: 'Cormorant Garamond, serif' }}>{k.title}</p><p style={{ color: k.color, fontSize: '0.78rem' }}>{k.theme}</p></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}><p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Past Life Pattern</p><p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.83rem', lineHeight: 1.6 }}>{k.past}</p></div>
                    <div style={{ background: `${k.color}08`, borderRadius: '0.875rem', padding: '0.75rem', border: `1px solid ${k.color}15` }}><p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Soul Lesson</p><p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.83rem', lineHeight: 1.6 }}>{k.lesson}</p></div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }}><p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Signs in Your Life</p><div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>{k.signs.map((s,i) => <p key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem' }}>• {s}</p>)}</div></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ background: `${k.color}10`, border: `1px solid ${k.color}20`, borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', color: k.color, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{k.angel}</span><p style={{ color: k.color, fontSize: '0.78rem', fontStyle: 'italic' }}>&ldquo;{k.affirmation}&rdquo;</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}