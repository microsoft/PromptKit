<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: session-profiling
type: reasoning
description: >
  Systematic analysis of LLM session logs to detect token inefficiencies,
  redundant reasoning, and structural waste. Maps execution back to
  PromptKit components and produces actionable optimization recommendations.
applicable_to:
  - profile-session
---

# Protocol: Session Profiling

Apply this protocol when analyzing a completed LLM session to understand
where tokens were spent, which PromptKit components contributed to
inefficiency, and what concrete changes would reduce waste. The goal is
observability — turning an opaque session transcript into an attributed
breakdown of cost drivers and efficiency tradeoffs.

## Phase 1: Segment the Session Log

Break the raw session log into discrete, analyzable units.

1. Identify each **turn boundary** — where a prompt ends and a response
   begins, and where a response ends and a follow-up begins.
2. For each turn, record:
   - Turn number (sequential)
   - Direction: prompt -> response, or follow-up -> response
   - Approximate token count (estimate from character count ÷ 4 for
     English text; note code and structured data may differ)
   - Whether the turn is a retry, correction, or continuation of a
     previous turn
3. Identify **multi-turn patterns**: Does the session show a single
   prompt -> response, or iterative refinement with multiple rounds?
4. Flag any turns that appear to be **error recovery** — the LLM
   produced something incorrect and was redirected.

**Output**: A numbered turn inventory with token estimates and
classification (initial, continuation, retry, correction).

## Phase 2: Map Turns to PromptKit Components

Using the assembled prompt as a reference, attribute each segment of
LLM output to the PromptKit component that drove it.

1. **Persona attribution**: Identify where the LLM's behavior reflects
   persona instructions — tone, domain framing, epistemic labeling.
   Note where persona instructions are followed vs. ignored.
2. **Protocol phase attribution**: For each reasoning protocol declared
   in the assembled prompt, identify which turns or turn segments
   execute which protocol phase. Record:
   - Protocol name and phase number
   - Turn(s) where this phase executes
   - Estimated tokens consumed by this phase
3. **Format compliance**: Identify where the LLM is structuring output
   to match the declared format (section headings, finding IDs, severity
   labels). Note format overhead — tokens spent on structure vs. content.
4. **Context utilization**: For each context block provided in the prompt
   (code, logs, documents), track whether and where the LLM references it.
   A context block that is never referenced is a candidate for pruning.

**Output**: A component attribution map — each turn segment linked to
the persona, protocol phase, or format rule that produced it.

## Phase 3: Detect Inefficiencies

Analyze the attributed session for structural waste. For each
inefficiency found, record the type, location (turn number and
approximate position), estimated token cost, and the PromptKit
component responsible.

Inefficiency types to detect:

- **Redundant reasoning** (RE-REDUNDANT): The LLM re-derives a
  conclusion it already reached in an earlier turn or earlier in the
  same turn. Common when protocol phases overlap or when the persona
  instructs broad analysis that a later protocol phase also covers.

- **False starts and backtracking** (RE-BACKTRACK): The LLM begins a
  line of analysis, abandons it (sometimes mid-paragraph), and restarts
  with a different approach. Indicates unclear or contradictory
  instructions in the prompt.

- **Unnecessary re-derivation** (RE-REDERIVE): Information explicitly
  provided in the prompt context is derived from scratch instead of
  referenced. The LLM explains something the user already provided.
  Common when context blocks are large and the LLM loses track.

- **Protocol loops** (RE-LOOP): A protocol phase executes more than
  once — typically because the self-verification guardrail triggered a
  redo, or because the protocol's phase boundaries are ambiguous.

- **Unused context** (RE-UNUSED): A context block (code, logs,
  documents) provided in the prompt is never referenced in any response.
  Either the context was unnecessary for this task, or the prompt failed
  to direct the LLM to use it.

- **Verbose compliance** (RE-VERBOSE): The LLM spends significant tokens
  restating prompt instructions, disclaiming scope, or producing
  boilerplate structure that adds no analytical value. Common with
  overly detailed format specifications.

- **Persona drift** (RE-DRIFT): The LLM's behavior shifts away from
  the declared persona partway through the session — changing tone,
  abandoning epistemic labeling, or switching domain framing. Indicates
  the persona definition may be too weak to persist across long sessions.

## Phase 4: Quantify Impact

For each inefficiency detected in Phase 3:

1. Estimate the **token cost** — how many tokens were wasted on this
   specific inefficiency.
2. Estimate the **percentage of total session tokens** this represents.
3. Assess **efficiency-related impact** - beyond raw token count, did 
   this inefficiency cause extra interaction steps (e.g., additional 
   self-verification cycles, repeated clarifications, or re-running 
   protocol phases) that increased latency or operational cost? Do not 
   judge whether the final task output was correct.
4. Rank inefficiencies by token cost (descending) to identify the
   highest-impact optimization targets.

## Phase 5: Produce Optimization Recommendations

For each inefficiency (or cluster of related inefficiencies), produce a
concrete, actionable recommendation tied to a specific PromptKit component.

Recommendations must follow this pattern:

- **Component**: Which PromptKit file to change (persona, protocol,
  format, or template)
- **Change**: What specifically to modify (e.g., "merge Phase 2 and
  Phase 4 of the root-cause-analysis protocol", "compress persona
  behavioral constraints from 12 to 5 rules", "remove the code context
  parameter — it was unused in all 3 sessions analyzed")
- **Expected savings**: Estimated token reduction
- **Risk**: What might degrade if this change is made (e.g., "removing
  the self-verification phase saves ~500 tokens per session but may
  increase false positive rate")

Order recommendations by expected savings (descending). Distinguish
between:

- **Safe optimizations**: Changes that reduce tokens with no quality risk
- **Tradeoff optimizations**: Changes that reduce tokens but may affect
  output quality — flag these clearly
