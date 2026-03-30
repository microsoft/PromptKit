---
title: "PromptKit CLI — Design Specification"
project: "PromptKit CLI (@alan-jowett/promptkit)"
version: "0.3.0"
date: "2025-07-17"
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

---

## 1. Architecture Overview

### 1.1 Module Structure

The CLI consists of four runtime modules and one build-time script:

```
cli/
├── bin/
│   └── cli.js            # Entry point — command routing (Commander.js)
├── lib/
│   ├── assemble.js       # Assembly engine — component loading & composition
│   ├── manifest.js       # Manifest parsing & dependency resolution
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
├── lib/manifest.js
│   └── js-yaml         (external: YAML parsing)
├── lib/assemble.js
│   └── lib/manifest.js (resolveTemplateDeps)
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
   │  (Commander) │
   └──────┬───────┘
          │
    ┌─────┼─────────────────┐
    ▼     ▼                 ▼
interactive  list         assemble <template>
    │        │                │
    │        │         loadManifest()
    │        │         getTemplates()
    │    loadManifest() find template
    │    getTemplates() assemble()
    │    display         │
    │                    ├── resolveTemplateDeps()
    │                    ├── loadComponent() × N
    │                    ├── concatenate sections
    │                    ├── substituteParams()
    │                    └── return assembled string
    │                         │
    │                    writeFileSync()
    │                    report summary
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
  [INFERRED — the function is called inside each action, not at top level]

**Key function**:

```
ensureContent() → void | process.exit(1)
```
Checks for `manifest.yaml` in the content directory. Guards all commands.

**Parameter collection**:

```
collectParams(value: string, previous: object) → object
```
Accumulates `-p key=value` flags into an object. Splits on the first `=`
to allow values containing `=`. Commander calls this reducer for each
`--param` occurrence.

**Implements**: REQ-CLI-001 through REQ-CLI-004, REQ-CLI-030 through
REQ-CLI-037.

### 2.2 assemble.js — Assembly Engine

**Responsibility**: Load PromptKit components from disk, strip metadata,
concatenate into an assembled prompt, and substitute parameters.

**Design decisions**:
- Frontmatter stripping uses a regex (`/^---\r?\n[\s\S]*?\r?\n---\r?\n/`)
  that handles both Unix (`\n`) and Windows (`\r\n`) line endings.
- HTML comment stripping uses a `while` loop to handle multiple consecutive
  comments (e.g., SPDX header + another comment).
- The section ordering (Identity → Protocols → Taxonomy → Format → Task)
  mirrors the Assembly Process defined in `bootstrap.md`, ensuring CLI
  output matches LLM-generated output.
- Parameter substitution uses string splitting (`split(placeholder).join(value)`)
  rather than regex replacement to avoid special regex character issues in
  parameter values.
- `resolveTemplateDeps()` is imported lazily inside `assemble()` to avoid
  circular dependency issues. [INFERRED — the `require("./manifest")` is
  inside the function body, not at module scope]

**Key functions**:

```
stripFrontmatter(content: string) → string
```
Removes YAML frontmatter block from the start of content. Returns trimmed
body.

```
loadComponent(contentDir: string, componentPath: string) → string | null
```
Reads a component file, strips HTML comments and frontmatter. Returns the
body text or `null` if the file does not exist. The `componentPath` is
relative to `contentDir` and comes from the manifest's `path` field.

```
substituteParams(content: string, params: object) → string
```
Replaces all `{{key}}` placeholders with corresponding values.

```
assemble(contentDir: string, manifest: object, templateEntry: object,
         params?: object) → string
```
Main assembly pipeline:
1. Call `resolveTemplateDeps()` to get persona, protocols, taxonomies, format
2. Load each component via `loadComponent()`
3. Build sections array with headers (`# Identity`, etc.)
4. Join sections with `\n\n---\n\n`
5. Apply parameter substitution
6. Return assembled string

**Implements**: REQ-CLI-040 through REQ-CLI-051.

### 2.3 manifest.js — Manifest Parsing & Dependency Resolution

**Responsibility**: Parse `manifest.yaml` and provide lookup functions for
each component type.

**Design decisions**:
- Uses `js-yaml` (^4.1.0) for YAML parsing — it is the most widely used
  YAML parser for Node.js, supports YAML 1.2, and has no native
  dependencies.
- The manifest has different structures for different component types:
  - `personas`, `formats`, `taxonomies`: flat arrays of objects
  - `protocols`: object keyed by category (`guardrails`, `analysis`,
    `reasoning`), each containing an array
  - `templates`: object keyed by category, each containing an array
- `getProtocol()` searches across all protocol categories, flattening
  the category hierarchy. This aligns with the convention that manifest
  entries use short names while template frontmatter uses category-prefixed
  paths.
