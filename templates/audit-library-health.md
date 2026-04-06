<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-library-health
mode: interactive
description: >
  Comprehensive health audit of the PromptKit component library.
  Three-pass analysis: (1) structural consistency and overlap
  detection, (2) corpus safety for assimilation risks, and
  (3) runtime fitness assessment. Produces a unified investigation
  report with PR-ready remediation recommendations.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - reasoning/corpus-safety-audit
format: investigation-report
params:
  manifest_content: "The full contents of manifest.yaml"
  component_files: "The full contents of all component files to analyze (personas, protocols, formats, taxonomies, templates)"
  focus_areas: "Optional — specific areas to prioritize: 'consistency', 'corpus-safety', 'fitness', or comma-separated combination. Default: all"
  since: "Optional — restrict analysis to components added or changed since a tag, commit SHA, or date (e.g., 'v0.3.0', '2025-01-01'). Default: analyze all components"
  corpus_safety_policy: "Corpus safety rules to enforce. Must include at minimum: (1) confidentiality classification, (2) license/permission requirements, (3) no-verbatim-copying rule"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A unified health audit report with findings grouped into five
    categories: Overlap/Redundancy, Conflicts, Metadata Drift,
    Corpus Safety, and Runtime Bloat. Each finding includes
    PR-ready remediation recommendations.
---

# Task: Audit Library Health

You are tasked with performing a **comprehensive health audit** of the
PromptKit component library across three dimensions: structural
consistency, corpus safety, and runtime fitness.

## Inputs

**Manifest**:
{{manifest_content}}

**Component Files**:
{{component_files}}

**Focus Areas**: {{focus_areas}} (if blank, analyze all three passes)

**Since**: {{since}} (if blank, analyze all components regardless of age)

**Corpus Safety Policy**:
{{corpus_safety_policy}}

## How to Run (Self-Audit)

To run this audit against the PromptKit repository itself:

```
cd promptkit
copilot
# Say: "Run audit-library-health against this repo"
# The agent will read manifest.yaml and all component files automatically.
# For a focused audit: "Run audit-library-health, focus on corpus-safety,
#   for components added since v0.4.0"
```

When running as a self-audit, the agent should:
1. Read `manifest.yaml` as the `manifest_content` input.
2. Read all component files listed in the manifest as `component_files`.
3. If context limits prevent reading all files, prioritize by the
   `focus_areas` parameter and document which files were excluded.

## Instructions

### Preliminary: Input Validation and Scoping

1. **Confidentiality gate.** Before any analysis, ask the user:
   - Do any of the provided component files contain confidential,
     customer, or internal-only content?
   If yes, **stop** and advise the user to sanitize inputs before
   proceeding. An audit report citing confidential content would
   itself become a confidentiality leak.

2. **Completeness check.** Compare the manifest against the provided
   component files. Flag any components listed in the manifest but
   missing from the input. Restrict the audit to components actually
   provided — do NOT fabricate content for missing files.

3. **Scope narrowing.** If `since` is provided, identify which
   components were added or modified after the specified point.
   Restrict the audit to those components, but still check them
   against the full library for overlap and conflicts. If `since`
   is blank, audit all components.

4. **Focus selection.** If `focus_areas` is provided, execute only
   the specified passes. If blank, execute all three passes.

**Present the scoping results to the user and confirm before
proceeding.**

---

### Pass 1: Structural Consistency

This pass detects overlap, redundancy, conflicts, and metadata drift.
It is aligned with the methodology of the `audit-library-consistency`
template. If that template has already been run recently, the user may
skip this pass.

#### 1.1 Protocol Overlap Detection

Compare protocols for shared methodology:

1. For each protocol in scope, extract a one-sentence summary of each
   phase.
2. Compare protocols pairwise (or by cluster if the library is too
   large). Check for:
   - Phases that perform the same analysis with different wording
   - One protocol restating another's methodology instead of
     referencing it
   - Subset relationships (one protocol is a strict subset of another)
3. Finding types: **Duplicated Phase**, **Implicit Dependency**,
   **Subset Relationship**.

#### 1.2 Template Similarity Analysis

Compare template frontmatter and instructions for near-duplicates:

1. Check for templates with same persona + same format + overlapping
   protocols — candidates for parameterization.
2. Compare instruction sections of similar templates — could a single
   template with a domain parameter replace both?
3. Finding types: **Near-Duplicate**, **Composition Candidate**.

#### 1.3 Format Redundancy Check

Compare format document structures for overlap:

