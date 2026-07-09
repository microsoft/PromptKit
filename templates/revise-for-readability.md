<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: revise-for-readability
description: >
  Revise an existing technical document into clear, readable prose without
  changing its technical meaning. Measure a bounded prose corpus, diagnose
  clarity defects, revise with the Paramedic Method and plain-language rules,
  re-measure, and produce a readability revision report.
persona: plain-language-editor
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/readability-gate
  - reasoning/readability-revision-workflow
format: readability-revision-report
params:
  document: "The document (or section) to revise — pasted text or a file path"
  target_audience: "Who reads this document (e.g., expert engineers, new team members, general technical audience); sets the readability target band"
  constraints: "Any terms, style rules, or sections that must be preserved verbatim, beyond the default protected tokens"
input_contract: null
output_contract:
  type: readability-revision-report
  description: >
    The revised document plus a measurement scope, a before/after readability
    scorecard, an accuracy attestation, and residual issues.
---

# Task: Revise for Readability

You are tasked with revising the following document so it reads clearly on the
first pass, without changing what it means. Verbose, jargon-heavy, hard-to-parse
prose becomes short, direct, plain prose; technical meaning stays exact.

## Inputs

**Document to revise**:
{{document}}

**Target audience**:
{{target_audience}}

**Additional preservation constraints**:
{{constraints}}

## Instructions

1. **Bound the corpus first.** Apply the `readability-gate` corpus boundary
   (Rule 1), which is the operative exclusion set. Measure and revise only
   human-facing prose; leave everything Rule 1 excludes unchanged — for example
   code, YAML, tables, URLs and file paths, logs and error strings, diagrams,
   identifiers, normative keywords, requirement IDs, citations, and quoted
   text — plus anything named in {{constraints}}.

2. **Set the target from the audience.** Select the tier with the
   `readability-gate` tier-selection ladder (Rule 3): classify
   {{target_audience}} if given; otherwise infer the tier from the document's
   stated audience or purpose (genre cues, not the draft's current complexity);
   otherwise use general-technical. Record the tier and the basis that chose it.

3. **Work the revision workflow in order.** Apply the
   `readability-revision-workflow` protocol end to end:
   - Baseline measurement (Phase 2): when a code-execution tool is available,
     compute the Flesch scores with a script; otherwise record Flesch as
     `not measured` and gate on the countable proxies. Never enter an estimated
     Flesch score as if it were computed.
   - Defect diagnosis (Phase 3): locate and name each clarity defect.
   - Targeted revision (Phase 4): apply the Paramedic Method and the
     plain-language rules under the accuracy lock.
   - Re-measurement and acceptance (Phase 5).
   - Accuracy verification (Phase 6).

4. **Hold meaning above readability** (`anti-hallucination`). Do not invent,
   drop, or soften any claim. Keep every epistemic label, citation, assumption,
   limitation, and uncertainty disclosure; compress only redundant phrasing.
   When clarity and precision conflict, keep precision and record a residual
   issue.

5. **Pass the gate** (`readability-gate`). Accept the revision only when the
   gate passes or when every remaining failure is a justified,
   precision-preserving residual issue.

6. **Verify before finalizing** (`self-verification`). Re-check at least three
   revised sentences against the original for meaning drift, confirm every
   protected token is unchanged, and confirm the scorecard counts match the
   actual revision.

7. **Produce the readability revision report.** Format the output per the
   `readability-revision-report` format. The Revised Document section (report
   Section 1) MUST contain the complete revised document, ready to use.

## Non-Goals

- Do NOT change technical meaning, normative force, or any protected token —
  edit the prose around them.
- Do NOT rewrite code, data, tables, diagrams, quoted text, or format
  scaffolding.
- Do NOT restructure the document, reorder sections, or add or remove
  substantive content or claims; this task revises prose, it does not redesign
  the document. Adding a minimal definition or acronym expansion that restates
  meaning already present in the source counts as prose revision, not new
  content.
- Do NOT report an estimated Flesch score as a computed one, and do NOT claim a
  readability gain without a before/after comparison.

## Quality Checklist

Before finalizing, verify:

- [ ] The Revised Document section (report Section 1) contains the full revised
      document, usable as-is
- [ ] Measurement scope lists what was included and excluded, and the Flesch
      metric source (computed / not measured)
- [ ] Scorecard shows before and after values for every metric, with target and
      status
- [ ] Every protected token (normative keywords, identifiers, requirement IDs,
      quantities, defined terms, citations, quoted text, and others) is unchanged
- [ ] Every required epistemic label and citation from the source is preserved
- [ ] Change summary reports only categories that had edits, with representative
      examples
- [ ] Accuracy attestation and residual issues are present (or "None identified")
- [ ] The readability gate passes, or each failure is a justified residual issue
