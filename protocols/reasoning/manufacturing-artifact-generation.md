<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: manufacturing-artifact-generation
type: reasoning
description: >
  Systematic reasoning protocol for generating and validating
  manufacturing deliverables from a completed PCB design. Covers
  Gerber files, Excellon drill files, BOM formatting, pick-and-place
  centroid files, and assembly drawings. Includes fab-specific
  formatting for JLCPCB, PCBWay, and other services. Outputs a
  Python script using kicad-cli for automated generation and
  pre-submission validation.
applicable_to: []
---

# Protocol: Manufacturing Artifact Generation

Apply this protocol when generating manufacturing deliverables from
a completed, DRC-clean KiCad PCB design. The goal is to produce all
files needed to submit a board for fabrication and assembly at a
turnkey service (JLCPCB, PCBWay, OSH Park, etc.). Execute all
phases in order.

**Composition note**: This protocol is intended for standalone/manual
composition and is not currently required by any template.

**Input**: A DRC-clean KiCad PCB file (`.kicad_pcb`) and its
associated schematic (`.kicad_sch`), plus the target fabrication
and assembly service.

**Tool dependencies**: This protocol generates a Python script that
invokes `kicad-cli` commands. Requirements:
- **KiCad 7.0+** with `kicad-cli` (included in standard install)
- **Python 3.8+** for the generation script

If `kicad-cli` is unavailable, the protocol can still document the
required artifacts and their specifications, but automated generation
cannot proceed. Note this in the output.

## Phase 1: Input Validation

Verify all prerequisites before generating manufacturing artifacts.

1. **DRC status**: Confirm the PCB design passes DRC with zero
   violations. If violations exist, do NOT proceed — return to
   the `pcb-layout-design` protocol's DRC validation loop.

2. **Board file completeness**: Verify the `.kicad_pcb` contains:
   - Board outline on `Edge.Cuts` layer (closed polygon)
   - All components placed with footprints
   - All nets routed (no ratsnest lines remaining)
   - Copper zones filled
   - Silkscreen labels present and legible

3. **Target fab service**: Confirm with the user:
   - Fabrication service (JLCPCB, PCBWay, OSH Park, other)
   - Assembly service (same fab, different assembler, or
     hand-assembly)
   - Order quantity (affects BOM pricing columns)
   - Board parameters: layer count, copper weight, surface finish
     (HASL, ENIG, OSP), board thickness, solder mask color

4. **BOM data completeness**: For assembly orders, verify every
   component in the schematic has:
   - Manufacturer part number (MPN)
   - Supplier part number if required (e.g., LCSC number for
     JLCPCB)
   - Value and footprint
   - Reference designator
   Flag any components missing supplier part numbers as requiring
   user input before BOM generation.

## Phase 2: Gerber Generation

Generate Gerber files for PCB fabrication.

1. **Layer mapping**: Generate Gerbers for all required layers.

   **2-layer board**:
   | Layer | KiCad Layer Name | Gerber File Suffix | Purpose |
   |-------|------------------|--------------------|---------|
   | Front copper | F.Cu | .GTL | Top copper traces |
   | Back copper | B.Cu | .GBL | Bottom copper traces |
   | Front solder mask | F.Mask | .GTS | Top solder mask openings |
   | Back solder mask | B.Mask | .GBS | Bottom solder mask openings |
   | Front silkscreen | F.SilkS | .GTO | Top component labels |
   | Back silkscreen | B.SilkS | .GBO | Bottom component labels |
   | Board outline | Edge.Cuts | .GKO | Board perimeter |
   | Front paste | F.Paste | .GTP | Stencil openings (for assembly) |
   | Back paste | B.Paste | .GBP | Stencil openings (if bottom SMD) |

   **4-layer board** (add to above):
   | Layer | KiCad Layer Name | Gerber File Suffix | Purpose |
   |-------|------------------|--------------------|---------|
   | Inner 1 | In1.Cu | .G2 | Inner layer 1 (typically ground) |
   | Inner 2 | In2.Cu | .G3 | Inner layer 2 (typically power) |

2. **Gerber settings**:
   - Format: RS-274X (Gerber X2 preferred if fab supports it)
   - Coordinate format: 4.6 (integer.decimal digits)
   - Units: millimeters
   - Use Protel filename extensions (most widely compatible)
   - Include aperture attributes if using Gerber X2

