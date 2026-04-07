<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: session-handoff
type: reasoning
description: >
  Structured handoff between AI agent sessions. Captures
  accomplishments, current state with metrics, remaining work
  categorized by type and difficulty, prioritized plan for the
  next session, key files, and stashed work. Prevents context
  loss and duplicate investigation across session boundaries.
applicable_to:
  - author-session-handoff
---

# Protocol: Session Handoff

Apply this protocol when an agent session is ending (context window
approaching capacity, rate limit reached, task paused, or user
requesting a stopping point) and work will continue in a future
session. The goal is to produce a handoff document that eliminates
re-investigation by the next session.

## Phase 1: Capture Accomplishments

1. **List every completed action** in this session, numbered and
   specific. Each item must include:
   - What was done (the action, not the intent)
   - Where it was done (file paths, function names, line ranges)
   - The observable result (test count change, error count change,
     build status change)

2. **Distinguish between committed and uncommitted work**:
   - Committed: cite the commit SHA or branch name.
   - Uncommitted: state whether changes are staged, unstaged, or
     stashed. If stashed, include the stash message and any
     caveats about applying it.

3. **Do NOT list actions that were attempted and abandoned** in the
   accomplishments section. Those belong in Phase 3 (Remaining
   Work) as context for what NOT to retry.

## Phase 2: Record Current State

Capture the quantitative state of the project at session end:

1. **Build status**: does it build? Zero errors? Zero warnings?
   If warnings exist, state the count and classify each as
   pre-existing, new, or unknown. Use unknown if you do not
   have a reliable baseline. If you classify warnings as
   pre-existing or new, state the evidence used (e.g., prior CI
   logs, earlier handoff notes, git diff, or a before/after
   build comparison).

2. **Test status**: how many tests pass / fail / skip? If any
   tests fail, list the failing test names and classify each as
   **regression**, **pre-existing failure**, or **unknown**.
   Use unknown unless there is explicit evidence for another
   classification (e.g., an earlier CI run, a known-conditions
   registry, or a prior handoff showing the failure already
   existed or was newly introduced in this session).

3. **Task-specific metrics**: any metrics relevant to the task
   being worked on. Examples:
   - "98% body match, 1123/1144 matched, 18 diffs remain"
   - "3 of 5 requirements implemented, 2 remaining"
   - "Performance: 240ms → 180ms (target: 150ms)"

4. **Record metrics as exact numbers, not qualitative assessments**.
   "Most tests pass" is not a valid state record. "247/250 tests
   pass, 3 fail (test_auth_timeout, test_retry_limit,
   test_concurrent_write)" is.

## Phase 3: Categorize Remaining Work

For each remaining task or unresolved issue:

1. **Assign a category**:
   - **Blocked**: cannot proceed without external input, missing
     dependency, or unresolved design decision. State what unblocks it.
   - **Ready**: fully understood, can be started immediately by the
     next session. Include enough detail to start without re-investigation.
   - **Needs investigation**: root cause unknown or approach unclear.
     Document what was already tried and ruled out.

2. **For each item, include**:
   - A one-line summary
   - Root cause (if known) or current hypothesis
   - What was already attempted and why it did not work (prevents
     the next session from repeating failed approaches)
   - Estimated difficulty (S / M / L)

3. **Group items by category**, then order by priority within
   each category (most impactful first).

## Phase 4: Write the Next-Session Plan

Produce a prioritized, actionable plan for the next session:

1. **List 3–5 specific investigation or implementation steps**,
   ordered by priority. Each step must be concrete enough that the
   next session can execute it without asking "what did they mean?"

2. **For each step, specify**:
   - What to do (the specific action)
   - Which files to read first (paths, not descriptions)
   - What output to expect (how to know the step succeeded)
   - What to do if it fails (fallback approach)

3. **Include "read these files first" content in the `## Key Files`
   section** of the handoff document, listing the 3–7 files the next
   session should read before doing anything else, ordered by
   importance. For each file, state why it matters (e.g., "contains
   the failing parser — start here"). Do not create a separate
   section with a different heading.

## Phase 5: Format the Handoff Document

Produce the handoff document in this structure:

```markdown
# Session Handoff: <session-name>

**Date**: <ISO 8601 date>
**Agent/User**: <who performed this session>
**Branch**: <current branch name>
**Commit**: <latest commit SHA (HEAD)>
**Uncommitted changes**: <yes/no>

## Accomplishments

1. <specific action with file paths and observable result>
2. ...

## Current State

- **Build**: <pass/fail, warning count>
- **Tests**: <pass/fail/skip counts, failing test names>
- **Task metrics**: <task-specific quantitative state>

## Remaining Work

### Blocked
- <item>: blocked on <what unblocks it>

### Ready
- <item>: <one-line summary, root cause, estimated difficulty>

### Needs Investigation
- <item>: <hypothesis, what was tried, what to try next>

## Plan for Next Session

1. <step>: read <files>, do <action>, expect <result>
2. ...

## Key Files

1. `<path>` — <why this file matters>
2. ...

## Stashed / Uncommitted Work

- <stash description and caveats, or "None">
```
