# Case Study: Self-Auditing the PromptKit Library

## The Problem

PromptKit is a composable prompt library that grows organically — each
new use case adds a template, sometimes with supporting protocols,
formats, or taxonomies. After 180+ pull requests and 167 component
files across 7 directories, several questions arise:

- Are there protocols that duplicate each other's methodology?
- Are there templates that are near-copies with only a single protocol
  swapped?
- Did any externally-derived content slip in without proper attribution?
- Are coverage documentation formats consistent across guardrails?
- Is there a global severity standard, or does every protocol invent
  its own scale?

Without a systematic audit, these questions get answered by accident —
someone notices an inconsistency during a PR review, or a contributor
wonders "didn't we already have a protocol for this?"

## The PromptKit Approach

### Running the Audit

```bash
cd promptkit
copilot
# "Run audit-library-health against this repo, focus on consistency
#  and corpus safety"
```

The `audit-library-health` template is interactive — it executes
directly in the session rather than producing a file. The agent reads
`manifest.yaml` and all 167 component files, then runs two passes with
human gating between them.

### What Gets Assembled

The template composes four layers:

**1. Identity — Specification Analyst Persona**

The LLM adopts the identity of a senior specification analyst —
adversarial toward completeness claims, systematic rather than
impressionistic. This is the same persona used for traceability audits
and code compliance audits.

**2. Reasoning Protocols**

Four protocols are loaded:

- **Anti-hallucination** — every finding must cite specific files and
  evidence. The LLM cannot fabricate protocol overlap that doesn't
  exist or invent provenance concerns without stylistic evidence.
- **Self-verification** — before finalizing, the LLM verifies every
  component was analyzed and every finding has a concrete remediation.
- **Operational-constraints** — scopes the audit to provided files,
  prevents over-ingestion, and requires documenting what was excluded.
- **Corpus-safety-audit** — the 4-phase methodology for provenance
  scanning, verbatim content detection, confidentiality screening, and
  license compliance.

**3. Output Format — Investigation Report**

Findings are structured as F-NNN entries with severity, category,
evidence, and remediation — the same format used for bug investigations
and security audits.

### Pass 1: Structural Consistency

Three parallel agents analyzed the library:

**Protocol overlap detection** examined 56 protocols pairwise:
- Extracted phase summaries for each protocol
- Compared for duplicated phases, implicit dependencies, and subset
  relationships
- Scanned for terminology drift

**Template similarity analysis** examined 67 templates:
- Compared frontmatter (persona + format + protocols) for near-duplicates
- Verified cross-reference integrity (every referenced component exists)
- Checked format redundancy

**Results presented to user before proceeding to Pass 2.**

### Pass 2: Corpus Safety

A single agent scanned all 167 files:
- Checked every file for SPDX headers and copyright attribution
- Searched for provenance markers ("derived from", "inspired by")
- Scanned for verbatim copying signals (vendor-specific terms, model
  names, prompt injection patterns)
- Screened for confidential content (internal URLs, employee names,
  customer identifiers)
- Verified license compliance

## The Findings

### What the Audit Caught

**11 findings total**: 0 Critical, 2 High, 5 Medium, 3 Low,
3 Informational.

**High-severity — Template consolidation opportunities:**

- **F-001**: Nine `specification-analyst` + `investigation-report` audit
  templates share identical scaffolding. They differ only in the final
  domain-specific protocol (`traceability-audit` vs. `code-compliance-audit`
  vs. `corpus-safety-audit`, etc.). This is the single largest
  consolidation opportunity in the library.

- **F-002**: Four electrical/mechanical review templates (`review-schematic`,
  `review-bom`, `review-layout`, `review-enclosure`) follow the same
  pattern — same structure, different analysis protocol.

**Medium-severity — Missing cross-references and terminology drift:**

- **F-003**: `self-verification` and `anti-hallucination` both define the
  KNOWN/INFERRED/ASSUMED epistemic categories, but neither referenced the
  other as the source of truth.

- **F-004**: `cpp-best-practices` extends `memory-safety-c` and
  `thread-safety`, and `kernel-correctness` specializes `thread-safety`,
  but none documented these relationships.

- **F-005**: Two guardrail protocols used different field names for
  coverage documentation (Examined/Method/Excluded/Limitations vs.
  source documents/areas examined/topics excluded).

- **F-006**: No global severity taxonomy — each protocol defined its own
  scale (some included Informational, some didn't).

**Corpus safety — Clean bill of health:**

- **F-008**: All 167 files classified as Verified Original. Zero verbatim
  copying. Zero confidentiality leaks. MIT SPDX headers on every file.
  Full license compliance.

### What Got Fixed

Six findings (all None/Low risk) were fixed immediately in PR #186:

| Finding | Fix |
|---------|-----|
| F-003 | Added cross-reference from `self-verification` to `anti-hallucination` |
| F-004 | Added Cross-References sections to `cpp-best-practices` and `kernel-correctness` |
| F-005 | Standardized coverage format to Examined/Method/Excluded/Limitations |
| F-006 | Defined global severity taxonomy in CONTRIBUTING.md |
| F-007 | Aligned `kernel-correctness` output format to markdown heading style |
| F-009 | Added explicit taxonomy reference in `code-compliance-audit` |

Two findings (F-001 and F-002) remain open — they require a design
decision about whether template consolidation is worth the
discoverability tradeoff.

## Why It Works

1. **The three-pass structure** separates concerns. Structural
   consistency, corpus safety, and runtime fitness are independent
   dimensions. Running them as separate passes with human gating
   prevents the audit from becoming an unfocused sweep.

2. **The corpus-safety-audit protocol** is particularly valuable after
   running `decompose-prompt` workflows. When external prompts are
   assimilated, the 4-phase methodology systematically checks that
   nothing was copied verbatim, nothing confidential leaked in, and
   attribution is complete.

3. **Interactive mode with human gating** lets the user steer. After
   seeing Pass 1 findings, the user can decide whether to proceed with
   Pass 2 or focus on fixing structural issues first. This avoids
   generating a 50-page report that no one reads.

4. **Parallel exploration** makes the audit practical. Three agents
   analyzed 167 files simultaneously — protocols, templates, and corpus
   safety in parallel — completing in about 6 minutes total.

5. **Evidence-based findings** prevent false positives. Every finding
   cites specific files, line ranges, and the exact text that triggered
   the detection. The anti-hallucination protocol ensures the LLM
   doesn't invent overlap that doesn't exist.

## Takeaways

- **Libraries drift just like specifications.** 167 files authored over
  months by multiple contributors will accumulate inconsistencies,
  undocumented dependencies, and missed consolidation opportunities.
  Periodic audits catch these before they compound.

- **Corpus safety matters when you ingest external content.** The
  `decompose-prompt` workflow makes it easy to assimilate external
  prompts into PromptKit. The `audit-library-health` template is the
  complementary hygiene check — run it after assimilation to verify
  provenance, licensing, and no verbatim copying.

- **Small fixes compound.** The six safe optimizations in PR #186 are
  individually trivial (add a cross-reference, standardize a term),
  but together they make the library measurably more consistent. A new
  contributor reading `kernel-correctness` now immediately sees that
  it specializes `thread-safety` — context that was previously tribal
  knowledge.

- **Some findings are design decisions, not bugs.** The template
  consolidation question (F-001, F-002) is genuinely a tradeoff —
  fewer files to maintain vs. easier discovery of specific audit
  workflows. The audit surfaces the decision; humans make the call.
