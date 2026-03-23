<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-integration-compliance
description: >
  Audit cross-component integration points against an integration
  specification and per-component specs. Detects unspecified integration
  flows, interface contract mismatches, and untested integration paths.
  Classifies findings using the specification-drift taxonomy (D14–D16).
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - reasoning/integration-audit
taxonomies:
  - specification-drift
format: investigation-report
params:
  project_name: "Name of the system being audited"
  integration_spec: "System-level integration specification — E2E flows, interface contracts, integration test expectations"
  component_specs: "Per-component requirements and/or design documents (multiple components)"
  test_code: "Integration/E2E test code (optional — omit if unavailable)"
  focus_areas: "Optional narrowing — e.g., 'BLE onboarding flow only', 'gateway ↔ modem interface' (default: audit all)"
  audience: "Who will read the audit report — e.g., 'system architects', 'integration test team'"
input_contract:
  type: requirements-document
  description: >
    A system-level integration specification describing cross-component
    flows, interface contracts, and integration test expectations.
    Per-component requirements and/or design documents for each
    component involved in integration flows. Optionally, integration
    or E2E test code.
output_contract:
  type: investigation-report
  description: >
    An investigation report classifying integration compliance findings
    using the D14–D16 taxonomy, with cross-component coverage metrics
    and remediation recommendations.
---

# Task: Audit Integration Compliance

You are tasked with auditing cross-component integration points against
an integration specification to detect **integration compliance drift**
— gaps between what was specified for cross-component behavior and what
the component specifications and tests actually cover.

This audit addresses a blind spot in per-component audits: flows that
span component boundaries. A system where every component passes its
own traceability, code-compliance, and test-compliance audits can still
have critical integration gaps — unspecified handoffs, mismatched
interface contracts, and untested end-to-end paths.

## Inputs

**Project Name**: {{project_name}}

**Integration Specification**:
{{integration_spec}}

**Component Specifications**:
{{component_specs}}

**Integration/E2E Test Code** (if provided):
{{test_code}}

**Focus Areas**: {{focus_areas}}

## Instructions

1. **Apply the integration-audit protocol.** Execute all phases in
   order. This is the core methodology — do not skip phases.

2. **Classify every finding** using the specification-drift taxonomy
   (D14–D16). Every finding MUST have exactly one drift label, a
   severity, evidence, and a recommended resolution. Include specific
   locations in the integration spec AND the relevant component
   spec(s).

3. **If test code is not provided**, skip Phase 5 (integration test
   coverage) but report all integration flows as D16 candidates with
   confidence Low and a note that test code was not available for
   analysis.

4. **If focus areas are specified**, perform the full inventories
   (Phases 1–2) but restrict detailed tracing (Phases 3–5) to
   flows and interfaces related to the focus areas.

5. **Apply the anti-hallucination protocol.** Every finding must cite
   specific locations in the integration spec and component specs. Do
   NOT invent interface contracts or assume components interact in
   ways not described in their specs. If a component's spec does not
   mention an interface that the integration spec assumes, that is a
   D14 finding — do not fabricate the missing specification.

6. **Apply the operational-constraints protocol.** Focus on the
   integration boundaries — the handoff points between components.
   Do not deeply audit each component's internal spec consistency
   (that is the job of per-component audit templates).

7. **Format the output** according to the investigation-report format.
   Map the protocol's output to the report structure:
   - Phase 1–2 inventories → Investigation Scope (section 3)
   - Phases 3–5 findings → Findings (section 4), one F-NNN per issue
   - Phase 6 classification → Finding severity and categorization
   - Phase 7 coverage summary → Executive Summary (section 1) and
     a "Coverage Metrics" subsection in Root Cause Analysis (section 5)
   - Recommended resolutions → Remediation Plan (section 6)

8. **Quality checklist** — before finalizing, verify:
   - [ ] Every integration flow from the integration spec appears in
         at least one finding or is confirmed as fully traced
   - [ ] Every interface between components is checked for contract
         alignment
   - [ ] Every finding has a specific drift label (D14, D15, or D16)
   - [ ] Every finding cites integration spec AND component spec
         locations
   - [ ] D14 findings identify which component spec is missing the
         flow or handoff
   - [ ] D15 findings quote both sides of the mismatched interface
         contract
   - [ ] D16 findings identify what integration test is missing and
         what flow it should cover
   - [ ] Coverage metrics are calculated from actual counts
   - [ ] The executive summary is understandable without reading the
         full report

## Non-Goals

- Do NOT perform per-component audits — this template audits
  integration boundaries only. Use `audit-traceability`,
  `audit-code-compliance`, or `audit-test-compliance` for
  per-component audits.
- Do NOT modify any specifications or test code — report findings only.
- Do NOT assess whether the integration specification is correct for
  the domain — only whether component specs and tests faithfully
  implement what it describes.
- Do NOT fabricate interface contracts or integration flows that are
  not described in the provided documents.
- Do NOT deeply analyze component internals — focus on the boundaries
  where components interact.
- Do NOT expand scope beyond the provided documents and code.
