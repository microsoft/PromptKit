---
title: "PromptKit CLI — Validation Plan"
project: "PromptKit CLI (@alan-jowett/promptkit)"
version: "0.3.0"
date: "2025-07-17"
status: draft
related:
  - requirements: cli/specs/requirements.md
  - design: cli/specs/design.md
---

# PromptKit CLI — Validation Plan

## Revision History

| Rev | Date | Author | Description |
|-----|------|--------|-------------|
| 0.1 | 2025-07-17 | Spec-extraction-workflow | Initial draft extracted from source code |

---

## 1. Test Strategy

### 1.1 Testing Levels

| Level | Scope | Tooling | Automation |
|-------|-------|---------|------------|
| **Unit** | Individual functions in `assemble.js`, `manifest.js` | Node.js test runner or Jest | Fully automated |
| **Integration** | Command-level behavior (`list`, `assemble`) | CLI invocation via `child_process` | Fully automated |
| **System** | End-to-end `interactive` command | Manual or semi-automated | Manual (requires LLM CLI) |
| **Build** | Content bundling (`copy-content.js`) | Script execution + file verification | Automated |

### 1.2 Current State

The CLI has no automated tests. [KNOWN — no test files exist under `cli/`]
This validation plan defines the test cases needed to verify all functional
requirements. Tests should be implemented using Node.js built-in test runner
(`node --test`) to avoid adding test framework dependencies.

### 1.3 Test Data

Tests require a minimal PromptKit content fixture with:
- A `manifest.yaml` with at least one persona, one protocol (each category),
  one format, one taxonomy, and two templates (different categories).
- Corresponding `.md` component files with known content, frontmatter, and
  SPDX headers.
- One template with all dependency types, one with minimal dependencies.

---

## 2. Test Cases

### 2.1 CLI Entry Point (cli.js)

**TC-CLI-001**: Help output lists all commands.
- *Requirement*: REQ-CLI-002
- *Type*: Integration
- *Steps*: Run `promptkit --help`.
- *Expected*: Output contains `interactive`, `list`, `assemble` command
  descriptions.

**TC-CLI-002**: Version flag outputs package version.
- *Requirement*: REQ-CLI-003
- *Type*: Integration
- *Steps*: Run `promptkit --version`.
- *Expected*: Output equals the `version` field from `package.json`.

**TC-CLI-003**: Missing content directory exits with error.
- *Requirement*: REQ-CLI-004
- *Type*: Integration
- *Steps*: Run any command with `content/manifest.yaml` absent.
- *Expected*: Stderr contains `"PromptKit content not found"`, exit code 1.

**TC-CLI-004**: Default command is `interactive`.
- *Requirement*: REQ-CLI-002
- *Type*: Integration
- *Steps*: Run `promptkit` with no arguments (with a mock CLI on PATH).
- *Expected*: Behaves identically to `promptkit interactive`.

### 2.2 Assembly Engine (assemble.js)

**TC-CLI-010**: Strip YAML frontmatter from component.
- *Requirement*: REQ-CLI-040
- *Type*: Unit
- *Input*: `"---\nname: test\n---\nBody content"`
- *Expected*: `stripFrontmatter()` returns `"Body content"`.

**TC-CLI-011**: Strip frontmatter with Windows line endings.
- *Requirement*: REQ-CLI-040, REQ-CLI-091
- *Type*: Unit
- *Input*: `"---\r\nname: test\r\n---\r\nBody content"`
- *Expected*: `stripFrontmatter()` returns `"Body content"`.

**TC-CLI-012**: No frontmatter — content returned as-is (trimmed).
- *Requirement*: REQ-CLI-040
- *Type*: Unit
- *Input*: `"  Body content  "`
- *Expected*: `stripFrontmatter()` returns `"Body content"`.

**TC-CLI-013**: Strip single HTML comment (SPDX header).
- *Requirement*: REQ-CLI-041
- *Type*: Unit
- *Input*: Component file starting with `<!-- SPDX -->\n---\nname: x\n---\nBody`
- *Expected*: `loadComponent()` returns `"Body"`.

