'use client';
import { useState, useEffect, useRef } from 'react';
import { getNotificationsFromDB, markAllNotificationsRead, AppNotification } from '@/lib/supabase-db';
import { isAuthenticated } from '@/lib/supabase-db';

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [showPrompt, setShowPrompt] = useState(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'default') {
        setTimeout(() => { if (mounted.current) setShowPrompt(true); }, 3000);
      }
    }
    loadUnread();
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    return () => { mounted.current = false; };
  }, []);

  const loadUnread = async () => {
    try {
      const authed = await isAuthenticated();
      if (!authed) return;
      const notifs = await getNotificationsFromDB();
      if (mounted.current) setUnread(notifs.filter(n => !n.read).length);
    } catch {}
  };

  const requestPermission = async () => {
    setShowPrompt(false);
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      new Notification('SynchroSoul ✨', {
        body: 'You will now receive cosmic sync alerts!',
        icon: '/icon-192.png',
      });
    }
  };

  return (
    <>
      {showPrompt && permission === 'default' && (
        <div style={{ position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(8,6,28,0.95)', border: '1px solid rgba(201,168,76,0.4)',
          borderRadius: '16px', padding: '1rem 1.25rem', zIndex: 1000, maxWidth: '320px', width: '90%',
          backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '0.75rem', textAlign: 'center' }}>
            ✨ Get notified when someone syncs with your angel numbers!
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={requestPermission}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '10px', border: 'none',
                background: 'rgba(201,168,76,0.3)', color: '#c9a84c', fontWeight: 700,
                cursor: 'pointer', fontSize: '0.85rem' }}>Enable ✦</button>
            <button onClick={() => setShowPrompt(false)}
              style={{ padding: '0.5rem 0.75rem', borderRadius: '10px', border: 'none',
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)',
                cursor: 'pointer', fontSize: '0.85rem' }}>Later</button>
          </div>
        </div>
      )}
    </>
  );
}
