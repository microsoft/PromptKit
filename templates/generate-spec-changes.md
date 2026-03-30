<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: generate-spec-changes
description: >
  Generate design and validation specification changes from a
  requirements patch.  Propagates each requirement change to the
  appropriate design sections and validation test cases, maintaining
  full traceability.  Domain-agnostic.
persona: "{{persona}}"
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/change-propagation
format: structured-patch
params:
  persona: "Persona to use — select from library or describe a custom one"
  project_name: "Name of the project, product, or system"
  requirements_patch: "The structured requirements patch (output of collaborate-requirements-change or equivalent)"
  design_doc: "Existing design document or specification"
  validation_plan: "Existing validation plan or test specification"
  context: "Additional context — architecture, constraints, domain conventions"
input_contract:
  type: requirements-patch
  description: >
    A structured requirements patch with CHG-IDs, Before/After content,
    and traceability to user intent.
output_contract:
  type: spec-patch
  description: >
    A structured patch covering design and validation changes, with
    every change tracing to a requirement change from the input patch.
---

# Task: Generate Specification Changes

You are tasked with propagating requirements changes into design and
validation specification changes.  Every downstream change MUST trace
to an upstream requirement change.

## Inputs

**Project**: {{project_name}}

**Requirements Patch**:
{{requirements_patch}}

**Existing Design Document**:
{{design_doc}}

**Existing Validation Plan**:
{{validation_plan}}

**Additional Context**:
{{context}}

## Instructions

Apply the **change-propagation protocol** in order:

### Step 1 — Impact Analysis

For each requirement change in the input patch:

1. Identify which design document sections are **directly affected**
   (sections that reference or implement the changed requirement).
2. Identify which validation plan entries are **directly affected**
   (test cases linked to the changed requirement).
3. Identify **indirect impacts** — sections that depend on assumptions
   or constraints affected by the requirement change.
4. For sections verified as unaffected, state WHY.

### Step 2 — Design Changes

For each impacted design section:

1. Derive the **minimal necessary change** to restore alignment with
   the updated requirement.
2. Draft a change entry with Before/After content.
3. Record the upstream requirement change (CHG-ID from the input patch)
   as the upstream ref.

### Step 3 — Validation Changes

For each impacted validation entry:

1. If an existing test case covers the changed requirement, **modify**
   the test case to reflect the new acceptance criteria.
2. If no test case exists for a new requirement, **add** a new test
   case with a TC-ID following the existing numbering scheme.
3. If a requirement is retired, **remove** the linked test case
   (or mark it for retirement if it covers other requirements too).
4. Verify every requirement in the patch has at least one linked
   test case after changes are applied.

### Step 4 — Assemble Patch

Produce a single structured-patch document containing:

1. **Change Context** — reference the input requirements patch as
   the upstream artifact.
2. **Change Manifest** — all design and validation changes in one table.
3. **Detailed Changes** — full Before/After for every change, with
   upstream refs pointing to the requirement patch CHG-IDs.
4. **Traceability Matrix** — every requirement change mapped to its
   downstream design and validation changes.
5. **Invariant Impact** — assess which existing invariants, constraints,
   or assumptions are affected.
6. **Application Notes** — how to apply these changes to the existing
   design document and validation plan.

## Non-Goals

- Do NOT introduce changes beyond what the requirements patch requires.
- Do NOT redesign unaffected sections.
- Do NOT add speculative features or improvements.
- If you identify issues in the existing design unrelated to this change,
  note them separately as recommendations.

## Quality Checklist

Before presenting the patch, verify:

- [ ] Every design change traces to a requirement change
- [ ] Every validation change traces to a requirement change
- [ ] Every requirement change has at least one downstream change
  (or an explicit "no impact" justification)
- [ ] No invariants are broken without explicit acknowledgment
- [ ] No internal conflicts between design and validation changes
- [ ] Before/After content is unambiguous and sufficient to apply
- [ ] Traceability matrix is complete — no upstream changes dropped