**TC-CLI-014**: Strip multiple consecutive HTML comments.
- *Requirement*: REQ-CLI-042
- *Type*: Unit
- *Input*: Component file starting with `<!-- A -->\n<!-- B -->\nBody`
- *Expected*: `loadComponent()` returns `"Body"`.

**TC-CLI-015**: Missing component file returns null with warning.
- *Requirement*: REQ-CLI-047
- *Type*: Unit
- *Steps*: Call `loadComponent(contentDir, "nonexistent.md")`.
- *Expected*: Returns `null`; `console.warn` called with path.

**TC-CLI-016**: Section ordering in assembled output.
- *Requirement*: REQ-CLI-043
- *Type*: Unit
- *Steps*: Call `assemble()` with a template that has persona, 2 protocols,
  1 taxonomy, format.
- *Expected*: Output sections appear in order: Identity → Reasoning
  Protocols → Classification Taxonomy → Output Format → Task.

**TC-CLI-017**: Section separators are `\n\n---\n\n`.
- *Requirement*: REQ-CLI-044
- *Type*: Unit
- *Steps*: Call `assemble()` with a template that has persona and format.
- *Expected*: The string `"\n\n---\n\n"` separates the Identity and
  Output Format sections (assuming no protocols/taxonomies).

**TC-CLI-018**: Multiple protocols separated by `---`.
- *Requirement*: REQ-CLI-045
- *Type*: Unit
- *Steps*: Call `assemble()` with a template referencing 2 protocols.
- *Expected*: Both protocol bodies appear in the Reasoning Protocols
  section, separated by `\n\n---\n\n`.

**TC-CLI-019**: Multiple taxonomies separated by `---`.
- *Requirement*: REQ-CLI-046
- *Type*: Unit
- *Steps*: Call `assemble()` with a template referencing 2 taxonomies.
- *Expected*: Both taxonomy bodies appear in the Classification Taxonomy
  section, separated by `\n\n---\n\n`.

**TC-CLI-020**: Omit sections for absent components.
- *Requirement*: REQ-CLI-048
- *Type*: Unit
- *Steps*: Call `assemble()` with a template that has no taxonomies and
  no format.
- *Expected*: Output does not contain `"# Classification Taxonomy"` or
  `"# Output Format"`.

**TC-CLI-021**: Parameter substitution replaces all occurrences.
- *Requirement*: REQ-CLI-049
- *Type*: Unit
- *Input*: Content with `"{{name}} and {{name}}"`, params `{name: "Alice"}`.
- *Expected*: `substituteParams()` returns `"Alice and Alice"`.

**TC-CLI-022**: Parameter substitution applies to all components.
- *Requirement*: REQ-CLI-050
- *Type*: Unit
- *Steps*: Create a persona file containing `{{project}}`. Call
  `assemble()` with `{project: "MyApp"}`.
- *Expected*: The persona section in output contains `"MyApp"`, not
  `"{{project}}"`.

**TC-CLI-023**: Assembly with no params leaves placeholders intact.
- *Requirement*: REQ-CLI-049
- *Type*: Unit
- *Steps*: Call `assemble()` with empty params on a template containing
  `{{unfilled}}`.
- *Expected*: Output contains `"{{unfilled}}"` literally.

**TC-CLI-024**: No Non-Goals section in assembled output.
- *Requirement*: REQ-CLI-051
- *Type*: Unit
- *Steps*: Call `assemble()` with any template.
- *Expected*: Output does not contain `"# Non-Goals"`.

### 2.3 Manifest Resolution (manifest.js)

**TC-CLI-030**: Load and parse manifest.yaml.
- *Requirement*: REQ-CLI-060
- *Type*: Unit
- *Steps*: Call `loadManifest()` with a valid content directory.
- *Expected*: Returns an object with `personas`, `protocols`, `formats`,
  `templates` keys.

**TC-CLI-031**: Malformed YAML throws error.
- *Requirement*: REQ-CLI-060
- *Type*: Unit (error path)
- *Steps*: Call `loadManifest()` with a file containing invalid YAML.
- *Expected*: Throws a `js-yaml` exception.

**TC-CLI-032**: getTemplates flattens nested structure.
- *Requirement*: REQ-CLI-061
- *Type*: Unit
- *Steps*: Call `getTemplates()` with a manifest containing templates
  under two categories.
- *Expected*: Returns a flat array; each item has `category` field set.

