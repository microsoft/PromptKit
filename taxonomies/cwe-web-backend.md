<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: cwe-web-backend
type: taxonomy
domain: web-backend
description: >
  CWE-derived classification scheme for Server-side web applications (any language).
  423 weakness classes from CWE version 4.19.1. Use to scope
  security audits to domain-relevant vulnerability classes only.
cwe_version: "4.19.1"
---

# Taxonomy: CWE Web Backend

This taxonomy contains 423 CWE weakness classes applicable to
Server-side web applications (any language). Derived from CWE version 4.19.1.

When performing a security audit scoped to the `web-backend` domain,
**only** consider CWE IDs listed in this taxonomy. If you find something
plausible outside this subset, record it as `out-of-scope candidate`
with the CWE ID — do not expand scope.

## Classes

### CWE-284: Improper Access Control

The product does not restrict or incorrectly restricts access to a resource from an unauthorized actor.

**Abstraction**: Pillar

**Detection Hints**: No specific detection method documented in CWE.

### CWE-693: Protection Mechanism Failure

The product does not use or incorrectly uses a protection mechanism that provides sufficient defense against directed attacks against the product.

**Abstraction**: Pillar

**Detection Hints**: No specific detection method documented in CWE.

### CWE-703: Improper Check or Handling of Exceptional Conditions

The product does not properly anticipate or handle exceptional conditions that rarely occur during normal operation of the product.

**Abstraction**: Pillar

**Detection Hints**: Dynamic Analysis with Manual Results Interpretation (High); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (SOAR Partial); Architecture or Design Review (High)

### CWE-20: Improper Input Validation

The product receives input or data, but it does not validate or incorrectly validates that the input has the properties that are required to process the data safely and correctly.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis; Manual Static Analysis; Fuzzing; Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial)

### CWE-74: Improper Neutralization of Special Elements in Output Used by a Downstream Component ('Injection')

The product constructs all or part of a command, data structure, or record using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify how it is parsed or interpreted when it is sent to a downstream component.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-77: Improper Neutralization of Special Elements used in a Command ('Command Injection')

The product constructs all or part of a command using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended command when it is sent to a downstream component.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-99: Improper Control of Resource Identifiers ('Resource Injection')

The product receives input from an upstream component, but it does not restrict or incorrectly restricts the input before it is used as an identifier for a resource that may be outside the intended sphere of control.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-114: Process Control

Executing commands or loading libraries from an untrusted source or in an untrusted environment can cause an application to execute malicious commands (and payloads) on behalf of an attacker.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-116: Improper Encoding or Escaping of Output

The product prepares a structured message for communication with another component, but encoding or escaping of the data is either missing or done incorrectly. As a result, the intended structure of the message is not preserved.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (Moderate); Automated Dynamic Analysis

### CWE-159: Improper Handling of Invalid Use of Special Elements

The product does not properly filter, remove, quote, or otherwise manage the invalid use of special elements in user-controlled input, which could cause adverse effect on its behavior and integrity.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-200: Exposure of Sensitive Information to an Unauthorized Actor

The product exposes sensitive information to an actor that is not explicitly authorized to have access to that information.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (High); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High)

### CWE-221: Information Loss or Omission

The product does not record, or improperly records, security-relevant information that leads to an incorrect decision or hampers later analysis.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-269: Improper Privilege Management

The product does not properly assign, modify, track, or check privileges for an actor, creating an unintended sphere of control for that actor.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-282: Improper Ownership Management

The product assigns the wrong ownership, or does not properly verify the ownership, of an object or resource.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-285: Improper Authorization

The product does not perform or incorrectly performs an authorization check when an actor attempts to access a resource or perform an action.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (Limited); Automated Dynamic Analysis; Manual Analysis (Moderate); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-286: Incorrect User Management

The product does not properly manage a user within its environment.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-287: Improper Authentication

When an actor claims to have a given identity, the product does not prove or insufficiently proves that the claim is correct.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (Limited); Manual Static Analysis (High); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial)

### CWE-300: Channel Accessible by Non-Endpoint

The product does not adequately verify the identity of actors at both ends of a communication channel, or does not adequately ensure the integrity of the channel, in a way that allows the channel to be accessed or influenced by an actor that is not an endpoint.

**Abstraction**: Class

**Detection Hints**: Automated Dynamic Analysis; Automated Static Analysis (Moderate)

### CWE-311: Missing Encryption of Sensitive Data

The product does not encrypt sensitive or critical information before storage or transmission.

**Abstraction**: Class

**Detection Hints**: Manual Analysis (High); Automated Analysis; Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (High)

### CWE-326: Inadequate Encryption Strength

The product stores or transmits sensitive data using an encryption scheme that is theoretically sound, but is not strong enough for the level of protection required.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-327: Use of a Broken or Risky Cryptographic Algorithm

The product uses a broken or risky cryptographic algorithm or protocol.

**Abstraction**: Class

**Detection Hints**: Automated Analysis (Moderate); Manual Analysis; Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-330: Use of Insufficiently Random Values

The product uses insufficiently random numbers or values in a security context that depends on unpredictable numbers.

**Abstraction**: Class

**Detection Hints**: Black Box; Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (High)

### CWE-340: Generation of Predictable Numbers or Identifiers

The product uses a scheme that generates numbers or identifiers that are more predictable than required.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis

### CWE-345: Insufficient Verification of Data Authenticity

The product does not sufficiently verify the origin or authenticity of data, in a way that causes it to accept invalid data.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-346: Origin Validation Error

The product does not properly verify that the source of data or communication is valid.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis

### CWE-362: Concurrent Execution using Shared Resource with Improper Synchronization ('Race Condition')

The product contains a concurrent code sequence that requires temporary, exclusive access to a shared resource, but a timing window exists in which the shared resource can be modified by another code sequence operating concurrently.

**Abstraction**: Class

**Detection Hints**: Black Box; White Box; Automated Dynamic Analysis (Moderate); Automated Static Analysis - Binary or Bytecode (High); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-377: Insecure Temporary File

Creating and using insecure temporary files can leave application and system data vulnerable to attack.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-402: Transmission of Private Resources into a New Sphere ('Resource Leak')

The product makes resources available to untrusted parties when those resources are only intended to be accessed by the product.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-405: Asymmetric Resource Consumption (Amplification)

The product does not properly control situations in which an adversary can cause the product to consume or produce excessive resources without requiring the adversary to invest equivalent work or otherwise prove authorization, i.e., the adversary's influence is "asymmetric.".

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-424: Improper Protection of Alternate Path

The product does not sufficiently protect all possible paths that a user can take to access restricted functionality or resources.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-436: Interpretation Conflict

Product A handles inputs or steps differently than Product B, which causes A to perform incorrect actions based on its perception of B's state.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-441: Unintended Proxy or Intermediary ('Confused Deputy')

The product receives a request, message, or directive from an upstream component, but the product does not sufficiently preserve the original source of the request before forwarding the request to an external actor that is outside of the product's control sphere. This causes the product to appear to be the source of the request, leading it to act as a proxy or other intermediary between the upstream component and the external actor.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-446: UI Discrepancy for Security Feature

The user interface does not correctly enable or configure a security feature, but the interface provides feedback that causes the user to believe that the feature is in a secure state.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-451: User Interface (UI) Misrepresentation of Critical Information

The user interface (UI) does not properly represent critical information to the user, allowing the information - or its source - to be obscured or spoofed. This is often a component in phishing attacks.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-506: Embedded Malicious Code

The product contains code that appears to be malicious in nature.

**Abstraction**: Class

**Detection Hints**: Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (SOAR Partial); Automated Static Analysis (SOAR Partial)

