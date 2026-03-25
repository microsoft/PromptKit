<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-architecture-spec
description: >
  Generate an architecture specification document that describes the
  structure, scope, and cross-cutting concerns of a software component
  or system. Covers protocol/system description, network and software
  architecture, programming interfaces, persisted state, and
  architectural implications (security, performance, management,
  observability, testing).
persona: software-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: architecture-spec
params:
  project_name: "Name of the project, component, or system"
  project_description: "High-level description of what the component does, why it exists, and its key capabilities"
  technical_context: "Existing architecture, platform targets, tech stack, team conventions, and known constraints"
  requirements_doc: "(Optional) A requirements document to trace architectural decisions back to"
  audience: "Who will read the output — e.g., 'peer architects', 'development team', 'architecture review board'"
input_contract:
  type: requirements-document
  required: false
  description: >
    Optionally consumes a requirements document. When provided,
    architectural decisions should trace back to requirement IDs.
    When absent, the template operates from the project description
    and technical context alone.
output_contract:
  type: architecture-spec
  description: >
    A structured architecture specification document covering system
    scope, architecture description, programming interfaces, and
    cross-cutting architectural implications.
---

# Task: Author Architecture Specification

You are tasked with producing an **architecture specification** that
describes the structure, scope, and cross-cutting concerns of the
component or system described below.

## Inputs

**Project Name**: {{project_name}}

**Project Description**:
{{project_description}}

**Technical Context**:
{{technical_context}}

**Requirements Document** (if provided):
{{requirements_doc}}

## Instructions

1. **Read the project description and technical context carefully.**
   Every architectural decision MUST be grounded in the provided
   inputs. If a requirements document is provided, trace major
   architectural choices back to specific REQ-IDs where applicable.

2. **Apply the anti-hallucination protocol.** Do NOT invent technical
   constraints, platform capabilities, or protocol features that are
   not stated or directly inferable from the inputs. If information
   is missing, state it as an assumption in Section 4 or as an open
   question — do not fabricate.

3. **Format the output** according to the architecture-spec format
   specification.

4. **Section 5 (Architecture Description) is the core.** Invest the
   most depth here:
   - If the system implements a protocol, dedicate 5.1 to a thorough
     protocol description with subsections for each major feature.
   - Software architecture (5.3) MUST include component diagrams
     (text-based) showing boundaries and dependencies.
   - For each programming interface (5.4), describe shape and scope
     but do NOT include API prototypes.

5. **Section 6 (Architectural Implications) covers cross-cutting
   concerns.** Every subsection MUST be populated:
   - Security: attack surfaces, crypto choices, trust boundaries
   - Performance: scale up, scale down, and offload strategies
   - Management: configuration and administrative interfaces
   - Observability: logging, tracing, metrics, telemetry
   - Testing: strategy, challenges, and infrastructure

6. **Diagrams**: Use text-based diagram formats (Mermaid, PlantUML,
   or ASCII) so diagrams are version-control friendly.

7. **Quality checklist** — before finalizing, verify:
   - [ ] Every section in the format specification is populated
   - [ ] Definitions table covers all domain-specific terms used
   - [ ] Scope clearly states what is in and out of bounds
   - [ ] Assumptions distinguish temporary from permanent limitations
   - [ ] Software architecture includes component diagrams
   - [ ] All cross-cutting concerns (Section 6) are addressed
   - [ ] References table lists all cited specifications and documents
   - [ ] No fabricated details — all unknowns marked with [UNKNOWN]
         or listed as assumptions

## Non-Goals

- Do NOT generate requirements — consume them as input if provided.
- Do NOT include full API prototypes — reference separate API
  specification documents instead.
- Do NOT design the implementation — this is an architecture document
  that describes structure and boundaries, not implementation details.
- Do NOT make platform or technology choices without stating them as
  assumptions when the inputs do not mandate a specific choice.
