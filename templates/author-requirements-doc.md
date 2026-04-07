<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-requirements-doc
description: >
  Generate a structured requirements document from a natural language
  description of a feature or project.
persona: software-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/requirements-elicitation
format: requirements-doc
params:
  project_name: "Name of the project or feature"
  description: "Natural language description of what needs to be built"
  context: "Additional context — existing system, constraints, stakeholders"
  audience: "Who will read the output — e.g., 'expert engineers', 'project stakeholders'"
input_contract: null
output_contract:
  type: requirements-document
  description: >
    A structured requirements document with numbered REQ-IDs,
    acceptance criteria, and traceability.
---

# Task: Author Requirements Document

You are tasked with producing a **requirements document** for the following
project or feature.

## Inputs

**Project Name**: {{project_name}}

**Description**:
{{description}}

**Additional Context**:
{{context}}

## Instructions

1. **Apply the requirements-elicitation protocol** to extract, decompose,
   and validate requirements from the provided description.

2. **Apply the anti-hallucination protocol** throughout. Every requirement
   MUST be grounded in the provided description or explicitly flagged as
   an assumption. Do NOT invent requirements that are not supported by
   the input.

3. **Format the output** according to the requirements-doc format specification.

4. **Before writing requirements**, identify and list:
   - Ambiguities in the description that need clarification
   - Implicit requirements that are not stated but likely intended
   - Actual or possible conflicts (requirements that contradict each
     other or cannot both be satisfied simultaneously)

   Present these as a preliminary section titled "Pre-Authoring Analysis"
   before the requirements document itself.

5. **Quality checklist** — before finalizing, verify:
   - [ ] Every requirement has a unique REQ-ID
   - [ ] Every requirement uses RFC 2119 keywords correctly
   - [ ] Every requirement has at least one acceptance criterion
   - [ ] Every requirement is atomic (one testable behavior)
   - [ ] No vague adjectives remain ("fast," "secure," "scalable")
   - [ ] Out-of-scope section is populated
   - [ ] Assumptions are explicitly listed
   - [ ] No fabricated details — all unknowns marked with [UNKNOWN]

## Non-Goals

- Do NOT produce a design document — focus on requirements only.
- Do NOT specify implementation approach or technology choices.
- Do NOT generate test cases — those belong in a validation plan.
- Do NOT resolve ambiguities silently — flag them in the
  Pre-Authoring Analysis section for stakeholder review.
