'use client';
import { useState, useEffect } from 'react';

export default function StatsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => {
    try { setLogs(JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]')); } catch {}
  }, []);

  const total = logs.length;
  const verified = logs.filter((l: any) => l.screenshotUrl).length;
  const streak = (() => {
    if (!logs.length) return 0;
    const days = [...new Set(logs.map((l: any) => new Date(l.timestamp).toDateString()))] as string[];
    days.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let s = 1;
    for (let i = 1; i < days.length; i++) {
      const diff = (new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) / 86400000;
      if (diff <= 1.5) s++; else break;
    }
    return s;
  })();

  const freq: Record<string, number> = {};
  logs.forEach((l: any) => { freq[l.number] = (freq[l.number] || 0) + 1; });
  const topNumbers = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxFreq = topNumbers[0]?.[1] || 1;
  const byHour: number[] = Array(24).fill(0);
  logs.forEach((l: any) => { byHour[new Date(l.timestamp).getHours()]++; });
  const maxHour = Math.max(...byHour, 1);
  const byDay: number[] = Array(7).fill(0);
  logs.forEach((l: any) => { byDay[new Date(l.timestamp).getDay()]++; });
  const maxDay = Math.max(...byDay, 1);
  const COLORS = ['#c9a84c', '#a78bfa', '#22d3ee', '#f472b6', '#22c55e'];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Your Statistics</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Patterns in your angel number journey</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[{ label: 'Total Logs', val: total, color: '#c9a84c', emoji: '📊' },
          { label: 'Verified', val: verified, color: '#22c55e', emoji: '✅' },
          { label: 'Day Streak', val: streak, color: '#a78bfa', emoji: '🔥' }].map(s => (
          <div key={s.label} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: `1px solid ${s.color}20`, padding: '1rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.emoji}</div>
            <div style={{ color: s.color, fontWeight: 800, fontSize: '1.5rem', fontFamily: 'Cormorant Garamond, serif' }}>{s.val}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', marginTop: '0.15rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
      {topNumbers.length > 0 && (
        <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '0.75rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Most Seen Numbers</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {topNumbers.map(([num, cnt], i) => (
              <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: COLORS[i], fontFamily: 'Cormorant Garamond, serif', fontWeight: 800, fontSize: '0.95rem', minWidth: '48px' }}>{num}</span>
                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(cnt / maxFreq) * 100}%`, background: COLORS[i], borderRadius: '999px' }} />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', minWidth: '24px', textAlign: 'right' }}>{cnt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '0.75rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Activity by Day</p>
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'flex-end', height: '60px' }}>
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '100%', background: `rgba(201,168,76,${0.15 + (byDay[i] / maxDay) * 0.7})`, borderRadius: '4px 4px 0 0', height: `${Math.max(4, (byDay[i] / maxDay) * 48)}px` }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>{d}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Activity by Hour</p>
        <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '48px' }}>
          {byHour.map((cnt, i) => (
            <div key={i} style={{ flex: 1, background: `rgba(167,139,250,${0.1 + (cnt / maxHour) * 0.8})`, borderRadius: '2px 2px 0 0', height: `${Math.max(2, (cnt / maxHour) * 44)}px` }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
          {['12am','6am','12pm','6pm','12am'].map(t => <span key={t} style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.58rem' }}>{t}</span>)}
        </div>
      </div>
      {total === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📊</div>
          <p>Start logging angel numbers to see your statistics</p>
        </div>
      )}
    </div>
  );
}
