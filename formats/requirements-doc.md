<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: requirements-doc
type: format
description: >
  Output format for requirements documents. Defines section structure,
  requirement numbering, and acceptance criteria format.
produces: requirements-document
---

# Format: Requirements Document

The output MUST be a structured requirements document with the following
sections in this exact order. Do not omit sections — if a section has no
content, state "None identified" with a brief justification.

## Document Structure

```markdown
# <Project/Feature Name> — Requirements Document

## 1. Overview
<1–3 paragraphs: what this project/feature is, the problem it solves,
and who it is for.>

## 2. Scope

### 2.1 In Scope
<Bulleted list of capabilities and behaviors this document covers.>

### 2.2 Out of Scope
<Bulleted list of explicitly excluded capabilities.
Every exclusion MUST include a brief rationale.>

## 3. Definitions and Glossary
<Table of terms used in this document that could be ambiguous.
Format: | Term | Definition |>

## 4. Requirements

### 4.1 Functional Requirements
<Numbered requirements using REQ-<CAT>-<NNN> identifiers.
Each requirement follows the template:

REQ-<CAT>-<NNN>: The system MUST/SHALL/SHOULD/MAY <behavior>
when <condition> so that <rationale>.

Acceptance Criteria:
- AC-1: <specific, measurable test>
- AC-2: <specific, measurable test>
>

### 4.2 Non-Functional Requirements
<Performance, scalability, reliability, security requirements.
Same format as functional requirements.>

### 4.3 Constraints
<Technical, regulatory, or business constraints that limit
the solution space. Each with a stable identifier: CON-<NNN>.>

## 5. Dependencies
<Requirements that depend on external systems, teams, or
other requirements documents. Format:

DEP-<NNN>: <This requirement set> depends on <external dependency>
for <reason>. Impact if unavailable: <consequence>.>

## 6. Assumptions
<Explicit assumptions underlying these requirements.
Each with identifier ASM-<NNN> and a note on what happens
if the assumption is wrong.>

## 7. Risks
<Known risks to the requirements or their implementation.
Format: | Risk ID | Description | Likelihood | Impact | Mitigation |>

## 8. Revision History
<Table: | Version | Date | Author | Changes |>
```

## Formatting Rules

- Use RFC 2119 keywords (MUST, SHOULD, MAY, etc.) consistently.
  Use only the following RFC 2119 keywords for normative language: MUST,
  MUST NOT, SHALL, SHALL NOT, SHOULD, SHOULD NOT, MAY. (The RFC 2119
  synonyms REQUIRED, RECOMMENDED, and OPTIONAL are also acceptable.)
  Do not use informal equivalents ("needs to," "has to," "can," "will").
- Every requirement MUST have at least one acceptance criterion.
- Requirements MUST be atomic — one testable behavior per requirement.
- Cross-references between requirements use the requirement ID
  (e.g., "as defined in REQ-AUTH-003").
