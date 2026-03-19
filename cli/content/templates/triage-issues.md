<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: triage-issues
description: >
  Triage and prioritize open issues or work items from a repository
  or project board. Classify by priority and effort, identify patterns,
  and recommend a workflow.
persona: devops-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: triage-report
params:
  platform: "DevOps platform (e.g., 'GitHub', 'Azure DevOps', 'GitLab')"
  repository: "Repository or project identifier"
  scope: "What to triage (e.g., 'all open issues', 'issues labeled bug', 'items in sprint backlog')"
  criteria: "Prioritization criteria or business context (e.g., 'release blocking', 'customer-facing', 'security')"
  context: "Additional context — team capacity, upcoming deadlines, known priorities"
  audience: "Who will act on this triage (e.g., 'engineering team', 'product manager', 'on-call engineer')"
input_contract: null
output_contract:
  type: triage-report
  description: >
    A prioritized triage report classifying issues by priority and effort,
    with patterns analysis and recommended workflow.
---

# Task: Triage Issues

You are tasked with triaging and prioritizing the open issues or work items
for the following repository or project.

## Inputs

**Platform**: {{platform}}

**Repository / Project**: {{repository}}

**Scope**: {{scope}}

**Prioritization Criteria**: {{criteria}}

**Additional Context**: {{context}}

## Instructions

1. **Gather the issues** within the specified scope. For each issue, note:
   - Title and number
   - Labels, assignees, and milestone (if any)
   - Age (time since creation) and last activity date
   - Body summary — the core problem or request

2. **Apply the anti-hallucination protocol** throughout:
   - Classify ONLY based on the information available in the issue
   - If an issue lacks sufficient detail to classify, flag it as
     "Needs Information" rather than guessing
   - Do NOT infer severity from title alone — read the body and comments

3. **Classify each issue** using the triage criteria:
   - **Priority** (Critical / High / Medium / Low):
     - Critical: blocks a release, causes data loss, or is a security vulnerability
     - High: significant user impact, no workaround, or time-sensitive
     - Medium: moderate impact, workaround exists, or improvement
     - Low: minor inconvenience, cosmetic, or nice-to-have
   - **Effort** (Small / Medium / Large):
     - Small: < 1 day, well-scoped, clear implementation path
     - Medium: 1–3 days, some investigation needed
     - Large: > 3 days, significant design or cross-cutting changes
   - Adjust criteria based on the user's specific prioritization context

4. **Identify patterns** across the triaged items:
   - Clusters of related issues (same component, same root cause)
   - Stale items that should be closed or re-evaluated
   - Duplicates or items that should be consolidated
   - Trends (increasing issues in a specific area)

5. **Recommend a workflow** for addressing the items:
   - What to tackle first (quick wins, blockers, high-impact items)
   - What can be batched together
   - What needs more information before action
   - What can be deferred or closed

6. **Format the output** according to the triage-report format specification.

7. **Apply the self-verification protocol** before finalizing:
   - Verify that every item has a priority and effort classification
   - Verify that Critical/High justifications are grounded in issue content
   - Confirm coverage — are all in-scope items accounted for?

## Non-Goals

- Do NOT fix the issues — only triage and prioritize them.
- Do NOT create new issues or work items.
- Do NOT assign issues to specific people unless explicitly asked.
- Do NOT estimate story points or hours — use Small/Medium/Large effort sizing.

## Quality Checklist

Before presenting the triage report, verify:

- [ ] All in-scope items are accounted for
- [ ] Every item has priority, effort, and recommended action
- [ ] Critical and High items have written justifications
- [ ] Patterns section identifies at least one cross-cutting observation
- [ ] Recommended workflow is actionable and ordered
- [ ] Coverage and limitations section is populated
