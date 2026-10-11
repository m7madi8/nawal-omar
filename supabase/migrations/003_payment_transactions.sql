-- Hyp Pay / gateway payment audit + idempotency (no card data)

create table if not exists public.payment_transactions (
  id text primary key,
  order_id text references public.commerce_orders(id) on delete set null,
  provider text not null default 'hyp',
  hyp_transaction_id text,
  amount numeric,
  currency text,
  status text not null default 'pending',
  redirect_query text,
  verify_response text,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists payment_transactions_hyp_id_idx
  on public.payment_transactions (hyp_transaction_id)
  where hyp_transaction_id is not null;

create index if not exists payment_transactions_order_idx
  on public.payment_transactions (order_id);

alter table public.payment_transactions enable row level security;

create policy "service can manage payment transactions"
on public.payment_transactions
for all
to anon
using (true)
with check (true);
