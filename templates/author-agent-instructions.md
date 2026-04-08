<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-agent-instructions
description: >
  Assemble PromptKit components (persona, protocols) into composable
  agent skill files, custom agent definitions, or CLI skills. For
  GitHub Copilot, produces individual .github/instructions/*.instructions.md
  files with applyTo targeting, .github/agents/*.agent.md custom agents,
  or .github/skills/*/SKILL.md CLI skills. Also supports Claude Code
  (CLAUDE.md) and Cursor (.cursorrules).
persona: promptkit-contributor
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: agent-instructions
params:
  platform: "Target agent platform(s): 'GitHub Copilot', 'Claude Code', 'Cursor', or 'All'"
  output_type: "Type of output to produce: 'instructions' (persistent skill files), 'agent' (custom agent definition), or 'skill' (CLI skill). If not specified, ask the user."
  base_persona: "PromptKit persona to use as the base identity (e.g., 'systems-engineer', 'security-auditor', 'software-architect', 'devops-engineer'). Specify 'custom' to define a new persona inline."
  selected_protocols: "Comma-separated list of PromptKit protocols to encode as standing instructions (e.g., 'anti-hallucination, self-verification, memory-safety-c'). Leave blank for persona-only output."
  behaviors: "Description of the reusable behaviors and skills to encode. What should the agent always do, never do, and how should it reason in this context?"
  scope: "Scope of the instructions. Currently only 'project' (per-repository file) is supported."
  context: "Additional project or domain context to embed in the instruction file (e.g., tech stack, coding conventions, team preferences)."
input_contract: null
output_contract:
  type: agent-instruction-file
  description: >
    One or more ready-to-commit agent customization files. The artifact
    type `agent-instruction-file` covers all output types: instruction
    files (.instructions.md), custom agents (.agent.md), and CLI skills
    (SKILL.md). For GitHub Copilot instructions, produces composable
    skill files under .github/instructions/ with applyTo targeting.
    For custom agents, produces .github/agents/*.agent.md. For CLI
    skills, produces .github/skills/*/SKILL.md. For Claude Code and
    Cursor, produces a single combined file.
---

# Task: Author Agent Instruction Files

You are tasked with assembling PromptKit components into persistent agent
instruction files, custom agent definitions, or CLI skills for the
specified platform(s). The output type determines the file format:

- **`instructions`** *(default)*: Composable skill files that the runtime
  loads and combines automatically.
- **`agent`**: A custom agent definition with its own persona, tools,
  model preferences, and optional handoffs.
- **`skill`**: A CLI skill — a focused, reusable workflow invokable via
  `/skills` in the Copilot CLI.

## Inputs

**Platform(s)**: {{platform}}

**Output type**: {{output_type}}

**Base Persona**: {{base_persona}}

**Protocols to encode**: {{selected_protocols}}

**Behaviors**: {{behaviors}}

**Scope**: {{scope}}

**Additional Context**: {{context}}

## Instructions

### Step 1: Load and Understand the Components

1. **Read the base persona** from `personas/{{base_persona}}.md` (or define a
   custom persona inline if `{{base_persona}}` is `custom`).
   - If custom, ask the user to describe the domain, expertise areas, tone,
     and behavioral constraints before proceeding.

2. **Read each protocol** listed in `{{selected_protocols}}`:
   - Locate the file under `protocols/` using the manifest.
   - Understand what each protocol enforces and how it interacts with the persona.
   - Note the protocol's category (`guardrails/`, `analysis/`, `reasoning/`)
     and any language specificity — these determine `applyTo` targeting.

3. **Understand the target platform(s)**:
   - Review the Platform Reference in the `agent-instructions` format spec.
   - Note any size constraints or syntax restrictions that apply.

### Step 2: Plan the Output Structure

The planning step depends on the `{{output_type}}`:

#### For `instructions` (default) — Skill Decomposition

For GitHub Copilot output, determine how to split the content into
composable skill files. Decompose as follows (this structure is
normative unless the user requests an alternative in Step 1):

1. **Persona + guardrails skill** — One file containing:
   - Condensed persona identity (3–8 sentences)
   - All guardrail protocols (anti-hallucination, self-verification,
     operational-constraints)
   - `applyTo: '**'` (applies to all files)
   - Filename: `<persona-name>.instructions.md`

