<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: extract-rfc-requirements
description: >
  Extract structured requirements from an RFC or internet-draft.
  Normalizes normative language, state machines, message formats,
  and cross-RFC dependencies into a standard requirements document
  with REQ-IDs and acceptance criteria.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/rfc-extraction
format: requirements-doc
params:
  rfc_title: "RFC number and title — e.g., 'RFC 9293 — Transmission Control Protocol (TCP)'"
  rfc_text: "The full RFC text"
  tag: "Short tag for REQ-IDs — e.g., 'TCP', 'TLS', 'QUIC', 'HTTP'"
  focus_areas: "Optional narrowing — e.g., 'connection establishment only', 'congestion control', 'security considerations' (default: extract all)"
  context: "Additional context — why the requirements are being extracted, what they will be used for (implementation, audit, reconciliation, etc.)"
  audience: "Who will read the output — e.g., 'engineers implementing the protocol', 'auditors verifying compliance'"
input_contract: null
output_contract:
  type: requirements-document
  description: >
    A structured requirements document extracted from an RFC, with
    REQ-IDs, acceptance criteria, RFC 2119 keyword classification,
    and traceability to source RFC sections.
---

# Task: Extract Requirements from RFC

You are tasked with extracting a **structured requirements document**
from an RFC or internet-draft. The output must be a standard PromptKit
requirements document with numbered REQ-IDs, acceptance criteria, and
full traceability back to the source RFC sections.

## Inputs

**RFC**: {{rfc_title}}

**RFC Text**:
{{rfc_text}}

**REQ-ID Tag**: {{tag}}

**Focus Areas**: {{focus_areas}}

**Context**: {{context}}

**Audience**: {{audience}}

## Instructions

1. **Apply the rfc-extraction protocol.** Execute all phases in order.
   This is the core methodology — do not skip phases.

2. **Use the provided tag** for all REQ-IDs. Format:
   `REQ-{{tag}}-<SECTION>-<NNN>` (e.g., `REQ-TCP-034-001` for the
   first requirement from section 3.4). This differs from the standard
   PromptKit scheme (`REQ-<CATEGORY>-<NNN>`) because RFC requirements
   must trace back to specific RFC sections for verification — the
   section number in the ID provides that traceability.

3. **Preserve RFC 2119 keyword strength.** Every requirement must
   record whether the original statement used MUST, SHOULD, or MAY.
   This is critical metadata — downstream tools use it to distinguish
   absolute requirements from implementation choices.

4. **If focus areas are specified**, perform the full document structure
   analysis (Phase 1) but restrict detailed extraction (Phases 2–5) to
   sections matching the focus areas. Report what was excluded.

5. **Apply the anti-hallucination protocol.** Every requirement must
   trace to a specific RFC section with a quoted excerpt. Do NOT invent
   requirements that are not stated or clearly implied in the RFC text.
   If you infer a requirement from context (e.g., a state machine
   transition that implies a MUST but isn't explicitly stated), label
   it as `[INFERRED]` and cite the evidence.

6. **Format the output** according to the requirements-doc format.
   Map the protocol's output to the document structure:
   - Overview → RFC title, abstract, and purpose
   - Scope → Phase 1 section classification (what is normative)
   - Definitions → Terms and acronyms from the RFC
   - Requirements (Functional) → Phases 2–4 extracted requirements
   - Requirements (Non-Functional) → Performance, security, and
     interoperability requirements from the RFC
   - Requirements (Constraints) → ABNF grammars, field sizes, encoding
   - Dependencies → Phase 6 cross-RFC dependencies
   - Assumptions → Implicit assumptions identified during extraction
   - Risks → Ambiguities flagged during extraction
   - Revision History → RFC publication date and any errata

7. **Quality checklist** — before finalizing, verify:
   - [ ] Every normative section of the RFC has at least one extracted
         requirement or is documented as informational-only
   - [ ] Every requirement cites its source RFC section and quoted
         excerpt
   - [ ] Every requirement preserves its RFC 2119 keyword strength
   - [ ] Every requirement has at least one acceptance criterion
   - [ ] State machine transitions (if any) are complete — no missing
         transitions for defined states and events
   - [ ] Cross-RFC dependencies are listed with their normative status
   - [ ] Ambiguous RFC text is flagged with possible interpretations
   - [ ] REQ-IDs follow the `REQ-{{tag}}-<SECTION>-<NNN>` scheme
         consistently

## Non-Goals

- Do NOT implement the protocol — extract requirements only.
- Do NOT resolve ambiguities in the RFC — flag them for human review.
- Do NOT add requirements from referenced RFCs — only extract from
  the provided RFC text. List cross-RFC dependencies so the user can
  run separate extractions on those RFCs.
- Do NOT assess whether the RFC's design is correct — only extract
  what it specifies.
- Do NOT generate test cases — that is the job of `author-validation-plan`
  consuming the output of this template.
