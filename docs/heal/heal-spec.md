# Heal Skill — Specification

## Purpose

This skill is invoked manually by the user immediately after a problem occurs during a Claude Code session. Its purpose is to analyze what went wrong, formulate a corrective solution, execute approved fixes on the harness (skills, rules, CLAUDE.md), and persist a structured changelog that serves as context for future incident analysis.

The skill is an **orchestrator**. It delegates context-heavy operations to subagents to protect the main context window, which is typically already compromised when the user invokes this skill.

## When to Trigger

The user explicitly invokes this skill after experiencing an unexpected outcome. Examples:
- A skill executed but produced wrong output
- A slash command behaved incorrectly
- Code implementation didn't match expectations
- The agent misinterpreted a request
- The agent chose the wrong approach or skipped steps
- A rule in CLAUDE.md caused or allowed undesired behavior

The user may provide a brief description of the problem, but the primary source of truth is the conversation history — the skill mines it directly.

## Design Principles

1. **The skill is a thin orchestrator.** It manages the flow, interacts with the user, and delegates heavy work to agents. It never loads target files or full changelogs into its own context window.

2. **Agents are context window firewalls.** They are spawned for phases that require reading files, cross-referencing history, or executing changes. Each agent receives only the data it needs and returns only structured results.

3. **Convention over configuration.** Directory structure, file naming, and ID generation follow fixed conventions. No configuration files needed.

4. **Deterministic persistence.** The changelog is modified by a CLI script, not by direct JSON manipulation. This guarantees schema integrity and atomic updates.

5. **Human-in-the-loop.** The user confirms severity, approves the solution (with iterative refinement), and triggers execution. Nothing is applied without explicit approval.

6. **Analytical framework.** The analysis combines Post-Mortem (timeline → cause → action), Bow-Tie (categorize where the failure occurred and whether to prevent or mitigate), and FMEA (severity and recurrence assessment to prioritize corrections).

---

## Execution Flow

### Phase 1 — Triage
- **Executor:** Skill (direct)
- **What happens:** The skill mines the current conversation to reconstruct what happened: what was requested, what was executed, where it deviated, how it was corrected, and what the final output was. It identifies the affected component (which skill, command, rule file, or orchestration phase). It proposes a severity level and asks the user to confirm via interactive input (low / medium / high / critical). Does not advance without confirmation.
- **Output:** Incident summary + confirmed severity + identified component

### Phase 2 — Load History
- **Executor:** Skill (direct)
- **What happens:** Reads `.claude/heal/index.json`. If the component has history, loads the corresponding JSON file. **Idempotent**: pure read, no side effects, no file creation, no state mutation. If the file doesn't exist, returns empty context. Never creates structure in this phase.
- **Output:** Component history (or empty if first incident)

### Phase 3 — Root Cause Analysis
- **Executor:** Agent
- **Why agent:** Cross-referencing the incident with potentially large history is context-heavy.
- **Agent receives:** Incident summary (from Phase 1) + component history JSON (from Phase 2)
- **What happens:** The agent diagnoses the root cause. Determines the `layer` (see enums below). Cross-references with history to detect recurrence — if the problem is a variation of a previous entry, notes it. If it's recurrence, the agent flags that the previous correction was insufficient. Assigns a `confidence` level to the diagnosis.
- **Agent returns:** Structured `root_cause` object with `layer`, `detail`, and `confidence`

### Phase 4 — Solution Formulation
- **Executor:** Agent
- **Why agent:** Needs to read target files to understand current state (where to insert, what already exists, potential conflicts).
- **Agent receives:** `root_cause` (from Phase 3) + list of target file paths
- **What happens:** The agent reads target files, formulates the `solution` block with a `description` (reasoning: why the problem happened and why the solution resolves it) and `actions` array. Each action has deterministic `steps` — not vague instructions but precise, executable steps.
- **Agent returns:** Complete `solution` object

### Phase 5 — Collaborative Review
- **Executor:** Agent per iteration
- **Why agent:** Each refinement cycle may require re-reading target files or re-analyzing history.
- **What happens:** The skill presents the full diagnosis (with confidence) and proposed solution to the user. Asks if the user is satisfied or wants to discuss. **This is a loop**: if the user suggests changes, points out issues, or wants a different approach, the skill spawns an agent to revise the plan based on feedback. The revised plan is presented again. The loop only exits when the user explicitly approves. The agent should also flag if user suggestions conflict with historical entries.
- **Agent receives (per iteration):** Current plan + user feedback + relevant history/files if needed
- **Agent returns:** Revised solution
- **Output:** User-approved solution

