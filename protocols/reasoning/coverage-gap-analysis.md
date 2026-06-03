<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: coverage-gap-analysis
type: reasoning
description: >
  Deterministic protocol for turning code coverage gaps into specification
  drift candidates. Normalizes uncovered regions, filters incidental code,
  traces remaining regions to requirements and validation artifacts, and
  classifies missing validation versus undocumented behavior.
applicable_to:
  - audit-coverage-gaps
---

# Protocol: Coverage Gap Analysis

Apply this protocol when a coverage report is available and the goal is to
use uncovered code as a **discovery signal** for specification drift.

Coverage gaps are **candidate generators, not findings by themselves**.
Covered code is **out of scope** for this protocol and MUST NOT be treated
as evidence that the behavior is specified or adequately validated.

## Phase 1: Coverage Signal Inventory

Build a reproducible inventory of coverage gaps before tracing them.

1. **Identify the coverage artifact**:
   - Record the coverage tool or report format if evident.
   - Record what test scope produced it (unit, integration, mixed) if stated.
   - Record any stated exclusions, filters, or generated-code suppressions.

2. **Extract uncovered regions**:
   - Capture every uncovered or partially covered region with file path,
     line range, and coverage kind (`no hits`, `partial branch`, or
     equivalent from the report).
   - If the report only provides function-level or file-level data, keep
     that granularity. Do NOT invent finer block boundaries.

3. **Normalize regions into reviewable units**:
   - Merge adjacent uncovered lines only when they are clearly part of the
     same behavioral unit (same function, branch body, or error path).
   - Preserve the original report evidence so the normalization can be
     reproduced.

4. **Create a candidate ledger**:
   - Assign each normalized region a unique identifier (`CG-001`, `CG-002`, ...).
   - For each entry record: file path, line range, enclosing symbol,
     coverage kind, and the raw coverage evidence used to create it.

## Phase 2: Disambiguation Before Drift Classification

Do NOT classify uncovered regions until you determine whether they are
behaviorally significant.

1. **Exclude clearly non-significant code**:
   - Logging, metrics, debug strings, tracing hooks, boilerplate
     serialization, generated code, trivial accessors, and test-only
     scaffolding are excluded unless the specification explicitly
     constrains them.
   - Record excluded regions in the coverage summary with rationale.
     Do NOT turn them into findings.

2. **Check for inactive or intentionally unreachable paths**:
   - Feature-flagged code, platform-gated branches, deprecated paths,
     fault-injection hooks, and known-dead fallback branches may explain
     missing coverage without implying drift.
   - If the inactive status is evidenced, exclude the region with the
     supporting rationale.
   - If the status is plausible but not evidenced, mark the region as
     **INCONCLUSIVE** and state what additional context is needed.

3. **Determine behavioral significance**:
   A region is significant when it affects one or more of:
   - user-visible behavior
   - data mutation or persistence
   - access control or trust boundaries
   - external communication or side effects
   - state transitions
   - error contracts, retry logic, or timeout behavior
   - resource lifecycle or requirement-bound constraints
   - synchronization or shared resource access enforcement contracts

4. **Only advance significant, in-scope regions**:
   - Regions that are excluded or inconclusive stop here.
   - Regions that are significant proceed to specification tracing.

## Phase 3: Specification Trace for Significant Regions

For each significant uncovered region, determine whether it traces to
documented intent.

1. **Search requirements and design artifacts**:
   - Look for explicit REQ-ID references, acceptance criteria,
     domain terminology, and design mechanisms that match the region's behavior.
   - If no design document is provided, skip design checks and trace
     directly from requirements to code.

2. **Record positive traceability**:
   - When a region maps to one or more REQ-IDs, record the governing
     requirement(s), acceptance criteria, and any relevant design sections.

3. **Handle absent traceability carefully**:
   - If the region implements genuine product behavior and no requirement
     or design trace can be found, classify it as a candidate
     **D9_UNDOCUMENTED_BEHAVIOR**.
   - If the region appears to be reasonable infrastructure that supports
     other requirements indirectly, record it as excluded rather than D9.

