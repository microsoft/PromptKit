<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: generate-implementation-changes
description: >
  Generate implementation and verification changes from a specification
  patch.  Propagates each design and validation change to the appropriate
  implementation artifacts (code, schematics, configurations) and
  verification artifacts (tests, simulations, inspections).
  Domain-agnostic.
persona: "{{persona}}"
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - reasoning/change-propagation
format: structured-patch
params:
  persona: "Persona to use — select from library or describe a custom one"
  project_name: "Name of the project, product, or system"
  spec_patch: "The structured specification patch (output of generate-spec-changes or equivalent)"
  implementation_artifacts: "Existing implementation — code, schematics, configurations, or other artifacts"
  verification_artifacts: "Existing tests, simulations, inspection procedures, or other verification artifacts"
  context: "Additional context — build system, toolchain, domain conventions, coding standards"
input_contract:
  type: structured-patch
  description: >
    A structured specification patch with design and validation changes,
    each tracing to a requirement change.
output_contract:
  type: structured-patch
  description: >
    A structured patch covering implementation and verification changes,
    with every change tracing to a specification change from the input
    patch.
---

# Task: Generate Implementation Changes

You are tasked with propagating specification changes into implementation
and verification changes.  Every downstream change MUST trace to an
upstream specification change.

## Inputs

**Project**: {{project_name}}

**Specification Patch**:
{{spec_patch}}

**Existing Implementation**:
{{implementation_artifacts}}

**Existing Verification Artifacts**:
{{verification_artifacts}}

**Additional Context**:
{{context}}

## Instructions

Apply the **change-propagation protocol** in order:

### Step 1 — Impact Analysis

For each specification change in the input patch:

1. Identify which implementation artifacts are **directly affected**
   (files, modules, components, schematic sheets that implement the
   changed design section).
2. Identify which verification artifacts are **directly affected**
   (test files, simulation configs, inspection checklists linked to
   the changed validation entries).
3. Identify **indirect impacts** — artifacts that depend on interfaces,
   data structures, or behaviors affected by the specification change.
4. Apply the **operational-constraints protocol** — focus on the
   behavioral surface first (APIs, entry points, interfaces), then
   trace inward only as needed for verification.

### Step 2 — Implementation Changes

For each impacted implementation artifact:

1. Derive the **minimal necessary change** to implement the updated
   specification.
2. Draft a change entry with Before/After content showing exact
   modifications with sufficient surrounding context.
3. Preserve existing style, conventions, and patterns of the
   implementation.
4. Record the upstream specification change (CHG-ID from the input
   patch) as the upstream ref.

### Step 3 — Verification Changes

For each impacted verification artifact:

1. If an existing test/verification covers the changed specification
   entry, **modify** it to match the updated acceptance criteria.
2. If no verification exists for a new specification entry, **add**
   new verification artifacts following existing patterns and naming.
3. If a specification entry is retired, **remove** linked verification
   (or update if shared with other entries).
4. Ensure verification changes exercise ALL acceptance criteria —
   including negative cases, boundary conditions, and ordering
   constraints.

### Step 4 — Assemble Patch

Produce a single structured-patch document containing:

1. **Change Context** — reference the input specification patch as
   the upstream artifact.
2. **Change Manifest** — all implementation and verification changes.
3. **Detailed Changes** — full Before/After for every change, with
   upstream refs pointing to the specification patch CHG-IDs.
4. **Traceability Matrix** — every specification change mapped to its
   downstream implementation and verification changes.
5. **Invariant Impact** — assess which existing invariants, constraints,
   or runtime assumptions are affected.
6. **Application Notes** — how to apply (git diff, manual edit,
   schematic update, etc.), build/compile verification steps, and
   rollback instructions.

## Non-Goals

- Do NOT refactor or improve unrelated implementation.
- Do NOT introduce changes beyond what the specification patch requires.
- Do NOT change build systems, tooling, or infrastructure unless the
  specification change explicitly requires it.
- Note improvement opportunities separately as recommendations.

## Quality Checklist

Before presenting the patch, verify:

- [ ] Every implementation change traces to a specification change
- [ ] Every verification change traces to a specification change
- [ ] Every specification change has at least one downstream change
  (or explicit "no impact" justification)
- [ ] Implementation follows existing style and conventions
- [ ] Verification covers all acceptance criteria (positive, negative,
  boundary)
- [ ] No invariants broken without explicit acknowledgment
- [ ] Before/After content is unambiguous and directly applicable
- [ ] Application notes include build/compile verification steps
