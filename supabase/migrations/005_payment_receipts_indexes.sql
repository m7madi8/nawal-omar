create index if not exists payment_receipts_created_at_idx
  on public.payment_receipts (created_at desc);

create index if not exists payment_receipts_method_idx
  on public.payment_receipts ((metadata->>'paymentMethod'));

create index if not exists payment_receipts_status_idx
  on public.payment_receipts ((metadata->>'documentStatus'));