3. **kicad-cli command**:
   ```bash
   kicad-cli pcb export gerbers \
     --output manufacturing/gerbers/ \
     --layers F.Cu,B.Cu,F.Mask,B.Mask,F.SilkS,B.SilkS,Edge.Cuts,F.Paste,B.Paste \
     --use-protel-extensions \
     board.kicad_pcb
   ```
   For 4-layer boards, add `In1.Cu,In2.Cu` to the `--layers` list.

## Phase 3: Drill File Generation

Generate Excellon drill files for all holes.

1. **Drill file types**:
   - **PTH** (Plated Through-Hole): Vias, through-hole component
     pins
   - **NPTH** (Non-Plated Through-Hole): Mounting holes, alignment
     holes

2. **Drill settings**:
   - Format: Excellon
   - Units: millimeters
   - Coordinate origin: same as Gerber origin (absolute coordinates)
   - Zero suppression: none (leading/trailing zeros preserved)
   - Merge PTH and NPTH into separate files (most fabs require this)

3. **kicad-cli command**:
   ```bash
   kicad-cli pcb export drill \
     --output manufacturing/gerbers/ \
     --format excellon \
     --drill-origin absolute \
     --excellon-units mm \
     --generate-map \
     --map-format gerberx2 \
     board.kicad_pcb
   ```

4. **Drill map**: Generate a drill map (visual representation of
   hole locations and sizes) for human review. The `--generate-map`
   flag produces this.

## Phase 4: BOM Generation

Generate a bill of materials formatted for the target assembly
service.

1. **BOM extraction**: Export the BOM from the schematic using:
   ```bash
   kicad-cli sch export bom \
     --output manufacturing/assembly/bom-raw.csv \
     --fields "Reference,Value,Footprint,MPN,Manufacturer,LCSC,DNP" \
     --group-by Value,Footprint \
     board.kicad_sch
   ```
   The `--fields` list must match the actual custom field names
   defined in the schematic's symbol properties (e.g., "MPN",
   "Manufacturer", "LCSC"). Quantity is computed automatically
   by the `--group-by` grouping — it appears as the count of
   grouped reference designators, not as a separate field.
   The script derives the schematic path from the PCB path
   (same directory, same basename, `.kicad_sch` extension).

2. **Required BOM fields** (assembly services require these):

   | Field | Description | Example |
   |-------|-------------|---------|
   | Reference | Designator(s) | C1,C2,C3 |
   | Value | Component value | 100nF |
   | Footprint | Package | 0402 |
   | Quantity | Count of grouped components | 3 |
   | MPN | Manufacturer part number | GRM155R71C104KA88D |
   | Manufacturer | Component manufacturer | Murata |
   | Supplier PN | Fab-specific part number | (see below) |
   | DNP | Do Not Populate flag | (empty or "DNP") |

3. **Fab-specific BOM formatting**:

   **JLCPCB**:
   - Required columns: `Comment, Designator, Footprint, LCSC`
   - `Comment` = component value
   - `LCSC` = LCSC part number (e.g., `C14663`)
   - Parts are classified as "Basic" (cheaper) or "Extended"
   - CSV with header row, UTF-8 encoding

   **PCBWay**:
   - Required columns: `Item, Qty, Designator, Package/Case,
     Manufacturer, MPN, Supplier, Supplier PN`
   - Accepts DigiKey, Mouser, or LCSC part numbers
   - Excel (.xlsx) or CSV format

4. **DNP handling**: Components marked Do Not Populate must appear
   in the BOM with a DNP flag — do NOT silently omit them (omission
   causes confusion about whether the part was forgotten).

5. **BOM verification**: After generation, verify:
   - Total unique line items matches schematic component count
     (after grouping)
   - Total quantity matches total components in schematic
   - No rows with missing MPN or supplier PN (flag for user input)
   - DNP components are correctly flagged

## Phase 5: Pick-and-Place Generation

Generate component placement (centroid) files for automated assembly.

1. **kicad-cli command**:
   ```bash
   kicad-cli pcb export pos \
     --output manufacturing/assembly/ \
     --format csv \
     --units mm \
     --side both \
     --use-drill-file-origin \
     board.kicad_pcb
   ```

2. **Required fields**:

   | Field | Description | Unit |
   |-------|-------------|------|
   | Ref | Reference designator | — |
   | Val | Component value | — |
   | Package | Footprint name | — |
   | PosX | X position | mm |
   | PosY | Y position | mm |
   | Rot | Rotation angle | degrees |
   | Side | Top or Bottom | — |

