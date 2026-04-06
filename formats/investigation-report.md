<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: investigation-report
type: format
description: >
  Output format for bug investigation and security audit reports.
  Covers findings, root cause analysis, evidence, and remediation.
produces: investigation-report
---

# Format: Investigation Report

The output MUST be a structured investigation report. Use the **full
format** by default. Use the **abbreviated format** when the conditions
below are met.

## Format Selection

Before writing the report, **enumerate and classify all findings first**
(count and highest severity). Then choose the format:

- **Abbreviated**: finding count is 5 or fewer AND no Critical/High severity
- **Full**: more than 5 findings, or any Critical/High, or incident
  response / security audit context

If the invoking template or workflow explicitly requires the full
9-section structure, use the full format regardless of finding count.

## Abbreviated Format

Use the abbreviated format when **both** conditions are true:

1. Total finding count is **5 or fewer**, AND
2. **No** findings are Critical or High severity

The abbreviated format includes only these sections:

```markdown
# <Investigation Title> — Investigation Report

## 1. Executive Summary
<2–4 sentences: what was investigated, the key finding(s),
severity, and recommended action.>

## 2. Findings

### Finding F-<NNN>: <Short Title>
- **Severity**: Medium / Low / Informational
- **Category**: <bug class>
- **Location**: <file:line or component>
- **Description**: <detailed explanation of the issue>
- **Evidence**: <code snippets, logs, or file references>
- **Remediation**: <specific fix recommendation>
- **Confidence**: High / Medium / Low

## 3. Remediation Plan
<Prioritized list of fixes:

| Priority | Finding | Fix Description | Effort | Risk |
|----------|---------|-----------------|--------|------|
| 1        | F-001   | ...             | S/M/L  | ...  |>

## 4. Coverage
- **Examined**: <what was analyzed>
- **Excluded**: <what was not examined, and why>
```

All formatting rules and the confidence framework from the full format
still apply. The abbreviated format omits Problem Statement,
Investigation Scope, Root Cause Analysis, Prevention, Open Questions,
and Revision History — these add overhead without analytical value for
routine, low-severity audits.

If there are **zero findings**, state "None identified" in the Findings
section and "No remediation required" in the Remediation Plan. The
Coverage section must still document what was examined.

If any finding is later upgraded to Critical or High during the
investigation, switch to the full format.

## Full Format

Use the full format when the abbreviated conditions are **not** met
(more than 5 findings, or any Critical/High severity finding), or when
the investigation is an incident response, security audit, or other
context where narrative and prevention matter.

The full format MUST include the following sections in this exact order.
Sections **1–8** are required. Section **9 (Revision History)** is
included only when the report is maintained across revisions; if
present, it MUST appear last. Omit §9 for single-pass automated audits
unless the invoking template or workflow explicitly requires the full
9-section structure — in that case, include §9 and state
"Single-pass report; no prior revisions." when there is no history.

## Document Structure

```markdown
# <Investigation Title> — Investigation Report

## 1. Executive Summary
<2–4 sentences: what was investigated, the key finding(s),
severity, and recommended action. This section is for stakeholders
who will not read the full report.>

## 2. Problem Statement
<What was observed? What is the expected behavior?
When was it first reported? What is the impact?>

## 3. Investigation Scope
- **Codebase / components examined**: <list>
- **Time period**: <when the investigation was conducted>
- **Tools used**: <static analysis, dynamic analysis, manual review, etc.>
- **Limitations**: <what was NOT examined and why>

## 4. Findings

### Finding F-<NNN>: <Short Title>
- **Severity**: Critical / High / Medium / Low / Informational
- **Category**: <bug class — e.g., memory leak, race condition, injection>
- **Location**: <file:line or component>
- **Description**: <detailed explanation of the issue>
- **Evidence**: <code snippets, logs, stack traces, reproduction steps>
- **Root Cause**: <fundamental cause, not just the symptom>
- **Impact**: <what can go wrong — security, reliability, data integrity>
- **Remediation**: <specific fix recommendation>
- **Confidence**: High / Medium / Low
  <If not High, explain what additional investigation would increase confidence.>

## 5. Root Cause Analysis
<If a single root cause underlies multiple findings, describe the
causal chain here. Use the root-cause-analysis protocol structure:
symptoms → hypotheses → evidence → confirmed cause → causal chain.>

## 6. Remediation Plan
<Prioritized list of fixes:

| Priority | Finding | Fix Description | Effort | Risk |
|----------|---------|-----------------|--------|------|
| 1        | F-001   | ...             | S/M/L  | ...  |>

## 7. Prevention
<Recommendations to prevent recurrence:
- Code changes (assertions, checks, safer APIs)
- Process changes (code review checklists, testing requirements)
- Tooling (static analysis rules, CI checks, monitoring)>

## 8. Open Questions
<Unresolved items that need further investigation.
For each: what is unknown, why it matters, and what would resolve it.>

## 9. Revision History
<Table: | Version | Date | Author | Changes |
Include only for documents maintained across revisions.
Omit for single-pass automated audits.>
```

## Formatting Rules

- Findings MUST be ordered by severity (Critical first).
- Every finding MUST have a remediation recommendation.
- Evidence MUST be concrete — code snippets, not vague descriptions.
- The executive summary MUST be understandable without reading the rest.

## Confidence Framework

This format uses a **three-level confidence scale**: High / Medium / Low.

| Level | Meaning |
|-------|---------|
| **High** | Finding is verified through code inspection, reproduction, or direct evidence. The root cause is confirmed. |
| **Medium** | Finding has reasonable supporting evidence but some uncertainty remains — e.g., partial reproduction, indirect evidence, or an untested code path. |
| **Low** | Finding is plausible but evidence is weak or circumstantial. Expert review or additional investigation is needed before acting. |

This scale is calibrated for general bug investigation and security audit
reports where the primary question is "how certain are we this is a real
defect?" If not High, the Confidence field MUST include an explanation of
what additional investigation would increase confidence.

*Template authors: do not substitute the confidence scales from
`exhaustive-review-report` (Confirmed / High-confidence / Needs-domain-check)
or `structured-findings` (Confirmed / Likely / Suspicious / Needs
Investigation) — each scale is calibrated for its specific use case.*
