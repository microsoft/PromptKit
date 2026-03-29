<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: validate-simulation
description: >
  Review circuit simulation output (SPICE, power budget, thermal
  analysis) against specification constraints. Verifies simulation
  setup, extracts results, checks constraint compliance, assesses
  corner-case coverage, and evaluates model validity.
persona: electrical-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - analysis/simulation-validation
format: investigation-report
params:
  project_name: "Name of the project or board being validated"
  simulation_output: "The simulation results to review — SPICE output, waveform data, power budget table, thermal analysis report"
  simulation_setup: "Simulation configuration — schematic/netlist used, stimulus conditions, component models, measurement points"
  requirements_doc: "Hardware requirements document with quantitative constraints to validate against"
  datasheets: "Relevant component datasheets — especially regulator characteristics, thermal resistance, and operating limits"
  context: "Additional context — target operating environment, known design margins, areas of concern"
  audience: "Who will read the output — e.g., 'HW engineer before PCB order', 'design review board', 'test engineer planning validation'"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A simulation review report with findings covering setup issues,
    constraint violations, corner-case gaps, and model validity
    concerns. Includes simulation coverage summary.
---

# Task: Validate Simulation Results

You are tasked with performing a **systematic review** of circuit
simulation output against specification constraints.

## Inputs

**Project Name**: {{project_name}}

**Simulation Output**:
{{simulation_output}}

**Simulation Setup**:
{{simulation_setup}}

**Requirements Document**:
{{requirements_doc}}

**Datasheet Excerpts**:
{{datasheets}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the simulation-validation protocol** systematically.
   Execute all six phases in order. Do not skip phases — document
   phase coverage in the **Investigation Scope** section.

2. **Phase 1 (Setup Review) catches the most impactful issues.**
   A simulation with wrong stimulus conditions or missing models
   produces meaningless results. Verify setup before interpreting
   results.

3. **Cross-reference results to requirements.** For each constraint
   check in Phase 3, cite the REQ-ID from the requirements document.
   For datasheet limits, cite the datasheet section.

4. **Apply the anti-hallucination protocol** throughout:
   - Only assess results that are present in the provided simulation
     output — do NOT extrapolate to conditions that were not simulated
   - Do NOT fabricate simulation results or component parameters
   - If a component's SPICE model is not identified in the setup,
     flag it as a limitation — do not assume model quality
   - Distinguish between [KNOWN] (simulation output shows),
     [INFERRED] (derived from simulation patterns), and [ASSUMPTION]
     (depends on information not in the simulation)

5. **Format the output** according to the investigation-report format:
   - List all findings in a single **Findings** section ordered
     strictly by severity (Critical first)
   - For each finding, indicate the protocol phase under **Category**
     using phase number and title (e.g., "Phase 1 — Simulation Setup
     Review", "Phase 4 — Corner-Case Assessment")
   - Under **Location**, identify the specific component, net, or
     measurement point
   - Under **Evidence**, include the specific simulation values and
     the constraint they violate or the gap they expose

6. **Prioritize findings** by impact on design confidence:
   - **Critical**: Simulation shows constraint violation under nominal
     conditions — design change likely needed
   - **High**: Simulation shows marginal compliance or constraint
     violation under corner conditions — design risk
   - **Medium**: Simulation setup issue that may invalidate results —
     re-simulation needed before drawing conclusions
   - **Low**: Missing corner case or model concern that doesn't
     threaten compliance under simulated conditions
   - **Informational**: Observation about simulation quality or
     suggestion for additional analysis

7. **Apply the self-verification protocol** before finalizing:
   - Re-check at least 2 constraint compliance assessments against
     the provided simulation values
   - Verify the corner-case coverage assessment is complete
   - Confirm every phase is documented in the coverage summary

## Non-Goals

- Do NOT run simulations — this is a review of existing simulation
  output, not a simulation execution task
- Do NOT redesign the circuit — report findings with remediation
  suggestions (re-simulate vs. design change)
- Do NOT review the schematic itself — this validates simulation
  results, not schematic correctness (use `review-schematic` for that)
- Do NOT perform quantitative budget validation — this reviews
  simulation results for setup validity and coverage. For formal
  margin analysis of budget artifacts, use `validate-budget`

## Quality Checklist

Before finalizing, verify:

- [ ] All 6 protocol phases were executed and documented
- [ ] Simulation setup was verified before interpreting results
- [ ] Every specification constraint was mapped to a simulation result
      or flagged as a coverage gap
- [ ] Input voltage, load, and temperature corners were assessed
- [ ] Component model quality was evaluated for critical components
- [ ] Every finding cites specific simulation values and components
- [ ] Every finding has a severity and remediation type (re-simulate
      vs. design change vs. add coverage)
- [ ] Simulation coverage summary is complete
- [ ] No fabricated simulation results
