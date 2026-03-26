<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

# PromptKit Examples — From One-Liner to Engineered Prompt

These examples show what happens when you describe a task to PromptKit.
Each one contrasts a typical ad-hoc prompt with what PromptKit actually
assembles — so you can see why composable prompt engineering matters.

---

## Example 1: "Review this C++ code"

### What most people type

> "Review this C++ file for bugs."

### What PromptKit assembles

**Template:** `review-cpp-code` · **Persona:** `systems-engineer` ·
**Protocols:** `anti-hallucination` + `self-verification` +
`operational-constraints` + `cpp-best-practices` + `memory-safety-c`

The assembled prompt is ~2,500 words. It tells the LLM:

1. **Who you are** — a staff-level systems engineer with deep expertise
   in memory management, concurrency, and performance. You think in
   terms of boundaries and contracts, not just implementations.

2. **How to reason** — 7 research-validated patterns to check
   systematically:

   | Pattern | What it catches | Research basis |
   |---------|----------------|----------------|
   | CPP-1: Memory Safety | RAII violations, raw new/delete, exception-unsafe code | MSRC: 70% of security vulns are memory safety |
   | CPP-2: Concurrency | Data races, deadlocks, atomicity violations | Lu et al.: 31% atomicity, 30% ordering |
   | CPP-3: API Design | Type confusion, ownership ambiguity | Bloch: well-designed APIs reduce bugs 40-60% |
   | CPP-4: Performance | O(n²) algorithms, cache-hostile access, needless allocs | Hennessy & Patterson |
   | CPP-5: Error Handling | Unchecked returns, exception-unsafe paths | Weimer & Necula |
   | CPP-6: Code Clarity | Magic numbers, misleading names, SRP violations | Kemerer & Slaughter |
   | CPP-7: Testing | Happy-path-only tests, missing edge cases | Kuhn et al. |

   Plus a 4-phase memory safety analysis (allocation pairing, pointer
   lifecycle, buffer boundaries, undefined behavior).

3. **What NOT to do** — fabricate code paths, invent function behaviors,
   comment on style preferences, or refactor code.

4. **How to verify your own work** — sample 3–5 findings and re-verify
   against the source before finalizing. Zero uncited claims.

5. **How to format findings** — severity-classified, with pattern IDs,
   code locations, evidence, and specific fix suggestions.

**The difference:** Your "review this code" prompt produces a meandering
list of observations. PromptKit's prompt produces a structured
investigation report where every finding is tied to a named, research-
backed pattern, and the LLM has verified its own work before presenting it.

---

## Example 2: "Fix all the C4456 warnings"

### What most people type

> "Fix the C4456 compiler warnings in this directory."

### What PromptKit assembles

**Template:** `fix-compiler-warnings` · **Persona:** `systems-engineer` ·
**Protocols:** `anti-hallucination` + `self-verification` +
`operational-constraints` + `minimal-edit-discipline` +
`compiler-diagnostics-cpp` · **Format:** `structured-findings`

The assembled prompt is ~3,000 words. It gives the LLM:

1. **Specific resolution rules for C4456** — "Local variable hides
   another local: rename the OUTER variable, append `Outer`. Do NOT
   rename all variables with the same name — only the shadowing scope."

   ```cpp
   // Before:
   int status = 0;
   if (true) {
       int status = 1;        // C4456: shadows outer
       std::cout << status;
   }
   std::cout << status;

   // After:
   int statusOuter = 0;
   if (true) {
       int status = 1;
       std::cout << status;
   }
   std::cout << statusOuter;
   ```

2. **Minimal edit discipline** — fix exactly the warning, nothing else.
   Preserve original types, maintain formatting, don't modernize
   surrounding code. If the file has non-UTF-8 bytes, use byte-level
   manipulation to avoid encoding corruption.

3. **Build-verify loop** — after each fix, build. If ANY error, revert
   and log. No partial fixes allowed.

4. **Pragma suppression removal** — if someone "fixed" a warning with
   `#pragma warning(suppress:4456)`, remove the pragma and apply the
   real fix. Supports both MSVC and Clang/GCC pragma styles.

5. **Self-improving pattern discovery** — when a warning instance
   doesn't match known patterns, document it as a new pattern with
   before/after examples for future runs.

6. **Structured output** — results reported using the `structured-findings`
   format with consolidation, severity classification, and statistics.

**The difference:** Your one-liner produces scattered fixes, some of
which break the build, some of which rename the wrong variable, and
none of which are tracked. PromptKit's prompt produces a systematic,
build-verified remediation with a structured report and zero regressions.

---

## Example 3: "Is this code portable to Clang?"

### What most people type

> "Will this code compile with Clang?"

### What PromptKit assembles

**Template:** `review-cpp-code` · **Persona:** `systems-engineer` ·
**Protocols:** `anti-hallucination` + `self-verification` +
`operational-constraints` + `cpp-best-practices` + `memory-safety-c` +
`msvc-clang-portability` ·
**Format:** `investigation-report`

The portability protocol alone adds 21 specific patterns the LLM must
check, organized by category:

| Category | Patterns | What MSVC silently accepts |
|----------|----------|--------------------------|
| Template rules | 6 patterns | Missing `typename`, default arg redeclaration, pack expansion in aliases |
| Const correctness | 2 patterns | String literal → `void*` implicit const drop |
| Exception specs | 2 patterns | `throw(...)` extension, throw without /EHsc |
| Type system | 3 patterns | Implicit int, enum tag mismatches, sign conversion |
| Constexpr | 2 patterns | Enum complement out of range, incomplete class members |
| Declarations | 3 patterns | Thread-local mismatch, attribute positions, nested struct init |
| Language extensions | 3 patterns | `for each`, pointer-to-member without parens, C function sig mismatch |

Each pattern has before/after code showing the portable fix.

**The difference:** Your question gets a vague "probably, but check
these things." PromptKit's prompt produces a systematic audit against
21 known MSVC-isms, each with a concrete fix, so you know exactly what
to change before you even try the Clang build.

---

## Example 4: "What tests should I run?"

### What most people type

> "What tests are relevant to my changes?"

### What PromptKit assembles

**Template:** `discover-tests-for-changes` · **Persona:** `test-engineer` ·
**Protocols:** `anti-hallucination` + `self-verification` +
`operational-constraints`

The assembled prompt instructs the LLM to:

1. **Analyze git changes** — `git status` + `git diff` to identify every
   modified file, the affected components, and whether the changes are
   high-impact (shared libraries, core APIs, configuration).

2. **Search systematically** — look for test files near changed code in
   priority order: same directory, `test/` subdirectories, sibling
   `*_test.*` files, project-wide test directories matching the
   component name.

3. **Map coverage** — connect changed functions to specific test files
   that exercise them. Flag gaps where changed code has NO tests.

4. **Recommend execution** — provide two concrete command sets: a quick
   validation (minimum tests), and a comprehensive run (full coverage).
   Every command is copy-pasteable.

**The difference:** Your question gets "run the test suite." PromptKit's
prompt produces a prioritized test map showing exactly which tests cover
your changes, which gaps exist, and the exact commands to run — quick
validation first, comprehensive second.

---

## Example 5: "Hunt for bugs in this kernel driver"

### What most people type

> "Find bugs in this driver code."

### What PromptKit assembles

**Template:** `exhaustive-bug-hunt` · **Persona:** `systems-engineer` ·
**Protocols:** `anti-hallucination` + `self-verification` +
`adversarial-falsification` + `exhaustive-path-tracing` ·
**Taxonomy:** `kernel-defect-categories` (K1–K14)

This is PromptKit's most rigorous review mode. The assembled prompt
(~4,000 words) enforces:

1. **Adversarial falsification** — the LLM must try to DISPROVE every
   finding before reporting it. "Why this is NOT a false positive" is
   required for every finding, with specific code references explaining
   why existing cleanup, retry logic, or caller guarantees don't
   neutralize the issue.

2. **Exhaustive path tracing** — every file gets a coverage ledger
   proving it was fully analyzed. High-risk functions (lock acquire,
   resource allocate, goto-cleanup, arithmetic on untrusted input) are
   identified and traced through every control flow path.

3. **14 kernel-specific defect categories** — lock leaks (K1), refcount
   imbalances (K2), cleanup omissions (K3), use-after-free (K4),
   integer overflow (K5), state machine races (K6), double-free (K7),
   and more — each with specific patterns and risk descriptions.

4. **False-positive rejection log** — candidates that were investigated
   and rejected are documented with the mechanism that makes them safe.
   This proves the LLM didn't skip suspicious code.

**The difference:** Your "find bugs" prompt produces a list of
surface-level observations, many false positives, and no proof of
coverage. PromptKit's prompt produces a forensic report where every
finding survived adversarial challenge, every file has a coverage
proof, and false positives are explicitly documented with their
rejection reasoning.

---

## The Pattern

Every PromptKit example follows the same structure:

```
You say:  "Do X"                           (10 words)
PromptKit builds:                          (2,000–4,000 words)
  ┌─ Persona       → who the LLM is
  ├─ Protocols      → how it must reason
  ├─ Taxonomies     → how it classifies findings
  ├─ Format         → how it structures output
  ├─ Template       → what specifically to do
  ├─ Anti-hallucination → what it must NOT fabricate
  └─ Self-verification  → how it checks its own work
```

The assembled prompt encodes the expertise of a senior engineer who
has done this task hundreds of times — the patterns they check, the
mistakes they avoid, the structure they report in. You get that
expertise every time, consistently, without the senior engineer being
in the room.

---

## Try It

```bash
# Interactive — describe your task, get an assembled prompt
npx @alan-jowett/promptkit

# Direct assembly
npx @alan-jowett/promptkit assemble review-cpp-code \
  -p code="$(cat myfile.cpp)" \
  -p review_focus="memory safety and portability" \
  -p context="Network buffer parser" \
  -p additional_protocols="msvc-clang-portability, thread-safety" \
  -p audience="the code author" \
  -o review-prompt.md
```
