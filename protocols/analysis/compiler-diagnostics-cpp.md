<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: compiler-diagnostics-cpp
type: analysis
description: >
  Systematic protocol for analyzing and remediating C++ compiler
  diagnostics. Covers variable shadowing, implicit conversions,
  unused variables, sign comparison, and other common warning
  categories with specific resolution strategies per warning type.
language: C++
---

# Protocol: C++ Compiler Diagnostics Analysis

Apply this protocol when systematically resolving compiler warnings or
errors in C++ code. Each diagnostic must be understood, classified, and
resolved using the strategy specific to its warning type — never silenced
with blanket suppressions or unrelated refactoring.

## Rules

### 1. Classify Before Fixing

For every diagnostic the compiler emits, determine its nature before
writing any code change:

| Classification    | Meaning                                        | Action                        |
|-------------------|------------------------------------------------|-------------------------------|
| **Confirmed Bug** | The diagnostic reveals incorrect runtime behavior | Fix immediately               |
| **Code Quality**  | Legal code, but fragile or misleading           | Fix in the current pass       |
| **Style**         | Cosmetic; no behavioral impact                  | Fix only if in scope          |
| **False Positive** | Diagnostic is wrong or inapplicable            | Suppress with justification   |

Do **not** begin editing until the classification is recorded. If a single
diagnostic could fall into more than one category, choose the most severe.

### 2. Variable Shadowing Diagnostics (C4456–C4459)

Shadowing warnings require renaming the **correct** variable. Renaming the
wrong scope silently changes program meaning.

#### C4456 — Local hides local

Rename the **outer** variable; append `Outer` to its name.

```cpp
// Before — C4456: declaration of 'idx' hides previous local
for (int idx = 0; idx < rows; ++idx) {
    for (int idx = 0; idx < cols; ++idx) { // shadows outer
        matrix[idx][idx] = 0;
    }
}

// After
for (int idxOuter = 0; idxOuter < rows; ++idxOuter) {
    for (int idx = 0; idx < cols; ++idx) {
        matrix[idxOuter][idx] = 0;
    }
}
```

#### C4457 — Local hides function parameter

Append `Param` to the **function parameter** name.

```cpp
// Before — C4457: declaration of 'count' hides function parameter
void process(int count) {
    int count = computeCount(); // shadows parameter
    use(count);
}

// After
void process(int countParam) {
    int count = computeCount();
    use(count);
}
```

#### C4458 — Local hides class member

Prefix class members: `m_` for non-static, `s_` for static. Remove
`this->` qualifiers that were compensating for the shadowing.

```cpp
// Before — C4458: declaration of 'name' hides class member
class Widget {
    std::string name;
public:
    void setName(std::string name) {
        this->name = name;
    }
};

// After
class Widget {
    std::string m_name;
public:
    void setName(std::string name) {
        m_name = name;
    }
};
```

#### C4459 — Local hides global

Prefix the **global** variable with `g_`.

```cpp
// Before — C4459: declaration of 'verbose' hides global declaration
bool verbose = false; // global

void configure() {
    bool verbose = checkFlag(); // shadows global
}

// After
bool g_verbose = false; // global

void configure() {
    bool verbose = checkFlag();
}
```

### 3. Implicit Conversion Diagnostics

#### Enum type mismatches (`-Wenum-conversion`)

Use the correct enumerator from the target enum type. Do not cast an
integer or a value from a different enum — find the semantically correct
enum constant.

```cpp
// Bad — silences warning but hides a logic error
state = static_cast<ConnectionState>(ErrorCode::Timeout);

// Good — use the correct enum value
state = ConnectionState::TimedOut;
```

#### Sign comparison (`-Wsign-compare`)

Use matching signed/unsigned types. Prefer changing the **signed** variable
to an unsigned type when it is logically non-negative, rather than casting
at the comparison site.

```cpp
// Before
int i = 0;
for (i = 0; i < vec.size(); ++i) { ... }

// After
for (size_t i = 0; i < vec.size(); ++i) { ... }
```

#### Narrowing conversions (`-Wnarrowing`)

Use an explicit cast with a comment explaining why the conversion is safe.

