<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: prompt-decomposition
type: reasoning
description: >
  Systematic reasoning protocol for decomposing an existing hand-written
  prompt into PromptKit's semantic layers. Extracts persona traits,
  protocols, taxonomies, format rules, and task instructions. Maps each
  segment to existing library components or marks it as novel.
applicable_to:
  - decompose-prompt
---

# Protocol: Prompt Decomposition

Apply this protocol when reverse-engineering a hand-written or bespoke
prompt into PromptKit's composable component model. Execute all phases
in order. Do NOT skip phases or generate component files until Phase 6.

## Phase 1: Prompt Ingestion

Read the source prompt end-to-end and build a structural map:

1. **Identify structural boundaries.** Mark every heading, numbered list,
   bullet block, rule declaration, persona statement, and freeform
   paragraph as a discrete segment. Assign each segment a sequential
   label (S1, S2, …).
2. **Extract metadata.** Note any explicit metadata: title, author,
   version, target audience, stated purpose, tool integrations, model
   constraints, temperature settings, or system-prompt markers.
3. **Identify scope declarations.** Find any "you are…", "your role is…",
   "do not…", or "always…" statements that establish behavioral scope.
4. **Produce a segment inventory.** List every segment with its label,
   first line (truncated to ~80 characters), and approximate word count.
   This inventory is the completeness checklist for later phases.

## Phase 2: Semantic Segmentation

Classify each segment from Phase 1 into exactly one of the following
PromptKit layer categories:

| Category | Definition | Signals |
|----------|-----------|---------|
| **Persona** | Identity, expertise, domain knowledge, tone, stance | "You are a…", "Your expertise includes…", domain declarations, tone directives |
| **Guardrail Protocol** | Cross-cutting behavioral constraint applicable to any task | "Never fabricate…", "Always cite sources…", epistemic rules, refusal-to-fabricate rules, scope boundaries |
| **Analysis Protocol** | Domain- or language-specific analysis methodology | Ordered checks for a specific technology (e.g., "check for buffer overflows"), tool-specific analysis steps |
| **Reasoning Protocol** | Systematic reasoning methodology reusable across domains | Numbered phases of analysis, hypothesis-evidence patterns, structured comparison methods |
| **Taxonomy** | Classification scheme with labeled categories | Named categories (H1, H2, …), severity levels, finding types with definitions |
| **Format** | Output structure rules (sections, ordering, templates) | "Your output must include…", section lists, formatting rules, "do not omit sections" |
| **Task Instructions** | Task-specific steps that belong in a template body | Step-by-step workflow, parameter references, specific deliverables |
| **Meta / Non-reusable** | Session configuration, one-off instructions, examples | Temperature settings, "respond in JSON", example exchanges, filler text |

For each segment, record:
- Segment label (S1, S2, …)
- Assigned category
- Confidence (High / Medium / Low)
- Rationale (one sentence explaining the classification)

**Disambiguation rules:**
- If a segment combines persona traits with protocol rules, split it.
  Extract the "you are…" portion as Persona and the "you must…" rules
  as Protocol.
- If a segment contains both format rules and task instructions,
  separate the structural rules (format) from the procedural steps
  (task instructions).
- If a segment could be either an analysis protocol or a reasoning
  protocol, ask: "Is this methodology specific to a particular
  technology or domain?" If yes → Analysis. If domain-agnostic →
  Reasoning.

## Phase 3: Library Matching

For each segment classified as Persona, Protocol, Taxonomy, or Format
in Phase 2:

1. **Search existing PromptKit components.** Compare the segment's
   semantic content against the library's components in `manifest.yaml`.
   Consider both name-level matches and content-level overlap.
2. **Score the match** using this scale:

   | Score | Definition |
   |-------|-----------|
   | **Exact Match** | An existing component covers ≥90% of the segment's semantic content. The bespoke prompt's version adds no meaningful new information. |
   | **Partial Match** | An existing component covers 40–89% of the segment's content. The bespoke prompt adds specific rules, checks, or knowledge not in the existing component. |
   | **Novel** | No existing component covers ≥40% of the segment's content. This represents new domain knowledge or methodology. |

