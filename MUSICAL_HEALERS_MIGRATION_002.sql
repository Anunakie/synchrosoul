-- Musical Healers Migration 002: Add Synch Tier System
-- Run this in Supabase SQL Editor

-- Add synch_enabled column to songs
alter table musical_healer_songs
  add column if not exists synch_enabled boolean default false;

-- Enable synch for all existing songs (Daniel Ketchum's 3 songs)
update musical_healer_songs
set synch_enabled = true;

-- Update the get_candidate_songs function to only return synch-enabled songs
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
      coalesce((
        select count(*) from unnest(s.angel_numbers) a
        where a = any(p_angel_numbers)
      ), 0) * 5 +
      coalesce((
        select count(*) from unnest(s.themes) t
        where t = any(p_themes)
      ), 0) * 3 +
      coalesce((
        select count(*) from unnest(s.moods) m
        where m = any(p_moods)
      ), 0) * 2 +
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
