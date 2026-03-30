# Phase 3 — Specification Audit Report

## Revision History

| Rev | Date | Author | Description |
|-----|------|--------|-------------|
| 0.1 | 2025-07-18 | Engineering-workflow Phase 3 | Initial audit of v0.2 specification updates |

---

## 1. Audit Scope

**User's Original Intent**: Remove redundant code from the PromptKit CLI.
Delete `assemble.js`, `manifest.js`, the `assemble` command, and
`collectParams()`. Keep the `list` command (reimplemented with inline
manifest parsing in `cli.js`). Keep the `interactive` command and
`launch.js`. Simplify `cli.js` to two commands.

**Documents Audited**:
- `cli/specs/requirements.md` (v0.2)
- `cli/specs/design.md` (v0.2)
- `cli/specs/validation.md` (v0.2)
- `cli/specs/phase1-requirements-patch.md` (v0.1, as upstream reference)

**Protocols Applied**: Traceability Audit, Adversarial Falsification

---

## 2. Forward Traceability (Requirements → Design → Validation)

### 2.1 Requirements → Design

Every surviving requirement was checked for design coverage:

| REQ-ID | Design Section | Status |
|--------|---------------|--------|
| REQ-CLI-001 | §2.1 cli.js | ✓ Traced |
| REQ-CLI-002 | §2.1, §1.3 | ✓ Traced |
| REQ-CLI-003 | §2.1 | ✓ Traced |
| REQ-CLI-004 | §2.1 (ensureContent) | ✓ Traced |
| REQ-CLI-010–019 | §2.4 launch.js | ✓ Traced |
| REQ-CLI-020–023 | §2.1, §3.3 (List Pipeline) | ✓ Traced |
| REQ-CLI-070–076 | §2.5 copy-content.js | ✓ Traced |
| REQ-CLI-080–082 | §5.1, §6.1 | ✓ Traced |
| REQ-CLI-090–091 | §2.4 (platform detection) | ✓ Traced |
| REQ-CLI-093 | §2.1, §2.4 | ✓ Traced |
| REQ-CLI-094 | §6.1 | ✓ Traced |
| REQ-CLI-100 | §2.2 [RETIRED], §5.1 | ✓ Traced |
| REQ-CLI-101 | §2.2, §2.3 [RETIRED], §1.1 | ✓ Traced |
| REQ-CLI-103 | §2.1, §4.4 | ✓ Traced |

**Result**: 100% forward traceability (requirements → design).

### 2.2 Requirements → Validation

Every surviving requirement was checked for test coverage:

| REQ-ID | Test Case(s) | Coverage |
|--------|-------------|----------|
| REQ-CLI-001 | TC-CLI-001 | ✓ Full |
| REQ-CLI-002 | TC-CLI-001, TC-CLI-004 | ✓ Full |
| REQ-CLI-003 | TC-CLI-002 | ✓ Full |
| REQ-CLI-004 | TC-CLI-003, TC-CLI-003a | ✓ Full |
| REQ-CLI-010 | TC-CLI-070–074 | ✓ Full |
| REQ-CLI-011 | TC-CLI-075 | ⚠ Partial (see F-01) |
| REQ-CLI-012 | TC-CLI-076 | ✓ Full |
| REQ-CLI-013 | TC-CLI-077 | ✓ Full |
| REQ-CLI-014 | TC-CLI-078 | ✓ Full |
| REQ-CLI-015 | TC-CLI-078, TC-CLI-081 | ✓ Full |
| REQ-CLI-016 | TC-CLI-080 | ✓ Full |
| REQ-CLI-017 | TC-CLI-081 | ✓ Full |
| REQ-CLI-018 | TC-CLI-079 | ✓ Full |
| REQ-CLI-019 | TC-CLI-076 | ✓ Full |
| REQ-CLI-020 | TC-CLI-050 | ✓ Full |
| REQ-CLI-021 | TC-CLI-051 | ✓ Full |
| REQ-CLI-022 | TC-CLI-052 | ✓ Full |
| REQ-CLI-023 | TC-CLI-053 | ✓ Full |
| REQ-CLI-070 | TC-CLI-090 | ✓ Full |
| REQ-CLI-071 | TC-CLI-091 | ✓ Full |
| REQ-CLI-072 | TC-CLI-092 | ✓ Full |
| REQ-CLI-073 | TC-CLI-093 | ✓ Full |
| REQ-CLI-074 | TC-CLI-094 | ✓ Full |
| REQ-CLI-075 | TC-CLI-095 | ✓ Full |
| REQ-CLI-076 | TC-CLI-100 | ✓ Full |
| REQ-CLI-080 | TC-CLI-100, TC-CLI-121 | ✓ Full |
| REQ-CLI-081 | TC-CLI-101 | ✓ Full |
| REQ-CLI-082 | (package.json inspection) | ✓ Inspection |
| REQ-CLI-090 | TC-CLI-110–112 | ✓ Full |
| REQ-CLI-091 | (platform testing) | ⚠ Reduced (see F-02) |
| REQ-CLI-093 | TC-CLI-003, TC-CLI-076 | ✓ Full |
| REQ-CLI-094 | (package.json inspection) | ✓ Inspection |
| REQ-CLI-100 | TC-CLI-120 | ✓ Full |
| REQ-CLI-101 | TC-CLI-121 | ✓ Full |
| REQ-CLI-103 | TC-CLI-122 | ✓ Full |

