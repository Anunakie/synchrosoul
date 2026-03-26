-- Beta Signups Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS beta_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  device TEXT NOT NULL DEFAULT 'web',
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast email lookups
CREATE INDEX IF NOT EXISTS beta_signups_email_idx ON beta_signups(email);
CREATE INDEX IF NOT EXISTS beta_signups_status_idx ON beta_signups(status);

-- RLS
ALTER TABLE beta_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public signup form)
CREATE POLICY "Anyone can sign up for beta" ON beta_signups
  FOR INSERT WITH CHECK (true);

-- Only service role can read/update/delete (admin API uses service role)
CREATE POLICY "Service role full access" ON beta_signups
  FOR ALL USING (auth.role() = 'service_role');

-- Prevent duplicate signups
CREATE UNIQUE INDEX IF NOT EXISTS beta_signups_email_unique ON beta_signups(email);
