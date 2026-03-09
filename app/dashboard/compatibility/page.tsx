'use client';
import { useState } from 'react';

function reduce(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  if (n < 10) return n;
  return reduce(String(n).split('').reduce((a, d) => a + parseInt(d), 0));
}
function lifePathFrom(dob: string): number {
  if (!dob) return 0;
  const [y, m, d] = dob.split('-').map(Number);
  return reduce(reduce(y) + reduce(m) + reduce(d));
}

const meanings: Record<number, { title: string; desc: string; color: string }> = {
  1: { title: 'The Leader', desc: 'Independent, pioneering, ambitious', color: '#e53e3e' },
  2: { title: 'The Peacemaker', desc: 'Sensitive, cooperative, diplomatic', color: '#48bb78' },
  3: { title: 'The Creator', desc: 'Expressive, joyful, communicative', color: '#ed8936' },
  4: { title: 'The Builder', desc: 'Stable, practical, hardworking', color: '#4299e1' },
  5: { title: 'The Adventurer', desc: 'Free, curious, adaptable', color: '#9b59b6' },
  6: { title: 'The Nurturer', desc: 'Caring, responsible, harmonious', color: '#f6ad55' },
  7: { title: 'The Seeker', desc: 'Analytical, spiritual, introspective', color: '#76e4f7' },
  8: { title: 'The Achiever', desc: 'Powerful, ambitious, material mastery', color: '#c9a84c' },
  9: { title: 'The Humanitarian', desc: 'Compassionate, wise, universal love', color: '#fc8181' },
  11: { title: 'The Illuminator', desc: 'Intuitive, inspirational, master teacher', color: '#b794f4' },
  22: { title: 'The Master Builder', desc: 'Visionary, practical idealist, legacy creator', color: '#ffd700' },
  33: { title: 'The Master Healer', desc: 'Compassionate teacher, selfless service', color: '#f48fb1' },
};

