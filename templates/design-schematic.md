<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: design-schematic
mode: interactive
description: >
  Interactive schematic design session. Guides the user from project
  requirements through component selection to a complete KiCad
  schematic. Composes component-selection and schematic-design
  protocols with adversarial audits at each gate. Produces KiCad
  .kicad_sch files, a BOM draft, and a component selection report.
persona: electrical-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/component-selection
  - analysis/component-selection-audit
  - reasoning/schematic-design
  - analysis/schematic-compliance-audit
format: multi-artifact
params:
  project_name: "Name of the hardware project or product"
  description: "Natural language description of what the hardware should do — features, interfaces, environment, constraints"
  context: "Additional context — target fab service, enclosure constraints, existing system integration, power source, regulatory requirements"
input_contract: null
output_contract:
  type: artifact-set
  description: >
    Multiple artifacts produced across phases: component selection
    report with decision matrices, KiCad schematic file(s)
    (.kicad_sch), BOM draft (CSV), and audit reports for both
    component selection and schematic compliance.
---

# Task: Interactive Schematic Design

You are tasked with guiding the user through a **complete schematic
design session** — from understanding what they want to build,
through selecting components, to producing a KiCad schematic file.

This is a multi-phase, interactive workflow. You will cycle through
component selection and schematic design with adversarial audits and
user reviews at each transition.

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
Phase 2: Component Selection (component-selection protocol)
    ↓
Phase 3: Component Audit (component-selection-audit protocol)
    ↓
Phase 4: User Review of Components
    ↓ ← loop back to Phase 2 if REVISE
Phase 5: Schematic Design (schematic-design protocol)
    ↓
Phase 6: Schematic Audit (schematic-compliance-audit protocol)
    ↓
Phase 7: User Review of Schematic
    ↓ ← loop back to Phase 2 or 5 if REVISE
