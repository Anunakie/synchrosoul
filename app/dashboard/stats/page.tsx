'use client';
import { useState, useEffect } from 'react';

export default function StatsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [dreams, setDreams] = useState<any[]>([]);
  const [manifests, setManifests] = useState<any[]>([]);
  const [gratitude, setGratitude] = useState<any[]>([]);
  const [affirmFavs, setAffirmFavs] = useState<string[]>([]);

  useEffect(() => {
    const l = localStorage.getItem('synchrosoul_logs'); if (l) setLogs(JSON.parse(l));
    const d = localStorage.getItem('synchrosoul_dreams'); if (d) setDreams(JSON.parse(d));
    const m = localStorage.getItem('synchrosoul_manifestations'); if (m) setManifests(JSON.parse(m));
    const g = localStorage.getItem('synchrosoul_gratitude'); if (g) setGratitude(JSON.parse(g));
    const a = localStorage.getItem('synchrosoul_affirmation_favorites'); if (a) setAffirmFavs(JSON.parse(a));
  }, []);

  // Number frequency
  const freq: Record<string, number> = {};
  logs.forEach((l: any) => { freq[l.number] = (freq[l.number] || 0) + 1; });
  const topNumbers = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxFreq = topNumbers[0]?.[1] || 1;

  // Streak calculation
  const uniqueDates = [...new Set(logs.map((l: any) => new Date(l.createdAt || l.timestamp).toDateString()))];
  const sortedDates = uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const diff = new Date(sortedDates[i-1]).getTime() - new Date(sortedDates[i]).getTime();
      if (diff <= 86400000 * 1.5) streak++; else break;
    }
  }

  // Verified entries
  const verified = logs.filter((l: any) => l.screenshotUrl).length;
  const verifiedPct = logs.length > 0 ? Math.round((verified / logs.length) * 100) : 0;

  // Time of day distribution
  const timeSlots = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  logs.forEach((l: any) => {
    const h = new Date(l.createdAt || l.timestamp).getHours();
    if (h >= 5 && h < 12) timeSlots.morning++;
    else if (h >= 12 && h < 17) timeSlots.afternoon++;
    else if (h >= 17 && h < 21) timeSlots.evening++;
    else timeSlots.night++;
  });
  const maxSlot = Math.max(...Object.values(timeSlots)) || 1;

  // Weekly activity (last 7 days)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const key = d.toDateString();
    const count = logs.filter((l: any) => new Date(l.createdAt || l.timestamp).toDateString() === key).length;
    return { label: d.toLocaleDateString('en-US', { weekday: 'short' }), count };
  });
  const maxDay = Math.max(...weekDays.map(d => d.count)) || 1;

  const statCard = (emoji: string, value: string | number, label: string, color: string, sub?: string) => (
    <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.25rem', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{emoji}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color, lineHeight: 1.1 }}>{value}</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginTop: '0.25rem' }}>{label}</div>
      {sub && <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>📊 Soul Statistics</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Your spiritual journey by the numbers</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {statCard('🔢', logs.length, 'Angel Numbers Logged', '#c9a84c')}
        {statCard('🔥', streak, 'Day Streak', '#e74c3c', streak > 0 ? 'Keep it going!' : 'Start today!')}
        {statCard('🌙', dreams.length, 'Dreams Recorded', '#9b59b6')}
        {statCard('🌱', manifests.length, 'Manifestations', '#48bb78')}
        {statCard('🙏', gratitude.length, 'Gratitude Entries', '#3498db')}
        {statCard('✅', verified + '%', 'Truth Score Rate', '#f39c12', verified + ' verified entries')}
      </div>

      {topNumbers.length > 0 && (
        <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>🏆 Your Top Angel Numbers</h3>
          {topNumbers.map(([num, count], i) => (
            <div key={num} style={{ marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: i === 0 ? '#c9a84c' : 'rgba(255,255,255,0.7)', fontWeight: i === 0 ? 700 : 400, fontSize: '0.9rem' }}>{i === 0 ? '👑 ' : ''}{num}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{count}x</span>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: (count / maxFreq * 100) + '%', background: i === 0 ? 'linear-gradient(90deg, #c9a84c, #f6e27a)' : 'rgba(255,255,255,0.2)', borderRadius: '999px', transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
        <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>📅 Last 7 Days Activity</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '80px' }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '100%', background: d.count > 0 ? 'linear-gradient(to top, #c9a84c88, #c9a84c44)' : 'rgba(255,255,255,0.05)', borderRadius: '4px 4px 0 0', height: Math.max(4, (d.count / maxDay) * 60) + 'px', border: d.count > 0 ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.05)', transition: 'height 0.5s ease' }} />
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(10px)' }}>
        <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>🕐 When You See Signs</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {Object.entries(timeSlots).map(([slot, count]) => {
            const icons: Record<string, string> = { morning: '🌅', afternoon: '☀️', evening: '🌆', night: '🌙' };
            const colors: Record<string, string> = { morning: '#f6ad55', afternoon: '#c9a84c', evening: '#9b59b6', night: '#3498db' };
            return (
              <div key={slot} style={{ textAlign: 'center', padding: '0.75rem 0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{icons[slot]}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: colors[slot] }}>{count}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'capitalize' }}>{slot}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
