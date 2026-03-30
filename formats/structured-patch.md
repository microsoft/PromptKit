<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: structured-patch
type: format
description: >
  Output format for traceable, structured patches to existing artifacts.
  Each change entry links to its upstream motivation, enabling full
  traceability from requirements through design, validation, and
  implementation. Domain-agnostic — works for specifications, code,
  schematics, test plans, or any versioned artifact.
produces: structured-patch
---

# Format: Structured Patch

Use this format when producing **incremental changes** to existing artifacts
rather than generating documents from scratch.  Every change MUST trace to
an upstream motivation (a requirement change, a design decision, a user
request) so reviewers can verify alignment at each transition.

## Document Structure

```markdown
# <Patch Title>

## 1. Change Context
## 2. Change Manifest
## 3. Detailed Changes
## 4. Traceability Matrix
## 5. Invariant Impact
## 6. Application Notes
```

## 1. Change Context

Provide the context for this patch set:

- **Upstream artifact**: what motivated these changes (e.g., requirements
  patch, design revision, user request)
- **Target artifacts**: what is being changed (e.g., design document,
  validation plan, source code, schematic)
- **Scope**: what areas are affected and what is explicitly unchanged

## 2. Change Manifest

A summary table of all changes in this patch:

```markdown
| Change ID  | Type   | Target Artifact | Section / Location | Summary             |
|------------|--------|-----------------|--------------------|---------------------|
| CHG-001    | Add    | design-doc      | §3.2 API Layer     | New endpoint for... |
| CHG-002    | Modify | validation-plan | TC-012             | Update expected...  |
| CHG-003    | Remove | design-doc      | §4.1 Legacy API    | Remove deprecated...|
```

**Change types**:
- **Add** — new content that did not previously exist
- **Modify** — alteration of existing content
- **Remove** — deletion of existing content

## 3. Detailed Changes

For each change in the manifest, provide a detailed entry:

```markdown
### CHG-<NNN>: <Short Title>

- **Type**: Add | Modify | Remove
- **Upstream ref**: <ID of the upstream change that motivates this — e.g.,
  REQ-FUNC-005, CHG-003 from requirements patch, user request>
- **Target**: <artifact and section/location being changed>
- **Rationale**: <why this change is necessary to maintain alignment>

#### Before

<existing content being changed, or "N/A — new content" for additions>

#### After

<new content, or "N/A — content removed" for removals>

#### Impact

<what downstream artifacts may need updates as a result of this change>
```

**Rules for detailed changes**:

- Every change MUST have an upstream ref.  If the change is motivated by
  the user's direct request (not a downstream propagation), use
  `USER-REQUEST: <summary of what the user asked for>`.
- Before/After sections MUST show enough context to apply the change
  unambiguously.  For code or structured documents, include surrounding
  lines or section headers.
- For modifications, clearly mark what changed between Before and After.
  Use **bold** for inserted text and ~~strikethrough~~ for removed text
  when showing inline diffs in prose.

## 4. Traceability Matrix

Map every upstream change to its downstream changes:

```markdown
| Upstream Ref      | Downstream Changes          | Status    |
|-------------------|-----------------------------|-----------|
| REQ-FUNC-005      | CHG-001, CHG-002            | Complete  |
| REQ-PERF-002      | CHG-003                     | Complete  |
| USER-REQUEST: ... | CHG-004                     | Partial   |
```

**Status values**:
- **Complete** — all necessary downstream changes are included
- **Partial** — some downstream changes are deferred (explain in notes)
- **Blocked** — downstream changes cannot be made yet (explain why)

## 5. Invariant Impact

For each invariant or constraint affected by this patch set:

```markdown
| Invariant / Constraint | Effect                | Verification          |
|------------------------|-----------------------|-----------------------|
| CON-SEC-001: All...    | Unchanged — preserved | Existing TC-008 valid |
| ASM-003: Network...    | Modified — relaxed    | New TC-025 added      |
| INV-PERF-002: Resp...  | Unchanged — preserved | No action needed      |
```

If no invariants are affected, state explicitly:
`No existing invariants or constraints are affected by this patch set.`

## 6. Application Notes

Instructions for applying this patch:

- **Method**: how to apply (e.g., "apply as git diff", "manually update
  sections", "replace schematic sheet 3")
- **Order**: if changes must be applied in a specific sequence
- **Verification**: how to verify the patch was applied correctly
- **Rollback**: how to revert if needed

## Formatting Rules

1. Change IDs MUST use the format `CHG-<NNN>` with zero-padded
   three-digit numbers, sequential within the patch.
2. Every change MUST have exactly one upstream ref.
3. The traceability matrix MUST account for every upstream change —
   no upstream change may be silently dropped.
4. Before/After sections MUST be unambiguous — a reviewer should be
   able to locate and apply the change without additional context.
5. The invariant impact section MUST be present even if empty
   (state "no invariants affected" explicitly).
6. Sections MUST appear in the order specified above.
