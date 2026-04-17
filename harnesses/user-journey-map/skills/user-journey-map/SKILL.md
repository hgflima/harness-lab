---
name: user-journey-map
description: >
  Use this skill whenever the user wants to describe, document, map, or structure
  a customer journey, user flow, or experience path — even if they don't explicitly
  say "journey". Triggers on mentions of: jornada do cliente, jornada do usuário,
  mapeamento de jornada, fluxo do usuário, experiência do cliente, user journey,
  customer journey, user flow, customer experience flow, journey map. Also triggers
  when the user has a product brief and wants to understand how customers interact
  with the product before writing a PRD. The skill runs an interactive progressive
  extraction that produces a structured journey document (table with provenance
  marks + optional Mermaid diagrams + validation checklist), intended as input for
  PRD generation. It is explicitly NOT a PRD and should refuse to produce one.
---

# User Journey Map

## North Star

**O objetivo é entregar a jornada mais simples e clara possível para que a geração do PRD seja determinística. Cada decisão passa por: isto facilita o PRD?**

Isto aqui não é um PRD. É o insumo para escrever um. Jornada responde *"o que o usuário vive"*. PRD responde *"o que o sistema faz"*. Pular a jornada é construir com base em suposição. Inchar a jornada com campos de PRD é fazer o trabalho duas vezes.

---

## Operating Principles

Estas quatro regras regem toda decisão durante a execução. Quando houver dúvida, volte aqui.

### 1. Simplicity First
Default é sempre o mais enxuto. Tabela de 3 colunas (Pareto) antes da de 5 (JTBD). Sem diagrama antes de com diagrama. Sem coluna de emoção antes de com. Cada adição precisa justificar a si mesma contra a North Star. Escalar só quando o sinal da conversa realmente demanda. *"Estamos buscando o simples, não desenhos complexos — a menos que o fluxo seja realmente complexo."*

### 2. Think Before Create
Nunca preencha no escuro. Use o strawman: proponha e peça reação. Marque tudo que não foi validado como `[sugerido]` ou `[assumido]`. Se houver tradeoff entre caminhos (Pareto vs JTBD, com ou sem diagrama, qual variante de diagrama), **exponha os dois lados ao usuário antes de escolher** — não esconda a confusão, traga-a à tona.

### 3. Seja Cirúrgico
Comandos de edição (`:validate`, `:expand`, `:mermaid`, `:audit`) só tocam no que foi pedido. **Não reescreva seções intactas. Não "aproveite para arrumar" coisas do lado.** Diff mínimo sempre. Se houver melhoria adjacente óbvia, aponte-a ao usuário em separado — não aplique silenciosamente.

### 4. Goal Driven Execution
A North Star acima é o critério final de todas as decisões. Se alguma seção, coluna, diagrama ou marca não passa no teste *"isto facilita a geração do PRD?"*, corta sem dó.

---

## When to Trigger

**Use this skill when the user:**
- Explicitly asks to create, map, document, or describe a user/customer journey
- Mentions jornada, journey, user flow, fluxo do usuário, customer experience, mapeamento de cliente
- Has a product brief and wants to understand the experience path before speccing features
- Wants to reverse-engineer a known product/library's journey (Stripe Checkout, Notion onboarding, etc.) as a reference

**Do NOT use for:**
- Writing PRDs, specifications, or technical requirements — that is the *next* step after jornada
- Pure marketing funnels (AIDA, AARRR, See-Think-Do-Care) — wrong tool, those are growth frameworks
- UI/UX visual mockups — this skill produces text and diagrams, not visual design
- Business model canvas or value proposition canvas — different artifacts

---

## Cross-Cutting Rule — Context7-First on Any External Reference

Esta regra vale em **qualquer step** do Execution Flow, não só no Step 1.

**Gatilho:** sempre que o usuário cita uma biblioteca, API, framework, SDK ou produto conhecido — seja no brief inicial (Step 1), durante a reação ao strawman (Step 3), enquanto sonda estágios (Step 4), ao pedir um diagrama (Step 6), ou em qualquer outro momento — **interrompa o fluxo atual imediatamente**.

**Ação obrigatória, nesta ordem:**

