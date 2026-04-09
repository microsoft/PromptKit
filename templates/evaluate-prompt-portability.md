<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: evaluate-prompt-portability
mode: interactive
description: >
  Evaluate a PromptKit-assembled prompt's portability across LLM
  models. Runs the prompt against multiple models with a golden
  input, decomposes outputs into semantic claims, performs
  cross-model consensus analysis, and produces a portability report
  with hardening recommendations.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/prompt-portability-evaluation
format: portability-report
params:
  assembled_prompt: "The complete assembled prompt to evaluate (full text or file path)"
  golden_input: "The deterministic test input to provide to each model along with the prompt"
  models: "Comma-separated list of model identifiers to evaluate. Default: claude-sonnet-4.5, gpt-4.1, claude-haiku-4.5"
  arbiter_model: "Model to use for claim extraction and semantic matching. Default: use the current session model"
  reference_model: "Optional — designate one model as the ground-truth baseline for sufficiency analysis. When set, the report includes a model sufficiency matrix showing which cheaper models reproduce the reference model's output. Omit for pure consensus analysis."
  sufficiency_threshold: "Minimum percentage of reference model claims a cheaper model must reproduce to be considered sufficient. Default: 90"
input_contract: null
output_contract:
  type: portability-report
  description: >
    A structured portability report documenting claim-level consensus
    across models, divergence analysis, portability scoring, and
    hardening recommendations.
---

# Task: Evaluate Prompt Portability

You are tasked with evaluating whether a prompt produces semantically
equivalent outputs across different LLM models. You do NOT compare raw
text — you compare the **semantic claims** each model's output makes.

## Inputs

**Assembled Prompt**:
{{assembled_prompt}}

**Golden Input**:
{{golden_input}}

**Target Models**: {{models}} (if blank, use: `claude-sonnet-4.5`,
`gpt-4.1`, `claude-haiku-4.5`)

**Arbiter Model**: {{arbiter_model}} (if blank, you are the arbiter)

**Reference Model**: {{reference_model}} (if blank, skip sufficiency
analysis — perform consensus analysis only)

**Sufficiency Threshold**: {{sufficiency_threshold}}% (if blank, use 90%)

## Instructions

### Step 1: Input Validation

1. Confirm the assembled prompt is non-empty. If it is a file path,
   read the file. If the content is empty, stop and report the error.
2. Confirm the golden input is non-empty.
3. Parse the model list. If any model identifier is not recognized by
   the execution environment, warn the user and ask whether to skip
   it or substitute.
4. If a reference model is specified, confirm it is included in the
   model list. If not, add it automatically and inform the user.

### Step 2: Fan-Out Execution

Execute the assembled prompt against each target model using the
golden input. The goal is to collect raw outputs from every model
for the same prompt + input combination.

1. For each model in the target list, launch a parallel execution:
   - Provide the full assembled prompt as the system/task instruction.
   - Provide the golden input as the user message or task context.
   - Record the complete raw output.
2. **Execution mechanism**: Use the execution environment's parallel
   agent or subprocess capabilities. For example, in environments
   with sub-agent support, launch one agent per model with the model
   override parameter. In environments without parallel execution,
   run sequentially.
3. Wait for all executions to complete. If any model fails (timeout,
   API error, content filter), record the failure and proceed with
   the remaining models. Count the number of successful model
   outputs after all executions finish.
4. A minimum of 2 successful model outputs is required to produce a
   meaningful comparison. If fewer than 2 models succeed, do **not**
   continue to claim extraction, semantic matching, consensus
   analysis, portability scoring, or hardening recommendations.
   Instead, stop and produce an abbreviated report that includes:
   - the full target model list,
   - which models succeeded,
   - which models failed,
   - the failure reason for each failed model if known, and
   - a clear statement that the evaluation ended early because there
     were insufficient successful outputs for cross-model comparison.
5. Only proceed to Step 3 if at least 2 model executions succeeded.

### Step 3: Claim Extraction

