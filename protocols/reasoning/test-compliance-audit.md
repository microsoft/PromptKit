<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: test-compliance-audit
type: reasoning
description: >
  Systematic protocol for auditing test code against a validation plan
  and requirements document. Maps test case definitions to test
  implementations, verifies assertions match acceptance criteria, and
  classifies findings using the specification-drift taxonomy (D11–D13).
applicable_to:
  - audit-test-compliance
---

# Protocol: Test Compliance Audit

Apply this protocol when auditing test code against a validation plan
and requirements document to determine whether the automated tests
implement what the validation plan specifies. The goal is to find every
gap between planned and actual test coverage — missing tests,
incomplete assertions, and mismatched expectations.

## Phase 1: Validation Plan Inventory

Extract the complete set of test case definitions from the validation
plan.

1. **Test cases** — for each TC-NNN, extract:
   - The test case ID and title
   - The linked requirement(s) (REQ-XXX-NNN)
   - The test steps (inputs, actions, sequence)
   - The expected results and pass/fail criteria
   - The test level (unit, integration, system, etc.)
   - Any preconditions or environmental assumptions

2. **Requirements cross-reference** — for each linked REQ-ID, look up
   its acceptance criteria in the requirements document. These are the
   ground truth for what the test should verify.

3. **Test scope classification** — classify each test case as:
   - **Automatable**: Can be implemented as an automated test
   - **Manual-only**: Requires human judgment, physical interaction,
     or platform-specific behavior that cannot be automated
   - **Deferred**: Explicitly marked as not-yet-implemented in the
     validation plan
   Restrict the audit to automatable test cases. Report manual-only
   and deferred counts in the coverage summary.

## Phase 2: Test Code Inventory

Survey the test code to understand its structure.

1. **Test organization**: Identify the test framework (e.g., pytest,
   JUnit, Rust #[test], Jest), test file structure, and naming
   conventions.
2. **Test function catalog**: List all test functions/methods with
   their names, locations (file, line), and any identifying markers
   (TC-NNN in name or comment, requirement references).
3. **Test helpers and fixtures**: Identify shared setup, teardown,
   mocking, and assertion utilities — these affect what individual
   tests can verify.

Do NOT attempt to understand every test's implementation in detail.
Build the catalog first, then trace specific tests in Phase 3.

## Phase 3: Forward Traceability (Validation Plan → Test Code)

For each automatable test case in the validation plan:

1. **Find the implementing test**: Search the test code for a test
   function that implements TC-NNN. Match by:
   - Explicit TC-NNN reference in test name or comments
   - Behavioral equivalence (test steps and assertions match the
     validation plan's specification, even without an ID reference)
   - Requirement reference (test references the same REQ-ID)

2. **Assess implementation completeness**: For each matched test:

   a. **Step coverage**: Does the test execute the steps described in
      the validation plan? Are inputs, actions, and sequences present?

   b. **Assertion coverage**: Does the test assert the expected results
      from the validation plan? Check each expected result individually.

   c. **Acceptance criteria alignment**: Cross-reference the linked
      requirement's acceptance criteria. Does the test verify ALL
      criteria, or only a subset? Flag missing criteria as
      D12_UNTESTED_ACCEPTANCE_CRITERION.

   d. **Assertion correctness**: Do the test's assertions match the
      expected behavior? Check for:
      - Wrong thresholds (plan says 200ms, test checks for non-null)
      - Wrong error codes (plan says 403, test checks not-200)
      - Missing negative assertions (plan says "MUST NOT", test only
        checks positive path)
      - Structural assertions that don't verify semantics (checking
        "response exists" instead of "response contains expected data")
      Flag mismatches as D13_ASSERTION_MISMATCH.

3. **Classify the result**:
   - **IMPLEMENTED**: Test fully implements the validation plan's
     test case with correct assertions. Record the test location.
   - **PARTIALLY IMPLEMENTED**: Test exists but is incomplete.
     Classify based on *what* is missing:
     - Missing acceptance criteria assertions →
       D12_UNTESTED_ACCEPTANCE_CRITERION
     - Wrong assertions or mismatched expected results →
       D13_ASSERTION_MISMATCH
   - **NOT IMPLEMENTED**: No test implements this test case (no
     matching test function found in the provided code). Flag as
     D11_UNIMPLEMENTED_TEST_CASE. Note: a test stub with an empty
     body or skip annotation is NOT an implementation — classify it
     as D13 (assertions don't match because there are none) and
     record its code location.

## Phase 4: Backward Traceability (Test Code → Validation Plan)

Identify tests that don't trace to the validation plan.

1. **For each test function** in the test code, determine whether it
   maps to a TC-NNN in the validation plan.

2. **Classify unmatched tests**:
   - **Regression tests**: Tests added for specific bugs, not part of
     the validation plan. These are expected and not findings.
   - **Exploratory tests**: Tests that cover scenarios not in the
     validation plan. Note these but do not flag as drift — they may
     indicate validation plan gaps (candidates for new test cases).
   - **Orphaned tests**: Tests that reference TC-NNN IDs or REQ-IDs
     that do not exist in the validation plan or requirements. These
     may be stale after a renumbering. Report orphaned tests as
     observations in the coverage summary (Phase 6), not as D11–D13
     findings — they don't fit the taxonomy since no valid TC-NNN
     is involved.

## Phase 5: Classification and Reporting

Classify every finding using the specification-drift taxonomy.

1. Assign exactly one drift label (D11, D12, or D13) to each finding.
2. Assign severity using the taxonomy's severity guidance.
3. For each finding, provide:
   - The drift label and short title
   - The validation plan location (TC-NNN, section) and test code
     location (file, function, line). For D11 findings, the test code
     location is "None — no implementing test found" with a description
     of what was searched.
   - The linked requirement and its acceptance criteria
   - Evidence: what the validation plan specifies and what the test
     does (or doesn't)
   - Impact: what could go wrong
   - Recommended resolution
4. Order findings primarily by severity, then by taxonomy ranking
   within each severity tier.

## Phase 6: Coverage Summary

After reporting individual findings, produce aggregate metrics:

1. **Test implementation rate**: automatable test cases with
   implementing tests / total automatable test cases.
2. **Assertion coverage**: test cases with complete assertion
   coverage / total implemented test cases.
3. **Acceptance criteria coverage**: individual acceptance criteria
   verified by test assertions / total acceptance criteria across
   all linked requirements.
4. **Manual/deferred test count**: count of test cases classified as
   manual-only or deferred (excluded from the audit).
5. **Unmatched test count**: count of test functions in the test code
   with no corresponding TC-NNN in the validation plan (regression,
   exploratory, or orphaned).
6. **Overall assessment**: a summary judgment of test compliance
   (e.g., "High compliance — 2 missing tests" or "Low compliance —
   systemic assertion gaps across the test suite").
