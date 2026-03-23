<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: specification-drift
type: taxonomy
description: >
  Classification scheme for specification drift and divergence across
  requirements, design, and validation artifacts. Use when auditing
  document sets for traceability gaps, scope creep, assumption drift,
  and coverage failures.
domain: specification-traceability
applicable_to:
  - audit-traceability
  - audit-code-compliance
  - audit-test-compliance
  - audit-integration-compliance
---

# Taxonomy: Specification Drift

Use these labels to classify findings when auditing requirements, design,
and validation documents for consistency and completeness. Every finding
MUST use exactly one label from this taxonomy.

## Labels

### D1_UNTRACED_REQUIREMENT

A requirement exists in the requirements document but is not referenced
or addressed in the design document.

**Pattern**: REQ-ID appears in the requirements document. No section of
the design document references this REQ-ID or addresses its specified
behavior.

**Risk**: The requirement may be silently dropped during implementation.
Without a design realization, there is no plan to deliver this capability.

**Severity guidance**: High when the requirement is functional or
safety-critical. Medium when it is a non-functional or low-priority
constraint.

### D2_UNTESTED_REQUIREMENT

A requirement exists in the requirements document but has no
corresponding test case in the validation plan.

**Pattern**: REQ-ID appears in the requirements document and may appear
in the traceability matrix, but no test case (TC-NNN) is linked to it —
or the traceability matrix entry is missing entirely.

**Risk**: The requirement will not be verified. Defects against this
requirement will not be caught by the validation process.

**Severity guidance**: Critical when the requirement is safety-critical
or security-related. High for functional requirements. Medium for
non-functional requirements with measurable criteria.

### D3_ORPHANED_DESIGN_DECISION

A design section, component, or decision does not trace back to any
requirement in the requirements document.

**Pattern**: A design section describes a component, interface, or
architectural decision. No REQ-ID from the requirements document is
referenced or addressed by this section.

**Risk**: Scope creep — the design introduces capabilities or complexity
not justified by the requirements. Alternatively, the requirements
document is incomplete and the design is addressing an unstated need.

**Severity guidance**: Medium. Requires human judgment — the finding may
indicate scope creep (remove from design) or a requirements gap (add a
requirement).

### D4_ORPHANED_TEST_CASE

A test case in the validation plan does not map to any requirement in
the requirements document.

**Pattern**: TC-NNN exists in the validation plan but references no
REQ-ID, or references a REQ-ID that does not exist in the requirements
document.

**Risk**: Test effort is spent on behavior that is not required.
Alternatively, the requirements document is incomplete and the test
covers an unstated need.

**Severity guidance**: Low to Medium. The test may still be valuable
(e.g., regression or exploratory), but it is not contributing to
requirements coverage.

### D5_ASSUMPTION_DRIFT

An assumption stated or implied in one document contradicts, extends,
or is absent from another document.

