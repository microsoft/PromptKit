<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: engineering-workflow
mode: interactive
description: >
  Full incremental development workflow with human-in-the-loop review.
  Guides an agent through requirements discovery, specification changes,
  implementation changes, adversarial audits, and deliverable creation.
  Domain-agnostic — works for software, hardware, protocol, or any
  engineering domain. Users select their domain by choosing a persona.
persona: "{{persona}}"
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/adversarial-falsification
  - guardrails/operational-constraints
  - reasoning/requirements-elicitation
  - reasoning/iterative-refinement
  - reasoning/change-propagation
  - reasoning/traceability-audit
  - reasoning/code-compliance-audit
  - reasoning/test-compliance-audit
taxonomies:
  - specification-drift
format: null
params:
  persona: "Persona to use — select from library (e.g., software-architect, electrical-engineer, mechanical-engineer)"
  project_name: "Name of the project, product, or system being changed"
  change_description: "Natural language description of the desired change"
  existing_artifacts: "Existing requirements, design, validation, implementation, and verification artifacts"
  context: "Additional context — architecture, constraints, domain conventions, toolchain"
input_contract: null
output_contract:
  type: artifact-set
  description: >
    Multiple artifacts produced across phases: requirements-patch,
    spec-patch, and implementation-patch (each using structured-patch
    format), plus investigation-report artifacts from adversarial
    audits with PASS/REVISE/RESTART verdicts that gate progression.
---

# Task: Incremental Development Workflow

You are tasked with guiding the user through a **complete incremental
development cycle** — from understanding what they want to change,
through specifications and implementation, to a deliverable.

This is a multi-phase, interactive workflow.  You will cycle through
two major loops (specification and implementation), with adversarial
audits and user reviews at each transition.

## Inputs

**Project**: {{project_name}}

**Desired Change**:
{{change_description}}

**Existing Artifacts**:
{{existing_artifacts}}

**Additional Context**:
{{context}}

---

## Workflow Overview

```
Phase 1: Requirements Discovery (interactive)
    ↓
Phase 2: Specification Changes (requirements + design + validation)
    ↓
Phase 3: Specification Audit (adversarial)
    ↓ ← loop back to Phase 1 or 2 if REVISE/RESTART
Phase 4: User Review of Specifications
    ↓ ← loop back to Phase 1, 2, or 3 if user requests
Phase 5: Implementation Changes (implementation + verification)
    ↓
Phase 6: Implementation Audit (adversarial)
    ↓ ← loop back to Phase 1, 2, or 5 if REVISE/RESTART
Phase 7: User Review of Implementation
    ↓ ← loop back to Phase 1, 2, 5, or 6 if user requests
Phase 8: Create Deliverable
```

---

## Phase 1 — Requirements Discovery

**Goal**: Understand what the user wants to change and produce a
structured requirements patch.

1. **Restate** the desired change and confirm understanding.
2. **Ask clarifying questions** — probe for specifics, edge cases,
   acceptance criteria, and unstated constraints.
3. **Identify affected requirements** — which existing REQ-IDs are
   impacted?  New requirements needed?  Any retired?
4. **Surface implicit requirements** — ripple effects the user may
   not have considered.
5. **Challenge scope** — is this the right change?  Simpler
   alternatives?  Hidden costs?

### Critical Rule

**Do NOT proceed to Phase 2 until the user explicitly says the
discovery phase is complete** (e.g., "READY", "proceed").

### Output

A structured requirements patch with:
- Change manifest
- Detailed change entries (Before/After with REQ-IDs)
- Each change linked to `USER-REQUEST: <user's intent>`
- Invariant impact assessment

---

## Phase 2 — Specification Changes

**Goal**: Propagate requirements changes to design and validation
specifications.

Apply the **change-propagation protocol**:

1. **Impact analysis** — identify affected design sections and
   validation entries.
2. **Design changes** — derive minimal design changes for each
   requirement change.
3. **Validation changes** — update or add test cases for each
   requirement change.
4. **Invariant check** — verify no existing invariants are broken.
5. **Completeness check** — every requirement change has downstream
   specification changes.
6. **Conflict detection** — no contradictions between design and
   validation changes.

### Output

A structured specification patch with full traceability to the
requirements patch.

---

## Phase 3 — Specification Audit

**Goal**: Adversarially verify that specifications faithfully
represent the user's intent.

