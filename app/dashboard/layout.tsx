'use client'

export const dynamic = 'force-dynamic';

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import StarField from '@/components/StarField'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { ThemeProvider, useTheme, THEMES } from '@/lib/theme-context'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', emoji: '✦' },
  { href: '/dashboard/journal', label: 'Journal', emoji: '📖' },
  { href: '/dashboard/tools', label: 'Tools', emoji: '🔮' },
  { href: '/dashboard/feed', label: 'Feed', emoji: '✧' },
  { href: '/dashboard/profile', label: 'Profile', emoji: '◎' },
  { href: '/dashboard/upgrade', label: 'Upgrade', emoji: '⭐' },
]

const MORE_SECTIONS = [
  {
    title: 'Discover',
    items: [
      { href: '/dashboard/dictionary', label: 'Dictionary', emoji: '📚' },
      { href: '/dashboard/compatibility', label: 'Compatibility', emoji: '💞' },
      { href: '/dashboard/oracle', label: 'Oracle', emoji: '🔮' },
      { href: '/dashboard/calendar', label: 'Calendar', emoji: '🗓' },
    ]
  },
  {
    title: 'Connect',
    items: [
      { href: '/dashboard/soul-twin', label: 'Soul Twin', emoji: '🔥' },
      { href: '/dashboard/affirmations', label: 'Affirmations', emoji: '💫' },
      { href: '/dashboard/profile-card', label: 'Profile Card', emoji: '🪪' },
      { href: '/dashboard/onboarding', label: 'Setup', emoji: '✦' },
    ]
  },
  {
    title: 'Manifest',
    items: [
      { href: '/dashboard/vision-board', label: 'Vision Board', emoji: '🌟' },
      { href: '/dashboard/manifestations', label: 'Manifestations', emoji: '🌱' },
      { href: '/dashboard/rituals', label: 'Rituals', emoji: '🕯' },
      { href: '/dashboard/meditations', label: 'Meditations', emoji: '🧘' },
    ]
  },
  {
    title: 'Insights',
    items: [
      { href: '/dashboard/synthesis', label: 'Synthesis', emoji: '✺' },
      { href: '/dashboard/insights', label: 'Insights', emoji: '📊' },
      { href: '/dashboard/timeline', label: 'Timeline', emoji: '🌈' },
      { href: '/dashboard/badges', label: 'Badges', emoji: '🏅' },
    ]
  },
  {
    title: 'Account',
    items: [
      { href: '/dashboard/settings', label: 'Settings', emoji: '⚙️' },
      { href: '/dashboard/upgrade', label: 'Upgrade', emoji: '⭐' },
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

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${themeConfig.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
      <div style={{ position: 'absolute', inset: 0, background: themeConfig.overlay }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)' }} />
    </div>
  )
}

function DashboardInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', paddingBottom: '5rem', position: 'relative' }}>
      <DashboardBackground />

      {/* More drawer overlay */}
      {moreOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setMoreOpen(false)}
        />
      )}

      {/* More drawer panel */}
      <div style={{
        position: 'fixed', bottom: '4.5rem', left: 0, right: 0, zIndex: 101,
        background: 'rgba(5,5,20,0.97)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(200,180,255,0.12)',
        borderRadius: '1.5rem 1.5rem 0 0',
        padding: '1.25rem 1rem 1rem',
        transform: moreOpen ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        maxHeight: '75vh',
        overflowY: 'auto',
      }}>
        <div style={{ width: '2.5rem', height: '3px', background: 'rgba(200,180,255,0.2)', borderRadius: '9999px', margin: '0 auto 1.25rem' }} />
        {MORE_SECTIONS.map(section => (
          <div key={section.title} style={{ marginBottom: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.6rem', paddingLeft: '0.25rem' }}>{section.title}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem' }}>
              {section.items.map(item => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                      padding: '0.75rem 0.25rem', borderRadius: '0.75rem', textDecoration: 'none',
                      background: isActive ? 'rgba(200,150,255,0.12)' : 'rgba(255,255,255,0.03)',
                      border: isActive ? '1px solid rgba(200,150,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{item.emoji}</span>
                    <span style={{ fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: isActive ? 'rgba(220,180,255,0.9)' : 'rgba(180,160,255,0.55)', textAlign: 'center', lineHeight: 1.3 }}>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Top bar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,5,16,0.75)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(200,180,255,0.08)', padding: '0 1rem', height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>✦</span>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontWeight: 400, color: 'rgba(220,200,255,0.85)', letterSpacing: '0.05em' }}>SynchroSoul</span>
        </Link>
        <Link href="/auth/login" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.3)', textDecoration: 'none', padding: '0.35rem 0.875rem', borderRadius: '9999px', border: '1px solid rgba(200,180,255,0.12)' }}>Sign In</Link>
      </header>

      {/* Page content */}
      <main style={{ position: 'relative', zIndex: 1 }}>{children}</main>

      {/* Theme switcher */}
      <ThemeSwitcher />

      {/* Bottom navigation */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(5,5,16,0.92)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(200,180,255,0.1)', display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '4.5rem', padding: '0 0.25rem' }}>
        {NAV_ITEMS.map(item => {
          const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', textDecoration: 'none', padding: '0.4rem 0.5rem', borderRadius: '0.75rem', transition: 'all 0.2s', background: isActive ? 'rgba(200,150,255,0.1)' : 'transparent', border: isActive ? '1px solid rgba(200,150,255,0.2)' : '1px solid transparent' }}>
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{item.emoji}</span>
              <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: isActive ? 'rgba(220,180,255,0.9)' : 'rgba(200,180,255,0.35)', fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
            </Link>
          )
        })}
        {/* More button */}
        <button
          onClick={() => setMoreOpen(o => !o)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', padding: '0.4rem 0.5rem', borderRadius: '0.75rem', background: moreOpen ? 'rgba(200,150,255,0.1)' : 'transparent', border: moreOpen ? '1px solid rgba(200,150,255,0.2)' : '1px solid transparent', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>☰</span>
          <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: moreOpen ? 'rgba(220,180,255,0.9)' : 'rgba(200,180,255,0.35)', fontWeight: moreOpen ? 600 : 400 }}>More</span>
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
