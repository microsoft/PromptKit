<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: respond-to-pr-comments
description: >
  Process pull request review feedback and generate per-thread responses.
  Supports document mode (structured response plan) or action mode
  (make code fixes, post replies, and resolve threads via GitHub API).
  Detects contradictory feedback across reviewers.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - guardrails/human-voice-fidelity
format: pr-comment-responses
params:
  pr_reference: "Pull request to respond to (URL or number, e.g., #42). If omitted in interactive use, the agent runs a tiny preflight to list the user's open PRs."
  review_threads: "Review feedback to address: 'all pending', specific thread URLs, or pasted comments"
  codebase_context: "What this code does, relevant architecture, design decisions that inform responses"
  response_mode: "How to respond per-thread: 'auto' (heuristic), 'fix' (code changes), or 'explain' (rationale)"
  output_mode: "Output mode: 'document' (produce response plan) or 'action' (make changes and post replies via gh CLI)"
  voice_sources: "Where to source the user's voice for drafted replies. Free-form list (e.g., 'pasted samples below; prior PR replies in this repo; WorkIQ MCP if available'). Defaults to 'auto-discover from repo + session history'."
  delegation_matrix: "Per-action-class defaults for action mode: 'agent does', 'user does manually', or 'confirm each'. Action classes: post replies, apply code fixes, draft work items, create work items, commit/push, resolve threads. Commit/push and resolve threads always require confirmation regardless of default."
  work_item_tracker: "Optional tracker for work-item creation: 'github-issues', 'azure-devops', 'jira', 'other', or 'none' (proposals only, no creation)"
input_contract: null
output_contract:
  type: pr-comment-responses
  description: >
    A structured per-thread response plan with code fixes and/or
    explanations. In action mode, responses are executed as code
    changes, reply comments, and thread resolutions.
---

# Task: Respond to PR Review Comments

You are tasked with processing review feedback on a pull request and
generating responses for each review thread — either code fixes,
explanatory replies, or both.

## Inputs

**Pull Request**: {{pr_reference}}

**Review Threads to Address**: {{review_threads}}

**Codebase Context**: {{codebase_context}}

**Response Mode**: {{response_mode}}

**Output Mode**: {{output_mode}}

**Voice Sources**: {{voice_sources}}

**Delegation Matrix**: {{delegation_matrix}}

**Work Item Tracker**: {{work_item_tracker}}

## Instructions

### Phase 0: Preflight and Voice Calibration

1. **PR preflight**: If `pr_reference` is empty, list the user's open PRs
   with `gh pr list --author @me --state open` and ask which one to
   process. This template handles a single PR; backlog-level PR
   prioritization is a non-goal (use `triage-pull-requests` instead).

2. **Voice calibration**: Apply the `human-voice-fidelity` protocol.
   Source voice samples per its Phase 1 priority order, calibrate the
   user's observed style per its Phase 2, and record a one-line **Voice
   Calibration Note** to include in the final output. If no samples are
   available, ask the user for 2-3 samples or fall back to the neutral
   collaborative default; never claim voice match without evidence.

### Phase 1: Gather Review Threads

1. **Read all review threads** on the PR:
   - Use `gh pr view {{pr_reference}} --comments` for a quick overview, but use
     `gh api graphql` to fetch the authoritative review-thread data
     needed for deterministic action mode execution
   - For each review thread, record:
     - `thread_id`: the GraphQL review thread ID (required for
       `resolveReviewThread`)
     - Reviewer handle
     - File path and line number
     - Thread state (pending, resolved, outdated)
     - Full comment text and any replies
     - Whether the thread is on code that still exists in the
       current diff
   - For each review comment within the thread, record:
     - `comment_id`: the review comment database ID (required for
       REST `in_reply_to` when posting a reply)
     - Author handle
     - Comment body
   - Use a GraphQL query via `gh api graphql` that includes each
     thread's ID, state, path, and line metadata, plus each
     comment's database ID, author, and body
   - Preserve these IDs in your working notes so later action
     steps can post replies and resolve the correct threads

2. **Filter threads** based on `review_threads` parameter:
   - If `all pending` — include all threads with state `pending`
   - If specific threads are listed — include only those
   - Skip `resolved` threads unless the user explicitly requests them
   - Flag `outdated` threads (code has changed since the comment)
     and ask the user whether to address them

3. **Read the current code** at each thread's location:
   - Fetch the file content at the relevant lines
   - Understand the surrounding context (function, class, module)
   - Check if the code has changed since the review comment was posted

### Phase 2: Detect Contradictions

Compare feedback across different reviewers on the same code area
or design decision:

1. **Group threads by location**: threads on the same file within
   10 lines of each other, or threads referencing the same function
   or design concept.

