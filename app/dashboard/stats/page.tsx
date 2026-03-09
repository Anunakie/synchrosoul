'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_PROFILE = 'synchrosoul_numerology_profile'

function BarChart({ data, color }: { data: {label:string,value:number,color?:string}[], color: string }) {
  const max = Math.max(...data.map(d=>d.value), 1)
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
      {data.map((d,i) => (
        <div key={i} style={{display:'flex',alignItems:'center',gap:'0.625rem'}}>
          <div style={{width:'40px',color:'rgba(180,160,255,0.5)',fontSize:'0.72rem',textAlign:'right',flexShrink:0}}>{d.label}</div>
          <div style={{flex:1,height:'22px',background:'rgba(200,180,255,0.05)',borderRadius:'4px',overflow:'hidden'}}>
            <div style={{height:'100%',width:(d.value/max*100)+'%',background:d.color||color,borderRadius:'4px',transition:'width 0.8s ease',display:'flex',alignItems:'center',paddingLeft:'6px',minWidth:d.value>0?'22px':'0'}}>
              {d.value>0 && <span style={{color:'rgba(255,255,255,0.8)',fontSize:'0.65rem',fontWeight:700}}>{d.value}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ value, max, color, label }: { value:number, max:number, color:string, label:string }) {
  const r = 36, circ = 2*Math.PI*r
  const pct = Math.min(value/Math.max(max,1), 1)
  const dash = pct * circ
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'0.4rem'}}>
      <svg width='88' height='88'>
        <circle cx='44' cy='44' r={r} fill='none' stroke='rgba(200,180,255,0.07)' strokeWidth='7'/>
        <circle cx='44' cy='44' r={r} fill='none' stroke={color} strokeWidth='7'
          strokeDasharray={dash+' '+circ} strokeLinecap='round'
          transform='rotate(-90 44 44)'
          style={{filter:'drop-shadow(0 0 4px '+color+'60)',transition:'stroke-dasharray 1s ease'}}/>
        <text x='44' y='40' textAnchor='middle' fill='rgba(220,200,255,0.9)' fontSize='14' fontWeight='700'>{value}</text>
        <text x='44' y='56' textAnchor='middle' fill='rgba(180,160,255,0.4)' fontSize='9'>{label}</text>
      </svg>
    </div>
  )
}

