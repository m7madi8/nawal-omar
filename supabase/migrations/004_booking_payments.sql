-- Booking payments: receipts (idempotent PDF docs) + offline ledger + audit trail



alter table public.commerce_orders

  add column if not exists amount_paid numeric default 0,

  add column if not exists booking_reference text;



create table if not exists public.payment_receipts (

  id text primary key,

  order_id text references public.commerce_orders(id) on delete cascade,

  document_number text not null,

  document_type text not null default 'payment_receipt',

  payment_transaction_id text,

  amount numeric not null,

  currency text,

  metadata jsonb,

  created_at timestamptz default now()

);



create unique index if not exists payment_receipts_doc_number_idx

  on public.payment_receipts (document_number);



create unique index if not exists payment_receipts_idempotency_idx

  on public.payment_receipts (order_id, payment_transaction_id)

  where payment_transaction_id is not null;



create table if not exists public.payment_ledger (

  id text primary key,

  order_id text references public.commerce_orders(id) on delete cascade,

  amount numeric not null,

  currency text,

  method text not null,

  reference text,

  note text,

  recorded_by text,

  payment_date timestamptz default now(),

  created_at timestamptz default now()

);



create index if not exists payment_ledger_order_idx on public.payment_ledger (order_id);



create table if not exists public.booking_audit_log (

  id text primary key,

  order_id text,

  retreat_request_id text,

  action text not null,

  actor text,

  payload jsonb,

  created_at timestamptz default now()

);



create index if not exists booking_audit_order_idx on public.booking_audit_log (order_id);



alter table public.payment_receipts enable row level security;

alter table public.payment_ledger enable row level security;

alter table public.booking_audit_log enable row level security;



create policy "service can manage payment receipts"

on public.payment_receipts for all to anon using (true) with check (true);



create policy "service can manage payment ledger"

on public.payment_ledger for all to anon using (true) with check (true);



create policy "service can manage booking audit"

on public.booking_audit_log for all to anon using (true) with check (true);


