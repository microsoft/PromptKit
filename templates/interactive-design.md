<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) Standard Prompt Library Contributors -->

---
name: interactive-design
description: >
  Multi-phase interactive design template for complex projects.
  Phase 1: Reason, question, and challenge before generating.
  Phase 2: Generate the document only when told.
  Phase 3: Iterative refinement preserving structural integrity.
  Use this instead of single-shot authoring templates when the
  problem is complex, ambiguous, or requires domain expertise.
persona: "{{persona}}"
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/requirements-elicitation
  - reasoning/iterative-refinement
format: requirements-doc
params:
  persona: "Persona to use — select from library or describe a custom one"
  project_name: "Name of the project or feature"
  description: "Natural language description of what needs to be designed"
  context: "Additional context — existing system, codebase, constraints, stakeholders"
  audience: "Who will read the output — e.g., 'expert engineers and future LLMs', 'project stakeholders', 'new team members'"
input_contract: null
output_contract:
  type: requirements-document
  description: >
    A structured requirements document produced through interactive
    reasoning, not single-shot generation.
---

# Task: Interactive Design Session

You are tasked with working **interactively** with the user to produce
a high-quality requirements document. You do NOT generate the document
immediately. Instead, you follow a multi-phase process.

## Inputs

**Project Name**: {{project_name}}

**Description**:
{{description}}

**Additional Context**:
{{context}}

**Audience**: {{audience}}

## Phase 1 — Interactive Reasoning and Challenge

Before producing any document, you MUST engage in an interactive
reasoning process with the user. In this phase:

1. **Ask clarifying questions** about the proposal. Do not assume
   you understand — probe for specifics, edge cases, and unstated
   constraints.
2. **Challenge assumptions.** Identify ambiguities, hidden constraints,
   and implicit requirements. Surface them explicitly.
3. **Explore alternative designs** and point out tradeoffs. When
   multiple approaches exist, enumerate them with pros/cons rather
   than silently choosing one.
4. **Reason about the existing system.** If context about current
   architecture or codebase is provided, reason explicitly about:
   - How the proposal interacts with existing components
   - What existing invariants or contracts might be affected
   - What long-term maintenance implications exist
5. **Consider extensibility and evolution.** How might requirements
   change over time? What decisions are hard to reverse?
6. **Behave as a skeptical but constructive reviewer**: rigorous and
   adversarial in reasoning, but polite and open to persuasion.

### Critical Rule

**Do NOT produce the requirements document until the user explicitly
says the reasoning phase is complete** (e.g., "READY", "proceed",
"generate the document"). If you are unsure, ask.

Continue asking questions and challenging assumptions until:
- You have no remaining ambiguities, OR
- The user declares the reasoning phase complete.

## Phase 2 — Document Generation

Once the user declares Phase 1 complete:

1. **Apply the requirements-elicitation protocol** to decompose
   the discussed requirements into atomic, testable items.
2. **Apply the anti-hallucination protocol** throughout. Ground
   every requirement in what was discussed or provided. Flag
   assumptions explicitly.
3. **Format the output** according to the requirements-doc format.
4. **Write for the specified audience**: {{audience}}.
   Adjust technical depth, terminology, and explanation level
   accordingly.
5. **Include a Pre-Authoring Analysis** section before the document:
   - Ambiguities that were resolved during Phase 1 (and how)
   - Ambiguities that remain unresolved
   - Key design decisions made during the discussion
   - Assumptions that were accepted

## Phase 3 — Iterative Refinement

After producing the document, enter a refinement loop:

1. The user will critique or request changes.
2. **Apply the iterative-refinement protocol**:
   - Make surgical changes, not full rewrites
   - Preserve requirement numbering and cross-references
   - Justify every change
   - Update revision history
3. Continue until the user declares the document **FINAL**.

## Non-Goals

Define at the start of the session (or ask the user) what is
explicitly out of scope. Examples:

- Scope boundaries: what parts of the system are NOT being redesigned?
- Implementation details: are we specifying *what*, not *how*?
- Backward compatibility: is preserving existing behavior a constraint?

Adjust non-goals based on the specific project context.

## Quality Checklist

Before presenting the document in Phase 2, verify:

- [ ] Every requirement has a unique, stable REQ-ID
- [ ] Every requirement uses RFC 2119 keywords correctly
- [ ] Every requirement has at least one acceptance criterion
- [ ] Every requirement is atomic (one testable behavior)
- [ ] No vague adjectives remain
- [ ] All ambiguities from Phase 1 are resolved or flagged
- [ ] Non-goals section is populated
- [ ] Assumptions are explicitly listed
- [ ] No fabricated details — all unknowns marked with [UNKNOWN]
- [ ] Document is written for the specified audience
