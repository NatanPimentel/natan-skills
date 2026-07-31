---
name: research-radar-operations
description: Use when running time-bounded multi-source research radars. Validate freshness, cost, deduplication, and evidence before reporting.
---

# Research Radar Operations

## Quando usar

Use para radares recorrentes de notícias, ferramentas e tendências em que a pesquisa precisa respeitar uma janela temporal, evitar repetição e produzir um relatório auditável.

## Procedimento

1. Leia o arquivo de deduplicação antes de pesquisar. Compare por URL canônica e por ID estável; descarte itens já reportados.
2. Pesquise em paralelo em fontes complementares. Use busca web para descoberta e fetch para validar o texto; use Actors apenas quando o custo e o schema estiverem claros.
3. Para Google Trends, use os valores de janela aceitos pela API: `now 1-H`, `now 4-H`, `now 1-d` ou `now 7-d`. Para 24 horas, use `now 1-d`; não invente `past24Hours`.
4. Depois de iniciar um Actor, consulte o run e o dataset. Só sintetize métricas quando houver itens reais.
5. Se um Actor ficar preso em crawling sem dados, aborte pelo endpoint `/v2/actor-runs/RUN_ID/abort`, registre ID, status, dataset e custo, e declare que a métrica não foi validada. Nunca substitua dataset vazio por números inferidos de snippets.
6. Diferencie no relatório: notícia dentro da janela, sinal recente corroborado e ferramenta mais antiga que é apenas aplicável.
7. Se uma página bloquear o fetch, reduza a confiança e corrobore em fonte secundária. Snippet de busca não é confirmação oficial.
8. Sintetize padrões e aplicações práticas para o público-alvo; não copie linguagem de posts nem escreva/publice em canais proibidos.
9. Escreva o artefato bruto/síntese, atualize o dedup apenas com itens realmente reportados e valide o JSON antes da entrega.
10. Salve termos de busca úteis na memória durável disponível e reporte o identificador da memória quando houver.
11. Em radares de notícias setoriais, comece pelos RSS cadastrados (`feed get entries --limit 30`) e use busca/fetch web para completar lacunas; não marque entradas como lidas.
12. Se `feed get stats` mostrar `feeds 0`, registre que o RSS não cobriu a janela e faça a complementação web; não invente entradas nem importe um starter set automaticamente durante um cron cujo briefing pressupõe feeds já cadastrados.
13. Quando o briefing exigir duas trilhas, execute ambas explicitamente: dado/estrutura e polêmica/indignação. Se a segunda estiver seca em 24h, amplie até 3 dias, declare a ampliação e não force uma pauta fraca.
14. Se o briefing limitar o número de ângulos, trate o limite como global entre trilhas. Para cada ângulo entregue contraste factual, tese do cliente, tipo de gatilho e risco de 0–10; não entregue apenas uma lista de notícias.
15. Se o ledger privado não existir, inicialize-o como lista JSON vazia; após o relatório, acrescente somente IDs/URLs realmente reportados, preservando o histórico e validando o JSON.
16. Para claims numéricos ou casos extremos, diferencie fonte primária, reportagem secundária e declaração institucional; reduza a confiança e aumente a nota de risco quando o número vier da própria empresa ou de conteúdo promocional.
17. Em janela de 24h, uma busca com termos como `latest` pode retornar páginas antigas atualizadas ou republicadas. Exija data explícita no corpo/metadado da página; snippets como “20 hours ago” são pista para descoberta, não prova suficiente sem validação do texto.
18. Quando um fetch Hound retornar uma página de lista, use-a somente para descobrir títulos e horários; localize e faça fetch do artigo individual antes de usar números ou claims como evidência. Se o artigo individual revelar data fora da janela, rotule-o como fallback de 3 dias ou descarte-o.
16. Quando o fetcher web principal não conseguir extrair a página, tente uma fonte oficial equivalente (changelog, newsroom, help center ou blog de produto) e/ou o Apify RAG Web Browser. Para o Apify RAG, aguarde o run até `SUCCEEDED`, leia o dataset e examine `searchResult.url`, `metadata.url`, título e texto; não reporte apenas o status inicial `RUNNING`.
17. Quando o Hound retornar erro de executável Playwright/Chromium ausente, trate como bootstrap recuperável: instale o navegador na mesma venv (`VENV_PY -m patchright install chromium`), repita a busca/fetch e só então classifique a fonte como indisponível. Não transforme o erro transitório em ausência de resultados.
18. Para uma pauta de marketing imobiliário, filtre a pesquisa por impacto operacional concreto: aquisição de leads, qualidade de clique, mensuração, criativo, compliance ou ferramentas de produção. Uma notícia geral de infraestrutura/IA da plataforma só entra se houver consequência clara para esse trabalho.
18. Se a coleta não encontrar novidades suficientemente verificadas, prefira um relatório curto dizendo que não há sinal acionável na janela — ou o marcador `[SILENT]` quando o contrato do cron exigir — em vez de preencher com mudanças de semanas anteriores.
19. Operadores de data como `after:` são úteis para descoberta, mas não garantem recência: valide a data no corpo/metadado do artigo individual. Um roundup “atualizado ontem” sem mudança concreta identificável não é achado novo.
20. Trate páginas de tracker comercial, posts de LinkedIn e conteúdo de ferramenta como fontes secundárias/promocionais: só reporte uma mudança de Meta/Google/TikTok quando houver confirmação primária ou rotule explicitamente como sinal não confirmado. Reddit com score 1, subreddit autopromocional ou texto de venda não passa o filtro editorial.
21. Para cron com contrato de silêncio, a saída deve ser exatamente `[SILENT]` — sem justificativa, fontes ou nota de limitação — quando não houver item simultaneamente novo, relevante e verificável. Não atualize o dedup com itens descartados.
22. Preserve as frases literais usadas na busca (por exemplo, `Meta Ads updates AI creative disclosure July 29 2026`, `Google Ads update advertiser July 29 2026 creator tools`, `July 29 2026 creator tool launch AI video social media marketing`) na memória de recall, além das traduções em português; paráfrases podem falhar no portão lexical.
23. Para radares com arquivo dedup em JSON, leia-o antes de qualquer síntese e compare tanto a URL canônica quanto IDs alternativos/URLs secundárias. Só acrescente novos IDs depois de salvar e validar `ranked-insights.md` e `sources.json`; nunca marque como lido um item apenas descoberto e descartado.
24. Em sinais comunitários de score baixo, reporte no máximo o padrão operacional observado e rotule a força como baixa; não transforme anúncio de freelancer, autopromoção ou thread sem tração em case, benchmark ou evidência de adoção.
25. Se o Actor de tendências atingir limite de billing/ciclo, registre o status como limitação de coleta e prossiga com fontes web/primárias disponíveis. Não faça retry infinito, não infira números de um dataset vazio e não substitua a falha por snippets.
26. Quando a integração `mnemosyne_remember` não estiver exposta como ferramenta, use o CLI local `mnemosyne store <content> <source> <importance>` para persistir os termos literais de busca; confirme o ID retornado no relatório.

