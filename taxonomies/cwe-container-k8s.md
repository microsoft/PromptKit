<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: cwe-container-k8s
type: taxonomy
domain: container-k8s
description: >
  CWE-derived classification scheme for Container and Kubernetes workloads.
  5 weakness classes from CWE version 4.19.1. Use to scope
  security audits to domain-relevant vulnerability classes only.
cwe_version: "4.19.1"
applicable_to:
  - investigate-security
  - review-code
  - review-cpp-code
  - exhaustive-bug-hunt
---

# Taxonomy: CWE Container and Kubernetes

This taxonomy contains 5 CWE weakness classes applicable to
Container and Kubernetes workloads. Derived from CWE version 4.19.1.

When performing a security audit scoped to the `container-k8s` domain,
**only** consider CWE IDs listed in this taxonomy. If you find something
plausible outside this subset, record it as `out-of-scope candidate`
with the CWE ID — do not expand scope.

## Classes

### CWE-642: External Control of Critical State Data

The product stores security-critical state information about its users, or the product itself, in a location that is accessible to unauthorized actors.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High); Fuzzing

### CWE-214: Invocation of Process Using Visible Sensitive Information

A process is invoked with sensitive command-line arguments, environment variables, or other elements that can be seen by other processes on the operating system.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-426: Untrusted Search Path

The product searches for critical resources using an externally-supplied search path that can point to resources that are not under the product's direct control.

**Abstraction**: Base

**Detection Hints**: Black Box; Automated Static Analysis (High); Manual Analysis

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
| Class       | 1     |
| Base        | 2     |
| Variant     | 2     |
| Compound    | 0     |
| **Total**   | **5** |
