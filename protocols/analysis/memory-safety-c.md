<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) Standard Prompt Library Contributors -->

---
name: memory-safety-c
type: analysis
description: >
  Systematic protocol for analyzing memory safety issues in C codebases.
  Covers allocation/deallocation pairing, pointer lifecycle, buffer boundaries,
  and undefined behavior.
language: C
applicable_to:
  - investigate-bug
  - review-code
  - investigate-security
---

# Protocol: Memory Safety Analysis (C)

Apply this protocol when analyzing C code for memory safety defects. Execute
each phase in order. Do not skip phases — apparent simplicity often hides
subtle bugs.

## Phase 1: Allocation / Deallocation Pairing

For every allocation site (`malloc`, `calloc`, `realloc`, `strdup`, custom allocators):

1. Trace **all** code paths from allocation to deallocation.
2. Identify paths where deallocation is **missing** (leak) or **unreachable**
   (early return, exception-like longjmp, error branch).
3. Check for **double free**: paths where the same pointer is freed more than once.
4. Check for **mismatched APIs**: `malloc`/`free` vs `new`/`delete` vs custom
   allocator pairs.

## Phase 2: Pointer Lifecycle Analysis

For every pointer variable:

1. Determine its **ownership semantics**: who is responsible for freeing it?
   Is ownership transferred? Is it documented?
2. Check for **use-after-free**: any access to a pointer after its referent
   has been freed. Pay special attention to:
   - Pointers stored in structs or global state that outlive the allocation.
   - Pointers passed to callbacks or stored in event loops.
   - Conditional free followed by unconditional use.
3. Check for **dangling pointers**: pointers to stack variables that escape
   their scope (returned from function, stored in heap struct).
4. Verify **NULL checks** after allocation and after any operation that may
   invalidate a pointer (e.g., `realloc`).

## Phase 3: Buffer Boundary Analysis

For every buffer (stack arrays, heap allocations, string buffers):

1. Identify all **read and write accesses** to the buffer.
2. Verify that every access is **bounds-checked** or provably within bounds.
3. Check for **off-by-one errors** in loop conditions and index calculations.
4. Check `strncpy`, `snprintf`, `memcpy` calls for correct size arguments.
5. Identify any **user-controlled index or size** values that flow into
   buffer accesses without validation.

## Phase 4: Undefined Behavior Audit

Check for common sources of undefined behavior:

1. **Signed integer overflow** in size calculations.
2. **Null pointer dereference** on error paths.
3. **Uninitialized memory reads** — especially stack variables and struct
   fields after partial initialization.
4. **Type punning** violations (strict aliasing).
5. **Sequence point violations** in complex expressions.

## Output Format

For each finding, report:

```
[SEVERITY: Critical|High|Medium|Low]
Location: <file>:<line> or <function name>
Issue: <concise description>
Evidence: <code path or snippet demonstrating the issue>
Remediation: <specific fix recommendation>
Confidence: <High|Medium|Low — with justification if not High>
```
