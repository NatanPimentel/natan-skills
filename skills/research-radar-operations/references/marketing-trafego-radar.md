# Runbook: radar de marketing, tráfego e creator-tools

## Ordem obrigatória

1. Obter `now` com ferramenta do sistema e calcular a janela em UTC.
2. Ler o ledger JSON antes de qualquer síntese.
3. Consultar RSS (`feed get stats` e, se houver feeds, `feed get entries --limit 30`). Se `feeds=0`, registrar a lacuna e não importar feeds genéricos.
4. Descobrir candidatos em paralelo com Hound e, se aplicável, Actors Apify de baixo volume.
5. Fazer fetch da página individual de cada candidato. Não usar snippet, roundup ou página de categoria como prova final.
6. Validar data no corpo/metadado, canonical, relevância imobiliária e natureza da evidência.
7. Deduplicar por URL canonical, ID estável e URLs de sindicância do mesmo item.
8. Escrever `ranked-insights.md` e `sources.json`.
9. Validar os artefatos e somente então atualizar o ledger.
10. Persistir os termos literais de recall via `mnemosyne_remember`; se não houver integração exposta, usar `mnemosyne store` e registrar o ID.

## Campos mínimos de `sources.json`

```json
{
  "radar": "marketing-trafego",
  "window": {"start": "...Z", "end": "...Z", "timezone": "UTC"},
  "sources": [
    {
      "id": "stable-id",
      "url": "canonical-url",
      "secondary_urls": [],
      "title": "...",
      "published_at_source": "...",
      "published_at_normalized": "...Z",
      "category": "platform-change|paid-creative|creator-tools|lead-generation",
      "source_type": "primary|secondary|vendor-promotional|community",
      "freshness_verified": true,
      "relevance": "operational consequence for real-estate marketing",
      "evidence_caveat": "..."
    }
  ],
  "excluded_candidates": [],
  "collection": {
    "rss": {"feeds": 0, "unread": 0, "total": 0},
    "apify": {"status": "...", "metrics_used": false},
    "hound": {"status": "completed"}
  },
  "search_terms": [],
  "dedup_added": [],
  "memory_id": "..."
}
```

`dedup_added` deve conter apenas IDs/URLs de itens efetivamente reportados, incluindo URLs secundárias equivalentes quando isso impedir uma repetição futura. Candidatos excluídos ficam documentados em `excluded_candidates`, mas não entram no ledger.

## Evidência e confiança

- **Primária:** changelog, newsroom, help center, documentação oficial ou release original. Pode confirmar mudança, mas números de case continuam sendo auto-relatados se vierem da empresa.
- **Secundária:** reportagem ou análise que ajuda a contextualizar; não deve sustentar sozinha uma mudança de plataforma.
- **Vendor/promocional:** bom para descobrir frameworks e ideias de teste; reduzir confiança e não usar seus benchmarks como prova.
- **Comunitária:** usar para padrão operacional ou dor recorrente, nunca como benchmark quando houver score/tração baixos.

Sempre incluir no item:

- o que aconteceu;
- aplicação operacional;
- `POR QUE IMPORTA` para aquisição, criativo, mensuração, compliance ou produção imobiliária;
- confiança e risco de extrapolação;
- URL individual real.

## Fallback de Actor

Consultar schema e pricing antes do run e limitar resultados. Se o Actor falhar por billing, capacidade, timeout ou indisponibilidade:

- parar retries repetitivos;
- salvar actor, status, dataset/run quando houver;
- declarar que aquela métrica não foi validada;
- continuar com Hound e fontes oficiais equivalentes;
- nunca converter dataset vazio ou snippet em número reportado.

## Recall lexical para marketing/tráfego

Preservar as frases completas usadas na descoberta, além das versões em português. Exemplos reutilizáveis:

- `Meta Ads updates AI creative disclosure July 30 2026`
- `Google Ads update advertiser July 30 2026 creator tools`
- `July 30 2026 creator tool launch AI video social media marketing`
- `July 30 2026 real estate marketing paid traffic`
- `after:2026-07-30 creator advertising`
- `after:2026-07-30 AI video marketing tool`
- `tráfego pago imobiliário`
- `criativo TikTok imobiliário`
- `YouTube creator advertising AI workflow`

Operadores de data ajudam a descobrir, mas nunca substituem a validação do timestamp no artigo individual.

## Silêncio e side effects

Se não houver item simultaneamente novo, relevante e verificável, retornar exatamente `[SILENT]` e não atualizar o ledger com descartes. Pesquisa, escrita de artefato e memória são permitidas no cron; não publicar, agendar, enviar email, alterar CRM ou executar ação externa sem aprovação explícita.
