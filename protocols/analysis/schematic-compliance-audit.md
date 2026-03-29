<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: schematic-compliance-audit
type: analysis
description: >
  Systematic schematic review protocol. Audits a netlist or schematic
  against requirements and datasheet specifications. Covers power
  architecture, pin-level verification, bus integrity, protection
  circuits, power sequencing, passive components, and completeness.
applicable_to:
  - review-schematic
---

# Protocol: Schematic Compliance Audit

Apply this protocol when reviewing a schematic or netlist against
requirements and component datasheets. Execute all phases in order.
Each phase produces findings that feed into the final report.

## Phase 1: Power Architecture Review

Map and verify the entire power delivery network.

1. **Enumerate every power rail**: List each rail with its source
   (regulator, battery, USB, external), nominal voltage, tolerance,
   and maximum current capacity.

2. **Trace source to load**: For each rail, trace the current path
   from source (input connector or battery) through regulation
   (LDO, switching regulator, charge pump) to every consumer. Verify:
   - Input voltage range of the regulator covers all source conditions
     (battery discharge curve, USB voltage tolerance)
   - Output voltage is within the consumer's VDD specification
   - Regulator current capacity covers worst-case total load
   - Dropout voltage (for LDOs) is achievable at minimum input voltage

3. **Verify decoupling**: For each IC power pin:
   - Is there a decoupling capacitor? (Finding if missing)
   - Is the capacitor value per the IC datasheet recommendation?
   - Is the capacitor type appropriate? (MLCC for high-frequency
     bypass, bulk electrolytic/tantalum for low-frequency filtering)

4. **Check power rail isolation**: Verify that switched/gated power
   rails are properly isolated when off:
   - No backpower paths through I/O pins into unpowered rails
   - No current leakage through pull-ups connected to gated rails
   - Power gate control signal is in a safe state at reset

5. **Current budget**: For each rail, sum the worst-case current
   draw of all connected consumers. Compare to source capacity.
   Flag if total exceeds 80% of source rating (marginal) or 100%
   (violation).

## Phase 2: Pin-Level Audit

For every IC in the schematic, verify every pin.

1. **Read the IC datasheet** pin description table. For each pin,
   determine: function, voltage domain, input/output/bidirectional,
   required external components, and behavior when unconnected.

2. **For each pin, verify**:
   - **Connected pins**: Is the connected net in the correct voltage
     domain? Is the signal direction compatible (output driving
     output = contention)?
   - **Power pins**: VDD connected to the correct rail? GND connected
     to ground? Decoupling present?
   - **Unused pins**: Handled per datasheet recommendation (tied to
     VDD, GND, or left floating with explicit documentation)?
   - **Bootstrap/strap pins**: Set to the correct logic level for the
     desired configuration? Not overridden by external circuits at
     power-on?
   - **Analog pins**: Reference voltage connected? ADC input within
     rated range? Appropriate filtering if required?
   - **Reset pins**: Connected to a proper reset circuit or RC delay?
     Not left floating?

3. **Flag** any pin that is:
   - Unconnected without datasheet justification
   - Connected to a net in the wrong voltage domain
   - An output driving into another output (bus contention)
   - A strap pin that could be overridden by an external pull network

## Phase 3: Bus Integrity

For each communication bus (I2C, SPI, UART, USB, CAN, 1-Wire, etc.),
verify electrical correctness.

1. **I2C**:
   - Pull-up resistors present on SDA and SCL
   - Pull-ups connected to the correct voltage rail
   - Pull-up value appropriate for bus speed and capacitance
     (typically 1kΩ–10kΩ for standard/fast mode)
   - No I2C address conflicts between devices on the same bus
   - All devices on the bus are in the same voltage domain (or
     level-shifted)

2. **SPI**:
   - MOSI, MISO, CLK, and CS all routed
   - Each device has a unique CS line
   - Unused CS lines are deasserted (pulled high for active-low CS)
   - No bus contention on MISO when multiple devices share a bus

3. **UART**:
   - TX and RX crossed correctly (TX→RX, RX→TX)
   - Voltage levels compatible between endpoints
   - Flow control lines (RTS/CTS) connected if required

