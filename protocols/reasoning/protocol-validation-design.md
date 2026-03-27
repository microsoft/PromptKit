<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: protocol-validation-design
type: reasoning
description: >
  Systematic reasoning protocol for deriving a validation specification
  from a protocol specification. Transforms protocol requirements into
  structured test categories (state machine, message format, error
  handling, interoperability) with oracle definitions suitable for
  building a conformance test tool.
applicable_to:
  - author-protocol-validation
---

# Protocol: Protocol Validation Design

Apply this protocol when building a validation specification from a
protocol specification. The goal is to produce a document that an
engineer or LLM can use to implement a conformance test suite or
validation tool. Execute all phases in order.

## Phase 1: Protocol Model Extraction

Build a testable model of the protocol.

1. **Extract the state machine model**: For each state machine defined
   or implied in the protocol:
   - Enumerate all states and their invariants.
   - Enumerate all transitions: source state, trigger event, guard
     condition, action, target state.
   - Identify the initial state and all terminal states.
   - Build a state × event matrix. Every cell must be specified:
     transition, reject, ignore, or "underspecified" (a finding).

2. **Extract the message model**: For each message type:
   - Enumerate all fields: name, type, size, encoding, valid values.
   - Identify required vs. optional fields.
   - Identify validation rules: what makes a message well-formed vs.
     malformed?
   - Identify relationships between fields (e.g., length field governs
     payload size, type field determines interpretation of value field).

3. **Extract the error model**: For each defined error condition:
   - What triggers the error?
   - What is the expected response (error code, message, state
     transition)?
   - What recovery is expected (retry, abort, fallback)?
   - Are there error conditions that MUST be distinguished from each
     other (different error codes for different failures)?

4. **Extract negotiation and capability model**: If the protocol
   includes version negotiation, capability exchange, or parameter
   agreement:
   - What is the negotiation procedure?
   - What outcomes are possible (agreed version, fallback, failure)?
   - What happens when negotiation fails?

5. **Cross-reference with requirements**: If a requirements document
   is provided (from `extract-rfc-requirements` or similar), map each
   extracted model element to its requirement(s). Requirements without
   model elements are candidates for additional test design; model
   elements without requirements may indicate underspecification.

## Phase 2: Testable Property Identification

Derive testable properties from the protocol model.

