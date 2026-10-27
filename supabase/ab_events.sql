-- Week 4: ab_events table — logs the real homepage headline A/B test
-- (NOT simulated: these are real impression/click events from real
-- visits). Same public-demo RLS pattern as every other table so far,
-- since there is still no auth in this project.

create table ab_events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  variant     text not null,     -- 'A' or 'B'
  event_type  text not null      -- 'impression' or 'click'
);

alter table ab_events enable row level security;

create policy "public insert (class demo, no auth yet)"
  on ab_events for insert
  with check (true);

create policy "public read (class demo, no auth yet)"
  on ab_events for select
  using (true);
