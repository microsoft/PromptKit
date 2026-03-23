<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: workflow-arbitration
type: reasoning
description: >
  Protocol for evaluating progress in a multi-agent coding workflow.
  Determines whether reviewer findings are valid, coder responses
  are adequate, and whether the workflow should continue or terminate.
  Detects livelock, bikeshedding, and convergence failure.
applicable_to:
  - author-workflow-prompts
---

# Protocol: Workflow Arbitration

Apply this protocol when evaluating a round of a multi-agent coding
workflow. You receive the current code, the reviewer's findings, and
the coder's responses. Your job is to determine whether the workflow
should continue or terminate.

## Phase 1: Finding Validation

For each finding raised by the reviewer:

1. **Is it spec-grounded?** Does the finding cite a specific
   requirement (REQ-ID) or acceptance criterion? If not, it is
   an opinion, not a finding. Classify as DISMISSED (not spec-grounded).

2. **Is it novel?** Has this exact issue (or a semantically equivalent
   one) been raised in a previous iteration? If so, classify as
   REPEATED. The reviewer must raise new issues or the workflow
   terminates.

3. **Is it substantive?** Does the finding affect correctness, safety,
   or specification compliance? Or is it about style, naming, or
   subjective quality? Classify as SUBSTANTIVE or BIKESHEDDING.

4. **Classify each finding**:
   - **VALID**: Spec-grounded, novel, substantive — must be addressed
   - **BIKESHEDDING**: Not spec-grounded or not substantive — dismiss
   - **REPEATED**: Same issue as a previous iteration — dismiss
   - **RESOLVED**: Was valid but coder's response adequately addressed
     it

## Phase 2: Response Evaluation

For each VALID finding:

1. **Did the coder change the code?** A response that argues without
   changing code is not a resolution — it is a defense. The finding
   remains open.

2. **Does the code change address the finding?** Verify that the
   specific issue is fixed, not just that code was modified. A change
   to an unrelated section does not resolve the finding.

3. **Did the change introduce new issues?** A fix that resolves one
   finding but creates another is net-zero progress.

4. **Classify each response**:
   - **ADDRESSED**: Code changed and finding is resolved
   - **PARTIALLY ADDRESSED**: Code changed but finding is only
     partially resolved — specify what remains
   - **NOT ADDRESSED**: No code change, or change doesn't fix the issue
   - **REGRESSED**: Code change introduced a new issue

## Phase 3: Convergence Analysis

Assess whether the workflow is making forward progress.

1. **Count findings by status**:
   - New VALID findings this iteration
   - Findings ADDRESSED this iteration
   - Findings NOT ADDRESSED (carried forward)
   - Findings DISMISSED (bikeshedding + repeated)

2. **Calculate progress**:
   - Is the count of open findings decreasing each iteration?
   - Is the ratio of ADDRESSED to new VALID findings > 1?
   - Is the reviewer producing novel findings or recycling old ones?

3. **Detect livelock patterns**:
   - **Critique/defense loop**: Reviewer raises issue, coder defends
     without changing code, reviewer re-raises — no progress
   - **Semantic oscillation**: Coder changes code back and forth
     between two approaches across iterations
   - **Issue inflation**: Reviewer raises more issues each iteration
     without previous issues being resolved
   - **Premature convergence**: All findings dismissed as bikeshedding
     when some may be substantive

## Phase 4: Verdict

Issue a definitive verdict:

### CONTINUE — if:
- There are VALID findings that are NOT ADDRESSED
- The workflow is converging (open finding count is decreasing)
- The reviewer is producing novel findings
- Progress is being made (issues are being resolved)

### DONE — if any of:
- All VALID findings are ADDRESSED (clean pass)
- Remaining findings are all below a severity threshold (e.g., all
  Low/Informational)
- The workflow is no longer converging (livelock detected)
- The reviewer has no novel findings (recycling)
- A maximum iteration count has been reached

### For each verdict, provide:
- The verdict (CONTINUE or DONE)
- The reasoning (which conditions triggered the verdict)
- A summary of finding statuses (N valid, N addressed, N dismissed,
  N carried forward)
- If CONTINUE: what the coder should focus on in the next iteration
- If DONE: the final status of all findings and any remaining caveats
