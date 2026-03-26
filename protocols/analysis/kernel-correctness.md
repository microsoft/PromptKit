<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: kernel-correctness
type: analysis
description: >
  Correctness analysis protocol for OS kernel and driver code. Covers
  lock/refcount symmetry, cleanup path completeness, PFN/PTE state
  transitions, interlocked sequences, and charge/uncharge accounting.
  Includes known-safe kernel patterns to suppress false positives.
language: C
applicable_to:
  - review-code
  - investigate-bug
  - exhaustive-bug-hunt
---

# Protocol: Kernel Correctness Analysis

Apply this protocol when analyzing operating system kernel code, drivers,
or similarly privileged system software. This protocol extends
memory-safety-c and thread-safety with kernel-specific correctness checks
and false-positive suppression rules.

## Phase 1: Lock Symmetry Analysis

For every lock acquisition site:

1. Identify the lock type (spinlock, pushlock, ERESOURCE, mutex, fast mutex,
   queued spinlock, etc.) and its acquisition semantics (exclusive, shared,
   raise IRQL, disable APCs).
2. Trace **all** code paths from acquisition to function exit.
3. Verify the lock is released on **every** path — including error returns,
   goto targets, and exception handlers.
4. Check for **lock ordering**: if multiple locks are acquired, verify
   consistent ordering across all call sites to prevent deadlock.
5. Check for **IRQL correctness**: verify that locks requiring specific IRQL
   are acquired at the correct level and that IRQL is restored on release.
6. Check for **operations at elevated IRQL** that must not block, page-fault,
   or call pageable code.

## Phase 2: Reference Count Symmetry

For every reference count operation (ObReferenceObject, ObDereferenceObject,
InterlockedIncrement/Decrement on refcounts, IoAcquireRemoveLock, etc.):

1. Pair every increment with its corresponding decrement.
2. Trace all paths from increment to function exit — verify decrement on
   every path.
3. Check for **double dereference**: paths where decrement happens twice
   (e.g., decrement in cleanup block + explicit decrement before goto).
4. Check for **use-after-dereference**: code that accesses an object after
   its reference count has been decremented (the object may be freed).
5. Verify reference transfers: when a reference is "donated" to a callee or
   stored in a data structure, confirm the caller does NOT also dereference.

## Phase 3: Cleanup Path Completeness

1. For every `goto` cleanup label, enumerate all jump sites and the set
   of resources held at each jump.
2. Verify the cleanup block correctly handles **each combination** — common
   patterns include conditional cleanup (check if resource was acquired
   before releasing) or ordered labels (goto CleanupPhase2 releases phases
   2 and 1).
3. Check for **missing cleanup on early returns** that bypass the goto chain.
4. Verify that cleanup ordering is **reverse acquisition order** to prevent
   use-after-free of inner resources.

## Phase 4: PreviousMode and Probe/Capture

For every system call handler or routine that processes user-mode requests:

1. Verify that `PreviousMode` is checked before trusting user-supplied
   pointers or parameters.
2. Verify that user-mode buffers are **probed** (`ProbeForRead`,
   `ProbeForWrite`) before access.
3. Verify that user-mode data is **captured** (copied to kernel memory)
   before validation — double-fetch vulnerabilities occur when user data
   is validated and then re-read from user memory.
4. Check for paths where `KernelMode` callers bypass probing correctly
   (this is intentional) vs. paths where `UserMode` callers skip probing
   (this is a bug).

## Phase 5: PFN / PTE State Transitions

For code that manipulates Page Frame Number (PFN) database entries or
Page Table Entries (PTEs):

1. Verify that PFN lock (or working set lock, or relevant PTE lock) is
   held when reading or modifying PFN/PTE state.
2. Check for **stale PTE reads**: reading a PTE, releasing the lock, then
   acting on the stale value without re-validation.
3. Verify state transition correctness: PFN state machine transitions must
   follow valid arcs (e.g., Active → Modified → Standby → Free).
4. Check for **torn reads** on architectures where PTE updates are not
   atomic — verify appropriate interlocked operations are used.

## Phase 6: Interlocked Sequence Correctness

For every interlocked operation (InterlockedCompareExchange,
InterlockedOr, cmpxchg, atomic CAS loops):

1. Verify the **retry logic**: if CAS fails, does the code retry with the
   updated value, or does it silently proceed with stale state?
2. Check for **ABA problems**: a value changes from A → B → A, and the CAS
   succeeds despite intervening state changes that invalidated the
   operation's assumptions.
3. Verify **memory ordering**: are acquire/release semantics correct for
   the data being protected?
4. Check for **lost updates**: two threads performing read-modify-write
   where one thread's update overwrites the other's.

## Phase 7: Integer Arithmetic in Size/Offset Calculations

1. Identify every calculation involving page counts, byte counts, allocation
   sizes, array indices, or memory offsets.
2. Check for **integer overflow**: multiplication or addition that can
   exceed the type's range (especially `ULONG` vs `SIZE_T` mismatches
   on 64-bit systems).
3. Check for **truncation**: implicit narrowing conversions (e.g., `SIZE_T`
   assigned to `ULONG`) that silently discard high bits.
4. Verify that size calculations used for pool allocations cannot be
   manipulated to allocate a too-small buffer.

## Phase 8: Charge / Uncharge Accounting

For code that charges resource quotas (memory, handle count, etc.):

1. Pair every charge operation with its corresponding uncharge.
2. Verify that failure paths uncharge exactly what was charged — no
   over-uncharge (corrupts accounting) or under-uncharge (resource leak).
3. Check for charge-before-use vs. use-before-charge ordering.

## Known-Safe Patterns (False-Positive Suppression)

Do NOT report findings caused by these standard kernel patterns:

1. **Optimistic / speculative reads later validated under lock** —
   reading a field without a lock, then acquiring the lock and
   re-reading or validating before acting on it.
2. **ReadNoFence / ReadULongNoFence / ReadTorn fast paths** —
   intentionally racy reads used as performance fast-path hints,
   with a slow path that acquires proper synchronization.
3. **Lock-free PTE reads that are atomic on x64** — single-word PTE
   reads that are naturally atomic on the target architecture.
4. **Interlocked CAS fast paths where caller retries or slow path
   handles failure** — a CAS that may fail, but the caller either
   retries or falls through to a locked slow path.
5. **Cleanup performed in shared goto targets or helper routines** —
   resource release that is not visible inline but is performed by a
   cleanup label or helper function (verify by reading the helper).
6. **Lock release performed indirectly by called functions** — a
   function that releases a lock as a documented side effect.
7. **Invariants documented by NT_ASSERT where caller guarantees hold** —
   assertions that document preconditions guaranteed by all callers.
   However, if the invariant is NOT guaranteed by all callers, this IS
   a finding (retail assertion gap).

When a known-safe pattern suppresses a candidate finding, record it in
the false-positive-rejected section of the output.

## Output Format

For each finding, report:

```
[SEVERITY: Critical|High|Medium|Low]
Category: <kernel-defect-categories ID, e.g., K1: Lock leak>
Location: <file>:<line> or <function name>
Issue: <concise description>
Trigger path: <step-by-step control flow to trigger the bug>
Why this is NOT a false positive: <disproof of likely counterargument>
Consequence: <concrete bad outcome — BSOD, corruption, escalation, leak>
Remediation: <specific fix recommendation>
Confidence: Confirmed | High-confidence | Needs-domain-check
```
