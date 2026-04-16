---
title: "PromptKit CLI — Requirements Specification"
project: "PromptKit CLI (@alan-jowett/promptkit)"
version: "0.6.1"
date: "2026-03-31"
status: draft
source_files:
  - cli/bin/cli.js
  - cli/lib/launch.js
  - cli/scripts/copy-content.js
  - cli/package.json
---

# PromptKit CLI — Requirements Specification

## Revision History

| Rev | Date | Author | Description |
|-----|------|--------|-------------|
| 0.1 | 2025-07-17 | Spec-extraction-workflow | Initial draft extracted from source code |
| 0.2 | 2025-07-18 | Engineering-workflow Phase 2 | Retired assemble command (REQ-CLI-030–037), assembly engine (REQ-CLI-040–051), manifest resolution module (REQ-CLI-060–069). Kept list command with inline manifest parsing. Modified REQ-CLI-002, 004, 011, 012, 020–023, 080, 091, 094. Retired REQ-CLI-092, CON-005, ASSUMPTION-002, ASSUMPTION-006. Added REQ-CLI-100, 101, 103. |
| 0.3 | 2026-03-31 | Bug-fix | Added REQ-CLI-024 (cwd preservation for claude). Updated REQ-CLI-015 and REQ-CLI-017 to reflect per-CLI spawn cwd behaviour. |
| 0.4 | 2026-03-31 | Bug-fix | Extended cwd fix to all CLIs. Added REQ-CLI-025 (--add-dir for staging directory). Updated REQ-CLI-015, 016, 017, 024 to be CLI-agnostic. |

---

## 1. Scope

### 1.1 What the CLI Is

The PromptKit CLI is a Node.js command-line tool (`@alan-jowett/promptkit`)
that provides two capabilities:

1. **Interactive launch** — detect an LLM CLI on PATH, stage PromptKit
   content, and spawn the LLM with the bootstrap prompt.
2. **Template listing** — enumerate available prompt templates from
   `manifest.yaml` for discovery.

The CLI also includes a **build-time content bundling** script that copies
PromptKit library content from the repository root into the npm package.

### 1.2 What the CLI Is NOT

- The CLI is NOT an LLM or AI tool — it launches external LLM CLIs.
- The CLI does NOT interpret or execute prompts — it stages content and
  delegates prompt assembly to the LLM via `bootstrap.md`.
- The CLI does NOT assemble prompts programmatically — all prompt assembly
  is performed by the LLM when following `bootstrap.md`.

---

## 2. Functional Requirements

### 2.1 Command Structure

**REQ-CLI-001**: The CLI MUST expose a binary named `promptkit` via the
`bin` field in `package.json`.
- *Source*: `package.json` line 12.
- *Acceptance*: Running `npx @alan-jowett/promptkit --help` displays help text.

**REQ-CLI-002**: The CLI MUST provide two commands: `interactive` (default)
and `list`.
- *Source*: `cli.js`.
- *Acceptance*: `promptkit --help` lists `interactive` and `list` commands;
  invoking `promptkit` with no arguments runs the `interactive` command.

**REQ-CLI-003**: The CLI MUST display its version from `package.json` when
invoked with `--version` or `-V`.
- *Source*: `cli.js` line 33 (Commander `.version(pkg.version)`).
- *Acceptance*: `promptkit --version` outputs `0.3.0` (or current version).

**REQ-CLI-004**: The CLI MUST validate that bundled content exists before
executing any command, and exit with code 1 and an error message if
`bootstrap.md` or `manifest.yaml` is not found in the content directory.
- *Source*: `cli.js` (`ensureContent()`).
- *Acceptance*: Deleting `content/bootstrap.md` or `content/manifest.yaml`
  causes any command to print a content-not-found error and exit 1.

### 2.2 Interactive Command

**REQ-CLI-010**: The `interactive` command MUST detect a supported LLM CLI
on the system PATH using the detection order: `copilot` → `gh copilot` →
`claude`.
- *Source*: `launch.js` lines 21–35 (`detectCli()`).
- *Acceptance*: With only `claude` on PATH, `detectCli()` returns `"claude"`.