- `resolveTemplateDeps()` uses the template entry's short-name protocol
  list (from the manifest), NOT the category-prefixed list from template
  frontmatter. This is intentional and aligns with the manifest-as-source-
  of-truth principle.
- Missing dependencies produce `console.warn()` and are filtered out, not
  thrown as errors. This makes the system resilient to partial manifests
  but can hide configuration bugs silently. [INFERRED — this is a
  deliberate tolerance vs. strictness tradeoff]

**Key functions**:

```
loadManifest(contentDir: string) → object
```
Reads and parses `manifest.yaml`. Throws on malformed YAML.

```
getTemplates(manifest: object) → Array<{name, description, category, ...}>
```
Flattens nested template structure into a flat array with `category`
attached.

```
getPersona(manifest: object, name: string) → object | undefined
getProtocol(manifest: object, shortName: string) → object | null
getFormat(manifest: object, name: string) → object | undefined
getTaxonomy(manifest: object, name: string) → object | undefined
```
Lookup functions. Note inconsistency: `getProtocol` returns `null` on
miss while others return `undefined`. [UNDOCUMENTED]

```
resolveTemplateDeps(manifest: object, template: object)
  → { persona, protocols: Array, taxonomies: Array, format }
```
Resolves all component dependencies for a template. Missing items produce
warnings and are excluded.

**Implements**: REQ-CLI-060 through REQ-CLI-069.

### 2.4 launch.js — LLM CLI Detection & Interactive Launch

**Responsibility**: Detect LLM CLIs on PATH, stage content, and spawn an
interactive session.

**Design decisions**:
- CLI detection uses `execFileSync` with `where` (Windows) or `which`
  (Unix) — this is the most reliable cross-platform way to check if a
  command exists on PATH without actually executing it.
- The detection order (copilot → gh-copilot → claude) prioritizes GitHub
  Copilot CLI as the primary target. The `gh copilot` variant is checked
  by actually running `gh copilot --help` to verify the extension is
  installed, not just that `gh` exists.
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

**Key functions**:

```
isOnPath(cmd: string) → boolean
```
Internal helper. Checks if a command exists on PATH using platform-
appropriate lookup.

```
detectCli() → "copilot" | "gh-copilot" | "claude" | null
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

### 3.1 Assembly Pipeline (assemble command)

```
                          manifest.yaml
                              │
                     loadManifest() ──── parse YAML
                              │
                     getTemplates() ──── flatten by category
                              │
                     find template by name
                              │
              resolveTemplateDeps(manifest, template)
                    │         │          │        │
             getPersona  getProtocol  getFormat getTaxonomy
                    │     (× N)        │       (× N)
                    ▼         ▼          ▼        ▼
              { persona, protocols[], format, taxonomies[] }
                    │         │          │        │
              loadComponent() for each dependency
                    │         │          │        │
              strip HTML comments
              strip YAML frontmatter
              trim whitespace
                    │         │          │        │
                    ▼         ▼          ▼        ▼
              Build sections array:
              ┌─────────────────────────────────────┐
              │ "# Identity\n\n" + persona body     │
              │ "# Reasoning Protocols\n\n" + ...   │
              │ "# Classification Taxonomy\n\n" + . │
              │ "# Output Format\n\n" + format body │
              │ "# Task\n\n" + template body        │
              └─────────────────────────────────────┘
                              │
                    join with "\n\n---\n\n"
                              │
                    substituteParams(assembled, params)
                              │
                    ▼ final assembled string
                              │
                    writeFileSync(outputPath)
```

### 3.2 Interactive Launch Pipeline

```
     User runs `promptkit` or `promptkit interactive`
                         │
                   ensureContent()
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

### 3.3 Content Bundling Pipeline (build-time)

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
of the box. Zero-config for the CLI's three-command structure.
**Alternatives considered**: yargs, meow, manual `process.argv` parsing.
Commander was chosen for its simplicity and convention-over-configuration
approach. [INFERRED]

### 4.2 js-yaml for YAML Parsing

**Decision**: Use js-yaml (^4.1.0) for parsing `manifest.yaml`.
**Rationale**: Pure JavaScript, no native dependencies, YAML 1.2 compliant.
The manifest is the only YAML the CLI parses at runtime (frontmatter is
stripped by regex, not parsed). [INFERRED — frontmatter regex vs YAML
parsing are separate paths]

### 4.3 Temp Directory for Interactive Launch

