---
name: Asset Bank
description: Banco de imagens reutilizáveis para evitar regerar miolos genéricos via API. Consulta por estilo + tema antes de gerar imagem nova; reusa quando match satisfaz.
type: script
version: "1.0.0"
---

# Asset Bank

## Para que serve

Reduzir custo de geração de imagens via API consultando um banco local de assets já gerados antes de chamar Gemini/OpenRouter. Particularmente útil para **miolos genéricos** (slides 02-09 com temas recorrentes: corretor + smartphone, canteiro de obra, contrato cancelado, etc.) onde a mesma imagem serve múltiplos posts.

## Estrutura

```
_opensquad/_memory/asset-bank/
├── _index.json          # metadados de todos os assets (style, themes, aspect, prompt)
├── files/
│   └── {hash}.png       # arquivos content-addressable (sha256 truncado)
├── styles/
│   ├── editorial-photo/
│   ├── documentary-photo/
│   ├── pixel-art-8bit/
│   ├── cartoon-vintage-monopoly/
│   ├── editorial-3d-lowpoly/
│   ├── editorial-economist-illustration/
│   ├── editorial-chart/
│   ├── abstract-gradient/
│   └── cyberpunk-noir/
├── seed.mjs             # popula bank a partir de copy.json de runs
└── lookup.mjs           # consulta o bank por (style, themes, aspect)
```

## Comandos

### Lookup — antes de gerar imagem

```bash
node skills/asset-bank/lookup.mjs --style editorial-photo --themes "broker,smartphone" --aspect 4:5
```

Saída JSON:
```json
{
  "found": true,
  "match_score": 0.85,
  "file": "_opensquad/_memory/asset-bank/files/a3f4...png",
  "entry": { "style": "editorial-photo", "themes": ["broker","smartphone"], ... }
}
```

Se `found: false`, gera nova imagem normalmente. Se `found: true` e score ≥ 0.6, copia o arquivo retornado em `file` para o destino do slide.

### Seed — popular bank a partir de runs existentes

```bash
node _opensquad/_memory/asset-bank/seed.mjs
```

Lê `copy.json` dos runs configurados, classifica cada miolo por estilo/tema via regex no prompt, copia arquivo pro bank, gera `_index.json`.

### Add — adicionar 1 asset manualmente após geração

```bash
node skills/asset-bank/add.mjs --file path/to/image.png --style editorial-photo --themes "construction,city" --aspect 16:9 --prompt "..."
```

## Score de match

Implementação simples em `lookup.mjs`:
- Style igual: +0.5
- Aspect igual: +0.2
- Cada theme em comum: +0.15 (cap em 0.3)

Total mínimo recomendado: 0.6 (style igual + aspect igual + ao menos 1 theme).

## Integration point no runner.pipeline.md

Phase D (geração de imagens), antes de chamar nano-banana-generator:

```js
const lookup = spawnSync('node', ['skills/asset-bank/lookup.mjs',
  '--style', coverStyle,
  '--themes', themesFromPrompt.join(','),
  '--aspect', aspect
], { encoding: 'utf8' });
const result = JSON.parse(lookup.stdout);
if (result.found && result.match_score >= 0.6) {
  fs.copyFileSync(result.file, outPath);
  console.log(`[bank] reused ${result.entry.hash}`);
} else {
  // gera via API
}
```

## Crescimento do bank

- Bank seed inicial: 27 assets do batch `28-04-26-0145-opus`.
- A cada novo run, adicionar via `add.mjs` os assets que forem **genéricos** (sem dado específico do post no frame, sem texto, sem face reconhecível).
- Capas (slide-01) **não vão pro bank** — são post-específicas.
