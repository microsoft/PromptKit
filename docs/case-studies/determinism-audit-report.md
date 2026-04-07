# PromptKit Determinism Audit — Investigation Report

## 1. Executive Summary

Pass 4 (Language Determinism Analysis) audited 60 component files for
non-deterministic directive language. The library's overall determinism
grade is **Imprecise**: 55 High-severity and ~61 Medium-severity
findings were detected. The dominant pattern is **subjective adjectives**
used as evaluation criteria without defined scales (33% of all High
findings), followed by **conditionals without exhaustive branches** (18%)
and **missing output specifications** (16%). 18 of 60 components
(30%) graded Imprecise; 7 (12%) graded Precise; the remainder
Acceptable. Concrete rewrite suggestions are provided for every finding.

**Finding breakdown**: 55 High, ~61 Medium (standard strictness —
Medium counted in scorecard, High reported as findings)

## 2. Problem Statement

PromptKit's directive text (protocol phases, template instructions,
format rules) is consumed by LLMs. Vague, ambiguous, or underspecified
language causes different LLMs — or the same LLM across runs — to
interpret instructions inconsistently, producing non-deterministic
output. This audit applies the newly added `prompt-determinism-analysis`
protocol to the library's own components.

## 3. Investigation Scope

- **Components examined**: 60 files (34 protocols, 19 templates from
  batch 1, 10 templates + 8 formats from batch 2). Personas and
  taxonomies were excluded (low directive content density by design).
- **Pass executed**: Pass 4 (Language Determinism Analysis) only
- **Strictness**: Standard (High and Medium flagged; Low scorecard-only)
- **Tools used**: Four parallel explore agents analyzing guardrail/analysis
  protocols, reasoning protocols, templates batch 1, and templates
  batch 2 + formats
- **Limitations**: Personas (15 files) and taxonomies (5 files) were
  excluded — personas are thin by convention, taxonomies define
  categories not directives. Some templates not in the analyzed batches
  (hardware-specific, lifecycle templates) were also excluded.

## 4. Findings

### Finding F-001: Subjective adjectives as evaluation criteria
- **Severity**: High
- **Category**: Language Determinism
- **Location**: 18 instances across 15 components
- **Description**: Words like "significant," "appropriate," "reasonable,"
  "unique," "clean," "good," and "clear" are used as pass/fail criteria
  in directive text without defining what constitutes passing. Different
  LLMs will apply different thresholds.
- **Evidence**:
  - `author-design-doc.md`: "For every significant design decision"
  - `audit-library-health.md`: "unique analysis methodology"
  - `investigation-report.md`: "reasonable supporting evidence"
  - `review-code.md`: "Are edge cases handled"
  - `author-agent-instructions.md`: "Preserve all specific checks"
  - 13 additional instances (see scorecard)
- **Remediation**: Replace each subjective adjective with observable
  criteria. Example: "significant design decision" → "design decision
  that (a) affects multiple components, (b) impacts non-functional
  requirements, or (c) is difficult to reverse."
- **Confidence**: High

### Finding F-002: Conditionals without exhaustive branches
- **Severity**: High
- **Category**: Language Determinism
- **Location**: 10 instances across 9 components
- **Description**: Directive text uses "if X, do Y" without specifying
  what happens when X is false, when the boundary is ambiguous, or when
  the error case occurs. LLMs silently choose arbitrary behavior for
  the unspecified branch.
- **Evidence**:
  - `self-verification.md`: "If any answer is 'no' and the vague
    language is not intentionally flexible" — no branch for intentionally
    flexible
  - `traceability-audit.md`: "design if present" — no branch for absent
  - `validate-budget.md`: "if the spec calls for additional scrutiny" —
    no else
  - `extend-library.md`: "Scope that is too broad" — no branch for
    too narrow
  - `fix-compiler-warnings.md`: MSVC-specific pragma handling — no
    Clang/GCC branch
- **Remediation**: Add explicit else/default branches for every
  conditional. Example: "If the design document is present, check X.
  If the design document is NOT provided, note this limitation in the
  report and skip design-dependent checks."
- **Confidence**: High

