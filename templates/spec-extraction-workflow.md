<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: spec-extraction-workflow
mode: interactive
description: >
  Bootstrap any repository with a clean semantic baseline.  Scans
  existing code, docs, tests, and issues, extracts draft requirements,
  design, and validation specs, collaborates with the user to clarify
  intent, audits for consistency, and produces PR-ready spec files.
  Domain-agnostic — the bootstrap complement to engineering-workflow.
persona: "{{persona}}"
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - guardrails/adversarial-falsification
  - reasoning/requirements-from-implementation
  - reasoning/requirements-elicitation
  - reasoning/iterative-refinement
  - reasoning/traceability-audit
taxonomies:
  - specification-drift
format: null
params:
  persona: "Persona to use — select from library (e.g., software-architect, electrical-engineer, reverse-engineer)"
  project_name: "Name of the project, product, or system to bootstrap"
  repo_root: "Root directory of the repository to analyze"
  output_requirements: "Output file path for requirements spec (e.g., requirements.md)"
  output_design: "Output file path for design spec (e.g., design.md)"
  output_validation: "Output file path for validation spec (e.g., validation.md)"
  output_audit: "Output file path for audit report (e.g., audit-report.md)"
  focus_areas: "(Optional) Specific areas to focus on — e.g., 'authentication module', 'power delivery subsystem'. Default: analyze entire repo."
  context: "Additional context — known documentation, architecture notes, domain conventions"
input_contract: null
output_contract:
  type: artifact-set
  description: >
    A set of specification documents (requirements, design, validation)
    extracted from the repository and verified through human
    collaboration and adversarial audit.  Ready to serve as the
    semantic baseline for the engineering-workflow.
---

# Task: Spec Extraction Workflow

You are tasked with bootstrapping a repository with a **clean semantic
baseline** — structured requirements, design, and validation specs
extracted from the existing codebase and documentation, then refined
through interactive collaboration with the user.

This is a multi-phase, interactive workflow.  You MUST use tools to
scan the repository rather than asking the user to paste content.

## Inputs

**Project**: {{project_name}}

**Repository Root**: {{repo_root}}

**Output Files**:
- Requirements: {{output_requirements}}
- Design: {{output_design}}
- Validation: {{output_validation}}
- Audit: {{output_audit}}

**Focus Areas**: {{focus_areas}}

**Additional Context**:
{{context}}

---

## Workflow Overview

```
Phase 1: Repository Scan
    ↓
Phase 2: Draft Extraction (requirements + design + validation)
    ↓
Phase 3: Human Clarification Loop
    ↓ ← iterate until specs are crisp
Phase 4: Consistency Audit (adversarial)
    ↓ ← loop back to Phase 3 if issues found
Phase 5: Human Approval
    ↓ ← loop back to Phase 3 if changes requested
Phase 6: Create Deliverable
```

---

## Phase 1 — Repository Scan

**Goal**: Build a comprehensive understanding of the repository before
extracting any specifications.

Use tools to systematically scan the repository:

1. **Project structure** — read the directory tree to understand
   overall organization, languages, and architecture.
2. **Documentation** — read README, CONTRIBUTING, architecture docs,
   design docs, and any existing specifications.
3. **Source code** — read key source files, focusing on:
   - Public APIs, entry points, and interfaces
   - Core data structures and types
   - Error handling patterns
   - Configuration surfaces
4. **Tests** — read test files to understand:
   - What behaviors are currently verified
   - Test naming conventions (which reveal intent)
   - Coverage patterns and gaps
5. **Issues and history** — if accessible, scan recent issues, PRs,
   and commit messages for architectural decisions and known problems.
6. **Build and configuration** — read build files, CI configs, and
   dependency manifests for constraints and requirements.

Apply the **operational-constraints protocol** — scope your analysis
before reading.  Identify the relevant files and directories first,
then read systematically.  Do not attempt to read the entire repo
at once.

### Output

Present a **Repository Analysis Summary** to the user:
- Project purpose and architecture (as understood)
- Key components and their relationships
- Languages, frameworks, and tools
- Existing documentation coverage
- Test coverage observations
- Ambiguities and unknowns discovered
- Proposed scope for specification extraction

**Wait for the user to confirm or adjust the scope before proceeding.**

---

## Phase 2 — Draft Extraction

**Goal**: Produce draft specifications from the repository analysis.

### 2a. Requirements Extraction

Apply the **requirements-from-implementation protocol**:

1. Enumerate the API surface / functional surface
2. Extract behavioral contracts for each element
3. Classify each behavior as essential vs. incidental
4. Synthesize requirements from essential behaviors
5. Verify completeness against the API surface

Apply the **anti-hallucination protocol** throughout:
- Every requirement MUST be traceable to specific code or documentation
- Cite file paths, function names, and line numbers
- When evidence is missing or incomplete, mark the item as `[UNKNOWN: <what is missing>]`
- When you must rely on a non-traceable interpretation, mark it as `[ASSUMPTION]` and describe the rationale and any plausible alternative interpretations
- Do NOT invent behaviors not demonstrated by the code

Format the output according to the **requirements-doc** format.
The assembled prompt includes only the multi-artifact format, so
use this section skeleton for the requirements document:

1. **Overview** — purpose and scope of the system
2. **Scope** — in-scope and out-of-scope boundaries
3. **Definitions and Glossary** — domain terminology extracted from code
4. **Requirements** — atomic items with REQ-IDs, RFC 2119 keywords,
   and acceptance criteria (AC-1, AC-2, ...)
5. **Dependencies** (DEP-NNN) — external systems, libraries, or services
6. **Assumptions** (ASM-NNN) — conditions presumed true but not enforced
7. **Risks** (RISK-NNN) — potential failures, uncertainties, or impact areas
8. **Revision History** — initial extraction metadata

For any section with no content, explicitly state **"None identified."** — never omit sections.

### 2b. Design Extraction

From the confirmed requirements and codebase analysis, produce a
design specification covering:

- Architecture overview (components, layers, boundaries)
- Component descriptions and responsibilities
- Data models and state management
- Interface contracts between components
- Constraints and invariants
- Cross-cutting concerns (error handling, logging, security, etc.)

Format the output according to the **design-doc** format.
Use this section skeleton:

1. **Overview** — system purpose, design philosophy, and goals
2. **Requirements Summary** — key functional and non-functional requirements
3. **Architecture** — high-level architecture, components, layers, boundaries
4. **Detailed Design** — component behavior, data flows, interfaces, and key algorithms
5. **Tradeoff Analysis** — major decisions, options considered, and rationale
6. **Security Considerations** — threat model, trust boundaries, mitigations
7. **Operational Considerations** — deployment, observability, monitoring, and ops
8. **Open Questions** — unresolved issues, risks, and follow-up investigations
9. **Revision History** — initial extraction metadata

### 2c. Validation Extraction

From the requirements and existing tests, produce a validation plan:

- Test case definitions linked to requirements (TC-NNN → REQ-ID)
- Acceptance criteria for each requirement
- Coverage assessment (what is tested vs. what is not)
- Behavioral constraints and negative cases
- Cross-component consistency rules

Format the output according to the **validation-plan** format.
Use this section skeleton:

1. **Overview** — objectives, system under test, and validation approach
2. **Scope of Validation** — in-scope vs. out-of-scope features and constraints
3. **Test Strategy** — test levels, techniques, and types (unit, integration, system, regression)
4. **Requirements Traceability Matrix** — REQ-ID → TC-NNN mapping
5. **Test Cases** — TC-NNN entries linked to REQ-IDs, with pass/fail
   criteria and test levels
6. **Risk-Based Test Prioritization** — risk categories, impact/likelihood, and prioritization rationale
7. **Pass/Fail Criteria** — overall entry/exit criteria and acceptance thresholds
8. **Revision History** — initial extraction metadata

### Critical Rule

Mark EVERY extracted item with a **confidence level**:
- **High** — directly evidenced by code, docs, or tests
- **Medium** — inferred from patterns but not explicitly documented
- **Low** — speculative, needs user confirmation

Present all three draft documents to the user before proceeding.

---

## Phase 3 — Human Clarification Loop

**Goal**: Refine the draft specs through interactive collaboration
until the user is satisfied they are accurate and complete.

Walk through the drafts with the user, focusing on:

1. **LOW and MEDIUM confidence items first** — ask targeted questions:
   - "Is this requirement correct, or is this behavior incidental?"
   - "Is this behavior intentional or legacy?"
   - "Should this constraint be preserved?"
   - "Is this a bug or a feature?"
   - "What's missing from the current design?"
2. **Coverage gaps** — present areas where no requirements could be
   extracted and ask the user to fill in intent.
3. **Ambiguous items** — present both interpretations and ask the
   user to choose.
4. **Implicit requirements** — suggest requirements the code implies
   but doesn't enforce (e.g., thread safety assumptions).

