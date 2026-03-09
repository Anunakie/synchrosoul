'use client'
import { useState, useEffect } from 'react'
import { getSettings, saveSettings, DEFAULT_SETTINGS, UserSettings } from '@/lib/settings'
import { useTheme, THEMES, AppTheme } from '@/lib/theme-context'

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => { setSettings(getSettings()) }, [])

  function update(path: string, value: any) {
    setSettings(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  function handleSave() {
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const card = {
    background: 'rgba(8,6,28,0.88)',
    border: '1px solid rgba(200,180,255,0.12)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '1rem',
    backdropFilter: 'blur(12px)',
  } as React.CSSProperties

  const label = {
    color: 'rgba(220,200,255,0.9)',
    fontSize: '0.85rem',
    fontWeight: 500,
    letterSpacing: '0.03em',
  } as React.CSSProperties

  const sublabel = {
    color: 'rgba(180,160,255,0.5)',
    fontSize: '0.72rem',
    marginTop: '0.15rem',
  } as React.CSSProperties

  const input = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(200,180,255,0.15)',
    borderRadius: '0.5rem',
    color: 'rgba(220,200,255,0.9)',
    padding: '0.5rem 0.75rem',
    fontSize: '0.85rem',
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties

  function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '2.8rem', height: '1.5rem', borderRadius: '9999px',
          background: value ? 'rgba(167,139,250,0.7)' : 'rgba(255,255,255,0.1)',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: '0.15rem',
          left: value ? '1.35rem' : '0.15rem',
          width: '1.2rem', height: '1.2rem',
          borderRadius: '50%', background: 'white',
          transition: 'left 0.2s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    )
  }

  function Row({ children }: { children: React.ReactNode }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(200,180,255,0.06)' }}>
        {children}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', marginBottom: '0.25rem', fontWeight: 400 }}>Settings</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Customize your SynchroSoul experience</p>

      {/* Profile */}
      <div style={card}>
        <h2 style={{ color: '#c9a84c', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>✦ Profile</h2>
        <div style={{ marginBottom: '1rem' }}>
          <div style={label}>Display Name</div>
          <div style={sublabel}>Shown to matched souls</div>
          <input style={{ ...input, marginTop: '0.5rem' }} value={settings.displayName} onChange={e => update('displayName', e.target.value)} placeholder="Your cosmic name..." />
        </div>
        <div>
          <div style={label}>Birthdate</div>
          <div style={sublabel}>Used for numerology calculations</div>
          <input type="date" style={{ ...input, marginTop: '0.5rem' }} value={settings.birthdate} onChange={e => update('birthdate', e.target.value)} />
        </div>
      </div>

      {/* Background Theme */}
      <div style={card}>
        <h2 style={{ color: '#c9a84c', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>🎨 Background Theme</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as AppTheme)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem',
                padding: '0.6rem 0.8rem', borderRadius: '0.75rem', cursor: 'pointer',
                border: theme === t.id ? '1px solid rgba(201,168,76,0.8)' : '1px solid rgba(200,180,255,0.12)',
                background: theme === t.id ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.03)',
                color: theme === t.id ? '#c9a84c' : 'rgba(200,180,255,0.6)',
                fontSize: '0.75rem', fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '0.5rem', overflow: 'hidden',
                backgroundImage: t.thumbnail ? `url(${t.thumbnail})` : undefined,
                backgroundSize: 'cover', backgroundPosition: 'center',
                background: t.thumbnail ? undefined : 'radial-gradient(ellipse at 30% 40%, rgba(120,60,200,0.9) 0%, rgba(20,10,60,1) 70%)',
                border: '1px solid rgba(255,255,255,0.1)',
              }} />
              {t.emoji} {t.label}
              {theme === t.id && <span style={{ fontSize: '0.6rem', color: '#c9a84c' }}>Active</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div style={card}>
        <h2 style={{ color: '#c9a84c', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>🔔 Notifications</h2>
        <Row>
          <div><div style={label}>Daily Reminder</div><div style={sublabel}>Remind me to log angel numbers</div></div>
          <Toggle value={settings.notifications.dailyReminder} onChange={v => update('notifications.dailyReminder', v)} />
        </Row>
        {settings.notifications.dailyReminder && (
          <div style={{ padding: '0.5rem 0 0.75rem' }}>
            <div style={label}>Reminder Time</div>
            <input type="time" style={{ ...input, marginTop: '0.4rem', width: 'auto' }} value={settings.notifications.reminderTime} onChange={e => update('notifications.reminderTime', e.target.value)} />
          </div>
        )}
        <Row>
          <div><div style={label}>Sync Alerts</div><div style={sublabel}>Notify when a soul syncs with you</div></div>
          <Toggle value={settings.notifications.syncAlerts} onChange={v => update('notifications.syncAlerts', v)} />
        </Row>
        <Row>
          <div><div style={label}>Weekly Report</div><div style={sublabel}>Your cosmic summary every Sunday</div></div>
          <Toggle value={settings.notifications.weeklyReport} onChange={v => update('notifications.weeklyReport', v)} />
        </Row>
      </div>

      {/* Privacy */}
      <div style={card}>
        <h2 style={{ color: '#c9a84c', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>🔒 Privacy</h2>
        <Row>
          <div><div style={label}>Show Profile</div><div style={sublabel}>Allow others to view your profile</div></div>
          <Toggle value={settings.privacy.showProfile} onChange={v => update('privacy.showProfile', v)} />
        </Row>
        <Row>
          <div><div style={label}>Show Numbers</div><div style={sublabel}>Display your logged numbers publicly</div></div>
          <Toggle value={settings.privacy.showNumbers} onChange={v => update('privacy.showNumbers', v)} />
        </Row>
        <Row>
          <div><div style={label}>Allow Matching</div><div style={sublabel}>Appear in sync matching results</div></div>
          <Toggle value={settings.privacy.allowMatching} onChange={v => update('privacy.allowMatching', v)} />
        </Row>
      </div>

      {/* App */}
      <div style={card}>
        <h2 style={{ color: '#c9a84c', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>⚙️ App</h2>
        <Row>
          <div><div style={label}>Sound Effects</div><div style={sublabel}>Subtle tones when logging numbers</div></div>
          <Toggle value={settings.app.soundEffects} onChange={v => update('app.soundEffects', v)} />
        </Row>
        <Row>
          <div><div style={label}>Haptic Feedback</div><div style={sublabel}>Vibration on interactions</div></div>
          <Toggle value={settings.app.hapticFeedback} onChange={v => update('app.hapticFeedback', v)} />
        </Row>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        style={{
          width: '100%', padding: '0.9rem',
          background: saved ? 'rgba(100,200,120,0.2)' : 'rgba(167,139,250,0.15)',
          border: saved ? '1px solid rgba(100,200,120,0.5)' : '1px solid rgba(167,139,250,0.4)',
          borderRadius: '0.75rem', cursor: 'pointer',
          color: saved ? 'rgba(100,220,130,0.9)' : 'rgba(200,180,255,0.9)',
          fontSize: '0.9rem', fontFamily: 'inherit', letterSpacing: '0.05em',
          transition: 'all 0.3s',
        }}
      >
        {saved ? '✓ Saved to your cosmos' : 'Save Settings'}
      </button>
    </div>
  )
}
