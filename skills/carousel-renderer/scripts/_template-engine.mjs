// Shared template engine for preview.mjs and render.mjs
// Generates the full 10-slide carousel HTML from a copy.json payload.
// ID visual {{BRAND}}: Futura LT CondExtraBold + Inter, neon #d6fd73,
// alternância dark/light/gradient, S1 usa cover-imobiturbo.html, S10 CTA dark+cta.png.
// Layout types: normal (img→h1→text), bg-overlay (full bg+overlay), sandwich (h1→img→text)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const COVER_TEMPLATE = path.join(REPO_ROOT, 'skills', 'template-designer', 'base-templates', 'cover-imobiturbo.html');
const FONT_PATH = path.join(REPO_ROOT, 'skills', 'template-designer', 'base-templates', 'fonts', 'Futura LT CondensedExtraBold Regular.ttf');
// Avatar canônico. `foto/natan.png` (path antigo/hardcoded no
// cover-imobiturbo.html) NÃO existe neste profile — só existe
// _opensquad/_assets/natan-profile.png. Corrigido 2026-07-27: buildCover()
// estava gerando capas com avatar quebrado (src apontando pra arquivo
// inexistente) desde sempre; buildTweet() usa o mesmo path correto.
const NATAN_PNG = path.join(REPO_ROOT, '_opensquad', '_assets', 'natan-profile.png');
const CTA_PNG = path.join(REPO_ROOT, 'foto', 'cta.png');
const TWEET_TEMPLATE = path.join(REPO_ROOT, 'squads', 'social-media-natan-tweet', 'template', 'tweet.html');

const THEMES = {
  dark: {
    bg: '#09090b', color: '#fff', accent: '#d6fd73',
    progressBg: 'rgba(255,255,255,0.1)', progressFill: '#d6fd73',
    dim: 'rgba(255,255,255,0.55)'
  },
  light: {
    bg: '#FFFFFF', color: '#0f0d0c', accent: '#5f6831',
    progressBg: 'rgba(0,0,0,0.1)', progressFill: '#5f6831',
    dim: 'rgba(15,13,12,0.55)'
  },
  gradient: {
    bg: 'radial-gradient(ellipse at 80% 120%, #3d5010 0%, #09090b 55%), #09090b',
    color: '#fff', accent: '#d6fd73',
    progressBg: 'rgba(255,255,255,0.1)', progressFill: '#d6fd73',
    dim: 'rgba(255,255,255,0.6)'
  },
  cream: {
    bg: '#f5f1e8', color: '#0f0d0c', accent: '#5f6831',
    progressBg: 'rgba(15,13,12,0.08)', progressFill: '#5f6831',
    dim: 'rgba(15,13,12,0.55)'
  },
  moss: {
    bg: '#304007', color: '#fff', accent: '#d4ff6d',
    progressBg: 'rgba(255,255,255,0.12)', progressFill: '#d4ff6d',
    dim: 'rgba(255,255,255,0.65)'
  },
  neon: {
    bg: '#d4ff6d', color: '#0f0d0c', accent: '#5f6831',
    progressBg: 'rgba(15,13,12,0.15)', progressFill: '#5f6831',
    dim: 'rgba(15,13,12,0.65)'
  }
};

// Shared head: font + reset
const head = (fontUrl) => `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@font-face{font-family:'Futura LT';src:url('${fontUrl}') format('truetype');font-weight:800;font-style:normal;}
*{margin:0;padding:0;box-sizing:border-box;}
</style></head><body>`;

const foot = `</body></html>`;

const asUrl = (p) => 'file:///' + p.replace(/\\/g, '/');

