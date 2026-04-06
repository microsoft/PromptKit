<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: pcb-layout-design
type: reasoning
description: >
  Systematic reasoning protocol for PCB layout and routing from a
  completed schematic. Covers layout requirements gathering, board
  definition, design rules, component placement, routing strategy,
  and automated execution via Python pcbnew API with FreeRouting
  autorouter and KiCad DRC validation loop. Supports 2-layer and
  4-layer stackups.
applicable_to:
  - design-pcb-layout
  - hardware-design-workflow
---

# Protocol: PCB Layout Design

Apply this protocol when designing a PCB layout from a completed
schematic. The goal is to produce a routed, DRC-clean PCB design
file by generating a Python script that uses KiCad's `pcbnew` API
for board setup and component placement, FreeRouting for automated
trace routing, and `kicad-cli` for design rule validation. Execute
all phases in order.

**Input**: A completed KiCad schematic (`.kicad_sch`) with a netlist,
component footprint assignments, and the component selection report
from upstream phases. If footprints have not been assigned in the
schematic, this must be resolved before proceeding.

**Tool dependencies**: This protocol generates scripts and commands
that require the following tools to be installed:
- **KiCad** (version 7.0+ recommended) with the `pcbnew` Python API
- **FreeRouting** (`freerouting.jar`) for automated trace routing
- **Java runtime** (for FreeRouting execution)
- **kicad-cli** (included with KiCad 7.0+) for DRC validation

If any tool is unavailable, the protocol can still produce the layout
specification and placement script, but the routing and DRC phases
cannot be executed. Note this in the output.

## Phase 1: Input Validation

Verify all prerequisites before beginning layout design.

1. **Schematic completeness**: Verify the schematic is finalized:
   - All components have footprint assignments
   - All nets are named (no unnamed nets except power/ground)
   - ERC (Electrical Rules Check) passes with no errors
   - A netlist can be exported from the schematic

2. **Component footprint inventory**: For each component, confirm:
   - KiCad footprint library name and footprint name
   - Physical dimensions (from footprint or datasheet)
   - Mounting type (SMD, through-hole, module)
   - Any special placement requirements from the schematic
     (layout carry-forward notes like "place near connector",
     "differential pair", "keep short")

3. **Design constraints from upstream**: Extract from the component
   selection and schematic design:
   - Power dissipation per component (for thermal placement)
   - High-speed signals requiring impedance control
   - RF signals requiring clearance zones
   - Current-carrying traces requiring wider widths

4. **Target fabrication service**: Confirm the fab house and its
   design rule minimums (trace width, spacing, via drill, annular
   ring, board thickness). Common defaults:

   | Parameter | JLCPCB (standard) | PCBWay (standard) | OSH Park |
   |-----------|-------------------|-------------------|----------|
   | Min trace width | 0.127mm (5mil) | 0.1mm (4mil) | 0.152mm (6mil) |
   | Min spacing | 0.127mm (5mil) | 0.1mm (4mil) | 0.152mm (6mil) |
   | Min via drill | 0.3mm | 0.3mm | 0.254mm (10mil) |
   | Min annular ring | 0.13mm | 0.1mm | 0.127mm (5mil) |

   These are illustrative defaults; confirm against the fab's
   current specifications before use.

## Phase 2: Layout Requirements Gathering

Interactively gather the user's spatial and mechanical requirements.
Do NOT proceed to board definition until the user confirms these
requirements.

1. **Board form factor**: Ask the user:
   - Target board dimensions (or "as small as possible")
   - Board shape (rectangular, custom outline, panel constraints)
   - Mounting method (standoffs, snap-fit, adhesive, none)
   - Mounting hole locations (if applicable)

2. **Connector placement**: For each connector in the design, ask:
   - Which board edge should it be on? (top, bottom, left, right)
   - Specific position along the edge (centered, offset, corner)
   - Orientation (facing outward from edge, facing up, facing down)

