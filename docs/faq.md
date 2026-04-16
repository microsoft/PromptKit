# Frequently Asked Questions

## General

### What is PromptKit?

PromptKit is a composable prompt library that treats prompts as engineered
software components. It provides reusable personas, reasoning protocols,
output formats, and task templates that snap together into reliable,
repeatable prompts.

### How is this different from a system prompt?

A system prompt is a monolithic block of text. PromptKit decomposes that
block into modular layers — persona (identity), protocols (reasoning rules),
format (output structure), and template (task instructions). You compose
them declaratively, version-control them independently, and reuse them
across tasks.

### Can I use PromptKit with ChatGPT / Claude / Gemini / any LLM?

Yes. PromptKit generates standard Markdown prompts. The assembled output
can be pasted into any LLM interface — ChatGPT, Claude, Gemini, Copilot
Chat, or any other tool that accepts text input.

Interactive mode requires GitHub Copilot CLI, Claude Code, or OpenAI Codex CLI, but the
`assemble` command produces a plain text file usable anywhere.

### Do I need GitHub Copilot CLI?

No. GitHub Copilot CLI (or Claude Code or OpenAI Codex CLI) is only needed for **interactive
mode**, which launches a live prompt-building session. The `list` and
`assemble` commands work standalone with just Node.js 18+.

### Is PromptKit an AI agent?

No. PromptKit is a prompt *library* and a template engine. It does not call
LLMs, make autonomous decisions, or execute multi-step plans. It produces
prompt text that you feed to an LLM yourself. Even in "interactive mode,"
the user drives every step — PromptKit just structures the conversation.

### When should I NOT use PromptKit?

- **Quick, one-off questions** — if you're asking "what does this error
  mean?" you don't need a composed prompt. Just ask your LLM directly.
- **Tasks with no structure** — brainstorming, open-ended exploration, and
  creative writing don't benefit from rigid output formats.
- **Fully autonomous workflows** — PromptKit produces prompts, not agents.
  If you need a system that makes decisions and takes actions without human
  review, PromptKit is the wrong tool.

PromptKit adds value when you need consistent, reviewable, repeatable
prompts — typically for engineering tasks where output structure and
reasoning rigor matter.

### What problems does PromptKit intentionally not solve?

- **Prompt optimization** — PromptKit does not auto-tune prompts or measure
  which phrasing works better. It provides structure, not optimization.
- **LLM orchestration** — it does not chain LLM calls, manage context
  windows, or handle retries. Use an orchestration framework for that.
- **Output validation** — it structures the prompt, not the response. The
  LLM may still produce unexpected output.

### How are prompts tested?

PromptKit tests prompt *structure*, not LLM output (which is
non-deterministic). The methodology: compare PromptKit-generated prompts
against hand-crafted reference prompts across five dimensions — task
framing, reasoning methodology, output specification, operational guidance,
and quality assurance. Gaps map directly to specific components (persona,
protocol, format, template) that need improvement.

See the [Testing Guide](testing-guide.md) for the full workflow.

## Usage

### How do I install PromptKit?

No installation needed. Use `npx` to run it directly:

```bash
npx promptkit list
npx promptkit assemble investigate-bug -p ...
```

Or clone the repo if you want to modify components:

```bash
git clone https://github.com/microsoft/promptkit.git
```

### What's the difference between single-shot and interactive mode?

- **Single-shot** (default): Assembles a prompt and writes it to a file.
  You paste the file into any LLM.
- **Interactive** (`mode: interactive` in template frontmatter): Loads
  components and executes directly in the current LLM session. Includes a
  reasoning-and-challenge phase before generating output. No file is
  written.

### Can I customize the persona for a template?

Some templates (e.g., `interactive-design`) let you choose the persona via
a `{{persona}}` parameter and are marked configurable in the manifest.
Most templates (including `review-code` and `investigate-bug`) use a fixed
persona such as `systems-engineer`; to change it, fork the template and
update the persona reference.

### Can I use multiple templates together?

Yes — that's what **pipelines** are for. Templates declare input/output
contracts that enable chaining. For example:

```
author-requirements-doc → author-design-doc → author-validation-plan
```

See the [Pipeline Guide](pipeline-guide.md) for details.

### Can I use PromptKit in CI/CD?

Yes. The `assemble` command is designed for scripting:

```bash
npx promptkit assemble author-release \
  -p version="2.1.0" \
  -p changes="$(git log --oneline v2.0.0..HEAD)" \
  -o release-notes-prompt.md
```

You could integrate this with an LLM API call to automate release notes,
code reviews, or documentation generation.

## Architecture

### Why YAML frontmatter?

YAML frontmatter serves two purposes:
1. **Machine-readable metadata** — the assembly engine reads it to resolve
   dependencies (which persona, protocols, format to load)
2. **Human-readable documentation** — developers can see at a glance what
   a template composes

The Markdown body below the frontmatter is the actual prompt content.

### Why are protocol names different in templates vs. the manifest?

Templates reference protocols by **category path** (e.g.,
`guardrails/anti-hallucination`) because the path encodes the category,
which is useful context when reading a template. The manifest uses **short
names** (e.g., `anti-hallucination`) because the manifest already organizes
protocols by category. CI validates they stay in sync.

### What's the manifest for?

`manifest.yaml` is the component registry — the source of truth for the
bootstrap engine and the CLI. It lists every component with its file path,
description, and relationships. The assembly engine reads it to resolve
template dependencies.

### Why separate files instead of one big YAML?

Separate Markdown files make components independently:
- **Versionable** — git blame, diff, and history per component
- **Reviewable** — PRs that modify one protocol don't touch others
- **Readable** — each file is a complete, self-contained document
- **Extensible** — add new components without modifying existing ones

## Contributing

### How do I add a new template?

1. Create `templates/<name>.md` with YAML frontmatter declaring persona,
   protocols, and format
2. Add an entry to `manifest.yaml`
3. Run `python tests/validate-manifest.py`
4. Submit a PR

See [Contributing Components](contributing-components.md) for full details.

### Can I use PromptKit to create PromptKit components?

Yes! The `extend-library` template is designed exactly for this. Run
interactive mode and say "I want to add a template for X." PromptKit walks
you through component design, decomposition, and manifest integration.

### How do I test my new component?

Use the [reference comparison methodology](testing-guide.md). Create a
hand-crafted reference prompt for the same task, generate the PromptKit
version, and compare across five dimensions (task framing, reasoning
methodology, output specification, operational guidance, quality assurance).

## Troubleshooting

### `npx promptkit` gives a 404

The npm registry may have a stale cache. Run:

```bash
npm cache clean --force
npx promptkit list
```

### Interactive mode says "No supported LLM CLI found"

Interactive mode requires GitHub Copilot CLI (`copilot`), Claude Code
(`claude`), or OpenAI Codex CLI (`codex`) on your PATH. Install one of them, or use `assemble` mode
instead.

### The assembled prompt is missing a section

Check that:
1. The component file exists at the path specified in `manifest.yaml`
2. The template's frontmatter references the correct component names
3. `python tests/validate-manifest.py` passes