**Result**: 33/35 requirements fully traced. 2 partial (see Findings).

---

## 3. Backward Traceability (Downstream → Requirements)

### 3.1 Design → Requirements

Every active design section was checked for requirement linkage:

| Design Section | Linked REQ-IDs | Status |
|---------------|----------------|--------|
| §2.1 cli.js | REQ-CLI-001–004, 020–023, 100, 103 | ✓ |
| §2.4 launch.js | REQ-CLI-010–019 | ✓ |
| §2.5 copy-content.js | REQ-CLI-070–076 | ✓ |
| §4.4 Inline Manifest | REQ-CLI-103 | ✓ |
| §4.6 LLM as SSOT | REQ-CLI-100, 101 | ✓ |

No orphaned design decisions found (D3).

### 3.2 Validation → Requirements

Every active test case was checked:

| Test Case | Linked REQ-ID | Valid? |
|-----------|--------------|--------|
| TC-CLI-001 | REQ-CLI-002 | ✓ Active |
| TC-CLI-002 | REQ-CLI-003 | ✓ Active |
| TC-CLI-003 | REQ-CLI-004 | ✓ Active |
| TC-CLI-003a | REQ-CLI-004 | ✓ Active |
| TC-CLI-004 | REQ-CLI-002 | ✓ Active |
| TC-CLI-050–053 | REQ-CLI-020–023 | ✓ Active |
| TC-CLI-070–081 | REQ-CLI-010–018 | ✓ Active |
| TC-CLI-090–095 | REQ-CLI-070–075 | ✓ Active |
| TC-CLI-100–101 | REQ-CLI-080–081 | ✓ Active |
| TC-CLI-110–112 | REQ-CLI-090 | ✓ Active |
| TC-CLI-120 | REQ-CLI-100 | ✓ Active |
| TC-CLI-121 | REQ-CLI-101 | ✓ Active |
| TC-CLI-122 | REQ-CLI-103 | ✓ Active |

No orphaned test cases found (D4). All retired test cases are properly
marked [RETIRED] and reference retired requirements.

---

## 4. Cross-Document Consistency

### 4.1 Terminology Consistency

| Term | requirements.md | design.md | validation.md | Consistent? |
|------|----------------|-----------|---------------|-------------|
| "two commands" | §1.1, REQ-CLI-002 | §1.3, §2.1 | TC-CLI-001 | ✓ |
| "inline manifest parsing" | REQ-CLI-020, REQ-CLI-103 | §2.1, §4.4 | TC-CLI-122 | ✓ |
| "bootstrap.md AND manifest.yaml" | REQ-CLI-004 | §2.1 ensureContent | TC-CLI-003, TC-CLI-003a | ✓ |
| "no assemble command" | REQ-CLI-100 | §2.2 [RETIRED] | TC-CLI-120 | ✓ |
| "no assemble fallback" | REQ-CLI-012 | §2.4 launch.js | TC-CLI-076 | ✓ |
| "lib/ contains only launch.js" | REQ-CLI-080 | §1.1 | TC-CLI-100 | ✓ |
| "two runtime dependencies" | REQ-CLI-094 | §6.1 | (inspection) | ✓ |

### 4.2 Constraint Propagation

