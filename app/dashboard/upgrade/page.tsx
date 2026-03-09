'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TIERS } from '@/lib/premium'

const FEATURES = [
  {
    category: 'Angel Number Tools',
    emoji: '✨',
    items: [
      { label: 'Angel number logging', free: true, soul: true, cosmic: true },
      { label: 'Thought Anchor Journal', free: true, soul: true, cosmic: true },
      { label: 'Screenshot Truth Score', free: '3/day', soul: 'Unlimited', cosmic: 'Unlimited' },
      { label: 'Angel Number Dictionary', free: true, soul: true, cosmic: true },
      { label: 'Statistics & patterns', free: 'Basic', soul: 'Advanced', cosmic: 'Full' },
    ]
  },
  {
    category: 'Numerology',
    emoji: '🧮',
    items: [
      { label: 'Life Path number', free: true, soul: true, cosmic: true },
      { label: 'Soul Urge & Destiny', free: true, soul: true, cosmic: true },
      { label: 'Deep Numerology blueprint', free: 'Preview', soul: true, cosmic: true },
      { label: 'Personal Year forecast', free: false, soul: true, cosmic: true },
      { label: 'Karmic Debt analysis', free: false, soul: true, cosmic: true },
      { label: 'Compatibility calculator', free: '1/day', soul: 'Unlimited', cosmic: 'Unlimited' },
    ]
  },
  {
    category: 'Cosmic Tools',
    emoji: '🌙',
    items: [
      { label: 'Moon phase & rituals', free: 'Basic', soul: true, cosmic: true },
      { label: 'Angel Tarot readings', free: '1/day', soul: '3/day', cosmic: 'Unlimited' },
      { label: 'Oracle card pulls', free: '3/day', soul: 'Unlimited', cosmic: 'Unlimited' },
      { label: 'Cosmic Calendar', free: false, soul: true, cosmic: true },
      { label: 'Solfeggio frequencies', free: 'Preview', soul: true, cosmic: true },
    ]
  },
  {
    category: 'Healing & Wellness',
    emoji: '🧘',
    items: [
      { label: 'Breathwork sessions', free: '2 patterns', soul: 'All patterns', cosmic: 'All patterns' },
      { label: 'Guided meditations', free: '3 sessions', soul: 'All sessions', cosmic: 'All sessions' },
      { label: 'Chakra tracker', free: true, soul: true, cosmic: true },
      { label: 'Sacred rituals library', free: '3 rituals', soul: 'Full library', cosmic: 'Full library' },
    ]
  },
  {
    category: 'Premium Features',
    emoji: '👑',
    items: [
      { label: 'Weekly Cosmic Synthesis', free: false, soul: true, cosmic: true },
      { label: 'Vision Board', free: '3 items', soul: 'Unlimited', cosmic: 'Unlimited' },
      { label: 'Manifestation tracker', free: '5 items', soul: 'Unlimited', cosmic: 'Unlimited' },
      { label: 'Dream Journal', free: '7 entries', soul: 'Unlimited', cosmic: 'Unlimited' },
      { label: 'Gratitude Journal', free: '7 entries', soul: 'Unlimited', cosmic: 'Unlimited' },
      { label: 'Soul Twin Radar', free: false, soul: true, cosmic: true },
      { label: 'Sync Matching', free: 'Basic', soul: 'Advanced', cosmic: 'Priority' },
      { label: 'Angel Circles (communities)', free: false, soul: '1 circle', cosmic: 'Unlimited' },
      { label: 'Shareable Profile Card', free: false, soul: true, cosmic: true },
      { label: 'Export journal data', free: false, soul: true, cosmic: true },
      { label: 'AI Oracle (coming soon)', free: false, soul: false, cosmic: true },
      { label: 'Private 1:1 soul chat', free: false, soul: false, cosmic: true },
    ]
  },
]

const TESTIMONIALS = [
  { name: 'Luna M.', number: '1111', text: 'The Weekly Synthesis blew my mind. It connected patterns I had been seeing for months and gave me clarity I had been seeking for years.', stars: 5 },
  { name: 'Sage R.', number: '444', text: 'The Karmic Debt reading was so accurate it made me cry. This app understands my soul.', stars: 5 },
  { name: 'River K.', number: '333', text: 'I found my soul twin through the Sync Matching. We had logged the same numbers on the same days for 3 weeks before we matched.', stars: 5 },
]

