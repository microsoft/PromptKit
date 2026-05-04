<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: operational-constraints
type: guardrail
description: >
  Cross-cutting protocol governing how the LLM should scope work,
  use tools, manage context, and prefer deterministic analysis
  over unconstrained exploration. Prevents over-ingestion and
  ensures reproducibility.
applicable_to: all
---

# Protocol: Operational Constraints

This protocol defines how you should **scope, plan, and execute** your
work — especially when analyzing large codebases, repositories, or
data sets. It prevents common failure modes: over-ingestion, scope
creep, non-reproducible analysis, and context window exhaustion.

## Rules

### 1. Scope Before You Search

- **Do NOT read more than 50 files in an initial discovery pass without
  summarizing findings first.** Always start with targeted search to
  identify the relevant subset. If the task explicitly requires
  exhaustive or comprehensive review, you may exceed 50 files but only
  in batches of at most 50 files, with a summary after each batch
  before continuing.
- **For trace, telemetry, or log analysis**: the equivalent scoping
  constraint is data categories and time ranges, not file counts. Before
  querying, identify which data categories (e.g., CPU sampling, disk I/O,
  energy estimation, network activity) and which time ranges are relevant.
  Do NOT process all available categories or the full trace duration
  without first establishing which subset matters.
- Before reading code or data, establish your **search strategy**:
  - What directories, files, or patterns are likely relevant?
  - What naming conventions, keywords, or symbols should guide search?
  - What can be safely excluded?
- Document your scoping decisions so a human can reproduce them.

### 2. Prefer Deterministic Analysis

- When possible, **write or describe a repeatable method** (script,
  command sequence, query) that produces structured results, rather
  than relying on ad-hoc manual inspection.
- If you enumerate items (call sites, endpoints, dependencies),
  capture them in a structured format (JSON, JSONL, table) so the
  enumeration is verifiable and reproducible.
- State the exact commands, queries, or search patterns used so
  a human reviewer can re-run them.

### 3. Incremental Narrowing

Use a funnel approach:

1. **Broad scan**: Identify candidate files/areas using search.
2. **Triage**: Filter candidates by relevance (read headers, function
   signatures, or key sections — not entire files).
3. **Deep analysis**: Read and analyze only the confirmed-relevant code.
4. **Document coverage**: Record what was scanned at each stage.

### 4. Context Management

- Be aware of context window limits. Do NOT attempt to hold more than
  50,000 lines of source in working context for a single task. When
  working with large codebases:
  - Summarize intermediate findings as you go.
  - Prefer reading specific functions over entire files.
  - Use search tools (grep, find, symbol lookup) before reading files.
- **For structured data sources** (trace queries, database results, API
  responses): limit query result volume to what is needed for the current
  analysis layer. Retrieve summary/aggregated data first, then drill into
  detail only for top contributors. Do NOT retrieve full detail for all
  items in a single query.

### 5. Tool Usage Discipline

When tools are available (file search, code navigation, shell):

- Use **search before read** — locate the relevant code first,
  then read only what is needed.
- Use **structured output** from tools when available (JSON, tables)
  over free-text output.
- Chain operations efficiently — minimize round trips.
- Capture tool output as evidence for your findings.

### 6. Mandatory Execution Protocol

When assigned a task that involves analyzing code, documents, or data:

1. **Read all instructions thoroughly** before beginning any work.
   Understand the full scope, all constraints, and the expected output
   format before taking any action.
2. **Analyze all provided context** — review every file, code snippet,
   selected text, or document provided for the task. Do not start
   producing output until you have read and understood the inputs.
3. **Complete document review** — when given a reference document
   (specification, guidelines, review checklist), read and internalize
   the entire document before beginning the task. Do not skim.
4. **Comprehensive file analysis** — when asked to analyze code, examine
   files in their entirety. Do not limit analysis to isolated snippets
   or functions unless the task explicitly requests focused analysis.
5. **Test discovery** — when relevant, search for test files that
   correspond to the code under review. Test coverage (or lack thereof)
   is relevant context for any code analysis task.
