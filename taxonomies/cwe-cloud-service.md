<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: cwe-cloud-service
type: taxonomy
domain: cloud-service
description: >
  CWE-derived classification scheme for Cloud-hosted services and APIs.
  113 weakness classes from CWE version 4.19.1. Use to scope
  security audits to domain-relevant vulnerability classes only.
cwe_version: "4.19.1"
applicable_to:
  - investigate-security
  - review-code
  - exhaustive-bug-hunt
---

# Taxonomy: CWE Cloud Service

This taxonomy contains 113 CWE weakness classes applicable to
Cloud-hosted services and APIs. Derived from CWE version 4.19.1.

When performing a security audit scoped to the `cloud-service` domain,
**only** consider CWE IDs listed in this taxonomy. If you find something
plausible outside this subset, record it as `out-of-scope candidate`
with the CWE ID — do not expand scope.

## Classes

### CWE-284: Improper Access Control

The product does not restrict or incorrectly restricts access to a resource from an unauthorized actor.

**Abstraction**: Pillar

**Detection Hints**: No specific detection method documented in CWE.

### CWE-200: Exposure of Sensitive Information to an Unauthorized Actor

The product exposes sensitive information to an actor that is not explicitly authorized to have access to that information.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (High); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High)

### CWE-285: Improper Authorization

The product does not perform or incorrectly performs an authorization check when an actor attempts to access a resource or perform an action.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (Limited); Automated Dynamic Analysis; Manual Analysis (Moderate); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-405: Asymmetric Resource Consumption (Amplification)

The product does not properly control situations in which an adversary can cause the product to consume or produce excessive resources without requiring the adversary to invest equivalent work or otherwise prove authorization, i.e., the adversary's influence is "asymmetric.".

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-446: UI Discrepancy for Security Feature

The user interface does not correctly enable or configure a security feature, but the interface provides feedback that causes the user to believe that the feature is in a secure state.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-514: Covert Channel

A covert channel is a path that can be used to transfer information in a way not intended by the system's designers.

**Abstraction**: Class

**Detection Hints**: Architecture or Design Review (SOAR Partial)

### CWE-522: Insufficiently Protected Credentials

The product transmits or stores authentication credentials, but it uses an insecure method that is susceptible to unauthorized interception and/or retrieval.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-636: Not Failing Securely ('Failing Open')

When the product encounters an error condition or failure, its design requires it to fall back to a state that is less secure than other options that are available, such as selecting the weakest encryption algorithm or using the most permissive access control restrictions.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-642: External Control of Critical State Data

The product stores security-critical state information about its users, or the product itself, in a location that is accessible to unauthorized actors.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High); Fuzzing

### CWE-665: Improper Initialization

The product does not initialize or incorrectly initializes a resource, which might leave the resource in an unexpected state when it is accessed or used.

**Abstraction**: Class

**Detection Hints**: Automated Dynamic Analysis (Moderate); Manual Dynamic Analysis; Automated Static Analysis (High)

### CWE-671: Lack of Administrator Control over Security

The product uses security features in a way that prevents the product's administrator from tailoring security settings to reflect the environment in which the product is being used. This introduces resultant weaknesses or prevents it from operating at a level of security that is desired by the administrator.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-732: Incorrect Permission Assignment for Critical Resource

The product specifies permissions for a security-critical resource in a way that allows that resource to be read or modified by unintended actors.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis; Automated Dynamic Analysis; Manual Analysis; Manual Static Analysis; Manual Dynamic Analysis

### CWE-799: Improper Control of Interaction Frequency

The product does not properly limit the number or frequency of interactions that it has with an actor, such as the number of incoming requests.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-841: Improper Enforcement of Behavioral Workflow

The product supports a session in which more than one behavior must be performed by an actor, but it does not properly ensure that the actor performs the behaviors in the required sequence.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis

### CWE-862: Missing Authorization

The product does not perform an authorization check when an actor attempts to access a resource or perform an action.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (Limited); Automated Dynamic Analysis; Manual Analysis (Moderate); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-863: Incorrect Authorization

The product performs an authorization check when an actor attempts to access a resource or perform an action, but it does not correctly perform the check.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (Limited); Automated Dynamic Analysis; Manual Analysis (Moderate); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-923: Improper Restriction of Communication Channel to Intended Endpoints

The product establishes a communication channel to (or from) an endpoint for privileged or protected operations, but it does not properly ensure that it is communicating with the correct endpoint.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-1390: Weak Authentication

The product uses an authentication mechanism to restrict access to specific users or identities, but the mechanism does not sufficiently prove that the claimed identity is correct.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1391: Use of Weak Credentials