| Constraint | requirements.md | design.md | validation.md |
|-----------|----------------|-----------|---------------|
| CON-001 (no source modification) | Active | §2.4 (reads bundled content) | N/A |
| CON-002 (no network) | Active | §2.4 (local only) | N/A |
| CON-003 (no secrets) | Active | §2.4 (LLM handles auth) | N/A |
| CON-004 (stateless) | Active | §2.4 (temp dir cleaned) | TC-CLI-079 |
| CON-005 (verbatim inclusion) | RETIRED | N/A | N/A |

No constraint violations found (D6).

### 4.3 Assumption Alignment

| Assumption | requirements.md | design.md | Status |
|-----------|----------------|-----------|--------|
| ASSUMPTION-001 (manifest structure) | Active | §5.3 (schema) | ✓ Aligned |
| ASSUMPTION-002 (template schema) | RETIRED | N/A | ✓ Retired consistently |
| ASSUMPTION-003 (--cli values) | Active, updated | §2.4, GAP-010 | ✓ Aligned |
| ASSUMPTION-004 (copyContentToTemp) | Active | §2.4, GAP-008 | ✓ Aligned |
| ASSUMPTION-005 (prepare script) | Active | §2.5 | ✓ Aligned |
| ASSUMPTION-006 (frontmatter regex) | RETIRED | N/A | ✓ Retired consistently |

No assumption drift found (D5).

---

## 5. Findings

### F-01: REQ-CLI-011 help text documentation not tested
- **Drift Label**: D7_ACCEPTANCE_CRITERIA_MISMATCH (Low severity)
- **Location**: REQ-CLI-011 (requirements.md), TC-CLI-075 (validation.md)
- **Evidence**: REQ-CLI-011 was updated to add "Valid values (`copilot`,
  `gh-copilot`, `claude`) SHOULD be documented in `--help` output."
  TC-CLI-075 tests only the override behavior (`--cli claude` uses claude),
  not whether valid values appear in help text.
- **Sub-check failed**: Criterion-level coverage — the help text
  documentation criterion is not exercised.
- **Impact**: Low. The help text documentation is a SHOULD (recommended,
  not absolute). The core override functionality is tested.
- **Disproof attempt**: Checked whether TC-CLI-001 (help output) covers
  this. TC-CLI-001 verifies command listings, not `--cli` value
  documentation. Disproof fails.
- **Recommendation**: Add a test case (or extend TC-CLI-075) to verify
  that `promptkit interactive --help` lists valid `--cli` values.

### F-02: REQ-CLI-091 has reduced test coverage after retirements
- **Drift Label**: D2_UNTESTED_REQUIREMENT (Low severity)
- **Location**: REQ-CLI-091 (requirements.md), traceability matrix
  (validation.md)
- **Evidence**: REQ-CLI-091 ("CLI MUST work on Windows, macOS, and Linux")
  previously had TC-CLI-011 (Windows line endings in frontmatter) and
  TC-CLI-113 as evidence. Both are now retired because they tested
  `assemble.js` functionality. The requirement remains active but has no
  dedicated test case.
- **Impact**: Low. The system-level tests TC-CLI-110–112 (run on Node.js
  18/20/22) implicitly verify cross-platform behavior when run on each
  platform. The platform-aware `where`/`which` detection in `launch.js`
  is the primary cross-platform concern, and TC-CLI-070–074 exercise this.
- **Disproof attempt**: Considered whether TC-CLI-070 (detectCli) covers
  platform behavior. `detectCli()` uses `where` (Windows) vs `which`
  (Unix), which is platform-specific. TC-CLI-070 tests the function but
  doesn't explicitly test on multiple platforms. Disproof fails —
  dedicated cross-platform evidence is reduced.
- **Recommendation**: Note in traceability matrix that REQ-CLI-091 is
  verified by running the full test suite on each target platform. No
  new test case needed if CI runs tests on all three OSes.

---

## 6. Adversarial Falsification

### 6.1 Disproof Attempts on "Clean" Areas

**Attempt 1**: Could `list` command fail silently on malformed YAML?
- Checked: If `js-yaml` throws during `yaml.load()`, is the error
  caught? The original `manifest.js` threw on malformed YAML (per
  TC-CLI-031, now retired). The inlined version should propagate the
  exception, which Commander.js would catch and display.
