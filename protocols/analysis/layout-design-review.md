<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: layout-design-review
type: analysis
description: >
  Systematic PCB layout review protocol. Audits layout decisions and
  DRC output against schematic intent and requirements. Covers trace
  widths, impedance control, ground plane integrity, component
  placement, thermal design, and manufacturing constraints.
applicable_to:
  - review-layout
---

# Protocol: Layout Design Review

Apply this protocol when reviewing a PCB layout (KiCad .kicad_pcb,
DRC reports, or layout description) against the schematic intent and
requirements. Execute all phases in order.

## Phase 1: DRC Report Review

If DRC output is provided, review it first.

1. **Violations vs. warnings**: Classify each DRC item:
   - Violations (errors) → must be resolved before manufacturing
   - Warnings → assess whether each is acceptable or needs fixing

2. **For each violation**, assess:
   - Is it a real design error or a DRC rule misconfiguration?
   - What is the impact if it goes to manufacturing unfixed?

3. **DRC rule coverage**: Are the DRC rules appropriate for the
   target fabrication house? (e.g., JLCPCB minimum trace width
   vs. OSH Park minimum trace width)

## Phase 2: Trace Width and Current Capacity

Verify that trace widths are adequate for the current they carry.

1. **Power traces**: For every trace carrying power (VIN, VBAT, 3V3,
   5V, VBUS):
   - Calculate required trace width for the worst-case current using
     IPC-2221 or equivalent (accounting for copper weight, temperature
     rise, and layer)
   - Compare to actual trace width
   - Flag undersized traces

2. **Signal traces**: Verify signal traces meet minimum width for
   the fabrication house's capabilities.

3. **Ground connections**: Verify ground traces/vias are adequate
   for return current paths, especially for high-current loads.

## Phase 3: Impedance and Signal Integrity

For high-speed or impedance-sensitive signals, verify routing.

1. **USB differential pairs**: D+ and D- should be:
   - Routed as a tightly coupled differential pair
   - Length-matched within the spec's tolerance
   - Target impedance documented (90Ω for USB 2.0 full-speed)
   - Reference plane continuous under the pair

2. **Other controlled-impedance traces**: If the design requires
   controlled impedance (RF, Ethernet, high-speed SPI), verify
   the stackup and trace geometry support the target impedance.

3. **Return path continuity**: For signals crossing between layers,
   verify via placement provides a return current path near the
   signal via. Slots or gaps in the ground plane under signal
   traces are findings.

## Phase 4: Component Placement Review

Verify placement follows design intent and best practices.

1. **Decoupling capacitor placement**: For each IC:
   - Is the decoupling cap within 3mm of the power pin?
   - Is the via to ground close to the cap (not routed through a
     long trace)?
   - **Layout carry-forward from schematic review**: verify all
     schematic-flagged placement constraints are satisfied

2. **Antenna keepout**: If the design has an antenna (PCB antenna,
   U.FL connector):
   - Verify no copper (traces, pours, components) in the keepout zone
   - Verify ground plane clearance per the module datasheet

3. **Connector placement**: Verify connectors are accessible from
   board edges and oriented correctly for the enclosure (if specified).

4. **Thermal placement**: Components with significant power dissipation
   should have adequate thermal relief:
   - Thermal vias under exposed pads
   - Copper pour for heat spreading where needed
   - Not placed adjacent to temperature-sensitive components

## Phase 5: Ground Plane and Power Integrity

Verify the ground and power plane design.

1. **Ground plane continuity**: The ground plane should be continuous
   under signal routing areas:
   - Flag slots, cutouts, or narrow necks in the ground plane
   - Especially critical under high-speed signals and near connectors

2. **Power plane/pour integrity**: Power pours should provide low-
   impedance paths from regulator output to loads:
   - Flag narrow necks or long routing paths in power pours
   - Verify power pour connections are adequate (multiple vias, not
     single thin trace)

3. **Star grounding / ground domains**: If the design has separate
   analog and digital ground domains, verify they are properly
   separated and joined at a single point.

## Phase 6: Manufacturing Constraint Compliance

Verify the layout meets the target fabrication house's capabilities.

1. **Minimum features**: Verify all features meet the fab's minimums:
   - Trace width and spacing
   - Via drill and annular ring
   - Solder mask dam between pads
   - Silkscreen line width and clearance from pads

2. **Board outline**: Verify board dimensions, corner radii, and
   cutouts are within fab capabilities.

3. **Panelization**: If the design will be panelized, verify
   sufficient edge clearance for V-scoring or tab routing.

4. **Assembly constraints**: For SMT assembly:
   - Component orientation consistent (pin 1 indicators, polarity)
   - Adequate spacing between components for pick-and-place
   - Fiducial markers present if required by the assembly house

## Phase 7: Findings Summary

Compile findings from all phases.

1. **For each finding**, document:
   - Phase that discovered it (use exact phase label, e.g.,
     "Phase 2: Trace Width and Current Capacity")
   - Affected component(s), trace(s), or board area
   - Severity (Critical / High / Medium / Low / Informational)
   - Remediation: layout fix required vs. acceptable with
     justification vs. DRC rule adjustment needed

2. **Produce a layout review coverage summary**:
   - DRC items reviewed / total
   - Power traces checked / total power nets
   - Controlled impedance signals verified / total
   - Manufacturing constraints checked against target fab
