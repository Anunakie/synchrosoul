
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
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        background: 'linear-gradient(135deg, #c9a84c, #f472b6)',
        color: '#fff', fontSize: '0.7rem', fontWeight: 700,
        padding: '0.25rem 0.6rem', borderRadius: '999px',
        textDecoration: 'none', letterSpacing: '0.05em',
      }}>
        ✦ Upgrade
      </Link>
    )
  }

  const colors: Record<string, string> = {
    mystic: 'linear-gradient(135deg, #c9a84c, #a78bfa)',
    'twin-flame': 'linear-gradient(135deg, #f472b6, #fb923c)',
  }
  const labels: Record<string, string> = {
    mystic: '✨ Mystic',
    'twin-flame': '🔥 Twin Flame',
  }

  return (
    <Link href="/dashboard/upgrade" style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      background: colors[sub.tier] || '#a78bfa',
      color: '#fff', fontSize: '0.7rem', fontWeight: 700,
      padding: '0.25rem 0.6rem', borderRadius: '999px',
      textDecoration: 'none', letterSpacing: '0.05em',
    }}>
      {labels[sub.tier] || sub.tier}
      {sub.status === 'trialing' && <span style={{ opacity: 0.8 }}>(trial)</span>}
    </Link>
  )
}
