'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { calcLifePath, calcSoulUrge, calcDestiny } from '@/lib/numerology'

const STEPS = [
  { id: 'welcome', title: 'Welcome to SynchroSoul', emoji: '✦' },
  { id: 'name', title: 'What shall we call you?', emoji: '◎' },
  { id: 'birthdate', title: 'Your cosmic blueprint', emoji: '🌌' },
  { id: 'numbers', title: 'Which numbers find you?', emoji: '🔢' },
  { id: 'intention', title: 'Set your intention', emoji: '🌱' },
  { id: 'complete', title: 'You are aligned', emoji: '✨' },
]

const COMMON_NUMBERS = ['111','222','333','444','555','666','777','888','999','1111','1212','1234']

const INTENTIONS = [
  { id: 'love', label: 'Find my soul connection', emoji: '💗' },
  { id: 'purpose', label: 'Discover my life purpose', emoji: '🌟' },
  { id: 'abundance', label: 'Manifest abundance', emoji: '✨' },
  { id: 'healing', label: 'Heal and grow', emoji: '🌿' },
  { id: 'awakening', label: 'Deepen my awakening', emoji: '🔮' },
  { id: 'guidance', label: 'Receive divine guidance', emoji: '🕊️' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [selectedNumbers, setSelectedNumbers] = useState<string[]>([])
  const [intention, setIntention] = useState('')
  const [numerology, setNumerology] = useState<{ lp: number; su: number; dest: number } | null>(null)

  function handleBirthdate(val: string) {
    setBirthdate(val)
    if (val.length === 10) {
      const [y, m, d] = val.split('-').map(Number)
      if (y && m && d) {
        const lp = calcLifePath(String(m).padStart(2,'0') + '/' + String(d).padStart(2,'0') + '/' + y)
        const su = calcSoulUrge(name || 'Soul')
        const dest = calcDestiny(name || 'Soul')
        setNumerology({ lp, su, dest })
      }
    }
  }

  function toggleNumber(n: string) {
    setSelectedNumbers(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n])
  }

  function handleComplete() {
    const profile = { name, birthdate, intention, favoriteNumbers: selectedNumbers, numerology, onboarded: true, onboardedAt: new Date().toISOString() }
    localStorage.setItem('synchrosoul_onboarding', JSON.stringify(profile))
    localStorage.setItem('synchrosoul_profile', JSON.stringify({ ...profile, displayName: name }))
    if (numerology) {
      localStorage.setItem('synchrosoul_numerology', JSON.stringify({ lifePathNumber: numerology.lp, soulUrgeNumber: numerology.su, destinyNumber: numerology.dest, birthdate, name }))
    }
    router.push('/dashboard')
  }

  const progress = ((step + 1) / STEPS.length) * 100
  const currentStep = STEPS[step]

  const inp = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,180,255,0.2)', borderRadius: '0.75rem', color: 'rgba(220,200,255,0.95)', padding: '0.85rem 1rem', fontSize: '1rem', width: '100%', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' } as React.CSSProperties

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      {/* Progress bar */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.06)', zIndex: 100 }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg, #a78bfa, #c9a84c)', width: `${progress}%`, transition: 'width 0.4s ease', borderRadius: '0 9999px 9999px 0' }} />
      </div>

      <div style={{ maxWidth: '480px', width: '100%' }}>
        {/* Step indicator */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{currentStep.emoji}</div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.5rem', fontWeight: 400 }}>{currentStep.title}</h1>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', letterSpacing: '0.1em' }}>STEP {step + 1} OF {STEPS.length}</div>
        </div>

        {/* Step content */}
        <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '2rem' }}>

          {step === 0 && (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'rgba(200,180,255,0.75)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>You have been guided here by the numbers. SynchroSoul is a sacred space to track the angel numbers that find you, discover your cosmic blueprint, and connect with souls on the same frequency.</p>
              <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {['Log angel numbers you see daily','Get personalized numerology readings','Match with souls seeing the same signs','Track your manifestations and dreams'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(200,180,255,0.08)' }}>
                    <span style={{ color: '#c9a84c', fontSize: '0.8rem' }}>✦</span>
                    <span style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>This is how you will appear to other souls on SynchroSoul.</p>
              <input style={inp} placeholder="Your name or spiritual name..." value={name} onChange={e => setName(e.target.value)} autoFocus />
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Your birthdate reveals your Life Path, Soul Urge, and Destiny numbers.</p>
              <input type="date" style={inp} value={birthdate} onChange={e => handleBirthdate(e.target.value)} />
              {numerology && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginTop: '1.25rem' }}>
                  {[
                    { label: 'Life Path', value: numerology.lp, color: '#c9a84c', desc: 'Your soul mission' },
                    { label: 'Soul Urge', value: numerology.su, color: '#a78bfa', desc: 'Your heart desire' },
                    { label: 'Destiny', value: numerology.dest, color: '#60a5fa', desc: 'Your life purpose' },
                  ].map(n => (
                    <div key={n.label} style={{ textAlign: 'center', padding: '1rem 0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', border: `1px solid ${n.color}33` }}>
                      <div style={{ color: n.color, fontSize: '1.8rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{n.value}</div>
                      <div style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.68rem', fontWeight: 600, marginTop: '0.2rem' }}>{n.label}</div>
                      <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', marginTop: '0.15rem' }}>{n.desc}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Select the numbers that have been appearing in your life. You can always add more later.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem' }}>
                {COMMON_NUMBERS.map(n => (
                  <button key={n} onClick={() => toggleNumber(n)} style={{ padding: '0.6rem 0.25rem', borderRadius: '0.6rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600, background: selectedNumbers.includes(n) ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)', border: selectedNumbers.includes(n) ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(200,180,255,0.1)', color: selectedNumbers.includes(n) ? '#c9a84c' : 'rgba(200,180,255,0.7)', transition: 'all 0.15s' }}>{n}</button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>What brings you to SynchroSoul? Set your primary intention.</p>
              <div style={{ display: 'grid', gap: '0.6rem' }}>
                {INTENTIONS.map(i => (
                  <button key={i.id} onClick={() => setIntention(i.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', background: intention === i.id ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.03)', border: intention === i.id ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.08)', transition: 'all 0.15s' }}>
                    <span style={{ fontSize: '1.3rem' }}>{i.emoji}</span>
                    <span style={{ color: intention === i.id ? 'rgba(220,200,255,0.95)' : 'rgba(200,180,255,0.7)', fontSize: '0.88rem' }}>{i.label}</span>
                    {intention === i.id && <span style={{ marginLeft: 'auto', color: '#a78bfa', fontSize: '0.8rem' }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
              <p style={{ color: 'rgba(200,180,255,0.8)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '0.95rem' }}>Welcome, <strong style={{ color: '#c9a84c' }}>{name || 'Soul'}</strong>. Your cosmic journey begins now.</p>
              {numerology && <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>Life Path {numerology.lp} · Soul Urge {numerology.su} · Destiny {numerology.dest}</p>}
              {selectedNumbers.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
                  {selectedNumbers.map(n => <span key={n} style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontSize: '0.75rem' }}>{n}</span>)}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{ flex: 1, padding: '0.85rem', borderRadius: '0.75rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', color: 'rgba(200,180,255,0.6)', fontSize: '0.9rem', fontFamily: 'inherit' }}>← Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !name.trim()} style={{ flex: 2, padding: '0.85rem', borderRadius: '0.75rem', cursor: 'pointer', background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.5)', color: 'rgba(220,200,255,0.95)', fontSize: '0.9rem', fontFamily: 'inherit', opacity: step === 1 && !name.trim() ? 0.4 : 1 }}>Continue →</button>
            ) : (
              <button onClick={handleComplete} style={{ flex: 2, padding: '0.85rem', borderRadius: '0.75rem', cursor: 'pointer', background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(201,168,76,0.3))', border: '1px solid rgba(201,168,76,0.5)', color: '#c9a84c', fontSize: '0.9rem', fontFamily: 'inherit', fontWeight: 600 }}>Enter SynchroSoul ✦</button>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(180,160,255,0.3)', fontSize: '0.75rem', fontFamily: 'inherit' }}>Skip for now</button>
        </div>
      </div>
    </div>
  )
}
