<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: structured-findings
type: format
description: >
  Output format for structured findings documents. Transforms raw
  diagnostic output (compiler warnings, linter results, security scans)
  into consolidated, classified findings with root cause analysis,
  severity assessment, and remediation guidance.
produces: structured-findings
---

# Format: Structured Findings

The output MUST be a structured findings document with the following
sections in this exact order. Diagnostics sharing the same root cause
and fix MUST be consolidated into a single finding with multiple
occurrence locations.

## Document Structure

```markdown
# <Component/Analysis> — Structured Findings

## 1. Analysis Context
<What was analyzed, what tools/compilers/scanners produced the diagnostics,
target platform, configuration settings.
Format as a metadata table:

| Field | Value |
|-------|-------|
| **Component** | component or module under analysis |
| **Tool/Compiler** | name and version of the diagnostic tool |
| **Target Platform** | OS, architecture, runtime version |
| **Configuration** | flags, warning levels, rule sets enabled |
| **Analysis Date** | when the analysis was performed |
| **Source Revision** | commit SHA or branch analyzed |
>

## 2. Findings

### Finding F-<NNN>: <Concise Bug Title>

| Field | Value |
|-------|-------|
| **Finding ID** | F-001 |
| **Occurrences** | N (if consolidated) |
| **Diagnostic** | Exact diagnostic message/code |
| **Category** | Human-readable category |
| **Severity** | Critical / High / Medium / Low / Informational |
| **Confidence** | Confirmed / Likely / Suspicious / Needs Investigation |
| **Status** | New / Investigating / Fix Submitted / Resolved / Won't Fix |

#### Occurrence Locations (if consolidated)
| # | File | Line | Column | Context |
|---|------|------|--------|---------|
| 1 | ... | ... | ... | ... |

#### Diagnostic Output
<Exact diagnostic message as reported by the tool.
Include the full text — warning code, message, and any notes or
supplementary diagnostics produced alongside the primary message.>

#### Code Context
<Problematic code with surrounding context (10+ lines).
Use fenced code blocks with the appropriate language tag.
Highlight the specific line(s) that trigger the diagnostic.>

#### Analysis
**Root Cause**: <Technical explanation of why the diagnostic fires.
Explain the underlying defect, not just the symptom.>

**Behavioral Impact**: <What happens at runtime — crash, silent
data corruption, incorrect output, resource leak, or benign.>

#### Recommended Fix
<Before/after code example showing the specific change.
Use fenced code blocks with language tags for both.
If a single fix addresses multiple occurrences, show the pattern once
and note which occurrences it covers.>

#### Verification
<How to verify the fix is correct:
- Expected change in diagnostic output (warning eliminated, count reduced)
- Test cases that exercise the fixed code path
- Any regression risks to watch for>

#### Related Findings
<Cross-references to other findings that share the same root cause,
affect the same component, or would be addressed by the same fix.
Use Finding IDs (e.g., "See F-003, F-007").
If no related findings exist, state "None identified".>

## 3. Findings Summary

### Consolidation Summary
| Metric | Value |
|--------|-------|
| Unique Findings | N |
| Total Occurrences | N |
| Consolidated Findings | N (containing M occurrences) |

### By Severity
| Severity | Findings | Occurrences |
|----------|----------|-------------|

### By Confidence
| Confidence | Findings |
|------------|----------|

### By Diagnostic
| Diagnostic | Findings | Occurrences |
|------------|----------|-------------|

## 4. References
<Source materials consulted during analysis:
- Build logs, scan reports, CI artifacts
- Source files examined
- Documentation, specifications, or standards referenced
- Related issues, PRs, or prior investigations>
```

## Formatting Rules

### Consolidation

- Findings with the **same diagnostic**, the **same root cause**, and
  the **same fix** MUST be consolidated into a single finding with
  multiple occurrences listed in the Occurrence Locations table.
- Do NOT consolidate when any of the following differ: diagnostic
  code/message, root cause, or required fix. Each distinct problem
  gets its own finding even if the diagnostics look superficially
  similar.
- When consolidating, use the most representative occurrence as the
  primary code example in the Code Context section. The Occurrence
  Locations table captures all instances.
- The Occurrences field in the classification table MUST equal the
  row count in the Occurrence Locations table.

### Ordering

- Findings MUST be ordered by severity (Critical first), then by
  occurrence count (highest first) within the same severity level.

### Required Content

- Every finding MUST include at minimum: the classification table,
  diagnostic output, code context, and analysis sections.
- Evidence MUST be concrete — exact diagnostic messages and actual
  source code, not paraphrased descriptions.
- The Findings Summary section MUST account for every finding and
  every occurrence; totals must be consistent.
- The Recommended Fix section MUST show compilable/runnable code,
  not pseudocode or partial snippets.
- Single-occurrence findings omit the Occurrence Locations table
  but MUST still include the location in the classification table's
  Diagnostic field or in the Code Context section.

### Severity Criteria

| Severity | Criteria |
|----------|----------|
| **Critical** | Crash, memory corruption, data loss, or security vulnerability |
| **High** | Incorrect runtime behavior — wrong results, broken functionality |
| **Medium** | Potential runtime impact — depends on inputs, timing, or platform |
| **Low** | Code quality issue — maintainability, style, redundancy |
| **Informational** | Benign or intentional — documented suppression or known trade-off |

### Confidence Criteria

| Confidence | Criteria |
|------------|----------|
| **Confirmed** | Verified through code inspection, reproduction, or test evidence |
| **Likely** | Strong evidence from static analysis; high probability of real defect |
| **Suspicious** | Unclear intent — code may be correct but warrants review |
| **Needs Investigation** | Insufficient context to determine impact; requires further analysis |

This format uses a **four-level confidence scale** calibrated for
structured diagnostic output (compiler warnings, linter results, security
scans) where the primary question is "how certain are we this is a genuine
defect vs. a false positive or intentional pattern?"

*Template authors: do not substitute the confidence scales from
`investigation-report` (High / Medium / Low) or `exhaustive-review-report`
(Confirmed / High-confidence / Needs-domain-check) — each scale is
calibrated for its specific use case.*

### General

- Do not omit sections; if a section has no content, state
  "None identified."
- Use fenced code blocks with language tags for all code snippets.
- Finding IDs use a zero-padded three-digit sequence: F-001, F-002, etc.
- The Analysis Context section MUST list all tools and configurations
  used, so the analysis is reproducible.
- When quoting diagnostic output, preserve the exact formatting
  including file paths, line numbers, and caret indicators.
- Cross-reference related findings bidirectionally — if F-001
  references F-003, then F-003 must also reference F-001.
- The Findings Summary tables MUST be computed from the actual
  findings; do not estimate or approximate counts.

### Source Fidelity

Document whether source code was directly available or context was
reconstructed from diagnostic output alone:

- `Source Fidelity: Direct` — source files were directly accessed for
  analysis. Code context is verbatim from the source.
- `Source Fidelity: Reconstructed` — context inferred from diagnostic
  output only (e.g., build logs without source access). Code snippets
  may be incomplete.

Include this marker in the Analysis Context section (Section 1).

### Established Patterns

When recommending a fix, search the codebase for existing instances of
the same diagnostic that have already been resolved. If established
fix patterns exist:

- Include an **Established Pattern in Codebase** subsection within
  the Recommended Fix, citing the file path and line where the pattern
  was previously applied.
- Align new fixes with established precedent to maintain consistency.
- If no established pattern exists, state "No prior instances found
  in the codebase" and document the fix as a new pattern candidate.
