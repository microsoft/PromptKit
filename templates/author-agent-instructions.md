<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-agent-instructions
description: >
  Assemble a set of PromptKit components (persona, protocols) into a
  persistent agent instruction file for a specific agent runtime. Produces
  ready-to-commit files for GitHub Copilot, Claude Code, Cursor, or all
  supported platforms. Use this template to create reusable, version-controlled
  agent behaviors instead of ephemeral one-off prompts.
persona: spl-contributor
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: agent-instructions
params:
  platform: "Target agent platform(s): 'GitHub Copilot', 'Claude Code', 'Cursor', or 'All'"
  base_persona: "PromptKit persona to use as the base identity (e.g., 'systems-engineer', 'security-auditor', 'software-architect', 'devops-engineer'). Specify 'custom' to define a new persona inline."
  selected_protocols: "Comma-separated list of PromptKit protocols to encode as standing instructions (e.g., 'anti-hallucination, self-verification, memory-safety-c'). Leave blank for persona-only output."
  behaviors: "Description of the reusable behaviors and skills to encode. What should the agent always do, never do, and how should it reason in this context?"
  scope: "Scope of the instructions: 'project' (per-repository file) or 'user' (global agent settings, if platform supports it). Defaults to 'project'."
  context: "Additional project or domain context to embed in the instruction file (e.g., tech stack, coding conventions, team preferences)."
input_contract: null
output_contract:
  type: agent-instruction-file
  description: >
    One or more ready-to-commit agent instruction files at the correct
    path for each target platform, containing condensed persona and protocol
    guidance as continuous, natural Markdown.
---

# Task: Author Agent Instruction File

You are tasked with assembling PromptKit components into a persistent agent
instruction file for the specified platform(s). The output will be
version-controlled and automatically loaded by the agent runtime — it is
**not** a one-off prompt.

## Inputs

**Platform(s)**: {{platform}}

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

3. **Understand the target platform(s)**:
   - Review the Platform Notes in the `agent-instructions` format spec for
     each target platform.
   - Note any size constraints or syntax restrictions that apply.

### Step 2: Condense and Adapt the Content

Transform the loaded components into agent instruction prose:

1. **Condense the persona** into a compact identity statement (3–8 sentences):
   - Who the agent is and what domain expertise it has
   - Core behavioral stance (how it reasons, what it refuses to do)
   - How it handles uncertainty

2. **Condense each protocol** into standing directives:
   - Preserve all specific checks and phase steps from the protocol
   - Omit meta-commentary about the protocol's structure
   - Rewrite in second person ("When you encounter X, always Y")
   - If multiple protocols overlap, merge the redundant parts

3. **Incorporate the additional behaviors** from `{{behaviors}}`:
   - Add any domain-specific or project-specific instructions
   - Ensure they do not conflict with the persona or protocol directives

4. **Incorporate the project context** from `{{context}}`:
   - Include tech stack, conventions, or constraints as a short "Project Context"
     section at the end of the instruction file

5. **Check for conflicts**:
   - Verify no two directives contradict each other
   - If a conflict is found, resolve it in favor of the more conservative/safe
     directive and note the resolution

### Step 3: Apply Platform Constraints

For each target platform, adapt the content:

1. **GitHub Copilot** (`.github/copilot-instructions.md`):
   - Target ~2–6 KB of content for reliable ingestion
   - Use plain Markdown with clear headings and bullets
   - If content exceeds 8 KB, summarize protocol sections and note what was condensed

2. **Claude Code** (`CLAUDE.md`):
   - No strict size limit — prefer completeness over brevity
   - Use clear Markdown structure; Claude Code reads the full file

3. **Cursor** (`.cursorrules`):
   - Target under 2 KB; omit extended examples and rationale
   - Keep directives short and imperative
   - Note any omitted content in a comment at the end of the file

4. **All platforms** (when `{{platform}}` is `All`):
   - Produce a separate, platform-appropriate file for each supported platform
     (GitHub Copilot, Claude Code, and Cursor) — three distinct output files
   - Apply each platform's size and syntax constraints independently
   - Note differences between variants in the Platform Notes section
   - The File Manifest in the output MUST list all three file paths

### Step 4: Produce the Output Files

Following the `agent-instructions` format specification:

1. **Write the file manifest** listing each file to be created with its path and scope.

2. **Write the complete file content** for each target platform:
   - Open with: `<!-- Generated by PromptKit — edit with care -->`
   - Include condensed persona, protocol directives, behaviors, and context
   - Use second-person directives throughout
   - Do NOT include PromptKit-internal headers (`# Identity`, `# Reasoning
     Protocols`, `# Output Format`, `# Task`)

3. **Write the Platform Notes** section covering how each file is loaded,
   known constraints, and recommended maintenance.

4. **Write the Activation Checklist** for each platform.

### Step 5: Verify the Output

Apply the `self-verification` protocol:

1. **Content completeness**: Every component from Step 1 is represented
   in the output (verify each persona attribute, each protocol phase).

2. **Platform compliance**:
   - File paths are correct for each platform
   - Content size is within platform guidance
   - No PromptKit-internal headers appear in generated file content

3. **Directive consistency**: No contradictory instructions exist within
   a single output file.

4. **Actionability**: All instructions are specific and actionable — no
   vague guidance like "be careful" or "think deeply".

5. **No placeholders**: All `{{param}}` references are resolved; no
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

- [ ] All output files begin with the PromptKit generation comment
- [ ] No PromptKit-internal section headers appear in any output file
- [ ] All `{{param}}` placeholders are resolved
- [ ] File paths are correct for each target platform
- [ ] Content size is within platform guidance for each platform
- [ ] Persona identity is clearly stated in the first paragraph
- [ ] Every protocol phase is represented as a standing directive
- [ ] No contradictory directives exist within a single file
- [ ] Platform Notes and Activation Checklist are complete
- [ ] Output is ready to commit without further editing
