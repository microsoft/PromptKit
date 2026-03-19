<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-validation-plan
description: >
  Generate a validation and test plan that ensures all requirements
  are covered by test cases with clear pass/fail criteria.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: validation-plan
params:
  project_name: "Name of the project or feature"
  requirements_doc: "The requirements document content"
  design_doc: "The design document content (optional but recommended)"
  audience: "Who will read the output — e.g., 'QA engineers', 'development team'"
input_contract:
  type: requirements-document
  description: >
    A requirements document with numbered REQ-IDs and acceptance criteria.
    Optionally, a design document for implementation-aware test design.
output_contract:
  type: validation-plan
  description: >
    A validation plan with test cases, traceability matrix, and
    risk-based prioritization.
---

# Task: Author Validation Plan

You are tasked with producing a **validation plan** that ensures all
requirements are tested and verifiable.

## Inputs

**Project Name**: {{project_name}}

**Requirements Document**:
{{requirements_doc}}

**Design Document** (if available):
{{design_doc}}

## Instructions

1. **Build the requirements traceability matrix first.** List every REQ-ID
   from the requirements document. This is your coverage target — every
   requirement MUST have at least one test case.

2. **Generate test cases** for each requirement:
   - Derive tests from the acceptance criteria in the requirements doc.
   - Add negative test cases (what should NOT happen).
   - Add boundary/edge case tests where applicable.
   - If the design document is provided, add integration-level tests
     based on component interactions.

3. **Apply the anti-hallucination protocol.** Test cases MUST verify
   behaviors described in the requirements — do NOT invent test cases
   for requirements that do not exist.

4. **Format the output** according to the validation-plan format specification.

5. **Prioritize** test cases by risk:
   - Critical: failure would cause data loss, security breach, or system outage
   - High: failure would cause significant functionality loss
   - Medium: failure affects non-core functionality
   - Low: cosmetic or minor behavioral issues

6. **Quality checklist** — before finalizing, verify:
   - [ ] Every REQ-ID appears in the traceability matrix
   - [ ] Every REQ-ID has at least one test case
   - [ ] Every test case has specific, executable steps
   - [ ] Every test case has a measurable expected result
   - [ ] Coverage gaps are explicitly flagged
   - [ ] Pass/fail criteria are defined at both test and aggregate level
