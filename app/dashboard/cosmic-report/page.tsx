'use client';
import { useState, useEffect } from 'react';
import { calcLifePath, calcSoulUrge, calcDestiny } from '@/lib/numerology';

interface ReportData {
  name: string;
  birthdate: string;
  lifePath: number;
  soulUrge: number;
  destiny: number;
  personalYear: number;
  topNumbers: [string, number][];
  totalLogs: number;
  streak: number;
}

function getPersonalYear(birthdate: string): number {
  if (!birthdate) return 1;
  const now = new Date();
  const [y, m, d] = birthdate.split('-').map(Number);
  const sum = d + m + now.getFullYear();
  let n = sum;
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, c) => a + parseInt(c), 0);
  }
  return n;
}

const LIFE_PATH_MEANINGS: Record<number, { title: string; desc: string; strengths: string[]; challenges: string[]; color: string }> = {
  1: { title: 'The Pioneer', color: '#ef4444', desc: 'You are a natural-born leader with an independent spirit. Your soul came here to forge new paths and inspire others through your courage and originality.',
    strengths: ['Leadership', 'Independence', 'Innovation', 'Courage', 'Determination'],
    challenges: ['Stubbornness', 'Impatience', 'Ego', 'Isolation'] },
  2: { title: 'The Peacemaker', color: '#3b82f6', desc: 'You are a master of harmony, diplomacy, and partnership. Your soul came here to bring balance and teach the world the power of cooperation and sensitivity.',
    strengths: ['Diplomacy', 'Empathy', 'Cooperation', 'Intuition', 'Patience'],
    challenges: ['Indecision', 'Over-sensitivity', 'People-pleasing', 'Self-doubt'] },
  3: { title: 'The Creator', color: '#f97316', desc: 'You are a radiant creative force with a gift for expression and joy. Your soul came here to inspire, uplift, and bring beauty into the world through your unique voice.',
    strengths: ['Creativity', 'Communication', 'Optimism', 'Charisma', 'Inspiration'],
    challenges: ['Scattered energy', 'Superficiality', 'Moodiness', 'Self-doubt'] },
  4: { title: 'The Builder', color: '#22c55e', desc: 'You are the master architect of the material world. Your soul came here to build lasting foundations, systems, and structures that serve humanity for generations.',
    strengths: ['Discipline', 'Reliability', 'Practicality', 'Loyalty', 'Hard work'],
    challenges: ['Rigidity', 'Stubbornness', 'Workaholism', 'Resistance to change'] },
  5: { title: 'The Freedom Seeker', color: '#8b5cf6', desc: 'You are a dynamic force of change, adventure, and freedom. Your soul came here to experience life fully, embrace transformation, and inspire others to break free.',
    strengths: ['Adaptability', 'Curiosity', 'Versatility', 'Charisma', 'Courage'],
    challenges: ['Restlessness', 'Impulsiveness', 'Commitment issues', 'Excess'] },
  6: { title: 'The Nurturer', color: '#ec4899', desc: 'You are the cosmic parent, healer, and guardian of love. Your soul came here to serve, heal, and create beauty through unconditional love and responsibility.',
    strengths: ['Compassion', 'Responsibility', 'Healing', 'Creativity', 'Loyalty'],
    challenges: ['Perfectionism', 'Martyrdom', 'Control', 'Self-sacrifice'] },
  7: { title: 'The Mystic', color: '#6366f1', desc: 'You are a seeker of truth, wisdom, and spiritual understanding. Your soul came here to dive deep into the mysteries of existence and share sacred knowledge.',
    strengths: ['Wisdom', 'Intuition', 'Analysis', 'Spirituality', 'Depth'],
    challenges: ['Isolation', 'Skepticism', 'Aloofness', 'Overthinking'] },
  8: { title: 'The Manifestor', color: '#f59e0b', desc: 'You are a master of material and spiritual abundance. Your soul came here to demonstrate that spiritual power and worldly success are not opposites but partners.',
    strengths: ['Ambition', 'Leadership', 'Business acumen', 'Manifestation', 'Power'],
    challenges: ['Materialism', 'Control', 'Workaholism', 'Ruthlessness'] },
  9: { title: 'The Sage', color: '#ef4444', desc: 'You are the wise elder, humanitarian, and completion energy of the cosmos. Your soul came here to serve humanity, release the old, and embody universal love.',
    strengths: ['Wisdom', 'Compassion', 'Creativity', 'Generosity', 'Vision'],
    challenges: ['Letting go', 'Boundaries', 'Martyrdom', 'Disappointment'] },
  11: { title: 'The Illuminator', color: '#e0e7ff', desc: 'You carry the master number of spiritual illumination. Your soul came here as a lightworker to inspire, channel divine wisdom, and awaken others to higher truth.',
    strengths: ['Intuition', 'Inspiration', 'Spiritual insight', 'Empathy', 'Vision'],
    challenges: ['Anxiety', 'Oversensitivity', 'Self-doubt', 'Nervous energy'] },
  22: { title: 'The Master Builder', color: '#fde68a', desc: 'You carry the most powerful master number. Your soul came here to build heaven on earth, turning the highest spiritual visions into tangible reality for all.',
    strengths: ['Vision', 'Practicality', 'Leadership', 'Manifestation', 'Discipline'],
    challenges: ['Overwhelm', 'Perfectionism', 'Pressure', 'Self-doubt'] },
  33: { title: 'The Master Teacher', color: '#f9a8d4', desc: 'You carry the rarest master number of unconditional love and teaching. Your soul came here to embody Christ consciousness and uplift all of humanity.',
    strengths: ['Unconditional love', 'Teaching', 'Healing', 'Compassion', 'Wisdom'],
    challenges: ['Self-sacrifice', 'Overwhelm', 'Boundaries', 'Perfectionism'] },
};

