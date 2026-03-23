# PromptKit Roadmap

> **Status:** Items marked ✅ are shipped. Everything else is **planned
> or exploratory** — items may change, be reprioritized, or be dropped.
> No timelines or commitments are implied.

PromptKit treats prompts as programs: personas define roles, protocols
define control flow, formats define structure, and typed contracts define
correctness. This roadmap extends that architecture toward a broader
goal — a **semantic engineering platform** that maintains alignment
between the artifacts that define a software system: specifications,
designs, code, tests, and standards.

The capabilities below are organized into pillars that build on each
other. Each pillar addresses a distinct class of engineering risk.

---

## Distribution & Packaging

### npm Scope Migration

The CLI package is published on npm as `@alan-jowett/promptkit`. The
plan is to migrate to an official scope (e.g., `@microsoft/promptkit`)
once organizational approval is in place. The CLI commands and
functionality will remain identical.

### Trusted Publishing

The npm publish workflow uses OIDC-based trusted publishing from GitHub
Actions. This eliminates the need for npm tokens as secrets — publishing
is authenticated via GitHub's identity provider.

## Copilot Extension

> **Status: Not yet started.**

The highest-impact distribution channel would be a **GitHub Copilot
Extension** that brings PromptKit directly into Copilot Chat:

```
@promptkit investigate this bug — segfault in packet_handler.c
when processing >100 connections
```

Copilot Chat would match the request to a template, ask for missing
parameters inline, assemble the prompt, execute it in context, and
produce a structured report. User-initiated and user-reviewed —
PromptKit structures the interaction, it does not act autonomously.

**Benefits over CLI:** Zero setup, context-aware (Copilot has codebase
access), inline execution, discoverability (`@promptkit list`), and
team-wide deployment via org-level extension install.

**Technical approach:** Wrap the existing assembly engine
(`cli/lib/assemble.js`) in a Copilot Extension server. Template
selection and parameter gathering happen through Copilot Chat's
conversational interface.

## VS Code Extension

> **Status: Not yet started.** Exploratory idea.

A lighter-weight option: a VS Code extension with command palette
integration, a template browser, one-click assembly, and integration
with VS Code's Copilot Chat via chat participants.

---

## Pillar 1: Specification Integrity

> **Threat model:** Correctness drift — mismatches between requirements,
> design, code, and tests that accumulate silently as artifacts evolve
> independently.

### Phase 1: Cross-Document Specification Audits ✅

Shipped: `audit-traceability` template, `specification-analyst` persona,
`traceability-audit` protocol, and `specification-drift` taxonomy
(D1–D7).

Audits requirements, design, and validation documents for untraced
requirements (D1), untested requirements (D2), orphaned design decisions
(D3), orphaned test cases (D4), assumption drift (D5), constraint
violations (D6), and acceptance criteria mismatch (D7). Design document
is optional. Extends the `document-lifecycle` pipeline as stage 4.

### Phase 2: Bidirectional Code ↔ Spec Audits ✅

- **`audit-code-compliance`** ✅ — Given requirements + design, audit
  source code for unimplemented requirements (D8), undocumented behavior
  (D9), and constraint violations in code (D10). Answers: "Does the code
  implement what was specified?"
- **`audit-test-compliance`** ✅ — Given requirements + validation plan,
  audit test code for unimplemented test cases (D11), untested acceptance
  criteria (D12), and assertion mismatches (D13). Answers: "Do the tests
  verify what the plan says they should?"
- **Full drift surface** — With both templates, PromptKit can surface
  spec-only behavior (specified but not built), code-only behavior
  (built but not specified), and mismatched assumptions between
  documents and implementation.

**Depends on:** Phase 1 (persona, taxonomy, format).

### Phase 3: Invariant Extraction & Spec Evolution

> **Status:** Invariant extraction shipped (`extract-invariants` template,
> `invariant-extraction` protocol). Spec evolution diffing is planned.

- **Invariant extraction template** ✅ — Extract MUST/SHOULD/MAY
  constraints, state transitions, timing assumptions, and error
  conditions from existing specifications or source code. Produces
  structured, machine-readable invariant sets that feed into audit
  templates. Related to (but distinct from) the existing
  `reverse-engineer-requirements` template, which extracts full
  requirements documents; invariant extraction is narrower and produces
  a denser, more formal output.
