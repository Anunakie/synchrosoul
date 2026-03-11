'use client';
import { useState, useEffect } from 'react';
import { getNotificationsFromDB, markNotificationRead, markAllNotificationsRead, AppNotification } from '@/lib/supabase-db';
import { isAuthenticated } from '@/lib/supabase-db';

const SAMPLE: AppNotification[] = [
  { id: '1', type: 'sync_match', emoji: '💫', title: 'New Sync Match!', body: 'Someone just logged 1111 — your sync score is 94%', read: false, createdAt: new Date(Date.now() - 300000).toISOString(), color: '#c9a84c' },
  { id: '2', type: 'streak', emoji: '🔥', title: '3-Day Streak!', body: 'You have logged angel numbers 3 days in a row. Keep going!', read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), color: '#f59e0b' },
  { id: '3', type: 'guidance', emoji: '✨', title: 'Daily Guidance Ready', body: 'Your angel message for today is waiting', read: true, createdAt: new Date(Date.now() - 7200000).toISOString(), color: '#a78bfa' },
  { id: '4', type: 'moon', emoji: '🌕', title: 'Full Moon Tonight', body: 'Charge your crystals and set your release intentions', read: true, createdAt: new Date(Date.now() - 86400000).toISOString(), color: '#f472b6' },
  { id: '5', type: 'oracle', emoji: '🔮', title: 'Oracle Message', body: 'The High Priestess has a message for you today', read: true, createdAt: new Date(Date.now() - 259200000).toISOString(), color: '#8b5cf6' },
];

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isReal, setIsReal] = useState(false);

  useEffect(() => {
    ;(async () => {
      try {
        const authed = await isAuthenticated();
        if (authed) {
          const real = await getNotificationsFromDB();
          if (real.length > 0) {
            setNotifs(real);
            setIsReal(true);
            setLoading(false);
            return;
          }
        }
      } catch {}
      setNotifs(SAMPLE);
      setLoading(false);
    })();
  }, []);

  const markRead = async (id: string) => {
    setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
    if (isReal) await markNotificationRead(id);
  };

  const markAll = async () => {
    setNotifs(n => n.map(x => ({ ...x, read: true })));
    if (isReal) await markAllNotificationsRead();
  };

  const remove = (id: string) => setNotifs(n => n.filter(x => x.id !== id));

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'sync') return n.type === 'sync_match';
    return true;
  });

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem 6rem', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>
            Notifications
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
            {unreadCount > 0 ? unreadCount + ' unread messages' : 'All caught up ✨'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAll}
            style={{ padding: '0.4rem 0.9rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: 'rgba(201,168,76,0.15)', color: '#c9a84c', fontSize: '0.8rem', fontWeight: 600 }}>
            Mark all read
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[['all','All'],['unread','Unread'],['sync','Sync Matches']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ padding: '0.35rem 0.9rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
              fontSize: '0.78rem', fontWeight: 600,
              background: filter === val ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.07)',
              color: filter === val ? '#c9a84c' : 'rgba(255,255,255,0.5)' }}>
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '2rem' }}>✨</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem',
          background: 'rgba(8,6,28,0.7)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💫</div>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>No notifications yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(n => (
            <div key={n.id} onClick={() => markRead(n.id)}
              style={{ background: n.read ? 'rgba(8,6,28,0.7)' : 'rgba(8,6,28,0.92)',
                border: n.read ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(201,168,76,0.25)',
                borderRadius: '16px', padding: '1rem', cursor: 'pointer',
                backdropFilter: 'blur(12px)', transition: 'all 0.2s',
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: n.color + '22', border: '1px solid ' + n.color + '44',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                {n.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span style={{ color: n.read ? 'rgba(255,255,255,0.7)' : '#fff', fontWeight: n.read ? 500 : 700,
                    fontSize: '0.9rem' }}>{n.title}</span>
                  {!n.read && <span style={{ width: '8px', height: '8px', borderRadius: '50%',
                    background: n.color, flexShrink: 0, boxShadow: '0 0 6px ' + n.color }} />}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', margin: '0.2rem 0 0', lineHeight: 1.4 }}>{n.body}</p>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{timeAgo(n.createdAt)}</span>
              </div>
              <button onClick={e => { e.stopPropagation(); remove(n.id); }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)',
                  cursor: 'pointer', fontSize: '1rem', padding: '0.2rem', flexShrink: 0 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
