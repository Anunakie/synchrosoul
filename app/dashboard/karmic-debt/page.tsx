'use client';
import { useState, useEffect } from 'react';

const karmicDebtNumbers: Record<number, { title: string; color: string; emoji: string; lesson: string; past: string; healing: string[]; affirmation: string }> = {
  13: { title: 'The Transformer', color: '#e74c3c', emoji: '🔥', lesson: 'You carry karma from past lives of laziness, negativity, or misuse of creative energy. This life demands discipline, hard work, and transformation through effort.', past: 'In past lives, you may have avoided responsibility, taken shortcuts, or used your creative gifts destructively. Others did your work while you coasted.', healing: ['Embrace hard work without resentment', 'Complete what you start', 'Transform negative patterns consciously', 'Use creativity in service of others'], affirmation: 'I embrace transformation through discipline. My hard work is sacred and purposeful.' },
  14: { title: 'The Liberator', color: '#f39c12', emoji: '🦋', lesson: 'Karma from past lives of overindulgence, abuse of freedom, or controlling others. This life teaches responsible use of freedom and moderation.', past: 'You may have been a tyrant, an addict, or someone who used freedom irresponsibly — harming yourself or others through excess or control.', healing: ['Practice moderation in all things', 'Honor the freedom of others as sacred', 'Face addictive patterns with courage', 'Embrace healthy structure and routine'], affirmation: 'I use my freedom wisely and honor the freedom of all souls around me.' },
  16: { title: 'The Humbler', color: '#9b59b6', emoji: '💫', lesson: 'Karma from past lives of ego, pride, or misuse of love and relationships. This life brings repeated ego dissolution to reconnect you with divine love.', past: 'You may have been arrogant, unfaithful, or used your charm and intelligence to manipulate others for personal gain.', healing: ['Surrender ego to higher purpose', 'Practice radical humility', 'Heal relationship patterns consciously', 'Connect with divine love beyond ego'], affirmation: 'I release my ego to the divine. I am a vessel of pure love and humble service.' },
  19: { title: 'The Independent', color: '#3498db', emoji: '⭐', lesson: 'Karma from past lives of misusing power, abusing authority, or refusing to help others. This life demands learning to stand alone while remaining compassionate.', past: 'You may have been a powerful leader who used others for personal gain, or someone who refused to share their gifts and resources.', healing: ['Develop true independence without isolation', 'Use power in service of others', 'Ask for help when needed — it is strength', 'Share your gifts generously'], affirmation: 'I stand in my power with humility. My strength is a gift I share freely with the world.' },
};

function calcKarmicDebt(birthdate: string): number[] {
  if (!birthdate) return [];
  const d = new Date(birthdate);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();
  const debts: number[] = [];
  const karmicNums = [13, 14, 16, 19];
  // Check birth day
  if (karmicNums.includes(day)) debts.push(day);
  // Check birth month + day sum
  const monthDay = month + day;
  if (karmicNums.includes(monthDay)) debts.push(monthDay);
  // Check full date sum before reduction
  const fullSum = String(month).split('').reduce((a,c)=>a+parseInt(c),0) +
    String(day).split('').reduce((a,c)=>a+parseInt(c),0) +
    String(year).split('').reduce((a,c)=>a+parseInt(c),0);
  if (karmicNums.includes(fullSum)) debts.push(fullSum);
  return [...new Set(debts)];
}

function calcLifePath(birthdate: string): number {
  if (!birthdate) return 0;
  const digits = birthdate.replace(/-/g,'').split('').reduce((a,c)=>a+parseInt(c),0);
  let n = digits;
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a,c)=>a+parseInt(c),0);
  }
  return n;
}

