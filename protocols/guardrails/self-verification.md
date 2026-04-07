<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: self-verification
type: guardrail
description: >
  Cross-cutting protocol requiring the LLM to verify its own output
  before finalizing. Includes sampling checks, citation audits,
  coverage confirmation, and explicit quality gates.
applicable_to: all
---

# Protocol: Self-Verification

This protocol MUST be applied before finalizing any output artifact.
It defines a quality gate that prevents submission of unverified,
incomplete, or unsupported claims.

## When to Apply

Execute this protocol **after** generating your output but **before**
presenting it as final. Treat it as a pre-submission checklist.

## Rules

### 1. Sampling Verification

- Select a **coverage sample** of at least 3 specific claims, findings,
  or data points from your output. Include different claim types when
  present (for example: a file path, a code snippet, a conclusion, a
  severity assignment, or a remediation recommendation).
- For each sampled item, **re-verify** it against the source material:
  - Does the file path, line number, or location actually exist?
  - Does the code snippet match what is actually at that location?
  - Does the evidence actually support the conclusion stated?
- If any sampled item fails verification, **re-examine all items of
  the same type** before proceeding.

### 2. Citation Audit

Every factual claim must use the epistemic categories defined in the
`anti-hallucination` protocol (KNOWN / INFERRED / ASSUMED).

- Every factual claim in the output MUST be traceable to:
  - A specific location in the provided code or context, OR
  - An explicit `[ASSUMPTION]` or `[INFERRED]` label.
- Scan the output for claims that lack citations. For each:
  - Add the citation if the source is identifiable.
  - Label as `[ASSUMPTION]` if not grounded in provided context.
  - Remove the claim if it cannot be supported or labeled.
- **Zero uncited factual claims** is the target.

### 3. Coverage Confirmation

- Review the task's scope (explicit and implicit requirements).
- Verify that every element of the requested scope is addressed:
  - Are there requirements, code paths, or areas that were asked about
    but not covered in the output?
  - If any areas were intentionally excluded, document why in a
    "Limitations" or "Coverage" section.
- State explicitly:
  - "**Examined**: [what was analyzed — directories, files, patterns]."
  - "**Method**: [how items were found — search queries, commands, scripts]."
  - "**Excluded**: [what was intentionally not examined, and why]."
  - "**Limitations**: [what could not be examined due to access, time, or context]."

### 4. Internal Consistency Check

- Verify that findings do not contradict each other.
- Verify that severity/risk ratings are consistent across findings
  of similar nature.
- Verify that the executive summary accurately reflects the body.
- Verify that remediation recommendations do not conflict with
  stated constraints.

### 5. Completeness Gate

Before finalizing, answer these questions explicitly (even if only
internally):

- [ ] Have I addressed the stated goal or success criteria?
- [ ] Are all deliverable artifacts present and well-formed?
- [ ] Does every claim have supporting evidence or an explicit label?
- [ ] Have I stated what I did NOT examine and why?
- [ ] Have I sampled and re-verified at least 3 specific data points?
- [ ] Is the output internally consistent?

If any answer is "no," address the gap before finalizing.

### 6. Determinism Check

When the output contains instructions, protocols, checklists, or
other directive text intended for LLM consumption, scan for language
that introduces non-deterministic interpretation:

- [ ] Are all instructions specific enough that two different LLMs
      would produce structurally similar output?
- [ ] Are quantifiers concrete (specific counts or ranges, not
      "some" or "several")?
- [ ] Are evaluation criteria observable (not subjective adjectives
      like "good" or "appropriate")?
- [ ] Do all conditionals have explicit else/default branches?
- [ ] Are action verbs decomposed into specific sub-steps (not
      standalone "analyze" or "evaluate")?

If any answer is "no," tighten the language before finalizing. If the
vague language serves a deliberate purpose (e.g., allowing LLM
discretion in creative tasks), mark it with an inline comment
`<!-- intentionally flexible -->` and leave it unchanged. This check
applies to generated prompt text, instruction files, and protocol
content — not to narrative prose, user-facing explanations, or
creative output.
