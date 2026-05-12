<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: review-pull-request
description: >
  Review a pull request's diff, commits, and linked issues to produce
  a structured code review. Supports document mode (investigation report)
  or action mode (post inline review comments via GitHub API).
  Language-agnostic by default with optional language-specific focus.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - guardrails/human-voice-fidelity
format: investigation-report
params:
  pr_reference: "Pull request to review — URL, number (e.g., #42), or pasted diff"
  review_focus: "What to focus on — e.g., correctness, security, performance, all"
  language_focus: "Optional — primary language(s) for language-specific analysis (e.g., C, TypeScript)"
  additional_protocols: "Optional — specific protocols to apply (e.g., memory-safety-c, thread-safety)"
  context: "What this PR does, which system it affects, any known concerns"
  output_mode: "Output mode — 'document' (produce investigation report) or 'action' (post review comments via gh CLI)"
  change_narrative: "Whether to include a holistic change narrative explaining what the PR is actually doing — 'auto' (default; produced for broad-scope or large PRs based on diff size, breadth, and impact signals), 'always', or 'never'. Blank or invalid values are treated as 'auto'."
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A structured code review report with per-finding severity,
    file/line references, and an overall verdict. In action mode,
    findings are posted as inline review comments on the PR.
---

# Task: Review Pull Request

You are tasked with performing a thorough **code review** of a pull
request, analyzing the changes in context — not just the code in
isolation, but the diff, commit history, linked issues, and CI status.

## Inputs

**Pull Request**: {{pr_reference}}

**Review Focus**: {{review_focus}}

**Language Focus**: {{language_focus}}

**Additional Protocols to Apply**: {{additional_protocols}}

**Context**: {{context}}

**Output Mode**: {{output_mode}}

**Change Narrative Mode**: {{change_narrative}}

## Instructions

### Phase 1: Gather PR Context

1. **Read the PR metadata**:
   - Title, description, and linked issues or work items
   - Author and reviewers
   - Target branch and source branch
   - CI/CD status (passing, failing, pending)
   - Existing review comments and their resolution state
   - PR labels and milestone

2. **Read the diff**:
   - Use `gh pr diff` or equivalent to obtain the full diff
   - Note which files are added, modified, and deleted
   - Note the total size (files changed, lines added/removed)

3. **Read linked issues** (if any):
   - What problem does this PR claim to solve?
   - What acceptance criteria are stated?
   - Use linked issues to evaluate whether the PR actually addresses
     the stated goals

4. **If language focus is specified**, identify which additional analysis
   protocols are relevant (e.g., `memory-safety-c` for C,
   `thread-safety` for concurrent code). Apply these in Phase 2.

5. **Establish Change Narrative** (when applicable per `change_narrative`).

   **Normalization.** If `change_narrative` is blank, unset, or not one
   of `auto`, `always`, or `never`, treat it as `auto`. This guards
   against missing values when the template is packaged as a Copilot
   prompt file or agentic workflow.

   **Determine scope:**
   - `never` — skip the rest of this step.
   - `always` — produce the narrative.
   - `auto` (default) — produce the narrative when **any** of these
     triggers fire:
     - **Size signals**: more than ~300 lines changed (additions +
       deletions, excluding lockfiles, generated code, and vendored
       deps), OR more than ~15 source files modified (same exclusions).
       If exact filtered counts are unavailable, estimate
       conservatively rather than spending excessive effort calculating.
     - **Breadth signals**: the PR touches multiple unrelated subsystems
       (e.g., distinct top-level code roots that don't simply mirror
       each other like `src/` and `tests/`).
     - **Impact signals**: the PR introduces public API or interface
       changes, schema or data-model changes, auth / permission /
       security changes, CI or deployment / infrastructure changes, or
       broad dependency or configuration changes.
     - **Description-gap signals**: the PR description is sparse
       (< 2 short paragraphs) AND total change exceeds 100 LOC.

   **Skip condition (`auto` only):** even when a trigger fires, skip
   the narrative if the PR description already provides a clear,
   accurate change overview AND the diff does not reveal materially
   different scope from what the description claims.

   **Compose narrative** (1–3 paragraphs, ≤ ~300 words). Answer:
   - **What** the PR changes functionally (user-visible behavior, API
     surface, data model)
   - **How** it changes things architecturally (key restructurings,
     new modules, removed code paths)
   - **Why**, per the PR description and linked issues — state the
     author's stated motivation; do not speculate beyond it
   - **Scope boundaries** — what is *not* changed despite appearing
     in the diff (generated files, formatting-only edits, vendored deps)

   Ground every narrative claim in the diff, PR description, linked
   issues, or context files you read. Omit ungrounded claims.

   **Compose suggested focus areas** (1–5 bulleted items; omit element
   when none warrant calling out). Produce only when the narrative was
   produced above; otherwise omit. For each item state:
   - The specific file path(s) or module — do not generalize
   - The motivating signal: an **impact signal** that fired in the
     trigger evaluation above (public API, schema, auth, CI/deploy,
     broad deps), OR an observable **concentration of complexity** in
     the diff (e.g., a single file with disproportionate change density
     or intricate logic)
   - The **risk angle** in one short phrase (correctness, safety,
     security, or test coverage)

   Identify focus areas only when at least one of the conditions above
   holds. If neither an impact signal fired nor concentration of
   complexity is observable, omit the focus-areas element rather than
   fabricating items. Focus areas are advisory pointers for reviewer
   attention; they do **not** reduce required Phase 2 coverage — every
   changed file remains subject to analysis regardless of whether it
   appears in the focus list.

   **Format requirement.** If either the narrative or the focus areas
   were produced, the report MUST use the **full** investigation-report
   format (so the `Problem Statement` section is present), regardless
   of finding count or severity. This overrides the format's default
   abbreviated-vs-full selection rule.

   Internally record whether the narrative was produced and, in `auto`
   mode, which trigger fired (or why it was skipped). In document mode,
   surface this briefly in the Coverage section in Phase 5. In action
   mode, the narrative (if produced) is shown to the user during step 1
   of the action flow; no Coverage-section recording applies.

