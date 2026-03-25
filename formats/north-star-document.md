<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: north-star-document
type: format
description: >
  Output format for strategic north-star and architectural vision
  documents. Describes the desired end state, guiding principles,
  and transition considerations — not the implementation plan.
produces: north-star-document
---

# Format: North-Star Document

The output MUST be a free-form Markdown document aimed at a dual
audience: engineering teams (who need substantive technical depth)
and cross-team leadership (who need accessible strategic framing).

Use the following section structure as the **minimum required skeleton**.
All numbered top-level sections MUST appear in this order; if a section has no
substantive content, include the heading and write `None identified` rather
than omitting it. You MAY add subsections or additional sections if helpful.

## Document Structure

```markdown
# <Subject> — North-Star Document

## 1. Executive Summary
<One-paragraph distillation of the vision: what the target state is,
why it matters, and what changes from the status quo. A reader who
reads only this paragraph should understand the strategic direction.>

## 2. Problem Statement / Motivation
<Why the current state is insufficient. Concrete pain points,
architectural limitations, user-facing symptoms, or strategic
pressures that motivate the change. Ground in evidence.>

## 3. Current State
<How things work today. Describe the architecture, data flows,
and operational model at a level sufficient to understand what
must change. Highlight pain points inline.>

## 4. Vision / Target State
<The desired end state. Describe the target architecture, key
abstractions, and user-visible properties. Focus on outcomes
and invariants, not implementation details.

Include text-based diagrams (ASCII, Mermaid, or PlantUML) where
they clarify the target architecture.>

## 5. Key Design Principles
<Architectural principles that guide the vision. Each principle
should be:
- **Named**: a short, memorable label
- **Defined**: what the principle means in this context
- **Justified**: why this principle was chosen over alternatives
- **Bounded**: where the principle does and does not apply>

## 6. Transition Considerations
<How to get from current state to target state. Address:
- Migration strategy (big-bang vs. incremental)
- Backward compatibility requirements
- Intermediate states and their properties
- Dependencies on other teams or systems
- What can be done in parallel vs. what must be sequential

This section describes the shape of the transition, not the
implementation plan or timeline.>

## 7. Risks and Open Questions
<Honest accounting of unknowns. For each item:
- What is unknown or uncertain
- Why it matters
- What would resolve it (investigation, decision, experiment)
- Impact of leaving it unresolved>

## 8. Assumptions Log
<Consolidated list of all assumptions made in the document.
Every [ASSUMPTION] tag in the body must have a corresponding
entry here. For each:
- The assumption
- Why it is reasonable
- What would invalidate it
- Impact if invalidated>

## 9. Sources Consulted
<List of all documents, meeting notes, prior artifacts, and
conversations referenced. For each source, note what information
was drawn from it.>
```

## Formatting Rules

- The document describes **vision and architectural direction**, not
  implementation plans, API designs, or code-level details.
- Every substantive paragraph MUST be traceable to a source document
  or an explicit epistemic label (`[ASSUMPTION]`, `[INFERRED]`,
  `[UNKNOWN]`).
- Use headings, bullet points, and diagrams as needed. Write for
  clarity, not length.
- Diagrams SHOULD use text-based formats (Mermaid, PlantUML, ASCII)
  for version control compatibility.
- Calibrate technical depth for the dual audience: engineers should
  find it substantive, leadership should find it accessible.
- Prefer hedged language ("this is intended to enable", "the
  expectation is that") over assertive language ("this will enable",
  "this guarantees") unless backed by evidence.
- Non-goals SHOULD be stated explicitly so the reader understands
  what the document deliberately does not address.