**Decision**: Copy all content to `os.tmpdir()` before spawning the LLM CLI.
**Rationale**: LLM CLIs read files relative to their CWD. The npm package
installs content in an unpredictable location (`node_modules/`). Copying
to a temp directory gives the LLM a clean, predictable file layout.
**Tradeoff**: Adds startup latency (recursive copy) and creates cleanup
obligations. The redundancy analysis identifies this as an "awkward
workaround." [KNOWN GAP — see Section 7]

### 4.4 Verbatim Inclusion (No Summarization)

**Decision**: Include component body text exactly as written, removing only
frontmatter and SPDX comments.
**Rationale**: Matches the Verbatim Inclusion Rule in `bootstrap.md`.
Summarization loses operational detail that LLMs need (checklists, phase
sub-steps, known-safe patterns).
**Implication**: Assembled prompts can be large. No truncation or
condensation is applied.

### 4.5 Warn-and-Continue for Missing Dependencies

**Decision**: Print `console.warn()` and skip missing components rather
than throwing errors.
**Rationale**: Makes the CLI resilient to partial manifests and incremental
development. A template can reference a not-yet-created protocol without
breaking the entire assembly.
**Tradeoff**: Can silently produce incomplete prompts if a manifest has
typos.

### 4.6 Build-Time Content Bundling

**Decision**: Use npm lifecycle scripts to bundle content rather than
referencing the repo root at runtime.
**Rationale**: npm packages cannot reference files outside their package
directory. Content must be physically included in the package. The
`prepare` hook ensures this works for both `npm publish` and
`npm install` from git.

---

## 5. Interface Contracts

### 5.1 CLI Interface (User-Facing)

```
promptkit [command] [options]

Commands:
  interactive [--cli <name>]           Launch interactive LLM session (default)
  list [--json]                        List available templates
  assemble <template> [-o file] [-p k=v ...]  Assemble a prompt

Global options:
  -V, --version                        Output version number
  -h, --help                           Display help
```

### 5.2 Module Exports

**manifest.js**:
```javascript
module.exports = {
  loadManifest,       // (contentDir: string) → object
  getTemplates,       // (manifest: object) → Array<object>
  getPersona,         // (manifest: object, name: string) → object | undefined
  getProtocol,        // (manifest: object, shortName: string) → object | null
  getFormat,          // (manifest: object, name: string) → object | undefined
  getTaxonomy,        // (manifest: object, name: string) → object | undefined
  resolveTemplateDeps // (manifest: object, template: object) → {persona, protocols, taxonomies, format}
}
```

**assemble.js**:
```javascript
module.exports = {
  assemble,           // (contentDir, manifest, templateEntry, params?) → string
  loadComponent,      // (contentDir, componentPath) → string | null
  stripFrontmatter    // (content: string) → string
}
```

**launch.js**:
```javascript
module.exports = {
  detectCli,          // () → "copilot" | "gh-copilot" | "claude" | null
  launchInteractive,  // (contentDir: string, cliName: string | null) → never
  copyContentToTemp   // (contentDir: string) → string (tmpDir path)
}
```

### 5.3 Manifest Schema (Expected Input)

The CLI expects `manifest.yaml` to conform to this structure:

```yaml
version: string

personas:
  - name: string
    path: string        # relative to content dir
    description: string

protocols:
  <category>:           # e.g., guardrails, analysis, reasoning
    - name: string      # short name (no category prefix)
      path: string
      description: string

formats:
  - name: string
    path: string
    description: string

taxonomies:
  - name: string
    path: string
    description: string

templates:
  <category>:           # e.g., engineering, investigation
    - name: string
      path: string
      description: string
      persona: string   # references personas[].name
      protocols: [string]  # references protocols[*][].name (short names)
      format: string    # references formats[].name (optional)
      taxonomies: [string] # references taxonomies[].name (optional)
```

[ASSUMPTION — this schema is inferred from code behavior; no formal
schema definition exists in the codebase]

### 5.4 Assembled Output Format

```markdown
# Identity

<persona body — verbatim>

---

# Reasoning Protocols

<protocol 1 body — verbatim>

---

<protocol 2 body — verbatim>

---

# Classification Taxonomy

<taxonomy body — verbatim>

---

# Output Format

<format body — verbatim>

---

# Task

<template body — params substituted>
```

Sections are omitted if their component is absent (e.g., no taxonomy
referenced → no `# Classification Taxonomy` section).

---

## 6. Dependencies

### 6.1 External Dependencies (Runtime)

| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| commander | ^12.0.0 | CLI argument parsing, subcommands, help | MIT |
| js-yaml | ^4.1.0 | YAML parsing for manifest.yaml | MIT |

### 6.2 Node.js Built-in Dependencies

| Module | Used By | Purpose |
|--------|---------|---------|
| `fs` | all modules | File system operations |
| `path` | all modules | Path resolution and joining |
| `os` | launch.js | `os.tmpdir()` for temp directory |
| `child_process` | launch.js | `execFileSync` (CLI detection), `spawn` (launch) |

