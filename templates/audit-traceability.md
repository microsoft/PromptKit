<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-traceability
description: >
  Audit requirements, design, and validation documents for specification
  drift. Cross-checks traceability, assumption consistency, constraint
  propagation, and coverage completeness. Classifies findings using the
  specification-drift taxonomy.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/traceability-audit
format: investigation-report
params:
  project_name: "Name of the project or feature being audited"
  requirements_doc: "The requirements document content"
  design_doc: "The design document content (optional — omit for a two-document audit)"
  validation_plan: "The validation plan content"
  focus_areas: "Optional narrowing — e.g., 'security requirements only', 'API contracts' (default: audit all)"
  audience: "Who will read the audit report — e.g., 'engineering leads', 'project stakeholders'"
input_contract:
  type: requirements-document
  description: >
    A requirements document with numbered REQ-IDs and acceptance criteria.
    A validation plan with test cases and traceability matrix.
    Optionally, a design document with architecture and design decisions.
output_contract:
  type: investigation-report
  description: >
    An investigation report classifying specification drift findings
    using the D1–D7 taxonomy, with traceability matrices, coverage
    metrics, and remediation recommendations.
---

# Task: Audit Specification Traceability

You are tasked with auditing a set of specification documents for
**specification drift** — gaps, conflicts, and divergence between
requirements, design, and validation artifacts.

## Inputs

**Project Name**: {{project_name}}

**Requirements Document**:
{{requirements_doc}}

**Design Document** (if provided):
{{design_doc}}

**Validation Plan**:
{{validation_plan}}

**Focus Areas**: {{focus_areas}}

## Instructions

1. **Apply the traceability-audit protocol.** Execute all phases in order.
   This is the core methodology — do not skip phases or take shortcuts.

2. **Classify every finding** using the specification-drift taxonomy
   (D1–D7). Every finding MUST have exactly one drift label, a severity,
   specific locations in the source documents, evidence, and a
   recommended resolution.

3. **If the design document is not provided**, skip all design-related
   checks (Phase 2 step 1, Phase 3 step 1, design-related consistency
   checks in Phase 4). Restrict the audit to requirements ↔ validation
   plan traceability. Do NOT fabricate or assume design content.

4. **If focus areas are specified**, perform the full inventory (Phase 1)
   but restrict detailed analysis (Phases 2–5) to requirements matching
   the focus areas. Still report if the focus-area filter causes
   significant portions of the document set to be excluded from audit.

5. **Apply the anti-hallucination protocol.** Every finding must cite
   specific identifiers and locations in the provided documents. Do NOT
   invent requirements, test cases, or design sections that are not in
   the inputs. If you infer a gap, label the inference explicitly.

6. **Format the output** according to the investigation-report format.
   Map the protocol's output to the report structure:
   - Phase 1 inventory → Investigation Scope (section 3)
   - Phases 2–4 findings → Findings (section 4), one F-NNN per drift item
   - Phase 5 classification → Finding severity and categorization
   - Phase 6 coverage summary → Executive Summary (section 1) and
     a "Coverage Metrics" subsection in Root Cause Analysis (section 5)
   - Recommended resolutions → Remediation Plan (section 6)

7. **Quality checklist** — before finalizing, verify:
   - [ ] Every REQ-ID from the requirements document appears in at least
         one finding or is confirmed as fully traced
   - [ ] Every finding has a specific drift label (D1–D7)
   - [ ] Every finding cites specific document locations, not vague
         references
   - [ ] Severity assignments follow the taxonomy's guidance
   - [ ] Findings are ordered by the taxonomy's ranking criteria
   - [ ] Coverage metrics in the summary are calculated from actual
         counts, not estimated
   - [ ] If design document was absent, no findings reference design
         content
   - [ ] The executive summary is understandable without reading the
         full report

## Non-Goals

- Do NOT modify or improve the input documents — report findings only.
- Do NOT generate missing requirements, design sections, or test cases —
  identify and classify the gaps.
- Do NOT assess the quality of individual requirements, design decisions,
  or test cases in isolation — focus on cross-document consistency.
- Do NOT evaluate whether the requirements are correct for the domain —
  only whether the document set is internally consistent.
- Do NOT expand scope beyond the provided documents. External knowledge
  about the domain may inform severity assessment but must not introduce
  findings that are not evidenced in the documents.