1. Pause o step corrente (não continue opinando, não continue o probe, não avance).
2. Anuncie no main context: *"Você citou `<X>`. Vou pausar o `<step atual>` e despachar o `user-journey-researcher` num subagent (context7 primeiro). Volto com resumo estruturado antes de continuar."*
3. Despache o `user-journey-researcher` subagent com instrução explícita: *"use context7 FIRST para `<X>`, então extraia a estrutura de jornada relevante (stages, actors, happy path, falhas comuns, topologia). Retorne resumo estruturado."*
4. Só depois de receber o resumo, retome o step onde parou — agora com a pesquisa disponível.

**Por que transversal:** referências externas novas aparecem o tempo todo durante o probe e o strawman, não só na ingestão inicial. Se o gatilho só valesse no Step 1, o orquestrador trataria a nova referência como 'input de esclarecimento do usuário' e seguiria opinando sem pesquisa — que é exatamente o que a regra 'context7 first' existe para evitar.

**Nunca puxe docs brutas para o main context.** O researcher é quem lê; o main recebe só a síntese.

**Exceção única:** se o mesmo `<X>` já foi pesquisado anteriormente nesta mesma conversa e a síntese ainda está no contexto, reutilize-a — não despache duas vezes.

---

## Execution Flow

The skill runs in 8 sequential steps. **Never skip Step 1 (Ingestion) or Step 3 (Strawman).** Those are the gates against fiction.

### Step 1 — Ingest Existing Material (Always First)

Before asking anything, check for existing context. Most users arrive with at least a brief.

**First, check the project conventions:**
- Look at `docs/BRIEF.md` — project convention is that briefs live there. Read it if present.
- Look at `docs/journeys/` — if other journeys already exist, they carry context about personas and product.

**Then ask the user:**

> "Antes de começar, você tem mais algum material pra me dar contexto? Pode ser product brief, vision, entrevistas com usuários, wireframes, transcrição de reunião, análise de concorrente. Qualquer coisa que me ajude a entender o produto e o cliente. Me passa os caminhos dos arquivos, ou me diz se você já está começando com o que tem em mente."

**Handling files:**
- Small and few (≤ 2 files, each < 300 lines): read directly with `Read`.
- Large or multiple: **spawn the `user-journey-researcher` subagent** with the file paths. Return a structured summary only — do not load raw content into the main context.
- Announce the subagent spawn in main context: *"Vou ler `<arquivos>` num subagent para não poluir nosso contexto. Volto com resumo."*

**Handling references to libraries, APIs, or known products:**

If the user cites a library/API/known product as inspiration (*"inspire-se no Stripe Checkout"*, *"quero algo tipo o Duolingo onboarding"*):

- **Automatically** spawn the `user-journey-researcher` subagent with instruction: *"use context7 FIRST to fetch docs for `<library>`, then extract the journey structure: stages, actors, happy path, common failure modes, topology. Return structured summary."*
- **Context7 first, always.** The researcher's instructions enforce this.
- Announce in main context: *"Vou pesquisar `<X>` num subagent (context7 primeiro). Volto com resumo estruturado."*
- Never read raw docs into the main context.

**If the user has nothing:** proceed to Step 2 with a blank slate and note it for the proveniência — everything will start as `[sugerido]` or `[assumido]`.

### Step 2 — Anchor the Product (Single Question)

Ask, in plain text, one short question:

> "Em uma frase, qual é o produto e pra quem ele serve?"

If Step 1 already answered this (from ingested docs or researcher summary), **skip** this step. Instead, confirm:

> "Pelo material, entendi que é `<X>` pra `<Y>`. Certo?"

The user confirms or corrects. Move on.

### Step 3 — Draw the Happy Path as Strawman

This is the most important step. Based on everything gathered so far (ingested docs + researcher summary + product anchor), propose a draft of the happy path in plain prose — **NOT a table yet, NOT a diagram**. Just a numbered list of stages with a one-line description each:

> "Acho que o caminho feliz é mais ou menos assim:
> 1. Cliente chega em `<local/canal>` e faz `<ação>`
> 2. Sistema responde com `<resposta>`
> 3. Cliente decide `<decisão>`
> 4. ...
>
> Tá batendo? Me corrige onde estiver errado — adiciona, tira, reordena, troca palavras."

