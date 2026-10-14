-- Durable Hyp / gateway checkout attempts (no card data, no secrets)

create table if not exists public.payment_attempts (
  id text primary key,
  order_id text not null references public.commerce_orders(id) on delete cascade,
  provider text not null default 'hyp',
  correlation_id text not null,
  status text not null default 'created',
  amount numeric,
  currency text,
  hyp_transaction_id text,
  failure_code text,
  failure_reason text,
  sign_result text,
  last_event text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists payment_attempts_order_idx
  on public.payment_attempts (order_id, created_at desc);

create unique index if not exists payment_attempts_correlation_idx
  on public.payment_attempts (correlation_id);

create index if not exists payment_attempts_status_idx
  on public.payment_attempts (status);

alter table public.payment_attempts enable row level security;

-- Server uses anon key from API routes (same pattern as payment_transactions).
create policy "service can manage payment attempts"
on public.payment_attempts
for all
to anon
using (true)
with check (true);
