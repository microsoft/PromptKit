# Case Study: Investigating a Bug with PromptKit

## The Problem

A developer encounters a segmentation fault in a C networking stack when
processing malformed packets. The crash is intermittent — it happens under
load but not in unit tests. Without PromptKit, they'd write a quick prompt
like:

> "I have a segfault in my packet parser. Here's the code. What's wrong?"

This produces a shallow response: the LLM guesses at a null pointer issue,
suggests adding a null check, and moves on. No systematic investigation, no
consideration of concurrency, no structured report.

## The PromptKit Approach

### Assembling the Prompt

```bash
npx promptkit assemble investigate-bug \
  -p problem_description="Intermittent segfault in packet_handler.c when \
     processing >100 concurrent connections. Crash occurs in parse_header() \
     at line 247. Not reproducible in single-threaded unit tests. Started \
     after commit abc1234 which added connection pooling." \
  -p code_context="packet_handler.c lines 200-350, connection_pool.c, \
     thread_pool.c. ASan reports heap-use-after-free." \
  -p environment="Ubuntu 22.04, gcc 12.3, pthreads, ASan/TSan enabled" \
  -o investigation.md
```

### What Gets Assembled

The prompt composes four layers:

**1. Identity — Systems Engineer Persona**

The LLM adopts the identity of a senior systems engineer with expertise in
memory management, concurrency, and debugging. Behavioral constraints
include "reason from first principles" and "distinguish epistemic states
(KNOWN/INFERRED/ASSUMED)."

**2. Reasoning Protocols**

Four protocols are loaded:

- **Anti-hallucination** — forces epistemic labeling on every claim. The
  LLM can't say "the bug is probably X" without tagging it as INFERRED and
  explaining the reasoning chain.
- **Self-verification** — the LLM must verify its own conclusions before
  presenting them.
- **Operational constraints** — scoping rules prevent the LLM from going
  down irrelevant paths.
- **Root cause analysis** — the 5-phase methodology:
  1. Symptom characterization (observed vs expected, timeline, blast radius)
  2. Hypothesis generation (≥3 before investigating any)
  3. Evidence gathering and elimination
  4. Root cause identification (root vs proximate)
  5. Remediation

**3. Output Format — Investigation Report**

The format specifies a 9-section report: Executive Summary, Problem
Statement, Investigation Scope, Findings (severity-ordered with F-NNN IDs),
Root Cause Analysis, Remediation Plan, Prevention, Open Questions, Revision
History.

**4. Task — Bug Investigation Template**

The template body contains the specific investigation instructions with the
user's parameters substituted in.

## The Difference

### Without PromptKit (ad-hoc prompt)

> "Looks like a null pointer dereference. Add a null check before line 247.
> Also consider using smart pointers."

- No systematic investigation
- No consideration of the concurrency angle
- No structured report
- Suggestion doesn't even apply (this is C, not C++)

### With PromptKit (composed prompt)

The LLM produces a structured investigation report:

**Findings:**
- **F-001 (Critical):** Heap-use-after-free in `parse_header()`. The
  connection pool recycles connection objects while a parser thread still
  holds a pointer to the header buffer. [KNOWN — ASan report confirms]
- **F-002 (High):** Missing synchronization between pool recycling and
  active parsing. `connection_pool.c:pool_return()` frees the buffer
  without checking the parser's reference count. [INFERRED — based on
  code structure; verify with TSan]

**Root Cause:** The connection pooling added in commit `abc1234` returns
connections to the pool (and frees their buffers) immediately on socket
close. But the parser thread may still be processing the last packet.
The proximate cause is the use-after-free at line 247; the root cause is
the missing lifetime management between the pool and parser threads.

**Key test:** "If we fix only the null check at line 247, will the root
cause produce other failures?" → Yes. Any other access to the recycled
connection's memory will also crash.

**Remediation:** Reference counting on connection objects, with
`pool_return()` deferring the free until the reference count reaches zero.

## Why It Works

1. **The persona** sets the right expertise level — the LLM thinks about
   memory lifetime, concurrency, and low-level debugging rather than
   suggesting high-level abstractions.

2. **Anti-hallucination** prevents the LLM from guessing. It must label
   claims as KNOWN (from the ASan report) or INFERRED (from code analysis)
   and flag assumptions.

3. **Root cause analysis** forces the LLM to generate ≥3 hypotheses before
   investigating, preventing it from anchoring on the first plausible
   answer. The root-vs-proximate distinction catches shallow fixes.

4. **The investigation report format** produces a structured document that
   can be shared with the team, not just a chat message that disappears.

## Takeaways

- **Composition matters.** No single component produces the full result.
  The persona provides expertise, the protocols enforce rigor, the format
  structures the output, and the template frames the task.
- **Guardrails prevent shallow answers.** Without anti-hallucination and
  root-cause-analysis protocols, the LLM takes shortcuts.
- **Structured output is shareable.** An investigation report with F-NNN
  findings, severity ratings, and a remediation plan is useful to the whole
  team, not just the person who ran the prompt.
