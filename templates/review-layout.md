<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: review-layout
description: >
  Audit a PCB layout against schematic intent and requirements.
  Reviews DRC output, trace widths, impedance control, ground plane
  integrity, component placement, thermal design, and manufacturing
  constraints.
persona: electrical-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - analysis/layout-design-review
format: investigation-report
params:
  project_name: "Name of the project or board being reviewed"
  layout_content: "The layout to review — DRC report, layer stackup description, trace width summary, component placement description, or text-based layout data"
  schematic_content: "The schematic or netlist for cross-referencing intent — net names, component list, and any carry-forward layout constraints from schematic review"
  requirements_doc: "Hardware requirements document with board dimensions, manufacturing constraints, and design rules"
  fab_constraints: "Target fabrication house capabilities — minimum trace width, via size, layer count, material"
  context: "Additional context — controlled impedance requirements, thermal concerns, enclosure constraints"
  audience: "Who will read the output — e.g., 'layout engineer before Gerber export', 'design review board', 'fab house for DFM feedback'"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A layout review report with findings covering DRC violations,
    trace sizing, impedance issues, placement concerns, ground
    plane problems, and manufacturing constraint violations.
---

# Task: Review PCB Layout

You are tasked with performing a **systematic PCB layout review**
against the schematic intent and requirements.

## Inputs

**Project Name**: {{project_name}}

**Layout Data**:
{{layout_content}}

**Schematic / Netlist**:
{{schematic_content}}

**Requirements Document**:
{{requirements_doc}}

**Fabrication House Constraints**:
{{fab_constraints}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the layout-design-review protocol** systematically. Execute
   all seven phases in order. Document phase coverage in the
   **Investigation Scope** section.

2. **Phase 1 (DRC Report Review) first, if DRC output is provided.**
   DRC violations are the highest-priority items — resolve or assess
   these before deeper analysis.

3. **Pick up schematic review carry-forwards.** If a schematic review
   was performed previously, check that all layout carry-forward items
   (differential routing, ESD placement, decoupling proximity) are
   satisfied.

4. **Apply the anti-hallucination protocol** throughout:
   - Only flag issues you can evidence from the provided layout data
   - Do NOT assume trace widths, via sizes, or stackup parameters
     that are not stated
   - If layout data is provided as text description rather than actual
     PCB files, flag limitations on what can and cannot be verified
   - Distinguish between [KNOWN], [INFERRED], and [ASSUMPTION]

5. **Format the output** according to the investigation-report format:
   - List all findings ordered strictly by severity (Critical first)
   - For each finding, indicate the protocol phase under **Category**
     using phase number and title (e.g., "Phase 2: Trace Width and
     Current Capacity", "Phase 5: Ground Plane and Power Integrity")
   - Under **Location**, identify the specific trace, component, net,
     or board area

6. **Prioritize findings** by manufacturing and reliability impact:
   - **Critical**: Board will not function or cannot be manufactured
     (DRC violation, trace too narrow for current, antenna keepout
     violated)
   - **High**: Reliability risk (marginal trace width, missing thermal
     vias, ground plane gap under high-speed signal)
   - **Medium**: Best practice violation that may work but is risky
     (decoupling cap far from pin, controlled impedance not verified)
   - **Low**: Minor issue or DFM suggestion (silkscreen overlap,
     fiducial placement)
   - **Informational**: Observation or optimization opportunity

7. **Apply the self-verification protocol** before finalizing:
   - Randomly re-check at least 3 trace width assessments
   - Verify antenna keepout assessment (if applicable)
   - Confirm every phase is documented

## Non-Goals

- Do NOT review the schematic — this validates layout against
  schematic intent, not schematic correctness
- Do NOT review the BOM — this is layout-level analysis
- Do NOT generate Gerber files or modify the layout — report findings
  with remediation guidance
- Do NOT perform electromagnetic simulation — this is visual/rule-based
  layout review, not simulation

## Quality Checklist

Before finalizing, verify:

- [ ] All 7 protocol phases were executed and documented
- [ ] DRC violations were reviewed (if DRC output provided)
- [ ] Every power trace was checked for current capacity
- [ ] Controlled impedance signals were verified (if applicable)
- [ ] Antenna keepout was verified (if applicable)
- [ ] Ground plane continuity was assessed
- [ ] Manufacturing constraints were checked against target fab
- [ ] Schematic review carry-forwards were verified (if available)
- [ ] Every finding cites specific traces, components, or board areas
- [ ] No fabricated layout data
