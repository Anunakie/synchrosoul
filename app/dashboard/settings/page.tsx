'use client'
import { useState, useEffect } from 'react'
import { getLogs } from '@/lib/storage'
import Link from 'next/link'

const SETTINGS_KEY = 'synchrosoul_settings'

interface Settings {
  dailyReminder: boolean
  reminderTime: string
  matchNotifications: boolean
  soundEffects: boolean
  hapticFeedback: boolean
  privateMode: boolean
  showStreak: boolean
  theme: string
}

const DEFAULTS: Settings = {
  dailyReminder: true,
  reminderTime: '09:00',
  matchNotifications: true,
  soundEffects: false,
  hapticFeedback: true,
  privateMode: false,
  showStreak: true,
  theme: 'starfield',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS)
  const [saved, setSaved] = useState(false)
  const [exportDone, setExportDone] = useState(false)
  const [clearConfirm, setClearConfirm] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem(SETTINGS_KEY)
    if (s) setSettings({ ...DEFAULTS, ...JSON.parse(s) })
  }, [])

  function update(key: keyof Settings, value: any) {
    const next = { ...settings, [key]: value }
    setSettings(next)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  function exportData() {
    const data = {
      logs: getLogs(),
      profile: localStorage.getItem('synchrosoul_profile'),
      dreams: localStorage.getItem('synchrosoul_dreams'),
      journal: localStorage.getItem('synchrosoul_logs'),
      affirmationFavs: localStorage.getItem('synchrosoul_affirmation_favs'),
      customAffirmations: localStorage.getItem('synchrosoul_custom_affirmations'),
      manifestations: localStorage.getItem('synchrosoul_manifestations'),
      gratitude: localStorage.getItem('synchrosoul_gratitude'),
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `synchrosoul-export-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setExportDone(true)
    setTimeout(() => setExportDone(false), 2000)
  }

  function clearAllData() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('synchrosoul'))
    keys.forEach(k => localStorage.removeItem(k))
    setClearConfirm(false)
    window.location.reload()
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
      <div onClick={() => onChange(!value)} style={{ width: '2.75rem', height: '1.5rem', borderRadius: '1rem', background: value ? '#a78bfa' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: '2px', left: value ? '1.35rem' : '2px', width: '1.1rem', height: '1.1rem', borderRadius: '50%', background: 'white', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
      </div>
    )
  }

  function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid rgba(200,180,255,0.06)' }}>
        <div style={{ flex: 1, paddingRight: '1rem' }}>
          <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.88rem' }}>{label}</div>
          {desc && <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', marginTop: '0.15rem' }}>{desc}</div>}
        </div>
        {children}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Settings</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Customize your cosmic experience</p>
        </div>
        {saved && <span style={{ color: '#34d399', fontSize: '0.78rem', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', borderRadius: '2rem', padding: '0.3rem 0.75rem' }}>✓ Saved</span>}
      </div>

      {/* Notifications */}
      <div style={{ ...card, padding: '0.25rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.875rem 0 0.25rem' }}>Notifications</div>
        <Row label="Daily Reminder" desc="Get a gentle nudge to log your numbers">
          <Toggle value={settings.dailyReminder} onChange={v => update('dailyReminder', v)} />
        </Row>
        {settings.dailyReminder && (
          <Row label="Reminder Time">
            <input type="time" value={settings.reminderTime} onChange={e => update('reminderTime', e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.5rem', padding: '0.35rem 0.6rem', color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', outline: 'none' }} />
          </Row>
        )}
        <Row label="Match Notifications" desc="When a new soul syncs with your numbers">
          <Toggle value={settings.matchNotifications} onChange={v => update('matchNotifications', v)} />
        </Row>
      </div>

      {/* Experience */}
      <div style={{ ...card, padding: '0.25rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.875rem 0 0.25rem' }}>Experience</div>
        <Row label="Sound Effects" desc="Subtle tones when logging numbers">
          <Toggle value={settings.soundEffects} onChange={v => update('soundEffects', v)} />
        </Row>
        <Row label="Haptic Feedback" desc="Vibration on interactions (mobile)">
          <Toggle value={settings.hapticFeedback} onChange={v => update('hapticFeedback', v)} />
        </Row>
        <Row label="Show Streak" desc="Display your daily streak on dashboard">
          <Toggle value={settings.showStreak} onChange={v => update('showStreak', v)} />
        </Row>
      </div>

      {/* Privacy */}
      <div style={{ ...card, padding: '0.25rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.875rem 0 0.25rem' }}>Privacy</div>
        <Row label="Private Mode" desc="Hide your profile from sync matching">
          <Toggle value={settings.privateMode} onChange={v => update('privateMode', v)} />
        </Row>
      </div>

      {/* Data */}
      <div style={{ ...card, padding: '0.25rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.875rem 0 0.25rem' }}>Your Data</div>
        <Row label="Export All Data" desc="Download your full spiritual journal as JSON">
          <button onClick={exportData} style={{ padding: '0.4rem 0.875rem', borderRadius: '0.625rem', background: exportDone ? 'rgba(52,211,153,0.15)' : 'rgba(167,139,250,0.12)', border: exportDone ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(167,139,250,0.25)', color: exportDone ? '#34d399' : '#a78bfa', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {exportDone ? '✓ Downloaded' : '↓ Export'}
          </button>
        </Row>
        <Row label="Clear All Data" desc="Permanently delete all local data">
          {clearConfirm
            ? <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={clearAllData} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>Confirm</button>
                <button onClick={() => setClearConfirm(false)} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.12)', color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem', cursor: 'pointer' }}>Cancel</button>
              </div>
            : <button onClick={() => setClearConfirm(true)} style={{ padding: '0.4rem 0.875rem', borderRadius: '0.625rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgba(239,68,68,0.7)', fontSize: '0.78rem', cursor: 'pointer' }}>Clear</button>
          }
        </Row>
      </div>

      {/* Upgrade CTA */}
      <Link href="/dashboard/upgrade" style={{ textDecoration: 'none' }}>
        <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '1.25rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.8rem' }}>👑</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#c9a84c', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.15rem' }}>Unlock Premium</div>
            <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem' }}>AI guidance, soul twin chat, full oracle readings</div>
          </div>
          <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: '1.2rem' }}>›</span>
        </div>
      </Link>

      <p style={{ textAlign: 'center', color: 'rgba(180,160,255,0.25)', fontSize: '0.7rem', marginTop: '1.5rem' }}>SynchroSoul v1.0 ✦ All data stored locally on your device</p>
    
      {/* Quick Links */}
      <div style={{ ...card, overflow: 'hidden', marginBottom: '1.25rem' }}>
        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid rgba(200,180,255,0.06)' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Quick Links</div>
        </div>
        {[
          { href: '/dashboard/stats', emoji: '📊', label: 'Your Stats & Heatmap' },
          { href: '/dashboard/notifications', emoji: '🔔', label: 'Notification Preferences' },
          { href: '/dashboard/personal-year', emoji: '📅', label: 'Personal Year Calculator' },
          { href: '/dashboard/karmic-debt', emoji: '⚡', label: 'Karmic Debt Analyzer' },
          { href: '/dashboard/upgrade', emoji: '✦', label: 'Upgrade to Premium' },
        ].map((item, i, arr) => (
          <a key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.25rem', borderBottom: i < arr.length-1 ? '1px solid rgba(200,180,255,0.06)' : 'none', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.1rem' }}>{item.emoji}</span>
            <span style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.85rem', flex: 1 }}>{item.label}</span>
            <span style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.8rem' }}>›</span>
          </a>
        ))}
      </div>
    </div>
  )
}