4. **Handle ambiguous traceability**:
   - If multiple REQ-IDs are plausible, carry all plausible mappings
     forward and mark the finding confidence accordingly.
   - Do NOT invent a new requirement to resolve the ambiguity.

## Phase 4: Validation Trace for Requirement-Linked Regions

For each significant uncovered region that traces to a requirement,
determine whether the uncovered status reflects missing validation,
missing tests, or weak assertions.

1. **Check the validation plan**:
   - Determine whether the linked REQ-ID has one or more TC-NNN entries
     in the validation plan or traceability matrix.
   - If no validation entry exists, classify the gap as
     **D2_UNTESTED_REQUIREMENT** unless the plan explicitly marks the
     requirement as manual-only or deferred.

2. **Check test implementation**:
   - If a TC-NNN exists, search the provided test code for the
     implementing test.
   - If no implementing test is found, classify the gap as
     **D11_UNIMPLEMENTED_TEST_CASE**.

3. **Check assertion sufficiency**:
   - If tests exist, determine whether the uncovered region corresponds
     to unexercised acceptance criteria, negative paths, boundary cases,
     ordering constraints, or semantic assertions that the test does not verify.
   - Missing required criterion exercise is
     **D12_UNTESTED_ACCEPTANCE_CRITERION**.
   - Incorrect or overly coarse assertions that leave the behavior
     effectively unverified are **D13_ASSERTION_MISMATCH**.

4. **Respect documented manual-only validation**:
   - If the validation plan explicitly documents that the behavior is
     validated manually or deferred outside the automated suite,
     record that rationale and exclude the region from D11-D13 findings.

5. **Handle insufficient evidence**:
   - If the available test context is insufficient to distinguish D12
     from D13, mark the region **INCONCLUSIVE** and state the missing
     evidence instead of guessing.

## Phase 5: Classification and Escalation

Turn only the confirmed regions into findings.

1. **Assign exactly one classification from the specification-drift
   taxonomy** to each confirmed region:
   - `D2_UNTESTED_REQUIREMENT`
   - `D9_UNDOCUMENTED_BEHAVIOR`
   - `D11_UNIMPLEMENTED_TEST_CASE`
   - `D12_UNTESTED_ACCEPTANCE_CRITERION`
   - `D13_ASSERTION_MISMATCH`

   If one source location appears to support multiple labels, split it
   into separate normalized candidate regions only when the evidence
   supports distinct behavioral units. Do NOT stack multiple drift
   labels onto one confirmed region.

2. **For each finding provide**:
   - the coverage region location
   - the specification location(s), or `None — no matching requirement identified` for D9
   - the validation and test location(s), or explicit absence
   - the disambiguation rationale
   - the impact of leaving the region uncovered
   - a concrete recommended next action

3. **Recommended next actions**:
   - D9 findings that appear to describe real behavior with no governing
     requirement are good candidates for
     `requirements-from-implementation` or `spec-extraction-workflow`.
   - D2, D11, D12, and D13 clusters that suggest broader validation drift
     are good candidates for `audit-traceability` or
     `audit-test-compliance`.

4. **Do NOT promote excluded or inconclusive regions into findings**.

## Phase 6: Coverage Summary

After individual findings, produce aggregate metrics:

1. **Coverage candidate count**: total normalized regions, excluded regions,
   inconclusive regions, and classified findings.
2. **Traceability split**: requirement-linked vs unlinked significant regions.
3. **Finding distribution**: count by D2, D9, D11, D12, D13.
4. **Exclusion reasons**: grouped counts for generated code,
   infrastructure-only code, manual-only validation, inactive paths, and
   other documented exclusions.
5. **Overall assessment**: a short judgment of whether the dominant issue
   appears to be missing validation, undocumented behavior, or mixed drift.
6. **Scope limitation**: explicitly state that this protocol examined
   uncovered regions only and did not clear covered code for
   specification or validation compliance.