1. Check for formats sharing >50% of section structure.
2. Check for superset relationships.
3. Finding types: **Superset Format**, **Shared Structure**.

#### 1.4 Terminology Consistency

Scan all components for inconsistent terminology:

1. Epistemic labels (canonical categories: KNOWN / INFERRED / ASSUMED;
   assumed claims must be explicitly flagged with [ASSUMPTION]).
2. Domain terms: "findings" vs. "issues" vs. "defects" and similar.
3. Format field names across templates sharing a format.
4. Finding type: **Terminology Drift**.

#### 1.5 Cross-Reference Integrity

Verify all inter-component references:

1. Protocol `applicable_to` ↔ template `protocols` bidirectionality,
   with these exceptions: treat `applicable_to: all` as intentionally
   global (do not require explicit per-template back-references), and
   treat `applicable_to: []` as intentionally standalone/optional (do
   not flag it solely for having no template references).
2. Template references to non-existent components.
3. Pipeline stage artifact type chaining.
4. Finding type: **Stale Reference**.

#### 1.6 Missed Reuse Opportunities

Identify components that handle one case but could generalize:

1. Domain-specific components that could be domain-agnostic with a
   parameter.
2. Templates locked to a persona that could use `configurable`.
3. Finding type: **Parameterization Opportunity**.

**Present Pass 1 findings to the user before proceeding to Pass 2.**

---

### Pass 2: Corpus Safety

**Apply the corpus-safety-audit protocol** (all four phases).

This pass is particularly important after running `decompose-prompt`
workflows that assimilate external prompts into the library.

1. Execute Phase 1 (Provenance Scan) — build the provenance inventory.
2. Execute Phase 2 (Verbatim Content Detection) — check for copied text.
3. Execute Phase 3 (Confidentiality Screen) — scan for internal content.
4. Execute Phase 4 (License Compliance) — verify attribution and
   permissions.

