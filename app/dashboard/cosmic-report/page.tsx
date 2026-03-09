'use client';
import { useState, useEffect } from 'react';

interface AngelLog {
  id: string;
  number: string;
  thought?: string;
  createdAt: string;
  verified?: boolean;
}

const ANGEL_MEANINGS: Record<string, { title: string; theme: string; color: string; guidance: string }> = {
  '111': { title: 'New Beginnings', theme: 'Manifestation', color: '#f59e0b', guidance: 'Your thoughts are manifesting rapidly. Focus on what you want, not what you fear.' },
  '1111': { title: 'Alignment Portal', theme: 'Awakening', color: '#f59e0b', guidance: 'A powerful gateway is open. Make a wish. Set your highest intention now.' },
  '222': { title: 'Divine Balance', theme: 'Trust', color: '#22c55e', guidance: 'Trust the process. Everything is unfolding in perfect divine timing.' },
  '333': { title: 'Ascended Masters', theme: 'Creativity', color: '#f97316', guidance: 'You are surrounded by ascended masters. Your creative gifts are needed now.' },
  '444': { title: 'Angelic Protection', theme: 'Safety', color: '#22c55e', guidance: 'Your angels are with you. You are safe, supported, and deeply loved.' },
  '555': { title: 'Major Change', theme: 'Transformation', color: '#8b5cf6', guidance: 'A significant life change is coming. Embrace it. It is leading you to your highest path.' },
  '666': { title: 'Rebalance', theme: 'Harmony', color: '#ef4444', guidance: 'Refocus on spiritual matters. Release material worries and trust divine provision.' },
  '777': { title: 'Divine Luck', theme: 'Awakening', color: '#c9a84c', guidance: 'You are in perfect alignment with the universe. Miracles are flowing to you.' },
  '888': { title: 'Infinite Abundance', theme: 'Prosperity', color: '#c9a84c', guidance: 'Financial and material abundance is flowing. Receive it with gratitude.' },
  '999': { title: 'Completion', theme: 'Release', color: '#6366f1', guidance: 'A major cycle is completing. Release what no longer serves. A new chapter awaits.' },
  '1212': { title: 'Soul Mission', theme: 'Purpose', color: '#60a5fa', guidance: 'You are on your soul’s true path. Keep going. The universe confirms your direction.' },
  '1234': { title: 'Step by Step', theme: 'Progress', color: '#10b981', guidance: 'Take it one step at a time. Each small action is building your magnificent future.' },
};

const getMeaning = (num: string) => ANGEL_MEANINGS[num] || { title: 'Sacred Message', theme: 'Guidance', color: '#a78bfa', guidance: 'The universe is sending you a unique and personal message through this number.' };

const reduceToSingle = (n: number): number => {
  if (n <= 9 || n === 11 || n === 22 || n === 33) return n;
  return reduceToSingle(n.toString().split('').reduce((a, c) => a + parseInt(c), 0));
};

