<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: component-selection
type: reasoning
description: >
  Systematic reasoning protocol for selecting electronic components
  from requirements. Covers functional decomposition, candidate
  identification via real-time search, technical evaluation, sourcing
  verification, cross-component compatibility, and decision matrix
  generation. Scoped to core functional components — supporting
  circuitry (decoupling, ESD, regulation) belongs in schematic design.
applicable_to: []
---

# Protocol: Component Selection

Apply this protocol when selecting electronic components for a hardware
design based on requirements. The goal is to choose core functional
components (MCU/SoC, wireless modules, sensors, actuators, displays,
connectors) that fulfil the user's feature requirements, are available
for purchase, and are mutually compatible. Execute all phases in order.

**Composition note**: This protocol is intended for standalone/manual
composition and is not currently required by any template.

**Scope boundary**: This protocol selects components that deliver the
user's requested functionality. It does NOT select supporting circuitry
(decoupling capacitors, ESD protection, voltage regulators, pull-up
resistors, filtering passives) — those are derived from the selected
components' datasheets during schematic design.

**Input**: A natural language description of the desired product, an
existing requirements document, or a combination of user-provided
context. If inputs are incomplete, probe the user for missing
information before proceeding.

## Phase 1: Requirements Extraction

Extract the functional and environmental requirements that constrain
component selection.

1. **Feature requirements**: List every user-facing feature that
   requires a hardware component. For each feature, identify:
   - The physical phenomenon or interface involved (sensing temperature,
     transmitting wireless data, driving a motor, displaying text)
   - Performance targets (sample rate, data rate, resolution, range)
   - Interface to the host controller (I2C, SPI, UART, analog, GPIO)

2. **Environmental requirements**: Extract constraints on the
   operating environment:
   - Temperature range (commercial 0–70°C, industrial −40–85°C,
     automotive −40–125°C)
   - Supply voltage available or expected
   - Power budget (battery capacity and target life, or wall-powered)
   - Physical size constraints (board area, height clearance)
   - Regulatory requirements (FCC, CE, UL — affects wireless module
     selection)

3. **Project requirements**: Extract non-technical constraints:
   - Target unit cost at projected volume
   - Target fabrication service (PCBWay, JLCPCB, OSH Park) — affects
     available assembly services and component packages
   - Prototype vs. production (affects willingness to use QFN, BGA,
     or hand-solderable packages)
   - Timeline constraints (affects willingness to accept long lead
     times)

4. **Produce a requirements summary table**:

   | ID | Requirement | Drives Selection Of | Priority |
   |----|-------------|---------------------|----------|
   | CR-001 | Measure temperature ±0.5°C, −40–85°C | Temperature sensor | Must |
   | CR-002 | BLE 5.0 connectivity, 10m range | Wireless MCU or module | Must |
   | ... | ... | ... | ... |

   Priority values: **Must** (non-negotiable — failing it eliminates
   the candidate), **Should** (strongly preferred but workarounds
   acceptable), **May** (nice-to-have, does not affect elimination).

## Phase 2: Component Category Identification

From the requirements summary, identify which categories of core
components the design needs.

1. **Enumerate categories**: For each requirement, identify the
   component category it demands:
   - **Controller**: MCU, SoC, FPGA, or application processor
   - **Wireless**: BLE, Wi-Fi, LoRa, Zigbee, cellular, GPS/GNSS
   - **Sensor**: temperature, humidity, pressure, IMU, light, gas,
     current, voltage, proximity, image
   - **Actuator**: motor driver, solenoid driver, LED driver, speaker
     driver, relay
   - **Display**: LCD, OLED, e-paper, 7-segment, LED matrix
   - **Storage**: Flash, EEPROM, SD card, FRAM
   - **Interface**: USB-to-UART, level shifter, ADC, DAC,
     CAN transceiver, Ethernet PHY
   - **Connector**: USB, JST, Molex, pin headers, antenna connector
   - **Power source**: battery holder, USB connector for power,
     barrel jack

