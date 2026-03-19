<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: implementation-plan
type: format
description: >
  Output format for implementation and refactoring plans. Defines
  section structure for task breakdown, dependency ordering, risk
  assessment, and verification strategy.
produces: implementation-plan
---

# Format: Implementation Plan

The output MUST be a structured implementation plan with the following
sections in this exact order. Do not omit sections — if a section has no
content, state "None identified" with a brief justification.

## Document Structure

```markdown
# <Plan Title> — Implementation Plan

## 1. Overview
<1–3 paragraphs: what is being implemented or refactored, why,
and what the end state looks like. Include the goal, scope, and
any driving requirements or design documents.>

## 2. Current State
<Description of the starting point:
- What exists today (code, infrastructure, processes)
- What works and what doesn't
- Key assumptions about the current state

For greenfield projects, state "Greenfield — no existing implementation."
For refactoring, provide a behavioral summary of the current code.>

## 3. Prerequisites
<What must be true before work begins:
- Required documents (requirements, design)
- Environment setup
- Dependencies on other teams or systems
- Decisions that must be made first>

## 4. Plan

### Phase <N>: <Phase Name>

#### TASK-<NNN>: <Task Title>
- **Description**: <what to implement or change>
- **Requirements**: <REQ-IDs addressed, if available>
- **Dependencies**: <TASK-IDs that must complete first, or "None">
- **Acceptance Criteria**: <how to verify completion>
- **Complexity**: Small / Medium / Large
- **Risks**: <what could go wrong with this task>
- **Verification**: <how to confirm correctness after this task>
- **Rollback**: <how to undo this change if needed>

<Repeat for each task. Group tasks into phases representing
logical milestones or deliverables.>

## 5. Dependency Graph
<Text-based diagram (Mermaid, ASCII, or structured list) showing
task dependencies and the critical path. Identify which sequence
of dependent tasks determines the minimum time to completion.>

## 6. Risk Assessment
| Risk ID | Description | Likelihood | Impact | Mitigation |
|---------|-------------|-----------|--------|------------|
| RISK-001 | ... | High/Med/Low | High/Med/Low | ... |

## 7. Verification Strategy
<How to confirm the plan is complete and correct:
- What tests should pass at each phase boundary
- Integration or end-to-end verification approach
- How to validate the final state matches the target>

## 8. Open Questions
<Decisions that need to be made before or during implementation.
For each: what is unknown, why it matters, and who can resolve it.>

## 9. Revision History
<Table: | Version | Date | Author | Changes |>
```

## Formatting Rules

- Tasks MUST be ordered by dependency, not by perceived importance.
- Every task MUST have acceptance criteria (how to know it is done).
- Every task MUST have a complexity estimate (Small / Medium / Large).
- The critical path MUST be identified in the dependency graph.
- Tasks MUST use stable identifiers: `TASK-<NNN>` with sequential numbering.
- Cross-references between tasks use the task ID
  (e.g., "depends on TASK-003").
- Phases represent logical milestones — each phase should be
  independently demonstrable or deployable where possible.
