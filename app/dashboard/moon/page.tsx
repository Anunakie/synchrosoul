'use client'
import { useState, useEffect } from 'react'

function getMoonPhase(date: Date): { phase: string; emoji: string; illumination: number; dayInCycle: number; nextFull: Date; nextNew: Date } {
  // Known new moon: Jan 11, 2024
  const knownNew = new Date('2024-01-11T11:57:00Z')
  const synodicMonth = 29.53058867
  const diff = (date.getTime() - knownNew.getTime()) / (1000 * 60 * 60 * 24)
  const cycles = diff / synodicMonth
  const dayInCycle = ((cycles % 1) + 1) % 1 * synodicMonth
  const illumination = Math.round(Math.abs(Math.cos((dayInCycle / synodicMonth) * 2 * Math.PI - Math.PI)) * 100)
  let phase = '', emoji = ''
  if (dayInCycle < 1.85) { phase = 'New Moon'; emoji = '🌑' }
  else if (dayInCycle < 7.38) { phase = 'Waxing Crescent'; emoji = '🌒' }
  else if (dayInCycle < 9.22) { phase = 'First Quarter'; emoji = '🌓' }
  else if (dayInCycle < 14.77) { phase = 'Waxing Gibbous'; emoji = '🌔' }
  else if (dayInCycle < 16.61) { phase = 'Full Moon'; emoji = '🌕' }
  else if (dayInCycle < 22.15) { phase = 'Waning Gibbous'; emoji = '🌖' }
  else if (dayInCycle < 23.99) { phase = 'Last Quarter'; emoji = '🌗' }
  else { phase = 'Waning Crescent'; emoji = '🌘' }
  const daysToFull = dayInCycle < 14.77 ? 14.77 - dayInCycle : synodicMonth - dayInCycle + 14.77
  const daysToNew = dayInCycle < 29.53 ? synodicMonth - dayInCycle : 0
  const nextFull = new Date(date.getTime() + daysToFull * 86400000)
  const nextNew = new Date(date.getTime() + daysToNew * 86400000)
  return { phase, emoji, illumination, dayInCycle, nextFull, nextNew }
}

const PHASE_DATA: Record<string, { energy: string; ritual: string; affirmation: string; color: string; crystals: string[]; avoid: string }> = {
  'New Moon': { energy: 'Planting seeds of intention. The void before creation. Pure potential.', ritual: 'Write 3 intentions on paper. Light a candle. Sit in silence for 10 minutes visualizing your desires as already real.', affirmation: 'I am a powerful creator. My intentions are seeds of divine manifestation.', color: '#1e1b4b', crystals: ['Black Tourmaline','Labradorite','Obsidian'], avoid: 'Avoid making major decisions or launching projects — plant seeds, do not harvest yet.' },
  'Waxing Crescent': { energy: 'First steps forward. Courage to begin. Momentum building.', ritual: 'Take one concrete action toward your new moon intention. Journal what you are calling in.', affirmation: 'I take inspired action. Every step forward is divinely guided.', color: '#312e81', crystals: ['Citrine','Green Aventurine','Carnelian'], avoid: 'Avoid self-doubt — trust the seeds you planted.' },
  'First Quarter': { energy: 'Challenges arise to test your commitment. Push through resistance.', ritual: 'Identify one obstacle and write three ways to overcome it. Do something that scares you slightly.', affirmation: 'I am stronger than any obstacle. Challenges are my teachers.', color: '#4338ca', crystals: ['Tiger Eye','Red Jasper','Pyrite'], avoid: 'Avoid giving up when things feel hard — this is the test.' },
  'Waxing Gibbous': { energy: 'Refinement and trust. Almost there. Fine-tune your approach.', ritual: 'Review your intentions. What needs adjusting? Express gratitude for progress made so far.', affirmation: 'I trust the process. I am being refined into my highest self.', color: '#6d28d9', crystals: ['Amethyst','Sodalite','Lapis Lazuli'], avoid: 'Avoid impatience — the harvest is near.' },
  'Full Moon': { energy: 'Peak illumination. Manifestation. Heightened intuition and emotion.', ritual: 'Charge your crystals under moonlight. Write what you are releasing. Bathe with sea salt. Celebrate what has come to fruition.', affirmation: 'I am fully illuminated. I release what no longer serves my highest good.', color: '#7c3aed', crystals: ['Moonstone','Selenite','Clear Quartz'], avoid: 'Avoid starting new things — this is a time to receive and release.' },
  'Waning Gibbous': { energy: 'Gratitude and sharing. Distribute your harvest. Teach what you know.', ritual: 'Share something valuable with someone. Write a gratitude list of 10 things. Give something away.', affirmation: 'I am grateful for all that I have received. I share my gifts freely.', color: '#5b21b6', crystals: ['Rose Quartz','Rhodonite','Green Jade'], avoid: 'Avoid hoarding energy or resources — flow and give.' },
  'Last Quarter': { energy: 'Release and forgiveness. Let go of what is complete. Clear space.', ritual: 'Write what you are forgiving and releasing. Burn or tear the paper. Declutter one area of your home.', affirmation: 'I release with grace and gratitude. I forgive myself and others completely.', color: '#4c1d95', crystals: ['Black Obsidian','Smoky Quartz','Apache Tear'], avoid: 'Avoid holding grudges or clinging to the past.' },
  'Waning Crescent': { energy: 'Rest, surrender, and integration. The void approaches. Trust the dark.', ritual: 'Rest deeply. Meditate. Journal your dreams. Prepare for the new cycle by clearing your mind.', affirmation: 'I surrender to divine timing. In stillness I find my deepest wisdom.', color: '#2e1065', crystals: ['Lepidolite','Blue Lace Agate','Howlite'], avoid: 'Avoid forcing outcomes — rest and receive.' },
}

