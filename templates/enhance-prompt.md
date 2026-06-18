<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: enhance-prompt
mode: interactive
description: >
  Enhance an existing prompt asset (raw prompt, Copilot prompt file, agent
  definition, instruction/skill file, or a combination) with current PromptKit
  capabilities. Detects PromptKit provenance, baselines current capabilities,
  performs a gap analysis against the library, and proposes prioritized,
  category-classified enhancements. Supports document mode (enhancement plan)
  or action mode (apply in place after confirmation). Enables continuous
  improvement of LLM prompt assets.
persona: promptkit-contributor
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/prompt-enhancement
taxonomies:
  - enhancement-categories
format: enhancement-report
params:
  asset: "The prompt asset(s) to enhance — file path(s) or inline content. May be a raw prompt, Copilot prompt file, agent definition, instruction/skill file, or a combination."
  focus: "Optional — one or more enhancement categories (numeric IDs E1–E8, or full label IDs like E1_MISSING_GUARDRAIL, from the enhancement-categories taxonomy) to scope the work. Leave blank to let PromptKit scan the asset and suggest categories."
  output_mode: "Output mode — 'document' (produce an enhancement plan/report) or 'action' (apply confirmed enhancements in place)."
  context: "Optional — how the asset is used, target runtime/platform, audience, and any constraints or regions to leave unchanged."
input_contract: null
output_contract:
  type: enhancement-report
  description: >
    An enhancement report classifying each opportunity by the
    enhancement-categories taxonomy, with provenance/version detection, a
    prioritized plan, and — in action mode — the enhanced asset applied in
    place.
---

# Task: Enhance Prompt Asset

You are tasked with enhancing an existing **prompt asset** with current
PromptKit capabilities. A "prompt asset" is any LLM-facing instruction
artifact: a raw prompt, a Copilot prompt file (`.prompt.md`), an agent
definition, an instruction/skill file (e.g., `*.instructions.md`, `CLAUDE.md`,
`.cursorrules`), or a combination of these.

The asset may or may not have been generated with PromptKit originally. If it
was, your goal includes **upgrading** it to incorporate capabilities that did
not exist when it was authored. If it was not, your goal is to **enrich** it
with relevant PromptKit capabilities. Either way, you **preserve the asset's
original intent and the user's customizations** — you enhance, you do not
rewrite.

## Inputs

**Asset(s) to enhance**:
{{asset}}

**Focus** (optional enhancement categories):
{{focus}}

**Output Mode**:
{{output_mode}}

**Context**:
{{context}}

## Instructions

**Validate `output_mode` first.** It MUST be exactly `document` or `action`.
If `{{output_mode}}` is blank or any other value, ask the user which mode they
want before proceeding; never enter action mode (which writes to the asset)
without an explicit `action`.

Apply the **prompt-enhancement protocol** end to end, and classify every
opportunity with the **enhancement-categories taxonomy**. Work interactively:
do not apply any change to the asset until the user confirms.

### Phase 1: Ingest and Classify

Execute prompt-enhancement Phase 1. Read every asset file in full, classify
each asset's type, state its intent (label `[KNOWN]` or `[INFERRED]`), and
record its structure and placeholders. If the intent cannot be determined from
the asset, ask the user before proceeding.

### Phase 2: Detect Provenance and Version

Execute prompt-enhancement Phase 2. Determine whether the asset was previously
shaped by PromptKit and, if so, its version. Treat a missing marker as a normal
result — never fabricate a version. Record the provenance classification for
the report's Provenance and Version Detection section.

### Phase 3: Baseline and Gap Analysis

1. Execute prompt-enhancement Phase 3 to inventory the asset's current
   PromptKit-equivalent capabilities, recording coverage (Full / Partial /
   Absent) and flagging user customizations to preserve.
2. Read `manifest.yaml`, then **read the candidate component files** it points
   to (not just their manifest descriptions), and execute prompt-enhancement
   Phase 4 to identify gaps. Classify each gap with exactly one
   `enhancement-categories` label (E1–E8) using that taxonomy's Disambiguation
   and Precedence rules, and distinguish E2 (new capability) from E3 (version
   upgrade) strictly by the provenance evidence established in Phase 2.