**REQ-CLI-011**: The `interactive` command MUST accept an optional `--cli
<name>` flag to override auto-detection. Valid values (`copilot`,
`gh-copilot`, `claude`) SHOULD be documented in `--help` output.
- *Source*: `cli.js`.
- *Acceptance*: `promptkit interactive --cli claude` uses `claude` regardless of what
  is detected. `promptkit interactive --help` lists valid `--cli` values.

**REQ-CLI-012**: If no LLM CLI is detected and no `--cli` flag is provided,
the CLI MUST print an error listing installation instructions for supported
CLIs and exit with code 1. The error message MUST NOT reference a
`promptkit assemble` fallback. It SHOULD suggest copying the content
directory and loading `bootstrap.md` manually as an alternative.
- *Source*: `launch.js`.
- *Acceptance*: On a system with no supported CLI, `promptkit` prints
  install guidance (no `assemble` reference) and exits 1.

**REQ-CLI-013**: If auto-detection selects a CLI other than `copilot` or
`gh-copilot`, and the user did not pass `--cli`, the CLI SHOULD print a
warning indicating the fallback CLI being used.
- *Source*: `launch.js` lines 73–79.
- *Acceptance*: When only `claude` is detected, a warning mentions fallback.

**REQ-CLI-014**: The `interactive` command MUST copy the entire content
directory to a temporary directory before launching the LLM CLI.
- *Source*: `launch.js` lines 37–41 (`copyContentToTemp()`).
- *Acceptance*: A temp directory under the OS temp path contains all
  content files.

**REQ-CLI-015**: The `interactive` command MUST spawn the LLM CLI process
with `cwd` set to the user's working directory at the time the interactive
session is launched (captured when launching) and `stdio: "inherit"` so the
user can interact directly.
- *Source*: `launch.js` (`launchInteractive()`).
- *Acceptance*: The spawned process has `cwd` equal to the directory from
  which `promptkit` was invoked. The process inherits stdin/stdout/stderr.

**REQ-CLI-016**: The `interactive` command MUST pass the bootstrap prompt
`"Read and execute <abs-path-to-bootstrap.md>"` as the initial instruction
to the LLM CLI, where `<abs-path-to-bootstrap.md>` is the absolute path to
`bootstrap.md` inside the temporary staging directory. The absolute path
allows the LLM to locate the file regardless of which directory it treats
as its working directory.
- *Source*: `launch.js` (`launchInteractive()`).
- *Acceptance*: The spawned process receives a string argument that contains
  an absolute path ending in `bootstrap.md`.

**REQ-CLI-017**: The CLI MUST construct the correct command and arguments
for each supported LLM CLI. All CLIs receive `--add-dir <tmpDir>` and an
absolute path to `bootstrap.md`:
- `copilot`: `copilot --add-dir <tmpDir> -i "Read and execute <abs>/bootstrap.md"`
- `gh-copilot`: `gh copilot --add-dir <tmpDir> -i "Read and execute <abs>/bootstrap.md"`
- `claude`: `claude --add-dir <tmpDir> "Read and execute <abs>/bootstrap.md"`
- *Source*: `launch.js` (`launchInteractive()`).
- *Acceptance*: Spawn is called with the documented cmd/args for each CLI.

**REQ-CLI-024**: The `interactive` command MUST preserve the user's original
working directory for ALL supported LLM CLIs. Every LLM CLI child process
MUST be spawned with `cwd` equal to the directory from which `promptkit`
was invoked, not the temporary staging directory.
- *Source*: `launch.js` (`launchInteractive()`).
- *Acceptance*: When `promptkit --cli <name>` is run from directory `D`,
  the spawned process reports `cwd = D` for every supported CLI. The cwd
  is NOT the temporary `promptkit-*` staging directory.

**REQ-CLI-025**: The `interactive` command MUST grant the LLM CLI file
access to the temporary staging directory by passing `--add-dir <tmpDir>`
at launch, for every supported LLM CLI. This ensures the LLM can read
PromptKit content files from the staging directory even though the process
cwd is the user's original working directory.
- *Source*: `launch.js` (`launchInteractive()`).
- *Acceptance*: The spawn args for every supported CLI contain `--add-dir`
  followed by the path of the temporary staging directory.

