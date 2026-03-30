<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

# Case Study: Spec Extraction for the eBPF Epoch Module

## Context

**Project**: [eBPF for Windows](https://github.com/microsoft/ebpf-for-windows)
**Module**: `ebpf_epoch` — epoch-based memory reclamation (EBR)
**Date**: 2026-03-30
**Duration**: ~45 minutes wall-clock (human interaction), ~7 minutes agent compute
**Tool**: GitHub Copilot CLI (Claude Opus 4.6, 1M context)

The `ebpf_epoch` module is a kernel-level subsystem that provides safe, deferred
memory reclamation for concurrent data structures in the eBPF for Windows runtime.
It implements a per-CPU architecture with inter-CPU DPC messaging, epoch-stamped
free lists, and a three-phase computation protocol — the kind of intricate systems
code that typically resists documentation efforts because the complexity lives
entirely in the implementation.

The module had **zero formal specifications**. The only documentation was code
comments and a brief design overview in `docs/EpochBasedMemoryManagement.md`.

## Objective

Bootstrap a **semantic baseline** — structured requirements, design, and validation
specifications — extracted entirely from the existing codebase and test suite,
following the project's `spec-extraction-workflow.md`.

## Input Files

| File | Lines | Role |
|------|-------|------|
| `libs/runtime/ebpf_epoch.h` | 141 | Public API (13 functions, 2 types) |
| `libs/runtime/ebpf_epoch.c` | 1,062 | Implementation |
| `libs/runtime/unit/platform_unit_test.cpp` | ~1,150 (epoch portion) | 6 test cases |

**Total input**: ~2,350 lines of C/C++ code.

## Process

### Phase 1 — Repository Scan (~3 minutes)

The agent read all three source files in full and produced a structured analysis
summary:

- Identified the 13-function public API surface
- Cataloged the per-CPU architecture, inter-CPU messaging protocol, and free-list
  release algorithm
- Mapped all 6 existing test cases with their concurrency requirements (CPU count
  thresholds, thread affinity patterns, stress test durations)
- Proposed the specification scope

**Human interaction**: User confirmed the scope with a single "yes."

### Phase 2 — Draft Extraction (~7 minutes)

Three background agents were launched **in parallel**, each producing one
specification document:

| Agent | Output | Size | Time |
|-------|--------|------|------|
| draft-requirements | `specs/epoch/requirements.md` | 32 KB | 7m 27s |
| draft-design | `specs/epoch/design.md` | 32 KB | 6m 55s |
| draft-validation | `specs/epoch/validation.md` | 34 KB | 6m 29s |

Each agent received a comprehensive prompt containing:
- The full API surface extracted from Phase 1
- Key behavioral details from the implementation
- A document format template with section skeletons
- Anti-hallucination rules (cite sources, mark confidence, no invented behaviors)

The parallel execution cut wall-clock time from ~21 minutes (sequential) to ~7.5
minutes.

### Phase 3 — Human Clarification (~1 minute)

The agent presented 5 targeted questions about ambiguous items:
1. Is the 1ms timer delay a requirement or implementation detail?
2. Is CPU 0 as coordinator essential or incidental?
3. Are work item callbacks contractually at PASSIVE_LEVEL?
4. Is the cross-CPU DISPATCH fail-fast a formal requirement?
5. Is stack-allocated synchronization a requirement or optimization?

**Human interaction**: User said "proceed to audit" — accepting the drafts as-is
and deferring the clarifications to future review.

### Phase 4 — Consistency Audit (~5 minutes)

The agent performed an adversarial traceability audit by:
1. Reading all three documents in full (~2,000 lines)
2. Extracting every REQ-ID from requirements.md (57 total)
3. Cross-referencing against design.md and validation.md
4. Checking for orphaned IDs, phantom references, and coverage gaps

**7 findings** were identified:

| ID | Severity | Issue |
|----|----------|-------|
| F-001 | Medium | Design doc invented parallel REQ-IDs instead of using canonical ones |
| F-002 | Medium | Validation plan referenced phantom REQ-IDs |
| F-003 | Medium | 21/57 requirements had no explicit test traceability |
| F-004 | Low | Validation defined REQ-DIAG-002 not in requirements |
| F-005 | Low | Date inconsistency across documents |
| F-006 | Low | "Released epoch" phrasing varied |
| F-007 | Low | Design referenced out-of-scope files |

The agent immediately applied fixes for F-001 (replaced design §2 with canonical
REQ-ID references) and F-005 (normalized dates).

**Root cause**: The three documents were drafted by independent agents without a
shared REQ-ID registry. This is a known limitation of parallel extraction.

**Verdict**: REVISE (with critical corrections already applied).

### Phase 5 — Human Approval (~instant)

User said "looks good to me."

### Phase 6 — Deliverable (~2 minutes)

The agent:
1. Created branch `alanjo/specs-epoch-baseline`
2. Committed 4 spec files + 4 workflow files with sign-off and detailed commit message
3. Pushed and created draft PR #5150

## Output

### Deliverables

| File | Content |
|------|---------|
| `specs/epoch/requirements.md` | 57 requirements, 5 dependencies, 5 assumptions, 4 risks |
| `specs/epoch/design.md` | Architecture diagram, 10 design subsections, 7 tradeoff analyses, 5 open questions |
| `specs/epoch/validation.md` | 17 test cases (6 existing + 11 proposed), 10 coverage gaps, risk prioritization |
| `specs/epoch/audit.md` | 7 findings, root cause analysis, remediation plan |

### Quantitative Summary

| Metric | Value |
|--------|-------|
| Input (source code) | 2,350 lines |
| Output (specifications) | 2,265 lines |
| Requirements extracted | 57 |
| Acceptance criteria | 57+ (at least 1 per requirement) |
| Design sections | 10 detailed + 7 tradeoff analyses |
| Test cases documented | 17 (6 existing, 11 proposed) |
| Coverage gaps identified | 10 |
| API coverage by tests | 85% (11/13 functions) |
| Audit findings | 7 (2 fixed inline) |
| Source citations | Every requirement cites file:line |
| Confidence tagging | 100% of items tagged [High]/[Medium]/[Low] |

## What Worked Well

### 1. Parallel agent execution

Launching three independent agents cut the extraction phase from ~21 minutes to
~7.5 minutes. The agents produced high-quality, structurally consistent documents
despite working independently.

### 2. Anti-hallucination guardrails

Every requirement cites specific source locations (e.g., `ebpf_epoch.c:704-706`).
No invented behaviors were found during the audit. The confidence tagging
([High]/[Medium]/[Low]) made it easy to identify items needing human review.

### 3. Adversarial audit caught real issues

The audit found that the independently-drafted documents used conflicting REQ-ID
schemes — a genuine traceability problem that would have confused future readers.
The automated fix (replacing the design doc's ad-hoc IDs with canonical references)
was surgical and correct.

### 4. Structured workflow

The 6-phase workflow with explicit human gates prevented the agent from
hallucinating requirements or auto-approving its own work. Each phase had clear
inputs, outputs, and stop conditions.

### 5. Deep technical understanding

The agent correctly identified and documented:
- The epoch skew hazard and how the global published epoch prevents it
- The `released_epoch = proposed - 1` safety margin and why it exists
- The stack-allocated synchronization entry design and its OOM-avoidance rationale
- The cross-CPU exit path's DISPATCH_LEVEL fail-fast invariant

## What Could Be Improved

### 1. Shared REQ-ID registry for parallel agents

The primary audit finding (F-001/F-002) stemmed from parallel agents independently
inventing requirement IDs. A future improvement would be to:
- Run Phase 2a (requirements) first
- Extract the REQ-ID list
- Feed it to the design and validation agents

This trades ~2 minutes of parallelism for perfect traceability.

### 2. Validation coverage granularity

The validation plan mapped 6 existing tests to ~30 requirement groups, but the
requirements document defined 57 atomic requirements. The 21 "untested"
requirements are mostly internal mechanism requirements (timer flags, KEVENT
signaling) that are implicitly exercised by integration tests. A "verified by
implicit coverage" category would reduce false coverage-gap noise.

### 3. Out-of-scope file references

The design agent discovered and referenced `docs/EpochBasedMemoryManagement.md`
and `include/ebpf_extension.h`, which were not in the specified input set. While
this added useful context, it violated the scoping rules. Future runs should either
explicitly include these files or instruct agents to stay within scope.

### 4. Proposed test case specificity

The 11 proposed test cases vary in specificity. Some (like TC-ECS-003: thread
migration) describe a clear, implementable test. Others (like TC-LIFE-002:
initialization failure) would require fault injection infrastructure that may
not exist. Tagging proposed tests with implementation feasibility would help
prioritize.

## Lessons Learned

1. **Spec extraction is viable for systems code.** Even a complex kernel module
   with per-CPU state, inter-CPU messaging, and subtle concurrency invariants can
   be systematically specified from its implementation.

2. **The audit phase is essential, not optional.** Without it, the three documents
   would have shipped with conflicting requirement IDs — a traceability defect
   that compounds over time as specs are maintained.

3. **Parallel extraction is a net win despite traceability cost.** The 3x speedup
   is worth the alignment fix, especially since the fix is mechanical (search and
   replace IDs).

4. **Human gates prevent runaway fabrication.** The user's involvement was minimal
   (~3 interactions totaling ~10 words) but each gate forced the agent to pause,
   present evidence, and wait — preventing the common failure mode of LLMs
   generating plausible-but-unsupported content.

5. **Coverage gap analysis has immediate value.** The 10 identified gaps
   (e.g., `ebpf_epoch_cancel_work_item` never tested, thread migration path
   untested) are actionable items that can drive the next round of test
   development, independent of whether the specs themselves are adopted.

## Reproduction

To reproduce this extraction on another module:

```
Read and execute the spec-extraction-workflow in the workflows directory.
```

Then specify:
- The source files to analyze
- The output directory for specs
- Any additional context files (design docs, related headers)

The workflow is interactive and will pause at each phase gate for confirmation.
