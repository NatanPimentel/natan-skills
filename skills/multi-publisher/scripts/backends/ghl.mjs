// ghl.mjs — multi-publisher adapter for GoHighLevel (LeadConnector v2 API).
//
// Required env:
//   GHL_API_KEY          — private integration token (Bearer)
//   GHL_LOCATION_ID      — sub-account / location id
//
// Reference: https://highlevel.stoplight.io/docs/integrations/

const TOKEN = process.env.GHL_API_KEY;
const LOC   = process.env.GHL_LOCATION_ID;
if (!TOKEN) throw new Error('GHL_API_KEY missing');
if (!LOC)   throw new Error('GHL_LOCATION_ID missing');

const BASE = 'https://services.leadconnectorhq.com';
const HEADERS = () => ({
  'Authorization': `Bearer ${TOKEN}`,
  'Version': '2021-07-28',
  'Content-Type': 'application/json',
});

export async function publish(payload, opts = {}) {
  const platform = inferPlatform(payload);
  if (platform !== 'facebook' && platform !== 'instagram') {
    throw new Error(`GHL native publish supports facebook/instagram only (got ${platform})`);
  }

  // GHL social-planner endpoint: POST /social-media-posting/{locationId}/posts
  const body = {
    type: platform,
    summary: payload.text?.slice(0, 500) || '',
    media: (payload.mediaUrls || []).map(url => ({ url })),
    ...(payload.pageId ? { pageId: payload.pageId } : {}),
  };

  if (opts.scheduledTime && opts.scheduledTime !== 'now') body.scheduledAt = opts.scheduledTime;
  if (opts.dryRun) return { id: 'dry-run', url: '(dry-run)' };

  const res = await fetch(`${BASE}/social-media-posting/${LOC}/posts`, {
    method: 'POST',
    headers: HEADERS(),
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`ghl ${res.status}: ${JSON.stringify(json)}`);
  return { id: json.id, url: json.url || json.postUrl };
}

function inferPlatform(payload) {
  if (payload.pageId) return 'facebook';
  return 'instagram';
}

export const name = 'ghl';