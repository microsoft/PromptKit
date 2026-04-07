<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: tool-reliability-defense
type: guardrail
description: >
  Defensive protocol for verifying tool outputs, anticipating silent
  failures, and never trusting success messages without independent
  confirmation. Addresses known failure modes in AI coding tools
  including edit corruption, rendering artifacts, and encoding errors.
applicable_to: []
---

# Protocol: Tool Reliability Defense

When this protocol is included in a prompt, apply it to every tool
interaction during the session. AI coding tools fail silently in
predictable ways — edits drop lines, reads render incorrectly,
terminal commands mangle encoding. This protocol requires independent
verification of every mutation.

## Rules

### 1. Verify Every Write Through an Independent Read

- After every file edit, re-read the modified file and verify the
  change was applied correctly.
- Check for these known corruption patterns:
  - **Dropped lines**: the edited region has fewer lines than expected.
  - **Injected metadata**: tool-generated comments, timestamps, or
    markers appeared in the file.
  - **Keyword substitution**: control-flow keywords were silently
    replaced (e.g., `else` → `then`, `elif` → `else if`).
  - **Whitespace corruption**: indentation was changed outside the
    edited region.
  - **Encoding errors**: non-ASCII characters were replaced with
    mojibake or escape sequences.
- If any corruption is detected, revert the edit and retry with a
  smaller, more targeted change.

### 2. Snapshot Before Editing

- Before modifying a file, note the current line count and a
  snapshot of the region being edited (for example, the first and
  last 3 lines of the target region).
- After editing, compare the snapshot to the result. If the
  surrounding context changed unexpectedly, the edit corrupted
  adjacent lines.
- If the tool does not support undo, make one edit at a time so
  manual recovery is possible.

### 3. One Logical Change Per Tool Call

- Do NOT combine multiple unrelated edits into a single tool call.
  Each edit should change one logical thing (one function, one
  block, one declaration).
- Multi-line terminal commands are a corruption vector. Prefer
  single-line commands chained with `&&` over heredocs or multi-line
  strings.
- If a bulk operation is required, execute it in bounded batches
  and verify each batch before proceeding.

### 4. Never Trust Success Messages

- A tool reporting "file saved successfully" does NOT guarantee
  the file contains the intended content. Always read back.
- A test suite reporting "all tests passed" does NOT guarantee
  the tests actually ran. Verify the test count matches
  expectations (e.g., "247 tests passed" — is 247 the expected
  count, or were tests silently skipped?).
- A build reporting "0 errors" does NOT guarantee the correct
  files were compiled. Check that modified files appear in the
  build output.

### 5. Anticipate Rendering Artifacts

- File-reading tools may render markdown headings, tables, or
  code blocks differently than the raw file content. When
  verifying edits to markdown files, prefer raw/plain-text reads
  over rendered views.
- Terminal output may wrap, truncate, or colorize content in ways
  that hide problems. When verifying terminal output, pipe to a
  file or use `--no-pager` flags.
- JSON and YAML tools may reorder keys, strip comments, or
  normalize whitespace. When verifying structured data edits,
  compare the specific fields that were changed, not just the
  overall structure.

### 6. Escalate on Repeated Failures

- If the same edit fails verification twice in a row, do NOT
  retry the same approach a third time. Instead:
  1. Document the failure pattern (what was attempted, what was
     observed).
  2. Try an alternative approach (different edit granularity,
     different tool, manual construction).
  3. If no alternative works, report the tool failure to the user
     with the documented pattern.
