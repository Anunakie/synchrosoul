import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { PLAN_PRICE_IDS } from '@/lib/subscription'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const stripe = getStripe()
    const email = user.email!

    // Search Stripe customers by email (bypasses need for stripe_customer_id in DB)
    const customers = await stripe.customers.list({ email, limit: 10 })

    if (!customers.data.length) {
      return NextResponse.json({ tier: 'free', message: 'No Stripe customer found for this email' })
    }

    // Check all customers for active/trialing subscriptions
    let activeSub = null
    let activeCustomer = null

    for (const customer of customers.data) {
      const subs = await stripe.subscriptions.list({
        customer: customer.id,
        status: 'all',
        limit: 5,
      })
      const found = subs.data.find(s => s.status === 'active' || s.status === 'trialing')
      if (found) {
        activeSub = found
        activeCustomer = customer
        break
      }
    }

    if (!activeSub || !activeCustomer) {
      return NextResponse.json({ tier: 'free', message: 'No active subscription found' })
    }

    // Determine tier from price ID
    const priceId = activeSub.items.data[0]?.price?.id
    let tier = 'mystic' // default to mystic if we found a subscription
    if (priceId === PLAN_PRICE_IDS.mystic) tier = 'mystic'
    if (priceId === PLAN_PRICE_IDS.twinFlame) tier = 'twin-flame'

    // Try to update profiles table (gracefully handle missing columns)
    try {
      await supabase.from('profiles').update({
        stripe_customer_id: activeCustomer.id,
        subscription_tier: tier,
        subscription_status: activeSub.status,
        subscription_id: activeSub.id,
      }).eq('id', user.id)
    } catch (dbErr) {
      // DB columns may not exist yet - that's ok, we still return the tier
      console.log('DB update skipped (columns may not exist):', dbErr)
    }

    return NextResponse.json({
      tier,
      status: activeSub.status,
      customerId: activeCustomer.id,
      subscriptionId: activeSub.id,
      message: `Subscription synced! You are on the ${tier} plan (${activeSub.status})`,
    })
  } catch (err: any) {
    console.error('Sync subscription error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