### Finding F-003: Missing output specification
- **Severity**: High
- **Category**: Language Determinism
- **Location**: 9 instances across 8 components
- **Description**: Instructions request output ("maintain a record,"
  "report findings," "document the decomposition") without specifying
  the structure, granularity, or artifact format.
- **Evidence**:
  - `adversarial-falsification.md`: "Maintain a record of candidate
    findings that were investigated and rejected" — no structure
  - `kernel-correctness.md`: "Report using structured markdown" — no
    template
  - `audit-library-consistency.md`: "overlapping protocols → candidate
    for parameterization" — no overlap threshold
  - `author-agent-instructions.md`: "The recommended decomposition" —
    advisory not normative
  - `investigate-security.md`: "Include CWE identifiers where
    applicable" — no applicability criteria
- **Remediation**: Add explicit output templates. Example: "Maintain a
  record as a 3-column markdown table: | Candidate Finding | Reason
  Rejected | Safe Mechanism |"
- **Confidence**: High

### Finding F-004: Unanchored comparatives
- **Severity**: High
- **Category**: Language Determinism
- **Location**: 4 instances across 4 components
- **Description**: Comparatives ("more," "better," "~4 KB,"
  "effectively") are used without baselines or concrete thresholds.
- **Evidence**:
  - `operational-constraints.md`: "Do NOT attempt to read more content
    than you can effectively reason about"
  - `agent-instructions.md`: "Keep each skill file under ~4 KB"
  - `structured-findings.md`: "same diagnostic, same root cause, same
    fix" — "same" undefined (character-identical? semantically equivalent?)
  - `validate-budget.md`: "typical vs. max" — "max" undefined
- **Remediation**: Anchor to measurable values. "~4 KB" → "≤4 KB hard
  limit." "Effectively reason about" → "≤50,000 lines or 60% of
  available context window."
- **Confidence**: High

### Finding F-005: Vague quantifiers in directive text
- **Severity**: High
- **Category**: Language Determinism
- **Location**: 4 instances across 4 components
- **Description**: Words like "multiple," "3–5," "~30%," and "repeated"
  leave counts or thresholds ambiguous.
- **Evidence**:
  - `self-verification.md`: "at least 3–5 specific claims" — range
    instead of deterministic count
  - `anti-hallucination.md`: "exceeds ~30%" — approximate
  - `investigate-bug.md`: "Generate multiple hypotheses (at least 3)"
  - `audit-library-health.md`: "repeated context" — no repetition count
- **Remediation**: Replace with exact values. "3–5" → "exactly 5."
  "~30%" → "30%." "Repeated" → "appears 2+ times without variation."
- **Confidence**: High

### Finding F-006: Implicit context dependencies
- **Severity**: High
- **Category**: Language Determinism
- **Location**: 3 instances across 3 components
- **Description**: Instructions reference concepts or prior state without
  making the reference explicit.
- **Evidence**:
  - `adversarial-falsification.md`: "Treat prior 'all false positives'
    conclusions as untrusted" — which prior conclusions?
  - `prompt-determinism-analysis.md`: "specific sub-steps that
    operationalize the verb" — "operationalize" undefined
  - `decompose-prompt.md`: "confidential, customer, internal-only, or
    proprietary content" — categories undefined
- **Remediation**: Define referenced concepts inline or cite the source
  definition. "Operationalize" → "numbered sub-steps, each naming a
  concrete action (not another abstract verb) with measurable completion
  criteria."
- **Confidence**: High

### Finding F-007: Missing exit criteria
- **Severity**: High
- **Category**: Language Determinism
- **Location**: 3 instances across 3 components
- **Description**: Iterative or open-ended instructions lack termination
  conditions.
- **Evidence**:
  - `interactive-design.md`: "Continue asking questions until you have
    no remaining ambiguities" — "no remaining" is unbounded
  - `lint-prompt.md`: "intentionally flexible" language flagging — no
    criteria for determining intent
  - `triage-issues.md`: "Identify patterns" — no count, no stop
    condition
- **Remediation**: Add concrete exit criteria. "No remaining ambiguities"
  → "each input parameter has been clarified, all known constraints
  have been stated, and at least 3 alternatives have been explored."
- **Confidence**: High