### CWE-514: Covert Channel

A covert channel is a path that can be used to transfer information in a way not intended by the system's designers.

**Abstraction**: Class

**Detection Hints**: Architecture or Design Review (SOAR Partial)

### CWE-522: Insufficiently Protected Credentials

The product transmits or stores authentication credentials, but it uses an insecure method that is susceptible to unauthorized interception and/or retrieval.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-602: Client-Side Enforcement of Server-Side Security

The product is composed of a server that relies on the client to implement a mechanism that is intended to protect the server.

**Abstraction**: Class

**Detection Hints**: Fuzzing; Manual Analysis

### CWE-610: Externally Controlled Reference to a Resource in Another Sphere

The product uses an externally controlled name or reference that resolves to a resource that is outside of the intended control sphere.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-636: Not Failing Securely ('Failing Open')

When the product encounters an error condition or failure, its design requires it to fall back to a state that is less secure than other options that are available, such as selecting the weakest encryption algorithm or using the most permissive access control restrictions.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-642: External Control of Critical State Data

The product stores security-critical state information about its users, or the product itself, in a location that is accessible to unauthorized actors.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High); Fuzzing

### CWE-653: Improper Isolation or Compartmentalization

The product does not properly compartmentalize or isolate functionality, processes, or resources that require different privilege levels, rights, or permissions.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Source Code (High); Architecture or Design Review (High)

### CWE-656: Reliance on Security Through Obscurity

The product uses a protection mechanism whose strength depends heavily on its obscurity, such that knowledge of its algorithms or key data is sufficient to defeat the mechanism.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-657: Violation of Secure Design Principles

The product violates well-established principles for secure design.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-665: Improper Initialization

The product does not initialize or incorrectly initializes a resource, which might leave the resource in an unexpected state when it is accessed or used.

**Abstraction**: Class

**Detection Hints**: Automated Dynamic Analysis (Moderate); Manual Dynamic Analysis; Automated Static Analysis (High)

### CWE-668: Exposure of Resource to Wrong Sphere

The product exposes a resource to the wrong control sphere, providing unintended actors with inappropriate access to the resource.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-671: Lack of Administrator Control over Security

The product uses security features in a way that prevents the product's administrator from tailoring security settings to reflect the environment in which the product is being used. This introduces resultant weaknesses or prevents it from operating at a level of security that is desired by the administrator.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-732: Incorrect Permission Assignment for Critical Resource

The product specifies permissions for a security-critical resource in a way that allows that resource to be read or modified by unintended actors.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis; Automated Dynamic Analysis; Manual Analysis; Manual Static Analysis; Manual Dynamic Analysis

### CWE-754: Improper Check for Unusual or Exceptional Conditions

The product does not check or incorrectly checks for unusual or exceptional conditions that are not expected to occur frequently during day to day operation of the product.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (Moderate); Manual Dynamic Analysis

### CWE-755: Improper Handling of Exceptional Conditions

The product does not handle or incorrectly handles an exceptional condition.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis

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

### CWE-922: Insecure Storage of Sensitive Information

The product stores sensitive information without properly limiting read or write access by unauthorized actors.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-923: Improper Restriction of Communication Channel to Intended Endpoints

The product establishes a communication channel to (or from) an endpoint for privileged or protected operations, but it does not properly ensure that it is communicating with the correct endpoint.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-943: Improper Neutralization of Special Elements in Data Query Logic

The product generates a query intended to access or manipulate data in a data store such as a database, but it does not neutralize or incorrectly neutralizes special elements that can modify the intended logic of the query.

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

### CWE-1395: Dependency on Vulnerable Third-Party Component

The product has a dependency on a third-party component that contains one or more known vulnerabilities.

**Abstraction**: Class

**Detection Hints**: Automated Analysis (High)

### CWE-1419: Incorrect Initialization of Resource

The product attempts to initialize a resource but does not correctly do so, which might leave the resource in an unexpected, incorrect, or insecure state when it is accessed.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis

### CWE-15: External Control of System or Configuration Setting

One or more system settings or configuration elements can be externally controlled by a user.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-22: Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')

The product uses external input to construct a pathname that is intended to identify a file or directory that is located underneath a restricted parent directory, but the product does not properly neutralize special elements within the pathname that can cause the pathname to resolve to a location that is outside of the restricted directory.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Manual Static Analysis (High); Automated Static Analysis - Binary or Bytecode (High); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (High)

### CWE-23: Relative Path Traversal

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize sequences such as ".." that can resolve to a location that is outside of that directory.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-36: Absolute Path Traversal

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize absolute path sequences such as "/abs/path" that can resolve to a location that is outside of that directory.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-41: Improper Resolution of Path Equivalence

The product is vulnerable to file system contents disclosure through path equivalence. Path equivalence involves the use of special characters in file and directory names. The associated manipulations are intended to generate multiple names for the same object.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (High)

### CWE-59: Improper Link Resolution Before File Access ('Link Following')

The product attempts to access a file based on the filename, but it does not properly prevent that filename from identifying a link or shortcut that resolves to an unintended resource.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (High)

### CWE-73: External Control of File Name or Path

The product allows user input to control or influence paths or file names that are used in filesystem operations.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-76: Improper Neutralization of Equivalent Special Elements

The product correctly neutralizes certain special elements, but it improperly neutralizes equivalent special elements.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-78: Improper Neutralization of Special Elements used in an OS Command ('OS Command Injection')

The product constructs all or part of an OS command using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended OS command when it is sent to a downstream component.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis; Automated Dynamic Analysis (Moderate); Manual Static Analysis (High); Automated Static Analysis - Binary or Bytecode (High); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-79: Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting')

The product does not neutralize or incorrectly neutralizes user-controllable input before it is placed in output that is used as a web page that is served to other users.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (Moderate); Black Box (Moderate)

### CWE-88: Improper Neutralization of Argument Delimiters in a Command ('Argument Injection')

The product constructs a string for a command to be executed by a separate component in another control sphere, but it does not properly delimit the intended arguments, options, or switches within that command string.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')

The product constructs all or part of an SQL command using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended SQL command when it is sent to a downstream component. Without sufficient removal or quoting of SQL syntax in user-controllable inputs, the generated SQL query can cause those inputs to be interpreted as SQL instead of ordinary user data.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis; Automated Dynamic Analysis (Moderate); Manual Analysis; Automated Static Analysis - Binary or Bytecode (High); Dynamic Analysis with Automated Results Interpretation (High)

### CWE-90: Improper Neutralization of Special Elements used in an LDAP Query ('LDAP Injection')

The product constructs all or part of an LDAP query using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended LDAP query when it is sent to a downstream component.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-91: XML Injection (aka Blind XPath Injection)

The product does not properly neutralize special elements that are used in XML, allowing attackers to modify the syntax, content, or commands of the XML before it is processed by an end system.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-93: Improper Neutralization of CRLF Sequences ('CRLF Injection')

The product uses CRLF (carriage return line feeds) as a special element, e.g. to separate lines or records, but it does not neutralize or incorrectly neutralizes CRLF sequences from inputs.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-94: Improper Control of Generation of Code ('Code Injection')

The product constructs all or part of a code segment using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the syntax or behavior of the intended code segment.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-96: Improper Neutralization of Directives in Statically Saved Code ('Static Code Injection')

The product receives input from an upstream component, but it does not neutralize or incorrectly neutralizes code syntax before inserting the input into an executable resource, such as a library, configuration file, or template.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-112: Missing XML Validation

The product accepts XML from an untrusted source but does not validate the XML against the proper schema.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-115: Misinterpretation of Input

The product misinterprets an input, whether from an attacker or another product, in a security-relevant fashion.

