-- SynchroSoul: Add AI reading columns to angel_logs
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/btopllnsyslhjictcznm/sql

ALTER TABLE angel_logs 
  ADD COLUMN IF NOT EXISTS mini_reading TEXT,
  ADD COLUMN IF NOT EXISTS reading_title TEXT,
  ADD COLUMN IF NOT EXISTS reading_color TEXT;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'angel_logs' 
  AND column_name IN ('mini_reading', 'reading_title', 'reading_color');
