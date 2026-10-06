-- Week 3: pricing_scenarios table — mirrors core_outputs / research_outputs'
-- RLS pattern exactly (public demo insert/select policies, no auth yet).

create table pricing_scenarios (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz default now(),
  segment         text not null,        -- 'local' or 'scale'
  total_users     integer not null,
  tier_mix        jsonb not null,       -- { sample: pct, run: pct, line: pct }
  tier_prices     jsonb not null,       -- { sample: 0, run: 9, line: 29 } monthly, USD
  monthly_revenue numeric not null,
  annual_revenue  numeric not null
);

alter table pricing_scenarios enable row level security;

create policy "public insert (class demo, no auth yet)"
  on pricing_scenarios for insert
  with check (true);

create policy "public read (class demo, no auth yet)"
  on pricing_scenarios for select
  using (true);
