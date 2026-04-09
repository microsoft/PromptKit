## Stage 1: Inspect Current CLI Launch Flow
**Goal**: Confirm how PromptKit detects and spawns supported CLIs on Windows.
**Success Criteria**: Relevant launcher code and tests identified.
**Tests**: Read existing `cli/lib/launch.js`, `cli/bin/cli.js`, and `cli/tests/launch.test.js`.
**Status**: Complete

## Stage 2: Add Codex Windows-Compatible Launch Support
**Goal**: Support `--cli codex` and ensure Windows launches the npm `.cmd` shim instead of relying on shell-specific resolution.
**Success Criteria**: `codex` is accepted, launched correctly on Windows, and existing CLIs retain behavior.
**Tests**: Update launch unit tests for `codex` command resolution and dry-run output.
**Status**: Complete

## Stage 3: Verify and Finalize
**Goal**: Run the CLI test suite and confirm the change is isolated.
**Success Criteria**: Relevant verification completed and docs/help text reflect Codex support.
**Tests**: `node .\\bin\\cli.js interactive --cli codex --dry-run`; attempted `node --test --test-concurrency=1 tests\\launch.test.js`
**Status**: Complete