3. **Record the mapping.** For each segment, note:
   - Match score (Exact / Partial / Novel)
   - Matched component name and path (if Exact or Partial)
   - Which specific content is covered vs. uncovered

## Phase 4: Improvement Detection

For every segment scored as **Partial Match** in Phase 3:

1. **Extract the delta.** Identify the specific rules, checks, examples,
   or knowledge that the bespoke prompt contains but the existing
   PromptKit component does not.
2. **Assess back-port value.** For each delta item, evaluate:
   - Is this genuinely useful, or is it redundant with other existing
     components?
   - Is it domain-general enough to belong in the existing component,
     or is it too narrow?
   - Would adding it conflict with the existing component's scope or
     composability?
3. **Classify each delta** as:
   - **Back-port candidate**: Valuable addition that fits the existing
     component's scope. Flag for a follow-up PR.
   - **Template-specific**: Useful in context but too narrow for the
     existing component. Include in the new template's body instead.
   - **Redundant**: Already covered by a different existing component
     or implicitly handled. Discard.
4. **Produce an improvement log.** List each back-port candidate with:
   the existing component it would enhance, the specific content to add,
   and why it improves the component.

## Phase 5: Novelty Assessment

For every segment scored as **Novel** in Phase 3:

1. **Assess reusability.** Ask: "Could another template besides
   `decompose-prompt` benefit from this component?" If the answer is
   no, reclassify the segment as **Task Instructions** — it will be
   included in the template's task instructions rather than generated
   as a standalone component. Record this decision in the
   decomposition report.
2. **Determine component type.** Based on the Phase 2 classification:
   - Persona segments → evaluate whether they represent a genuinely new
     domain expert, or whether they are persona *traits* that can be
     expressed as behavioral constraints in an existing persona.
   - Protocol segments → determine the category (guardrail, analysis,
     or reasoning) and verify the content has ordered, actionable phases.
   - Taxonomy segments → verify the categories are labeled, defined,
     and non-overlapping.
   - Format segments → verify the structure is content-agnostic (defines
     where content goes, not what it says).
3. **Check for composition conflicts.** Would the new component produce
   conflicting instructions when composed with existing protocols?
   Protocols must be independent and additive.
4. **Name the component.** Propose a kebab-case name following existing
   naming conventions. Check `manifest.yaml` for name collisions.

## Phase 6: Component Synthesis

For each novel component identified in Phase 5:

1. **Draft the component file.** Follow CONTRIBUTING.md conventions:
   - SPDX header, valid YAML frontmatter, complete body content.
   - Protocols must have numbered, ordered phases with specific checks.
   - Formats must define complete structure with "do not omit" rules.
   - Personas must be thin and composable.
2. **Assemble task instructions.** Collect all segments classified as
   "Task Instructions" in Phase 2, combine with the decomposition
   workflow logic, and draft the template body.
3. **Build the manifest update.** Produce the YAML fragment to add
   to `manifest.yaml` for each new component.
4. **Cross-check.** Verify:
   - Every novel segment from Phase 5 is represented in a component
     file or the template body.
   - No content was silently dropped during synthesis.
   - The template's protocol references match its `manifest.yaml` entry.

## Presentation

Present results to the user in two parts:

### Part A: Decomposition Report (console output)

```
## Decomposition Report: <source prompt name>

### Segment Inventory
| # | Category | Match | Existing Component | Notes |
|---|----------|-------|--------------------|-------|
| S1 | Persona | Exact | systems-engineer | — |
| S2 | Reasoning Protocol | Novel | — | New methodology for X |
| S3 | Guardrail Protocol | Partial | anti-hallucination | Adds rule about Y |
| … | … | … | … | … |

### Improvement Log
<list of back-port candidates with target component and proposed content>

### Novel Components
<list of new components to generate, with proposed names and types>
```

### Part B: PR-Ready Files

Generate using the `promptkit-pull-request` format.