3. **Fab-specific rotation offsets**: Different assembly services
   define 0° rotation differently. JLCPCB in particular requires
   rotation corrections for many components:
   - Check if the fab provides a rotation offset database
   - For JLCPCB: apply corrections from their published component
     rotation database, or note that the user should verify
     rotations in the JLCPCB assembly preview before ordering
   - Common corrections: SOT-23 (+180°), QFP (+90°), some SOIC
     packages (+90°)

4. **Coordinate origin**: Use the drill/place file origin set in
   KiCad (Place → Drill/Place File Origin). The origin must be
   consistent between Gerber, drill, and pick-and-place files.
   If no origin is set, default to the board origin (0,0).

5. **Pick-and-place verification**:
   - Component count matches BOM (excluding DNP components)
   - All SMD components have entries (through-hole components are
     typically excluded from automated placement)
   - No duplicate reference designators

## Phase 6: Assembly Drawing Generation

Generate visual assembly references.

1. **Assembly drawings**: Export top and bottom assembly views
   showing component outlines, reference designators, and
   orientation marks:
   ```bash
   kicad-cli pcb export pdf \
     --output manufacturing/assembly/assembly-top.pdf \
     --layers F.Fab,F.SilkS,Edge.Cuts \
     board.kicad_pcb

   kicad-cli pcb export pdf \
     --output manufacturing/assembly/assembly-bottom.pdf \
     --layers B.Fab,B.SilkS,Edge.Cuts \
     --mirror \
     board.kicad_pcb
   ```

2. **3D render** (optional): If the user wants a visual preview:
   ```bash
   kicad-cli pcb render \
     --output manufacturing/assembly/board-3d.png \
     --width 1920 --height 1080 \
     board.kicad_pcb
   ```
   Note: `kicad-cli pcb render` requires KiCad 8.0+. If unavailable,
   skip and note for the user.

## Phase 7: Fab-Specific Packaging

Package all artifacts into the directory structure expected by the
target fab service.

1. **Standard output directory structure**:
   ```
   manufacturing/
   ├── gerbers/
   │   ├── board-F_Cu.gtl
   │   ├── board-B_Cu.gbl
   │   ├── board-F_Mask.gts
   │   ├── board-B_Mask.gbs
   │   ├── board-F_SilkS.gto
   │   ├── board-B_SilkS.gbo
   │   ├── board-Edge_Cuts.gko
   │   ├── board-F_Paste.gtp
   │   ├── board-B_Paste.gbp
   │   ├── board-PTH.drl
   │   ├── board-NPTH.drl
   │   └── board-drl_map.gbr
   ├── assembly/
   │   ├── bom.csv
   │   ├── pick-and-place.csv
   │   ├── assembly-top.pdf
   │   └── assembly-bottom.pdf
   └── README.md (submission checklist)
   ```

2. **Gerber ZIP**: Most fabs require Gerbers + drill files uploaded
   as a single ZIP:
   ```bash
   cd manufacturing/gerbers && zip ../gerbers.zip *
   ```

3. **README / submission checklist**: Generate a checklist file:
   ```markdown
   # Manufacturing Submission Checklist

   ## Board Specifications
   - Layers: [2 / 4]
   - Dimensions: [W]mm × [H]mm
   - Thickness: [1.6mm]
   - Copper weight: [1oz]
   - Surface finish: [HASL / ENIG / OSP]
   - Solder mask color: [green]
   - Silkscreen color: [white]

   ## Files Included
   - [ ] Gerbers (all layers) — gerbers.zip
   - [ ] Drill files (PTH + NPTH) — included in gerbers.zip
   - [ ] BOM — assembly/bom.csv
   - [ ] Pick-and-place — assembly/pick-and-place.csv
   - [ ] Assembly drawings — assembly/*.pdf

   ## Pre-Submission Checks
   - [ ] Gerber viewer inspection (use gerbv, KiCad, or fab preview)
   - [ ] BOM supplier part numbers verified
   - [ ] Pick-and-place rotation verified in fab preview
   - [ ] Board dimensions confirmed
   - [ ] Layer count confirmed
   - [ ] Order quantity: [N]
   ```

## Phase 8: Pre-Submission Validation

Verify all artifacts are present, consistent, and correct before
the user submits to the fab.

1. **File presence check**: Verify every expected file exists in
   the output directory:
   - All Gerber layers for the board's layer count
   - PTH and NPTH drill files
   - BOM CSV
   - Pick-and-place CSV
   - Assembly drawings (PDF)

