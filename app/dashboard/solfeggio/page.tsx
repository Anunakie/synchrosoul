'use client'
import { useState, useEffect, useRef } from 'react'

const FREQUENCIES = [
  { hz: 174, name: 'Foundation', emoji: '🟤', color: '#92400e', desc: 'Reduces pain and stress. Gives organs a sense of security and love.', chakra: 'Root', benefit: 'Pain relief, security, grounding' },
  { hz: 285, name: 'Quantum Cognition', emoji: '🟠', color: '#c2410c', desc: 'Influences energy fields, rejuvenates and heals tissues and organs.', chakra: 'Sacral', benefit: 'Tissue healing, energy field repair' },
  { hz: 396, name: 'Liberation', emoji: '🔴', color: '#dc2626', desc: 'Liberates guilt and fear. Turns grief into joy and fear into courage.', chakra: 'Root', benefit: 'Release guilt, overcome fear' },
  { hz: 417, name: 'Transmutation', emoji: '🟡', color: '#d97706', desc: 'Undoes situations and facilitates change. Breaks up crystallized patterns.', chakra: 'Sacral', benefit: 'Facilitate change, clear trauma' },
  { hz: 432, name: 'Universal Harmony', emoji: '💛', color: '#ca8a04', desc: 'Tuned to the heartbeat of the Earth. Promotes clarity and peace.', chakra: 'Heart', benefit: 'Natural harmony, deep peace' },
  { hz: 528, name: 'Miracle Tone', emoji: '💚', color: '#16a34a', desc: 'The love frequency. DNA repair, transformation and miracles.', chakra: 'Solar Plexus', benefit: 'DNA repair, love, miracles' },
  { hz: 639, name: 'Connection', emoji: '🩵', color: '#0891b2', desc: 'Enhances communication, understanding, tolerance and love.', chakra: 'Heart', benefit: 'Relationships, harmony, love' },
  { hz: 741, name: 'Awakening', emoji: '🔵', color: '#2563eb', desc: 'Awakens intuition. Cleans cells from toxins. Problem solving.', chakra: 'Throat', benefit: 'Intuition, detox, expression' },
  { hz: 852, name: 'Spiritual Order', emoji: '🟣', color: '#7c3aed', desc: 'Returns to spiritual order. Awakens inner strength and self-realization.', chakra: 'Third Eye', benefit: 'Spiritual awakening, inner strength' },
  { hz: 963, name: 'Divine Consciousness', emoji: '⚪', color: '#c9a84c', desc: 'Connects to higher self and divine consciousness. Pure miracle tone.', chakra: 'Crown', benefit: 'Divine connection, enlightenment' },
]

const TIMER_OPTIONS = [5, 10, 15, 20, 30, 60]

