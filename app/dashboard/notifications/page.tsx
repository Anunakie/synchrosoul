'use client'
import { useState, useEffect } from 'react'

const NOTIF_KEY = 'synchrosoul_notifications'

interface NotifSettings {
  dailyGuidance: boolean
  dailyTime: string
  moonPhase: boolean
  streakReminder: boolean
  streakTime: string
  journalReminder: boolean
  journalTime: string
  gratitudeReminder: boolean
  gratitudeTime: string
  syncMatches: boolean
  newBadges: boolean
}

const DEFAULTS: NotifSettings = {
  dailyGuidance: true,
  dailyTime: '08:00',
  moonPhase: true,
  streakReminder: true,
  streakTime: '20:00',
  journalReminder: false,
  journalTime: '21:00',
  gratitudeReminder: true,
  gratitudeTime: '09:00',
  syncMatches: true,
  newBadges: true,
}

function load(): NotifSettings {
  if (typeof window === 'undefined') return DEFAULTS
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(NOTIF_KEY) || '{}') } } catch { return DEFAULTS }
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotifSettings>(DEFAULTS)
  const [saved, setSaved] = useState(false)
  const [permission, setPermission] = useState<string>('default')
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.25rem', marginBottom: '0.875rem' }

  useEffect(() => {
    setSettings(load())
    if ('Notification' in window) setPermission(Notification.permission)
  }, [])

  function update(key: keyof NotifSettings, value: any) {
    setSettings(s => ({ ...s, [key]: value }))
  }

  function saveSettings() {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function requestPermission() {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
    }
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)} style={{ width: '2.75rem', height: '1.5rem', borderRadius: '9999px', border: 'none', background: value ? 'rgba(167,139,250,0.6)' : 'rgba(200,180,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '0.15rem', left: value ? '1.35rem' : '0.15rem', width: '1.2rem', height: '1.2rem', borderRadius: '50%', background: value ? '#a78bfa' : 'rgba(180,160,255,0.3)', transition: 'all 0.2s' }} />
    </button>
  )

  const Row = ({ label, desc, value, onChange, time, timeKey }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void; time?: string; timeKey?: keyof NotifSettings }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(200,180,255,0.05)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', marginBottom: '0.15rem' }}>{label}</div>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem' }}>{desc}</div>
        {value && time !== undefined && timeKey && (
          <input type='time' value={time} onChange={e => update(timeKey, e.target.value)} style={{ marginTop: '0.5rem', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.5rem', padding: '0.3rem 0.6rem', color: 'rgba(200,180,255,0.7)', fontSize: '0.78rem', outline: 'none' }} />
        )}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  )

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Notifications</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Stay aligned with gentle cosmic reminders</p>
      </div>

      {permission !== 'granted' && (
        <div style={{ ...card, borderColor: 'rgba(201,168,76,0.25)', background: 'rgba(201,168,76,0.06)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔔</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#c9a84c', fontSize: '0.85rem', marginBottom: '0.2rem' }}>Enable Browser Notifications</div>
              <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem' }}>Allow notifications to receive cosmic reminders</div>
            </div>
            <button onClick={requestPermission} style={{ padding: '0.4rem 0.875rem', borderRadius: '2rem', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.12)', color: '#c9a84c', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Enable</button>
          </div>
        </div>
      )}

      <div style={card}>
        <div style={{ color: '#c9a84c', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Daily Practice</div>
        <Row label='Daily Guidance' desc='Morning cosmic message based on your numbers' value={settings.dailyGuidance} onChange={v => update('dailyGuidance', v)} time={settings.dailyTime} timeKey='dailyTime' />
        <Row label='Gratitude Reminder' desc='Gentle nudge for your daily gratitude practice' value={settings.gratitudeReminder} onChange={v => update('gratitudeReminder', v)} time={settings.gratitudeTime} timeKey='gratitudeTime' />
        <Row label='Journal Reminder' desc='Reminder to log any angel numbers you saw' value={settings.journalReminder} onChange={v => update('journalReminder', v)} time={settings.journalTime} timeKey='journalTime' />
        <Row label='Streak Reminder' desc='Keep your daily logging streak alive' value={settings.streakReminder} onChange={v => update('streakReminder', v)} time={settings.streakTime} timeKey='streakTime' />
      </div>

      <div style={card}>
        <div style={{ color: '#a78bfa', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Cosmic Events</div>
        <Row label='Moon Phase Changes' desc='Notified at each new lunar phase' value={settings.moonPhase} onChange={v => update('moonPhase', v)} />
        <Row label='New Sync Matches' desc='When someone shares your angel numbers' value={settings.syncMatches} onChange={v => update('syncMatches', v)} />
        <Row label='Badge Unlocked' desc='Celebrate your spiritual milestones' value={settings.newBadges} onChange={v => update('newBadges', v)} />
      </div>

      <button onClick={saveSettings} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.875rem', border: '1px solid rgba(167,139,250,0.3)', background: saved ? 'rgba(74,222,128,0.12)' : 'rgba(167,139,250,0.12)', color: saved ? '#4ade80' : '#a78bfa', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s' }}>
        {saved ? '✓ Settings Saved' : 'Save Preferences'}
      </button>
    </div>
  )
}
