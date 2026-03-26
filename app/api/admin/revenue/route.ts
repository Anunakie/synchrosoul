import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getStripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth) return auth;

  try {
    const stripe = getStripe();

    // ── Fetch active subscriptions ──────────────────────────────────────────
    const [activeSubs, canceledSubs, charges] = await Promise.all([
      stripe.subscriptions.list({ status: 'active', limit: 100, expand: ['data.items.data.price'] }),
      stripe.subscriptions.list({ status: 'canceled', limit: 100 }),
      stripe.charges.list({ limit: 100 }),
    ]);

    // ── MRR calculation ─────────────────────────────────────────────────────
    let mrrCents = 0;
    const tierCounts: Record<string, number> = { mystic: 0, twin_flame: 0, other: 0 };

    for (const sub of activeSubs.data) {
      for (const item of sub.items.data) {
        const price = item.price;
        const unitAmount = price.unit_amount || 0;
        const interval = price.recurring?.interval;
        const intervalCount = price.recurring?.interval_count || 1;

        // Normalize to monthly
        let monthlyAmount = unitAmount;
        if (interval === 'year') monthlyAmount = Math.round(unitAmount / 12);
        else if (interval === 'week') monthlyAmount = Math.round(unitAmount * 4.33);
        else if (interval === 'day') monthlyAmount = Math.round(unitAmount * 30);
        else if (interval === 'month' && intervalCount > 1) monthlyAmount = Math.round(unitAmount / intervalCount);

        mrrCents += monthlyAmount;

        // Tier detection by price
        const dollars = unitAmount / 100;
        if (dollars <= 7.5) tierCounts.mystic++;
        else if (dollars <= 10.5) tierCounts.twin_flame++;
        else tierCounts.other++;
      }
    }

    // ── Revenue over last 6 months ──────────────────────────────────────────
    const now = new Date();
    const monthlyRevenue: { month: string; revenue: number; count: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyRevenue.push({ month: label, revenue: 0, count: 0 });
    }

    for (const charge of charges.data) {
      if (charge.status !== 'succeeded') continue;
      const chargeDate = new Date(charge.created * 1000);
      const monthIdx = monthlyRevenue.findIndex(m => {
        const [mon, yr] = m.month.split(' ');
        const d = new Date(`${mon} 20${yr}`);
        return d.getMonth() === chargeDate.getMonth() && d.getFullYear() === chargeDate.getFullYear();
      });
      if (monthIdx !== -1) {
        monthlyRevenue[monthIdx].revenue += charge.amount / 100;
        monthlyRevenue[monthIdx].count++;
      }
    }

    // ── Total revenue ───────────────────────────────────────────────────────
    const totalRevenueCents = charges.data
      .filter(c => c.status === 'succeeded')
      .reduce((sum, c) => sum + c.amount, 0);

    // ── Recent charges ──────────────────────────────────────────────────────
    const recentCharges = charges.data.slice(0, 10).map(c => ({
      id: c.id,
      amount: c.amount / 100,
      currency: c.currency,
      status: c.status,
      email: c.billing_details?.email || c.receipt_email || 'Unknown',
      created: new Date(c.created * 1000).toISOString(),
      description: c.description || 'Subscription',
    }));

    // ── Churn rate ──────────────────────────────────────────────────────────
    const totalEverSubs = activeSubs.data.length + canceledSubs.data.length;
    const churnRate = totalEverSubs > 0
      ? Math.round((canceledSubs.data.length / totalEverSubs) * 100)
      : 0;

    // ── Platform fee revenue (12%) ──────────────────────────────────────────
    const platformRevenueCents = Math.round(totalRevenueCents * 0.12);

    return NextResponse.json({
      mrr: mrrCents / 100,
      totalRevenue: totalRevenueCents / 100,
      platformRevenue: platformRevenueCents / 100,
      activeSubscribers: activeSubs.data.length,
      canceledSubscribers: canceledSubs.data.length,
      churnRate,
      tierCounts,
      monthlyRevenue,
      recentCharges,
    });
  } catch (err) {
    console.error('Revenue API error:', err);
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
  }
}
