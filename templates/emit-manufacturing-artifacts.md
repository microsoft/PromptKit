<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: emit-manufacturing-artifacts
mode: interactive
description: >
  Interactive manufacturing artifact generation session. Guides the
  user from a completed, DRC-clean PCB design to a full set of
  fab-ready deliverables: Gerbers, drill files, BOM, pick-and-place
  files, and assembly drawings. Supports fab-specific formatting
  for JLCPCB, PCBWay, and other services.
persona: electrical-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/manufacturing-artifact-generation
format: null
params:
  project_name: "Name of the hardware project or product"
  board_path: "Path to the DRC-clean KiCad board file (.kicad_pcb)"
  schematic_path: "Path to the KiCad schematic file (.kicad_sch)"
  fab_service: "Target fabrication and assembly service — use lowercase token (jlcpcb, pcbway)"
input_contract:
  type: artifact-set
  description: >
    A DRC-clean KiCad PCB file (.kicad_pcb) and its associated
    schematic (.kicad_sch). The board must have passed DRC with
    zero violations, all nets routed, and copper zones filled.
output_contract:
  type: artifact-set
  description: >
    A complete manufacturing package: Gerber files (ZIP), Excellon
    drill files, fab-formatted BOM (CSV), pick-and-place centroid
    file (CSV), assembly drawings (PDF), a Python generation script,
    and a submission checklist.
---

# Task: Manufacturing Artifact Generation

You are tasked with guiding the user through generating all files
needed to submit a PCB design for fabrication and assembly at a
turnkey service.

This is a multi-phase, interactive workflow. Each phase validates
its outputs before proceeding.

## Inputs

**Project**: {{project_name}}

**Board File**: {{board_path}}

**Schematic File**: {{schematic_path}}

**Target Fab Service**: {{fab_service}}

---

## Workflow Overview

```
Phase 1: Input Validation
    ↓
Phase 2: Fab Service Configuration (interactive)
    ↓
Phase 3: Artifact Generation (Python script)
    ↓
Phase 4: Pre-Submission Validation
    ↓
Phase 5: User Review
    ↓ ← loop back to Phase 3 if REVISE
Phase 6: Deliver Artifacts
```

---

## Phase 1 — Input Validation

**Goal**: Verify all prerequisites before generating artifacts.

Apply the **manufacturing-artifact-generation protocol Phase 1**:

1. **DRC status**: Confirm the PCB passes DRC with zero violations.
   If violations exist, do NOT proceed — the user must return to
   the layout design phase.
2. **Board file completeness**: Verify board outline, all components
   placed, all nets routed, copper zones filled, silkscreen present.
3. **BOM data completeness**: Verify every component has a
   manufacturer part number (MPN). Flag components missing supplier
   part numbers (e.g., LCSC numbers for JLCPCB) — these must be
   resolved before assembly ordering.
4. **Schematic file**: Verify the provided schematic file exists,
   is accessible, and corresponds to the board design being
   prepared for fabrication and assembly.

### Transition Rules

- **All prerequisites met**: Proceed to Phase 2.
- **Missing prerequisites**: Stop and inform the user what needs
  to be fixed.

---

## Phase 2 — Fab Service Configuration

**Goal**: Confirm fabrication and assembly parameters with the user.

1. **Fab service selection**: Confirm the target service
   ({{fab_service}}) and present its requirements:
   - BOM format (column names, supplier part number field)
   - Pick-and-place format (rotation offset requirements)
   - Gerber format preferences (Protel extensions, Gerber X2)
   - Accepted file formats (ZIP structure)

2. **Board parameters**: Ask the user to confirm or specify:
   - Layer count (2 or 4)
   - Board thickness (default: 1.6mm)
   - Copper weight (default: 1oz)
   - Surface finish (HASL, ENIG, OSP)
   - Solder mask color (default: green)
   - Silkscreen color (default: white)

3. **Assembly parameters** (if ordering assembly):
   - Which side(s) to assemble (top only, top + bottom)
   - Order quantity
   - Any components to mark as DNP (Do Not Populate)

### Critical Rule

**Do NOT proceed to Phase 3 until the user confirms the fab
configuration** (e.g., "READY", "proceed", "looks good").

### Output

Confirmed fab configuration summary.

---

## Phase 3 — Artifact Generation

**Goal**: Generate all manufacturing artifacts via a Python script.

Apply the **manufacturing-artifact-generation protocol Phases 2–7
and Phase 9**:

1. **Generate the Python script** that automates:
   - Gerber export for all layers (with correct layer mapping for
     the confirmed layer count)
   - Excellon drill file export (PTH + NPTH separated)
   - BOM export from schematic with fab-specific column formatting
   - Pick-and-place export with rotation offset corrections
   - Assembly drawing export (top and bottom PDFs)
   - Output directory organization (`manufacturing/gerbers/`,
     `manufacturing/assembly/`)
   - Gerber ZIP creation
   - Submission checklist generation

