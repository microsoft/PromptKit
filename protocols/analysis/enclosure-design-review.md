<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: enclosure-design-review
type: analysis
description: >
  Systematic enclosure design review protocol for electronic assemblies.
  Audits an enclosure design for PCB fit, thermal management,
  environmental protection, antenna compatibility, sensor access,
  manufacturing feasibility, and mounting provisions.
applicable_to:
  - review-enclosure
---

# Protocol: Enclosure Design Review

Apply this protocol when reviewing an enclosure design for an
electronic assembly. Execute all phases in order.

## Phase 1: PCB Fit and Clearance Verification

Verify the enclosure accommodates the PCB and all its components.

1. **Board dimensions**: Does the internal cavity match the PCB
   dimensions with adequate clearance on all sides?
   - Minimum 1mm clearance between PCB edge and enclosure wall
   - Account for component overhang beyond PCB edge

2. **Mounting provisions**: Do the enclosure standoffs match the
   PCB mounting holes?
   - Hole positions and spacing match the PCB
   - Standoff height provides adequate clearance for bottom-side
     components (if any)
   - Fastener type is appropriate (self-tapping screws in plastic
     bosses, threaded inserts, or snap-in retention)

3. **Component clearance**: Is there adequate height clearance for
   the tallest components?
   - Measure from PCB top surface to enclosure lid inner surface
   - Account for connectors in mated state (e.g., USB-C cable
     plugged in, Qwiic cable connected)
   - Check for interference between lid features and tall components

4. **Connector access**: Does every external connector have a
   corresponding enclosure cutout or port?
   - USB-C port accessible from outside
   - Sensor connectors accessible or routed through cable glands
   - Programming/debug port accessible (or deliberately sealed
     for production units)

5. **LED and button access**: If the PCB has LEDs or buttons, does
   the enclosure provide visibility or actuation?
   - Light pipes or transparent windows for status LEDs
   - Button actuators or membrane switches if reset/boot buttons
     are used in the field

## Phase 2: Environmental Protection Assessment

Evaluate the enclosure's protection against the deployment environment.

1. **IP rating adequacy**: Does the enclosure design achieve the
   required IP rating for the deployment environment?
   - IP44 minimum for outdoor splash resistance
   - IP65 or higher for washdown or buried deployments
   - Identify the weakest sealing point (usually cable entry or
     lid-to-body joint)

2. **Sealing strategy**: How are joints and penetrations sealed?
   - Lid-to-body: gasket, O-ring, tongue-and-groove, or adhesive?
   - Cable entries: cable glands, grommets, or potting?
   - Connector ports: sealed connectors, plugs, or is the connector
     itself the seal point?

3. **UV resistance**: If deployed outdoors, is the enclosure
   material UV-stable?
   - PLA: NOT UV-stable — will degrade in months
   - ABS: marginal UV resistance
   - PETG: moderate UV resistance
   - ASA: good UV resistance — preferred for outdoor
   - Flag if material is not specified or is PLA for outdoor use

4. **Condensation management**: What prevents internal condensation?
   - Breather vents with hydrophobic membranes (Gore-Tex type)
   - Desiccant packets
   - Conformal coating on PCB as secondary protection
   - Flag if no condensation strategy and deployment involves
     temperature cycling

5. **Thermal cycling**: Will repeated temperature cycling degrade
   seals or cause fastener loosening?
   - Different thermal expansion coefficients between materials
     (e.g., metal fasteners in plastic bosses)
   - Gasket compression set over time

## Phase 3: Thermal Management Review

Verify the enclosure allows adequate heat dissipation.

1. **Heat source identification**: Which PCB components generate
   significant heat?
   - Voltage regulator (especially during charging or high load)
   - MCU during radio TX burst
   - Any linear regulators with dropout dissipation

2. **Thermal path**: How does heat get from the component to
   ambient?
   - Conduction through PCB → standoffs → enclosure walls
   - Convection through ventilation openings
   - Radiation (minimal for small enclosures)

