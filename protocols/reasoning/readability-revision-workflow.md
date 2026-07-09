<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: readability-revision-workflow
type: reasoning
description: >
  Corrective methodology for revising an existing technical document into clear,
  readable prose. Measures a bounded prose corpus, diagnoses named clarity
  defects, revises with the Paramedic Method and plain-language rules,
  re-measures, and verifies that no technical meaning changed.
applicable_to:
  - revise-for-readability
---

# Protocol: Readability Revision Workflow

Apply this protocol when the task is to revise an existing document so it reads
clearly, without changing what it means. Execute the phases in order. The
methodology shares its prose boundary and acceptance check with the
`readability-gate` guardrail; this protocol carries the diagnosis and revision
work that the gate does not.

The goal is prose a reader understands on the first pass: short sentences, a
visible actor and action, defined terms, and no filler. The constraint is exact
preservation of technical meaning.

## Phase 1: Establish Target and Corpus

1. **Set the target from the reader.** Select the tier with the
   `readability-gate` tier-selection ladder (Rule 3): use a stated audience if
   given; otherwise infer the tier from the document's purpose (genre cues, not
   the draft's current complexity); otherwise default to general-technical.
   Record the tier and the signal that chose it. The proxy thresholds apply
   regardless of tier; the tier sets only the Flesch band.
2. **Bound the corpus.** Apply the readability corpus boundary from the
   `readability-gate` protocol (Rule 1), which is the operative exclusion set.
   Measure and revise only human-facing prose; leave everything Rule 1 excludes
   unchanged — for example code, data, markup, URLs and file paths, logs and
   error strings, diagrams, tables, quoted text, normative keywords,
   identifiers, requirement IDs, and defined terms.
3. **Record scope.** Note what you will measure and what you will exclude, for
   the report's measurement-scope section.

## Phase 2: Baseline Measurement

1. **Measure the corpus.** Follow the `readability-gate` measurement rules
   (Rule 2): when a code-execution tool is available, compute the Flesch scores
   with a script (the gate gives a standard-library syllable heuristic);
   otherwise report Flesch as `not measured` and gate on the countable proxies.
   Record every value as the "before" column of the scorecard.
2. **Profile sentence length.** Record mean sentence length, longest sentence
   length, and the share of sentences longer than 25 words.
3. **Rank the worst offenders.** List the specific sentences and paragraphs that
   score worst — longest, densest, most passive. These are the primary revision
   targets.

## Phase 3: Defect Diagnosis

Scan the corpus for each defect below. For each occurrence, record the location
and the defect name; these drive Phase 4 and the report's change summary.

1. **Filler and throat-clearing**: words and openers that add no information
   ("actually", "basically", "very", "just", "in order to", "it should be noted
   that", "it is important to note").
2. **Nominalization (zombie noun)**: an action hidden in a noun ("perform an
   analysis" for "analyze", "make a decision" for "decide", "the implementation
   of X" for "implementing X").
3. **Passive-voice overuse**: the actor is missing or trails the action ("the
   file was written by the service").
4. **Expletive construction**: a sentence opened with "there is", "there are",
   or "it is ... that", which buries the real subject.
5. **Buried subject or action**: the doer and the verb are separated by long
   qualifying clauses, or the main clause sits at the end of the sentence.
6. **Redundant pair or tautology**: two words for one idea ("each and every",
   "end result", "close proximity").
7. **Undefined jargon or unexpanded acronym**: a specialist term or acronym used
   on first mention without a definition, where the audience needs one.
8. **Overlong sentence**: more than 25 words, or more than one independent idea
   joined by "and", "but", or a semicolon.
9. **Monotonous rhythm**: many consecutive sentences of nearly the same length
   and structure, which reads as a drone.
10. **Hedge stacking**: piled qualifiers that drain the statement ("it may
    possibly be the case that this could perhaps..."), beyond any uncertainty
    disclosure a protocol requires.

## Phase 4: Targeted Revision

Revise the diagnosed prose. Apply the Paramedic Method to each overlong or
passive sentence, then the plain-language rules.

Paramedic Method, per sentence:

1. Mark the prepositional phrases and the "to be" verbs.
2. Find the real action and the real actor.
3. Rewrite with the actor as the subject and the action as a strong verb.
4. Cut what the rewrite made redundant.

Plain-language rules:

1. One idea per sentence. Split a sentence that carries more than one.
2. Front-load the point. State the conclusion or action first, then the detail.
3. Prefer the plain word ("use" over "utilize", "help" over "assist").
4. Define a needed term or expand an acronym on first use, but only by restating
   meaning already present in or established by the document. If a correct
   definition would introduce information not derivable from the source, do not
   invent it — record the undefined term as a residual issue instead.
5. Vary sentence length so the rhythm is not a drone.
6. Keep terminology consistent — one term per concept, not a rotation of
   synonyms.

Accuracy lock — never change, only edit prose around the protected tokens
defined by the readability-gate corpus boundary (Rule 1). That boundary is
authoritative; the list below restates it and is not exhaustive:

- Normative keywords (MUST, SHALL, SHOULD, MAY, REQUIRED, OPTIONAL, and their
  negations).
- Code identifiers, API signatures, enum values, config keys, and CLI flags.
- Numbers, units, and quantities.
- Requirement IDs, section anchors and headings referenced elsewhere, and
  defined terms.
- Citations, references, and error strings.
- Quoted text and examples meant to be exact.
- Epistemic labels, assumptions, limitations, and uncertainty disclosures
  required by another protocol (compress redundant phrasing only).

When a sentence cannot be simplified without touching a protected element or
losing precision, leave it and record it as a residual issue.

## Phase 5: Re-Measurement and Acceptance

1. **Re-measure** the revised corpus with the same method as Phase 2. Record the
   "after" column of the scorecard.
2. **Require net improvement.** The revised corpus must improve against the
   baseline on the proxy thresholds and, when computed, move toward the target
   band. If a metric did not improve, explain why.
3. **Apply the gate.** Run the `readability-gate` pass criteria (Rule 3) as the
   acceptance check. The revision is accepted when the gate passes or when every
   remaining failure is a justified, precision-preserving residual issue.

## Phase 6: Accuracy Verification

1. **Diff the meaning.** Compare the revised prose against the original clause by
   clause. Confirm no claim, condition, quantity, or normative force changed.
2. **Confirm protected elements.** Verify that every protected token from the
   accuracy lock appears unchanged in the revision.
3. **Surface high-risk edits.** List any edit that a reviewer should confirm
   because it could carry a meaning change, even if you judge it safe. If none,
   state "None identified".
