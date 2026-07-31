# natan-skills

Bundle de skills para [Hermes Agent](https://hermes-agent.nousresearch.com) que
automatiza produção de carrosséis Instagram + scanner de pautas (radar).
25 skills genéricas, sem marca específica — você configura os próprios
accountIds, tokens e handles.

## Instalação rápida (3 comandos)

```bash
# 1. Instale o Hermes (se ainda não tem)
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

# 2. Adicione este repo como fonte de skills
hermes skills tap add natanpimentel/natan-skills

# 3. Instale o bundle completo
hermes skills install imobiturbo-starter
```

## Pré-requisitos

| Requisito | Por quê |
|---|---|
| [Hermes Agent](https://hermes-agent.nousresearch.com) instalado | Runtime de skills |
| Node.js 18+ | Skills de renderização e publicação |
| Python 3.10+ | Skills de transcrição e scraping |
| Playwright (`npx playwright install`) | Renderização de slides |
| Conta no Blotato, GoHighLevel ou Postiz | Publicação multi-plataforma |
| Chave AssemblyAI | Transcrição de VSLs e vídeos |
| Chave xAI (Grok) | Radar de X/Twitter |

## Configuração (.env)

Copie `.env.example` para `~/.hermes/profiles/<seu-profile>/.env` e preencha:

```bash
# ── Publicação (escolha UM backend) ────────────────────
PUBLISHER_BACKEND=blotato          # blotato | ghl | postiz

# Blotato
BLOTATO_API_KEY=

# GoHighLevel
GHL_API_KEY=
GHL_LOCATION_ID=

# Postiz (self-hosted)
POSTIZ_API_KEY=
POSTIZ_BASE_URL=

# ── Account IDs (preencha os seus) ─────────────────────
PUBLISHER_INSTAGRAM_ACCOUNT_ID=
PUBLISHER_FACEBOOK_ACCOUNT_ID=
PUBLISHER_FACEBOOK_PAGE_ID=
PUBLISHER_LINKEDIN_ACCOUNT_ID=
PUBLISHER_LINKEDIN_PAGE_ID=        # opcional — duplo se preenchido
PUBLISHER_TIKTOK_ACCOUNT_ID=
PUBLISHER_THREADS_ACCOUNT_ID=

# ── Marca (opcional) ────────────────────────────────────
PUBLISHER_BRAND_NAME=              # ex: "Minha Imobiliária"
PUBLISHER_BRAND_HANDLE=            # ex: "@minhaempresa"

# ── Transcrição ─────────────────────────────────────────
ASSEMBLYAI_API_KEY=

# ── Radar de X/Twitter ──────────────────────────────────
XAI_API_KEY=
```

## Skills incluídas (25)

### Pipeline de carrossel
| Skill | Função |
|---|---|
| `instagram-carousel-batch` | Orquestra 3 carrosséis em paralelo (30 slides) |
| `carousel-renderer` | Renderiza 10 slides JPG 1080×1350 via Playwright |
| `carousel-visual-qa` | Revisão de legibilidade dos slides |
| `template-designer` | Templates visuais reutilizáveis |

### Curadoria e editorial
| Skill | Função |
|---|---|
| `editorial-curation-anti-dup` | Puxa pautas não-usadas com anti-dup rigoroso |
| `editorial-package` | Pacote editorial completo (copy, spine, captions) |
| `publishing-readiness` | Prepara captions e valida release |
| `content-release` | Finalização e agendamento |

### Copy e hooks
| Skill | Função |
|---|---|
| `viral-hook-creator` | 19 padrões psicológicos de gancho |
| `viral-hooks` | Aberturas, thumbnails e scroll-stoppers |

### Geração de imagem
| Skill | Função |
|---|---|
| `image-gen` | Orquestrador: GPT Image 2 → Nano Banana (fallback) |
| `image-creator` | HTML/CSS → PNG via Playwright |
| `image-fetcher` | Busca visual de múltiplas fontes |

### Stock photos
| Skill | Função |
|---|---|
| `pexels-fetcher` | Fotos Pexels (portrait) |
| `pixabay-fetcher` | Fotos Pixabay (vertical) |
| `unsplash-fetcher` | Fotos Unsplash (portrait) |

### Publicação
| Skill | Função |
|---|---|
| `multi-publisher` | Blotato / GoHighLevel / Postiz (3 backends, via env) |

### Scanner de pautas (radar)
| Skill | Função |
|---|---|
| `content-radar-x` | Radar de X/Twitter via xAI |
| `research-radar-operations` | Operação de radares multi-fonte |
| `research-freshness-validation` | Validação de janela temporal |

### Pesquisa e scraping
| Skill | Função |
|---|---|
| `hound-search` | Web search self-hosted (sem API key) |
| `apify` | Scraping e automação via Apify Store |

### Transcrição
| Skill | Função |
|---|---|
| `audio-video-transcription` | VSLs, vídeos, áudio via AssemblyAI |

### Outros
| Skill | Função |
|---|---|
| `asset-bank` | Banco de imagens reutilizáveis |
| `viciante` | Arquiteta produtos digitais (R$297-997) |
| `resend` | Email transacional (newsletter opcional) |

## Como usar

### Produzir 3 carrosséis

```
# No chat do Hermes:
"Quero 3 carrosséis sobre [tema]. Usa o bundle imobiturbo-starter."
```

O pipeline roda 6 phases com checkpoints:
1. Setup + insumos
2. 18 ângulos → escolha de 3
3. Headlines + copy (60 headlines)
4. Capas + visuais + story-reels
5. Batch review (3 carrosséis lado a lado)
6. Publicação multi-plataforma

### Scanner de pautas (radar)

```bash
# Criar um cron job que roda todo dia às 9h
hermes cron create "0 9 * * *" "Rode o radar de pautas sobre [tema] e me entregue as 5 melhores"
```

### Transcrever uma VSL

```
# No chat do Hermes:
"Transcreve este vídeo" + anexe o arquivo
```

A skill `audio-video-transcription` envia direto para a AssemblyAI e
retorna a transcrição completa com timestamps.

## Trocar de backend de publicação

Mude uma linha no `.env`:

```bash
# De Blotato para Postiz (self-hosted, sem mensalidade):
PUBLISHER_BACKEND=postiz
POSTIZ_API_KEY=sua-chave
POSTIZ_BASE_URL=https://postiz.suaempresa.com
```

Nenhum código precisa mudar — o `multi-publisher` despacha para o
backend correto automaticamente.

## Estrutura do repo

```
natan-skills/
├── README.md
├── LICENSE                          # MIT
├── .gitignore
├── bundles/
│   └── imobiturbo-starter.yaml      # bundle description
└── skills/
    ├── instagram-carousel-batch/
    ├── carousel-renderer/
    ├── multi-publisher/
    │   └── scripts/
    │       ├── publish.mjs          # dispatcher
    │       └── backends/
    │           ├── blotato.mjs
    │           ├── ghl.mjs
    │           └── postiz.mjs
    ├── editorial-curation-anti-dup/
    ├── ... (22 outras skills)
    └── resend/
```

## Licença

MIT — use, modifique, distribua livremente.