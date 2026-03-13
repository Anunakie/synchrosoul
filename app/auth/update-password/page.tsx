'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import StarField from '@/components/StarField'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const router = useRouter()

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setError('')
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <StarField />
      <div className="relative w-full max-w-sm" style={{ zIndex: 2 }}>
        <div className="mb-10">
          <div className="mb-4" style={{ color: 'rgba(201,168,76,0.6)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>New Beginning</div>
          <h1 className="serif gradient-text" style={{ fontSize: '2.5rem', fontWeight: 300, lineHeight: 1.1 }}>New Password</h1>
          <p className="mt-3" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', lineHeight: 1.6 }}>Choose a new sacred password</p>
        </div>
        <div className="divider" />
        {done ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
            <h2 className="serif" style={{ fontSize: '1.5rem', fontWeight: 300, color: 'rgba(201,168,76,0.9)', marginBottom: '0.75rem' }}>Password Updated</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Redirecting you to your dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>New Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required autoFocus className="spiritual-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required className="spiritual-input" />
            </div>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: 'rgba(252,165,165,0.9)', fontSize: '0.8rem' }}>{error}</div>
            )}
            <button type="submit" className="btn-primary mt-2" disabled={loading}>{loading ? 'Updating...' : 'Set New Password'}</button>
          </form>
        )}
      </div>
    </div>
  )
}
