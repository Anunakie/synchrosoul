'use client'
import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/lib/theme-context'
import { createClient } from '@/lib/supabase/client'

const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_LOGS = 'synchrosoul_logs'
const KEY_AVATAR = 'synchrosoul_avatar_image'
const KEY_SOCIAL = 'synchrosoul_social_profile'

const LIFE_PATH_ARCHETYPES: Record<number, string> = {
  1: 'The Pioneer', 2: 'The Peacemaker', 3: 'The Creator', 4: 'The Builder',
  5: 'The Freedom Seeker', 6: 'The Nurturer', 7: 'The Mystic', 8: 'The Achiever',
  9: 'The Humanitarian', 11: 'The Illuminator', 22: 'The Master Builder', 33: 'The Master Teacher'
}

const STYLES = {
  cosmic: { bg: 'linear-gradient(135deg,#0d0a2e 0%,#1a0a3e 50%,#0a1a3e 100%)', accent: '#a78bfa', border: 'rgba(167,139,250,0.3)', glow: 'rgba(167,139,250,0.15)', text: '#f0e6ff', subtext: 'rgba(220,200,255,0.7)' },
  minimal: { bg: 'linear-gradient(135deg,#050510 0%,#0a0820 100%)', accent: '#c9a84c', border: 'rgba(201,168,76,0.3)', glow: 'rgba(201,168,76,0.1)', text: '#f0e6ff', subtext: 'rgba(220,200,255,0.7)' },
  sacred: { bg: 'linear-gradient(135deg,#0a0520 0%,#1a0530 50%,#050520 100%)', accent: '#f472b6', border: 'rgba(244,114,182,0.3)', glow: 'rgba(244,114,182,0.12)', text: '#f0e6ff', subtext: 'rgba(220,200,255,0.7)' },
}

const LIGHT_STYLES = {
  cosmic: { bg: 'linear-gradient(135deg,#ede8ff 0%,#e0d4ff 50%,#e8e0ff 100%)', accent: '#7c3aed', border: 'rgba(124,58,237,0.35)', glow: 'rgba(124,58,237,0.12)', text: '#1a0a3e', subtext: 'rgba(45,27,94,0.7)' },
  minimal: { bg: 'linear-gradient(135deg,#fdf8e8 0%,#f5edcc 100%)', accent: '#92700a', border: 'rgba(146,112,10,0.35)', glow: 'rgba(146,112,10,0.1)', text: '#2a1a00', subtext: 'rgba(80,55,0,0.7)' },
  sacred: { bg: 'linear-gradient(135deg,#fce8f3 0%,#f5d0e8 50%,#fce8f3 100%)', accent: '#be185d', border: 'rgba(190,24,93,0.35)', glow: 'rgba(190,24,93,0.1)', text: '#2d0a1e', subtext: 'rgba(80,20,50,0.7)' },
}

