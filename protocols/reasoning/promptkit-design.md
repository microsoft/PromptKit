<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: promptkit-design
type: reasoning
description: >
  Reasoning protocol for designing new PromptKit components. Walks through
  scoping, component type selection, dependency analysis, and
  convention compliance before generating any files.
applicable_to:
  - extend-library
---

# Protocol: PromptKit Component Design

Apply this protocol when designing a new component for
PromptKit. Execute all phases before generating files.

## Phase 1: Use Case Analysis

1. **What task does the user want to support?**
   - Get a concrete description with specific inputs and outputs.
   - Reject vague descriptions ("a prompt for DevOps") — push for
     specifics ("a prompt that triages open GitHub issues and
     produces a prioritized action list").

2. **Does the library already cover this?**
   - Check existing templates — could an existing template handle
     this with different parameters?
   - Check existing protocols — does the reasoning methodology
     already exist?
   - If partially covered, determine what's missing.

3. **Who is the target user?**
   - What expertise do they have?
   - What context will they provide (code, repo URL, logs, etc.)?
   - What will they do with the output?

## Phase 2: Component Decomposition

Determine which new components are needed:

1. **Template** (almost always needed):
   - What are the input parameters?
   - What is the input contract (does it consume an artifact from
     another template)?
   - What is the output contract (what artifact does it produce)?
   - Does it fit into an existing pipeline or start a new one?

2. **Persona** (needed when existing personas lack the domain expertise):
   - Does `systems-engineer`, `security-auditor`, or `software-architect`
     cover the required expertise?
   - If not, what domain knowledge does the new persona need?
   - Keep it thin — expertise and behavioral constraints only.

3. **Protocol** (needed when the task requires a systematic methodology
   not covered by existing protocols):
   - What are the ordered phases of analysis or reasoning?
   - Are the steps specific enough to be actionable?
   - Is this methodology reusable across multiple templates?

4. **Format** (needed when the output structure is novel):
   - Does an existing format (requirements-doc, design-doc,
     investigation-report, validation-plan, multi-artifact) work?
   - If not, what sections and formatting rules does the new
     format need?

5. **Taxonomy** (needed when findings require domain-specific labels):
   - Does the task produce classified findings?
   - Are existing severity levels (Critical/High/Medium/Low) sufficient,
     or does the domain need custom labels?

## Phase 3: Convention Compliance Check

Before generating files, verify the design against CONTRIBUTING.md:

1. **Naming**: kebab-case file names matching the component `name` field.
2. **Frontmatter**: all required fields for the component type.
3. **SPDX headers**: MIT license, PromptKit Contributors.
4. **Cross-references**: protocols referenced by path in template
   frontmatter, formats by name.
5. **Manifest update**: every new component must be added to
   `manifest.yaml`.

## Phase 4: Dependency Review

1. Will the new template compose correctly with its referenced
   persona, protocols, and format?
2. Do any existing templates benefit from the new protocol or
   format? If so, note this as a follow-up improvement.
3. Does the new component conflict with or duplicate any existing
   component?
