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
| Executive Summary | Overall verdict + key findings |
| Problem Statement | What the PR claims to change and why |
| Investigation Scope | Files changed, diff size, linked issues |
| Findings | Per-file findings with severity |
| Root Cause Analysis | Omit or use for systemic patterns |
| Remediation Plan | Suggested fixes ordered by priority |
| Prevention | Process suggestions (testing, CI checks) |
| Open Questions | Ambiguities in the PR or linked issues |
| Coverage | Files examined, search method, exclusions, limitations |

#### Action Mode (`output_mode: action`)

1. **Present findings** to the user using the document structure above.
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
   payload file so `comments` is sent as an array, not a string:
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
- [ ] In action mode: user confirmation was obtained before every post
