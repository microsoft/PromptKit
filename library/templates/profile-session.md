# Task: Profile Session

Analyze the provided session log and assembled prompt to identify token inefficiencies, redundant reasoning, and structural waste.

## Input Requirements

- **Assembled Prompt**: The full instruction set used for the session.
- **Session Log**: The full transcript of all turns.

## Output Requirements

You MUST provide the analysis in the user-selected format:

### Option 1: Markdown Report

Produce a human-readable analysis using the **investigation-report** format. Ensure the "Findings" section specifically maps inefficiencies to PromptKit component IDs (e.g., `protocols/self-verification`).

### Option 2: JSON Metrics

Produce a structured JSON object for consumption by the **Profiler UI**. The JSON MUST include:

- `token_counts`: Per turn and per component.
- `inefficiencies`: An array of objects with `type`, `severity`, `location`, and `component_id`.
- `optimization_recommendations`: Actionable steps with estimated token savings.
