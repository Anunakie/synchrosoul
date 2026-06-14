import { createClient } from '@/lib/supabase/client'

export type SubscriptionTier = 'free' | 'mystic' | 'twin-flame'

export interface SubscriptionStatus {
  tier: SubscriptionTier
  status: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
}

export const PLAN_PRICE_IDS = {
  mystic: 'price_1T9xzHC8J9E2NiAt54HRIbQM',
  twinFlame: 'price_1T9xzIC8J9E2NiAtd5dsFGRP',
}

export const TIER_FEATURES: Record<SubscriptionTier, string[]> = {
  free: ['logger', 'journal', 'dreams', 'basic-numerology', 'dictionary', 'gratitude', 'feed'],
  mystic: ['logger', 'journal', 'dreams', 'full-numerology', 'dictionary', 'gratitude',
    'feed', 'weekly-synthesis', 'oracle-unlimited', 'tarot-full', 'soul-twin-radar',
    'angel-circles', 'truth-score', 'manifestations', 'badges-30', 'export-pdf',
    'voice_journal', 'sleep_sounds'],
  'twin-flame': ['*'],
}

export function hasFeature(tier: SubscriptionTier, feature: string): boolean {
  const features = TIER_FEATURES[tier]
  if (features.includes('*')) return true
  return features.includes(feature)
}

const LS_TIER_KEY = 'synchrosoul_subscription_tier'
const LS_TIER_EXPIRY_KEY = 'synchrosoul_subscription_tier_expiry'

export function saveSubscriptionTierLocally(tier: SubscriptionTier) {
  if (typeof window === 'undefined') return
  const expiry = Date.now() + 24 * 60 * 60 * 1000
  localStorage.setItem(LS_TIER_KEY, tier)
  localStorage.setItem(LS_TIER_EXPIRY_KEY, String(expiry))
}

export function getLocalSubscriptionTier(): SubscriptionTier | null {
  if (typeof window === 'undefined') return null
  const expiry = localStorage.getItem(LS_TIER_EXPIRY_KEY)
  if (expiry && Date.now() > Number(expiry)) {
    localStorage.removeItem(LS_TIER_KEY)
    localStorage.removeItem(LS_TIER_EXPIRY_KEY)
    return null
  }
  return localStorage.getItem(LS_TIER_KEY) as SubscriptionTier | null
}

// Admin emails that always get Twin Flame access
const ADMIN_EMAILS = ['dezekiel@live.com']

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { tier: 'free', status: null, currentPeriodEnd: null, cancelAtPeriodEnd: false }

    // Admin whitelist: always Twin Flame
    if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return { tier: 'twin-flame', status: 'admin', currentPeriodEnd: null, cancelAtPeriodEnd: false }
    }

    // Try DB first
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_status, subscription_period_end, subscription_cancel_at_period_end')
        .eq('id', user.id)
        .single()

      if (profile?.subscription_tier && profile.subscription_tier !== 'free') {
        saveSubscriptionTierLocally(profile.subscription_tier as SubscriptionTier)
        return {
          tier: (profile.subscription_tier as SubscriptionTier),
          status: profile.subscription_status || null,
          currentPeriodEnd: profile.subscription_period_end || null,
          cancelAtPeriodEnd: profile.subscription_cancel_at_period_end || false,
        }
      }
    } catch {
      // DB columns may not exist yet
    }

    // Fallback: localStorage cache
    const localTier = getLocalSubscriptionTier()
    if (localTier && localTier !== 'free') {
      return { tier: localTier, status: 'trialing', currentPeriodEnd: null, cancelAtPeriodEnd: false }
    }

    return { tier: 'free', status: null, currentPeriodEnd: null, cancelAtPeriodEnd: false }
  } catch {
    const localTier = getLocalSubscriptionTier()
    return {
      tier: localTier || 'free',
      status: localTier ? 'trialing' : null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    }
  }
}
