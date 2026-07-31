---
name: multi-publisher
description: >
  Orquestrador genérico de publicação multi-plataforma para Instagram,
  Facebook, LinkedIn, TikTok, Threads e YouTube. Suporta três backends:
  Blotato (SaaS), GoHighLevel (GHL via API/MCP) e Postiz (self-hosted).
  AccountIds e tokens vêm de variáveis de ambiente — uma única skill serve
  qualquer marca ou workspace. Substitui o "blotato-natan-publisher" e
  quaisquer publishers específicos por marca.
version: "1.0.0"
type: orchestrator
categories: [social-media, publishing, multi-platform]
env:
  - PUBLISHER_BACKEND    # blotato | ghl | postiz
  - PUBLISHER_API_KEY    # token do backend escolhido
backend_env:
  blotato: [BLOTATO_API_KEY]
  ghl:     [GHL_API_KEY, GHL_LOCATION_ID]
  postiz:  [POSTIZ_API_KEY, POSTIZ_BASE_URL]
---

# multi-publisher

Wrapper genérico de publicação. **Não depende de marca**: accountIds,
pageIds, tokens e brand voice são todos configurados via `.env` ou
`config.yaml` do profile do aluno.

## Quando usar

- Você tem conteúdo pronto (carrossel, single image, reel) e quer
  publicá-lo em várias plataformas de uma vez.
- Você NÃO quer escrever um publisher diferente pra cada marca que
  atende.

## Backends suportados

| Backend | Quando escolher | Setup |
|---|---|---|
| **Blotato** | Quer simplicidade SaaS, MCP de upload incluso, scheduler robusto. | `PUBLISHER_BACKEND=blotato` + `BLOTATO_API_KEY` |
| **GoHighLevel** | Já é cliente GHL, quer usar workflows existentes, postar via automação. | `PUBLISHER_BACKEND=ghl` + `GHL_API_KEY` + `GHL_LOCATION_ID` |
| **Postiz** | Quer self-hosted, sem mensalidade de SaaS, controle total. | `PUBLISHER_BACKEND=postiz` + `POSTIZ_API_KEY` + `POSTIS_BASE_URL` |

Para trocar de backend, basta mudar `PUBLISHER_BACKEND` no `.env` —
nenhum código precisa mudar.

## Variáveis de ambiente (genéricas, todas as marcas)

```bash
# Plataforma → accountId (preencha os seus)
PUBLISHER_INSTAGRAM_ACCOUNT_ID=
PUBLISHER_FACEBOOK_ACCOUNT_ID=
PUBLISHER_FACEBOOK_PAGE_ID=
PUBLISHER_LINKEDIN_ACCOUNT_ID=
PUBLISHER_LINKEDIN_PAGE_ID=      # opcional — se omitido, posta só no perfil pessoal
PUBLISHER_TIKTOK_ACCOUNT_ID=
PUBLISHER_THREADS_ACCOUNT_ID=

# Configuração opcional de marca
PUBLISHER_BRAND_NAME=            # ex: "Imobiturbo"
PUBLISHER_BRAND_HANDLE=          # ex: "@suaempresa"
```

## Uso

```bash
node --env-file=.env skills/multi-publisher/scripts/publish.mjs \
  <agenda.json> <scheduledTime|now> [--dry-run] [--mode=carousel|single-image]
```

## Modos

- `carousel` (default) — 5-6 destinos, espera N imagens.
- `single-image` — 1 imagem, pula TikTok (exige ≥2) e cai pra reels onde
  aplicável.

## Adapters

Cada backend implementa `publish(platform, payload)` em
`scripts/backends/{blotato,ghl,postiz}.mjs`. Para adicionar um quarto
backend, basta criar um novo adapter e adicioná-lo ao dispatcher em
`scripts/publish.mjs`.

## Comparativo rápido

| Capacidade | Blotato | GHL | Postiz |
|---|---|---|---|
| Upload via MCP | ✓ | parcial | ✓ |
| Agendamento | ✓ | via workflow | ✓ |
| Multi-plataforma nativa | ✓ | só Meta | ✓ |
| Open-source | ✗ | ✗ | ✓ |
| Self-hosted | ✗ | ✗ | ✓ |
| Custo mensal | plano | plano SaaS | grátis (self-host) |
| Privacidade | hospedado | hospedado | local |

## Para contas com **duas presenças no LinkedIn** (pessoal + página)

Defina **ambos** `PUBLISHER_LINKEDIN_ACCOUNT_ID` e
`PUBLISHER_LINKEDIN_PAGE_ID`. A skill posta nas duas em sequência,
igual ao comportamento do publisher antigo do Natan.

## Dry-run

`--dry-run` imprime os payloads que seriam enviados sem fazer POST
real — útil pra debugar copy e validar configuração antes de gastar
crédito.