- **Result**: Pre-existing behavior, not introduced by this change. Not
  a finding.

**Attempt 2**: Could removing `manifest.js` break external consumers?
- Checked: `manifest.js` was in `lib/` and exported via
  `module.exports`. Could someone `require('@alan-jowett/promptkit/lib/manifest')`?
- **Result**: Technically possible but `lib/` modules are not part of
  the public API (no documented exports). The package's public interface
  is the `promptkit` binary only. Breaking internal modules is acceptable
  at pre-1.0. Not a finding.

**Attempt 3**: Is the design's List Pipeline (§3.3) consistent with
REQ-CLI-020–023?
- Checked: §3.3 shows read → parse → flatten → display/JSON. This
  matches REQ-CLI-020 (grouped display), REQ-CLI-021 (--json), REQ-CLI-022
  (required fields), REQ-CLI-023 (usage hint).
- **Result**: Consistent. Not a finding.

**Attempt 4**: Does the traceability matrix have the correct count of
RETIRED entries?
- Checked: 30 retired REQ-IDs (REQ-CLI-030–037: 8, REQ-CLI-040–051: 12,
  REQ-CLI-060–069: 10) plus REQ-CLI-092 = 31 retired requirements. Matrix
  shows 31 RETIRED rows.
- **Result**: Count matches. Not a finding.

### 6.2 Candidate Findings Investigated and Rejected

| # | Candidate | Why Rejected |
|---|-----------|-------------|
| 1 | REQ-CLI-094 not tested | Pre-existing — was not tested in v0.1 either. Verified by `package.json` inspection, which is a build-time verification method. |
| 2 | REQ-CLI-082 not tested | Pre-existing — was not tested in v0.1 either. Verified by `package.json` inspection. |
| 3 | Design §5.3 schema is simplified | Intentional — the schema only shows what the `list` command needs. The full schema is documented in `bootstrap.md` for the LLM. |
| 4 | Design removed §4.4 (Verbatim Inclusion) and §4.5 (Warn-and-Continue) | Both decisions pertained to `assemble.js` which is retired. Removing them is correct. |

---

## 7. Coverage Summary

### 7.1 Forward Traceability Rate

- Requirements → Design: **35/35 = 100%** (all active requirements traced)
- Requirements → Validation: **33/35 = 94%** (2 partial — F-01, F-02)

### 7.2 Backward Traceability Rate

- Design → Requirements: **100%** (no orphaned design decisions)
- Validation → Requirements: **100%** (no orphaned test cases; all retired
  TCs properly marked)

### 7.3 Acceptance Criteria Coverage

- Active acceptance criteria with test verification: 4/4 (AC-001, AC-003,
  AC-004, AC-005). AC-002 retired.
- Criterion-level gap: REQ-CLI-011's help text documentation clause has
  no test (F-01). This is a SHOULD, not a MUST.

### 7.4 Assumption Consistency

- Aligned: 4 (ASSUMPTION-001, 003, 004, 005)
- Retired: 2 (ASSUMPTION-002, 006) — consistently retired across all docs
- Conflicting: 0

### 7.5 Retired Item Summary

| Category | Count | Properly Marked? |
|----------|-------|-----------------|
| Requirements (REQ-CLI-*) | 31 | ✓ All marked [RETIRED] with strikethrough |
| Constraints (CON-*) | 1 | ✓ CON-005 marked [RETIRED] |
| Assumptions (ASSUMPTION-*) | 2 | ✓ Both marked [RETIRED] |
| Test Cases (TC-CLI-*) | 44 | ✓ All marked [RETIRED] |
| Design Sections | 3 | ✓ §2.2, §2.3, §3.1 marked [RETIRED] |
| Acceptance Criteria | 1 | ✓ AC-002 marked [RETIRED] |
| Gaps | 9 | ✓ GAP-001–007, 009, 011 marked [RESOLVED] |

---

## 8. Verdict

### **PASS**

The v0.2 specification updates are internally consistent, fully traceable,
and faithfully represent the user's intent. Two low-severity findings were
identified (F-01: missing help text test for --cli values; F-02: reduced
cross-platform test evidence after assembly engine retirements). Neither
finding blocks implementation.

**Confidence**: High. The specification set has strong traceability, no
constraint violations, no assumption drift, and no orphaned items. The
two findings are minor gaps in test coverage, not specification defects.
