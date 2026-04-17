# Template: Checklist de Validação

Bloco reutilizável para a Step 7 da skill `user-journey-map`. Cola diretamente no documento final.

**Este checklist é para o humano responder.** Claude não chuta as respostas. Items marcados como ❌ ou ❓ formam o backlog de pesquisa.

---

## Checklist de Validação

Para cada item, responda: ✅ sim | ❌ não | ❓ não sei

### Observação vs. Suposição
- [ ] Todas as marcas `[sugerido]` foram confirmadas como verdadeiras?
- [ ] Todas as marcas `[assumido]` têm um plano para validar (entrevista, analytics, teste, observação)?
- [ ] As fontes externas usadas (brief, libs, concorrentes) refletem o seu cliente real, ou foram usadas como referência distante?

### Cobertura
- [ ] A tabela cobre o caminho feliz do primeiro contato até o objetivo final do cliente?
- [ ] Todas as fricções macro (abandono, retorno, pular etapa) estão ou na tabela (coluna Fricção) ou num diagrama?
- [ ] Todas as personas relevantes estão representadas? Se há múltiplas, elas merecem jornadas separadas?
- [ ] Todos os sistemas / atores externos que o cliente toca estão listados (APIs, serviços, operadores, terceiros)?
- [ ] Nenhum estágio crítico ficou invisível? (pense: onboarding, pagamento, confirmação, pós-uso)

### Fronteira PRD
- [ ] Nenhuma linha da tabela descreve estado de erro do sistema? *(isso é PRD)*
- [ ] Nenhuma linha descreve decisão interna de backend? *(isso é PRD)*
- [ ] Nenhum campo de dados / schema aparece na tabela? *(isso é PRD)*
- [ ] Nenhum critério de aceite técnico foi escrito? *(isso é PRD)*

### Diagramas (se houver)
- [ ] Cada diagrama tem o header `## <tipo> — revela <o quê>` honesto?
- [ ] Cada diagrama revela algo que a tabela não mostra? (se só reproduz a tabela, deve ser removido)
- [ ] Se há branches/abandono, há flowchart?
- [ ] Se há múltiplos atores com interação temporal, há sequenceDiagram?

### Qualidade da Linguagem
- [ ] As células usam a voz do cliente, não jargão técnico?
- [ ] Cada célula é uma frase curta (não um parágrafo)?
- [ ] Estágios têm nomes claros e não ambíguos?

---

## Backlog de Pesquisa

> *Preencha esta seção com os items que ficaram ❌ ou ❓ acima, cada um com a ação correspondente para validação.*

**Exemplo:**
- `[assumido]` na célula "Fricção do Estágio Pagamento" → rodar entrevista com 5 usuários reais de POC, perguntando onde eles desistiram
- `[sugerido]` na célula "Sinal de sucesso do Estágio Confirmação" → verificar via analytics se chega SMS de fato
