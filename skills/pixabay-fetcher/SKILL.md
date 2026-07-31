---
name: pixabay-fetcher
description: >
  Busca e faz download de fotos de alta qualidade do Pixabay baseado em palavras-chave.
  Retorna imagens verticais, ideais para carrosséis e posts Instagram.
type: script
version: "1.0.0"
script:
  path: scripts/fetch.cjs
  runtime: node
  invoke: "node {skill_path}/scripts/fetch.cjs --query \"{query}\" --output \"{output}\""
  dependencies: []
env:
  - PIXABAY_API_KEY
categories: [assets, images, stock-photos]
---

# Pixabay Fetcher

## When to use

Use this skill to fetch free stock photos from Pixabay. No attribution required. Images are vertical-oriented by default.

## Instructions

```bash
node skills/pixabay-fetcher/scripts/fetch.cjs \
  --query "city skyline sunset" \
  --output "squads/{squad}/output/{run_id}/assets/" \
  --filename "background.jpg"
```

- `--query`: Search term in English for best results
- `--output`: Directory to save the image
- `--filename` (optional): Custom filename (default: pixabay_YYYYMMDD_HHMMSS.jpg)

The script prints the absolute path of the downloaded file to stdout.
