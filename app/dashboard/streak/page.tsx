'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const MILESTONES = [
  { days: 1, label: 'First Step', emoji: '🌱', color: '#4ade80', message: 'Your journey begins. The angels are watching.' },
  { days: 3, label: 'Trinity', emoji: '🔺', color: '#f97316', message: 'Three days of awareness. The Ascended Masters acknowledge you.' },
  { days: 7, label: 'Sacred Week', emoji: '✨', color: '#c9a84c', message: 'Seven days — a complete spiritual cycle. You are building a practice.' },
  { days: 11, label: 'Master Number', emoji: '⚡', color: '#e0e7ff', message: '11 days — master number energy. Your intuition is amplifying.' },
  { days: 14, label: 'Two Weeks', emoji: '🌙', color: '#60a5fa', message: 'Two full weeks. Your awareness is becoming second nature.' },
  { days: 21, label: 'Habit Formed', emoji: '🔮', color: '#a78bfa', message: '21 days — a new habit is born. Your spiritual channel is open.' },
  { days: 30, label: 'Moon Cycle', emoji: '🌕', color: '#fde68a', message: 'One full moon cycle. You are in deep alignment with cosmic rhythms.' },
  { days: 33, label: 'Master Builder', emoji: '🏛️', color: '#f59e0b', message: '33 days — the master teacher number. You are becoming a beacon.' },
  { days: 44, label: 'Angelic Gate', emoji: '🚪', color: '#22c55e', message: '44 days — the angels have opened a permanent gate for you.' },
  { days: 55, label: 'Transformation', emoji: '🦋', color: '#8b5cf6', message: '55 days — you have transformed. Nothing will be the same.' },
  { days: 66, label: 'Love Mastery', emoji: '💗', color: '#ec4899', message: '66 days — you radiate divine love. Others feel your energy shift.' },
  { days: 77, label: 'Lucky Sage', emoji: '🍀', color: '#6366f1', message: '77 days — you are a walking lucky charm. Miracles follow you.' },
  { days: 88, label: 'Abundance Master', emoji: '♾️', color: '#f59e0b', message: '88 days — infinite abundance is your natural state.' },
  { days: 99, label: 'Completion', emoji: '🌀', color: '#ef4444', message: '99 days — a cosmic cycle completes. You are ready for ascension.' },
  { days: 111, label: 'Portal Keeper', emoji: '🌟', color: '#fde68a', message: '111 days — you ARE the portal. Manifestation is instant for you.' },
  { days: 222, label: 'Divine Partner', emoji: '👁️', color: '#3b82f6', message: '222 days — you walk in perfect divine partnership with the universe.' },
  { days: 333, label: 'Ascended', emoji: '☀️', color: '#f97316', message: '333 days — you have ascended. You are a living master.' },
  { days: 365, label: 'Year of Light', emoji: '🌈', color: '#c9a84c', message: 'One full year. You have completed the greatest spiritual journey.' },
];

