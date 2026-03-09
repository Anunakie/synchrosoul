'use client'
import { useState } from 'react'

const PLANS = [
  {
    id: 'free',
    name: 'Seeker',
    price: 'Free',
    period: 'forever',
    emoji: '🌱',
    color: '#94a3b8',
    border: 'rgba(148,163,184,0.2)',
    features: [
      'Angel number logger (unlimited)',
      'Thought anchor journal',
      'Basic numerology profile',
      'Dream journal (7 entries)',
      'Daily guidance message',
      'Moon phase calendar',
      'Breathwork & meditations',
      'Community cosmic feed',
    ],
    cta: 'Current Plan',
    disabled: true,
  },
  {
    id: 'mystic',
    name: 'Mystic',
    price: '$6.99',
    period: 'per month',
    emoji: '✨',
    color: '#a78bfa',
    border: 'rgba(167,139,250,0.4)',
    popular: true,
    features: [
      'Everything in Seeker',
      'Weekly Cosmic Synthesis report',
      'Angel Number Oracle readings',
      'Full dream journal (unlimited)',
      'Gratitude streak tracking',
      'Crystal & chakra deep guides',
      'Solfeggio frequency library',
      'Tarot daily draws (unlimited)',
      'Vision board (unlimited items)',
      'Manifestation tracker',
      'Shareable soul profile card',
      'Numerology deep dive',
    ],
    cta: 'Start 7-Day Free Trial',
    disabled: false,
  },
  {
    id: 'twin',
    name: 'Twin Flame',
    price: '$9.99',
    period: 'per month',
    emoji: '🔥',
    color: '#f472b6',
    border: 'rgba(244,114,182,0.4)',
    features: [
      'Everything in Mystic',
      'Soul Twin Radar — live matching',
      'Shared journal peek with matches',
      'Private Angel Circles (groups)',
      'Compatibility deep reports',
      'Karmic debt analysis',
      'Personal year forecasts',
      'Priority sync matching',
      'AI Oracle (coming soon)',
      'Exclusive Twin Flame rituals',
      'Early access to new features',
      'Remove all ads forever',
    ],
    cta: 'Start 7-Day Free Trial',
    disabled: false,
  },
]

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from your settings. No questions asked, no hidden fees.' },
  { q: 'What happens after the free trial?', a: 'You will be charged at the end of your 7-day trial. We will send a reminder 24 hours before.' },
  { q: 'Is my data private?', a: 'Absolutely. Your journal entries, dreams, and thoughts are 100% private unless you choose to share them.' },
  { q: 'Do you offer refunds?', a: 'Yes — if you are not satisfied within 14 days of your first charge, we will refund you in full.' },
  { q: 'When is the AI Oracle coming?', a: 'We are integrating AI-powered oracle readings in Q2 2025. Twin Flame members get first access.' },
]

export default function UpgradePage() {
  const [faq, setFaq] = useState<number | null>(null)
  const [billing, setBilling] = useState<'monthly'|'annual'>('monthly')
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', backdropFilter: 'blur(16px)', padding: '1.75rem' }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✦</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.5rem', fontWeight: 400 }}>Unlock Your Full Path</h1>
        <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 1.25rem' }}>Deepen your spiritual practice with premium tools designed to align you with your highest self.</p>
        <div style={{ display: 'inline-flex', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '2rem', padding: '0.25rem' }}>
          {(['monthly', 'annual'] as const).map(b => (
            <button key={b} onClick={() => setBilling(b)} style={{ padding: '0.4rem 1.25rem', borderRadius: '2rem', border: 'none', background: billing === b ? 'rgba(167,139,250,0.2)' : 'transparent', color: billing === b ? '#a78bfa' : 'rgba(180,160,255,0.4)', fontSize: '0.78rem', cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.04em' }}>
              {b}{b === 'annual' ? ' (save 20%)' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{ ...card, border: plan.popular ? '1px solid ' + plan.border : '1px solid rgba(200,180,255,0.1)', position: 'relative', overflow: 'hidden' }}>
            {plan.popular && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: plan.color + '20', border: '1px solid ' + plan.color + '40', borderRadius: '2rem', padding: '0.2rem 0.75rem', color: plan.color, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Most Popular</div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '2rem', lineHeight: 1 }}>{plan.emoji}</div>
              <div>
                <h2 style={{ color: plan.color, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', margin: '0 0 0.15rem', fontWeight: 400 }}>{plan.name}</h2>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                  <span style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1.5rem', fontWeight: 700 }}>
                    {plan.price === 'Free' ? plan.price : billing === 'annual' ? '$' + (parseFloat(plan.price.slice(1)) * 0.8).toFixed(2) : plan.price}
                  </span>
                  {plan.price !== 'Free' && <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem' }}>{plan.period}</span>}
                </div>
              </div>
            </div>
            <ul style={{ margin: '0 0 1.25rem', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {plan.features.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'rgba(200,180,255,0.7)', fontSize: '0.82rem', lineHeight: 1.4 }}>
                  <span style={{ color: plan.color, flexShrink: 0, marginTop: '0.05rem' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button disabled={plan.disabled} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.875rem', border: plan.disabled ? '1px solid rgba(200,180,255,0.1)' : '1px solid ' + plan.border, background: plan.disabled ? 'transparent' : plan.color + '18', color: plan.disabled ? 'rgba(180,160,255,0.3)' : plan.color, fontSize: '0.88rem', cursor: plan.disabled ? 'default' : 'pointer', letterSpacing: '0.03em', transition: 'all 0.2s' }}>
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
        {['🔒 Secure Payment', '↩️ 14-Day Refund', '✕ Cancel Anytime'].map(b => (
          <span key={b} style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem' }}>{b}</span>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', color: 'rgba(220,200,255,0.8)', margin: '0 0 1rem', fontWeight: 400, textAlign: 'center' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {FAQS.map((f, i) => (
            <div key={i} style={{ background: 'rgba(8,6,28,0.75)', border: '1px solid rgba(200,180,255,0.08)', borderRadius: '0.875rem', overflow: 'hidden' }}>
              <button onClick={() => setFaq(faq === i ? null : i)} style={{ width: '100%', padding: '0.875rem 1rem', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.85rem' }}>{f.q}</span>
                <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem', transform: faq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: '0.5rem' }}>▾</span>
              </button>
              {faq === i && (
                <div style={{ padding: '0 1rem 0.875rem', color: 'rgba(180,160,255,0.55)', fontSize: '0.82rem', lineHeight: 1.6 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