The product uses weak credentials (such as a default key or hard-coded password) that can be calculated, derived, reused, or guessed by an attacker.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1419: Incorrect Initialization of Resource

The product attempts to initialize a resource but does not correctly do so, which might leave the resource in an unexpected, incorrect, or insecure state when it is accessed.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis

### CWE-214: Invocation of Process Using Visible Sensitive Information

A process is invoked with sensitive command-line arguments, environment variables, or other elements that can be seen by other processes on the operating system.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-256: Plaintext Storage of a Password

The product stores a password in plaintext within resources such as memory or files.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-257: Storing Passwords in a Recoverable Format

The storage of passwords in a recoverable format makes them subject to password reuse attacks by malicious users. In fact, it should be noted that recoverable encrypted passwords provide no significant benefit over plaintext passwords since they are subject not only to reuse by malicious attackers but also by malicious insiders. If a system administrator can recover a password directly, or use a brute force search on the available information, the administrator can use the password on other accounts.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-260: Password in Configuration File

The product stores a password in a configuration file that might be accessible to actors who do not know the password.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-261: Weak Encoding for Password

Obscuring a password with a trivial encoding does not protect the password.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-262: Not Using Password Aging

The product does not have a mechanism in place for managing password aging.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-263: Password Aging with Long Expiration

The product supports password aging, but the expiration period is too long.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-288: Authentication Bypass Using an Alternate Path or Channel

The product requires authentication, but the product has an alternate path or channel that does not require authentication.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-289: Authentication Bypass by Alternate Name

The product performs authentication based on the name of a resource being accessed, or the name of the actor performing the access, but it does not properly check all possible names for that resource or actor.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-290: Authentication Bypass by Spoofing

This attack-focused weakness is caused by incorrectly implemented authentication schemes that are subject to spoofing attacks.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-294: Authentication Bypass by Capture-replay

A capture-replay flaw exists when the design of the product makes it possible for a malicious user to sniff network traffic and bypass authentication by replaying it to the server in question to the same effect as the original message (or with minor changes).

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-296: Improper Following of a Certificate's Chain of Trust

The product does not follow, or incorrectly follows, the chain of trust for a certificate back to a trusted root certificate, resulting in incorrect trust of any resource that is associated with that certificate.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-301: Reflection Attack in an Authentication Protocol

Simple authentication protocols are subject to reflection attacks if a malicious user can use the target machine to impersonate a trusted user.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-302: Authentication Bypass by Assumed-Immutable Data

The authentication scheme or implementation uses key data elements that are assumed to be immutable, but can be controlled or modified by the attacker.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-303: Incorrect Implementation of Authentication Algorithm

The requirements for the product dictate the use of an established authentication algorithm, but the implementation of the algorithm is incorrect.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-304: Missing Critical Step in Authentication

The product implements an authentication technique, but it skips a step that weakens the technique.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-305: Authentication Bypass by Primary Weakness

The authentication algorithm is sound, but the implemented mechanism can be bypassed as the result of a separate weakness that is primary to the authentication error.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-306: Missing Authentication for Critical Function

The product does not perform any authentication for functionality that requires a provable user identity or consumes a significant amount of resources.

**Abstraction**: Base

**Detection Hints**: Manual Analysis; Automated Static Analysis (Limited); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial)

### CWE-307: Improper Restriction of Excessive Authentication Attempts

The product does not implement sufficient measures to prevent multiple failed authentication attempts within a short time frame.

**Abstraction**: Base

**Detection Hints**: Dynamic Analysis with Automated Results Interpretation (High); Dynamic Analysis with Manual Results Interpretation (High); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (SOAR Partial); Automated Static Analysis (SOAR Partial)

### CWE-308: Use of Single-factor Authentication

The product uses an authentication algorithm that uses a single factor (e.g., a password) in a security context that should require more than one factor.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-309: Use of Password System for Primary Authentication

The use of password systems as the primary means of authentication may be subject to several flaws or shortcomings, each reducing the effectiveness of the mechanism.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-322: Key Exchange without Entity Authentication

The product performs a key exchange with an actor without verifying the identity of that actor.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-324: Use of a Key Past its Expiration Date

The product uses a cryptographic key or password past its expiration date, which diminishes its safety significantly by increasing the timing window for cracking attacks against that key.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-328: Use of Weak Hash

