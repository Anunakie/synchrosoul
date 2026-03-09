'use client'
import { useState } from 'react'
import { calcLifePath, calcSoulUrge, calcDestiny } from '@/lib/numerology'

function reduce(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  return reduce(String(n).split('').reduce((s,c)=>s+parseInt(c),0))
}

function compatScore(a: number, b: number): number {
  const pairs: Record<string,number> = {
    '1-1':75,'1-2':60,'1-3':85,'1-4':55,'1-5':80,'1-6':65,'1-7':70,'1-8':75,'1-9':70,
    '2-2':80,'2-3':70,'2-4':75,'2-5':55,'2-6':90,'2-7':65,'2-8':60,'2-9':75,
    '3-3':85,'3-4':60,'3-5':90,'3-6':75,'3-7':70,'3-8':65,'3-9':80,
    '4-4':70,'4-5':55,'4-6':80,'4-7':75,'4-8':85,'4-9':65,
    '5-5':75,'5-6':65,'5-7':80,'5-8':70,'5-9':75,
    '6-6':90,'6-7':70,'6-8':75,'6-9':85,
    '7-7':80,'7-8':65,'7-9':75,
    '8-8':70,'8-9':65,
    '9-9':85,
    '11-11':95,'22-22':95,'33-33':95,
    '11-22':90,'11-33':88,'22-33':92,
  }
  const key = [a,b].sort((x,y)=>x-y).join('-')
  return pairs[key] || 65
}

const COMPAT_DESC: Record<string,string> = {
  '1-3':'Creative fire — you inspire each other to dream bigger and act bolder.',
  '2-6':'Soul sanctuary — deep emotional attunement and unconditional nurturing.',
  '3-5':'Magnetic adventure — spontaneous, joyful, never a dull moment.',
  '4-8':'Empire builders — shared ambition creates lasting material and spiritual legacy.',
  '6-6':'Twin flames of devotion — rare, beautiful, deeply healing for both.',
  '6-9':'Humanitarian hearts — united by a shared mission to uplift the world.',
  '9-9':'Old souls reunited — karmic completion and profound mutual understanding.',
  '11-22':'Master number union — a spiritually destined partnership of great purpose.',
}

function getCompatDesc(a: number, b: number): string {
  const key = [a,b].sort((x,y)=>x-y).join('-')
  return COMPAT_DESC[key] || 'A unique cosmic pairing with its own sacred lessons and gifts to offer each other.'
}

const ASPECTS = [
  { label: 'Emotional', key: 'soul' },
  { label: 'Life Purpose', key: 'life' },
  { label: 'Expression', key: 'destiny' },
]

