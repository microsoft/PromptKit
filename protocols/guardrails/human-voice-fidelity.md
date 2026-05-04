<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: human-voice-fidelity
type: guardrail
description: >
  When drafting externally visible text on behalf of a specific human user
  (PR replies, issue comments, emails, chat messages), preserve the user's
  observed communication style and avoid stylistic patterns that mark text
  as machine-generated.
applicable_to:
  - respond-to-pr-comments
  - review-pull-request
---

# Protocol: Human Voice Fidelity

This protocol applies whenever the output includes text that will be
**posted externally under the user's identity** (e.g., a reply to a PR
review comment, an email draft, a chat message). It does NOT apply to
internal analysis, code, command output, or quoted material from third
parties.

The protocol is opt-in: templates that produce both internal analysis
and externally visible text on the user's behalf should declare this
protocol in their `protocols:` frontmatter.

## Phases

### Phase 1: Source Voice Samples

Voice sources are **pluggable**. Use whichever are available, in
priority order. The recipes below are concrete examples per platform;
the underlying intent is the same — sample the user's recent authored
prose from whichever SCM hosts the project.

1. **Explicit samples pasted by the user** in the current session.
2. **Prior text the user has authored in this repository or project** —
   recent PR/MR review replies, issue/work-item comments, or commit
   messages by the user. Use whichever interface the host SCM provides:

   - **GitHub** (`github.com`): `gh pr list --author @me --state all
     --limit 20`, then `gh pr view <n> --comments` and
     `gh api repos/{owner}/{repo}/pulls/{n}/comments` for inline
     review-thread bodies.
   - **Azure DevOps Services** (`dev.azure.com`,
     `*.visualstudio.com`): query the Pull Requests and Threads REST
     APIs filtered by the user's identity. After `az login`:
     ```bash
     az rest --resource 499b84ac-1321-427f-aa17-267ca6975798 --method GET \
       --uri "https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repoId}/pullrequests?searchCriteria.creatorId={userId}&api-version=7.1"
     az rest --resource 499b84ac-1321-427f-aa17-267ca6975798 --method GET \
       --uri "https://dev.azure.com/{org}/{project}/_apis/git/repositories/{repoId}/pullRequests/{prId}/threads?api-version=7.1"
     ```
     Filter the resulting `comments[*]` to those whose
     `author.uniqueName` matches the user.
   - **GitLab**: `glab mr list --author=@me`, then `glab mr view <n>
     --comments`. Or hit the REST API:
     `GET /projects/:id/merge_requests?author_username=<user>` and
     `GET /projects/:id/merge_requests/:mr/notes`.
   - **Bitbucket Cloud**: REST API
     `GET /2.0/repositories/{ws}/{repo}/pullrequests?q=author.uuid="{uuid}"`,
     then `GET .../pullrequests/{id}/comments`.
   - **Gitea / Forgejo**: REST API
     `GET /repos/{owner}/{repo}/pulls?state=all&poster={user}`, then
     `GET .../issues/{n}/comments`.
   - **Other / unspecified SCM**: detect the host from `git remote -v`
     (or ask the user). If the platform exposes an authenticated API
     or CLI for listing the user's own PRs/MRs and their inline
     comments, use it; the goal is 5–20 recent comment bodies authored
     by the user. If no such interface is available or accessible,
     skip this source and continue with the remaining sources in
     priority order.

   In all cases, prefer **inline review-comment bodies** over commit
   messages — they are closer to the conversational register of the
   text being drafted. Use commit messages only as a fallback.
3. **Prior Copilot CLI session history**, when the agent has access to
   `session_store_sql` or equivalent. Query recent `events` where
   `type = 'user.message'` for natural-language samples.
4. **Organization-specific communication tools**, where available and
   permitted. Examples (non-exhaustive, environment-dependent):
   - Microsoft 365 Copilot / WorkIQ MCP server (`workiq-ask_work_iq`)
     for users in Microsoft tenants
   - Slack / Teams export tools where the user has provided access
   - Any user-provided dump of personal correspondence
5. **Explicit style notes** the user has written down (e.g., a
   `STYLE.md` or `.github/copilot-instructions.md` voice section).