**TC-CLI-033**: getPersona finds by name.
- *Requirement*: REQ-CLI-062
- *Type*: Unit
- *Steps*: Call `getPersona(manifest, "systems-engineer")`.
- *Expected*: Returns the matching persona object.

**TC-CLI-034**: getPersona returns undefined for unknown name.
- *Requirement*: REQ-CLI-062
- *Type*: Unit (error path)
- *Steps*: Call `getPersona(manifest, "nonexistent")`.
- *Expected*: Returns `undefined`.

**TC-CLI-035**: getProtocol finds across categories.
- *Requirement*: REQ-CLI-063
- *Type*: Unit
- *Steps*: Call `getProtocol()` with a protocol name from `guardrails/`,
  then one from `analysis/`, then one from `reasoning/`.
- *Expected*: All three return the matching protocol object.

**TC-CLI-036**: getProtocol returns null for unknown name.
- *Requirement*: REQ-CLI-063
- *Type*: Unit (error path)
- *Steps*: Call `getProtocol(manifest, "nonexistent")`.
- *Expected*: Returns `null`.

**TC-CLI-037**: getFormat finds by name.
- *Requirement*: REQ-CLI-064
- *Type*: Unit
- *Steps*: Call `getFormat(manifest, "investigation-report")`.
- *Expected*: Returns the matching format object.

**TC-CLI-038**: getTaxonomy finds by name.
- *Requirement*: REQ-CLI-065
- *Type*: Unit
- *Steps*: Call `getTaxonomy(manifest, "stack-lifetime-hazards")`.
- *Expected*: Returns the matching taxonomy object.

**TC-CLI-039**: resolveTemplateDeps resolves all dependency types.
- *Requirement*: REQ-CLI-066
- *Type*: Unit
- *Steps*: Call `resolveTemplateDeps()` with a template that has persona,
  2 protocols, 1 taxonomy, 1 format.
- *Expected*: Returns `{ persona: {...}, protocols: [{...}, {...}],
  taxonomies: [{...}], format: {...} }`.

**TC-CLI-040**: resolveTemplateDeps warns on missing protocol.
- *Requirement*: REQ-CLI-067
- *Type*: Unit (error path)
- *Steps*: Call `resolveTemplateDeps()` with a template referencing a
  non-existent protocol.
- *Expected*: `console.warn` called; missing protocol excluded from array.

**TC-CLI-041**: resolveTemplateDeps warns on missing taxonomy.
- *Requirement*: REQ-CLI-068
- *Type*: Unit (error path)
- *Steps*: Call `resolveTemplateDeps()` with a template referencing a
  non-existent taxonomy.
- *Expected*: `console.warn` called; missing taxonomy excluded from array.

**TC-CLI-042**: Template name matching is case-sensitive.
- *Requirement*: REQ-CLI-069
- *Type*: Unit
- *Steps*: Call `getTemplates()` and search for a template using different
  casing.
- *Expected*: `templates.find(t => t.name === "Investigate-Bug")` returns
  `undefined` when the actual name is `"investigate-bug"`.

### 2.4 List Command (cli.js)

**TC-CLI-050**: List command outputs templates grouped by category.
- *Requirement*: REQ-CLI-020
- *Type*: Integration
- *Steps*: Run `promptkit list`.
- *Expected*: Output contains category headers and template names with
  descriptions.

**TC-CLI-051**: List --json produces valid JSON.
- *Requirement*: REQ-CLI-021
- *Type*: Integration
- *Steps*: Run `promptkit list --json` and parse output with `JSON.parse()`.
- *Expected*: Parses without error; result is an array.

**TC-CLI-052**: JSON output contains required fields.
- *Requirement*: REQ-CLI-022
- *Type*: Integration
- *Steps*: Run `promptkit list --json` and inspect first element.
- *Expected*: Each object has `name`, `description`, `category` properties.

**TC-CLI-053**: List output ends with usage hint.
- *Requirement*: REQ-CLI-023
- *Type*: Integration
- *Steps*: Run `promptkit list`.
- *Expected*: Last line contains `"promptkit assemble"`.

### 2.5 Assemble Command (cli.js)

