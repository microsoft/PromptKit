<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: lint-prompt
description: >
  Analyze prompt text, instruction files, or prompt library components
  for language that introduces non-deterministic LLM behavior. Produces
  a determinism assessment report with per-section scoring and concrete
  rewrite suggestions.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - analysis/prompt-determinism-analysis
format: investigation-report
params:
  prompt_content: "The full text of the prompt, instruction file, or prompt component to analyze"
  strictness: "Analysis strictness level: 'strict' (flag all patterns including Low), 'standard' (flag High and Medium, note Low), or 'lenient' (flag only High). Default: standard"
  scope_notes: "Optional — specific sections or aspects to focus on, or known acceptable patterns to suppress"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A determinism assessment report classifying every flagged instruction
    or passage as High, Medium, or Low non-determinism potential, with
    per-section scoring and concrete rewrite suggestions.
---

# Task: Lint Prompt for Determinism

You are tasked with analyzing prompt text for language precision and
determinism. Your goal is to identify language that different LLMs (or
the same LLM across runs) would interpret inconsistently, and provide
concrete rewrite suggestions.

## Inputs

**Prompt Content**:
{{prompt_content}}

**Strictness**: {{strictness}} (if blank, use "standard")

**Scope Notes**: {{scope_notes}} (if blank, analyze the entire text)

## Instructions

### Step 1: Input Validation

1. Confirm the prompt content is non-empty. If the input is empty
   or contains only whitespace, stop and produce a zero-findings
   report with the Coverage section stating "Input was empty; no
   analysis performed.", the Findings section stating
   "None identified.", and the Remediation Plan stating
   "No remediation required."
2. If `scope_notes` specifies sections or suppression patterns,
   record them before beginning analysis.
3. Determine the strictness level. If the provided value does not
   match one of the three levels below, default to "standard" and
   note the fallback in the report:
   - **strict**: Flag and report all High and Medium findings.
     Include Low findings as Informational-severity entries with
     remediation "No rewrite needed."
   - **standard**: Flag and report High and Medium. Count Low
     findings in the scorecard summary but do not produce
     individual finding entries for them.
   - **lenient**: Flag and report only High findings. Summarize
     Medium and Low counts in the scorecard only.

### Step 2: Apply the Prompt Determinism Analysis Protocol

Execute all four phases of the `prompt-determinism-analysis` protocol
against the input text:

1. **Phase 1 (Lexical Pattern Scan)**: Scan for vague quantifiers,
   subjective adjectives, open-ended enumerations, hedge words,
   passive voice without actor, and unanchored comparatives.

2. **Phase 2 (Structural Completeness)**: Check for conditionals
   without exhaustive branches, missing bounds, missing exit criteria,
   unspecified ordering, and missing output specifications.

3. **Phase 3 (Semantic Precision)**: Assess abstract action verbs
   standing alone, undefined domain terms, implicit context
   dependencies, and missing examples.

4. **Phase 4 (Classification & Reporting)**: Score each finding,
   aggregate per-section, and produce the overall assessment.

### Step 3: Produce the Report

Format the output as an investigation report.

**Finding mapping**: Map determinism levels to investigation-report
severity as follows:

| Determinism Level | Report Severity |
|-------------------|-----------------|
| High non-determinism | High |
| Medium non-determinism | Medium |
| Low non-determinism (strict mode only) | Informational |

**Category**: Use the protocol's pattern category as the finding
category (e.g., "Vague Quantifier", "Missing Bounds",
"Abstract Action Verb").

**Evidence**: The "Evidence" field must contain the exact original
text that was flagged.

**Remediation**: The "Remediation" field must contain the concrete
rewrite suggestion from the protocol analysis.

### Step 4: Determinism Scorecard

Embed the **Determinism Scorecard** as a subsection within the
Findings section of the investigation-report format. Place it
after the last individual finding entry. Include:

1. The per-section scorecard table from Phase 4.3.
2. The overall grade (Precise / Acceptable / Imprecise).
3. The top 3–5 highest-impact rewrite recommendations.

## Non-Goals

- Do NOT evaluate whether the prompt produces correct or useful LLM
  output — this is a language precision analysis, not an effectiveness
  review.
- Do NOT flag technical terminology that IS defined elsewhere in the
  prompt — only flag terms that are used without definition.
- Do NOT flag subjective language in example sections or illustrative
  passages — examples are intentionally concrete by nature.
- Do NOT rewrite the prompt — provide rewrite SUGGESTIONS only.
  The user decides which to adopt.
- Language that is intentionally flexible (e.g., "use your best
  judgment" in a creative writing prompt) may be noted only as an
  Informational finding and must be marked as potentially intentional.

## Quality Checklist

Before finalizing, verify:

- [ ] Every phase of the prompt-determinism-analysis protocol was
      executed
- [ ] Every High finding has a concrete rewrite suggestion
- [ ] Every Medium finding has a rewrite suggestion (unless suppressed
      by scope_notes)
- [ ] The per-section scorecard covers all sections of the input
- [ ] The overall grade matches the aggregation rules in Phase 4.3
- [ ] Findings cite exact text from the input (not paraphrased)
- [ ] The strictness level was applied correctly (no over- or
      under-reporting)
- [ ] Findings from suppressed patterns (via scope_notes) are excluded
