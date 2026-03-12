
import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      // ── Subscription events ──────────────────────────────────────────
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) break

        const priceId = sub.items.data[0]?.price?.id
        let tier = 'free'
        if (priceId === 'price_1T9xzHC8J9E2NiAt54HRIbQM') tier = 'mystic'
        if (priceId === 'price_1T9xzIC8J9E2NiAtd5dsFGRP') tier = 'twin-flame'

        await supabase.from('profiles').update({
          subscription_tier: sub.status === 'active' || sub.status === 'trialing' ? tier : 'free',
          subscription_status: sub.status,
          subscription_id: sub.id,
          subscription_period_end: new Date((sub as Stripe.Subscription & { current_period_end: number }).current_period_end * 1000).toISOString(),
          subscription_cancel_at_period_end: sub.cancel_at_period_end,
        }).eq('id', userId)
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.supabase_user_id
        if (!userId) break
        await supabase.from('profiles').update({
          subscription_tier: 'free',
          subscription_status: 'canceled',
          subscription_cancel_at_period_end: false,
        }).eq('id', userId)
        break
      }

      // ── Checkout completed (healer bookings + subscriptions) ──────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === 'subscription') {
          // Subscription checkout — tier already handled by subscription.created
          break
        }
        // Healer booking payment
        const bookingId = session.metadata?.booking_id
        if (bookingId) {
          await supabase.from('healer_bookings').update({ payment_status: 'paid' }).eq('id', bookingId)
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        const bookingId = pi.metadata?.booking_id
        if (bookingId) {
          await supabase.from('healer_bookings').update({ payment_status: 'failed' }).eq('id', bookingId)
        }
        break
      }

      case 'account.updated': {
        const account = event.data.object as Stripe.Account
        if (account.charges_enabled) {
          await supabase.from('healers').update({ stripe_verified: true }).eq('stripe_account_id', account.id)
        }
        break
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err)
  }

  return NextResponse.json({ received: true })
}
