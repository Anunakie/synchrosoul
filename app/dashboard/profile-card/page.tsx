'use client'
import { useState, useEffect, useRef } from 'react'

import { getLogs } from '@/lib/storage'

export default function ProfileCardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [avatarImg, setAvatarImg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [cardStyle, setCardStyle] = useState<'cosmic'|'minimal'|'sacred'>('cosmic')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const numRaw = localStorage.getItem('synchrosoul_numerology'); const num = numRaw ? JSON.parse(numRaw) : null
    const raw = localStorage.getItem('synchrosoul_profile')
    const avatar = localStorage.getItem('synchrosoul_avatar_image')
    const allLogs = getLogs()
    setProfile({ ...num, ...(raw ? JSON.parse(raw) : {}) })
    setAvatarImg(avatar)
    setLogs(allLogs)
  }, [])

  const topNumbers = logs
    .reduce((acc: Record<string, number>, l) => { acc[l.number] = (acc[l.number] || 0) + 1; return acc }, {})
  const sorted = Object.entries(topNumbers).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([n]) => n)

  const STYLES = {
    cosmic: { bg: 'linear-gradient(135deg, #0a0520 0%, #1a0840 50%, #0a0520 100%)', border: 'rgba(167,139,250,0.3)', accent: '#c9a84c', text: 'rgba(220,200,255,0.95)' },
    minimal: { bg: 'linear-gradient(135deg, #050510 0%, #0d0d1a 100%)', border: 'rgba(255,255,255,0.1)', accent: '#a78bfa', text: 'rgba(220,220,255,0.95)' },
    sacred: { bg: 'linear-gradient(135deg, #0a0510 0%, #200a30 50%, #0a0510 100%)', border: 'rgba(255,100,200,0.25)', accent: '#ff6b9d', text: 'rgba(255,220,240,0.95)' },
  }
  const s = STYLES[cardStyle]

    function copyCardText() {
    const lines = [
      '✦ SynchroSoul Cosmic Profile',
      profile?.displayName ? 'Name: ' + profile.displayName : '',
      profile?.lifePathNumber ? 'Life Path: ' + profile.lifePathNumber : '',
      profile?.soulUrgeNumber ? 'Soul Urge: ' + profile.soulUrgeNumber : '',
      profile?.destinyNumber ? 'Destiny: ' + profile.destinyNumber : '',
      sorted.length ? 'Angel Numbers: ' + sorted.join(', ') : '',
      'Find your cosmic match at SynchroSoul',
    ].filter(Boolean)
    const text = lines.join('\n')
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Cosmic Profile Card</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Your shareable spiritual identity card</p>

      {/* Style selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['cosmic','minimal','sacred'] as const).map(style => (
          <button key={style} onClick={() => setCardStyle(style)} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.6rem', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit', textTransform: 'capitalize', background: cardStyle === style ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: cardStyle === style ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.08)', color: cardStyle === style ? 'rgba(200,180,255,0.95)' : 'rgba(180,160,255,0.5)' }}>{style === 'cosmic' ? '🌌' : style === 'minimal' ? '◇' : '🌸'} {style}</button>
        ))}
      </div>

      {/* The Card */}
      <div ref={cardRef} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
        {/* Decorative orbs */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: `radial-gradient(circle, ${s.accent}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,60,200,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `2px solid ${s.accent}66`, overflow: 'hidden', flexShrink: 0, background: `${s.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>
            {avatarImg ? <img src={avatarImg} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '✦'}
          </div>
          <div>
            <div style={{ color: s.text, fontSize: '1.3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{profile?.displayName || profile?.name || 'Cosmic Soul'}</div>
            <div style={{ color: `${s.accent}`, fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.2rem' }}>SynchroSoul Member</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ color: s.accent, fontSize: '1.5rem' }}>✦</div>
          </div>
        </div>

        {/* Numerology badges */}
        {(profile?.lifePathNumber || profile?.soulUrgeNumber || profile?.destinyNumber) && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.6rem', marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
            {[
              { label: 'Life Path', value: profile?.lifePathNumber, color: s.accent },
              { label: 'Soul Urge', value: profile?.soulUrgeNumber, color: '#a78bfa' },
              { label: 'Destiny', value: profile?.destinyNumber, color: '#60a5fa' },
            ].filter(n => n.value).map(n => (
              <div key={n.label} style={{ textAlign: 'center', padding: '0.75rem 0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', border: `1px solid ${n.color}33` }}>
                <div style={{ color: n.color, fontSize: '1.6rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{n.value}</div>
                <div style={{ color: 'rgba(200,180,255,0.6)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.2rem' }}>{n.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Angel numbers */}
        {sorted.length > 0 && (
          <div style={{ position: 'relative', zIndex: 1, marginBottom: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>My Angel Numbers</div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {sorted.map(n => (
                <span key={n} style={{ padding: '0.3rem 0.75rem', borderRadius: '2rem', background: `${s.accent}18`, border: `1px solid ${s.accent}44`, color: s.accent, fontSize: '0.85rem', fontWeight: 600 }}>{n}</span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1, paddingTop: '1rem', borderTop: `1px solid ${s.border}` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: s.text, fontSize: '1.1rem', fontWeight: 700 }}>{logs.length}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sightings</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: s.text, fontSize: '1.1rem', fontWeight: 700 }}>{sorted.length}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Numbers</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.65rem', letterSpacing: '0.08em' }}>synchrosoul.app</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <button onClick={copyCardText} style={{ padding: '0.85rem', borderRadius: '0.75rem', cursor: 'pointer', background: copied ? 'rgba(80,200,120,0.15)' : 'rgba(167,139,250,0.15)', border: copied ? '1px solid rgba(80,200,120,0.4)' : '1px solid rgba(167,139,250,0.4)', color: copied ? 'rgba(100,220,140,0.9)' : 'rgba(200,180,255,0.9)', fontSize: '0.85rem', fontFamily: 'inherit' }}>{copied ? '✓ Copied!' : '⎘ Copy Profile Text'}</button>
        <button onClick={() => { const url = `https://synchrosoul.app/profile/${profile?.displayName || 'soul'}`; navigator.clipboard?.writeText(url).catch(() => {}) }} style={{ padding: '0.85rem', borderRadius: '0.75rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', color: 'rgba(180,160,255,0.7)', fontSize: '0.85rem', fontFamily: 'inherit' }}>🔗 Share Link</button>
      </div>

      {/* Setup prompt */}
      {!profile?.lifePathNumber && (
        <div style={{ marginTop: '1.25rem', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '0.75rem', padding: '1rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(201,168,76,0.8)', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>Complete your numerology profile to unlock your full cosmic card</p>
          <a href="/dashboard/onboarding" style={{ color: '#c9a84c', fontSize: '0.8rem', textDecoration: 'none' }}>Set up profile →</a>
        </div>
      )}
    </div>
  )
}