export default function CosmicReportPage() {
  const [logs, setLogs] = useState<AngelLog[]>([]);
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    try {
      setLogs(JSON.parse(localStorage.getItem('angel_logs') || '[]'));
    } catch {}
  }, []);

  const now = Date.now();
  const periodMs = period === 'week' ? 7 * 86400000 : period === 'month' ? 30 * 86400000 : Infinity;
  const filtered = logs.filter(l => now - new Date(l.createdAt).getTime() <= periodMs);

  // Analytics
  const counts: Record<string, number> = {};
  filtered.forEach(l => { counts[l.number] = (counts[l.number] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const topNumber = sorted[0]?.[0];
  const totalSightings = filtered.length;
  const uniqueNumbers = Object.keys(counts).length;
  const verifiedCount = filtered.filter(l => l.verified).length;
  const withThoughts = filtered.filter(l => l.thought && l.thought.trim()).length;

  // Dominant theme
  const themes: Record<string, number> = {};
  filtered.forEach(l => {
    const theme = getMeaning(l.number).theme;
    themes[theme] = (themes[theme] || 0) + 1;
  });
  const dominantTheme = Object.entries(themes).sort((a, b) => b[1] - a[1])[0];

  // Numerology of the period
  const today = new Date();
  const periodNum = reduceToSingle(
    (today.getMonth() + 1) + today.getDate() + today.getFullYear()
  );

  // Day distribution
  const dayDist: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  filtered.forEach(l => {
    const day = dayNames[new Date(l.createdAt).getDay()];
    dayDist[day]++;
  });
  const maxDay = Math.max(...Object.values(dayDist), 1);

  // Hour distribution
  const hourDist: Record<string, number> = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
  filtered.forEach(l => {
    const h = new Date(l.createdAt).getHours();
    if (h >= 5 && h < 12) hourDist.Morning++;
    else if (h >= 12 && h < 17) hourDist.Afternoon++;
    else if (h >= 17 && h < 21) hourDist.Evening++;
    else hourDist.Night++;
  });

  const periodLabel = period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All Time';

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'Cormorant Garamond, serif' }}>Cosmic Report</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Deep analysis of your angel number journey</p>
      </div>

      {/* Period selector */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '999px', padding: '0.25rem' }}>
        {(['week', 'month', 'all'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, padding: '0.5rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
            background: period === p ? 'rgba(167,139,250,0.2)' : 'transparent',
            border: period === p ? '1px solid rgba(167,139,250,0.3)' : '1px solid transparent',
            color: period === p ? '#a78bfa' : 'rgba(255,255,255,0.4)',
          }}>{p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'All Time'}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>No data for {periodLabel.toLowerCase()}</p>
          <p style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>Start logging angel numbers to generate your cosmic report</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            {[
              { label: 'Total Sightings', value: totalSightings, color: '#a78bfa', emoji: '✦' },
              { label: 'Unique Numbers', value: uniqueNumbers, color: '#22d3ee', emoji: '🔢' },
              { label: 'Verified', value: verifiedCount, color: '#22c55e', emoji: '✅' },
              { label: 'With Thoughts', value: withThoughts, color: '#f59e0b', emoji: '💭' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
                <p style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.emoji}</p>
                <p style={{ color: s.color, fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Cormorant Garamond, serif' }}>{s.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Dominant number */}
          {topNumber && (
            <div style={{ background: `linear-gradient(135deg, ${getMeaning(topNumber).color}15, rgba(8,6,28,0.95))`, borderRadius: '1.5rem', border: `1px solid ${getMeaning(topNumber).color}25`, padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Your Dominant Number — {periodLabel}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `${getMeaning(topNumber).color}15`, border: `2px solid ${getMeaning(topNumber).color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: getMeaning(topNumber).color, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', flexShrink: 0 }}>{topNumber}</div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>{getMeaning(topNumber).title}</p>
                  <p style={{ color: getMeaning(topNumber).color, fontSize: '0.78rem' }}>Theme: {getMeaning(topNumber).theme} · {counts[topNumber]} sightings</p>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.7, fontStyle: 'italic' }}>{getMeaning(topNumber).guidance}</p>
            </div>
          )}

          {/* Dominant theme */}
          {dominantTheme && (
            <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }}>Dominant Theme</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ fontSize: '2rem' }}>🌟</div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{dominantTheme[0]}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Appeared in {dominantTheme[1]} of your sightings this period</p>
                </div>
              </div>
            </div>
          )}

          {/* Top numbers list */}
          {sorted.length > 1 && (
            <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }}>Number Frequency</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sorted.slice(0, 6).map(([num, count]) => {
                  const m = getMeaning(num);
                  const pct = Math.round((count / totalSightings) * 100);
                  return (
                    <div key={num}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: m.color, fontWeight: 800, fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem', minWidth: '40px' }}>{num}</span>
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>{m.title}</span>
                        </div>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>{count}x ({pct}%)</span>
                      </div>
                      <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: m.color, borderRadius: '999px', transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day of week distribution */}
          <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Sightings by Day</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: '80px' }}>
              {Object.entries(dayDist).map(([day, count]) => (
                <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '100%', background: count > 0 ? '#a78bfa' : 'rgba(255,255,255,0.05)', borderRadius: '4px 4px 0 0', height: `${Math.max((count / maxDay) * 60, count > 0 ? 8 : 4)}px`, transition: 'height 0.3s ease' }} />
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time of day */}
          <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }}>Time of Day Patterns</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {Object.entries(hourDist).map(([time, count]) => {
                const emojis: Record<string, string> = { Morning: '🌅', Afternoon: '☀️', Evening: '🌆', Night: '🌙' };
                const pct = totalSightings > 0 ? Math.round((count / totalSightings) * 100) : 0;
                return (
                  <div key={time} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1rem', width: '1.5rem' }}>{emojis[time]}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', minWidth: '70px' }}>{time}</span>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #a78bfa, #22d3ee)', borderRadius: '999px' }} />
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', minWidth: '30px', textAlign: 'right' }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Numerology of period */}
          <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }}>Today’s Numerology Energy</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(167,139,250,0.15)', border: '2px solid rgba(167,139,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#a78bfa', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', flexShrink: 0 }}>{periodNum}</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6 }}>Today carries the energy of number {periodNum}. Your angel number sightings are being amplified and filtered through this universal day vibration.</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}