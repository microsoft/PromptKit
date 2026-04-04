<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: copilot-prompt-file
type: format
description: >
  Output format for GitHub Copilot prompt files
  (.github/prompts/*.prompt.md). Packages an assembled PromptKit
  prompt as a reusable slash command invokable in Copilot Chat
  across VS Code, Visual Studio, and JetBrains IDEs. Full semantic
  fidelity — no content condensation.
produces: copilot-prompt-file
---

# Format: Copilot Prompt File

The output MUST be a ready-to-commit `.prompt.md` file that packages
the assembled PromptKit prompt as a GitHub Copilot Chat slash command.
The file is placed in `.github/prompts/` and becomes invokable via
`/<name>` in Copilot Chat.

**Semantic fidelity rule:** The assembled content MUST be preserved
verbatim. Every protocol phase, every check, every pattern, every
example from the source components MUST appear in the output. The
only transformations allowed are structural repackaging (section
headings, frontmatter, variable syntax) — never content removal.

Do NOT produce raw PromptKit output with assembly headers (`# Identity`,
`# Reasoning Protocols`, etc.). Repackage into natural headings that
read coherently as a standalone prompt file.

## Output Structure

### 1. File Manifest

State the file that will be created:

| File Path | Slash Command |
|-----------|---------------|
| `.github/prompts/<name>.prompt.md` | `/<name>` |

### 2. YAML Frontmatter

The `.prompt.md` file MUST begin with YAML frontmatter between `---`
markers containing:

| Field | Required | Source | Description |
|-------|----------|--------|-------------|
| `description` | Yes | Template `description` | Single sentence describing the actionable outcome |
| `agent` | Yes | Default: `agent` | The agent mode: `ask`, `edit`, `agent`, or `plan` |
| `model` | No | User preference | Language model ID (e.g., `Claude Sonnet 4`) |
| `tools` | No | Task requirements | List of tool/toolset names (e.g., `['search/codebase']`) |
| `argument-hint` | No | Template params | Hint text for user input |

**Frontmatter rules:**
- Use single quotes for all string values
- One field per line for clean git diffs
- Derive `description` from the PromptKit template's description —
  rewrite as a concise, actionable sentence if necessary
- Set `agent` based on whether the prompt needs tool access:
  - `agent` — for prompts that read/write files, search code, or
    run commands
  - `ask` — for prompts that only analyze provided context and produce
    a response (no tool use)
- Include `tools` only when the prompt requires specific tools beyond
  the agent's defaults

### 3. Markdown Body

The body contains the full assembled PromptKit prompt, repackaged with
format-native headings. Follow this structure:

```markdown
# <Task Title>

<Mission statement derived from the template's task description>

## Role

<Complete persona content — verbatim from the persona file>

## Analysis Methodology

<Complete protocol content — verbatim from each protocol file,
in the order declared by the template>

## Classification Reference

<Complete taxonomy content — verbatim, if any taxonomies are
referenced. Omit this section entirely if no taxonomies apply.>

## Output Expectations

<Complete format content — verbatim from the format file, describing
the expected output structure>

## Instructions

<Complete template body — verbatim, with parameters substituted>

## Non-Goals

<Task-specific exclusions>
```

**Section heading rules:**
- Use `#` (h1) for the task title only
- Use `##` (h2) for all major sections
- Use `###` (h3) and below for sub-sections within protocol phases
- If the template declares `format: null` or omits the format, skip
  the `## Output Expectations` section
- If no taxonomies are referenced, omit `## Classification Reference`
  entirely (do NOT include an empty section)

### 4. Variable Translation

Translate PromptKit parameter placeholders to `.prompt.md` input
variable syntax:

| PromptKit syntax | `.prompt.md` syntax | Notes |
|------------------|---------------------|-------|
| `{{param_name}}` | `${input:param_name}` | Required user input |
| `{{param_name}}` with a default hint | `${input:param_name:hint text}` | Include placeholder text from the template's `params` description |

Additional context variables available in `.prompt.md` (use when
the template's instructions reference editor context):

| Variable | Purpose |
|----------|---------|
| `${selection}` | Currently selected text in the editor |
| `${file}` | Active file path (relative to workspace) |
| `${workspaceFolder}` | Workspace root path |

**Translation rules:**
- Every `{{param}}` in the template MUST be translated — do NOT
  leave PromptKit-style placeholders in the output
- Use the template's `params` field descriptions as placeholder hints
- If a parameter naturally maps to editor context (e.g., "code to
  review" maps to `${selection}`), note this in the body instructions
  but keep the explicit input variable as a fallback

### 5. File References

If the assembled prompt references other workspace files (e.g.,
requirements documents, design docs, coding standards), use relative
Markdown links from the `.github/prompts/` directory:

```markdown
Follow the coding standards in [CONTRIBUTING.md](../../CONTRIBUTING.md)
```

If the prompt references tools, use the `#tool:<name>` syntax in
the body:

```markdown
Use #tool:search/codebase to find relevant code before analysis.
```

### 6. Activation Checklist

A numbered checklist of steps to activate the prompt file:

1. Commit `.github/prompts/<name>.prompt.md` to the repository.
2. Open the repository in VS Code (or Visual Studio / JetBrains).
3. In Copilot Chat, type `/<name>` to invoke the prompt.
4. Provide any required inputs when prompted.
5. Review the output and iterate as needed.

## Agent Mode Selection Guide

| Template category | Recommended `agent` | Recommended `tools` | Rationale |
|-------------------|---------------------|----------------------|-----------|
| Investigation (`investigate-*`) | `agent` | `['search/codebase']` | Needs to read code and trace execution |
| Code review (`review-*`) | `agent` | `['search/codebase']` | Needs to navigate and analyze code |
| Document authoring (`author-*`) | `agent` | `['search/codebase', 'edit']` | May need to read context and write files |
| Triage (`triage-*`) | `agent` | `['search/codebase']` | Needs repository context |
| Security audit (`investigate-security`) | `ask` | — | Analysis-only, should not modify code |
| Planning (`plan-*`) | `ask` | — | Produces a plan document, no code changes |

## Formatting Rules

- The `.prompt.md` file MUST be a single, self-contained Markdown
  document
- Do NOT include PromptKit assembly markers or meta-commentary about
  the assembly process
- Write all persona/protocol content in **second person** directed
  at the agent ("You are…", "When you encounter…")
- Preserve ALL numbered phases, specific checks, known-safe patterns,
  examples, and checklists from protocol sources
- Every section listed in the body structure MUST be present; if a
  section has no content, state "None identified"
- File names MUST be kebab-case matching the PromptKit template name
  (e.g., `review-code.prompt.md`, `investigate-bug.prompt.md`)