```cpp
// Before — narrowing from int to uint8_t
uint8_t flags = combinedFlags;

// After
uint8_t flags = static_cast<uint8_t>(combinedFlags); // safe: value masked to 0xFF above
```

#### Bit-field truncation (`-Wbitfield-constant-conversion`)

Verify the assigned value fits within the bit-field width. If it does not,
widen the bit-field or change the assigned value.

```cpp
// Before — value 5 does not fit in 2-bit field
struct Pkt { unsigned int type : 2; };
Pkt p; p.type = 5; // truncated to 1

// After — widen the field to accommodate the value range
struct Pkt { unsigned int type : 3; };
Pkt p; p.type = 5;
```

### 4. Unused and Unreachable Code

#### Unused variables (`-Wunused-variable`)

- If the variable is **genuinely unused**, remove it entirely.
- If it is unused only in certain build configurations (e.g., release),
  annotate with `[[maybe_unused]]`.

```cpp
[[maybe_unused]] auto debugHandle = registerDebugHook();
```

#### Unused parameters (`-Wunused-parameter`)

- Preferred: annotate with `[[maybe_unused]]` on the parameter.
- Alternative: cast to void at the start of the function body.

```cpp
// Option A — attribute
void callback([[maybe_unused]] int eventId) { ... }

// Option B — void cast
void callback(int eventId) {
    (void)eventId;
    ...
}
```

#### Unreachable code (`-Wunreachable-code`)

Do **not** simply delete unreachable code. Investigate first — it often
indicates a logic error (early return, inverted condition, dead branch).
Document the finding before removing.

### 5. Deprecated and Non-Standard Features

#### Dynamic exception specifications

Replace `throw(ExType)` with `noexcept` (if the function truly never
throws) or remove the specification entirely. Dynamic exception
specifications were removed in C++17.

```cpp
// Before
void parse() throw(ParseError);

// After — if it may throw
void parse();

// After — if it truly never throws
void parse() noexcept;
```

#### `register` storage class

Remove the `register` keyword. It has no effect in C++17 and later and is
an error in C++20.

```cpp
// Before
register int counter = 0;

// After
int counter = 0;
```

#### Non-standard extensions

Replace compiler-specific extensions with ISO C++ equivalents:

| Extension                 | Standard Replacement         |
|---------------------------|------------------------------|
| `__attribute__((unused))` | `[[maybe_unused]]`           |
| `__attribute__((fallthrough))` | `[[fallthrough]]`       |
| `__declspec(deprecated)`  | `[[deprecated("reason")]]`   |
| Zero-length arrays        | `std::array` or flexible member (C only) |

### 6. Pragma Suppression Handling

If a diagnostic is preceded by `#pragma warning(suppress: XXXX)`:

1. **Remove** the `#pragma warning(suppress: ...)` line.
2. **Apply** the proper fix from the relevant rule above.
3. **Verify** the diagnostic no longer fires without the pragma.

Suppressions are not fixes — they hide the problem. The only acceptable
suppression is for a verified **False Positive** (see Rule 1), and it must
include a comment explaining why.

```cpp
// Acceptable — documented false positive
#pragma warning(suppress: 4127) // intentional constant condition for compile-time branch
while (true) { ... }
```

### 7. Structured Diagnostic Analysis

When processing a batch of diagnostics from compiler output:

1. **Group** all diagnostics by diagnostic code or warning flag.
2. **Consolidate** instances that share the same root cause (e.g., a
   macro expansion producing the same warning in many call sites).
3. **Process** one diagnostic type at a time, across all files, before
   moving to the next type.
4. **Track progress** throughout the pass:
   - Files processed
   - Fixes applied
   - Fixes reverted (if a fix introduced a new diagnostic)

## Self-Verification

- [ ] Every fix matches the specific diagnostic type's resolution strategy
- [ ] Shadowing fixes rename the correct scope (outer, not inner)
- [ ] No drive-by modernization or refactoring beyond the diagnostic
- [ ] Pragma suppressions removed and replaced with proper fixes
- [ ] No new warnings introduced by the fixes applied
- [ ] Enum conversions use semantically correct values, not blind casts
