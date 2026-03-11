-- ============================================================
-- SynchroSoul: Notifications Table + Helpers
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Notifications table
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text default 'general',
  title text not null,
  body text not null,
  emoji text default '✨',
  color text default '#a78bfa',
  read boolean default false,
  url text,
  created_at timestamptz default now()
);

alter table notifications enable row level security;
create policy "Users own their notifications" on notifications
  for all using (auth.uid() = user_id);

create index if not exists notifications_user_id_idx on notifications(user_id);
create index if not exists notifications_created_at_idx on notifications(created_at desc);

-- Add onboarding_complete + intention to profiles if not exists
alter table profiles add column if not exists intention text;
alter table profiles add column if not exists onboarding_complete boolean default false;
alter table profiles add column if not exists privacy_mode boolean default false;
alter table profiles add column if not exists avatar_url text;
alter table profiles add column if not exists avatar_color text default '#9b59b6';
alter table profiles add column if not exists bio text;
alter table profiles add column if not exists life_path int;
alter table profiles add column if not exists soul_urge int;
alter table profiles add column if not exists destiny int;

-- Add missing columns to angel_logs if not exists
alter table angel_logs add column if not exists voice_note_url text;
alter table angel_logs add column if not exists screenshot_url text;
alter table angel_logs add column if not exists verified boolean default false;

-- Add missing columns to posts if not exists
alter table posts add column if not exists angel_number text;
alter table posts add column if not exists resonates int default 0;
alter table posts add column if not exists is_public boolean default true;

-- RPC to increment resonates safely
create or replace function increment_resonates(post_id uuid)
returns void language plpgsql security definer as $$
begin
  update posts set resonates = coalesce(resonates, 0) + 1 where id = post_id;
end;
$$;

-- Function to create a sync match notification
create or replace function notify_sync_match(
  target_user_id uuid,
  matcher_name text,
  shared_number text,
  sync_score int
) returns void language plpgsql security definer as $$
begin
  insert into notifications (user_id, type, title, body, emoji, color)
  values (
    target_user_id,
    'sync_match',
    'New Sync Match! ' || sync_score || '%',
    matcher_name || ' just logged ' || shared_number || ' — you are cosmically aligned!',
    '💫',
    '#c9a84c'
  );
end;
$$;

-- Realtime: enable for notifications
alter publication supabase_realtime add table notifications;
