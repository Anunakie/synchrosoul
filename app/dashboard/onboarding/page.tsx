'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calcLifePath, calcSoulUrge, calcDestiny } from '@/lib/numerology';

const STEPS = [
  { id: 'welcome', title: 'Welcome to SynchroSoul' },
  { id: 'name', title: 'Your Sacred Name' },
  { id: 'birthdate', title: 'Your Birth Blueprint' },
  { id: 'numbers', title: 'Your Cosmic Numbers' },
  { id: 'intention', title: 'Set Your Intention' },
  { id: 'complete', title: 'You Are Aligned' },
];

const INTENTIONS = [
  { emoji: '💕', text: 'Find my soul mate or twin flame' },
  { emoji: '🌱', text: 'Manifest my dream life' },
  { emoji: '🔮', text: 'Deepen my spiritual practice' },
  { emoji: '💫', text: 'Understand my life purpose' },
  { emoji: '🌿', text: 'Heal and restore my energy' },
  { emoji: '✨', text: 'Connect with like-minded souls' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [intention, setIntention] = useState('');
  const [nums, setNums] = useState<{lp:number,su:number,de:number}|null>(null);

  const goNext = () => {
    if (step === 2 && name && birthdate) {
      setNums({ lp: calcLifePath(birthdate), su: calcSoulUrge(name), de: calcDestiny(name) });
    }
    if (step === 4) {
      // Save profile
      try {
        localStorage.setItem('synchrosoul_numerology_profile', JSON.stringify({ name, birthdate, intention, savedAt: new Date().toISOString() }));
        localStorage.setItem('synchrosoul_onboarded', 'true');
      } catch {}
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      {/* Progress */}
      <div style={{ width: '100%', maxWidth: '480px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step {step + 1} of {STEPS.length}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #c9a84c, #8b5cf6)', transition: 'width 0.4s ease', borderRadius: '999px' }} />
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✦</div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', marginBottom: '1rem' }}>Welcome to SynchroSoul</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>The universe has been sending you messages through numbers. This is where you finally decode them — and find the souls who are receiving the same signals.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '2rem' }}>
              {['Log angel numbers you see daily', 'Get your complete numerology blueprint', 'Match with souls on the same frequency', 'Receive daily cosmic guidance'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.75rem 1rem' }}>
                  <span style={{ color: '#c9a84c', fontSize: '0.9rem' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Name */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem', textAlign: 'center' }}>What is your name?</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>Your full birth name holds the key to your Soul Urge and Destiny numbers</p>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full birth name"
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '1rem', padding: '1rem 1.25rem', color: '#fff', fontSize: '1.1rem', outline: 'none', boxSizing: 'border-box', textAlign: 'center', fontFamily: 'Cormorant Garamond, serif' }} />
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textAlign: 'center', marginTop: '0.75rem' }}>Use the name on your birth certificate for accurate readings</p>
          </div>
        )}

        {/* STEP 2: Birthdate */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem', textAlign: 'center' }}>When were you born?</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>Your birthdate reveals your Life Path — the core purpose of your soul</p>
            <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '1rem', padding: '1rem 1.25rem', color: '#fff', fontSize: '1.1rem', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
          </div>
        )}

        {/* STEP 3: Numbers Reveal */}
        {step === 3 && nums && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem' }}>Your Cosmic Blueprint</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '2rem', fontSize: '0.9rem' }}>These numbers define your soul’s journey</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
              {[
                { label: 'Life Path', value: nums.lp, color: '#c9a84c', desc: 'Your soul’s purpose' },
                { label: 'Soul Urge', value: nums.su, color: '#f472b6', desc: 'Your heart’s desire' },
                { label: 'Destiny', value: nums.de, color: '#8b5cf6', desc: 'Your life mission' },
              ].map(n => (
                <div key={n.label} style={{
                  background: `${n.color}15`, border: `1px solid ${n.color}40`,
                  borderRadius: '1.25rem', padding: '1.25rem 1rem', flex: 1
                }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: n.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{n.value}</div>
                  <div style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 700, marginTop: '0.4rem' }}>{n.label}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{n.desc}</div>
                </div>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>Welcome, {name.split(' ')[0]}. Your Life Path {nums.lp} reveals a soul that came here with a specific and beautiful purpose. The universe has been guiding you here.</p>
          </div>
        )}

        {/* STEP 4: Intention */}
        {step === 4 && (
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem', textAlign: 'center' }}>Set Your Intention</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem' }}>What are you calling in with SynchroSoul?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {INTENTIONS.map(i => (
                <button key={i.text} onClick={() => setIntention(i.text)} style={{
                  background: intention === i.text ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
                  border: intention === i.text ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '1rem', padding: '0.875rem 1rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.875rem', textAlign: 'left'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>{i.emoji}</span>
                  <span style={{ color: intention === i.text ? '#c9a84c' : 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{i.text}</span>
                  {intention === i.text && <span style={{ marginLeft: 'auto', color: '#c9a84c' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Complete */}
        {step === 5 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 1.5rem',
              background: 'radial-gradient(circle, rgba(201,168,76,0.4) 0%, rgba(139,92,246,0.2) 60%, transparent 100%)',
              border: '2px solid rgba(201,168,76,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem',
              boxShadow: '0 0 60px rgba(201,168,76,0.3)'
            }}>✦</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.75rem' }}>You Are Aligned</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>Your cosmic profile is set. The universe is ready to speak to you through numbers. Begin logging the angel numbers you see — your journey starts now.</p>
            <button onClick={() => router.push('/dashboard')} style={{
              width: '100%', padding: '1rem', borderRadius: '999px', cursor: 'pointer',
              background: 'linear-gradient(135deg, #c9a84c, #8b5cf6)',
              color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 700
            }}>Enter Your Dashboard ✦</button>
          </div>
        )}

        {/* Navigation */}
        {step < 5 && (
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem' }}>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} style={{
                flex: 1, padding: '0.875rem', borderRadius: '999px', cursor: 'pointer',
                background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
                border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem'
              }}>← Back</button>
            )}
            <button
              onClick={goNext}
              disabled={(step === 1 && !name) || (step === 2 && !birthdate) || (step === 4 && !intention)}
              style={{
                flex: 2, padding: '0.875rem', borderRadius: '999px', cursor: 'pointer',
                background: ((step === 1 && !name) || (step === 2 && !birthdate) || (step === 4 && !intention))
                  ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #c9a84c, #8b5cf6)',
                color: ((step === 1 && !name) || (step === 2 && !birthdate) || (step === 4 && !intention))
                  ? 'rgba(255,255,255,0.3)' : '#fff',
                border: 'none', fontSize: '0.95rem', fontWeight: 700
              }}
            >{step === 0 ? 'Begin My Journey ✦' : step === 2 ? 'Reveal My Numbers' : step === 4 ? 'Complete Setup' : 'Continue →'}</button>
          </div>
        )}
      </div>
    </div>
  );
}