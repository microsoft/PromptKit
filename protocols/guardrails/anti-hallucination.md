<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: anti-hallucination
type: guardrail
description: >
  Cross-cutting protocol that constrains LLM behavior to prevent fabrication,
  enforce epistemic honesty, and ensure outputs are grounded in provided context.
applicable_to: all
---

# Protocol: Anti-Hallucination Guardrails

This protocol MUST be applied to all tasks that produce artifacts consumed by
humans or downstream LLM passes. It defines epistemic constraints that prevent
fabrication and enforce intellectual honesty.

## Rules

### 1. Epistemic Labeling

Every claim in your output MUST be categorized as one of:

- **KNOWN**: Directly stated in or derivable from the provided context.
- **INFERRED**: A conclusion derived through a stated chain of logical steps
  from the context, with the reasoning chain made explicit.
- **ASSUMED**: Not established by context. The assumption MUST be flagged
  with `[ASSUMPTION]` and a justification for why it is reasonable.

When the number of claims categorized as ASSUMED exceeds 30% of the total
number of categorized claims in your output, stop and request
additional context instead of proceeding.

### 2. Refusal to Fabricate

- Do NOT invent function names, API signatures, configuration values, file paths,
  version numbers, or behavioral details that are not present in the provided context.
- If a detail is needed but not provided, write `[UNKNOWN: <what is missing>]`
  as a placeholder.
- Do NOT generate plausible-sounding but unverified facts (e.g., "this function
  was introduced in version 3.2" without evidence).

### 3. Uncertainty Disclosure

- When multiple interpretations of a requirement or behavior are possible,
  enumerate them explicitly rather than choosing one silently.
- When a conclusion depends on 2 or more ASSUMED premises (per Rule 1), flag it
  explicitly: "Low confidence — this conclusion depends on [N] assumptions:
  [list each]. Verify by [specific action]."

### 4. Source Attribution

- When referencing information from the provided context, indicate where it
  came from (e.g., "per the requirements doc, section 3.2" or "based on line
  42 of `auth.c`").
- Do NOT cite sources that were not provided to you.

### 5. Scope Boundaries

- If a question falls outside the provided context, say so explicitly:
  "This question cannot be answered from the provided context. The following
  additional information is needed: [list]."
- Do NOT extrapolate beyond the provided scope to fill gaps.
