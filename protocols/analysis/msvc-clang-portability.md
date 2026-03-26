<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: msvc-clang-portability
type: analysis
description: >
  C++ cross-compiler portability analysis between MSVC and
  Clang/GCC. Identifies MSVC extensions and non-standard patterns
  that compile on MSVC but fail on standards-conforming compilers.
  Covers template rules, const correctness, exception specifications,
  dependent type names, implicit conversions, and deprecated features.
language: C++
---

# Protocol: MSVC / Clang–GCC Portability Analysis

Apply this protocol when reviewing C++ code that must compile on both MSVC
and Clang or GCC. Evaluate every pattern in order. For each finding, cite the
pattern ID and provide the portable replacement. Do not assume that code
compiling cleanly under MSVC `/permissive` mode is standards-conforming —
many extensions remain active even with that flag.

---

## 1. Template and Generic Programming

### PORT-T1: Missing `typename` on dependent types

MSVC's two-phase name lookup extension resolves dependent names without the
`typename` keyword. The C++ standard requires `typename` before any qualified
name that depends on a template parameter and denotes a type.

```cpp
// Before — compiles on MSVC, rejected by Clang/GCC
template <typename T>
void process(T& container) {
    T::iterator it = container.begin();
}

// After — portable
template <typename T>
void process(T& container) {
    typename T::iterator it = container.begin();
}
```

> **Note:** MSVC defers dependent name resolution to instantiation time,
> so it can see that `T::iterator` is a type without the keyword. Clang and
> GCC follow the standard two-phase rule and reject the code during parsing.

### PORT-T2: Function template default arguments

MSVC allows adding default template arguments to a function template in a
redeclaration. The standard requires all default arguments to appear on the
first declaration.

```cpp
// Before — compiles on MSVC, rejected by Clang/GCC
template <typename T>
void serialize(const T& value);

template <typename T = int>   // default added in redeclaration
void serialize(const T& value) { /* ... */ }

// After — portable: defaults on the first declaration
template <typename T = int>
void serialize(const T& value);

template <typename T>
void serialize(const T& value) { /* ... */ }
```

> **Note:** MSVC merges default arguments across declarations. Standards-
> conforming compilers treat the redeclaration default as a duplicate.

### PORT-T3: Pack expansion in alias templates

MSVC eagerly substitutes alias templates before pack expansion, which can
change the semantics of variadic patterns. Clang follows the standard
two-phase rules and may reject or misinterpret the expansion.

```cpp
// Before — MSVC substitutes eagerly, Clang rejects
template <typename... Ts>
using FirstOf = typename std::tuple_element<0, std::tuple<Ts...>>::type;

template <typename... Ts>
FirstOf<Ts...> extract(std::tuple<Ts...>& t) { return std::get<0>(t); }

// After — intermediate struct defers substitution
template <typename... Ts>
struct FirstOfImpl {
    using type = typename std::tuple_element<0, std::tuple<Ts...>>::type;
};

template <typename... Ts>
typename FirstOfImpl<Ts...>::type extract(std::tuple<Ts...>& t) {
    return std::get<0>(t);
}
```

> **Note:** MSVC performs alias substitution in a single phase, sidestepping
> the dependent context that Clang enforces during template argument deduction.

### PORT-T4: Unqualified friend template lookup

MSVC searches enclosing namespaces when resolving unqualified friend function
templates. The standard restricts lookup to the innermost enclosing namespace
and the class itself.

```cpp
// Before — MSVC finds helper via outer namespace lookup
namespace detail {
    template <typename T> void helper(T&);
}

class Widget {
    friend void helper<>(Widget&);  // unqualified — MSVC finds detail::helper
};

// After — explicitly qualify the friend declaration
class Widget {
    friend void detail::helper<>(Widget&);
};
```

> **Note:** MSVC's extended lookup walks the enclosing namespace chain.
> Clang and GCC restrict unqualified friend lookup per [temp.friend]/1.

### PORT-T5: Non-standard type trait patterns

