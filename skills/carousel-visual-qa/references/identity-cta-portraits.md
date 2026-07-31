# QA de retratos CTA com identidade preservada

Use para imagens de CTA de carrossel que mostram o próprio usuário.

## Contrato de identidade

- A foto anexada é a fonte de verdade: preservar rosto, fisionomia, estrutura facial, linha do maxilar, olhos, tom de pele, padrão de cabelo ou cabeça raspada, barba e impressão etária natural.
- Roupas, bonés, óculos, cenário, pose e acessórios podem variar somente quando o usuário os tiver liberado.
- Nunca misturar a identidade do usuário com pessoas de imagens de inspiração.

## Contrato de CTA físico

- Priorizar placa, quadro ou caderno físico, frontal, grande e sem obstrução, em vez de texto flutuante sobre a foto.
- O CTA deve ter grafia conferida caractere por caractere, em linhas definidas quando necessário, por exemplo: `COMENTE` / `SISTEMA`.
- Conferir alto contraste, área central-inferior, margem de segurança e presença visual suficiente para leitura em celular.
- Rejeitar UI de Instagram, logos, watermarks, texto extra legível, lettering corrompido, dedos extras ou mãos deformadas.

## Coleções de variações

- Quando o briefing solicitar várias versões, uma coleção anterior de prompts ou “mais variações”, registrar a quantidade esperada e completar todos os slots; uma peça já aprovada não torna as demais opcionais.
- “Um de cada vez” define a unidade de produção e revisão: cada retrato deve ser gerado e avaliado individualmente. Não é um gate implícito após o primeiro resultado.
- Usar uma única foto-fonte anexada em cada geração e variar de forma intencional personagem, cenário, roupa/acessórios, pose, luz e objeto narrativo, mantendo a fisionomia constante.
- Um contact sheet é útil para curadoria, mas nunca substitui a revisão de cada JPG final em resolução integral.

## Raster e proporção

Um prompt 4:5 não garante arquivo físico 1080×1350. Verificar com Pillow antes da QA visual. Se um retrato aprovado vier estreito e o crop ameace cortar rosto ou CTA, preservar o conteúdo expandindo discretamente o fundo lateralmente e então exportar 1080×1350. Reexaminar a imagem final para impedir barras, emendas óbvias ou degradação do CTA.

## Checklist final

1. Comparar identidade facial com a referência.
2. Auditar mãos, postura, adereços e anatomia.
3. Conferir CTA, palavra por palavra.
4. Confirmar formato e dimensões físicas finais.
5. Avaliar a composição final em 1080×1350, não no original do modelo.