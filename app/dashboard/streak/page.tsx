'use client';
import { useState, useEffect } from 'react';

const MILESTONES = [
  { days: 3, title: 'First Spark', emoji: '✨', color: '#f59e0b', desc: '3 days of divine awareness' },
  { days: 7, title: 'Week of Wonder', emoji: '🌟', color: '#c9a84c', desc: 'A full week of angel number logging' },
  { days: 14, title: 'Fortnight Seeker', emoji: '🔮', color: '#a78bfa', desc: 'Two weeks of spiritual dedication' },
  { days: 21, title: 'Habit Formed', emoji: '💫', color: '#22d3ee', desc: '21 days — a new spiritual habit' },
  { days: 30, title: 'Moon Cycle', emoji: '🌕', color: '#f472b6', desc: 'A full lunar cycle of awareness' },
  { days: 66, title: 'Transformation', emoji: '🦋', color: '#22c55e', desc: '66 days — true transformation' },
  { days: 100, title: 'Century Seeker', emoji: '💯', color: '#ef4444', desc: '100 days of divine connection' },
  { days: 365, title: 'Year of Angels', emoji: '👼', color: '#c9a84c', desc: 'A full year of angel number awareness' },
];

export default function StreakPage() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    try { setLogs(JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]')); } catch {}
  }, []);

  const days = [...new Set(logs.map((l: any) => new Date(l.timestamp).toDateString()))] as string[];
  days.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let currentStreak = 0;
  if (days.length) {
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (days[0] === today || days[0] === yesterday) {
      currentStreak = 1;
      for (let i = 1; i < days.length; i++) {
        const diff = (new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) / 86400000;
        if (diff <= 1.5) currentStreak++; else break;
      }
    }
  }

  let longestStreak = 0, tempStreak = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) / 86400000;
    if (diff <= 1.5) { tempStreak++; longestStreak = Math.max(longestStreak, tempStreak); }
    else tempStreak = 1;
  }
  if (days.length === 1) longestStreak = 1;

  const nextMilestone = MILESTONES.find(m => m.days > currentStreak);
  const daysToNext = nextMilestone ? nextMilestone.days - currentStreak : 0;

  const last30: { date: string; logged: boolean }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000).toDateString();
    last30.push({ date: d, logged: days.includes(d) });
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f59e0b', fontFamily: 'Cormorant Garamond, serif' }}>Streak & Milestones</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Your journey of consistent divine awareness</p>
      </div>
      <div style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.15),rgba(8,6,28,0.95))', borderRadius: '1.5rem', border: '1px solid rgba(245,158,11,0.25)', padding: '2rem', backdropFilter: 'blur(12px)', textAlign: 'center', marginBottom: '1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔥</div>
        <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '3.5rem', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{currentStreak}</div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginTop: '0.25rem' }}>day{currentStreak !== 1 ? 's' : ''} current streak</p>
        {nextMilestone && currentStreak > 0 && (
          <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', padding: '0.5rem 1.25rem', display: 'inline-block' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem' }}>{daysToNext} day{daysToNext !== 1 ? 's' : ''} until <span style={{ color: '#f59e0b' }}>{nextMilestone.title}</span> {nextMilestone.emoji}</p>
          </div>
        )}
        {currentStreak === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', marginTop: '0.75rem' }}>Log an angel number today to start your streak!</p>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
          <div style={{ color: '#a78bfa', fontWeight: 800, fontSize: '1.75rem', fontFamily: 'Cormorant Garamond, serif' }}>{longestStreak}</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', marginTop: '0.15rem' }}>Longest Streak</div>
        </div>
        <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
          <div style={{ color: '#22d3ee', fontWeight: 800, fontSize: '1.75rem', fontFamily: 'Cormorant Garamond, serif' }}>{days.length}</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', marginTop: '0.15rem' }}>Total Active Days</div>
        </div>
      </div>
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '1rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Last 30 Days</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10,1fr)', gap: '0.3rem' }}>
          {last30.map((d, i) => (
            <div key={i} title={d.date} style={{ aspectRatio: '1', borderRadius: '4px', background: d.logged ? 'rgba(245,158,11,0.6)' : 'rgba(255,255,255,0.05)', border: d.logged ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.04)' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(245,158,11,0.6)' }} /><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>Logged</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)' }} /><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>No log</span></div>
        </div>
      </div>
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Milestones</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {MILESTONES.map(m => {
            const done = longestStreak >= m.days;
            return (
              <div key={m.days} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.625rem 0.75rem', background: done ? `${m.color}08` : 'rgba(255,255,255,0.02)', borderRadius: '0.875rem', border: done ? `1px solid ${m.color}20` : '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '1.25rem', opacity: done ? 1 : 0.3 }}>{m.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: done ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 600, fontSize: '0.85rem' }}>{m.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>{m.desc}</p>
                </div>
                <span style={{ color: done ? m.color : 'rgba(255,255,255,0.2)', fontSize: '0.72rem', fontWeight: 700 }}>{m.days}d</span>
                {done && <span style={{ color: m.color, fontSize: '0.9rem' }}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
