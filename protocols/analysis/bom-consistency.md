<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: bom-consistency
type: analysis
description: >
  Systematic BOM review protocol. Audits a bill of materials against
  the schematic and requirements for part number correctness, voltage
  and temperature ratings, package footprint matches, cost compliance,
  single-source risks, and completeness.
applicable_to:
  - review-bom
---

# Protocol: BOM Consistency

Apply this protocol when reviewing a bill of materials (BOM) against
the schematic, requirements, and component datasheets. Execute all
phases in order.

## Phase 1: BOM-to-Schematic Cross-Reference

Verify that every component in the schematic appears in the BOM and
vice versa.

1. **Schematic coverage**: For every component reference designator in
   the schematic (U1, R1, C1, etc.), verify a corresponding BOM row
   exists with matching designator, value, and footprint.
   - Missing from BOM → finding: component will not be ordered
   - Designator mismatch → finding: wrong part may be placed

2. **BOM extras**: For every BOM row, verify a corresponding schematic
   component exists.
   - BOM entry with no schematic component → finding: orphaned part
     (may be a stale BOM row or a mechanical part not in the schematic)

3. **Quantity check**: For components used multiple times (e.g., bypass
   caps), verify the BOM quantity matches the schematic count.

## Phase 2: Part Number and Value Verification

Verify that BOM part numbers match the schematic's intended components.

1. **For each active component** (ICs, regulators, transistors):
   - Does the manufacturer part number (MPN) match the component used
     in the schematic design?
   - Is the package/footprint correct for the PCB layout?
   - Is the part the correct variant (e.g., voltage option, speed
     grade, temperature range)?

2. **For each passive component** (resistors, capacitors, inductors):
   - Does the value match the schematic (resistance, capacitance,
     inductance)?
   - Is the tolerance appropriate (1% for precision dividers, 10-20%
     for bypass caps)?
   - Is the package size correct for the footprint?

3. **For connectors and mechanical parts**:
   - Does the connector type and pin count match the schematic symbol?
   - Is the mating connector specified if relevant?

## Phase 3: Rating and Derating Verification

Verify that component ratings meet or exceed requirements.

1. **Voltage ratings**: For every capacitor and semiconductor:
   - Is the voltage rating ≥ 1.5× the maximum operating voltage on
     that net? (Standard derating practice)
   - For MLCCs: account for DC bias derating — a 10µF 6.3V 0402 cap
     may only provide 4µF effective capacitance at 3.3V

2. **Temperature ratings**: For every component:
   - Does the operating temperature range cover the specified
     environment?
   - Flag components rated only to commercial range (0–70°C) when the
     requirements specify industrial (−40–85°C) or wider

3. **Current ratings**: For inductors, ferrite beads, and fuses:
   - Is the saturation/rated current ≥ the worst-case current on
     that net?
   - For inductors: saturation current (not just rated current) is
     the binding limit

4. **Power ratings**: For resistors in power paths:
   - Is the power rating ≥ 2× the calculated dissipation? (Standard
     derating)

## Phase 4: Sourcing and Availability Risk

Assess supply chain risk for each BOM line.

1. **Single-source risk**: Is the component available from only one
   manufacturer?
   - Flag single-source components, especially active ICs
   - Note if a second-source or pin-compatible alternative exists

2. **Lifecycle status**: Is the component active, NRND (not
   recommended for new designs), or obsolete?
   - Flag NRND and obsolete parts

3. **Lead time risk**: For components with known long lead times
   (specialty ICs, specific connectors), flag the risk.

4. **Distributor availability**: Is the component available from
   the specified distributor(s) (LCSC, DigiKey, Mouser)?
   - Flag components not available from the target distributor
     if the requirements specify one (e.g., for JLCPCB assembly)

## Phase 5: Cost Compliance

Verify the BOM meets cost targets.

1. **Total BOM cost**: Sum all component costs (unit price × quantity)
   at the specified order quantity.
   - Compare to the cost target in the requirements (if specified)
   - Flag if total exceeds the target

2. **Cost data quality**: For each line item:
   - Is the price a current quote or an estimate?
   - Flag estimated prices as `[ESTIMATED]`
   - Flag stale quotes (> 90 days old if date is known)

3. **Include/exclude boundary**: Verify the cost calculation matches
   the spec's boundary (e.g., "excluding PCB fabrication" or
   "including assembly").

## Phase 6: Completeness and Consistency

Final checks for BOM quality.

1. **Required BOM fields**: Every row should have:
   - Reference designator(s)
   - Quantity
   - Value or description
   - Manufacturer and MPN
   - Package/footprint
   - Supplier and supplier part number (if targeting a specific fab)
   - Unit cost

2. **Placeholder values**: Flag any rows with "TBD", "TBA", "?",
   or missing part numbers.

3. **Do-not-populate (DNP)**: If the schematic has DNP components,
   verify they appear in the BOM marked as DNP (not omitted
   silently — omission causes confusion about whether the part was
   forgotten or intentionally excluded).

4. **Assembly notes**: If the BOM targets a specific assembly house,
   verify it includes any required fields (e.g., LCSC part number
   for JLCPCB, CPL rotation/offset notes).
