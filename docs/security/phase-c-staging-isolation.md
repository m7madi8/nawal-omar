# Phase C — Staging isolation and environment guards

## Supabase (server)

- `lib/commerce/supabase.js` no longer uses embedded project URL or anon key for server REST calls.
- Required: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- `getPublicSupabaseAnonKey()` is env-only (browser forms must set `SUPABASE_ANON_KEY`).

Legacy static HTML registration scripts may still embed old URLs until updated separately.

## Hyp terminal guard

- Classification: `isHypTestTerminal(masof)` — Masof prefix `00100` (existing Hyp testing docs in repo).
- `NAWAL_DEPLOYMENT_MODE` or `DEPLOYMENT_MODE`: `development` | `staging` | `production`.
- Staging/development with payments enabled: test terminal only (`HYP_LIVE_TERMINAL_FORBIDDEN` otherwise).
- Production with payments enabled: non-test terminal only (`HYP_TEST_TERMINAL_IN_PRODUCTION` otherwise).
- `HYP_ENVIRONMENT` is not used as a safety gate.
- On `NODE_ENV=production` without `VERCEL_ENV`, set `NAWAL_DEPLOYMENT_MODE` explicitly when Hyp is enabled.

## Checkout

- `assertCheckoutPrerequisites` runs before order insert (database + Hyp deployment when Hyp operational).

## Tests

`npm run test:security-phase-c` — env-only mocks, no network.

## Before staging deploy (manual)

1. Confirm staging env file sets **staging** Supabase URL and service role (not production project).
2. Set `NAWAL_DEPLOYMENT_MODE=staging`.
3. Use Hyp test terminal (`00100…`), `HYP_PAYMENTS_ENABLED=true` only on staging.
4. Set `HYP_RETURN_URL` and portal success URL to staging host only.
5. Run security tests a → c and `npm run build`.