Under `/permissive` mode MSVC accepts shorthand trait names such as
`bool_constant_v` or `is_same_` without the standard `_v` suffix. Clang
and GCC require the exact standard names.

```cpp
// Before — non-standard shorthand accepted by MSVC
template <typename T>
constexpr bool is_numeric = std::is_arithmetic<T>{};

// After — use the standard _v variable template
template <typename T>
constexpr bool is_numeric = std::is_arithmetic_v<T>;
```

> **Note:** MSVC permissive mode silently promotes several legacy trait
> spellings. Strict mode (`/permissive-`) catches some but not all of these.

### PORT-T6: Template specialization requires `template<>`

MSVC accepts explicit specializations of class or function templates without
the required `template<>` prefix. The standard mandates the prefix.

```cpp
// Before — MSVC accepts the missing template<>
struct Traits<int> {
    static constexpr bool is_integral = true;
};

// After — add the required prefix
template <>
struct Traits<int> {
    static constexpr bool is_integral = true;
};
```

> **Note:** MSVC infers the specialization context from the angle brackets
> on the class name. Clang and GCC require the explicit `template<>` prefix
> per [temp.expl.spec]/1.

---

## 2. Const Correctness

### PORT-C1: String literal to non-const pointer

MSVC silently drops the `const` qualifier when passing a string literal to
a function accepting `char*` or `void*`. The standard makes string literals
`const char[]`, so implicit conversion to a non-const pointer is ill-formed
in C++11 and later.

```cpp
// Before — MSVC silently converts; Clang rejects
void log(char* msg);

void init() {
    log("startup complete");
}

// After — accept const or use explicit cast
void log(const char* msg);

void init() {
    log("startup complete");
}
```

> **Note:** MSVC retains C89 compatibility for string-literal-to-`char*`
> conversion. Clang enforces the C++11 deprecation and C++17 removal.

### PORT-C2: Deleted operator missing `const`

MSVC accepts a deleted copy-assignment operator declared as
`operator=(T&) = delete` even when template instantiation supplies a
`const T&` argument. Clang requires the `const` qualifier to match.

```cpp
// Before — MSVC matches the delete despite missing const
template <typename T>
struct Wrapper {
    Wrapper& operator=(Wrapper&) = delete;
};

// After — add const to match the standard copy-assignment signature
template <typename T>
struct Wrapper {
    Wrapper& operator=(const Wrapper&) = delete;
};
```

> **Note:** MSVC's overload resolution considers `T&` a viable match for
> `const T&` when the function is deleted. Clang requires an exact match.

---

## 3. Exception Specifications

### PORT-E1: Dynamic exception specifications

Dynamic exception specifications (`throw(type)`) were deprecated in C++11
and removed in C++17. MSVC accepts them as an extension even in C++17 mode.
Clang rejects them.

```cpp
// Before — MSVC extension
void risky() throw(std::runtime_error);
void safe() throw();
void dtor() throw() { /* ... */ }

// After — portable equivalents
void risky();                       // remove — functions throw by default
void safe() noexcept;               // throw() → noexcept
void dtor() noexcept(false) { /* ... */ }  // intentionally-throwing destructor
```

> **Note:** MSVC treats `throw(...)` as a no-op annotation. Clang implements
> the C++17 removal and issues a hard error.

### PORT-E2: Throw with exceptions disabled

MSVC allows `throw` expressions in code compiled without `/EHsc` (exception
handling disabled). Clang rejects `throw` when `-fno-exceptions` is active.

```cpp
// Before — compiles on MSVC without /EHsc
void fail() {
    throw std::runtime_error("fatal");
}

// After — guard with preprocessor or enable exceptions
#ifdef __cpp_exceptions
void fail() {
    throw std::runtime_error("fatal");
}
#else
void fail() {
    std::abort();
}
#endif
```

> **Note:** MSVC silently converts `throw` to `std::abort` when exceptions
> are disabled. Clang refuses to compile throw expressions at all.

---

## 4. Type System

### PORT-Y1: Missing type specifier (implicit int)

