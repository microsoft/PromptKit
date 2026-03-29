<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: interface-contract-audit
type: reasoning
description: >
  Systematic audit of an interface contract for completeness, internal
  consistency, and alignment with governing specifications. Verifies
  provider guarantees, consumer obligations, invariant coverage, and
  failure mode completeness.
applicable_to:
  - audit-interface-contract
---

# Protocol: Interface Contract Audit

Apply this protocol when auditing an interface contract document for
internal quality. Execute all phases in order. This protocol audits a
*single contract* — for cross-contract integration audits, use
`integration-audit` after running this protocol on each contract.

## Phase 1: Contract Ingestion

Parse the contract into analyzable structures.

1. **Parse contract metadata** — identify provider, consumer(s),
   boundary type, governing specs, and validity conditions.

2. **Enumerate operating states** — build the state list from
   Section 3. Record each state's entry/exit conditions. Build the
   state transition table.

3. **Enumerate resources** — build the resource inventory from
   Section 4. Record each resource's category, direction, and group.

4. **Extract guarantee matrix** — from Section 5, build a
   (resource × state) matrix of provider guarantees.

5. **Extract obligation matrix** — from Section 6, build a
   (resource × state) matrix of consumer obligations.

6. **Extract invariants** — from Section 7, formalize each as a
   testable predicate with its scope and linked resources.

7. **Extract failure modes** — from Section 8, record triggers,
   affected resources, severity, and recovery.

## Phase 2: Completeness Audit

Check that the contract covers every combination of resource and state.

1. **Matrix cell coverage**: For every (resource × state) cell in
   both the guarantee and obligation matrices:
   - Cell has an explicit value → OK
   - Cell is blank → finding: `INCOMPLETE_MATRIX_CELL`
   - Cell is vague prose without a numeric bound or checkable
     predicate → finding: `VAGUE_GUARANTEE` (guarantee matrix) or
     `VAGUE_OBLIGATION` (obligation matrix)

2. **Resource coverage**: Does every resource from the inventory
   (Section 4) appear in both the guarantee matrix (Section 5) AND
   the obligation matrix (Section 6)?
   - Missing from guarantees → finding: `UNCONTRACTED_RESOURCE`
     (provider side)
   - Missing from obligations → finding: `UNCONTRACTED_RESOURCE`
     (consumer side)

3. **State coverage**: Does every operating state (Section 3) appear
   as a column in both matrices?
   - Missing → finding: `UNCONTRACTED_STATE`

4. **Invariant linkage**: Does every invariant (Section 7) reference
   at least one resource and one guarantee or obligation?
   - Floating invariant → finding: `UNLINKED_INVARIANT`

5. **Definition coverage**: Are all domain-specific terms used in
   guarantee/obligation cells defined in Section 2?

## Phase 3: Provider Guarantee Verification

For each guarantee in the matrix:

1. **Trace to governing specification** — does the claimed guarantee
   appear in the source spec (datasheet, requirements doc, API spec)?
   - Untraced → finding: `UNTRACED_GUARANTEE`

2. **Check consistency across states** — do guarantee values across
   states form a coherent set? For example:
   - A power rail cannot have a higher current budget in deep sleep
     than in active mode without justification
   - A service cannot promise lower latency under high load than
     under low load without explanation
   - Flag inconsistencies as findings with rationale

3. **Check boundary conditions** — what happens at the exact boundary
   of the guarantee (voltage at minimum, endpoint at rate limit)?
   Is the behavior specified?

4. **Check achievability** — does the governing specification
   (datasheet, design doc) actually support the claimed value?
   - Over-promise → finding: `UNSUBSTANTIATED_GUARANTEE`

## Phase 4: Consumer Obligation Verification

For each obligation in the matrix:

1. **Check enforceability** — can the provider detect if the consumer
   violates this obligation? Is there a monitoring, assertion, or
   interlock mechanism?
   - Unenforceable → finding: `UNENFORCEABLE_OBLIGATION`