export default function SolfeggioPage() {
  const [playing, setPlaying] = useState<number|null>(null)
  const [timer, setTimer] = useState(10)
  const [remaining, setRemaining] = useState<number|null>(null)
  const [volume, setVolume] = useState(0.5)
  const [selected, setSelected] = useState<number|null>(null)
  const audioCtxRef = useRef<AudioContext|null>(null)
  const oscillatorRef = useRef<OscillatorNode|null>(null)
  const gainRef = useRef<GainNode|null>(null)
  const intervalRef = useRef<any>(null)
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',padding:'1.25rem',marginBottom:'0.875rem'}

  function startFrequency(hz: number) {
    stopFrequency()
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(hz, ctx.currentTime)
      gain.gain.setValueAtTime(volume, ctx.currentTime)
      osc.start()
      audioCtxRef.current = ctx
      oscillatorRef.current = osc
      gainRef.current = gain
      setPlaying(hz)
      setRemaining(timer * 60)
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r === null || r <= 1) { stopFrequency(); return null }
          return r - 1
        })
      }, 1000)
    } catch(e) { console.error(e) }
  }

  function stopFrequency() {
    if (oscillatorRef.current) { try { oscillatorRef.current.stop() } catch {} }
    if (audioCtxRef.current) { try { audioCtxRef.current.close() } catch {} }
    oscillatorRef.current = null
    audioCtxRef.current = null
    gainRef.current = null
    clearInterval(intervalRef.current)
    setPlaying(null)
    setRemaining(null)
  }

  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime)
    }
  }, [volume])

  useEffect(() => () => stopFrequency(), [])

  const activeFreq = FREQUENCIES.find(f => f.hz === playing)
  const fmt = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Solfeggio Frequencies</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Ancient sacred tones for healing, transformation and spiritual awakening</p>

      {/* Now Playing */}
      {playing && activeFreq && (
        <div style={{...card,background:'linear-gradient(135deg,rgba(167,139,250,0.12),rgba(201,168,76,0.08))',borderColor:'rgba(167,139,250,0.25)',marginBottom:'1.25rem',textAlign:'center'}}>
          <div style={{fontSize:'2.5rem',marginBottom:'0.5rem',animation:'pulse 2s infinite'}}>{activeFreq.emoji}</div>
          <div style={{color:'rgba(220,200,255,0.9)',fontSize:'1.4rem',fontWeight:700,marginBottom:'0.1rem'}}>{activeFreq.hz} Hz</div>
          <div style={{color:activeFreq.color,fontSize:'0.85rem',marginBottom:'0.5rem'}}>{activeFreq.name}</div>
          {remaining !== null && <div style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',marginBottom:'0.875rem'}}>{fmt(remaining)} remaining</div>}
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem',justifyContent:'center',marginBottom:'0.875rem'}}>
            <span style={{color:'rgba(180,160,255,0.4)',fontSize:'0.75rem'}}>🔈</span>
            <input type='range' min='0' max='1' step='0.05' value={volume} onChange={e=>setVolume(parseFloat(e.target.value))} style={{width:'120px',accentColor:'#a78bfa'}} />
            <span style={{color:'rgba(180,160,255,0.4)',fontSize:'0.75rem'}}>🔊</span>
          </div>
          <button onClick={stopFrequency} style={{padding:'0.5rem 1.5rem',borderRadius:'9999px',background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',color:'#f87171',fontSize:'0.82rem',cursor:'pointer'}}>⏹ Stop</button>
        </div>
      )}

      {/* Timer */}
      <div style={{...card,marginBottom:'1.25rem'}}>
        <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.625rem'}}>Session Duration</div>
        <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
          {TIMER_OPTIONS.map(t=>(
            <button key={t} onClick={()=>setTimer(t)} style={{padding:'0.35rem 0.75rem',borderRadius:'9999px',border:timer===t?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.1)',background:timer===t?'rgba(167,139,250,0.15)':'transparent',color:timer===t?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.75rem',cursor:'pointer'}}>{t} min</button>
          ))}
        </div>
      </div>

      {/* Frequency grid */}
      <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
        {FREQUENCIES.map(freq=>(
          <div key={freq.hz}
            onClick={()=>setSelected(selected===freq.hz?null:freq.hz)}
            style={{...card,padding:'1rem',cursor:'pointer',borderColor:playing===freq.hz?freq.color+'50':selected===freq.hz?'rgba(200,180,255,0.2)':'rgba(200,180,255,0.08)',marginBottom:0}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.875rem'}}>
              <div style={{width:'48px',height:'48px',borderRadius:'50%',background:freq.color+'15',border:'2px solid '+freq.color+'30',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>{freq.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.15rem'}}>
                  <span style={{color:'rgba(220,200,255,0.9)',fontSize:'0.95rem',fontWeight:700}}>{freq.hz} Hz</span>
                  <span style={{color:freq.color,fontSize:'0.75rem'}}>{freq.name}</span>
                  <span style={{color:'rgba(180,160,255,0.3)',fontSize:'0.65rem',marginLeft:'auto'}}>{freq.chakra}</span>
                </div>
                <div style={{color:'rgba(180,160,255,0.45)',fontSize:'0.72rem'}}>{freq.benefit}</div>
              </div>
              <button
                onClick={e=>{e.stopPropagation();playing===freq.hz?stopFrequency():startFrequency(freq.hz)}}
                style={{width:'36px',height:'36px',borderRadius:'50%',background:playing===freq.hz?freq.color+'25':'rgba(200,180,255,0.06)',border:'1px solid '+(playing===freq.hz?freq.color+'50':'rgba(200,180,255,0.15)'),color:playing===freq.hz?freq.color:'rgba(180,160,255,0.5)',fontSize:'0.9rem',cursor:'pointer',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}
              >{playing===freq.hz?'⏹':'▶'}</button>
            </div>
            {selected===freq.hz && (
              <div style={{marginTop:'0.75rem',paddingTop:'0.75rem',borderTop:'1px solid rgba(200,180,255,0.06)'}}>
                <p style={{color:'rgba(200,180,255,0.6)',fontSize:'0.82rem',lineHeight:1.6,margin:0}}>{freq.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
