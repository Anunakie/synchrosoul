-- Migration 002: Add song_recommendation JSONB column to angel_logs
-- This allows song recommendations to sync across devices via Supabase

alter table angel_logs
  add column if not exists song_recommendation jsonb;

-- Index for quick lookups of logs that have recommendations
create index if not exists idx_angel_logs_has_recommendation
  on angel_logs ((song_recommendation is not null))
  where song_recommendation is not null;
