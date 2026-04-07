<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: prompt-determinism-analysis
type: analysis
description: >
  Systematic analysis of prompt and instruction text for language
  precision and determinism. Identifies vague quantifiers, subjective
  adjectives, missing constraints, incomplete conditionals, and
  ambiguous references that introduce non-deterministic LLM behavior.
  Classifies each finding as High, Medium, or Low non-determinism
  potential with concrete rewrite suggestions.
applicable_to:
  - lint-prompt
  - audit-library-health
---

# Protocol: Prompt Determinism Analysis

Apply this protocol when analyzing prompt text, instruction files,
or prompt library components for language that introduces
non-deterministic LLM behavior. Execute all phases in order.

## Determinism Classification Scale

| Level | Meaning | Action |
|-------|---------|--------|
| **High** | Language is vague, subjective, or open-ended. Different LLMs (or the same LLM across runs) will interpret it inconsistently. | Rewrite required — provide concrete rewrite suggestion. |
| **Medium** | Language is imprecise but constrained by surrounding context. Interpretation may vary at the margins but the core intent is recoverable. | Rewrite recommended — flag with suggestion. |
| **Low** | Language is concrete, specific, and leaves little room for interpretation. Enumerated values, explicit constraints, named artifacts, numbered steps. | No rewrite needed — counted in scorecard only by default. Templates may optionally report Low findings as individual Informational-severity entries when configured for strict analysis. |

## Phase 1: Lexical Pattern Scan

Scan the text for specific lexical patterns known to introduce
non-determinism. For each occurrence, record the location, the
pattern category, and the classification level.

### 1.1 Vague Quantifiers (High)

Flag words that leave quantity or degree unspecified:

- "some", "several", "many", "a few", "a number of", "various",
  "numerous", "multiple" (when not followed by a specific count)
- "often", "usually", "sometimes", "occasionally", "frequently"
- "most", "almost all", "nearly"

**Rewrite pattern**: Replace with a specific count, range, or
enumeration. If the exact count is unknowable, state the selection
criterion instead (e.g., "at least 3" or "all items matching X").

### 1.2 Subjective Adjectives (High)

Flag adjectives that depend on unstated evaluation criteria:

- "good", "bad", "appropriate", "suitable", "reasonable", "proper",
  "adequate", "sufficient", "clean", "elegant", "simple",
  "straightforward", "clear", "obvious", "intuitive"
- "important", "significant", "critical", "key", "major", "minor"
  (when used without a defined severity scale or an explicit
  enumeration of what qualifies — e.g., "significant" is acceptable
  if immediately followed by criteria such as "affecting >2 components")

**Rewrite pattern**: Replace with observable criteria. "Good error
handling" → "Error handling that catches all thrown exception types,
logs the error with context, and returns a structured error response."

### 1.3 Open-Ended Enumerations (Medium)

Flag lists that signal incompleteness without bounding:

- "etc.", "and so on", "and more", "among others", "for example"
  (when used as the sole specification, not as illustration before
  a complete list)
- "such as X, Y, …" without a closing exhaustive rule
- "including but not limited to"

**Rewrite pattern**: Either enumerate exhaustively, or state the
selection criterion explicitly. "Check for issues such as SQL
injection, XSS, etc." → "Check for all OWASP Top 10 vulnerability
categories."

### 1.4 Hedge Words and Weak Modals (Medium)

Flag words that weaken commitment to an action:

- "might", "could", "possibly", "perhaps", "consider",
  "may want to", "it would be nice to", "try to", "attempt to"
- "if possible", "if applicable", "when appropriate", "as needed"
  (without criteria for when it IS applicable/needed)

**Rewrite pattern**: Replace with a concrete conditional. "Consider
checking for null" → "Check for null on every pointer dereference."
"If appropriate, add logging" → "Add logging when the function
returns an error code."

### 1.5 Passive Voice Without Actor (Medium)

Flag passive constructions where the responsible agent is unclear:

- "should be reviewed", "must be analyzed", "needs to be checked",
  "is expected to", "will be handled"

**Rewrite pattern**: Name the actor explicitly. "The output should
be reviewed" → "The LLM must review its own output against the
checklist in §5 before presenting it as final."

### 1.6 Unanchored Comparatives and Superlatives (High)

Flag comparisons without a baseline or reference point:

- "better", "worse", "more", "less", "improved", "faster",
  "simpler", "cleaner", "more efficient"
- "the best", "the most", "the least", "optimal"

**Rewrite pattern**: Anchor to a measurable criterion or a specific
comparison target. "A better approach" → "An approach that reduces
time complexity from O(n²) to O(n log n)." "The most important
findings" → "Findings classified as Critical or High severity."

## Phase 2: Structural Completeness

Check for structural gaps that leave behavior underspecified.

### 2.1 Conditionals Without Exhaustive Branches (High)

For every conditional instruction ("if X, do Y"):

1. Check whether all branches are specified.
2. Flag conditionals that specify the positive case but omit the
   negative case, the edge case, or the error case.
