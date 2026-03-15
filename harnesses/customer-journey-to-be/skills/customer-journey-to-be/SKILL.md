---
name: customer-journey-to-be
description: >
  Generate a to-be customer journey map that describes the projected user experience
  for a product or feature. Use this skill whenever the user wants to map out user flows,
  design the intended customer experience, plan how users will navigate a product,
  or create journey documentation for a new or redesigned feature. Triggers on phrases like
  "customer journey", "user journey", "journey map", "user flow", "experience map",
  "how will the user interact with", or any request to design or document the intended
  path a user takes through a product.
license: MIT
metadata:
  version: 1.0.0
  author: hgflima
keywords:
  - customer-journey
  - user-experience
  - to-be
  - user-flow
  - product-design
---

# Customer Journey To-Be

Design and document the projected customer journey for a product or feature. This is NOT
an as-is analysis of current pain points and emotions — it is a to-be blueprint that
describes how users **will** interact with the product once built.

A to-be journey map is a design artifact, not a research artifact. It defines the intended
experience so that engineering, design, and product teams share a single mental model of
what "done" looks like from the user's perspective.

---

## When to Use

- Designing the user experience for a new product or feature
- Translating a product vision or PRD into concrete user flows
- Aligning the team on what the user will actually do step by step
- Documenting happy paths and exception flows before development starts
- Reviewing whether a proposed experience has gaps or dead ends

---

## Inputs

| Input | Required | Description | Example |
|-------|----------|-------------|---------|
| product_description | Yes | What the product or feature does — can be a Product Vision Frame, PRD, or free-form description | "A SaaS platform for managing freelance invoices" |
| personas | No | Who the target users are | "Freelance designers, small agency owners" |
| scope | No | Which part of the journey to map (if not the full experience) | "Onboarding and first invoice creation only" |

If the user provides a Product Vision Frame document, extract the product concept, target
users, and ideal experience from it as primary inputs.

---

## Process

### Step 1: Identify the Journey Phases

Break the experience into sequential phases. Each phase is a meaningful chunk of the user's
interaction with the product. Think in terms of what the user is trying to accomplish, not
what the system is doing internally.

Good phase names describe user goals:
- "Sign up and onboard" (not "User registration module")
- "Create first project" (not "Project CRUD")
- "Invite team members" (not "Team management")

Typically a journey has 4-8 phases. Fewer than 4 usually means the phases are too broad;
more than 8 usually means you are documenting implementation details rather than user goals.

### Step 2: Map Each Phase

For every phase, document:

1. **Happy path** — The ideal sequence of steps when everything goes right. Number each
   step. Be specific about what the user sees, does, and where they end up.

2. **Exceptions** — Alternative flows that handle errors, edge cases, or uncommon choices.
   Each exception should name the condition that triggers it and describe what happens.

3. **Touchpoints** — The channels or interfaces involved (web app, email, push notification,
   SMS, etc.). Only include if multiple channels are relevant.

### Step 3: Generate the Mermaid Diagram

After documenting all phases, create a Mermaid flowchart that visualizes the full journey.
The diagram should show:
- Each phase as a group/subgraph
- Happy path steps as the main flow
- Exception branches clearly labeled with their trigger conditions
- Start and end nodes

Use `graph TD` (top-down) for journeys with many phases, or `graph LR` (left-right) if
the journey is short (3-4 phases).

### Step 4: Validate

Before presenting the output, check:
- Does every phase have a clear entry point and exit point?
- Are there dead ends where the user gets stuck with no next step?
- Do exception flows eventually rejoin the happy path or reach a defined end state?
- Is the level of detail consistent across phases?

---

## Output Format

Produce a single Markdown document with this structure:

```markdown
# Customer Journey To-Be: [Product/Feature Name]

## Overview

[1-2 sentences: what this journey covers and who the primary user is]

---

## Phase 1: [Phase Name]

**Happy path:**
1. [Step — what the user does/sees]
2. [Step]
3. [Step]

**Exceptions:**
- **[Condition]:** [What happens — the alternative flow and where it leads]
- **[Condition]:** [What happens]

**Touchpoints:** [channel 1, channel 2] _(only if multiple channels are involved)_

---

## Phase 2: [Phase Name]

**Happy path:**
1. [Step]
2. [Step]

**Exceptions:**
- **[Condition]:** [What happens]

---

_(repeat for all phases)_

---

## Journey Diagram

` ` `mermaid
graph TD
    A[Start] --> B[Phase 1: Step 1]
    B --> C[Phase 1: Step 2]
    C --> D{Decision point?}
    D -->|Yes| E[Happy path continues]
    D -->|No| F[Exception flow]
    F --> E
    E --> G[Phase 2: Step 1]
    ...