export default function StreakPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [calendarDays, setCalendarDays] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const l = JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]');
      setLogs(l);
      if (!l.length) return;

      // Build calendar
      const dayMap: Record<string, number> = {};
      l.forEach((entry: any) => {
        const d = new Date(entry.createdAt).toISOString().split('T')[0];
        dayMap[d] = (dayMap[d] || 0) + 1;
      });
      setCalendarDays(dayMap);
      setTotalDays(Object.keys(dayMap).length);

      // Current streak
      const sortedDates = Object.keys(dayMap).sort((a, b) => b.localeCompare(a));
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let cur = 0;
      if (sortedDates[0] === today || sortedDates[0] === yesterday) {
        cur = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const prev = new Date(sortedDates[i-1]);
          const curr = new Date(sortedDates[i]);
          const diff = (prev.getTime() - curr.getTime()) / 86400000;
          if (diff <= 1.5) cur++; else break;
        }
      }
      setStreak(cur);

      // Longest streak
      let longest = 1, tempStreak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i-1]);
        const curr = new Date(sortedDates[i]);
        const diff = (prev.getTime() - curr.getTime()) / 86400000;
        if (diff <= 1.5) { tempStreak++; longest = Math.max(longest, tempStreak); }
        else tempStreak = 1;
      }
      setLongestStreak(longest);
    } catch {}
  }, []);

  const nextMilestone = MILESTONES.find(m => m.days > streak);
  const lastMilestone = [...MILESTONES].reverse().find(m => m.days <= streak);
  const progressToNext = nextMilestone ? (streak / nextMilestone.days) * 100 : 100;

  // Last 30 days calendar
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000);
    const key = d.toISOString().split('T')[0];
    return { key, count: calendarDays[key] || 0, day: d.getDate() };
  });

  const earnedMilestones = MILESTONES.filter(m => m.days <= streak);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f97316', fontFamily: 'Cormorant Garamond, serif' }}>Streak Tracker</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Your consistency is your superpower</p>
      </div>

      {/* Main streak display */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(8,6,28,0.9))',
        borderRadius: '1.5rem', border: '1px solid rgba(249,115,22,0.3)',
        padding: '2rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem',
        textAlign: 'center', boxShadow: '0 0 60px rgba(249,115,22,0.1)'
      }}>
        <div style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '0.5rem' }}>🔥</div>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: '#f97316', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{streak}</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', marginTop: '0.25rem' }}>day{streak !== 1 ? 's' : ''} in a row</div>
        {lastMilestone && (
          <div style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: `${lastMilestone.color}15`, border: `1px solid ${lastMilestone.color}30`, borderRadius: '999px', padding: '0.4rem 1rem' }}>
            <span>{lastMilestone.emoji}</span>
            <span style={{ color: lastMilestone.color, fontSize: '0.85rem', fontWeight: 700 }}>{lastMilestone.label}</span>
          </div>
        )}
        {lastMilestone && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.75rem', fontStyle: 'italic' }}>{lastMilestone.message}</p>}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.6rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Current', value: streak, emoji: '🔥', color: '#f97316' },
          { label: 'Longest', value: longestStreak, emoji: '🏆', color: '#c9a84c' },
          { label: 'Total Days', value: totalDays, emoji: '📅', color: '#60a5fa' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: `1px solid ${s.color}20`, padding: '1rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.emoji}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', marginTop: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress to next milestone */}
      {nextMilestone && (
        <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Next Milestone</p>
              <p style={{ color: '#fff', fontWeight: 700 }}>{nextMilestone.emoji} {nextMilestone.label} — {nextMilestone.days} days</p>
            </div>
            <span style={{ color: nextMilestone.color, fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>{nextMilestone.days - streak} left</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressToNext}%`, background: `linear-gradient(90deg, #f97316, ${nextMilestone.color})`, borderRadius: '999px', transition: 'width 1s ease' }} />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.5rem', fontStyle: 'italic' }}>{nextMilestone.message}</p>
        </div>
      )}

      {/* 30-day calendar */}
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Last 30 Days</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '4px' }}>
          {last30.map(d => (
            <div key={d.key} title={`${d.key}: ${d.count} logs`} style={{
              aspectRatio: '1', borderRadius: '4px',
              background: d.count === 0 ? 'rgba(255,255,255,0.04)' : d.count >= 3 ? '#f97316' : d.count >= 2 ? 'rgba(249,115,22,0.6)' : 'rgba(249,115,22,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.55rem', color: d.count > 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'
            }}>{d.day}</div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', alignItems: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>Less</span>
          {['rgba(255,255,255,0.04)','rgba(249,115,22,0.3)','rgba(249,115,22,0.6)','#f97316'].map((c, i) => (
            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '2px', background: c }} />
          ))}
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>More</span>
        </div>
      </div>

      {/* Earned milestones */}
      {earnedMilestones.length > 0 && (
        <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Milestones Earned ({earnedMilestones.length})</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {earnedMilestones.map(m => (
              <div key={m.days} style={{ background: `${m.color}12`, border: `1px solid ${m.color}25`, borderRadius: '999px', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.9rem' }}>{m.emoji}</span>
                <span style={{ color: m.color, fontSize: '0.75rem', fontWeight: 700 }}>{m.label}</span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem' }}>{m.days}d</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {logs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>Start your streak today</p>
          <Link href="/dashboard" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.6rem 1.5rem', borderRadius: '999px', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316', textDecoration: 'none', fontSize: '0.85rem' }}>Log First Number 🔥</Link>
        </div>
      )}
    </div>
  );
}