
import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { PLAN_PRICE_IDS } from '@/lib/subscription'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ tier: 'free', message: 'No Stripe customer found' })
    }

    const stripe = getStripe()

    // Fetch all subscriptions for this customer directly from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'all',
      limit: 10,
    })

    // Find the most relevant active/trialing subscription
    const active = subscriptions.data.find(
      s => s.status === 'active' || s.status === 'trialing'
    )

    if (!active) {
      // No active subscription — set to free
      await supabase.from('profiles').update({
        subscription_tier: 'free',
        subscription_status: subscriptions.data[0]?.status || 'none',
      }).eq('id', user.id)
      return NextResponse.json({ tier: 'free', message: 'No active subscription found' })
    }

    // Determine tier from price ID
    const priceId = active.items.data[0]?.price?.id
    let tier = 'free'
    if (priceId === PLAN_PRICE_IDS.mystic) tier = 'mystic'
    if (priceId === PLAN_PRICE_IDS.twinFlame) tier = 'twin-flame'

    // Update profiles table
    await supabase.from('profiles').update({
      subscription_tier: tier,
      subscription_status: active.status,
      subscription_id: active.id,
      subscription_period_end: new Date((active as any).current_period_end * 1000).toISOString(),
      subscription_cancel_at_period_end: active.cancel_at_period_end,
    }).eq('id', user.id)

    return NextResponse.json({
      tier,
      status: active.status,
      message: `Subscription synced! Tier set to ${tier}`,
    })
  } catch (err: any) {
    console.error('Sync subscription error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
