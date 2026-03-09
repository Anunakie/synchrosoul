'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_PROFILE = 'synchrosoul_numerology_profile'

const MOCK_TWINS = [
  { id:'t1', name:'Luna Starweaver', avatar:'🌙', lifePathNum:7, topNumbers:['1111','777','333'], sharedNumbers:['1111','777'], syncScore:94, lastSeen:'2 hours ago', bio:'Seeing 1111 every day for 3 months. Something big is coming.', verified:true, location:'Portland, OR' },
  { id:'t2', name:'River Moonchild', avatar:'🌊', lifePathNum:11, topNumbers:['333','1111','555'], sharedNumbers:['1111','333'], syncScore:88, lastSeen:'5 hours ago', bio:'Twin flame journey. 333 is my constant companion.', verified:true, location:'Sedona, AZ' },
  { id:'t3', name:'Sage Celestine', avatar:'✨', lifePathNum:7, topNumbers:['777','444','1111'], sharedNumbers:['777','1111'], syncScore:82, lastSeen:'1 day ago', bio:'Numerologist and spiritual guide. Life path 7 forever.', verified:false, location:'Asheville, NC' },
  { id:'t4', name:'Aurora Veil', avatar:'🌌', lifePathNum:9, topNumbers:['999','1111','222'], sharedNumbers:['1111'], syncScore:71, lastSeen:'2 days ago', bio:'999 keeps appearing as I close old chapters. New beginnings.', verified:true, location:'Santa Fe, NM' },
  { id:'t5', name:'Phoenix Solaris', avatar:'🔥', lifePathNum:3, topNumbers:['333','111','1212'], sharedNumbers:['333'], syncScore:67, lastSeen:'3 days ago', bio:'Creative soul. 333 is my creative activation code.', verified:false, location:'Los Angeles, CA' },
]

function ScoreRing({ score, color }: { score: number, color: string }) {
  const r = 28, circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width='70' height='70' style={{transform:'rotate(-90deg)'}}>
      <circle cx='35' cy='35' r={r} fill='none' stroke='rgba(200,180,255,0.08)' strokeWidth='5' />
      <circle cx='35' cy='35' r={r} fill='none' stroke={color} strokeWidth='5'
        strokeDasharray={`${dash} ${circ}`} strokeLinecap='round'
        style={{filter:`drop-shadow(0 0 4px ${color}60)`}} />
      <text x='35' y='35' textAnchor='middle' dominantBaseline='middle'
        style={{transform:'rotate(90deg)',transformOrigin:'35px 35px',fill:'rgba(220,200,255,0.9)',fontSize:'14px',fontWeight:700}}>
        {score}
      </text>
    </svg>
  )
}

