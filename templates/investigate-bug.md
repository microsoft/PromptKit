<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: investigate-bug
description: >
  Systematically investigate a bug or defect from a natural language
  problem description. Apply root cause analysis and produce an
  investigation report.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - reasoning/root-cause-analysis
taxonomies:
  - stack-lifetime-hazards
format: investigation-report
params:
  problem_description: "Natural language description of the bug or failure"
  code_context: "Relevant code, logs, stack traces, or configuration"
  environment: "OS, language version, runtime, build configuration"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A structured investigation report with findings, root cause analysis,
    evidence, and remediation plan.
---

# Task: Investigate Bug

You are tasked with investigating the following defect or unexpected behavior
and producing a structured investigation report.

## Inputs

**Problem Description**:
{{problem_description}}

**Code / Logs / Context**:
{{code_context}}

**Environment**:
{{environment}}

## Instructions

1. **Apply the root-cause-analysis protocol** systematically:
   - Characterize the symptom precisely
   - Generate multiple hypotheses (at least 3) before investigating any
   - Evaluate evidence for each hypothesis
   - Identify the root cause, not just the proximate trigger

2. **Apply the anti-hallucination protocol** throughout:
   - Base analysis ONLY on the provided code and context
   - If you cannot determine the root cause from the provided information,
     say so and describe exactly what additional information is needed
   - Do NOT fabricate code paths, function behaviors, or runtime conditions
     that are not evidenced in the provided context
   - Label inferences explicitly: "Based on line 42, I infer that..."

3. **Format the output** according to the investigation-report format specification.

4. **When analyzing code**:
   - Trace the execution path from entry point to the failure site
   - Identify every assumption the code makes about its inputs and state
   - Check error handling paths — are errors caught, propagated, or silently ignored?
   - Consider concurrency: could this be a timing-dependent issue?
   - Consider state: could this be caused by unexpected state from a previous operation?

5. **Apply the self-verification protocol** before finalizing:
   - Sample at least 3–5 specific findings and re-verify against the source
   - Ensure every claim cites a specific code location or is labeled [ASSUMPTION]
   - Confirm coverage: state what was examined and what was not

6. **Apply the operational-constraints protocol** when working with code:
   - Scope your search before reading — identify relevant directories/files first
   - Prefer deterministic methods (targeted search, structured enumeration)
   - Document your search strategy for reproducibility

7. **Remediation must be specific**:
   - Provide concrete code-level fix recommendations, not vague advice
   - Assess the risk of each proposed fix
   - Identify tests that would have caught this bug
   - Suggest defensive measures to prevent recurrence

## Non-Goals

Explicitly define what is OUT OF SCOPE for this investigation.
State each non-goal clearly so the investigation does not expand
beyond its intended boundaries. Examples:

- Do NOT investigate unrelated subsystems unless evidence points there.
- Do NOT attempt to prove absence of bugs outside the stated scope.
- Do NOT refactor or redesign — focus on identifying the defect.

Adjust these non-goals based on the specific investigation context
provided in {{problem_description}}.

## Investigation Plan

Before beginning analysis, produce a concrete step-by-step plan
tailored to this specific investigation. The plan should:

1. **Establish scope**: What files, components, or code paths are relevant?
2. **Enumerate**: Systematically list the items to analyze (call sites,
   data flows, interfaces) — prefer structured output.
3. **Classify**: Apply the relevant protocols and taxonomies to each item.
4. **Rank**: Order findings by severity and confidence.
5. **Report**: Produce the output according to the specified format.

This plan replaces ad-hoc exploration with systematic analysis.

## Quality Checklist

Before finalizing, verify:

- [ ] Every finding cites specific code evidence (file, line, function)
- [ ] Every finding has a severity rating with justification
- [ ] Root cause is identified, not just the proximate trigger
- [ ] Remediation recommendations are specific and actionable
- [ ] At least 3 findings have been re-verified against the source
- [ ] Coverage statement documents what was and was not examined
- [ ] No fabricated code paths or behaviors — unknowns marked with [UNKNOWN]