## Lições operacionais adicionais

- Em cron de radar setorial, faça a ordem **RSS → dedup → busca Hound → fetch individual → síntese → atualização do ledger**. Mesmo quando `feed get feeds` retorna zero, registre a lacuna e use a busca web apenas como complemento; não importe feeds genéricos para mascarar a ausência dos feeds editoriais esperados.
- Para a janela de 24h, confirme a data no corpo/metadado do artigo individual. Resultados com “1 day ago”, páginas de categoria e roundups atualizados não são evidência suficiente. Se a trilha de polêmica só render material fraco, amplie para três dias e declare a ampliação.
- A saída deve ser no máximo o limite global de ângulos solicitado, misturando trilhas. Cada item precisa de contraste factual, tese operacional, gatilho, risco 0–10 e URL real; atribua números à empresa quando não houver auditoria independente.
- Ao chamar o wrapper Hound via shell, construa o argumento JSON com `json.dumps`/Python ou escape rigorosamente aspas internas. Um payload malformado falha antes da busca e não deve ser interpretado como ausência de resultados.
- Depois de escrever o ledger JSON, valide sintaxe, campos obrigatórios e unicidade de IDs/URLs. Não acrescente itens descartados por deduplicação, baixa recência ou evidência insuficiente.

## Extensão operacional — radar de marketing, tráfego e creator-tools

