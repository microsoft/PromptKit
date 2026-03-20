# PromptKit Roadmap

> **Status:** Everything in this document is **planned or exploratory**.
> Nothing listed here is implemented unless it already appears in the
> current release. Items may change, be reprioritized, or be dropped.
> No timelines or commitments are implied.

This document outlines planned features and future direction for PromptKit.
Items are organized by theme, not by timeline.

## Distribution & Packaging

### npm Scope Migration

The CLI package is published on npm as `promptkit` (used via `npx promptkit`).
The plan is to migrate to an official scope (e.g., `@microsoft/promptkit`)
once organizational approval is in place. The CLI commands and functionality
will remain identical.

### Trusted Publishing

The npm publish workflow uses OIDC-based trusted publishing from GitHub
Actions. This eliminates the need for npm tokens as secrets — publishing is
authenticated via GitHub's identity provider.

## Copilot Extension

> **Status: Not yet started.** The following describes a potential future
> direction, not existing functionality.

The highest-impact distribution channel would be a **GitHub Copilot
Extension** that brings PromptKit directly into Copilot Chat. The vision:

### Experience

```
@promptkit investigate this bug — segfault in packet_handler.c
when processing >100 connections
```

Copilot Chat would:
1. Match the request to the `investigate-bug` template
2. Ask for any missing parameters inline
3. Assemble the prompt with the right persona, protocols, and format
4. Execute the investigation in the current Copilot context
5. Produce a structured investigation report

This would still be user-initiated and user-reviewed — PromptKit would
structure the interaction, not act autonomously.

### Benefits Over CLI

- **Zero setup** — no Node.js, no `npx`, no terminal
- **Context-aware** — Copilot already has access to the codebase, so
  parameters like `code_context` can be auto-populated
- **Inline execution** — the assembled prompt executes in place, no
  copy-paste needed
- **Discoverability** — `@promptkit list` in Copilot Chat shows available
  templates
- **Team-wide** — install the extension once for the org, everyone gets
  access to the same prompt library

### Technical Approach

The extension would wrap the existing assembly engine (`cli/lib/assemble.js`)
in a Copilot Extension server. Template selection and parameter gathering
would happen through Copilot Chat's conversational interface. No
autonomous decision-making — the user drives every step.

## VS Code Extension

> **Status: Not yet started.** Exploratory idea.

A lighter-weight option: a VS Code extension that provides:

- Command palette integration (`PromptKit: Assemble Prompt`)
- Template browser with descriptions and parameter forms
- One-click assembly with output to a new editor tab
- Integration with VS Code's Copilot Chat via chat participants

## Specification Integrity & Drift Detection

> **Status: Phase 1 shipped.** The traceability audit template and
> specification-drift taxonomy landed in PR #35. Phases 2–4 are planned.

PromptKit is evolving toward a **specification integrity engine** — a
set of composable templates that detect gaps, contradictions, and drift
across the artifacts that define a software system: requirements, design,
validation plans, source code, and tests.

### Phase 1: Cross-Document Specification Audits ✅

Shipped: `audit-traceability` template, `specification-analyst` persona,
`traceability-audit` protocol, and `specification-drift` taxonomy (D1–D7).

Audits requirements, design, and validation documents for:
- Untraced requirements (D1) and untested requirements (D2)
- Orphaned design decisions (D3) and orphaned test cases (D4)
- Assumption drift (D5) and constraint violations (D6)
- Acceptance criteria mismatch (D7) — illusory test coverage

The design document is optional, enabling two-document (requirements ↔
validation) or three-document audits. Extends the `document-lifecycle`
pipeline as stage 4.

### Phase 2: Bidirectional Code ↔ Spec Audits

The specification-drift taxonomy reserves D8–D13 for these templates:

- **`audit-code-compliance`** — Given requirements + design, audit source
  code for unimplemented requirements, violated constraints, and
  undocumented behavior. Answers: "Does the code implement what was
  specified?"
- **`audit-test-compliance`** — Given requirements + validation plan,
  audit test code for unimplemented test cases, missing assertions, and
  coverage gaps. Answers: "Do the tests verify what the plan says they
  should?"
