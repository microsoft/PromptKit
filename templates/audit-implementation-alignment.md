<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-implementation-alignment
description: >
  Adversarial audit of implementation patches against specification
  deltas.  Verifies that implementation and verification changes
  correctly realize the specification changes, with no drift,
  omissions, or undocumented behavior.  Domain-agnostic.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/adversarial-falsification
  - guardrails/operational-constraints
  - reasoning/code-compliance-audit
  - reasoning/test-compliance-audit
taxonomies:
  - specification-drift
format: investigation-report
params:
  project_name: "Name of the project, product, or system"
  spec_patch: "The structured specification patch (design + validation changes)"
  implementation_patch: "The structured implementation patch (code/artifact + verification changes)"
  existing_artifacts: "Existing implementation and verification artifacts for context"
input_contract:
  type: structured-patch
  description: >
    Structured patches for specifications and implementation, to be
    audited for alignment.
output_contract:
  type: investigation-report
  description: >
    An adversarial audit report classifying alignment findings using
    the specification-drift taxonomy (D8–D13), with severity ratings
    and remediation recommendations.
---

# Task: Adversarial Audit of Implementation Alignment

You are tasked with performing an **adversarial audit** of the
implementation patches against the specification deltas.  Your goal
is to find every way the implementation might NOT correctly realize
the specification changes.

**Your default stance is skepticism.**  Assume every implementation
change is wrong until you can prove it matches the specification.

## Inputs

**Project**: {{project_name}}

**Specification Patch**:
{{spec_patch}}

**Implementation Patch**:
{{implementation_patch}}

**Existing Artifacts (for context)**:
{{existing_artifacts}}

## Instructions

### Step 1 — Audit Implementation Against Design Changes

Apply the **code-compliance-audit protocol**:

1. **Forward traceability** — every design change MUST have a
   corresponding implementation change.  Flag gaps as D8
   (unimplemented requirement).
2. **Backward traceability** — every implementation change MUST
   trace to a design change.  Flag undocumented behavior as D9.
3. **Constraint verification** — verify implementation does not
   violate any stated constraint.  Flag violations as D10.
4. Apply **operational-constraints** — focus on the behavioral
   surface (APIs, interfaces, entry points) first, then trace
   inward for verification.

### Step 2 — Audit Verification Against Validation Changes

Apply the **test-compliance-audit protocol**:

1. **Forward traceability** — every validation change MUST have a
   corresponding verification change (test, simulation, inspection).
   Flag gaps as D11 (unimplemented test case).
2. **Acceptance criteria coverage** — verify verification artifacts
   exercise ALL acceptance criteria from the validation changes.
   Flag gaps as D12 (untested acceptance criterion).
3. **Assertion accuracy** — verify verification artifacts assert the
   correct conditions and thresholds.  Flag mismatches as D13
   (assertion mismatch).

### Step 3 — Cross-Cutting Checks

1. **Implementation-verification consistency** — does the
   verification actually test the implementation change, or does
   it test something else?
2. **Invariant preservation** — are all existing invariants and
   contracts maintained by the implementation changes?
3. **Side effects** — does the implementation change introduce
   behavior not covered by any specification change?

### Step 4 — Adversarial Falsification

Apply the **adversarial-falsification protocol**:

1. For each finding candidate, attempt to **disprove it**.
2. For each "no issues found" area, attempt to **find an issue**.
3. Rate confidence: High / Medium / Low with justification.

### Step 5 — Report

Produce an investigation report with:

1. **Executive Summary** — overall implementation alignment
   assessment with key findings.
2. **Findings** — each classified with D8–D13 label, severity,
   evidence (specific locations in both spec and implementation
   patches), and remediation.
3. **Recommendations** — prioritized fixes.
4. **Verdict** — one of:
   - **PASS** — implementation faithfully realizes the specification
     changes, proceed to user review
   - **REVISE-IMPLEMENTATION** — implementation issues found, loop
     back to regenerate implementation patches
   - **REVISE-SPEC** — specification issues discovered during
     implementation audit, loop back to fix specifications
   - **RESTART** — fundamental misalignment, loop back to
     requirements discovery

## Non-Goals

- Do NOT evaluate code quality, style, or performance beyond what
  the specification requires.
- Do NOT suggest improvements unrelated to spec alignment.
- Do NOT rewrite the patches — only identify issues and recommend fixes.

## Quality Checklist

- [ ] Every finding has a D8–D13 classification
- [ ] Every finding has specific evidence from both spec and
  implementation patches
- [ ] Every finding has a concrete remediation
- [ ] Adversarial falsification was applied
- [ ] All specification changes accounted for in implementation
- [ ] All validation changes accounted for in verification
- [ ] Verdict clearly states PASS, REVISE-IMPLEMENTATION,
  REVISE-SPEC, or RESTART
