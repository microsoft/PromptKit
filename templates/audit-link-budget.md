<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-link-budget
description: >
  Audit a wireless link budget for transmitter chain, path loss model
  selection, receiver chain, margin adequacy, regulatory compliance,
  and sensitivity to environmental assumptions.
persona: rf-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - analysis/link-budget-audit
format: investigation-report
params:
  project_name: "Name of the wireless system or link being analyzed"
  link_budget: "The link budget to audit — table or calculation showing TX power, losses, gains, path loss, sensitivity, and margin"
  requirements_doc: "System requirements with range, data rate, reliability, and regulatory constraints"
  deployment_environment: "Description of the deployment environment — indoor/outdoor, urban/rural, obstructions, antenna mounting, enclosure"
  regulatory_region: "Target regulatory region and band — e.g., 'FCC Part 15.247, 915 MHz ISM' or 'ETSI EN 300 220, 868 MHz'"
  context: "Additional context — transceiver datasheet, antenna datasheet, known constraints"
  audience: "Who will read the output — e.g., 'RF engineer validating the design', 'system architect assessing range feasibility'"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A link budget audit report with findings covering parameter
    accuracy, path loss model validity, margin adequacy, regulatory
    compliance, and sensitivity to environmental assumptions.
---

# Task: Audit Link Budget

You are tasked with performing a **systematic audit** of a wireless
link budget against system requirements and regulatory constraints.

## Inputs

**Project Name**: {{project_name}}

**Link Budget**:
{{link_budget}}

**Requirements Document**:
{{requirements_doc}}

**Deployment Environment**:
{{deployment_environment}}

**Regulatory Region**: {{regulatory_region}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the link-budget-audit protocol** systematically. Execute
   all seven phases in order. Document phase coverage in the
   **Investigation Scope** section.

2. **Phase 3 (Path Loss Model) is where most errors hide.** Spend
   the most effort here — an optimistic path loss model invalidates
   the entire budget.

3. **All calculations in dB.** Verify every term uses consistent
   units: dBm for absolute power, dBi for antenna gain, dB for
   losses. Flag any unit mixing (e.g., watts and dBm in the same
   calculation).

4. **Apply the anti-hallucination protocol** throughout:
   - Only use propagation parameters you can evidence from the
     provided inputs or well-established references
   - Do NOT fabricate receiver sensitivity values or antenna gains
   - If a datasheet is not provided for a component, flag it as
     a limitation
   - Distinguish between [KNOWN] (datasheet/spec), [INFERRED]
     (standard practice), and [ASSUMPTION] (depends on deployment)

5. **Format the output** according to the investigation-report format:
   - List all findings ordered strictly by severity (Critical first)
   - For each finding, indicate the protocol phase under **Category**
     using phase number and title (e.g., "Phase 3: Path Loss Model
     Assessment", "Phase 6: Regulatory Compliance Check")
   - Under **Evidence**, include the specific calculation or
     parameter value in question

6. **Prioritize findings** by link reliability impact:
   - **Critical**: Link will not close (negative margin, EIRP
     exceeds regulatory limit, wrong frequency band)
   - **High**: Link margin is inadequate for the environment
     (margin < required fade margin, optimistic path loss model)
   - **Medium**: Parameter accuracy concern that may reduce margin
     (unverified antenna gain, missing implementation loss,
     sensitivity at room temperature only)
   - **Low**: Best practice suggestion (add margin for future
     growth, consider interference scenario)
   - **Informational**: Observation (excessive margin suggesting
     power could be reduced to save battery)

7. **Apply the self-verification protocol** before finalizing:
   - Re-derive the EIRP calculation independently
   - Re-derive the path loss at target range independently
   - Verify the margin calculation independently
   - Confirm regulatory limits are correct for the stated band
     and region

## Non-Goals

- Do NOT perform electromagnetic simulation — this is analytical
  review of link budget calculations
- Do NOT design the RF system — report findings with suggestions,
  not a revised link budget
- Do NOT review schematic or PCB layout — this is link-level
  analysis only
- Do NOT verify spurious emission compliance — that requires
  measurement, not analysis

## Quality Checklist

Before finalizing, verify:

- [ ] All 7 protocol phases were executed and documented
- [ ] System parameters (frequency, modulation, data rate) verified
- [ ] TX chain traced from IC to antenna with all losses
- [ ] Path loss model is justified for the deployment environment
- [ ] RX chain traced from antenna to baseband with all losses
- [ ] Margin is computed and classified against requirements
- [ ] EIRP checked against regulatory limit
- [ ] Sensitivity analysis for marginal links (margin < 6 dB)
- [ ] All calculations use consistent dB units
- [ ] No fabricated datasheet values
