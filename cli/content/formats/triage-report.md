<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: triage-report
type: format
description: >
  Prioritized triage report for issues, pull requests, or work items.
  Classifies items by priority, effort, and recommended action.
produces: triage-report
---

# Format: Triage Report

The output MUST be a structured, prioritized triage report. Every item
must be classified and actionable.

## Output Structure

### 1. Executive Summary

- **Total items triaged**: count
- **Breakdown by priority**: Critical / High / Medium / Low counts
- **Key findings**: 2–3 sentences on the most important patterns or
  urgent items
- **Recommended immediate actions**: top 3–5 actions to take now

### 2. Triage Criteria

Describe the criteria used to classify items:
- **Priority** (Critical / High / Medium / Low): what makes an item
  each level
- **Effort** (Small / Medium / Large): estimation basis
- **Staleness**: how long the item has been open, last activity date
- Any domain-specific criteria applied

### 3. Prioritized Item List

Present items in a table, ordered by priority (Critical first):

| # | Item | Title | Priority | Effort | Age | Recommended Action |
|---|------|-------|----------|--------|-----|--------------------|
| 1 | #123 | ...   | Critical | Small  | 3d  | Fix immediately — blocking release |

For each Critical or High item, include a 1–2 sentence justification
below the table explaining why it was classified at that level.

### 4. Patterns and Observations

Identify cross-cutting patterns:
- Are there clusters of related issues?
- Are certain components or areas disproportionately affected?
- Are there stale items that should be closed?
- Are there items that are duplicates or should be consolidated?

### 5. Recommended Workflow

Suggest a prioritized workflow for addressing the triaged items:
1. What to tackle first and why
2. What can be batched together
3. What can be deferred or closed
4. What needs more information before action

### 6. Coverage and Limitations

- What was examined (e.g., "all open issues as of <date>")
- What was excluded and why
- Confidence level in prioritization

## Formatting Rules

- Items MUST be ordered by priority, then by age (oldest first within
  the same priority level)
- Every item MUST have all table columns populated; use "Unknown" if
  data is unavailable
- Do not omit sections; if a section has no content, state "None identified"
