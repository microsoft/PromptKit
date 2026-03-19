<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: release-notes
type: format
description: >
  Structured release notes with changelog, breaking changes, upgrade
  instructions, and contributor acknowledgment.
produces: release-notes
---

# Format: Release Notes

The output MUST be structured release notes ready for publication.
Suitable for GitHub Releases, Azure DevOps wiki, or any changelog format.

## Output Structure

### 1. Release Header

- **Version**: semantic version (e.g., v2.3.0)
- **Date**: release date
- **Release type**: Major / Minor / Patch / Pre-release
- **Summary**: 1–2 sentence description of this release

### 2. Highlights

Bullet list of the 3–5 most important changes, written for the target
audience. Focus on user-facing impact, not implementation details.

### 3. Breaking Changes

If any breaking changes exist, list them prominently:

- **What changed**: specific API, behavior, or configuration that changed
- **Migration action**: what the user must do to adapt
- **Reason**: why the breaking change was made

If no breaking changes, state: "No breaking changes in this release."

### 4. Changelog

Group changes by category using these standard headings:

#### Added
New features or capabilities.

#### Changed
Changes to existing functionality.

#### Fixed
Bug fixes.

#### Deprecated
Features that will be removed in a future release.

#### Removed
Features removed in this release.

#### Security
Security-related changes or vulnerability fixes.

Each entry should follow the format:
- **Brief description** — context or detail. (#PR-number or commit ref)

### 5. Upgrade Instructions

Step-by-step instructions for upgrading from the previous version:
1. Prerequisites or preparation steps
2. Upgrade commands or procedures
3. Post-upgrade verification steps
4. Rollback procedure if issues arise

### 6. Known Issues

Issues known to exist in this release that are not yet resolved.
If none, state: "No known issues."

### 7. Contributors

Acknowledge contributors to this release (if data available).

## Formatting Rules

- Use [Keep a Changelog](https://keepachangelog.com/) conventions
  for the changelog section
- Every section must be present; if not applicable, state "Not applicable"
- PR/issue references should be hyperlinked where possible
- Write for the target audience: avoid jargon if audience is non-technical
- Do not omit sections