- **Spec evolution diffing** — Compare two versions of the same
  specification to detect breaking changes, relaxed constraints, and
  shifted assumptions. Same pattern as the traceability audit but
  applied across time rather than across document types.

**Depends on:** Phase 1 (taxonomy for classifying invariant changes).

---

## Pillar 2: Software Archaeology

> **Threat model:** Legacy risk — undocumented systems, hidden
> invariants, accidental complexity, and knowledge loss in codebases
> that outlive their authors.

PromptKit already has the `reverse-engineer` persona and the
`requirements-from-implementation` protocol, which together extract
structured requirements from source code.This pillar extends that foundation to
handle the harder problems of legacy system understanding.

### Code Behavior Reconstruction

Extract the implicit behavioral model from a codebase:
- **State machine extraction** — Identify states, transitions, guards,
  and actions from code that implements state-driven logic without
  explicit state machine definitions.
- **Control flow reconstruction** — Map the actual execution paths
  through complex, nested, or macro-heavy code. Trace through
  indirection (callbacks, vtables, event dispatchers) to the real
  behavior.
- **Implicit invariant extraction** — Surface invariants the code
  maintains but never documents: ordering assumptions, mutual exclusion
  patterns, resource lifecycle guarantees.

**New components needed:** Template (`reconstruct-behavior`), protocol
(`behavior-reconstruction`). Reuses `reverse-engineer` persona.

### Reverse-Spec Generation

> **Status: Partially shipped.** The `reverse-engineer-requirements`
> template exists and extracts structured requirements from code.

Extend the existing template with:
- **Gap detection** — Flag code behaviors that are ambiguous (could be
  intentional or a bug) and require human judgment to classify.
- **Documentation freshness audit** — Given existing documentation and
  the source code, identify where the documentation is stale, missing,
  or contradicts the implementation. Feeds into `audit-code-compliance`.

### Hidden Behavior Detection

Identify behaviors in code that are present but not obvious from the
public API or documentation:
- **Debug paths and diagnostic modes** — Code paths gated by environment
  variables, compile flags, or magic values that enable behavior not
  described in the public interface.
- **Bypass logic** — Code that skips validation, authentication, or
  authorization under specific conditions.
- **Accidental backdoors** — Unintentional code paths that allow
  privilege escalation or data access outside the intended control flow.

This overlaps with Pillar 4 (Security) but is scoped here as
archaeology — understanding what legacy code actually does, not
assessing whether it's exploitable.

**New components needed:** Template (`detect-hidden-behavior`), protocol
(`hidden-behavior-analysis`). Reuses `security-auditor` or
`reverse-engineer` persona depending on framing.

**Depends on:** Code behavior reconstruction (same underlying analysis).

---

## Pillar 3: Protocol & Standards Engineering

> **Threat model:** Protocol risk — drift between standards documents
> and implementations, interoperability failures across implementations,
> and breaking changes introduced by specification revisions.

### RFC Normalization

> **Status:** `extract-rfc-requirements` template, `rfc-extraction`
> protocol, and `reconcile-requirements` template shipped. The
> `rfc-document` output format (xml2rfc v3) is planned.

An RFC is fundamentally a requirements document with a specific format
and RFC 2119 normative language — the same MUST/SHOULD/MAY keywords
that PromptKit's `requirements-elicitation` protocol already produces.
RFC support is primarily an **input normalization** and **output format**
problem, not a new capability stack.

**RFC in** — `extract-rfc-requirements` template ✅:
- Takes an RFC (or internet-draft) as input, produces a standard
  requirements-document as output.
- Reuses the `specification-analyst` persona.
- Uses the `rfc-extraction` protocol covering: section
  classification, normative statement extraction, state machine
  identification, cross-RFC dependency tracking, and IANA/security
  considerations parsing.
- Once normalized to a requirements-document, all existing audit
  machinery applies — `audit-traceability`, `audit-code-compliance`,
  spec evolution diffing.

**Multi-source reconciliation** — `reconcile-requirements` template ✅:
- Reconciles multiple requirements documents from different sources
  (RFCs, implementations, specifications) into a unified spec.
- Classifies requirements by cross-source compatibility (Universal,
  Majority, Divergent, Extension).

