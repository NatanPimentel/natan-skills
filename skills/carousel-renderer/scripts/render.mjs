#!/usr/bin/env node
// render.mjs — Renderiza os slides 1080×1350 direto em JPG via Playwright.
// Uso: node squads/social-media-natan/scripts/render.mjs <path/to/copy.json>
//
// Regras:
//  - ENTRADA: copy.json + pasta assets/ com slide-01-cover.jpg, slide-02.jpg…slide-08.jpg
//  - SAÍDA: slide-01.jpg … slide-10.jpg (e slide-XX.html temporário para o screenshot)
//  - Formato JPEG obrigatório (publisher exige .jpg, sem conversão)
//  - Só deve rodar APÓS "aprovado visualmente" (Etapa 9.5) + imagens IA geradas

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { chromium } from 'playwright';
import { buildRenderHtmls } from './_template-engine.mjs';
import { copyFullSlideCta, validateFullSlideCta } from '../../../local/cta-bank/comente-sistema/full-slide.mjs';

const copyPath = process.argv[2];
const onlyArg = process.argv.find(arg => arg.startsWith('--only='));
const onlySlides = onlyArg
  ? new Set(onlyArg.slice('--only='.length).split(',').map(name => name.trim() + '.html'))
  : null;
if (!copyPath) {
  console.error('Usage: node render.mjs <path/to/copy.json>');
  process.exit(1);
}

const absCopyPath = path.resolve(copyPath);
const copy = JSON.parse(fs.readFileSync(absCopyPath, 'utf8'));
const runDir = path.dirname(absCopyPath);
const assetsDir = path.join(runDir, 'assets');

if (!fs.existsSync(assetsDir)) {
  console.error(`[render] ❌ assets dir não existe: ${assetsDir}`);
  console.error(`         gere as imagens IA primeiro antes de chamar render.mjs`);
  process.exit(1);
}

// REGRA CTA-BANK (2026-07-30): o slide 10 é obrigatoriamente uma arte inteira
// do banco local. Não há fallback visual para o CTA HTML legado.
const shouldCopyBankCta = !onlySlides || onlySlides.has('slide-10.html');
if (shouldCopyBankCta) validateFullSlideCta(assetsDir);

// Build HTML files
const htmls = buildRenderHtmls(copy, assetsDir);
for (const [name, html] of Object.entries(htmls)) {
  fs.writeFileSync(path.join(runDir, name), html);
}
console.log(`[render] ✔ wrote ${Object.keys(htmls).length} slide HTMLs`);

// Render to JPG
const browser = await chromium.launch();
// O arquivo final deve ter exatamente 1080×1350 pixels. Um deviceScaleFactor maior
// dobra a imagem física mesmo com viewport 1080×1350.
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

// Auto-fit cover (slide-01): shrink .capa-headline font-size if it overflows.
// REGRA [#capa-h1-unica] (2026-05-14): capa H1 único, sem .smaller hardcoded.
// Iteração 3 (2026-07-29): base 132px, MAX_H 660, min 78px.
// A capa precisa carregar uma mancha tipográfica de ~40% da área útil; a
// versão anterior forçava 78px e reduzia a H1 para ~20% do frame.
// Aplicado APENAS no slide-01.
async function autoFitCover(page) {
  return await page.evaluate(() => {
    const h1 = document.querySelector('.capa-headline');
    if (!h1) return { fitted: false, reason: 'no-h1' };
    const MAX_H = 660;
    let size = 132;
    h1.style.fontSize = size + 'px';
    while (h1.scrollHeight > MAX_H && size > 78) {
      size -= 2;
      h1.style.fontSize = size + 'px';
    }
    return {
      fitted: size < 78,
      finalFontPx: size,
      scrollH: h1.scrollHeight,
      maxH: MAX_H,
      stillOverflows: h1.scrollHeight > MAX_H,
    };
  });
}

