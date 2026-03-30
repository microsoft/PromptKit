<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: maintenance-workflow
mode: interactive
description: >
  Periodic health check workflow for repositories with existing semantic
  baselines.  Re-audits requirements, design, validation, and
  implementation for drift, collaborates with the user to classify
  findings, generates corrective patches, and produces a PR restoring
  alignment.  Domain-agnostic — completes the engineering lifecycle
  triad (spec-extraction-workflow → engineering-workflow → maintenance-workflow).
persona: "{{persona}}"
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/adversarial-falsification
  - guardrails/operational-constraints
  - reasoning/traceability-audit
  - reasoning/code-compliance-audit
  - reasoning/test-compliance-audit
  - reasoning/change-propagation
  - reasoning/iterative-refinement
taxonomies:
  - specification-drift
format: multi-artifact
params:
  persona: "Persona to use — select from library (e.g., software-architect, electrical-engineer)"
  project_name: "Name of the project, product, or system"
  requirements_path: "Path to the existing requirements document"
  design_path: "Path to the existing design document"
  validation_path: "Path to the existing validation plan"
  implementation_root: "Root directory of the implementation artifacts"
  verification_root: "Root directory of the verification artifacts (tests, simulations)"
  focus_areas: "(Optional) Specific areas to focus on — e.g., 'authentication module'. Default: full audit."
  context: "Additional context — recent changes, known issues, domain conventions"
input_contract: null
output_contract:
  type: artifact-set
  description: >
    Corrective patches for requirements, design, validation, and
    implementation artifacts (each using structured-patch format),
    plus a comprehensive drift report (investigation-report format)
    and a summary of classified findings.
---

# Task: Maintenance Workflow

You are tasked with performing a **periodic health check** on a
repository's semantic artifacts and implementation.  Your goal is to
detect drift, classify findings with the user, generate corrective
patches, and restore alignment.

This is a multi-phase, interactive workflow.  You MUST use tools to
read the repository artifacts.

## Inputs

**Project**: {{project_name}}

**Existing Spec Artifacts**:
- Requirements: {{requirements_path}}
- Design: {{design_path}}
- Validation: {{validation_path}}

**Implementation**: {{implementation_root}}

**Verification**: {{verification_root}}

**Focus Areas**: {{focus_areas}}

**Additional Context**:
{{context}}

---

## Workflow Overview

```
Phase 1: Full Audit (detect all drift)
    ↓
Phase 2: Human Classification Loop (intentional vs accidental)
    ↓ ← iterate until all findings classified
Phase 3: Corrective Patch Generation
    ↓
Phase 4: Patch Audit (adversarial verification)
    ↓ ← loop back to Phase 2 or 3 if REVISE/RESTART
Phase 5: Human Approval
    ↓ ← loop back to Phase 2, 3, or 4 if changes requested
Phase 6: Create Deliverable
```

---

## Phase 1 — Full Audit

**Goal**: Detect all drift across the full artifact stack.

Use tools to read the existing spec documents (requirements, design,
validation) in full.  For implementation and verification artifacts,
apply **operational-constraints** — enumerate files via search first,
then selectively deep-read based on relevance to the spec baseline.
Do not attempt to read the entire codebase at once.

Apply three audit protocols systematically:

### 1a. Document-Level Audit (D1–D7)

Apply the **traceability-audit protocol**:

1. **Forward traceability** — every requirement has design coverage
   and at least one test case.  Flag gaps as D1 or D2.
2. **Backward traceability** — every design element and test case
   traces to a requirement.  Flag orphans as D3 or D4.
3. **Cross-document consistency** — assumptions are aligned across
   documents (flag contradictions as D5).  Constraints stated in
   requirements are not violated by design (flag violations as D6).
4. **Acceptance criteria coverage** — test cases cover all acceptance
   criteria.  Flag gaps as D7.

### 1b. Code-Level Audit (D8–D10)

Apply the **code-compliance-audit protocol**:

1. **Forward traceability** — every requirement is implemented.
   Flag gaps as D8.
