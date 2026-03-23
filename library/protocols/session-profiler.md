# Protocol: Session Profiling

[cite_start]This protocol defines the systematic method for detecting inefficiencies in an LLM session log.

## Phase 1: Segmentation

[cite_start]Segment the provided log into discrete turns (prompt → response → follow-up).

## Phase 2: Inefficiency Detection

[cite_start]Analyze the turns to identify the following five patterns:

1. [cite_start]**Redundant Reasoning**: Detecting when the LLM re-derives a conclusion it already established in a previous turn.
2. [cite_start]**False Starts / Backtracking**: Identifying when the LLM begins a reasoning path, abandons it, and restarts the process.
3. [cite_start]**Unnecessary Re-derivation**: Information explicitly provided in the prompt is re-derived from scratch instead of being referenced.
4. [cite_start]**Protocol Loops**: A specific protocol phase (e.g., self-verification) is executed multiple times when a single execution should have sufficed.
5. [cite_start]**Unused Context**: Identifying context blocks or instructions in the prompt that the LLM never references or utilizes during the session.

## Phase 3: Component Attribution

[cite_start]Map every detected inefficiency and turn to a specific PromptKit component from the original assembled prompt.
