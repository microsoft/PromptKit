<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: enhancement-categories
type: taxonomy
description: >
  Classification scheme (E1-E8) for enhancement opportunities when upgrading
  an existing prompt asset (prompt, agent file, or instruction file) with
  PromptKit capabilities. Covers missing guardrails, newly-available
  components, version upgrades, format modernization, determinism hardening,
  persona/expertise gaps, structural decomposition, and provenance stamping.
domain: prompt-asset-enhancement
applicable_to:
  - enhance-prompt
---

# Taxonomy: Enhancement Categories

Use these labels to classify enhancement opportunities when upgrading an
existing prompt asset — a raw prompt, agent file, instruction file, or a
combination — with PromptKit capabilities. Every proposed enhancement MUST
use exactly one label from this taxonomy.

## Dual Use

This taxonomy serves two roles in the `enhance-prompt` workflow:

1. **User focus selector (input).** The user MAY name one or more labels (by
   numeric ID E1–E8, or full label ID such as E1_MISSING_GUARDRAIL) to scope
   the enhancement to specific areas. When a focus is set, only opportunities
   in the named categories are proposed; others are recorded under "Residual
   Gaps" but not applied.
2. **Classification scheme (output).** When the user does NOT specify a focus,
   the workflow analyzes the asset, discovers opportunities across all
   categories, and labels each one. The user then selects which to apply.

## Label Summaries

- **E1 (Missing Guardrail)**: The asset lacks a cross-cutting PromptKit
  guardrail that constrains fabrication, verification, or scope.
- **E2 (New Capability)**: A relevant PromptKit component exists that the
  asset does not reflect, independent of when the asset was authored.
- **E3 (Version Upgrade)**: A component the asset already embodies has since
  been improved; re-applying its current version upgrades the asset.
- **E4 (Format Modernization)**: The asset's output structure is ad hoc,
  incomplete, or inconsistent with current PromptKit format conventions.
- **E5 (Determinism Hardening)**: The asset contains vague language that two
  LLMs would interpret differently.
- **E6 (Persona/Expertise Gap)**: The asset lacks explicit, task-appropriate
  expertise framing.
- **E7 (Structural Decomposition)**: The asset mixes concerns in a monolith
  that should be separated into layers or composable files.
- **E8 (Provenance Stamp)**: The asset lacks a PromptKit provenance/version
  marker that would enable future enhancement passes.

## Labels

### E1_MISSING_GUARDRAIL

The asset performs a task that produces human- or LLM-consumed output but
lacks a cross-cutting PromptKit guardrail — anti-hallucination (epistemic
labeling, refusal to fabricate, source attribution), self-verification
(pre-finalization quality gate), or operational-constraints (scoping, tool
use, deterministic analysis).

**Signals**: No instruction to distinguish known/inferred/assumed claims; no
"cite your sources" or "do not invent" rule; no self-check or verification
step before finalizing; no scope or context-management guidance for a task
that reads large inputs.

**Example enhancement**: Add the `anti-hallucination` epistemic-labeling rules
and a `self-verification` pre-submission checklist to a code-review prompt
that currently asks only "find bugs."

**Priority guidance**: High when the asset drives decisions, modifies code, or
produces externally visible output. Medium for read-only summarization tasks.

### E2_NEW_CAPABILITY

A PromptKit component (persona, protocol, format, or taxonomy) exists in the
current library that is directly relevant to the asset's task and would add
value, but the asset does not reflect it. Unlike E3, this does not depend on
the asset's provenance — the capability is simply absent.

**Signals**: The asset's task maps to an existing template's domain (e.g.,
memory-safety review, security audit, requirements authoring) but omits the
corresponding analysis protocol or taxonomy; the manifest contains a component
whose description matches an uncovered need in the asset.

**Example enhancement**: Add the `memory-safety-c` analysis protocol and the
`stack-lifetime-hazards` taxonomy to a C code-review prompt that reviews only
for "correctness."

**Priority guidance**: High when the missing capability covers a safety- or
security-relevant gap. Medium for capabilities that improve thoroughness.
Low for tangential additions.

### E3_VERSION_UPGRADE

The asset embodies an older version of a specific, identifiable PromptKit
component that has since been improved, expanded, or corrected. Re-applying the
component's current version upgrades the asset. Requires **provenance evidence
tied to a specific component**: an explicit PromptKit marker, OR a strong
content-level match to a specific existing component. When no such evidence
exists — generic PromptKit-like structure is not enough — classify the same
content gap as E2 instead. Never fabricate a prior version.

**Signals**: An explicit PromptKit provenance marker, OR content that is
demonstrably an older, shorter, or superseded version of a specific current
component (fewer phases, missing rules, renamed sections) identified by reading
that component.

**Example enhancement**: Replace an older 3-rule embedded anti-hallucination
block with the current 5-rule `anti-hallucination` protocol, preserving any
user edits layered on top.

**Priority guidance**: High when the upgraded component fixes a correctness or
safety gap. Medium otherwise. Match the priority of the underlying component's
change.

### E4_FORMAT_MODERNIZATION

The asset's output structure is ad hoc, incomplete, or inconsistent with
current PromptKit format conventions — for example, it omits sections under
some conditions, lacks a "state 'None identified' rather than omit" rule, or
defines structure that an existing PromptKit format covers more completely.

**Signals**: Free-form "report your findings" with no section contract;
sections that disappear when empty; no severity/confidence framework where one
applies; an output shape that duplicates an existing PromptKit format
(investigation-report, requirements-doc, structured-findings) less completely.

