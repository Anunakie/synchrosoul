-- Local Healers Migration to Supabase
-- Run in Supabase SQL Editor

create table if not exists healers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  title text not null default '',
  bio text not null default '',
  location text not null default '',
  city text not null default '',
  state text not null default '',
  country text not null default '',
  modalities text[] default '{}',
  angel_numbers text[] default '{}',
  life_path_number int,
  photo text,
  website text,
  email text,
  phone text,
  instagram text,
  session_types text[] default '{}',
  price_range text default '',
  is_verified boolean default false,
  truth_score int default 50,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes
create index if not exists idx_healers_user_id on healers(user_id);
create index if not exists idx_healers_active on healers(is_active);
create index if not exists idx_healers_location on healers(city, state, country);

-- RLS
alter table healers enable row level security;

-- Everyone can view active healers
create policy "Active healers are viewable by everyone"
  on healers for select
  using (is_active = true);

-- Users can insert their own healer profile
create policy "Users can create their own healer profile"
  on healers for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own healer profile
create policy "Users can update their own healer profile"
  on healers for update
  to authenticated
  using (auth.uid() = user_id);

-- Users can delete their own healer profile
create policy "Users can delete their own healer profile"
  on healers for delete
  to authenticated
  using (auth.uid() = user_id);

-- Updated_at trigger
create trigger healers_updated_at
  before update on healers
  for each row execute function update_updated_at();
