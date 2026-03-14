-- Add verification_notes column if not exists
ALTER TABLE healers ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Ensure verified column exists (should already be there)
ALTER TABLE healers ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE;

-- Index for quick filtering of verified healers
CREATE INDEX IF NOT EXISTS idx_healers_verified ON healers(verified);
