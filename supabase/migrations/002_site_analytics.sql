-- Site analytics (page views + form funnel)
-- Run this in the Supabase SQL Editor once.

create table if not exists public.site_analytics (
  id text primary key,
  event text not null,
  path text not null,
  form_id text,
  session_id text,
  lang text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  created_at timestamptz not null default now()
);

create index if not exists site_analytics_created_at_idx
  on public.site_analytics (created_at desc);

create index if not exists site_analytics_event_created_at_idx
  on public.site_analytics (event, created_at desc);

create index if not exists site_analytics_path_created_at_idx
  on public.site_analytics (path, created_at desc);

create index if not exists site_analytics_form_event_idx
  on public.site_analytics (form_id, event, created_at desc);

alter table public.site_analytics enable row level security;

drop policy if exists "anon can insert site analytics" on public.site_analytics;
create policy "anon can insert site analytics"
  on public.site_analytics
  for insert
  to anon
  with check (true);

drop policy if exists "anon can read site analytics" on public.site_analytics;
create policy "anon can read site analytics"
  on public.site_analytics
  for select
  to anon
  using (true);

-- No public update/delete — analytics rows are append-only.