The product uses an algorithm that produces a digest (output value) that does not meet security expectations for a hash function that allows an adversary to reasonably determine the original input (preimage attack), find another input that can produce the same hash (2nd preimage attack), or find multiple inputs that evaluate to the same hash (birthday attack).

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-359: Exposure of Private Personal Information to an Unauthorized Actor

The product does not properly prevent a person's private, personal information from being accessed by actors who either (1) are not explicitly authorized to access the information or (2) do not have the implicit consent of the person about whom the information is collected.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (High); Automated Static Analysis (High); Automated Static Analysis

### CWE-360: Trust of System Event Data

Security based on event locations are insecure and can be spoofed.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-408: Incorrect Behavior Order: Early Amplification

The product allows an entity to perform a legitimate but expensive operation before authentication or authorization has taken place.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-421: Race Condition During Access to Alternate Channel

The product opens an alternate channel to communicate with an authorized user, but the channel is accessible to other actors.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-425: Direct Request ('Forced Browsing')

The web application does not adequately enforce appropriate authorization on all restricted URLs, scripts, or files.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-426: Untrusted Search Path

The product searches for critical resources using an externally-supplied search path that can point to resources that are not under the product's direct control.

**Abstraction**: Base

**Detection Hints**: Black Box; Automated Static Analysis (High); Manual Analysis

### CWE-472: External Control of Assumed-Immutable Web Parameter

The web application does not sufficiently verify inputs that are assumed to be immutable but are actually externally controllable, such as hidden form fields.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-523: Unprotected Transport of Credentials

Login pages do not use adequate measures to protect the user name and password while they are in transit from the client to the server.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-551: Incorrect Behavior Order: Authorization Before Parsing and Canonicalization

If a web server does not fully parse requested URLs before it examines them for authorization, it may be possible for an attacker to bypass authorization protection.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-552: Files or Directories Accessible to External Parties

The product makes files or directories accessible to unauthorized actors, even though they should not be.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-603: Use of Client-Side Authentication

A client/server product performs authentication within client code but not in server code, allowing server-side authentication to be bypassed via a modified client that omits the authentication check.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-612: Improper Authorization of Index Containing Sensitive Information

The product creates a search index of private or sensitive documents, but it does not properly limit index access to actors who are authorized to see the original information.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-613: Insufficient Session Expiration

According to WASC, "Insufficient Session Expiration is when a web site permits an attacker to reuse old session credentials or session IDs for authorization.".

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-620: Unverified Password Change

When setting a new password for a user, the product does not require knowledge of the original password, or using another form of authentication.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-639: Authorization Bypass Through User-Controlled Key

The system's authorization functionality does not prevent one user from gaining access to another user's data or record by modifying the key value identifying the data.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-640: Weak Password Recovery Mechanism for Forgotten Password

The product contains a mechanism for users to recover or change their passwords without knowing the original password, but the mechanism is weak.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-643: Improper Neutralization of Data within XPath Expressions ('XPath Injection')

The product uses external input to dynamically construct an XPath expression used to retrieve data from an XML database, but it does not neutralize or incorrectly neutralizes that input. This allows an attacker to control the structure of the query.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-645: Overly Restrictive Account Lockout Mechanism

The product contains an account lockout protection mechanism, but the mechanism is too restrictive and can be triggered too easily, which allows attackers to deny service to legitimate users by causing their accounts to be locked out.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-652: Improper Neutralization of Data within XQuery Expressions ('XQuery Injection')

The product uses external input to dynamically construct an XQuery expression used to retrieve data from an XML database, but it does not neutralize or incorrectly neutralizes that input. This allows an attacker to control the structure of the query.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-757: Selection of Less-Secure Algorithm During Negotiation ('Algorithm Downgrade')

A protocol or its implementation supports interaction between multiple actors and allows those actors to negotiate which algorithm should be used as a protection mechanism such as encryption or authentication, but it does not select the strongest algorithm that is available to both parties.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-778: Insufficient Logging

When a security-critical event occurs, the product either does not record the event or omits important details about the event when logging it.

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

### CWE-836: Use of Password Hash Instead of Password for Authentication

The product records password hashes in a data store, receives a hash of a password from a client, and compares the supplied hash to the hash obtained from the data store.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-916: Use of Password Hash With Insufficient Computational Effort

The product generates a hash for a password, but it uses a scheme that does not provide a sufficient level of computational effort that would make password cracking attacks infeasible or expensive.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High); Automated Static Analysis (SOAR Partial)

### CWE-921: Storage of Sensitive Data in a Mechanism without Access Control

The product stores sensitive information in a file system or device that does not have built-in access control.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1191: On-Chip Debug and Test Interface With Improper Access Control

