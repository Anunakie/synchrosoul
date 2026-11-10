'use client'
import Link from 'next/link'

export interface SongRecommendationData {
  recommendationId?: string | null
  songId: string
  songTitle: string
  songDescription: string | null
  songGenre: string | null
  songEmbedUrl: string | null
  songCoverArtUrl: string | null
  songAmazonMusicUrl: string | null
  songSpotifyUrl: string | null
  // Added Nov 2026; older saved recommendations don't have these
  songAppleMusicUrl?: string | null
  songYoutubeUrl?: string | null
  songSoundcloudUrl?: string | null
  songTidalUrl?: string | null
  songBandcampUrl?: string | null
  healerId: string
  artistName: string
  healerAvatarUrl: string | null
  reason: string
}

interface Props {
  recommendation: SongRecommendationData
  mode?: 'spiritual' | 'simulation'
}

export default function SongRecommendationCard({ recommendation, mode = 'spiritual' }: Props) {
  const isSimulation = mode === 'simulation'

  // Every listening link the song has, in display order
  const links: { url: string; platform: string }[] = []
  const add = (url: string | null | undefined, platform: string) => { if (url) links.push({ url, platform }) }
  add(recommendation.songSpotifyUrl, 'Spotify')
  add(recommendation.songAppleMusicUrl, 'Apple Music')
  add(recommendation.songYoutubeUrl, 'YouTube')
  add(recommendation.songSoundcloudUrl, 'SoundCloud')
  add(recommendation.songAmazonMusicUrl, 'Amazon Music')
  add(recommendation.songTidalUrl, 'Tidal')
  add(recommendation.songBandcampUrl, 'Bandcamp')
  if (links.length === 0) add(recommendation.songEmbedUrl, 'Stream')
  const primary = links[0] || null
  const others = links.slice(1)

  // Tell the server this recommendation was clicked (for artist/admin stats)
  const trackClick = () => {
    if (!recommendation.recommendationId) return
    try {
      fetch('/api/musical-healers/recommend/click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendationId: recommendation.recommendationId }),
        keepalive: true,
      }).catch(() => {})
    } catch {}
  }

  return (
    <div style={{
      background: isSimulation ? 'rgba(0,20,0,0.6)' : 'rgba(8,6,28,0.88)',
      border: isSimulation ? '1px solid rgba(0,255,65,0.15)' : '1px solid rgba(201,168,76,0.2)',
      borderRadius: '1.25rem',
      backdropFilter: 'blur(12px)',
      padding: '1rem 1.25rem',
      marginTop: '1rem',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        marginBottom: '0.75rem',
        color: isSimulation ? 'rgba(0,255,65,0.5)' : 'rgba(201,168,76,0.6)',
        fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700,
      }}>
        <span>{isSimulation ? '📡' : '🎵'}</span>
        <span>{isSimulation ? 'AUDIO FREQUENCY MATCH' : 'Healing Music for This Moment'}</span>
      </div>

      {/* Song Info Row */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        {/* Cover Art */}
        <div style={{
          width: '48px', height: '48px', borderRadius: '0.5rem', flexShrink: 0,
          background: isSimulation
            ? 'rgba(0,255,65,0.05)'
            : 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(167,139,250,0.2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          border: isSimulation ? '1px solid rgba(0,255,65,0.1)' : '1px solid rgba(201,168,76,0.15)',
        }}>
          {recommendation.songCoverArtUrl
            ? <img src={recommendation.songCoverArtUrl} alt={recommendation.songTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ fontSize: '1.25rem' }}>{isSimulation ? '📡' : '🎵'}</span>
          }
        </div>

        {/* Title + Artist */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            color: isSimulation ? 'rgba(0,255,65,0.9)' : 'rgba(220,200,255,0.95)',
            fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.3,
          }}>
            &ldquo;{recommendation.songTitle}&rdquo;
          </div>
          <div style={{
            color: isSimulation ? 'rgba(0,255,65,0.4)' : 'rgba(180,160,255,0.5)',
            fontSize: '0.75rem', marginTop: '0.1rem',
          }}>
            {isSimulation ? `Source: ${recommendation.artistName}` : `by ${recommendation.artistName}`}
          </div>
        </div>
      </div>

      {/* AI Reasoning */}
      {recommendation.reason && (
        <p style={{
          color: isSimulation ? 'rgba(0,255,65,0.5)' : 'rgba(180,160,255,0.55)',
          fontSize: '0.75rem', lineHeight: 1.5,
          margin: '0.65rem 0 0',
          fontStyle: 'italic',
        }}>
          {isSimulation ? `Signal analysis: ${recommendation.reason}` : recommendation.reason}
        </p>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        {/* Listen Button */}
        {primary && (
          <a
            href={primary.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackClick}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              background: isSimulation
                ? 'rgba(0,255,65,0.08)'
                : 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(167,139,250,0.2))',
              border: isSimulation
                ? '1px solid rgba(0,255,65,0.2)'
                : '1px solid rgba(201,168,76,0.3)',
              borderRadius: '0.6rem',
              color: isSimulation ? 'rgba(0,255,65,0.8)' : '#c9a84c',
              fontSize: '0.75rem', fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}
          >
            ▶ {isSimulation ? `Access on ${primary.platform}` : `Listen on ${primary.platform}`}
          </a>
        )}

        {/* Other platforms */}
        {others.map(l => (
          <a
            key={l.platform}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackClick}
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '0.45rem 0.7rem',
              background: 'transparent',
              border: isSimulation
                ? '1px solid rgba(0,255,65,0.12)'
                : '1px solid rgba(201,168,76,0.2)',
              borderRadius: '0.6rem',
              color: isSimulation ? 'rgba(0,255,65,0.6)' : 'rgba(201,168,76,0.8)',
              fontSize: '0.7rem',
              textDecoration: 'none',
            }}
          >
            {l.platform}
          </a>
        ))}

        {/* View Artist Button */}
        <Link
          href={`/dashboard/musical-healers/${recommendation.healerId}`}
          onClick={trackClick}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.45rem 0.85rem',
            background: 'transparent',
            border: isSimulation
              ? '1px solid rgba(0,255,65,0.12)'
              : '1px solid rgba(200,180,255,0.1)',
            borderRadius: '0.6rem',
            color: isSimulation ? 'rgba(0,255,65,0.5)' : 'rgba(167,139,250,0.6)',
            fontSize: '0.75rem',
            textDecoration: 'none',
            transition: 'background 0.2s',
          }}
        >
          {isSimulation ? 'Source Profile →' : 'View Artist →'}
        </Link>
      </div>
    </div>
  )
}