3. **Ventilation**: If the enclosure has ventilation openings:
   - Do openings allow adequate airflow for natural convection?
   - Are openings protected against water and dust ingress?
     (mesh, louvers, membrane)
   - Does ventilation compromise the IP rating?

4. **Sealed enclosure thermal limits**: If the enclosure is sealed:
   - Calculate worst-case internal temperature rise
   - Will it exceed the PCB component temperature ratings?
   - Consider solar loading for outdoor deployments (dark
     enclosures absorb more heat)

## Phase 4: Antenna and RF Compatibility

Verify the enclosure doesn't degrade wireless performance.

1. **Material RF transparency**: Is the enclosure material
   transparent at the operating frequency?
   - PLA, PETG, ASA, ABS, nylon: RF-transparent at 2.4 GHz ✓
   - Carbon-filled filaments: RF-absorbing ✗
   - Metallic coatings or paint with metallic pigments: RF-blocking ✗
   - Flag any RF-opaque material near the antenna

2. **Antenna keepout zone**: Is the PCB antenna keepout zone
   preserved in the enclosure?
   - No enclosure walls, standoffs, screws, or other features
     within the keepout zone
   - Adequate clearance between antenna and enclosure wall
     (minimum per module datasheet, typically 5–10mm)

3. **Ground plane effects**: Are there any metallic elements in the
   enclosure (metal inserts, screws, brackets, shields) near the
   antenna that could detune it?

4. **Antenna orientation**: Is the PCB oriented so the antenna
   has the best radiation pattern for the deployment scenario?
   - For vertical deployment: antenna at top of enclosure
   - For horizontal deployment: antenna toward open sky

## Phase 5: Sensor Access and Integration

If the device includes sensors, verify the enclosure supports them.

1. **Environmental sensors** (temperature, humidity, pressure):
   - Does the enclosure provide ventilation to the sensor?
   - Is the sensor shielded from direct sunlight (radiation shield)?
   - Is self-heating from the PCB isolated from the temperature
     sensor?

2. **External probe sensors** (soil moisture, waterproof temperature):
   - Cable pass-through with strain relief?
   - Sealed cable gland or grommet?
   - Adequate cable bend radius inside the enclosure?

3. **Light sensors**: Light pipe or transparent window aligned with
   the sensor?

4. **Conflicting requirements**: Does the design need both
   ventilation (for air sensors) and sealing (for weather
   protection)? If so, is a ventilation membrane (Gore-Tex type)
   specified?

## Phase 6: Manufacturing Feasibility

Verify the enclosure can be manufactured with the specified process.

1. **3D printing (FDM) feasibility**:
   - Wall thickness ≥ 2mm (1.6mm absolute minimum for structural)
   - No unsupported overhangs > 45° without designed-in supports
   - Bridging distances ≤ 20mm without support
   - Print orientation selected for strength (layer lines parallel
     to primary stress direction)
   - Tolerances appropriate for FDM (±0.3mm typical)

2. **Assembly feasibility**:
   - Can the PCB be inserted and fastened without special tools?
   - Can cables be routed and connected in the available space?
   - Can the lid be closed and sealed after assembly?
   - Is the assembly sequence obvious or does it need documentation?

3. **Material specification**: Is the material fully specified?
   - Material type (not just "3D printed")
   - Color (dark colors absorb more solar heat)
   - Infill percentage (affects strength and thermal conductivity)
   - Layer height (affects surface finish and seal quality)

## Phase 7: Mounting and Deployment

Verify the enclosure can be deployed in the target environment.

1. **Mounting provisions**: Does the enclosure have mounting features?
   - Screw tabs, zip-tie slots, DIN rail clips, magnetic mounts,
     or pole/pipe clamps
   - Are mounting features strong enough for the deployment method?
   - Does mounting orientation preserve antenna performance?

2. **Serviceability**: Can the device be serviced in the field?
   - Battery replacement without full disassembly?
   - USB access for firmware update?
   - Can the lid be opened and resealed in the field?

3. **Labeling**: Is there space for labels or markings?
   - Regulatory markings (FCC ID, CE mark if applicable)
   - Device identification (serial number, QR code)
   - Orientation indicators ("THIS SIDE UP", antenna direction)
