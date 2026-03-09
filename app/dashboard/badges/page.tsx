'use client'
import { useState, useEffect } from 'react'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_STREAK = 'synchrosoul_streak'

const ALL_BADGES = [
  // Logging milestones
  { id:'first_log', emoji:'✦', name:'First Sighting', desc:'Log your first angel number', category:'journey', req:(l:any[],s:number,p:any)=>l.length>=1 },
  { id:'logs_10', emoji:'◎', name:'Awakening', desc:'Log 10 angel numbers', category:'journey', req:(l:any[])=>l.length>=10 },
  { id:'logs_50', emoji:'🌟', name:'Seeker', desc:'Log 50 angel numbers', category:'journey', req:(l:any[])=>l.length>=50 },
  { id:'logs_100', emoji:'💫', name:'Devoted', desc:'Log 100 angel numbers', category:'journey', req:(l:any[])=>l.length>=100 },
  { id:'logs_333', emoji:'✶', name:'Sacred 333', desc:'Log 333 angel numbers', category:'journey', req:(l:any[])=>l.length>=333 },
  { id:'logs_1000', emoji:'🌌', name:'Cosmic Master', desc:'Log 1000 angel numbers', category:'journey', req:(l:any[])=>l.length>=1000 },
  // Streak badges
  { id:'streak_3', emoji:'🔥', name:'Spark', desc:'3-day logging streak', category:'streak', req:(_:any[],s:number)=>s>=3 },
  { id:'streak_7', emoji:'⚡', name:'Lightning', desc:'7-day logging streak', category:'streak', req:(_:any[],s:number)=>s>=7 },
  { id:'streak_21', emoji:'🌙', name:'Moon Cycle', desc:'21-day logging streak', category:'streak', req:(_:any[],s:number)=>s>=21 },
  { id:'streak_30', emoji:'☀️', name:'Solar Month', desc:'30-day logging streak', category:'streak', req:(_:any[],s:number)=>s>=30 },
  { id:'streak_111', emoji:'👑', name:'111 Days', desc:'111-day logging streak', category:'streak', req:(_:any[],s:number)=>s>=111 },
  // Number-specific badges
  { id:'seen_1111', emoji:'🌠', name:'Portal Keeper', desc:'Log 1111 five times', category:'numbers', req:(l:any[])=>l.filter((x:any)=>x.number==='1111').length>=5 },
  { id:'seen_777', emoji:'🍀', name:'Lucky Star', desc:'Log 777 three times', category:'numbers', req:(l:any[])=>l.filter((x:any)=>x.number==='777').length>=3 },
  { id:'seen_888', emoji:'💰', name:'Abundance Flow', desc:'Log 888 three times', category:'numbers', req:(l:any[])=>l.filter((x:any)=>x.number==='888').length>=3 },
  { id:'seen_999', emoji:'🦋', name:'Completion', desc:'Log 999 three times', category:'numbers', req:(l:any[])=>l.filter((x:any)=>x.number==='999').length>=3 },
  { id:'seen_444', emoji:'🛡️', name:'Protected', desc:'Log 444 five times', category:'numbers', req:(l:any[])=>l.filter((x:any)=>x.number==='444').length>=5 },
  { id:'seen_555', emoji:'🌊', name:'Change Rider', desc:'Log 555 five times', category:'numbers', req:(l:any[])=>l.filter((x:any)=>x.number==='555').length>=5 },
  { id:'unique_10', emoji:'🎨', name:'Number Collector', desc:'See 10 unique numbers', category:'numbers', req:(l:any[])=>new Set(l.map((x:any)=>x.number)).size>=10 },
  { id:'unique_20', emoji:'🔮', name:'Number Sage', desc:'See 20 unique numbers', category:'numbers', req:(l:any[])=>new Set(l.map((x:any)=>x.number)).size>=20 },
  // Truth Score badges
  { id:'first_proof', emoji:'📸', name:'Truth Seeker', desc:'Upload your first screenshot proof', category:'truth', req:(l:any[])=>l.some((x:any)=>x.screenshotUrl) },
  { id:'proof_10', emoji:'✅', name:'Angel Approved', desc:'Upload 10 screenshot proofs', category:'truth', req:(l:any[])=>l.filter((x:any)=>x.screenshotUrl).length>=10 },
  { id:'proof_50', emoji:'🏆', name:'Truth Champion', desc:'Upload 50 screenshot proofs', category:'truth', req:(l:any[])=>l.filter((x:any)=>x.screenshotUrl).length>=50 },
  // Journal badges
  { id:'first_thought', emoji:'💭', name:'Thought Anchor', desc:'Record your first thought', category:'journal', req:(l:any[])=>l.some((x:any)=>x.thought?.trim()) },
  { id:'thoughts_20', emoji:'📖', name:'Soul Journalist', desc:'Record 20 thoughts', category:'journal', req:(l:any[])=>l.filter((x:any)=>x.thought?.trim()).length>=20 },
  { id:'thoughts_100', emoji:'📚', name:'Cosmic Scribe', desc:'Record 100 thoughts', category:'journal', req:(l:any[])=>l.filter((x:any)=>x.thought?.trim()).length>=100 },
  // Numerology badges
  { id:'numerology_done', emoji:'🧮', name:'Blueprint Revealed', desc:'Complete your numerology profile', category:'numerology', req:(_:any[],__:number,p:any)=>!!p?.lifePathNumber },
  { id:'life_path_11', emoji:'⚡', name:'Master 11', desc:'Have Life Path 11', category:'numerology', req:(_:any[],__:number,p:any)=>p?.lifePathNumber===11 },
  { id:'life_path_22', emoji:'🏗️', name:'Master 22', desc:'Have Life Path 22', category:'numerology', req:(_:any[],__:number,p:any)=>p?.lifePathNumber===22 },
  { id:'life_path_33', emoji:'💝', name:'Master 33', desc:'Have Life Path 33', category:'numerology', req:(_:any[],__:number,p:any)=>p?.lifePathNumber===33 },
]