// ─── Cover (Slide 1) ─────────────────────────────────────────
// Loads cover-imobiturbo.html and injects headline/avatar/background.
// When `placeholder` is true, bg is a dashed box instead of real image.
// REGRA [#capa-h1-unica] (2026-05-14): apenas H1 (capa-headline).
// Param `subHtml` ACEITO mas IGNORADO (com warning visível pra detectar
// Bento legado que ainda gera sub_html — vira lixo silencioso se sem warning).
export function buildCover({ line1Html, subHtml, imagePath, placeholder }) {
  if (subHtml && String(subHtml).trim()) {
    console.warn('[buildCover] sub_html descontinuado (2026-05-14, regra #capa-h1-unica), ignorando. Bento deve entregar tudo em line1_html. Conteúdo descartado:', String(subHtml).slice(0, 100));
  }
  let html = fs.readFileSync(COVER_TEMPLATE, 'utf8');

  // ─── Inject fonts into the cover's <style> ───────────────
  // cover-imobiturbo.html embeds Inter via base64 but does NOT define
  // @font-face for 'Futura LT CondExtraBold' — only uses font-family.
  // Also, when rendered inside an iframe srcdoc in the preview, Inter
  // needs a Google Fonts fallback. Inject both into the first <style>.
  const fontInjection = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@font-face{font-family:'Futura LT CondExtraBold';src:url('${asUrl(FONT_PATH)}') format('truetype');font-weight:900;font-style:normal;font-display:block;}
@font-face{font-family:'Futura LT';src:url('${asUrl(FONT_PATH)}') format('truetype');font-weight:800;font-style:normal;font-display:block;}
`;
  html = html.replace('<style>', `<style>${fontInjection}`);

  // Fix avatar path to absolute file URL
  html = html.replace(
    /src="[^"]*foto\/natan\.png"/,
    `src="${asUrl(NATAN_PNG)}"`
  );

  // Replace headline block (between <div class="capa-headline"> and </div>)
  html = html.replace(
    /<div class="capa-headline">[\s\S]*?<\/div>/,
    `<div class="capa-headline">${line1Html}</div>`
  );
  // [DESCONTINUADO 2026-05-14] subHtml não é mais injetado — capa H1 única.
  // O bloco <div class="capa-subheadline"> foi removido do template HTML.

  // Background: inject style for .capa-bg
  if (placeholder) {
    html = html.replace(
      '</style>',
      `.capa-bg{background:#141414!important;background-image:none!important;display:flex;align-items:center;justify-content:center;}
.capa-bg::before{content:"[ IA 4:5 · placeholder — imagem final será injetada aqui ]";position:absolute;inset:40px;border:3px dashed rgba(214,253,115,0.5);border-radius:18px;display:flex;align-items:center;justify-content:center;text-align:center;color:rgba(214,253,115,0.85);font-size:24px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;font-family:'Inter',sans-serif;padding:40px;}
</style>`
    );
  } else if (imagePath) {
    html = html.replace(
      /\.capa-bg\s*\{[^}]*\}/,
      `.capa-bg{position:absolute;inset:0;background-image:url('${asUrl(imagePath)}');background-size:cover;background-position:center;background-repeat:no-repeat;z-index:1;}`
    );
  }

  return html;
}

// ─── Tweet-quote slide (layout "tweet") ───────────────────────
// Screenshot-de-tweet estilo Tom Ferry (fundo preto puro, avatar + nome +
// handle + frase). Ignora theme/kicker/title_html/body_html/list_items —
// usa só `ledeHtml` como texto da frase (mesma convenção dos outros
// layouts: campo *_html aceita <em>/<strong>, o template neutraliza visual
// de <strong> pra manter a frase sem destaque, igual um tweet real).
// SEM bar "Powered by {{BRAND}}" nem progress bar — quebraria a ilusão de
// screenshot real, que é o objetivo do layout.
export function buildTweet({ quoteHtml }) {
  let html = fs.readFileSync(TWEET_TEMPLATE, 'utf8');
  html = html
    .replaceAll('{{PROFILE_BASE64}}', asUrl(NATAN_PNG))
    .replaceAll('{{DISPLAY_NAME}}', '{{NAME}}')
    .replaceAll('{{HANDLE}}', '{{HANDLE}}')
    .replaceAll('{{QUOTE_TEXT}}', quoteHtml || '');
  return html;
}

// ─── Miolo slide (2–9) ───────────────────────────────────────
// Layout types:
//   "normal"        → kicker → img-box 16:9 → headline → text (default for light slides)
//   "bg-overlay"    → full bg image 3:4 + dark overlay 78% → kicker → headline → text (dark slides)
//   "sandwich"      → kicker → headline → img-box 16:9 → text (alternation variant)
//   "ref1-sandwich" → top text (lede) → img-box 16:9 → bottom text (body) — editorial REF1
//   "all-type"      → kicker → headline → lede → optional list (no image, full text)
//   "tweet"         → screenshot-de-tweet Tom Ferry style (fundo preto, avatar+handle+frase)
// Themes: dark | light | gradient | cream | moss | neon (ignorado por "tweet")
export function buildMiolo({ n, theme, layout, kicker, titleHtml, ledeHtml, bodyHtml, listItems, listMarker, closingHtml, imagePath, placeholder, imgAltText }) {
  const t = THEMES[theme] || THEMES.dark;
  const totalSlides = 10;
  const progressPct = (n / totalSlides) * 100;
  const effectiveLayout = layout || 'normal';

  // ── TWEET layout (screenshot-de-tweet, sem chrome de carrossel) ────
  if (effectiveLayout === 'tweet') {
    return buildTweet({ quoteHtml: ledeHtml });
  }

  // ── REF1-SANDWICH layout (editorial: top text → image → bottom text) ──
  if (effectiveLayout === 'ref1-sandwich') {
    const imgBlock = placeholder
      ? `<div class="img-ph">[ IA 16:9 · ${imgAltText || 'placeholder'} ]</div>`
      : `<img class="img" src="${asUrl(imagePath)}" alt="${imgAltText || ''}">`;

    return `${head(asUrl(FONT_PATH))}
<div class="slide">
<style>
.slide{width:1080px;height:1350px;background:${t.bg};color:${t.color};font-family:'Inter',sans-serif;position:relative;padding:40px 56px;display:flex;flex-direction:column;}
.bar{display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${t.dim};flex-shrink:0;}
.slide > .body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:14px;padding:20px 0;overflow:hidden;min-height:0;}
.top-text,.top-text .lede{font-size:36px;font-weight:500;line-height:1.24;color:${t.color};flex:0 0 auto;}
.top-text strong,.top-text .lede strong{font-weight:800;color:${t.accent};}
.top-text em,.top-text .lede em{font-style:normal;color:${t.accent};font-weight:700;}
.top-text .lede + .lede{margin-top:14px;}
.img{width:100%;height:auto;max-height:430px;aspect-ratio:16/9;object-fit:cover;flex:0 1 auto;border-radius:0;}
.img-ph{width:100%;max-height:430px;aspect-ratio:16/9;border:3px dashed ${t.accent};display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;color:${t.accent};font-size:24px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;flex:0 1 auto;}
.bottom-text,.bottom-text .lede,.bottom-text .body{font-size:36px;font-weight:500;line-height:1.24;color:${t.color};flex:0 0 auto;}
.bottom-text strong,.bottom-text .lede strong,.bottom-text .body strong{font-weight:800;color:${t.accent};}
.bottom-text em,.bottom-text .lede em,.bottom-text .body em{font-style:normal;color:${t.accent};font-weight:700;}
.bottom-text .lede + .lede{margin-top:14px;}
.prog{display:flex;align-items:center;gap:16px;flex-shrink:0;}
.prog-bar{flex:1;height:3px;background:${t.progressBg};border-radius:2px;overflow:hidden;}
.prog-bar > div{height:100%;background:${t.progressFill};width:${progressPct}%;}
.prog-num{font-size:14px;font-weight:600;color:${t.dim};}
</style>
<div class="bar"><span>Powered by {{BRAND}}</span><span>{{HANDLE}}</span><span>2026 //</span></div>
<div class="body">
  <div class="top-text">${ledeHtml}</div>
  ${imgBlock}
  <div class="bottom-text">${bodyHtml || ''}</div>
</div>
<div class="prog"><div class="prog-bar"><div></div></div><span class="prog-num">${n}/${totalSlides}</span></div>
</div>${foot}`;
  }

  // ── ALL-TYPE layout (no image, full text + optional list) ──────
  if (effectiveLayout === 'all-type') {
    const marker = listMarker || 'arrow';
    const markerSym = { arrow: '→', x: '✗', dash: '—' }[marker] || '→';
    const isNumbered = marker === 'numbered';
    const rawLede = ledeHtml || '';
    const allTypeLede = /^\s*<(?:p|div)\b/i.test(rawLede)
      ? rawLede
      : `<p class="lede">${rawLede}</p>`;

    const listBlock = (listItems && listItems.length)
      ? `<div class="list">${listItems.map((item, i) =>
          `<div class="list-item"><span class="bullet">${isNumbered ? (i+1)+'.' : markerSym}</span><span>${item}</span></div>`
        ).join('')}</div>`
      : '';
    const closingBlock = closingHtml
      ? `<div class="closing">${closingHtml}</div>`
      : '';

    return `${head(asUrl(FONT_PATH))}
<div class="slide">
<style>
.slide{width:1080px;height:1350px;background:${t.bg};color:${t.color};font-family:'Inter',sans-serif;position:relative;padding:56px 64px;display:flex;flex-direction:column;}
.bar{display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${t.dim};flex-shrink:0;}
.body{flex:1;display:flex;flex-direction:column;justify-content:center;padding:36px 0;overflow:hidden;min-height:0;}
.all-type-group{display:flex;flex-direction:column;width:100%;max-height:100%;}
.kicker{font-size:18px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${t.accent};margin-bottom:20px;flex-shrink:0;}
.hl{font-family:'Futura LT','Inter',sans-serif;font-size:72px;font-weight:800;line-height:1.02;letter-spacing:-2px;text-transform:uppercase;color:${t.color};margin-bottom:28px;flex-shrink:0;}
.hl em{font-style:normal;color:${t.accent};}
.rule{height:1px;background:${t.dim};opacity:0.25;margin:0 0 28px 0;flex-shrink:0;}
.lede{font-size:48px;font-weight:500;line-height:1.18;color:${t.color};flex-shrink:0;}
.lede + .lede{margin-top:20px;}
.lede strong{font-weight:800;color:${t.accent};}
.lede em{font-style:normal;color:${t.accent};font-weight:700;}
.list{display:flex;flex-direction:column;gap:16px;margin-top:28px;flex-shrink:0;}
.list-item{display:flex;gap:20px;align-items:baseline;font-size:40px;font-weight:500;line-height:1.18;color:${t.color};}
.list-item .bullet{font-weight:800;color:${t.accent};min-width:42px;}
.closing{font-size:34px;font-weight:500;line-height:1.28;color:${t.dim};margin-top:28px;flex-shrink:0;}
.closing strong,.closing em{font-style:normal;color:${t.color};font-weight:700;}
.prog{display:flex;align-items:center;gap:16px;flex-shrink:0;}
.prog-bar{flex:1;height:3px;background:${t.progressBg};border-radius:2px;overflow:hidden;}
.prog-bar > div{height:100%;background:${t.progressFill};width:${progressPct}%;}
.prog-num{font-size:14px;font-weight:600;color:${t.dim};}
</style>
<div class="bar"><span>Powered by {{BRAND}}</span><span>{{HANDLE}}</span><span>2026 //</span></div>
<div class="body">
  <div class="all-type-group">
    ${kicker ? `<div class="kicker">${kicker}</div>` : ''}
    <h1 class="hl">${titleHtml}</h1>
    <div class="rule"></div>
    ${allTypeLede}
    ${listBlock}
    ${closingBlock}
  </div>
</div>
<div class="prog"><div class="prog-bar"><div></div></div><span class="prog-num">${n}/${totalSlides}</span></div>
</div>${foot}`;
  }

  // ── BG-OVERLAY layout ──────────────────────────────────
  if (effectiveLayout === 'bg-overlay') {
    const bgStyle = placeholder
      ? `background:#141414;`
      : `background-image:url('${asUrl(imagePath)}');background-size:cover;background-position:center;`;
    const phOverlay = placeholder
      ? `<div class="bg-ph-label">[ IA 3:4 · ${imgAltText || 'placeholder'} ]</div>`
      : '';
    // DARK-OVERLAY CONTRACT: a dark visual background uses a compact
    // title-to-body relationship, white body copy, and neon highlights.
    // The copy contract can carry an already-wrapped `<p class="lede">`.
    // bg-overlay owns the lede wrapper, so strip one outer p to prevent a
    // ghost flex item (and an artificial title → body gap) in the browser.
    const rawOverlayLede = String(ledeHtml || '');
    const overlayLede = rawOverlayLede.replace(
      /^\s*<p\b[^>]*>([\s\S]*)<\/p>\s*$/i,
      '$1'
    );

    return `${head(asUrl(FONT_PATH))}
<div class="slide">
<style>
.slide{width:1080px;height:1350px;color:#fff;font-family:'Inter',sans-serif;position:relative;overflow:hidden;display:flex;flex-direction:column;}
.bg{position:absolute;inset:0;${bgStyle}z-index:0;}
.overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.10) 0%,rgba(0,0,0,0.05) 20%,rgba(0,0,0,0.15) 40%,rgba(0,0,0,0.65) 55%,rgba(0,0,0,0.88) 70%,rgba(0,0,0,0.96) 85%,rgba(0,0,0,0.99) 100%);z-index:1;}
.bar{position:relative;z-index:2;display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.45);padding:56px 64px 0;flex-shrink:0;}
.spacer{flex:1;position:relative;z-index:2;}
.body{position:relative;z-index:2;display:flex;flex-direction:column;gap:18px;padding:0 64px 20px;flex-shrink:0;}
.kicker{font-size:18px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#d6fd73;}
.hl{font-family:'Futura LT','Inter',sans-serif;font-size:82px;font-weight:800;line-height:0.94;letter-spacing:-2px;text-transform:uppercase;color:#fff;}
.hl em{font-style:normal;color:#d6fd73;}
.lede{font-size:30px;font-weight:500;line-height:1.42;color:#fff;}
.lede strong,.lede em{font-style:normal;color:#d6fd73!important;font-weight:700;}
.prog{position:relative;z-index:2;display:flex;align-items:center;gap:16px;padding:0 64px 30px;flex-shrink:0;}
.prog-bar{flex:1;height:3px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;}
.prog-bar > div{height:100%;background:#d6fd73;width:${progressPct}%;}
.prog-num{font-size:14px;font-weight:600;color:rgba(255,255,255,0.45);}
.bg-ph-label{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;border:3px dashed rgba(214,253,115,0.5);border-radius:18px;padding:60px 40px;color:rgba(214,253,115,0.85);font-size:22px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;text-align:center;max-width:60%;pointer-events:none;}
</style>
<div class="bg"></div>
<div class="overlay"></div>
${phOverlay}
<div class="bar"><span>Powered by {{BRAND}}</span><span>{{HANDLE}}</span><span>2026 //</span></div>
<div class="spacer"></div>
<div class="body">
  <div class="kicker">${kicker}</div>
  <h1 class="hl">${titleHtml}</h1>
  <p class="lede">${overlayLede}</p>
</div>
<div class="prog"><div class="prog-bar"><div></div></div><span class="prog-num">${n}/${totalSlides}</span></div>
</div>${foot}`;
  }

  // ── NORMAL + SANDWICH shared styles ────────────────────
  const imgBlock = placeholder
    ? `<div class="img-ph">[ IA 16:9 · ${imgAltText || 'placeholder'} ]</div>`
    : `<img class="img" src="${asUrl(imagePath)}" alt="${imgAltText || ''}">`;

  // Order: normal = kicker → img → h1 → text; sandwich = kicker → h1 → img → text
  const bodyContent = effectiveLayout === 'sandwich'
    ? `<div class="kicker">${kicker}</div>
  <h1 class="hl">${titleHtml}</h1>
  ${imgBlock}
  <p class="lede">${ledeHtml}</p>`
    : `<div class="kicker">${kicker}</div>
  ${imgBlock}
  <h1 class="hl">${titleHtml}</h1>
  <p class="lede">${ledeHtml}</p>`;

  return `${head(asUrl(FONT_PATH))}
<div class="slide">
<style>
.slide{width:1080px;height:1350px;background:${t.bg};color:${t.color};font-family:'Inter',sans-serif;position:relative;padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between;}
.bar{display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:${t.dim};}
.body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:32px;padding:20px 0;overflow:hidden;}
.kicker{font-size:18px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${t.accent};flex-shrink:0;}
.hl{font-family:'Futura LT','Inter',sans-serif;font-size:82px;font-weight:800;line-height:0.94;letter-spacing:-2px;text-transform:uppercase;color:${t.color};flex-shrink:0;}
.hl em{font-style:normal;color:${t.accent};}
.lede{font-size:30px;font-weight:500;line-height:1.42;color:${t.dim};flex-shrink:0;}
.lede strong,.lede em{font-style:normal;color:${t.color};font-weight:700;}
.img{width:100%;aspect-ratio:16/9;border-radius:14px;object-fit:cover;flex-shrink:1;min-height:0;}
.img-ph{width:100%;aspect-ratio:16/9;border:3px dashed ${t.accent};opacity:.85;border-radius:14px;display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;color:${t.accent};font-size:24px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;background:${theme==='light'?'rgba(27,42,74,0.05)':'rgba(214,253,115,0.05)'};flex-shrink:1;min-height:0;}
.prog{display:flex;align-items:center;gap:16px;}
.prog-bar{flex:1;height:3px;background:${t.progressBg};border-radius:2px;overflow:hidden;}
.prog-bar > div{height:100%;background:${t.progressFill};width:${progressPct}%;}
.prog-num{font-size:14px;font-weight:600;color:${t.dim};}
</style>
<div class="bar"><span>Powered by {{BRAND}}</span><span>{{HANDLE}}</span><span>2026 //</span></div>
<div class="body">
  ${bodyContent}
</div>
<div class="prog"><div class="prog-bar"><div></div></div><span class="prog-num">${n}/${totalSlides}</span></div>
</div>${foot}`;
}

