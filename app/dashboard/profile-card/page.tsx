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
  const [logs, setLogs] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [style, setStyle] = useState<'cosmic'|'minimal'|'sacred'>('cosmic')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const p = localStorage.getItem(KEY_PROFILE); if(p) setProfile(JSON.parse(p))
      const s = localStorage.getItem(KEY_SOCIAL); if(s) setSocial(JSON.parse(s))
      const a = localStorage.getItem(KEY_AVATAR); if(a) setAvatar(a)
      const l = localStorage.getItem(KEY_LOGS); if(l) setLogs(JSON.parse(l))
    } catch {}
  }, [])

  const topNumbers = (() => {
    const counts: Record<string,number> = {}
    logs.forEach((l:any) => { counts[l.number] = (counts[l.number]||0)+1 })
    return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([n])=>n)
  })()

  const displayName = social?.displayName || profile?.name || 'Soul Seeker'
  const lifePathNum = profile?.lifePathNumber
  const soulUrgeNum = profile?.soulUrgeNumber
  const destinyNum = profile?.destinyNumber
  const totalLogs = logs.length
  const approvedLogs = logs.filter((l:any)=>l.screenshotUrl).length

  const STYLES = {
    cosmic: { bg: 'linear-gradient(135deg, #0a0520 0%, #1a0a3a 50%, #0a1520 100%)', border: 'rgba(167,139,250,0.4)', accent: '#a78bfa', secondary: '#c9a84c' },
    minimal: { bg: 'linear-gradient(135deg, #050510 0%, #0a0a20 100%)', border: 'rgba(200,180,255,0.2)', accent: '#e0e7ff', secondary: 'rgba(200,180,255,0.5)' },
    sacred: { bg: 'linear-gradient(135deg, #0a0510 0%, #200a10 50%, #0a0520 100%)', border: 'rgba(244,114,182,0.4)', accent: '#f472b6', secondary: '#c9a84c' },
  }
  const s = STYLES[style]

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000) })
  }

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',padding:'1.25rem',marginBottom:'0.875rem'}

  return (
    <div style={{maxWidth:'480px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Cosmic Profile Card</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Your shareable spiritual identity</p>

      {/* Style selector */}
      <div style={{display:'flex',gap:'0.4rem',marginBottom:'1.25rem'}}>
        {(['cosmic','minimal','sacred'] as const).map(st=>(
          <button key={st} onClick={()=>setStyle(st)} style={{padding:'0.35rem 0.875rem',borderRadius:'9999px',border:style===st?'1px solid '+STYLES[st].border:'1px solid rgba(200,180,255,0.1)',background:style===st?STYLES[st].accent+'15':'transparent',color:style===st?STYLES[st].accent:'rgba(180,160,255,0.4)',fontSize:'0.75rem',cursor:'pointer',textTransform:'capitalize'}}>{st}</button>
        ))}
      </div>

      {/* The Card */}
      <div ref={cardRef} style={{background:s.bg,border:'1px solid '+s.border,borderRadius:'1.5rem',padding:'1.75rem',marginBottom:'1.25rem',position:'relative',overflow:'hidden',boxShadow:'0 0 40px '+s.accent+'15'}}>
        {/* Decorative orbs */}
        <div style={{position:'absolute',top:'-30px',right:'-30px',width:'120px',height:'120px',borderRadius:'50%',background:s.accent+'08',filter:'blur(30px)'}} />
        <div style={{position:'absolute',bottom:'-20px',left:'-20px',width:'80px',height:'80px',borderRadius:'50%',background:s.secondary+'08',filter:'blur(20px)'}} />

        {/* Header */}
        <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'1.25rem',position:'relative'}}>
          <div style={{width:'60px',height:'60px',borderRadius:'50%',border:'2px solid '+s.accent+'50',overflow:'hidden',flexShrink:0,background:avatar?'none':s.accent+'15',display:'flex',alignItems:'center',justifyContent:'center'}}>
            {avatar ? <img src={avatar} alt='avatar' style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <span style={{fontSize:'1.5rem',color:s.accent}}>✦</span>}
          </div>
          <div style={{flex:1}}>
            <div style={{color:'rgba(220,200,255,0.95)',fontSize:'1.1rem',fontWeight:700,marginBottom:'0.1rem'}}>{displayName}</div>
            <div style={{color:s.accent,fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase'}}>SynchroSoul</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{color:s.secondary,fontSize:'1.4rem',fontWeight:800}}>{totalLogs}</div>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem'}}>sightings</div>
          </div>
        </div>

        {/* Numerology badges */}
        {(lifePathNum || soulUrgeNum || destinyNum) && (
          <div style={{display:'flex',gap:'0.5rem',marginBottom:'1.25rem',flexWrap:'wrap'}}>
            {lifePathNum && <div style={{flex:1,minWidth:'70px',background:s.accent+'10',border:'1px solid '+s.accent+'25',borderRadius:'0.75rem',padding:'0.5rem',textAlign:'center'}}>
              <div style={{color:s.accent,fontSize:'1.2rem',fontWeight:800}}>{lifePathNum}</div>
              <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.58rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Life Path</div>
            </div>}
            {soulUrgeNum && <div style={{flex:1,minWidth:'70px',background:s.secondary+'10',border:'1px solid '+s.secondary+'25',borderRadius:'0.75rem',padding:'0.5rem',textAlign:'center'}}>
              <div style={{color:s.secondary,fontSize:'1.2rem',fontWeight:800}}>{soulUrgeNum}</div>
              <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.58rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Soul Urge</div>
            </div>}
            {destinyNum && <div style={{flex:1,minWidth:'70px',background:'rgba(244,114,182,0.08)',border:'1px solid rgba(244,114,182,0.2)',borderRadius:'0.75rem',padding:'0.5rem',textAlign:'center'}}>
              <div style={{color:'#f472b6',fontSize:'1.2rem',fontWeight:800}}>{destinyNum}</div>
              <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.58rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Destiny</div>
            </div>}
          </div>
        )}

        {/* Top angel numbers */}
        {topNumbers.length > 0 && (
          <div style={{marginBottom:'1rem'}}>
            <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.4rem'}}>Most Seen Numbers</div>
            <div style={{display:'flex',gap:'0.4rem'}}>
              {topNumbers.map((n,i)=>(
                <div key={n} style={{padding:'0.3rem 0.625rem',borderRadius:'9999px',background:s.accent+(i===0?'20':'10'),border:'1px solid '+s.accent+(i===0?'40':'20'),color:i===0?s.accent:'rgba(200,180,255,0.5)',fontSize:'0.78rem',fontWeight:i===0?700:400}}>{n}</div>
              ))}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{display:'flex',gap:'0.5rem',paddingTop:'0.875rem',borderTop:'1px solid rgba(200,180,255,0.06)'}}>
          <div style={{flex:1,textAlign:'center'}}>
            <div style={{color:'rgba(220,200,255,0.7)',fontSize:'0.95rem',fontWeight:700}}>{totalLogs}</div>
            <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.58rem'}}>Logged</div>
          </div>
          <div style={{flex:1,textAlign:'center'}}>
            <div style={{color:'rgba(220,200,255,0.7)',fontSize:'0.95rem',fontWeight:700}}>{approvedLogs}</div>
            <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.58rem'}}>Verified</div>
          </div>
          <div style={{flex:1,textAlign:'center'}}>
            <div style={{color:'rgba(220,200,255,0.7)',fontSize:'0.95rem',fontWeight:700}}>{topNumbers.length}</div>
            <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.58rem'}}>Numbers</div>
          </div>
        </div>

        {/* Watermark */}
        <div style={{textAlign:'center',marginTop:'0.875rem',color:'rgba(180,160,255,0.2)',fontSize:'0.6rem',letterSpacing:'0.15em',textTransform:'uppercase'}}>synchrosoul.app</div>
      </div>

      {/* Actions */}
      <div style={{display:'flex',gap:'0.625rem'}}>
        <button onClick={copyLink} style={{flex:1,padding:'0.75rem',borderRadius:'0.875rem',background:copied?'rgba(74,222,128,0.1)':'rgba(167,139,250,0.1)',border:copied?'1px solid rgba(74,222,128,0.3)':'1px solid rgba(167,139,250,0.25)',color:copied?'#4ade80':'#a78bfa',fontSize:'0.85rem',cursor:'pointer',fontFamily:'inherit'}}>
          {copied ? '✓ Link Copied!' : '🔗 Copy Link'}
        </button>
        <button onClick={()=>window.print()} style={{flex:1,padding:'0.75rem',borderRadius:'0.875rem',background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.25)',color:'#c9a84c',fontSize:'0.85rem',cursor:'pointer',fontFamily:'inherit'}}>📥 Save Card</button>
      </div>

      {!profile && (
        <div style={{...card,marginTop:'1.25rem',textAlign:'center'}}>
          <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.85rem',margin:'0 0 0.5rem'}}>Complete your numerology profile to unlock your full cosmic card</p>
          <a href='/auth/signup' style={{color:'#a78bfa',fontSize:'0.82rem'}}>Set up profile →</a>
        </div>
      )}
    </div>
  )
}
