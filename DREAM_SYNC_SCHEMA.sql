-- Dream Sharing & Dream Sync Schema
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT FALSE;
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS dream_themes TEXT DEFAULT '[]';
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS shared_at TIMESTAMPTZ;

-- Update RLS: allow users to see shared dreams from others
DROP POLICY IF EXISTS "Users can see shared dreams" ON dreams;
CREATE POLICY "Users can see shared dreams" ON dreams
  FOR SELECT USING (is_shared = true OR auth.uid() = user_id);

-- Allow users to update their own dreams (for toggling sharing)
DROP POLICY IF EXISTS "Users can update own dreams" ON dreams;
CREATE POLICY "Users can update own dreams" ON dreams
  FOR UPDATE USING (auth.uid() = user_id);
