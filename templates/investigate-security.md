<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: investigate-security
description: >
  Perform a security audit of code or a system component.
  Systematically analyze for vulnerability classes and produce
  a security investigation report.
persona: security-auditor
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - guardrails/adversarial-falsification
  - analysis/security-vulnerability
  - reasoning/exhaustive-path-tracing  # optional — apply selectively to parser/decoder functions
taxonomies:
  - stack-lifetime-hazards
format: investigation-report
params:
  target_description: "What is being audited — component, service, or feature"
  code_context: "Code to audit, configuration, API definitions"
  threat_model: "Known threat model, trust boundaries, or security requirements (if available)"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A security investigation report with vulnerability findings,
    severity classifications, exploit scenarios, and remediation.
---

# Task: Security Investigation

You are tasked with performing a **security audit** of the following
code or system component.

## Inputs

**Target**:
{{target_description}}

**Code / Configuration**:
{{code_context}}

**Threat Model / Security Requirements** (if available):
{{threat_model}}

## Instructions

1. **Apply the security-vulnerability protocol** systematically:
   - Map trust boundaries (interfaces where data or control transitions
     from one privilege or trust level to another — e.g., network input,
     file system, user-provided arguments, IPC)
   - Audit input validation
   - Check authentication and authorization
   - Review cryptographic usage
   - Check for information disclosure

2. **Apply the anti-hallucination protocol** throughout:
   - Only report vulnerabilities you can evidence from the provided code
   - Distinguish between **confirmed vulnerabilities** (concrete exploit path)
     and **potential weaknesses** (possible under certain conditions)
   - Do NOT assume the existence of code, configuration, or infrastructure
     that is not provided

3. **Format the output** according to the investigation-report format specification,
   with these security-specific additions:
   - Include CWE identifiers for each vulnerability finding. If no exact
     CWE match exists, use the closest applicable CWE; if the
     vulnerability is novel, omit the CWE and state why
   - Include a concrete **attack scenario** for each finding rated High or Critical
   - Rate severity using CVSS-like criteria (attack vector, complexity,
     privileges required, impact)

4. **Prioritize findings** by exploitability and impact:
   - Critical: remotely exploitable, no authentication required, high impact
   - High: exploitable with some prerequisites, significant impact
   - Medium: requires specific conditions, moderate impact
   - Low: theoretical or requires unlikely conditions
   - Informational: best-practice deviation, no direct exploit path

5. **Apply the self-verification protocol** before finalizing:
   - Sample at least 3–5 findings and re-verify against the source code
   - Ensure every vulnerability has a concrete code citation
   - Confirm coverage: state what was examined and what was not

6. **Apply the operational-constraints protocol** when working with code:
   - Scope your search before reading — identify trust boundaries first
   - Prefer deterministic methods (targeted search, structured enumeration)
   - Document your search strategy for reproducibility

7. **Apply the exhaustive-path-tracing protocol selectively** to
   **parser and decoder functions** that process untrusted structured input.
   This protocol is not applied to every function — only to functions
   identified during Phase 2 (attack surface enumeration) that meet
   ALL of the following criteria:

   - The function **decodes multiple fields** from a wire format, file
     format, or serialized structure controlled by an untrusted source
   - The function **performs arithmetic** (subtraction, addition,
     multiplication, shift) on two or more decoded values, or between
     a decoded value and a running accumulator
   - The function contains **loops** that iterate over a variable number
     of decoded elements, where each iteration updates shared state
     (offsets, remaining lengths, accumulators)

   For each such function, apply the full exhaustive-path-tracing
   protocol with particular attention to:

   - **Inter-value arithmetic validation**: After decoding a new field
     value, verify that every subsequent arithmetic operation using that
     value against a running accumulator (e.g., `Largest -= Count`) is
     guarded against underflow or overflow — not just at the decode site,
     but at every use site within the function, including the *current*
     loop iteration (not just the next iteration's entry check).
   - **Loop-carried invariant gaps**: When a loop body decodes a fresh
     value and uses it immediately, but the bounds check for that value
     only runs at the *next* iteration's entry, the current iteration's
     use is unguarded. Explicitly verify that each decoded value is
     validated before its first arithmetic use within the same iteration.
   - **Truncation after bounds check**: When a decoded uint64_t value
     passes a bounds check against a uint16_t buffer length and is then
     cast to uint16_t, the cast is safe. But when a decoded value is
     used in arithmetic *without* a prior bounds check against the
     current accumulator, the arithmetic may underflow even though the
     decode itself succeeded.

## Non-Goals

Explicitly define what is OUT OF SCOPE for this security audit.
Examples:

- Do NOT audit third-party dependencies unless they are directly
  invoked in the provided code.
- Do NOT perform dynamic testing or fuzzing — this is static analysis only.
- Do NOT attempt to prove absence of all vulnerabilities — focus on
  the stated scope and threat model.

Adjust these non-goals based on the specific audit context provided
in {{target_description}} and {{threat_model}}.

## Investigation Plan

Before beginning analysis, produce a concrete step-by-step plan:

1. **Map trust boundaries**: Identify all interfaces where untrusted
   data enters the system.
2. **Enumerate attack surface**: List every input handling path,
   authentication point, and privilege transition.
3. **Identify parser/decoder functions for deep analysis**: From the
   attack surface enumeration, identify functions that decode multiple
   fields from untrusted structured input and perform inter-value
   arithmetic (see instruction 7). List these functions explicitly —
   they will receive exhaustive path tracing.
4. **Classify**: Apply the security-vulnerability protocol systematically
   to each attack surface element.
5. **Deep-dive**: Apply the exhaustive-path-tracing protocol to each
   function identified in step 3. For each, trace every arithmetic
   operation on decoded values through every loop iteration and
   verify underflow/overflow guards exist at every use site.
6. **Rank**: Order findings by exploitability and impact.
7. **Report**: Produce the output according to the specified format.

## Quality Checklist

Before finalizing, verify:

- [ ] Every finding cites specific code evidence (file, line, function)
- [ ] Every finding has a severity rating with justification
- [ ] Confirmed vulnerabilities have concrete exploit scenarios
- [ ] Every finding rated High or Critical includes an attack scenario
- [ ] CWE identifiers are included where applicable
- [ ] At least 3 findings have been re-verified against the source
- [ ] Coverage statement documents what was and was not examined
- [ ] No fabricated vulnerabilities — unknowns marked with [UNKNOWN]
- [ ] All parser/decoder functions identified in step 3 have coverage
      ledgers from exhaustive-path-tracing (or explicit justification
      for skipping)
