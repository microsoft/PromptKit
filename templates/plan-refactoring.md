<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) Standard Prompt Library Contributors -->

---
name: plan-refactoring
description: >
  Plan a safe, incremental refactoring of existing code. Analyze the
  current state, identify risks, and produce a step-by-step plan
  that maintains correctness at each step.
persona: software-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
params:
  goal: "What the refactoring should achieve"
  current_code: "The code to refactor"
  language: "Programming language"
  constraints: "What must not break, backward compatibility requirements"
  context: "Why this refactoring is needed, what problems it solves"
input_contract: null
output_contract:
  type: implementation-plan
  description: >
    A refactoring plan with incremental steps, each maintaining
    correctness, with rollback strategy.
---

# Task: Plan Refactoring

You are tasked with producing a **refactoring plan** that transforms
existing code safely and incrementally.

## Inputs

**Goal**: {{goal}}

**Current Code**:
```{{language}}
{{current_code}}
```

**Language**: {{language}}

**Constraints**: {{constraints}}

**Context**: {{context}}

## Instructions

1. **Apply the anti-hallucination protocol.** Base the plan on the
   provided code only. Do NOT assume behaviors, dependencies, or
   callers that are not shown.

2. **Analyze the current state**:
   - What does this code do? (behavioral summary)
   - What are its public interfaces / contracts?
   - What are its dependencies?
   - What implicit assumptions does it make?
   - What tests exist (if mentioned in context)?

3. **Identify refactoring risks**:
   - What could break? (callers, downstream consumers, integrations)
   - What behaviors are relied upon but not tested?
   - Are there hidden coupling points?

4. **Produce an incremental plan** where each step:
   - Is a self-contained, commitable change
   - Maintains all existing behavior (unless explicitly changing it)
   - Can be verified before proceeding to the next step
   - Has a clear rollback path (revert the commit)

5. **Structure the plan**:

   ```markdown
   # Refactoring Plan: {{goal}}

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

6. **Prefer small, safe steps** over large, risky ones.
   The ideal refactoring step changes structure without changing behavior
   (or changes behavior without changing structure), never both at once.
