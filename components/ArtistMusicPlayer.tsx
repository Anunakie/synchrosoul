"use client"
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { getAllArtistSongs, getSongEmbed, getSongStreamLinks, type ArtistSong } from '@/lib/musical-healers'

// Music from SynchroSoul artist profiles (Musical Healers).
// Replaces the old licensed track library, which is no longer used anywhere in the app.

const PLAYLIST_KEY = 'synchrosoul_artist_playlist'
// Saved favorites from the retired licensed library; those tracks no longer exist
const OLD_PLAYLIST_KEY = 'synchrosoul_music_playlist'

interface ArtistMusicPlayerProps {
  title?: string
  showHeader?: boolean
  compact?: boolean
}

export default function ArtistMusicPlayer({ title = 'Sacred Sounds', showHeader = true, compact = false }: ArtistMusicPlayerProps) {
  const [songs, setSongs] = useState<ArtistSong[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSong, setCurrentSong] = useState<ArtistSong | null>(null)
  const [search, setSearch] = useState('')
  const [playlist, setPlaylist] = useState<string[]>([])
  const [showPlaylist, setShowPlaylist] = useState(false)

  useEffect(() => {
    let cancelled = false
    getAllArtistSongs().then(data => {
      if (cancelled) return
      setSongs(data)
      setLoading(false)
      // Drop saved ids that no longer match a song (removed or deactivated)
      try {
        localStorage.removeItem(OLD_PLAYLIST_KEY)
        const saved = localStorage.getItem(PLAYLIST_KEY)
        if (saved) {
          const ids = new Set(data.map(s => s.id))
          const parsed = (JSON.parse(saved) as string[]).filter(id => ids.has(id))
          setPlaylist(parsed)
          localStorage.setItem(PLAYLIST_KEY, JSON.stringify(parsed))
        }
      } catch {}
    })
    return () => { cancelled = true }
  }, [])

  const togglePlaylist = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPlaylist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      try { localStorage.setItem(PLAYLIST_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const q = search.toLowerCase()
  const displayedSongs = showPlaylist
    ? songs.filter(s => playlist.includes(s.id))
    : songs.filter(s => s.title.toLowerCase().includes(q) || s.artist_name.toLowerCase().includes(q))

  const embed = currentSong ? getSongEmbed(currentSong) : null
  const links = currentSong ? getSongStreamLinks(currentSong) : []

  return (
    <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 16, padding: compact ? 16 : 20, backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      {showHeader && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>🎵</span>
          <h3 style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 600, margin: 0, flex: 1 }}>{title}</h3>
        </div>
      )}
      <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.5 }}>
        Music from SynchroSoul&apos;s Musical Healers.{' '}
        <Link href="/dashboard/musical-healers" style={{ color: 'rgba(201,168,76,0.85)' }}>Meet the artists</Link>
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => setShowPlaylist(p => !p)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
          borderRadius: 20, border: '1px solid',
          borderColor: showPlaylist ? '#e879a0' : 'rgba(255,255,255,0.2)',
          background: showPlaylist ? 'rgba(232,121,160,0.2)' : 'rgba(255,255,255,0.05)',
          color: showPlaylist ? '#e879a0' : 'rgba(255,255,255,0.7)',
          cursor: 'pointer', fontSize: 13
        }}>
          <span>♥</span>
          <span>My Playlist {playlist.length > 0 ? '(' + playlist.length + ')' : ''}</span>
        </button>
      </div>

      {/* Now playing */}
      {currentSong && (
        <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 14, padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, overflow: 'hidden' }}>
              {currentSong.cover_art_url
                ? <img src={currentSong.cover_art_url} alt={currentSong.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '🎶'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#c9a84c', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentSong.title}</div>
              <Link href={`/dashboard/musical-healers/${currentSong.healer_id}`} style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{currentSong.artist_name}</Link>
            </div>
            <button onClick={() => setCurrentSong(null)} title="Close player" style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.7)', cursor: 'pointer', fontSize: 16 }}>⏹</button>
          </div>
          {embed && (
            <iframe
              key={currentSong.id}
              src={embed.url}
              title={`${currentSong.title} by ${currentSong.artist_name}`}
              width="100%"
              height={embed.height}
              style={{ border: 0, borderRadius: 12, display: 'block', marginBottom: links.length ? 10 : 0 }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          )}
          {links.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {links.map(l => (
                <a key={l.platform} href={l.url} target="_blank" rel="noopener noreferrer" style={{
                  padding: '5px 10px', borderRadius: 20, border: '1px solid rgba(201,168,76,0.35)',
                  background: 'rgba(201,168,76,0.08)', color: 'rgba(201,168,76,0.9)', fontSize: 12, textDecoration: 'none'
                }}>
                  {l.emoji} {embed ? l.platform : `Listen on ${l.platform}`}
                </a>
              ))}
            </div>
          )}
          {!embed && links.length === 0 && (
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>This song doesn&apos;t have a listening link yet.</div>
          )}
        </div>
      )}

      {!showPlaylist && songs.length > 0 && (
        <input
          type="text" placeholder="🔍 Search songs or artists..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }}
        />
      )}

      {loading && (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', padding: 20, fontSize: 13 }}>Loading music...</div>
      )}

      {!loading && songs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 16px', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🎶</div>
          <div style={{ fontSize: 13 }}>New music from our artists is on its way.</div>
          <Link href="/dashboard/musical-healers" style={{ fontSize: 12, color: 'rgba(201,168,76,0.85)', display: 'inline-block', marginTop: 6 }}>Explore Musical Healers</Link>
        </div>
      )}

      {showPlaylist && playlist.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 16px', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>♥</div>
          <div style={{ fontSize: 13 }}>No saved songs yet</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>Tap ♡ on any song to save it here</div>
        </div>
      )}

      <div style={{ maxHeight: compact ? 220 : 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {displayedSongs.map(song => {
          const active = currentSong?.id === song.id
          return (
            <div key={song.id} style={{
              display: 'flex', alignItems: 'center', minHeight: 56,
              background: active ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
              border: '1px solid',
              borderColor: active ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)',
              borderRadius: 10
            }}>
              <button
                onClick={() => setCurrentSong(active ? null : song)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', flex: 1, minWidth: 0 }}
              >
                <span style={{ fontSize: 18, minWidth: 24, textAlign: 'center' }}>{active ? '🎶' : '🎵'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: active ? '#c9a84c' : 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{song.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{song.artist_name}{song.genre ? ` · ${song.genre}` : ''}</div>
                </div>
              </button>
              <button
                onClick={(e) => togglePlaylist(song.id, e)}
                title={playlist.includes(song.id) ? 'Remove from playlist' : 'Add to playlist'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px 14px', fontSize: 18, flexShrink: 0, color: playlist.includes(song.id) ? '#e879a0' : 'rgba(255,255,255,0.2)', transition: 'color 0.2s' }}
              >
                {playlist.includes(song.id) ? '♥' : '♡'}
              </button>
            </div>
          )
        })}
        {!loading && songs.length > 0 && displayedSongs.length === 0 && !showPlaylist && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: 20, fontSize: 13 }}>No songs found</div>
        )}
      </div>
    </div>
  )
}
