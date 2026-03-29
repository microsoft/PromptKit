<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: interface-contract
type: format
description: >
  Output format for interface contracts between two parties. Defines
  boundary resources, operating states, per-resource-per-state
  guarantees, consumer obligations, testable invariants, failure modes,
  and versioning rules. Domain-agnostic — works for hardware/firmware,
  service/service, library/consumer, and OS/driver boundaries.
produces: interface-contract
consumes: requirements-document
---

# Format: Interface Contract

The output MUST be a structured interface contract with the following
sections in this exact order. Do not omit sections — if a section has
no content, state "None identified" with a brief justification.

## Document Structure

````markdown
# <Interface Name> — Interface Contract

## 1. Contract Metadata
- **Contract version**: <semver>
- **Provider**: <component, service, board, library — what supplies
  the interface>
- **Consumer(s)**: <component(s), firmware, client(s) — what uses the
  interface>
- **Boundary type**: <hardware-firmware | service-service |
  library-consumer | os-driver | other>
- **Scope**: <what this contract covers>
- **Governing specification(s)**: <requirements doc, datasheet, API
  spec — cite by ID>
- **Validity conditions**: <when this contract applies — e.g.,
  "PCB rev ≥ 2.0, firmware ≥ 1.3.0">
- **Change policy**: <how this contract is versioned and who must
  approve changes>

## 2. Definitions
<Table of domain-specific terms used in this contract.
Format: | Term | Definition |

Every term that could be ambiguous across the provider/consumer
boundary MUST appear here. Include units, coordinate systems, and
enumeration value semantics.>

## 3. Operating States

Enumerate every operating state (mode, phase, lifecycle stage) that
this contract distinguishes. Guarantees and obligations in later
sections are specified *per state*.

| State ID | Name | Description | Entry Condition | Exit Condition |
|----------|------|-------------|-----------------|----------------|
| S-001    | <name> | <what the system does in this state> | <how it enters> | <how it exits> |

### 3.1 State Transition Rules
<State machine governing transitions between operating states.
Include a Mermaid stateDiagram-v2 diagram and a transition table:

| Current State | Event/Trigger | Guard | Action | Next State |
|---------------|---------------|-------|--------|------------|

Identify any undefined state × event combinations explicitly.>

## 4. Resource Inventory

List every resource that crosses the provider↔consumer boundary.
A "resource" is anything the consumer can observe, invoke, read,
write, or depend on: a power rail, a pin, an API endpoint, a
function, an IOCTL, a shared memory region, a message type, etc.

| Resource ID | Name | Category | Direction | Description | Source Ref |
|-------------|------|----------|-----------|-------------|------------|
| R-001 | <name> | <power-rail / pin / endpoint / function / ioctl / signal / register / message / shared-resource> | <provider→consumer / consumer→provider / bidirectional> | <one-line role> | <spec section> |

### 4.1 Resource Groups
<Optional grouping of resources by subsystem, bus, or functional area.
For HW: group by voltage domain, bus, connector.
For services: group by API resource path or capability.
For libraries: group by module or namespace.>

## 5. Guarantees (Provider → Consumer)

For each resource, specify what the provider guarantees, **per
operating state**. Use a resource × state matrix — one subsection
per resource (or resource group if guarantees are uniform within
the group).

### R-<NNN>: <Resource Name>

| Property | S-001: <State> | S-002: <State> | … |
|----------|---------------|---------------|---|
| <domain-specific property> | <guaranteed value/range/behavior> | <guaranteed value/range/behavior> | … |

#### Domain-Specific Property Examples

**Hardware (power rail):** voltage window (min/typ/max), current
budget (peak/avg), ripple, sequencing rank, brownout threshold.

**Hardware (pin):** electrical role, voltage domain, pull
configuration, default state, max sink/source current.

**Service endpoint:** response time (p50/p99), throughput limit,
error codes returned, payload schema version, retry-after semantics.

**Library function:** preconditions, postconditions, time complexity,
thread safety level (thread-safe / reentrant / not-thread-safe),
exception/error guarantees (no-throw / basic / strong).

**OS/driver interface:** IOCTL code, input/output buffer layout,
IRQL constraints, power state requirements, resource lifetime rules.

