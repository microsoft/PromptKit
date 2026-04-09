---
title: "PromptKit CLI — Design Specification"
project: "PromptKit CLI (@alan-jowett/promptkit)"
version: "0.6.1"
date: "2026-04-07"
status: draft
related:
  - requirements: cli/specs/requirements.md
  - validation: cli/specs/validation.md
---

# PromptKit CLI — Design Specification

## Revision History

| Rev | Date | Author | Description |
|-----|------|--------|-------------|
| 0.1 | 2025-07-17 | Spec-extraction-workflow | Initial draft extracted from source code |
| 0.2 | 2025-07-18 | Engineering-workflow Phase 2 | Removed assemble.js module design (§2.2), manifest.js module design (§2.3), assembly pipeline data flow (§3.1). Updated cli.js design for two commands with inline manifest parsing. Updated module structure, dependency graph, command flow, interface contracts, dependencies. Resolved GAP-001 through GAP-007, GAP-009, GAP-011. |
| 0.6.1 | 2026-04-07 | Maintenance audit (F-003) | Bumped version to match requirements.md and package.json. No design changes — version alignment only. |

---

## 1. Architecture Overview

### 1.1 Module Structure

The CLI consists of two runtime modules and one build-time script:

```
cli/
├── bin/
│   └── cli.js            # Entry point — command routing (Commander.js)
├── lib/
│   └── launch.js         # LLM CLI detection & interactive session launch
├── scripts/
│   └── copy-content.js   # Build-time content bundler (npm lifecycle)
├── content/              # [gitignored] Bundled PromptKit components
│   ├── manifest.yaml
│   ├── bootstrap.md
│   ├── personas/
│   ├── protocols/
│   ├── formats/
│   ├── templates/
│   └── taxonomies/
└── package.json
```

### 1.2 Dependency Graph (Runtime)

```
cli.js
├── commander           (external: CLI framework)
├── js-yaml             (external: YAML parsing for list command)
└── lib/launch.js
    └── child_process   (Node built-in)
```

All non-`commander`/`js-yaml` imports are Node.js built-ins: `fs`, `path`,
`os`, `child_process`.

### 1.3 Command Flow

```
User invokes `promptkit [command]`
          │
          ▼
   ┌─────────────┐
   │   cli.js     │──── ensureContent() ──── Content missing? → exit(1)
   │  (Commander) │     (checks bootstrap.md AND manifest.yaml)
   └──────┬───────┘
          │
    ┌─────┴─────┐
    ▼           ▼
interactive   list
    │           │
    │      read manifest.yaml (js-yaml)
    │      flatten templates by category
    │      display (human or --json)
    │
    ├── detectCli()
    ├── copyContentToTemp()
    └── spawn(cli, args, {cwd: tmpDir})
         │
         └── on exit: cleanup tmpDir, propagate exit code
```

---

## 2. Module Design

### 2.1 cli.js — Command Routing

**Responsibility**: Parse CLI arguments, route to the correct handler,
validate content availability.

**Design decisions**:
- Uses Commander.js (^12.0.0) for argument parsing — it is the de facto
  standard for Node.js CLIs, providing built-in help generation, version
  display, and subcommand support.
- The `interactive` command is marked `{ isDefault: true }` so bare
  `promptkit` invocations launch interactive mode.
- `ensureContent()` is called in every command's action handler (not
  globally) to ensure the check runs after Commander has parsed arguments.
  The check validates both `bootstrap.md` and `manifest.yaml` exist.
- The `list` command performs inline manifest parsing using `js-yaml` —
  it reads `manifest.yaml`, flattens the nested `templates` structure
  by category, and displays the result. No separate `manifest.js` module
  is used (see REQ-CLI-103).
- The `--cli` flag documents valid values (`copilot`, `gh-copilot`,
  `claude`, `codex`) in its help text (see REQ-CLI-011).

**Key function**:

```
ensureContent() → void | process.exit(1)
```
Checks for both `bootstrap.md` and `manifest.yaml` in the content
directory. Guards all commands.

