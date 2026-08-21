import { chromium } from 'playwright';
import sharp from 'sharp';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { execFileSync } from 'child_process';

const URLS = ["https://residindo.com/", "https://residindo.com/imoveis", "https://residindo.com/sobre", "https://residindo.com/blog", "https://residindo.com/contato", "https://residindo.com/termos", "https://residindo.com/privacidade", "https://residindo.com/cookies", "https://residindo.com/imoveis/1", "https://residindo.com/imoveis/2", "https://residindo.com/imoveis/3", "https://residindo.com/imoveis/4", "https://residindo.com/imoveis/5", "https://residindo.com/imoveis/6", "https://residindo.com/imoveis/8", "https://residindo.com/imoveis/9", "https://residindo.com/imoveis/10", "https://residindo.com/imoveis/11", "https://residindo.com/imoveis/12", "https://residindo.com/imoveis/13", "https://residindo.com/imoveis/14", "https://residindo.com/imoveis/15", "https://residindo.com/imoveis/16", "https://residindo.com/imoveis/17", "https://residindo.com/imoveis/18", "https://residindo.com/imoveis/19", "https://residindo.com/imoveis/20", "https://residindo.com/imoveis/23", "https://residindo.com/imoveis/25", "https://residindo.com/blog/1", "https://residindo.com/blog/2", "https://residindo.com/blog/3", "https://residindo.com/blog/4", "https://residindo.com/blog/5", "https://residindo.com/blog/6", "https://residindo.com/blog/7", "https://residindo.com/blog/8", "https://residindo.com/blog/9"];
const OUT = 'residindo-capture';
const DIRS = {
  screenshots: path.join(OUT,'screenshots'),
  pdfs: path.join(OUT,'pdfs'),
  metadata: path.join(OUT,'metadata'),
  assets: path.join(OUT,'assets-webp'),
};
for (const d of Object.values(DIRS)) await fs.mkdir(d,{recursive:true});

function slugForUrl(u) {
  const x = new URL(u);
  if (x.pathname === '/' || x.pathname === '') return 'home';
  return x.pathname.replace(/^\/|\/$/g,'').replaceAll('/','--').replace(/[^a-zA-Z0-9_-]+/g,'-').toLowerCase();
}
function sha12(s){ return crypto.createHash('sha256').update(s).digest('hex').slice(0,12); }
function safeNameFromUrl(u) {
  try {
    const x = new URL(u);
    const base = path.basename(x.pathname) || 'asset';
    const stem = base.replace(/\.[^.]+$/,'').replace(/[^a-zA-Z0-9_-]+/g,'-').slice(0,60) || 'asset';
    return `${stem}-${sha12(u)}.webp`;
  } catch { return `asset-${sha12(u)}.webp`; }
}
async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise(resolve => {
      let total = 0;
      const distance = 700;
      const timer = setInterval(() => {
        const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        window.scrollBy(0, distance);
        total += distance;
        if (total >= h + 1000) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          setTimeout(resolve, 500);
        }
      }, 120);
    });
  });
}
async function tryDismiss(page) {
  const texts = ['Aceitar todos','Aceitar','Concordo','OK','Entendi','Fechar'];
  for (const t of texts) {
    try {
      const b = page.getByRole('button',{name:new RegExp(`^${t}$`,'i')}).first();
      if (await b.isVisible({timeout:250})) { await b.click({timeout:1000}); await page.waitForTimeout(250); }
    } catch {}
  }
}

const browser = await chromium.launch({headless:true});
const context = await browser.newContext({
  viewport:{width:1440,height:900},
  deviceScaleFactor:1,
  colorScheme:'light',
  locale:'pt-BR',
});
const pageInfos = [];
const assetRefs = new Map();

