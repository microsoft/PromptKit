<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: spl-pull-request
type: format
description: >
  Output format for SPL contributions. Produces PR-ready component
  files, a manifest update, and a pull request description.
produces: spl-contribution
---

# Format: SPL Pull Request

The output MUST be a complete, PR-ready set of files and a pull
request description. Every file must be ready to commit — no
placeholders, no TODOs, no incomplete sections.

## Output Structure

### 1. Component Files

For each new component, produce the **complete file content** with:

- SPDX license header at the top
- Valid YAML frontmatter with all required fields
- Full body content following the conventions for that component type

Present each file as:

    ### File: <path relative to repo root>

    ```markdown
    <complete file content>
    ```

### 2. Manifest Update

Show the **exact additions** to `manifest.yaml`:

    ### Manifest additions (add to manifest.yaml)

    ```yaml
    <YAML fragment to insert, with a comment indicating where it goes>
    ```

### 3. Pull Request Description

Produce a PR description in this format:

```markdown
## Summary

<1-2 sentences: what this PR adds and why>

## New Components

| Type | Name | Path | Description |
|------|------|------|-------------|
| <persona/protocol/format/taxonomy/template> | <name> | <path> | <one-line description> |

## Design Decisions

<Brief explanation of key decisions made during the design phase:
- Why this persona/protocol/format was needed (or why existing ones suffice)
- What alternatives were considered
- Any tradeoffs made>

## Checklist

- [ ] All files have SPDX license headers
- [ ] YAML frontmatter is valid and complete
- [ ] Component names match file names (kebab-case)
- [ ] manifest.yaml updated with all new components
- [ ] No vague instructions in protocols or templates
- [ ] Protocols have numbered, ordered phases
- [ ] Templates have a quality checklist section
- [ ] New components do not conflict with existing ones
```

## Rules

- Every file MUST be complete and self-contained — a reviewer should
  be able to copy-paste it directly into the repo.
- Do NOT produce partial files with "fill in later" sections.
- Do NOT modify existing files except `manifest.yaml`.
- If the design phase identified that existing components should be
  updated, note this as a **follow-up issue**, not part of this PR.