4. **USB**:
   - D+ and D- nets correctly connected end-to-end between USB
     connector, any protection/series components, and the USB
     transceiver (no unintended stubs)
   - ESD protection present at the connector
   - Termination/pull-up per USB specification for the target speed
   - VBUS detection circuit if required
   - Shield/ground connection at connector
   - **Layout carry-forward**: differential routing and impedance
     control for D+/D- must be verified during PCB layout review

5. **Other buses** (CAN, 1-Wire, Ethernet, etc.):
   - Bus-specific termination present
   - Voltage levels and protection appropriate
   - Required bias resistors or transformers included

## Phase 4: Protection Circuit Review

Verify that protection circuits are present where required.

1. **ESD protection**: Required on every external connector (USB,
   antenna, sensor headers, debug ports). Verify:
   - TVS or ESD protection IC present
   - Clamping voltage below the protected IC's absolute maximum rating
   - Connected directly on the connector signal nets in the schematic
     topology (no unintended series components between connector and
     ESD device)
   - **Layout carry-forward**: place ESD devices physically close to
     the connector; verify during PCB layout review

2. **Reverse polarity protection**: Required on battery input and
   any external DC power input. Verify:
   - Protection mechanism present (series diode, P-MOSFET, ideal
     diode IC)
   - Voltage drop acceptable at minimum input voltage

3. **Overcurrent protection**: Verify for power inputs:
   - Fuse, PTC, or current-limiting circuit on external power inputs
   - Rating appropriate for the expected load

4. **Overvoltage protection**: Verify for inputs that could exceed
   the regulator's maximum input voltage:
   - Clamping or crowbar circuit present if the source voltage could
     exceed the absolute maximum rating

## Phase 5: Power Sequencing and Reset

Verify power-on behavior and reset circuits.

1. **Power-on sequence**: If the IC datasheet specifies a required
   power-on sequence (e.g., core before I/O, analog before digital):
   - Verify the schematic enforces the sequence (enable pin chaining,
     voltage supervisor, RC delay)
   - Flag if the sequence depends on "typical" regulator startup times

2. **Reset circuit**: For each IC with a reset pin:
   - Reset is held active until power is stable
   - Reset release timing meets the IC's minimum power-on reset time
   - External reset button or test point if required

3. **Bootstrap/strap pins at power-on**: Verify that strap pins
   read the correct value at the moment the IC samples them:
   - No contention from other ICs that are still in reset
   - Pull resistor values strong enough to override any parasitic
     loading
   - Boot mode selection matches the intended firmware configuration

## Phase 6: Passive Component Verification

Verify passive component values and ratings.

1. **Resistors**: Verify value, tolerance, and power rating:
   - Pull-up/pull-down values appropriate for the bus or signal
   - Voltage divider ratios produce the correct output
   - Power dissipation within the resistor's rating (P = V²/R)

2. **Capacitors**: Verify value, voltage rating, and type:
   - Voltage rating ≥ 1.5× the rail voltage (derating)
   - Ceramic capacitors: DC bias derating considered for high-voltage
     MLCCs (a 10µF 0402 at 3.3V may only provide 6µF effective capacitance)
   - Electrolytic/tantalum: ESR appropriate for the application

3. **Inductors** (if present): Verify saturation current rating
   exceeds worst-case DC current plus ripple.

4. **Ferrite beads** (if present): Verify impedance at the target
   frequency and DC current rating.

## Phase 7: Completeness Check

Verify nothing is missing or disconnected.

1. **Unconnected nets**: Any net with only one connection is suspect.
   Flag unless explicitly documented as intentional (test point, future
   expansion).

2. **Missing ground connections**: Every IC ground pin must be
   connected to ground. Every connector ground pin must be connected.

3. **Missing bypass/decoupling**: Every IC power pin should have a
   decoupling capacitor (cross-reference with Phase 1.3).

4. **Floating inputs**: Any IC input pin that is not driven by
   another output, pull resistor, or voltage divider is a finding.

5. **Test points**: Verify that critical signals (power rails, reset,
   programming interface) have test points or are accessible for
   debugging.

6. **Designator and value completeness**: Every component should have
   a reference designator and a value or part number. Flag components
   with placeholder values ("R?", "C?", "TBD").