3. **Component placement preferences**: Ask about any specific
   requirements:
   - MCU orientation or position preference
   - Battery connector / holder position
   - Antenna position and keepout zone
   - Display or LED positions (user-facing side)
   - Programming / debug header accessibility
   - Components that must be on a specific board side (top vs
     bottom)

4. **Mechanical constraints**: Ask about:
   - Enclosure fit (if enclosure exists, get internal dimensions)
   - Height clearance restrictions (top and bottom)
   - Keep-out zones (under components, near edges, near mounting
     holes)
   - Cable routing clearances

5. **Produce a layout requirements summary** for user confirmation:

   | Requirement | Detail |
   |-------------|--------|
   | Board size | 50mm × 30mm |
   | USB-C connector | Right edge, centered, facing outward |
   | Battery connector | Left edge, top corner |
   | Antenna | Top edge, right corner, 10mm keepout |
   | Programming header | Bottom edge, accessible |
   | Mounting holes | 4× M2.5, 3mm from corners |
   | ... | ... |

## Phase 3: Board Definition

Define the physical board structure.

1. **Board outline**: Define the board perimeter as a closed polygon
   on the `Edge.Cuts` layer:
   - Rectangular boards: origin at (0, 0), dimensions per user
     requirements
   - Corner radii if specified (common: 1mm–3mm fillet)
   - Cutouts or slots if required

2. **Layer stackup**: Define the PCB layer structure:

   **2-layer stackup**:
   | Layer | Name | Purpose |
   |-------|------|---------|
   | F.Cu | Front copper | Components + signal routing |
   | B.Cu | Back copper | Ground plane + routing overflow |
   | F.SilkS | Front silkscreen | Component outlines + labels |
   | B.SilkS | Back silkscreen | Labels |
   | F.Mask | Front solder mask | Pad openings |
   | B.Mask | Back solder mask | Pad openings |

   **4-layer stackup**:
   | Layer | Name | Purpose |
   |-------|------|---------|
   | F.Cu | Front copper | Components + signal routing |
   | In1.Cu | Inner 1 | Ground plane (continuous) |
   | In2.Cu | Inner 2 | Power plane |
   | B.Cu | Back copper | Signal routing + components |

3. **Mounting holes**: Place mounting hole footprints at the
   user-specified locations. Use `MountingHole:MountingHole_M2.5`
   or equivalent from KiCad's standard library.

4. **Board zones**: Define copper pour zones:
   - Ground pour on the back copper layer (2-layer) or inner
     ground layer (4-layer) covering the entire board
   - Power pour zones for specific rails if needed
   - Antenna keepout zones (no copper pour)

## Phase 4: Design Rule Configuration

Configure design rules matching the target fab house.

1. **Default design rules**: Set conservative defaults based on
   the fab house from Phase 1:
   - Default trace width: 0.25mm (10mil) for signals
   - Default clearance: 0.2mm (8mil)
   - Default via: 0.8mm pad, 0.4mm drill
   - Minimum trace width: per fab house minimum
   - Minimum clearance: per fab house minimum

2. **Net classes**: Define net classes with appropriate rules:

   | Net Class | Trace Width | Clearance | Via Size | Applies To |
   |-----------|-------------|-----------|----------|------------|
   | Default | 0.25mm | 0.2mm | 0.8/0.4mm | All signals |
   | Power | 0.5mm+ | 0.3mm | 1.0/0.5mm | VIN, VBAT, rail nets |
   | High-Speed | per impedance calc | 0.2mm | 0.6/0.3mm | USB D+/D-, SPI CLK |

   If a design requires smaller vias (e.g., 0.4/0.2mm), these are
   HDI/microvia features not supported by standard fab services —
   explicitly confirm fab capability before using them.

   Power trace width must be calculated from the current
   requirement using IPC-2221 (or a simplified formula:
   width_mm ≈ current_A / (0.048 × temp_rise_C^0.44) for
   1oz copper outer layer). Present the calculation.

