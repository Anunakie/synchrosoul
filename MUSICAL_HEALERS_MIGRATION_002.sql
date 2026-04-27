-- Musical Healers Migration 002: Hybrid Tier-Based Pill System
-- Adds healing_styles, spiritual_concepts, and oracle_tags columns
-- Updates get_candidate_songs() to score against all pill types

-- Add new columns to songs table
alter table musical_healer_songs
  add column if not exists healing_styles text[] default '{}',
  add column if not exists spiritual_concepts text[] default '{}',
  add column if not exists oracle_tags text[] default '{}';

-- Update existing songs with oracle_tags from their current extra themes/moods
-- (preserving the rich tags from the original seed)
update musical_healer_songs
set oracle_tags = array(
  select unnest(themes) 
  except 
  select unnest(ARRAY['transformation','grounding','heart-opening','release','abundance','protection','awakening','peace','love','healing','courage','destiny','intuition','connection','gratitude','surrender'])
)
where array_length(themes, 1) > 3;

-- Drop and recreate the candidate songs function with all pill types
drop function if exists get_candidate_songs(text[], text[], text[], int);

create or replace function get_candidate_songs(
  p_themes text[] default '{}',
  p_moods text[] default '{}',
  p_angel_numbers text[] default '{}',
  p_limit int default 10
)
returns table (
  song_id uuid,
  healer_id uuid,
  title text,
  description text,
  themes text[],
  moods text[],
  angel_numbers text[],
  genre text,
  artist_name text,
  spotify_url text,
  apple_music_url text,
  amazon_music_url text,
  youtube_url text,
  soundcloud_url text,
  cover_art_url text,
  relevance_score float
)
language sql
stable
as $$
  select
    s.id as song_id,
    s.healer_id,
    s.title,
    s.description,
    s.themes,
    s.moods,
    s.angel_numbers,
    s.genre,
    h.artist_name,
    s.spotify_url,
    s.apple_music_url,
    s.amazon_music_url,
    s.youtube_url,
    s.soundcloud_url,
    s.cover_art_url,
    (
      -- Angel number matches (highest weight)
      coalesce((
        select count(*) from unnest(s.angel_numbers) a
        where a = any(p_angel_numbers)
      ), 0) * 5 +
      -- Theme matches
      coalesce((
        select count(*) from unnest(s.themes) t
        where t = any(p_themes)
      ), 0) * 3 +
      -- Mood matches
      coalesce((
        select count(*) from unnest(s.moods) m
        where m = any(p_moods)
      ), 0) * 2 +
      -- Healing style matches
      coalesce((
        select count(*) from unnest(s.healing_styles) hs
        where hs = any(p_themes)
      ), 0) * 2 +
      -- Spiritual concept matches
      coalesce((
        select count(*) from unnest(s.spiritual_concepts) sc
        where sc = any(p_themes)
      ), 0) * 2 +
      -- Oracle-assigned tag matches (AI-generated rich tags)
      coalesce((
        select count(*) from unnest(s.oracle_tags) ot
        where ot = any(p_themes)
      ), 0) * 3 +
      -- Random jitter for variety
      random() * 2
    )::float as relevance_score
  from musical_healer_songs s
  join musical_healers h on h.id = s.healer_id
  where s.is_active = true
    and s.synch_enabled = true
    and h.is_active = true
  order by relevance_score desc
  limit p_limit;
$$;
