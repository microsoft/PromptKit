<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: clone-discipline-rust
type: analysis
description: >
  Rust review protocol for challenging unnecessary or high-cost cloning.
  Covers borrow-first alternatives, loop and closure clone hotspots,
  Option/Result extraction patterns, and false-positive suppression when
  ownership-preserving clones are the clearer design.
language: Rust
applicable_to: []
# User-composed protocol — not auto-included by any template.
# Intended for: Rust code review, PR review, and maintainability audits
# where ownership workarounds may hide better borrowing or sharing designs.
---

# Protocol: Clone Discipline Review (Rust)

Apply this protocol when reviewing Rust code for unnecessary or
high-cost cloning. The goal is to distinguish clones that preserve a
clear ownership boundary from clones that merely silence the borrow
checker or duplicate expensive data without need.

## Phase 1: Clone Inventory

Build an explicit inventory before judging any clone site.

1. Enumerate each `.clone()` call added or materially modified in the
   reviewed scope.
2. For each site, record:
   - The cloned type
   - Whether the site is on a hot path (loop, retry path, async fan-out,
     per-request handler)
   - Whether the clone is on owned data, `Option<T>`, `Result<T, E>`,
     collection types, or shared ownership wrappers (`Arc`, `Rc`)
3. Group related clones that serve the same purpose so they can be
   judged together rather than as isolated lines.

## Phase 2: Borrow-First Necessity Check

For each clone site, determine whether borrowing or view-based access
would preserve the intended behavior.

1. Ask what ownership transition the clone is enabling:
   - Passing read-only data to a callee
   - Iterating a collection
   - Accessing data inside `Option` / `Result`
   - Capturing data inside a closure or async block
2. Check for a borrow-based alternative:
   - Pass `&T`, `&mut T`, `&str`, or slices instead of cloning owned data
   - Iterate with references (`iter`, `iter_mut`, `for x in &items`) instead
     of cloning the whole collection
   - Use `as_ref`, `as_mut`, `as_deref`, pattern matching, or references
     into `Option` / `Result` rather than cloning to call `unwrap`
   - Prefer view conversions (`as_str`, `as_slice`) when only inspection
     is required
3. Flag the clone when a borrow-first alternative exists and does not
   change the surrounding ownership contract.

## Phase 3: Cost and Frequency Assessment

Not all clones have the same impact. Evaluate runtime and maintenance
cost, not just syntax.

1. Classify the cloned value:
   - **Low-cost**: trivially small structs, handles, shared ownership
     wrappers cloned intentionally via `Arc::clone` / `Rc::clone`
   - **Potentially high-cost**: `String`, `Vec`, `HashMap`, large structs,
     buffers, ASTs, config graphs, request/response payloads
2. Increase severity when the clone occurs:
   - Inside loops or iterator pipelines
   - In async fan-out or repeated task spawning
   - On error-retry paths or frequently invoked request handlers
   - Multiple times along the same call chain for the same value
3. If the data must be read from multiple spawned tasks without mutation,
   check whether shared ownership (`Arc<T>` plus `Arc::clone`) is the
   correct design instead of deep-cloning the payload.

## Phase 4: Ownership-Structure Review

Determine whether the clone is compensating for a deeper API or data-flow
problem.

1. Check whether the callee takes owned input when it only reads data.
   If so, recommend tightening the callee signature before accepting the
   clone at call sites.
2. Check whether the clone exists only because a function mixes unrelated
   responsibilities or holds a borrow for too long. If yes, note the
   structural cause, not just the local clone.
3. When several sibling functions repeat the same clone pattern, treat it
   as an API design issue rather than independent local nits.

## Phase 5: False-Positive Suppression

Do NOT flag every clone. Suppress findings when the clone is a deliberate,
clear ownership boundary and the alternatives would be worse.

1. Do not flag clones that would require pervasive lifetime propagation
   across unrelated APIs or stored structs merely to avoid a single,
   localized owned value.
2. Do not flag intentional shared-ownership clones written as
   `Arc::clone(&value)` or `Rc::clone(&value)` when the underlying data is
   being shared, not duplicated.
3. Do not flag clones used to establish durable ownership at external
   boundaries (config loading, FFI conversion, message handoff) when the
   receiving side must own the data.
4. Downgrade or suppress findings for cheap clones when the alternative is
   materially less readable and no hot-path or structural cost exists.

## Output Format

For each finding, report:

```text
[SEVERITY: High|Medium|Low]
Location: <file>:<line> or <function/module>
Clone site: <type and expression cloned>
Issue: <why the clone is unnecessary or too costly>
Better pattern: <borrow / iterator / Option-Result view / shared ownership alternative>
Evidence: <code path showing why the clone is avoidable>
Confidence: <High|Medium|Low>
```

## Review Heuristics

- Prefer owned clones at clear subsystem or thread boundaries over
  lifetime-heavy signatures that spread borrow complexity everywhere.
- Prefer `Arc::clone` / `Rc::clone` spelling when shared ownership is
  intentional; it makes review intent obvious.
- Treat repeated clones as a design smell first and a micro-optimization
  concern second.
