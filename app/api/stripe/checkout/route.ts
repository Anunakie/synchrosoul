import { NextRequest, NextResponse } from 'next/server';
import { stripe, calculateFees } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { healerId, healerName, sessionType, preferredDate, preferredTime, message, priceUSD } = body;

    // Get healer Stripe account
    const { data: healer } = await supabase
      .from('healers')
      .select('stripe_account_id, name')
      .eq('id', healerId)
      .single();

    if (!healer?.stripe_account_id) {
      return NextResponse.json({ error: 'Healer has not connected Stripe yet' }, { status: 400 });
    }

    const { totalCents, platformFeeCents } = calculateFees(priceUSD);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://synchrosoul.vercel.app';

    // Get user profile for name/email
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single();

    // Create pending booking first
    const { data: booking } = await supabase
      .from('healer_bookings')
      .insert({
        healer_id: healerId,
        healer_name: healerName,
        user_id: user.id,
        user_name: profile?.display_name || user.email?.split('@')[0] || 'Soul',
        user_email: user.email || '',
        session_type: sessionType,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        message: message || '',
        status: 'pending',
        price_usd: priceUSD,
        platform_fee_usd: Math.round(platformFeeCents) / 100,
      })
      .select()
      .single();

    if (!booking) return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });

    // Create Stripe Checkout session with application fee
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: sessionType === 'virtual' ? 'Virtual Healing Session' : 'In-Person Healing Session',
            description: 'with ' + healerName + ' via SynchroSoul',
            images: [appUrl + '/icon-192.png'],
          },
          unit_amount: totalCents,
        },
        quantity: 1,
      }],
      payment_intent_data: {
        application_fee_amount: platformFeeCents,
        transfer_data: { destination: healer.stripe_account_id },
        metadata: { bookingId: booking.id, healerId, userId: user.id },
      },
      success_url: appUrl + '/dashboard/my-bookings?payment=success&bookingId=' + booking.id,
      cancel_url: appUrl + '/dashboard/healers?payment=cancelled',
      metadata: { bookingId: booking.id },
    });

    // Save Stripe session ID to booking
    await supabase
      .from('healer_bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Checkout error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
