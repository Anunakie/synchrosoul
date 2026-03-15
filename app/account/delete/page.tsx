'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DeleteAccountPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [deleted, setDeleted] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  const handleDelete = async () => {
    if (!confirmed) {
      setError('Please check the confirmation box first.')
      return
    }
    setDeleting(true)
    setError('')
    try {
      // Clear all localStorage data
      const keys = Object.keys(localStorage).filter(k => k.startsWith('synchrosoul'))
      keys.forEach(k => localStorage.removeItem(k))

      // Call API to delete account server-side
      const res = await fetch('/api/account/delete', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete account')
      }

      // Sign out
      await supabase.auth.signOut()
      setDeleted(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please contact hello@synchrosoul.app')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#a78bfa', fontSize: '1.2rem' }}>Loading...</div>
      </div>
    )
  }

  if (deleted) {
    return (
      <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '480px', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
          <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>Account Deleted</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Your account and all associated data have been permanently deleted. We hope the stars align for you again someday.
          </p>
          <Link href="/" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '1rem' }}>Return to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ maxWidth: '520px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</div>
            <div style={{ color: '#a78bfa', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '0.1em' }}>SYNCHROSOUL</div>
          </Link>
        </div>

        <div style={{
          background: 'rgba(139,92,246,0.08)',
          border: '1px solid rgba(139,92,246,0.25)',
          borderRadius: '1.5rem',
          padding: '2rem',
        }}>
          <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
            Delete Account
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
            This action is permanent and cannot be undone.
          </p>

          {/* What gets deleted */}
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ color: '#f87171', fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>The following data will be permanently deleted:</div>
            <ul style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', lineHeight: 2, paddingLeft: '1.25rem', margin: 0 }}>
              <li>Your profile and numerology readings</li>
              <li>All angel number logs and journal entries</li>
              <li>Dream journal entries</li>
              <li>Social posts and messages</li>
              <li>Saved readings and vision board</li>
              <li>Subscription and billing history</li>
              <li>All uploaded photos and voice notes</li>
            </ul>
          </div>

          {!user ? (
            // Not logged in - show instructions
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ color: '#a78bfa', fontWeight: 600, marginBottom: '0.5rem' }}>To delete your account:</div>
                <ol style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', lineHeight: 2, paddingLeft: '1.25rem', margin: 0, textAlign: 'left' }}>
                  <li>Log in to your SynchroSoul account</li>
                  <li>Return to this page</li>
                  <li>Confirm and delete your account</li>
                </ol>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/auth/login" style={{
                  background: 'rgba(139,92,246,0.8)',
                  color: '#fff',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}>Log In to Delete</Link>
                <Link href="/" style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.6)',
                  padding: '0.75rem 2rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                }}>Cancel</Link>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', marginTop: '1.5rem' }}>
                Or email us at <a href="mailto:hello@synchrosoul.app" style={{ color: '#a78bfa' }}>hello@synchrosoul.app</a> to request manual deletion.
              </p>
            </div>
          ) : (
            // Logged in - show delete form
            <div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Deleting account for:</div>
                <div style={{ color: '#fff', fontWeight: 600 }}>{user.email}</div>
              </div>

              {/* Confirmation checkbox */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={e => setConfirmed(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#a78bfa', flexShrink: 0 }}
                />
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  I understand this will permanently delete my account and all associated data. This action cannot be undone.
                </span>
              </label>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    flex: 1,
                    background: deleting ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.8)',
                    color: '#fff',
                    border: 'none',
                    padding: '0.875rem',
                    borderRadius: '0.75rem',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    minWidth: '160px',
                  }}
                >
                  {deleting ? 'Deleting...' : 'Delete My Account'}
                </button>
                <Link href="/dashboard" style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.6)',
                  padding: '0.875rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textAlign: 'center',
                  minWidth: '120px',
                }}>Cancel</Link>
              </div>
            </div>
          )}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', textAlign: 'center', marginTop: '1.5rem' }}>
          Questions? Contact <a href="mailto:hello@synchrosoul.app" style={{ color: 'rgba(167,139,250,0.6)' }}>hello@synchrosoul.app</a>
        </p>
      </div>
    </div>
  )
}