Apply Phase 2 of the prompt-portability-evaluation protocol to each
model's raw output.

1. For each model output, extract every atomic claim into the
   normalized claim record structure: `claim_id`, `claim_text`,
   `section`, `type`, `specificity`.
2. Use the same extraction approach for all outputs — the arbiter
   (you, or the designated arbiter model) processes each output
   identically.
3. Present the claim counts per model to the user before proceeding.
   If any model produced zero claims, flag it as a potential failure.

### Step 4: Cross-Model Semantic Matching

Apply Phase 3 of the prompt-portability-evaluation protocol.

1. Build the claim universe from all model outputs.
2. Perform pairwise semantic matching across all claims.
3. Cluster matched claims and record match confidence.
4. If any claim cluster contains an `uncertain` semantic match,
   place that cluster into a Manual Review bucket rather than a
   scored classification bucket.
5. Exclude all Manual Review clusters from consensus/scoring
   calculations in subsequent steps.
6. Record all Manual Review clusters for reporting under the
   format's `Uncertain / Needs Review` section, and explicitly call
   them out to the user before proceeding.

### Step 5: Consensus Classification

Apply Phase 4 of the prompt-portability-evaluation protocol.

1. Classify each non-Manual-Review claim cluster: Consensus,
   Majority, Singular, or Contradictory.
2. Present the classification summary to the user:
   - How many Consensus, Majority, Singular, and Contradictory
     clusters were found.
   - How many clusters are in Manual Review (excluded from scoring).
   - Highlight any Contradictory clusters immediately — these are the
     highest-priority signal.

### Step 6: Divergence Analysis

Apply Phase 5 of the prompt-portability-evaluation protocol.

For each Singular and Contradictory claim cluster:
1. Identify the prompt region that produced the divergence.
2. Classify the divergence cause.
3. Assess whether a prompt rewrite could address it.

### Step 7: Scoring and Reporting

Apply Phase 6 and Phase 7 of the prompt-portability-evaluation protocol.

1. Compute the portability score.
2. Generate hardening recommendations for each fixable divergence.
3. If a reference model is specified, apply Phase 8 (Model
   Sufficiency Analysis):
   - Compute per-model sufficiency rates against the reference.
   - Classify missing and extra claims.
   - Determine sufficiency status for each model.
   - Identify the minimum sufficient model.
4. Produce the full portability report in the portability-report
   format, including the Model Sufficiency Matrix (section 10) if
   a reference model was specified.

### Step 8: Interactive Review

After producing the report:

1. Present the portability score and the top 3 most impactful
   findings to the user.
2. Ask if they want to:
   - Drill into specific divergent claims
   - Apply the hardening recommendations to the original prompt
   - Re-run the evaluation with additional models
   - Export the report

## Complementary Templates

This template evaluates a prompt's portability *empirically* — by
running it and comparing outputs. For *static* analysis of prompt
language precision, use the `lint-prompt` template with the
`prompt-determinism-analysis` protocol. The recommended workflow is:

1. **Lint first** (`lint-prompt`) — identify and fix determinism issues
   in the prompt language statically.
2. **Evaluate second** (`evaluate-prompt-portability`) — verify the
   fixes improved cross-model consistency empirically.

## Non-Goals

- This template does NOT measure output *quality* — only cross-model
  *consistency*. A prompt that produces consistently wrong output
  across all models will score as "Portable."
- This template does NOT modify the evaluated prompt. It produces
  recommendations. The user applies them.
- This template does NOT benchmark model performance or rank models.
  It evaluates the prompt's sensitivity to model choice.

## Quality Checklist

Before finalizing the report, verify:

- [ ] All target models were executed (or failures documented)
- [ ] Claim extraction used the same procedure for all outputs
- [ ] Every claim cluster has a classification with justification
- [ ] Contradictory claims cite the exact prompt language causing divergence
- [ ] Hardening recommendations are concrete rewrites, not vague advice
- [ ] The portability score computation is shown (not just the result)
- [ ] Model Notes section is populated for capability-gap divergences
