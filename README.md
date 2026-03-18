<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

# PromptKit

<p align="center">
  <img src="PromptKit-logo.png" alt="PromptKit logo — composable prompt toolkit" width="400">
</p>

A composable, versioned library of prompt templates for software engineering tasks.
Designed for software engineers who design, develop, and debug software.

## Quick Start

1. **Load the bootstrap prompt** (`bootstrap.md`) into an LLM session.
2. **Describe your task** — the LLM will select the right components.
3. **Provide context** — code, requirements, problem descriptions.
4. **Get an assembled prompt** — ready to use in a fresh LLM session.

```
You → bootstrap.md → LLM reads manifest → selects components → assembled prompt → LLM → output
```

### Using with GitHub Copilot CLI

Clone the repo and point Copilot at the bootstrap prompt:

```bash
git clone https://github.com/microsoft/promptkit.git
cd promptkit

# Start a session — Copilot reads bootstrap.md, loads the manifest,
# and asks what you need.
copilot "Read and execute bootstrap.md"
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
author-requirements-doc  →  author-design-doc  →  author-validation-plan
  (produces: requirements)    (consumes: requirements,   (consumes: requirements,
                               produces: design)          produces: validation)
```

The output of one template becomes the input parameter of the next.

## Components

### Personas

| Name | Description |
|------|-------------|
| `systems-engineer` | Memory management, concurrency, performance, debugging |
| `security-auditor` | Vulnerability discovery, threat modeling, secure design |
| `software-architect` | System design, API contracts, tradeoff analysis |

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
