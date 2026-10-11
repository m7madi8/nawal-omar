export function authorizeAdminRequest(request) {
  const expected = String(process.env.ADMIN_API_KEY || '').trim();
  if (!expected) return false;
  const provided = String(request.headers.get('x-admin-key') || '').trim();
  return provided && provided === expected;
}

export function adminUnauthorizedResponse() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
