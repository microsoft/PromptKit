<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-protocol-validation
description: >
  Derive a protocol validation specification from a protocol spec.
  Produces a structured test blueprint covering state machine coverage,
  message format conformance, error handling, and interoperability
  scenarios. Designed so an LLM or engineer can use the output to
  build a conformance test tool.
persona: protocol-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/protocol-validation-design
format: protocol-validation-spec
params:
  protocol_name: "Name of the protocol — e.g., 'TCP', 'QUIC', 'CoAP'"
  protocol_spec: "The protocol specification text (RFC, internet-draft, or formal spec)"
  protocol_spec_id: "Identifier for the spec — e.g., 'RFC 9293', 'draft-ietf-quic-v2-10'"
  requirements_doc: "Optional — a structured requirements document (from extract-rfc-requirements) for the protocol"
  validation_scope: "Optional narrowing — e.g., 'connection establishment only', 'error handling', 'full protocol' (default: full protocol)"
  validation_objective: "What the validation spec will be used for — e.g., 'building an automated conformance test tool', 'manual test plan for interop testing', 'LLM-driven test generation'"
  audience: "Who will read the output — e.g., 'test engineers building a conformance tool', 'protocol implementers', 'LLM generating test code'"
input_contract:
  type: requirements-document
  description: >
    Optionally accepts a structured requirements document extracted from
    the protocol specification (from extract-rfc-requirements). When
    provided, enables precise requirement-to-test traceability.
output_contract:
  type: protocol-validation-spec
  description: >
    A structured protocol validation specification with state machine
    tests, message format tests, error handling tests, interoperability
    scenarios, and validation tool requirements.
---

# Task: Author Protocol Validation Specification

You are tasked with producing a **protocol validation specification**
that serves as a blueprint for building a conformance test suite or
validation tool. The output must be structured enough that an LLM or
engineer can use it to implement the tests.

## Inputs

**Protocol Name**: {{protocol_name}}

**Protocol Specification**:
{{protocol_spec}}

**Specification ID**: {{protocol_spec_id}}

**Existing Requirements Document** (optional):
{{requirements_doc}}

**Validation Scope**: {{validation_scope}}

**Validation Objective**: {{validation_objective}}

**Audience**: {{audience}}

## Instructions

1. **Apply the protocol-validation-design reasoning protocol.**
   Execute all five phases in order. This is the core methodology —
   do not skip phases.

2. **Extract the protocol model** (Phase 1). Build the testable
   model: state machines, message formats, error model, negotiation
   mechanisms. If a requirements document is provided, cross-reference
   the model against requirements.

3. **If a validation scope is specified**, perform the full model
   extraction (Phase 1) but restrict test design (Phases 2–4) to the
   specified scope. Report what was excluded and why.

4. **Identify testable properties** (Phase 2). Derive properties from
   the protocol model: state machine properties (reachability,
   completeness, safety, liveness), message format properties
   (well-formedness, rejection of malformed input), error handling
   properties (detection, signaling, recovery), and interoperability
   properties.

5. **Design test cases** (Phase 3). For each testable property,
   produce concrete test cases with:
   - Positive tests (valid input → correct behavior)
   - Negative tests (invalid input → correct rejection/error)
   - Boundary tests (edge values)
   - Sequence tests (multi-step state machine paths)

6. **Design the validation oracle** (Phase 4). Define how a tool
   determines pass/fail for each test category. Tailor the oracle
   design to the validation objective:
   - If building an automated tool: specify machine-readable oracles.
   - If manual testing: specify human-verifiable criteria.
   - If LLM-driven test generation: specify the oracle as assertions
     the LLM should include in generated test code.

7. **Analyze coverage and gaps** (Phase 5). Verify every requirement
   has at least one test. Classify gaps as testable, tooling,
   environmental, or specification gaps.

8. **Apply the anti-hallucination protocol.** Every test case must
   trace to a specific protocol requirement or specification section.
   Do NOT invent test cases for behavior not defined in the
   specification. If the specification is underspecified for a given
   scenario, flag it as a specification gap — do NOT invent expected
   behavior.

9. **Format the output** using the protocol-validation-spec format.
   Map the protocol model to the document structure:
   - State machine validation → Section 4
   - Message format validation → Section 5
   - Error handling validation → Section 6
   - Negotiation tests → Section 7
   - Interoperability scenarios → Section 8
   - Boundary conditions → Section 9
   - Tool requirements → Section 10
   - Coverage summary → Section 11

10. **Write for the specified audience.** Adjust the level of detail
    based on who will consume the validation spec:
    - For test engineers: include implementation hints and tooling
      suggestions.
    - For LLMs: include structured, unambiguous test specifications
      that can be mechanically translated into code.
    - For protocol implementers: include rationale for each test
      (why this behavior matters).

## Quality Checklist

Before finalizing, verify:

- [ ] Every MUST requirement has at least one test case
- [ ] Every SHOULD requirement has a test case or an explicit
      justification for deferral
- [ ] The state × event matrix has no empty cells (every combination
      is specified)
- [ ] Every test case has both positive and negative variants
- [ ] Every test case references at least one requirement (REQ-ID)
      or specification section
- [ ] Test IDs use the correct prefixes (SM-, MF-, EH-, NC-, IO-, BC-)
- [ ] The validation oracle is defined for each test category
- [ ] The coverage summary accurately reflects test counts and gaps
- [ ] No fabricated protocol behavior — all test expectations trace
      to specification text
- [ ] Specification gaps are flagged, not silently resolved

## Non-Goals

- Do NOT implement the test suite — produce the validation
  specification only.
- Do NOT execute tests against an implementation — this is a design
  document, not a test run.
- Do NOT assess the quality of the protocol's design — only derive
  tests for what it specifies.
- Do NOT invent expected behavior for underspecified scenarios — flag
  them as specification gaps.
- Do NOT include performance or stress tests unless the protocol
  specification defines specific performance requirements.
