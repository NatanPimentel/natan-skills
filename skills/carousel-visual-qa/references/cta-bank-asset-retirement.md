# Retirada de CTA do banco e reposição segura

Use quando o usuário rejeitar uma direção de CTA e pedir para **deletar** o asset, especialmente se ele já estiver selecionado para um slide 10 em revisão.

## Princípio

`delete` não significa apenas esconder a imagem no manifest. A CTA não pode continuar em nenhum artefato que possa fazê-la voltar por acidente: banco canônico, estado do sorteio, staging, cópia pré-crop, fontes locais da direção e pacote de revisão ainda não publicado.

## Fluxo

1. **Identificar o ID e todas as referências**
   - Leia `manifest.json`, `state.json` e o `assets/cta-selection.json` do post afetado.
   - Procure arquivos e nomes da direção no banco, staging, backup, output da geração e ZIP/contact sheets de revisão.

2. **Retirar o asset de forma estrutural**
   - Remova a entrada do `manifest.json` e o JPEG canônico.
   - Remova o ID de `state.remaining` e todas as linhas correspondentes de `state.history`.
   - Atualize o snapshot pré-crop, o plano de staging e o relatório de QA para refletir a nova contagem ativa.
   - Se o pedido for explícito de exclusão, remova também o arquivo pré-crop, staging e arquivos-fonte/prompt da direção rejeitada; não retenha uma cópia silenciosa em backup.
   - Registre somente o ID retirado, se for necessário para auditoria; não mantenha uma rota de arquivo que permita reutilização acidental.

3. **Manter o seletor resiliente**
   - O seletor nunca deve exigir um número fixo de assets (por exemplo, `18`). Ele deve derivar a contagem do manifest ativo.
   - Antes de procurar uma seleção existente, filtre `remaining` e `history` contra os IDs ainda presentes no manifest.
   - Isso permite que um post cuja CTA foi removida receba uma nova seleção sem repetir as CTAs já usadas no ciclo.

4. **Substituir somente o post afetado**
   - Apague o `cta-selection.json` e `assets/slide-10-cta.jpg` do post que apontava para a CTA retirada.
   - Rode o seletor para o mesmo `run_id` e `post`; ele deve escolher a próxima CTA ainda disponível no deck embaralhado.
   - Renderize apenas `--only=slide-10`.
   - Não altere os outros 9 slides nem troque as CTAs de outros posts do mesmo batch.

5. **Reconstruir e validar a revisão**
   - Atualize apenas o contact sheet afetado, `final-review.json` e o ZIP de revisão para não reintroduzir o asset removido.
   - Verifique: banco sem o ID retirado, seleção nova sem repetição, JPG final em `1080×1350`, e SHA-256 do banco = cópia CTA = `slide-10.jpg`.
   - Entregue apenas o slide 10 alterado, mantendo o batch sem publicação/agendamento até aprovação humana.

## Preferência editorial conhecida

Para CTAs pessoais do Natan, **não usar camisa da seleção brasileira**. Caso uma direção assim apareça ou seja rejeitada, não a reintroduza em geração futura ou no banco.