const compatMatrix: Record<string, { score: number; desc: string; challenge: string }> = {
  '1-1': { score: 72, desc: 'Two leaders who inspire each other but must share the spotlight.', challenge: 'Power struggles and ego clashes.' },
  '1-2': { score: 88, desc: 'Perfect balance of leadership and support. Yin and yang energy.', challenge: 'Leader may overshadow the peacemaker.' },
  '1-3': { score: 85, desc: 'Dynamic, creative, and exciting. Endless inspiration together.', challenge: 'Both need attention — who gives first?' },
  '1-4': { score: 78, desc: 'Builder grounds the leader. Solid foundation for big dreams.', challenge: 'Leader finds builder too slow; builder finds leader reckless.' },
  '1-5': { score: 80, desc: 'Adventurous and exciting. Both love freedom and new experiences.', challenge: 'Neither wants to settle down or compromise.' },
  '1-6': { score: 82, desc: 'Nurturer supports leader beautifully. Warm and devoted pairing.', challenge: 'Leader may take nurturer for granted.' },
  '1-7': { score: 75, desc: 'Intellectual depth meets bold action. Fascinating connection.', challenge: 'Seeker needs solitude; leader needs action.' },
  '1-8': { score: 90, desc: 'Power couple energy. Both ambitious and driven to succeed.', challenge: 'Competition and dominance battles.' },
  '1-9': { score: 83, desc: 'Visionary meets humanitarian. World-changing potential together.', challenge: 'Different motivations — personal vs universal.' },
  '2-2': { score: 86, desc: 'Deeply empathic and harmonious. Emotional safety and understanding.', challenge: 'Both avoid conflict — issues go unaddressed.' },
  '2-3': { score: 87, desc: 'Joyful, warm, and creatively rich. Natural emotional connection.', challenge: 'Peacemaker may feel overshadowed by creator.' },
  '2-4': { score: 84, desc: 'Stable, secure, and deeply committed. Built to last.', challenge: 'Can become too routine and lose spark.' },
  '2-5': { score: 70, desc: 'Opposites attract but tension is real. Growth through contrast.', challenge: 'Adventurer craves freedom; peacemaker needs security.' },
  '2-6': { score: 95, desc: 'Soulmate energy. Both devoted, caring, and family-oriented.', challenge: 'Over-giving can lead to codependency.' },
  '2-7': { score: 79, desc: 'Deep spiritual bond. Both introspective and sensitive.', challenge: 'Seeker withdraws; peacemaker feels abandoned.' },
  '2-8': { score: 76, desc: 'Achiever provides; peacemaker nurtures. Complementary roles.', challenge: 'Achiever may be emotionally unavailable.' },
  '2-9': { score: 88, desc: 'Compassionate and loving. Both give deeply to others.', challenge: 'May neglect each other while serving the world.' },
  '3-3': { score: 82, desc: 'Wildly creative and fun. Life is a celebration together.', challenge: 'Lack of grounding — who handles reality?' },
  '3-4': { score: 74, desc: 'Builder grounds creator. Practical magic when it works.', challenge: 'Builder finds creator scattered; creator finds builder boring.' },
  '3-5': { score: 91, desc: 'Electric, adventurous, and endlessly fun. High-vibe match.', challenge: 'Both avoid responsibility and commitment.' },
  '3-6': { score: 86, desc: 'Warm, expressive, and family-loving. Beautiful domestic harmony.', challenge: 'Creator needs freedom; nurturer needs stability.' },
  '3-7': { score: 77, desc: 'Intellectual and creative sparks fly. Fascinating conversations.', challenge: 'Seeker is private; creator is expressive.' },
  '3-8': { score: 79, desc: 'Creative vision meets business acumen. Powerful team.', challenge: 'Achiever is serious; creator is playful.' },
  '3-9': { score: 89, desc: 'Artistic, compassionate, and inspired. Beautiful souls together.', challenge: 'Both dreamers — who grounds the vision?' },
  '4-4': { score: 80, desc: 'Rock-solid foundation. Reliable, committed, and stable.', challenge: 'Too rigid — no room for spontaneity or growth.' },
  '4-5': { score: 65, desc: 'Challenging but growth-inducing. Opposites in every way.', challenge: 'Builder needs routine; adventurer needs chaos.' },
  '4-6': { score: 88, desc: 'Home-loving, devoted, and deeply stable. Family-first energy.', challenge: 'Can become too comfortable and stagnant.' },
  '4-7': { score: 83, desc: 'Intellectual depth and practical wisdom. Quietly powerful.', challenge: 'Both introverted — social isolation risk.' },
  '4-8': { score: 87, desc: 'Material mastery and legacy building. Unstoppable team.', challenge: 'Work becomes everything; intimacy suffers.' },
  '4-9': { score: 72, desc: 'Practical meets idealistic. Can balance beautifully.', challenge: 'Builder is concrete; humanitarian is abstract.' },
  '5-5': { score: 78, desc: 'Wild, free, and adventurous. Never a dull moment.', challenge: 'Zero stability — both run from commitment.' },
  '5-6': { score: 73, desc: 'Freedom meets devotion. Tension creates growth.', challenge: 'Adventurer feels trapped; nurturer feels abandoned.' },
  '5-7': { score: 82, desc: 'Both independent and philosophical. Respect each other deeply.', challenge: 'Two loners — who initiates connection?' },
  '5-8': { score: 77, desc: 'Ambitious and adventurous. Big life, big energy.', challenge: 'Achiever wants control; adventurer resists it.' },
  '5-9': { score: 85, desc: 'Freedom-loving humanitarians. Inspired and world-expanding.', challenge: 'Both scattered — need grounding together.' },
  '6-6': { score: 84, desc: 'Deeply devoted and nurturing. Home is a sanctuary.', challenge: 'Over-giving leads to martyrdom and resentment.' },
  '6-7': { score: 76, desc: 'Nurturer draws out the seeker. Healing and depth.', challenge: 'Seeker needs space; nurturer needs closeness.' },
  '6-8': { score: 85, desc: 'Provider and nurturer. Beautiful complementary roles.', challenge: 'Achiever works too much; nurturer feels alone.' },
  '6-9': { score: 92, desc: 'Twin flames of service and love. Deeply spiritual bond.', challenge: 'Both give to everyone — must prioritize each other.' },
  '7-7': { score: 81, desc: 'Profound spiritual and intellectual connection. Soul-deep.', challenge: 'Two hermits — world shrinks to just them.' },
  '7-8': { score: 74, desc: 'Wisdom meets ambition. Fascinating and complex.', challenge: 'Seeker is spiritual; achiever is material.' },
  '7-9': { score: 88, desc: 'Spiritual seekers on a shared journey. Deeply meaningful.', challenge: 'Both in their heads — need to ground in body.' },
  '8-8': { score: 83, desc: 'Empire builders. Unstoppable material and spiritual power.', challenge: 'Two alphas — constant power dynamics.' },
  '8-9': { score: 80, desc: 'Wealth meets wisdom. Can change the world together.', challenge: 'Achiever is self-focused; humanitarian is other-focused.' },
  '9-9': { score: 86, desc: 'Old souls who understand each other completely.', challenge: 'Both carry the weight of the world — need lightness.' },
};