const PERSONAL_YEAR_THEMES: Record<number, { theme: string; focus: string; color: string }> = {
  1: { theme: 'New Beginnings', focus: 'Plant seeds, start fresh, take bold action', color: '#ef4444' },
  2: { theme: 'Patience & Partnership', focus: 'Nurture relationships, trust timing, cooperate', color: '#3b82f6' },
  3: { theme: 'Creative Expression', focus: 'Create, communicate, expand your joy', color: '#f97316' },
  4: { theme: 'Foundation Building', focus: 'Work hard, organize, build solid structures', color: '#22c55e' },
  5: { theme: 'Change & Freedom', focus: 'Embrace change, travel, break free', color: '#8b5cf6' },
  6: { theme: 'Love & Responsibility', focus: 'Nurture home, family, and relationships', color: '#ec4899' },
  7: { theme: 'Spiritual Deepening', focus: 'Reflect, study, connect with your inner wisdom', color: '#6366f1' },
  8: { theme: 'Abundance & Power', focus: 'Manifest, achieve, step into your power', color: '#f59e0b' },
  9: { theme: 'Completion & Release', focus: 'Let go, complete cycles, prepare for rebirth', color: '#ef4444' },
  11: { theme: 'Spiritual Illumination', focus: 'Trust your intuition, inspire others, awaken', color: '#e0e7ff' },
  22: { theme: 'Master Manifestation', focus: 'Build your legacy, think big, create lasting impact', color: '#fde68a' },
};

