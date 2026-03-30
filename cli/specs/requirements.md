---
title: "PromptKit CLI — Requirements Specification"
project: "PromptKit CLI (@alan-jowett/promptkit)"
version: "0.3.0"
date: "2025-07-17"
status: draft
source_files:
  - cli/bin/cli.js
  - cli/lib/assemble.js
  - cli/lib/manifest.js
  - cli/lib/launch.js
  - cli/scripts/copy-content.js
  - cli/package.json
---

# PromptKit CLI — Requirements Specification

## Revision History

| Rev | Date | Author | Description |
|-----|------|--------|-------------|
| 0.1 | 2025-07-17 | Spec-extraction-workflow | Initial draft extracted from source code |

---

## 1. Scope

### 1.1 What the CLI Is

The PromptKit CLI is a Node.js command-line tool (`@alan-jowett/promptkit`)
that provides three capabilities:

1. **Interactive launch** — detect an LLM CLI on PATH, stage PromptKit
   content, and spawn the LLM with the bootstrap prompt.
2. **Template listing** — enumerate available prompt templates from
   `manifest.yaml` for discovery.
3. **Programmatic assembly** — compose a complete prompt from PromptKit
   components (persona, protocols, taxonomies, format, template) with
   parameter substitution, producing a Markdown file.

The CLI also includes a **build-time content bundling** script that copies
PromptKit library content from the repository root into the npm package.

### 1.2 What the CLI Is NOT

- The CLI is NOT an LLM or AI tool — it launches external LLM CLIs.
- The CLI does NOT interpret or execute prompts — it assembles them.
- The CLI does NOT handle interactive-mode templates (`mode: interactive`)
  or agent instruction file output — those features exist only in the
  LLM-driven bootstrap.md workflow. [KNOWN GAP]
- The CLI does NOT support dynamic protocol addition, parameterized personas,
  or context-driven template selection — those are LLM-only capabilities.
  [KNOWN GAP]
- The CLI does NOT include a Non-Goals section in assembled output, unlike
  bootstrap.md's assembly process. [KNOWN GAP]

---

## 2. Functional Requirements

### 2.1 Command Structure

**REQ-CLI-001**: The CLI MUST expose a binary named `promptkit` via the
`bin` field in `package.json`.
- *Source*: `package.json` line 12.
- *Acceptance*: Running `npx @alan-jowett/promptkit --help` displays help text.

**REQ-CLI-002**: The CLI MUST provide three commands: `interactive`
(default), `list`, and `assemble`.
- *Source*: `cli.js` lines 36–129.
- *Acceptance*: `promptkit --help` lists all three commands; invoking
  `promptkit` with no arguments runs the `interactive` command.

**REQ-CLI-003**: The CLI MUST display its version from `package.json` when
invoked with `--version` or `-V`.
- *Source*: `cli.js` line 33 (Commander `.version(pkg.version)`).
- *Acceptance*: `promptkit --version` outputs `0.3.0` (or current version).

**REQ-CLI-004**: The CLI MUST validate that bundled content exists before
executing any command, and exit with code 1 and an error message if
`manifest.yaml` is not found in the content directory.
- *Source*: `cli.js` lines 15–23 (`ensureContent()`).
- *Acceptance*: Deleting `content/manifest.yaml` causes any command to
  print a content-not-found error and exit 1.

### 2.2 Interactive Command

**REQ-CLI-010**: The `interactive` command MUST detect a supported LLM CLI
on the system PATH using the detection order: `copilot` → `gh copilot` →
`claude`.
- *Source*: `launch.js` lines 21–35 (`detectCli()`).
- *Acceptance*: With only `claude` on PATH, `detectCli()` returns `"claude"`.

**REQ-CLI-011**: The `interactive` command MUST accept an optional `--cli
<name>` flag to override auto-detection.
- *Source*: `cli.js` line 39.
- *Acceptance*: `promptkit --cli claude` uses `claude` regardless of what
  is detected.

**REQ-CLI-012**: If no LLM CLI is detected and no `--cli` flag is provided,
the CLI MUST print an error listing installation instructions for supported
CLIs and exit with code 1.
- *Source*: `launch.js` lines 60–69.
- *Acceptance*: On a system with no supported CLI, `promptkit` prints
  install guidance and exits 1.

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
with the working directory set to the temporary content directory and
`stdio: "inherit"` so the user can interact directly.
- *Source*: `launch.js` lines 107–110.
- *Acceptance*: The child process has `cwd` equal to the temp directory
  and inherits stdin/stdout/stderr.

