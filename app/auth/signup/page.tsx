'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import StarField from '@/components/StarField'
import { calcLifePath, calcSoulUrge, calcDestiny, getLifePathData } from '@/lib/numerology'
import { saveNumerologyProfile } from '@/lib/storage'

interface NumBadgeProps {
  label: string
  number: number
  keyword: string
  color: string
  description: string
  delay?: number
}

function NumBadge({ label, number, keyword, color, description, delay = 0 }: NumBadgeProps) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.95)',
      transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      background: 'rgba(5,5,16,0.7)',
      border: `1px solid ${color}40`,
      borderRadius: '1rem',
      padding: '1rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 0%, ${color}10 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: `${color}80`, marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ fontSize: '2.5rem', fontWeight: 300, color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1, textShadow: `0 0 20px ${color}60` }}>{number}</div>
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem', fontStyle: 'italic' }}>{keyword}</div>
      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.4rem', lineHeight: 1.5 }}>{description.slice(0, 80)}…</div>
    </div>
  )
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showNumerology, setShowNumerology] = useState(false)

  const lifePath = birthdate ? calcLifePath(birthdate) : 0
  const soulUrge = name.trim().length > 1 ? calcSoulUrge(name) : 0
  const destiny = name.trim().length > 1 ? calcDestiny(name) : 0
  const lpData = lifePath ? getLifePathData(lifePath) : null

  useEffect(() => {
    if (lifePath && birthdate) {
      const t = setTimeout(() => setShowNumerology(true), 100)
      return () => clearTimeout(t)
    } else {
      setShowNumerology(false)
    }
  }, [lifePath, birthdate])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (lifePath && birthdate) {
        const lpd = getLifePathData(lifePath)
        saveNumerologyProfile({
          lifePath,
          lifePathMeaning: lpd.meaning,
          lifePathColor: lpd.color,
          soulUrge: soulUrge || undefined,
          destiny: destiny || undefined,
          birthdate,
        })
      }
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name, birthdate, life_path: lifePath, soul_urge: soulUrge, destiny } },
      })
      if (error) throw error
      window.location.href = '/dashboard/onboarding'
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

        <div className="mb-8">
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

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>
              Date of Birth <span style={{ color: 'rgba(201,168,76,0.5)' }}>✦ reveals your numbers</span>
            </label>
            <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} required className="spiritual-input" style={{ colorScheme: 'dark' }} />
          </div>

          {showNumerology && lpData && (
            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', marginBottom: '0.75rem', textAlign: 'center' }}>
                ✦ Your Cosmic Blueprint ✦
              </div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <NumBadge
                  label="Life Path"
                  number={lifePath}
                  keyword={lpData.keyword}
                  color={lpData.color}
                  description={lpData.description}
                  delay={0}
                />
                {soulUrge > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <NumBadge
                      label="Soul Urge"
                      number={soulUrge}
                      keyword={getLifePathData(soulUrge).keyword}
                      color="#a78bfa"
                      description={getLifePathData(soulUrge).description}
                      delay={150}
                    />
                    <NumBadge
                      label="Destiny"
                      number={destiny}
                      keyword={getLifePathData(destiny).keyword}
                      color="#34d399"
                      description={getLifePathData(destiny).description}
                      delay={300}
                    />
                  </div>
                )}
              </div>
              <div style={{
                marginTop: '0.75rem', padding: '0.75rem 1rem',
                background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)',
                borderRadius: '0.75rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)',
                lineHeight: 1.6, fontStyle: 'italic', textAlign: 'center'
              }}>
                {lpData.description}
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem', padding: '0.75rem 1rem', color: 'rgba(252,165,165,0.9)', fontSize: '0.8rem' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary mt-2" disabled={loading}>
            {loading ? 'Aligning the stars...' : 'Create My Soul Profile ✦'}
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
