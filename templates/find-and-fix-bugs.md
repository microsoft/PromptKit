<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: find-and-fix-bugs
description: >
  Autonomous bug-finding workflow. Scan code for a specific class of
  bugs, apply fixes, build to verify, iterate on errors, and produce
  a findings report. Designed for batch remediation of known bug
  patterns (memory safety, compiler warnings, security vulnerabilities).
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - guardrails/minimal-edit-discipline
format: investigation-report
params:
  bug_class: "Class of bugs to find — e.g., 'buffer overflows', 'use-after-free', 'null dereference', 'resource leaks', 'compiler warning C4456'"
  source_path: "Directory or file(s) to scan"
  language: "Programming language of the code"
  build_command: "(Optional) Command to build the code after applying fixes"
  fix_instructions: "(Optional) Specific fix patterns or rules to follow"
  max_iterations: "(Optional) Maximum build-fix-rebuild cycles — default 10"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A findings report listing identified bugs, fixes applied,
    build verification results, and patterns discovered.
---

# Task: Find and Fix Bugs

You are tasked with scanning code for a specific class of bugs, fixing
them, verifying the fixes build correctly, and producing a findings report.

## Inputs

**Bug Class**: {{bug_class}}

**Source Path**: {{source_path}}

**Language**: {{language}}

**Build Command**: {{build_command}}

**Fix Instructions**: {{fix_instructions}}

**Max Iterations**: {{max_iterations}}

## Instructions

1. **Apply the minimal-edit-discipline protocol** throughout. Every fix
   must be minimal, type-preserving, and verifiable.

2. **Scan phase** — systematically examine the code at {{source_path}}
   for instances of {{bug_class}}:
   - Read each file completely before identifying issues
   - For each potential bug, classify: confirmed bug, likely bug,
     suspicious, or false positive
   - Record the location, code snippet, and classification

3. **Fix phase** — for each confirmed or likely bug:
   - Apply the fix following {{fix_instructions}} if provided
   - If no fix instructions exist, apply the minimal correct fix
   - Do NOT refactor or modernize surrounding code
   - If a pattern is not covered by fix instructions, log it as an
     unmatched pattern — do NOT guess

4. **Build-verify loop** — after applying fixes to a file:
   - Run {{build_command}} (if provided)
   - If the build fails, undo the fix for that file and log the failure
   - If the build succeeds, proceed to the next file
   - Repeat for up to {{max_iterations}} cycles if new errors emerge

5. **Autonomous execution** — do NOT ask for user input during the
   scan-fix-build loop. Proceed autonomously until:
   - All identified bugs are processed, OR
   - The maximum iteration count is reached, OR
   - A blocking error requires human judgment

6. **Progress tracking** — maintain a progress log:
   - Files scanned, files remaining
   - Bugs found (by classification)
   - Fixes applied, fixes reverted (with reasons)
   - Build results per iteration

7. **Pattern discovery** — when encountering bug patterns not covered
   by {{fix_instructions}}:
   - Document the new pattern: description, example code, recommended
     fix, rationale
   - These become candidates for extending the fix instructions

8. **Report** — produce a findings report including:
   - Summary of bugs found by classification
   - Fixes applied with before/after code
   - Fixes reverted due to build failures
   - Unmatched patterns discovered
   - Statistics: total instances found / fixed / deferred / reverted

## Non-Goals

- Do NOT refactor or modernize code beyond the specific fix
- Do NOT fix issues unrelated to {{bug_class}}
- Do NOT commit code that does not build
- Do NOT guess at fixes for unmatched patterns

## Quality Checklist

Before finalizing, verify:

- [ ] Every fix addresses a specific, identified instance of {{bug_class}}
- [ ] No unrelated code was modified
- [ ] All modified code builds successfully (or was reverted)
- [ ] Unmatched patterns are logged, not guessed at
- [ ] Progress tracking is complete
- [ ] Statistics are accurate