// ─── CTA (Slide 10) ─────────────────────────────────────────
// Standard: imagem grande + CTA direto.
// Text-only: fechamento simples, sem card do Google Meet.
export function buildCta({ titleHtml, ledeHtml, mode = 'standard' }) {
  if (mode === 'text-only') {
    const titleBlock = titleHtml
      ? `<h1 class="hl">${titleHtml}</h1>`
      : '';

    return `${head(asUrl(FONT_PATH))}
<div class="slide">
<style>
.slide{width:1080px;height:1350px;background:#09090b;color:#fff;font-family:'Inter',sans-serif;position:relative;padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between;}
.bar{display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.55);}
.body{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:28px;max-width:860px;margin:0 auto;}
.hl{font-family:'Futura LT','Inter',sans-serif;font-size:92px;font-weight:800;line-height:0.94;letter-spacing:-2px;text-transform:uppercase;color:#fff;}
.hl em{font-style:normal;color:#d6fd73;}
.lede{font-size:52px;font-weight:600;line-height:1.18;color:rgba(255,255,255,0.92);}
.lede strong,.lede em{font-style:normal;color:#d6fd73;font-weight:800;}
.prog{display:flex;align-items:center;gap:16px;}
.prog-bar{flex:1;height:3px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;}
.prog-bar > div{width:100%;height:100%;background:#d6fd73;}
</style>
<div class="bar"><span>Powered by {{BRAND}}</span><span>{{HANDLE}}</span><span>2026 //</span></div>
<div class="body">
${titleBlock}
<p class="lede">${ledeHtml}</p>
</div>
<div class="prog"><div class="prog-bar"><div></div></div><span style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.5)">10/10</span></div>
</div>${foot}`;
  }

  return `${head(asUrl(FONT_PATH))}
<div class="slide">
<style>
.slide{width:1080px;height:1350px;background:#09090b;color:#fff;font-family:'Inter',sans-serif;position:relative;padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between;}
.bar{display:flex;justify-content:space-between;align-items:center;font-size:16px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.55);}
.body{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:48px;}
.cta-img{width:420px;height:420px;object-fit:cover;border-radius:32px;box-shadow:0 24px 80px rgba(0,0,0,0.6);}
.lede{font-size:34px;font-weight:500;line-height:1.45;color:rgba(255,255,255,0.72);max-width:880px;}
.lede strong{color:#d6fd73;font-weight:800;}
.prog{display:flex;align-items:center;gap:16px;}
.prog-bar{flex:1;height:3px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;}
.prog-bar > div{width:100%;height:100%;background:#d6fd73;}
</style>
<div class="bar"><span>Powered by {{BRAND}}</span><span>{{HANDLE}}</span><span>2026 //</span></div>
<div class="body">
<img src="${asUrl(CTA_PNG)}" class="cta-img">
<p class="lede">${ledeHtml}</p>
</div>
<div class="prog"><div class="prog-bar"><div></div></div><span style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.5)">10/10</span></div>
</div>${foot}`;
}

