'use client'
import { useState, useEffect } from 'react'

const STORAGE_KEYS = [
  { key: 'synchrosoul_logs', label: 'Angel Number Logs' },
  { key: 'synchrosoul_journal', label: 'Journal Entries' },
  { key: 'synchrosoul_dreams', label: 'Dream Journal' },
  { key: 'synchrosoul_manifestations', label: 'Manifestations' },
  { key: 'synchrosoul_vision_board', label: 'Vision Board' },
  { key: 'synchrosoul_badges', label: 'Badges' },
  { key: 'synchrosoul_social_posts', label: 'Feed Posts' },
  { key: 'synchrosoul_numerology', label: 'Numerology Profile' },
  { key: 'synchrosoul_theme', label: 'Theme Preference' },
]

interface Settings {
  notifications: boolean
  dailyReminder: boolean
  reminderTime: string
  shareProfile: boolean
  showStreak: boolean
  compactMode: boolean
}

const DEFAULT_SETTINGS: Settings = {
  notifications: true,
  dailyReminder: true,
  reminderTime: '09:00',
  shareProfile: false,
  showStreak: true,
  compactMode: false,
}

const SETTINGS_KEY = 'synchrosoul_settings'

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [saved, setSaved] = useState(false)
  const [exportDone, setExportDone] = useState(false)
  const [clearConfirm, setClearConfirm] = useState<string | null>(null)
  const [storageInfo, setStorageInfo] = useState<{ key: string; label: string; count: number }[]>([])

  useEffect(() => {
    try {
      const s = localStorage.getItem(SETTINGS_KEY)
      if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) })
    } catch {}
    // Calculate storage info
    const info = STORAGE_KEYS.map(({ key, label }) => {
      try {
        const val = localStorage.getItem(key)
        if (!val) return { key, label, count: 0 }
        const parsed = JSON.parse(val)
        return { key, label, count: Array.isArray(parsed) ? parsed.length : 1 }
      } catch { return { key, label, count: 0 } }
    })
    setStorageInfo(info)
  }, [])

  function updateSetting<K extends keyof Settings>(k: K, v: Settings[K]) {
    const updated = { ...settings, [k]: v }
    setSettings(updated)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function exportData() {
    const data: Record<string, unknown> = {}
    STORAGE_KEYS.forEach(({ key }) => {
      try { data[key] = JSON.parse(localStorage.getItem(key) || 'null') } catch {}
    })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'synchrosoul-data-' + new Date().toISOString().split('T')[0] + '.json'
    a.click()
    URL.revokeObjectURL(url)
    setExportDone(true)
    setTimeout(() => setExportDone(false), 3000)
  }

  function clearKey(key: string) {
    localStorage.removeItem(key)
    setClearConfirm(null)
    setStorageInfo(prev => prev.map(i => i.key === key ? { ...i, count: 0 } : i))
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.25rem', marginBottom: '1rem' } as React.CSSProperties
  const label = { color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '0.75rem', fontWeight: 600 }
  const row = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(200,180,255,0.06)' } as React.CSSProperties

  function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        onClick={() => onChange(!value)}
        style={{
          width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
          background: value ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.1)',
          position: 'relative', transition: 'all 0.2s', flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', top: '3px',
          left: value ? '23px' : '3px',
          width: '18px', height: '18px', borderRadius: '50%',
          background: value ? '#a78bfa' : 'rgba(255,255,255,0.4)',
          transition: 'all 0.2s',
          boxShadow: value ? '0 0 8px rgba(167,139,250,0.6)' : 'none',
        }} />
      </button>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: 0, fontWeight: 400 }}>Settings</h1>
        {saved && <span style={{ color: '#4ade80', fontSize: '0.75rem' }}>✓ Saved</span>}
      </div>

      {/* Notifications */}
      <div style={card}>
        <div style={label}>Notifications</div>
        <div style={row}>
          <div>
            <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.88rem' }}>Daily Reminder</div>
            <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.72rem' }}>Remind me to log angel numbers</div>
          </div>
          <Toggle value={settings.dailyReminder} onChange={v => updateSetting('dailyReminder', v)} />
        </div>
        {settings.dailyReminder && (
          <div style={{ ...row, borderBottom: 'none' }}>
            <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.88rem' }}>Reminder Time</div>
            <input
              type="time"
              value={settings.reminderTime}
              onChange={e => updateSetting('reminderTime', e.target.value)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.5rem', color: 'rgba(220,200,255,0.9)', padding: '0.35rem 0.6rem', fontSize: '0.82rem', fontFamily: 'inherit', outline: 'none' }}
            />
          </div>
        )}
      </div>

      {/* Profile */}
      <div style={card}>
        <div style={label}>Profile & Privacy</div>
        <div style={row}>
          <div>
            <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.88rem' }}>Public Profile</div>
            <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.72rem' }}>Allow others to see your profile</div>
          </div>
          <Toggle value={settings.shareProfile} onChange={v => updateSetting('shareProfile', v)} />
        </div>
        <div style={{ ...row, borderBottom: 'none' }}>
          <div>
            <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.88rem' }}>Show Streak</div>
            <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.72rem' }}>Display your logging streak on profile</div>
          </div>
          <Toggle value={settings.showStreak} onChange={v => updateSetting('showStreak', v)} />
        </div>
      </div>

      {/* Display */}
      <div style={card}>
        <div style={label}>Display</div>
        <div style={{ ...row, borderBottom: 'none' }}>
          <div>
            <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.88rem' }}>Compact Mode</div>
            <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.72rem' }}>Smaller cards and tighter spacing</div>
          </div>
          <Toggle value={settings.compactMode} onChange={v => updateSetting('compactMode', v)} />
        </div>
      </div>

      {/* Data */}
      <div style={card}>
        <div style={label}>Your Data</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          {storageInfo.filter(i => i.count > 0).map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderRadius: '0.6rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,180,255,0.07)' }}>
              <div>
                <span style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.82rem' }}>{item.label}</span>
                <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', marginLeft: '0.5rem' }}>{item.count} {item.count === 1 ? 'item' : 'items'}</span>
              </div>
              {clearConfirm === item.key ? (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => clearKey(item.key)} style={{ padding: '0.25rem 0.6rem', borderRadius: '0.4rem', cursor: 'pointer', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', fontSize: '0.7rem', fontFamily: 'inherit' }}>Clear</button>
                  <button onClick={() => setClearConfirm(null)} style={{ padding: '0.25rem 0.6rem', borderRadius: '0.4rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.1)', color: 'rgba(180,160,255,0.5)', fontSize: '0.7rem', fontFamily: 'inherit' }}>Cancel</button>
                </div>
              ) : (
                <button onClick={() => setClearConfirm(item.key)} style={{ padding: '0.25rem 0.6rem', borderRadius: '0.4rem', cursor: 'pointer', background: 'none', border: '1px solid rgba(200,180,255,0.1)', color: 'rgba(180,160,255,0.35)', fontSize: '0.7rem', fontFamily: 'inherit' }}>Clear</button>
              )}
            </div>
          ))}
          {storageInfo.every(i => i.count === 0) && (
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.8rem', textAlign: 'center', padding: '0.75rem 0' }}>No data stored yet</div>
          )}
        </div>
        <button
          onClick={exportData}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer', background: exportDone ? 'rgba(74,222,128,0.15)' : 'rgba(167,139,250,0.12)', border: exportDone ? '1px solid rgba(74,222,128,0.4)' : '1px solid rgba(167,139,250,0.3)', color: exportDone ? '#4ade80' : '#a78bfa', fontSize: '0.85rem', fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.3s' }}
        >
          {exportDone ? '✓ Downloaded!' : '⬇ Export All Data as JSON'}
        </button>
      </div>

      {/* About */}
      <div style={{ ...card, marginBottom: 0 }}>
        <div style={label}>About</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.82rem' }}>App</span>
            <span style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.82rem' }}>SynchroSoul</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.82rem' }}>Version</span>
            <span style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.82rem' }}>1.0.0-beta</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.82rem' }}>Stack</span>
            <span style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.82rem' }}>Next.js 15 + Supabase</span>
          </div>
        </div>
      </div>
    </div>
  )
}