3. Flag "if/else" constructs where the else is vague ("otherwise,
   use your judgment").

**Rewrite pattern**: Add explicit else/default branches. "If the
file exists, parse it" → "If the file exists, parse it. If the
file does not exist, report finding F-NNN with severity High."

### 2.2 Missing Bounds and Constraints (High)

Flag instructions that reference quantities, sizes, or durations
without concrete limits:

- "Limit the output" (to what?)
- "Keep it concise" (how many words/sections/items?)
- "A reasonable number" (what number?)
- "Recent" (how recent — last 7 days? last commit?)

**Rewrite pattern**: Add explicit bounds. "Keep the summary
concise" → "The summary must be 2–4 sentences."

### 2.3 Missing Exit Criteria (Medium)

Flag loops, iterations, or recursive processes that lack a
termination condition:

- "Repeat until satisfied" (what defines satisfaction?)
- "Continue refining" (when does refinement stop?)
- "Iterate as needed" (what signals completion?)

**Rewrite pattern**: Define the exit condition explicitly.
"Iterate until the design is complete" → "Iterate until all
requirements in the input have a corresponding design section
with at least one acceptance criterion addressed."

### 2.4 Unspecified Ordering or Priority (Medium)

Flag instructions that present multiple items without specifying
execution order or relative priority:

- "Consider factors A, B, and C" (in what order? equal weight?)
- "Review the following areas" (sequentially? in parallel?
  by priority?)
- "Address these concerns" (which first?)

**Rewrite pattern**: Number the steps or state the priority rule.
"Consider security, performance, and readability" → "Evaluate in
this priority order: (1) security, (2) correctness,
(3) performance, (4) readability."

### 2.5 Missing Output Specification (High)

Flag instructions that request output without specifying:

- The structure (sections, fields, format)
- The granularity (per-file, per-function, per-finding)
- The artifact type (report, list, table, code block)

**Rewrite pattern**: Add explicit output structure. "Report your
findings" → "Report each finding using the template: Severity,
Location, Description, Evidence, Remediation."

## Phase 3: Semantic Precision

Assess whether instructions are specific enough to produce
consistent behavior across different LLM sessions.

### 3.1 Abstract Action Verbs (Medium)

Flag action verbs that describe a goal without specifying the
method:

- "analyze", "evaluate", "assess", "examine", "investigate",
  "review", "study", "explore"

These are acceptable ONLY when followed by numbered sub-steps, each
naming a concrete action (not another abstract verb) with a
measurable completion condition. Flag instances where the verb
stands alone as the complete instruction.

**Rewrite pattern**: Decompose into concrete sub-steps.
"Analyze the code for issues" → "For each function: (1) check
parameter validation, (2) trace error propagation paths,
(3) verify resource cleanup in all exit paths."

### 3.2 Undefined Domain Terms (Medium)

Flag terms that have domain-specific meaning but are not defined
in the prompt:

- Technical jargon used without definition or reference
- Acronyms not expanded on first use
- Terms that have different meanings in different contexts
  (e.g., "component" in React vs. hardware vs. prompt engineering)

**Rewrite pattern**: Define the term on first use or reference an
external definition. "Check for race conditions" → "Check for race
conditions (concurrent access to shared mutable state without
synchronization)."

### 3.3 Implicit Context Dependencies (High)

Flag instructions that assume context not provided in the prompt:

- References to "the project", "the codebase", "the system"
  without specifying what is in scope
- Assumed knowledge of conventions, tools, or processes not
  stated in the prompt
- References to "previous" results, "earlier" analysis, or
  "above" without explicit back-references

**Rewrite pattern**: Make the context explicit. "Follow the
project's conventions" → "Follow the conventions defined in
CONTRIBUTING.md, specifically: [list the relevant conventions]."

### 3.4 Missing Examples (Low–Medium)

Flag complex or novel instructions that lack illustrative
examples:

- Classification schemes without example classifications
- Output formats without a concrete sample
- Pattern descriptions without concrete instances

Classify as Medium when the instruction introduces a concept,
schema, category set, output structure, or term that is central
to the task and the same document does not provide either (a) an
explicit definition, or (b) at least one concrete example.
Classify as Low when the instruction lacks an example but the same
document already makes the meaning operational through an explicit
definition, sample output, glossary entry, or enumerated categories
or steps.

**Rewrite pattern**: Add at least one concrete example for each
novel concept. For classification schemes, provide one example
per category.

## Phase 4: Classification and Reporting

After completing Phases 1–3, produce the determinism assessment.

### 4.1 Per-Instruction Scoring

For each flagged instruction or passage:

1. Record the location (section heading, line, or passage excerpt).
2. Assign a determinism level (High / Medium / Low non-determinism).
3. Cite the specific pattern from Phase 1, 2, or 3 that triggered
   the flag.
4. For High and Medium findings, provide a concrete rewrite
   suggestion that would reduce the non-determinism level by at
   least one step. For Low findings, record "No rewrite needed."

### 4.2 Per-Section Aggregation

For each logical section of the analyzed text:

1. Count findings by level (High / Medium / Low).
2. Assign an overall section determinism grade:
   - **Precise**: 0 High, ≤ 2 Medium
   - **Acceptable**: 0 High, > 2 Medium; or 1 High with ≤ 2 Medium
   - **Imprecise**: ≥ 2 High, or 1 High with > 2 Medium
3. Sections graded Imprecise should be flagged for priority rewrite.

### 4.3 Overall Assessment

Produce an overall determinism summary:

1. Total findings by level across the entire text.
2. Overall grade (Precise / Acceptable / Imprecise) using the
   same thresholds as section grading, applied to the full text.
3. Top 3–5 highest-impact rewrite recommendations, ordered by
   the degree of non-determinism reduction.
4. A per-section scorecard table:

   | Section | High | Medium | Low | Grade |
   |---------|------|--------|-----|-------|
   | ...     | ...  | ...    | ... | ...   |

## Output Format

For each finding, report:

```
[DETERMINISM: High | Medium | Low]
Pattern: <pattern category from Phase 1/2/3 — e.g., "1.2 Subjective Adjective">
Location: <section heading or line reference>
Original: "<exact text flagged>"
Issue: <why this introduces non-determinism>
Rewrite: "<concrete suggested replacement>"
```
