#!/usr/bin/env node
// Consulta o asset bank por (style, themes, aspect) e retorna o melhor match.
// Uso: node skills/asset-bank/lookup.mjs --style editorial-photo --themes "broker,smartphone" --aspect 4:5
import fs from 'node:fs';
import path from 'node:path';

const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  args[process.argv[i].replace(/^--/, '')] = process.argv[i + 1];
}

const STYLE = args.style;
const THEMES = (args.themes || '').split(',').map(s => s.trim()).filter(Boolean);
const ASPECT = args.aspect;
const KIND = args.kind || 'miolo';
const MIN_SCORE = parseFloat(args['min-score'] || '0.6');

const BANK_INDEX = path.resolve('_opensquad/_memory/asset-bank/_index.json');
if (!fs.existsSync(BANK_INDEX)) {
  console.log(JSON.stringify({ found: false, error: 'bank not seeded yet' }));
  process.exit(0);
}

const bank = JSON.parse(fs.readFileSync(BANK_INDEX, 'utf8'));

function score(entry) {
  if (entry.kind !== KIND) return 0;
  let s = 0;
  if (entry.style === STYLE) s += 0.5;
  if (ASPECT && entry.aspect === ASPECT) s += 0.2;
  const overlap = THEMES.filter(t => entry.themes.includes(t)).length;
  s += Math.min(overlap * 0.15, 0.3);
  if (!entry.generic) s -= 0.1;
  return s;
}

const ranked = bank.entries
  .map(e => ({ entry: e, score: score(e) }))
  .sort((a, b) => b.score - a.score);

const best = ranked[0];

if (!best || best.score < MIN_SCORE) {
  console.log(JSON.stringify({
    found: false,
    best_score: best ? best.score : 0,
    threshold: MIN_SCORE,
    candidates: ranked.slice(0, 3).map(r => ({ score: r.score, style: r.entry.style, themes: r.entry.themes, slide: r.entry.source_slide }))
  }, null, 2));
  process.exit(0);
}

const filePath = path.resolve('_opensquad/_memory/asset-bank/files', best.entry.hash + best.entry.ext);
console.log(JSON.stringify({
  found: true,
  match_score: best.score,
  file: filePath,
  entry: best.entry
}, null, 2));
