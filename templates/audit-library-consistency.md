<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: audit-library-consistency
mode: interactive
description: >
  Audit the PromptKit component library for overlap, redundancy,
  inconsistency, and consolidation opportunities. Analyzes protocols
  for shared phases, templates for near-duplicate composition,
  formats for structural similarity, and cross-references for
  integrity. Produces a consolidation report with actionable merge
  and refactoring proposals.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: investigation-report
params:
  manifest_content: "The full contents of manifest.yaml"
  component_files: "The full contents of all component files (personas, protocols, formats, templates) to analyze"
  focus_areas: "Optional — specific concern areas to prioritize (e.g., 'protocol overlap', 'format redundancy', 'terminology drift'). Default: all"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A consolidation report with findings classified using the
    finding types defined in this template's phases, with proposed
    merges and refactoring actions.
---

# Task: Audit Library Consistency

You are tasked with performing a **consolidation audit** of the
PromptKit component library. Your goal is to find overlap, redundancy,
inconsistency, and missed reuse opportunities — then propose concrete
consolidation actions.

## Inputs

**Manifest**:
{{manifest_content}}

**Component Files**:
{{component_files}}

**Focus Areas**: {{focus_areas}} (if blank or not provided, analyze all areas)

## Instructions

### Preliminary: Completeness Check

Before beginning the analysis phases, verify the provided input is
complete enough for a meaningful audit:

1. Compare the list of components in the manifest against the
   component files provided. Flag any components listed in the
   manifest but missing from the provided files.
2. If the provided library is incomplete (due to context limits or
   partial input), state which components are missing and restrict
   the audit to the components actually provided. Do NOT fabricate
   content for missing files.
3. If the library is too large to analyze exhaustively, prioritize:
   cluster components by persona and format first, then drill into
   suspicious overlaps rather than comparing every pair.

### Phase 1: Protocol Overlap Detection

Within the scope determined in the Preliminary step (entire library if
complete, otherwise within prioritized clusters), compare protocols for
shared methodology.

1. **Extract phase summaries**: For each protocol in scope, list its
   phases with a one-sentence description of what each phase does.

2. **Pairwise comparison**: For each pair of in-scope protocols (all
   pairs if feasible, otherwise the most similar pairs within each
   cluster), check:
   - Do any phases perform the same analysis with different wording?
   - Does one protocol's phase reference another protocol's
     methodology (e.g., "apply the invariant-extraction methodology")?
   - Do two protocols extract the same kind of information
     (invariants, state machines, constraints) from the same kind of
     input?

3. **Finding types**:
   - **Duplicated phase**: Two protocols contain phases that do the
     same thing. Propose extracting to a shared protocol or
     referencing one from the other.
   - **Implicit dependency**: One protocol's instructions restate
     another protocol's methodology instead of referencing it.
     Propose adding the dependency explicitly.
   - **Subset relationship**: One protocol is a strict subset of
     another. Propose merging or parameterizing.

### Phase 2: Template Similarity Analysis

Compare template frontmatter and instructions for near-duplicates.

1. **Frontmatter comparison**: For each pair of templates, check:
   - Same persona + same format + overlapping protocols → candidate
     for parameterization
   - Same protocols but different persona → may indicate the persona
     is the only differentiator, not the methodology

2. **Instruction comparison**: For templates that share persona +
   format, compare their instruction sections:
   - Are the instructions structurally identical with different
     domain vocabulary?
   - Could a single template with an `artifact_type` or `domain`
     parameter replace both?

3. **Finding types**:
   - **Near-duplicate**: Two templates differ only in 1–2 parameters.
     Propose merging with a parameter.
   - **Composition candidate**: Two templates share most protocols
     but each adds one unique protocol. Propose a shared base with
     optional protocol add-ons.

### Phase 3: Format Redundancy Check

Compare format document structures for overlap.

1. **Section comparison**: For each pair of formats, check:
   - Do they share more than 50% of their section structure?
   - Is one format a superset of another?
   - Could format-specific sections be optional additions to a
     shared base format?

