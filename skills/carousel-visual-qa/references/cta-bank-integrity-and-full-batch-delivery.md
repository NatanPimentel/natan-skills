# Banco CTA: integridade do slide 10 e entrega de batch completo

Use esta referência ao revisar ou reexportar carrosséis {{BRAND}} cujo slide 10 seja uma CTA visual pessoal.

## Contrato do slide 10

- O slide 10 é a **arte inteira** sorteada do banco local `local/cta-bank/comente-sistema/`.
- A arte não é fundo, componente ou inspiração: ela precisa chegar ao `slide-10.jpg` sem crop, template, moldura, footer, overlay ou texto adicional.
- Antes do render, o post precisa ter:
  - `assets/slide-10-cta.jpg`;
  - `assets/cta-selection.json`, com ID, hash SHA-256, dimensões e origem da seleção.
- O arquivo final `slide-10.jpg` deve ser uma cópia byte a byte do asset selecionado. Se o post for re-renderizado, a mesma seleção deve ser retomada, não sorteada novamente.

## Fluxo de seleção

A partir da raiz do profile:

```bash
node local/cta-bank/comente-sistema/select.mjs \
  --run <run_id> \
  --post <post-01|post-02|post-03> \
  --dest <run_dir>/<post>/v1/assets/slide-10-cta.jpg
```

O seletor mantém um baralho persistente: não repete um asset até fechar o ciclo de 18. Em batch, rode os 3 slots em paralelo; o lock do estado preserva a não repetição.

## Verificação técnica obrigatória

1. Confirme 10 JPGs por post, todos `JPEG 1080×1350`.
2. Leia `cta-selection.json` e compare o SHA-256 de `slide-10.jpg` ao hash registrado.
3. Confirme que o slide 10 de cada slot corresponde ao asset selecionado e que os IDs são distintos quando são novas seleções do mesmo batch.
4. Teste o arquivo ZIP, se criado, antes de entregá-lo.

## Verificação visual obrigatória

- Revise cada JPG na resolução final. Contact sheet é apenas orientação, nunca substitui a leitura individual.
- No slide 10, confira a grafia física exata `COMENTE` / `SISTEMA`, rosto/fisionomia, mãos, contraste, margens e ausência de UI ou lettering extra.
- Confira que não existe barra de marca, numeração de slide ou camada de template sobre a CTA.

## Entrega de revisão completa

Quando o usuário pedir os **3 carrosséis em versão final para ver**, entregue:

1. os 10 JPGs de cada post, agrupados e identificados pelo título do carrossel;
2. um ZIP complementar com os 30 JPGs originais, se for útil;
3. a confirmação de que o batch segue em `awaiting_approval` e que nenhuma publicação/agendamento foi disparado.

Não substitua os 30 JPGs por apenas um contact sheet ou por um ZIP sem preview inline. Para pedido de revisão parcial, envie somente os slides alterados.
