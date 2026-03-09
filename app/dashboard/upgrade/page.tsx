'use client'
import { useState } from 'react'
import Link from 'next/link'

const TIERS = [
  {
    id: 'free',
    name: 'Seeker',
    price: 'Free',
    period: '',
    emoji: '✦',
    color: 'rgba(180,160,255,0.6)',
    border: 'rgba(200,180,255,0.15)',
    features: [
      'Angel Number Logger (unlimited)',
      'Thought Anchor Journal',
      'Basic Numerology Profile',
      'Daily Guidance',
      'Moon Phase Tracker',
      'Breathwork Timer',
      'Solfeggio Frequencies',
      'Crystal Guide',
      'Daily Tarot Card',
      'Sync Matching (3 matches/day)',
    ],
    cta: 'Current Plan',
    ctaDisabled: true,
  },
  {
    id: 'star',
    name: 'Star Child',
    price: '$6.99',
    period: '/month',
    emoji: '⭐',
    color: '#a78bfa',
    border: 'rgba(167,139,250,0.4)',
    badge: 'Popular',
    features: [
      'Everything in Seeker',
      'Unlimited Sync Matching',
      'Weekly Cosmic Synthesis Report',
      'Angel Number Oracle (full spreads)',
      'Vision Board (unlimited items)',
      'Manifestation Tracker',
      'Chakra Alignment Guide',
      'Ritual Library (all rituals)',
      'Guided Meditations (all 6)',
      'Compatibility Calculator',
      'Profile Card (shareable)',
      'Soul Twin Radar',
      'Badges & Milestones',
      'Priority matching',
    ],
    cta: 'Start 7-Day Free Trial',
    ctaDisabled: false,
  },
  {
    id: 'twin',
    name: 'Twin Flame',
    price: '$9.99',
    period: '/month',
    emoji: '🔥',
    color: '#c9a84c',
    border: 'rgba(201,168,76,0.5)',
    badge: 'Best Value',
    features: [
      'Everything in Star Child',
      'AI Angel Advisor (coming soon)',
      'Soul Twin Private Chat',
      'Shared Journal Peek (with matches)',
      'Dream Oracle Interpretations',
      'Personal Year Cycle Readings',
      'Karmic Debt Number Analysis',
      'Angel Circles (private groups)',
      'Number Ritual Guides',
      'Early access to new features',
      'Export full spiritual journal (PDF)',
    ],
    cta: 'Start 7-Day Free Trial',
    ctaDisabled: false,
  },
]

const FAQS = [
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from Settings. Your data is always yours.' },
  { q: 'Is my journal private?', a: 'Completely. Your thoughts and logs are stored locally and never shared without your explicit consent.' },
  { q: 'When does AI Advisor launch?', a: 'We are integrating AI guidance in the next major update. Twin Flame members get first access.' },
  { q: 'What payment methods are accepted?', a: 'All major credit cards, Apple Pay, and Google Pay via Stripe.' },
]

export default function UpgradePage() {
  const [faq, setFaq] = useState<number | null>(null)
  const [annual, setAnnual] = useState(false)

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.5rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👑</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.5rem', fontWeight: 400 }}>Unlock Your Full Cosmic Potential</h1>
        <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.88rem', margin: '0 0 1.25rem' }}>Deepen your spiritual practice with premium tools and real-time soul matching</p>
        {/* Annual toggle */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '2rem', padding: '0.4rem 1rem', border: '1px solid rgba(200,180,255,0.1)' }}>
          <span style={{ color: annual ? 'rgba(180,160,255,0.4)' : 'rgba(220,200,255,0.85)', fontSize: '0.8rem' }}>Monthly</span>
          <div
            onClick={() => setAnnual(a => !a)}
            style={{ width: '2.5rem', height: '1.4rem', borderRadius: '1rem', background: annual ? '#a78bfa' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
          >
            <div style={{ position: 'absolute', top: '2px', left: annual ? '1.2rem' : '2px', width: '1rem', height: '1rem', borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
          </div>
          <span style={{ color: annual ? 'rgba(220,200,255,0.85)' : 'rgba(180,160,255,0.4)', fontSize: '0.8rem' }}>Annual <span style={{ color: '#4ade80', fontSize: '0.7rem' }}>Save 30%</span></span>
        </div>
      </div>

      {/* Tier cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {TIERS.map(tier => (
          <div key={tier.id} style={{ ...card, border: `1px solid ${tier.border}`, padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
            {tier.badge && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: tier.id === 'twin' ? 'rgba(201,168,76,0.2)' : 'rgba(167,139,250,0.2)', border: `1px solid ${tier.border}`, borderRadius: '2rem', padding: '0.2rem 0.6rem', fontSize: '0.65rem', color: tier.color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{tier.badge}</div>
            )}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.8rem' }}>{tier.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: tier.color, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{tier.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginTop: '0.2rem' }}>
                  <span style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1.6rem', fontWeight: 700 }}>
                    {tier.price === 'Free' ? 'Free' : annual ? `$${(parseFloat(tier.price.slice(1)) * 0.7).toFixed(2)}` : tier.price}
                  </span>
                  {tier.period && <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.8rem' }}>{annual ? '/month, billed annually' : tier.period}</span>}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
              {tier.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: tier.color, fontSize: '0.75rem', marginTop: '0.1rem', flexShrink: 0 }}>✓</span>
                  <span style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.8rem', lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
            <button
              disabled={tier.ctaDisabled}
              style={{
                width: '100%', padding: '0.85rem', borderRadius: '0.875rem', border: 'none', cursor: tier.ctaDisabled ? 'default' : 'pointer',
                background: tier.ctaDisabled ? 'rgba(255,255,255,0.05)' : tier.id === 'twin' ? 'linear-gradient(135deg, #c9a84c, #e8c96a)' : 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                color: tier.ctaDisabled ? 'rgba(180,160,255,0.3)' : tier.id === 'twin' ? '#1a1000' : 'white',
                fontSize: '0.88rem', fontWeight: 600, letterSpacing: '0.03em',
                transition: 'opacity 0.2s',
              }}
            >{tier.cta}</button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Frequently Asked</div>
        {FAQS.map((item, i) => (
          <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid rgba(200,180,255,0.07)' : 'none', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
            <button
              onClick={() => setFaq(faq === i ? null : i)}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}
            >
              <span style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', textAlign: 'left' }}>{item.q}</span>
              <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '1rem', transition: 'transform 0.2s', transform: faq === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {faq === i && <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.8rem', margin: '0.5rem 0 0', lineHeight: 1.6 }}>{item.a}</p>}
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: 'rgba(180,160,255,0.3)', fontSize: '0.72rem' }}>Secure payments via Stripe · Cancel anytime · No hidden fees</p>
    </div>
  )
}
