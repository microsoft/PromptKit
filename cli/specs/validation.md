---
title: "PromptKit CLI — Validation Plan"
project: "PromptKit CLI (@alan-jowett/promptkit)"
version: "0.4.0"
date: "2026-03-31"
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
| 0.2 | 2025-07-18 | Engineering-workflow Phase 2 | Retired test cases for assembly engine (TC-CLI-010–024), manifest resolution (TC-CLI-030–042), assemble command (TC-CLI-060–067), Windows frontmatter (TC-CLI-113). Updated TC-CLI-001, TC-CLI-003, TC-CLI-053. Added TC-CLI-120–122 for new requirements. Updated traceability matrix. |
| 0.3 | 2026-03-31 | Bug-fix | Added TC-CLI-082 for REQ-CLI-024 (claude cwd preservation). Updated TC-CLI-080/081 notes. Updated traceability matrix. |
| 0.4 | 2026-03-31 | Bug-fix | Extended TC-CLI-082 to all CLIs. Added TC-CLI-083 (--add-dir for staging dir). Updated TC-CLI-080/081/082. Added REQ-CLI-025 to traceability. |

---

## 1. Test Strategy

### 1.1 Testing Levels

| Level | Scope | Tooling | Automation |
|-------|-------|---------|------------|
| **Unit** | Individual functions in `launch.js` | Node.js test runner or Jest | Fully automated |
| **Integration** | Command-level behavior (`interactive`, `list`) | CLI invocation via `child_process` | Fully automated |
| **System** | End-to-end `interactive` command | Manual or semi-automated | Manual (requires LLM CLI) |
| **Build** | Content bundling (`copy-content.js`) | Script execution + file verification | Automated |

### 1.2 Current State

The CLI has 24 automated tests across 4 test files, executed via
`npm test` using Node.js built-in test runner (`node --test`). The
`pretest` hook automatically populates `cli/content/` before each run.
No external test framework dependencies are required.

### 1.3 Test Data

Tests use real PromptKit content from `cli/content/`, populated
automatically by the `pretest` hook. No static fixtures are maintained.
- The `list` command tests parse the real `manifest.yaml`.
- The `interactive` command tests copy the real content directory to a
  temp directory via `copyContentToTemp()`.

---

## 2. Test Cases

### 2.1 CLI Entry Point (cli.js)

**TC-CLI-001**: Help output lists all commands.
- *Requirement*: REQ-CLI-002
- *Type*: Integration
- *Steps*: Run `promptkit --help`.
- *Expected*: Output contains `interactive` and `list` command
  descriptions. Output does NOT contain `assemble`.

**TC-CLI-002**: Version flag outputs package version.
- *Requirement*: REQ-CLI-003
- *Type*: Integration
- *Steps*: Run `promptkit --version`.
- *Expected*: Output equals the `version` field from `package.json`.

**TC-CLI-003**: Missing content directory exits with error.
- *Requirement*: REQ-CLI-004
- *Type*: Integration
- *Steps*: Run any command with `content/bootstrap.md` absent.
- *Expected*: Stderr contains content-not-found error, exit code 1.

**TC-CLI-003a**: Missing manifest.yaml exits with error.
- *Requirement*: REQ-CLI-004
- *Type*: Integration
- *Steps*: Run any command with `content/manifest.yaml` absent (but
  `content/bootstrap.md` present).
- *Expected*: Stderr contains content-not-found error, exit code 1.

**TC-CLI-004**: Default command is `interactive`.
- *Requirement*: REQ-CLI-002
- *Type*: Integration
- *Steps*: Run `promptkit` with no arguments (with a mock CLI on PATH).
- *Expected*: Behaves identically to `promptkit interactive`.

### 2.2 Assembly Engine [RETIRED]

*This entire section is retired. The assembly engine (`assemble.js`) has
been removed. See REQ-CLI-101.*

**[RETIRED] TC-CLI-010**: ~~Strip YAML frontmatter from component.~~

**[RETIRED] TC-CLI-011**: ~~Strip frontmatter with Windows line endings.~~

**[RETIRED] TC-CLI-012**: ~~No frontmatter — content returned as-is.~~