2. **Consolidation check**: Identify components that can satisfy
   multiple requirements:
   - Can a wireless SoC (e.g., ESP32, nRF52840) serve as both
     the controller and wireless module?
   - Can a sensor module include its own ADC, eliminating a
     separate ADC IC?
   - Can an MCU's built-in peripherals (ADC, DAC, PWM) eliminate
     external ICs?

3. **Produce a category list** with consolidation notes:

   | Category | Driven By | Consolidation Opportunity |
   |----------|-----------|---------------------------|
   | Wireless MCU | CR-002 | Combines controller + BLE |
   | Temperature sensor | CR-001 | None — external sensor needed for ±0.5°C |
   | ... | ... | ... |

## Phase 3: Candidate Search

For each component category, identify at least 2 viable candidates
where possible. For categories with many options (MCU, wireless),
consider up to 4–5 to capture meaningful tradeoffs. For niche
categories with limited options, document why fewer candidates were
evaluated.

1. **Initial candidates from domain knowledge**: List well-known
   options in the category (e.g., for BLE MCU: nRF52840, ESP32-C3,
   STM32WB55). Include:
   - Part number (full orderable part number if possible)
   - Manufacturer
   - Key specification that satisfies the requirement
   - Package options

   For **wireless components**, explicitly evaluate both pre-certified
   modules and bare ICs. Pre-certified modules can be used under the
   module's existing certification (FCC/CE); bare ICs require full
   intentional radiator certification. For prototype and low-volume
   designs, strongly prefer modules unless the user has certification
   experience and budget.

2. **Real-time verification**: For each candidate, when
   search/browsing tools are available, use web search to verify:
   - The part number is current (not discontinued or NRND)
   - Key specifications match the requirement (do not rely solely
     on training data — datasheet specifications can be misremembered)
   - The part is available from major distributors (DigiKey, Mouser,
     LCSC, Farnell)

   **If search/browsing is unavailable in the current environment**:
   - Do **not** claim that lifecycle status, specifications, or
     distributor availability were verified
   - Ask the user to provide datasheet links, manufacturer pages,
     or distributor URLs if verified sourcing/status is required
   - Mark any unverified lifecycle/spec/availability fields as
     `[UNVERIFIED]` or `[UNKNOWN]`
   - Base recommendations only on clearly labeled prior knowledge,
     and state that final selection is pending source verification

3. **Expand search if needed**: If initial candidates are
   insufficient (discontinued, unavailable, too expensive), search
   distributor websites or Octopart with parametric filters matching
   the requirements. If search/browsing is unavailable, state that
   expansion could not be completed in-session and request
   user-provided links or permission to proceed with an
   `[UNVERIFIED]` candidate list.

4. **Produce a candidate list per category**:

   | Category | Candidate | Manufacturer | Key Spec | Package | Status |
   |----------|-----------|-------------|----------|---------|--------|
   | BLE MCU | nRF52840-QIAA | Nordic | BLE 5.0, ARM Cortex-M4F | QFN-73 | Active |
   | BLE MCU | ESP32-C3-MINI-1 | Espressif | BLE 5.0, RISC-V | Module | Active |
   | ... | ... | ... | ... | ... | ... |

## Phase 4: Technical Evaluation

Score each candidate against the requirements.

1. **Define evaluation criteria** from the requirements:
   - Feature coverage (does it satisfy all requirements it needs to?)
   - Performance margin (how much headroom above the requirement?)
   - Interface compatibility (does it offer the required bus interfaces?)
   - Power consumption (active, sleep, and deep-sleep current)
   - Package suitability (hand-solderable? compatible with assembly
     service?)
   - Peripheral count (enough GPIOs, ADC channels, timers?)
   - Software ecosystem (SDK maturity, community support,
     documentation quality)
   - Development tool availability (evaluation boards, debuggers)