const ZODIAC_SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces']
const ZODIAC_EMOJIS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

function getMoonSign(date: Date): { sign: string; emoji: string } {
  // Moon moves ~13 degrees/day, changes sign every ~2.5 days
  const ref = new Date('2024-01-01T00:00:00Z')
  const days = (date.getTime() - ref.getTime()) / 86400000
  const signIndex = Math.floor((days * 13.176 / 30) % 12 + 12) % 12
  return { sign: ZODIAC_SIGNS[signIndex], emoji: ZODIAC_EMOJIS[signIndex] }
}

export default function MoonPage() {
  const [moonData, setMoonData] = useState<ReturnType<typeof getMoonPhase>|null>(null)
  const [moonSign, setMoonSign] = useState<{sign:string;emoji:string}|null>(null)
  const [tab, setTab] = useState<'today'|'ritual'|'calendar'>('today')
  const [calDays, setCalDays] = useState<{date:Date;phase:string;emoji:string}[]>([])

  useEffect(() => {
    const now = new Date()
    setMoonData(getMoonPhase(now))
    setMoonSign(getMoonSign(now))
    // Build 28-day calendar
    const days = []
    for (let i = -7; i < 21; i++) {
      const d = new Date(now); d.setDate(now.getDate() + i)
      const mp = getMoonPhase(d)
      days.push({ date: d, phase: mp.phase, emoji: mp.emoji })
    }
    setCalDays(days)
  }, [])

  if (!moonData) return <div style={{padding:'2rem',textAlign:'center',color:'rgba(180,160,255,0.5)'}}>Loading moon data...</div>

  const phaseData = PHASE_DATA[moonData.phase]
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',padding:'1.25rem',marginBottom:'0.875rem'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Moon Phase</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Align your energy with the lunar cycle</p>

      {/* Main moon display */}
      <div style={{...card,textAlign:'center',borderColor:'rgba(167,139,250,0.2)',background:'rgba(8,6,28,0.95)'}}>
        <div style={{fontSize:'5rem',marginBottom:'0.5rem',filter:'drop-shadow(0 0 20px rgba(167,139,250,0.4))'}}>{moonData.emoji}</div>
        <div style={{color:'rgba(220,200,255,0.95)',fontSize:'1.4rem',fontFamily:'Cormorant Garamond,serif',marginBottom:'0.25rem'}}>{moonData.phase}</div>
        {moonSign && <div style={{color:'rgba(180,160,255,0.5)',fontSize:'0.82rem',marginBottom:'1rem'}}>Moon in {moonSign.emoji} {moonSign.sign}</div>}
        {/* Illumination bar */}
        <div style={{marginBottom:'0.875rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.3rem'}}>
            <span style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem'}}>Illumination</span>
            <span style={{color:'rgba(220,200,255,0.7)',fontSize:'0.65rem'}}>{moonData.illumination}%</span>
          </div>
          <div style={{height:'6px',background:'rgba(200,180,255,0.08)',borderRadius:'9999px',overflow:'hidden'}}>
            <div style={{height:'100%',width:moonData.illumination+'%',background:'linear-gradient(90deg,rgba(167,139,250,0.4),rgba(220,200,255,0.8))',borderRadius:'9999px'}} />
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
          <div style={{background:'rgba(200,180,255,0.05)',borderRadius:'0.75rem',padding:'0.625rem'}}>
            <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.2rem'}}>Next Full Moon</div>
            <div style={{color:'rgba(220,200,255,0.75)',fontSize:'0.8rem'}}>{moonData.nextFull.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
          </div>
          <div style={{background:'rgba(200,180,255,0.05)',borderRadius:'0.75rem',padding:'0.625rem'}}>
            <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.2rem'}}>Next New Moon</div>
            <div style={{color:'rgba(220,200,255,0.75)',fontSize:'0.8rem'}}>{moonData.nextNew.toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:'0.4rem',marginBottom:'1rem'}}>
        {([['today','🌙 Energy'],['ritual','✨ Ritual'],['calendar','📅 Calendar']] as const).map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'0.4rem 0.875rem',borderRadius:'9999px',border:tab===t?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.1)',background:tab===t?'rgba(167,139,250,0.15)':'transparent',color:tab===t?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.75rem',cursor:'pointer'}}>{l}</button>
        ))}
      </div>

      {tab==='today' && phaseData && (
        <>
          <div style={card}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>Lunar Energy</div>
            <p style={{color:'rgba(200,180,255,0.75)',fontSize:'1.05rem'}}>{phaseData.energy}</p>
            <div style={{background:'rgba(167,139,250,0.06)',border:'1px solid rgba(167,139,250,0.12)',borderRadius:'0.875rem',padding:'0.875rem'}}>
              <div style={{color:'rgba(167,139,250,0.5)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'0.4rem'}}>Affirmation</div>
              <p style={{color:'rgba(220,200,255,0.8)',fontSize:'0.88rem',lineHeight:1.6,margin:0,fontStyle:'italic'}}>“{phaseData.affirmation}”</p>
            </div>
          </div>
          <div style={card}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.75rem'}}>Power Crystals</div>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap'}}>
              {phaseData.crystals.map(c=>(
                <span key={c} style={{background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.15)',borderRadius:'9999px',padding:'0.3rem 0.75rem',color:'rgba(200,180,255,0.7)',fontSize:'0.78rem'}}>💎 {c}</span>
              ))}
            </div>
          </div>
          <div style={{...card,borderColor:'rgba(251,146,60,0.15)'}}>
            <div style={{color:'rgba(251,146,60,0.5)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.5rem'}}>⚠️ Avoid</div>
            <p style={{color:'rgba(200,180,255,0.6)',fontSize:'0.85rem',lineHeight:1.6,margin:0}}>{phaseData.avoid}</p>
          </div>
        </>
      )}

      {tab==='ritual' && phaseData && (
        <div style={card}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>{moonData.phase} Ritual</div>
          <p style={{color:'rgba(200,180,255,0.75)',fontSize:'0.9rem',lineHeight:1.8,margin:0}}>{phaseData.ritual}</p>
        </div>
      )}

      {tab==='calendar' && (
        <div style={card}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.62rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.875rem'}}>28-Day Lunar Calendar</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:'0.3rem'}}>
            {['S','M','T','W','T','F','S'].map((d,i)=>(
              <div key={i} style={{textAlign:'center',color:'rgba(180,160,255,0.25)',fontSize:'0.6rem',paddingBottom:'0.25rem'}}>{d}</div>
            ))}
            {calDays.map((d,i)=>{
              const isToday = d.date.toDateString()===new Date().toDateString()
              return (
                <div key={i} title={d.phase} style={{textAlign:'center',padding:'0.3rem 0',borderRadius:'0.4rem',background:isToday?'rgba(167,139,250,0.15)':'transparent',border:isToday?'1px solid rgba(167,139,250,0.3)':'1px solid transparent'}}>
                  <div style={{fontSize:'0.9rem'}}>{d.emoji}</div>
                  <div style={{color:isToday?'rgba(220,200,255,0.85)':'rgba(180,160,255,0.3)',fontSize:'0.55rem'}}>{d.date.getDate()}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