### Phase 6 — Execution Plan
- **Executor:** Skill (direct)
- **What happens:** Transforms the approved solution into an ordered todo list. Each item maps to one action from the solution block, with its steps. This todo list is the contract for Phase 7 — nothing is executed outside of it.
- **Output:** Ordered todo list

### Phase 7 — Execution
- **Executor:** Agent(s)
- **Why agent:** Each action requires reading the target file, applying changes, and validating results.
- **Agent receives:** One action (or group of actions on the same target) + target file path
- **What happens:** The agent reads the file, executes the steps deterministically, validates the result, and reports success or failure. The skill receives only the status — never the file contents.
- **Agent returns:** Status per action (applied | failed + reason)

### Phase 8 — Changelog Persistence
- **Executor:** Agent
- **Why agent:** Runs CLI and validates the full JSON for integrity.
- **What happens:** The agent assembles the complete entry from all phase outputs. Invokes a CLI script that:
  1. Receives the serialized entry as argument
  2. Validates the entry against the schema
  3. Appends to the component JSON file (creates it if first entry, following directory conventions)
  4. Ensures the ID is unique and sequential
  5. Updates `index.json` atomically (entry count, last_entry date, last_updated)
  6. Validates the JSON after write
  7. Returns exit code (0 = success, non-zero = failure with reason)
  If the CLI fails, no partial write occurs.
- **Agent returns:** ok | error with detail

### Phase 9 — Audit
- **Executor:** Agent
- **Why agent:** Needs to read all modified targets and the full changelog.
- **What happens:** The agent generates and executes an audit plan as a checklist:
  - **Target verification:** For each action marked as `applied` in Phase 7, read the target file and confirm the expected change is present.
  - **Changelog integrity:** Verify the new entry exists in the component JSON, ID is correct and sequential, `index.json` is updated and consistent, JSON is valid.
  - **Rule consistency:** Check that newly added rules don't conflict with existing rules in the same file or related files.
  Each audit item is executed and reported as pass/fail.
- **Agent returns:** Audit report (pass/fail per item, detail on failures)

---

## Directory Structure

```
.claude/heal/
├── index.json                          # Global index
├── skills/
│   └── <skill-name>.json              # e.g., xlsx.json, docx.json
├── commands/
│   └── <command-name>.json            # e.g., slash-fix.json
├── code/
│   └── <domain>.json                  # e.g., react-components.json, api-integration.json
├── orchestration/
│   └── <phase>.json                   # e.g., plan.json, research.json
├── environment/
│   └── <domain>.json                  # e.g., dependencies.json
└── rules/
    └── <domain>.json                  # e.g., claude-md.json, security-rules.json
```

If a category directory doesn't exist, the skill creates it following the convention. File names are kebab-case.

---

## Data Schema

### index.json

```json
{
  "last_updated": "2026-04-02T09:15:00Z",
  "total_entries": 14,
  "components": {
    "skill:xlsx": {
      "path": "skills/xlsx.json",
      "entry_count": 3,
      "last_entry": "2026-04-02"
    },
    "orchestration:plan": {
      "path": "orchestration/plan.json",
      "entry_count": 2,
      "last_entry": "2026-04-01"
    }
  }
}
```

### Component JSON (e.g., skills/xlsx.json)

