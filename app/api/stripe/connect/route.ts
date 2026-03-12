import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { healerId, returnUrl } = body;

    // Check if healer already has a Stripe account
    const { data: healer } = await supabase
      .from('healers')
      .select('stripe_account_id, name')
      .eq('id', healerId)
      .eq('user_id', user.id)
      .single();

    if (!healer) return NextResponse.json({ error: 'Healer not found' }, { status: 404 });

    let accountId = healer.stripe_account_id;

    // Create new Stripe Connect account if needed
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: user.email,
        capabilities: { transfers: { requested: true }, card_payments: { requested: true } },
        business_profile: { name: healer.name, url: process.env.NEXT_PUBLIC_APP_URL || 'https://synchrosoul.app' },
      });
      accountId = account.id;

      // Save Stripe account ID to healer record
      await supabase.from('healers').update({ stripe_account_id: accountId }).eq('id', healerId);
    }

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: returnUrl || process.env.NEXT_PUBLIC_APP_URL + '/dashboard/healers/register',
      return_url: returnUrl || process.env.NEXT_PUBLIC_APP_URL + '/dashboard/healers/register?stripe=success',
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
