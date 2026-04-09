<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: fixed-point-verification
type: reasoning
description: >
  Verify transformation correctness by checking convergence. Apply
  the transformation twice and confirm identical output. If the
  outputs differ, the transformation does not reach a fixed point
  and is not idempotent or round-trip stable.
applicable_to: []
# User-composed protocol — not auto-included by any template.
# Intended for: compiler, formatter, serializer, migrator, or
# linter auto-fix tasks where idempotency or round-trip stability
# must be verified.
---

# Protocol: Fixed-Point Verification

Apply this protocol when verifying that a transformation (compiler,
formatter, generator, migrator, serializer, linter auto-fix) is
correct. The core method: a correct transformation produces a
fixed point — applying it twice yields identical output.

## Phase 1: Define the Transformation

1. **Identify the transformation under test**: what is the input
   type, what is the output type, and what is the expected
   semantic relationship (e.g., "output is a formatted version
   of input," "output is compiled from input," "output is
   migrated from input").

2. **Identify the convergence expectation**:
   - **Idempotent transformations** (formatters, linters, config
     generators): `T(T(x)) == T(x)` — applying twice should
     produce identical output to applying once.
   - **Round-trip transformations** (serializers, compilers that
     compile their own output): `T(T(x))` should produce a
     fixed point where further application produces no changes.
   - **Semantic-preserving transformations** (refactoring tools,
     migrations): the output should be functionally equivalent
     to the input, verifiable by a downstream consumer.

3. **Define the comparison method**: how will you determine
   equality between outputs?
   - Byte-identical comparison (strictest)
   - Normalized comparison (ignore whitespace, comments, key order)
   - Semantic comparison (compare behavior, not representation)

   State which method applies and why.

## Phase 2: Execute the Fixed-Point Test

1. **Stage 1**: Apply the transformation to the input.
   Record: output content, output size, execution time, resource
   usage (if measurable).

   ```
   T(input) → output_1
   ```

2. **Stage 2**: Apply the same transformation to output_1.
   Record the same metrics.

   ```
   T(output_1) → output_2
   ```

3. **Compare**: using the comparison method from Phase 1.3,
   determine whether `output_1 == output_2`.

4. **If outputs differ, iterate**: some transformations converge
   after more than 2 passes (e.g., multi-pass normalizers). Apply
   the transformation up to 5 additional times (7 total), checking
   for convergence after each pass. If `output_k == output_(k+1)`
   at any point, a fixed point is reached at pass k. If no
   convergence after 7 passes, proceed to Phase 3 (Diagnose
   Divergence) using the last two outputs.

5. **Record results** in a convergence table:

   | Stage | Output Size | Time | Notes |
   |-------|-------------|------|-------|
   | Stage 1 (input → output_1) | N bytes | Xs | — |
   | Stage 2 (output_1 → output_2) | M bytes | Ys | — |
   | Match | Yes/No | — | Diff summary if No |

## Phase 3: Diagnose Divergence

If no fixed point is reached after iteration, diagnose the divergence:

1. **Diff the outputs**: produce a structured diff between
   output_1 and output_2. Categorize each difference as:
   - **Semantic divergence**: the transformation changed meaning
     on the second pass (e.g., reordered operations, dropped
     data, changed types). This is a correctness bug.
   - **Syntactic divergence**: the transformation changed
     representation without changing meaning (e.g., reformatted
     whitespace, reordered keys). This is an idempotency bug.
   - **Additive divergence**: the second pass added content not
     present in the first pass (e.g., extra comments, metadata,
     generated markers). This is a side-effect bug.

2. **Trace each divergence to its source**: for each difference,
   identify which step in the transformation pipeline produced it.

3. **Classify severity**:
   - **Critical**: semantic divergence — the transformation
     corrupts data or changes behavior on repeated application.
   - **High**: additive divergence — the transformation
     accumulates artifacts over repeated application.
   - **Medium**: syntactic divergence — the transformation is
     not idempotent but preserves semantics.

## Phase 4: Verify Convergence

If `output_1 == output_2`, the transformation passes the fixed-point
test for this input. Additional verification:

1. **Resource convergence**: execution time and resource usage
   should be within 10% between Stage 1 and Stage 2. If Stage 2
   uses significantly more resources, the transformation may have
   a performance bug that compounds on repeated application.

2. **Coverage check**: the fixed-point test only proves
   correctness for the specific input tested. List which input
   features were exercised and which were not. Recommend
   additional inputs that would increase coverage:
   - Edge cases (empty input, maximum-size input)
   - Feature combinations not present in the initial input
   - Inputs that previously caused failures

3. **Record the verdict**:
   - **PASS**: fixed point reached, resources converged, no
     divergence detected.
   - **PASS (partial)**: fixed point reached for tested inputs,
     but coverage is incomplete — list untested features.
   - **FAIL**: divergence detected — list findings from Phase 3.

## Common Applications

| Domain | Input | Transformation | Fixed-point check |
|--------|-------|---------------|-------------------|
| Code formatters | Source code | Format | Format → format again → identical |
| Config generators | Spec file | Generate config | Generate → regenerate → identical |
| Schema migrations | Database | Migrate | Migrate → migrate → no further changes |
| Serialization | Data structure | Serialize/deserialize | Serialize → deserialize → serialize → identical bytes |
| Linting auto-fix | Source code | Apply fixes | Fix → fix again → no new fixes |
| Code generation | Spec/schema | Generate code | Generate → regenerate → identical |
| Template rendering | Template + data | Render | Render → render again → identical |
