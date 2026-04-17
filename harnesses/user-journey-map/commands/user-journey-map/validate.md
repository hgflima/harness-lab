---
description: Roda o checklist de validação sobre uma jornada existente em docs/journeys/
argument-hint: [caminho-do-arquivo ou slug da jornada]
---

# /user-journey-map:validate

Lê uma jornada existente em `docs/journeys/` e gera (ou regenera) o checklist de validação interativo.

## Execução

1. **Identifique o arquivo alvo:**
   - Se `$ARGUMENTS` contém um caminho, use-o.
   - Se contém apenas um slug, procure por `docs/journeys/<slug>.md`.
   - Se vazio, liste os arquivos em `docs/journeys/` e pergunte ao usuário qual validar.

2. **Leia o arquivo** com `Read`.

3. **Gere o checklist** baseado em `templates/validation-checklist.md` do skill `user-journey-map`, adaptado ao conteúdo real:
   - Identifique as marcas `[sugerido]` e `[assumido]` presentes e liste-as explicitamente
   - Verifique quais itens do checklist default se aplicam (se não há diagramas, pule a seção de diagramas)
   - Popule o "Backlog de Pesquisa" com as células não-validadas encontradas

4. **Atualize apenas a seção `## Checklist de Validação`** do arquivo. Se a seção não existir, adicione-a antes do bloco `## ⚠️ Isto é jornada, não é PRD`.

## Princípios a aplicar

- **Seja Cirúrgico (crítico aqui)**: **só mexa na seção de checklist**. Não reescreva tabela, não regenere diagramas, não altere o contexto, não mexa na fronteira PRD. Diff mínimo.
- **Think Before Create**: se encontrar inconsistências durante a leitura (tabela sem proveniência, diagrama sem header "revela"), **reporte ao usuário como observação separada** — não conserte silenciosamente.
- **Goal Driven**: o checklist existe para apontar lacunas que vão atrapalhar o PRD. Cada item tem que passar no teste "isto ajuda a validar para o PRD?".

## Output

Arquivo atualizado no mesmo caminho, com:
- Seção `## Checklist de Validação` nova ou substituída
- Confirmação ao usuário de quais items foram adicionados ao backlog de pesquisa

## Argumentos

`$ARGUMENTS`:
- Caminho completo (ex: `docs/journeys/recarga-celular.md`)
- Slug apenas (ex: `recarga-celular` → procura em `docs/journeys/`)
- Vazio → lista disponíveis e pergunta