1. **State machine properties**:
   - **Reachability**: Every defined state can be reached from the
     initial state via a valid sequence of inputs.
   - **Completeness**: Every state handles every possible input
     (transition, reject, or ignore — no undefined behavior).
   - **Safety invariants**: Properties that must hold in every state
     (e.g., "a connection in ESTABLISHED state always has a valid
     session key").
   - **Liveness properties**: The protocol eventually makes progress
     (e.g., "a connection does not remain in CLOSING state
     indefinitely").
   - **Determinism**: The same input in the same state always produces
     the same transition.

2. **Message format properties**:
   - **Well-formedness**: Every valid message satisfies all field
     constraints (type, size, encoding, value range).
   - **Rejection of malformed input**: Every malformed message is
     detected and handled (not silently accepted, not crash-inducing).
   - **Round-trip consistency**: A message serialized and deserialized
     produces the same logical content.
   - **Boundary values**: Fields at their minimum, maximum, and
     boundary values produce correct behavior.

3. **Error handling properties**:
   - **Detection**: Every defined error condition is detected when it
     occurs.
   - **Correct signaling**: The correct error code/response is produced
     for each error condition.
   - **Recovery**: After an error, the protocol reaches a well-defined
     state (not an undefined or stuck state).
   - **Distinguishability**: Different error conditions produce
     distinguishable responses (when the spec requires it).

4. **Interoperability properties**:
   - **Version compatibility**: Implementations of different versions
     can negotiate and communicate (or fail gracefully).
   - **Optional feature handling**: Implementations that do not support
     optional features correctly handle peers that do (and vice versa).
   - **SHOULD/MAY divergence**: Implementations that make different
     choices for SHOULD and MAY requirements can still interoperate.

5. **Security properties** (if the protocol has a security model):
   - **Confidentiality**: Protected data is not observable to
     unauthorized parties.
   - **Integrity**: Tampered messages are detected.
   - **Authentication**: Peers are correctly identified.
   - **Downgrade resistance**: An attacker cannot force use of weaker
     security parameters.

## Phase 3: Test Case Design

Transform testable properties into concrete test cases.

1. **For each testable property**, design one or more test cases:
   - **Positive test**: Verify the property holds under valid input.
   - **Negative test**: Verify the implementation correctly rejects
     or handles invalid input.
   - **Boundary test**: Verify behavior at the edges of valid ranges.
   - **Sequence test**: Verify behavior for specific sequences of
     inputs (especially for state machine properties).

2. **For state machine tests**:
   - Design a test for every transition in the state × event matrix.
   - Design negative tests for events that should be rejected in a
     given state.
   - Design sequence tests that exercise paths through the state
     machine (not just individual transitions).
   - Identify the minimum set of sequences that achieves full
     transition coverage.

3. **For message format tests**:
   - Design tests for each field with valid values (including boundary
     values).
   - Design tests with invalid values: wrong type, wrong size, out of
     range, malformed encoding, truncated.
   - Design tests for optional fields: present, absent, present with
     invalid value.
   - Design tests for field interactions: length field does not match
     actual length, type field does not match value format.

4. **For error handling tests**:
   - Design injection methods for each error condition: how to provoke
     the error (malformed input, timeout, out-of-order message,
     resource exhaustion).
   - Design verification methods: how to confirm the error was
     detected, the correct response was sent, and recovery occurred.

5. **For interoperability tests**:
   - Design scenarios with mixed implementations: old/new versions,
     different optional feature sets, different SHOULD/MAY choices.
   - Define success criteria: what constitutes successful
     interoperation for each scenario.

6. **Assign test IDs** using the format defined in the
   protocol-validation-spec format: SM- (state machine), MF- (message
   format), EH- (error handling), NC- (negotiation), IO-
   (interoperability), BC- (boundary condition).

## Phase 4: Validation Oracle Design

Define how a validation tool determines pass/fail.

1. **State machine oracle**: Define a reference state machine model
   that the tool can execute in parallel with the implementation under
   test. After each input/output, compare the implementation's observed
   state transition with the reference model's expected transition.

2. **Message oracle**: Define message validation rules that the tool
   applies to every message sent and received:
   - Field-level validation (type, size, encoding, value range).
   - Structural validation (field order, alignment, total length).
   - Semantic validation (field values consistent with current state,
     field values consistent with each other).

3. **Error oracle**: Define how the tool verifies error handling:
   - Expected error response for each injected error condition.
   - Expected state after error recovery.
   - Timeout-based detection for errors that should cause
     connection/session termination.

4. **Coverage oracle**: Define how the tool measures test coverage:
   - State machine coverage: which transitions were exercised.
   - Message format coverage: which fields and value ranges were
     tested.
   - Error coverage: which error conditions were triggered.
   - Requirement coverage: which requirements have at least one
     passing test.

5. **Output specification**: Define the tool's output format:
   - Per-test results (pass/fail/skip with reason).
   - Coverage summary with gap identification.
   - Trace log for debugging failures.
   - Requirement traceability (which tests cover which requirements).

## Phase 5: Coverage Analysis and Gap Identification

Verify the validation specification is complete.

1. **Requirements coverage**: Map every requirement to at least one
   test case. Identify requirements with no coverage and explain why
   (untestable, requires manual verification, requires specific
   hardware, etc.).

2. **State machine coverage**: Verify the test suite exercises every
   transition in the state × event matrix. Identify untested
   transitions.

3. **Negative test coverage**: Verify that every MUST NOT requirement
   has a negative test that verifies the prohibited behavior does NOT
   occur. Verify that every defined error condition has an injection
   test.

4. **SHOULD/MAY coverage**: Verify that SHOULD and MAY requirements
   have tests for both the recommended behavior and the alternative
   (since both are valid).

5. **Produce the coverage summary** table as defined in the
   protocol-validation-spec format. Flag gaps and classify them:
   - **Testable gap**: A test could be written but was not (the
     validation spec is incomplete).
   - **Tooling gap**: A test requires capabilities the validation tool
     does not have (note what capabilities are needed).
   - **Environmental gap**: A test requires specific network conditions
     or hardware (note the requirements).
   - **Specification gap**: The protocol spec is insufficiently precise
     to define a test (note what clarification is needed — feed back
     to `evolve-protocol`).