**Spec out** — `rfc-document` format:
- Produces xml2rfc v3 (RFC 7991) output: `<rfc>`, `<section>`,
  `<bcp14>MUST</bcp14>`, `<artwork>`, proper `<references>` blocks.
- Structurally valid xml2rfc that feeds directly into the `xml2rfc`
  toolchain.
- Pairs with `author-requirements-doc` or a new `author-rfc` template
  for writing internet-drafts from scratch.

### RFC Self-Consistency Audits

Apply the traceability audit methodology to a single RFC:
- Internal consistency — do normative statements in different sections
  contradict each other?
- Normative language correctness — are MUST/SHOULD/MAY used precisely
  per RFC 2119?
- State machine completeness — are all states reachable? Are transitions
  defined for all inputs in all states?
- Cross-reference integrity — do referenced sections and RFCs exist?

This is a variant of `audit-traceability` applied within a single
document rather than across a document set. May be a template parameter
rather than a separate template.

### RFC → Validation Spec Generation

Given a normalized RFC, generate structured test conditions:
- MUST requirements → mandatory test cases
- SHOULD requirements → recommended test cases with justification for
  skipping
- Negotiation semantics → protocol exchange test sequences
- Error handling → negative test cases for each specified error condition
- Timing and ordering → sequence-dependent test scenarios

This is the existing `author-validation-plan` template applied to
RFC-derived requirements — no new template needed if the normalization
step produces a standard requirements-document.

### RFC ↔ Implementation Audits

Audit a protocol implementation against its governing RFC:
- Apply `audit-code-compliance` with RFC-derived requirements as input.
- Pay special attention to MUST violations (non-compliance),
  undocumented extensions (D9), and security-sensitive deviations.
- Flag behaviors that are technically permitted (MAY/SHOULD) but
  diverge from common practice — these cause interoperability failures
  even when both sides are "correct."

**Depends on:** RFC normalization, Phase 2 (`audit-code-compliance`).

### Multi-Implementation Semantic Diffing

Compare two or more implementations of the same protocol to surface
behavioral divergence:
- **Interop behavior matrix** — For each normative requirement, record
  how each implementation handles it. Surface cases where
  implementations make different choices for SHOULD/MAY requirements.
- **Extension handling differences** — How each implementation handles
  unknown extensions, unexpected fields, or version mismatches.
- **Negotiation divergence** — Where implementations agree on what to
  negotiate but disagree on how (ordering, fallbacks, error recovery).

**New components needed:** Template (`diff-implementations`), format
(`interop-matrix` or use `multi-artifact`), protocol
(`semantic-diff`).

**Depends on:** RFC normalization, invariant extraction.

### Specification Evolution

- **Semantic RFC diffing** — Given two versions of an RFC or spec,
  produce a structured diff at the requirements level (not text level):
  which requirements were added, removed, relaxed, or tightened. Uses
  the invariant extraction output from both versions.
- **Migration guidance generation** — Given a semantic diff, produce
  actionable migration guidance: what implementations must change,
  what tests must be updated, what behaviors are newly required or
  prohibited.
- **Breaking change detection** — Classify changes as backward-
  compatible, backward-incompatible, or conditionally compatible (only
  breaks implementations that relied on a SHOULD or MAY behavior).

**Depends on:** Phase 3 (invariant extraction, spec evolution diffing).

---

## Pillar 4: Security & Emergent Behavior Analysis

> **Threat model:** Security risk — undocumented capabilities, bypass
> paths, emergent behaviors, and side channels that exist in code but
> are absent from specifications.

PromptKit already has the `security-auditor` persona and the
`security-vulnerability` analysis protocol. This pillar extends that
foundation toward **semantic security analysis** — finding security
issues that arise from the gap between what a system is supposed to do
and what it actually does.

### Undocumented Capability Detection

Cross-reference specification and implementation to find capabilities
the spec does not authorize:
- Code implements behavior not in any requirement (D9 from Phase 2,
  but assessed through a security lens).
- Spec explicitly forbids behavior that code permits.
- Configuration surfaces that enable undocumented modes of operation.

This is `audit-code-compliance` composed with the `security-auditor`
persona and `security-vulnerability` protocol — not a new template, but
a documented composition pattern.

### Downgrade & Bypass Path Detection

Analyze protocol implementations for negotiation weaknesses:
- **Downgrade paths** — Can an attacker force the system to use a weaker
  algorithm, older protocol version, or less secure mode?