2. **Check consistency with guarantees** — does any obligation
   conflict with a guarantee? For example:
   - Consumer required to keep draw under 10 mA, but provider only
     monitors in 50 mA increments
   - Consumer must call within 100ms, but provider's guaranteed
     response time is 200ms
   - Flag conflicts: `OBLIGATION_GUARANTEE_CONFLICT`

3. **Check forbidden combination completeness** — for every pair of
   resources that could interact, are mutual exclusion or sequencing
   obligations defined where needed?

4. **Check obligation awareness** — if the consumer's specification
   is available, does it acknowledge each obligation?
   - Unacknowledged → finding: `UNACKNOWLEDGED_OBLIGATION`

## Phase 5: Invariant Consistency

For each invariant in Section 7:

1. **Attempt violation construction** — apply the adversarial
   violation-construction technique from `spec-invariant-audit`
   Phase 3: can a compliant provider + compliant consumer still
   violate this invariant? If yes, the contract has a gap.
   - Violation possible → finding: `INVARIANT_VIOLATION_POSSIBLE`

2. **Check invariant independence** — do any two invariants
   contradict each other? For example:
   - INV-001 requires rail A off in sleep
   - INV-002 requires pull-up to rail A in sleep
   - Flag contradictions

3. **Check failure-mode coverage** — does every invariant have at
   least one failure mode (Section 8) that describes what happens
   when it is violated?
   - Missing → finding: `INVARIANT_WITHOUT_FAILURE_MODE`

## Phase 6: Failure Mode Completeness

1. **Trigger coverage** — is there a failure mode for every guarantee
   that could be violated and every obligation that could be breached?
   - Missing → finding: `UNHANDLED_VIOLATION`

2. **Recovery specification** — does every failure mode with severity
   Medium or higher specify a recovery action?
   - "Unspecified" recovery at Medium+ severity → finding:
     `UNSPECIFIED_RECOVERY`

3. **Cascade analysis** — do failure modes with cascading effects
   reference valid failure mode IDs? Can a cascade lead to a state
   not in the operating states table?

## Phase 7: Findings and Coverage Report

1. **Classify each finding** using the contract-audit labels:

   | Label | Description |
   |-------|-------------|
   | INCOMPLETE_MATRIX_CELL | Resource × state cell has no value |
   | VAGUE_GUARANTEE | Guarantee is prose-only, not checkable |
   | VAGUE_OBLIGATION | Obligation is prose-only, not checkable |
   | UNCONTRACTED_RESOURCE | Resource crosses boundary but has no contract entry |
   | UNCONTRACTED_STATE | Operating state has no guarantee/obligation column |
   | UNLINKED_INVARIANT | Invariant references no contract matrix entry |
   | UNTRACED_GUARANTEE | Guarantee not traceable to governing spec |
   | UNSUBSTANTIATED_GUARANTEE | Guarantee exceeds what governing spec supports |
   | UNENFORCEABLE_OBLIGATION | Obligation cannot be detected if breached |
   | OBLIGATION_GUARANTEE_CONFLICT | Obligation and guarantee are mutually inconsistent |
   | UNACKNOWLEDGED_OBLIGATION | Consumer spec does not mention this obligation |
   | INVARIANT_VIOLATION_POSSIBLE | Compliant parties can still violate invariant |
   | INVARIANT_WITHOUT_FAILURE_MODE | No failure mode covers this invariant's violation |
   | UNHANDLED_VIOLATION | Guarantee/obligation breach has no failure mode |
   | UNSPECIFIED_RECOVERY | Failure mode at Medium+ severity has no recovery action |

2. **Produce a coverage summary**:
   - Resources audited / total
   - States audited / total
   - Matrix cells checked / total
   - Invariants tested / total
   - Failure modes reviewed / total
   - Overall contract health assessment
