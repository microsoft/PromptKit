# PromptKit Demo: Vibe Prompt vs. Structured Prompt

This demo compares LLM output quality when tackling the same task with:

1. A **plain "vibe" prompt** — the kind most developers type
2. A **PromptKit-assembled structured prompt** — with persona, protocols,
   taxonomy, and output format

The goal is to show that prompt engineering isn't about clever wording —
it's about systematic composition of identity, reasoning methodology,
and output structure.

---

## What's in This Directory

| File | Purpose |
|------|---------|
| `demo_server.c` | Code review sample — C echo server |
| `demo_queue.c` | Bug investigation sample — producer-consumer queue |
| `rate_limiter_description.md` | Requirements authoring sample — 3-sentence project description |
| `demo-script.md` | Presenter script with timing, talking points, and scorecards |
| `answer-key.md` | **Presenter only** — planted bug reference and scoring guide |

## Quick Start

### Prerequisites

- GitHub Copilot CLI (`copilot` command available)
- Access to a Copilot Chat model (any tier)
- This repository cloned locally

### Running a Demo Scenario

Each scenario follows the same pattern:

1. **Vibe run** — paste the vibe prompt into Copilot CLI with the sample
   code/description as context
2. **PromptKit run** — use `bootstrap.md` to assemble and execute the
   structured prompt with the same context
3. **Compare** — score both outputs on the scorecard from `demo-script.md`

See `demo-script.md` for the full presenter walkthrough.

## Scenarios at a Glance

### Scenario 1: Code Review (Recommended First)

**Task:** Review `demo_server.c` for bugs.

| Approach | Prompt |
|----------|--------|
| Vibe | *"Review this C code for bugs."* |
| PromptKit | `review-cpp-code` template with `systems-engineer` persona, `memory-safety-c` + `cpp-best-practices` protocols |

**What to watch for:** Detection rate (5 planted bugs), false positives,
severity classification, specificity of fixes, epistemic honesty.

### Scenario 2: Requirements Authoring

**Task:** Write requirements from `rate_limiter_description.md`.

| Approach | Prompt |
|----------|--------|
| Vibe | *"Write requirements for a rate limiter for our REST API."* |
| PromptKit | `author-requirements-doc` template with `software-architect` persona, `requirements-elicitation` protocol |

**What to watch for:** Testability, atomicity, completeness (edge cases),
precision (RFC 2119 keywords), implicit requirements surfaced.

### Scenario 3: Bug Investigation

**Task:** Find the root cause of intermittent crashes in `demo_queue.c`.

| Approach | Prompt |
|----------|--------|
| Vibe | *"This code has a bug that causes intermittent crashes under load. Find it."* |
| PromptKit | `investigate-bug` template with `systems-engineer` persona, `root-cause-analysis` protocol |

**What to watch for:** Root cause correctness (TOCTOU race), red herring
rejection (malloc/free is correct), hypothesis rigor, causal chain
completeness, confidence labeling.

---

## Tips for Presenters

- **Don't reveal the planted bugs** before running both approaches.
- **Let the vibe output speak for itself** — don't critique it during the
  run. The scorecard does the talking.
- **Highlight the anti-hallucination effect** — PromptKit outputs label
  confidence (KNOWN / INFERRED / ASSUMED); vibe outputs state guesses as facts.
- **End with the multiplier pitch** — "Now imagine doing this 50 times
  across a codebase. The vibe prompt is different every time. The PromptKit
  prompt is version-controlled, tested, and consistent."
