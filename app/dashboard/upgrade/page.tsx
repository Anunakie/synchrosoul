'use client'
import { useState, useEffect } from 'react'
import { TIERS, getPremiumTier, setPremiumTier, PremiumTier } from '@/lib/premium'

export default function UpgradePage() {
  const [current, setCurrent] = useState<PremiumTier>('free')
  const [selected, setSelected] = useState<PremiumTier | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    setCurrent(getPremiumTier())
  }, [])

  function handleSelect(tier: PremiumTier) {
    if (tier === current) return
    setSelected(tier)
  }

  function handleConfirm() {
    if (!selected) return
    setPremiumTier(selected)
    setCurrent(selected)
    setConfirmed(true)
    setSelected(null)
  }

  const tierColors: Record<PremiumTier, string> = {
    free: 'rgba(200,180,255,0.5)',
    'soul-sync': 'rgba(150,100,255,0.9)',
    'cosmic-circle': '#c9a84c',
  }

  const tierGradients: Record<PremiumTier, string> = {
    free: 'rgba(200,180,255,0.05)',
    'soul-sync': 'rgba(139,92,246,0.08)',
    'cosmic-circle': 'rgba(201,168,76,0.08)',
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem 6rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⭐</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', letterSpacing: '0.05em', margin: 0 }}>Unlock Your Full Cosmic Potential</h1>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.85rem', marginTop: '0.75rem', lineHeight: 1.6 }}>Choose the tier that matches your spiritual journey</p>
      </div>

      {/* Current tier badge */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: `${tierColors[current]}15`, border: `1px solid ${tierColors[current]}44`, borderRadius: '9999px', color: tierColors[current], fontSize: '0.8rem', letterSpacing: '0.1em' }}>
          {TIERS.find(t => t.id === current)?.emoji} Current: {TIERS.find(t => t.id === current)?.name}
        </span>
      </div>

      {/* Confirmed message */}
      {confirmed && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '1rem', padding: '1rem', textAlign: 'center', marginBottom: '1.5rem' }}>
          <p style={{ color: '#4ade80', margin: 0, fontSize: '0.9rem' }}>✨ Your tier has been updated! Enjoy your new features.</p>
        </div>
      )}

      {/* Tier cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {TIERS.map(tier => {
          const isCurrentTier = tier.id === current
          const isSelected = tier.id === selected
          const color = tierColors[tier.id]
          return (
            <div
              key={tier.id}
              onClick={() => handleSelect(tier.id)}
              style={{ background: isSelected ? `${color}15` : tierGradients[tier.id], border: `1px solid ${isSelected ? color : isCurrentTier ? color + '44' : 'rgba(200,180,255,0.12)'}`, borderRadius: '1.25rem', padding: '1.5rem', cursor: tier.id !== current ? 'pointer' : 'default', transition: 'all 0.2s', backdropFilter: 'blur(12px)', position: 'relative', overflow: 'hidden' }}
            >
              {isCurrentTier && (
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: `${color}22`, border: `1px solid ${color}44`, borderRadius: '9999px', padding: '0.2rem 0.6rem', fontSize: '0.65rem', color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Active</div>
              )}
              {tier.id === 'soul-sync' && !isCurrentTier && (
                <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '9999px', padding: '0.2rem 0.6rem', fontSize: '0.65rem', color: 'rgba(180,150,255,0.9)', letterSpacing: '0.1em' }}>Most Popular</div>
              )}

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem', flexShrink: 0 }}>{tier.emoji}</div>
                <div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color, marginBottom: '0.2rem' }}>{tier.name}</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.7)' }}>{tier.price}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {tier.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color, fontSize: '0.75rem', marginTop: '0.15rem', flexShrink: 0 }}>✦</span>
                    <span style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.82rem', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>

              {isSelected && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: `1px solid ${color}22`, textAlign: 'center' }}>
                  <span style={{ color, fontSize: '0.8rem', letterSpacing: '0.05em' }}>✓ Selected — confirm below</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Confirm button */}
      {selected && (
        <div style={{ position: 'sticky', bottom: '5rem', background: 'rgba(5,5,16,0.9)', backdropFilter: 'blur(20px)', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(200,180,255,0.1)' }}>
          <button onClick={handleConfirm} style={{ width: '100%', padding: '0.875rem', background: `${tierColors[selected]}22`, border: `1px solid ${tierColors[selected]}55`, borderRadius: '9999px', color: tierColors[selected], cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.1em', fontFamily: 'inherit' }}>
            Activate {TIERS.find(t => t.id === selected)?.name} {TIERS.find(t => t.id === selected)?.emoji}
          </button>
          <p style={{ textAlign: 'center', color: 'rgba(200,180,255,0.3)', fontSize: '0.7rem', margin: '0.5rem 0 0', letterSpacing: '0.05em' }}>Demo mode — no payment required</p>
        </div>
      )}

      {/* Feature comparison note */}
      <div style={{ background: 'rgba(8,6,28,0.7)', border: '1px solid rgba(200,180,255,0.08)', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.78rem', lineHeight: 1.7, margin: 0 }}>All premium features are currently available in demo mode. Supabase integration and real payments will be enabled in a future update. Your tier preference is saved locally.</p>
      </div>
    </div>
  )
}
