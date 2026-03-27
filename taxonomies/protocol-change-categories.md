<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: protocol-change-categories
type: taxonomy
description: >
  Classification scheme (PC1-PC8) for protocol specification changes.
  Categorizes changes by their impact on existing implementations,
  interoperability, and specification integrity. Use when evolving
  protocols or analyzing conflicts between protocol versions.
domain: protocol-engineering
applicable_to:
  - evolve-protocol
  - analyze-protocol-conflicts
---

# Taxonomy: Protocol Change Categories

Use these labels to classify changes to a protocol specification. Every
proposed change MUST use exactly one label from this taxonomy. The labels
are ordered by increasing severity of impact on existing implementations.

## Labels

### PC1_EDITORIAL

A change to informational, explanatory, or formatting text that does not
alter any normative statement, state machine, message format, or
compliance requirement.

**Examples**: Fixing a typo in a rationale paragraph, rewording an
example for clarity, updating a reference from an obsoleted RFC to its
replacement when the normative content is unchanged.

**Impact**: None. No implementation changes required. No interoperability
effect.

**Severity guidance**: Informational. Always safe to apply.

### PC2_CLARIFICATION

A change that resolves an ambiguity in normative text without altering
the intended behavior. The specification previously permitted multiple
interpretations; the change narrows it to one.

**Examples**: Specifying that "the field MUST be set to zero" means
all bits zero (not ASCII '0'), clarifying that "idle timeout" is
measured from the last data packet (not the last ACK).

**Impact**: Implementations that chose the now-excluded interpretation
must change. Implementations that chose the now-confirmed interpretation
are unaffected.

**Severity guidance**: Low to Medium. Assess based on how many
implementations may have chosen the excluded interpretation.

### PC3_BACKWARD_COMPATIBLE_EXTENSION

A new capability, field, message type, or state that existing
implementations can safely ignore. The extension uses mechanisms already
defined in the protocol for extensibility (e.g., new option types,
new extension frames, new registry values).

**Examples**: Adding a new TLS extension type, defining a new HTTP
method, adding an optional parameter to a SIP header, defining a new
QUIC frame type with the requirement that unknown frame types be ignored.

**Impact**: Existing implementations continue to operate correctly.
They do not gain the new capability but do not break. New
implementations can adopt the extension incrementally.

**Severity guidance**: Low. The primary risk is that the extension
mechanism itself was not correctly implemented in existing code.

### PC4_OPTIONAL_BEHAVIOR_CHANGE

A change to behavior that the specification marks as SHOULD, RECOMMENDED,
MAY, or OPTIONAL. Existing implementations are already permitted to do
either the old or new thing.

**Examples**: Changing a SHOULD to a MUST (tightening), changing a MUST
to a SHOULD (relaxing), adding a new SHOULD recommendation for an
existing optional capability.

**Impact**: Varies. Tightening (SHOULD → MUST) may require implementation
changes for compliance. Relaxing (MUST → SHOULD) makes previously
non-compliant implementations compliant. Adding new SHOULD text changes
best practice without breaking compliance.

**Severity guidance**: Medium when tightening. Low when relaxing or
adding advisory text. Assess based on the gap between common practice
and the new specification.

### PC5_STATE_MACHINE_MODIFICATION

A change that adds, removes, or modifies states, transitions, guards,
or actions in the protocol's state machine. This includes adding new
states, changing transition conditions, or redefining actions performed
during transitions.

**Examples**: Adding a new connection state (e.g., CLOSING),
adding a new event that triggers a transition, changing the action
performed when entering a state, removing a previously defined
transition.

**Impact**: All implementations must update their state machines.
Incomplete updates cause protocol-level errors — connections that hang,
messages that are rejected, or states that cannot be reached or exited.

**Severity guidance**: High. State machine changes are pervasive and
error-prone. Every role in the protocol must update consistently.

### PC6_MESSAGE_FORMAT_CHANGE

A change to the wire format of messages — field sizes, field ordering,
encoding, new required fields, or removal of existing fields. This
includes changes to ABNF grammars, TLV structures, and protocol data
unit layouts.

**Examples**: Changing a 16-bit length field to 32-bit, adding a
required header field, changing the encoding of a timestamp from
32-bit Unix epoch to 64-bit NTP, reordering fields in a fixed-format
message.

**Impact**: Wire-incompatible. Old and new implementations cannot
communicate without a version negotiation or translation mechanism.
This is the most disruptive category of change.

**Severity guidance**: Critical. Unless the protocol has explicit
version negotiation that accommodates the change, this breaks
interoperability.

### PC7_SECURITY_IMPACTING

A change that affects the protocol's security properties — adding or
removing authentication, changing cryptographic algorithms, modifying
trust boundaries, or altering the threat model. This label may co-occur
with other categories (e.g., a security-impacting state machine change
would be labeled PC5 for its structural impact and flagged as PC7 for
its security implications).

**Examples**: Deprecating a cipher suite, requiring authentication
where it was previously optional, adding a new security consideration,
changing the key derivation function, adding mandatory encryption for
a previously plaintext field.

**Impact**: Security posture changes. May require coordinated deployment
to avoid downgrade attacks during transition. May obsolete existing
security analyses.

**Severity guidance**: High to Critical. Assess based on whether the
change opens or closes attack surface, and whether incomplete deployment
creates a vulnerability window.

### PC8_DEPRECATION_OR_REMOVAL

A change that deprecates or removes a previously defined capability,
message type, field, state, or behavior. The deprecated feature may
continue to be recognized (deprecated) or may be actively rejected
(removed).

**Examples**: Removing support for SSLv3, deprecating a message type
in favor of a new one, marking a header field as obsolete, removing
a state from the state machine.

**Impact**: Implementations relying on the deprecated/removed feature
must change. If the feature is widely deployed, removal may cause
interoperability failures during the transition period.

**Severity guidance**: Medium when deprecated (implementations should
change but still work). High when removed (implementations MUST change
to remain compliant). Critical if the removed feature has no replacement
and existing deployments depend on it.

## Ranking Criteria

Within a given severity level, order findings by interoperability impact:

1. **Highest impact**: PC6 (wire format), PC7 (security) — break
   communication or security properties.
2. **High impact**: PC5 (state machine), PC8 (removal) — require
   coordinated implementation updates.
3. **Medium impact**: PC4 (optional behavior tightening), PC2
   (clarification excluding existing interpretations).
4. **Low impact**: PC3 (backward-compatible extension), PC4
   (optional behavior relaxing).
5. **No impact**: PC1 (editorial).

## Usage

In findings and delta documents, reference labels as:

```
[CHANGE: PC5_STATE_MACHINE_MODIFICATION]
Section: 3.4 — Connection State Machine
Description: Add CLOSING state between ESTABLISHED and CLOSED.
Impact: All implementations must recognize the new state and handle
  transitions to/from CLOSING. Implementations that do not recognize
  CLOSING will treat it as an error, causing connection teardown failures.
Backward Compatibility: Not backward-compatible without version negotiation.
```
