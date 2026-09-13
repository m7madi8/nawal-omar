-- Unified commerce orders (products, lessons, retreats, events)

create table if not exists public.commerce_orders (
  id text primary key,
  status text default 'pending',
  payment_status text default 'unpaid',
  payment_method text,
  currency text,
  subtotal numeric,
  total numeric,
  customer jsonb,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.commerce_order_items (
  id text primary key,
  order_id text references public.commerce_orders(id) on delete cascade,
  commerce_type text not null,
  item_id text not null,
  title text,
  quantity int default 1,
  unit_price numeric,
  currency text,
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists commerce_order_items_event_idx
  on public.commerce_order_items (commerce_type, item_id);

create index if not exists commerce_order_items_order_idx
  on public.commerce_order_items (order_id);

alter table public.commerce_orders enable row level security;
alter table public.commerce_order_items enable row level security;

create policy "public can insert commerce orders"
on public.commerce_orders
for insert
to anon
with check (true);

create policy "public can read commerce orders"
on public.commerce_orders
for select
to anon
using (true);

create policy "public can update commerce orders"
on public.commerce_orders
for update
to anon
using (true)
with check (true);

create policy "public can insert commerce order items"
on public.commerce_order_items
for insert
to anon
with check (true);

create policy "public can read commerce order items"
on public.commerce_order_items
for select
to anon
using (true);

create policy "public can update commerce order items"
on public.commerce_order_items
for update
to anon
using (true)
with check (true);
