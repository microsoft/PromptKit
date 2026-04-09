<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: plan-implementation
description: >
  Decompose a feature or project into an actionable implementation plan
  with tasks, dependencies, and risk assessment. Supports two modes:
  "implementation" (new feature/project) and "refactoring" (safe,
  incremental transformation of existing code).
persona: software-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: implementation-plan
params:
  project_name: "Name of the project, feature, or refactoring effort"
  mode: "Planning mode — 'implementation' (default) for new work, or 'refactoring' for incremental transformation of existing code"
  requirements_doc: "(implementation mode) Requirements document, if available"
  design_doc: "(implementation mode) Design document, if available"
  description: "Natural language description of what needs to be implemented or refactored"
  current_code: "(refactoring mode) The code to refactor"
  language: "(refactoring mode) Programming language"
  constraints: "Timeline, team size, technology constraints, or backward compatibility requirements"
  context: "Additional context — why this work is needed, known concerns"
input_contract:
  type: requirements-document | design-document | source-code
  description: >
    For implementation mode: ideally both a requirements doc and design doc.
    For refactoring mode: the current code to be refactored.
    If only a natural language description is provided, the plan will note
    that formal inputs should be gathered first.
output_contract:
  type: implementation-plan
  description: >
    A structured implementation plan with tasks, dependencies,
    risk assessment, and milestones — or a refactoring plan with
    incremental steps, each maintaining correctness, with rollback strategy.
---

# Task: Plan Implementation

You are tasked with producing a structured plan. The **mode** parameter
determines the planning approach.

## Inputs

**Project Name**: {{project_name}}

**Mode**: {{mode}}

**Description**:
{{description}}

**Constraints**:
{{constraints}}

**Context**:
{{context}}

### Implementation Mode Inputs

**Requirements Document** (if available):
{{requirements_doc}}

**Design Document** (if available):
{{design_doc}}

### Refactoring Mode Inputs

**Current Code** (if applicable):
```{{language}}
{{current_code}}
```

**Language**: {{language}}

## Instructions

1. **Apply the anti-hallucination protocol.** Base the plan on the
   provided inputs only. Do NOT invent tasks for requirements that do
   not exist or assume behaviors not shown in the code. If the inputs
   are insufficient, state what is missing.

2. **Validate the mode parameter.** Only `implementation` and `refactoring`
   are valid values. If `mode` is empty, missing, or any other value,
   treat it as `implementation` (the default).

3. **If mode is "implementation"**, follow the
   implementation planning workflow:

   a. If requirements or design documents are not provided, begin
      with a note: "This plan is based on the natural language description
      only. A formal requirements document and design document should be
      produced first to validate the plan."

   b. **Decompose into tasks**:
      - Each task MUST be specific enough to be assigned to one engineer
      - Each task MUST have clear acceptance criteria (how to know it's done)
      - Each task MUST have a complexity estimate: Small / Medium / Large
      - Tasks should be ordered by dependency, not by perceived importance

   c. **Structure the plan**:

      ```markdown
      # Implementation Plan: {{project_name}}

      ## Prerequisites
      <What must be true before implementation begins>

      ## Task Breakdown

      ### Phase 1: <Phase Name>
      
      #### TASK-001: <Task Title>
      - **Description**: <what to implement>
      - **Requirements**: <REQ-IDs addressed, if available>
      - **Dependencies**: <TASK-IDs that must complete first>
      - **Acceptance Criteria**: <how to verify completion>
      - **Complexity**: Small / Medium / Large
      - **Risks**: <what could go wrong>

      ### Phase 2: <Phase Name>
      ...

      ## Dependency Graph
      <Text-based dependency diagram>

      ## Risk Assessment
      | Risk | Likelihood | Impact | Mitigation |
      |------|-----------|--------|------------|

      ## Open Questions
      <Decisions that need to be made before or during implementation>
      ```

   d. **Identify the critical path**: which sequence of dependent tasks
      determines the minimum time to completion?

   e. **Flag risky tasks**: tasks with high uncertainty, external
      dependencies, or novel technology that could cause delays.

4. **If mode is "refactoring"**, follow the refactoring planning workflow:

   a. **Analyze the current state**:
      - What does this code do? (behavioral summary)
      - What are its public interfaces / contracts?
      - What are its dependencies?
      - What implicit assumptions does it make?
      - What tests exist (if mentioned in context)?

   b. **Identify refactoring risks**:
      - What could break? (callers, downstream consumers, integrations)
      - What behaviors are relied upon but not tested?
      - Are there hidden coupling points?

   c. **Produce an incremental plan** where each step:
      - Is a self-contained, committable change
      - Maintains all existing behavior (unless explicitly changing it)
      - Can be verified before proceeding to the next step
      - Has a clear rollback path (revert the commit)

   d. **Structure the plan**:

      ```markdown
      # Refactoring Plan: {{project_name}}

      ## Current State Analysis
      <Behavioral summary of the current code>

      ## Target State
      <What the code should look like after refactoring>

      ## Risks and Mitigation
      | Risk | Impact | Mitigation |
      |------|--------|------------|

      ## Steps

      ### Step 1: <Description>
      - **Change**: <what to change>
      - **Preserves**: <what behavior is maintained>
      - **Verify**: <how to verify correctness after this step>
      - **Rollback**: <how to undo this step>

      ### Step 2: ...

      ## Verification Strategy
      <How to confirm the refactoring is complete and correct>
      ```

   e. **Prefer small, safe steps** over large, risky ones.
      The ideal refactoring step changes structure without changing behavior
      (or changes behavior without changing structure), never both at once.

## Non-Goals

- Do NOT implement any tasks or perform the refactoring — produce the plan only.
- Do NOT generate requirements or design — consume them as inputs.
- Do NOT estimate calendar time or assign tasks to specific people.
- Do NOT recommend technology choices unless directly relevant to
  task decomposition.
- Do NOT add new features as part of a refactoring plan.
- Do NOT assume callers, tests, or dependencies not shown in the
  provided code.

## Quality Checklist

Before finalizing, verify:

- [ ] Every task/step has a unique identifier (TASK-ID or step number)
- [ ] Every task/step has acceptance criteria or a verification method
- [ ] For implementation: every task has a complexity estimate (Small/Medium/Large)
- [ ] For refactoring: every step has a rollback path
- [ ] Dependencies between tasks/steps are explicit (no implicit ordering)
- [ ] Risk assessment covers at least the top 3 risks
- [ ] For implementation: the critical path is identified
- [ ] For implementation: requirements traceability is present (REQ-IDs mapped to tasks)
- [ ] No fabricated requirements or code paths — unknowns marked with [UNKNOWN]