2. **Backward traceability** — no undocumented behavior in code.
   Flag as D9.
3. **Constraint verification** — code does not violate stated
   constraints.  Flag violations as D10.

Apply **operational-constraints** — focus on behavioral surface
first, trace inward for verification.

### 1c. Test-Level Audit (D11–D13)

Apply the **test-compliance-audit protocol**:

1. **Forward traceability** — every validation entry has a
   corresponding test.  Flag gaps as D11.
2. **Acceptance criteria coverage** — tests exercise all acceptance
   criteria.  Flag gaps as D12.
3. **Assertion accuracy** — tests assert correct conditions.
   Flag mismatches as D13.

### Output

Produce a comprehensive drift report following the
**investigation-report format's required 9-section structure**.
Use these exact numbered headings, in order, and order findings
by severity (Critical first):

1. `## 1. Executive Summary` — overall health assessment with key metrics
2. `## 2. Problem Statement` — periodic maintenance audit scope
3. `## 3. Investigation Scope` — artifacts examined, tools used
4. `## 4. Findings` — structured exactly as in the investigation-report
   format.  For each finding F-NNN, include: **Severity**,
   **Category** (use the D1–D13 drift classification, e.g.,
   `D2_UNTESTED_REQUIREMENT`), **Location** (artifact and
   section/file), **Description**, **Evidence** (specific
   references), **Root Cause**, **Impact**, **Confidence**
   (High/Medium/Low), and initial **Remediation** recommendation
5. `## 5. Root Cause Analysis` — systemic patterns across findings
6. `## 6. Remediation Plan` — prioritized by severity
7. `## 7. Prevention` — process recommendations to prevent recurrence
8. `## 8. Open Questions` — items needing user clarification
9. `## 9. Revision History` — audit metadata

Present the drift report to the user before proceeding.

---

## Phase 2 — Human Classification Loop

**Goal**: Classify every drift finding as intentional or accidental
with the user's help.

Walk through the findings from Phase 1, focusing on:

1. **For each finding, ask the user**:
   - "Is this drift intentional?" (deliberate divergence from spec)
   - "Is this requirement still valid?"
   - "Should this undocumented behavior be spec'd or removed?"
   - "Is this a bug or a feature?"
   - "Should this design decision be updated to match reality?"

2. **Classify each finding** into one of:
   - **fix-spec** — the spec is wrong; update specs to match reality
   - **fix-impl** — the implementation is wrong; update code to match spec
   - **fix-both** — both need updating to a new agreed-upon state
   - **accept** — intentional drift; document as a known deviation
   - **defer** — needs more investigation; document for later

3. **Update the drift report** with the user's classification and
   rationale for each finding.

### Critical Rule

**Do NOT proceed to Phase 3 until the user explicitly says all
findings are classified** (e.g., "READY", "all classified",
"proceed to patches").

---

## Phase 3 — Corrective Patch Generation

**Goal**: Generate patches to restore alignment based on the
classified findings.

For each finding NOT classified as `accept` or `defer`:

### `fix-spec` findings

Apply the **iterative-refinement protocol**:
- Surgical changes to requirements, design, and/or validation docs
- Preserve REQ-IDs, TC-IDs, and cross-references
- Justify every change with reference to the finding ID

### `fix-impl` findings

Apply the **change-propagation protocol**:
1. Impact analysis — which implementation/verification artifacts
   are affected
2. Change derivation — minimal changes to restore spec alignment
3. Invariant check — verify no existing invariants are broken
4. Completeness check — every finding has a corresponding fix
5. Conflict detection — no contradictions in the change set

### `fix-both` findings

Generate both spec patches and implementation patches, ensuring
the new agreed-upon state is consistent across all layers.

### Output

Produce structured patches using the **structured-patch format**.
Because this template uses the `multi-artifact` format, you MUST
follow these key structured-patch constraints:

Use six numbered section headings with the **exact heading text**
from the structured-patch format, in this order:

1. `## 1. Change Context` — reference the drift report and finding IDs
2. `## 2. Change Manifest` — all corrective changes in one table
3. `## 3. Detailed Changes` — Before/After for every change, with
   upstream refs pointing to finding IDs (F-NNN)
