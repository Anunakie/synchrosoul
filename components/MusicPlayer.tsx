"use client"
import { useState, useRef, useEffect, useCallback } from 'react'

interface Track {
  id: string
  title: string
  artist: string
  category: string
  url: string
}

const ALL_TRACKS: Track[] = [
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

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'playlist', label: 'My Playlist', emoji: '❤️' },
  { id: 'meditation', label: 'Meditation', emoji: '🧘' },
  { id: 'sleep', label: 'Sleep', emoji: '🌙' },
  { id: 'healing', label: 'Healing', emoji: '💚' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'uplifting', label: 'Uplifting', emoji: '🌟' },
]

const PLAYLIST_KEY = 'synchrosoul_music_playlist'

interface MusicPlayerProps {
  defaultCategory?: string
  compact?: boolean
  title?: string
}

export default function MusicPlayer({ defaultCategory = 'all', compact = false, title = 'Sacred Sounds' }: MusicPlayerProps) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playAll, setPlayAll] = useState(false)
  const [loopPlaylist, setLoopPlaylist] = useState(false)
  const loopPlaylistRef = useRef(false)
  const [volume, setVolume] = useState(0.7)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playlist, setPlaylist] = useState<string[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const playAllRef = useRef(false)
  const filteredTracksRef = useRef<Track[]>([])

  // Load playlist from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PLAYLIST_KEY)
      if (saved) setPlaylist(JSON.parse(saved))
    } catch {}
  }, [])

  const savePlaylist = useCallback((ids: string[]) => {
    setPlaylist(ids)
    try { localStorage.setItem(PLAYLIST_KEY, JSON.stringify(ids)) } catch {}
  }, [])

  const togglePlaylist = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPlaylist(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      try { localStorage.setItem(PLAYLIST_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const getFilteredTracks = useCallback((category: string, pl: string[]) => {
    if (category === 'playlist') return ALL_TRACKS.filter(t => pl.includes(t.id))
    if (category === 'all') return ALL_TRACKS
    return ALL_TRACKS.filter(t => t.category === category)
  }, [])

  const filteredTracks = getFilteredTracks(activeCategory, playlist)

  // Keep ref in sync for use in audio event handlers
  useEffect(() => {
    filteredTracksRef.current = filteredTracks
  }, [filteredTracks])

  useEffect(() => {
    playAllRef.current = playAll
  }, [playAll])

  useEffect(() => {
    loopPlaylistRef.current = loopPlaylist
  }, [loopPlaylist])

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

  const playTrack = useCallback((track: Track, isPlayAll = false) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
    const audio = new Audio(track.url)
    audio.volume = volume
    // Loop only if NOT in play-all or loop-playlist mode
    audio.loop = !isPlayAll && !loopPlaylistRef.current
    audioRef.current = audio

    // Auto-advance when track ends (play-all or loop-playlist mode)
    audio.addEventListener('ended', () => {
      if (playAllRef.current || loopPlaylistRef.current) {
        const tracks = filteredTracksRef.current
        const idx = tracks.findIndex(t => t.id === track.id)
        const next = tracks[(idx + 1) % tracks.length]
        if (next) playTrack(next, playAllRef.current || loopPlaylistRef.current)
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
      audioRef.current.pause()
      setIsPlaying(false)
      stopProgress()
    } else {
      audioRef.current.play()
      setIsPlaying(true)
      startProgress()
    }
  }, [isPlaying, startProgress, stopProgress])

  const stopAll = useCallback(() => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; audioRef.current = null }
    stopProgress()
    setCurrentTrack(null)
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
  }, [stopProgress])

  const nextTrack = useCallback(() => {
    if (!currentTrack) return
    const tracks = filteredTracksRef.current
    const idx = tracks.findIndex(t => t.id === currentTrack.id)
    const next = tracks[(idx + 1) % tracks.length]
    if (next) playTrack(next, playAllRef.current)
  }, [currentTrack, playTrack])

  const prevTrack = useCallback(() => {
    if (!currentTrack) return
    const tracks = filteredTracksRef.current
    const idx = tracks.findIndex(t => t.id === currentTrack.id)
    const prev = tracks[(idx - 1 + tracks.length) % tracks.length]
    if (prev) playTrack(prev, playAllRef.current)
  }, [currentTrack, playTrack])

  const handlePlayAll = useCallback(() => {
    const newPlayAll = !playAll
    setPlayAll(newPlayAll)
    playAllRef.current = newPlayAll
    if (newPlayAll) {
      // Start from beginning or current track
      const tracks = filteredTracksRef.current
      if (tracks.length === 0) return
      const startTrack = currentTrack && tracks.find(t => t.id === currentTrack.id)
        ? currentTrack
        : tracks[0]
      playTrack(startTrack, true)
    } else {
      // Switch back to loop mode for current track
      if (audioRef.current && currentTrack) {
        audioRef.current.loop = true
      }
    }
  }, [playAll, currentTrack, playTrack])

  const handleLoopPlaylist = useCallback(() => {
    const newLoop = !loopPlaylist
    setLoopPlaylist(newLoop)
    loopPlaylistRef.current = newLoop
    if (newLoop) {
      // Turn off regular playAll if it's on
      setPlayAll(false)
      playAllRef.current = false
      // Start from first playlist track or current
      const tracks = filteredTracksRef.current
      if (tracks.length === 0) return
      const startTrack = currentTrack && tracks.find(t => t.id === currentTrack.id)
        ? currentTrack
        : tracks[0]
      playTrack(startTrack, true)
    } else {
      // Switch back to single track loop
      if (audioRef.current && currentTrack) {
        audioRef.current.loop = true
      }
    }
  }, [loopPlaylist, currentTrack, playTrack])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => { return () => { stopAll() } }, [stopAll])

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`
  }

  const catEmoji: Record<string, string> = {
    sleep: '🌙', meditation: '🧘', healing: '💚',
    nature: '🌿', uplifting: '🌟'
  }

  return (
    <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 16, padding: compact ? 16 : 24, backdropFilter: 'blur(12px)' }}>
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>🎵</span>
          <h3 style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 600, margin: 0, flex: 1 }}>{title}</h3>
          {/* Play All toggle */}
          {activeCategory !== 'playlist' && (
          <button
            onClick={handlePlayAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              borderRadius: 20, border: '1px solid',
              borderColor: playAll ? '#c9a84c' : 'rgba(255,255,255,0.2)',
              background: playAll ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.05)',
              color: playAll ? '#c9a84c' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap'
            }}
          >
            <span>{playAll ? '🔁' : '▶▶'}</span>
            <span>{playAll ? 'Playing All' : 'Play All'}</span>
          </button>
          )}
          {activeCategory === 'playlist' && (
          <button
            onClick={handleLoopPlaylist}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              borderRadius: 20, border: '1px solid',
              borderColor: loopPlaylist ? '#e879a0' : 'rgba(255,255,255,0.2)',
              background: loopPlaylist ? 'rgba(232,121,160,0.25)' : 'rgba(255,255,255,0.05)',
              color: loopPlaylist ? '#e879a0' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap'
            }}
          >
            <span>🔁</span>
            <span>{loopPlaylist ? 'Looping' : 'Loop Playlist'}</span>
          </button>
          )}
        </div>
      )}

      {compact && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <button
            onClick={handlePlayAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
              borderRadius: 20, border: '1px solid',
              borderColor: playAll ? '#c9a84c' : 'rgba(255,255,255,0.2)',
              background: playAll ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.05)',
              color: playAll ? '#c9a84c' : 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontSize: 11
            }}
          >
            <span>{playAll ? '🔁' : '▶▶'}</span>
            <span>{playAll ? 'Playing All' : 'Play All'}</span>
          </button>
        </div>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id)
              if (cat.id !== 'playlist' && loopPlaylist) {
                setLoopPlaylist(false)
                loopPlaylistRef.current = false
                if (audioRef.current && currentTrack) audioRef.current.loop = true
              }
            }}
            style={{
              padding: '4px 10px', borderRadius: 20, border: '1px solid',
              borderColor: activeCategory === cat.id
                ? (cat.id === 'playlist' ? '#e879a0' : '#c9a84c')
                : 'rgba(255,255,255,0.15)',
              background: activeCategory === cat.id
                ? (cat.id === 'playlist' ? 'rgba(232,121,160,0.2)' : 'rgba(201,168,76,0.2)')
                : 'rgba(255,255,255,0.05)',
              color: activeCategory === cat.id
                ? (cat.id === 'playlist' ? '#e879a0' : '#c9a84c')
                : 'rgba(255,255,255,0.6)',
              fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            {cat.emoji} {cat.label} {cat.id === 'playlist' && playlist.length > 0 ? `(${playlist.length})` : ''}
          </button>
        ))}
      </div>

      {/* Now playing bar */}
      {currentTrack && (
        <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 12, padding: '10px 14px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{catEmoji[currentTrack.category] || '✨'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentTrack.title}
                {playAll && <span style={{ marginLeft: 6, fontSize: 10, color: 'rgba(201,168,76,0.6)', background: 'rgba(201,168,76,0.1)', padding: '1px 6px', borderRadius: 10 }}>🔁 Auto</span>}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{currentTrack.artist}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button onClick={prevTrack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 16, padding: 4 }}>⏮</button>
              <button onClick={togglePlay} style={{ background: 'rgba(201,168,76,0.3)', border: '1px solid rgba(201,168,76,0.5)', borderRadius: '50%', width: 36, height: 36, color: '#c9a84c', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button onClick={nextTrack} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 16, padding: 4 }}>⏭</button>
              <button onClick={stopAll} style={{ background: 'none', border: 'none', color: 'rgba(255,100,100,0.6)', cursor: 'pointer', fontSize: 14, padding: 4 }}>⏹</button>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{fmt(progress)}</span>
            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#c9a84c', width: duration ? `${(progress/duration)*100}%` : '0%', transition: 'width 0.5s linear' }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{fmt(duration)}</span>
          </div>
          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
            <span style={{ fontSize: 12 }}>🔊</span>
            <input type="range" min={0} max={1} step={0.05} value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: '#c9a84c', height: 3 }}
            />
          </div>
        </div>
      )}

      {/* Empty playlist message */}
      {activeCategory === 'playlist' && playlist.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px 16px', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>♥</div>
          <div style={{ fontSize: 13 }}>No saved tracks yet</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>Tap the ♥ on any track to add it here</div>
        </div>
      )}

      {/* Track list */}
      <div style={{ maxHeight: compact ? 200 : 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filteredTracks.map(track => (
          <div
            key={track.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, minHeight: 60,
              background: currentTrack?.id === track.id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
              border: '1px solid',
              borderColor: currentTrack?.id === track.id ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)',
              borderRadius: 8
            }}
          >
            {/* Play button area */}
            <button
              onClick={() => currentTrack?.id === track.id ? togglePlay() : playTrack(track, playAllRef.current)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 12px',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', flex: 1, minWidth: 0
              }}
            >
              <span style={{ fontSize: 14, minWidth: 18, textAlign: 'center', color: currentTrack?.id === track.id ? '#c9a84c' : 'rgba(255,255,255,0.4)' }}>
                {currentTrack?.id === track.id && isPlaying ? '⏸' : catEmoji[track.category] || '▶'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: currentTrack?.id === track.id ? '#c9a84c' : 'rgba(255,255,255,0.85)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: '1.4', display: 'block' }}>{track.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{track.artist}</div>
              </div>
            </button>
            {/* Heart / playlist button */}
            <button
              onClick={(e) => togglePlaylist(track.id, e)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px 12px', fontSize: 16, flexShrink: 0,
                color: playlist.includes(track.id) ? '#e879a0' : 'rgba(255,255,255,0.2)',
                transition: 'color 0.2s'
              }}
              title={playlist.includes(track.id) ? 'Remove from playlist' : 'Add to playlist'}
            >
              {playlist.includes(track.id) ? '♥' : '♡'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
