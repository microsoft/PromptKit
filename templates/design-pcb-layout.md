<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: design-pcb-layout
mode: interactive
description: >
  Interactive PCB layout session. Guides the user from a completed
  schematic through layout requirements, component placement, automated
  routing, and DRC validation. Composes pcb-layout-design and
  layout-design-review protocols with user review gates. Handles
  the schematic-to-layout feedback loop when layout constraints
  force schematic revisions.
persona: electrical-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/pcb-layout-design
  - analysis/layout-design-review
format: null
params:
  project_name: "Name of the hardware project or product"
  schematic_path: "Path to the KiCad schematic file (.kicad_sch)"
  board_path: "Path to the KiCad board file (.kicad_pcb), populated via Update PCB from Schematic"
  context: "Additional context — target fab service, board size constraints, enclosure fit, layer count preference, special routing requirements"
input_contract:
  type: artifact-set
  description: >
    A completed KiCad schematic file (.kicad_sch) with footprint
    assignments and a corresponding .kicad_pcb file populated via
    'Update PCB from Schematic'. Optionally, a component selection
    report from the design-schematic template.
output_contract:
  type: artifact-set
  description: >
    A routed, DRC-clean KiCad PCB file (.kicad_pcb), the Python
    layout script (for reproducibility), a DRC report, and a layout
    audit report. If schematic revisions were required, an updated
    schematic is included.
---

# Task: Interactive PCB Layout Design

You are tasked with guiding the user through a **complete PCB layout
session** — from gathering layout requirements through component
placement, automated routing, and DRC validation to a routed,
DRC-clean board.

This is a multi-phase, interactive workflow with a feedback loop:
layout constraints may force schematic revisions, which feed back
into the layout.

## Inputs

**Project**: {{project_name}}

**Schematic**: {{schematic_path}}

**Board**: {{board_path}}

**Additional Context**:
{{context}}

---

## Workflow Overview

```
Phase 1: Input Validation (pcb-layout-design protocol Phase 1)
    ↓
Phase 2: Layout Requirements Gathering (interactive)
    ↓
Phase 3: Board Definition and Design Rules
    ↓
Phase 4: Component Placement (generates Python script)
    ↓
Phase 5: User Review of Placement
    ↓ ← loop back to Phase 4 if REVISE
Phase 6: Routing and DRC Loop (FreeRouting + kicad-cli DRC)
    ↓
Phase 7: Layout Audit (layout-design-review protocol)
    ↓
Phase 8: User Review of Layout
    ↓ ← loop back to Phase 4, 6, or SCHEMATIC FEEDBACK
Phase 9: Deliver Artifacts
```

---

## Phase 1 — Input Validation

**Goal**: Verify all prerequisites before beginning layout design.

Apply the **pcb-layout-design protocol Phase 1** (Input Validation):

1. **Schematic completeness**: Verify all components have footprint
   assignments, all nets are named, and ERC passes.
2. **Component footprint inventory**: For each component, confirm
   the assigned footprint, physical dimensions, mounting type
   (SMD/through-hole), and any placement requirements from the
   schematic (layout carry-forward notes).
