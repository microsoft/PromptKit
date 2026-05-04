# PromptKit CLI — Audit Findings Summary (2026-03-30)

All findings from maintenance audit of v0.5.0 code against v0.3.0 spec baseline.

| Finding | Status on main | Verdict |
|---------|---------------|---------|
| F-001 🔴 | TC-CLI-080/081 reads source text instead of verifying spawn cmd/args | Confirmed — needs spawn-intercepting test |
| F-002 🔴 | TC-CLI-076 mapped to REQ-CLI-019 but only tests "no CLI found", not spawn failure | Confirmed — needs `--cli nonexistent` error path test |
| F-003 🔴 | Spec docs say v0.3.0, package.json says v0.5.0 | Confirmed — needs version alignment + revision history entry |
| F-004 🟡 | REQ-CLI-082 (publishConfig) verified by inspection only — no TC-NNN | Confirmed — add package.json assertion test |
| F-005 🟡 | REQ-CLI-091 (cross-platform) has no TC-NNN and no CI matrix | Confirmed — needs CI platform matrix |
| F-006 🟡 | TC-CLI-071 (gh-copilot detection) not in test files | Confirmed — missing test |
| F-007 🟡 | TC-CLI-075 (--cli flag override) not in test files | Confirmed — missing test |
| F-008 🟡 | TC-CLI-079 (temp dir cleanup on exit) not in test files | Confirmed — missing test |
| F-009 🟡 | TC-CLI-100/121 (npm pack distribution) not automated — inspection only | Confirmed — needs npm pack dry-run test |
| F-010 🟡 | TC-CLI-073 implemented as integration test; plan specifies unit test calling detectCli() | Confirmed — weak isolation, add unit test |
| F-011 🟡 | REQ-CLI-094 (exactly two dependencies) verified by inspection only — no TC-NNN | Confirmed — add package.json assertion test |
| F-012 🟢 | REQ-CLI-082 and REQ-CLI-090 absent from design doc (no D1 coverage) | Confirmed — add brief notes to design §6 |
| F-013 🟢 | GAP-010 still marked "To be resolved" in design; code already resolves it | Confirmed — mark GAP-010 resolved in design.md |
| F-014 🟢 | launch.js prints "content staged at" and "Launching…" — not in any requirement | Accept — benign informational output |
| F-015 🟢 | Usage hint says "Run promptkit" not "Run promptkit interactive" | Confirmed — ambiguous; decide: fix hint or relax acceptance criterion |
| F-016 🟢 | TC-CLI-077 (fallback warning to claude) not in test files | Confirmed — missing test |
| F-017 🟢 | TC-CLI-101 (content/ gitignored) not automated — requires git context | Confirmed — replace with static .gitignore check |
| F-018 🟢 | TC-CLI-078 only checks personas/ and templates/, not protocols/, formats/, taxonomies/ | Confirmed — add 3 missing directory assertions |
| F-019 🟢 | TC-CLI-002 only tests --version, not -V short flag | Confirmed — add -V assertion |
| F-020 🟢 | TC-CLI-053 asserts output.includes("promptkit") but not "interactive" | Confirmed — strengthen assertion |
| F-021 🟢 | CON-001 through CON-004 (constraints) absent from traceability matrix entirely | Accept — constraints are structural; code is compliant |
