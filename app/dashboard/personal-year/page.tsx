'use client';
import FeatureGate from '@/components/FeatureGate'
import SaveReadingButton from '@/components/SaveReadingButton';
import { useState, useEffect } from 'react';

const reduce = (n: number): number => {
  if (n <= 9 || n === 11 || n === 22) return n;
  return reduce(n.toString().split('').reduce((a, c) => a + parseInt(c), 0));
};

const YEARS: Record<number, { title: string; color: string; theme: string; focus: string; avoid: string; angel: string; months: string[] }> = {
  1: { title: 'Year of New Beginnings', color: '#f59e0b', theme: 'Plant seeds, start fresh, take initiative', focus: 'Launch new projects, assert independence, set bold intentions', avoid: 'Clinging to the past, waiting for permission', angel: '111', months: ['Set your vision','Take first steps','Build momentum','Establish routines','Expand your reach','Midpoint review','Deepen commitment','Overcome obstacles','Harvest early results','Refine your approach','Prepare for completion','Celebrate progress'] },
  2: { title: 'Year of Partnership', color: '#22c55e', theme: 'Cooperate, be patient, develop relationships', focus: 'Partnerships, diplomacy, intuition, emotional healing', avoid: 'Forcing outcomes, impatience, confrontation', angel: '222', months: ['Open your heart','Seek collaboration','Nurture connections','Practice patience','Deepen trust','Balance giving and receiving','Resolve conflicts','Strengthen bonds','Expand your circle','Prepare for harvest','Integrate lessons','Rest and reflect'] },
  3: { title: 'Year of Expression', color: '#f97316', theme: 'Create, communicate, celebrate, expand socially', focus: 'Creative projects, self-expression, joy, social expansion', avoid: 'Scattered energy, gossip, superficiality', angel: '333', months: ['Ignite creativity','Share your voice','Connect socially','Explore new art','Collaborate creatively','Celebrate milestones','Deepen expression','Expand your audience','Harvest creative work','Refine your message','Prepare for structure','Celebrate the year'] },
  4: { title: 'Year of Foundation', color: '#22d3ee', theme: 'Build, organize, work hard, establish security', focus: 'Career, health, home, systems, long-term planning', avoid: 'Shortcuts, laziness, resisting necessary work', angel: '444', months: ['Assess foundations','Create systems','Build discipline','Strengthen health','Organize finances','Midpoint audit','Deepen work ethic','Overcome limitations','See results of effort','Refine structures','Prepare for freedom','Celebrate what you built'] },
  5: { title: 'Year of Freedom', color: '#8b5cf6', theme: 'Change, adventure, freedom, unexpected opportunities', focus: 'Travel, new experiences, breaking old patterns, versatility', avoid: 'Recklessness, excess, burning bridges', angel: '555', months: ['Embrace change','Take a risk','Explore new territory','Release old patterns','Seek adventure','Midpoint pivot','Expand horizons','Navigate surprises','Integrate changes','Prepare for stability','Harvest lessons','Celebrate transformation'] },
  6: { title: 'Year of Love & Service', color: '#f472b6', theme: 'Family, responsibility, healing, community', focus: 'Relationships, home, health, service, creative work', avoid: 'Martyrdom, perfectionism, neglecting self', angel: '666', months: ['Nurture relationships','Heal family wounds','Serve your community','Create beauty','Deepen love','Balance self and others','Resolve responsibilities','Strengthen home','Harvest love given','Refine service','Prepare for inner work','Celebrate connections'] },
  7: { title: 'Year of Spiritual Growth', color: '#c9a84c', theme: 'Introspection, study, spiritual development, solitude', focus: 'Inner work, research, spirituality, self-discovery', avoid: 'Isolation, cynicism, neglecting relationships', angel: '777', months: ['Go within','Begin deep study','Develop spiritual practice','Seek solitude','Explore mysteries','Midpoint revelation','Deepen wisdom','Face inner shadows','Emerge with clarity','Share your insights','Prepare for power','Integrate spiritual growth'] },
  8: { title: 'Year of Abundance', color: '#ef4444', theme: 'Power, achievement, financial growth, recognition', focus: 'Career advancement, financial goals, leadership, manifestation', avoid: 'Greed, workaholism, misuse of power', angel: '888', months: ['Set financial goals','Take bold action','Build authority','Expand income streams','Leverage your power','Midpoint assessment','Overcome power struggles','Claim your worth','Harvest abundance','Refine your empire','Prepare for completion','Celebrate achievements'] },
  9: { title: 'Year of Completion', color: '#6366f1', theme: 'Release, completion, forgiveness, humanitarian service', focus: 'Endings, forgiveness, giving back, preparing for new cycle', avoid: 'Starting major new projects, holding onto what is done', angel: '999', months: ['Identify what to release','Begin letting go','Forgive and heal','Serve others','Clear old debts','Midpoint release ceremony','Deepen compassion','Complete unfinished business','Final harvest','Deep clearing','Prepare for rebirth','Celebrate the full cycle'] },
};

