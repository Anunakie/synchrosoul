'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme, THEMES, AppTheme } from '@/lib/theme-context'

const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_LOGS = 'synchrosoul_logs'
const KEY_DREAMS = 'synchrosoul_dreams'
const KEY_JOURNAL = 'synchrosoul_journal'
const KEY_GRATITUDE = 'synchrosoul_gratitude'
const KEY_MANIFEST = 'synchrosoul_manifestations'
const KEY_VISION = 'synchrosoul_vision_board'
const KEY_SOCIAL = 'synchrosoul_social_profile'
const KEY_POSTS = 'synchrosoul_posts'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState('')
  const [saved, setSaved] = useState(false)
  const [cleared, setCleared] = useState<string>('')
  const [dataSize, setDataSize] = useState<Record<string,number>>({})

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(KEY_PROFILE) || '{}')
      setName(p.name || '')
      const sizes: Record<string,number> = {}
      const keys = [KEY_LOGS, KEY_DREAMS, KEY_JOURNAL, KEY_GRATITUDE, KEY_MANIFEST, KEY_VISION, KEY_POSTS]
      keys.forEach(k => {
        try { sizes[k] = JSON.parse(localStorage.getItem(k) || '[]').length } catch { sizes[k] = 0 }
      })
      setDataSize(sizes)
    } catch {}
  }, [])

  function saveName() {
    try {
      const p = JSON.parse(localStorage.getItem(KEY_PROFILE) || '{}')
      localStorage.setItem(KEY_PROFILE, JSON.stringify({ ...p, name }))
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
  }

  function clearData(key: string, label: string) {
    if (confirm('Clear all ' + label + '? This cannot be undone.')) {
      localStorage.removeItem(key)
      setCleared(label)
      setTimeout(() => setCleared(''), 2000)
      setDataSize(s => ({ ...s, [key]: 0 }))
    }
  }

  function exportData() {
    const data: Record<string,any> = {}
    const keys = [KEY_PROFILE, KEY_LOGS, KEY_DREAMS, KEY_JOURNAL, KEY_GRATITUDE, KEY_MANIFEST, KEY_VISION, KEY_SOCIAL, KEY_POSTS]
    keys.forEach(k => { try { data[k] = JSON.parse(localStorage.getItem(k) || 'null') } catch {} })
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'synchrosoul-backup-' + new Date().toISOString().split('T')[0] + '.json'
    a.click(); URL.revokeObjectURL(url)
  }

  function importData(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        Object.entries(data).forEach(([k, v]) => { if (v) localStorage.setItem(k, JSON.stringify(v)) })
        alert('Data imported successfully! Refresh to see changes.')
      } catch { alert('Invalid backup file.') }
    }
    reader.readAsText(file)
  }

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.25rem', marginBottom: '0.875rem' }
  const label: React.CSSProperties = { color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '0.75rem', display: 'block' }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Settings</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Customize your SynchroSoul experience</p>
      </div>

      {/* Profile */}
      <div style={card}>
        <span style={label}>Profile</span>
        <div style={{ display: 'flex', gap: '0.625rem' }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder='Your name...' style={{ flex: 1, padding: '0.75rem', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.88rem', outline: 'none' }} />
          <button onClick={saveName} style={{ padding: '0.75rem 1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(167,139,250,0.3)', background: saved ? 'rgba(74,222,128,0.1)' : 'rgba(167,139,250,0.1)', color: saved ? '#4ade80' : '#a78bfa', fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>{saved ? '✓ Saved' : 'Save'}</button>
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <Link href='/dashboard/onboarding' style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem', textDecoration: 'none' }}>↺ Redo onboarding setup</Link>
        </div>
      </div>

      {/* Background Theme */}
      <div style={card}>
        <span style={label}>Background Theme</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {THEMES.map(t => (
            <button key={t.id} onClick={() => setTheme(t.id as AppTheme)} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', borderRadius: '0.875rem', border: theme === t.id ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(200,180,255,0.08)', background: theme === t.id ? 'rgba(167,139,250,0.1)' : 'transparent', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)', backgroundImage: t.thumbnail ? 'url(' + t.thumbnail + ')' : undefined, backgroundSize: 'cover', backgroundPosition: 'center', background: t.thumbnail ? undefined : 'radial-gradient(ellipse at 30% 40%, rgba(120,60,200,0.9) 0%, rgba(20,10,60,1) 70%)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: theme === t.id ? '#a78bfa' : 'rgba(200,180,255,0.75)', fontSize: '0.85rem' }}>{t.emoji} {t.label}</div>
              </div>
              {theme === t.id && <span style={{ color: '#a78bfa', fontSize: '0.8rem' }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={card}>
        <span style={label}>Preferences</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { href: '/dashboard/notifications', emoji: '🔔', label: 'Notification Settings' },
            { href: '/dashboard/upgrade', emoji: '⭐', label: 'Upgrade to Premium' },
            { href: '/dashboard/profile-card', emoji: '🪪', label: 'View Soul Card' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid rgba(200,180,255,0.08)', background: 'rgba(8,6,28,0.5)', textDecoration: 'none', color: 'rgba(200,180,255,0.7)', fontSize: '0.85rem' }}>
              <span>{item.emoji}</span><span>{item.label}</span><span style={{ marginLeft: 'auto', opacity: 0.3 }}>›</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div style={card}>
        <span style={label}>Data Management</span>
        <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1rem' }}>
          <button onClick={exportData} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid rgba(96,165,250,0.3)', background: 'rgba(96,165,250,0.08)', color: '#60a5fa', fontSize: '0.82rem', cursor: 'pointer' }}>📤 Export Backup</button>
          <label style={{ flex: 1, padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.08)', color: '#4ade80', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'center' as const }}>
            📥 Import Backup
            <input type='file' accept='.json' onChange={importData} style={{ display: 'none' }} />
          </label>
        </div>
        {cleared && <div style={{ color: '#4ade80', fontSize: '0.78rem', marginBottom: '0.75rem', textAlign: 'center' }}>✓ {cleared} cleared</div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            { key: KEY_LOGS, label: 'Angel Number Logs', color: '#a78bfa' },
            { key: KEY_DREAMS, label: 'Dream Journal', color: '#818cf8' },
            { key: KEY_GRATITUDE, label: 'Gratitude Entries', color: '#c9a84c' },
            { key: KEY_MANIFEST, label: 'Manifestations', color: '#4ade80' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 0.75rem', borderRadius: '0.75rem', background: 'rgba(8,6,28,0.5)', border: '1px solid rgba(200,180,255,0.06)' }}>
              <div>
                <span style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.82rem' }}>{item.label}</span>
                <span style={{ color: item.color, fontSize: '0.72rem', marginLeft: '0.5rem' }}>{dataSize[item.key] || 0} entries</span>
              </div>
              <button onClick={() => clearData(item.key, item.label)} style={{ padding: '0.25rem 0.625rem', borderRadius: '0.5rem', border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.06)', color: 'rgba(248,113,113,0.6)', fontSize: '0.68rem', cursor: 'pointer' }}>Clear</button>
            </div>
          ))}
        </div>
      </div>

      {/* App info */}
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <div style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.72rem' }}>SynchroSoul v1.0 · Angel Number Sync Dating App</div>
        <div style={{ color: 'rgba(180,160,255,0.15)', fontSize: '0.65rem', marginTop: '0.25rem' }}>Built with ✦ and cosmic intention</div>
      </div>
    </div>
  )
}
