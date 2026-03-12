'use client'
import { useEffect, useState } from 'react'
import { getSubscriptionStatus, SubscriptionStatus } from '@/lib/subscription'
import Link from 'next/link'

export default function SubscriptionBadge() {
  const [sub, setSub] = useState<SubscriptionStatus | null>(null)

  useEffect(() => {
    getSubscriptionStatus().then(setSub)
  }, [])

  if (!sub || sub.tier === 'free') {
    return (
      <Link href="/dashboard/upgrade" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
        background: 'linear-gradient(135deg, #c9a84c, #f472b6)',
        color: '#fff', fontSize: '0.65rem', fontWeight: 700,
        padding: '0.2rem 0.5rem', borderRadius: '999px',
        textDecoration: 'none', letterSpacing: '0.03em',
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        ✦ Upgrade
      </Link>
    )
  }

  const colors: Record<string, string> = {
    mystic: 'linear-gradient(135deg, #c9a84c, #a78bfa)',
    'twin-flame': 'linear-gradient(135deg, #f472b6, #fb923c)',
  }
  const icons: Record<string, string> = {
    mystic: '✨',
    'twin-flame': '🔥',
  }
  const shortLabels: Record<string, string> = {
    mystic: 'Mystic',
    'twin-flame': 'Twin',
  }

  return (
    <Link href="/dashboard/upgrade" style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
      background: colors[sub.tier] || '#a78bfa',
      color: '#fff', fontSize: '0.65rem', fontWeight: 700,
      padding: '0.2rem 0.5rem', borderRadius: '999px',
      textDecoration: 'none', letterSpacing: '0.03em',
      whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {icons[sub.tier] || '⭐'} {shortLabels[sub.tier] || sub.tier}
      {sub.status === 'trialing' && <span style={{ opacity: 0.75, fontSize: '0.6rem' }}>•trial</span>}
    </Link>
  )
}
