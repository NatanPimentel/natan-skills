# Prompts canônicos das imagens dos frameworks

11 prompts no estilo desenhado-à-mão preto-e-branco. O usuário vai gerar cada uma fora (Gemini Nano Banana Pro recomendado, Midjourney ou DALL-E também funcionam) e plugar no markdown.

**Instrução geral pra colocar no topo do bloco de prompts no output:**

> Cada prompt abaixo gera UMA imagem no estilo desenhado-à-mão marker preto-e-branco. Cola o prompt num gerador de imagem (Gemini, Midjourney, DALL-E), gera, salva o PNG, e substitui o placeholder no markdown pelo arquivo gerado. Aspect ratio recomendado: 16:9 (paisagem).

---

## Estilo base — usar em TODOS os prompts

Anexar essa instrução no fim de cada prompt:

```
STYLE: hand-drawn marker illustration. Pure black ink on pure white background. NO color. Bold handwritten uppercase title. Italic lowercase subtitle. Hand-drawn rectangular boxes with slightly imperfect corners. Solid black filled-triangle arrows between elements. Hand-drawn icons where indicated. Lowercase handwritten captions. Aspect ratio horizontal landscape (16:9). Render every word EXACTLY as specified, including accents. No watermarks, no logos, clean composition.
```

---

## Prompt 01 · CAPA do workbook

```
Hand-drawn marker illustration cover page.
Top: small handwritten label "WORKBOOK" in plain uppercase.
Below it, MASSIVE bold hand-drawn title "{{NOME_DO_PRODUTO}}" occupying most of the width, in marker handwriting style.
Below the title: a single horizontal hand-drawn line separator.
Under the line: handwritten italic lowercase subtitle "{{SUBTITULO_DO_PRODUTO}}".
Lots of vertical breathing room.
Near the bottom, in handwritten lowercase smaller text: "{{N}} aulas. uma tarde. um produto arquitetado."
Below that, even smaller: "by {{NOME_DO_AUTOR}}"
[STYLE]
```

---

## Prompt 02 · INTRO — Gráfico do consumo morrendo

(Use só se o produto fala de problema de consumo / LTV / cliente que não volta. Senão pula.)

```
Hand-drawn bar chart in marker style.
Title at top (handwritten bold uppercase): "QUANDO O CONSUMO MORRE".
Subtitle below (italic lowercase): "{{CONTEXTO_DO_GRAFICO}} — exemplo: curso de 60 aulas, consumo despenca pra zero em duas semanas".
Four horizontal bars stacked vertically, decreasing in length:
Bar 1 labeled "{{LABEL_1}}" on the left, very long filled bar, with "{{VALOR_1}}" at the right end.
Bar 2 labeled "{{LABEL_2}}", medium bar, "{{VALOR_2}}".
Bar 3 labeled "{{LABEL_3}}", tiny bar, "{{VALOR_3}}".
Bar 4 labeled "{{LABEL_4}}", dotted/dashed empty rectangle, "ZERO".
[STYLE]
```

---

## Prompt 03 · AULA 1 — Programa principal vs fatias (fluxo A → B)

```
Hand-drawn flowchart in marker style.
Title at top (bold uppercase): "PROGRAMA PRINCIPAL VS FATIAS".
Subtitle below (italic lowercase): "a seta inteira é o programa. cada obstáculo é uma fatia."
Five hand-drawn rectangular boxes in a horizontal row, connected by solid black filled-triangle arrows pointing right:
Box 1 (filled black with white text): "PONTO A".
Box 2 (white with black border): "OBST. 1".
Box 3 (white with black border): "OBST. 2".
Box 4 (white with black border): "OBST. 3".
Box 5 (filled black with white text): "PONTO B".
Below the row, a hand-drawn underbrace spanning the entire row, labeled "programa principal" in handwritten lowercase.
Above each obstacle box, small downward arrows with the word "fatia" in lowercase.
[STYLE]
```

---

## Prompt 04 · AULA 2 — Os 4 sinais

```
Hand-drawn 2x2 grid in marker style.
Title at top (bold uppercase): "OS 4 SINAIS DA FATIA QUE VENDE".
Subtitle below (italic lowercase): "fatia que aparece em 3 ou 4 sinais é quase certeza de venda."
Four hand-drawn rectangular boxes in a 2x2 grid:
Top-left: large bold "01" then "ONBOARDING" then small "as respostas de entrada do programa principal".
Top-right: "02" "MENTORIA" "perguntas que se repetem em 3+ calls".
Bottom-left: "03" "APLICAÇÃO" "objeções de quem aplicou e não fechou".
Bottom-right: "04" "CAIXINHA" "dúvidas reais com as palavras do público".
Solid black arrows connecting boxes in clockwise flow.
[STYLE]
```

---

## Prompt 05 · AULA 3 — Os 3 testes

```
Hand-drawn 3-column layout in marker style.
Title at top (bold uppercase): "OS 3 TESTES DA FATIA BOA".
Subtitle below (italic lowercase): "falhou em 1, não é fatia. é versão encolhida."
Three hand-drawn rectangular boxes in a horizontal row, connected by solid black filled-triangle arrows:
Box 1: bold "TESTE 01" on top, then "RESOLVE UMA COISA?", then smaller "consegue dizer em 1 frase?".
Box 2: bold "TESTE 02", then "NÃO CANIBALIZA?", then "cliente ainda quer o programa principal?".
Box 3: bold "TESTE 03", then "AVANÇADO COMPRARIA?", then "quem já tá dentro teria interesse?".
[STYLE]
```