**Implements**: REQ-CLI-001 through REQ-CLI-004, REQ-CLI-020 through
REQ-CLI-023, REQ-CLI-100, REQ-CLI-103.

### 2.2 assemble.js — Assembly Engine [RETIRED]

*This module has been removed. The assembly engine was redundant with
the Assembly Process defined in `bootstrap.md`. The LLM performs all
prompt assembly. See REQ-CLI-101.*

*Previously implemented*: REQ-CLI-040 through REQ-CLI-051 (all retired).

### 2.3 manifest.js — Manifest Parsing & Dependency Resolution [RETIRED]

*This module has been removed. The LLM reads `manifest.yaml` directly
when following `bootstrap.md`. The `list` command's manifest parsing
is inlined in `cli.js`. See REQ-CLI-101, REQ-CLI-103.*

*Previously implemented*: REQ-CLI-060 through REQ-CLI-069 (all retired).

### 2.4 launch.js — LLM CLI Detection & Interactive Launch

**Responsibility**: Detect LLM CLIs on PATH, stage content, and spawn an
interactive session.

**Design decisions**:
- CLI detection uses `execFileSync` with `where` (Windows) or `which`
  (Unix) — this is the most reliable cross-platform way to check if a
  command exists on PATH without actually executing it.
- The detection order (copilot → gh-copilot → claude → codex) prioritizes GitHub
  Copilot CLI as the primary target. The `gh copilot` variant is checked
  by actually running `gh copilot --help` to verify the extension is
  installed, not just that `gh` exists.
- On Windows, npm-installed CLIs such as `copilot`, `claude`, and `codex`
  may need their `.cmd` shims invoked explicitly because Node's
  `child_process.spawn()` does not resolve commands the same way an
  interactive shell does. The launcher therefore prefers `<name>.cmd`
  when present on `PATH`.
- Content is copied to a temp directory (`os.tmpdir()` + `mkdtempSync`)
  because LLM CLIs need to read the files from their CWD, and the npm
  package's `content/` directory may be in a read-only or non-obvious
  location. The temp directory approach ensures the LLM has a clean
  working directory with all content files.
- The child process is spawned with `stdio: "inherit"` so the user
  interacts directly with the LLM CLI. The parent Node.js process becomes
  a thin lifecycle manager.
- Signal forwarding on child exit (`process.kill(process.pid, signal)`)
  preserves the child's exit semantics for the parent's caller.
- Temp directory cleanup is wrapped in try/catch for best-effort cleanup —
  if deletion fails (e.g., file locks on Windows), the OS temp cleaner
  will eventually remove it.
- The "no CLI found" error message lists LLM CLI installation
  instructions and suggests manual loading of `bootstrap.md`. It does
  NOT reference a `promptkit assemble` fallback (see REQ-CLI-012).

**Key functions**:

```
isOnPath(cmd: string) → boolean
```
Internal helper. Checks if a command exists on PATH using platform-
appropriate lookup.

```
detectCli() → "copilot" | "gh-copilot" | "claude" | "codex" | null
```
Probes PATH for supported LLM CLIs in priority order.

```
copyContentToTemp(contentDir: string) → string
```
Copies entire content directory to a new temp directory. Returns the
temp directory path. Note: unlike `copy-content.js`, this copies ALL
files (no `.md`/`.yaml` filter). [INFERRED]

```
copyDirRecursive(src: string, dest: string) → void
```
Internal helper for recursive directory copy.

```
launchInteractive(contentDir: string, cliName: string | null) → void
```
Main entry point for interactive mode. Detects/validates CLI, stages
content, spawns child process, manages lifecycle. Never returns normally
— exits via `process.exit()`.

**Implements**: REQ-CLI-010 through REQ-CLI-019.

### 2.5 copy-content.js — Build-Time Content Bundler

**Responsibility**: Copy PromptKit library content from the repository
root into `cli/content/` for npm packaging.