export default function KarmicDebtPage() {
  const [birthdate, setBirthdate] = useState('');
  const [debts, setDebts] = useState<number[]>([]);
  const [lifePath, setLifePath] = useState(0);
  const [activeDebt, setActiveDebt] = useState<number | null>(null);

  useEffect(() => {
    const p = localStorage.getItem('synchrosoul_profile');
    if (p) {
      const prof = JSON.parse(p);
      if (prof.birthdate) {
        setBirthdate(prof.birthdate);
        const d = calcKarmicDebt(prof.birthdate);
        setDebts(d);
        setLifePath(calcLifePath(prof.birthdate));
        if (d.length > 0) setActiveDebt(d[0]);
      }
    }
  }, []);

  const handleBirthdate = (val: string) => {
    setBirthdate(val);
    if (val) {
      const d = calcKarmicDebt(val);
      setDebts(d);
      setLifePath(calcLifePath(val));
      if (d.length > 0) setActiveDebt(d[0]);
      const p = localStorage.getItem('synchrosoul_profile');
      const prof = p ? JSON.parse(p) : {};
      localStorage.setItem('synchrosoul_profile', JSON.stringify({ ...prof, birthdate: val }));
    }
  };

  const activeData = activeDebt ? karmicDebtNumbers[activeDebt] : null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>⚖️ Karmic Debt</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Soul lessons carried from past lives into this incarnation</p>

      {!birthdate ? (
        <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '2rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔮</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>Enter your birthdate to reveal your karmic debt numbers</p>
          <input type="date" value={birthdate} onChange={e => handleBirthdate(e.target.value)} style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.95rem', outline: 'none' }} />
        </div>
      ) : (
        <>
          <input type="date" value={birthdate} onChange={e => handleBirthdate(e.target.value)} style={{ display: 'block', margin: '0 auto 1.5rem', padding: '0.5rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', outline: 'none' }} />

          {debts.length === 0 ? (
            <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(72,187,120,0.3)', borderRadius: '1.5rem', padding: '2.5rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h2 style={{ color: '#48bb78', fontSize: '1.3rem', marginBottom: '0.75rem' }}>No Karmic Debt Detected</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, fontSize: '0.95rem' }}>Your numerological chart shows no karmic debt numbers. Your soul enters this life with a relatively clean slate, free to focus on growth and expansion rather than repayment.</p>
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(72,187,120,0.1)', borderRadius: '0.9rem', border: '1px solid rgba(72,187,120,0.2)' }}>
                <p style={{ color: '#48bb78', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>Life Path {lifePath} — Your soul chose this number freely, without karmic obligation. Walk your path with gratitude.</p>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {debts.map(d => {
                  const data = karmicDebtNumbers[d];
                  return (
                    <button key={d} onClick={() => setActiveDebt(d)} style={{ padding: '0.75rem 1.5rem', borderRadius: '1rem', background: activeDebt === d ? 'rgba('+data.color.replace('#','').match(/../g)!.map(h=>parseInt(h,16)).join(',')+',.2)' : 'rgba(255,255,255,0.05)', border: activeDebt === d ? '1px solid ' + data.color + '66' : '1px solid rgba(255,255,255,0.08)', color: activeDebt === d ? data.color : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}>
                      {data.emoji} {d}
                    </button>
                  );
                })}
              </div>

              {activeData && activeDebt && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ background: 'rgba(8,6,28,0.9)', border: '1px solid ' + activeData.color + '44', borderRadius: '1.5rem', padding: '2rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{activeData.emoji}</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: activeData.color, marginBottom: '0.25rem' }}>{activeDebt}</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '1rem' }}>{activeData.title}</div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>{activeData.lesson}</p>
                  </div>

                  <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
                    <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>🔄 Past Life Pattern</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '0.9rem', margin: 0 }}>{activeData.past}</p>
                  </div>

                  <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(72,187,120,0.2)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
                    <h3 style={{ color: '#48bb78', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>💚 Healing Path</h3>
                    {activeData.healing.map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.5rem 0', borderBottom: i < activeData.healing.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <span style={{ color: '#48bb78', marginTop: '0.1rem' }}>✓</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{h}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: 'linear-gradient(135deg, rgba(155,89,182,0.15), rgba(201,168,76,0.1))', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(8px)', textAlign: 'center' }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>✨ Soul Affirmation</div>
                    <p style={{ color: '#e8d5b7', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.8, margin: 0 }}>“{activeData.affirmation}”</p>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
