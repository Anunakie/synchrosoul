import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const healerId = searchParams.get('healerId');

    const { data: healer } = await supabase
      .from('healers')
      .select('stripe_account_id')
      .eq('id', healerId)
      .single();

    if (!healer?.stripe_account_id) {
      return NextResponse.json({ connected: false, chargesEnabled: false });
    }

    const account = await stripe.accounts.retrieve(healer.stripe_account_id);
    return NextResponse.json({
      connected: true,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      detailsSubmitted: account.details_submitted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
