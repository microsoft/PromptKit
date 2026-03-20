# PromptKit Scenarios

Real-world situations where PromptKit turns a vague ask into a
structured, repeatable result. Each scenario shows the problem,
which components PromptKit assembles, and what you get.

For full walkthroughs, see [case studies](case-studies/).

---

## Existing Templates

### "We keep finding bugs that the tests should have caught"

Your validation plan says it covers all requirements, but two critical
security requirements have zero test cases and a third has a test that
checks the wrong thing. Nobody noticed because the traceability matrix
was built from memory, not verified.

**Template:** `audit-traceability` · **Persona:** `specification-analyst` ·
**Protocol:** `traceability-audit` · **Taxonomy:** `specification-drift` (D1–D7)

**What you get:** An investigation report listing every requirement with
no test case (D2), every test case that doesn't actually verify its
linked acceptance criteria (D7), and coverage metrics showing exactly
where the validation plan has gaps.

### "This crash only happens under load"

A segfault in your C networking code appears at 100+ concurrent
connections but never in unit tests. The stack trace points to
`parse_header()` but the real problem is somewhere else.

**Template:** `investigate-bug` · **Persona:** `systems-engineer` ·
**Protocols:** `root-cause-analysis` + `memory-safety-c`

**What you get:** A structured investigation report with ≥3 hypotheses
ranked by plausibility, evidence-based elimination, and a root-vs-proximate
cause distinction that prevents shallow fixes. The memory-safety protocol
catches lifetime issues the root cause analysis alone might miss.

### "We need a requirements doc but the scope is fuzzy"

The product manager gave you a half-page description of a new
authentication system. You need a real requirements document with
numbered REQ-IDs, acceptance criteria, and enough precision to hand
off to a design phase.

**Template:** `interactive-design` · **Persona:** configurable ·
**Protocols:** `requirements-elicitation` + `iterative-refinement`

**What you get:** An interactive session that challenges your assumptions,
asks for quantified constraints ("what does 'fast' mean?"), identifies
implicit requirements you hadn't considered, and produces a structured
requirements document with stable identifiers.

### "The design doesn't match what we agreed on"

You wrote a requirements document last month. Now the design document
is done, but you suspect it drifted — new features crept in, a
performance constraint might be violated, and some requirements seem
to have been quietly dropped.

**Template:** `audit-traceability` (without the validation plan) ·
**Taxonomy:** `specification-drift`

**What you get:** A two-document audit identifying orphaned design
decisions (D3), untraced requirements (D1), assumption drift (D5),
and constraint violations (D6). Each finding has specific document
locations and a recommended resolution.

### "Review this PR for memory safety"

A teammate submitted a C PR that touches buffer management code. You
want a thorough review that goes beyond style and catches real safety
issues.

**Template:** `review-code` · **Persona:** `systems-engineer` ·
**Protocols:** `memory-safety-c` + `thread-safety`

**What you get:** An investigation report with severity-classified
findings covering allocation/deallocation pairing, pointer lifetime,
buffer boundaries, data races, and undefined behavior. Each finding
includes the code location, evidence, and a specific fix.

### "We inherited a codebase with no documentation"

A legacy C library has no spec, no design doc, and sparse comments.
You need to understand what it actually guarantees to its callers
before you can safely modify it.

**Template:** `reverse-engineer-requirements` · **Persona:** `reverse-engineer` ·
**Protocol:** `requirements-from-implementation`

**What you get:** A structured requirements document extracted from the
code — API contracts, behavioral guarantees, error handling semantics,
and invariants — with each requirement labeled as KNOWN (directly
evidenced) or INFERRED (reasonable conclusion from patterns).

### "Set up CI/CD for a new project"

You need a GitHub Actions pipeline for a Python web app: lint, test,
build a Docker image, deploy to staging on PR merge, and deploy to
production on release tags.

**Template:** `author-pipeline` · **Persona:** `devops-engineer` ·
**Protocol:** `devops-platform-analysis`

**What you get:** Production-ready YAML with design rationale, secret
and variable requirements, and a customization guide. Secure by default —
pinned action versions, least-privilege permissions, environment
protection rules.

### "I want Copilot to always apply memory safety checks to C files"

Instead of assembling a one-off prompt, you want the memory-safety
analysis baked into every Copilot session that touches C code in your
project.

**Template:** `author-agent-instructions` · **Format:** `agent-instructions`

**What you get:** A `.github/instructions/memory-safety-c.instructions.md`
file with `applyTo: "**/*.c, **/*.h"` that loads automatically in every
Copilot session touching C files. The systems-engineer persona and
memory-safety protocol become standing instructions.

### "We have 47 open issues and no idea what to work on first"

Your backlog has grown unwieldy. Some issues are duplicates, some are
stale, and the critical ones are buried under feature requests.

**Template:** `triage-issues` · **Persona:** `devops-engineer`

**What you get:** A prioritized triage report classifying every issue by
priority and effort, identifying patterns and duplicates, and
recommending a workflow for the next sprint.

---

## Future Scenarios (Roadmap)

These scenarios describe capabilities that are planned but not yet
implemented. See the [roadmap](roadmap.md) for details.

### "Does the code actually implement what the spec says?"

You have a requirements document and a design document. The code has
been written. But does it actually implement the specified behavior?
Are there requirements with no implementation? Features in the code
that nobody asked for?

**Planned template:** `audit-code-compliance` ·
**Taxonomy:** `specification-drift` (D8–D10)

**What you'd get:** An investigation report listing unimplemented
requirements, code behavior not traced to any requirement, and
mismatched assumptions between the spec and the implementation.

### "Do our tests actually test what the plan says they should?"

Your validation plan specifies 58 test cases. Your test suite has
tests. But are they the same tests? Do the assertions match the
acceptance criteria?

**Planned template:** `audit-test-compliance` ·
**Taxonomy:** `specification-drift` (D11–D13)

**What you'd get:** A report mapping validation plan test cases to
actual test implementations, identifying unimplemented test cases,
tests with wrong assertions, and coverage gaps between the plan and
reality.

### "Extract the invariants from this RFC"

You're implementing RFC 9110 (HTTP Semantics). You need to know every
MUST, SHOULD, and MAY — plus the state transitions, error conditions,
and timing constraints — as structured, testable requirements.

**Planned template:** Invariant extraction ·
**Planned persona:** `standards-analyst`

**What you'd get:** A structured requirements document derived from the
RFC, with each normative statement extracted, classified by keyword
(MUST/SHOULD/MAY), and linked to the originating RFC section.

### "Does our implementation match the RFC?"

You've implemented a protocol. The RFC has been updated. Has your
implementation drifted? Are there MUST requirements you're violating?
Behaviors you implement that the RFC forbids?

**Planned template:** RFC ↔ implementation audit

**What you'd get:** A drift report between the RFC's normative
requirements and your implementation's actual behavior, with
security-sensitive mismatches flagged first.
