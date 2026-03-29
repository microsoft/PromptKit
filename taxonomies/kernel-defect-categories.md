<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: kernel-defect-categories
type: taxonomy
domain: kernel-correctness
description: >
  Classification scheme (K1–K14) for operating system kernel and driver
  defects. Covers lock leaks, refcount imbalances, cleanup omissions,
  lifetime bugs, integer arithmetic errors, state machine races,
  accounting mismatches, and security boundary mistakes.
applicable_to:
  - exhaustive-bug-hunt
---

# Taxonomy: Kernel Defect Categories

This taxonomy classifies defect types specific to operating system kernels,
drivers, and similarly privileged system software. Each category has a
unique identifier (K1–K14) for use in findings and traceability.

## Categories

### K1: Lock Leak

A lock is acquired but not released on one or more code paths. Consequence:
deadlock, hang, or IRQL-related bugcheck when a subsequent acquisition
blocks indefinitely or when IRQL remains elevated past the point where
lower-IRQL operations are expected.

**Signals**: function has multiple return/goto paths; lock acquired early,
released only at end; conditional paths skip release.

### K2: Refcount Leak or Double Dereference

A reference count is incremented but not decremented on all paths (leak),
or is decremented more than once (double dereference leading to
use-after-free or pool corruption).

**Signals**: ObReferenceObject / ObDereferenceObject pairing; refcount
increment in one branch, missing decrement in error branch; reference
"donated" to callee but caller also dereferences.

### K3: Cleanup Omission on Error / Goto / Early Return

A resource (allocation, handle, mapping, MDL, etc.) acquired before an
error check is not released when the error path is taken. Applies to
goto-based cleanup, early returns, and exception paths.

**Signals**: resource acquired, then a conditional check that gotos a
label which does not free that resource; new error check added between
acquisition and existing cleanup block.

### K4: Use-After-Free from Object Lifetime Mismatch

Code accesses an object after its backing memory may have been freed —
typically because a reference was released or the object was removed from
a list, but a local pointer still refers to it.

**Signals**: dereference after ObDereferenceObject; access to list entry
after removal without holding a stabilizing reference; pointer cached
across a call that may free the target.

### K5: Stale Pointer Use After Unlock

A pointer to a protected data structure is obtained under lock, the lock
is released, and the pointer is subsequently dereferenced. The data
structure may have been modified or freed between unlock and use.

**Signals**: pointer to pool allocation, list entry, or hash-table entry
read under lock; lock released; pointer used after release without
re-validation or a stabilizing reference.

### K6: Integer Overflow or Truncation in Size / Offset Math

An arithmetic operation on a page count, byte count, allocation size,
array index, or memory offset can overflow or be truncated, leading to
a too-small allocation, out-of-bounds access, or incorrect offset.

**Signals**: multiplication of user-supplied values without overflow
check; ULONG used for byte count that can exceed 4 GB on 64-bit;
SIZE_T narrowed to ULONG before pool allocation; unchecked addition
in offset calculation.

### K7: Incorrect PreviousMode or Probe / Capture Assumptions

A system call handler or kernel routine that processes user-mode requests
fails to check PreviousMode, omits buffer probing, or validates user data
without first capturing it to kernel memory (double-fetch vulnerability).

**Signals**: direct access to user-mode pointer without ProbeForRead /
ProbeForWrite; validation of user buffer followed by second read from
user memory; missing PreviousMode check before skipping probe.

### K8: PFN / PTE State Transition Race

A PFN database entry or page table entry is read, modified, or
transitioned between states without proper synchronization, or a stale
PTE value is acted upon after the lock was released.

**Signals**: PTE read without PFN lock or working-set lock; PFN state
modified without holding the PFN lock; PTE value cached, lock released,
then cached value used for subsequent decisions.

### K9: ABA or Lost-Update in Interlocked Sequences

An interlocked compare-and-swap (CAS) sequence is vulnerable to the ABA
problem (value cycles A→B→A, CAS succeeds despite invalidated assumptions)
or to lost updates (concurrent read-modify-write operations where one
overwrites the other's changes).

**Signals**: CAS loop that only compares the old value without versioning
or tagging; non-interlocked read-modify-write on shared state; two threads
updating the same field with separate CAS operations whose ranges overlap.

### K10: Inconsistent Flag Tracking Across Success / Failure Paths

A flag or status variable is set on the success path but not cleared (or
vice versa) on the failure path, leaving the system in an inconsistent
state. Alternatively, a flag is checked on one path but not on a parallel
path that shares the same postcondition.

**Signals**: boolean flag set to TRUE before an operation, not reset on
failure; status field updated in one branch of a conditional but not the
other; flag checked in most callers but skipped in one.

### K11: Missing Rollback After Partial State Mutation

A function performs a sequence of state mutations (e.g., insert into
list A, update table B, modify object C). If an intermediate step fails,
earlier mutations are not rolled back, leaving the system in a partially
mutated and inconsistent state.

**Signals**: multi-step mutation sequence with error checks between steps;
early steps modify shared state, later steps can fail; goto target only
undoes the last step, not earlier ones.

### K12: Mismatched Charge / Uncharge Accounting

A resource quota charge (memory, handle count, process quota) is not
paired with an equal uncharge, or the uncharge amount does not match the
charge amount. Leads to quota leaks (eventual resource exhaustion) or
quota underflow (accounting corruption).

**Signals**: PsChargeProcessPoolQuota / PsReturnProcessPoolQuota pairing;
charge in one function, uncharge in a different function with different
size; failure path skips uncharge; charge size computed differently from
uncharge size.

### K13: Retail Assertion Gap

An invariant is enforced only by a debug-only assertion (NT_ASSERT,
ASSERT, DCHECK) and is not checked in retail/release builds. If the
invariant can be violated by external input or by a caller that does not
guarantee it, the retail build has an unguarded code path.

**Signals**: NT_ASSERT checking a precondition that is not guaranteed by
all callers; assertion on user-supplied value that is validated only by
the assert; assertion guarding a code path that leads to memory corruption
or privilege escalation if the condition is false.

### K14: Security Boundary Mistake

A security-relevant check (privilege verification, access check, token
validation, namespace isolation) is missing, bypassable, or applied
incorrectly. Distinct from K7 (which covers probe/capture mechanics) —
K14 covers higher-level authorization and isolation failures.

**Signals**: missing SeAccessCheck or equivalent before granting access;
handle opened with excessive permissions; cross-session or cross-container
object accessible without isolation check; impersonation level not verified.
