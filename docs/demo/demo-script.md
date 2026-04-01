# PromptKit Demo — Presenter Script

> **Estimated total time: 15–20 minutes for 2 scenarios, 25–30 for all 3.**
>
> Pick **Scenario 1 (Code Review)** plus either Scenario 2 or 3 for a
> focused demo. Run all 3 only if you have 30 minutes.

---

## Opening (2 minutes)

### Talking Points

- "Every developer asks LLMs for help — code reviews, requirements,
  debugging. But how much does the *quality of the prompt* affect the
  *quality of the answer*?"
- "Today I'll run the **exact same task** through two approaches:
  a quick, natural-language prompt — what we'll call a *vibe prompt* —
  and a PromptKit-assembled prompt with an engineered persona, reasoning
  protocols, and output format."
- "We'll score the results on the same rubric so you can see the
  difference objectively."

### Setup Checklist

- [ ] Terminal with `copilot` CLI ready
- [ ] `docs/demo/` files open or accessible
- [ ] Scorecard template visible (printed or second screen)
- [ ] Audience cannot see the planted-bug comments in source files

---

## Scenario 1: Code Review (8 minutes)

### 1a. Show the Code (1 min)

Open `demo_server.c` and briefly walk through it:

> "This is a simple TCP echo server in C — about 120 lines. It accepts
> connections, reads data, echoes it back. Pretty typical systems code.
> Let's see what an LLM finds when we ask it to review this."

**⚠️ Scroll past the comment block at the top** — it lists the planted bugs.
Start showing from the `#include` lines.

### 1b. Vibe Run (2 min)

Type into Copilot CLI:

```
Review this C code for bugs.

<paste demo_server.c content, excluding the top comment block>
```

Let the output render. **Don't comment yet** — just say:

> "Okay, let's note what it found. We'll come back to this."

### 1c. PromptKit Run (3 min)

```
copilot -i "Read bootstrap.md and execute the prompt"
```

When prompted for the task:

> "I need to review C code for correctness and safety issues."

The bootstrap engine will select `review-cpp-code` and assemble the prompt.
Provide `demo_server.c` as the code context.

As the output renders, highlight:

> "Notice it's using named pattern families — CPP-1 for memory safety,
> CPP-5 for error handling. Each finding has a severity, exact line
> number, and a specific fix."
>
> "And see this self-verification step at the end — it re-checks its
> own findings before presenting them."

### 1d. Scorecard (2 min)

#### Scoring Rubric

| # | Factor | Vibe Score (0–2) | PromptKit Score (0–2) |
|---|--------|:---:|:---:|
| 1 | **Detection rate** — How many of the 5 bugs found? | ___ / 5 | ___ / 5 |
| 2 | **False positives** — Non-issues flagged as bugs? (0 = many, 2 = none) | | |
| 3 | **Severity accuracy** — Critical bugs ranked above medium? | | |
| 4 | **Specificity** — Exact line cited + explains *why* it's wrong? | | |
| 5 | **Actionability** — Concrete, correct fix provided? | | |
| 6 | **Epistemic honesty** — Distinguishes confirmed vs. suspected? | | |
| | **Total** | ___ / 12 | ___ / 12 |

#### What to Highlight

- **Detection gap:** The vibe prompt typically finds 2–3 bugs; PromptKit
  finds 4–5. The off-by-one (Bug 4) and use-after-free (Bug 1) are most
  commonly missed by vibe prompts.
- **False positives:** Vibe prompts often flag the `create_client` malloc
  as a leak (it's freed in `destroy_client` — red herring). PromptKit's
  memory-safety protocol traces allocation/deallocation pairs and
  correctly dismisses this.
- **Structure:** Vibe output is a flat list mixing bugs with style
  suggestions. PromptKit output is severity-classified with pattern IDs.

---

## Scenario 2: Requirements Authoring (8 minutes)

### 2a. Show the Description (1 min)

Read `rate_limiter_description.md` aloud:

> "Here's what the product manager gave us: 'We need a rate limiter
> for our REST API. It should limit each authenticated user to a
> configurable number of requests per time window. When the limit is
> exceeded, return HTTP 429.' That's it — three sentences."

### 2b. Vibe Run (2 min)

```
Write requirements for a rate limiter for our REST API. It should limit
each authenticated user to a configurable number of requests per time
window. When the limit is exceeded, return HTTP 429 Too Many Requests.
```

Let the output render. Note how many "requirements" it produces and
whether they have acceptance criteria.

### 2c. PromptKit Run (3 min)

Use `bootstrap.md` → select `author-requirements-doc`. Provide the same
3-sentence description as the `{{description}}` parameter.

As the output renders, highlight:

> "Look at the REQ-IDs — each requirement is numbered and atomic.
> Every one has acceptance criteria with specific pass/fail conditions."
>
> "And here — it surfaced requirements we didn't even mention:
> `Retry-After` header, distributed counting, clock skew, observability,
> graceful degradation. These are the implicit requirements that vibe
> prompts always miss."

### 2d. Scorecard (2 min)

#### Scoring Rubric

| # | Factor | Vibe Score (0–2) | PromptKit Score (0–2) |
|---|--------|:---:|:---:|
| 1 | **Testability** — Each req has pass/fail acceptance criteria? | | |
| 2 | **Atomicity** — Each req is a single verifiable statement? | | |
| 3 | **Completeness** — Edge cases covered? (burst, distributed, clock skew) | | |
| 4 | **Precision** — RFC 2119 keywords (MUST/SHOULD/MAY)? | | |
| 5 | **Structure** — REQ-IDs, constraints, assumptions, risks, non-goals? | | |
| 6 | **Implicit reqs** — Surfaced things user didn't mention? | | |
| | **Total** | ___ / 12 | ___ / 12 |

#### What to Highlight

- **Quantity gap:** Vibe prompts produce 5–8 vague bullets. PromptKit
  produces 15–25 atomic requirements.
- **"I didn't think of that" moment:** Call out 2–3 implicit requirements
  the audience wouldn't have considered (e.g., `Retry-After`, behavior
  when the time window boundary falls mid-request, what happens when
  the backing store is unavailable).
