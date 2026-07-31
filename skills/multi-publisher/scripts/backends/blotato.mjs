// blotato.mjs — multi-publisher adapter for Blotato.
//
// Required env:
//   BLOTATO_API_KEY
// Endpoints:
//   POST https://backend.blotato.com/v2/posts
//   MCP upload: https://mcp.blotato.com/mcp (presigned URL)

const API_KEY = process.env.BLOTATO_API_KEY;
if (!API_KEY) throw new Error('BLOTATO_API_KEY missing');

const REST = 'https://backend.blotato.com';
const MCP  = 'https://mcp.blotato.com/mcp';
const HEADERS = { 'Content-Type': 'application/json', 'blotato-api-key': API_KEY };
const MCP_H   = { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream', 'blotato-api-key': API_KEY };

async function mcpCall(method, params, id = 1) {
  const res = await fetch(MCP, { method: 'POST', headers: MCP_H, body: JSON.stringify({ jsonrpc: '2.0', id, method: 'tools/call', params: { name: method, arguments: params } }) });
  const j = await res.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return JSON.parse(j.result.content[0].text);
}

export async function publish(payload, opts = {}) {
  const platform = inferPlatform(payload);
  const body = {
    post: {
      accountId: payload.accountId,
      content: { text: payload.text || '', mediaUrls: payload.mediaUrls || [], platform },
      target: { targetType: platform },
    },
  };
  if (payload.pageId) body.post.target.pageId = payload.pageId;
  if (opts.scheduledTime && opts.scheduledTime !== 'now') body.scheduledTime = opts.scheduledTime;
  if (opts.dryRun) return { id: 'dry-run', url: '(dry-run)' };

  const res = await fetch(`${REST}/v2/posts`, { method: 'POST', headers: HEADERS, body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(`blotato ${res.status}: ${JSON.stringify(json)}`);
  return { id: json.id, url: json.url };
}

function inferPlatform(payload) {
  // Best-effort: prefer the target.pageId/handle hint, otherwise by key set
  if (payload.pageId && /^\d+$/.test(payload.pageId)) return 'facebook';
  if (payload.tiktok) return 'tiktok';
  return 'instagram';
}

export const name = 'blotato';