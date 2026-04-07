# Case Study: Linting PromptKit's Own Prompts for Determinism

## The Problem

PromptKit's components — protocols, templates, formats — are consumed
by LLMs, not humans. When a protocol says "analyze the code for
significant issues," different LLMs (or the same LLM across runs)
apply different thresholds for "significant." The instruction is
technically coherent to a human reviewer, but it introduces
non-deterministic behavior in practice.

This is the same class of problem that the `anti-hallucination` protocol
solves for outputs (preventing fabrication) and `requirements-elicitation`
solves for requirements (demanding testable criteria) — but applied to
PromptKit's own directive text. The library had no mechanism to
systematically detect imprecise language in its own instructions.

### The Spark

During a design conversation, we asked: "Can an LLM assess a prompt for
non-determinism potential?" The answer was yes — and the natural next
step was: "Can we build prompt lint into PromptKit's self-audit workflow?"

## What We Built

Three new components, plus integrations into four existing ones:

**New components:**

| Component | Purpose |
|-----------|---------|
| `prompt-determinism-analysis` protocol | 4-phase analysis: lexical pattern scan → structural completeness → semantic precision → classification. Defines H/M/L determinism scale. |
| `input-clarity-gate` guardrail | Applies the same patterns to user input, generating clarifying questions instead of findings. |
| `lint-prompt` template | Standalone template for linting any prompt text — not just PromptKit components. |

**Integrations:**

| Touchpoint | What it does |
|------------|--------------|
| `self-verification` §6 | Preventive — catches vagueness in generated output before finalizing |
| `audit-library-health` Pass 4 | Retrospective — audits existing library components |
| `self-audit-prompt` §7 | Structural — CI-like checks for language precision |
| `requirements-elicitation` Phase 3 | Extended ambiguity detection with determinism patterns |
| `bootstrap.md` step 6 | Input clarity check during parameter collection |

This gives full lifecycle coverage: new components are linted at
generation time (self-verification §6), existing components are audited
periodically (Pass 4), and user inputs are validated before assembly
(bootstrap step 6 + input-clarity-gate).

## Running the Audit

```bash
cd promptkit
copilot
# "Run audit-library-health against this repo, focus on determinism"
```

The audit scoped to Pass 4 only (Language Determinism Analysis) with
standard strictness (High and Medium findings, Low scorecard-only).
Four parallel explore agents analyzed 60 component files simultaneously:

- Agent 1: 14 guardrail + analysis protocols
- Agent 2: 20 reasoning protocols
- Agent 3: 19 templates
- Agent 4: 10 templates + 8 formats

Total wall-clock time: ~90 seconds for all four agents.

## The Findings

**55 High-severity findings** and **~61 Medium-severity findings**
across 60 components. Overall library grade: **Imprecise**.

### Pattern Distribution

The dominant pattern — responsible for a third of all High findings —
was **subjective adjectives used as evaluation criteria**:

| Pattern | Count | % of High |
|---------|-------|-----------|
| Subjective Adjectives | 18 | 33% |
| Missing Conditional Branches | 10 | 18% |
| Missing Output Specification | 9 | 16% |
| Unanchored Comparatives | 4 | 7% |
| Missing Bounds | 4 | 7% |
| Vague Quantifiers | 4 | 7% |
| Implicit Context | 3 | 5% |
| Missing Exit Criteria | 3 | 5% |

### Concrete Examples

**Subjective adjective** — `author-design-doc.md`:
> "For every significant design decision, provide tradeoff analysis"

"Significant" is undefined. One LLM might analyze every decision;
another might skip anything below architectural level. Fix: "For every
design decision that (a) affects multiple components, (b) impacts
non-functional requirements, or (c) is difficult to reverse."

**Missing branch** — `self-verification.md`:
> "If any answer is 'no' and the vague language is not intentionally
> flexible, tighten the language"

What happens when the language IS intentionally flexible? The else
branch is missing. The LLM silently chooses.

