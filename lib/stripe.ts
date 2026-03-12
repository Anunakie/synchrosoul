import Stripe from 'stripe';

export const PLATFORM_FEE_PERCENT = 0.12; // 12% platform fee

// Lazy initialization - only create Stripe client when actually needed
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    _stripe = new Stripe(key, { apiVersion: '2026-02-25.clover' });
  }
  return _stripe;
}

// Keep named export for backwards compat - but lazy
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export function calculateFees(sessionPriceUSD: number) {
  const totalCents = Math.round(sessionPriceUSD * 100);
  const platformFeeCents = Math.round(totalCents * PLATFORM_FEE_PERCENT);
  const healerReceivesCents = totalCents - platformFeeCents;
  return { totalCents, platformFeeCents, healerReceivesCents };
}
