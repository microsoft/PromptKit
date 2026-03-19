<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: root-cause-analysis
type: reasoning
description: >
  Structured reasoning protocol for tracing symptoms to root causes.
  Applies systematic hypothesis generation, evidence evaluation,
  and elimination. Language-agnostic.
applicable_to:
  - investigate-bug
  - investigate-security
---

# Protocol: Root Cause Analysis

Apply this protocol when investigating a defect, failure, or unexpected behavior.
The goal is to trace from **observed symptoms** to the **fundamental cause** —
not just the proximate trigger.

## Phase 1: Symptom Characterization

1. **Describe the symptom precisely**:
   - What is the observed behavior?
   - What is the expected behavior?
   - Under what conditions does it occur? (inputs, timing, environment, load)
   - Is it deterministic or intermittent?
2. **Establish the timeline**:
   - When was it first observed?
   - What changed recently? (code, configuration, dependencies, infrastructure)
   - Has it ever worked correctly? When did it stop?
3. **Determine the blast radius**:
   - What is affected? (single user, all users, specific configurations)
   - What is NOT affected? (this constrains the hypothesis space)

## Phase 2: Hypothesis Generation

Generate a **ranked list of hypotheses**, ordered by likelihood. For each:

1. State the hypothesis clearly: "The root cause is X because Y."
2. State what **evidence would confirm** the hypothesis.
3. State what **evidence would refute** the hypothesis.
4. Rate plausibility: High / Medium / Low — with reasoning.

Rules:
- Generate at least 3 hypotheses before investigating any of them.
- Include at least one "non-obvious" hypothesis (environment, timing, config,
  upstream dependency, data corruption).
- Do NOT anchor on the first plausible hypothesis.

## Phase 3: Evidence Gathering and Elimination

For each hypothesis, starting with the most plausible:

1. Identify the **minimal investigation** needed to confirm or eliminate it.
2. Examine the evidence:
   - Does the code/config/log support or contradict the hypothesis?
   - Are there alternative explanations for the same evidence?
3. Classify the hypothesis:
   - **CONFIRMED**: Strong evidence supports it; no contradicting evidence.
   - **ELIMINATED**: Evidence directly contradicts it.
   - **INCONCLUSIVE**: Evidence is insufficient; state what is needed.

## Phase 4: Root Cause Identification

1. Distinguish between the **root cause** (fundamental defect) and the
   **proximate cause** (immediate trigger).
   - Example: The proximate cause is "null pointer dereference on line 42."
     The root cause is "the initialization function silently fails when
     the config file is missing, leaving the pointer uninitialized."
2. Trace the **causal chain** from root cause to symptom.
3. Ask: "If we fix only the proximate cause, will the root cause
   produce other failures?" If yes, the fix is incomplete.

## Phase 5: Remediation

1. Propose a fix for the **root cause**, not just the symptom.
2. Identify **secondary fixes** needed to prevent recurrence:
   - Assertions or precondition checks
   - Improved error handling
   - Logging or monitoring
   - Tests that would have caught this
3. Assess the **risk of the fix**: could it introduce new issues?
