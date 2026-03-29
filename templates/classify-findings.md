<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: classify-findings
description: >
  Classify a set of findings against a reference catalog or taxonomy.
  Performs three-way classification (Exact Match / Variant / New Pattern)
  with explicit justification, confidence analysis, and catalog update
  proposals for every Variant and New Pattern.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/finding-classification
format: structured-findings
params:
  findings: "The findings to classify — compiler warnings, security scan results, code review comments, audit observations, or any other diagnostic output"
  catalog: "The reference catalog or taxonomy to classify against — pattern catalog, CWE list, style guide, compliance framework, etc."
  scope: "Context about the findings — what tool or process produced them, what codebase or system they came from"
  audience: "Who will use the classification results (e.g., 'development team', 'security team', 'catalog maintainers')"
input_contract: null
output_contract:
  type: structured-findings
  description: >
    A structured classification report mapping each finding to Exact Match,
    Variant, or New Pattern against the reference catalog, with justification,
    confidence analysis, and catalog update proposals.
---

# Task: Classify Findings

You are tasked with systematically classifying a set of findings against a
reference catalog or taxonomy.

## Inputs

**Findings**: {{findings}}

**Reference Catalog / Taxonomy**: {{catalog}}

**Scope**: {{scope}}

**Audience**: {{audience}}

## Instructions

1. **Review the inputs** before classifying:
   - Read the full reference catalog to understand every existing pattern,
     its diagnostic signature, examples, and associated fix.
   - Enumerate all findings to be classified.
   - Apply the anti-hallucination protocol: do NOT classify based on
     superficial similarity — read the catalog entry and finding in full.

2. **Consolidate duplicate findings** before classifying (per the
   finding-classification protocol, Rule 3):
   - Group findings that share the same diagnostic type, root cause, and fix.
   - Classify each consolidated group once; record occurrence counts.

3. **Apply the finding-classification protocol** to classify every finding
   (or consolidated group) as one of:
   - **Exact Match** — matches an existing catalog pattern; cite the entry.
   - **Variant** — matches a pattern class but differs in a meaningful way;
     explain the divergence and cite the base pattern.
   - **New Pattern** — no catalog entry covers this finding after exhaustive
     comparison; list every pattern considered and the rejection reason.

4. **Provide confidence analysis** for each classification using the
   protocol's five-point scale (Very High / High / Medium / Low / Very Low)
   with supporting evidence, potential weaknesses, and disconfirming
   conditions. Map to the format's Confidence field as follows:
   - Very High / High → **Confirmed**
   - Medium → **Likely**
   - Low → **Suspicious**
   - Very Low → **Needs Investigation**

5. **Propose catalog updates** for every Variant and New Pattern:
   - Variant: propose a specific annotation or example addition to the
     existing catalog entry.
   - New Pattern: propose a complete new catalog entry following the
     catalog's naming convention.

6. **Produce summary statistics** per the protocol (classification
   distribution, pattern distribution, confidence distribution, catalog
   coverage, and update action counts).

7. **Format the output** according to the structured-findings format
   specification. Use the Classification table's Category field to record
   the three-way classification (Exact Match / Variant / New Pattern) and
   the base pattern cited. Use the Analysis section's Root Cause field
   to record the full justification and catalog comparison reasoning.

8. **Apply the self-verification protocol** before finalizing:
   - Verify every finding is classified — no unclassified items.
   - Verify every Exact Match cites a specific catalog pattern.
   - Verify every Variant explains the divergence from the base pattern.
   - Verify every New Pattern lists all patterns considered and rejected.
   - Verify catalog update proposals are present for all Variants and
     New Patterns.
   - Verify summary statistics are internally consistent.

## Non-Goals

- Do NOT fix the findings — only classify them.
- Do NOT modify the reference catalog directly — only propose updates.
- Do NOT skip catalog patterns when checking for matches — exhaustive
  comparison is required before classifying anything as New Pattern.
- Do NOT conflate classification confidence (certainty about the catalog
  match) with finding severity (impact of the underlying issue).

## Quality Checklist

Before presenting the classification report, verify:

- [ ] All findings are classified — none are skipped or left pending
- [ ] Every Exact Match cites a specific catalog section or pattern ID
- [ ] Every Variant explains what makes it different from the base pattern
- [ ] Every New Pattern lists all catalog patterns considered and rejected
- [ ] Confidence analysis (score, evidence, weaknesses, disconfirming
      conditions) is present for each classification
- [ ] Catalog update proposals exist for every Variant and New Pattern
- [ ] Summary statistics are complete and internally consistent
- [ ] Duplicate findings are consolidated before classification