**TC-CLI-060**: Assemble with valid template writes output file.
- *Requirement*: REQ-CLI-030, REQ-CLI-031
- *Type*: Integration
- *Steps*: Run `promptkit assemble <valid-template> -o test-output.md`.
- *Expected*: `test-output.md` is created with assembled content.

**TC-CLI-061**: Default output filename is assembled-prompt.md.
- *Requirement*: REQ-CLI-031
- *Type*: Integration
- *Steps*: Run `promptkit assemble <valid-template>` without `-o`.
- *Expected*: `assembled-prompt.md` is created in CWD.

**TC-CLI-062**: Parameter passing with -p flag.
- *Requirement*: REQ-CLI-032
- *Type*: Integration
- *Steps*: Run `promptkit assemble <template> -p key1=val1 -p key2=val2`.
- *Expected*: Output file has `{{key1}}` replaced with `val1` and
  `{{key2}}` replaced with `val2`.

**TC-CLI-063**: Parameter value containing equals sign.
- *Requirement*: REQ-CLI-033
- *Type*: Integration
- *Steps*: Run `promptkit assemble <template> -p "equation=a=b+c"`.
- *Expected*: The parameter value is `"a=b+c"`, not `"a"`.

**TC-CLI-064**: Unknown template name exits with error.
- *Requirement*: REQ-CLI-034
- *Type*: Integration
- *Steps*: Run `promptkit assemble nonexistent-template`.
- *Expected*: Stderr contains `"not found"` and lists available templates.
  Exit code is 1.

**TC-CLI-065**: Summary output after successful assembly.
- *Requirement*: REQ-CLI-036
- *Type*: Integration
- *Steps*: Run `promptkit assemble <valid-template>`.
- *Expected*: Stdout contains template name, persona, protocols, format.

**TC-CLI-066**: Unfilled parameter warning.
- *Requirement*: REQ-CLI-037
- *Type*: Integration
- *Steps*: Run `promptkit assemble <template-with-params>` without -p flags.
- *Expected*: Stdout contains `"unfilled parameter(s)"` and lists the
  placeholder names.

**TC-CLI-067**: Output path resolved relative to CWD.
- *Requirement*: REQ-CLI-035
- *Type*: Integration
- *Steps*: Run `promptkit assemble <template> -o ./subdir/out.md` from a
  known directory.
- *Expected*: File is created at `<CWD>/subdir/out.md`.

### 2.6 Interactive Command (launch.js)

**TC-CLI-070**: detectCli finds copilot on PATH.
- *Requirement*: REQ-CLI-010
- *Type*: Unit (requires PATH manipulation or mock)
- *Steps*: Ensure `copilot` is on PATH; call `detectCli()`.
- *Expected*: Returns `"copilot"`.

**TC-CLI-071**: detectCli finds gh-copilot when copilot is absent.
- *Requirement*: REQ-CLI-010
- *Type*: Unit
- *Steps*: Ensure only `gh` (with copilot extension) is on PATH.
- *Expected*: Returns `"gh-copilot"`.

**TC-CLI-072**: detectCli finds claude as fallback.
- *Requirement*: REQ-CLI-010
- *Type*: Unit
- *Steps*: Ensure only `claude` is on PATH.
- *Expected*: Returns `"claude"`.

**TC-CLI-073**: detectCli returns null when nothing found.
- *Requirement*: REQ-CLI-010
- *Type*: Unit
- *Steps*: Ensure no supported CLI is on PATH.
- *Expected*: Returns `null`.

**TC-CLI-074**: gh without copilot extension is not detected.
- *Requirement*: REQ-CLI-010
- *Type*: Unit
- *Steps*: Ensure `gh` is on PATH but copilot extension is not installed.
- *Expected*: `detectCli()` does not return `"gh-copilot"`.

**TC-CLI-075**: --cli flag overrides detection.
- *Requirement*: REQ-CLI-011
- *Type*: Integration
- *Steps*: Run `promptkit interactive --cli claude` when copilot is on PATH.
- *Expected*: Uses `claude`, not `copilot`.

**TC-CLI-076**: No CLI found exits with error.
- *Requirement*: REQ-CLI-012
- *Type*: Integration
- *Steps*: Run `promptkit` with no supported CLI on PATH.
- *Expected*: Stderr contains installation instructions; exit code 1.