The chip does not implement or does not correctly perform access control to check whether users are authorized to access internal registers and test modes through the physical debug/test interface.

**Abstraction**: Base

**Detection Hints**: Dynamic Analysis with Manual Results Interpretation; Fuzzing (Moderate)

### CWE-1244: Internal Asset Exposed to Unsafe Debug Access Level or State

The product uses physical debug or test interfaces with support for multiple access levels, but it assigns the wrong debug access level to an internal asset, providing unintended access to the asset from untrusted debug agents.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate)

### CWE-1247: Improper Protection Against Voltage and Clock Glitches

The device does not contain or contains incorrectly implemented circuitry or sensors to detect and mitigate voltage and clock glitches and protect sensitive information or software contained on the device.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate); Dynamic Analysis with Manual Results Interpretation; Architecture or Design Review

### CWE-1249: Application-Level Admin Tool with Inconsistent View of Underlying Operating System

The product provides an application for administrators to manage parts of the underlying operating system, but the application does not accurately identify all of the relevant entities or resources that exist in the OS; that is, the application's model of the OS's state is inconsistent with the OS's actual state.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1254: Incorrect Comparison Logic Granularity

The product's comparison logic is performed over a series of steps rather than across the entire string in one operation. If there is a comparison logic failure on one of these steps, the operation may be vulnerable to a timing attack that can result in the interception of the process for nefarious purposes.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1256: Improper Restriction of Software Interfaces to Hardware Features

The product provides software-controllable device functionality for capabilities such as power and clock management, but it does not properly limit functionality that can lead to modification of hardware memory or register bits, or the ability to observe physical side channels.

**Abstraction**: Base

**Detection Hints**: Manual Analysis; Automated Dynamic Analysis (Moderate)

### CWE-1257: Improper Access Control Applied to Mirrored or Aliased Memory Regions

Aliased or mirrored memory regions in hardware designs may have inconsistent read/write permissions enforced by the hardware. A possible result is that an untrusted agent is blocked from accessing a memory region but is not blocked from accessing the corresponding aliased memory region.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1260: Improper Handling of Overlap Between Protected Memory Ranges

The product allows address regions to overlap, which can result in the bypassing of intended memory protection.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (High)

### CWE-1262: Improper Access Control for Register Interface

The product uses memory-mapped I/O registers that act as an interface to hardware functionality from software, but there is improper access control to those registers.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate); Simulation / Emulation (Moderate); Formal Verification (High); Automated Analysis (High); Architecture or Design Review (Moderate)

### CWE-1268: Policy Privileges are not Assigned Consistently Between Control and Data Agents

The product's hardware-enforced access control for a particular resource improperly accounts for privilege discrepancies between control and write policies.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1274: Improper Access Control for Volatile Memory Containing Boot Code

The product conducts a secure-boot process that transfers bootloader code from Non-Volatile Memory (NVM) into Volatile Memory (VM), but it does not have sufficient access control or other protections for the Volatile Memory.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (High); Manual Analysis (Moderate)

### CWE-1282: Assumed-Immutable Data is Stored in Writable Memory

Immutable data, such as a first-stage bootloader, device identifiers, and "write-once" configuration settings are stored in writable memory that can be re-programmed or updated in the field.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1283: Mutable Attestation or Measurement Reporting Data

The register contents used for attestation or measurement reporting data to verify boot flow are modifiable by an adversary.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1299: Missing Protection Mechanism for Alternate Hardware Interface

The lack of protections on alternate paths to access control-protected assets (such as unprotected shadow registers and other external facing unguarded interfaces) allows an attacker to bypass existing protections to the asset that are only performed against the primary path.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1316: Fabric-Address Map Allows Programming of Unwarranted Overlaps of Protected and Unprotected Ranges

The address map of the on-chip fabric has protected and unprotected regions overlapping, allowing an attacker to bypass access control to the overlapping portion of the protected region.

**Abstraction**: Base

**Detection Hints**: Automated Dynamic Analysis (High); Manual Static Analysis (High)

### CWE-1317: Improper Access Control in Fabric Bridge

The product uses a fabric bridge for transactions between two Intellectual Property (IP) blocks, but the bridge does not properly perform the expected privilege, identity, or other access control checks between those IP blocks.

**Abstraction**: Base

**Detection Hints**: Simulation / Emulation (High); Formal Verification (High)

### CWE-1318: Missing Support for Security Features in On-chip Fabrics or Buses

On-chip fabrics or buses either do not support or are not configured to support privilege separation or other security features, such as access control.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (High); Manual Static Analysis - Source Code (High)

