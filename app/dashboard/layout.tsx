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
import { ThemeProvider, useTheme, THEMES } from '@/lib/theme-context'
import SimulationRain from '@/components/SimulationRain'
import { SIM_NAV } from '@/lib/simulation-vocabulary'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', emoji: '✦' },
  { href: '/dashboard/journal', label: 'Journal', emoji: '📖' },
  { href: '/dashboard/tools', label: 'Tools', emoji: '🔮' },
  { href: '/dashboard/feed', label: 'Feed', emoji: '✧' },
  { href: '/dashboard/messages', label: 'Messages', emoji: '💬' },
  { href: '/dashboard/profile', label: 'Profile', emoji: '◎' },
]

const MORE_SECTIONS = [
  {
    title: 'Numerology',
    color: '#a78bfa',
    items: [
      { href: '/dashboard/numerology-deep', label: 'Deep Numerology', emoji: '🧮' },
      { href: '/dashboard/personal-year', label: 'Personal Year', emoji: '📅' },
      { href: '/dashboard/karmic-debt', label: 'Karmic Debt', emoji: '⚖️' },
      { href: '/dashboard/compatibility', label: 'Compatibility', emoji: '💞' },
    ]
  },
  {
    title: 'Divination',
    color: '#c9a84c',
    items: [
      { href: '/dashboard/oracle', label: 'Oracle', emoji: '✦' },
      { href: '/dashboard/tarot', label: 'Tarot', emoji: '🃏' },
      { href: '/dashboard/dictionary', label: 'Dictionary', emoji: '📚' },
      { href: '/dashboard/saved-readings', label: 'Saved', emoji: '🔖' },
      { href: '/dashboard/moon', label: 'Moon Phases', emoji: '🌙' },
    ]
  },
  {
    title: 'Tracking',
    color: '#60a5fa',
    items: [
      { href: '/dashboard/insights', label: 'Insights', emoji: '📊' },
      { href: '/dashboard/stats', label: 'Statistics', emoji: '📈' },
      { href: '/dashboard/streak', label: 'Streak', emoji: '🔥' },
      { href: '/dashboard/calendar', label: 'Calendar', emoji: '🗓️' },
      { href: '/dashboard/timeline', label: 'Timeline', emoji: '⏳' },
      { href: '/dashboard/synthesis', label: 'Synthesis', emoji: '✺' },
      { href: '/dashboard/badges', label: 'Badges', emoji: '🏅' },
      { href: '/dashboard/notifications', label: 'Notifications', emoji: '🔔' },
      { href: '/dashboard/cosmic-weather', label: 'Cosmic Weather', emoji: '🌌' },
    ]
  },
  {
    title: 'Healing',
    color: '#4ade80',
    items: [
      { href: '/dashboard/healing-hub', label: 'Healing Hub', emoji: '🌿' },
      { href: '/dashboard/healers', label: 'Find a Healer', emoji: '🙌' },
      { href: '/dashboard/healers/my-listing', label: 'My Listing', emoji: '🌿' },
      { href: '/dashboard/my-bookings', label: 'My Bookings', emoji: '📅' },
      { href: '/dashboard/meditations', label: 'Meditations', emoji: '🧘' },
      { href: '/dashboard/breathwork', label: 'Breathwork', emoji: '💨' },
      { href: '/dashboard/solfeggio', label: 'Solfeggio', emoji: '🎵' },
      { href: '/dashboard/chakras', label: 'Chakras', emoji: '🌈' },
      { href: '/dashboard/crystals', label: 'Crystals', emoji: '💎' },
      { href: '/dashboard/rituals', label: 'Rituals', emoji: '🕯️' },
      { href: '/dashboard/affirmations', label: 'Affirmations', emoji: '💫' },
    ]
  },
  {
    title: 'Journaling',
    color: '#f472b6',
    items: [
      { href: '/dashboard/dreams', label: 'Dreams', emoji: '🌙' },
      { href: '/dashboard/gratitude', label: 'Gratitude', emoji: '🙏' },
      { href: '/dashboard/manifestations', label: 'Manifestations', emoji: '🌱' },
      { href: '/dashboard/vision-board', label: 'Vision Board', emoji: '🖼️' },
    ]
  },
  {
    title: 'Community',
    color: '#f97316',
    items: [
      { href: '/dashboard/sync', label: 'Live Sync', emoji: '⟳' },
      { href: '/dashboard/soul-twin', label: 'Soul Twin', emoji: '👥' },
      { href: '/dashboard/circles', label: 'Circles', emoji: '⭕' },
      { href: '/dashboard/profile-card', label: 'Profile Card', emoji: '🪪' },
      { href: '/dashboard/relationships', label: 'Soul Connections', emoji: '💞' },
    ]
  },
  {
    title: 'Account',
    color: '#818cf8',
    items: [
      { href: '/dashboard/onboarding', label: 'Setup', emoji: '✦' },
      { href: '/dashboard/settings', label: 'Settings', emoji: '⚙️' },
      { href: '/dashboard/upgrade', label: 'Upgrade', emoji: '⭐' },
  { href: '/dashboard/referrals', label: 'Referrals', emoji: '🌟' },
      { href: '/dashboard/admin', label: 'Admin', emoji: '⚡' },
    ]
  },
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
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: '#000800' }}>
        <SimulationRain />
      </div>
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
    // Also check localStorage fallback
    try {
      const s = localStorage.getItem('synchrosoul_settings')
      if (s) { const parsed = JSON.parse(s); if (parsed.privacyMode) setPrivacyOn(true) }
    } catch {}
    // Migrate any localStorage angel logs to Supabase
    migrateLocalLogsToSupabase().catch(() => {})
    migrateLocalDreamsToSupabase().catch(() => {})
    // Auto-sync subscription on every dashboard load (fixes cross-device subscription issues)
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
  const [moreOpen, setMoreOpen] = useState(false)
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

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {}
    window.location.href = '/'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingBottom: '5rem', position: 'relative', overflowX: 'hidden', maxWidth: '100vw' }}>
      <DashboardBackground />

      {moreOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMoreOpen(false)}
        />
      )}

      <div style={{
        position: 'fixed', bottom: '4.5rem', left: 0, right: 0, zIndex: 101,
        background: 'rgba(5,5,20,0.97)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(200,180,255,0.12)',
        borderRadius: '1.5rem 1.5rem 0 0',
        padding: '1.25rem 1rem 1rem',
        transform: moreOpen ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        maxHeight: '78vh',
        overflowY: 'auto',
      }}>
        <div style={{ width: '2.5rem', height: '3px', background: 'rgba(200,180,255,0.2)', borderRadius: '9999px', margin: '0 auto 1.25rem' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(200,180,255,0.08)' }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.8)' }}>All Features</span>
          <span style={{ fontSize: '0.65rem', color: 'rgba(180,160,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>43 pages</span>
        </div>
        {MORE_SECTIONS.map(section => (
          <div key={section.title} style={{ marginBottom: '1.25rem' }}>
            <div style={{ color: section.color, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.6rem', paddingLeft: '0.25rem', opacity: 0.7 }}>{section.title}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.4rem' }}>
              {section.items.map(item => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                      padding: '0.65rem 0.2rem', borderRadius: '0.75rem', textDecoration: 'none',
                      background: isActive ? section.color + '18' : 'rgba(255,255,255,0.03)',
                      border: isActive ? '1px solid ' + section.color + '40' : '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{item.emoji}</span>
                    <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.03em', color: isActive ? 'rgba(220,180,255,0.9)' : 'rgba(180,160,255,0.55)', textAlign: 'center', lineHeight: 1.3 }}>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(200,180,255,0.08)' }}>
          <button
            onClick={() => { setMoreOpen(false); handleLogout(); }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '0.5rem', padding: '0.75rem', borderRadius: '0.75rem',
              background: 'rgba(255,80,80,0.06)', border: '1px solid rgba(255,80,80,0.15)',
              cursor: 'pointer', color: 'rgba(255,120,120,0.7)', fontSize: '0.8rem',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}
          >
            <span>⏻</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

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

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: isSim ? 'rgba(0,8,0,0.97)' : 'rgba(5,5,16,0.92)',
        backdropFilter: 'blur(24px)',
        borderTop: isSim ? '1px solid rgba(0,255,65,0.2)' : '1px solid rgba(200,180,255,0.1)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '4.5rem', padding: '0 0.25rem' }}>
        {NAV_ITEMS.map(item => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
          const simLabel = SIM_NAV[item.label] || item.label.toUpperCase()
          const simEmojis: Record<string, string> = {
            'Home': '⬛', 'Journal': '💾', 'Tools': '⚙', 'Feed': '📡', 'Messages': '📟', 'Profile': '🆔'
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
        <button
          onClick={() => setMoreOpen(o => !o)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
            padding: '0.4rem 0.5rem',
            borderRadius: isSim ? '0.2rem' : '0.75rem',
            background: moreOpen ? (isSim ? 'rgba(0,255,65,0.08)' : 'rgba(200,150,255,0.1)') : 'transparent',
            border: moreOpen ? (isSim ? '1px solid rgba(0,255,65,0.4)' : '1px solid rgba(200,150,255,0.2)') : '1px solid transparent',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{isSim ? '≡' : '☰'}</span>
          <span style={{
            fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: isSim ? '0.06em' : '0.05em',
            fontFamily: isSim ? 'monospace' : 'inherit',
            color: moreOpen ? (isSim ? '#00ff41' : 'rgba(220,180,255,0.9)') : (isSim ? 'rgba(0,255,65,0.4)' : 'rgba(200,180,255,0.35)'),
            fontWeight: moreOpen ? 600 : 400
          }}>{isSim ? 'SYS' : 'More'}</span>
        </button>
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
