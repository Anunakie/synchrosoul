-- REFERRALS_SCHEMA.sql
-- Run this in your Supabase SQL Editor

-- Add referral columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_connect_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS affiliate_tier TEXT DEFAULT 'standard';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_referral_earnings NUMERIC(10,2) DEFAULT 0;

-- Create referrals tracking table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referred_email TEXT,
  referred_name TEXT,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'signed_up',
  subscription_tier TEXT,
  commission_rate NUMERIC(4,2) DEFAULT 0.25,
  monthly_commission NUMERIC(10,2) DEFAULT 0,
  total_earned NUMERIC(10,2) DEFAULT 0,
  stripe_subscription_id TEXT,
  subscribed_at TIMESTAMPTZ,
  last_commission_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS referrals_referred_user_id_idx ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS referrals_referral_code_idx ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS profiles_referral_code_idx ON profiles(referral_code);

CREATE TABLE IF NOT EXISTS referral_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  stripe_transfer_id TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  referral_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_payouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own referrals" ON referrals;
CREATE POLICY "Users can view their own referrals" ON referrals
  FOR SELECT USING (auth.uid() = referrer_id);

DROP POLICY IF EXISTS "Service can insert referrals" ON referrals;
CREATE POLICY "Service can insert referrals" ON referrals
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Service can update referrals" ON referrals;
CREATE POLICY "Service can update referrals" ON referrals
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Users can view their own payouts" ON referral_payouts;
CREATE POLICY "Users can view their own payouts" ON referral_payouts
  FOR SELECT USING (auth.uid() = referrer_id);

ALTER PUBLICATION supabase_realtime ADD TABLE referrals;
