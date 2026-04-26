'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getMusicalHealers, getHealerStreamLinks, type MusicalHealer } from '@/lib/musical-healers'

const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

function VerifiedBadge({ verified }: { verified: boolean }) {
  if (!verified) return null
  return (
    <span style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.6rem', color: '#c9a84c', fontWeight: 700 }}>✦ Verified Artist</span>
  )
}

export default function MusicalHealersPage() {
  const [healers, setHealers] = useState<(MusicalHealer & { resolved_avatar_url: string | null; resolved_avatar_color: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getMusicalHealers().then(data => {
      setHealers(data)
      setLoading(false)
    })
  }, [])

  const filtered = healers.filter(h => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      h.artist_name.toLowerCase().includes(q) ||
      h.healing_styles.some(s => s.toLowerCase().includes(q)) ||
      h.spiritual_themes.some(t => t.toLowerCase().includes(q)) ||
      h.genres.some(g => g.toLowerCase().includes(q))
    )
  })

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.25rem 1rem 6rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎵</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1.6rem', color: 'rgba(220,200,255,0.9)', margin: '0 0 0.25rem', fontWeight: 400 }}>
          Musical Healers
        </h1>
        <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.78rem', margin: 0 }}>
          Discover musicians whose healing music resonates with your spiritual journey
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Search by name, genre, theme, or style..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            background: 'rgba(8,6,28,0.6)',
            border: '1px solid rgba(200,180,255,0.15)',
            borderRadius: '0.75rem',
            color: 'rgba(220,200,255,0.9)',
            fontSize: '0.85rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ ...card, padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✦</div>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem' }}>Discovering musical healers...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div style={{ ...card, padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎹</div>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem' }}>
            {search ? 'No musical healers match your search.' : 'No musical healers yet. Be the first!'}
          </p>
        </div>
      )}

      {/* Healer Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(healer => {
          const links = getHealerStreamLinks(healer)
          return (
            <Link
              key={healer.id}
              href={`/dashboard/musical-healers/${healer.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ ...card, padding: '1.25rem', transition: 'border-color 0.2s', cursor: 'pointer' }}>
                {/* Top Row: Avatar + Name + Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: healer.resolved_avatar_url ? 'transparent' : `linear-gradient(135deg, ${healer.resolved_avatar_color || '#9b59b6'}, rgba(167,139,250,0.3))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.25rem', flexShrink: 0,
                    overflow: 'hidden',
                  }}>
                    {healer.resolved_avatar_url
                      ? <img src={healer.resolved_avatar_url} alt={healer.artist_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : '🎵'
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1rem', fontWeight: 600 }}>{healer.artist_name}</span>
                      <VerifiedBadge verified={healer.is_verified} />
                    </div>
                    {healer.genres.length > 0 && (
                      <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', margin: '0.15rem 0 0', textTransform: 'capitalize' }}>
                        {healer.genres.slice(0, 3).join(' • ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bio Preview */}
                {healer.bio && (
                  <p style={{
                    color: 'rgba(180,160,255,0.55)', fontSize: '0.78rem', margin: '0 0 0.75rem',
                    lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                  }}>
                    {healer.bio}
                  </p>
                )}

                {/* Themes */}
                {healer.spiritual_themes.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.65rem' }}>
                    {healer.spiritual_themes.slice(0, 5).map(theme => (
                      <span key={theme} style={{
                        background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)',
                        borderRadius: '999px', padding: '0.15rem 0.5rem',
                        fontSize: '0.62rem', color: 'rgba(167,139,250,0.7)', textTransform: 'capitalize',
                      }}>{theme}</span>
                    ))}
                  </div>
                )}

                {/* Streaming Links */}
                {links.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {links.slice(0, 4).map(link => (
                      <span key={link.platform} style={{ fontSize: '0.65rem', color: 'rgba(180,160,255,0.35)' }}>
                        {link.emoji} {link.platform}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Back Link */}
      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link href="/dashboard/explore" style={{ color: 'rgba(167,139,250,0.5)', fontSize: '0.78rem', textDecoration: 'none' }}>← Back to Explore</Link>
      </div>
    </div>
  )
}
