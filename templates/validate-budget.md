<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: validate-budget
description: >
  Validate a quantitative analysis (power budget, link budget, cost
  rollup, timing analysis, memory budget) against specification
  constraints. Extracts constraints and claims, verifies arithmetic
  and units, computes margins, performs sensitivity analysis, and
  checks completeness.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/quantitative-constraint-validation
format: investigation-report
params:
  project_name: "Name of the system or component under analysis"
  spec_content: "Specification text containing the quantitative constraints (requirements doc, datasheet, or standard)"
  budget_artifact: "The budget or analysis artifact to validate — table, spreadsheet export, or text-based budget document"
  budget_type: "Type of budget: 'power', 'cost', 'timing', 'link', 'memory', or 'other'"
  context: "Operating conditions, assumptions, environment — e.g., 'ambient temperature 25°C, battery at 3.7V nominal'"
  audience: "Who will read the output — e.g., 'engineers reviewing the power budget', 'program managers assessing cost risk'"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    An investigation report with margin analysis table, arithmetic
    verification results, sensitivity findings, and completeness
    assessment. Each finding includes the constraint, claimed value,
    computed margin, and classification.
---

# Task: Validate Budget Against Specification

You are tasked with validating a **quantitative analysis artifact**
against the numerical constraints in a specification. This is not a
qualitative review — you must extract every numerical constraint,
extract every numerical claim, verify the arithmetic, compute margins,
and assess sensitivity.

## Inputs

**Project Name**: {{project_name}}

**Specification**:
{{spec_content}}

**Budget / Analysis Artifact**:
{{budget_artifact}}

**Budget Type**: {{budget_type}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the quantitative-constraint-validation protocol.** Execute
   all seven phases in order. This is the core methodology — do not
   skip phases.

2. **Phase 1 (Constraint Extraction) and Phase 2 (Claim Extraction)
   are the foundation.** Present the constraint table and claim table
   before proceeding to verification. Misidentified constraints or
   claims corrupt all downstream analysis.

3. **Adapt to the budget type.** The protocol is budget-type-agnostic,
   but apply domain knowledge:
   - **Power**: distinguish peak vs. average current, per-state
     budgets, always-on vs. gated loads, datasheet maximum
     (worst-case conditions per component datasheet) vs. nominal
     (measured or expected typical values)
   - **Cost**: verify include/exclude boundaries match the spec,
     check quantity break pricing, flag estimated vs. quoted values
   - **Timing**: use worst-case values, distinguish blocking vs.
     concurrent stages, check that only the critical path sums
   - **Link**: compute in dB, apply correct path loss model for the
     environment, check regulatory limits separately from link closure
   - **Memory**: account for alignment/padding, distinguish static
     vs. dynamic allocation, check per-region not just total

4. **Apply the anti-hallucination protocol** throughout:
   - Every constraint must cite a specific spec section
   - Every claim must cite a specific artifact location
   - Do NOT fabricate re-derivations of simulation or measurement
     results — verify inputs and interpretation instead
   - Distinguish between [KNOWN] (spec/artifact states explicitly),
     [INFERRED] (derived from provided data), and [ASSUMPTION]
     (depends on information not provided)

5. **Format the output** according to the investigation-report format
   with these budget-specific additions:
   - In the **Executive Summary**, provide the required 2–4 sentence
     narrative summary. Place the margin summary table from Phase 5
     (constraint ID, constraint, claimed, margin, classification)
     immediately after the summary within Section 1, and reference
     it from the narrative.
   - Each finding represents a constraint verification result. Use
     the investigation-report's required per-finding fields
     (Description, Impact, Severity, Category, Location, Evidence,
     Root Cause, Remediation, Confidence).
   - Under **Category**, use: Violated / Marginal / Arithmetic Error /
     Unit Error / Completeness Gap / Sensitivity Risk / Excessive
     Margin
   - Under **Evidence**, include the computation showing the margin
     or the arithmetic discrepancy
   - In the **Remediation Plan**, prioritize by severity and
     sensitivity — a marginal result with a thin break-even delta
     is more urgent than one with a comfortable delta

6. **Prioritize findings** by quantitative impact:
   - **Critical**: Constraint violated (negative margin) with no
     plausible mitigation within current architecture
   - **High**: Constraint violated but recoverable with component
     changes; OR marginal result near the adequacy threshold with
     high sensitivity to plausible input variation
   - **Medium**: Marginal result with moderate sensitivity; OR
     arithmetic error that doesn't change pass/fail
   - **Low**: Adequate margin with noted concern (stale data, missing
     worst-case analysis)
   - **Informational**: Excessive margin suggesting over-design;
     conservative assumptions noted

7. **Apply the self-verification protocol** before finalizing:
   - Re-check up to 3 margin computations (or all, if fewer) by
     re-deriving from the source values
   - Verify the margin summary table is complete (every constraint
     has a row)
   - Verify unit consistency in all comparisons
   - Confirm sensitivity analysis was performed for all Violated
     and Marginal findings (required). For Adequate findings with
     thin margin, sensitivity analysis is recommended — perform it
     when the margin is less than 20% (percentage-based). For
     tolerance-stack-based analyses, apply a "within 1 standard
     deviation of the limit" trigger only when σ is explicitly
     provided in the artifact or derivable from a stated tolerance
     model. If only min/max tolerances are available and no
     tolerance model is stated, use the less-than-20% deterministic
     margin threshold instead

## Non-Goals

- Do NOT redesign the system to fix violations — report findings
  with remediation suggestions, but do not produce a revised budget
- Do NOT run simulations or measurements — this is analytical
  verification of an existing artifact
- Do NOT reconcile multiple budget artifacts against each other —
  this validates one artifact against one spec. The protocol's
  completeness check (Phase 7) flags inconsistencies noticed within
  the artifact, but systematic cross-artifact reconciliation is a
  separate task
- Do NOT validate qualitative spec requirements — this is
  quantitative analysis only. Use `audit-spec-invariants` for
  qualitative invariant checking

## Quality Checklist

Before finalizing, verify:

- [ ] Every constraint from the spec is in the constraint table
- [ ] Every claim from the artifact is in the claim table
- [ ] Every constraint has at least one claim addressing it (or a
      completeness gap finding)
- [ ] Every unit comparison is dimensionally valid
- [ ] At least one rollup sum was re-derived and verified
- [ ] Margin summary table covers all constraints
- [ ] Sensitivity analysis was performed for all Violated and
      Marginal findings
- [ ] No fabricated re-derivations of simulation/measurement results
- [ ] Coverage matrix (constraints × claims) is complete
- [ ] Findings use quantitative-specific categories