**TC-CLI-077**: Fallback warning when auto-detecting non-copilot CLI.
- *Requirement*: REQ-CLI-013
- *Type*: Integration
- *Steps*: Run `promptkit` when only `claude` is detected.
- *Expected*: Stderr contains warning about fallback to `claude`.

**TC-CLI-078**: Content copied to temp directory.
- *Requirement*: REQ-CLI-014
- *Type*: Unit
- *Steps*: Call `copyContentToTemp(contentDir)`.
- *Expected*: Returns a path under `os.tmpdir()`; the directory contains
  `manifest.yaml` and component subdirectories.

**TC-CLI-079**: Temp directory cleaned up on child exit.
- *Requirement*: REQ-CLI-018
- *Type*: Integration (requires mock child process)
- *Steps*: Launch interactive with a mock CLI that exits immediately.
- *Expected*: Temp directory no longer exists after exit.

**TC-CLI-080**: Bootstrap prompt passed as argument.
- *Requirement*: REQ-CLI-016
- *Type*: Unit
- *Steps*: Inspect the spawn arguments for each CLI type.
- *Expected*: `"Read and execute bootstrap.md"` appears in args.

**TC-CLI-081**: Correct command construction for each CLI.
- *Requirement*: REQ-CLI-017
- *Type*: Unit
- *Steps*: Verify spawn cmd/args for `copilot`, `gh-copilot`, `claude`.
- *Expected*:
  - copilot: `cmd="copilot"`, `args=["-i", "Read and execute bootstrap.md"]`
  - gh-copilot: `cmd="gh"`, `args=["copilot", "-i", "Read and execute bootstrap.md"]`
  - claude: `cmd="claude"`, `args=["Read and execute bootstrap.md"]`

### 2.7 Content Bundling (copy-content.js)

**TC-CLI-090**: Script copies all required directories.
- *Requirement*: REQ-CLI-070
- *Type*: Build
- *Steps*: Run `node scripts/copy-content.js` from cli/ directory.
- *Expected*: `content/` contains `personas/`, `protocols/`, `formats/`,
  `templates/`, `taxonomies/` directories.

**TC-CLI-091**: Script copies manifest.yaml and bootstrap.md.
- *Requirement*: REQ-CLI-071
- *Type*: Build
- *Steps*: Run `node scripts/copy-content.js`.
- *Expected*: `content/manifest.yaml` and `content/bootstrap.md` exist.

**TC-CLI-092**: Only .md and .yaml files are copied from directories.
- *Requirement*: REQ-CLI-072
- *Type*: Build
- *Steps*: Place a `.png` file in `personas/`. Run `copy-content.js`.
- *Expected*: `content/personas/` does not contain the `.png` file.

**TC-CLI-093**: Clean state — previous content removed.
- *Requirement*: REQ-CLI-073
- *Type*: Build
- *Steps*: Create a stale file in `content/`. Run `copy-content.js`.
- *Expected*: Stale file is gone; only freshly copied files remain.

**TC-CLI-094**: Missing repo root manifest exits with error.
- *Requirement*: REQ-CLI-074
- *Type*: Build (error path)
- *Steps*: Run `copy-content.js` from outside the repository.
- *Expected*: Stderr contains `"manifest.yaml not found"`, exit code 1.

**TC-CLI-095**: Entry count reported on completion.
- *Requirement*: REQ-CLI-075
- *Type*: Build
- *Steps*: Run `copy-content.js`.
- *Expected*: Stdout contains `"Copied PromptKit content"` and a count.

### 2.8 Distribution

**TC-CLI-100**: npm pack includes only specified directories.
- *Requirement*: REQ-CLI-080
- *Type*: Build
- *Steps*: Run `npm pack --dry-run` in `cli/`.
- *Expected*: Listed files are under `bin/`, `lib/`, `content/`, and
  `package.json`.

**TC-CLI-101**: content/ is gitignored.
- *Requirement*: REQ-CLI-081
- *Type*: Build
- *Steps*: Check `git status` after running `copy-content.js`.
- *Expected*: `content/` is not listed as untracked.

### 2.9 Cross-Platform and Compatibility

