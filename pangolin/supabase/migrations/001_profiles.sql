-- profiles table (linked 1:1 to auth.users)
create table if not exists public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  role          text check (role in ('client', 'freelancer', 'admin')),
  display_name  text,
  email         text,
  wallet_address text unique,
  avatar_url    text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;

-- Own profile: full access
create policy "users_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "users_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "users_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Wallet lookup: any authenticated user can look up wallet->profile
-- (needed for escrow freelancer linking)
create policy "authenticated_lookup_by_wallet" on public.profiles
  for select using (auth.role() = 'authenticated');

-- Auto-create empty profile row on new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
