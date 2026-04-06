<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: code-compliance-audit
type: reasoning
description: >
  Systematic protocol for auditing source code against requirements and
  design documents. Maps specification claims to code behavior, detects
  unimplemented requirements, undocumented behavior, and constraint
  violations. Classifies findings using the specification-drift taxonomy
  (D8–D10).
applicable_to:
  - audit-code-compliance
---

# Protocol: Code Compliance Audit

Apply this protocol when auditing source code against requirements and
design documents to determine whether the implementation matches the
specification. The goal is to find every gap between what was specified
and what was built — in both directions.

## Phase 1: Specification Inventory

Extract the audit targets from the specification documents.

1. **Requirements document** — extract:
   - Every REQ-ID with its summary, acceptance criteria, and category
   - Every constraint (performance, security, behavioral)
   - Every assumption that affects implementation
   - Defined terms and their precise meanings

2. **Design document** (if provided) — extract:
   - Components, modules, and interfaces described
   - API contracts (signatures, pre/postconditions, error handling)
   - Data models and state management approach
   - Non-functional strategies (caching, pooling, concurrency model)
   - Explicit mapping of design elements to REQ-IDs

3. **Build a requirements checklist**: a flat list of every testable
   claim from the specification that can be verified against code.
   Each entry has: REQ-ID, the specific behavior or constraint, and
   what evidence in code would confirm implementation.

## Phase 2: Code Inventory

Survey the source code to understand its structure before tracing.

1. **Module/component map**: Identify the major code modules, classes,
   or packages and their responsibilities.
2. **API surface**: Catalog public functions, endpoints, interfaces —
   the externally visible behavior.
3. **Configuration and feature flags**: Identify behavior that is
   conditionally enabled or parameterized.
4. **Error handling paths**: Catalog how errors are handled — these
   often implement (or fail to implement) requirements around
   reliability and graceful degradation.

Do NOT attempt to understand every line of code. Focus on the
**behavioral surface** — what the code does, not how it does it
internally — unless the specification constrains the implementation
approach.

## Phase 3: Forward Traceability (Specification → Code)

For each requirement in the checklist:

1. **Search for implementation**: Identify the code module(s),
   function(s), or path(s) that implement this requirement.
   - Look for explicit references (comments citing REQ-IDs, function
     names matching requirement concepts).
   - Look for behavioral evidence (code that performs the specified
     action under the specified conditions).
   - Check configuration and feature flags that may gate the behavior.

2. **Assess implementation completeness**:
   - Does the code implement the **full** requirement, including edge
     cases described in acceptance criteria?
   - Does the code implement the requirement under all specified
     conditions, or only the common case?
   - Are constraints (performance, resource limits, timing) enforced?

3. **Classify the result**:
   - **IMPLEMENTED**: Code clearly implements the requirement. Record
     the code location(s) as evidence.
   - **PARTIALLY IMPLEMENTED**: Some aspects are present but acceptance
     criteria are not fully met. Flag as D8_UNIMPLEMENTED_REQUIREMENT
     with the finding describing what is present and what is missing.
     Set confidence to Medium.
   - **NOT IMPLEMENTED**: No code implements this requirement. Flag as
     D8_UNIMPLEMENTED_REQUIREMENT with confidence High.

## Phase 4: Backward Traceability (Code → Specification)

Identify code behavior that is not specified.

1. **For each significant code module or feature**: determine whether
   it traces to a requirement or design element.
   - "Significant" means it implements user-facing behavior, data
     processing, access control, external communication, or state
     changes. Infrastructure (logging, metrics, boilerplate) is not
     significant unless the specification constrains it.

2. **Flag undocumented behavior**:
   - Code that implements meaningful behavior with no tracing
     requirement is a candidate D9_UNDOCUMENTED_BEHAVIOR.
   - Distinguish between: (a) genuine scope creep, (b) reasonable
     infrastructure that supports requirements indirectly, and
     (c) requirements gaps (behavior that should have been specified).
     Report all three, but note the distinction.

## Phase 5: Constraint Verification

Check that specified constraints are respected in the implementation.

1. **For each constraint in the requirements**:
   - Identify the code path(s) responsible for satisfying it.
   - Assess whether the implementation approach **can** satisfy the
     constraint (algorithmic feasibility, not just correctness).
   - Check for explicit violations — code that demonstrably contradicts
     the constraint.

2. **Common constraint categories to check**:
   - Performance: response time limits, throughput requirements,
     resource consumption bounds
   - Security: encryption requirements, authentication enforcement,
     input validation, access control
   - Data integrity: validation rules, consistency guarantees,
     atomicity requirements
   - Compatibility: API versioning, backward compatibility,
     interoperability constraints

3. **Flag violations** as D10_CONSTRAINT_VIOLATION_IN_CODE with
   specific evidence (code location, the constraint, and how the
   code violates it).

## Phase 6: Classification and Reporting

Classify every finding using the specification-drift taxonomy
(see `taxonomies/specification-drift.md` for full definitions).

1. Assign exactly one drift label (D8, D9, or D10) to each finding.
2. Assign severity using the taxonomy's severity guidance.
3. For each finding, provide:
   - The drift label and short title
   - The spec location (REQ-ID, section) and code location (file,
     function, line range). For D9 findings, the spec location is
     "None — no matching requirement identified" with a description
     of what was searched.
   - Evidence: what the spec says and what the code does (or doesn't)
   - Impact: what could go wrong
   - Recommended resolution
4. Order findings primarily by severity, then by taxonomy ranking
   within each severity tier.

## Phase 7: Coverage Summary

After reporting individual findings, produce aggregate metrics:

1. **Implementation coverage**: % of REQ-IDs with confirmed
   implementations in code.
2. **Undocumented behavior rate**: count of significant code behaviors
   with no tracing requirement.
3. **Constraint compliance**: count of constraints verified vs.
   violated vs. unverifiable from code analysis alone.
4. **Overall assessment**: a summary judgment of code-to-spec alignment.
