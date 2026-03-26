<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: exhaustive-review-report
type: format
description: >
  Output format for exhaustive code review with per-file coverage ledgers,
  adversarial finding templates requiring falsification proof, and
  false-positive rejection logs.
produces: exhaustive-review-report
---

# Format: Exhaustive Review Report

The output MUST be a structured review report with per-file coverage
ledgers and adversarial finding documentation. The format prioritizes
**proof of coverage** and **proof that findings are not false positives**
over narrative flow.

## Document Structure

```markdown
# <Review Title> — Exhaustive Review Report

## Per-File Analysis

### FILE: <path>

#### Coverage Ledger

| Check                                 | Status         |
|---------------------------------------|----------------|
| Full file read                        | yes / no       |
| High-risk functions reviewed          | <list>         |
| Lock/refcount/goto cleanup traced     | yes / no       |
| Arithmetic sites reviewed             | yes / no       |
| User/kernel boundary paths reviewed   | yes / no / N/A |
| Interlocked/concurrency paths reviewed| yes / no / N/A |

#### Findings

<If no findings>
No concrete bug found after full path tracing.
<Otherwise, for each finding use the template below.>

#### Finding F-<NNN>: <Short Title>

- **Confidence**: Confirmed | High-confidence | Needs-domain-check
- **Severity**: Critical | High | Medium | Low
- **Category**: <defect category ID and name, e.g., K3: Cleanup omission>
- **Lines**: <exact line numbers or ranges>

**Why this is a real bug:**
<Brief technical explanation of the defect.>

**Trigger path:**
<Step-by-step control flow from entry point through the failing path.
Use numbered steps with line references.>

**Why this is NOT a false positive:**
<Disproof of the most likely counterargument. Explain why existing
cleanup, retry logic, helper routines, or caller guarantees do NOT
neutralize this issue. Reference specific code.>

**Consequence:**
<Concrete bad outcome — crash, data corruption, resource leak,
privilege escalation, denial of service, etc.>

**Minimal fix direction:**
<Brief description of the fix approach. Not a full patch — just
enough to indicate what needs to change.>

#### False-Positive Candidates Rejected

| Candidate | Reason Rejected |
|-----------|-----------------|
| <description> | <why this is NOT a bug — cite the mechanism that makes it safe> |

<Repeat ### FILE block for each file in scope.>

---

## Executive Summary

> **IMPORTANT**: Do not write this section until every file in the
> assigned scope has a completed coverage ledger above.

<2–4 sentences: total files reviewed, total findings by confidence
level, highest-severity issue, and recommended action.>

## Findings Summary

| ID     | File   | Title  | Category | Confidence | Severity |
|--------|--------|--------|----------|------------|----------|
| F-001  | ...    | ...    | ...      | ...        | ...      |

## Open Questions

<Items that could not be resolved from the provided code alone.
For each: what is unknown, why it matters, and what would resolve it.>
```

## Formatting Rules

- Every file MUST have a coverage ledger, even if no findings are produced.
- Findings MUST include the "Why this is NOT a false positive" field —
  findings without falsification proof are incomplete.
- The executive summary MUST NOT appear until all per-file sections are
  complete.
- Findings MUST be numbered sequentially across all files (F-001, F-002, …).
- The false-positive candidates rejected table MUST be present for every
  file, even if empty (write "None" in that case).
- Findings are ordered by confidence (Confirmed first), then by severity.
- Each finding MUST have a concrete consequence — "might be bad" is not
  acceptable.