**Why strawman and not open question:** pessoas são muito melhores reagindo do que gerando do zero. O strawman extrai o conhecimento tácito do usuário através da correção.

**If the ingested material has zero signal:** ask a very open question first:

> "Me conta o caminho feliz — o que o cliente ideal faz, do primeiro contato até conseguir o que ele veio buscar? Não precisa de detalhes, só os passos principais."

Then use a essa resposta para montar o strawman e apresentá-lo na iteração seguinte.

**Gate rule:** não siga para o Step 4 até o usuário ter validado ou corrigido explicitamente o happy path. Este é o gate contra ficção. Se o usuário está impaciente, explique: *"Preciso do seu OK nessa sequência antes de preencher detalhes — senão eu invento metade."*

### Step 4 — Probe Each Stage (Progressive Extraction)

Once the happy path is agreed, walk through each stage with concrete, accessible questions. **One stage at a time, never a bulk questionnaire.**

For each stage, probe for:

#### Quem está aqui? (personas + atores não-humanos)
- *"Nessa etapa de `<estágio>` — é sempre o mesmo tipo de cliente? Tem gente que chega de canais diferentes?"*
- *"Algum sistema externo entra aqui? API, banco, gateway, operadora, serviço de terceiro?"*

#### O que pode travar? (micro-frictions)
- *"O que costuma dar errado pro cliente nessa etapa? Onde ele trava?"*
- *"Ele entende o que é pra fazer? Entende o preço? Tem alguma decisão difícil aqui?"*

#### Se travar, pra onde ele vai? (macro-exceptions = topology hints)
- *"Se ele desistir aqui, o que acontece? Ele volta depois? Desiste de vez? Tenta outro caminho?"*
- *"Se ele voltar daqui a uma semana, continua de onde parou ou começa do zero?"*

#### Dá pra pular, ou tem ordem fixa?
- *"Ele consegue fazer `<X>` antes de `<Y>`, ou tem que ser nessa ordem?"*
- *"Tem algum estágio que algumas pessoas pulam?"*

**Rules for this step:**

- **Sempre dê um exemplo** ao perguntar. Não deixe o usuário adivinhando o que é uma resposta válida. *"Por exemplo: 'o cliente não entende se precisa cadastrar cartão antes'"* é melhor que *"o que trava?"*.
- **Aceite "não sei" como resposta válida.** Marque a célula como `[assumido — verificar com usuário real]` e siga em frente. Não force o usuário a chutar.
- **Use a pesquisa do researcher quando disponível.** Se o usuário citou Stripe, proponha fricções típicas do Stripe baseadas na síntese do researcher: *"Pelo que vi da documentação do Stripe Checkout, uma fricção típica aqui seria `<X>`. Bate com o que você tá pensando?"* — marque como `[sugerido]`.
- **Se uma NOVA lib/API/produto conhecido aparecer durante o probe** (*"ah, a jornada segue mais ou menos a API X do produto Y"*), **pare o probe imediatamente** e aplique a regra transversal 'Context7-First on Any External Reference' (ver seção antes do Execution Flow): despache o `user-journey-researcher` com context7-first antes de continuar opinando. Não trate a citação como mero esclarecimento do strawman — é input de ingestão tardia que exige pesquisa.
- **Opine com strawman quando houver contexto.** Não pergunte no vácuo. Quando tiver sinal, proponha: *"Me parece que uma fricção aqui seria `<X>`. Tá batendo?"*
- **Nunca acumule mais de 3 perguntas abertas de uma vez.** Overload trava usuário. Agrupe ou sequencie.
- **Linguagem acessível, não infantilizada.** Fale como um colega sênior que explica bem, não como tutorial pra criança.

**Topology discovery trick:** topologia é difícil de descobrir perguntando *"é linear?"* diretamente. Use em vez disso:
- Perguntar sobre abandono em cada estágio → se há abandono, há branch
- Perguntar sobre retorno → se há retorno, há loop
- Perguntar sobre ordem → se há ordem flexível, há paralelismo

### Step 5 — Synthesize the Table (Subagent)

Quando o happy path foi percorrido e os estágios sondados, escolha a variante e **despache o `user-journey-drafter` subagent** para preencher a tabela.

**Variant selection rules:**

