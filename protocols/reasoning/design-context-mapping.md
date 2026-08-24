<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: design-context-mapping
type: reasoning
description: >
  Pre-review reasoning protocol for discovering repository standards and
  mapping changed modules to relevant design documents. Covers standards
  inventory, design-doc discovery, file-to-doc matching, and explicit
  handling of gaps when no governing design exists.
applicable_to: []
# User-composed protocol — not auto-included by any template.
# Intended for: code review, pull request review, and design-alignment
# audits that need repo-local standards and architecture context.
---

# Protocol: Design Context Mapping

Apply this protocol before reviewing code that may be governed by
repository-specific standards or design documents. The goal is to ground
the review in the project's own rules and intended architecture instead of
reviewing the diff in isolation.

## Phase 1: Standards Inventory

Identify repository-local standards that define review expectations.

1. Search the repo root and documentation roots for standards-bearing
   files such as `CONTRIBUTING`, `README`, `GEMINI.md`, `CLAUDE.md`,
   architecture guides, coding-standard docs, and reviewer playbooks.
2. For each candidate file, determine whether it is:
   - **Mandatory**: explicit "must", "always", policy, CI gate, or
     contribution rule
   - **Advisory**: guidance, style preference, or example-based practice
3. Extract only the rules relevant to the review task:
   - Build/test expectations
   - Language-specific coding rules
   - Architectural constraints
   - Review-specific requirements (tests, docs, commit hygiene, safety rules)
4. Produce a standards list with path, authority level, and the exact
   review behaviors it governs.

## Phase 2: Design Document Discovery

Discover the documents that describe intended behavior or architecture.

1. Search likely design locations such as `designs/`, `docs/design/`,
   `docs/architecture/`, `rfcs/`, `architecture/`, and subsystem-specific
   design folders.
2. Record each candidate document's scope:
   - Whole-system architecture
   - Subsystem design
   - Feature-specific behavior
   - Workflow or operational design
3. If an index or umbrella design document exists, read it first to avoid
   missing the repository's own terminology and document hierarchy.
4. Exclude stale or irrelevant docs only with evidence:
   - Superseded by a newer named document
   - Clearly unrelated subsystem
   - Historical/archive material marked obsolete

## Phase 3: Change-to-Context Mapping

Map the changed files or modules to the most relevant standards and
design documents.

1. Build a change inventory:
   - Changed file paths
   - Named modules, packages, or subsystems touched
   - Public interfaces, configs, or workflows affected
2. For each changed area, score candidate context matches:
   - **Direct match**: exact subsystem, feature name, or owning directory
   - **Partial match**: same architecture layer or adjacent module
   - **No match**: no design doc or standard clearly governs the change
3. Use multiple signals when scoring:
   - Path overlap
   - Shared terminology in headings or section titles
   - Explicit references between code and docs
   - Ownership or boundary descriptions in architecture docs
4. If multiple docs conflict, record the conflict and prefer the newest
   or most specific document only when the evidence is explicit.

## Phase 4: Context Loading Strategy

Load only the context needed to review accurately.

1. Read the highest-confidence standards and design docs for each changed
   area before starting substantive review.
2. When a broad architecture doc exists plus a feature doc, read both:
   architecture first for boundaries, feature doc second for intent.
3. If no matching design doc exists:
   - State that absence explicitly
   - Continue the review against code, tests, and standards only
   - Do not fabricate intended architecture from naming alone
4. If the available context is too broad, prioritize sections that define:
   - Invariants
   - API contracts
   - State transitions
   - Resource ownership
   - Expected tests or validation signals

## Phase 5: Review Framing Output

Produce a compact context map before the main review.

1. Summarize which standards files govern the review and what rules they
   impose.
2. Summarize which design docs map to which changed modules.
3. Record uncovered areas:
   - Changed code with no governing design doc
   - Design docs found but not read due to scope limits
   - Conflicts or ambiguity requiring user judgment
4. Use this map to drive later design-alignment findings. If a change
   violates a mapped design, cite the exact document section. If no design
   exists, do not report a design-alignment violation.

## Output Format

Produce a context map in this form before the main review:

```markdown
## Review Context Map

### Standards
| Path | Authority | Relevant Rules |
|------|-----------|----------------|

### Design Mapping
| Changed Area | Matched Document | Match Strength | Why |
|--------------|------------------|----------------|-----|

### Gaps and Ambiguities
- <explicitly note missing or conflicting design context>
```
