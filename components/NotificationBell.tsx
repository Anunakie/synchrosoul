'use client';
import { useState, useEffect, useRef } from 'react';
import { getNotificationsFromDB, markAllNotificationsRead, AppNotification, isAuthenticated } from '@/lib/supabase-db';
import { registerPushSubscription } from '@/lib/push-notifications';
import { createClient } from '@/lib/supabase/client';

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
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen && unread > 0) {
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
      new Notification('SynchroSoul ✨', {
        body: 'Soul Twin alerts are now active! You will be notified when someone logs your number.',
        icon: '/icon-192.png',
      });
      // Register Web Push subscription for Soul Twin alerts
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await registerPushSubscription(user.id);
      } catch {}
    }
  };

  return (
    <>
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
          <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>🔔</span>
          {unread > 0 && (
            <span style={{
              position: 'absolute', top: '0', right: '0',
              background: '#c9a84c', color: '#050510',
              borderRadius: '9999px', fontSize: '0.6rem', fontWeight: 700,
              minWidth: '1.1rem', height: '1.1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 0.2rem',
            }}>{unread > 9 ? '9+' : unread}</span>
          )}
        </button>

        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
            width: '320px', maxHeight: '420px', overflowY: 'auto',
            background: 'rgba(8,6,28,0.97)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '1.25rem',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            zIndex: 200,
          }}>
            <div style={{
              padding: '1rem 1.25rem 0.75rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'rgba(220,200,255,0.9)' }}>
                Notifications
              </span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(180,160,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {notifications.length} recent
              </span>
            </div>

            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(180,160,255,0.35)', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✦</div>
                No notifications yet
              </div>
            ) : (
              <div>
                {notifications.map((n, i) => {
                  const isSoulTwin = (n.type as string) === 'soul_twin';
                  const color = getNotifColor(n.type || '');
                  const icon = getNotifIcon(n.type || '');
                  return (
                    <div key={n.id || i} style={{
                      padding: '0.85rem 1.25rem',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: isSoulTwin
                        ? 'rgba(201,168,76,0.05)'
                        : (!n.read ? 'rgba(167,139,250,0.04)' : 'transparent'),
                      display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                    }}>
                      <div style={{
                        width: '2rem', height: '2rem', borderRadius: '50%', flexShrink: 0,
                        background: `${color}18`,
                        border: `1px solid ${color}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem',
                      }}>{icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '0.8rem', fontWeight: 600,
                          color: isSoulTwin ? '#c9a84c' : 'rgba(220,200,255,0.85)',
                          marginBottom: '0.2rem',
                        }}>{n.title}</div>
                        <div style={{
                          fontSize: '0.72rem', color: 'rgba(180,160,255,0.55)',
                          lineHeight: 1.4,
                        }}>{n.body}</div>
                        {n.createdAt && (
                          <div style={{ fontSize: '0.62rem', color: 'rgba(180,160,255,0.3)', marginTop: '0.3rem' }}>
                            {new Date(n.createdAt).toLocaleString()}
                          </div>
                        )}
                      </div>
                      {!n.read && (
                        <div style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: color, flexShrink: 0, marginTop: '0.4rem',
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showPrompt && permission === 'default' && (
        <div style={{
          position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(8,6,28,0.95)', border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: '16px', padding: '1rem 1.25rem', zIndex: 1000, maxWidth: '320px', width: '90%',
          backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '0.75rem', textAlign: 'center' }}>
            ✨ Get notified when someone syncs with your angel numbers!
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={requestPermission}
              style={{
                flex: 1, padding: '0.5rem', borderRadius: '10px', border: 'none',
                background: 'rgba(201,168,76,0.3)', color: '#c9a84c', fontWeight: 700,
                cursor: 'pointer', fontSize: '0.85rem',
              }}>Enable ✦</button>
            <button onClick={() => setShowPrompt(false)}
              style={{
                padding: '0.5rem 0.75rem', borderRadius: '10px', border: 'none',
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer', fontSize: '0.85rem',
              }}>Later</button>
          </div>
        </div>
      )}
    </>
  );
}