2. **Weight the criteria**: Assign weights based on the project's
   priorities. Default weights if the user has no preference:

   | Criterion | Weight |
   |-----------|--------|
   | Feature coverage | 25% |
   | Power consumption | 20% |
   | Software ecosystem | 15% |
   | Package suitability | 15% |
   | Performance margin | 10% |
   | Interface compatibility | 10% |
   | Development tools | 5% |

   Ask the user to adjust weights before scoring.

3. **Score each candidate** on a 1–5 scale per criterion:
   - 5: Exceeds requirement with significant margin
   - 4: Meets requirement with comfortable margin
   - 3: Meets requirement with minimal margin
   - 2: Partially meets requirement — workaround needed
   - 1: Does not meet requirement

4. **Flag disqualifiers**: Any candidate scoring 1 on a Must-priority
   requirement is eliminated regardless of total score. Document the
   reason for elimination.

## Phase 5: Sourcing Evaluation

Verify that each surviving candidate can be procured. The same
search/browsing fallback from Phase 3 applies: if web search is
unavailable, mark sourcing fields as `[UNVERIFIED]` and request
user-provided distributor links.

1. **Availability check**: For each candidate, search distributor
   websites (DigiKey, Mouser, LCSC) to determine:
   - Current in-stock quantity
   - Unit price at prototype quantity (1–10 units)
   - Unit price at production quantity (100+ units, or the user's
     target volume)
   - Minimum order quantity (MOQ)
   - Lead time if not in stock

2. **Lifecycle status**: Verify the part's lifecycle:
   - **Active**: Currently manufactured and recommended for new designs
   - **NRND** (Not Recommended for New Designs): Still available but
     will be discontinued — flag as risk
   - **Obsolete/Discontinued**: Eliminate unless no alternative exists
   - **Preview/Sampling**: Not yet in production — flag timeline risk

3. **Second-source check**: For each candidate, determine if a
   pin-compatible or drop-in alternative exists from another
   manufacturer. Single-source components are a supply chain risk —
   flag but do not automatically eliminate.

4. **Assembly service compatibility**: If using a turnkey assembly
   service (JLCPCB, PCBWay), verify the component is in their
   parts library or can be consigned. JLCPCB "basic" vs. "extended"
   parts pricing can significantly affect assembly cost.

5. **Produce a sourcing summary per candidate**:

   | Candidate | In Stock | Price (1 qty) | Price (100 qty) | Lifecycle | Second Source | Assembly |
   |-----------|----------|---------------|-----------------|-----------|---------------|----------|
   | nRF52840-QIAA | 5,000+ (DigiKey) | $3.50 | $2.80 | Active | None (Nordic only) | JLCPCB extended |
   | ... | ... | ... | ... | ... | ... | ... |

## Phase 6: Compatibility Cross-Check

Verify that the selected components work together as a system.

1. **Voltage domain compatibility**: Map each component's operating
   voltage range. Verify all components sharing a bus or signal
   are in compatible voltage domains:
   - 3.3V I2C bus: all devices must tolerate 3.3V logic levels
   - Mixed-voltage interfaces need level shifting — flag as a
     schematic design requirement
   - For each voltage domain identified, if no power source directly
     provides that voltage, flag that a voltage regulator or converter
     is required. Document the input voltage range → output requirement
     as a handoff to schematic design.

2. **Interface compatibility**: For each inter-component connection:
   - Verify protocol compatibility (I2C speed modes, SPI clock
     polarity/phase, UART baud rate support)
   - Verify electrical compatibility (drive strength, input
     thresholds, pull-up requirements)
   - Verify pin availability — does the MCU have enough of the
     required interface instances?

