'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function getStats(logs: any[]) {
  if (!logs.length) return { total: 0, topNumber: null, topCount: 0, streak: 0, verified: 0, thisWeek: 0, thisMonth: 0, byNumber: {}, byHour: Array(24).fill(0), byDay: Array(7).fill(0) };
  const freq: Record<string, number> = {};
  const byHour = Array(24).fill(0);
  const byDay = Array(7).fill(0);
  let verified = 0;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);
  const monthAgo = new Date(now.getTime() - 30 * 86400000);
  let thisWeek = 0, thisMonth = 0;
  logs.forEach((l: any) => {
    freq[l.number] = (freq[l.number] || 0) + 1;
    if (l.screenshotUrl) verified++;
    const d = new Date(l.createdAt);
    byHour[d.getHours()]++;
    byDay[d.getDay()]++;
    if (d > weekAgo) thisWeek++;
    if (d > monthAgo) thisMonth++;
  });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  // streak
  const dates = [...new Set(logs.map((l: any) => new Date(l.createdAt).toDateString()))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (dates[0] === today || dates[0] === yesterday) {
    streak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (prev.getTime() - curr.getTime()) / 86400000;
      if (diff <= 1.5) streak++; else break;
    }
  }
  return { total: logs.length, topNumber: sorted[0]?.[0], topCount: sorted[0]?.[1] || 0, streak, verified, thisWeek, thisMonth, byNumber: freq, byHour, byDay };
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function StatsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [dreams, setDreams] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [tab, setTab] = useState<'overview'|'numbers'|'time'>('overview');

  useEffect(() => {
    try {
      setLogs(JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]'));
      setDreams(JSON.parse(localStorage.getItem('synchrosoul_dreams') || '[]'));
      setPosts(JSON.parse(localStorage.getItem('synchrosoul_posts') || '[]'));
    } catch {}
  }, []);

  const stats = getStats(logs);
  const topNumbers = Object.entries(stats.byNumber).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxCount = topNumbers[0]?.[1] || 1;
  const maxHour = Math.max(...stats.byHour, 1);
  const maxDay = Math.max(...stats.byDay, 1);

  const STAT_CARDS = [
    { label: 'Total Logs', value: stats.total, emoji: '✦', color: '#c9a84c', sub: 'angel numbers logged' },
    { label: 'Current Streak', value: stats.streak, emoji: '🔥', color: '#f97316', sub: 'days in a row' },
    { label: 'This Week', value: stats.thisWeek, emoji: '📅', color: '#60a5fa', sub: 'logs this week' },
    { label: 'Verified', value: stats.verified, emoji: '✓', color: '#4ade80', sub: 'angel approved' },
    { label: 'Dreams', value: dreams.length, emoji: '🌙', color: '#a78bfa', sub: 'dreams recorded' },
    { label: 'Posts', value: posts.length, emoji: '✧', color: '#f472b6', sub: 'cosmic posts' },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'Cormorant Garamond, serif' }}>Your Cosmic Stats</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Patterns in your spiritual journey</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '999px', padding: '0.25rem' }}>
        {(['overview','numbers','time'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '0.5rem', borderRadius: '999px', cursor: 'pointer', border: 'none',
            background: tab === t ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: tab === t ? '#fff' : 'rgba(255,255,255,0.4)',
            fontSize: '0.82rem', fontWeight: tab === t ? 700 : 400, textTransform: 'capitalize'
          }}>{t}</button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {STAT_CARDS.map(s => (
              <div key={s.label} style={{
                background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem',
                border: `1px solid ${s.color}25`, padding: '1rem 0.75rem',
                backdropFilter: 'blur(12px)', textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.emoji}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: '#fff', fontSize: '0.72rem', fontWeight: 700, marginTop: '0.3rem' }}>{s.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', marginTop: '0.15rem' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Top Number */}
          {stats.topNumber && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(8,6,28,0.9))',
              borderRadius: '1.5rem', border: '1px solid rgba(201,168,76,0.3)',
              padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem',
              display: 'flex', alignItems: 'center', gap: '1.25rem'
            }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(201,168,76,0.2)', border: '2px solid rgba(201,168,76,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', fontWeight: 800, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif'
              }}>{stats.topNumber}</div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>Your Signature Number</p>
                <p style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{stats.topNumber}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Seen {stats.topCount} times — this is your primary guide</p>
              </div>
            </div>
          )}

          {/* Empty state */}
          {stats.total === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>No data yet</p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Start logging angel numbers to see your patterns</p>
              <Link href="/dashboard" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.6rem 1.5rem', borderRadius: '999px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', textDecoration: 'none', fontSize: '0.85rem' }}>Log a Number ✦</Link>
            </div>
          )}
        </div>
      )}

      {/* NUMBERS TAB */}
      {tab === 'numbers' && (
        <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.25rem' }}>Number Frequency</p>
          {topNumbers.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '2rem' }}>No numbers logged yet</p>}
          {topNumbers.map(([num, count], i) => (
            <div key={num} style={{ marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: i === 0 ? '#c9a84c' : 'rgba(255,255,255,0.6)', fontWeight: i === 0 ? 800 : 400, fontSize: '0.9rem', fontFamily: 'Cormorant Garamond, serif' }}>{num}</span>
                  {i === 0 && <span style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.6rem', color: '#c9a84c' }}>TOP</span>}
                </div>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>{count}x</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(count / maxCount) * 100}%`, background: i === 0 ? '#c9a84c' : 'rgba(167,139,250,0.6)', borderRadius: '999px' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TIME TAB */}
      {tab === 'time' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* By Day of Week */}
          <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.25rem' }}>By Day of Week</p>
            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-end', height: '80px' }}>
              {stats.byDay.map((count, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                  <div style={{ width: '100%', background: count > 0 ? 'rgba(96,165,250,0.6)' : 'rgba(255,255,255,0.06)', borderRadius: '4px 4px 0 0', height: `${Math.max((count / maxDay) * 60, 4)}px`, transition: 'height 0.5s ease' }} />
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>{DAY_NAMES[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By Hour */}
          <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1.25rem' }}>By Hour of Day</p>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '60px' }}>
              {stats.byHour.map((count, i) => (
                <div key={i} title={`${i}:00 — ${count} logs`} style={{
                  flex: 1, background: count > 0 ? `rgba(201,168,76,${0.2 + (count/maxHour)*0.8})` : 'rgba(255,255,255,0.04)',
                  borderRadius: '2px 2px 0 0', height: `${Math.max((count / maxHour) * 50, 3)}px`, cursor: 'default'
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
              {['12am','6am','12pm','6pm','11pm'].map(t => <span key={t} style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.6rem' }}>{t}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}