If **no voice sources are available**:

- Ask the user for **2-3 sample replies** they would consider
  representative of their voice.
- If the user declines or cannot provide samples, fall back to a
  **neutral collaborative default** (see Phase 2) and explicitly
  disclose in the output that no voice samples were available.
- **Never claim** to have matched the user's voice without evidence.

### Phase 2: Calibrate Observed Style

From the gathered samples, extract:

- **Sentence length distribution** — short and clipped, medium, or
  long and explanatory.
- **Hedging frequency** — does the user say "I think", "maybe",
  "it looks like" often, or are they direct?
- **Technical density** — heavy jargon, mixed, or plain language.
- **Openers and closers** — do they greet ("hey", "hi @user"), open
  cold, or sign off ("thanks", initials, nothing)?
- **Characteristic phrases** — recurring expressions, idioms, or
  domain shorthand.
- **Punctuation habits** — em-dash usage (likely none for most
  humans), comma density, parenthetical asides.

If samples are inconsistent (e.g., terse in code review, verbose in
docs), pick the subset most relevant to the current output channel
(PR replies → prior PR replies, not docs).

**Neutral collaborative default** (when no samples): short to medium
sentences, no greeting/sign-off, plain language with technical terms
where they belong, no hedging filler, no exclamation points.

### Phase 3: Draft in the Calibrated Voice

When drafting each piece of externally visible text:

- Match observed sentence length, hedging, and technical density.
- Use observed openers and closers (or none if the user uses none).
- Reuse characteristic phrases where they fit naturally; do NOT
  force them.
- Keep the substance accurate — voice fidelity does not override
  technical correctness or anti-hallucination constraints.

### Phase 4: Self-Check Pass

Run this checklist on **every drafted piece of externally visible
text** before presenting it. The check applies to the drafted reply
only, not to surrounding analysis, code blocks, or quoted material.

**Hard rules — failure means rewrite:**

- [ ] No em-dash (U+2014 `—`) anywhere in the drafted text.
- [ ] No en-dash (U+2013 `–`) used as a punctuation separator
      (en-dash in numeric ranges like `2020–2024` is allowed).
- [ ] None of these AI-tell phrases appear unless they appear in the
      user's own samples:
  - "great catch"
  - "great question"
  - "you're absolutely right"
  - "you raise a great point"
  - "I appreciate the feedback"
  - "I hope this helps"
  - "Let me know if you have any other questions"
  - "Certainly!"
  - "Absolutely!"
  - Opening with "I'd be happy to..."
- [ ] No exhaustive bulleted list when 1-2 sentences of prose would
      read more naturally.
- [ ] No unsupported technical claims — every factual statement is
      backed by code, tests, docs, or reviewer text already in
      context.
- [ ] No hedge stack ("I think it might possibly be the case that...")
      unless the user's samples show this pattern.
- [ ] No reflexive apology ("Sorry for the confusion!") unless the
      user uses this in their samples.

**Soft rules — flag for user review if violated:**

- Reply length is within ~1.5x the observed user average for the
  channel.
- Greeting/sign-off matches user habit.
- Opening word/phrase is one the user has used before, or a neutral
  alternative.

### Phase 5: Scope Boundary

This protocol applies **only** to newly drafted text the user will
post under their identity. It does NOT modify, rewrite, or "clean up":

- Reviewer comments quoted in analysis sections
- Code snippets, diffs, or file paths
- Command output, logs, or error messages
- Internal analysis, validity assessments, or technical reasoning
  that the agent presents to the user but does NOT post externally
- Format scaffolding (headings, tables, checklists) defined by the
  output format

If a drafted reply must include quoted reviewer text or a code
snippet, the quoted/code portion is exempt from the em-dash and
phrase rules; only the surrounding user-authored prose is checked.

## Output Annotation

When this protocol is applied, the output should include a brief
**Voice Calibration** note (one or two lines) stating:

- Which voice sources were used (e.g., "5 prior PR replies in repo,
  3 user-provided samples"), or
- That no samples were available and a neutral default was used.

This note is internal-facing and is not posted externally.
