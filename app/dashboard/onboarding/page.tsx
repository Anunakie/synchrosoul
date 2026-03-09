'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { calcLifePath, calcSoulUrge, calcDestiny } from '@/lib/numerology'

const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_ONBOARDED = 'synchrosoul_onboarded'

const NUMBERS = ['111','222','333','444','555','666','777','888','999','1111','1212','1234']

const INTENTIONS = [
  { id: 'love', emoji: '💞', label: 'Love & Connection' },
  { id: 'purpose', emoji: '✦', label: 'Life Purpose' },
  { id: 'abundance', emoji: '🌟', label: 'Abundance' },
  { id: 'healing', emoji: '🌿', label: 'Healing' },
  { id: 'awakening', emoji: '👁️', label: 'Spiritual Awakening' },
  { id: 'clarity', emoji: '💎', label: 'Clarity & Truth' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [favNumbers, setFavNumbers] = useState<string[]>([])
  const [intentions, setIntentions] = useState<string[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (birthdate && name) {
      try { setProfile({ lifePathNumber: calcLifePath(birthdate), soulUrgeNumber: calcSoulUrge(name), destinyNumber: calcDestiny(name) }) } catch {}
    }
  }, [birthdate, name])

  function toggleNumber(n: string) {
    setFavNumbers(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n])
  }

  function toggleIntention(id: string) {
    setIntentions(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function finish() {
    setSaving(true)
    if (profile) {
      localStorage.setItem(KEY_PROFILE, JSON.stringify({ ...profile, name, birthdate, favNumbers, intentions }))
    }
    localStorage.setItem(KEY_ONBOARDED, 'true')
    setTimeout(() => router.push('/dashboard'), 800)
  }

  const STEPS = [
    { title: 'Welcome', subtitle: 'Your cosmic journey begins' },
    { title: 'Your Name', subtitle: 'What shall the universe call you?' },
    { title: 'Your Birthdate', subtitle: 'Unlock your numerology blueprint' },
    { title: 'Your Numbers', subtitle: 'Which angel numbers do you see most?' },
    { title: 'Your Intention', subtitle: 'What are you calling in?' },
    { title: 'You Are Ready', subtitle: 'Your path is aligned' },
  ]

  const progress = (step / (STEPS.length - 1)) * 100
  const s = STEPS[step]

  const btn = (label: string, onClick: () => void, disabled = false) => (
    <button onClick={onClick} disabled={disabled} style={{ width: '100%', padding: '0.9rem', borderRadius: '0.875rem', border: '1px solid rgba(167,139,250,0.3)', background: disabled ? 'rgba(200,180,255,0.04)' : 'rgba(167,139,250,0.14)', color: disabled ? 'rgba(180,160,255,0.25)' : '#a78bfa', fontSize: '0.9rem', cursor: disabled ? 'default' : 'pointer', letterSpacing: '0.04em', transition: 'all 0.2s' }}>{label}</button>
  )

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem 1.25rem', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* Progress */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step {step + 1} of {STEPS.length}</span>
          {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem', cursor: 'pointer' }}>← Back</button>}
        </div>
        <div style={{ height: '3px', background: 'rgba(200,180,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: progress + '%', background: 'linear-gradient(90deg, #a78bfa, #c9a84c)', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.4rem', fontWeight: 400 }}>{s.title}</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', margin: 0 }}>{s.subtitle}</p>
      </div>

      {/* Step content */}
      <div style={{ flex: 1 }}>
        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✦</div>
            <p style={{ color: 'rgba(200,180,255,0.65)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>SynchroSoul helps you track the angel numbers appearing in your life, decode their meaning, and connect with souls seeing the same signs.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {['Log angel numbers as you see them', 'Get personalized numerology readings', 'Match with souls on the same frequency', 'Track your spiritual journey over time'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(8,6,28,0.7)', border: '1px solid rgba(200,180,255,0.08)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                  <span style={{ color: '#c9a84c', fontSize: '0.8rem' }}>✓</span>
                  <span style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.85rem' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <input
              type='text' value={name} onChange={e => setName(e.target.value)}
              placeholder='Your name or spiritual name...'
              style={{ width: '100%', padding: '1rem', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' }}
            />
            <p style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.75rem', textAlign: 'center' }}>Used to calculate your Soul Urge and Destiny numbers</p>
          </div>
        )}

        {step === 2 && (
          <div>
            <input
              type='date' value={birthdate} onChange={e => setBirthdate(e.target.value)}
              style={{ width: '100%', padding: '1rem', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1.25rem' }}
            />
            {profile && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem' }}>
                {[
                  { label: 'Life Path', value: profile.lifePathNumber, color: '#a78bfa' },
                  { label: 'Soul Urge', value: profile.soulUrgeNumber, color: '#f472b6' },
                  { label: 'Destiny', value: profile.destinyNumber, color: '#c9a84c' },
                ].map(n => (
                  <div key={n.label} style={{ background: 'rgba(8,6,28,0.8)', border: '1px solid ' + n.color + '30', borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ color: n.color, fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{n.value}</div>
                    <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.3rem' }}>{n.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
              {NUMBERS.map(n => (
                <button key={n} onClick={() => toggleNumber(n)} style={{ padding: '0.75rem 0.5rem', borderRadius: '0.75rem', border: favNumbers.includes(n) ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(200,180,255,0.1)', background: favNumbers.includes(n) ? 'rgba(201,168,76,0.12)' : 'rgba(8,6,28,0.7)', color: favNumbers.includes(n) ? '#c9a84c' : 'rgba(200,180,255,0.6)', fontSize: '0.88rem', cursor: 'pointer', fontWeight: favNumbers.includes(n) ? 600 : 400, transition: 'all 0.2s' }}>{n}</button>
              ))}
            </div>
            <p style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.72rem', textAlign: 'center' }}>Select all that resonate — you can always add more later</p>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.625rem' }}>
            {INTENTIONS.map(i => (
              <button key={i.id} onClick={() => toggleIntention(i.id)} style={{ padding: '1rem', borderRadius: '0.875rem', border: intentions.includes(i.id) ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: intentions.includes(i.id) ? 'rgba(167,139,250,0.12)' : 'rgba(8,6,28,0.7)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
                <span style={{ fontSize: '1.5rem' }}>{i.emoji}</span>
                <span style={{ color: intentions.includes(i.id) ? '#a78bfa' : 'rgba(200,180,255,0.6)', fontSize: '0.78rem', textAlign: 'center' }}>{i.label}</span>
              </button>
            ))}
          </div>
        )}

        {step === 5 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🌟</div>
            {profile && (
              <div style={{ background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Your Cosmic Blueprint</div>
                <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{name || 'Seeker'}</div>
                <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem', marginBottom: '0.875rem' }}>Life Path {profile.lifePathNumber} · Soul Urge {profile.soulUrgeNumber} · Destiny {profile.destinyNumber}</div>
                {favNumbers.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>{favNumbers.map(n => <span key={n} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '9999px', padding: '0.15rem 0.6rem', color: '#c9a84c', fontSize: '0.72rem' }}>{n}</span>)}</div>}
              </div>
            )}
            <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', lineHeight: 1.7 }}>Your profile is set. The universe is ready to speak to you.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ marginTop: '1.5rem' }}>
        {step < STEPS.length - 1
          ? btn(
              step === 0 ? 'Begin My Journey →' : step === 1 ? (name ? 'Continue →' : 'Enter your name first') : step === 2 ? (birthdate ? 'Reveal My Numbers →' : 'Select your birthdate') : 'Continue →',
              () => setStep(s => s + 1),
              (step === 1 && !name) || (step === 2 && !birthdate)
            )
          : btn(saving ? 'Entering the cosmos...' : 'Enter SynchroSoul ✦', finish, saving)
        }
      </div>
    </div>
  )
}
