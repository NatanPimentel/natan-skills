# Canonical X radar queries and panel schema

Reconstructed from Hot Ideas history (2026-07-20–23) and job `Radar · X (x_search · 6 radares)`.

## Known-good queries (exact from history)

### mentor-benchmark — Latest

```
(from:TomFerry OR from:RickyCarruth OR from:ryanserhant OR from:BrianBuffini OR from:katielance OR from:BrandonMulrenin OR from:KevinWard OR from:travisro OR from:JakehellerAI OR from:nowbammedia OR from:REMarketingTips OR from:WSJRealEstate OR from:Chris_Smth OR from:1000wattbrian) since:YYYY-MM-DD
```

Handles: TomFerry, RickyCarruth, ryanserhant, BrianBuffini, katielance, BrandonMulrenin, KevinWard, travisro, JakehellerAI, nowbammedia, REMarketingTips, WSJRealEstate, Chris_Smth, 1000wattbrian.

### us-agent-playbooks — Top

```
(("real estate agent" OR realtor) (playbook OR scripts OR "open house" OR expired OR FSBO OR referrals OR "listing presentation" OR "seller lead" OR strategy OR "door knocking" OR sphere OR database OR "sphere of influence")) lang:en since:YYYY-MM-DD
```

## Intent-reconstructed queries (improve when exact dumps appear)

### ai-real-estate

Focus terms: AI agent, lead response time, CRM automation, phone agent, chatbot realtor, AI listing, workshop lead gap. Prefer English + `since:`.

### ads-imobiliario

Focus terms: Meta ads realtor, Google ads real estate, creative tests, lead gen funnel, CPL, paid social real estate. Expand to 3 days if 24h dry.

### us-housing-market

Focus terms: mortgage rates, existing home sales, inventory, foreclosures, Redfin, NAR housing, buyers vs sellers. Require nominal source for numbers.

### creator-tools

Focus terms: real estate content systems, carousels, short-form, local SEO for agents, newsletters, AI content tools for agents. Drop pure open-house promos and job posts.

## Window policy

- Default: last 24h (`since:` = yesterday UTC).
- If 0 real tweets: retry once with 3 days.
- mentor-benchmark historically expanded to 7 days once after 0 Latest hits — document if used.

## 3-question gate

Promote only if all true:

1. About real-estate / agent operations (not pure generic life advice).
2. Has substance: mechanism, framework, sourced data, tool, or process (not pure motivation).
3. Adaptable to Brazilian agent ops (WhatsApp, CRM, portals, CRECI, referrals) without forced stretch.

## Partial report fields (`X Radar Parcial — <slug>`)

- Data da busca, janela, query, query_type, tweets retornados, qualidade do sinal
- Top sinais (max 3): link/autor/data/métricas, fato, por que importa BR, adaptação {{BRAND}}, risco, formato (carrossel|tweet-image|thread), tipo de modelagem, hook PT-BR
- Ideias acionáveis + próximo passo
- Empty after retries: state explicitly

## Panel close (`📡 Painel Editorial Diário — Radares X · <data>`)

- Cobertura N/6 with all slugs listed
- Fortes / apuração / watchlist
- Decisão recomendada (source-brief / carrossel)
- No external action without Natan approval

## Deliver / ops notes

- Group: `-1003897173723` (Lobo HQ)
- Hot Ideas thread id: capture when known; until then group deliver may land outside the topic
- Durable ledger: `$HERMES_HOME/local/radares/x-exclusion-ledger.json`
- Related non-X radar bootstrap: `/root/.hermes/bin/criar-radares.sh`