- **Validation bypass** — Are there code paths that skip input
  validation, authentication, or authorization checks?
- **Missing enforcement** — Requirements that specify security controls
  (encryption, access checks, rate limiting) where the code path exists
  but enforcement is conditional or incomplete.

**New components needed:** Protocol (`downgrade-path-analysis`). Reuses
`security-auditor` persona, `investigation-report` format.

**Depends on:** Phase 2 (`audit-code-compliance`), Pillar 2 (hidden
behavior detection).

### Emergent Behavior Analysis

Identify behaviors that arise from system interactions rather than
explicit design:
- **Side channels** — Timing differences, error message variations, or
  resource consumption patterns that leak information.
- **Implicit dependencies** — Behaviors that depend on execution order,
  initialization sequence, or environmental state not specified in any
  contract.
- **Composition hazards** — Safe components that produce unsafe behavior
  when composed (e.g., two modules that individually validate input but
  together create a TOCTOU race).

This is the most speculative item on the roadmap. It requires the LLM
to reason about system-level interactions, not just individual
components. Feasibility depends on context window size and the quality
of the system description provided.

**New components needed:** Protocol (`emergent-behavior-analysis`).
Reuses `security-auditor` persona.

**Depends on:** Pillar 2 (code behavior reconstruction).

---

## Pillar 5: Continuous Semantic Integration

> **Threat model:** Evolution risk — artifacts that were once aligned
> gradually drift as the system changes. The drift is invisible until
> it causes a failure.

This pillar is the long-term convergence point of Pillars 1–4. It is
an **integration and tooling** concern — the templates and protocols
from the other pillars provide the audit methodology; this pillar
provides the automation that runs them continuously.

### CSI Pipeline Integration

Enable specification integrity checks as part of continuous integration:
- Every PR triggers doc ↔ code ↔ validation audits using the
  appropriate audit templates.
- Drift findings are surfaced as PR comments or check annotations.
- Severity thresholds gate merging (e.g., block on D6/D10 constraint
  violations, warn on D3/D9 orphaned items).

This is a **separate tool** that consumes PromptKit prompts, not a
PromptKit template. PromptKit's role is providing the composable audit
methodology; the CI integration invokes it.

**New components needed:** A CI runner (likely a GitHub Action) that
assembles and executes audit prompts, parses investigation-report
output, and maps findings to PR annotations.

**Depends on:** Pillars 1–2 (the audit templates it runs).

### Living Specifications

Support specifications that evolve with their implementation:
- **Spec update proposals** — When `audit-code-compliance` detects
  D9 (undocumented behavior), optionally generate a candidate
  requirement to add to the spec rather than flagging it as scope creep.
- **Bidirectional sync** — When code changes, detect which spec
  sections are affected and flag them for review. When specs change,
  detect which code and tests need updating.
- **Spec health dashboard** — Aggregate audit findings across a project
  to produce a specification health score: traceability coverage,
  constraint compliance, test alignment.

This builds on CSI but adds a feedback loop — instead of just detecting
drift, the system proposes resolutions.

**Depends on:** CSI pipeline, all audit templates.

---

## New Components

### Shipped

The following components from earlier roadmap plans have been shipped:

- **Templates:** `author-implementation-prompt` ✅,
  `author-test-prompt` ✅, `author-workflow-prompts` ✅
- **Protocols:** `requirements-reconciliation` ✅,
  `workflow-arbitration` ✅
- **Personas:** `implementation-engineer` ✅, `test-engineer` ✅,
  `workflow-arbiter` ✅
- **Formats:** `multi-artifact` ✅

### Planned Templates

Templates based on common engineering workflows:

### Code-Related
- `review-api` — API design review (contracts, versioning, error
  handling)
- `review-performance` — performance audit with profiling guidance
- `migrate-codebase` — language or framework migration planning
- `document-codebase` — generate documentation from existing code

### DevOps
- `author-monitoring` — observability and alerting configuration
- `incident-response` — structured incident investigation and postmortem
- `capacity-planning` — resource estimation and scaling analysis

### Documentation
- `author-adr` — Architecture Decision Records
- `author-runbook` — operational runbooks with decision trees
- `author-onboarding` — team onboarding documentation

## New Protocols

### Analysis Protocols
- `performance-analysis` — profiling methodology, bottleneck
  identification