3. **Impedance-controlled traces**: For USB differential pairs
   and other controlled-impedance signals:
   - Calculate trace width and spacing for the target impedance
     using the stackup geometry (dielectric thickness, copper
     weight, dielectric constant)
   - Typical USB 2.0: ~90Ω differential impedance
   - Document the impedance calculation or note that it requires
     a stackup calculator tool

4. **Thermal relief**: Configure thermal relief settings for
   connections to copper pours (spoke width and gap).

## Phase 5: Component Placement Strategy

Define the placement plan, merging user requirements with
engineering best practices.

1. **Placement priority order**:
   - **First**: Fixed-position components (connectors at user-
     specified edges, mounting holes, antenna)
   - **Second**: MCU / main controller (central position for
     shortest average trace length to peripherals)
   - **Third**: Power section (voltage regulators, inductors,
     bulk capacitors — grouped together, input near power
     connector, output toward loads)
   - **Fourth**: High-speed / sensitive components (close to MCU
     to minimize trace length — USB connector near USB pins,
     crystal near oscillator pins)
   - **Fifth**: Peripheral ICs (sensors, flash, etc. — placed
     near the MCU pins they connect to)
   - **Sixth**: Decoupling capacitors (as close as possible to
     each IC's power pins, preferably on the same side)
   - **Seventh**: Remaining passives (pull-ups, series resistors,
     filter components — near their associated IC)

2. **Placement rules**:
   - All components on the 1.27mm (50mil) placement grid
   - Minimum 1mm clearance between component courtyards
   - Decoupling capacitors within 3mm of the IC power pin
   - Crystal within 5mm of the MCU oscillator pins
   - No components in antenna keepout zones
   - All components on the top side unless space requires bottom
     placement (bottom-side SMD costs more for assembly)

3. **Thermal placement**:
   - Voltage regulators and power components: place with thermal
     vias to inner/back copper for heat spreading
   - Do not place temperature-sensitive components (sensors,
     crystals) adjacent to heat sources
   - Exposed pad components: ensure thermal pad is connected to
     ground plane via thermal vias (minimum 4 vias per exposed
     pad)

4. **Group placement verification**: Before routing, verify:
   - Signal flow is logical (input connectors → processing →
     output connectors)
   - Power flows from source to loads without doubling back
   - High-speed signals have short, direct paths
   - No components block connector access or mounting holes

## Phase 6: Routing Strategy

Define the routing approach for the autorouter and any manual
pre-routing.

1. **Pre-route critical signals** (before autorouter):
   - USB differential pairs: route as tightly coupled pairs with
     length matching, continuous reference plane underneath
   - Crystal traces: keep short and guard with ground pour
   - Analog signals: route away from switching regulators and
     digital signals
   - Power traces: wide traces from regulator output to load ICs

2. **Autorouter configuration**:
   - Route power nets first (wider traces, fewer vias)
   - Route high-speed nets second (controlled impedance)
   - Route remaining signals last
   - Allow vias but minimize via count (each via adds inductance
     and manufacturing cost)
   - Prefer routing on fewer layers (minimize layer transitions)

3. **Ground plane strategy**:
   - 2-layer: pour ground on the back copper layer, connect with
     vias near every IC ground pin and decoupling capacitor ground
   - 4-layer: dedicate In1.Cu as a continuous ground plane — do
     NOT route signals on the ground layer
   - Avoid slots, cuts, or long gaps in the ground plane under
     signal traces
   - Place ground vias near every signal via to provide a return
     current path

4. **Power distribution**:
   - 2-layer: use wide traces (≥ 0.5mm) or short copper pours
     for power distribution
   - 4-layer: use In2.Cu as a power plane, connect with vias

5. **DFM (Design for Manufacturing) routing rules**:
   - No acute-angle traces (use 45° bends, not sharp corners)
   - Avoid trace routing under BGA/QFN pads unless necessary
   - Maintain clearance from board edges (≥ 0.5mm for traces,
     ≥ 1mm for components)
   - Teardrops on pad-to-trace transitions if the fab supports
     them

## Phase 7: Python Script Generation

Generate a Python script using KiCad's `pcbnew` API that implements
the board setup, placement, and design rules from Phases 3–6.

1. **Script structure**:

   ```python
   #!/usr/bin/env python3
   """PCB layout script generated by PromptKit.
   
   Prerequisites:
     - KiCad 7.0+ with pcbnew Python API
     - A .kicad_pcb file with footprints and nets imported from
       the schematic (run "Update PCB from Schematic" in KiCad
       at least once before running this script)
   
   Usage:
     python3 layout.py path/to/board.kicad_pcb
   """
   import pcbnew
   import sys
   
   if len(sys.argv) != 2:
       print("Usage: python3 layout.py path/to/board.kicad_pcb",
             file=sys.stderr)
       raise SystemExit(1)
   
   board_path = sys.argv[1]
   
   # Load the board (must already have footprints/nets from schematic)
   try:
       board = pcbnew.LoadBoard(board_path)
   except Exception as exc:
       raise SystemExit(f"Failed to load board '{board_path}': {exc}")
   
   # --- Configuration (user-adjustable) ---
   BOARD_WIDTH_MM = ...
   BOARD_HEIGHT_MM = ...
   # Component positions: {ref_des: (x_mm, y_mm, rotation_deg, side)}
   PLACEMENT = { ... }
   # Net class definitions
   NET_CLASSES = { ... }
   # Design rules
   MIN_TRACE_WIDTH = ...
   MIN_CLEARANCE = ...
   # ...
   ```

2. **Board loading prerequisite**: The script MUST load an existing
   `.kicad_pcb` file that has been populated with footprints and
   nets from the schematic. The standard KiCad workflow is:
   - User opens the KiCad project
   - Runs "Update PCB from Schematic" (Tools → Update PCB from
     Schematic) which imports all footprints and net connections
   - Saves the `.kicad_pcb` file
   - Then runs this script on the saved file

   Do NOT assume `kicad-cli pcb new` or other CLI commands for
   board creation are available or portable across KiCad versions.
   The script should use `pcbnew.LoadBoard(path)` to load the
   existing board.

3. **Script must implement**:
   - Board outline creation on `Edge.Cuts`
   - Layer stackup configuration
   - Design rule and net class setup
   - Component placement from the `PLACEMENT` dictionary
   - Mounting hole placement
   - Copper zone (pour) definitions
   - Export to Specctra DSN format for FreeRouting:
     `pcbnew.ExportSpecctraDSN(board, "board.dsn")`
   - Save the board back to the input path:
     `board.Save(sys.argv[1])`

4. **Configuration section**: All user-adjustable parameters
   (board dimensions, component positions, design rules) must be
   in a clearly marked configuration section at the top of the
   script, not buried in the code. This allows the user to tweak
   placement without reading the entire script.

5. **Error handling**: The script must handle common errors:
   - Missing or invalid command-line board path (print usage and
     verify the `.kicad_pcb` file exists)
   - `pcbnew.LoadBoard(path)` failures (report that the board
     could not be opened or parsed)
   - Loaded board is missing expected footprints or nets (advise
     the user to run "Update PCB from Schematic" and save the
     board before running the script)
   - DSN export failures (`pcbnew.ExportSpecctraDSN`)
   - SES import failures (`pcbnew.ImportSpecctraSES`)

## Phase 8: Autorouting Execution

Route the board using FreeRouting and validate the result.

1. **FreeRouting invocation**:
   ```bash
   java -jar freerouting.jar -de board.dsn -do board.ses -mp 20
   ```
   - `-de`: input DSN file (from pcbnew export)
   - `-do`: output SES file (routed session)
   - `-mp`: maximum passes (20 is a reasonable default; increase
     for complex boards)

2. **Import routing result**:
   ```python
   pcbnew.ImportSpecctraSES(board, "board.ses")
   ```

3. **Post-routing steps** (in the Python script):
   - Fill all copper zones: `filler = pcbnew.ZONE_FILLER(board);
     filler.Fill(board.Zones())`
   - Remove unused copper (islands)
   - Save the routed board

4. **Routing completeness check**: After import, verify:
   - All nets are routed (no unconnected ratsnest lines)
   - If FreeRouting could not route all nets, report which nets
     remain unrouted — these may require manual routing or
     placement adjustment

5. **If routing fails or is incomplete**:
   - Identify the unroutable nets
   - Analyze whether the failure is a placement issue (components
     too close, blocking routing channels) or a design rule issue
     (traces too wide for available space)
   - Suggest placement adjustments and re-run from Phase 7

## Phase 9: DRC Validation Loop

Run KiCad's Design Rule Check and iterate until clean.

1. **Run DRC**:
   ```bash
   kicad-cli pcb drc -o drc-report.json --format json \
     --severity-all board.kicad_pcb
   ```

2. **Parse DRC results**: Classify each violation:
   - **Clearance violation**: Trace-to-trace, trace-to-pad, or
     pad-to-pad spacing below the minimum → adjust routing or
     increase spacing in design rules
   - **Unconnected net**: A ratsnest connection was not routed →
     re-run autorouter or flag for manual routing
   - **Track width violation**: A trace is narrower than the net
     class minimum → widen the trace or adjust the net class
   - **Via violation**: Via drill or annular ring below minimum →
     increase via size in design rules
   - **Courtyard overlap**: Component courtyards overlap →
     increase component spacing in placement
   - **Edge clearance**: Trace or component too close to board
     edge → adjust placement or routing
   - **Zone fill issue**: Copper pour problem → re-run zone fill

3. **Automated fix strategy**:
   - For clearance and width violations: increase the affected
     design rule parameter and re-run from Phase 8
   - For courtyard overlaps: adjust component positions in the
     placement configuration and re-run from Phase 7
   - For unconnected nets: adjust placement to open routing
     channels and re-run from Phase 7
   - Maximum 5 iterations — if DRC violations persist after 5
     attempts, report the remaining violations and request user
     intervention

4. **DRC clean target**: The board is considered DRC-clean when:
   - Zero violations (errors)
   - Warnings are acceptable (document each accepted warning
     with justification)

5. **Produce a DRC summary**:

   | Iteration | Violations | Warnings | Action Taken |
   |-----------|------------|----------|--------------|
   | 1 | 12 | 3 | Increased clearance to 0.2mm |
   | 2 | 2 | 3 | Moved U3 2mm right |
   | 3 | 0 | 3 | Clean — warnings accepted |

## Phase 10: Self-Audit Checklist

Before presenting the layout to the user, cross-check against the
`layout-design-review` protocol's phases.

1. **DRC report (audit Phase 1)**: All violations resolved, warnings
   documented and justified.

2. **Trace width and current capacity (audit Phase 2)**: Power trace
   widths verified against IPC-2221 for the actual current loads.

3. **Impedance and signal integrity (audit Phase 3)**: USB
   differential pairs are length-matched and properly coupled.
   Reference planes are continuous under controlled-impedance traces.

4. **Component placement (audit Phase 4)**: Decoupling caps within
   3mm of IC power pins. Antenna keepout zones respected. Connectors
   at board edges per user requirements. Thermal vias under exposed
   pads.

5. **Ground plane and power integrity (audit Phase 5)**: Ground plane
   is continuous (no unintentional slots). Power distribution is
   adequate (no narrow necks in power pours).

6. **Manufacturing constraints (audit Phase 6)**: All features meet
   the target fab house's minimums. Board outline is within fab
   capabilities. Silkscreen is clear and legible. Fiducials present
   if required by the assembly service.

7. **Document any findings** from the self-audit. Fix Critical and
   High findings before presenting. Present Medium and Low findings
   to the user as notes.

8. **Present for user review**: Show the user:
   - Board dimensions and layer stackup
   - Component placement visualization (top and bottom views)
   - Routing completion status
   - DRC summary
   - Any remaining findings or warnings
   - The generated Python script for their review and modification

   The user MUST approve the layout before proceeding to
   manufacturing artifact generation.