- **Drift detection** — Surface spec-only behavior (specified but not
  implemented), code-only behavior (implemented but not specified), and
  mismatched assumptions between documents and code.

These templates reuse the `specification-analyst` persona and extend the
`specification-drift` taxonomy. New protocols will handle the distinct
challenge of mapping document-level claims to code-level behavior.

### Phase 3: Invariant Extraction

- **Invariant extraction template** — Extract MUST/SHOULD/MAY constraints,
  state transitions, timing assumptions, and error conditions from
  existing specifications or code. Produces structured, machine-readable
  invariant sets that can feed into audit templates.
- **Spec evolution diffing** — Compare two versions of the same
  specification to detect breaking changes, relaxed constraints, and
  shifted assumptions. Same pattern as traceability audit but applied
  across time rather than across document types.

### Phase 4: RFC & Standards Support

An RFC is fundamentally a requirements document with a specific format
and RFC 2119 normative language — the same MUST/SHOULD/MAY keywords
that PromptKit's `requirements-elicitation` protocol already produces.
This means RFC support is primarily an **input normalization** and
**output format** problem, not a new capability stack.

**RFC in** — `extract-rfc-requirements` template:
- Takes an RFC (or internet-draft) as input, produces a standard
  requirements-document as output.
- Reuses the `specification-analyst` persona (no new persona needed —
  RFCs are specs).
- Needs a thin `rfc-extraction` protocol covering: section
  classification, normative statement extraction, state machine
  identification, cross-RFC dependency tracking, and IANA/security
  considerations parsing.
- Once normalized to a requirements-document, all existing audit
  machinery applies — `audit-traceability` for RFC ↔ design ↔ validation,
  and future `audit-code-compliance` for RFC ↔ implementation.

**Spec out** — `rfc-document` format:
- Produces xml2rfc v3 (RFC 7991) output: `<rfc>`, `<section>`,
  `<bcp14>MUST</bcp14>`, `<artwork>`, proper `<references>` blocks.
- Output is structurally valid xml2rfc that feeds directly into the
  `xml2rfc` toolchain for rendering.
- Pairs with `author-requirements-doc` or a new `author-rfc` template
  for writing internet-drafts from scratch.

**Downstream** — everything else reuses existing components:
- RFC ↔ implementation audits = `audit-code-compliance` with
  RFC-derived requirements as input.
- RFC ↔ validation = `audit-traceability` as-is.
- RFC version diffing = spec evolution diffing from Phase 3.

### Vision: Continuous Semantic Integration

The long-term direction is enabling specification integrity checks as
part of continuous integration — every PR triggers doc ↔ code ↔ validation
audits, drift is caught at commit time, and specifications stay aligned
with implementation.

This is an **integration concern** rather than a PromptKit template — the
component that runs audits in CI would be a separate tool that *uses*
PromptKit prompts. PromptKit's role is providing the composable audit
methodology; the CI integration consumes it.

## New Templates

Planned templates based on common engineering workflows:

### Code-Related
- `review-api` — API design review (contracts, versioning, error handling)
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
- `performance-analysis` — profiling methodology, bottleneck identification
- `api-design-review` — REST/gRPC contract analysis, versioning, backward
  compatibility
- `dependency-audit` — supply chain security, license compliance, version
  health

### Reasoning Protocols
- `threat-modeling` — STRIDE-based systematic threat identification
- `migration-planning` — incremental migration with rollback strategies
- `cost-benefit-analysis` — quantitative tradeoff analysis framework

## New Personas

- `data-engineer` — data pipelines, ETL, schema design, data quality
- `sre-engineer` — reliability, observability, incident management, SLOs
- `frontend-engineer` — UI/UX, accessibility, performance, component design

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
- Section completeness (does the output format have all required sections?)
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

The assembly engine would search for components in order: project → user →
base library.

## Contributing to the Roadmap

Have ideas for new templates, protocols, or features? The best ways to
contribute:

1. **File an issue** on
   [github.com/microsoft/promptkit](https://github.com/microsoft/promptkit)
2. **Start a discussion** for broader feature ideas
3. **Submit a PR** — use the `extend-library` template to design new
   components that follow existing conventions
