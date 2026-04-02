---
name: ui:export
description: Generate service-specific prompts and exports for external design tools
argument-hint: "[service: stitch|v0|figma|pencil|generic] [screen: SCR-XX (optional)]"
allowed-tools: [Read, Write, Glob, Grep, AskUserQuestion, Task]
agent: ui-prompter (for complex exports)
---

<objective>
Transform UI specifications into service-optimized outputs. Generate prompts for AI design tools (Stitch, V0), export formats for design applications (Figma), or execute designs directly via MCP (Pencil). Uses service-specific adapters to ensure optimal output generation.
</objective>

<context>
@./.claude/ui-design/adapters/stitch.md
@./.claude/ui-design/adapters/v0.md
@./.claude/ui-design/adapters/figma.md
@./.claude/ui-design/adapters/pencil.md
@./.claude/ui-design/adapters/generic.md
@.harn/design/UI-SPEC.md (required)
@.harn/design/screens/*.md (required)
@.harn/design/COMPONENTS.md (recommended)
@.harn/design/design-tokens.json (recommended)
</context>

<ux_principles>
## Service Selection

If no service specified, offer quick selection:

**Question: Which service to export for?**

Options:
- Stitch — Visual design generation (recommended for high-fidelity mockups)
- V0 — React component generation (recommended for implementation)
- Figma — Token export + setup guide
- Pencil — Direct design execution via MCP (recommended for rapid prototyping)
- Generic — Tool-agnostic prompts

## Scope Selection

Allow exporting:
- All screens (default)
- Specific screen(s) by ID
- Screens needing regeneration (drift detected)
</ux_principles>

<process>

<step name="parse_arguments">
## Parse Arguments

Parse the command arguments:
- `stitch` → Google Stitch prompts
- `v0` → Vercel V0 prompts
- `figma` → Figma token export + setup
- `pencil` → Direct Pencil MCP execution
- `generic` → Tool-agnostic prompts (default if no argument)

Optional screen filter:
- `SCR-01` → Export single screen
- `SCR-01,SCR-02,SCR-03` → Export multiple screens
- No filter → Export all screens

Examples:
- `/ui:export stitch` → All screens to Stitch
- `/ui:export v0 SCR-01` → Single screen to V0
- `/ui:export figma` → Full Figma setup
- `/ui:export pencil` → Direct design execution
- `/ui:export pencil SCR-01` → Single screen to Pencil
</step>

<step name="verify_prerequisites">
## Verify Prerequisites

Check required files exist:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 UI ► EXPORT PREREQUISITES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking requirements for [service] export...

✓ UI-SPEC.md              Found
✓ Screen specs            [N] screens found
○ COMPONENTS.md           Optional (adds detail)
○ design-tokens.json      Optional (adds precision)

[If missing required]
✗ Screen specs missing - run /ui:design-screens first

───────────────────────────────────────────────────────
```

If required files missing:
- Inform user what's needed
- Suggest command to run
- Exit gracefully
</step>

<step name="load_adapter">
## Load Service Adapter

Load adapter from `./.claude/ui-design/adapters/[service].md`:

The adapter provides:
- **transformation_rules** — How to convert specs
- **token_mapping** — Convert tokens to service format
- **component_descriptions** — Service-specific language
- **capability_matrix** — What the service supports
- **iteration_guidance** — Refinement patterns
</step>

<step name="spawn_prompter_or_handle">
## Generate Prompts

**For Pencil service (any screen count 2+):**
- Use the **orchestrator + subagent** pattern (see transform_to_pencil step)
- Orchestrator handles setup (open file, set variables, get components)
- Each screen gets its own **ui-pencil-screen** subagent in a fresh context window
- All screen agents run **in parallel** for maximum efficiency
- This prevents context window exhaustion from per-screen MCP operations

**For Pencil service (1 screen only):**
- Handle directly without spawning (single screen fits in context)

**For other services (Stitch, V0, Figma, Generic) with 5+ screens:**
- Spawn UI Prompter agent with full context
- Agent handles all transformations
- Returns complete prompt set

**For other services with 1-4 screens:**
- Handle directly without spawning
- Apply adapter rules sequentially
</step>

<step name="transform_to_stitch">
## Stitch Export

For each screen, generate Stitch-optimized prompt:

```markdown
# Stitch Prompts

Generated: [date]
Source: UI specifications
Screens: [N] total

---

## SCR-01: Login

### Prompt

```
Create a modern login screen with the following specifications:

**Layout:**
Full-page layout with centered content card on subtle gray background (#F8FAFC).
Card is elevated with soft shadow, rounded corners (8px).
Maximum width 400px, vertically centered.

**Components:**
- Logo at top of card
- "Welcome back" heading with "Sign in to your account" subtitle
- Email input with label "Email address"
- Password input with label "Password" and show/hide toggle
- Primary blue button (#2563EB) "Sign in" - full width
- "Forgot password?" link below button
- Divider with "or continue with" text
- Google and GitHub social sign-in buttons
- "Don't have an account? Sign up" footer link

**Visual Style:**
- Clean, minimal aesthetic
- Inter or system font
- Primary blue: #2563EB
- Text dark slate: #0F172A
- Muted text: #64748B
- Subtle shadows, not flat

**States to show:**
- Default state (primary view)
```

### Iteration Guidance

**If layout is wrong:**
```
Adjust: Move [element] to [position]. Card should be centered both horizontally and vertically.
```

**If colors are off:**
```
Adjust: Change primary button to #2563EB. Background should be #F8FAFC, not pure white.
```

**If components missing:**
```
Add: Include a "Forgot password?" text link below the submit button.
```

### Handoff
→ See: handoffs/SCR-01-brief.md

---
```
</step>

<step name="transform_to_v0">
## V0 Export

For each screen, generate V0-optimized prompt:

```markdown
# V0 Prompts

Generated: [date]
Source: UI specifications
Screens: [N] total

---

## SCR-01: Login Page

### Prompt

```
Create a login page using shadcn/ui components with the following:

**Container:**
- Full viewport height
- Centered content using flexbox
- Background: bg-slate-50

**Card (shadcn/ui Card):**
- max-w-md mx-auto
- CardHeader with title "Welcome back" and description "Sign in to your account"
- CardContent with form
- CardFooter with signup link

**Form (react-hook-form + zod):**
- Email input (Input component, type="email", required)
- Password input (Input component, type="password", required)
- Submit button (Button variant="default", full width)
- Form validation with zod schema

**Additional elements:**
- "Forgot password?" link (Link component)
- Separator with "or continue with" text
- Social buttons: Google, GitHub (Button variant="outline")
- Footer: "Don't have an account?" with Link to /signup

**Form behavior:**
- Client-side validation
- Loading state on submit
- Error display using form field errors

**Accessibility:**
- Focus first input on mount
- Proper label associations
- Error announcements
```

### Expected Output
- File: `src/components/auth/login-form.tsx`
- shadcn/ui: Card, CardHeader, CardContent, CardFooter, Button, Input, Label, Separator
- Dependencies: react-hook-form, @hookform/resolvers, zod

### TypeScript Interface
```typescript
interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}
```

### Iteration Guidance

**If using wrong components:**
```
Use shadcn/ui Card instead of custom div. Import from @/components/ui/card.
```

**If form validation missing:**
```
Add zod schema validation with zodResolver from @hookform/resolvers/zod.
```

---
```
</step>

<step name="transform_to_figma">
## Figma Export

Generate Figma-compatible outputs:

### figma-tokens.json
```json
{
  "$schema": "https://design-tokens.org/schema.json",
  "collections": {
    "Primitives": {
      "Blue": {
        "50": { "$value": "#EFF6FF", "$type": "color" },
        "100": { "$value": "#DBEAFE", "$type": "color" },
        "500": { "$value": "#3B82F6", "$type": "color" },
        "600": { "$value": "#2563EB", "$type": "color" },
        "700": { "$value": "#1D4ED8", "$type": "color" }
      }
    },
    "Semantic": {
      "Primary": {
        "Default": { "$value": "{Primitives.Blue.600}", "$type": "color" },
        "Hover": { "$value": "{Primitives.Blue.700}", "$type": "color" },
        "Foreground": { "$value": "#FFFFFF", "$type": "color" }
      },
      "Background": {
        "Default": { "$value": "#FFFFFF", "$type": "color" },
        "Subtle": { "$value": "#F8FAFC", "$type": "color" }
      }
    }
  },
  "modes": {
    "Light": "default",
    "Dark": {
      "Semantic.Background.Default": "#0F172A",
      "Semantic.Background.Subtle": "#1E293B"
    }
  }
}
```

### figma-setup.md
```markdown
# Figma Setup Guide

## 1. Import Variables

1. Open your Figma file
2. Right-click in canvas → Plugins → Tokens Studio (or Figma Variables)
3. Import `figma-tokens.json`
4. Variables will appear in your Local Variables panel

## 2. Create Component Library

For each component in COMPONENTS.md:

### Button
1. Create frame 40x40px (md size)
2. Add text layer "Button"
3. Apply variables:
   - Fill: Primary/Default
   - Text: Primary/Foreground
   - Corner radius: 6px
4. Create variants: primary, secondary, ghost, destructive
5. Add size variants: sm (32px), md (40px), lg (48px)

[Continue for each component...]

## 3. Build Screen Frames

| Screen | Frame Size | Notes |
|--------|------------|-------|
| SCR-01: Login | 1440x900 (desktop) | Also create 375x812 mobile |
| SCR-02: Signup | 1440x900 (desktop) | Same structure as Login |

## 4. Prototyping

Connect screens per navigation flows in UI-SPEC.md.
```
</step>

<step name="transform_to_pencil">
## Pencil Export (Direct Execution) — ORCHESTRATOR PATTERN

Unlike other adapters, Pencil executes designs directly via MCP tools. To prevent context window exhaustion when exporting multiple screens, this uses an **orchestrator + subagent** architecture: the orchestrator handles setup and coordination, while each screen is processed by a dedicated subagent in its own context window.

### Orchestrator Step 1: Pre-flight and Setup

```javascript
// 1. Check/open the .pen file
mcp__pencil__get_editor_state({ include_schema: false })

// 2. Open or verify the target file
mcp__pencil__open_document({ filePathOrTemplate: ".harn/design/pencil/app.pen" })

// 3. Sync design tokens to Pencil variables (ONE TIME for all screens)
mcp__pencil__set_variables({
  filePath: ".harn/design/pencil/app.pen",
  variables: {
    "primary": { "$value": "#2563EB", "type": "color" },
    "primary-foreground": { "$value": "#FFFFFF", "type": "color" },
    "background": { "$value": "#F8FAFC", "type": "color" },
    "foreground": { "$value": "#0F172A", "type": "color" },
    "muted": { "$value": "#64748B", "type": "color" },
    "border": { "$value": "#E2E8F0", "type": "color" }
    // ... extracted from design-tokens.json
  }
})

// 4. Get existing reusable components (for subagent context)
mcp__pencil__batch_get({
  filePath: ".harn/design/pencil/app.pen",
  patterns: [{ reusable: true }],
  readDepth: 2
})

// 5. Get existing screens to detect updates vs creates
mcp__pencil__batch_get({
  filePath: ".harn/design/pencil/app.pen",
  patterns: [{ name: "SCR-.*" }],
  readDepth: 1
})
```

### Orchestrator Step 2: Prepare per-screen context

For each screen to export, prepare a self-contained context bundle:
- Screen spec content (inlined)
- Design tokens (inlined)
- Available reusable components and their IDs
- Existing node ID (if updating)
- Pencil adapter operation syntax rules

### Orchestrator Step 3: Spawn parallel subagents

**For single screen:** Handle directly without subagent (same as before).

**For 2+ screens:** Spawn one **ui-pencil-screen** agent per screen using the Task tool. Launch **all agents in parallel**.

```
For each screen (SCR-XX) to export:
  Task(
    subagent_type: "general-purpose",
    description: "Export SCR-XX to Pencil",
    prompt: """
    You are a UI Pencil Screen Agent. Your job is to create/update exactly
    ONE screen in a Pencil .pen design file using MCP tools.

    Read the agent instructions: ./.claude/agents/ui-pencil-screen.md

    OPERATION: push

    PEN FILE: .harn/design/pencil/app.pen

    EXISTING NODE ID: {node_id or "none"}

    SCREEN SPEC:
    ---
    {inline full content of .harn/design/screens/SCR-XX-name.md}
    ---

    DESIGN TOKENS:
    {inline design-tokens.json}

    AVAILABLE COMPONENTS:
    {list of reusable component names and IDs}

    ADAPTER RULES SUMMARY:
    - Use I() for Insert, U() for Update, R() for Replace, C() for Copy
    - Max 25 operations per batch_design call — split if needed
    - Always validate with get_screenshot after creation
    - Use meaningful node names with SCR-XX prefix
    - Node types: frame, text, rectangle, ellipse, ref, group
    - Layout: "horizontal", "vertical", "grid"
    - Sizing: number, "fill_container", "hug_content"

    Execute the push and return a structured result including:
    - screen ID, status, node_id, operations count, any issues
    """
  )
```

**IMPORTANT:** All screen agents run **in parallel** — each gets its own fresh context window and processes its screen independently.

### Orchestrator Step 4: Collect results and finalize

After all subagents complete:

1. Collect node IDs from each agent's result
2. Update pencil-state.json with screen-to-node mappings
3. Update UI-REGISTRY.md with export status
4. Write pencil-operations.md log

### Output Log

```markdown
# Pencil Operations Log

Generated: [date]
File: .harn/design/pencil/app.pen
Screens: [N] total
Method: Parallel subagents (1 per screen)

## Results

| Screen | Status | Node ID | Operations | Screenshot |
|--------|--------|---------|------------|------------|
| SCR-01 | ✓ Created | screen_abc123 | 18 ops | Validated |
| SCR-02 | ✓ Created | screen_def456 | 22 ops | Validated |
| SCR-03 | ✓ Created | screen_ghi789 | 25 ops | Validated |

## Per-Screen Details

### SCR-01: Login
**Node ID:** screen_abc123
**Status:** Generated
**Agent:** Completed in own context window
**Screenshot:** Validated ✓

### SCR-02: Signup
**Node ID:** screen_def456
**Status:** Generated
**Agent:** Completed in own context window
**Screenshot:** Validated ✓

[... repeat for each screen]
```
</step>

<step name="transform_to_generic">
## Generic Export

For each screen, generate tool-agnostic prompt:

```markdown
# Generic UI Prompts

Generated: [date]
Source: UI specifications
Screens: [N] total

Note: These prompts use universal language and work with any design tool.

---

## SCR-01: Login Screen

### Prompt

```
Design a login screen with these specifications:

LAYOUT:
- Full page with content centered both horizontally and vertically
- Main content area is a card/panel, maximum 400 pixels wide
- Background is very light gray (almost white)

CARD STRUCTURE (top to bottom):
1. Application logo at top
2. Large heading: "Welcome back"
3. Smaller subheading: "Sign in to your account"
4. Form with:
   - Email field with label above
   - Password field with label above and show/hide option
   - Large primary button spanning full width of form
5. "Forgot password?" link
6. Horizontal divider with "or" text
7. Two secondary buttons for Google and GitHub sign-in
8. Footer text: "Don't have an account?" with "Sign up" link

VISUAL DETAILS:
- Card has subtle drop shadow and slightly rounded corners
- Primary button is bright blue
- Input fields have light gray borders
- Text uses dark colors for headings, medium gray for secondary text
- Clean, modern, minimal aesthetic
- Sans-serif font throughout

SPACING:
- Generous padding inside the card (24-32 pixels)
- Comfortable spacing between form elements (16-20 pixels)
- Button has vertical padding for easy clicking
```

### What to look for:
- [ ] Card is centered on page
- [ ] Form elements are properly labeled
- [ ] Primary button is visually prominent
- [ ] Social buttons are secondary in style
- [ ] Overall clean, professional appearance

---
```
</step>

<step name="create_handoffs">
## Create Handoff Documents

For each exported screen, create handoff brief:

```markdown
# Design Handoff: SCR-01 Login

## Visual Checklist

### Layout
- [ ] Card centered horizontally and vertically
- [ ] Max width 400px
- [ ] Background color: #F8FAFC

### Typography
- [ ] Heading: 24px, semibold
- [ ] Subheading: 14px, regular, muted color
- [ ] Input labels: 14px, medium

### Colors
- [ ] Primary button: #2563EB
- [ ] Button text: #FFFFFF
- [ ] Input border: #E2E8F0
- [ ] Body text: #0F172A
- [ ] Muted text: #64748B

### Spacing
- [ ] Card padding: 24px
- [ ] Form gap: 16px
- [ ] Button padding: 12px vertical

### Components Used
| Component | Variant | Count |
|-----------|---------|-------|
| Button | primary | 1 |
| Button | outline | 2 |
| Input | default | 2 |
| Separator | with-text | 1 |
| Link | default | 2 |

### States to Design
- [ ] Default (required)
- [ ] Loading (submit in progress)
- [ ] Error (validation failed)
```
</step>

<step name="update_registry">
## Update Registry

Update `.harn/design/UI-REGISTRY.md`:

```markdown
## Export History

| Screen | Stitch | V0 | Figma | Pencil | Generic | Last Export |
|--------|--------|----|-------|--------|---------|-------------|
| SCR-01 | ✓ v2 | ✓ v1 | ✓ | ✓ screen_abc | ✓ | 2026-01-19 |
| SCR-02 | ✓ v1 | ✓ v1 | ✓ | ✓ screen_def | ✓ | 2026-01-19 |
| SCR-03 | ○ | ○ | ○ | ○ | ○ | - |
```
</step>

<step name="update_state">
## Update State

Update `.harn/design/ui-state/coordinator-state.json`:
```json
{
  "project_status": {
    "exports_generated": {
      "stitch": [N],
      "v0": [N],
      "figma": true/false,
      "pencil": {
        "count": [N],
        "file": ".harn/design/pencil/app.pen",
        "node_mapping": {
          "SCR-01": "screen_abc123",
          "SCR-02": "screen_def456"
        }
      },
      "generic": [N]
    }
  }
}
```
</step>

<step name="completion">
## Completion Summary

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 UI ► EXPORT COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Service:  [stitch/v0/figma/generic]
Screens:  [N] prompts generated

Prompts:
  ✓ SCR-01: Login           → stitch-prompts.md#scr-01
  ✓ SCR-02: Signup          → stitch-prompts.md#scr-02
  ✓ SCR-03: Dashboard       → stitch-prompts.md#scr-03

Handoffs:
  ✓ handoffs/SCR-01-brief.md
  ✓ handoffs/SCR-02-brief.md
  ✓ handoffs/SCR-03-brief.md

Files:
  .harn/design/ui-exports/[service]-prompts.md (or pencil-operations.md)
  .harn/design/ui-exports/handoffs/*.md
  .harn/design/pencil/app.pen (for Pencil exports)

───────────────────────────────────────────────────────

## How to Use

[For Stitch]
1. Open stitch.new
2. Copy prompt from stitch-prompts.md
3. Paste and generate
4. If iteration needed, use refinement guidance
5. Export as Figma/HTML/Flutter

[For V0]
1. Open v0.dev
2. Copy prompt from v0-prompts.md
3. Generate component
4. Click "Add to Codebase" or use `npx v0 add`
5. Review and customize generated code

[For Figma]
1. Import figma-tokens.json using Variables panel
2. Follow setup guide in figma-setup.md
3. Build components from COMPONENTS.md specs
4. Create screens following screen specs

[For Pencil]
1. Designs executed directly via MCP
2. Screenshots captured for validation
3. Review pencil-operations.md for details
4. Iterate with Update operations if needed
5. Node IDs recorded for future reference

───────────────────────────────────────────────────────

## ▶ After Generation

**Track realization** — Mark screens as realized

`/ui:realize SCR-01`

**Iterate on prompts** — Refine if results need adjustment

`/ui:export [service] SCR-01` (regenerate single screen)

**Import back** — If design drifted from spec

`/ui:import-design`

───────────────────────────────────────────────────────
```
</step>

</process>

<success_criteria>
- Export files created in `.harn/design/ui-exports/`
- All specified screens have corresponding prompts (or designs for Pencil)
- Prompts follow service adapter best practices
- Handoff documents generated for each screen
- Design tokens included where applicable
- Clear usage instructions provided
- Registry and state updated

**Pencil-specific criteria:**
- Designs executed successfully via batch_design (one subagent per screen)
- Screenshots captured for visual validation (by each subagent)
- Node IDs recorded in registry for future updates (collected by orchestrator)
- Variables synced from design tokens (once by orchestrator before spawning agents)
- All screen agents ran in parallel for maximum efficiency
- Orchestrator context remained lean (no MCP tool call bloat)
</success_criteria>
