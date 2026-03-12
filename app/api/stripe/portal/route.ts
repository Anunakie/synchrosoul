
import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { returnUrl } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
    }

    const stripe = getStripe()
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl || 'https://synchrosoul.vercel.app/dashboard/upgrade',
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Portal error:', err)
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 })
  }
}
