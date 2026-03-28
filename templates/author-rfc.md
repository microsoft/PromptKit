<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-rfc
description: >
  Author an RFC or internet-draft using the xml2rfc Version 3 vocabulary.
  Produces structurally valid xml2rfc XML from a project description,
  protocol design, or requirements document. Output can be processed
  directly by the xml2rfc toolchain.
persona: protocol-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: rfc-document
params:
  document_title: "Title of the RFC or internet-draft"
  draft_name: "Draft name — e.g., 'draft-smith-quic-extensions-00'"
  authors: "Author information — name(s), organization(s), email(s)"
  abstract: "1-3 paragraph abstract summarizing the document's purpose and scope"
  protocol_description: "Description of the protocol, mechanism, or convention being specified"
  requirements_doc: "(Optional) A structured requirements document to trace normative statements back to"
  technical_context: "Technical context — related RFCs, target use cases, deployment considerations"
  category: "Document category — 'std' (Standards Track), 'info' (Informational), 'exp' (Experimental), or 'bcp' (Best Current Practice)"
  audience: "Who will read the output — e.g., 'IETF working group members', 'protocol implementors', 'internet-draft reviewers'"
input_contract: null
output_contract:
  type: rfc-document
  description: >
    A structurally valid xml2rfc v3 document that can be processed by
    the xml2rfc toolchain to produce RFC-formatted text, HTML, and PDF.
---

# Task: Author RFC / Internet-Draft

You are tasked with producing a **structurally valid xml2rfc v3
document** (per RFC 7991) that specifies a protocol, mechanism,
or convention.

## Inputs

**Document Title**: {{document_title}}

**Draft Name**: {{draft_name}}

**Authors**: {{authors}}

**Abstract**: {{abstract}}

**Protocol / Mechanism Description**:
{{protocol_description}}

**Requirements Document** (if provided):
{{requirements_doc}}

**Technical Context**:
{{technical_context}}

**Category**: {{category}}

**Audience**: {{audience}}

## Instructions

1. **Produce valid xml2rfc v3 XML.** The output must conform to the
   `rfc-document` format specification. It must be well-formed XML
   that the `xml2rfc` tool can process without errors.

2. **Structure the document** following standard RFC conventions:
   - **Introduction**: Problem statement, motivation, and document scope.
     Include a Requirements Language subsection referencing RFC 2119
     and RFC 8174 if the document uses normative keywords.
   - **Terminology / Definitions**: Define all domain-specific terms.
   - **Protocol / Mechanism specification**: The core technical content.
     Use nested sections for distinct features, message formats, state
     machines, and procedures.
   - **Security Considerations**: Threat analysis and required
     mitigations. This section MUST NOT be empty.
   - **IANA Considerations**: Registry actions, or "This document has
     no IANA actions."

3. **Use normative language precisely.** Wrap all RFC 2119 keywords
   in `<bcp14>` tags. Use MUST for absolute requirements, SHOULD for
   strong recommendations with justified exceptions, MAY for truly
   optional behavior. Do NOT use normative keywords in informational
   or rationale text.

4. **If a requirements document is provided**, trace normative
   statements back to REQ-IDs using XML comments:
   ```xml
   <!-- REQ-TCP-042 -->
   <t>The sender <bcp14>MUST</bcp14> retransmit...</t>
   ```

5. **Include figures for**:
   - Protocol state machines (ASCII art in `<artwork type="ascii-art">`)
   - Message formats and header layouts
   - Architecture or topology diagrams
   - ABNF grammars (in `<artwork type="abnf">`)

6. **Apply the anti-hallucination protocol** throughout:
   - Do NOT invent protocol features or behaviors not described in
     the inputs
   - Do NOT fabricate RFC references — only reference RFCs that are
     cited in the inputs or are well-known foundational documents
     (RFC 2119, RFC 8174, etc.)
   - If information is missing, insert an XML comment marking the gap:
     `<!-- TODO: Specify behavior for [topic] -->`

7. **Apply the self-verification protocol** before finalizing:
   - Verify the XML is well-formed (all tags closed, attributes quoted)
   - Verify every `<bcp14>` usage is in a normative context
   - Verify every `<xref>` target has a corresponding reference or
     anchor
   - Verify Security Considerations is not empty
   - Verify IANA Considerations is present

## Non-Goals

- Do NOT produce plain-text RFC format — produce xml2rfc v3 XML only.
  The xml2rfc toolchain handles rendering to text/HTML/PDF.
- Do NOT evaluate whether the protocol design is sound — focus on
  accurate, well-structured specification of what the inputs describe.
- Do NOT include implementation guidance or sample code — RFCs specify
  protocol behavior, not implementations.
- Do NOT add boilerplate text (copyright notices, IETF trust statements) —
  the xml2rfc tool inserts these automatically.

## Quality Checklist

Before finalizing, verify:

- [ ] Output is well-formed XML (all tags closed, attributes quoted,
      special characters escaped)
- [ ] Document follows the `rfc-document` format skeleton
      (`<rfc>` → `<front>` + `<middle>` + `<back>`)
- [ ] Front matter is complete (title, authors, date, abstract)
- [ ] Requirements Language subsection is present (if normative
      keywords are used)
- [ ] All normative keywords are wrapped in `<bcp14>` tags
- [ ] Security Considerations section is present and non-empty
- [ ] IANA Considerations section is present
- [ ] References are split into Normative and Informative
- [ ] All RFC references use `xi:include` with IETF BibXML URLs
- [ ] Every `<section>` has an `anchor` attribute
- [ ] Every `<xref>` target resolves to a reference or anchor
- [ ] Artwork uses `<![CDATA[...]]>` wrapping
- [ ] No fabricated RFC numbers or protocol features
