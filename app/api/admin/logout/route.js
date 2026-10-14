import { revokeSessionId } from '@/lib/admin/session-revocation';
import {
  clearSessionCookie,
  readAdminSessionTokenFromRequest,
  verifyAdminSessionToken,
} from '@/lib/admin/session';

/**
 * Clears the browser cookie always. Server-side revocation is separate (migration 008).
 * If serverRevocation is "failed", a copied cookie may remain valid until exp or ADMIN_AUTH_EPOCH bump.
 */
export async function POST(request) {
  const token = readAdminSessionTokenFromRequest(request);
  const payload = verifyAdminSessionToken(token);
  let serverRevocation = 'skipped';
  if (payload?.sid) {
    const result = await revokeSessionId(payload.sid);
    if (result.skipped) {
      serverRevocation = 'skipped';
    } else if (result.serverRevoked) {
      serverRevocation = 'succeeded';
    } else {
      serverRevocation = 'failed';
    }
  }

  const headers = new Headers({ 'Content-Type': 'application/json' });
  clearSessionCookie(headers);
  return new Response(JSON.stringify({ ok: true, serverRevocation }), { status: 200, headers });
}
