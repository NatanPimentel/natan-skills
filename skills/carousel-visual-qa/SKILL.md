---
name: carousel-visual-qa
description: Use when reviewing carousel legibility and reexporting selected slides. Prioritizes cover hierarchy, readable body text, and selective delivery.
---

# Carousel Visual QA

## When to use

Use for post-render review or revision of an Instagram carousel, especially after feedback about cover impact, font size, broken line wrapping, text density, or punctuation artifacts.

## Workflow

1. **Locate the requested changes**
   - Identify post and slide numbers from the feedback.
   - Inspect the original JPGs at full resolution before editing.

2. **Diagnose the layer**
   - Renderer issue: sizing, max-height, autofit, layout CSS, or HTML structure.
   - For text layouts, inspect the rendered DOM contract: `lede_html` must be wrapped in a block carrying the intended typography class (for example, `<p class="lede">`). Raw text or inline-only HTML can silently fall back to browser-default miniature type.
   - Copy issue: excess information, a weak line break, punctuation separated from a highlighted word, or a sentence that needs compression.
   - Asset issue: contrast or background clashes with the text block.

3. **Apply hierarchy rules**
   - Covers: headline mass should fill about **40% of the useful 1080×1350 frame**, without clipping or reducing visual anchor strength.
   - Text slides: preserve readable body type by controlling density, not by making the slide sparse. When the brief calls for more volume, use up to three concise bullets plus one or two closing sentences while keeping the body type large.
   - In a dark `bg-overlay`, the supporting body must be solid white and only emphasis (`<strong>` / `<em>`) neon lime. Keep title and body visually adjacent; a nested lede wrapper must never create a blank paragraph-sized gap.
   - Treat lede, bullets, and closing lines as one intentional text group. Center that full group vertically in the useful frame rather than independently top-aligning or scattering its parts.
   - Keep punctuation visually attached to the preceding word, including around `<strong>` formatting.
   - Preserve a clear hierarchy: kicker → headline → supporting body → list / CTA.

4. **QA retratos CTA pessoais quando aplicável**
   - Compare o rosto gerado com a foto de referência; rosto e fisionomia são invariantes, enquanto roupa e acessórios só variam quando liberados.
   - Em um pedido de várias direções, “um de cada vez” significa que cada arquivo recebe geração e QA individual; não encerre a entrega após um único piloto quando o usuário pediu uma coleção, “mais versões” ou “todas”. Só pare na primeira se ele pedir teste, pausa ou aprovação por peça explicitamente.
   - Trate a CTA como objeto físico legível: confira grafia caractere por caractere, contraste, mãos, bordas e ausência de UI, marcas ou texto corrompido.
   - Leia [references/identity-cta-portraits.md](references/identity-cta-portraits.md) antes de aprovar ou adaptar um retrato CTA.

5. **Validate CTA-bank slide 10 when applicable**
   - Treat `assets/slide-10-cta.jpg` as the complete final composition, not a source image for a template.
   - Require `assets/cta-selection.json`; confirm its SHA-256 matches `slide-10.jpg` after render and that both files are JPEG `1080×1350`.
   - Visually audit the physical `COMENTE SISTEMA` CTA, facial identity, hands, margins and the absence of any template layer, crop, footer, page number or overlay.
   - For a new 3-post batch selection, confirm distinct CTA IDs. For a rerender of an existing post, confirm the selector resumed its original ID.
   - See [references/cta-bank-integrity-and-full-batch-delivery.md](references/cta-bank-integrity-and-full-batch-delivery.md).