| Condição | Use |
|---|---|
| Default / caso simples | **Pareto 3 colunas**: `Estágio \| O que o cliente quer \| O que trava` |
| Intenção e sinal de sucesso importam distintamente | **JTBD 5 colunas**: `Estágio \| Job \| Ação \| Fricção \| Sinal de sucesso` |
| Domínio emocionalmente carregado (saúde, luto, compra de alto envolvimento) | Adicionar coluna **`Emoção`** |
| Usuário pede variante específica | Honrar, mas sinalizar se parecer desnecessário |

**Apply Simplicity First aggressively.** Pareto 3-col wins if signal is ambiguous. Não escalar por precaução.

**Para payload que o drafter recebe**, veja `.claude/skills/user-journey-map/agents/user-journey-drafter.md`. O drafter retorna **apenas a tabela preenchida com marcas de proveniência** — não gera diagrama, não gera checklist, não gera fronteira PRD. Esses são responsabilidade do main context (Steps 6, 7, 8).

### Step 6 — Conditional Diagram(s)

Baseado em tudo que emergiu nos Steps 3-4, decida quais diagramas gerar (se algum).

#### Três eixos de revelação

Cada tipo de diagrama revela um eixo diferente. Gere um diagrama **por eixo que a tabela não consegue mostrar**.

- **Topologia** (caminhos, branches, loops, pontos de abandono) → `flowchart`
- **Interação** (quem-dispara-quem entre múltiplos atores) → `sequenceDiagram`
- **Ciclo de vida** (estados de uma entidade: pendente → pago → enviado) → `stateDiagram` (raro; só sob pedido explícito ou se obviamente esclarece)

#### Regras de decisão

| Característica da jornada | Diagrama |
|---|---|
| Linear, 1 ator, sem branches | **Nenhum.** Tabela basta. |
| Com branches/loops/abandono | `flowchart` |
| Coordenação multi-ator importa | `sequenceDiagram` |
| Branches **E** multi-ator | Geralmente os dois — cada um precisa justificar sua existência |
| Ciclo de vida de entidade é central | `stateDiagram` (só sob pedido) |

#### Múltiplos diagramas são permitidos
Uma jornada pode ter 1, 2 ou 3 diagramas, **um por eixo**. Nunca dois flowcharts da mesma jornada em granularidades diferentes — isso é ruído.

#### Anti-noise rule (mandatória)

Todo diagrama gerado **deve declarar em um header de uma linha o que ele revela que os outros (incluindo a tabela) não revelam**:

```
## flowchart — revela onde o usuário abandona entre buscar e pagar
## sequenceDiagram — revela coordenação entre app, gateway e banco durante cobrança
```

Se você não consegue escrever essa frase honestamente, **o diagrama não deveria existir**. Remova.

#### Mermaid `journey` type

O tipo nativo `journey` do Mermaid (com score 1-5 de satisfação) **não é usado** neste skill. É rígido, não mostra branches, e a tabela já faz melhor o que ele tenta fazer. Se o usuário pedir explicitamente, explique a limitação e sugira `flowchart`.

### Step 7 — Validation Checklist

Gere um checklist para o humano validar o documento contra a realidade. Use o template em `templates/validation-checklist.md`. O checklist é **para o humano responder**, Claude não chuta respostas.

Items marcados como ❌ ou ❓ formam um "backlog de pesquisa" — são as coisas que precisam de validação com usuários reais antes do documento virar insumo para PRD.

### Step 8 — PRD Boundary (Always)

Termine **toda jornada gerada** com este bloco verbatim:

```markdown
---

## ⚠️ Isto é jornada, não é PRD

Este documento captura o que o cliente vive, não o que o sistema faz. Para construir o software a partir daqui, o próximo passo é traduzir isto em um PRD que cubra:

- Requisitos funcionais por estágio
- Modelo de dados (entidades e relações)
- Regras de negócio e edge cases do sistema
- Estados de erro e tratamento
- Critérios de aceite
- Integrações e dependências técnicas

Sem essa tradução, qualquer LLM que tente desenvolver direto da jornada vai inventar metade das decisões. A jornada ancora o "porquê"; o PRD traduz em "o quê".
```

---

## Output Format

