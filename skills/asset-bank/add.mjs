#!/usr/bin/env node
// Adiciona 1 asset ao bank após geração via API.
// Uso: node skills/asset-bank/add.mjs --file path/to.png --style editorial-photo --themes "broker,smartphone" --aspect 4:5 --prompt "..."
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1];
}

const SRC = args.file;
const STYLE = args.style;
const THEMES = (args.themes || '').split(',').map(s => s.trim()).filter(Boolean);
const ASPECT = args.aspect || '16:9';
const KIND = args.kind || 'miolo';
const PROMPT = args.prompt || '';
const SOURCE_RUN = args['source-run'] || 'manual';
const SOURCE_POST = args['source-post'] || 'manual';
const SOURCE_SLIDE = parseInt(args['source-slide'] || '0');
const GENERIC = (args.generic || 'true').toLowerCase() === 'true';

if (!SRC || !STYLE) {
  console.error('usage: node skills/asset-bank/add.mjs --file PATH --style STYLE [--themes T1,T2] [--aspect 4:5|16:9|1:1] [--prompt "..."]');
  process.exit(1);
}
if (!fs.existsSync(SRC)) {
  console.error(`file not found: ${SRC}`);
  process.exit(1);
}

const BANK_DIR = path.resolve('_opensquad/_memory/asset-bank');
const FILES_DIR = path.join(BANK_DIR, 'files');
const STYLES_DIR = path.join(BANK_DIR, 'styles');
const INDEX = path.join(BANK_DIR, '_index.json');

fs.mkdirSync(FILES_DIR, { recursive: true });
fs.mkdirSync(path.join(STYLES_DIR, STYLE), { recursive: true });

const buf = fs.readFileSync(SRC);
const hash = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16);
const ext = path.extname(SRC).toLowerCase() || '.png';
const dest = path.join(FILES_DIR, hash + ext);

if (fs.existsSync(dest)) {
  console.log(`[bank] already exists (hash ${hash}), skipping copy.`);
} else {
  fs.copyFileSync(SRC, dest);
}

const styleLink = path.join(STYLES_DIR, STYLE, `${SOURCE_RUN}_${SOURCE_POST}_slide-${String(SOURCE_SLIDE).padStart(2, '0')}${ext}`);
if (!fs.existsSync(styleLink)) fs.copyFileSync(dest, styleLink);

const bank = fs.existsSync(INDEX)
  ? JSON.parse(fs.readFileSync(INDEX, 'utf8'))
  : { version: '1.0', entries: [] };

if (bank.entries.some(e => e.hash === hash)) {
  console.log(`[bank] entry already indexed (hash ${hash}).`);
  process.exit(0);
}

bank.entries.push({
  hash, ext, kind: KIND, style: STYLE, themes: THEMES, aspect: ASPECT,
  source_prompt: PROMPT, source_run: SOURCE_RUN, source_post: SOURCE_POST, source_slide: SOURCE_SLIDE,
  original_path: SRC.replace(/\\/g, '/'),
  generic: GENERIC
});
bank.count = bank.entries.length;

fs.writeFileSync(INDEX, JSON.stringify(bank, null, 2));
console.log(`[bank] added ${hash} (style=${STYLE}, themes=[${THEMES.join(',')}], total=${bank.count})`);
