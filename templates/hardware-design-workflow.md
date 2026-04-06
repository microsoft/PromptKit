<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: hardware-design-workflow
mode: interactive
description: >
  End-to-end hardware design workflow with human-in-the-loop review.
  Guides a user from initial idea through requirements discovery,
  component selection, schematic design, PCB layout and routing, to
  manufacturable artifacts ready for PCBWay or JLCPCB submission.
  Each generative phase is paired with an adversarial audit and user
  review gate.
persona: electrical-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/requirements-elicitation
  - reasoning/component-selection
  - analysis/component-selection-audit
  - reasoning/schematic-design
  - analysis/schematic-compliance-audit
  - reasoning/pcb-layout-design
  - analysis/layout-design-review
  - reasoning/manufacturing-artifact-generation
format: null
params:
  project_name: "Name of the hardware project or product"
  description: "Natural language description of what the hardware should do — features, interfaces, environment, constraints"
  context: "Additional context — target fab service, enclosure constraints, existing system integration, power source, budget, regulatory requirements"
input_contract: null
output_contract:
  type: artifact-set
  description: >
    Complete hardware design package produced across phases:
    requirements document, component selection report, KiCad
    schematic (.kicad_sch), routed KiCad PCB (.kicad_pcb), Python
    layout script, manufacturing artifacts (Gerbers, BOM, pick-and-
    place), audit reports, and fab submission checklist.
---

# Task: End-to-End Hardware Design Workflow

You are tasked with guiding the user through a **complete hardware
design cycle** — from understanding what they want to build, through
component selection, schematic design, PCB layout, to manufacturable
artifacts ready for fab submission.

This is a multi-phase, interactive workflow. Each generative phase is
followed by an adversarial audit and user review gate. The user can
loop back to any earlier phase based on audit results or changing
requirements.

## Inputs

**Project**: {{project_name}}

**Description**:
{{description}}

**Additional Context**:
{{context}}

---

## Workflow Overview

```
Phase 1: Requirements Discovery (interactive)
    ↓
Phase 2: Component Selection
    ↓
Phase 3: Component Audit + User Review
    ↓ ← loop back to Phase 2 if REVISE
Phase 4: Schematic Design
    ↓
Phase 5: Schematic Audit + User Review
    ↓ ← loop back to Phase 2 or 4 if REVISE
Phase 6: PCB Layout & Routing
    ↓
Phase 7: Layout Audit + User Review
    ↓ ← loop back to Phase 4 or 6 if REVISE
Phase 8: Manufacturing Artifacts
    ↓
Phase 9: Pre-Submission Review + Delivery
```

---

## Phase 1 — Requirements Discovery

**Goal**: Understand what the user wants to build and extract
requirements that drive the entire design.

Apply the **requirements-elicitation protocol**:

1. **Restate** the project description and confirm understanding.
2. **Ask clarifying questions**:
   - Features: What does the device do? (sensors, wireless,
     display, actuators, I/O)
   - Power: Battery type and capacity, USB powered, wall adapter?
   - Environment: Temperature range, indoor/outdoor, vibration?
   - Form factor: Board size, enclosure constraints?
   - Cost and volume: Prototype, low-volume, production?
   - Fab service: JLCPCB, PCBWay?
   - Regulatory: FCC, CE, UL?
3. **Surface implicit requirements**: Programming interface, debug
   access, indicator LEDs, test points, power management.
4. **Challenge scope**: Is the feature set realistic? Simpler
   alternatives?

### Critical Rule

**Do NOT proceed to Phase 2 until the user explicitly confirms the
requirements are complete.**

### Output

A requirements summary table with REQ-IDs (using REQ-HW- prefix),
priorities (Must/Should/May), and the component categories each
requirement drives.

---

## Phase 2 — Component Selection

**Goal**: Select core functional components.

Apply the **component-selection protocol** in full:

1. Extract requirements driving component selection.
2. Identify component categories and consolidation opportunities.
3. Search for candidates with real-time verification.
4. Score candidates using weighted decision matrix.
5. Evaluate sourcing (availability, pricing, lifecycle).
6. Cross-check compatibility (voltage, interfaces, power budget).
7. Produce selection decision matrix and recommendation.