2. **One skill file per analysis/reasoning protocol** — Each containing:
   - The protocol's phases and checks as standing directives
   - `applyTo` set to the protocol's natural scope:
     - Language-specific → `**/*.c, **/*.h` (or appropriate extensions)
     - Domain-specific → relevant path patterns
     - General → `**`
   - Filename: `<protocol-name>.instructions.md`

3. **Project context skill** *(optional, if `{{context}}` is non-empty)* —
   - Project-specific conventions, tech stack, team preferences
   - `applyTo: '**'`
   - Filename: `project-context.instructions.md`

For Claude Code and Cursor, combine all content into a single file (these
platforms do not support per-file skill targeting).

#### For `agent` — Custom Agent Definition

Plan a single `.github/agents/<name>.agent.md` file containing:

1. **Frontmatter** with:
   - `description` — derived from the persona's one-line summary
   - `tools` — select the minimal set of tools the agent needs:
     - Read-only agents: `['search/codebase', 'web/fetch']`
     - Editing agents: `['search/codebase', 'edit', 'bash']`
     - Review agents: `['search/codebase']`
   - `model` — optional, based on task complexity
   - `handoffs` — optional, for multi-step workflows (e.g., plan → implement)

2. **Body** with the full agent instructions assembled from:
   - Condensed persona identity
   - Protocol directives as operating methodology
   - Task-specific instructions from `{{behaviors}}`
   - Output expectations

#### For `skill` — CLI Skill

Plan a `.github/skills/<name>/SKILL.md` file containing:

1. **A focused workflow** that the Copilot CLI user can invoke via `/skills`
2. The skill should encode:
   - A brief role context from the persona
   - The protocol methodology as step-by-step instructions
   - Clear input/output expectations
   - Any file or tool requirements
