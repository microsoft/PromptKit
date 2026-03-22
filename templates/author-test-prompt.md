<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-test-prompt
description: >
  Produce a structured prompt that a coding agent (Copilot, Claude,
  Cursor) consumes to generate spec-compliant test code. The output
  is a prompt document, not test code. Pairs with audit-test-compliance
  for a generate/verify loop.
persona: test-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: validation-plan
params:
  project_name: "Name of the project or module being tested"
  requirements_doc: "The requirements document content"
  validation_plan: "The validation plan content (with TC-NNN test case definitions)"
  language: "Target programming language — e.g., 'Rust', 'Python', 'C', 'TypeScript'"
  test_framework: "Test framework and conventions — e.g., 'pytest with fixtures', 'Rust #[test] + tokio::test for async', 'Jest with describe/it'"
  focus_areas: "Optional narrowing — e.g., 'security test cases only', 'TC-001 through TC-020' (default: all)"
  audience: "Who will consume this prompt — e.g., 'GitHub Copilot', 'Claude Code', 'QA team'"
input_contract:
  type: validation-plan
  description: >
    A validation plan with numbered test case definitions (TC-NNN),
    linked requirements (REQ-IDs), and expected results. A requirements
    document with acceptance criteria.
output_contract:
  type: validation-plan
  description: >
    A structured test generation brief formatted as a validation plan
    that a coding agent consumes to generate spec-compliant test code.
    Includes TC-NNN traceability instructions and assertion guidance.
---

# Task: Author Test Generation Prompt

You are tasked with producing a **structured prompt** that a coding
agent will consume to generate test code. The output is a prompt
document — you do NOT write test code yourself.

## Inputs

**Project Name**: {{project_name}}

**Requirements Document**:
{{requirements_doc}}

**Validation Plan**:
{{validation_plan}}

**Target Language**: {{language}}

**Test Framework**: {{test_framework}}

**Focus Areas**: {{focus_areas}}

**Audience**: {{audience}}

## Instructions

1. **Map test cases to test functions.** For each TC-NNN in the
   validation plan, produce a test specification that includes:
   - The TC-NNN ID and linked REQ-ID(s)
   - The test steps from the validation plan (inputs, actions, sequence)
   - The expected results and pass/fail criteria
   - A traceability instruction: "Name the test function with the
     TC-NNN ID normalized for the target language (e.g., `TC-001` →
     `test_tc_001_...` in Python/Rust, `testTc001...` in Java) and
     include a comment using the language-appropriate syntax with the
     exact REQ-ID(s) from the requirements document (e.g.,
     `# Verifies REQ-AUTH-003` in Python, `// Verifies REQ-AUTH-003`
     in Rust/Java)"

2. **For each test case**, specify the assertions needed:
   - **Positive assertions**: Verify the expected behavior occurs
   - **Negative assertions**: For MUST NOT requirements, assert the
     prohibited behavior does NOT occur
   - **Boundary assertions**: For requirements with thresholds, assert
     at the boundary value, above it, and below it
   - **Ordering assertions**: For sequence requirements (MUST X before
     Y), assert the ordering, not just the outcome

3. **Map acceptance criteria to assertions.** For each linked
   requirement's acceptance criteria (AC1, AC2, AC3...):
   - Specify which assertion(s) verify each criterion
   - Flag criteria with no corresponding assertion — every AC must
     have at least one assertion

4. **Include test framework guidance.** Using the target language and
   test framework:
   - Specify test function naming conventions using the normalized
     TC-NNN ID (e.g., `test_tc_001_syn_retransmit_timeout` in
     Python/Rust, `testTc001SynRetransmitTimeout` in Java)
   - Specify fixture/setup patterns
   - Specify assertion style (assert_eq, expect, should, etc.)
   - Specify how to handle async tests, timeouts, and cleanup

5. **Specify exclusions** for the "Out of Scope" section. List
   behaviors that are explicitly excluded:
   - Test cases marked as manual-only or deferred in the validation plan
   - Implementation details not tied to requirements
   - Code paths not specified in any requirement

6. **Format the output** according to the validation-plan format.
   Place exclusions under section "2.2 Out of Scope" per the format's
   structure.

7. **Quality checklist** — before finalizing, verify:
   - [ ] Every automatable TC-NNN from the validation plan within the
         focus areas appears in the test brief. TC-NNNs outside the
         focus areas are listed under Out of Scope.
   - [ ] Every test specification includes its linked REQ-ID(s) and
         acceptance criteria
   - [ ] Every acceptance criterion has at least one specified assertion
   - [ ] Negative cases are specified for MUST NOT requirements
   - [ ] Boundary cases are specified for threshold requirements
   - [ ] Traceability instructions are included (TC-NNN in test names,
         REQ-ID in comments)
   - [ ] Test framework conventions are specified
   - [ ] An "Out of Scope" section exists under Scope
   - [ ] The output is consumable by the target audience (coding agent)

## Non-Goals

- Do NOT write test code — produce the prompt only.
- Do NOT invent test cases not in the validation plan — if you
  identify a coverage gap, flag it as a note, don't add tests.
- Do NOT include test cases outside the focus areas.
- Do NOT generate implementation code — that is the job of
  `author-implementation-prompt`.
