-- UNBOX Week 2 — /research Research + Benchmarking Agent
-- Run this in the Supabase SQL editor (same project connected since Week 0)
-- before wiring up the /research page.

create table research_outputs (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz default now(),
  product        text not null,
  market         text not null,
  global_examples jsonb,
  mexico_note    text,
  competitors    jsonb,
  risk_map       jsonb,
  is_simulated   boolean default true
);

alter table research_outputs enable row level security;

create policy "public insert (class demo, no auth yet)"
  on research_outputs for insert
  with check (true);

create policy "public read (class demo, no auth yet)"
  on research_outputs for select
  using (true);
