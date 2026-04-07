<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

# PromptKit

<p align="center">
  <img src="PromptKit-logo.png" alt="PromptKit logo — composable prompt toolkit" width="400">
</p>

<p align="center">
  <a href="https://aka.ms/PromptKit">aka.ms/PromptKit</a> · <a href="LICENSE">MIT License</a>
</p>

**Agentic prompts are the most important code you're not engineering.**
Every AI-assisted task — investigating bugs, writing requirements, reviewing code — lives or dies by the prompt that drives it.
Yet most teams still write these prompts ad hoc: copy-pasted, untested, inconsistent, and impossible to improve systematically.

PromptKit treats prompts as engineered artifacts. It gives you composable,
version-controlled components — personas, reasoning protocols, output formats,
and task templates — that snap together into reliable, repeatable prompts.
Three interactive workflows cover the full engineering lifecycle: bootstrap
specifications from any codebase, evolve them under change with adversarial
audits, and detect drift before it becomes debt. The same engineering rigor
you apply to your software now applies to the prompts that build it.

A composable, versioned prompt library for engineering tasks — software,
hardware, mechanical, RF, firmware, and protocol domains. Designed for
engineers who design, build, verify, and ship.

**157 components** — 15 personas · 48 protocols · 21 formats · 5 taxonomies · 64 templates across 4 pipelines

## The Engineering Lifecycle

PromptKit's three interactive workflows form a domain-agnostic engineering
lifecycle — they work for software, hardware, mechanical, RF, protocol
engineering, and beyond.

<!-- Alt-text: Diagram showing the engineering lifecycle as three stages
     in a cycle: Bootstrap (spec-extraction-workflow) feeds into Evolve
     (engineering-workflow) which feeds into Maintain (maintenance-workflow),
     and drift detected in Maintain loops back to Bootstrap. -->

```
 ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
 │    Bootstrap     │────>│     Evolve       │────>│    Maintain      │
 │                  │     │                  │     │                  │
 │  Scan repo,      │     │  Propagate       │     │  Detect drift,   │
 │  extract specs   │     │  changes with    │     │  correct specs   │
 │  (req / design   │     │  adversarial     │     │  and code        │
 │   / validation)  │     │  audits          │     │                  │
 └──────────────────┘     └──────────────────┘     └────────┬─────────┘
          ▲                                                 │
          └─────────────────────────────────────────────────┘
                           drift detected
```

| Stage | Workflow | What it does | Entry point |
|-------|----------|--------------|-------------|
| **Bootstrap** | `spec-extraction-workflow` | Scans any repository and extracts structured requirements, design, and validation specifications from existing code and artifacts | `Read and execute templates/spec-extraction-workflow.md` |
| **Evolve** | `engineering-workflow` | Propagates a requirements change through specs and implementation with adversarial alignment audits at each stage | `Read and execute templates/engineering-workflow.md` |
| **Maintain** | `maintenance-workflow` | Periodic drift detection — finds where code and specs have diverged, then corrects both | `Read and execute templates/maintenance-workflow.md` |

Each workflow is interactive (`mode: interactive`) — it runs directly in
your LLM session, guiding you through structured phases with built-in
challenge and verification steps.

## Prerequisites

