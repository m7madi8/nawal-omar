-- Phase A.2: environments that already ran 007 before the policy-name fix may still have
-- the permissive anon policy from 004 ("service can manage booking audit").
drop policy if exists "service can manage booking audit" on public.booking_audit_log;
