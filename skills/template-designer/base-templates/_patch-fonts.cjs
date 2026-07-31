// Replaces Google Fonts @import with embedded @font-face base64 (Inter VF)
const fs = require('fs');
const path = require('path');
const dir = __dirname;
const interB64 = fs.readFileSync(path.join(dir, 'fonts', 'InterVariable.woff2')).toString('base64');
const fontFace = `@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:block;src:url(data:font/woff2;base64,${interB64}) format('woff2-variations');}`;
const importRe = /@import\s+url\(['"]https:\/\/fonts\.googleapis\.com\/css2\?[^'"]*['"]\);?/g;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
let n = 0;
for (const f of files) {
  const p = path.join(dir, f);
  const src = fs.readFileSync(p, 'utf8');
  if (!importRe.test(src)) { importRe.lastIndex = 0; continue; }
  importRe.lastIndex = 0;
  const out = src.replace(importRe, fontFace);
  fs.writeFileSync(p, out);
  console.log('patched:', f);
  n++;
}
console.log('total:', n);
