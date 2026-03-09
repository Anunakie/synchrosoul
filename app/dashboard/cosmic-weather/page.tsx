'use client';
import { useState, useEffect } from 'react';

function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
  }
  return n;
}

function getUniversalDay(d: Date) { return reduce(d.getDate() + d.getMonth() + 1 + d.getFullYear()); }
function getUniversalMonth(d: Date) { return reduce(d.getMonth() + 1 + d.getFullYear()); }
function getUniversalYear(d: Date) { return reduce(d.getFullYear()); }

const DAY_DATA: Record<number, { theme: string; energy: string; color: string; emoji: string; advice: string; avoid: string; powerHour: string }> = {
  1: { theme: 'New Beginnings', energy: 'Pioneering', color: '#ef4444', emoji: '🔴', advice: 'Start something new. Take bold action. Lead.', avoid: 'Waiting for permission or perfect timing', powerHour: '1am, 10am, 1pm' },
  2: { theme: 'Harmony & Partnership', energy: 'Receptive', color: '#3b82f6', emoji: '🔵', advice: 'Collaborate, listen deeply, nurture bonds.', avoid: 'Forcing outcomes or rushing decisions', powerHour: '2am, 11am, 2pm' },
  3: { theme: 'Creative Expression', energy: 'Expansive', color: '#f97316', emoji: '🟠', advice: 'Create, communicate, share your gifts.', avoid: 'Self-criticism or holding back your voice', powerHour: '3am, 12pm, 3pm' },
  4: { theme: 'Foundation & Order', energy: 'Grounding', color: '#22c55e', emoji: '🟢', advice: 'Organize, plan, build solid structures.', avoid: 'Shortcuts or ignoring details', powerHour: '4am, 1pm, 4pm' },
  5: { theme: 'Change & Freedom', energy: 'Dynamic', color: '#8b5cf6', emoji: '🟣', advice: 'Embrace change, try something different.', avoid: 'Clinging to the familiar out of fear', powerHour: '5am, 2pm, 5pm' },
  6: { theme: 'Love & Healing', energy: 'Nurturing', color: '#ec4899', emoji: '🩷', advice: 'Tend to relationships, home, and self-care.', avoid: 'Perfectionism or taking on others burdens', powerHour: '6am, 3pm, 6pm' },
  7: { theme: 'Spiritual Insight', energy: 'Introspective', color: '#6366f1', emoji: '🔮', advice: 'Meditate, study, seek inner wisdom.', avoid: 'Overthinking or isolating too long', powerHour: '7am, 4pm, 7pm' },
  8: { theme: 'Abundance & Power', energy: 'Magnetic', color: '#f59e0b', emoji: '🟡', advice: 'Take charge, make power moves, manifest.', avoid: 'Fear of success or playing small', powerHour: '8am, 5pm, 8pm' },
  9: { theme: 'Completion & Release', energy: 'Transcendent', color: '#f87171', emoji: '❤️', advice: 'Let go, forgive, complete unfinished cycles.', avoid: 'Holding onto what no longer serves you', powerHour: '9am, 6pm, 9pm' },
  11: { theme: 'Illumination', energy: 'Visionary', color: '#e0e7ff', emoji: '⚪', advice: 'Trust your intuition. You are a channel today.', avoid: 'Dismissing your inner knowing', powerHour: '11am, 11pm' },
  22: { theme: 'Master Building', energy: 'Architectural', color: '#fde68a', emoji: '🌟', advice: 'Think big. Build something that lasts.', avoid: 'Overwhelm — break it into steps', powerHour: '10am, 10pm' },
};

const MOON_PHASES = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
const MOON_NAMES = ['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'];
const MOON_ENERGIES = [
  'Plant seeds of intention. New beginnings are blessed.',
  'Take inspired action. Energy is building.',
  'Push through challenges. Momentum is yours.',
  'Refine and adjust. The peak approaches.',
  'Manifest and celebrate. Energy is at its peak.',
  'Share your gifts. Gratitude amplifies abundance.',
  'Release and reflect. Let go of what blocks you.',
  'Rest and restore. Prepare for the new cycle.',
];

function getMoonPhase(date: Date): number {
  const known = new Date(2000, 0, 6);
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const cycle = 29.53059;
  return Math.floor(((diff % cycle + cycle) % cycle) / cycle * 8) % 8;
}

const ANGEL_FORECAST: Record<number, string[]> = {
  1: ['111 energy is strong — your thoughts manifest quickly today', '444 supports new beginnings with angelic protection'],
  2: ['222 brings divine timing — trust the process', '1212 signals alignment in partnerships'],
  3: ['333 activates your creative channel today', '1111 opens a manifestation portal'],
  4: ['444 is your anchor today — you are divinely supported', '888 brings abundance through disciplined action'],
  5: ['555 heralds transformation — embrace the shift', '1010 signals a spiritual upgrade'],
  6: ['666 (rebalanced) calls you to love yourself first', '999 completes a healing cycle'],
  7: ['777 is your lucky spiritual number today', '1111 opens the veil for divine downloads'],
  8: ['888 activates infinite abundance loops', '444 grounds your manifestations in reality'],
  9: ['999 signals completion — release with grace', '333 guides you through the transition'],
  11: ['1111 is amplified — you are a portal today', '111 thoughts become reality instantly'],
  22: ['2222 master builder energy — your vision is supported', '444 provides the foundation for your dreams'],
};