**Abstraction**: Base

**Detection Hints**: Fuzzing (High)

### CWE-117: Improper Output Neutralization for Logs

The product constructs a log message from external input, but it does not neutralize or incorrectly neutralizes special elements when the message is written to a log file.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-183: Permissive List of Allowed Inputs

The product implements a protection mechanism that relies on a list of inputs (or properties of inputs) that are explicitly allowed by policy because the inputs are assumed to be safe, but the list is too permissive - that is, it allows an input that is unsafe, leading to resultant weaknesses.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-191: Integer Underflow (Wrap or Wraparound)

The product subtracts one value from another, such that the result is less than the minimum allowable integer value, which produces a value that is not equal to the correct result.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-197: Numeric Truncation Error

Truncation errors occur when a primitive is cast to a primitive of a smaller size and data is lost in the conversion.

**Abstraction**: Base

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High)

### CWE-201: Insertion of Sensitive Information Into Sent Data

The code transmits data to another actor, but a portion of the data includes sensitive information that should not be accessible to that actor.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-209: Generation of Error Message Containing Sensitive Information

The product generates an error message that includes sensitive information about its environment, users, or associated data.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (High); Automated Analysis (Moderate); Automated Dynamic Analysis (Moderate); Manual Dynamic Analysis; Automated Static Analysis

### CWE-211: Externally-Generated Error Message Containing Sensitive Information

The product performs an operation that triggers an external diagnostic or error message that is not directly generated or controlled by the product, such as an error generated by the programming language interpreter that a software application uses. The error can contain sensitive system information.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-215: Insertion of Sensitive Information Into Debugging Code

The product inserts sensitive information into debugging code, which could expose this information if the debugging code is not disabled in production.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-223: Omission of Security-relevant Information

The product does not record or display information that would be important for identifying the source or nature of an attack, or determining if an action is safe.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-248: Uncaught Exception

An exception is thrown from a function, but it is not caught.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-252: Unchecked Return Value

The product does not check the return value from a method or function, which can prevent it from detecting unexpected states and conditions.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

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

### CWE-266: Incorrect Privilege Assignment

A product incorrectly assigns a privilege to a particular actor, creating an unintended sphere of control for that actor.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-274: Improper Handling of Insufficient Privileges

The product does not handle or incorrectly handles when it has insufficient privileges to perform an operation, leading to resultant weaknesses.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-276: Incorrect Default Permissions

During installation, installed file permissions are set to allow anyone to modify those files.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (High); Manual Static Analysis - Source Code (High)

### CWE-280: Improper Handling of Insufficient Permissions or Privileges 

The product does not handle or incorrectly handles when it has insufficient privileges to access resources or functionality as specified by their permissions. This may cause it to follow unexpected code paths that may leave the product in an invalid state.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-281: Improper Preservation of Permissions

The product does not preserve permissions or incorrectly preserves permissions when copying, restoring, or sharing objects, which can cause them to have less restrictive permissions than intended.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-283: Unverified Ownership

The product does not properly verify that a critical resource is owned by the proper entity.

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

### CWE-295: Improper Certificate Validation

The product does not validate, or incorrectly validates, a certificate.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (High); Manual Static Analysis - Source Code (High)

### CWE-296: Improper Following of a Certificate's Chain of Trust

The product does not follow, or incorrectly follows, the chain of trust for a certificate back to a trusted root certificate, resulting in incorrect trust of any resource that is associated with that certificate.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-299: Improper Check for Certificate Revocation

The product does not check or incorrectly checks the revocation status of a certificate, which may cause it to use a certificate that has been compromised.

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

### CWE-323: Reusing a Nonce, Key Pair in Encryption

Nonces should be used for the present occasion and only once.

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

### CWE-334: Small Space of Random Values

The number of possible random values is smaller than needed by the product, making it more susceptible to brute force attacks.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

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

### CWE-347: Improper Verification of Cryptographic Signature

The product does not verify, or incorrectly verifies, the cryptographic signature for data.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-353: Missing Support for Integrity Check

The product uses a transmission protocol that does not include a mechanism for verifying the integrity of the data during transmission, such as a checksum.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-359: Exposure of Private Personal Information to an Unauthorized Actor

The product does not properly prevent a person's private, personal information from being accessed by actors who either (1) are not explicitly authorized to access the information or (2) do not have the implicit consent of the person about whom the information is collected.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (High); Automated Static Analysis (High); Automated Static Analysis

### CWE-360: Trust of System Event Data

Security based on event locations are insecure and can be spoofed.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-363: Race Condition Enabling Link Following

The product checks the status of a file or directory before accessing it, which produces a race condition in which the file can be replaced with a link before the access is performed, causing the product to access the wrong file.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-366: Race Condition within a Thread

If two threads of execution use a resource simultaneously, there exists the possibility that resources may be used while invalid, in turn making the state of execution undefined.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-369: Divide By Zero

The product divides a value by zero.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Fuzzing (High)

### CWE-374: Passing Mutable Objects to an Untrusted Method

The product sends non-cloned mutable data as an argument to a method or function.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-375: Returning a Mutable Object to an Untrusted Caller

Sending non-cloned mutable data as a return value may result in that data being altered or deleted by the calling function.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-379: Creation of Temporary File in Directory with Insecure Permissions

The product creates a temporary file in a directory whose permissions allow unintended actors to determine the file's existence or otherwise access that file.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-390: Detection of Error Condition Without Action

The product detects a specific error, but takes no actions to handle the error.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-391: Unchecked Error Condition

[PLANNED FOR DEPRECATION. SEE MAINTENANCE NOTES AND CONSIDER CWE-252, CWE-248, OR CWE-1069.] Ignoring exceptions and other error conditions may allow an attacker to induce unexpected behavior unnoticed.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-394: Unexpected Status Code or Return Value

The product does not properly check when a function or operation returns a value that is legitimate for the function, but is not expected by the product.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-395: Use of NullPointerException Catch to Detect NULL Pointer Dereference

Catching NullPointerException should not be used as an alternative to programmatic checks to prevent dereferencing a null pointer.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (SOAR Partial); Automated Static Analysis - Source Code (High); Architecture or Design Review (High)

### CWE-396: Declaration of Catch for Generic Exception

Catching overly broad exceptions promotes complex error handling code that is more likely to contain security vulnerabilities.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-397: Declaration of Throws for Generic Exception

The product throws or raises an overly broad exceptions that can hide important details and produce inappropriate responses to certain conditions.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-408: Incorrect Behavior Order: Early Amplification

The product allows an entity to perform a legitimate but expensive operation before authentication or authorization has taken place.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-419: Unprotected Primary Channel

The product uses a primary channel for administration or restricted functionality, but it does not properly protect the channel.

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

### CWE-427: Uncontrolled Search Path Element

The product uses a fixed or controlled search path to find resources, but one or more locations in that path can be under the control of unintended actors.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-434: Unrestricted Upload of File with Dangerous Type

The product allows the upload or transfer of dangerous file types that are automatically processed within its environment.

**Abstraction**: Base

**Detection Hints**: Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High); Architecture or Design Review (High)

### CWE-444: Inconsistent Interpretation of HTTP Requests ('HTTP Request/Response Smuggling')

The product acts as an intermediary HTTP agent (such as a proxy or firewall) in the data flow between two entities such as a client and server, but it does not interpret malformed HTTP requests or responses in ways that are consistent with how the messages will be processed by those entities that are at the ultimate destination.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-447: Unimplemented or Unsupported Feature in UI

A UI function for a security feature appears to be supported and gives feedback to the user that suggests that it is supported, but the underlying functionality is not implemented.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-454: External Initialization of Trusted Variables or Data Stores