```json
{
  "component": "skill:xlsx",
  "entries": [
    {
      "id": "xlsx-001",
      "timestamp": "2026-03-29T14:32:00Z",
      "severity": "high",
      "summary": "Gráfico gerado com eixo Y invertido ao usar valores negativos no dataset",
      "root_cause": {
        "layer": "skill",
        "detail": "A skill de xlsx não trata valores negativos no dataset ao configurar o range do eixo Y via openpyxl. O min/max é calculado sem considerar sinal, resultando em eixo invertido.",
        "confidence": "high"
      },
      "solution": {
        "description": "O openpyxl não ajusta automaticamente o range do eixo Y quando o dataset contém valores negativos. A correção imediata foi calcular min/max explicitamente com tratamento de sinal. A prevenção exige que a skill sempre valide o range dos dados antes de gerar qualquer gráfico, e que exista uma regra global para validação de dados em visualizações.",
        "actions": [
          {
            "type": "update",
            "target": "/mnt/skills/user/xlsx/SKILL.md",
            "status": "applied",
            "detail": "Na seção de charting, adicionar: 'Ao gerar gráficos, sempre calcular min/max explicitamente considerando valores negativos. Nunca confiar no auto-range do openpyxl para datasets que possam conter negativos.'",
            "steps": [
              "Ler /mnt/skills/user/xlsx/SKILL.md",
              "Localizar a seção de charting/gráficos",
              "Adicionar o parágrafo de validação de range após as instruções existentes de configuração de eixos",
              "Validar que o markdown está bem formado"
            ]
          },
          {
            "type": "add",
            "target": ".claude/rules/data-visualization.md",
            "status": "applied",
            "detail": "Regra: 'Antes de gerar qualquer gráfico, validar o range dos dados: verificar presença de valores negativos, zeros, e outliers extremos. Ajustar configuração de eixos explicitamente com base na análise.'",
            "steps": [
              "Verificar se .claude/rules/data-visualization.md existe",
              "Se não existir, criar com header: '# Regras de Visualização de Dados'",
              "Adicionar a regra na seção de validação",
              "Validar que o markdown está bem formado"
            ]
          }
        ]
      },
      "related_entries": []
    }
  ]
}
```

---

## Enums

### severity
| Value | Definition |
|-------|-----------|
| `low` | Corrected without impact on final output |
| `medium` | Required partial rework |
| `high` | Delivered output was wrong |
| `critical` | Silent failure — output appeared correct but wasn't |

### confidence
| Value | Definition |
|-------|-----------|
| `high` | Cause is evident in context (clear error, stack trace, reproducible) |
| `medium` | Cause is probable but alternative hypotheses exist |
| `low` | Inference with insufficient information |

### layer
| Value | Definition |
|-------|-----------|
| `skill` | Bug or limitation in the skill |
| `command` | Slash command failure |
| `code` | Inadequate code implementation |
| `environment` | Dependency, permission, network, infrastructure |
| `rule` | Directive in CLAUDE.md or rules caused or allowed the problem |
| `orchestration:advise` | Failure in the advise phase |
| `orchestration:research` | Failure in the research phase |
| `orchestration:plan` | Failure in the planning phase |
| `orchestration:implement` | Failure in the implementation phase |
| `orchestration:ai-validation` | Failure in agent validation |
| `orchestration:human-validation` | Failure in human validation |
| `orchestration:retrospective` | Failure in the retrospective phase |

### action type
| Value | Definition |
|-------|-----------|
| `add` | Create new content in the target |
| `update` | Modify existing content in the target |
| `remove` | Remove content from the target |

### action status
| Value | Definition |
|-------|-----------|
| `pending` | Approved but not yet executed |
| `applied` | Executed successfully |

---

## ID Generation

Convention: `<component-short-name>-<sequential-number>`

The sequential number comes from `entry_count` in `index.json` + 1. Examples:
- `xlsx-001`, `xlsx-002`
- `plan-001`, `plan-002`
- `react-components-001`

The CLI script in Phase 8 is responsible for guaranteeing uniqueness and sequentiality.

---

## CLI Script for Changelog Persistence (Phase 8)

The skill must include or generate a CLI script (shell or Node.js) with the following contract:

**Input:** Serialized entry as JSON argument
**Operations:**
1. Parse and validate entry against schema
2. Determine target file from component key + directory convention
3. If file doesn't exist, create it with component key and empty entries array
4. Append entry to entries array
5. Update index.json: increment entry_count, update last_entry and last_updated
6. Validate resulting JSON files (component + index)
7. Exit 0 on success, non-zero on failure with error message to stderr

**Guarantees:**
- No partial writes (validate before and after)
- Atomic index.json update
- ID uniqueness check before write

---

## Notes on Context Window Management

When this skill is invoked, the conversation context window is typically already heavily used. The skill must be aggressive about protecting what remains:

- **Phases 1, 2, 6 are lightweight** — the skill handles them directly.
- **Phases 3, 4, 5 use agents** because they require loading and analyzing data (history, target files) that would bloat the skill's context.
- **Phases 7, 8, 9 use agents** because they require reading/writing files and running validation.
- **The skill's context window should only ever contain:** the incident summary, confirmed severity, the structured outputs returned by agents (root_cause, solution, plan, statuses, audit report), and the user interaction. Never raw file contents or full changelog data.
