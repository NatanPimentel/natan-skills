---
name: unsplash-fetcher
description: >
  Busca e faz download de fotos de alta qualidade do Unsplash baseado em palavras-chave.
  Retorna imagens em orientação portrait, ideais para carrosséis e posts Instagram.
  Salva localmente com nome timestampado.
description_pt-BR: >
  Busca e faz download de fotos de alta qualidade do Unsplash baseado em palavras-chave.
  Retorna imagens em orientação portrait, ideais para carrosséis e posts Instagram.
type: script
version: "1.0.0"
script:
  path: scripts/fetch.cjs
  runtime: node
  invoke: "node {skill_path}/scripts/fetch.cjs --query \"{query}\" --output \"{output}\""
  dependencies: []
env:
  - UNSPLASH_ACCESS_KEY
categories: [assets, images, stock-photos]
---

# Unsplash Fetcher

## When to use

Use this skill when you need high-quality stock photos from Unsplash for carousel slides, social media posts, or any visual content. The skill searches by keyword and downloads portrait-oriented images optimized for Instagram (3:4 ratio).

**Prefer this over AI-generated images when:**
- You need realistic photos (buildings, cityscapes, people, offices)
- The content requires editorial credibility (news, data, analysis)
- Speed matters (download is instant vs. AI generation takes seconds)

**Use AI generation instead when:**
- You need a very specific composition that stock photos can't provide
- The image needs to include brand elements or custom illustrations

## Instructions

### Single image fetch

```bash
node skills/unsplash-fetcher/scripts/fetch.cjs \
  --query "real estate building modern" \
  --output "squads/{squad}/output/{run_id}/assets/"
```

### With custom filename

```bash
node skills/unsplash-fetcher/scripts/fetch.cjs \
  --query "skyline city sunset" \
  --output "squads/{squad}/output/{run_id}/assets/" \
  --filename "cover-image.jpg"
```

### Multiple images (run multiple times with different queries)

```bash
node skills/unsplash-fetcher/scripts/fetch.cjs --query "apartment interior" --output "./assets/"
node skills/unsplash-fetcher/scripts/fetch.cjs --query "construction site aerial" --output "./assets/"
node skills/unsplash-fetcher/scripts/fetch.cjs --query "family moving house" --output "./assets/"
```

### Query guidelines

- Use English keywords for best results (Unsplash's index is English-first)
- Be specific: "modern apartment interior living room" > "apartment"
- Add mood: "dark moody cityscape" vs. "city"
- For real estate content: "real estate", "building", "apartment", "house", "skyline", "interior design"
- The API returns portrait-oriented images by default (best for Instagram)

### Output

The script prints the absolute path of the downloaded file to stdout. The calling agent should capture this path to reference the image in HTML slides.

Example output:
```
D:\opensquad\squads\my-squad\output\2026-04-05\assets\unsplash_20260405_143022.jpg
```

## Error handling

- If `UNSPLASH_ACCESS_KEY` is not set, the script exits with an error message
- If no images match the query, the script reports "No results" and exits with code 1
- If the download fails, the script reports the HTTP status and exits with code 1
- Rate limit: 50 requests/hour on free tier. Script reports remaining quota in stderr.
