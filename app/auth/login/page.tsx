'use client'
import { useState } from 'react'
import Link from 'next/link'
import StarField from '@/components/StarField'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <StarField />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
        }} />
      </div>

      <div className="relative w-full max-w-sm" style={{ zIndex: 2 }}>
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 mb-10 group" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
          <span style={{ transition: 'transform 0.2s' }} className="group-hover:-translate-x-1">←</span>
          <span>Back</span>
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="mb-4" style={{ color: 'rgba(201,168,76,0.6)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Welcome back</div>
          <h1 className="serif gradient-text" style={{ fontSize: '2.5rem', fontWeight: 300, lineHeight: 1.1 }}>Sign In</h1>
          <p className="mt-3" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            The universe has been waiting for you
          </p>
        </div>

        <div className="divider" />

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="spiritual-input"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="spiritual-input"
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: '-0.5rem' }}>
            <a href="/auth/forgot-password" style={{ color: 'rgba(201,168,76,0.6)', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.05em' }}>Forgot password?</a>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: 'rgba(252,165,165,0.9)', fontSize: '0.8rem' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Enter the Portal'}
          </button>
        </form>

        <div className="divider" />

        {/* Google OAuth */}
        <button
          onClick={async () => {
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })
          }}
          className="btn-ghost flex items-center justify-center gap-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="rgba(255,255,255,0.5)" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="rgba(255,255,255,0.5)" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="rgba(255,255,255,0.5)" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="rgba(255,255,255,0.5)" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center mt-8" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
          No account?{' '}
          <Link href="/auth/signup" style={{ color: 'rgba(201,168,76,0.7)', textDecoration: 'none' }}>Begin your journey →</Link>
        </p>
      </div>
    </div>
  )
}
