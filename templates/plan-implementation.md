<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: plan-implementation
description: >
  Decompose a feature or project into an actionable implementation plan
  with tasks, dependencies, and risk assessment.
persona: software-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: implementation-plan
params:
  project_name: "Name of the project or feature"
  requirements_doc: "Requirements document (if available)"
  design_doc: "Design document (if available)"
  description: "Natural language description of what needs to be implemented"
  constraints: "Timeline, team size, technology constraints"
input_contract:
  type: requirements-document | design-document
  description: >
    Ideally both a requirements doc and design doc. If only a natural
    language description is provided, the plan will note that
    requirements and design should be formalized first.
output_contract:
  type: implementation-plan
  description: >
    A structured implementation plan with tasks, dependencies,
    risk assessment, and milestones.
---

# Task: Plan Implementation

You are tasked with producing an **implementation plan** that breaks
down a project into actionable, ordered tasks.

## Inputs

**Project Name**: {{project_name}}

**Requirements Document** (if available):
{{requirements_doc}}

**Design Document** (if available):
{{design_doc}}

**Description**:
{{description}}

**Constraints**:
{{constraints}}

## Instructions

1. **Apply the anti-hallucination protocol.** Base the plan on the
   provided requirements and design. Do NOT invent tasks for
   requirements that do not exist. If the inputs are insufficient
   to produce a complete plan, state what is missing.

2. **If requirements or design documents are not provided**, begin
   with a note: "This plan is based on the natural language description
   only. A formal requirements document and design document should be
   produced first to validate the plan."

3. **Decompose into tasks**:
   - Each task MUST be specific enough to be assigned to one engineer
   - Each task MUST have clear acceptance criteria (how to know it's done)
   - Each task MUST have a complexity estimate: Small / Medium / Large
   - Tasks should be ordered by dependency, not by perceived importance

4. **Structure the plan**:

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

5. **Identify the critical path**: which sequence of dependent tasks
   determines the minimum time to completion?

6. **Flag risky tasks**: tasks with high uncertainty, external
   dependencies, or novel technology that could cause delays.