**[RETIRED] TC-CLI-013**: ~~Strip single HTML comment (SPDX header).~~

**[RETIRED] TC-CLI-014**: ~~Strip multiple consecutive HTML comments.~~

**[RETIRED] TC-CLI-015**: ~~Missing component file returns null with warning.~~

**[RETIRED] TC-CLI-016**: ~~Section ordering in assembled output.~~

**[RETIRED] TC-CLI-017**: ~~Section separators are `\n\n---\n\n`.~~

**[RETIRED] TC-CLI-018**: ~~Multiple protocols separated by `---`.~~

**[RETIRED] TC-CLI-019**: ~~Multiple taxonomies separated by `---`.~~

**[RETIRED] TC-CLI-020**: ~~Omit sections for absent components.~~

**[RETIRED] TC-CLI-021**: ~~Parameter substitution replaces all occurrences.~~

**[RETIRED] TC-CLI-022**: ~~Parameter substitution applies to all components.~~

**[RETIRED] TC-CLI-023**: ~~Assembly with no params leaves placeholders intact.~~

**[RETIRED] TC-CLI-024**: ~~No Non-Goals section in assembled output.~~

### 2.3 Manifest Resolution [RETIRED]

*This entire section is retired. The manifest resolution module
(`manifest.js`) has been removed. See REQ-CLI-101.*

**[RETIRED] TC-CLI-030**: ~~Load and parse manifest.yaml.~~

**[RETIRED] TC-CLI-031**: ~~Malformed YAML throws error.~~

**[RETIRED] TC-CLI-032**: ~~getTemplates flattens nested structure.~~

**[RETIRED] TC-CLI-033**: ~~getPersona finds by name.~~

**[RETIRED] TC-CLI-034**: ~~getPersona returns undefined for unknown name.~~

**[RETIRED] TC-CLI-035**: ~~getProtocol finds across categories.~~

**[RETIRED] TC-CLI-036**: ~~getProtocol returns null for unknown name.~~

**[RETIRED] TC-CLI-037**: ~~getFormat finds by name.~~

**[RETIRED] TC-CLI-038**: ~~getTaxonomy finds by name.~~

**[RETIRED] TC-CLI-039**: ~~resolveTemplateDeps resolves all dependency types.~~

**[RETIRED] TC-CLI-040**: ~~resolveTemplateDeps warns on missing protocol.~~

**[RETIRED] TC-CLI-041**: ~~resolveTemplateDeps warns on missing taxonomy.~~

**[RETIRED] TC-CLI-042**: ~~Template name matching is case-sensitive.~~

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
- *Expected*: Output contains a usage hint referencing `promptkit interactive`
  (or equivalent). Output does NOT reference `promptkit assemble`.

### 2.5 Assemble Command [RETIRED]

*This entire section is retired. The `assemble` command has been removed.
See REQ-CLI-100.*

**[RETIRED] TC-CLI-060**: ~~Assemble with valid template writes output file.~~

**[RETIRED] TC-CLI-061**: ~~Default output filename is assembled-prompt.md.~~

**[RETIRED] TC-CLI-062**: ~~Parameter passing with -p flag.~~

**[RETIRED] TC-CLI-063**: ~~Parameter value containing equals sign.~~

**[RETIRED] TC-CLI-064**: ~~Unknown template name exits with error.~~

**[RETIRED] TC-CLI-065**: ~~Summary output after successful assembly.~~

**[RETIRED] TC-CLI-066**: ~~Unfilled parameter warning.~~

**[RETIRED] TC-CLI-067**: ~~Output path resolved relative to CWD.~~

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
  Output does NOT contain `promptkit assemble`.

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
  `manifest.yaml`, `bootstrap.md`, and component subdirectories.

**TC-CLI-079**: Temp directory cleaned up on child exit.
- *Requirement*: REQ-CLI-018
- *Type*: Integration (requires mock child process)
- *Steps*: Launch interactive with a mock CLI that exits immediately.
- *Expected*: Temp directory no longer exists after exit.

