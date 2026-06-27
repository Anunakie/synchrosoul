-- Free Trial Readings Feature
-- Adds a shared counter for 3 free premium-quality readings (number logs + dream interpretations)
-- Run this in Supabase SQL Editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS free_trial_readings_used integer DEFAULT 0;
