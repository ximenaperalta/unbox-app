-- Week 4: marketing_assets table — mirrors core_outputs / research_outputs /
-- pricing_scenarios' RLS pattern exactly (public demo insert/select
-- policies, no auth yet). Holds saved output from the /marketing
-- simulated marketing-kit generator (generateMarketingBundle()).

create table marketing_assets (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now(),
  product          text not null,
  segment          text not null,        -- 'Local' or 'Scale'
  persona          jsonb,
  landing_copy     jsonb,
  social_posts     jsonb,                -- array of 10
  video_scripts    jsonb,                -- array of 3
  campaign_calendar jsonb,               -- array of 14
  is_simulated     boolean default true
);

alter table marketing_assets enable row level security;

create policy "public insert (class demo, no auth yet)"
  on marketing_assets for insert
  with check (true);

create policy "public read (class demo, no auth yet)"
  on marketing_assets for select
  using (true);
