-- Optional: per-session logout revocation (service role writes; no anon access).
-- Apply after 007. Without this table, logout clears the cookie only; use ADMIN_AUTH_EPOCH to invalidate all sessions.

create table if not exists public.admin_session_revocations (
  session_id text primary key,
  revoked_at timestamptz not null default now()
);

create index if not exists admin_session_revocations_revoked_at_idx
  on public.admin_session_revocations (revoked_at desc);

alter table public.admin_session_revocations enable row level security;

-- No policies for anon/authenticated — only service_role (bypasses RLS) may read/write.
