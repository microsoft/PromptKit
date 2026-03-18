<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) Standard Prompt Library Contributors -->

---
name: iterative-refinement
type: reasoning
description: >
  Protocol for revising documents through iterative feedback cycles
  while preserving structural integrity, numbering, cross-references,
  and internal consistency.
applicable_to:
  - interactive-design
  - author-requirements-doc
  - author-design-doc
  - author-validation-plan
---

# Protocol: Iterative Refinement

Apply this protocol when revising a previously generated document based
on user feedback. The goal is to make precise, justified changes without
destroying the document's structural integrity.

## Rules

### 1. Structural Preservation

When revising a document:

- **Preserve requirement/finding IDs.** Do NOT renumber existing items.
  If items are removed, retire the ID (do not reuse it). If items are
  added, append new sequential IDs.
- **Preserve cross-references.** If requirement REQ-EXT-003 references
  REQ-EXT-001, and REQ-EXT-001 is modified, verify the cross-reference
  still holds. If it does not, update both sides.
- **Preserve section structure.** Do not reorder, merge, or remove
  sections unless explicitly asked. If a section becomes empty after
  revision, state "Removed per review — [rationale]."

### 2. Change Justification

For every change made:

- **State what changed**: "Modified REQ-EXT-003 to add a nullability
  constraint."
- **State why**: "Per reviewer feedback that the return type must
  account for NULL pointers in error cases."
- **State the impact**: "This also affects REQ-EXT-007 which previously
  assumed non-null returns. Updated REQ-EXT-007 accordingly."

### 3. Non-Destructive Revision

- **Do NOT rewrite the entire document** in response to localized
  feedback. Make surgical changes.
- **Do NOT silently change** requirements, constraints, or assumptions
  that were not part of the feedback. If a change to one requirement
  logically implies changes to others, flag them explicitly:
  "Note: modifying REQ-EXT-003 also requires updating REQ-EXT-007
  and ASM-002. Proceeding with all three changes."
- **Do NOT drop content** without explicit agreement. If you believe
  a requirement should be removed, propose removal with justification
  rather than silently deleting.

### 4. Consistency Verification

After each revision pass:

1. Verify all cross-references still resolve correctly.
2. Verify that the glossary covers all terms used in new/modified content.
3. Verify that the assumptions section reflects any new assumptions
   introduced by the changes.
4. Verify the revision history is updated with the change description.

### 5. Revision History

Append to the document's revision history after each revision:

```
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.1     | ...  | ...    | Modified REQ-EXT-003 (nullability). Updated REQ-EXT-007. Added ASM-005. |
```
