# Customer Journey Map: Accountant Persona

## Product Context

B2B SaaS platform for small accounting firms that automates client tax filing. Firm admins manage the account and team; accountants handle the day-to-day workflow of uploading client documents, reviewing AI-extracted data, and submitting tax returns to the tax authority.

---

## Persona: Accountant

**Role:** Staff accountant at a small firm (1-10 accountants).
**Goals:** File client taxes accurately and on time with minimal manual data entry.
**Tech comfort:** Moderate -- comfortable with web apps but not a power user.
**Pain points today:** Manual data entry from scanned documents, copy-paste errors, version confusion across spreadsheets, deadline pressure during tax season.

---

## Journey Stages

### Stage 1: Onboarding & First Login

| Dimension | Detail |
|---|---|
| **Trigger** | Firm admin adds the accountant to the platform and sends an invitation email. |
| **Actions** | 1. Receives invitation email with a sign-up link. 2. Creates password and sets up profile (name, credentials, contact). 3. Completes a brief guided walkthrough / product tour. 4. Reviews assigned clients (if any were pre-assigned by the admin). |
| **Touchpoints** | Email client, web browser, onboarding wizard. |
| **Thoughts** | "Is this going to be easy to learn? Will it actually save me time?" |
| **Emotions** | Cautious optimism mixed with mild anxiety about a new tool. |
| **Pain Points** | Invitation may land in spam. Walkthrough may feel too long or too generic. Unclear what to do first after the tour ends. |
| **Opportunities** | Personalized onboarding based on firm size. Checklist-style "get started" dashboard. Link to a 2-minute video overview. |

---

### Stage 2: Client & Document Management

| Dimension | Detail |
|---|---|
| **Trigger** | Accountant needs to begin preparing a client's tax return. |
| **Actions** | 1. Navigates to the client list (or searches for a specific client). 2. Opens the client profile to see prior-year history and status. 3. Uploads client documents (W-2s, 1099s, receipts, prior returns) via drag-and-drop or file picker. 4. Tags or categorizes documents if required. 5. Confirms upload and waits for processing. |
| **Touchpoints** | Dashboard, client profile page, document upload interface. |
| **Thoughts** | "Do I have everything I need from this client? Did the upload work?" |
| **Emotions** | Focused, task-oriented. Mild frustration if uploads are slow or formats are rejected. |
| **Pain Points** | Unclear which documents are still missing for a given client. Unsupported file formats causing upload failures. No batch upload for multiple clients. Large files timing out. |
| **Opportunities** | Document checklist per tax form type (e.g., "For 1040 you still need: W-2, mortgage interest statement"). Bulk upload with auto-sorting. Real-time upload progress with clear error messages. |

---

### Stage 3: Automated Data Extraction & Pre-Fill

| Dimension | Detail |
|---|---|
| **Trigger** | Documents finish uploading and the system begins processing. |
| **Actions** | 1. Receives a notification (in-app or email) that extraction is complete. 2. Opens the pre-filled tax form workspace for the client. 3. Scans the extracted data mapped to the correct form fields. 4. Checks confidence indicators on each extracted value. |
| **Touchpoints** | Notification system, tax form workspace, extraction summary view. |
| **Thoughts** | "Did the system read these documents correctly? Can I trust these numbers?" |
| **Emotions** | Impressed if extraction is accurate; anxious or skeptical if confidence scores are low or values look wrong. |
| **Pain Points** | Extraction errors on handwritten or low-quality scans. No clear way to see which source document a value came from. Processing takes too long during peak season. Confidence scores are not intuitive. |
| **Opportunities** | Side-by-side view: source document highlight next to the pre-filled field. Color-coded confidence levels (green/yellow/red). Priority queue showing which clients need the most manual correction. Estimated processing time indicator. |

---

### Stage 4: Review & Correction

| Dimension | Detail |
|---|---|
| **Trigger** | Pre-filled form is ready for accountant review. |
| **Actions** | 1. Works through the form field by field (or focuses on flagged/low-confidence fields). 2. Clicks into a field to see the source document snippet and edit the value. 3. Adds manual entries for items not captured by extraction (e.g., deductions, credits). 4. Runs a validation check to catch missing fields, math errors, or regulatory issues. 5. Resolves all warnings and errors. 6. Marks the return as "ready for submission." |
| **Touchpoints** | Tax form editor, source document viewer, validation engine, notes/comments panel. |
| **Thoughts** | "I need to be thorough -- errors mean penalties for my client. Let me focus on the flagged items first." |
| **Emotions** | Deep concentration. Satisfaction when the system got it right. Frustration when corrections are tedious or the UI is clunky. |
| **Pain Points** | Tabbing between fields is slow. No keyboard shortcuts for power users. Validation messages are vague ("field invalid" vs. "value exceeds IRS limit of $X"). Cannot save partial progress easily. Hard to compare current year vs. prior year values. |
| **Opportunities** | Keyboard-driven navigation for speed. Inline validation with specific regulatory references. Year-over-year comparison panel. Auto-save with version history. Bulk-approve fields above a confidence threshold. |

