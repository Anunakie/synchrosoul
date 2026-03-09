'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_gratitude'

type GratitudeEntry = {
  id: string
  items: string[]
  angelNumber: string
  mood: string
  createdAt: string
}

const MOODS = [
  { emoji:'🌟', label:'Radiant' },
  { emoji:'✨', label:'Grateful' },
  { emoji:'🌸', label:'Peaceful' },
  { emoji:'💫', label:'Hopeful' },
  { emoji:'🌙', label:'Reflective' },
  { emoji:'🔥', label:'Energized' },
]

const PROMPTS = [
  'A person who showed up for me today',
  'A number I saw that felt like a sign',
  'Something my body did well today',
  'A moment of unexpected beauty',
  'Something I learned about myself',
  'A challenge that made me stronger',
  'A small pleasure I almost missed',
  'Someone I am grateful to have in my life',
  'A door that closed to open a better one',
  'The universe showing up for me today',
]

export default function GratitudePage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [items, setItems] = useState(['','',''])
  const [angelNumber, setAngelNumber] = useState('')
  const [mood, setMood] = useState('✨')
  const [saved, setSaved] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [view, setView] = useState<'write'|'history'>('write')

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); if(s) setEntries(JSON.parse(s)) } catch {}
    setPrompt(PROMPTS[Math.floor(Math.random()*PROMPTS.length)])
  }, [])

  const todayKey = new Date().toDateString()
  const todayEntry = entries.find(e => new Date(e.createdAt).toDateString() === todayKey)

  function saveEntry() {
    const filled = items.filter(i=>i.trim())
    if (filled.length === 0) return
    const entry: GratitudeEntry = { id: Date.now().toString(), items: filled, angelNumber: angelNumber.trim(), mood, createdAt: new Date().toISOString() }
    const updated = [entry, ...entries.filter(e=>new Date(e.createdAt).toDateString()!==todayKey)]
    setEntries(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
    setSaved(true)
    setTimeout(()=>setSaved(false),2000)
  }

  function updateItem(i: number, val: string) {
    const updated = [...items]; updated[i] = val; setItems(updated)
  }

  const streak = (() => {
    let s = 0; const today = new Date()
    for (let i = 0; i < 30; i++) {
      const d = new Date(today); d.setDate(d.getDate()-i)
      if (entries.some(e=>new Date(e.createdAt).toDateString()===d.toDateString())) s++
      else if (i > 0) break
    }
    return s
  })()

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Gratitude</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>🔥 {streak} day streak · {entries.length} total entries</p>

      {/* Tabs */}
      <div style={{display:'flex',gap:'0.35rem',marginBottom:'1.25rem'}}>
        {(['write','history'] as const).map(t=>(
          <button key={t} onClick={()=>setView(t)} style={{padding:'0.35rem 0.875rem',borderRadius:'9999px',border:view===t?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.1)',background:view===t?'rgba(167,139,250,0.12)':'transparent',color:view===t?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.78rem',cursor:'pointer',textTransform:'capitalize'}}>{t==='write'?'Today':'History'}</button>
        ))}
      </div>

      {view === 'write' && (
        <>
          {todayEntry && (
            <div style={{...card,padding:'1rem',marginBottom:'1rem',background:'linear-gradient(135deg,rgba(74,222,128,0.06),rgba(8,6,28,0.95))',borderColor:'rgba(74,222,128,0.15)'}}>
              <div style={{color:'#4ade80',fontSize:'0.78rem',marginBottom:'0.5rem'}}>✓ You wrote gratitude today</div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.25rem'}}>
                {todayEntry.items.map((item,i)=>(
                  <div key={i} style={{color:'rgba(200,180,255,0.6)',fontSize:'0.82rem'}}>🙏 {item}</div>
                ))}
              </div>
            </div>
          )}

          {/* Prompt */}
          <div style={{...card,padding:'1rem',marginBottom:'1rem',background:'linear-gradient(135deg,rgba(201,168,76,0.05),rgba(8,6,28,0.95))',borderColor:'rgba(201,168,76,0.12)'}}>
            <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.35rem'}}>Today's Prompt</div>
            <div style={{color:'rgba(220,200,255,0.7)',fontSize:'0.88rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>“{prompt}”</div>
          </div>

          {/* Mood */}
          <div style={{...card,padding:'1rem',marginBottom:'1rem'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.625rem'}}>How are you feeling?</div>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
              {MOODS.map(m=>(
                <button key={m.emoji} onClick={()=>setMood(m.emoji)} style={{padding:'0.35rem 0.625rem',borderRadius:'0.625rem',border:mood===m.emoji?'1px solid rgba(167,139,250,0.4)':'1px solid rgba(200,180,255,0.08)',background:mood===m.emoji?'rgba(167,139,250,0.1)':'transparent',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.3rem'}}>
                  <span style={{fontSize:'1rem'}}>{m.emoji}</span>
                  <span style={{color:mood===m.emoji?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.72rem'}}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3 gratitudes */}
          <div style={{...card,padding:'1.25rem',marginBottom:'1rem'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>3 Things I Am Grateful For</div>
            {items.map((item,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:'0.625rem',marginBottom:'0.5rem'}}>
                <span style={{color:'rgba(201,168,76,0.5)',fontSize:'0.9rem',width:'20px',textAlign:'center'}}>{i+1}.</span>
                <input value={item} onChange={e=>updateItem(i,e.target.value)}
                  placeholder={i===0?'I am grateful for...':i===1?'Another blessing...':'One more thing...'}
                  style={{flex:1,background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.625rem',padding:'0.5rem 0.75rem',color:'rgba(220,200,255,0.8)',fontSize:'0.85rem',fontFamily:'inherit',outline:'none'}} />
              </div>
            ))}
            <div style={{marginTop:'0.875rem',display:'flex',alignItems:'center',gap:'0.5rem'}}>
              <input value={angelNumber} onChange={e=>setAngelNumber(e.target.value)}
                placeholder='Angel number seen today (optional)'
                style={{flex:1,background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.625rem',padding:'0.5rem 0.75rem',color:'rgba(220,200,255,0.8)',fontSize:'0.82rem',fontFamily:'inherit',outline:'none'}} />
            </div>
          </div>

          <button onClick={saveEntry} style={{width:'100%',padding:'0.75rem',borderRadius:'0.875rem',border:'none',background:saved?'rgba(74,222,128,0.2)':'linear-gradient(135deg,rgba(167,139,250,0.8),rgba(201,168,76,0.8))',color:saved?'#4ade80':'white',fontSize:'0.9rem',fontWeight:600,cursor:'pointer',transition:'all 0.3s'}}>
            {saved ? '✓ Gratitude Received' : '🙏 Save Gratitude'}
          </button>
        </>
      )}

      {view === 'history' && (
        <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
          {entries.length === 0 && (
            <div style={{textAlign:'center',padding:'3rem 1rem',color:'rgba(180,160,255,0.3)'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>🙏</div>
              <div>No entries yet. Start your gratitude practice today.</div>
            </div>
          )}
          {entries.map(entry=>(
            <div key={entry.id} style={card}>
              <div style={{padding:'0.875rem 1rem',borderBottom:'1px solid rgba(200,180,255,0.05)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <span style={{fontSize:'1.1rem'}}>{entry.mood}</span>
                  <span style={{color:'rgba(180,160,255,0.5)',fontSize:'0.75rem'}}>{new Date(entry.createdAt).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span>
                </div>
                {entry.angelNumber && <span style={{color:'#c9a84c',fontSize:'0.78rem',fontWeight:700}}>{entry.angelNumber}</span>}
              </div>
              <div style={{padding:'0.875rem 1rem'}}>
                {entry.items.map((item,i)=>(
                  <div key={i} style={{color:'rgba(200,180,255,0.6)',fontSize:'0.82rem',marginBottom:'0.3rem',display:'flex',gap:'0.5rem'}}>
                    <span style={{color:'rgba(201,168,76,0.4)'}}>🙏</span>{item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
