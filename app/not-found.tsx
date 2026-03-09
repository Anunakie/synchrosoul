'use client'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>✦</div>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '5rem', fontWeight: 300, color: 'rgba(167,139,250,0.3)', lineHeight: 1, marginBottom: '0.5rem' }}>404</div>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'rgba(220,200,255,0.85)', fontWeight: 400, margin: '0 0 0.75rem' }}>Lost in the Cosmos</h1>
      <p style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.9rem', maxWidth: '320px', lineHeight: 1.7, margin: '0 0 2rem', fontStyle: 'italic' }}>This page has ascended to a higher dimension. Perhaps the universe is redirecting you somewhere more aligned.</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/dashboard" style={{ padding: '0.625rem 1.5rem', borderRadius: '2rem', background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.35)', color: '#a78bfa', textDecoration: 'none', fontSize: '0.85rem' }}>Return to Dashboard</Link>
        <Link href="/" style={{ padding: '0.625rem 1.5rem', borderRadius: '2rem', background: 'transparent', border: '1px solid rgba(200,180,255,0.15)', color: 'rgba(200,180,255,0.5)', textDecoration: 'none', fontSize: '0.85rem' }}>Home</Link>
      </div>
      <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', opacity: 0.2 }}>
        {['111','333','555','777','999'].map(n => (
          <span key={n} style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem', color: 'rgba(201,168,76,0.8)' }}>{n}</span>
        ))}
      </div>
    </div>
  )
}
