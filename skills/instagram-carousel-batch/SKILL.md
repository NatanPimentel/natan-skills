---
name: instagram-carousel-batch
description: >
  Produz 3 carrosséis de Instagram em paralelo (30 slides + 3 story-reels) para
  a {{BRAND}}/{{HANDLE}}, do briefing consolidado à publicação em IG,
  Facebook, LinkedIn, TikTok e Threads, com checkpoints agrupados (não 3
  fluxos separados). Use quando o pedido for "3 carrosséis", "batch de
  carrossel", "lote de posts", ou "faz os posts da semana". É o padrão que o
  Natan sempre usou. Substitui o pipeline social-media-natan-batch do
  Opensquad — roda nativo no Hermes, sem o runner.
version: "1.0.0"
categories: [social-media, content, instagram, imobiturbo, batch]
---

# Carrossel de Instagram — Batch (3 de uma vez) — {{BRAND}}

Orquestrador nativo do Hermes. **Não** chame `/opensquad` nem o
`_opensquad/core/runner.pipeline.md` — esta skill é o runner.

`{SQUAD}` = `squads/social-media-natan-batch` (raiz do profile). Os arquivos
de prompt de cada step continuam lá e são a fonte de verdade do conteúdo;
esta skill é a fonte de verdade da **orquestração**.

É a única skill de carrossel deste profile — não existe versão "1 carrossel
só" (a antiga skill `instagram-carousel` foi removida por decisão do Natan:
ele sempre usa o batch de 3). O pipeline abaixo é hardcoded pra 3 slots
(anti-fadiga exige 3 tipos distintos, Batch Review mostra 3 lado a lado) —
não tente rodar com 1 ou 2 sem adaptar as regras primeiro.

## Antes de começar (obrigatório)

1. **Data real via shell.** Rode `date "+%A, %Y-%m-%d %H:%M:%S"`. Nunca infira
   a data do system prompt. Nome da pasta da run usa o padrão
   `{modelo}-{dd}-{mm}-{hh}h{mm}` (regra `feedback_run_folder_naming` em
   `{SQUAD}/_memory/rules.md`).
2. **Carregue o contexto**, nesta ordem:
   - `_opensquad/_memory/company.md` — contexto da empresa (sempre existe)
   - `{SQUAD}/_memory/rules.md` — preferências e REGRAS INQUEBRÁVEIS do
     squad batch (anti-fadiga, story-reel obrigatório, proibições — ver
     seção própria abaixo, não é a mesma coisa que o rules.md do squad single)
   - `{SQUAD}/_memory/runs.md` — últimas ~10 runs, usado pra anti-fadiga
   - `{SQUAD}/squad-party.csv` — elenco de personas (só 3, ver abaixo)
3. **Não carregue `history.md`** em subagente — é log humano, custa contexto.
4. Saída em `{SQUAD}/output/{run_id}/post-01/`, `post-02/`, `post-03/`
   (symlink de `local/squad-output/social-media-natan-batch/`, sobrevive a
   `hermes profile update`).

## Personas (só 3 — diferente do squad single)

| id | Persona | Execução |
|---|---|---|
| researcher | Rafa Reportagem 🔍 | subagent |
| creator | Iago Iscar ✍️ | inline (cobre headline, copy, capa e imagem — não existe Diana/Bento/Victor separados aqui) |
| publisher | Paulo Publicador 📤 | inline |

`rules.md` às vezes menciona "Diana" em prosa antiga (era squad single) —
ignore o nome, quem executa é Iago (`creator`) mesmo.

## Regras de marca — inegociáveis (mesmas do squad single)

- **X/Twitter desativado (2026-04-24).** Não escreva copy nem publique lá.
- **Threads: no-CTA.** Sem CTA, sem link, sem hashtag, sem @mention própria,
  sem em-dash, sem markdown. Modo A (single ≤500c) ou Modo B (2 posts via
  `additionalPosts` nativo Blotato).
- **Blotato é PROIBIDA para gerar imagem.** Só publica/agenda.
- **CTA, slide 10:** a CTA é obrigatoriamente uma arte inteira do banco local
  `local/cta-bank/comente-sistema/`. Antes do render de cada slot, rode
  `select.mjs` para gerar `assets/slide-10-cta.jpg`; o renderer deve copiá-la
  byte a byte para `slide-10.jpg`. Nunca usar `cta.png`, CTA HTML, crop,
  template, moldura, footer ou texto adicional. O sorteio não repete asset até
  completar o ciclo de 18 imagens.
- **Imagem:** sempre via `image-gen` (orquestrador GPT Image 2 → Nano Banana
  2 fallback). Nunca chamar `gpt-image-2-generator`/`nano-banana-generator`
  direto.
