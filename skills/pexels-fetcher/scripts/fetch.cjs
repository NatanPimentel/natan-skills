#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const query = getArg('query');
const outputDir = getArg('output');
const customFilename = getArg('filename');

if (!query || !outputDir) {
  console.error('Usage: node fetch.cjs --query "search term" --output "./dir/" [--filename "name.jpg"]');
  process.exit(1);
}

const apiKey = process.env.PEXELS_API_KEY;
if (!apiKey) {
  console.error('ERROR: PEXELS_API_KEY environment variable is not set.');
  process.exit(1);
}

function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        httpsGet(res.headers.location, headers).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: Buffer.concat(chunks) }));
    });
    req.on('error', reject);
  });
}

async function main() {
  const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

  const searchRes = await httpsGet(searchUrl, { 'Authorization': apiKey });

  if (searchRes.statusCode !== 200) {
    console.error(`ERROR: Pexels API returned status ${searchRes.statusCode}`);
    console.error(searchRes.body.toString());
    process.exit(1);
  }

  const remaining = searchRes.headers['x-ratelimit-remaining'];
  if (remaining) process.stderr.write(`[pexels-fetcher] Rate limit remaining: ${remaining}\n`);

  const data = JSON.parse(searchRes.body.toString());

  if (!data.photos || data.photos.length === 0) {
    console.error(`ERROR: No results found for query "${query}"`);
    process.exit(1);
  }

  const photo = data.photos[0];
  const imageUrl = photo.src.large2x;
  const photographer = photo.photographer;

  process.stderr.write(`[pexels-fetcher] Found: "${photo.alt || query}" by ${photographer}\n`);

  const resolvedDir = path.resolve(outputDir);
  fs.mkdirSync(resolvedDir, { recursive: true });

  const now = new Date();
  const ts = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
  const filename = customFilename || `pexels_${ts}.jpg`;
  const outputPath = path.join(resolvedDir, filename);

  const imgRes = await httpsGet(imageUrl);
  if (imgRes.statusCode !== 200) {
    console.error(`ERROR: Failed to download image. Status: ${imgRes.statusCode}`);
    process.exit(1);
  }

  fs.writeFileSync(outputPath, imgRes.body);

  const absolutePath = path.resolve(outputPath);
  console.log(absolutePath);
  process.stderr.write(`[pexels-fetcher] Saved: ${absolutePath} (${(imgRes.body.length / 1024).toFixed(0)} KB)\n`);
  process.stderr.write(`[pexels-fetcher] Credit: Photo by ${photographer} on Pexels\n`);
}

main().catch((err) => { console.error(`ERROR: ${err.message}`); process.exit(1); });
