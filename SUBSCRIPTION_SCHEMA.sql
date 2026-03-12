
-- Add subscription columns to profiles table
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'mystic', 'twin-flame')),
  ADD COLUMN IF NOT EXISTS subscription_status TEXT,
  ADD COLUMN IF NOT EXISTS subscription_period_end TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscription_cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Index for Stripe customer lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier ON profiles(subscription_tier);

-- View to easily check active subscribers
CREATE OR REPLACE VIEW active_subscribers AS
  SELECT id, display_name, subscription_tier, subscription_status, subscription_period_end
  FROM profiles
  WHERE subscription_tier != 'free'
    AND subscription_status IN ('active', 'trialing');
