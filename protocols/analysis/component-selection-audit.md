<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: component-selection-audit
type: analysis
description: >
  Adversarial audit of a component selection against requirements and
  real-world data. Independently verifies part numbers exist, datasheet
  specs match claims, sourcing data is current, compatibility assertions
  hold, and no requirements are left unsatisfied. Designed to catch
  hallucinated parts and stale specifications.
applicable_to: []
---

# Protocol: Component Selection Audit

Apply this protocol when auditing a component selection report produced
by the component-selection reasoning protocol (or any equivalent
selection artifact). The auditor MUST NOT trust any claim in the
selection report — every assertion is re-verified independently.
Execute all phases in order.

**Composition note**: This protocol is intended for standalone/manual
composition and is not currently required by any template.

## Phase 1: Part Number Verification

For every selected component, verify the part number is real and
currently orderable.

**If search/browsing is unavailable in the current environment**:
do not attempt to fabricate verification results. Instead, ask the
user to provide datasheet URLs, manufacturer product pages, or
distributor links; these user-provided sources MAY be used to
independently verify the part. Mark any assertion that cannot be
independently verified as `[UNVERIFIED]`, but distinguish blocking
from non-blocking items: if the exact part number's existence,
claimed manufacturer, or current orderable status for a selected
component cannot be independently verified from available evidence,
treat that as a blocking finding and the audit MUST FAIL. A PASS
WITH CONDITIONS verdict is allowed only for non-blocking assertions
that remain `[UNVERIFIED]` (e.g., exact pricing, stock levels,
lead times), with the report noting exactly which checks are
pending source verification.

1. **Part number existence**: Search the manufacturer's website or a
   major distributor (DigiKey, Mouser, LCSC) for the exact part
   number. Common hallucination patterns:
   - Plausible but non-existent suffixes (e.g., nRF52840-QIAB
     instead of nRF52840-QIAA)
   - Outdated part numbers that have been superseded
   - Conflation of evaluation board part numbers with IC part numbers
   - Module part numbers confused with bare-chip part numbers

2. **Manufacturer confirmation**: Verify the claimed manufacturer
   actually makes this part. Cross-reference the manufacturer's
   product page, not just distributor listings (distributors
   sometimes have stale or incorrect data).

3. **For each part, record**:

   | Part Number | Claimed Manufacturer | Verified? | Source URL | Notes |
   |-------------|---------------------|-----------|-----------|-------|
   | nRF52840-QIAA | Nordic Semiconductor | ✅ | [DigiKey link] | Active |
   | ... | ... | ... | ... | ... |

4. **If a part number cannot be verified**: Flag as
   `[UNVERIFIED PART NUMBER]` — this is a Critical finding. Continue
   auditing remaining components, but an unverified part number is a
   blocking finding that alone forces a FAIL verdict.

## Phase 2: Specification Cross-Check

For every selected component, verify that the claimed specifications
match the actual datasheet.

1. **Locate the datasheet**: Find the current datasheet from the
   manufacturer's website (not cached or third-party versions).
   Record the datasheet revision and date.

2. **For each claimed specification**, verify against the datasheet:
   - Operating voltage range
   - Operating temperature range
   - Key performance specs (clock speed, resolution, data rate,
     sensitivity, accuracy)
   - Interface types and supported modes/speeds
   - Package dimensions and pin count
   - Power consumption figures (active, sleep, deep-sleep)