export default function CosmicReportPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem('synchrosoul_numerology_profile') || 'null');
      if (profile) {
        setName(profile.name || '');
        setBirthdate(profile.birthdate || '');
      }
    } catch {}
  }, []);

  const generateReport = () => {
    if (!name || !birthdate) return;
    setLoading(true);
    setTimeout(() => {
      const nums = { lifePathNumber: calcLifePath(birthdate), soulUrgeNumber: calcSoulUrge(name), destinyNumber: calcDestiny(name) };
      const logs = (() => { try { return JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]'); } catch { return []; } })();
      const counts: Record<string, number> = {};
      logs.forEach((l: any) => { counts[l.number] = (counts[l.number] || 0) + 1; });
      const topNumbers = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5) as [string, number][];

      setReport({
        name, birthdate,
        lifePath: nums.lifePathNumber,
        soulUrge: nums.soulUrgeNumber,
        destiny: nums.destinyNumber,
        personalYear: getPersonalYear(birthdate),
        topNumbers,
        totalLogs: logs.length,
        streak: (() => { try { return JSON.parse(localStorage.getItem('synchrosoul_streak') || '0'); } catch { return 0; } })()
      });
      setLoading(false);
    }, 1500);
  };

  const lpMeaning = report ? LIFE_PATH_MEANINGS[report.lifePath] : null;
  const pyTheme = report ? PERSONAL_YEAR_THEMES[report.personalYear] : null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Cosmic Soul Report</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Your complete numerological blueprint</p>
      </div>

      {/* Input Form */}
      {!report && (
        <div style={{
          background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
          border: '1px solid rgba(201,168,76,0.25)', padding: '1.75rem',
          backdropFilter: 'blur(12px)', marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full birth name"
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.65rem 0.875rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>Birth Date</label>
              <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.65rem 0.875rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
            </div>
          </div>
          <button onClick={generateReport} disabled={!name || !birthdate || loading} style={{
            width: '100%', padding: '0.875rem', borderRadius: '999px', cursor: name && birthdate ? 'pointer' : 'not-allowed',
            background: name && birthdate ? 'linear-gradient(135deg, #c9a84c, #8b5cf6)' : 'rgba(255,255,255,0.06)',
            color: name && birthdate ? '#fff' : 'rgba(255,255,255,0.3)',
            border: 'none', fontSize: '0.95rem', fontWeight: 700
          }}>{loading ? '✦ Generating your cosmic blueprint...' : '✦ Generate My Soul Report'}</button>
        </div>
      )}

      {/* Report */}
      {report && lpMeaning && pyTheme && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header Card */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(139,92,246,0.15))',
            borderRadius: '1.5rem', border: '1px solid rgba(201,168,76,0.3)',
            padding: '1.75rem', textAlign: 'center', backdropFilter: 'blur(12px)'
          }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Cosmic Soul Report for</p>
            <h2 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', margin: '0.25rem 0' }}>{report.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{new Date(report.birthdate + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem' }}>
              {[
                { label: 'Life Path', value: report.lifePath, color: lpMeaning.color },
                { label: 'Soul Urge', value: report.soulUrge, color: '#8b5cf6' },
                { label: 'Destiny', value: report.destiny, color: '#3b82f6' },
                { label: 'Personal Year', value: report.personalYear, color: pyTheme.color },
              ].map(n => (
                <div key={n.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: n.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{n.value}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.2rem' }}>{n.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Life Path Deep Dive */}
          <div style={{
            background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
            border: `1px solid ${lpMeaning.color}30`, padding: '1.5rem',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                background: `${lpMeaning.color}20`, border: `1px solid ${lpMeaning.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', fontWeight: 800, color: lpMeaning.color,
                fontFamily: 'Cormorant Garamond, serif'
              }}>{report.lifePath}</div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Life Path Number</p>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{lpMeaning.title}</h3>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>{lpMeaning.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: 'rgba(74,222,128,0.08)', borderRadius: '0.875rem', padding: '0.875rem', border: '1px solid rgba(74,222,128,0.15)' }}>
                <p style={{ color: '#4ade80', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Strengths</p>
                {lpMeaning.strengths.map(s => <p key={s} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>✓ {s}</p>)}
              </div>
              <div style={{ background: 'rgba(251,191,36,0.08)', borderRadius: '0.875rem', padding: '0.875rem', border: '1px solid rgba(251,191,36,0.15)' }}>
                <p style={{ color: '#fbbf24', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Soul Lessons</p>
                {lpMeaning.challenges.map(c => <p key={c} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>◈ {c}</p>)}
              </div>
            </div>
          </div>

          {/* Personal Year */}
          <div style={{
            background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
            border: `1px solid ${pyTheme.color}30`, padding: '1.5rem',
            backdropFilter: 'blur(12px)'
          }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Personal Year {report.personalYear} · {new Date().getFullYear()}</p>
            <h3 style={{ color: pyTheme.color, fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem' }}>{pyTheme.theme}</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6 }}>{pyTheme.focus}</p>
          </div>

          {/* Angel Number Signature */}
          {report.topNumbers.length > 0 && (
            <div style={{
              background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
              border: '1px solid rgba(201,168,76,0.2)', padding: '1.5rem',
              backdropFilter: 'blur(12px)'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Your Angel Number Signature ({report.totalLogs} total sightings)</p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {report.topNumbers.map(([num, count], i) => (
                  <div key={num} style={{
                    background: i === 0 ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${i === 0 ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '1rem', padding: '0.75rem 1rem', textAlign: 'center'
                  }}>
                    <div style={{ color: i === 0 ? '#c9a84c' : '#fff', fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Cormorant Garamond, serif' }}>{num}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{count}x seen</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset button */}
          <button onClick={() => setReport(null)} style={{
            padding: '0.65rem', borderRadius: '999px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem'
          }}>Generate New Report</button>
        </div>
      )}
    </div>
  );
}