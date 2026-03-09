'use client';
import { useState } from 'react';

const SAMPLE = [
  { id: '1', emoji: '💫', title: 'New Sync Match!', body: 'Someone just logged 1111 — your sync score is 94%', time: Date.now() - 300000, read: false, color: '#c9a84c' },
  { id: '2', emoji: '🔥', title: '3-Day Streak!', body: 'You have logged angel numbers 3 days in a row. Keep going!', time: Date.now() - 3600000, read: false, color: '#f59e0b' },
  { id: '3', emoji: '✨', title: 'Daily Guidance Ready', body: 'Your angel message for today is waiting', time: Date.now() - 7200000, read: true, color: '#a78bfa' },
  { id: '4', emoji: '🌕', title: 'Full Moon Tonight', body: 'Charge your crystals and set your release intentions', time: Date.now() - 86400000, read: true, color: '#f472b6' },
  { id: '5', emoji: '🔢', title: 'Personal Year Insight', body: 'You are in a Personal Year 7 — a year of deep spiritual growth', time: Date.now() - 172800000, read: true, color: '#22d3ee' },
  { id: '6', emoji: '🔮', title: 'Oracle Message', body: 'The High Priestess has a message for you today', time: Date.now() - 259200000, read: true, color: '#8b5cf6' },
];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(SAMPLE);
  const [filter, setFilter] = useState('all');

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead = (id: string) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const remove = (id: string) => setNotifs(n => n.filter(x => x.id !== id));

  const unread = notifs.filter(n => !n.read).length;
  const filtered = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

  const fmt = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'Cormorant Garamond, serif' }}>Notifications</h1>
          {unread > 0 && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', marginTop: '0.15rem' }}>{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '999px', padding: '0.4rem 0.875rem', cursor: 'pointer', color: '#a78bfa', fontSize: '0.75rem', fontWeight: 600 }}>Mark all read</button>
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {['all', 'unread'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.35rem 0.875rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: filter === f ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: filter === f ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(255,255,255,0.08)', color: filter === f ? '#a78bfa' : 'rgba(255,255,255,0.4)' }}>
            {f === 'all' ? 'All' : `Unread${unread > 0 ? ` (${unread})` : ''}`}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✨</div>
            <p>All caught up! No {filter === 'unread' ? 'unread ' : ''}notifications.</p>
          </div>
        ) : filtered.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)} style={{ background: n.read ? 'rgba(8,6,28,0.88)' : 'rgba(8,6,28,0.95)', borderRadius: '1.25rem', border: n.read ? '1px solid rgba(255,255,255,0.07)' : `1px solid ${n.color}20`, padding: '1rem 1.25rem', backdropFilter: 'blur(12px)', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${n.color}15`, border: `1px solid ${n.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{n.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <p style={{ color: n.read ? 'rgba(255,255,255,0.7)' : '#fff', fontWeight: n.read ? 500 : 700, fontSize: '0.88rem' }}>{n.title}</p>
                  {!n.read && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: n.color, flexShrink: 0 }} />}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', lineHeight: 1.5 }}>{n.body}</p>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', marginTop: '0.35rem' }}>{fmt(n.time)}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); remove(n.id); }} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem', flexShrink: 0 }}>×</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
