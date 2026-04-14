<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: pr-comment-responses
type: format
description: >
  Output format for responding to pull request review comments.
  Structures per-thread analysis, contradiction detection, and
  response generation in either document or action mode.
produces: pr-comment-responses
---

# Format: PR Comment Responses

The output MUST be a structured response plan for pull request review
threads. The format adapts based on `output_mode`:

- **Document mode**: produce the full report below.
- **Action mode**: use the same section structure below as an analysis
  and planning artifact, rather than a prose report.

## Output Structure

### 1. Thread Summary

Summarize all review threads by state:

| State | Count | Description |
|-------|-------|-------------|
| **Pending** | N | Active threads requiring response |
| **Outdated** | N | Threads on code that has since changed |
| **Resolved** | N | Already resolved — skipped unless user requests |

- **Total threads**: count
- **Actionable threads**: count (pending only, unless user overrides)
- **Skipped threads**: count and reason (resolved, outdated)

### 2. Contradiction Report

Identify conflicting feedback across different reviewers on the same
code area or design decision. For each contradiction:

```markdown
#### Contradiction C-<NNN>: <Short Description>

- **Reviewer A** (@handle): <position summary> — <thread reference>
- **Reviewer B** (@handle): <position summary> — <thread reference>
- **Conflict**: <what specifically conflicts>
- **Resolution Options / Tradeoffs**: <neutral summary of the
  available options, tradeoffs, and implications>
- **Decision Needed**: <what the user/team needs to decide or clarify
  before proceeding>
```

If no contradictions are detected, state: "None identified."

### 3. Per-Thread Responses

For each actionable thread, in file order:

```markdown
#### Thread T-<NNN>: <File>:<Line> — <Short Description>

- **Reviewer**: @handle
- **Thread State**: Pending / Outdated
- **Comment Summary**: <1–2 sentence summary of the reviewer's point>
- **Response Type**: Fix / Explain / Both
- **Analysis**: <why this feedback is valid/invalid, what it implies>
- **Response**:
  - *(If Fix)*: <specific code change with before/after>
  - *(If Explain)*: <draft reply explaining the design decision>
  - *(If Both)*: <code change + explanation>
- **Linked Contradiction**: C-<NNN> (if part of a detected contradiction)
```

### 4. Action Summary

| Category | Count | Details |
|----------|-------|---------|
| **Code fixes applied** | N | Threads where code was changed |
| **Explanations provided** | N | Threads answered with rationale |
| **Skipped (resolved)** | N | Already resolved threads |
| **Skipped (outdated)** | N | Threads on changed code |
| **Needs discussion** | N | Contradictions or ambiguous feedback |

- **Files modified**: list of files changed by fixes
- **Commits**: list of commits created (action mode only)
- **Unresolved items**: threads that need human judgment

## Formatting Rules

- Threads MUST be ordered by file path, then by line number within
  each file.
- Every actionable thread MUST have a response — do not skip threads
  without stating why.
- Code fixes MUST show before/after snippets with enough context
  (at least 3 lines) to verify correctness.
- If a section has no content, state "None identified" — never omit
  sections.
- In action mode, present the full analysis to the user and obtain
  explicit confirmation before executing any mutation (code change,
  comment post, thread resolution).

## Response Type

- `response_type` MUST be one of: **Fix**, **Explain**, or **Both**.
- If a per-thread override is shown, it MUST use one of the same values.
