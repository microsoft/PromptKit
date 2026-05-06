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

Summarize all review threads by state, using the **source platform's
native status vocabulary**. Do not normalize statuses across platforms.

**GitHub** review threads expose two boolean flags — `isResolved` and
`isOutdated` — and have no single API status field. This format
groups them into three workflow classification labels (the labels
below are template names, not GitHub API literals):

| Label | Count | Description |
|-------|-------|-------------|
| `open` | N | Unresolved threads requiring response (`isResolved: false`, `isOutdated: false`) |
| `outdated` | N | Threads on code that has since changed (`isOutdated: true`) |
| `resolved` | N | Already resolved (`isResolved: true`) — skipped unless user requests |

**Azure DevOps** uses five primary statuses (`active`, `pending`,
`fixed`, `wontFix`, `closed`) plus the edge values `byDesign` and
`unknown` and a derived "potentially outdated" flag. ADO uses
`fixed` for an addressed thread — NOT GitHub's `resolved`:

| State | Count | Description |
|-------|-------|-------------|
| `active` | N | New / open threads requiring response |
| `pending` | N | Author marked awaiting something — flag for user |
| `fixed` | N | Issue addressed — skipped unless user requests |
| `wontFix` | N | Noted but won't be fixed — skipped unless user requests |
| `closed` | N | Discussion closed — skipped unless user requests |
| `byDesign` / `unknown` | N | Already triaged — skipped unless user requests |
| _Potentially outdated_ | N | Derived (not an API status); thread tracked from older iteration or location no longer exists |

- **Total threads**: count
- **Actionable threads**: count (the platform's "needs response" states,
  unless the user overrides)
- **Skipped threads**: count and reason (use the platform's native
  status names — do not translate)
- **System threads** (ADO only): count of system-generated threads
  (merge attempts, vote updates, reviewer changes, ref updates) that
  were excluded from analysis

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
- **Thread State**: <use the same literals/casing as the Thread
  Summary tables above — e.g., `open` / `outdated` for GitHub;
  `active` / `pending` / `wontFix` / `byDesign` for ADO. Mark the
  derived ADO value as _potentially outdated_ in italics (it is not
  an API status).>
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
| **Threads marked resolved/closed** | N | Threads transitioned to a closed status (use the platform's native term: GitHub `resolved`; ADO `fixed` / `closed` / `wontFix` / `byDesign`) |
| **Skipped (already closed)** | N | Threads already in a non-actionable state at start (GitHub `resolved`; ADO `fixed` / `closed` / `wontFix` / `byDesign`) |
| **Skipped (outdated / potentially outdated)** | N | Threads on changed code |
| **Skipped (system threads, ADO only)** | N | System-generated threads excluded from analysis |
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