**Example enhancement**: Replace "summarize what you found" with the
`investigation-report` format's section contract, including the "do not omit
sections" rule.

**Priority guidance**: Medium. High when downstream tooling or a pipeline
consumes the output and depends on stable structure.

### E5_DETERMINISM_HARDENING

The asset contains language that introduces non-deterministic interpretation,
such that two different LLMs (or two runs) would produce materially different
structure or classifications. Apply the determinism checks from the
`self-verification` protocol (Rule 6) and the `prompt-determinism-analysis`
protocol.

**Signals**: Vague quantifiers ("several", "some", "a few"); subjective
adjectives as criteria ("good", "clean", "appropriate"); conditionals with no
explicit else/default branch; standalone action verbs ("analyze", "evaluate")
without decomposed sub-steps; unbounded "keep it concise" with no limit.

**Example enhancement**: Rewrite "review the most important functions" as
"review every function reachable from an exported entry point; if none are
exported, review every function."

**Priority guidance**: Medium. High when the asset is reused across a team or
runs unattended, where drift compounds.

### E6_PERSONA_EXPERTISE_GAP

The asset lacks an explicit, task-appropriate expertise framing, or its
identity framing is thin or misaligned with the domain. A PromptKit persona
would supply the missing stance and domain knowledge.

**Signals**: The asset opens directly with task steps and no "you are…"
identity; a generic "you are a helpful assistant" for a specialized task; an
identity whose domain does not match the task (e.g., a generic reviewer for
kernel code).

**Example enhancement**: Prepend the `security-auditor` persona to a
vulnerability-hunting prompt that currently has no identity framing.

**Priority guidance**: Medium. High when the task demands specialized domain
judgment (security, kernel, RF, firmware) that a generic identity would miss.

### E7_STRUCTURAL_DECOMPOSITION

The asset combines multiple concerns — identity, cross-cutting rules, output
structure, and task steps — in a single undifferentiated block, making it hard
to read, maintain, or reuse. Restructuring into clear PromptKit-style layers
(or, for agent/instruction assets, splitting into composable skill files)
improves clarity and reuse without changing intent.

**Signals**: A long monolithic prompt with interleaved persona, rules, format,
and steps; a single instruction file covering many unrelated concerns that
`applyTo`-scoped skill files would target better; duplicated rules repeated
inline instead of referenced.

**Example enhancement**: Split a 400-line "do everything" instruction file into
a persona skill (`applyTo: **`) plus a memory-safety skill
(`applyTo: **/*.c, **/*.h`).

**Application note**: Splitting into multiple files is a file-level operation.
In action mode it requires explicit per-file confirmation before any file is
created, renamed, or deleted (see the `prompt-enhancement` protocol, Phase 6).

**Priority guidance**: Low to Medium. Raise to Medium when the monolith is
actively edited by multiple people or reused across projects.

### E8_PROVENANCE_STAMP

The asset lacks a PromptKit provenance/version marker. Adding one records which
PromptKit version and components produced the current state, enabling future
`enhance-prompt` passes to detect prior provenance and apply E3 version
upgrades precisely.

**Signals**: No `<!-- Generated by PromptKit … -->` marker; no record of which
components or version shaped the asset.

**Example enhancement**: Add a provenance comment naming the PromptKit version
and the components applied during this enhancement pass.

**Priority guidance**: Low. This is a forward-looking convenience, not a
capability gap. It ties to the low-priority output-versioning follow-up and
should never block higher-value enhancements.

## Disambiguation and Precedence

Each opportunity receives **exactly one** label. Because categories can overlap
(a missing guardrail is also, broadly, a "new capability"), apply the first
matching rule in this order and stop:

1. **E3** — the gap is an older version of a specific PromptKit component the
   asset already embodies, with provenance evidence (see E3).
2. **E1** — the gap is a missing cross-cutting guardrail (anti-hallucination,
   self-verification, operational-constraints).
3. **E5** — the gap is vague or non-deterministic directive text to tighten.
4. **E6** — the gap is missing or misaligned persona/expertise framing.
5. **E4** — the gap is in the asset's output/report structure.
6. **E7** — the gap is monolithic structure better split into layers or files.
7. **E8** — the gap is a missing provenance/version marker.
8. **E2** — any other newly relevant PromptKit task- or domain-specific
   capability (e.g., an analysis protocol or taxonomy) not covered above.

The same precedence governs focus selection: choosing **E2** scopes the work to
new task/domain capabilities only; guardrails, determinism, persona, format,
decomposition, and provenance are requested via E1, E5, E6, E4, E7, and E8
respectively.

## Ranking Criteria

Within a given priority level, order enhancements by value to the asset:

1. **Highest value**: E1 (missing guardrail) and E3 (version upgrade) when the
   underlying component addresses correctness or safety — these close active
   capability gaps.
2. **High value**: E2 (new capability) for safety/security-relevant additions
   and E5 (determinism hardening) for unattended or team-shared assets.
3. **Medium value**: E4 (format modernization), E6 (persona/expertise gap),
   and remaining E2/E5 items.
4. **Lowest value**: E7 (structural decomposition) and E8 (provenance stamp) —
   maintainability and forward-looking conveniences with no current capability
   impact.

## Usage

In the enhancement plan and report, reference labels as:

```
[ENHANCE: E1_MISSING_GUARDRAIL]
Target: review-c.prompt.md (entire asset)
Opportunity: The prompt asks the model to "find and fix bugs" with no rule
  against inventing function names or unverified behavior.
Source component: anti-hallucination (guardrail)
Priority: High
Status: Proposed
```
