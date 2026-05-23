import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { PLAN_PRICE_IDS } from '@/lib/subscription'

export async function POST(req: NextRequest) {
  try {
    const { plan, returnUrl } = await req.json()
    const priceId = plan === 'twin-flame' ? PLAN_PRICE_IDS.twinFlame : PLAN_PRICE_IDS.mystic
    if (!priceId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const stripe = getStripe()

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, display_name')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      // Before creating a new customer, check if one already exists by email
      // This prevents duplicate Stripe customers for the same email
      const existingCustomers = await stripe.customers.list({
        email: user.email || '',
        limit: 5,
      })

      if (existingCustomers.data.length > 0) {
        // Use the first existing customer and link it to the profile
        customerId = existingCustomers.data[0].id
        console.log(`Found existing Stripe customer ${customerId} for email ${user.email}`)
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          name: profile?.display_name || user.email,
          metadata: { supabase_user_id: user.id },
        })
        customerId = customer.id
      }
      // Save the customer ID to profile
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    // Cancel ALL existing active/trialing subscriptions across ALL Stripe customers for this email
    // This catches duplicates even if multiple Stripe customers were created for the same email
    const allCustomers = await stripe.customers.list({
      email: user.email || '',
      limit: 10,
    })

    let cancelledCount = 0
    for (const cust of allCustomers.data) {
      const existingSubs = await stripe.subscriptions.list({
        customer: cust.id,
        status: 'active',
        limit: 10,
      })
      const trialSubs = await stripe.subscriptions.list({
        customer: cust.id,
        status: 'trialing',
        limit: 10,
      })
      const allActiveSubs = [...existingSubs.data, ...trialSubs.data]

      for (const sub of allActiveSubs) {
        await stripe.subscriptions.cancel(sub.id)
        cancelledCount++
        console.log(`Cancelled subscription ${sub.id} for customer ${cust.id} before new checkout`)
      }
    }

    // Update DB to free while checkout is pending
    if (cancelledCount > 0) {
      await supabase
        .from('profiles')
        .update({ subscription_tier: 'free', subscription_status: 'canceled' })
        .eq('id', user.id)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        metadata: { supabase_user_id: user.id, plan },
      },
      success_url: `${returnUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://synchrosoul.vercel.app'}/dashboard/upgrade?success=true&plan=${plan}`,
      cancel_url: `${returnUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://synchrosoul.vercel.app'}/dashboard/upgrade?canceled=true`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Subscription create error:', err)
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
}
