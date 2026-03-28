<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: rfc-document
type: format
description: >
  Output format for RFC and internet-draft documents using the xml2rfc
  Version 3 vocabulary (RFC 7991). Produces structurally valid XML that
  can be processed by the xml2rfc toolchain to generate RFC-formatted
  text, HTML, and PDF output.
produces: rfc-document
consumes: requirements-document
---

# Format: RFC Document (xml2rfc v3)

The output MUST be a structurally valid xml2rfc Version 3 document
(per RFC 7991) that can be processed by the `xml2rfc` toolchain without
modification. The document MUST follow the structure below.

## Document Structure

The output MUST be a complete XML document with this skeleton:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE rfc [
  <!ENTITY nbsp "&#160;">
  <!ENTITY zwsp "&#8203;">
  <!ENTITY nbhy "&#8209;">
  <!ENTITY wj "&#8288;">
]>

<rfc xmlns:xi="http://www.w3.org/2001/XInclude"
     ipr="trust200902"
     docName="draft-<author>-<topic>-<version>"
     category="<std|info|exp|bcp>"
     submissionType="IETF"
     version="3">

  <front>
    <!-- Document metadata -->
  </front>

  <middle>
    <!-- Main body sections -->
  </middle>

  <back>
    <!-- References, appendices -->
  </back>

</rfc>
```

### Front Matter (`<front>`)

```xml
<front>
  <title abbrev="<Short Title>"><Full Document Title></title>

  <seriesInfo name="Internet-Draft"
              value="draft-<author>-<topic>-<version>"/>

  <author initials="<X.>" surname="<Surname>"
          fullname="<Full Name>">
    <organization><Org Name></organization>
    <address>
      <email><email@example.com></email>
    </address>
  </author>

  <date year="<YYYY>" month="<Month>" day="<DD>"/>

  <area><IETF Area></area>
  <workgroup><Working Group></workgroup>

  <keyword><keyword1></keyword>
  <keyword><keyword2></keyword>

  <abstract>
    <t>
      <Abstract text — 1-3 paragraphs summarizing the document's
       purpose, scope, and key contributions.>
    </t>
  </abstract>
</front>
```

### Middle Sections (`<middle>`)

The middle section contains the normative and informational body.
Sections MUST be numbered and use nested `<section>` elements:

```xml
<middle>
  <section anchor="intro">
    <name>Introduction</name>
    <t>Introductory text...</t>

    <section anchor="intro-requirements-language">
      <name>Requirements Language</name>
      <t>
        The key words "<bcp14>MUST</bcp14>", "<bcp14>MUST NOT</bcp14>",
        "<bcp14>REQUIRED</bcp14>", "<bcp14>SHALL</bcp14>",
        "<bcp14>SHALL NOT</bcp14>", "<bcp14>SHOULD</bcp14>",
        "<bcp14>SHOULD NOT</bcp14>", "<bcp14>RECOMMENDED</bcp14>",
        "<bcp14>NOT RECOMMENDED</bcp14>", "<bcp14>MAY</bcp14>", and
        "<bcp14>OPTIONAL</bcp14>" in this document are to be interpreted
        as described in BCP 14
        <xref target="RFC2119"/> <xref target="RFC8174"/>
        when, and only when, they appear in all capitals, as shown here.
      </t>
    </section>
  </section>

  <section anchor="<topic>">
    <name><Section Title></name>
    <t><Body text...></t>
  </section>

  <!-- Additional sections as needed -->

  <section anchor="security">
    <name>Security Considerations</name>
    <t><Security analysis — MUST NOT be empty.></t>
  </section>

  <section anchor="iana">
    <name>IANA Considerations</name>
    <t><IANA registry actions, or "This document has no IANA actions."</t>
  </section>
</middle>
```

### Back Matter (`<back>`)

```xml
<back>
  <references>
    <name>References</name>

    <references>
      <name>Normative References</name>
      <xi:include
        href="https://bib.ietf.org/public/rfc/bibxml/reference.RFC.2119.xml"/>
      <xi:include
        href="https://bib.ietf.org/public/rfc/bibxml/reference.RFC.8174.xml"/>
      <!-- Additional normative references -->
    </references>

    <references>
      <name>Informative References</name>
      <!-- Informative references -->
    </references>
  </references>

  <!-- Appendices (if any) -->
  <section anchor="appendix-a">
    <name>Appendix Title</name>
    <t><Appendix content></t>
  </section>
</back>
```

## Element Usage Rules

### Normative Keywords

All RFC 2119 / RFC 8174 keywords appearing in normative text MUST be
wrapped in `<bcp14>` tags:

```xml
<t>The sender <bcp14>MUST</bcp14> retransmit if no ACK is received
   within the timeout period.</t>
```

Do NOT use `<bcp14>` for lowercase uses of these words in
non-normative context.

### Cross-References

Use `<xref>` for all cross-references:

```xml
<!-- Reference to another RFC -->
<xref target="RFC9293"/>

<!-- Reference to a section within this document -->
<xref target="security"/>

<!-- Reference with display text -->
<xref target="RFC9293" section="3.4"/>
```

### Lists

Use `<ul>` (unordered) or `<ol>` (ordered) with `<li>` items:

```xml
<ul>
  <li>First item</li>
  <li>Second item</li>
</ul>

<ol type="1">
  <li>Step one</li>
  <li>Step two</li>
</ol>
```

### Figures and Artwork

Use `<figure>` with `<artwork>` for ASCII diagrams and protocol
illustrations:

```xml
<figure anchor="fig-state-machine">
  <name>Connection State Machine</name>
  <artwork type="ascii-art"><![CDATA[
    +-------+    SYN     +-----------+
    | CLOSED|---------->| SYN-SENT  |
    +-------+           +-----------+
  ]]></artwork>
</figure>
```

Use `type="abnf"` for ABNF grammars:

```xml
<figure>
  <name>Message Format</name>
  <artwork type="abnf"><![CDATA[
    message = header body
    header  = field-name ":" field-value CRLF
  ]]></artwork>
</figure>
```

### Tables

Use `<table>` with `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`:

```xml
<table anchor="tbl-codes">
  <name>Status Codes</name>
  <thead>
    <tr><th>Code</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>200</td><td>Success</td></tr>
    <tr><td>404</td><td>Not Found</td></tr>
  </tbody>
</table>
```

### Definition Lists

Use `<dl>` for term-definition pairs:

```xml
<dl>
  <dt>Initiator</dt>
  <dd>The endpoint that sends the first message.</dd>
  <dt>Responder</dt>
  <dd>The endpoint that receives the first message.</dd>
</dl>
```

## Formatting Rules

- Every `<section>` in `<middle>` MUST have an `anchor` attribute
  for cross-referencing.
- The Security Considerations section MUST NOT be empty (per IETF
  requirements).
- The IANA Considerations section MUST be present, even if it states
  "This document has no IANA actions."
- The Requirements Language subsection (referencing RFC 2119 and
  RFC 8174) MUST be included if the document uses normative keywords.
- All RFC references MUST use `xi:include` pointing to the IETF
  BibXML library (`https://bib.ietf.org/public/rfc/bibxml/`).
- Artwork MUST use `<![CDATA[...]]>` to avoid XML escaping issues.
- Do NOT include processing instructions or tool-specific comments
  that are not part of the xml2rfc v3 vocabulary.
- The output MUST be well-formed XML — all tags closed, attributes
  quoted, special characters escaped.
