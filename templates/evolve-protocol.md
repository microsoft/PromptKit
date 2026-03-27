<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: evolve-protocol
mode: interactive
description: >
  Interactive protocol evolution session. Ingests an existing protocol
  specification (RFC, internet-draft, or formal spec), works with the
  user to define and refine modifications, traces impact across the
  specification, verifies consistency, and produces a protocol delta
  document. Supports amendment, redline, and standalone output styles.
persona: protocol-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/protocol-evolution
format: protocol-delta
params:
  protocol_name: "Name of the protocol being modified — e.g., 'TCP', 'QUIC', 'CoAP'"
  base_spec: "The base specification text (RFC, internet-draft, or formal spec)"
  base_spec_id: "Identifier for the base spec — e.g., 'RFC 9293', 'draft-ietf-quic-v2-10', 'CoAP v1.0'"
  change_goals: "High-level description of what the user wants to change and why"
  requirements_doc: "Optional — a structured requirements document (from extract-rfc-requirements) for the base spec"
  output_style: "Presentation style for the delta: 'amendment' (section-by-section changes), 'redline' (tracked changes), or 'standalone' (revised specification). Default: amendment"
input_contract:
  type: requirements-document
  description: >
    Optionally accepts a structured requirements document extracted from
    the base specification (e.g., from extract-rfc-requirements). When
    provided, enables precise tracking of which requirements are affected
    by each change.
output_contract:
  type: protocol-delta
  description: >
    A structured protocol delta document describing all changes to the
    base specification, with change classification, impact analysis,
    consistency verification, and migration guidance.
---

# Task: Evolve Protocol Specification

You are tasked with working **interactively** with the user to evolve
an existing protocol specification. You do NOT generate the delta
document immediately. Instead, you follow the multi-phase protocol
evolution process.

## Inputs

**Protocol Name**: {{protocol_name}}

**Base Specification**:
{{base_spec}}

**Base Specification ID**: {{base_spec_id}}

**Change Goals**:
{{change_goals}}

**Existing Requirements Document** (optional):
{{requirements_doc}}

**Output Style**: {{output_style}}

## Phase 1 — Specification Ingestion (Interactive)

Before discussing changes, you MUST understand the existing protocol.
Apply Phase 1 of the protocol-evolution reasoning protocol:

1. Ingest and analyze the base specification.
2. Extract the protocol model (state machines, message formats, roles,
   error model, security model, extensibility points).
3. Present a summary of the protocol model to the user for confirmation.
4. If a requirements document is provided, cross-reference the model
   against the extracted requirements. Note any discrepancies.

**Do NOT proceed until the user confirms the protocol model is correct.**

## Phase 2 — Change Design (Interactive)

Work with the user to design the protocol changes. Apply Phase 2 of
the protocol-evolution reasoning protocol:

1. Discuss the change goals. Ask clarifying questions:
   - What specific behavior should change?
   - What problem does this solve?
   - What are the constraints (backward compatibility required?
     must use existing extensibility mechanisms?)?
2. For each proposed change:
   - Classify it using the protocol-change-categories taxonomy
     (PC1–PC8).
   - Identify the affected specification sections.
   - Surface unstated assumptions.
   - Challenge under-specified aspects.
3. Enumerate all proposed changes with their classifications.
   Confirm with the user.

**Do NOT proceed until the user approves the change list.**

## Phase 3 — Impact Analysis (Interactive)

Trace the implications of the approved changes. Apply Phase 3 of
the protocol-evolution reasoning protocol:

1. Analyze state machine impact.
2. Analyze message format impact.
3. Identify cross-reference updates needed.
4. Analyze error model and security impact.
5. Assess interoperability — what happens when updated and non-updated
   implementations communicate?
6. Present the impact analysis to the user. Highlight cascading effects.

**Do NOT proceed until the user acknowledges the impact analysis.**

## Phase 4 — Consistency Verification (Interactive)

Before generating the delta, verify consistency. Apply Phase 4 of
the protocol-evolution reasoning protocol:

1. Check normative language consistency.
2. Verify state machine consistency (completeness, determinism,
   no deadlocks, no unreachable states).
3. Verify cross-reference consistency.
4. Check terminology and IANA considerations.
5. Present any consistency issues to the user with resolution options.

**Resolve all consistency issues before proceeding to generation.**

## Phase 5 — Delta Generation

Once the user confirms the design, impact, and consistency:

1. Generate the protocol delta document using the `protocol-delta`
   format in the selected output style ({{output_style}}).
2. Apply the anti-hallucination protocol — every change must trace
   to the discussion in Phases 2–4. Do NOT invent changes that were
   not discussed and approved.
3. Apply the self-verification protocol — verify the generated delta
   against the quality checklist below.

## Phase 6 — Iterative Refinement

After presenting the delta document:

1. The user will critique or request changes.
2. For each requested change:
   - Re-run the affected portions of impact analysis (Phase 3).
   - Re-run consistency verification (Phase 4).
   - Update the delta document.
3. Continue until the user declares the delta **FINAL**.

## Non-Goals

- Do NOT implement the protocol changes — produce the specification
  delta only.
- Do NOT modify the base specification text — produce a separate delta
  document that references it.
- Do NOT resolve design disagreements unilaterally — present options
  and let the user decide.
- Do NOT add changes the user did not request — if you identify
  opportunities for improvement, suggest them but do not include them
  unless approved.
- Do NOT generate test cases — that is the job of
  `author-protocol-validation` consuming the output of this template.

## Quality Checklist

Before presenting the delta in Phase 5, verify:

- [ ] Every change has a unique Change ID (CHG-NNN)
- [ ] Every change has a category from the protocol-change-categories
      taxonomy (PC1–PC8)
- [ ] Every change states its backward compatibility impact
- [ ] Every change has a rationale traced to the Phase 2 discussion
- [ ] Normative keyword changes (MUST, SHOULD, MAY) are highlighted
- [ ] State machine updates (if any) show the complete updated state
      table, not just changed transitions
- [ ] Message format updates (if any) show complete updated field
      tables
- [ ] Cross-reference updates are listed for every change
- [ ] The consistency verification section documents all checks
      performed
- [ ] IANA considerations are listed (or "None" stated)
- [ ] Security considerations are listed (or "None beyond base spec"
      stated)
- [ ] No fabricated protocol behavior — all changes trace to user
      discussion
