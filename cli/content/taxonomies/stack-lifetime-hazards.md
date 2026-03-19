<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: stack-lifetime-hazards
type: taxonomy
description: >
  Classification scheme for stack lifetime and memory escape hazards
  at system boundaries (e.g., driver ↔ framework, kernel ↔ userspace).
  Use when investigating stack corruption, use-after-return, or
  pointer lifetime violations across API boundaries.
domain: memory-safety
applicable_to:
  - investigate-bug
  - investigate-security
  - review-code
---

# Taxonomy: Stack Lifetime Hazards

Use these labels to classify findings when analyzing code for stack
lifetime violations at API or component boundaries. Every finding
MUST use exactly one label from this taxonomy.

## Labels

### H1_STACK_ADDRESS_ESCAPE

Evidence that the address of a local variable (or a pointer into a
local stack buffer) is passed across the boundary.

**Pattern**: `&local_var` or pointer arithmetic on a stack array is
passed as an argument to a cross-boundary function call.

**Risk**: If the callee stores the pointer or uses it after the caller
returns, the pointer is dangling.

### H2_STACK_BACKED_FIELD_IN_ESCAPING_STRUCT

A struct passed across the boundary contains a field whose value was
assigned from stack storage (directly or indirectly).

**Pattern**: A struct is populated on the stack, one of its fields
points to another stack variable or stack buffer, and the struct is
passed to a cross-boundary call.

**Risk**: Even if the struct itself has appropriate lifetime, individual
fields may point to dead stack frames.

### H3_ASYNC_PEND_COMPLETE_USES_CALLER_OWNED_POINTER

Evidence that a pointer (or struct containing pointers) can survive
beyond the current stack frame due to async pend→complete, queuing,
or callback completion.

**Pattern**: A pointer from the caller's frame is stored in a context
object, global, list, work item, or completion record. The callee may
return STATUS_PENDING and complete the operation asynchronously, at
which point the original stack frame is gone.

**Risk**: The completion path dereferences a pointer to a stack frame
that no longer exists.

### H4_WRITABLE_VIEW_OF_LOGICALLY_READONLY_INPUT

The call site passes a writable pointer to data that is logically
input-only, and later code assumes the data has not been modified.

**Pattern**: A `const`-qualified or logically-read-only buffer is
passed via a non-const pointer to a cross-boundary function. The caller
continues using the data after the call, assuming it is unchanged.

**Risk**: A buggy callee (e.g., third-party driver) may write through
the pointer, corrupting data the caller relies on.

**Note**: Only flag when the code implies an assumption of immutability.
Do NOT assume callees are well-behaved.

### H5_UNCLEAR_LIFETIME_NEEDS_HUMAN

Pointers cross the boundary but lifetime and ownership cannot be
proven safe from the locally visible code.

**Pattern**: The analysis cannot determine whether the memory is stack,
heap, pool, or statically allocated — or the ownership transfer
semantics are ambiguous.

**Action**: Provide the evidence, state what is unclear, and list
the specific additional code/files that a human must inspect to
resolve the ambiguity.

## Ranking Criteria

Order findings by likelihood of stack corruption impact:

1. **Highest risk**: H1 and H3 with clear evidence and minimal ambiguity.
2. **High risk**: H2 with clear field assignment from stack.
3. **Medium risk**: H4 when assumptions about immutability are implied.
4. **Lowest risk**: H5 (unclear lifetime — needs human follow-up).

## Usage

In findings, reference labels as:

```
[HAZARD: H1_STACK_ADDRESS_ESCAPE]
Location: <file>:<line>
Evidence: <code excerpt showing the stack variable and boundary call>
Reasoning: <why this is a lifetime escape risk>
```
