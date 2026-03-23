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
   an opinion, not a finding. Classify as BIKESHEDDING.

2. **Is it novel?** Has this exact issue (or a semantically equivalent
   one) been raised in a previous iteration AND already been RESOLVED
   or dismissed? If so, classify as REPEATED. Note: findings that
   were raised previously but remain NOT ADDRESSED are still open —
   they are carried forward, not repeated.

3. **Is it substantive or bikeshedding?** Does the finding affect
   correctness, safety, or specification compliance? Or is it about
   style, naming, or subjective quality? If not substantive, classify
   as BIKESHEDDING.

4. **Classify each finding**:
   - **VALID**: Spec-grounded, novel, and substantive — must be
     addressed
   - **BIKESHEDDING**: Not spec-grounded, not substantive, or both
     — dismiss
   - **REPEATED**: Previously raised AND already resolved or dismissed
     — dismiss

   Note: RESOLVED status is assigned after Phase 2 response evaluation,
   not during Phase 1 classification.

## Phase 2: Response Evaluation

For each VALID finding:

1. **Did the coder address the finding?** This can happen two ways:
   - **Code change**: The coder modified code to fix the issue.
     Verify the change actually addresses the finding.
   - **Spec-grounded rebuttal**: The coder explains, citing the spec,
     that the requirement does not actually mandate the change the
     reviewer requested. If the rebuttal is valid (the spec supports
     the coder's interpretation), reclassify the finding as
     BIKESHEDDING. If the rebuttal is not convincing, the finding
     remains VALID and NOT ADDRESSED.

2. **Does the code change address the finding?** Verify that the
   specific issue is fixed, not just that code was modified. A change
   to an unrelated section does not resolve the finding.

3. **Did the change introduce new issues?** A fix that resolves one
   finding but creates another is net-zero progress.

4. **Classify each response** (how the coder responded):
   - **ADDRESSED**: Code changed and the specific issue is fixed
   - **PARTIALLY ADDRESSED**: Code changed but finding is only
     partially resolved — specify what remains
   - **REBUTTED**: Coder provided a spec-grounded explanation that
     the finding is not a real violation — reclassify the finding
     as BIKESHEDDING if the rebuttal is valid
   - **NOT ADDRESSED**: No code change and no valid rebuttal
   - **REGRESSED**: Code change introduced a new issue

5. **Update finding status** based on response evaluation:
   - Finding becomes **RESOLVED** if response is ADDRESSED or
     validly REBUTTED
   - Finding remains **OPEN** if response is NOT ADDRESSED,
     PARTIALLY ADDRESSED, or REGRESSED
   - **REGRESSED**: Code change introduced a new issue

## Phase 3: Convergence Analysis

Assess whether the workflow is making forward progress.

1. **Count findings by status**:
   - New VALID findings this iteration
   - Findings ADDRESSED this iteration
   - Findings NOT ADDRESSED (carried forward)
   - Findings BIKESHEDDING or REPEATED (dismissed)

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
- All VALID findings are RESOLVED (clean pass)
- Remaining OPEN findings are all strictly below the severity threshold
  (severity ordering: Critical > High > Medium > Low > Informational)
- The workflow is no longer converging (livelock detected)
- The reviewer has no novel findings (only re-raising resolved issues)
- A maximum iteration count has been reached

### For each verdict, provide:
- The verdict (CONTINUE or DONE)
- The reasoning (which conditions triggered the verdict)
- A summary of finding statuses (N valid, N addressed, N dismissed,
  N carried forward)
- If CONTINUE: what the coder should focus on in the next iteration
- If DONE: the final status of all findings and any remaining caveats
