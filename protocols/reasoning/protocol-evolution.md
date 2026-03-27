<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: protocol-evolution
type: reasoning
description: >
  Systematic reasoning protocol for modifying or extending an existing
  protocol specification. Walks through specification ingestion, change
  request analysis, impact tracing, consistency verification, and delta
  generation. Designed for interactive use with a human protocol designer.
applicable_to:
  - evolve-protocol
---

# Protocol: Protocol Evolution

Apply this protocol when modifying or extending an existing protocol
specification (RFC, internet-draft, or formal spec). Execute all phases
in order. Phases 1–4 are interactive — engage the user at each phase.
Phase 5 is generative — produce the delta document.

## Phase 1: Specification Ingestion

Understand the existing protocol before proposing changes.

1. **Identify the specification scope**: What protocol is being modified?
   What is the base specification (RFC number, version, document title)?
   What normative references does it depend on?

2. **Extract the protocol model**: Identify the core structural elements:
   - **State machine(s)**: States, transitions, guards, actions. If the
     spec defines multiple state machines (e.g., per-connection and
     per-stream), enumerate each.
   - **Message formats**: Message types, fields, encoding rules. Note
     extensibility mechanisms (option fields, extension frames, TLV
     structures).
   - **Protocol roles**: Who are the participants (client/server,
     initiator/responder, peer/peer)? What asymmetries exist?
   - **Error model**: Error codes, error responses, recovery procedures.
   - **Negotiation mechanisms**: Version negotiation, capability
     exchange, parameter agreement.
   - **Security model**: Authentication, encryption, trust boundaries.

3. **Identify extensibility points**: Where does the protocol explicitly
   anticipate extension? Registry-allocated code points, reserved fields,
   defined extension mechanisms, version negotiation. These are the
   lowest-risk places to introduce changes.

4. **Note known ambiguities**: Where is the specification unclear,
   under-specified, or known to have divergent implementations? These
   are opportunities for clarification (PC2) changes.

5. **Summarize the protocol model** to the user for confirmation before
   proceeding. If the user has provided a requirements document
   (from `extract-rfc-requirements`), cross-reference the model against
   the extracted requirements.

## Phase 2: Change Request Analysis

Understand what the user wants to change and why.

1. **Elicit the change goal**: What problem does the change solve? Is it:
   - Fixing a bug or ambiguity in the existing spec?
   - Adding new functionality?
   - Deprecating or removing existing functionality?
   - Improving security properties?
   - Aligning with a related specification?
   - Responding to implementation experience?

2. **Characterize each proposed change** using the protocol-change-categories
   taxonomy (PC1–PC8). Present the classification to the user and explain
   the implications.

3. **Identify unstated assumptions**: What is the user assuming about
   how the change interacts with the existing protocol? Surface these
   explicitly:
   - "You are assuming existing implementations will ignore the new
     field — does the spec guarantee this?"
   - "This change implies a new state — have you considered the
     transitions into and out of it?"

4. **Challenge under-specified changes**: If the user says "add support
   for X" without specifying the mechanism, push for specifics:
   - What message format changes are needed?
   - What state transitions are affected?
   - What happens if one side supports X and the other does not?
   - What error handling is needed?

5. **Enumerate all proposed changes** in a numbered list with their
   PC classification. Confirm with the user before proceeding.

## Phase 3: Impact Analysis

Trace the implications of each change through the protocol specification.

1. **State machine impact**: For each change, determine:
   - Does it add, remove, or modify states?
   - Does it add, remove, or modify transitions?
   - Does it change guards or actions on existing transitions?
   - Is the resulting state machine complete (no unreachable states,
     no missing transitions for defined events)?

2. **Message format impact**: For each change, determine:
   - Does it add, remove, or modify fields?
   - Does it change encoding or serialization?
   - Is the change wire-compatible with existing implementations?
   - If not wire-compatible, is there a version negotiation mechanism?

3. **Cross-reference impact**: For each change, identify every other
   section of the specification that references the changed elements.
   These sections may need corresponding updates. List them explicitly.

4. **Error model impact**: Does the change introduce new error
   conditions? Does it invalidate existing error handling? Are new
   error codes needed?

5. **Security impact**: Does the change affect authentication,
   encryption, trust boundaries, or the threat model? If yes, flag
   as PC7 and note specific security implications.

6. **Interoperability impact**: What happens when an updated
   implementation communicates with a non-updated one? Enumerate the
   scenarios:
   - Updated client ↔ old server
   - Old client ↔ updated server
   - Updated peer ↔ old peer
   For each: does it work, degrade gracefully, or fail?

7. **Present the impact analysis** to the user. Highlight any
   cascading effects ("changing X also requires changing Y and Z").
   Confirm before proceeding.

## Phase 4: Consistency Verification

Before generating the delta, verify that the proposed changes are
internally consistent and do not introduce contradictions.

1. **Normative language consistency**: Do any changes create
   contradictory MUST/MUST NOT statements? Does a new MUST conflict
   with an existing SHOULD or MAY?

2. **State machine consistency**: Is the modified state machine:
   - Complete? (every state has at least one exit transition, every
     event is handled in every state — even if handled by "ignore")
   - Deterministic? (no state has two transitions for the same event
     with overlapping guards)
   - Free of deadlocks? (no cycles with no exit)
   - Free of unreachable states? (every state can be reached from the
     initial state)

3. **Cross-reference consistency**: Do all sections that reference
   changed elements have corresponding updates in the delta? If not,
   flag as a consistency gap.

4. **Terminology consistency**: Does the delta introduce new terms?
   Are they defined? Do they conflict with existing terms?

5. **IANA consistency**: If the change requires new code points or
   registry entries, are they specified? Do they conflict with existing
   allocations?

6. **Present any consistency issues** to the user. For each issue,
   explain the contradiction and suggest resolution options. Do NOT
   proceed to Phase 5 until all consistency issues are resolved or
   explicitly accepted by the user.

## Phase 5: Delta Generation

Produce the delta document.

1. **Select the presentation style**: Ask the user which style they
   prefer (amendment, redline, or standalone) — or note that the
   template parameter already specifies it.

2. **Generate each change entry** with:
   - Change ID, section reference, and PC category
   - Rationale citing the discussion from Phases 2–4
   - The actual text change in the selected presentation style
   - Cross-reference updates
   - Affected requirements (if a requirements document was provided)

3. **Generate updated state machine** (if applicable): Present the
   full updated state table, not just the changed transitions.
   Reviewers need to see the complete picture.

4. **Generate updated message formats** (if applicable): Present
   updated field tables for any changed message types.

5. **Generate IANA and security considerations** as applicable.

6. **Generate the consistency verification section**: Document the
   self-checks performed in Phase 4 and their results.

7. **Present the complete delta** to the user for review. Enter the
   refinement loop — make changes as requested, re-running consistency
   verification after each change.