### CWE-1326: Missing Immutable Root of Trust in Hardware

A missing immutable root of trust in the hardware results in the ability to bypass secure boot or execute untrusted or adversarial boot code.

**Abstraction**: Base

**Detection Hints**: Automated Dynamic Analysis (High); Architecture or Design Review (High)

### CWE-1327: Binding to an Unrestricted IP Address

The product assigns the address 0.0.0.0 for a database server, a cloud service/instance, or any computing resource that communicates remotely.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1332: Improper Handling of Faults that Lead to Instruction Skips

The device is missing or incorrectly implements circuitry or sensors that detect and mitigate the skipping of security-critical CPU instructions when they occur.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (Moderate); Simulation / Emulation (Moderate); Manual Analysis (Moderate)

### CWE-1389: Incorrect Parsing of Numbers with Different Radices

The product parses numeric input assuming base 10 (decimal) values, but it does not account for inputs that use a different base number (radix).

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-1392: Use of Default Credentials

The product uses default credentials (such as passwords or cryptographic keys) for potentially critical functionality.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1393: Use of Default Password

The product uses default passwords for potentially critical functionality.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1394: Use of Default Cryptographic Key

The product uses a default cryptographic key for potentially critical functionality.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-154: Improper Neutralization of Variable Name Delimiters

The product receives input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could be interpreted as variable name delimiters when they are sent to a downstream component.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-187: Partial String Comparison

The product performs a comparison that only examines a portion of a factor before determining whether there is a match, such as a substring, leading to resultant weaknesses.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-206: Observable Internal Behavioral Discrepancy

The product performs multiple behaviors that are combined to produce a single result, but the individual behaviors are observable separately in a way that allows attackers to reveal internal state or internal decision points.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-219: Storage of File with Sensitive Data Under Web Root

The product stores sensitive data under the web document root with insufficient access control, which might make it accessible to untrusted parties.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-220: Storage of File With Sensitive Data Under FTP Root

The product stores sensitive data under the FTP server root with insufficient access control, which might make it accessible to untrusted parties.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-258: Empty Password in Configuration File

Using an empty string as a password is insecure.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-259: Use of Hard-coded Password

The product contains a hard-coded password, which it uses for its own inbound authentication or for outbound communication to external components.

**Abstraction**: Variant

**Detection Hints**: Manual Analysis; Black Box; Automated Static Analysis (High)

### CWE-291: Reliance on IP Address for Authentication

The product uses an IP address for authentication.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-350: Reliance on Reverse DNS Resolution for a Security-Critical Action

The product performs reverse DNS resolution on an IP address to obtain the hostname and make a security decision, but it does not properly ensure that the IP address is truly associated with the hostname.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-520: .NET Misconfiguration: Use of Impersonation

Allowing a .NET application to run at potentially escalated levels of access to the underlying operating and file systems can be dangerous and result in various forms of attacks.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-526: Cleartext Storage of Sensitive Information in an Environment Variable

The product uses an environment variable to store unencrypted sensitive information.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-529: Exposure of Access Control List Files to an Unauthorized Control Sphere

The product stores access control list files in a directory or other container that is accessible to actors outside of the intended control sphere.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-647: Use of Non-Canonical URL Paths for Authorization Decisions

The product defines policy namespaces and makes authorization decisions based on the assumption that a URL is canonical. This can allow a non-canonical URL to bypass the authorization.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-650: Trusting HTTP Permission Methods on the Server Side

The server contains a protection mechanism that assumes that any URI that is accessed using HTTP GET will not cause a state change to the associated resource. This might allow attackers to bypass intended access restrictions and conduct resource modification and deletion attacks, since some applications allow GET to modify state.

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

### CWE-784: Reliance on Cookies without Validation and Integrity Checking in a Security Decision

The product uses a protection mechanism that relies on the existence or values of a cookie, but it does not properly ensure that the cookie is valid for the associated user.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-925: Improper Verification of Intent by Broadcast Receiver

The Android application uses a Broadcast Receiver that receives an Intent but does not properly verify that the Intent came from an authorized source.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-384: Session Fixation

Authenticating a user, or otherwise establishing a new user session, without invalidating any existing session identifier gives an attacker the opportunity to steal authenticated sessions.

**Abstraction**: Compound

**Detection Hints**: No specific detection method documented in CWE.

## Summary

| Abstraction | Count |
|-------------|-------|
| Pillar      | 1     |
| Class       | 19    |
| Base        | 74    |
| Variant     | 18    |
| Compound    | 1     |
| **Total**   | **113** |
