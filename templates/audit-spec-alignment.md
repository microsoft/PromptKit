<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-spec-alignment
description: >
  Adversarial audit of specification patches against the user's
  original intent.  Verifies that requirements, design, and validation
  changes faithfully represent what the user asked for, with no
  drift, omissions, or scope creep.  Domain-agnostic.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/adversarial-falsification
  - reasoning/traceability-audit
taxonomies:
  - specification-drift
format: investigation-report
params:
  project_name: "Name of the project, product, or system"
  user_intent: "The user's original description of what they wanted to change"
  requirements_patch: "The structured requirements patch"
  spec_patch: "The structured specification patch (design + validation changes)"
  existing_artifacts: "Existing requirements, design, and validation documents for context"
input_contract:
  type: structured-patch
  description: >
    Structured patches for requirements and specifications, plus the
    user's original intent description.
output_contract:
  type: investigation-report
  description: >
    An adversarial audit report classifying alignment findings using
    the specification-drift taxonomy (D1–D7), with severity ratings
    and remediation recommendations.
---

# Task: Adversarial Audit of Specification Alignment

You are tasked with performing an **adversarial audit** of the
specification patches against the user's original intent.  Your goal
is to find every way the patches might NOT faithfully represent what
the user asked for.

**Your default stance is skepticism.**  Assume every change is wrong
until you can prove it is correct.

## Inputs

**Project**: {{project_name}}

**User's Original Intent**:
{{user_intent}}

**Requirements Patch**:
{{requirements_patch}}

**Specification Patch**:
{{spec_patch}}

**Existing Artifacts (for context)**:
{{existing_artifacts}}

## Instructions

### Step 1 — Reconstruct Intent

Before examining the patches, restate the user's intent in your own
words.  Identify:

1. What the user explicitly asked for
2. What the user implied but did not state
3. What the user explicitly excluded or constrained
4. Success criteria — how would the user judge whether the change
   is correct?

### Step 2 — Audit Requirements Patch Against Intent

For each requirement change in the requirements patch:

1. **Verify alignment** — does this change faithfully represent
   part of the user's intent?
2. **Check for drift** — does this change go beyond what the user
   asked for (scope creep)?  Classify as D3 (orphaned design decision).
3. **Check for omissions** — is any part of the user's intent NOT
   represented in the requirements changes?  Classify as D1 (untraced
   requirement).
4. **Check acceptance criteria** — are they specific, measurable,
   and aligned with what the user would consider "done"?
   Classify mismatches as D7.

### Step 3 — Audit Specification Patch Against Requirements

Apply the **traceability-audit protocol**:

1. **Forward traceability** — every requirement change MUST have
   corresponding design and validation changes.  Flag gaps as D1
   (untraced) or D2 (untested).
2. **Backward traceability** — every design/validation change MUST
   trace to a requirement change.  Flag orphans as D3 or D4.
3. **Cross-document consistency** — verify assumptions, constraints,
   and terminology are consistent across all patches.  Flag drift
   as D5 or D6.
4. **Acceptance criteria coverage** — verify test cases cover all
   acceptance criteria including negative cases and boundaries.
   Flag gaps as D7.

### Step 4 — Adversarial Falsification

Apply the **adversarial-falsification protocol**:

1. For each finding candidate, attempt to **disprove it** before
   reporting.  Can you construct a reasonable interpretation where
   the change IS aligned?
2. For each "no issues found" area, attempt to **find an issue**.
   Challenge your own conclusion.
3. Rate confidence: High (verified through direct evidence),
   Medium (reasonable but uncertain), Low (plausible but weak).

### Step 5 — Report

Produce an investigation report following the **investigation-report
format's required 9-section structure** exactly.  Do not add, remove,
or reorder top-level sections.  Map this template's content as follows:

- **Executive Summary** — overall alignment assessment (Aligned /
   Partially Aligned / Misaligned) with key D1–D7 findings.
- **Findings** — each classified with a D1–D7 label, severity,
   evidence, and specific remediation.
- **Remediation Plan** — prioritized list of changes needed to
   restore alignment.
- **Open Questions** — include the **Verdict** as a clearly labeled
   line: `Verdict: PASS | REVISE | RESTART`, where:
   - **PASS** — patches faithfully represent user intent, proceed
     to user review
   - **REVISE** — specific issues found, loop back to fix patches
   - **RESTART** — fundamental misalignment, loop back to
     requirements discovery

## Non-Goals

- Do NOT suggest improvements unrelated to alignment.
- Do NOT evaluate implementation quality — only alignment.
- Do NOT rewrite the patches — only identify issues and recommend fixes.

## Quality Checklist

- [ ] Every finding has a D1–D7 classification
- [ ] Every finding has specific evidence (not vague concerns)
- [ ] Every finding has a concrete remediation
- [ ] Adversarial falsification was applied — findings survived disproof
- [ ] User's original intent was fully accounted for
- [ ] Verdict clearly states PASS, REVISE, or RESTART
