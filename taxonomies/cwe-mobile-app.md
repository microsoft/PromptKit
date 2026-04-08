<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: cwe-mobile-app
type: taxonomy
domain: mobile-app
description: >
  CWE-derived classification scheme for Mobile applications (iOS, Android).
  23 weakness classes from CWE version 4.19.1. Use to scope
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

# Taxonomy: CWE Mobile Applications

This taxonomy contains 23 CWE weakness classes applicable to
Mobile applications (iOS, Android). Derived from CWE version 4.19.1.

When performing a security audit scoped to the `mobile-app` domain,
**only** consider CWE IDs listed in this taxonomy. If you find something
plausible outside this subset, record it as `out-of-scope candidate`
with the CWE ID — do not expand scope.

## Classes

### CWE-200: Exposure of Sensitive Information to an Unauthorized Actor

The product exposes sensitive information to an actor that is not explicitly authorized to have access to that information.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (High); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High)

### CWE-362: Concurrent Execution using Shared Resource with Improper Synchronization ('Race Condition')

The product contains a concurrent code sequence that requires temporary, exclusive access to a shared resource, but a timing window exists in which the shared resource can be modified by another code sequence operating concurrently.

**Abstraction**: Class

**Detection Hints**: Black Box; White Box; Automated Dynamic Analysis (Moderate); Automated Static Analysis - Binary or Bytecode (High); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-602: Client-Side Enforcement of Server-Side Security

The product is composed of a server that relies on the client to implement a mechanism that is intended to protect the server.

**Abstraction**: Class

**Detection Hints**: Fuzzing; Manual Analysis

### CWE-672: Operation on a Resource after Expiration or Release

The product uses, accesses, or otherwise operates on a resource after that resource has been expired, released, or revoked.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-250: Execution with Unnecessary Privileges

The product performs an operation at a privilege level that is higher than the minimum level required, which creates new weaknesses or amplifies the consequences of other weaknesses.

**Abstraction**: Base

**Detection Hints**: Manual Analysis; Black Box; Automated Static Analysis - Binary or Bytecode (High); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-295: Improper Certificate Validation

The product does not validate, or incorrectly validates, a certificate.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (High); Manual Static Analysis - Source Code (High)

### CWE-312: Cleartext Storage of Sensitive Information

The product stores sensitive information in cleartext within a resource that might be accessible to another control sphere.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-319: Cleartext Transmission of Sensitive Information

The product transmits sensitive or security-critical data in cleartext in a communication channel that can be sniffed by unauthorized actors.

**Abstraction**: Base

**Detection Hints**: Black Box; Automated Static Analysis (High)

### CWE-359: Exposure of Private Personal Information to an Unauthorized Actor

The product does not properly prevent a person's private, personal information from being accessed by actors who either (1) are not explicitly authorized to access the information or (2) do not have the implicit consent of the person about whom the information is collected.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (High); Automated Static Analysis (High); Automated Static Analysis

### CWE-511: Logic/Time Bomb

The product contains code that is designed to disrupt the legitimate operation of the product (or its environment) when a certain time passes, or when a certain logical condition is met.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-772: Missing Release of Resource after Effective Lifetime

The product does not release a resource after its effective lifetime has ended, i.e., after the resource is no longer needed.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-798: Use of Hard-coded Credentials

The product contains hard-coded credentials, such as a password or cryptographic key.

**Abstraction**: Base

**Detection Hints**: Black Box (Moderate); Automated Static Analysis; Manual Static Analysis; Manual Dynamic Analysis; Automated Static Analysis - Binary or Bytecode (SOAR Partial)

### CWE-920: Improper Restriction of Power Consumption

The product operates in an environment in which power is a limited resource that cannot be automatically replenished, but the product does not properly restrict the amount of power that its operation consumes.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-921: Storage of Sensitive Data in a Mechanism without Access Control

The product stores sensitive information in a file system or device that does not have built-in access control.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-939: Improper Authorization in Handler for Custom URL Scheme

The product uses a handler for a custom URL scheme, but it does not properly restrict which actors can invoke the handler using the scheme.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-940: Improper Verification of Source of a Communication Channel

The product establishes a communication channel to handle an incoming request that has been initiated by an actor, but it does not properly verify that the request is coming from the expected origin.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-941: Incorrectly Specified Destination in a Communication Channel

The product creates a communication channel to initiate an outgoing request to an actor, but it does not correctly specify the intended destination for that actor.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1256: Improper Restriction of Software Interfaces to Hardware Features

The product provides software-controllable device functionality for capabilities such as power and clock management, but it does not properly limit functionality that can lead to modification of hardware memory or register bits, or the ability to observe physical side channels.

**Abstraction**: Base

**Detection Hints**: Manual Analysis; Automated Dynamic Analysis (Moderate)

### CWE-1420: Exposure of Sensitive Information during Transient Execution

A processor event or prediction may allow incorrect operations (or correct operations with incorrect data) to execute transiently, potentially exposing data over a covert channel.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate); Fuzzing (Opportunistic); Automated Static Analysis (Limited); Automated Analysis (High)

### CWE-297: Improper Validation of Certificate with Host Mismatch

The product communicates with a host that provides a certificate, but the product does not properly ensure that the certificate is actually associated with that host.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High); Dynamic Analysis with Manual Results Interpretation; Black Box

### CWE-925: Improper Verification of Intent by Broadcast Receiver

The Android application uses a Broadcast Receiver that receives an Intent but does not properly verify that the Intent came from an authorized source.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-926: Improper Export of Android Application Components

The Android application exports a component for use by other applications, but does not properly restrict which applications can launch the component or access the data it contains.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-927: Use of Implicit Intent for Sensitive Communication

The Android application uses an implicit intent for transmitting sensitive data to other applications.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

## Summary

| Abstraction | Count |
|-------------|-------|
| Pillar      | 0     |
| Class       | 4     |
| Base        | 15    |
| Variant     | 4     |
| Compound    | 0     |
| **Total**   | **23** |
