<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

# PromptKit Self-Audit Prompt

Use this prompt to audit PromptKit's own components against
CONTRIBUTING.md conventions. Feed it to an LLM with access to the
repository, or paste the manifest and full component files as context.

## How to Run

### With file access (Copilot, Claude Code)

```
Read and execute tests/self-audit-prompt.md against the PromptKit
repository at the current directory.
```

### Without file access (manual)

1. Paste this prompt into an LLM session
2. Paste the contents of `CONTRIBUTING.md`
3. Paste the contents of `manifest.yaml`
4. For each component referenced in the manifest, paste the **full file
   contents** (not just frontmatter — the audit checks body content
   including numbered phases, quality checklists, and param usage)

---

## Audit Instructions

You are a senior specification analyst auditing PromptKit against its
own CONTRIBUTING.md conventions. Your job is to find every component
that does not follow the documented conventions.

### Inputs

Read the following files from the repository:
- `CONTRIBUTING.md` — the specification (required conventions)
- `manifest.yaml` — the component index

Then check each component file referenced in the manifest.

### Checks to Perform

#### 1. Persona Compliance

For each persona in `manifest.yaml`:
- Does the file exist at the declared `path`?
- Does it have YAML frontmatter with `name`, `description`, `domain`,
  `tone`?
- Does `name` match the filename (kebab-case, without `.md`)?
- Does the body include expertise areas and behavioral constraints?

#### 2. Protocol Compliance

For each protocol in `manifest.yaml`:
- Does the file exist at the declared `path`?
- Does `name` match the filename (kebab-case, without `.md`)?
- Does it have `name`, `type`, `description` in frontmatter?
- Does it have `applicable_to` listing relevant template names
  (or `all` for guardrail protocols)?
- Does `type` match the category directory (`guardrails/` → guardrail,
  `analysis/` → analysis, `reasoning/` → reasoning)?
- Does the body have numbered phases with specific checks?
- Are checks actionable (not vague like "analyze carefully")?

#### 3. Format Compliance

For each format in `manifest.yaml`:
- Does the file exist at the declared `path`?
- Does `name` match the filename (kebab-case, without `.md`)?
- Does it have `name`, `type: format`, `description`, `produces`?
- Does the body include complete document structure?
- Does the body include formatting rules?

#### 4. Template Compliance

For each template in `manifest.yaml`:
- Does the file exist at the declared `path`?
- Does `name` match the filename (kebab-case, without `.md`)?
- Does it have all required frontmatter fields: `name`, `description`,
  `persona`, `protocols`, `format`, `params`, `input_contract`,
  `output_contract`?
- Does the referenced `persona` exist in the manifest's personas list?
- Do the referenced `protocols` exist in the manifest's protocols lists?
- Does the referenced `format` exist in the manifest's formats list?
- If `taxonomies` is declared, do the referenced taxonomies exist?
- Does the body have an **Inputs section** listing all `{{param}}`
  placeholders from frontmatter `params`?
- Does the body have an **Instructions section** with numbered,
  specific steps?
- Does the body have a **Quality checklist** section?
- **Param usage**: For each key in frontmatter `params`, does
  `{{key}}` appear in the template body? Flag params that are declared
  but never used — users will provide values that are silently ignored.

#### 5. Taxonomy Compliance

For each taxonomy in `manifest.yaml` (taxonomy conventions are
documented in `docs/architecture.md`, not CONTRIBUTING.md — cite
that file for taxonomy-specific findings):
- Does the file exist at the declared `path`?
- Does `name` match the filename (kebab-case, without `.md`)?
- Does it have `name`, `type: taxonomy`, `description`, `domain`?
- Does it have an `applicable_to` list?

#### 6. Cross-Reference Integrity

- Do template `protocols` lists in frontmatter match the manifest's
  `protocols` list for that template? Note: template frontmatter uses
  category paths (e.g., `guardrails/anti-hallucination`) while the
  manifest uses short names (e.g., `anti-hallucination`). Compare
  using the short name only (strip the category prefix).
- Do template `taxonomies` fields reference taxonomies that exist in
  the manifest?
- Do manifest `path` entries point to files that exist?

### Output Format

Report findings as:

```
F-NNN: Short title
  Category: MISSING / UNUSED / VIOLATION
  Location: file path and line
  Requirement: which CONTRIBUTING.md rule is violated
  Evidence: what is missing, wrong, or inconsistent
  Severity: High / Medium / Low
  Affected files: (list if multiple)
```

Categories:
- **MISSING**: Required component, field, or section is absent
- **UNUSED**: Component or parameter is declared but not used
- **VIOLATION**: Component violates a stated convention

Order findings by severity. Focus on REAL gaps — every finding must
cite a specific CONTRIBUTING.md requirement and a specific file.

### Quality Checklist

Before finalizing, verify:
- [ ] Every persona file was checked
- [ ] Every protocol file was checked
- [ ] Every format file was checked
- [ ] Every template file was checked
- [ ] Every taxonomy file was checked
- [ ] Cross-reference integrity was verified
- [ ] Param usage was checked for every template
- [ ] Findings cite specific files and CONTRIBUTING.md rules