**TC-CLI-080**: Bootstrap prompt passed as argument.
- *Requirement*: REQ-CLI-016
- *Type*: Unit
- *Steps*: Inspect the spawn arguments for each CLI type.
- *Expected*: For every CLI, the bootstrap prompt argument is an absolute
  path ending in `bootstrap.md` (e.g. `"Read and execute /tmp/promptkit-xxx/bootstrap.md"`).

**TC-CLI-081**: Correct command construction for each CLI.
- *Requirement*: REQ-CLI-017
- *Type*: Unit
- *Steps*: Verify spawn cmd/args for `copilot`, `gh-copilot`, `claude`.
- *Expected*:
  - copilot: `cmd="copilot"`, args include `"--add-dir"`, `<tmpDir>`,
    `"-i"`, `"Read and execute <abs>/bootstrap.md"`
  - gh-copilot: `cmd="gh"`, args include `"copilot"`, `"--add-dir"`,
    `<tmpDir>`, `"-i"`, `"Read and execute <abs>/bootstrap.md"`
  - claude: `cmd="claude"`, args include `"--add-dir"`, `<tmpDir>`,
    `"Read and execute <abs>/bootstrap.md"`

**TC-CLI-082**: All CLIs are spawned with the user's original working directory.
- *Requirement*: REQ-CLI-024
- *Type*: Integration (uses mock CLI executables)
- *Steps*:
  1. Create a mock executable (for each CLI under test) that records
     `process.cwd()` to a JSON file and exits.
  2. Run `promptkit interactive --cli <name>` from a known directory `D`
     with the mock on PATH.
  3. Read the recorded cwd from the file.
- *Expected*: The recorded cwd equals `D` for every supported CLI. It does
  NOT equal the temporary `promptkit-*` staging directory.

**TC-CLI-083**: All CLIs receive `--add-dir <tmpDir>` in their spawn arguments.
- *Requirement*: REQ-CLI-025
- *Type*: Integration (uses mock CLI executables)
- *Steps*:
  1. Create a mock executable (for each CLI under test) that records
     `process.argv.slice(2)` to a JSON file and exits.
  2. Run `promptkit interactive --cli <name>` with the mock on PATH.
  3. Read the recorded args from the file.
- *Expected*: For every supported CLI, `"--add-dir"` appears in the recorded
  args and the following argument is the path of the temporary staging
  directory (a directory under `os.tmpdir()` with a `promptkit-` prefix).

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
  `package.json`. The `lib/` directory contains only `launch.js`.

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

**[RETIRED] TC-CLI-113**: ~~Windows line endings handled in frontmatter.~~

*Retired: The assembly engine (`assemble.js`) and its `loadComponent()`
function have been removed. Frontmatter stripping is no longer a CLI
concern.*

### 2.10 New Requirements (v0.2)

**TC-CLI-120**: No assemble command exists.
- *Requirement*: REQ-CLI-100
- *Type*: Integration
- *Steps*: Run `promptkit assemble investigate-bug`.
- *Expected*: Commander produces a help/error message. No assembly output
  is generated. No file is written.

**TC-CLI-121**: No assembly code in package.
- *Requirement*: REQ-CLI-101
- *Type*: Build
- *Steps*: Run `npm pack --dry-run` in `cli/`.
- *Expected*: Output does not list `lib/assemble.js` or `lib/manifest.js`.

**TC-CLI-122**: List command uses inline manifest parsing.
- *Requirement*: REQ-CLI-103
- *Type*: Integration
- *Steps*: In a test environment where no separate `manifest` module
  (e.g., `lib/manifest.js`) exists, run `promptkit list`.
- *Expected*: `promptkit list` completes successfully and lists available
  templates, confirming that `manifest.yaml` is parsed directly via
  `js-yaml` within `cli.js` rather than through a separate module.

---

## 3. Traceability Matrix