2. **Present the script** to the user before execution. The
   configuration section at the top should clearly show:
   - Board path (`{{board_path}}`)
   - Derived schematic path (same directory and basename as
     the board file, with `.kicad_sch` extension — must match
     `{{schematic_path}}`)
   - Fab service and its formatting rules
   - Board parameters (layers, thickness, finish)
   - Output directory

   **Note**: The script derives the schematic path from the board
   path (same directory, same basename). Verify in Phase 1 that
   `{{schematic_path}}` is consistent with this derivation. If
   the schematic is in a different location, the user must move
   or symlink it before running the script.

3. **Execute the script** (or instruct the user to run it):
   ```bash
   python3 generate_manufacturing.py {{board_path}} {{fab_service}}
   ```

### Output

- Python generation script
- All generated manufacturing files
- Submission checklist

---

## Phase 4 — Pre-Submission Validation

**Goal**: Verify all artifacts are present and consistent.

Apply the **manufacturing-artifact-generation protocol Phase 8**:

1. **File presence check**: All Gerber layers, drill files, BOM,
   pick-and-place, and assembly drawings exist.
2. **Cross-artifact consistency**:
   - Gerber layer count matches the board's stackup
   - Drill file hole count matches expectations (parse Excellon
     tool definitions and hit counts)
   - BOM component count matches schematic (after grouping,
     excluding DNP)
   - Pick-and-place component count matches BOM (minus
     through-hole and DNP)
   - Coordinate origin is consistent across all files
3. **Known-issue check**: Missing board outline, solder mask
   alignment, silkscreen on pads, drill unit mismatch,
   coordinate origin mismatch.

**Template-specific verdict gate**:

- **PASS**: All files present, all consistency checks pass.
- **PASS WITH WARNINGS**: Files present but warnings exist
  (e.g., missing supplier PNs, unverified rotations).
- **FAIL**: Missing files or consistency failures. Return to
  Phase 3.

---

## Phase 5 — User Review

**Goal**: Get user approval before submission to the fab.

1. Present the **validation summary table** (checks and status).
2. Present the **generated files list** with sizes.
3. Present any **warnings** (missing supplier PNs, unverified
   rotation offsets).
4. **Gerber inspection gate**: The user MUST inspect Gerbers in a
   viewer before submitting. Present viewer options:
   - Online: fab's built-in preview (JLCPCB/PCBWay Gerber viewer)
   - Offline: gerbv, KiCad Gerber viewer, or Tracespace.io
5. Present the **submission checklist** from the generated README.
6. Ask: "Have you inspected the Gerbers in a viewer and confirmed
   the board looks correct? Are you ready to submit, or do you
   want to make changes?"

### Transition Rules

- **User confirms Gerber review + approval**: Proceed to Phase 6.
- **User has NOT reviewed Gerbers**: Do NOT proceed. Reiterate
  that Gerber inspection is required before submission.
- **Revise**: Return to Phase 3 with specific feedback (e.g.,
  "add LCSC numbers for C3 and R7", "change solder mask to black").
- **Layout issue found**: The user must return to the PCB layout
  design phase — manufacturing artifact generation cannot fix
  layout problems.

---

## Phase 6 — Deliver Artifacts

**Goal**: Present all deliverables and submission instructions.

1. **Deliver the following artifacts**:
   - Gerber ZIP (ready to upload to fab)
   - BOM CSV (fab-formatted)
   - Pick-and-place CSV (with rotation corrections)
   - Assembly drawings (top + bottom PDFs)
   - Python generation script (for reproducibility)
   - Submission checklist / README

2. **Submission instructions** for the target fab service:

   **JLCPCB**:
   - Go to jlcpcb.com → Order Now
   - Upload `gerbers.zip`
   - Review the Gerber preview — verify board outline, layers,
     drill holes
   - For assembly: switch to the Assembly tab, upload BOM and
     pick-and-place CSVs
   - Review component placement preview — check rotations
   - Place order

   **PCBWay**:
   - Go to pcbway.com → Quote Now
   - Upload `gerbers.zip` (Gerber + drill files; PCBWay accepts ZIP uploads)
   - For assembly: use the Assembly service, upload BOM and
     pick-and-place files
   - Place order

3. **Next steps**: If this is part of the hardware design workflow,
   the design is now complete — the board is ready for manufacturing.

---

## Non-Goals

- This template generates **manufacturing artifacts only** — it
  does NOT fix layout or schematic issues.
- This template does NOT **place orders** — it produces the files
  needed for the user to submit manually.
- This template does NOT perform **incoming inspection** or
  **assembly verification** of received boards.

## Quality Checklist

Before delivering artifacts in Phase 6, verify:

- [ ] All Gerber layers present for the board's layer count
- [ ] Drill files present (PTH + NPTH)
- [ ] BOM has all required columns for the target fab service
- [ ] BOM component count matches schematic
- [ ] Pick-and-place component count matches BOM (minus TH + DNP)
- [ ] Coordinate origin is consistent across all files
- [ ] Assembly drawings show correct component placement
- [ ] Gerber ZIP is properly structured
- [ ] Submission checklist is complete
- [ ] User has been advised to inspect Gerbers in a viewer
