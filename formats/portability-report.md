<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: portability-report
type: format
description: >
  Output format for prompt portability evaluation reports. Structures
  cross-model comparison results as claim-level consensus analysis
  with portability scoring and hardening recommendations.
produces: portability-report
---

# Format: Portability Report

The output MUST be a structured portability report documenting how a
prompt performs across multiple LLM models. The unit of analysis is the
**claim** — an atomic assertion each model's output makes. The report
compares claims semantically, not textually.

Do not omit any section. If a section has no content, state
"None identified."

## Document Structure

```markdown
# <Prompt Name> — Portability Report

## 1. Evaluation Context

| Field | Value |
|-------|-------|
| **Prompt** | Name or description of the evaluated prompt |
| **Source Template** | PromptKit template used to assemble the prompt (if applicable) |
| **Golden Input** | Description of the test input provided |
| **Models Evaluated** | Comma-separated list of model identifiers |
| **Arbiter Model** | Model used for claim extraction and matching |
| **Evaluation Date** | When the evaluation was performed |

## 2. Portability Summary

**Overall Score**: <score> / 1.00 — **<Rating>**

| Metric | Value |
|--------|-------|
| **Total Unique Claims** | <count of claim clusters> |
| **Consensus Claims** | <count> (<percentage>%) |
| **Majority Claims** | <count> (<percentage>%) |
| **Singular Claims** | <count> (<percentage>%) |
| **Contradictory Claims** | <count> (<percentage>%) |

<2–4 sentence interpretation of the overall portability posture.>

## 3. Per-Model Output Summaries

For each model, provide a brief characterization of its output:

### Model: <model-identifier>

- **Output Length**: <word count or approximate size>
- **Sections Produced**: <list of output sections the model generated>
- **Claims Extracted**: <count>
- **Notable Characteristics**: <1–2 sentences on style, depth, or
  approach differences>

## 4. Consensus Core

Claims that ALL models produced. These represent the semantically stable
output of this prompt.

### Claim Cluster CC-<NNN>: <Short Claim Title>

| Field | Value |
|-------|-------|
| **Claim** | <normalized claim text> |
| **Type** | finding · recommendation · observation · caveat · classification |
| **Classification** | Consensus |
| **Models** | All (<list>) |

<If models expressed this claim with notably different emphasis or
framing, note the variation briefly.>

## 5. Majority Claims

Claims that most (but not all) models produced.

### Claim Cluster MC-<NNN>: <Short Claim Title>

| Field | Value |
|-------|-------|
| **Claim** | <normalized claim text> |
| **Type** | finding · recommendation · observation · caveat · classification |
| **Classification** | Majority |
| **Models Present** | <list of models that produced this claim> |
| **Models Absent** | <list of models that did NOT produce this claim> |
| **Likely Cause** | <why absent models omitted this — depth variation, scope interpretation, etc.> |

## 6. Divergent Claims

Claims produced by only one model, or where models contradicted each
other. This is the highest-signal section of the report.

### 6a. Singular Claims

### Claim Cluster SC-<NNN>: <Short Claim Title>

| Field | Value |
|-------|-------|
| **Claim** | <normalized claim text> |
| **Type** | finding · recommendation · observation · caveat · classification |
| **Classification** | Singular |
| **Source Model** | <the one model that produced this claim> |
| **Divergence Cause** | ambiguous-instruction · underspecified-scope · model-capability-gap · hallucination · depth-variation · format-interpretation |
| **Prompt Region** | <exact quote of the prompt language that produced this claim> |
| **Analysis** | <why this model produced the claim and others didn't> |

### 6b. Contradictory Claims

### Claim Cluster XC-<NNN>: <Short Claim Title>

| Field | Value |
|-------|-------|
| **Subject** | <what the contradiction is about> |
| **Classification** | Contradictory |

| Model | Assertion |
|-------|-----------|
| <model-A> | <what model A asserts> |
| <model-B> | <what model B asserts (contradicts A)> |

- **Divergence Cause**: <cause classification>
- **Prompt Region**: <exact quote of the ambiguous prompt language>
- **Analysis**: <why the prompt produces contradictory interpretations>

### 6c. Uncertain / Needs Review

Claim clusters where semantic matching confidence was `uncertain`.
These are excluded from the portability score until a human reviewer
resolves the match and assigns a standard classification.

### Claim Cluster UR-<NNN>: <Short Claim Title>

| Field | Value |
|-------|-------|
| **Claim (Model A)** | <claim text from one model> |
| **Claim (Model B)** | <claim text from another model> |
| **Match Confidence** | uncertain |
| **Reason** | <why the match is uncertain — similar but not clearly equivalent> |
| **Reviewer Action Needed** | Classify as: Consensus match / Majority match / Distinct claims (Singular) / Contradictory |

If no uncertain clusters exist, state "None identified."

## 7. Portability Scorecard

### Per-Claim-Type Breakdown

| Claim Type | Total | Consensus | Majority | Singular | Contradictory | Type Score |
|------------|-------|-----------|----------|----------|----------------|------------|
| finding | | | | | | |
| recommendation | | | | | | |
| classification | | | | | | |
| observation | | | | | | |
| caveat | | | | | | |

### Per-Model Agreement Rate

| Model | Claims Produced | In Consensus | In Majority | Singular | In Contradiction | Agreement Rate |
|-------|-----------------|--------------|-------------|----------|------------------|----------------|
| <model> | | | | | | |

## 8. Hardening Recommendations

Specific prompt rewrites to improve portability. Ordered by impact
(Contradictory fixes first, then Singular with high-weight claim types).

### HR-<NNN>: <Short Description>

- **Target Claim(s)**: <claim cluster IDs affected>
- **Current Prompt Language**:
  > <exact quote from the prompt>
- **Problem**: <why this language produces divergence>
- **Recommended Rewrite**:
  > <concrete replacement text>
- **Expected Effect**: <which models would change behavior and how>
- **Confidence**: High · Medium · Low

## 9. Model Notes

Observations about model-specific behavior that no prompt rewrite can
address. These should be recorded in the template's `model_notes`
frontmatter if the divergence is persistent.

| Model | Observation | Recommended `model_notes` Entry |
|-------|-------------|---------------------------------|
| <model> | <behavior> | <suggested YAML> |

## 10. Model Sufficiency Matrix

*Always include this section. If a reference model is designated,
include the full sufficiency analysis below. If no reference model was
specified, include only: "No reference model designated — sufficiency
analysis not performed."*

**Reference Model**: <model identifier>
**Sufficiency Threshold**: <threshold>%

### Sufficiency Summary

| Model | Tier | Reproduced | Missing | Extra | Contradicted | Sufficiency Rate | Critical Misses | Status |
|-------|------|:----------:|:-------:|:-----:|:------------:|:----------------:|:---------------:|--------|
| <reference> | reference | — | — | — | — | baseline | — | baseline |
| <model> | <tier> | | | | | | | Sufficient · Conditionally Sufficient · Insufficient |

**Minimum Sufficient Model**: <model identifier> — <brief justification>

### Missing Claim Details

For each model with missing claims, list what was missed:

#### <model-identifier>

| Baseline Claim | Type | Impact | Analysis |
|----------------|------|--------|----------|
| <claim text from reference> | finding · recommendation · observation · caveat | Critical miss · Minor miss | <why this model missed it> |

### Extra Claim Details

For each model with extra claims not in the baseline:

#### <model-identifier>

| Extra Claim | Type | Classification | Analysis |
|-------------|------|----------------|----------|
| <claim text> | finding · recommendation · observation · caveat | Valid addition · Hallucination · Noise | <assessment> |

### Cost-Efficiency Recommendation

<1–3 sentences recommending which model to use for this prompt,
balancing sufficiency rate, cost, and speed. If the minimum sufficient
model matches the reference model, state that no cheaper alternative
produced equivalent output and recommend prompt hardening to enable
cheaper models.>
```

## Formatting Rules

1. **Claim IDs** use prefixes: `CC-` (Consensus), `MC-` (Majority),
   `SC-` (Singular), `XC-` (Contradictory), `UR-` (Uncertain / Needs
   Review), followed by a zero-padded three-digit number.
2. **Hardening Recommendation IDs** use `HR-` prefix.
3. **Score precision**: Report the portability score to two decimal
   places.
4. **Ordering**: Within each section, order claims by type priority
   (`finding` > `recommendation` > `classification` > `observation` >
   `caveat`), then by claim cluster number.
5. **Brevity in summaries**: Per-model output summaries should be
   concise (3–5 lines each). The full raw outputs are not included in
   the report — only claim extractions.
6. **Quote fidelity**: Prompt regions cited in divergence analysis
   must be exact quotes, not paraphrases.
