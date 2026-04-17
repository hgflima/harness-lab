---
description: Cria uma nova jornada de usuário usando o skill user-journey-map (fluxo completo do zero)
argument-hint: [nome-do-produto ou caminhos de arquivos de contexto]
---

# /user-journey-map:create

Inicia o fluxo completo de criação de jornada usando o skill `user-journey-map`.

## Execução

Siga os 8 steps do skill `user-journey-map` **em ordem**, sem pular:

1. **Ingestão** — leia `docs/BRIEF.md` se existir, pergunte ao usuário se tem mais material, despache o `user-journey-researcher` subagent se houver arquivos grandes ou referências a libs/APIs
2. **Âncora de produto** — uma frase sobre produto e cliente
3. **Strawman do caminho feliz** — proponha um rascunho numerado em prosa, peça correção (**gate contra ficção**)
4. **Sondagem por estágio** — sempre com exemplos concretos, aceite "não sei" como resposta, opine com strawman quando houver contexto
5. **Síntese da tabela** — despache o `user-journey-drafter` subagent com variante escolhida (Pareto default)
6. **Diagramas condicionais** — só se topologia/interação/ciclo de vida justificam, cada um com header "revela ___"
7. **Checklist de validação** — use `templates/validation-checklist.md`
8. **Fronteira PRD** — bloco obrigatório no final

## Princípios a aplicar durante a execução

- **Simplicity First**: default Pareto 3-col, sem diagrama, sem coluna de emoção. Escala só quando o sinal demanda.
- **Think Before Create**: strawman sempre, nunca preenche no escuro, expõe tradeoffs.
- **Seja Cirúrgico**: aqui como criação nova não há muito o que preservar, mas se já houver jornadas em `docs/journeys/` **não as toque**.
- **Goal Driven Execution**: toda decisão passa por "isto facilita o PRD?".

## Output

Arquivo em `docs/journeys/<slug>.md`, onde `<slug>` é derivado do nome do produto. Crie o diretório `docs/journeys/` se não existir.

## Argumentos

`$ARGUMENTS` pode conter:
- **Nome/slug inicial do produto** (ex: `recarga-celular`) — usado como hint para a âncora de produto no Step 2
- **Caminhos de arquivos** (ex: `docs/BRIEF.md`, `research/entrevistas.md`) — despacha o researcher automaticamente antes do Step 2
- **Referência a lib/API conhecida** (ex: `inspire-se no Stripe Checkout`) — despacha o researcher com instrução context7-first

Se `$ARGUMENTS` estiver vazio, comece pelo Step 1 normalmente e pergunte ao usuário o que ele tem.