**REQ-CLI-016**: The `interactive` command MUST pass the bootstrap prompt
`"Read and execute bootstrap.md"` as the initial instruction to the LLM CLI.
- *Source*: `launch.js` line 86.
- *Acceptance*: The spawned process receives this string as an argument.

**REQ-CLI-017**: The CLI MUST construct the correct command and arguments
for each supported LLM CLI:
- `copilot`: `copilot -i "Read and execute bootstrap.md"`
- `gh-copilot`: `gh copilot -i "Read and execute bootstrap.md"`
- `claude`: `claude "Read and execute bootstrap.md"`
- *Source*: `launch.js` lines 89–105.
- *Acceptance*: Spawn is called with the documented cmd/args for each CLI.

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
- *Source*: `cli.js` lines 50–80.
- *Acceptance*: Output shows category headers and template names with
  descriptions.

**REQ-CLI-021**: The `list` command MUST support a `--json` flag that
outputs the template list as a JSON array.
- *Source*: `cli.js` lines 55–58.
- *Acceptance*: `promptkit list --json` produces valid JSON parseable by
  `JSON.parse()`.

**REQ-CLI-022**: The JSON output MUST include each template's `name`,
`description`, and `category` fields (plus any other fields from the
manifest entry).
- *Source*: `manifest.js` lines 16–24 (`getTemplates()` spreads the item
  and adds `category`).
- *Acceptance*: JSON output contains objects with at least `name`,
  `description`, `category`.

**REQ-CLI-023**: The human-readable list output MUST end with a usage hint
directing users to the `assemble` command.
- *Source*: `cli.js` lines 77–79.
- *Acceptance*: Output contains `"Use: promptkit assemble <template>"`.

### 2.4 Assemble Command

**REQ-CLI-030**: The `assemble` command MUST accept a required positional
argument `<template>` specifying the template name.
- *Source*: `cli.js` line 84.
- *Acceptance*: `promptkit assemble` with no template name produces a
  Commander error.

**REQ-CLI-031**: The `assemble` command MUST accept an `-o, --output <file>`
option with a default value of `"assembled-prompt.md"`.
- *Source*: `cli.js` line 87.
- *Acceptance*: Omitting `--output` writes to `assembled-prompt.md` in CWD.

**REQ-CLI-032**: The `assemble` command MUST accept repeatable `-p, --param
<key=value>` options to supply template parameters.
- *Source*: `cli.js` lines 88–92, 131–135 (`collectParams()`).
- *Acceptance*: `-p foo=bar -p baz=qux` results in `{foo: "bar", baz: "qux"}`.

**REQ-CLI-033**: Parameter values containing `=` signs MUST be handled
correctly by splitting only on the first `=`.
- *Source*: `cli.js` lines 132–134 (splits on first `=`, joins rest).
- *Acceptance*: `-p equation=a=b+c` results in `{equation: "a=b+c"}`.

**REQ-CLI-034**: If the specified template name does not match any template
in the manifest, the CLI MUST print an error listing all available template
names and exit with code 1.
- *Source*: `cli.js` lines 99–106.
- *Acceptance*: `promptkit assemble nonexistent` prints available templates
  and exits 1.

**REQ-CLI-035**: The `assemble` command MUST resolve the output path
relative to the current working directory using `path.resolve()`.
- *Source*: `cli.js` line 110.
- *Acceptance*: `--output ./out/prompt.md` resolves to an absolute path
  under CWD.

**REQ-CLI-036**: After successful assembly, the CLI MUST print a summary
including: output path, template name, persona name, protocol list, and
format name (if present).
- *Source*: `cli.js` lines 112–118.
- *Acceptance*: Output includes all five metadata fields.

**REQ-CLI-037**: After successful assembly, the CLI MUST scan the output for
unfilled `{{param}}` placeholders, report the count and names of unique
unfilled parameters, and suggest using `--param` to fill them.
- *Source*: `cli.js` lines 121–128.
- *Acceptance*: Assembling a template without providing required params
  shows the unfilled-param warning.

### 2.5 Assembly Engine

**REQ-CLI-040**: The assembly engine MUST strip YAML frontmatter
(delimited by `---` lines) from component files before inclusion.
- *Source*: `assemble.js` lines 9–15 (`stripFrontmatter()`).
- *Acceptance*: A component with `---\nname: foo\n---\nBody` yields `"Body"`.

**REQ-CLI-041**: The assembly engine MUST strip leading HTML comments
(e.g., SPDX license headers) from component files before inclusion.
- *Source*: `assemble.js` lines 24–28.
- *Acceptance*: A component starting with `<!-- SPDX -->` has the comment
  removed.

