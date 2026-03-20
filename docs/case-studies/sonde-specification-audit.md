# Case Study: Auditing a Real Project with PromptKit

> **Two audit passes, 114 findings, 217 requirements, 5 components** —
> using two reusable prompts across a production IoT runtime.

## The Project

[Sonde](https://github.com/alan-jowett/sonde) is a programmable runtime
for distributed sensor nodes. It runs verified BPF bytecode (RFC 9669)
on ESP32 microcontrollers, with a gateway distributing programs over
ESP-NOW radio and a BLE pairing tool for device onboarding. The system
comprises five components: a wire protocol codec, node firmware, a
gateway server, a USB modem bridge, and a BLE pairing tool.

The project follows a specification-first methodology. Every component
has formal requirements (250+ REQ-IDs across the system), a design
document, and a validation plan with test matrices. This makes it an
ideal candidate for PromptKit's traceability audit — and a realistic
stress test, because the specs were written by humans over months of
active development.

## The Problem

Sonde's specifications were authored incrementally. Core requirements
and designs were written first (protocol, node, gateway), then BLE
pairing support was added as a cross-cutting feature touching all
components. The team suspected that the design documents hadn't kept
pace with the expanded requirements — but manually cross-checking
250+ requirements across 15 specification documents was impractical.

Specific concerns:
- Did every requirement have a corresponding design section?
- Did every requirement have a test case?
- Were there design decisions that didn't trace back to any requirement?
- Had assumptions drifted between documents as BLE was added?

## The PromptKit Approach

### Prompt Assembly

A single PromptKit prompt was assembled once and reused across all five
components — only the input documents changed:

```bash
npx @alan-jowett/promptkit assemble audit-traceability \
  -p project_name="Sonde <component>" \
  -p requirements_doc="$(cat docs/<component>-requirements.md)" \
  -p design_doc="$(cat docs/<component>-design.md)" \
  -p validation_plan="$(cat docs/<component>-validation.md)" \
  -p focus_areas="all" \
  -p audience="engineering team" \
  -o <component>-trifecta-audit.md
```

The assembled prompt composes four layers:

- **Persona**: `specification-analyst` — adversarial toward completeness
  claims, systematic rather than impressionistic
- **Protocols**: `anti-hallucination` + `self-verification` +
  `traceability-audit` (6-phase cross-document methodology)
- **Taxonomy**: `specification-drift` (D1–D7 classification)
- **Format**: `investigation-report` (F-NNN findings with severity)

### Execution

Each component audit was run in a single LLM session. The assembled
prompt (~27K chars) plus three specification documents were provided
as input. The LLM executed the traceability-audit protocol's six
phases: artifact inventory, forward traceability, backward
traceability, cross-document consistency, classification, and coverage
summary.

## Results

### Summary Across All Five Components

| Metric | Modem | Node | Gateway | BLE Tool | Protocol |
|--------|-------|------|---------|----------|----------|
| **Requirements** | 31 | 57 | 76 | 55 | 41 |
| **Reqs → Design** | 51.6% | 68.4% | 70% | 100% | ~85% |
| **Reqs → Tests** | 93.5% | 93.0% | 93% | 89.7% | 67% |
| **Total findings** | 13 | 11 | 7 | 15 | 14 |
| **Critical/High** | 3 | 0 | 2 | 2 | 0 |

**60 findings** across 260 requirements — and a clear systemic pattern
that no manual review would have caught.

### The Systemic Finding: BLE Design Gap

The most striking result was a pattern that emerged across three
independent audits. The modem, node, and gateway audits all
independently flagged the same root cause: **BLE pairing requirements
were added to all three components after the design documents were
finalized, and the design documents were never updated.**

| Component | Untraced BLE reqs | Design coverage gap |
|-----------|-------------------|---------------------|
| Modem | 14 of 31 requirements (45%) | No BLE module in design at all |
| Node | 18 of 57 requirements (32%) | BLE section added but incomplete |
| Gateway | 23 of 76 requirements (30%) | No BLE design section |

The modem audit surfaced this most dramatically:

> **F-001 (Critical, D1)**: 14 BLE pairing relay requirements
> (MD-0400–MD-0414) have zero representation in the design document.
> No BLE module, no BLE architecture, no BLE data flow described.
> Implementers have no design guidance for 45% of active requirements.

> **F-002 (High, D6)**: Design §1 overview claims "bidirectional bridge
> between USB-CDC and ESP-NOW" and "no crypto, no CBOR parsing, no
> sessions," but BLE requirements mandate LESC pairing (crypto),
> connection lifecycle (session-like), and tri-directional bridging.
> Direct textual contradiction.

A manual reviewer might have noticed that the modem design felt
incomplete. But they would not have systematically identified that the
same gap existed across three components, that it affected exactly 55
requirements total, and that the design documents actively contradicted
the requirements (D6) rather than merely omitting them (D1).

### Finding Distribution by Drift Type

| Drift Type | Total | Description |
|------------|-------|-------------|
| D1 (Untraced requirement) | 12 | Requirements not referenced in design |
| D2 (Untested requirement) | 10 | Requirements with no test case |
| D3 (Orphaned design) | 7 | Design decisions with no requirement |
| D5 (Assumption drift) | 7 | Cross-document assumption conflicts |
| D6 (Constraint violation) | 3 | Design contradicts a requirement |
| D7 (Acceptance mismatch) | 9 | Test doesn't verify its linked criteria |
| D4 (Orphaned test) | 0 | No orphaned tests found |

The zero count for D4 (orphaned test cases) indicates strong backward
traceability — every test traces to a real requirement. The issues are
concentrated in forward traceability (requirements that aren't fully
realized in design and validation).

### Severity Profile

The severity distribution skews toward actionable items:

| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 1 | 2% |
| High | 6 | 10% |
| Medium | 19 | 32% |
| Low | 28 | 47% |
| Informational | 6 | 10% |

### Notable Findings Beyond the BLE Gap

**Internal design contradiction (Node, D6)**: The node design document's
§4.1 and §14 describe "sleep indefinitely" for unpaired nodes, directly
contradicting requirement ND-0900 which mandates entering BLE pairing
mode. §15 (added later) does say "enter BLE pairing mode" — creating an
internal contradiction within the same document.

**Traceability mislabel (BLE Tool, D7)**: Test T-PT-309 ("Ed25519 →
X25519 low-order point rejection") is traced to PT-0405 but actually
validates PT-0902, a Must-priority security requirement. The mislabel
makes PT-0902 appear untested in the traceability matrix — a false
negative that could delay security sign-off.

**Redundant field consistency risk (Protocol, D5)**: The
`GatewayMessage::Command` struct carries both a `command_type: u8` field
and a typed `CommandPayload` enum. The field is fully determined by the
enum variant, making it redundant and writable. No test enforces
consistency. An encode path writing `command_type` from the field rather
than deriving it from the variant could silently produce malformed
frames.

## What Made This Work

### 1. Reusable prompt, variable inputs

One assembled prompt was used across all five components. The
`specification-analyst` persona and `traceability-audit` protocol don't
change — only the three input documents change. This made auditing five
components no more complex than auditing one.

### 2. The taxonomy forced precision

Without the D1–D7 taxonomy, the LLM would report vague observations
("the design seems incomplete for BLE"). With it, every finding gets a
precise classification that distinguishes between a missing design
section (D1), a design that contradicts a requirement (D6), and a test
that checks the wrong thing (D7). These distinctions matter for
remediation — D1 means "add a design section," D6 means "fix the
design," D7 means "fix the test."

### 3. The protocol prevented shortcuts

The traceability-audit protocol requires building a complete inventory
of every identifier before comparing documents. This is tedious but
essential — it's how the audit caught the 14/31 untraced BLE
requirements in the modem spec rather than just noting "some BLE
coverage seems light."

### 4. Anti-hallucination prevented false positives

The anti-hallucination guardrail forced the LLM to distinguish between
requirements that are genuinely missing from the design (D1) and
requirements that are addressed under different section headings
(not a finding). The gateway audit correctly identified that admin API
requirements were functionally addressed in design §13 but simply
lacked explicit REQ-ID cross-references — a bookkeeping issue (Low),
not a missing design section (High).

## Estimated Remediation

The audits produced actionable remediation guidance. Total estimated
effort across all five components: **~10–15 hours**, broken down as:

- Add BLE design sections to modem, node, and gateway design docs
- Add explicit REQ-ID cross-references where design coverage is implicit
- Define 5 deferred test cases with concrete T-NNNN IDs
- Fix 1 traceability mislabel (T-PT-309 → PT-0902)
- Add missing message variant tests in protocol crate

No breaking changes required. All findings are additive — add design
sections, add tests, add cross-references.

## Pass 2: Code Compliance Audit (D8–D10)

After the trifecta audit identified specification drift, the next
question was: **does the code actually implement what the specs say?**
The same reusable-prompt approach was applied — one `audit-code-compliance`
prompt assembled once, run against all five components with their
requirements document and source code as inputs.

### Results Across All Five Components

| Component | Requirements | Compliance | D8 (Missing) | D9 (Undocumented) | D10 (Violation) | Findings |
|-----------|-------------|------------|--------------|-------------------|-----------------|----------|
| Protocol | ~11 | 91% | 1 | 6 | 4 | 11 |
| Node | 43 | **100%** | 0 | 7 | 1 | 8 |
| Gateway | 76 | 85.5% | 2 | 5 | 2 | 9 |
| Modem | 27 | 81% | 1 | 6 | 4 | 11 |
| BLE Tool | 60 | 82% | 6 | 5 | 4 | 15 |
| **Total** | **217** | **~85%** | **10** | **29** | **15** | **54** |

**54 findings** across 217 requirements — a different class of issues
than the trifecta audit. Where the trifecta found documentation drift
(specs not in sync with each other), the code audit found implementation
drift (code not in sync with specs).

### The Code Audit Found Different Issues

The trifecta audit (D1–D7) asked: "are the documents consistent?" The
code audit (D8–D10) asked: "does the code match the documents?" These
are fundamentally different questions with different answers:

| Drift type | Trifecta findings | Code findings |
|------------|-------------------|---------------|
| Missing coverage | D1 (req not in design), D2 (req not in tests) | D8 (req not in code) |
| Contradictions | D6 (design violates req) | D10 (code violates constraint) |
| Scope creep | D3 (orphaned design) | D9 (undocumented behavior) |

The node firmware illustrates this perfectly: the trifecta audit found
11 findings (18 untraced BLE requirements, internal design
contradictions), but the code audit found **100% implementation
compliance** — zero D8s. The code was correct even though the design
document was stale. Conversely, the gateway had moderate trifecta
findings but the code audit revealed the admin API bypasses ELF
verification entirely — a D8 that no document-level audit could catch.

### Systemic Pattern: BLE Is the Weak Link Everywhere

The same pattern from the trifecta audit reappeared at the code level.
BLE pairing was the weakest subsystem across three components:

- **Modem**: BLE subsystem at 62% compliance (vs. 100% for USB-CDC
  and ESP-NOW). Missing 30-second pairing timeout. Numeric Comparison
  accepted before operator approval.
- **BLE Tool**: LESC Numeric Comparison enforcement not observable —
  Android can fall back to Just Works pairing, a security downgrade
  the spec explicitly prohibits.
- **Gateway**: ELF verification code exists (`ingest_elf()`) but is
  not wired to the admin API — programs are distributed without
  bytecode safety checks.

### D9 Findings Were Mostly Positive

Of the 29 undocumented behavior findings (D9), almost all were
**defensive safety nets** the implementation added beyond what the
specs required:

- Node firmware: buffer size limits, retry guards, permanent error
  handling for malformed payloads
- Gateway: program deletion protection, active-session rejection for
  state imports, handler log drain limits, cancellation-safe
  concurrency patterns
- BLE Tool: loopback test transport, bond removal via reflection,
  plaintext-to-encrypted storage migration

These are good engineering practices. The right remediation is not to
remove them but to **document them as design decisions** — updating
the specs to match the (better) implementation.

### Notable Findings

**Gateway bypasses ELF verification (D8, High)**: The admin API accepts
raw program bytes and distributes them to nodes without extracting
bytecode from ELF or running the Prevail verifier. The verification
code exists in `ingest_elf()` but is unreachable from the admin path.
A comment reads: "ELF→CBOR extraction/verification will be added in a
future phase." This means nodes in the field could receive unverified
bytecode.

**Modem accepts pairing before operator approval (D10, Medium)**: The
`on_confirm_pin` callback always returns `true` immediately at the BLE
stack level, establishing an encrypted link before the operator has a
chance to approve the Numeric Comparison. The modem then sends the PIN
to the gateway for display, but the cryptographic handshake is already
complete.

**Protocol crate missing `key_hint_from_psk()` (D8, High)**: The spec
defines a key-hint derivation function (`u16::from_be_bytes(SHA-256(PSK)
[30..32])`), but the protocol crate doesn't implement it. Every
consumer (gateway, node, admin CLI) must independently re-implement
the recipe — a divergence risk.

### Combined Audit Summary

Across both audit passes (trifecta + code compliance), the full picture:

| Audit | Findings | What it caught |
|-------|----------|----------------|
| Trifecta (D1–D7) | 60 | Spec drift — BLE design gaps, assumption conflicts, test traceability |
| Code compliance (D8–D10) | 54 | Implementation drift — missing features, undocumented behavior, constraint violations |
| **Total** | **114** | **Two complementary views of the same system** |

## PromptKit vs. Ad-Hoc Prompts

The Sonde project had already been through an audit pass before this
exercise. The maintainer had used ad-hoc LLM prompts to review the
specifications, filing ~20 GitHub issues from those results. This
created a natural experiment: what does a structured PromptKit audit
find that an ad-hoc LLM audit misses — and vice versa?

### Cross-Reference Results

The 60 PromptKit findings were cross-referenced against existing
GitHub issues filed from the ad-hoc audit:

| Component | Findings | Direct Match | Partial Match | No Issue |
|-----------|----------|--------------|---------------|----------|
| Protocol | 14 | 8 | 2 | 4 |
| BLE Tool | 15 | 6 | 3 | 6 |
| Modem | 13 | 2 | 3 | 8 |
| Gateway | 7 | 1 | 2 | 4 |
| Node | 11 | 0 | 3 | 8 |
| **Total** | **60** | **17 (28%)** | **13 (22%)** | **30 (50%)** |

**28% of findings were already known** — the ad-hoc audit had caught
them. **22% partially overlapped** — the issue existed but the finding
was more specific or broader. **50% were net-new** — issues the ad-hoc
audit did not surface at all.

### Different Prompts Find Different Things

Both audits used LLMs. The difference was the prompt: one was ad-hoc
("review this spec for gaps"), the other was a composed PromptKit prompt
with a defined persona, a 6-phase protocol, and a classification
taxonomy. The most revealing pattern was not how many findings
overlapped, but which *types* each approach caught:

**Ad-hoc prompt strength: validation gaps.** The ad-hoc audit excelled
at finding missing tests, incomplete test cases, and validation plan
gaps — particularly in the protocol crate and BLE tool. These are the
issues an LLM naturally surfaces when asked to "review" a spec, because
test gaps are concrete and obvious.

**PromptKit audit strength: design traceability.** The structured
trifecta audit found a fundamentally different class of issues —
cross-document traceability gaps between requirements and design. The
10 highest-severity net-new findings were almost entirely D1/D3/D6
(design drift), not D2/D7 (test drift):

- Node F-001: 18 requirements untraced in design doc
- Node F-006/F-008: Design boot sequence contradicts BLE pairing
  requirements
- Modem F-002/F-003: Design overview contradicts and omits BLE module
- Gateway F-006: Module table missing Admin API and BLE modules
- Protocol F-010: Redundant `command_type` field inconsistency risk

**The two approaches are complementary, not competing.** An ad-hoc
prompt tends to read each document in isolation and spot issues within
it — catching D2 and D7 issues. The structured protocol forces the LLM
to build a complete identifier inventory across all three documents
and check every cell in the traceability matrix — catching D1 and D6
issues that require holding three documents in working memory
simultaneously.

### Why the Ad-Hoc Audit Missed Design Drift

The ad-hoc audit focused on a natural question: "are the tests
complete?" This is the question engineers instinctively ask (and
prompt for), because test gaps have immediate consequences. Design
traceability gaps have deferred consequences — the code might still be
correct even if the design document is stale. But when BLE pairing
design was absent from three design documents simultaneously, the risk
was not just stale documentation — it was that future implementers
would have no design guidance for 30-45% of requirements.

The PromptKit audit caught this because the traceability-audit protocol
requires building a **complete identifier inventory** before comparing
documents. An ad-hoc prompt skims; the protocol enumerates.
Enumeration is tedious but exhaustive — and that's exactly what makes
it effective for finding what's missing rather than what's wrong.

### What the Ad-Hoc Audit Caught That PromptKit Missed

The comparison cuts both ways. The ad-hoc audit found **11 spec-relevant
issues (~100+ individual gaps)** that the trifecta audit did not surface.
They fall into three categories the structural audit cannot detect by
design:

**Semantic test gaps (6 issues, ~45 individual gaps).** Tests exist and
are linked to requirements, but don't verify deeply enough. For example:
Sonde issue
[#357](https://github.com/alan-jowett/sonde/issues/357) found that
protocol tests check output exists but not that randomness is
cryptographic, CBOR is deterministic, or HMAC state is isolated. Sonde
[#354](https://github.com/alan-jowett/sonde/issues/354) found 11 node
tests that check outcomes but not timing/ordering constraints ("MUST
wait for X before Y"). Sonde
[#359](https://github.com/alan-jowett/sonde/issues/359) found
requirements with happy-path tests but no negative tests.

*Why missed:* The trifecta audit checks "does a test case exist for this
requirement?" (D2). It does not read test procedures to judge whether
they're thorough enough. That's D7 territory, which it only spot-checks
at the acceptance-criteria level.

**Domain-specific safety gaps (4 issues, ~50+ individual gaps).** These
require deep understanding of the BPF interpreter's safety model. Sonde
[#330](https://github.com/alan-jowett/sonde/issues/330) found 28 tagged
register safety invariants with zero test coverage. Sonde
[#334](https://github.com/alan-jowett/sonde/issues/334) found 8 BPF
helper trust boundary gaps. These come from
`safe-bpf-interpreter.md` — a separate specification not included in
any component's trifecta.

*Why missed:* The audit examines the three documents it's given. Specs
outside the trifecta are invisible to it.

**Cross-component integration (1 issue, 5 gaps).** The end-to-end BLE
onboarding flow across gateway + modem + pairing tool was never
integration-tested (Sonde
[#361](https://github.com/alan-jowett/sonde/issues/361)).

*Why missed:* The trifecta audit examines each component independently.
Cross-component flows are invisible to per-component audits.

### The Complementarity Is the Point

| Approach | Strength | Blind spot |
|----------|----------|------------|
| **PromptKit trifecta** | Structural traceability — missing cross-references, orphaned IDs, numbering gaps (30 net-new findings) | Cannot judge test depth, domain safety invariants, or cross-component flows |
| **Ad-hoc prompt** | Semantic depth — are tests thorough enough? are safety invariants verified? are negative cases covered? (11 issues, ~100+ gaps) | Misses systematic traceability gaps across document sets |

Neither approach alone gives full coverage. The structural audit is
exhaustive but shallow (does a test *exist*?). The ad-hoc audit is
deep but selective (is this test *good enough*?). Used together, they
cover both dimensions.

## Takeaways

- **Specification drift is real and systemic.** BLE pairing was added
  to requirements across three components, and all three design
  documents lagged. Manual review would catch this in one component;
  the audit caught it in all three and quantified the gap precisely.

- **Document drift and code drift are different problems.** The
  trifecta audit found 60 findings about specs not matching each other.
  The code audit found 54 findings about code not matching specs. The
  node firmware had 100% code compliance but 11 document-level
  findings — the code was right, the docs were stale. You need both
  audits to see the full picture.

- **Undocumented behavior is not always bad.** 29 of 54 code findings
  were D9 (undocumented behavior), and nearly all were defensive safety
  nets. The right fix is to update the specs, not remove the code.

- **Structured prompts find different issues than ad-hoc prompts.**
  Both used LLMs. PromptKit found 30 net-new structural traceability
  gaps. The ad-hoc prompt found 11 issues (~100+ individual gaps) in
  semantic test depth and domain safety that the structural audit
  can't see. Neither alone gives full coverage — the two are
  complementary by design, not competing.

- **One prompt, five audits — twice.** The same reusable-prompt
  approach worked for both the trifecta and code compliance audits.
  Ten total audit runs from two assembled prompts.

- **Taxonomy classification drives remediation.** D8 (implement the
  feature) requires different effort than D9 (document the behavior)
  or D10 (fix the constraint violation). The taxonomy makes
  prioritization mechanical rather than subjective.

- **114 findings, one system.** The combined audit surface — documents,
  code, and the gaps between them — gives a complete picture of
  specification integrity that no single audit type can provide.
