'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAngelMeaning } from '@/lib/angel-meanings'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_PROFILE = 'synchrosoul_numerology_profile'

const TIME_LABELS: Record<number,string> = {
  0:'Midnight',1:'1am',2:'2am',3:'3am',4:'4am',5:'5am',
  6:'Dawn',7:'7am',8:'8am',9:'9am',10:'10am',11:'11am',
  12:'Noon',13:'1pm',14:'2pm',15:'3pm',16:'4pm',17:'5pm',
  18:'Evening',19:'7pm',20:'8pm',21:'9pm',22:'10pm',23:'11pm'
}

const MOON_PHASES = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘']
function getMoonPhase(date: Date) {
  const known = new Date('2000-01-06')
  const diff = (date.getTime() - known.getTime()) / (1000*60*60*24)
  const cycle = diff % 29.53
  return MOON_PHASES[Math.floor(cycle / 29.53 * 8) % 8]
}

export default function InsightsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [tab, setTab] = useState<'patterns'|'timing'|'themes'|'growth'>('patterns')

  useEffect(() => {
    try {
      const l = localStorage.getItem(KEY_LOGS); if(l) setLogs(JSON.parse(l))
      const p = localStorage.getItem(KEY_PROFILE); if(p) setProfile(JSON.parse(p))
    } catch {}
  }, [])

  // Number frequency
  const numCounts: Record<string,number> = {}
  logs.forEach(l => { numCounts[l.number]=(numCounts[l.number]||0)+1 })
  const topNumbers = Object.entries(numCounts).sort((a,b)=>b[1]-a[1]).slice(0,5)

  // Hour distribution
  const hourCounts: Record<number,number> = {}
  for(let h=0;h<24;h++) hourCounts[h]=0
  logs.forEach(l => { hourCounts[new Date(l.timestamp).getHours()]++ })
  const peakHour = Object.entries(hourCounts).sort((a,b)=>b[1]-a[1])[0]

  // Day of week
  const dayCounts: Record<string,number> = {Sun:0,Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0}
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  logs.forEach(l => { dayCounts[dayNames[new Date(l.timestamp).getDay()]]++ })
  const peakDay = Object.entries(dayCounts).sort((a,b)=>b[1]-a[1])[0]

  // Weekly trend (last 8 weeks)
  const weekCounts: number[] = Array(8).fill(0)
  const now = Date.now()
  logs.forEach(l => {
    const weeksAgo = Math.floor((now - new Date(l.timestamp).getTime()) / (7*86400000))
    if(weeksAgo < 8) weekCounts[7-weeksAgo]++
  })

  // Thought keywords
  const wordCounts: Record<string,number> = {}
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','i','my','me','was','is','are','it','this','that','be','have','had','has','do','did','not','so','if','as','by','from','up','about','into','then','than','when','what','how','all','just','been','will','would','could','should','they','them','their','there','we','our','you','your'])
  logs.forEach(l => {
    if(l.thought) {
      l.thought.toLowerCase().split(/\W+/).forEach((w:string) => {
        if(w.length>3 && !stopWords.has(w)) wordCounts[w]=(wordCounts[w]||0)+1
      })
    }
  })
  const topWords = Object.entries(wordCounts).sort((a,b)=>b[1]-a[1]).slice(0,12)

  // Moon phase distribution
  const moonCounts: Record<string,number> = {}
  logs.forEach(l => {
    const phase = getMoonPhase(new Date(l.timestamp))
    moonCounts[phase]=(moonCounts[phase]||0)+1
  })
  const topMoon = Object.entries(moonCounts).sort((a,b)=>b[1]-a[1])[0]

  // Growth: logs per week
  const growthTrend = weekCounts[7] > weekCounts[0] ? 'growing' : weekCounts[7] < weekCounts[0] ? 'declining' : 'steady'

  // Streak
  let streak = 0
  const logDays = new Set(logs.map(l=>new Date(l.timestamp).toDateString()))
  let checkDate = new Date()
  while(logDays.has(checkDate.toDateString())) {
    streak++
    checkDate.setDate(checkDate.getDate()-1)
  }

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',padding:'1.25rem',marginBottom:'0.875rem'}
  const maxBar = Math.max(...Object.values(hourCounts), 1)
  const maxDay = Math.max(...Object.values(dayCounts), 1)
  const maxWeek = Math.max(...weekCounts, 1)

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Cosmic Insights</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Deep patterns in your spiritual journey</p>

      {/* Tabs */}
      <div style={{display:'flex',gap:'0.35rem',marginBottom:'1.25rem',flexWrap:'wrap'}}>
        {([['patterns','Patterns'],['timing','Timing'],['themes','Themes'],['growth','Growth']] as const).map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'0.35rem 0.875rem',borderRadius:'9999px',border:tab===t?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.1)',background:tab===t?'rgba(167,139,250,0.15)':'transparent',color:tab===t?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.75rem',cursor:'pointer'}}>{l}</button>
        ))}
      </div>

      {logs.length === 0 && (
        <div style={{...card,textAlign:'center',padding:'3rem'}}>
          <div style={{fontSize:'2rem',marginBottom:'0.625rem'}}>🔮</div>
          <p style={{color:'rgba(180,160,255,0.4)',fontSize:'0.9rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',margin:'0 0 0.5rem'}}>Log angel numbers to unlock your cosmic insights</p>
          <Link href='/dashboard' style={{color:'#a78bfa',fontSize:'0.82rem'}}>Start logging →</Link>
        </div>
      )}

      {logs.length > 0 && tab==='patterns' && (
        <>
          {/* Top numbers with meanings */}
          <div style={card}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Your Signature Numbers</div>
            {topNumbers.map(([num,count],i)=>{
              const meaning = getAngelMeaning(num)
              return (
                <div key={num} style={{display:'flex',alignItems:'center',gap:'0.875rem',padding:'0.625rem 0',borderBottom:i<topNumbers.length-1?'1px solid rgba(200,180,255,0.05)':'none'}}>
                  <div style={{width:'32px',height:'32px',borderRadius:'50%',background:meaning.color+'15',border:'1px solid '+meaning.color+'30',display:'flex',alignItems:'center',justifyContent:'center',color:meaning.color,fontSize:'0.7rem',fontWeight:700,flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.15rem'}}>
                      <span style={{color:meaning.color,fontSize:'0.95rem',fontWeight:700}}>{num}</span>
                      <span style={{color:'rgba(180,160,255,0.5)',fontSize:'0.75rem'}}>{meaning.title}</span>
                    </div>
                    <div style={{height:'4px',background:'rgba(200,180,255,0.06)',borderRadius:'2px',overflow:'hidden'}}>
                      <div style={{height:'100%',width:(count/logs.length*100)+'%',background:meaning.color,borderRadius:'2px'}} />
                    </div>
                  </div>
                  <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.78rem',minWidth:'30px',textAlign:'right'}}>{count}x</div>
                </div>
              )
            })}
          </div>

          {/* Moon phase insight */}
          {topMoon && (
            <div style={{...card,background:'linear-gradient(135deg,rgba(148,163,184,0.06),rgba(8,6,28,0.95))',borderColor:'rgba(148,163,184,0.15)'}}>
              <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.5rem'}}>Moon Phase Affinity</div>
              <div style={{display:'flex',alignItems:'center',gap:'0.875rem'}}>
                <span style={{fontSize:'2.5rem'}}>{topMoon[0]}</span>
                <div>
                  <div style={{color:'rgba(220,200,255,0.85)',fontSize:'0.9rem',marginBottom:'0.15rem'}}>You see the most numbers during the {['New Moon','Waxing Crescent','First Quarter','Waxing Gibbous','Full Moon','Waning Gibbous','Last Quarter','Waning Crescent'][MOON_PHASES.indexOf(topMoon[0])]} phase</div>
                  <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.75rem'}}>{topMoon[1]} sightings during this phase</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {logs.length > 0 && tab==='timing' && (
        <>
          {/* Hour heatmap */}
          <div style={card}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Hour of Day</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:'0.3rem',marginBottom:'0.625rem'}}>
              {Array.from({length:24},(_,h)=>(
                <div key={h} title={TIME_LABELS[h]+': '+hourCounts[h]} style={{height:'32px',borderRadius:'4px',background:'rgba(167,139,250,'+(0.05+hourCounts[h]/maxBar*0.7)+')',border:'1px solid rgba(167,139,250,'+(0.05+hourCounts[h]/maxBar*0.3)+')',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.55rem',color:'rgba(180,160,255,'+(0.3+hourCounts[h]/maxBar*0.7)+')'}}>
                  {h%6===0?TIME_LABELS[h].replace('am','').replace('pm','').replace('Midnight','12').replace('Noon','12').replace('Dawn','6').replace('Evening','6'):''}
                </div>
              ))}
            </div>
            {peakHour && <div style={{color:'rgba(180,160,255,0.5)',fontSize:'0.78rem'}}>Peak time: <span style={{color:'#a78bfa'}}>{TIME_LABELS[parseInt(peakHour[0])]}</span> ({peakHour[1]} sightings)</div>}
          </div>

          {/* Day of week */}
          <div style={card}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Day of Week</div>
            <div style={{display:'flex',gap:'0.3rem',alignItems:'flex-end',height:'80px'}}>
              {dayNames.map(day=>(
                <div key={day} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'0.25rem'}}>
                  <div style={{width:'100%',background:'rgba(201,168,76,'+(0.1+dayCounts[day]/maxDay*0.6)+')',borderRadius:'3px 3px 0 0',height:(dayCounts[day]/maxDay*60+4)+'px',border:'1px solid rgba(201,168,76,'+(0.1+dayCounts[day]/maxDay*0.4)+')'}} />
                  <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.6rem'}}>{day}</div>
                </div>
              ))}
            </div>
            {peakDay && <div style={{color:'rgba(180,160,255,0.5)',fontSize:'0.78rem',marginTop:'0.5rem'}}>Most active: <span style={{color:'#c9a84c'}}>{peakDay[0]}</span></div>}
          </div>
        </>
      )}

      {logs.length > 0 && tab==='themes' && (
        <>
          {/* Word cloud */}
          <div style={card}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Thought Themes</div>
            {topWords.length > 0 ? (
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.4rem'}}>
                {topWords.map(([word,count],i)=>{
                  const size = 0.7 + (count/topWords[0][1])*0.5
                  const opacity = 0.4 + (count/topWords[0][1])*0.5
                  return (
                    <span key={word} style={{padding:'0.25rem 0.625rem',borderRadius:'9999px',background:'rgba(167,139,250,'+(opacity*0.15)+')',border:'1px solid rgba(167,139,250,'+(opacity*0.3)+')',color:'rgba(167,139,250,'+opacity+')',fontSize:size+'rem',cursor:'default'}}>{word}</span>
                  )
                })}
              </div>
            ) : (
              <p style={{color:'rgba(180,160,255,0.4)',fontSize:'0.85rem',fontStyle:'italic',margin:0}}>Add thoughts when logging numbers to see your themes</p>
            )}
          </div>

          {/* Emotional patterns */}
          <div style={card}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Number Energy Profile</div>
            {[{label:'Manifestation',nums:['111','1111'],color:'#a78bfa'},{label:'Stability',nums:['444','4444'],color:'#60a5fa'},{label:'Change',nums:['555','5555'],color:'#f97316'},{label:'Completion',nums:['999','9999'],color:'#f472b6'},{label:'Abundance',nums:['888','8888'],color:'#c9a84c'},{label:'Spiritual',nums:['777','7777'],color:'#818cf8'}].map(cat=>{
              const count = logs.filter(l=>cat.nums.includes(l.number)).length
              const pct = logs.length > 0 ? count/logs.length : 0
              return (
                <div key={cat.label} style={{display:'flex',alignItems:'center',gap:'0.625rem',marginBottom:'0.5rem'}}>
                  <div style={{width:'80px',color:'rgba(180,160,255,0.5)',fontSize:'0.72rem',flexShrink:0}}>{cat.label}</div>
                  <div style={{flex:1,height:'8px',background:'rgba(200,180,255,0.05)',borderRadius:'4px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:(pct*100)+'%',background:cat.color,borderRadius:'4px',transition:'width 0.8s ease'}} />
                  </div>
                  <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.7rem',minWidth:'30px',textAlign:'right'}}>{count}</div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {logs.length > 0 && tab==='growth' && (
        <>
          {/* Weekly trend */}
          <div style={card}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.875rem'}}>
              <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em'}}>8-Week Trend</div>
              <div style={{color:growthTrend==='growing'?'#4ade80':growthTrend==='declining'?'#f87171':'#c9a84c',fontSize:'0.75rem'}}>{growthTrend==='growing'?'↑ Growing':growthTrend==='declining'?'↓ Declining':'→ Steady'}</div>
            </div>
            <div style={{display:'flex',gap:'0.3rem',alignItems:'flex-end',height:'80px'}}>
              {weekCounts.map((count,i)=>(
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'0.25rem'}}>
                  <div style={{width:'100%',background:'rgba(74,222,128,'+(0.1+count/maxWeek*0.6)+')',borderRadius:'3px 3px 0 0',height:(count/maxWeek*60+4)+'px',border:'1px solid rgba(74,222,128,'+(0.1+count/maxWeek*0.4)+')'}} />
                  <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.55rem'}}>W{i+1}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div style={card}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Milestones</div>
            {[
              {label:'First sighting',value:logs.length>0?new Date(logs[logs.length-1]?.timestamp).toLocaleDateString():'—',emoji:'✦'},
              {label:'Total logged',value:logs.length,emoji:'◎'},
              {label:'Current streak',value:streak+' days',emoji:'🔥'},
              {label:'Unique numbers',value:Object.keys(numCounts).length,emoji:'🔮'},
              {label:'With thoughts',value:logs.filter(l=>l.thought?.trim()).length,emoji:'💭'},
              {label:'Verified (Truth Score)',value:logs.filter(l=>l.screenshotUrl).length,emoji:'✓'},
            ].map(m=>(
              <div key={m.label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.5rem 0',borderBottom:'1px solid rgba(200,180,255,0.04)'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <span style={{fontSize:'0.9rem'}}>{m.emoji}</span>
                  <span style={{color:'rgba(200,180,255,0.6)',fontSize:'0.82rem'}}>{m.label}</span>
                </div>
                <span style={{color:'rgba(220,200,255,0.8)',fontSize:'0.85rem',fontWeight:600}}>{m.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
