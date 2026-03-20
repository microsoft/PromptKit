<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: traceability-audit
type: reasoning
description: >
  Systematic cross-document comparison protocol for auditing requirements,
  design, and validation artifacts. Builds traceability matrices, detects
  gaps in both directions, and classifies divergence using the
  specification-drift taxonomy.
applicable_to:
  - audit-traceability
---

# Protocol: Traceability Audit

Apply this protocol when auditing a set of specification documents
(requirements, design, validation plan) for consistency, completeness,
and traceability. The goal is to find every gap, conflict, and
unjustified assumption across the document set — not to confirm adequacy.

## Phase 1: Artifact Inventory

Before comparing documents, extract a complete inventory of traceable
items from each document provided.

1. **Requirements document** — extract:
   - Every REQ-ID (e.g., REQ-AUTH-001) with its category and summary
   - Every acceptance criterion linked to each REQ-ID
   - Every assumption (ASM-NNN) and constraint (CON-NNN)
   - Every dependency (DEP-NNN)
   - Defined terms and glossary entries

2. **Design document** (if provided) — extract:
   - Every component, interface, and module described
   - Every explicit REQ-ID reference in design sections
   - Every design decision and its stated rationale
   - Every assumption stated or implied in the design
   - Non-functional approach (performance strategy, security approach, etc.)

3. **Validation plan** — extract:
   - Every test case ID (TC-NNN) with its linked REQ-ID(s)
   - The traceability matrix (REQ-ID → TC-NNN mappings)
   - Test levels (unit, integration, system, etc.)
   - Pass/fail criteria for each test case
   - Environmental assumptions for test execution

**Output**: A structured inventory for each document. If a document is
not provided, note its absence and skip its inventory — do NOT invent
content for the missing document.

## Phase 2: Forward Traceability (Requirements → Downstream)

Check that every requirement flows forward into downstream documents.

1. **Requirements → Design** (skip if no design document):
   - For each REQ-ID, search the design document for explicit references
     or sections that address the requirement's specified behavior.
   - A design section *mentioning* a requirement keyword is NOT sufficient.
     The section must describe *how* the requirement is realized.
   - Record: REQ-ID → design section(s), or mark as UNTRACED.

2. **Requirements → Validation**:
   - For each REQ-ID, check the traceability matrix for linked test cases.
   - If the traceability matrix is absent or incomplete, search test case
     descriptions for REQ-ID references.
   - Record: REQ-ID → TC-NNN(s), or mark as UNTESTED.

3. **Acceptance Criteria → Test Cases**:
   - For each requirement that IS linked to a test case, verify that the
     test case's steps and expected results actually exercise the
     requirement's acceptance criteria.
   - A test case that is *linked* but does not *verify* the acceptance
     criteria is a D7_ACCEPTANCE_CRITERIA_MISMATCH.

## Phase 3: Backward Traceability (Downstream → Requirements)

Check that every item in downstream documents traces back to a requirement.

1. **Design → Requirements** (skip if no design document):
   - For each design component, interface, or major decision, identify
     the originating requirement(s).
   - Flag any design element that does not trace to a REQ-ID as a
     candidate D3_ORPHANED_DESIGN_DECISION.
   - Distinguish between: (a) genuine scope creep, (b) reasonable
     architectural infrastructure (e.g., logging, monitoring) that
     supports requirements indirectly, and (c) requirements gaps.
     Report all three, but note the distinction.

2. **Validation → Requirements**:
   - For each test case (TC-NNN), verify it maps to a valid REQ-ID
     that exists in the requirements document.
   - Flag any test case with no REQ-ID mapping or with a reference
     to a nonexistent REQ-ID as D4_ORPHANED_TEST_CASE.

## Phase 4: Cross-Document Consistency

Check that shared concepts, assumptions, and constraints are consistent
across all documents.

1. **Assumption alignment**:
   - Compare assumptions stated in the requirements document against
     assumptions stated or implied in the design and validation plan.
   - Flag contradictions, unstated assumptions, and extensions as
     D5_ASSUMPTION_DRIFT.

2. **Constraint propagation**:
   - For each constraint in the requirements document, verify that:
     - The design does not violate it (D6_CONSTRAINT_VIOLATION if it does).
     - The validation plan includes tests that verify it.
   - Pay special attention to non-functional constraints (performance,
     scalability, security) which are often acknowledged in design but
     not validated.

3. **Terminology consistency**:
   - Check that key terms are used consistently across documents.
   - Flag cases where the same concept uses different names in different
     documents, or where the same term means different things.

4. **Scope alignment**:
   - Compare the scope sections (or equivalent) across all documents.
   - Flag items that are in scope in one document but out of scope
     (or unmentioned) in another.

## Phase 5: Classification and Reporting

Classify every finding using the specification-drift taxonomy.

1. Assign exactly one drift label (D1–D7) to each finding.
2. Assign severity using the taxonomy's severity guidance.
3. For each finding, provide:
   - The drift label and short title
   - The specific location in each relevant document (section, ID, line)
   - Evidence (what is present, what is absent, what conflicts)
   - Impact (what could go wrong if this drift is not resolved)
   - Recommended resolution
4. Order findings by the taxonomy's ranking criteria (D6/D7 first,
   then D2/D5, then D1/D3, then D4).

## Phase 6: Coverage Summary

After reporting individual findings, produce aggregate metrics:

1. **Forward traceability rate**: % of REQ-IDs traced to design,
   % traced to test cases.
2. **Backward traceability rate**: % of design elements traced to
   requirements, % of test cases traced to requirements.
3. **Acceptance criteria coverage**: % of acceptance criteria with
   corresponding test verification.
4. **Assumption consistency**: count of aligned vs. conflicting vs.
   unstated assumptions.
5. **Overall assessment**: a summary judgment of specification integrity
   (e.g., "High confidence — 2 minor gaps" or "Low confidence —
   systemic traceability failures across all three documents").
