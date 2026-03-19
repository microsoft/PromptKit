# PromptKit Architecture

This document describes PromptKit's composition model, assembly engine, and
manifest structure in detail.

## Core Idea

PromptKit decomposes prompts into five reusable layers. A **template**
declares which layers to compose, and the **assembly engine** snaps them
together into a single coherent prompt.

```
┌─────────────────────────────────────────────────┐
│  ① Persona        — Who the LLM becomes         │
│  ② Protocols      — How it reasons + guardrails  │
│  ③ Format         — Output structure & rules     │
│  ④ Taxonomy       — Domain classification (opt.) │
│  ⑤ Template       — The task with {{params}}     │
└─────────────────────────────────────────────────┘
```

Each layer is a standalone Markdown file with YAML frontmatter. Components
are composed at assembly time, not baked together at authoring time.

## The Five Layers

### Layer 1: Personas

Personas define the LLM's identity, domain expertise, tone, and behavioral
constraints.

**Frontmatter fields:** `name`, `description`, `domain` (list), `tone`

```yaml
---
name: systems-engineer
description: >
  Senior systems engineer with deep expertise in memory management,
  concurrency, and performance. Reasons from first principles.
domain:
  - systems programming
  - debugging
  - performance analysis
tone: precise, technical, methodical
---
```

The Markdown body contains expertise areas and behavioral constraints like
"reason from first principles" and "distinguish epistemic states." Persona
headings should include seniority level (e.g., "Senior Systems Engineer").

**Available:** systems-engineer, security-auditor, software-architect,
devops-engineer, reverse-engineer, spl-contributor

### Layer 2: Protocols

Protocols define reasoning methodology and behavioral guardrails. They are
organized into three categories with different scoping rules:

| Category | Scope | Examples |
|----------|-------|----------|
| **guardrails/** | Cross-cutting, apply to all tasks | anti-hallucination, self-verification, operational-constraints |
| **analysis/** | Domain/language-specific checks | memory-safety-c, memory-safety-rust, thread-safety, security-vulnerability |
| **reasoning/** | Systematic reasoning approaches | root-cause-analysis, requirements-elicitation, iterative-refinement |

**Frontmatter fields:** `name`, `type` (guardrail \| analysis \| reasoning),
`description`, `applicable_to` (list of template names or "all")

Language-specific analysis protocols are separate files, not conditional
blocks within a single protocol.

**Naming duality:** Templates reference protocols by category path
(`guardrails/anti-hallucination`). The manifest uses short names
(`anti-hallucination`). CI validates they stay in sync.

### Layer 3: Formats

Formats define the output document structure, section ordering, and
formatting rules.

**Frontmatter fields:** `name`, `type` (format), `description`, `produces`
(artifact type label), `consumes` (optional, for pipeline chaining)

The `produces` field enables pipeline chaining — it declares what artifact
type the format generates, which other templates can declare as their
`input_contract`.

**Available:** requirements-doc, design-doc, validation-plan,
investigation-report, implementation-plan, agent-instructions,
pipeline-spec, release-notes, multi-artifact

### Layer 4: Taxonomies

Taxonomies provide domain-specific classification schemes (severity levels,
hazard categories, risk tiers). They are optional — not every template uses
one.

Taxonomies exist because some analysis tasks need a shared vocabulary for
classifying findings. For example, a memory-safety audit needs a consistent
set of hazard categories (H1–H5) so that findings from different reviews
are comparable. Without a taxonomy, each prompt invocation invents its own
categories, making results harder to aggregate or compare over time.

If your task doesn't involve classifying findings into predefined
categories, you can ignore this layer entirely.

**Frontmatter fields:** `name`, `path`, `domain`, `description`

**Available:** stack-lifetime-hazards (H1–H5 classification for memory
safety)

### Layer 5: Templates

Templates are the orchestration layer. Each template declares which persona,
protocols, format, and taxonomy to compose, plus task-specific instructions
with `{{param}}` placeholders.

**Frontmatter fields:**

| Field | Description |
|-------|-------------|
| `name` | Template identifier (kebab-case) |
| `description` | Human-readable purpose |
| `persona` | Single persona reference |
| `protocols` | List of category/name paths |
| `format` | Output format reference |
| `params` | Key-value map of parameter names → descriptions |
| `input_contract` | Artifact type this template consumes (null if none) |
| `output_contract` | Artifact type this template produces |
| `mode` | Optional: `interactive` for live execution (default: single-shot) |

**Two template modes:**

- **Single-shot** (default): Gather parameters, assemble prompt, write a
  Markdown file. User pastes it into any LLM.
- **Interactive** (`mode: interactive`): Load components and execute directly
  in the current LLM session with a reasoning-and-challenge phase before
  generation. No file is written.

## The Manifest

`manifest.yaml` is the source of truth for the bootstrap engine. It
registers every component with its path, description, and relationships.

### Structure

```yaml
version: "0.1.0"

personas:
  - name: systems-engineer
    path: personas/systems-engineer.md
    description: …

protocols:
  guardrails:
    - name: anti-hallucination
      path: protocols/guardrails/anti-hallucination.md
      description: …
  analysis:
    - name: memory-safety-c
      path: protocols/analysis/memory-safety-c.md
      language: C
      description: …
  reasoning:
    - name: root-cause-analysis
      path: protocols/reasoning/root-cause-analysis.md
      description: …

formats:
  - name: investigation-report
    path: formats/investigation-report.md
    produces: investigation-report
    description: …

taxonomies:
  - name: stack-lifetime-hazards
    path: taxonomies/stack-lifetime-hazards.md
    domain: memory-safety

templates:
  investigation:
    - name: investigate-bug
      path: templates/investigate-bug.md
      persona: systems-engineer
      protocols: [anti-hallucination, self-verification,
                  operational-constraints, root-cause-analysis]
      format: investigation-report

pipelines:
  document-lifecycle:
    description: …
    stages:
      - template: author-requirements-doc
        produces: requirements-document
      - template: author-design-doc
        consumes: requirements-document
        produces: design-document
      - template: author-validation-plan
        consumes: requirements-document
        produces: validation-plan
```

### Manifest Sync Rule

When adding or modifying any component:

1. Update the component's YAML frontmatter
2. Update `manifest.yaml` to match
3. CI (`tests/validate-manifest.py`) validates that every template's
   `protocols` list in the manifest matches its frontmatter

## The Assembly Engine

The assembly engine lives in `cli/lib/assemble.js`. It is deliberately
simple — concatenation in a specific order with minimal processing.

### Assembly Order

```
┌──────────────────────────┐
│  # Identity              │  ← persona .md body
├──────────────────────────┤
│  ---                     │
├──────────────────────────┤
│  # Reasoning Protocols   │  ← each protocol .md body, joined with ---
├──────────────────────────┤
│  ---                     │
├──────────────────────────┤
│  # Output Format         │  ← format .md body
├──────────────────────────┤
│  ---                     │
├──────────────────────────┤
│  # Task                  │  ← template .md body with {{params}} filled
└──────────────────────────┘
```

### Processing Steps

1. **Resolve dependencies** — `resolveTemplateDeps()` maps the template's
   persona name, protocol short names, and format name to manifest entries
   with file paths.
2. **Load component** — `loadComponent()` reads each `.md` file, strips
   HTML comments (SPDX license headers), and strips YAML frontmatter.
3. **Wrap in section headers** — Each component body is wrapped with its
   section header (`# Identity`, `# Reasoning Protocols`, etc.).
4. **Join sections** — Sections are concatenated with Markdown horizontal
   rule (`---`) separators.
5. **Substitute parameters** — `{{key}}` placeholders in the template body
   are replaced with user-provided values via simple string replacement (no
   recursive substitution).

### Path Resolution

The manifest stores full file paths for every component. The
`resolveTemplateDeps()` function (in `cli/lib/manifest.js`) searches
the manifest to find components by name:

- `getPersona(manifest, name)` — finds persona by name
- `getProtocol(manifest, shortName)` — finds protocol by short name across
  all categories (guardrails, analysis, reasoning)
- `getFormat(manifest, name)` — finds format by name

## The Bootstrap Flow

`bootstrap.md` is the meta-prompt that drives the entire composition
workflow. When an LLM reads it, it follows this decision tree:

1. **Understand the task** — ask the user what they want to accomplish
2. **Read the manifest** — discover all available components
3. **Select a template** — match the task to the best template
4. **Check template mode:**
   - `mode: interactive` → execute directly in the current session
   - Default (single-shot) → ask about output mode:
     - **(a) Raw prompt file** — Markdown for a fresh LLM session
     - **(b) Agent instruction file** — persistent file for GitHub Copilot,
       Claude Code, or Cursor
5. **Collect parameters** — gather template-specific inputs
6. **Ask for target directory** — where output files go
7. **Load and assemble** — read referenced files, compose in order
8. **Write output** — save to the resolved path(s)

## Pipeline Chaining

Templates can be connected into multi-stage pipelines via input/output
contracts. Each template declares what artifact type it produces and
optionally what it consumes.

```
author-requirements-doc  →  author-design-doc  →  author-validation-plan
  produces:                   consumes:              consumes:
  requirements-document       requirements-document   requirements-document
                              produces:               produces:
                              design-document          validation-plan
```

The manifest defines pipelines under the `pipelines` section. The bootstrap
engine uses contracts to:

1. Validate that the previous stage's output matches the next stage's input
2. Offer the user the next stage after the current one completes
3. Pass the previous output as an input parameter to the next template

See [Pipeline Guide](pipeline-guide.md) for a detailed walkthrough.

## CI

The only automated CI check is `tests/validate-manifest.py`, triggered on
push/PR when `manifest.yaml`, `templates/**`, or the test script change. It
validates that every template's `protocols` list in the manifest matches its
frontmatter.

```bash
python tests/validate-manifest.py
```

## File Layout

```
promptkit/
├── bootstrap.md              # Meta-prompt entry point
├── manifest.yaml             # Component registry (source of truth)
├── personas/                 # Layer 1: Identity definitions
├── protocols/
│   ├── guardrails/           # Cross-cutting behavioral constraints
│   ├── analysis/             # Domain/language-specific checks
│   └── reasoning/            # Systematic reasoning methodologies
├── formats/                  # Layer 3: Output structure specs
├── taxonomies/               # Layer 4: Classification schemes
├── templates/                # Layer 5: Task orchestration
├── cli/                      # npx CLI package
│   ├── bin/cli.js            # Entry point
│   ├── lib/assemble.js       # Assembly engine
│   ├── lib/manifest.js       # Manifest parser
│   └── lib/launch.js         # LLM CLI launcher
├── tests/
│   ├── validate-manifest.py  # CI check
│   ├── references/           # Hand-crafted reference prompts
│   └── generated/            # PromptKit-generated prompts (gitignored)
└── docs/                     # Documentation and presentations
```