Additionally, enforce the user-provided `corpus_safety_policy`:
- Verify every policy rule against every component in scope.
- Flag any policy rule that cannot be verified (e.g., "license was
  granted verbally") as **Unverifiable**, with a recommendation to
  obtain written confirmation.

**Present Pass 2 findings to the user before proceeding to Pass 3.**

---

### Pass 3: Runtime Fitness Assessment

This pass identifies high-token-cost, low-yield components and
recommends consolidation or demotion. It adapts the token-efficiency
concepts from the `session-profiling` protocol to static component
analysis.

#### 3.1 Token Cost Estimation

For each component in scope:

1. Estimate the token count (character count ÷ 4 for prose; note
   that tables, code blocks, and YAML may differ).
2. Record which templates reference this component (from the manifest).
   A component referenced by many templates has high aggregate cost.
3. Compute a **cost-per-use estimate**: component token count ×
   number of referencing templates.

#### 3.2 Content Density Analysis

For each component, assess the ratio of actionable content to
structural overhead:

1. **Actionable content**: Specific checks, rules, patterns, examples,
   and phase instructions that directly drive LLM behavior.
2. **Structural overhead**: Section headings, boilerplate preambles,
   introductory paragraphs, and repeated context that could be
   inferred from the component type.
3. **Redundant content**: Instructions that restate what a guardrail
   protocol already enforces (e.g., a protocol that repeats
   anti-hallucination rules).

Classify each component's density as: **Dense** (>80% actionable),
**Normal** (50–80%), **Bloated** (<50%).

#### 3.3 Yield Assessment

For each component, assess its contribution to output quality:

1. Does this component add unique analysis methodology not covered
   by other composed components?
2. Could the component's essential content be expressed in fewer
   tokens without losing actionable specificity?
3. Is the component's level of detail appropriate for its type?
   (Protocols should be detailed; personas should be thin.)

#### 3.4 Optimization Recommendations

For each component classified as Bloated or with low yield:

1. **Consolidate**: Merge with a related component to eliminate
   redundancy. Specify which components to merge and what the
   merged result would cover.
2. **Compress**: Reword to reduce token count while preserving all
   actionable checks. Estimate savings.
3. **Demote to template body**: Move content from a standalone
   component into a specific template's instructions — appropriate
   when the content is only used by one template.
4. **Scope-narrow**: Restrict the component's scope to reduce
   overlap with other components.

Classify each recommendation as:
- **Safe optimization**: Reduces tokens with no quality risk.
- **Tradeoff optimization**: Reduces tokens but may affect output
  quality — flag clearly with the risk.

**Present Pass 3 findings to the user.**

---

### Synthesis: Unified Report

After all passes are complete (or the subset selected by
`focus_areas`), produce a single unified investigation report.

1. **Merge findings** from all passes into one report, grouped by
   category:
   - Overlap / Redundancy (from Pass 1)
   - Conflicts (from Pass 1)
   - Metadata Drift (from Pass 1)
   - Corpus Safety (from Pass 2)
   - Runtime Fitness / Bloat (from Pass 3)

2. **Deduplicate.** If a component appears in findings from multiple
   passes, consolidate into a single finding with cross-references.

3. **Prioritize.** Order findings by severity, then by estimated
   impact (token savings for bloat, risk level for safety).

4. **Generate remediation plan.** For each finding, produce a
   PR-ready recommendation:
   - Specific action: merge / split / rename / compress / demote /
     scope-narrow / add-provenance / add-license-note / remove
   - Files affected
   - Estimated effort (S / M / L)
   - Risk assessment

## Output Format

Format the output using the `investigation-report` format. Follow that
format verbatim, including all required sections 1–9 in exact order.
Use severity values: **Critical / High / Medium / Low / Informational**.

Severity guidance for this audit:

- **Critical**: Confidentiality leak, license violation, or active
  conflict that causes contradictory assembled prompts
- **High**: Verbatim copying without permission, missing provenance
  for externally-derived content, or redundancy wasting significant
  tokens
- **Medium**: Inconsistency that could confuse users, bloated
  components, or incomplete attribution
- **Low**: Minor terminology drift, stale references, or minor
  compression opportunities
- **Informational**: Observations, parameterization opportunities,
  or suggestions with no current problem

Finding IDs in the unified audit report must use the
`investigation-report` format: `F-001`, `F-002`, `F-003`, …

Do **not** encode category, pass, or subtype information into the
finding ID. Instead, record that information in the required
**Category** field and, when useful, in the finding title.

Use the **Category** field to classify findings as one of:
- `Overlap / Redundancy`
- `Conflicts`
- `Metadata Drift`
- `Corpus Safety`
- `Runtime Fitness / Bloat`

You may still group findings by these categories in the report body,
but each individual finding heading must retain the `F-<NNN>` form.

Corpus-safety traceability rule:
- During **Pass 2** presentation, use a pass-scoped intermediate ID
  for each `corpus-safety-audit` finding in the form
  `CS-<PHASE>-<NNN>` (for example, `CS-PROV-001`) for internal
  tracking and Pass 2 references.
- During **final synthesis** into this unified audit report, assign a
  new sequential finding ID in `F-<NNN>` format. Reserve `F-<NNN>`
  exclusively for the final unified report; do not reuse Pass 2 IDs
  in that namespace.
- Preserve the original Pass 2 ID and phase only as traceability
  metadata in the title or evidence (e.g., `Category: Corpus Safety`;
  note: `Original Pass 2 ID: CS-PROV-001`).

## Non-Goals

- Do NOT modify any component files — this is an audit, not a
  refactoring task. Produce recommendations only.
- Do NOT evaluate whether components produce good LLM output — this
  is structural, safety, and efficiency analysis of the library itself.
- Do NOT propose removing components that serve distinct use cases
  just because they share some structure — only propose merging when
  components are genuinely redundant.
- Do NOT fabricate provenance information. If a component's origin
  is unknown, classify it as Unknown — do not guess.
- Do NOT attempt to verify licenses by accessing external URLs or
  contacting authors. Flag unverifiable claims for human follow-up.

## Quality Checklist

Before finalizing, verify:

- [ ] All components in scope were analyzed (document any exclusions)
- [ ] Pass 1: Protocols compared pairwise or by cluster with coverage
      documented
- [ ] Pass 1: Every template's frontmatter analyzed for similarity
- [ ] Pass 1: Cross-references verified bidirectionally
- [ ] Pass 2: Every component checked for provenance signals
- [ ] Pass 2: Verbatim content detection applied to all externally-
      derived or suspected-external components
- [ ] Pass 2: Confidentiality screen completed
- [ ] Pass 2: License compliance checked for all attributed components
- [ ] Pass 2: User-provided corpus_safety_policy fully enforced
- [ ] Pass 3: Token cost estimated for every component in scope
- [ ] Pass 3: Content density classified for every component
- [ ] Pass 3: Every optimization recommendation classified as safe
      or tradeoff
- [ ] Every finding has a concrete, PR-ready remediation action
- [ ] No component content was fabricated — all evidence cites actual
      files
- [ ] Findings are ordered by severity within each category
- [ ] The executive summary is understandable without reading the
      full report
