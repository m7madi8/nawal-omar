# Hyp Pay Security — Phase A

## Authentication

- **POST** `/api/admin/login` — verifies credentials server-side, sets HttpOnly `nawal_admin_session` cookie.
- **POST** `/api/admin/logout` — clears session cookie.
- **GET** `/api/admin/session` — returns current admin profile (no secrets).
- All `/api/admin/*` routes require a valid session (except login).
- State-changing admin routes also require same-site `Origin` or `X-Requested-With: XMLHttpRequest`.

### Required env

| Variable | Purpose |
|----------|---------|
| `ADMIN_SESSION_SECRET` | HMAC signing key for session cookie (required) |
| `ADMIN_OWNER_PASSWORD` | Owner login (production); dev uses legacy default if unset |
| `ADMIN_DEVELOPER_PASSWORD` | Developer login (production) |
| `ADMIN_EXTRA_ACCOUNTS` | Optional JSON for extra staff not in built-in list |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only DB access for commerce/payment |

`ADMIN_API_KEY` is **no longer** sent to the browser.

### Team members created only in the admin UI (localStorage)

Those passwords are **not** on the server. Add matching entries to `ADMIN_EXTRA_ACCOUNTS` or use built-in accounts verified on the server.

## Database

Apply migrations in order through **009** (007 RLS hardening, 008 session revocations, 009 booking audit policy fix if 007 ran earlier):

1. `006_payment_attempts.sql` (if not already applied)
2. `007_commerce_rls_hardening.sql`

After **007**, set `SUPABASE_SERVICE_ROLE_KEY` on the app server before deploy.

Public forms may still **INSERT** into `retreat_requests` via the anon key. Admin reads/writes registrations via `/api/admin/registrations`.

## Deployment sequence

1. Set env vars on hosting (session secret, service role, owner passwords).
2. Run migration **007** in Supabase SQL editor.
3. Deploy application.
4. Sign in at `/admin` and verify registrations, invoices, and commerce order detail load.
5. Run a test registration on a public form.
6. Remove `ADMIN_API_KEY` from production env if present.
