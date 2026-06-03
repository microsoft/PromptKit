<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-coverage-gaps
description: >
  Audit uncovered code regions against requirements, validation artifacts,
  and tests. Uses coverage data as a deterministic discovery signal for
  missing validation and undocumented behavior.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - reasoning/coverage-gap-analysis
taxonomies:
  - specification-drift
format: investigation-report
params:
  project_name: "Name of the project or feature being audited"
  coverage_report: "Coverage artifact content or report excerpt showing uncovered or partially covered regions"
  requirements_doc: "The requirements document content"
  validation_plan: "The validation plan content"
  design_doc: "The design document content (optional — omit for a requirements-only audit)"
  code_context: "Source code to audit — files, modules, or repository path"
  test_code: "Test source code to inspect for validation coverage"
  coverage_scope: "Optional narrowing for the coverage signal — e.g., '0-hit regions only', 'include partial branches', 'coverage below 80%'"
  focus_areas: "Optional narrowing — e.g., 'authentication module', 'retry paths' (default: audit all significant uncovered regions)"
  audience: "Who will read the audit report — e.g., 'spec owners', 'engineering leads'"
input_contract:
  type: validation-plan
  description: >
    A validation plan and requirements document, plus a coverage artifact,
    source code, and test code used to triage uncovered regions against
    specification intent.
output_contract:
  type: investigation-report
  description: >
    An investigation report classifying coverage-driven drift findings
    using the specification-drift taxonomy (D2, D9, D11, D12, D13),
    with evidence, exclusions, and escalation guidance.
---

# Task: Audit Coverage Gaps

You are tasked with auditing **uncovered code regions** against the
requirements, validation plan, and test suite to determine whether low
coverage signals missing validation or undocumented behavior.

## Inputs

**Project Name**: {{project_name}}

**Coverage Report**:
{{coverage_report}}

**Requirements Document**:
{{requirements_doc}}

**Validation Plan**:
{{validation_plan}}

**Design Document** (if provided):
{{design_doc}}

**Source Code**:
{{code_context}}

**Test Code**:
{{test_code}}

**Coverage Scope**: {{coverage_scope}}

**Focus Areas**: {{focus_areas}}

**Audience**: {{audience}}

## Instructions

1. **Apply the coverage-gap-analysis protocol.** Execute all phases in
   order. Treat the coverage report as a deterministic source of
   **candidates**, not as direct proof of drift.

2. **Classify only confirmed findings** using the specification-drift
   taxonomy. Every reported finding MUST have exactly one of:
   - `D2_UNTESTED_REQUIREMENT`
   - `D9_UNDOCUMENTED_BEHAVIOR`
   - `D11_UNIMPLEMENTED_TEST_CASE`
   - `D12_UNTESTED_ACCEPTANCE_CRITERION`
   - `D13_ASSERTION_MISMATCH`

   `D8_UNIMPLEMENTED_REQUIREMENT` is intentionally out of scope for this
   workflow: this audit starts from uncovered implemented regions in a
   coverage artifact, so requirements with no implementation at all are
   better handled by `audit-code-compliance`.

   Excluded regions belong in **Investigation Scope** and inconclusive
   regions belong in **Open Questions**, not in the findings list.

3. **If the design document is not provided**, skip design-specific
   tracing. Trace uncovered regions directly from requirements to code.
   Do NOT fabricate design intent.

4. **If coverage scope or focus areas are specified**, still build the
   initial candidate ledger from the provided coverage artifact, but
   restrict detailed tracing and classification to the narrowed scope.
   Explicitly document which candidate regions were excluded by scope.

5. **Apply the anti-hallucination protocol.** Every finding must cite:
   - the coverage region location and raw coverage evidence
   - the requirement or design location, or explicit absence for D9
   - the validation-plan location, or explicit absence for D2
   - the test-code location, or explicit absence for D11

   Do NOT invent requirements, tests, branch boundaries, or intended
   behavior that are not evidenced in the provided artifacts.

6. **Apply the operational-constraints protocol.** Do not attempt to
   ingest the entire codebase or test suite blindly. Use the coverage
   artifact to identify candidate regions first, then deep-read only the
   code and tests needed to disambiguate those regions.

7. **Format the output** according to the investigation-report format.
   Map this task's work products as follows:
   - Phase 1 candidate ledger and scoping method -> **Investigation Scope**
   - Phase 2 disambiguation results -> **Investigation Scope** and
     **Open Questions** for inconclusive regions
   - Phases 3-5 classified regions -> **Findings**, one F-NNN per finding
   - Phase 6 metrics -> **Executive Summary** and a coverage subsection
     in **Root Cause Analysis**
   - Escalation paths and next actions -> **Remediation Plan**

8. **State the scope boundary explicitly** in the report:
   - This audit examined uncovered or partially covered regions only.
   - Covered code was not evaluated for specification alignment by this task.

9. **Quality checklist** — before finalizing, verify:
   - [ ] Every finding has exactly one drift label from D2, D9, D11, D12, D13
   - [ ] Each normalized candidate region maps to at most one finding; split distinct behavioral units instead of stacking labels
   - [ ] Every finding cites coverage evidence and concrete artifact locations
   - [ ] Excluded regions are documented with rationale and are not reported as findings
   - [ ] Inconclusive regions state what evidence is missing
   - [ ] The report distinguishes missing validation from undocumented behavior
   - [ ] The report states that covered code remains out of scope
   - [ ] Coverage metrics are calculated from actual candidate counts
   - [ ] Escalation recommendations are concrete and aligned to the finding type

## Non-Goals

- Do NOT treat uncovered code as automatically buggy or drifted.
- Do NOT clear covered code as specified, correct, or adequately validated.
- Do NOT execute the code or run the coverage tool — this task analyzes
  the provided coverage artifact and related source material.
- Do NOT rewrite requirements, tests, or code — report findings and
  recommended next actions only.
- Do NOT expand into a full repository maintenance audit unless the
  findings explicitly warrant escalation.