### Guarantee Notation Rules
- Use RFC 2119 keywords (MUST, SHOULD, MAY) for normative guarantees.
- Numeric guarantees MUST include units and state whether they are
  min/typ/max or absolute bounds.
- "Not specified" is NOT acceptable — if the provider makes no
  guarantee for a resource in a state, state "NOT AVAILABLE: <reason>"
  explicitly.

## 6. Obligations (Consumer → Provider)

For each resource, specify what the consumer MUST, SHOULD, or MUST
NOT do, **per operating state**. Same matrix structure as Section 5.

### R-<NNN>: <Resource Name>

| Obligation | S-001: <State> | S-002: <State> | … |
|------------|---------------|---------------|---|
| <what the consumer must do/not do> | <per-state requirement> | <per-state requirement> | … |

#### Typical Obligation Categories
- **Preconditions before use**: e.g., "MUST NOT read pin until rail
  is stable"
- **Usage limits**: e.g., "MUST NOT exceed 50 mA draw from rail"
- **Sequencing**: e.g., "MUST call initialize() before any other
  function"
- **Forbidden combinations**: e.g., "MUST NOT enable radio TX when
  VBAT < 3.0V"
- **Cleanup/release**: e.g., "MUST release handle before driver
  unload"
- **Error handling**: e.g., "MUST retry with backoff on HTTP 429"

## 7. Invariant Checklist

Testable properties that MUST hold across the entire contract. Each
invariant is a predicate that can be mechanically checked against the
contract data, the implementation, or both.

### INV-<NNN>: <Invariant Name>

- **Scope**: global | per-state | conditional
- **Property**: <formal predicate — falsifiable, not prose>
- **Violation condition**: <what constitutes a concrete counterexample>
- **Enforcement**: <how this is checked — CI, runtime assertion,
  review, hardware interlock, or not enforced>
- **Linked resources**: <R-NNN IDs involved>
- **Linked guarantees/obligations**: <section references>

## 8. Failure Modes

What happens when a guarantee is violated or an obligation is
breached. One entry per failure mode, not per resource.

### FM-<NNN>: <Failure Mode Title>

- **Trigger**: <what guarantee violation or obligation breach causes
  this>
- **Affected resources**: <R-NNN IDs>
- **Observable symptoms**: <what the provider or consumer will observe>
- **Severity**: Critical / High / Medium / Low
- **Specified recovery**: <what the contract requires — safe state,
  retry, escalation, or "unspecified">
- **Cascading effects**: <does this failure trigger other failure
  modes?>

## 9. Compatibility and Versioning
<Rules for contract evolution:
- What changes are backward-compatible vs. breaking
- Version negotiation mechanism (if any)
- Deprecation policy for resources
- How consumers discover the contract version>

## 10. Cross-Reference Matrix

| Contract Element | Type | Source Specification | Source Location |
|------------------|------|---------------------|-----------------|
| S-001 | State | <spec name> | <section/line> |
| R-001 | Resource | <spec name> | <section/line> |
| INV-001 | Invariant | <spec name> | <section/line> |

## 11. Revision History
<Table: | Version | Date | Author | Changes |>
````

## Formatting Rules

- Guarantees and obligations MUST be specified per-resource-per-state
  using the matrix layout. A flat list is insufficient — the state
  dimension is what makes contracts testable.
- Every cell in the guarantee/obligation matrices MUST have an explicit
  value. Use "N/A — resource inactive in this state" or "NOT AVAILABLE:
  <reason>", never a blank cell.
- Resource IDs (R-NNN), state IDs (S-NNN), invariant IDs (INV-NNN),
  and failure mode IDs (FM-NNN) MUST be sequential and unique within
  the document.
- RFC 2119 keywords (MUST, SHOULD, MAY) govern normative language.
- Numeric values MUST include units.
- Every invariant MUST be falsifiable — if you cannot describe a
  concrete violation, the invariant is too vague.
- Cells in the guarantee and obligation matrices MUST NOT contain
  prose-only guidance. Each entry MUST be expressible as a checkable
  predicate or a numeric bound. Other sections of the contract (e.g.,
  metadata, definitions, revision history) MAY use explanatory prose.