` ` `
```

---

## Constraints

- This is a to-be map — describe the projected experience, not the current state
- Do not include emotional curves, satisfaction scores, or sentiment analysis (those belong in as-is journey maps)
- Do not mix system internals with user-facing steps; every step should describe something the user sees or does
- Keep each step to one sentence — if a step needs a paragraph, it should be two steps
- Exception flows must resolve; never leave the user in a dead-end state

---

## Error Handling

| Situation | Response |
|-----------|----------|
| Input is too vague to identify phases | Ask the user to describe the main things a user would do with the product, in order |
| Product has multiple distinct user types | Create separate journey maps per persona, or ask the user which persona to focus on |
| Scope is unclear (full journey vs. one feature) | Default to the full journey; ask the user to confirm or narrow the scope |
| User provides an as-is journey and wants to-be | Use the as-is as context but generate a fresh to-be map — do not just annotate the existing one |

---

## Example

**Input:** "We're building an online booking platform for independent barbers. Users should be able to find a barber, book an appointment, and get reminders."

**Output:**

```markdown
# Customer Journey To-Be: BarberBook

## Overview

This journey maps the experience of a customer finding and booking an appointment with an
independent barber through the BarberBook platform.

---

## Phase 1: Discovery

**Happy path:**
1. User opens the BarberBook app or website
2. User enters their location or allows geolocation
3. App displays a list of nearby barbers with ratings, photos, and available time slots
4. User browses barber profiles to compare styles and reviews

**Exceptions:**
- **No barbers in area:** App shows a message with the option to expand the search radius or get notified when a barber joins nearby
- **Location permission denied:** App shows a manual address/zip code input field

---

## Phase 2: Booking

**Happy path:**
1. User selects a barber and taps "Book Appointment"
2. User picks a service type (haircut, beard trim, combo)
3. User selects an available date and time slot
4. User confirms the booking and receives a confirmation screen with appointment details

**Exceptions:**
- **Preferred time slot unavailable:** App suggests the next 3 closest available times
- **User is not logged in:** App prompts sign-up or login before confirming (returns to booking after auth)

**Touchpoints:** Web app, email (confirmation)

---

## Phase 3: Pre-Appointment

**Happy path:**
1. User receives an email confirmation with appointment details and calendar link
2. User receives a push notification reminder 24 hours before the appointment
3. User receives a second reminder 1 hour before

**Exceptions:**
- **User needs to reschedule:** User taps "Reschedule" in the reminder notification and picks a new time
- **User needs to cancel:** User taps "Cancel" and receives confirmation of cancellation

**Touchpoints:** Email, push notification

---

## Phase 4: Post-Appointment

**Happy path:**
1. After the appointment time passes, user receives a notification asking to rate the experience
2. User submits a rating and optional review
3. App shows a "Book Again" shortcut on the barber's profile

**Exceptions:**
- **User does not leave a review:** App sends one follow-up reminder after 24 hours, then stops
- **User had a bad experience:** Review form includes a "Report Issue" option that notifies the barber and BarberBook support

**Touchpoints:** Push notification, email

---

## Journey Diagram

` ` `mermaid
graph TD
    A[User opens BarberBook] --> B[Enter location]
    B --> C{Location available?}
    C -->|Yes| D[Browse barbers]
    C -->|No| E[Expand radius / notify me]
    E --> D
    D --> F[Select barber]
    F --> G[Choose service]
    G --> H[Pick date and time]
    H --> I{Slot available?}
    I -->|Yes| J[Confirm booking]
    I -->|No| K[See suggested times]
    K --> H
    J --> L{Logged in?}
    L -->|Yes| M[Confirmation screen]
    L -->|No| N[Sign up / Log in]
    N --> M
    M --> O[Email confirmation + calendar link]
    O --> P[24h reminder]
    P --> Q[1h reminder]
    Q --> R{Reschedule or cancel?}
    R -->|No| S[Attend appointment]
    R -->|Reschedule| T[Pick new time]
    T --> M
    R -->|Cancel| U[Cancellation confirmed]
    S --> V[Rate and review prompt]
    V --> W[Submit review]
    W --> X[Book Again shortcut]
` ` `
```
