<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: prompt-portability-evaluation
type: reasoning
description: >
  Systematic methodology for evaluating prompt portability across LLM
  models. Decomposes model outputs into atomic claims, performs
  cross-model semantic matching, and classifies consensus levels to
  identify fragile prompt language.
applicable_to:
  - evaluate-prompt-portability
---

# Protocol: Prompt Portability Evaluation

Apply this protocol when evaluating whether a prompt produces
semantically equivalent outputs across different LLM models. The unit
of comparison is the **claim** — an atomic assertion the output makes —
not the raw text. Two outputs that say the same thing in different words
are equivalent; two outputs with identical structure but different
conclusions are divergent.

## Phase 1: Output Collection

1. **Validate inputs.** Confirm the assembled prompt is non-empty and
   the golden input is non-empty. If either is missing, stop and report
   the error.
2. **Enumerate target models.** List the models to evaluate. If the
   user did not provide a list, use the default set:
   `claude-sonnet-4.5`, `gpt-4.1`, `claude-haiku-4.5`.
3. **Execute the prompt against each model.** For each model:
   - Provide the identical assembled prompt and golden input.
   - Use the same system context and tool availability where possible.
   - Record the model identifier and the complete raw output.
4. **Launch evaluations in parallel** when the execution environment
   supports it (e.g., parallel sub-agents with model overrides). Do NOT
   run models sequentially if parallel execution is available.

## Phase 2: Claim Extraction

For each model's raw output, extract a set of **atomic claims**. A claim
is a single, self-contained assertion that the output makes. Apply the
same extraction procedure identically to every output.

1. **Read the output end-to-end.** Identify every discrete assertion,
   finding, recommendation, observation, or caveat.
2. **Normalize each claim** into a structured record:

   | Field | Description |
   |-------|-------------|
   | `claim_id` | Sequential ID within this model's output (e.g., `M1-C001`) |
   | `claim_text` | The normalized assertion in declarative form |
   | `section` | Which output section contains this claim |
   | `type` | `finding` · `recommendation` · `observation` · `caveat` · `classification` |
   | `specificity` | `concrete` (cites evidence/location) · `general` (abstract statement) |

