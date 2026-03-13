'use client'
import { useState } from 'react'
import Link from 'next/link'
import StarField from '@/components/StarField'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
      })
      if (error) throw error
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <StarField />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
      </div>
      <div className="relative w-full max-w-sm" style={{ zIndex: 2 }}>
        <Link href="/auth/login" className="inline-flex items-center gap-2 mb-10 group" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
          <span style={{ transition: 'transform 0.2s' }} className="group-hover:-translate-x-1">←</span>
          <span>Back to Sign In</span>
        </Link>
        <div className="mb-10">
          <div className="mb-4" style={{ color: 'rgba(201,168,76,0.6)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Account Recovery</div>
          <h1 className="serif gradient-text" style={{ fontSize: '2.5rem', fontWeight: 300, lineHeight: 1.1 }}>Reset Password</h1>
          <p className="mt-3" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', lineHeight: 1.6 }}>The universe will send you a reset link</p>
        </div>
        <div className="divider" />
        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <h2 className="serif" style={{ fontSize: '1.5rem', fontWeight: 300, color: 'rgba(201,168,76,0.9)', marginBottom: '0.75rem' }}>Check Your Email</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>A reset link has been sent to <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{email}</strong>. Follow the link to reset your password.</p>
            <Link href="/auth/login" style={{ color: 'rgba(201,168,76,0.7)', textDecoration: 'none', fontSize: '0.875rem' }}>Return to Sign In →</Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required autoFocus className="spiritual-input" />
            </div>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: 'rgba(252,165,165,0.9)', fontSize: '0.8rem' }}>{error}</div>
            )}
            <button type="submit" className="btn-primary mt-2" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
          </form>
        )}
        <p className="text-center mt-8" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>Remember your password?{' '}<Link href="/auth/login" style={{ color: 'rgba(201,168,76,0.7)', textDecoration: 'none' }}>Sign in →</Link></p>
      </div>
    </div>
  )
}
