# Template do workbook em markdown

Esse é o template do output final que a skill entrega como artifact. Substituir TODOS os `{{...}}` pelas respostas coletadas durante a conversa. Adaptar número de aulas conforme estrutura definida na Etapa 4.

**IMPORTANTE:** após cada placeholder de imagem, colar o prompt correspondente em um bloco de código pra o usuário gerar a imagem fora.

---

## Estrutura do template

```markdown
# {{NOME_DO_PRODUTO}}

**{{SUBTITULO_DO_PRODUTO}}**

{{N}} aulas. Uma tarde. Um produto arquitetado.

Fatia definida. Estrutura pronta. Loop desenhado. Data marcada.

*{{NOME_DO_AUTOR}}*

---

![CAPA — substituir pelo PNG gerado](capa-{{slug-produto}}.png)

> **Prompt pra gerar essa imagem:**
> ```
> {{PROMPT_CAPA}}
> ```

---

## Sumário

- [Intro · {{TITULO_INTRO}}](#intro)
- [Aula 1 · {{TITULO_AULA_1}}](#aula-1)
- [Aula 2 · {{TITULO_AULA_2}}](#aula-2)
- [Aula 3 · {{TITULO_AULA_3}}](#aula-3) ★ Primeira vitória
- ... (continuar até Aula N)

---

# Intro · {{TITULO_INTRO}}

{{TEXTO_INTRO}}

> {{FRASE_DE_DESTAQUE_INTRO}}

## O que esse workbook vai resolver

{{N}} aulas curtas pra você sair com um produto arquitetado no papel:

→ {{ENTREGA_1}}
→ {{ENTREGA_2}}
→ {{ENTREGA_3}}
→ {{ENTREGA_4}}

> [!warning] ERRO A EVITAR
> {{ERRO_A_EVITAR_INTRO}}

---

# Aula 1 · {{TITULO_AULA_1}}

{{INTRODUCAO_CENA_AULA_1}}

> {{FRASE_DE_DESTAQUE_AULA_1}}

[Se Aula 1 tem framework visual, inserir abaixo:]

![{{NOME_FRAMEWORK_AULA_1}} — substituir pelo PNG gerado](aula1-{{slug-framework}}.png)

> **Prompt pra gerar essa imagem:**
> ```
> {{PROMPT_AULA_1}}
> ```

## Contexto

{{CONTEXTO_AULA_1}}

## Aplicação prática

{{APLICACAO_AULA_1}}

## Instruções

{{INSTRUCOES_AULA_1}}

> [!warning] ERRO A EVITAR
> {{ERRO_A_EVITAR_AULA_1}}

---

# Aula 2 · {{TITULO_AULA_2}}

[mesma estrutura de blocos: Introdução / Objeto / Contexto / Aplicação / Instruções / Erro a evitar]

[se tem framework visual: placeholder + prompt em bloco de código]

---

# Aula 3 · {{TITULO_AULA_3}}

> ★ **PRIMEIRA VITÓRIA.** {{DESCRICAO_VITORIA}}

[mesma estrutura]

---

[continuar pra todas as aulas até N]

---

# Próximo passo

## {{TITULO_PROXIMO_PASSO}}

{{TEXTO_PROXIMO_PASSO}}

> [Adapte essa frase pro teu contexto — exemplo:] Se você já tentou estruturar produto antes e travou, isso aqui não é mais conteúdo. É ambiente de execução. Faz o exercício da Aula 1 antes de fechar essa página.

## Se você quer o sistema inteiro

{{TEXTO_SISTEMA_INTEIRO}}

*{{ASSINATURA_FINAL}}*
```

---

## Estrutura por aula (template detalhado)

Pra cada aula, inserir:

```markdown
# Aula {{N}} · {{TITULO_DA_AULA}}

[Bloco 1 — INTRODUÇÃO]
{{CENA_DE_ABERTURA}}

> {{FRASE_DE_DESTAQUE}}

[Bloco 4 — APLICAÇÃO PRÁTICA: framework visual + tabela/exemplo]

![{{NOME_FRAMEWORK}} — substituir pelo PNG gerado](aula{{N}}-{{slug}}.png)

> **Prompt pra gerar essa imagem:**
> ```
> {{PROMPT_DA_IMAGEM}}
> ```

[Bloco 2 — OBJETO DA AULA]
{{FRASE_OBJETO}}

[Bloco 3 — CONTEXTO]
{{TEXTO_CONTEXTO}}

[Bloco 4 — APLICAÇÃO PRÁTICA: tabela ou texto explicativo do framework]
{{TEXTO_APLICACAO}}

| {{COLUNA_1}} | {{COLUNA_2}} |
|---|---|
| {{LINHA_1_COL_1}} | {{LINHA_1_COL_2}} |
| {{LINHA_2_COL_1}} | {{LINHA_2_COL_2}} |

[Bloco 5 — INSTRUÇÕES]
{{TEXTO_INSTRUCOES_PRATICAS}}

> [!warning] ERRO A EVITAR
> {{ERRO_A_EVITAR_AULA}}
```

---

## Aulas canônicas (sugestão de estrutura completa de 8 aulas)

Quando o usuário pede sugestão de aulas, ofereça essa estrutura como ponto de partida:

| Aula | Função | Tem framework visual? |
|---|---|---|
| Intro | Estabelecer a tese e o problema | Sim (gráfico/visualização da dor) |
| 1 | Conceito core / distinção fundamental | Sim (fluxo, tabela ou diagrama) |
| 2 | Ferramenta de descoberta/mapeamento | Sim (grid de opções) |
| 3 | Validação ★ primeira vitória | Sim (3-4 testes/critérios) |
| 4 | Arquitetura / estrutura macro | Sim (esqueleto do produto) |
| 5 | Como executar (estrutura micro) | Sim (roteiro/etapas) |
| 6 | Erros a evitar | Sim (3 erros com X) |
| 7 | Loop / próximo passo / catálogo | Sim (3 caminhos de saída) |
| 8 | Ritmo de produção e métricas | Sim (ciclo + métricas) |

Adaptar conforme o produto. Aulas 1-3 são o core. Aulas 4-5 são arquitetura. Aulas 6-8 são execução. Pode cortar se o produto for menor que 8 aulas — manter Aulas 1, 3, 4, 5 no mínimo.

---

## Frase final pra entregar com o artifact

```
Workbook arquitetado. Próximos passos pra ti:

1. Baixa o markdown deste artifact
2. Pega cada bloco de prompt de imagem e cola no Gemini, Midjourney ou DALL-E
3. Salva o PNG gerado e substitui o placeholder no markdown
4. Sobe a pasta (markdown + PNGs) no Notion, Obsidian Publish, GitBook, ou onde tu publica

Em 3 dias tu tem produto no ar. Bora.
```
