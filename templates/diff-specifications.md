<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: diff-specifications
description: >
  Compare two versions of a specification at the invariant level.
  Extract invariants from both, classify each change by type and
  backward-compatibility impact, and produce migration guidance
  for implementors and test authors.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/spec-evolution-diff
format: investigation-report
params:
  spec_name: "Name of the specification being compared — e.g., 'Device Firmware Update Protocol v2.1'"
  old_version: "The old (baseline) specification text"
  old_version_id: "Identifier for the old version — e.g., 'v2.0', 'RFC 1234', 'draft-03'"
  new_version: "The new (proposed or released) specification text"
  new_version_id: "Identifier for the new version — e.g., 'v2.1', 'RFC 1234bis', 'draft-04'"
  context: "Additional context — what the specification governs, known implementation landscape, migration constraints"
  focus_areas: "Optional — specific areas to prioritize (e.g., 'state machine changes', 'security requirements', 'error handling'). Default: all"
  audience: "Who will read the output — e.g., 'implementors planning migration', 'spec authors reviewing a draft', 'test engineers updating test suites'"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    An investigation report where each finding is a semantic change
    between specification versions, classified by type (Added, Removed,
    Tightened, Relaxed, Modified, Clarified) and backward-compatibility
    impact, with migration guidance for implementors.
---

# Task: Diff Specification Versions

You are tasked with producing a **semantic diff** of two specification
versions. This is not a textual diff — you must extract the invariants
and requirements from both versions, align them, and classify every
change by its type and impact on existing implementations.

## Inputs

**Specification Name**: {{spec_name}}

**Old Version** ({{old_version_id}}):
{{old_version}}

**New Version** ({{new_version_id}}):
{{new_version}}

**Context**: {{context}}

**Focus Areas**: {{focus_areas}}

**Audience**: {{audience}}

## Instructions

1. **Apply the spec-evolution-diff protocol.** Execute all six phases
   in order. This is the core methodology — do not skip phases.

2. **Phase 1 is the foundation.** Extract invariants from both versions
   thoroughly. The quality of the diff depends entirely on the quality
   of the extraction. For each version, systematically identify all
   normative requirements, state machines and transitions, constraints,
   error-handling behaviors, and guarantees that must hold across all
   compliant implementations.

3. **Be precise about keyword strength changes.** A change from SHOULD
   to MUST is a tightening that may break existing implementations. A
   change from MUST to SHOULD is a relaxing that won't break but shifts
   compliance expectations. Track these meticulously.

4. **Apply the anti-hallucination protocol** throughout:
   - Every change must cite specific text from both spec versions
   - Do NOT invent spec text or requirements that are not present
   - If you cannot determine whether a change is tightening or
     relaxing, classify it as MODIFIED and explain the ambiguity
   - Distinguish between [KNOWN] (spec explicitly states),
     [INFERRED] (derived from spec patterns), and
     [ASSUMED] (depends on unstated context)

5. **Format the output** according to the investigation-report format
   and its required per-finding fields (Severity, Category, Location,
   Evidence, Root Cause, Remediation, Confidence). The items below are
   **additional diff-specific details** and must not replace or remove
   any of the required investigation-report fields:
   - In the **Executive Summary**, state the total number of changes
     by type (N added, N removed, N tightened, N relaxed, N modified,
     N clarified) and the number of backward-incompatible changes
   - In the primary **Findings** section, maintain severity ordering
     (Critical first) as required by the investigation-report format.
     Each finding represents one change between versions.
   - For each finding, in addition to the required investigation-report
     per-finding fields, capture these diff-specific details (as
     sub-bullets under the corresponding required fields):
     - **Change type**: Added / Removed / Tightened / Relaxed /
       Modified / Clarified (under **Category**)
     - **Old text**: The invariant from the old version (or "N/A —
       new requirement" for ADDED) (under **Evidence**)
     - **New text**: The invariant from the new version (or "N/A —
       removed" for REMOVED) (under **Evidence**)
     - **Compatibility verdict**: Backward-compatible / Conditionally
       compatible / Backward-incompatible (under **Impact**)
     - **Migration action**: What implementors must do (if any)
       (under **Remediation**)
   - Within **4. Findings**, add a subsection `### Invariant Alignment
     Appendix` after the findings list: a table mapping old invariants
     to new invariants showing the change type for each pair
   - In the **Remediation Plan**, present migration items ordered by
     risk, not by spec section order

6. **Prioritize findings** by backward-compatibility impact:
   - **Critical**: Backward-incompatible change with no migration
     path — implementations will break
   - **High**: Backward-incompatible change with a clear migration
     path — implementations must change but can do so incrementally
   - **Medium**: Conditionally compatible — implementations break
     only if they relied on specific optional behavior
   - **Low**: Backward-compatible change that shifts best practice
     but requires no implementation changes
   - **Informational**: Editorial or clarification with no
     implementation impact

7. **Apply the self-verification protocol** before finalizing:
   - Re-read at least 3 findings and verify the cited spec text
     actually says what you claim in both versions
   - Verify the change classification is correct (is it truly a
     tightening, not a modification?)
   - Verify the compatibility verdict is justified
   - Check the invariant alignment appendix for completeness —
     every invariant from the old version should appear

## Non-Goals

- Do NOT produce a line-by-line textual diff — this is a semantic
  analysis at the invariant level
- Do NOT evaluate which version is "better" — only analyze what
  changed and its impact
- Do NOT generate updated implementation or test code — only produce
  migration guidance describing what must change
- Do NOT modify the specifications — this is analysis, not authoring
  (use `evolve-protocol` for interactive spec authoring)

## Quality Checklist

Before finalizing, verify:

- [ ] Invariants were extracted from both versions (Phase 1)
- [ ] Every old invariant was aligned to a new invariant or marked
      as removed (Phase 2)
- [ ] Every new invariant was aligned to an old invariant or marked
      as added (Phase 2)
- [ ] Every change has a type classification (Phase 3)
- [ ] Every change has a backward-compatibility verdict (Phase 4)
- [ ] Every backward-incompatible change has migration guidance (Phase 5)
- [ ] Cross-change interactions were analyzed (Phase 6)
- [ ] Executive summary includes change counts by type
- [ ] Findings are ordered by severity (Critical first)
- [ ] Invariant alignment appendix is complete
- [ ] All cited spec text is verbatim from the provided versions
