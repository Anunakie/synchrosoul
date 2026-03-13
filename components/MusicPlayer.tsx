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
  { id: 'meditation', label: 'Meditation', emoji: '🧘' },
  { id: 'sleep', label: 'Sleep', emoji: '🌙' },
  { id: 'healing', label: 'Healing', emoji: '💚' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
  { id: 'uplifting', label: 'Uplifting', emoji: '🌟' },
]

interface MusicPlayerProps {
  defaultCategory?: string
  compact?: boolean
  title?: string
}

export default function MusicPlayer({ defaultCategory = 'all', compact = false, title = 'Sacred Sounds' }: MusicPlayerProps) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const filteredTracks = activeCategory === 'all'
    ? ALL_TRACKS
    : ALL_TRACKS.filter(t => t.category === activeCategory)

  const stopProgress = useCallback(() => {
    if (progressRef.current) {
      clearInterval(progressRef.current)
      progressRef.current = null
    }
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

  const playTrack = useCallback((track: Track) => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    const audio = new Audio(track.url)
    audio.volume = volume
    audio.loop = true
    audioRef.current = audio
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
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
      audioRef.current = null
    }
    stopProgress()
    setCurrentTrack(null)
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
  }, [stopProgress])

  const nextTrack = useCallback(() => {
    if (!currentTrack) return
    const idx = filteredTracks.findIndex(t => t.id === currentTrack.id)
    const next = filteredTracks[(idx + 1) % filteredTracks.length]
    if (next) playTrack(next)
  }, [currentTrack, filteredTracks, playTrack])

  const prevTrack = useCallback(() => {
    if (!currentTrack) return
    const idx = filteredTracks.findIndex(t => t.id === currentTrack.id)
    const prev = filteredTracks[(idx - 1 + filteredTracks.length) % filteredTracks.length]
    if (prev) playTrack(prev)
  }, [currentTrack, filteredTracks, playTrack])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    return () => {
      stopAll()
    }
  }, [stopAll])

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const catEmoji: Record<string, string> = {
    sleep: '🌙', meditation: '🧘', healing: '💚', nature: '🌿', uplifting: '🌟'
  }

  return (
    <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 16, padding: compact ? 16 : 24, backdropFilter: 'blur(12px)' }}>
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>🎵</span>
          <h3 style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 600, margin: 0 }}>{title}</h3>
        </div>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '4px 10px', borderRadius: 20, border: '1px solid',
              borderColor: activeCategory === cat.id ? '#c9a84c' : 'rgba(255,255,255,0.15)',
              background: activeCategory === cat.id ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
              color: activeCategory === cat.id ? '#c9a84c' : 'rgba(255,255,255,0.6)',
              fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Now playing bar */}
      {currentTrack && (
        <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 12, padding: '10px 14px', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{catEmoji[currentTrack.category] || '✨'}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#c9a84c', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack.title}</div>
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
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{formatTime(progress)}</span>
            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#c9a84c', width: duration ? `${(progress/duration)*100}%` : '0%', transition: 'width 0.5s linear' }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>{formatTime(duration)}</span>
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

      {/* Track list */}
      <div style={{ maxHeight: compact ? 200 : 280, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {filteredTracks.map(track => (
          <button
            key={track.id}
            onClick={() => currentTrack?.id === track.id ? togglePlay() : playTrack(track)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
              background: currentTrack?.id === track.id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
              border: '1px solid',
              borderColor: currentTrack?.id === track.id ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)',
              borderRadius: 8, cursor: 'pointer', textAlign: 'left', width: '100%'
            }}
          >
            <span style={{ fontSize: 16, minWidth: 20 }}>
              {currentTrack?.id === track.id && isPlaying ? '⏸' : catEmoji[track.category] || '▶'}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: currentTrack?.id === track.id ? '#c9a84c' : 'rgba(255,255,255,0.85)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{track.artist}</div>
            </div>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'capitalize' }}>{track.category}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
