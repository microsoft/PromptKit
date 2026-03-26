<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: fix-compiler-warnings
description: >
  Systematic batch remediation of compiler warnings. Process warnings
  from SARIF or compiler output, apply rule-specific fix patterns,
  build-verify each fix, track progress, and discover new patterns.
  Designed for at-scale warning elimination campaigns.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - guardrails/minimal-edit-discipline
  - analysis/compiler-diagnostics-cpp
format: structured-findings
params:
  warning_id: "Warning/diagnostic code to fix — e.g., 'C4430', '-Wenum-conversion', 'C4456'"
  source_directories: "Directories containing code to fix"
  diagnostics_input: "(Optional) Path to SARIF file or compiler output containing the warnings"
  fix_instructions: "(Optional) Rule-specific fix patterns — if not provided, use the compiler-diagnostics-cpp protocol"
  build_command: "(Optional) Command to build and verify fixes"
  language: "Programming language — default: C++"
input_contract: null
output_contract:
  type: structured-findings
  description: >
    A structured findings report documenting all processed warnings,
    fixes applied, build results, and newly discovered patterns.
---

# Task: Fix Compiler Warnings

## Inputs

- **Warning ID**: {{warning_id}}
- **Source Directories**: {{source_directories}}
- **Diagnostics Input**: {{diagnostics_input}}
- **Fix Instructions**: {{fix_instructions}}
- **Build Command**: {{build_command}}
- **Language**: {{language}}

## Instructions

1. **Load warning instances**:
   - If {{diagnostics_input}} is provided (SARIF or compiler output), parse
     it to extract all instances of {{warning_id}}
   - Otherwise, build {{source_directories}} and capture warnings matching
     {{warning_id}} from compiler output
   - Group instances by file

2. **Load fix instructions**:
   - If {{fix_instructions}} is provided, read and internalize the fix rules
   - Otherwise, use the compiler-diagnostics-cpp protocol for standard
     resolution strategies
   - Understand ALL fix patterns before beginning fixes

3. **Process each file**:
   a. Check progress log — skip files already processed
   b. Read the file and analyze each warning instance against fix
      instructions
   c. Classify each instance: fixable (matches known pattern), skip (needs
      manual review), or new pattern
   d. **Handle pragma suppressions** (toolchain-specific):
      - For MSVC warning codes (e.g., `C4456`): if
        `#pragma warning(suppress:NNNN)` exists before a violation,
        REMOVE the pragma and apply the proper fix.
      - For Clang/GCC flags (e.g., `-Wenum-conversion`): look for
        `#pragma clang diagnostic ignored` or `#pragma GCC diagnostic
        ignored` that suppress this warning at the violation site.
        Where safe and unambiguous, REMOVE the suppression and apply
        the proper fix instead.
      - Do NOT introduce new warning-suppression pragmas as part of
        the remediation. Suppressions are not fixes.
   e. Apply fixes following the minimal-edit-discipline protocol
   f. Build and verify:
      - Run {{build_command}} for the affected directory
      - If ANY build error: revert ALL changes to this file and log the
        failure
      - Treat ALL build errors as fatal — no pre-existing errors to ignore
   g. Update progress log with file name and fix results

4. **Post-processing verification**:
   - Check compiler output for any remaining instances of {{warning_id}}
   - If instances remain, investigate and fix, then rebuild and re-verify

5. **Pattern discovery**:
   - For any warning instance that doesn't match known fix patterns,
     document:
     - File, line, code snippet
     - Why existing patterns don't apply
     - Proposed fix pattern (description, before/after, rationale)
   - Add discovered patterns to the fix instructions for future runs

6. **Populate the structured findings report** (using the `structured-findings`
   format sections: Analysis Context / Findings / Findings Summary / References):
   - **Analysis Context**: compiler/tool, version, build configuration,
     warning ID {{warning_id}}, and {{source_directories}} in scope.
   - **Findings**: for each instance, record file/line/snippet, the fix
     pattern applied (or "already correct", "skipped/deferred", "reverted
     due to build failure"). Group by pattern where helpful.
   - **Findings Summary**: aggregate statistics — total instances, counts
     per status (fixed / correct / deferred / reverted), pattern breakdown,
     and any newly discovered patterns.
   - **References**: diagnostics source (SARIF file or compiler log),
     fix instructions consulted, and relevant documentation.

## Non-Goals

- Do NOT fix warnings other than {{warning_id}} in this run
- Do NOT refactor or modernize code beyond the specific fix
- Do NOT commit code that does not build
- Do NOT suppress warnings with pragmas — apply proper fixes

## Quality Checklist

- [ ] All instances of {{warning_id}} in target directories processed
- [ ] Every fix follows minimal-edit-discipline
- [ ] All modified code builds successfully
- [ ] Pragma suppressions removed and replaced with proper fixes
- [ ] Progress log is complete and accurate
- [ ] New patterns documented for future runs
