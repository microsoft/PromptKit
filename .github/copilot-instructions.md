# PromptKit — Copilot Instructions

## How to Use This Repository

When a user asks you to perform a task that this library supports (writing
requirements, investigating bugs, reviewing code, etc.), start by reading
and executing `bootstrap.md`. It is the entry point that guides component
selection, parameter gathering, and prompt assembly. Do not try to answer
the task directly — assemble the right prompt first.

## What This Repository Is

PromptKit is a composable prompt library, not a software application. There
is no build system, no runtime, and no application code. Every file is
Markdown or YAML — the "code" is prose that LLMs consume.

The core loop: `bootstrap.md` reads `manifest.yaml` to discover components,
then assembles them into task-specific prompts from five composable layers:
**personas** → **protocols** → **formats** → **taxonomies** → **templates**.

## Architecture

Templates are the orchestration layer. Each template declares which persona,
protocols, and format to compose via YAML frontmatter. The bootstrap engine
reads these declarations from `manifest.yaml` and assembles a single coherent
prompt in this order:

1. Identity (persona)
2. Reasoning Protocols (one or more, in order)
3. Classification Taxonomy (if applicable)
4. Output Format (structure rules)
5. Task (template with `{{param}}` placeholders filled)
6. Non-Goals

Templates can chain via **pipelines** — each declares `input_contract` /
`output_contract` with artifact types (e.g., `requirements-document` →
`design-document`). The `document-lifecycle` pipeline chains requirements →
design → validation.

## Component Conventions

All components use **kebab-case** filenames matching their `name` field.

### Protocols have three categories with different scoping rules:

- **`guardrails/`** — Cross-cutting, apply to all tasks (anti-hallucination,
  self-verification, operational-constraints)
- **`analysis/`** — Domain/language-specific checks (memory-safety-c,
  security-vulnerability). Language-specific protocols are separate files,
  not conditional blocks.
- **`reasoning/`** — Systematic reasoning approaches (root-cause-analysis,
  requirements-elicitation)

### Template frontmatter references protocols by category path:

```yaml
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/root-cause-analysis
```

But `manifest.yaml` uses **short names** (without category prefix):

```yaml
protocols: [anti-hallucination, self-verification, root-cause-analysis]
```

These two lists must stay in sync — CI enforces this via
`tests/validate-manifest.py`.

### Templates have two modes:

- **Single-shot** (default): gather params, assemble prompt, write file
- **Interactive** (`mode: interactive` in frontmatter): execute directly in
  the current session with a reasoning-and-challenge phase before generation

### Required frontmatter fields by component type:

- **Persona**: `name`, `description`, `domain`, `tone`
- **Protocol**: `name`, `type` (guardrail|analysis|reasoning), `description`
- **Format**: `name`, `type` (format), `description`, `produces`
- **Template**: `name`, `description`, `persona`, `protocols`, `format`,
  `params`, `input_contract`, `output_contract`

## Manifest Sync Rule

`manifest.yaml` is the source of truth for the bootstrap engine. When
adding or modifying any component:

1. Update the component's YAML frontmatter
2. Update `manifest.yaml` to match
3. The CI check (`tests/validate-manifest.py`) validates that every
   template's `protocols` list in the manifest matches its frontmatter

## CI

```bash
# Validate manifest ↔ template protocol sync (the only CI check)
python tests/validate-manifest.py
```

Triggered on push/PR when `manifest.yaml`, `templates/**`, or
`tests/validate-manifest.py` change.

## Testing

There is no automated test suite. Testing uses **reference comparison**:
hand-crafted known-good prompts in `tests/references/` are compared against
PromptKit-generated prompts in `tests/generated/` (gitignored) across five
dimensions: task framing, reasoning methodology, output specification,
operational guidance, and quality assurance. See `TESTING.md` for the full
methodology.

## Adding New Components

The preferred workflow is to use PromptKit's own `extend-library` template
(interactive mode) rather than hand-authoring:

```bash
copilot -i "Read bootstrap.md and execute the prompt"
# Then: "I want to add a template for <your use case>"
```

This generates PR-ready files following all conventions automatically.

When hand-authoring: protocols must have numbered, ordered phases with
specific checks (not vague instructions). Templates must include a quality
checklist section. Formats define structure only (not content) and enforce
"if a section is empty, state 'None identified'" — never omit sections.

Protocols must be **independent and additive** — composing any two protocols
together must not produce conflicting instructions.