The product initializes critical internal variables or data stores using inputs that can be modified by untrusted actors.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-460: Improper Cleanup on Thrown Exception

The product does not clean up its state or incorrectly cleans up its state when an exception is thrown, leading to unexpected state or control flow.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-470: Use of Externally-Controlled Input to Select Classes or Code ('Unsafe Reflection')

The product uses external input with reflection to select which classes or code to use, but it does not sufficiently prevent the input from selecting improper classes or code.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-472: External Control of Assumed-Immutable Web Parameter

The web application does not sufficiently verify inputs that are assumed to be immutable but are actually externally controllable, such as hidden form fields.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-474: Use of Function with Inconsistent Implementations

The code uses a function that has inconsistent implementations across operating systems and versions.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-476: NULL Pointer Dereference

The product dereferences a pointer that it expects to be valid but is NULL.

**Abstraction**: Base

**Detection Hints**: Automated Dynamic Analysis (Moderate); Manual Dynamic Analysis; Automated Static Analysis (High)

### CWE-477: Use of Obsolete Function

The code uses deprecated or obsolete functions, which suggests that the code has not been actively reviewed or maintained.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (High); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (High); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High)

### CWE-478: Missing Default Case in Multiple Condition Expression

The code does not have a default case in an expression with multiple conditions, such as a switch statement.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-480: Use of Incorrect Operator

The product accidentally uses the wrong operator, which changes the logic in security-relevant ways.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis; Manual Static Analysis

### CWE-484: Omitted Break Statement in Switch

The product omits a break statement within a switch or similar construct, causing code associated with multiple conditions to execute. This can cause problems when the programmer only intended to execute code associated with one condition.

**Abstraction**: Base

**Detection Hints**: White Box; Black Box; Automated Static Analysis (High)

### CWE-487: Reliance on Package-level Scope

Java packages are not inherently closed; therefore, relying on them for code security is not a good practice.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-489: Active Debug Code

The product is released with debugging code still enabled or active.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-494: Download of Code Without Integrity Check

The product downloads source code or an executable from a remote location and executes the code without sufficiently verifying the origin and integrity of the code.

**Abstraction**: Base

**Detection Hints**: Manual Analysis; Black Box; Automated Static Analysis (High)

### CWE-497: Exposure of Sensitive System Information to an Unauthorized Control Sphere

The product does not properly prevent sensitive system-level information from being accessed by unauthorized actors who do not have the same level of access to the underlying system as the product does.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-501: Trust Boundary Violation

The product mixes trusted and untrusted data in the same data structure or structured message.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-502: Deserialization of Untrusted Data

The product deserializes untrusted data without sufficiently ensuring that the resulting data will be valid.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-509: Replicating Malicious Code (Virus or Worm)

Replicating malicious code, including viruses and worms, will attempt to attack other systems once it has successfully compromised the target system or the product.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-521: Weak Password Requirements

The product does not require that users should have strong passwords.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-523: Unprotected Transport of Credentials

Login pages do not use adequate measures to protect the user name and password while they are in transit from the client to the server.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-532: Insertion of Sensitive Information into Log File

The product writes sensitive information to a log file.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-538: Insertion of Sensitive Information into Externally-Accessible File or Directory

The product places sensitive information into files or directories that are accessible to actors who are allowed to have access to the files, but not to the sensitive information.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-540: Inclusion of Sensitive Information in Source Code

Source code on a web server or repository often contains sensitive information and should generally not be accessible to users.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-547: Use of Hard-coded, Security-relevant Constants

The product uses hard-coded constants instead of symbolic names for security-critical values, which increases the likelihood of mistakes during code maintenance or security policy change.

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

### CWE-565: Reliance on Cookies without Validation and Integrity Checking

The product relies on the existence or values of cookies when performing security-critical operations, but it does not properly ensure that the setting is valid for the associated user.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-567: Unsynchronized Access to Shared Data in a Multithreaded Context

The product does not properly synchronize shared data, such as static variables across threads, which can lead to undefined behavior and unpredictable data changes.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-586: Explicit Call to Finalize()

The product makes an explicit call to the finalize() method from outside the finalizer.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-601: URL Redirection to Untrusted Site ('Open Redirect')

The web application accepts a user-controlled input that specifies a link to an external site, and uses that link in a redirect.

**Abstraction**: Base

**Detection Hints**: Manual Static Analysis (High); Automated Dynamic Analysis; Automated Static Analysis; Automated Static Analysis (High); Automated Static Analysis - Binary or Bytecode (High)

### CWE-603: Use of Client-Side Authentication

A client/server product performs authentication within client code but not in server code, allowing server-side authentication to be bypassed via a modified client that omits the authentication check.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-609: Double-Checked Locking

The product uses double-checked locking to access a resource without the overhead of explicit synchronization, but the locking is insufficient.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-611: Improper Restriction of XML External Entity Reference

The product processes an XML document that can contain XML entities with URIs that resolve to documents outside of the intended sphere of control, causing the product to embed incorrect documents into its output.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-612: Improper Authorization of Index Containing Sensitive Information

The product creates a search index of private or sensitive documents, but it does not properly limit index access to actors who are authorized to see the original information.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-613: Insufficient Session Expiration

According to WASC, "Insufficient Session Expiration is when a web site permits an attacker to reuse old session credentials or session IDs for authorization.".

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-617: Reachable Assertion

The product contains an assert() or similar statement that can be triggered by an attacker, which leads to an application exit or other behavior that is more severe than necessary.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-619: Dangling Database Cursor ('Cursor Injection')

If a database cursor is not closed properly, then it could become accessible to other users while retaining the same privileges that were originally assigned, leaving the cursor "dangling.".

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-620: Unverified Password Change

When setting a new password for a user, the product does not require knowledge of the original password, or using another form of authentication.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-628: Function Call with Incorrectly Specified Arguments

The product calls a function, procedure, or routine with arguments that are not correctly specified, leading to always-incorrect behavior and resultant weaknesses.

**Abstraction**: Base

**Detection Hints**: Other

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

### CWE-676: Use of Potentially Dangerous Function

The product invokes a potentially dangerous function that could introduce a vulnerability if it is used incorrectly, but the function can also be used safely.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (High); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (High); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High)

### CWE-698: Execution After Redirect (EAR)

The web application sends a redirect to another location, but instead of exiting, it executes additional code.

**Abstraction**: Base

**Detection Hints**: Black Box

### CWE-749: Exposed Dangerous Method or Function

The product provides an Applications Programming Interface (API) or similar interface for interaction with external actors, but the interface includes a dangerous method or function that is not properly restricted.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-756: Missing Custom Error Page

The product does not return custom error pages to the user, possibly exposing sensitive information.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-757: Selection of Less-Secure Algorithm During Negotiation ('Algorithm Downgrade')

A protocol or its implementation supports interaction between multiple actors and allows those actors to negotiate which algorithm should be used as a protection mechanism such as encryption or authentication, but it does not select the strongest algorithm that is available to both parties.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-766: Critical Data Element Declared Public

The product declares a critical variable, field, or member to be public when intended security policy requires it to be private.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-767: Access to Critical Private Variable via Public Method

The product defines a public method that reads or modifies a private variable.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-776: Improper Restriction of Recursive Entity References in DTDs ('XML Entity Expansion')

The product uses XML documents and allows their structure to be defined with a Document Type Definition (DTD), but it does not properly control the number of recursive definitions of entities.

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

### CWE-804: Guessable CAPTCHA

The product uses a CAPTCHA challenge, but the challenge can be guessed or automatically recognized by a non-human actor.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-807: Reliance on Untrusted Inputs in a Security Decision

