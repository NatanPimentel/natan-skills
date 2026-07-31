# Remediação de barras laterais desfocadas em CTAs de slide 10

## Sintoma e decisão

CTAs 4:5 normalizadas podem exibir duas faixas verticais desfocadas nas extremidades. Em geral, são extensões laterais criadas para adaptar uma fonte que não era 4:5 — não fazem parte do retrato editorial.

**Não regenere imediatamente.** Primeiro teste um crop/zoom uniforme em uma cópia isolada. O objetivo é eliminar as extensões sem esticar apenas na horizontal, sem modificar a identidade e sem transformar o renderer em um compositor da CTA.

## Fluxo seguro: teste → staging → promoção

1. **Teste isolado.** Trabalhe em `local/cta-bank/comente-sistema/tests/`; preserve o asset canônico até a aprovação visual. Use crop com razão exata `4:5` e resize uniforme para JPEG RGB `1080×1350`.
2. **QA do piloto.** Verifique em resolução final: barras removidas, rosto/fisionomia, grafia física `COMENTE SISTEMA`, mãos relevantes, placa/margens e enquadramento editorial natural.
3. **Aprovação para o banco.** Após o usuário aprovar a solução, crie um snapshot imutável do banco atual — assets e manifesto — em `archive/<revisão>/` antes de qualquer sobrescrita.
4. **Staging de toda a coleção.** Gere candidatos em `staging/<revisão>/assets/`, com `crop-plan.json` registrando SHA original, caixa de crop, fator de zoom e SHA de saída. Faça QA individual de todos os assets que serão promovidos.
5. **Caixa compartilhada versus adaptada.** Uma caixa única pode ser usada somente se todos os candidatos do staging passarem no QA visual. Caso contrário, aplique caixas por asset. Nunca copie coordenadas de outro banco/revisão sem esse teste completo.
6. **Promoção auditável.** Antes de substituir o canônico, valide as 18 saídas (JPEG/RGB/`1080×1350` + hash). Atualize cada hash no `manifest.json` e registre `preprocessing` (revisão, crop box, zoom e SHA original). Preserve `state.json`: IDs e histórico do ciclo não devem mudar por uma normalização visual.
7. **Sincronização seletiva.** Retome as seleções dos posts ativos pelo mesmo `run_id + post`; o seletor deve conservar o ID sorteado, copiar o novo JPEG e gravar o hash/preprocessamento atual em `cta-selection.json`. Reexporte somente `slide-10` nos posts afetados.
8. **Validação final.** Confirme que o JPEG canônico → `assets/slide-10-cta.jpg` → `slide-10.jpg` são byte a byte idênticos. Se houver ZIP, review manifest ou contact sheet final, reconstrua-os para não deixar uma revisão antiga contendo a CTA pré-crop.

## Exemplo documentado: banco Comente Sistema, revisão zoom-crop-v1

No banco `local/cta-bank/comente-sistema`, uma prova de conceito da CTA 09 aprovou a caixa `(115, 45, 965, 1107)` (850×1062), com zoom `1,270588×`. Após staging e QA individual de 18/18 assets, a mesma caixa foi promovida como `zoom-crop-v1` para aquele banco específico. As originais ficaram arquivadas em `archive/pre-zoom-v1/` e o manifest avançou para a versão 2.

Esses números são **registro de uma revisão específica**, não uma prescrição para futuros bancos ou gerações.

## Contrato do renderer

O renderer do slide 10 continua fazendo cópia byte a byte do JPEG canônico já aprovado. Ele **não** recebe crop, zoom, template, footer, overlay ou texto adicional no momento da renderização. A normalização, quando necessária, acontece uma única vez no banco canônico e permanece rastreável por hash.
