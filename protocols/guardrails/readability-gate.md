<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: readability-gate
type: guardrail
description: >
  Lightweight final-pass check that verifies human-facing prose is clear and
  readable before an artifact is finalized. Scores a bounded prose corpus,
  applies reliably-countable proxy thresholds, and preserves technical
  meaning, required labels, and format scaffolding.
applicable_to:
  - revise-for-readability
---

# Protocol: Readability Gate

This protocol is a final-pass quality gate for the human-facing prose in an
artifact. Apply it after the prose is written but before the artifact is
finalized. The gate checks readability against measurable criteria and either
passes the prose or lists specific, bounded revisions. It never rewrites code,
data, or required scaffolding, and it never changes technical meaning.

The gate is deliberately lightweight. It does not require a full report. In a
template that produces a readability report, the measured values feed that
report's scorecard; in any other template, the gate reports a single
internal-facing result line.

## When to Apply

Run the gate once the human-facing prose exists and before you present the
artifact as final. When composed with a document-authoring template, run it as
the last step, after the document's own format is satisfied.

## Rule 1: Readability Corpus Boundary

Measure and revise only natural-language prose written for a human reader.
Establish the corpus before measuring.

Include:

- Prose paragraphs.
- Explanatory list-item prose (full sentences in a bullet or step).
- Table-cell text that is natural-language prose, measured as its own
  sentences.

Exclude from both measurement and rewriting (leave exactly as written):

- YAML frontmatter, SPDX and license headers, and other required boilerplate.
- Fenced code blocks and inline code identifiers, API names, and signatures.
- Command output, logs, stack traces, and error strings.
- URLs, file paths, citations, and reference markers.
- Table and list markup (the structure itself, as distinct from prose text).
- Diagrams and their source (for example, Mermaid or ASCII art).
- Quoted source material or third-party text.
- Normative keywords: MUST, MUST NOT, SHALL, SHALL NOT, SHOULD, SHOULD NOT,
  MAY, REQUIRED, OPTIONAL.
- Defined terms, requirement IDs, section anchors and headings referenced
  elsewhere, enum values, config keys, CLI flags, and numeric quantities with
  their units.

State the measured corpus in the output (see Output): what was included and
what was excluded.

## Rule 2: Measurement

Measure the corpus and state, for every number, how it was produced.

1. **Compute with a script whenever a code-execution tool is available.** This
   prompt commonly runs inside an agentic tool that can run code (Copilot CLI,
   Claude Code, Codex, and similar). In that case compute Flesch Reading Ease
   and Flesch-Kincaid Grade Level with a short script rather than by estimation.
   Prefer `textstat` when it can be imported; otherwise compute directly from
   the formulas:
   - Flesch Reading Ease = 206.835 − 1.015 × (words ÷ sentences) − 84.6 ×
     (syllables ÷ words).
   - Flesch-Kincaid Grade Level = 0.39 × (words ÷ sentences) + 11.8 ×
     (syllables ÷ words) − 15.59.
   Count syllables deterministically so the score is reproducible. This
   standard-library heuristic is adequate for banding; apply it per word:
   - Lowercase the word and keep letters only.
   - Count each run of consecutive vowels (a, e, i, o, u, y) as one syllable.
   - Subtract one for a silent trailing "e".
   - Return at least one syllable.
   Only script-computed scores may certify pass/fail against a target band.