4. `## 4. Traceability Matrix` — every classified finding mapped to
   its corrective changes
5. `## 5. Invariant Impact` — which invariants are affected
6. `## 6. Application Notes` — how to apply, verify, and rollback

Additional constraints:
- **Do not omit any section.** If a section has no content, include
  the heading and write "None identified."
- Every change MUST have a unique `CHG-<NNN>` identifier (e.g.,
  CHG-001, CHG-002), used consistently across Change Manifest,
  Detailed Changes, and Traceability Matrix.
- Every change's upstream ref MUST reference the finding ID (F-NNN)
  that motivated it.

Present the patches to the user before proceeding.

---

## Phase 4 — Patch Audit

**Goal**: Adversarially verify that the corrective patches actually
restore alignment.

Apply the **adversarial-falsification protocol**:

1. **Verify each fix-spec patch** — does the updated spec now
   correctly describe the system?  Are cross-references intact?
2. **Verify each fix-impl patch** — does the updated implementation
   now match the spec?  Are tests updated accordingly?
3. **Verify fix-both patches** — is the new agreed-upon state
   consistent across all layers?
4. **Check for introduced drift** — do the patches themselves
   create new D1–D13 findings?
5. **Adversarial falsification** — try to disprove each "fixed"
   finding; try to find new issues in patched areas.

### Verdict

- **PASS** → proceed to Phase 5 (user approval)
- **REVISE** → specific issues in patches, return to Phase 3
- **RECLASSIFY** → finding classification was wrong, return to Phase 2
- **RESTART** → fundamental issues, return to Phase 1

Present the audit verdict to the user.

---

## Phase 5 — Human Approval

**Goal**: Get user sign-off on all corrective changes.

Present to the user:
1. The drift report (from Phase 1, with classifications from Phase 2)
2. The corrective patches (from Phase 3)
3. The patch audit verdict (from Phase 4)
4. A summary: what changes, what stays, what is deferred

Ask the user to respond with:
- **APPROVED** → proceed to Phase 6
- **REVISE** → take feedback, return to Phase 3 or Phase 2
- Specific change requests → incorporate and re-audit

---

## Phase 6 — Create Deliverable

**Goal**: Apply the corrective changes and produce a PR.

1. Apply all approved patches to the artifact files.
2. Stage the changes and generate a commit message summarizing:
   - Number of drift findings detected
   - Classification breakdown (fix-spec / fix-impl / fix-both /
     accept / defer)
   - Key corrections made
   - Deferred items for future maintenance cycles
3. Create a PR (or prepare a patch set) with:
   - Description explaining the maintenance audit
   - Drift report
   - Summary of classified findings and corrective actions
   - List of deferred items
   - Recommendations for preventing recurrence

Ask the user which deliverable format they prefer if not obvious
from context.

---

## Non-Goals

- Do NOT fix deferred items — only document them for future cycles.
- Do NOT skip phases — each phase exists for a reason.
- Do NOT auto-classify drift — the user must decide what is
  intentional vs. accidental.
- Do NOT introduce new features or improvements — only restore
  alignment to the existing spec baseline.
- Do NOT attempt to read the entire codebase at once — apply
  operational-constraints and scope systematically.

## Quality Checklist

Before presenting deliverables at each phase, verify:

- [ ] All three audit protocols applied (D1–D7, D8–D10, D11–D13)
- [ ] Every finding has a D-label, severity, and evidence
- [ ] Drift report follows investigation-report 9-section structure
- [ ] Every finding was presented for user classification
- [ ] User explicitly approved before proceeding past each gate
- [ ] Every corrective patch traces to a classified finding (F-NNN)
- [ ] Patches follow structured-patch 6-section format
- [ ] Adversarial falsification applied to patches
- [ ] No new drift introduced by corrective patches
- [ ] Deferred items documented with rationale
- [ ] Audit verdict clearly stated (PASS/REVISE/RECLASSIFY/RESTART)
