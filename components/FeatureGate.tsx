
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSubscriptionStatus, hasFeature, SubscriptionTier } from '@/lib/subscription'

interface FeatureGateProps {
  feature: string
  requiredTier?: 'mystic' | 'twin-flame'
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function FeatureGate({ feature, requiredTier = 'mystic', children, fallback }: FeatureGateProps) {
  const [tier, setTier] = useState<SubscriptionTier | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSubscriptionStatus().then(s => {
      setTier(s.tier)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.5rem' }}>✦</div>
      </div>
    )
  }

  if (tier && hasFeature(tier, feature)) {
    return <>{children}</>
  }

  if (fallback) return <>{fallback}</>

  const tierLabel = requiredTier === 'twin-flame' ? '🔥 Twin Flame' : '✨ Mystic'
  const tierColor = requiredTier === 'twin-flame' ? '#f472b6' : '#c9a84c'
  const tierPrice = requiredTier === 'twin-flame' ? '$9.99' : '$6.99'

  return (
    <div style={{
      minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        background: 'rgba(8,6,28,0.9)', border: `1px solid ${tierColor}44`,
        borderRadius: '24px', padding: '3rem 2.5rem', maxWidth: '480px', width: '100%',
        textAlign: 'center', backdropFilter: 'blur(20px)',
        boxShadow: `0 0 60px ${tierColor}22`,
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          {requiredTier === 'twin-flame' ? '🔥' : '✨'}
        </div>
        <div style={{
          display: 'inline-block', background: `${tierColor}22`,
          border: `1px solid ${tierColor}66`, borderRadius: '999px',
          padding: '0.3rem 1rem', color: tierColor, fontSize: '0.8rem',
          fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1.5rem',
        }}>
          {tierLabel} FEATURE
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
          Unlock This Feature
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '2rem' }}>
          This feature is available on the <strong style={{ color: tierColor }}>{tierLabel}</strong> plan.
          Start your 7-day free trial and explore the full cosmic experience.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href="/dashboard/upgrade" style={{
            display: 'block', padding: '1rem',
            background: `linear-gradient(135deg, ${tierColor}, ${requiredTier === 'twin-flame' ? '#fb923c' : '#a78bfa'})`,
            borderRadius: '12px', color: '#fff', fontWeight: 700,
            fontSize: '1rem', textDecoration: 'none',
          }}>
            Start Free Trial — {tierPrice}/mo after
          </Link>
          <Link href="/dashboard" style={{
            display: 'block', padding: '0.75rem',
            color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', textDecoration: 'none',
          }}>
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

// Inline lock badge for nav items / cards
export function FeatureLockBadge({ requiredTier = 'mystic' }: { requiredTier?: 'mystic' | 'twin-flame' }) {
  const color = requiredTier === 'twin-flame' ? '#f472b6' : '#c9a84c'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: `${color}22`, border: `1px solid ${color}55`,
      borderRadius: '999px', padding: '0.1rem 0.4rem',
      fontSize: '0.6rem', color, fontWeight: 700, marginLeft: '0.3rem',
    }}>
      {requiredTier === 'twin-flame' ? '🔥' : '✨'}
    </span>
  )
}