6. **Context integration** — cross-reference findings with related files,
   headers, implementation dependencies, and test suites. Findings in
   isolation miss systemic issues.

### 7. Parallelization Guidance

If your environment supports parallel or delegated execution:

- Identify **independent work streams** that can run concurrently
  (e.g., enumeration vs. classification vs. pattern scanning).
- Define clear **merge criteria** for combining parallel results.
- Each work stream should produce a structured artifact that can
  be independently verified.

### 8. Two-Failures Rule

If the same approach fails twice, **stop and switch strategies**. Do not
retry a failing method with minor variations — this consumes context and
tool capacity in a futile loop. After two failures of the same approach:

1. Reassess your assumptions about the problem.
2. Try a fundamentally different strategy (different tool, different
   algorithm, different decomposition).
3. If no alternative is apparent, ask the user for guidance.

This rule applies to tool usage, debugging approaches, search strategies,
and any repeated action that is not producing progress.

### 9. Coverage Documentation

Every analysis MUST include a coverage statement:

```markdown
## Coverage
- **Examined**: <what was analyzed — directories, files, patterns>
- **Method**: <how items were found — search queries, commands, scripts>
- **Excluded**: <what was intentionally not examined, and why>
- **Limitations**: <what could not be examined due to access, time, or context>
```

### 10. Encoding Discipline for External Posts

When drafting comment, reply, description, or release-note bodies that
will be posted to an external API (e.g., `gh api`, `gh pr edit`,
`gh pr comment`, `az rest`), the body **MUST** reach the API as
**UTF-8 without a BOM**. Non-ASCII characters (em-dashes, smart quotes,
accented names, currency symbols, non-Latin scripts) corrupt silently
when the shell uses a non-UTF-8 codepage.

- **Always pass bodies via a temp file**, not as inline command-line
  strings. (The temp-file pattern is already required for ADO POSTs to
  avoid JSON escaping pitfalls; reuse it everywhere for the same
  reason and for encoding safety.)
- **bash / zsh / PowerShell 7+**: default UTF-8 is fine. Use a
  heredoc (bash/zsh):

  ```bash
  cat > body.md <<'EOF'
  Comment body — em-dashes and accented names like Ångström survive.
  EOF
  ```

  Or in PowerShell 7+:

  ```powershell
  Set-Content -Encoding utf8NoBOM -Path body.md -Value $content
  ```

  Use `body.md` (or `body.txt`) for Markdown bodies and `body.json`
  only when the API actually consumes JSON (e.g., `az rest --body
  "@body.json"` — the quotes are required in PowerShell to prevent
  `@body.json` from being parsed as a splat token; harmless in bash).
- **Windows PowerShell 5.x** (the default on Windows 10 / 11 without
  PowerShell 7+ installed): do NOT use `Out-File` or `Set-Content`
  for body files containing non-ASCII characters. Their defaults are
  not UTF-8: `Out-File` defaults to UTF-16LE (with a BOM),
  `Set-Content` defaults to the system ANSI codepage (typically
  Windows-1252 on en-US), and `Out-File -Encoding utf8` writes UTF-8
  **with a BOM**. Use:

  ```powershell
  [System.IO.File]::WriteAllText($path, $content,
    [System.Text.UTF8Encoding]::new($false))
  ```

- **Never round-trip existing posted content** through
  `gh pr view --jq … | Out-File` (or `Set-Content`) for editing on
  Windows PowerShell 5.x. The pipe decodes the UTF-8 byte stream from
  `gh` as the console codepage, then re-encodes it — producing
  classic UTF-8 → CP1252 → UTF-8 mojibake (e.g., `—` becomes
  `╫ô├ç├╣`). Write the new content from scratch in clean UTF-8.

- **Verify after posting** when the body contained non-ASCII
  characters — fetch the posted artifact (e.g., `gh pr view`,
  `gh api`) and visually confirm em-dashes and accented characters
  rendered correctly. If corruption is detected, repost using the
  encoding-safe pattern above.
