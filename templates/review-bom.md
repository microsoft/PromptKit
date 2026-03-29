<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: review-bom
description: >
  Audit a bill of materials against the schematic and requirements.
  Checks part number correctness, voltage and temperature ratings,
  package matches, cost compliance, sourcing risks, and completeness.
persona: electrical-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - analysis/bom-consistency
format: investigation-report
params:
  project_name: "Name of the project or board being reviewed"
  bom_content: "The BOM to review — CSV, spreadsheet export, or text table with reference designators, values, part numbers, and quantities"
  schematic_content: "The schematic or netlist for cross-referencing — component list with reference designators, values, and footprints"
  requirements_doc: "Hardware requirements document with cost targets, temperature range, and manufacturing constraints"
  context: "Additional context — target assembly house, order quantity for pricing, known sourcing constraints"
  audience: "Who will read the output — e.g., 'procurement engineer ordering parts', 'design engineer before prototype', 'manufacturing team'"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A BOM review report with findings covering cross-reference
    mismatches, rating violations, sourcing risks, cost compliance,
    and completeness issues.
---

# Task: Review Bill of Materials

You are tasked with performing a **systematic BOM review** against
the schematic and requirements.

## Inputs

**Project Name**: {{project_name}}

**Bill of Materials**:
{{bom_content}}

**Schematic / Component List**:
{{schematic_content}}

**Requirements Document**:
{{requirements_doc}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the bom-consistency protocol** systematically. Execute all
   six phases in order. Document phase coverage in the **Investigation
   Scope** section.

2. **Phase 1 (Cross-Reference) is the foundation.** A BOM that
   doesn't match the schematic is useless — verify every designator
   before checking ratings or cost.

3. **Apply the anti-hallucination protocol** throughout:
   - Only flag rating issues you can evidence from the provided BOM
     data and requirements
   - Do NOT assume component ratings that are not stated — if a
     voltage rating is missing from the BOM, flag it as incomplete,
     don't guess
   - Distinguish between [KNOWN], [INFERRED], and [ASSUMPTION]

4. **Format the output** according to the investigation-report format:
   - List all findings ordered strictly by severity (Critical first)
   - For each finding, indicate the protocol phase under **Category**
     using phase number and title (e.g., "Phase 1: BOM-to-Schematic
     Cross-Reference", "Phase 3: Rating and Derating Verification")
   - Under **Location**, identify the specific reference designator(s)
     and BOM row(s)

5. **Prioritize findings** by manufacturing impact:
   - **Critical**: Wrong part will be ordered or placed (MPN mismatch,
     missing BOM row for schematic component)
   - **High**: Part may fail in operation (voltage/temperature rating
     insufficient, current rating marginal)
   - **Medium**: Sourcing risk or cost overrun (single-source, NRND
     status, cost target exceeded)
   - **Low**: BOM quality issue (missing fields, placeholder values,
     estimated pricing)
   - **Informational**: Suggestion or observation

6. **Apply the self-verification protocol** before finalizing:
   - Randomly re-check at least 3 BOM-to-schematic cross-references
   - Verify the cost total arithmetic
   - Confirm every phase is documented

## Non-Goals

- Do NOT review the schematic design itself — this validates the BOM
  against the schematic, not schematic correctness
- Do NOT review PCB layout — this is BOM-level analysis
- Do NOT contact suppliers or check real-time inventory — use the
  data provided in the BOM

## Quality Checklist

Before finalizing, verify:

- [ ] All 6 protocol phases were executed and documented
- [ ] Every schematic component has a BOM cross-reference (or finding)
- [ ] Every BOM row has a schematic cross-reference (or finding)
- [ ] Voltage ratings were checked for all capacitors and semiconductors
- [ ] Temperature ratings were checked against requirements
- [ ] Cost total was calculated and compared to target (if specified)
- [ ] Placeholder values (TBD, TBA) are flagged
- [ ] No fabricated component data