**File location:** `docs/journeys/<slug>.md`, onde `<slug>` é derivado do nome do produto (kebab-case, português OK). Exemplo: `docs/journeys/recarga-celular-varejo.md`.

**Create `docs/journeys/` directory** if it doesn't exist yet.

**File structure:**

```markdown
# Jornada: <Nome do Produto>

> **Status:** Rascunho | Validado
> **Data:** <YYYY-MM-DD>
> **Variante:** Pareto (3 colunas) | JTBD (5 colunas) | + Emoção
> **Fontes:** <lista de arquivos/libs consultados>

## Contexto
<1-2 parágrafos: produto, personas, atores, escopo da jornada>

## Tabela
<a tabela devolvida pelo drafter, com proveniência>

## Lacunas a validar
<lista de células [assumido] com plano de validação>

## Diagramas
<0, 1, 2 ou 3 diagramas, cada um com header "## <tipo> — revela <o quê>">

## Checklist de Validação
<o checklist>

---

## ⚠️ Isto é jornada, não é PRD
<o bloco de fronteira>
```

---

## Provenance Marks

Toda célula da tabela carrega uma marca de proveniência:

- `[validado]` — o usuário confirmou explicitamente na conversa
- `[sugerido]` — Claude propôs (strawman ou via researcher); usuário ainda não confirmou ou negou
- `[assumido]` — nem o usuário sabia nem Claude tinha sinal forte; placeholder a ser verificado com usuários reais

**Por que isso importa:** separa observação de ficção plausível. Sem essas marcas, um documento de jornada é indistinguível de alucinação. Com elas, o próximo passo (PRD) sabe onde estão as lacunas de conhecimento real.

---

## Subagents

Este skill usa dois subagents para proteger a main context window:

- **`user-journey-researcher`** — spawned para qualquer pesquisa externa. Lê arquivos grandes, usa **context7 primeiro** para libraries/APIs, retorna resumos estruturados. Nunca expõe conteúdo bruto ao main.
- **`user-journey-drafter`** — spawned para preencher a tabela após o esqueleto estar validado. Recebe os dados coletados + variante escolhida, retorna a tabela com marcas de proveniência. Nada além disso.

Definições completas em `.claude/skills/user-journey-map/agents/user-journey-researcher.md` e `.claude/skills/user-journey-map/agents/user-journey-drafter.md`.

**Regra de despacho:**
- Material longo ou múltiplos arquivos → researcher
- Citação de lib/API/produto conhecido → researcher (context7 first)
- Esqueleto pronto para virar tabela → drafter
- Tudo mais (conversa, strawman, diagramas, checklist) → main context

---

## Slash Commands

Pontos de entrada imperativos para este skill. Cada comando carrega o skill e executa um fluxo específico.

- **`/user-journey-map:create`** — inicia uma nova jornada do zero (fluxo completo: Steps 1–8)
- **`/user-journey-map:validate`** — roda o checklist de validação em uma jornada existente
- **`/user-journey-map:expand`** — adiciona uma nova jornada ao projeto (nova persona, nova área, jornada secundária), sem alterar as existentes
- **`/user-journey-map:mermaid`** — força geração ou regeneração de diagramas numa jornada existente (auto-seleciona tipos ou aceita override)
- **`/user-journey-map:audit`** — checa uma jornada existente contra as regras do skill (proveniência, anti-noise, fronteira PRD), reporta problemas sem corrigir automaticamente

Definições completas em `.claude/commands/user-journey-map/`.

---

## Templates

Referenciados ao longo do fluxo:

- `templates/journey-pareto.md` — variante 3 colunas (default)
- `templates/journey-jtbd.md` — variante 5 colunas (JTBD)
- `templates/validation-checklist.md` — bloco de checklist reutilizável

---

## Final Reminders

- **Nunca produza um PRD.** Se o usuário pedir, redirecione: *"Esse skill só produz jornada. Para PRD, podemos usar outro skill depois com este documento como insumo."*
- **Nunca pule o strawman no Step 3.** É o gate contra ficção.
- **Nunca invente fricções sem proveniência.** Se não há evidência, marque `[assumido]` e siga.
- **Sempre termine com o bloco de fronteira PRD.** Sempre. Sem exceção.
- **A North Star é o critério final.** Se em dúvida: *isto facilita o PRD?*
