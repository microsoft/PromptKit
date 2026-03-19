<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: thread-safety
type: analysis
description: >
  Protocol for analyzing concurrency and thread safety issues.
  Covers data races, deadlocks, atomicity violations, and
  synchronization correctness. Language-agnostic.
applicable_to:
  - investigate-bug
  - review-code
  - investigate-security
---

# Protocol: Thread Safety Analysis

Apply this protocol when analyzing code for concurrency defects. This protocol
is language-agnostic — adapt the specific constructs to the target language.

## Phase 1: Shared State Inventory

1. Identify all **mutable state** accessible from multiple threads:
   - Global/static variables
   - Shared heap objects (passed via pointers, references, or handles)
   - File system, database, or network resources accessed concurrently
2. For each piece of shared state, determine:
   - **What synchronization protects it?** (mutex, rwlock, atomic, channel, etc.)
   - **Is the synchronization consistently applied?** (every access site, not just most)
   - **Is the granularity appropriate?** (too coarse → contention; too fine → races)

## Phase 2: Data Race Detection

For each shared mutable variable:

1. Identify all **read and write access sites** across all threads.
2. Verify that every pair of concurrent accesses where at least one is a write
   is protected by the **same** synchronization primitive.
3. Check for **accesses outside the critical section**: reads or writes that
   occur before acquiring or after releasing the lock.
4. Check for **atomic operation misuse**:
   - Incorrect memory ordering (`Relaxed` where `Acquire`/`Release` is needed)
   - Non-atomic read-modify-write sequences on shared state
   - Assuming atomicity of operations that are not (e.g., `i++` in C)

## Phase 3: Deadlock Analysis

1. Construct the **lock ordering graph**: for every code path that holds
   multiple locks, record the acquisition order.
2. Check for **cycles** in the lock ordering graph (cycle = potential deadlock).
3. Check for **lock inversion**: code paths that acquire locks in different orders.
4. Identify **blocking operations under lock**: I/O, network calls, or
   waiting on channels/conditions while holding a mutex.
5. Check for **self-deadlock**: recursive acquisition of non-recursive locks.

## Phase 4: Atomicity Violations

1. Identify **compound operations** that must be atomic but are not protected
   by a single critical section:
   - Check-then-act (TOCTOU) patterns
   - Read-modify-write sequences
   - Multi-field updates that must be consistent
2. Verify that **condition variables** are used correctly:
   - Always checked in a loop (spurious wakeups)
   - Signal/broadcast under the correct lock
   - Predicate matches the condition being waited on

## Phase 5: Thread Lifecycle

1. Check for **detached threads** that access resources owned by the parent
   thread or process.
2. Verify **join/cleanup** on shutdown paths — threads must be joined or
   otherwise synchronized before shared resources are destroyed.
3. Check for **thread pool exhaustion**: unbounded task submission without
   backpressure.

## Output Format

For each finding, report:

```
[SEVERITY: Critical|High|Medium|Low]
Location: <file>:<line> or <function name>
Issue: <concise description>
Threads involved: <which threads/tasks can trigger this>
Evidence: <interleaving or code path demonstrating the issue>
Remediation: <specific fix recommendation>
Confidence: <High|Medium|Low — with justification if not High>
```
