<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: cwe-crypto-protocols
type: taxonomy
domain: crypto-protocols
description: >
  CWE-derived classification scheme for Cryptographic protocol design and implementation.
  63 weakness classes from CWE version 4.19.1. Use to scope
  security audits to domain-relevant vulnerability classes only.
cwe_version: "4.19.1"
applicable_to:
  - investigate-security
  - review-code
  - exhaustive-bug-hunt
---

# Taxonomy: CWE Cryptographic Protocols

This taxonomy contains 63 CWE weakness classes applicable to
Cryptographic protocol design and implementation. Derived from CWE version 4.19.1.

When performing a security audit scoped to the `crypto-protocols` domain,
**only** consider CWE IDs listed in this taxonomy. If you find something
plausible outside this subset, record it as `out-of-scope candidate`
with the CWE ID — do not expand scope.

## Classes

### CWE-20: Improper Input Validation

The product receives input or data, but it does not validate or incorrectly validates that the input has the properties that are required to process the data safely and correctly.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis; Manual Static Analysis; Fuzzing; Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial)

### CWE-311: Missing Encryption of Sensitive Data

The product does not encrypt sensitive or critical information before storage or transmission.

**Abstraction**: Class

**Detection Hints**: Manual Analysis (High); Automated Analysis; Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (High)

### CWE-326: Inadequate Encryption Strength

The product stores or transmits sensitive data using an encryption scheme that is theoretically sound, but is not strong enough for the level of protection required.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-446: UI Discrepancy for Security Feature

The user interface does not correctly enable or configure a security feature, but the interface provides feedback that causes the user to believe that the feature is in a secure state.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-636: Not Failing Securely ('Failing Open')

When the product encounters an error condition or failure, its design requires it to fall back to a state that is less secure than other options that are available, such as selecting the weakest encryption algorithm or using the most permissive access control restrictions.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-208: Observable Timing Discrepancy

Two separate operations in a product require different amounts of time to complete, in a way that is observable to an actor and reveals security-relevant information about the state of the product, such as whether a particular operation was successful or not.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-257: Storing Passwords in a Recoverable Format

The storage of passwords in a recoverable format makes them subject to password reuse attacks by malicious users. In fact, it should be noted that recoverable encrypted passwords provide no significant benefit over plaintext passwords since they are subject not only to reuse by malicious attackers but also by malicious insiders. If a system administrator can recover a password directly, or use a brute force search on the available information, the administrator can use the password on other accounts.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-294: Authentication Bypass by Capture-replay

A capture-replay flaw exists when the design of the product makes it possible for a malicious user to sniff network traffic and bypass authentication by replaying it to the server in question to the same effect as the original message (or with minor changes).

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-301: Reflection Attack in an Authentication Protocol

Simple authentication protocols are subject to reflection attacks if a malicious user can use the target machine to impersonate a trusted user.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-312: Cleartext Storage of Sensitive Information

The product stores sensitive information in cleartext within a resource that might be accessible to another control sphere.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-319: Cleartext Transmission of Sensitive Information

The product transmits sensitive or security-critical data in cleartext in a communication channel that can be sniffed by unauthorized actors.

**Abstraction**: Base

**Detection Hints**: Black Box; Automated Static Analysis (High)

### CWE-322: Key Exchange without Entity Authentication

The product performs a key exchange with an actor without verifying the identity of that actor.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-324: Use of a Key Past its Expiration Date

The product uses a cryptographic key or password past its expiration date, which diminishes its safety significantly by increasing the timing window for cracking attacks against that key.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-325: Missing Cryptographic Step

The product does not implement a required step in a cryptographic algorithm, resulting in weaker encryption than advertised by the algorithm.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-328: Use of Weak Hash

The product uses an algorithm that produces a digest (output value) that does not meet security expectations for a hash function that allows an adversary to reasonably determine the original input (preimage attack), find another input that can produce the same hash (2nd preimage attack), or find multiple inputs that evaluate to the same hash (birthday attack).

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-331: Insufficient Entropy

The product uses an algorithm or scheme that produces insufficient entropy, leaving patterns or clusters of values that are more likely to occur than others.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-335: Incorrect Usage of Seeds in Pseudo-Random Number Generator (PRNG)

The product uses a Pseudo-Random Number Generator (PRNG) but does not correctly manage seeds.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-338: Use of Cryptographically Weak Pseudo-Random Number Generator (PRNG)

