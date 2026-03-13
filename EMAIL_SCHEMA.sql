-- Add email preference columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_digest boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_match_alerts boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_welcome_sent boolean DEFAULT false;