2. **Proxy checks — always run these.** The proxies are the primary gate. They
   need no tooling and rely on pattern detection and per-sentence counting,
   which are reproducible without code. Count, over the corpus:
   - Mean sentence length (words per sentence).
   - Longest sentence length (words).
   - Share of sentences longer than 25 words.
   - Passive-voice sentences.
   - Expletive constructions ("there is", "there are", "it is ... that").
   - Filler and hedge occurrences (for example: "actually", "basically",
     "really", "very", "just", "in order to", "kind of", "sort of", "it should
     be noted that", "reasonable enough").
   - Undefined jargon terms or unexpanded acronyms on first use.

3. **With no code environment, do not estimate Flesch.** When no code-execution
   tool is available, report the Flesch scores as `not measured` and gate on the
   proxies alone. An LLM cannot count syllables — or whole-document words —
   reliably, so an eyeballed Flesch score is imprecise and non-reproducible. It
   may inform revision but MUST NOT certify compliance.

## Rule 3: Pass Criteria

### Target band by audience

Select the tier in this order, and stop at the first that applies:

1. **Stated audience.** Use the invoking template's audience parameter, or an
   audience the document declares (for example an "Audience" or "Intended
   readers" line). Classify it into the nearest tier below.
2. **Document purpose.** Otherwise infer the tier from the document's purpose,
   using the genre cues below — its title, section headings, and framing.
3. **Default.** If neither signal is present, use the general-technical tier.

Infer the tier only from signals of intended audience and purpose. Do NOT infer
it from the draft's sentence length, jargon density, or reading difficulty:
those are the defects this gate removes, and keying the target to them would
relax the target for exactly the prose that needs the most work.

| Tier | Example audiences | Genre cues | Flesch Reading Ease | Flesch-Kincaid Grade Level |
|------|-------------------|-----------|---------------------|----------------------|
| Broad | non-specialists, new hires, external users, mixed readers | README, getting-started, tutorial, user guide, overview, FAQ, onboarding, prerequisites | ≥ 60 | ≤ 10 |
| General-technical (default) | practicing engineers, general technical readers | requirements, design doc, architecture spec, interface contract, runbook, engineering proposal | ≥ 50 | ≤ 12 |
| Expert | domain specialists, deep subject-matter experts | RFC, formal spec, protocol internals, kernel/driver/firmware/crypto internals, proofs | ≥ 40 | ≤ 14 |

Record the selected tier and the signal that chose it (stated audience, document
purpose, or default) in the output.

The Flesch band applies only to computed scores (Rule 2). For the expert tier the
proxy checks carry the gate; the Flesch band is a loose floor there, because
unavoidable domain vocabulary depresses the score regardless of clarity.

### Proxy thresholds (audience-independent, always apply)

- Mean sentence length ≤ 20 words.
- No sentence longer than 40 words.
- At most 15% of sentences longer than 25 words.
- Passive voice in at most 20% of sentences.
- Zero unflagged expletive constructions, filler occurrences, or undefined terms
  on first use.

The gate passes when the proxy thresholds hold and, if computed scores are
available, the tier's Flesch band is met. For the Expert tier the proxy
thresholds are authoritative: report the Flesch scores, but a missed Flesch band
does not by itself fail the gate — record it as a residual issue instead. Where a
proxy threshold cannot be met without losing precision (for example, a sentence
that must name several protected terms), the gate passes only if that sentence is
listed as a justified residual issue with the reason it cannot be shortened.

## Rule 4: Accuracy and Precedence Carve-Outs

Readability never overrides correctness. Apply these carve-outs in order:

1. **Protected tokens**: never alter the excluded tokens in Rule 1 (normative
   keywords, identifiers, IDs, defined terms, quantities). Edit the surrounding
   prose only.
2. **Anti-hallucination precedence**: keep every epistemic label
   (`[KNOWN]`, `[INFERRED]`, `[ASSUMPTION]`, `[UNKNOWN]`), citation, assumption,
   limitation, and uncertainty disclosure that the `anti-hallucination`
   protocol requires. You may compress redundant uncertainty phrasing; you may
   not remove required disclosure. If readability and required disclosure
   conflict, keep the disclosure and record a residual issue.
3. **Human-voice-fidelity precedence**: when `human-voice-fidelity` is also
   active, you may remove ambiguity, filler, or hard-to-parse phrasing, but you
   MUST preserve the user's observed register, sentence cadence, and
   characteristic phrasing unless those directly impair correctness or clarity.
4. **Minimal change**: make the smallest edit that clears the threshold. Do not
   restructure sections, reorder content, or change formatting beyond the prose.

## Rule 5: Scope Boundary

The gate checks only prose that the current task generated or was explicitly
asked to revise. It does not modify quoted third-party text, code, logs, format
scaffolding (headings, tables, checklists defined by the output format), or any
excluded token from Rule 1.

## Output

Report a single internal-facing result line (or short block), not a full
document:

```
Readability gate: PASS | REVISE
Measured corpus: <what was included; what was excluded>
Metrics: FRE <value|not measured>, FKGL <value|not measured>,
  mean sentence <n>w, max <n>w, >25w <n>%, passive <n>%,
  expletives <n>, filler <n>, undefined terms <n>
Residual issues: <count, or "None">
```

Report this block as chat or meta output to the user only. Do NOT inject the
block verbatim into the produced artifact — not even into an artifact's own
change-summary or scorecard section. A consuming format MAY populate its own
existing fields (for example a scorecard row) from these metrics; that is not
injecting the block, and it keeps consuming formats unchanged and avoids format
drift.

## Composability

This gate is safe to add to a document-authoring template's `protocols:` list.
It performs only a final-pass prose check with the corpus boundary and carve-outs
above, so it preserves the task's own format and semantics. Wiring it into
existing authoring templates is a separate change from introducing the gate.