The product uses a Pseudo-Random Number Generator (PRNG) in a security context, but the PRNG's algorithm is not cryptographically strong.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-342: Predictable Exact Value from Previous Values

An exact value or random number can be precisely predicted by observing previous values.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-343: Predictable Value Range from Previous Values

The product's random number generator produces a series of values which, when observed, can be used to infer a relatively small range of possibilities for the next value that could be generated.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-347: Improper Verification of Cryptographic Signature

The product does not verify, or incorrectly verifies, the cryptographic signature for data.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-385: Covert Timing Channel

Covert timing channels convey information by modulating some aspect of system behavior over time, so that the program receiving the information can observe system behavior and infer protected information.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-649: Reliance on Obfuscation or Encryption of Security-Relevant Inputs without Integrity Checking

The product uses obfuscation or encryption of inputs that should not be mutable by an external actor, but the product does not use integrity checks to detect if those inputs have been modified.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-757: Selection of Less-Secure Algorithm During Negotiation ('Algorithm Downgrade')

A protocol or its implementation supports interaction between multiple actors and allows those actors to negotiate which algorithm should be used as a protection mechanism such as encryption or authentication, but it does not select the strongest algorithm that is available to both parties.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-798: Use of Hard-coded Credentials

The product contains hard-coded credentials, such as a password or cryptographic key.

**Abstraction**: Base

**Detection Hints**: Black Box (Moderate); Automated Static Analysis; Manual Static Analysis; Manual Dynamic Analysis; Automated Static Analysis - Binary or Bytecode (SOAR Partial)

### CWE-807: Reliance on Untrusted Inputs in a Security Decision

The product uses a protection mechanism that relies on the existence or values of an input, but the input can be modified by an untrusted actor in a way that bypasses the protection mechanism.

**Abstraction**: Base

**Detection Hints**: Manual Static Analysis (High); Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial)

### CWE-916: Use of Password Hash With Insufficient Computational Effort

The product generates a hash for a password, but it uses a scheme that does not provide a sufficient level of computational effort that would make password cracking attacks infeasible or expensive.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High); Automated Static Analysis (SOAR Partial)

### CWE-1204: Generation of Weak Initialization Vector (IV)

The product uses a cryptographic primitive that uses an Initialization Vector (IV), but the product does not generate IVs that are sufficiently unpredictable or unique according to the expected cryptographic requirements for that primitive.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-1240: Use of a Cryptographic Primitive with a Risky Implementation

To fulfill the need for a cryptographic primitive, the product implements a cryptographic algorithm using a non-standard, unproven, or disallowed/non-compliant cryptographic implementation.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (High); Manual Analysis (Moderate); Dynamic Analysis with Manual Results Interpretation (Moderate)

### CWE-1243: Sensitive Non-Volatile Information Not Protected During Debug

Access to security-sensitive information stored in fuses is not limited during debug.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1256: Improper Restriction of Software Interfaces to Hardware Features

The product provides software-controllable device functionality for capabilities such as power and clock management, but it does not properly limit functionality that can lead to modification of hardware memory or register bits, or the ability to observe physical side channels.

**Abstraction**: Base

**Detection Hints**: Manual Analysis; Automated Dynamic Analysis (Moderate)

### CWE-1258: Exposure of Sensitive System Information Due to Uncleared Debug Information

The hardware does not fully clear security-sensitive values, such as keys and intermediate values in cryptographic operations, when debug mode is entered.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1268: Policy Privileges are not Assigned Consistently Between Control and Data Agents

The product's hardware-enforced access control for a particular resource improperly accounts for privilege discrepancies between control and write policies.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1291: Public Key Re-Use for Signing both Debug and Production Code

The same public key is used for signing both debug and production code.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (High); Dynamic Analysis with Manual Results Interpretation (High)

### CWE-1300: Improper Protection of Physical Side Channels

The device does not contain sufficient protection mechanisms to prevent physical side channels from exposing sensitive information due to patterns in physically observable phenomena such as variations in power consumption, electromagnetic emissions (EME), or acoustic emissions.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate)

### CWE-1319: Improper Protection against Electromagnetic Fault Injection (EM-FI)

The device is susceptible to electromagnetic fault injection attacks, causing device internal information to be compromised or security mechanisms to be bypassed.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1351: Improper Handling of Hardware Behavior in Exceptionally Cold Environments

A hardware device, or the firmware running on it, is missing or has incorrect protection features to maintain goals of security primitives when the device is cooled below standard operating temperatures.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1392: Use of Default Credentials

