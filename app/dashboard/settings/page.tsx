'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const KEY_SETTINGS = 'synchrosoul_app_settings'
const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_LOGS = 'synchrosoul_logs'

type Settings = {
  theme: string
  dailyReminder: boolean
  reminderTime: string
  moonAlerts: boolean
  matchAlerts: boolean
  streakAlerts: boolean
  soundEffects: boolean
  haptics: boolean
  privateMode: boolean
  showTruthScore: boolean
  defaultJournalPrivacy: 'private'|'matches'|'public'
  numberFormat: 'standard'|'compact'
  language: string
  timezone: string
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'starfield',
  dailyReminder: true,
  reminderTime: '09:00',
  moonAlerts: true,
  matchAlerts: true,
  streakAlerts: true,
  soundEffects: false,
  haptics: true,
  privateMode: false,
  showTruthScore: true,
  defaultJournalPrivacy: 'private',
  numberFormat: 'standard',
  language: 'English',
  timezone: 'Auto-detect',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [profile, setProfile] = useState<any>(null)
  const [logCount, setLogCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY_SETTINGS)
      if(s) setSettings({...DEFAULT_SETTINGS,...JSON.parse(s)})
      const p = localStorage.getItem(KEY_PROFILE); if(p) setProfile(JSON.parse(p))
      const l = localStorage.getItem(KEY_LOGS); if(l) setLogCount(JSON.parse(l).length)
    } catch {}
  }, [])

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    const updated = {...settings, [key]: value}
    setSettings(updated)
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(updated))
    setSaved(true)
    setTimeout(()=>setSaved(false), 1500)
  }

  function clearAllData() {
    const keys = ['synchrosoul_logs','synchrosoul_numerology_profile','synchrosoul_social_profile',
      'synchrosoul_posts','synchrosoul_dreams','synchrosoul_gratitude','synchrosoul_manifestations',
      'synchrosoul_notifications','synchrosoul_connected','synchrosoul_avatar_image']
    keys.forEach(k=>localStorage.removeItem(k))
    setLogCount(0)
    setProfile(null)
    setShowClearConfirm(false)
  }

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',marginBottom:'0.875rem'}
  const row: React.CSSProperties = {display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem 1.25rem',borderBottom:'1px solid rgba(200,180,255,0.05)'}
  const lastRow: React.CSSProperties = {display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem 1.25rem'}
  const label: React.CSSProperties = {color:'rgba(200,180,255,0.7)',fontSize:'0.85rem'}
  const sublabel: React.CSSProperties = {color:'rgba(180,160,255,0.35)',fontSize:'0.7rem',marginTop:'0.1rem'}

  function Toggle({value, onChange}: {value:boolean, onChange:(v:boolean)=>void}) {
    return (
      <button onClick={()=>onChange(!value)} style={{width:'42px',height:'24px',borderRadius:'12px',background:value?'rgba(167,139,250,0.5)':'rgba(200,180,255,0.08)',border:value?'1px solid rgba(167,139,250,0.6)':'1px solid rgba(200,180,255,0.12)',cursor:'pointer',position:'relative',transition:'all 0.2s',flexShrink:0}}>
        <div style={{width:'18px',height:'18px',borderRadius:'50%',background:value?'#a78bfa':'rgba(180,160,255,0.3)',position:'absolute',top:'2px',left:value?'21px':'2px',transition:'all 0.2s',boxShadow:value?'0 0 6px rgba(167,139,250,0.5)':'none'}} />
      </button>
    )
  }

  function SectionHeader({title,emoji}:{title:string,emoji:string}) {
    return <div style={{padding:'0.875rem 1.25rem 0.4rem',color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.12em',display:'flex',alignItems:'center',gap:'0.4rem'}}><span>{emoji}</span>{title}</div>
  }

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.25rem'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:0,fontWeight:400}}>Settings</h1>
        {saved && <span style={{color:'#4ade80',fontSize:'0.78rem',animation:'fadeIn 0.3s ease'}}>✓ Saved</span>}
      </div>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.5rem'}}>Customize your SynchroSoul experience</p>

      {/* Account */}
      <SectionHeader title='Account' emoji='◎' />
      <div style={card}>
        <div style={row}>
          <div>
            <div style={label}>Profile</div>
            <div style={sublabel}>{profile?.name || 'Not set up'} {profile?.lifePathNumber ? '· Life Path '+profile.lifePathNumber : ''}</div>
          </div>
          <Link href='/dashboard/profile' style={{color:'rgba(167,139,250,0.6)',fontSize:'0.78rem',textDecoration:'none'}}>Edit →</Link>
        </div>
        <div style={row}>
          <div>
            <div style={label}>Numerology Profile</div>
            <div style={sublabel}>{profile?.lifePathNumber ? 'Complete' : 'Not calculated'}</div>
          </div>
          <Link href='/dashboard/numerology-deep' style={{color:'rgba(167,139,250,0.6)',fontSize:'0.78rem',textDecoration:'none'}}>{profile?.lifePathNumber?'View →':'Set up →'}</Link>
        </div>
        <div style={lastRow}>
          <div>
            <div style={label}>Data stored</div>
            <div style={sublabel}>{logCount} angel number logs · Local storage</div>
          </div>
          <Link href='/dashboard/insights' style={{color:'rgba(167,139,250,0.6)',fontSize:'0.78rem',textDecoration:'none'}}>View →</Link>
        </div>
      </div>

      {/* Notifications */}
      <SectionHeader title='Notifications' emoji='🔔' />
      <div style={card}>
        <div style={row}>
          <div>
            <div style={label}>Daily Reminder</div>
            <div style={sublabel}>Remind me to log angel numbers</div>
          </div>
          <Toggle value={settings.dailyReminder} onChange={v=>update('dailyReminder',v)} />
        </div>
        {settings.dailyReminder && (
          <div style={row}>
            <div style={label}>Reminder Time</div>
            <input type='time' value={settings.reminderTime} onChange={e=>update('reminderTime',e.target.value)}
              style={{background:'rgba(200,180,255,0.06)',border:'1px solid rgba(200,180,255,0.12)',borderRadius:'0.5rem',padding:'0.3rem 0.5rem',color:'rgba(220,200,255,0.8)',fontSize:'0.82rem',fontFamily:'inherit',outline:'none'}} />
          </div>
        )}
        <div style={row}>
          <div>
            <div style={label}>Moon Phase Alerts</div>
            <div style={sublabel}>New & Full Moon notifications</div>
          </div>
          <Toggle value={settings.moonAlerts} onChange={v=>update('moonAlerts',v)} />
        </div>
        <div style={row}>
          <div>
            <div style={label}>Soul Match Alerts</div>
            <div style={sublabel}>When someone syncs with your numbers</div>
          </div>
          <Toggle value={settings.matchAlerts} onChange={v=>update('matchAlerts',v)} />
        </div>
        <div style={lastRow}>
          <div>
            <div style={label}>Streak Alerts</div>
            <div style={sublabel}>Daily streak milestones</div>
          </div>
          <Toggle value={settings.streakAlerts} onChange={v=>update('streakAlerts',v)} />
        </div>
      </div>

      {/* Privacy */}
      <SectionHeader title='Privacy' emoji='🔒' />
      <div style={card}>
        <div style={row}>
          <div>
            <div style={label}>Private Mode</div>
            <div style={sublabel}>Hide your profile from matching</div>
          </div>
          <Toggle value={settings.privateMode} onChange={v=>update('privateMode',v)} />
        </div>
        <div style={row}>
          <div>
            <div style={label}>Show Truth Score</div>
            <div style={sublabel}>Display Angel Approved badge on posts</div>
          </div>
          <Toggle value={settings.showTruthScore} onChange={v=>update('showTruthScore',v)} />
        </div>
        <div style={lastRow}>
          <div>
            <div style={label}>Default Journal Privacy</div>
            <div style={sublabel}>Who can see new journal entries</div>
          </div>
          <select value={settings.defaultJournalPrivacy} onChange={e=>update('defaultJournalPrivacy',e.target.value as any)}
            style={{background:'rgba(200,180,255,0.06)',border:'1px solid rgba(200,180,255,0.12)',borderRadius:'0.5rem',padding:'0.3rem 0.5rem',color:'rgba(220,200,255,0.8)',fontSize:'0.78rem',fontFamily:'inherit',outline:'none'}}>
            <option value='private'>Private</option>
            <option value='matches'>Matches only</option>
            <option value='public'>Public</option>
          </select>
        </div>
      </div>

      {/* Experience */}
      <SectionHeader title='Experience' emoji='✨' />
      <div style={card}>
        <div style={row}>
          <div>
            <div style={label}>Sound Effects</div>
            <div style={sublabel}>Subtle sounds when logging numbers</div>
          </div>
          <Toggle value={settings.soundEffects} onChange={v=>update('soundEffects',v)} />
        </div>
        <div style={row}>
          <div>
            <div style={label}>Haptic Feedback</div>
            <div style={sublabel}>Vibration on mobile interactions</div>
          </div>
          <Toggle value={settings.haptics} onChange={v=>update('haptics',v)} />
        </div>
        <div style={lastRow}>
          <div>
            <div style={label}>Background Theme</div>
            <div style={sublabel}>Use the 🎨 button in the corner</div>
          </div>
          <span style={{color:'rgba(180,160,255,0.35)',fontSize:'0.78rem'}}>3 themes</span>
        </div>
      </div>

      {/* About */}
      <SectionHeader title='About' emoji='ℹ️' />
      <div style={card}>
        <div style={row}>
          <div style={label}>Version</div>
          <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.78rem'}}>SynchroSoul 1.0.0</div>
        </div>
        <div style={row}>
          <div style={label}>Built with</div>
          <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.78rem'}}>Next.js 16 · Tailwind · Supabase</div>
        </div>
        <div style={row}>
          <Link href='/dashboard/upgrade' style={{...label,textDecoration:'none'}}>Premium Features</Link>
          <Link href='/dashboard/upgrade' style={{color:'#c9a84c',fontSize:'0.78rem',textDecoration:'none'}}>View plans →</Link>
        </div>
        <div style={lastRow}>
          <Link href='/dashboard/badges' style={{...label,textDecoration:'none'}}>Achievements</Link>
          <Link href='/dashboard/badges' style={{color:'rgba(167,139,250,0.6)',fontSize:'0.78rem',textDecoration:'none'}}>View badges →</Link>
        </div>
      </div>

      {/* Danger zone */}
      <SectionHeader title='Data' emoji='⚠️' />
      <div style={{...card,borderColor:'rgba(248,113,113,0.1)'}}>
        {!showClearConfirm ? (
          <div style={lastRow}>
            <div>
              <div style={{...label,color:'rgba(248,113,113,0.6)'}}>Clear All Data</div>
              <div style={sublabel}>Delete all logs, journal entries, and profile</div>
            </div>
            <button onClick={()=>setShowClearConfirm(true)} style={{padding:'0.35rem 0.75rem',borderRadius:'0.5rem',border:'1px solid rgba(248,113,113,0.2)',background:'rgba(248,113,113,0.06)',color:'rgba(248,113,113,0.6)',fontSize:'0.75rem',cursor:'pointer'}}>Clear</button>
          </div>
        ) : (
          <div style={{padding:'1rem 1.25rem'}}>
            <div style={{color:'rgba(248,113,113,0.8)',fontSize:'0.85rem',marginBottom:'0.5rem',fontWeight:600}}>Are you sure?</div>
            <div style={{color:'rgba(180,160,255,0.45)',fontSize:'0.78rem',marginBottom:'0.875rem'}}>This will permanently delete all your angel number logs, journal entries, dreams, and profile data. This cannot be undone.</div>
            <div style={{display:'flex',gap:'0.5rem'}}>
              <button onClick={clearAllData} style={{flex:1,padding:'0.5rem',borderRadius:'0.625rem',border:'none',background:'rgba(248,113,113,0.15)',color:'rgba(248,113,113,0.8)',fontSize:'0.82rem',cursor:'pointer',fontWeight:600}}>Yes, delete everything</button>
              <button onClick={()=>setShowClearConfirm(false)} style={{flex:1,padding:'0.5rem',borderRadius:'0.625rem',border:'1px solid rgba(200,180,255,0.12)',background:'transparent',color:'rgba(180,160,255,0.5)',fontSize:'0.82rem',cursor:'pointer'}}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
