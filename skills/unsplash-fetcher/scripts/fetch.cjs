#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// --- Parse CLI arguments ---
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const query = getArg('query');
const outputDir = getArg('output');
const customFilename = getArg('filename');

if (!query) {
  console.error('ERROR: --query is required. Usage: node fetch.js --query "search term" --output "./dir/"');
  process.exit(1);
}

if (!outputDir) {
  console.error('ERROR: --output is required. Usage: node fetch.js --query "search term" --output "./dir/"');
  process.exit(1);
}

const accessKey = process.env.UNSPLASH_ACCESS_KEY;
if (!accessKey) {
  console.error('ERROR: UNSPLASH_ACCESS_KEY environment variable is not set. Add it to your .env file.');
  process.exit(1);
}

// --- Helper: HTTPS GET returning a Promise ---
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        httpsGet(res.headers.location, headers).then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks),
        });
      });
    });
    req.on('error', reject);
  });
}

// --- Main ---
async function main() {
  // 1. Search Unsplash
  const searchUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`;

  const searchRes = await httpsGet(searchUrl, {
    'Authorization': `Client-ID ${accessKey}`,
    'Accept-Version': 'v1',
  });

  if (searchRes.statusCode !== 200) {
    console.error(`ERROR: Unsplash API returned status ${searchRes.statusCode}`);
    console.error(searchRes.body.toString());
    process.exit(1);
  }

  // Log rate limit info
  const remaining = searchRes.headers['x-ratelimit-remaining'];
  if (remaining) {
    process.stderr.write(`[unsplash-fetcher] Rate limit remaining: ${remaining}/50\n`);
  }

  const data = JSON.parse(searchRes.body.toString());

  if (!data.results || data.results.length === 0) {
    console.error(`ERROR: No results found for query "${query}"`);
    process.exit(1);
  }

  const photo = data.results[0];
  const imageUrl = photo.urls.regular; // 1080px wide, good quality
  const photographer = photo.user.name;
  const unsplashLink = photo.links.html;

  process.stderr.write(`[unsplash-fetcher] Found: "${photo.alt_description || photo.description || query}" by ${photographer}\n`);
  process.stderr.write(`[unsplash-fetcher] Unsplash link: ${unsplashLink}\n`);

  // 2. Ensure output directory exists
  const resolvedDir = path.resolve(outputDir);
  fs.mkdirSync(resolvedDir, { recursive: true });

  // 3. Generate filename
  const now = new Date();
  const timestamp = now.getFullYear().toString()
    + String(now.getMonth() + 1).padStart(2, '0')
    + String(now.getDate()).padStart(2, '0')
    + '_'
    + String(now.getHours()).padStart(2, '0')
    + String(now.getMinutes()).padStart(2, '0')
    + String(now.getSeconds()).padStart(2, '0');

  const filename = customFilename || `unsplash_${timestamp}.jpg`;
  const outputPath = path.join(resolvedDir, filename);

  // 4. Download image
  const imgRes = await httpsGet(imageUrl);

  if (imgRes.statusCode !== 200) {
    console.error(`ERROR: Failed to download image. Status: ${imgRes.statusCode}`);
    process.exit(1);
  }

  fs.writeFileSync(outputPath, imgRes.body);

  // 5. Trigger Unsplash download tracking (required by API guidelines)
  if (photo.links.download_location) {
    httpsGet(photo.links.download_location, {
      'Authorization': `Client-ID ${accessKey}`,
    }).catch(() => {}); // Fire and forget
  }

  // 6. Output the absolute path (for the agent to capture)
  const absolutePath = path.resolve(outputPath);
  console.log(absolutePath);

  process.stderr.write(`[unsplash-fetcher] Saved: ${absolutePath} (${(imgRes.body.length / 1024).toFixed(0)} KB)\n`);
  process.stderr.write(`[unsplash-fetcher] Credit: Photo by ${photographer} on Unsplash\n`);
}

main().catch((err) => {
  console.error(`ERROR: ${err.message}`);
  process.exit(1);
});