// ─── Preview builder: grid de todos os 10 slides num único HTML ─
export function buildPreviewGrid(copy) {
  const slides = [];
  slides.push(
    copy.cover.layout === 'tweet'
      ? buildTweet({ quoteHtml: copy.cover.line1_html })
      : buildCover({ line1Html: copy.cover.line1_html, subHtml: copy.cover.sub_html, placeholder: true })
  );
  for (const s of copy.slides) {
    slides.push(buildMiolo({
      n: s.n, theme: s.theme, layout: s.layout || 'normal', kicker: s.kicker,
      titleHtml: s.title_html, ledeHtml: s.lede_html,
      bodyHtml: s.body_html, listItems: s.list_items, listMarker: s.list_marker,
      closingHtml: s.closing_html,
      placeholder: true, imgAltText: s.img_prompt || s.kicker
    }));
  }
  slides.push(
    copy.cta.layout === 'tweet'
      ? buildTweet({ quoteHtml: copy.cta.lede_html || copy.cta.title_html })
      : buildCta({ titleHtml: copy.cta.title_html, ledeHtml: copy.cta.lede_html, mode: copy.cta.mode || 'standard' })
  );

  const cards = slides.map((html, i) => `
<div class="cell">
  <div class="label"><span>SLIDE ${i+1}</span></div>
  <div class="frame"><iframe srcdoc='${html.replace(/'/g, "&#39;")}'></iframe></div>
</div>`).join('');

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Preview — ${copy.title || 'Carrossel {{BRAND}}'}</title>
<style>
body{margin:0;background:#0b0b0b;font-family:-apple-system,'Segoe UI',sans-serif;color:#eee;padding:40px 20px;}
h1{text-align:center;font-weight:900;letter-spacing:-.02em;font-size:26px;margin:0;}
.sub{text-align:center;color:#888;margin:8px 0 32px;font-size:13px;}
.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:20px;max-width:2400px;margin:0 auto;}
.cell{display:flex;flex-direction:column;gap:10px;align-items:center;}
.label{font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:#888;}
.frame{width:324px;height:405px;border-radius:12px;overflow:hidden;box-shadow:0 12px 40px rgba(0,0,0,.5);background:#000;}
.frame iframe{width:1080px;height:1350px;border:0;transform:scale(0.3);transform-origin:0 0;}
</style></head><body>
<h1>Preview — ${copy.title || 'Carrossel {{BRAND}}'}</h1>
<p class="sub">10 slides · 1080×1350 · placeholders IA · aguardando "aprovado visualmente"</p>
<div class="grid">${cards}</div>
</body></html>`;
}

// ─── Render builder: retorna dict { 'slide-01.html': str, ... } ─
export function buildRenderHtmls(copy, assetsDir) {
  const htmls = {};
  // Cover: layout "tweet" pula o template {{BRAND}} (headline+imagem IA) e
  // usa o quote-card, igual o miolo. Usado pro formato "10/10 tweet puro".
  if (copy.cover.layout === 'tweet') {
    htmls['slide-01.html'] = buildTweet({ quoteHtml: copy.cover.line1_html });
  } else {
    // Cover: try .png first (nano-banana output), fallback to .jpg
    let coverPath = path.join(assetsDir, 'slide-01-cover.png');
    if (!fs.existsSync(coverPath)) coverPath = path.join(assetsDir, 'slide-01-cover.jpg');
    htmls['slide-01.html'] = buildCover({
      line1Html: copy.cover.line1_html,
      subHtml: copy.cover.sub_html,
      imagePath: coverPath,
      placeholder: false
    });
  }
  for (const s of copy.slides) {
    const nn = String(s.n).padStart(2, '0');
    // Miolo: try multiple naming conventions for the asset
    const layoutNeedsImage = ['normal', 'sandwich', 'ref1-sandwich', 'bg-overlay'].includes(s.layout || 'normal');
    let imgPath = path.join(assetsDir, `slide-${nn}-miolo.png`);
    let imgExists = fs.existsSync(imgPath);
    if (!imgExists) { imgPath = path.join(assetsDir, `slide-${nn}.png`); imgExists = fs.existsSync(imgPath); }
    if (!imgExists) { imgPath = path.join(assetsDir, `slide-${nn}.jpg`); imgExists = fs.existsSync(imgPath); }
    if (!imgExists) { imgPath = path.join(assetsDir, `slide-${nn}-miolo.jpg`); imgExists = fs.existsSync(imgPath); }
    if (layoutNeedsImage && !imgExists) {
      console.warn(`[render] ⚠️  slide-${nn} layout=${s.layout} requires image but no asset found in ${assetsDir}; rendering placeholder.`);
    }
    htmls[`slide-${nn}.html`] = buildMiolo({
      n: s.n, theme: s.theme, layout: s.layout || 'normal', kicker: s.kicker,
      titleHtml: s.title_html, ledeHtml: s.lede_html,
      bodyHtml: s.body_html, listItems: s.list_items, listMarker: s.list_marker,
      closingHtml: s.closing_html,
      imagePath: imgPath, placeholder: !imgExists, imgAltText: s.kicker
    });
  }
  // CTA: layout "tweet" pula o card do Google Meet e fecha com mais um
  // quote-card (formato "10/10 tweet puro" não tem CTA visual).
  if (copy.cta.layout === 'tweet') {
    htmls['slide-10.html'] = buildTweet({ quoteHtml: copy.cta.lede_html || copy.cta.title_html });
  } else {
    htmls['slide-10.html'] = buildCta({
      titleHtml: copy.cta.title_html,
      ledeHtml: copy.cta.lede_html,
      mode: copy.cta.mode || 'standard'
    });
  }
  return htmls;
}
