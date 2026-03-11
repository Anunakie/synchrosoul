-- SynchroSoul Healers Directory Schema
-- Run this in your Supabase SQL Editor

-- Healers table
CREATE TABLE IF NOT EXISTS public.healers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  location TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'US',
  modalities TEXT[] DEFAULT '{}',
  angel_numbers TEXT[] DEFAULT '{}',
  life_path_number INTEGER,
  photo TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  instagram TEXT,
  session_types TEXT[] DEFAULT '{}',
  price_range TEXT,
  verified BOOLEAN DEFAULT FALSE,
  truth_score INTEGER DEFAULT 40,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.healers ENABLE ROW LEVEL SECURITY;

-- Anyone can read active healer listings
CREATE POLICY "Public can view active healers"
  ON public.healers FOR SELECT
  USING (is_active = TRUE);

-- Authenticated users can create their own listing
CREATE POLICY "Users can create healer listing"
  ON public.healers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own listing
CREATE POLICY "Users can update own healer listing"
  ON public.healers FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own listing
CREATE POLICY "Users can delete own healer listing"
  ON public.healers FOR DELETE
  USING (auth.uid() = user_id);

-- Healer reviews table
CREATE TABLE IF NOT EXISTS public.healer_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  healer_id UUID REFERENCES public.healers(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  angel_number_shared TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(healer_id, reviewer_id)
);

ALTER TABLE public.healer_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view reviews"
  ON public.healer_reviews FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated users can write reviews"
  ON public.healer_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.healers;

-- Index for location search
CREATE INDEX IF NOT EXISTS healers_city_idx ON public.healers(city);
CREATE INDEX IF NOT EXISTS healers_modalities_idx ON public.healers USING GIN(modalities);
CREATE INDEX IF NOT EXISTS healers_angel_numbers_idx ON public.healers USING GIN(angel_numbers);
