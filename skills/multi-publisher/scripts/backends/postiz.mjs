// postiz.mjs — multi-publisher adapter for Postiz (self-hosted).
//
// Required env:
//   POSTIZ_API_KEY       — Postiz integration key
//   POSTIZ_BASE_URL      — e.g. https://postiz.example.com (no trailing slash)
//
// Reference: https://docs.postiz.com/public-api

const KEY  = process.env.POSTIZ_API_KEY;
const BASE = process.env.POSTIZ_BASE_URL?.replace(/\/$/, '');
if (!KEY)  throw new Error('POSTIZ_API_KEY missing');
if (!BASE) throw new Error('POSTIZ_BASE_URL missing');

const HEADERS = {
  'Authorization': `Bearer ${KEY}`,
  'Content-Type': 'application/json',
};

export async function publish(payload, opts = {}) {
  const platform = inferPlatform(payload);
  const body = {
    type: 'schedule' as const,
    date: opts.scheduledTime === 'now' ? new Date().toISOString() : opts.scheduledTime,
    shortLink: false,
    tags: [],
    posts: [
      {
        integration: payload.accountId, // Postiz uses integration id, not platform accountId
        content: payload.text || '',
        media: (payload.mediaUrls || []).map(url => ({ url, type: 'image' })),
        settings: payload.pageId ? { pageId: payload.pageId } : {},
      },
    ],
  };

  if (opts.dryRun) return { id: 'dry-run', url: '(dry-run)' };

  const res = await fetch(`${BASE}/public/v1/posts`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`postiz ${res.status}: ${JSON.stringify(json)}`);
  return { id: json.id, url: json.postUrl };
}

function inferPlatform(payload) {
  if (payload.pageId) return 'facebook';
  return 'instagram';
}

export const name = 'postiz';