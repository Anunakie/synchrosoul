'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { getPrivacyMode } from '@/lib/supabase-db'
import { migrateLocalLogsToSupabase } from '@/lib/storage'
import { migrateLocalDreamsToSupabase } from '@/lib/dream-storage'
import CloudSyncStatus from '@/components/CloudSyncStatus'
import StarField from '@/components/StarField'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import NotificationBell from '@/components/NotificationBell'
import SubscriptionBadge from '@/components/SubscriptionBadge'
import InstallPrompt from '@/components/InstallPrompt'
import WelcomeTour from '@/components/WelcomeTour'
import { ThemeProvider, useTheme, THEMES } from '@/lib/theme-context'
import SimulationRain from '@/components/SimulationRain'
import { SIM_NAV } from '@/lib/simulation-vocabulary'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', emoji: '✦' },
  { href: '/dashboard/journal', label: 'Journal', emoji: '📖' },
  { href: '/dashboard/explore', label: 'Explore', emoji: '🔮' },
  { href: '/dashboard/feed', label: 'Feed', emoji: '✧' },
  { href: '/dashboard/messages', label: 'Messages', emoji: '💬' },
  { href: '/dashboard/profile', label: 'Profile', emoji: '◎' },
]

function DashboardBackground() {
  const { theme } = useTheme()
  const themeConfig = THEMES.find(t => t.id === theme) || THEMES[0]

  if (theme === 'starfield') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <StarField />
      </div>
    )
  }

  if (theme === 'bright') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 20% 20%, rgba(80,40,180,0.35) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(60,20,140,0.3) 0%, transparent 50%), linear-gradient(135deg, #0d0a1f 0%, #120e2a 50%, #0a0818 100%)'
      }} />
    )
  }

  if (theme === 'light') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse at 20% 10%, rgba(167,139,250,0.2) 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, rgba(196,181,253,0.15) 0%, transparent 50%), linear-gradient(135deg, #f5f0ff 0%, #ede8ff 30%, #f0f4ff 60%, #faf5ff 100%)'
      }} />
    )
  }

  if (theme === 'simulation') {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#000800' }} />
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${themeConfig.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <div style={{ position: 'absolute', inset: 0, background: themeConfig.overlay }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
    </div>
  )
}

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const isSim = theme === 'simulation'
  const [privacyOn, setPrivacyOn] = useState(false)
  useEffect(() => {
    getPrivacyMode().then(setPrivacyOn).catch(() => {})
    try {
      const s = localStorage.getItem('synchrosoul_settings')
      if (s) { const parsed = JSON.parse(s); if (parsed.privacyMode) setPrivacyOn(true) }
    } catch {}
    migrateLocalLogsToSupabase().catch(() => {})
    migrateLocalDreamsToSupabase().catch(() => {})
    fetch('/api/stripe/sync-subscription', { method: 'POST' })
      .then(r => r.json())
      .then(data => {
        if (data.tier && data.tier !== 'free') {
          localStorage.setItem('synchrosoul_subscription_tier', data.tier)
          localStorage.setItem('synchrosoul_subscription_status', data.status || 'active')
        }
      })
      .catch(() => {})
  }, [])
  const pathname = usePathname()
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    const loadUnread = async () => {
      try {
        const { getUnreadCount } = await import('@/lib/messages')
        const count = await getUnreadCount()
        setUnreadMessages(count)
      } catch {}
    }
    loadUnread()
    const interval = setInterval(loadUnread, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingBottom: '5rem', position: 'relative', overflowX: 'hidden', maxWidth: '100vw' }}>
      <DashboardBackground />
      {isSim && <SimulationRain />}

      <header style={{ position: 'sticky', top: 0, zIndex: 50,
        background: isSim ? 'rgba(0,8,0,0.95)' : 'rgba(5,5,16,0.75)',
        backdropFilter: 'blur(20px)',
        borderBottom: isSim ? '1px solid rgba(0,255,65,0.15)' : '1px solid rgba(200,180,255,0.08)',
        padding: '0 0.75rem', height: '3.5rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', overflow: 'hidden', maxWidth: '100vw', boxSizing: 'border-box' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem', color: isSim ? '#00ff41' : 'inherit' }}>{isSim ? '>_' : '✦'}</span>
          <span style={{ fontFamily: isSim ? 'monospace' : 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 400,
            color: isSim ? '#00ff41' : 'rgba(220,200,255,0.85)',
            letterSpacing: isSim ? '0.12em' : '0.05em',
            textShadow: isSim ? '0 0 10px rgba(0,255,65,0.5)' : 'none'
          }}>{isSim ? 'SYN_SOUL.EXE' : 'SynchroSoul'}</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', flexShrink: 0 }}>
          <Link href="/dashboard/notifications" style={{ width: '1.9rem', height: '1.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: isSim ? '0.2rem' : '50%',
            background: isSim ? 'rgba(0,255,65,0.06)' : 'rgba(200,180,255,0.06)',
            border: isSim ? '1px solid rgba(0,255,65,0.2)' : '1px solid rgba(200,180,255,0.1)',
            textDecoration: 'none', fontSize: '0.85rem', flexShrink: 0 }}>🔔</Link>
          {privacyOn && (
            <Link href="/dashboard/settings" title="Private Mode is ON" style={{ width: '1.9rem', height: '1.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: isSim ? '0.2rem' : '50%', background: 'rgba(180,100,255,0.2)', border: '1px solid rgba(180,100,255,0.5)', textDecoration: 'none', fontSize: '0.85rem', flexShrink: 0 }}>🔒</Link>
          )}
          <SubscriptionBadge />
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 1, overflowX: 'hidden', width: '100%', boxSizing: 'border-box' }}>{children}</main>

      <ThemeSwitcher />
      <NotificationBell />
      <InstallPrompt />
      <WelcomeTour />

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: isSim ? 'rgba(0,8,0,0.97)' : 'rgba(5,5,16,0.92)',
        backdropFilter: 'blur(24px)',
        borderTop: isSim ? '1px solid rgba(0,255,65,0.2)' : '1px solid rgba(200,180,255,0.1)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '4.5rem', padding: '0 0.25rem' }}>
        {NAV_ITEMS.map(item => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
          const simLabel = SIM_NAV[item.label] || item.label.toUpperCase()
          const simEmojis: Record<string, string> = {
            'Home': '⬛', 'Journal': '💾', 'Explore': '⚙', 'Feed': '📡', 'Messages': '📟', 'Profile': '🆔'
          }
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
              textDecoration: 'none', padding: '0.4rem 0.5rem', transition: 'all 0.2s',
              borderRadius: isSim ? '0.2rem' : '0.75rem',
              background: isActive
                ? (isSim ? 'rgba(0,255,65,0.08)' : 'rgba(200,150,255,0.1)')
                : 'transparent',
              border: isActive
                ? (isSim ? '1px solid rgba(0,255,65,0.4)' : '1px solid rgba(200,150,255,0.2)')
                : '1px solid transparent',
              boxShadow: isActive && isSim ? '0 0 8px rgba(0,255,65,0.15)' : 'none',
            }}>
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{isSim ? simEmojis[item.label] || item.emoji : item.emoji}</span>
              <span style={{
                fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: isSim ? '0.06em' : '0.05em',
                fontFamily: isSim ? 'monospace' : 'inherit',
                color: isActive
                  ? (isSim ? '#00ff41' : 'rgba(220,180,255,0.9)')
                  : (isSim ? 'rgba(0,255,65,0.4)' : 'rgba(200,180,255,0.35)'),
                fontWeight: isActive ? 600 : 400
              }}>{isSim ? simLabel : item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DashboardInner>{children}</DashboardInner>
    </ThemeProvider>
  )
}
