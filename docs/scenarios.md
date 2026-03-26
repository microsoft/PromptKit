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
and validation plan are done, but you suspect they drifted — new
features crept in, a performance constraint might be violated, and some
requirements seem to have been quietly dropped.

**Template:** `audit-traceability` · **Persona:** `specification-analyst` ·
**Taxonomy:** `specification-drift` (D1–D7)

**What you get:** A three-document audit identifying untraced
requirements (D1), untested requirements (D2), orphaned design
decisions (D3), orphaned test cases (D4), assumption drift (D5),
constraint violations (D6), and acceptance criteria mismatches (D7).
Each finding has specific document locations and a recommended
resolution.

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

### "Does the code actually implement what the spec says?"

You have a requirements document and a design document. The code has
been written. But does it actually implement the specified behavior?
Are there requirements with no implementation? Features in the code
that nobody asked for?

**Template:** `audit-code-compliance` · **Persona:** `specification-analyst` ·
**Protocol:** `code-compliance-audit` · **Taxonomy:** `specification-drift` (D8–D10)

**What you get:** An investigation report listing unimplemented
requirements (D8), code behavior not traced to any requirement (D9),
and constraint violations in the implementation (D10), with
implementation coverage metrics and specific code locations.

### "Do our tests actually test what the plan says they should?"

Your validation plan specifies 58 test cases. Your test suite has
tests. But are they the same tests? Do the assertions match the
acceptance criteria? Are there test cases in the plan that have no
automated test at all?

**Template:** `audit-test-compliance` · **Persona:** `specification-analyst` ·
**Protocol:** `test-compliance-audit` · **Taxonomy:** `specification-drift` (D11–D13)

**What you get:** An investigation report mapping validation plan test
cases to actual test implementations, identifying unimplemented test
cases (D11), missing acceptance criterion assertions (D12), and
assertion mismatches where the test checks different conditions than
the plan specifies (D13).

### "What does this code actually guarantee?"

You have a legacy codebase with sparse documentation. You need to know
what constraints it enforces — state machines, timing bounds, ordering
rules, validation logic — without reading every line. Or you have a
specification and want just the enforceable constraints, not the full
prose.

**Template:** `extract-invariants` · **Persona:** `specification-analyst` ·
**Protocol:** `invariant-extraction`

**What you get:** A dense requirements document containing only the
constraints — value bounds, behavioral rules, ordering requirements,
timing deadlines, resource limits — plus a state machine appendix if
state-driven behavior is found. Each invariant has an acceptance
criterion and traces to a specific source location.

### "Review this C++ for memory safety AND portability"

You're porting a C++ library from MSVC to also build with Clang. You
need a review that catches both real bugs and MSVC-isms that will fail
on a standards-conforming compiler.

**Template:** `review-cpp-code` · **Persona:** `systems-engineer` ·
**Protocols:** `cpp-best-practices` + `memory-safety-c` +
`msvc-clang-portability`

**What you get:** A single review that checks 7 research-validated C++
patterns (CPP-1 through CPP-7), 4 memory safety phases, AND 21 MSVC→Clang
portability patterns — with every finding tagged by pattern ID, severity,
and a specific fix. See [examples](examples.md) for a detailed walkthrough.

### "Fix all the C4456 warnings in this directory"

You have 200 instances of C4456 (variable shadowing) across 40 files.
Fixing them by hand is tedious and error-prone.

**Template:** `fix-compiler-warnings` · **Persona:** `systems-engineer` ·
**Protocols:** `minimal-edit-discipline` + `compiler-diagnostics-cpp`

**What you get:** Systematic, build-verified remediation where each
fix follows specific resolution rules (rename outer variable, append
`Outer`), every fix is validated by a build, pragma suppressions are
removed and replaced with real fixes, and a structured findings report
tracks what was fixed, skipped, and discovered.

### "What tests should I run for my changes?"

You changed three files across two components. You have no idea what
tests exist or which ones are relevant.

**Template:** `discover-tests-for-changes` · **Persona:** `test-engineer`

**What you get:** A prioritized test map: which tests cover your changes,
which gaps exist (changed code with no tests), and exact copy-pasteable
commands — quick validation first, comprehensive second.

### "Find every real bug in this kernel driver"

You need a deep, adversarial review that proves coverage and survives
challenge — not a list of surface observations with false positives.

**Template:** `exhaustive-bug-hunt` · **Persona:** `systems-engineer` ·
**Protocols:** `adversarial-falsification` + `exhaustive-path-tracing` ·
**Taxonomy:** `kernel-defect-categories` (K1–K14)

**What you get:** A forensic review where every finding includes a
falsification proof ("why this is NOT a false positive"), every file
has a coverage ledger proving it was fully analyzed, and rejected
false-positive candidates are documented with their rejection reasoning.

### "Extract the requirements from this RFC"

You're implementing RFC 9110 (HTTP Semantics). You need every MUST,
SHOULD, and MAY — plus the state transitions, error conditions, and
timing constraints — as structured, testable requirements.

**Template:** `extract-rfc-requirements` · **Persona:** `specification-analyst` ·
**Protocol:** `rfc-extraction`

**What you get:** A structured requirements document derived from the
RFC, with each normative statement extracted, classified by keyword
(MUST/SHOULD/MAY), state machines documented, ABNF grammars captured,
and cross-RFC dependencies traced.

---

## Future Scenarios (Roadmap)

These scenarios describe capabilities that are planned but not yet
implemented. See the [roadmap](roadmap.md) for details.

### "Does our implementation match the RFC?"

You've implemented a protocol. The RFC has been updated. Has your
implementation drifted? Are there MUST requirements you're violating?
Behaviors you implement that the RFC forbids?

**Planned template:** RFC ↔ implementation audit

**What you'd get:** A drift report between the RFC's normative
requirements and your implementation's actual behavior, with
security-sensitive mismatches flagged first.
