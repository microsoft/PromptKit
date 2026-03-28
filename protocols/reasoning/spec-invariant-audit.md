<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: spec-invariant-audit
type: reasoning
description: >
  Systematic adversarial analysis of a specification against user-supplied
  invariants. For each section of the spec, attempts to construct a
  compliant interpretation that violates an invariant. Covers state machine
  gaps, underspecified error handling, ambiguous language, and cross-section
  interactions.
applicable_to:
  - audit-spec-invariants
---

# Protocol: Specification Invariant Audit

Apply this protocol when auditing a specification against a set of
**user-supplied invariants**. The goal is adversarial: for each part of
the spec, attempt to construct a compliant implementation that violates
one or more invariants. If you succeed, that is a finding.

## Phase 1: Invariant Formalization

Before analyzing the spec, formalize each user-supplied invariant into
a testable property.

1. **Restate each invariant** as a precise, falsifiable property:
   - BAD: "The device should be recoverable"
   - GOOD: "For every reachable state S and every failure mode F that
     can occur in S, there exists a transition sequence from S (after F)
     to a state in which the device accepts remote commands"

2. **Identify the violation condition** for each invariant — what would
   constitute a concrete counterexample:
   - "A state exists from which no transition sequence reaches a state
     that accepts remote commands"

3. **Classify each invariant** by scope:
   - **Global**: Must hold in every state and transition (e.g.,
     recoverability)
   - **Phase-specific**: Must hold during a particular phase (e.g.,
     "during update, old firmware remains bootable")
   - **Conditional**: Must hold when a precondition is met (e.g.,
     "if the battery is above 10%, the device must complete the update")

4. **Present the formalized invariants** to the user for confirmation
   before proceeding. Misformalized invariants invalidate the entire
   analysis.

## Phase 2: Spec Decomposition

Break the specification into analyzable units.

1. **Section inventory**: List every section of the spec with a one-line
   summary. Classify each as:
   - **Normative**: Defines required behavior (state transitions,
     constraints, error handling)
   - **Informational**: Provides context, rationale, or examples
   - **Definitional**: Defines terms, data structures, or constants

2. **State machine extraction**: If the spec defines state-driven
   behavior (explicitly or implicitly):
   - Enumerate all states
   - Enumerate all transitions with triggers, guards, and actions
   - Build a state transition table
   - Identify implicit states — states implied by the spec's narrative
     but not formally defined

3. **Error condition catalog**: List every error condition the spec
   defines or implies:
   - What triggers it
   - What the spec requires in response
   - Whether recovery behavior is specified or left to the implementation

4. **Ambiguity register**: As you decompose, record every instance of:
   - Underspecified behavior ("implementation-defined", "may", or simply
     not addressed)
   - Ambiguous language that permits multiple interpretations
   - Implicit assumptions (the spec assumes something without stating it)

## Phase 3: Per-Section Adversarial Analysis

For each normative section of the spec, attempt to construct a
**compliant-but-violating interpretation** — an implementation that
satisfies the letter of the spec but violates one or more invariants.

1. **Read the section** and identify what it permits, requires, and
   prohibits.

2. **For each invariant**, ask:
   - "Can I construct an implementation that follows this section's rules
     but violates invariant I?"
   - "Does this section leave room for an implementation to reach a state
     from which invariant I cannot be restored?"

3. **If you find a violating interpretation**:
   - Document the interpretation precisely — what the implementation does,
     step by step
   - Cite the spec language that permits this interpretation
   - Identify which invariant is violated and how
   - Classify the finding (see Phase 7)

4. **If you cannot find a violating interpretation**, record that the
   section was analyzed and no violation was found. Do NOT skip this —
   coverage completeness matters.

5. **Disproof discipline**: Before reporting a finding, attempt to
   disprove it:
   - Is there another section of the spec that would prevent this
     interpretation?
   - Does a definition or constraint elsewhere close this gap?
   - If you find a counterargument, verify it by reading the actual
     spec text — do not assume a constraint "probably" exists.
   - Only report the finding if disproof fails.

## Phase 4: State Machine Completeness

If the spec defines state-driven behavior, analyze the state machine
for invariant violations.

