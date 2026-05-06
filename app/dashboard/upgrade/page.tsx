
'use client'
import { useState, useEffect, useCallback } from 'react'
import { getSubscriptionStatus, saveSubscriptionTierLocally, SubscriptionStatus } from '@/lib/subscription'

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
      '── Musical Healers ──',
      'Become a Musical Healer',
      'Themes & Moods tags (3 each)',
      '3 Oracle-Assigned Tags',
      '3 Synch Slots · 20 Songs max',
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
      '── Musical Healers ──',
      '+ Healing Styles tags (3 picks)',
      '6 Oracle-Assigned Tags',
      '10 Synch Slots · 50 Songs max',
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
      'AI Angel Advisor (personal celestial guide)',
      'Shared Journal Peek with matches',
      'Create private Angel Circles',
      'Priority soul matching algorithm',
      'Compatibility deep-dive reports',
      'Personalized ritual generator',
      'Advanced dream interpretation',
      'Cosmic Calendar with personal transits',
      'Early access to new features',
      'Direct support from founders',
      '── Musical Healers ──',
      '+ Spiritual Concepts tags (3 picks)',
      '9 Oracle-Assigned Tags',
      'Unlimited Synch Slots & Songs',
    ],
    cta: 'Start 7-Day Free Trial',
  },
]

export default function UpgradePage() {
  const [sub, setSub] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  const syncSubscription = useCallback(async (showMessage = true) => {
    setSyncing(true)
    try {
      const res = await fetch('/api/stripe/sync-subscription', { method: 'POST' })
      const data = await res.json()
      if (data.tier && data.tier !== 'free') {
        // Reload subscription status
        const newSub = await getSubscriptionStatus()
        setSub(newSub)
        saveSubscriptionTierLocally(data.tier as import('@/lib/subscription').SubscriptionTier)
        if (showMessage) {
          setMessage({ type: 'success', text: `✨ Access restored! You are now on the ${data.tier === 'twin-flame' ? 'Twin Flame' : 'Mystic'} plan. Refresh any locked pages to unlock features.` })
        }
      } else if (showMessage) {
        setMessage({ type: 'info', text: data.message || 'No active subscription found in Stripe. If you just subscribed, please wait a moment and try again.' })
      }
    } catch {
      if (showMessage) setMessage({ type: 'error', text: 'Could not reach Stripe. Please check your connection and try again.' })
    } finally {
      setSyncing(false)
    }
  }, [])

  useEffect(() => {
    getSubscriptionStatus().then(setSub)
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      const plan = params.get('plan') || 'premium'
      setMessage({ type: 'info', text: `⏳ Activating your ${plan === 'twin-flame' ? 'Twin Flame' : 'Mystic'} plan... please wait.` })
      window.history.replaceState({}, '', '/dashboard/upgrade')
      // Auto-sync after a short delay to let Stripe process
      setTimeout(() => syncSubscription(true), 2000)
    } else if (params.get('canceled') === 'true') {
      setMessage({ type: 'error', text: 'Checkout was canceled. Your plan has not changed.' })
      window.history.replaceState({}, '', '/dashboard/upgrade')
    }
  }, [syncSubscription])

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
  const msgColors: Record<string, { bg: string; border: string; text: string }> = {
    success: { bg: 'rgba(34,197,94,0.15)', border: 'rgba(34,197,94,0.4)', text: '#4ade80' },
    error:   { bg: 'rgba(239,68,68,0.15)',  border: 'rgba(239,68,68,0.4)',  text: '#f87171' },
    info:    { bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.4)', text: '#a78bfa' },
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✨</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Choose Your Cosmic Path
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>
          Unlock deeper spiritual tools and real-time soul connections
        </p>

        {/* Current plan + manage billing */}
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

        {/* Restore Access button — always visible for free users who may have paid */}
        {currentTier === 'free' && (
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Already subscribed but features are locked?
            </p>
            <button
              onClick={() => syncSubscription(true)}
              disabled={syncing}
              style={{
                background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.5)',
                borderRadius: '12px', padding: '0.6rem 1.5rem', color: '#c9a84c',
                cursor: syncing ? 'wait' : 'pointer', fontSize: '0.9rem', fontWeight: 600,
              }}
            >
              {syncing ? '⏳ Syncing with Stripe...' : '🔄 Restore My Access'}
            </button>
          </div>
        )}
      </div>

      {/* Message banner */}
      {message && (() => {
        const c = msgColors[message.type]
        return (
          <div style={{
            background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: '12px', padding: '1rem 1.5rem', marginBottom: '2rem',
            color: c.text, textAlign: 'center', fontSize: '0.95rem',
          }}>
            {message.text}
            {message.type === 'success' && (
              <div style={{ marginTop: '0.75rem' }}>
                <a href='/dashboard' style={{
                  background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)',
                  borderRadius: '8px', padding: '0.4rem 1rem', color: '#4ade80',
                  textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600,
                }}>→ Go to Dashboard</a>
              </div>
            )}
          </div>
        )
      })()}

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
                  f.startsWith('──') ? (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: plan.color, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', margin: '0.5rem 0 0.25rem', opacity: 0.8 }}>
                      🎵 {f.replace(/──\s?/g, '').trim()}
                    </li>
                  ) : (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                      <span style={{ color: plan.color, flexShrink: 0, marginTop: '0.1rem' }}>✓</span>
                      {f}
                    </li>
                  )
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
                  opacity: isLoading ? 0.7 : 1,
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
