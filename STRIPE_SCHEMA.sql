-- Stripe Integration Schema for SynchroSoul
-- Run this in your Supabase SQL Editor

-- Add Stripe fields to healers table
ALTER TABLE healers ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;
ALTER TABLE healers ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE healers ADD COLUMN IF NOT EXISTS price_per_session NUMERIC(10,2) DEFAULT 80.00;
ALTER TABLE healers ADD COLUMN IF NOT EXISTS session_duration_minutes INTEGER DEFAULT 60;

-- Add payment fields to healer_bookings table
ALTER TABLE healer_bookings ADD COLUMN IF NOT EXISTS price_usd NUMERIC(10,2);
ALTER TABLE healer_bookings ADD COLUMN IF NOT EXISTS platform_fee_usd NUMERIC(10,2);
ALTER TABLE healer_bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'failed'));
ALTER TABLE healer_bookings ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE healer_bookings ADD COLUMN IF NOT EXISTS stripe_payment_intent TEXT;

-- Index for Stripe lookups
CREATE INDEX IF NOT EXISTS healer_bookings_stripe_session_idx ON healer_bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS healers_stripe_account_idx ON healers(stripe_account_id);
