'use client';
import { useState, useEffect } from 'react';

interface AngelLog {
  id: string;
  number: string;
  thought?: string;
  screenshotUrl?: string;
  verified?: boolean;
  createdAt: string;
}

const ANGEL_COLORS: Record<string, string> = {
  '111': '#f59e0b', '1111': '#f59e0b', '222': '#22c55e', '2222': '#22c55e',
  '333': '#f97316', '3333': '#f97316', '444': '#22c55e', '4444': '#22c55e',
  '555': '#8b5cf6', '5555': '#8b5cf6', '666': '#ef4444', '777': '#c9a84c',
  '7777': '#c9a84c', '888': '#c9a84c', '8888': '#c9a84c', '999': '#6366f1',
  '9999': '#6366f1', '1212': '#60a5fa', '1234': '#10b981',
};

const MEANINGS: Record<string, string> = {
  '111': 'New beginnings, manifestation portal open',
  '1111': 'Powerful manifestation gateway, alignment',
  '222': 'Balance, trust, divine timing',
  '333': 'Ascended Masters present, creativity',
  '444': 'Angelic protection, you are not alone',
  '555': 'Major change incoming, transformation',
  '777': 'Divine luck, spiritual awakening',
  '888': 'Infinite abundance, financial flow',
  '999': 'Completion, release, new cycle beginning',
  '1212': 'Soul mission alignment, stay positive',
};

const getColor = (num: string) => ANGEL_COLORS[num] || '#a78bfa';
const getMeaning = (num: string) => MEANINGS[num] || 'A sacred message from the universe';

export default function TimelinePage() {
  const [logs, setLogs] = useState<AngelLog[]>([]);
  const [filter, setFilter] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('angel_logs') || '[]');
      setLogs(saved.sort((a: AngelLog, b: AngelLog) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {}
  }, []);

  const filtered = filter ? logs.filter(l => l.number.includes(filter)) : logs;

  // Group by date
  const grouped: Record<string, AngelLog[]> = {};
  filtered.forEach(l => {
    const d = new Date(l.createdAt);
    const key = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(l);
  });

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'Cormorant Garamond, serif' }}>Sacred Timeline</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Your complete angel number journey</p>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total Sightings', value: logs.length },
          { label: 'Unique Numbers', value: new Set(logs.map(l => l.number)).size },
          { label: 'Verified', value: logs.filter(l => l.verified).length },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.07)', padding: '0.875rem', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: '#a78bfa', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Cormorant Garamond, serif' }}>{s.value}</p>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.2rem' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <input value={filter} onChange={e => setFilter(e.target.value)}
        placeholder="Filter by number (e.g. 1111)..."
        style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '0.75rem 1.25rem', color: '#fff', fontSize: '0.9rem', outline: 'none', marginBottom: '1.5rem' }} />

      {logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>Your timeline is empty</p>
          <p style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>Start logging angel numbers to build your sacred timeline</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, dayLogs]) => (
          <div key={date} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{date}</span>
              <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            <div style={{ position: 'relative', paddingLeft: '1.5rem' }}>
              {/* Timeline line */}
              <div style={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.06)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {dayLogs.map(log => {
                  const color = getColor(log.number);
                  const isExp = expanded === log.id;
                  return (
                    <div key={log.id} style={{ position: 'relative' }}>
                      {/* Timeline dot */}
                      <div style={{ position: 'absolute', left: '-1.5rem', top: '1rem', width: '10px', height: '10px', borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}60`, border: `2px solid ${color}40` }} />

                      <div onClick={() => setExpanded(isExp ? null : log.id)} style={{
                        background: isExp ? `${color}10` : 'rgba(8,6,28,0.88)',
                        borderRadius: '1.25rem',
                        border: isExp ? `1px solid ${color}25` : '1px solid rgba(255,255,255,0.07)',
                        padding: '0.875rem 1rem', cursor: 'pointer', backdropFilter: 'blur(12px)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ background: `${color}15`, border: `1px solid ${color}25`, borderRadius: '0.5rem', padding: '0.25rem 0.6rem', fontWeight: 800, color, fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', flexShrink: 0 }}>{log.number}</div>
                          <div style={{ flex: 1 }}>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.4 }}>{log.thought || getMeaning(log.number)}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                            {log.verified && <span style={{ fontSize: '0.7rem' }}>✅</span>}
                            <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}>{relativeTime(log.createdAt)}</span>
                          </div>
                        </div>

                        {isExp && (
                          <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '0.5rem' }}>{getMeaning(log.number)}</p>
                            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                            {log.screenshotUrl && (
                              <img src={log.screenshotUrl} alt="proof" style={{ marginTop: '0.75rem', borderRadius: '0.75rem', maxWidth: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}