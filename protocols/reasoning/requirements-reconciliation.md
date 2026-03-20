<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: requirements-reconciliation
type: reasoning
description: >
  Systematic protocol for reconciling multiple requirements documents
  from different sources (RFCs, implementations, specifications) into
  a unified requirements document. Aligns requirements across sources,
  classifies compatibility, and documents conflicts with resolution
  options for human decision-making.
applicable_to:
  - reconcile-requirements
---

# Protocol: Requirements Reconciliation

Apply this protocol when merging requirements extracted from multiple
sources — RFCs, implementations, specifications — into a single unified
requirements document. All sources are treated as equal inputs; no
source is inherently authoritative. The goal is to produce a "most
compatible" specification that documents what is universal, what is
majority practice, where sources diverge, and what is unique to a
single source.

## Phase 1: Source Inventory

Catalog the input requirements documents.

1. **For each source document**, record:
   - Source name and origin (e.g., "RFC 9293", "Linux TCP stack",
     "FreeBSD TCP stack", "Windows TCP stack")
   - Total requirement count
   - REQ-ID scheme used
   - Keyword strength distribution (count of MUST, SHOULD, MAY)
   - Categories/sections covered

2. **Assess coverage overlap**: Which functional areas do all sources
   cover? Which are covered by only a subset? Build a preliminary
   coverage matrix:

   | Functional Area | Source 1 | Source 2 | Source 3 | ... |
   |-----------------|----------|----------|----------|-----|
   | Connection setup | ✓ | ✓ | ✓ | |
   | Data transfer | ✓ | ✓ | ✓ | |
   | Congestion control | ✓ | ✓ | ○ | |

   Use ✓ for covered, ○ for partially covered, ✗ for absent.

## Phase 2: Requirement Alignment

Map requirements across sources to identify equivalences.

1. **For each requirement in each source**, find corresponding
   requirements in the other sources. Match by:
   - **Behavioral equivalence**: The requirements describe the same
     behavior, possibly in different words.
   - **Functional area + condition**: Requirements in the same
     functional area with the same triggering condition.
   - **State machine correspondence**: Requirements about the same
     state, transition, or event.

   Do NOT match by keyword or surface text similarity alone — two
   requirements can use similar words but specify different behaviors.

2. **Build an alignment table**: Each row represents a single behavior
   or constraint. Use temporary alignment IDs (U-001, U-002, ...) for
   working reference — these will be replaced with final unified
   REQ-IDs in Phase 5. Columns show how each source addresses it:

   | Alignment ID | Behavior | Source 1 | Source 2 | Source 3 | ... |
   |--------------|----------|----------|----------|----------|-----|
   | U-001 | SYN retransmit timeout | REQ-TCP-034-012 (MUST, 3s) | LINUX-CONN-007 (MUST, 1s) | BSD-CONN-004 (MUST, 3s) | |

3. **Flag unmatched requirements**: Requirements that exist in only
   one source and have no equivalent in any other source. These are
   candidates for the Extension compatibility class.

## Phase 3: Compatibility Classification

For each aligned behavior (each row in the alignment table):

1. **Compare keyword strength** across sources:
   - Do all sources agree on MUST/SHOULD/MAY?
   - Does one source say MUST while another says SHOULD?
   - Does any source omit this behavior entirely?

2. **Compare specified values** across sources:
   - Do all sources agree on thresholds, timeouts, sizes?
   - Where values differ, what is the range?

3. **Assign a compatibility class**:

   - **UNIVERSAL**: All sources specify this behavior with the same
     keyword strength and compatible values. This is safe to include
     as-is in the unified spec with the agreed keyword.

   - **MAJORITY**: Most sources (>50%) agree, but one or more diverge.
     Include in the unified spec with the majority keyword. Document
     which sources diverge and how.

   - **DIVERGENT**: Sources actively disagree — different keyword
     strengths, different values, or contradictory behaviors. Include
     in the unified spec with all variants documented. Do NOT pick a
     winner — the consumer must decide based on their use case.

   - **EXTENSION**: Only one source specifies this behavior. Include
     as MAY in the unified spec. Note which source defines it and
     why it may or may not be desirable for interoperability.

4. **Record the classification rationale**: For each non-UNIVERSAL
   requirement, briefly explain why it is not universal and what the
   specific differences are.

## Phase 4: Conflict Analysis

For DIVERGENT requirements, perform deeper analysis:

1. **Categorize the conflict**:
   - **Value disagreement**: Same behavior, different parameters
     (e.g., timeout 1s vs. 3s). Document the range across sources.
   - **Strength disagreement**: Same behavior, different keyword
     (e.g., MUST vs. SHOULD). May indicate different risk
     assessments.
   - **Behavioral disagreement**: Different behaviors for the same
     condition (e.g., "close connection" vs. "send reset"). These
     are true conflicts requiring human resolution.
   - **Presence disagreement**: One source requires behavior another
     explicitly prohibits. These are the most dangerous conflicts.

2. **Assess interoperability impact**: For each conflict, answer:
   - If an implementation follows source A's behavior and
     communicates with an implementation following source B's
     behavior, what happens?
   - Is the result a failure, a degraded experience, or transparent?

3. **Suggest resolution options** (but do NOT pick one):
   - Most conservative (strictest keyword, tightest value)
   - Most permissive (loosest keyword, widest value)
   - Most interoperable (the choice that causes fewest failures
     when communicating with other implementations)

## Phase 5: Unified Specification Assembly

Produce the unified requirements document.

1. **Assign unified REQ-IDs**: Use the tag and scheme provided by the
   template (e.g., `REQ-<TAG>-<CAT>-<NNN>` where `<TAG>` is the
   user-provided unified tag).

2. **For each unified requirement**, include:
   - The unified REQ-ID and requirement text
   - **Compatibility class**: UNIVERSAL / MAJORITY / DIVERGENT /
     EXTENSION
   - **Keyword strength**: The unified keyword (for UNIVERSAL and
     MAJORITY) or all source keywords (for DIVERGENT)
   - **Source mapping**: Which source requirements map to this
     unified requirement (REQ-IDs from each source)
   - **Acceptance criteria**: Derived from the source with the most
     specific criteria, or synthesized from multiple sources
   - **Divergence notes** (for non-UNIVERSAL): What differs and why

3. **Group by category**: Use functional area categories consistent
   across sources (e.g., CONNECTION, DATA_TRANSFER, CONGESTION,
   TEARDOWN, ERROR, SECURITY).

4. **Produce a reconciliation summary**:
   - Total unified requirements
   - Count by compatibility class
   - Count by keyword strength
   - List of DIVERGENT requirements requiring human resolution
   - List of EXTENSION requirements for review

## Phase 6: Interoperability Assessment

Produce an overall assessment of cross-source compatibility.

1. **Compatibility score**: % of requirements that are UNIVERSAL.
2. **Risk areas**: Functional areas with the highest concentration
   of DIVERGENT requirements.
3. **Interoperability hotspots**: Specific behaviors where
   implementations will conflict if they follow different sources.
4. **Recommendations**: Which DIVERGENT requirements are highest
   priority for resolution and why.