**REQ-CLI-018**: When the child process exits, the CLI MUST clean up the
temporary directory (best-effort) and then exit with the child's exit code.
If the child was killed by a signal, the CLI MUST re-send that signal to
its own process.
- *Source*: `launch.js` lines 122–133.
- *Acceptance*: After the child exits, the temp directory is removed and
  `process.exitCode` matches.

**REQ-CLI-019**: If spawning the child process fails (error event), the CLI
MUST print an error message, attempt to clean up the temp directory, and
exit with code 1.
- *Source*: `launch.js` lines 112–119.
- *Acceptance*: With an invalid CLI name, `promptkit --cli nonexistent`
  prints an error and exits 1.

### 2.3 List Command

**REQ-CLI-020**: The `list` command MUST load `manifest.yaml` and display
all templates grouped by category, with name and first-line description.
The manifest parsing MUST be implemented inline in `cli.js` (no separate
`manifest.js` module).
- *Source*: `cli.js` (inline manifest parsing with `js-yaml`).
- *Acceptance*: Output shows category headers and template names with
  descriptions.

**REQ-CLI-021**: The `list` command MUST support a `--json` flag that
outputs the template list as a JSON array.
- *Source*: `cli.js`.
- *Acceptance*: `promptkit list --json` produces valid JSON parseable by
  `JSON.parse()`.

**REQ-CLI-022**: The JSON output MUST include each template's `name`,
`description`, and `category` fields (plus any other fields from the
manifest entry).
- *Source*: `cli.js` (inline template flattening logic).
- *Acceptance*: JSON output contains objects with at least `name`,
  `description`, `category`.

**REQ-CLI-023**: The human-readable list output MUST end with a usage hint
directing users to the `interactive` command.
- *Source*: `cli.js`.
- *Acceptance*: Output contains a usage hint referencing
  `promptkit interactive` (or equivalent).

### 2.4 Assemble Command [RETIRED]

*This entire section is retired. The `assemble` command has been removed.
Prompt assembly is now performed exclusively by the LLM via `bootstrap.md`.
See REQ-CLI-100.*

**[RETIRED] REQ-CLI-030**: ~~The `assemble` command MUST accept a required
positional argument `<template>` specifying the template name.~~

**[RETIRED] REQ-CLI-031**: ~~The `assemble` command MUST accept an `-o,
--output <file>` option with a default value of `"assembled-prompt.md"`.~~

**[RETIRED] REQ-CLI-032**: ~~The `assemble` command MUST accept repeatable
`-p, --param <key=value>` options to supply template parameters.~~

**[RETIRED] REQ-CLI-033**: ~~Parameter values containing `=` signs MUST be
handled correctly by splitting only on the first `=`.~~

**[RETIRED] REQ-CLI-034**: ~~If the specified template name does not match
any template in the manifest, the CLI MUST print an error listing all
available template names and exit with code 1.~~

**[RETIRED] REQ-CLI-035**: ~~The `assemble` command MUST resolve the output
path relative to the current working directory using `path.resolve()`.~~

**[RETIRED] REQ-CLI-036**: ~~After successful assembly, the CLI MUST print a
summary including: output path, template name, persona name, protocol list,
and format name (if present).~~

**[RETIRED] REQ-CLI-037**: ~~After successful assembly, the CLI MUST scan the
output for unfilled `{{param}}` placeholders, report the count and names of
unique unfilled parameters, and suggest using `--param` to fill them.~~

### 2.5 Assembly Engine [RETIRED]

*This entire section is retired. The assembly engine (`assemble.js`) has been
removed. The LLM performs assembly by following the Assembly Process defined
in `bootstrap.md`. See REQ-CLI-101.*

**[RETIRED] REQ-CLI-040**: ~~The assembly engine MUST strip YAML frontmatter
(delimited by `---` lines) from component files before inclusion.~~

**[RETIRED] REQ-CLI-041**: ~~The assembly engine MUST strip leading HTML
comments (e.g., SPDX license headers) from component files before
inclusion.~~

