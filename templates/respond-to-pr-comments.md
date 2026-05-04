<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: respond-to-pr-comments
description: >
  Process pull request review feedback and generate per-thread responses
  on GitHub or Azure DevOps Services. Supports document mode (structured
  response plan) or action mode (make code fixes, post replies, and
  update thread status via the platform's API). Detects contradictory
  feedback across reviewers.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - guardrails/human-voice-fidelity
format: pr-comment-responses
params:
  pr_reference: "Pull request to respond to — full URL (GitHub or Azure DevOps Services), PR number (e.g., #42 for GitHub), or bare numeric PR id (e.g., 123, optionally prefixed `ado:123` to disambiguate). Platform is auto-detected from the URL when given; otherwise inferred from `git remote -v` of the current repo. If both signals are absent or ambiguous, the workflow prompts you to pick rather than guessing."
  review_threads: "Review feedback to address — 'all open' (GitHub: unresolved threads; ADO: status `active`), specific thread URLs, or pasted comments"
  codebase_context: "What this code does, relevant architecture, design decisions that inform responses"
  response_mode: "How to respond per-thread — 'auto' (heuristic), 'fix' (code changes), or 'explain' (rationale)"
  output_mode: "Output mode — 'document' (produce response plan) or 'action' (make changes and post replies via the platform's CLI/API)"
input_contract: null
output_contract:
  type: pr-comment-responses
  description: >
    A structured per-thread response plan with code fixes and/or
    explanations. In action mode, responses are executed as code
    changes, reply comments, and thread status updates.
---

# Task: Respond to PR Review Comments

You are tasked with processing review feedback on a pull request and
generating responses for each review thread — either code fixes,
explanatory replies, or both. The pull request may live on **GitHub**
or **Azure DevOps Services**; the workflow is the same, but the API
calls differ. Use the platform's **native status vocabulary** in all
output — do NOT translate statuses across platforms.

## Inputs

**Pull Request**: {{pr_reference}}

**Review Threads to Address**: {{review_threads}}

**Codebase Context**: {{codebase_context}}

**Response Mode**: {{response_mode}}

**Output Mode**: {{output_mode}}

## Instructions

### Phase 1: Detect the Platform

Determine whether `pr_reference` points to a GitHub or Azure DevOps
Services pull request. Use this resolution order:

1. **Parse the URL**:
   - `github.com/<owner>/<repo>/pull/<n>` → **GitHub**
   - `dev.azure.com/<org>/<project>/_git/<repo>/pullrequest/<n>` →
     **Azure DevOps Services**
   - `<org>.visualstudio.com/<project>/_git/<repo>/pullrequest/<n>` →
     **Azure DevOps Services** (legacy host)
   - URL-decode `<project>` and `<repo>` segments before using them.

2. **If `pr_reference` is not a URL** (e.g., bare `#42` for GitHub or
   `123` / `ado:123` for ADO),
   inspect `git remote -v` in the current working directory:
   - Match HTTPS or SSH remotes:
     - GitHub: `github.com`, `git@github.com`
     - ADO: `dev.azure.com`, `git@ssh.dev.azure.com:v3/...`,
       `<org>.visualstudio.com`, `<org>@vs-ssh.visualstudio.com:v3/...`
   - If multiple remotes exist, prefer the upstream of the current branch.

3. **If still ambiguous**, ask the user explicitly:
   "Is this PR on GitHub or Azure DevOps Services?" Do NOT guess.

4. **Out of scope**: Azure DevOps Server (on-prem) and TFS custom
   hostnames are NOT supported by this template's auth path. If you
   detect such a host, stop and inform the user that they must run
   this template against a supported platform or provide their own
   working API auth context.

Record the detected platform; the rest of the phases branch on it.

5. **Resolve connection coordinates** before any API call. The set
   of values needed depends on the platform:
   - **GitHub**: `owner`, `repo`, `pr_number`.
   - **ADO**: `org`, `project`, `repoName`, `prId` (and later `repoId`,
     resolved via the API in Phase 2).

   Source the values as follows:
   - **If `pr_reference` is a URL**, parse them from the URL path.
     URL-decode each segment for display, comparison, and JSON
     payloads. When constructing REST URIs, **URL-encode each path
     segment** (or preserve the already-encoded segments from the
     original URL) so values containing spaces or other reserved
     characters do not produce malformed requests.
   - **If `pr_reference` is a bare id** (`#42` for GitHub, `123` or
     `ado:123` for ADO), derive
     `owner`/`repo` (GitHub) or `org`/`project`/`repoName` (ADO) from
     the selected upstream remote. Recognise these forms:
     - GitHub HTTPS: `https://github.com/{owner}/{repo}(.git)?`
     - GitHub SSH: `git@github.com:{owner}/{repo}(.git)?`
     - ADO HTTPS: `https://dev.azure.com/{org}/{project}/_git/{repo}`
     - ADO SSH: `git@ssh.dev.azure.com:v3/{org}/{project}/{repo}`
     - ADO legacy HTTPS: `https://{org}.visualstudio.com/{project}/_git/{repo}`
     - ADO legacy SSH: `{org}@vs-ssh.visualstudio.com:v3/{org}/{project}/{repo}`
     The bare id provides `pr_number` / `prId`.
   - If any required field cannot be determined unambiguously, prompt
     the user. Do NOT invent values.

### Phase 2: Gather Review Threads

Fetch all review threads from the platform.

#### GitHub branch

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
   - **Paginate exhaustively.** Both `reviewThreads` and the inner
     `comments` connection paginate independently. Page outer
     `reviewThreads(first: 100, after: $cursor)` until
     `pageInfo.hasNextPage` is `false`. Then, for any thread whose
     inner `comments.pageInfo.hasNextPage` is `true`, issue a
     follow-up query keyed by the thread `id` with
     `comments(first: 100, after: $commentCursor)` and repeat until
     exhausted. PRs with many reviewers easily exceed 100 comments
     on a single thread.
   - Preserve these IDs in your working notes so later action
     steps can post replies and resolve the correct threads

2. **Filter threads** based on `review_threads` parameter:
   - If `all open` — include all threads where `isResolved: false`
   - If specific threads are listed — include only those
   - Skip `resolved` threads unless the user explicitly requests them
   - Flag `outdated` threads (code has changed since the comment)
     and ask the user whether to address them

3. **Read the current code** at each thread's location:
   - Fetch the file content at the relevant lines
   - Understand the surrounding context (function, class, module)
   - Check if the code has changed since the review comment was posted

#### Azure DevOps branch

**Authentication.** All ADO API calls in this template use `az rest`
with `--resource 499b84ac-1321-427f-aa17-267ca6975798` (the Azure
DevOps resource ID). The user must have run `az login` once. Do NOT
omit `--resource` — without it, `az rest` may attach a token for the
wrong audience and the call will fail authorization. Do NOT instruct
the user to mint a Personal Access Token.

1. **Resolve the repository GUID and PR id.** Parse the PR URL:
   - `org`, `project`, `repoName`, `prId` from the URL path
     (URL-decode `project` and `repoName`).
   - When constructing the API URIs below, **URL-encode** `project`
     and `repoName` (they may contain spaces or reserved characters).
     `{projectEnc}` and `{repoNameEnc}` denote the encoded forms;
     `{org}` and GUIDs (`{repoId}`) need no encoding.
   - Look up the repository GUID — needed by some thread endpoints:

     ```powershell
     az rest --resource 499b84ac-1321-427f-aa17-267ca6975798 `
       --method GET `
       --uri "https://dev.azure.com/{org}/{projectEnc}/_apis/git/repositories/{repoNameEnc}?api-version=7.1"
     ```

     Record the returned `id` as `repoId`.
   - For fork PRs, ADO targets the **target repository** for thread
     operations; `repoId` from the URL above is correct.

2. **List all PR threads.** The documented schema for this endpoint
   does not expose `$top`/`$skip` pagination parameters, and comments
   are embedded inline in each thread. Treat the response defensively
   anyway: if a `continuationToken` field appears in the body or an
   `x-ms-continuationtoken` header is returned, follow it (passing
   `?continuationToken=<token>` on the next request) until no further
   token is returned.

   ```powershell
   az rest --resource 499b84ac-1321-427f-aa17-267ca6975798 `
     --method GET `
     --uri "https://dev.azure.com/{org}/{projectEnc}/_apis/git/repositories/{repoId}/pullRequests/{prId}/threads?api-version=7.1"
   ```

   Read `value[]` from the response. For each thread, record:
   - `id`: the thread id (integer; required for status updates and
     posting replies)
   - `status`: one of `active`, `pending`, `fixed`, `wontFix`,
     `closed`, `byDesign`, `unknown` (lowercase API enum values —
     ADO uses `fixed`, NOT `resolved`)
   - `threadContext`: file path (`filePath`), line range
     (`rightFileStart` / `rightFileEnd`), and side. May be `null`
     for PR-wide threads or system threads.
   - `pullRequestThreadContext.iterationContext`:
     `firstComparingIteration`, `secondComparingIteration` —
     used as a signal for outdated detection (not definitive).
   - `properties` and `comments[*].commentType` — used to identify
     system threads (see step 4).
   - For each comment in `comments[]`: `id` (the
     `parentCommentId` for posting a reply), author display name
     and unique name, content, and `commentType`.

3. **Get the latest iteration** (used for outdated detection):

   ```powershell
   az rest --resource 499b84ac-1321-427f-aa17-267ca6975798 `
     --method GET `
     --uri "https://dev.azure.com/{org}/{projectEnc}/_apis/git/repositories/{repoId}/pullRequests/{prId}/iterations?api-version=7.1"
   ```

   Record the highest `id` as `latestIteration`.

4. **Filter out system threads.** Skip threads where any of these
   are true (these are auto-generated by ADO, not human review):
   - All comments have `commentType: "system"`.
   - `properties` contains a `CodeReviewThreadType` of
     `MergeAttempt`, `VoteUpdate`, `ReviewersUpdate`, `RefUpdate`,
     or `StatusUpdate`.

   Count skipped system threads for the summary; do NOT process them.
   Threads that do not match the rules above but contain no `text`
   comments (only attachments, reactions, or non-text content)
   should NOT be auto-skipped — flag them and ask the user.

5. **Filter remaining threads** based on `review_threads` parameter:
   - If `all open` — include threads with status `active` (the
     default state for new comments needing response). Note: ADO's
     `pending` status is distinct (author-marked awaiting something)
     and is handled in the next bullet, not as part of `all open`.
   - **Pending threads (status `pending`)**: flag and ask the user
     whether to address now — the comment author marked them as
     awaiting something.
   - Skip `fixed`, `wontFix`, `closed`, `byDesign`, `unknown`
     unless the user explicitly requests them.
   - If specific threads are listed, include only those.

6. **Detect potentially outdated threads.** ADO has no native
   "outdated" status; use the conservative algorithm below and only
   flag as **potentially outdated** (do not assert).

   **Skip this detection entirely for PR-wide threads** — if
   `threadContext` is null, the thread has no file or lines to
   verify. Pass it through unchanged to step 7.

   For file-anchored threads only, decide the source of truth for
   "current file contents":
   - **Preferred**: query the latest iteration's changes via
     `GET .../pullRequests/{prId}/iterations/{latestIteration}/changes?api-version=7.1`
     and the file content via
     `GET .../items?path={filePath}&versionDescriptor.version={sourceBranch}&versionDescriptor.versionType=branch&api-version=7.1`.
   - **Fallback**: the local working tree, **only** if you can
     confirm `HEAD` matches the PR source branch tip at
     `latestIteration` (e.g., compare commit SHA from the iterations
     response against `git rev-parse HEAD`). Otherwise do NOT use
     local files.
   - **If you cannot verify either**, mark the thread's outdated
     status as **unknown / not verified** and ask the user — do NOT
     guess.

   With a verified source of truth, flag as potentially outdated
   when any holds:
   - The thread's `threadContext.filePath` no longer exists in the
     latest iteration (deleted or renamed file).
   - The thread's line range
     (`threadContext.rightFileStart` / `rightFileEnd`) is outside
     the current file's line count.
   - `pullRequestThreadContext.iterationContext.secondComparingIteration`
     is older than `latestIteration` AND the file/lines have changed
     since that iteration.

   For each potentially outdated thread, ask the user whether to
   address it.

7. **Identify PR-wide (general) threads.** Threads with
   `threadContext: null` that survived the system-thread filter are
   genuine PR-wide discussion threads (added on the **Overview** tab
   in the ADO UI). Group these separately from file-anchored threads
   in the report — do NOT skip them.

8. **Read the current code** at each file-anchored thread's location
   (same as the GitHub branch, step 3).

### Phase 3: Detect Contradictions

This phase is platform-agnostic. Compare feedback across different
reviewers on the same code area or design decision:

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

### Phase 4: Analyze Each Thread

This phase is platform-agnostic. For each actionable thread, determine
the response type:

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
  that explains the design decision, tradeoff, or rationale. Apply
  the **human-voice-fidelity** protocol to this drafted text — match
  the user's observed style and run the self-check pass (no em-dash,
  no AI-tell phrases) before presenting. The voice protocol scopes
  to the drafted reply only; surrounding analysis, code, and quoted
  reviewer text are exempt.

