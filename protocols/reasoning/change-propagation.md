<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: change-propagation
type: reasoning
description: >
  Systematic reasoning protocol for propagating changes through artifact
  layers while maintaining alignment.  Ensures every upstream change
  produces the correct downstream changes, no invariants are broken,
  and no changes are silently dropped.  Domain-agnostic — works for
  specifications, code, schematics, test plans, or any layered artifacts.
applicable_to:
  - generate-spec-changes
  - generate-implementation-changes
  - dev-workflow
---

# Protocol: Change Propagation

Apply these phases **in order** when deriving downstream changes from
upstream changes.  Do not skip phases.

## Phase 1: Impact Analysis

For each upstream change, determine which downstream artifacts are affected:

1. **Direct impact** — downstream sections that explicitly reference or
   implement the changed upstream content.
2. **Indirect impact** — downstream sections that depend on assumptions,
   constraints, or invariants affected by the upstream change.
3. **No impact** — downstream sections verified to be unaffected.
   State WHY they are unaffected (do not silently skip).

Produce an impact map:

```
Upstream CHG-<NNN> →
  Direct:   [list of downstream locations]
  Indirect: [list of downstream locations]
  Unaffected: [list with rationale]
```

## Phase 2: Change Derivation

For each impacted downstream location:

1. Determine the **minimal necessary change** — the smallest modification
   that restores alignment with the upstream change.
2. Classify the change type: Add, Modify, or Remove.
3. Draft Before/After content showing the exact change.
4. Record the upstream ref that motivates this downstream change.

**Constraints**:
- Do NOT introduce changes beyond what the upstream change requires.
  If you identify an improvement opportunity unrelated to the upstream
  change, note it separately as a recommendation — do not include it
  in the patch.
- Do NOT silently combine multiple upstream changes into one downstream
  change.  If two upstream changes affect the same downstream location,
  create separate change entries (they may be applied together, but
  traceability requires distinct entries).

## Phase 3: Invariant Check

For every existing invariant, constraint, and assumption in the
downstream artifact:

1. Verify it is **preserved** by the combined set of downstream changes.
2. If an invariant is **modified** by the changes, flag it explicitly
   and verify the modification is justified by the upstream change.
3. If an invariant is **violated** by the changes, STOP and report
   the conflict.  Do not proceed with a patch that breaks invariants
   without explicit acknowledgment.

## Phase 4: Completeness Check

Verify that every upstream change has at least one corresponding
downstream change (or an explicit "no downstream impact" justification):

1. Walk the upstream change manifest entry by entry.
2. For each upstream change, confirm it appears in the traceability
   matrix with status Complete, Partial (with explanation), or
   No-Impact (with rationale).
3. Flag any upstream change that has no downstream entry as
   **DROPPED** — this is an error that must be resolved before
   the patch is finalized.

## Phase 5: Conflict Detection

Check for conflicts within the downstream change set:

1. **Internal conflicts** — two downstream changes that modify the
   same location in contradictory ways.
2. **Cross-artifact conflicts** — a change in one downstream artifact
   that contradicts a change in another (e.g., a design change that
   conflicts with a validation change).
3. **Upstream-downstream conflicts** — a downstream change that
   contradicts the intent of its upstream motivator.

For each conflict found:
- Describe the conflicting changes
- Identify the root cause (usually an ambiguity or gap in the upstream)
- Recommend resolution
