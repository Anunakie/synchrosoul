'use client'
import { useState } from 'react'
import Link from 'next/link'

const PLANS = [
  {
    id: 'free',
    name: 'Seeker',
    price: 'Free',
    period: 'forever',
    emoji: '✦',
    color: '#94a3b8',
    description: 'Begin your angel number journey',
    features: [
      'Angel number logging (unlimited)',
      'Thought anchor journal',
      'Basic numerology profile',
      'Angel number dictionary',
      'Daily guidance feed',
      'Cosmic feed & profile',
      '3 oracle card draws/day',
    ],
    cta: 'Current Plan',
    current: true,
  },
  {
    id: 'awakened',
    name: 'Awakened',
    price: '$6.99',
    period: '/month',
    emoji: '✨',
    color: '#a78bfa',
    description: 'Deepen your spiritual practice',
    popular: true,
    features: [
      'Everything in Seeker',
      'Weekly Cosmic Synthesis report',
      'Full tarot & oracle access',
      'Dream journal with AI meanings',
      'Chakra alignment tracker',
      'Solfeggio frequency player',
      'Moon phase rituals',
      'Breathwork sessions',
      'Vision board (unlimited)',
      'Manifestation tracker',
      'Gratitude journal with streaks',
      'Deep numerology reading',
    ],
    cta: 'Start 7-Day Free Trial',
  },
  {
    id: 'twin-flame',
    name: 'Twin Flame',
    price: '$9.99',
    period: '/month',
    emoji: '🔥',
    color: '#c9a84c',
    description: 'The complete soul alignment experience',
    features: [
      'Everything in Awakened',
      'AI Angel Oracle (unlimited)',
      'Soul Twin Radar (real-time)',
      'Soul Compatibility reports',
      'Private Angel Circles (groups)',
      'Shared journal peek with matches',
      'Priority sync matching',
      'Cosmic profile card (shareable)',
      'Karmic debt number analysis',
      'Personal year cycle forecast',
      'Angel number ritual guides',
      'Early access to new features',
    ],
    cta: 'Start 7-Day Free Trial',
  },
]

const TESTIMONIALS = [
  { name: 'Luna M.', lp: 7, text: 'The Weekly Synthesis showed me I was seeing 1111 every time I thought about leaving my job. I finally did it. Best decision ever.', emoji: '🌙' },
  { name: 'Orion K.', lp: 11, text: 'Soul Twin Radar connected me with someone seeing the exact same numbers. We have been talking every day for 3 months.', emoji: '✨' },
  { name: 'Sage R.', lp: 3, text: 'The AI Oracle gave me a reading that made me cry. It knew exactly what I needed to hear about my twin flame journey.', emoji: '🌿' },
]

export default function UpgradePage() {
  const [billing, setBilling] = useState<'monthly'|'annual'>('monthly')
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.5rem', fontWeight: 400 }}>Unlock Your Full Cosmic Potential</h1>
        <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.9rem', margin: '0 0 1.25rem', lineHeight: 1.6 }}>Join thousands of souls using angel numbers to navigate their highest path</p>
        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem', padding: '0.25rem', border: '1px solid rgba(200,180,255,0.1)' }}>
          {(['monthly','annual'] as const).map(b => (
            <button key={b} onClick={() => setBilling(b)} style={{ padding: '0.4rem 1.25rem', borderRadius: '2rem', border: 'none', background: billing === b ? 'rgba(167,139,250,0.3)' : 'transparent', color: billing === b ? '#a78bfa' : 'rgba(180,160,255,0.4)', fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s' }}>
              {b}{b === 'annual' && <span style={{ color: '#34d399', fontSize: '0.65rem', marginLeft: '0.3rem' }}>-20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{ ...card, padding: '1.5rem', borderColor: plan.popular ? plan.color+'44' : plan.id === 'twin-flame' ? plan.color+'33' : 'rgba(200,180,255,0.12)', position: 'relative', overflow: 'hidden' }}>
            {plan.popular && <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(167,139,250,0.25)', border: '1px solid rgba(167,139,250,0.4)', borderRadius: '2rem', padding: '0.2rem 0.6rem', color: '#a78bfa', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Most Popular</div>}
            {plan.id === 'twin-flame' && <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '2rem', padding: '0.2rem 0.6rem', color: '#c9a84c', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Best Value</div>}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.875rem', background: plan.color+'18', border: '1px solid '+plan.color+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{plan.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.15rem' }}>{plan.name}</div>
                <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem' }}>{plan.description}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: plan.color, fontSize: '1.4rem', fontWeight: 700 }}>
                  {plan.price === 'Free' ? 'Free' : billing === 'annual' ? '$' + (parseFloat(plan.price.replace('$','')) * 0.8).toFixed(2) : plan.price}
                </div>
                <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.65rem' }}>{plan.period}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: plan.color, fontSize: '0.7rem', flexShrink: 0 }}>✦</span>
                  <span style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.8rem' }}>{f}</span>
                </div>
              ))}
            </div>
            <button disabled={plan.current} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.875rem', background: plan.current ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, '+plan.color+'44, '+plan.color+'22)', border: '1px solid '+(plan.current ? 'rgba(200,180,255,0.1)' : plan.color+'44'), color: plan.current ? 'rgba(180,160,255,0.3)' : 'rgba(220,200,255,0.9)', fontSize: '0.9rem', cursor: plan.current ? 'default' : 'pointer', fontWeight: 600, letterSpacing: '0.03em' }}>{plan.cta}</button>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center', marginBottom: '1rem' }}>What Awakened Souls Are Saying</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ ...card, padding: '1.1rem 1.25rem' }}>
              <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', margin: '0 0 0.625rem', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>&ldquo;{t.text}&rdquo;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1rem' }}>{t.emoji}</span>
                <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem' }}>{t.name}</span>
                <span style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.7rem' }}>· Life Path {t.lp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ textAlign: 'center', color: 'rgba(180,160,255,0.25)', fontSize: '0.72rem' }}>Cancel anytime · Secure payment · 7-day free trial on all paid plans</p>
    </div>
  )
}