3. **For multi-phase workflows** (source template has multiple sequential
   phases, pipeline passes, or `mode: interactive` with explicit gates):
   - Add a `## Critical Constraints` section at the top (see the
     `agent-instructions` format's "Multi-phase workflow rules")
   - Add `### Critical Rule` stop directives at each phase boundary
   - Add a `## Current Pass Tracking` section with a status template
   - Explicitly name prohibited output types per phase
   - Include the anti-shortcut rationale explaining what failure mode
     the pipeline prevents
   - Do NOT condense the phase structure — it is the behavioral contract

### Step 3: Condense and Adapt the Content

Transform the loaded components into agent instruction prose:

1. **Condense the persona** into a compact identity statement (3–8 sentences):
   - Who the agent is and what domain expertise it has
   - Core behavioral stance (how it reasons, what it refuses to do)
   - How it handles uncertainty

2. **Condense each protocol** into standing directives:
   - Preserve every numbered phase and check from the protocol
   - Preserve all conditional logic and examples
   - Omit meta-commentary about the protocol's structure
   - Rewrite in second person ("When you encounter X, always Y")
   - If multiple protocols overlap, merge the redundant parts
   - **Exception for multi-phase workflows**: If the source template
     defines a multi-phase pipeline (multiple sequential phases where
     each phase's output feeds the next), do NOT condense away the
     phase gating logic. The sequential structure, explicit stop points,
     and prohibited-output rules ARE the critical behavioral constraints.
     Preserve them as imperative directives, not architectural
     descriptions. Specifically:
     - Keep each phase's gate rule as a `### Critical Rule` block
     - Keep the prohibited-output-type list per phase
     - Add a pass tracking block so the agent announces its current state
     - Include the anti-shortcut rationale (why the pipeline exists,
       what failure mode it prevents)
     See the `agent-instructions` format's "Multi-phase workflow rules"
     for the complete set of required enforcement mechanisms.

3. **Incorporate the additional behaviors** from `{{behaviors}}`:
   - Add any domain-specific or project-specific instructions
   - Ensure they do not conflict with the persona or protocol directives

4. **Incorporate the project context** from `{{context}}`:
   - Include tech stack, conventions, or constraints

5. **Check for conflicts**:
   - Verify no two directives contradict each other
   - If a conflict is found, resolve it in favor of the more conservative/safe
     directive and note the resolution

### Step 4: Apply Platform Constraints

For each target platform, adapt the content:

1. **GitHub Copilot** (`.github/instructions/*.instructions.md`):
   - Each skill file targets ~1–4 KB
   - Total combined instructions should stay under ~8 KB
   - Each file has YAML frontmatter with `description` and `applyTo`
   - Use plain Markdown with clear headings and bullets

2. **Claude Code** (`CLAUDE.md`):
   - No strict size limit — prefer completeness over brevity
   - Use clear Markdown structure; Claude Code reads the full file

3. **Cursor** (`.cursorrules`):
   - Target under 2 KB; omit extended examples and rationale
   - Keep directives short and imperative
   - Note any omitted content in a comment at the end of the file

4. **All platforms** (when `{{platform}}` is `All`):
   - Produce skill files for GitHub Copilot AND a combined file each for
     Claude Code and Cursor
   - Apply each platform's constraints independently
   - Note differences between variants in the Platform Notes section

### Step 5: Produce the Output Files

Following the `agent-instructions` format specification:

1. **Write the file manifest** listing every file to be created with its
   path, `applyTo` scope (for Copilot), and purpose.

2. **Write each GitHub Copilot skill file** with proper frontmatter:

       ---
       description: '<one-line summary>'
       applyTo: '<glob pattern>'
       ---
       <!-- Generated by PromptKit — edit with care -->

       <instruction content>

3. **Write combined files** for Claude Code / Cursor (if targeted):
   - Open with `<!-- Generated by PromptKit — edit with care -->`
   - Include all persona, protocol, behavior, and context content

4. **Write the Platform Notes** section covering how each file is loaded.

5. **Write the Activation Checklist** for each platform.

### Step 6: Verify the Output

Apply the `self-verification` protocol:

1. **Content completeness**: Every component from Step 1 is represented
   in at least one output file (verify each persona attribute, each
   protocol phase).

2. **Platform compliance**:
   - Copilot skill files have valid YAML frontmatter with `description`
     and `applyTo`
   - Filenames are lowercase, hyphen-separated, ending in `.instructions.md`
   - Content size is within platform guidance per file
   - No PromptKit-internal headers appear in generated file content

3. **Skill composability**: Each Copilot skill file is self-contained and
   makes sense when loaded independently or in combination.

4. **Directive consistency**: No contradictory instructions exist within
   or across skill files.

5. **Actionability**: All instructions include concrete conditions and
   actions — no vague guidance (flag any instruction containing "be
   careful," "think deeply," "consider," "try to," "when appropriate"
   without defined criteria).

6. **No placeholders**: All `{{param}}` references are resolved; no
   unsubstituted placeholders remain in any output file.

## Non-Goals

- Do NOT produce a raw PromptKit-assembled prompt (that is the bootstrap's
  default behavior). This template produces **persistent instruction files**.
- Do NOT implement new functionality — only encode existing PromptKit
  component content into platform-appropriate format.
- Do NOT generate application code, pipeline YAML, or documents as part
  of this output. Those are produced by other templates.
- Do NOT include the PromptKit assembly process itself in the output files —
  the agent runtime loading the file does not need to know about PromptKit.

## Quality Checklist

Before presenting the output, verify:

**For all output types:**
- [ ] No PromptKit-internal section headers appear in any output file
- [ ] All `{{param}}` placeholders are resolved
- [ ] Persona identity is clearly stated
- [ ] Every protocol phase is represented as a standing directive
- [ ] No contradictory directives exist within or across files
- [ ] Platform Notes and Activation Checklist are complete
- [ ] Output is ready to commit without further editing

**For `instructions` output:**
- [ ] GitHub Copilot files have valid YAML frontmatter (`description`, `applyTo`)
- [ ] Filenames are lowercase, hyphen-separated, ending in `.instructions.md`
- [ ] `applyTo` globs match the protocol's natural scope
- [ ] Each skill file is self-contained and independently coherent
- [ ] Content size is within platform guidance for each file

**For `agent` output:**
- [ ] Agent file has valid YAML frontmatter (`description`, `tools`)
- [ ] Filename is lowercase, hyphen-separated, ending in `.agent.md`
- [ ] Tools list follows least-privilege (only what the agent needs)
- [ ] Handoffs (if any) reference valid agent names
- [ ] Agent file is self-contained as a complete system prompt

**For `skill` output:**
- [ ] Skill directory uses lowercase, hyphen-separated name
- [ ] `SKILL.md` file is present in the skill directory
- [ ] Skill instructions are focused on a single task or workflow
- [ ] Input/output expectations are clearly documented
