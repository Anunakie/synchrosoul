'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'match' | 'milestone' | 'guidance' | 'reminder' | 'cosmic';
  title: string;
  body: string;
  href: string;
  emoji: string;
  color: string;
  time: string;
  read: boolean;
}

function generateNotifications(logs: any[], profile: any): Notification[] {
  const notes: Notification[] = [];
  const now = new Date();

  // Streak milestone
  const dates = [...new Set(logs.map((l: any) => new Date(l.createdAt).toDateString()))];
  if (dates.length >= 7) notes.push({ id: 'streak-7', type: 'milestone', title: '7-Day Streak! 🔥', body: 'You have logged angel numbers 7 days in a row. The universe is responding to your awareness.', href: '/dashboard/streak', emoji: '🔥', color: '#f97316', time: 'Today', read: false });
  if (dates.length >= 3) notes.push({ id: 'streak-3', type: 'milestone', title: '3-Day Streak Achieved', body: 'Three days of consistent logging. Your vibration is rising.', href: '/dashboard/streak', emoji: '✦', color: '#c9a84c', time: 'Yesterday', read: true });

  // First log
  if (logs.length >= 1) notes.push({ id: 'first-log', type: 'milestone', title: 'First Angel Number Logged', body: `You logged ${logs[logs.length-1]?.number} — your journey with the angels has begun.`, href: '/dashboard/journal', emoji: '🌟', color: '#c9a84c', time: logs.length > 0 ? new Date(logs[logs.length-1]?.createdAt).toLocaleDateString() : 'Recently', read: true });

  // Numerology profile
  if (profile) notes.push({ id: 'profile-complete', type: 'milestone', title: 'Cosmic Blueprint Unlocked', body: `Your Life Path ${profile.lifePath || ''} has been calculated. Explore your full soul report.`, href: '/dashboard/cosmic-report', emoji: '📜', color: '#a78bfa', time: 'This week', read: false });

  // Daily cosmic weather
  notes.push({ id: 'cosmic-today', type: 'cosmic', title: "Today's Cosmic Weather is Ready", body: 'Check the universal day number, moon phase, and your personal energy forecast.', href: '/dashboard/cosmic-weather', emoji: '🌌', color: '#60a5fa', time: 'Today', read: false });

  // Sync match
  notes.push({ id: 'sync-match', type: 'match', title: 'New Soul Sync Detected', body: '3 souls are seeing the same numbers as you in the last 24 hours. Check your matches.', href: '/dashboard/sync', emoji: '⟳', color: '#4ade80', time: '2 hours ago', read: false });

  // Oracle reminder
  notes.push({ id: 'oracle-reminder', type: 'reminder', title: 'Your Oracle Awaits', body: "You haven't consulted the Angel Oracle today. Your guides have a message for you.", href: '/dashboard/oracle', emoji: '◈', color: '#c9a84c', time: 'Today', read: true });

  // Guidance
  notes.push({ id: 'guidance-1', type: 'guidance', title: 'Angel Message: Trust the Timing', body: "The numbers you've been seeing point to divine orchestration. Everything is unfolding perfectly.", href: '/dashboard', emoji: '💫', color: '#f472b6', time: '3 hours ago', read: true });

  // 1111 portal
  const d = now.getDate() + now.getMonth() + 1;
  if (d % 11 === 0) notes.push({ id: 'portal-1111', type: 'cosmic', title: '1111 Portal Open Today', body: 'Numerological alignment creates a manifestation portal. Log your intentions now.', href: '/dashboard', emoji: '🌀', color: '#8b5cf6', time: 'Today', read: false });

  return notes.slice(0, 10);
}

const TYPE_COLORS: Record<string, string> = { match: '#4ade80', milestone: '#c9a84c', guidance: '#f472b6', reminder: '#60a5fa', cosmic: '#8b5cf6' };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    try {
      const logs = JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]');
      const profile = JSON.parse(localStorage.getItem('synchrosoul_numerology_profile') || 'null');
      const generated = generateNotifications(logs, profile);
      // Merge with any saved read states
      const saved: Record<string, boolean> = JSON.parse(localStorage.getItem('synchrosoul_notif_read') || '{}');
      setNotifications(generated.map(n => ({ ...n, read: saved[n.id] ?? n.read })));
    } catch {}
  }, []);

  const markRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      const readMap: Record<string, boolean> = {};
      updated.forEach(n => { readMap[n.id] = n.read; });
      try { localStorage.setItem('synchrosoul_notif_read', JSON.stringify(readMap)); } catch {}
      return updated;
    });
  };

  const markAllRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      const readMap: Record<string, boolean> = {};
      updated.forEach(n => { readMap[n.id] = true; });
      try { localStorage.setItem('synchrosoul_notif_read', JSON.stringify(readMap)); } catch {}
      return updated;
    });
  };

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', fontFamily: 'Cormorant Garamond, serif' }}>Notifications</h1>
          {unreadCount > 0 && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{unreadCount} unread messages</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '0.4rem 0.875rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', cursor: 'pointer' }}>Mark all read</button>
        )}
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['all', 'unread', 'match', 'milestone', 'cosmic', 'guidance'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.3rem 0.75rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.75rem',
            background: filter === f ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
            border: filter === f ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.07)',
            color: filter === f ? '#fff' : 'rgba(255,255,255,0.4)', textTransform: 'capitalize'
          }}>{f}</button>
        ))}
      </div>

      {/* Notifications list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔔</div>
            <p>No notifications here</p>
          </div>
        )}
        {filtered.map(n => (
          <Link key={n.id} href={n.href} onClick={() => markRead(n.id)} style={{
            background: n.read ? 'rgba(8,6,28,0.7)' : 'rgba(8,6,28,0.92)',
            borderRadius: '1.25rem',
            border: n.read ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${n.color}30`,
            padding: '1rem 1.125rem', textDecoration: 'none',
            display: 'flex', alignItems: 'flex-start', gap: '0.875rem',
            backdropFilter: 'blur(12px)', position: 'relative', overflow: 'hidden'
          }}>
            {!n.read && <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '7px', height: '7px', borderRadius: '50%', background: n.color, boxShadow: `0 0 8px ${n.color}` }} />}
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
              background: `${n.color}15`, border: `1px solid ${n.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
            }}>{n.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: n.read ? 'rgba(255,255,255,0.6)' : '#fff', fontWeight: n.read ? 400 : 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{n.title}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', lineHeight: 1.5 }}>{n.body}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                <span style={{ background: `${TYPE_COLORS[n.type]}15`, border: `1px solid ${TYPE_COLORS[n.type]}25`, borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.6rem', color: TYPE_COLORS[n.type], textTransform: 'capitalize' }}>{n.type}</span>
                <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>{n.time}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}