### Finding F-008: Missing bounds and constraints
- **Severity**: High
- **Category**: Language Determinism
- **Location**: 4 instances across 4 components
- **Description**: Instructions reference quantities or thresholds
  without concrete limits.
- **Evidence**:
  - `operational-constraints.md`: "Do NOT ingest an entire source tree"
    — "entire" is relative
  - `traceability-audit.md`: "describe how the requirement is realized"
    — no detail level specified
  - `interface-contract-audit.md`: disallowed placeholders list is not
    exhaustive
  - `audit-library-health.md`: density classification boundary (exactly
    80%, exactly 50%) unhandled
- **Remediation**: Add explicit bounds. "Entire source tree" → "more
  than 10,000 lines or more than 20% of available context window."
  Density: "Dense (≥80%), Normal (50–79%), Bloated (≤49%)."
- **Confidence**: High

## 5. Root Cause Analysis

The findings cluster into a single root cause: **PromptKit grew as a
specification library, not as a programmatic API.** Natural language
specifications tolerate ambiguity that formal interfaces do not. When
PromptKit's specifications were consumed only by humans, terms like
"significant" and "appropriate" were interpreted by human judgment. Now
that LLMs consume these specifications directly, the same terms
introduce non-determinism.

The pattern distribution confirms this: 51% of High findings are
language-level imprecision (subjective adjectives + vague quantifiers +
unanchored comparatives), while 34% are structural gaps (missing
branches + missing output specs). The language issues are the legacy of
human-oriented prose; the structural issues are design gaps.

## 6. Remediation Plan

| Priority | Finding | Fix | Effort | Risk |
|----------|---------|-----|--------|------|
| 1 | F-001 | Replace subjective adjectives with observable criteria across 15 components | L | Safe — improves precision without changing semantics |
| 2 | F-002 | Add else/default branches to all 10 conditional directives | M | Safe — makes implicit behavior explicit |
| 3 | F-003 | Add output templates/schemas to 8 components | M | Safe — constrains format without limiting content |
| 4 | F-004 | Anchor 4 comparatives to measurable values | S | Safe — converts approximations to limits |
| 5 | F-005 | Replace 4 vague quantifiers with exact values | S | Tradeoff — "exactly 5" may be too rigid for some contexts |
| 6 | F-006 | Define 3 implicit references inline | S | Safe — adds definitions |
| 7 | F-007 | Add exit criteria to 3 open-ended directives | S | Safe — bounds iteration |
| 8 | F-008 | Add explicit bounds to 4 unbounded directives | S | Tradeoff — some bounds are inherently judgment calls |

## 7. Prevention

- **Run Pass 4 as part of periodic health audits.** The
  `audit-library-health` template now includes Pass 4 (Language
  Determinism Analysis) as a standard dimension.
- **Self-verification §6 catches new vagueness at generation time.**
  The `self-verification` guardrail now includes a Determinism Check
  that fires before any output is finalized.
- **Self-audit §7 catches vagueness in CI-like structural checks.**
  The `tests/self-audit-prompt.md` now includes Language Precision
  checks.
- **Use `lint-prompt` on new components before merging.** Run the
  standalone `lint-prompt` template against any new protocol, template,
  or format during PR review.

## 8. Open Questions

1. **Should "exactly 5" replace "at least 3–5"?** Some vague quantifiers
   exist intentionally to give the LLM flexibility (e.g., the number of
   sampling checks in self-verification). Fixing these requires deciding
   whether determinism or flexibility is more important per-instance.
2. **What is the target grade?** Should PromptKit aim for Precise
   (0 High, ≤2 Medium per component) across the entire library, or is
   Acceptable sufficient for components where some LLM discretion is
   desirable?
3. **Should the determinism linter run in CI?** The `validate-manifest.py`
   check runs on push/PR. A determinism check could be added, but it
   requires LLM evaluation (not a static script).

## Determinism Scorecard

