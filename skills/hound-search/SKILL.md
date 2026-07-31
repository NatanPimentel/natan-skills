---
name: hound-search
description: >
  Self-hosted web search + page fetch via the Hound MCP server (hound-mcp on PyPI).
  Free, no API key required, anti-bot bypass built in. Replaces the brave-search
  skill for these crons, since the `bx` CLI it depends on is NOT installed on this VPS.
description_pt-BR: >
  Busca web e fetch de páginas self-hosted via o servidor MCP Hound (hound-mcp no PyPI).
  Gratuito, sem chave de API, com bypass de anti-bot embutido. Substitui a skill
  brave-search nestes crons, pois o CLI `bx` do qual ela depende NÃO está instalado neste VPS.
type: script
version: "1.0.0"
env: []
categories: [research, scraping, web-search, content-discovery]
---

# Hound Search — self-hosted web research

## Por que essa skill existe

A skill `brave-search` (CLI `bx`) documenta um binário que **não está instalado**
neste VPS (`which bx` → not found), mesmo havendo `BRAVE_SEARCH_API_KEY` no `.env`.
Qualquer cron que dependa de `bx` vai falhar ou o agente vai improvisar.

Em vez disso, já existe instalado e testado neste VPS um servidor MCP próprio:
**Hound** (`hound-mcp` v12.4.1, pacote PyPI, "$0 forever", sem chave obrigatória).
Ele agrega múltiplos motores de busca públicos (duckduckgo, yahoo, yandex, brave
entre outros) e faz fetch de página com bypass de anti-bot (patchright/stealth).

## Onde ele está

Instalado dentro de uma venv Python dedicada — **não está no PATH global**:

```
/root/.hermes/profiles/natan/local/master-fetch-test/venv/
```

O binário `hound` roda só como servidor MCP (stdio ou `--http`), não tem modo
CLI de um-comando-só. Por isso esta skill inclui um wrapper Bash-friendly.

## Como usar (via o wrapper)

```bash
VENV_PY=/root/.hermes/profiles/natan/local/master-fetch-test/venv/bin/python3
WRAPPER=/root/.hermes/profiles/natan/skills/hound-search/scripts/hound_client.py

# Busca web
$VENV_PY $WRAPPER mcp_smart_search '{"query": "taxa Selic mercado imobiliario 2026", "num_results": 5}'

# Fetch de uma página específica (markdown extraído, com anti-bot bypass)
$VENV_PY $WRAPPER mcp_smart_fetch '{"url": "https://exame.com/"}'

# Crawl de um domínio/seção (múltiplas páginas)
$VENV_PY $WRAPPER mcp_smart_crawl '{"url": "https://www.imobireport.com.br/", "max_pages": 5}'

# Screenshot de uma página
$VENV_PY $WRAPPER mcp_screenshot '{"url": "https://exame.com/"}'
```

Cada chamada imprime um JSON em stdout (stderr pode ter um warning inofensivo
de cleanup do patchright — `TargetClosedError` — ignore).

## Tools disponíveis (via MCP)

| Tool | Uso |
|---|---|
| `mcp_smart_search` | Busca web multi-engine. Args: `query`, `num_results` |
| `mcp_smart_fetch` | Fetch de uma URL, extrai markdown limpo. Args: `url` |
| `mcp_smart_crawl` | Crawl de várias páginas a partir de uma URL. Args: `url`, `max_pages` |
| `mcp_screenshot` | Screenshot de uma página. Args: `url` |
| `version` | Versão instalada / update disponível |
| `cache_clear` | Limpa cache local de fetch |

## Notas

- `mcp_smart_fetch` retorna `403`/bloqueio em alguns sites com proteção agressiva
  (ex: Reddit sem login) — trate como fonte indisponível, não force retry infinito.
- Timeout default do wrapper é 90s; páginas pesadas podem estourar — reduza escopo
  (usar `mcp_smart_fetch` em vez de `mcp_smart_crawl` largo) se acontecer.
- Resultados de busca já vêm com `relevance_score` e `source` (motor de origem) —
  use isso para priorizar antes de fazer fetch completo.
- Se `hound` reportar versão desatualizada, rodar `hound -u` dentro da venv
  (não é necessário para uso normal).