export default function CosmicWeatherPage() {
  const [now] = useState(new Date());
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    try { setProfile(JSON.parse(localStorage.getItem('synchrosoul_numerology_profile') || 'null')); } catch {}
  }, []);

  const universalDay = getUniversalDay(now);
  const universalMonth = getUniversalMonth(now);
  const universalYear = getUniversalYear(now);
  const moonPhase = getMoonPhase(now);
  const dayData = DAY_DATA[universalDay] || DAY_DATA[1];
  const forecast = ANGEL_FORECAST[universalDay] || ANGEL_FORECAST[1];

  const personalDay = profile?.birthdate ? (() => {
    const [,m,d] = profile.birthdate.split('-').map(Number);
    return reduce(d + m + now.getFullYear());
  })() : null;
  const personalDayData = personalDay ? (DAY_DATA[personalDay] || DAY_DATA[1]) : null;

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const energyBars = [
    { label: 'Manifestation', value: [7,5,8,6,9,7,8,9,5,8,10,9][universalDay-1] || 7, color: '#c9a84c' },
    { label: 'Intuition', value: [6,8,7,5,7,8,10,6,9,10,8,7][universalDay-1] || 7, color: '#8b5cf6' },
    { label: 'Love', value: [7,9,8,6,7,10,7,8,8,7,9,8][universalDay-1] || 7, color: '#f472b6' },
    { label: 'Abundance', value: [8,6,7,9,6,7,6,10,7,8,7,10][universalDay-1] || 7, color: '#22c55e' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{dateStr}</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'Cormorant Garamond, serif' }}>Cosmic Weather</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Today’s energetic forecast for your soul</p>
      </div>

      {/* Universal Day - Hero Card */}
      <div style={{
        background: `linear-gradient(135deg, ${dayData.color}20, rgba(8,6,28,0.9))`,
        borderRadius: '1.5rem', border: `1px solid ${dayData.color}40`,
        padding: '1.75rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem',
        boxShadow: `0 0 40px ${dayData.color}15`
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>Universal Day Number</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: 800, color: dayData.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{universalDay}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>{dayData.theme}</span>
            </div>
          </div>
          <span style={{ fontSize: '2.5rem' }}>{dayData.emoji}</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>{dayData.energy} energy surrounds today. {dayData.advice}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.875rem', padding: '0.75rem' }}>
            <p style={{ color: '#4ade80', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>✓ Do Today</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', lineHeight: 1.4 }}>{dayData.advice}</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '0.875rem', padding: '0.75rem' }}>
            <p style={{ color: '#f87171', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>✕ Avoid</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', lineHeight: 1.4 }}>{dayData.avoid}</p>
          </div>
        </div>
        <div style={{ marginTop: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.6rem 0.875rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Power Hours: <span style={{ color: dayData.color }}>{dayData.powerHour}</span></p>
        </div>
      </div>

      {/* Energy Bars */}
      <div style={{
        background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem',
        backdropFilter: 'blur(12px)', marginBottom: '1.25rem'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Today’s Energy Levels</p>
        {energyBars.map(bar => (
          <div key={bar.label} style={{ marginBottom: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>{bar.label}</span>
              <span style={{ color: bar.color, fontSize: '0.82rem', fontWeight: 700 }}>{bar.value}/10</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${bar.value * 10}%`, background: bar.color, borderRadius: '999px', transition: 'width 1s ease' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Moon Phase */}
      <div style={{
        background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
        border: '1px solid rgba(148,163,184,0.2)', padding: '1.5rem',
        backdropFilter: 'blur(12px)', marginBottom: '1.25rem',
        display: 'flex', alignItems: 'center', gap: '1.25rem'
      }}>
        <div style={{ fontSize: '3.5rem', lineHeight: 1, flexShrink: 0 }}>{MOON_PHASES[moonPhase]}</div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>Moon Phase</p>
          <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.35rem' }}>{MOON_NAMES[moonPhase]}</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.5 }}>{MOON_ENERGIES[moonPhase]}</p>
        </div>
      </div>

      {/* Angel Number Forecast */}
      <div style={{
        background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
        border: '1px solid rgba(201,168,76,0.2)', padding: '1.5rem',
        backdropFilter: 'blur(12px)', marginBottom: '1.25rem'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Angel Number Forecast</p>
        {forecast.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
            marginBottom: i < forecast.length - 1 ? '0.75rem' : 0
          }}>
            <span style={{ color: '#c9a84c', fontSize: '1rem', flexShrink: 0, marginTop: '0.1rem' }}>✦</span>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.5 }}>{f}</p>
          </div>
        ))}
      </div>

      {/* Personal Day (if profile exists) */}
      {personalDayData && personalDay && (
        <div style={{
          background: `${personalDayData.color}12`, borderRadius: '1.5rem',
          border: `1px solid ${personalDayData.color}30`, padding: '1.5rem',
          backdropFilter: 'blur(12px)', marginBottom: '1.25rem'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Your Personal Day Number</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: personalDayData.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{personalDay}</span>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{personalDayData.theme}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{personalDayData.advice}</p>
            </div>
          </div>
        </div>
      )}

      {/* Numerology Snapshot */}
      <div style={{
        background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.06)', padding: '1.5rem',
        backdropFilter: 'blur(12px)'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Cosmic Snapshot</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Universal Day', value: universalDay, color: dayData.color },
            { label: 'Universal Month', value: universalMonth, color: '#a78bfa' },
            { label: 'Universal Year', value: universalYear, color: '#60a5fa' },
          ].map(n => (
            <div key={n.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.875rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: n.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{n.value}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.3rem' }}>{n.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}