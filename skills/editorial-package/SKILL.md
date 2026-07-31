---
name: imobiturbo-editorial-package
description: >
  Use when producing or repairing the complete editorial package for an
  {{BRAND}} carousel slot: JSON copy, spine, headline, carousel, LinkedIn,
  Threads and email assets with strict publish-safe validation.
version: "1.0.0"
categories: [social-media, content, instagram, imobiturbo]
---

# {{BRAND}} Editorial Package

Use this skill for a selected carousel slot when the request is to produce or repair the editorial assets without rendering images or publishing. It applies to one slot inside a batch or an equivalent standalone content package.

## Required inputs

Read these before drafting:

1. The slot `briefing.md` for brand, type, CTA, slide count and selected headline.
2. The slot `insumo.md` for only the approved facts, source and editorial limit.
3. Company context, squad rules, Step 3 instructions and anti-patterns.

Do not introduce legal, financial or market facts beyond the supplied insumo. Where an interpretation touches legal or tax decisions, state the boundary: the content informs and directs readers to individual legal/accounting analysis; it does not recommend a transaction or calculate an outcome.

## Deliverables

Write all 7 files into the slot's `v1/` directory:

- `copy.json`
- `spine.md`
- `headline-selected.md`
- `carousel-content.md`
- `thread-content.md`
- `thread-content-threads.md`
- `email-content.md`

Use the pipeline schema for `copy.json`. The canonical content package has cover + slides 2-9 + CTA, while `carousel-content.md` presents all 10 slides in reviewable form.

## Copy rules

- Preserve the selected cover headline literally in uppercase, changing only typography tags such as `<em>`.
- Cover has 1-3 `<em>` highlights, separated by white text; do not highlight more than half of the words.
- Cardinal numbers use digits. Do not use an em-dash anywhere.
- Slides 2-9 do not use direct second person (`você`, `seu`, `sua`).
- Each slide lede has 2+ `<strong>` elements and 220-250 visible characters, unless a newer slot instruction explicitly supersedes this range.
- Attribute any numeric claim on the slide with its source and year.
- Explain real-estate jargon inline or replace it with plain Portuguese that a property owner, buyer or tenant understands.
- Slide 10 uses the exact configured CTA, rather than a thematic rewrite.

## Channel adaptations

### LinkedIn

`thread-content.md` is a long-form 8-post sequence. Each post must make sense if read alone and develop the argument rather than compressing slide text.

### Threads/Meta

`thread-content-threads.md` uses mode A or B. It is a reformulation, not a summary. It must contain no CTA, URL, hashtag, own-account mention, markdown, em-dash or `[1/2]`-style markers. Each native post is at most 500 characters and has a first-line punch.

### Email

`email-content.md` is plain text in persiana format: one sentence per line, blank line between sentences, no Markdown or lists. Subject is at most 55 characters; preheader is at most 100. Open in a concrete scene, give the analysis in prose, then end with the canonical masterclass URL and `abraço,\n{{NAME}}`.

## Validation gate

Before reporting completion:

1. Parse `copy.json` as JSON; verify slide numbers `2..9`, a literal uppercase cover headline after stripping HTML, and the literal CTA fields.
2. Programmatically check each lede's visible character count, `<strong>` count and forbidden second-person terms.
3. Check all 7 deliverables exist.
4. Check all files for an em-dash.
5. Check Threads separately for forbidden CTA/link/hashtag/mention/markdown/sequence markers and character limit per post.
6. Check email for the canonical URL, plain-text format and signature.
7. Report only concise validation status and the actual paths written, unless the user asks for content or commentary.

## Path handling pitfall

Do not infer a destination from the request alone. Treat the file-writing tool's `resolved_path` as the source of truth. In profile-managed squad work, a requested squad-output path can be redirected to a canonical `local/squad-output/.../v1/` location. Validate the resolved files and report those actual paths.

## Scope boundary

This skill stops at editorial artifacts. Rendering, reels, scheduling and publishing are governed by the carousel batch and publisher skills.
