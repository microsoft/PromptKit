<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: win32-api-conventions
type: analysis
description: >
  Analysis protocol for reviewing Win32 API code against publicly documented
  naming, typing, and design conventions. Covers function naming, struct and
  enum typedefs, parameter ordering, modern data types, const-correctness,
  Hungarian notation avoidance, and C compatibility of SDK headers.
language: C
applicable_to:
  - review-code
  - investigate-bug
---

# Protocol: Win32 API Conventions

Apply this protocol when reviewing C code that defines or extends Win32-style
APIs. Evaluate each pattern in order. Flag every violation — seemingly minor
naming inconsistencies erode discoverability and tool support across the
Windows SDK surface.

## WG-001: Function and Interface Method Naming

**Source:** Win32 API Guidelines — Naming Conventions (Functions)

**Trigger:** Any function declaration or definition exposed through a public
header.

**Review Criteria:** Verify that every public function uses PascalCase. Each
word boundary starts with an uppercase letter, no underscores separate words.
Internal helper functions not exposed in headers are exempt.

**Code Example:**

```c
// Correct
HRESULT CreateModel(_In_ const MODEL_DESCRIPTION* modelDescription);

// Incorrect — snake_case
HRESULT create_model(_In_ const MODEL_DESCRIPTION* modelDescription);
```

**Validation:** Scan all function declarations in public headers. Confirm
every exported symbol matches the regex `[A-Z][a-zA-Z0-9]*`.

## WG-002: Struct and Union Typedef Naming

**Source:** Win32 API Guidelines — Naming Conventions (Types)

**Trigger:** Any `typedef struct` or `typedef union` declaration in a public
header.

**Review Criteria:** Verify that the typedef name uses UPPER_CASE with
underscores separating words. Mixed-case or PascalCase typedefs violate
the convention.

**Code Example:**

```c
// Correct
typedef struct MODEL_DESCRIPTION {
    UINT32 version;
    const WCHAR* displayName;
} MODEL_DESCRIPTION;

// Incorrect — PascalCase typedef
typedef struct ModelDescription {
    UINT32 version;
    const WCHAR* displayName;
} ModelDescription;
```

**Validation:** Grep for `typedef struct` and `typedef union` in public
headers. Confirm every typedef identifier matches `[A-Z][A-Z0-9_]*`.

## WG-003: Parameter Naming Convention

**Source:** Win32 API Guidelines — Naming Conventions (Parameters)

**Trigger:** Any parameter in a function declaration within a public header.

**Review Criteria:** Verify that every parameter uses camelCase. The first
letter is lowercase, subsequent word boundaries are uppercase. Do not use
PascalCase, UPPER_CASE, or Hungarian-prefixed names for parameters.

**Code Example:**

```c
// Correct
HRESULT CreateModel(
    _In_ const MODEL_DESCRIPTION* modelDescription,
    _Out_ HANDLE* modelHandle);

// Incorrect — PascalCase parameter
HRESULT CreateModel(
    _In_ const MODEL_DESCRIPTION* ModelDescription,
    _Out_ HANDLE* ModelHandle);
```

**Validation:** For each function in public headers, confirm every parameter
name starts with a lowercase letter and contains no underscores.

## WG-004: Enum Design and Naming

**Source:** Win32 API Guidelines — Naming Conventions (Enumerations)

**Trigger:** Any `typedef enum` declaration in a public header.

**Review Criteria:** Verify three things: (1) the enum typedef name is
UPPER_CASE, (2) every enum value is UPPER_CASE, and (3) each value is
prefixed with the typedef name to avoid namespace collisions.

**Code Example:**

```c
// Correct — UPPER_CASE typedef, prefixed values
typedef enum MODEL_TYPE {
    MODEL_TYPE_SIMPLE   = 0,
    MODEL_TYPE_COMPLEX  = 1,
    MODEL_TYPE_ADAPTIVE = 2,
} MODEL_TYPE;

// Incorrect — PascalCase typedef, unprefixed values
typedef enum ModelType {
    Simple  = 0,
    Complex = 1,
} ModelType;
```

**Validation:** For each `typedef enum`, verify the typedef name matches
`[A-Z][A-Z0-9_]*` and every enumerator starts with that typedef name.

## WG-005: Modern Data Type Usage

**Source:** Win32 API Guidelines — Basic Data Types

**Trigger:** Any use of `DWORD`, `ULONG`, `LONG`, `USHORT`, `BYTE`, or other
legacy unsized type aliases in new API declarations.

**Review Criteria:** Prefer explicitly sized types in new APIs. Map legacy
types to their sized equivalents: `DWORD` → `UINT32`, `ULONG` → `UINT32`,
`LONG` → `INT32`, `USHORT` → `UINT16`, `BYTE` → `UINT8`. Legacy types are
acceptable only when matching an existing API signature for compatibility.

**Code Example:**

```c
// Correct — explicitly sized types
HRESULT SetTimeout(_In_ UINT32 timeoutMs);
HRESULT ReadBuffer(_Out_writes_(length) UINT8* buffer, _In_ UINT32 length);

// Incorrect — legacy unsized types in new API
HRESULT SetTimeout(_In_ DWORD dwTimeout);
HRESULT ReadBuffer(_Out_writes_(length) BYTE* buffer, _In_ DWORD length);
```

**Validation:** Search new API declarations for legacy type names. Each
occurrence in a new header requires justification or replacement with
the sized equivalent.

## WG-006: Const Parameter Usage

**Source:** Win32 API Guidelines — Parameter Conventions

**Trigger:** Any function parameter that is a pointer to data the function
does not modify.