3. **Board file**: Verify the `.kicad_pcb` contains footprints and
   nets from the schematic (user must have run "Update PCB from
   Schematic").
4. **Design constraints from upstream**: Extract power dissipation,
   high-speed signals, RF clearance requirements, and current-
   carrying trace needs.
5. **Target fab service**: Confirm fab house and design rule
   minimums.

### Transition Rules

- **All prerequisites met**: Proceed to Phase 2.
- **Missing prerequisites**: Stop and inform the user what needs
  to be fixed (e.g., "Run Update PCB from Schematic first",
  "Assign footprints to U3 and U5").

---

## Phase 2 — Layout Requirements Gathering

**Goal**: Gather the user's spatial, mechanical, and manufacturing
requirements before any layout decisions.

Apply the **pcb-layout-design protocol Phase 2** (Layout Requirements
Gathering) in full:

1. **Board form factor**: Ask about dimensions, shape, mounting
   method, and mounting hole locations.
2. **Connector placement**: For each connector — which edge,
   position along the edge, orientation.
3. **Component placement preferences**: MCU position, battery
   connector, antenna keepout, display/LED placement, programming
   header accessibility, top vs. bottom side preferences.
4. **Mechanical constraints**: Enclosure fit, height clearance,
   keep-out zones, cable routing clearances.
5. **Fabrication service**: Confirm JLCPCB, PCBWay, or other,
   and their design rule minimums.

### Critical Rule

**Do NOT proceed to Phase 3 until the user explicitly confirms the
layout requirements** (e.g., "READY", "proceed", "looks good").

### Output

A layout requirements summary table for user confirmation.

---

## Phase 3 — Board Definition and Design Rules

**Goal**: Define the board structure and configure design rules.

Apply the **pcb-layout-design protocol Phases 3–4**:

1. **Board outline** on Edge.Cuts (dimensions, corner radii,
   cutouts).
2. **Layer stackup** (2-layer or 4-layer with layer assignments).
3. **Mounting holes** at user-specified locations.
4. **Copper zones** (ground pour, power pours, antenna keepout).
5. **Design rules**: Default trace width, clearance, via size per
   fab house minimums.
6. **Net classes**: Power (wider traces), High-Speed (impedance
   controlled), Default (standard signals).

### Output

Board definition specification and design rule configuration.

---

## Phase 4 — Component Placement

**Goal**: Place all components following the user's requirements
and engineering best practices.

Apply the **pcb-layout-design protocol Phases 5–7**:

1. **Placement priority**: Fixed-position components first
   (connectors, mounting holes, antenna), then MCU, power section,
   high-speed peripherals, remaining ICs, decoupling caps,
   passives.
2. **Generate the Python script** using the pcbnew API:
   - Load the `.kicad_pcb` (with footprints from schematic)
   - Apply board outline, design rules, net classes
   - Place components per the specification
   - Export `.dsn` for FreeRouting
3. **Placement verification**: Before routing, check that signal
   flow is logical, power flows from source to loads, high-speed
   signals have short paths, and no courtyards overlap.

### Output

- Python layout script (with configuration section at top for
  user adjustment)
- Placement specification (component positions and rationale)

---

## Phase 5 — User Review of Placement

**Goal**: Get user approval of component placement before investing
in routing.

1. Present the placement plan (component positions, grouping
   rationale).
2. Present any placement tradeoffs (e.g., "moved sensor to back
   side to fit board dimensions").
3. Ask: "Do you approve this placement, or do you want to adjust
   component positions?"

### Transition Rules

- **Approved**: Proceed to Phase 6.
- **Revise**: Adjust placement in the script configuration and
  return to Phase 4.

---

## Phase 6 — Routing and DRC Loop

**Goal**: Route the board and achieve DRC-clean status.

Apply the **pcb-layout-design protocol Phases 8–9**:

1. **Run the Python script**: Execute placement, export `.dsn`.
2. **Run FreeRouting** headlessly:
   `java -jar freerouting.jar -de board.dsn -do board.ses -mp 20`
3. **Import routing result**: `pcbnew.ImportSpecctraSES(board, "board.ses")`
4. **Fill copper zones**.
5. **Run DRC**: `kicad-cli pcb drc -o drc-report.json --format json --severity-all board.kicad_pcb`
6. **Classify violations**: Clearance, unconnected nets, track
   width, courtyard overlap, edge clearance.
7. **Automated fix loop**: Adjust design rules or placement, re-run.
   Maximum 5 iterations before escalating to user.

### Transition Rules

- **DRC clean** (zero violations): Proceed to Phase 7.
- **DRC violations persist after 5 iterations**: Present remaining
  violations to the user with analysis (placement issue vs. routing
  issue vs. design rule issue) and ask for guidance.

---

## Phase 7 — Layout Audit

**Goal**: Adversarially verify the layout is correct.

Apply the **layout-design-review protocol** in full:

1. DRC report review (violations vs. warnings).
2. Trace width and current capacity (IPC-2221 verification).
3. Impedance and signal integrity (USB differential pairs,
   controlled impedance, return path continuity).
4. Component placement review (decoupling cap proximity, antenna
   keepout, connector accessibility, thermal placement).
5. Ground plane and power integrity (ground plane continuity,
   power pour adequacy, star grounding if applicable).
6. Manufacturing constraint compliance (minimum features, board
   outline, panelization, assembly constraints).
7. Findings summary: document each finding with severity
   (Critical / High / Medium / Low / Informational), affected
   area, and remediation. Produce a coverage summary (phases
   checked, areas examined).
8. Conclude with an explicit audit verdict:
   - **PASS**: No Critical or High findings; proceed.
   - **FAIL**: Critical or High findings remain; must be corrected.

### Transition Rules

- **PASS verdict**: Proceed to Phase 8.
- **FAIL verdict**: Fix blocking issues. If the fix requires
  placement changes, return to Phase 4. If routing-only, return
  to Phase 6.

---

## Phase 8 — User Review of Layout

**Goal**: Get user approval of the routed layout.

1. Present the board overview (top and bottom views, layer
   utilization).
2. Present key layout decisions (routing strategy, ground plane
   design, impedance-controlled traces).
3. Present the DRC summary and audit verdict.
4. Present any remaining warnings with justification.
5. Ask: "Do you approve this layout, or do you want to make
   changes?"

### Transition Rules

- **Approved**: Proceed to Phase 9.
- **Revise placement**: Return to Phase 4.
- **Revise routing only**: Return to Phase 6.
- **Schematic feedback required**: If the layout revealed issues
  that require schematic changes (e.g., need a different package,
  need to split a bus, need additional decoupling), document the
  required schematic changes and inform the user that the schematic
  must be updated before continuing. The user should:
  1. Update the schematic
  2. Run "Update PCB from Schematic" in KiCad
  3. Return to Phase 4 with the updated board file

---

## Phase 9 — Deliver Artifacts

**Goal**: Present all deliverables and next steps.

1. **Deliver the following artifacts**:
   - Routed KiCad PCB file (`.kicad_pcb`)
   - Python layout script (for reproducibility and future
     modifications)
   - DRC report (clean)
   - Layout audit report
   - Updated schematic (if schematic feedback occurred)

2. **Next steps**: Inform the user of the next stage:
   - Manufacturing artifact generation (Gerbers, BOM, pick-and-
     place files for fab submission)
   - Or a full end-to-end hardware design workflow, if available
     in the library

---

## Non-Goals

- This template handles **layout and routing only** — schematic
  design is handled by the `design-schematic` template.
- This template does NOT generate **manufacturing artifacts**
  (Gerbers, drill files, BOM) — that is a separate step.
- This template does NOT perform **simulation** (SPICE, thermal)
  — use `validate-simulation` for that.
- This template does NOT design the **enclosure** — use
  `review-enclosure` for enclosure audit.

## Quality Checklist

Before delivering artifacts in Phase 9, verify:

- [ ] DRC passes with zero violations
- [ ] All nets are routed (no ratsnest lines remaining)
- [ ] Power trace widths are adequate for current loads
- [ ] USB differential pairs are length-matched and impedance-
      controlled
- [ ] Decoupling capacitors are within 3mm of IC power pins
- [ ] Ground plane is continuous under signal traces
- [ ] Antenna keepout zones are respected
- [ ] All components meet fab house minimum spacing
- [ ] Board outline is within specified dimensions
- [ ] Mounting holes are at correct positions
- [ ] Connectors are at user-specified board edges
- [ ] No warnings remain without documented justification
- [ ] Python script configuration section matches the delivered
      board (positions are in sync)
