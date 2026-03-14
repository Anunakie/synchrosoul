"use client"
import { useState, useRef, useEffect, useCallback } from 'react'
import FeatureGate from './FeatureGate'

interface Track {
  id: string
  title: string
  artist: string
  category: string
  url: string
}

const TRACKS: Track[] = [
  { id: 'dunes', title: 'Dunes', artist: 'Valante', category: 'sleep', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Dunes%20-%20Valante.mp3' },
  { id: 'ebb', title: 'Ebb', artist: 'Bomull', category: 'sleep', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_ebb%20-%20bomull.mp3' },
  { id: 'fjalldrommar', title: 'Fjalldrommar', artist: 'Center of Attention', category: 'sleep', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Fjalldrommar%20-%20Center%20of%20Attention.mp3' },
  { id: 'havsdrommar', title: 'Havsdrommar', artist: 'Center of Attention', category: 'sleep', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Havsdrommar%20-%20Center%20of%20Attention.mp3' },
  { id: 'nattdrommar', title: 'Nattdrommar', artist: 'Center of Attention', category: 'sleep', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Nattdrommar%20-%20Center%20of%20Attention.mp3' },
  { id: 'gilded', title: 'Gilded Stillness', artist: 'DEX 1200', category: 'sleep', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Gilded%20Stillness%20-%20DEX%201200.mp3' },
  { id: 'lush', title: 'Lush Infinity', artist: 'DEX 1200', category: 'sleep', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Lush%20Infinity%20-%20DEX%201200.mp3' },
  { id: 'songfjord', title: 'Songfjord', artist: 'DEX 1200', category: 'sleep', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Songfjord%20-%20DEX%201200.mp3' },
  { id: 'slowdancing', title: 'Slow Dancing on Water', artist: 'Center of Attention', category: 'sleep', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Slow%20Dancing%20on%20Water%20-%20Center%20of%20Attention.mp3' },
  { id: 'stillpoint', title: 'Stillpoint', artist: 'Center of Attention', category: 'sleep', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Stillpoint%20-%20Center%20of%20Attention.mp3' },
  { id: 'stateofmed', title: 'State of Meditation', artist: 'Elm Lake', category: 'meditation', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_State%20of%20Meditation%20-%20Elm%20Lake.mp3' },
  { id: 'mindstream', title: 'Mindstream', artist: 'Amber Glow', category: 'meditation', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Mindstream%20-%20Amber%20Glow.mp3' },
  { id: 'enlightened', title: 'Enlightened Drift', artist: 'Amber Glow', category: 'meditation', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Enlightened%20Drift%20-%20Amber%20Glow.mp3' },
  { id: 'sonzai', title: 'Sonzai', artist: 'Valante', category: 'meditation', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Sonzai%20-%20Valante.mp3' },
  { id: 'grounded', title: 'Grounded', artist: 'Hanna Lindgren', category: 'meditation', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Grounded%20-%20Hanna%20Lindgren.mp3' },
  { id: 'thawing', title: 'Thawing', artist: 'Shuta Yasukochi', category: 'meditation', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Thawing%20-%20Shuta%20Yasukochi.mp3' },
  { id: 'tangled', title: 'Tangled Reflections', artist: 'Luba Hilman', category: 'meditation', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Tangled%20Reflections%20-%20Luba%20Hilman.mp3' },
  { id: 'meadow', title: 'Meadow Waves', artist: 'Rand Aldo', category: 'nature', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Meadow%20Waves%20-%20Rand%20Aldo.mp3' },
  { id: 'birds', title: 'Birds of Lydia', artist: 'Rand Aldo', category: 'nature', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Birds%20of%20Lydia%20-%20Rand%20Aldo.mp3' },
  { id: 'birdsong', title: 'Birdsong by the River', artist: 'Center of Attention', category: 'nature', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Birdsong%20by%20the%20River%20-%20Center%20of%20Attention.mp3' },
  { id: 'greenembrace', title: 'A Green Embrace', artist: 'Rand Aldo', category: 'nature', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_A%20Green%20Embrace%20-%20Rand%20Aldo.mp3' },
  { id: 'deepspace', title: 'Deep Space Garden', artist: 'Rand Aldo', category: 'nature', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Deep%20Space%20Garden%20-%20Rand%20Aldo.mp3' },
  { id: 'healingtides', title: 'Healing Tides', artist: 'Amber Glow', category: 'healing', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Healing%20Tides%20-%20Amber%20Glow.mp3' },
  { id: 'justbreathe', title: 'Just Breathe', artist: 'Amber Glow', category: 'healing', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Just%20Breathe%20-%20Amber%20Glow.mp3' },
  { id: 'stilllove', title: 'Still Love', artist: 'Hanna Lindgren', category: 'healing', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Still%20Love%20-%20Hanna%20Lindgren.mp3' },
  { id: 'bliss', title: 'Bliss', artist: 'Harbours & Oceans', category: 'healing', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Bliss%20-%20Harbours%20%26%20Oceans.mp3' },
  { id: 'blossom', title: 'Blossom', artist: 'Luwaks', category: 'healing', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Blossom%20-%20Luwaks.mp3' },
  { id: 'carried', title: 'Carried by Current', artist: 'Valante', category: 'healing', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Carried%20by%20Current%20-%20Valante.mp3' },
  { id: 'crowned', title: 'Crowned With Spirit', artist: 'Valante', category: 'uplifting', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Crowned%20With%20Spirit%20-%20Valante.mp3' },
  { id: 'daretodream', title: 'Dare to Dream', artist: 'Center of Attention', category: 'uplifting', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Dare%20to%20Dream%20-%20Center%20of%20Attention.mp3' },
  { id: 'smallhope', title: 'A Small Hope', artist: 'Center of Attention', category: 'uplifting', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_A%20Small%20Hope%20-%20Center%20of%20Attention.mp3' }
]

const PLAYLIST_KEY = 'synchrosoul_music_playlist'

const CAT_EMOJI: Record<string, string> = {
  sleep: '🌙', meditation: '🧘', healing: '💚',
  nature: '🌿', uplifting: '🌟'
}

export default function SleepSounds() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playAll, setPlayAll] = useState(false)
  const [loopPlaylist, setLoopPlaylist] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [search, setSearch] = useState('')
  const [playlist, setPlaylist] = useState<string[]>([])
  const [showPlaylist, setShowPlaylist] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const playAllRef = useRef(false)
  const loopPlaylistRef = useRef(false)
  const currentTrackRef = useRef<Track | null>(null)
  const playlistRef = useRef<string[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PLAYLIST_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        setPlaylist(parsed)
        playlistRef.current = parsed
      }
    } catch {}
  }, [])

  const togglePlaylist = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPlaylist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      playlistRef.current = next
      try { localStorage.setItem(PLAYLIST_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const displayedTracks = showPlaylist
    ? TRACKS.filter(t => playlist.includes(t.id))
    : TRACKS.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.artist.toLowerCase().includes(search.toLowerCase())
      )

  const stopProgress = useCallback(() => {
    if (progressRef.current) { clearInterval(progressRef.current); progressRef.current = null }
  }, [])

  const startProgress = useCallback(() => {
    stopProgress()
    progressRef.current = setInterval(() => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime)
        setDuration(audioRef.current.duration || 0)
      }
    }, 500)
  }, [stopProgress])

  const playTrack = useCallback((track: Track, isPlayAllMode = false, isLoopMode = false) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    const audio = new Audio(track.url)
    audio.volume = volume
    audio.loop = !isPlayAllMode && !isLoopMode
    audioRef.current = audio
    currentTrackRef.current = track

    audio.addEventListener('ended', () => {
      const inPlayAll = playAllRef.current
      const inLoopPlaylist = loopPlaylistRef.current
      if (inLoopPlaylist) {
        const plist = playlistRef.current
        const playlistTracks = TRACKS.filter(t => plist.includes(t.id))
        if (playlistTracks.length === 0) return
        const cur = currentTrackRef.current
        if (!cur) return
        const idx = playlistTracks.findIndex(t => t.id === cur.id)
        const nextIdx = (idx + 1) % playlistTracks.length
        playTrack(playlistTracks[nextIdx], false, true)
      } else if (inPlayAll) {
        const cur = currentTrackRef.current
        if (!cur) return
        const idx = TRACKS.findIndex(t => t.id === cur.id)
        playTrack(TRACKS[(idx + 1) % TRACKS.length], true, false)
      }
    })

    audio.play().then(() => {
      setCurrentTrack(track)
      setIsPlaying(true)
      startProgress()
    }).catch(console.error)
  }, [volume, startProgress])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause(); setIsPlaying(false); stopProgress()
    } else {
      audioRef.current.play(); setIsPlaying(true); startProgress()
    }
  }, [isPlaying, startProgress, stopProgress])

  const stopAll = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; audioRef.current = null }
    stopProgress()
    setCurrentTrack(null); setIsPlaying(false); setProgress(0); setDuration(0)
  }, [stopProgress])

  const nextTrack = useCallback(() => {
    const cur = currentTrackRef.current
    if (!cur) return
    if (loopPlaylistRef.current) {
      const plist = playlistRef.current
      const playlistTracks = TRACKS.filter(t => plist.includes(t.id))
      if (playlistTracks.length === 0) return
      const idx = playlistTracks.findIndex(t => t.id === cur.id)
      playTrack(playlistTracks[(idx + 1) % playlistTracks.length], false, true)
    } else {
      const idx = TRACKS.findIndex(t => t.id === cur.id)
      playTrack(TRACKS[(idx + 1) % TRACKS.length], playAllRef.current, false)
    }
  }, [playTrack])

  const prevTrack = useCallback(() => {
    const cur = currentTrackRef.current
    if (!cur) return
    if (loopPlaylistRef.current) {
      const plist = playlistRef.current
      const playlistTracks = TRACKS.filter(t => plist.includes(t.id))
      if (playlistTracks.length === 0) return
      const idx = playlistTracks.findIndex(t => t.id === cur.id)
      playTrack(playlistTracks[(idx - 1 + playlistTracks.length) % playlistTracks.length], false, true)
    } else {
      const idx = TRACKS.findIndex(t => t.id === cur.id)
      playTrack(TRACKS[(idx - 1 + TRACKS.length) % TRACKS.length], playAllRef.current, false)
    }
  }, [playTrack])

  const handlePlayAll = useCallback(() => {
    const next = !playAll
    setPlayAll(next)
    playAllRef.current = next
    if (next) {
      setLoopPlaylist(false)
      loopPlaylistRef.current = false
      const start = currentTrackRef.current || TRACKS[0]
      playTrack(start, true, false)
    } else {
      if (audioRef.current) audioRef.current.loop = true
    }
  }, [playAll, playTrack])

  const handleLoopPlaylist = useCallback(() => {
    const plist = playlistRef.current
    const playlistTracks = TRACKS.filter(t => plist.includes(t.id))
    if (playlistTracks.length === 0) return
    const next = !loopPlaylist
    setLoopPlaylist(next)
    loopPlaylistRef.current = next
    if (next) {
      setPlayAll(false)
      playAllRef.current = false
      const cur = currentTrackRef.current
      const startTrack = (cur && plist.includes(cur.id)) ? cur : playlistTracks[0]
      playTrack(startTrack, false, true)
    } else {
      if (audioRef.current) audioRef.current.loop = true
    }
  }, [loopPlaylist, playTrack])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => { return () => { stopAll() } }, [stopAll])

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    return String(Math.floor(s / 60)) + ':' + String(Math.floor(s % 60)).padStart(2, '0')
  }

  return (
    <FeatureGate feature="sleep_sounds">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Controls row */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {showPlaylist ? (
            <button onClick={handleLoopPlaylist} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              borderRadius: 20, border: '1px solid',
              borderColor: loopPlaylist ? '#e879a0' : 'rgba(255,255,255,0.2)',
              background: loopPlaylist ? 'rgba(232,121,160,0.25)' : 'rgba(255,255,255,0.05)',
              color: loopPlaylist ? '#e879a0' : 'rgba(255,255,255,0.7)',
              cursor: 'pointer', fontSize: 13, fontWeight: 600
            }}>
              <span>🔁</span>
              <span>{loopPlaylist ? 'Looping Playlist' : 'Loop Playlist'}</span>
            </button>
          ) : (
            <button onClick={handlePlayAll} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px',
              borderRadius: 20, border: '1px solid',
              borderColor: playAll ? '#c9a84c' : 'rgba(255,255,255,0.2)',
              background: playAll ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.05)',
              color: playAll ? '#c9a84c' : 'rgba(255,255,255,0.7)',
              cursor: 'pointer', fontSize: 13, fontWeight: 600
            }}>
              <span>{playAll ? '🔁' : '⏩⏩'}</span>
              <span>{playAll ? 'Playing All' : 'Play All'}</span>
            </button>
          )}
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
        {currentTrack && (
          <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 14, padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {isPlaying ? '🎵' : '🎶'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#c9a84c', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.4' }}>
                  {currentTrack.title}
                  {playAll && <span style={{ marginLeft: 6, fontSize: 10, color: 'rgba(201,168,76,0.6)', background: 'rgba(201,168,76,0.1)', padding: '1px 6px', borderRadius: 10 }}>🔁 Auto</span>}
                  {loopPlaylist && <span style={{ marginLeft: 6, fontSize: 10, color: 'rgba(232,121,160,0.8)', background: 'rgba(232,121,160,0.1)', padding: '1px 6px', borderRadius: 10 }}>🔁 Playlist</span>}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{currentTrack.artist}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button onClick={prevTrack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 18 }}>⏮</button>
                <button onClick={togglePlay} style={{ background: 'rgba(201,168,76,0.3)', border: '1px solid rgba(201,168,76,0.5)', borderRadius: '50%', width: 40, height: 40, color: '#c9a84c', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button onClick={nextTrack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 18 }}>⏭</button>
                <button onClick={stopAll} style={{ background: 'none', border: 'none', color: 'rgba(255,80,80,0.7)', cursor: 'pointer', fontSize: 16 }}>⏹</button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{fmt(progress)}</span>
              <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #c9a84c, #e8c96d)', width: duration ? ((progress / duration) * 100) + '%' : '0%', transition: 'width 0.5s linear', borderRadius: 2 }} />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{fmt(duration)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>🔊</span>
              <input type="range" min={0} max={1} step={0.05} value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: '#c9a84c' }}
              />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{Math.round(volume * 100)}%</span>
            </div>
          </div>
        )}

        {!showPlaylist && (
          <input
            type="text" placeholder="🔍 Search tracks..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }}
          />
        )}

        {showPlaylist && playlist.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 16px', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>♥</div>
            <div style={{ fontSize: 13 }}>No saved tracks yet</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>Tap ♡ on any track to save it here</div>
          </div>
        )}

        <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {displayedTracks.map(track => (
            <div key={track.id} style={{
              display: 'flex', alignItems: 'center', minHeight: 56,
              background: currentTrack?.id === track.id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
              border: '1px solid',
              borderColor: currentTrack?.id === track.id ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)',
              borderRadius: 10
            }}>
              <button
                onClick={() => currentTrack?.id === track.id ? togglePlay() : playTrack(track, playAllRef.current, loopPlaylistRef.current)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', flex: 1, minWidth: 0 }}
              >
                <span style={{ fontSize: 18, minWidth: 24, textAlign: 'center' }}>
                  {currentTrack?.id === track.id && isPlaying ? '⏸' : (CAT_EMOJI[track.category] || '▶')}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: currentTrack?.id === track.id ? '#c9a84c' : 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{track.artist}</div>
                </div>
              </button>
              <button
                onClick={(e) => togglePlaylist(track.id, e)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '12px 14px', fontSize: 18, flexShrink: 0, color: playlist.includes(track.id) ? '#e879a0' : 'rgba(255,255,255,0.2)', transition: 'color 0.2s' }}
              >
                {playlist.includes(track.id) ? '♥' : '♡'}
              </button>
            </div>
          ))}
          {displayedTracks.length === 0 && !showPlaylist && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: 20, fontSize: 13 }}>No tracks found</div>
          )}
        </div>
      </div>
    </FeatureGate>
  )
}
