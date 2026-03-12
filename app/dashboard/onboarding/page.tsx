'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { calcLifePath, calcSoulUrge, calcDestiny, getLifePathData } from '@/lib/numerology';
import { upsertProfile } from '@/lib/supabase-db';
import { saveNumerologyProfile } from '@/lib/storage';
import { requestNotificationPermission, scheduleDailyReminder, savePushSettings } from '@/lib/push-notifications';
import StarField from '@/components/StarField';

const INTENTIONS = [
  { emoji: '💕', text: 'Find my soul mate or twin flame' },
  { emoji: '🌱', text: 'Manifest my dream life' },
  { emoji: '🔮', text: 'Deepen my spiritual practice' },
  { emoji: '💫', text: 'Understand my life purpose' },
  { emoji: '🌿', text: 'Heal and restore my energy' },
  { emoji: '✨', text: 'Connect with like-minded souls' },
];

const STEPS = ['welcome', 'name', 'birthdate', 'numbers', 'intention', 'notifications', 'complete'];
const STEP_LABELS = ['Welcome', 'Your Name', 'Birthdate', 'Your Numbers', 'Intention', 'Reminders', 'Complete'];

function useCountUp(target: number, duration: number = 1200, active: boolean = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) { setValue(0); return; }
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return value;
}

function AnimatedNumber({ target, active, color }: { target: number; active: boolean; color: string }) {
  const val = useCountUp(target, 1000, active);
  return (
    <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color, fontWeight: 600,
      textShadow: `0 0 20px ${color}60`, transition: 'all 0.3s' }}>
      {val}
    </span>
  );
}

