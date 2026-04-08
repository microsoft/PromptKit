<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: definition-of-done
type: guardrail
description: >
  Completion-verification checklist that defines explicit criteria for
  when a task is truly done. Prevents premature completion declarations
  by requiring verification of functionality, tests, diagnostics, build
  health, regression safety, and plan alignment.
applicable_to:
  - composable
  # User-composed protocol — not auto-included by any template.
  # Intended for: implementation planning, engineering workflows,
  # and any task where explicit completion criteria prevent premature
  # "done" declarations.
---

# Protocol: Definition of Done

When this protocol is included in a prompt, apply it as a final gate
before declaring any implementation task complete. Do NOT declare a
task done until every applicable criterion below is verified.

## Rules

### 1. Functional Verification

- The implemented feature or fix passes its acceptance test or
  demonstrates the expected behavior.
- If the task has acceptance criteria (from a requirements document,
  issue description, or plan), verify each criterion individually
  and record the result (pass / fail / not applicable).
- If no acceptance criteria exist, state what was verified and how.

### 2. Test Coverage

- **Positive tests**: At least one test exercises the intended
  behavior (happy path).
- **Negative tests**: At least one test exercises an expected failure
  mode (invalid input, missing resource, permission denied).
- **Edge cases**: For every quantitative threshold or boundary in
  the implementation, at least one test exercises the boundary
  (empty collection, zero value, maximum value, off-by-one).
- If any category is not applicable, document why (e.g., "no
  quantitative thresholds in this change").

### 3. Diagnostics and Error Messages

- Every new error path produces a specific, actionable error message
  that includes: what failed, where it failed, and what the user or
  caller should do.
- Error messages do NOT expose internal implementation details
  (stack traces, memory addresses, internal function names) to
  end users.
- If the change does not add new error paths, state "No new error
  paths introduced."

### 4. Build Health

- The project builds with zero errors.
- The project builds with zero new warnings. Pre-existing warnings
  are acceptable only if documented as known conditions.
- If the project has a lint or static analysis step, it passes
  with no new findings.

### 5. Regression Safety

- All pre-existing tests pass. If any pre-existing test fails,
  determine whether the failure is caused by the change (regression)
  or is a pre-existing flaky test. Document the determination.
- If a pre-existing test was intentionally modified or removed,
  document why (e.g., "test was obsoleted by the new API").

### 6. Plan Alignment

- If a planning document, design document, or issue description
  guided the implementation, verify that the final implementation
  matches the plan.
- If the implementation deviated from the plan, update the plan
  to reflect the deviation and document the reason (e.g., "design
  change: switched from polling to event-driven because...").
- If no plan exists, skip this check and state "No planning
  document to verify against."

### 7. Cleanup

- No temporary files, debug prints, commented-out code, or TODO
  markers remain in the committed change.
- No dead code (unused variables, unreachable branches, unused
  imports) was introduced.
- If temporary artifacts are intentionally retained (e.g., a
  debug flag behind a compile-time switch), document why.

## Per-Commit Quick Check

Before each commit, verify:

- [ ] Build passes (zero errors, zero new warnings)
- [ ] All tests pass (existing + new)
- [ ] No dead code introduced
- [ ] No temporary files or debug artifacts committed
- [ ] Style conventions followed (if the project has a linter, it passes)

## Completion Declaration

After verifying all applicable rules above, state:

```
Done. Verified: [list which rules were checked].
Not applicable: [list which rules were skipped and why].
```

If any rule fails and cannot be resolved, do NOT declare done.
Instead, document the blocker and present it to the user for decision.
