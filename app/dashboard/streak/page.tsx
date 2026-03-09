'use client';
import { useState, useEffect } from 'react';

const milestones = [
  { days: 3, emoji: '🌱', title: 'Seedling', desc: 'Your spiritual practice is taking root', color: '#48bb78' },
  { days: 7, emoji: '🌿', title: 'One Week Wonder', desc: 'Seven days of cosmic awareness', color: '#38a169' },
  { days: 14, emoji: '🌸', title: 'Blossoming', desc: 'Two weeks of divine connection', color: '#ed64a6' },
  { days: 21, emoji: '🌟', title: 'Habit Formed', desc: 'Twenty-one days — a new neural pathway', color: '#c9a84c' },
  { days: 30, emoji: '🌙', title: 'Moon Cycle', desc: 'A full lunar cycle of awareness', color: '#9b59b6' },
  { days: 40, emoji: '🔮', title: 'Prophet', desc: 'Forty days — the sacred number of transformation', color: '#3498db' },
  { days: 66, emoji: '♾️', title: 'Infinite Loop', desc: 'Sixty-six days — true habit formation', color: '#e74c3c' },
  { days: 100, emoji: '💎', title: 'Diamond Soul', desc: 'One hundred days of unbroken awareness', color: '#f6ad55' },
  { days: 365, emoji: '👑', title: 'Cosmic Master', desc: 'A full year of divine synchronicity', color: '#ffd700' },
];

export default function StreakPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [calendarDays, setCalendarDays] = useState<Record<string, number>>({});

  useEffect(() => {
    const l = localStorage.getItem('synchrosoul_logs');
    if (!l) return;
    const parsed = JSON.parse(l);
    setLogs(parsed);

    // Build calendar
    const dayMap: Record<string, number> = {};
    parsed.forEach((log: any) => {
      const key = new Date(log.createdAt || log.timestamp).toDateString();
      dayMap[key] = (dayMap[key] || 0) + 1;
    });
    setCalendarDays(dayMap);

    // Calculate current streak
    const uniqueDates = [...new Set(parsed.map((l: any) => new Date(l.createdAt || l.timestamp).toDateString()))] as string[];
    const sorted = uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let cur = 0;
    if (sorted[0] === today || sorted[0] === yesterday) {
      cur = 1;
      for (let i = 1; i < sorted.length; i++) {
        const diff = new Date(sorted[i-1]).getTime() - new Date(sorted[i]).getTime();
        if (diff <= 86400000 * 1.5) cur++; else break;
      }
    }
    setStreak(cur);

    // Calculate longest streak
    let longest = 0, current = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = new Date(sorted[i-1]).getTime() - new Date(sorted[i]).getTime();
      if (diff <= 86400000 * 1.5) { current++; longest = Math.max(longest, current); }
      else current = 1;
    }
    setLongestStreak(Math.max(longest, cur));
  }, []);

  const nextMilestone = milestones.find(m => m.days > streak);
  const lastMilestone = [...milestones].reverse().find(m => m.days <= streak);
  const progressToNext = nextMilestone ? Math.round((streak / nextMilestone.days) * 100) : 100;

  // Last 30 days calendar
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000);
    return { date: d, key: d.toDateString(), count: calendarDays[d.toDateString()] || 0 };
  });

  const flameColor = streak >= 30 ? '#ffd700' : streak >= 14 ? '#f6ad55' : streak >= 7 ? '#e74c3c' : streak >= 3 ? '#ed8936' : '#c9a84c';

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>🔥 Streak Tracker</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Your unbroken chain of cosmic awareness</p>

      <div style={{ background: 'rgba(8,6,28,0.9)', border: '1px solid ' + flameColor + '44', borderRadius: '1.5rem', padding: '2.5rem', backdropFilter: 'blur(12px)', textAlign: 'center', marginBottom: '1.5rem', boxShadow: '0 0 40px ' + flameColor + '22' }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{streak >= 30 ? '👑' : streak >= 14 ? '💎' : streak >= 7 ? '🌟' : streak >= 3 ? '🔥' : '✨'}</div>
        <div style={{ fontSize: '5rem', fontWeight: 900, color: flameColor, lineHeight: 1, marginBottom: '0.25rem' }}>{streak}</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginBottom: '1.5rem' }}>day{streak !== 1 ? 's' : ''} in a row</div>
        {lastMilestone && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.25rem' }}>
            <span>{lastMilestone.emoji}</span>
            <span style={{ color: lastMilestone.color, fontSize: '0.85rem', fontWeight: 600 }}>{lastMilestone.title}</span>
          </div>
        )}
        {nextMilestone && (
          <>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginBottom: '0.5rem' }}>Next: {nextMilestone.emoji} {nextMilestone.title} in {nextMilestone.days - streak} day{nextMilestone.days - streak !== 1 ? 's' : ''}</div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: progressToNext + '%', background: 'linear-gradient(90deg, ' + flameColor + '88, ' + flameColor + ')', borderRadius: '999px', transition: 'width 1s ease' }} />
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.25rem', backdropFilter: 'blur(8px)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🏆</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#c9a84c' }}>{longestStreak}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Longest Streak</div>
        </div>
        <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.25rem', backdropFilter: 'blur(8px)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>📅</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#9b59b6' }}>{Object.keys(calendarDays).length}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Total Active Days</div>
        </div>
      </div>

      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(10px)', marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>📅 Last 30 Days</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
          {last30.map((d, i) => (
            <div key={i} title={d.date.toLocaleDateString() + (d.count > 0 ? ' · ' + d.count + ' logs' : '')} style={{ aspectRatio: '1', borderRadius: '4px', background: d.count > 0 ? (d.count >= 3 ? '#c9a84c' : d.count >= 2 ? '#c9a84c88' : '#c9a84c44') : 'rgba(255,255,255,0.05)', border: d.key === new Date().toDateString() ? '1px solid rgba(201,168,76,0.6)' : '1px solid transparent', cursor: 'default' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
          {[['rgba(255,255,255,0.05)', 'No logs'], ['#c9a84c44', '1 log'], ['#c9a84c88', '2 logs'], ['#c9a84c', '3+']].map(([color, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(10px)' }}>
        <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>🏅 Milestone Path</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {milestones.map((m, i) => {
            const achieved = streak >= m.days;
            const isNext = nextMilestone?.days === m.days;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', background: achieved ? 'rgba(255,255,255,0.06)' : isNext ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)', border: achieved ? '1px solid ' + m.color + '44' : isNext ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(255,255,255,0.04)', opacity: achieved ? 1 : isNext ? 0.9 : 0.45 }}>
                <span style={{ fontSize: '1.25rem' }}>{achieved ? m.emoji : '🔒'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: achieved ? m.color : 'rgba(255,255,255,0.5)', fontWeight: achieved ? 600 : 400, fontSize: '0.88rem' }}>{m.title} — {m.days} days</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{m.desc}</div>
                </div>
                {achieved && <span style={{ color: '#48bb78', fontSize: '0.75rem' }}>✓</span>}
                {isNext && <span style={{ color: '#c9a84c', fontSize: '0.75rem' }}>{m.days - streak}d</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