**REQ-CLI-042**: The assembly engine MUST strip ALL leading HTML comments,
not just the first one, handling consecutive comment blocks.
- *Source*: `assemble.js` lines 26–28 (`while` loop).
- *Acceptance*: A component with two consecutive HTML comments has both
  removed.

**REQ-CLI-043**: The assembly engine MUST concatenate components in a
fixed section order:
1. `# Identity` (persona)
2. `# Reasoning Protocols` (protocols, separated by `---`)
3. `# Classification Taxonomy` (taxonomies, separated by `---`)
4. `# Output Format` (format)
5. `# Task` (template body)
- *Source*: `assemble.js` lines 52–96.
- *Acceptance*: The assembled output contains sections in this exact order.

**REQ-CLI-044**: Sections MUST be separated by `\n\n---\n\n` (horizontal
rule with blank lines).
- *Source*: `assemble.js` line 98.
- *Acceptance*: Section separators match this exact string.

**REQ-CLI-045**: Multiple protocols within the Reasoning Protocols section
MUST be separated by `\n\n---\n\n`.
- *Source*: `assemble.js` line 66.
- *Acceptance*: Two protocols have a `---` separator between them.

**REQ-CLI-046**: Multiple taxonomies within the Classification Taxonomy
section MUST be separated by `\n\n---\n\n`.
- *Source*: `assemble.js` line 79.
- *Acceptance*: Two taxonomies have a `---` separator between them.

**REQ-CLI-047**: If a component file does not exist, the assembly engine
MUST print a warning and skip that component (not crash).
- *Source*: `assemble.js` lines 19–21.
- *Acceptance*: A missing persona file produces a warning but assembly
  completes.

**REQ-CLI-048**: Sections for which no component is resolved (e.g., no
taxonomies) MUST be omitted from the output entirely.
- *Source*: `assemble.js` lines 53, 61, 72, 85, 93 (conditional pushes).
- *Acceptance*: A template with no taxonomies has no "Classification
  Taxonomy" section.

**REQ-CLI-049**: Parameter substitution MUST replace ALL occurrences of
`{{key}}` with the provided value for each key in the params object.
- *Source*: `assemble.js` lines 34–39 (`substituteParams()`).
- *Acceptance*: `{{key}}` appearing twice is replaced in both locations.

**REQ-CLI-050**: Parameter substitution MUST be applied after all component
concatenation (i.e., params can appear in any component, not just the
template body).
- *Source*: `assemble.js` lines 100–103 (substitution after join).
- *Acceptance*: A `{{param}}` in a persona file is substituted.

**REQ-CLI-051**: The assembly engine MUST NOT add a `# Non-Goals` section.
[KNOWN GAP — bootstrap.md includes Non-Goals but the CLI does not]
- *Source*: `assemble.js` — no non-goals logic present.
- *Acceptance*: Assembled output does not contain a Non-Goals section.

### 2.6 Manifest Resolution

**REQ-CLI-060**: The manifest loader MUST parse `manifest.yaml` using
`js-yaml` and return the parsed object.
- *Source*: `manifest.js` lines 10–14.
- *Acceptance*: `loadManifest()` returns an object matching the YAML
  structure.

**REQ-CLI-061**: `getTemplates()` MUST flatten the manifest's nested
`templates` structure (keyed by category) into a flat array, attaching
the `category` field to each template entry.
- *Source*: `manifest.js` lines 16–24.
- *Acceptance*: Returned array contains objects with `category` and all
  original fields.

**REQ-CLI-062**: `getPersona()` MUST look up a persona by `name` field in
the `personas` array.
- *Source*: `manifest.js` lines 26–28.
- *Acceptance*: `getPersona(manifest, "systems-engineer")` returns the
  matching entry.

**REQ-CLI-063**: `getProtocol()` MUST look up a protocol by short name
across all protocol categories (guardrails, analysis, reasoning).
- *Source*: `manifest.js` lines 30–36.
- *Acceptance*: `getProtocol(manifest, "anti-hallucination")` finds the
  protocol regardless of its category.

**REQ-CLI-064**: `getFormat()` MUST look up a format by `name` field in the
`formats` array.
- *Source*: `manifest.js` lines 38–40.
- *Acceptance*: `getFormat(manifest, "investigation-report")` returns the
  matching entry.

**REQ-CLI-065**: `getTaxonomy()` MUST look up a taxonomy by `name` field in
the `taxonomies` array.
- *Source*: `manifest.js` lines 42–44.
- *Acceptance*: `getTaxonomy(manifest, "stack-lifetime-hazards")` returns
  the matching entry.

**REQ-CLI-066**: `resolveTemplateDeps()` MUST resolve all four dependency
types (persona, protocols, format, taxonomies) for a given template entry,
returning an object `{ persona, protocols, taxonomies, format }`.
- *Source*: `manifest.js` lines 46–69.
- *Acceptance*: A template with all four dependency types gets all resolved.

