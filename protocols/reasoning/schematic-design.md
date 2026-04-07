<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: schematic-design
type: reasoning
description: >
  Systematic reasoning protocol for designing a circuit schematic from
  requirements and selected components. Covers power architecture,
  supporting circuitry derivation from datasheets, signal routing,
  protection circuits, and KiCad .kicad_sch S-expression generation
  with explicit visual layout rules for correct rendering.
applicable_to:
  - design-schematic
  - hardware-design-workflow
---

# Protocol: Schematic Design

Apply this protocol when designing a circuit schematic from a set of
selected components and requirements. The goal is to produce a
complete, correct, and visually readable KiCad schematic file
(`.kicad_sch` S-expression format) that includes all supporting
circuitry derived from component datasheets. Execute all phases in
order.

**Input**: A component selection report (from the `component-selection`
protocol or equivalent) containing selected components with part
numbers, key specifications, inter-component interfaces, and
datasheet references. If no formal selection report exists, the user
must provide the list of core components and their datasheets.

**If datasheet access is unavailable**: Do not fabricate reference
circuit values. Ask the user to provide datasheet excerpts (reference
circuit schematics, recommended component values, pin configurations)
or mark derived values as `[UNVERIFIED — datasheet not consulted]`.
Typical values given throughout this protocol (e.g., "typically
100nF", "1kΩ–10kΩ") are illustrative examples of common engineering
practice — they must be confirmed against the actual component
datasheet before use as final design values. If a datasheet cannot
be consulted, present such values only as `[UNVERIFIED]` examples,
not as selected or recommended values.

## Phase 1: Input Validation

Verify all prerequisites before beginning schematic design.

1. **Component inventory**: For each selected component, confirm:
   - Full part number and manufacturer
   - Package/footprint
   - Operating voltage range
   - Pin count and pinout (from datasheet or user-provided data)
   - Required interfaces (I2C, SPI, UART, USB, analog, GPIO)

2. **Inter-component connections**: From the component selection
   report's compatibility matrix, extract:
   - Which components connect to which, via what interface
   - Voltage domains for each connection
   - Any level shifting requirements flagged during selection

3. **Power source identification**: Identify the primary power
   source (battery, USB, external DC) and the voltage rails
   required by all selected components (from the selection
   report's downstream implications).

4. **Missing information**: If any of the above is incomplete,
   stop and request the missing data from the user before
   proceeding. Do NOT assume pin assignments or electrical
   characteristics.

## Phase 2: Power Architecture Design

Design the complete power delivery network from source to loads.

1. **Power tree design**: Map the path from the power source to
   each voltage rail:
   - Source (battery, USB VBUS, external DC) → regulation →
     output rail → consumers
   - For each rail, specify: nominal voltage, tolerance, maximum
     current (sum of all consumers from the component selection
     power budget)

2. **Regulator selection and passive calculation**: For each
   voltage conversion stage:
   - **LDO regulators**: Select when dropout voltage allows and
     current is moderate (< 500mA typical). Calculate:
     - Input capacitor: per datasheet recommendation (typically
       1µF–10µF ceramic)
     - Output capacitor: per datasheet recommendation (check ESR
       requirements for stability)
     - Enable pin: tie to input or add enable control as needed
   - **Switching regulators (buck/boost/buck-boost)**: Select when
     efficiency matters or dropout is insufficient. Calculate:
     - Inductor value and saturation current from datasheet formula
     - Input/output capacitors per datasheet (note ripple current
       requirements)
     - Feedback resistor divider: R1/R2 to set output voltage
       using the datasheet formula (Vout = Vref × (1 + R1/R2))
     - Bootstrap capacitor if required
     - Compensation network if external (per datasheet application
       notes)
   - **Cite datasheet section** for every passive value chosen

3. **Battery management** (if battery-powered):
   - Charge controller circuit (if rechargeable)
   - Battery protection (undervoltage lockout, overcurrent)
   - Power path management (USB charging while operating)

4. **Power sequencing**: If any components require sequenced
   power-on (e.g., core before I/O):
   - Design enable pin chaining or sequencing circuit
   - Verify reset is held until all rails are stable

## Phase 3: Supporting Circuitry Design

For each selected component, derive all required support circuits
from its datasheet.

1. **Decoupling capacitors**: For every IC power pin:
   - Place a decoupling capacitor per the datasheet recommendation
   - Typical: 100nF ceramic (MLCC) close to each VDD pin
   - Bulk capacitor (4.7µF–10µF) per voltage domain if recommended
   - Note capacitor voltage rating (≥ 1.5× rail voltage for
     derating)

2. **Crystal/oscillator circuits** (if required):
   - Crystal load capacitors: calculate from the crystal's
     specified load capacitance and PCB stray capacitance
     (CL = (C1 × C2) / (C1 + C2) + Cstray)
   - Series resistor if recommended by the MCU datasheet
   - Feedback resistor (typically 1MΩ) if required

3. **Reset circuits**: For each IC with a reset pin:
   - External RC delay circuit or voltage supervisor
   - Reset release timing must meet the IC's minimum power-on
     reset hold time
   - Optional external reset button with debounce

4. **Boot/strap pin configuration**: For each IC with mode
   selection pins:
   - Pull-up or pull-down resistors to set the desired boot mode
   - Resistor values strong enough to override parasitic loading
   - Document the selected configuration and its meaning

5. **Pull-up/pull-down resistors**: For open-drain outputs,
   interrupt lines, and enable pins:
   - Calculate values based on bus speed and capacitance for I2C
   - Typical pull-up values: 2.2kΩ–10kΩ for I2C, 10kΩ for
     general-purpose GPIO

6. **Analog signal conditioning** (if applicable):
   - Voltage dividers for ADC input scaling
   - Anti-aliasing filters (RC low-pass) for ADC inputs
   - Reference voltage circuits

## Phase 4: Signal Routing Design

Design inter-component signal connections.

1. **I2C bus design**:
   - Connect SDA and SCL lines to all devices on the bus
   - Add pull-up resistors to the appropriate voltage rail
     (only one set per bus, not per device)
   - Verify no I2C address conflicts (check each device's
     address and address pin configuration)
   - If address conflict exists, design an I2C multiplexer circuit
     or use separate buses

2. **SPI bus design**:
   - Connect shared MOSI, MISO, CLK lines
   - Assign a unique chip select (CS) line per device
   - Add pull-up resistors on unused CS lines (active-low)
   - Verify MISO tri-state behavior when CS is deasserted

3. **UART connections**:
   - Cross TX→RX, RX→TX between endpoints
   - Add series resistors (100Ω–220Ω) if recommended
   - Connect flow control (RTS/CTS) if required

4. **USB connections**:
   - D+ and D- from connector through ESD protection to
     transceiver IC
   - Series resistors (27Ω) on D+/D- if required by the IC
   - Pull-up resistor on D+ (for full-speed) or D- (for
     low-speed) if not internal to the IC
   - VBUS sensing circuit if required
   - Shield/chassis ground connection at connector
   - Flag for layout: differential pair routing required

5. **GPIO and control signals**:
   - LED indicators with current-limiting resistors
     (R = (Vcc - Vf) / If, typically 1kΩ–10kΩ for indicator LEDs)
   - Button/switch inputs with debounce circuits (RC + Schmitt
     trigger or software debounce with hardware pull-up)
   - Enable/shutdown control lines with proper pull states at
     power-on

6. **Test points**: Place test points on:
   - Every power rail
   - Reset line
   - Programming/debug interface (SWD, JTAG, UART console)
   - Critical signals identified during component selection

## Phase 5: Protection Circuit Design

Design protection circuits for external interfaces.

1. **ESD protection on external connectors**: For every connector
   that interfaces outside the enclosure (USB, antenna, sensor
   headers, debug ports):
   - Place TVS diode array or dedicated ESD protection IC
   - Clamping voltage must be below the protected IC's absolute
     maximum rating
   - Place in the schematic topology directly at the connector
     (before any series components)
   - Flag for layout: place physically close to the connector

2. **Reverse polarity protection** (on battery/DC power input):
   - Design protection circuit: P-MOSFET (preferred for low
     voltage drop) or series Schottky diode (simpler, higher drop)
   - Verify voltage drop is acceptable at minimum input voltage

3. **Overcurrent protection** (on power inputs):
   - Place resettable fuse (PTC) or traditional fuse
   - Rating: above maximum expected current, below the power
     source's maximum current capacity

4. **Overvoltage protection** (if input voltage could exceed
   regulator maximum):
   - TVS or Zener clamping circuit
   - Verify clamping voltage is below the regulator's absolute
     maximum input

## Phase 6: Net Naming and Annotation

Assign clear, systematic names to all nets and components.

1. **Power net naming convention**:
   - `+3V3`, `+5V`, `+VBAT`, `+VIN` for power rails
   - `GND` for ground (single ground domain)
   - `AGND`, `DGND` if separate analog/digital grounds
   - `+3V3_SW` for switched/gated rails

2. **Signal net naming convention**:
   - Bus signals: `I2C0_SDA`, `I2C0_SCL`, `SPI0_MOSI`,
     `SPI0_MISO`, `SPI0_CLK`
   - Chip selects: `SPI0_CS_FLASH`, `SPI0_CS_SENSOR`
   - UART: `UART0_TX`, `UART0_RX`
   - GPIO: `LED_STATUS`, `BTN_USER`, `SENSOR_INT`
   - Reset: `MCU_NRST`, `SENSOR_NRST`

3. **Reference designator assignment**:
   - U: ICs (U1, U2, ...)
   - R: Resistors (R1, R2, ...)
   - C: Capacitors (C1, C2, ...)
   - L: Inductors (L1, L2, ...)
   - D: Diodes (D1, D2, ...)
   - J: Connectors (J1, J2, ...)
   - Y: Crystals/oscillators (Y1, Y2, ...)
   - FB: Ferrite beads (FB1, FB2, ...)
   - F: Fuses (F1, F2, ...)
   - SW: Switches (SW1, SW2, ...)
   - TP: Test points (TP1, TP2, ...)
   - Assign sequentially within each functional group

4. **Schematic annotations**: Add text notes for:
   - Voltage rail values near power symbols
   - Critical signal constraints (e.g., "differential pair",
     "impedance controlled", "keep short")
   - Datasheet references for non-obvious passive values
   - Assembly notes (e.g., "DNP for option B")

## Phase 7: Schematic Organization

Decide how to organize the schematic for readability.

1. **Single-sheet vs hierarchical**:
   - Use a single sheet if the design fits comfortably (< ~50
     components, < ~30 ICs)
   - Use hierarchical sheets for larger designs, organized by
     function:
     - `power.kicad_sch` — power input, regulation, battery
       management
     - `mcu.kicad_sch` — MCU and closely coupled peripherals
       (crystal, decoupling, reset, programming header)
     - `sensors.kicad_sch` — sensor ICs and conditioning circuits
     - `connectivity.kicad_sch` — wireless module, antenna,
       matching network
     - `connectors.kicad_sch` — external connectors, ESD
       protection, test points

2. **Functional grouping on each sheet**:
   - Group related components together (IC + its decoupling caps +
     its pull-ups)
   - Separate power section (top or left of sheet) from signal
     section
   - Place connectors at sheet edges

3. **Inter-sheet connections**: Use hierarchical labels for
   signals that cross sheet boundaries. Use power symbols (global
   power flags) for power rails — these connect automatically
   across sheets.

4. **Title block**: Include project name, sheet title, revision,
   date, and author in every sheet's title block.

5. **Page boundary and placement area**: All component origins MUST
   fall within the page drawing area with a minimum margin of 25mm
   from all page borders. Before generating coordinates, calculate
   the placement area from the selected page size:

   | Page Size | Drawing Area (W × H mm) | Usable Area (with 25mm margins) |
   |-----------|------------------------|---------------------------------|
   | A4        | 297 × 210              | 247 × 160 (x: 25–272, y: 25–185) |
   | A3        | 420 × 297              | 370 × 247 (x: 25–395, y: 25–272) |

   Verify the selected page size can accommodate all components at
   the required spacing (20.32mm minimum). If not, use a larger page
   or hierarchical sheets.

## Phase 8: KiCad Schematic Generation

Generate the `.kicad_sch` S-expression file(s) with correct visual
rendering. This phase contains mandatory rules that prevent the
"structurally correct but visually wrong" failure mode.

### 8.0: Approach-Level Gate (BEFORE writing any code)

Before writing any schematic generation code, symbol templates, or
helper functions, complete these front-loaded checks. These catch
approach-level errors before they propagate to every symbol and wire
in the design.

1. **Verify one symbol against the dimension table.** Pick the
   simplest symbol you will generate (e.g., a resistor). Write its
   `lib_symbols` entry with graphical body and pins. Verify:
   - Body rectangle ≥ 2.032mm in both dimensions (§8.3 table)
   - Pin span (tip-to-tip) ≥ 7.62mm for 2-pin passives
   - Pin length ≥ 1.27mm
   - A `_0_1` sub-symbol with at least one graphical primitive exists
   - A `_1_1` sub-symbol with pin definitions exists

   If your first symbol fails any of these, fix it before proceeding.
   Every subsequent symbol will be built from the same patterns.

2. **Verify placement fits the page.** Compute bounding boxes for all
   functional blocks (§8.2 rule 9). Sum total extent plus inter-block
   gaps plus 25mm margins per side. Verify the result fits within the
   selected page size. If not, choose a larger page or split into
   hierarchical sheets NOW — not after placing 20 components.

3. **Check for existing code divergence.** If reusing any existing
   symbol generation code, compare its pin positions and body
   dimensions against the §8.3 mandatory dimension table BEFORE
   using it. If any dimension is smaller than the table's values,
   the existing code is non-conforming — do NOT use it as-is.

### 8.1: KiCad S-Expression Structure

A `.kicad_sch` file has this top-level structure:

```
(kicad_sch
  (version 20231120)
  (generator "promptkit")
  (uuid "<random-uuid>")
  (paper "A4")
  (title_block
    (title "<project name>")
    (date "<YYYY-MM-DD>")
    (rev "<revision>")
  )
  ;; Symbol library definitions — MUST include graphical body
  (lib_symbols ...)
  ;; Component instances (includes ICs, passives, connectors,
  ;; and power symbols like power:GND, power:+3V3, power:PWR_FLAG)
  (symbol ...)
  ;; Wires
  (wire ...)
  ;; Labels
  (label ...)
  (global_label ...)
  (hierarchical_label ...)
  ;; No-connect markers
  (no_connect ...)
  ;; Junctions
  (junction ...)
  ;; Sheet instances (for hierarchical)
  (sheet_instances ...)
)
```

**Critical: `lib_symbols` graphical body requirement.** KiCad schematic
files are self-contained — the `(lib_symbols ...)` section MUST embed
the **complete symbol definition** for every symbol used, including
graphical primitives that make the symbol visible. A symbol with only
pin definitions but no graphical body will produce a schematic that
passes ERC and has correct connectivity but **renders as completely
empty** when opened in the KiCad editor.

Each symbol definition inside `lib_symbols` uses a **two-level
sub-symbol structure**:

```
(symbol "<LibName>:<PartName>"
  (in_bom yes) (on_board yes)

  ;; Sub-symbol _0_1: GRAPHICAL BODY (what makes it visible)
  (symbol "<LibName>:<PartName>_0_1"
    ;; Rectangles, polylines, arcs, circles — at least one required
    (rectangle (start <x1> <y1>) (end <x2> <y2>)
      (stroke (width 0) (type default))
      (fill (type none)))
    ;; Additional graphical primitives as needed:
    ;; (polyline (pts (xy ...) (xy ...)) (stroke ...) (fill ...))
    ;; (circle (center ...) (radius ...) (stroke ...) (fill ...))
    ;; (arc (start ...) (mid ...) (end ...) (stroke ...) (fill ...))
    ;; (text "label text" (at x y) (effects (font (size ...))))
  )

  ;; Sub-symbol _1_1: PINS (what defines connectivity)
  (symbol "<LibName>:<PartName>_1_1"
    (pin <electrical_type> <graphical_style> (at <x> <y> <angle>)
      (length <len>)
      (name "<pin_name>" (effects (font (size 1.27 1.27))))
      (number "<pin_num>" (effects (font (size 1.27 1.27)))))
    ;; ... more pins ...
  )
)
```

**Both sub-symbols are required.** The `_0_1` sub-symbol contains the
visual body (at minimum one `(rectangle ...)` for ICs or one
`(polyline ...)` for passives). The `_1_1` sub-symbol contains pin
definitions. Omitting the `_0_1` sub-symbol or leaving it empty
produces an invisible component.

**Pin coordinate rule:** Pin `(at ...)` coordinates are relative to
the symbol origin (0, 0). The pin endpoint (where wires attach) is at
the pin's `(at ...)` position. The pin extends inward by `(length ...)`
toward the symbol body. Pin angles: 0 = extends left (pin end on
right), 90 = extends down (pin end on top), 180 = extends right (pin
end on left), 270 = extends up (pin end on bottom).

### 8.2: Visual Layout Rules (MANDATORY)

These rules prevent common visual rendering failures. Violating any
of these rules produces a schematic that is hard to read or has
disconnected wires in KiCad.

1. **Grid alignment**: ALL coordinates (component positions, wire
   endpoints, labels) MUST snap to a 2.54mm (100mil) grid.
   Coordinates are in millimeters in the S-expression format.
   Valid X/Y values are multiples of 2.54 (e.g., 0, 2.54, 5.08,
   7.62, 10.16, ..., 25.4, 27.94, ...).

2. **Component spacing**: Minimum 20.32mm (800mil = 8 grid units)
   between component bodies horizontally and vertically. This
   leaves room for wires, labels, and reference designators.
   For ICs with many pins, increase spacing proportionally.

3. **Signal flow direction**: Arrange components so signals flow
   left-to-right across the sheet. Inputs on the left, outputs
   on the right. Power flows top-to-bottom (power source at top,
   ground at bottom).

4. **Component orientation**: Place components with pin 1 / pin A
   in the conventional orientation:
   - ICs: pin 1 at top-left
   - Resistors/capacitors: horizontal (for series elements in
     signal path) or vertical (for shunt elements to ground/power)
   - Diodes: anode left, cathode right (for signal path) or
     anode top, cathode bottom (for protection to ground)
   - Connectors: at sheet edges, pins facing inward

5. **Wire routing rules**:
   - **Every pin MUST have a wire segment** — net labels and power
     symbols alone create electrical connections but are visually
     unreadable without wire stubs. A pin with only a label placed
     directly on its endpoint is prohibited.
   - **Intra-block wires vs. inter-block labels**: Within a
     functional block (e.g., an IC and its decoupling caps,
     pull-ups, and supporting passives), components sharing a net
     MUST be connected by **direct wires**. The reader should be
     able to trace the circuit within a block without reading label
     text. **Net labels are for inter-block connections only** —
     signals that cross from one functional block to another (e.g.,
     VBAT from the power block to the MCU block).

   **Negative example — what BAD connectivity looks like:**
   ```
   BAD: Label directly on pin, no wire, label-only inter-component
   ┌──────┐              ┌──────┐
   │  IC  ├─VDD          │  C1  ├─VDD
   └──────┘              └──────┘
   (No wire between IC VDD pin and C1 — just matching labels.
    Electrically valid but visually the reader cannot see these
    are connected without reading every label on the sheet.)

   GOOD: Direct wire within block, label only for inter-block
   ┌──────┐    wire     ┌──────┐
   │  IC  ├────────────┤  C1  │   (intra-block: direct wire)
   └──┬───┘             └──────┘
      │wire
      ├──VDD_SENSOR               (inter-block: label on stub)
   ```
   If your schematic looks like the BAD example — labels everywhere,
   no wires between nearby components — you have violated this rule.

   - Wires MUST be orthogonal (horizontal or vertical segments
     only — no diagonal wires)
   - Wire endpoints MUST align exactly with component pin
     endpoints (same X,Y coordinate) for KiCad to register a
     connection
   - Place junction dots where three or more wires meet at a
     point (KiCad requires explicit `(junction ...)` entries)
   - NEVER route wires through component bodies

6. **Label placement**:
   - Net labels MUST be placed on short wire stubs (2.54mm–5.08mm)
     extending from pins — NEVER placed directly on pin endpoints
     without a wire. Labels overlapping pin endpoints are unreadable
     and obscure the connection.
   - Power symbols (VCC, GND, +3V3) placed on short vertical
     wire stubs above (power) or below (ground) the connection
     point
   - Global labels for inter-sheet connections placed at sheet
     edges with short wire stubs

7. **No-connect markers**: Place `(no_connect ...)` on every
   intentionally unconnected pin. KiCad will produce ERC warnings
   for unconnected pins without markers.

8. **Power flags**: Place at least one `PWR_FLAG` on every power
   net that is driven by a regulator output or connector pin
   (not by a power symbol). This satisfies KiCad's ERC power
   source checks.

9. **Layout composition algorithm**: To systematically place
   components on the schematic sheet, follow this procedure:

   **Step 1 — Define functional blocks.** Group all components
   into logical blocks (e.g., "Power Input", "Voltage Regulation",
   "MCU", "Sensor 1", "Connectors"). Each block contains one
   primary IC or connector plus its supporting passives (decoupling
   caps, pull-ups, series resistors).

   **Step 2 — Compute each block's bounding box.** For each block:
   - Count the components and their pin spans
   - Block width = max(primary IC width, number of horizontal
     passives × 10.16mm) + 2 × stub length (5.08mm) + 2 × label
     margin (7.62mm)
   - Block height = (number of pin rows on tallest component ×
     2.54mm) + (number of supporting passives stacked vertically
     × 10.16mm) + 2 × stub length (5.08mm)
   - Minimum block size: 25.4mm × 25.4mm

   **Step 3 — Arrange blocks in a grid.** Place blocks following
   signal flow and power hierarchy:
   - **Left column**: Power input, battery, protection
   - **Center column**: Voltage regulation, MCU/controller
   - **Right column**: Peripherals, sensors, output connectors
   - **Top row**: Power chain (left to right)
   - **Bottom row**: Signal chain (left to right)
   - Inter-block gap: max(20.32mm, tallest label text in either
     adjacent block × 1.27mm + 5.08mm)

   **Step 4 — Determine page size from total extent.** Sum all
   block bounding boxes plus inter-block gaps, then add 25mm
   margins on all sides:

   | Total component count | Recommended page |
   |-----------------------|------------------|
   | ≤ 15 components       | A4 (297 × 210mm) |
   | 16–40 components      | A3 (420 × 297mm) |
   | 41–80 components      | A2 (594 × 420mm) |

   If the total extent exceeds the page, use hierarchical sheets
   (one block per sheet) instead of increasing page size further.

   **Step 5 — Assign absolute coordinates.** Convert each block's
   grid position to absolute coordinates on the page. Start the
   first block at (25.4, 25.4) — the top-left of the usable area.
   All coordinates must snap to the 2.54mm grid.

### 8.3: Component Symbol References

> ⚠️ **EXISTING CODE IS ASSUMED NON-CONFORMING.** If the repository
> contains existing schematic generation code (helper functions,
> templates, or prior `.kicad_sch` files), it predates these standards
> and MUST NOT be trusted. Do NOT copy symbol dimensions, graphical
> body patterns, or connectivity patterns from existing functions
> without verifying each value against the mandatory dimension table
> below. Common non-conformances in existing code: undersized symbol
> bodies (e.g., 0.762mm instead of 2.032mm), missing `_0_1` graphical
> sub-symbols, label-only connectivity without wire stubs, pin lengths
> below 1.27mm, and hardcoded coordinates outside the page area.

When generating symbol instances, use KiCad's standard library
symbol names where available:

- Resistors: `Device:R`
- Capacitors: `Device:C`, `Device:C_Polarized`
- Inductors: `Device:L`
- LEDs: `Device:LED`
- Diodes: `Device:D`, `Device:D_Schottky`, `Device:D_Zener`,
  `Device:D_TVS`
- Generic transistors: `Device:Q_NPN_BEC`, `Device:Q_PMOS_GDS`
- Connectors: `Connector_Generic:Conn_01x01`,
  `Connector_Generic:Conn_01x02`, `Connector_Generic:Conn_01x04`,
  etc. — substitute the actual pin count into the symbol name
  (e.g., a 6-pin header uses `Connector_Generic:Conn_01x06`)
- Power symbols: `power:GND`, `power:+3V3`, `power:+5V`,
  `power:VCC`, `power:PWR_FLAG`
- Test points: `TestPoint:TestPoint`

**Every symbol referenced above MUST have a complete definition in
the `lib_symbols` section**, including the graphical body sub-symbol
(`_0_1`). KiCad schematic files are self-contained — they do NOT
load symbols from external library files at render time. Even
standard library symbols like `Device:R` must have their full
graphical definition embedded in the file.

#### Extracting Standard Symbols from KiCad (PREFERRED)

Standard components (resistors, capacitors, inductors, diodes,
transistors, connectors, power symbols) have **well-known electrical
schematic symbols** — zigzag or rectangle for resistors, parallel
plates for capacitors, triangle-and-bar for diodes, gate/drain/source
arrow for MOSFETs, etc. Using plain rectangles for passives and
transistors is non-conforming — it produces technically valid but
visually wrong schematics that no engineer would recognize.

The **preferred method** for obtaining correct symbol definitions is
to extract them from KiCad's installed standard library files:

```python
# Extract a symbol definition from KiCad's standard library
import subprocess, re

def extract_kicad_symbol(lib_name: str, symbol_name: str) -> str:
    """Extract a symbol definition from KiCad's installed libraries.

    Args:
        lib_name: Library name (e.g., "Device", "power",
                  "Connector_Generic")
        symbol_name: Symbol name (e.g., "R", "C", "GND",
                     "Q_PMOS_GDS", "Conn_01x07")

    Returns:
        The complete (symbol ...) S-expression block for embedding
        in a .kicad_sch lib_symbols section.

    KiCad library paths:
        Windows: C:\\Program Files\\KiCad\\<version>\\share\\kicad\\symbols\\
        Linux:   /usr/share/kicad/symbols/
        macOS:   /Applications/KiCad/KiCad.app/Contents/SharedSupport/symbols/
    """
    import glob, os
    # Find the library file
    search_paths = [
        "C:/Program Files/KiCad/*/share/kicad/symbols",
        "/usr/share/kicad/symbols",
        "/Applications/KiCad/KiCad.app/Contents/SharedSupport/symbols",
    ]
    lib_file = None
    for pattern in search_paths:
        for path in glob.glob(pattern):
            candidate = os.path.join(path, f"{lib_name}.kicad_sym")
            if os.path.exists(candidate):
                lib_file = candidate
                break
        if lib_file:
            break

    if not lib_file:
        raise FileNotFoundError(
            f"KiCad library '{lib_name}.kicad_sym' not found. "
            f"Searched: {search_paths}")

    with open(lib_file, "r") as f:
        content = f.read()

    # Extract the symbol block
    full_name = f"{lib_name}:{symbol_name}"
    # Find the top-level (symbol "Name" ...) block
    pattern = rf'\(symbol "{re.escape(symbol_name)}"'
    match = re.search(pattern, content)
    if not match:
        raise ValueError(
            f"Symbol '{symbol_name}' not found in {lib_file}")

    # Extract balanced parentheses
    start = match.start()
    depth = 0
    for i in range(start, len(content)):
        if content[i] == '(':
            depth += 1
        elif content[i] == ')':
            depth -= 1
            if depth == 0:
                return content[start:i+1]

    raise ValueError(f"Malformed symbol block for '{symbol_name}'")
```

**Usage**: For every standard symbol in the design, call
`extract_kicad_symbol("Device", "R")`, etc., and embed the returned
S-expression in the `lib_symbols` section. This gives you the real
graphical shapes — zigzag resistors, capacitor plates, MOSFET arrows,
diode triangles — not simplified rectangles.

**If KiCad is not installed** or the library files cannot be found,
fall back to the inline examples below. But note: inline examples
use simplified IEC-style shapes. The extracted library versions are
always preferred because they match what engineers expect to see.

#### Mandatory Symbol Dimensions

The dimensions below are **normative** — they match KiCad's standard
library and produce legible, correctly-spaced schematics. Do NOT use
smaller dimensions from existing code or training data. Symbols
smaller than these minimums become illegible and overlap with labels.

| Symbol Type | Body Size (W × H mm) | Pin Span (tip-to-tip mm) | Pin Length (mm) | Min Spacing Between Symbols (mm) |
|-------------|----------------------|--------------------------|-----------------|----------------------------------|
| 2-pin passive (R, C, L) | 2.032 × 5.08 | 7.62 | 1.27 | 10.16 |
| 3-pin (SOT-23, transistor) | 2.54 × 5.08 | 7.62 | 2.54 | 12.70 |
| IC (≤ 8 pins) | 10.16 × (pins/2 × 2.54) | pins/2 × 2.54 + 5.08 | 2.54 | 20.32 |
| IC (> 8 pins) | 10.16 × (pins/2 × 2.54) | pins/2 × 2.54 + 5.08 | 2.54 | 25.40 |
| Connector (N pins) | 2.54 × (N × 2.54) | N × 2.54 + 2.54 | 2.54 | 15.24 |
| Power symbol | — | 2.54 (single stub) | 2.54 | 5.08 |

**Validation rule:** If any symbol's body rectangle is smaller than
2.032mm in either dimension, or any pin length is less than 1.27mm,
the symbol is non-conforming and must be resized.

**Standard symbol body examples** (FALLBACK — use only when KiCad
library extraction is unavailable. These use simplified IEC-style
shapes. Extract from the real library whenever possible.):

```
;; Resistor — IEC rectangular body (simplified fallback)
;; The real KiCad Device:R has the same shape — IEC uses a rectangle.
;; For US-style zigzag, extract from the KiCad library instead.
(symbol "Device:R" (in_bom yes) (on_board yes)
  (property "Reference" "R" (at 2.032 0 90)
    (effects (font (size 1.27 1.27))))
  (property "Value" "R" (at -2.032 0 90)
    (effects (font (size 1.27 1.27))))
  (property "Footprint" "" (at -1.778 0 90)
    (effects (font (size 1.27 1.27)) hide))
  (symbol "Device:R_0_1"
    (rectangle (start -1.016 -2.54) (end 1.016 2.54)
      (stroke (width 0) (type default))
      (fill (type none)))
  )
  (symbol "Device:R_1_1"
    (pin passive line (at 0 3.81 270) (length 1.27)
      (name "~" (effects (font (size 1.27 1.27))))
      (number "1" (effects (font (size 1.27 1.27)))))
    (pin passive line (at 0 -3.81 90) (length 1.27)
      (name "~" (effects (font (size 1.27 1.27))))
      (number "2" (effects (font (size 1.27 1.27)))))
  )
)

;; Capacitor — two parallel lines with two pins
(symbol "Device:C" (in_bom yes) (on_board yes)
  (property "Reference" "C" (at 1.524 0 0)
    (effects (font (size 1.27 1.27)) (justify left)))
  (property "Value" "C" (at 1.524 -2.54 0)
    (effects (font (size 1.27 1.27)) (justify left)))
  (symbol "Device:C_0_1"
    (polyline (pts (xy -2.032 -0.762) (xy 2.032 -0.762))
      (stroke (width 0.508) (type default)) (fill (type none)))
    (polyline (pts (xy -2.032 0.762) (xy 2.032 0.762))
      (stroke (width 0.508) (type default)) (fill (type none)))
  )
  (symbol "Device:C_1_1"
    (pin passive line (at 0 3.81 270) (length 2.794)
      (name "~" (effects (font (size 1.27 1.27))))
      (number "1" (effects (font (size 1.27 1.27)))))
    (pin passive line (at 0 -3.81 90) (length 2.794)
      (name "~" (effects (font (size 1.27 1.27))))
      (number "2" (effects (font (size 1.27 1.27)))))
  )
)

;; Generic IC — rectangular body is CORRECT for ICs.
;; Rectangles are the standard schematic symbol for integrated circuits.
;; Do NOT use rectangles for passives or transistors — those have
;; specific standard symbols (extract from KiCad library).
(symbol "Custom:MyIC" (in_bom yes) (on_board yes)
  (property "Reference" "U" (at 0 6.35 0)
    (effects (font (size 1.27 1.27))))
  (property "Value" "MyIC" (at 0 -6.35 0)
    (effects (font (size 1.27 1.27))))
  (symbol "Custom:MyIC_0_1"
    (rectangle (start -5.08 5.08) (end 5.08 -5.08)
      (stroke (width 0.254) (type default))
      (fill (type background)))
  )
  (symbol "Custom:MyIC_1_1"
    (pin input line (at -7.62 2.54 0) (length 2.54)
      (name "VDD" (effects (font (size 1.27 1.27))))
      (number "1" (effects (font (size 1.27 1.27)))))
    (pin passive line (at -7.62 0 0) (length 2.54)
      (name "GND" (effects (font (size 1.27 1.27))))
      (number "2" (effects (font (size 1.27 1.27)))))
    (pin bidirectional line (at 7.62 2.54 180) (length 2.54)
      (name "SDA" (effects (font (size 1.27 1.27))))
      (number "3" (effects (font (size 1.27 1.27)))))
    (pin bidirectional line (at 7.62 0 180) (length 2.54)
      (name "SCL" (effects (font (size 1.27 1.27))))
      (number "4" (effects (font (size 1.27 1.27)))))
  )
)
```

For specific ICs, use the manufacturer library if available
(e.g., `MCU_Nordic:nRF52840-QIAA`) or create an inline symbol
definition in the `lib_symbols` section. Custom IC symbols MUST
include:
- A `_0_1` sub-symbol with at least a `(rectangle ...)` for the
  component body
- A `_1_1` sub-symbol with all pins, including correct electrical
  types (`input`, `output`, `bidirectional`, `passive`,
  `power_in`, `power_out`, `unspecified`, `no_connect`)
- Pin positions that place pin endpoints outside the rectangle
  body, with pin length extending inward to the body edge
- `(property ...)` entries for Reference, Value, and Footprint

### 8.4: S-Expression Generation Checklist

Before outputting the `.kicad_sch` file, verify:

- [ ] Every symbol in `lib_symbols` has a `_0_1` sub-symbol with at
      least one graphical primitive (rectangle, polyline, arc, or circle)
- [ ] Every symbol in `lib_symbols` has a `_1_1` sub-symbol with all
      pin definitions
- [ ] Every pin has at least one wire segment connecting it to a net
      label, another pin, or a power symbol — no label-only connections
- [ ] All component origins fall within the page drawing area (minimum
      25mm from all page borders)
- [ ] Every coordinate is a multiple of 2.54
- [ ] Every wire endpoint matches a pin endpoint or another wire
      endpoint exactly
- [ ] Every junction is placed where 3+ wires meet
- [ ] Every unconnected pin has a no-connect marker
- [ ] Every power net has a PWR_FLAG
- [ ] No components overlap (check bounding boxes)
- [ ] All UUIDs are unique across the file
- [ ] Reference designators are unique and sequential
- [ ] Title block is populated

### 8.5: Visual Verification Gate (MANDATORY)

After generating the `.kicad_sch` file, **render the schematic and
visually inspect it**. This step CANNOT be skipped — structural
validation (checklist 8.4) does not catch visual failures.

**How to render**: Open the file in KiCad's schematic editor, export
a PDF via `kicad-cli sch export pdf`, or take a screenshot. If none
of these are available, ask the user to open the file and report what
they see.

**Verify all five of the following:**

1. **All symbols are visible at legible size** — every component
   renders with a visible body (rectangle, polyline, or other
   graphical element). If any component appears as an invisible
   cluster of pins or as a tiny dot, the `_0_1` graphical body
   sub-symbol is missing or the symbol dimensions are below the
   mandatory minimums in the dimension table.
2. **All wires are visible** — every connection has visible wire
   segments. If the schematic shows labels but no wires, `(wire ...)`
   entries are missing. Verify that intra-block connections use
   direct wires (not just labels).
3. **No components overlap or fall outside the page border** — all
   components are within the drawable area and do not stack on top of
   each other. Check that component bodies, labels, and designators
   all have clear space around them.
4. **Labels are readable** — no labels overlap pin names, designators,
   or other labels. Labels sit on wire stubs with clear separation
   from the pin endpoint.
5. **Functional blocks are visually grouped** — related components
   (IC + decoupling + pull-ups) are clustered together, and there is
   clear visual separation between blocks matching the layout
   composition algorithm.

If any of these checks fail, diagnose and fix before presenting to
the user. Common fixes:
- Invisible symbols → add `_0_1` sub-symbol with graphical primitives
  matching the mandatory dimension table
- Tiny symbols → resize to match the mandatory dimension table;
  do NOT reuse undersized dimensions from existing code
- Missing wires → add `(wire ...)` entries between pins and labels
- Off-page components → recalculate placement coordinates within
  the page drawing area using the layout composition algorithm
- Overlapping labels → extend wire stubs and adjust label positions
- No visual grouping → re-run the layout composition algorithm
  with explicit functional block assignments

### 8.6: Executable Validator

If schematic generation is automated via Python code (rather than
hand-written S-expressions), implement and run the following
validation function **before** declaring the schematic complete.
This catches the errors that structural checklists miss — it
validates at the code level, not the reading level.

```python
def validate_kicad_sch(sch_path: str) -> list[str]:
    """Validate a .kicad_sch file against PromptKit schematic standards.

    Returns a list of error strings. Empty list = all checks pass.
    Run this BEFORE presenting the schematic to the user.
    """
    import re
    errors = []
    with open(sch_path, "r") as f:
        content = f.read()

    # 1. Every lib_symbol must have a _0_1 sub-symbol with graphics
    lib_sym_names = re.findall(
        r'\(symbol "([^"]+)"\s+\(in_bom', content)
    for name in lib_sym_names:
        escaped = re.escape(name)
        pattern = rf'\(symbol "{escaped}_0_1"'
        if not re.search(pattern, content):
            errors.append(
                f"MISSING GRAPHICAL BODY: {name} has no _0_1 sub-symbol")
        else:
            # Check for at least one graphical primitive
            # Find the _0_1 block and check for rectangle/polyline/arc/circle
            block_match = re.search(
                rf'\(symbol "{escaped}_0_1"(.*?)\n  \)',
                content, re.DOTALL)
            if block_match:
                block = block_match.group(1)
                if not re.search(
                    r'\(rectangle|\(polyline|\(arc|\(circle', block):
                    errors.append(
                        f"EMPTY GRAPHICAL BODY: {name}_0_1 has no "
                        f"rectangle/polyline/arc/circle")

    # 2. Pin dimensions — check against mandatory minimums
    pin_lengths = re.findall(r'\(pin [^)]+\(length ([0-9.]+)\)', content)
    for length in pin_lengths:
        if float(length) < 1.27:
            errors.append(
                f"PIN TOO SHORT: length {length}mm < 1.27mm minimum")
            break  # One error is enough to flag the pattern

    # 3. Body dimensions — check rectangles are not undersized
    rects = re.findall(
        r'\(rectangle \(start ([0-9.-]+) ([0-9.-]+)\) '
        r'\(end ([0-9.-]+) ([0-9.-]+)\)', content)
    for x1, y1, x2, y2 in rects:
        w = abs(float(x2) - float(x1))
        h = abs(float(y2) - float(y1))
        if w < 2.032 and h < 2.032:
            errors.append(
                f"BODY TOO SMALL: rectangle {w:.3f}x{h:.3f}mm, "
                f"minimum 2.032mm in at least one dimension")

    # 4. Wire existence — at least one (wire ...) entry must exist
    wire_count = len(re.findall(r'\(wire ', content))
    if wire_count == 0:
        errors.append("NO WIRES: schematic has zero (wire ...) entries")

    # 5. Page boundary — check component placement coordinates
    # Symbol instances have (at X Y angle) for placement
    placements = re.findall(
        r'\(symbol \(lib_id "[^"]+"\).*?\(at ([0-9.-]+) ([0-9.-]+)',
        content, re.DOTALL)
    page_match = re.search(r'\(paper "([^"]+)"\)', content)
    if page_match:
        page = page_match.group(1)
        limits = {"A4": (297, 210), "A3": (420, 297),
                  "A2": (594, 420)}.get(page, (297, 210))
        for x, y in placements:
            fx, fy = float(x), float(y)
            if fx < 25 or fx > limits[0] - 25:
                errors.append(
                    f"OFF PAGE: component at x={fx} outside "
                    f"25–{limits[0]-25}mm range")
            if fy < 25 or fy > limits[1] - 25:
                errors.append(
                    f"OFF PAGE: component at y={fy} outside "
                    f"25–{limits[1]-25}mm range")

    return errors
```

**Usage**: After generating the `.kicad_sch` file, call
`validate_kicad_sch("path/to/schematic.kicad_sch")`. If errors are
returned, fix each one before proceeding to the visual verification
gate (§8.5). This validator is not exhaustive — it catches the most
common structural failures but does not replace visual inspection.

## Phase 9: Self-Audit Checklist

Before presenting the schematic to the user, cross-check against
the `schematic-compliance-audit` protocol's phases:

1. **Power architecture (audit Phase 1)**: Verify every rail is
   traced from source to load, decoupling is present on every IC
   power pin, and the current budget is within source capacity.

2. **Pin-level (audit Phase 2)**: Verify every IC pin is either
   connected to the correct net, properly terminated, or marked
   no-connect per the datasheet.

3. **Bus integrity (audit Phase 3)**: Verify I2C pull-ups, SPI CS
   lines, UART crossover, USB topology, and bus-specific
   requirements.

4. **Protection (audit Phase 4)**: Verify ESD on external
   connectors, reverse polarity on power input, overcurrent
   protection.

5. **Power sequencing (audit Phase 5)**: Verify reset timing and
   boot pin configuration.

6. **Passive values (audit Phase 6)**: Verify resistor power
   ratings, capacitor voltage ratings with derating, inductor
   saturation current.

7. **Completeness (audit Phase 7)**: Verify no unconnected nets,
   no floating inputs, no missing ground connections, test points
   on critical signals, all designators and values assigned.

8. **Document any findings** from the self-audit. Fix Critical and
   High findings before presenting. Present Medium and Low findings
   to the user as notes.

9. **Present for user review**: Show the user the schematic
   organization, key design decisions (regulator choices, passive
   values, protection strategy), and any remaining findings. The
   user MUST approve the schematic before proceeding to PCB layout.
