'use client';
import FeatureGate from '@/components/FeatureGate'
import { useState, useEffect } from 'react';
import SaveReadingButton from '@/components/SaveReadingButton';

const reduce = (n: number): number => {
  if (n <= 9 || n === 11 || n === 22 || n === 33) return n;
  return reduce(n.toString().split('').reduce((a, c) => a + parseInt(c), 0));
};

const letterVal: Record<string, number> = { A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8 };
const vowels = new Set(['A','E','I','O','U']);

const MEANINGS: Record<number, { title: string; color: string; desc: string; shadow: string; gift: string }> = {
  1: { title: 'The Leader', color: '#f59e0b', desc: 'Independent, pioneering, original. You are here to lead and innovate.', shadow: 'Arrogance, stubbornness, isolation', gift: 'Courage to forge new paths' },
  2: { title: 'The Peacemaker', color: '#22c55e', desc: 'Diplomatic, sensitive, cooperative. You are here to bring harmony.', shadow: 'Over-sensitivity, indecision, dependency', gift: 'Intuition and emotional intelligence' },
  3: { title: 'The Creator', color: '#f97316', desc: 'Expressive, joyful, creative. You are here to inspire through art and communication.', shadow: 'Scattered energy, superficiality', gift: 'Joy and creative expression' },
  4: { title: 'The Builder', color: '#22d3ee', desc: 'Practical, disciplined, reliable. You are here to build lasting foundations.', shadow: 'Rigidity, workaholism, limitation', gift: 'Mastery through dedication' },
  5: { title: 'The Freedom Seeker', color: '#8b5cf6', desc: 'Adventurous, versatile, progressive. You are here to experience freedom.', shadow: 'Restlessness, excess, irresponsibility', gift: 'Adaptability and courage for change' },
  6: { title: 'The Nurturer', color: '#f472b6', desc: 'Loving, responsible, protective. You are here to serve and heal.', shadow: 'Martyrdom, perfectionism, control', gift: 'Unconditional love and healing' },
  7: { title: 'The Seeker', color: '#c9a84c', desc: 'Analytical, spiritual, introspective. You are here to seek truth and wisdom.', shadow: 'Isolation, skepticism, coldness', gift: 'Deep wisdom and spiritual insight' },
  8: { title: 'The Powerhouse', color: '#ef4444', desc: 'Ambitious, authoritative, material mastery. You are here to achieve abundance.', shadow: 'Greed, control, materialism', gift: 'Manifestation and executive power' },
  9: { title: 'The Humanitarian', color: '#6366f1', desc: 'Compassionate, idealistic, universal. You are here to serve humanity.', shadow: 'Martyrdom, bitterness, loss', gift: 'Universal love and wisdom' },
  11: { title: 'The Illuminator', color: '#a78bfa', desc: 'Master number. Highly intuitive, inspirational, spiritual messenger.', shadow: 'Anxiety, impracticality, nervous energy', gift: 'Spiritual illumination and inspiration' },
  22: { title: 'The Master Builder', color: '#c9a84c', desc: 'Master number. Visionary with practical power to build on a grand scale.', shadow: 'Overwhelm, self-doubt, misuse of power', gift: 'Turning dreams into reality' },
  33: { title: 'The Master Teacher', color: '#f472b6', desc: 'Master number. The highest vibration of love, healing, and teaching.', shadow: 'Self-sacrifice, taking on others’ pain', gift: 'Healing through unconditional love' },
};

function NumerologyDeepPageInner() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [results, setResults] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('synchrosoul_profile') || '{}');
      if (p.name) setName(p.name);
      if (p.birthdate) setDob(p.birthdate);
    } catch {}
  }, []);

  const calculate = () => {
    if (!name || !dob) return;
    const [y, m, d] = dob.split('-').map(Number);
    const lifePath = reduce(y.toString().split('').reduce((a,c)=>a+parseInt(c),0) + m + d);
    const upper = name.toUpperCase().replace(/[^A-Z]/g,'');
    const soulUrge = reduce(upper.split('').filter(c=>vowels.has(c)).reduce((a,c)=>a+letterVal[c],0));
    const personality = reduce(upper.split('').filter(c=>!vowels.has(c)).reduce((a,c)=>a+(letterVal[c]||0),0));
    const destiny = reduce(upper.split('').reduce((a,c)=>a+(letterVal[c]||0),0));
    const personalYear = reduce(m + d + new Date().getFullYear().toString().split('').reduce((a,c)=>a+parseInt(c),0));
    const birthday = reduce(d);
    const maturity = reduce(lifePath + destiny);
    setResults({ lifePath, soulUrge, personality, destiny, personalYear, birthday, maturity });
  };

  const labels: Record<string, { label: string; emoji: string; desc: string }> = {
    lifePath: { label: 'Life Path', emoji: '🛤️', desc: 'Your soul’s main journey and purpose' },
    destiny: { label: 'Destiny', emoji: '⭐', desc: 'What you are meant to achieve' },
    soulUrge: { label: 'Soul Urge', emoji: '💜', desc: 'Your heart’s deepest desire' },
    personality: { label: 'Personality', emoji: '🎭', desc: 'How others perceive you' },
    personalYear: { label: 'Personal Year', emoji: '📅', desc: 'Your theme for this year' },
    birthday: { label: 'Birthday', emoji: '🎂', desc: 'Special talents you bring' },
    maturity: { label: 'Maturity', emoji: '🌳', desc: 'Your destiny after age 35' },
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Deep Numerology</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Your complete numerological blueprint</p>
      </div>
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div><label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>Full Birth Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="As on birth certificate" style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box' }} /></div>
          <div><label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.35rem' }}>Date of Birth</label>
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box', colorScheme: 'dark' }} /></div>
          <button onClick={calculate} style={{ background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '999px', padding: '0.875rem', cursor: 'pointer', color: '#c9a84c', fontWeight: 700, fontSize: '0.95rem' }}>Calculate My Blueprint ✨</button>
        </div>
      </div>
      {results && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {Object.entries(results).map(([key, val]) => {
            const m = MEANINGS[val];
            const l = labels[key];
            if (!m || !l) return null;
            return (
              <div key={key} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: `1px solid ${m.color}20`, padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${m.color}15`, border: `2px solid ${m.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: m.color, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', flexShrink: 0 }}>{val}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l.emoji} {l.label}</p>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: 'Cormorant Garamond, serif' }}>{m.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}>{l.desc}</p>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.83rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{m.desc}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(255,100,100,0.08)', border: '1px solid rgba(255,100,100,0.15)', borderRadius: '999px', padding: '0.15rem 0.6rem', fontSize: '0.68rem', color: 'rgba(255,150,150,0.7)' }}>Shadow: {m.shadow}</span>
                  <span style={{ background: `${m.color}08`, border: `1px solid ${m.color}15`, borderRadius: '999px', padding: '0.15rem 0.6rem', fontSize: '0.68rem', color: m.color }}>Gift: {m.gift}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function NumerologyDeepPage() {
  return (
    <FeatureGate feature="full-numerology" requiredTier="mystic">
      <NumerologyDeepPageInner />
    </FeatureGate>
  )
}