**[RETIRED] REQ-CLI-042**: ~~The assembly engine MUST strip ALL leading HTML
comments, not just the first one, handling consecutive comment blocks.~~

**[RETIRED] REQ-CLI-043**: ~~The assembly engine MUST concatenate components
in a fixed section order: Identity → Reasoning Protocols → Classification
Taxonomy → Output Format → Task.~~

**[RETIRED] REQ-CLI-044**: ~~Sections MUST be separated by `\n\n---\n\n`
(horizontal rule with blank lines).~~

**[RETIRED] REQ-CLI-045**: ~~Multiple protocols within the Reasoning Protocols
section MUST be separated by `\n\n---\n\n`.~~

**[RETIRED] REQ-CLI-046**: ~~Multiple taxonomies within the Classification
Taxonomy section MUST be separated by `\n\n---\n\n`.~~

**[RETIRED] REQ-CLI-047**: ~~If a component file does not exist, the assembly
engine MUST print a warning and skip that component (not crash).~~

**[RETIRED] REQ-CLI-048**: ~~Sections for which no component is resolved
(e.g., no taxonomies) MUST be omitted from the output entirely.~~

**[RETIRED] REQ-CLI-049**: ~~Parameter substitution MUST replace ALL
occurrences of `{{key}}` with the provided value for each key in the params
object.~~

**[RETIRED] REQ-CLI-050**: ~~Parameter substitution MUST be applied after all
component concatenation (i.e., params can appear in any component, not just
the template body).~~

**[RETIRED] REQ-CLI-051**: ~~The assembly engine MUST NOT add a `# Non-Goals`
section.~~

### 2.6 Manifest Resolution [RETIRED]

*This entire section is retired. The manifest resolution module
(`manifest.js`) has been removed. The LLM reads `manifest.yaml` directly
when following `bootstrap.md`. The `list` command uses inline manifest
parsing (see REQ-CLI-103). See REQ-CLI-101.*

**[RETIRED] REQ-CLI-060**: ~~The manifest loader MUST parse `manifest.yaml`
using `js-yaml` and return the parsed object.~~

**[RETIRED] REQ-CLI-061**: ~~`getTemplates()` MUST flatten the manifest's
nested `templates` structure (keyed by category) into a flat array,
attaching the `category` field to each template entry.~~

**[RETIRED] REQ-CLI-062**: ~~`getPersona()` MUST look up a persona by `name`
field in the `personas` array.~~

**[RETIRED] REQ-CLI-063**: ~~`getProtocol()` MUST look up a protocol by short
name across all protocol categories (guardrails, analysis, reasoning).~~

**[RETIRED] REQ-CLI-064**: ~~`getFormat()` MUST look up a format by `name`
field in the `formats` array.~~

**[RETIRED] REQ-CLI-065**: ~~`getTaxonomy()` MUST look up a taxonomy by
`name` field in the `taxonomies` array.~~

**[RETIRED] REQ-CLI-066**: ~~`resolveTemplateDeps()` MUST resolve all four
dependency types (persona, protocols, format, taxonomies) for a given
template entry, returning an object
`{ persona, protocols, taxonomies, format }`.~~

**[RETIRED] REQ-CLI-067**: ~~If a protocol referenced by a template is not
found in the manifest, `resolveTemplateDeps()` MUST print a warning and
exclude it from the returned protocols array.~~

**[RETIRED] REQ-CLI-068**: ~~If a taxonomy referenced by a template is not
found in the manifest, `resolveTemplateDeps()` MUST print a warning and
exclude it from the returned taxonomies array.~~

**[RETIRED] REQ-CLI-069**: ~~Template matching in the `assemble` command MUST
use exact string matching on the `name` field (case-sensitive).~~

### 2.7 Content Bundling

**REQ-CLI-070**: The `copy-content.js` script MUST copy the following
directories from the repository root to `cli/content/`: `personas`,
`protocols`, `formats`, `templates`, `taxonomies`.
- *Source*: `copy-content.js` line 14.
- *Acceptance*: After running, `cli/content/` contains all five directories.

