<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: protocol-validation-spec
type: format
description: >
  Output format for protocol validation specifications. Structures
  conformance tests around state machine coverage, message format
  verification, error handling, and interoperability scenarios.
  Designed to be consumed by an LLM or engineer building a validation
  tool or test suite.
produces: protocol-validation-spec
consumes: requirements-document
---

# Format: Protocol Validation Specification

The output MUST be a structured protocol validation specification with
the following sections in this exact order. The document serves as a
blueprint for building a conformance test suite or validation tool.

## Document Structure

```markdown
# <Protocol Name> — Protocol Validation Specification

## 1. Overview
<1–2 paragraphs: what protocol is being validated, the validation
strategy, and the relationship to the protocol specification and any
requirements documents. State the validation objective — conformance
testing, interoperability testing, or both.>

## 2. Validation Scope

### 2.1 Protocol Under Test
- **Specification**: <RFC number, spec version, or document title>
- **Protocol roles validated**: <client, server, intermediary, all>
- **Protocol layers covered**: <which layers of the protocol stack>

### 2.2 In Scope
<What aspects of the protocol will be validated.>

### 2.3 Out of Scope
<What will NOT be validated, and why. E.g., performance testing,
stress testing, specific transport layers.>

### 2.4 Assumptions and Prerequisites
<Environment requirements, network topology, tooling, peer
implementations needed for interoperability tests.>

## 3. Requirements Traceability

<Table mapping protocol requirements to validation test groups:

| Requirement ID | Requirement Summary | Keyword | Test Group(s) | Coverage |
|----------------|---------------------|---------|---------------|----------|
| REQ-XXX-001    | ...                 | MUST    | SM-001, MF-001| Full     |
| REQ-XXX-002    | ...                 | SHOULD  | EH-003        | Partial  |>

Coverage values: Full, Partial (with explanation), None (with
justification — e.g., requires manual testing, requires specific
hardware).

## 4. State Machine Validation

### 4.1 State Inventory
<Table of all protocol states:

| State ID | State Name | Entry Conditions | Steady-State Invariants |>

### 4.2 Transition Tests

#### SM-<NNN>: <Transition Name>
- **From state**: <state name>
- **Trigger**: <event or input that causes the transition>
- **Expected action**: <what the implementation must do>
- **Expected next state**: <target state>
- **Requirement(s)**: <REQ-IDs>
- **Validation method**: <how to verify — observe output, inspect
  state, check side effects>
- **Negative case**: <what happens if the trigger occurs in the
  wrong state — the implementation MUST reject/ignore/error>

### 4.3 State Coverage Matrix
<Matrix: states × events → expected behavior (transition, reject,
ignore). Every cell must be specified. Empty cells are
underspecification findings.>

## 5. Message Format Validation

### 5.1 Message Inventory
<Table of all message types:

| Message Type | Direction | Required Fields | Optional Fields |>

### 5.2 Format Tests

#### MF-<NNN>: <Message/Field Name>
- **Message type**: <message type name>
- **Field**: <field name>
- **Valid values**: <enumeration, range, or format specification>
- **Invalid values to test**: <boundary values, out-of-range,
  malformed encoding, truncated messages>
- **Requirement(s)**: <REQ-IDs>
- **Validation method**: <send crafted message, verify acceptance
  or rejection behavior>

### 5.3 Encoding and Serialization Tests
<Tests for byte ordering, alignment, padding, length field accuracy,
and encoding correctness. Reference specific ABNF rules or encoding
specifications.>

## 6. Error Handling Validation

### 6.1 Error Inventory
<Table of all defined error conditions:

| Error Code/Type | Trigger Condition | Expected Behavior | Recovery |>

### 6.2 Error Tests

#### EH-<NNN>: <Error Scenario Name>
- **Error condition**: <what triggers the error>
- **Injection method**: <how to provoke the error — malformed input,
  timeout, out-of-order message, etc.>
- **Expected response**: <error code, message, state transition>
- **Recovery verification**: <how to verify the implementation
  recovers correctly after the error>
- **Requirement(s)**: <REQ-IDs>

## 7. Negotiation and Capability Tests

<If the protocol includes version negotiation, capability exchange,
or parameter agreement:

#### NC-<NNN>: <Negotiation Scenario Name>
- **Scenario**: <e.g., client offers v2, server only supports v1>
- **Expected outcome**: <agreed version/capability, or failure mode>
- **Fallback behavior**: <what happens when negotiation fails>
- **Requirement(s)**: <REQ-IDs>

If no negotiation mechanisms exist, state "The protocol does not
define negotiation mechanisms.">

## 8. Interoperability Scenarios

<End-to-end scenarios that verify two implementations can communicate:

#### IO-<NNN>: <Scenario Name>
- **Topology**: <e.g., client A ↔ server B, proxy chain>
- **Scenario steps**: <numbered sequence of actions>
- **Success criteria**: <what constitutes successful interoperation>
- **Variations**: <different implementation choices for SHOULD/MAY
  behaviors that should all interoperate>
- **Requirement(s)**: <REQ-IDs>

If interoperability testing is out of scope, state why.>

## 9. Boundary and Stress Conditions

<Tests for boundary values, resource limits, and edge cases:

#### BC-<NNN>: <Boundary Condition Name>
- **Condition**: <e.g., maximum message size, maximum concurrent
  connections, timer expiration at exact boundary>
- **Expected behavior**: <what the spec says should happen>
- **Requirement(s)**: <REQ-IDs>

Note: This section covers specification-defined boundaries, not
performance testing.>

## 10. Validation Tool Requirements

<If the validation spec is intended to inform tool construction:
- **Input format**: <how protocol traffic is captured or injected —
  pcap, API calls, socket-level>
- **Oracle definition**: <how the tool determines pass/fail — compare
  against state machine model, verify field values, check error codes>
- **Reporting requirements**: <what the tool should report — per-test
  pass/fail, coverage summary, trace logs>
- **Automation constraints**: <timing sensitivity, ordering
  requirements, environmental dependencies that affect automation>>

## 11. Coverage Summary
<Aggregate coverage statistics:

| Category | Total Tests | MUST Coverage | SHOULD Coverage | MAY Coverage |
|----------|-------------|---------------|-----------------|--------------|
| State Machine | NN | NN/NN (100%) | NN/NN (NN%) | NN/NN (NN%) |
| Message Format | NN | ... | ... | ... |
| Error Handling | NN | ... | ... | ... |
| Negotiation | NN | ... | ... | ... |
| Interoperability | NN | ... | ... | ... |
| Boundary | NN | ... | ... | ... |

- **Gaps**: <list any requirements with no test coverage and why>>

## 12. Revision History
<Table: | Version | Date | Author | Changes |>
```

## Formatting Rules

- When a requirements document with REQ-IDs is provided, every test MUST
  reference at least one requirement (REQ-ID). When no such document is
  provided, every test MUST instead cite the relevant protocol specification
  section(s) and the normative statement being validated.
- When requirements with REQ-IDs exist, every MUST requirement MUST have at
  least one test. SHOULD and MAY requirements SHOULD have tests but may be
  deferred with justification.
- Tests MUST include both positive (valid input → correct behavior) and
  negative (invalid input → correct rejection/error) cases.
- The state coverage matrix MUST have no empty cells — every
  state × event combination must specify the expected behavior.
- Test IDs use prefixed sequences: SM- (state machine), MF- (message
  format), EH- (error handling), NC- (negotiation/capability),
  IO- (interoperability), BC- (boundary condition).
- If a section has no applicable content, state "Not applicable" with
  a brief explanation — do NOT omit the section.
