'use client'
import { useState, useEffect } from 'react'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_PROFILE = 'synchrosoul_numerology_profile'

const ORACLE_READINGS = [
  { theme: 'manifestation', message: 'The numbers you are seeing are not coincidences — they are coordinates. The universe has been trying to show you the exact frequency you need to broadcast. Your desires are already formed in the etheric realm. The only work left is to believe they are already yours.', action: 'Write down one thing you are calling in. Hold it in your heart for 60 seconds.', symbol: '✦' },
  { theme: 'transition', message: 'You are standing at a threshold. The old version of you served its purpose beautifully — honor it before you release it. The angel numbers appearing now are not warnings; they are escorts guiding you through the doorway. Trust the dissolution.', action: 'Identify one thing you are ready to release. Say its name aloud and let it go.', symbol: '◈' },
  { theme: 'alignment', message: 'Your soul is recalibrating. The sequences you have been seeing form a pattern that points to deep inner alignment — your thoughts, emotions, and actions are beginning to vibrate at the same frequency. This is rare. This is sacred. Do not rush it.', action: 'Sit in stillness for 5 minutes. Notice what arises without judgment.', symbol: '◎' },
  { theme: 'love', message: 'The universe is orchestrating a meeting of souls. Whether romantic, platonic, or a reunion with yourself — love in its purest form is moving toward you. The numbers you see are breadcrumbs on the path. Follow the warmth, not the logic.', action: 'Send a loving thought to someone who needs it today, including yourself.', symbol: '♡' },
  { theme: 'awakening', message: 'Something ancient within you is stirring. You have been here before — not in this body, but in this knowing. The angel numbers are activating dormant codes in your consciousness. Pay attention to what feels familiar that should not.', action: 'Journal about a recurring dream, feeling, or knowing you cannot explain.', symbol: '✶' },
  { theme: 'abundance', message: 'The frequency of abundance is not about money — it is about flow. You have been blocking the river with worry. The numbers appearing now are asking you to open your hands. What you release will return multiplied. What you grip will wither.', action: 'Give something away today — time, kindness, or a resource. Watch what returns.', symbol: '∞' },
  { theme: 'protection', message: 'You are held. Even in the moments that felt like freefall, invisible hands were beneath you. The sequences you have been logging are confirmation that your guides are unusually close right now. You are not alone in this. You never were.', action: 'Place your hand on your heart and say: I am protected. I am guided. I am loved.', symbol: '⊕' },
  { theme: 'purpose', message: 'The question you keep returning to — the one about why you are here — is about to receive an answer. Not in words, but in a feeling so clear it will rearrange your priorities. The numbers have been preparing you for this clarity. Stay open.', action: 'Ask yourself: What would I do if I knew I could not fail? Write the first answer that comes.', symbol: '⟡' },
]

const QUESTIONS = [
  'What does the universe want me to know right now?',
  'What is blocking my highest path?',
  'What is my soul trying to tell me?',
  'What should I focus on this week?',
  'What is the meaning of the numbers I keep seeing?',
  'What am I ready to release?',
  'What is coming toward me?',
  'How can I align with my purpose?',
]

