-- UNBOX Week 1 — /core Generative Core Agent
-- Run this in the Supabase SQL editor (same project connected in Week 0)
-- before wiring up the /core page.

create table core_outputs (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz default now(),
  product      text not null,
  customer     text not null,
  brand_voice  text not null,
  budget       text,
  box_type     text,
  materials    text,
  inserts      text,
  reveal_moment text,
  brand_feel   text,
  is_simulated boolean default true
);

alter table core_outputs enable row level security;

create policy "public insert (class demo, no auth yet)"
  on core_outputs for insert
  with check (true);

create policy "public read (class demo, no auth yet)"
  on core_outputs for select
  using (true);
