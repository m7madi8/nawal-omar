import {
  supabaseInsert,
  supabaseSelect,
  SUPABASE_TABLE_ANALYTICS,
} from '@/lib/commerce/supabase';

const ALLOWED_EVENTS = new Set([
  'page_view',
  'form_view',
  'form_start',
  'form_complete',
  'form_abandon',
]);

const MAX_BATCH = 20;
const MAX_TEXT = 200;

function cleanText(value, max = MAX_TEXT) {
  return String(value || '')
    .trim()
    .slice(0, max)
    .replace(/[\u0000-\u001f\u007f]/g, '');
}

function cleanPath(value) {
  const raw = cleanText(value, 300) || '/';
  if (!raw.startsWith('/')) return '/';
  if (raw.startsWith('/admin') || raw.startsWith('/api')) return '';
  return raw.split('?')[0].split('#')[0] || '/';
}

function normalizeEvent(input) {
  if (!input || typeof input !== 'object') return null;
  const event = cleanText(input.event, 40);
  const path = cleanPath(input.path);
  if (!ALLOWED_EVENTS.has(event) || !path) return null;

  const formId = cleanText(input.formId || input.form_id, 80);
  if ((event === 'form_view' || event === 'form_start' || event === 'form_complete' || event === 'form_abandon') && !formId) {
    return null;
  }

  const now = new Date().toISOString();
  return {
    id: cleanText(input.id, 80) || `an-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    event,
    path,
    form_id: formId || null,
    session_id: cleanText(input.sessionId || input.session_id, 64) || null,
    lang: cleanText(input.lang, 8) || null,
    referrer: cleanText(input.referrer, 300) || null,
    utm_source: cleanText(input.utm_source || input.utmSource, 100) || null,
    utm_medium: cleanText(input.utm_medium || input.utmMedium, 100) || null,
    utm_campaign: cleanText(input.utm_campaign || input.utmCampaign, 100) || null,
    created_at: cleanText(input.createdAt || input.created_at, 40) || now,
  };
}

function rangeStart(range) {
  const days = range === '90d' ? 90 : range === '30d' ? 30 : 7;
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - days);
  return start.toISOString();
}

function summarize(rows) {
  const pages = {};
  const forms = {};

  rows.forEach((row) => {
    const path = row.path || '/';
    const event = row.event;
    if (event === 'page_view') {
      pages[path] = (pages[path] || 0) + 1;
    }
    if (!row.form_id) return;
    const form = (forms[row.form_id] = forms[row.form_id] || {
      formId: row.form_id,
      path,
      views: 0,
      starts: 0,
      completes: 0,
      abandons: 0,
    });
    if (event === 'form_view') form.views += 1;
    if (event === 'form_start') form.starts += 1;
    if (event === 'form_complete') form.completes += 1;
    if (event === 'form_abandon') form.abandons += 1;
  });

  const pageList = Object.keys(pages)
    .map((path) => ({ path, views: pages[path] }))
    .sort((a, b) => b.views - a.views);

  const formList = Object.keys(forms)
    .map((id) => {
      const form = forms[id];
      const open = Math.max(0, form.starts - form.completes);
      const dropRate = form.starts ? Math.round((open / form.starts) * 100) : 0;
      return Object.assign({}, form, { leftWithoutSubmit: open, dropRate });
    })
    .sort((a, b) => b.starts - a.starts || b.views - a.views);

  return {
    totals: {
      pageViews: pageList.reduce((sum, row) => sum + row.views, 0),
      formViews: formList.reduce((sum, row) => sum + row.views, 0),
      formStarts: formList.reduce((sum, row) => sum + row.starts, 0),
      formCompletes: formList.reduce((sum, row) => sum + row.completes, 0),
      leftWithoutSubmit: formList.reduce((sum, row) => sum + row.leftWithoutSubmit, 0),
    },
    pages: pageList,
    forms: formList,
  };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  const list = Array.isArray(body) ? body : Array.isArray(body?.events) ? body.events : [body];
  const rows = list.slice(0, MAX_BATCH).map(normalizeEvent).filter(Boolean);
  if (!rows.length) {
    return Response.json({ error: 'No valid events' }, { status: 400 });
  }

  try {
    for (const row of rows) {
      await supabaseInsert(SUPABASE_TABLE_ANALYTICS, row);
    }
    return Response.json({ ok: true, count: rows.length });
  } catch (error) {
    return Response.json(
      { error: error.message || 'Could not save analytics', code: 'ANALYTICS_FAILED' },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '7d';
  const since = rangeStart(range);

  try {
    const rows = await supabaseSelect(
      SUPABASE_TABLE_ANALYTICS,
      `select=event,path,form_id,created_at&created_at=gte.${encodeURIComponent(since)}&order=created_at.desc&limit=5000`,
    );
    if (!rows) {
      return Response.json(
        {
          error: 'Analytics table missing or unreachable. Run supabase/migrations/002_site_analytics.sql',
          code: 'TABLE_MISSING',
          range,
          totals: { pageViews: 0, formViews: 0, formStarts: 0, formCompletes: 0, leftWithoutSubmit: 0 },
          pages: [],
          forms: [],
        },
        { status: 200 },
      );
    }
    return Response.json(Object.assign({ ok: true, range, since }, summarize(rows)));
  } catch (error) {
    return Response.json(
      { error: error.message || 'Could not load analytics', code: 'ANALYTICS_LOAD_FAILED' },
      { status: 500 },
    );
  }
}