5a. **Remediate CTA-bank edge artifacts before regenerating**
   - If a CTA has symmetric blurred vertical sidebars from prior 4:5 normalization, test an isolated, uniform 4:5 crop/zoom before requesting or triggering a new generation.
   - Preserve the facial identity, physical `COMENTE SISTEMA` text, sign margins and hands that hold it. Do not use non-uniform horizontal stretching.
   - Keep the pilot outside the canonical bank. Once approved, snapshot the existing bank/manifest, stage all affected CTAs and QA every candidate before promotion. A common crop box is permitted only after the full staged collection passes; otherwise use per-asset framing.
   - Promote atomically: validate JPEG/RGB/`1080×1350` and staged hashes, update manifest hashes plus preprocessing metadata, and preserve the selector's cycle/history state.
   - Resume the existing CTA ID for active posts, update their selection metadata, reexport only the affected slide 10 files, then verify the canonical asset → selected copy → rendered slide is byte-for-byte identical. Rebuild any review ZIP/manifest that contained the former asset.
   - The slide-10 renderer must remain a byte-for-byte copier; never add a crop/zoom transform there.
   - See [references/cta-bank-blurred-sidebars-remediation.md](references/cta-bank-blurred-sidebars-remediation.md).

5b. **Retire uma CTA rejeitada sem quebrar o ciclo**
   - Quando o usuário disser para deletar uma CTA, retire o asset do manifest e do arquivo canônico, estado do seletor, staging, backup e fontes locais reutilizáveis — não deixe uma cópia que possa voltar em um rerender futuro.
   - O seletor deve derivar a quantidade de CTAs do manifest ativo e filtrar IDs aposentados de `remaining` e `history`; nunca fixe a regra em 18 assets.
   - Se a CTA removida estiver em um post em revisão, apague somente a seleção/cópia daquele post, selecione a próxima CTA não repetida do deck e renderize exclusivamente o slide 10.
   - Refaça o ZIP e o manifesto de revisão para eliminar a imagem antiga, valide SHA-256 banco → cópia CTA → `slide-10.jpg`, e entregue somente o slide modificado.
   - Preferência editorial do Natan: não use camisa da seleção brasileira em retratos CTA pessoais; não reintroduza essa direção ao gerar ou selecionar assets futuros.
   - See [references/cta-bank-asset-retirement.md](references/cta-bank-asset-retirement.md).

6. **Render only changed slides**
   - Prefer selective rendering where supported:
     ```bash
     node skills/carousel-renderer/scripts/render.mjs <copy.json> --only=slide-01,slide-04
     ```
   - Do not re-export or send unchanged slides unless the user asks for a full refreshed batch.

7. **Verify raster, then visual, then deliver**
   - Verify the physical raster of every changed JPG before visual QA. A CSS viewport of `1080×1350` can still export `2160×2700` when Playwright uses a higher `deviceScaleFactor`; do not label that output as 1080×1350.
   - Confirm `JPEG` and exactly `1080×1350` with Pillow or an equivalent image inspector.
   - Run visual QA on every changed JPG at that final physical resolution.
   - If `.mjs` files under `skills/` changed, run `npm run lint`.
   - For a partial revision, deliver only the changed assets, labeled by post and slide number.
   - For an explicit full refreshed batch, deliver all 10 final JPGs per post inline and grouped by carousel. A contact sheet is only an overview; provide a ZIP as a supplement, not a replacement.
   - Keep the batch state in `awaiting_approval` until the user explicitly approves it; never publish or schedule during a revision unless explicitly instructed.

## Visual acceptance checklist

- Cover H1 is large, integral, contrasting, and approximately 40% of useful frame area.
- No clipped text, accidental miniature type, awkward orphan lines, or punctuation detached from words.
- Supporting copy remains semantically complete and scannable.
- Images have no placeholders or broken assets.
- Output path and slide count match the requested selective export.

## References

- See [references/imobiturbo-legibility.md](references/imobiturbo-legibility.md) for observed {{BRAND}} revision patterns and examples.
- See [references/all-type-layout-contract.md](references/all-type-layout-contract.md) for the text-density, vertical-grouping, and DOM-wrapper contract for `all-type` slides.
- See [references/raster-export-verification.md](references/raster-export-verification.md) to verify physical JPG dimensions before visual QA and delivery.
- See [references/cta-bank-integrity-and-full-batch-delivery.md](references/cta-bank-integrity-and-full-batch-delivery.md) for the immutable slide-10 CTA contract, hash validation, and full-batch delivery format.
- See [references/cta-bank-blurred-sidebars-remediation.md](references/cta-bank-blurred-sidebars-remediation.md) for the isolated crop/zoom test, approval gate and canonical-bank update sequence for blurred sidebars.
