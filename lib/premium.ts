'use client'

export type PremiumTier = 'free' | 'soul-sync' | 'cosmic-circle'

export interface TierConfig {
  id: PremiumTier
  name: string
  price: string
  emoji: string
  color: string
  features: string[]
}

export const TIERS: TierConfig[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    emoji: '✦',
    color: 'rgba(200,180,255,0.6)',
    features: [
      'Basic angel number logging',
      'Thought Anchor Journal',
      'Basic numerology profile',
      '3 screenshot uploads/day',
      'Basic sync matching',
      'Daily guidance',
    ],
  },
  {
    id: 'soul-sync',
    name: 'Soul Sync',
    price: '$6.99/mo',
    emoji: '🌙',
    color: 'rgba(150,100,255,0.9)',
    features: [
      'Everything in Free',
      'Weekly Cosmic Synthesis report',
      'Vision Timeline (exportable)',
      'Angel Number Oracle',
      'Guided Number Meditations',
      'Manifestation Ritual Planner',
      'Soul Pattern AI analysis',
      'Unlimited screenshot uploads',
      'Custom cosmic themes',
    ],
  },
  {
    id: 'cosmic-circle',
    name: 'Cosmic Circle',
    price: '$9.99/mo',
    emoji: '⭐',
    color: 'rgba(201,168,76,0.9)',
    features: [
      'Everything in Soul Sync',
      'Soul Twin Radar (real-time alerts)',
      'Shared Journal Peek with matches',
      'Compatibility Deep Dive reports',
      'Private Angel Circles (groups)',
      'Priority matching visibility',
      'Birth chart fusion readings',
    ],
  },
]

const PREMIUM_KEY = 'synchrosoul_premium_tier'

export function getPremiumTier(): PremiumTier {
  if (typeof window === 'undefined') return 'free'
  return (localStorage.getItem(PREMIUM_KEY) as PremiumTier) || 'free'
}

export function setPremiumTier(tier: PremiumTier) {
  if (typeof window === 'undefined') return
  localStorage.setItem(PREMIUM_KEY, tier)
}

export function hasAccess(requiredTier: PremiumTier): boolean {
  const current = getPremiumTier()
  const order: PremiumTier[] = ['free', 'soul-sync', 'cosmic-circle']
  return order.indexOf(current) >= order.indexOf(requiredTier)
}
