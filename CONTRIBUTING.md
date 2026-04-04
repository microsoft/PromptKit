<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

# Contributing to PromptKit

## Preferred Workflow: Use PromptKit to Extend Itself

> **Note:** Make sure you have the prerequisite tools installed first — see [Prerequisites](README.md#prerequisites) in the README.

The recommended way to add new components is to **use the library's own
`extend-library` template**, not to hand-author files. This ensures new
components follow the library's conventions, fit the architecture, and
include all required metadata.

```bash
cd promptkit
copilot
# The /promptkit skill activates automatically.
# Then: "I want to add a template for <your use case>"
```

The `extend-library` workflow will:
1. Ask clarifying questions about your use case
2. Determine which components are needed (persona, protocol, format, taxonomy, template)
3. Generate PR-ready files that conform to all conventions below
4. Produce a manifest update and PR description

The conventions below are the reference specification — the `extend-library`
workflow applies them automatically, but they are documented here for
review and manual use if needed.

## Adding New Components

PromptKit is designed to be extended. You can add new personas, protocols,
formats, and templates by following the conventions below.

### General Rules

1. **Every component gets a YAML frontmatter block** with at minimum:
   `name`, `description`, and type-specific fields.
2. **Use kebab-case** for file names and component names.
3. **Update `manifest.yaml`** when adding any new component.
4. **Test your component** by assembling it via the bootstrap prompt
   and verifying the output is coherent.

### Adding a Persona

Create a file in `personas/<name>.md`:

```yaml
---
name: <kebab-case-name>
description: <one-line summary>
domain:
  - <area of expertise>
tone: <comma-separated tone descriptors>
---
```

The body should include:
- A clear statement of expertise areas
- **Behavioral constraints** — how the persona reasons, what it refuses
  to do, how it handles uncertainty

**Guidelines:**
- Personas define *expertise and stance*, not task behavior
- Keep personas thin — they should be composable with any task
- Include anti-hallucination behaviors (distinguish known/inferred/assumed)

### Adding a Protocol

Create a file in `protocols/<category>/<name>.md`:

```yaml
---
name: <kebab-case-name>
type: <guardrail | analysis | reasoning>
description: <one-line summary>
language: <programming language, if language-specific>
applicable_to:
  - <template names this protocol works with>
---
```

The body should include:
- **Numbered phases** — protocols execute in order
- **Specific checks** within each phase — not vague instructions
- **Output format** for findings (if applicable)

**Guidelines:**
- Protocols must be **independent and additive** — applying two protocols
  together should not produce conflicting instructions
- Language-specific protocols should be separate files (e.g., `memory-safety-c.md`,
  `memory-safety-rust.md`), not conditional blocks
- Guardrail protocols apply to all tasks; analysis protocols are selective

#### `applicable_to` semantics

`applicable_to` means **"required by"** — it lists templates whose
`protocols:` frontmatter field **always** includes this protocol. It does
NOT mean "can optionally be added to". Use the following values:

| Value | Meaning |
|-------|---------|
| `all` | Every template should apply this protocol (reserved for cross-cutting guardrails such as `anti-hallucination`). |
| `[]` *(empty list)* | This protocol is intended for standalone / manual composition and is not automatically included by any template. Document this in the protocol file itself. |
| `[template-a, template-b]` | These specific templates always include this protocol in their `protocols:` frontmatter. Keep this list in sync with the template definitions and their `protocols` entries in `manifest.yaml`. The CI check (`tests/validate-manifest.py`) currently validates only that `manifest.yaml` and template `protocols:` frontmatter match; it does not enforce `applicable_to` bidirectionally. |

**Optional protocols** — protocols a template can optionally include via
`additional_protocols` in an assembled prompt — should NOT be listed in
`applicable_to` for the base template. Document them in the template's
body instead (e.g., in a "Recommended Additional Protocols" note).

### Adding a Format

Create a file in `formats/<name>.md`:

```yaml
---
name: <kebab-case-name>
type: format
description: <one-line summary>
produces: <artifact-type-name>
consumes: <artifact-type-name, if this format expects input from a pipeline>
---
```

The body should include:
- **Complete document structure** — every section, in order
- **Formatting rules** — naming conventions, required fields, cross-reference style
- **Template markers** showing where content goes

**Guidelines:**
- Formats define structure, not content
- Every section should have a brief description of what goes in it
- Include a "do not omit sections" rule — if a section is empty,
  state "None identified"

### Adding a Template

Create a file in `templates/<name>.md`:

```yaml
---
name: <kebab-case-name>
description: <one-line summary>
persona: <persona-name>
protocols:
  - <protocol-path>
format: <format-name>
params:
  <param_name>: "<description>"
input_contract:
  type: <artifact-type or null>
  description: <what input this template expects>
output_contract:
  type: <artifact-type>
  description: <what this template produces>
---
```

The body should include:
- **Inputs section** — listing all `{{param}}` placeholders
- **Instructions** — numbered, specific steps for the LLM to follow
- **Quality checklist** — verification steps before finalizing output

**Guidelines:**
- Templates are the orchestration layer — they should contain meaningful
  task-specific instructions, not just be lists of references
- Reference protocols by path in the frontmatter; the bootstrap assembles them
- Use `{{param_name}}` for all variable content

### Pipeline Integration

If your template is part of a chain:

1. Set `input_contract` to declare what artifact it consumes
2. Set `output_contract` to declare what it produces
3. Add the pipeline stage to `manifest.yaml` under `pipelines`

### Quality Checklist

Before submitting a new component:

- [ ] YAML frontmatter is valid and complete
- [ ] Component name matches the file name
- [ ] `manifest.yaml` is updated with the new component
- [ ] No vague instructions ("analyze carefully" → specify what to analyze and how)
- [ ] Protocols have numbered, ordered phases
- [ ] Templates have a quality checklist section
- [ ] Assembled prompt (via bootstrap) produces coherent output
- [ ] No conflicts with existing protocols when composed together
