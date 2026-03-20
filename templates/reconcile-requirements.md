<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: reconcile-requirements
description: >
  Reconcile multiple requirements documents from different sources
  (RFCs, implementations, specifications) into a unified "most
  compatible" requirements document. Classifies each requirement as
  Universal, Majority, Divergent, or Extension based on cross-source
  agreement.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/requirements-reconciliation
format: requirements-doc
params:
  project_name: "Name of the unified specification — e.g., 'TCP Unified Requirements'"
  sources: "List of source documents being reconciled — e.g., 'RFC 9293, Linux TCP, FreeBSD TCP, Windows TCP'"
  source_docs: "The requirements documents to reconcile — paste all source documents with clear delimiters between them"
  unified_tag: "Tag for unified REQ-IDs — e.g., 'TCP-UNIFIED', 'TLS-UNIFIED'"
  focus_areas: "Optional narrowing — e.g., 'connection establishment only', 'congestion control' (default: reconcile all)"
  audience: "Who will read the output — e.g., 'protocol implementers', 'interoperability testers', 'standards body'"
input_contract:
  type: requirements-document
  description: >
    Two or more requirements documents extracted from different sources
    (RFCs, implementations, specifications), each with REQ-IDs and
    keyword strength classification.
output_contract:
  type: requirements-document
  description: >
    A unified requirements document with compatibility classification
    (Universal/Majority/Divergent/Extension) per requirement, source
    mappings, and an interoperability assessment.
---

# Task: Reconcile Requirements Across Sources

You are tasked with reconciling multiple requirements documents into a
**unified specification** that documents the "most compatible" behavior
across all sources. All sources are treated as equal inputs — no source
is inherently authoritative.

## Inputs

**Project Name**: {{project_name}}

**Sources**: {{sources}}

**Source Documents**:
{{source_docs}}

**Unified REQ-ID Tag**: {{unified_tag}}

**Focus Areas**: {{focus_areas}}

## Instructions

1. **Apply the requirements-reconciliation protocol.** Execute all
   phases in order. This is the core methodology — do not skip phases.

2. **Treat all sources as equal.** No source is authoritative. If an
   RFC says MUST but every implementation does something different,
   that is a DIVERGENT requirement — not an implementation bug. The
   unified spec documents reality, not aspiration.

3. **Preserve source traceability.** Every unified requirement must
   map back to its originating requirements in each source. Use the
   original REQ-IDs as cross-references.

4. **Preserve keyword strength per source.** When sources disagree on
   MUST/SHOULD/MAY, record each source's keyword in the divergence
   notes. For UNIVERSAL requirements, use the agreed keyword. For
   MAJORITY, use the majority keyword and note the outlier.

5. **Do NOT resolve DIVERGENT requirements.** Document all variants
   and their interoperability impact. Suggest resolution options but
   do NOT pick a winner — that requires human judgment about the
   target use case.

6. **If focus areas are specified**, perform the full source inventory
   (Phase 1) but restrict alignment and classification (Phases 2–5) to
   requirements in the specified functional areas.

7. **Apply the anti-hallucination protocol.** Every alignment must cite
   specific REQ-IDs from the source documents. Do NOT invent
   requirements that are not in any source. If you infer a behavioral
   equivalence between requirements in different sources, explain your
   reasoning so it can be verified.

8. **Format the output** according to the requirements-doc format with
   additional metadata per requirement:
   - Compatibility class (UNIVERSAL / MAJORITY / DIVERGENT / EXTENSION)
   - Source mapping table (unified REQ-ID → source REQ-IDs)
   - Divergence notes (for non-UNIVERSAL requirements)
   - Interoperability hotspots expressed as risk rows in the Risks
     section (Risk ID, Description, Likelihood, Impact, Mitigation)

9. **Quality checklist** — before finalizing, verify:
   - [ ] Every requirement from every source appears in the alignment
         table or is documented as unmatched
   - [ ] Every unified requirement has a compatibility class
   - [ ] Every unified requirement maps to at least one source REQ-ID
   - [ ] DIVERGENT requirements include all source variants and
         interoperability impact
   - [ ] EXTENSION requirements note which source defines them
   - [ ] The reconciliation summary has accurate counts by class
   - [ ] The interoperability assessment identifies hotspots

## Non-Goals

- Do NOT resolve conflicts — document them with options.
- Do NOT assess which source is "correct" — all are equal inputs.
- Do NOT add requirements not present in any source.
- Do NOT produce implementation guidance — this is a requirements
  reconciliation, not a design document.
- Do NOT evaluate whether the sources' requirements are well-written —
  only whether they agree or disagree.