**REQ-CLI-071**: The `copy-content.js` script MUST copy the following
individual files from the repository root to `cli/content/`:
`manifest.yaml`, `bootstrap.md`.
- *Source*: `copy-content.js` lines 15, 46–50.
- *Acceptance*: After running, `cli/content/manifest.yaml` and
  `cli/content/bootstrap.md` exist.

**REQ-CLI-072**: When copying directories, the script MUST only copy files
with `.md` or `.yaml` extensions, skipping all other file types.
- *Source*: `copy-content.js` line 25.
- *Acceptance*: A `.png` file in `personas/` is not copied.

**REQ-CLI-073**: The script MUST delete and recreate the `cli/content/`
directory before copying to ensure a clean state.
- *Source*: `copy-content.js` lines 40–43.
- *Acceptance*: Stale files from a previous copy are removed.

**REQ-CLI-074**: The script MUST validate that `manifest.yaml` exists at the
repository root before proceeding, and exit with code 1 if not found.
- *Source*: `copy-content.js` lines 32–37.
- *Acceptance*: Running from outside the repo prints an error and exits 1.

**REQ-CLI-075**: The script MUST print a summary of how many entries were
copied upon completion.
- *Source*: `copy-content.js` lines 69–70.
- *Acceptance*: Output includes `"Copied PromptKit content to cli/content/"`.

**REQ-CLI-076**: The `copy-content.js` script MUST run automatically on
`npm publish` (via `prepublishOnly`) and `npm install` from git (via
`prepare`).
- *Source*: `package.json` lines 20–21.
- *Acceptance*: `npm pack` triggers the script; `prepare` hook runs on
  `npm install` from the repository.

### 2.8 Distribution

**REQ-CLI-080**: The npm package MUST include only `bin/`, `lib/`, and
`content/` directories (plus package.json). The `lib/` directory MUST
contain only `launch.js`.
- *Source*: `package.json` lines 14–18 (`files` field).
- *Acceptance*: `npm pack --dry-run` lists only files under those
  directories. `lib/` contains only `launch.js`.

**REQ-CLI-081**: The `content/` directory MUST be gitignored since it is
generated at build time.
- *Source*: `.gitignore` line 2.
- *Acceptance*: `git status` does not show `content/` as untracked.

**REQ-CLI-082**: The package MUST be published with public access under the
`@alan-jowett` scope.
- *Source*: `package.json` lines 30–32 (`publishConfig`).
- *Acceptance*: `npm publish` uses `access: public`.

---

## 3. Non-Functional Requirements

### 3.1 Compatibility

**REQ-CLI-090**: The CLI MUST require Node.js >= 18.0.0.
- *Source*: `package.json` line 29 (`engines`).
- *Acceptance*: Running on Node 16 produces an engine-mismatch warning.

**REQ-CLI-091**: The CLI MUST work on Windows, macOS, and Linux.
- *Source*: `launch.js` line 13 (platform-aware `where` vs `which`).
- *Acceptance*: CLI runs successfully on all three platforms.

### 3.2 Error Handling

**[RETIRED] REQ-CLI-092**: ~~The CLI MUST NOT crash with an unhandled
exception when a referenced component file is missing; it MUST print a
warning and continue.~~

*Retired: The CLI no longer loads component files. The LLM handles missing
components when following `bootstrap.md`.*

**REQ-CLI-093**: The CLI MUST exit with a non-zero code on all error paths
(missing content, missing CLI, spawn failure).
- *Source*: `cli.js`; `launch.js` lines 69, 104, 119.
- *Acceptance*: All error paths produce exit code 1.

### 3.3 Dependencies

**REQ-CLI-094**: The CLI MUST have exactly two runtime dependencies:
`commander` (^12.0.0) and `js-yaml` (^4.1.0). All other modules used MUST
be Node.js built-ins.
- *Source*: `package.json` lines 23–26.
- *Acceptance*: `package.json` lists exactly these two dependencies.

---

## 4. Constraints

**CON-001**: The CLI MUST NOT modify any source files in the PromptKit
repository. It reads from bundled content only.

**CON-002**: The CLI MUST NOT require network access for any operation.
All data is local (bundled content or local manifest).

**CON-003**: The CLI MUST NOT embed API keys, authentication tokens, or
any secrets. LLM authentication is handled by the external CLI.

