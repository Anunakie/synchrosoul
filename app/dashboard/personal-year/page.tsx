'use client';
import { useState, useEffect } from 'react';

const personalYearData: Record<number, { title: string; theme: string; color: string; emoji: string; guidance: string; focus: string[]; avoid: string[] }> = {
  1: { title: 'New Beginnings', theme: 'The year of planting seeds and bold new starts', color: '#e74c3c', emoji: '🌱', guidance: 'This is your year to initiate, lead, and launch. The universe is clearing the path for you to step into something entirely new. Do not wait for permission — take the first step and the road will appear.', focus: ['Starting new projects', 'Building independence', 'Taking initiative', 'Establishing identity'], avoid: ['Clinging to the past', 'Waiting for others', 'Self-doubt', 'Procrastination'] },
  2: { title: 'Partnership & Patience', theme: 'The year of cooperation, sensitivity, and divine timing', color: '#3498db', emoji: '🤝', guidance: 'This year asks you to slow down and collaborate. Relationships — romantic, business, and spiritual — are your greatest teachers. Practice patience; what you plant now will bloom in year 3.', focus: ['Deepening relationships', 'Listening and diplomacy', 'Emotional healing', 'Building trust'], avoid: ['Forcing outcomes', 'Isolation', 'Impatience', 'Oversensitivity'] },
  3: { title: 'Creative Expression', theme: 'The year of joy, creativity, and social expansion', color: '#f39c12', emoji: '🎨', guidance: 'Your creative energy is at its peak. Express yourself boldly — through art, writing, speaking, or simply living joyfully. Social connections made this year carry special magic.', focus: ['Creative projects', 'Social expansion', 'Self-expression', 'Joy and play'], avoid: ['Scattering energy', 'Superficiality', 'Suppressing emotions', 'Overindulgence'] },
  4: { title: 'Foundation Building', theme: 'The year of hard work, structure, and lasting roots', color: '#27ae60', emoji: '🏗️', guidance: 'This is a year to build, not dream. Roll up your sleeves and create the structures that will support your future. The work you do now creates stability for years to come.', focus: ['Discipline and routine', 'Financial planning', 'Health and body', 'Long-term projects'], avoid: ['Shortcuts', 'Rigidity', 'Neglecting rest', 'Resistance to work'] },
  5: { title: 'Freedom & Change', theme: 'The year of adventure, transformation, and liberation', color: '#9b59b6', emoji: '🦋', guidance: 'Expect the unexpected and embrace it. This year brings rapid change, travel, new experiences, and liberation from old constraints. Stay flexible — the universe is rerouting you toward something better.', focus: ['Embracing change', 'Travel and adventure', 'New experiences', 'Personal freedom'], avoid: ['Resistance to change', 'Overindulgence', 'Recklessness', 'Commitment issues'] },
  6: { title: 'Love & Responsibility', theme: 'The year of home, family, healing, and service', color: '#e91e63', emoji: '💝', guidance: 'Your heart is the compass this year. Family, home, and community call for your loving attention. This is also a powerful year for healing old wounds and deepening romantic bonds.', focus: ['Family and home', 'Romantic relationships', 'Community service', 'Healing and nurturing'], avoid: ['Martyrdom', 'Meddling in others affairs', 'Perfectionism', 'Neglecting self-care'] },
  7: { title: 'Spiritual Awakening', theme: 'The year of introspection, wisdom, and inner truth', color: '#1abc9c', emoji: '🔮', guidance: 'The universe is calling you inward. This is a year for deep study, meditation, and spiritual development. Solitude is not loneliness — it is sacred preparation. Trust what is being revealed to you.', focus: ['Meditation and spirituality', 'Study and research', 'Inner wisdom', 'Solitude and reflection'], avoid: ['Isolation becoming depression', 'Skepticism', 'Neglecting relationships', 'Escapism'] },
  8: { title: 'Power & Abundance', theme: 'The year of manifestation, authority, and material success', color: '#c9a84c', emoji: '♾️', guidance: 'Your manifestation power is at its absolute peak. Step into your authority, pursue financial goals boldly, and claim the abundance that is your birthright. What you focus on expands dramatically this year.', focus: ['Career advancement', 'Financial goals', 'Leadership', 'Manifesting abundance'], avoid: ['Greed', 'Workaholism', 'Power struggles', 'Neglecting spiritual life'] },
  9: { title: 'Completion & Release', theme: 'The year of endings, wisdom, and compassionate service', color: '#e67e22', emoji: '🌅', guidance: 'A major cycle of your life is completing. Release what no longer serves you with gratitude — relationships, beliefs, habits, and situations. What you let go of now creates space for the magnificent new beginning of year 1.', focus: ['Releasing and letting go', 'Forgiveness', 'Humanitarian service', 'Wisdom sharing'], avoid: ['Clinging to the past', 'Starting major new projects', 'Bitterness', 'Isolation'] },
};

function calcPersonalYear(birthdate: string, year: number): number {
  if (!birthdate) return 0;
  const d = new Date(birthdate);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const digits = String(month) + String(day) + String(year);
  let sum = digits.split('').reduce((a, c) => a + parseInt(c), 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((a, c) => a + parseInt(c), 0);
  }
  return sum > 9 ? sum % 9 || 9 : sum;
}

function getMonthlyTheme(month: number, pyNum: number): string {
  const themes = [
    'Setting intentions for the year ahead',
    'Relationships and partnerships highlighted',
    'Creative energy peaks — express yourself',
    'Focus on foundations and practical matters',
    'Change and unexpected opportunities arrive',
    'Home, family, and love take center stage',
    'Deep reflection and spiritual insights',
    'Financial and career matters come to a head',
    'Completion, release, and preparation for renewal',
    'New seeds planted for the next cycle',
    'Intuition and inner wisdom guide you',
    'Review, rest, and integrate the years lessons',
  ];
  return themes[(month - 1 + pyNum - 1) % 12];
}