| Requirement | Test Case(s) | Priority | Status |
|-------------|-------------|----------|--------|
| REQ-CLI-001 | TC-CLI-001 | High | Active |
| REQ-CLI-002 | TC-CLI-001, TC-CLI-004 | High | Active |
| REQ-CLI-003 | TC-CLI-002 | Medium | Active |
| REQ-CLI-004 | TC-CLI-003, TC-CLI-003a | High | Active |
| REQ-CLI-010 | TC-CLI-070 through TC-CLI-074 | High | Active |
| REQ-CLI-011 | TC-CLI-075 | Medium | Active |
| REQ-CLI-012 | TC-CLI-076 | High | Active |
| REQ-CLI-013 | TC-CLI-077 | Low | Active |
| REQ-CLI-014 | TC-CLI-078 | High | Active |
| REQ-CLI-015 | TC-CLI-078, TC-CLI-081, TC-CLI-082 | High | Active |
| REQ-CLI-016 | TC-CLI-080 | High | Active |
| REQ-CLI-017 | TC-CLI-081 | High | Active |
| REQ-CLI-018 | TC-CLI-079 | High | Active |
| REQ-CLI-019 | TC-CLI-076 | Medium | Active |
| REQ-CLI-024 | TC-CLI-082 | High | Active |
| REQ-CLI-025 | TC-CLI-083 | High | Active |
| REQ-CLI-020 | TC-CLI-050 | Medium | Active |
| REQ-CLI-021 | TC-CLI-051 | Medium | Active |
| REQ-CLI-022 | TC-CLI-052 | Medium | Active |
| REQ-CLI-023 | TC-CLI-053 | Low | Active |
| REQ-CLI-030 | ~~TC-CLI-060~~ | — | RETIRED |
| REQ-CLI-031 | ~~TC-CLI-060, TC-CLI-061~~ | — | RETIRED |
| REQ-CLI-032 | ~~TC-CLI-062~~ | — | RETIRED |
| REQ-CLI-033 | ~~TC-CLI-063~~ | — | RETIRED |
| REQ-CLI-034 | ~~TC-CLI-064~~ | — | RETIRED |
| REQ-CLI-035 | ~~TC-CLI-067~~ | — | RETIRED |
| REQ-CLI-036 | ~~TC-CLI-065~~ | — | RETIRED |
| REQ-CLI-037 | ~~TC-CLI-066~~ | — | RETIRED |
| REQ-CLI-040 | ~~TC-CLI-010, TC-CLI-011, TC-CLI-012~~ | — | RETIRED |
| REQ-CLI-041 | ~~TC-CLI-013~~ | — | RETIRED |
| REQ-CLI-042 | ~~TC-CLI-014~~ | — | RETIRED |
| REQ-CLI-043 | ~~TC-CLI-016~~ | — | RETIRED |
| REQ-CLI-044 | ~~TC-CLI-017~~ | — | RETIRED |
| REQ-CLI-045 | ~~TC-CLI-018~~ | — | RETIRED |
| REQ-CLI-046 | ~~TC-CLI-019~~ | — | RETIRED |
| REQ-CLI-047 | ~~TC-CLI-015~~ | — | RETIRED |
| REQ-CLI-048 | ~~TC-CLI-020~~ | — | RETIRED |
| REQ-CLI-049 | ~~TC-CLI-021, TC-CLI-023~~ | — | RETIRED |
| REQ-CLI-050 | ~~TC-CLI-022~~ | — | RETIRED |
| REQ-CLI-051 | ~~TC-CLI-024~~ | — | RETIRED |
| REQ-CLI-060 | ~~TC-CLI-030, TC-CLI-031~~ | — | RETIRED |
| REQ-CLI-061 | ~~TC-CLI-032~~ | — | RETIRED |
| REQ-CLI-062 | ~~TC-CLI-033, TC-CLI-034~~ | — | RETIRED |
| REQ-CLI-063 | ~~TC-CLI-035, TC-CLI-036~~ | — | RETIRED |
| REQ-CLI-064 | ~~TC-CLI-037~~ | — | RETIRED |
| REQ-CLI-065 | ~~TC-CLI-038~~ | — | RETIRED |
| REQ-CLI-066 | ~~TC-CLI-039~~ | — | RETIRED |
| REQ-CLI-067 | ~~TC-CLI-040~~ | — | RETIRED |
| REQ-CLI-068 | ~~TC-CLI-041~~ | — | RETIRED |
| REQ-CLI-069 | ~~TC-CLI-042~~ | — | RETIRED |
| REQ-CLI-070 | TC-CLI-090 | High | Active |
| REQ-CLI-071 | TC-CLI-091 | High | Active |
| REQ-CLI-072 | TC-CLI-092 | Medium | Active |
| REQ-CLI-073 | TC-CLI-093 | Medium | Active |
| REQ-CLI-074 | TC-CLI-094 | High | Active |
| REQ-CLI-075 | TC-CLI-095 | Low | Active |
| REQ-CLI-076 | TC-CLI-100 | High | Active |
| REQ-CLI-080 | TC-CLI-100, TC-CLI-121 | High | Active |
| REQ-CLI-081 | TC-CLI-101 | Medium | Active |
| REQ-CLI-082 | (verified by package.json inspection) | Medium | Active |
| REQ-CLI-090 | TC-CLI-110, TC-CLI-111, TC-CLI-112 | High | Active |
| REQ-CLI-091 | (platform-specific testing) | High | Active |
| REQ-CLI-092 | — | — | RETIRED |
| REQ-CLI-093 | TC-CLI-003, TC-CLI-076 | High | Active |
| REQ-CLI-094 | (verified by package.json inspection) | Low | Active |
| REQ-CLI-100 | TC-CLI-120 | High | Active |
| REQ-CLI-101 | TC-CLI-121 | High | Active |
| REQ-CLI-103 | TC-CLI-122 | Medium | Active |