**Pattern**: The design document states an assumption (e.g., "the system
will have at most 1000 concurrent users") that is not present in the
requirements document's assumptions section — or contradicts a stated
constraint. Similarly, the validation plan may assume environmental
conditions not specified in requirements.

**Risk**: Documents are based on incompatible premises. Implementation
may satisfy the design's assumptions while violating the requirements'
constraints, or vice versa.

**Severity guidance**: High when the assumption affects architectural
decisions or test validity. Medium when it affects non-critical behavior.

### D6_CONSTRAINT_VIOLATION

A design decision directly violates a stated requirement or constraint.

**Pattern**: The requirements document states a constraint (e.g.,
"the system MUST respond within 200ms") and the design document
describes an approach that cannot satisfy it (e.g., a synchronous
multi-service call chain with no caching), or explicitly contradicts
it (e.g., "response times up to 2 seconds are acceptable").

**Risk**: The implementation will not meet requirements by design.
This is not a gap but an active conflict.

**Severity guidance**: Critical when the violated constraint is
safety-critical, regulatory, or a hard performance requirement. High
for functional constraints.

### D7_ACCEPTANCE_CRITERIA_MISMATCH

A test case is linked to a requirement but does not actually verify the
requirement's acceptance criteria.

**Pattern**: TC-NNN is mapped to REQ-XXX-NNN in the traceability matrix,
but the test case's steps, inputs, or expected results do not correspond
to the acceptance criteria defined for that requirement. The test may
verify related but different behavior, or may be too coarse to confirm
the specific criterion.

**Risk**: The traceability matrix shows coverage, but the coverage is
illusory. The requirement appears tested but its actual acceptance
criteria are not verified.

**Severity guidance**: High. This is more dangerous than D2 (untested
requirement) because it creates a false sense of coverage.

## Code Compliance Labels

### D8_UNIMPLEMENTED_REQUIREMENT

A requirement exists in the requirements document but has no
corresponding implementation in the source code.

**Pattern**: REQ-ID specifies a behavior, constraint, or capability.
No function, module, class, or code path in the source implements
or enforces this requirement.

**Risk**: The requirement was specified but never built. The system
does not deliver this capability despite it being in the spec.

**Severity guidance**: Critical when the requirement is safety-critical
or security-related. High for functional requirements. Medium for
non-functional requirements that affect quality attributes.

### D9_UNDOCUMENTED_BEHAVIOR

The source code implements behavior that is not specified in any
requirement or design document.

**Pattern**: A function, module, or code path implements meaningful
behavior (not just infrastructure like logging or error handling)
that does not trace to any REQ-ID in the requirements document or
any section in the design document.

**Risk**: Scope creep in implementation — the code does more than
was specified. The undocumented behavior may be intentional (a missing
requirement) or accidental (a developer's assumption). Either way,
it is untested against any specification.

**Severity guidance**: Medium when the behavior is benign feature
logic. High when the behavior involves security, access control,
data mutation, or external communication — undocumented behavior
in these areas is a security concern.

### D10_CONSTRAINT_VIOLATION_IN_CODE

The source code violates a constraint stated in the requirements or
design document.

**Pattern**: The requirements document states a constraint (e.g.,
"MUST respond within 200ms", "MUST NOT store passwords in plaintext",
"MUST use TLS 1.3 or later") and the source code demonstrably violates
it — through algorithmic choice, missing implementation, or explicit
contradiction.

**Risk**: The implementation will not meet requirements. Unlike D6
(constraint violation in design), this is a concrete defect in code,
not a planning gap.

**Severity guidance**: Critical when the violated constraint is
safety-critical, security-related, or regulatory. High for performance
or functional constraints. Assess based on the constraint itself,
not the code's complexity.

## Test Compliance Labels

### D11_UNIMPLEMENTED_TEST_CASE

A test case is defined in the validation plan but has no corresponding
automated test in the test code.

**Pattern**: TC-NNN is specified in the validation plan with steps,
inputs, and expected results. No test function, test class, or test
file in the test code implements this test case — either by name
reference, by TC-NNN identifier, or by behavioral equivalence.

**Risk**: The validation plan claims coverage that does not exist in
the automated test suite. The requirement linked to this test case
is effectively untested in CI, even though the validation plan says
it is covered.

**Severity guidance**: High when the linked requirement is
safety-critical or security-related. Medium for functional
requirements. Note: test cases classified as manual-only or deferred
in the validation plan are excluded from D11 findings and reported
only in the coverage summary.

### D12_UNTESTED_ACCEPTANCE_CRITERION

A test implementation exists for a test case, but it does not assert
one or more acceptance criteria specified for the linked requirement.

**Pattern**: TC-NNN is implemented as an automated test. The linked
requirement (REQ-XXX-NNN) has multiple acceptance criteria. The test
implementation asserts some criteria but omits others — for example,
it checks the happy-path output but does not verify error handling,
boundary conditions, or timing constraints specified in the acceptance
criteria.

**Risk**: The test passes but does not verify the full requirement.
Defects in the untested acceptance criteria will not be caught by CI.
This is the test-code equivalent of D7 (acceptance criteria mismatch
in the validation plan) but at the implementation level.

**Severity guidance**: High when the missing criterion is a security
or safety property. Medium for functional criteria. Assess based on
what the missing criterion protects, not on the test's overall
coverage.

### D13_ASSERTION_MISMATCH

A test implementation exists for a test case, but its assertions do
not match the expected behavior specified in the validation plan.

**Pattern**: TC-NNN is implemented as an automated test. The test
asserts different conditions, thresholds, or outcomes than what the
validation plan specifies — for example, the plan says "verify
response within 200ms" but the test asserts "response is not null",
or the plan says "verify error code 403" but the test asserts "status
is not 200".

**Risk**: The test passes but does not verify what the validation plan
says it should. This creates illusory coverage — the traceability
matrix shows the requirement as tested, but the actual test checks
something different. More dangerous than D11 (missing test) because
it is invisible without comparing test code to the validation plan.

**Severity guidance**: High. This is the most dangerous test
compliance drift type because it creates false confidence. Severity
should be assessed based on the gap between what is asserted and what
should be asserted.

## Integration Compliance Labels

### D14_UNSPECIFIED_INTEGRATION_FLOW

A cross-component integration flow is described in the integration
specification but is not reflected in one or more component specs.

**Pattern**: The integration spec describes an end-to-end flow that
traverses components A → B → C. Component B's specification does not
mention its role in this flow, does not describe receiving input from
A, or does not describe producing output for C. The flow exists at
the system level but has a gap at the component level.

**Risk**: The flow may be implemented by convention or tribal knowledge
but is not contractually specified. Changes to component B may break
the flow without any specification-level signal. Per-component audits
will not detect this because no component's spec claims responsibility
for the missing step.

**Severity guidance**: High when the flow is safety-critical, involves
data integrity, or is a core user-facing workflow. Medium for
operational or diagnostic flows. Assess based on what breaks if the
gap causes a runtime failure.

### D15_INTERFACE_CONTRACT_MISMATCH

Two components describe the same interface differently in their
respective specifications.

**Pattern**: Component A's spec says it produces output in format X
with error codes {E1, E2}. Component B's spec says it consumes input
in format Y with error codes {E2, E3}. The interface exists on both
sides but the descriptions are incompatible — different data formats,
different error sets, different sequencing assumptions, or different
timing constraints.

**Risk**: Runtime failures at the integration boundary — data
corruption, unhandled errors, deadlocks, or silent degradation.
Per-component audits see each side as internally consistent; the
mismatch is only visible when comparing both sides.

**Severity guidance**: Critical when the mismatch involves data
integrity, security properties, or will cause deterministic runtime
failure. High when it involves error handling or sequencing that may
cause intermittent failures. Medium for cosmetic or logging
differences that do not affect correctness.

### D16_UNTESTED_INTEGRATION_PATH

A cross-component integration flow or interface contract is specified
but has no corresponding integration or end-to-end test.

**Pattern**: The integration spec describes flow F-NNN traversing
components A → B → C. No integration test exercises this flow
end-to-end. Individual component tests may test A's output and B's
input separately, but no test verifies the handoff between them under
realistic conditions.

**Risk**: Defects at integration boundaries will not be caught until
production. Per-component test-compliance audits will show full
coverage within each component, masking the integration gap. This is
the integration-level equivalent of D11 (unimplemented test case).

**Severity guidance**: High when the flow is safety-critical or
involves data that crosses trust boundaries. Medium for well-understood
interfaces with stable contracts. Note: flows explicitly marked as
"manual integration test" or "deferred" in the integration spec are
excluded from D16 findings and reported only in the coverage summary.

## Ranking Criteria

Within a given severity level, order findings by impact on specification
integrity:

1. **Highest risk**: D6 (constraint violation in design), D7 (illusory
   test coverage), D10 (constraint violation in code), D13
   (assertion mismatch), and D15 (interface contract mismatch) —
   these indicate active conflicts between artifacts.
2. **High risk**: D2 (untested requirement), D5 (assumption drift),
   D8 (unimplemented requirement), D12 (untested acceptance
   criterion), and D14 (unspecified integration flow) — these
   indicate silent gaps that will surface late.
3. **Medium risk**: D1 (untraced requirement), D3 (orphaned design),
   D9 (undocumented behavior), D11 (unimplemented test case), and
   D16 (untested integration path) — these indicate incomplete
   traceability that needs human resolution.
4. **Lowest risk**: D4 (orphaned test case) — effort misdirection but
   no safety or correctness impact.

## Usage

In findings, reference labels as:

```
[DRIFT: D2_UNTESTED_REQUIREMENT]
Requirement: REQ-SEC-003 (requirements doc, section 4.2)
Evidence: REQ-SEC-003 does not appear in the traceability matrix
  (validation plan, section 4). No test case references this REQ-ID.
Impact: The encryption-at-rest requirement will not be verified.
```