### Phase 4: Propose and Confirm

Execute prompt-enhancement Phase 5.

1. **Apply the focus**: if the user named focus categories in `{{focus}}`,
   include only those categories in the actionable plan and record the rest as
   residual. If `{{focus}}` is blank, present opportunities across all
   categories and ask the user which to apply.
2. **Present the enhancement plan** using the `enhancement-report` format's
   Enhancement Plan section (summary table + per-opportunity detail), ordered
   by priority then by the taxonomy Ranking Criteria. Each opportunity starts
   at status `Proposed`.
3. **Ask the user to confirm** which opportunities to act on. In **action
   mode**, offer per opportunity: apply / defer / skip. In **document mode**
   (no edits are written), offer: recommend (keep as `Proposed`) / defer /
   skip.

   **Do NOT modify the asset until the user confirms.**

### Phase 5: Output

#### Document Mode (`output_mode: document`)

Produce the `enhancement-report`. The Applied Changes section states
"Not applicable — document mode; no changes were written." All opportunities
carry status `Proposed`, `Deferred`, or `Skipped`. This report is the
deliverable; do not edit the asset.

#### Action Mode (`output_mode: action`)

1. Execute prompt-enhancement Phase 6 for each confirmed opportunity, one at a
   time, in priority order. Preserve the asset's intent, customizations, native
   format, and placeholder syntax. For any enhancement that creates, renames,
   or deletes files (e.g., E7 structural decomposition), confirm the full
   proposed file set per file before writing. Apply a provenance stamp (E8)
   only if the user accepted it, and do it last.
2. Execute prompt-enhancement Phase 7 to verify coherence, intent preservation,
   no regressions, and determinism of the additions.
3. Produce the `enhancement-report` recording each opportunity's final
   status (`Applied` / `Deferred` / `Skipped`) and a per-file summary of
   applied changes in the Applied Changes section.
4. **Never write changes the user did not confirm.** If the user confirmed
   nothing, apply nothing and report all opportunities as `Proposed`,
   `Deferred`, or `Skipped` as applicable.

## Non-Goals

- Do NOT rewrite the asset or change its task intent — enhance only.
- Do NOT remove or weaken existing capabilities or user customizations except
  where the user explicitly approves a replacement (E3 version upgrade or E4
  format modernization).
- Do NOT invent PromptKit components or capabilities — propose only components
  and conventions that exist in the current library (apply the
  anti-hallucination protocol).
- Do NOT guess the asset's prior PromptKit version, and do NOT label a gap E3
  without provenance evidence tied to a specific component — treat such gaps as
  new capabilities (E2) instead.
- Do NOT implement library-level output version-stamping here — that is a
  separate, low-priority follow-up; this template only reads provenance markers
  and may add one to the asset (E8) when accepted.
- Do NOT contribute the user's asset back to the PromptKit library — the output
  belongs to the user.

## Quality Checklist

Before finalizing, verify:

- [ ] Every asset file provided was read and classified (Phase 1)
- [ ] Provenance and version were determined, with a missing marker handled
      gracefully and no fabricated version (Phase 2)
- [ ] Candidate library components were read (not just manifest descriptions)
      before classifying gaps
- [ ] Every proposed enhancement carries exactly one enhancement-categories
      label (via the taxonomy's Disambiguation and Precedence rules) and a
      priority
- [ ] E3 (version upgrade) labels are used only with provenance evidence tied
      to a specific component; otherwise gaps are labeled E2
- [ ] The user's focus (if any) scoped the actionable plan; excluded
      categories appear under Residual Gaps
- [ ] No change — including any file creation, rename, or deletion — was
      applied without explicit user confirmation
- [ ] In action mode: the asset's intent, customizations, native format, and
      placeholder syntax are preserved, and Phase 7 verification passed
- [ ] The enhancement-report sections are all present (none omitted; "None
      identified" used where empty), including the Coverage section with
      Examined / Method / Excluded / Limitations
- [ ] The report's E2/E3 classification is consistent with the recorded
      provenance