export default function ProfileCardPage() {
  const { theme } = useTheme()
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState('Soul Seeker')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [lifePathNumber, setLifePathNumber] = useState<number | null>(null)
  const [soulUrgeNumber, setSoulUrgeNumber] = useState<number | null>(null)
  const [destinyNumber, setDestinyNumber] = useState<number | null>(null)
  const [topNumbers, setTopNumbers] = useState<string[]>([])
  const [totalLogs, setTotalLogs] = useState(0)
  const [copied, setCopied] = useState(false)
  const [cardStyle, setCardStyle] = useState<'cosmic' | 'minimal' | 'sacred'>('cosmic')
  const [shareUrl, setShareUrl] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          setUserId(user.id)
          setShareUrl(window.location.origin + '/profile/' + user.id)

          // Load profile from Supabase
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (prof) {
            setName(prof.display_name || 'Soul Seeker')
            setBio(prof.bio || '')
            setAvatar(prof.avatar_url || null)
            setLifePathNumber(prof.life_path || null)
            setSoulUrgeNumber(prof.soul_urge || null)
            setDestinyNumber(prof.destiny || null)
          }

          // Load logs from Supabase
          const { data: logs } = await supabase
            .from('angel_logs')
            .select('number')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(100)

          if (logs && logs.length > 0) {
            setTotalLogs(logs.length)
            const freq: Record<string, number> = {}
            logs.forEach((l: any) => { freq[l.number] = (freq[l.number] || 0) + 1 })
            setTopNumbers(Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([n]) => n))
          }
        } else {
          // Fallback to localStorage
          setShareUrl(window.location.origin + '/dashboard/profile')
          try {
            const p = localStorage.getItem(KEY_PROFILE)
            if (p) { const d = JSON.parse(p); setLifePathNumber(d.lifePathNumber); setSoulUrgeNumber(d.soulUrgeNumber); setDestinyNumber(d.destinyNumber) }
            const s = localStorage.getItem(KEY_SOCIAL)
            if (s) { const d = JSON.parse(s); setName(d.displayName || 'Soul Seeker'); setBio(d.bio || '') }
            const a = localStorage.getItem(KEY_AVATAR); if (a) setAvatar(a)
            const l = localStorage.getItem(KEY_LOGS)
            if (l) {
              const logs = JSON.parse(l)
              setTotalLogs(logs.length)
              const freq: Record<string, number> = {}
              logs.forEach((log: any) => { freq[log.number] = (freq[log.number] || 0) + 1 })
              setTopNumbers(Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([n]) => n))
            }
          } catch { }
        }
      } catch { }
    }
    load()
  }, [])

  const archetype = lifePathNumber ? (LIFE_PATH_ARCHETYPES[lifePathNumber] || 'The Seeker') : 'The Seeker'
  const style = (theme === 'light' ? LIGHT_STYLES : STYLES)[cardStyle]
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  function copyLink() {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  function nativeShare() {
    if (navigator.share && shareUrl) {
      navigator.share({ title: name + "'s SynchroSoul Profile", text: 'See my cosmic numerology profile and angel numbers!', url: shareUrl })
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Profile Card</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Your shareable cosmic identity</p>

      {/* Style selector */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1.25rem' }}>
        {(['cosmic', 'minimal', 'sacred'] as const).map(s => (
          <button key={s} onClick={() => setCardStyle(s)} style={{ flex: 1, padding: '0.4rem', borderRadius: '0.625rem', border: cardStyle === s ? '1px solid ' + STYLES[s].accent + '60' : '1px solid rgba(200,180,255,0.1)', background: cardStyle === s ? STYLES[s].accent + '12' : 'transparent', color: cardStyle === s ? STYLES[s].accent : 'rgba(180,160,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'capitalize' }}>{s}</button>
        ))}
      </div>

      {/* The Card */}
      <div ref={cardRef} style={{ background: style.bg, border: '1px solid ' + style.border, borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden', boxShadow: '0 0 40px ' + style.glow }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: style.accent + '08', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: style.accent + '06', filter: 'blur(30px)' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid ' + style.border, overflow: 'hidden', flexShrink: 0, background: style.accent + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: avatar ? undefined : '1.3rem', color: style.accent, fontWeight: 700 }}>
            {avatar ? <img src={avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" /> : initials}
          </div>
          <div>
            <div style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.15rem' }}>{name}</div>
            <div style={{ color: style.accent, fontSize: '0.78rem', opacity: 0.8 }}>{archetype}</div>
            {totalLogs > 0 && <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', marginTop: '0.1rem' }}>{totalLogs} angel sightings logged</div>}
          </div>
        </div>

        {/* Bio */}
        {bio && <p style={{ color: 'rgba(200,180,255,0.55)', fontSize: '0.85rem', fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', margin: '0 0 1.25rem', lineHeight: 1.6 }}>&ldquo;{bio}&rdquo;</p>}

        {/* Numerology badges */}
        {lifePathNumber && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {([[lifePathNumber, 'Life Path', style.accent], [soulUrgeNumber, 'Soul Urge', '#c9a84c'], [destinyNumber, 'Destiny', '#60a5fa']] as [number | null, string, string][]).filter(([n]) => n).map(([num, label, col]) => (
              <div key={label} style={{ flex: 1, background: col + '10', border: '1px solid ' + col + '20', borderRadius: '0.875rem', padding: '0.5rem', textAlign: 'center' }}>
                <div style={{ color: col, fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Cormorant Garamond,serif' }}>{num}</div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Top numbers */}
        {topNumbers.length > 0 && (
          <div>
            <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Signature Numbers</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {topNumbers.map(n => (
                <span key={n} style={{ padding: '0.25rem 0.625rem', borderRadius: '0.5rem', background: style.accent + '10', border: '1px solid ' + style.accent + '20', color: style.accent, fontSize: '0.85rem', fontWeight: 700 }}>{n}</span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(200,180,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>SYNCHROSOUL</span>
          <span style={{ color: style.accent, fontSize: '0.7rem', opacity: 0.5 }}>✦ ✦ ✦</span>
        </div>
      </div>

      {/* Share URL preview */}
      {shareUrl && userId && (
        <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '0.75rem', padding: '0.625rem 0.875rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'rgba(167,139,250,0.5)', flexShrink: 0 }}>Your link:</span>
          <span style={{ fontSize: '0.72rem', color: 'rgba(167,139,250,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{shareUrl}</span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={copyLink} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.875rem', border: 'none', background: copied ? 'rgba(74,222,128,0.15)' : 'linear-gradient(135deg,rgba(167,139,250,0.7),rgba(201,168,76,0.7))', color: copied ? '#4ade80' : 'white', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
          {copied ? '✓ Link Copied!' : 'Copy Profile Link'}
        </button>
        <button onClick={nativeShare} style={{ padding: '0.625rem 1rem', borderRadius: '0.875rem', border: '1px solid rgba(200,180,255,0.12)', background: 'transparent', color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', cursor: 'pointer' }}>Share</button>
      </div>

      <p style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.72rem', textAlign: 'center', marginTop: '0.875rem' }}>Anyone with your link can view your cosmic profile</p>
    </div>
  )
}
