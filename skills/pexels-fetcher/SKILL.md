---
name: pexels-fetcher
description: >
  Busca e faz download de fotos de alta qualidade do Pexels baseado em palavras-chave.
  Retorna imagens em orientação portrait, ideais para carrosséis e posts Instagram.
type: script
version: "1.0.0"
script:
  path: scripts/fetch.cjs
  runtime: node
  invoke: "node {skill_path}/scripts/fetch.cjs --query \"{query}\" --output \"{output}\""
  dependencies: []
env:
  - PEXELS_API_KEY
categories: [assets, images, stock-photos]
---

# Pexels Fetcher

## When to use

Use this skill to fetch high-quality stock photos from Pexels. Free API with generous limits (200 req/month). Images are portrait-oriented by default.

## Instructions

```bash
node skills/pexels-fetcher/scripts/fetch.cjs \
  --query "modern apartment interior" \
  --output "squads/{squad}/output/{run_id}/assets/" \
  --filename "cover.jpg"
```

- `--query`: Search term in English for best results
- `--output`: Directory to save the image
- `--filename` (optional): Custom filename (default: pexels_YYYYMMDD_HHMMSS.jpg)

The script prints the absolute path of the downloaded file to stdout.
