# Case Study: Auditing a Real Project with PromptKit

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

No findings were informational-only. The distribution skews toward
actionable items:

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

## PromptKit vs. Manual Audit

The Sonde project had already been through a manual audit pass before
this exercise. The maintainer had filed ~20 GitHub issues based on
hand-rolled prompts and direct review. This created a natural
experiment: what does a structured PromptKit audit find that a manual
audit misses — and vice versa?

### Cross-Reference Results

The 59 PromptKit findings were cross-referenced against existing
GitHub issues:

| Component | Findings | Direct Match | Partial Match | No Issue |
|-----------|----------|--------------|---------------|----------|
| Protocol | 14 | 8 | 2 | 4 |
| BLE Tool | 15 | 6 | 3 | 6 |
| Modem | 12 | 2 | 3 | 7 |
| Gateway | 7 | 1 | 2 | 4 |
| Node | 11 | 0 | 3 | 8 |
| **Total** | **59** | **17 (29%)** | **13 (22%)** | **29 (49%)** |

**29% of findings were already known** — the manual audit had caught
them. **22% partially overlapped** — the issue existed but the finding
was more specific or broader. **49% were net-new** — issues the manual
audit did not surface at all.

### Different Audits Find Different Things

The most revealing pattern was not how many findings overlapped, but
which *types* each approach caught:

**Manual audit strength: validation gaps.** The maintainer's manual
review excelled at finding missing tests, incomplete test cases, and
validation plan gaps — particularly in the protocol crate and BLE tool.
These are the issues an engineer naturally notices when reading test
plans against requirements.

**PromptKit audit strength: design traceability.** The automated
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

**The two approaches are complementary, not competing.** A human
reviewer reads a test plan and thinks "is this test right?" — catching
D2 and D7 issues. The structured protocol reads all three documents
and mechanically checks "does every REQ-ID appear in the design?" —
catching D1 and D6 issues that require comparing documents a human
doesn't hold in working memory simultaneously.

### Why the Manual Audit Missed Design Drift

The manual audit focused on a natural question: "are the tests
complete?" This is the question engineers instinctively ask, because
test gaps have immediate consequences (bugs in production). Design
traceability gaps have deferred consequences — the code might still be
correct even if the design document is stale. But when BLE pairing
design was absent from three design documents simultaneously, the risk
was not just stale documentation — it was that future implementers
would have no design guidance for 30-45% of requirements.

The PromptKit audit caught this because the traceability-audit protocol
requires building a **complete identifier inventory** before comparing
documents. A human skims; the protocol enumerates. Enumeration is
tedious but exhaustive — and that's exactly what makes it effective for
finding what's missing rather than what's wrong.

## Takeaways

- **Specification drift is real and systemic.** BLE pairing was added
  to requirements across three components, and all three design
  documents lagged. Manual review would catch this in one component;
  the audit caught it in all three and quantified the gap precisely.

- **Structured audits find different issues than manual review.**
  49% of findings were net-new — almost all design traceability gaps
  that the manual audit's test-focused lens naturally missed. The two
  approaches are complementary.

- **One prompt, five audits.** The assembled prompt is reusable —
  the methodology doesn't change, only the inputs. This scales to
  any project with structured specification documents.

- **Taxonomy classification drives remediation.** D1 (add a section)
  requires different effort than D6 (fix a contradiction) or D7 (fix
  a test). The taxonomy makes prioritization mechanical rather than
  subjective.

- **Coverage metrics tell the story.** "93% test coverage but 52%
  design coverage" immediately identifies where to focus. The metrics
  are calculated from actual identifier counts, not impressions.

- **Zero orphaned tests.** Strong backward traceability (D4 = 0 across
  all components) shows the project's testing discipline. The drift is
  forward-only — requirements outpacing design, not tests diverging
  from requirements.
