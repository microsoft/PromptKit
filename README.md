<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

# PromptKit

<p align="center">
  <img src="PromptKit-logo.png" alt="PromptKit logo — composable prompt toolkit" width="400">
</p>

**Agentic prompts are the most important code you're not engineering.**
Every AI-assisted task — investigating bugs, writing requirements, reviewing code — lives or dies by the prompt that drives it.
Yet most teams still write these prompts ad hoc: copy-pasted, untested, inconsistent, and impossible to improve systematically.

PromptKit treats prompts as code. It gives you composable, version-controlled
components — personas, reasoning protocols, output formats, and task
templates — that snap together into reliable, repeatable prompts. The same
engineering rigor you apply to your software (modularity, reuse, testing,
code review) now applies to the prompts that build it.

A composable, versioned library of prompt templates for software engineering tasks.
Designed for software engineers who design, develop, and debug software.

## Prerequisites

- **Node.js 18+** — [Install Node.js](https://nodejs.org/) (required for `npx @alan-jowett/promptkit`)
- **Git** — [Install Git](https://git-scm.com/) (only needed if cloning the repo)

To use the interactive mode, you'll also need one of the following LLM CLI tools:

- **GitHub Copilot CLI** — Install the [GitHub CLI](https://cli.github.com/), authenticate with `gh auth login`, ensure Copilot access is enabled for your account/organization, then run `gh extension install github/gh-copilot`
- **Claude Code** — [Install Claude Code](https://docs.anthropic.com/en/docs/claude-code)

Not using a CLI tool? Use `promptkit assemble` to generate prompt files, or see
[Using with any LLM (manual)](#using-with-any-llm-manual).

## Quick Start

### Using npx (recommended — no clone needed)

```bash
# Interactive mode — detects your LLM CLI and launches bootstrap
npx @alan-jowett/promptkit

# List available templates
npx @alan-jowett/promptkit list

# Assemble a specific prompt to a file
npx @alan-jowett/promptkit assemble investigate-bug \
  -p problem_description="Segfault on startup" \
  -p code_context="See attached files" \
  -p environment="Linux x86_64" \
  -o bug-investigation.md
```

### Using the repo directly

Clone the repo and point Copilot at the bootstrap prompt:

```bash
git clone https://github.com/microsoft/promptkit.git
cd promptkit

# Start a session — Copilot reads bootstrap.md, loads the manifest,
# and asks what you need.
copilot -i "Read and execute bootstrap.md"
```

#### What a session looks like

Copilot reads `bootstrap.md`, discovers all components via `manifest.yaml`,
and presents the available templates:

```
● Read bootstrap.md
● Read manifest.yaml

I've loaded the PromptKit manifest. I'm ready to help you build a task-specific prompt.

Available templates:

┌────────────────────────┬──────────────────────────────────────────────────────────────┐
│ Category               │ Templates                                                    │
├────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Document Authoring     │ author-requirements-doc, interactive-design,                 │
│                        │ author-design-doc, author-validation-plan                    │
├────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Investigation          │ investigate-bug, investigate-security                        │
├────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Code Analysis          │ review-code                                                  │
├────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Planning               │ plan-implementation, plan-refactoring                        │
├────────────────────────┼──────────────────────────────────────────────────────────────┤
│ DevOps                 │ author-pipeline, triage-issues, triage-pull-requests,        │
│                        │ root-cause-ci-failure, author-release, review-infrastructure │
└────────────────────────┴──────────────────────────────────────────────────────────────┘

Personas: systems-engineer · security-auditor · software-architect · ...

What would you like to accomplish?
```

Describe your task and the LLM selects the right persona, protocols, and
format, then assembles a complete prompt you can use in a fresh session.

### Using with Claude Code

```bash
cd promptkit
claude "Read and execute bootstrap.md"
```

### Using with any LLM (manual)

If your tool doesn't have file access, paste the bootstrap prompt
into a session along with the manifest, then follow the interactive flow:

```
1. Copy the contents of bootstrap.md into a new LLM chat.
2. Copy the contents of manifest.yaml into the same chat.
3. Describe your task.
4. The LLM will tell you which files to paste in (persona, protocols, etc.)
5. Paste the requested files, get the assembled prompt back.
```

## CLI Reference

The `promptkit` CLI provides three commands:

| Command | Description |
|---------|-------------|
| `promptkit` | Launch interactive session with auto-detected LLM CLI |
| `promptkit list` | List all available templates with descriptions |
| `promptkit assemble <template>` | Assemble a prompt from a template to a file |

### `promptkit assemble`

```bash
promptkit assemble <template> [options]

Options:
  -o, --output <file>       Output file path (default: "assembled-prompt.md")
  -p, --param <key=value>   Template parameter (repeatable)
```

The assembled prompt follows the PromptKit composition order:
Identity → Reasoning Protocols → Output Format → Task (with parameters filled).

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

Templates declare **input and output contracts** so they can be chained:

```
author-requirements-doc  →  author-design-doc  →  author-validation-plan  →  audit-traceability
  (produces: requirements)    (consumes: requirements,   (consumes: requirements,    (consumes: all three,
                               produces: design)          produces: validation)       produces: drift report)
```

The output of one template becomes the input parameter of the next.

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

The audit uses the `specification-drift` taxonomy (D1–D7) to classify
findings — untraced requirements, orphaned design decisions, assumption
drift, constraint violations, and illusory test coverage. Each finding
includes specific document locations, evidence, severity, and remediation
guidance.

The design document is optional — omit it for a focused
requirements ↔ validation plan audit.

## Components

### Personas

| Name | Description |
|------|-------------|
| `systems-engineer` | Memory management, concurrency, performance, debugging |
| `security-auditor` | Vulnerability discovery, threat modeling, secure design |
| `software-architect` | System design, API contracts, tradeoff analysis |
| `specification-analyst` | Cross-document traceability, coverage analysis, specification drift |

### Protocols

**Guardrails:**

| Name | Description |
|------|-------------|
| `anti-hallucination` | Prevents fabrication, enforces epistemic labeling |
| `self-verification` | Quality gate — LLM verifies its own output before finalizing |
| `operational-constraints` | Scoping, tool usage, deterministic analysis, reproducibility |

**Analysis:**

| Name | Description |
|------|-------------|
| `memory-safety-c` | Memory safety analysis for C codebases |
| `memory-safety-rust` | Memory safety analysis for Rust codebases |
| `thread-safety` | Concurrency and thread safety analysis |
| `security-vulnerability` | Security vulnerability analysis |

**Reasoning:**

| Name | Description |
|------|-------------|
| `root-cause-analysis` | Systematic root cause analysis |
| `requirements-elicitation` | Requirements extraction from natural language |
| `traceability-audit` | Cross-document specification drift detection |

### Formats

| Name | Produces | Description |
|------|----------|-------------|
| `requirements-doc` | Requirements document | Numbered REQ-IDs, acceptance criteria |
| `design-doc` | Design document | Architecture, APIs, tradeoff analysis |
| `validation-plan` | Validation plan | Test cases, traceability matrix |
| `investigation-report` | Investigation report | Findings, root cause, remediation |
| `multi-artifact` | Multiple deliverable files | JSONL, reports, coverage logs |

### Taxonomies

| Name | Domain | Description |
|------|--------|-------------|
| `stack-lifetime-hazards` | Memory safety | H1–H5 labels for stack escape and lifetime violations |
| `specification-drift` | Specification traceability | D1–D7 labels for cross-document drift and divergence |

### Templates

| Name | Category | Description |
|------|----------|-------------|
| `author-requirements-doc` | Document authoring | Generate requirements from description |
| `author-design-doc` | Document authoring | Generate design from requirements |
| `author-validation-plan` | Document authoring | Generate test plan from requirements |
| `investigate-bug` | Investigation | Root cause analysis of defects |
| `investigate-security` | Investigation | Security audit of code |
| `review-code` | Code analysis | Code review for correctness and safety |
| `plan-implementation` | Planning | Implementation task breakdown |
| `plan-refactoring` | Planning | Safe, incremental refactoring plan |
| `audit-traceability` | Document auditing | Cross-document specification drift audit |

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
    └── generated/           # SPL-generated prompts for comparison
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