function Particles({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: Array<{x:number;y:number;vx:number;vy:number;life:number;color:string;size:number}> = [];
    const colors = ['#a78bfa','#c084fc','#818cf8','#f0abfc','#c9a84c','#ffffff'];
    for (let i = 0; i < 80; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const speed = 2 + Math.random() * 5;
      particles.push({
        x: canvas.width / 2, y: canvas.height / 2,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 3,
        life: 1, color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4,
      });
    }
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.life -= 0.015;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      if (particles.some(p => p.life > 0)) animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }} />;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [intention, setIntention] = useState('');
  const [saving, setSaving] = useState(false);
  const [nums, setNums] = useState<{lp:number;su:number;de:number}|null>(null);
  const [notifStatus, setNotifStatus] = useState<'idle'|'granted'|'denied'|'skipped'>('idle');
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [numbersActive, setNumbersActive] = useState(false);

  useEffect(() => {
    // Check if already completed
    const done = document.cookie.includes('onboarding_complete=true');
    if (done) { router.push('/dashboard'); return; }
    setTimeout(() => setVisible(true), 100);
  }, [router]);

  useEffect(() => {
    if (step === 3) setTimeout(() => setNumbersActive(true), 300);
    else setNumbersActive(false);
    if (step === 6) setTimeout(() => setShowParticles(true), 400);
  }, [step]);

  const transition = (newStep: number, direction: number) => {
    if (animating) return;
    setDir(direction);
    setAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setAnimating(false);
    }, 280);
  };

  const goNext = () => {
    if (step === 2 && birthdate && name) {
      setNums({ lp: calcLifePath(birthdate), su: calcSoulUrge(name), de: calcDestiny(name) });
    }
    transition(Math.min(step + 1, STEPS.length - 1), 1);
  };

  const goBack = () => {
    if (step === 0) return;
    transition(Math.max(step - 1, 0), -1);
  };

  const skip = () => transition(Math.min(step + 1, STEPS.length - 1), 1);

  const handleNotifications = async (enable: boolean) => {
    if (enable) {
      const perm = await requestNotificationPermission();
      if (perm === 'granted') {
        savePushSettings({ enabled: true, hour: 9, minute: 0 });
        scheduleDailyReminder(9, 0);
        setNotifStatus('granted');
      } else setNotifStatus('denied');
    } else setNotifStatus('skipped');
    setTimeout(goNext, 700);
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
    finally { setSaving(false); router.push('/dashboard'); }
  };

  const lpData = nums ? getLifePathData(nums.lp) : null;
  const progress = (step / (STEPS.length - 1)) * 100;

  const cardStyle: React.CSSProperties = {
    opacity: animating ? 0 : 1,
    transform: animating
      ? `translateX(${dir * 50}px) scale(0.97)`
      : 'translateX(0) scale(1)',
    transition: 'opacity 0.28s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1)',
  };

  const pageStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 0.6s ease, transform 0.6s ease',
  };

  const skippable = step === 4 || step === 5;

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '5rem 1.25rem 2rem', fontFamily: 'system-ui, sans-serif' }}>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes pulse-glow { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes stagger-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        .float-icon { animation: float 3s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .stagger-item { animation: stagger-in 0.4s ease forwards; opacity: 0; }
        .stagger-item:nth-child(1){animation-delay:0.05s}
        .stagger-item:nth-child(2){animation-delay:0.1s}
        .stagger-item:nth-child(3){animation-delay:0.15s}
        .stagger-item:nth-child(4){animation-delay:0.2s}
        .stagger-item:nth-child(5){animation-delay:0.25s}
        .stagger-item:nth-child(6){animation-delay:0.3s}
        .shimmer-btn {
          background: linear-gradient(90deg, #7c3aed 0%, #a78bfa 40%, #c084fc 60%, #7c3aed 100%);
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.7) sepia(1) saturate(2) hue-rotate(220deg); cursor: pointer; }
      `}</style>

      {/* StarField background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <StarField />
      </div>

      {/* Dark overlay */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 1,
        background: 'radial-gradient(ellipse at 30% 20%, rgba(120,40,200,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(60,20,120,0.12) 0%, transparent 60%), rgba(5,5,16,0.55)' }} />

      {/* Particles on completion */}
      <Particles active={showParticles} />

      {/* Header */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
        background: 'rgba(5,5,16,0.6)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(167,139,250,0.08)' }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '0.9rem',
          color: 'rgba(200,180,255,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>SynchroSoul</span>
        {/* Progress bar */}
        <div style={{ width: '100%', maxWidth: '420px', height: '3px',
          background: 'rgba(167,139,250,0.12)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`,
            background: 'linear-gradient(90deg, #7c3aed, #a78bfa, #c084fc)',
            borderRadius: '9999px', transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
            boxShadow: '0 0 8px rgba(167,139,250,0.6)' }} />
        </div>
        {/* Step label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'rgba(167,139,250,0.4)', letterSpacing: '0.1em' }}>
            {step + 1} / {STEPS.length}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'rgba(167,139,250,0.6)', letterSpacing: '0.05em' }}>
            {STEP_LABELS[step]}
          </span>
        </div>
      </div>

      {/* Main card */}
      <div style={{ position: 'relative', zIndex: 5, width: '100%', maxWidth: '440px', ...pageStyle }}>
        <div style={cardStyle}>

          {/* STEP 0: Welcome */}
          {step === 0 && (
            <div style={{ textAlign: 'center' }}>
              <div className="float-icon" style={{ fontSize: '4.5rem', marginBottom: '1.5rem',
                filter: 'drop-shadow(0 0 30px rgba(167,139,250,0.5))' }}>✶</div>
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(2rem,6vw,2.8rem)',
                fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                Welcome to<br/>SynchroSoul
              </h1>
              <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.95rem', lineHeight: 1.8,
                marginBottom: '2rem' }}>
                The universe has been sending you signs.<br/>It is time to decode them together.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '2rem' }}>
                {[
                  { icon: '✨', text: 'Log angel numbers you see daily' },
                  { icon: '🔮', text: 'Discover your numerology blueprint' },
                  { icon: '🌌', text: 'Match with souls on your frequency' },
                ].map((item, i) => (
                  <div key={i} className="stagger-item" style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.14)',
                    borderRadius: '0.875rem', padding: '0.875rem 1.125rem',
                    backdropFilter: 'blur(8px)',
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <span style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.9rem' }}>{item.text}</span>
                  </div>
                ))}
              </div>
              <button onClick={goNext} className="shimmer-btn" style={{
                width: '100%', border: 'none', borderRadius: '1rem', color: 'white',
                fontSize: '1rem', fontWeight: 600, padding: '1.1rem', cursor: 'pointer',
                letterSpacing: '0.08em', boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
              }}>Begin My Journey ✶</button>
            </div>
          )}

          {/* STEP 1: Name */}
          {step === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div className="float-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300,
                  color: 'rgba(220,200,255,0.95)', marginBottom: '0.5rem' }}>Your Sacred Name</h2>
                <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.875rem' }}>
                  Used to calculate your Soul Urge & Destiny numbers
                </p>
              </div>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Enter your full birth name"
                autoFocus
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(167,139,250,0.3)', borderRadius: '0.875rem',
                  color: 'rgba(220,200,255,0.9)', fontSize: '1.1rem', padding: '1rem 1.25rem',
                  outline: 'none', marginBottom: '0.75rem', boxSizing: 'border-box',
                  fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em',
                  transition: 'border-color 0.2s',
                }}
              />
              <p style={{ color: 'rgba(167,139,250,0.4)', fontSize: '0.75rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                Use the name on your birth certificate for accuracy
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={goBack} style={{ flex: 1, background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem',
                  color: 'rgba(180,160,255,0.55)', fontSize: '0.9rem', padding: '0.875rem', cursor: 'pointer' }}>Back</button>
                <button onClick={goNext} disabled={!name.trim()} style={{
                  flex: 2, background: name.trim() ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(167,139,250,0.12)',
                  border: 'none', borderRadius: '1rem',
                  color: name.trim() ? 'white' : 'rgba(167,139,250,0.35)',
                  fontSize: '0.95rem', fontWeight: 500, padding: '0.875rem',
                  cursor: name.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s',
                }}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 2: Birthdate */}
          {step === 2 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div className="float-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌙</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300,
                  color: 'rgba(220,200,255,0.95)', marginBottom: '0.5rem' }}>Your Birth Blueprint</h2>
                <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.875rem' }}>
                  The moment you arrived in this dimension
                </p>
              </div>
              <input
                type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)}
                style={{ width: '100%', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(167,139,250,0.3)', borderRadius: '0.875rem',
                  color: 'rgba(220,200,255,0.9)', fontSize: '1.1rem', padding: '1rem 1.25rem',
                  outline: 'none', marginBottom: '1rem', boxSizing: 'border-box', colorScheme: 'dark',
                }}
              />
              {birthdate && (
                <div className="pulse-glow" style={{
                  background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)',
                  borderRadius: '0.875rem', padding: '0.875rem 1rem', marginBottom: '1.25rem',
                  textAlign: 'center', backdropFilter: 'blur(8px)',
                }}>
                  <span style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.8rem' }}>Life Path Preview: </span>
                  <span style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1.4rem',
                    fontFamily: 'Cormorant Garamond, serif', fontWeight: 600,
                    textShadow: '0 0 16px rgba(167,139,250,0.5)' }}>
                    {calcLifePath(birthdate)}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={goBack} style={{ flex: 1, background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem',
                  color: 'rgba(180,160,255,0.55)', fontSize: '0.9rem', padding: '0.875rem', cursor: 'pointer' }}>Back</button>
                <button onClick={goNext} disabled={!birthdate} style={{
                  flex: 2, background: birthdate ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(167,139,250,0.12)',
                  border: 'none', borderRadius: '1rem',
                  color: birthdate ? 'white' : 'rgba(167,139,250,0.35)',
                  fontSize: '0.95rem', fontWeight: 500, padding: '0.875rem',
                  cursor: birthdate ? 'pointer' : 'not-allowed', transition: 'all 0.3s',
                }}>Reveal My Numbers ✶</button>
              </div>
            </div>
          )}

          {/* STEP 3: Numbers reveal */}
          {step === 3 && nums && lpData && (
            <div style={{ textAlign: 'center' }}>
              <div className="float-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300,
                color: 'rgba(220,200,255,0.95)', marginBottom: '0.375rem' }}>Your Cosmic Numbers</h2>
              <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
                These are the frequencies you carry
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Life Path', num: nums.lp, desc: lpData.meaning, color: lpData.color },
                  { label: 'Soul Urge', num: nums.su, desc: 'Your inner desires and motivations', color: '#c084fc' },
                  { label: 'Destiny', num: nums.de, desc: 'Your life purpose and direction', color: '#818cf8' },
                ].map(({ label, num, desc, color }, i) => (
                  <div key={label} className="stagger-item" style={{
                    background: 'rgba(167,139,250,0.07)', border: `1px solid ${color}35`,
                    borderRadius: '1rem', padding: '1rem 1.25rem',
                    display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left',
                    backdropFilter: 'blur(8px)',
                    boxShadow: `0 0 20px ${color}10`,
                  }}>
                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%',
                      background: `${color}18`, border: `1px solid ${color}45`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      boxShadow: `0 0 16px ${color}30` }}>
                      <AnimatedNumber target={num} active={numbersActive} color={color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em',
                        color: 'rgba(180,160,255,0.4)', marginBottom: '0.25rem' }}>{label}</div>
                      <div style={{ fontSize: '0.85rem', color: 'rgba(210,190,255,0.8)', lineHeight: 1.4 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={goBack} style={{ flex: 1, background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem',
                  color: 'rgba(180,160,255,0.55)', fontSize: '0.9rem', padding: '0.875rem', cursor: 'pointer' }}>Back</button>
                <button onClick={goNext} style={{
                  flex: 2, background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                  border: 'none', borderRadius: '1rem', color: 'white',
                  fontSize: '0.95rem', fontWeight: 500, padding: '0.875rem', cursor: 'pointer',
                }}>This is me ✶</button>
              </div>
            </div>
          )}

          {/* STEP 4: Intention */}
          {step === 4 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div className="float-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300,
                  color: 'rgba(220,200,255,0.95)', marginBottom: '0.375rem' }}>Set Your Intention</h2>
                <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.875rem' }}>What calls you here?</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                {INTENTIONS.map(({ emoji, text }, i) => (
                  <button key={text} onClick={() => setIntention(text)} className="stagger-item" style={{
                    display: 'flex', alignItems: 'center', gap: '0.875rem',
                    background: intention === text ? 'rgba(167,139,250,0.18)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${intention === text ? 'rgba(167,139,250,0.45)' : 'rgba(200,180,255,0.08)'}`,
                    borderRadius: '0.875rem', padding: '0.875rem 1rem', cursor: 'pointer',
                    textAlign: 'left', width: '100%', transition: 'all 0.2s',
                    boxShadow: intention === text ? '0 0 16px rgba(167,139,250,0.15)' : 'none',
                  }}>
                    <span style={{ fontSize: '1.3rem' }}>{emoji}</span>
                    <span style={{ color: intention === text ? 'rgba(220,200,255,0.95)' : 'rgba(180,160,255,0.65)',
                      fontSize: '0.9rem', flex: 1 }}>{text}</span>
                    {intention === text && <span style={{ color: 'rgba(167,139,250,0.9)', fontSize: '1rem' }}>✓</span>}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={goBack} style={{ flex: 1, background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem',
                  color: 'rgba(180,160,255,0.55)', fontSize: '0.9rem', padding: '0.875rem', cursor: 'pointer' }}>Back</button>
                <button onClick={skip} style={{ flex: 1, background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem',
                  color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem', padding: '0.875rem', cursor: 'pointer' }}>Skip</button>
                <button onClick={goNext} disabled={!intention} style={{
                  flex: 2, background: intention ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(167,139,250,0.12)',
                  border: 'none', borderRadius: '1rem',
                  color: intention ? 'white' : 'rgba(167,139,250,0.35)',
                  fontSize: '0.95rem', fontWeight: 500, padding: '0.875rem',
                  cursor: intention ? 'pointer' : 'not-allowed', transition: 'all 0.3s',
                }}>Set Intention</button>
              </div>
            </div>
          )}

          {/* STEP 5: Notifications */}
          {step === 5 && (
            <div style={{ textAlign: 'center' }}>
              <div className="float-icon" style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🔔</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300,
                color: 'rgba(220,200,255,0.95)', marginBottom: '0.75rem' }}>Daily Cosmic Reminders</h2>
              <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.9rem', lineHeight: 1.8,
                marginBottom: '2rem' }}>
                Let us gently remind you to log your angel numbers each day.<br/>
                The universe speaks in patterns — we will help you catch them.
              </p>
              {notifStatus === 'idle' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button onClick={() => handleNotifications(true)} className="shimmer-btn" style={{
                    width: '100%', border: 'none', borderRadius: '1rem', color: 'white',
                    fontSize: '0.95rem', fontWeight: 600, padding: '1rem', cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
                  }}>Yes, remind me daily ✶</button>
                  <button onClick={() => handleNotifications(false)} style={{
                    width: '100%', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem',
                    color: 'rgba(180,160,255,0.45)', fontSize: '0.85rem', padding: '0.875rem', cursor: 'pointer',
                  }}>Maybe later</button>
                </div>
              )}
              {notifStatus === 'granted' && (
                <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)',
                  borderRadius: '1rem', padding: '1.25rem', color: 'rgba(134,239,172,0.9)', fontSize: '0.9rem' }}>
                  ✓ Daily reminders set for 9:00 AM
                </div>
              )}
              {(notifStatus === 'denied' || notifStatus === 'skipped') && (
                <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)',
                  borderRadius: '1rem', padding: '1.25rem', color: 'rgba(180,160,255,0.6)', fontSize: '0.85rem' }}>
                  You can enable reminders anytime in Settings
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Complete */}
          {step === 6 && (
            <div style={{ textAlign: 'center' }}>
              <div className="pulse-glow" style={{ fontSize: '5rem', marginBottom: '1.5rem',
                filter: 'drop-shadow(0 0 40px rgba(167,139,250,0.6))' }}>✶</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2.4rem', fontWeight: 300,
                color: 'rgba(220,200,255,0.98)', marginBottom: '0.75rem',
                textShadow: '0 0 30px rgba(167,139,250,0.3)' }}>You Are Aligned</h2>
              <p style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '0.5rem' }}>
                Welcome, <strong style={{ color: 'rgba(220,200,255,0.9)', fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.1rem' }}>{name}</strong>.
              </p>
              <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Your cosmic blueprint is ready.<br/>The universe has been waiting for you.
              </p>
              {nums && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                  {[{n: nums.lp, l: 'Life Path', c: lpData?.color || '#a78bfa'},
                    {n: nums.su, l: 'Soul Urge', c: '#c084fc'},
                    {n: nums.de, l: 'Destiny', c: '#818cf8'}].map(({n, l, c}) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <div style={{ width: '4rem', height: '4rem', borderRadius: '50%',
                        background: `${c}15`, border: `1px solid ${c}40`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 0.5rem', boxShadow: `0 0 20px ${c}25` }}>
                        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: c, fontWeight: 600 }}>{n}</span>
                      </div>
                      <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em',
                        color: 'rgba(180,160,255,0.4)' }}>{l}</div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={complete} disabled={saving} className={saving ? '' : 'shimmer-btn'} style={{
                width: '100%', border: 'none', borderRadius: '1rem', color: 'white',
                fontSize: '1rem', fontWeight: 600, padding: '1.1rem',
                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                background: saving ? 'rgba(124,58,237,0.5)' : undefined,
                boxShadow: saving ? 'none' : '0 4px 24px rgba(124,58,237,0.4)',
                letterSpacing: '0.05em',
              }}>
                {saving ? 'Entering the cosmos...' : 'Enter SynchroSoul ✶'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
