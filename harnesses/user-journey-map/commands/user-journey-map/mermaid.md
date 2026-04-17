---
description: Força geração ou regeneração de diagramas Mermaid numa jornada existente (auto-seleciona tipos ou aceita override)
argument-hint: [arquivo] [flowchart|sequence|state ou combinações separadas por vírgula]
---

# /user-journey-map:mermaid

Gera ou regenera diagramas Mermaid numa jornada existente em `docs/journeys/`. Por default auto-seleciona os tipos apropriados pelos três eixos de revelação da skill. Aceita override explícito.

## Execução

1. **Identifique o arquivo alvo:**
   - Se `$ARGUMENTS` contém caminho ou slug, use-o.
   - Se contém apenas tipos (`flowchart`, `sequence`, etc.) sem arquivo, liste jornadas e pergunte qual.
   - Se vazio, liste e pergunte.

2. **Leia o arquivo** com `Read`.

3. **Determine os tipos a gerar:**

   **Se `$ARGUMENTS` contém tipos específicos** (ex: `flowchart,sequence`): gere apenas esses. Aceite qualquer combinação entre `flowchart`, `sequence`, `state`.

   **Se não especificado**: auto-selecione pelos eixos de revelação analisando a tabela e o contexto:

   | Característica detectada na jornada | Gerar |
   |---|---|
   | Branches, abandono, loops, caminhos alternativos | `flowchart` |
   | Interação temporal entre múltiplos atores | `sequenceDiagram` |
   | Ciclo de vida claro de uma entidade (só sob pedido explícito) | `stateDiagram` |
   | Linear, 1 ator, sem branches | **Nenhum** — reporte ao usuário: *"Esta jornada é linear e a tabela já é suficiente. Nenhum diagrama adicionaria valor. Quer forçar mesmo assim?"* |

4. **Anti-noise rule (mandatória):** todo diagrama gerado **deve** trazer um header de uma linha declarando o que ele revela que a tabela e os outros diagramas não revelam:

   ```
   ## flowchart — revela <o que a topologia esconde da tabela>
   ## sequenceDiagram — revela <a coordenação que a tabela não mostra>
   ```

   Se você não consegue escrever essa frase honestamente para um diagrama solicitado, **não o gere** e avise o usuário: *"Pediu `<tipo>` mas a jornada não tem `<eixo correspondente>` suficiente. O diagrama seria redundante com a tabela."*

5. **Atualize apenas a seção `## Diagramas`** do arquivo. Se a seção não existir, adicione-a entre `## Tabela` (ou `## Lacunas a validar`) e `## Checklist de Validação`.

## Sobre o tipo `journey` nativo do Mermaid

**Não use** o tipo nativo `journey` do Mermaid. É rígido (score 1-5 forçado), não mostra branches, e a tabela da skill já faz melhor o que ele tenta. Se o usuário pedir explicitamente, explique essa limitação e sugira `flowchart` no lugar.

## Princípios a aplicar

- **Seja Cirúrgico (crítico)**: **só mexa na seção `## Diagramas`**. Não altere tabela, contexto, checklist ou fronteira PRD. Diff mínimo.
- **Simplicity First**: se auto-selecionar, comece sempre pelo número mínimo de diagramas que cobrem os eixos presentes. Não gere três por precaução.
- **Think Before Create**: se um diagrama pedido não vai revelar nada novo, diga isso ao usuário **antes** de gerar. Deixe ele decidir se força ou não.
- **Goal Driven**: cada diagrama tem que facilitar a tradução pra PRD. Se não facilita, não gera.

## Output

Arquivo atualizado com:
- Seção `## Diagramas` nova ou substituída, contendo 1 ou mais diagramas Mermaid
- Cada diagrama com header "revela ___" honesto
- Se nenhum diagrama foi gerado (jornada linear), reporte ao usuário e deixe o arquivo intocado

## Argumentos

`$ARGUMENTS` pode conter, em qualquer ordem:
- Caminho ou slug do arquivo
- Tipos desejados separados por vírgula: `flowchart`, `sequence`, `state` (ou combinações)
- Palavra `all` → tenta gerar os três tipos (ainda sujeito ao teste anti-noise)

Exemplos:
- `/user-journey-map:mermaid recarga-celular` — auto-seleciona
- `/user-journey-map:mermaid recarga-celular flowchart` — força apenas flowchart
- `/user-journey-map:mermaid recarga-celular flowchart,sequence` — força dois