3. **Granularity rule.** Each claim must be atomic — it asserts exactly
   one thing. If a sentence contains two assertions ("X is true and Y
   is also true"), split into two claims.
4. **Extraction exclusions.** Do NOT extract:
   - Boilerplate preambles ("I'll analyze this code for…")
   - Section headings or structural markers
   - Restatements of the input prompt or golden input
   - Meta-commentary about the model's own process

## Phase 3: Cross-Model Claim Matching

Compare claim sets across all models to identify semantic equivalences.

1. **Build a claim universe.** Collect all claims from all models into
   a single pool.
2. **Pairwise semantic matching.** For each claim from model A, check
   every claim from every other model:
   - **Match**: The two claims assert the same thing, even if worded
     differently. Evidence: they would have the same truth value in all
     plausible interpretations of the golden input.
   - **Partial match**: The claims overlap but one is more specific or
     covers a subset of the other's assertion.
   - **No match**: The claims assert different things.
   - **Contradiction**: The claims assert mutually exclusive things
     about the same subject.
3. **Cluster matched claims.** Group semantically equivalent claims
   into **claim clusters**. Each cluster represents one unique
   assertion that one or more models made.
4. **Record match confidence.** For each match decision, note the
   confidence: `definite` (identical meaning), `likely` (same meaning,
   different framing), `uncertain` (possibly the same, possibly
   different).

## Phase 4: Consensus Classification

Classify each claim cluster by how many models produced it.

| Classification | Criterion | Interpretation |
|----------------|-----------|----------------|
| **Consensus** | All models produced this claim | Semantically stable — the prompt reliably elicits this assertion |
| **Majority** | >50% of models (but not all) produced this claim | Likely valid but not universally elicited — prompt may be ambiguous |
| **Singular** | Exactly one model produced this claim | Possible hallucination, unique insight, or model-specific interpretation |
| **Contradictory** | Two or more models assert mutually exclusive things | The prompt is ambiguous on this point — different models resolve the ambiguity differently |

Rules:
- A claim cluster with any `uncertain` match must be placed in a
  **Manual Review** bucket rather than auto-classified as Consensus,
  Majority, Singular, or Contradictory.
- Manual Review clusters are **excluded from the portability score**
  until a human reviewer resolves the uncertain match and assigns the
  cluster to a standard classification.
- Report Manual Review clusters in a separate portability report
  section named **Uncertain / Needs Review**. Do not include them under
  the standard classification counts until they are resolved.
- Singular claims from high-capability models are not automatically
  hallucinations — they may represent deeper analysis that other models
  missed. Note the model capability tier.
- Contradictory claims are the highest-priority signal. Always trace
  these to specific prompt language in Phase 5.

## Phase 5: Divergence Root Cause Analysis

For each Singular or Contradictory claim cluster:

1. **Identify the prompt region** that the claim responds to. Which
   instruction, protocol phase, or format requirement produced this
   claim?
2. **Analyze the prompt language.** What about the instruction is
   ambiguous, underspecified, or open to interpretation?
   - Vague quantifiers ("several", "a few")
   - Subjective adjectives ("important", "significant")
   - Missing scope bounds ("analyze the code" — which code?)
   - Implicit assumptions (domain knowledge the prompt assumes)
   - Competing instructions (two directives that could conflict)
3. **Classify the divergence cause:**

   | Cause | Description |
   |-------|-------------|
   | `ambiguous-instruction` | The prompt instruction has multiple valid interpretations |
   | `underspecified-scope` | The prompt does not bound what to examine or how deeply |
   | `model-capability-gap` | One model lacks the capability to follow the instruction |
   | `hallucination` | One model fabricated a claim with no basis in the input |
   | `depth-variation` | Models analyzed to different depths — all are correct, but some are more thorough |
   | `format-interpretation` | Models interpreted the output format requirements differently |

## Phase 6: Portability Scoring

Compute a portability score for the evaluated prompt.

1. **Claim-level scoring.** For each claim cluster:
   - Consensus = 1.0
   - Majority = 0.5
   - Singular = 0.0
   - Contradictory = −1.0

2. **Aggregate score.** First compute the weighted mean of all claim
   cluster scores, weighted by claim type priority:
   - `finding` weight = 3 (findings that differ are high-impact)
   - `recommendation` weight = 2
   - `classification` weight = 2
   - `observation` weight = 1
   - `caveat` weight = 1

   Then normalize the weighted mean from the `[-1.0, 1.0]` range into
   the final portability score in the `[0.0, 1.0]` range using:

   `portability_score = (raw_weighted_mean + 1.0) / 2.0`

   This preserves the stronger penalty for contradictory claims while
   ensuring the reported portability score cannot be negative or exceed
   `1.0`.

3. **Interpret the score:**

   | Score Range | Rating | Interpretation |
   |-------------|--------|----------------|
   | ≥ 0.85 | **Portable** | Prompt produces semantically equivalent output across models |
   | 0.60–0.84 | **Mostly Portable** | Core findings are stable; peripheral claims vary |
   | 0.35–0.59 | **Fragile** | Significant divergence — prompt hardening needed |
   | < 0.35 | **Model-Dependent** | Output varies substantially — prompt needs major revision |

## Phase 7: Hardening Recommendations

For each Singular or Contradictory claim cluster, propose a specific
prompt rewrite that would move the claim toward Consensus.

1. **State the current prompt language** (exact quote).
2. **Explain why it produces divergence** (from Phase 5 analysis).
3. **Propose a rewrite** that eliminates the ambiguity. The rewrite
   must be concrete — not "make this more specific" but the actual
   replacement text.
4. **Predict the effect** — which models would change behavior and why.

Rules:
- Rewrites must not change the prompt's intent — only its precision.
- Rewrites must follow PromptKit conventions (imperative mood, numbered
  phases, explicit scope bounds).
- If a divergence is caused by `model-capability-gap`, note that no
  prompt rewrite can fix it. Instead recommend a `model_notes` entry.
