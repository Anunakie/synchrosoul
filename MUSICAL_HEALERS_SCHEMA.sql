-- ============================================================
-- SynchroSoul: Musical Healers Feature
-- Run this in your Supabase SQL Editor
-- ============================================================

-- ============================================================
-- Table 1: musical_healers (Artist Profiles)
-- ============================================================
create table if not exists musical_healers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null unique,
  artist_name text not null,
  bio text,
  avatar_url text,
  website_url text,
  merch_url text,
  spotify_url text,
  apple_music_url text,
  soundcloud_url text,
  youtube_url text,
  tidal_url text,
  bandcamp_url text,
  healing_styles text[] default '{}',
  spiritual_themes text[] default '{}',
  genres text[] default '{}',
  is_verified boolean default false,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table musical_healers enable row level security;

-- Anyone can view active musical healers
create policy "Anyone can view active musical healers"
  on musical_healers for select
  using (is_active = true);

-- Artists can insert their own profile
create policy "Users can create their own musical healer profile"
  on musical_healers for insert
  with check (auth.uid() = user_id);

-- Artists can update their own profile
create policy "Users can update their own musical healer profile"
  on musical_healers for update
  using (auth.uid() = user_id);

-- Artists can delete their own profile
create policy "Users can delete their own musical healer profile"
  on musical_healers for delete
  using (auth.uid() = user_id);

create index if not exists musical_healers_user_id_idx on musical_healers(user_id);
create index if not exists musical_healers_active_idx on musical_healers(is_active) where is_active = true;
create index if not exists musical_healers_themes_idx on musical_healers using gin(spiritual_themes);
create index if not exists musical_healers_styles_idx on musical_healers using gin(healing_styles);
create index if not exists musical_healers_genres_idx on musical_healers using gin(genres);

-- Auto-update updated_at timestamp
create or replace function update_musical_healers_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger musical_healers_updated_at
  before update on musical_healers
  for each row execute function update_musical_healers_updated_at();


-- ============================================================
-- Table 2: musical_healer_songs (Song Catalog)
-- ============================================================
create table if not exists musical_healer_songs (
  id uuid default gen_random_uuid() primary key,
  healer_id uuid references musical_healers(id) on delete cascade not null,
  title text not null,
  description text,
  themes text[] default '{}',
  moods text[] default '{}',
  angel_numbers text[] default '{}',
  genre text,
  duration_seconds integer,
  spotify_url text,
  apple_music_url text,
  soundcloud_url text,
  youtube_url text,
  tidal_url text,
  bandcamp_url text,
  embed_url text,
  cover_art_url text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table musical_healer_songs enable row level security;

-- Anyone can view active songs from active healers
create policy "Anyone can view active songs"
  on musical_healer_songs for select
  using (
    is_active = true
    and exists (
      select 1 from musical_healers
      where musical_healers.id = musical_healer_songs.healer_id
      and musical_healers.is_active = true
    )
  );

-- Artists can manage their own songs (via healer_id)
create policy "Artists can insert their own songs"
  on musical_healer_songs for insert
  with check (
    exists (
      select 1 from musical_healers
      where musical_healers.id = musical_healer_songs.healer_id
      and musical_healers.user_id = auth.uid()
    )
  );

create policy "Artists can update their own songs"
  on musical_healer_songs for update
  using (
    exists (
      select 1 from musical_healers
      where musical_healers.id = musical_healer_songs.healer_id
      and musical_healers.user_id = auth.uid()
    )
  );

create policy "Artists can delete their own songs"
  on musical_healer_songs for delete
  using (
    exists (
      select 1 from musical_healers
      where musical_healers.id = musical_healer_songs.healer_id
      and musical_healers.user_id = auth.uid()
    )
  );

create index if not exists songs_healer_id_idx on musical_healer_songs(healer_id);
create index if not exists songs_themes_idx on musical_healer_songs using gin(themes);
create index if not exists songs_moods_idx on musical_healer_songs using gin(moods);
create index if not exists songs_angel_numbers_idx on musical_healer_songs using gin(angel_numbers);
create index if not exists songs_active_idx on musical_healer_songs(is_active) where is_active = true;


-- ============================================================
-- Table 3: song_recommendations (Tracking & Analytics)
-- ============================================================
create table if not exists song_recommendations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  song_id uuid references musical_healer_songs(id) on delete set null,
  healer_id uuid references musical_healers(id) on delete set null,
  reading_type text not null check (reading_type in ('oracle', 'oracle_instant', 'dream', 'synthesis')),
  context_number text,
  context_thought text,
  ai_reasoning text,
  clicked boolean default false,
  created_at timestamptz default now()
);

