'use client'
import { useEffect, useState } from 'react'

const LIFE_PATH_ARCHETYPES: Record<number, string> = {
  1: 'The Pioneer', 2: 'The Peacemaker', 3: 'The Creator', 4: 'The Builder',
  5: 'The Freedom Seeker', 6: 'The Nurturer', 7: 'The Mystic', 8: 'The Achiever',
  9: 'The Humanitarian', 11: 'The Illuminator', 22: 'The Master Builder', 33: 'The Master Teacher'
}

export default function PublicProfilePage({ params }: { params: { userId: string } }) {
  const [profile, setProfile] = useState<any>(null)
  const [topNumbers, setTopNumbers] = useState<string[]>([])
  const [totalLogs, setTotalLogs] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/profile/' + params.userId)
        if (!res.ok) {
          setNotFound(true)
          setLoading(false)
          return
        }
        const data = await res.json()
        setProfile(data.profile)
        setTopNumbers(data.topNumbers || [])
        setTotalLogs(data.totalLogs || 0)
      } catch (e) {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.userId])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(167,139,250,0.7)', fontSize: '1rem', fontFamily: 'Cormorant Garamond,serif' }}>Loading cosmic profile...</div>
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '3rem' }}>✦</div>
      <div style={{ color: 'rgba(220,200,255,0.8)', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond,serif' }}>This soul is hidden from the cosmos</div>
      <a href="/" style={{ color: '#a78bfa', fontSize: '0.85rem', textDecoration: 'none' }}>Discover SynchroSoul →</a>
    </div>
  )

  const name = profile.display_name || 'Soul Seeker'
  const bio = profile.bio || null
  const lifePathNumber = profile.life_path
  const soulUrgeNumber = profile.soul_urge
  const destinyNumber = profile.destiny
  const avatarUrl = profile.avatar_url || null
  const archetype = lifePathNumber ? (LIFE_PATH_ARCHETYPES[lifePathNumber] || 'The Seeker') : 'The Seeker'
  const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#050510 0%,#0d0a2e 50%,#050510 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      {/* Stars bg */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} style={{ position: 'absolute', width: i % 5 === 0 ? '2px' : '1px', height: i % 5 === 0 ? '2px' : '1px', borderRadius: '50%', background: 'white', opacity: Math.random() * 0.6 + 0.1, left: Math.random() * 100 + '%', top: Math.random() * 100 + '%' }} />
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px' }}>
        {/* Card */}
        <div style={{ background: 'linear-gradient(135deg,#0d0a2e 0%,#1a0a3e 50%,#0a1a3e 100%)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 0 60px rgba(167,139,250,0.15)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(167,139,250,0.08)', filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(167,139,250,0.06)', filter: 'blur(30px)' }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid rgba(167,139,250,0.4)', overflow: 'hidden', flexShrink: 0, background: 'rgba(167,139,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: avatarUrl ? undefined : '1.4rem', color: '#a78bfa', fontWeight: 700 }}>
              {avatarUrl ? <img src={avatarUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" /> : initials}
            </div>
            <div>
              <div style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.15rem' }}>{name}</div>
              <div style={{ color: '#a78bfa', fontSize: '0.8rem', opacity: 0.85 }}>{archetype}</div>
              {totalLogs > 0 && <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', marginTop: '0.1rem' }}>{totalLogs} angel sightings logged</div>}
            </div>
          </div>

          {/* Bio */}
          {bio && <p style={{ color: 'rgba(200,180,255,0.6)', fontSize: '0.9rem', fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', margin: '0 0 1.25rem', lineHeight: 1.6 }}>&ldquo;{bio}&rdquo;</p>}

          {/* Numerology badges */}
          {lifePathNumber && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {([[lifePathNumber, 'Life Path', '#a78bfa'], [soulUrgeNumber, 'Soul Urge', '#c9a84c'], [destinyNumber, 'Destiny', '#60a5fa']] as [number|null, string, string][]).filter(([n]) => n).map(([num, label, col]) => (
                <div key={label} style={{ flex: 1, background: col + '10', border: '1px solid ' + col + '25', borderRadius: '0.875rem', padding: '0.5rem', textAlign: 'center' }}>
                  <div style={{ color: col, fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Cormorant Garamond,serif' }}>{num}</div>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Top numbers */}
          {topNumbers.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Signature Numbers</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {topNumbers.map(n => (
                  <span key={n} style={{ padding: '0.25rem 0.625rem', borderRadius: '0.5rem', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: '#a78bfa', fontSize: '0.85rem', fontWeight: 700 }}>{n}</span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(200,180,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>SYNCHROSOUL</span>
            <span style={{ color: '#a78bfa', fontSize: '0.7rem', opacity: 0.5 }}>✦ ✦ ✦</span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>See who shares your angel numbers</p>
          <a href="/" style={{ display: 'inline-block', padding: '0.625rem 1.5rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg,rgba(167,139,250,0.8),rgba(201,168,76,0.8))', color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>Join SynchroSoul ✦</a>
        </div>
      </div>
    </div>
  )
}
