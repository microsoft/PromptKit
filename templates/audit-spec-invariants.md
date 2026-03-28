<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-spec-invariants
description: >
  Adversarial analysis of a specification against user-supplied
  invariants. For each section of the spec, attempts to construct
  a compliant interpretation that violates an invariant. Finds spec
  gaps, ambiguities, and contradictions that could lead to invariant
  violations in any conforming implementation.
persona: configurable
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/spec-invariant-audit
format: investigation-report
params:
  project_name: "Name of the system or component whose spec is being audited"
  spec_content: "The specification text to audit"
  invariants: "The invariants that must hold — properties that a compliant implementation must never violate"
  context: "Additional context — what the system does, hardware constraints, operational environment"
  audience: "Who will read the output — e.g., 'spec authors', 'firmware engineers', 'safety reviewers'"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    An investigation report containing spec gap findings, each
    documenting a compliant interpretation that violates a user-supplied
    invariant, with spec citations and remediation suggestions.
---

# Task: Audit Specification Against Invariants

You are tasked with performing an **adversarial audit** of a specification.
Your goal: find every way a conforming implementation could violate the
supplied invariants. If the spec permits an interpretation that leads to
a violation, that is a finding — even if no reasonable engineer would
build it that way.

## Inputs

**Project Name**: {{project_name}}

**Specification**:
{{spec_content}}

**Invariants that MUST hold**:
{{invariants}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the spec-invariant-audit protocol.** Execute all seven
   phases in order. This is the core methodology — do not skip phases.

2. **Start with Phase 1 (Invariant Formalization).** Before you touch
   the spec, formalize each user-supplied invariant into a precise,
   falsifiable property. Present the formalized invariants for
   confirmation if operating interactively.

3. **Be adversarial, not charitable.** Your job is to find spec gaps,
   not to confirm the spec is adequate. When the spec is ambiguous, ask:
   "What is the *worst* compliant interpretation?" If a reasonable
   reading preserves the invariant but a pedantic reading violates it,
   report it — specs must be unambiguous.

4. **Apply the anti-hallucination protocol** throughout:
   - Every finding must cite specific spec language (section, paragraph,
     or sentence) that permits the violating interpretation
   - Do NOT invent spec text that is not present
   - Do NOT assume the spec says something it does not — if a topic is
     not addressed, that *is* the finding (the spec is silent)
   - Distinguish between [KNOWN] (spec explicitly states),
     [INFERRED] (derived from spec patterns), and
     [ASSUMED] (depends on unstated context)

5. **Format the output** according to the investigation-report format
   with these audit-specific additions:
   - Group findings by invariant violated
   - For each finding, include the **violating interpretation** — a
     step-by-step description of a compliant implementation that
     triggers the violation
   - Include a **coverage matrix**: invariants × spec sections, showing
     which combinations were analyzed and which produced findings

6. **Prioritize findings** by severity:
   - **Critical**: A straightforward reading of the spec permits an
     implementation that violates the invariant — no exotic interpretation
     required
   - **High**: An ambiguous or underspecified area permits violation
     under a reasonable (if uncharitable) reading
   - **Medium**: Violation requires combining multiple spec sections or
     exploiting an implicit assumption
   - **Low**: Violation requires an adversarial implementation that
     technically complies but clearly contradicts the spec's intent
   - **Informational**: The spec is adequate but could be clearer — no
     actual violation path found

7. **Apply the self-verification protocol** before finalizing:
   - Re-read at least 3 findings and verify the cited spec language
     actually says what you claim
   - Verify the violating interpretation actually complies with the spec
   - Verify the coverage matrix is complete — every invariant × section
     cell is accounted for

## Non-Goals

- Do NOT assess whether the spec is "good" or "well-written" in general —
  only analyze invariant compliance
- Do NOT propose a redesign of the system — only suggest spec amendments
  that close identified gaps
- Do NOT evaluate implementation code — this is a spec-only audit
- Do NOT generate test cases — this is analysis, not test planning (use
  `author-validation-plan` or `author-protocol-validation` for that)

## Quality Checklist

Before finalizing, verify:

- [ ] Every user-supplied invariant was formalized in Phase 1
- [ ] Every normative spec section was analyzed in Phase 3
- [ ] Every finding cites specific spec language
- [ ] Every finding includes a step-by-step violating interpretation
- [ ] Every finding has a disproof attempt documented
- [ ] State machine completeness was checked (Phase 4) if applicable
- [ ] Error/failure paths were traced (Phase 5) for all error conditions
- [ ] Cross-section interactions were analyzed (Phase 6)
- [ ] Coverage matrix is complete (no missing invariant × section cells)
- [ ] Findings are classified (Gap / Ambiguity / Contradiction /
      Incompleteness / Implicit Assumption)
- [ ] No fabricated spec language — all citations are verbatim
