<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: validation-plan
type: format
description: >
  Output format for test and validation plans. Covers test strategy,
  test cases, coverage mapping, and acceptance criteria verification.
produces: validation-plan
consumes: requirements-document
---

# Format: Validation Plan

The output MUST be a structured validation plan with the following
sections in this exact order.

## Document Structure

```markdown
# <Project/Feature Name> — Validation Plan

## 1. Overview
<1–2 paragraphs: what is being validated, the validation strategy,
and the relationship to the requirements and design documents.>

## 2. Scope of Validation

### 2.1 In Scope
<What will be tested/validated.>

### 2.2 Out of Scope
<What will NOT be tested, and why.>

### 2.3 Assumptions and Prerequisites
<Environment, tooling, data, and access requirements.>

## 3. Test Strategy

### 3.1 Test Levels
<Which levels apply and what they cover:
- Unit testing
- Integration testing
- System testing
- Performance testing
- Security testing
- Acceptance testing>

### 3.2 Test Approach
<For each test level:
- What is tested
- How it is tested (manual, automated, hybrid)
- Tooling used
- Entry and exit criteria>

## 4. Requirements Traceability Matrix
<Table mapping every requirement to its test cases.
Format:

| Requirement ID | Requirement Summary | Test Case IDs | Status |
|----------------|---------------------|---------------|--------|
| REQ-AUTH-001   | User login          | TC-001, TC-002| Planned|>

## 5. Test Cases

### TC-<NNN>: <Test Case Name>
- **Requirement(s)**: <REQ-IDs this test verifies>
- **Preconditions**: <required state before execution>
- **Test Steps**:
  1. <step 1>
  2. <step 2>
  3. ...
- **Expected Result**: <specific, measurable outcome>
- **Priority**: Critical / High / Medium / Low
- **Type**: Functional / Performance / Security / Regression

## 6. Risk-Based Test Prioritization
<Which areas have the highest risk and therefore need
the most thorough testing? Justification for prioritization.>

## 7. Pass/Fail Criteria
<What constitutes a passing validation? What blocks release?
Define both per-test and aggregate criteria.>

## 8. Revision History
<Table: | Version | Date | Author | Changes |>
```

## Formatting Rules

- Every requirement MUST appear in the traceability matrix.
- Every test case MUST reference at least one requirement.
- Requirements with no test cases MUST be flagged as coverage gaps.
- Test steps MUST be specific enough for someone unfamiliar with the
  system to execute.
