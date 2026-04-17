---
description: Adiciona uma nova jornada ao projeto (nova persona, nova área, jornada secundária) sem alterar as existentes
argument-hint: [foco da nova jornada — ex: "persona admin", "fluxo de devolução"]
---

# /user-journey-map:expand

Cria uma jornada adicional no mesmo projeto, reaproveitando contexto já estabelecido (produto, personas conhecidas, atores) mas focando num novo ator, persona ou área de uso.

## Execução

1. **Inventário das jornadas existentes:**
   - Liste os arquivos em `docs/journeys/`
   - Leia cada um brevemente (ou despache o `user-journey-researcher` subagent se forem muitos/grandes) para extrair: produto, personas já mapeadas, atores já conhecidos
   - Apresente ao usuário um resumo de 3-5 linhas do que já existe

2. **Estabeleça o foco da nova jornada:**
   - Se `$ARGUMENTS` contém o foco, confirme com o usuário
   - Senão pergunte: *"O que diferencia essa nova jornada das existentes? É outra persona? Outra área do produto? Um fluxo alternativo (ex: devolução, upgrade, cancelamento)?"*

3. **Execute o fluxo do skill `user-journey-map`** (Steps 1-8) com estas adaptações:
   - **Step 1 (Ingestão):** já está parcialmente feito — o contexto vem das jornadas existentes. Ainda assim pergunte se há material novo (entrevistas específicas dessa persona, etc.).
   - **Step 2 (Âncora):** confirme que o produto é o mesmo, mas o recorte é diferente.
   - **Step 3 (Strawman):** proponha o caminho feliz novo, referenciando as jornadas existentes quando útil (*"diferente da jornada do cliente comum, aqui o admin começa em..."*).
   - **Steps 4-8:** como de costume.

4. **Referências cruzadas:**
   - Quando fizer sentido, adicione no início do novo arquivo uma linha: *"Complementa [`jornada-x.md`](./jornada-x.md). Esta jornada cobre `<foco>`, enquanto a outra cobre `<foco original>`."*
   - Não altere os arquivos existentes — só referencie-os.

## Princípios a aplicar

- **Seja Cirúrgico (crítico aqui)**: **nunca altere jornadas existentes**. Se você achar uma inconsistência ou ver que a nova jornada invalida algo da anterior, **reporte ao usuário** — não aplique a correção automaticamente. Ele decide.
- **Simplicity First**: se a "nova jornada" na verdade é só uma variante leve de uma existente, sugira ao usuário adicionar uma coluna/nota na existente em vez de criar um arquivo novo. Dois arquivos onde um bastaria é complexidade desnecessária.
- **Think Before Create**: antes de começar, apresente ao usuário o entendimento do recorte e peça confirmação. *"Entendi que você quer uma jornada separada pro caso `<X>`. Certo? Ou é mais uma variante do `<Y>` existente?"*
- **Goal Driven**: cada jornada adicional tem que facilitar o PRD. Se a nova não adiciona informação útil pra especificação, questione se vale existir.

## Output

Novo arquivo em `docs/journeys/<novo-slug>.md`, com referências cruzadas quando apropriado. Arquivos existentes **não são tocados**.

## Argumentos

`$ARGUMENTS`:
- Foco da nova jornada (ex: `persona admin`, `fluxo de devolução`, `primeira compra vs. recompra`)
- Vazio → pergunta ao usuário após inventariar as existentes