2. **Compare positions**: for each group, check if reviewers disagree:
   - Reviewer A says "add error handling" but Reviewer B says
     "keep it simple, don't over-engineer"
   - Reviewer A says "use approach X" but Reviewer B says
     "use approach Y"
   - Reviewer A approves a pattern but Reviewer B flags it

3. **Report contradictions** with both positions and a recommended
   resolution. Do NOT silently pick one side; flag for the user.

### Phase 2.5: Delegation Matrix Setup (action mode only)

Before any mutations, confirm the delegation matrix with the user. For
each action class below, the user picks one of: **agent does**,
**user does manually**, or **confirm each**.

| Action Class | Suggested Default |
|---|---|
| Post replies | confirm each |
| Apply code fixes | confirm each |
| Draft work items (artifact only) | agent does |
| Create work items in tracker | user does manually |
| Commit and push | confirm each (mandatory) |
| Resolve threads | confirm each (mandatory) |

**Safety floor (non-negotiable, regardless of matrix):**

- Commit and push: always requires explicit per-batch confirmation.
- Resolve threads: always requires explicit per-batch confirmation.
- Any action class set to **agent does** still requires the user to
  approve the overall plan in Phase 5 before execution begins.

### Phase 3: Analyze Each Thread

For each actionable thread, determine the response type:

1. **If `response_mode` is `auto`**, apply these heuristics:

   | Reviewer Feedback | Response Type |
   |---|---|
   | Points out a bug, missing check, or incorrect behavior | **Fix** |
   | Asks "why" or questions a design choice | **Explain** |
   | Suggests a refactor or alternative approach | **Both** |
   | Requests documentation or comment changes | **Fix** |
   | Flags a style or convention issue | **Fix** |
   | Raises a concern without a specific ask | **Explain** |

2. **If `response_mode` is `fix`** — generate a code fix for every
   thread. If a fix is not applicable (e.g., the comment is a design
   question), note this and fall back to an explanation.

3. **If `response_mode` is `explain`** — generate an explanatory reply
   for every thread. If the feedback clearly requires a code change
   (e.g., a bug), note this and recommend the user switch to `auto`.

For each thread, produce the full per-thread record required by the
`pr-comment-responses` format, which includes:

- **Code Context**: file path, line(s), enclosing symbol/function name
  (or `Unknown` if not inside a named symbol; do not invent a name),
  and a 1-2 sentence description of what the surrounding code does.
- **Validity Assessment**: `Valid` / `Partially valid` / `Invalid` /
  `Needs user decision`, plus **Technical Reasoning** with explicit
  evidence, the falsifier checked, and a confidence level. Be honest:
  if the reviewer is right, acknowledge it; if they are wrong, explain
  why respectfully.
- **Disposition**: `Apply now` / `Defer (short-term)` /
  `Defer (medium-term)` / `Defer (long-term)` / `Decline`, with a
  one-sentence reason. Use the objective definitions in the
  `pr-comment-responses` format.
- **Target Thread State**: `Leave open` / `Resolve after reply` /
  `Resolve after code fix` / `Needs user decision`, with a brief
  rationale. This is the intended final state regardless of who
  performs the mutation.
- **Internal Analysis**: technical reasoning shown to the user only
  (never posted externally).
- **Draft Reply to Post** (if applicable): the exact text to post,
  drafted in the user's voice per the `human-voice-fidelity` protocol.
  Pass it through the protocol's Phase 4 self-check before presenting.
- **Code Fix** (if applicable): before/after snippets with at least 3
  lines of surrounding context.
- **Work Item Proposal** (if disposition is any `Defer` value, or if
  the fix is non-trivial): tool-neutral draft per the format's schema.
  The agent always drafts the proposal; it only creates the item if
  the delegation matrix authorizes it AND `work_item_tracker` is set
  to a supported tracker.
- **Decline-specific fields** (if disposition is `Decline`): both an
  internal `Decline Reason` and a `Reviewer-Facing Decline Reply`
  drafted under the voice protocol so the decline lands collaboratively.

### Phase 4: Output

#### Document Mode (`output_mode: document`)

Produce the output following the `pr-comment-responses` format:
1. Thread Summary (by state)
2. Contradiction Report
3. Per-Thread Responses (in file order)
4. Action Summary

#### Action Mode (`output_mode: action`)

Execute responses respecting the **delegation matrix** from Phase 2.5,
with a hard safety floor of confirmation for commits, pushes, and
thread resolutions.

1. **Present the full analysis** (thread summary, contradictions,
   per-thread responses, work-item proposals, voice calibration note)
   to the user using the document structure. Obtain explicit approval
   of the overall plan before any mutation, regardless of matrix
   defaults.

2. **For each thread with a code fix**, follow the matrix entry for
   "Apply code fixes":
   - **agent does**: apply the fix; report the change in the action
     summary.
   - **user does manually**: include the diff in the output for the
     user to apply; do not modify the file.
   - **confirm each**: show the proposed diff, ask
     "Apply this fix? (yes / skip / edit)", apply if confirmed.

   In all cases, do NOT commit yet; batch all fixes first.

