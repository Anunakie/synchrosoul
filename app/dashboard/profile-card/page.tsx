'use client'
import { useState, useEffect, useRef } from 'react'

const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_LOGS = 'synchrosoul_logs'
const KEY_AVATAR = 'synchrosoul_avatar_image'
const KEY_STREAK = 'synchrosoul_streak'

const LIFE_PATH_ARCHETYPES: Record<number, string> = {
  1: 'The Pioneer', 2: 'The Peacemaker', 3: 'The Creator', 4: 'The Builder',
  5: 'The Freedom Seeker', 6: 'The Nurturer', 7: 'The Seeker', 8: 'The Achiever',
  9: 'The Humanitarian', 11: 'The Illuminator', 22: 'The Master Builder', 33: 'The Master Teacher'
}

export default function ProfileCardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [topNumber, setTopNumber] = useState<string>('')
  const [streak, setStreak] = useState(0)
  const [avatar, setAvatar] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState<'cosmic'|'gold'|'rose'>('cosmic')

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(KEY_PROFILE) || 'null')
      setProfile(p)
      const logs = JSON.parse(localStorage.getItem(KEY_LOGS) || '[]')
      const freq: Record<string,number> = {}
      logs.forEach((l: any) => { freq[l.number] = (freq[l.number]||0)+1 })
      const top = Object.entries(freq).sort((a,b) => (b[1] as number)-(a[1] as number))[0]
      if (top) setTopNumber(top[0])
      const s = JSON.parse(localStorage.getItem(KEY_STREAK) || '{}')
      setStreak(s.current || 0)
      setAvatar(localStorage.getItem(KEY_AVATAR) || '')
    } catch {}
  }, [])

  const THEMES = {
    cosmic: { bg: 'linear-gradient(135deg, #0d0b2e 0%, #1a0a3e 50%, #0d1a3e 100%)', accent: '#a78bfa', border: 'rgba(167,139,250,0.3)', star: '#c9a84c' },
    gold: { bg: 'linear-gradient(135deg, #1a1200 0%, #2d1f00 50%, #1a1200 100%)', accent: '#c9a84c', border: 'rgba(201,168,76,0.3)', star: '#f472b6' },
    rose: { bg: 'linear-gradient(135deg, #1a0a1a 0%, #2d0a2d 50%, #1a0a1a 100%)', accent: '#f472b6', border: 'rgba(244,114,182,0.3)', star: '#a78bfa' },
  }
  const t = THEMES[theme]
  const archetype = profile ? LIFE_PATH_ARCHETYPES[profile.lifePathNumber] || 'The Mystic' : 'The Mystic'

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Soul Card</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Your shareable spiritual identity</p>
      </div>

      {/* Theme selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(Object.keys(THEMES) as Array<keyof typeof THEMES>).map(th => (
          <button key={th} onClick={() => setTheme(th)} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.625rem', border: theme === th ? '1px solid ' + THEMES[th].accent + '60' : '1px solid rgba(200,180,255,0.1)', background: theme === th ? THEMES[th].accent + '15' : 'rgba(8,6,28,0.7)', color: theme === th ? THEMES[th].accent : 'rgba(180,160,255,0.4)', fontSize: '0.72rem', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>{th}</button>
        ))}
      </div>

      {/* Card */}
      <div style={{ background: t.bg, border: '1px solid ' + t.border, borderRadius: '1.5rem', padding: '2rem 1.75rem', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative stars */}
        {['10%,15%','85%,10%','5%,80%','90%,75%','50%,5%'].map((pos, i) => (
          <div key={i} style={{ position: 'absolute', left: pos.split(',')[0], top: pos.split(',')[1], color: t.star, fontSize: i % 2 === 0 ? '0.6rem' : '0.4rem', opacity: 0.4 }}>✦</div>
        ))}

        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid ' + t.accent + '50', overflow: 'hidden', marginBottom: '0.875rem', background: t.accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            {avatar ? <img src={avatar} alt='avatar' style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '✦'}
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(220,200,255,0.95)', fontWeight: 400, marginBottom: '0.2rem' }}>{profile?.name || 'Cosmic Soul'}</div>
          <div style={{ color: t.accent, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{archetype}</div>
        </div>

        {/* Numbers */}
        {profile && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Life Path', value: profile.lifePathNumber },
              { label: 'Soul Urge', value: profile.soulUrgeNumber },
              { label: 'Destiny', value: profile.destinyNumber },
            ].map(n => (
              <div key={n.label} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '0.875rem', padding: '0.875rem 0.5rem', textAlign: 'center', border: '1px solid ' + t.accent + '20' }}>
                <div style={{ color: t.accent, fontSize: '1.6rem', fontWeight: 700, lineHeight: 1 }}>{n.value}</div>
                <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>{n.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0.875rem 0', borderTop: '1px solid ' + t.border, borderBottom: '1px solid ' + t.border, marginBottom: '1.25rem' }}>
          {[
            { emoji: '🔥', label: 'Streak', value: streak + 'd' },
            { emoji: '✨', label: 'Top Number', value: topNumber || '—' },
            { emoji: '🌟', label: 'Aligned', value: 'Yes' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{s.emoji}</div>
              <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', fontWeight: 600 }}>{s.value}</div>
              <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: t.accent, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6 }}>SynchroSoul · Angel Number Sync</div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        <button onClick={copyLink} style={{ padding: '0.875rem', borderRadius: '0.875rem', border: '1px solid rgba(167,139,250,0.25)', background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(167,139,250,0.1)', color: copied ? '#4ade80' : '#a78bfa', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.3s' }}>
          {copied ? '✓ Link Copied!' : '🔗 Copy Profile Link'}
        </button>
        <button onClick={() => { if (navigator.share) navigator.share({ title: 'My SynchroSoul Profile', url: window.location.href }) }} style={{ padding: '0.875rem', borderRadius: '0.875rem', border: '1px solid rgba(200,180,255,0.12)', background: 'rgba(8,6,28,0.7)', color: 'rgba(200,180,255,0.6)', fontSize: '0.88rem', cursor: 'pointer' }}>
          📤 Share Soul Card
        </button>
      </div>
    </div>
  )
}
