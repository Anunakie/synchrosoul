'use client'
import { useState, useRef, useEffect, useCallback } from 'react'

type SoundType = 'rain' | 'ocean' | 'forest' | 'fire' | 'white' | 'brown' | 'binaural' | 'bowls'

interface Sound {
  id: SoundType
  label: string
  emoji: string
  color: string
  desc: string
}

const SOUNDS: Sound[] = [
  { id: 'rain',     label: 'Rain',          emoji: '🌧️', color: '#4a9eff', desc: 'Gentle rainfall' },
  { id: 'ocean',    label: 'Ocean',         emoji: '🌊', color: '#00b4d8', desc: 'Rolling waves' },
  { id: 'forest',   label: 'Forest',        emoji: '🌿', color: '#4caf50', desc: 'Night crickets' },
  { id: 'fire',     label: 'Fireplace',     emoji: '🔥', color: '#ff6b35', desc: 'Crackling fire' },
  { id: 'white',    label: 'White Noise',   emoji: '☁️', color: '#e0e0e0', desc: 'Pure white noise' },
  { id: 'brown',    label: 'Brown Noise',   emoji: '🌫️', color: '#a0785a', desc: 'Deep rumble' },
  { id: 'binaural', label: 'Delta Waves',   emoji: '🧠', color: '#a855f7', desc: 'Deep sleep 2Hz' },
  { id: 'bowls',    label: 'Tibetan Bowls', emoji: '🔔', color: '#c9a84c', desc: 'Solfeggio tones' },
]

