<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: analyze-protocol-conflicts
description: >
  Compare two protocol specifications to identify semantic conflicts,
  incompatible assumptions, and interoperability hazards. Produces
  a structured investigation report with conflict classification,
  severity assessment, and resolution recommendations.
persona: protocol-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/protocol-conflict-analysis
format: investigation-report
params:
  protocol_a_name: "Name of the first protocol — e.g., 'TCP (RFC 9293)'"
  protocol_a_spec: "The first protocol specification text"
  protocol_b_name: "Name of the second protocol — e.g., 'QUIC (RFC 9000)'"
  protocol_b_spec: "The second protocol specification text"
  comparison_focus: "Optional narrowing — e.g., 'congestion control only', 'security model', 'connection establishment' (default: full comparison)"
  context: "Why these protocols are being compared — e.g., 'evaluating migration from A to B', 'designing a gateway', 'co-deploying on the same network'"
  audience: "Who will read the output — e.g., 'protocol implementers', 'standards body working group', 'engineering leadership'"
input_contract:
  type: requirements-document
  description: >
    Optionally accepts requirements documents for one or both protocols
    (from extract-rfc-requirements). When provided, enables
    requirement-level conflict tracing.
output_contract:
  type: investigation-report
  description: >
    An investigation report documenting conflicts, overlaps, and
    interoperability hazards between the two protocols, with severity
    classification and resolution recommendations.
---

# Task: Analyze Protocol Conflicts

You are tasked with performing a systematic comparison of two protocol
specifications to identify conflicts, incompatibilities, and
interoperability hazards.

## Inputs

**Protocol A**: {{protocol_a_name}}

**Protocol A Specification**:
{{protocol_a_spec}}

**Protocol B**: {{protocol_b_name}}

**Protocol B Specification**:
{{protocol_b_spec}}

**Comparison Focus**: {{comparison_focus}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the protocol-conflict-analysis reasoning protocol.**
   Execute all five phases in order. This is the core methodology —
   do not skip phases.

2. **Decompose both protocols** (Phase 1). Extract the structural
   elements of each protocol (state machines, message formats, error
   models, security models, assumptions). Build the shared-concern
   matrix.

3. **If a comparison focus is specified**, perform the full protocol
   decomposition (Phase 1) but restrict the overlap and conflict
   analysis (Phases 2–4) to the specified areas. Report what was
   excluded.

4. **Classify every overlap** (Phase 2) as COMPATIBLE,
   CONDITIONALLY_COMPATIBLE, CONFLICTING, or AMBIGUOUS. Do NOT under-
   report conflicts — it is better to flag a potential conflict for
   human review than to silently dismiss it.

5. **For CONFLICTING and AMBIGUOUS overlaps**, perform deep
   contradiction analysis (Phase 3). Quote the specific normative
   text from each specification that conflicts.

6. **Assess interoperability** (Phase 4) based on the stated context:
   - If migrating from A to B: focus on transition scenarios.
   - If co-deploying: focus on coexistence scenarios.
   - If designing a gateway: focus on translation scenarios.

7. **Propose resolutions** (Phase 5) for every CONFLICTING and
   AMBIGUOUS overlap. Prioritize by interoperability impact.

8. **Apply the anti-hallucination protocol.** Every conflict must cite
   specific normative text from both specifications. Do NOT fabricate
   conflicts or assume protocol behavior that is not stated. If a
   potential conflict depends on an interpretation of ambiguous text,
   classify it as AMBIGUOUS and present the interpretations.

9. **Format the output** using the investigation-report format. Map
   the conflict analysis to the report structure:
   - **Executive Summary**: Overall compatibility assessment.
   - **Problem Statement**: Why the comparison was performed (from
     context).
   - **Investigation Scope**: Which aspects were compared, which
     were excluded.
   - **Findings**: Each conflict or overlap becomes a finding:
     - Severity: Critical (CONFLICTING, MUST-level) / High
       (CONFLICTING, SHOULD-level) / Medium (AMBIGUOUS or
       CONDITIONALLY_COMPATIBLE) / Low (COMPATIBLE but notable)
     - Category: Namespace collision, state machine conflict, message
       format incompatibility, assumption conflict, security model
       conflict, resource contention, etc.
     - Evidence: Quoted normative text from both specifications.
   - **Root Cause Analysis**: Why the protocols conflict (if a common
     root cause underlies multiple findings).
   - **Remediation Plan**: Resolution recommendations from Phase 5,
     prioritized.
   - **Prevention**: Recommendations for avoiding future conflicts
     (e.g., registries, coordination mechanisms, profiling).

10. **Quality checklist** — before finalizing, verify:
    - [ ] Both protocols are fully decomposed (Phase 1 complete)
    - [ ] Every shared concern is analyzed (Phase 2 complete)
    - [ ] Every CONFLICTING overlap cites normative text from both
          specs
    - [ ] Every AMBIGUOUS overlap presents multiple interpretations
    - [ ] Interoperability assessment matches the stated context
    - [ ] Every conflict has at least one resolution recommendation
    - [ ] Findings are ordered by severity (Critical first)
    - [ ] No fabricated protocol behavior — all analysis traces to
          specification text

## Non-Goals

- Do NOT determine which protocol is "better" — both are equal inputs.
- Do NOT propose a new protocol that replaces both — only analyze
  the relationship between them.
- Do NOT implement compatibility layers — recommend them if appropriate.
- Do NOT assess the quality of either specification's design — only
  whether they conflict.
- Do NOT extend the analysis to protocols not provided — note
  dependencies on other protocols but do not analyze them.
