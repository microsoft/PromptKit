<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: extract-invariants
description: >
  Extract structured invariants (constraints, state machines, timing
  assumptions, ordering rules, error conditions) from a specification
  or source code. Produces a dense, filtered subset of what a full
  requirements extraction would produce — only enforceable constraints.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/invariant-extraction
format: requirements-doc
params:
  project_name: "Name of the system or component being analyzed"
  source_type: "Type of input: 'spec' (specification/RFC/design doc) or 'code' (source code)"
  source_content: "The specification text or source code to extract invariants from"
  context: "Additional context — what the system does, why invariants are being extracted (audit, reimplementation, formal verification, etc.)"
  focus_areas: "Optional narrowing — e.g., 'state machines only', 'timing constraints', 'error handling' (default: extract all)"
  audience: "Who will read the output — e.g., 'auditors verifying compliance', 'engineers reimplementing', 'formal verification team'"
input_contract: null
output_contract:
  type: requirements-document
  description: >
    A requirements document containing only invariants — constraints,
    state machines, timing bounds, ordering rules, and error conditions.
    Includes a state machine appendix if state-driven behavior is found.
---

# Task: Extract Invariants

You are tasked with extracting **structured invariants** from a
specification or source code. This is a focused extraction — you produce
only the dense, formal constraints, not a comprehensive requirements
document.

## Inputs

**Project Name**: {{project_name}}

**Source Type**: {{source_type}}

**Source Content**:
{{source_content}}

**Context**: {{context}}

**Focus Areas**: {{focus_areas}}

**Audience**: {{audience}}

## Instructions

1. **Apply the invariant-extraction protocol.** Execute all phases in
   order. This is the core methodology — do not skip phases.

2. **Adapt to the source type.** If `source_type` is "spec", act as a
   specification analyst — scan for RFC 2119 keywords, normative
   sections, and formal definitions. If `source_type` is "code", act as
   a reverse engineer — scan for assertions, preconditions, validation
   logic, state machines, and error handling.

3. **Extract ONLY invariants.** Do not produce a comprehensive
   requirements document. Focus exclusively on:
   - Value constraints (bounds, ranges, sizes)
   - Behavioral constraints (required/prohibited behaviors)
   - Ordering constraints (sequencing requirements)
   - Timing constraints (deadlines, timeouts, rates)
   - Resource constraints (limits, quotas, capacities)
   - State machines (states, transitions, guards, actions)
   - Error conditions (triggers, responses, recovery)

4. **If focus areas are specified**, perform the full source scan
   (Phase 1) but restrict detailed extraction (Phases 2–4) to the
   specified categories.

5. **Apply the anti-hallucination protocol.** Every invariant must cite
   a specific source location (section for specs, file:function:line
   for code). Do NOT invent constraints that are not stated or enforced
   in the source. If you infer an invariant from patterns rather than
   explicit statements, label it as `[INFERRED]` with reasoning.

6. **Format the output** according to the requirements-doc format:
   - Overview → what was analyzed and the source type
   - Scope → categories of invariants extracted
   - Requirements → the invariants, grouped by category (CONSTRAINT,
     STATE, TIMING, ERROR, RESOURCE), each with REQ-ID, keyword
     strength, and acceptance criterion
   - If state machines were extracted, include a **State Machine
     Appendix** after the main sections with the full state transition
     table and state invariants

7. **Quality checklist** — before finalizing, verify:
   - [ ] Every invariant cites a specific source location
   - [ ] Every invariant has a keyword strength (MUST/SHOULD/MAY for
         specs; enforced/assumed for code)
   - [ ] Every invariant has at least one acceptance criterion
   - [ ] State machines (if any) have complete transition tables — no
         missing transitions for defined states and events
   - [ ] Error conditions include both trigger and response
   - [ ] Ambiguities are flagged as `[INFERRED]` with reasoning
   - [ ] The coverage summary reports which sections/functions were
         analyzed and any with zero extracted invariants

## Non-Goals

- Do NOT produce a comprehensive requirements document — only
  invariants. For full requirements extraction, use
  `reverse-engineer-requirements` (code) or `extract-rfc-requirements`
  (RFCs).
- Do NOT assess whether the invariants are correct or desirable —
  only extract what the source states or enforces.
- Do NOT generate implementation or test code.
- Do NOT resolve ambiguities — flag them for human review.
