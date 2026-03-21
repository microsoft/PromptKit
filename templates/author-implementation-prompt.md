<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-implementation-prompt
description: >
  Produce a structured prompt that a coding agent (Copilot, Claude,
  Cursor) consumes to generate spec-compliant implementation code.
  The output is a prompt document, not code. Pairs with
  audit-code-compliance for a generate/verify loop.
persona: implementation-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: requirements-doc
params:
  project_name: "Name of the project or module being implemented"
  requirements_doc: "The requirements document content"
  design_doc: "The design document content (optional — omit if implementation is requirements-only)"
  language: "Target programming language — e.g., 'Rust', 'Python', 'C', 'TypeScript'"
  conventions: "Language and project conventions — e.g., 'use anyhow for errors, async/await, no unwrap in production code'"
  focus_areas: "Optional narrowing — e.g., 'authentication module only', 'REQ-AUTH-001 through REQ-AUTH-010' (default: all)"
  audience: "Who will consume this prompt — e.g., 'GitHub Copilot', 'Claude Code', 'development team'"
input_contract:
  type: requirements-document
  description: >
    A requirements document with numbered REQ-IDs and acceptance
    criteria. Optionally, a design document with architecture and
    component descriptions.
output_contract:
  type: requirements-document
  description: >
    A structured coding brief formatted as a requirements document
    that a coding agent consumes to generate spec-compliant
    implementation code. Includes REQ-ID traceability instructions
    and constraint enforcement guidance.
---

# Task: Author Implementation Prompt

You are tasked with producing a **structured prompt** that a coding
agent will consume to generate implementation code. The output is a
prompt document — you do NOT write code yourself.

## Inputs

**Project Name**: {{project_name}}

**Requirements Document**:
{{requirements_doc}}

**Design Document** (if provided):
{{design_doc}}

**Target Language**: {{language}}

**Conventions**: {{conventions}}

**Focus Areas**: {{focus_areas}}

**Audience**: {{audience}}

## Instructions

1. **Extract implementable requirements.** From the requirements
   document (and design document if provided), identify every
   requirement that translates to code. Group by module or functional
   area.

2. **For each requirement**, produce a coding instruction that includes:
   - The REQ-ID and requirement text
   - The acceptance criteria (what "done" looks like)
   - Constraints to enforce in code (performance, security, validation)
   - Error handling expectations (what happens on invalid input, failure)
   - A traceability instruction: "Include a comment referencing
     REQ-<ID> at the implementation site"

3. **Include language-specific guidance.** Using the target language
   and conventions provided:
   - Specify idiomatic patterns for the language
   - Specify error handling style (exceptions, Result types, error
     codes)
   - Specify naming conventions (snake_case, camelCase, etc.)
   - Specify module/file organization expectations

4. **Include constraint enforcement instructions.** For each
   constraint in the requirements:
   - Specify how to enforce it in code (assertion, validation,
     timeout, check)
   - Specify what to do when the constraint is violated (error,
     rejection, fallback)

5. **Include a "do NOT implement" section.** List behaviors that are
   explicitly out of scope — requirements not in the focus area,
   features not in the spec, optimizations not required. This prevents
   the coding agent from adding undocumented behavior (D9).

6. **Format the output** according to the requirements-doc format.
   The coding agent receives this as a structured specification:
   - Overview → what is being implemented and in what language
   - Requirements → the coding instructions grouped by category
   - Constraints → enforcement guidance
   - Non-Goals → what NOT to implement

7. **Quality checklist** — before finalizing, verify:
   - [ ] Every REQ-ID from the input requirements appears in the
         coding brief (or is documented as out of scope)
   - [ ] Every requirement includes its acceptance criteria
   - [ ] Every constraint has an enforcement instruction
   - [ ] Traceability instructions are included (REQ-ID in comments)
   - [ ] Language-specific conventions are specified
   - [ ] A "do NOT implement" section exists
   - [ ] The output is consumable by the target audience (coding agent)

## Non-Goals

- Do NOT write implementation code — produce the prompt only.
- Do NOT make design decisions not in the spec — if the design doc
  doesn't specify an approach, flag it as a decision the implementer
  must make.
- Do NOT include requirements outside the focus areas.
- Do NOT generate test code — that is the job of `author-test-prompt`.
