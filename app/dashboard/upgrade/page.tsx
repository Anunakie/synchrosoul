'use client'
import { useState } from 'react'

const TIERS = [
  {
    id: 'free',
    name: 'Seeker',
    price: 0,
    emoji: '🌱',
    color: '#60a5fa',
    description: 'Begin your cosmic journey',
    features: [
      'Angel number logging (unlimited)',
      'Thought Anchor Journal',
      'Basic numerology profile',
      'Dream journal',
      'Daily guidance',
      'Cosmic feed (read only)',
      '3 affirmations per day',
    ],
    cta: 'Current Plan',
    disabled: true,
  },
  {
    id: 'awakened',
    name: 'Awakened',
    price: 6.99,
    emoji: '✨',
    color: '#a78bfa',
    description: 'Deepen your practice',
    popular: true,
    features: [
      'Everything in Seeker',
      'Truth Score + screenshot verification',
      'Soul Twin Radar (full access)',
      'Unlimited affirmations',
      'Weekly Cosmic Synthesis report',
      'Vision Board (unlimited cards)',
      'Manifestation Tracker',
      'Angel Number Oracle',
      'Cosmic Calendar',
      'Profile Card sharing',
    ],
    cta: 'Start 7-Day Free Trial',
    disabled: false,
  },
  {
    id: 'twin_flame',
    name: 'Twin Flame',
    price: 9.99,
    emoji: '🔥',
    color: '#ff6b9d',
    description: 'The full cosmic experience',
    features: [
      'Everything in Awakened',
      'AI Angel Oracle (coming soon)',
      'Soul Compatibility Reports',
      'Shared Journal with matches',
      'Private Angel Circles (groups)',
      'Priority matching algorithm',
      'Cosmic Rituals library',
      'Guided meditations',
      'Early access to new features',
      'Direct message matched souls',
    ],
    cta: 'Start 7-Day Free Trial',
    disabled: false,
  },
]

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes, cancel anytime from your settings. Your access continues until the end of your billing period.' },
  { q: 'What is the Truth Score?', a: 'Upload a screenshot of your angel number sighting to earn an Angel Approved badge, boosting your sync score with matches.' },
  { q: 'When is the AI Oracle coming?', a: 'The AI Angel Oracle is in development and will be available to Twin Flame members first when it launches.' },
  { q: 'Is my journal private?', a: 'Yes, 100% private. You choose what to share. Shared journal entries require explicit opt-in per entry.' },
]

export default function UpgradePage() {
  const [billing, setBilling] = useState<'monthly'|'yearly'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const discount = 0.2 // 20% yearly discount

  function getPrice(price: number) {
    if (price === 0) return 'Free'
    const p = billing === 'yearly' ? price * (1 - discount) : price
    return '$' + p.toFixed(2)
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✦</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.5rem', fontWeight: 400 }}>Unlock Your Full Potential</h1>
        <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>Choose the plan that matches your cosmic journey</p>

        {/* Billing toggle */}
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '2rem', padding: '0.25rem', gap: '0.25rem' }}>
          {(['monthly','yearly'] as const).map(b => (
            <button key={b} onClick={() => setBilling(b)} style={{ padding: '0.4rem 1.25rem', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'inherit', background: billing === b ? 'rgba(167,139,250,0.25)' : 'transparent', border: billing === b ? '1px solid rgba(167,139,250,0.4)' : '1px solid transparent', color: billing === b ? 'rgba(220,200,255,0.95)' : 'rgba(180,160,255,0.5)', transition: 'all 0.2s' }}>
              {b === 'monthly' ? 'Monthly' : 'Yearly'}
              {b === 'yearly' && <span style={{ marginLeft: '0.4rem', padding: '0.1rem 0.4rem', borderRadius: '2rem', background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', fontSize: '0.65rem' }}>-20%</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tier cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {TIERS.map(tier => (
          <div key={tier.id} style={{ ...card, padding: '1.75rem', border: tier.popular ? `1px solid ${tier.color}55` : tier.id === 'twin_flame' ? `1px solid ${tier.color}44` : '1px solid rgba(200,180,255,0.1)', position: 'relative', overflow: 'hidden' }}>
            {tier.popular && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.2rem 0.75rem', borderRadius: '2rem', background: `${tier.color}22`, border: `1px solid ${tier.color}55`, color: tier.color, fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Most Popular</div>
            )}
            {/* Glow */}
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '180px', height: '180px', borderRadius: '50%', background: `radial-gradient(circle, ${tier.color}12 0%, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '2rem', lineHeight: 1 }}>{tier.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                  <span style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1.2rem', fontWeight: 700 }}>{tier.name}</span>
                  <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem' }}>{tier.description}</span>
                </div>
                <div style={{ marginTop: '0.4rem' }}>
                  <span style={{ color: tier.color, fontSize: '1.8rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{getPrice(tier.price)}</span>
                  {tier.price > 0 && <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem', marginLeft: '0.3rem' }}>/ {billing === 'yearly' ? 'mo, billed yearly' : 'month'}</span>}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {tier.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <span style={{ color: tier.color, fontSize: '0.7rem', marginTop: '0.15rem', flexShrink: 0 }}>✦</span>
                  <span style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.75rem', lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>

            <button
              disabled={tier.disabled}
              style={{ width: '100%', padding: '0.9rem', borderRadius: '0.75rem', cursor: tier.disabled ? 'default' : 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', fontWeight: 600, background: tier.disabled ? 'rgba(255,255,255,0.04)' : `${tier.color}22`, border: tier.disabled ? '1px solid rgba(200,180,255,0.1)' : `1px solid ${tier.color}55`, color: tier.disabled ? 'rgba(180,160,255,0.3)' : tier.color, transition: 'all 0.2s' }}
            >{tier.cta}</button>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {[
          { emoji: '🔒', label: 'Secure', desc: 'End-to-end encrypted' },
          { emoji: '↩', label: 'Cancel Anytime', desc: 'No lock-in contracts' },
          { emoji: '✦', label: '7-Day Trial', desc: 'Risk-free start' },
        ].map(b => (
          <div key={b.label} style={{ ...card, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>{b.emoji}</div>
            <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.75rem', fontWeight: 600 }}>{b.label}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', marginTop: '0.15rem' }}>{b.desc}</div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'rgba(220,200,255,0.85)', margin: '0 0 1rem', fontWeight: 400 }}>Frequently Asked Questions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ ...card, overflow: 'hidden' }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontFamily: 'inherit' }}>
              <span style={{ color: 'rgba(200,180,255,0.85)', fontSize: '0.85rem', textAlign: 'left' }}>{faq.q}</span>
              <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.8rem', flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
            </button>
            {openFaq === i && (
              <div style={{ padding: '0 1.25rem 1rem', color: 'rgba(180,160,255,0.65)', fontSize: '0.82rem', lineHeight: 1.6 }}>{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