Apply the **requirements-elicitation protocol** to decompose each
confirmed item into atomic, testable requirements.

Apply the **iterative-refinement protocol** when updating:
- Surgical changes, not full rewrites
- Preserve REQ-IDs and TC-IDs
- Justify every change
- Update traceability

### Critical Rule

**Do NOT proceed to Phase 4 until the user explicitly says the
clarification phase is complete** (e.g., "READY", "looks good",
"proceed to audit").

---

## Phase 4 — Consistency Audit

**Goal**: Adversarially verify the extracted specs for internal
consistency and completeness.

Apply the **traceability-audit protocol**:

1. **Forward traceability** — every requirement has design coverage
   and at least one test case.  Flag gaps as D1 or D2.
2. **Backward traceability** — every design element and test case
   traces to a requirement.  Flag orphans as D3 or D4.
3. **Cross-document consistency** — assumptions, constraints, and
   terminology are consistent across all three documents.  Flag
   drift as D5 or D6.
4. **Acceptance criteria coverage** — test cases cover all acceptance
   criteria.  Flag gaps as D7.

Apply the **adversarial-falsification protocol**:
- Try to disprove each "clean" finding
- Try to find issues in areas you initially marked as consistent
- Rate confidence: High / Medium / Low

### Output

Produce an investigation report following the **investigation-report
format's required 9-section structure**:

1. **Executive Summary** — overall consistency assessment
2. **Problem Statement** — what was audited and why
3. **Investigation Scope** — documents and artifacts examined
4. **Findings** — each with F-NNN ID, D1–D7 classification,
   severity, evidence, and remediation
5. **Root Cause Analysis** — systemic issues underlying findings
6. **Remediation Plan** — prioritized fixes
7. **Prevention** — process recommendations
8. **Open Questions** — unresolved items; include **Verdict**:
   `Verdict: PASS | REVISE | RESTART`
9. **Revision History**

Verdict meanings:

- **PASS** — specs are internally consistent, proceed to approval
- **REVISE** — specific issues found, loop back to Phase 3 with
  findings for user clarification
- **RESTART** — fundamental issues, loop back to Phase 2

Present the audit report to the user.

---

## Phase 5 — Human Approval

**Goal**: Get user sign-off on the semantic baseline.

Present to the user:
1. Final requirements document
2. Final design document
3. Final validation plan
4. Audit report with verdict
5. Summary of what was extracted, clarified, and verified

Ask the user to respond with:
- **APPROVED** → proceed to Phase 6
- **REVISE** → take feedback, return to Phase 3
- Specific change requests → incorporate and re-audit

---

## Phase 6 — Create Deliverable

**Goal**: Produce the spec files and commit them.

1. Write the finalized documents to the user-specified file paths:
   - {{output_requirements}}
   - {{output_design}}
   - {{output_validation}}
   - {{output_audit}} (audit report from Phase 4)
2. Stage the files and generate a commit message summarizing:
   - What was extracted and from where
   - Key decisions made during clarification
   - Audit results
   - Confidence assessment
3. Create a PR (or prepare a patch set) with:
   - Description explaining the semantic baseline
   - Summary of extraction methodology
   - List of unresolved ambiguities or future work
   - Summary of audit results

Ask the user which deliverable format they prefer if not obvious
from context.

---

## Non-Goals

- Do NOT refactor or improve the existing code — only extract specs.
- Do NOT skip phases — each phase exists for a reason.
- Do NOT auto-approve — the user must explicitly approve the baseline.
- Do NOT fabricate requirements from general domain knowledge —
  every requirement must trace to THIS repository's code or docs.
- Do NOT attempt to read the entire repository at once — scope and
  prioritize systematically.

## Quality Checklist

Before presenting deliverables at each phase, verify:

- [ ] Repository scan produced a structured analysis summary
- [ ] Every extracted requirement cites source code or documentation evidence
- [ ] Every requirement has a unique REQ-ID and acceptance criteria
- [ ] Every design element traces to at least one requirement
- [ ] Every test case traces to at least one requirement
- [ ] Confidence tags (High/Medium/Low) are present on all extracted items
- [ ] All Low-confidence items were presented for user clarification
- [ ] User explicitly approved before proceeding past each gate phase
- [ ] Audit report follows investigation-report 9-section structure
- [ ] Audit verdict is clearly stated (PASS/REVISE/RESTART)
- [ ] All four output files are written to user-specified paths
- [ ] No fabricated requirements — all unknowns marked with [UNKNOWN: <what is missing>]
