<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: profile-session
description: >
  Analyze a completed LLM session log to identify token inefficiencies
  and structural waste. Maps execution back to PromptKit components
  (persona, protocols, format) and produces actionable optimization
  recommendations. Designed for batch analysis of completed sessions,
  not real-time monitoring.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/session-profiling
format: investigation-report
params:
  session_log: "Full transcript of the LLM session (all turns — prompts, responses, follow-ups)"
  assembled_prompt: "The assembled PromptKit prompt that was used for the session"
  focus_areas: "Optional — specific inefficiency types to prioritize (e.g., redundant reasoning, unused context, protocol loops). Default: all"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A profiling report with per-component token attribution, classified
    inefficiency findings (F-NNN with severity), and optimization
    recommendations tied to specific PromptKit components.
---

# Task: Profile Session

Analyze the provided session log and assembled prompt to produce a
token efficiency profile. Identify where the session spent tokens
inefficiently and which PromptKit components contributed.

## Inputs

**Session log:**

{{session_log}}

**Assembled prompt used for the session:**

{{assembled_prompt}}

**Focus areas:** {{focus_areas}}

## Instructions

1. Execute the session-profiling protocol against the inputs above.
2. For each finding, classify using the investigation-report format:
   - Use finding IDs (F-001, F-002, …) with severity levels
   - Attribute each finding to a specific PromptKit component
     (persona file, protocol file and phase, format rule, or
     template parameter)
   - Include estimated token cost of each inefficiency
3. In the Remediation Plan, provide concrete changes to specific
   PromptKit component files — not abstract advice.
4. In the Executive Summary, report:
   - Total estimated session tokens
   - Estimated wasteful tokens and percentage
   - Top 3 optimization opportunities by token savings

## Non-Goals

- Do NOT evaluate whether the session's *output* was correct or
  high-quality. This is a cost/efficiency analysis, not a quality audit.
- Do NOT suggest changes to the user's input parameters (session_log,
  code_context, etc.) — only to PromptKit components (persona,
  protocols, format, template).
- Do NOT recommend removing guardrail protocols (anti-hallucination,
  self-verification) unless they are demonstrably causing loops.
  Guardrails have a cost but exist for a reason.
