'use client'
import { useState } from 'react'
import Link from 'next/link'
import StarField from '@/components/StarField'

function calcLifePath(dateStr: string): number | null {
  if (!dateStr) return null
  const digits = dateStr.replace(/-/g, '').split('').map(Number)
  let sum = digits.reduce((a, b) => a + b, 0)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0)
  }
  return sum
}

const LIFE_PATH_MEANINGS: Record<number, string> = {
  1: 'The Leader', 2: 'The Peacemaker', 3: 'The Creator',
  4: 'The Builder', 5: 'The Adventurer', 6: 'The Nurturer',
  7: 'The Seeker', 8: 'The Achiever', 9: 'The Humanitarian',
  11: 'The Illuminator', 22: 'The Master Builder', 33: 'The Master Teacher',
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const lifePath = calcLifePath(birthdate)
  const lifePathMeaning = lifePath ? LIFE_PATH_MEANINGS[lifePath] : null

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name, birthdate, life_path: lifePath } },
      })
      if (error) throw error
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      <StarField />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '700px', height: '700px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.04) 0%, transparent 70%)',
        }} />
      </div>

      <div className="relative w-full max-w-sm" style={{ zIndex: 2 }}>
        <Link href="/" className="inline-flex items-center gap-2 mb-10 group" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
          <span className="group-hover:-translate-x-1" style={{ transition: 'transform 0.2s', display: 'inline-block' }}>←</span>
          <span>Back</span>
        </Link>

        <div className="mb-10">
          <div className="mb-4" style={{ color: 'rgba(201,168,76,0.6)', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>New soul</div>
          <h1 className="serif gradient-text" style={{ fontSize: '2.5rem', fontWeight: 300, lineHeight: 1.1 }}>Begin Your Journey</h1>
          <p className="mt-3" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            The cosmos has been expecting you
          </p>
        </div>

        <div className="divider" />

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Your Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Soul name" required className="spiritual-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="spiritual-input" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="spiritual-input" />
          </div>

          {/* Birthdate + Live Numerology */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Date of Birth</label>
            <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} required className="spiritual-input" style={{ colorScheme: 'dark' }} />
          </div>

          {/* Live Life Path reveal */}
          {lifePath && (
            <div className="glass-gold p-4 text-center" style={{ animation: 'fadeInUp 0.4s ease forwards' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.5rem' }}>Your Life Path Number</div>
              <div className="gradient-text-gold serif" style={{ fontSize: '3rem', fontWeight: 300, lineHeight: 1 }}>{lifePath}</div>
              {lifePathMeaning && (
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.4rem', fontStyle: 'italic' }}>{lifePathMeaning}</div>
              )}
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: 'rgba(252,165,165,0.9)', fontSize: '0.8rem' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? 'Aligning the stars...' : 'Create My Soul Profile'}
          </button>
        </form>

        <p className="text-center mt-8" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>
          Already aligned?{' '}
          <Link href="/auth/login" style={{ color: 'rgba(201,168,76,0.7)', textDecoration: 'none' }}>Sign in →</Link>
        </p>
      </div>
    </div>
  )
}
