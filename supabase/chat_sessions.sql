-- Week 5: chat_sessions table — mirrors core_outputs / research_outputs /
-- pricing_scenarios / marketing_assets / ab_events' RLS pattern exactly
-- (public demo insert/select/update policies, no auth yet). Holds one row
-- per confirmed /chat session: the visitor's 3 intake answers, whether the
-- guardrail fired, the computed recommendation, and an optional rating.

create table chat_sessions (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  product              text not null,
  market               text,
  help_needed          text not null,
  guardrail_triggered  boolean not null default false,
  recommended_tool     text,
  reason               text,
  rating               text check (rating in ('up', 'down'))
);

alter table chat_sessions enable row level security;

create policy "public insert (class demo, no auth yet)"
  on chat_sessions for insert
  with check (true);

create policy "public read (class demo, no auth yet)"
  on chat_sessions for select
  using (true);

create policy "public update rating (class demo, no auth yet)"
  on chat_sessions for update
  using (true);
