
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
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.display_name || user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
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
