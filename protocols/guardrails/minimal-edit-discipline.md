<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: minimal-edit-discipline
type: guardrail
description: >
  Cross-cutting protocol constraining code modifications to be minimal,
  type-preserving, encoding-safe, and verifiable. Prevents collateral
  damage from automated fixes, refactoring, and code generation.
  Apply to any task that modifies existing source code.
applicable_to: all
---

# Protocol: Minimal Edit Discipline

This protocol MUST be applied to any task that modifies existing source
code. It prevents collateral damage from over-editing and ensures every
change is intentional, verifiable, and safe.

## When to Apply

- Fixing compiler warnings or errors
- Applying code review findings
- Refactoring or modernizing code
- Fixing bugs
- Any automated or semi-automated code modification

## Rules

### 1. Minimal Changes Only

- Fix exactly the flagged issue. Do NOT refactor, modernize, or "improve"
  surrounding code.
- If a nearby improvement is important, flag it as a separate finding —
  do not bundle it.
- Each edit MUST be independently justifiable: if asked "why did you change
  this line?", you must have a specific answer tied to the task.

### 2. Preserve Original Types

- Do NOT substitute typedefs, aliases, or equivalent types unless the fix
  specifically requires a type change.
- If the original code uses `DWORD`, do not change it to `uint32_t`
  unless that IS the fix.
- Match the type vocabulary of the surrounding code.

### 3. Maintain Formatting and Style

- Match the existing indentation, spacing, and style of the file.
- If the file uses tabs, use tabs. If 2-space indent, use 2-space indent.
- Do not reformat lines you did not semantically change.
- When a fix changes token length (e.g., `NULL` → `nullptr`), simplify
  alignment on the touched line only — do not re-align adjacent untouched
  lines.

### 4. Avoid Encoding Corruption

- Some source files use non-UTF-8 encodings (Windows-1252, Shift-JIS/CP932,
  CP437) for non-ASCII characters in comments, strings, or literals.
- Before editing a file, check for non-ASCII bytes (any byte > 127). If
  present:
  - Prefer byte-level manipulation over text-based editing.
  - Verify with `git diff` after editing that only intended lines changed.
  - Any unexpected changes to non-ASCII content indicate encoding
    corruption — undo and investigate.
- NEVER assume all source files are UTF-8.

### 5. Build Verification Loop

- After applying fixes, build the affected code.
- If the build fails, undo the change for that file and report the failure.
- Do NOT commit code that does not build.
- Treat ALL build errors as fatal — there are no pre-existing errors to
  ignore.

### 6. Log Unmatched Patterns

- When you encounter a code pattern not covered by the task's fix
  instructions, do NOT guess at a fix.
- Log the unmatched pattern with:
  - File path
  - Line number
  - Code snippet
  - Brief explanation of why it was not fixed
- These become candidates for extending the fix instructions.

### 7. Preserve Special Characters

- Do NOT modify lines containing form feed (U+000C), vertical tab, or
  other control characters unless they are directly part of the fix target.
- If a fix requires editing near such characters, edit only the specific
  target and leave surrounding content exactly as-is.

### 8. Progress Tracking

- For batch operations (fixing N instances across M files), maintain a
  progress log:
  - Files processed, files remaining
  - Fixes applied, fixes skipped (with reasons)
  - Build verification results
- If resuming an interrupted batch, check the progress log to avoid
  re-processing files.

### 9. Self-Improving Instructions

- When a fix reveals a new pattern not covered by existing instructions,
  document it.
- New patterns should include:
  - Description
  - Example code
  - Recommended fix
  - Rationale
- These discovered patterns feed back into the fix instructions for
  future runs.

## Self-Verification

Before finalizing any batch of code modifications, answer these questions
explicitly:

- [ ] Every change addresses a specific, identified issue
- [ ] No unrelated code was modified (no drive-by refactoring)
- [ ] Original types are preserved where the fix did not require type changes
- [ ] File formatting matches the surrounding code style
- [ ] Files with non-ASCII content were checked for encoding integrity
- [ ] All modified code builds successfully
- [ ] Unmatched patterns are logged, not guessed at
- [ ] Progress tracking is complete and accurate

If any answer is "no," address the gap before finalizing.
