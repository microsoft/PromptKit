<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: protocol-conflict-analysis
type: reasoning
description: >
  Systematic reasoning protocol for comparing two protocol specifications
  to identify semantic conflicts, incompatible assumptions, and
  interoperability hazards. Decomposes each protocol into structural
  layers and performs pairwise analysis across shared concerns.
applicable_to:
  - analyze-protocol-conflicts
---

# Protocol: Protocol Conflict Analysis

Apply this protocol when comparing two protocol specifications to
determine whether they conflict, overlap, or are compatible. Execute
all phases in order.

## Phase 1: Protocol Decomposition

Break each protocol into its structural layers for systematic comparison.

1. **For each protocol**, extract and document:
   - **Identity**: Name, version, specification document, standards body.
   - **Scope**: What problem does it solve? What layer of the network
     stack does it operate at? What roles does it define?
   - **State machine(s)**: States, transitions, guards, actions.
   - **Message formats**: Message types, fields, encoding rules.
   - **Error model**: Error conditions, error codes, recovery procedures.
   - **Security model**: Authentication, encryption, trust boundaries.
   - **Extensibility mechanisms**: How the protocol accommodates future
     changes (version negotiation, extension fields, registries).
   - **Dependencies**: What other protocols, transports, or services
     does it depend on?
   - **Assumptions**: What does the protocol assume about the network,
     the peer, timing, ordering, and reliability?

2. **Identify the relationship type** between the two protocols:
   - **Same layer, same purpose**: Direct competitors or alternative
     approaches (e.g., TCP vs. SCTP). Expect high conflict potential.
   - **Same layer, different purpose**: May share resources or
     namespaces (e.g., two application-layer protocols sharing a port).
   - **Adjacent layers**: One transports or depends on the other
     (e.g., HTTP over TCP, QUIC over UDP). Expect interface conflicts.
   - **Overlapping scope**: Partially address the same problem (e.g.,
     two authentication protocols with different security models).
   - **Independent**: No shared scope, resources, or assumptions.
     Conflicts unlikely but check shared dependencies.

3. **Build a shared-concern matrix**: List the concerns addressed by
   each protocol and mark which are shared:

   | Concern | Protocol A | Protocol B | Shared? |
   |---------|-----------|-----------|---------|
   | Connection setup | Yes | Yes | **Yes** |
   | Flow control | Yes | No | No |
   | Error signaling | Yes | Yes | **Yes** |

   Focus subsequent analysis on shared concerns.

## Phase 2: Semantic Overlap Detection

For each shared concern, compare how the two protocols address it.

1. **Functional overlap**: Do both protocols define behavior for the
   same operation, event, or condition? For each overlap:
   - Are the behaviors identical, compatible, or contradictory?
   - If both define a state machine for the same concern, compare
     states, transitions, and invariants.

2. **Namespace overlap**: Do both protocols use the same identifiers,
   code points, port numbers, header names, or field names? Namespace
   collisions can cause misrouting, misinterpretation, or ambiguity
   even when the protocols are otherwise compatible.

3. **Resource contention**: Do both protocols compete for the same
   limited resources — buffer space, connection slots, bandwidth,
   timers? Resource contention may not be a specification-level
   conflict but causes runtime failures when both protocols are
   deployed together.

4. **Assumption conflicts**: Do the two protocols make incompatible
   assumptions about:
   - Network properties (reliability, ordering, latency bounds)?
   - Peer behavior (capabilities, compliance level)?
   - Timing (timeout values, retry intervals, keepalive periods)?
   - Security (trust model, credential types, cipher suites)?

5. **For each overlap**, classify as:
   - **COMPATIBLE**: Both protocols define the same behavior or their
     behaviors do not interfere.
   - **CONDITIONALLY_COMPATIBLE**: Compatible under specific conditions
     (e.g., if deployed on different ports, if version negotiation
     succeeds, if a specific configuration is used). State the
     conditions.
   - **CONFLICTING**: The protocols define contradictory behavior for
     the same situation. An implementation cannot comply with both
     simultaneously.
   - **AMBIGUOUS**: The overlap exists but the specifications are
     insufficiently precise to determine compatibility.

## Phase 3: Contradiction Analysis

For each CONFLICTING or AMBIGUOUS overlap, perform deep analysis.

1. **Characterize the contradiction**:
   - What specific normative statements conflict?
   - Quote the relevant text from each specification.
   - Is the conflict at the MUST level (absolute) or the SHOULD level
     (implementations may legitimately differ)?

2. **Determine the scope of conflict**:
   - Does the conflict affect all uses of both protocols, or only
     specific configurations or deployment scenarios?
   - Is the conflict observable on the wire (different messages), in
     state (different state machine behavior), or only in
     implementation (internal behavior differences)?

3. **Assess the severity**:
   - **Critical**: Simultaneous compliance is impossible. An
     implementation MUST violate one specification to comply with the
     other.
   - **High**: Compliance with both is possible in theory but requires
     careful implementation that may not match common practice.
   - **Medium**: Conflict exists only in edge cases or uncommon
     configurations.
   - **Low**: Conflict is theoretical — unlikely to manifest in
     practice.

4. **Identify root cause**: Why do the protocols conflict?
   - Independent development without coordination?
   - Different design philosophies or priorities?
   - Different assumptions about the deployment environment?
   - One protocol evolved to solve a problem the other created?
   - Standards-body politics or competing interests?
   Understanding the root cause informs resolution strategies.

## Phase 4: Interoperability Assessment

Assess what happens when both protocols are deployed in the same
environment.

1. **Coexistence scenarios**: Can both protocols operate simultaneously?
   - On the same host?
   - On the same network?
   - On the same connection (if layered)?

2. **Transition scenarios**: If migrating from Protocol A to Protocol B
   (or vice versa):
   - Can both be deployed simultaneously during transition?
   - Is there a negotiation mechanism to select which protocol to use?
   - What happens to sessions/connections during the transition?

3. **Gateway/translation scenarios**: Can a middlebox translate between
   the two protocols?
   - What information is lost in translation?
   - What state machine mismatches cause translation failures?

4. **Combined deployment scenarios**: If the protocols are designed to
   work together (adjacent layers or complementary functions):
   - Do their combined state machines compose correctly?
   - Do their error models compose correctly (does an error in one
     protocol propagate correctly to the other)?
   - Do their timing assumptions compose correctly (do combined
     timeouts create unexpected behavior)?

## Phase 5: Resolution Recommendations

For each conflict, propose resolution options.

1. **For CONFLICTING overlaps**, propose:
   - **Specification amendment**: Which specification should change,
     and how? (Reference the protocol-change-categories taxonomy for
     the type of change needed.)
   - **Deployment constraint**: Can the conflict be avoided by
     restricting how the protocols are deployed?
   - **Negotiation mechanism**: Can the protocols negotiate which
     behavior to use?
   - **Profile/subset**: Can a restricted profile of one or both
     protocols avoid the conflict?

2. **For AMBIGUOUS overlaps**, propose:
   - **Clarification needed**: Which specification needs clarification?
     What question must be answered?
   - **Conservative interpretation**: What is the safest interpretation
     that minimizes interoperability risk?

3. **For CONDITIONALLY_COMPATIBLE overlaps**, document:
   - The exact conditions required for compatibility.
   - How to verify that the conditions are met.
   - What happens if the conditions are violated.

4. **Prioritize resolutions** by interoperability impact:
   - Address CRITICAL conflicts first.
   - Group related conflicts that can be resolved together.
   - Identify resolutions that fix multiple conflicts simultaneously.