**REQ-CLI-067**: If a protocol referenced by a template is not found in the
manifest, `resolveTemplateDeps()` MUST print a warning and exclude it from
the returned protocols array.
- *Source*: `manifest.js` lines 53–57.
- *Acceptance*: A template referencing a non-existent protocol produces a
  warning but does not crash.

**REQ-CLI-068**: If a taxonomy referenced by a template is not found in the
manifest, `resolveTemplateDeps()` MUST print a warning and exclude it from
the returned taxonomies array.
- *Source*: `manifest.js` lines 62–65.
- *Acceptance*: A template referencing a non-existent taxonomy produces a
  warning.

**REQ-CLI-069**: Template matching in the `assemble` command MUST use exact
string matching on the `name` field (case-sensitive). [UNDOCUMENTED]
- *Source*: `cli.js` line 97 (`.find((t) => t.name === templateName)`).
- *Acceptance*: `Investigate-Bug` does not match `investigate-bug`.

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
`content/` directories (plus package.json).
- *Source*: `package.json` lines 14–18 (`files` field).
- *Acceptance*: `npm pack --dry-run` lists only files under those
  directories.

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
- *Source*: `launch.js` line 13 (platform-aware `where` vs `which`);
  `assemble.js` line 10 (handles `\r\n` in frontmatter regex).
- *Acceptance*: CLI runs successfully on all three platforms.

### 3.2 Error Handling

**REQ-CLI-092**: The CLI MUST NOT crash with an unhandled exception when a
referenced component file is missing; it MUST print a warning and continue.
- *Source*: `assemble.js` lines 19–21; `manifest.js` lines 53–57, 62–65.
- *Acceptance*: Missing component produces a warning, not a stack trace.

**REQ-CLI-093**: The CLI MUST exit with a non-zero code on all error paths
(missing content, missing template, missing CLI, spawn failure).
- *Source*: `cli.js` lines 21, 105; `launch.js` lines 69, 104, 119.
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

**CON-005**: The assembly engine MUST NOT summarize, abbreviate, or
condense component content — it includes body text verbatim (minus
frontmatter/comments).

---

## 5. Assumptions

**[ASSUMPTION-001]**: The manifest structure uses nested objects for
`templates` (keyed by category) and `protocols` (keyed by category), but
flat arrays for `personas`, `formats`, and `taxonomies`. This structure is
assumed stable.

**[ASSUMPTION-002]**: Template entries in the manifest contain at minimum
`name`, `description`, `path`, `persona`, and optionally `protocols`,
`format`, and `taxonomies` fields. The exact schema is not validated by
the CLI. [UNDOCUMENTED]

**[ASSUMPTION-003]**: The `--cli` flag for the `interactive` command
accepts values matching the switch cases in `launch.js`: `"copilot"`,
`"gh-copilot"`, `"claude"`. Other values cause exit with code 1. The set
of valid values is not documented in help text. [UNDOCUMENTED]

**[ASSUMPTION-004]**: The `copyContentToTemp` function copies the entire
content directory recursively, including all file types — unlike
`copy-content.js` which filters to `.md` and `.yaml` only. This means
the temp directory may contain files not present in the npm package if
run from a development environment. [INFERRED]

**[ASSUMPTION-005]**: The `prepare` npm script runs `copy-content.js` on
`npm install` when installing from a git URL or local path, but NOT when
installing from the npm registry (where `content/` is already packed).
This relies on standard npm lifecycle behavior.

**[ASSUMPTION-006]**: The frontmatter stripping regex
(`/^---\r?\n[\s\S]*?\r?\n---\r?\n/`) assumes frontmatter starts at the
very beginning of the file (after HTML comment stripping). Content files
with frontmatter not at the start will not be stripped. [INFERRED]

---

## 6. Acceptance Criteria Summary

Each REQ-CLI-NNN includes inline acceptance criteria. The following are
cross-cutting acceptance criteria:

**AC-001**: All three commands (`interactive`, `list`, `assemble`) are
reachable and documented in `--help` output.

**AC-002**: The `assemble` command produces output identical to what the
assembly process described in `bootstrap.md` specifies (section order,
separators, frontmatter stripping, verbatim inclusion).

**AC-003**: The CLI exits cleanly (no orphan processes, no leftover temp
dirs) in all normal and error scenarios.

**AC-004**: `npm pack` produces a tarball containing `bin/cli.js`,
`lib/*.js`, and `content/` with all prompt components.

**AC-005**: The CLI runs without errors on Node.js 18, 20, and 22.
