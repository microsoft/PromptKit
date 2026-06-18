<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: enhancement-report
type: format
description: >
  Output format for prompt asset enhancement. Structures asset
  identification, provenance and version detection, a capability baseline, a
  prioritized enhancement plan classified by the enhancement-categories
  taxonomy, application status, residual gaps, and coverage.
produces: enhancement-report
---

# Format: Enhancement Report

The output MUST be a structured enhancement report. The report accompanies the
enhancement work in both modes: in **document mode** it is the sole
deliverable (a plan); in **action mode** it records what was applied to the
asset.

Use the **full format** by default. Use the **abbreviated format** only when
the conditions below are met.

## Format Selection

Before writing the report, **enumerate and classify all enhancement
opportunities first** (count and highest priority). Then choose the format:

- **Abbreviated**: opportunity count is 5 or fewer AND no High-priority
  opportunities AND the asset is a single file.
- **Full**: more than 5 opportunities, OR any High-priority opportunity, OR a
  mixed/multi-file asset set, OR action mode (changes were applied).

If the invoking template explicitly requires the full structure, use the full
format regardless of count.

## Status and Priority Vocabularies

- **Enhancement status** (one per opportunity):
  - **Proposed** — identified and offered; not yet acted on (document mode, or
    awaiting confirmation).
  - **Applied** — confirmed and written into the asset (action mode).
  - **Deferred** — confirmed relevant but intentionally not applied this pass;
    state why.
  - **Skipped** — excluded by the user's focus, or declined; state why.
- **Priority**: High / Medium / Low, per the `enhancement-categories`
  taxonomy's priority guidance. Do not invent a different scale.

## Abbreviated Format

Use only when all abbreviated conditions hold. Includes these sections:

```markdown
# <Asset Name> — Enhancement Report

## 1. Executive Summary
<2-4 sentences: what asset was assessed, its provenance, the number and
highest priority of opportunities, and what was applied (action mode) or
recommended (document mode).>

## 2. Enhancement Plan

### <ID>: <Short Title>
- **Category**: <E#_LABEL from enhancement-categories>
- **Target**: <file and location in the asset>
- **Source component**: <PromptKit component or convention>
- **Change**: <concrete description of the enhancement>
- **Priority**: High / Medium / Low
- **Status**: Proposed / Applied / Deferred / Skipped

## 3. Coverage
- **Examined**: <assets and files read>
- **Excluded**: <what was not assessed, and why>
```

All formatting rules from the full format still apply. If there are **zero**
opportunities, state "None identified" in the Enhancement Plan and record what
was examined in Coverage.

## Full Format

The full format MUST include the following sections in this exact order.
Sections **1-8** are required. Do **not** omit a section; if a section has no
content, state "None identified" (or, for Applied Changes in document mode,
"Not applicable — document mode").

## Document Structure

```markdown
# <Asset Name> — Enhancement Report

## 1. Executive Summary
<2-4 sentences for stakeholders: what asset was assessed, its provenance and
detected version, the count and highest priority of opportunities, and the
overall recommendation or what was applied. Understandable on its own.>

## 2. Asset Summary
- **Type**: <raw prompt / Copilot prompt file / agent definition /
  instruction-skill file / mixed set>
- **Files**: <paths, or "inline content">
- **Intent**: <one or two sentences; label [KNOWN] or [INFERRED]>
- **Mode**: <document / action>
- **Focus**: <user-specified enhancement categories, or "none — full scan">

## 3. Provenance and Version Detection
- **Provenance**: <PromptKit-generated (version known) / PromptKit-generated
  (version unknown) / Not PromptKit-generated>
- **Detected version**: <version, or "unknown" / "n/a">
- **Evidence**: <the marker text or structural signals observed, with
  locations; or "no PromptKit marker or structural match found">

## 4. Capability Baseline
<For each PromptKit layer, the asset's current coverage. Use a table:

| Layer | Coverage | Evidence |
|-------|----------|----------|
| Persona / identity | Full / Partial / Absent | <location or note> |
| Guardrails | Full / Partial / Absent | <location or note> |
| Analysis / reasoning | Full / Partial / Absent | <location or note> |
| Output format | Full / Partial / Absent | <location or note> |
| Taxonomy | Full / Partial / Absent | <location or note> |

List preserved user customizations below the table, or "None identified".>

## 5. Enhancement Plan
<All opportunities, ordered by priority then by the taxonomy Ranking Criteria.
Lead with a summary table, then a detail block per opportunity.

| ID | Category | Priority | Status | Summary |
|----|----------|----------|--------|---------|
| E-001 | E1_MISSING_GUARDRAIL | High | Applied | ... |

### <ID>: <Short Title>
- **Category**: <E#_LABEL>
- **Target**: <file and location>
- **Source component**: <PromptKit component or convention>
- **Change**: <concrete description; for Applied, what was written>
- **Preserves**: <user customizations protected by this change, or "n/a">
- **Priority**: High / Medium / Low
- **Status**: Proposed / Applied / Deferred / Skipped
- **Rationale**: <why this adds value; for Deferred/Skipped, why not now>

If no opportunities exist, state "None identified".>

## 6. Applied Changes
<Action mode: a per-file summary of what was changed. For each Applied
enhancement, give the file, the operation (edited / created / renamed /
deleted), and before/after notes or hunks; list any new or removed files
explicitly. Document mode: "Not applicable — document mode; no changes were
written." If action mode applied nothing (user declined all), state "No
changes applied — all opportunities Proposed or Skipped".>

## 7. Residual Gaps and Follow-ups
<Everything discovered but not applied this pass: Deferred and Skipped
opportunities, focus-excluded categories, and low-priority forward-looking
items (e.g., E8 provenance stamp, or the library-level output-versioning
follow-up). For each: what remains and what would close it. If none, state
"None identified".>

## 8. Coverage
- **Examined**: <assets and files read, including candidate library components>
- **Method**: <how the asset was assessed and how the library was compared>
- **Excluded**: <what was not assessed, and why>
- **Limitations**: <constraints affecting confidence — e.g., inferred intent,
  unknown provenance, partial access to referenced files>
```

## Formatting Rules

- Opportunities MUST be ordered by priority (High first), then by the
  `enhancement-categories` Ranking Criteria.
- Every opportunity MUST carry exactly one taxonomy label and a status.
- Every opportunity that edits existing text MUST name the customizations it
  preserves (or "n/a").
- Evidence MUST be concrete — cite asset locations and name source components;
  do not describe changes vaguely.
- The executive summary MUST be understandable without reading the rest.
- The report MUST distinguish E2 (new capability) from E3 (version upgrade)
  consistently with the provenance recorded in section 3 — an E3 label
  requires PromptKit provenance evidence.
- The Coverage section MUST include all four fields — Examined, Method,
  Excluded, Limitations — per the `self-verification` protocol.
