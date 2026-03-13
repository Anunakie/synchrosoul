'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

type SoundType = 'rain' | 'ocean' | 'white' | 'brown' | 'binaural' | 'bowls'

interface Sound {
  id: SoundType
  label: string
  emoji: string
  color: string
}

const SOUNDS: Sound[] = [
  { id: 'rain', label: 'Rain', emoji: '🌧️', color: '#4a9eff' },
  { id: 'ocean', label: 'Ocean', emoji: '🌊', color: '#00b4d8' },
  { id: 'white', label: 'White Noise', emoji: '☁️', color: '#e0e0e0' },
  { id: 'brown', label: 'Brown Noise', emoji: '🌿', color: '#8b6914' },
  { id: 'binaural', label: 'Binaural', emoji: '🧠', color: '#a855f7' },
  { id: 'bowls', label: 'Tibetan Bowls', emoji: '🔔', color: '#c9a84c' },
]

export default function SleepSounds() {
  const [active, setActive] = useState<SoundType | null>(null)
  const [volume, setVolume] = useState(0.5)
  const [isStarted, setIsStarted] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<AudioNode[]>([])
  const gainRef = useRef<GainNode | null>(null)

  const stopAll = useCallback(() => {
    nodesRef.current.forEach(n => { try { (n as AudioScheduledSourceNode).stop?.() } catch {} })
    nodesRef.current = []
    gainRef.current = null
  }, [])

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume()
    return audioCtxRef.current
  }, [])

  const playRain = useCallback((ctx: AudioContext, master: GainNode) => {
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1200
    filter.Q.value = 0.3
    const filter2 = ctx.createBiquadFilter()
    filter2.type = 'highpass'
    filter2.frequency.value = 800
    source.connect(filter)
    filter.connect(filter2)
    filter2.connect(master)
    source.start()
    return [source, filter, filter2]
  }, [])

  const playOcean = useCallback((ctx: AudioContext, master: GainNode) => {
    const bufferSize = ctx.sampleRate * 4
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      const wave = Math.sin(i / ctx.sampleRate * 0.15) * 0.5 + 0.5
      data[i] = (Math.random() * 2 - 1) * wave
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 600
    source.connect(filter)
    filter.connect(master)
    source.start()
    return [source, filter]
  }, [])

  const playWhiteNoise = useCallback((ctx: AudioContext, master: GainNode) => {
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(master)
    source.start()
    return [source]
  }, [])

  const playBrownNoise = useCallback((ctx: AudioContext, master: GainNode) => {
    const bufferSize = ctx.sampleRate * 2
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let lastOut = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = data[i]
      data[i] *= 3.5
    }
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    source.connect(master)
    source.start()
    return [source]
  }, [])

  const playBinaural = useCallback((ctx: AudioContext, master: GainNode) => {
    // 40Hz gamma binaural: left 200Hz, right 240Hz
    const merger = ctx.createChannelMerger(2)
    const leftOsc = ctx.createOscillator()
    const rightOsc = ctx.createOscillator()
    const leftGain = ctx.createGain()
    const rightGain = ctx.createGain()
    leftOsc.frequency.value = 200
    rightOsc.frequency.value = 240
    leftGain.gain.value = 0.3
    rightGain.gain.value = 0.3
    leftOsc.connect(leftGain)
    rightOsc.connect(rightGain)
    leftGain.connect(merger, 0, 0)
    rightGain.connect(merger, 0, 1)
    merger.connect(master)
    leftOsc.start()
    rightOsc.start()
    return [leftOsc, rightOsc, leftGain, rightGain, merger]
  }, [])

  const playBowls = useCallback((ctx: AudioContext, master: GainNode) => {
    const nodes: AudioNode[] = []
    const freqs = [174, 285, 396, 417, 528, 639, 741, 852, 963]
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.value = 0
      osc.connect(gain)
      gain.connect(master)
      osc.start()
      // Stagger bowl strikes
      const delay = i * 3
      const strike = () => {
        gain.gain.cancelScheduledValues(ctx.currentTime)
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4)
        setTimeout(strike, (freqs.length * 3 + 2) * 1000)
      }
      setTimeout(strike, delay * 1000)
      nodes.push(osc, gain)
    })
    return nodes
  }, [])

  const play = useCallback((id: SoundType) => {
    stopAll()
    const ctx = getCtx()
    const master = ctx.createGain()
    master.gain.value = volume
    master.connect(ctx.destination)
    gainRef.current = master
    let nodes: AudioNode[] = [master]
    if (id === 'rain') nodes = [...nodes, ...playRain(ctx, master)]
    else if (id === 'ocean') nodes = [...nodes, ...playOcean(ctx, master)]
    else if (id === 'white') nodes = [...nodes, ...playWhiteNoise(ctx, master)]
    else if (id === 'brown') nodes = [...nodes, ...playBrownNoise(ctx, master)]
    else if (id === 'binaural') nodes = [...nodes, ...playBinaural(ctx, master)]
    else if (id === 'bowls') nodes = [...nodes, ...playBowls(ctx, master)]
    nodesRef.current = nodes
    setActive(id)
    setIsStarted(true)
  }, [volume, stopAll, getCtx, playRain, playOcean, playWhiteNoise, playBrownNoise, playBinaural, playBowls])

  const stop = useCallback(() => {
    stopAll()
    setActive(null)
  }, [stopAll])

  const toggle = useCallback((id: SoundType) => {
    if (active === id) stop()
    else play(id)
  }, [active, stop, play])

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume
  }, [volume])

  useEffect(() => {
    return () => { stopAll(); audioCtxRef.current?.close() }
  }, [stopAll])

  return (
    <div style={{ padding: '1.25rem', background: 'rgba(5,3,20,0.7)', borderRadius: '1rem', border: '1px solid rgba(201,168,76,0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', margin: 0 }}>Sleep Sounds</h3>
        {active && (
          <button onClick={stop} style={{ fontSize: '0.7rem', color: 'rgba(255,100,100,0.7)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}>STOP</button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {SOUNDS.map(s => (
          <button
            key={s.id}
            onClick={() => toggle(s.id)}
            style={{
              padding: '0.6rem 0.25rem',
              borderRadius: '0.6rem',
              border: `1px solid ${active === s.id ? s.color : 'rgba(255,255,255,0.08)'}`,
              background: active === s.id ? `${s.color}22` : 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>{s.emoji}</span>
            <span style={{ fontSize: '0.6rem', color: active === s.id ? s.color : 'rgba(255,255,255,0.4)', letterSpacing: '0.05em' }}>{s.label}</span>
            {active === s.id && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: s.color, animation: 'pulse 1s infinite' }} />}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>Vol</span>
        <input
          type="range" min={0} max={1} step={0.01} value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: '#c9a84c', cursor: 'pointer' }}
        />
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', minWidth: '2rem' }}>{Math.round(volume * 100)}%</span>
      </div>
      {!isStarted && (
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.75rem', textAlign: 'center', lineHeight: 1.5 }}>Tap a sound to begin your sleep journey</p>
      )}
    </div>
  )
}
