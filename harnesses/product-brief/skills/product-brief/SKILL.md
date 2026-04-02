---
name: product-brief
description: >
  Interactive wizard for creating structured product briefs. Use this skill whenever the user
  mentions product brief, document a product idea, POC, MVP, feature, platform, technical spike,
  or any request to structure/document a product project — even if the user doesn't explicitly
  use the word "brief". Guides the user step by step through questions using ask_user_input_v0,
  identifies the project level, and generates a final markdown-formatted document in the
  language chosen by the user.
---

# Product Brief Wizard

This skill guides the user through an interactive wizard to generate a product brief
appropriate to the project level. It uses `ask_user_input_v0` to drive the questions.

---

## Wizard Flow

### Step 1 — Level and Language

Always start with these two questions together in a single `ask_user_input_v0`:

**Question 1:** What is the project level?
- Spike *(one-off technical investigation)*
- POC *(disposable proof of concept)*
- MVP *(minimum version to validate in the market)*
- Feature *(increment to an existing product)*
- Product *(complete solution with its own strategy)*
- Platform *(infrastructure that enables other products)*

**Question 2:** In which language should the final brief be written?
- Português
- English
- Español

---

### Step 2 — Level-Specific Questions

After identifying the level, ask the specific questions below.
Use `ask_user_input_v0` grouping related questions (max 3 per call).
Prefer multiple-choice questions when possible — use free text only when necessary.

> ⚠️ Whenever a question is **free text**, DO NOT use `ask_user_input_v0`.
> Instead, ask the question directly in the chat and wait for the answer before continuing.

---

#### SPIKE

Read template: `templates/spike.md`

**Block 1 (ask_user_input_v0):**
- What is the core technical question the spike needs to answer? *(free text — ask in chat)*
- What technology or approach is being investigated? *(free text — ask in chat)*

**Block 2 (ask_user_input_v0):**
- How much time is reserved for the spike?
  - 1 day | 2–3 days | 1 week | Undefined
- Who needs to see the result?
  - Only the technical team | PM as well | Leadership | External stakeholders

**Block 3 (ask_user_input_v0):**
- How will we know the spike answered the question?
  - We got a working prototype | We have performance data | We can estimate the real effort | Other *(ask in chat)*

---

#### POC

Read template: `templates/poc.md`

**Block 1** *(free text — ask in chat):*
- What hypothesis do you want to prove with this POC?
- What is being tested — a technology, a business approach, or both?

**Block 2 (ask_user_input_v0):**
- Who is this POC for?
  - Internal team | Investors / sponsors | Specific client | Leadership
- What is the expected timeline?
  - Up to 2 weeks | 1 month | More than 1 month | No defined timeline

**Block 3 (ask_user_input_v0):**
- Is the POC result disposable or could it evolve into production?
  - Fully disposable | Could serve as a base for an MVP | Not sure yet
- What is the main success criterion?
  - The technology works as expected | The business model makes sense | The client approved | Other *(ask in chat)*

---

#### MVP

Read template: `templates/mvp.md`

**Block 1** *(free text — ask in chat):*
- What real problem does this MVP solve?
- Who is the target user? Describe briefly.

**Block 2 (ask_user_input_v0):**
- What is the current stage of the project?
  - Just an idea | We already have user research | We already have a prototype/design | Something is already being developed
- What is the timeline to launch the MVP?
  - Less than 1 month | 1–3 months | 3–6 months | More than 6 months