3. **Power budget roll-up**: Evaluate both instantaneous loading
   and battery-life feasibility with explicit units:
   - Sum worst-case current draw by rail/source for each operating
     mode (e.g., active and sleep), in mA or A; if useful, also
     compute power in mW or W using the rail voltage
   - For each rail, regulator, or source, compare the worst-case
     current draw against its maximum current rating from CR
     requirements or selected power components
   - As a default conservative heuristic, flag if worst-case
     current draw exceeds 80% of any rail, regulator, or source
     maximum current rating; adjust this threshold based on
     application context (battery sag, ambient temperature,
     tolerances, transient or startup loads)
   - Separately estimate battery life using average current in the
     relevant mode profile versus battery capacity (e.g., mAh or Wh)
     and required runtime from CR requirements; do not compare
     worst-case current/power directly to battery capacity
   - In any summary table or bullets, label units explicitly
     (e.g., mA, A, mW, W, mAh, Wh, hours)

4. **Physical compatibility**: Verify all selected component
   packages can coexist on the target board:
   - Total footprint area estimate vs. available board area
   - Height clearance check for tall components (connectors,
     electrolytic caps, modules with shields)
   - Thermal adjacency — high-power components near heat-sensitive
     components is a flag

5. **Produce a compatibility matrix**:

   | Component A | Component B | Interface | Voltage OK | Protocol OK | Notes |
   |-------------|-------------|-----------|------------|-------------|-------|
   | nRF52840 | BME280 | I2C | ✅ 3.3V | ✅ Fast mode | — |
   | nRF52840 | W25Q128 | SPI | ✅ 3.3V | ✅ Mode 0 | Shares SPI bus with... |
   | ... | ... | ... | ... | ... | ... |

## Phase 7: Selection Decision Matrix

Produce the final weighted decision matrix.

1. **Combine scores**: For each category, produce a table:

   | Criterion | Weight | Candidate A Score | Candidate A Weighted | Candidate B Score | Candidate B Weighted |
   |-----------|--------|-------------------|---------------------|-------------------|---------------------|
   | Feature coverage | 25% | 4 | 1.00 | 5 | 1.25 |
   | Power consumption | 20% | 3 | 0.60 | 4 | 0.80 |
   | ... | ... | ... | ... | ... | ... |
   | **Total** | **100%** | | **3.45** | | **3.80** |

2. **State the recommendation**: For each category, recommend the
   highest-scoring candidate. If scores are close (within 0.3),
   present both as viable and explain the tradeoff.

3. **Document eliminated candidates**: For each candidate that was
   eliminated (in Phase 4 or 5), document the reason:
   - "Eliminated: nRF52832 — does not support BLE 5.0 long range
     (CR-002, scored 1 on Must-priority requirement)"

## Phase 8: Selection Summary

Produce a consolidated selection report for user approval.

1. **Selected components table**:

   | Category | Selected Part | Manufacturer | Key Spec | Package | Unit Price | Justification |
   |----------|--------------|-------------|----------|---------|------------|---------------|
   | BLE MCU | nRF52840-QIAA | Nordic | BLE 5.0, Cortex-M4F, 1MB Flash | QFN-73 | $2.80 @100 | Highest score; mature SDK |
   | Temp sensor | TMP117AIDRVR | TI | ±0.1°C, I2C, −40–125°C | SOT-6 | $1.20 @100 | Exceeds ±0.5°C req |
   | ... | ... | ... | ... | ... | ... | ... |

2. **Risk flags**: List any concerns that survived selection:
   - Single-source components
   - Components with long lead times
   - Components requiring extended-part assembly surcharges
   - Components nearing end-of-life
   - Tight performance margins

3. **Downstream implications for schematic design**:
   - Required voltage rails (from component supply voltage ranges)
   - Required bus interfaces (from inter-component connections)
   - Known layout-sensitive signals (RF, high-speed SPI, USB)
   - Reference circuit recommendations (cite datasheet sections)

4. **Present for user approval**: The user MUST confirm the
   component selection before proceeding to schematic design.
   Present the summary and ask: "Do you approve this component
   selection, or do you want to revisit any choices?"