1. **For every state × event combination** in the transition table:
   - If the transition is defined: does the target state preserve all
     global invariants?
   - If the transition is undefined: what happens? Does the spec say
     (ignore, error, reset)? If not, an implementation could do anything —
     including entering an invariant-violating state.

2. **For every state**, check:
   - Is there a path from this state to a known-good state (one that
     satisfies all invariants)? If not, entering this state may
     permanently violate an invariant.
   - Can this state be entered through a failure (power loss, timeout,
     corruption)? If so, the invariant violation is reachable.

3. **For every failure mode** the spec acknowledges:
   - What state does the system land in after the failure?
   - Is that state defined in the state machine, or is it an implicit
     "unknown" state?
   - From that post-failure state, can the system reach a state that
     satisfies all invariants?

4. **Terminal state analysis**: Identify all states with no outgoing
   transitions. For each:
   - Is this state intentionally terminal (e.g., end-of-life)?
   - Or is it an accidental dead end that violates an invariant?

## Phase 5: Error and Failure Path Analysis

For each error condition from the Phase 2 catalog, trace whether the
specified recovery preserves all invariants.

1. **Trace the recovery path**: From the error state, follow the spec's
   prescribed recovery steps. At each step:
   - What if *this step* also fails? Does the spec handle cascading
     failures?
   - Does the recovery path pass through a state that violates an
     invariant, even temporarily?

2. **Check recovery completeness**: Does the spec define recovery for
   every error condition? For those without specified recovery:
   - An implementation may do nothing — is that safe?
   - An implementation may panic/halt — does that violate an invariant?

3. **Check failure during recovery**: What happens if a failure occurs
   during the recovery process itself?
   - Power loss during rollback
   - Communication failure during error reporting
   - Resource exhaustion during cleanup
   - If the spec does not address this, it is a finding.

4. **Timeout and liveness**: For any recovery that involves waiting
   (retries, timeouts, external input):
   - What if the wait never completes?
   - Is there a bounded worst-case time, or can the system hang
     indefinitely?
   - Indefinite hangs may not violate safety invariants but may violate
     liveness or availability invariants.

## Phase 6: Cross-Section Interaction Analysis

Sections analyzed individually may each preserve invariants, but their
**interaction** may not.

1. **Identify shared state**: Find state or resources referenced by
   multiple spec sections (e.g., a flash partition used by both the
   update mechanism and the boot sequence).

2. **Construct interaction scenarios**: For each shared state element:
   - Can section A modify it in a way that causes section B to violate
     an invariant?
   - Can the ordering of operations across sections create a window
     where an invariant does not hold?
   - Can concurrent or interleaved execution of behaviors from different
     sections violate an invariant?

3. **Check timing assumptions**: If section A assumes a resource is
   available and section B may consume it, the interaction may violate
   invariants under specific timing.

## Phase 7: Findings Synthesis

Classify and present each finding.

1. **For each finding**, document:
   - **Invariant violated**: Which formalized invariant from Phase 1
   - **Spec sections involved**: Which sections permit or cause the
     violation
   - **Violating interpretation**: The exact compliant implementation
     behavior that violates the invariant, step by step
   - **Spec language**: Direct quotes from the spec that permit this
     interpretation
   - **Disproof attempt**: What you checked to try to disprove this
     finding, and why disproof failed
   - **Confidence**: Confirmed / High-confidence / Needs-domain-check
   - **Suggested remediation**: How the spec could be amended to close
     the gap

2. **Classify each finding**:
   - **Gap**: The spec does not address a scenario — an implementation
     has no guidance and may violate the invariant
   - **Ambiguity**: The spec language permits multiple interpretations,
     at least one of which violates the invariant
   - **Contradiction**: Two spec sections, taken together, make it
     impossible to satisfy an invariant
   - **Incompleteness**: A state machine transition, error handler, or
     recovery path is missing, creating a dead end
   - **Implicit assumption**: The spec assumes a property (hardware
     behavior, timing, external condition) without stating it — if the
     assumption fails, the invariant is violated

3. **Produce a coverage summary**:
   - Which spec sections were analyzed
   - Which invariants were tested against each section
   - Any sections with zero findings (to demonstrate completeness)
   - Any sections that could not be analyzed (missing information) —
     flag these explicitly