- **Downstream value:** "This document can now feed into PromptKit's
  design → validation → audit pipeline. Try doing that with bullet points."

---

## Scenario 3: Bug Investigation (8 minutes)

### 3a. Show the Code + Symptom (1 min)

Open `demo_queue.c` and briefly walk through it:

> "Producer-consumer queue — producers enqueue strings, consumers
> dequeue and process them. Works fine in single-threaded tests."

Then read the symptom:

> "But it crashes intermittently under load with 4 producer threads
> and 2 consumer threads. The crash is a segfault in `process_item()`,
> but that function looks correct. AddressSanitizer shows no heap issues."

### 3b. Vibe Run (2 min)

```
This code has a bug that causes intermittent crashes under load with
4 producer threads and 2 consumer threads. The crash is a segfault
inside process_item(), but that function looks correct. ASan reports
no heap issues. Find the root cause.

<paste demo_queue.c content, excluding the top comment block>
```

### 3c. PromptKit Run (3 min)

Use `bootstrap.md` → select `investigate-bug`. Provide the symptom
description and `demo_queue.c` as context.

As the output renders, highlight:

> "See the hypothesis table — it generated three potential causes and
> is evaluating evidence for each one, not just jumping to a conclusion."
>
> "It correctly identified the TOCTOU race: the count check on line 55
> is outside the lock. And look — it explicitly dismissed the strdup/free
> pattern as a red herring with evidence: 'freed on line 81 in consumer,
> matching the strdup on line 42.'"
>
> "Notice the confidence labels — KNOWN for the code structure, INFERRED
> for the race condition trigger, ASSUMED for the crash mechanism."

### 3d. Scorecard (2 min)

#### Scoring Rubric

| # | Factor | Vibe Score (0–2) | PromptKit Score (0–2) |
|---|--------|:---:|:---:|
| 1 | **Root cause correct** — Identified the TOCTOU race? | | |
| 2 | **Red herring rejected** — Did NOT flag malloc/free as a leak? | | |
| 3 | **Hypothesis rigor** — Generated ≥3 hypotheses with evidence? | | |
| 4 | **Causal chain** — Traced check → context switch → stale → crash? | | |
| 5 | **Confidence labeling** — KNOWN vs. INFERRED vs. ASSUMED? | | |
| 6 | **Remediation quality** — Fix is correct and complete? | | |
| | **Total** | ___ / 12 | ___ / 12 |

#### What to Highlight

- **Reasoning depth:** Vibe prompts often jump straight to "the mutex
  is wrong" without explaining the interleaving. PromptKit's root-cause-
  analysis protocol forces a causal chain.
- **Red herring:** Vibe prompts frequently flag the `strdup` as a memory
  leak. PromptKit's memory-safety protocol traces the alloc/free pair
  across functions and dismisses it.
- **Epistemic honesty:** Vibe prompts state "The bug is X" as fact.
  PromptKit labels confidence and distinguishes root cause from
  proximate cause (the crash is in `process_item`, but the *root cause*
  is in `dequeue`).

---

## Closing (2 minutes)

### The Multiplier Pitch

> "You saw the difference on one file. Now imagine doing this across
> 50 files, or 200 PRs, or every sprint's requirements."
>
> "With a vibe prompt, the quality varies every time — it depends on
> your mood, your wording, what you remembered to ask for."
>
> "With PromptKit, the quality is **consistent, composable, and
> version-controlled**. The same persona, the same protocols, the same
> output format — every time."

### The Agent Instruction Hook

> "And you don't have to run this manually every time. PromptKit can
> output persistent agent instruction files — for GitHub Copilot,
> Claude Code, or Cursor — so these protocols run automatically in
> every session."

### Call to Action

> "PromptKit is open source. The prompts you saw today are in the
> repository. You can use them as-is, customize them for your domain,
> or add new ones. The library has [X] templates, [Y] protocols, and
> [Z] personas — all composable."

---

## Appendix: Planted Bug Reference

### demo_server.c (5 bugs)

| # | Bug | Severity | Location | Description |
|---|-----|----------|----------|-------------|
| 1 | Use-after-free | Critical | L65, L73 | `client->buf` freed on disconnect, then read if caller loops |
| 2 | Buffer overflow | Critical | L52 | `strcpy`/`strcat` into 64-byte buffer, no bounds check |
| 3 | Unchecked return | High | L61 | `recv()` can return -1; code treats it as valid length |
| 4 | Off-by-one | Medium | L46 | `i <= len` writes one past buffer end |
| 5 | Resource leak | Medium | L83 | `client_fd` not closed on `send()` failure path |

### demo_queue.c (1 root cause + 1 red herring)

| # | Issue | Type | Location | Description |
|---|-------|------|----------|-------------|
| 1 | TOCTOU race | Root cause | L55–60 | `count` checked outside lock; another thread can drain queue between check and lock |
| 2 | strdup/free | Red herring | L42, L81 | Allocation in enqueue, free in consumer — this is correct |
