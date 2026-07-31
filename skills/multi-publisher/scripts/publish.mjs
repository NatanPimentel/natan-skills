#!/usr/bin/env node
// publish.mjs — multi-publisher generic dispatcher.
// Routes to one of: blotato / ghl / postiz backends based on PUBLISHER_BACKEND env.
//
// Usage:
//   node --env-file=.env skills/multi-publisher/scripts/publish.mjs \
//     <agenda.json> <scheduledTime|now> [--dry-run] [--mode=carousel|single-image]
//
// Mode:
//   carousel       (default) — 5-6 destinations, expects N mediaUrls
//   single-image            — 1 mediaUrl, skips TikTok (requires ≥2)
//
// Destinations (when configured via env):
//   - Instagram   PUBLISHER_INSTAGRAM_ACCOUNT_ID
//   - Facebook    PUBLISHER_FACEBOOK_ACCOUNT_ID + PUBLISHER_FACEBOOK_PAGE_ID
//   - LinkedIn    PUBLISHER_LINKEDIN_ACCOUNT_ID (×2 if PUBLISHER_LINKEDIN_PAGE_ID set)
//   - TikTok      PUBLISHER_TIKTOK_ACCOUNT_ID (skipped on single-image)
//   - Threads     PUBLISHER_THREADS_ACCOUNT_ID (no-CTA enforced — see note)

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const BACKEND = process.env.PUBLISHER_BACKEND || 'blotato';
const DRY_RUN = process.argv.includes('--dry-run');
const modeArg = process.argv.find(a => a.startsWith('--mode='));
const MODE = modeArg ? modeArg.split('=')[1] : 'carousel';
if (!['carousel', 'single-image'].includes(MODE)) {
  console.error(`[FATAL] invalid --mode=${MODE}. Use carousel or single-image.`);
  process.exit(1);
}

const positional = process.argv.slice(2).filter(a => !a.startsWith('--'));
const [agendaPath, scheduledTime] = positional;
if (!agendaPath || !scheduledTime) {
  console.error('Usage: node publish.mjs <agenda.json> <scheduledTime|now> [--dry-run] [--mode=carousel|single-image]');
  process.exit(1);
}

// ── Load backend adapter dynamically ────────────────────────────────────
const adapterPath = `./backends/${BACKEND}.mjs`;
let backend;
try {
  backend = await import(adapterPath);
} catch (e) {
  console.error(`[FATAL] backend "${BACKEND}" not available: ${e.message}`);
  console.error(`       available: blotato, ghl, postiz`);
  process.exit(1);
}

// ── Account resolution from env ─────────────────────────────────────────
function accountId(platform) {
  const key = `PUBLISHER_${platform.toUpperCase()}_ACCOUNT_ID`;
  const v = process.env[key];
  if (!v) return null;
  return v;
}
function pageId(platform) {
  const key = `PUBLISHER_${platform.toUpperCase()}_PAGE_ID`;
  return process.env[key] || null;
}

const agenda = JSON.parse(readFileSync(agendaPath, 'utf8'));
const mediaUrls = agenda.slides?.map(s => s.url || s.path) || agenda.mediaUrls || [];
const caption = agenda.captions?.instagram || agenda.caption || '';

const targets = [];
if (accountId('instagram')) targets.push({ name: 'instagram', payload: { accountId: accountId('instagram'), text: caption, mediaUrls } });
if (accountId('facebook'))  targets.push({ name: 'facebook',  payload: { accountId: accountId('facebook'),  text: caption, mediaUrls, pageId: pageId('facebook') } });
if (accountId('linkedin')) {
  targets.push({ name: 'linkedin-personal', payload: { accountId: accountId('linkedin'), text: caption, mediaUrls } });
  const liPage = pageId('linkedin');
  if (liPage) targets.push({ name: 'linkedin-page', payload: { accountId: accountId('linkedin'), text: caption, mediaUrls, pageId: liPage } });
}
if (accountId('tiktok') && MODE === 'carousel') {
  targets.push({ name: 'tiktok', payload: { accountId: accountId('tiktok'), text: caption, mediaUrls } });
}
if (accountId('threads')) {
  // Threads expects no-CTA, plain text — see validateThreadsText() in adapter
  targets.push({ name: 'threads', payload: { accountId: accountId('threads'), text: caption, mediaUrls: [] } });
}

console.log(`[multi-publisher] backend=${BACKEND} mode=${MODE} targets=${targets.length} dry_run=${DRY_RUN}`);

let exitCode = 0;
for (const t of targets) {
  try {
    const result = await backend.publish(t.payload, { scheduledTime, dryRun: DRY_RUN });
    console.log(`  ✓ ${t.name}: ${result.url || result.id || 'ok'}`);
  } catch (e) {
    console.error(`  ✗ ${t.name}: ${e.message}`);
    exitCode = 1;
  }
}

process.exit(exitCode);