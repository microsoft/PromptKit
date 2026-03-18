<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) Standard Prompt Library Contributors -->

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
  - analysis/security-vulnerability
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
   - Map trust boundaries
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
   - Include CWE identifiers for each finding where applicable
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
3. **Classify**: Apply the security-vulnerability protocol systematically
   to each attack surface element.
4. **Rank**: Order findings by exploitability and impact.
5. **Report**: Produce the output according to the specified format.