**Design decisions**:
- Runs as an npm lifecycle script (`prepare` and `prepublishOnly`), not
  as a runtime module. This ensures content is always fresh when
  publishing or installing from source.
- Filters file copying to `.md` and `.yaml` extensions only, excluding
  images, binaries, and other non-prompt assets (e.g., `PromptKit-logo.png`).
- Uses a clean-and-recreate strategy (delete `content/`, mkdir, copy)
  to prevent stale files from previous builds.
- Path resolution uses `__dirname` to find the repo root (`../..` from
  `scripts/`), which assumes the standard repository layout.
- The count of copied entries is reported for verification.

**Implements**: REQ-CLI-070 through REQ-CLI-076.

---

## 3. Data Flow

### 3.1 Assembly Pipeline [RETIRED]

*This data flow has been removed. The assembly pipeline was implemented
by `assemble.js` and `manifest.js`, both of which have been deleted.
The LLM performs prompt assembly when following `bootstrap.md`.*

### 3.2 Interactive Launch Pipeline

```
     User runs `promptkit` or `promptkit interactive`
                         │
                   ensureContent()
                   (check bootstrap.md + manifest.yaml)
                         │
                   detectCli() ──── probe PATH
                         │
                   cliName || detected ──── null? → error + exit(1)
                         │
                   copyContentToTemp(contentDir)
                    │ recursive copy to os.tmpdir()
                    │ returns tmpDir path
                         │
                   construct cmd + args for detected CLI
                         │
                   spawn(cmd, args, {cwd: tmpDir, stdio: "inherit"})
                         │
                    ┌─────┴─────┐
                    │           │
                 on error    on exit
                    │           │
                 cleanup     cleanup tmpDir
                 tmpDir      exit(child.code) or
                 exit(1)     re-signal(child.signal)
```

### 3.3 List Pipeline

```
     User runs `promptkit list [--json]`
                         │
                   ensureContent()
                   (check bootstrap.md + manifest.yaml)
                         │
                   read manifest.yaml (fs.readFileSync)
                   parse with js-yaml
                         │
                   flatten templates by category
                   (iterate manifest.templates keys,
                    spread each item + add category field)
                         │
                    ┌─────┴─────┐
                    │           │
                 --json?     human-readable
                    │           │
                 JSON.stringify  group by category
                 → stdout       print headers + names
                                print usage hint
```

### 3.4 Content Bundling Pipeline (build-time)

```
     npm publish / npm install (from git)
                    │
          triggers `prepare` or `prepublishOnly`
                    │
          node scripts/copy-content.js
                    │
          validate manifest.yaml at repo root
                    │
          rm -rf cli/content/ && mkdir cli/content/
                    │
     ┌──────────────┼──────────────┐
     │              │              │
  copy files     copy dirs     (filter .md/.yaml)
  manifest.yaml  personas/
  bootstrap.md   protocols/
                 formats/
                 templates/
                 taxonomies/
                    │
          report count
```

---

## 4. Key Design Decisions

### 4.1 Commander.js for CLI Framework

**Decision**: Use Commander.js (^12.0.0) for argument parsing.
**Rationale**: Industry standard for Node.js CLIs. Provides automatic help
generation, version flags, subcommand support, and repeatable options out
of the box. Zero-config for the CLI's two-command structure.
**Alternatives considered**: yargs, meow, manual `process.argv` parsing.
Commander was chosen for its simplicity and convention-over-configuration
approach. [INFERRED]

### 4.2 js-yaml for YAML Parsing

**Decision**: Use js-yaml (^4.1.0) for parsing `manifest.yaml` in the
`list` command.
**Rationale**: Pure JavaScript, no native dependencies, YAML 1.2 compliant.
The manifest is the only YAML the CLI parses at runtime — it is read
inline by the `list` command in `cli.js` (no separate module).

### 4.3 Temp Directory for Interactive Launch

