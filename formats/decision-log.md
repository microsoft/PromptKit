<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: decision-log
type: format
description: >
  Lightweight architectural decision record (ADR) format. Records
  significant design decisions with context, options considered,
  rationale, and consequences. Agent-consumable and human-readable.
produces: decision-log
---

# Format: Decision Log

The output MUST be a decision log document with one or more decision
entries in the following structure. Each entry records a single
significant design decision. Decisions are appended chronologically.

If a section has no content, state "None identified" — never omit
a section.

## Document Structure

```markdown
# Decision Log — {{project-or-component-name}}

## Decision: [Title]

**Date**: YYYY-MM-DD
**Status**: Proposed | Accepted | Deprecated | Superseded by [Decision Title]
**Deciders**: [who made or approved this decision]

### Context

What situation, problem, or requirement prompted this decision? Include
relevant constraints, forces, and prior art. Be specific enough that a
reader unfamiliar with the project history can understand why a decision
was needed.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Option A — [name] | [advantages] | [disadvantages] |
| Option B — [name] | [advantages] | [disadvantages] |
| Option C — [name] | [advantages] | [disadvantages] |

### Decision

State the chosen option clearly and unambiguously.

### Rationale

Why was this option chosen over the alternatives? Reference specific
constraints, evidence, benchmarks, or principles that drove the choice.
Distinguish between "we chose this because X" and "we chose this
despite Y" — both are important.

### Consequences

What follows from this decision? Include:

- **Positive**: What becomes easier, simpler, or more reliable.
- **Negative**: What becomes harder, constrained, or deferred.
- **Neutral**: What changes but is neither better nor worse.
- **Follow-up actions**: Work items, future decisions, or reversibility
  notes created by this decision.
```

## Structural Rules

1. **One decision per entry.** Do not bundle multiple decisions.
2. **Chronological order.** New decisions are appended at the end.
3. **Immutable once accepted.** Do not edit accepted decisions — instead,
   add a new decision that supersedes the old one and update the old
   entry's Status to `Superseded by [Decision Title]`.
4. **Options table is mandatory.** Even if the decision seems obvious,
   document at least one alternative considered (including "do nothing").
5. **Consequences must include negatives.** Every decision has tradeoffs.
   If no negative consequences are identified, the analysis is incomplete.

## When to Record a Decision

Record a decision when:

- It affects the system's architecture, API surface, or data model.
- It constrains future choices (technology selection, protocol choice).
- It was debated — multiple reasonable options existed.
- A future contributor might ask "why was it done this way?"

Do NOT record decisions about:

- Routine implementation choices with no architectural impact.
- Style or formatting preferences (these belong in coding standards).
- Temporary workarounds (these belong in issue trackers).
