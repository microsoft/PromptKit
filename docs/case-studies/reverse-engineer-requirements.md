<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

# Case Study: Extending PromptKit to Reverse-Engineer Requirements

This document walks through a real session using the `extend-library`
template to add new components to PromptKit. It demonstrates the
interactive design workflow and the reasoning behind each decision.

## The Problem

A user needed to port a C library (a preprocessor-based TraceLog API)
to Rust. The workflow they envisioned:

1. Read the C headers and extract structured requirements
2. Generate a design document from those requirements
3. Generate a validation plan
4. Implement the Rust crate based on the design

Steps 2–4 were already supported by PromptKit's existing
`document-lifecycle` pipeline (`author-design-doc` →
`author-validation-plan`). But step 1 — reverse-engineering
requirements from existing code — had no template.

## Design Session

### Phase 1: Scoping — What's Missing?

The first question was whether this needed a new pipeline or just
new components. Analysis of the existing `document-lifecycle` pipeline
revealed:

| Pipeline Stage | Template | Status |
|---|---|---|
| 1. Requirements | `author-requirements-doc` | ❌ Expects natural language, not code |
| 2. Design | `author-design-doc` | ✅ Consumes `requirements-document` |
| 3. Validation | `author-validation-plan` | ✅ Consumes `requirements-document` |

**Key insight**: No new pipeline needed. If we create a template that
*also* produces a `requirements-document` artifact, stages 2–3 work
unchanged. The artifact type is the contract — not the template name.

### Phase 2: Component Decomposition

The next question was what *kind* of components to add. The user
provided a critical architectural insight:

> "The code analysis stuff can probably be shared with things like
> code review. They are basically the same task — to extract meaning
> from existing code and understand it. The protocol should be to take
> the meaning extracted from code and turn it into requirements."

This separated the concern into two layers:

1. **Code comprehension** — a persona capability (reading unfamiliar
   codebases, understanding macros, tracing types). This is similar
   to what `review-code` does with the `systems-engineer` persona.
2. **Requirements derivation** — a reasoning methodology for
   transforming code understanding into structured requirements.
   This is a new reasoning protocol.

#### Components Decided

| Component | Type | Why New? |
|---|---|---|
| `reverse-engineer` | Persona | Existing personas are forward-looking (design/build). Reverse engineering requires different expertise: reading implementations, separating essential from incidental behavior. |
| `requirements-from-implementation` | Protocol (reasoning) | No existing protocol covers the reasoning from "I understand this code" → "here are the requirements." The `requirements-elicitation` protocol works from natural language, not code. |
| `reverse-engineer-requirements` | Template | Orchestrates the new persona + protocol with the existing `requirements-doc` format. |

#### Components Reused

| Component | Type | Why Reusable? |
|---|---|---|
| `requirements-doc` | Format | Same output structure — REQ-IDs, acceptance criteria, traceability. |
| `anti-hallucination` | Protocol (guardrail) | Every requirement must cite source code evidence. |
| `self-verification` | Protocol (guardrail) | Quality gate before finalizing. |
| `operational-constraints` | Protocol (guardrail) | Systematic codebase reading strategy. |
| `document-lifecycle` | Pipeline | Stages 2–3 consume `requirements-document` regardless of how it was produced. |

#### Components NOT Added

- **No new format** — `requirements-doc` works because the output is
  the same artifact type regardless of whether requirements came from
  natural language or code.
- **No new taxonomy** — standard requirement categorization (REQ-IDs
  with category tags) is sufficient.
- **No new pipeline** — the existing pipeline's artifact contracts
  handle composition without modification.

### Phase 3: Design Decisions Worth Noting

**Essential vs. Incidental classification**: The protocol includes a
phase (Phase 3) specifically for classifying observed behaviors as
essential or incidental. This is the hardest part of reverse
engineering — the implementation does many things, but not all of them
are API guarantees. The two-test heuristic helps:

1. "If this behavior changed, would existing correct callers break?"
2. "Could a correct reimplementation reasonably behave differently?"

**Semantic fidelity over correctness**: The template explicitly
instructs the LLM to document what the code *does*, even if it appears
buggy. If a bug is established behavior, it becomes a requirement
flagged with `[REVIEW]`. This prevents the LLM from "helpfully"
fixing bugs during requirements extraction.

**Source traceability**: Every requirement must cite specific code
evidence. This goes beyond the standard `requirements-doc` format by
adding a "Source Traceability" subsection mapping REQ-IDs to file
locations.

## Result

Three new files were added to PromptKit:

```
personas/reverse-engineer.md           — New persona
protocols/reasoning/requirements-from-implementation.md  — New reasoning protocol
templates/reverse-engineer-requirements.md               — New template
```

Plus updates to `manifest.yaml` to register all three components.

The user's original workflow now works by chaining:
1. `reverse-engineer-requirements` → produces `requirements-document`
2. `author-design-doc` → consumes `requirements-document`
3. `author-validation-plan` → consumes `requirements-document`

Each step uses a different prompt assembled from PromptKit's components,
but the pipeline flows through the shared `requirements-document`
artifact contract.

## Takeaways

1. **Check existing pipelines before creating new ones.** Artifact type
   contracts enable composition without explicit pipeline definitions.
2. **Separate comprehension from reasoning.** Code analysis is a persona
   capability; transforming understanding into a specific output format
   is a protocol concern. This keeps both reusable.
3. **Reuse formats aggressively.** The same `requirements-doc` format
   works whether requirements come from stakeholder interviews or
   code analysis — the structure is output-defined, not input-defined.
4. **The `extend-library` workflow catches architectural issues early.**
   The interactive design phase prevented over-engineering (no
   unnecessary pipeline) and under-engineering (the essential vs.
   incidental classification phase was added during design challenge).
