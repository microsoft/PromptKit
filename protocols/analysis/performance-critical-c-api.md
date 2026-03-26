<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: performance-critical-c-api
type: analysis
description: >
  Code review patterns for performance-critical C API design. Covers
  flat C API enforcement, caller-controlled memory, strongly-typed
  handles, standard portable types, UTF-8 string handling, minimal API
  surface, and specific error codes. Applicable to system libraries,
  game engines, embedded systems, and driver interfaces.
language: C
applicable_to:
  - review-code
---

# Protocol: Performance-Critical C API Review

Apply these patterns when reviewing C APIs designed for performance-critical
contexts — system libraries, game engines, embedded firmware, or driver
interfaces. Evaluate each pattern against the code under review. Flag
violations with the pattern ID and recommend the corrective action.

---

## PC-001: Flat C API Over Complex Abstractions

**Rationale.** Flat C functions minimize ABI overhead, eliminate vtable
indirection, and enable direct use from any language with a C FFI. Virtual
tables, COM interfaces, and runtime dispatch layers add call-site overhead
and force consumers into a specific object model.

**Trigger.** Any public header that exposes `class`, `virtual`, `IUnknown`,
`STDMETHODCALLTYPE`, or runtime-dispatched function tables.

**Review Criteria.** Verify that every public entry point is a plain C
function (or function pointer in a versioned struct). Internal implementation
may use any abstraction, but the public surface must be flat C.

**Code Example.**

```c
/* Correct — flat C function */
int mylib_widget_create(mylib_widget_t** out);
int mylib_widget_tick(mylib_widget_t* w, float dt);
void mylib_widget_destroy(mylib_widget_t* w);

/* Incorrect — C++ virtual table in public header */
class IWidget {
    virtual int Tick(float dt) = 0;
    virtual void Release() = 0;
};
```

**Checklist.**

- [ ] All public symbols are `extern "C"` or plain C declarations
- [ ] No C++ classes, templates, or exceptions cross the API boundary
- [ ] Function pointer tables (if used) are versioned structs, not vtables

---

## PC-002: UTF-8 String Encoding

**Rationale.** A single encoding path eliminates transcoding overhead and
prevents data loss. UTF-8 is the dominant encoding for cross-platform
interchange; wide strings (`wchar_t`) vary in width across platforms, and
codepage-dependent APIs create locale-sensitive bugs.

**Trigger.** Any function parameter or return type involving `wchar_t`,
`WCHAR`, `BSTR`, `LPWSTR`, or codepage arguments.

**Review Criteria.** Confirm that all string parameters use `const char*`
(input) or `char*` (output buffer) with documented UTF-8 encoding. Reject
wide-string or codepage-dependent alternatives in the public API.

**Code Example.**

```c
/* Correct — UTF-8 const char* */
int mylib_set_name(mylib_handle_t h, const char* name_utf8);

/* Incorrect — wide string */
int mylib_set_name(mylib_handle_t h, const wchar_t* name);
```

**Checklist.**

- [ ] All string parameters are `const char*` (input) or `char*` (output)
- [ ] API documentation explicitly states UTF-8 encoding
- [ ] No `wchar_t`, `BSTR`, or codepage parameters in public headers
- [ ] Null-terminator handling is documented for every string parameter

---

## PC-003: Caller-Controlled Memory Management

**Rationale.** Performance-critical callers need tight control over when,
where, and how memory is allocated — arena allocators, pool allocators, or
pre-allocated buffers. API-allocated memory forces callers into the
library's allocator and creates lifetime ambiguity.

**Trigger.** Any function that returns a heap-allocated pointer the caller
must free, or any API that provides its own `alloc`/`free` pair without a
caller-buffer alternative.

**Review Criteria.** Verify that callers provide their own buffers and that
a size-query function exists so callers can allocate the correct amount.
If the API must allocate internally, verify that a custom allocator callback
is accepted.

**Code Example.**

```c
/* Correct — caller provides buffer, API reports required size */
int mylib_get_info(mylib_handle_t h, mylib_info_t* buffer,
                   size_t buffer_size, size_t* bytes_used);

/* Incorrect — API allocates, caller must call special free */
mylib_info_t* mylib_get_info(mylib_handle_t h);
void mylib_free_info(mylib_info_t* info);
```

**Checklist.**

- [ ] Callers provide output buffers for all data-returning functions
- [ ] A size-query or "required size" output parameter is available
- [ ] If internal allocation is unavoidable, a custom allocator callback
      is accepted at initialization
- [ ] No function returns a pointer the caller must free with a library-
      specific deallocator unless no alternative exists

---

## PC-004: Strongly-Typed Handles

**Rationale.** Opaque typed handles prevent accidental misuse — passing a
texture handle where a shader handle is expected. Generic `void*` or
integer handles provide no compile-time safety and make debugging harder.

**Trigger.** Any public type declared as `void*`, `HANDLE`, `int`, or
`uintptr_t` representing an opaque resource.

**Review Criteria.** Confirm that each resource type has its own opaque
handle typedef (pointer to an incomplete struct). Verify that each handle
type has a dedicated destroy/close function.