- **LinkedIn é duplo:** perfil pessoal + página {{BRAND}} (2 posts).
- **Em-dash proibido em qualquer copy.** Inquebrável.
- **Números cardinais sempre em algarismos** (67%, não "sessenta e sete por
  cento") — vale pra capa, headline, miolo, thread, legenda.

## Regras específicas do batch (não existem no squad single)

- **Anti-fadiga (`anti_fadiga_batch`, REGRA INQUEBRÁVEL):** os 3 ângulos
  escolhidos no Step 2 não podem repetir tipo canônico. 6 tipos possíveis:
  Tendência Interpretada, Tese Contraintuitiva, Case/Benchmark,
  Previsão/Futuro, Post de Feed, Post de Lâmina. Se o Natan escolher 2 do
  mesmo tipo, o Step 2 aborta e pede re-escolha listando o que ainda resta.
- **Story-reel é OBRIGATÓRIO por slot** (Steps 4.5 + 4.6, `required: true`).
  Não perguntar "quer rodar o reel?" — roda direto pros 3, salvo o Natan
  dizer explicitamente "pula reel hoje" no Step 1. Pular = reprovação.
- **Reel HeyGen hibernado** (irrelevante aqui — o story-reel do batch é
  renderizado, não é HeyGen).

## Layout alternativo: tweet-quote (10/10)

Adicionado em 2026-07-27. Todo o **mesmo fluxo batch** acima (3 slots,
mesmos gates, mesmo publish) pode produzir carrosséis num visual totalmente
diferente: 10 slides estilo screenshot-de-tweet (referência Tom Ferry —
mesmo visual do squad `social-media-natan-tweet`, mas agora dentro do
carrossel de 3, não como post avulso).

**Como ativar:** em `copy.json`, setar `"layout": "tweet"` em `cover`, em
**todos** os itens de `slides` e em `cta`. Se só parte dos 10 usar `tweet` e
o resto usar os layouts normais (`normal`/`bg-overlay`/etc.), o resultado
fica visualmente inconsistente (mistura tweet puro com {{BRAND}}
brand) — não é proibido, mas normalmente você quer os 10 no mesmo layout.

**Mapeamento de campos** (mesmo copy.json, campos diferentes usados):
- `cover.line1_html` → texto da frase da capa (ignora `sub_html`)
- `slides[].lede_html` → texto da frase de cada slide (ignora `kicker`,
  `title_html`, `body_html`, `list_items`, `theme` — tudo isso é descartado
  silenciosamente pro layout tweet)
- `cta.lede_html` (ou `title_html` como fallback) → frase de fechamento
  (ignora `mode` — não tem card de CTA nesse layout)

**Visual fixo, não configurável por slide:** fundo preto puro, avatar +
"{{NAME}}" + "{{HANDLE}}" + selo verificado, sem a barra "Powered
by {{BRAND}}", sem progress bar, sem imagem nenhuma. Font-size da frase
faz auto-fit (42px → mínimo 28px) se não couber.

**Isso muda o trabalho do Step 3 (Iago).** O processo padrão do
`step-03-headlines-spine-copy.md` gera headline + spine + 18 blocos de copy
estruturada (kicker/lede/body) — não serve pra esse layout. Quando o
briefing pedir "estilo tweet", Iago deve gerar **10 frases curtas e
independentes** (uma por slide, no tom "operador-mentor" do
`_opensquad/_memory/company.md`), não um miolo estruturado. Trate como um
banco de 10 quotes, não como um argumento progressivo de 10 slides.

**Regras que continuam valendo:** em-dash proibido (guard do
`render-tweet.mjs` original travava nisso — REGRA INQUEBRÁVEL geral do
squad), números cardinais em algarismos, sem segunda pessoa direta forçada.

**Exceção obrigatória do slide 10:** mesmo quando os slides 1–9 usam layout
tweet-quote, o slide 10 não é quote. Ele continua sendo a imagem CTA inteira
do banco `comente-sistema`, sorteada e copiada sem transformação.

**Onde vive o código:** `skills/carousel-renderer/scripts/_template-engine.mjs`
(`buildTweet()`, dispatch em `buildMiolo()` por `layout === 'tweet'`, e em
`buildRenderHtmls()`/`buildPreviewGrid()` para cover/cta) +
`skills/carousel-renderer/scripts/render.mjs` (`autoFitTweet()`, detecta
por presença do elemento `#quote` na página). Reaproveita o template real
de `squads/social-media-natan-tweet/template/tweet.html` e a constante
`NATAN_PNG` (`_opensquad/_assets/natan-profile.png`), compartilhada com o
`buildCover()` padrão — o path antigo `foto/natan.png` era quebrado (arquivo
não existe) e foi corrigido em 2026-07-27 pros dois.

## Fluxo — 6 phases, 6 gates (não 18)

Gate = pare e pergunte ao usuário. Todos os gates de escolha são
**consolidados** (mostra os 3 slots juntos, uma resposta só) — é a razão de
existir desse squad em vez de rodar o single 3×.

| # | O quê | Quem | Execução | Gate |
|---|---|---|---|---|
| 1 | Setup mudo + Natan cola 3 conjuntos de insumos | — | checkpoint | **SIM** |
| 2 | 3 insumos → 18 ângulos (6/conjunto) → escolha de 3 | Rafa (`researcher`) | subagent, NÃO paralelo (1 chamada vê os 3) | **SIM** |
| 3 | Headlines + Spine + Copy — 60 headlines (20/slot) | Iago (`creator`) | **subagent, paralelo (3×)** | **SIM** (consolidado — escolhe 1 por slot) |
| 4A | 30 conceitos de capa (10/slot) | Iago | inline, paralelo | **SIM** (consolidado) |
| 4B | 12 variações de capa (4/slot) + miolos auto | Iago | inline, paralelo | **SIM** (consolidado) |
| 4.5 | Audience question (sticker Q&A do reel) | Iago | inline, paralelo | não (auto, required) |
| 4.6 | Render story-reel 1080×1920 | script | inline, paralelo | não (auto, required) |
| 5 | Batch Review — 3 carrosséis + 3 reels lado a lado | — | checkpoint | **SIM** (aprovado/rejeitado/editado por slot) |
| 5.7 | Scheduling manual — 3 horários independentes | — | checkpoint | **SIM** |
| 6 | Batch Publish — carrossel (5 plataformas) + reel (3 plataformas), sequencial por slot | Paulo (`publisher`) | inline | não |

Instruções detalhadas de cada step em `{SQUAD}/pipeline/steps/step-NN-*.md` e
o mapa completo (incluindo `batch_parallel`, `auto_pick`, `checkpoint_mode`)
em `{SQUAD}/pipeline/pipeline.yaml`. Leia o arquivo do step **antes** de
executá-lo.

**Steps 4.5 e 4.6 são invioláveis** — pular e ir direto pro publish é
reprovação automática, mesmo que pareça "otimização".

### Resíduos conhecidos — ignore

- `{SQUAD}/agents/creator/tasks/convert-to-thread.md`,
  `{SQUAD}/agents/designer/tasks/render-carousel-slides.md`,
  `{SQUAD}/agents/publisher/tasks/publish-instagram.md`,
  `{SQUAD}/agents/publisher/tasks/publish-linkedin-facebook.md`,
  `{SQUAD}/agents/planner/tasks/organize-calendar.md` — nenhum step do
  `pipeline.yaml` referencia esses arquivos. São resíduo de versões
  anteriores do squad. Não procure conteúdo neles.
- ~~`step-05-cover-and-images.md` frontmatter apontava pra
  `squads/social-media-natan/...`~~ — corrigido em 2026-07-27, agora aponta
  pra `{SQUAD}/output/{run_id}/post-{slot}/v1/...`.

## Como executar cada tipo

**Inline** — assuma a persona (Iago/Paulo) e diga quem está falando
("**Iago:** ..."). **Subagent** (steps 2 e 3) — use o toolset `delegation`,
avise que há trabalho em background, valide o retorno antes de apresentar.
Steps `batch_parallel: true` (3, 4A, 4B, 4.5, 4.6) disparam os 3 slots ao
mesmo tempo — não rode slot a slot em série, isso anula o propósito do
squad batch.

**Skills que esta orquestração chama** — não reimplemente nenhuma delas:

| Precisa de | Skill |
|---|---|
| Gerar imagem | `image-gen` → `gpt-image-2-generator` (fallback `nano-banana-generator`) |
| Renderizar slides | `carousel-renderer` (ou `{SQUAD}/scripts/render.mjs` direto) |
| Renderizar story-reel | `{SQUAD}/scripts/render-story-reel.mjs` |
| Template/layout | `template-designer` |
| Ganchos/headlines | `viral-hook-creator` |
| Publicar e agendar | `{SQUAD}/scripts/blotato-multiplatform.mjs` (carrossel) + `{SQUAD}/scripts/publish-reel.mjs` (reel) |
| Research/insumo | `research-sources`, `apify`, `hound-search` (ver `skills/hound-search/SKILL.md` — **não** `brave-search`, `bx` não está instalado) |

## Estado e retomada

Grave o progresso em `{SQUAD}/output/{run_id}/_batch-state.json`:

```json
{"step": 4, "phase": "B", "status": "awaiting_approval", "updated": "<data do shell>"}
```

Ao retomar, leia esse arquivo e continue do step/phase registrado — não
recomece do zero e não repita um gate já aprovado. Slots `rejeitado` no
Step 5 saem do fluxo (não entram no scheduling nem no publish); os demais
seguem normalmente.

## Ao terminar

1. Confirme por slot × plataforma o que foi publicado/agendado (carrossel:
   5 plataformas; reel: 3 plataformas). Falha em uma plataforma **não**
   aborta as outras — reporte isoladamente.
2. Registre o aprendizado do run com `mnemosyne_remember`, repetindo os
   termos que você usaria para buscar depois (o recall tem portão lexical:
   paráfrase em português falha).
3. **Não comite nada automaticamente.** Diga o que está pronto para revisão.
