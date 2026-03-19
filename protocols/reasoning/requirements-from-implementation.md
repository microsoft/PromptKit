<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: requirements-from-implementation
type: reasoning
description: >
  Systematic reasoning protocol for deriving structured requirements
  from existing source code. Transforms code understanding into
  testable, atomic requirements with acceptance criteria.
applicable_to:
  - reverse-engineer-requirements
  - review-code
---

# Protocol: Requirements from Implementation

Apply this protocol when deriving requirements from an existing codebase.
The goal is to produce a structured requirements document that captures
what the implementation provides — not how it provides it. Execute all
phases in order.

## Phase 1: API Surface Enumeration

Systematically catalog every public-facing element of the codebase:

1. **Functions and entry points**: Signatures, parameters, return types,
   error conditions. For each, note whether it is public API, internal,
   or a convenience wrapper.
2. **Types and data structures**: Structs, enums, unions, typedefs.
   Identify which are opaque (implementation detail) vs. transparent
   (part of the API contract).
3. **Metaprogramming and indirection constructs** (if applicable):
   Preprocessor macros (C/C++), decorators (Python), annotations (Java),
   attribute macros (Rust), code generation. Expand representative
   invocations to understand the actual behavior. Document parameters,
   their types, and constraints.
4. **Constants and configuration surfaces**: Compile-time switches,
   feature flags, tuning parameters. Identify which are user-facing
   configuration vs. internal implementation constants.
5. **Error handling patterns**: How does the API report errors? Return
   codes, errno, out-parameters, callbacks, exceptions? Catalog the
   error space.

Produce a structured enumeration (table or list) before proceeding.
This becomes the completeness checklist for later phases.

## Phase 2: Behavioral Contract Extraction

For each API element identified in Phase 1:

1. **Preconditions**: What must be true before the caller invokes this?
   Look for parameter validation, assertions, documented constraints,
   and implicit assumptions (e.g., "pointer must not be NULL" even if
   unchecked).
2. **Postconditions**: What is guaranteed after successful execution?
   What state changes occur? What values are returned?
3. **Error behavior**: What happens on invalid input, resource exhaustion,
   or concurrent access? Is the API fail-safe, fail-fast, or undefined?
4. **Side effects**: Does the function modify global state, allocate
   memory the caller must free, register callbacks, or interact with
   external systems?
5. **Ordering constraints**: Must certain functions be called before
   others? Is there an initialization/teardown protocol?
6. **Thread safety**: Can this be called concurrently? From any thread?
   What synchronization does the caller need to provide?

For each contract, cite the specific code evidence (file, line,
function) that establishes it.

## Phase 3: Essential vs. Incidental Classification

For every behavioral observation from Phase 2, classify it:

1. **Essential behavior**: Behavior that callers depend on and that
   defines the API's value. This becomes a requirement.
   - Test: "If this behavior changed, would existing correct callers break?"
   - Test: "Is this behavior documented, tested, or part of the type
     signature?"

2. **Incidental behavior**: Behavior that happens to be true in this
   implementation but is not part of the contract.
   - Test: "Could a correct reimplementation reasonably behave differently?"
   - Test: "Is this an optimization, ordering artifact, or implementation
     convenience?"

3. **Ambiguous behavior**: Cannot be classified without domain knowledge
   or explicit confirmation from stakeholders. Flag with `[AMBIGUOUS]`.

For ambiguous items, state the two interpretations and their implications
for requirements.

## Phase 4: Requirement Synthesis

Transform essential behaviors into structured requirements:

1. **Group by functional area**: Organize related behaviors into
   requirement categories (e.g., initialization, data processing,
   error handling, resource management).
2. **Write atomic requirements**: Each requirement captures exactly one
   testable behavior using RFC 2119 keywords (MUST, SHOULD, MAY).
3. **Derive acceptance criteria**: For each requirement, define at least
   one concrete, measurable test derived from the code's actual behavior.
   Prefer criteria that can be validated against the existing
   implementation as a reference oracle.
4. **Preserve semantic fidelity**: Requirements must faithfully represent
   what the implementation does, even if the behavior seems suboptimal.
   If behavior appears buggy but is established, note it as a requirement
   and flag: `[REVIEW: may be a defect in the reference implementation]`.
5. **Capture non-functional characteristics**: Performance bounds,
   resource usage patterns, concurrency guarantees, and platform
   requirements observed in the implementation.

## Phase 5: Completeness and Gap Analysis

1. **Coverage check**: Cross-reference the requirements against the
   API surface enumeration from Phase 1. Every public API element
   MUST have at least one associated requirement. Flag any gaps.
2. **Undocumented behavior**: Identify behaviors observed in the code
   that have no documentation, no tests, and no obvious purpose.
   These may be bugs, deprecated features, or undocumented contracts.
   Flag with `[UNDOCUMENTED]`.
3. **Missing error cases**: For each API element, verify that error
   conditions are covered by requirements. Missing error handling
   is a common gap.
4. **Cross-cutting concerns**: Verify that thread safety, resource
   lifecycle, and error propagation requirements are captured as
   cross-cutting requirements, not just per-function notes.
