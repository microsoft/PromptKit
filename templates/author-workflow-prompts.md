<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-workflow-prompts
description: >
  Generate the prompt assets for a multi-agent coding workflow:
  a coder prompt, a reviewer prompt, a validator prompt, and an
  orchestrator description. Designed for external orchestrators —
  PromptKit produces the prompts, not the runtime.
persona: workflow-arbiter
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/workflow-arbitration
format: multi-artifact
params:
  project_name: "Name of the project or feature being implemented"
  requirements_doc: "The requirements document content"
  design_doc: "The design document content (optional — pass 'None' if not available)"
  validation_plan: "The validation plan content (optional — pass 'None' if not available)"
  language: "Target programming language — e.g., 'Rust', 'Python', 'C', 'TypeScript'"
  conventions: "Language and project conventions — e.g., 'use anyhow for errors, async/await, no unwrap'"
  max_iterations: "Maximum number of code/review/validate cycles before forced termination (default: 5)"
  severity_threshold: "Minimum severity for findings that block completion — e.g., 'Medium' means Low/Informational findings don't block (default: Medium)"
  audience: "Who will consume these prompts — e.g., 'GitHub Copilot agents', 'Claude Code', 'custom orchestrator'"
input_contract:
  type: requirements-document
  description: >
    A requirements document with numbered REQ-IDs and acceptance
    criteria. Optionally, a design document and validation plan.
output_contract:
  type: artifact-set
  description: >
    A set of four coordinated prompt documents: coder prompt, reviewer
    prompt, validator prompt, and orchestrator description. Each is
    self-contained and consumable by an external agent runtime.
---

# Task: Author Multi-Agent Workflow Prompts

You are tasked with generating **four coordinated prompt documents**
for a multi-agent coding workflow. An external orchestrator will run
these prompts — you produce the assets, not the runtime.

## Inputs

**Project Name**: {{project_name}}

**Requirements Document**:
{{requirements_doc}}

**Design Document** (if provided — ignore if "None"):
{{design_doc}}

**Validation Plan** (if provided — ignore if "None"):
{{validation_plan}}

**Target Language**: {{language}}

**Conventions**: {{conventions}}

**Max Iterations**: {{max_iterations}}

**Severity Threshold**: {{severity_threshold}}

**Audience**: {{audience}}

## The Workflow

The orchestrator runs these agents in a loop:

```
┌─→ 1. CODER: Implement/fix code per spec
│   2. REVIEWER: Audit code against spec
│   3. VALIDATOR: Evaluate findings, decide CONTINUE or DONE
│        │
│   CONTINUE ←──┘
│        │
└── DONE → Output final code + validator verdict + finding history
```

Each iteration, the coder receives the previous validator verdict
(if any) indicating what to fix. The reviewer sees the current code
and the spec. The validator sees the reviewer's findings, the coder's
changes, and the iteration history.

## Instructions

Generate four self-contained prompt documents with these filenames.
Separate each artifact with a heading `### Artifact N: <filename>` so
an external orchestrator can reliably extract them:

- `coder-prompt.md` — implementation brief for the coder agent
- `reviewer-prompt.md` — audit brief for the reviewer agent
- `validator-prompt.md` — arbitration brief for the validator agent
- `orchestrator.md` — workflow description for the runtime

### Artifact 1: coder-prompt.md

Produce a structured implementation brief for the coder agent:

1. **Include the full requirements** with REQ-IDs and acceptance
   criteria from the input requirements document.
2. **Include language and convention guidance** from the `language`
   and `conventions` params.
3. **Include traceability instructions**: The coder MUST reference
   REQ-IDs in code comments at implementation sites.
4. **Include iteration awareness**: The coder prompt must instruct
   the agent to read the validator's previous verdict (if any) and
   address the specific findings that remain OPEN (NOT ADDRESSED,
   PARTIALLY ADDRESSED, or REGRESSED).
5. **Include a "do NOT" section**: Do not add features not in the
   spec. Do not argue with reviewer findings — fix them or explain
   why the spec does not require the change.

