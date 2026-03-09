'use client';
import { useState, useEffect } from 'react';

const moonPhases = [
  { name: 'New Moon', emoji: '🌑', energy: 'New beginnings, set intentions, plant seeds', numbers: ['111', '1111', '000'], color: '#1a1a2e' },
  { name: 'Waxing Crescent', emoji: '🌒', energy: 'Growth, momentum, take action on intentions', numbers: ['222', '333'], color: '#16213e' },
  { name: 'First Quarter', emoji: '🌓', energy: 'Challenges, decisions, push through obstacles', numbers: ['444', '555'], color: '#0f3460' },
  { name: 'Waxing Gibbous', emoji: '🌔', energy: 'Refinement, patience, trust the process', numbers: ['666', '777'], color: '#533483' },
  { name: 'Full Moon', emoji: '🌕', energy: 'Manifestation peak, release, celebrate wins', numbers: ['888', '999', '1111'], color: '#c9a84c' },
  { name: 'Waning Gibbous', emoji: '🌖', energy: 'Gratitude, share wisdom, give back', numbers: ['999', '888'], color: '#7b2d8b' },
  { name: 'Last Quarter', emoji: '🌗', energy: 'Release, forgive, let go of what no longer serves', numbers: ['000', '999'], color: '#4a1942' },
  { name: 'Waning Crescent', emoji: '🌘', energy: 'Rest, reflect, surrender, prepare for rebirth', numbers: ['111', '222'], color: '#2d1b69' },
];

const moonRituals: Record<string, string[]> = {
  'New Moon': ['Write 3 intentions on paper', 'Light a white candle', 'Meditate on your desires for 11 minutes', 'Create a vision board entry'],
  'Waxing Crescent': ['Take one action toward your goal', 'Repeat your affirmations 3x', 'Journal about your progress'],
  'First Quarter': ['Face one fear today', 'Make a decision you have been avoiding', 'Do a 4-4-4 breathwork session'],
  'Waxing Gibbous': ['Refine your plan', 'Practice patience meditation', 'Trust and release control'],
  'Full Moon': ['Write what you are releasing on paper and burn it', 'Charge your crystals under moonlight', 'Do a gratitude ceremony', 'Take a salt bath'],
  'Waning Gibbous': ['Share a blessing with someone', 'Write in your gratitude journal', 'Teach something you know'],
  'Last Quarter': ['Declutter one space in your home', 'Forgive someone (including yourself)', 'Release a limiting belief'],
  'Waning Crescent': ['Rest and restore', 'Spend time in silence', 'Dream journal before sleep'],
};

function getMoonPhase(date: Date): number {
  const known = new Date(2000, 0, 6);
  const diff = date.getTime() - known.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  const cycle = 29.53058867;
  return ((days % cycle) + cycle) % cycle;
}

function getMoonPhaseName(date: Date): { phase: typeof moonPhases[0], dayInCycle: number } {
  const day = getMoonPhase(date);
  let idx = 0;
  if (day < 1.85) idx = 0;
  else if (day < 7.38) idx = 1;
  else if (day < 11.08) idx = 2;
  else if (day < 14.77) idx = 3;
  else if (day < 18.46) idx = 4;
  else if (day < 22.15) idx = 5;
  else if (day < 25.84) idx = 6;
  else idx = 7;
  return { phase: moonPhases[idx], dayInCycle: Math.floor(day) };
}

export default function MoonPage() {
  const [today] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showRitual, setShowRitual] = useState(false);
  const { phase, dayInCycle } = getMoonPhaseName(selectedDate);
  const rituals = moonRituals[phase.name] || [];

  const nextFullMoon = () => {
    const d = new Date(today);
    for (let i = 1; i <= 30; i++) {
      d.setDate(d.getDate() + 1);
      const p = getMoonPhase(d);
      if (p >= 14 && p < 16) return d;
    }
    return null;
  };
  const fullMoonDate = nextFullMoon();
  const daysToFull = fullMoonDate ? Math.ceil((fullMoonDate.getTime() - today.getTime()) / (1000*60*60*24)) : 0;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '5rem', marginBottom: '0.5rem', filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.6))' }}>{phase.emoji}</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.25rem' }}>{phase.name}</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Day {dayInCycle} of lunar cycle</p>
      </div>

      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
        <h2 style={{ color: '#c9a84c', marginBottom: '0.75rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>✨ Current Energy</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7 }}>{phase.energy}</p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Aligned numbers:</span>
          {phase.numbers.map(n => (
            <span key={n} style={{ background: 'rgba(201,168,76,0.2)', color: '#c9a84c', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.85rem', border: '1px solid rgba(201,168,76,0.3)' }}>{n}</span>
          ))}
        </div>
      </div>

      {daysToFull > 0 && (
        <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '1rem', padding: '1rem 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>🌕</span>
          <div>
            <div style={{ color: '#c9a84c', fontWeight: 600 }}>Next Full Moon</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{daysToFull} days away — {fullMoonDate?.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
      )}

      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(147,112,219,0.3)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: '#9370db', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🕯️ Moon Rituals</h2>
          <button onClick={() => setShowRitual(!showRitual)} style={{ background: 'rgba(147,112,219,0.2)', border: '1px solid rgba(147,112,219,0.4)', color: '#9370db', padding: '0.3rem 0.8rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.85rem' }}>{showRitual ? 'Hide' : 'Show'}</button>
        </div>
        {showRitual && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {rituals.map((r, i) => (
              <li key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < rituals.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ color: '#c9a84c', minWidth: '1.5rem' }}>{i+1}.</span>
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>{r}</span>
              </li>
            ))}
          </ul>
        )}
        {!showRitual && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{rituals.length} rituals aligned with {phase.name} energy</p>}
      </div>

      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '1.5rem', backdropFilter: 'blur(10px)' }}>
        <h2 style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>🌙 Lunar Calendar</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {moonPhases.map((p, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0.75rem 0.5rem', borderRadius: '0.75rem', background: p.name === phase.name ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)', border: p.name === phase.name ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '1.5rem' }}>{p.emoji}</div>
              <div style={{ fontSize: '0.65rem', color: p.name === phase.name ? '#c9a84c' : 'rgba(255,255,255,0.4)', marginTop: '0.25rem', lineHeight: 1.2 }}>{p.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
