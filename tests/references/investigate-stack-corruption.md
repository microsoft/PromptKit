<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) Standard Prompt Library Contributors -->

You are a code-analysis agent with access to the target codebase and standard engineering tools available in this environment.

GOAL (what we are trying to prove or disprove)
We are investigating a class of kernel bugchecks (IRQL_NOT_LESS_OR_EQUAL) that appear to be stack corruption while the networking stack is processing I/O. A leading hypothesis is that a 3rd-party filter driver callout (or a convoluted async “pend→complete” path) is writing through a pointer it should not, or we are accidentally passing stack-backed pointers/structures across a driver boundary.
Your job is to produce a *reviewable, evidence-based* audit of networking-stack → filter-framework boundary call sites and identify any places where stack-backed memory could escape its lifetime (especially across async flows).

SUCCESS CRITERIA (definition of done)
Deliver the following artifacts in the repo working directory:
1) boundary_callsites.jsonl
   - One JSON object per boundary call site.
   - Must include: file path, function name, line number, callee name, argument expressions (as text), and a short “why this is a boundary” note.
2) suspects.md
   - A ranked list (highest risk first) of suspected stack-lifetime hazards.
   - Each entry MUST include:
     a) Exact code excerpt (enough lines for context)
     b) File path + line numbers
     c) Hazard label (choose from the taxonomy below)
     d) Reasoning that references only what is visible in the code excerpt (no speculation).
3) coverage.md
   - What you scanned, what you intentionally did not scan, and the exact queries/commands/scripts used so a human can reproduce your results.

CONSTRAINTS / GUARDRAILS
- Do NOT ingest the entire source tree blindly. Use targeted search first, then narrow to relevant directories/files. (If your tooling tries to slurp the whole tree, stop and re-scope.)
- Prefer deterministic analysis: write a script/tooling workflow (or a repeatable set of commands) that enumerates call sites and emits structured results, then summarize from that output.
- Every claim in suspects.md must be backed by a cited code excerpt. If you cannot cite code, label it “needs human follow-up” rather than guessing.

CONTEXT: WHAT COUNTS AS "FILTER FRAMEWORK BOUNDARY"
Treat as boundary interactions any networking stack code paths that:
- Call into filter framework callout/classification APIs (e.g., classify/callout invocation plumbing) OR
- Pass packet/stream/flow metadata or layer data toward filter callout evaluation, OR
- Participate in asynchronous classify patterns (pend/complete style flows).
Reminder: In the filter framework, callouts are invoked during classification and receive pointers such as layerData and metadata/value structures; async processing exists and is a known complexity point.

OUTPUT TAXONOMY (hazard labels you must use)
Use one of these labels per suspect finding:

H1_STACK_ADDRESS_ESCAPE
  Evidence that an address-of local variable (or pointer into a local stack buffer) is passed across the boundary.

H2_STACK_BACKED_FIELD_IN_ESCAPING_STRUCT
  A struct passed across the boundary contains a field assigned from stack storage (directly or indirectly).

H3_ASYNC_PEND_COMPLETE_USES_CALLER_OWNED_POINTER
  Evidence that a pointer (or struct containing pointers) can survive beyond the current frame due to async pend→complete, queuing, or callback completion.
  (Example patterns: storing a pointer in a context object, global, list, work item, or completion record without proving it is heap/nonpaged and lifetime-safe.)

H4_WRITABLE_VIEW_OF_LOGICALLY_READONLY_INPUT
  The call site passes a writable pointer to data that is logically input-only, and later code assumes it has not been modified (risk: callout scribble).
  (Do NOT assume callouts behave; only flag when the code implies “we assume no writes”.)

H5_UNCLEAR_LIFETIME_NEEDS_HUMAN
  There are pointers crossing the boundary but the lifetime/ownership cannot be proven from local code. Provide the evidence and what additional code would be needed.

PLAN (how to proceed)
Step 0 — Establish scope & entry points
- Identify the minimal set of directories/files where the networking stack interacts with the filter framework (start with obvious naming conventions: networking, filter, callout, classify, flow, inject, metadata, layerData).
- Produce an initial list of candidate files and include it in coverage.md.

Step 1 — Enumerate boundary call sites deterministically
- Create a repeatable method (script or command sequence) to find and list every boundary call site in scope.
- Emit boundary_callsites.jsonl with one line per call site.
- If you cannot get file+line reliably, include a stable anchor (function name + unique snippet) and explain the limitation in coverage.md.

Step 2 — Classify hazards
For each call site, inspect the arguments and surrounding code (local variable declarations, address-of operators, stack arrays, on-stack structs, context objects, queues).
Flag hazards using the taxonomy:
- If you see “&local” or pointer into a local buffer crossing the boundary, that is H1.
- If a passed struct has fields set from locals (or points into locals), that is H2.
- If the code suggests async completion, queuing, or later callbacks using data from the call site, that is H3 unless the code proves heap/nonpaged ownership and lifetime.
- If the boundary receives pointers that are writable and later logic assumes immutability, flag H4 with code evidence.
- If you suspect a hazard but cannot prove lifetime from visible code, use H5 and list the exact additional functions/files that must be inspected next.

Step 3 — Rank suspects
Rank by “likelihood of stack corruption impact”:
- Highest: H1 and H3 with clear evidence and minimal ambiguity.
- Next: H2 with clear field assignment from stack.
- Then: H4 when assumptions about immutability are implied.
- Lowest: H5 (unclear lifetime).

Step 4 — Write suspects.md as a human-auditable report
Each suspect entry must include:
- Hazard label
- Code excerpt (include enough lines to show the variable definition + the boundary call + any storage/queueing)
- File path + line numbers
- A short reasoning paragraph: “Because X is stack-allocated here, and Y crosses boundary here, this is a lifetime escape risk.”
Do not propose fixes unless the report is complete; the primary objective is accurate identification.

QUALITY BAR / SELF-CHECK
Before finalizing:
- Randomly sample at least 5 boundary call sites from boundary_callsites.jsonl and verify the file/line/callee/args match the source code.
- Ensure suspects.md contains ZERO claims without code excerpts.
- Ensure you did not analyze the whole tree; coverage.md must show your narrowing strategy.

OPTIONAL: PARALLELIZE (only if supported by your environment)
If you have a “sub-agent” or “fleet” capability, split work into:
A) Boundary enumeration
B) Async pend/complete patterns
C) Pointer lifetime/stack-escape scanning
Then merge into the three output artifacts.
(If your CLI supports commands like /fleet or /delegate, you may use them; otherwise ignore this section.)

If no H1–H4 hazards are found, suspects.md must explicitly state this and explain why.

DELIVERABLES
When done, output:
- A short summary (5–10 bullets) of what you found, with pointers to suspects.md sections.
- The three files: boundary_callsites.jsonl, suspects.md, coverage.md

NON-GOALS
- Do not reason about correctness of filter callouts themselves.
- Do not audit heap lifetime correctness beyond stack escape risk.
- Do not attempt to prove absence of bugs outside networking-stack → filter-framework boundaries.
 