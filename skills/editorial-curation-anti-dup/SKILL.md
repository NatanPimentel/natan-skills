---
name: editorial-curation-anti-dup
description: >
  Curadoria editorial pré-pipeline: puxar N pautas não-usadas de uma base
  temática com anti-dup rigoroso (runs + reels-published + ledgers),
  ranquear por relevância, e entregar pacote pronto pro Natan escolher
  antes de disparar o squad de produção. Use quando o pedido for "puxa
  pautas", "me dá opções de tema", "ideias de carrossel", "o que posso
  postar essa semana", "sugere pautas não repetidas", ou antes de
  disparar o batch de carrossel quando o Natan não trouxe insumo próprio.
---

# Curadoria Editorial com Anti-Dup

Quando o Natan pede pautas antes de produzir (ou quando o squad vai
rodar sem insumo trazido por ele), o agente precisa fazer curadoria
multi-fonte com anti-dup. Esta skill documenta o processo canônico.

## Fontes de onde extrair pautas (em ordem de prioridade)

1. **Radares frescos em `local/radares/`** — arquivos `.json` e `.md`
   dos radares diários (mercado-imobiliario, ia-automacao, marketing-trafego).
   Janela: últimas 48h. Contém IDs/URLs já marcados como lidos no dedup.
2. **Histórico de runs dos squads** —
   - `squads/social-media-natan/_memory/runs.md` (single)
   - `squads/social-media-natan-batch/_memory/runs.md` (batch)
   Ler TODAS as linhas, não só as últimas 5. O tema pode ter saído há
   3 meses e ainda contar como "usado" — o Natan não quer repetição
   nem de pauta nem de ângulo.
3. **Reels-published ledger** — quando existir
   (`_opensquad/_memory/reels-published.md` ou equivalente). Documenta
   o que foi publicado como reel, separado do que foi só carrossel.
4. **Ledgers temáticos** — `local/radares/x-exclusion-ledger.json`
   documenta exclusões por tema (ex: X/Twitter desativado). Outros
   ledgers podem existir sob demanda.
5. **Asset bank** — `_opensquad/_memory/asset-bank/_index.json` para
   cruzar com anti-reuso de rostos (regra `feedback_capa_reuso_recente`).

## Processo canônico (7 passos)

### 1. Compilar base de "temas usados"

Ler TODOS os runs.md (ambos squads) e extrair uma manchete curta por
linha (≤10 palavras). Fazer o mesmo com reels-published se existir.
Objetivo: ter a lista completa antes de começar a filtrar.

### 2. Compilar base de "pautas frescas"

Cruzar radares (`local/radares/*.json` + `*.md`) + asset bank +
quaisquer outros artefatos locais. IDs já marcados como lidos no
dedup dos radares NÃO precisam ser filtrados — eles já saíram do
pool.

### 3. Filtrar por tipo canônico

6 tipos possíveis:
- Tendência Interpretada
- Tese Contraintuitiva
- Case / Benchmark
- Previsão / Futuro
- Post de Feed
- Post de Lâmina

Se o pedido pede N pautas com tipos diferentes entre si (modo batch),
garantir que N tipos distintos sejam cobertos.

### 4. Anti-dup estrito

Para cada pauta candidata, verificar:
- Manchete/tema exato não está em "temas usados"? OK.
- Ângulo novo (não repete o mesmo ângulo, mesmo que o tema seja
  correlato)? Ex: "MRV IA Mia converte 20%→70%" (usado) e "3
  imobiliárias rodam agente IA no CRM" (nova) são pautas
  diferentes, mas ângulos correlatos — anotar.
- Rosto famoso não aparece nas últimas 10 capas com rosto identificado
  (regra `feedback_capa_reuso_recente`)? Verificar
  `_opensquad/_memory/faces-recent.md` se existir.

### 5. Gerar headlines por pauta

10 headlines por pauta, regras:
- Score Hook Strength Test ≥ +3 (não é frágil)
- Mix das 4 famílias: Autoridade, Contrarian, Loss Aversion,
  Achievement (cobrindo pelo menos 3 das 4)
