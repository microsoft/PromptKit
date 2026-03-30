<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: step-retrospective
type: reasoning
description: >
  Protocol for learning from execution experience in iterative workflows.
  After completing a step (merge, fix cycle, deployment, investigation),
  systematically analyze what happened, classify variances, trace root
  causes, and feed concrete improvements back into the tooling, agent,
  and process for the next iteration.
applicable_to:
  - plan-implementation
  - find-and-fix-bugs
  - author-pipeline
  - fix-compiler-warnings
---

# Protocol: Step Retrospective

Apply this protocol after completing a discrete step in an iterative
workflow. The goal is to convert execution experience into concrete
improvements that make the next step better — not just to document
what happened, but to change the tools and process.

## When to Apply

Execute this protocol:

- After each step in a multi-step plan (e.g., merge step, migration phase)
- After a fix→rebuild→retest cycle that took more than one iteration
- After any step where the actual experience diverged from expectations
- Before proceeding to the next step in an iterative workflow

## Phase 1: Outcome Assessment

Compare actual results against expectations. Be quantitative.

1. **State the step's goal** and whether it was achieved.
2. **Record metrics**:
   - Time: estimated vs actual duration
   - Errors: count and categories (compile errors, test failures,
     verification failures, infrastructure issues)
   - Quality: items that passed first try vs items requiring rework
   - Coverage: what was validated vs what was skipped
3. **Identify surprises** — anything that happened that was not
   anticipated by the plan. Both positive (easier than expected)
   and negative (unexpected failure modes).

Do NOT interpret yet — just record the facts.

## Phase 2: Variance Analysis

For each significant deviation from expectations (each surprise,
each failure, each rework cycle), classify the root category:

| Category | Description | Examples |
|----------|-------------|---------|
| **Tooling gap** | A script, check, validation, or automation failed to catch something it should have | Linter didn't flag an unsafe pattern; size assertion passed but field layout was wrong; test suite didn't cover the error path; CI ran incremental build instead of clean |
| **Process gap** | A step was missing, in the wrong order, or insufficiently defined | Deployed before running integration tests; updated the interface but not the callers; skipped manual review on a high-risk file; no checkpoint before destructive operation |
| **Knowledge gap** | The agent or operator lacked critical information that was available but not surfaced | API has an undocumented side effect; two config files must be updated in sync; the verifier requires declarations visible even under compile guards; upstream renamed a field but the migration guide wasn't consulted |
| **External factor** | Infrastructure, dependency, or environmental issue outside the workflow's control | CI runner ran out of disk; package registry returned stale version; network timeout during artifact download; VM image updated between runs |

Rules:
- Assign exactly one primary category per variance.
- If a variance spans categories, pick the one where a fix would
  have the highest impact.
- A variance with no clear category is a **knowledge gap** by
  default — you didn't know enough to prevent it.

## Phase 3: Root Cause Identification

For each variance classified as **tooling gap**, **process gap**,
or **knowledge gap** (skip external factors — they can't be fixed
by process changes):

1. **Apply the 5-whys pattern**:
   - Why did this happen? (proximate cause)
   - Why did that happen? (contributing cause)
   - Continue until you reach a cause that is within your control
     to fix (the actionable root cause)

2. **Distinguish proximate from root**:
   - Proximate: "the test failed because the struct layout was wrong"
   - Root: "the struct audit only checked `sizeof`, not field offsets,
     so layout mismatches were invisible"

3. **Check for systemic patterns**:
   - Has this same category of variance occurred in previous steps?
   - If yes, the root cause may be deeper than the immediate fix.

## Phase 4: Feedback Action Planning

For each root cause, define a concrete improvement:

| Field | Description |
|-------|-------------|
| **Finding** | One-sentence description of what went wrong |
| **Root cause** | The actionable root cause (from Phase 3) |
| **Action** | Specific change to make (not vague — name the file, function, check) |
| **Target** | Exact file path or tool that will be modified |
| **Expected improvement** | What this prevents in future iterations |
| **Priority** | One of: `block` (must fix before next step), `improve` (should fix, improves next step), `defer` (fix after workflow completes) |

Rules:
- Every action MUST name a specific target (file, script, document,
  agent definition). "Improve the process" is not an action.
- **`block` priority** means the next step will likely hit the same
  issue if this isn't fixed first.
- **`improve` priority** means the next step can proceed but will
  be slower or riskier without the fix.
- **`defer` priority** means this is a lesson for the overall
  process documentation, not an immediate fix.
- Limit to 5 actions maximum per step. If there are more, prioritize
  the highest-impact ones and note the rest as deferred.

## Phase 5: Apply and Verify

Execute the `block` and `improve` actions:

1. **Apply each action** — make the specific change to the target file.
2. **Verify the change works** — run the relevant build, test, or
   validation to confirm the improvement doesn't break anything.
3. **Commit the improvement** — with a message referencing the
   retrospective finding (e.g., "fix(build): add offsetof assertions —
   caught by step N retrospective").
4. **Record deferred actions** in the audit log or plan document
   for later execution.

After applying improvements, explicitly state:
- "The following improvements were applied: [list]"
- "The following actions are deferred: [list with rationale]"
- "The next step will benefit from: [describe expected improvement]"

## Anti-Patterns

Reject these common failure modes:

- **Vague findings**: "The build was slow" → must quantify and
  identify the specific bottleneck.
- **Vague actions**: "Improve the struct audit" → must name the
  specific check to add and where.
- **Blame attribution**: The retrospective analyzes the *process*,
  not the *person*. "The agent made a mistake" → "The agent lacked
  a check for X, which should be added to Y."
- **Skipping apply**: Recording findings without applying fixes is
  documentation theater. At least the `block` actions must be
  applied before the next step.
- **Over-fixing**: Don't restructure the entire process after one
  step. Focus on the 1-3 highest-impact improvements.
