<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: rfc-extraction
type: reasoning
description: >
  Systematic protocol for extracting structured requirements from RFCs
  and internet-drafts. Handles normative language (RFC 2119), state
  machines, cross-RFC dependencies, ABNF grammars, and IANA/security
  considerations. Produces requirements suitable for traceability
  auditing and implementation verification.
applicable_to:
  - extract-rfc-requirements
---

# Protocol: RFC Requirements Extraction

Apply this protocol when extracting structured, testable requirements
from an RFC or internet-draft. The goal is to transform RFC prose into
a requirements document with stable identifiers, acceptance criteria,
and traceability back to RFC sections — so the output can feed into
PromptKit's audit templates (`audit-traceability`, `audit-code-compliance`).

## Phase 1: Document Structure Analysis

Understand the RFC's organization before extracting requirements.

1. **Classify each section** as:
   - **Normative**: Contains MUST/SHALL/SHOULD/MAY requirements that
     implementations must follow. These are the primary extraction
     targets.
   - **Informational**: Background, rationale, examples, history.
     These provide context but do not generate requirements.
   - **IANA Considerations**: Registry assignments, code point
     allocations. Generate requirements for implementations that
     must recognize or produce these values.
   - **Security Considerations**: Threat analysis, required mitigations.
     Generate security requirements from each MUST/SHOULD statement.
   - **ABNF / Formal Definitions**: Grammar specifications, field
     formats, encoding rules. Generate structural requirements.

2. **Identify cross-RFC dependencies**: List every RFC referenced in
   the normative text. For each, note whether it is:
   - **Normative reference**: Implementation MUST comply with the
     referenced RFC (generate a dependency requirement).
   - **Informative reference**: Referenced for context only (no
     requirement generated).

3. **Identify the protocol model**: Does the RFC define:
   - **State machines**: States, transitions, guards, actions?
   - **Message formats**: Headers, fields, encoding rules?
   - **Negotiation procedures**: Capability exchange, version
     selection, parameter agreement?
   - **Error handling**: Error codes, error responses, recovery
     procedures?
   Note each for targeted extraction in Phase 2.

## Phase 2: Normative Statement Extraction

Extract every normative statement from the RFC.

1. **Scan for RFC 2119 keywords**: Find every occurrence of MUST,
   MUST NOT, SHALL, SHALL NOT, SHOULD, SHOULD NOT, MAY, REQUIRED,
   RECOMMENDED, OPTIONAL (in their RFC 2119 sense — ignore casual
   usage in informational sections).

2. **For each normative statement**:
   - Record the exact text containing the keyword.
   - Record the RFC section number and a brief quoted excerpt of the
     source text (RFCs lack stable paragraph numbering, so a quoted
     fragment provides verifiable traceability).
   - Classify the keyword strength:
     - MUST / SHALL / REQUIRED → absolute requirement
     - MUST NOT / SHALL NOT → absolute prohibition
     - SHOULD / RECOMMENDED → recommended but not absolute
     - SHOULD NOT → not recommended but not prohibited
     - MAY / OPTIONAL → truly optional
   - Identify the **subject**: who must comply (sender, receiver,
     implementation, intermediary, etc.)?
   - Identify the **condition**: under what circumstances does this
     requirement apply?
   - Identify the **behavior**: what must (not) happen?

3. **Extract implicit requirements**: Some RFC requirements are stated
   without RFC 2119 keywords — e.g., "the field is 16 bits wide" or
   "values are in network byte order." These are absolute requirements
   even without MUST. Extract them as MUST-equivalent.

4. **Handle conditional requirements**: Many RFC statements are
   conditional — "If X, the implementation MUST Y." Generate a
   requirement that includes the condition: "When X, the system
   MUST Y."

## Phase 3: State Machine Extraction

If the RFC defines a state machine (explicitly or implicitly):

1. **Enumerate states**: List every named state and its description.
2. **Enumerate transitions**: For each state, list:
   - What events/inputs cause transitions
   - What actions are performed during the transition
   - What the target state is
3. **Identify completeness gaps**: Are there states with no exit
   transition? Events with no handler in a given state? These are
   either errors in the RFC or implicit "ignore/reject" behaviors.
4. **Generate requirements**: Each transition becomes a requirement:
   "When in state S and event E occurs, the system MUST perform
   action A and transition to state T."

## Phase 4: Message Format Extraction

If the RFC defines message formats:

1. **Extract field definitions**: For each message type, list every
   field with its name, type, size, valid values, and encoding.
2. **Extract validation rules**: What values are valid? What must
   an implementation do when it receives an invalid value?
3. **Extract ordering and alignment rules**: Field order, byte
   alignment, padding requirements.
4. **Generate requirements**: Each field constraint becomes a
   requirement. Each validation rule becomes a requirement with
   both positive (valid input) and negative (invalid input) behaviors.

## Phase 5: Requirement Structuring

Transform extracted statements into structured requirements.

1. **Assign stable identifiers**: Use the scheme
   `REQ-<TAG>-<SECTION>-<NNN>` where:
   - `<TAG>` is a short tag (e.g., `TCP` for RFC 9293, `TLS` for
     RFC 8446)
   - `<SECTION>` is a deterministic encoding of the RFC section:
     numeric sections use zero-padded digits (e.g., `3.4` → `034`,
     `3.10` → `0310`); subsections append (e.g., `3.4.1` → `0341`);
     appendices use letter prefix (e.g., `A.1` → `A01`)
   - `<NNN>` is sequential within the section

2. **Write each requirement** in the form:
   ```
   REQ-<TAG>-<SECTION>-<NNN>: The <subject> <KEYWORD> <behavior>
   when <condition>.
   Rationale: <rationale, if stated in the RFC; otherwise omit>
   Source: RFC NNNN, Section X.Y — "<quoted excerpt>"
   ```

3. **Define acceptance criteria**: For each requirement, define at
   least one testable criterion. For MUST NOT requirements, the
   criterion should verify the prohibited behavior does NOT occur.

4. **Classify by category**: Group requirements into categories
   (e.g., CONNECTION, DATA_TRANSFER, CONGESTION, TEARDOWN, ERROR,
   SECURITY) for navigability.

5. **Record keyword strength**: Preserve the original RFC 2119
   keyword so consumers know which requirements are absolute (MUST)
   vs. recommended (SHOULD) vs. optional (MAY). This is critical
   for the reconciliation use case — SHOULD/MAY requirements are
   where implementations legitimately diverge.

## Phase 6: Cross-Reference and Completeness Check

1. **Verify coverage**: Every normative section of the RFC should
   have at least one extracted requirement. If a normative section
   has zero requirements, either the extraction missed something or
   the section is actually informational — document which.

2. **Verify traceability**: Every requirement must cite its source
   RFC section. This enables future audits to trace back from
   requirement to RFC text.

3. **Flag ambiguities**: Mark any RFC text that is ambiguous or
   could be interpreted multiple ways. Note the possible
   interpretations and flag for human resolution.

4. **List cross-RFC dependencies**: Produce a summary of referenced
   RFCs and which requirements depend on them. This tells consumers
   which additional RFCs to extract if they want complete coverage.
