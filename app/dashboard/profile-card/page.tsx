'use client'
import { useState, useEffect, useRef } from 'react'

const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_LOGS = 'synchrosoul_logs'
const KEY_AVATAR = 'synchrosoul_avatar_image'
const KEY_SOCIAL = 'synchrosoul_social_profile'

export default function ProfileCardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [social, setSocial] = useState<any>(null)
  const [avatar, setAvatar] = useState<string|null>(null)
  const [topNumbers, setTopNumbers] = useState<string[]>([])
  const [totalLogs, setTotalLogs] = useState(0)
  const [copied, setCopied] = useState(false)
  const [cardStyle, setCardStyle] = useState<'cosmic'|'minimal'|'sacred'>('cosmic')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const p = localStorage.getItem(KEY_PROFILE); if(p) setProfile(JSON.parse(p))
      const s = localStorage.getItem(KEY_SOCIAL); if(s) setSocial(JSON.parse(s))
      const a = localStorage.getItem(KEY_AVATAR); if(a) setAvatar(a)
      const l = localStorage.getItem(KEY_LOGS)
      if(l) {
        const logs = JSON.parse(l)
        setTotalLogs(logs.length)
        const freq: Record<string,number> = {}
        logs.forEach((log:any) => { freq[log.number] = (freq[log.number]||0)+1 })
        setTopNumbers(Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([n])=>n))
      }
    } catch {}
  }, [])

  const name = social?.displayName || profile?.name || 'Soul Seeker'
  const bio = social?.bio || 'Walking the path of angel numbers'
  const lifePathNumber = profile?.lifePathNumber
  const soulUrgeNumber = profile?.soulUrgeNumber
  const destinyNumber = profile?.destinyNumber

  const LIFE_PATH_ARCHETYPES: Record<number,string> = {
    1:'The Pioneer', 2:'The Peacemaker', 3:'The Creator', 4:'The Builder',
    5:'The Freedom Seeker', 6:'The Nurturer', 7:'The Mystic', 8:'The Achiever',
    9:'The Humanitarian', 11:'The Illuminator', 22:'The Master Builder', 33:'The Master Teacher'
  }

  const archetype = lifePathNumber ? (LIFE_PATH_ARCHETYPES[lifePathNumber] || 'The Seeker') : 'The Seeker'

  const STYLES = {
    cosmic: { bg:'linear-gradient(135deg,#0d0a2e 0%,#1a0a3e 50%,#0a1a3e 100%)', accent:'#a78bfa', border:'rgba(167,139,250,0.3)', glow:'rgba(167,139,250,0.15)' },
    minimal: { bg:'linear-gradient(135deg,#050510 0%,#0a0820 100%)', accent:'#c9a84c', border:'rgba(201,168,76,0.3)', glow:'rgba(201,168,76,0.1)' },
    sacred: { bg:'linear-gradient(135deg,#0a0520 0%,#1a0530 50%,#050520 100%)', accent:'#f472b6', border:'rgba(244,114,182,0.3)', glow:'rgba(244,114,182,0.12)' },
  }
  const style = STYLES[cardStyle]

  function copyLink() {
    navigator.clipboard.writeText(window.location.origin + '/dashboard/profile').then(()=>{
      setCopied(true); setTimeout(()=>setCopied(false),2000)
    })
  }

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'480px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Profile Card</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.5rem'}}>Your shareable cosmic identity</p>

      {/* Style selector */}
      <div style={{display:'flex',gap:'0.35rem',marginBottom:'1.25rem'}}>
        {(['cosmic','minimal','sacred'] as const).map(s=>(
          <button key={s} onClick={()=>setCardStyle(s)} style={{flex:1,padding:'0.4rem',borderRadius:'0.625rem',border:cardStyle===s?'1px solid '+STYLES[s].accent+'60':'1px solid rgba(200,180,255,0.1)',background:cardStyle===s?STYLES[s].accent+'12':'transparent',color:cardStyle===s?STYLES[s].accent:'rgba(180,160,255,0.4)',fontSize:'0.75rem',cursor:'pointer',textTransform:'capitalize'}}>{s}</button>
        ))}
      </div>

      {/* The Card */}
      <div ref={cardRef} style={{background:style.bg,border:'1px solid '+style.border,borderRadius:'1.5rem',padding:'2rem',marginBottom:'1.25rem',position:'relative',overflow:'hidden',boxShadow:'0 0 40px '+style.glow}}>
        {/* Background orbs */}
        <div style={{position:'absolute',top:'-30px',right:'-30px',width:'120px',height:'120px',borderRadius:'50%',background:style.accent+'08',filter:'blur(40px)'}} />
        <div style={{position:'absolute',bottom:'-20px',left:'-20px',width:'80px',height:'80px',borderRadius:'50%',background:style.accent+'06',filter:'blur(30px)'}} />

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.5rem'}}>
          <div style={{width:'60px',height:'60px',borderRadius:'50%',border:'2px solid '+style.border,overflow:'hidden',flexShrink:0,background:style.accent+'15',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem'}}>
            {avatar ? <img src={avatar} style={{width:'100%',height:'100%',objectFit:'cover'}} alt='avatar' /> : '✦'}
          </div>
          <div>
            <div style={{color:'rgba(220,200,255,0.95)',fontSize:'1.1rem',fontWeight:600,marginBottom:'0.15rem'}}>{name}</div>
            <div style={{color:style.accent,fontSize:'0.78rem',opacity:0.8}}>{archetype}</div>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.72rem',marginTop:'0.1rem'}}>{totalLogs} angel sightings logged</div>
          </div>
        </div>

        {/* Bio */}
        {bio && <p style={{color:'rgba(200,180,255,0.55)',fontSize:'0.85rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',margin:'0 0 1.25rem',lineHeight:1.6}}>“{bio}”</p>}

        {/* Numerology badges */}
        {lifePathNumber && (
          <div style={{display:'flex',gap:'0.5rem',marginBottom:'1.25rem'}}>
            {[[lifePathNumber,'Life Path',style.accent],[soulUrgeNumber,'Soul Urge','#c9a84c'],[destinyNumber,'Destiny','#60a5fa']].filter(([n])=>n).map(([num,label,col])=>(
              <div key={label as string} style={{flex:1,background:(col as string)+'10',border:'1px solid '+(col as string)+'20',borderRadius:'0.875rem',padding:'0.5rem',textAlign:'center'}}>
                <div style={{color:col as string,fontSize:'1.3rem',fontWeight:700,fontFamily:'Cormorant Garamond,serif'}}>{num}</div>
                <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Top numbers */}
        {topNumbers.length > 0 && (
          <div>
            <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.5rem'}}>Signature Numbers</div>
            <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap'}}>
              {topNumbers.map(n=>(
                <span key={n} style={{padding:'0.25rem 0.625rem',borderRadius:'0.5rem',background:style.accent+'10',border:'1px solid '+style.accent+'20',color:style.accent,fontSize:'0.85rem',fontWeight:700}}>{n}</span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{marginTop:'1.25rem',paddingTop:'1rem',borderTop:'1px solid rgba(200,180,255,0.06)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{color:'rgba(180,160,255,0.25)',fontSize:'0.65rem',letterSpacing:'0.1em'}}>SYNCHROSOUL</span>
          <span style={{color:style.accent,fontSize:'0.7rem',opacity:0.5}}>✦ ✦ ✦</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{display:'flex',gap:'0.5rem'}}>
        <button onClick={copyLink} style={{flex:1,padding:'0.625rem',borderRadius:'0.875rem',border:'none',background:copied?'rgba(74,222,128,0.15)':'linear-gradient(135deg,rgba(167,139,250,0.7),rgba(201,168,76,0.7))',color:copied?'#4ade80':'white',fontSize:'0.85rem',fontWeight:600,cursor:'pointer'}}>
          {copied ? '✓ Link Copied!' : '🔗 Copy Profile Link'}
        </button>
        <button onClick={()=>{ if(navigator.share) navigator.share({title:'My SynchroSoul Profile',url:window.location.origin+'/dashboard/profile'}) }} style={{padding:'0.625rem 1rem',borderRadius:'0.875rem',border:'1px solid rgba(200,180,255,0.12)',background:'transparent',color:'rgba(180,160,255,0.5)',fontSize:'0.85rem',cursor:'pointer'}}>Share</button>
      </div>

      <p style={{color:'rgba(180,160,255,0.25)',fontSize:'0.72rem',textAlign:'center',marginTop:'0.875rem'}}>Screenshot your card to share on social media</p>
    </div>
  )
}
