---
name: carousel-renderer
description: >
  Renderiza 10 slides JPG 1080×1350 de carrossel {{BRAND}} via Playwright
  a partir de copy.json + pasta assets/. Suporta layouts bg-overlay,
  ref1-sandwich, sandwich, all-type. Auto-fit de capa (font-size shrink
  até caber). Não decide visual, não chama image-gen — só renderiza
  dado o input pronto.
type: script
version: "1.0.0"
env: []
categories: [render, carousel, imobiturbo]
---

# carousel-renderer

Extrai a Fase D2 da Diana (`squads/social-media-natan/agents/designer.agent.md`)
pra skill independente. Diana Fase D1 (10 conceitos textuais de capa) continua
sendo trabalho de agente — esta skill cobre só a parte determinística:
HTML + Playwright + screenshot.

## Uso

```
node skills/carousel-renderer/scripts/render.mjs <path/to/copy.json>
```

## Input esperado

Estrutura no mesmo diretório do `copy.json`:

```
output/{run_id}/v1/
├── copy.json                    # contrato dos 10 slides
└── assets/
    ├── slide-01-cover.png       # ou .jpg — capa 4:5 portrait
    ├── slide-02-miolo.png       # ou .jpg — landscape 16:9
    ├── slide-03-miolo.png       # idem (slides 4-9 também — opcional por slide)
    ├── slide-10-cta.jpg         # OBRIGATÓRIO: CTA inteira sorteada do banco
    └── cta-selection.json       # hash + ID da seleção do banco
```

Schema do `copy.json` (campos relevantes):

```json
{
  "cover": {
    "line1_html": "<em>NUMERO</em> em <em>X ANOS</em>",
    "sub_html": "DESCONTINUADO — ignorado com warning"
  },
  "slides": [
    {
      "n": 2,
      "theme": "dark | light | gradient | cream | moss | neon",
      "layout": "normal | bg-overlay | sandwich | ref1-sandwich | all-type",
      "kicker": "ROTINA",
      "title_html": "...",
      "lede_html": "...",
      "body_html": "...",
      "list_items": ["..."],
      "list_marker": "arrow | x | dash | numbered"
    }
  ],
  "cta": {
    "title_html": "metadado legado, não entra no JPG final",
    "lede_html": "metadado legado, não entra no JPG final",
    "mode": "legacy"
  }
}
```

O objeto `cta` continua no schema por compatibilidade de copy, mas o slide 10
final vem exclusivamente de `assets/slide-10-cta.jpg`.

## Output

`slide-01.jpg` ... `slide-10.jpg` (1080×1350, qualidade 92, `deviceScaleFactor: 1`).
HTMLs temporários `slide-NN.html` ficam ao lado para inspeção/debug.

## Comportamento

- **`bg-overlay` escuro:** o renderer remove um wrapper `<p>` redundante de `lede_html` para não criar distância artificial entre título e corpo. Usa gap compacto de 18px, corpo em branco sólido e apenas `<strong>`/`<em>` em verde neon `#d6fd73`.
- **Slide 10, banco CTA (regra estrita):** antes do render, executar
  `node local/cta-bank/comente-sistema/select.mjs --run <run> --post <post> --dest <v1>/assets/slide-10-cta.jpg`.
  O renderer exige o JPEG e `cta-selection.json`, valida `1080×1350` + hash e
  copia o asset byte a byte para `slide-10.jpg`. Sem seleção válida, falha.
  Nunca aplica crop, template, brand bar, footer, overlay ou texto adicional.
- **Capa auto-fit:** parte de 132px e reduz até 78px se a `.capa-headline`
  ultrapassar 660px de altura.
- **Miolo auto-fit:** shrink de `.lede` / `.top-text` / `.bottom-text` de 36px até 22px
  se o `.body` da slide overflow. Como último recurso, reduz `max-height` da imagem.
- **Assets faltando em layout que pede imagem:** renderiza placeholder dashed +
  warning no console (`[render] ⚠️ slide-NN layout=... requires image but no asset found`).

## Quando NÃO usar

- Se faltarem assets, o renderer gera placeholder visível com warning. Diana
  (ou equivalente humano/agente) deve garantir todos os assets gerados antes
  da publicação real.
- Format diferente de 1080×1350 — esta skill é hardcoded pro padrão {{BRAND}}
  feed. Reels (1080×1920) usam `squads/*/scripts/render-story-reel.mjs`.
- Brand diferente — fontes (`Futura LT CondExtraBold`) e cor accent
  (`#d6fd73` lime) são fixas {{BRAND}}. Cobertura em
  `skills/template-designer/base-templates/cover-imobiturbo.html`.

## Dependências

- `playwright` npm package.
- `skills/template-designer/base-templates/cover-imobiturbo.html` (template da capa).
- `skills/template-designer/base-templates/fonts/Futura LT CondensedExtraBold Regular.ttf`.
- `foto/natan.png` (avatar para os slides de template).
- `local/cta-bank/comente-sistema/full-slide.mjs` + banco de assets/manifesto.
  `foto/cta.png` pode existir apenas para o HTML temporário legado, mas nunca é
  o `slide-10.jpg` final.

## Origem

Copiado em 2026-05-15 de:
- `squads/social-media-natan/scripts/render.mjs` → `scripts/render.mjs`
- `squads/social-media-natan/scripts/_template-engine.mjs` → `scripts/_template-engine.mjs`

Squads ainda apontam pros scripts locais. Migração squad→skill é TODO
(`squads/_audit/refactor-todos-2026-05-15.md`).
