
'use client'
import { useState, useEffect } from 'react'
import { getSubscriptionStatus, SubscriptionStatus } from '@/lib/subscription'

const PLANS = [
  {
    id: 'free',
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
      'Angel Number Dictionary',
      'Gratitude practice',
      'Vision Board (6 items)',
      'Cosmic Feed & profile',
      '3 background themes',
    ],
    cta: 'Current Plan',
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
    cta: 'Start 7-Day Free Trial',
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
    cta: 'Start 7-Day Free Trial',
  },
]

export default function UpgradePage() {
  const [sub, setSub] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    getSubscriptionStatus().then(setSub)
    // Check URL params for success/cancel
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      const plan = params.get('plan') || 'premium'
      setMessage({ type: 'success', text: `Welcome to ${plan === 'twin-flame' ? 'Twin Flame' : 'Mystic'}! Your 7-day free trial has started. ✨` })
      window.history.replaceState({}, '', '/dashboard/upgrade')
    } else if (params.get('canceled') === 'true') {
      setMessage({ type: 'error', text: 'Checkout was canceled. Your plan has not changed.' })
      window.history.replaceState({}, '', '/dashboard/upgrade')
    }
  }, [])

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') return
    setLoading(planId)
    try {
      const res = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, returnUrl: window.location.origin }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to start checkout. Please try again.' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setLoading(null)
    }
  }

  const handlePortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnUrl: window.location.origin + '/dashboard/upgrade' }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else setMessage({ type: 'error', text: data.error || 'Could not open billing portal.' })
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setPortalLoading(false)
    }
  }

  const currentTier = sub?.tier || 'free'

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✨</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Choose Your Cosmic Path
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>
          Unlock deeper spiritual tools and real-time soul connections
        </p>
        {sub && sub.tier !== 'free' && (
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)',
              borderRadius: '12px', padding: '0.75rem 1.5rem', color: '#c9a84c',
            }}>
              <strong>Current Plan:</strong> {sub.tier === 'twin-flame' ? '🔥 Twin Flame' : '✨ Mystic'}
              {sub.status === 'trialing' && ' (Free Trial)'}
              {sub.currentPeriodEnd && (
                <span style={{ marginLeft: '0.5rem', opacity: 0.7, fontSize: '0.85rem' }}>
                  {sub.cancelAtPeriodEnd ? 'Cancels' : 'Renews'} {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                </span>
              )}
            </div>
            <button onClick={handlePortal} disabled={portalLoading} style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px', padding: '0.75rem 1.5rem', color: '#fff',
              cursor: 'pointer', fontSize: '0.9rem',
            }}>
              {portalLoading ? 'Opening...' : '📋 Manage Billing'}
            </button>
          </div>
        )}
      </div>

      {/* Message banner */}
      {message && (
        <div style={{
          background: message.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
          borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '2rem',
          color: message.type === 'success' ? '#4ade80' : '#f87171', textAlign: 'center',
        }}>
          {message.text}
        </div>
      )}

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {PLANS.map((plan) => {
          const isCurrent = currentTier === plan.id
          const isUpgrade = plan.priceMonthly > 0 && !isCurrent
          const isLoading = loading === plan.id

          return (
            <div key={plan.id} style={{
              background: 'rgba(8,6,28,0.85)',
              border: `2px solid ${isCurrent ? plan.color : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '20px', padding: '2rem',
              position: 'relative', backdropFilter: 'blur(20px)',
              boxShadow: isCurrent ? `0 0 30px ${plan.color}33` : 'none',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}>
              {plan.badge && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: `linear-gradient(135deg, ${plan.color}, #f472b6)`,
                  color: '#fff', fontSize: '0.75rem', fontWeight: 700,
                  padding: '0.25rem 1rem', borderRadius: '999px', whiteSpace: 'nowrap',
                }}>
                  {plan.badge}
                </div>
              )}
              {isCurrent && (
                <div style={{
                  position: 'absolute', top: '-12px', right: '1.5rem',
                  background: plan.color, color: '#000', fontSize: '0.7rem', fontWeight: 700,
                  padding: '0.25rem 0.75rem', borderRadius: '999px',
                }}>
                  ✓ Active
                </div>
              )}

              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{plan.emoji}</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: plan.color, marginBottom: '0.25rem' }}>
                {plan.name}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {plan.description}
              </p>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>{plan.price}</span>
                {plan.priceMonthly > 0 && (
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>/month</span>
                )}
                {plan.priceMonthly > 0 && (
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    7-day free trial, then billed monthly
                  </div>
                )}
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {plan.features.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                    <span style={{ color: plan.color, flexShrink: 0, marginTop: '0.1rem' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => isUpgrade ? handleUpgrade(plan.id) : undefined}
                disabled={isCurrent || isLoading}
                style={{
                  width: '100%', padding: '0.9rem',
                  background: isCurrent ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${plan.color}, ${plan.id === 'twin-flame' ? '#fb923c' : '#a78bfa'})`,
                  border: isCurrent ? `1px solid ${plan.color}` : 'none',
                  borderRadius: '12px', color: isCurrent ? plan.color : '#fff',
                  fontWeight: 700, fontSize: '1rem', cursor: isCurrent ? 'default' : 'pointer',
                  opacity: isLoading ? 0.7 : 1, transition: 'opacity 0.2s',
                }}
              >
                {isLoading ? 'Redirecting to Stripe...' : isCurrent ? '✓ Current Plan' : plan.cta}
              </button>
            </div>
          )
        })}
      </div>

      {/* Trust badges */}
      <div style={{ textAlign: 'center', marginTop: '3rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <span>🔒 Secure payments via Stripe</span>
          <span>🔄 Cancel anytime</span>
          <span>🌟 7-day free trial</span>
          <span>💳 No hidden fees</span>
        </div>
        <p>Questions? Email us at hello@synchrosoul.app</p>
      </div>
    </div>
  )
}
