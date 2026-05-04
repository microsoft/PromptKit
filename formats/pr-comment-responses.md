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

- **Code Context**:
  - File: `<path>`
  - Line(s): `<line>` or `<startLine>-<line>`
  - Symbol / Function: `<name>` or `Unknown / not inside named symbol`
  - Code Purpose: <1-2 sentences describing what the surrounding code does>
  - Evidence: <specific lines, symbols, or comments used to infer purpose>

- **Validity Assessment**: Valid / Partially valid / Invalid / Needs user decision
- **Technical Reasoning**:
  - Evidence supporting the assessment: <code, tests, contracts, docs, or reviewer text>
  - Falsifier checked: <what would make this assessment wrong, and whether it was found>
  - Confidence: High / Medium / Low

- **Disposition**: Apply now / Defer (short-term) / Defer (medium-term) / Defer (long-term) / Decline
- **Disposition Reason**: <one sentence explaining why this timeframe is appropriate>

- **Target Thread State**: Leave open / Resolve after reply / Resolve after code fix / Needs user decision
- **State Rationale**: <brief explanation of why this state is appropriate>

- **Response Type**: Fix / Explain / Both
- **Internal Analysis**: <technical reasoning for the user; not posted externally>
- **Code Fix** *(if Response Type includes Fix)*:
  ```diff
  <before/after with at least 3 lines of surrounding context>
  ```
- **Draft Reply to Post** *(if Response Type includes Explain, or if Disposition is Decline)*:
  ```text
  <exact proposed reply text in the user's voice>
  ```
- **Reply Self-Check**:
  - Matches available voice samples: Yes / No / No samples available
  - No em-dashes in drafted reply: Yes / No
  - No AI-tell phrases (per `human-voice-fidelity` Phase 4): Yes / No
  - No unsupported claims in drafted reply: Yes / No

- **Work Item Proposal** *(required when Disposition is any Defer value, or when the fix is non-trivial; otherwise state "Not needed")*:
  - Needed: Yes / No
  - Tracker: GitHub Issue / Azure DevOps / Jira / Other / Tool-neutral / Unknown
  - Type: Bug / Task / User Story / Tech Debt
  - Title: <one line>
  - Description: <2-4 sentences>
  - Repro Steps: <Bug only; otherwise "N/A">
  - Acceptance Criteria: <User Story only; otherwise "N/A">
  - Priority: Critical / High / Medium / Low / Unknown
  - Effort: Small / Medium / Large / Unknown
  - Source Thread(s): T-<NNN>[, T-<NNN>...]

- **Decline Detail** *(only when Disposition is Decline; otherwise omit)*:
  - Decline Reason (internal): <technical reason for the user>
  - Reviewer-Facing Decline Reply: <collaborative reply explaining the tradeoff in the user's voice; subject to the same self-check>

- **Linked Contradiction**: C-<NNN> (if part of a detected contradiction)
```

### 4. Action Summary

| Category | Count | Details |
|----------|-------|---------|
| **Code fixes applied** | N | Threads where code was changed |
| **Code fixes proposed (user to apply)** | N | Threads with diffs left for the user |
| **Replies posted** | N | Threads where the agent posted the reply |
| **Replies drafted (user to post)** | N | Threads with replies left for the user |
| **Threads resolved** | N | Threads marked resolved this session |
| **Skipped (resolved)** | N | Already resolved threads |
| **Skipped (outdated)** | N | Threads on changed code |
| **Needs discussion** | N | Contradictions or ambiguous feedback |

**Disposition counts**:

| Disposition | Count |
|---|---|
| Apply now | N |
| Defer (short-term) | N |
| Defer (medium-term) | N |
| Defer (long-term) | N |
| Decline | N |

**Target thread state counts**:

| Target State | Count |
|---|---|
| Leave open | N |
| Resolve after reply | N |
| Resolve after code fix | N |
| Needs user decision | N |

**Work items**:

| Status | Count | Details |
|---|---|---|
| Drafted (proposal only) | N | Tracker: <name or `none`> |
| Created | N | Tracker: <name>; links: <list> |

- **Files modified**: list of files changed by fixes (state "None" if empty)
- **Commits**: list of commits created (action mode only; state "None" if empty)
- **Unresolved items**: threads that need human judgment (state "None identified" if empty)

### 5. Voice Calibration Note

A short internal-facing note (one or two lines) recording:

- Voice sources used (e.g., "5 prior PR replies in repo + 2 user-pasted samples"), or
- "No voice samples available; neutral collaborative default applied."

This section is required whenever the output includes drafted replies.
State "Not applicable" only if no replies were drafted.

## Formatting Rules

- Threads MUST be ordered by file path, then by line number within
  each file.
- Every actionable thread MUST have a response; do not skip threads
  without stating why.
- Every actionable thread MUST include all per-thread fields defined
  in Section 3. Use `Unknown`, `Not needed`, `N/A`, or `None
  identified` rather than omitting fields.
- Code fixes MUST show before/after snippets with enough context
  (at least 3 lines) to verify correctness.
- If a section has no content, state "None identified"; never omit
  sections.
- In action mode, present the full analysis to the user and obtain
  explicit confirmation of the overall plan before executing any
  mutation. Commits, pushes, and thread resolutions MUST receive
  explicit confirmation regardless of any delegation matrix defaults.

### Disposition Definitions

Use these objective definitions, not subjective interpretation:

| Disposition | Meaning |
|---|---|
| **Apply now** | Required to address the review thread or unblock merge of this PR. |
| **Defer (short-term)** | Should be handled before or shortly after merge. Low design risk; small scope; no architectural change. |
| **Defer (medium-term)** | Requires follow-up planning, touches adjacent areas, or interacts with other in-flight work. Suitable for the next planning cycle. |
| **Defer (long-term)** | Strategic cleanup, architectural rework, or non-blocking improvement. Belongs on the backlog without a near-term commitment. |
| **Decline** | Not valid, not aligned with project direction, or cost exceeds benefit. Requires both an internal reason and a reviewer-facing reply. |

### Voice Rules

The `human-voice-fidelity` protocol governs all drafted user-facing
text in this format (Draft Reply to Post, Reviewer-Facing Decline
Reply). In summary:

- Draft in the user's observed voice when samples are available;
  fall back to a neutral collaborative default otherwise.
- No em-dashes in drafted replies (en-dashes in numeric ranges are
  fine).
- No generic AI-tell phrases unless they appear in the user's samples.
- Voice rules apply ONLY to drafted external text. Internal Analysis,
  Technical Reasoning, code, file paths, command output, and quoted
  reviewer comments are NOT subject to the em-dash or phrase rules.
- Every drafted reply MUST pass the protocol's Phase 4 self-check;
  the result is recorded in the per-thread Reply Self-Check fields.

## Response Type

- `response_type` MUST be one of: **Fix**, **Explain**, or **Both**.
- If a per-thread override is shown, it MUST use one of the same values.
