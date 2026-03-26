<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: cpp-review-patterns
type: taxonomy
description: >
  Classification scheme for C++ code review findings. Categorizes
  findings by pattern family (memory safety, concurrency, API design,
  performance, error handling, code clarity) with severity guidance
  and cross-references to analysis protocols.
domain: cpp-code-review
applicable_to:
  - review-code
  - review-cpp-code
---

# Taxonomy: C++ Review Patterns

Use these labels to classify findings when reviewing C++ code. Every
finding MUST use exactly one label from this taxonomy. Labels are
grouped into six families; choose the family that best describes the
root cause, then the specific sub-label within it.

## Labels — MS (Memory Safety)

### MS_RESOURCE_LEAK

Resource acquired but not released on all paths (memory, handles, locks).

**Pattern**: A raw `new`, `malloc`, or handle-acquisition call stored in
a non-RAII variable, with at least one exit path missing a release.

**Risk**: Resource exhaustion or unpredictable failure under load.

**Cross-reference**: See MS-1 in `memory-safety-c`.

### MS_USE_AFTER_FREE

Access to memory after deallocation or scope exit, including
use-after-move on standard containers.

**Pattern**: A pointer or reference dereferenced after `delete`, `free`,
scope exit of the owning `unique_ptr`, or `std::move` of the source.

**Risk**: Undefined behavior — silent corruption, crashes, or
exploitable vulnerabilities.

**Cross-reference**: See MS-2 in `memory-safety-c`.

### MS_BUFFER_OVERFLOW

Array or buffer access beyond allocated bounds, including off-by-one
errors and unchecked indices.

**Pattern**: Index or pointer arithmetic exceeding allocation size —
`buf[len]` instead of `buf[len - 1]`, `memcpy` with oversized length,
or missing bounds check before indexing.

**Risk**: Stack/heap corruption, control-flow hijacking, data leakage.

**Cross-reference**: See MS-3 in `memory-safety-c`.

### MS_UNINITIALIZED

Use of a variable before initialization, including partially
initialized structs and uninitialized optional fields.

**Pattern**: A local of scalar, pointer, or aggregate type declared
without an initializer and read before assignment on at least one path.

**Risk**: Non-deterministic behavior differing across builds,
optimization levels, or platforms.

**Cross-reference**: See MS-4 in `memory-safety-c`.

## Labels — CC (Concurrency)

### CC_DATA_RACE

Unprotected shared mutable state accessed from multiple threads where
at least one access is a write.

**Pattern**: A variable read and written from different threads without
a mutex, atomic, or synchronization primitive guarding both accesses.

**Risk**: Undefined behavior — torn reads, lost updates, corrupted
invariants.

**Cross-reference**: See CC-1 in `cpp-best-practices`.

### CC_DEADLOCK

Lock acquisition order inconsistency or potential circular wait.

**Pattern**: Two or more mutexes acquired in different orders across
call sites, a non-recursive mutex locked twice on one thread, or a
lock-then-callback where the callback may re-enter the lock.

**Risk**: Program hangs permanently, requiring process termination.

**Cross-reference**: See CC-2 in `cpp-best-practices`.

### CC_ATOMICITY

Operation assumed atomic but actually multi-step, allowing interleaving.

**Pattern**: A check-then-act sequence (e.g., `if (map.count(k))
map[k]++`) or compound update on a non-atomic variable without a lock.

**Risk**: TOCTOU bugs, lost updates, inconsistent state.

**Cross-reference**: See CC-3 in `cpp-best-practices`.

## Labels — AD (API Design)

### AD_TYPE_CONFUSION

Wrong type passed where another is expected — enum mismatch, implicit
narrowing, or incorrect `void*` casts.

**Pattern**: An argument implicitly converted at a call site, e.g.,
`int` where `enum class` is expected via C-style cast, or `size_t`
truncated to `int`.

**Risk**: Silent logic errors, out-of-range values, or undefined
behavior from type-punning.

**Cross-reference**: See AD-1 in `cpp-best-practices`.

### AD_OWNERSHIP_AMBIGUITY

Unclear who owns or frees a resource passed across an API boundary.

**Pattern**: A function returns or accepts a raw pointer with no
documentation, naming convention, or smart-pointer wrapper indicating
cleanup responsibility.

**Risk**: Double-free if both sides release, or leak if neither does.

**Cross-reference**: See AD-2 in `cpp-best-practices`.

### AD_CONTRACT_VIOLATION

Caller violates documented preconditions or postconditions of an API.