### 6.3 Internal Dependencies (PromptKit Content)

| File/Directory | Required By | Purpose |
|----------------|-------------|---------|
| `manifest.yaml` | manifest.js, cli.js (ensureContent) | Component index, source of truth |
| `bootstrap.md` | launch.js (indirectly) | Bootstrap prompt sent to LLM |
| `personas/*.md` | assemble.js | Persona component files |
| `protocols/**/*.md` | assemble.js | Protocol component files |
| `formats/*.md` | assemble.js | Format component files |
| `templates/**/*.md` | assemble.js | Template component files |
| `taxonomies/*.md` | assemble.js | Taxonomy component files |

### 6.4 External Tool Dependencies (Runtime, Optional)

| Tool | Required For | Detection |
|------|-------------|-----------|
| `copilot` CLI | interactive command | `where`/`which` on PATH |
| `gh` CLI + copilot extension | interactive command | `where`/`which` + `gh copilot --help` |
| `claude` CLI | interactive command | `where`/`which` on PATH |

---

## 7. Known Gaps

These gaps are identified from the redundancy analysis (`cli_analysis.md`)
and source code review.

### 7.1 Redundancy with bootstrap.md

**GAP-001: Manifest resolution logic is duplicated.**
`manifest.js` reimplements the dependency resolution that `bootstrap.md`
instructs the LLM to perform. Two implementations of the same logic
create divergence risk. If a new component type is added to the manifest,
both `manifest.js` AND `bootstrap.md` must be updated.
- *Affects*: REQ-CLI-060 through REQ-CLI-068.
- *Recommendation*: The CLI should remain a thin launcher; manifest
  resolution for `assemble` is its unique value for CI/scripting use.

**GAP-002: Assembly engine is mostly redundant.**
`assemble.js` implements the same assembly pipeline described in
`bootstrap.md`'s Assembly Process section. The CLI's assembly is
deterministic and offline (its advantage), but cannot handle dynamic
protocols, parameterized personas, or interactive templates.
- *Affects*: REQ-CLI-040 through REQ-CLI-051.
- *Recommendation*: Keep for CI/scripting; document limitations.

### 7.2 Feature Gaps

**GAP-003: No Non-Goals section.**
`bootstrap.md` specifies a `# Non-Goals` section in assembled output.
The CLI's assembly engine does not produce this section.
- *Affects*: REQ-CLI-051, REQ-CLI-043.

**GAP-004: No interactive template mode support.**
Templates with `mode: interactive` in frontmatter are not handled
specially by the CLI's `assemble` command. They are assembled like any
other template.
- *Affects*: REQ-CLI-030.

**GAP-005: No agent instruction file output mode.**
`bootstrap.md` supports an "agent instruction file" output mode that
produces platform-specific instruction files. The CLI only produces raw
prompt output.
- *Affects*: REQ-CLI-030 (scope limitation).

**GAP-006: No manifest schema validation.**
The CLI does not validate the structure of `manifest.yaml` beyond
checking for its existence. Malformed manifests may produce confusing
runtime errors.
- *Affects*: REQ-CLI-060.

**GAP-007: No pipeline support.**
`bootstrap.md` supports pipelines where template outputs chain as
inputs. The CLI's `assemble` command treats each template independently.
- *Affects*: REQ-CLI-030 (scope limitation).

### 7.3 Implementation Concerns

**GAP-008: copyContentToTemp copies all file types.**
`launch.js`'s `copyDirRecursive` copies every file, while
`copy-content.js` filters to `.md`/`.yaml`. If the content directory
somehow contains non-prompt files, they would be copied to temp.
[INFERRED — in practice, the content directory is populated by
`copy-content.js` which already filters, so this is low risk]

**GAP-009: Inconsistent return types for lookup functions.**
`getProtocol()` returns `null` on miss, while `getPersona()`,
`getFormat()`, and `getTaxonomy()` return `undefined` (via
`Array.find()`). This is a minor consistency issue.
- *Affects*: REQ-CLI-062 through REQ-CLI-065.

**GAP-010: The `--cli` flag accepts undocumented values.**
Valid values for `--cli` (`copilot`, `gh-copilot`, `claude`) are not
listed in help text. Passing an invalid value triggers the `default`
case with exit(1), but the error message is minimal.
- *Affects*: REQ-CLI-011, ASSUMPTION-003.

**GAP-011: Template name matching is case-sensitive and undocumented.**
The `assemble` command uses exact string matching (`===`) for template
names. There is no fuzzy matching, suggestion, or case-insensitive
fallback.
- *Affects*: REQ-CLI-069.