The product uses a protection mechanism that relies on the existence or values of an input, but the input can be modified by an untrusted actor in a way that bypasses the protection mechanism.

**Abstraction**: Base

**Detection Hints**: Manual Static Analysis (High); Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial)

### CWE-829: Inclusion of Functionality from Untrusted Control Sphere

The product imports, requires, or includes executable functionality (such as a library) from a source that is outside of the intended control sphere.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (SOAR Partial)

### CWE-836: Use of Password Hash Instead of Password for Authentication

The product records password hashes in a data store, receives a hash of a password from a client, and compares the supplied hash to the hash obtained from the data store.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-915: Improperly Controlled Modification of Dynamically-Determined Object Attributes

The product receives input from an upstream component that specifies multiple attributes, properties, or fields that are to be initialized or updated in an object, but it does not properly control which attributes can be modified.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-916: Use of Password Hash With Insufficient Computational Effort

The product generates a hash for a password, but it uses a scheme that does not provide a sufficient level of computational effort that would make password cracking attacks infeasible or expensive.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High); Automated Static Analysis (SOAR Partial)

### CWE-917: Improper Neutralization of Special Elements used in an Expression Language Statement ('Expression Language Injection')

The product constructs all or part of an expression language (EL) statement in a framework such as a Java Server Page (JSP) using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended EL statement before it is executed.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-918: Server-Side Request Forgery (SSRF)

The web server receives a URL or similar request from an upstream component and retrieves the contents of this URL, but it does not sufficiently ensure that the request is being sent to the expected destination.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-921: Storage of Sensitive Data in a Mechanism without Access Control

The product stores sensitive information in a file system or device that does not have built-in access control.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-940: Improper Verification of Source of a Communication Channel

The product establishes a communication channel to handle an incoming request that has been initiated by an actor, but it does not properly verify that the request is coming from the expected origin.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-941: Incorrectly Specified Destination in a Communication Channel

The product creates a communication channel to initiate an outgoing request to an actor, but it does not correctly specify the intended destination for that actor.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1007: Insufficient Visual Distinction of Homoglyphs Presented to User

The product displays information or identifiers to a user, but the display mechanism does not make it easy for the user to distinguish between visually similar or identical glyphs (homoglyphs), which may cause the user to misinterpret a glyph and perform an unintended, insecure action.

**Abstraction**: Base

**Detection Hints**: Manual Dynamic Analysis (Moderate)

### CWE-1021: Improper Restriction of Rendered UI Layers or Frames

The web application does not restrict or incorrectly restricts frame objects or UI layers that belong to another application or domain, which can lead to user confusion about which interface the user is interacting with.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-1073: Non-SQL Invokable Control Element with Excessive Number of Data Resource Accesses

The product contains a client with a function or method that contains a large number of data accesses/queries that are sent through a data manager, i.e., does not use efficient database capabilities.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1104: Use of Unmaintained Third Party Components

The product relies on third-party components that are not actively supported or maintained by the original developer or a trusted proxy for the original developer.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-1125: Excessive Attack Surface

The product has an attack surface whose quantitative measurement exceeds a desirable maximum.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1191: On-Chip Debug and Test Interface With Improper Access Control

The chip does not implement or does not correctly perform access control to check whether users are authorized to access internal registers and test modes through the physical debug/test interface.

**Abstraction**: Base

**Detection Hints**: Dynamic Analysis with Manual Results Interpretation; Fuzzing (Moderate)

### CWE-1235: Incorrect Use of Autoboxing and Unboxing for Performance Critical Operations

The code uses boxed primitives, which may introduce inefficiencies into performance-critical operations.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-1240: Use of a Cryptographic Primitive with a Risky Implementation

To fulfill the need for a cryptographic primitive, the product implements a cryptographic algorithm using a non-standard, unproven, or disallowed/non-compliant cryptographic implementation.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (High); Manual Analysis (Moderate); Dynamic Analysis with Manual Results Interpretation (Moderate)

### CWE-1241: Use of Predictable Algorithm in Random Number Generator

The device uses an algorithm that is predictable and generates a pseudo-random number.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

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

### CWE-1285: Improper Validation of Specified Index, Position, or Offset in Input

The product receives input that is expected to specify an index, position, or offset into an indexable resource such as a buffer or file, but it does not validate or incorrectly validates that the specified index/position/offset has the required properties.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

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

### CWE-1329: Reliance on Component That is Not Updateable

The product contains a component that cannot be updated or patched in order to remove vulnerabilities or significant bugs.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (Moderate)

### CWE-1332: Improper Handling of Faults that Lead to Instruction Skips

The device is missing or incorrectly implements circuitry or sensors that detect and mitigate the skipping of security-critical CPU instructions when they occur.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (Moderate); Simulation / Emulation (Moderate); Manual Analysis (Moderate)

### CWE-1335: Incorrect Bitwise Shift of Integer

An integer value is specified to be shifted by a negative amount or an amount greater than or equal to the number of bits contained in the value causing an unexpected or indeterminate result.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-1336: Improper Neutralization of Special Elements Used in a Template Engine

The product uses a template engine to insert or process externally-influenced input, but it does not neutralize or incorrectly neutralizes special elements or syntax that can be interpreted as template expressions or other code directives when processed by the engine.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-1341: Multiple Releases of Same Resource or Handle

The product attempts to close or release a resource or handle more than once, without any successful open between the close operations.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis; Automated Dynamic Analysis

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

### CWE-5: J2EE Misconfiguration: Data Transmission Without Encryption

Information sent over a network can be compromised while in transit. An attacker may be able to read or modify the contents if the data are sent in plaintext or are weakly encrypted.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-6: J2EE Misconfiguration: Insufficient Session-ID Length

The J2EE application is configured to use an insufficient session ID length.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-7: J2EE Misconfiguration: Missing Custom Error Page

The default error page of a web application should not display sensitive information about the product.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-8: J2EE Misconfiguration: Entity Bean Declared Remote

When an application exposes a remote interface for an entity bean, it might also expose methods that get or set the bean's data. These methods could be leveraged to read sensitive information, or to change data in ways that violate the application's expectations, potentially leading to other vulnerabilities.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-9: J2EE Misconfiguration: Weak Access Permissions for EJB Methods

If elevated access rights are assigned to EJB methods, then an attacker can take advantage of the permissions to exploit the product.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-11: ASP.NET Misconfiguration: Creating Debug Binary

Debugging messages help attackers learn about the system and plan a form of attack.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-13: ASP.NET Misconfiguration: Password in Configuration File

Storing a plaintext password in a configuration file allows anyone who can read the file access to the password-protected resource making them an easy target for attackers.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-24: Path Traversal: '../filedir'

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize "../" sequences that can resolve to a location that is outside of that directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-25: Path Traversal: '/../filedir'

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize "/../" sequences that can resolve to a location that is outside of that directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-26: Path Traversal: '/dir/../filename'

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize "/dir/../filename" sequences that can resolve to a location that is outside of that directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-27: Path Traversal: 'dir/../../filename'

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize multiple internal "../" sequences that can resolve to a location that is outside of that directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-28: Path Traversal: '..\filedir'

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize "..\" sequences that can resolve to a location that is outside of that directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-29: Path Traversal: '\..\filename'

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize '\..\filename' (leading backslash dot dot) sequences that can resolve to a location that is outside of that directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-30: Path Traversal: '\dir\..\filename'

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize '\dir\..\filename' (leading backslash dot dot) sequences that can resolve to a location that is outside of that directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-31: Path Traversal: 'dir\..\..\filename'

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize 'dir\..\..\filename' (multiple internal backslash dot dot) sequences that can resolve to a location that is outside of that directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-32: Path Traversal: '...' (Triple Dot)

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize '...' (triple dot) sequences that can resolve to a location that is outside of that directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-33: Path Traversal: '....' (Multiple Dot)

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize '....' (multiple dot) sequences that can resolve to a location that is outside of that directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-34: Path Traversal: '....//'

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize '....//' (doubled dot dot slash) sequences that can resolve to a location that is outside of that directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis - Source Code (SOAR Partial); Architecture or Design Review (High)

