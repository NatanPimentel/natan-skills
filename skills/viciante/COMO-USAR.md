# Como instalar e usar a skill Viciante

Guia completo. Lê uma vez do começo ao fim antes de começar. Em 30-45 minutos tu sai com workbook arquitetado.

---

## ANTES DE TUDO

**Pré-requisitos:**

- Conta no [Claude.ai](https://claude.ai) (recomendado: Pro ou Team — funciona melhor com peças longas)
- Esse pacote `skill-viciante.zip` baixado no teu computador
- 30-45 minutos focado, sem distração
- Material dos teus 4 sinais em mãos se tiver (onboarding, transcrição de mentoria, aplicações, prints de caixinha) — não é obrigatório, mas melhora a precisão da fatia

---

# Parte 1 · Instalação

A skill funciona de duas formas. Escolhe a que tem disponível na tua conta.

## Opção A · Skills nativas no Claude.ai (recomendado)

Se tu tem acesso ao Skills nativos do Claude.ai (lançado em outubro de 2025):

1. Descompacta `skill-viciante.zip` no teu computador
2. Abre [claude.ai](https://claude.ai)
3. Vai em **Settings → Capabilities → Skills**
4. Clica em **Upload Skill** (ou **Add Skill**)
5. Seleciona a pasta inteira `skill-viciante/` ou o `.zip`
6. Confirma a instalação
7. A skill já tá ativa. Pula pra **Parte 2**.

> **Não tem Skills disponível?** Vai pra Opção B abaixo.

## Opção B · Project no Claude.ai (alternativa universal)

Funciona em qualquer conta Claude.ai (Pro, Team, ou Free com limitação).

1. Descompacta `skill-viciante.zip`
2. Abre [claude.ai](https://claude.ai) → cria um **Projects** novo
3. Nomeia o projeto: **Viciante**
4. Clica em **Set custom instructions** (Custom Instructions)
5. Abre o arquivo `SKILL.md` da pasta descompactada num editor de texto
6. Copia TODO o conteúdo e cola no campo de Custom Instructions
7. Salva
8. No mesmo projeto, vai em **Project Knowledge → Add content**
9. Sobe os 3 arquivos da pasta `references/`:
   - `framework-viciante.md`
   - `prompts-imagens.md`
   - `templates-output.md`
10. Pronto. Conversa nesse projeto sempre vai ter a skill ativa.

---

# Parte 2 · Como usar a skill

## Iniciar a conversa

Abre o Claude.ai com a skill instalada (ou dentro do projeto Viciante) e digita qualquer um desses:

- *"Quero criar um produto digital pequeno"*
- *"Tenho mentoria e quero criar uma fatia"*
- *"Como arquiteto um workbook?"*
- *"Ajuda a estruturar meu próximo lançamento"*
- *"Como faço pra cliente voltar a comprar?"*

A skill ativa e te apresenta as 5 etapas. Tu confirma e ela começa.

---

## Etapa 1 · Promessa central

**O que vai acontecer:** a skill pergunta sobre teu programa principal e o caminho que tu leva o cliente.

**Pra responder bem:**

→ Tem mentoria/programa caro? Diz o nome, formato e ticket.
→ Não tem programa principal ainda? Sem stress. Descreve qual é a transformação completa que tu entrega — vira o programa principal hipotético.
→ PONTO A: descreve quem é o cliente HOJE em uma cena concreta. Ex: *"trader no prejuízo, sem regra de stop, perdendo dinheiro toda semana"*.
→ PONTO B: descreve quem ele é DEPOIS. Ex: *"trader consistente, com 3 setups testados, gestão de risco rodando, resultado mensal previsível"*.

**Resposta ruim:** *"ajudar pessoas a serem mais felizes"* — vago demais, a skill vai forçar especificar.

**Resposta boa:** *"ajudar advogados criminalistas iniciantes a montar o primeiro escritório próprio em 12 meses, do CPF zero ao primeiro cliente fechando R$5k+ por caso"*.

---

## Etapa 2 · Recursos disponíveis

**O que vai acontecer:** checklist dos 4 sinais de mercado que tu pode ter.

**Os 4 sinais:**

- ☐ **Onboarding** — respostas de quem entrou no teu programa principal nos últimos 90 dias
- ☐ **Transcrição de mentoria** — últimas 5-10 calls com clientes (Otter, Fireflies, ou texto colado)
- ☐ **Aplicação de funil** — formulário pra quem aplicou no programa caro (convertidos e não convertidos)
- ☐ **Caixinha de perguntas** — prints da última caixinha do Instagram

**Se tu tem material:**
Cola o texto direto na conversa. Tipo: *"Aqui tá a transcrição das últimas 5 calls: [cola]"*. A skill lê e cruza pra mapear os obstáculos recorrentes na próxima etapa.

**Se tu não tem nenhum:**
Sem problema. Marca todos como ☐ e segue. A skill vai usar tua observação de mentor. No fim do workbook, vai ter instrução pra gerar os 4 sinais nas próximas 2-4 semanas e voltar pra refinar a fatia.

> **Dica:** mesmo 1 sinal cruzado já dá precisão muito maior. Se tu tem onboarding mas não tem aplicação, cola o que tem. Vale a pena.

---

## Etapa 3 · Definir A FATIA

Essa é a etapa mais importante. Tem 4 sub-etapas.

### 3.1 · Mapear 10 obstáculos

A skill pede pra tu listar 10 obstáculos no caminho do A → B. Bruto. Sem filtrar.

**Exemplo (advogado criminalista):**

1. Não sabe precificar caso
2. Não sabe captar primeiro cliente
3. Trava na hora de fazer petição
4. Não tem CNPJ ainda
5. Não sabe negociar honorário
6. Tem medo de aparecer no Instagram
7. Não sabe nichar (qual área criminal foca?)
8. Não tem oferta clara
9. Trava em audiência
10. Não tem rotina de prospecção

**Se tu colou material dos sinais:** a skill já cruza com os obstáculos que apareceram nas calls/onboarding e marca quais aparecem em mais sinais.

### 3.2 · Cruzar sinais (se tem material)

A skill mostra uma tabela tipo:

```
OBSTÁCULO              | ON | MENT | APP | CAIX | TOTAL
-----------------------|----|------|-----|------|------
Trava em precificar    | ✓  | ✓    | ✓   |      | 3
Trava em captação      |    | ✓    | ✓   | ✓    | 3
Tem medo de aparecer   | ✓  |      |     | ✓    | 2
[...]
```

Obstáculos com 3+ sinais são candidatos fortes pra virar fatia.

### 3.3 · Escolher candidata

A skill pergunta qual te chama atenção pra virar fatia. Escolhe UMA.

**Critério:**
- Aparece em 3+ sinais (se tu tem material) — quase certeza de venda
- Tu cansa de explicar 1:1 nas calls — tem demanda real
- O cliente já te perguntou isso múltiplas vezes em DM

### 3.4 · Rodar os 3 testes

A skill aplica 3 testes na fatia que tu escolheu. Tu responde sim/não pra cada.

**Teste 1 — Resolve UMA coisa?**
*"Termina essa frase em 1 linha: o cliente sai dessa fatia sabendo ___"*. Se tu precisa de parágrafo pra explicar, falha.

**Teste 2 — Não canibaliza o programa principal?**
*"Se um cliente ideal da tua mentoria de [ticket alto] comprasse essa fatia, depois de consumir ele ainda quer entrar na mentoria?"* Sim = passa. Não = falha.

**Teste 3 — Cliente avançado compraria?**
*"Alguém que JÁ TÁ DENTRO do teu programa principal compraria essa fatia mesmo tendo o programa inteiro?"* Sim = passa. Não = falha.

**Passou em 3/3:** segue.
**Falhou em 1:** volta na 3.3 e escolhe outra candidata.

> **Importante:** não tenta forçar fatia que falha 1 teste. Skill vai te avisar mas a decisão é tua. Aceita o filtro — vale mais a pena escolher outra do que produzir produto que canibaliza ou que não tem público real.

---

## Etapa 4 · Estrutura do produto (macro)

A skill pergunta:

1. **Quantas aulas?** Sugestão: 5-8. Mais que isso vira curso (perde frequência). Menos que 5 não dá pra construir loop.
2. **Onde fica a primeira vitória?** Tem que ser ANTES da metade. Em 7 aulas, vira na Aula 3. Em 5 aulas, na Aula 2.
3. **Formato:** vídeo + workbook PDF? Só workbook? Só vídeo? Áudio?
4. **Tempo total de consumo:** 2-4 horas é o ideal. Cabe num sábado de manhã ou viagem de avião.
5. **Ponte de saída** (pra onde manda o cliente no fim?):
   - **Horizontal** — outro produto teu (próximo obstáculo)
   - **Vertical** — programa principal
   - **Natural** — conclusão que só faz sentido com o próximo ativo

---

## Etapa 5 · Estrutura das aulas + entrega

Pra CADA aula, a skill pede 6 coisas:

1. **Título da aula** (5-8 palavras direto ao ponto)
2. **Objeto** (1 frase: *"Nessa aula o cliente sai sabendo X"*)
3. **Contexto** (1-2 linhas: por que essa aula importa)
4. **Aplicação prática** (qual framework, tabela, fluxo, ou exemplo)
5. **Instruções** (qual ação concreta o cliente faz no fim)
6. **Tem framework visual?** (sim/não — se sim, descreve em 1 frase)

Tu responde aula por aula. Demora ~3-5min cada.

**Quando termina todas as aulas, a skill anuncia:**

> Tudo mapeado. Vou gerar agora o workbook em markdown completo.

E entrega um **artifact único** com o workbook pronto.

---

# Parte 3 · Gerar as imagens dos frameworks

O artifact que tu recebe tem placeholders de imagem com prompts em bloco de código logo abaixo. Assim:

```markdown
![framework-aula-1 — substituir pelo PNG gerado](aula1-fluxo.png)

> **Prompt pra gerar essa imagem:**
> ```
> Hand-drawn marker flowchart in black ink on white...
> [prompt completo]
> ```
```

## Passo 1 · Escolhe um gerador de imagem

| Gerador | Qualidade do texto na imagem | Custo | Recomendado pra |
|---|---|---|---|
| **Gemini Nano Banana Pro** | Excelente | Free tier generoso | Frameworks com texto exato |
| **Midjourney** | Médio | Pago (~US$10/mês) | Capa + visuals com cara polida |
| **DALL-E (ChatGPT)** | Médio-bom | Plus US$20/mês | Alternativa decente |
| **Google ImageFX** | Bom | Gratuito | Fallback se outros não rolam |

> **Recomendação forte:** [Gemini](https://aistudio.google.com/) com modelo `nano-banana-pro-preview` ou `gemini-3-pro-image-preview`. Acerta texto na primeira tentativa.

## Passo 2 · Cola o prompt e gera

1. Copia o conteúdo do bloco de código abaixo do placeholder
2. Cola no gerador de imagem
3. Gera (~30 segundos)
4. Verifica se o texto saiu correto na imagem
5. Se saiu errado, gera de novo

## Passo 3 · Salva o PNG

Nomeia com nome curto e descritivo, em kebab-case:

- `aula1-fluxo.png`
- `aula3-tres-testes.png`
- `aula4-esqueleto.png`
- `capa.png`

## Passo 4 · Substitui o placeholder

Volta no markdown do workbook. Procura o placeholder `![...](aula1-fluxo.png)` e substitui o nome do arquivo pelo que tu salvou. Se tu não mudou o nome, já tá certo — só garante que o PNG tá na mesma pasta do `.md`.

> **Dica:** mantém TODOS os PNGs e o markdown na mesma pasta. Caminhos relativos (sem `/` no começo) funcionam em Notion, Obsidian, GitBook, qualquer lugar.

---

# Parte 4 · Publicar o workbook

## No Notion

1. Cria uma página nova
2. No menu (`/`), procura **Import**
3. Escolhe **Markdown & CSV**
4. Sobe o arquivo `.md`
5. Notion converte automaticamente
6. As imagens podem precisar ser arrastadas separadamente (drag & drop dos PNGs nas posições certas)

## No Obsidian (com Publish ativo)

1. Abre tua vault
2. Cria uma pasta nova: `viciante/` (ou nome do produto)
3. Cola o `.md` dentro
4. Cola TODOS os PNGs na mesma pasta
5. No frontmatter do `.md`, adiciona `publish: true`
6. Vai em Obsidian Publish e seleciona a pasta pra sincronizar
7. Pronto — link público disponível

## No GitBook

1. Cria um livro novo
2. Vai em **Import → Markdown**
3. Sobe o `.md`
4. Sobe os PNGs em **Assets**
5. Os caminhos das imagens podem precisar de ajuste manual — verifica antes de publicar

## Em outros lugares

Funciona em qualquer plataforma com suporte a markdown:

- **Substack** — copia o markdown como artigo (formatação limitada)
- **Site próprio** — render via Hugo, Jekyll, MDX, qualquer SSG
- **PDF** — converte com Pandoc: `pandoc workbook.md -o workbook.pdf`

---

# Parte 5 · FAQ

### A skill não ativou quando digitei o trigger. O que faço?

Provavelmente tu tá fora do projeto Viciante (Opção B) ou a skill nativa não tá ativa (Opção A). Verifica:

- **Opção A:** vai em Settings → Skills, confirma que `viciante` aparece com toggle ON
- **Opção B:** confirma que tá conversando DENTRO do Project Viciante (canto superior esquerdo do Claude.ai)

### A skill começou genérica, não seguiu as 5 etapas

Reinicia a conversa com trigger mais específico:

> *"Quero arquitetar um produto digital pequeno usando a skill Viciante. Vamos começar pela Etapa 1 — Promessa central."*

Isso força ela a entrar no flow.

### Travei numa etapa, não sei responder

Pede ajuda direto:

> *"Trava aqui. Me dá 3 exemplos de [o que tá pedindo] pra eu escolher."*

A skill vai sugerir 3 caminhos. Tu escolhe um e segue.

### Quero pular pra outra etapa antes de fechar a atual

Não recomendado. A skill foi feita pra fechar cada etapa antes da próxima — pular gera produto frágil. Se tu insiste, ela cede mas avisa o risco.

### Quero refazer o workbook do zero com fatia diferente

Inicia conversa nova. Não tenta editar a anterior — confunde a skill.

### O markdown ficou enorme. É normal?

Sim. Workbook completo de 7-8 aulas dá entre 4.000 e 8.000 palavras. Quando tu tirar os blocos de prompt das imagens (depois de gerar), fica menor. Mas o conteúdo principal é denso por design — workbook visa ser produto completo, não teaser.

### Posso refinar o texto depois que a skill entrega?

Pode e deve. O artifact é ponto de partida, não versão final. Lê tudo, corta o que for excesso, ajusta tom pra tua voz. Em geral 80% vem bom, 20% vai ajustar.

### Quanto tempo demora a conversa?

Skill conduzida em ritmo normal: 30-45 minutos.
Se tu tem todos os 4 sinais e responde rápido: 20 minutos.
Se tu trava em escolhas: 60-90 minutos.

---

# Parte 6 · Em 3 dias no ar

Checklist final pra publicar:

**DIA 1 — Estrutura (essa skill)**

- [ ] Conversa com a skill, gera o workbook
- [ ] Lê tudo, ajusta texto onde for preciso
- [ ] Gera as imagens dos frameworks (10-30 minutos)
- [ ] Plugga as imagens no markdown
- [ ] Confirma que tá pronto

**DIA 2 — Gravação corrida (se for produto com vídeo)**

- [ ] Grava todas as aulas num único dia
- [ ] Sem edição no meio. Errou, continua, edita depois.
- [ ] Sem cenário ou iluminação premium

**DIA 3 — Subida**

- [ ] Editar só o essencial (cortar pausas gritantes)
- [ ] Subir vídeos na plataforma (Hotmart, Kiwify, Eduzz)
- [ ] Publicar workbook no Notion/Obsidian
- [ ] Montar oferta (página ou email)
- [ ] Publicar

---

## Lembra

> Perfeito mata frequência.
> Frequência gera LTV.
> Publica imperfeito. O mercado é o único editor que importa.

Bora.
