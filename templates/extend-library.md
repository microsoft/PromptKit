<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: extend-library
mode: interactive
description: >
  Guide a contributor through designing and building new PromptKit components.
  Uses the interactive-design workflow: reason through the design,
  then generate PR-ready files. Produces all necessary components
  (persona, protocol, format, taxonomy, template) and a manifest update.
persona: promptkit-contributor
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/promptkit-design
format: promptkit-pull-request
params:
  use_case: "What the new prompt template should help users accomplish"
  context: "Any additional context — target domain, example workflows, existing tools"
input_contract: null
output_contract:
  type: promptkit-contribution
  description: >
    A complete set of PR-ready files (components + manifest update)
    and a pull request description.
---

# Task: Extend PromptKit

You are tasked with guiding a contributor through designing and building
new components for PromptKit.

## Inputs

**Use Case**:
{{use_case}}

**Additional Context**:
{{context}}

## Instructions

### Step 1: Understand the Library

Read the following files to understand the library's architecture
and conventions:

- `CONTRIBUTING.md` — conventions for adding components
- `manifest.yaml` — index of all existing components
- Browse existing components of each type to understand the expected
  depth, structure, and tone.

### Step 2: Interactive Design (Phase 1)

**Apply the promptkit-design protocol.** Work interactively with the user:

1. **Clarify the use case.** Ask specific questions:
   - What task does the user want to support?
   - What inputs will the user provide? (code, repo URL, problem description, etc.)
   - What output do they expect? (report, action list, document, etc.)
   - Who is the target user?

2. **Determine what components are needed.** For each, explain WHY:
   - Does this need a new persona, or does an existing one work?
   - What protocols are needed? Do existing ones apply?
   - What output format? Existing or new?
   - Is a taxonomy needed for classifying findings?
   - What template parameters are required?

3. **Challenge the design.** Push back on:
   - Scope that is too broad (should this be split into multiple
     templates?) or too narrow (should this merge with an existing
     template?)
   - Missing edge cases (what if the repo has no PRs? no CI?)
   - Overlap with existing components

4. **Do NOT generate files until the user confirms the design.**

### Step 3: Generate PR-Ready Files (Phase 2)

Once the user confirms the design:

1. **Generate each component file** following CONTRIBUTING.md conventions.
2. **Generate the manifest update** showing exactly what to add.
3. **Generate the PR description** following the promptkit-pull-request format.
4. **Apply the self-verification protocol** — check every file against
   the CONTRIBUTING.md quality checklist.

### Step 4: Review and Refine (Phase 3)

1. Present the files for the user's review.
2. Make changes as requested, preserving consistency across all files.
3. Continue until the user is satisfied.

### Step 5: Commit and Submit (Phase 4)

Once the user is satisfied with the generated files:

1. **Create a new branch** off `main` for the contribution. Use a
   descriptive branch name derived from the template name
   (e.g., `add-repo-management-template`). Do NOT commit to the
   current branch or directly to `main`.
2. **Ask the user before committing.** Present a summary of what
   will be committed (files created, manifest changes) and ask
   for confirmation before running any git commands.
3. **Commit** the new component files and manifest update.
4. **Offer to create a pull request.** Ask the user if they want
   a PR created. If yes, push the branch and create the PR using
   the PR description generated in Step 3.

## Non-Goals

- Do NOT modify existing components (except `manifest.yaml`).
- Do NOT implement the functionality described by the new template —
  you are building the *prompt template*, not executing it.
- Do NOT add components "just in case" — only add what the use case requires.

## Quality Checklist

Before presenting files, verify:

- [ ] All files have SPDX headers (MIT, PromptKit Contributors)
- [ ] YAML frontmatter is valid and complete for each component type
- [ ] File names are kebab-case and match the `name` field
- [ ] Template has input/output contracts defined
- [ ] Template references its persona, protocols, and format correctly
- [ ] Protocols have numbered, ordered phases with specific checks
- [ ] No vague instructions — every step is actionable
- [ ] manifest.yaml additions are correct YAML
- [ ] New components don't duplicate or conflict with existing ones
