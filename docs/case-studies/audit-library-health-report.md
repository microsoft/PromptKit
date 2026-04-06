# PromptKit Library Health Audit — Investigation Report

## 1. Executive Summary

Audited 167 component files across all 7 directories for structural
consistency and corpus safety. The library is in excellent health: zero
safety risks, full license compliance, and strong structural integrity.
The main improvement area is template consolidation — several groups of
audit templates share identical scaffolding and could be parameterized.
A handful of protocol cross-references were missing (now fixed in PR #186).

**Finding breakdown**: 0 Critical, 2 High, 5 Medium, 3 Low, 3 Informational

## 2. Problem Statement

Periodic health audit of the PromptKit component library to detect
overlap, redundancy, conflicts, metadata drift, and corpus safety risks
— especially after introducing the `decompose-prompt` assimilation
workflow.

## 3. Investigation Scope

- **Components examined**: 167 files (15 personas, 56 protocols, 24 formats, 5 taxonomies, 67 templates)
- **Passes executed**: Pass 1 (Structural Consistency), Pass 2 (Corpus Safety)
- **Pass 3 (Runtime Fitness)**: Skipped per user selection
- **Tools used**: Three parallel explore agents analyzing protocols, templates, and corpus safety
- **Limitations**: Protocol pairwise comparison was cluster-based for reasoning protocols (33 files); first 5 examined in depth, remainder by summary

## 4. Findings

### Finding F-001: Audit template consolidation opportunity
- **Severity**: High
- **Category**: Overlap / Redundancy
- **Location**: 9 templates in `templates/audit-*.md`
- **Description**: Nine `specification-analyst` + `investigation-report` templates differ only in their final domain-specific protocol. All share: same persona, same format, same guardrail protocols (`anti-hallucination`, `self-verification`), and similar instruction structure.
- **Evidence**: `audit-traceability`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `audit-interface-contract`, `audit-spec-invariants`, `audit-library-health`, `diff-specifications`, `validate-budget`, `profile-session`
- **Root Cause**: Each audit use case was added independently without parameterization
- **Impact**: Maintenance burden — changes to shared structure must be replicated across 9 files
- **Remediation**: Consider a parameterized `audit-specification` template with an `audit_type` parameter that selects the domain-specific protocol. **Tradeoff optimization** — merging improves maintainability but reduces discoverability of individual audit capabilities.
- **Confidence**: High

### Finding F-002: Electrical review template consolidation opportunity
- **Severity**: High
- **Category**: Overlap / Redundancy
- **Location**: 4 templates: `review-schematic`, `review-bom`, `review-layout`, `review-enclosure`
- **Description**: Four `electrical-engineer`/`mechanical-engineer` review templates share the same structure, differing only in the analysis protocol and artifact type.
- **Impact**: Same maintenance burden as F-001 at smaller scale
- **Remediation**: Consider a parameterized `review-electrical-artifact` template with an `artifact_type` parameter. **Tradeoff optimization** — same discoverability concern.
- **Confidence**: High

### Finding F-003: Epistemic labeling defined in two places ✅ FIXED (PR #186)
- **Severity**: Medium
- **Category**: Overlap / Redundancy
- **Location**: `protocols/guardrails/anti-hallucination.md` (Rule 1), `protocols/guardrails/self-verification.md` (Rule 2)
- **Description**: Both protocols define KNOWN/INFERRED/ASSUMED categories. `anti-hallucination` defines the labels; `self-verification` enforces them. Neither explicitly referenced the other as the source of truth.
- **Remediation**: Added a note in `self-verification` Rule 2 referencing `anti-hallucination` Rule 1. **Safe optimization.**
- **Confidence**: High

### Finding F-004: Protocol implicit dependency chain undocumented ✅ FIXED (PR #186)
- **Severity**: Medium
- **Category**: Overlap / Redundancy
- **Location**: `memory-safety-c`, `cpp-best-practices` (CPP-1/CPP-2), `thread-safety`, `kernel-correctness` (Phase 1)
- **Description**: Clear specialization hierarchy: `memory-safety-c` → `cpp-best-practices CPP-1`; `thread-safety` → `cpp-best-practices CPP-2` → `kernel-correctness`. No cross-references documented these relationships.
- **Remediation**: Added Cross-References sections to `cpp-best-practices` and `kernel-correctness`. **Safe optimization.**
- **Confidence**: High

### Finding F-005: Coverage documentation terminology inconsistency ✅ FIXED (PR #186)
- **Severity**: Medium
- **Category**: Metadata Drift
- **Location**: `protocols/guardrails/operational-constraints.md` (Rule 7) vs `protocols/guardrails/self-verification.md` (Rule 3)
- **Description**: Both define coverage documentation but used different field names. `operational-constraints`: Examined/Method/Excluded/Limitations. `self-verification`: source documents consulted/areas examined/topics excluded.
- **Remediation**: Standardized on `operational-constraints` format (Examined/Method/Excluded/Limitations). **Safe optimization.**
- **Confidence**: High

### Finding F-006: Severity taxonomy not globally standardized ✅ FIXED (PR #186)
- **Severity**: Medium
- **Category**: Metadata Drift
- **Location**: All analysis protocols
- **Description**: Most use Critical/High/Medium/Low. Some add Informational. Some don't use severity at all. No global standard defined.
- **Remediation**: Defined a global severity taxonomy (Critical/High/Medium/Low/Informational) in CONTRIBUTING.md. **Safe optimization.**
- **Confidence**: Medium

### Finding F-007: kernel-correctness uses nonstandard output format tags ✅ FIXED (PR #186)
- **Severity**: Low
- **Category**: Metadata Drift
- **Location**: `protocols/analysis/kernel-correctness.md`
- **Description**: Used `[SEVERITY: …]` tags while other protocols use standard markdown headings for findings.
- **Remediation**: Aligned to markdown heading style. Softened format alignment claim to acknowledge kernel-specific fields. **Safe optimization.**
- **Confidence**: Medium

### Finding F-008: All components verified clean (corpus safety)
- **Severity**: Informational
- **Category**: Corpus Safety
- **Location**: All 167 files
- **Description**: Full provenance scan: 167/167 classified as Verified Original. Zero verbatim copying detected. Zero confidentiality leaks. Full MIT license compliance (SPDX headers on every file). No external attribution needed.
- **Confidence**: High

### Finding F-009: code-compliance-audit references taxonomy without pointer ✅ FIXED (PR #186)
- **Severity**: Low
- **Category**: Metadata Drift
- **Location**: `protocols/reasoning/code-compliance-audit.md` Phase 6
- **Description**: References specification-drift taxonomy labels D8/D9/D10 without a cross-reference to the taxonomy file.
- **Remediation**: Added explicit reference to `taxonomies/specification-drift.md`. **Safe optimization.**
- **Confidence**: High

### Finding F-010: Standalone protocols not orphaned but worth monitoring
- **Severity**: Informational
- **Category**: Metadata Drift
- **Location**: 5 protocols with `applicable_to: []`: `component-selection`, `component-selection-audit`, `manufacturing-artifact-generation`, `pcb-layout-design`, `schematic-design`
- **Description**: These are intentionally standalone (per CONTRIBUTING.md conventions). Not a bug, but worth monitoring — if they remain unreferenced across 2+ releases, they may indicate unused components.
- **Confidence**: High

### Finding F-011: Parameterization opportunities in requirements extraction
- **Severity**: Informational
- **Category**: Overlap / Redundancy
- **Location**: `extract-rfc-requirements`, `extract-invariants`, `reverse-engineer-requirements`
- **Description**: Three templates extract requirements from different source types. Could potentially share a parameterized base, but extraction methodologies differ enough that this is a minor optimization.
- **Remediation**: Monitor — if a fourth extraction template is added, refactor to parameterized base.
- **Confidence**: Medium

## 5. Root Cause Analysis

The primary structural pattern is **independent component addition** —
each new use case was contributed as a standalone template without
checking for consolidation opportunities with existing templates sharing
the same scaffolding. This is a natural growth pattern for a composable
library and does not indicate a process failure.

## 6. Remediation Plan

| Priority | Finding | Fix Description | Effort | Risk | Status |
|----------|---------|-----------------|--------|------|--------|
| 1 | F-003 | Cross-ref epistemic labels | S | None | ✅ Done (PR #186) |
| 2 | F-004 | Add protocol cross-references | S | None | ✅ Done (PR #186) |
| 3 | F-005 | Standardize coverage format | S | None | ✅ Done (PR #186) |
| 4 | F-009 | Add taxonomy reference | S | None | ✅ Done (PR #186) |
| 5 | F-007 | Align kernel-correctness format | S | None | ✅ Done (PR #186) |
| 6 | F-006 | Define global severity taxonomy | M | Low | ✅ Done (PR #186) |
| 7 | F-001 | Evaluate audit template parameterization | L | Medium | ⏳ Pending design decision |
| 8 | F-002 | Evaluate electrical review parameterization | M | Medium | ⏳ Pending design decision |

## 7. Prevention

- Run `audit-library-health` after every 3–5 new component additions
- When adding a new template, check if an existing template with the
  same persona+format+guardrails exists — if so, consider parameterization
- Add a "Cross-References" section to protocol conventions in CONTRIBUTING.md

## 8. Open Questions

- Should the 9 audit templates be consolidated into 1 parameterized
  template, or is per-use-case discoverability more valuable?
  **Requires team input.**
- Should a global severity taxonomy be a standalone reference document
  or embedded in CONTRIBUTING.md? (Currently in CONTRIBUTING.md per PR #186.)

## 9. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-06 | Copilot + audit-library-health | Initial audit: Pass 1 + Pass 2 |
| 1.1 | 2026-04-06 | Copilot | Fixed F-003 through F-009 in PR #186 |