MSVC accepts functions declared without a return type, applying the C89
"implicit int" rule in C++ mode. The standard requires an explicit return
type in C++.

```cpp
// Before — MSVC infers int return type
static process(int x) {
    return x * 2;
}

// After — add the explicit return type
static int process(int x) {
    return x * 2;
}
```

> **Note:** MSVC preserves C89 implicit-int as a legacy extension. Clang
> and GCC reject missing return types in C++ mode.

### PORT-Y2: Enum tag / typedef mismatch

MSVC treats `typedef enum Tag {} Alias` as compatible even when `Tag` and
`Alias` differ across declarations. Clang requires the tag name and typedef
name to be consistent in redeclarations.

```cpp
// Before — MSVC accepts mismatched names
// header.h
typedef enum StatusCode { OK, FAIL } Status;

// source.cpp — redeclares with different typedef name
typedef enum StatusCode { OK, FAIL } StatusCode;  // mismatch: Status ≠ StatusCode

// After — use consistent names
typedef enum StatusCode { OK, FAIL } StatusCode;
```

> **Note:** MSVC ignores typedef name mismatches during linkage. Clang
> treats the mismatch as a redefinition error.

### PORT-Y3: Signed / unsigned implicit conversion

MSVC emits a warning (C4245) for implicit signed-to-unsigned conversions
but still compiles. Clang may reject the conversion outright in certain
template or constant-expression contexts.

```cpp
// Before — MSVC warns (C4245), Clang may reject
unsigned int flags = -1;

// After — use explicit cast or matching types
unsigned int flags = static_cast<unsigned int>(-1);
// or: unsigned int flags = UINT_MAX;
```

> **Note:** MSVC has historically been lenient with signed/unsigned
> mismatches. Clang enforces stricter narrowing rules, especially inside
> braced initialization and constexpr contexts.

---

## 5. Constexpr and Compile-Time

### PORT-X1: Constexpr enum flag complement

Taking the bitwise complement of an unscoped enum flag can produce a value
outside the enum's representable range. MSVC evaluates this at compile time
without complaint; Clang diagnoses the out-of-range `constexpr` value.

```cpp
// Before — MSVC accepts; Clang rejects as non-constant
enum Flags : unsigned { Read = 1, Write = 2, Execute = 4 };
constexpr Flags mask = static_cast<Flags>(~Write);

// After — use const instead of constexpr
enum Flags : unsigned { Read = 1, Write = 2, Execute = 4 };
const Flags mask = static_cast<Flags>(~Write);
```

> **Note:** The standard requires constexpr values of enum type to fall
> within the enum's range. `~Write` exceeds that range. MSVC does not
> enforce this constraint; Clang does.

### PORT-X2: Constexpr member in incomplete class

MSVC allows constexpr static member functions to be called before the
enclosing class definition is complete. The standard requires the class to
be complete at the point of constexpr evaluation.

```cpp
// Before — MSVC accepts forward reference within class body
struct Config {
    static constexpr int maxSize() { return bufSize * 2; }
    static constexpr int bufSize = 64;
};

// After — order members so dependencies are defined first
struct Config {
    static constexpr int bufSize = 64;
    static constexpr int maxSize() { return bufSize * 2; }
};
```

> **Note:** MSVC processes the entire class body before evaluating
> constexpr members, so forward references resolve. Clang evaluates
> constexpr expressions at the point of definition.

---

## 6. Declarations and Storage

### PORT-D1: Thread-local storage class mismatch

MSVC implicitly carries the `thread_local` storage class across
redeclarations of the same variable. The standard requires every
declaration to repeat the storage-class specifier.

```cpp
// Before — MSVC carries thread_local from the first declaration
extern thread_local int counter;   // declaration

int counter = 0;                   // definition — missing thread_local

// After — repeat thread_local on every declaration
extern thread_local int counter;

thread_local int counter = 0;
```

> **Note:** MSVC merges storage-class specifiers across declarations.
> Clang treats the mismatch as a redeclaration error.

### PORT-D2: `[[nodiscard]]` after decl-specifiers