---

### Stage 5: Submission to Tax Authority

| Dimension | Detail |
|---|---|
| **Trigger** | Accountant marks the return as reviewed and ready. |
| **Actions** | 1. Previews the final tax return in its official format (PDF or e-file preview). 2. Performs a final confirmation (checkbox or e-signature). 3. Clicks "Submit" to transmit the return to the tax authority (e.g., IRS e-file). 4. Receives a submission confirmation with a tracking/reference number. 5. Saves or downloads a copy for the firm's records. |
| **Touchpoints** | Final review/preview screen, submission confirmation dialog, confirmation receipt page. |
| **Thoughts** | "Is everything correct? Once I submit, there's no easy undo." |
| **Emotions** | Heightened attention and slight anxiety before clicking submit. Relief and accomplishment after confirmation. |
| **Pain Points** | Unclear whether submission actually went through (no confirmation, or delayed confirmation). E-file rejections with cryptic error codes. No way to recall or amend a submission from within the platform. Cannot submit outside business hours due to tax authority downtime. |
| **Opportunities** | Clear submission status tracker (pending, accepted, rejected) with real-time updates. Plain-language translation of rejection codes with suggested fixes. One-click amendment workflow. Automatic PDF archive to the client's profile. |

---

### Stage 6: Post-Submission & Ongoing Management

| Dimension | Detail |
|---|---|
| **Trigger** | Tax return has been submitted; accountant moves on to next client or monitors status. |
| **Actions** | 1. Checks the submission status dashboard for acceptance/rejection updates from the tax authority. 2. Handles rejections: reviews the error, corrects the return, resubmits. 3. Responds to client inquiries about filing status. 4. Downloads or shares a copy of the filed return with the client. 5. Moves to the next client in the queue. 6. At end of season, reviews personal filing metrics (returns filed, error rates, turnaround time). |
| **Touchpoints** | Status dashboard, client communication tools (email or in-app messaging), reporting/analytics page. |
| **Thoughts** | "How many do I have left? Am I on track to hit the deadline for all my clients?" |
| **Emotions** | Steady and routine if things are going smoothly. Stressed if rejections pile up or deadlines approach. Satisfied at season's end when everything is filed. |
| **Pain Points** | No centralized view of all clients' filing statuses. Manual follow-up with clients about missing documents. No visibility into workload balance across the team. Rejection resolution workflow is disjointed from the original return. |
| **Opportunities** | Kanban-style pipeline view (not started / in progress / submitted / accepted / rejected). Automated client email notifications for filing status. Workload analytics and deadline countdown per client. Seamless re-open-and-fix flow for rejected returns. |

---

## Journey Summary (Visual Overview)

```
ONBOARDING        DOCUMENT UPLOAD      EXTRACTION       REVIEW & CORRECT     SUBMIT           POST-SUBMISSION
    |                   |                  |                   |                 |                   |
 Invite email      Upload client       System extracts    Field-by-field     Preview final      Monitor status
 Create account     documents           data from docs     review & edit      return & submit    Handle rejections
 Product tour      Tag & organize      Pre-fills forms    Run validations    Get confirmation   Share with client
 See client list   Confirm upload      See confidence     Resolve errors     Archive copy       Review metrics
    |                   |                  |                   |                 |                   |
 Emotion:          Emotion:            Emotion:           Emotion:           Emotion:           Emotion:
 Cautious          Focused             Curious/skeptical  Concentrated       Anxious -> relief  Steady/satisfied
 optimism          task-driven         about accuracy     detail-oriented    accomplishment     end-of-season
```

---

## Key Metrics to Track

| Metric | Stage | Purpose |
|---|---|---|
| Time to first upload | Onboarding | Measures onboarding friction |
| Documents uploaded per session | Document Management | Indicates workflow efficiency |
| Extraction accuracy rate | Extraction | Core product value metric |
| Fields manually corrected per return | Review | Measures AI quality and accountant effort |
| Time from upload to submission | End-to-end | Overall productivity gain |
| First-attempt acceptance rate | Submission | Filing quality indicator |
| Returns filed per accountant per week | Post-submission | Throughput and capacity planning |

---

## Assumptions and Open Questions

1. **Assumption:** The firm admin handles client creation and assignment; the accountant does not onboard new clients into the system.
2. **Assumption:** The platform supports IRS e-file; state tax filing may be a separate workflow or future feature.
3. **Open question:** Does the accountant need approval from the firm admin before submitting, or is submission fully autonomous?
4. **Open question:** Is there a client-facing portal where end clients can upload documents directly, or does the accountant always act as the intermediary?
5. **Open question:** What document formats are supported (PDF, images, CSV, direct integrations with payroll providers)?
6. **Open question:** Is there a collaboration model where multiple accountants can work on the same client's return?
