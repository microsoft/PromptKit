<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: review-schematic
description: >
  Audit a schematic or netlist against requirements and component
  datasheets. Systematically checks power architecture, pin-level
  correctness, bus integrity, protection circuits, power sequencing,
  passive components, and completeness.
persona: electrical-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - analysis/schematic-compliance-audit
format: investigation-report
params:
  project_name: "Name of the project or board being reviewed"
  schematic_content: "The schematic or netlist to review — KiCad netlist, SPICE netlist, or text-based schematic description"
  requirements_doc: "Hardware requirements document to audit against (REQ-IDs for traceability)"
  datasheets: "Relevant IC datasheet excerpts — pin descriptions, absolute maximum ratings, recommended circuits, power sequencing requirements"
  context: "Additional context — target environment, operating conditions, manufacturing constraints, known design decisions"
  audience: "Who will read the output — e.g., 'PCB designer before layout', 'peer EE for review', 'manufacturing engineer for DFM'"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A schematic review report with findings covering power delivery,
    pin-level issues, bus integrity, protection gaps, and completeness
    problems. Each finding includes severity, affected components,
    and remediation.
---

# Task: Review Schematic

You are tasked with performing a **systematic schematic review** of the
provided netlist or schematic against the requirements and component
datasheets.

## Inputs

**Project Name**: {{project_name}}

**Schematic / Netlist**:
{{schematic_content}}

**Requirements Document**:
{{requirements_doc}}

**Datasheet Excerpts**:
{{datasheets}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the schematic-compliance-audit protocol** systematically.
   Execute all seven phases in order. Do not skip phases — even if a
   phase produces no findings, document that it was checked.

2. **Cross-reference findings to requirements.** When a finding
   relates to a specific requirement (e.g., "HW-0102: Voltage
   regulator"), cite the REQ-ID. When a finding is a general
   electrical engineering best practice violation (e.g., missing
   decoupling), cite the relevant datasheet recommendation instead.

3. **Apply the anti-hallucination protocol** throughout:
   - Only report findings you can evidence from the provided
     schematic/netlist and datasheets
   - Do NOT assume component values or pin functions that are not
     stated in the provided materials
   - If a datasheet excerpt is missing for a component, flag it as
     a limitation — do not fabricate datasheet values
   - Distinguish between [KNOWN] (stated in schematic or datasheet),
     [INFERRED] (derived from standard practice), and [ASSUMPTION]
     (depends on information not provided)

4. **Format the output** according to the investigation-report format:
   - List all findings in a single **Findings** section ordered strictly
     by severity across the entire report (Critical, then High, Medium,
     Low, Informational)
   - For each finding, indicate the protocol phase that discovered it
     (under **Category**: Power Architecture / Pin-Level / Bus
     Integrity / Protection / Sequencing / Passives / Completeness)
   - For each finding, include the affected component reference
     designators (U1, R3, C5, etc.) under **Location**

5. **Prioritize findings** by impact on board functionality:
   - **Critical**: Board will not function (missing power connection,
     voltage domain violation, bus contention)
   - **High**: Board may function but with reliability risk (missing
     ESD protection on external connector, insufficient decoupling,
     marginal power budget)
   - **Medium**: Design does not follow best practices but may work
     (non-optimal pull-up values, missing test points, strap pin
     depends on typical timing)
   - **Low**: Minor issue or documentation gap (placeholder values,
     missing silkscreen labels)
   - **Informational**: Observation or suggestion, no correctness
     impact

6. **Apply the self-verification protocol** before finalizing:
   - Re-read at least 3 findings and verify the cited schematic
     evidence is correct
   - Verify every IC's pin count matches between the schematic and
     your pin-level audit
   - Confirm the power budget arithmetic is correct
   - Check that all phases are accounted for in the findings or
     documented as "no findings"

## Non-Goals

- Do NOT perform a full PCB layout review — this is schematic-level
  analysis. However, note layout-critical constraints (differential
  routing, ESD placement, decoupling proximity) as carry-forward
  items for layout review.
- Do NOT evaluate component sourcing or cost — this is electrical
  correctness only
- Do NOT perform circuit simulation — this is static analysis of
  the netlist
- Do NOT redesign the circuit — report findings with remediation
  suggestions, but do not produce a revised schematic

## Quality Checklist

Before finalizing, verify:

- [ ] All 7 protocol phases were executed and documented
- [ ] Every power rail is accounted for in Phase 1
- [ ] Every IC has a pin-level audit in Phase 2
- [ ] Every communication bus has a bus integrity check in Phase 3
- [ ] Every external connector has ESD protection verified in Phase 4
- [ ] Power sequencing requirements are verified in Phase 5
- [ ] No component has placeholder values (R?, C?, TBD) without a
      finding in Phase 6
- [ ] Unconnected nets are accounted for in Phase 7
- [ ] Every finding cites specific components and net names
- [ ] Every finding has a severity and remediation recommendation
- [ ] Power budget arithmetic is verifiable
- [ ] No fabricated datasheet values — missing data flagged as
      limitations