Phase 8: Deliver Artifacts
```

---

## Phase 1 — Requirements Discovery

**Goal**: Understand what the user wants to build and extract the
requirements that drive component selection.

1. **Restate** the project description and confirm understanding.
2. **Ask clarifying questions** — probe for specifics:
   - What features does the device need? (sensors, wireless,
     display, actuators)
   - What interfaces are required? (USB, I2C, SPI, GPIO, analog)
   - What is the power source? (battery type and capacity, USB
     powered, wall adapter, solar)
   - What is the operating environment? (temperature range, indoor/
     outdoor, vibration, moisture)
   - What is the form factor target? (board size, enclosure
     constraints)
   - What is the target cost and volume? (prototype, low-volume,
     mass production)
   - What fabrication service will be used? (JLCPCB, PCBWay, etc.)
   - Are there regulatory requirements? (FCC, CE, UL)
3. **Surface implicit requirements** — power management, programming
   interface, debug access, indicator LEDs, test points.
4. **Challenge scope** — is the feature set realistic for the board
   size and budget? Are there simpler alternatives?

### Critical Rule

**Do NOT proceed to Phase 2 until the user explicitly confirms the
requirements are complete** (e.g., "READY", "proceed", "looks good").

### Output

A requirements summary table with CR-IDs (Component Requirements),
priorities (Must/Should/May), and the component categories each
requirement drives.

---

## Phase 2 — Component Selection

**Goal**: Select core functional components that fulfil the
requirements.

Apply the **component-selection protocol** in full:

1. Extract requirements driving component selection (from Phase 1).
2. Identify component categories needed and consolidation
   opportunities.
3. Search for candidates (2+ per category) with real-time
   verification of specs and availability.
4. Score candidates using weighted decision matrix (ask the user
   to adjust weights).
5. Evaluate sourcing (availability, pricing, lifecycle, assembly
   service compatibility).
6. Cross-check compatibility (voltage domains, interfaces, power
   budget, physical fit).
7. Produce the selection decision matrix and recommendation.

### Output

A component selection report with:
- Requirements summary table
- Candidate comparison matrices (one per category)
- Selected components table with justification
- Risk flags (single-source, lifecycle, tight margins)
- Downstream implications for schematic design

---

## Phase 3 — Component Selection Audit

**Goal**: Adversarially verify the component selection is sound.

Apply the **component-selection-audit protocol** in full:

1. Verify every part number exists and is currently orderable.
2. Cross-check claimed specifications against datasheets.
3. Verify all requirements are satisfied by verified specs.
4. Independently verify sourcing data.
5. Verify compatibility assertions.
6. Produce audit verdict: PASS / PASS WITH CONDITIONS / FAIL.

### Transition Rules

- **PASS**: Proceed to Phase 4.
- **PASS WITH CONDITIONS**: Proceed to Phase 4, but present the
  conditions to the user.
- **FAIL**: Return to Phase 2. Identify which components failed
  and why. Select alternatives.

---

## Phase 4 — User Review of Components

**Goal**: Get user approval of the component selection before
investing in schematic design.

1. Present the selected components table.
2. Present the audit verdict and any findings.
3. Present risk flags and downstream implications.
4. Ask: "Do you approve this component selection, or do you want
   to revisit any choices?"

### Transition Rules

- **Approved**: Proceed to Phase 5.
- **Revise**: Return to Phase 2 with the user's feedback.

---

## Phase 5 — Schematic Design

**Goal**: Design a complete, correct KiCad schematic from the
selected components.

Apply the **schematic-design protocol** in full:

1. Validate inputs (component list, datasheets, interfaces).
2. Design the power architecture (regulators, passive values from
   datasheets).
3. Design supporting circuitry (decoupling, crystals, reset, boot
   pins, pull-ups, ESD protection).
4. Design signal routing (I2C buses with pull-ups, SPI with CS
   lines, UART crossover, USB topology).
5. Design protection circuits (reverse polarity, overcurrent,
   overvoltage).
6. Assign net names and reference designators.
7. Organize the schematic (single-sheet or hierarchical).
8. Generate KiCad `.kicad_sch` S-expression file(s) with visual
   layout rules (grid alignment, component spacing, wire routing).
9. Self-check against the schematic-compliance-audit checklist.

### Output

- KiCad schematic file(s) (`.kicad_sch`)
- BOM draft (component list with values, footprints, and MPNs)
- Design notes (key decisions, datasheet references, assumptions)

---

## Phase 6 — Schematic Audit

**Goal**: Adversarially verify the schematic is correct.

Apply the **schematic-compliance-audit protocol** in full:

1. Power architecture review (rails, decoupling, current budget).
2. Pin-level audit (every pin of every IC verified against
   datasheet).
3. Bus integrity (I2C pull-ups, SPI CS lines, UART crossover, USB
   topology).
4. Protection circuit review (ESD, reverse polarity, overcurrent).
5. Power sequencing and reset.
6. Passive component verification (values, ratings, derating).
7. Completeness check (unconnected nets, floating inputs, missing
   ground, test points).

### Transition Rules

- **No Critical or High findings**: Proceed to Phase 7.
- **Critical or High findings**: Fix them in the schematic, then
  re-run the audit. Document what was fixed.

---

## Phase 7 — User Review of Schematic

**Goal**: Get user approval of the schematic before proceeding to
layout or manufacturing.

1. Present the schematic organization (sheet structure, key blocks).
2. Present the key design decisions (regulator choices, protection
   strategy, passive values with datasheet citations).
3. Present the audit results and any remaining findings.
4. Present the BOM draft.
5. Ask: "Do you approve this schematic, or do you want to make
   changes?"

### Transition Rules

- **Approved**: Proceed to Phase 8.
- **Revise schematic**: Return to Phase 5 with specific feedback.
- **Revise components**: Return to Phase 2 (e.g., if the user
  wants a different MCU or a module instead of bare IC).

---

## Phase 8 — Deliver Artifacts

**Goal**: Present all deliverables and next steps.

1. **Deliver the following artifacts**:
   - KiCad schematic file(s) (`.kicad_sch`)
   - BOM draft (CSV)
   - Component selection report
   - Audit reports (component selection + schematic)
   - Design notes

2. **Next steps**: Inform the user of the next stages in the
   hardware design workflow:
   - PCB layout and routing (uses `design-pcb-layout` template)
   - Manufacturing artifact generation (uses
     `emit-manufacturing-artifacts` template)
   - Or the full end-to-end workflow (uses
     `hardware-design-workflow` template)

---

## Non-Goals

- This template designs the **schematic only** — PCB layout,
  routing, and manufacturing artifacts are separate templates.
- This template does NOT design the **enclosure** — use
  `review-enclosure` for enclosure audit.
- This template does NOT perform **simulation** — use
  `validate-simulation` for SPICE or thermal analysis.
- This template does NOT select **supporting circuitry
  independently** of the schematic — supporting circuit design
  (decoupling, ESD, regulation) is part of schematic design.

## Quality Checklist

Before delivering artifacts in Phase 8, verify:

- [ ] All selected components have verified part numbers
- [ ] All passive values are traced to datasheet recommendations
- [ ] Every IC pin is connected, properly terminated, or marked
      no-connect
- [ ] Every power rail has decoupling capacitors
- [ ] Every external connector has ESD protection
- [ ] I2C buses have pull-ups, SPI has CS lines, UART is crossed
- [ ] Net names follow a consistent convention
- [ ] Reference designators are unique and sequential
- [ ] KiCad schematic renders correctly (grid-aligned, no
      overlapping components, orthogonal wires)
- [ ] BOM has MPN and supplier part numbers for all components
- [ ] No [UNKNOWN] or [UNVERIFIED] markers remain unaddressed
