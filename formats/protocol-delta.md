<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: protocol-delta
type: format
description: >
  Output format for protocol specification amendments. Supports three
  presentation styles: amendment document (section-by-section changes),
  redline view (old vs. new text), and standalone revised specification.
  Tracks normative language changes, backward compatibility, and
  cross-reference updates.
produces: protocol-delta
consumes: requirements-document
---

# Format: Protocol Delta

The output MUST be a structured protocol amendment document. The user
selects the presentation style (amendment, redline, or standalone) via
the template's `output_style` parameter; the document structure adapts
accordingly but always includes the metadata sections.

## Document Structure

```markdown
# <Protocol Name> — Protocol Delta

## 1. Amendment Summary
<2–4 sentences: what is being changed, why, and the overall impact
on existing implementations. Classify the highest-severity change
category (using the protocol-change-categories taxonomy) present
in this delta.>

## 2. Scope and Applicability
- **Base specification**: <RFC number, spec version, or document title
  being amended>
- **Presentation style**: Amendment Document | Redline | Standalone
  Revised Specification
- **Affected protocol roles**: <e.g., client, server, intermediary, all>
- **Backward compatibility**: Compatible | Requires negotiation |
  Incompatible
- **Supersedes**: <list of errata, previous amendments, or
  internet-drafts this delta replaces, if any>

## 3. Change Register

<Table summarizing all changes:

| Change ID | Section | Category | Summary | Severity |
|-----------|---------|----------|---------|----------|
| CHG-001   | 3.4     | PC5      | Add CLOSING state | High |
| CHG-002   | 4.1     | PC2      | Clarify idle timeout measurement | Low |>

## 4. Detailed Changes

### CHG-<NNN>: <Short Title>
- **Section**: <section number(s) in the base specification>
- **Category**: <PC1–PC8 from protocol-change-categories taxonomy>
- **Normative keyword changes**: <e.g., SHOULD → MUST, new MUST added,
  none>
- **Rationale**: <why this change is needed — reference to errata, bug
  report, interoperability issue, new requirement, etc.>
- **Backward compatibility**: <specific impact on existing
  implementations>

#### Amendment View (when output_style = amendment)
**Current text** (from base specification):
> <quoted text being replaced or modified>

**Amended text**:
> <new text, with normative keywords in UPPERCASE>

**Editor's note**: <optional clarification of intent>

#### Redline View (when output_style = redline)
> ~~old text with deletions struck through~~ **new text in bold**

#### Standalone View (when output_style = standalone)
<Full revised section text incorporating the change. No diff markers —
reads as the new normative text.>

#### Cross-Reference Updates
- <list of other sections, requirements, or state machine diagrams
  that must be updated to reflect this change>

#### Affected Requirements
- <REQ-IDs from an existing requirements document that are modified,
  added, or invalidated by this change. If no requirements document
  exists, state "No existing requirements document provided.">

## 5. State Machine Updates
<If any changes affect the protocol's state machine, provide:
- Updated state table or diagram
- New/modified states, transitions, guards, and actions
- Comparison with the base specification's state machine

If no state machine changes, state "No state machine changes in this
delta.">

## 6. Message Format Updates
<If any changes affect wire formats, provide:
- Updated message format diagrams or field tables
- New/modified fields with type, size, encoding, and valid values
- Comparison with the base specification's message formats

If no message format changes, state "No message format changes in this
delta.">

## 7. IANA Considerations
<If any changes require IANA registry updates (new code points, new
registries, modified registration policies), list them here.
If no IANA considerations, state "No IANA considerations.">

## 8. Security Considerations
<If any changes affect the protocol's security properties, describe:
- How the security model changes
- New threats introduced or mitigated
- Transition risks (e.g., downgrade attacks during deployment)

If no security impact, state "No security considerations beyond those
in the base specification.">

## 9. Migration and Deployment
<Guidance for implementers:
- What must change in existing implementations
- Recommended deployment sequence (if coordinated rollout is needed)
- Version negotiation or feature detection mechanisms
- Transition period considerations>

## 10. Consistency Verification
<Self-check results:
- All cross-references updated? (list any that changed)
- State machine still complete? (no unreachable or deadlock states)
- No conflicting normative statements introduced?
- IANA registrations consistent with protocol text?
- Security considerations updated for all PC7 changes?>

## 11. Open Questions
<Unresolved design decisions, ambiguities, or items needing working
group / community input. For each: what is unresolved, the options,
and the consequences of each option.>

## 12. Revision History
<Table: | Version | Date | Author | Changes |>
```

## Formatting Rules

- Changes MUST be ordered by section number in the base specification,
  not by severity.
- Every change MUST have a category from the protocol-change-categories
  taxonomy.
- Every change MUST state its backward compatibility impact explicitly.
- Normative keyword changes (MUST, SHOULD, MAY) MUST be highlighted —
  these are the highest-signal elements for reviewers.
- Quoted text from the base specification MUST be exact — do not
  paraphrase the original.
- The consistency verification section MUST NOT be omitted — it is the
  self-check that catches cascading errors.
- If a section has no applicable content, state "None" or "Not
  applicable" — do NOT omit the section.
