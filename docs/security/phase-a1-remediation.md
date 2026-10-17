# Phase A.1 — Credential elimination & server RBAC

## Operator actions (required before production)

1. **Rotate** owner, developer, and all team passwords that may have been exposed in older client bundles or git history.
2. Set **`ADMIN_OWNER_PASSWORD`** (required for login).
3. Set **`ADMIN_DEVELOPER_PASSWORD`** if the developer account is used.
4. Set **`ADMIN_TEAM_ACCOUNTS`** JSON for staff (including built-in `shada` / `salma`):

```json
[
  {
    "username": "shada",
    "password": "<new-secret>",
    "name": "Shatha",
    "permissions": ["overview", "retreats"],
    "sourceScope": "wadi-rum"
  },
  {
    "username": "salma",
    "password": "<new-secret>",
    "name": "Salma",
    "permissions": ["overview", "retreats"],
    "sourceScope": "wadi-rum"
  }
]
```

`sourceScope: "wadi-rum"` limits registrations and Hyp orders to Wadi Rum only for scoped staff.

5. Set **`ADMIN_SESSION_SECRET`**, **`ADMIN_AUTH_EPOCH`** (e.g. `1`; bump to invalidate all sessions after rotation).
6. Optional: apply **`008_admin_session_revocations.sql`** for per-logout server revocation (requires service role).

## Session revocation guarantees

| Mechanism | Effect |
|-----------|--------|
| Cookie `Max-Age` / `exp` in token | Session ends automatically |
| `POST /api/admin/logout` | Clears cookie; revokes `sid` in DB **if** migration 008 + service role |
| `ADMIN_AUTH_EPOCH` change | **Immediately** invalidates all signed sessions |
| Stolen token before logout | Valid until expiry unless 008 revoke or epoch bump |

## Rate limiting

Login rate limit is **in-memory per server process** (30 attempts / 15 min / IP). Not shared across instances or survives restart. Use edge/WAF rate limiting in production for distributed protection.

## RBAC

API permissions are resolved **on every request** from `lib/admin/directory.js` — not from cookie-granted permission lists. See `lib/admin/routes.js` for the route matrix.
