<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: discover-tests-for-changes
description: >
  Analyze local code changes to identify the affected components and
  discover relevant tests. Finds test files near changed code, checks
  test configuration, and recommends test execution strategy.
persona: test-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
format: triage-report
params:
  changes_description: "(Optional) Description of the changes — if not provided, analyze git status"
  source_root: "Root directory of the source repository"
  test_patterns: "(Optional) Glob patterns for test files — e.g., '*_test.go', '*.test.js', 'test_*.py'. If not provided, infer from the project's language and conventions."
  test_frameworks: "(Optional) Test frameworks in use — e.g., 'pytest', 'jest', 'gtest', 'TAEF'. If not provided, infer from project files."
input_contract: null
output_contract:
  type: triage-report
  description: >
    A prioritized report of relevant tests for the local changes,
    including test files found, test configuration, and execution
    recommendations.
---

# Task: Discover Tests for Local Changes

Analyze local code changes to identify affected components and discover
relevant tests that should be executed to validate the changes. The goal
is to give the developer a clear, actionable test plan before they submit
their changes for review.

## Inputs

**Changes Description**:
{{changes_description}}

**Source Root**: {{source_root}}

**Test Patterns**: {{test_patterns}}

**Test Frameworks**: {{test_frameworks}}

## Instructions

1. **Understand the scope of changes**:
   - If {{changes_description}} is provided, use it to understand the changes
   - Otherwise, analyze `git status` and `git diff` to identify changed files
   - Classify each changed file by type: source, test, build config, docs
   - Identify the component, feature area, or subsystem affected
   - For high-impact areas (e.g., shared libraries, core APIs, configuration),
     assume broader test coverage is needed
   - Note any cross-cutting concerns (e.g., logging, error handling, auth)
     that may require tests from multiple components
   - Ignore changes to documentation, CI configuration, or IDE settings
     unless specifically relevant

2. **Locate associated tests**:
   - Search for test files near the changed code using {{test_patterns}} or
     inferred patterns
   - Look in these locations (in priority order):
     a. Same directory as changed files
     b. `test/`, `tests/`, `__tests__/` subdirectories
     c. Sibling `*_test.*` or `test_*.*` files
     d. Project-wide test directories matching the component name
     e. Integration or end-to-end test directories that exercise the
        changed component
   - For each test file found, briefly describe what it tests
   - Note any test fixtures, helpers, or shared setup files that the
     discovered tests depend on

3. **Check test configuration**:
   - Look for test runner configuration files (e.g., `pytest.ini`,
     `jest.config.*`, `testpasses`, `.testlist`, `Makefile` test targets)
   - Identify test suites or groups that include the discovered tests
   - Check if tests are scheduled in CI/CD pipelines
   - Note any environment variables, fixtures, or setup steps required
     to run the tests locally

4. **Assess test coverage**:
   - Map changed functions/classes to test files that exercise them
   - Identify gaps: changed code with NO associated tests
   - Flag high-risk changes that lack test coverage

5. **Recommend execution strategy**:
   - Prioritize tests by relevance to the changes
   - Suggest the minimum test set for quick validation (fastest feedback)
   - Suggest the comprehensive test set for full validation (pre-submit)
   - Provide exact commands to run the recommended tests using
     {{test_frameworks}} or the inferred framework
   - Include any necessary setup steps (e.g., build, fixtures, env vars)

## Output Format

Present findings as a triage report with these sections:

1. **Changed Components** — List of directories/files with changes and their
   classification (source, test, config, docs)
2. **Associated Tests** — Test files found, grouped by component, with a
   brief description of what each test covers
3. **Test Configuration** — Test suites, scheduling, and local run
   prerequisites relevant to the discovered tests
4. **Coverage Gaps** — Changed code with no associated tests, ranked by risk
5. **Execution Recommendations** — Prioritized test commands split into
   quick-validation and comprehensive sets

## Non-Goals

- Do NOT write new tests — only discover existing ones
- Do NOT run the tests — only recommend what to run
- Do NOT analyze test quality — focus on relevance to changes
- Do NOT modify any files

## Quality Checklist

Before finalizing, verify:

- [ ] All changed files are accounted for
- [ ] Test search covered all standard test locations
- [ ] Coverage gaps are explicitly identified
- [ ] Execution commands are concrete and copy-pasteable
- [ ] Recommendations are prioritized (quick validation vs comprehensive)