3. **After all fixes are applied**, regardless of matrix:
   a. Show the user a summary of all changes made.
   b. Ask: "Commit and push these changes? (yes / no)"
   c. If confirmed, commit with a descriptive message referencing
      the review threads addressed, then push.

4. **For each thread with a draft reply**, follow the matrix entry for
   "Post replies":
   - **agent does**: post the reply directly via `gh api`.
   - **user does manually**: include the draft in the output; do not
     post.
   - **confirm each**: show the draft, ask
     "Post this reply? (yes / skip / edit)", post if confirmed.

   When posting, write the reply payload to `reply.json` and post:
      ```json
      {
        "body": "<reply text>",
        "in_reply_to": <comment_id>
      }
      ```
      ```
      gh api repos/{owner}/{repo}/pulls/{pr_number}/comments \
        --method POST \
        --input reply.json
      ```

5. **For threads whose target state is `Resolve after reply` or
   `Resolve after code fix`**, regardless of matrix:
   a. List the threads to be resolved.
   b. Ask: "Resolve these threads? (yes / no)"
   c. If confirmed, resolve each thread using:
      ```
      gh api graphql \
        -f query='mutation($threadId: ID!) {
          resolveReviewThread(input: {threadId: $threadId}) {
            thread { isResolved }
          }
        }' \
        -F threadId="<thread_id>"
      ```

6. **Work-item creation** (only if delegation matrix has
   "Create work items in tracker" set to **agent does** AND
   `work_item_tracker` is a supported value):
   - Show the proposed work item(s) and the destination tracker.
   - Ask: "Create these work items? (yes / no)"
   - If confirmed, create each item via the appropriate CLI/API for
     the tracker (`gh issue create` for github-issues, `az boards
     work-item create` or the ADO MCP for azure-devops, etc.).
   - If `work_item_tracker` is `none` or the matrix entry is
     **user does manually**, include the proposals in the output for
     the user to file manually; do not attempt creation.

7. **Safety floor**: Commits, pushes, and thread resolutions ALWAYS
   require explicit user confirmation regardless of the delegation
   matrix. If the user skips all items, produce a document-mode
   report instead.

### Phase 5: Handle Edge Cases

- **No pending threads**: Report "No actionable review threads found"
  and list any resolved/outdated threads for reference.
- **Large thread count (>20)**: Process in batches of 10. After each
  batch, summarize progress and ask to continue.
- **Outdated threads**: Flag these separately. Ask the user whether
  to address them — the code may have already changed to address
  the feedback.
- **Threads on deleted files**: Skip with a note explaining the file
  no longer exists.

## Non-Goals

- Do NOT perform a new code review; focus only on addressing existing
  feedback.
- Do NOT modify code beyond what is needed to address review comments.
- Do NOT resolve threads without user confirmation.
- Do NOT dismiss or ignore valid feedback; if a reviewer is correct,
  acknowledge it and fix it.
- Do NOT take sides in contradictions; present both positions and let
  the user decide.
- Do NOT push commits without explicit user confirmation.
- Do NOT manage all of the user's open PRs in this template; this
  workflow scopes to a single PR. Backlog-level prioritization belongs
  in `triage-pull-requests`.
- Do NOT invent function names, code purposes, or work-item content
  not grounded in the readable code or the reviewer's text. Use
  `Unknown` where the evidence does not support a specific claim.
- Do NOT post drafted replies that fail the `human-voice-fidelity`
  Phase 4 self-check.

## Quality Checklist

Before finalizing, verify:

- [ ] Every pending thread has a response (fix, explanation, or both)
- [ ] Each thread records code context (file, line, symbol or
      `Unknown`, code purpose)
- [ ] Each thread has an explicit validity assessment with evidence,
      falsifier, and confidence
- [ ] Each thread has a disposition with timeframe and reason
- [ ] Each thread has a target thread state with rationale
- [ ] Internal analysis is separated from drafted replies; replies
      pass the voice protocol self-check (no em-dashes, no AI tells)
- [ ] Work-item proposals exist for all deferred or non-trivial items
- [ ] Decline dispositions include both an internal reason and a
      reviewer-facing reply
- [ ] Contradictions across reviewers are explicitly flagged
- [ ] Code fixes show before/after with sufficient context
- [ ] Resolved and outdated threads are accounted for (skipped with reason)
- [ ] Voice calibration note records which sources were used (or that
      no samples were available)
- [ ] In action mode: delegation matrix was confirmed; commit/push and
      thread resolutions obtained explicit confirmation regardless of
      matrix defaults
- [ ] Thread states (pending/resolved/outdated) are accurately reported
- [ ] Files modified by fixes are listed in the action summary
