'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/lib/theme-context'

const WELCOME_SEEN_KEY = 'synchrosoul_welcome_seen'
const USER_TYPE_KEY = 'synchrosoul_user_type'

type UserType = 'seeker' | 'musician' | 'healer' | 'explorer' | '';

interface TourStep {
  emoji: string;
  title: string;
  body: string;
  action: string;
}

function getSeekerSteps(): TourStep[] {
  return [
    {
      emoji: '✨',
      title: 'Welcome, Spiritual Seeker!',
      body: 'Your healing journey starts here. SynchroSoul helps you track angel numbers, decode divine messages, interpret dreams, and align with your highest self.',
      action: 'Show me how →',
    },
    {
      emoji: '🔢',
      title: 'Log Your First Angel Number',
      body: 'Have you been seeing repeating numbers like 111, 444, or 1111? That\'s the universe communicating with you! Tap the number pad below, enter the number, and add a thought about what you were feeling.',
      action: 'Got it →',
    },
    {
      emoji: '🔮',
      title: 'Get Your Personalized Reading',
      body: 'After logging your number, the Oracle will deliver a personalized spiritual reading — plus a healing song recommendation matched to your energy. The more you log, the deeper the connection.',
      action: 'Let\'s begin! ✨',
    },
  ];
}

function getMusicianSteps(): TourStep[] {
  return [
    {
      emoji: '🎵',
      title: 'Welcome, Musical Healer!',
      body: 'SynchroSoul connects your music with souls who need it most. When users receive spiritual readings, the Oracle recommends songs that match their energy — and yours could be one of them.',
      action: 'Show me how →',
    },
    {
      emoji: '🎤',
      title: 'Set Up Your Artist Profile',
      body: 'Head to the Musical Healers section to create your profile. Add your bio, streaming links, and upload your music. The Oracle uses your song descriptions to match them with the right listeners.',
      action: 'Got it →',
    },
    {
      emoji: '✨',
      title: 'Your Music Finds Its Audience',
      body: 'As you add songs and tag them with moods and themes, the Oracle will recommend your music to users at exactly the right moment in their spiritual journey. Start by exploring the app, then set up your profile!',
      action: 'Let\'s go! 🎵',
    },
  ];
}

function getHealerSteps(): TourStep[] {
  return [
    {
      emoji: '✋',
      title: 'Welcome, Healer!',
      body: 'SynchroSoul helps you connect with souls seeking healing in your area. Set up your practitioner profile so seekers can find and connect with you.',
      action: 'Show me how →',
    },
    {
      emoji: '🏠',
      title: 'Create Your Healer Listing',
      body: 'Visit the Local Healers section to add your practice. Include your specialties, location, and how people can reach you. Your listing will be visible to spiritual seekers nearby.',
      action: 'Got it →',
    },
    {
      emoji: '🌟',
      title: 'Connect & Explore',
      body: 'While you\'re here, try logging an angel number yourself! SynchroSoul is a healing tool for everyone — practitioners and seekers alike. The Oracle\'s readings might surprise you.',
      action: 'Let\'s begin! ✋',
    },
  ];
}

function getExplorerSteps(): TourStep[] {
  return [
    {
      emoji: '✨',
      title: 'Welcome to SynchroSoul!',
      body: 'You\'re about to explore a world of angel numbers, spiritual readings, dream interpretation, healing music, and more. No experience needed — just curiosity.',
      action: 'Show me around →',
    },
    {
      emoji: '🔢',
      title: 'Start With an Angel Number',
      body: 'The easiest way to begin is by logging a number you\'ve been noticing — like 11:11 on a clock, 444 on a license plate, or any repeating pattern. Tap the number pad below and try it!',
      action: 'Got it →',
    },
    {
      emoji: '🌌',
      title: 'Discover Everything',
      body: 'From there, explore the Oracle, dream journal, numerology tools, meditation, cosmic weather, and more. There\'s no wrong way to use SynchroSoul — follow what calls to you.',
      action: 'Let\'s explore! ✨',
    },
  ];
}