**Decision**: Copy all content to `os.tmpdir()` before spawning the LLM CLI.
**Rationale**: LLM CLIs read files relative to their CWD. The npm package
installs content in an unpredictable location (`node_modules/`). Copying
to a temp directory gives the LLM a clean, predictable file layout.
**Tradeoff**: Adds startup latency (recursive copy) and creates cleanup
obligations.

### 4.4 Inline Manifest Parsing for List Command

**Decision**: Parse `manifest.yaml` directly in `cli.js` rather than using
a separate `manifest.js` module.
**Rationale**: The `list` command only needs to read and flatten the
templates section of the manifest. This is ~10 lines of code (read file,
parse YAML, iterate categories, flatten). A separate module introduced
unnecessary abstraction and coupling — `manifest.js` also contained
dependency resolution functions (`getPersona`, `getProtocol`, etc.) that
are no longer needed since `assemble.js` has been removed. Inlining keeps
the code minimal and eliminates the module dependency.
**Tradeoff**: If manifest parsing logic grows in the future, it may need
to be extracted into a module. Currently, the inline approach is
proportionate to the complexity.

### 4.5 Build-Time Content Bundling

**Decision**: Use npm lifecycle scripts to bundle content rather than
referencing the repo root at runtime.
**Rationale**: npm packages cannot reference files outside their package
directory. Content must be physically included in the package. The
`prepare` hook ensures this works for both `npm publish` and
`npm install` from git.

### 4.6 LLM as Single Source of Truth for Assembly

