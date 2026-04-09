# Getting Started with PromptKit

PromptKit is a composable prompt library that treats prompts as engineered
software components. This guide gets you from zero to your first assembled
prompt in under five minutes.

## Who This Is For

PromptKit is for engineers who already write careful prompts and want to
make them reusable, reviewable, and testable. It is not designed for casual
chat usage, fully autonomous agents, or automatic prompt optimization.
PromptKit produces prompts — it does not call LLMs or make decisions on
your behalf.

## Prerequisites

- **Node.js 18+** — required for the `npx` CLI
- **Optional:** [GitHub Copilot CLI](https://docs.github.com/en/copilot)
  or [Claude Code](https://docs.anthropic.com/en/docs/claude-code) or
  [OpenAI Codex CLI](https://github.com/openai/codex) for
  interactive mode

## Quick Start

### 1. List available templates

```bash
npx promptkit list
```

This prints every templatein the library with its description, persona,
protocols, and format. Add `--json` for machine-readable output.

### 2. Assemble a prompt

Pick a template and supply its parameters:

```bash
npx promptkit assemble investigate-bug \
  -p problem_description="Segfault when parsing untrusted input on Linux" \
  -p code_context="See src/parser.c lines 120-180" \
  -p environment="Ubuntu 22.04, gcc 12, AddressSanitizer enabled" \
  -o bug-investigation.md
```

This produces `bug-investigation.md` — a single composed prompt containing:

1. **Identity** — the `systems-engineer` persona
2. **Reasoning Protocols** — anti-hallucination, self-verification,
   operational-constraints, root-cause-analysis
3. **Output Format** — investigation-report structure (9 sections)
4. **Task** — the investigate-bug template with your parameters filled in

Paste the file contents into any LLM (ChatGPT, Copilot Chat, Claude, etc.)
and you're running.

### 3. Interactive mode (recommended)

```bash
npx promptkit
```

Interactive mode auto-detects your LLM CLI (GitHub Copilot CLI, Claude
Code, or OpenAI Codex CLI), copies PromptKit's content to a temp directory, and launches an
interactive session with `bootstrap.md` as the custom instruction. The
bootstrap engine walks you through:

> **Tip:** If you cloned the repo and are using Copilot CLI directly,
> just run `copilot` from the repo root — the `/promptkit` skill
> activates automatically, no `npx` needed.

1. What do you want to accomplish?
2. Template recommendation
3. Parameter collection
4. Output mode (raw prompt, agent instruction, Copilot prompt file, or agentic workflow)
5. Assembled prompt written to your project

## Understanding the Output

An assembled prompt is a Markdown file with four sections separated by
horizontal rules: **Identity** (persona), **Reasoning Protocols**,
**Output Format**, and **Task** (with your parameters filled in). Each
section comes from a separate reusable component.

For the full composition model and assembly internals, see the
[Architecture Guide](architecture.md).

## What Template Should I Use?

| I want to… | Template | Persona |
|------------|----------|---------|
| Investigate a bug | `investigate-bug` | systems-engineer |
| Review code | `review-code` | systems-engineer |
| Write requirements | `author-requirements-doc` | software-architect |
| Design a system | `author-design-doc` | software-architect |
| Plan implementation | `plan-implementation` | software-architect |
| Plan a refactoring | `plan-refactoring` | software-architect |
| Create a test plan | `author-validation-plan` | software-architect |
| Audit for security | `investigate-security` | security-auditor |
| Set up CI/CD | `author-pipeline` | devops-engineer |
| Generate release notes | `author-release` | devops-engineer |
| Create agent instructions | `author-agent-instructions` | promptkit-contributor |
| Extract requirements from code | `reverse-engineer-requirements` | reverse-engineer |

Run `npx promptkit list` for the full list with descriptions.

## Using the Output as Agent Instructions

Instead of a one-off prompt file, you can generate persistent agent
instruction files that your LLM tool loads automatically:

- **GitHub Copilot** → `.github/instructions/*.instructions.md`
- **Claude Code** → `CLAUDE.md`
- **Cursor** → `.cursorrules`

Use the `author-agent-instructions` template or select "Agent instruction
file" when running interactive mode.

## Testing Your Prompts

PromptKit includes a structured methodology for testing prompt quality.
Rather than testing LLM output (which is non-deterministic), you compare
prompt *structure* against hand-crafted reference prompts across five
dimensions. Gaps map directly back to specific components to fix.

See the [Testing Guide](testing-guide.md) for the full workflow.

## Next Steps

- **[Architecture Guide](architecture.md)** — understand the 5-layer
  composition model
- **[Pipeline Guide](pipeline-guide.md)** — chain templates into
  multi-stage workflows
- **[Testing Guide](testing-guide.md)** — verify prompt quality via
  reference comparison
- **[Contributing Components](contributing-components.md)** — add your own
  personas, protocols, and templates
- **[FAQ](faq.md)** — common questions answered