**Code Example.**

```c
/* Correct — opaque typed handle */
typedef struct mylib_device_s* mylib_device_t;
typedef struct mylib_buffer_s* mylib_buffer_t;

int mylib_device_destroy(mylib_device_t dev);
int mylib_buffer_destroy(mylib_buffer_t buf);

/* Incorrect — generic void pointer */
typedef void* mylib_handle;
int mylib_destroy(mylib_handle h, int resource_type);
```

**Checklist.**

- [ ] Every resource type has a distinct opaque handle typedef
- [ ] Handle types use pointer-to-incomplete-struct pattern
- [ ] Each handle type has its own `_destroy` / `_close` function
- [ ] No `void*` or integer casts used as generic handle types in the
      public API

---

## PC-005: Standard Portable Types

**Rationale.** Platform-specific typedefs (`DWORD`, `ULONG`, `BOOL`) tie
the API to a single platform and create ambiguity about exact sizes.
Standard `<stdint.h>` types have explicit, portable sizes that are
consistent across compilers and architectures.

**Trigger.** Any public header that uses platform typedefs (`DWORD`,
`WORD`, `BOOL`, `ULONG`, `LPVOID`) instead of standard C types.

**Review Criteria.** Verify that all public types use `<stdint.h>` /
`<stdbool.h>` types. Internal implementation may use platform types where
required by system headers, but the public API must not expose them.

**Code Example.**

```c
/* Correct — standard portable types */
#include <stdint.h>
#include <stdbool.h>

int mylib_configure(mylib_handle_t h, uint32_t flags,
                    size_t count, bool enable);

/* Incorrect — platform-specific typedefs */
int mylib_configure(mylib_handle_t h, DWORD flags,
                    ULONG count, BOOL enable);
```

**Checklist.**

- [ ] All integer parameters use `<stdint.h>` types with explicit widths
- [ ] Boolean parameters use `bool` from `<stdbool.h>`
- [ ] Size and count parameters use `size_t`
- [ ] No platform-specific typedefs appear in public headers

---

## PC-006: Specific Error Codes

**Rationale.** Generic error values (`-1`, `E_FAIL`, `false`) force callers
to consult logs or side channels to diagnose failures. Specific error codes
enable programmatic handling, improve debuggability, and reduce support
burden.

**Trigger.** Any function that returns a success/failure indicator, error
enum, or status code.

**Review Criteria.** Verify that the error enum defines a distinct code for
each diagnosable failure mode. Confirm that every public function documents
which error codes it can return and under what conditions.

**Code Example.**

```c
/* Correct — specific, actionable error codes */
typedef enum {
    MYLIB_OK                       = 0,
    MYLIB_ERR_INVALID_ARGUMENT     = 1,
    MYLIB_ERR_OUT_OF_MEMORY        = 2,
    MYLIB_ERR_BUFFER_TOO_SMALL     = 3,
    MYLIB_ERR_DEVICE_LOST          = 4,
    MYLIB_ERR_TIMEOUT              = 5,
} mylib_result_t;

/* Incorrect — generic failure codes */
#define MYLIB_SUCCESS  0
#define MYLIB_FAILURE -1
```

**Checklist.**

- [ ] Error codes are defined in a typed enum, not bare `#define` integers
- [ ] Each distinct failure mode has its own error code
- [ ] Functions document which error codes they may return
- [ ] A string-conversion function (`mylib_result_to_string`) is provided
      for logging and diagnostics

---

## PC-007: Flat Async Pattern

**Rationale.** Promise, future, and task abstractions impose scheduling
policy and memory allocation on the caller. A flat async pattern — explicit
begin/end or submit/poll function pairs with caller-owned context — gives
callers full control over threading, scheduling, and memory.

**Trigger.** Any asynchronous operation, callback-based API, or function
that accepts a completion handler or returns a future/promise object.

**Review Criteria.** Verify that async operations use a begin/complete or
submit/poll pair. Confirm that the caller provides the context block and
controls when to poll or wait for results.

**Code Example.**

```c
/* Correct — flat async with caller-owned context */
typedef struct mylib_async_op_s mylib_async_op_t;

int mylib_read_begin(mylib_device_t dev, void* buffer, size_t size,
                     mylib_async_op_t* op);
int mylib_read_poll(mylib_async_op_t* op, size_t* bytes_read);
int mylib_read_cancel(mylib_async_op_t* op);

/* Incorrect — promise abstraction with hidden allocation */
mylib_future_t* mylib_read_async(mylib_device_t dev, void* buffer,
                                 size_t size);
int mylib_future_wait(mylib_future_t* future);
void mylib_future_free(mylib_future_t* future);
```

**Checklist.**

- [ ] Async operations use explicit begin/poll or submit/complete pairs
- [ ] Caller provides the async context (operation state) buffer
- [ ] No hidden allocations occur during async operation submission
- [ ] Cancellation is supported via a dedicated cancel function

---

## PC-008: Minimal API Surface

