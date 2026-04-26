'use client'
import Link from 'next/link'

export interface SongRecommendationData {
  songId: string
  songTitle: string
  songDescription: string | null
  songGenre: string | null
  songEmbedUrl: string | null
  songCoverArtUrl: string | null
  songAmazonMusicUrl: string | null
  songSpotifyUrl: string | null
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

  // Pick the best available streaming link
  const listenUrl = recommendation.songSpotifyUrl || recommendation.songAmazonMusicUrl || recommendation.songEmbedUrl || null
  const listenPlatform = recommendation.songSpotifyUrl ? 'Spotify' : recommendation.songAmazonMusicUrl ? 'Amazon Music' : recommendation.songEmbedUrl ? 'Stream' : null

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
        {listenUrl && (
          <a
            href={listenUrl}
            target="_blank"
            rel="noopener noreferrer"
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
            ▶ {isSimulation ? `Access on ${listenPlatform}` : `Listen on ${listenPlatform}`}
          </a>
        )}

        {/* View Artist Button */}
        <Link
          href={`/dashboard/musical-healers/${recommendation.healerId}`}
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