2. **Finding types**:
   - **Superset format**: Format A contains all sections of Format B
     plus more. Format B may be replaceable by Format A with optional
     sections.
   - **Shared structure**: Two formats share a common core but diverge
     in specific sections. Propose a base format with extensions.

### Phase 4: Terminology Consistency

Scan all components for inconsistent terminology.

1. **Epistemic labels**: Check that all templates use the same
   labels for uncertainty ([KNOWN]/[INFERRED]/[ASSUMPTION] vs.
   [ASSUMPTION] vs. other variants).

2. **Audience terms**: Check for "implementors" vs. "implementers",
   "findings" vs. "issues" vs. "defects", and similar variations.

3. **Format field names**: Check that templates referencing the same
   format use consistent field names (e.g., Severity, Category,
   Location — not ad-hoc alternatives).

4. **Finding type**: **Terminology drift** — same concept, different
   words across components. Propose standardizing on one term.

### Phase 5: Cross-Reference Integrity

Verify all inter-component references are valid and bidirectional.

1. **Protocol `applicable_to`**: For protocols that list specific
   templates, does every template named in `applicable_to` actually
   use that protocol, and does every template that uses a protocol
   appear in its `applicable_to` list? For protocols with
   `applicable_to: all` or `applicable_to: []`, skip bidirectional
   enforcement — `all` covers every template, and `[]` indicates no
   specific templates are listed yet.

2. **Template references to non-existent components**: Do any
   template instructions reference templates, protocols, or formats
   that don't exist in the manifest?

3. **Pipeline integrity**: Do pipeline stages reference valid
   templates? Do artifact types produced by one stage match the
   consumed types of the next?

4. **Finding type**: **Stale reference** — a cross-reference points
   to a component that doesn't exist, has been renamed, or is not
   in the manifest.

### Phase 6: Parameterization Opportunities

Identify components that handle one case but could handle N cases
with a parameter.

1. **Artifact-type generalization**: Are there components that are
   domain-specific but could be domain-agnostic with an `artifact_type`
   or `domain` parameter? (Example: `reconstruct-behavior` already
   does this for code/schematic/config/capture.)

2. **Persona configurability**: Are there templates locked to a
   specific persona that could use `persona: configurable`? (Example:
   `audit-spec-invariants` already does this.)

3. **Finding type**: **Parameterization opportunity** — a component
   handles one case but the methodology generalizes.

## Output Format

Format the output using the `investigation-report` format. Follow that
format verbatim, including all required sections 1–9 in exact order.
Use severity values: **Critical / High / Medium / Low / Informational**.

Severity guidance for this audit:

- **Critical**: Active conflict or duplication that causes contradictory
  assembled prompts
- **High**: Redundancy that wastes significant tokens or maintenance
  effort
- **Medium**: Inconsistency that could confuse users but doesn't
  affect assembled prompt quality
- **Low**: Minor terminology drift or stale reference
- **Informational**: Observation or opportunity, no current problem

## Non-Goals

- Do NOT modify any component files — this is an audit, not a
  refactoring task
- Do NOT evaluate whether the components produce good LLM output —
  this is structural and semantic analysis of the library itself
- Do NOT propose removing components that serve distinct use cases
  just because they share some structure — only propose merging when
  the components are genuinely redundant

## Quality Checklist

Before finalizing, verify:

- [ ] Protocols in scope were compared pairwise or by cluster, with
      coverage documented (Phase 1)
- [ ] Every template's frontmatter was analyzed (Phase 2)
- [ ] Every format's section structure was compared (Phase 3)
- [ ] Terminology was scanned across all components (Phase 4)
- [ ] All `applicable_to` and template references were verified (Phase 5)
- [ ] Parameterization opportunities were assessed (Phase 6)
- [ ] Every finding has a concrete remediation proposal
- [ ] No component was fabricated — all references cite actual files
