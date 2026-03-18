<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) Standard Prompt Library Contributors -->

---
name: multi-artifact
type: format
description: >
  Output format for tasks that produce multiple deliverable files
  rather than a single document. Defines artifact manifests,
  per-artifact schemas, and cross-artifact consistency rules.
produces: artifact-set
---

# Format: Multi-Artifact Output

Use this format when the task requires producing **multiple distinct
deliverable files** rather than a single document. This is common for
investigation tasks (structured data + human-readable report + coverage log),
implementation plans (task breakdown + dependency graph + risk matrix),
and audit workflows.

## Artifact Manifest

The output MUST begin with an artifact manifest listing all deliverables:

```markdown
# Deliverables

| Artifact | Format | Purpose |
|----------|--------|---------|
| <filename.ext> | <JSONL/Markdown/CSV/etc.> | <what it contains and who consumes it> |
| <filename.ext> | <format> | <purpose> |
...
```

## Per-Artifact Structure

Each artifact MUST include:

1. **Header comment or frontmatter** identifying it as part of the output set.
2. **Internally consistent structure** — if it is JSONL, every line must
   parse as valid JSON with the same schema. If it is Markdown, it must
   follow a stated section structure.
3. **Cross-references** — when artifacts reference each other (e.g., a
   report references items in a data file), use stable identifiers
   that appear in both artifacts.

## Structured Data Artifacts

For machine-readable artifacts (JSONL, JSON, CSV):

- Define the **schema** before emitting data:
  ```
  Schema: { field1: type, field2: type, ... }
  ```
- Every record MUST conform to the stated schema.
- Include all fields even if null — do not omit fields for sparse records.
- Use stable identifiers (e.g., `id`, `finding_id`) that other artifacts
  can reference.

## Human-Readable Artifacts

For reports, summaries, and analysis documents:

- Follow the relevant SPL format (investigation-report, requirements-doc, etc.)
  OR define a custom structure in the task template.
- Every claim MUST reference evidence by identifier from the structured
  data artifact (e.g., "see call site CS-042 in boundary_callsites.jsonl").

## Coverage Artifact

When the task involves searching or scanning, include a coverage artifact:

```markdown
# Coverage Report

## Scope
- **Target**: <what was being searched/analyzed>
- **Method**: <exact commands, queries, or scripts used>

## What Was Examined
<List of directories, files, or areas analyzed>

## What Was Excluded
<List of areas intentionally not examined, with rationale>

## Reproducibility
<Exact steps a human can follow to reproduce the enumeration>
```

## Cross-Artifact Consistency Rules

- Identifiers used in structured data (e.g., finding IDs, call site IDs)
  MUST appear consistently across all artifacts that reference them.
- Counts must agree: if the data file contains 47 items, the summary
  must not claim 50.
- Severity or priority rankings must be consistent between the data
  artifact and the human-readable report.
