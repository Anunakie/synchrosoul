'use client'
import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    id: 'seeker',
    name: 'Seeker',
    price: 'Free',
    priceMonthly: 0,
    color: '#a78bfa',
    emoji: '✦',
    description: 'Begin your angel number journey',
    features: [
      'Angel number logger (unlimited)',
      'Thought Anchor Journal',
      'Dream Journal',
      'Basic numerology (Life Path)',
      'Angel Number Dictionary (29 numbers)',
      'Gratitude practice',
      'Vision Board (6 items)',
      'Cosmic Feed & profile',
      '3 background themes',
    ],
    locked: [],
    cta: 'Current Plan',
    current: true,
  },
  {
    id: 'mystic',
    name: 'Mystic',
    price: '$6.99',
    priceMonthly: 6.99,
    color: '#c9a84c',
    emoji: '✨',
    description: 'Deepen your cosmic practice',
    badge: 'Most Popular',
    features: [
      'Everything in Seeker',
      'Weekly Cosmic Synthesis report',
      'Full numerology suite (Soul Urge, Destiny, Personal Year, Karmic Debt)',
      'Angel Oracle readings (unlimited)',
      'Cosmic Tarot (full deck)',
      'Soul Twin Radar (advanced matching)',
      'Angel Circles (join unlimited)',
      'Vision Board (unlimited items)',
      'Truth Score verification badge',
      'Manifestation tracker',
      'Streak rewards & badges (30)',
      'Export journal as PDF',
    ],
    locked: [],
    cta: 'Start 7-Day Free Trial',
    current: false,
  },
  {
    id: 'twin-flame',
    name: 'Twin Flame',
    price: '$9.99',
    priceMonthly: 9.99,
    color: '#f472b6',
    emoji: '🔥',
    description: 'The complete spiritual companion',
    features: [
      'Everything in Mystic',
      'AI Angel Advisor (coming soon)',
      'Shared Journal Peek with matches',
      'Create private Angel Circles',
      'Priority soul matching algorithm',
      'Compatibility deep-dive reports',
      'Personalized ritual generator',
      'Advanced dream interpretation',
      'Cosmic Calendar with personal transits',
      'Early access to new features',
      'Direct support from founders',
    ],
    locked: [],
    cta: 'Start 7-Day Free Trial',
    current: false,
  },
]

const FEATURE_HIGHLIGHTS = [
  { emoji:'📋', title:'Weekly Cosmic Synthesis', desc:'Every Sunday, receive a personalized report combining your logged numbers, numerology transits, moon phase, and angel messages into one beautiful cosmic overview.', plan:'Mystic' },
  { emoji:'👥', title:'Soul Twin Radar', desc:'Advanced matching algorithm finds souls seeing the same numbers as you, with compatibility scores based on numerology overlap, timing, and number harmony.', plan:'Mystic' },
  { emoji:'🤖', title:'AI Angel Advisor', desc:'Ask your personal AI guide anything — angel number meanings, relationship guidance, life decisions. Powered by your unique numerology profile.', plan:'Twin Flame' },
  { emoji:'📖', title:'Shared Journal Peek', desc:'With mutual consent, share one journal entry with a soul match. A sacred window into each other’s spiritual journey.', plan:'Twin Flame' },
  { emoji:'⭕', title:'Private Angel Circles', desc:'Create your own private circle for your spiritual community, family, or friend group. Invite-only sacred space.', plan:'Twin Flame' },
  { emoji:'🔮', title:'Unlimited Oracle Readings', desc:'Channel messages from your guides anytime. Each reading is personalized to your current angel numbers and numerology cycle.', plan:'Mystic' },
]

