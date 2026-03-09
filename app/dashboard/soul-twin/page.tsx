'use client'
import { useState, useEffect } from 'react'

const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_LOGS = 'synchrosoul_logs'

const SOUL_TWINS = [
  { id:'st1', name:'Luna M.', age:28, location:'Sedona, AZ', avatar:'🌙', color:'#a78bfa', lifePathNumber:7, soulUrgeNumber:11, destinyNumber:3, recentNumbers:['1111','777','333'], syncScore:96, sharedNumbers:['1111','777'], bio:'Spiritual seeker, sound healer, and lover of sacred geometry. I see 1111 every single morning.', compatibility:'Twin Flame', lastActive:'2 min ago', verified:true },
  { id:'st2', name:'Orion S.', age:31, location:'Asheville, NC', avatar:'⭐', color:'#c9a84c', lifePathNumber:11, soulUrgeNumber:7, destinyNumber:9, recentNumbers:['1111','444','999'], syncScore:91, sharedNumbers:['1111','444'], bio:'Astrologer and meditation teacher. The numbers led me here — 444 has been my guardian all year.', compatibility:'Soul Mate', lastActive:'15 min ago', verified:true },
  { id:'st3', name:'Sage R.', age:25, location:'Portland, OR', avatar:'🌿', color:'#4ade80', lifePathNumber:3, soulUrgeNumber:6, destinyNumber:11, recentNumbers:['333','222','1212'], syncScore:87, sharedNumbers:['333'], bio:'Artist and empath. I paint what the numbers show me. 333 is my creative muse.', compatibility:'Karmic', lastActive:'1 hr ago', verified:false },
  { id:'st4', name:'Zara K.', age:33, location:'Santa Fe, NM', avatar:'✨', color:'#f472b6', lifePathNumber:9, soulUrgeNumber:3, destinyNumber:7, recentNumbers:['999','555','1111'], syncScore:84, sharedNumbers:['999','1111'], bio:'Healer and lightworker. In a season of massive transformation — 999 and 555 everywhere I look.', compatibility:'Soul Mate', lastActive:'3 hr ago', verified:true },
  { id:'st5', name:'River T.', age:29, location:'Taos, NM', avatar:'🌊', color:'#60a5fa', lifePathNumber:5, soulUrgeNumber:9, destinyNumber:5, recentNumbers:['555','1234','777'], syncScore:79, sharedNumbers:['777'], bio:'Nomad and spiritual traveler. 555 has been guiding every major life change for 3 years.', compatibility:'Companion', lastActive:'Yesterday', verified:false },
  { id:'st6', name:'Iris V.', age:27, location:'Ojai, CA', avatar:'🌸', color:'#f97316', lifePathNumber:6, soulUrgeNumber:2, destinyNumber:8, recentNumbers:['222','888','444'], syncScore:74, sharedNumbers:['444'], bio:'Yoga teacher and crystal healer. 222 reminds me daily to trust divine timing.', compatibility:'Companion', lastActive:'2 days ago', verified:true },
]

const COMPAT_COLORS: Record<string,string> = {
  'Twin Flame':'#f472b6',
  'Soul Mate':'#a78bfa',
  'Karmic':'#c9a84c',
  'Companion':'#60a5fa',
}

const COMPAT_DESC: Record<string,string> = {
  "Twin Flame":"Rare mirror soul — you reflect each other’s deepest truths",
  'Soul Mate':'Deep soul recognition — you have walked together before',
  'Karmic':'Growth partnership — here to teach each other profound lessons',
  'Companion':'Aligned travelers — walking parallel spiritual paths',
}

