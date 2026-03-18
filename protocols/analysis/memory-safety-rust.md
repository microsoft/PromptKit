<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) Standard Prompt Library Contributors -->

---
name: memory-safety-rust
type: analysis
description: >
  Protocol for analyzing memory safety concerns in Rust codebases.
  Focuses on unsafe blocks, FFI boundaries, interior mutability,
  and areas where the borrow checker cannot help.
language: Rust
applicable_to:
  - investigate-bug
  - review-code
  - investigate-security
---

# Protocol: Memory Safety Analysis (Rust)

Rust's ownership model prevents most memory safety bugs at compile time.
This protocol focuses on the areas where the compiler's guarantees are
weakened or absent.

## Phase 1: Unsafe Block Audit

For every `unsafe` block:

1. **Justify the invariant**: What safety invariant does this block rely on
   that the compiler cannot verify? Is the invariant documented?
2. **Minimize scope**: Does the `unsafe` block contain more code than
   strictly necessary? Can it be narrowed?
3. Check for violations of:
   - **Pointer validity**: raw pointer dereferences — is the pointer
     guaranteed non-null, aligned, and pointing to initialized memory?
   - **Aliasing rules**: does the unsafe code create mutable and immutable
     references to the same data simultaneously?
   - **Lifetime correctness**: does the unsafe code return references with
     lifetimes that exceed the actual data lifetime?
4. Review **unsafe trait implementations** (`Send`, `Sync`, custom unsafe traits)
   for correctness.

## Phase 2: FFI Boundary Analysis

For every `extern` function and FFI call:

1. Verify **type compatibility** between Rust types and C types.
   Check `#[repr(C)]` annotations.
2. Check **null pointer handling**: C functions may return NULL; Rust code
   must check before converting to references.
3. Verify **ownership transfer**: who owns the memory? Does the Rust side
   free C-allocated memory or vice versa? Are the allocators compatible?
4. Check for **panic across FFI boundaries** — panics unwinding through
   C frames is undefined behavior.
5. Verify **thread safety**: does the C library have thread-safety guarantees
   that match how Rust code calls it?

## Phase 3: Interior Mutability and Concurrency

1. Review uses of `RefCell`, `Cell`, `UnsafeCell`:
   - Can `RefCell::borrow_mut` panic at runtime due to conflicting borrows?
   - Are `UnsafeCell` usages correctly synchronized?
2. Review `Arc<Mutex<T>>` and `Arc<RwLock<T>>` patterns:
   - Can mutex poisoning cause silent data corruption?
   - Are lock orderings consistent (deadlock potential)?
3. Check for **data races in unsafe code** that bypasses Rust's
   `Send`/`Sync` guarantees.

## Phase 4: Resource Leaks and Logical Safety

Even memory-safe Rust can have logical resource issues:

1. **Forgotten futures**: `async` tasks spawned but never awaited or joined.
2. **Leaked resources**: `std::mem::forget` or `ManuallyDrop` preventing
   destructor execution.
3. **File descriptor / handle leaks**: resources not wrapped in RAII types.
4. **Unbounded growth**: `Vec`, `HashMap`, or channels growing without limit.

## Output Format

For each finding, report:

```
[SEVERITY: Critical|High|Medium|Low]
Location: <file>:<line> or <function/module name>
Issue: <concise description>
Safety invariant: <what guarantee is violated or at risk>
Evidence: <code path or snippet demonstrating the issue>
Remediation: <specific fix recommendation>
Confidence: <High|Medium|Low — with justification if not High>
```
