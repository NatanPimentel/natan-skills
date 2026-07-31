# Cron radar: dedup, evidence e fallback de coleta

Use como complemento ao `SKILL.md` em radares com janela curta (especialmente 24h).

## Pipeline mínimo

1. Capture `from/to` em UTC com `date -u`.
2. Leia o ledger JSON antes da busca; normalize URL removendo tracking quando possível.
3. Rode descoberta em Hound e validação complementar em Apify.
4. Para cada candidato, registre: `id`, URL canônica, data publicada/modificada, tipo de fonte, força do sinal e claim principal.
5. Faça fetch do artigo individual quando a descoberta vier de lista, roundup ou categoria.
6. Descarte itens fora da janela, já reportados, sem data verificável ou promocionais sem corroboração.
7. Salve a síntese e as fontes antes de atualizar o ledger.
8. Valide todos os JSONs; só então acrescente os IDs realmente reportados.
9. Rode a validação semântica pós-persistência para confirmar correspondência entre fontes, `dedup_added` e ledger:

```bash
python3 scripts/validate-radar-artifacts.py \
  --ledger local/radares/<slug>.json \
  --sources local/radares/<slug>/<YYYY-MM-DD>/sources.json \
  --strict-freshness
```

O script verifica IDs únicos, URLs canônicas/secundárias duplicadas, IDs de fontes presentes no ledger e tokens de `dedup_added` representados. Remova `--strict-freshness` quando o radar deliberadamente incluir ferramentas antigas apenas aplicáveis.

## RSS-first e fallback web para radar setorial

Para notícias de um nicho, rode `feed get feeds` e `feed get entries --limit 30` antes do Hound; quando o resultado for vazio, confirme com `feed get stats`. Se `feeds=0`, registre a lacuna e use Hound para complementar. Não importe um OPML genérico durante um cron setorial apenas para simular cobertura dos feeds esperados.

Quando o briefing exigir duas trilhas, execute as duas: **dado/estrutura** e **polêmica/indignação**. Se a segunda não tiver item verificável em 24h, amplie até 72h, marque cada item como fallback de três dias e prefira uma lista menor a uma pauta fraca.

## Deduplicação semântica de republicações

A URL não é suficiente para deduplicar. Compare também entidade, evento, números, data-base e claim principal. Uma mesma divulgação (por exemplo, um levantamento de crédito reproduzido por vários veículos) deve virar **uma pauta**, com a fonte mais forte como primária e as demais listadas apenas como corroborantes. Não acrescente um novo ID para cada republicação.

## Campos mínimos de evidência

Para cada candidato antes da síntese, preserve: `id`, `url_canonical`, `published_at`, `modified_at` quando houver, `fetched_at`, `source_type` (oficial, reportagem, entrevista, associação, promocional), `claim`, `secondary_check`, `track` e `confidence`. Na saída editorial, converta isso em contraste factual, tese operacional, gatilho, risco de 0–10 e fonte real com data/URL.

## Taxonomia de força

- **Alta:** fonte primária ou reportagem confiável com data explícita e produto/alteração verificável.
- **Média:** produto existente com página oficial e aplicação clara, mas sem mudança datada na janela.
- **Baixa:** Reddit, anúncio de freelancer, autopromoção ou thread com score baixo; serve apenas como sinal de demanda/uso.

## Limitações de Actors

Se um Actor retornar `RUNNING`, aguarde/polle até terminal e leia o dataset. Se terminar com billing limit, abortado ou dataset vazio, registre exatamente a limitação. Não extraia tendência de snippets e não invente números.

## Artefatos recomendados

```text
local/radares/<slug>/<YYYY-MM-DD>/ranked-insights.md
local/radares/<slug>/<YYYY-MM-DD>/sources.json
local/radares/<slug>.json
```

`ranked-insights.md` deve conter janela UTC, achados, aplicação prática, confiança, fontes e limitações. `sources.json` deve preservar IDs estáveis, URL secundária quando houver e força do sinal.

## Memória

Persistir termos literais, não só paráfrases. Preferir `mnemosyne_remember`; quando a integração não estiver disponível, usar o CLI local:

```bash
mnemosyne store 'termos literais separados por ponto e vírgula' 'research-radar' 0.75
```

Guardar o ID retornado para auditoria do cron.