**Missing output spec** — `adversarial-falsification.md`:
> "Maintain a record of candidate findings that were investigated and
> rejected"

What structure? A table? Prose? Per-function or per-finding? Fix:
"Maintain a 3-column markdown table: | Candidate Finding | Reason
Rejected | Safe Mechanism |"

**Unanchored comparative** — `agent-instructions.md`:
> "Keep each skill file under ~4 KB for reliable ingestion"

"~4 KB" is approximate. Fix: "≤4 KB hard limit; 10 KB maximum."

### The Irony

The `prompt-determinism-analysis` protocol itself graded **Imprecise**
(2 High findings). One was: "specific sub-steps that operationalize
the verb" — the word "operationalize" is undefined. A determinism
linter with non-deterministic language in its own definition. This was
caught and fixed during PR review.

## Grade Distribution

| Grade | Components | % |
|-------|-----------|---|
| **Precise** (0 High, ≤2 Medium) | 7 | 12% |
| **Acceptable** (within thresholds) | 35 | 58% |
| **Imprecise** (≥2 High or 1 High + >2 Medium) | 18 | 30% |

Seven components achieved Precise — zero non-determinism findings:
`root-cause-analysis`, `devops-platform-analysis`,
`requirements-from-implementation`, `test-compliance-audit`,
`invariant-extraction`, `corpus-safety-audit`, and
`minimal-edit-discipline`. These are the library's most deterministic
protocols.

## Why It Works

1. **Concrete pattern catalog, not vibes.** The protocol defines 14
   specific pattern categories across 3 phases, each with a rewrite
   template. "Subjective adjective" is not "I feel this is vague" — it's
   a specific word list ("good," "appropriate," "reasonable," etc.) with
   a concrete replacement strategy (observable criteria).

2. **Dual-direction coverage.** Output linting (rewrite suggestions) and
   input linting (clarifying questions) use the same pattern catalog but
   different response modes. The pattern "vague quantifier" is the same
   whether it appears in a protocol phase or in a user's problem
   description.

3. **Three integration points cover the lifecycle.** New components are
   caught at generation time (self-verification §6), existing components
   are audited periodically (Pass 4), and user inputs are validated
   during assembly (bootstrap step 6). No single point of failure.

4. **Parallel analysis scales.** Four explore agents analyzed 60 files
   in 90 seconds. The same methodology would take hours if done
   sequentially by a human reviewer.

5. **The protocol eats its own dog food.** Running it against PromptKit
   itself found real issues — 55 High findings with concrete rewrites.
   The PR review process also caught imprecision in the protocol's own
   language, which was fixed across 5 review rounds (19 comments, all
   valid, zero bikeshedding).

## Takeaways

- **Prompts are code.** If an LLM consumes your text as instructions,
  that text has the same determinism requirements as source code. Vague
  instructions produce vague behavior.

- **Subjective adjectives are the #1 enemy of prompt determinism.** A
  third of all findings were adjectives used as evaluation criteria.
  The fix is simple but pervasive: replace every subjective adjective
  with observable, enumerable criteria.

- **Your prompt linter will lint itself.** Building a determinism
  analysis tool forces you to write deterministic analysis instructions,
  which is harder than it sounds. The PR review process surfaced 19
  consistency issues across 5 rounds — each one a real cross-component
  contradiction, not bikeshedding.

- **The same patterns apply to inputs and outputs.** The `input-clarity-gate`
  guardrail reuses the exact same pattern catalog as the output linter
  but generates clarifying questions instead of findings. This was a
  natural extension that addressed [issue #168](https://github.com/microsoft/PromptKit/issues/168)
  (Input Precision Analysis).

- **30% Imprecise is normal for a v0.6 library.** The library was
  originally authored for human consumption. LLM-as-consumer is a
  higher precision bar. The path to Acceptable across the board is
  systematic rewrites using the audit's own suggestions — the report
  provides concrete replacements for every finding.
