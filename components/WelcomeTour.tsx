'use client'
import { useState, useEffect } from 'react'
import { useTheme } from '@/lib/theme-context'

const WELCOME_SEEN_KEY = 'synchrosoul_welcome_seen'

export default function WelcomeTour() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)
  const { theme } = useTheme()
  const isSim = theme === 'simulation'

  useEffect(() => {
    // Only show if user hasn't seen the welcome tour
    const seen = localStorage.getItem(WELCOME_SEEN_KEY)
    if (!seen) {
      // Delay slightly so dashboard loads first
      const timer = setTimeout(() => setShow(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, 'true')
    setShow(false)
  }

  if (!show) return null

  const steps = isSim ? [
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
  ] : [
    {
      emoji: '✨',
      title: 'Welcome to SynchroSoul!',
      body: 'Your spiritual healing journey starts here. This app helps you track angel numbers, decode divine messages, interpret dreams, and align with your highest self.',
      action: 'Show me how →',
    },
    {
      emoji: '🔢',
      title: 'Log Your First Angel Number',
      body: 'Have you been seeing repeating numbers like 111, 444, or 1111? That\'s the universe communicating with you! Tap the number pad below, enter the number you\'ve been seeing, and add a thought about what you were feeling or thinking.',
      action: 'Got it →',
    },
    {
      emoji: '🔮',
      title: 'Get Your Personalized Reading',
      body: 'After logging your number, the Oracle will deliver a personalized spiritual reading based on your number, your thought, and your unique energy. The more you log, the more connected you become.',
      action: 'Let\'s begin! ✨',
    },
  ]

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
          }}>Tip: Look for the number pad on your dashboard to log your first number!</p>
        )}
      </div>
    </div>
  )
}