**TC-CLI-110**: CLI runs on Node.js 18.
- *Requirement*: REQ-CLI-090
- *Type*: System
- *Steps*: Install Node.js 18, run `promptkit list`.
- *Expected*: Command succeeds without errors.

**TC-CLI-111**: CLI runs on Node.js 20.
- *Requirement*: REQ-CLI-090
- *Type*: System
- *Steps*: Install Node.js 20, run `promptkit list`.
- *Expected*: Command succeeds without errors.

**TC-CLI-112**: CLI runs on Node.js 22.
- *Requirement*: REQ-CLI-090
- *Type*: System
- *Steps*: Install Node.js 22, run `promptkit list`.
- *Expected*: Command succeeds without errors.

**TC-CLI-113**: Windows line endings handled in frontmatter.
- *Requirement*: REQ-CLI-091
- *Type*: Unit
- *Steps*: Create a component file with `\r\n` line endings and
  frontmatter. Call `loadComponent()`.
- *Expected*: Frontmatter stripped; body returned cleanly.

---

## 3. Traceability Matrix

| Requirement | Test Case(s) | Priority |
|-------------|-------------|----------|
| REQ-CLI-001 | TC-CLI-001 | High |
| REQ-CLI-002 | TC-CLI-001, TC-CLI-004 | High |
| REQ-CLI-003 | TC-CLI-002 | Medium |
| REQ-CLI-004 | TC-CLI-003 | High |
| REQ-CLI-010 | TC-CLI-070 through TC-CLI-074 | High |
| REQ-CLI-011 | TC-CLI-075 | Medium |
| REQ-CLI-012 | TC-CLI-076 | High |
| REQ-CLI-013 | TC-CLI-077 | Low |
| REQ-CLI-014 | TC-CLI-078 | High |
| REQ-CLI-015 | TC-CLI-078, TC-CLI-081 | High |
| REQ-CLI-016 | TC-CLI-080 | High |
| REQ-CLI-017 | TC-CLI-081 | High |
| REQ-CLI-018 | TC-CLI-079 | High |
| REQ-CLI-019 | TC-CLI-076 | Medium |
| REQ-CLI-020 | TC-CLI-050 | Medium |
| REQ-CLI-021 | TC-CLI-051 | Medium |
| REQ-CLI-022 | TC-CLI-052 | Medium |
| REQ-CLI-023 | TC-CLI-053 | Low |
| REQ-CLI-030 | TC-CLI-060 | High |
| REQ-CLI-031 | TC-CLI-060, TC-CLI-061 | Medium |
| REQ-CLI-032 | TC-CLI-062 | High |
| REQ-CLI-033 | TC-CLI-063 | Medium |
| REQ-CLI-034 | TC-CLI-064 | High |
| REQ-CLI-035 | TC-CLI-067 | Medium |
| REQ-CLI-036 | TC-CLI-065 | Low |
| REQ-CLI-037 | TC-CLI-066 | Medium |
| REQ-CLI-040 | TC-CLI-010, TC-CLI-011, TC-CLI-012 | High |
| REQ-CLI-041 | TC-CLI-013 | Medium |
| REQ-CLI-042 | TC-CLI-014 | Medium |
| REQ-CLI-043 | TC-CLI-016 | High |
| REQ-CLI-044 | TC-CLI-017 | High |
| REQ-CLI-045 | TC-CLI-018 | Medium |
| REQ-CLI-046 | TC-CLI-019 | Medium |
| REQ-CLI-047 | TC-CLI-015 | High |
| REQ-CLI-048 | TC-CLI-020 | High |
| REQ-CLI-049 | TC-CLI-021, TC-CLI-023 | High |
| REQ-CLI-050 | TC-CLI-022 | Medium |
| REQ-CLI-051 | TC-CLI-024 | Low |
| REQ-CLI-060 | TC-CLI-030, TC-CLI-031 | High |
| REQ-CLI-061 | TC-CLI-032 | High |
| REQ-CLI-062 | TC-CLI-033, TC-CLI-034 | Medium |
| REQ-CLI-063 | TC-CLI-035, TC-CLI-036 | Medium |
| REQ-CLI-064 | TC-CLI-037 | Medium |
| REQ-CLI-065 | TC-CLI-038 | Medium |
| REQ-CLI-066 | TC-CLI-039 | High |
| REQ-CLI-067 | TC-CLI-040 | Medium |
| REQ-CLI-068 | TC-CLI-041 | Medium |
| REQ-CLI-069 | TC-CLI-042 | Low |
| REQ-CLI-070 | TC-CLI-090 | High |
| REQ-CLI-071 | TC-CLI-091 | High |
| REQ-CLI-072 | TC-CLI-092 | Medium |
| REQ-CLI-073 | TC-CLI-093 | Medium |
| REQ-CLI-074 | TC-CLI-094 | High |
| REQ-CLI-075 | TC-CLI-095 | Low |
| REQ-CLI-076 | TC-CLI-100 | High |
| REQ-CLI-080 | TC-CLI-100 | High |
| REQ-CLI-081 | TC-CLI-101 | Medium |
| REQ-CLI-090 | TC-CLI-110, TC-CLI-111, TC-CLI-112 | High |
| REQ-CLI-091 | TC-CLI-011, TC-CLI-113 | High |
| REQ-CLI-092 | TC-CLI-015, TC-CLI-040, TC-CLI-041 | High |
| REQ-CLI-093 | TC-CLI-003, TC-CLI-064, TC-CLI-076 | High |
| REQ-CLI-094 | (verified by package.json inspection) | Low |