### Phase 5: Output

Use the **source platform's native status vocabulary** in all output.
Do NOT translate ADO statuses into GitHub terms or vice versa.

#### Document Mode (`output_mode: document`)

Produce the output following the `pr-comment-responses` format:
1. Thread Summary (by state; use the platform's status table)
2. Contradiction Report
3. Per-Thread Responses (in file order; PR-wide threads grouped at
   the end on ADO)
4. Action Summary

#### Action Mode (`output_mode: action`)

Execute responses with **mandatory user confirmation at every step**.
The orchestration is identical across platforms; only the API calls
differ.

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

4. **For each thread with an explanation, post the reply.**
   For each thread:
   a. Show the draft reply to the user.
   b. Ask: "Post this reply? (yes / skip / edit)"
   c. If confirmed, post using the platform-appropriate API:

   **GitHub** — write the reply payload to `reply.json` and POST:
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

   **Azure DevOps Services** — write the reply payload to `reply.json`
   and POST. Always use a temp file (not an inlined `--body '...'`
   string): real reply text contains apostrophes, newlines, and
   backslashes that break shell quoting in both bash and PowerShell.
   ```json
   {
     "content": "<reply text>",
     "parentCommentId": <comment_id>,
     "commentType": "text"
   }
   ```
   ```bash
   az rest --resource 499b84ac-1321-427f-aa17-267ca6975798 \
     --method POST \
     --uri "https://dev.azure.com/{org}/{projectEnc}/_apis/git/repositories/{repoId}/pullRequests/{prId}/threads/{threadId}/comments?api-version=7.1" \
     --headers "Content-Type=application/json" \
     --body @reply.json
   ```

   ADO replies MUST always include `parentCommentId` — choose the
   specific comment being answered. For PR-wide (general) threads,
   reply to the latest text comment in the thread (or the first
   comment if the thread has only one). Do NOT omit `parentCommentId`
   to post an unparented top-level comment — it changes the semantics
   from "reply" to "new top-level remark" and breaks the API
   contract used elsewhere in this template.

5. **For threads that were addressed, update thread status.**
   Map the user's intent to the appropriate platform-native status:

   | User intent after addressing a thread | GitHub action | ADO action |
   |---|---|---|
   | Code fix applied, issue addressed | resolve | set status to `fixed` |
   | Explanation posted, user wants discussion closed | resolve | set status to `closed` |
   | Explanation posted, leave open for reviewer reply | (no change) | leave `active` |
   | Concern noted, team chooses not to act | (no change; reply explains) | set status to `wontFix` |
   | Reviewer's concern is intentional design | (no change; reply explains) | set status to `byDesign` |

   For each affected thread, ask the user to confirm the intended
   transition before executing.

   **GitHub** — resolve the thread:
   ```
   gh api graphql \
     -f query='mutation($threadId: ID!) {
       resolveReviewThread(input: {threadId: $threadId}) {
         thread { isResolved }
       }
     }' \
     -F threadId="<thread_id>"
   ```

   **Azure DevOps Services** — PATCH the thread status (use the
   exact lowercase enum value: `active`, `pending`, `fixed`,
   `wontFix`, `closed`, `byDesign` — note ADO uses `fixed`, NOT
   GitHub's `resolved`):
   ```bash
   az rest --resource 499b84ac-1321-427f-aa17-267ca6975798 \
     --method PATCH \
     --uri "https://dev.azure.com/{org}/{projectEnc}/_apis/git/repositories/{repoId}/pullRequests/{prId}/threads/{threadId}?api-version=7.1" \
     --headers "Content-Type=application/json" \
     --body '{ "status": "fixed" }'
   ```

6. **Never take any action without explicit user confirmation.**
   If the user skips all items, produce a document-mode report instead.

### Phase 6: Handle Edge Cases

- **No actionable threads**: Report "No actionable review threads found"
  and list any skipped threads (in the platform's native vocabulary —
  GitHub `resolved`, ADO `fixed` / `closed` / `wontFix` / `byDesign`;
  outdated / potentially outdated; ADO system threads) with counts
  for reference.
- **Large thread count (>20)**: Process in batches of 10. After each
  batch, summarize progress and ask to continue.
- **Outdated / potentially outdated threads**: Flag these separately.
  Ask the user whether to address them — the code may have already
  changed to address the feedback.
- **Threads on deleted files**: Skip with a note explaining the file
  no longer exists. On ADO, this is also a signal that the thread is
  potentially outdated.
- **ADO system threads**: Always exclude from analysis; report only
  the count in the summary.
- **ADO PR-wide threads**: Process them, but group them in a separate
  "PR-wide threads" section in the report — they have no file/line
  context.
- **Unsupported ADO host** (Server / on-prem / TFS): Stop with a
  clear message; do not attempt to call APIs against an unsupported
  endpoint.
- **`az rest` 401/403**: Most often caused by missing `--resource`,
  expired `az login`, or insufficient permissions on the project.
  Tell the user which of these to check; do NOT fall back to
  recommending a PAT.

## Non-Goals

- Do NOT perform a new code review — focus only on addressing
  existing feedback.
- Do NOT modify code beyond what is needed to address review comments.
- Do NOT update thread status without user confirmation.
- Do NOT dismiss or ignore valid feedback — if a reviewer is correct,
  acknowledge it and fix it.
- Do NOT take sides in contradictions — present both positions and
  let the user decide.
- Do NOT push commits without explicit user confirmation.
- Do NOT translate or normalize statuses across platforms — use each
  platform's native vocabulary.
- Do NOT instruct the user to create a Personal Access Token for ADO;
  rely on `az login` + `az rest --resource`.
- Do NOT attempt to support Azure DevOps Server (on-prem) or TFS
  with this template's auth path.

## Quality Checklist

Before finalizing, verify:

- [ ] Platform was detected (or the user was asked) before any API call
- [ ] Every actionable thread has a response (fix, explanation, or both)
- [ ] Contradictions across reviewers are explicitly flagged
- [ ] Code fixes show before/after with sufficient context
- [ ] Draft replies are professional, concise, and technical
- [ ] All non-actionable threads (GitHub `resolved`; ADO `fixed` /
      `closed` / `wontFix` / `byDesign`; outdated / potentially
      outdated; ADO system threads) are accounted
      for with platform-native status names and counts
- [ ] In action mode: user confirmation obtained before every mutation
- [ ] Thread states are reported using the source platform's native
      vocabulary (no cross-platform normalization)
- [ ] On ADO: every `az rest` invocation includes
      `--resource 499b84ac-1321-427f-aa17-267ca6975798`
- [ ] On ADO: status PATCH payloads use the exact lowercase enum
      values (`active`, `pending`, `fixed`, `wontFix`, `closed`,
      `byDesign`)
- [ ] On ADO: reply POST bodies use `content` + `parentCommentId` +
      `commentType: "text"` (NOT GitHub's `body` / `in_reply_to`)
- [ ] Files modified by fixes are listed in the action summary
