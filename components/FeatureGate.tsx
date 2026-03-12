'use client'
import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { getSubscriptionStatus, hasFeature, saveSubscriptionTierLocally, SubscriptionTier } from '@/lib/subscription'

interface FeatureGateProps {
  feature: string
  requiredTier?: 'mystic' | 'twin-flame'
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function FeatureGate({ feature, requiredTier = 'mystic', children, fallback }: FeatureGateProps) {
  const [tier, setTier] = useState<SubscriptionTier | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)
  const autoSyncDone = useRef(false)

  // Auto-sync from Stripe on every load — fixes cross-device subscription issues
  const syncFromStripe = useCallback(async (silent = false) => {
    if (!silent) setSyncing(true)
    try {
      const res = await fetch('/api/stripe/sync-subscription', { method: 'POST' })
      const data = await res.json()
      if (data.tier && data.tier !== 'free') {
        saveSubscriptionTierLocally(data.tier as SubscriptionTier)
        setTier(data.tier as SubscriptionTier)
        if (!silent) {
          setSyncMsg({ type: 'success', text: 'Access restored! Reloading...' })
          setTimeout(() => window.location.reload(), 1200)
        }
        return data.tier as SubscriptionTier
      } else {
        if (!silent) setSyncMsg({ type: 'info', text: data.message || 'No active subscription found.' })
        return 'free' as SubscriptionTier
      }
    } catch {
      if (!silent) setSyncMsg({ type: 'error', text: 'Could not reach server. Please try again.' })
      return null
    } finally {
      if (!silent) setSyncing(false)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      // First: check Supabase / local cache
      const status = await getSubscriptionStatus()

      if (status.tier !== 'free') {
        // Already has a paid tier — show content immediately
        setTier(status.tier)
        setLoading(false)
        return
      }

      // Tier shows free — auto-sync from Stripe silently (fixes cross-device issue)
      if (!autoSyncDone.current) {
        autoSyncDone.current = true
        const syncedTier = await syncFromStripe(true)
        setTier(syncedTier || 'free')
      } else {
        setTier('free')
      }
      setLoading(false)
    }
    init()
  }, [syncFromStripe])

  const handleRestore = useCallback(async () => {
    setSyncMsg(null)
    await syncFromStripe(false)
  }, [syncFromStripe])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '2rem', animation: 'pulse 2s infinite' }}>✨</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Checking your cosmic access...</div>
      </div>
    )
  }

  if (tier && hasFeature(tier, feature)) {
    return <>{children}</>
  }

  if (fallback) return <>{fallback}</>

  const tierLabel = requiredTier === 'twin-flame' ? 'Twin Flame' : 'Mystic'
  const tierColor = requiredTier === 'twin-flame' ? '#f472b6' : '#c9a84c'
  const tierPrice = requiredTier === 'twin-flame' ? '$9.99' : '$6.99'

  const msgColors: Record<string, { bg: string; border: string; text: string }> = {
    success: { bg: 'rgba(34,197,94,0.15)',  border: 'rgba(34,197,94,0.4)',  text: '#4ade80' },
    error:   { bg: 'rgba(239,68,68,0.15)',   border: 'rgba(239,68,68,0.4)',  text: '#f87171' },
    info:    { bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.4)', text: '#a78bfa' },
  }

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{
        background: 'rgba(8,6,28,0.9)', border: `1px solid ${tierColor}44`,
        borderRadius: '24px', padding: '3rem 2.5rem', maxWidth: '480px', width: '100%',
        textAlign: 'center', backdropFilter: 'blur(20px)', boxShadow: `0 0 60px ${tierColor}22`,
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          {requiredTier === 'twin-flame' ? '🔥' : '✨'}
        </div>
        <div style={{
          display: 'inline-block', background: `${tierColor}22`, border: `1px solid ${tierColor}66`,
          borderRadius: '999px', padding: '0.3rem 1rem', color: tierColor,
          fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '1.5rem',
        }}>
          {tierLabel} FEATURE
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
          Unlock This Feature
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          This feature is available on the <strong style={{ color: tierColor }}>{tierLabel}</strong> plan.
          Start your 7-day free trial and explore the full cosmic experience.
        </p>

        {syncMsg && (() => {
          const c = msgColors[syncMsg.type]
          return (
            <div style={{
              background: c.bg, border: `1px solid ${c.border}`, borderRadius: '10px',
              padding: '0.75rem 1rem', color: c.text, fontSize: '0.85rem', marginBottom: '1.25rem',
            }}>
              {syncMsg.text}
            </div>
          )
        })()}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href="/dashboard/upgrade" style={{
            display: 'block', padding: '1rem',
            background: `linear-gradient(135deg, ${tierColor}, ${requiredTier === 'twin-flame' ? '#fb923c' : '#a78bfa'})`,
            borderRadius: '12px', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
          }}>
            Start Free Trial — {tierPrice}/mo after
          </Link>
          <button onClick={handleRestore} disabled={syncing} style={{
            display: 'block', width: '100%', padding: '0.85rem',
            background: 'rgba(255,255,255,0.06)', border: `1px solid ${tierColor}55`,
            borderRadius: '12px', color: tierColor, fontWeight: 600, fontSize: '0.9rem',
            cursor: syncing ? 'wait' : 'pointer',
          }}>
            {syncing ? 'Checking Stripe...' : 'Already subscribed? Restore Access'}
          </button>
          <Link href="/dashboard" style={{
            display: 'block', padding: '0.75rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', textDecoration: 'none',
          }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export function FeatureLockBadge({ requiredTier = 'mystic' }: { requiredTier?: 'mystic' | 'twin-flame' }) {
  const color = requiredTier === 'twin-flame' ? '#f472b6' : '#c9a84c'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', background: `${color}22`,
      border: `1px solid ${color}55`, borderRadius: '999px', padding: '0.1rem 0.4rem',
      fontSize: '0.6rem', color, fontWeight: 700, marginLeft: '0.3rem',
    }}>
      {requiredTier === 'twin-flame' ? '🔥' : '✨'}
    </span>
  )
}