export default function SoulTwinPage() {
  const [profile, setProfile] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [selected, setSelected] = useState<string|null>(null)
  const [filter, setFilter] = useState<'all'|'verified'|'high'>('all')
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',padding:'1.25rem',marginBottom:'0.875rem'}

  useEffect(() => {
    try {
      const p = localStorage.getItem(KEY_PROFILE); if(p) setProfile(JSON.parse(p))
      const l = localStorage.getItem(KEY_LOGS); if(l) setLogs(JSON.parse(l))
    } catch {}
  }, [])

  const myTopNumbers = (() => {
    const counts: Record<string,number> = {}
    logs.forEach((l:any) => { counts[l.number] = (counts[l.number]||0)+1 })
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([n])=>n)
  })()

  const filtered = MOCK_TWINS.filter(t =>
    filter==='all' ? true :
    filter==='verified' ? t.verified :
    t.syncScore >= 80
  )

  const sel = MOCK_TWINS.find(t=>t.id===selected)

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Soul Twin Radar</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Souls seeing the same numbers as you right now</p>

      {/* My numbers */}
      {myTopNumbers.length > 0 && (
        <div style={{...card,marginBottom:'1.25rem',background:'linear-gradient(135deg,rgba(244,114,182,0.08),rgba(167,139,250,0.06))',borderColor:'rgba(244,114,182,0.2)'}}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.5rem'}}>Your Signal</div>
          <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
            {myTopNumbers.map(n=>(<span key={n} style={{padding:'0.25rem 0.625rem',borderRadius:'9999px',background:'rgba(244,114,182,0.12)',border:'1px solid rgba(244,114,182,0.25)',color:'#f472b6',fontSize:'0.78rem',fontWeight:600}}>{n}</span>))}
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{display:'flex',gap:'0.4rem',marginBottom:'1rem'}}>
        {([['all','All Souls'],['high','High Sync (80+)'],['verified','Verified']] as const).map(([f,l])=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:'0.35rem 0.75rem',borderRadius:'9999px',border:filter===f?'1px solid rgba(244,114,182,0.4)':'1px solid rgba(200,180,255,0.1)',background:filter===f?'rgba(244,114,182,0.12)':'transparent',color:filter===f?'#f472b6':'rgba(180,160,255,0.4)',fontSize:'0.72rem',cursor:'pointer'}}>{l}</button>
        ))}
      </div>

      {/* Soul Twin cards */}
      {filtered.map(twin => (
        <div key={twin.id} style={{...card,cursor:'pointer',borderColor:selected===twin.id?'rgba(244,114,182,0.3)':'rgba(200,180,255,0.1)'}} onClick={()=>setSelected(selected===twin.id?null:twin.id)}>
          <div style={{display:'flex',alignItems:'center',gap:'0.875rem'}}>
            <div style={{width:'52px',height:'52px',borderRadius:'50%',background:'rgba(244,114,182,0.1)',border:'1px solid rgba(244,114,182,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',flexShrink:0}}>{twin.avatar}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:'0.4rem',marginBottom:'0.15rem'}}>
                <span style={{color:'rgba(220,200,255,0.9)',fontSize:'0.92rem',fontWeight:600}}>{twin.name}</span>
                {twin.verified && <span style={{color:'#4ade80',fontSize:'0.65rem'}}>✓</span>}
                <span style={{color:'rgba(180,160,255,0.25)',fontSize:'0.65rem',marginLeft:'auto'}}>{twin.lastSeen}</span>
              </div>
              <div style={{display:'flex',gap:'0.3rem',flexWrap:'wrap'}}>
                {twin.sharedNumbers.map(n=>(<span key={n} style={{padding:'0.1rem 0.4rem',borderRadius:'9999px',background:'rgba(244,114,182,0.1)',border:'1px solid rgba(244,114,182,0.2)',color:'#f472b6',fontSize:'0.65rem'}}>✦ {n}</span>))}
                <span style={{padding:'0.1rem 0.4rem',borderRadius:'9999px',background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.15)',color:'rgba(167,139,250,0.6)',fontSize:'0.65rem'}}>LP {twin.lifePathNum}</span>
              </div>
            </div>
            <ScoreRing score={twin.syncScore} color={twin.syncScore>=90?'#f472b6':twin.syncScore>=80?'#a78bfa':'#60a5fa'} />
          </div>

          {selected===twin.id && (
            <div style={{marginTop:'0.875rem',paddingTop:'0.875rem',borderTop:'1px solid rgba(200,180,255,0.06)'}}>
              <p style={{color:'rgba(200,180,255,0.65)',fontSize:'0.85rem',lineHeight:1.6,margin:'0 0 0.875rem',fontStyle:'italic'}}>“{twin.bio}”</p>
              <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.72rem',marginBottom:'0.875rem'}}>📍 {twin.location}</div>
              <div style={{display:'flex',gap:'0.5rem'}}>
                <button style={{flex:1,padding:'0.5rem',borderRadius:'0.75rem',background:'rgba(244,114,182,0.12)',border:'1px solid rgba(244,114,182,0.25)',color:'#f472b6',fontSize:'0.8rem',cursor:'pointer'}}>💫 Resonate</button>
                <Link href='/dashboard/upgrade' style={{flex:1,padding:'0.5rem',borderRadius:'0.75rem',background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)',color:'#a78bfa',fontSize:'0.8rem',cursor:'pointer',textDecoration:'none',display:'flex',alignItems:'center',justifyContent:'center'}}>✉️ Message ✨</Link>
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{textAlign:'center',padding:'1rem',color:'rgba(180,160,255,0.3)',fontSize:'0.75rem'}}>
        Showing demo matches · Connect Supabase to see real-time soul twins
      </div>
    </div>
  )
}
