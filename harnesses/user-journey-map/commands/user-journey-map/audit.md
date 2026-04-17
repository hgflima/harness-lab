---
description: Auditoria de qualidade de uma jornada contra as regras do skill user-journey-map (reporta problemas, não corrige automaticamente)
argument-hint: [caminho-do-arquivo ou slug]
---

# /user-journey-map:audit

Checa uma jornada existente contra as regras de qualidade do skill `user-journey-map`. **Reporta problemas em lista estruturada. Nunca corrige silenciosamente.** O usuário decide quais correções aplicar.

## Execução

1. **Identifique o arquivo alvo:**
   - `$ARGUMENTS` contém caminho ou slug → usa-o
   - Vazio → lista `docs/journeys/` e pergunta

2. **Leia o arquivo** com `Read`.

3. **Rode cada check abaixo.** Para cada problema encontrado, anote: onde está (linha ou seção), qual regra foi violada, e sugestão de correção.

## Checks

### A. Proveniência
- [ ] Toda célula da tabela tem uma marca `[validado]` / `[sugerido]` / `[assumido]`?
- [ ] Há alguma célula que deveria estar marcada como `[sugerido]` (com hedge como "provavelmente", "talvez") mas está sem marca?
- [ ] Quantas células `[assumido]` existem? Cada uma tem entrada correspondente no "Backlog de Pesquisa" / "Lacunas a validar"?

### B. Fricções
- [ ] Toda fricção identificada tem ou uma resolução na tabela (coluna "Sinal de sucesso" em JTBD, ou próximo estágio em Pareto) **ou** um branch correspondente num diagrama?
- [ ] Fricções órfãs (sem resolução e sem branch) são sinal de lacuna — listar todas.

### C. Topologia vs. Diagramas
- [ ] Se a jornada menciona abandono, retorno ou caminhos alternativos, **há um `flowchart`**?
- [ ] Se a jornada tem múltiplos atores com coordenação temporal (ex: cliente → app → gateway → banco), **há um `sequenceDiagram`**?
- [ ] Se há diagrama `stateDiagram`, o ciclo de vida realmente justifica (entidade central com estados distintos)?
- [ ] Se não há nenhum diagrama, a jornada é verdadeiramente linear e 1-ator? Se não é, por que não há diagrama?

### D. Anti-noise nos diagramas
- [ ] Cada diagrama tem o header `## <tipo> — revela <o que>`?
- [ ] O header "revela ___" é honesto? Ou seja: o diagrama efetivamente mostra algo que a tabela **não** mostra?
- [ ] Há dois diagramas cobrindo o mesmo eixo (ex: dois flowcharts)? → um deles deveria ser removido.

### E. Fronteira PRD
- [ ] Há o bloco `## ⚠️ Isto é jornada, não é PRD` no final?
- [ ] Alguma linha da tabela descreve **estado de erro do sistema** (ex: "API retorna 500")? → é PRD, não jornada.
- [ ] Alguma linha descreve **regra interna de backend** (ex: "sistema calcula taxa com base em X")? → PRD.
- [ ] Algum **campo de dados / schema** aparece na tabela? → PRD.
- [ ] Algum **critério de aceite técnico** foi escrito (ex: "latência < 200ms")? → PRD.

### F. Linguagem
- [ ] As células usam voz do cliente (linguagem natural) ou jargão técnico?
- [ ] Alguma célula é um parágrafo grande em vez de frase curta?
- [ ] Os nomes dos estágios são claros e não ambíguos?

### G. Goal Driven
- [ ] Cada seção do documento passa no teste *"isto facilita a tradução pra PRD?"*. Se alguma seção é enfeite e não insumo, apontar.

## Output

Relatório estruturado **no main context** (não grava no arquivo), no formato:

```markdown
# Auditoria: docs/journeys/<slug>.md

## ✅ Tudo certo
<lista de checks que passaram, condensada>

## ⚠️ Avisos (não bloqueiam, mas vale revisar)
- [B2] Fricção "cliente não lembra senha" (estágio Login) não tem resolução na tabela e não há diagrama com branch correspondente.
  - **Sugestão:** adicionar coluna de recuperação no estágio Login ou gerar flowchart.
- ...

## ❌ Violações (precisam de correção)
- [E2] Linha "API retorna 500 quando gateway timeout" (estágio Pagamento) descreve estado de erro de sistema.
  - **Regra violada:** Fronteira PRD — estados de erro não vão na jornada.
  - **Sugestão:** remover essa linha e mover pra futuro PRD; na jornada, manter apenas "cliente vê erro genérico e não sabe se pagou".

## Resumo
- X checks passaram
- Y avisos
- Z violações
```

## Princípios a aplicar

- **Seja Cirúrgico (crítico)**: **não altera o arquivo**. Apenas reporta. O usuário vai decidir aplicar correções manualmente ou via `:validate`, `:mermaid`, `:expand`, ou edição direta.
- **Think Before Create**: todo problema reportado precisa de uma sugestão de correção concreta. Não aponte problemas sem caminho de resolução.
- **Goal Driven**: os checks existem porque cada um, se violado, compromete a qualidade do PRD gerado a partir desta jornada. Se um check não ajuda o PRD, não deveria estar aqui.

## Argumentos

`$ARGUMENTS`:
- Caminho completo (ex: `docs/journeys/recarga-celular.md`)
- Slug (ex: `recarga-celular`)
- Vazio → lista e pergunta