// Auto-fit: shrink text font-size if the slide body overflows. Guarda contra
// overflow do ref1-sandwich quando lede + 16:9 + body somam mais que o body.
async function autoFit(page) {
  return await page.evaluate(() => {
    const body = document.querySelector('.slide > .body');
    if (!body) return { fitted: false };
    const overflows = () => body.scrollHeight > body.clientHeight + 1;
    if (!overflows()) return { fitted: false };
    const textEls = body.querySelectorAll('.top-text, .top-text .lede, .bottom-text, .bottom-text .lede, .bottom-text .body, .lede, .hl');
    let size = 36;
    while (overflows() && size > 22) {
      size -= 2;
      textEls.forEach(el => { el.style.fontSize = size + 'px'; });
    }
    if (overflows()) {
      const img = body.querySelector('.img, .img-ph');
      if (img) img.style.maxHeight = '320px';
    }
    return { fitted: true, finalFontPx: size, stillOverflows: overflows() };
  });
}

// Auto-fit do layout "tweet": não tem .slide > .body (é o template
// standalone do squad social-media-natan-tweet), então o autoFit()
// genérico acima não acha nada. Mesma lógica do render-tweet.mjs original:
// encolhe #quote até .tweet caber em MAX_H, mínimo 28px.
async function autoFitTweet(page) {
  return await page.evaluate(() => {
    const el = document.getElementById('quote');
    if (!el) return { fitted: false };
    const MAX_H = 1100;
    const MIN_FONT = 28;
    let size = parseFloat(getComputedStyle(el).fontSize);
    const tweetH = () => document.querySelector('.tweet').getBoundingClientRect().height;
    if (tweetH() <= MAX_H) return { fitted: false };
    while (size > MIN_FONT) {
      el.style.fontSize = size + 'px';
      if (tweetH() <= MAX_H) break;
      size -= 2;
    }
    return { fitted: true, finalFontPx: size, stillOverflows: tweetH() > MAX_H };
  });
}

const files = Object.keys(htmls)
  .sort()
  .filter(file => !onlySlides || onlySlides.has(file));
if (onlySlides && files.length !== onlySlides.size) {
  console.error(`[render] ❌ --only contém slide inexistente`);
  process.exit(1);
}
const overflowReports = [];
for (const f of files) {
  const url = pathToFileURL(path.join(runDir, f)).href;
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const isTweet = await page.$('#quote') !== null;
  // Slide-01 (capa): auto-shrink do H1 — regra [#capa-h1-unica]
  if (isTweet) {
    const fit = await autoFitTweet(page);
    if (fit.fitted) {
      overflowReports.push({ slide: f, ...fit, kind: 'tweet' });
      console.log(`[render] ⚠ ${f} quote overflow → font ${fit.finalFontPx}px${fit.stillOverflows ? ' (ainda overflow!)' : ''}`);
    }
  } else if (f === 'slide-01.html') {
    const coverFit = await autoFitCover(page);
    if (coverFit.fitted) {
      overflowReports.push({ slide: f, ...coverFit, kind: 'cover' });
      console.log(`[render] ⚠ ${f} capa-headline overflow → font ${coverFit.finalFontPx}px${coverFit.stillOverflows ? ' (ainda overflow!)' : ''}`);
    }
  } else {
    const fit = await autoFit(page);
    if (fit.fitted) {
      overflowReports.push({ slide: f, ...fit });
      console.log(`[render] ⚠ ${f} overflow → font ${fit.finalFontPx}px${fit.stillOverflows ? ' (ainda overflow!)' : ''}`);
    }
  }
  const out = path.join(runDir, f.replace('.html', '.jpg'));
  await page.screenshot({ path: out, type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  console.log(`[render] ✔ ${f} → ${path.basename(out)}`);
}
const stillBroken = overflowReports.filter(r => r.stillOverflows);
if (stillBroken.length) {
  console.error(`[render] ❌ ${stillBroken.length} slide(s) ainda com overflow após auto-fit:`, stillBroken.map(r => r.slide).join(', '));
}

await browser.close();
if (shouldCopyBankCta) {
  const cta = copyFullSlideCta({ assetsDir, runDir });
  console.log(`[render] ✔ slide-10.jpg ← CTA bank ${cta.selection.asset_id} (${cta.transform})`);
}
console.log(`\n✅ ${files.length} slides JPG prontos em ${runDir}`);
