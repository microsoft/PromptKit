<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: exhaustive-bug-hunt
description: >
  Deep, adversarial, line-by-line code review optimized for defect
  discovery. Exhaustive path tracing with coverage proof and
  falsification discipline. Optionally applies kernel-specific
  analysis for OS code.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/adversarial-falsification
  - reasoning/exhaustive-path-tracing
taxonomies:
  - kernel-defect-categories
format: exhaustive-review-report
params:
  code: "The code to review — one file or a small batch of related files"
  language: "Programming language (e.g., C, C++, Rust)"
  domain: "Optional — 'kernel' to enable kernel-correctness protocol and kernel-defect-categories taxonomy, or 'general' for language-agnostic review"
  additional_protocols: "Optional — specific protocols to apply (e.g., kernel-correctness, memory-safety-c, thread-safety, security-vulnerability)"
  context: "What this code does, where it fits in the system, any known concerns"
input_contract: null
output_contract:
  type: exhaustive-review-report
  description: >
    Per-file coverage ledgers proving review completeness, adversarial
    findings with falsification proof, and false-positive rejection logs.
---

# Task: Exhaustive Bug Hunt

You are in **exhaustive bug-hunting mode**. Your task is to perform deep,
adversarial, line-by-line review of the provided code and find **real bugs** —
not stylistic issues, not vague risks, and not architectural opinions.

**Optimize for defect discovery and falsification of your own hypotheses.**
Do not optimize for speed, brevity, or token savings.

## Inputs

**Code**:
```{{language}}
{{code}}
```

**Language**: {{language}}

**Domain**: {{domain}}

**Context**: {{context}}

**Additional Protocols to Apply**: {{additional_protocols}}

## Instructions

### 1. Apply the Adversarial Falsification Protocol

- Assume more real bugs exist. Do not conclude "no bugs found" unless you
  have exhausted the review procedure and can prove coverage.
- For every candidate bug, attempt to disprove it before reporting.
- If you catch yourself summarizing, stop and continue tracing.

### 2. Apply the Exhaustive Path-Tracing Protocol

For each file in scope:

1. **Read the whole file**, not just search hits.
2. **Build a local map** of entry points, helpers, lock sites, refcount
   pairs, state variables, and cleanup blocks.
3. **Identify high-risk functions** by complexity of goto structure,
   number of unlock points, mixed success/error mutation, boundary
   handling, interlocked transitions, and size arithmetic.
4. **For each high-risk function**, trace:
   - The success path
   - Each early-return path
   - Each goto / cleanup target
   - Cleanup symmetry (every resource released on every path)
   - Lock/refcount symmetry
   - State rollback on partial failure
5. **Produce a coverage ledger** for each file before concluding.

### 3. Apply Domain-Specific Analysis (If Applicable)

If `{{domain}}` is `kernel` or `{{additional_protocols}}` includes
`kernel-correctness`:

- Apply the **kernel-correctness** analysis protocol.
- Use the **kernel-defect-categories** taxonomy (K1–K14) to classify findings.
- Suppress false positives from known-safe kernel patterns (optimistic reads,
  ReadNoFence fast paths, lock-free PTE reads, CAS retry patterns, cleanup
  in helpers, lock release by callees, NT_ASSERT caller guarantees).

If `{{additional_protocols}}` includes other protocols (e.g., `memory-safety-c`,
`thread-safety`, `security-vulnerability`), apply them systematically.

### 4. Format Each Finding

Use the exhaustive-review-report format. Every finding MUST include:

- **Exact line numbers**
- **Trigger path** (step-by-step control flow)
- **Why this is a real bug** (technical explanation)
- **Why this is NOT a false positive** (disproof of counterargument)
- **Concrete consequence** (crash, corruption, escalation, leak)
- **Confidence level** (Confirmed / High-confidence / Needs-domain-check)
- **Fix direction** (minimal fix approach)

### 5. Document Rejected False Positives

For each candidate finding that was investigated and rejected, record:
- What the candidate was
- Why it was rejected (cite the specific mechanism that makes it safe)

### 6. Apply Quality Gates

Before finalizing:

- Verify every file has a completed coverage ledger.
- Verify every finding has the falsification proof field.
- Re-verify at least 3 findings against the source code.
- Only then write the executive summary.

## Scope and Priorities

### Focus On

- Lock leaks and lock ordering violations
- Refcount leaks or double dereferences
- Cleanup omissions on goto / early-return / error paths
- Use-after-free from object lifetime mismatches
- Stale pointer use after unlock
- Integer overflow or truncation in size, count, offset, and allocation math
- Missing rollback after partial state mutation
- Inconsistent flag tracking across success/failure paths
- Security boundary mistakes

If kernel domain:
- Incorrect PreviousMode or probe/capture assumptions
- PFN/PTE state transition races
- ABA or lost-update bugs in interlocked sequences
- Mismatched charge/uncharge accounting
- Invalid assumptions hidden behind NT_ASSERT-only checks in retail builds

### Do NOT Spend Time On

- Style, naming, or comment quality
- Speculative "design review" observations
- Issues without a concrete bad outcome
- Findings already neutralized by later validation, helper cleanup,
  or lock-validated retry logic

## Non-Goals

- Do NOT refactor or redesign the code.
- Do NOT report issues outside the provided scope unless directly
  called by the reviewed code.
- Do NOT provide design commentary unless it masks a concrete bug.
- Do NOT give architectural opinions.

## Quality Checklist

Before finalizing, verify:

- [ ] Every file has a completed coverage ledger
- [ ] Every finding cites exact line numbers
- [ ] Every finding has a trigger path
- [ ] Every finding has a "Why NOT a false positive" field
- [ ] Every finding has a concrete consequence
- [ ] At least 3 findings re-verified against the source
- [ ] False-positive candidates rejected table is present per file
- [ ] Executive summary written ONLY after all files are covered
- [ ] No vague claims — "possible race" or "could leak" with full trace or not at all
