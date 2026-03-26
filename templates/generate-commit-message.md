<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: generate-commit-message
description: >
  Generate a structured commit message from staged git changes.
  Analyzes diffs to produce a Problem/Solution format message with
  file change summaries.
persona: software-architect
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: null
params:
  staged_changes: "Output of git diff --staged or description of changes"
  commit_convention: "(Optional) Commit message convention — e.g., 'Conventional Commits', 'Problem/Solution', 'type(scope): description'. Default: Problem/Solution."
  scope_hint: "(Optional) Component or area these changes belong to"
input_contract: null
output_contract:
  type: commit-message
  description: >
    A structured commit message ready for use with git commit.
    Output format is defined inline by this template, not by a
    separate format component.
---

# Task: Generate Commit Message

You are tasked with generating a clear, well-structured commit message
from staged git changes.

## Inputs

**Staged Changes**:
{{staged_changes}}

**Commit Convention**:
{{commit_convention}}

**Scope Hint**:
{{scope_hint}}

## Instructions

1. **Analyze the staged changes**:
   - Read {{staged_changes}} to understand what was modified
   - Group changes by logical concern (e.g., "refactored auth module"
     vs "fixed typo in docs")
   - If changes span multiple unrelated concerns, suggest splitting
     into separate commits

2. **Classify each change**: new feature, bug fix, refactoring,
   documentation, test, build/CI, chore

3. **Generate the commit message** using {{commit_convention}}:

   **Problem/Solution format** (default):
   ```
   [SCOPE] Brief summary of changes (imperative mood, <72 chars)

   Problem:
   Describe the problem, need, or opportunity this change addresses.

   Solution:
   Explain how the changes address the stated problem.

   Changed files:
   - path/to/file.ext: Brief description of what changed
   ```

   **Conventional Commits format** (if specified):
   ```
   type(scope): brief description

   Body explaining the change in detail.

   BREAKING CHANGE: description (if applicable)
   ```

4. **Commit message rules**:
   - Subject line: imperative mood ("Add X" not "Added X"), <72 characters
   - Blank line between subject and body
   - Body wraps at 72 characters
   - Reference issue/PR numbers if mentioned in the changes
   - Only describe files that changed significantly — skip trivial
     or obvious changes

5. **Present for review**: Show the generated message and ask the user
   to confirm or edit before committing.

## Non-Goals

- Do NOT make the commit — only generate the message
- Do NOT analyze unstaged changes — only staged
- Do NOT fabricate change descriptions — base on actual diffs

## Quality Checklist

Before finalizing, verify:

- [ ] Subject line is imperative mood and <72 chars
- [ ] Problem/motivation is clearly stated
- [ ] Solution accurately describes what was done
- [ ] File summaries match actual changes
- [ ] No fabricated change descriptions