alter table song_recommendations enable row level security;

-- Users can see their own recommendations
create policy "Users can view their own recommendations"
  on song_recommendations for select
  using (auth.uid() = user_id);

-- System inserts recommendations (via service role from API routes)
-- No insert policy for regular users — only service role can insert
-- This prevents users from faking recommendations

-- Users can update their own (to mark as clicked)
create policy "Users can update their own recommendations"
  on song_recommendations for update
  using (auth.uid() = user_id);

create index if not exists recommendations_user_id_idx on song_recommendations(user_id);
create index if not exists recommendations_song_id_idx on song_recommendations(song_id);
create index if not exists recommendations_healer_id_idx on song_recommendations(healer_id);
create index if not exists recommendations_created_at_idx on song_recommendations(created_at desc);
create index if not exists recommendations_reading_type_idx on song_recommendations(reading_type);


-- ============================================================
-- View: musical_healer_stats (Artist Analytics)
-- ============================================================
create or replace view musical_healer_stats as
select
  mh.id as healer_id,
  mh.artist_name,
  count(distinct mhs.id) as total_songs,
  count(distinct sr.id) as total_recommendations,
  count(distinct sr.id) filter (where sr.clicked = true) as total_clicks,
  count(distinct sr.user_id) as unique_users_reached,
  round(
    case when count(sr.id) > 0
    then (count(sr.id) filter (where sr.clicked = true)::numeric / count(sr.id)::numeric) * 100
    else 0 end, 1
  ) as click_rate_pct
from musical_healers mh
left join musical_healer_songs mhs on mhs.healer_id = mh.id and mhs.is_active = true
left join song_recommendations sr on sr.healer_id = mh.id
where mh.is_active = true
group by mh.id, mh.artist_name;


-- ============================================================
-- RPC: Get candidate songs for AI matching
-- Called by the recommendation engine with relevant themes/moods
-- ============================================================
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
  song_themes text[],
  song_moods text[],
  song_angel_numbers text[],
  song_genre text,
  song_embed_url text,
  song_cover_art_url text,
  healer_id uuid,
  artist_name text,
  healer_avatar_url text
)
language plpgsql security definer as $$
begin
  return query
  select
    s.id as song_id,
    s.title as song_title,
    s.description as song_description,
    s.themes as song_themes,
    s.moods as song_moods,
    s.angel_numbers as song_angel_numbers,
    s.genre as song_genre,
    s.embed_url as song_embed_url,
    s.cover_art_url as song_cover_art_url,
    h.id as healer_id,
    h.artist_name,
    h.avatar_url as healer_avatar_url
  from musical_healer_songs s
  join musical_healers h on h.id = s.healer_id
  where s.is_active = true
    and h.is_active = true
  order by
    -- Score by overlap: themes, moods, angel numbers
    (
      coalesce(array_length(array(select unnest(s.themes) intersect select unnest(p_themes)), 1), 0) * 3
      + coalesce(array_length(array(select unnest(s.moods) intersect select unnest(p_moods)), 1), 0) * 2
      + coalesce(array_length(array(select unnest(s.angel_numbers) intersect select unnest(p_angel_numbers)), 1), 0) * 5
    ) desc,
    random() -- tie-breaker adds variety
  limit p_limit;
end;
$$;


-- ============================================================
-- Done! Tables, policies, indexes, view, and RPC created.
-- ============================================================
