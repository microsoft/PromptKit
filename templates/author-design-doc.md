<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) Standard Prompt Library Contributors -->

---
name: author-design-doc
description: >
  Generate a software design document that addresses the requirements
  specified in a requirements document.
persona: software-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: design-doc
params:
  project_name: "Name of the project or feature"
  requirements_doc: "The requirements document content (output of author-requirements-doc)"
  technical_context: "Existing architecture, tech stack, constraints, team conventions"
input_contract:
  type: requirements-document
  description: >
    A requirements document produced by the author-requirements-doc template
    or equivalent, with numbered REQ-IDs.
output_contract:
  type: design-document
  description: >
    A structured design document with architecture, API contracts,
    data models, and tradeoff analysis.
---

# Task: Author Design Document

You are tasked with producing a **design document** that addresses the
requirements specified below.

## Inputs

**Project Name**: {{project_name}}

**Requirements Document**:
{{requirements_doc}}

**Technical Context**:
{{technical_context}}

## Instructions

1. **Read the requirements document carefully.** Every design decision
   MUST trace back to one or more REQ-IDs. If a design element does not
   correspond to any requirement, flag it as `[DESIGN-ONLY]` with a
   justification.

2. **Apply the anti-hallucination protocol.** Do NOT invent requirements
   or technical constraints that are not present in the inputs. If
   information is missing (e.g., "what database to use"), state the
   decision point as an Open Question rather than assuming.

3. **Format the output** according to the design-doc format specification.

4. **For every significant design decision**, provide a tradeoff analysis:
   - What alternatives were considered?
   - Why was this option chosen?
   - What is sacrificed?
   - How hard is it to reverse this decision?

5. **Diagrams**: Use text-based diagram formats (Mermaid, PlantUML, or ASCII)
   so diagrams are version-control friendly.

6. **Quality checklist** — before finalizing, verify:
   - [ ] Every requirement is addressed by at least one design element
   - [ ] Every API contract specifies error handling
   - [ ] Tradeoff analysis is present for non-trivial decisions
   - [ ] Security considerations section is populated
   - [ ] Open questions are listed, not silently resolved
   - [ ] No fabricated details — all unknowns marked with [UNKNOWN]
