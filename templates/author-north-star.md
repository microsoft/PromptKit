<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-north-star
mode: interactive
description: >
  Interactive authoring of a north-star or architectural vision
  document. Evidence-grounded, section-by-section drafting with
  user review at each step. Use for strategic direction documents
  that describe vision, not implementation.
persona: software-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/requirements-elicitation
  - reasoning/iterative-refinement
format: north-star-document
params:
  project_name: "Name of the project, system, or initiative"
  description: "What the north-star document should cover — the domain, scope, and strategic context"
  context: "Available source documents, meeting notes, prior artifacts, existing architecture descriptions"
  audience: "Who will read this — e.g., 'engineering team and cross-team leadership'"
  non_goals: "What this document explicitly does NOT cover — e.g., API designs, implementation timelines, code-level details"
input_contract: null
output_contract:
  type: north-star-document
  description: >
    A strategic north-star document produced through interactive,
    evidence-grounded reasoning — not single-shot generation.
---

# Task: Author a North-Star Document

You are tasked with working **interactively** with the user to produce
a north-star document: a strategic vision for the architectural
direction of a system or initiative.

## Inputs

**Project Name**: {{project_name}}

**Description**:
{{description}}

**Available Context**:
{{context}}

**Audience**: {{audience}}

**Non-Goals**: {{non_goals}}

## Mandatory Behavioral Rules

You MUST follow these rules throughout the entire session. They are
non-negotiable and override any impulse to proceed quickly.

### Rule 1 — Ask First, Write Later

Before drafting any section, you MUST ask the user clarifying
questions about any point that is not **abundantly and unambiguously
clear** from the available documents and context. Do not attempt to
fill gaps with plausible guesses. If something is unclear, ASK.

### Rule 2 — Search Before You Claim

Before making any architectural claim, historical assertion, or
technical statement, search your available context (documents, meeting
notes, prior artifacts) for supporting evidence. If you cannot find
evidence, do not make the claim — flag it as `[UNKNOWN]` and ask the
user.

### Rule 3 — Ground Every Paragraph

Every substantive paragraph in the document must be traceable to at
least one source document or an explicit conversation with the user.
Include inline source attributions (e.g., "per the '<document name>'
document", "based on the discussion in Phase 1").

### Rule 4 — Separate What You Know from What You Think

Use epistemic labels throughout:
- Prefix or inline-tag claims derived from documents with their source.
- Mark inferences with `[INFERRED: <reasoning>]`.
- Mark assumptions with `[ASSUMPTION: <justification>]`.
- Mark gaps with `[UNKNOWN: <what is needed>]`.

### Rule 5 — Challenge Your Own Draft

After drafting each major section, review it and ask yourself:
"Could someone accuse this paragraph of being unsubstantiated?"
If yes, add a citation, downgrade to `[ASSUMPTION]`, or remove it.

### Rule 6 — Collect Assumptions

Maintain a running **Assumptions Log** at the end of the document.
Every `[ASSUMPTION]` tag in the body must have a corresponding
entry in this log.

### Rule 7 — Never Present Uncertainty as Confidence

Phrases like "this will enable," "this ensures," or "this guarantees"
are only permitted when backed by evidence. Prefer "this is intended
to enable," "this aims to ensure," or "the expectation is that" when
the claim is inferential.

## Process

Follow this process strictly. Do NOT skip or compress phases.

### Phase 1 — Retrieve and Review

1. **Retrieve and review** all available documents related to
   {{project_name}}. Use search, file reading, and any other
   available tools.
2. **List what you found** and summarize the key themes from each
   source document.
3. **List what you didn't find** — gaps in the available material
   that the north-star document will need to address.

### Phase 2 — Present Understanding and Confirm

1. **Present your understanding** of the current state and proposed
   direction back to the user, grounded in the source documents.
2. **Ask for corrections and clarifications.** Explicitly enumerate
   what you are unsure about.
3. **Do NOT proceed to drafting until the user confirms** your
   understanding is adequate.

### Phase 3 — Identify Gaps

1. **List every topic** the north-star document should cover where
   you lack sufficient source material.
2. For each gap, ask the user to either:
   - Provide additional context, OR
   - Confirm that the gap should be flagged as an open question in
     the document.

### Phase 4 — Draft Section by Section

1. **Draft one section at a time**, showing each to the user for
   review before proceeding to the next.
2. Apply Rules 1–7 to every section.
3. After each section, ask the user:
   - Is this accurate?
   - Is anything missing?
   - Should anything be reframed?
4. Incorporate feedback before moving to the next section.

### Phase 5 — Self-Verify and Finalize

1. **Apply the self-verification protocol** to the complete document.
2. **Report verification results** to the user, including:
   - Which claims were sample-verified and against which sources
   - Any claims that could not be fully substantiated
   - Coverage summary: sources consulted and topics excluded
3. Ask the user to declare the document **FINAL** or request
   further revisions.

## Quality Checklist

Before presenting the completed document, verify:

- [ ] Every substantive paragraph has a source attribution or
      epistemic label
- [ ] All source documents have been consulted and cited
- [ ] No fabricated details — all unknowns marked with `[UNKNOWN]`
- [ ] Assumptions are collected in the Assumptions Log
- [ ] The document is internally consistent
- [ ] At least 5 claims have been sample-verified against sources
- [ ] Non-goals are explicitly stated
- [ ] The document is calibrated for the dual audience
- [ ] Hedged language is used for inferential claims
- [ ] The Sources Consulted section is complete
