<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-interface-contract
description: >
  Audit an interface contract for completeness, internal consistency,
  and alignment with governing specifications. Checks matrix coverage,
  guarantee traceability, obligation enforceability, invariant
  consistency, and failure mode completeness.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/interface-contract-audit
format: investigation-report
params:
  contract_name: "Name of the interface contract being audited"
  contract_content: "The interface contract document to audit"
  governing_specs: "The governing specifications (requirements docs, datasheets, API specs) that the contract should trace to"
  consumer_spec: "(Optional) The consumer's specification — if available, used to check obligation awareness"
  context: "Additional context — known issues, areas of concern, previous audit findings"
  audience: "Who will read the output — e.g., 'contract authors revising the document', 'integration engineers checking boundary agreements'"
input_contract:
  type: interface-contract
  description: >
    An interface contract document to audit for completeness and
    consistency.
output_contract:
  type: investigation-report
  description: >
    An audit report with findings classified by contract-audit labels
    (INCOMPLETE_MATRIX_CELL, VAGUE_GUARANTEE, UNTRACED_GUARANTEE,
    etc.) with coverage summary and remediation guidance.
---

# Task: Audit Interface Contract

You are tasked with performing a **systematic audit** of an interface
contract for completeness, internal consistency, and alignment with
its governing specifications.

## Inputs

**Contract Name**: {{contract_name}}

**Interface Contract**:
{{contract_content}}

**Governing Specifications**:
{{governing_specs}}

**Consumer Specification** (if provided):
{{consumer_spec}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the interface-contract-audit protocol.** Execute all seven
   phases in order. This is the core methodology — do not skip phases.

2. **Phase 2 (Completeness) is the foundation.** Matrix completeness
   is the most common failure in interface contracts — check every
   (resource × state) cell before moving to deeper analysis.

3. **Apply the anti-hallucination protocol** throughout:
   - Every finding must cite specific contract text or a specific
     missing element (identified by resource ID, state ID, or
     matrix cell coordinates)
   - Do NOT assume what a blank cell "probably" means — a blank
     cell is a finding, not an inference
   - Do NOT fabricate governing specification content
   - Distinguish between [KNOWN] (contract explicitly states),
     [INFERRED] (derived from contract patterns), and [ASSUMPTION]
     (depends on information not in the contract)

4. **Format the output** according to the investigation-report format:
   - Each finding uses a contract-audit label (INCOMPLETE_MATRIX_CELL,
     VAGUE_GUARANTEE, etc.) under **Category**
   - Maintain global severity ordering (Critical first)
   - Under **Location**, identify the specific contract section,
     resource ID, state ID, or matrix cell
   - Under **Evidence**, cite the contract text or absence that
     constitutes the finding
   - Under **Remediation**, specify what the contract author should
     add, change, or clarify

5. **Prioritize findings** by contract integrity impact:
   - **Critical**: Contract gap that could cause integration failure
     (INVARIANT_VIOLATION_POSSIBLE, OBLIGATION_GUARANTEE_CONFLICT)
   - **High**: Missing coverage that hides integration risk
     (UNCONTRACTED_RESOURCE, INCOMPLETE_MATRIX_CELL for critical
     resources)
   - **Medium**: Traceability or enforceability gap
     (UNTRACED_GUARANTEE, UNENFORCEABLE_OBLIGATION)
   - **Low**: Documentation quality issue (VAGUE_GUARANTEE,
     UNLINKED_INVARIANT)
   - **Informational**: Suggestion for improvement, no correctness
     impact

6. **Apply the self-verification protocol** before finalizing:
   - Re-read at least 3 findings and verify the cited contract
     text is accurate
   - Verify the coverage summary arithmetic is correct
   - Confirm every phase produced findings or documented "no findings"

## Non-Goals

- Do NOT rewrite the contract — report findings with remediation
  guidance, but do not produce a revised contract document
- Do NOT audit the implementation — this checks the contract
  document itself, not whether the provider or consumer actually
  delivers on its promises. To audit implementation against this
  contract, use `audit-code-compliance` and provide this interface
  contract as the governing specification input.
- Do NOT audit across multiple contracts — this checks one contract.
  Use `audit-integration-compliance` for cross-contract boundary
  checks.

## Quality Checklist

Before finalizing, verify:

- [ ] All 7 protocol phases were executed
- [ ] Every (resource × state) cell was checked for completeness
- [ ] Every guarantee was traced to a governing specification
- [ ] Every obligation was checked for enforceability
- [ ] Every invariant was tested for violation possibility
- [ ] Every failure mode was checked for trigger coverage
- [ ] Findings use contract-audit labels (not generic categories)
- [ ] Coverage summary includes resource/state/cell/invariant counts
- [ ] No fabricated contract content — missing data flagged as findings
