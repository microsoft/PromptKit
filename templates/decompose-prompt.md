<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: decompose-prompt
mode: interactive
description: >
  Reverse-engineer a hand-written prompt into PromptKit's semantic
  layers. Decomposes the prompt into persona, protocol, taxonomy,
  format, and template segments. Maps segments to existing library
  components, flags improvements to existing components, and generates
  PR-ready files for novel components.
persona: promptkit-contributor
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/prompt-decomposition
format: promptkit-pull-request
params:
  source_prompt: "Path to the bespoke prompt file, or inline prompt content"
  context: "Optional domain context — what the prompt is used for, target audience, known limitations"
input_contract: null
output_contract:
  type: promptkit-contribution
  description: >
    A decomposition report (console output) plus PR-ready component
    files for novel components, manifest update, and PR description.
---

# Task: Decompose and Assimilate a Prompt

You are tasked with reverse-engineering an existing hand-written prompt
into PromptKit's composable component model, then generating PR-ready
files for any novel components worth assimilating into the library.

## Inputs

**Source Prompt**:
{{source_prompt}}

**Additional Context**:
{{context}}

## Instructions

### Step 1: Ingest and Understand

1. Read the source prompt in its entirety. If a file path is provided,
   read the file. If inline content is provided, use it directly.
2. **Confidentiality triage.** Before any decomposition, ask:
   - Does the source prompt contain any of the following: (1) content
     marked confidential by its author, (2) company-specific tooling
     or process details, (3) customer data or PII, (4) unreleased
     product features, or (5) pricing or business strategy?

   If yes, **stop**. Confidential content must not be contributed to
   an open-source library. Instruct the user to extract only
   high-level principles and keep specifics out — the same rule that
   applies to not pasting internal code into OSS PRs. Only proceed
   if the user confirms the prompt is safe for open-source use.
3. **Ask about authorship, licensing, and attribution.** Ask:
   - Who authored the source prompt? (name, handle, or "unknown")
   - Is the prompt publicly available, or was it shared privately?
   - What license or permission governs reuse of this prompt?
     (e.g., open-source license, explicit permission from author,
     public domain, unknown)
   - Has the author been notified that their work may be decomposed
     and partially assimilated into an open-source library?

   If the license is unknown or restrictive, remind the user to
   obtain permission before submitting a PR. If the author has not
   been notified, remind the user that a courtesy disclosure is
   appropriate — the original author invested effort in crafting
   the prompt and deserves to know their work influenced PromptKit
   components. Suggest the user reach out before or alongside the
   PR submission. Record the author and license information for
   inclusion in the PR description.
4. Read `manifest.yaml` to understand the full inventory of existing
   PromptKit components.
5. Browse representative existing components of each type (at least one
   persona, one reasoning protocol, one analysis protocol, one guardrail
   protocol, and one format) to calibrate expected depth and style.

### Step 2: Decompose (Interactive — Phase 1)

**Apply the prompt-decomposition protocol**, Phases 1–5.

1. Execute Phase 1 (Prompt Ingestion) — build the segment inventory.
2. Execute Phase 2 (Semantic Segmentation) — classify each segment.
3. Execute Phase 3 (Library Matching) — map segments to existing
   components.
4. Execute Phase 4 (Improvement Detection) — extract deltas from
   partial matches.
5. Execute Phase 5 (Novelty Assessment) — evaluate reusability of
   novel segments.

**Present the Decomposition Report** to the user (Part A from the
protocol's Presentation section). Include:
- The full segment inventory with classifications and match scores
- The improvement log (back-port candidates for existing components)
- The list of proposed novel components with names and types

**Ask the user to review and confirm:**
- Are the segment classifications correct?
- Should any "Novel" segments instead be treated as belonging in the
  template body (not worth a standalone component)?
- Should any back-port candidates be promoted to new components or
  dropped?
- Are the proposed component names acceptable?

**Do NOT proceed to file generation until the user confirms.**

### Step 3: Generate PR-Ready Files (Phase 2)

Once the user confirms the decomposition:

1. Execute Phase 6 (Component Synthesis) from the prompt-decomposition
   protocol.
2. Generate each novel component file following CONTRIBUTING.md
   conventions.
3. Generate the manifest update fragment.
4. Generate the PR description following the promptkit-pull-request
   format.
5. Apply the self-verification protocol — check every generated file
   against the quality checklist below.

Present all generated files for the user's review.

### Step 4: Review and Refine (Phase 3)

1. Present the files for the user's review.
2. Make changes as requested, preserving consistency across all files.
3. If the user wants to adjust classifications or add/remove components,
   return to Step 2 with the updated decisions.
4. Continue until the user is satisfied.

### Step 5: Commit and Submit (Phase 4)

Once the user is satisfied with the generated files:

1. **Create a new branch** off `main` for the contribution. Use a
   descriptive branch name (e.g., `assimilate-<source-prompt-name>`).
   Do NOT commit to the current branch or directly to `main`.
2. **Ask the user before committing.** Present a summary of what
   will be committed (files created, manifest changes) and ask
   for confirmation before running any git commands.
3. **Commit** the new component files and manifest update.
4. **Offer to create a pull request.** Ask the user if they want
   a PR created. If yes, push the branch and create the PR using
   the PR description generated in Step 3.
5. **Include the improvement log** in the PR description so that
   back-port candidates for existing components are tracked as
   follow-up work.
6. **Include attribution.** Add an "Acknowledgment" section to the PR
   description crediting the original prompt author (if known). If
   the author has a GitHub handle, @-mention them so they can follow
   the PR.

## Non-Goals

- Do NOT modify existing PromptKit components (except `manifest.yaml`).
  Improvements to existing components are logged as back-port candidates
  for separate follow-up PRs.
- Do NOT execute the source prompt — you are decomposing it, not running it.
- Do NOT generate components for segments classified as "Meta /
  Non-reusable" or determined to belong in the template body — those
  are kept in the template body or discarded.
- Do NOT force every segment into a PromptKit component. Some content
  is inherently non-reusable and that is acceptable.

## Quality Checklist

Before presenting files, verify:

- [ ] All files have SPDX headers (MIT, PromptKit Contributors)
- [ ] YAML frontmatter is valid and complete for each component type
- [ ] File names are kebab-case and match the `name` field
- [ ] Protocols have numbered, ordered phases with specific checks
- [ ] No vague instructions — every step is actionable
- [ ] Novel components do not duplicate or conflict with existing ones
- [ ] The template's protocol references match its manifest entry
- [ ] The improvement log is included in the PR description
- [ ] Every segment from the source prompt is accounted for (mapped
  to an existing component, generated as a new component, included in
  the template body, or explicitly discarded with rationale)
