'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_notifications'

interface NotifSettings {
  dailyReminder: boolean
  reminderTime: string
  matchAlerts: boolean
  streakReminder: boolean
  moonPhaseAlerts: boolean
  weeklyReport: boolean
  newMatchMessage: boolean
}

const DEFAULTS: NotifSettings = {
  dailyReminder: true,
  reminderTime: '09:00',
  matchAlerts: true,
  streakReminder: true,
  moonPhaseAlerts: false,
  weeklyReport: true,
  newMatchMessage: true,
}

const NOTIF_ITEMS = [
  { key: 'dailyReminder', emoji: '☀️', title: 'Daily Angel Number Reminder', desc: 'Gentle nudge to log your numbers each day' },
  { key: 'streakReminder', emoji: '🔥', title: 'Streak Protection', desc: 'Alert before your streak is about to break' },
  { key: 'matchAlerts', emoji: '✨', title: 'New Soul Match', desc: 'When someone syncs with your angel numbers' },
  { key: 'newMatchMessage', emoji: '💬', title: 'Match Messages', desc: 'When a matched soul sends you a message' },
  { key: 'weeklyReport', emoji: '✶', title: 'Weekly Cosmic Synthesis', desc: 'Your weekly angel number pattern report' },
  { key: 'moonPhaseAlerts', emoji: '🌙', title: 'Moon Phase Alerts', desc: 'New moon, full moon, and eclipse notifications' },
]

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotifSettings>(DEFAULTS)
  const [saved, setSaved] = useState(false)
  const [permGranted, setPermGranted] = useState<boolean|null>(null)

  useEffect(() => {
    const s = localStorage.getItem(KEY)
    if (s) setSettings({ ...DEFAULTS, ...JSON.parse(s) })
    if ('Notification' in window) {
      setPermGranted(Notification.permission === 'granted')
    }
  }, [])

  function toggle(key: keyof NotifSettings) {
    setSettings(s => ({ ...s, [key]: !s[key] }))
  }

  function save() {
    localStorage.setItem(KEY, JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function requestPermission() {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermGranted(result === 'granted')
      if (result === 'granted') {
        new Notification('SynchroSoul ✨', { body: 'Notifications enabled! The universe will reach you here.', icon: '/manifest.json' })
      }
    }
  }

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Notifications</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Stay connected to your cosmic journey</p>
      </div>

      {/* Permission banner */}
      {permGranted === false && (
        <div style={{ ...card, padding: '1.1rem 1.25rem', marginBottom: '1.25rem', background: 'rgba(201,168,76,0.08)', borderColor: 'rgba(201,168,76,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔔</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#c9a84c', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>Enable Push Notifications</div>
              <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem' }}>Allow SynchroSoul to send you cosmic reminders</div>
            </div>
            <button onClick={requestPermission} style={{ padding: '0.4rem 0.875rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Enable</button>
          </div>
        </div>
      )}

      {permGranted === true && (
        <div style={{ ...card, padding: '0.75rem 1.1rem', marginBottom: '1.25rem', background: 'rgba(52,211,153,0.06)', borderColor: 'rgba(52,211,153,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#34d399', fontSize: '0.85rem' }}>✓</span>
            <span style={{ color: '#34d399', fontSize: '0.8rem' }}>Push notifications enabled</span>
          </div>
        </div>
      )}

      {/* Reminder time */}
      {settings.dailyReminder && (
        <div style={{ ...card, padding: '1.1rem 1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.1rem' }}>⏰</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>Daily Reminder Time</div>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem' }}>When should we remind you to log?</div>
            </div>
            <input type='time' value={settings.reminderTime} onChange={e => setSettings(s => ({ ...s, reminderTime: e.target.value }))} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.2)', borderRadius: '0.5rem', color: 'rgba(220,200,255,0.9)', padding: '0.35rem 0.5rem', fontSize: '0.85rem', cursor: 'pointer' }} />
          </div>
        </div>
      )}

      {/* Toggle items */}
      <div style={{ ...card, overflow: 'hidden', marginBottom: '1.25rem' }}>
        {NOTIF_ITEMS.map((item, i) => (
          <div key={item.key} style={{ padding: '1rem 1.25rem', borderBottom: i < NOTIF_ITEMS.length - 1 ? '1px solid rgba(200,180,255,0.06)' : 'none', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{item.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.15rem' }}>{item.title}</div>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem' }}>{item.desc}</div>
            </div>
            <button onClick={() => toggle(item.key as keyof NotifSettings)} style={{ width: '2.75rem', height: '1.5rem', borderRadius: '2rem', background: settings[item.key as keyof NotifSettings] ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.06)', border: settings[item.key as keyof NotifSettings] ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: settings[item.key as keyof NotifSettings] ? 'calc(100% - 1.1rem)' : '0.15rem', width: '1.1rem', height: '1.1rem', borderRadius: '50%', background: settings[item.key as keyof NotifSettings] ? '#a78bfa' : 'rgba(200,180,255,0.3)', transition: 'all 0.2s' }} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={save} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.875rem', background: saved ? 'rgba(52,211,153,0.2)' : 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(201,168,76,0.2))', border: saved ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(167,139,250,0.3)', color: saved ? '#34d399' : 'rgba(220,200,255,0.9)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}>
        {saved ? '✓ Saved!' : 'Save Preferences'}
      </button>
    </div>
  )
}