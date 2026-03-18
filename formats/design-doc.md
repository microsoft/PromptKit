<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) Standard Prompt Library Contributors -->

---
name: design-doc
type: format
description: >
  Output format for software design documents. Covers architecture,
  component design, API contracts, data models, and tradeoff analysis.
produces: design-document
consumes: requirements-document
---

# Format: Design Document

The output MUST be a structured design document with the following
sections in this exact order.

## Document Structure

```markdown
# <Project/Feature Name> — Design Document

## 1. Overview
<1–3 paragraphs: what is being designed, the key design goals,
and the relationship to the requirements document (reference by name).>

## 2. Requirements Summary
<Brief summary of the requirements this design addresses.
Reference specific REQ-IDs from the requirements document.
Do NOT restate the full requirements — link to them.>

## 3. Architecture

### 3.1 High-Level Architecture
<Description of the system's major components and their relationships.
Include a text-based diagram (ASCII, Mermaid, or PlantUML).>

### 3.2 Component Descriptions
<For each major component:
- **Name**: component name
- **Responsibility**: what it does (single responsibility)
- **Interfaces**: what it exposes and consumes
- **Dependencies**: what it depends on
- **Constraints**: limitations or assumptions>

### 3.3 Data Flow
<How data moves through the system. Include a text-based
data flow diagram if helpful.>

## 4. Detailed Design

### 4.1 API Contracts
<For each API or interface:
- Endpoint / function signature
- Input parameters with types and constraints
- Output format with types
- Error cases and error response format
- Versioning strategy>

### 4.2 Data Model
<Schemas, tables, or data structures with field descriptions.
Include relationships, constraints, and indexes.>

### 4.3 State Management
<How state is stored, accessed, and synchronized.
Include state transition diagrams for stateful components.>

## 5. Tradeoff Analysis
<For each significant design decision:

### Decision: <short name>
- **Options considered**: <list alternatives>
- **Decision**: <which option was chosen>
- **Rationale**: <why this option was chosen>
- **Tradeoffs**: <what was sacrificed>
- **Reversibility**: <easy/moderate/hard to change later>>

## 6. Security Considerations
<Threat model summary, trust boundaries, and security
design decisions. Reference the security vulnerability
protocol if a full analysis was performed.>

## 7. Operational Considerations
<Deployment, monitoring, logging, alerting, rollback,
and failure recovery strategies.>

## 8. Open Questions
<Unresolved design decisions. For each:
- Question
- Options under consideration
- What information is needed to decide
- Impact of deferring the decision>

## 9. Revision History
<Table: | Version | Date | Author | Changes |>
```

## Formatting Rules

- Every design decision MUST reference the requirement(s) it satisfies.
- APIs MUST specify error handling, not just the happy path.
- Diagrams SHOULD use text-based formats (Mermaid, PlantUML, ASCII)
  for version control compatibility.
- Tradeoff analysis MUST be present for every decision where
  alternatives were viable.
