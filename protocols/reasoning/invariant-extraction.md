<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: invariant-extraction
type: reasoning
description: >
  Systematic protocol for extracting structured invariants (constraints,
  state machines, timing assumptions, ordering rules, error conditions)
  from specifications or source code. Produces a filtered, dense subset
  of what a full requirements extraction would produce.
applicable_to:
  - extract-invariants
---

# Protocol: Invariant Extraction

Apply this protocol when extracting the **constraints, state machines,
and invariants** from a specification or codebase. This is a focused
extraction — it produces only the dense, formal guarantees, not a
comprehensive requirements document. The output is a filtered subset of
what `reverse-engineer-requirements` or `extract-rfc-requirements`
would produce, restricted to enforceable constraints.

## Phase 1: Source Classification

Determine the type of source material and adapt the extraction approach.

1. **If the source is a specification** (RFC, requirements doc, design
   doc, protocol spec):
   - Scan for RFC 2119 keywords (MUST, SHOULD, MAY and their negations)
   - Identify sections that define behavior, constraints, or rules
   - Distinguish normative sections from informational/rationale

2. **If the source is code**:
   - Identify assertions, preconditions, postconditions, and invariant
     checks
   - Identify error handling that enforces constraints (validation,
     rejection, bounds checking)
   - Identify state machine patterns (enums, match/switch on state,
     transition functions)
   - Distinguish essential constraints (what the code guarantees) from
     implementation details (how it happens to work)

3. **Record the source type** — this affects how evidence is cited
   (section references for specs, file/function/line for code).

## Phase 2: Constraint Extraction

Extract every enforceable constraint from the source.

1. **Value constraints**: Bounds, ranges, valid values, sizes
   - "MUST be at most 1500 bytes"
   - "Timeout MUST NOT exceed 30 seconds"
   - "Field is a 16-bit unsigned integer"

2. **Behavioral constraints**: Required or prohibited behaviors
   - "MUST reject invalid input with error code 400"
   - "MUST NOT store passwords in plaintext"
   - "Sender MUST retransmit if no ACK within 3 seconds"

3. **Ordering constraints**: Sequencing requirements
   - "MUST complete handshake before sending data"
   - "Close MUST NOT be sent before all pending data is acknowledged"
   - "Initialization MUST precede any API call"

4. **Timing constraints**: Deadlines, timeouts, rates
   - "MUST respond within 200ms"
   - "Keepalive MUST be sent every 30 seconds"
   - "Connection MUST be dropped after 60 seconds of inactivity"

5. **Resource constraints**: Limits, quotas, capacities
   - "MUST support at least 1000 concurrent connections"
   - "Memory usage MUST NOT exceed 64MB"
   - "Queue depth is bounded at 256 entries"

For each constraint, record:
- The constraint text
- The source location (section or file:function:line)
- The keyword strength: always express as MUST/SHOULD/MAY in the
  requirement text. For code sources, annotate enforcement status
  (e.g., "MUST [enforced via assertion]" or "SHOULD [assumed]")

## Phase 3: State Machine Extraction

If the source defines state-driven behavior (explicitly or implicitly):

1. **Enumerate states**: List every distinct state with its meaning
   and how it is represented (enum value, variable, flag combination).

2. **Enumerate transitions**: For each state, list:
   - Triggering event or condition
   - Guard conditions (when does this transition apply?)
   - Actions performed during the transition
   - Target state
   - Source location (where this transition is defined)

3. **Build a state transition table**:

   | Current State | Event | Guard | Action | Next State | Source |
   |---------------|-------|-------|--------|------------|--------|

4. **Check completeness**:
   - Are there states with no exit transitions (terminal states)?
     If so, are they intentional?
   - Are there events not handled in some states? What is the
     implicit behavior (ignore? error? crash?)?
   - Are there unreachable states?

5. **Extract state invariants**: Properties that must hold in each
   state (e.g., "in ESTABLISHED state, both endpoints have exchanged
   SYN/ACK").

## Phase 4: Error Condition Extraction

Extract every specified or implemented error condition.

1. **For each error condition**, record:
   - What triggers it (invalid input, timeout, resource exhaustion)
   - What the response is (error code, exception, rejection, reset)
   - Whether recovery is possible and how
   - The source location

2. **Classify error conditions**:
   - **Validation errors**: Bad input rejected at a boundary
   - **State errors**: Operation attempted in wrong state
   - **Resource errors**: Exhaustion, timeout, limit reached
   - **Protocol errors**: Peer sent invalid message

## Phase 5: Invariant Structuring

Transform extracted invariants into structured requirements.

1. **Assign REQ-IDs**: Use the scheme provided by the user, or
   default to `REQ-INV-<CAT>-<NNN>` where `<CAT>` categorizes the
   invariant (CONSTRAINT, STATE, TIMING, ERROR, RESOURCE).

2. **For each invariant**, produce:
   - REQ-ID and constraint text
   - Keyword strength (MUST/SHOULD/MAY in requirement text; for code
     sources, annotate enforcement status separately)
   - Source location
   - Acceptance criterion — how to verify this invariant holds
   - Category (value, behavioral, ordering, timing, resource, state,
     error)

3. **Produce a state machine appendix** (if state machines were
   extracted): Include the full state transition table and state
   invariants as an appendix after the main requirements sections.
   Reference state-related REQ-IDs from the appendix.

## Phase 6: Coverage and Completeness Check

1. **Verify extraction coverage**: Every normative section (for specs)
   or every public function with assertions/validation (for code)
   should have at least one extracted invariant. Flag sections or
   functions with zero invariants.

2. **Flag ambiguities**: Constraints that are implied but not
   explicitly stated. Mark as `[INFERRED]` with reasoning.

3. **Produce a summary**:
   - Total invariants extracted, by category
   - State machines extracted (count of states, transitions)
   - Error conditions cataloged
   - Coverage: % of source sections/functions with extracted invariants
   - Ambiguities flagged for human review