function getSimSteps(): TourStep[] {
  return [
    {
      emoji: '⚡',
      title: 'WELCOME TO THE GRID',
      body: 'You are now connected to the SynchroSoul network. This system tracks frequency patterns, decodes transmissions, and maps your synchronicity matrix.',
      action: 'INITIALIZE →',
    },
    {
      emoji: '🔢',
      title: 'LOG A FREQUENCY',
      body: 'Start by logging a repeating number pattern. Tap the number pad below, enter a sequence (like 1111, 444, or 555), and add what you were processing when it appeared.',
      action: 'UNDERSTOOD →',
    },
    {
      emoji: '🔮',
      title: 'DECODE YOUR SIGNAL',
      body: 'After logging, the Oracle will analyze your frequency and generate a personalized transmission. The more you log, the deeper the system maps your patterns.',
      action: 'BEGIN LOGGING',
    },
  ];
}

function getStepsForType(userType: UserType, isSim: boolean): TourStep[] {
  if (isSim) return getSimSteps();
  switch (userType) {
    case 'musician': return getMusicianSteps();
    case 'healer': return getHealerSteps();
    case 'explorer': return getExplorerSteps();
    case 'seeker':
    default: return getSeekerSteps();
  }
}

function getTipForType(userType: UserType, isSim: boolean): string {
  if (isSim) return 'Tip: The number pad is on your dashboard. Start logging frequencies.';
  switch (userType) {
    case 'musician': return 'Tip: Find Musical Healers in the Explore menu to set up your artist profile!';
    case 'healer': return 'Tip: Find Local Healers in the Explore menu to create your listing!';
    case 'explorer': return 'Tip: Look for the number pad on your dashboard to log your first number!';
    case 'seeker':
    default: return 'Tip: Look for the number pad on your dashboard to log your first number!';
  }
}

export default function WelcomeTour() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)
  const [userType, setUserType] = useState<UserType>('')
  const { theme } = useTheme()
  const isSim = theme === 'simulation'

  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_SEEN_KEY)
    if (!seen) {
      const storedType = localStorage.getItem(USER_TYPE_KEY) as UserType || ''
      setUserType(storedType)
      const timer = setTimeout(() => setShow(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, 'true')
    setShow(false)
  }

  if (!show) return null

  const steps = getStepsForType(userType, isSim)
  const current = steps[step]

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: '1.5rem',
    }} onClick={(e) => e.target === e.currentTarget && dismiss()}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,10,40,0.98), rgba(25,15,50,0.98))',
        border: '1px solid rgba(167,139,250,0.3)',
        borderRadius: '1.5rem', padding: '2rem', maxWidth: '380px', width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(167,139,250,0.1)',
        textAlign: 'center', position: 'relative',
      }}>
        {/* Skip button */}
        <button onClick={dismiss} style={{
          position: 'absolute', top: '0.75rem', right: '1rem',
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
          fontSize: '0.8rem', cursor: 'pointer',
        }}>Skip</button>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: i === step ? 'rgba(167,139,250,0.9)' : 'rgba(255,255,255,0.15)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {/* Emoji */}
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{current.emoji}</div>

        {/* Title */}
        <h2 style={{
          fontSize: '1.3rem', fontWeight: 700, color: '#fff',
          margin: '0 0 0.75rem', letterSpacing: isSim ? '0.1em' : '0',
        }}>{current.title}</h2>

        {/* Body */}
        <p style={{
          fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.6, margin: '0 0 1.5rem',
        }}>{current.body}</p>

        {/* Action button */}
        <button onClick={() => {
          if (step < steps.length - 1) {
            setStep(step + 1)
          } else {
            dismiss()
          }
        }} style={{
          width: '100%', padding: '0.85rem', borderRadius: '999px',
          background: 'linear-gradient(135deg, #a78bfa, #c9a84c)',
          border: 'none', color: '#fff', fontSize: '1rem',
          fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(167,139,250,0.3)',
        }}>{current.action}</button>

        {/* Helpful tip on last step */}
        {step === steps.length - 1 && (
          <p style={{
            fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)',
            marginTop: '0.75rem',
          }}>{getTipForType(userType, isSim)}</p>
        )}
      </div>
    </div>
  )
}
