<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) Standard Prompt Library Contributors -->

---
name: investigation-report
type: format
description: >
  Output format for bug investigation and security audit reports.
  Covers findings, root cause analysis, evidence, and remediation.
produces: investigation-report
---

# Format: Investigation Report

The output MUST be a structured investigation report with the following
sections in this exact order.

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
<Table: | Version | Date | Author | Changes |>
```

## Formatting Rules

- Findings MUST be ordered by severity (Critical first).
- Every finding MUST have a remediation recommendation.
- Evidence MUST be concrete — code snippets, not vague descriptions.
- The executive summary MUST be understandable without reading the rest.