export default function UpgradePage() {
  const [billing, setBilling] = useState<'monthly'|'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string|null>(null)

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'600px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      {/* Header */}
      <div style={{textAlign:'center',marginBottom:'2rem'}}>
        <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>✦</div>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'2rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.5rem',fontWeight:400}}>Unlock Your Full Cosmic Potential</h1>
        <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.88rem',margin:'0 0 1.25rem',lineHeight:1.6}}>The universe is sending you signs. Get the tools to decode them fully.</p>

        {/* Billing toggle */}
        <div style={{display:'inline-flex',background:'rgba(200,180,255,0.05)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'9999px',padding:'0.25rem',gap:'0.25rem'}}>
          <button onClick={()=>setBilling('monthly')} style={{padding:'0.35rem 1rem',borderRadius:'9999px',border:'none',background:billing==='monthly'?'rgba(167,139,250,0.2)':'transparent',color:billing==='monthly'?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.78rem',cursor:'pointer',transition:'all 0.2s'}}>Monthly</button>
          <button onClick={()=>setBilling('yearly')} style={{padding:'0.35rem 1rem',borderRadius:'9999px',border:'none',background:billing==='yearly'?'rgba(167,139,250,0.2)':'transparent',color:billing==='yearly'?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.78rem',cursor:'pointer',transition:'all 0.2s',display:'flex',alignItems:'center',gap:'0.35rem'}}>
            Yearly <span style={{background:'rgba(74,222,128,0.15)',border:'1px solid rgba(74,222,128,0.2)',color:'#4ade80',fontSize:'0.62rem',padding:'0.1rem 0.35rem',borderRadius:'9999px'}}>Save 30%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div style={{display:'flex',flexDirection:'column',gap:'0.875rem',marginBottom:'2rem'}}>
        {PLANS.map(plan=>{
          const yearlyPrice = plan.priceMonthly > 0 ? (plan.priceMonthly * 12 * 0.7 / 12).toFixed(2) : '0'
          const displayPrice = billing==='yearly' && plan.priceMonthly > 0 ? '$'+yearlyPrice : plan.price
          const isSelected = selectedPlan === plan.id

          return (
            <div key={plan.id} onClick={()=>!plan.current&&setSelectedPlan(plan.id)}
              style={{...card,padding:'1.25rem',borderColor:isSelected?plan.color+'40':plan.current?plan.color+'20':'rgba(200,180,255,0.08)',background:isSelected?'linear-gradient(135deg,'+plan.color+'08,rgba(8,6,28,0.95))':plan.current?'rgba(8,6,28,0.88)':'rgba(8,6,28,0.88)',cursor:plan.current?'default':'pointer',transition:'all 0.2s',position:'relative',overflow:'hidden'}}>

              {plan.badge && (
                <div style={{position:'absolute',top:'1rem',right:'1rem',background:'linear-gradient(135deg,'+plan.color+','+plan.color+'aa)',color:'white',fontSize:'0.62rem',fontWeight:700,padding:'0.2rem 0.5rem',borderRadius:'9999px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{plan.badge}</div>
              )}

              <div style={{display:'flex',alignItems:'flex-start',gap:'0.875rem',marginBottom:'0.875rem'}}>
                <div style={{width:'44px',height:'44px',borderRadius:'0.875rem',background:plan.color+'12',border:'1px solid '+plan.color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.3rem',flexShrink:0}}>{plan.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{display:'flex',alignItems:'baseline',gap:'0.5rem',marginBottom:'0.15rem'}}>
                    <span style={{color:'rgba(220,200,255,0.9)',fontSize:'1rem',fontWeight:700}}>{plan.name}</span>
                    <span style={{color:plan.color,fontSize:'1.2rem',fontWeight:700}}>{displayPrice}</span>
                    {plan.priceMonthly > 0 && <span style={{color:'rgba(180,160,255,0.35)',fontSize:'0.72rem'}}>/mo</span>}
                  </div>
                  <div style={{color:'rgba(180,160,255,0.45)',fontSize:'0.78rem'}}>{plan.description}</div>
                </div>
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:'0.3rem',marginBottom:'1rem'}}>
                {plan.features.slice(0,plan.current?5:6).map((f,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'flex-start',gap:'0.5rem'}}>
                    <span style={{color:plan.color,fontSize:'0.75rem',marginTop:'0.1rem',flexShrink:0}}>✓</span>
                    <span style={{color:'rgba(200,180,255,0.6)',fontSize:'0.78rem',lineHeight:1.4}}>{f}</span>
                  </div>
                ))}
                {plan.features.length > 6 && (
                  <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.72rem',marginTop:'0.15rem'}}>+{plan.features.length-6} more features</div>
                )}
              </div>

              <button style={{width:'100%',padding:'0.625rem',borderRadius:'0.875rem',border:plan.current?'1px solid rgba(200,180,255,0.12)':'none',background:plan.current?'transparent':isSelected?'linear-gradient(135deg,'+plan.color+','+plan.color+'bb)':'linear-gradient(135deg,'+plan.color+'60,'+plan.color+'40)',color:plan.current?'rgba(180,160,255,0.4)':isSelected?'white':'rgba(220,200,255,0.8)',fontSize:'0.85rem',fontWeight:600,cursor:plan.current?'default':'pointer'}}>
                {plan.current ? 'Current Plan' : plan.cta}
              </button>
            </div>
          )
        })}
      </div>

      {/* Feature highlights */}
      <div style={{marginBottom:'2rem'}}>
        <h2 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.3rem',color:'rgba(220,200,255,0.8)',margin:'0 0 1rem',fontWeight:400,textAlign:'center'}}>What You Unlock</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
          {FEATURE_HIGHLIGHTS.map((f,i)=>(
            <div key={i} style={{...card,padding:'0.875rem'}}>
              <div style={{fontSize:'1.3rem',marginBottom:'0.35rem'}}>{f.emoji}</div>
              <div style={{color:'rgba(220,200,255,0.8)',fontSize:'0.82rem',fontWeight:600,marginBottom:'0.25rem'}}>{f.title}</div>
              <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.7rem',lineHeight:1.5,marginBottom:'0.4rem'}}>{f.desc}</div>
              <span style={{fontSize:'0.62rem',padding:'0.15rem 0.4rem',borderRadius:'9999px',background:f.plan==='Twin Flame'?'rgba(244,114,182,0.1)':'rgba(201,168,76,0.1)',border:f.plan==='Twin Flame'?'1px solid rgba(244,114,182,0.2)':'1px solid rgba(201,168,76,0.2)',color:f.plan==='Twin Flame'?'#f472b6':'#c9a84c'}}>{f.plan}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust signals */}
      <div style={{...card,padding:'1.25rem',textAlign:'center',marginBottom:'1.25rem'}}>
        <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Our Promise</div>
        <div style={{display:'flex',justifyContent:'space-around',gap:'0.5rem'}}>
          {[['🔒','Secure','Your data is always private'],['↩️','Cancel anytime','No questions asked'],['7','Day free trial','Try before you commit']].map(([e,t,d])=>(
            <div key={t as string} style={{flex:1}}>
              <div style={{fontSize:'1.3rem',marginBottom:'0.25rem'}}>{e}</div>
              <div style={{color:'rgba(220,200,255,0.7)',fontSize:'0.75rem',fontWeight:600,marginBottom:'0.15rem'}}>{t}</div>
              <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.65rem',lineHeight:1.4}}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      <p style={{color:'rgba(180,160,255,0.25)',fontSize:'0.72rem',textAlign:'center'}}>Payments processed securely via Stripe. Cancel anytime from settings.</p>
    </div>
  )
}
