'use client';
import { useState, useEffect, useRef } from 'react';
import { getNotificationsFromDB, markAllNotificationsRead, AppNotification } from '@/lib/supabase-db';
import { isAuthenticated } from '@/lib/supabase-db';

function getNotifIcon(type: string) {
  switch (type) {
    case 'soul_twin': return '✨';
    case 'match': return '💞';
    case 'message': return '💬';
    case 'sync': return '⟳';
    default: return '✦';
  }
}

function getNotifColor(type: string) {
  switch (type) {
    case 'soul_twin': return '#c9a84c';
    case 'match': return '#f472b6';
    case 'message': return '#60a5fa';
    default: return '#a78bfa';
  }
}

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const mounted = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mounted.current = true;
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'default') {
        setTimeout(() => { if (mounted.current) setShowPrompt(true); }, 3000);
      }
    }
    loadNotifications();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    return () => { mounted.current = false; };
  }, []);

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const loadNotifications = async () => {
    try {
      const authed = await isAuthenticated();
      if (!authed) return;
      const notifs = await getNotificationsFromDB();
      if (mounted.current) {
        setNotifications(notifs.slice(0, 20));
        setUnread(notifs.filter(n => !n.read).length);
      }
    } catch {}
  };

  const handleOpen = async () => {
    setOpen(o => !o);
    if (!open && unread > 0) {
      try {
        await markAllNotificationsRead();
        setUnread(0);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } catch {}
    }
  };

  const requestPermission = async () => {
    setShowPrompt(false);
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      new Notification('SynchroSoul', {
        body: 'You will now receive cosmic sync alerts!',
        icon: '/icon-192.png',
      });
    }
  };

  return (
    <>
      {/* Bell Button */}
      <div ref={panelRef} style={{ position: 'relative' }}>
        <button
          onClick={handleOpen}
          style={{
            position: 'relative', background: 'none', border: 'none',
            cursor: 'pointer', padding: '0.4rem', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          aria-label="Notifications"
        >
          <span style={{ fontSize: '1.4rem' }}>🔔</span>
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: 0, right: 0,
              background: '#f472b6', color: '#fff',
              borderRadius: '50%', fontSize: '0.65rem',
              width: '1.1rem', height: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700,
            }}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* Notification Panel */}
        {open && (
          <div style={{
            position: 'absolute', right: 0, top: '110%',
            width: '320px', maxHeight: '400px', overflowY: 'auto',
            background: 'rgba(15,10,40,0.97)',
            border: '1px solid rgba(167,139,250,0.3)',
            borderRadius: '1rem', zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
          }}>
            <div style={{
              padding: '1rem', borderBottom: '1px solid rgba(167,139,250,0.2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.9rem' }}>
                ✨ Cosmic Alerts
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                ×
              </button>
            </div>

            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💫</div>
                <div style={{ fontSize: '0.85rem' }}>No cosmic alerts yet</div>
              </div>
            ) : (
              notifications.map(notif => (
                <div key={notif.id} style={{
                  padding: '0.85rem 1rem',
                  borderBottom: '1px solid rgba(167,139,250,0.1)',
                  background: notif.read ? 'transparent' : 'rgba(167,139,250,0.05)',
                  display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: '1.2rem', color: getNotifColor(notif.type) }}>
                    {getNotifIcon(notif.type)}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#e2d9f3', fontSize: '0.85rem', fontWeight: notif.read ? 400 : 600 }}>
                      {notif.title}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                      {notif.body}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.72rem', marginTop: '0.3rem' }}>
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {!notif.read && (
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#a78bfa', flexShrink: 0, marginTop: '4px',
                    }} />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Push Permission Prompt */}
      {showPrompt && permission === 'default' && (
        <div style={{
          position: 'fixed', bottom: '5rem', right: '1rem',
          background: 'rgba(15,10,40,0.97)',
          border: '1px solid rgba(167,139,250,0.4)',
          borderRadius: '1rem', padding: '1rem 1.25rem',
          zIndex: 999, maxWidth: '280px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ color: '#a78bfa', fontWeight: 700, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
            ✨ Soul Twin Alerts
          </div>
          <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
            Get notified when someone logs the same angel number as you!
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={requestPermission}
              style={{
                flex: 1, padding: '0.4rem 0.75rem',
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                border: 'none', borderRadius: '0.5rem',
                color: '#fff', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600,
              }}
            >
              Enable
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              style={{
                padding: '0.4rem 0.75rem',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.5rem',
                color: '#9ca3af', fontSize: '0.8rem', cursor: 'pointer',
              }}
            >
              Later
            </button>
          </div>
        </div>
      )}
    </>
  );
}
