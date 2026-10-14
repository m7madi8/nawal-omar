# Phase A.3 — Admin production configuration

## Production contract (`NODE_ENV=production`)

| Requirement | Code |
|-------------|------|
| `ADMIN_SESSION_SECRET` set | `getAdminRuntimeConfigIssue()` → `ADMIN_SESSION_NOT_CONFIGURED` |
| `SUPABASE_SERVICE_ROLE_KEY` set | `ADMIN_SERVER_NOT_CONFIGURED` |
| Revocation table queryable (migration 008) before login | `ensureAdminOperationalReadiness()` → `ADMIN_REVOCATION_STORAGE_UNAVAILABLE` |
| `ADMIN_SESSION_REVOCATION_DISABLED` | Ignored; revocation checks always required when service role is set |

Login runs `ensureAdminOperationalReadiness()` after password verification and **before** issuing a session cookie.

Protected routes use the same sync config gate (`requireAdminAccess`) plus per-request revocation lookup.

## Readiness probe limits

`probeRevocationStorageReady` performs a service-role `SELECT` on `admin_session_revocations` with `limit=1`. It confirms the table is reachable at request time; it is not a full schema migration audit.

## Logout

Response includes `serverRevocation`: `succeeded` | `skipped` | `failed`. Cookie is always cleared. `failed` means the session may still be valid server-side if the cookie was copied before logout.
