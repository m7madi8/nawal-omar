-- One active Hyp SIGN session per order (multi-instance safe).
-- Pre-check before apply:
--   select order_id, count(*) from payment_attempts
--   where status in ('created', 'awaiting_customer')
--   group by order_id having count(*) > 1;

create unique index if not exists payment_attempts_one_active_per_order_idx
  on public.payment_attempts (order_id)
  where status in ('created', 'awaiting_customer');