Para radares de marketing imobiliário com janela estrita de 24 horas:

1. **Fixe o corte com relógio real em UTC.** Leia o ledger antes da busca, consulte `feed get stats` e registre quando `feeds=0`; nesse caso, trate RSS como lacuna de cobertura e complemente com Hound, sem importar um starter set.
2. **Separe descoberta de evidência.** Use Hound para descoberta, mas faça `mcp_smart_fetch` na página individual antes de usar qualquer claim. Uma página de lista/roundup serve para localizar títulos e horários, não para provar números. Valide `published_time`, `modified_time`, canonical e o conteúdo; `after:` e rótulos relativos são apenas pistas.
3. **Priorize consequência operacional.** Retenha apenas itens que alterem aquisição de leads, qualidade de clique, mensuração, criativo, compliance ou produção de conteúdo para corretor. Mudança geral de IA só entra se houver efeito concreto no trabalho imobiliário.
4. **Classifique a natureza da fonte.** Release oficial/changelog/newsroom é evidência primária; case de empresa e press release com métricas próprias devem ser rotulados como auto-relatados; guia de fornecedor é hipótese tática/editorial, nunca benchmark independente. Para este último, extraia o framework e reduza confiança/eleve risco.
5. **Para cada achado, entregue aplicação e `POR QUE IMPORTA`.** Em criativo pago, prefira hipóteses testáveis (por exemplo, variar estrutura de hook mantendo corpo/oferta constantes) e métricas a observar (retenção inicial, CTR e qualidade do lead), sem transformar a recomendação em copy para canal proibido.
6. **Trate Actors como coleta condicionada, não como obrigação de inventar dados.** Antes de executar, consulte schema e pricing e use limites baixos. Se a chamada retornar limite de billing, erro de capacidade ou indisponibilidade do servidor, interrompa retries, registre actor/status e prossiga com fontes web; nunca substitua dataset ausente por snippets ou números inferidos.
7. **Atualize o dedup somente depois dos artefatos.** Salve e valide `ranked-insights.md` e `sources.json` primeiro. Depois acrescente o ID estável, URL canonical e, quando houver sindicância/republicação do mesmo item, URLs secundárias equivalentes. Não acrescente candidatos descartados por recência, duplicidade ou evidência fraca.
8. **Faça a entrega auditável.** Valide JSON, unicidade do ledger e correspondência entre `dedup_added` e o relatório. Se `mnemosyne_remember` não estiver exposto, use `mnemosyne store` com as frases literais de busca e informe o ID retornado. Registre limitações de RSS/Actors sem declarar a coleta completa quando ela não foi.

A receita detalhada e os campos recomendados estão em `references/marketing-trafego-radar.md`.

## Formato de saída

Use português do Brasil e estrutura densa: janela pesquisada, achados ranqueados, aplicação prática, confiança, fontes, limitações da coleta, artefatos salvos e status do dedup. Não oculte falhas de coleta ou custos. Não oculte falhas de coleta ou custos.

## Armadilhas

- Não confundir `startedAt` com resultado concluído: o run pode retornar `READY` e passar a `RUNNING` depois.
- Não esperar indefinidamente um Actor caro ou bloqueado.
- Não apresentar uma ferramenta antiga como lançamento da janela atual.
- Não marcar como lido um item descartado por baixa relevância ou evidência insuficiente.
- Não prometer execução de publicação, CRM, email ou agendamento sem aprovação explícita.

## Referência

Para o runbook de execução e o incidente de schema/crawling observado em uma coleta real, veja `references/apify-freshness-and-abort.md`.

Para validar sintaxe e invariantes dos artefatos depois de salvar o radar, use `scripts/validate-radar-artifacts.py` (detalhes em `references/cron-dedup-and-evidence.md`).