---

## Prompt 06 · AULA 4 — Esqueleto do produto (★ primeira vitória)

```
Hand-drawn product skeleton diagram in marker style.
Title at top (bold uppercase): "ARQUITETURA DA VITÓRIA".
Subtitle below (italic lowercase): "primeira vitória antes da metade do produto."
{{N}} hand-drawn small rectangular boxes in a horizontal row, evenly spaced:
Box 1: "AULA 1". Box 2: "AULA 2". {...continue até N}
Box {{POSICAO_VITORIA}} HIGHLIGHTED with thick double border and a hand-drawn star ★ on top: "AULA {{POSICAO_VITORIA}}".
Below the highlighted box, in handwritten bold: "PRIMEIRA VITÓRIA".
Below the entire row, a hand-drawn underbrace labeled "antes da metade" in handwriting.
[STYLE]
```

---

## Prompt 07 · AULA 5 — Roteiro da aula (5 blocos + adicionais)

```
Hand-drawn script flow in marker style.
Title at top (bold uppercase): "ROTEIRO DA AULA".
Subtitle below (italic lowercase): "igual vídeo didático do youtube. simples e direto."
Five hand-drawn rectangular boxes in a horizontal row, connected by solid black filled-triangle arrows pointing right:
Box 1: bold "01" / "INTRODUÇÃO" / smaller "cena que prende."
Box 2: "02" / "OBJETO DA AULA" / "o que vai entregar."
Box 3: "03" / "CONTEXTO" / "por que importa."
Box 4: "04" / "APLICAÇÃO PRÁTICA" / "como aplicar."
Box 5: "05" / "INSTRUÇÕES" / "passo do cliente agora."
Below the row, with vertical space, a smaller note with a plus icon: "+ ADICIONAIS · link na descrição · material extra fora da aula".
[STYLE]
```

---

## Prompt 08 · AULA 6 — Os 3 erros que matam produto

```
Hand-drawn 3-column warning layout in marker style.
Title at top (bold uppercase): "OS 3 ERROS QUE MATAM PRODUTO".
Subtitle below (italic lowercase): "disfarçados de generosidade."
Three hand-drawn rectangular boxes in a horizontal row, each with a large bold X mark on top:
Box 1: large X / "ERRO 01" / "COBRIR TODO MUNDO" / "iniciante + avançado no mesmo produto".
Box 2: large X / "ERRO 02" / "AULA 1 LONGA" / "45min de introdução mata o consumo".
Box 3: large X / "ERRO 03" / "BÔNUS GORDO" / "bônus maior que o produto principal".
[STYLE]
```

---

## Prompt 09 · AULA 7 — As 3 pontes (loop)

```
Hand-drawn 3-column bridge diagram in marker style.
Title at top (bold uppercase): "OS 3 TIPOS DE PONTE".
Subtitle below (italic lowercase): "fim de produto é a porta do próximo."
Three hand-drawn rectangular boxes in a horizontal row, each containing:
Box 1: bold "PONTE 01" / "HORIZONTAL" / large bold horizontal arrow → in middle / smaller "pro próximo obstáculo do caminho".
Box 2: bold "PONTE 02" / "VERTICAL" / large upward arrow ↑ in middle / "pro programa principal".
Box 3: bold "PONTE 03" / "NATURAL" / curved loop arrow ⤻ in middle / "continuação que só faz sentido com o próximo".
[STYLE]
```

---

## Prompt 10 · AULA 8 — Ciclo de 3 dias

```
Hand-drawn 3-day production cycle diagram in marker style.
Title at top (bold uppercase): "CICLO DE 3 DIAS".
Subtitle below (italic lowercase): "perfeito mata frequência. frequência gera LTV."
Three hand-drawn rectangular boxes in a horizontal row, connected by solid black filled-triangle arrows:
Box 1: bold "DIA 1" / "ESTRUTURA" / handwriting "workbook + esqueleto pronto".
Box 2: bold "DIA 2" / "GRAVAÇÃO" / "tudo num dia. sem regravar."
Box 3: bold "DIA 3" / "SUBIDA" / "editar essencial + publicar."
[STYLE]
```

---

## Prompt 11 · AULA 8 — As 3 métricas

```
Hand-drawn 3 big-number metrics diagram in marker style.
Title at top (bold uppercase): "AS 3 MÉTRICAS QUE IMPORTAM".
Subtitle below (italic lowercase): "viciante ou bucha? três números decidem."
Three hand-drawn rectangular boxes in a horizontal row:
Box 1 (filled black with white huge text): "50%" very large, then "CHEGA NA METADE" below.
Box 2 (white with black border): "30%" very large, then "CONSOME ATÉ O FIM".
Box 3 (white with black border): "15%" very large, then "COMPRA O PRÓXIMO".
[STYLE]
```

---

## Como gerar e plugar

1. Copia o prompt da imagem que tu quer
2. Cola num gerador (recomendado: Gemini Nano Banana Pro pela fidelidade ao texto)
3. Salva o PNG resultante com o nome sugerido no markdown (ex: `viciante-aula1-fluxo-jornada.png`)
4. No workbook em markdown, substitui o placeholder `![](INSERIR-IMAGEM-AQUI.png)` pelo caminho real do arquivo
5. Sobe pasta inteira (markdown + PNGs) no Notion, Obsidian Publish, GitBook, ou onde for publicar

**Dica:** mantém todos os PNGs na mesma pasta do markdown. Caminhos relativos funcionam em qualquer plataforma.
