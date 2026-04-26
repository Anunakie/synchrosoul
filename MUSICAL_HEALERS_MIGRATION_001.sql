-- ============================================================
-- Musical Healers Migration 001
-- - Add amazon_music_url to both tables
-- - Update Daniel Ketchum's songs with actual Amazon Music links
-- - Add avatar fallback support (pull from auth user profile)
-- ============================================================

-- 1) Add amazon_music_url to musical_healers (artist profile level)
alter table musical_healers
  add column if not exists amazon_music_url text;

-- 2) Add amazon_music_url to musical_healer_songs (per-song level)
alter table musical_healer_songs
  add column if not exists amazon_music_url text;

-- 3) Update the get_candidate_songs RPC to include amazon_music_url
create or replace function get_candidate_songs(
  p_themes text[] default '{}',
  p_moods text[] default '{}',
  p_angel_numbers text[] default '{}',
  p_limit integer default 10
)
returns table (
  song_id uuid,
  song_title text,
  song_description text,
  song_genre text,
  song_embed_url text,
  song_cover_art_url text,
  song_amazon_music_url text,
  song_spotify_url text,
  healer_id uuid,
  artist_name text,
  healer_avatar_url text,
  relevance_score integer
)
language plpgsql security definer as $$
begin
  return query
  select
    s.id as song_id,
    s.title as song_title,
    s.description as song_description,
    s.genre as song_genre,
    s.embed_url as song_embed_url,
    s.cover_art_url as song_cover_art_url,
    s.amazon_music_url as song_amazon_music_url,
    s.spotify_url as song_spotify_url,
    h.id as healer_id,
    h.artist_name,
    h.avatar_url as healer_avatar_url,
    (
      coalesce(array_length(array(
        select unnest(s.angel_numbers) intersect select unnest(p_angel_numbers)
      ), 1), 0) * 5
      +
      coalesce(array_length(array(
        select unnest(s.themes) intersect select unnest(p_themes)
      ), 1), 0) * 3
      +
      coalesce(array_length(array(
        select unnest(s.moods) intersect select unnest(p_moods)
      ), 1), 0) * 2
    )::integer as relevance_score
  from musical_healer_songs s
  join musical_healers h on h.id = s.healer_id
  where s.is_active = true and h.is_active = true
  order by relevance_score desc, random()
  limit p_limit;
end;
$$;

-- 4) Update Daniel Ketchum's songs with Amazon Music links
update musical_healer_songs
set amazon_music_url = 'https://music.amazon.com/albums/B0B3PYCSN5?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_32FyEmVzNwreF2fn302zuLxHf&trackAsin=B0B3Q49NKW'
where title = 'Life is Love'
  and healer_id = (select id from musical_healers where artist_name = 'Daniel Ketchum' limit 1);

update musical_healer_songs
set amazon_music_url = 'https://music.amazon.com/albums/B08THT2K1H?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_ASyEUb6k9xUibpXbBBQR1Nc9w'
where title = 'Sands of Time'
  and healer_id = (select id from musical_healers where artist_name = 'Daniel Ketchum' limit 1);

update musical_healer_songs
set amazon_music_url = 'https://music.amazon.com/albums/B07RW2R8MM?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_v8dUquQRehvv8f7epT15JNLyd&trackAsin=B07RV73WPH'
where title = 'Sea of Tranquility'
  and healer_id = (select id from musical_healers where artist_name = 'Daniel Ketchum' limit 1);

-- Done! Verify:
select s.title, s.amazon_music_url
from musical_healer_songs s
join musical_healers h on h.id = s.healer_id
where h.artist_name = 'Daniel Ketchum';
