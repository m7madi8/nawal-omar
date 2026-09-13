import { supabaseInsert, SUPABASE_TABLE_RETREAT_REQUESTS } from '@/lib/commerce/supabase';

function requiredString(value, field) {
  const text = String(value || '').trim();
  if (!text) {
    const error = new Error(`Missing ${field}`);
    error.code = 'INVALID_REQUEST';
    throw error;
  }
  return text;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  try {
    const now = new Date().toISOString();
    const row = {
      id: requiredString(body.id, 'id'),
      source: requiredString(body.source, 'source'),
      retreatType: String(body.retreatType || ''),
      submittedAt: body.submittedAt || now,
      createdAt: body.createdAt || now,
      fullName: requiredString(body.fullName, 'fullName'),
      phone: requiredString(body.phone, 'phone'),
      age: String(body.age || ''),
      city: String(body.city || ''),
      reason: String(body.reason || ''),
      expectation: String(body.expectation || ''),
      yogaExperience: String(body.yogaExperience || ''),
      healthStatus: String(body.healthStatus || ''),
      healthDetails: String(body.healthDetails || ''),
      activities: Array.isArray(body.activities) ? body.activities : [],
      freeNote: String(body.freeNote || ''),
      status: String(body.status || 'pending'),
    };

    const inserted = await supabaseInsert(SUPABASE_TABLE_RETREAT_REQUESTS, row);
    return Response.json({ ok: true, id: inserted?.id || row.id });
  } catch (error) {
    const status = error.code === 'INVALID_REQUEST' ? 400 : 500;
    return Response.json(
      { error: error.message || 'Could not save registration', code: error.code || 'SUBMIT_FAILED' },
      { status },
    );
  }
}
