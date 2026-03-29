<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-interface-contract
description: >
  Generate an interface contract between two components from a
  requirements document, design document, or specification. Produces a
  structured contract with resources, operating states, per-state
  guarantees, consumer obligations, invariants, and failure modes.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: interface-contract
params:
  interface_name: "Name of the interface — e.g., 'Sensor Node PCB ↔ Sonde Firmware'"
  provider_description: "What the provider is and what it supplies — e.g., 'sensor node PCB providing power rails, I/O pins, and bus connections'"
  consumer_description: "What the consumer is and what it needs — e.g., 'sonde firmware controlling sensors, radio, and power states'"
  boundary_type: "Type of boundary: 'hardware-firmware', 'service-service', 'library-consumer', 'os-driver', or 'other'"
  requirements_doc: "Requirements document or specification that governs this interface"
  design_doc: "(Optional) Design document with implementation details"
  context: "Additional context — operating environment, known constraints, existing contract fragments"
  audience: "Who will read the output — e.g., 'HW and FW engineers defining the integration boundary', 'API designers formalizing service contracts'"
input_contract:
  type: requirements-document
  description: >
    A requirements document or specification that defines the interface
    being contracted. The contract traces guarantees and obligations
    back to requirement IDs.
output_contract:
  type: interface-contract
  description: >
    A structured interface contract with resource inventory, operating
    states, per-resource-per-state guarantee and obligation matrices,
    testable invariants, and failure modes.
---

# Task: Author Interface Contract

You are tasked with producing a **structured interface contract** that
defines the boundary between a provider and consumer component.

## Inputs

**Interface Name**: {{interface_name}}

**Provider**: {{provider_description}}

**Consumer**: {{consumer_description}}

**Boundary Type**: {{boundary_type}}

**Requirements / Specification**:
{{requirements_doc}}

**Design Document** (if provided):
{{design_doc}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Identify the boundary.** Determine exactly what crosses the
   provider↔consumer boundary. Every power rail, pin, endpoint,
   function, message, or shared resource that one side exposes and
   the other uses is a boundary resource.

2. **Enumerate operating states.** Extract every mode, phase, or
   lifecycle stage from the requirements and design documents. Common
   patterns:
   - Hardware: shipping, deep sleep, active, radio TX burst, charging
   - Services: starting, healthy, degraded, maintenance, shutting down
   - Libraries: uninitialized, ready, disposed
   - Include state transition rules with entry/exit conditions.

3. **Build the guarantee matrix.** For each resource × state
   combination, determine what the provider guarantees. Extract values
   from requirements, datasheets, and design documents. Use RFC 2119
   keywords. Include units for all numeric values.

4. **Build the obligation matrix.** For each resource × state
   combination, determine what the consumer must do or must not do.
   Pay special attention to:
   - Preconditions (what must be true before using a resource)
   - Forbidden combinations (what must never happen simultaneously)
   - Sequencing (what must happen in order)
   - Cleanup (what must happen before state transitions)

5. **Define invariants.** Extract testable properties that must hold
   across the contract. Each invariant must be falsifiable — if you
   cannot describe a concrete violation, the invariant is too vague.

6. **Define failure modes.** For each invariant violation or guarantee
   breach, describe what happens, how severe it is, and what recovery
   (if any) is specified.

7. **Apply the anti-hallucination protocol** throughout:
   - Every guarantee must trace to a specific requirement, datasheet
     value, or design decision
   - Do NOT invent guarantees that are not stated in the inputs
   - If information is missing, state "UNKNOWN — requires
     <specification/measurement/decision>" rather than guessing
   - Distinguish between [KNOWN], [INFERRED], and [ASSUMPTION]

8. **Format the output** according to the interface-contract format
   specification. Every section must be populated. Every matrix cell
   must have an explicit value.

## Non-Goals

- Do NOT audit the contract for correctness — this template produces
  the contract. Use `audit-interface-contract` to verify it.
- Do NOT implement the interface — this is a specification document,
  not code or configuration.
- Do NOT generate machine-readable contract files (YAML, JSON) — this
  produces the human-readable contract document. Machine-readable
  derivatives are a downstream concern.

## Quality Checklist

Before finalizing, verify:

- [ ] Every resource that crosses the boundary is in the inventory
- [ ] Every operating state from the requirements is enumerated
- [ ] Every guarantee matrix cell has an explicit value (no blanks)
- [ ] Every obligation matrix cell has an explicit value (no blanks)
- [ ] Every numeric value includes units
- [ ] Every guarantee traces to a requirement or specification
- [ ] Every invariant is falsifiable with a concrete violation condition
- [ ] Every failure mode has a severity and specified recovery
- [ ] State transition rules cover all state × event combinations
- [ ] Cross-reference matrix maps every element to source specifications
- [ ] No fabricated values — unknowns marked as UNKNOWN
