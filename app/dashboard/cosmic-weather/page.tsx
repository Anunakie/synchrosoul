'use client';
import { useState, useEffect } from 'react';

const PLANETS = [
  { name: 'Sun', symbol: '☉', color: '#f59e0b', currentSign: 'Pisces', energy: 'Spiritual dissolution, compassion, surrender to the divine flow.' },
  { name: 'Moon', symbol: '☽', color: '#e2e8f0', currentSign: 'Scorpio', energy: 'Deep emotional transformation. Hidden truths surface. Trust your instincts.' },
  { name: 'Mercury', symbol: '☿', color: '#60a5fa', currentSign: 'Aquarius', energy: 'Innovative thinking, unconventional ideas, digital communication favored.' },
  { name: 'Venus', symbol: '♀', color: '#ec4899', currentSign: 'Aries', energy: 'Bold love, passionate pursuits, new romantic beginnings.' },
  { name: 'Mars', symbol: '♂', color: '#ef4444', currentSign: 'Gemini', energy: 'Scattered energy, multiple projects, quick decisive action needed.' },
  { name: 'Jupiter', symbol: '♃', color: '#c9a84c', currentSign: 'Gemini', energy: 'Expansion through learning, lucky communication, teaching and writing.' },
  { name: 'Saturn', symbol: '♄', color: '#94a3b8', currentSign: 'Pisces', energy: 'Spiritual discipline, karmic completion, boundaries with compassion.' },
  { name: 'Uranus', symbol: '♅', color: '#22d3ee', currentSign: 'Taurus', energy: 'Revolutionary changes in finances and values. Expect the unexpected.' },
  { name: 'Neptune', symbol: '♆', color: '#818cf8', currentSign: 'Pisces', energy: 'Heightened intuition, psychic sensitivity, spiritual visions.' },
  { name: 'Pluto', symbol: '♇', color: '#a78bfa', currentSign: 'Aquarius', energy: 'Collective transformation, power structures dissolving, rebirth of society.' },
];

const MOON_PHASES = [
  { name: 'New Moon', emoji: '🌑', energy: 'Set intentions, plant seeds, begin new cycles', power: 'Manifestation' },
  { name: 'Waxing Crescent', emoji: '🌒', energy: 'Take first steps, build momentum, stay committed', power: 'Action' },
  { name: 'First Quarter', emoji: '🌓', energy: 'Overcome obstacles, make decisions, push forward', power: 'Determination' },
  { name: 'Waxing Gibbous', emoji: '🌔', energy: 'Refine, adjust, prepare for culmination', power: 'Refinement' },
  { name: 'Full Moon', emoji: '🌕', energy: 'Release, celebrate, illuminate, heightened emotions', power: 'Release' },
  { name: 'Waning Gibbous', emoji: '🌖', energy: 'Share wisdom, express gratitude, give back', power: 'Gratitude' },
  { name: 'Last Quarter', emoji: '🌗', energy: 'Let go, forgive, clear space for new', power: 'Release' },
  { name: 'Waning Crescent', emoji: '🌘', energy: 'Rest, reflect, surrender, prepare for rebirth', power: 'Surrender' },
];

const ANGEL_WEATHER: Record<string, { forecast: string; numbers: string[]; color: string }> = {
  'New Moon': { forecast: 'Powerful manifestation window. The universe is listening. Log your intentions with angel numbers today.', numbers: ['111', '1111', '1212'], color: '#a78bfa' },
  'Full Moon': { forecast: 'Release what no longer serves you. Angel numbers 999 and 9999 are especially potent tonight.', numbers: ['999', '9999', '333'], color: '#f59e0b' },
  'Waxing Crescent': { forecast: 'Your angels are cheering you forward. Action-oriented numbers are appearing to guide your steps.', numbers: ['111', '444', '555'], color: '#22c55e' },
  'Waning Crescent': { forecast: 'Rest and receive. Your angels are sending comfort and reassurance through gentle number sequences.', numbers: ['222', '444', '888'], color: '#60a5fa' },
};

