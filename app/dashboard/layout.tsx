'use client'

export const dynamic = 'force-dynamic';

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', emoji: '✦' },
  { href: '/dashboard/journal', label: 'Journal', emoji: '📖' },
  { href: '/dashboard/dreams', label: 'Dreams', emoji: '🌙' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ minHeight: '100vh', background: '#050510', paddingBottom: '5rem' }}>
      {/* Top bar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(5,5,16,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(200,180,255,0.08)',
        padding: '0 1rem',
        height: '3.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>✦</span>
          <span style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '1.1rem', fontWeight: 400,
            color: 'rgba(220,200,255,0.85)',
            letterSpacing: '0.05em',
          }}>SynchroSoul</span>
        </Link>
        <Link href="/auth/login" style={{
          fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em',
          color: 'rgba(200,180,255,0.3)', textDecoration: 'none',
          padding: '0.35rem 0.875rem', borderRadius: '9999px',
          border: '1px solid rgba(200,180,255,0.12)',
        }}>Sign In</Link>
      </header>

      {/* Page content */}
      <main>{children}</main>

      {/* Bottom navigation */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(5,5,16,0.92)',
        backdropFilter: 'blur(24px)',
        borderTop: '1px solid rgba(200,180,255,0.1)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        height: '4.5rem',
        padding: '0 1rem',
      }}>
        {NAV_ITEMS.map(item => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.25rem', textDecoration: 'none', padding: '0.5rem 1.5rem',
                borderRadius: '0.75rem', transition: 'all 0.2s',
                background: isActive ? 'rgba(200,150,255,0.1)' : 'transparent',
                border: isActive ? '1px solid rgba(200,150,255,0.2)' : '1px solid transparent',
              }}
            >
              <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{item.emoji}</span>
              <span style={{
                fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                color: isActive ? 'rgba(220,180,255,0.9)' : 'rgba(200,180,255,0.35)',
                fontWeight: isActive ? 600 : 400,
              }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