export default function CompatibilityPage() {
  const [name1, setName1] = useState('')
  const [dob1, setDob1] = useState('')
  const [name2, setName2] = useState('')
  const [dob2, setDob2] = useState('')
  const [result, setResult] = useState<any>(null)

  function calculate() {
    if (!dob1 || !dob2) return
    const lp1 = calcLifePath(dob1), lp2 = calcLifePath(dob2)
    const su1 = name1 ? calcSoulUrge(name1) : 0
    const su2 = name2 ? calcSoulUrge(name2) : 0
    const d1 = name1 ? calcDestiny(name1) : 0
    const d2 = name2 ? calcDestiny(name2) : 0
    const lifeScore = compatScore(lp1, lp2)
    const soulScore = su1&&su2 ? compatScore(su1,su2) : lifeScore
    const destScore = d1&&d2 ? compatScore(d1,d2) : lifeScore
    const overall = Math.round((lifeScore*0.4 + soulScore*0.35 + destScore*0.25))
    setResult({ lp1,lp2,su1,su2,d1,d2,lifeScore,soulScore,destScore,overall })
  }

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',padding:'1.25rem',marginBottom:'0.875rem'}
  const input: React.CSSProperties = {width:'100%',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(200,180,255,0.12)',borderRadius:'0.75rem',padding:'0.65rem 0.875rem',color:'rgba(220,200,255,0.85)',fontSize:'0.9rem',fontFamily:'inherit',boxSizing:'border-box' as const,outline:'none',marginBottom:'0.5rem'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Soul Compatibility</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Discover your numerological harmony</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginBottom:'1rem'}}>
        <div style={card}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>Person 1</div>
          <input style={input} placeholder='Name (optional)' value={name1} onChange={e=>setName1(e.target.value)} />
          <input style={{...input,marginBottom:0}} type='date' value={dob1} onChange={e=>setDob1(e.target.value)} />
        </div>
        <div style={card}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>Person 2</div>
          <input style={input} placeholder='Name (optional)' value={name2} onChange={e=>setName2(e.target.value)} />
          <input style={{...input,marginBottom:0}} type='date' value={dob2} onChange={e=>setDob2(e.target.value)} />
        </div>
      </div>

      <button onClick={calculate} disabled={!dob1||!dob2} style={{width:'100%',padding:'0.875rem',background:'linear-gradient(135deg,rgba(167,139,250,0.2),rgba(201,168,76,0.2))',border:'1px solid rgba(167,139,250,0.3)',borderRadius:'0.875rem',color:'#a78bfa',fontSize:'0.9rem',cursor:'pointer',fontFamily:'inherit',marginBottom:'1.25rem',opacity:(!dob1||!dob2)?0.5:1}}>Calculate Compatibility ❆</button>

      {result && (
        <>
          {/* Overall score */}
          <div style={{...card,textAlign:'center',borderColor:'rgba(201,168,76,0.2)'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>Overall Compatibility</div>
            <div style={{position:'relative',width:'120px',height:'120px',margin:'0 auto 1rem'}}>
              <svg viewBox='0 0 120 120' style={{width:'100%',height:'100%',transform:'rotate(-90deg)'}}>
                <circle cx='60' cy='60' r='50' fill='none' stroke='rgba(200,180,255,0.08)' strokeWidth='8'/>
                <circle cx='60' cy='60' r='50' fill='none' stroke='url(#grad)' strokeWidth='8' strokeLinecap='round'
                  strokeDasharray={`${result.overall/100*314} 314`}/>
                <defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='0%'><stop offset='0%' stopColor='#a78bfa'/><stop offset='100%' stopColor='#c9a84c'/></linearGradient></defs>
              </svg>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                <div style={{color:'rgba(220,200,255,0.95)',fontSize:'2rem',fontWeight:700,lineHeight:1}}>{result.overall}%</div>
              </div>
            </div>
            <div style={{color:'rgba(200,180,255,0.65)',fontSize:'1rem',lineHeight:1.6,fontStyle:'italic',fontFamily:'Cormorant Garamond,serif'}}>
              {getCompatDesc(result.lp1,result.lp2)}
            </div>
          </div>

          {/* Number breakdown */}
          <div style={card}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>Number Breakdown</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr auto 1fr',gap:'0.5rem',alignItems:'center'}}>
              {[
                {label:'Life Path',a:result.lp1,b:result.lp2,score:result.lifeScore},
                {label:'Soul Urge',a:result.su1||'—',b:result.su2||'—',score:result.soulScore},
                {label:'Destiny',a:result.d1||'—',b:result.d2||'—',score:result.destScore},
              ].map(row=>(
                <>
                  <div key={row.label+'a'} style={{textAlign:'center'}}>
                    <div style={{color:'#a78bfa',fontSize:'1.4rem',fontWeight:700}}>{row.a}</div>
                    <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.6rem'}}>{name1||'Person 1'}</div>
                  </div>
                  <div key={row.label+'mid'} style={{textAlign:'center'}}>
                    <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.2rem'}}>{row.label}</div>
                    <div style={{background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:'9999px',padding:'0.2rem 0.5rem',color:'#a78bfa',fontSize:'0.75rem',fontWeight:600}}>{row.score}%</div>
                  </div>
                  <div key={row.label+'b'} style={{textAlign:'center'}}>
                    <div style={{color:'#c9a84c',fontSize:'1.4rem',fontWeight:700}}>{row.b}</div>
                    <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.6rem'}}>{name2||'Person 2'}</div>
                  </div>
                </>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div style={card}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>Relationship Strengths</div>
            {[
              result.overall>=80?'✨ High spiritual resonance — you elevate each other&#39;s vibration':null,
              result.lifeScore>=80?'🧭 Aligned life paths — walking toward the same horizon':null,
              result.soulScore>=80?'💜 Deep soul recognition — you have met before in other lifetimes':null,
              result.destScore>=80?'🌟 Complementary expressions — your gifts amplify each other':null,
              result.overall<70?'🌱 Growth partnership — your differences are your greatest teachers':null,
            ].filter(Boolean).map((s,i)=>(
              <div key={i} style={{color:'rgba(200,180,255,0.7)',fontSize:'0.85rem',lineHeight:1.6,marginBottom:'0.4rem'}}>{s}</div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
