<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-known-conditions-registry
description: >
  Generate a structured registry of known build, test, and tool
  conditions that agents should not re-investigate. Prevents
  repeated wasted effort on solved or pre-existing problems.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: null
params:
  project_context: "Description of the project, its build system, test framework, and common tools"
  existing_conditions: "Any known issues, recurring errors, flaky tests, or tool quirks already documented (paste existing docs or describe from memory)"
  incident_history: "Optional — recent incident logs, error screenshots, or session transcripts showing repeated re-investigation of the same problems"
input_contract: null
output_contract:
  type: known-conditions-registry
  description: >
    A structured markdown document with categorized entries for
    known conditions, each with ID, severity, symptom, frequency,
    root cause, prescribed action, and status.
---

# Task: Author Known Conditions Registry

You are tasked with creating a structured registry of known conditions
for a project. This registry prevents AI agents from wasting time
re-investigating solved or pre-existing problems by providing a
lookup table of known symptoms and prescribed actions.

## Inputs

**Project Context**:
{{project_context}}

**Existing Known Conditions**:
{{existing_conditions}}

**Incident History**:
{{incident_history}}

## Instructions

### Step 1: Extract Conditions

1. Review the provided existing conditions and incident history.
2. For each distinct condition, extract:
   - The observable symptom (exact error message, behavior, or output)
   - How frequently it occurs (Always / Common / Occasional / Rare)
   - The root cause (if known) or "UNDER INVESTIGATION"
   - What to do when encountered
   - What NOT to do (common mistakes agents make with this condition)
3. If incident history shows repeated investigation of the same
   problem across sessions, flag it as a high-priority registry entry.

### Step 2: Categorize and Assign IDs

Assign each condition a unique ID using this scheme:

| Category | Prefix | Example |
|----------|--------|---------|
| Build errors | BLD | BLD-001 |
| Test failures | TST | TST-001 |
| Tool errors | TEF | TEF-001 |
| Environment issues | ENV | ENV-001 |
| Known warnings | WRN | WRN-001 |

Assign severity to each condition:

| Severity | Meaning |
|----------|---------|
| CRITICAL | Silent corruption or data loss — requires immediate action |
| HIGH | Blocks progress — has a known workaround |
| MEDIUM | Causes confusion — wastes investigation time |
| LOW | Cosmetic or informational — can be safely ignored |

### Step 3: Write Registry Entries

For each condition, produce an entry in this exact format:

```markdown
### <ID>: <short title> — <STATUS>

**Severity**: <CRITICAL / HIGH / MEDIUM / LOW>
**Symptom**: <exact error message, behavior, or observable output>
**Frequency**: <Always / Common / Occasional / Rare>
**Root Cause**: <explanation, or UNDER INVESTIGATION>
**Action**: <what to do when encountered>
**Do NOT**: <common mistakes to avoid>
```

Status values:
- `PRE-EXISTING, IGNORE` — known issue, will not be fixed, safe to
  ignore
- `RECURRING` — appears intermittently, workaround documented
- `PERMANENT` — intentional behavior, not a bug
- `UNDER INVESTIGATION` — root cause unknown, workaround may exist
- `PROVEN` — verified root cause and fix exist

### Step 4: Add Aggregate Summary

After all entries, produce a summary table:

```markdown
## Condition Summary

| ID | Category | Severity | Frequency | Status |
|----|----------|----------|-----------|--------|
```

### Step 5: Add Usage Instructions

Add a section explaining how agents should use the registry:

1. Before investigating any build error, test failure, or tool
   error, search this registry by error message or symptom.
2. If a match is found, follow the prescribed Action and skip
   investigation.
3. If the condition is marked UNDER INVESTIGATION, document any
   new information discovered and append it to the entry.
4. If a new condition is encountered that is not in the registry,
   add a new entry following the format above.

## Non-Goals

- Do NOT invent conditions that were not described in the inputs.
  Every entry must trace to a specific symptom from the provided
  context.
- Do NOT speculate about root causes. If the cause is unknown,
  use "UNDER INVESTIGATION."
- Do NOT include conditions that have been fully resolved and will
  not recur. The registry is for active or recurring conditions only.

## Quality Checklist

Before finalizing, verify:

- [ ] Every entry has all required fields (Severity, Symptom,
      Frequency, Root Cause, Action, Do NOT)
- [ ] Every entry has a unique ID following the prefix scheme
- [ ] Severity assignments are consistent (CRITICAL only for
      silent corruption or data loss)
- [ ] Symptoms contain exact error messages or observable behaviors
      (not paraphrased descriptions)
- [ ] "Do NOT" fields describe specific mistakes, not generic
      advice
- [ ] The aggregate summary table includes all entries
- [ ] Usage instructions are present
- [ ] No conditions were fabricated — all trace to provided inputs
