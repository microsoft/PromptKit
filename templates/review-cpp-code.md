<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: review-cpp-code
description: >
  C/C++ specialized code review combining general review with
  language-specific analysis protocols. Applies research-validated
  C++ best practices and optionally Win32 API conventions or
  performance-critical C API patterns.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - analysis/cpp-best-practices
  - analysis/memory-safety-c
format: investigation-report
params:
  code: "The C/C++ code to review"
  review_focus: "What to focus on — e.g., correctness, memory safety, API design, performance, all"
  context: "What this code does, where it fits in the system, any known concerns"
  additional_protocols: "(Optional) Additional protocols to apply — e.g., win32-api-conventions, performance-critical-c-api, thread-safety"
  audience: "Who will read the review output — e.g., 'the code author', 'the team', 'a security review board'"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A C/C++ code review report with findings categorized by severity,
    specific line references, pattern IDs from applied protocols, and
    actionable remediation.
---

# Task: C/C++ Code Review

You are tasked with performing a **C/C++ specialized code review** of the
following code. This review applies both general review criteria and
language-specific analysis protocols validated by research.

## Inputs

**Code**:
```cpp
{{code}}
```

**Review Focus**: {{review_focus}}

**Context**: {{context}}

**Additional Protocols to Apply**: {{additional_protocols}}

**Audience**: {{audience}}

## Instructions

1. **Apply the anti-hallucination protocol.** Base your review ONLY on the
   code provided. Do not assume behaviors that are not visible in the code.
   Do not invent APIs, calling conventions, or platform behaviors.

2. **Apply the cpp-best-practices protocol systematically.** Check ALL seven
   patterns in order — do not skip any pattern even if it seems inapplicable:

   - **CPP-1: Memory Safety** — RAII, smart pointers, exception safety
     guarantees, resource leak paths, rule of five/zero compliance.
   - **CPP-2: Concurrency** — Data races, deadlocks, atomicity violations,
     RAII locking, check-then-act on shared state.
   - **CPP-3: API Design** — Type safety, error types (`std::expected`,
     `std::optional`), ownership semantics in signatures, parameter clarity.
   - **CPP-4: Performance** — Algorithmic complexity, cache locality,
     unnecessary allocations or copies, container choice, `reserve()` usage.
   - **CPP-5: Error Handling** — Exception safety guarantees, input
     validation, catch blocks that swallow errors, error propagation context.
   - **CPP-6: Code Clarity** — Naming intent, named constants, single
     responsibility, "why" comments for non-obvious decisions.
   - **CPP-7: Testing** — Coverage of normal/boundary/error cases, test
     independence, regression tests for fixes, descriptive test names.

   For each pattern, explicitly state whether findings exist or confirm that
   the pattern was checked and no issues were found.

3. **Apply the memory-safety-c protocol** for C-specific concerns. Execute
   all four phases even when reviewing C++ code that contains C idioms:

   - Phase 1: Allocation / deallocation pairing
   - Phase 2: Pointer lifecycle analysis
   - Phase 3: Buffer boundary analysis
   - Phase 4: Undefined behavior audit

4. **If additional protocols are specified**, apply them after the core
   protocols. If none are specified but the code suggests they are relevant,
   recommend them:

   - `win32-api-conventions` — for code using Win32 API, COM, or Windows
     system calls (HANDLE management, HRESULT checking, wide-string safety).
   - `performance-critical-c-api` — for system libraries, game engines,
     drivers, or hot-path code where allocation and branching cost matters.
   - `thread-safety` — for code with explicit concurrency, shared state,
     or callback-based designs that may execute on multiple threads.

5. **Format each finding as**:

   ```
   [SEVERITY: Critical|High|Medium|Low|Nit]
   Pattern: <pattern ID — e.g., CPP-1, CPP-3, WG-005, MSC-Phase2>
   Location: <file>:<line> or <function>
   Issue: <concise description>
   Evidence: <code snippet or reasoning>
   Suggestion: <specific fix or improvement>
   ```

6. **Summarize** at the end:
   - Total findings by severity
   - Findings broken down by pattern (e.g., "CPP-1: 3 findings,
     CPP-5: 1 finding, MSC-Phase3: 2 findings")
   - Overall assessment (approve / approve with changes / request changes)
   - Top 3 most important things to fix

## Non-Goals

- Do NOT refactor the code — identify issues only.
- Do NOT review code outside the provided scope unless it is
  directly called by or calls into the reviewed code.
- Do NOT comment on personal style preferences — focus on
  correctness, safety, security, and maintainability.

## Quality Checklist

Before finalizing, verify:

- [ ] Every finding cites a specific code location
- [ ] Every finding references the relevant pattern ID (CPP-*, MSC-Phase*)
- [ ] All 7 CPP patterns were checked (even if no issues found)
- [ ] Memory safety protocol was applied (all 4 phases)
- [ ] Findings are ordered by severity (Critical first)
- [ ] At least 3 findings have been re-verified against the source code
- [ ] Severity ratings are consistent across findings
- [ ] Overall assessment and top-3 summary are stated
