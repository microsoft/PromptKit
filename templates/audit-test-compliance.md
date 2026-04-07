<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-test-compliance
description: >
  Audit test code against a validation plan and requirements document.
  Detects unimplemented test cases, missing acceptance criteria
  assertions, and assertion mismatches. Classifies findings using the
  specification-drift taxonomy (D11–D13).
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - reasoning/test-compliance-audit
taxonomies:
  - specification-drift
format: investigation-report
params:
  project_name: "Name of the project or feature being audited"
  requirements_doc: "The requirements document content"
  validation_plan: "The validation plan content (with TC-NNN test case definitions)"
  test_code: "Test source code to audit — test files, test modules, or test directory contents"
  focus_areas: "Optional narrowing — e.g., 'security test cases only', 'TC-001 through TC-020' (default: audit all)"
  audience: "Who will read the audit report — e.g., 'QA leads', 'development team'"
input_contract:
  type: validation-plan
  description: >
    A validation plan with numbered test case definitions (TC-NNN),
    linked requirements (REQ-IDs), and expected results. A requirements
    document with acceptance criteria. Test source code to audit against
    the plan.
output_contract:
  type: investigation-report
  description: >
    An investigation report classifying test compliance findings
    using the D11–D13 taxonomy, with test implementation coverage
    metrics and remediation recommendations.
---

# Task: Audit Test Compliance

You are tasked with auditing test code against its validation plan to
detect **test compliance drift** — gaps between what was planned for
testing and what the automated tests actually verify.

## Inputs

**Project Name**: {{project_name}}

**Requirements Document**:
{{requirements_doc}}

**Validation Plan**:
{{validation_plan}}

**Test Code**:
{{test_code}}

**Focus Areas**: {{focus_areas}}

## Instructions

1. **Apply the test-compliance-audit protocol.** Execute all phases in
   order. This is the core methodology — do not skip phases.

2. **Classify every finding** using the specification-drift taxonomy
   (D11–D13). Every finding MUST have exactly one drift label, a
   severity, evidence, and a recommended resolution. Include specific
   locations in both the validation plan and the test code — except for
   D11 findings, which by definition have no test code location (use
   "None — no implementing test found" and describe what was searched).

3. **If focus areas are specified**, perform the full inventories
   (Phases 1–2) but restrict detailed tracing (Phases 3–4) to test
   cases and code modules related to the focus areas.

4. **Apply the anti-hallucination protocol.** Every finding must cite
   specific TC-NNN IDs and test code locations. Do NOT invent test
   cases or claim tests verify behavior you cannot point to. If you
   cannot fully trace a test case due to incomplete test code context,
   do NOT assign D11 — instead note the test case as INCONCLUSIVE with
   confidence Low and state what additional test code would be needed.
   Only assign D11 after searching the provided test code by: (1) test
   case ID (TC-NNN), (2) requirement ID (REQ-NNN), (3) test function
   naming patterns matching the test plan, and (4) test fixtures/helpers
   — and failing to find an implementation.

5. **Apply the operational-constraints protocol.** Do not attempt to
   ingest the entire test suite. Focus on the test functions that map
   to validation plan test cases and trace into helpers/fixtures only
   as needed to verify assertions.

6. **Format the output** according to the investigation-report format.
   Map the protocol's output to the report structure:
   - Phase 1–2 inventories → Investigation Scope (section 3)
   - Phases 3–4 findings → Findings (section 4), one F-NNN per issue
   - Phase 5 classification → Finding severity and categorization
   - Phase 6 coverage summary → Executive Summary (section 1) and
     a "Coverage Metrics" subsection in Root Cause Analysis (section 5)
   - Recommended resolutions → Remediation Plan (section 6)

7. **Quality checklist** — before finalizing, verify:
   - [ ] Every automatable TC-NNN from the validation plan appears in
         at least one finding or is confirmed as implemented
   - [ ] Every finding has a specific drift label (D11, D12, or D13)
   - [ ] Every finding cites both validation plan and test code
         locations (D11 findings use "None — no implementing test found")
   - [ ] D11 findings include what test case was expected and why no
         implementation was found
   - [ ] D12 findings include which acceptance criteria are missing
         and which are present
   - [ ] D13 findings include both the expected assertion (from the
         plan) and the actual assertion (from the code)
   - [ ] Manual-only and deferred test cases are excluded from findings
         but counted in the coverage summary
   - [ ] Coverage metrics are calculated from actual counts
   - [ ] The executive summary is understandable without reading the
         full report

## Non-Goals

- Do NOT modify the test code — report findings only.
- Do NOT execute or run the tests — this is static analysis of test
  code against the validation plan, not test execution.
- Do NOT assess test code quality (style, readability, performance)
  unless it directly relates to whether the test verifies what the
  plan specifies.
- Do NOT generate missing test implementations — identify and classify
  the gaps.
- Do NOT evaluate whether the validation plan's test cases are correct
  or sufficient — only whether the test code implements them faithfully.
- Do NOT expand scope beyond the provided documents and code.
