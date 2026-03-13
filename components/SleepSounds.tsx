"use client"
import { useState, useRef, useEffect, useCallback } from 'react'
import FeatureGate from './FeatureGate'

interface Track {
  id: string
  title: string
  artist: string
  url: string
}

const TRACKS: Track[] = [
  { id: 'dunes', title: 'Dunes', artist: 'Valante', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Dunes%20-%20Valante.mp3' },
  { id: 'ebb', title: 'Ebb', artist: 'Bomull', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_ebb%20-%20bomull.mp3' },
  { id: 'fjalldrommar', title: 'Fjalldrommar', artist: 'Center of Attention', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Fjalldrommar%20-%20Center%20of%20Attention.mp3' },
  { id: 'havsdrommar', title: 'Havsdrommar', artist: 'Center of Attention', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Havsdrommar%20-%20Center%20of%20Attention.mp3' },
  { id: 'nattdrommar', title: 'Nattdrommar', artist: 'Center of Attention', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Nattdrommar%20-%20Center%20of%20Attention.mp3' },
  { id: 'gilded', title: 'Gilded Stillness', artist: 'DEX 1200', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Gilded%20Stillness%20-%20DEX%201200.mp3' },
  { id: 'lush', title: 'Lush Infinity', artist: 'DEX 1200', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Lush%20Infinity%20-%20DEX%201200.mp3' },
  { id: 'songfjord', title: 'Songfjord', artist: 'DEX 1200', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Songfjord%20-%20DEX%201200.mp3' },
  { id: 'slowdancing', title: 'Slow Dancing on Water', artist: 'Center of Attention', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Slow%20Dancing%20on%20Water%20-%20Center%20of%20Attention.mp3' },
  { id: 'stillpoint', title: 'Stillpoint', artist: 'Center of Attention', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Stillpoint%20-%20Center%20of%20Attention.mp3' },
  { id: 'stateofmed', title: 'State of Meditation', artist: 'Elm Lake', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_State%20of%20Meditation%20-%20Elm%20Lake.mp3' },
  { id: 'mindstream', title: 'Mindstream', artist: 'Amber Glow', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Mindstream%20-%20Amber%20Glow.mp3' },
  { id: 'enlightened', title: 'Enlightened Drift', artist: 'Amber Glow', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Enlightened%20Drift%20-%20Amber%20Glow.mp3' },
  { id: 'sonzai', title: 'Sonzai', artist: 'Valante', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Sonzai%20-%20Valante.mp3' },
  { id: 'grounded', title: 'Grounded', artist: 'Hanna Lindgren', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Grounded%20-%20Hanna%20Lindgren.mp3' },
  { id: 'thawing', title: 'Thawing', artist: 'Shuta Yasukochi', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Thawing%20-%20Shuta%20Yasukochi.mp3' },
  { id: 'healingtides', title: 'Healing Tides', artist: 'Amber Glow', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Healing%20Tides%20-%20Amber%20Glow.mp3' },
  { id: 'justbreathe', title: 'Just Breathe', artist: 'Amber Glow', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Just%20Breathe%20-%20Amber%20Glow.mp3' },
  { id: 'stilllove', title: 'Still Love', artist: 'Hanna Lindgren', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Still%20Love%20-%20Hanna%20Lindgren.mp3' },
  { id: 'bliss', title: 'Bliss', artist: 'Harbours & Oceans', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Bliss%20-%20Harbours%20%26%20Oceans.mp3' },
  { id: 'blossom', title: 'Blossom', artist: 'Luwaks', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Blossom%20-%20Luwaks.mp3' },
  { id: 'carried', title: 'Carried by Current', artist: 'Valante', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Carried%20by%20Current%20-%20Valante.mp3' },
  { id: 'meadow', title: 'Meadow Waves', artist: 'Rand Aldo', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Meadow%20Waves%20-%20Rand%20Aldo.mp3' },
  { id: 'birds', title: 'Birds of Lydia', artist: 'Rand Aldo', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Birds%20of%20Lydia%20-%20Rand%20Aldo.mp3' },
  { id: 'birdsong', title: 'Birdsong by the River', artist: 'Center of Attention', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Birdsong%20by%20the%20River%20-%20Center%20of%20Attention.mp3' },
  { id: 'greenembrace', title: 'A Green Embrace', artist: 'Rand Aldo', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_A%20Green%20Embrace%20-%20Rand%20Aldo.mp3' },
  { id: 'deepspace', title: 'Deep Space Garden', artist: 'Rand Aldo', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Deep%20Space%20Garden%20-%20Rand%20Aldo.mp3' },
  { id: 'crowned', title: 'Crowned With Spirit', artist: 'Valante', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Crowned%20With%20Spirit%20-%20Valante.mp3' },
  { id: 'daretodream', title: 'Dare to Dream', artist: 'Center of Attention', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Dare%20to%20Dream%20-%20Center%20of%20Attention.mp3' },
  { id: 'smallhope', title: 'A Small Hope', artist: 'Center of Attention', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_A%20Small%20Hope%20-%20Center%20of%20Attention.mp3' },
  { id: 'tangled', title: 'Tangled Reflections', artist: 'Luba Hilman', url: 'https://btopllnsyslhjictcznm.supabase.co/storage/v1/object/public/sleep-sounds/ES_Tangled%20Reflections%20-%20Luba%20Hilman.mp3' }
]

export default function SleepSounds() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [search, setSearch] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const filtered = TRACKS.filter(t =>
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

  const playTrack = useCallback((track: Track) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = '' }
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
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; audioRef.current = null }
    stopProgress()
    setCurrentTrack(null)
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
  }, [stopProgress])

  const nextTrack = useCallback(() => {
    if (!currentTrack) return
    const idx = filtered.findIndex(t => t.id === currentTrack.id)
    const next = filtered[(idx + 1) % filtered.length]
    if (next) playTrack(next)
  }, [currentTrack, filtered, playTrack])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => { return () => { stopAll() } }, [stopAll])

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    return `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`
  }

  return (
    <FeatureGate feature="sleep_sounds">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Now playing */}
        {currentTrack && (
          <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 14, padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                {isPlaying ? '🎵' : '🎶'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#c9a84c', fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentTrack.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{currentTrack.artist}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
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
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #c9a84c, #e8c96d)', width: duration ? `${(progress/duration)*100}%` : '0%', transition: 'width 0.5s linear', borderRadius: 2 }} />
              </div>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{fmt(duration)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14 }}>🔊</span>
              <input type="range" min={0} max={1} step={0.05} value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: '#c9a84c' }}
              />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{Math.round(volume*100)}%</span>
            </div>
          </div>
        )}

        {/* Search */}
        <input
          type="text" placeholder="🔍 Search tracks..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' }}
        />

        {/* Track list */}
        <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filtered.map(track => (
            <button
              key={track.id}
              onClick={() => currentTrack?.id === track.id ? togglePlay() : playTrack(track)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                background: currentTrack?.id === track.id ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.03)',
                border: '1px solid',
                borderColor: currentTrack?.id === track.id ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)',
                borderRadius: 10, cursor: 'pointer', textAlign: 'left', width: '100%'
              }}
            >
              <span style={{ fontSize: 20, minWidth: 24, textAlign: 'center' }}>
                {currentTrack?.id === track.id && isPlaying ? '⏸' : '▶'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: currentTrack?.id === track.id ? '#c9a84c' : 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{track.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{track.artist}</div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: 20, fontSize: 13 }}>No tracks found</div>
          )}
        </div>
      </div>
    </FeatureGate>
  )
}
