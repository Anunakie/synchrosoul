
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
    'angel-circles', 'truth-score', 'manifestations', 'badges-30', 'export-pdf'],
  'twin-flame': ['*'],
}

export function hasFeature(tier: SubscriptionTier, feature: string): boolean {
  const features = TIER_FEATURES[tier]
  if (features.includes('*')) return true
  return features.includes(feature)
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { tier: 'free', status: null, currentPeriodEnd: null, cancelAtPeriodEnd: false }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status, subscription_period_end, subscription_cancel_at_period_end')
      .eq('id', user.id)
      .single()

    if (!profile) return { tier: 'free', status: null, currentPeriodEnd: null, cancelAtPeriodEnd: false }

    return {
      tier: (profile.subscription_tier as SubscriptionTier) || 'free',
      status: profile.subscription_status || null,
      currentPeriodEnd: profile.subscription_period_end || null,
      cancelAtPeriodEnd: profile.subscription_cancel_at_period_end || false,
    }
  } catch {
    return { tier: 'free', status: null, currentPeriodEnd: null, cancelAtPeriodEnd: false }
  }
}
