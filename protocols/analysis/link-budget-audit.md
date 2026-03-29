<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: link-budget-audit
type: analysis
description: >
  Systematic link budget review protocol. Audits a wireless link
  budget for transmitter chain, path loss model selection, receiver
  chain, margin adequacy, regulatory compliance, and sensitivity
  to environmental assumptions.
applicable_to:
  - audit-link-budget
---

# Protocol: Link Budget Audit

Apply this protocol when reviewing a wireless link budget against
system requirements and regulatory constraints. Execute all phases
in order.

## Phase 1: System Parameter Verification

Verify the fundamental system parameters are correct and consistent.

1. **Operating frequency**: Confirm the frequency or band matches
   the requirements. Verify wavelength calculations are correct.

2. **Modulation and data rate**: Verify the modulation scheme and
   data rate match the requirements. Confirm that the receiver
   sensitivity value corresponds to the specified modulation, data
   rate, and target BER/PER.

3. **Target range**: Verify the required communication range matches
   the deployment scenario in the requirements.

4. **Reliability target**: Is there a required link availability
   (e.g., 99%, 99.9%)? This drives fade margin requirements.

5. **Channel bandwidth**: Verify occupied bandwidth is consistent
   with the modulation, data rate, and regulatory constraints.

## Phase 2: Transmitter Chain Analysis

Audit the transmit side of the link budget.

1. **Transmit power**: Verify the TX power value matches the
   transceiver datasheet at the configured power level. Check
   whether the value is conducted power (at the IC pin) or
   radiated power (EIRP).

2. **Cable and connector losses**: Are all losses between the
   transmitter and antenna accounted for? Include:
   - PCB trace loss (significant at GHz frequencies)
   - Connector losses (SMA, U.FL, etc.)
   - Cable loss if external antenna is used
   - Matching network insertion loss

3. **Transmit antenna gain**: Verify the gain value and confirm:
   - Is this peak gain or gain in the direction of the receiver?
   - Is this free-space gain or gain with the actual ground plane/
     enclosure?
   - Source: datasheet, simulation, or measurement?

4. **EIRP calculation**: Verify EIRP = TX power − losses + antenna
   gain. This is the single most important number in the budget.

## Phase 3: Path Loss Model Assessment

Audit the path loss calculation — this is where most link budget
errors occur.

1. **Model selection**: Is the path loss model appropriate for the
   deployment environment?
   - Free-space (FSPL): only valid for unobstructed LOS with no
     reflections. Rarely valid for real deployments.
   - Log-distance: appropriate for indoor/urban with calibrated
     path loss exponent (n). What value of n is used? Source?
   - ITU indoor propagation: appropriate for indoor, accounts for
     floor/wall penetration. Are penetration loss values realistic?
   - Two-ray ground reflection: appropriate for outdoor ground-level
     deployments at distance.
   - Empirical (Hata, COST-231): appropriate for urban/suburban
     macro-cell. Usually not appropriate for short-range IoT.

2. **Model parameters**: Are the model parameters justified?
   - Path loss exponent: measured, estimated, or assumed?
   - Shadow fading margin: what standard deviation is assumed?
   - Penetration losses: how many walls/floors? What material?

3. **Range calculation**: Verify the path loss at the target range
   is calculated correctly:
   - FSPL = 20·log₁₀(d) + 20·log₁₀(f) + 20·log₁₀(4π/c)
   - Verify units (meters vs. km, MHz vs. GHz)
   - Verify the formula matches the stated model

4. **Environmental factors not in the model**:
   - Rain fade (significant above 10 GHz)
   - Vegetation loss
   - Body loss (wearable devices)
   - Atmospheric absorption (significant at 60 GHz, negligible
     below 6 GHz)
   - Flag any relevant factors not accounted for

## Phase 4: Receiver Chain Analysis

Audit the receive side of the link budget.

1. **Receiver sensitivity**: Verify the sensitivity value:
   - Matches the transceiver datasheet for the specified modulation,
     data rate, and BER/PER
   - Accounts for noise figure if an external LNA is used
   - Is specified at the antenna port, not at baseband (account
     for front-end losses)

2. **Receive antenna gain**: Same checks as transmit antenna
   (Phase 2.3) — deployed gain, not just datasheet gain.

3. **Cable and connector losses**: Same checks as transmit side
   (Phase 2.2) — losses between antenna and receiver.

4. **Implementation loss**: Is there an implementation loss budget?
   Real receivers typically perform 2–3 dB worse than the
   theoretical sensitivity. Flag if no implementation loss is
   included.

## Phase 5: Margin Analysis

Compute and assess the link margin.

1. **Link margin calculation**:
   margin = EIRP − path_loss + RX_antenna_gain − RX_losses
            − receiver_sensitivity

   Verify arithmetic. Verify all terms use consistent units (dBm
   for powers, dBi for gains, dB for losses).

2. **Fade margin adequacy**: Compare the computed margin to the
   required fade margin:
   - If the requirement specifies a minimum margin (e.g., ≥ 10 dB),
     check compliance
   - If no margin is specified, assess adequacy based on the
     environment:
     - Indoor office: 10–15 dB typical
     - Indoor industrial: 15–20 dB
     - Outdoor urban: 10–20 dB
     - Outdoor rural LOS: 5–10 dB
   - Flag the margin threshold source as [KNOWN] (from spec) or
     [ASSUMPTION] (engineering judgment)

3. **Margin under corner conditions**: Does the budget close at:
   - Maximum range (not just typical range)?
   - Minimum TX power (if power control is used)?
   - Worst-case antenna orientation (if antennas are not aligned)?
   - Temperature extremes (oscillator drift, component derating)?

## Phase 6: Regulatory Compliance Check

Verify the link budget complies with applicable regulations.

1. **EIRP limit**: Compare calculated EIRP to the regulatory limit
   for the band and region:
   - FCC Part 15.247 (915 MHz ISM): 1W conducted + 6 dBi antenna
     = 36 dBm EIRP
   - FCC Part 15.249 (2.4 GHz ISM): varies by modulation type
   - ETSI EN 300 220 (868 MHz): 25 mW (14 dBm) ERP for most
     sub-bands
   - Flag the specific regulation and sub-band

2. **Occupied bandwidth**: Verify the signal bandwidth is within
   the regulatory limit for the channel.

3. **Duty cycle**: If the regulation imposes duty cycle limits
   (common in EU 868 MHz), verify compliance.

4. **Spurious emissions**: If the link budget includes a power
   amplifier, flag that spurious emission compliance must be
   verified by measurement (not by analysis).

## Phase 7: Sensitivity Analysis

Identify which assumptions most affect link closure.

1. **For marginal links** (margin < 6 dB): identify the top 3
   parameters that, if worse than assumed, would break the link:
   - Path loss exponent uncertainty
   - Antenna gain in deployed configuration
   - Receiver sensitivity at temperature extremes
   - TX power variation over temperature

2. **Range vs. margin curve**: If the budget is for a specific
   range, note the maximum range at which the link still closes
   with adequate margin.

3. **Environment sensitivity**: Does the link close if the
   deployment environment changes? (e.g., indoor → indoor with
   one concrete wall, outdoor LOS → outdoor NLOS)
