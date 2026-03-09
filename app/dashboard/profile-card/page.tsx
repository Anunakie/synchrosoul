'use client'
import { useState, useEffect, useRef } from 'react'
import { getNumerologyProfile } from '@/lib/storage'
import { getLogs } from '@/lib/storage'

export default function ProfileCardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [avatar, setAvatar] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const p = getNumerologyProfile()
    setProfile(p)
    const l = getLogs()
    setLogs(l)
    const img = localStorage.getItem('synchrosoul_avatar_image')
    if (img) setAvatar(img)
  }, [])

  const topNumbers = (() => {
    const counts: Record<string, number> = {}
    logs.forEach(l => { counts[l.number] = (counts[l.number] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => n)
  })()

  const streak = (() => {
    const days = new Set(logs.map(l => new Date(l.createdAt).toDateString()))
    let s = 0, d = new Date()
    while (days.has(d.toDateString())) { s++; d.setDate(d.getDate() - 1) }
    return s
  })()

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const COLORS = ['#a78bfa', '#c9a84c', '#60a5fa', '#f472b6', '#34d399']
  const avatarColor = COLORS[((profile?.name || 'Soul').charCodeAt(0)) % COLORS.length]

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Profile Card</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Your shareable cosmic identity</p>

      {/* The Card */}
      <div ref={cardRef} style={{
        background: 'linear-gradient(135deg, rgba(20,10,50,0.98) 0%, rgba(8,6,28,0.98) 100%)',
        border: '1px solid rgba(167,139,250,0.3)',
        borderRadius: '1.5rem',
        padding: '2rem',
        marginBottom: '1.25rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 60px rgba(120,60,200,0.2)',
      }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', border: `2px solid ${avatarColor}55`, overflow: 'hidden', flexShrink: 0, background: avatar ? 'transparent' : `radial-gradient(circle at 35% 35%, ${avatarColor}44, rgba(8,6,28,0.9))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {avatar
              ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '1.5rem', color: avatarColor }}>{(profile?.name || 'S')[0].toUpperCase()}</span>
            }
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{profile?.name || 'Cosmic Soul'}</div>
            <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.72rem', marginTop: '0.2rem' }}>SynchroSoul ✦</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#c9a84c', fontSize: '1.4rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{streak}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Day Streak</div>
          </div>
        </div>

        {/* Numerology badges */}
        {profile && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[['Life Path', profile.lifePathNumber, '#a78bfa'], ['Soul Urge', profile.soulUrgeNumber, '#c9a84c'], ['Destiny', profile.destinyNumber, '#60a5fa']].map(([label, val, color]) => (
              <div key={label as string} style={{ flex: 1, background: `${color as string}12`, border: `1px solid ${color as string}30`, borderRadius: '0.875rem', padding: '0.6rem', textAlign: 'center' }}>
                <div style={{ color: color as string, fontSize: '1.3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, lineHeight: 1 }}>{val}</div>
                <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Top angel numbers */}
        {topNumbers.length > 0 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Most Seen Numbers</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {topNumbers.map((n, i) => (
                <div key={n} style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', color: '#a78bfa', fontSize: '0.9rem', fontWeight: 700 }}>{n}</div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(200,180,255,0.08)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(220,200,255,0.8)', fontSize: '1.1rem', fontWeight: 700 }}>{logs.length}</div>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sightings</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'rgba(220,200,255,0.8)', fontSize: '1.1rem', fontWeight: 700 }}>{new Set(logs.map(l => l.number)).size}</div>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Unique</div>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.65rem' }}>synchrosoul.app</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={copyLink}
          style={{ flex: 1, padding: '0.875rem', borderRadius: '0.875rem', background: copied ? 'rgba(52,211,153,0.15)' : 'rgba(167,139,250,0.12)', border: copied ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(167,139,250,0.25)', color: copied ? '#34d399' : '#a78bfa', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
        >{copied ? '✓ Link Copied!' : '🔗 Copy Link'}</button>
        <button
          onClick={() => { if (navigator.share) navigator.share({ title: 'My SynchroSoul Profile', url: window.location.href }) }}
          style={{ flex: 1, padding: '0.875rem', borderRadius: '0.875rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
        >↗ Share Card</button>
      </div>
    </div>
  )
}
