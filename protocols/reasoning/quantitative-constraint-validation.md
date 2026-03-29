<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: quantitative-constraint-validation
type: reasoning
description: >
  Systematic validation of quantitative claims (budgets, rollups,
  margins) against specification constraints. Covers constraint
  extraction, arithmetic verification, unit checking, margin analysis,
  sensitivity analysis, and completeness. Budget-type-agnostic —
  works for power, cost, timing, link, memory, and other budgets.
applicable_to:
  - validate-budget
---

# Protocol: Quantitative Constraint Validation

Apply this protocol when validating a numerical analysis artifact
(power budget, cost rollup, link budget, timing analysis, memory
budget, etc.) against the quantitative constraints in a specification.
Execute all phases in order.

## Phase 1: Constraint Extraction

Extract every quantitative constraint from the specification.

1. **Scan for numerical limits** — search every normative section for
   values with units, comparison operators, or bounding language (≤,
   ≥, "at most", "at least", "within", "not to exceed", "minimum",
   "maximum").

2. **For each constraint, record:**
   - **ID**: spec requirement ID if one exists (e.g., `HW-0400`),
     otherwise assign `QC-<NNN>`
   - **Constraint text**: verbatim spec language
   - **Bound type**: upper-limit | lower-limit | range | tolerance |
     ratio | margin-requirement
   - **Value**: the numerical limit
   - **Unit**: physical or monetary unit (e.g., µA, USD, ms, dBm)
   - **Scope**: what operating state, mode, or condition the
     constraint applies in
   - **Keyword strength**: MUST / SHOULD / MAY
   - **Source location**: section, paragraph, requirement ID

3. **Classify each constraint by budget type:**
   - **Absolute limit**: a single ceiling or floor (e.g., ≤ 20 µA)
   - **Rollup budget**: a summation that must not exceed a total
     (e.g., BOM cost ≤ $5)
   - **Relative constraint**: expressed as a fraction of another value
     (e.g., ≤ 80% of rail capacity)
   - **Margin requirement**: mandates minimum headroom (e.g., link
     margin ≥ 10 dB)
   - **Tolerance band**: a nominal ± deviation (e.g., 3.3V ± 5%)

4. **Check for implicit constraints** — constraints implied by the
   intersection of two requirements but not stated as a single number.
   Example: regulator quiescent current ≤ 10 µA and total sleep
   current ≤ 20 µA implies all other sleep loads must total ≤ 10 µA.
   Flag these as `[DERIVED]` with derivation shown.

5. **Present the constraint table** before proceeding.
   Misidentified constraints corrupt all downstream analysis.

## Phase 2: Claim Extraction

Extract every quantitative claim from the analysis artifact.

1. **Scan for every numerical value** that represents a calculated,
   measured, estimated, or datasheet-sourced quantity.