2. **Cross-artifact consistency**:
   - **Gerber layer count** matches the board's stackup (2 or 4
     copper layers + mask + silk + paste + outline)
   - **Drill file hole count** matches the PCB's via + through-hole
     count (parse tool definitions and hit counts from the Excellon
     drill file rather than requiring pcbnew API)
   - **BOM component count** matches the schematic's total component
     count (after grouping and excluding DNP)
   - **Pick-and-place component count** matches BOM (minus
     through-hole and DNP components)
   - **Coordinate origin** is consistent across Gerber, drill, and
     pick-and-place files

3. **Gerber visual inspection**: Recommend the user inspect Gerbers
   in a viewer before submission:
   - Online: the fab's built-in preview (JLCPCB, PCBWay both have
     Gerber viewers)
   - Offline: gerbv (open source), KiCad's Gerber viewer, or
     Tracespace.io (web-based)
   - Check for: correct board outline, no missing copper, solder
     mask openings align with pads, silkscreen is readable

4. **Known-issue checklist**: Flag common submission problems:
   - Missing board outline (Edge.Cuts) — fab cannot determine
     board dimensions
   - Solder mask openings too small (pads may not be exposed)
   - Silkscreen overlapping pads (causes readability issues)
   - Drill file units mismatch (mm vs. inches)
   - Pick-and-place origin doesn't match Gerber origin

5. **Produce a validation summary**:

   | Check | Status | Details |
   |-------|--------|---------|
   | Gerber files present | ✅ | 9/9 layers |
   | Drill files present | ✅ | PTH + NPTH |
   | BOM complete | ⚠️ | 2 components missing LCSC PN |
   | Pick-and-place count | ✅ | 23 SMD components |
   | Coordinate origin consistent | ✅ | (0, 0) all files |

## Phase 9: Python Script Generation

Generate a single Python script that automates phases 2–8.

1. **Script structure**:
   ```python
   #!/usr/bin/env python3
   """Manufacturing artifact generation script.

   Generated by PromptKit. Produces all files needed to submit
   a KiCad PCB design for fabrication and assembly.

   Prerequisites:
     - KiCad 7.0+ with kicad-cli
     - Python 3.8+

   Usage:
     python3 generate_manufacturing.py board.kicad_pcb [fab_service]

   Supported fab services: jlcpcb, pcbway (default: jlcpcb)
   """
   import subprocess
   import sys
   import os
   import csv
   from pathlib import Path

   if len(sys.argv) < 2:
       print("Usage: python3 generate_manufacturing.py board.kicad_pcb [fab_service]",
             file=sys.stderr)
       raise SystemExit(1)

   # Derive schematic path from PCB path (same dir, same basename)
   board_path = Path(sys.argv[1])
   if not board_path.exists():
       raise SystemExit(f"Board file not found: '{board_path}'")
   sch_path = board_path.with_suffix(".kicad_sch")
   if not sch_path.exists():
       raise SystemExit(
           f"Schematic not found at '{sch_path}'. "
           "Ensure the .kicad_sch file is in the same directory "
           "with the same basename as the .kicad_pcb file."
       )
   ```

2. **Script must implement**:
   - Command-line argument parsing (board path, optional fab
     service)
   - Input validation (file exists, kicad-cli available)
   - Gerber export for all layers
   - Drill file export (PTH + NPTH)
   - BOM export and fab-specific reformatting
   - Pick-and-place export with rotation corrections
   - Assembly drawing export (PDF)
   - Output directory creation and file organization
   - Gerber ZIP creation
   - Cross-artifact validation checks
   - Summary report printed to stdout

3. **Error handling**:
   - `kicad-cli` not found (print install instructions)
   - Export command failures (capture stderr, report which step
     failed)
   - Missing input files (clear error message)
   - BOM fields missing supplier part numbers (warn, don't fail)

4. **Configuration section**: Fab-specific settings at the top:
   ```python
   # --- Fab Service Configuration ---
   FAB_CONFIGS = {
       "jlcpcb": {
           "bom_columns": ["Comment", "Designator", "Footprint", "LCSC"],
           "supplier_field": "LCSC",
           "rotation_offsets": { ... },
           "gerber_format": "protel",
       },
       "pcbway": {
           "bom_columns": ["Item", "Qty", "Designator", "Package",
                           "Manufacturer", "MPN", "Supplier", "Supplier PN"],
           "supplier_field": "MPN",
           "rotation_offsets": {},
           "gerber_format": "protel",
       },
   }
   ```

5. **Present for user review**: After script execution, present:
   - Validation summary table
   - List of generated files with sizes
   - Any warnings (missing supplier PNs, unverified rotations)
   - Submission instructions for the target fab service
   - The user MUST review Gerbers in a viewer before submitting