| Component | Type | High | Med | Grade |
|-----------|------|------|-----|-------|
| root-cause-analysis.md | protocol | 0 | 0 | **Precise** |
| devops-platform-analysis.md | protocol | 0 | 0 | **Precise** |
| requirements-from-implementation.md | protocol | 0 | 0 | **Precise** |
| test-compliance-audit.md | protocol | 0 | 0 | **Precise** |
| invariant-extraction.md | protocol | 0 | 0 | **Precise** |
| corpus-safety-audit.md | protocol | 0 | 0 | **Precise** |
| minimal-edit-discipline.md | protocol | 0 | 0 | **Precise** |
| security-vulnerability.md | protocol | 0 | 1 | Acceptable |
| memory-safety-c.md | protocol | 0 | 1 | Acceptable |
| memory-safety-rust.md | protocol | 0 | 1 | Acceptable |
| thread-safety.md | protocol | 0 | 1 | Acceptable |
| iterative-refinement.md | protocol | 0 | 1 | Acceptable |
| code-compliance-audit.md | protocol | 0 | 1 | Acceptable |
| rfc-extraction.md | protocol | 0 | 2 | Acceptable |
| spec-evolution-diff.md | protocol | 0 | 1 | Acceptable |
| protocol-validation-design.md | protocol | 0 | 1 | Acceptable |
| quantitative-constraint-validation.md | protocol | 0 | 2 | Acceptable |
| cpp-best-practices.md | protocol | 0 | 2 | Acceptable |
| performance-critical-c-api.md | protocol | 0 | 1 | Acceptable |
| promptkit-design.md | protocol | 0 | 3 | Acceptable |
| spec-invariant-audit.md | protocol | 0 | 3 | Acceptable |
| anti-hallucination.md | protocol | 1 | 0 | Acceptable |
| input-clarity-gate.md | protocol | 1 | 1 | Acceptable |
| kernel-correctness.md | protocol | 1 | 1 | Acceptable |
| integration-audit.md | protocol | 1 | 0 | Acceptable |
| change-propagation.md | protocol | 1 | 1 | Acceptable |
| interface-contract-audit.md | protocol | 1 | 2 | Acceptable |
| requirements-elicitation.md | protocol | 1 | 2 | **Imprecise** |
| self-verification.md | protocol | 2 | 1 | **Imprecise** |
| operational-constraints.md | protocol | 2 | 2 | **Imprecise** |
| adversarial-falsification.md | protocol | 2 | 1 | **Imprecise** |
| prompt-determinism-analysis.md | protocol | 2 | 0 | **Imprecise** |
| traceability-audit.md | protocol | 2 | 1 | **Imprecise** |
| author-requirements-doc.md | template | 1 | 1 | Acceptable |
| author-validation-plan.md | template | 1 | 1 | Acceptable |
| investigate-bug.md | template | 1 | 1 | Acceptable |
| author-pipeline.md | template | 1 | 1 | Acceptable |
| extend-library.md | template | 1 | 1 | Acceptable |
| decompose-prompt.md | template | 1 | 1 | Acceptable |
| audit-library-consistency.md | template | 1 | 1 | Acceptable |
| lint-prompt.md | template | 1 | 1 | Acceptable |
| audit-traceability.md | template | 1 | 1 | Acceptable |
| audit-test-compliance.md | template | 1 | 1 | Acceptable |
| audit-spec-invariants.md | template | 1 | 0 | Acceptable |
| fix-compiler-warnings.md | template | 1 | 1 | Acceptable |
| triage-issues.md | template | 1 | 0 | Acceptable |
| author-design-doc.md | template | 2 | 0 | **Imprecise** |
| interactive-design.md | template | 2 | 2 | **Imprecise** |
| investigate-security.md | template | 2 | 0 | **Imprecise** |
| review-code.md | template | 2 | 1 | **Imprecise** |
| audit-code-compliance.md | template | 2 | 1 | **Imprecise** |
| validate-budget.md | template | 2 | 0 | **Imprecise** |
| author-agent-instructions.md | template | 3 | 1 | **Imprecise** |
| audit-library-health.md | template | 3 | 1 | **Imprecise** |
| requirements-doc.md | format | 1 | 0 | Acceptable |
| design-doc.md | format | 1 | 1 | Acceptable |
| validation-plan.md | format | 0 | 2 | Acceptable |
| promptkit-pull-request.md | format | 0 | 1 | Acceptable |
| structured-findings.md | format | 1 | 0 | Acceptable |
| investigation-report.md | format | 2 | 1 | **Imprecise** |
| agent-instructions.md | format | 2 | 1 | **Imprecise** |