### CWE-37: Path Traversal: '/absolute/pathname/here'

The product accepts input in the form of a slash absolute path ('/absolute/pathname/here') without appropriate validation, which can allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-38: Path Traversal: '\absolute\pathname\here'

The product accepts input in the form of a backslash absolute path ('\absolute\pathname\here') without appropriate validation, which can allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-42: Path Equivalence: 'filename.' (Trailing Dot)

The product accepts path input in the form of trailing dot ('filedir.') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-43: Path Equivalence: 'filename....' (Multiple Trailing Dot)

The product accepts path input in the form of multiple trailing dot ('filedir....') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-44: Path Equivalence: 'file.name' (Internal Dot)

The product accepts path input in the form of internal dot ('file.ordir') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-45: Path Equivalence: 'file...name' (Multiple Internal Dot)

The product accepts path input in the form of multiple internal dot ('file...dir') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-46: Path Equivalence: 'filename ' (Trailing Space)

The product accepts path input in the form of trailing space ('filedir ') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-47: Path Equivalence: ' filename' (Leading Space)

The product accepts path input in the form of leading space (' filedir') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-48: Path Equivalence: 'file name' (Internal Whitespace)

The product accepts path input in the form of internal space ('file(SPACE)name') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-49: Path Equivalence: 'filename/' (Trailing Slash)

The product accepts path input in the form of trailing slash ('filedir/') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-50: Path Equivalence: '//multiple/leading/slash'

The product accepts path input in the form of multiple leading slash ('//multiple/leading/slash') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-51: Path Equivalence: '/multiple//internal/slash'

The product accepts path input in the form of multiple internal slash ('/multiple//internal/slash/') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-52: Path Equivalence: '/multiple/trailing/slash//'

The product accepts path input in the form of multiple trailing slash ('/multiple/trailing/slash//') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-53: Path Equivalence: '\multiple\\internal\backslash'

The product accepts path input in the form of multiple internal backslash ('\multiple\trailing\\slash') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-54: Path Equivalence: 'filedir\' (Trailing Backslash)

The product accepts path input in the form of trailing backslash ('filedir\') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-55: Path Equivalence: '/./' (Single Dot Directory)

The product accepts path input in the form of single dot directory exploit ('/./') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-56: Path Equivalence: 'filedir*' (Wildcard)

The product accepts path input in the form of asterisk wildcard ('filedir*') without appropriate validation, which can lead to ambiguous path resolution and allow an attacker to traverse the file system to unintended locations or access arbitrary files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-65: Windows Hard Link

The product, when opening a file or directory, does not sufficiently handle when the name is associated with a hard link to a target that is outside of the intended control sphere. This could allow an attacker to cause the product to operate on unauthorized files.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-69: Improper Handling of Windows ::DATA Alternate Data Stream

The product does not properly prevent access to, or detect usage of, alternate data streams (ADS).

**Abstraction**: Variant

**Detection Hints**: Automated Analysis

### CWE-72: Improper Handling of Apple HFS+ Alternate Data Stream Path

The product does not properly handle special paths that may identify the data or resource fork of a file on the HFS+ file system.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-80: Improper Neutralization of Script-Related HTML Tags in a Web Page (Basic XSS)

The product receives input from an upstream component, but it does not neutralize or incorrectly neutralizes special characters such as "<", ">", and "&" that could be interpreted as web-scripting elements when they are sent to a downstream component that processes web pages.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-81: Improper Neutralization of Script in an Error Message Web Page

The product receives input from an upstream component, but it does not neutralize or incorrectly neutralizes special characters that could be interpreted as web-scripting elements when they are sent to an error page.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-82: Improper Neutralization of Script in Attributes of IMG Tags in a Web Page

The web application does not neutralize or incorrectly neutralizes scripting elements within attributes of HTML IMG tags, such as the src attribute.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-83: Improper Neutralization of Script in Attributes in a Web Page

The product does not neutralize or incorrectly neutralizes "javascript:" or other URIs from dangerous attributes within tags, such as onmouseover, onload, onerror, or style.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-84: Improper Neutralization of Encoded URI Schemes in a Web Page

The web application improperly neutralizes user-controlled input for executable script disguised with URI encodings.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-85: Doubled Character XSS Manipulations

The web application does not filter user-controlled input for executable script disguised using doubling of the involved characters.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-86: Improper Neutralization of Invalid Characters in Identifiers in Web Pages

The product does not neutralize or incorrectly neutralizes invalid characters or byte sequences in the middle of tag names, URI schemes, and other identifiers.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-87: Improper Neutralization of Alternate XSS Syntax

The product does not neutralize or incorrectly neutralizes user-controlled input for alternate script syntax.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-95: Improper Neutralization of Directives in Dynamically Evaluated Code ('Eval Injection')

The product receives input from an upstream component, but it does not neutralize or incorrectly neutralizes code syntax before using the input in a dynamic evaluation call (e.g. "eval").

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-97: Improper Neutralization of Server-Side Includes (SSI) Within a Web Page

The product generates a web page, but does not neutralize or incorrectly neutralizes user-controllable input that could be interpreted as a server-side include (SSI) directive.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-98: Improper Control of Filename for Include/Require Statement in PHP Program ('PHP Remote File Inclusion')

The PHP application receives input from an upstream component, but it does not restrict or incorrectly restricts the input before its usage in "require," "include," or similar functions.

**Abstraction**: Variant

**Detection Hints**: Manual Analysis (High); Automated Static Analysis

### CWE-102: Struts: Duplicate Validation Forms

The product uses multiple validation forms with the same name, which might cause the Struts Validator to validate a form that the programmer does not expect.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-103: Struts: Incomplete validate() Method Definition

The product has a validator form that either does not define a validate() method, or defines a validate() method but does not call super.validate().

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-104: Struts: Form Bean Does Not Extend Validation Class

If a form bean does not extend an ActionForm subclass of the Validator framework, it can expose the application to other weaknesses related to insufficient input validation.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-105: Struts: Form Field Without Validator

The product has a form field that is not validated by a corresponding validation form, which can introduce other weaknesses related to insufficient input validation.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-106: Struts: Plug-in Framework not in Use

When an application does not use an input validation framework such as the Struts Validator, there is a greater risk of introducing weaknesses related to insufficient input validation.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-107: Struts: Unused Validation Form

An unused validation form indicates that validation logic is not up-to-date.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-108: Struts: Unvalidated Action Form

Every Action Form must have a corresponding validation form.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-109: Struts: Validator Turned Off

Automatic filtering via a Struts bean has been turned off, which disables the Struts Validator and custom validation logic. This exposes the application to other weaknesses related to insufficient input validation.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-110: Struts: Validator Without Form Field

Validation fields that do not appear in forms they are associated with indicate that the validation logic is out of date.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (Moderate); Manual Static Analysis (Moderate)

### CWE-111: Direct Use of Unsafe JNI

When a Java application uses the Java Native Interface (JNI) to call code written in another programming language, it can expose the application to weaknesses in that code, even if those weaknesses cannot occur in Java.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-113: Improper Neutralization of CRLF Sequences in HTTP Headers ('HTTP Request/Response Splitting')

The product receives data from an HTTP agent/component (e.g., web server, proxy, browser, etc.), but it does not neutralize or incorrectly neutralizes CR and LF characters before the data is included in outgoing HTTP headers.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-129: Improper Validation of Array Index

The product uses untrusted input when calculating or using an array index, but the product does not validate or incorrectly validates the index to ensure the index references a valid position within the array.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis; Automated Dynamic Analysis (Moderate); Black Box

### CWE-187: Partial String Comparison

The product performs a comparison that only examines a portion of a factor before determining whether there is a match, such as a substring, leading to resultant weaknesses.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-192: Integer Coercion Error

Integer coercion refers to a set of flaws pertaining to the type casting, extension, or truncation of primitive data types.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-206: Observable Internal Behavioral Discrepancy

The product performs multiple behaviors that are combined to produce a single result, but the individual behaviors are observable separately in a way that allows attackers to reveal internal state or internal decision points.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-207: Observable Behavioral Discrepancy With Equivalent Products

The product operates in an environment in which its existence or specific identity should not be known, but it behaves differently than other products with equivalent functionality, in a way that is observable to an attacker.

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

### CWE-234: Failure to Handle Missing Parameter

If too few arguments are sent to a function, the function will still pop the expected number of arguments from the stack. Potentially, a variable number of arguments could be exhausted in a function as well.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-235: Improper Handling of Extra Parameters

The product does not handle or incorrectly handles when the number of parameters, fields, or arguments with the same name exceeds the expected amount.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-245: J2EE Bad Practices: Direct Management of Connections

The J2EE application directly manages connections, instead of using the container's connection management facilities.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-246: J2EE Bad Practices: Direct Use of Sockets

The J2EE application directly uses sockets instead of using framework method calls.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

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

### CWE-293: Using Referer Field for Authentication

The referer field in HTTP requests can be easily modified and, as such, is not a valid means of message integrity checking.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

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

### CWE-315: Cleartext Storage of Sensitive Information in a Cookie

The product stores sensitive information in cleartext in a cookie.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-316: Cleartext Storage of Sensitive Information in Memory

The product stores sensitive information in cleartext in memory.

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

### CWE-336: Same Seed in Pseudo-Random Number Generator (PRNG)

A Pseudo-Random Number Generator (PRNG) uses the same seed each time the product is initialized.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-337: Predictable Seed in Pseudo-Random Number Generator (PRNG)

A Pseudo-Random Number Generator (PRNG) is initialized from a predictable seed, such as the process ID or system time.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-350: Reliance on Reverse DNS Resolution for a Security-Critical Action

The product performs reverse DNS resolution on an IP address to obtain the hostname and make a security decision, but it does not properly ensure that the IP address is truly associated with the hostname.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-382: J2EE Bad Practices: Use of System.exit()

A J2EE application uses System.exit(), which also shuts down its container.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-383: J2EE Bad Practices: Direct Use of Threads

Thread management in a Web application is forbidden in some circumstances and is always highly error prone.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-433: Unparsed Raw Web Content Delivery

The product stores raw content or supporting code under the web document root with an extension that is not specifically handled by the server.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-453: Insecure Default Variable Initialization

The product, by default, initializes an internal variable with an insecure or less secure value than is possible.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-457: Use of Uninitialized Variable

The code uses a variable that has not been initialized, leading to unpredictable or unintended results.

**Abstraction**: Variant

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High)

