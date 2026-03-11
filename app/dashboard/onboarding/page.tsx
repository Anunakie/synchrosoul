'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { calcLifePath, calcSoulUrge, calcDestiny, getLifePathData } from '@/lib/numerology';
import { upsertProfile } from '@/lib/supabase-db';
import { saveNumerologyProfile } from '@/lib/storage';
import { requestNotificationPermission, scheduleDailyReminder, savePushSettings } from '@/lib/push-notifications';

const INTENTIONS = [
  { emoji: '💕', text: 'Find my soul mate or twin flame' },
  { emoji: '🌱', text: 'Manifest my dream life' },
  { emoji: '🔮', text: 'Deepen my spiritual practice' },
  { emoji: '💫', text: 'Understand my life purpose' },
  { emoji: '🌿', text: 'Heal and restore my energy' },
  { emoji: '✨', text: 'Connect with like-minded souls' },
];

const STEPS = [
  'welcome', 'name', 'birthdate', 'numbers', 'intention', 'notifications', 'complete'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [intention, setIntention] = useState('');
  const [saving, setSaving] = useState(false);
  const [nums, setNums] = useState<{lp:number,su:number,de:number}|null>(null);
  const [notifStatus, setNotifStatus] = useState<'idle'|'granted'|'denied'|'skipped'>('idle');
  const [animating, setAnimating] = useState(false);

  const goNext = () => {
    if (animating) return;
    if (step === 2 && birthdate && name) {
      setNums({ lp: calcLifePath(birthdate), su: calcSoulUrge(name), de: calcDestiny(name) });
    }
    setDir(1);
    setAnimating(true);
    setTimeout(() => {
      setStep(s => Math.min(s + 1, STEPS.length - 1));
      setAnimating(false);
    }, 220);
  };

  const goBack = () => {
    if (animating || step === 0) return;
    setDir(-1);
    setAnimating(true);
    setTimeout(() => {
      setStep(s => Math.max(s - 1, 0));
      setAnimating(false);
    }, 220);
  };

  const handleNotifications = async (enable: boolean) => {
    if (enable) {
      const perm = await requestNotificationPermission();
      if (perm === 'granted') {
        savePushSettings({ enabled: true, hour: 9, minute: 0 });
        scheduleDailyReminder(9, 0);
        setNotifStatus('granted');
      } else {
        setNotifStatus('denied');
      }
    } else {
      setNotifStatus('skipped');
    }
    setTimeout(goNext, 600);
  };

  const complete = async () => {
    setSaving(true);
    try {
      if (birthdate && name) {
        const lp = calcLifePath(birthdate);
        const su = calcSoulUrge(name);
        const de = calcDestiny(name);
        const lpd = getLifePathData(lp);
        await saveNumerologyProfile({ lifePath: lp, lifePathMeaning: lpd.meaning, lifePathColor: lpd.color, soulUrge: su, destiny: de, birthdate });
        await upsertProfile({ display_name: name, birth_date: birthdate, life_path: lp, soul_urge: su, destiny: de, intention, onboarding_complete: true } as any);
      }
      document.cookie = 'onboarding_complete=true; path=/; max-age=31536000';
    } catch (e) { console.error(e); }
    finally {
      setSaving(false);
      router.push('/dashboard');
    }
  };

  const lpData = nums ? getLifePathData(nums.lp) : null;
  const progress = (step / (STEPS.length - 1)) * 100;

  const cardStyle: React.CSSProperties = {
    opacity: animating ? 0 : 1,
    transform: animating ? `translateX(${dir * 40}px)` : 'translateX(0)',
    transition: 'opacity 0.22s ease, transform 0.22s ease',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 30% 20%, rgba(120,40,200,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(60,20,120,0.15) 0%, transparent 60%), linear-gradient(135deg, #050510 0%, #0a0520 50%, #050510 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1.25rem', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden',
    }}>

      {/* Floating orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,181,253,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ position: 'absolute', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(200,180,255,0.5)', letterSpacing: '0.1em' }}>SYNCHROSOUL</span>
      </div>

      {/* Progress dots */}
      <div style={{ position: 'absolute', top: '3.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '0.4rem' }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: i === step ? '1.5rem' : '0.4rem', height: '0.4rem',
            borderRadius: '9999px',
            background: i <= step ? 'rgba(167,139,250,0.8)' : 'rgba(167,139,250,0.2)',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '420px', ...cardStyle }}>

        {/* STEP 0: Welcome */}
        {step === 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.4))' }}>✦</div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.5rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '1rem', lineHeight: 1.2 }}>Welcome to<br/>SynchroSoul</h1>
            <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>The universe has been sending you signs.<br/>It is time to decode them together.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {['Log angel numbers you see daily', 'Discover your numerology blueprint', 'Match with souls on your frequency'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.12)', borderRadius: '0.75rem', padding: '0.75rem 1rem' }}>
                  <span style={{ color: 'rgba(167,139,250,0.7)', fontSize: '1rem' }}>✦</span>
                  <span style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.9rem' }}>{t}</span>
                </div>
              ))}
            </div>
            <button onClick={goNext} style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', border: 'none', borderRadius: '1rem', color: 'white', fontSize: '1rem', fontWeight: 500, padding: '1rem', cursor: 'pointer', letterSpacing: '0.05em' }}>
              Begin My Journey
            </button>
          </div>
        )}

        {/* STEP 1: Name */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌟</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.5rem' }}>Your Sacred Name</h2>
              <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.9rem' }}>Used to calculate your Soul Urge and Destiny numbers</p>
            </div>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Enter your full birth name"
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '1.1rem', padding: '1rem 1.25rem', outline: 'none', marginBottom: '1.5rem', boxSizing: 'border-box', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em' }}
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={goBack} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1rem', color: 'rgba(180,160,255,0.6)', fontSize: '0.9rem', padding: '0.875rem', cursor: 'pointer' }}>Back</button>
              <button onClick={goNext} disabled={!name.trim()} style={{ flex: 2, background: name.trim() ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(167,139,250,0.15)', border: 'none', borderRadius: '1rem', color: name.trim() ? 'white' : 'rgba(167,139,250,0.4)', fontSize: '0.95rem', fontWeight: 500, padding: '0.875rem', cursor: name.trim() ? 'pointer' : 'not-allowed' }}>Continue</button>
            </div>
          </div>
        )}

        {/* STEP 2: Birthdate */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🌙</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.5rem' }}>Your Birth Blueprint</h2>
              <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.9rem' }}>The date you arrived in this dimension</p>
            </div>
            <input
              type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '1.1rem', padding: '1rem 1.25rem', outline: 'none', marginBottom: '1.5rem', boxSizing: 'border-box', colorScheme: 'dark' }}
            />
            {birthdate && (
              <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '0.875rem', padding: '0.875rem 1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                <span style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.8rem' }}>Life Path Preview: </span>
                <span style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond, serif' }}>{calcLifePath(birthdate)}</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={goBack} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1rem', color: 'rgba(180,160,255,0.6)', fontSize: '0.9rem', padding: '0.875rem', cursor: 'pointer' }}>Back</button>
              <button onClick={goNext} disabled={!birthdate} style={{ flex: 2, background: birthdate ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(167,139,250,0.15)', border: 'none', borderRadius: '1rem', color: birthdate ? 'white' : 'rgba(167,139,250,0.4)', fontSize: '0.95rem', fontWeight: 500, padding: '0.875rem', cursor: birthdate ? 'pointer' : 'not-allowed' }}>Reveal My Numbers</button>
            </div>
          </div>
        )}

        {/* STEP 3: Numbers reveal */}
        {step === 3 && nums && lpData && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✨</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.5rem' }}>Your Cosmic Numbers</h2>
            <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.85rem', marginBottom: '2rem' }}>These are the frequencies you carry</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                { label: 'Life Path', num: nums.lp, desc: lpData.meaning, color: lpData.color },
                { label: 'Soul Urge', num: nums.su, desc: 'Your inner desires and motivations', color: '#c084fc' },
                { label: 'Destiny', num: nums.de, desc: 'Your life purpose and direction', color: '#818cf8' },
              ].map(({ label, num, desc, color }) => (
                <div key={label} style={{ background: 'rgba(167,139,250,0.06)', border: `1px solid ${color}30`, borderRadius: '1rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: `${color}20`, border: `1px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color, fontWeight: 500 }}>{num}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(180,160,255,0.45)', marginBottom: '0.2rem' }}>{label}</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(210,190,255,0.8)', lineHeight: 1.4 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={goBack} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1rem', color: 'rgba(180,160,255,0.6)', fontSize: '0.9rem', padding: '0.875rem', cursor: 'pointer' }}>Back</button>
              <button onClick={goNext} style={{ flex: 2, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', border: 'none', borderRadius: '1rem', color: 'white', fontSize: '0.95rem', fontWeight: 500, padding: '0.875rem', cursor: 'pointer' }}>This is me ✦</button>
            </div>
          </div>
        )}

        {/* STEP 4: Intention */}
        {step === 4 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.5rem' }}>Set Your Intention</h2>
              <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.9rem' }}>What calls you here?</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {INTENTIONS.map(({ emoji, text }) => (
                <button key={text} onClick={() => setIntention(text)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  background: intention === text ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${intention === text ? 'rgba(167,139,250,0.4)' : 'rgba(200,180,255,0.08)'}`,
                  borderRadius: '0.875rem', padding: '0.875rem 1rem', cursor: 'pointer', textAlign: 'left', width: '100%',
                }}>
                  <span style={{ fontSize: '1.3rem' }}>{emoji}</span>
                  <span style={{ color: intention === text ? 'rgba(220,200,255,0.9)' : 'rgba(180,160,255,0.65)', fontSize: '0.9rem' }}>{text}</span>
                  {intention === text && <span style={{ marginLeft: 'auto', color: 'rgba(167,139,250,0.8)' }}>✓</span>}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={goBack} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1rem', color: 'rgba(180,160,255,0.6)', fontSize: '0.9rem', padding: '0.875rem', cursor: 'pointer' }}>Back</button>
              <button onClick={goNext} disabled={!intention} style={{ flex: 2, background: intention ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(167,139,250,0.15)', border: 'none', borderRadius: '1rem', color: intention ? 'white' : 'rgba(167,139,250,0.4)', fontSize: '0.95rem', fontWeight: 500, padding: '0.875rem', cursor: intention ? 'pointer' : 'not-allowed' }}>Set Intention</button>
            </div>
          </div>
        )}

        {/* STEP 5: Notifications */}
        {step === 5 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔔</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.75rem' }}>Daily Cosmic Reminders</h2>
            <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>Let us gently remind you to log your angel numbers each day. The universe speaks in patterns — we will help you catch them.</p>
            {notifStatus === 'idle' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button onClick={() => handleNotifications(true)} style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', border: 'none', borderRadius: '1rem', color: 'white', fontSize: '0.95rem', fontWeight: 500, padding: '1rem', cursor: 'pointer' }}>Yes, remind me daily ✦</button>
                <button onClick={() => handleNotifications(false)} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem', color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', padding: '0.875rem', cursor: 'pointer' }}>Maybe later</button>
              </div>
            )}
            {notifStatus === 'granted' && (
              <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '1rem', padding: '1rem', color: 'rgba(134,239,172,0.9)', fontSize: '0.9rem' }}>✓ Daily reminders set for 9:00 AM</div>
            )}
            {(notifStatus === 'denied' || notifStatus === 'skipped') && (
              <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '1rem', padding: '1rem', color: 'rgba(180,160,255,0.6)', fontSize: '0.85rem' }}>You can enable reminders anytime in Settings</div>
            )}
          </div>
        )}

        {/* STEP 6: Complete */}
        {step === 6 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 0 30px rgba(167,139,250,0.5))' }}>✦</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.75rem' }}>You Are Aligned</h2>
            <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>Welcome, <strong style={{ color: 'rgba(220,200,255,0.85)' }}>{name}</strong>.</p>
            <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>Your cosmic blueprint is ready. The universe has been waiting for you to arrive.</p>
            {nums && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                {[{n: nums.lp, l: 'Life Path'}, {n: nums.su, l: 'Soul Urge'}, {n: nums.de, l: 'Destiny'}].map(({n, l}) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem' }}>
                      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(200,180,255,0.9)' }}>{n}</span>
                    </div>
                    <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(180,160,255,0.4)' }}>{l}</div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={complete} disabled={saving} style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', border: 'none', borderRadius: '1rem', color: 'white', fontSize: '1rem', fontWeight: 500, padding: '1rem', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Entering the cosmos...' : 'Enter SynchroSoul ✦'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