### Output

Component selection report with decision matrices, selected
components table, risk flags, and downstream implications.

---

## Phase 3 — Component Audit + User Review

**Goal**: Verify the selection and get user approval.

Apply the **component-selection-audit protocol** in full:

1. Verify every part number exists and is orderable.
2. Cross-check specifications against datasheets.
3. Verify all requirements are satisfied.
4. Verify sourcing data.
5. Verify compatibility assertions.
6. Produce audit verdict: PASS / PASS WITH CONDITIONS / FAIL.

**User review**: Present selected components, audit verdict, and
risk flags. Ask: "Do you approve this component selection?"

### Transition Rules

- **Approved**: Proceed to Phase 4.
- **FAIL verdict or user revises**: Return to Phase 2.

---

## Phase 4 — Schematic Design

**Goal**: Design a complete KiCad schematic.

Apply the **schematic-design protocol** in full:

1. Validate inputs (component list, datasheets, interfaces).
2. Design power architecture (regulators, passive values).
3. Design supporting circuitry (decoupling, crystals, reset,
   boot pins, pull-ups).
4. Design signal routing (I2C, SPI, UART, USB buses).
5. Design protection circuits (ESD, reverse polarity, overcurrent).
6. Assign net names and reference designators.
7. Organize schematic (single-sheet or hierarchical).
8. Generate KiCad `.kicad_sch` with visual layout rules.
9. Self-check against schematic-compliance-audit.

### Output

- KiCad schematic file(s) (`.kicad_sch`)
- BOM draft (CSV)
- Design notes

---

## Phase 5 — Schematic Audit + User Review

**Goal**: Verify the schematic and get user approval.

Apply the **schematic-compliance-audit protocol** in full:

1. Power architecture review.
2. Pin-level audit.
3. Bus integrity.
4. Protection circuit review.
5. Power sequencing and reset.
6. Passive component verification.
7. Completeness check.

**Template-specific verdict gate**:

- **PASS**: No blocking compliance issues.
- **FAIL**: Blocking issues found; fix and re-audit.

**User review**: Present schematic, key design decisions, audit
results, and BOM. Ask: "Do you approve this schematic?"

### Transition Rules

- **Approved**: Proceed to Phase 6.
- **Revise schematic**: Return to Phase 4.
- **Revise components**: Return to Phase 2 (e.g., different MCU,
  module vs. bare IC).

---

## Phase 6 — PCB Layout & Routing

**Goal**: Produce a routed, DRC-clean PCB.

Apply the **pcb-layout-design protocol** in full:

1. **Input validation**: Verify schematic has footprint assignments,
   ERC passes, board file is populated.
2. **Layout requirements** (interactive): Gather connector
   placement, board size, mechanical constraints from user.
3. **Board definition**: Outline, stackup (2-layer or 4-layer),
   mounting holes, copper zones.
4. **Design rules**: Net classes, trace widths, clearances per
   fab house.
5. **Component placement**: Priority ordering, thermal placement,
   DFM. Generate Python pcbnew script.
6. **User review of placement**: Present plan, get approval before
   routing.
7. **Routing strategy**: Pre-route critical nets, autorouter config,
   ground/power strategy.
8. **Autorouting**: FreeRouting headless execution, zone fills.
9. **DRC validation loop**: kicad-cli DRC, classify violations,
   iterate (max 5 routing/rule-only iterations; placement changes
   go back to step 5 for user re-approval).

### Output

- Routed KiCad PCB file (`.kicad_pcb`)
- Python layout script
- DRC report

---

## Phase 7 — Layout Audit + User Review

**Goal**: Verify the layout and get user approval.

Apply the **layout-design-review protocol** in full:

1. DRC report review.
2. Trace width and current capacity.
3. Impedance and signal integrity.
4. Component placement review.
5. Ground plane and power integrity.
6. Manufacturing constraint compliance.
7. Findings summary with severity classification.

**Template-specific verdict gate**:

- **PASS**: No Critical or High findings.
- **FAIL**: Blocking issues remain.

**User review**: Present board overview, routing decisions, DRC
summary, audit verdict. Ask: "Do you approve this layout?"

### Transition Rules

- **Approved**: Proceed to Phase 8.
- **Revise placement/routing**: Return to Phase 6.
- **Schematic feedback required**: If layout reveals schematic
  issues (wrong package, bus split needed), document required
  changes. User updates schematic, runs "Update PCB from
  Schematic", returns to Phase 6.
- **Component feedback required**: Return to Phase 2.

---

## Phase 8 — Manufacturing Artifacts

**Goal**: Generate all files for fab submission.

Apply the **manufacturing-artifact-generation protocol** in full:

1. Input validation (DRC-clean board, BOM data).
2. Confirm fab service and board parameters with user.
3. Generate Python script wrapping kicad-cli:
   - Gerber export (all layers)
   - Drill file export (PTH + NPTH)
   - BOM export with fab-specific formatting
   - Pick-and-place export with rotation corrections
   - Assembly drawings (PDF)
   - Cross-artifact validation
4. Execute script, organize output (`manufacturing/` directory).
5. Create Gerber ZIP and submission checklist.

### Output

- `manufacturing/gerbers.zip`
- `manufacturing/assembly/bom.csv`
- `manufacturing/assembly/pick-and-place.csv`
- `manufacturing/assembly/assembly-top.pdf`
- `manufacturing/assembly/assembly-bottom.pdf`
- Python generation script
- Submission checklist

---

## Phase 9 — Pre-Submission Review + Delivery

**Goal**: Final validation and delivery of the complete design
package.

1. **Cross-artifact validation**: Gerber layer count matches
   stackup, drill hole count, BOM count matches schematic,
   pick-and-place count matches BOM, coordinate origins consistent.
2. **Gerber inspection gate**: User MUST inspect Gerbers in a
   viewer (fab preview, gerbv, KiCad Gerber viewer, or
   Tracespace.io) and confirm the board looks correct.
3. **Present the complete design package**:
   - Requirements document
   - Component selection report with audit
   - KiCad schematic (`.kicad_sch`)
   - KiCad PCB (`.kicad_pcb`)
   - Python layout script
   - Manufacturing artifacts (Gerbers, BOM, pick-and-place)
   - All audit reports
   - Submission checklist
4. **Fab-specific submission instructions** (JLCPCB or PCBWay).
5. Ask: "Have you inspected the Gerbers and confirmed the board
   looks correct? Ready to submit to the fab?"

### Transition Rules

- **User confirms Gerber review + approval**: Design is complete.
- **User has NOT reviewed Gerbers**: Do NOT proceed. Gerber
  inspection is required.
- **Issues found**: Return to the appropriate phase (Phase 6 for
  layout, Phase 4 for schematic, Phase 2 for components).

---

## Non-Goals

- This workflow produces **design files only** — it does NOT place
  orders with fab services.
- This workflow does NOT cover **firmware development** — use the
  `engineering-workflow` template with `embedded-firmware-engineer`
  persona for firmware.
- This workflow does NOT design **enclosures** — use
  `review-enclosure` for enclosure audit after the PCB is designed.
- This workflow does NOT perform **circuit simulation** — use
  `validate-simulation` between Phases 5 and 6 for SPICE or
  thermal analysis if needed.

## Quality Checklist

Before final delivery in Phase 9, verify:

- [ ] Requirements are documented with REQ-HW- IDs
- [ ] All selected components have verified part numbers
- [ ] All passive values are traced to datasheet recommendations
- [ ] Every IC pin is connected, terminated, or marked no-connect
- [ ] DRC passes with zero violations
- [ ] All nets are routed
- [ ] Power trace widths are adequate for current loads
- [ ] Controlled-impedance nets (if any) are length-matched
- [ ] Ground plane is continuous where required
- [ ] All manufacturing files are present and consistent
- [ ] BOM has supplier part numbers for the target fab
- [ ] User has inspected and approved the Gerbers in a viewer
- [ ] Submission checklist is complete
