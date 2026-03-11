'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { calcLifePath, calcSoulUrge, calcDestiny, getLifePathData } from '@/lib/numerology';
import { upsertProfile } from '@/lib/supabase-db';
import { saveNumerologyProfile } from '@/lib/storage';

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
  const [saving, setSaving] = useState(false);
  const [nums, setNums] = useState<{lp:number,su:number,de:number}|null>(null);

  const next = () => {
    if (step === 2 && birthdate && name) {
      setNums({ lp: calcLifePath(birthdate), su: calcSoulUrge(name), de: calcDestiny(name) });
    }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const complete = async () => {
    setSaving(true);
    try {
      // Save to localStorage
      if (birthdate && name) {
        const lp = calcLifePath(birthdate);
        const su = calcSoulUrge(name);
        const de = calcDestiny(name);
        const lpd = getLifePathData(lp);
        await saveNumerologyProfile({ lifePath: lp, lifePathMeaning: lpd.meaning, lifePathColor: lpd.color, soulUrge: su, destiny: de, birthdate });
        // Save to Supabase
        await upsertProfile({
          display_name: name,
          birth_date: birthdate,
          life_path: lp,
          soul_urge: su,
          destiny: de,
          intention: intention,
          onboarding_complete: true,
        } as any);
      }
      // Set cookie so proxy knows onboarding is done
      document.cookie = 'onboarding_complete=true; path=/; max-age=31536000';
    } catch (e) {
      console.error('Onboarding save error:', e);
    } finally {
      setSaving(false);
      router.push('/dashboard');
    }
  };

  const progress = ((step) / (STEPS.length - 1)) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050510 0%, #0a0520 50%, #050510 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: '480px', marginBottom: '2rem' }}>
        <div style={{ height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: progress + '%', background: 'linear-gradient(90deg, #9b59b6, #c9a84c)',
            borderRadius: '999px', transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>Step {step + 1} of {STEPS.length}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{STEPS[step].title}</span>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '480px', background: 'rgba(8,6,28,0.9)',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '2.5rem 2rem',
        backdropFilter: 'blur(20px)' }}>

        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>Welcome to SynchroSoul</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '2rem' }}>
              You are about to discover your cosmic blueprint and connect with souls vibrating on the same frequency.
              This will only take 2 minutes.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem', textAlign: 'left' }}>
              {['Log angel numbers you see daily', 'Get your complete numerology blueprint', 'Match with souls on the same frequency', 'Receive daily cosmic guidance'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem',
                  color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                  <span style={{ color: '#c9a84c', fontSize: '0.8rem' }}>✔</span>{f}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: Name */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌟</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#fff', fontWeight: 700 }}>Your Sacred Name</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Used to calculate your Soul Urge and Destiny numbers</p>
            </div>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Enter your full birth name"
              style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem',
                outline: 'none', boxSizing: 'border-box' }} />
          </div>
        )}

        {/* STEP 2: Birthdate */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎂</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#fff', fontWeight: 700 }}>Your Birth Blueprint</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>Your birthdate reveals your Life Path number</p>
            </div>
            <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)}
              style={{ width: '100%', padding: '0.9rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem',
                outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
          </div>
        )}

        {/* STEP 3: Numbers reveal */}
        {step === 3 && nums && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔮</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#fff', fontWeight: 700, marginBottom: '0.5rem' }}>Your Cosmic Numbers</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>These numbers define your spiritual path</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[['Life Path', nums.lp, '#c9a84c'], ['Soul Urge', nums.su, '#a78bfa'], ['Destiny', nums.de, '#60a5fa']].map(([label, num, color]) => (
                <div key={String(label)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid ' + color + '30',
                  borderRadius: '16px', padding: '1.25rem 0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: color + '80', marginBottom: '0.4rem' }}>{label}</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 300, color: String(color),
                    fontFamily: 'Cormorant Garamond, serif', lineHeight: 1,
                    textShadow: '0 0 20px ' + color + '60' }}>{num}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Intention */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🎯</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: '#fff', fontWeight: 700 }}>Set Your Intention</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.5rem' }}>What brings you to SynchroSoul?</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {INTENTIONS.map(i => (
                <button key={i.text} onClick={() => setIntention(i.text)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem',
                    borderRadius: '12px', border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: intention === i.text ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)',
                    outline: intention === i.text ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    color: intention === i.text ? '#c9a84c' : 'rgba(255,255,255,0.7)',
                    fontSize: '0.9rem', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: '1.2rem' }}>{i.emoji}</span>
                  <span>{i.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Complete */}
        {step === 5 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>🌟</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#fff', fontWeight: 700, marginBottom: '1rem' }}>You Are Aligned</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Your cosmic profile is ready. The universe has been waiting for you.
              Start logging angel numbers to find your soul connections.
            </p>
            {nums && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ padding: '0.3rem 0.8rem', borderRadius: '999px', background: 'rgba(201,168,76,0.15)',
                  border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontSize: '0.8rem' }}>LP {nums.lp}</span>
                <span style={{ padding: '0.3rem 0.8rem', borderRadius: '999px', background: 'rgba(167,139,250,0.15)',
                  border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', fontSize: '0.8rem' }}>SU {nums.su}</span>
                <span style={{ padding: '0.3rem 0.8rem', borderRadius: '999px', background: 'rgba(96,165,250,0.15)',
                  border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', fontSize: '0.8rem' }}>DE {nums.de}</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
          {step > 0 && step < 5 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
              Back
            </button>
          )}
          {step < 5 ? (
            <button onClick={next}
              disabled={(step === 1 && !name.trim()) || (step === 2 && !birthdate)}
              style={{ flex: 2, padding: '0.85rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(155,89,182,0.6), rgba(201,168,76,0.6))',
                color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                opacity: ((step === 1 && !name.trim()) || (step === 2 && !birthdate)) ? 0.4 : 1 }}>
              {step === 0 ? 'Begin My Journey ✨' : 'Continue →'}
            </button>
          ) : (
            <button onClick={complete} disabled={saving}
              style={{ flex: 1, padding: '0.85rem', borderRadius: '12px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #9b59b6, #c9a84c)',
                color: '#fff', fontSize: '0.95rem', fontWeight: 700,
                boxShadow: '0 4px 20px rgba(201,168,76,0.3)' }}>
              {saving ? 'Saving...' : 'Enter the Cosmos ✨'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
