import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | SynchroSoul',
  description: 'This page does not exist. Return to SynchroSoul to log angel numbers, discover your numerology, and match with souls on your cosmic frequency.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh', background: '#050510', color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '2rem',
      fontFamily: 'Cormorant Garamond, serif',
    }}>
      <div style={{ fontSize: '5rem', color: 'rgba(201,168,76,0.6)', marginBottom: '1rem' }}>✦</div>
      <h1 style={{ fontSize: '6rem', color: 'rgba(220,200,255,0.3)', margin: '0 0 1rem', fontWeight: 300 }}>404</h1>
      <h2 style={{ fontSize: '1.8rem', color: 'rgba(220,200,255,0.8)', margin: '0 0 1rem', fontWeight: 300 }}>
        This page is lost in the cosmos
      </h2>
      <p style={{ fontSize: '1rem', color: 'rgba(180,150,255,0.6)', maxWidth: '400px', lineHeight: 1.7, marginBottom: '2.5rem', fontFamily: 'Inter, sans-serif' }}>
        The universe has other plans. Return home and continue your spiritual journey.
      </p>
      <Link href="/" style={{
        padding: '0.75rem 2rem', borderRadius: '9999px',
        background: 'rgba(200,150,255,0.12)',
        border: '1px solid rgba(200,150,255,0.35)',
        color: 'rgba(220,180,255,0.9)', textDecoration: 'none',
        fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase',
      }}>Return Home</Link>
    </main>
  )
}