export default function SleepSounds() {
  const [active, setActive] = useState<SoundType | null>(null)
  const [volume, setVolume] = useState(0.6)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<AudioNode[]>([])
  const gainRef = useRef<GainNode | null>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const stopAll = useCallback(() => {
    timersRef.current.forEach(t => clearTimeout(t))
    timersRef.current = []
    nodesRef.current.forEach(n => {
      try { (n as AudioScheduledSourceNode).stop?.() } catch {}
      try { n.disconnect() } catch {}
    })
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

  // ── Noise buffer helper ──────────────────────────────────────────────────
  const makeNoise = useCallback((ctx: AudioContext, seconds = 3, type: 'white' | 'pink' | 'brown' = 'white') => {
    const len = ctx.sampleRate * seconds
    const buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch)
      if (type === 'white') {
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
      } else if (type === 'brown') {
        let last = 0
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1
          d[i] = (last + 0.02 * w) / 1.02
          last = d[i]
          d[i] *= 3.5
        }
      } else { // pink
        let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1
          b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759
          b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856
          b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980
          d[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11
          b6=w*0.115926
        }
      }
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop = true
    return src
  }, [])

  // ── LFO helper ───────────────────────────────────────────────────────────
  const makeLFO = useCallback((ctx: AudioContext, freq: number, min: number, max: number) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = freq
    gain.gain.value = (max - min) / 2
    osc.connect(gain)
    osc.start()
    return { osc, gain, offset: (max + min) / 2 }
  }, [])

  // ── RAIN (much improved) ─────────────────────────────────────────────────
  const playRain = useCallback((ctx: AudioContext, master: GainNode) => {
    const nodes: AudioNode[] = []

    // Layer 1: fine mist (highpass)
    const mist = makeNoise(ctx, 4, 'pink')
    const mistHP = ctx.createBiquadFilter()
    mistHP.type = 'highpass'; mistHP.frequency.value = 3500
    const mistGain = ctx.createGain(); mistGain.gain.value = 0.15
    mist.connect(mistHP); mistHP.connect(mistGain); mistGain.connect(master)

    // Layer 2: medium drops (bandpass)
    const drops = makeNoise(ctx, 4, 'white')
    const dropsBP = ctx.createBiquadFilter()
    dropsBP.type = 'bandpass'; dropsBP.frequency.value = 1000; dropsBP.Q.value = 0.5
    const dropsGain = ctx.createGain(); dropsGain.gain.value = 0.5
    drops.connect(dropsBP); dropsBP.connect(dropsGain); dropsGain.connect(master)

    // Layer 3: heavy rain rumble (lowpass)
    const rumble = makeNoise(ctx, 4, 'brown')
    const rumbleLP = ctx.createBiquadFilter()
    rumbleLP.type = 'lowpass'; rumbleLP.frequency.value = 300
    const rumbleGain = ctx.createGain(); rumbleGain.gain.value = 0.3
    rumble.connect(rumbleLP); rumbleLP.connect(rumbleGain); rumbleGain.connect(master)

    // Amplitude modulation for natural rain variation
    const lfo = makeLFO(ctx, 0.08, 0.7, 1.0)
    lfo.gain.connect(dropsGain.gain)
    dropsGain.gain.value = lfo.offset

    mist.start(); drops.start(); rumble.start()
    nodes.push(mist, mistHP, mistGain, drops, dropsBP, dropsGain, rumble, rumbleLP, rumbleGain, lfo.osc, lfo.gain)
    return nodes
  }, [makeNoise, makeLFO])

  // ── OCEAN (much improved) ────────────────────────────────────────────────
  const playOcean = useCallback((ctx: AudioContext, master: GainNode) => {
    const nodes: AudioNode[] = []
    const merger = ctx.createChannelMerger(2)
    merger.connect(master)

    // Multiple wave layers
    const waveFreqs = [0.05, 0.09, 0.13, 0.07]
    waveFreqs.forEach((freq, i) => {
      const noise = makeNoise(ctx, 6, 'pink')
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'; lp.frequency.value = 400 + i * 80
      const waveGain = ctx.createGain()
      waveGain.gain.value = 0

      // LFO for wave rhythm
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = freq
      lfoGain.gain.value = 0.18
      lfo.connect(lfoGain)
      lfoGain.connect(waveGain.gain)
      waveGain.gain.value = 0.18

      noise.connect(lp); lp.connect(waveGain)
      // Alternate L/R channels
      waveGain.connect(merger, 0, i % 2)
      noise.start(); lfo.start()
      nodes.push(noise, lp, waveGain, lfo, lfoGain)
    })

    // Deep ocean rumble
    const deep = makeNoise(ctx, 4, 'brown')
    const deepLP = ctx.createBiquadFilter()
    deepLP.type = 'lowpass'; deepLP.frequency.value = 80
    const deepGain = ctx.createGain(); deepGain.gain.value = 0.4
    deep.connect(deepLP); deepLP.connect(deepGain); deepGain.connect(master)
    deep.start()
    nodes.push(deep, deepLP, deepGain, merger)
    return nodes
  }, [makeNoise])

  // ── FOREST / CRICKETS ────────────────────────────────────────────────────
  const playForest = useCallback((ctx: AudioContext, master: GainNode) => {
    const nodes: AudioNode[] = []

    // Cricket chirps: multiple oscillators at cricket frequencies
    const cricketFreqs = [4200, 4400, 4600, 3800, 5000]
    cricketFreqs.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.value = 0

      // Chirp rhythm LFO
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      lfo.frequency.value = 3.5 + i * 0.3 // slightly different rates
      lfoGain.gain.value = 0.025
      lfo.connect(lfoGain)
      lfoGain.connect(gain.gain)
      gain.gain.value = 0.025

      osc.connect(gain); gain.connect(master)
      osc.start(); lfo.start()
      nodes.push(osc, gain, lfo, lfoGain)
    })

    // Soft wind background
    const wind = makeNoise(ctx, 4, 'pink')
    const windLP = ctx.createBiquadFilter()
    windLP.type = 'bandpass'; windLP.frequency.value = 600; windLP.Q.value = 0.3
    const windGain = ctx.createGain(); windGain.gain.value = 0.08
    wind.connect(windLP); windLP.connect(windGain); windGain.connect(master)
    wind.start()
    nodes.push(wind, windLP, windGain)
    return nodes
  }, [makeNoise])

  // ── FIREPLACE ────────────────────────────────────────────────────────────
  const playFire = useCallback((ctx: AudioContext, master: GainNode) => {
    const nodes: AudioNode[] = []

    // Base crackle: brown noise through lowpass
    const base = makeNoise(ctx, 3, 'brown')
    const baseLP = ctx.createBiquadFilter()
    baseLP.type = 'lowpass'; baseLP.frequency.value = 200
    const baseGain = ctx.createGain(); baseGain.gain.value = 0.5
    base.connect(baseLP); baseLP.connect(baseGain); baseGain.connect(master)
    base.start()

    // Crackle layer: white noise bursts
    const crackle = makeNoise(ctx, 2, 'white')
    const crackleHP = ctx.createBiquadFilter()
    crackleHP.type = 'highpass'; crackleHP.frequency.value = 1000
    const crackleLP = ctx.createBiquadFilter()
    crackleLP.type = 'lowpass'; crackleLP.frequency.value = 3000
    const crackleGain = ctx.createGain(); crackleGain.gain.value = 0.12

    // Irregular crackle LFO
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.4
    lfoGain.gain.value = 0.08
    lfo.connect(lfoGain); lfoGain.connect(crackleGain.gain)
    crackleGain.gain.value = 0.12

    crackle.connect(crackleHP); crackleHP.connect(crackleLP); crackleLP.connect(crackleGain); crackleGain.connect(master)
    crackle.start(); lfo.start()

    // Warm hiss
    const hiss = makeNoise(ctx, 2, 'pink')
    const hissBP = ctx.createBiquadFilter()
    hissBP.type = 'bandpass'; hissBP.frequency.value = 800; hissBP.Q.value = 0.8
    const hissGain = ctx.createGain(); hissGain.gain.value = 0.15
    hiss.connect(hissBP); hissBP.connect(hissGain); hissGain.connect(master)
    hiss.start()

    nodes.push(base, baseLP, baseGain, crackle, crackleHP, crackleLP, crackleGain, lfo, lfoGain, hiss, hissBP, hissGain)
    return nodes
  }, [makeNoise])

  // ── WHITE NOISE ──────────────────────────────────────────────────────────
  const playWhite = useCallback((ctx: AudioContext, master: GainNode) => {
    const src = makeNoise(ctx, 3, 'white')
    src.connect(master); src.start()
    return [src]
  }, [makeNoise])

  // ── BROWN NOISE ──────────────────────────────────────────────────────────
  const playBrown = useCallback((ctx: AudioContext, master: GainNode) => {
    const src = makeNoise(ctx, 3, 'brown')
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'; lp.frequency.value = 500
    src.connect(lp); lp.connect(master); src.start()
    return [src, lp]
  }, [makeNoise])

  // ── BINAURAL DELTA WAVES (sleep) ─────────────────────────────────────────
  const playBinaural = useCallback((ctx: AudioContext, master: GainNode) => {
    const nodes: AudioNode[] = []
    const merger = ctx.createChannelMerger(2)
    merger.connect(master)

    // Delta waves: 2Hz difference for deep sleep (100Hz left, 102Hz right)
    const leftOsc = ctx.createOscillator()
    const rightOsc = ctx.createOscillator()
    const leftGain = ctx.createGain()
    const rightGain = ctx.createGain()
    leftOsc.frequency.value = 100
    rightOsc.frequency.value = 102
    leftGain.gain.value = 0.25
    rightGain.gain.value = 0.25
    leftOsc.connect(leftGain); leftGain.connect(merger, 0, 0)
    rightOsc.connect(rightGain); rightGain.connect(merger, 0, 1)
    leftOsc.start(); rightOsc.start()

    // Pink noise background (very quiet)
    const pink = makeNoise(ctx, 4, 'pink')
    const pinkGain = ctx.createGain(); pinkGain.gain.value = 0.04
    pink.connect(pinkGain); pinkGain.connect(master)
    pink.start()

    nodes.push(leftOsc, rightOsc, leftGain, rightGain, merger, pink, pinkGain)
    return nodes
  }, [makeNoise])

  // ── TIBETAN BOWLS (much improved) ────────────────────────────────────────
  const playBowls = useCallback((ctx: AudioContext, master: GainNode) => {
    const nodes: AudioNode[] = []
    // Solfeggio frequencies with harmonics
    const bowlData = [
      { freq: 174, interval: 12000 },
      { freq: 285, interval: 15000 },
      { freq: 396, interval: 18000 },
      { freq: 528, interval: 20000 },
      { freq: 639, interval: 16000 },
      { freq: 741, interval: 14000 },
    ]

    // Simple reverb via delay
    const delay = ctx.createDelay(2.0)
    delay.delayTime.value = 0.3
    const delayGain = ctx.createGain(); delayGain.gain.value = 0.35
    const feedback = ctx.createGain(); feedback.gain.value = 0.4
    delay.connect(delayGain); delayGain.connect(master)
    delay.connect(feedback); feedback.connect(delay)
    nodes.push(delay, delayGain, feedback)

    bowlData.forEach(({ freq, interval }, i) => {
      const strike = () => {
        // Fundamental
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5)
        osc.connect(gain); gain.connect(master); gain.connect(delay)
        osc.start(); osc.stop(ctx.currentTime + 5.5)

        // 2nd harmonic (quieter)
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = 'sine'
        osc2.frequency.value = freq * 2.756 // inharmonic partial for bowl character
        gain2.gain.setValueAtTime(0, ctx.currentTime)
        gain2.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02)
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3)
        osc2.connect(gain2); gain2.connect(master)
        osc2.start(); osc2.stop(ctx.currentTime + 3.5)
      }

      const initialDelay = i * 2500
      const t1 = setTimeout(strike, initialDelay)
      timersRef.current.push(t1)

      // Recurring strikes
      const repeat = () => {
        strike()
        const t = setTimeout(repeat, interval)
        timersRef.current.push(t)
      }
      const t2 = setTimeout(repeat, initialDelay + interval)
      timersRef.current.push(t2)
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
    if (id === 'rain')     nodes = [...nodes, ...playRain(ctx, master)]
    else if (id === 'ocean')    nodes = [...nodes, ...playOcean(ctx, master)]
    else if (id === 'forest')   nodes = [...nodes, ...playForest(ctx, master)]
    else if (id === 'fire')     nodes = [...nodes, ...playFire(ctx, master)]
    else if (id === 'white')    nodes = [...nodes, ...playWhite(ctx, master)]
    else if (id === 'brown')    nodes = [...nodes, ...playBrown(ctx, master)]
    else if (id === 'binaural') nodes = [...nodes, ...playBinaural(ctx, master)]
    else if (id === 'bowls')    nodes = [...nodes, ...playBowls(ctx, master)]
    nodesRef.current = nodes
    setActive(id)
  }, [volume, stopAll, getCtx, playRain, playOcean, playForest, playFire, playWhite, playBrown, playBinaural, playBowls])

  const stop = useCallback(() => { stopAll(); setActive(null) }, [stopAll])
  const toggle = useCallback((id: SoundType) => { if (active === id) stop(); else play(id) }, [active, stop, play])

  useEffect(() => { if (gainRef.current) gainRef.current.gain.value = volume }, [volume])
  useEffect(() => () => { stopAll(); audioCtxRef.current?.close() }, [stopAll])

  const activeSound = SOUNDS.find(s => s.id === active)

  return (
    <div style={{ padding: '1.25rem', background: 'rgba(5,3,20,0.8)', borderRadius: '1rem', border: '1px solid rgba(201,168,76,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', margin: 0 }}>Sleep Sounds</h3>
          {activeSound && <p style={{ fontSize: '0.65rem', color: activeSound.color, margin: '0.2rem 0 0', opacity: 0.8 }}>{activeSound.desc}</p>}
        </div>
        {active && (
          <button onClick={stop} style={{ fontSize: '0.7rem', color: 'rgba(255,100,100,0.7)', background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.2)', borderRadius: '0.4rem', padding: '0.3rem 0.6rem', cursor: 'pointer', letterSpacing: '0.1em' }}>STOP</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {SOUNDS.map(s => (
          <button
            key={s.id}
            onClick={() => toggle(s.id)}
            style={{
              padding: '0.65rem 0.2rem',
              borderRadius: '0.75rem',
              border: `1px solid ${active === s.id ? s.color : 'rgba(255,255,255,0.08)'}`,
              background: active === s.id ? `${s.color}28` : 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.3rem',
              transition: 'all 0.25s',
              boxShadow: active === s.id ? `0 0 12px ${s.color}40` : 'none',
            }}
          >
            <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{s.emoji}</span>
            <span style={{ fontSize: '0.55rem', color: active === s.id ? s.color : 'rgba(255,255,255,0.35)', letterSpacing: '0.04em', textAlign: 'center', lineHeight: 1.2 }}>{s.label}</span>
            {active === s.id && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.color, boxShadow: `0 0 6px ${s.color}`, animation: 'pulse 1s infinite' }} />}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>🔈</span>
        <input
          type="range" min={0} max={1} step={0.01} value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: '#c9a84c', cursor: 'pointer', height: '4px' }}
        />
        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)' }}>🔊</span>
      </div>

      {!active && (
        <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.18)', marginTop: '0.75rem', textAlign: 'center', letterSpacing: '0.08em' }}>Tap a sound to drift into sleep</p>
      )}
    </div>
  )
}
