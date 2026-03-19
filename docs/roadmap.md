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