- **Node.js 18+** — [Install Node.js](https://nodejs.org/) (required for `npx @alan-jowett/promptkit`)
- **Git** — [Install Git](https://git-scm.com/) (only needed if cloning the repo)

To use the interactive mode, you'll also need one of the following LLM CLI tools:

- **GitHub Copilot CLI** — Install the [GitHub CLI](https://cli.github.com/), authenticate with `gh auth login`, ensure Copilot access is enabled for your account/organization, then run `gh extension install github/gh-copilot`
- **Claude Code** — [Install Claude Code](https://docs.anthropic.com/en/docs/claude-code)

Not using a CLI tool? See [Using with any LLM (manual)](#using-with-any-llm-manual).

## Quick Start

### Using npx (recommended — no clone needed)

```bash
# Interactive mode — detects your LLM CLI and launches bootstrap
npx @alan-jowett/promptkit

# Browse the full component catalog
npx @alan-jowett/promptkit list --all

# Search for components by keyword
npx @alan-jowett/promptkit search "memory safety"

# Show details and cross-references for a component
npx @alan-jowett/promptkit show review-cpp-code

# List available templates (backward compatible)
npx @alan-jowett/promptkit list
```

> **📖 Full component catalog:** See [CATALOG.md](CATALOG.md) for a browsable
> reference of all components with a cross-reference index — no CLI needed.

### Using the repo directly

Clone the repo and start a session — Copilot discovers the `/promptkit`
skill automatically:

```bash
git clone https://github.com/microsoft/promptkit.git
cd promptkit

# Start a session — the /promptkit skill activates automatically,
# reads the manifest, and asks what you need.
copilot
```

You can also invoke the skill explicitly with `/promptkit`, `/boot`, or
`/bootstrap`.

#### What a session looks like

The bootstrap engine discovers all components via `manifest.yaml` and
presents the available templates:

```
● Read bootstrap.md  (via /promptkit skill)
● Read manifest.yaml

I've loaded the PromptKit manifest. I'm ready to help you build a task-specific prompt.

Available templates (64):

┌────────────────────────┬───────┬──────────────────────────────────────────────────────┐
│ Category               │ Count │ Examples                                             │
├────────────────────────┼───────┼──────────────────────────────────────────────────────┤
│ Document Authoring     │   16  │ author-requirements-doc, interactive-design,         │
│                        │       │ audit-traceability, validate-budget, ...             │
├────────────────────────┼───────┼──────────────────────────────────────────────────────┤
│ Engineering Workflow   │    8  │ engineering-workflow, spec-extraction-workflow,       │
│                        │       │ maintenance-workflow, audit-spec-alignment, ...      │
├────────────────────────┼───────┼──────────────────────────────────────────────────────┤
│ Code Analysis          │   10  │ review-code, review-cpp-code, exhaustive-bug-hunt,  │
│                        │       │ review-schematic, review-enclosure, ...              │
├────────────────────────┼───────┼──────────────────────────────────────────────────────┤
│ DevOps                 │    7  │ author-pipeline, triage-issues, author-release, ...  │
├────────────────────────┼───────┼──────────────────────────────────────────────────────┤
│ Investigation          │    6  │ investigate-bug, investigate-security,               │
│                        │       │ find-and-fix-bugs, fix-compiler-warnings, ...        │
├────────────────────────┼───────┼──────────────────────────────────────────────────────┤
│ Standards              │    4  │ extract-rfc-requirements, author-rfc, ...            │
├────────────────────────┼───────┼──────────────────────────────────────────────────────┤
│ Protocol Engineering   │    3  │ evolve-protocol, analyze-protocol-conflicts, ...     │
├────────────────────────┼───────┼──────────────────────────────────────────────────────┤
│ Code Generation        │    3  │ author-implementation-prompt, author-test-prompt, ...|
├────────────────────────┼───────┼──────────────────────────────────────────────────────┤
│ Testing · Planning ·   │    7  │ discover-tests-for-changes, plan-implementation,     │
│ Agent · Contribution   │       │ author-agent-instructions, extend-library, ...       │
└────────────────────────┴───────┴──────────────────────────────────────────────────────┘

Personas: systems-engineer · electrical-engineer · rf-engineer ·
          mechanical-engineer · protocol-architect · ... (15 total)

What would you like to accomplish?
```

Describe your task and the LLM selects the right persona, protocols, and
format, then assembles a complete prompt you can use in a fresh session.

> **See it in action:** [Examples — From One-Liner to Engineered Prompt](docs/examples.md)
> shows what PromptKit actually assembles for tasks like C++ code review,
> compiler warning remediation, and adversarial bug hunting.

### Using with Claude Code

Claude Code does not support CLI skills, so use the manual bootstrap command:

```bash
cd promptkit
claude "Read and execute bootstrap.md"
```

### Using with any LLM (manual)

If your tool doesn't support skills or file access, paste the bootstrap
prompt into a session along with the manifest, then follow the
interactive flow:

```
1. Copy the contents of bootstrap.md into a new LLM chat.
2. Copy the contents of manifest.yaml into the same chat.
3. Describe your task.
4. The LLM will tell you which files to paste in (persona, protocols, etc.)
5. Paste the requested files, get the assembled prompt back.
```

## CLI Reference

The `promptkit` CLI provides these commands:

| Command | Description |
|---------|-------------|
| `promptkit` | Launch interactive session with auto-detected LLM CLI |
| `promptkit list` | List available templates (default) or all components |
| `promptkit search <keyword>` | Search components by keyword across name + description |
| `promptkit show <name>` | Show component details with cross-references |

### `promptkit list`

```bash
promptkit list [options]

Options:
  --all                 Show all component types (not just templates)
  --type <type>         Filter by type (persona, protocol, format, taxonomy, template)
  --category <category> Filter by category (e.g., document-authoring, code-analysis, guardrails)
  --language <language> Filter protocols by language (e.g., C, C++, Rust)
  --json                Output as JSON
```

### `promptkit search`

```bash
promptkit search <keyword> [options]

Options:
  --type <type>  Filter results by component type
  --json         Output as JSON
```

### `promptkit show`

```bash
promptkit show <name> [options]

Options:
  --json  Output as JSON
```

Shows component details including type, category, description, and
cross-references (which templates use this protocol/persona/format).

### `promptkit list --json`

Outputs the full template catalog as JSON for scripting.

## Architecture

The library uses **5 composable layers**:

| Layer | Purpose | Directory |
|-------|---------|-----------|
| **Persona** | Who the LLM is — expertise, tone, behavioral constraints | `personas/` |
| **Protocol** | How it reasons — systematic analysis, reasoning, and guardrails | `protocols/` |
| **Format** | What the output looks like — document structure and rules | `formats/` |
| **Taxonomy** | How findings are classified — domain-specific label schemes | `taxonomies/` |
| **Template** | The task itself — composes the above layers with task-specific instructions | `templates/` |

### Composition

A task template references a persona, one or more protocols, an optional
taxonomy, and a format. The bootstrap prompt reads the `manifest.yaml` to
discover available components, then assembles them into a single coherent
prompt based on the user's needs.

<!-- Alt-text: Diagram showing how an assembled prompt is composed from four
     layers stacked vertically: Persona (identity), Protocol (reasoning
     methodology, one or more), Format (output structure), and Template
     (task-specific instructions with parameter placeholders). -->

```
┌────────────────────────────────────────────────────┐
│                  Assembled Prompt                  │
├────────────────────────────────────────────────────┤
│  ┌──────────┐                                      │
│  │ Persona  │  "You are a senior systems           │
│  └──────────┘   engineer with expertise in..."     │
│  ┌──────────┐                                      │
│  │ Protocol │  "Phase 1: Trace allocations..."     │
│  │ Protocol │  "Phase 1: Map trust boundaries."    │
│  └──────────┘                                      │
│  ┌──────────┐                                      │
│  │  Format  │  "Output MUST contain sections:      │
│  └──────────┘   Findings, Root Cause, ..."         │
│  ┌──────────┐                                      │
│  │ Template │  "Investigate the following bug:     │
│  └──────────┘   {{problem_description}}"           │
└────────────────────────────────────────────────────┘
```

### Chaining / Pipelines

Templates declare **input and output contracts** so they can be chained.
Four pipelines are defined in the manifest:

**Document Lifecycle**

```
author-requirements-doc  →  author-design-doc  →  author-validation-plan  →  audit-traceability
  (produces: requirements)    (consumes: requirements,   (consumes: requirements,    (consumes: requirements +
                               produces: design)          produces: validation)        validation; design optional,
                                                                                      produces: drift report)
```

**Hardware Lifecycle**

```
author-requirements-doc  →  design-schematic  →  review-schematic  →  validate-simulation  →  review-bom
  (produces: requirements)   (produces:           (consumes: req +      (consumes: req,         (consumes: req +
                              artifact-set)        artifact-set)         audits sim output)      artifact-set)

                          →  design-pcb-layout  →  review-layout  →  emit-manufacturing-artifacts
                             (consumes:             (consumes: req +    (consumes: artifact-set,
                              artifact-set)          artifact-set)       produces: artifact-set)
```

**Protocol Engineering**

```
extract-rfc-requirements  →  evolve-protocol  →  author-protocol-validation  →  analyze-protocol-conflicts
  (produces: requirements)    (produces:           (produces: protocol             (produces: investigation
                               protocol delta)      validation spec)                report)
```

**Engineering Workflow** (five internal stages)

```
collaborate-requirements-change → generate-spec-changes → audit-spec-alignment
  → generate-implementation-changes → audit-implementation-alignment
```

The output of one template becomes the input parameter of the next.
The [Engineering Lifecycle](#the-engineering-lifecycle) workflows
(spec-extraction, engineering, maintenance) compose these pipelines
into a higher-level lifecycle.

### Use Case: Specification Traceability Audit

After authoring requirements, design, and validation documents — whether
through PromptKit's pipeline or by hand — you can audit all three for
**specification drift**: gaps, contradictions, and divergence that
accumulate as documents evolve independently.

```bash
# Assemble a traceability audit prompt
npx @alan-jowett/promptkit assemble audit-traceability \
  -p project_name="Auth Service" \
  -p requirements_doc="$(cat requirements.md)" \
  -p design_doc="$(cat design.md)" \
  -p validation_plan="$(cat validation-plan.md)" \
  -o audit-report.md
```

The audit uses the `specification-drift` taxonomy (D1–D16) to classify
findings — untraced requirements, orphaned design decisions, assumption
drift, constraint violations, and illusory test coverage. Each finding
includes specific document locations, evidence, severity, and remediation
guidance.

The design document is optional — omit it for a focused
requirements ↔ validation plan audit.

## Domains

PromptKit covers multiple engineering domains. Each domain has dedicated
personas, analysis protocols, and task templates.

| Domain | Keywords |
|--------|----------|
| **Software Engineering** | Code review, bug investigation, design docs, requirements, testing, refactoring, implementation |
| **Hardware / Electrical Engineering** | Schematic review, BOM audit, PCB layout review, simulation validation, power budgets, component selection |
| **Embedded Firmware** | Boot sequences, OTA updates, flash memory management, power-fail-safe, watchdog timers, device recovery |
| **Protocol Engineering** | RFC authoring, protocol evolution, conflict analysis, protocol validation, state machines, interoperability |
| **Specification Analysis** | Invariant extraction, traceability audits, interface contracts, behavioral models, spec diffing, budget validation |
| **DevOps & CI/CD** | Pipelines, issue triage, PR triage, releases, commit messages, infrastructure review, CI failure analysis |

## Components

### Personas

| Name | Description |
|------|-------------|
| `systems-engineer` | Memory management, concurrency, performance, debugging |
| `security-auditor` | Vulnerability discovery, threat modeling, secure design |
| `software-architect` | System design, API contracts, tradeoff analysis |
| `promptkit-contributor` | PromptKit architecture, conventions, contribution guidance |
| `devops-engineer` | CI/CD pipelines, release engineering, infrastructure-as-code |
| `reverse-engineer` | Specification extraction, behavioral requirements from code |
| `specification-analyst` | Cross-document traceability, coverage analysis, specification drift |
| `workflow-arbiter` | Multi-agent workflow evaluation, livelock detection, termination decisions |
| `implementation-engineer` | Spec-compliant code generation, requirement tracing |
| `test-engineer` | Specification-driven test authoring, coverage analysis |
| `embedded-firmware-engineer` | Boot sequences, OTA updates, flash management, power-fail-safe, watchdogs |
| `electrical-engineer` | Power delivery, signal integrity, PCB design, schematic review, component selection |
| `rf-engineer` | Link budget analysis, antenna design, signal integrity, RF system review |
| `mechanical-engineer` | Enclosure design, thermal analysis, tolerance stacks, DFM/DFA review |
| `protocol-architect` | Protocol design, evolution, formal specification, state machines, interoperability |

### Protocols

**Guardrails** (cross-cutting, apply to all tasks):

| Name | Description |
|------|-------------|
| `anti-hallucination` | Prevents fabrication, enforces epistemic labeling |
| `self-verification` | Quality gate — LLM verifies its own output before finalizing |
| `operational-constraints` | Scoping, tool usage, deterministic analysis, reproducibility |
| `minimal-edit-discipline` | Minimal, type-preserving, encoding-safe code modifications |
| `adversarial-falsification` | Self-falsification discipline — disprove findings before reporting |

**Analysis** (domain/language-specific checks):

| Name | Description |
|------|-------------|
| `memory-safety-c` | Memory safety analysis for C codebases |
| `cpp-best-practices` | Research-validated C++ code review patterns |
| `memory-safety-rust` | Memory safety analysis for Rust codebases |
| `thread-safety` | Concurrency and thread safety analysis |
| `security-vulnerability` | Security vulnerability analysis |
| `win32-api-conventions` | Win32 API naming, typedefs, parameter ordering |
| `performance-critical-c-api` | Performance-critical C API design patterns |
| `winrt-design-patterns` | Windows Runtime API design patterns |
| `compiler-diagnostics-cpp` | C++ compiler diagnostic analysis and remediation |
| `msvc-clang-portability` | MSVC ↔ Clang/GCC cross-compiler portability |
| `kernel-correctness` | OS kernel/driver correctness (locks, refcounts, cleanup paths) |
| `schematic-compliance-audit` | Schematic review against requirements and datasheets |
| `simulation-validation` | Circuit simulation output vs. specification constraints |
| `bom-consistency` | BOM audit against schematic, ratings, sourcing |
| `layout-design-review` | PCB layout review (traces, impedance, thermal, DRC) |
| `link-budget-audit` | RF link budget analysis against requirements |
| `enclosure-design-review` | Mechanical enclosure design review |

**Reasoning** (systematic reasoning approaches):

| Name | Description |
|------|-------------|
| `root-cause-analysis` | Systematic root cause analysis |
| `requirements-elicitation` | Requirements extraction from natural language |
| `iterative-refinement` | Document revision through feedback cycles |
| `promptkit-design` | PromptKit component design reasoning |
| `devops-platform-analysis` | DevOps platform reasoning (pipelines, triggers, secrets) |
| `requirements-from-implementation` | Deriving requirements from existing source code |
| `traceability-audit` | Cross-document specification drift detection |
| `code-compliance-audit` | Source code audit against requirements/design docs |
| `test-compliance-audit` | Test code audit against validation plan |
| `integration-audit` | Cross-component integration point audit |
| `rfc-extraction` | Structured requirements extraction from RFCs |
| `invariant-extraction` | Invariant extraction from specifications or source code |
| `workflow-arbitration` | Multi-agent workflow progress evaluation |
| `requirements-reconciliation` | Multi-source requirements reconciliation |
| `finding-classification` | Finding classification against taxonomy/catalog |
| `interface-contract-audit` | Interface contract completeness and consistency audit |
| `exhaustive-path-tracing` | Per-file deep review with coverage ledger |
| `protocol-evolution` | Protocol specification modification and extension |
| `protocol-conflict-analysis` | Protocol specification comparison and conflict detection |
| `protocol-validation-design` | Validation specification derivation from protocol spec |
| `spec-invariant-audit` | Adversarial specification analysis against invariants |
| `quantitative-constraint-validation` | Budget/rollup/margin validation against spec constraints |
| `spec-evolution-diff` | Specification version comparison at invariant level |
| `session-profiling` | LLM session log analysis for token inefficiencies |
| `change-propagation` | Multi-artifact change impact analysis and propagation |
| `step-retrospective` | Post-step retrospective and quality evaluation |

### Formats

| Name | Produces | Description |
|------|----------|-------------|
| `requirements-doc` | Requirements document | Numbered REQ-IDs, acceptance criteria |
| `design-doc` | Design document | Architecture, APIs, tradeoff analysis |
| `validation-plan` | Validation plan | Test cases, traceability matrix |
| `investigation-report` | Investigation report | Findings, root cause, remediation |
| `multi-artifact` | Multiple deliverable files | JSONL, reports, coverage logs |
| `promptkit-pull-request` | PromptKit contribution | PR-ready component files and manifest update |
| `pipeline-spec` | Pipeline specification | CI/CD YAML, rationale, deployment notes |
| `triage-report` | Triage report | Prioritized items by priority and effort |
| `release-notes` | Release notes | Changelog, breaking changes, upgrade instructions |
| `agent-instructions` | Agent instruction file | Copilot skill files, CLAUDE.md, .cursorrules |
| `implementation-plan` | Implementation plan | Task breakdown, dependencies, risk assessment |
| `north-star-document` | North-star document | Vision, guiding principles, transition considerations |
| `structured-findings` | Structured findings | Classified diagnostics with remediation guidance |
| `exhaustive-review-report` | Exhaustive review report | Per-file coverage ledgers, falsification proof |
| `protocol-delta` | Protocol delta | Specification amendments, tracked changes, redlines |
| `protocol-validation-spec` | Protocol validation spec | Conformance tests, state machine coverage |
| `rfc-document` | RFC document | xml2rfc v3 XML for internet-drafts |
| `behavioral-model` | Behavioral model | State machines, flow graphs, invariant catalogs |
| `interface-contract` | Interface contract | Per-resource guarantees, obligations, failure modes |
| `architecture-spec` | Architecture specification | System description, interfaces, cross-cutting concerns |
| `structured-patch` | Structured patch | Machine-readable code changes with context |

### Taxonomies

| Name | Domain | Description |
|------|--------|-------------|
| `stack-lifetime-hazards` | Memory safety | H1–H5 labels for stack escape and lifetime violations |
| `specification-drift` | Specification traceability | D1–D16 labels for cross-document drift and divergence |
| `cpp-review-patterns` | C++ code review | 19 pattern labels across memory, concurrency, API, performance |
| `kernel-defect-categories` | Kernel correctness | K1–K14 labels for OS kernel and driver defects |
| `protocol-change-categories` | Protocol engineering | PC1–PC8 labels for protocol specification changes |

### Templates

**Document Authoring** (16 templates):

| Name | Description |
|------|-------------|
| `author-requirements-doc` | Generate requirements from a description |
| `author-architecture-spec` | Generate architecture specification for a system |
| `interactive-design` | Multi-phase interactive design session |
| `author-north-star` | Interactive north-star / vision document authoring |
| `author-design-doc` | Generate design doc from requirements |
| `author-validation-plan` | Generate test plan from requirements |
| `reverse-engineer-requirements` | Extract requirements from existing source code |
| `audit-traceability` | Cross-document specification drift audit |
| `audit-code-compliance` | Audit source code against requirements/design |
| `audit-test-compliance` | Audit test code against validation plan |
| `audit-integration-compliance` | Audit cross-component integration points |
| `audit-spec-invariants` | Adversarial spec analysis against invariants |
| `diff-specifications` | Compare two specification versions at invariant level |
| `author-interface-contract` | Generate interface contract between components |
| `audit-interface-contract` | Audit interface contract completeness |
| `validate-budget` | Validate quantitative analysis against spec constraints |

**Standards** (4 templates):

| Name | Description |
|------|-------------|
| `extract-rfc-requirements` | Extract structured requirements from RFCs |
| `reconcile-requirements` | Reconcile multiple requirements sources into unified spec |
| `extract-invariants` | Extract invariants from specifications or source code |
| `author-rfc` | Author RFC / internet-draft in xml2rfc v3 format |

**Code Generation** (3 templates):

| Name | Description |
|------|-------------|
| `author-implementation-prompt` | Produce prompt for spec-compliant code generation |
| `author-test-prompt` | Produce prompt for spec-compliant test generation |
| `author-workflow-prompts` | Generate multi-agent workflow prompt assets |

**Investigation** (6 templates):

| Name | Description |
|------|-------------|
| `investigate-bug` | Root cause analysis of defects |
| `find-and-fix-bugs` | Autonomous bug-finding and fixing workflow |
| `fix-compiler-warnings` | Systematic batch remediation of compiler warnings |
| `investigate-security` | Security audit of code or system component |
| `profile-session` | Analyze LLM session log for token inefficiencies |
| `classify-findings` | Classify findings against a reference catalog |

**Code Analysis** (10 templates):

| Name | Description |
|------|-------------|
| `review-code` | Code review for correctness, safety, security |
| `review-cpp-code` | C/C++ specialized review with best practices |
| `exhaustive-bug-hunt` | Deep adversarial line-by-line code review |
| `reconstruct-behavior` | Extract behavioral model from engineering artifacts |
| `review-schematic` | Audit schematic/netlist against requirements and datasheets |
| `validate-simulation` | Review simulation output against spec constraints |
| `review-bom` | Audit BOM against schematic, ratings, sourcing |
| `review-layout` | Audit PCB layout against schematic intent |
| `review-enclosure` | Audit mechanical enclosure design against requirements |
| `audit-link-budget` | Audit RF link budget against requirements |

**Testing** (2 templates):

| Name | Description |
|------|-------------|
| `discover-tests-for-changes` | Find relevant tests for local code changes |
| `scaffold-test-project` | Scaffold test project with build and runner setup |

**Planning** (2 templates):

| Name | Description |
|------|-------------|
| `plan-implementation` | Implementation task breakdown with dependencies |
| `plan-refactoring` | Safe, incremental refactoring plan |

**Agent Authoring** (1 template):

| Name | Description |
|------|-------------|
| `author-agent-instructions` | Assemble PromptKit components into agent skill files |

**Contribution** (2 templates):

| Name | Description |
|------|-------------|
| `extend-library` | Guide contributor through building new components |
| `audit-library-consistency` | Audit PromptKit library for overlap and inconsistency |

**DevOps** (7 templates):

| Name | Description |
|------|-------------|
| `author-pipeline` | Generate production-ready CI/CD pipeline |
| `triage-issues` | Triage and prioritize open issues |
| `triage-pull-requests` | Triage open pull requests for review |
| `root-cause-ci-failure` | Investigate failing CI/CD pipeline run |
| `author-release` | Generate structured release notes |
| `review-infrastructure` | Review infrastructure-as-code |
| `generate-commit-message` | Generate structured commit message from staged changes |

**Protocol Engineering** (3 templates):

| Name | Description |
|------|-------------|
| `evolve-protocol` | Interactive protocol evolution session |
| `analyze-protocol-conflicts` | Compare protocol specs for conflicts |
| `author-protocol-validation` | Derive validation spec from protocol spec |

**Engineering Workflow** (8 templates):

| Name | Description |
|------|-------------|
| `spec-extraction-workflow` | Bootstrap: scan repo and extract requirements, design, and validation specs |
| `engineering-workflow` | Evolve: propagate a requirements change through specs and implementation |
| `maintenance-workflow` | Maintain: periodic drift detection and correction across specs and code |
| `collaborate-requirements-change` | Interactive requirements change proposal and impact analysis |
| `generate-spec-changes` | Generate specification updates from an approved requirements change |
| `generate-implementation-changes` | Generate implementation changes from updated specifications |
| `audit-spec-alignment` | Adversarial audit of specification alignment after changes |
| `audit-implementation-alignment` | Adversarial audit of implementation alignment against specifications |

## Directory Structure

<!-- Alt-text: Directory tree showing the library structure. Root contains
     README.md, CONTRIBUTING.md, manifest.yaml, and bootstrap.md. Subdirectories
     are personas/, protocols/ (with guardrails/, analysis/, reasoning/),
     formats/, and templates/. -->

```
promptkit/
├── README.md               # This file
├── CONTRIBUTING.md          # Guidelines for extending the library
├── TESTING.md              # Prompt unit testing methodology
├── manifest.yaml            # Index of all components
├── bootstrap.md             # Meta-prompt entry point
├── LICENSE                  # MIT license
├── .github/
│   └── skills/              # Copilot CLI skills (/promptkit, /boot, /bootstrap)
├── personas/                # LLM identity definitions
├── protocols/               # Reasoning and analysis protocols
│   ├── guardrails/          # Cross-cutting safety protocols
│   ├── analysis/            # Domain-specific analysis protocols
│   └── reasoning/           # General reasoning protocols
├── formats/                 # Output structure definitions
├── taxonomies/              # Domain-specific classification schemes
├── templates/               # Task templates (compose other layers)
├── cli/                     # npx CLI package
│   ├── bin/cli.js           # Entry point
│   ├── lib/                 # Manifest parsing, assembly, CLI launch
│   └── content/             # Bundled content (generated, gitignored)
└── tests/                   # Prompt unit tests
    ├── references/          # Known-good reference prompts
    └── generated/           # PromptKit-generated prompts for comparison
```

## Template Format

All components use **Markdown with YAML frontmatter**:

```markdown
---
name: template-name
description: What this template does
persona: persona-name
protocols:
  - protocol-path
format: format-name
params:
  param_name: "Description of parameter"
input_contract:
  type: artifact-type
  description: What input this template expects
output_contract:
  type: artifact-type
  description: What this template produces
---

# Template body in Markdown

Instructions and content here.
Use {{param_name}} for parameter placeholders.
```

## Versioning

The library is versioned as a unit via git tags (e.g., `v0.1.0`).
Individual components are not independently versioned — use git history
to access older versions of any component.

## License

See LICENSE file for details.
