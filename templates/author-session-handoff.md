<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-session-handoff
mode: interactive
description: >
  Generate a structured session handoff document capturing
  accomplishments, current state, remaining work, and a
  prioritized plan for the next session. Prevents context
  loss across agent session boundaries.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/session-handoff
format: null
params:
  session_context: "Description of the task being worked on, the project, and any relevant context"
  session_work: "What was done in this session — commits, changes, investigations, decisions"
  remaining_items: "Known remaining tasks, blockers, or unresolved issues"
input_contract: null
output_contract:
  type: session-handoff-document
  description: >
    A structured handoff document with accomplishments, quantitative
    state, categorized remaining work, prioritized next-session plan,
    key files list, and stashed work notes.
---

# Task: Author Session Handoff

You are tasked with generating a structured session handoff document.
This document will be consumed by a future agent session (or a human)
to continue work without re-investigation.

## Inputs

**Session Context**:
{{session_context}}

**Session Work**:
{{session_work}}

**Remaining Items**:
{{remaining_items}}

## Instructions

### Step 1: Gather State

1. If you have access to the repository, run:
   - `git --no-pager log --oneline -10` to capture recent commits
   - `git --no-pager status` to capture uncommitted changes
   - `git stash list` to capture any stashed work
   - The project's build command to capture build status
   - The project's test command to capture test status

2. If you do not have repository access, extract state from the
   provided `session_work` and `remaining_items` inputs.

3. Record all metrics as exact numbers. Do NOT use qualitative
   assessments ("most tests pass") — use quantitative state
   ("247/250 tests pass").

### Step 2: Apply the Session Handoff Protocol

Execute all 5 phases of the `session-handoff` protocol:

1. **Phase 1**: Capture accomplishments — list every completed
   action with file paths and observable results.
2. **Phase 2**: Record current state — build, tests, task metrics.
3. **Phase 3**: Categorize remaining work — blocked, ready, needs
   investigation. Include what was already tried.
4. **Phase 4**: Write the next-session plan — 3–5 prioritized
   steps with files to read and expected outcomes.
5. **Phase 5**: Format the handoff document using the protocol's
   output template.

### Step 3: Write the Handoff File

Write the handoff document to `.handoff/<session-name>.md` in the
repository root. If the `.handoff/` directory does not exist, create
it.

The session name should be derived from the task (e.g.,
`fix-parser-precedence`, `implement-auth-module`), not from a
timestamp or generic label.

### Step 4: Present for Review

Present the handoff document to the user for review. Ask:
- Is anything missing from the accomplishments?
- Are the remaining work categories correct?
- Is the next-session plan the right priority order?

Make adjustments based on feedback before finalizing.

## Non-Goals

- Do NOT continue working on the task — this template generates
  a handoff document, not task output.
- Do NOT speculate about solutions to remaining items. Document
  what is known and what was tried, not what might work.
- Do NOT include full file contents in the handoff. Reference
  files by path; the next session will read them.

## Quality Checklist

Before finalizing, verify:

- [ ] Every accomplishment cites specific files and observable results
- [ ] Current state uses exact numbers (not "most" or "almost")
- [ ] Remaining work items include what was already tried
- [ ] No remaining item is categorized as "Ready" if the approach
      is unclear (use "Needs Investigation" instead)
- [ ] Next-session plan has 3–5 concrete steps with file paths
- [ ] Key files list has 3–7 entries with reasons
- [ ] Stashed/uncommitted work section is present (even if "None")
- [ ] The handoff document follows the protocol's output template