### CWE-462: Duplicate Key in Associative List (Alist)

Duplicate keys in associative lists can lead to non-unique keys being mistaken for an error.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-481: Assigning instead of Comparing

The code uses an operator for assignment when the intention was to perform a comparison.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-486: Comparison of Classes by Name

The product compares classes by name, which can cause it to use the wrong class when multiple classes can have the same name.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-491: Public cloneable() Method Without Final ('Object Hijack')

A class has a cloneable() method that is not declared final, which allows an object to be created without calling the constructor. This can cause the object to be in an unexpected state.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-492: Use of Inner Class Containing Sensitive Data

Inner classes are translated into classes that are accessible at package scope and may expose code that the programmer intended to keep private to attackers.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-493: Critical Public Variable Without Final Modifier

The product has a critical public variable that is not final, which allows the variable to be modified to contain unexpected values.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-495: Private Data Structure Returned From A Public Method

The product has a method that is declared public, but returns a reference to a private data structure, which could then be modified in unexpected ways.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-496: Public Data Assigned to Private Array-Typed Field

Assigning public data to a private array is equivalent to giving public access to the array.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-498: Cloneable Class Containing Sensitive Information

The code contains a class with sensitive data, but the class is cloneable. The data can then be accessed by cloning the class.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-499: Serializable Class Containing Sensitive Data

The code contains a class with sensitive data, but the class does not explicitly deny serialization. The data can be accessed by serializing the class through another class.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-500: Public Static Field Not Marked Final

An object contains a public static field that is not marked final, which might allow it to be modified in unexpected ways.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-520: .NET Misconfiguration: Use of Impersonation

Allowing a .NET application to run at potentially escalated levels of access to the underlying operating and file systems can be dangerous and result in various forms of attacks.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-525: Use of Web Browser Cache Containing Sensitive Information

The web application does not use an appropriate caching policy that specifies the extent to which each web page and associated form fields should be cached.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-526: Cleartext Storage of Sensitive Information in an Environment Variable

The product uses an environment variable to store unencrypted sensitive information.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-527: Exposure of Version-Control Repository to an Unauthorized Control Sphere

The product stores a CVS, git, or other repository in a directory, archive, or other resource that is stored, transferred, or otherwise made accessible to unauthorized actors.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-528: Exposure of Core Dump File to an Unauthorized Control Sphere

The product generates a core dump file in a directory, archive, or other resource that is stored, transferred, or otherwise made accessible to unauthorized actors.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-529: Exposure of Access Control List Files to an Unauthorized Control Sphere

The product stores access control list files in a directory or other container that is accessible to actors outside of the intended control sphere.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-530: Exposure of Backup File to an Unauthorized Control Sphere

A backup file is stored in a directory or archive that is made accessible to unauthorized actors.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-535: Exposure of Information Through Shell Error Message

A command shell error message indicates that there exists an unhandled exception in the web application code. In many cases, an attacker can leverage the conditions that cause these errors in order to gain unauthorized access to the system.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-536: Servlet Runtime Error Message Containing Sensitive Information

A servlet error message indicates that there exists an unhandled exception in the web application code and may provide useful information to an attacker.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-537: Java Runtime Error Message Containing Sensitive Information

In many cases, an attacker can leverage the conditions that cause unhandled exception errors in order to gain unauthorized access to the system.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-539: Use of Persistent Cookies Containing Sensitive Information

The web application uses persistent cookies, but the cookies contain sensitive information.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-541: Inclusion of Sensitive Information in an Include File

If an include file source is accessible, the file can contain usernames and passwords, as well as sensitive information pertaining to the application and system.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-543: Use of Singleton Pattern Without Synchronization in a Multithreaded Context

The product uses the singleton pattern when creating a resource within a multithreaded environment.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-548: Exposure of Information Through Directory Listing

The product inappropriately exposes a directory listing with an index of all the resources located inside of the directory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-550: Server-generated Error Message Containing Sensitive Information

Certain conditions, such as network failure, will cause a server error message to be displayed.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-553: Command Shell in Externally Accessible Directory

A possible shell file exists in /cgi-bin/ or other accessible directories. This is extremely dangerous and can be used by an attacker to execute commands on the web server.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-555: J2EE Misconfiguration: Plaintext Password in Configuration File

The J2EE application stores a plaintext password in a configuration file.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-564: SQL Injection: Hibernate