export default function SoulTwinPage() {
  const [profile, setProfile] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [selected, setSelected] = useState<typeof SOUL_TWINS[0]|null>(null)
  const [filter, setFilter] = useState<'all'|'Twin Flame'|'Soul Mate'|'Karmic'|'Companion'>('all')
  const [connected, setConnected] = useState<string[]>([])

  useEffect(() => {
    try {
      const p = localStorage.getItem(KEY_PROFILE); if(p) setProfile(JSON.parse(p))
      const l = localStorage.getItem(KEY_LOGS); if(l) setLogs(JSON.parse(l))
      const c = localStorage.getItem('synchrosoul_connected'); if(c) setConnected(JSON.parse(c))
    } catch {}
  }, [])

  function connect(id: string) {
    const updated = connected.includes(id) ? connected.filter(c=>c!==id) : [...connected, id]
    setConnected(updated)
    localStorage.setItem('synchrosoul_connected', JSON.stringify(updated))
  }

  const myNumbers = [...new Set(logs.map((l:any)=>l.number))].slice(0,5)
  const filtered = filter==='all' ? SOUL_TWINS : SOUL_TWINS.filter(s=>s.compatibility===filter)
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Soul Twin Radar</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Souls seeing the same numbers as you</p>

      {/* Your number signature */}
      {myNumbers.length > 0 && (
        <div style={{...card,padding:'1rem',marginBottom:'1.25rem',background:'linear-gradient(135deg,rgba(167,139,250,0.06),rgba(8,6,28,0.95))',borderColor:'rgba(167,139,250,0.15)'}}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.5rem'}}>Your Number Signature</div>
          <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
            {myNumbers.map((n:string)=>(
              <span key={n} style={{padding:'0.25rem 0.625rem',borderRadius:'0.5rem',background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',color:'#c9a84c',fontSize:'0.82rem',fontWeight:700}}>{n}</span>
            ))}
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div style={{display:'flex',gap:'0.3rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
        {(['all','Twin Flame','Soul Mate','Karmic','Companion'] as const).map(f=>{
          const col = f==='all'?'#a78bfa':COMPAT_COLORS[f]
          return (
            <button key={f} onClick={()=>setFilter(f)} style={{padding:'0.3rem 0.625rem',borderRadius:'9999px',border:filter===f?'1px solid '+col+'60':'1px solid rgba(200,180,255,0.1)',background:filter===f?col+'15':'transparent',color:filter===f?col:'rgba(180,160,255,0.4)',fontSize:'0.7rem',cursor:'pointer'}}>{f}</button>
          )
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{...card,padding:'1.5rem',marginBottom:'1.25rem',background:'linear-gradient(135deg,'+selected.color+'06,rgba(8,6,28,0.97))',borderColor:selected.color+'25'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.875rem'}}>
              <div style={{width:'52px',height:'52px',borderRadius:'50%',background:selected.color+'15',border:'2px solid '+selected.color+'30',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.6rem',position:'relative'}}>
                {selected.avatar}
                {selected.verified && <div style={{position:'absolute',bottom:'-2px',right:'-2px',width:'16px',height:'16px',borderRadius:'50%',background:'#4ade80',border:'2px solid rgba(8,6,28,1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.5rem',color:'white'}}>✓</div>}
              </div>
              <div>
                <div style={{color:'rgba(220,200,255,0.9)',fontSize:'1rem',fontWeight:600}}>{selected.name}</div>
                <div style={{color:'rgba(180,160,255,0.45)',fontSize:'0.75rem'}}>{selected.age} · {selected.location}</div>
                <div style={{color:COMPAT_COLORS[selected.compatibility],fontSize:'0.72rem',marginTop:'0.15rem'}}>✦ {selected.compatibility}</div>
              </div>
            </div>
            <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'rgba(180,160,255,0.4)',cursor:'pointer',fontSize:'1.2rem'}}>×</button>
          </div>

          {/* Sync score ring */}
          <div style={{display:'flex',alignItems:'center',gap:'1.25rem',marginBottom:'1rem',padding:'0.875rem',background:'rgba(200,180,255,0.03)',borderRadius:'0.875rem',border:'1px solid rgba(200,180,255,0.06)'}}>
            <div style={{position:'relative',width:'60px',height:'60px',flexShrink:0}}>
              <svg width='60' height='60' style={{transform:'rotate(-90deg)'}}>
                <circle cx='30' cy='30' r='24' fill='none' stroke='rgba(200,180,255,0.08)' strokeWidth='5'/>
                <circle cx='30' cy='30' r='24' fill='none' stroke={selected.color} strokeWidth='5'
                  strokeDasharray={`${2*Math.PI*24*selected.syncScore/100} ${2*Math.PI*24}`}
                  strokeLinecap='round'/>
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:selected.color,fontSize:'0.85rem',fontWeight:700}}>{selected.syncScore}%</div>
            </div>
            <div>
              <div style={{color:'rgba(220,200,255,0.7)',fontSize:'0.82rem',marginBottom:'0.2rem'}}>Sync Score</div>
              <div style={{color:'rgba(180,160,255,0.45)',fontSize:'0.72rem',lineHeight:1.5}}>{COMPAT_DESC[selected.compatibility]}</div>
            </div>
          </div>

          {/* Shared numbers */}
          <div style={{marginBottom:'0.875rem'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.4rem'}}>Shared Numbers</div>
            <div style={{display:'flex',gap:'0.35rem'}}>
              {selected.sharedNumbers.map(n=>(
                <span key={n} style={{padding:'0.25rem 0.625rem',borderRadius:'0.5rem',background:'rgba(201,168,76,0.12)',border:'1px solid rgba(201,168,76,0.25)',color:'#c9a84c',fontSize:'0.82rem',fontWeight:700}}>{n}</span>
              ))}
            </div>
          </div>

          {/* Numerology */}
          <div style={{display:'flex',gap:'0.5rem',marginBottom:'0.875rem'}}>
            {[['Life Path',selected.lifePathNumber,'#a78bfa'],['Soul Urge',selected.soulUrgeNumber,'#c9a84c'],['Destiny',selected.destinyNumber,'#60a5fa']].map(([label,num,col])=>(
              <div key={label as string} style={{flex:1,background:(col as string)+'08',border:'1px solid '+(col as string)+'15',borderRadius:'0.75rem',padding:'0.5rem',textAlign:'center'}}>
                <div style={{color:col as string,fontSize:'1.1rem',fontWeight:700}}>{num}</div>
                <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem'}}>{label}</div>
              </div>
            ))}
          </div>

          {/* Bio */}
          <p style={{color:'rgba(200,180,255,0.6)',fontSize:'0.85rem',lineHeight:1.65,margin:'0 0 1rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>“{selected.bio}”</p>

          {/* Actions */}
          <div style={{display:'flex',gap:'0.5rem'}}>
            <button
              onClick={()=>connect(selected.id)}
              style={{flex:1,padding:'0.625rem',borderRadius:'0.75rem',border:'none',background:connected.includes(selected.id)?'rgba(74,222,128,0.15)':'linear-gradient(135deg,'+selected.color+','+selected.color+'aa)',color:connected.includes(selected.id)?'#4ade80':'white',fontSize:'0.82rem',fontWeight:600,cursor:'pointer'}}>
              {connected.includes(selected.id)?'✓ Connected':'Connect Souls'}
            </button>
            <button style={{padding:'0.625rem 1rem',borderRadius:'0.75rem',border:'1px solid rgba(200,180,255,0.12)',background:'transparent',color:'rgba(180,160,255,0.5)',fontSize:'0.82rem',cursor:'pointer'}}>Message</button>
          </div>
        </div>
      )}

      {/* Soul Twin cards */}
      <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
        {filtered.map(twin=>(
          <div key={twin.id} onClick={()=>setSelected(twin)}
            style={{...card,padding:'1rem',cursor:'pointer',borderColor:selected?.id===twin.id?twin.color+'30':'rgba(200,180,255,0.08)',transition:'all 0.2s'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.875rem'}}>
              <div style={{position:'relative',flexShrink:0}}>
                <div style={{width:'44px',height:'44px',borderRadius:'50%',background:twin.color+'15',border:'1px solid '+twin.color+'25',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem'}}>{twin.avatar}</div>
                {twin.verified && <div style={{position:'absolute',bottom:'-1px',right:'-1px',width:'14px',height:'14px',borderRadius:'50%',background:'#4ade80',border:'2px solid rgba(8,6,28,1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.45rem',color:'white'}}>✓</div>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.15rem'}}>
                  <div style={{color:'rgba(220,200,255,0.85)',fontSize:'0.88rem',fontWeight:600}}>{twin.name}</div>
                  <div style={{display:'flex',alignItems:'center',gap:'0.35rem'}}>
                    <span style={{color:COMPAT_COLORS[twin.compatibility],fontSize:'0.68rem'}}>{twin.compatibility}</span>
                    <span style={{color:twin.color,fontSize:'0.82rem',fontWeight:700}}>{twin.syncScore}%</span>
                  </div>
                </div>
                <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.72rem',marginBottom:'0.3rem'}}>{twin.location} · {twin.lastActive}</div>
                <div style={{display:'flex',gap:'0.3rem'}}>
                  {twin.sharedNumbers.map(n=>(
                    <span key={n} style={{padding:'0.15rem 0.4rem',borderRadius:'0.3rem',background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',color:'#c9a84c',fontSize:'0.65rem',fontWeight:700}}>{n}</span>
                  ))}
                  {connected.includes(twin.id) && <span style={{padding:'0.15rem 0.4rem',borderRadius:'0.3rem',background:'rgba(74,222,128,0.1)',border:'1px solid rgba(74,222,128,0.2)',color:'#4ade80',fontSize:'0.65rem'}}>connected</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
