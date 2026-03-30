# Phase 1 — Requirements Discovery: Redundancy Removal

## Revision History

| Rev | Date | Author | Description |
|-----|------|--------|-------------|
| 0.1 | 2025-07-18 | Engineering-workflow Phase 1 | Initial requirements patch |

---

## 1. Restated Change

**USER-REQUEST**: Remove redundant code from the PromptKit CLI. The CLI
currently reimplements in ~200 lines of JS what `bootstrap.md` already
describes for the LLM in prose. The assembly engine (`assemble.js`),
manifest resolution (`manifest.js`), the `list` command, and the
`assemble` command should all be deleted. The CLI should become a thin
launcher (~100 lines total) that detects an LLM CLI, stages content,
spawns the LLM with `bootstrap.md`, and cleans up. Content bundling
(`copy-content.js`) and CLI infrastructure (`cli.js`) are kept but
simplified. `launch.js` keeps its core launcher responsibilities.

**Justification** (per `cli_analysis.md` and user request):
1. `assemble.js` reimplements the Assembly Process from `bootstrap.md`
   — two implementations have already diverged (bug #137).
2. `manifest.js` reimplements the dependency resolution the LLM performs
   when following `bootstrap.md` step 3.
3. The `list` command is trivially redundant — the LLM reads
   `manifest.yaml` directly.
4. The `assemble` command's engine is being removed, so the command
   itself must go.
5. The LLM should be the **single source of truth** for assembly logic.

**Initial understanding (Phase 1, superseded by Phase 2/3)**: The end
state proposed here is a CLI with one command (`interactive`, the
default), no `list` command, no `assemble` command, no `assemble.js`
module, no `manifest.js` module. `launch.js` is kept and simplified.
`copy-content.js` is kept. `cli.js` is simplified to route only the
`interactive` command. The user later decided to **keep the `list`
command** — see Phase 2/3 documents for the authoritative outcome.

---

## 2. Change Manifest

| # | Change Type | Component | Summary |
|---|-------------|-----------|---------|
| CHG-01 | Remove | `assemble.js` | Delete assembly engine module |
| CHG-02 | Remove | `manifest.js` | Delete manifest resolution module |
| CHG-03 | ~~Remove~~ **Keep** | `list` command | ~~Remove from `cli.js`~~ Kept per user decision; reimplemented with inline manifest parsing |
| CHG-04 | Remove | `assemble` command | Remove from `cli.js`, incl. `collectParams()` |
| CHG-05 | Modify | `cli.js` | Simplify to two commands (`interactive` + `list`), remove imports of assemble/manifest |
| CHG-06 | Modify | `launch.js` | Keep as-is (already the thin-launcher) |
| CHG-07 | Keep | `copy-content.js` | No changes |
| CHG-08 | ~~Modify~~ **Keep** | `package.json` | ~~Remove `js-yaml`~~ Kept — still needed for `list` command's inline manifest parsing |
| CHG-09 | Modify | Docs/README | Update CLI documentation to reflect two-command interface |

---

## 3. Retired Requirements

The following REQ-IDs are retired because their implementing code is
being removed and their functionality is now the LLM's responsibility
via `bootstrap.md`.

### 3.1 List Command (§2.3 of requirements.md)

| REQ-ID | Title | Justification |
|--------|-------|---------------|
| REQ-CLI-020 | List templates grouped by category | Functionality moved to LLM via `bootstrap.md` step 1 ("Read the manifest") |
| REQ-CLI-021 | `--json` flag for list output | No list command → no JSON flag |
| REQ-CLI-022 | JSON output includes name/description/category | No list command |
| REQ-CLI-023 | Usage hint in list output | No list command |

*USER-REQUEST link*: "Delete the list command — The LLM lists templates
by reading manifest.yaml. Trivially redundant."

### 3.2 Assemble Command (§2.4 of requirements.md)

| REQ-ID | Title | Justification |
|--------|-------|---------------|
| REQ-CLI-030 | Positional `<template>` argument | No assemble command |
| REQ-CLI-031 | `-o, --output` option with default | No assemble command |
| REQ-CLI-032 | Repeatable `-p, --param` options | No assemble command |
| REQ-CLI-033 | Param values containing `=` handled | No assemble command |
| REQ-CLI-034 | Unknown template name error | No assemble command |
| REQ-CLI-035 | Output path resolved relative to CWD | No assemble command |
| REQ-CLI-036 | Summary after successful assembly | No assemble command |
| REQ-CLI-037 | Unfilled `{{param}}` warning | No assemble command |

*USER-REQUEST link*: "Delete the assemble command — Its engine is being
removed."

### 3.3 Assembly Engine (§2.5 of requirements.md)

| REQ-ID | Title | Justification |
|--------|-------|---------------|
| REQ-CLI-040 | Strip YAML frontmatter | LLM performs this per bootstrap.md Verbatim Inclusion Rule |
| REQ-CLI-041 | Strip leading HTML comments | Same — LLM strips SPDX headers |
| REQ-CLI-042 | Strip ALL leading HTML comments | Same |
| REQ-CLI-043 | Section ordering (Identity → Protocols → Taxonomy → Format → Task) | LLM follows Assembly Process in bootstrap.md |
| REQ-CLI-044 | Section separator `\n\n---\n\n` | Same |
| REQ-CLI-045 | Multiple protocols separated by `---` | Same |
| REQ-CLI-046 | Multiple taxonomies separated by `---` | Same |
| REQ-CLI-047 | Missing component: warn and skip | Same |
| REQ-CLI-048 | Omit sections for absent components | Same |
| REQ-CLI-049 | Parameter substitution replaces all occurrences | Same |
| REQ-CLI-050 | Parameter substitution after concatenation | Same |
| REQ-CLI-051 | No Non-Goals section [KNOWN GAP] | Moot — LLM *does* produce Non-Goals |

*USER-REQUEST link*: "Delete the assembly engine (assemble.js) — The
Assembly Process in bootstrap.md tells the LLM to do the exact same
thing."

### 3.4 Manifest Resolution (§2.6 of requirements.md)

| REQ-ID | Title | Justification |
|--------|-------|---------------|
| REQ-CLI-060 | Parse manifest.yaml with js-yaml | LLM reads manifest.yaml directly |
| REQ-CLI-061 | Flatten templates by category | Same |
| REQ-CLI-062 | getPersona() lookup | Same |
| REQ-CLI-063 | getProtocol() cross-category lookup | Same |
| REQ-CLI-064 | getFormat() lookup | Same |
| REQ-CLI-065 | getTaxonomy() lookup | Same |
| REQ-CLI-066 | resolveTemplateDeps() resolve all 4 types | Same |
| REQ-CLI-067 | Warn on missing protocol | Same |
| REQ-CLI-068 | Warn on missing taxonomy | Same |
| REQ-CLI-069 | Case-sensitive template name matching | No assemble command |

*USER-REQUEST link*: "Delete manifest resolution (manifest.js) — The LLM
reads manifest.yaml directly."

### 3.5 Retired Constraints and Assumptions

| ID | Title | Justification |
|----|-------|---------------|
| CON-005 | Assembly engine MUST NOT summarize/condense | No assembly engine |
| ASSUMPTION-006 | Frontmatter regex starts at beginning | No assembly engine |

---

## 4. Modified Requirements

### 4.1 REQ-CLI-002 — Command Structure

**Before**: The CLI MUST provide three commands: `interactive` (default),
`list`, and `assemble`.

**After**: The CLI MUST provide one command: `interactive` (the default
and only command).

*Rationale*: `list` and `assemble` are removed. The CLI is a launcher
only.
*USER-REQUEST link*: "Keep and simplify the interactive launch" + delete
list/assemble commands.

### 4.2 REQ-CLI-004 — Content Validation

**Before**: The CLI MUST validate that bundled content exists before
executing any command, and exit with code 1 and an error message if
`manifest.yaml` is not found in the content directory.

**After**: The CLI MUST validate that bundled content exists before
executing the `interactive` command, and exit with code 1 and an error
message if `bootstrap.md` is not found in the content directory.

*Rationale*: With no `assemble` or `list` commands, the validation only
applies to `interactive`. The validation target should shift from
`manifest.yaml` to `bootstrap.md` since `bootstrap.md` is what the LLM
actually reads — it is the entry point. `manifest.yaml` is consumed by
the LLM, not the CLI. [INFERRED — the CLI no longer parses the manifest
itself, so `bootstrap.md` is the correct file to check for.]

### 4.3 REQ-CLI-080 — npm Package Contents

**Before**: The npm package MUST include only `bin/`, `lib/`, and
`content/` directories (plus package.json).

**After**: The npm package MUST include only `bin/`, `lib/`, and
`content/` directories (plus package.json). The `lib/` directory
contains only `launch.js`.

*Rationale*: `assemble.js` and `manifest.js` are deleted. The `lib/`
directory shrinks to one file.
*USER-REQUEST link*: Delete assembly engine and manifest resolution.

### 4.4 REQ-CLI-092 — Error Handling (Missing Components)

**Before**: The CLI MUST NOT crash with an unhandled exception when a
referenced component file is missing; it MUST print a warning and
continue.

**After**: RETIRE this requirement. The CLI no longer loads component
files. The LLM handles missing components when following `bootstrap.md`.

*Rationale*: This requirement was about `assemble.js`'s behavior. Since
`assemble.js` is deleted, there is no CLI code path that loads
components.

### 4.5 REQ-CLI-094 — Dependencies

**Before**: The CLI MUST have exactly two runtime dependencies:
`commander` (^12.0.0) and `js-yaml` (^4.1.0).

**After**: The CLI MUST have exactly one runtime dependency: `commander`
(^12.0.0). All other modules used MUST be Node.js built-ins.

*Rationale*: `js-yaml` was used only by `manifest.js` to parse
`manifest.yaml`. Since `manifest.js` is deleted, `js-yaml` is no longer
needed. [KNOWN — `copy-content.js` is build-time only and does not use
`js-yaml`.]
*USER-REQUEST link*: Delete manifest resolution.

### 4.6 REQ-CLI-013 — Fallback Warning

**Before**: If auto-detection selects a CLI other than `copilot` or
`gh-copilot`, and the user did not pass `--cli`, the CLI SHOULD print a
warning indicating the fallback CLI being used.

**After**: No change to this requirement — it remains as-is in
`launch.js`.

*Note*: Included for completeness. The fallback guidance in the `--cli`
error message previously referenced `promptkit assemble` as an
alternative. This reference MUST be removed.

### 4.7 REQ-CLI-012 — No CLI Found Error

**Before** (error message, per `launch.js` lines 60–69): Includes
`"Or use: promptkit assemble <template> --output prompt.md"` as a
fallback suggestion.

**After**: Remove the `assemble` fallback suggestion from the error
message. The error message MUST list only LLM CLI installation
instructions.

*Rationale*: The `assemble` command no longer exists.
*USER-REQUEST link*: Delete the assemble command.

---

## 5. New Requirements

### 5.1 REQ-CLI-100 — Single-Command CLI

**REQ-CLI-100**: The CLI MUST expose exactly one command (`interactive`)
as both the default and only command. Running `promptkit` with no
arguments or `promptkit interactive` MUST launch the interactive session.
Running `promptkit <anything-else>` MUST produce a Commander help/error
message.

*Acceptance*: `promptkit --help` lists only the `interactive` command.
*USER-REQUEST link*: "Keep CLI infrastructure (cli.js) — Binary name,
version, but simplify to just the interactive command."

### 5.2 REQ-CLI-101 — No Assembly Code in Package

**REQ-CLI-101**: The published npm package MUST NOT contain `assemble.js`
or `manifest.js` in the `lib/` directory.

*Acceptance*: `npm pack --dry-run` does not list `lib/assemble.js` or
`lib/manifest.js`.
*USER-REQUEST link*: Delete assembly engine and manifest resolution.

### 5.3 REQ-CLI-102 — No js-yaml Runtime Dependency

**REQ-CLI-102**: The `package.json` MUST NOT list `js-yaml` as a
dependency. The CLI MUST function without `js-yaml` installed.

*Acceptance*: `npm ls --production` does not include `js-yaml`.
*USER-REQUEST link*: Implied by deletion of `manifest.js`.

---

## 6. Impact Assessment

### 6.1 Ripple Effects on Specs

| Artifact | Impact | Details |
|----------|--------|---------|
| `requirements.md` | **Major** | Retire 28 REQ-IDs (§3 above), modify 5 REQ-IDs (§4 above), add 3 new REQ-IDs (§5 above). Sections 2.3 (List), 2.4 (Assemble), 2.5 (Assembly Engine), 2.6 (Manifest Resolution) become empty/retired. |
| `design.md` | **Major** | Remove §2.2 (assemble.js module design), §2.3 (manifest.js module design), §3.1 (Assembly Pipeline data flow). Simplify §1.1 (module structure), §1.2 (dependency graph), §1.3 (command flow). Update §5.1 (CLI interface), §5.2 (module exports), §5.4 (assembled output format — remove entirely). Remove GAP-001 through GAP-011 (all assembly/manifest gaps become moot). |
| `validation.md` | **Major** | Retire TC-CLI-010 through TC-CLI-024 (assembly), TC-CLI-030 through TC-CLI-042 (manifest), TC-CLI-050 through TC-CLI-053 (list), TC-CLI-060 through TC-CLI-067 (assemble command), TC-CLI-113 (Windows frontmatter). Update traceability matrix. Simplify TC-CLI-001 (help output). |
| `bootstrap.md` | **None** | No changes needed — bootstrap.md is already the source of truth. |
| `manifest.yaml` | **None** | No changes — the LLM reads it as before. |

### 6.2 Ripple Effects on Source Code

| File | Impact | Details |
|------|--------|---------|
| `cli/lib/assemble.js` | **Delete** | Entire file removed |
| `cli/lib/manifest.js` | **Delete** | Entire file removed |
| `cli/bin/cli.js` | **Major rewrite** | Remove `list` command (lines 46–80), `assemble` command (lines 82–129), `collectParams()` (lines 131–135). Remove imports of `manifest.js` and `assemble.js`. Result: ~25 lines. |
| `cli/lib/launch.js` | **Minor** | Remove `assemble` fallback from error message (line 67). Otherwise unchanged. |
| `cli/scripts/copy-content.js` | **None** | Keep as-is |
| `cli/package.json` | **Minor** | Remove `js-yaml` from `dependencies`. Possibly remove `lib/` from `files` if only `launch.js` remains (but keeping `lib/` as a directory is fine). |

### 6.3 Ripple Effects on CI/Distribution

| Area | Impact | Details |
|------|--------|---------|
| `tests/validate-manifest.py` | **None** | This validates manifest ↔ template protocol sync, not CLI code. |
| npm distribution | **Minor** | Package size decreases. `js-yaml` removed from dependency tree. |
| README / docs | **Moderate** | Any CLI usage documentation that references `promptkit list` or `promptkit assemble` must be updated. |
| `.github/workflows/` | **None** | CI only runs `validate-manifest.py` on push/PR. |

### 6.4 Ripple Effects on Constraints

| Constraint | Impact |
|------------|--------|
| CON-001 (no source file modification) | **Preserved** — launcher still reads from bundled content. |
| CON-002 (no network access) | **Preserved** — no change. |
| CON-003 (no secrets) | **Preserved** — no change. |
| CON-004 (stateless) | **Preserved** — no change. |
| CON-005 (verbatim inclusion) | **Retired** — assembly engine removed. The equivalent rule exists in `bootstrap.md`'s Verbatim Inclusion Rule. |

### 6.5 Ripple Effects on Assumptions

| Assumption | Impact |
|------------|--------|
| ASSUMPTION-001 (manifest structure stable) | **Still valid** — LLM reads manifest directly; CLI no longer depends on structure. |
| ASSUMPTION-002 (template entry schema) | **No longer a CLI concern** — LLM resolves templates. |
| ASSUMPTION-003 (`--cli` valid values) | **Preserved** — `launch.js` switch still uses these. |
| ASSUMPTION-004 (copyContentToTemp copies all file types) | **Preserved** — `launch.js` behavior unchanged. |
| ASSUMPTION-005 (`prepare` npm script behavior) | **Preserved** — `copy-content.js` unchanged. |
| ASSUMPTION-006 (frontmatter regex position) | **Retired** — assembly engine removed. |

---

## 7. Clarifying Questions

These questions need user input before proceeding to Phase 2.

### Q1: CI/Scripting Use Case Abandoned?

The redundancy analysis notes that `assemble` has unique value for
CI/scripting: "Deterministic, offline, no-LLM assembly for pipelines."
**Is the user certain they want to remove this capability?** Users who
currently use `promptkit assemble` in CI scripts will be broken. Is
there a migration path? (E.g., "use the LLM CLI in CI" or "assemble
is not used in any known CI pipeline.")

*Impact if yes*: Removing the `assemble` command is a **breaking change**
for any consumers using it programmatically. The next version should be a
major version bump (0.3.0 → 0.4.0 or 1.0.0) per semver.

### Q2: Version Bump Strategy

Removing two commands is a breaking change under semver. The current
version is 0.3.0 (pre-1.0). **Should this be 0.4.0 (pre-1.0 breaking
change) or 1.0.0 (first stable release with the simplified API)?**

### Q3: Content Validation — bootstrap.md vs manifest.yaml

§4.2 proposes changing the `ensureContent()` check from `manifest.yaml`
to `bootstrap.md`. An alternative is to check for both, since the LLM
needs both files. **Should the CLI validate the existence of
`bootstrap.md` only, `manifest.yaml` only, or both?**

[INFERRED]: Checking `bootstrap.md` is sufficient because it is the
LLM's entry point, and `bootstrap.md` itself instructs the LLM to read
`manifest.yaml` — if the manifest is missing, the LLM will report the
error. But checking both gives earlier, more specific error reporting.

### Q4: README/Docs Updates — Scope

The CLI README and any PromptKit docs referencing `promptkit list` or
`promptkit assemble` will need updates. **Are there docs beyond
`cli/package.json` description and the repo `README.md` that reference
these commands?** Should doc updates be part of this change or a
follow-up?

### Q5: Error Message — No LLM CLI Found

Currently, the "no CLI found" error message in `launch.js` suggests
`promptkit assemble` as a fallback (line 67). **Should the replacement
message simply remove that line, or suggest an alternative?** For
example: "Copy the content directory and load bootstrap.md in your LLM
manually."

### Q6: `--cli` Flag — Valid Values Documentation

GAP-010 in the design spec notes that valid `--cli` values are
undocumented in help text. Since we're simplifying the CLI anyway,
**should we document the valid `--cli` values in the help text as part
of this change?** (Low effort, natural scope.)

---

## 8. Scope Challenge

### 8.1 Is This the Right Change?

**Assessment: Yes, with one caveat.**

The core argument is sound. The CLI reimplements logic that `bootstrap.md`
already defines, and the two implementations have already diverged
(bug #137). Removing the redundant code eliminates an entire class of
maintenance burden and divergence risk. The analysis in `cli_analysis.md`
correctly identifies that `manifest.js` (80 lines), `assemble.js`
(108 lines), the `list` command (~30 lines), and the `assemble` command
(~50 lines) are all redundant with what the LLM does when following
`bootstrap.md`.

**The caveat**: The `assemble` command provided deterministic, offline,
no-LLM assembly for CI/scripting use cases. This is genuinely unique
value that the LLM cannot replicate (LLM output is non-deterministic).
However, per the user's request and the analysis, this capability is
being deliberately sacrificed because:

1. The CLI assembly already cannot handle interactive templates,
   parameterized personas, dynamic protocols, or Non-Goals — features
   the LLM handles naturally.
2. The divergence risk outweighs the CI convenience.
3. No known CI pipelines currently depend on `promptkit assemble`.
   [ASSUMPTION — this should be confirmed via Q1.]

### 8.2 Simpler Alternatives?

**Alternative A: Keep `assemble`, delete only `manifest.js`** — Have
`assemble.js` use a simpler, inline manifest lookup rather than a
separate module. This reduces redundancy but keeps the CI use case.

*Rejected rationale*: Still maintains two assembly implementations.
Still diverges. Doesn't solve the root problem.

**Alternative B: Keep `list` only** — The `list` command is cheap (30
lines) and useful for discovery without an LLM. Delete `assemble` and
`manifest.js`, but keep `list` with an inline `js-yaml` + flatten.

*Consideration*: This is reasonable. `list` is low-maintenance, doesn't
diverge from `bootstrap.md` (it's just reading data, not interpreting
it), and helps users who want to browse templates without launching an
LLM. **However**, the user explicitly requested its deletion, and the
LLM can list templates in the first 2 seconds of an interactive session.
If the user wants to keep `list`, it can be added back with minimal
effort.

**Alternative C: Thin shim** — Replace `assemble.js` with a 10-line
shim that spawns the LLM CLI in non-interactive mode with a "assemble
template X with params Y and write to Z" instruction. This preserves the
`assemble` command's interface while delegating to the LLM.

*Rejected rationale*: Requires an LLM CLI to be available, eliminating
the "offline" advantage. Introduces non-determinism. Overly clever.

### 8.3 Hidden Costs

1. **Breaking change** — Any `promptkit list` or `promptkit assemble`
   users are broken. Mitigation: semver version bump + CHANGELOG.
2. **Loss of offline assembly** — Users without an LLM CLI can no longer
   generate prompts. Mitigation: They can manually read and assemble
   from the Markdown files (which is what the `assemble` command did
   programmatically).
3. **js-yaml removal** — If `js-yaml` is re-needed in the future (e.g.,
   for a new feature), it must be re-added. Low cost.
4. **Spec churn** — 28 retired REQ-IDs, major design/validation
   rewrites. This is significant spec maintenance effort, but it
   simplifies the specs going forward.

---

## 9. Self-Verification

### 9.1 Source Documents Consulted

| Document | What was drawn from it |
|----------|----------------------|
| `cli/specs/requirements.md` (v0.3.0) | All REQ-IDs, acceptance criteria, constraints, assumptions |
| `cli/specs/design.md` (v0.3.0) | Module structure, dependency graph, data flow, known gaps |
| `cli/specs/validation.md` (v0.3.0) | Test cases, traceability matrix |
| `cli/bin/cli.js` | Command structure, imports, action handlers |
| `cli/lib/assemble.js` | Assembly functions, section ordering |
| `cli/lib/manifest.js` | Manifest parsing, lookup functions |
| `cli/lib/launch.js` | CLI detection, content staging, spawn logic, error messages |
| `cli/scripts/copy-content.js` | Content bundling logic |
| `cli/package.json` | Dependencies, bin, files, scripts |
| `bootstrap.md` | Assembly Process, Verbatim Inclusion Rule, pipeline support |
| `cli_analysis.md` | Redundancy analysis and recommendations |
| `cli/specs/engineering-workflow.md` | Phase 1 instructions and protocol definitions |

### 9.2 Sampling Verification

1. **REQ-CLI-020 retirement** — Verified: `cli.js` lines 46–80 implement
   the `list` command; `manifest.js` `getTemplates()` is called at
   line 53. Removing `list` command and `manifest.js` makes REQ-CLI-020
   moot. ✓
2. **REQ-CLI-094 modification** (js-yaml removal) — Verified:
   `manifest.js` line 8 (`const yaml = require("js-yaml")`) is the only
   runtime use of `js-yaml`. `copy-content.js` does not import
   `js-yaml`. `cli.js` does not import `js-yaml`. `launch.js` does not
   import `js-yaml`. Removing `manifest.js` eliminates all `js-yaml`
   usage. ✓
3. **Error message reference to `assemble`** — Verified: `launch.js`
   line 67 contains `"Or use: promptkit assemble <template> --output
   prompt.md"`. This must be removed or replaced. ✓
4. **REQ-CLI-004 bootstrap.md check** — Verified: `cli.js` line 16
   checks for `manifest.yaml`. The proposal to change to `bootstrap.md`
   is sound because the CLI no longer parses the manifest — it only
   needs `bootstrap.md` to exist for the LLM. ✓
5. **CON-005 retirement** — Verified: CON-005 ("assembly engine MUST NOT
   summarize") applies only to `assemble.js`. `bootstrap.md` has its own
   equivalent Verbatim Inclusion Rule (lines 105–131). Retirement is
   safe. ✓

### 9.3 Coverage

- **Examined**: All source files under `cli/`, all spec files under
  `cli/specs/`, `bootstrap.md`, `cli_analysis.md`, `package.json`.
- **Method**: Direct file reading and cross-referencing.
- **Excluded**: `tests/validate-manifest.py` (confirmed unrelated to CLI
  code — validates manifest ↔ template frontmatter protocol sync).
  GitHub workflows (confirmed they only trigger `validate-manifest.py`).
- **Limitations**: Cannot verify whether external consumers depend on
  `promptkit list` or `promptkit assemble` — see Q1.
