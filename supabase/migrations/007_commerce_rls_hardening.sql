-- Phase A security: restrict anon access to commerce/payment tables.
-- Server API routes must use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
-- Public registration forms keep INSERT-only on retreat_requests.

-- commerce_orders / items (from 001)
drop policy if exists "public can insert commerce orders" on public.commerce_orders;
drop policy if exists "public can read commerce orders" on public.commerce_orders;
drop policy if exists "public can update commerce orders" on public.commerce_orders;

drop policy if exists "public can insert commerce order items" on public.commerce_order_items;
drop policy if exists "public can read commerce order items" on public.commerce_order_items;
drop policy if exists "public can update commerce order items" on public.commerce_order_items;

-- payment_transactions (003)
drop policy if exists "service can manage payment transactions" on public.payment_transactions;

-- payment_attempts (006)
drop policy if exists "service can manage payment attempts" on public.payment_attempts;

-- payment_receipts / ledger / audit (004)
drop policy if exists "service can manage payment receipts" on public.payment_receipts;
drop policy if exists "service can manage payment ledger" on public.payment_ledger;
-- 004 creates "service can manage booking audit" (not "... audit log").
drop policy if exists "service can manage booking audit log" on public.booking_audit_log;
drop policy if exists "service can manage booking audit" on public.booking_audit_log;

-- site_analytics: writes go through /api/analytics with service role; reads are admin-only via API.
drop policy if exists "anon can read site analytics" on public.site_analytics;
drop policy if exists "anon can insert site analytics" on public.site_analytics;

-- retreat_requests: public forms may INSERT only (no anon read/update/delete).
alter table if exists public.retreat_requests enable row level security;

drop policy if exists "Enable read access for all users" on public.retreat_requests;
drop policy if exists "Enable insert for authenticated users only" on public.retreat_requests;
drop policy if exists "Enable insert for users based on user_id" on public.retreat_requests;
drop policy if exists "public can read retreat requests" on public.retreat_requests;
drop policy if exists "public can update retreat requests" on public.retreat_requests;
drop policy if exists "public can delete retreat requests" on public.retreat_requests;
drop policy if exists "anon can manage retreat requests" on public.retreat_requests;

drop policy if exists "anon can insert retreat requests" on public.retreat_requests;
create policy "anon can insert retreat requests"
  on public.retreat_requests
  for insert
  to anon
  with check (true);

-- Optional: tighten grants (RLS still applies). Service role retains full access via bypass.
revoke update, delete, truncate, references on public.commerce_orders from anon, authenticated;
revoke update, delete, truncate, references on public.commerce_order_items from anon, authenticated;
revoke all on public.payment_transactions from anon, authenticated;
revoke all on public.payment_attempts from anon, authenticated;
revoke all on public.payment_receipts from anon, authenticated;
revoke all on public.payment_ledger from anon, authenticated;
revoke all on public.booking_audit_log from anon, authenticated;
revoke select, update, delete on public.commerce_orders from anon, authenticated;
revoke select, update, delete on public.commerce_order_items from anon, authenticated;
revoke select, update, delete on public.site_analytics from anon, authenticated;

revoke select, update, delete on public.retreat_requests from anon, authenticated;
grant insert on public.retreat_requests to anon, authenticated;