Using Hibernate to execute a dynamic SQL statement built with user-controlled input can allow an attacker to modify the statement's meaning or to execute arbitrary SQL commands.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-566: Authorization Bypass Through User-Controlled SQL Primary Key

The product uses a database table that includes records that should not be accessible to an actor, but it executes a SQL statement with a primary key that can be controlled by that actor.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-568: finalize() Method Without super.finalize()

The product contains a finalize() method that does not call super.finalize().

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-572: Call to Thread run() instead of start()

The product calls a thread's run() method instead of calling start(), which causes the code to run in the thread of the caller instead of the callee.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-574: EJB Bad Practices: Use of Synchronization Primitives

The product violates the Enterprise JavaBeans (EJB) specification by using thread synchronization primitives.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-575: EJB Bad Practices: Use of AWT Swing

The product violates the Enterprise JavaBeans (EJB) specification by using AWT/Swing.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-576: EJB Bad Practices: Use of Java I/O

The product violates the Enterprise JavaBeans (EJB) specification by using the java.io package.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-577: EJB Bad Practices: Use of Sockets

The product violates the Enterprise JavaBeans (EJB) specification by using sockets.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-578: EJB Bad Practices: Use of Class Loader

The product violates the Enterprise JavaBeans (EJB) specification by using the class loader.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-579: J2EE Bad Practices: Non-serializable Object Stored in Session

The product stores a non-serializable object as an HttpSession attribute, which can hurt reliability.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-580: clone() Method Without super.clone()

The product contains a clone() method that does not call super.clone() to obtain the new object.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-581: Object Model Violation: Just One of Equals and Hashcode Defined

The product does not maintain equal hashcodes for equal objects.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-582: Array Declared Public, Final, and Static

The product declares an array public, final, and static, which is not sufficient to prevent the array's contents from being modified.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-583: finalize() Method Declared Public

The product violates secure coding principles for mobile code by declaring a finalize() method public.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-585: Empty Synchronized Block

The product contains an empty synchronized block.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-594: J2EE Framework: Saving Unserializable Objects to Disk

When the J2EE container attempts to write unserializable objects to disk there is no guarantee that the process will complete successfully.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-595: Comparison of Object References Instead of Object Contents

The product compares object references instead of the contents of the objects themselves, preventing it from detecting equivalent objects.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-597: Use of Wrong Operator in String Comparison

The product uses the wrong operator when comparing a string, such as using "==" when the .equals() method should be used instead.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-598: Use of GET Request Method With Sensitive Query Strings

The web application uses the HTTP GET method to process a request and includes sensitive information in the query string of that request.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-600: Uncaught Exception in Servlet 

The Servlet does not catch all exceptions, which may reveal sensitive debugging information.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-607: Public Static Final Field References Mutable Object

A public or protected static final field references a mutable object, which allows the object to be changed by malicious code, or accidentally from another package.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-608: Struts: Non-private Field in ActionForm Class

An ActionForm class contains a field that has not been declared private, which can be accessed without using a setter or getter.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-614: Sensitive Cookie in HTTPS Session Without 'Secure' Attribute

The Secure attribute for sensitive cookies in HTTPS sessions is not set.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-615: Inclusion of Sensitive Information in Source Code Comments

While adding general comments is very useful, some programmers tend to leave important data, such as: filenames related to the web application, old links or links which were not meant to be browsed by users, old code fragments, etc.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-626: Null Byte Interaction Error (Poison Null Byte)

The product does not properly handle null bytes or NUL characters when passing data between different representations or components.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-644: Improper Neutralization of HTTP Headers for Scripting Syntax

The product does not neutralize or incorrectly neutralizes web scripting syntax in HTTP headers that can be used by web browser components that can process raw headers, such as Flash.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-646: Reliance on File Name or Extension of Externally-Supplied File

The product allows a file to be uploaded, but it relies on the file name or extension of the file to determine the appropriate behaviors. This could be used by attackers to cause the file to be misclassified and processed in a dangerous fashion.

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

### CWE-651: Exposure of WSDL File Containing Sensitive Information

The Web services architecture may require exposing a Web Service Definition Language (WSDL) file that contains information on the publicly accessible services and how callers of these services should interact with them (e.g. what parameters they expect and what types they return).

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

### CWE-784: Reliance on Cookies without Validation and Integrity Checking in a Security Decision

The product uses a protection mechanism that relies on the existence or values of a cookie, but it does not properly ensure that the cookie is valid for the associated user.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-830: Inclusion of Web Functionality from an Untrusted Source

The product includes web functionality (such as a web widget) from another domain, which causes it to operate within the domain of the product, potentially granting total access and control of the product to the untrusted source.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-925: Improper Verification of Intent by Broadcast Receiver

The Android application uses a Broadcast Receiver that receives an Intent but does not properly verify that the Intent came from an authorized source.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-926: Improper Export of Android Application Components

The Android application exports a component for use by other applications, but does not properly restrict which applications can launch the component or access the data it contains.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-942: Permissive Cross-domain Security Policy with Untrusted Domains

The product uses a web-client protection mechanism such as a Content Security Policy (CSP) or cross-domain policy file, but the policy includes untrusted domains with which the web client is allowed to communicate.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-1004: Sensitive Cookie Without 'HttpOnly' Flag

The product uses a cookie to store sensitive information, but the cookie is not marked with the HttpOnly flag.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-1022: Use of Web Link to Untrusted Target with window.opener Access

The web application produces links to untrusted external sites outside of its sphere of control, but it does not properly prevent the external site from modifying security-critical properties of the window.opener object, such as the location property.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-1174: ASP.NET Misconfiguration: Improper Model Validation

The ASP.NET application does not use, or incorrectly uses, the model validation framework.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1275: Sensitive Cookie with Improper SameSite Attribute

The SameSite attribute for sensitive cookies is not set, or an insecure value is used.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-1330: Remanent Data Readable after Memory Erase

Confidential information stored in memory circuits is readable or recoverable after being cleared or erased.

**Abstraction**: Variant

**Detection Hints**: Architecture or Design Review; Dynamic Analysis with Manual Results Interpretation

### CWE-1385: Missing Origin Validation in WebSockets

The product uses a WebSocket, but it does not properly verify that the source of data or communication is valid.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-61: UNIX Symbolic Link (Symlink) Following

The product, when opening a file or directory, does not sufficiently account for when the file is a symbolic link that resolves to a target outside of the intended control sphere. This could allow an attacker to cause the product to operate on unauthorized files.

**Abstraction**: Compound

**Detection Hints**: Automated Static Analysis

### CWE-352: Cross-Site Request Forgery (CSRF)

The web application does not, or cannot, sufficiently verify whether a request was intentionally provided by the user who sent the request, which could have originated from an unauthorized actor.

**Abstraction**: Compound

**Detection Hints**: Manual Analysis (High); Automated Static Analysis (Limited); Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (High)

### CWE-384: Session Fixation

Authenticating a user, or otherwise establishing a new user session, without invalidating any existing session identifier gives an attacker the opportunity to steal authenticated sessions.

**Abstraction**: Compound

**Detection Hints**: No specific detection method documented in CWE.

### CWE-692: Incomplete Denylist to Cross-Site Scripting

The product uses a denylist-based protection mechanism to defend against XSS attacks, but the denylist is incomplete, allowing XSS variants to succeed.

**Abstraction**: Compound

**Detection Hints**: No specific detection method documented in CWE.

## Summary

| Abstraction | Count |
|-------------|-------|
| Pillar      | 3     |
| Class       | 58    |
| Base        | 195   |
| Variant     | 163   |
| Compound    | 4     |
| **Total**   | **423** |
