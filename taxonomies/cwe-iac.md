<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: cwe-iac
type: taxonomy
domain: iac
description: >
  CWE-derived classification scheme for Infrastructure as Code (Terraform, Bicep, ARM, etc.).
  8 weakness classes from CWE version 4.19.1. Use to scope
  security audits to domain-relevant vulnerability classes only.
cwe_version: "4.19.1"
---

> This file contains data derived from the Common Weakness Enumeration
> (CWE™) maintained by The MITRE Corporation. © 2006–2026 The MITRE
> Corporation. Used under the CWE Terms of Use.
>
> See THIRD-PARTY-NOTICES.md in the repository root for the full
> license text, or visit:
> https://cwe.mitre.org/about/termsofuse.html

# Taxonomy: CWE Infrastructure as Code

This taxonomy contains 8 CWE weakness classes applicable to
Infrastructure as Code (Terraform, Bicep, ARM, etc.). Derived from CWE version 4.19.1.

When performing a security audit scoped to the `iac` domain,
**only** consider CWE IDs listed in this taxonomy. If you find something
plausible outside this subset, record it as `out-of-scope candidate`
with the CWE ID — do not expand scope.

## Classes

### CWE-642: External Control of Critical State Data

The product stores security-critical state information about its users, or the product itself, in a location that is accessible to unauthorized actors.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High); Fuzzing

### CWE-1391: Use of Weak Credentials

The product uses weak credentials (such as a default key or hard-coded password) that can be calculated, derived, reused, or guessed by an attacker.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-214: Invocation of Process Using Visible Sensitive Information

A process is invoked with sensitive command-line arguments, environment variables, or other elements that can be seen by other processes on the operating system.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-426: Untrusted Search Path

The product searches for critical resources using an externally-supplied search path that can point to resources that are not under the product's direct control.

**Abstraction**: Base

**Detection Hints**: Black Box; Automated Static Analysis (High); Manual Analysis

### CWE-798: Use of Hard-coded Credentials

The product contains hard-coded credentials, such as a password or cryptographic key.

**Abstraction**: Base

**Detection Hints**: Black Box (Moderate); Automated Static Analysis; Manual Static Analysis; Manual Dynamic Analysis; Automated Static Analysis - Binary or Bytecode (SOAR Partial)

### CWE-1393: Use of Default Password

The product uses default passwords for potentially critical functionality.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-154: Improper Neutralization of Variable Name Delimiters

The product receives input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could be interpreted as variable name delimiters when they are sent to a downstream component.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-526: Cleartext Storage of Sensitive Information in an Environment Variable

The product uses an environment variable to store unencrypted sensitive information.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

## Summary

| Abstraction | Count |
|-------------|-------|
| Pillar      | 0     |
| Class       | 2     |
| Base        | 4     |
| Variant     | 2     |
| Compound    | 0     |
| **Total**   | **8** |
