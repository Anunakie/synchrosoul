'use client'
import { useState, useEffect } from 'react'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_DREAMS = 'synchrosoul_dreams'
const KEY_GRATITUDE = 'synchrosoul_gratitude'

function getStreakData(items: {createdAt:string}[]) {
  if (!items.length) return { current:0, longest:0, totalDays:0, heatmap:[] as {date:string;count:number}[] }
  const dayMap: Record<string,number> = {}
  items.forEach(i => { const d = new Date(i.createdAt).toDateString(); dayMap[d]=(dayMap[d]||0)+1 })
  let current = 0
  const today = new Date()
  for (let i=0;i<365;i++) {
    const d = new Date(today); d.setDate(today.getDate()-i)
    if (dayMap[d.toDateString()]) current++
    else if (i>0) break
  }
  const sortedDays = Object.keys(dayMap).map(d=>new Date(d)).sort((a,b)=>a.getTime()-b.getTime())
  let longest=0,run=0
  for (let i=0;i<sortedDays.length;i++) {
    if (i===0){run=1;continue}
    const diff=(sortedDays[i].getTime()-sortedDays[i-1].getTime())/86400000
    if (diff<=1.5) run++; else run=1
    if (run>longest) longest=run
  }
  if (run>longest) longest=run
  const heatmap=[]
  for (let i=83;i>=0;i--) {
    const d=new Date(today); d.setDate(today.getDate()-i)
    heatmap.push({date:d.toDateString(),count:dayMap[d.toDateString()]||0})
  }
  return {current,longest,totalDays:Object.keys(dayMap).length,heatmap}
}

const MILESTONES = [
  {days:3,emoji:'🌱',label:'Spark',desc:'You have begun'},
  {days:7,emoji:'🌙',label:'One Week',desc:'A full lunar phase'},
  {days:11,emoji:'✨',label:'Master 11',desc:'Master number energy'},
  {days:21,emoji:'🌸',label:'Habit Formed',desc:'21 days of devotion'},
  {days:22,emoji:'⚡',label:'Master 22',desc:'The master builder'},
  {days:33,emoji:'👑',label:'Master 33',desc:'The master teacher'},
  {days:40,emoji:'🔥',label:'Sacred 40',desc:'Biblical transformation'},
  {days:100,emoji:'💎',label:'Century',desc:'100 days of alignment'},
  {days:111,emoji:'🌌',label:'Portal 111',desc:'Cosmic gateway opened'},
  {days:222,emoji:'🕊️',label:'Balance 222',desc:'Divine harmony achieved'},
  {days:333,emoji:'🔮',label:'Trinity 333',desc:'Ascended master level'},
  {days:365,emoji:'☀️',label:'Solar Year',desc:'One full revolution'},
]

type TabType = 'logs'|'dreams'|'gratitude'

