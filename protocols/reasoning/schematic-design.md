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
applicable_to: []
---

# Protocol: Schematic Design

Apply this protocol when designing a circuit schematic from a set of
selected components and requirements. The goal is to produce a
complete, correct, and visually readable KiCad schematic file
(`.kicad_sch` S-expression format) that includes all supporting
circuitry derived from component datasheets. Execute all phases in
order.

**Composition note**: This protocol is intended for standalone/manual
composition and is not currently required by any template.

**Input**: A component selection report (from the `component-selection`
protocol or equivalent) containing selected components with part
numbers, key specifications, inter-component interfaces, and
datasheet references. If no formal selection report exists, the user
must provide the list of core components and their datasheets.

**If datasheet access is unavailable**: Do not fabricate reference
circuit values. Ask the user to provide datasheet excerpts (reference
circuit schematics, recommended component values, pin configurations)
or mark derived values as `[UNVERIFIED — datasheet not consulted]`.

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

## Phase 8: KiCad Schematic Generation

Generate the `.kicad_sch` S-expression file(s) with correct visual
rendering. This phase contains mandatory rules that prevent the
"structurally correct but visually wrong" failure mode.

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
  ;; Symbol library references
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
   - Wires MUST be orthogonal (horizontal or vertical segments
     only — no diagonal wires)
   - Wire endpoints MUST align exactly with component pin
     endpoints (same X,Y coordinate) for KiCad to register a
     connection
   - Use net labels instead of long wires for connections that
     would cross many components or span large distances
   - Place junction dots where three or more wires meet at a
     point (KiCad requires explicit `(junction ...)` entries)
   - NEVER route wires through component bodies

6. **Label placement**:
   - Net labels placed on short wire stubs (2.54mm–5.08mm) from
     pins, not floating in space
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

### 8.3: Component Symbol References

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

For specific ICs, use the manufacturer library if available
(e.g., `MCU_Nordic:nRF52840-QIAA`) or create an inline symbol
definition in the `lib_symbols` section with correct pin
positions, names, and electrical types.

### 8.4: S-Expression Generation Checklist

Before outputting the `.kicad_sch` file, verify:

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
