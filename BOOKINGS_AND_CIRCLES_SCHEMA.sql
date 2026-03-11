-- Healer Bookings Schema for SynchroSoul
-- Run this in your Supabase SQL Editor

-- Healer bookings table
CREATE TABLE IF NOT EXISTS healer_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  healer_id TEXT NOT NULL,
  healer_name TEXT NOT NULL,
  healer_modality TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('virtual', 'in-person')),
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'completed')),
  healer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE healer_bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY IF NOT EXISTS "Users view own bookings"
  ON healer_bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create bookings
CREATE POLICY IF NOT EXISTS "Users create bookings"
  ON healer_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (e.g. cancel)
CREATE POLICY IF NOT EXISTS "Users update own bookings"
  ON healer_bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS healer_bookings_user_id_idx ON healer_bookings(user_id);
CREATE INDEX IF NOT EXISTS healer_bookings_healer_id_idx ON healer_bookings(healer_id);
CREATE INDEX IF NOT EXISTS healer_bookings_status_idx ON healer_bookings(status);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE healer_bookings;

-- Circle messages table (for Angel Circles group chat)
CREATE TABLE IF NOT EXISTS circle_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Cosmic Soul',
  content TEXT NOT NULL,
  angel_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE circle_messages ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read circle messages
CREATE POLICY IF NOT EXISTS "Authenticated users read circle messages"
  ON circle_messages FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated users can post to circles
CREATE POLICY IF NOT EXISTS "Authenticated users post to circles"
  ON circle_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS circle_messages_circle_id_idx ON circle_messages(circle_id);
CREATE INDEX IF NOT EXISTS circle_messages_created_at_idx ON circle_messages(created_at);

ALTER PUBLICATION supabase_realtime ADD TABLE circle_messages;