3. **Common specification errors to check**:
   - Confusing typical vs. maximum/minimum values (e.g., "100mA
     active current" — is that typical or maximum?)
   - Confusing module specs with IC specs (a module's operating
     range may differ from the bare IC's)
   - Misattributing specs from one variant to another (e.g., the
     -40°C rating is on the industrial variant, not the commercial
     variant that was selected)
   - Outdated specs from a previous datasheet revision

4. **For each specification**, record:

   | Part | Specification | Claimed Value | Datasheet Value | Match? | Datasheet Section |
   |------|---------------|---------------|-----------------|--------|-------------------|
   | nRF52840 | Flash size | 1MB | 1MB | ✅ | §1.1 |
   | nRF52840 | Active current | 3mA @1MHz | 3.2mA @1MHz (typ) | ⚠️ Typical, not max | §5.2 |
   | ... | ... | ... | ... | ... | ... |

5. **Severity classification**:
   - **Critical**: Claimed spec is wrong and the actual spec does
     not meet the requirement (e.g., claimed ±0.5°C but datasheet
     says ±1°C)
   - **High**: Claimed spec is wrong but actual spec still meets the
     requirement (e.g., claimed 1MB flash, actually 512KB, but
     requirement only needs 256KB)
   - **Medium**: Spec is ambiguous (typical vs. max, conditional on
     operating mode)
   - **Low**: Minor discrepancy with no functional impact
   - **Informational**: Observation with no correctness impact (e.g.,
     over-specification, cost optimization opportunity)

## Phase 3: Requirements Satisfaction Audit

Verify that the selected components collectively satisfy all
requirements from the selection report.

1. **Requirements traceability**: For each requirement in the
   selection report's requirements summary table:
   - Is at least one selected component mapped to this requirement?
   - Does the selected component's verified specification (from
     Phase 2, not the claimed spec) actually satisfy the requirement?
   - If the requirement has a quantitative target, does the verified
     spec meet it with adequate margin?

2. **Unsatisfied requirements**: Flag any requirement that:
   - Has no component mapped to it
   - Has a component mapped but the verified spec does not meet it
   - Depends on a component whose part number is unverified (Phase 1)

3. **Over-specification check**: Flag cases where a significantly
   more capable (and expensive) component was selected when a
   simpler alternative would satisfy the requirement. This is
   informational, not a defect — but the user should be aware.

4. **Produce a traceability matrix**:

   | Requirement | Selected Component | Required Spec | Verified Spec | Satisfied? |
   |-------------|-------------------|---------------|---------------|------------|
   | CR-001: ±0.5°C temp | TMP117 | ±0.5°C | ±0.1°C (datasheet §1) | ✅ Exceeds |
   | CR-002: BLE 5.0 | nRF52840 | BLE 5.0 | BLE 5.0 (datasheet §1) | ✅ |
   | ... | ... | ... | ... | ... |

## Phase 4: Sourcing Data Verification

Independently verify the sourcing claims in the selection report.

1. **Current availability**: For each selected component, search
   at least one major distributor and record:
   - Distributor name
   - In-stock quantity (at the time of audit)
   - Unit price at prototype quantity
   - Unit price at production quantity
   - Lead time if not in stock

2. **Compare against the selection report's claims**: Flag
   discrepancies:
   - Price difference > 20% from claimed price
   - Stock level dropped from "in stock" to "backordered"
   - Lead time increased significantly
   - Part now listed as NRND or obsolete

3. **Assembly service verification**: If the selection report claims
   a component is available in a turnkey assembly service's library
   (e.g., JLCPCB basic parts), verify this claim by searching the
   service's parts database.

4. **Sourcing risk assessment**: Flag components with:
   - Single-source (only one manufacturer, no second source)
   - Low stock (< 100 units available, or < 2× the order quantity)
   - Extended lead time (> 8 weeks)
   - Recent price increases (> 30% above the claimed price)

## Phase 5: Compatibility Verification

Verify that the selected components are electrically and
mechanically compatible.

1. **Voltage level verification**: For each inter-component
   connection claimed in the compatibility matrix:
   - Verify the output high/low voltage of the driver against the
     input high/low threshold of the receiver (from datasheets,
     not training data)
   - Verify the operating voltage of both components is compatible
     with the planned power rail

2. **Interface protocol verification**: For each bus connection:
   - Verify both components support the same protocol mode
     (e.g., I2C fast mode 400kHz — check both datasheets, not
     just one)
   - Verify any bus-specific requirements (I2C address conflicts,
     SPI mode compatibility, UART baud rate ranges)

3. **Power budget verification**: Re-calculate the power budget
   using verified specifications (from Phase 2):
   - Sum worst-case active current for all components
   - Sum sleep-mode current for all components
   - Compare against the power source specification
   - Flag if the verified budget differs from the selection
     report's claimed budget by > 10%

4. **Pin count verification**: Verify the selected MCU/controller
   has enough pins for all connections:
   - Count required GPIO pins
   - Count required peripheral instances (I2C, SPI, UART, ADC)
   - Compare against the MCU's available pins and peripheral
     instances (from the datasheet pin multiplexing table)
   - Flag if any peripheral is oversubscribed

## Phase 6: Findings Summary

Compile all findings from Phases 1–5.

1. **For each finding**, document:
   - Phase that discovered it
   - Affected component(s) and requirement(s)
   - Severity (Critical / High / Medium / Low / Informational)
   - Evidence (datasheet section, distributor URL, specific
     discrepancy)
   - Recommended action (replace component, verify with user,
     accept with justification)

2. **Produce an audit verdict**:
   - **PASS**: No Critical or High findings. Selection is sound.
   - **PASS WITH CONDITIONS**: No Critical findings, but High
     findings exist that should be addressed or acknowledged.
   - **FAIL**: Critical findings exist. Selection must be revised
     before proceeding to schematic design.

3. **Audit coverage summary**:
   - Part numbers verified: N / N total
   - Specifications cross-checked: N / N total claims
   - Requirements traced: N / N total requirements
   - Sourcing data verified: N / N total components
   - Compatibility checks performed: N / N total connections
