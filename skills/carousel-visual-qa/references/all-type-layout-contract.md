# Contrato visual para slides `all-type` da {{BRAND}}

Use este contrato ao revisar ou corrigir slides textuais 1080×1350.

## Composição

- Trate kicker, H1, lede, bullets e fechamento como **um único grupo visual**.
- Centralize o grupo inteiro verticalmente na área útil. Não centralize cada elemento separadamente nem deixe a composição colada ao topo sem intenção editorial.
- Mantenha hierarquia clara: kicker → H1 → divisor → explicação → bullets → fechamento.

## Densidade legível

Legibilidade não exige um slide vazio. Quando a pauta pede mais conteúdo:

- use 1 lede curto e forte;
- use até 3 bullets concisos;
- inclua 1 ou 2 frases finais soltas para síntese ou consequência;
- preserve corpo e bullets grandes o suficiente para leitura em celular.

Ajuste ou compacte a copy antes de diminuir a fonte. Corte somente redundância, nunca a consequência que completa o raciocínio.

## Contrato de renderização

- `lede_html` precisa renderizar dentro de um bloco com a classe tipográfica prevista, por exemplo `<p class="lede">…</p>`.
- Valores em texto puro ou com tags inline (`<strong>`, `<em>`) devem ser automaticamente envolvidos no bloco `.lede`; caso contrário, o navegador pode cair na fonte padrão minúscula.
- A QA visual é em JPG full-resolution, não em contact sheet. Confira escala relativa, quebras órfãs, clipping, pontuação e equilíbrio do grupo inteiro.
