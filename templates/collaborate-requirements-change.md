<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: collaborate-requirements-change
mode: interactive
description: >
  Interactive requirements discovery for incremental changes.
  Work with the user to understand what they want to change,
  refine the requirements, and produce a structured requirements
  patch. Domain-agnostic — works for software, hardware,
  protocol, or any engineering domain.
persona: "{{persona}}"
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/requirements-elicitation
  - reasoning/iterative-refinement
format: structured-patch
params:
  persona: "Persona to use — select from library or describe a custom one"
  project_name: "Name of the project, product, or system being changed"
  change_description: "Natural language description of the desired change"
  existing_artifacts: "Existing requirements, design docs, specs — paste or reference"
  context: "Additional context — system architecture, constraints, domain conventions"
input_contract: null
output_contract:
  type: structured-patch
  description: >
    A structured requirements patch with traceable change entries,
    each linked to the user's stated intent. Ready for downstream
    propagation to design, validation, and implementation artifacts.
---

# Task: Collaborative Requirements Change Discovery

You are tasked with working **interactively** with the user to produce
a structured requirements patch.  You do NOT generate the patch
immediately.  Instead, you follow a multi-phase process to ensure the
requirements changes are clear, complete, and traceable.

## Inputs

**Project**: {{project_name}}

**Desired Change**:
{{change_description}}

**Existing Artifacts**:
{{existing_artifacts}}

**Additional Context**:
{{context}}

## Phase 1 — Understand Intent

Before producing any patch, engage the user interactively:

1. **Restate the change** in your own words and ask the user to confirm
   or correct your understanding.
2. **Ask clarifying questions** — probe for specifics, edge cases,
   acceptance criteria, and unstated constraints.
3. **Identify affected requirements** — which existing REQ-IDs are
   impacted?  Are new requirements needed?  Are any requirements
   being retired?
4. **Surface implicit requirements** — changes often have ripple
   effects.  Identify secondary requirements the user may not have
   considered (e.g., backward compatibility, migration, validation).
5. **Challenge scope** — is the user asking for the right change?
   Are there simpler alternatives?  Are there hidden costs?

### Critical Rule

**Do NOT produce the requirements patch until the user explicitly
says the discovery phase is complete** (e.g., "READY", "proceed",
"generate the patch").  If you are unsure, ask.

Continue until:
- You have no remaining ambiguities, OR
- The user declares Phase 1 complete.

## Phase 2 — Generate Requirements Patch

Once the user declares Phase 1 complete:

1. **Apply the requirements-elicitation protocol** to decompose
   changes into atomic, testable requirement modifications.
2. **Apply the anti-hallucination protocol** — ground every change
   in what was discussed.  Flag assumptions with `[ASSUMPTION]`.
3. **Format the output** according to the structured-patch format:
   - Change manifest summarizing all requirement changes
   - Detailed change entries with Before/After content
   - Each change traces to `USER-REQUEST: <what the user asked for>`
   - Invariant impact assessment
4. **Include a Pre-Patch Analysis** inside the Change Context section:
   - Ambiguities resolved during Phase 1 (and how)
   - Ambiguities that remain unresolved
   - Existing requirements affected
   - New requirements introduced
   - Requirements retired or modified

**Requirement change entry rules**:
- New requirements MUST use the next available REQ-ID in the
  existing numbering scheme.
- Modified requirements MUST preserve the original REQ-ID.
- Retired requirements MUST be marked as removed, not renumbered.
- Every requirement MUST have acceptance criteria.

## Phase 3 — Refinement

After producing the patch, enter a refinement loop:

1. The user will review and request changes.
2. **Apply the iterative-refinement protocol**:
   - Make surgical changes to the patch
   - Preserve change IDs and traceability
   - Justify every modification
3. Continue until the user declares the patch **FINAL**.

## Non-Goals

Define at the start of the session (or ask the user) what is
explicitly out of scope for this change:

- What parts of the system are NOT being changed?
- Are we changing requirements only, or also design/implementation?
- What backward compatibility constraints exist?

## Quality Checklist

Before presenting the patch in Phase 2, verify:

- [ ] Every change has a unique CHG-ID
- [ ] Every change traces to a user request or discussed requirement
- [ ] Every new/modified requirement has acceptance criteria
- [ ] Every new/modified requirement uses RFC 2119 keywords
- [ ] No existing requirement IDs are renumbered
- [ ] Invariant impact section is present and complete
- [ ] No fabricated requirements — all unknowns marked with [UNKNOWN: <what is missing>]
- [ ] Traceability matrix accounts for every discussed change
