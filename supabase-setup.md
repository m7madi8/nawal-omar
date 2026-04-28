# Supabase Setup (Form + Dashboard)

## 1) Create table

Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.retreat_requests (
  id text primary key,
  source text,
  "retreatType" text,
  "submittedAt" timestamptz,
  "createdAt" timestamptz default now(),
  "fullName" text,
  phone text,
  age text,
  city text,
  reason text,
  expectation text,
  "yogaExperience" text,
  "healthStatus" text,
  "healthDetails" text,
  activities jsonb,
  "freeNote" text,
  status text default 'pending'
);
```

## 2) RLS policies (public insert/select/update/delete)

```sql
alter table public.retreat_requests enable row level security;

create policy "public can insert retreat requests"
on public.retreat_requests
for insert
to anon
with check (true);

create policy "public can read retreat requests"
on public.retreat_requests
for select
to anon
using (true);

create policy "public can update retreat requests"
on public.retreat_requests
for update
to anon
using (true)
with check (true);

create policy "public can delete retreat requests"
on public.retreat_requests
for delete
to anon
using (true);
```

## 3) Put config in website

- In `wadi-rum-registration.html` form attrs:
  - `data-supabase-url="https://YOUR_PROJECT.supabase.co"`
  - `data-supabase-anon-key="YOUR_ANON_KEY"`
  - `data-supabase-table="retreat_requests"`

- In `dashboard.html` config:
  - `supabaseUrl: "https://YOUR_PROJECT.supabase.co"`
  - `supabaseAnonKey: "YOUR_ANON_KEY"`
  - `supabaseTable: "retreat_requests"`

## 4) Test

- Submit one request from `wadi-rum-registration.html`
- Check `retreat_requests` table in Supabase
- Open `dashboard.html` and confirm request appears
- Test `Mark Completed` and `Delete`