export default function StatsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [period, setPeriod] = useState<'7d'|'30d'|'all'>('30d')

  useEffect(() => {
    try {
      const l = localStorage.getItem(KEY_LOGS); if(l) setLogs(JSON.parse(l))
      const p = localStorage.getItem(KEY_PROFILE); if(p) setProfile(JSON.parse(p))
    } catch {}
  }, [])

  const now = Date.now()
  const cutoff = period==='7d' ? now-7*86400000 : period==='30d' ? now-30*86400000 : 0
  const filtered = logs.filter(l => new Date(l.timestamp).getTime() >= cutoff)

  // Number frequency
  const numCounts: Record<string,number> = {}
  filtered.forEach(l => { numCounts[l.number]=(numCounts[l.number]||0)+1 })
  const topNumbers = Object.entries(numCounts).sort((a,b)=>b[1]-a[1]).slice(0,8)
    .map(([label,value])=>({label,value}))

  // Daily activity (last 14 days)
  const dailyCounts: Record<string,number> = {}
  const days = period==='7d'?7:14
  for(let i=days-1;i>=0;i--) {
    const d = new Date(now-i*86400000)
    const key = (d.getMonth()+1)+'/'+(d.getDate())
    dailyCounts[key] = 0
  }
  filtered.forEach(l => {
    const d = new Date(l.timestamp)
    const key = (d.getMonth()+1)+'/'+(d.getDate())
    if(key in dailyCounts) dailyCounts[key]++
  })
  const dailyData = Object.entries(dailyCounts).map(([label,value])=>({label,value}))

  // Hour of day distribution
  const hourCounts: Record<number,number> = {}
  for(let h=0;h<24;h++) hourCounts[h]=0
  filtered.forEach(l => { const h=new Date(l.timestamp).getHours(); hourCounts[h]++ })
  const peakHour = Object.entries(hourCounts).sort((a,b)=>b[1]-a[1])[0]
  const peakHourLabel = peakHour ? (parseInt(peakHour[0])%12||12)+(parseInt(peakHour[0])<12?'am':'pm') : '—'

  // Verified count
  const verified = filtered.filter(l=>l.screenshotUrl).length
  const withThoughts = filtered.filter(l=>l.thought?.trim()).length

  // Streak calc
  let streak = 0
  const today = new Date().toDateString()
  const logDays = new Set(logs.map(l=>new Date(l.timestamp).toDateString()))
  let checkDate = new Date()
  while(logDays.has(checkDate.toDateString())) {
    streak++
    checkDate.setDate(checkDate.getDate()-1)
  }

  // Category breakdown (by number prefix)
  const categories = [
    {label:'111x',color:'#a78bfa',nums:['111','1111','11']},
    {label:'222x',color:'#67e8f9',nums:['222','2222','22']},
    {label:'333x',color:'#34d399',nums:['333','3333','33']},
    {label:'444x',color:'#60a5fa',nums:['444','4444','44']},
    {label:'555x',color:'#f97316',nums:['555','5555','55']},
    {label:'777x',color:'#818cf8',nums:['777','7777','77']},
    {label:'888x',color:'#c9a84c',nums:['888','8888','88']},
    {label:'999x',color:'#f472b6',nums:['999','9999','99']},
  ]
  const catData = categories.map(c=>({
    label:c.label,
    value:filtered.filter(l=>c.nums.some(n=>l.number.startsWith(n[0])&&l.number===n||l.number.includes(n[0].repeat(3)))).length,
    color:c.color
  })).filter(c=>c.value>0)

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',padding:'1.25rem',marginBottom:'0.875rem'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Your Statistics</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Patterns in your spiritual journey</p>

      {/* Period filter */}
      <div style={{display:'flex',gap:'0.4rem',marginBottom:'1.25rem'}}>
        {([['7d','7 Days'],['30d','30 Days'],['all','All Time']] as const).map(([p,l])=>(
          <button key={p} onClick={()=>setPeriod(p)} style={{padding:'0.35rem 0.875rem',borderRadius:'9999px',border:period===p?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.1)',background:period===p?'rgba(167,139,250,0.15)':'transparent',color:period===p?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.75rem',cursor:'pointer'}}>{l}</button>
        ))}
      </div>

      {/* Summary donuts */}
      <div style={{...card,display:'flex',justifyContent:'space-around',flexWrap:'wrap',gap:'0.5rem'}}>
        <DonutChart value={filtered.length} max={Math.max(filtered.length,50)} color='#a78bfa' label='Logged' />
        <DonutChart value={streak} max={30} color='#f97316' label='Streak' />
        <DonutChart value={verified} max={Math.max(filtered.length,1)} color='#4ade80' label='Verified' />
        <DonutChart value={withThoughts} max={Math.max(filtered.length,1)} color='#c9a84c' label='Journaled' />
      </div>

      {/* Top numbers */}
      {topNumbers.length > 0 && (
        <div style={card}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Most Seen Numbers</div>
          <BarChart data={topNumbers} color='#a78bfa' />
        </div>
      )}

      {/* Daily activity */}
      {dailyData.some(d=>d.value>0) && (
        <div style={card}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Daily Activity</div>
          <BarChart data={dailyData} color='#60a5fa' />
        </div>
      )}

      {/* Insights row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.5rem',marginBottom:'0.875rem'}}>
        {[
          {label:'Peak Sighting Time',value:peakHourLabel,emoji:'⏰',color:'#c9a84c'},
          {label:'Unique Numbers',value:Object.keys(numCounts).length,emoji:'◎',color:'#a78bfa'},
          {label:'Truth Score',value:filtered.length>0?Math.round(verified/filtered.length*100)+'%':'—',emoji:'✓',color:'#4ade80'},
          {label:'Thought Capture',value:filtered.length>0?Math.round(withThoughts/filtered.length*100)+'%':'—',emoji:'💭',color:'#f472b6'},
        ].map(s=>(
          <div key={s.label} style={{...card,marginBottom:0,textAlign:'center'}}>
            <div style={{fontSize:'1.2rem',marginBottom:'0.25rem'}}>{s.emoji}</div>
            <div style={{color:s.color,fontSize:'1.1rem',fontWeight:700,marginBottom:'0.15rem'}}>{s.value}</div>
            <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.65rem'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {catData.length > 0 && (
        <div style={card}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Number Family Breakdown</div>
          <BarChart data={catData} color='#a78bfa' />
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{...card,textAlign:'center',padding:'3rem'}}>
          <div style={{fontSize:'2rem',marginBottom:'0.625rem'}}>📊</div>
          <p style={{color:'rgba(180,160,255,0.4)',fontSize:'0.9rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',margin:'0 0 0.5rem'}}>No data for this period yet</p>
          <Link href='/dashboard' style={{color:'#a78bfa',fontSize:'0.82rem'}}>Start logging numbers →</Link>
        </div>
      )}
    </div>
  )
}