export default function OraclePage() {
  const [phase, setPhase] = useState<'ask'|'channeling'|'revealed'>('ask')
  const [question, setQuestion] = useState('')
  const [customQ, setCustomQ] = useState('')
  const [reading, setReading] = useState<typeof ORACLE_READINGS[0]|null>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [history, setHistory] = useState<{q:string,r:typeof ORACLE_READINGS[0],ts:number}[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    try {
      const l = localStorage.getItem(KEY_LOGS); if(l) setLogs(JSON.parse(l))
      const p = localStorage.getItem(KEY_PROFILE); if(p) setProfile(JSON.parse(p))
      const h = localStorage.getItem('synchrosoul_oracle_history'); if(h) setHistory(JSON.parse(h))
    } catch {}
  }, [])

  function askOracle(q: string) {
    if (!q.trim()) return
    setQuestion(q)
    setPhase('channeling')
    setTimeout(() => {
      const idx = Math.floor(Math.random() * ORACLE_READINGS.length)
      const r = ORACLE_READINGS[idx]
      setReading(r)
      setPhase('revealed')
      const newHistory = [{q, r, ts: Date.now()}, ...history].slice(0, 10)
      setHistory(newHistory)
      localStorage.setItem('synchrosoul_oracle_history', JSON.stringify(newHistory))
    }, 2800)
  }

  function reset() {
    setPhase('ask')
    setQuestion('')
    setCustomQ('')
    setReading(null)
  }

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'520px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.25rem'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:0,fontWeight:400}}>The Oracle</h1>
        <button onClick={()=>setShowHistory(!showHistory)} style={{background:'none',border:'none',color:'rgba(180,160,255,0.4)',fontSize:'0.75rem',cursor:'pointer'}}>History</button>
      </div>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.5rem'}}>Ask and the universe will answer through your numbers</p>

      {showHistory && history.length > 0 && (
        <div style={{...card,padding:'1rem',marginBottom:'1.25rem'}}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.625rem'}}>Past Readings</div>
          {history.slice(0,5).map((h,i)=>(
            <div key={i} style={{padding:'0.625rem 0',borderBottom:'1px solid rgba(200,180,255,0.05)'}}>
              <div style={{color:'rgba(200,180,255,0.6)',fontSize:'0.78rem',marginBottom:'0.2rem',fontStyle:'italic'}}>“{h.q}”</div>
              <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.7rem'}}>{h.r.theme} · {new Date(h.ts).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}

      {phase === 'ask' && (
        <>
          {/* Suggested questions */}
          <div style={{...card,padding:'1.25rem',marginBottom:'1rem'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.75rem'}}>Choose a Question</div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
              {QUESTIONS.map(q=>(
                <button key={q} onClick={()=>askOracle(q)}
                  style={{padding:'0.625rem 0.875rem',borderRadius:'0.75rem',border:'1px solid rgba(200,180,255,0.08)',background:'rgba(200,180,255,0.03)',color:'rgba(200,180,255,0.65)',fontSize:'0.82rem',cursor:'pointer',textAlign:'left',fontFamily:'inherit',transition:'all 0.2s'}}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Custom question */}
          <div style={{...card,padding:'1.25rem'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.625rem'}}>Or Ask Your Own</div>
            <textarea
              value={customQ}
              onChange={e=>setCustomQ(e.target.value)}
              placeholder='What is on your heart right now...'
              rows={3}
              style={{width:'100%',background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.75rem',padding:'0.75rem',color:'rgba(220,200,255,0.85)',fontSize:'0.88rem',fontFamily:'inherit',outline:'none',resize:'none',boxSizing:'border-box'}}
            />
            <button
              onClick={()=>askOracle(customQ)}
              disabled={!customQ.trim()}
              style={{marginTop:'0.625rem',width:'100%',padding:'0.75rem',borderRadius:'0.875rem',background:customQ.trim()?'rgba(167,139,250,0.15)':'rgba(200,180,255,0.04)',border:customQ.trim()?'1px solid rgba(167,139,250,0.3)':'1px solid rgba(200,180,255,0.08)',color:customQ.trim()?'#a78bfa':'rgba(180,160,255,0.25)',fontSize:'0.88rem',cursor:customQ.trim()?'pointer':'default',fontFamily:'inherit',transition:'all 0.2s'}}
            >Ask the Oracle ✦</button>
          </div>
        </>
      )}

      {phase === 'channeling' && (
        <div style={{textAlign:'center',padding:'4rem 2rem'}}>
          <div style={{fontSize:'3rem',marginBottom:'1.25rem',animation:'spin 3s linear infinite'}}>◈</div>
          <p style={{color:'rgba(180,160,255,0.6)',fontSize:'0.9rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',marginBottom:'0.5rem'}}>Channeling your answer...</p>
          <p style={{color:'rgba(180,160,255,0.35)',fontSize:'0.78rem',fontStyle:'italic'}}>“{question}”</p>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {phase === 'revealed' && reading && (
        <>
          <div style={{...card,padding:'1.75rem',marginBottom:'1rem',background:'linear-gradient(135deg,rgba(167,139,250,0.08),rgba(201,168,76,0.06))',borderColor:'rgba(167,139,250,0.25)'}}>
            <div style={{textAlign:'center',marginBottom:'1.25rem'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'0.5rem',color:'#a78bfa'}}>{reading.symbol}</div>
              <div style={{color:'rgba(167,139,250,0.5)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.15em'}}>{reading.theme}</div>
            </div>
            <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.72rem',fontStyle:'italic',marginBottom:'0.875rem',textAlign:'center'}}>“{question}”</div>
            <p style={{color:'rgba(220,200,255,0.85)',fontSize:'1.05rem'}}>{reading.message}</p>
            <div style={{background:'rgba(201,168,76,0.06)',border:'1px solid rgba(201,168,76,0.15)',borderRadius:'0.875rem',padding:'0.875rem'}}>
              <div style={{color:'rgba(201,168,76,0.5)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.35rem'}}>Your Action</div>
              <p style={{color:'rgba(220,200,255,0.75)',fontSize:'0.85rem',lineHeight:1.6,margin:0}}>{reading.action}</p>
            </div>
          </div>
          <button onClick={reset} style={{width:'100%',padding:'0.875rem',borderRadius:'0.875rem',background:'rgba(200,180,255,0.06)',border:'1px solid rgba(200,180,255,0.12)',color:'rgba(180,160,255,0.6)',fontSize:'0.88rem',cursor:'pointer',fontFamily:'inherit'}}>Ask Another Question</button>
        </>
      )}
    </div>
  )
}
