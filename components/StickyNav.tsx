'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function StickyNav() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.75rem 2rem',
      background: 'rgba(5,5,16,0.92)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(200,180,255,0.08)',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: 'rgba(201,168,76,0.9)', fontSize: '1rem' }}>{String.fromCharCode(10022)}</span>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.9)', letterSpacing: '0.05em' }}>SynchroSoul</span>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <Link href='/auth/login' style={{
          fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'rgba(200,180,255,0.5)', textDecoration: 'none',
        }}>Sign In</Link>
        <Link href='/auth/signup' style={{
          fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '0.45rem 1.1rem', borderRadius: '9999px',
          background: 'rgba(201,168,76,0.15)',
          border: '1px solid rgba(201,168,76,0.4)',
          color: 'rgba(201,168,76,0.9)', textDecoration: 'none',
        }}>Get Started</Link>
      </div>
    </div>
  )
}