for (let idx=0; idx<URLS.length; idx++) {
  const url = URLS[idx];
  const slug = slugForUrl(url);
  const page = await context.newPage();
  console.log(`[${idx+1}/${URLS.length}] ${url}`);
  try {
    const resp = await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
    try { await page.waitForLoadState('networkidle',{timeout:12000}); } catch {}
    await tryDismiss(page);
    await autoScroll(page);
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0,0));
    await page.waitForTimeout(300);

    const info = await page.evaluate(() => {
      const pickStyle = (el) => {
        if (!el) return null;
        const s = getComputedStyle(el);
        return {
          fontFamily:s.fontFamily, fontSize:s.fontSize, fontWeight:s.fontWeight,
          lineHeight:s.lineHeight, color:s.color, backgroundColor:s.backgroundColor,
          borderRadius:s.borderRadius, letterSpacing:s.letterSpacing, textTransform:s.textTransform
        };
      };
      const headings = [...document.querySelectorAll('h1,h2,h3,h4')].map((e,i)=>({
        tag:e.tagName.toLowerCase(), text:(e.textContent||'').trim().replace(/\s+/g,' ').slice(0,500),
        style:pickStyle(e), rect:{x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}
      })).filter(x=>x.text);
      const sections = [...document.querySelectorAll('main section, section, main > div')].slice(0,80).map((e,i)=>({
        i,
        id:e.id||null,
        className:typeof e.className==='string'?e.className.slice(0,300):'',
        text:(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,1800),
        rect:{x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height},
        style:pickStyle(e)
      })).filter(x=>x.text);
      const images = [];
      for (const img of document.images) {
        const src = img.currentSrc || img.src;
        if (src) images.push({src,alt:img.alt||'',width:img.naturalWidth||0,height:img.naturalHeight||0,displayWidth:img.getBoundingClientRect().width,displayHeight:img.getBoundingClientRect().height});
      }
      const bg = new Set();
      for (const el of document.querySelectorAll('*')) {
        const v = getComputedStyle(el).backgroundImage;
        if (v && v !== 'none') {
          for (const m of v.matchAll(/url\(["']?([^"')]+)["']?\)/g)) bg.add(new URL(m[1],location.href).href);
        }
      }
      const buttons = [...document.querySelectorAll('button,a')].filter(e=>{
        const r=e.getBoundingClientRect(); const s=getComputedStyle(e);
        return r.width>20 && r.height>20 && (e.tagName==='BUTTON'||s.display.includes('flex')||parseFloat(s.borderRadius)>0);
      }).slice(0,80).map(e=>({text:(e.textContent||'').trim().replace(/\s+/g,' ').slice(0,200),style:pickStyle(e),href:e.href||null}));
      const body = document.body;
      return {
        title:document.title,
        description:document.querySelector('meta[name="description"]')?.content||'',
        url:location.href,
        lang:document.documentElement.lang||'',
        bodyText:(body.innerText||'').trim().replace(/\n{3,}/g,'\n\n').slice(0,50000),
        doc:{scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight},
        bodyStyle:pickStyle(body),
        headerStyle:pickStyle(document.querySelector('header')),
        footerStyle:pickStyle(document.querySelector('footer')),
        headings,sections,images,backgroundImages:[...bg],buttons
      };
    });
    info.requestedUrl = url;
    info.status = resp?.status() ?? null;

    for (const im of info.images) {
      try { const abs = new URL(im.src, info.url).href; assetRefs.set(abs,{...im,sourcePages:[...(assetRefs.get(abs)?.sourcePages||[]),url]}); } catch {}
    }
    for (const bg of info.backgroundImages) {
      try { const abs = new URL(bg, info.url).href; assetRefs.set(abs,{src:abs,alt:'CSS background',width:0,height:0,sourcePages:[...(assetRefs.get(abs)?.sourcePages||[]),url]}); } catch {}
    }

    const png = path.join(DIRS.screenshots,`${slug}.png`);
    const pdf = path.join(DIRS.pdfs,`${slug}.pdf`);
    await page.screenshot({path:png,fullPage:true,animations:'disabled'});
    execFileSync('img2pdf',[png,'-o',pdf],{stdio:'inherit'});
    await fs.writeFile(path.join(DIRS.metadata,`${slug}.json`),JSON.stringify(info,null,2));
    pageInfos.push({slug,url,title:info.title,status:info.status,height:info.doc.scrollHeight,width:info.doc.scrollWidth,pdf:`pdfs/${slug}.pdf`,screenshot:`screenshots/${slug}.png`,metadata:`metadata/${slug}.json`});
  } catch (e) {
    console.error('CAPTURE_FAIL',url,e);
    pageInfos.push({slug,url,error:String(e)});
  } finally {
    await page.close();
  }
}
await browser.close();

console.log(`Downloading ${assetRefs.size} unique assets`);
const assets = [];
const entries = [...assetRefs.entries()];
let cursor = 0;
async function worker() {
  while (true) {
    const i = cursor++;
    if (i >= entries.length) return;
    const [src,meta] = entries[i];
    const file = safeNameFromUrl(src);
    const out = path.join(DIRS.assets,file);
    try {
      const res = await fetch(src,{redirect:'follow',headers:{'user-agent':'Mozilla/5.0'}});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const sh = sharp(buf,{animated:true,limitInputPixels:false});
      const md = await sh.metadata();
      await sh.webp({quality:82,effort:5}).toFile(out);
      const st = await fs.stat(out);
      assets.push({sourceUrl:src,file:`assets-webp/${file}`,width:md.width||0,height:md.height||0,format:md.format||'',bytes:st.size,alt:meta.alt||'',sourcePages:[...new Set(meta.sourcePages||[])]});
      if ((i+1)%25===0) console.log(`assets ${i+1}/${entries.length}`);
    } catch(e) {
      assets.push({sourceUrl:src,error:String(e),sourcePages:[...new Set(meta.sourcePages||[])]});
      console.error('ASSET_FAIL',src,String(e));
    }
  }
}
await Promise.all(Array.from({length:8},()=>worker()));
assets.sort((a,b)=>(a.file||a.sourceUrl).localeCompare(b.file||b.sourceUrl));
await fs.writeFile(path.join(OUT,'pages.json'),JSON.stringify(pageInfos,null,2));
await fs.writeFile(path.join(OUT,'assets.json'),JSON.stringify(assets,null,2));
await fs.writeFile(path.join(OUT,'source-urls.txt'),URLS.join('\n')+'\n');

const publicDir = 'residindo-public-assets';
await fs.rm(publicDir,{recursive:true,force:true});
await fs.mkdir(publicDir,{recursive:true});
for (const a of assets) {
  if (!a.file) continue;
  await fs.copyFile(path.join(OUT,a.file),path.join(publicDir,path.basename(a.file)));
}
const hostedManifest = assets.map(a=>a.file?({
  sourceUrl:a.sourceUrl,
  webpFile:path.basename(a.file),
  cdnUrl:`https://cdn.jsdelivr.net/gh/NatanPimentel/natan-skills@residindo-capture-2026-08-21/${publicDir}/${path.basename(a.file)}`,
  width:a.width,height:a.height,bytes:a.bytes,sourcePages:a.sourcePages
}):a);
await fs.writeFile(path.join(publicDir,'manifest.json'),JSON.stringify(hostedManifest,null,2));
console.log('DONE',JSON.stringify({pages:pageInfos.length,assets:assets.length,successfulAssets:assets.filter(x=>x.file).length}));
