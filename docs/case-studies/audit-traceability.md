# Case Study: Auditing Specification Drift with PromptKit

## The Problem

A team has written three specification documents for an authentication
service: a requirements document, a design document, and a validation
plan. The documents were authored at different times — requirements first,
then design a week later, then the validation plan two weeks after that.
During that time, the design introduced a session token refresh mechanism
that wasn't in the original requirements, and the validation plan was
written primarily from the design document rather than the requirements.

Without PromptKit, a project lead reviews the three documents manually,
skimming for obvious gaps. They notice a few things seem off but can't
systematically identify every inconsistency. They sign off, and the team
starts implementation. Three sprints later, QA discovers that two
security requirements have no test cases, the session refresh feature was
never formally required, and a performance constraint in the requirements
is directly contradicted by the design's synchronous API call chain.

## The PromptKit Approach

### Assembling the Prompt

```bash
npx promptkit assemble audit-traceability \
  -p project_name="Auth Service v2" \
  -p requirements_doc="$(cat auth-requirements.md)" \
  -p design_doc="$(cat auth-design.md)" \
  -p validation_plan="$(cat auth-validation.md)" \
  -p focus_areas="all" \
  -p audience="engineering leads and QA" \
  -o auth-traceability-audit.md
```

### What Gets Assembled

The prompt composes four layers:

**1. Identity — Specification Analyst Persona**

The LLM adopts the identity of a senior specification analyst —
adversarial toward completeness claims, systematic rather than
impressionistic. Behavioral constraints include "treat every coverage
claim as unproven until traced" and "work by enumerating identifiers
and building matrices, not by skimming."

**2. Reasoning Protocols**

Three protocols are loaded:

- **Anti-hallucination** — the LLM cannot invent requirements or test
  cases that aren't in the documents. Every finding must cite specific
  identifiers and locations. If the LLM infers a gap, it must label the
  inference.
- **Self-verification** — before finalizing, the LLM verifies every
  REQ-ID appears in at least one finding or is confirmed as traced, and
  all coverage metrics are calculated from actual counts.
- **Traceability audit** — the 6-phase methodology:
  1. Artifact inventory (extract all IDs from each document)
  2. Forward traceability (requirements → design, requirements → validation)
  3. Backward traceability (design → requirements, validation → requirements)
  4. Cross-document consistency (assumptions, constraints, terminology)
  5. Classification using the specification-drift taxonomy (D1–D7)
  6. Coverage summary with aggregate metrics

**3. Classification Taxonomy — Specification Drift**

The D1–D7 taxonomy gives the LLM a precise vocabulary:

| Label | Meaning |
|-------|---------|
| D1 | Requirement not traced to design |
| D2 | Requirement not traced to test case |
| D3 | Design decision with no originating requirement |
| D4 | Test case with no linked requirement |
| D5 | Assumption conflict across documents |
| D6 | Design violates a stated constraint |
| D7 | Test case doesn't verify its linked requirement's acceptance criteria |

**4. Output Format — Investigation Report**

Findings are structured as F-NNN entries with severity, evidence,
location, and remediation — the same format used for bug investigations
and security audits.

## The Difference

### Without PromptKit (manual review)

A project lead reads through three documents, comparing them by memory.
They might catch obvious gaps — a section title that doesn't match, a
requirement they remember but can't find a test for. But they miss:

- The two security requirements (REQ-SEC-003, REQ-SEC-007) buried in a
  subsection with no test cases
- The session refresh feature that appeared in the design but was never
  formally required
- The performance constraint (200ms response time) that the design's
  synchronous multi-service call chain can't satisfy
- Three test cases referencing REQ-IDs that were renumbered in a
  requirements revision

### With PromptKit (composed audit)

The LLM produces a structured investigation report:

**Findings:**

- **F-001 (Critical) [D6]:** Constraint violation. REQ-PERF-001 requires
  200ms response time. The design (section 5.3) specifies a synchronous
  call chain: auth service → user store → token service → session cache.
  At p95 latency, this chain exceeds 400ms. The design does not include
  caching or async strategies to meet the constraint.

- **F-002 (High) [D2]:** Untested requirement. REQ-SEC-003 (encryption
  at rest for session tokens) does not appear in the traceability matrix.
  No test case references this REQ-ID. The validation plan's security
  section covers authentication but not token storage encryption.

- **F-003 (High) [D2]:** Untested requirement. REQ-SEC-007 (token
  revocation within 30 seconds) has no corresponding test case. The
  validation plan tests token expiry but not revocation timing.

- **F-004 (High) [D7]:** Acceptance criteria mismatch. TC-042 is linked
  to REQ-AUTH-002 (multi-factor authentication). The test case verifies
  that MFA is prompted but does not verify the acceptance criterion
  "MUST reject single-factor authentication for admin roles."

- **F-005 (Medium) [D3]:** Orphaned design decision. The session token
  refresh mechanism (design section 4.7) is not traced to any
  requirement. This may be scope creep, or the requirements document is
  missing a requirement for session continuity.

- **F-006 (Medium) [D5]:** Assumption drift. The design assumes a
  maximum of 10,000 concurrent sessions (section 6.1). The requirements
  document specifies 50,000 concurrent users (REQ-PERF-003) with no
  stated session-to-user ratio.

- **F-007 (Low) [D4]:** Orphaned test cases. TC-018, TC-019, and TC-020
  reference REQ-AUTH-010, REQ-AUTH-011, and REQ-AUTH-012 — none of which
  exist in the current requirements document. These REQ-IDs appear to be
  from a prior numbering scheme.

**Coverage Summary:**

| Metric | Value |
|--------|-------|
| Forward traceability (reqs → design) | 94% (2 of 32 untraced) |
| Forward traceability (reqs → validation) | 88% (4 of 32 untested) |
| Backward traceability (design → reqs) | 96% (1 of 24 orphaned) |
| Backward traceability (validation → reqs) | 95% (3 of 58 orphaned) |
| Assumption consistency | 1 conflict, 2 unstated |

## Why It Works

1. **The persona** sets the right mindset. The specification analyst
   doesn't skim and approve — it systematically enumerates every ID and
   checks every cell in the traceability matrix. The adversarial stance
   means it actively looks for what's missing.

2. **The traceability audit protocol** prevents shortcuts. The 6-phase
   structure forces the LLM to build a complete inventory before drawing
   conclusions. Forward AND backward traceability catches both missing
   coverage and scope creep.

3. **The specification-drift taxonomy** produces precise, actionable
   findings. "D6: constraint violation" is more useful than "the design
   might not meet performance requirements." The taxonomy also ranks
   findings — D6 and D7 (active conflicts and illusory coverage) surface
   before D4 (orphaned test cases).

4. **Anti-hallucination** is critical here. Without it, the LLM might
   invent a connection between a requirement and a design section because
   they use similar words. The protocol forces the LLM to verify actual
   ID references, not keyword proximity.

## Takeaways

- **Documents drift silently.** The three-week gap between authoring
  requirements and validation was enough for scope creep, renumbered
  IDs, and contradicted constraints to accumulate.
- **Manual review misses systematic gaps.** A human reviewer catches
  "this doesn't look right" but not "REQ-SEC-003 has zero test cases."
  The traceability matrix approach is exhaustive where skimming is not.
- **The design document is optional.** If the team only has requirements
  and a validation plan, the audit still works — it restricts to
  requirements ↔ validation traceability. This is useful earlier in the
  lifecycle, before a design document exists.
- **Findings are actionable.** Each F-NNN has a specific resolution:
  add a test case, add a requirement, fix a constraint violation, or
  resolve an assumption conflict. The team can assign findings directly
  to owners.
