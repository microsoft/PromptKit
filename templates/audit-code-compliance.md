<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-code-compliance
description: >
  Audit source code against requirements and design documents for
  specification drift. Detects unimplemented requirements, undocumented
  behavior, and constraint violations. Classifies findings using the
  specification-drift taxonomy (D8–D10).
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - reasoning/code-compliance-audit
taxonomies:
  - specification-drift
format: investigation-report
params:
  project_name: "Name of the project or feature being audited"
  requirements_doc: "The requirements document content"
  design_doc: "The design document content (optional — omit for a requirements-only audit)"
  code_context: "Source code to audit — files, modules, or repository path"
  focus_areas: "Optional narrowing — e.g., 'security requirements only', 'API contracts' (default: audit all)"
  audience: "Who will read the audit report — e.g., 'engineering leads', 'development team'"
input_contract:
  type: requirements-document
  description: >
    A requirements document with numbered REQ-IDs and acceptance criteria.
    Source code to audit against the specification.
    Optionally, a design document with architecture and design decisions.
output_contract:
  type: investigation-report
  description: >
    An investigation report classifying code compliance findings
    using the D8–D10 taxonomy, with implementation coverage metrics
    and remediation recommendations.
---

# Task: Audit Code Compliance

You are tasked with auditing source code against its specification
documents to detect **code compliance drift** — gaps between what was
specified and what was built.

## Inputs

**Project Name**: {{project_name}}

**Requirements Document**:
{{requirements_doc}}

**Design Document** (if provided):
{{design_doc}}

**Source Code**:
{{code_context}}

**Focus Areas**: {{focus_areas}}

## Instructions

1. **Apply the code-compliance-audit protocol.** Execute all phases in
   order. This is the core methodology — do not skip phases.

2. **Classify every finding** using the specification-drift taxonomy
   (D8–D10). Every finding MUST have exactly one drift label, a severity,
   evidence, and a recommended resolution. Include specific locations in
   both the spec and the code — except for D9 findings, which by
   definition have no spec location (use "None — no matching requirement
   identified" and describe what was searched).

3. **If the design document is not provided**, skip design-related
   checks. Trace requirements directly to code without an intermediate
   design layer. Do NOT fabricate design content.

4. **If focus areas are specified**, perform the full inventories
   (Phases 1–2) but restrict detailed tracing (Phases 3–5) to
   requirements and code modules related to the focus areas.

5. **Apply the anti-hallucination protocol.** Every finding must cite
   specific REQ-IDs and code locations. Do NOT invent requirements or
   claim code implements behavior you cannot cite with a specific file
   path, line range, and code excerpt. If you cannot
   fully trace a requirement due to incomplete code context, assign the
   appropriate drift label (D8) but set its confidence to Low and state
   what additional code would be needed to confirm.

6. **Apply the operational-constraints protocol.** Do not attempt to
   ingest the entire codebase. Focus on the behavioral surface — public
   APIs, entry points, configuration, error handling — and trace inward
   only as needed to verify specific requirements.

7. **Format the output** according to the investigation-report format.
   Map the protocol's output to the report structure:
   - Phase 1–2 inventories → Investigation Scope (section 3)
   - Phases 3–5 findings → Findings (section 4), one F-NNN per issue
   - Phase 6 classification → Finding severity and categorization
   - Phase 7 coverage summary → Executive Summary (section 1) and
     a "Coverage Metrics" subsection in Root Cause Analysis (section 5)
   - Recommended resolutions → Remediation Plan (section 6)

8. **Quality checklist** — before finalizing, verify:
   - [ ] Every REQ-ID from the requirements document appears in at least
         one finding or is confirmed as implemented
   - [ ] Every finding has a specific drift label (D8, D9, or D10)
   - [ ] Every finding cites both spec and code locations (D9 findings
         use "None — no matching requirement identified" for spec location)
   - [ ] D8 findings include what was expected and why no implementation
         was found
   - [ ] D9 findings include the undocumented code behavior and why it
         does not trace to any requirement
   - [ ] D10 findings include the specific constraint and how the code
         violates it
   - [ ] Coverage metrics are calculated from actual counts
   - [ ] The executive summary is understandable without reading the
         full report

## Non-Goals

- Do NOT modify the source code — report findings only.
- Do NOT execute or test the code — this is static analysis against
  the specification, not runtime verification.
- Do NOT assess code quality (style, readability, complexity) unless
  it directly relates to a specification requirement.
- Do NOT generate missing requirements or design sections — identify
  and classify the gaps.
- Do NOT evaluate whether the requirements are correct for the domain —
  only whether the code implements them.
- Do NOT expand scope beyond the provided documents and code. External
  knowledge about the domain may inform severity assessment but must
  not introduce findings that are not evidenced in the inputs.
