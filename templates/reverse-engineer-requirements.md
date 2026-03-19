<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: reverse-engineer-requirements
description: >
  Reverse-engineer a structured requirements document from existing
  source code. Analyzes implementation to extract behavioral contracts,
  API specifications, and invariants, then produces a requirements
  document suitable for reimplementation, porting, or validation.
persona: reverse-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - reasoning/requirements-from-implementation
format: requirements-doc
params:
  project_name: "Name of the library, API, or system being analyzed"
  source_code: "Source code to analyze — files, directories, or repository"
  context: "Additional context — purpose of the library, target users, known documentation, why requirements are being extracted (porting, validation, etc.)"
  audience: "Who will read the output — e.g., 'engineers reimplementing in another language', 'QA team writing validation tests'"
input_contract: null
output_contract:
  type: requirements-document
  description: >
    A structured requirements document reverse-engineered from
    source code, with REQ-IDs, acceptance criteria, and traceability
    to the original implementation.
---

# Task: Reverse-Engineer Requirements from Implementation

You are tasked with analyzing an existing codebase and producing a
**requirements document** that captures what the implementation provides —
its behavioral contracts, guarantees, and API specifications.

## Inputs

**Project Name**: {{project_name}}

**Source Code**:
{{source_code}}

**Additional Context**:
{{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the requirements-from-implementation protocol** systematically.
   Begin by reading and understanding the codebase — its overall
   architecture, entry points, and primary abstractions. Do not begin
   requirement extraction until you have a coherent mental model. Then:
   - Phase 1: Enumerate the complete API surface
   - Phase 2: Extract behavioral contracts for each element
   - Phase 3: Classify each behavior as essential vs. incidental
   - Phase 4: Synthesize requirements from essential behaviors
   - Phase 5: Verify completeness against the API surface

2. **Apply the anti-hallucination protocol** throughout:
   - Every requirement MUST be traceable to specific code evidence
   - Cite file paths, function names, and line numbers where possible
   - Do NOT invent behaviors not demonstrated by the code
   - If behavior is unclear, use `[UNKNOWN]` rather than guessing
   - When code and documentation disagree, report both

3. **Apply the operational-constraints protocol** when reading the codebase:
   - Scope your analysis before reading — identify the relevant files
     and directories first
   - Enumerate API elements systematically rather than ad-hoc
   - Document your analysis strategy for reproducibility

4. **Format the output** according to the requirements-doc format
   specification. Additionally:
   - In the Overview section, describe the purpose and architecture
     of the analyzed codebase
   - In the Definitions section, include domain terminology extracted
     from the code (type names, macro conventions, error codes)
   - For each requirement, include a source citation inline
     (e.g., "Source: `auth.c:142`, `validate_token()`)

5. **Apply the self-verification protocol** before finalizing:
   - Sample at least 5 requirements and re-verify each against
     the source code
   - Confirm the API surface enumeration is complete
   - Verify every requirement has at least one acceptance criterion
   - Check for requirements that contradict each other

## Non-Goals

- Do NOT refactor or critique the implementation — you are extracting
  what it does, not judging how well it does it.
- Do NOT generate implementation recommendations or design improvements.
- Do NOT infer requirements from similar libraries or frameworks —
  only from the code under analysis.
- Do NOT attempt to fix bugs in the requirements — if the implementation
  has apparent defects, document them as requirements and flag for review.

## Investigation Plan

Before beginning requirement extraction, produce a concrete analysis plan:

1. **Scope the codebase**: Identify the relevant source files, header files,
   and documentation. Exclude test code, build scripts, and examples unless
   they reveal API contracts.
2. **Identify the API boundary**: Determine which elements are public API
   vs. internal implementation. Use visibility markers (header inclusion,
   export annotations, naming conventions) as guides.
3. **Plan the enumeration order**: Start with the top-level API (main
   headers, entry points), then work inward to supporting types and
   utilities.
4. **Identify cross-cutting concerns**: Thread safety, error handling
   patterns, resource lifecycle management — these cut across the API
   and need dedicated requirement sections.

This plan ensures systematic coverage and prevents ad-hoc analysis
that misses components.

## Quality Checklist

Before finalizing, verify:

- [ ] Every public API element has at least one requirement
- [ ] Every requirement has a unique REQ-ID
- [ ] Every requirement uses RFC 2119 keywords correctly
- [ ] Every requirement has at least one acceptance criterion
- [ ] Every requirement cites source code evidence
- [ ] Essential vs. incidental classification is documented
- [ ] Ambiguous behaviors are flagged with [AMBIGUOUS]
- [ ] Cross-cutting concerns (threading, errors, resources) are covered
- [ ] No fabricated behaviors — all unknowns marked with [UNKNOWN]
