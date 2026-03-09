'use client'
import { useState, useEffect, useRef } from 'react'

const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_LOGS = 'synchrosoul_logs'
const KEY_AVATAR = 'synchrosoul_avatar_image'
const KEY_SOCIAL = 'synchrosoul_social_profile'

const LP_ARCHETYPES: Record<number,{title:string;emoji:string;color:string}> = {
  1:{title:'The Pioneer',emoji:'✦',color:'#f59e0b'},
  2:{title:'The Peacemaker',emoji:'⧡',color:'#60a5fa'},
  3:{title:'The Creator',emoji:'△',color:'#a78bfa'},
  4:{title:'The Builder',emoji:'◈',color:'#34d399'},
  5:{title:'The Adventurer',emoji:'✺',color:'#f97316'},
  6:{title:'The Nurturer',emoji:'♥',color:'#f472b6'},
  7:{title:'The Mystic',emoji:'✶',color:'#818cf8'},
  8:{title:'The Powerhouse',emoji:'∞',color:'#c9a84c'},
  9:{title:'The Sage',emoji:'◎',color:'#e879f9'},
  11:{title:'The Illuminator',emoji:'✨',color:'#c9a84c'},
  22:{title:'The Master Builder',emoji:'❖',color:'#c9a84c'},
  33:{title:'The Master Teacher',emoji:'❤',color:'#c9a84c'},
}

export default function ProfileCardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [social, setSocial] = useState<any>(null)
  const [avatar, setAvatar] = useState<string|null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [shareMode, setShareMode] = useState<'card'|'numbers'|'full'>('card')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const p = localStorage.getItem(KEY_PROFILE)
    if (p) setProfile(JSON.parse(p))
    const s = localStorage.getItem(KEY_SOCIAL)
    if (s) setSocial(JSON.parse(s))
    const a = localStorage.getItem(KEY_AVATAR)
    if (a) setAvatar(a)
    const l = localStorage.getItem(KEY_LOGS)
    if (l) setLogs(JSON.parse(l))
  }, [])

  const lp = profile?.lifePathNumber
  const archetype = lp ? LP_ARCHETYPES[lp] : null
  const topNumbers = [...new Set(logs.map((l:any) => l.number))].slice(0,5)
  const totalLogs = logs.length
  const streak = Math.min(totalLogs, 7)
  const displayName = social?.displayName || 'Cosmic Soul'
  const bio = social?.bio || 'Walking the path of synchronicity'

  function copyCard() {
    const text = [
      '✦ SynchroSoul Profile Card',
      '',
      'Name: ' + displayName,
      lp ? 'Life Path: ' + lp + ' — ' + (archetype?.title || '') : '',
      profile?.soulUrgeNumber ? 'Soul Urge: ' + profile.soulUrgeNumber : '',
      profile?.destinyNumber ? 'Destiny: ' + profile.destinyNumber : '',
      '',
      topNumbers.length ? 'My Numbers: ' + topNumbers.join(' · ') : '',
      '',
      bio,
      '',
      'Find me on SynchroSoul ✨',
    ].filter(Boolean).join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }
  const accentColor = archetype?.color || '#a78bfa'

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Cosmic Profile Card</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Your shareable spiritual identity</p>
      </div>

      {/* THE CARD */}
      <div ref={cardRef} style={{ background: 'linear-gradient(135deg, rgba(20,10,50,0.98) 0%, rgba(8,6,28,0.98) 50%, rgba(30,10,40,0.98) 100%)', border: '1px solid '+accentColor+'44', borderRadius: '1.5rem', padding: '2rem', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '-30%', right: '-20%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, '+accentColor+'15 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', position: 'relative' }}>
          <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', border: '2px solid '+accentColor+'55', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, '+accentColor+'22, rgba(167,139,250,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            {avatar ? <img src={avatar} alt='avatar' style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (archetype?.emoji || '✦')}
          </div>
          <div>
            <div style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{displayName}</div>
            {archetype && <div style={{ color: accentColor, fontSize: '0.78rem', letterSpacing: '0.08em' }}>{archetype.emoji} {archetype.title}</div>}
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SynchroSoul</div>
            <div style={{ color: accentColor, fontSize: '0.7rem' }}>✦ Verified Soul</div>
          </div>
        </div>

        {/* Bio */}
        {bio && <p style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.82rem', margin: '0 0 1.25rem', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', position: 'relative' }}>&ldquo;{bio}&rdquo;</p>}

        {/* Numerology badges */}
        {profile && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', position: 'relative' }}>
            {[['Life Path', profile.lifePathNumber, accentColor], ['Soul Urge', profile.soulUrgeNumber, '#60a5fa'], ['Destiny', profile.destinyNumber, '#a78bfa']].map(([label, num, color]) => num && (
              <div key={String(label)} style={{ background: String(color)+'15', border: '1px solid '+String(color)+'33', borderRadius: '0.75rem', padding: '0.4rem 0.75rem', textAlign: 'center' }}>
                <div style={{ color: String(color), fontSize: '1rem', fontWeight: 700 }}>{num}</div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Angel numbers */}
        {topNumbers.length > 0 && (
          <div style={{ position: 'relative' }}>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>My Angel Numbers</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {topNumbers.map((n:string) => <span key={n} style={{ padding: '0.25rem 0.6rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontSize: '0.78rem', fontWeight: 600 }}>{n}</span>)}
            </div>
          </div>
        )}

        {/* Stats footer */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(200,180,255,0.06)', position: 'relative' }}>
          {[['✦', totalLogs, 'sightings'], ['🔥', streak, 'day streak'], ['✨', topNumbers.length, 'numbers']].map(([e,v,l]) => (
            <div key={String(l)} style={{ textAlign: 'center' }}>
              <div style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.9rem', fontWeight: 700 }}>{e} {v}</div>
              <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem' }}>
        <button onClick={copyCard} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.875rem', background: copied ? 'rgba(52,211,153,0.2)' : 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(201,168,76,0.3))', border: copied ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(167,139,250,0.3)', color: copied ? '#34d399' : 'rgba(220,200,255,0.9)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}>
          {copied ? '✓ Copied to Clipboard' : '📋 Copy Card Text'}
        </button>
      </div>

      {/* Setup prompt if no profile */}
      {!profile && (
        <div style={{ ...card, padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✨</div>
          <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.85rem', margin: '0 0 0.875rem' }}>Complete your numerology profile to unlock your full cosmic card</p>
          <a href='/auth/signup' style={{ display: 'inline-block', padding: '0.5rem 1.25rem', borderRadius: '2rem', background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', fontSize: '0.8rem', textDecoration: 'none' }}>Complete Profile →</a>
        </div>
      )}
    </div>
  )
}