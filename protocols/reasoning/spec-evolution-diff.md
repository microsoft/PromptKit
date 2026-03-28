<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: spec-evolution-diff
type: reasoning
description: >
  Systematic methodology for comparing two versions of a specification
  at the invariant level. Extracts invariants from both versions, aligns
  them, classifies each delta by type and backward-compatibility impact,
  and produces migration guidance.
applicable_to:
  - diff-specifications
---

# Protocol: Specification Evolution Diff

Apply this protocol when comparing two versions of a specification to
understand what changed at the requirements and invariant level. The
goal is not a textual diff — it is a **semantic diff** that classifies
every change by its impact on existing implementations and tests.

## Phase 1: Parallel Invariant Extraction

Extract the invariant set from each specification version.

1. **For each version** (old and new), systematically extract all
   enforceable invariants by scanning every normative section:
   - Value constraints (bounds, ranges, sizes)
   - Behavioral constraints (required/prohibited behaviors)
   - Ordering constraints (sequencing requirements)
   - Timing constraints (deadlines, timeouts, rates)
   - Resource constraints (limits, quotas, capacities)
   - State machines (states, transitions, guards, actions)
   - Error conditions (triggers, responses, recovery)

2. **Assign stable identifiers** to each invariant. Use section
   references and semantic content to enable cross-version matching.
   If both versions use REQ-IDs, preserve them. If not, generate
   synthetic IDs based on section + subject.

3. **Record the keyword strength** of each invariant (MUST/SHOULD/MAY)
   in both versions. Strength changes are a key signal.

4. **Extract state machines** from both versions if present. Record
   the full state transition table for each.

## Phase 2: Cross-Version Alignment

Match invariants across versions to identify what changed.

1. **Match by identifier**: If both versions use the same REQ-IDs,
   section numbers, or named constraints, align them directly.

2. **Match by semantic equivalence**: For invariants without stable
   identifiers, match by subject matter and constraint type. Two
   invariants match if they constrain the same aspect of the same
   entity, even if the wording differs.

3. **Classify each invariant into one of four sets**:
   - **Unchanged**: Present in both versions with the same keyword
     strength and semantically equivalent constraint text.
   - **Modified**: Present in both versions but with different
     constraint text, keyword strength, or scope.
   - **Added**: Present in the new version only.
   - **Removed**: Present in the old version only.

4. **For state machines**, build a transition-level diff:
   - States added or removed
   - Transitions added, removed, or modified (different guards,
     actions, or target states)
   - State invariants changed

5. **Flag ambiguous matches**: If a single old invariant maps to
   multiple new invariants (split), or multiple old invariants map to
   a single new one (merge), flag this explicitly — splits and merges
   are high-risk changes.

## Phase 3: Change Classification

For each modified, added, or removed invariant, classify the change.

### Change Types

- **ADDED**: A new invariant not present in the old version. An
  existing implementation may or may not satisfy it by accident.
  - Subtype: `ADDED_MUST` — new mandatory requirement. Likely requires
    implementation changes.
  - Subtype: `ADDED_SHOULD` — new advisory requirement. May not
    require changes but shifts best practice.

- **REMOVED**: An invariant from the old version is absent in the new.
  Implementations relying on this behavior lose their specification
  backing.
  - Subtype: `REMOVED_WITH_REPLACEMENT` — another invariant covers
    the same concern differently.
  - Subtype: `REMOVED_WITHOUT_REPLACEMENT` — the concern is no longer
    addressed. Higher risk.

- **TIGHTENED**: An invariant became more restrictive.
  - SHOULD → MUST (advisory becomes mandatory)
  - Bound narrowed (e.g., timeout reduced from 60s to 30s)
  - Optional behavior becomes required
  - Existing compliant implementations may become non-compliant.

- **RELAXED**: An invariant became less restrictive.
  - MUST → SHOULD (mandatory becomes advisory)
  - Bound widened (e.g., max size increased from 1500 to 9000)
  - Required behavior becomes optional
  - Existing compliant implementations remain compliant.

- **MODIFIED**: An invariant changed in a way that is neither strictly
  tightening nor relaxing — the constraint shifted laterally.
  - Different error code for the same condition
  - Different state machine path to the same outcome
  - Changed scope (applies to different entities)
  - Requires case-by-case impact analysis.

- **CLARIFIED**: The invariant's intent is unchanged, but ambiguous
  language was resolved. One interpretation is confirmed; others are
  excluded. Implementations that chose the now-excluded interpretation
  must change.

### For each change, record:
- Change type (from the list above)
- Old invariant text and source location
- New invariant text and source location (if applicable)
- Keyword strength change (e.g., SHOULD → MUST)
- Which spec sections are involved

## Phase 4: Backward Compatibility Assessment

For each change classified in Phase 3, assess the impact on existing
implementations and tests.

1. **Will existing implementations break?**
   - ADDED_MUST: Yes, unless they accidentally comply.
   - REMOVED_WITHOUT_REPLACEMENT: Possibly — implementations may
     depend on the removed behavior.
   - TIGHTENED: Yes, if implementations used the previously-allowed
     flexibility.
   - RELAXED: No — existing implementations remain compliant.
   - CLARIFIED: Only if the implementation chose the now-excluded
     interpretation.
   - MODIFIED: Case by case.

2. **Is there a migration path?**
   - Can implementations support both old and new versions during
     transition?
   - Does the new version define a negotiation or versioning mechanism?
   - Is a "big bang" update required, or can changes be adopted
     incrementally?

3. **What tests are affected?**
   - Tests that validate removed invariants need updating or removal.
   - Tests for tightened invariants need stricter assertions.
   - New tests needed for added invariants.
   - Tests for clarified invariants may need to add negative cases
     (testing the excluded interpretation is rejected).

4. **Assign a compatibility verdict** to each change:
   - **Backward-compatible**: Existing implementations remain
     compliant without changes.
   - **Conditionally compatible**: Existing implementations remain
     compliant if they made certain choices (document the condition).
   - **Backward-incompatible**: Existing implementations must change
     to comply with the new version.

## Phase 5: Migration Guidance

For each backward-incompatible or conditionally compatible change,
produce actionable migration guidance.

1. **What must change**: Specific implementation behavior, data
   structure, or configuration that must be updated.

2. **How to change it**: Concrete steps — not vague advice. Reference
   the new spec language that defines the required behavior.

3. **Verification**: How to confirm the change was made correctly —
   what test would pass under the new spec and fail under the old.

4. **Risk during transition**: What happens if some implementations
   update and others don't? Can old and new versions interoperate, or
   does partial deployment cause failures?

5. **Prioritize by risk**: Order migration items by the severity of
   the compatibility break, not by the order they appear in the spec.

## Phase 6: Cross-Change Interaction Analysis

Individual changes may each be manageable, but their **interaction**
may create unexpected effects.

1. **Identify coupled changes**: Changes that affect the same state
   machine, the same data structure, or the same execution path.

2. **Check for emergent incompatibilities**: Two individually
   backward-compatible changes that together create a
   backward-incompatible situation.

3. **Check for migration ordering dependencies**: Does change A need
   to be implemented before change B? Would implementing B first break
   something that A fixes?

4. **Document interaction findings** as separate entries — these are
   often the highest-risk items because they are easy to miss when
   reviewing changes individually.