const CATEGORIES = ['all','journey','streak','numbers','truth','journal','numerology']
const CAT_COLORS: Record<string,string> = {
  journey:'#a78bfa', streak:'#f97316', numbers:'#c9a84c',
  truth:'#4ade80', journal:'#60a5fa', numerology:'#f472b6'
}

export default function BadgesPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [streak, setStreak] = useState(0)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    try {
      const l = localStorage.getItem(KEY_LOGS); if(l) setLogs(JSON.parse(l))
      const p = localStorage.getItem(KEY_PROFILE); if(p) setProfile(JSON.parse(p))
      // Calc streak
      const allLogs = l ? JSON.parse(l) : []
      const logDays = new Set(allLogs.map((x:any)=>new Date(x.timestamp).toDateString()))
      let s = 0, d = new Date()
      while(logDays.has(d.toDateString())) { s++; d.setDate(d.getDate()-1) }
      setStreak(s)
    } catch {}
  }, [])

  const earned = ALL_BADGES.filter(b => { try { return b.req(logs, streak, profile) } catch { return false } })
  const filtered = (category==='all' ? ALL_BADGES : ALL_BADGES.filter(b=>b.category===category))
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Sacred Badges</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 0.875rem'}}>Milestones on your spiritual journey</p>

      {/* Progress summary */}
      <div style={{...card,padding:'1rem',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:'1.25rem',background:'linear-gradient(135deg,rgba(167,139,250,0.08),rgba(201,168,76,0.05))',borderColor:'rgba(167,139,250,0.2)'}}>
        <div style={{textAlign:'center'}}>
          <div style={{color:'#a78bfa',fontSize:'2rem',fontWeight:700,lineHeight:1}}>{earned.length}</div>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Earned</div>
        </div>
        <div style={{width:'1px',height:'40px',background:'rgba(200,180,255,0.1)'}} />
        <div style={{textAlign:'center'}}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'2rem',fontWeight:700,lineHeight:1}}>{ALL_BADGES.length - earned.length}</div>
          <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Remaining</div>
        </div>
        <div style={{flex:1}}>
          <div style={{height:'6px',background:'rgba(200,180,255,0.06)',borderRadius:'3px',overflow:'hidden'}}>
            <div style={{height:'100%',width:(earned.length/ALL_BADGES.length*100)+'%',background:'linear-gradient(90deg,#a78bfa,#c9a84c)',borderRadius:'3px',transition:'width 1s ease'}} />
          </div>
          <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.7rem',marginTop:'0.3rem'}}>{Math.round(earned.length/ALL_BADGES.length*100)}% complete</div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>setCategory(c)} style={{padding:'0.3rem 0.625rem',borderRadius:'9999px',border:category===c?'1px solid '+(CAT_COLORS[c]||'rgba(167,139,250,0.5)'):'1px solid rgba(200,180,255,0.1)',background:category===c?((CAT_COLORS[c]||'#a78bfa')+'18'):'transparent',color:category===c?(CAT_COLORS[c]||'#a78bfa'):'rgba(180,160,255,0.4)',fontSize:'0.7rem',cursor:'pointer',textTransform:'capitalize'}}>{c}</button>
        ))}
      </div>

      {/* Badges grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.5rem'}}>
        {filtered.map(badge=>{
          const isEarned = earned.some(e=>e.id===badge.id)
          const color = CAT_COLORS[badge.category] || '#a78bfa'
          return (
            <div key={badge.id} style={{...card,padding:'1rem',opacity:isEarned?1:0.45,borderColor:isEarned?color+'30':'rgba(200,180,255,0.06)',background:isEarned?color+'06':'rgba(8,6,28,0.6)',transition:'all 0.3s'}}>
              <div style={{fontSize:'1.8rem',marginBottom:'0.4rem',filter:isEarned?'none':'grayscale(1)'}}>{badge.emoji}</div>
              <div style={{color:isEarned?color:'rgba(180,160,255,0.4)',fontSize:'0.82rem',fontWeight:600,marginBottom:'0.15rem'}}>{badge.name}</div>
              <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.7rem',lineHeight:1.4,marginBottom:'0.4rem'}}>{badge.desc}</div>
              {isEarned && <div style={{color:color,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>✓ Earned</div>}
              {!isEarned && <div style={{color:'rgba(180,160,255,0.2)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Locked</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
