'use client'
import { useState, useEffect } from 'react'
import { setPrivacyMode, getPrivacyMode, getCurrentUserId } from '@/lib/supabase-db'
import { syncAllToCloud } from '@/lib/storage'
import PushNotificationSettings from '@/components/PushNotificationSettings'



const DEFAULTS = {
  displayName: '',
  dailyReminder: true,
  reminderTime: '09:00',
  streakAlerts: true,
  matchAlerts: true,
  moonAlerts: false,
  soundEnabled: true,
  hapticEnabled: true,
  privacyMode: false,
  shareJournal: false,
  emailDigest: true,
  emailMatchAlerts: true,
}

export default function SettingsPage() {
  const [s, setS] = useState(DEFAULTS)
  const [saved, setSaved] = useState(false)
  const [privacySaving, setPrivacySaving] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ logs: number; dreams: number } | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('synchrosoul_settings') || '{}')
      setS({ ...DEFAULTS, ...stored })
    } catch {}
    getCurrentUserId().then(id => setIsLoggedIn(!!id))
    getPrivacyMode().then(mode => setS(prev => ({ ...prev, privacyMode: mode })))
  }, [])

  const update = (key: string, val: any) => setS(prev => ({ ...prev, [key]: val }))

  const handlePrivacyToggle = async (val: boolean) => {
    setPrivacySaving(true)
    update('privacyMode', val)
    const stored = JSON.parse(localStorage.getItem('synchrosoul_settings') || '{}')
    localStorage.setItem('synchrosoul_settings', JSON.stringify({ ...stored, privacyMode: val }))
    if (isLoggedIn) await setPrivacyMode(val)
    setPrivacySaving(false)
  }

  const save = () => {
    localStorage.setItem('synchrosoul_settings', JSON.stringify(s))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const exportData = () => {
    const data = {
      logs: JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]'),
      dreams: JSON.parse(localStorage.getItem('synchrosoul_dreams') || '[]'),
      settings: s,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'synchrosoul-export.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const clearData = () => {
    if (confirm('Clear ALL your SynchroSoul data? This cannot be undone.')) {
      ['synchrosoul_logs','synchrosoul_dreams','synchrosoul_profile','synchrosoul_settings',
       'synchrosoul_social_profile','synchrosoul_posts','synchrosoul_avatar_image'].forEach(k => localStorage.removeItem(k))
      setS(DEFAULTS)
      alert('All data cleared.')
    }
  }

  const handleSync = async () => {
    if (!isLoggedIn) {
      setSyncError('Sign in to sync your data to the cloud.')
      setTimeout(() => setSyncError(null), 3000)
      return
    }
    setSyncing(true)
    setSyncResult(null)
    setSyncError(null)
    try {
      const result = await syncAllToCloud()
      setSyncResult(result)
      setTimeout(() => setSyncResult(null), 4000)
    } catch {
      setSyncError('Sync failed. Check your connection and try again.')
      setTimeout(() => setSyncError(null), 4000)
    } finally {
      setSyncing(false)
    }
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '0.75rem' }}>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>{children}</div>
    </div>
  )

  const Toggle = ({ label, desc, val, onChange }: { label: string; desc?: string; val: boolean; onChange: (v: boolean) => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
      <div>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', fontWeight: 500 }}>{label}</p>
        {desc && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '0.1rem' }}>{desc}</p>}
      </div>
      <button onClick={() => onChange(!val)} style={{ width: '44px', height: '24px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: val ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
        <div style={{ position: 'absolute', top: '3px', left: val ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: val ? '#c9a84c' : 'rgba(255,255,255,0.4)', transition: 'left 0.2s' }} />
      </button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem 6rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem' }}>Settings</h1>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Customize your SynchroSoul experience</p>

      {/* PRIVACY MODE - Prominent Card */}
      <div style={{
        background: s.privacyMode
          ? 'linear-gradient(135deg, rgba(60,20,80,0.95) 0%, rgba(20,10,40,0.95) 100%)'
          : 'linear-gradient(135deg, rgba(8,6,28,0.95) 0%, rgba(20,10,50,0.95) 100%)',
        borderRadius: '1.5rem',
        border: s.privacyMode ? '1px solid rgba(180,100,255,0.4)' : '1px solid rgba(255,255,255,0.07)',
        padding: '1.5rem',
        backdropFilter: 'blur(12px)',
        marginBottom: '0.75rem',
        transition: 'all 0.3s',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.3rem' }}>{s.privacyMode ? '🔒' : '🌐'}</span>
              <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 700 }}>
                {s.privacyMode ? 'Private Mode — ON' : 'Private Mode — OFF'}
              </p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', lineHeight: 1.5 }}>
              {s.privacyMode
                ? 'You are invisible. Your posts, profile, and numbers are hidden from all other users. Only you can see your data.'
                : 'You are visible to the community. Your posts appear in the feed and you can be matched with others by angel number harmony.'}
            </p>
            {s.privacyMode && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['Hidden from feed', 'No sync matching', 'Profile invisible', 'Journal private'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(180,100,255,0.15)', border: '1px solid rgba(180,100,255,0.3)', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.65rem', color: 'rgba(200,150,255,0.9)' }}>{tag}</span>
                ))}
              </div>
            )}
            {!s.privacyMode && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['Visible in feed', 'Sync matching on', 'Profile discoverable', 'Community access'].map(tag => (
                  <span key={tag} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.65rem', color: 'rgba(201,168,76,0.8)' }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handlePrivacyToggle(!s.privacyMode)}
            disabled={privacySaving}
            style={{
              width: '52px', height: '28px', borderRadius: '999px', border: 'none', cursor: 'pointer',
              background: s.privacyMode ? 'rgba(180,100,255,0.7)' : 'rgba(255,255,255,0.1)',
              position: 'relative', flexShrink: 0, transition: 'background 0.3s',
              opacity: privacySaving ? 0.6 : 1,
            }}
          >
            <div style={{
              position: 'absolute', top: '4px',
              left: s.privacyMode ? '27px' : '4px',
              width: '20px', height: '20px', borderRadius: '50%',
              background: s.privacyMode ? '#fff' : 'rgba(255,255,255,0.4)',
              transition: 'left 0.3s',
            }} />
          </button>
        </div>
        {privacySaving && (
          <p style={{ color: 'rgba(180,100,255,0.7)', fontSize: '0.7rem', marginTop: '0.75rem', textAlign: 'center' }}>Saving...</p>
        )}
      </div>

      <Section title="Notifications">
        <PushNotificationSettings />
        <div style={{ marginTop: '1rem' }}>
        <Toggle label="Daily Reminder" desc="Morning nudge to log your numbers" val={s.dailyReminder} onChange={v => update('dailyReminder', v)} />
        <Toggle label="Streak Alerts" desc="Keep your logging streak alive" val={s.streakAlerts} onChange={v => update('streakAlerts', v)} />
        <Toggle label="Sync Alerts" desc="When someone shares your angel numbers" val={s.matchAlerts} onChange={v => update('matchAlerts', v)} />
        <Toggle label="Moon Phase Alerts" desc="New and full moon notifications" val={s.moonAlerts} onChange={v => update('moonAlerts', v)} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem' }}>Reminder Time</p>
          <input type="time" value={s.reminderTime} onChange={e => update('reminderTime', e.target.value)}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', padding: '0.3rem 0.6rem', fontSize: '0.85rem' }} />
        </div>
      </div>
      </Section>

      <Section title="Community">
        <Toggle label="Show Profile to Others" desc="Let matched users see your profile" val={s.shareJournal} onChange={v => update('shareJournal', v)} />
        <Toggle label="Sound Effects" val={s.soundEnabled} onChange={v => update('soundEnabled', v)} />
        <Toggle label="Haptic Feedback" val={s.hapticEnabled} onChange={v => update('hapticEnabled', v)} />
      </Section>

      <Section title="Cloud Sync">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', lineHeight: 1.6 }}>
            Sync your angel logs and dreams from this device to the cloud. Your data will be available on all devices when signed in.
          </p>
          {syncResult && (
            <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '0.75rem', padding: '0.75rem', fontSize: '0.8rem', color: '#4ade80' }}>
              ✓ Synced {syncResult.logs} logs and {syncResult.dreams} dreams to cloud
            </div>
          )}
          {syncError && (
            <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '0.75rem', padding: '0.75rem', fontSize: '0.8rem', color: '#f87171' }}>
              ⚠ {syncError}
            </div>
          )}
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '0.875rem',
              border: '1px solid rgba(201,168,76,0.4)',
              background: syncing ? 'rgba(201,168,76,0.05)' : 'rgba(201,168,76,0.12)',
              color: syncing ? 'rgba(201,168,76,0.4)' : '#c9a84c',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: syncing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
              letterSpacing: '0.05em',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{syncing ? '↻' : '☁'}</span>
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
          {!isLoggedIn && (
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', textAlign: 'center' }}>
              Sign in to enable cloud sync
            </p>
          )}
        </div>
      </Section>


      <Section title="Email Notifications">
        {/* Weekly Digest Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(201,168,76,0.05)', borderRadius: '10px', border: '1px solid rgba(201,168,76,0.1)', marginBottom: '10px' }}>
          <div>
            <div style={{ color: 'rgba(232,224,255,0.9)', fontSize: '14px', fontWeight: 600 }}>Weekly Cosmic Digest</div>
            <div style={{ color: 'rgba(232,224,255,0.5)', fontSize: '12px', marginTop: '2px' }}>AI-generated summary every Sunday</div>
          </div>
          <button
            onClick={() => update('emailDigest', !s.emailDigest)}
            style={{ width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', background: s.emailDigest ? 'linear-gradient(135deg, #c9a84c, #f0d080)' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}
          >
            <span style={{ position: 'absolute', top: '3px', left: s.emailDigest ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', display: 'block' }} />
          </button>
        </div>

        {/* Match Alerts Toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(139,92,246,0.05)', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.1)' }}>
          <div>
            <div style={{ color: 'rgba(232,224,255,0.9)', fontSize: '14px', fontWeight: 600 }}>Soul Sync Match Alerts</div>
            <div style={{ color: 'rgba(232,224,255,0.5)', fontSize: '12px', marginTop: '2px' }}>Email when someone sees your same number</div>
          </div>
          <button
            onClick={() => update('emailMatchAlerts', !s.emailMatchAlerts)}
            style={{ width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer', background: s.emailMatchAlerts ? 'linear-gradient(135deg, #8b5cf6, #a78bfa)' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}
          >
            <span style={{ position: 'absolute', top: '3px', left: s.emailMatchAlerts ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s', display: 'block' }} />
          </button>
        </div>

        <p style={{ color: 'rgba(232,224,255,0.35)', fontSize: '11px', textAlign: 'center', marginTop: '10px' }}>
          Emails sent from hello@synchrosoul.app
        </p>
      </Section>

      <Section title="Data">
        <button onClick={exportData} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '0.75rem', color: 'rgba(201,168,76,0.9)', padding: '0.6rem 1rem', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left' }}>
          Export My Data (JSON)
        </button>
        <button onClick={clearData} style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', borderRadius: '0.75rem', color: 'rgba(255,120,120,0.8)', padding: '0.6rem 1rem', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left' }}>
          Clear All Local Data
        </button>
      </Section>

      <button onClick={save} style={{ width: '100%', background: 'linear-gradient(135deg, rgba(201,168,76,0.3), rgba(150,100,200,0.3))', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '1rem', color: '#fff', padding: '0.875rem', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
        {saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