---

## 4. Acceptance Criteria Verification

### 4.1 Cross-Cutting Acceptance Criteria

| AC | Criterion | Verification Method |
|----|-----------|-------------------|
| AC-001 | Both commands reachable and documented | TC-CLI-001 (help output) |
| AC-002 | [RETIRED] ~~Assembled output matches bootstrap.md spec~~ | N/A — assembly removed |
| AC-003 | Clean exit — no orphan processes or leftover temp dirs | TC-CLI-079 (temp cleanup), TC-CLI-076 (error exit) |
| AC-004 | npm pack includes correct files (no assemble.js/manifest.js) | TC-CLI-100, TC-CLI-121 |
| AC-005 | Runs on Node.js 18, 20, 22 | TC-CLI-110, TC-CLI-111, TC-CLI-112 |

### 4.2 Gap Coverage

The following known gaps (from design.md Section 7) are tracked:

| Gap | Description | Status |
|-----|-------------|--------|
| GAP-001 | Manifest resolution duplicated | RESOLVED — manifest.js removed |
| GAP-002 | Assembly engine redundant | RESOLVED — assemble.js removed |
| GAP-003 | No Non-Goals section | RESOLVED — LLM handles this |
| GAP-004 | No interactive template mode | RESOLVED — LLM handles this |
| GAP-005 | No agent instruction output | RESOLVED — LLM handles this |
| GAP-006 | No manifest schema validation | RESOLVED — LLM validates manifest |
| GAP-007 | No pipeline support | RESOLVED — LLM handles pipelines |
| GAP-008 | copyContentToTemp copies all file types | Open (low risk) |
| GAP-009 | Inconsistent null/undefined returns | RESOLVED — manifest.js removed |
| GAP-010 | Undocumented --cli values | To be resolved (REQ-CLI-011) |
| GAP-011 | Case-sensitive template matching | RESOLVED — assemble command removed |

---

## 5. Test Environment Requirements

### 5.1 Minimum Setup

- Node.js >= 18.0.0
- PromptKit repository cloned
- Run `npm test` from `cli/` — the `pretest` hook populates `cli/content/`
  automatically. No manual setup required.
- No LLM CLI required (except for TC-CLI-070 through TC-CLI-081 system
  tests, which can use mocks)

### 5.2 Test Data

All tests use the **real PromptKit content** from `cli/content/`, which
is populated automatically by the `pretest` hook (`node scripts/copy-content.js`).
No static test fixtures are maintained — this eliminates maintenance burden
and prevents content drift between test data and real components.

The `pretest` hook ensures `npm test` is self-contained and works from a
clean checkout without any prior setup.
