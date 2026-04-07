<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: agent-behavioral-failures
type: taxonomy
description: >
  Classification scheme for AI agent behavioral failure modes.
  Covers failures where agents violate known rules under optimization
  pressure, misdiagnose with high confidence, retry failing approaches,
  hoard context, or optimize prematurely. Distinct from tool failures
  (which are bugs in the tool) — these are predictable agent behaviors.
domain: agent-reliability
applicable_to:
  - review-code
  - investigate-bug
---

# Taxonomy: Agent Behavioral Failures

Use these labels to classify findings when analyzing agent session
logs, post-mortems, or workflow failures. Every finding MUST use
exactly one label from this taxonomy.

These categories describe **agent behavior**, not tool bugs. A tool
failure is "edit_file dropped lines" (the tool is broken). A
behavioral failure is "the agent skipped the verify step after
edit_file" (the agent chose a shortcut). Both can co-occur, but the
classification and remediation differ.

## Labels

### ABF-1: Safety Bypass Under Optimization Pressure

The agent reads and acknowledges safety procedures, then skips them
when facing bulk, repetitive, or time-pressured work. The agent
rationalizes the shortcut (e.g., "I'll use a script to be more
efficient") and bypasses all safety checks in the process.

**Pattern**: Agent completes onboarding (reads rules, confirms
understanding) → first bulk task arrives → agent substitutes a
batch approach that skips per-item verification → silent corruption
occurs → recovery requires human intervention.

**Example**: Agent instructed to edit 46 files using a
snap/verify/peek workflow. Under efficiency pressure, agent writes
a PowerShell script to edit all files at once, skipping the per-file
verification step. 100 lines silently deleted from one file.

**Remediation**: Automate safety checks into paths the agent cannot
skip (CI gates, pre-commit hooks, build-time verification). Frame
violations as "producing broken output" rather than "breaking
process" — agents optimize for output quality more reliably than
process fidelity.

### ABF-2: Confidence-Driven Misdiagnosis

The agent commits early to a diagnosis with high confidence, then
ignores or explains away contradicting evidence. The agent does not
re-evaluate its hypothesis when evidence fails to support it.

**Pattern**: Agent observes symptom → forms hypothesis about the
cause → investigates with confirmation bias → finds evidence that
partially fits → declares root cause found → fix does not resolve
the problem because the actual cause is elsewhere.

**Example**: 1,600 type errors in a compiler. Agent diagnoses the
type checker as broken and spends an hour investigating type
inference. Actual cause: the parser feeds malformed AST to the type
checker. A 3-line parser fix resolves all 1,600 errors.

**Remediation**: Apply the `minimal-reproduction` protocol — force
the agent to isolate the bug through binary simplification rather
than reasoning from the symptom directly. Require checking upstream
components before blaming the component that produces the error.

### ABF-3: Infinite Retry Loop

The agent retries the same failing approach with minor variations
instead of switching to a fundamentally different approach. Each
retry consumes tokens without progress.

**Pattern**: Agent attempts approach A → fails → retries approach A
with a small tweak → fails → retries again with another tweak →
fails → continues retrying (3+ attempts of the same fundamental
approach) without stepping back to reconsider.

**Example**: Agent tries `edit_file` to modify a function, gets a
merge conflict. Retries `edit_file` with a slightly different
context window. Fails again. Retries a third time with even more
context. Never considers `create_file` with the complete corrected
content as an alternative.

**Remediation**: Apply the `tool-reliability-defense` protocol rule
6 (escalate on repeated failures) — after 2 consecutive failures of
the same approach, require switching to a fundamentally different
method. Document the failed approaches to prevent the next session
from repeating them.

### ABF-4: Context Hoarding

The agent searches broadly and accumulates large amounts of context
instead of reading the specific, known-relevant files. This wastes
context window capacity and dilutes attention.

**Pattern**: Agent needs to understand function X → runs
`grep -rn "function_name"` across the entire repository → reads
500+ lines of search results → loses track of the specific question
→ re-searches with a different query → repeats.

**Example**: Agent needs to understand a 10-line function. Instead
of reading the file containing the function, agent runs 4 separate
grep searches, reads 30 files of results, and exhausts 40% of the
context window before reading the actual function.

**Remediation**: Apply the `operational-constraints` protocol —
scope before searching, prefer reading specific files over broad
search, summarize intermediate findings to free context.

### ABF-5: Premature Optimization

The agent optimizes for speed or elegance at the expense of
correctness. The agent produces a "clever" solution that is faster
to generate but harder to verify and more likely to contain bugs.

**Pattern**: Agent has a straightforward-but-tedious correct
approach available → chooses a "smarter" approach to save time →
the smarter approach has edge cases the agent does not handle →
subtle bugs introduced.

**Example**: Agent needs to update 20 config values. Straightforward
approach: edit each value individually with verification. Agent
instead writes a regex-based bulk replacer that handles 18 of 20
cases correctly but silently corrupts 2 values with special
characters.

**Remediation**: Apply the `definition-of-done` protocol — require
verification of each individual change, not just the batch result.
Scope tasks small enough that "do it right" and "do it fast"
converge.

### ABF-6: Ephemeral Memory Failure

The agent has no memory of prior session failures and repeats
mistakes that were already diagnosed and documented. Each new
session starts from zero, unaware of lessons learned.

**Pattern**: Session N encounters a problem → diagnoses and
documents the root cause → Session N+1 encounters the same problem
→ re-investigates from scratch → reaches the same conclusion after
wasting equivalent effort.

**Example**: Session 1 discovers that `CS2001` build errors are
pre-existing and should be ignored. Session 2 spends 30 minutes
investigating the same `CS2001` errors before reaching the same
conclusion.

**Remediation**: Use the `author-known-conditions-registry` template
to document recurring conditions. Use the `session-handoff` protocol
to transfer context between sessions. Embed known conditions in
agent instruction files so every session starts with awareness.