function PersonalYearPageInner() {
  const [dob, setDob] = useState('');
  const [result, setResult] = useState<{ year: number; month: number } | null>(null);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('synchrosoul_profile') || '{}');
      if (p.birthdate) { setDob(p.birthdate); }
    } catch {}
  }, []);

  const calculate = () => {
    if (!dob) return;
    const [, m, d] = dob.split('-').map(Number);
    const now = new Date();
    const year = reduce(m + d + now.getFullYear().toString().split('').reduce((a,c)=>a+parseInt(c),0));
    const month = reduce(m + d + now.getFullYear().toString().split('').reduce((a,c)=>a+parseInt(c),0) + (now.getMonth()+1));
    setResult({ year, month });
  };

  const yr = result ? YEARS[result.year] : null;
  const now = new Date();
  const monthIdx = now.getMonth();

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'Cormorant Garamond, serif' }}>Personal Year</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Your numerological forecast for {now.getFullYear()}</p>
      </div>
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem' }}>
        <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>Your Date of Birth</label>
        <input type="date" value={dob} onChange={e=>setDob(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box', colorScheme: 'dark', marginBottom: '0.75rem' }} />
        <button onClick={calculate} style={{ width: '100%', background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)', borderRadius: '999px', padding: '0.875rem', cursor: 'pointer', color: '#a78bfa', fontWeight: 700, fontSize: '0.95rem' }}>Reveal My Personal Year</button>
      </div>
      {result && yr && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: `linear-gradient(135deg, ${yr.color}15, rgba(8,6,28,0.95))`, borderRadius: '1.5rem', border: `1px solid ${yr.color}25`, padding: '1.75rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `${yr.color}20`, border: `3px solid ${yr.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: yr.color, fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', margin: '0 auto 0.75rem' }}>{result.year}</div>
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem' }}>{yr.title}</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{yr.theme}</p>
            <span style={{ background: `${yr.color}15`, border: `1px solid ${yr.color}25`, borderRadius: '999px', padding: '0.2rem 0.875rem', fontSize: '0.82rem', color: yr.color, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{yr.angel}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem', backdropFilter: 'blur(12px)' }}><p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>Focus On</p><p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', lineHeight: 1.5 }}>{yr.focus}</p></div>
            <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem', backdropFilter: 'blur(12px)' }}><p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>Avoid</p><p style={{ color: 'rgba(255,150,150,0.7)', fontSize: '0.8rem', lineHeight: 1.5 }}>{yr.avoid}</p></div>
          </div>
          <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Monthly Guidance</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {yr.months.map((msg, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: i === monthIdx ? `${yr.color}10` : 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: i === monthIdx ? `1px solid ${yr.color}20` : '1px solid transparent' }}>
                  <span style={{ color: i === monthIdx ? yr.color : 'rgba(255,255,255,0.2)', fontSize: '0.68rem', fontWeight: 700, minWidth: '28px' }}>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
                  <p style={{ color: i === monthIdx ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{msg}</p>
                  {i === monthIdx && <span style={{ background: `${yr.color}20`, border: `1px solid ${yr.color}30`, borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.58rem', color: yr.color, fontWeight: 700, flexShrink: 0 }}>NOW</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PersonalYearPage() {
  return (
    <FeatureGate feature="full-numerology" requiredTier="mystic">
      <PersonalYearPageInner />
    </FeatureGate>
  )
}