Apply the **traceability-audit** and **adversarial-falsification**
protocols:

1. **Reconstruct intent** — restate what the user originally asked for.
2. **Audit requirements against intent** — check for drift, omissions,
   scope creep.  Use D1–D7 classifications.
3. **Audit specs against requirements** — forward and backward
   traceability, consistency, acceptance criteria coverage.
4. **Adversarial falsification** — try to disprove each finding AND
   try to find issues in "clean" areas.

### Verdict

- **PASS** → proceed to Phase 4 (user review)
- **REVISE** → state specific issues, return to Phase 2 (or Phase 1
  if requirements need changes), fix, and re-audit
- **RESTART** → fundamental misalignment, return to Phase 1

Present the audit report to the user with the verdict.

---

## Phase 4 — User Review of Specifications

**Goal**: Get user approval of specification changes before
proceeding to implementation.

Present to the user:
1. The requirements patch (from Phase 1)
2. The specification patch (from Phase 2)
3. The audit report (from Phase 3)
4. A summary of what will change and what is unaffected

Ask the user to review and respond with one of:
- **APPROVED** → proceed to Phase 5
- **REVISE** → take feedback, return to Phase 2 or Phase 1
- Specific change requests → incorporate and re-run from Phase 2

---

## Phase 5 — Implementation Changes

**Goal**: Propagate specification changes to implementation and
verification artifacts.

Apply the **change-propagation protocol**:

1. **Impact analysis** — identify affected implementation and
   verification artifacts.
2. **Implementation changes** — derive minimal changes to realize
   the updated specifications.
3. **Verification changes** — update or add tests/simulations/
   inspections for each validation change.
4. **Invariant check** — verify existing contracts are preserved.
5. **Completeness and conflict checks**.

Apply the **operational-constraints protocol** — focus on the
behavioral surface first, trace inward for verification.

### Output

A structured implementation patch with full traceability to the
specification patch.

---

## Phase 6 — Implementation Audit

**Goal**: Adversarially verify that implementation correctly
realizes the specification changes.

Apply the **code-compliance-audit**, **test-compliance-audit**,
and **adversarial-falsification** protocols:

1. **Forward traceability** — every spec change implemented.
   Flag D8 (unimplemented).
2. **Backward traceability** — no undocumented behavior.
   Flag D9.
3. **Constraint verification** — no violations.  Flag D10.
4. **Test coverage** — all validation changes have verification.
   Flag D11, D12, D13.
5. **Adversarial falsification** — disprove findings, challenge
   clean areas.

### Verdict

- **PASS** → proceed to Phase 7 (user review)
- **REVISE-IMPLEMENTATION** → fix implementation, return to Phase 5
- **REVISE-SPEC** → specification issues found, return to Phase 2
- **RESTART** → return to Phase 1

Present the audit report to the user with the verdict.

---

## Phase 7 — User Review of Implementation

**Goal**: Get user approval of implementation changes.

Present to the user:
1. The implementation patch (from Phase 5)
2. The audit report (from Phase 6)
3. A summary of all artifacts changed across the full workflow

Ask the user to respond with one of:
- **APPROVED** → proceed to Phase 8
- **REVISE** → take feedback, return to Phase 5, 2, or 1
- Specific change requests → incorporate and re-run

---

## Phase 8 — Create Deliverable

**Goal**: Package all changes into a deliverable.

Based on the user's workflow preference:

### Option A: Git-Based Workflow
1. Stage all changed files
2. Generate a commit message summarizing the full change chain
3. Create a pull request with:
   - Description tracing requirements → specs → implementation
   - Links to audit reports
   - Traceability summary

### Option B: Patch Set
1. Produce a consolidated patch set containing:
   - Requirements patch
   - Specification patch
   - Implementation patch
   - Audit reports
2. Include application instructions

### Option C: Design Package
1. Produce a design review package containing:
   - Updated specifications
   - Change summary
   - Audit reports
   - BOM/schematic updates (for hardware domains)

Ask the user which deliverable format they prefer if not obvious
from context.

---

## Non-Goals

- Do NOT skip phases — each phase exists for a reason.
- Do NOT auto-approve — every audit verdict and user review is a
  real gate.
- Do NOT mix phases — complete one phase before starting the next
  (except when looping back).
- Do NOT introduce changes unrelated to the user's original request.