### Phase 2: Analyze Changes

Apply the **anti-hallucination protocol** throughout — base your review
ONLY on the code visible in the diff and any files you read for context.
Do not assume behaviors not visible in the code.

For each changed file, evaluate:

#### Correctness
- Does the change accomplish what the PR description claims?
- Are edge cases introduced or left unhandled by the change?
- Do the changes break any existing behavior? Check callers and
  dependents of modified functions.
- Are return values and error codes handled correctly in new code?
- If the PR links to an issue, does the change actually fix it?

#### Safety
- Are there memory safety issues introduced by the change?
- Are there concurrency issues (data races, deadlocks) in new code?
- Are there resource leaks introduced (file handles, connections)?
- Does the change affect initialization or cleanup paths?

#### Security
- Is new input validated before use in sensitive operations?
- Are there injection risks introduced (SQL, command, path traversal)?
- Are secrets or credentials handled appropriately?
- Does the change widen the attack surface?

#### Change Quality
- Is the commit history clean and logical? (atomic commits,
  meaningful messages, no "fix typo" chains)
- Is the diff minimal — does it change only what is necessary?
- Are there unrelated changes bundled in?
- Is there adequate test coverage for the new behavior?
- Are documentation and comments updated to reflect the change?

#### If additional protocols are specified
- Apply each specified protocol (e.g., `memory-safety-c`,
  `thread-safety`) systematically to the changed code.

### Phase 3: Produce Findings

Format each finding as:

```
[SEVERITY: Critical|High|Medium|Low|Informational]
File: <file path>
Line: <line number or range in the diff>
Issue: <concise description>
Evidence: <code snippet from the diff or reasoning>
Suggestion: <specific fix or improvement>
```

Group findings by file, ordered by severity within each file.

### Phase 4: Verdict

Produce an overall assessment:

- **Approve**: No Critical or High findings. Medium/Low findings
  are acceptable or easily addressed.
- **Approve with suggestions**: No Critical findings. High findings
  are minor or have clear fixes. Include specific suggestions.
- **Request changes**: Any Critical finding, or multiple High findings
  that indicate systemic issues. State what must change before approval.

Summarize:
- Total findings by severity
- Top 3 findings ranked by impact
- Whether the PR achieves its stated goal (per linked issues)
- Whether test coverage is adequate for the changes

### Phase 5: Output

#### Document Mode (`output_mode: document`)

Produce the output following the `investigation-report` format. Map
PR review concepts to report sections:

| Report Section | PR Review Content |
|---|---|
| Executive Summary | Overall verdict + key findings (2–4 sentences per format) |
| Problem Statement | What the PR claims to change and why. When the change narrative was produced in Phase 1, lead this section with the holistic narrative, then the suggested focus areas (if any were produced), then state the author's motivation. |
| Investigation Scope | Files changed, diff size, linked issues |
| Findings | Per-file findings with severity |
| Root Cause Analysis | Omit or use for systemic patterns |
| Remediation Plan | Suggested fixes ordered by priority |
| Prevention | Process suggestions (testing, CI checks) |
| Open Questions | Ambiguities in the PR or linked issues |
| Coverage | Files examined, search method, exclusions, limitations. In `auto` mode for `change_narrative`, briefly note whether the change narrative was produced and the triggering condition (or reason for skipping). |

#### Action Mode (`output_mode: action`)

1. **Present findings** to the user using the document structure above.
   If a change narrative or suggested focus areas were produced in
   Phase 1, present them (from `Problem Statement`) before walking
   through individual findings.
2. **Ask the user to confirm** which findings to post as review comments.
   Present each finding (or batch by file) and ask:
   - Post this comment? (yes / skip / edit)

   Apply the **human-voice-fidelity** protocol when drafting the
   inline comment `body` and the overall review summary `body` —
   these are posted to GitHub under the user's identity. Run the
   protocol's Phase 4 self-check on each drafted comment before
   presenting (see the protocol for the exact rules; do not restate
   them here to avoid drift). The protocol scopes to drafted prose
   only; code references, file paths, and quoted reviewer text are
   exempt.
3. **Post confirmed findings** as inline review comments using a JSON
   payload file so `comments` is sent as an array, not a string.

   **Constructing the `body` field**: the review `body` is the
   overall verdict summary (findings + recommended review event).
   Do NOT prepend the Phase 1 change narrative or suggested focus
   areas — the PR author already wrote the PR description, and
   reviewer feedback should focus on the verdict, not on re-describing
   the change. These are reviewer-internal grounding artifacts; do not
   add them to the body unless the user explicitly requests it as part
   of confirming the review.

   ```
   cat > review.json <<'EOF'
   {
     "body": "<overall summary>",
     "event": "<APPROVE|REQUEST_CHANGES|COMMENT>",
     "commit_id": "<PR head SHA>",
     "comments": [
       {
         "path": "path/to/file.ext",
         "body": "<inline review comment>",
         "line": 123,
         "side": "RIGHT"
       }
     ]
   }
   EOF

   gh api repos/{owner}/{repo}/pulls/{pr_number}/reviews \
     --method POST \
     --input review.json
   ```
   Fetch the head SHA with `gh pr view {pr_number} --json headRefOid --jq .headRefOid`
   before constructing the payload. Each inline comment object must include
   `path` and comment `body`, plus the review location fields required by
   GitHub's API: typically `line` and `side` for a diff comment on the new code.
4. **Never post without explicit user confirmation.** If the user skips
   all findings, do not submit a review.

## Non-Goals

- Do NOT refactor the code — identify issues, do not rewrite.
- Do NOT review code outside the PR diff unless it is directly called
  by or affected by the changed code.
- Do NOT comment on personal style preferences — focus on correctness,
  safety, security, and change quality.
- Do NOT merge the PR programmatically. The verdict is advisory. In
  action mode, you may post an `APPROVE`, `REQUEST_CHANGES`, or `COMMENT`
  review only after explicit user confirmation, and you must not merge.
- Do NOT modify the PR branch or push commits.
- Do NOT speculate in the change narrative or suggested focus areas
  beyond what is visible in the diff, PR description, or linked
  issues — including author intent that is not explicitly stated.
- Do NOT use suggested focus areas to reduce Phase 2 coverage. Focus
  areas advise reviewer attention only; every changed file remains
  subject to analysis.

## Quality Checklist

Before finalizing, verify:

- [ ] Every finding cites a specific file and line from the diff
- [ ] Every finding has a severity rating
- [ ] Every finding includes a concrete fix suggestion
- [ ] Findings are grouped by file and ordered by severity
- [ ] The verdict is consistent with the findings
- [ ] Linked issues were checked against the actual changes
- [ ] CI status was noted (or stated as unavailable)
- [ ] At least 3 findings have been re-verified against the diff
- [ ] In `auto` mode for `change_narrative`, the decision to produce or skip the change narrative was made deliberately; in document mode, the decision is also recorded in the Coverage section
- [ ] If the change narrative was produced, every claim in it is grounded in the diff, PR description, linked issues, or context files (no speculation about author intent)
- [ ] If suggested focus areas were produced, each item is anchored to an observable impact signal that fired or to concentration of complexity in the diff (no fabrication)
- [ ] In action mode: user confirmation was obtained before every post