**Rationale.** Every public function is a long-term maintenance commitment
and a potential attack surface. A small, orthogonal API is easier to learn,
test, audit, and keep binary-compatible. Convenience wrappers belong in
optional helper libraries that callers may adopt or ignore.

**Trigger.** Any function that can be trivially composed from other public
functions, or any "convenience" overload that differs only in defaulting
a parameter.

**Review Criteria.** Verify that the public surface contains only primitives
that cannot be decomposed. Check that convenience helpers, if present, live
in a separate header or optional library.

**Code Example.**

```c
/* Correct — minimal primitive surface */
int mylib_buffer_create(mylib_buffer_t* out, size_t size);
int mylib_buffer_write(mylib_buffer_t buf, const void* data, size_t len);

/* Incorrect — convenience overload in core API */
int mylib_buffer_create_from_string(mylib_buffer_t* out, const char* str);
int mylib_buffer_create_from_file(mylib_buffer_t* out, const char* path);
```

**Checklist.**

- [ ] Each public function provides exactly one capability
- [ ] No convenience wrappers exist in the core header
- [ ] Helper/convenience functions are in a separate optional header
- [ ] API surface has been reviewed for functions that can be removed
      without reducing capability

---

## PC-009: Variable-Sized Data Patterns

**Rationale.** Variable-sized output is a common source of buffer overflows,
double-call confusion, and inconsistent error handling. A single, consistent
pattern for returning variable-sized data across the entire API makes the
caller's job predictable and safe.

**Trigger.** Any function that returns data whose size is not known at
compile time — strings, arrays, serialized blobs, enumerated collections.

**Review Criteria.** Verify that the API uses one consistent pattern:
caller-provided buffer with a `size`/`used` pair, a separate size-query
function, or callback-based enumeration for unbounded collections. Reject
two-in-one patterns where a single function both queries size and writes
data based on a null-pointer check.

**Code Example.**

```c
/* Correct — explicit size query, then caller-provided buffer */
int mylib_get_name_size(mylib_handle_t h, size_t* required_size);
int mylib_get_name(mylib_handle_t h, char* buffer,
                   size_t buffer_size, size_t* bytes_written);

/* Correct — callback-based enumeration for collections */
typedef bool (*mylib_enum_cb)(const mylib_item_t* item, void* ctx);
int mylib_enumerate_items(mylib_handle_t h, mylib_enum_cb cb, void* ctx);

/* Incorrect — two-in-one null-pointer overload */
int mylib_get_name(mylib_handle_t h, char* buffer, size_t* size);
/* if buffer == NULL, writes required size to *size;
   if buffer != NULL, writes data — confusing and error-prone */
```

**Checklist.**

- [ ] A single pattern is used consistently for all variable-sized outputs
- [ ] Size-query and data-retrieval are separate functions, or a `size`/
      `used` pair is always present
- [ ] No two-in-one call patterns where NULL triggers size-query mode
- [ ] Callback-based enumeration is used for unbounded or streaming
      collections

---

## PC-010: Parameter Naming and Ordering Conventions

**Rationale.** Consistent parameter naming and ordering reduce cognitive
load and prevent misuse. When every function places the context first and
outputs last, callers can predict signatures without consulting
documentation. The `count`/`items`/`itemsUsed` triple for collections
prevents buffer overflows by design.

**Trigger.** Any public function signature — review on every new or
modified function in the API.

**Review Criteria.** Verify that parameters follow a consistent order:
context or handle first, inputs next, outputs last. Confirm that collection
parameters use a `thingCount` / `things` / `thingsUsed` naming triple.
Check that naming is descriptive and unambiguous.

**Code Example.**

```c
/* Correct — handle first, inputs middle, outputs last;
   collection uses count/items/itemsUsed triple */
int mylib_get_devices(mylib_context_t ctx,
                      uint32_t deviceArraySize,
                      mylib_device_info_t* devices,
                      uint32_t* devicesUsed);

/* Incorrect — inconsistent ordering, ambiguous names */
int mylib_get_devices(mylib_device_info_t* out, int n,
                      mylib_context_t ctx, int* written);
```

**Checklist.**

- [ ] Handle or context parameter is always the first argument
- [ ] Output parameters are always last
- [ ] Collection parameters follow the `count` / `items` / `itemsUsed`
      naming triple
- [ ] Parameter names are descriptive (`bufferSize` not `n`, `bytesUsed`
      not `ret`)

---

## Output Format

For each violation found, report:

```
[Pattern: PC-0XX — <Pattern Title>]
[SEVERITY: Critical|High|Medium|Low]
Location: <file>:<line> or <function name>
Issue: <concise description of the violation>
Remediation: <specific corrective action>
```

---

## References

- Bloch, J. "How to Design a Good API and Why it Matters." OOPSLA 2006.
- IEEE Std 1003.1 (POSIX) — API design conventions for system interfaces.
- ISO/IEC 9899:1999 (C99) and ISO/IEC 9899:2011 (C11) — standard library
  conventions for parameter ordering, error reporting, and type usage.
- Meyers, S. and Martin, R. — general API usability principles: make
  interfaces easy to use correctly and hard to use incorrectly.
