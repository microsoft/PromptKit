<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: readability-revision-report
type: format
description: >
  Output format for a readability revision. Presents the revised document, the
  prose corpus that was measured, a before/after readability scorecard, an
  accuracy attestation with any high-risk edits, and residual issues.
produces: readability-revision-report
---

# Format: Readability Revision Report

The output MUST contain the revised document plus a short, factual record of
what changed and what was measured. Keep the record concise: report the change
summary by defect category with representative examples, not a line-by-line
diff, unless the user asks for a full diff.

Present the sections in this exact order. Do not omit a section; if a section
has no content, state "None identified".

## Document Structure

```markdown
# <Document Title> — Readability Revision

## 1. Revised Document
<The full revised document, ready to use. Preserve all original structure,
headings, code blocks, tables, and identifiers; only the prose is revised.>

## 2. Measurement Scope
- **Included**: <the prose that was measured and revised>
- **Excluded**: <code, YAML, tables, identifiers, normative keywords,
  requirement IDs, citations, quoted text, and other protected tokens>
- **Audience tier**: Broad | General-technical | Expert (target: FRE ≥ <n>, FKGL ≤ <n>); basis: stated audience | document purpose | default
- **Flesch metric source**: Computed (<tool/library>) | Not measured — proxy metrics are always measured (Rule 2)

## 3. Readability Scorecard

| Metric | Before | After | Target | Status |
|--------|--------|-------|--------|--------|
| Flesch Reading Ease | <value / not measured> | <value / not measured> | ≥ <band> | Met / Not met / Not measured |
| Flesch-Kincaid Grade Level | <value / not measured> | <value / not measured> | ≤ <band> | Met / Not met / Not measured |
| Mean sentence length (words) | <n> | <n> | ≤ 20 | Met / Not met |
| Longest sentence (words) | <n> | <n> | ≤ 40 | Met / Not met |
| Sentences > 25 words | <n>% | <n>% | ≤ 15% | Met / Not met |
| Passive-voice sentences | <n>% | <n>% | ≤ 20% | Met / Not met |
| Expletive constructions | <n> | <n> | 0 | Met / Not met |
| Filler / hedge occurrences | <n> | <n> | 0 | Met / Not met |
| Undefined terms on first use | <n> | <n> | 0 | Met / Not met |

**Gate result**: PASS | REVISE

## 4. Change Summary
<Grouped by defect category, with a count and one or two representative
before -> after examples per category. Report only categories that had edits.
Format each category as:>

### <Defect category> (<count>)
- Before: "<original phrase>"
- After: "<revised phrase>"

## 5. Accuracy Attestation
<State that every protected token (normative keywords, identifiers, requirement
IDs, quantities, defined terms, citations, quoted text, and other protected
tokens) is unchanged.

**High-risk edits**: any edit a reviewer should confirm because it could carry a
meaning change. For each: the location, the before -> after text, and why it is
low risk. If none, state "None identified".>

## 6. Residual Issues
<Sentences that could not be simplified without touching a protected element or
losing precision. For each: the location, the reason it was left, and the metric
it fails. If none, state "None identified".>
```

## Formatting Rules

- Section 1 MUST contain the complete revised document, not a fragment or a
  description of the changes. A reader should be able to use it directly.
- The revision changes prose only. Headings, code blocks, tables, YAML,
  identifiers, and other protected tokens MUST appear unchanged in Section 1.
- Scorecard values MUST come from the measurement method stated in Section 2.
  Flesch is either computed (Rule 2 of readability-gate) or `not measured` —
  there is no estimated path. When Flesch is not computed, enter `not measured`
  in the Flesch rows and set their Status to "Not measured".
- The Change Summary reports categories that had edits. Do not pad it with
  categories that had none.
- Every count in the scorecard and the change summary MUST reflect the actual
  revision; do not estimate or approximate counts.
- The Accuracy Attestation and Residual Issues sections MUST be present even
  when empty, stated as "None identified".