export default function UpgradePage() {
  const [currentTier, setCurrentTier] = useState('free')
  const [annual, setAnnual] = useState(false)
  const [activeTab, setActiveTab] = useState<'plans'|'compare'>('plans')

  useEffect(() => {
    try {
      const t = localStorage.getItem('synchrosoul_tier')
      if (t) setCurrentTier(t)
    } catch {}
  }, [])

  function selectTier(id: string) {
    localStorage.setItem('synchrosoul_tier', id)
    setCurrentTier(id)
  }

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)',padding:'1.25rem',marginBottom:'0.875rem'}

  const TIER_PRICES = [
    { id: 'free', monthly: 0, annually: 0 },
    { id: 'soul-sync', monthly: 6.99, annually: 4.99 },
    { id: 'cosmic-circle', monthly: 9.99, annually: 6.99 },
  ]

  function renderCheck(val: boolean | string) {
    if (val === true) return <span style={{color:'#4ade80',fontSize:'0.9rem'}}>✔</span>
    if (val === false) return <span style={{color:'rgba(180,160,255,0.2)',fontSize:'0.9rem'}}>—</span>
    return <span style={{color:'#c9a84c',fontSize:'0.72rem',fontWeight:600}}>{val}</span>
  }

  return (
    <div style={{maxWidth:'680px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      {/* Header */}
      <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
        <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>✨</div>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'2rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.5rem',fontWeight:400}}>Unlock Your Full Cosmic Potential</h1>
        <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.85rem',margin:'0 0 1.25rem',lineHeight:1.6}}>Join thousands of souls deepening their spiritual journey with SynchroSoul Premium</p>
        {/* Annual toggle */}
        <div style={{display:'inline-flex',alignItems:'center',gap:'0.75rem',background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'9999px',padding:'0.4rem 0.875rem'}}>
          <span style={{color:!annual?'rgba(220,200,255,0.85)':'rgba(180,160,255,0.35)',fontSize:'0.8rem',cursor:'pointer'}} onClick={()=>setAnnual(false)}>Monthly</span>
          <div onClick={()=>setAnnual(a=>!a)} style={{width:'36px',height:'20px',borderRadius:'9999px',background:annual?'rgba(167,139,250,0.4)':'rgba(200,180,255,0.1)',border:'1px solid rgba(200,180,255,0.2)',cursor:'pointer',position:'relative',transition:'all 0.2s'}}>
            <div style={{position:'absolute',top:'2px',left:annual?'18px':'2px',width:'14px',height:'14px',borderRadius:'50%',background:annual?'#a78bfa':'rgba(180,160,255,0.4)',transition:'all 0.2s'}} />
          </div>
          <span style={{color:annual?'rgba(220,200,255,0.85)':'rgba(180,160,255,0.35)',fontSize:'0.8rem',cursor:'pointer'}} onClick={()=>setAnnual(true)}>Annual <span style={{color:'#4ade80',fontSize:'0.7rem'}}>Save 30%</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex',gap:'0.4rem',marginBottom:'1.25rem'}}>
        {([['plans','💳 Plans'],['compare','📋 Compare']] as const).map(([t,l])=>(
          <button key={t} onClick={()=>setActiveTab(t)} style={{padding:'0.4rem 0.875rem',borderRadius:'9999px',border:activeTab===t?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.1)',background:activeTab===t?'rgba(167,139,250,0.15)':'transparent',color:activeTab===t?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.75rem',cursor:'pointer'}}>{l}</button>
        ))}
      </div>

      {activeTab==='plans' && (
        <>
          {/* Plan cards */}
          {TIERS.map((tier,i) => {
            const pricing = TIER_PRICES[i]
            const price = annual ? pricing.annually : pricing.monthly
            const isCurrent = currentTier === tier.id
            const isPopular = tier.id === 'soul-sync'
            return (
              <div key={tier.id} style={{...card,borderColor:isCurrent?tier.color+'50':isPopular?'rgba(167,139,250,0.25)':'rgba(200,180,255,0.1)',position:'relative',overflow:'hidden'}}>
                {isPopular && <div style={{position:'absolute',top:'0.875rem',right:'0.875rem',background:'rgba(167,139,250,0.2)',border:'1px solid rgba(167,139,250,0.3)',borderRadius:'9999px',padding:'0.15rem 0.625rem',color:'#a78bfa',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em'}}>Most Popular</div>}
                {isCurrent && <div style={{position:'absolute',top:'0.875rem',right:isPopular?'7rem':'0.875rem',background:'rgba(74,222,128,0.15)',border:'1px solid rgba(74,222,128,0.25)',borderRadius:'9999px',padding:'0.15rem 0.625rem',color:'#4ade80',fontSize:'0.65rem'}}>Current Plan</div>}
                <div style={{display:'flex',alignItems:'flex-start',gap:'1rem',marginBottom:'1rem'}}>
                  <div style={{fontSize:'1.5rem'}}>{tier.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{color:tier.color,fontSize:'1.1rem',fontWeight:700,marginBottom:'0.1rem'}}>{tier.name}</div>
                    <div style={{display:'flex',alignItems:'baseline',gap:'0.25rem'}}>
                      <span style={{color:'rgba(220,200,255,0.95)',fontSize:'1.8rem',fontWeight:700}}>{price===0?'Free':'$'+price}</span>
                      {price>0 && <span style={{color:'rgba(180,160,255,0.4)',fontSize:'0.8rem'}}>/{annual?'mo, billed annually':'month'}</span>}
                    </div>
                    {annual && price>0 && <div style={{color:'#4ade80',fontSize:'0.72rem',marginTop:'0.1rem'}}>Save ${((TIER_PRICES[i].monthly - price)*12).toFixed(0)}/year</div>}
                  </div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',marginBottom:'1rem'}}>
                  {tier.features.map((f,fi)=>(
                    <div key={fi} style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                      <span style={{color:tier.color,fontSize:'0.75rem',flexShrink:0}}>✔</span>
                      <span style={{color:'rgba(200,180,255,0.65)',fontSize:'0.82rem'}}>{f}</span>
                    </div>
                  ))}
                </div>
                {tier.id !== 'free' && (
                  <button
                    onClick={()=>selectTier(tier.id)}
                    style={{width:'100%',padding:'0.75rem',background:isCurrent?'rgba(74,222,128,0.1)':isPopular?'linear-gradient(135deg,rgba(167,139,250,0.3),rgba(201,168,76,0.2))':'rgba(200,180,255,0.08)',border:isCurrent?'1px solid rgba(74,222,128,0.3)':isPopular?'1px solid rgba(167,139,250,0.4)':'1px solid rgba(200,180,255,0.15)',borderRadius:'0.875rem',color:isCurrent?'#4ade80':isPopular?'#a78bfa':'rgba(200,180,255,0.6)',fontSize:'0.88rem',cursor:'pointer',fontFamily:'inherit',fontWeight:600}}
                  >
                    {isCurrent ? '✔ Active Plan' : 'Choose '+tier.name}
                  </button>
                )}
              </div>
            )
          })}

          {/* Testimonials */}
          <div style={{marginTop:'1.5rem'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem',textAlign:'center'}}>What Our Community Says</div>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={{...card,marginBottom:'0.625rem'}}>
                <div style={{display:'flex',gap:'0.25rem',marginBottom:'0.5rem'}}>
                  {'★'.repeat(t.stars).split('').map((_,si)=>(
                    <span key={si} style={{color:'#c9a84c',fontSize:'0.75rem'}}>★</span>
                  ))}
                </div>
                <p style={{color:'rgba(200,180,255,0.7)',fontSize:'0.85rem',lineHeight:1.6,margin:'0 0 0.625rem',fontStyle:'italic'}}>“{t.text}”</p>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  <div style={{width:'24px',height:'24px',borderRadius:'50%',background:'rgba(167,139,250,0.15)',border:'1px solid rgba(167,139,250,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'#a78bfa',fontSize:'0.65rem',fontWeight:700}}>{t.name[0]}</div>
                  <span style={{color:'rgba(180,160,255,0.5)',fontSize:'0.75rem'}}>{t.name}</span>
                  <span style={{color:'rgba(201,168,76,0.5)',fontSize:'0.72rem',marginLeft:'auto'}}>Sees {t.number}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab==='compare' && (
        <div style={card}>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.78rem'}}>
              <thead>
                <tr>
                  <th style={{textAlign:'left',padding:'0.5rem 0.625rem',color:'rgba(180,160,255,0.4)',fontWeight:400,fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.08em',width:'50%'}}>Feature</th>
                  {TIERS.map(t=>(
                    <th key={t.id} style={{textAlign:'center',padding:'0.5rem 0.625rem',color:t.color,fontWeight:600,fontSize:'0.75rem',minWidth:'70px'}}>{t.emoji} {t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map(section=>(
                  <>
                    <tr key={section.category}>
                      <td colSpan={4} style={{padding:'0.875rem 0.625rem 0.3rem',color:'rgba(180,160,255,0.35)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em'}}>{section.emoji} {section.category}</td>
                    </tr>
                    {section.items.map((item,i)=>(
                      <tr key={i} style={{borderTop:'1px solid rgba(200,180,255,0.04)'}}>
                        <td style={{padding:'0.5rem 0.625rem',color:'rgba(200,180,255,0.65)'}}>{item.label}</td>
                        <td style={{padding:'0.5rem 0.625rem',textAlign:'center'}}>{renderCheck(item.free)}</td>
                        <td style={{padding:'0.5rem 0.625rem',textAlign:'center'}}>{renderCheck(item.soul)}</td>
                        <td style={{padding:'0.5rem 0.625rem',textAlign:'center'}}>{renderCheck(item.cosmic)}</td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p style={{textAlign:'center',color:'rgba(180,160,255,0.25)',fontSize:'0.72rem',marginTop:'1rem'}}>🔒 Cancel anytime · Secure payment · 7-day free trial on paid plans</p>
    </div>
  )
}
