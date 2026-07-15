-- COSMIC_FIELD_MIGRATION.sql
-- Cosmic Field (admin-only private beta): store the live space-weather +
-- consciousness snapshot captured at the moment a log/dream was created.
-- Run in the Supabase SQL editor.

ALTER TABLE angel_logs ADD COLUMN IF NOT EXISTS cosmic_field_snapshot jsonb;
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS cosmic_field_snapshot jsonb;