- `api-design-review` — REST/gRPC contract analysis, versioning,
  backward compatibility
- `dependency-audit` — supply chain security, license compliance,
  version health

### Reasoning Protocols
- `threat-modeling` — STRIDE-based systematic threat identification
- `migration-planning` — incremental migration with rollback strategies
- `cost-benefit-analysis` — quantitative tradeoff analysis framework
- `downgrade-path-analysis` — protocol negotiation weakness detection
- `emergent-behavior-analysis` — system-level interaction hazards
- `semantic-diff` — behavioral comparison across implementations

## New Personas

- `data-engineer` — data pipelines, ETL, schema design, data quality
- `sre-engineer` — reliability, observability, incident management, SLOs
- `frontend-engineer` — UI/UX, accessibility, performance, component
  design
- `protocol-analyst` — protocol state machines, negotiation semantics,
  interoperability analysis, RFC structure (for Pillar 3 templates that
  need domain expertise beyond what `specification-analyst` provides)

## New Formats

- `rfc-document` — xml2rfc v3 (RFC 7991) output for authoring
  internet-drafts
- `interop-matrix` — structured comparison of implementation behaviors
  across multiple codebases (or use `multi-artifact`)
- `invariant-set` — dense, machine-readable invariant definitions
  (state machines, constraints, timing) extracted from specs or code

## New Taxonomies

- **Protocol drift** — Classification scheme for divergence between
  a protocol specification and its implementation(s). Covers
  non-compliance (MUST violation), interop hazards (divergent SHOULD
  choices), undocumented extensions, and negotiation failures.

## Testing & Quality

### Automated Prompt Regression Testing

Build tooling to automate the reference comparison methodology:

1. Regenerate all prompts in `tests/generated/` from current library
2. Use an LLM to perform structured gap analysis against references
3. Produce a summary report with pass/fail per dimension
4. Run as a CI check on PRs that modify components

### Prompt Quality Metrics

Define quantitative metrics for prompt quality:
- Component coverage (does the prompt include all declared layers?)
- Parameter completeness (are all `{{param}}` placeholders resolved?)
- Section completeness (does the output format have all required
  sections?)
- Guardrail presence (are anti-hallucination rules included?)

## Community & Ecosystem

### Template Marketplace

Enable community-contributed templates with:
- A standard submission process (PR-based, using `extend-library`)
- Quality gates (manifest sync, reference comparison, peer review)
- Discoverability (categorized listing, search, ratings)

### Organization-Private Components

Support organizations maintaining private personas, protocols, and
templates that layer on top of the public library:

```
~/.promptkit/           # user-level overrides
.promptkit/             # project-level overrides
node_modules/promptkit/content/  # base library
```

The assembly engine would search for components in order: project →
user → base library.

---

## Dependency Map

The following shows how the pillars and phases build on each other.
Items lower in the graph depend on items above them.

```
Phase 1: Cross-Doc Audits ✅
Phase 2: Code ↔ Spec Audits ✅
    │
    ├── Phase 3: Invariant Extraction ✅ / Spec Evolution (planned)
    │       │
    │       ├── Pillar 3: Protocol & Standards Engineering
    │       │       ├── RFC Normalization ✅ (extract + reconcile)
    │       │       ├── RFC ↔ Implementation Audits
    │       │       ├── Multi-Implementation Semantic Diffing
    │       │       └── Specification Evolution & Migration
    │       │
    │       └── Pillar 5: Continuous Semantic Integration
    │               ├── CSI Pipeline
    │               └── Living Specifications
    │
    ├── Pillar 2: Software Archaeology
    │       ├── Code Behavior Reconstruction
    │       ├── Reverse-Spec Generation (partially shipped)
    │       └── Hidden Behavior Detection
    │
    └── Pillar 4: Security & Emergent Behavior
            ├── Undocumented Capability Detection
            ├── Downgrade & Bypass Path Detection
            └── Emergent Behavior Analysis
```

## Contributing to the Roadmap

Have ideas for new templates, protocols, or features? The best ways to
contribute:

1. **File an issue** on
   [github.com/microsoft/promptkit](https://github.com/microsoft/promptkit)
2. **Start a discussion** for broader feature ideas
3. **Submit a PR** — use the `extend-library` template to design new
   components that follow existing conventions
