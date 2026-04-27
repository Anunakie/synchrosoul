'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  getMusicalHealer,
  getHealerSongs,
  getHealerStreamLinks,
  getSongStreamLink,
  getSongStreamLinks,
  type MusicalHealer,
  type MusicalHealerSong,
} from '@/lib/musical-healers'

const card: React.CSSProperties = {
  background: 'rgba(8,6,28,0.88)',
  border: '1px solid rgba(200,180,255,0.1)',
  borderRadius: '1.25rem',
  backdropFilter: 'blur(12px)',
}

const pillStyle: React.CSSProperties = {
  background: 'rgba(167,139,250,0.1)',
  border: '1px solid rgba(167,139,250,0.2)',
  borderRadius: '999px',
  padding: '0.15rem 0.5rem',
  fontSize: '0.62rem',
  color: 'rgba(167,139,250,0.7)',
  textTransform: 'capitalize',
}

const goldPill: React.CSSProperties = {
  background: 'rgba(201,168,76,0.1)',
  border: '1px solid rgba(201,168,76,0.25)',
  borderRadius: '999px',
  padding: '0.15rem 0.5rem',
  fontSize: '0.62rem',
  color: 'rgba(201,168,76,0.8)',
}

function SongCard({ song }: { song: MusicalHealerSong }) {
  const [expanded, setExpanded] = useState(false)
  const primaryLink = getSongStreamLink(song)
  const allLinks = getSongStreamLinks(song)

  return (
    <div style={{ ...card, padding: '1rem', transition: 'border-color 0.2s' }}>
      {/* Song Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        {/* Cover Art */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '0.5rem', flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(167,139,250,0.2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {song.cover_art_url
            ? <img src={song.cover_art_url} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '1.5rem' }}>🎵</span>
          }
        </div>

        {/* Song Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ color: 'rgba(220,200,255,0.95)', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
            {song.title}
          </h3>
          {song.genre && (
            <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.7rem', margin: '0.15rem 0 0', textTransform: 'capitalize' }}>
              {song.genre}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      {song.description && (
        <div style={{ marginTop: '0.75rem' }}>
          <p style={{
            color: 'rgba(180,160,255,0.6)', fontSize: '0.78rem', margin: 0,
            lineHeight: 1.6,
            ...(expanded ? {} : { overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }),
          }}>
            {song.description}
          </p>
          {song.description.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{ background: 'none', border: 'none', color: 'rgba(167,139,250,0.6)', fontSize: '0.72rem', cursor: 'pointer', padding: '0.25rem 0', marginTop: '0.25rem' }}
            >
              {expanded ? '▲ Show less' : '▼ Read more'}
            </button>
          )}
        </div>
      )}

      {/* Angel Numbers */}
      {song.angel_numbers.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.65rem' }}>
          {song.angel_numbers.map(num => (
            <span key={num} style={goldPill}>✦ {num}</span>
          ))}
        </div>
      )}

      {/* Themes + Moods + Healing Styles + Spiritual Concepts */}
      {(song.themes.length > 0 || song.moods.length > 0 || (song.healing_styles && song.healing_styles.length > 0) || (song.spiritual_concepts && song.spiritual_concepts.length > 0)) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
          {song.themes.map(t => <span key={`t-${t}`} style={pillStyle}>{t}</span>)}
          {song.moods.map(m => (
            <span key={`m-${m}`} style={{ ...pillStyle, background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: 'rgba(96,165,250,0.7)' }}>{m}</span>
          ))}
          {(song.healing_styles || []).map(s => (
            <span key={`hs-${s}`} style={{ ...pillStyle, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: 'rgba(74,222,128,0.7)' }}>{s}</span>
          ))}
          {(song.spiritual_concepts || []).map(c => (
            <span key={`sc-${c}`} style={{ ...pillStyle, background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', color: 'rgba(236,72,153,0.7)' }}>{c}</span>
          ))}
        </div>
      )}

      {/* Oracle-Assigned Tags */}
      {song.oracle_tags && song.oracle_tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.35rem' }}>
          {song.oracle_tags.map(t => (
            <span key={`ot-${t}`} style={{ ...pillStyle, background: 'rgba(160,120,255,0.1)', border: '1px solid rgba(160,120,255,0.2)', color: 'rgba(160,120,255,0.7)', fontStyle: 'italic' }}>✦ {t}</span>
          ))}
        </div>
      )}


      {/* Primary Listen Button */}
      {primaryLink && (
        <a
          href={primaryLink.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            marginTop: '0.75rem', padding: '0.5rem 1rem',
            background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(167,139,250,0.2))',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '0.75rem',
            color: '#c9a84c', fontSize: '0.78rem', fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          ▶ Listen on {primaryLink.platform}
        </a>
      )}

      {/* All Streaming Platform Links */}
      {allLinks.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {allLinks.map(link => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.65rem', color: 'rgba(180,160,255,0.4)', textDecoration: 'none' }}
            >
              {link.emoji} {link.platform}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MusicalHealerProfilePage() {
  const params = useParams()
  const id = params?.id as string
  const [healer, setHealer] = useState<(MusicalHealer & { resolved_avatar_url: string | null; resolved_avatar_color: string }) | null>(null)
  const [songs, setSongs] = useState<MusicalHealerSong[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    Promise.all([
      getMusicalHealer(id),
      getHealerSongs(id),
    ]).then(([h, s]) => {
      setHealer(h)
      setSongs(s)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</div>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem' }}>Loading artist profile...</p>
      </div>
    )
  }

  if (!healer) {
    return (
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎵</div>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem' }}>Artist not found.</p>
        <Link href="/dashboard/musical-healers" style={{ color: 'rgba(167,139,250,0.5)', fontSize: '0.78rem', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>← Back to Musical Healers</Link>
      </div>
    )
  }

  const streamLinks = getHealerStreamLinks(healer)

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.25rem 1rem 6rem' }}>
      {/* Back nav */}
      <Link href="/dashboard/musical-healers" style={{ color: 'rgba(167,139,250,0.5)', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>← Musical Healers</Link>

      {/* Hero Card */}
      <div style={{ ...card, padding: '1.5rem', textAlign: 'center', marginBottom: '1rem' }}>
        {/* Avatar — uses custom artist avatar, falls back to main profile avatar, then emoji */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 0.75rem',
          background: healer.resolved_avatar_url ? 'transparent' : `linear-gradient(135deg, ${healer.resolved_avatar_color || '#9b59b6'}, rgba(167,139,250,0.3))`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', overflow: 'hidden',
          border: '2px solid rgba(201,168,76,0.3)',
        }}>
          {healer.resolved_avatar_url
            ? <img src={healer.resolved_avatar_url} alt={healer.artist_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : '🎵'
          }
        </div>

        {/* Name + Badge */}
        <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1.5rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>
          {healer.artist_name}
        </h1>
        {healer.is_verified && (
          <span style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.65rem', color: '#c9a84c', fontWeight: 700 }}>✦ Verified Musical Healer</span>
        )}

        {/* Genres */}
        {healer.genres.length > 0 && (
          <p style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.75rem', margin: '0.5rem 0 0', textTransform: 'capitalize' }}>
            {healer.genres.join(' • ')}
          </p>
        )}
      </div>

      {/* Bio */}
      {healer.bio && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', color: 'rgba(201,168,76,0.8)', margin: '0 0 0.5rem', fontWeight: 400 }}>About</h2>
          <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-line' }}>
            {healer.bio}
          </p>
        </div>
      )}

      {/* Spiritual Themes + Healing Styles */}
      {(healer.spiritual_themes.length > 0 || healer.healing_styles.length > 0) && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
          {healer.spiritual_themes.length > 0 && (
            <div style={{ marginBottom: healer.healing_styles.length > 0 ? '0.75rem' : 0 }}>
              <h3 style={{ fontSize: '0.7rem', color: 'rgba(180,160,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.4rem' }}>Spiritual Themes</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {healer.spiritual_themes.map(t => <span key={t} style={pillStyle}>{t}</span>)}
              </div>
            </div>
          )}
          {healer.healing_styles.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.7rem', color: 'rgba(180,160,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 0.4rem' }}>Healing Styles</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {healer.healing_styles.map(s => <span key={s} style={{ ...pillStyle, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', color: 'rgba(74,222,128,0.7)' }}>{s}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Streaming & Links */}
      {streamLinks.length > 0 && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1rem', color: 'rgba(201,168,76,0.8)', margin: '0 0 0.65rem', fontWeight: 400 }}>Listen & Connect</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {streamLinks.map(link => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 0.85rem',
                  background: 'rgba(200,180,255,0.04)',
                  border: '1px solid rgba(200,180,255,0.08)',
                  borderRadius: '0.65rem',
                  color: 'rgba(220,200,255,0.8)',
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
              >
                <span style={{ fontSize: '1rem' }}>{link.emoji}</span>
                <span>{link.platform}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Songs */}
      {songs.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1.1rem', color: 'rgba(201,168,76,0.8)', margin: '0 0 0.75rem', fontWeight: 400 }}>
            🎵 Healing Music ({songs.length} {songs.length === 1 ? 'song' : 'songs'})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {songs.map(song => <SongCard key={song.id} song={song} />)}
          </div>
        </div>
      )}

      {/* Empty Songs */}
      {songs.length === 0 && (
        <div style={{ ...card, padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.82rem' }}>No songs published yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
