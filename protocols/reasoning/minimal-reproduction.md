<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: minimal-reproduction
type: reasoning
description: >
  Systematic bug isolation through minimal reproduction and binary
  simplification. Create the smallest input that triggers the bug,
  then strip features one at a time to isolate the responsible
  component.
applicable_to: []
---

# Protocol: Minimal Reproduction Debugging

Apply this protocol when a bug produces too many errors to debug
directly, when the root cause is unclear, or when the system under
test is too large to reason about as a whole. Execute all phases
in order.

## Phase 1: Construct Minimal Reproduction

1. **Identify the observable symptom**: the exact error message,
   crash, incorrect output, or unexpected behavior. Record it
   verbatim.

2. **Create the smallest input that triggers the symptom**:
   - Start with the smallest possible file, configuration, or
     input that exercises the relevant features.
   - Target 50 lines or fewer. If the original input is thousands
     of lines, do NOT try to debug it directly — build a minimal
     reproduction from scratch.
   - The minimal reproduction must trigger the same symptom (same
     error message, same class of failure), not necessarily the
     same number of errors.

3. **Verify the reproduction**: run the minimal input and confirm
   it produces the target symptom. If it does not, add features
   back one at a time until it does.

4. **Record the baseline**: document the minimal reproduction
   input, the exact command to trigger the symptom, and the
   observed output (error count, error messages, behavior).

## Phase 2: Binary Simplification

Systematically strip features from the minimal reproduction to
isolate the responsible component:

1. **List all features** exercised by the minimal reproduction.
   A "feature" is any distinct language construct, API call,
   configuration option, or code path present in the input.

2. **Remove one feature at a time** and re-run:
   - If the symptom disappears → that feature is involved in the
     bug. Restore it and continue removing other features to
     find the minimal triggering set.
   - If the symptom remains → that feature is not involved.
     Leave it removed to keep the reproduction minimal.
   - If the error count changes (increases or decreases) → that
     feature interacts with the bug. Record the interaction.

3. **Track each step** in a simplification table:

   | Step | Change | Errors | Insight |
   |------|--------|--------|---------|
   | 0 | Baseline | N | Starting point |
   | 1 | Remove feature X | N-2 | X contributes 2 errors |
   | 2 | Remove feature Y | N-2 | Y not involved |
   | ... | ... | ... | ... |

4. **Stop when the reproduction contains only features that are
   all necessary** — removing any single one eliminates the
   symptom. This is the minimal triggering set.

## Phase 3: Pivot Point Identification

Search for the boundary between working and broken:

1. **Find two nearly-identical inputs** where one triggers the
   symptom and the other does not. The difference between them
   is the pivot point.

2. **Minimize the difference**: reduce the two inputs until they
   differ by the smallest possible change (one character, one
   token, one argument, one configuration flag).

3. **The pivot point reveals the bug location**: if adding
   parentheses fixes the error, the bug is in parsing precedence.
   If changing argument order fixes it, the bug is in parameter
   binding. The nature of the minimal fix implies the defective
   component.

4. **Verify upstream before blaming the obvious target**: the
   component producing the error may be correct — it may be
   receiving malformed input from an upstream component. Trace
   the data flow from input to the error site and verify each
   intermediate representation.

## Phase 4: Root Cause Confirmation

1. **Formulate a hypothesis** based on the pivot point: which
   component is defective and why.

2. **Predict the fix**: based on the hypothesis, describe the
   specific code change that would resolve the bug.

3. **Verify the prediction**: apply the fix (or describe it
   precisely if you cannot apply it) and confirm:
   - The minimal reproduction no longer triggers the symptom.
   - The original full-size input shows improvement (reduced
     error count or resolved symptom).
   - No new errors are introduced.

4. **Document the causal chain**: from original symptom → minimal
   reproduction → binary simplification → pivot point → root
   cause → fix. This chain must be traceable — every step must
   cite specific inputs and outputs.

## Key Principles

- **Small reproduction files are the most powerful debugging tool.**
  More powerful than debuggers, more powerful than logging. A 40-line
  file that reproduces the bug reduces iteration time from minutes
  to seconds.
- **The bug is rarely where you think it is.** Always check upstream.
  The component producing the error may be functioning correctly on
  malformed input from an earlier stage.
- **The most impactful fixes are often the smallest.** Three lines
  of deletion can fix 1,600 errors. The goal is not to write code
  but to find the precise location where the system diverges from
  correct behavior.
