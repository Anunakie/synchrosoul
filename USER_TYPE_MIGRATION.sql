-- Add user_type column to profiles table
alter table profiles add column if not exists user_type text default null;

-- Add comment for documentation
comment on column profiles.user_type is 'User type selected during onboarding: seeker, musician, healer, explorer';
