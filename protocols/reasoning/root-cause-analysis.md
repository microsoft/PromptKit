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
  - investigate-trace
  - root-cause-ci-failure
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

## Phase 3a: Iterative Deepening

Investigation MUST proceed in layers of increasing resolution. Each layer
informs the next — do NOT skip layers or jump directly to deep analysis.

1. **Broad survey**: Identify top contributors at the coarsest granularity
   (e.g., by process, module, subsystem, or component). Rank by impact.
2. **Attribution**: For the top 5–10 contributors, break down by the next
   level of detail (e.g., by module within a process, by function within
   a module, by allocation site within a function).
3. **Deep analysis**: For the top contributors at the attribution level,
   obtain the most detailed evidence available (e.g., call stacks, data
   flow traces, lock contention chains, allocation histories). Call stacks
   and execution traces reveal *why* something is happening — module-level
   data only reveals *where*.
4. **Cross-component tracing**: Identify causal chains that span component
   or process boundaries (see Phase 4a).

Do NOT write the final report until layer 3 is complete for the top
contributors, up to 5, using the most detailed evidence available.
If fewer than 5 contributors exist, analyze all of them. If available
evidence does not support layer-3 completion for some contributors, you
MAY proceed to the final report only if you explicitly document the
limitation, identify which contributors remain inconclusive, and state
what additional evidence would be needed. Premature reporting without
this disclosure produces surface-level findings that miss the actual
root cause.

## Phase 4: Root Cause Identification

1. Distinguish between the **root cause** (fundamental defect) and the
   **proximate cause** (immediate trigger).
   - Example: The proximate cause is "null pointer dereference on line 42."
     The root cause is "the initialization function silently fails when
     the config file is missing, leaving the pointer uninitialized."
2. Trace the **causal chain** from root cause to symptom.
3. Ask: "If we fix only the proximate cause, will the root cause
   produce other failures?" If yes, the fix is incomplete.

## Phase 4a: Cross-Component Causal Chains

When the investigation involves multiple components, processes, or
subsystems, trace causal chains across boundaries:

1. **Identify trigger-response pairs**: Does activity in component A
   cause work in component B? For example, a file write by one process
   may trigger scanning by an antivirus service, which triggers hashing
   by an EDR agent, which triggers network inspection by another service.
2. **Map the amplification cascade**: A single action may fan out into
   disproportionate downstream work. Document the full chain:
   `Trigger → Reactor₁ → Reactor₂ → ... → Observed symptom`.
3. **Quantify amplification**: For each link in the chain, estimate the
   cost ratio (e.g., "1 file write triggers 3 scan operations, each
   consuming 50ms of CPU"). The amplification factor often explains why
   a seemingly minor activity produces outsized impact.
4. **Identify the leverage point**: The most effective fix targets the
   link in the chain with the highest amplification factor, not
   necessarily the initial trigger or the final symptom.

Skip this phase when the investigation is confined to a single component
with no cross-boundary interactions.

## Phase 5: Remediation

1. Propose a fix for the **root cause**, not just the symptom.
2. Identify **secondary fixes** needed to prevent recurrence:
   - Assertions or precondition checks
   - Improved error handling
   - Logging or monitoring
   - Tests that would have caught this
3. Assess the **risk of the fix**: could it introduce new issues?
