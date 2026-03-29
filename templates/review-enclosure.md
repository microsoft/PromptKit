<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: review-enclosure
description: >
  Audit an enclosure design for an electronic assembly. Reviews PCB
  fit, environmental protection, thermal management, antenna
  compatibility, sensor access, manufacturing feasibility, and
  mounting provisions.
persona: mechanical-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - analysis/enclosure-design-review
format: investigation-report
params:
  project_name: "Name of the project or product being reviewed"
  enclosure_design: "The enclosure design to review — dimensions, material, wall thickness, features, cross-section description, or CAD export notes"
  pcb_specs: "PCB specifications — board dimensions, mounting hole positions, component heights, connector locations, antenna keepout zone"
  requirements_doc: "Product requirements with environmental protection, deployment conditions, and mounting needs"
  manufacturing_process: "Target manufacturing process — e.g., 'FDM 3D printing, ASA, 0.2mm layer height' or 'injection molding, ABS'"
  context: "Additional context — deployment environment, sensor types, regulatory requirements, enclosure constraints"
  audience: "Who will read the output — e.g., 'mechanical designer before printing prototype', 'design review team', 'manufacturing engineer'"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    An enclosure review report with findings covering PCB fit,
    environmental protection, thermal management, RF compatibility,
    sensor access, manufacturing feasibility, and mounting.
---

# Task: Review Enclosure Design

You are tasked with performing a **systematic enclosure design review**
for an electronic assembly.

## Inputs

**Project Name**: {{project_name}}

**Enclosure Design**:
{{enclosure_design}}

**PCB Specifications**:
{{pcb_specs}}

**Requirements Document**:
{{requirements_doc}}

**Manufacturing Process**: {{manufacturing_process}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the enclosure-design-review protocol** systematically.
   Execute all seven phases in order. Document phase coverage in the
   **Investigation Scope** section.

2. **Cross-domain verification is critical.** This review sits at
   the intersection of mechanical, electrical, and RF engineering.
   Specifically verify:
   - Antenna keepout zone is preserved (RF concern in ME design)
   - Thermal dissipation path exists for hot components (EE concern
     in ME design)
   - Sensor access doesn't compromise environmental protection
     (conflicting requirements)

3. **Apply the anti-hallucination protocol** throughout:
   - Only assess features described in the provided enclosure design
   - Do NOT assume dimensions, materials, or features that are not
     stated
   - If the enclosure design is a text description rather than CAD
     data, flag limitations on what can and cannot be verified
   - Distinguish between [KNOWN], [INFERRED], and [ASSUMPTION]

4. **Format the output** according to the investigation-report format:
   - List all findings ordered strictly by severity (Critical first)
   - For each finding, indicate the protocol phase under **Category**
     using phase number and title (e.g., "Phase 1: PCB Fit and
     Clearance Verification", "Phase 4: Antenna and RF Compatibility")
   - Under **Location**, identify the specific enclosure feature,
     dimension, or area

5. **Prioritize findings** by deployment reliability impact:
   - **Critical**: Device will not fit, will overheat, or will fail
     environmentally (PCB doesn't fit, sealed enclosure exceeds
     thermal limits, antenna blocked by enclosure material)
   - **High**: Reliability risk in deployment (inadequate IP rating,
     UV-unstable material for outdoor use, no condensation strategy)
   - **Medium**: Design doesn't follow best practices but may work
     (marginal clearances, non-optimal print orientation, missing
     strain relief)
   - **Low**: Minor issue or improvement opportunity (no labeling
     provisions, assembly could be easier)
   - **Informational**: Observation or suggestion

6. **Apply the self-verification protocol** before finalizing:
   - Re-read at least 3 findings and verify that cited dimensions,
     materials, or features match the provided enclosure design and
     PCB specs
   - Verify PCB dimensions match enclosure cavity
   - Verify antenna keepout assessment (if applicable)
   - Verify material is appropriate for deployment environment
   - Confirm every phase is documented

## Non-Goals

- Do NOT design the enclosure — report findings with suggestions,
  not a revised CAD model
- Do NOT review the PCB design itself — this reviews the enclosure
  against the PCB specs
- Do NOT perform thermal simulation — this is analytical review
  based on component power dissipation and enclosure geometry
- Do NOT evaluate structural strength under mechanical loads (drop
  test, vibration) unless specified in the requirements

## Quality Checklist

Before finalizing, verify:

- [ ] All 7 protocol phases were executed and documented
- [ ] PCB fit verified (dimensions, mounting holes, component heights)
- [ ] Every external connector has enclosure access verified
- [ ] Environmental protection assessed for deployment conditions
- [ ] Thermal path from hot components to ambient evaluated
- [ ] Antenna compatibility verified (material, keepout, orientation)
- [ ] Sensor access verified — ventilation, probe pass-throughs, and
      conflicting requirements assessed (if applicable)
- [ ] Manufacturing feasibility checked for target process
- [ ] Mounting provisions assessed for deployment scenario
- [ ] Every finding cites specific dimensions, features, or materials
- [ ] No fabricated enclosure specifications