const getCurrentMoonPhase = () => {
  const known = new Date('2024-01-11');
  const now = new Date();
  const diff = (now.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const cycle = diff % 29.53;
  const idx = Math.floor((cycle / 29.53) * 8);
  return MOON_PHASES[Math.min(idx, 7)];
};

const COSMIC_EVENTS = [
  { date: '2026-03-14', event: 'Full Moon in Virgo', type: 'moon', impact: 'Release perfectionism. Healing through service and daily rituals.' },
  { date: '2026-03-20', event: 'Spring Equinox — Sun enters Aries', type: 'solar', impact: 'New astrological year begins. Powerful new beginnings energy.' },
  { date: '2026-03-29', event: 'New Moon in Aries', type: 'moon', impact: 'Most powerful new beginning of the year. Set bold intentions.' },
  { date: '2026-04-07', event: 'Venus conjunct Neptune', type: 'planetary', impact: 'Dreamy, romantic, spiritual love energy. Soulmate connections heightened.' },
  { date: '2026-04-12', event: 'Jupiter sextile Pluto', type: 'planetary', impact: 'Massive transformation and growth opportunities. Seize them.' },
  { date: '2026-04-13', event: 'Full Moon in Libra', type: 'moon', impact: 'Balance relationships. Release codependency. Harmony restored.' },
];

export default function CosmicWeatherPage() {
  const [tab, setTab] = useState<'today' | 'planets' | 'events'>('today');
  const moonPhase = getCurrentMoonPhase();
  const angelWeather = ANGEL_WEATHER[moonPhase.name] || ANGEL_WEATHER['Waxing Crescent'];

  const today = new Date();
  const upcomingEvents = COSMIC_EVENTS.filter(e => new Date(e.date) >= today).slice(0, 4);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#818cf8', fontFamily: 'Cormorant Garamond, serif' }}>Cosmic Weather</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Planetary energies shaping your angel number messages</p>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '999px', padding: '0.25rem' }}>
        {(['today', 'planets', 'events'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '0.5rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
            background: tab === t ? 'rgba(129,140,248,0.2)' : 'transparent',
            border: tab === t ? '1px solid rgba(129,140,248,0.3)' : '1px solid transparent',
            color: tab === t ? '#818cf8' : 'rgba(255,255,255,0.4)',
            textTransform: 'capitalize'
          }}>{t === 'today' ? "Today's Sky" : t === 'planets' ? 'Planets' : 'Upcoming'}</button>
        ))}
      </div>

      {tab === 'today' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Moon phase card */}
          <div style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.15), rgba(8,6,28,0.95))', borderRadius: '1.5rem', border: '1px solid rgba(129,140,248,0.2)', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '3rem' }}>{moonPhase.emoji}</span>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Current Moon Phase</p>
                <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{moonPhase.name}</h2>
                <p style={{ color: '#818cf8', fontSize: '0.8rem' }}>Power: {moonPhase.power}</p>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>{moonPhase.energy}</p>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.875rem', borderLeft: '3px solid #818cf8' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Angel Number Forecast</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{angelWeather.forecast}</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {angelWeather.numbers.map(n => (
                  <span key={n} style={{ background: `${angelWeather.color}15`, border: `1px solid ${angelWeather.color}25`, borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.75rem', color: angelWeather.color, fontWeight: 700 }}>{n}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Daily cosmic tip */}
          <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Today's Cosmic Tip</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>
              &ldquo;The planets are not causing your experiences — they are reflecting them. When you see an angel number today, pause and ask: what planetary energy is amplifying this message?&rdquo;
            </p>
          </div>

          {/* Quick planet snapshot */}
          <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }}>Planet Snapshot</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {PLANETS.slice(0, 5).map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: p.color, fontSize: '1.1rem', width: '1.5rem', textAlign: 'center' }}>{p.symbol}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', minWidth: '60px' }}>{p.name}</span>
                  <span style={{ color: p.color, fontSize: '0.78rem', fontWeight: 600 }}>in {p.currentSign}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'planets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {PLANETS.map(p => (
            <div key={p.name} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem 1.25rem', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${p.color}15`, border: `1px solid ${p.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{p.symbol}</div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{p.name}</p>
                  <p style={{ color: p.color, fontSize: '0.75rem' }}>in {p.currentSign}</p>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.6 }}>{p.energy}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {upcomingEvents.map(e => {
            const typeColors: Record<string, string> = { moon: '#818cf8', solar: '#f59e0b', planetary: '#22c55e' };
            const color = typeColors[e.type] || '#a78bfa';
            const daysUntil = Math.ceil((new Date(e.date).getTime() - Date.now()) / 86400000);
            return (
              <div key={e.date} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{e.event}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{new Date(e.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '0.75rem' }}>
                    <p style={{ color: color, fontWeight: 700, fontSize: '1rem', fontFamily: 'Cormorant Garamond, serif' }}>{daysUntil}d</p>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.62rem' }}>away</p>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.5 }}>{e.impact}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}