**Block 3** *(free text — ask in chat):*
- What are the 3 essential features (without which the MVP doesn't exist)?

**Block 4 (ask_user_input_v0):**
- How will you measure the MVP's success?
  - Active users | Retention rate | Revenue generated | Qualitative feedback | NPS
- Is there any critical constraint?
  - Limited budget | Fixed deadline | Technical dependency | Regulation / compliance | None

---

#### FEATURE

Read template: `templates/feature.md`

**Block 1** *(free text — ask in chat):*
- Which product will this feature be added to?
- What user problem does it solve?

**Block 2 (ask_user_input_v0):**
- Where did this demand come from?
  - User research | Client request | Strategic decision | Tech debt | Data / metric
- What is the expected business impact?
  - Increase retention | Increase conversion | Reduce churn | Increase revenue | Improve operational efficiency

**Block 3 (ask_user_input_v0):**
- What is the estimated size of this feature?
  - Small (days) | Medium (weeks) | Large (months)
- Are there dependencies with other teams or systems?
  - Yes *(ask in chat which ones)* | No | Not sure yet

---

#### PRODUCT

Read template: `templates/product.md`

**Block 1** *(free text — ask in chat):*
- What is the product name or codename?
- What problem does it solve and for whom?

**Block 2 (ask_user_input_v0):**
- What is the expected business model?
  - SaaS / subscription | Marketplace | Freemium | License | Service + software | Still undefined
- What stage is it at?
  - Idea | Discovery in progress | Validated with users | In development | Already generating revenue

**Block 3** *(free text — ask in chat):*
- Who are the main competitors or alternatives the user relies on today?

**Block 4 (ask_user_input_v0):**
- What is the biggest risk for this project?
  - Problem isn't relevant enough | Technical solution not viable | Market too small | Team doesn't have the right profile | Dominant competitor
- What is the planning horizon?
  - 3 months | 6 months | 1 year | More than 1 year

**Block 5** *(free text — ask in chat):*
- What would success look like for this product in 6 months?

---

#### PLATFORM

Read template: `templates/platform.md`

**Block 1** *(free text — ask in chat):*
- What capability will this platform provide?
- Who are the consumers — internal teams, external developers, or both?

**Block 2 (ask_user_input_v0):**
- Which products or teams will be enabled by this platform?
  - Existing internal teams | New internal products | External partners | Third-party developers | All of the above
- What is the adoption model?
  - Mandatory for internal teams | Internal opt-in | Public API | Marketplace / ecosystem

**Block 3** *(free text — ask in chat):*
- What are the main trade-offs the platform needs to address? (e.g., flexibility vs. standardization, speed vs. security)

**Block 4 (ask_user_input_v0):**
- Is there a defined governance model?
  - Yes, centralized | Yes, federated | Not yet
- What is the biggest risk?
  - Low adoption | Underestimated technical complexity | Unclear ownership | Scope too broad

---

## Step 3 — Brief Generation

After collecting all answers:

1. Read the corresponding level template at `templates/<level>.md`
2. Fill in the template with the collected answers
3. For fields without an answer, leave `[to be defined]` or omit the section when irrelevant
4. Generate the document in the language chosen by the user
5. Deliver the complete brief as a **markdown artifact**
6. At the end, offer: *"Would you like to adjust any section or add more details?"*

### Generation Rules

- **Be concise**: A brief is not a PRD. Avoid padding sections with generic text.
- **Preserve the user's voice**: Use the words they chose, don't replace them with jargon.
- **Be honest about gaps**: If information wasn't collected, clearly state it needs to be defined.
- **Spike/POC level**: The brief should fit on 1 page. Cut anything non-essential.
- **Product/Platform level**: Can be longer, but keep each section objective.

---

## Template Reference

| Level | File | Key Sections |
|-------|------|-------------|
| Spike | `templates/spike.md` | Question, Approach, Completion criteria, Timebox |
| POC | `templates/poc.md` | Hypothesis, What is being tested, Success criteria, Next steps |
| MVP | `templates/mvp.md` | Problem, User, Solution, Must-haves, Metrics, Constraints |
| Feature | `templates/feature.md` | Context, Problem, Expected impact, Scope, Dependencies |
| Product | `templates/product.md` | Vision, Problem, Market, Business model, Risks, Success |
| Platform | `templates/platform.md` | Capability, Consumers, Enabled products, Governance, Adoption, Risks |