### Artifact 2: reviewer-prompt.md

Produce a structured audit brief for the reviewer agent:

1. **Include the full requirements** — same spec as the coder.
2. **Instruct the reviewer to audit the code against the spec**,
   producing findings with:
   - REQ-ID reference (what requirement is violated or unimplemented)
   - Severity (Critical / High / Medium / Low / Informational)
   - Evidence (what the code does vs. what the spec requires)
   - Recommended fix
3. **Require spec-grounding**: Every finding MUST cite a specific
   REQ-ID. Findings without spec references are bikeshedding and
   will be dismissed by the validator.
4. **Require novelty**: The reviewer MUST NOT raise issues that were
   addressed in previous iterations. If the coder fixed an issue,
   it is resolved — do not re-raise it.
5. **Include a "do NOT" section**: Do not comment on style, naming,
   or formatting unless the spec requires it. Do not invent
   requirements.

### Artifact 3: validator-prompt.md

Produce a structured arbitration brief for the validator agent:

1. **Apply the workflow-arbitration protocol** — all four phases
   (finding validation, response evaluation, convergence analysis,
   verdict).
2. **Include termination conditions**:
   - DONE if all VALID findings are RESOLVED
   - DONE if remaining OPEN findings are strictly below
     {{severity_threshold}} (severity ordering: Critical > High >
     Medium > Low > Informational; e.g., threshold "Medium" means
     only Low and Informational findings may remain)
   - DONE if iteration count reaches {{max_iterations}}
   - DONE if livelock detected (convergence failure per Phase 3)
   - DONE if reviewer has no novel findings (only re-raising
     resolved issues)
3. **Include the classification scheme**:
   - Finding statuses: VALID, BIKESHEDDING, REPEATED (from Phase 1);
     RESOLVED, OPEN (after Phase 2 evaluation)
   - Response statuses: ADDRESSED, PARTIALLY ADDRESSED, REBUTTED,
     NOT ADDRESSED, REGRESSED
4. **Require a definitive verdict**: CONTINUE or DONE with reasoning.
5. **If CONTINUE**: Specify what the coder should focus on next.
6. **If DONE**: Summarize final status of all findings.

### Artifact 4: orchestrator.md

Produce a structured description of the workflow for the runtime:

1. **Execution order**: Coder → Reviewer → Validator → loop or exit
2. **Data flow**: What each agent receives as input and produces as
   output
3. **Iteration state**: What context carries forward between iterations
   (previous findings, previous verdicts, iteration count)
4. **Termination**: The conditions under which the loop exits
5. **Final output**: What the orchestrator produces when DONE
   (final code + final validator verdict + finding history)

## Quality Checklist

Before finalizing, verify:

- [ ] Output begins with a Deliverables manifest table listing all
      four artifacts with filenames (per multi-artifact format)
- [ ] All four artifacts are self-contained (each can be consumed
      independently by an agent)
- [ ] Each artifact is separated by a `### Artifact N: <filename>`
      heading
- [ ] All three agent prompts reference the same requirements document
- [ ] The coder prompt includes traceability instructions (REQ-IDs
      in comments)
- [ ] The reviewer prompt requires spec-grounded findings only
- [ ] The validator prompt includes all termination conditions
- [ ] The validator prompt includes livelock detection
- [ ] The orchestrator description specifies data flow between agents
- [ ] Max iterations ({{max_iterations}}) and severity threshold
      ({{severity_threshold}}) are embedded in the validator prompt
- [ ] No agent prompt encourages arguing — coder fixes or explains,
      reviewer cites spec, validator decides

## Non-Goals

- Do NOT implement the orchestrator runtime — produce the prompts only.
- Do NOT execute the workflow — produce the prompt assets for an
  external runtime to consume.
- Do NOT generate code — the coder agent generates code when it
  receives the coder prompt.
- Do NOT combine the four artifacts into a single undifferentiated
  prompt — they must be clearly separated within the multi-artifact
  response so the orchestrator can extract and feed each to the right
  agent independently.
