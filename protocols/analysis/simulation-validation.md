<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: simulation-validation
type: analysis
description: >
  Systematic review of circuit simulation output (SPICE, power budget
  calculators, thermal analysis) against specification constraints.
  Covers setup verification, result interpretation, constraint
  compliance, corner-case coverage, and model validity assessment.
applicable_to:
  - validate-simulation
---

# Protocol: Simulation Validation

Apply this protocol when reviewing simulation output (SPICE transient/
AC/DC analysis, power budget calculations, thermal simulations, or
other EDA tool results) against specification constraints. Execute all
phases in order.

## Phase 1: Simulation Setup Review

Verify the simulation is configured to answer the right questions.

1. **Identify the simulation type**: DC operating point, transient,
   AC sweep, Monte Carlo, worst-case, thermal, or power budget.

2. **Verify stimulus conditions**: Are the input stimuli (voltage
   sources, current loads, clock frequencies, temperature) consistent
   with the specification's operating conditions?
   - Input voltage range matches spec (e.g., battery discharge curve,
     USB voltage tolerance)
   - Load profiles match the specified operating states (active, sleep,
     burst)
   - Temperature matches the specified operating range (not just room
     temperature)

3. **Verify component models**:
   - Are SPICE models from the component manufacturer (not generic)?
   - Are model parameters at the correct temperature/process corner?
   - Are parasitic elements included where they matter (ESR for
     capacitors, DCR for inductors, trace resistance for power paths)?
   - Flag any missing models or placeholder components.

4. **Verify measurement points**: Are the simulation probes measuring
   the right nodes? A voltage measured at the regulator output is not
   the same as voltage at the IC power pin (IR drop matters).

## Phase 2: Result Extraction

Extract quantitative results from the simulation output.

1. **For each measurement point**, extract:
   - Steady-state value (DC operating point or settled value)
   - Transient behavior (overshoot, undershoot, settling time, ringing)
   - Ripple (peak-to-peak variation in steady state)
   - Worst-case value across the simulation (min/max envelope)

2. **For power analysis**, extract per-component and per-rail:
   - Average power dissipation
   - Peak power dissipation
   - Current draw per operating state
   - Total power budget per rail per state

3. **For thermal analysis**, extract:
   - Junction temperature per component
   - Ambient-to-junction thermal path
   - Thermal margin to absolute maximum rating

4. **Record the units and conditions** for every extracted value.
   A current measurement is meaningless without stating the operating
   state, input voltage, and temperature at which it was taken.

## Phase 3: Constraint Compliance Check

Compare each extracted result against the corresponding specification
constraint.

1. **Map results to constraints**: For each specification constraint
   (voltage tolerance, current limit, timing requirement, thermal
   limit), identify the simulation result that addresses it.

2. **Check compliance**:
   - Does the simulated value satisfy the constraint under the
     simulated conditions?
   - Does it satisfy the constraint with adequate margin? (Use the
     quantitative-constraint-validation methodology for margin
     classification if formal margin analysis is needed.)

3. **Flag non-compliance**: For each constraint that is not satisfied:
   - What is the violation magnitude?
   - Under what conditions does it occur (input voltage, load, temp)?
   - Is the violation due to the design or due to simulation setup?

4. **Flag uncovered constraints**: Specification constraints that have
   no corresponding simulation result. These are coverage gaps — the
   simulation doesn't answer whether the constraint is met.

## Phase 4: Corner-Case and Worst-Case Assessment

Verify the simulation covers the corners that matter.

1. **Input voltage corners**: Was the simulation run at minimum and
   maximum input voltage, not just nominal?
   - Battery: fully charged (4.2V) AND near-cutoff (3.0V)
   - USB: minimum (4.5V) AND maximum (5.5V)
   - Flag if only nominal (3.7V, 5.0V) was simulated

2. **Load corners**: Was the simulation run at minimum and maximum
   load?
   - No load / sleep (leakage only)
   - Maximum load (all peripherals active + radio TX)
   - Load transients (sudden current step)

3. **Temperature corners**: Was the simulation run across the
   operating temperature range?
   - Room temperature only is insufficient for production designs
   - Component parameters (ESR, leakage, threshold voltage) vary
     with temperature

4. **Process corners** (if applicable): For IC-level simulations,
   were fast/slow/typical corners included?

5. **For each missing corner**, flag it as a coverage gap with the
   specific risk: "Regulator dropout was only simulated at 25°C;
   dropout voltage increases at high temperature per datasheet
   Figure X."

## Phase 5: Model Validity Assessment

Assess whether the simulation models are trustworthy.

1. **Manufacturer models vs. generic**: Are critical components
   (regulators, MOSFETs, op-amps) using manufacturer-provided SPICE
   models? Generic models may not capture dropout behavior, thermal
   shutdown, or current limiting accurately.

2. **Model completeness**: Do the models include the behaviors that
   matter for this simulation?
   - Regulator models: dropout, PSRR, load transient response,
     current limit
   - MOSFET models: gate threshold variation, RDS(on) vs. temperature
   - Capacitor models: ESR, DC bias derating, temperature coefficient

3. **Parasitic accuracy**: Are PCB parasitics (trace resistance,
   via inductance, ground impedance) included where they affect
   results? Flag if the simulation assumes ideal connections for
   high-current or high-frequency paths.

4. **Confidence classification**: For each simulation result, assess
   model confidence:
   - **High**: manufacturer model, parasitics included, matches
     datasheet typical curves
   - **Medium**: manufacturer model but missing some parasitic effects,
     or generic model for a non-critical component
   - **Low**: generic model for a critical component, or significant
     parasitics omitted

## Phase 6: Findings Summary

Compile findings from all phases.

1. **For each finding**, document:
   - Phase that discovered it (Setup / Result / Compliance /
     Corner-Case / Model)
   - Affected component(s) and net(s)
   - The specification constraint involved (if applicable)
   - Severity (Critical / High / Medium / Low / Informational)
   - Remediation: simulation fix (re-run with correct setup) vs.
     design fix (circuit change needed) vs. coverage gap (additional
     simulation needed)

2. **Produce a simulation coverage summary**:
   - Constraints checked / total specification constraints
   - Corners simulated / total relevant corners
   - Model confidence: count of High / Medium / Low confidence results
   - Overall simulation health assessment