export default function StreakPage() {
  const [logS,setLogS] = useState({current:0,longest:0,totalDays:0,heatmap:[] as {date:string;count:number}[]})
  const [dreamS,setDreamS] = useState({current:0,longest:0,totalDays:0,heatmap:[] as {date:string;count:number}[]})
  const [gratS,setGratS] = useState({current:0,longest:0,totalDays:0,heatmap:[] as {date:string;count:number}[]})
  const [tab,setTab] = useState<TabType>('logs')

  useEffect(()=>{
    try {
      setLogS(getStreakData(JSON.parse(localStorage.getItem(KEY_LOGS)||'[]')))
      setDreamS(getStreakData(JSON.parse(localStorage.getItem(KEY_DREAMS)||'[]')))
      setGratS(getStreakData(JSON.parse(localStorage.getItem(KEY_GRATITUDE)||'[]')))
    } catch {}
  },[])

  const active = tab==='logs'?logS:tab==='dreams'?dreamS:gratS
  const nextM = MILESTONES.find(m=>m.days>active.current)
  const lastM = [...MILESTONES].reverse().find(m=>m.days<=active.current)

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',padding:'1.25rem',marginBottom:'0.875rem'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Streaks</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Consistency is the highest spiritual practice</p>

      <div style={{display:'flex',gap:'0.4rem',marginBottom:'1.25rem'}}>
        {([['logs','❆ Signs'],['dreams','🌙 Dreams'],['gratitude','💛 Gratitude']] as [TabType,string][]).map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'0.4rem 0.875rem',borderRadius:'9999px',border:tab===t?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.1)',background:tab===t?'rgba(167,139,250,0.15)':'transparent',color:tab===t?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.75rem',cursor:'pointer'}}>{l}</button>
        ))}
      </div>

      <div style={{...card,textAlign:'center',borderColor:active.current>0?'rgba(251,146,60,0.25)':'rgba(200,180,255,0.1)'}}>
        <div style={{fontSize:'3.5rem',marginBottom:'0.25rem'}}>{active.current>0?'🔥':'❆'}</div>
        <div style={{color:active.current>0?'#fb923c':'rgba(180,160,255,0.4)',fontSize:'3rem',fontWeight:700,lineHeight:1}}>{active.current}</div>
        <div style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',marginTop:'0.25rem'}}>day streak</div>
        {lastM&&<div style={{marginTop:'0.875rem',display:'inline-flex',alignItems:'center',gap:'0.4rem',background:'rgba(251,146,60,0.08)',border:'1px solid rgba(251,146,60,0.15)',borderRadius:'9999px',padding:'0.3rem 0.875rem'}}><span>{lastM.emoji}</span><span style={{color:'#fb923c',fontSize:'0.78rem'}}>{lastM.label} achieved!</span></div>}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.5rem',marginBottom:'1rem'}}>
        {[
          {label:'Current',value:active.current+'🔥',color:'#fb923c'},
          {label:'Longest',value:active.longest,color:'#a78bfa'},
          {label:'Total Days',value:active.totalDays,color:'#c9a84c'},
        ].map(s=>(
          <div key={s.label} style={{background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.08)',borderRadius:'0.875rem',padding:'0.75rem',textAlign:'center'}}>
            <div style={{color:s.color,fontSize:'1.3rem',fontWeight:700}}>{s.value}</div>
            <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.06em'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {nextM&&(
        <div style={{...card,borderColor:'rgba(201,168,76,0.15)'}}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>Next Milestone</div>
          <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <div style={{fontSize:'2rem',flexShrink:0}}>{nextM.emoji}</div>
            <div style={{flex:1}}>
              <div style={{color:'rgba(220,200,255,0.85)',fontSize:'0.9rem',fontWeight:600}}>{nextM.label} — {nextM.days} days</div>
              <div style={{color:'rgba(180,160,255,0.45)',fontSize:'0.78rem',marginBottom:'0.5rem'}}>{nextM.desc} · {nextM.days-active.current} days to go</div>
              <div style={{height:'4px',background:'rgba(200,180,255,0.08)',borderRadius:'9999px',overflow:'hidden'}}>
                <div style={{height:'100%',width:Math.min(active.current/nextM.days*100,100)+'%',background:'linear-gradient(90deg,#fb923c,#c9a84c)',borderRadius:'9999px'}} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={card}>
        <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>Last 12 Weeks</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(12,1fr)',gap:'3px'}}>
          {Array.from({length:12}).map((_,week)=>(
            <div key={week} style={{display:'flex',flexDirection:'column',gap:'3px'}}>
              {active.heatmap.slice(week*7,week*7+7).map((day,i)=>(
                <div key={i} title={day.date+': '+day.count} style={{width:'100%',aspectRatio:'1',borderRadius:'2px',background:day.count===0?'rgba(200,180,255,0.05)':day.count===1?'rgba(167,139,250,0.3)':day.count<=3?'rgba(167,139,250,0.6)':'rgba(167,139,250,0.9)'}} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>All Milestones</div>
        <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
          {MILESTONES.map(m=>{
            const done=active.current>=m.days
            return (
              <div key={m.days} style={{display:'flex',alignItems:'center',gap:'0.75rem',opacity:done?1:0.4}}>
                <span style={{fontSize:'1.2rem',filter:done?'none':'grayscale(1)'}}>{m.emoji}</span>
                <div style={{flex:1}}>
                  <span style={{color:done?'rgba(220,200,255,0.85)':'rgba(180,160,255,0.4)',fontSize:'0.82rem'}}>{m.label}</span>
                  <span style={{color:'rgba(180,160,255,0.3)',fontSize:'0.72rem',marginLeft:'0.5rem'}}>· {m.days} days</span>
                </div>
                {done&&<span style={{color:'#4ade80',fontSize:'0.7rem'}}>✓</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
