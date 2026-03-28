<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: reconstruct-behavior
description: >
  Reconstruct a behavioral model from an existing engineering artifact.
  Extracts state machines, control/signal flow, and implicit invariants
  from code, schematics, configurations, protocol captures, or firmware
  images. Produces a structured behavioral model with diagrams,
  transition tables, and undefined behavior catalog.
persona: reverse-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - reasoning/invariant-extraction
format: behavioral-model
params:
  system_name: "Name of the system or component being analyzed"
  artifact_type: "Type of artifact: 'code', 'schematic', 'netlist', 'configuration', 'protocol capture', 'firmware image', or 'mixed'"
  artifact_content: "The artifact to analyze — source code, netlist text, configuration file, capture log, etc."
  context: "Additional context — what the system does, known operating modes, related documentation"
  focus_areas: "Optional narrowing — e.g., 'power state machine only', 'I2C bus interactions', 'error handling flow' (default: extract all)"
  audience: "Who will read the output — e.g., 'engineers maintaining the system', 'architects planning a rewrite', 'auditors verifying behavior'"
input_contract: null
output_contract:
  type: behavioral-model
  description: >
    A structured behavioral model with state machines (diagrams +
    transition tables), control/signal flow graphs, implicit invariants,
    and an undefined behavior catalog. All elements cross-referenced to
    the source artifact.
---

# Task: Reconstruct Behavioral Model

You are tasked with extracting a **behavioral model** from an existing
engineering artifact. The artifact may be source code, a schematic,
a configuration file, a protocol capture, or a firmware image. Your
goal is to reconstruct the implicit behavioral model — the state
machines, control/signal flow, and invariants that the artifact
implements but does not explicitly document.

## Inputs

**System Name**: {{system_name}}

**Artifact Type**: {{artifact_type}}

**Artifact**:
{{artifact_content}}

**Context**: {{context}}

**Focus Areas**: {{focus_areas}}

**Audience**: {{audience}}

## Instructions

1. **Classify the artifact** and adapt your extraction approach:

   - **Code**: Look for state variables, switch/case on state, enum
     definitions, callback registrations, event loops, error return
     paths, and initialization sequences. Trace control flow through
     indirection (callbacks, vtables, function pointers, event
     dispatchers).
   - **Schematic / netlist**: Look for enable pins, reset circuits,
     power sequencing logic, mux selects, voltage supervisor outputs,
     and interrupt lines. Trace signal flow from inputs through
     combinational and sequential logic to outputs.
   - **Configuration**: Look for feature flags, mode selectors, pin
     assignments, threshold values, and timeout settings. Map each
     key to the behavioral change it causes.
   - **Protocol capture**: Look for message sequences, state
     transitions visible in message types, timeouts between messages,
     retransmissions, and error responses. Reconstruct the protocol
     state machine from observed behavior.
   - **Firmware image**: Look for string tables, configuration
     structures, jump tables, and interrupt vector tables. Reconstruct
     what the firmware does from its static structure.
   - **Mixed**: Apply the relevant approach to each sub-artifact and
     compose the results.

2. **Apply the invariant-extraction protocol** to systematically
   extract constraints, state machines, and error conditions. Use its
   extraction phases (Phases 1–4) for the core methodology, but
   **ignore** its output structuring phase (Phase 5) — this template's
   behavioral-model format and its SM/INV/UB IDs take precedence for
   structuring the final output, not REQ-IDs.

3. **Go beyond invariant extraction** to reconstruct the full
   behavioral model:
   - Invariant extraction produces constraints. This task also requires
     **control/signal flow reconstruction** — how entities interact
     and in what order, including through indirection.
   - Invariant extraction produces state machines as a subsection.
     This task promotes them to **first-class outputs** with diagrams,
     completeness analysis, and confidence ratings.
   - This task also catalogs **undefined behavior** — scenarios where
     the artifact's behavior is ambiguous or unspecified.

4. **Apply the anti-hallucination protocol** throughout:
   - Every state machine must cite the artifact locations that define
     its states and transitions
   - Every invariant must cite evidence from the artifact
   - Do NOT infer behavior that is not supported by the artifact —
     flag gaps as undefined behavior entries instead
   - Distinguish between [KNOWN] (artifact explicitly implements),
     [INFERRED] (derived from patterns in the artifact), and
     [ASSUMED] (depends on context not present in the artifact)

5. **Format the output** according to the behavioral-model format
   specification. Every section must be populated.

6. **Apply the self-verification protocol** before finalizing:
   - Re-read at least 2 state machines and verify the transition
     tables match the artifact
   - Verify every implicit invariant cites specific evidence
   - Verify the undefined behavior catalog covers all state × event
     gaps found in the completeness analysis
   - Verify the cross-reference matrix accounts for all model elements

## Non-Goals

- Do NOT produce a requirements document — use `reverse-engineer-requirements`
  for that. This task produces a behavioral model, not requirements.
- Do NOT evaluate whether the behavior is correct or desirable —
  only reconstruct what the artifact actually does.
- Do NOT fix bugs or suggest improvements — catalog undefined behavior
  as findings, not as fix recommendations.
- Do NOT execute or simulate the artifact — this is static analysis
  of the artifact's structure and content.

## Quality Checklist

Before finalizing, verify:

- [ ] Artifact type is identified and extraction approach is adapted
- [ ] Entity inventory is complete (all actors/components listed)
- [ ] Every state machine has a transition table AND a diagram
- [ ] Every state machine has a completeness analysis (undefined
      transitions, terminal states, unreachable states)
- [ ] Control/signal flow covers both static and dynamic paths
- [ ] Every implicit invariant cites evidence and states violation risk
- [ ] Undefined behavior catalog covers all identified gaps
- [ ] Cross-reference matrix maps every model element to source
- [ ] Confidence ratings are assigned to state machines and invariants
- [ ] No fabricated behavior — all unknowns are in the undefined
      behavior catalog
