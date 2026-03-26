<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: finding-classification
type: reasoning
description: >
  Systematic protocol for classifying findings (bugs, warnings,
  review comments, audit results) against a known taxonomy or
  pattern catalog. Performs three-way classification with
  justification, confidence analysis, and catalog update proposals.
applicable_to:
  - classify-findings
---

# Protocol: Finding Classification

Apply this protocol when you have a set of findings — compiler warnings,
security scan results, code review comments, audit observations, or any
other diagnostic output — and a reference catalog or taxonomy to classify
them against. The goal is to classify every finding against the catalog
with explicit justification, assess classification confidence, and
propose catalog updates for findings that reveal gaps.

## Applicability

Use this protocol for any findings-vs-catalog classification task,
including but not limited to:

- Compiler or linter diagnostics against a warning pattern catalog
- Security findings against a vulnerability taxonomy (CWE, OWASP)
- Code review findings against a style or convention guide
- Audit results against a compliance framework
- Test failures against a known defect pattern library
- Any scenario where a set of observations must be mapped to an
  established classification scheme

## Rules

### 1. Three-Way Classification

Classify every finding into exactly one of three categories:

- **Exact Match** — The finding matches an existing catalog pattern's
  description, examples, and diagnostic signature. The documented fix
  applies directly. Cite the specific catalog entry.
- **Variant** — The finding matches a pattern class but represents a
  meaningfully different manifestation (new context, different types,
  different severity, or an edge case not covered by existing examples).
  The base pattern's fix may apply with modifications. Cite the base
  pattern and explain the divergence.
- **New Pattern** — The finding does not fit any established pattern
  after exhaustive comparison. It requires a new catalog entry.

Do NOT force a finding into Exact Match when it is a Variant, and do
NOT label a finding as a Variant when it genuinely represents something
the catalog has never addressed.

### 2. Exhaustive Matching

Before classifying any finding as New Pattern, compare it against ALL
catalog patterns — not just the ones that seem likely. Document which
patterns you considered and why each was rejected:

1. List every catalog pattern reviewed.
2. For each pattern, state the reason for rejection (different
   diagnostic, different root cause, different scope, etc.).
3. Only after every pattern is eliminated may you classify the finding
   as New Pattern.

This prevents premature classification and ensures catalog coverage
is fully tested.

### 3. Consolidation Before Classification

Before classifying individual findings, consolidate duplicates.
Findings that share ALL of the following characteristics represent a
single pattern with multiple occurrences:

- Same diagnostic, warning, or error type
- Same root cause mechanism
- Same recommended fix

Consolidate these into a single finding entry with a count and list of
occurrence locations. Classify the consolidated pattern once.

Do NOT consolidate findings when any of the following differ:

- Different diagnostic or error identifiers
- Different root cause mechanisms
- Different fixes required

Consolidation reduces noise and prevents redundant classification work.
Report occurrence counts so stakeholders understand frequency.

### 4. Justification

Provide explicit justification for every classification:

- **Exact Match** — Cite the specific catalog section or pattern ID.
  Show how the finding's diagnostic signature aligns with the catalog
  entry's description and examples. Quote the relevant catalog text
  when feasible.
- **Variant** — Cite the base pattern. Explain precisely what is
  different: new triggering context, different types involved,
  different severity characteristics, or an uncovered edge case.
  State whether the base pattern's fix applies as-is or requires
  modification.
- **New Pattern** — List all patterns considered (per Rule 2) and
  the rejection reason for each. Explain what makes this finding
  fundamentally distinct from the existing catalog.

Do NOT classify without justification. A classification label alone
is insufficient.

### 5. Confidence Analysis

For each classification, provide a structured confidence assessment:

- **Confidence Score** — Rate on a five-point scale:
  - Very High (95–100%): Unambiguous match with strong evidence
  - High (85–94%): Clear match with minor uncertainty
  - Medium (70–84%): Reasonable match but notable ambiguity
  - Low (50–69%): Tentative classification; more evidence needed
  - Very Low (<50%): Best guess; expert review recommended

- **Supporting Evidence** — Bullet list of factors supporting the
  classification (diagnostic alignment, code pattern similarity,
  matching examples in catalog, consistent root cause).

- **Potential Weaknesses** — Factors that could weaken the
  classification (partial match only, ambiguous diagnostic, unusual
  context, limited catalog coverage in this area).

- **Disconfirming Conditions** — State what would change the
  classification if discovered (e.g., "If the root cause is X
  rather than Y, this is an Exact Match for pattern P-042 instead").

### 6. Catalog Update Proposals

For every Variant and New Pattern classification, propose a catalog
update:

**Variant updates** — Propose a specific annotation to the existing
catalog entry:
- A new example demonstrating the variant manifestation
- Context or type information not covered by the current entry
- A severity adjustment if the variant is more or less severe
- A fix modification if the documented fix needs adaptation

**New Pattern entries** — Propose a complete catalog entry with:
- Tag or identifier (following the catalog's naming convention)
- Description of the pattern and its root cause
- Complexity or severity rating
- Example code or diagnostic output demonstrating the pattern
- Diagnostic signature (how to recognize it)
- Resolution guidance (recommended fix)
- Standards mapping (CWE, CERT, MISRA, or other applicable standards)

Present updates as proposals, not mandates. The catalog owner decides
whether to accept them.

### 7. Summary Statistics

After classifying all findings, produce an aggregate summary:

1. **Volume**: Total unique findings (after consolidation) and total
   occurrences (before consolidation).
2. **Classification distribution**: Count and percentage of Exact
   Match, Variant, and New Pattern classifications.
3. **Pattern distribution**: For Exact Match and Variant findings,
   count of findings per catalog pattern tag.
4. **Catalog coverage**: Number of catalog patterns matched vs. total
   patterns in the catalog. Identify heavily-used and unused patterns.
5. **Confidence distribution**: Count of findings at each confidence
   level.
6. **Catalog update actions**: Number of Variant annotations proposed
   and number of New Pattern entries proposed.

Present statistics in tabular form when there are more than five
entries in any distribution.

### 8. Standards Mapping

Where applicable, map classified findings to industry standards:

- **CWE** (Common Weakness Enumeration) for software weaknesses
- **CERT** coding standards for language-specific secure coding rules
- **MISRA** rules for safety-critical C/C++ code
- **OWASP** categories for web application security findings
- **Relevant language or platform standards** (e.g., Go vet rules,
  Clippy lint categories, ESLint rule families)

Include standards mapping in both individual classifications and in
New Pattern catalog entry proposals. If no standard applies, state
"No applicable standard identified" rather than omitting the field.

## Self-Verification

Before finalizing your classification output, verify every item on
this checklist:

- [ ] Every finding is classified as Exact Match, Variant, or New
      Pattern — no unclassified items remain
- [ ] Every Exact Match cites a specific catalog section or pattern ID
- [ ] Every Variant explains what distinguishes it from the base
      pattern
- [ ] Every New Pattern lists all catalog patterns considered and
      rejected with reasons
- [ ] Findings with the same root cause, diagnostic, and fix are
      consolidated — classified once, not per-occurrence
- [ ] Confidence analysis (score, supporting evidence, weaknesses,
      disconfirming conditions) is present for each classification
- [ ] Catalog update proposals are provided for every Variant and
      New Pattern
- [ ] Summary statistics are accurate and internally consistent
      (totals add up, percentages sum to 100%)
- [ ] Standards mappings are included where applicable
