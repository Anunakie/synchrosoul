
// lib/referrals.ts
// Referral / Affiliate system for SynchroSoul
// 25% recurring commission on subscriptions

import { createClient } from "@/lib/supabase/client"
import { getCurrentUserId } from "@/lib/supabase-db"

export interface ReferralStats {
  code: string
  totalReferrals: number
  activeSubscribers: number
  totalEarned: number
  pendingPayout: number
  paidOut: number
  referrals: ReferralRecord[]
}

export interface ReferralRecord {
  id: string
  referredEmail: string
  referredName: string
  status: "signed_up" | "subscribed" | "churned"
  tier: string | null
  monthlyCommission: number
  totalEarned: number
  joinedAt: string
  subscribedAt: string | null
}

const COMMISSION_RATE = 0.25 // 25% recurring
const TIER_PRICES: Record<string, number> = {
  mystic: 6.99,
  twin_flame: 9.99,
}

// Generate a unique referral code for a user
export function generateReferralCode(displayName: string, userId: string): string {
  const name = (displayName || "soul").replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4) || "SOUL"
  const suffix = userId.replace(/-/g, "").slice(0, 4).toUpperCase()
  return `${name}-${suffix}`
}

// Get or create referral code for current user
export async function getMyReferralCode(): Promise<string | null> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return null

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, referral_code")
      .eq("id", userId)
      .single()

    if (profile?.referral_code) return profile.referral_code

    // Generate and save new code
    const code = generateReferralCode(profile?.display_name || "Soul", userId)
    await supabase
      .from("profiles")
      .update({ referral_code: code })
      .eq("id", userId)

    return code
  } catch {
    return null
  }
}

// Get full referral stats for current user
export async function getMyReferralStats(): Promise<ReferralStats | null> {
  try {
    const supabase = createClient()
    const userId = await getCurrentUserId()
    if (!userId) return null

    const code = await getMyReferralCode()
    if (!code) return null

    const { data: referrals } = await supabase
      .from("referrals")
      .select("*")
      .eq("referrer_id", userId)
      .order("created_at", { ascending: false })

    const records: ReferralRecord[] = (referrals || []).map((r: any) => ({
      id: r.id,
      referredEmail: r.referred_email || "",
      referredName: r.referred_name || "Starseed",
      status: r.status || "signed_up",
      tier: r.subscription_tier,
      monthlyCommission: r.monthly_commission || 0,
      totalEarned: r.total_earned || 0,
      joinedAt: r.created_at,
      subscribedAt: r.subscribed_at,
    }))

    const activeSubscribers = records.filter(r => r.status === "subscribed").length
    const totalEarned = records.reduce((sum, r) => sum + r.totalEarned, 0)
    const pendingPayout = records
      .filter(r => r.status === "subscribed")
      .reduce((sum, r) => sum + r.monthlyCommission, 0)

    return {
      code,
      totalReferrals: records.length,
      activeSubscribers,
      totalEarned,
      pendingPayout,
      paidOut: totalEarned,
      referrals: records,
    }
  } catch {
    return null
  }
}

// Track a new referral signup
export async function trackReferralSignup(referralCode: string, referredUserId: string, referredEmail: string): Promise<boolean> {
  try {
    const supabase = createClient()

    // Find referrer by code
    const { data: referrer } = await supabase
      .from("profiles")
      .select("id, display_name")
      .eq("referral_code", referralCode)
      .single()

    if (!referrer) return false
    if (referrer.id === referredUserId) return false // Can\'t refer yourself

    const { error } = await supabase
      .from("referrals")
      .insert({
        referrer_id: referrer.id,
        referred_user_id: referredUserId,
        referred_email: referredEmail,
        referral_code: referralCode,
        status: "signed_up",
        commission_rate: COMMISSION_RATE,
      })

    return !error
  } catch {
    return false
  }
}

// Calculate commission for a subscription
export function calculateCommission(tier: string): number {
  const price = TIER_PRICES[tier] || 0
  return Math.round(price * COMMISSION_RATE * 100) / 100
}

// Get referral link for sharing
export function getReferralLink(code: string): string {
  const base = typeof window !== "undefined" ? window.location.origin : "https://synchrosoul.app"
  return `${base}/join?ref=${code}`
}

// Store referral code in localStorage for use after signup
export function storeReferralCode(code: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("synchrosoul_referral_code", code)
  }
}

export function getStoredReferralCode(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("synchrosoul_referral_code")
  }
  return null
}

export function clearStoredReferralCode(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("synchrosoul_referral_code")
  }
}
