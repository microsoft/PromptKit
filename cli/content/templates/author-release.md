<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-release
description: >
  Generate structured release notes from commits, pull requests, and
  issues between two versions. Produce a changelog, highlight breaking
  changes, and provide upgrade instructions.
persona: devops-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: release-notes
params:
  platform: "DevOps platform (e.g., 'GitHub', 'Azure DevOps', 'GitLab')"
  repository: "Repository or project identifier"
  version: "Version being released (e.g., 'v2.3.0')"
  previous_version: "Previous version to compare against (e.g., 'v2.2.0')"
  changes: "Commits, PRs, or changelog entries between the two versions"
  context: "Additional context — release goals, known issues, deployment notes"
  audience: "Who will read these notes (e.g., 'end users', 'internal engineers', 'API consumers')"
input_contract: null
output_contract:
  type: release-notes
  description: >
    Structured release notes with changelog, breaking changes,
    upgrade instructions, and known issues.
---

# Task: Author Release Notes

You are tasked with generating structured release notes for a new version
release.

## Inputs

**Platform**: {{platform}}

**Repository / Project**: {{repository}}

**Version**: {{version}}

**Previous Version**: {{previous_version}}

**Changes (commits, PRs, issues)**: {{changes}}

**Additional Context**: {{context}}

## Instructions

1. **Analyze the changes** between the two versions:
   - Group commits and PRs by category (Added, Changed, Fixed, Deprecated,
     Removed, Security)
   - Identify breaking changes that require user action
   - Identify highlights — the most impactful changes for the audience
   - Note any linked issues that are resolved

2. **Apply the anti-hallucination protocol** throughout:
   - Describe ONLY changes evidenced in the provided commits/PRs
   - Do NOT fabricate feature descriptions or behavioral claims
   - If a commit message is ambiguous, note the ambiguity rather than
     guessing the intent
   - Reference specific PRs or commits for each change

3. **Write for the target audience**:
   - If the audience is end users, focus on user-facing impact, not
     implementation details
   - If the audience is engineers, include technical details and
     architectural changes
   - If the audience is API consumers, emphasize API changes, deprecations,
     and migration steps

4. **Document breaking changes prominently**:
   - What specifically changed
   - What action users must take to adapt
   - Why the breaking change was necessary
   - If no breaking changes, state so explicitly

5. **Provide upgrade instructions**:
   - Prerequisites and preparation
   - Step-by-step upgrade procedure
   - Post-upgrade verification
   - Rollback procedure

6. **Determine the release type** based on semantic versioning:
   - Major: breaking changes present
   - Minor: new features, no breaking changes
   - Patch: bug fixes only
   - Verify the version number aligns with the changes

7. **Format the output** according to the release-notes format specification.

8. **Apply the self-verification protocol** before finalizing:
   - Verify every listed change maps to a real commit or PR
   - Verify breaking changes are complete — none omitted
   - Confirm the changelog categories are correct
   - Check that the version type matches the content

## Non-Goals

- Do NOT create or tag the release — only generate the release notes.
- Do NOT modify the repository, changelog files, or version numbers.
- Do NOT include changes from outside the specified version range.
- Do NOT editorialize — describe what changed factually.

## Quality Checklist

Before presenting the release notes, verify:

- [ ] Every change cites a specific commit or PR
- [ ] Breaking changes are listed with migration actions
- [ ] Changelog categories follow Keep a Changelog conventions
- [ ] Highlights accurately represent the most impactful changes
- [ ] Upgrade instructions are step-by-step and actionable
- [ ] Version type (major/minor/patch) aligns with the changes
- [ ] Known issues section is populated (or explicitly states "None")
- [ ] Audience-appropriate language is used throughout