MSVC accepts `[[nodiscard]]` placed after the return type or between
decl-specifiers. The standard requires attributes before the declaration
specifiers.

```cpp
// Before — non-standard attribute placement
int [[nodiscard]] compute(int x);

// After — attribute before the decl-specifier-seq
[[nodiscard]] int compute(int x);
```

> **Note:** MSVC's attribute parser is position-tolerant. Clang follows
> the standard grammar and rejects attributes in non-standard positions.

### PORT-D3: Nested struct default member init

MSVC allows default member initializers in nested structs even when the
outer class is not yet complete. Clang requires the enclosing class to be
complete before evaluating default member initializers in nested types.

```cpp
// Before — MSVC accepts; Clang rejects incomplete outer class
struct Outer {
    struct Inner {
        int value = Outer::defaultValue;   // Outer is incomplete here
    };
    static constexpr int defaultValue = 42;
};

// After — move initialization to the constructor
struct Outer {
    struct Inner {
        int value;
        Inner() : value(Outer::defaultValue) {}
    };
    static constexpr int defaultValue = 42;
};
```

> **Note:** MSVC defers evaluation of nested default member initializers
> until the outer class is complete. Clang evaluates them at the point of
> definition per [class.mem]/6.

---

## 7. Language Extensions

### PORT-L1: MSVC `for each` extension

MSVC supports a `for each (T item in collection)` syntax from C++/CLI.
This is a compiler extension with no standard equivalent. Clang and GCC
reject it outright.

```cpp
// Before — MSVC C++/CLI extension
std::vector<int> values = {1, 2, 3};
for each (int v in values) {
    process(v);
}

// After — standard C++11 range-based for
std::vector<int> values = {1, 2, 3};
for (int v : values) {
    process(v);
}
```

> **Note:** `for each` is a C++/CLI language extension implemented only by
> MSVC. It has no ISO C++ standing and is not recognized by any other
> compiler.

### PORT-L2: Pointer-to-member without parentheses

MSVC accepts pointer-to-member calls without the parentheses required by
the standard's grammar. The expression `obj.*pmf()` is parsed by MSVC as
`(obj.*pmf)()`, but the standard requires the explicit parentheses.

```cpp
// Before — MSVC accepts without parentheses
struct Widget {
    void draw();
};
void (Widget::*pmf)() = &Widget::draw;
Widget w;
w.*pmf();            // MSVC parses as (w.*pmf)()

// After — add required parentheses
(w.*pmf)();
```

> **Note:** MSVC's parser applies a non-standard precedence rule for `.*`
> and `->*` with function call expressions. Clang follows the standard
> grammar which requires explicit grouping.

### PORT-L3: Conflicting C function signatures

MSVC accepts function declarations in C mode where pointer types differ
only by const qualification or compatible struct tags, applying implicit
pointer conversions. Clang requires exact type matches across declarations.

```cpp
// Before — MSVC accepts implicit pointer conversion in C mode
// header.h
void configure(const struct Options* opts);

// source.c — omits const
void configure(struct Options* opts) {
    opts->verbose = 1;
}

// After — match pointer types exactly
void configure(struct Options* opts);

void configure(struct Options* opts) {
    opts->verbose = 1;
}
```

> **Note:** MSVC applies C-style compatible-type rules that tolerate
> const mismatches across declarations. Clang enforces strict prototype
> matching even in C mode.

---

## References

- **ISO/IEC 14882 (C++17 / C++20)** — Normative rules for two-phase
  lookup, template instantiation, constexpr evaluation, and exception
  specifications referenced by every pattern above.
- **Clang Compatibility** — *Clang documentation: Microsoft
  Compatibility*. Documents known divergences between MSVC and
  standards-conforming behavior.
  <https://clang.llvm.org/docs/MSVCCompatibility.html>
- **MSVC Conformance** — *Microsoft Learn: C++ Conformance
  Improvements*. Tracks which MSVC extensions have been corrected or
  deprecated in recent compiler versions.
  <https://learn.microsoft.com/en-us/cpp/overview/cpp-conformance-improvements>
