'use client';
import { useState, useEffect } from 'react';
import { requestNotificationPermission, getNotificationPermission, savePushSettings, getPushSettings, scheduleDailyReminder, sendTestNotification, registerPushSubscription, unregisterPushSubscription } from '@/lib/push-notifications';
import { createClient } from '@/lib/supabase/client';

export default function PushNotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [enabled, setEnabled] = useState(false);
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
    const s = getPushSettings();
    setEnabled(s.enabled);
    setHour(s.hour);
    setMinute(s.minute);
  }, []);

  const handleEnable = async () => {
    const perm = await requestNotificationPermission();
    setPermission(perm);
    if (perm === 'granted') {
      setEnabled(true);
      savePushSettings({ enabled: true, hour, minute });
      scheduleDailyReminder(hour, minute);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      // Register Web Push subscription for Soul Twin alerts
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await registerPushSubscription(user.id);
      } catch {}
    }
  };

  const handleSave = () => {
    savePushSettings({ enabled, hour, minute });
    if (enabled && permission === 'granted') scheduleDailyReminder(hour, minute);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDisable = () => {
    setEnabled(false);
    savePushSettings({ enabled: false, hour, minute });
  };

  const timeLabel = `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;

  return (
    <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '1rem', padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.5rem' }}>🔔</span>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.9)' }}>Daily Reminders</div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(180,160,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Angel number check-ins</div>
        </div>
      </div>

      {permission === 'denied' && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.75rem', color: 'rgba(252,165,165,0.8)' }}>
          Notifications are blocked. Please enable them in your browser settings.
        </div>
      )}

      {permission !== 'granted' && permission !== 'denied' && (
        <button
          onClick={handleEnable}
          style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', border: 'none', borderRadius: '0.75rem', color: 'white', fontSize: '0.85rem', fontWeight: 600, padding: '0.75rem', cursor: 'pointer', marginBottom: '1rem' }}
        >
          Enable Notifications
        </button>
      )}

      {permission === 'granted' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(200,180,255,0.7)' }}>Daily reminder</span>
            <button
              onClick={enabled ? handleDisable : handleEnable}
              style={{
                width: '3rem', height: '1.6rem', borderRadius: '9999px', border: 'none', cursor: 'pointer',
                background: enabled ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(255,255,255,0.1)',
                position: 'relative', transition: 'all 0.2s',
              }}
            >
              <div style={{
                position: 'absolute', top: '0.2rem', width: '1.2rem', height: '1.2rem',
                borderRadius: '50%', background: 'white',
                left: enabled ? '1.6rem' : '0.2rem', transition: 'left 0.2s',
              }} />
            </button>
          </div>

          {enabled && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'rgba(180,160,255,0.5)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Reminder time</div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <select
                  value={hour}
                  onChange={e => setHour(Number(e.target.value))}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.5rem', color: 'rgba(220,200,255,0.9)', padding: '0.5rem', fontSize: '0.85rem' }}
                >
                  {Array.from({length:24},(_,i)=>i).map(h => (
                    <option key={h} value={h} style={{background:'#0a0520'}}>{String(h).padStart(2,'0')}:00</option>
                  ))}
                </select>
                <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem' }}>at</span>
                <select
                  value={minute}
                  onChange={e => setMinute(Number(e.target.value))}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.5rem', color: 'rgba(220,200,255,0.9)', padding: '0.5rem', fontSize: '0.85rem' }}
                >
                  {[0,15,30,45].map(m => (
                    <option key={m} value={m} style={{background:'#0a0520'}}>:{String(m).padStart(2,'0')}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleSave}
              style={{ flex: 1, background: saved ? 'rgba(74,222,128,0.15)' : 'rgba(167,139,250,0.1)', border: `1px solid ${saved ? 'rgba(74,222,128,0.3)' : 'rgba(167,139,250,0.2)'}`, borderRadius: '0.75rem', color: saved ? 'rgba(134,239,172,0.9)' : 'rgba(200,180,255,0.8)', fontSize: '0.8rem', padding: '0.6rem', cursor: 'pointer' }}
            >
              {saved ? '✓ Saved' : 'Save Settings'}
            </button>
            <button
              onClick={sendTestNotification}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '0.75rem', color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem', padding: '0.6rem 0.875rem', cursor: 'pointer' }}
            >
              Test
            </button>
          </div>
        </>
      )}
    </div>
  );
}