**Decision**: Remove the CLI's assembly engine and delegate all prompt
assembly to the LLM via `bootstrap.md`.
**Rationale**: The CLI's `assemble.js` reimplemented the Assembly Process
from `bootstrap.md`, creating two implementations of the same logic that
had already diverged (bug #137). The CLI assembly could not handle
interactive templates, parameterized personas, dynamic protocols, or
Non-Goals sections — features the LLM handles naturally. Removing the
redundant implementation eliminates an entire class of maintenance burden
and divergence risk. The LLM is the single source of truth for assembly.
**Tradeoff**: Loss of deterministic, offline, no-LLM assembly for
CI/scripting use cases. Users without an LLM CLI can manually read and
assemble from the Markdown files.

---

## 5. Interface Contracts

### 5.1 CLI Interface (User-Facing)

```
promptkit [command] [options]

Commands:
  interactive [--cli <name>]           Launch interactive LLM session (default)
  list [--json]                        List available templates

Global options:
  -V, --version                        Output version number
  -h, --help                           Display help

Interactive options:
  --cli <name>      Override LLM CLI auto-detection
                    Valid values: copilot, gh-copilot, claude, codex
```

### 5.2 Module Exports

**launch.js**:
```javascript
module.exports = {
  detectCli,          // () → "copilot" | "gh-copilot" | "claude" | "codex" | null
  launchInteractive,  // (contentDir: string, cliName: string | null) → never
  copyContentToTemp   // (contentDir: string) → string (tmpDir path)
}
```

### 5.3 Manifest Schema (Expected Input)

The CLI expects `manifest.yaml` to conform to this structure (used by the
`list` command for template enumeration):

```yaml
version: string

templates:
  <category>:           # e.g., engineering, investigation
    - name: string
      description: string
      # ... other fields (ignored by list command)
```

The full manifest schema (including `personas`, `protocols`, `formats`,
`taxonomies`) is consumed by the LLM via `bootstrap.md`, not by the CLI.

[ASSUMPTION — this schema is inferred from code behavior; no formal
schema definition exists in the codebase]

### 5.4 Assembled Output Format [RETIRED]

*This section is retired. The CLI no longer produces assembled output.
Prompt assembly is performed by the LLM when following `bootstrap.md`.
See the Assembly Process section of `bootstrap.md` for the output format
specification.*

---

## 6. Dependencies

### 6.1 External Dependencies (Runtime)

| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| commander | ^12.0.0 | CLI argument parsing, subcommands, help | MIT |
| js-yaml | ^4.1.0 | YAML parsing for list command's manifest reading | MIT |

### 6.2 Node.js Built-in Dependencies

| Module | Used By | Purpose |
|--------|---------|---------|
| `fs` | cli.js, launch.js | File system operations |
| `path` | cli.js, launch.js | Path resolution and joining |
| `os` | launch.js | `os.tmpdir()` for temp directory |
| `child_process` | launch.js | `execFileSync` (CLI detection), `spawn` (launch) |

### 6.3 Internal Dependencies (PromptKit Content)

| File/Directory | Required By | Purpose |
|----------------|-------------|---------|
| `manifest.yaml` | cli.js (ensureContent, list command) | Component index for template listing |
| `bootstrap.md` | cli.js (ensureContent), launch.js (indirectly) | Bootstrap prompt sent to LLM |
| `personas/*.md` | LLM (via bootstrap.md) | Persona component files |
| `protocols/**/*.md` | LLM (via bootstrap.md) | Protocol component files |
| `formats/*.md` | LLM (via bootstrap.md) | Format component files |
| `templates/**/*.md` | LLM (via bootstrap.md) | Template component files |
| `taxonomies/*.md` | LLM (via bootstrap.md) | Taxonomy component files |

### 6.4 External Tool Dependencies (Runtime, Optional)

| Tool | Required For | Detection |
|------|-------------|-----------|
| `copilot` CLI | interactive command | `where`/`which` on PATH |
| `gh` CLI + copilot extension | interactive command | `where`/`which` + `gh copilot --help` |
| `claude` CLI | interactive command | `where`/`which` on PATH |

---

## 7. Known Gaps

### 7.1 Redundancy with bootstrap.md [RESOLVED]

**[RESOLVED] GAP-001: Manifest resolution logic is duplicated.**
*Resolved in v0.2: `manifest.js` has been removed. The LLM reads
`manifest.yaml` directly. The `list` command uses inline parsing.*

**[RESOLVED] GAP-002: Assembly engine is mostly redundant.**
*Resolved in v0.2: `assemble.js` has been removed. The LLM performs all
prompt assembly via `bootstrap.md`.*

### 7.2 Feature Gaps [RESOLVED or N/A]

**[RESOLVED] GAP-003: No Non-Goals section.**
*Resolved: The CLI no longer produces assembled output. The LLM includes
Non-Goals when following `bootstrap.md`.*

**[RESOLVED] GAP-004: No interactive template mode support.**
*Resolved: The CLI no longer assembles prompts. The LLM handles
interactive templates natively.*

**[RESOLVED] GAP-005: No agent instruction file output mode.**
*Resolved: The CLI no longer assembles prompts. The LLM handles all
output modes.*

**[RESOLVED] GAP-006: No manifest schema validation.**
*Resolved: The CLI no longer validates manifest structure beyond
existence checking. The LLM validates the manifest when reading it.*

**[RESOLVED] GAP-007: No pipeline support.**
*Resolved: The CLI no longer assembles prompts. The LLM handles
pipelines natively via `bootstrap.md`.*

### 7.3 Implementation Concerns

**GAP-008: copyContentToTemp copies all file types.**
`launch.js`'s `copyDirRecursive` copies every file, while
`copy-content.js` filters to `.md`/`.yaml`. If the content directory
somehow contains non-prompt files, they would be copied to temp.
[INFERRED — in practice, the content directory is populated by
`copy-content.js` which already filters, so this is low risk]

**[RESOLVED] GAP-009: Inconsistent return types for lookup functions.**
*Resolved: `manifest.js` has been removed. No lookup functions remain.*

**GAP-010: The `--cli` flag accepts undocumented values.**
Valid values for `--cli` (`copilot`, `gh-copilot`, `claude`) should be
listed in help text. This is addressed by the updated REQ-CLI-011 which
requires documenting valid values.
- *Affects*: REQ-CLI-011, ASSUMPTION-003.
- *Status*: To be resolved in implementation.

**[RESOLVED] GAP-011: Template name matching is case-sensitive and undocumented.**
*Resolved: The `assemble` command has been removed. Template name matching
is no longer a CLI concern.*
