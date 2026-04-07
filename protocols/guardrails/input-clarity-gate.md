<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: input-clarity-gate
type: guardrail
description: >
  Cross-cutting protocol for validating user-provided input for
  clarity and specificity before proceeding with task execution.
  Applies the pattern catalog from prompt-determinism-analysis to
  natural language input and generates targeted clarifying questions
  instead of findings.
applicable_to: []
---

# Protocol: Input Clarity Gate

This protocol MUST be applied when collecting natural language input
from users — parameter values, problem descriptions, use case
definitions, or free-form context. It prevents vague or ambiguous
input from propagating into generated artifacts.

## When to Apply

Execute this protocol **after** receiving each substantive user input
(parameter values, problem descriptions, requirements narratives) and
**before** using that input to drive generation or analysis. Skip for
trivial inputs (file paths, boolean yes/no, selections from a
provided list).

## Rules

### 1. Pattern Scan

Apply the following pattern categories from the
`prompt-determinism-analysis` protocol to the user's input. For each
match, generate a targeted clarifying question instead of a finding.

**High-priority patterns (always check):**

| Pattern | Example in user input | Clarifying question |
|---------|----------------------|---------------------|
| 1.1 Vague Quantifiers | "Handle many concurrent users" | "How many concurrent users? (e.g., 100, 1,000, 10,000+)" |
| 1.2 Subjective Adjectives | "Good error handling" | "What specific error handling behavior? (catch-and-log, retry with backoff, structured error responses, circuit breaker?)" |
| 1.6 Unanchored Comparatives | "Faster than the current system" | "What is the current system's performance? What target latency or throughput?" |
| 2.1 Missing Branches | "If the user is authenticated, show the dashboard" | "What should happen if the user is NOT authenticated? (redirect to login, show error, show public view?)" |
| 2.2 Missing Bounds | "Limit the file size" | "What is the maximum file size? (e.g., 10 MB, 100 MB, 1 GB)" |

**Medium-priority patterns (check when input is substantive):**

| Pattern | Example in user input | Clarifying question |
|---------|----------------------|---------------------|
| 1.3 Open-Ended Enumerations | "Support formats like PDF, Word, etc." | "Which specific formats must be supported? Is this a closed list or extensible?" |
| 1.4 Hedge Words | "Maybe add caching" | "Is caching a firm requirement or a nice-to-have? Under what conditions?" |
| 1.5 Passive Voice | "Errors should be handled" | "Who or what handles the errors? (the calling function, a global handler, middleware?)" |
| 2.5 Missing Output Spec | "Generate a report" | "What sections should the report include? What format? (Markdown, PDF, table?)" |
| 3.3 Implicit Context | "Follow the usual conventions" | "Which specific conventions? (Can you point to a style guide or reference?)" |

### 2. Threshold for Challenge

Do NOT challenge every imprecise word. Apply these rules:

- **Always challenge** High-priority patterns when they affect core
  requirements (functional behavior, constraints, success criteria).
- **Challenge** Medium-priority patterns when the input is the
  primary problem description or use case definition.
- **Accept without challenge** imprecise language in supplementary
  context, nice-to-have features, or background information that
  does not directly drive generation.
- **Batch challenges**: If multiple patterns are found, ask at most
  3 clarifying questions per input round. Prioritize by impact on
  the generated artifact. Ask remaining questions in subsequent
  rounds if needed.

### 3. Question Format

When challenging user input:

1. **Cite the specific phrase** that triggered the challenge.
2. **Explain briefly** why it matters (what could go wrong if left
   vague).
3. **Offer concrete options** when possible, rather than asking
   open-ended questions.
4. **Accept the user's answer** even if it remains somewhat vague —
   this is a single-pass gate, not an interrogation loop. If the
   user says "I don't know yet" or "keep it flexible," record the
   ambiguity as an `[ASSUMPTION]` or `[OPEN QUESTION]` in the
   generated artifact.

### 4. Interaction Style

- Be helpful, not pedantic. The goal is to improve output quality,
  not to frustrate the user.
- Phrase questions as "To make sure I get this right…" not
  "Your input is vague."
- Group related clarifications into a single question when possible.
- If the user has already provided concrete, specific input, confirm
  it positively and move on without unnecessary probing.