- Sem em-dash (—), sem travessão, sem aspas escapadas
- Números cardinais SEMPRE em algarismos (regra `feedback_cardinais_algarismos`)
- Sem "A Morte de X" / "O Fim de Y" (cota máxima 1× a cada 30 posts)
- 1-2 palavras-chave por headline com `<em>` (regra de estilo editorial)

### 6. Gerar capas texto

10 conceitos por pauta:
- **5 famosos:** com `looking directly at camera, eye contact with viewer`
  literal no prompt (regra `feedback_cover_famous_eye_contact`).
  Anti-reuso: cruzar com `faces-recent.md` (se existir) e excluir
  rostos das últimas 10 capas.
- **5 técnicas:** sempre cenário real do nicho imobiliário +
  fenômeno inesperado que materializa a tese (regra
  `feedback_cover_concept_real_scenarios`). BANIDAS composições
  abstratas tipo "carimbo sobre câmera", "balança de papel x tijolo",
  "pixel-cartório".

### 7. Ranking e recomendação

Ordenar pautas por:
- Frescor (radar 48h > radar 7d > atemporal)
- Tipo canônico disponível (se o batch precisa Tendência+Tese+Case,
  pesar o que cobre os slots restantes)
- Conexão com os 4 pilares do {{BRAND}} (Demanda Previsível, Filtro
  Anti-Curioso, Processo Comercial, IA como Multiplicador)
- Potencial de share (conteúdo que o decisor manda pro cliente sem
  precisar explicar — regra `feedback_duplo_leitor_compartilhavel`)

Devolver:
- 3 (ou N) pautas com tipo, ângulo, "por que não foi usado"
- 10 headlines por pauta
- 10 capas por pauta (5 famosos + 5 técnicas)
- Ranking 1–N com justificativa
- Recomendação explícita de 1 pauta

## Pitfalls conhecidos

- **Não ler só as últimas 5 linhas do runs.md.** O Natan roda batch
  frequente mas também roda single avulso. Temas de 3 meses atrás
  contam. Ler TODAS as linhas.
- **Radares têm IDs já lidos no dedup.** O `.json` lista
  `reported_at`. O `.md` correspondente marca os IDs como lidos.
  Não reapresentar pauta cujo ID já está marcado.
- **Anti-reuso de famoso é por rosto, não por nome.** Phil Dunphy
  com look A e Phil Dunphy com look B contam como o mesmo rosto.
- **"Diferentes ângulos do mesmo tema" pode ser armadilha.** Se o
  tema "IA no imobiliário" já virou 3 carrosséis (MRV, Zillow, Sarah
  EUA), o 4º precisa de fato novo, não reframe.
- **O Natan escolhe, o agente recomenda.** Nunca finalizar a escolha
  sozinho. Devolver pacote, esperar decisão.

## Output format (padrão)

```markdown
## ANTI-DUP — Temas já usados
[lista compilada, agrupada por squad/fonte]

## Pauta 1 — [Tipo Canônico]
**Tema:** [1 linha]
**Ângulo:** [2-3 frases]
**Por que não foi usado:** [1 frase]

## HEADLINES — Pauta 1
| # | Headline | Família | Score |
|---|----------|---------|-------|

## CAPAS TEXTO — Pauta 1
### Famosos:
1. **[Nome]** — [descrição visual curta]
...
### Técnicos:
6. [descrição visual curta]
...

## RANKING 1–N
| Rank | Pauta | Tipo | Por quê |
|------|-------|------|---------|

## Recomendação
**Pauta X** — [tipo]. Razão: [2-3 frases].

Escolhe **1 pauta + 1 headline + 1 capa**. Eu pego dali.
```

## Relação com outras skills

- **Pré-condição de `instagram-carousel-batch`:** este fluxo é o que
  gera os 3 conjuntos de insumos do Step 1 quando o Natan não traz
  insumo próprio. Pode ser chamado diretamente pelo Natan
  ("Lobo: puxa 3 pautas") ou invocado automaticamente pelo batch.
- **Consome `research-radar-operations`:** os radares que alimentam
  a curadoria seguem o padrão dessa skill.
- **Alimenta `content-radar-x` (legado):** X/Twitter está desativado
  desde 2026-04-24, mas o ledger X ainda é mantido pra auditoria.
