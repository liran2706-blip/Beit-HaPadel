-- ============================================================
-- Israel Padel Platform — Supabase SQL Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- ─── profiles ────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text not null,
  level numeric not null default 3 check (level in (2, 2.5, 3, 3.5, 4, 4.5, 5)),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_public_read" on profiles for select using (true);
create policy "profiles_own_insert" on profiles for insert with check (auth.uid() = id);
create policy "profiles_own_update" on profiles for update using (auth.uid() = id);

-- ─── tournaments ─────────────────────────────────────────────
create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  time_start text not null,
  time_end text not null,
  location text not null,
  level_min numeric not null default 2.5,
  level_max numeric not null default 3.5,
  price integer not null default 0,
  max_players integer not null default 20,
  paybox_url text,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'completed')),
  description text,
  created_at timestamptz not null default now()
);

alter table tournaments enable row level security;

create policy "tournaments_public_read" on tournaments for select using (true);
create policy "tournaments_admin_all" on tournaments for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
) with check (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- ─── tournament_registrations ────────────────────────────────
create table if not exists tournament_registrations (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid not null references tournaments(id) on delete cascade,
  player_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique(tournament_id, player_id)
);

create index if not exists tr_tournament_id_idx on tournament_registrations(tournament_id);
create index if not exists tr_player_id_idx on tournament_registrations(player_id);

alter table tournament_registrations enable row level security;

create policy "tr_public_read" on tournament_registrations for select using (true);

create policy "tr_own_insert" on tournament_registrations for insert
  with check (auth.uid() = player_id);

create policy "tr_admin_update" on tournament_registrations for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- ─── Make yourself admin ─────────────────────────────────────
-- After running this schema, run this to make your account admin:
-- UPDATE profiles SET is_admin = true WHERE id = 'YOUR_USER_ID';