export default function PersonalYearPage() {
  const [birthdate, setBirthdate] = useState('');
  const [pyNum, setPyNum] = useState(0);
  const [nextPyNum, setNextPyNum] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview'|'monthly'|'next'>('overview');
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    const p = localStorage.getItem('synchrosoul_profile');
    if (p) {
      const prof = JSON.parse(p);
      if (prof.birthdate) {
        setBirthdate(prof.birthdate);
        setPyNum(calcPersonalYear(prof.birthdate, currentYear));
        setNextPyNum(calcPersonalYear(prof.birthdate, currentYear + 1));
      }
    }
  }, []);

  const handleBirthdate = (val: string) => {
    setBirthdate(val);
    if (val) {
      setPyNum(calcPersonalYear(val, currentYear));
      setNextPyNum(calcPersonalYear(val, currentYear + 1));
      const p = localStorage.getItem('synchrosoul_profile');
      const prof = p ? JSON.parse(p) : {};
      localStorage.setItem('synchrosoul_profile', JSON.stringify({ ...prof, birthdate: val }));
    }
  };

  const data = personalYearData[pyNum];
  const nextData = personalYearData[nextPyNum];
  const monthsRemaining = 12 - currentMonth + 1;
  const progress = Math.round(((currentMonth - 1) / 12) * 100);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>📅 Personal Year</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Your numerological forecast for {currentYear}</p>

      {!birthdate && (
        <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🎂</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1rem', fontSize: '0.9rem' }}>Enter your birthdate to calculate your Personal Year number</p>
          <input type="date" value={birthdate} onChange={e => handleBirthdate(e.target.value)} style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', fontSize: '0.95rem', outline: 'none' }} />
        </div>
      )}

      {birthdate && (
        <input type="date" value={birthdate} onChange={e => handleBirthdate(e.target.value)} style={{ display: 'block', margin: '0 auto 1.5rem', padding: '0.5rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', outline: 'none' }} />
      )}

      {data && (
        <>
          <div style={{ background: 'rgba(8,6,28,0.9)', border: '1px solid ' + data.color + '44', borderRadius: '1.5rem', padding: '2rem', backdropFilter: 'blur(12px)', marginBottom: '1.5rem', textAlign: 'center', boxShadow: '0 0 40px ' + data.color + '22' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{data.emoji}</div>
            <div style={{ fontSize: '4rem', fontWeight: 800, color: data.color, lineHeight: 1, marginBottom: '0.5rem' }}>{pyNum}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>{data.title}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{data.theme}</div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '999px', height: '6px', marginBottom: '0.5rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: progress + '%', background: 'linear-gradient(90deg, ' + data.color + '88, ' + data.color + ')', borderRadius: '999px', transition: 'width 1s ease' }} />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{progress}% through {currentYear} · {monthsRemaining} months remaining</div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
            {(['overview','monthly','next'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '0.5rem 1.25rem', borderRadius: '999px', background: activeTab === t ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', border: activeTab === t ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)', color: activeTab === t ? '#c9a84c' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.82rem', textTransform: 'capitalize' }}>{t === 'next' ? 'Next Year' : t}</button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
                <h3 style={{ color: data.color, marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✨ Your Guidance</h3>
                <p style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontSize: '0.95rem', fontStyle: 'italic', margin: 0 }}>{data.guidance}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(72,187,120,0.2)', borderRadius: '1.25rem', padding: '1.25rem', backdropFilter: 'blur(8px)' }}>
                  <h3 style={{ color: '#48bb78', marginBottom: '0.75rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>✅ Focus On</h3>
                  {data.focus.map((f, i) => <div key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', padding: '0.3rem 0', borderBottom: i < data.focus.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>· {f}</div>)}
                </div>
                <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(252,129,129,0.2)', borderRadius: '1.25rem', padding: '1.25rem', backdropFilter: 'blur(8px)' }}>
                  <h3 style={{ color: '#fc8181', marginBottom: '0.75rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>⚠️ Avoid</h3>
                  {data.avoid.map((a, i) => <div key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', padding: '0.3rem 0', borderBottom: i < data.avoid.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>· {a}</div>)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'monthly' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                const monthName = new Date(currentYear, month - 1).toLocaleString('default', { month: 'long' });
                const theme = getMonthlyTheme(month, pyNum);
                const isCurrent = month === currentMonth;
                const isPast = month < currentMonth;
                return (
                  <div key={month} style={{ background: isCurrent ? 'rgba(201,168,76,0.1)' : 'rgba(8,6,28,0.75)', border: isCurrent ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '0.9rem', padding: '0.9rem 1.25rem', backdropFilter: 'blur(8px)', opacity: isPast ? 0.5 : 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isCurrent ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: isCurrent ? '#c9a84c' : 'rgba(255,255,255,0.4)', fontWeight: 700, flexShrink: 0 }}>{month}</div>
                      <div>
                        <div style={{ color: isCurrent ? '#c9a84c' : 'rgba(255,255,255,0.7)', fontWeight: isCurrent ? 600 : 400, fontSize: '0.9rem' }}>{monthName} {isCurrent ? '← Now' : ''}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{theme}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'next' && nextData && (
            <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid ' + nextData.color + '33', borderRadius: '1.5rem', padding: '2rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{nextData.emoji}</div>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: nextData.color, lineHeight: 1, marginBottom: '0.5rem' }}>{nextPyNum}</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>{nextData.title} — {currentYear + 1}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{nextData.theme}</div>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '0.9rem', fontStyle: 'italic' }}>{nextData.guidance}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
