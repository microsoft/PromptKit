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
format: pr-comment-responses
params:
  pr_reference: "Pull request to respond to — URL or number (e.g., #42)"
  review_threads: "Review feedback to address — 'all pending', specific thread URLs, or pasted comments"
  codebase_context: "What this code does, relevant architecture, design decisions that inform responses"
  response_mode: "How to respond per-thread — 'auto' (heuristic), 'fix' (code changes), or 'explain' (rationale)"
  output_mode: "Output mode — 'document' (produce response plan) or 'action' (make changes and post replies via gh CLI)"
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

## Instructions

### Phase 1: Gather Review Threads

1. **Read all review threads** on the PR:
   - Use `gh pr view --comments` or `gh api` to fetch review threads
   - For each thread, note:
     - Reviewer handle
     - File path and line number
     - Thread state (pending, resolved, outdated)
     - Full comment text and any replies
     - Whether the thread is on code that still exists in the
       current diff

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
   resolution. Do NOT silently pick one side — flag for the user.

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

For each thread, produce:

- **Analysis**: Why the feedback is valid, partially valid, or based
  on a misunderstanding. Be honest — if the reviewer is right,
  acknowledge it. If they are wrong, explain why respectfully.
- **Fix** (if applicable): The specific code change, shown as
  before/after with at least 3 lines of surrounding context.
- **Explanation** (if applicable): A draft reply to the reviewer
  that explains the design decision, tradeoff, or rationale. Keep
  it professional, concise, and technical.

### Phase 4: Output

#### Document Mode (`output_mode: document`)

Produce the output following the `pr-comment-responses` format:
1. Thread Summary (by state)
2. Contradiction Report
3. Per-Thread Responses (in file order)
4. Action Summary

#### Action Mode (`output_mode: action`)

Execute responses with **mandatory user confirmation at every step**:

1. **Present the full analysis** (thread summary, contradictions,
   per-thread responses) to the user using the document structure.

2. **For each thread with a code fix**:
   a. Show the proposed diff to the user.
   b. Ask: "Apply this fix? (yes / skip / edit)"
   c. If confirmed, make the code change in the file.
   d. Do NOT commit yet — batch all fixes first.

3. **After all fixes are applied**:
   a. Show the user a summary of all changes made.
   b. Ask: "Commit and push these changes? (yes / no)"
   c. If confirmed, commit with a descriptive message referencing
      the review threads addressed, then push.

4. **For each thread with an explanation**:
   a. Show the draft reply to the user.
   b. Ask: "Post this reply? (yes / skip / edit)"
   c. If confirmed, post the reply using:
      ```
      gh api repos/{owner}/{repo}/pulls/{pr_number}/comments \
        --method POST \
        --field body="<reply text>" \
        --field in_reply_to="<comment_id>"
      ```

5. **For threads that were fixed**:
   a. Ask: "Resolve these threads? (yes / no)"
   b. If confirmed, resolve each thread using:
      ```
      gh api graphql -f query='mutation {
        resolveReviewThread(input: {threadId: "<thread_id>"}) {
          thread { isResolved }
        }
      }'
      ```

6. **Never take any action without explicit user confirmation.**
   If the user skips all items, produce a document-mode report instead.

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

- Do NOT perform a new code review — focus only on addressing
  existing feedback.
- Do NOT modify code beyond what is needed to address review comments.
- Do NOT resolve threads without user confirmation.
- Do NOT dismiss or ignore valid feedback — if a reviewer is correct,
  acknowledge it and fix it.
- Do NOT take sides in contradictions — present both positions and
  let the user decide.
- Do NOT push commits without explicit user confirmation.

## Quality Checklist

Before finalizing, verify:

- [ ] Every pending thread has a response (fix, explanation, or both)
- [ ] Contradictions across reviewers are explicitly flagged
- [ ] Code fixes show before/after with sufficient context
- [ ] Draft replies are professional, concise, and technical
- [ ] Resolved and outdated threads are accounted for (skipped with reason)
- [ ] In action mode: user confirmation obtained before every mutation
- [ ] Thread states (pending/resolved/outdated) are accurately reported
- [ ] Files modified by fixes are listed in the action summary
