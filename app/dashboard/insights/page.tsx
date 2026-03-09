'use client';
import { useState, useEffect } from 'react';

interface LogEntry { number: string; timestamp: string; thought?: string; }

function getStoredLogs(): LogEntry[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]'); } catch { return []; }
}

function getMostFrequent(logs: LogEntry[]) {
  const counts: Record<string, number> = {};
  logs.forEach(l => { counts[l.number] = (counts[l.number] || 0) + 1; });
  return Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,5);
}

function getByHour(logs: LogEntry[]) {
  const hours = Array(24).fill(0);
  logs.forEach(l => {
    const h = new Date(l.timestamp).getHours();
    hours[h]++;
  });
  return hours;
}

function getByDay(logs: LogEntry[]) {
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const counts = Array(7).fill(0);
  logs.forEach(l => { counts[new Date(l.timestamp).getDay()]++; });
  return days.map((d,i) => ({ day: d, count: counts[i] }));
}

function getStreak(logs: LogEntry[]) {
  if (!logs.length) return 0;
  const dates = [...new Set(logs.map(l => new Date(l.timestamp).toDateString()))].sort();
  let streak = 1, max = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i]).getTime() - new Date(dates[i-1]).getTime()) / 86400000;
    if (diff === 1) { streak++; max = Math.max(max, streak); } else streak = 1;
  }
  return max;
}

const DEMO_LOGS: LogEntry[] = [
  ...Array.from({length: 47}, (_, i) => ({
    number: ['1111','333','444','555','777','222','888','999'][Math.floor(Math.random()*8)],
    timestamp: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
    thought: i % 3 === 0 ? 'Thinking about my purpose' : undefined
  }))
];

export default function InsightsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [period, setPeriod] = useState<'7d'|'30d'|'all'>('30d');

  useEffect(() => {
    const stored = getStoredLogs();
    setLogs(stored.length > 0 ? stored : DEMO_LOGS);
  }, []);

  const now = Date.now();
  const filtered = logs.filter(l => {
    if (period === '7d') return now - new Date(l.timestamp).getTime() < 7*86400000;
    if (period === '30d') return now - new Date(l.timestamp).getTime() < 30*86400000;
    return true;
  });

  const topNumbers = getMostFrequent(filtered);
  const byHour = getByHour(filtered);
  const byDay = getByDay(filtered);
  const streak = getStreak(filtered);
  const maxHour = Math.max(...byHour, 1);
  const maxDay = Math.max(...byDay.map(d => d.count), 1);

  const COLORS: Record<string,string> = {
    '1111':'#c9a84c','333':'#f97316','444':'#22c55e','555':'#8b5cf6',
    '777':'#c9a84c','222':'#3b82f6','888':'#f59e0b','999':'#ef4444'
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Cosmic Insights</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Patterns in your angel number journey</p>
      </div>

      {/* Period filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        {(['7d','30d','all'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            padding: '0.4rem 1rem', borderRadius: '999px', cursor: 'pointer',
            background: period === p ? '#c9a84c' : 'rgba(255,255,255,0.08)',
            color: period === p ? '#000' : 'rgba(255,255,255,0.7)',
            border: 'none', fontSize: '0.85rem', fontWeight: 600
          }}>{p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'All Time'}</button>
        ))}
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Logs', value: filtered.length, icon: '📊', color: '#c9a84c' },
          { label: 'Unique Numbers', value: new Set(filtered.map(l => l.number)).size, icon: '🔢', color: '#8b5cf6' },
          { label: 'Best Streak', value: streak + 'd', icon: '🔥', color: '#f97316' },
          { label: 'With Thoughts', value: filtered.filter(l => l.thought).length, icon: '💭', color: '#3b82f6' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'rgba(8,6,28,0.85)', borderRadius: '1rem',
            border: `1px solid ${s.color}30`, padding: '1rem',
            backdropFilter: 'blur(12px)', textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top Numbers */}
      <div style={{
        background: 'rgba(8,6,28,0.85)', borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem',
        backdropFilter: 'blur(12px)', marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Most Seen Numbers</h3>
        {topNumbers.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>No logs yet. Start logging angel numbers!</p>
        ) : topNumbers.map(([num, count], i) => {
          const pct = Math.round((count / filtered.length) * 100);
          const color = COLORS[num] || '#c9a84c';
          return (
            <div key={num} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: color, fontWeight: 700 }}>#{i+1} {num}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{count}x · {pct}%</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
                <div style={{ height: '100%', borderRadius: '4px', background: color, width: `${pct}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity by Day */}
      <div style={{
        background: 'rgba(8,6,28,0.85)', borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem',
        backdropFilter: 'blur(12px)', marginBottom: '1.5rem'
      }}>
        <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Activity by Day of Week</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '80px' }}>
          {byDay.map(({ day, count }) => (
            <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{
                width: '100%', borderRadius: '4px 4px 0 0',
                background: count > 0 ? '#c9a84c' : 'rgba(255,255,255,0.06)',
                height: `${Math.max(4, (count / maxDay) * 64)}px`,
                transition: 'height 0.5s'
              }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity by Hour */}
      <div style={{
        background: 'rgba(8,6,28,0.85)', borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem',
        backdropFilter: 'blur(12px)'
      }}>
        <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Activity by Hour</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '60px' }}>
          {byHour.map((count, h) => (
            <div key={h} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%', borderRadius: '2px 2px 0 0',
                background: count > 0 ? `rgba(201,168,76,${0.3 + (count/maxHour)*0.7})` : 'rgba(255,255,255,0.04)',
                height: `${Math.max(2, (count / maxHour) * 52)}px`
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>12am</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>6am</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>12pm</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>6pm</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>11pm</span>
        </div>
      </div>
    </div>
  );
}