function getCompat(a: number, b: number) {
  const key1 = a <= b ? a + '-' + b : b + '-' + a;
  return compatMatrix[key1] || { score: 75, desc: 'A unique and powerful connection with great potential.', challenge: 'Navigate differences with open communication.' };
}

export default function CompatibilityPage() {
  const [dob1, setDob1] = useState('');
  const [dob2, setDob2] = useState('');
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<null | { lp1: number; lp2: number; compat: typeof compatMatrix[string] }>(null);

  const calculate = () => {
    const lp1 = lifePathFrom(dob1);
    const lp2 = lifePathFrom(dob2);
    if (!lp1 || !lp2) return;
    setResult({ lp1, lp2, compat: getCompat(lp1, lp2) });
  };

  const scoreColor = (s: number) => s >= 90 ? '#48bb78' : s >= 80 ? '#c9a84c' : s >= 70 ? '#ed8936' : '#fc8181';

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '680px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>💞 Numerology Compatibility</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Discover your cosmic connection through Life Path numbers</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {[{ name: name1, setName: setName1, dob: dob1, setDob: setDob1, label: 'Person 1', emoji: '🌙' }, { name: name2, setName: setName2, dob: dob2, setDob: setDob2, label: 'Person 2', emoji: '⭐' }].map((p, i) => (
          <div key={i} style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(10px)' }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{p.emoji} {p.label}</div>
            <input value={p.name} onChange={e => p.setName(e.target.value)} placeholder='Name (optional)' style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.6rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem', outline: 'none', marginBottom: '0.6rem', boxSizing: 'border-box' }} />
            <input type='date' value={p.dob} onChange={e => p.setDob(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.6rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
            {p.dob && <div style={{ marginTop: '0.6rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#c9a84c' }}>LP {lifePathFrom(p.dob)}</div>}
          </div>
        ))}
      </div>

      <button onClick={calculate} disabled={!dob1 || !dob2} style={{ width: '100%', padding: '0.9rem', borderRadius: '0.9rem', background: dob1 && dob2 ? 'linear-gradient(135deg, #9b59b6, #c9a84c)' : 'rgba(255,255,255,0.08)', color: dob1 && dob2 ? 'white' : 'rgba(255,255,255,0.3)', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: dob1 && dob2 ? 'pointer' : 'not-allowed', marginBottom: '1.5rem' }}>✨ Calculate Compatibility</button>

      {result && (() => {
        const m1 = meanings[result.lp1] || meanings[1];
        const m2 = meanings[result.lp2] || meanings[1];
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '1.25rem', padding: '2rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', fontWeight: 800, color: scoreColor(result.compat.score), textShadow: '0 0 30px ' + scoreColor(result.compat.score) + '66', marginBottom: '0.25rem' }}>{result.compat.score}%</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1rem' }}>Cosmic Compatibility Score</div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ height: '100%', width: result.compat.score + '%', background: 'linear-gradient(90deg, ' + scoreColor(result.compat.score) + ', ' + scoreColor(result.compat.score) + '88)', borderRadius: '999px', transition: 'width 1s ease' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: m1.color }}>{result.lp1}</div>
                  <div style={{ color: m1.color, fontSize: '0.85rem', fontWeight: 600 }}>{m1.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{name1 || 'Person 1'}</div>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.5rem' }}>💞</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: m2.color }}>{result.lp2}</div>
                  <div style={{ color: m2.color, fontSize: '0.85rem', fontWeight: 600 }}>{m2.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{name2 || 'Person 2'}</div>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: '1rem' }}>{result.compat.desc}</p>
              <div style={{ background: 'rgba(255,100,100,0.08)', borderRadius: '0.75rem', padding: '0.9rem', borderLeft: '3px solid rgba(255,100,100,0.4)' }}>
                <div style={{ color: '#fc8181', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>⚡ Growth Edge</div>
                <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem' }}>{result.compat.challenge}</p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