The product uses default credentials (such as passwords or cryptographic keys) for potentially critical functionality.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1394: Use of Default Cryptographic Key

The product uses a default cryptographic key for potentially critical functionality.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1428: Reliance on HTTP instead of HTTPS

The product provides or relies on use of HTTP communications when HTTPS is available.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1431: Driving Intermediate Cryptographic State/Results to Hardware Module Outputs

The product uses a hardware module implementing a cryptographic algorithm that writes sensitive information about the intermediate state or results of its cryptographic operations via one of its output wires (typically the output port containing the final result).

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Source Code (High); Simulation / Emulation (High); Formal Verification (High); Manual Analysis (Opportunistic)

### CWE-297: Improper Validation of Certificate with Host Mismatch

The product communicates with a host that provides a certificate, but the product does not properly ensure that the certificate is actually associated with that host.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High); Dynamic Analysis with Manual Results Interpretation; Black Box

### CWE-298: Improper Validation of Certificate Expiration

A certificate expiration is not validated or is incorrectly validated, so trust may be assigned to certificates that have been abandoned due to age.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-313: Cleartext Storage in a File or on Disk

The product stores sensitive information in cleartext in a file, or on disk.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-314: Cleartext Storage in the Registry

The product stores sensitive information in cleartext in the registry.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-315: Cleartext Storage of Sensitive Information in a Cookie

The product stores sensitive information in cleartext in a cookie.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-316: Cleartext Storage of Sensitive Information in Memory

The product stores sensitive information in cleartext in memory.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-317: Cleartext Storage of Sensitive Information in GUI

The product stores sensitive information in cleartext within the GUI.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-318: Cleartext Storage of Sensitive Information in Executable

The product stores sensitive information in cleartext in an executable.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-321: Use of Hard-coded Cryptographic Key

The product uses a hard-coded, unchangeable cryptographic key.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-329: Generation of Predictable IV with CBC Mode

The product generates and uses a predictable initialization Vector (IV) with Cipher Block Chaining (CBC) Mode, which causes algorithms to be susceptible to dictionary attacks when they are encrypted under the same key.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-332: Insufficient Entropy in PRNG

The lack of entropy available for, or used by, a Pseudo-Random Number Generator (PRNG) can be a stability and security threat.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-333: Improper Handling of Insufficient Entropy in TRNG

True random number generators (TRNG) generally have a limited source of entropy and therefore can fail or block.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-336: Same Seed in Pseudo-Random Number Generator (PRNG)

A Pseudo-Random Number Generator (PRNG) uses the same seed each time the product is initialized.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-337: Predictable Seed in Pseudo-Random Number Generator (PRNG)

A Pseudo-Random Number Generator (PRNG) is initialized from a predictable seed, such as the process ID or system time.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-339: Small Seed Space in PRNG

A Pseudo-Random Number Generator (PRNG) uses a relatively small seed space, which makes it more susceptible to brute force attacks.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-593: Authentication Bypass: OpenSSL CTX Object Modified after SSL Objects are Created

The product modifies the SSL context after connection creation has begun.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-599: Missing Validation of OpenSSL Certificate

The product uses OpenSSL and trusts or uses a certificate without using the SSL_get_verify_result() function to ensure that the certificate satisfies all necessary security requirements.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-759: Use of a One-Way Hash without a Salt

The product uses a one-way cryptographic hash against an input that should not be reversible, such as a password, but the product does not also use a salt as part of the input.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High); Automated Static Analysis (SOAR Partial)

### CWE-760: Use of a One-Way Hash with a Predictable Salt

The product uses a one-way cryptographic hash against an input that should not be reversible, such as a password, but the product uses a predictable salt as part of the input.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-780: Use of RSA Algorithm without OAEP

The product uses the RSA algorithm but does not incorporate Optimal Asymmetric Encryption Padding (OAEP), which might weaken the encryption.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-1239: Improper Zeroization of Hardware Register

The hardware product does not properly clear sensitive information from built-in registers when the user of the hardware block changes.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1330: Remanent Data Readable after Memory Erase

Confidential information stored in memory circuits is readable or recoverable after being cleared or erased.

**Abstraction**: Variant

**Detection Hints**: Architecture or Design Review; Dynamic Analysis with Manual Results Interpretation

## Summary

| Abstraction | Count |
|-------------|-------|
| Pillar      | 0     |
| Class       | 5     |
| Base        | 36    |
| Variant     | 22    |
| Compound    | 0     |
| **Total**   | **63** |
