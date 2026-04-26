-- ============================================================
-- SynchroSoul: Musical Healers — Seed Data
-- Daniel Ketchum — Musical Healer #1
-- Run this in Supabase SQL Editor AFTER MUSICAL_HEALERS_SCHEMA.sql
-- ============================================================

-- IMPORTANT: Replace 'YOUR_SYNCHROSOUL_EMAIL' below with the email
-- address you use to log into SynchroSoul.
-- This links your Musical Healer profile to your SynchroSoul account.

do $$
declare
  v_user_id uuid;
  v_healer_id uuid;
begin
  -- Look up your user ID by email
  select id into v_user_id
  from auth.users
  where email = 'YOUR_SYNCHROSOUL_EMAIL';

  if v_user_id is null then
    raise exception 'User not found. Replace YOUR_SYNCHROSOUL_EMAIL with your actual SynchroSoul login email.';
  end if;

  -- ============================================================
  -- Insert artist profile
  -- ============================================================
  insert into musical_healers (
    user_id,
    artist_name,
    bio,
    website_url,
    spotify_url,
    apple_music_url,
    youtube_url,
    soundcloud_url,
    bandcamp_url,
    healing_styles,
    spiritual_themes,
    genres,
    is_verified,
    is_active
  ) values (
    v_user_id,
    'Daniel Ketchum',
    'Daniel Ketchum is a talented American pianist, composer, and arranger known for blending classical influences with new age and inspirational styles. His music creates immersive piano landscapes that evoke a sense of mystery, wonder, and emotional depth, offering listeners tranquility and introspection. Growing up in a home filled with classical music and jazz, Ketchum discovered his passion for piano at age 12 and trained under pianist Lisa Tharp, drawing inspiration from artists like David Lanz.',
    'https://ketchum-music.com/',
    null,  -- Add Spotify URL when available
    null,  -- Add Apple Music URL when available
    null,  -- Add YouTube URL when available
    null,  -- Add SoundCloud URL when available
    null,  -- Add Bandcamp URL when available
    array['piano', 'classical', 'new age', 'meditation', 'instrumental'],
    array['tranquility', 'healing', 'introspection', 'love', 'transformation', 'wonder', 'mystery', 'emotional depth'],
    array['classical crossover', 'new age', 'inspirational piano', 'ambient piano'],
    true,
    true
  )
  returning id into v_healer_id;

  raise notice 'Created Musical Healer profile: % (ID: %)', 'Daniel Ketchum', v_healer_id;

  -- ============================================================
  -- Song 1: Life is Love
  -- ============================================================
  insert into musical_healer_songs (
    healer_id,
    title,
    description,
    themes,
    moods,
    angel_numbers,
    genre,
    spotify_url,
    apple_music_url,
    youtube_url,
    is_active,
    sort_order
  ) values (
    v_healer_id,
    'Life is Love',
    'A heartfelt piano and strings composition that takes listeners on a deeply emotional journey through love, connection, and the full spectrum of feelings they bring — joy, pain, heartbreak, happiness, sadness, ecstasy, and more. These emotions intertwine in a beautiful paradox, where moments of intense ecstasy are intimately balanced by profound sadness. At its core, love stands as the most powerful force of all, painting a vivid picture of why life itself is love.',
    array['love', 'connection', 'emotional healing', 'joy', 'heartbreak', 'paradox', 'life purpose', 'relationships'],
    array['emotional', 'heartfelt', 'bittersweet', 'uplifting', 'profound', 'tender'],
    array['222', '444', '1111', '888'],
    'piano and strings',
    null,  -- Add Spotify URL when available
    null,  -- Add Apple Music URL when available
    null,  -- Add YouTube URL when available
    true,
    1
  );

  -- ============================================================
  -- Song 2: Sands of Time
  -- ============================================================
  insert into musical_healer_songs (
    healer_id,
    title,
    description,
    themes,
    moods,
    angel_numbers,
    genre,
    spotify_url,
    apple_music_url,
    youtube_url,
    is_active,
    sort_order
  ) values (
    v_healer_id,
    'Sands of Time',
    'A contemplative solo piano piece that explores the quiet depths of time, memory, and the haunting beauty of alternate timelines. It gently reflects on the paths we didn''t take, the lives playing out in parallel realities, and the eternal flow of moments unfolding in the present — inviting listeners to pause and wonder about what could have been, what is, and what forever drifts through the now.',
    array['time', 'memory', 'reflection', 'parallel realities', 'alternate paths', 'present moment', 'impermanence', 'wonder'],
    array['contemplative', 'haunting', 'peaceful', 'introspective', 'wistful', 'meditative'],
    array['999', '555', '1111', '1010'],
    'solo piano',
    null,  -- Add Spotify URL when available
    null,  -- Add Apple Music URL when available
    null,  -- Add YouTube URL when available
    true,
    2
  );

  -- ============================================================
  -- Song 3: Sea of Tranquility
  -- ============================================================
  insert into musical_healer_songs (
    healer_id,
    title,
    description,
    themes,
    moods,
    angel_numbers,
    genre,
    spotify_url,
    apple_music_url,
    youtube_url,
    is_active,
    sort_order
  ) values (
    v_healer_id,
    'Sea of Tranquility',
    'A lush piano-and-strings composition praised for its awe-inspiring melodies. It gently explores how, through the quiet observation of tranquility, life''s most important and powerful moments subtly spill over — shaping your path without you even realizing it. In that serene realization comes the profound truth: through tranquility, the universe has been quietly shaping your existence the whole time through your destiny. It feels almost as if it was predetermined, and you are simply the observer, watching it all play out in this experience we call life.',
    array['tranquility', 'destiny', 'divine timing', 'surrender', 'observation', 'universe', 'life purpose', 'serenity'],
    array['serene', 'awe-inspiring', 'peaceful', 'transcendent', 'sublime', 'meditative'],
    array['777', '444', '111', '1212'],
    'piano and strings',
    null,  -- Add Spotify URL when available
    null,  -- Add Apple Music URL when available
    null,  -- Add YouTube URL when available
    true,
    3
  );

  raise notice 'Seeded 3 songs for Daniel Ketchum';
  raise notice 'Musical Healer #1 is live!';
end $$;

-- ============================================================
-- Verify the seed data
-- ============================================================
select h.artist_name, h.healing_styles, h.spiritual_themes, h.genres,
       count(s.id) as songs
from musical_healers h
left join musical_healer_songs s on s.healer_id = h.id
group by h.id;