---

## 4. Acceptance Criteria Verification

### 4.1 Cross-Cutting Acceptance Criteria

| AC | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-001 | All three commands reachable and documented | TC-CLI-001 (help output) |
| AC-002 | Assembled output matches bootstrap.md spec | TC-CLI-016 (section order), TC-CLI-017 (separators), TC-CLI-021 (substitution), TC-CLI-020 (omission), manual comparison with bootstrap.md Assembly Process |
| AC-003 | Clean exit — no orphan processes or leftover temp dirs | TC-CLI-079 (temp cleanup), TC-CLI-076 (error exit) |
| AC-004 | npm pack includes correct files | TC-CLI-100 |
| AC-005 | Runs on Node.js 18, 20, 22 | TC-CLI-110, TC-CLI-111, TC-CLI-112 |

### 4.2 Gap Coverage

The following known gaps (from design.md Section 7) are NOT covered by
test cases because they describe absent features, not bugs:

| Gap | Description | Status |
|-----|-------------|--------|
| GAP-003 | No Non-Goals section | TC-CLI-024 verifies current behavior |
| GAP-004 | No interactive template mode | Out of scope (documented limitation) |
| GAP-005 | No agent instruction output | Out of scope (documented limitation) |
| GAP-006 | No manifest schema validation | Future work |
| GAP-007 | No pipeline support | Out of scope (documented limitation) |
| GAP-009 | Inconsistent null/undefined returns | TC-CLI-034, TC-CLI-036 verify current behavior |
| GAP-010 | Undocumented --cli values | Future work (help text improvement) |
| GAP-011 | Case-sensitive template matching | TC-CLI-042 verifies current behavior |

---

## 5. Test Environment Requirements

### 5.1 Minimum Setup

- Node.js >= 18.0.0
- PromptKit repository cloned with `cli/content/` populated
  (`npm run prepare` or `node scripts/copy-content.js`)
- No LLM CLI required (except for TC-CLI-070 through TC-CLI-081 system
  tests, which can use mocks)

### 5.2 Test Fixtures

A minimal test fixture should be created under `cli/tests/fixtures/`
containing:

```
fixtures/
├── manifest.yaml          # Minimal manifest with known components
├── bootstrap.md           # Stub bootstrap
├── personas/
│   └── test-persona.md    # Known content with frontmatter + SPDX
├── protocols/
│   ├── guardrails/
│   │   └── test-guardrail.md
│   └── reasoning/
│       └── test-reasoning.md
├── formats/
│   └── test-format.md
├── taxonomies/
│   └── test-taxonomy.md
└── templates/
    ├── category-a/
    │   └── test-full.md   # Template with all dependency types + params
    └── category-b/
        └── test-minimal.md  # Template with persona only
```

Each fixture file should have:
- An SPDX HTML comment header
- YAML frontmatter
- A deterministic body containing the component name (for verification)
- At least one `{{param}}` placeholder (in template files)
