-- Run this once in your Supabase SQL editor

create table if not exists sessions (
  id text primary key,
  day text,
  date text not null,
  type text not null default 'full',
  label text,
  bodyweight numeric,
  notes text,
  exercises jsonb default '[]',
  created_at timestamptz default now()
);

create table if not exists weights (
  id text primary key,
  date text not null unique,
  value numeric not null,
  created_at timestamptz default now()
);

create table if not exists ai_notes (
  id int primary key default 1,
  text text,
  summary text,
  generated_at timestamptz
);

-- RLS: enable but allow all (personal app, no auth)
alter table sessions enable row level security;
alter table weights enable row level security;
alter table ai_notes enable row level security;

create policy "allow all" on sessions for all using (true) with check (true);
create policy "allow all" on weights for all using (true) with check (true);
create policy "allow all" on ai_notes for all using (true) with check (true);
