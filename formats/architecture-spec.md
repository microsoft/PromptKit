<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: architecture-spec
type: format
description: >
  Output format for architecture specification documents. Defines
  section structure for protocol/system description, software and
  network architecture, programming interfaces, architectural
  implications, and cross-cutting concerns.
produces: architecture-spec
---

# Format: Architecture Specification

The output MUST be a structured architecture specification with the
following sections in this exact order. Do not omit sections — if a
section has no content, state "None identified" or "Not applicable"
with a brief justification.

## Document Structure

```markdown
# <Project/Component Name> — Architecture Specification

## 1. Introduction
<1–3 paragraphs: what this component or system is, why it exists,
and what problem it solves. Provide enough context for a reader
unfamiliar with the project to understand its purpose and scope.
Include a brief summary of key capabilities.>

## 2. Definitions
<Table of domain-specific terms, acronyms, and concepts used
throughout the document.
Format: | Term | Definition |

Every term that could be ambiguous or domain-specific MUST appear
here. Prefer concise, precise definitions.>

## 3. Architectural Scope
<Define the boundaries of this architecture:
- What platforms, environments, or configurations are covered
- What deployment modes are supported (e.g., user mode, kernel mode,
  cloud, on-premises)
- What is explicitly OUT of scope for this architecture

This section answers: "What does this architecture cover and where
does it stop?">

## 4. Assumptions and Limitations
<Explicit assumptions and known limitations:
- Features not yet implemented and their rationale
- Platform or API dependencies that constrain deployment
- Capabilities intentionally excluded (non-goals) with justification
- Known technical debt or deferred decisions

Each item SHOULD state whether it is temporary (planned for future)
or permanent (by design).>

## 5. Architecture Description

### 5.1 Protocol / System Description
<If the architecture implements a protocol or standard:
- Protocol overview and key features
- How it compares to predecessors or alternatives
- Key design properties (security, reliability, extensibility)

If the architecture is not protocol-based, describe the core system
behavior, algorithms, or processing model instead.

Use subsections (5.1.1, 5.1.2, ...) for each major protocol feature
or system behavior.>

### 5.2 Network Architecture
<How the component interacts with the network:
- Topology diagram (text-based: ASCII, Mermaid, or PlantUML)
- Entities involved (devices, services, proxies, load balancers)
- Protocols used between entities (new, updated, or pre-existing)
- Infrastructure dependencies (DNS, load balancers, NAT, firewalls)
- Interoperability considerations with third-party or legacy systems

If this is a purely local component with no network interaction,
state "Not applicable — this component operates locally" and
briefly explain why.>

### 5.3 Software Architecture
<Internal structure of the software:
- High-level block diagram (text-based)
- Major components and their responsibilities
- Process and binary boundaries
- Component dependencies (internal and external)
- Platform abstraction layers
- Test architecture components (visually distinguished from
  production components)

Use subsections (5.3.1, 5.3.2, ...) for platform-specific variants
or major component deep-dives.>

### 5.4 Programming Interfaces
<For each API or interface surface:
- Shape (REST, RPC, C API, COM, managed, etc.)
- Public vs. private / internal
- Target audience (expert developers, application developers, etc.)
- Whether the API is new, updated, or pre-existing
- Permissions required to invoke
- Extensibility model (if any)

Do NOT include full API prototypes — reference separate API
specification documents instead.>

### 5.5 Persisted State
<For each persistent data store:
- What is stored (configuration, runtime state, credentials, etc.)
- Where it is stored (registry, filesystem, database, etc.)
- Scope (machine-wide, per-user, per-process)
- Permissions required to read and modify
- Format (public or private)
- Upgrade, migration, and data portability considerations

If the component has no persistent state, state "No persistent
state" and explain why (e.g., all state is in-memory and
connection-scoped).>

## 6. Architectural Implications

### 6.1 Security
<Security considerations not covered elsewhere:
- Attack surfaces specific to this architecture
- Cryptographic operations and library choices
- Trust boundaries and privilege levels
- Compliance requirements (FIPS, Common Criteria, SDL)

If the entire architecture is a security subsystem, state
"This entire document addresses security" and summarize the
key security properties.>

### 6.2 Performance
<Performance architecture:

#### 6.2.1 Scale Up
- Key performance metrics (CPU, memory, bandwidth, latency)
- How the architecture scales vertically (threading model,
  resource allocation, parallelism)

#### 6.2.2 Scale Down
- How the architecture operates on constrained devices
  (low memory, limited CPU, battery-powered)

#### 6.2.3 Offloads
- Hardware or software offload opportunities
- What is offloaded vs. handled in software
- Rationale for offload decisions

### 6.3 Management
<Operational management:
- Configuration mechanisms (registry, config files, environment)
- Administrative interfaces (CLI, PowerShell, WMI, REST)
- Group policy or centralized management support
- Diagnostics capabilities>

### 6.4 Observability
<Tracing, logging, metrics, and telemetry:
- Logging framework and levels
- Structured tracing or event formats
- Key metrics and statistics exposed
- Telemetry collection (what, where, privacy implications)
- Diagnostic tooling>

### 6.5 Testing
<Test architecture:
- Testing strategy (unit, integration, end-to-end)
- Test infrastructure and frameworks
- Known testing challenges and how they are addressed
- Test isolation and reproducibility considerations>

## 7. Contacts
<Table of key contacts:
Format: | Role | Name | Alias/Handle |

Include: architect, developers, testers, program managers,
and any domain experts.>

## 8. References
<Table of related documents and specifications:
Format: | Short Name | Description | Location |

Include: protocol specifications, API documents, design docs,
and related architecture specs.>

## 9. Change History
<Table of document revisions:
Format: | Date | Author | Description of Changes |>
```

## Formatting Rules

- Diagrams MUST use text-based formats (Mermaid, PlantUML, ASCII)
  for version control compatibility.
- Every assumption and limitation MUST state whether it is temporary
  or permanent.
- Section 5 subsections SHOULD use hierarchical numbering
  (5.1.1, 5.1.2, ...) for protocol features or component deep-dives.
- Cross-references to external documents use the short name from
  the References table.
- API details belong in separate API specification documents —
  this document describes shape and scope, not prototypes.
- Performance claims MUST be specific and measurable, not vague
  ("fast," "scalable," "lightweight").
