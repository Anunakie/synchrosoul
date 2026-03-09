'use client'
import { useState, useEffect } from 'react'

const KEY_PROFILE = 'synchrosoul_numerology_profile'

function calcPersonalYear(dob: string, year: number): number {
  const d = new Date(dob)
  const month = d.getMonth() + 1
  const day = d.getDate()
  let n = month + day + year
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((s,c) => s + parseInt(c), 0)
  }
  return n
}

function calcPersonalMonth(personalYear: number, month: number): number {
  let n = personalYear + month
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((s,c) => s + parseInt(c), 0)
  }
  return n
}

const YEAR_DATA: Record<number, { theme: string; keywords: string[]; advice: string; color: string; emoji: string }> = {
  1: { theme: 'New Beginnings', keywords: ['initiation','independence','courage','leadership','fresh start'], advice: 'Plant seeds boldly. This is your year to begin what you have been dreaming of. Take initiative — the universe backs your first steps.', color: '#f87171', emoji: '🌱' },
  2: { theme: 'Patience & Partnership', keywords: ['cooperation','sensitivity','balance','waiting','relationships'], advice: 'Slow down and trust divine timing. Nurture your relationships. What you planted last year is quietly growing beneath the surface.', color: '#60a5fa', emoji: '🕊️' },
  3: { theme: 'Creative Expression', keywords: ['creativity','joy','communication','expansion','socializing'], advice: 'Express yourself fully. Write, create, speak your truth. Joy is your spiritual practice this year — follow what lights you up.', color: '#fbbf24', emoji: '🌟' },
  4: { theme: 'Foundation Building', keywords: ['discipline','work','structure','stability','health'], advice: 'Build the structures that will support your dreams. Hard work now creates lasting results. Focus on health, finances, and solid foundations.', color: '#34d399', emoji: '🏛️' },
  5: { theme: 'Freedom & Change', keywords: ['transformation','adventure','freedom','travel','unexpected'], advice: 'Embrace change — it is your teacher this year. Release what no longer serves you. Adventure and unexpected opportunities are your gifts.', color: '#a78bfa', emoji: '🌊' },
  6: { theme: 'Love & Responsibility', keywords: ['family','service','healing','home','love'], advice: 'Your heart is your compass. Tend to your relationships, home, and community. Service to others brings deep fulfillment this year.', color: '#f472b6', emoji: '💗' },
  7: { theme: 'Spiritual Deepening', keywords: ['introspection','wisdom','solitude','research','faith'], advice: 'Go within. This is a year of spiritual growth, not outer achievement. Study, meditate, and trust the quiet voice of your soul.', color: '#818cf8', emoji: '🔮' },
  8: { theme: 'Power & Abundance', keywords: ['manifestation','success','authority','finances','karma'], advice: 'Step into your power. What you have built is ready to bear fruit. Financial and professional abundance flows when you act with integrity.', color: '#c9a84c', emoji: '👑' },
  9: { theme: 'Completion & Release', keywords: ['endings','compassion','release','wisdom','completion'], advice: 'Let go with grace. This is a year of completion — release what has run its course. Your compassion and wisdom are gifts to the world.', color: '#fb923c', emoji: '🌌' },
  11: { theme: 'Illumination', keywords: ['inspiration','intuition','spiritual mastery','vision','awakening'], advice: 'You are a channel for higher wisdom this year. Trust your intuition completely. Your sensitivity is your superpower — use it to inspire others.', color: '#e879f9', emoji: '⚡' },
  22: { theme: 'Master Building', keywords: ['legacy','vision','manifestation','leadership','impact'], advice: 'You have the power to build something of lasting significance this year. Think big — your dreams can become reality on a grand scale.', color: '#2dd4bf', emoji: '🏗️' },
  33: { theme: 'Master Teaching', keywords: ['unconditional love','healing','teaching','service','compassion'], advice: 'You are called to serve humanity with unconditional love. Your healing presence transforms everyone you touch. Lead with your heart.', color: '#f9a8d4', emoji: '🧡' },
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function PersonalYearPage() {
  const [dob, setDob] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(KEY_PROFILE) || 'null')
      if (p?.birthdate) { setProfile(p); setDob(p.birthdate) }
    } catch {}
  }, [])

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const py = dob ? calcPersonalYear(dob, year) : null
  const pyData = py ? YEAR_DATA[py] : null
  const pm = py ? calcPersonalMonth(py, currentMonth) : null
  const pmData = pm ? YEAR_DATA[pm] : null

  // 9-year cycle
  const cycleStart = dob ? year - ((calcPersonalYear(dob, year) - 1 + 9) % 9) : null

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',padding:'1.25rem',marginBottom:'0.875rem'}
  const input: React.CSSProperties = {background:'rgba(255,255,255,0.03)',border:'1px solid rgba(200,180,255,0.12)',borderRadius:'0.75rem',padding:'0.65rem 0.875rem',color:'rgba(220,200,255,0.85)',fontSize:'0.9rem',fontFamily:'inherit',outline:'none'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Personal Year</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Your numerological forecast for {year}</p>

      {!profile && (
        <div style={{...card,borderColor:'rgba(201,168,76,0.2)',marginBottom:'1.25rem'}}>
          <div style={{color:'rgba(201,168,76,0.6)',fontSize:'0.72rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>Enter Your Birthdate</div>
          <input type='date' value={dob} onChange={e=>setDob(e.target.value)} style={{...input,width:'100%',boxSizing:'border-box' as const}} />
        </div>
      )}

      {/* Year selector */}
      <div style={{display:'flex',gap:'0.5rem',alignItems:'center',marginBottom:'1.25rem'}}>
        <button onClick={()=>setYear(y=>y-1)} style={{background:'rgba(200,180,255,0.08)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.5rem',padding:'0.4rem 0.75rem',color:'rgba(180,160,255,0.6)',cursor:'pointer',fontSize:'0.9rem'}}>←</button>
        <div style={{flex:1,textAlign:'center',color:'rgba(220,200,255,0.85)',fontSize:'1.1rem',fontWeight:600}}>{year}</div>
        <button onClick={()=>setYear(y=>y+1)} style={{background:'rgba(200,180,255,0.08)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.5rem',padding:'0.4rem 0.75rem',color:'rgba(180,160,255,0.6)',cursor:'pointer',fontSize:'0.9rem'}}>→</button>
      </div>

      {py && pyData && (
        <>
          {/* Main card */}
          <div style={{...card,borderColor:pyData.color+'30',background:'rgba(8,6,28,0.95)',textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:'0.5rem'}}>{pyData.emoji}</div>
            <div style={{color:pyData.color,fontSize:'3.5rem',fontWeight:700,lineHeight:1,marginBottom:'0.25rem'}}>{py}</div>
            <div style={{color:'rgba(220,200,255,0.85)',fontSize:'1.1rem',fontFamily:'Cormorant Garamond,serif',marginBottom:'0.875rem'}}>{pyData.theme}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.35rem',justifyContent:'center',marginBottom:'1rem'}}>
              {pyData.keywords.map(k=>(
                <span key={k} style={{background:pyData.color+'12',border:'1px solid '+pyData.color+'25',borderRadius:'9999px',padding:'0.2rem 0.65rem',color:pyData.color,fontSize:'0.72rem'}}>{k}</span>
              ))}
            </div>
            <p style={{color:'rgba(200,180,255,0.7)',fontSize:'1rem'}}>{pyData.advice}</p>
          </div>

          {/* Personal month */}
          {year === currentYear && pm && pmData && (
            <div style={{...card,borderColor:pmData.color+'25'}}>
              <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>Personal Month — {MONTHS[currentMonth-1]}</div>
              <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{width:'56px',height:'56px',borderRadius:'50%',background:pmData.color+'12',border:'1px solid '+pmData.color+'25',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                  <span style={{color:pmData.color,fontSize:'1.5rem',fontWeight:700}}>{pm}</span>
                </div>
                <div>
                  <div style={{color:'rgba(220,200,255,0.85)',fontSize:'0.9rem',fontWeight:600,marginBottom:'0.2rem'}}>{pmData.theme}</div>
                  <div style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',lineHeight:1.5}}>{pmData.advice.slice(0,100)}...</div>
                </div>
              </div>
            </div>
          )}

          {/* 12-month overview */}
          <div style={card}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>Monthly Forecast {year}</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.4rem'}}>
              {MONTHS.map((m,i)=>{
                const monthNum = i+1
                const monthPY = calcPersonalMonth(py, monthNum)
                const mData = YEAR_DATA[monthPY]
                const isNow = year===currentYear && monthNum===currentMonth
                return (
                  <div key={m} style={{background:isNow?mData?.color+'15':'rgba(8,6,28,0.5)',border:isNow?'1px solid '+mData?.color+'40':'1px solid rgba(200,180,255,0.06)',borderRadius:'0.625rem',padding:'0.5rem',textAlign:'center'}}>
                    <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.6rem',marginBottom:'0.2rem'}}>{m}</div>
                    <div style={{color:mData?.color||'#a78bfa',fontSize:'1rem',fontWeight:700}}>{monthPY}</div>
                    <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.55rem',marginTop:'0.15rem'}}>{mData?.emoji}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 9-year cycle */}
          {cycleStart && (
            <div style={card}>
              <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>Your 9-Year Cycle</div>
              <div style={{display:'flex',gap:'0.3rem',alignItems:'flex-end'}}>
                {Array.from({length:9}).map((_,i)=>{
                  const cycleYear = cycleStart+i
                  const cycleNum = i+1
                  const cData = YEAR_DATA[cycleNum]
                  const isCurrent = cycleYear===year
                  return (
                    <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'0.2rem'}}>
                      <div style={{width:'100%',height:isCurrent?'48px':'32px',background:isCurrent?cData?.color+'50':cData?.color+'20',borderRadius:'3px 3px 0 0',border:isCurrent?'1px solid '+cData?.color+'60':'none',transition:'all 0.3s',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        <span style={{color:cData?.color,fontSize:'0.7rem',fontWeight:700}}>{cycleNum}</span>
                      </div>
                      <div style={{color:isCurrent?'rgba(220,200,255,0.7)':'rgba(180,160,255,0.25)',fontSize:'0.55rem'}}>{cycleYear}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {!dob && (
        <div style={{textAlign:'center',padding:'3rem 1rem'}}>
          <div style={{fontSize:'2.5rem',marginBottom:'0.875rem'}}>📅</div>
          <p style={{color:'rgba(180,160,255,0.4)',fontSize:'0.85rem'}}>Enter your birthdate above to reveal your personal year forecast.</p>
        </div>
      )}
    </div>
  )
}
