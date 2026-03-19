# Contributing Components to PromptKit

This guide covers how to add new personas, protocols, formats, and templates
to PromptKit. It supplements [CONTRIBUTING.md](../CONTRIBUTING.md) with
detailed conventions, frontmatter requirements, and the manifest sync
workflow.

## Preferred Workflow

Use PromptKit's own `extend-library` template rather than hand-authoring.
This ensures new components follow conventions and fit the architecture:

```bash
npx promptkit
# Then: "I want to add a template for <use case>"
```

Or with GitHub Copilot CLI:

```bash
copilot -i "Read bootstrap.md and execute the prompt"
# Then: "I want to add a template for <use case>"
```

The `extend-library` template walks you through component design,
decomposition, and integration with the existing library.

## Naming Conventions

- **All filenames:** kebab-case matching the `name` field
  (e.g., `memory-safety-c` → `memory-safety-c.md`)
- **Persona headings:** include seniority level
  (e.g., "Senior Systems Engineer", not just "Systems Engineer")
- **Protocol phases:** numbered sequentially (Phase 1, Phase 2, …)
- **Template sections:** must include Non-Goals and Quality Checklist

## Component Types and Frontmatter

### Personas

**Location:** `personas/<name>.md`

**Required frontmatter:**

```yaml
---
name: my-persona
description: >
  A senior <role> with deep expertise in <domains>.
  <Key behavioral trait>. <Key priority>.
domain:
  - domain-one
  - domain-two
tone: precise, technical, methodical
---
```

**Body structure:**

```markdown
## Senior <Role Title>

### Expertise
- Domain area 1 (specific skills)
- Domain area 2 (specific skills)

### Behavioral Constraints
1. First principle — explanation
2. Second principle — explanation
```

### Protocols

**Location:** `protocols/<category>/<name>.md`

Categories:
- `guardrails/` — cross-cutting, apply to all tasks
- `analysis/` — domain or language-specific checks
- `reasoning/` — systematic reasoning methodologies

**Required frontmatter:**

```yaml
---
name: my-protocol
type: guardrail | analysis | reasoning
description: >
  What this protocol enforces or enables.
applicable_to:
  - template-name-1
  - template-name-2
# or: applicable_to: all
---
```

Optional fields for analysis protocols:
```yaml
language: C          # for language-specific analysis
```

**Body structure:**

```markdown
## Protocol Name

### Phase 1: <Phase Name>
Numbered, ordered steps. Each phase should have clear entry/exit criteria.

### Phase 2: <Phase Name>
…
```

**Rules:**
- Analysis and reasoning protocols MUST have numbered, ordered phases
- Guardrail protocols may use a rule/checklist structure instead of phases
- Each phase or rule section should be self-contained with clear deliverables
- Language-specific protocols are separate files, not conditional blocks

### Formats

**Location:** `formats/<name>.md`

**Required frontmatter:**

```yaml
---
name: my-format
type: format
description: >
  Output format for <use case>. Covers <sections>.
produces: artifact-type-label
consumes: other-artifact-type    # optional, for pipeline chaining
---
```

**Body structure:**

```markdown
## Format Name

### Document Structure
1. **Section Name** — what goes here
2. **Section Name** — what goes here

### Formatting Rules
- Rule 1
- Rule 2
```

The `produces` field declares the artifact type this format generates. If
the format expects input from a previous pipeline stage, add `consumes`.

### Templates

**Location:** `templates/<name>.md`

**Required frontmatter:**

```yaml
---
name: my-template
description: >
  What this template does in 1-3 sentences.
persona: persona-name
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/my-reasoning-protocol
format: my-format
params:
  param_one: "Description of what to provide"
  param_two: "Description of what to provide"
input_contract:
  type: artifact-type          # or null if no prerequisite
  description: >
    What artifact is consumed.
output_contract:
  type: artifact-type
  description: >
    What artifact is produced.
---
```

Optional fields:
```yaml
mode: interactive    # for live execution (default: single-shot)
```

**Body structure:**

```markdown
## Task Instructions

Main instructions using {{param_one}} and {{param_two}} placeholders.

### Analysis Plan
Step-by-step instructions for the LLM.

### Non-Goals
Explicitly state what this template does NOT cover.

### Quality Checklist
- [ ] Check 1
- [ ] Check 2
```

**Required sections:**
- Task instructions with `{{param}}` placeholders
- **Non-Goals** — explicit scope boundaries
- **Quality Checklist** — self-verification checklist

## The Manifest Sync Workflow

Every component change requires a corresponding `manifest.yaml` update.

### Step 1: Create the component file

Write the `.md` file with proper frontmatter in the correct directory.

### Step 2: Update manifest.yaml

Add an entry under the appropriate section:

```yaml
# For a new persona:
personas:
  - name: my-persona
    path: personas/my-persona.md
    description: >
      One-line description.

# For a new protocol:
protocols:
  reasoning:
    - name: my-protocol
      path: protocols/reasoning/my-protocol.md
      description: >
        One-line description.

# For a new format:
formats:
  - name: my-format
    path: formats/my-format.md
    produces: my-artifact-type
    description: >
      One-line description.

# For a new template:
templates:
  my-category:
    - name: my-template
      path: templates/my-template.md
      description: >
        One-line description.
      persona: my-persona
      protocols: [anti-hallucination, self-verification, my-protocol]
      format: my-format
```

### Step 3: Verify protocol naming

Templates reference protocols by **category path** in frontmatter:
```yaml
# In templates/my-template.md frontmatter:
protocols:
  - guardrails/anti-hallucination
  - reasoning/my-protocol
```

The manifest uses **short names**:
```yaml
# In manifest.yaml:
protocols: [anti-hallucination, my-protocol]
```

These must correspond. CI validates this.

### Step 4: Run the CI check

```bash
python tests/validate-manifest.py
```

This verifies that every template's protocol list in the manifest matches
its frontmatter.

## Quality Checklist Before Submitting

- [ ] YAML frontmatter is valid and complete (all required fields)
- [ ] Component `name` matches the filename
- [ ] `manifest.yaml` updated with new entry
- [ ] Protocol naming is consistent (category paths in template,
      short names in manifest)
- [ ] No vague instructions — specify what to analyze and how
- [ ] Protocols have numbered, ordered phases (analysis/reasoning) or
      structured rules (guardrails)
- [ ] Templates have Non-Goals and Quality Checklist sections
- [ ] `python tests/validate-manifest.py` passes
- [ ] Assembled prompt produces coherent output when tested

## Example: Adding a New Template

Here's a concrete example of adding a `review-api` template:

1. **Create** `templates/review-api.md` with frontmatter referencing
   `software-architect` persona, anti-hallucination + self-verification
   protocols, and a suitable format.

2. **Add** to `manifest.yaml` under `templates.code-analysis`:
   ```yaml
   - name: review-api
     path: templates/review-api.md
     persona: software-architect
     protocols: [anti-hallucination, self-verification]
     format: investigation-report
   ```

3. **Run** `python tests/validate-manifest.py` to verify sync.

4. **Test** with `npx promptkit assemble review-api -p …`
   to verify the assembled prompt is coherent.

5. **Submit** a PR with all three files changed: the new template,
   manifest.yaml, and optionally any new supporting components.
