<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: triage-pull-requests
description: >
  Triage open pull requests to identify which need review, are stale,
  have conflicts, or are ready to merge. Prioritize review effort.
persona: devops-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: triage-report
params:
  platform: "DevOps platform (e.g., 'GitHub', 'Azure DevOps', 'GitLab')"
  repository: "Repository or project identifier"
  scope: "What to triage (e.g., 'all open PRs', 'PRs older than 7 days', 'PRs targeting main')"
  criteria: "Review prioritization criteria (e.g., 'release branch PRs first', 'security fixes', 'size-based')"
  context: "Additional context — team review capacity, release deadlines, code owners"
  audience: "Who will act on this triage (e.g., 'engineering team', 'tech lead', 'release manager')"
input_contract: null
output_contract:
  type: triage-report
  description: >
    A prioritized triage report classifying pull requests by review
    urgency, identifying blockers and stale PRs, with a recommended
    review workflow.
---

# Task: Triage Pull Requests

<!--
  NOTE: This template is intentionally parallel to triage-issues.
  Both share the same persona, protocols, and format. They differ only in
  artifact-type vocabulary (pull requests vs. issues) and in the specific
  metadata fields, health signals, and workflow recommendations appropriate
  for each item type. The duplication is deliberate — merging them would
  require conditional logic that reduces prompt clarity.
-->

You are tasked with triaging open pull requests for the following
repository to prioritize review effort and identify blockers.

## Inputs

**Platform**: {{platform}}

**Repository / Project**: {{repository}}

**Scope**: {{scope}}

**Prioritization Criteria**: {{criteria}}

**Additional Context**: {{context}}

## Instructions

1. **Gather the pull requests** within the specified scope. For each PR, note:
   - Title, number, and author
   - Target branch and source branch
   - Age (time since creation) and last activity date
   - Review status (approved, changes requested, no reviews, pending)
   - CI/CD status (passing, failing, pending)
   - Merge conflicts (yes / no)
   - Size (files changed, lines added/removed)
   - Labels and linked issues

2. **Apply the anti-hallucination protocol** throughout:
   - Classify ONLY based on available PR metadata and content
   - Do NOT assume PR quality from title or size alone
   - If CI status or review status is unavailable, state it as "Unknown"

3. **Classify each pull request** by review priority:
   - **Critical**: Blocks a release, fixes a security vulnerability, or
     addresses a production incident. Review immediately.
   - **High**: Significant feature or bug fix with passing CI, ready for
     review. Time-sensitive or has been waiting > 3 days.
   - **Medium**: Standard changes with passing CI. Normal review priority.
   - **Low**: Draft PRs, minor changes, or PRs with failing CI that the
     author needs to fix first.

4. **Identify PR health signals**:
   - **Ready to merge**: Approved, CI passing, no conflicts
   - **Needs review**: No reviews yet, CI passing, not a draft
   - **Needs author action**: Changes requested, CI failing, or has conflicts
   - **Stale**: No activity for > 14 days (configurable)
   - **At risk**: Large PRs (>500 lines) that may need to be split

5. **Identify patterns** across the PR backlog:
   - Review bottlenecks (PRs waiting on specific reviewers)
   - Frequently failing CI (same tests, same infrastructure issues)
   - PRs that should be consolidated or depend on each other
   - Authors with multiple open PRs (context-switching risk)

6. **Recommend a review workflow**:
   - Which PRs to review first and why
   - Which PRs are ready to merge immediately
   - Which PRs should be sent back to the author
   - Which PRs should be closed (stale, superseded, abandoned)

7. **Format the output** according to the triage-report format specification.

8. **Apply the self-verification protocol** before finalizing:
   - Verify every in-scope PR is classified
   - Verify health signals match the available metadata
   - Confirm the recommended workflow is actionable

## Non-Goals

- Do NOT perform the code review itself — only triage and prioritize.
- Do NOT merge or approve any pull requests.
- Do NOT modify PR labels or assignments unless explicitly asked.
- Do NOT assess code quality — focus on review logistics and priority.

## Quality Checklist

Before presenting the triage report, verify:

- [ ] All in-scope PRs are accounted for
- [ ] Every PR has a priority and health signal classification
- [ ] Critical and High PRs have written justifications
- [ ] Stale and at-risk PRs are explicitly called out
- [ ] Recommended workflow is ordered and actionable
- [ ] Coverage and limitations section is populated