2. **For each claim, record:**
   - **Claim ID**: `CL-<NNN>` (sequential)
   - **Claimed value**: number and unit
   - **Source type**: calculated | measured | datasheet | estimated |
     simulated
   - **Derivation**: formula or method used (e.g., "sum of Table 3
     rows", "V/R = I")
   - **Component list**: for rollup claims, the individual items
     that sum to the total
   - **Applies to constraint**: which constraint ID(s) this claim
     addresses

3. **Check for orphaned claims** — values that don't map to any
   constraint. Flag but do not discard — they may indicate
   constraints the spec doesn't cover.

4. **Check for unsubstantiated claims** — values asserted without
   derivation or source citation. Flag as `[UNSUBSTANTIATED]`.

## Phase 3: Unit and Dimension Verification

Verify that every comparison between a claim and a constraint is
dimensionally valid.

1. **For each claim↔constraint pair**, verify:
   - Units are identical or correctly converted (e.g., mA vs µA —
     is the factor of 1000 applied?)
   - The comparison direction is correct (is the claim the value
     that must be *below* the constraint, or *above* it?)
   - Quantities being compared measure the same physical property
     (no comparing peak current to average current without explicit
     justification)

2. **Check unit consistency within rollups** — every addend in a
   summation must have the same unit. Flag mixed units.

3. **Check dimensional analysis of formulas** — for derived claims,
   verify that the formula's dimensional analysis produces the stated
   unit. Example: V/R should produce A, not W.

4. **Flag implicit unit conversions** — where the artifact converts
   between units, verify the conversion factor. Common errors:
   mA↔µA (×1000), dBm↔mW (logarithmic), °C↔K (+273.15).

## Phase 4: Arithmetic Verification

Re-derive key calculations independently.

1. **For every rollup claim** (summation, weighted average,
   accumulated total):
   - List all components that should be included
   - Re-sum independently
   - Compare re-derived total to the artifact's stated total
   - Flag any discrepancy, even if the total still passes the
     constraint

2. **For every formula-derived claim**:
   - Identify the formula used
   - Verify the formula is correct for the physical situation
   - Substitute the input values and compute the result
   - Compare to the artifact's stated result

3. **For conditional/stateful budgets** (e.g., current per operating
   state):
   - Verify that the correct components are active in each state
   - A load that is power-gated off should not appear in the
     deep-sleep budget
   - A load that is always-on must appear in every state's budget

4. **Limitations acknowledgment**: If a claim depends on simulation
   results (FEA, SPICE, RF modeling) or empirical measurements that
   cannot be re-derived from first principles, state explicitly:
   "This claim relies on [simulation/measurement] results that
   cannot be independently verified by analysis alone. Verification
   requires [running the simulation / lab measurement]." Do NOT
   fabricate a re-derivation. Instead, verify that the *inputs* to
   the simulation and the *interpretation* of its outputs are
   consistent with the spec.

## Phase 5: Margin Analysis

For each constraint↔claim pair, compute and classify the margin.

1. **Compute margin** using the formula appropriate to the bound type:
   - **Upper limit**: margin = (limit − claimed) / limit × 100%
   - **Lower limit**: margin = (claimed − limit) / limit × 100%
   - **Tolerance band**: margin = (tolerance − |deviation|) /
     tolerance × 100%
   - **Logarithmic quantities** (dB): margin_dB = claimed_dB −
     limit_dB (headroom-to-limit; do not convert to linear)

2. **Classify each margin** based on the margin delta (headroom to
   limit), not the raw constraint value:

   | Classification | Condition |
   |----------------|-----------|
   | **Violated** | margin < 0 (negative headroom) |
   | **Marginal** | 0 ≤ margin < spec-defined adequacy threshold |
   | **Adequate** | margin ≥ adequacy threshold |
   | **Excessive** | margin well above threshold and resource could be reclaimed (informational) |

3. **Use spec-defined thresholds when available.**
   - For **percentage-based margins** (upper/lower limit, tolerance):
     if the spec defines a required margin percentage, use that. If
     the spec is silent, default to 10% but flag as `[ASSUMED]`.
   - For **non-percentage margins** (dB, volts, seconds): treat
     margin = 0 as the Violated/Marginal boundary. If the spec
     defines a minimum margin in native units (e.g., "link budget
     must have ≥ 6 dB margin"), use that as the Marginal/Adequate
     boundary. Do NOT apply the 10% default to non-percentage margins.

4. **Present a margin summary table:**

   | Constraint ID | Constraint | Claimed | Margin | Classification |
   |---------------|------------|---------|--------|----------------|
   | QC-001 | ≤ 20 µA | 14.2 µA | 29% | Adequate |
   | QC-002 | ≤ $5.00 | $4.85 | 3% | Marginal |

## Phase 6: Sensitivity Analysis

Identify which input assumptions most threaten constraint compliance.

1. **For each Violated or Marginal result** (REQUIRED), and for each
   Adequate result with margin < 20% (RECOMMENDED):
   - Identify the input parameters that contribute most to the
     claimed value
   - Compute: "If input parameter X increases by Y%, does the claim
     flip from pass to fail?"
   - Report the **break-even delta** — the percentage change in each
     key input that would consume the remaining margin

2. **Common sensitivity patterns:**
   - **Rollup budgets**: which single line-item, if its actual value
     is 2× the estimate, flips the total?
   - **Tolerance stacks**: worst-case combination of component
     tolerances — does the budget still pass if all tolerances go
     adverse simultaneously?
   - **Operating condition dependencies**: does the budget pass at
     temperature/voltage extremes, not just nominal?

3. **Flag single points of failure** — if one input assumption
   changing by a plausible amount (datasheet tolerance, measurement
   uncertainty, or ±20% estimate error) would flip the result, that
   is a finding regardless of current margin classification.

4. **For Adequate findings with margin > 20%**, sensitivity analysis
   is optional. Note that it was skipped and why.

## Phase 7: Completeness Check

Verify that every constraint is covered and every rollup component
is accounted for.

1. **Constraint coverage**: For every constraint from Phase 1, verify
   that at least one claim from Phase 2 addresses it. Missing coverage
   is a finding.

2. **Rollup completeness**: For every rollup budget, verify that all
   components that should contribute are included:
   - Power budgets: every load on the rail in the given state
   - Cost budgets: every component in the BOM
   - Timing budgets: every stage in the pipeline
   - Memory budgets: every allocation region

3. **State coverage**: If the spec defines multiple operating
   states/modes, verify that the artifact provides a budget for each
   state, not just the "typical" one. Missing states are findings.

4. **Cross-constraint consistency**: Check that claims used in
   multiple budgets are consistent. If component X draws 2 mA in the
   power budget but 3 mA in the thermal budget, flag the
   inconsistency.

5. **Produce a coverage matrix**: constraints × claims, showing which
   are covered, which have margin issues, and which are missing.
