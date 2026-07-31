# Skill Viciante — Manual

Skill conversacional pro Claude.ai que te guia em 5 etapas até teu produto digital pequeno (R$297-997) estar arquitetado no papel.

---

## O que ela faz

Em uma conversa de ~30 minutos, a skill:

1. Mapeia a promessa central do teu programa principal (PONTO A → PONTO B)
2. Levanta os 4 sinais de mercado disponíveis (onboarding, transcrição, aplicação, caixinha)
3. Define A FATIA — UM obstáculo específico que vira produto, validado por 4 sinais e 3 testes
4. Estrutura o produto: quantas aulas, onde fica primeira vitória, formato, ponte de saída
5. Fecha o roteiro de cada aula em 5 blocos (Introdução / Objeto / Contexto / Aplicação / Instruções)

No fim, entrega **um workbook em markdown completo** com:
- Texto pronto pra cada aula
- Placeholders pras imagens dos frameworks visuais
- Prompts canônicos das imagens em bloco de código (pra você gerar fora)

---

## Como instalar no Claude.ai

1. Baixa esse pacote (`skill-viciante.zip` ou pasta inteira)
2. No Claude.ai, abre **Settings → Capabilities → Skills**
3. Clica em **Upload Skill** e seleciona a pasta `skill-viciante` ou o `.zip`
4. A skill ativa automaticamente quando tu pede coisa relacionada a criar produto digital

Se a tua versão do Claude.ai não tem Skills nativas ainda, alternativa:
1. Cria um **Project** novo no Claude.ai
2. Cola o conteúdo de `SKILL.md` no campo **Custom Instructions**
3. Sobe os arquivos da pasta `references/` no **Project Knowledge**
4. Conversa normalmente dentro desse projeto

---

## Como usar

Abre Claude.ai (com a skill instalada) e diz qualquer coisa tipo:

- *"Quero criar um produto digital pequeno"*
- *"Tenho mentoria e quero criar uma fatia"*
- *"Ajuda a arquitetar meu próximo lançamento"*
- *"Como faço pra cliente voltar a comprar?"*

A skill ativa, abre as 5 etapas, e te conduz.

---

## O que vem como output

Um artifact único em markdown com:

- Capa do workbook
- Sumário
- Intro
- Aulas (estrutura completa de cada uma)
- Próximo passo

E em pontos estratégicos do markdown, blocos assim:

```markdown
![NOME-DA-IMAGEM — substituir pelo PNG gerado](placeholder.png)

> **Prompt pra gerar essa imagem:**
> ```
> Hand-drawn marker illustration of...
> [prompt completo aqui]
> ```
```

Tu pega cada prompt, cola no Gemini/Midjourney/DALL-E, gera o PNG, substitui o placeholder. Em 30-60min tu tem o workbook visual completo pronto pra publicar.

---

## Onde publicar o workbook gerado

Funciona em qualquer plataforma que renderize markdown:

- **Notion** — cola o markdown numa página, dropa as imagens
- **Obsidian Publish** — salva como `.md` numa pasta da vault, sobe pro Publish
- **GitBook** — importa o markdown direto
- **Substack** — cola como artigo (limitado em formatação)
- **Próprio site** — qualquer site com suporte a markdown

---

## Recomendação pras imagens

- **Gemini Nano Banana Pro** (`nano-banana-pro-preview`) — melhor fidelidade ao texto que vai dentro da imagem. Recomendado pros frameworks visuais que tem nomes/labels específicos.
- **Midjourney** — visual mais polido, mas pode errar texto. Bom pra capa.
- **DALL-E** — alternativa decente se não tem acesso aos outros.
- **Google ImageFX** — gratuito, qualidade decente, pode errar texto.

Pra workbook viciante, o estilo do prompt é hand-drawn marker preto-e-branco — funciona melhor em modelos que respeitam estilo de ilustração simples.

---

## O método por trás

A skill segue o método **Viciante** — produto digital que vende rápido, é consumido de verdade, e faz o cliente voltar pra comprar o próximo.

3 princípios:

1. **Fatia** resolve UM obstáculo no caminho do cliente, sem canibalizar o programa principal.
2. **Primeira vitória** acontece antes da metade do consumo — cliente experimenta resultado, volta querendo o resto.
3. **Loop** — fim do produto aponta pro próximo ativo. Cliente que volta é o que faz o negócio existir no mês 12, 24, 36.

Detalhes operacionais do método em `references/framework-viciante.md`.

---

## Boa sorte. Bora.