**CON-004**: The CLI MUST NOT persist state between invocations. Each run
is stateless.

**[RETIRED] CON-005**: ~~The assembly engine MUST NOT summarize, abbreviate,
or condense component content — it includes body text verbatim (minus
frontmatter/comments).~~

*Retired: Assembly engine removed. The equivalent rule exists in
`bootstrap.md`'s Verbatim Inclusion Rule.*

---

## 5. Assumptions

**[ASSUMPTION-001]**: The manifest structure uses nested objects for
`templates` (keyed by category) and `protocols` (keyed by category), but
flat arrays for `personas`, `formats`, and `taxonomies`. This structure is
assumed stable.

**[RETIRED] [ASSUMPTION-002]**: ~~Template entries in the manifest contain at
minimum `name`, `description`, `path`, `persona`, and optionally
`protocols`, `format`, and `taxonomies` fields. The exact schema is not
validated by the CLI. [UNDOCUMENTED]~~

*Retired: The CLI no longer resolves template dependencies. The LLM reads
template entries directly.*

**[ASSUMPTION-003]**: The `--cli` flag for the `interactive` command
accepts values matching the switch cases in `launch.js`: `"copilot"`,
`"gh-copilot"`, `"claude"`. Other values cause exit with code 1. These
valid values SHOULD be documented in help text (see REQ-CLI-011).

**[ASSUMPTION-004]**: The `copyContentToTemp` function copies the entire
content directory recursively, including all file types — unlike
`copy-content.js` which filters to `.md` and `.yaml` only. This means
the temp directory may contain files not present in the npm package if
run from a development environment. [INFERRED]

**[ASSUMPTION-005]**: The `prepare` npm script runs `copy-content.js` on
`npm install` when installing from a git URL or local path, but NOT when
installing from the npm registry (where `content/` is already packed).
This relies on standard npm lifecycle behavior.

**[RETIRED] [ASSUMPTION-006]**: ~~The frontmatter stripping regex
(`/^---\r?\n[\s\S]*?\r?\n---\r?\n/`) assumes frontmatter starts at the
very beginning of the file (after HTML comment stripping). Content files
with frontmatter not at the start will not be stripped. [INFERRED]~~

*Retired: Assembly engine removed — frontmatter stripping no longer
applies to CLI code.*

---

## 6. New Requirements (v0.2)

**REQ-CLI-100**: The CLI MUST NOT expose an `assemble` command. Running
`promptkit assemble` MUST produce a Commander help/error message, not
invoke any assembly logic.
- *Acceptance*: `promptkit assemble anything` produces an error or help
  message; no assembly output is generated.

**REQ-CLI-101**: The published npm package MUST NOT contain `assemble.js`
or `manifest.js` in the `lib/` directory.
- *Acceptance*: `npm pack --dry-run` does not list `lib/assemble.js` or
  `lib/manifest.js`.

**REQ-CLI-103**: The `list` command MUST use inline manifest parsing within
`cli.js` (reading and parsing `manifest.yaml` with `js-yaml` directly). It
MUST NOT depend on a separate `manifest.js` module.
- *Acceptance*: `cli.js` does not `require` or `import` any `manifest`
  module. The `list` command functions correctly with only `cli.js`,
  `launch.js`, `commander`, and `js-yaml`.

---

## 7. Acceptance Criteria Summary

Each REQ-CLI-NNN includes inline acceptance criteria. The following are
cross-cutting acceptance criteria:

**AC-001**: Both commands (`interactive` and `list`) are reachable and
documented in `--help` output.

**[RETIRED] AC-002**: ~~The `assemble` command produces output identical to
what the assembly process described in `bootstrap.md` specifies (section
order, separators, frontmatter stripping, verbatim inclusion).~~

**AC-003**: The CLI exits cleanly (no orphan processes, no leftover temp
dirs) in all normal and error scenarios.

**AC-004**: `npm pack` produces a tarball containing `bin/cli.js`,
`lib/launch.js`, and `content/` with all prompt components. The tarball
MUST NOT contain `lib/assemble.js` or `lib/manifest.js`.

**AC-005**: The CLI runs without errors on Node.js 18, 20, and 22.