**Review Criteria:** Verify that input pointer parameters carry the `const`
qualifier on the pointed-to type. Pair `const` with the SAL annotation
`_In_` (or `_In_reads_`, `_In_z_`, etc.) to communicate intent to both
the compiler and static analysis tools. Omitting `const` on a read-only
pointer misleads callers about mutation.

**Code Example:**

```c
// Correct — const + SAL annotation on input pointer
HRESULT SetIdentifier(_In_ const GUID* identifier);

// Incorrect — missing const on read-only pointer
HRESULT SetIdentifier(_In_ GUID* identifier);
```

**Validation:** For each pointer parameter annotated `_In_`, confirm that
the pointed-to type is `const`-qualified. Flag any `_In_` pointer parameter
that omits `const`.

## WG-007: Parameter Ordering

**Source:** Win32 API Guidelines — Parameter Ordering

**Trigger:** Any function declaration with a mix of input and output
parameters.

**Review Criteria:** Verify that parameters appear in this order:
(1) `_In_` parameters, (2) `_Inout_` parameters, (3) `_Out_` parameters.
Output parameters must not precede input parameters. This ordering aligns
with the caller's mental model of "provide, then receive."

**Code Example:**

```c
// Correct — IN, then IN/OUT, then OUT
HRESULT TransformData(
    _In_    const TRANSFORM_DESC* description,
    _Inout_ DATA_BUFFER*          buffer,
    _Out_   UINT32*               bytesWritten);

// Incorrect — OUT parameter before IN parameter
HRESULT TransformData(
    _Out_   UINT32*               bytesWritten,
    _In_    const TRANSFORM_DESC* description,
    _Inout_ DATA_BUFFER*          buffer);
```

**Validation:** For each function, check that no `_Out_` or `_Inout_`
annotated parameter appears before any `_In_` parameter, and no `_Out_`
parameter appears before any `_Inout_` parameter.

## WG-008: Structure Tag Naming

**Source:** Win32 API Guidelines — Naming Conventions (Types)

**Trigger:** Any `typedef struct` or `typedef union` with a tag name that
differs from its typedef name.

**Review Criteria:** Verify that the struct or union tag matches the typedef
name exactly. Do not prefix the tag with an underscore. The legacy
`_TYPENAME` tag convention introduces a redundant identifier that hinders
discoverability.

**Code Example:**

```c
// Correct — tag matches typedef
typedef struct MUFFIN {
    UINT32 flavor;
    UINT32 weight;
} MUFFIN;

// Incorrect — underscore-prefixed tag
typedef struct _MUFFIN {
    UINT32 flavor;
    UINT32 weight;
} MUFFIN;
```

**Validation:** For every `typedef struct TAG { ... } NAME;`, verify that
`TAG` equals `NAME`. Flag any tag that starts with an underscore or
otherwise diverges from the typedef name.

## WG-009: Hungarian Notation Avoidance

**Source:** Win32 API Guidelines — Naming Conventions

**Trigger:** Any new API declaration containing parameter names, struct
fields, or function names that use Hungarian notation prefixes.

**Review Criteria:** Do not use Hungarian notation prefixes (`p`, `lp`,
`lpsz`, `h`, `dw`, `sz`, `cb`, `b`, `n`, `ul`) in new APIs. These prefixes
duplicate type information already visible in the declaration and reduce
readability. Existing APIs that already ship with Hungarian names are exempt;
new wrappers around them should still use unprefixed names.

**Code Example:**

```c
// Correct — descriptive, unprefixed names
HRESULT OpenDevice(
    _In_z_  const WCHAR* devicePath,
    _Out_   HANDLE*      device);

// Incorrect — Hungarian-prefixed names
HRESULT OpenDevice(
    _In_z_  LPCWSTR lpszDevicePath,
    _Out_   LPHANDLE phDevice);
```

**Validation:** Scan new declarations for common Hungarian prefixes at the
start of identifiers. Any match in new code (not legacy compatibility
wrappers) is a violation.

## WG-010: Header File C Compatibility

**Source:** Win32 API Guidelines — SDK Header Requirements

**Trigger:** Any header file intended for inclusion in the Windows SDK or
consumed by C callers.

**Review Criteria:** SDK headers must compile as valid C. Do not use C++
syntax: references (`&`), classes, namespaces, templates, default parameter
values, or `//` comments in pre-C99 contexts. Use `const TYPE*` instead of
`const TYPE&`. Wrap any C++-only sections in `#ifdef __cplusplus` guards.

**Code Example:**

```c
// Correct — C-compatible pointer parameter
HRESULT LookupItem(_In_ const GUID* itemId, _Out_ ITEM_INFO* info);

// Incorrect — C++ reference parameter in SDK header
HRESULT LookupItem(_In_ const GUID& itemId, _Out_ ITEM_INFO& info);
```

**Validation:** Attempt to compile every public header with a C compiler
(`/TC` on MSVC, `-x c` on GCC/Clang). Any compilation failure indicates a
C-compatibility violation.

## Output Format

For each finding, report:

```
[SEVERITY: High|Medium|Low]
Pattern: <WG-NNN — pattern title>
Location: <file>:<line> or <function name>
Issue: <concise description>
Evidence: <code snippet demonstrating the violation>
Remediation: <specific fix recommendation>
Confidence: <High|Medium|Low — with justification if not High>
```

## References

- **Win32 API Guidelines** — Microsoft Learn:
  https://learn.microsoft.com/en-us/windows/win32/apiindex/api-index-portal
- **Windows SDK Documentation** — Microsoft Learn:
  https://learn.microsoft.com/en-us/windows/win32/
- **SAL Annotations** — Microsoft Learn:
  https://learn.microsoft.com/en-us/cpp/code-quality/understanding-sal
