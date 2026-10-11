-- SynchroSoul: track whether users get real AI readings or the generic fallback
-- Shown in Admin Dashboard -> Readings tab.
-- Run this once in Supabase SQL Editor: https://supabase.com/dashboard/project/btopllnsyslhjictcznm/sql

CREATE TABLE IF NOT EXISTS ai_reading_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  feature TEXT NOT NULL,          -- oracle_instant | oracle_question | dream_interpret | synthesis
  status TEXT NOT NULL,           -- ai | ai_backup | empty | error
  mode TEXT,                      -- spiritual | simulation
  model TEXT,                     -- the Groq model that answered
  error TEXT,                     -- why it failed, when it failed
  latency_ms INTEGER,
  has_thought BOOLEAN,
  reading_length INTEGER,
  reading_preview TEXT            -- first 240 characters of the reading
);

CREATE INDEX IF NOT EXISTS ai_reading_events_created_at_idx ON ai_reading_events (created_at DESC);

-- Only the server (service role) reads and writes this table.
ALTER TABLE ai_reading_events ENABLE ROW LEVEL SECURITY;

-- Verify
SELECT count(*) FROM ai_reading_events;
