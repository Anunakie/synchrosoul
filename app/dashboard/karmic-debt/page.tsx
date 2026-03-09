'use client'
import { useState, useEffect } from 'react'
import { calcLifePath, calcDestiny, calcSoulUrge } from '@/lib/numerology'

const KEY_PROFILE = 'synchrosoul_numerology_profile'

const KARMIC_DEBT_NUMBERS = [13, 14, 16, 19]

const KARMIC_DATA: Record<number, { title: string; lesson: string; past: string; healing: string; affirmation: string; color: string; emoji: string }> = {
  13: {
    title: 'The Transformer',
    lesson: 'Laziness and misuse of creative energy in a past life. You must learn discipline, hard work, and to build through consistent effort rather than shortcuts.',
    past: 'In a previous incarnation, you avoided responsibility and let others carry your burdens. You may have been gifted but squandered your talents.',
    healing: 'Embrace hard work joyfully. Complete what you start. Build something of lasting value. Your transformation comes through disciplined creative expression.',
    affirmation: 'I build my dreams with joyful discipline. Every effort I make is sacred.',
    color: '#f87171',
    emoji: '🔥',
  },
  14: {
    title: 'The Liberator',
    lesson: 'Abuse of freedom and overindulgence in past lives. You must learn moderation, commitment, and to use your freedom responsibly.',
    past: 'You may have been a ruler, explorer, or free spirit who abused power or abandoned responsibilities in pursuit of pleasure and adventure.',
    healing: 'Practice moderation in all things. Honor your commitments. Use your natural charisma to uplift others rather than serve only yourself.',
    affirmation: 'I use my freedom wisely. I am committed to my highest path.',
    color: '#fb923c',
    emoji: '🌊',
  },
  16: {
    title: 'The Rebuilder',
    lesson: 'Ego, pride, and misuse of love in past lives. The ego must be dismantled so the higher self can emerge. Expect sudden upheavals that force spiritual growth.',
    past: 'You may have been in a position of power and used it selfishly, or engaged in illicit love affairs that caused great harm to others.',
    healing: 'Surrender the ego willingly before life forces you to. Seek spiritual truth over worldly status. Your greatest strength comes after your greatest fall.',
    affirmation: 'I release my ego with grace. My soul is my true identity.',
    color: '#a78bfa',
    emoji: '💫',
  },
  19: {
    title: 'The Independent',
    lesson: 'Misuse of power and refusal to help others in past lives. You must learn to ask for help, to be vulnerable, and to use your strength in service of others.',
    past: 'You were likely a powerful leader who ruled without compassion, or someone who hoarded resources and refused to share with those in need.',
    healing: 'Practice vulnerability and interdependence. Ask for help when you need it. Use your considerable strength to empower others rather than dominate them.',
    affirmation: 'I am strong enough to be vulnerable. I lead with love and humility.',
    color: '#c9a84c',
    emoji: '👑',
  },
}

const KARMIC_LESSONS: Record<number, string> = {
  1: 'Independence and self-reliance — you avoided standing on your own',
  2: 'Cooperation and sensitivity — you dismissed the needs of others',
  3: 'Creative expression — you suppressed your authentic voice',
  4: 'Hard work and discipline — you avoided building solid foundations',
  5: 'Freedom and adaptability — you resisted necessary change',
  6: 'Love and responsibility — you avoided commitment and family',
  7: 'Spiritual depth — you dismissed inner wisdom and intuition',
  8: 'Personal power — you either abused or avoided your authority',
  9: 'Compassion and completion — you held grudges and resisted endings',
}

function findKarmicDebts(dob: string, name: string): { debts: number[]; lessons: number[] } {
  const debts: number[] = []
  const lessons: number[] = []
  if (!dob) return { debts, lessons }
  // Check birth numbers for karmic debt
  const d = new Date(dob)
  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const lp = calcLifePath(dob)
  // Raw numbers before reduction
  const rawNums = [day, month, year, lp]
  KARMIC_DEBT_NUMBERS.forEach(kd => {
    if (rawNums.some(n => String(n).includes(String(kd)) || n === kd)) {
      if (!debts.includes(kd)) debts.push(kd)
    }
  })
  // Karmic lessons from name
  if (name) {
    const PYTHAGOREAN: Record<string,number> = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8}
    const presentNums = new Set<number>()
    name.toLowerCase().replace(/[^a-z]/g,'').split('').forEach(c => {
      if (PYTHAGOREAN[c]) presentNums.add(PYTHAGOREAN[c])
    })
    for (let i=1;i<=9;i++) {
      if (!presentNums.has(i)) lessons.push(i)
    }
  }
  return { debts, lessons }
}