**Pattern**: A function called with arguments outside its valid domain
(null where non-null required, negative size) or caller ignores a
postcondition (assumes sorted output from an unordered call).

**Risk**: Undefined behavior, assertion failures, or downstream data
corruption.

**Cross-reference**: See AD-3 in `cpp-best-practices`.

## Labels — PF (Performance)

### PF_ALGORITHMIC

Suboptimal algorithm complexity where a better alternative exists and
hot-path evidence justifies the change.

**Pattern**: O(n²) or worse (nested linear searches, repeated
`std::find` in a loop) where O(n log n) or O(1) is straightforward.

**Risk**: Latency spikes or throughput degradation as input grows.

**Cross-reference**: See PF-1 in `cpp-best-practices`.

### PF_ALLOCATION

Unnecessary dynamic allocation in a hot path.

**Pattern**: `new`, `malloc`, `make_shared`, or container resize
inside a tight loop or high-frequency callback where a pre-allocated
buffer or `reserve` would suffice.

**Risk**: Allocator contention, cache thrashing, increased tail
latency.

**Cross-reference**: See PF-2 in `cpp-best-practices`.

### PF_COPY

Unnecessary copy of a non-trivial object where move or reference
would preserve semantics.

**Pattern**: Large object passed by value to a non-owning function,
returned by copy when move/RVO applies, or assigned where `std::move`
is appropriate.

**Risk**: Redundant allocations and memcpy overhead, especially in
loops.

**Cross-reference**: See PF-3 in `cpp-best-practices`.

## Labels — EH (Error Handling)

### EH_UNCHECKED_RETURN

Return value of a fallible function silently discarded.

**Pattern**: A `[[nodiscard]]` function, or one returning an error
code / `std::optional` / `std::expected`, called without inspecting
the result.

**Risk**: Execution continues with invalid state, causing cascading
failures.

**Cross-reference**: See EH-1 in `cpp-best-practices`.

### EH_EXCEPTION_UNSAFE

Resource acquired before a potentially throwing operation without RAII
protection, violating basic exception safety.

**Pattern**: A raw `new` or resource acquisition followed by throwing
operations (container insertion, I/O) before the pointer is wrapped in
a smart pointer or guard.

**Risk**: Resource leak on any exception between acquisition and
cleanup.

**Cross-reference**: See EH-2 in `cpp-best-practices`.

### EH_SILENT_FAILURE

Error caught or detected but swallowed without logging, propagation,
or corrective action.

**Pattern**: An empty `catch (...)` block, a discarded error code, or
an `if (error)` branch that does nothing.

**Risk**: Failures go undetected, making debugging difficult and
masking root causes.

**Cross-reference**: See EH-3 in `cpp-best-practices`.

## Labels — CL (Code Clarity)

### CL_NAMING

Misleading or non-descriptive identifier names that hinder
comprehension.

**Pattern**: Single-letter variables outside tiny loop indices, names
contradicting the value's purpose, or inconsistent naming within a
module.

**Risk**: Increased review time and higher defect rate from
misunderstanding.

**Cross-reference**: See CL-1 in `cpp-best-practices`.

### CL_MAGIC_VALUE

Hard-coded numeric or string literal without a named constant or
explanation.

**Pattern**: A literal such as `1024`, `0xFF`, or `"default"` appears
in logic without a `constexpr`, `enum`, `#define`, or inline comment.

**Risk**: Difficult to update consistently and easy to misinterpret
across usage sites.

**Cross-reference**: See CL-2 in `cpp-best-practices`.

### CL_COMPLEXITY

Function or control-flow structure too complex to understand at a
glance.

**Pattern**: Deeply nested conditionals (≥ 4 levels), functions
exceeding ~60 lines, boolean expressions with more than three clauses,
or opaque template metaprogramming.

**Risk**: High defect density, difficult to test, and resistant to
safe refactoring.

**Cross-reference**: See CL-3 in `cpp-best-practices`.

## Ranking Criteria

Order findings by severity and blast radius:

1. **Critical**: MS and CC labels — undefined behavior, exploitable
   vulnerabilities, or data corruption.
2. **High**: EH and AD labels — hidden failures, contract violations,
   or ownership confusion that cause production incidents.
3. **Medium**: PF labels — performance regressions noticeable under
   realistic workloads.
4. **Low**: CL labels — maintainability and readability concerns.

## Usage

In findings, reference labels as:

```
[FINDING: MS_USE_AFTER_FREE]
Location: <file>:<line>
Evidence: <code excerpt showing the violation>
Reasoning: <why this matches the label definition>
Severity: Critical | High | Medium | Low
```
