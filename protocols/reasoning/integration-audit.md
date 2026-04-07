<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: integration-audit
type: reasoning
description: >
  Systematic protocol for auditing cross-component integration points.
  Maps integration flows across component boundaries, verifies interface
  contracts, and checks integration test coverage. Classifies findings
  using the specification-drift taxonomy (D14–D16).
applicable_to:
  - audit-integration-compliance
---

# Protocol: Integration Audit

Apply this protocol when auditing cross-component integration points
against an integration specification and per-component specs. The goal
is to find every gap in how components interact — unspecified flows,
mismatched interface contracts, and untested integration paths.

Per-component audits (traceability, code-compliance, test-compliance)
verify that each component's artifacts are internally consistent. This
protocol addresses the gaps that are invisible to those audits: the
seams between components.

## Phase 1: Integration Specification Inventory

Extract the integration-level claims from the integration specification.

1. **Integration flows** — for each end-to-end flow, extract:
   - The flow ID and description (e.g., "BLE onboarding: pairing tool →
     gateway → modem → cloud registration")
   - The ordered sequence of components involved
   - The handoff points between components (data, control, events)
   - The end-to-end preconditions and postconditions
   - Success criteria and failure/rollback behavior

2. **Interface contracts** — for each component boundary, extract:
   - The interface ID (API, protocol, event, shared resource)
   - The producing component and consuming component
   - Data formats, schemas, and message types exchanged
   - Error handling expectations (who detects, who recovers)
   - Sequencing and timing constraints
   - Version compatibility requirements

3. **Integration test expectations** — extract:
   - Any integration or E2E test cases referenced in the spec
   - Coverage expectations (which flows are tested, which are
     explicitly deferred)
   - Environment or infrastructure assumptions for integration testing

## Phase 2: Component Specification Inventory

Survey each component's specification to understand its view of the
integration boundary.

1. **For each component**, extract:
   - The external interfaces it declares (APIs it exposes, events it
     emits, protocols it speaks)
   - The dependencies it declares (APIs it calls, events it consumes,
     services it requires)
   - Assumptions about the behavior of other components
   - Error handling at component boundaries (what errors it propagates
     vs. handles internally)

2. **Build a component interaction matrix**: a table with components
   as rows and columns. Each cell records the declared interface
   between the pair (from each side's perspective). Blank cells
   indicate components with no declared interaction.

Do NOT assume that two components interact just because the integration
spec describes a flow involving both. Check each component's own spec
for evidence that it knows about the interaction.

## Phase 3: Flow Traceability (Integration Spec → Component Specs)

For each integration flow in the integration specification:

1. **Trace through each component** in the flow's sequence:
   - Does the component's spec acknowledge its role in this flow?
   - Does the component's spec describe the required inputs it
     receives from the upstream component?
   - Does the component's spec describe the outputs it produces for
     the downstream component?
   - Are the preconditions at each handoff compatible with the
     postconditions of the previous step?

2. **Check end-to-end coherence**:
   - Do the component-level specs, taken together, cover the full flow
     from start to finish?
   - Are there gaps in the sequence where no component claims
     responsibility for a step?
   - Are there error handling gaps — a failure mode described at one
     boundary but not handled by the receiving component?

3. **Classify the result**:
   - **FULLY TRACED**: Every step in the flow traces to specific
     requirements in component specs.
   - **PARTIALLY TRACED**: Some steps trace, others do not. Flag
     gaps as D14_UNSPECIFIED_INTEGRATION_FLOW with evidence of what
     is missing.
   - **NOT TRACED**: The flow appears in the integration spec but is
     absent from component specs. Flag as D14 with confidence High.

## Phase 4: Interface Contract Verification

For each interface between components:

1. **Compare both sides' descriptions** of the interface:
   - Data formats: Does the producer's output schema match the
     consumer's expected input schema?
   - Error codes and error handling: Does the consumer handle the
     errors the producer can emit? Does the consumer expect errors
     the producer never emits?
   - Sequencing: Do both sides agree on message ordering, handshake
     sequences, and state machine transitions?
   - Timing: Are timeout values, retry policies, and rate limits
     compatible?

2. **Check against the integration spec**:
   - Does the integration spec's description of the interface match
     what both component specs describe?
   - Are there constraints in the integration spec that neither
     component spec mentions?

3. **Flag mismatches** as D15_INTERFACE_CONTRACT_MISMATCH with:
   - Both sides' descriptions (quoted from their respective specs)
   - The specific incompatibility
   - Impact assessment (will the mismatch cause runtime failure,
     data corruption, silent degradation, or is it cosmetic?)

## Phase 5: Integration Test Coverage

For each integration flow and interface contract:

1. **Search for integration/E2E tests** that exercise the flow:
   - Look for tests that involve multiple components
   - Look for tests that verify handoff behavior at boundaries
   - Look for tests that exercise error/rollback paths across
     boundaries

2. **Assess test coverage**:
   - Does the test exercise the full flow end-to-end, or only
     a subset of the steps?
   - Does the test verify the interface contract (data formats,
     error handling, sequencing), or only the happy path?
   - Are failure modes tested — what happens when a component in the
     middle of the flow fails?

3. **Flag gaps** as D16_UNTESTED_INTEGRATION_PATH with:
   - The flow or interface that lacks test coverage
   - What specifically is untested (full flow, error path, specific
     handoff)
   - The linked integration spec section and component specs

If no integration test code is provided, skip Phase 5 and note in
the coverage summary: "Integration test coverage analysis skipped —
no test code provided. All flows are D16 candidates with confidence
Low pending test code review."

## Phase 6: Classification and Reporting

Classify every finding using the specification-drift taxonomy.

1. Assign exactly one drift label (D14, D15, or D16) to each finding.
2. Assign severity using the taxonomy's severity guidance.
3. For each finding, provide:
   - The drift label and short title
   - The integration spec location and relevant component spec
     locations
   - Evidence: what the integration spec says, what each component
     spec says (or doesn't)
   - Impact: what could go wrong at runtime
   - Recommended resolution (which spec or test needs updating)
4. Order findings primarily by severity, then by taxonomy ranking
   within each severity tier.

## Phase 7: Coverage Summary

After reporting individual findings, produce aggregate metrics:

1. **Flow traceability rate**: integration flows fully traced to
   component specs / total integration flows.
2. **Interface contract alignment**: interfaces with matching
   descriptions on both sides / total interfaces.
3. **Integration test coverage**: flows with at least one integration
   test / total flows. Also report: flows with error path coverage /
   total flows.
4. **Cross-component gap count**: total handoff points where no
   component claims responsibility.
5. **Overall assessment**: a summary judgment of integration
   specification health (e.g., "High alignment — 2 interface
   mismatches" or "Low alignment — systemic gaps in flow
   traceability").