export default function KarmicDebtPage() {
  const [dob, setDob] = useState('')
  const [name, setName] = useState('')
  const [result, setResult] = useState<{debts:number[];lessons:number[]}|null>(null)

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(KEY_PROFILE)||'null')
      if (p?.birthdate) setDob(p.birthdate)
      if (p?.name) setName(p.name)
    } catch {}
  }, [])

  function calculate() {
    setResult(findKarmicDebts(dob, name))
  }

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',padding:'1.25rem',marginBottom:'0.875rem'}
  const input: React.CSSProperties = {width:'100%',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(200,180,255,0.12)',borderRadius:'0.75rem',padding:'0.65rem 0.875rem',color:'rgba(220,200,255,0.85)',fontSize:'0.9rem',fontFamily:'inherit',boxSizing:'border-box' as const,outline:'none',marginBottom:'0.625rem'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Karmic Debt</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Uncover the soul lessons carried from past lives</p>

      <div style={card}>
        <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>Your Details</div>
        <input style={input} placeholder='Full birth name' value={name} onChange={e=>setName(e.target.value)} />
        <input style={{...input,marginBottom:'0.875rem'}} type='date' value={dob} onChange={e=>setDob(e.target.value)} />
        <button onClick={calculate} disabled={!dob} style={{width:'100%',padding:'0.75rem',background:'linear-gradient(135deg,rgba(167,139,250,0.2),rgba(201,168,76,0.2))',border:'1px solid rgba(167,139,250,0.3)',borderRadius:'0.875rem',color:'#a78bfa',fontSize:'0.9rem',cursor:'pointer',fontFamily:'inherit',opacity:!dob?0.5:1}}>Reveal Karmic Patterns ❆</button>
      </div>

      {result && (
        <>
          {result.debts.length === 0 && result.lessons.length === 0 && (
            <div style={{...card,textAlign:'center',borderColor:'rgba(74,222,128,0.2)'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'0.5rem'}}>🕊️</div>
              <div style={{color:'#4ade80',fontSize:'1rem',fontWeight:600,marginBottom:'0.5rem'}}>No Major Karmic Debt Detected</div>
              <p style={{color:'rgba(180,160,255,0.6)',fontSize:'0.85rem',lineHeight:1.6,margin:0}}>Your soul enters this life with a relatively clean karmic slate. Your lessons are more subtle — focus on your Life Path and Soul Urge numbers for guidance.</p>
            </div>
          )}

          {result.debts.map(debt => {
            const data = KARMIC_DATA[debt]
            return (
              <div key={debt} style={{...card,borderColor:data.color+'30'}}>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'1rem'}}>
                  <div style={{width:'52px',height:'52px',borderRadius:'50%',background:data.color+'12',border:'1px solid '+data.color+'25',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <span style={{color:data.color,fontSize:'1.4rem',fontWeight:700}}>{debt}</span>
                  </div>
                  <div>
                    <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.1em'}}>Karmic Debt Number</div>
                    <div style={{color:'rgba(220,200,255,0.9)',fontSize:'1rem',fontWeight:600}}>{data.title} {data.emoji}</div>
                  </div>
                </div>
                {[{label:'The Lesson',text:data.lesson},{label:'Past Life Pattern',text:data.past},{label:'Path to Healing',text:data.healing}].map(s=>(
                  <div key={s.label} style={{marginBottom:'0.875rem'}}>
                    <div style={{color:data.color,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.3rem'}}>{s.label}</div>
                    <p style={{color:'rgba(200,180,255,0.7)',fontSize:'0.85rem',lineHeight:1.7,margin:0}}>{s.text}</p>
                  </div>
                ))}
                <div style={{background:data.color+'08',border:'1px solid '+data.color+'15',borderRadius:'0.875rem',padding:'0.875rem'}}>
                  <div style={{color:data.color,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.3rem'}}>Affirmation</div>
                  <p style={{color:'rgba(220,200,255,0.8)',fontSize:'0.88rem',lineHeight:1.6,margin:0,fontStyle:'italic'}}>“{data.affirmation}”</p>
                </div>
              </div>
            )
          })}

          {result.lessons.length > 0 && (
            <div style={card}>
              <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>Karmic Lessons (Missing Numbers)</div>
              <p style={{color:'rgba(180,160,255,0.45)',fontSize:'0.78rem',lineHeight:1.6,marginBottom:'0.875rem'}}>Numbers absent from your birth name indicate areas where your soul has little experience and must learn in this lifetime.</p>
              <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
                {result.lessons.map(n=>(
                  <div key={n} style={{display:'flex',alignItems:'flex-start',gap:'0.75rem',padding:'0.625rem',background:'rgba(200,180,255,0.03)',borderRadius:'0.75rem',border:'1px solid rgba(200,180,255,0.06)'}}>
                    <div style={{width:'28px',height:'28px',borderRadius:'50%',background:'rgba(167,139,250,0.1)',border:'1px solid rgba(167,139,250,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                      <span style={{color:'#a78bfa',fontSize:'0.8rem',fontWeight:700}}>{n}</span>
                    </div>
                    <p style={{color:'rgba(200,180,255,0.65)',fontSize:'0.82rem',lineHeight:1.6,margin:0}}>{KARMIC_LESSONS[n]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
