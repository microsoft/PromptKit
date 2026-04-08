<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: cwe-firmware-embedded
type: taxonomy
domain: firmware-embedded
description: >
  CWE-derived classification scheme for Firmware and embedded systems.
  226 weakness classes from CWE version 4.19.1. Use to scope
  security audits to domain-relevant vulnerability classes only.
cwe_version: "4.19.1"
---

# Taxonomy: CWE Firmware and Embedded Systems

This taxonomy contains 226 CWE weakness classes applicable to
Firmware and embedded systems. Derived from CWE version 4.19.1.

When performing a security audit scoped to the `firmware-embedded` domain,
**only** consider CWE IDs listed in this taxonomy. If you find something
plausible outside this subset, record it as `out-of-scope candidate`
with the CWE ID — do not expand scope.

## Classes

### CWE-284: Improper Access Control

The product does not restrict or incorrectly restricts access to a resource from an unauthorized actor.

**Abstraction**: Pillar

**Detection Hints**: No specific detection method documented in CWE.

### CWE-119: Improper Restriction of Operations within the Bounds of a Memory Buffer

The product performs operations on a memory buffer, but it reads from or writes to a memory location outside the buffer's intended boundary. This may result in read or write operations on unexpected memory locations that could be linked to other variables, data structures, or internal program data.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis; Automated Dynamic Analysis (Moderate); Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial)

### CWE-287: Improper Authentication

When an actor claims to have a given identity, the product does not prove or insufficiently proves that the claim is correct.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (Limited); Manual Static Analysis (High); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial)

### CWE-362: Concurrent Execution using Shared Resource with Improper Synchronization ('Race Condition')

The product contains a concurrent code sequence that requires temporary, exclusive access to a shared resource, but a timing window exists in which the shared resource can be modified by another code sequence operating concurrently.

**Abstraction**: Class

**Detection Hints**: Black Box; White Box; Automated Dynamic Analysis (Moderate); Automated Static Analysis - Binary or Bytecode (High); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-441: Unintended Proxy or Intermediary ('Confused Deputy')

The product receives a request, message, or directive from an upstream component, but the product does not sufficiently preserve the original source of the request before forwarding the request to an external actor that is outside of the product's control sphere. This causes the product to appear to be the source of the request, leading it to act as a proxy or other intermediary between the upstream component and the external actor.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-704: Incorrect Type Conversion or Cast

The product does not correctly convert an object, resource, or structure from one type to a different type.

**Abstraction**: Class

**Detection Hints**: Fuzzing (High)

### CWE-1059: Insufficient Technical Documentation

The product does not contain sufficient technical or engineering documentation (whether on paper or in electronic form) that contains descriptions of all the relevant software/hardware elements of the product, such as its usage, structure, architectural components, interfaces, design, implementation, configuration, operation, etc.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1263: Improper Physical Access Control

The product is designed with access restricted to certain information, but it does not sufficiently protect against an unauthorized actor with physical access to these areas.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1294: Insecure Security Identifier Mechanism

The System-on-Chip (SoC) implements a Security Identifier mechanism to differentiate what actions are allowed or disallowed when a transaction originates from an entity. However, the Security Identifiers are not correctly implemented.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1357: Reliance on Insufficiently Trustworthy Component

The product is built from multiple separate components, but it uses a component that is not sufficiently trusted to meet expectations for security, reliability, updateability, and maintainability.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-1384: Improper Handling of Physical or Environmental Conditions

The product does not properly handle unexpected physical or environmental conditions that occur naturally or are artificially induced.

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

### CWE-120: Buffer Copy without Checking Size of Input ('Classic Buffer Overflow')

The product copies an input buffer to an output buffer without verifying that the size of the input buffer is less than the size of the output buffer.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis; Manual Analysis; Automated Dynamic Analysis (Moderate); Automated Static Analysis - Binary or Bytecode (High)

### CWE-123: Write-what-where Condition

Any condition where the attacker has the ability to write an arbitrary value to an arbitrary location, often as the result of a buffer overflow.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-124: Buffer Underwrite ('Buffer Underflow')

The product writes to a buffer using an index or pointer that references a memory location prior to the beginning of the buffer.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-125: Out-of-bounds Read

The product reads data past the end, or before the beginning, of the intended buffer.

**Abstraction**: Base

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-128: Wrap-around Error

Wrap around errors occur whenever a value is incremented past the maximum value for its type and therefore "wraps around" to a very small, negative, or undefined value.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-130: Improper Handling of Length Parameter Inconsistency

The product parses a formatted message or structure, but it does not handle or incorrectly handles a length field that is inconsistent with the actual length of the associated data.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-131: Incorrect Calculation of Buffer Size

The product does not correctly calculate the size to be used when allocating a buffer, which could lead to a buffer overflow.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis (Moderate); Manual Analysis; Manual Analysis (High); Automated Static Analysis - Binary or Bytecode (High)

### CWE-134: Use of Externally-Controlled Format String

The product uses a function that accepts a format string as an argument, but the format string originates from an external source.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis; Black Box (Limited); Automated Static Analysis - Binary or Bytecode (High); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-135: Incorrect Calculation of Multi-Byte String Length

The product does not correctly calculate the length of strings that can contain wide or multi-byte characters.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-170: Improper Null Termination

The product does not terminate or incorrectly terminates a string or array with a null character or equivalent terminator.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-188: Reliance on Data/Memory Layout

The product makes invalid assumptions about how protocol data or memory is organized at a lower level, resulting in unintended program behavior.

**Abstraction**: Base

**Detection Hints**: Fuzzing (High); Automated Dynamic Analysis (Moderate)

### CWE-190: Integer Overflow or Wraparound

The product performs a calculation that can produce an integer overflow or wraparound when the logic assumes that the resulting value will always be larger than the original value. This occurs when an integer value is incremented to a value that is too large to store in the associated representation. When this occurs, the value may become a very small or negative number.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Black Box (Moderate); Manual Analysis (High); Automated Static Analysis - Binary or Bytecode (High); Dynamic Analysis with Manual Results Interpretation (SOAR Partial)

### CWE-191: Integer Underflow (Wrap or Wraparound)

The product subtracts one value from another, such that the result is less than the minimum allowable integer value, which produces a value that is not equal to the correct result.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-193: Off-by-one Error

A product calculates or uses an incorrect maximum or minimum value that is 1 more, or 1 less, than the correct value.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-197: Numeric Truncation Error

Truncation errors occur when a primitive is cast to a primitive of a smaller size and data is lost in the conversion.

**Abstraction**: Base

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High)

### CWE-203: Observable Discrepancy

The product behaves differently or sends different responses under different circumstances in a way that is observable to an unauthorized actor, which exposes security-relevant information about the state of the product, such as whether a particular operation was successful or not.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-205: Observable Behavioral Discrepancy

The product's behaviors indicate important differences that may be observed by unauthorized actors in a way that reveals (1) its internal state or decision process, or (2) differences from other products with equivalent functionality.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-208: Observable Timing Discrepancy

Two separate operations in a product require different amounts of time to complete, in a way that is observable to an actor and reveals security-relevant information about the state of the product, such as whether a particular operation was successful or not.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-226: Sensitive Information in Resource Not Removed Before Reuse

The product releases a resource such as memory or a file so that it can be made available for reuse, but it does not clear or "zeroize" the information contained in the resource before the product performs a critical state transition or makes the resource available for reuse by other entities.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (High); Automated Static Analysis (High)

### CWE-242: Use of Inherently Dangerous Function

The product calls a function that can never be guaranteed to work safely.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-276: Incorrect Default Permissions

During installation, installed file permissions are set to allow anyone to modify those files.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (High); Manual Static Analysis - Source Code (High)

### CWE-306: Missing Authentication for Critical Function

The product does not perform any authentication for functionality that requires a provable user identity or consumes a significant amount of resources.

**Abstraction**: Base

**Detection Hints**: Manual Analysis; Automated Static Analysis (Limited); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial)

### CWE-319: Cleartext Transmission of Sensitive Information

The product transmits sensitive or security-critical data in cleartext in a communication channel that can be sniffed by unauthorized actors.

**Abstraction**: Base

**Detection Hints**: Black Box; Automated Static Analysis (High)

### CWE-325: Missing Cryptographic Step

The product does not implement a required step in a cryptographic algorithm, resulting in weaker encryption than advertised by the algorithm.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-364: Signal Handler Race Condition

The product uses a signal handler that introduces a race condition.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-366: Race Condition within a Thread

If two threads of execution use a resource simultaneously, there exists the possibility that resources may be used while invalid, in turn making the state of execution undefined.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-374: Passing Mutable Objects to an Untrusted Method

The product sends non-cloned mutable data as an argument to a method or function.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-375: Returning a Mutable Object to an Untrusted Caller

Sending non-cloned mutable data as a return value may result in that data being altered or deleted by the calling function.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-403: Exposure of File Descriptor to Unintended Control Sphere ('File Descriptor Leak')

A process does not close sensitive file descriptors before invoking a child process, which allows the child to perform unauthorized I/O operations using those descriptors.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-440: Expected Behavior Violation

A feature, API, or function does not perform according to its specification.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-455: Non-exit on Failed Initialization

The product does not exit or otherwise modify its operation when security-relevant errors occur during initialization, such as when a configuration file has a format error or a hardware security module (HSM) cannot be activated, which can cause the product to execute in a less secure fashion than intended by the administrator.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-460: Improper Cleanup on Thrown Exception

The product does not clean up its state or incorrectly cleans up its state when an exception is thrown, leading to unexpected state or control flow.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-463: Deletion of Data Structure Sentinel

The accidental deletion of a data-structure sentinel can cause serious programming logic problems.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-464: Addition of Data Structure Sentinel

The accidental addition of a data-structure sentinel can cause serious programming logic problems.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-466: Return of Pointer Value Outside of Expected Range

A function can return a pointer to memory that is outside of the buffer that the pointer is expected to reference.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis; Automated Dynamic Analysis (Moderate)

### CWE-468: Incorrect Pointer Scaling

In C and C++, one may often accidentally refer to the wrong memory due to the semantics of when math operations are implicitly scaled.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-469: Use of Pointer Subtraction to Determine Size

The product subtracts one pointer from another in order to determine size, but this calculation can be incorrect if the pointers do not exist in the same memory chunk.

**Abstraction**: Base

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High)

### CWE-474: Use of Function with Inconsistent Implementations

The code uses a function that has inconsistent implementations across operating systems and versions.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-476: NULL Pointer Dereference

The product dereferences a pointer that it expects to be valid but is NULL.

**Abstraction**: Base

**Detection Hints**: Automated Dynamic Analysis (Moderate); Manual Dynamic Analysis; Automated Static Analysis (High)

### CWE-478: Missing Default Case in Multiple Condition Expression

The code does not have a default case in an expression with multiple conditions, such as a switch statement.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-480: Use of Incorrect Operator

The product accidentally uses the wrong operator, which changes the logic in security-relevant ways.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis; Manual Static Analysis

### CWE-483: Incorrect Block Delimitation

The code does not explicitly delimit a block that is intended to contain 2 or more statements, creating a logic error.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-484: Omitted Break Statement in Switch

The product omits a break statement within a switch or similar construct, causing code associated with multiple conditions to execute. This can cause problems when the programmer only intended to execute code associated with one condition.

**Abstraction**: Base

**Detection Hints**: White Box; Black Box; Automated Static Analysis (High)

### CWE-502: Deserialization of Untrusted Data

The product deserializes untrusted data without sufficiently ensuring that the resulting data will be valid.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-562: Return of Stack Variable Address

A function returns the address of a stack variable, which will cause unintended program behavior, typically in the form of a crash.

**Abstraction**: Base

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-617: Reachable Assertion

The product contains an assert() or similar statement that can be triggered by an attacker, which leads to an application exit or other behavior that is more severe than necessary.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-663: Use of a Non-reentrant Function in a Concurrent Context

The product calls a non-reentrant function in a concurrent context in which a competing code sequence (e.g. thread or signal handler) may have an opportunity to call the same function or otherwise influence its state.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-676: Use of Potentially Dangerous Function

The product invokes a potentially dangerous function that could introduce a vulnerability if it is used incorrectly, but the function can also be used safely.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (High); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (High); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High)

### CWE-681: Incorrect Conversion between Numeric Types

When converting from one data type to another, such as long to integer, data can be omitted or translated in a way that produces unexpected values. If the resulting values are used in a sensitive context, then dangerous behaviors may occur.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-733: Compiler Optimization Removal or Modification of Security-critical Code

The developer builds a security-critical protection mechanism into the software, but the compiler optimizes the program such that the mechanism is removed or modified.

**Abstraction**: Base

**Detection Hints**: Black Box (Limited); White Box

### CWE-763: Release of Invalid Pointer or Reference

The product attempts to return a memory resource to the system, but it calls the wrong release function or calls the appropriate release function incorrectly.

**Abstraction**: Base

**Detection Hints**: Fuzzing (High); Automated Dynamic Analysis (Moderate)

### CWE-783: Operator Precedence Logic Error

The product uses an expression in which operator precedence causes incorrect logic to be used.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-786: Access of Memory Location Before Start of Buffer

The product reads or writes to a buffer using an index or pointer that references a memory location prior to the beginning of the buffer.

**Abstraction**: Base

**Detection Hints**: Fuzzing (High); Automated Dynamic Analysis (Moderate)

### CWE-787: Out-of-bounds Write

The product writes data past the end, or before the beginning, of the intended buffer.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis; Automated Dynamic Analysis (Moderate)

### CWE-788: Access of Memory Location After End of Buffer

The product reads or writes to a buffer using an index or pointer that references a memory location after the end of the buffer.

**Abstraction**: Base

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-798: Use of Hard-coded Credentials

The product contains hard-coded credentials, such as a password or cryptographic key.

**Abstraction**: Base

**Detection Hints**: Black Box (Moderate); Automated Static Analysis; Manual Static Analysis; Manual Dynamic Analysis; Automated Static Analysis - Binary or Bytecode (SOAR Partial)

### CWE-805: Buffer Access with Incorrect Length Value

The product uses a sequential operation to read or write a buffer, but it uses an incorrect length value that causes it to access memory that is outside of the bounds of the buffer.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis (Moderate); Manual Analysis

### CWE-822: Untrusted Pointer Dereference

The product obtains a value from an untrusted source, converts this value to a pointer, and dereferences the resulting pointer.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-823: Use of Out-of-range Pointer Offset

The product performs pointer arithmetic on a valid pointer, but it uses an offset that can point outside of the intended range of valid memory locations for the resulting pointer.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-824: Access of Uninitialized Pointer

The product accesses or uses a pointer that has not been initialized.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-825: Expired Pointer Dereference

The product dereferences a pointer that contains a location for memory that was previously valid, but is no longer valid.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis; Automated Dynamic Analysis (Moderate)

### CWE-839: Numeric Range Comparison Without Minimum Check

The product checks a value to ensure that it is less than or equal to a maximum, but it does not also verify that the value is greater than or equal to the minimum.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-843: Access of Resource Using Incompatible Type ('Type Confusion')

The product allocates or initializes a resource such as a pointer, object, or variable using one type, but it later accesses that resource using a type that is incompatible with the original type.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-910: Use of Expired File Descriptor

The product uses or accesses a file descriptor after it has been closed.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-911: Improper Update of Reference Count

The product uses a reference count to manage a resource, but it does not update or incorrectly updates the reference count.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-916: Use of Password Hash With Insufficient Computational Effort

The product generates a hash for a password, but it uses a scheme that does not provide a sufficient level of computational effort that would make password cracking attacks infeasible or expensive.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High); Automated Static Analysis (SOAR Partial)

### CWE-920: Improper Restriction of Power Consumption

The product operates in an environment in which power is a limited resource that cannot be automatically replenished, but the product does not properly restrict the amount of power that its operation consumes.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1053: Missing Documentation for Design

The product does not have documentation that represents how it is designed.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1189: Improper Isolation of Shared Resources on System-on-a-Chip (SoC)

The System-On-a-Chip (SoC) does not properly isolate shared resources between trusted and untrusted agents.

**Abstraction**: Base

**Detection Hints**: Automated Dynamic Analysis (High)

### CWE-1190: DMA Device Enabled Too Early in Boot Phase

The product enables a Direct Memory Access (DMA) capable device before the security configuration settings are established, which allows an attacker to extract data from or gain privileges on the product.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1191: On-Chip Debug and Test Interface With Improper Access Control

The chip does not implement or does not correctly perform access control to check whether users are authorized to access internal registers and test modes through the physical debug/test interface.

**Abstraction**: Base

**Detection Hints**: Dynamic Analysis with Manual Results Interpretation; Fuzzing (Moderate)

### CWE-1192: Improper Identifier for IP Block used in System-On-Chip (SOC)

The System-on-Chip (SoC) does not have unique, immutable identifiers for each of its components.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1193: Power-On of Untrusted Execution Core Before Enabling Fabric Access Control

The product enables components that contain untrusted firmware before memory and fabric access controls have been enabled.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1209: Failure to Disable Reserved Bits

The reserved bits in a hardware design are not disabled prior to production. Typically, reserved bits are used for future capabilities and should not support any functional logic in the design. However, designers might covertly use these bits to debug or further develop new capabilities in production hardware.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1220: Insufficient Granularity of Access Control

The product implements access controls via a policy or other feature with the intention to disable or restrict accesses (reads and/or writes) to assets in a system from untrusted agents. However, implemented access controls lack required granularity, which renders the control policy too broad because it allows accesses from unauthorized agents to the security-sensitive assets.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1221: Incorrect Register Defaults or Module Parameters

Hardware description language code incorrectly defines register defaults or hardware Intellectual Property (IP) parameters to insecure values.

**Abstraction**: Base

**Detection Hints**: Automated Analysis

### CWE-1223: Race Condition for Write-Once Attributes

A write-once register in hardware design is programmable by an untrusted software component earlier than the trusted software component, resulting in a race condition issue.

**Abstraction**: Base

**Detection Hints**: Automated Analysis

### CWE-1224: Improper Restriction of Write-Once Bit Fields

The hardware design control register "sticky bits" or write-once bit fields are improperly implemented, such that they can be reprogrammed by software.

**Abstraction**: Base

**Detection Hints**: Automated Analysis

### CWE-1231: Improper Prevention of Lock Bit Modification

The product uses a trusted lock bit for restricting access to registers, address regions, or other resources, but the product does not prevent the value of the lock bit from being modified after it has been set.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (High)

### CWE-1232: Improper Lock Behavior After Power State Transition

Register lock bit protection disables changes to system configuration once the bit is set. Some of the protected registers or lock bits become programmable after power state transitions (e.g., Entry and wake from low power sleep modes) causing the system configuration to be changeable.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1233: Security-Sensitive Hardware Controls with Missing Lock Bit Protection

The product uses a register lock bit protection mechanism, but it does not ensure that the lock bit prevents modification of system registers or controls that perform changes to important hardware system configuration.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (High)

### CWE-1234: Hardware Internal or Debug Modes Allow Override of Locks

System configuration protection may be bypassed during debug mode.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1240: Use of a Cryptographic Primitive with a Risky Implementation

To fulfill the need for a cryptographic primitive, the product implements a cryptographic algorithm using a non-standard, unproven, or disallowed/non-compliant cryptographic implementation.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (High); Manual Analysis (Moderate); Dynamic Analysis with Manual Results Interpretation (Moderate)

### CWE-1241: Use of Predictable Algorithm in Random Number Generator

The device uses an algorithm that is predictable and generates a pseudo-random number.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1242: Inclusion of Undocumented Features or Chicken Bits

The device includes chicken bits or undocumented features that can create entry points for unauthorized actors.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1243: Sensitive Non-Volatile Information Not Protected During Debug

Access to security-sensitive information stored in fuses is not limited during debug.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1244: Internal Asset Exposed to Unsafe Debug Access Level or State

The product uses physical debug or test interfaces with support for multiple access levels, but it assigns the wrong debug access level to an internal asset, providing unintended access to the asset from untrusted debug agents.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate)

### CWE-1245: Improper Finite State Machines (FSMs) in Hardware Logic

Faulty finite state machines (FSMs) in the hardware logic allow an attacker to put the system in an undefined state, to cause a denial of service (DoS) or gain privileges on the victim's system.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1246: Improper Write Handling in Limited-write Non-Volatile Memories

The product does not implement or incorrectly implements wear leveling operations in limited-write non-volatile memories.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1247: Improper Protection Against Voltage and Clock Glitches

The device does not contain or contains incorrectly implemented circuitry or sensors to detect and mitigate voltage and clock glitches and protect sensitive information or software contained on the device.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate); Dynamic Analysis with Manual Results Interpretation; Architecture or Design Review

### CWE-1248: Semiconductor Defects in Hardware Logic with Security-Sensitive Implications

The security-sensitive hardware module contains semiconductor defects.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1250: Improper Preservation of Consistency Between Independent Representations of Shared State

The product has or supports multiple distributed components or sub-systems that are each required to keep their own local copy of shared data - such as state or cache - but the product does not ensure that all local copies remain consistent with each other.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1251: Mirrored Regions with Different Values

The product's architecture mirrors regions without ensuring that their contents always stay in sync.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1252: CPU Hardware Not Configured to Support Exclusivity of Write and Execute Operations

The CPU is not configured to provide hardware support for exclusivity of write and execute operations on memory. This allows an attacker to execute data from all of memory.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1253: Incorrect Selection of Fuse Values

The logic level used to set a system to a secure state relies on a fuse being unblown.

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

### CWE-1258: Exposure of Sensitive System Information Due to Uncleared Debug Information

The hardware does not fully clear security-sensitive values, such as keys and intermediate values in cryptographic operations, when debug mode is entered.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1259: Improper Restriction of Security Token Assignment

The System-On-A-Chip (SoC) implements a Security Token mechanism to differentiate what actions are allowed or disallowed when a transaction originates from an entity. However, the Security Tokens are improperly protected.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1260: Improper Handling of Overlap Between Protected Memory Ranges

The product allows address regions to overlap, which can result in the bypassing of intended memory protection.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (High)

### CWE-1261: Improper Handling of Single Event Upsets

The hardware logic does not effectively handle when single-event upsets (SEUs) occur.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1262: Improper Access Control for Register Interface

The product uses memory-mapped I/O registers that act as an interface to hardware functionality from software, but there is improper access control to those registers.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate); Simulation / Emulation (Moderate); Formal Verification (High); Automated Analysis (High); Architecture or Design Review (Moderate)

### CWE-1264: Hardware Logic with Insecure De-Synchronization between Control and Data Channels

The hardware logic for error handling and security checks can incorrectly forward data before the security check is complete.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1266: Improper Scrubbing of Sensitive Data from Decommissioned Device

The product does not properly provide a capability for the product administrator to remove sensitive data at the time the product is decommissioned. A scrubbing capability could be missing, insufficient, or incorrect.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1267: Policy Uses Obsolete Encoding

The product uses an obsolete encoding mechanism to implement access controls.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1268: Policy Privileges are not Assigned Consistently Between Control and Data Agents

The product's hardware-enforced access control for a particular resource improperly accounts for privilege discrepancies between control and write policies.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1269: Product Released in Non-Release Configuration

The product released to market is released in pre-production or manufacturing configuration.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1270: Generation of Incorrect Security Tokens

The product implements a Security Token mechanism to differentiate what actions are allowed or disallowed when a transaction originates from an entity. However, the Security Tokens generated in the system are incorrect.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1271: Uninitialized Value on Reset for Registers Holding Security Settings

Security-critical logic is not set to a known value on reset.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1272: Sensitive Information Uncleared Before Debug/Power State Transition

The product performs a power or debug state transition, but it does not clear sensitive information that should no longer be accessible due to changes to information access restrictions.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (High)

### CWE-1273: Device Unlock Credential Sharing

The credentials necessary for unlocking a device are shared across multiple parties and may expose sensitive information.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1274: Improper Access Control for Volatile Memory Containing Boot Code

The product conducts a secure-boot process that transfers bootloader code from Non-Volatile Memory (NVM) into Volatile Memory (VM), but it does not have sufficient access control or other protections for the Volatile Memory.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (High); Manual Analysis (Moderate)

### CWE-1276: Hardware Child Block Incorrectly Connected to Parent System

Signals between a hardware IP and the parent system design are incorrectly connected causing security risks.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1277: Firmware Not Updateable

The product does not provide its users with the ability to update or patch its firmware to address any vulnerabilities or weaknesses that may be present.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (High); Architecture or Design Review (Moderate); Manual Dynamic Analysis (High)

### CWE-1278: Missing Protection Against Hardware Reverse Engineering Using Integrated Circuit (IC) Imaging Techniques

Information stored in hardware may be recovered by an attacker with the capability to capture and analyze images of the integrated circuit using techniques such as scanning electron microscopy.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1279: Cryptographic Operations are run Before Supporting Units are Ready

Performing cryptographic operations without ensuring that the supporting inputs are ready to supply valid data may compromise the cryptographic result.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1280: Access Control Check Implemented After Asset is Accessed

A product's hardware-based access control check occurs after the asset has been accessed.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1281: Sequence of Processor Instructions Leads to Unexpected Behavior

Specific combinations of processor instructions lead to undesirable behavior such as locking the processor until a hard reset performed.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1282: Assumed-Immutable Data is Stored in Writable Memory

Immutable data, such as a first-stage bootloader, device identifiers, and "write-once" configuration settings are stored in writable memory that can be re-programmed or updated in the field.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1283: Mutable Attestation or Measurement Reporting Data

The register contents used for attestation or measurement reporting data to verify boot flow are modifiable by an adversary.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1290: Incorrect Decoding of Security Identifiers 

The product implements a decoding mechanism to decode certain bus-transaction signals to security identifiers. If the decoding is implemented incorrectly, then untrusted agents can now gain unauthorized access to the asset.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1291: Public Key Re-Use for Signing both Debug and Production Code

The same public key is used for signing both debug and production code.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (High); Dynamic Analysis with Manual Results Interpretation (High)

### CWE-1292: Incorrect Conversion of Security Identifiers

The product implements a conversion mechanism to map certain bus-transaction signals to security identifiers. However, if the conversion is incorrectly implemented, untrusted agents can gain unauthorized access to the asset.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1295: Debug Messages Revealing Unnecessary Information

The product fails to adequately prevent the revealing of unnecessary and potentially sensitive system information within debugging messages.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-1296: Incorrect Chaining or Granularity of Debug Components

The product's debug components contain incorrect chaining or granularity of debug components.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (High); Dynamic Analysis with Manual Results Interpretation (High)

### CWE-1297: Unprotected Confidential Information on Device is Accessible by OSAT Vendors

The product does not adequately protect confidential information on the device from being accessed by Outsourced Semiconductor Assembly and Test (OSAT) vendors.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (High); Dynamic Analysis with Manual Results Interpretation (Moderate)

### CWE-1298: Hardware Logic Contains Race Conditions

A race condition in the hardware logic results in undermining security guarantees of the system.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1299: Missing Protection Mechanism for Alternate Hardware Interface

The lack of protections on alternate paths to access control-protected assets (such as unprotected shadow registers and other external facing unguarded interfaces) allows an attacker to bypass existing protections to the asset that are only performed against the primary path.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1300: Improper Protection of Physical Side Channels

The device does not contain sufficient protection mechanisms to prevent physical side channels from exposing sensitive information due to patterns in physically observable phenomena such as variations in power consumption, electromagnetic emissions (EME), or acoustic emissions.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate)

### CWE-1301: Insufficient or Incomplete Data Removal within Hardware Component

The product's data removal process does not completely delete all data and potentially sensitive information within hardware components.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1302: Missing Source Identifier in Entity Transactions on a System-On-Chip (SOC)

The product implements a security identifier mechanism to differentiate what actions are allowed or disallowed when a transaction originates from an entity. A transaction is sent without a security identifier.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1303: Non-Transparent Sharing of Microarchitectural Resources

Hardware structures shared across execution contexts (e.g., caches and branch predictors) can violate the expected architecture isolation between contexts.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1304: Improperly Preserved Integrity of Hardware Configuration State During a Power Save/Restore Operation

The product performs a power save/restore operation, but it does not ensure that the integrity of the configuration state is maintained and/or verified between the beginning and ending of the operation.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1310: Missing Ability to Patch ROM Code

Missing an ability to patch ROM code may leave a System or System-on-Chip (SoC) in a vulnerable state.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1311: Improper Translation of Security Attributes by Fabric Bridge

The bridge incorrectly translates security attributes from either trusted to untrusted or from untrusted to trusted when converting from one fabric protocol to another.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1312: Missing Protection for Mirrored Regions in On-Chip Fabric Firewall

The firewall in an on-chip fabric protects the main addressed region, but it does not protect any mirrored memory or memory-mapped-IO (MMIO) regions.

**Abstraction**: Base

**Detection Hints**: Manual Dynamic Analysis (High)

### CWE-1313: Hardware Allows Activation of Test or Debug Logic at Runtime

During runtime, the hardware allows for test or debug logic (feature) to be activated, which allows for changing the state of the hardware. This feature can alter the intended behavior of the system and allow for alteration and leakage of sensitive data by an adversary.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1314: Missing Write Protection for Parametric Data Values

The device does not write-protect the parametric data values for sensors that scale the sensor value, allowing untrusted software to manipulate the apparent result and potentially damage hardware or cause operational failure.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1315: Improper Setting of Bus Controlling Capability in Fabric End-point

The bus controller enables bits in the fabric end-point to allow responder devices to control transactions on the fabric.

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

### CWE-1319: Improper Protection against Electromagnetic Fault Injection (EM-FI)

The device is susceptible to electromagnetic fault injection attacks, causing device internal information to be compromised or security mechanisms to be bypassed.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1320: Improper Protection for Outbound Error Messages and Alert Signals

Untrusted agents can disable alerts about signal conditions exceeding limits or the response mechanism that handles such alerts.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1323: Improper Management of Sensitive Trace Data

Trace data collected from several sources on the System-on-Chip (SoC) is stored in unprotected locations or transported to untrusted agents.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1325: Improperly Controlled Sequential Memory Allocation

The product manages a group of objects or resources and performs a separate memory allocation for each object, but it does not properly limit the total amount of memory that is consumed by all of the combined objects.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1326: Missing Immutable Root of Trust in Hardware

A missing immutable root of trust in the hardware results in the ability to bypass secure boot or execute untrusted or adversarial boot code.

**Abstraction**: Base

**Detection Hints**: Automated Dynamic Analysis (High); Architecture or Design Review (High)

### CWE-1328: Security Version Number Mutable to Older Versions

Security-version number in hardware is mutable, resulting in the ability to downgrade (roll-back) the boot firmware to vulnerable code versions.

**Abstraction**: Base

**Detection Hints**: Automated Dynamic Analysis (High); Architecture or Design Review (High)

### CWE-1329: Reliance on Component That is Not Updateable

The product contains a component that cannot be updated or patched in order to remove vulnerabilities or significant bugs.

**Abstraction**: Base

**Detection Hints**: Architecture or Design Review (Moderate)

### CWE-1331: Improper Isolation of Shared Resources in Network On Chip (NoC)

The Network On Chip (NoC) does not isolate or incorrectly isolates its on-chip-fabric and internal resources such that they are shared between trusted and untrusted agents, creating timing channels.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate)

### CWE-1332: Improper Handling of Faults that Lead to Instruction Skips

The device is missing or incorrectly implements circuitry or sensors that detect and mitigate the skipping of security-critical CPU instructions when they occur.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (Moderate); Simulation / Emulation (Moderate); Manual Analysis (Moderate)

### CWE-1334: Unauthorized Error Injection Can Degrade Hardware Redundancy

An unauthorized agent can inject errors into a redundant block to deprive the system of redundancy or put the system in a degraded operating mode.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1335: Incorrect Bitwise Shift of Integer

An integer value is specified to be shifted by a negative amount or an amount greater than or equal to the number of bits contained in the value causing an unexpected or indeterminate result.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-1338: Improper Protections Against Hardware Overheating

A hardware device is missing or has inadequate protection features to prevent overheating.

**Abstraction**: Base

**Detection Hints**: Dynamic Analysis with Manual Results Interpretation (High); Architecture or Design Review (High)

### CWE-1341: Multiple Releases of Same Resource or Handle

The product attempts to close or release a resource or handle more than once, without any successful open between the close operations.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis; Automated Dynamic Analysis

### CWE-1342: Information Exposure through Microarchitectural State after Transient Execution

The processor does not properly clear microarchitectural state after incorrect microcode assists or speculative execution, resulting in transient execution.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1351: Improper Handling of Hardware Behavior in Exceptionally Cold Environments

A hardware device, or the firmware running on it, is missing or has incorrect protection features to maintain goals of security primitives when the device is cooled below standard operating temperatures.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1420: Exposure of Sensitive Information during Transient Execution

A processor event or prediction may allow incorrect operations (or correct operations with incorrect data) to execute transiently, potentially exposing data over a covert channel.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate); Fuzzing (Opportunistic); Automated Static Analysis (Limited); Automated Analysis (High)

### CWE-1421: Exposure of Sensitive Information in Shared Microarchitectural Structures during Transient Execution

A processor event may allow transient operations to access architecturally restricted data (for example, in another address space) in a shared microarchitectural structure (for example, a CPU cache), potentially exposing the data over a covert channel.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate); Automated Analysis (Moderate); Automated Analysis (High); Fuzzing (Opportunistic)

### CWE-1422: Exposure of Sensitive Information caused by Incorrect Data Forwarding during Transient Execution

A processor event or prediction may allow incorrect or stale data to be forwarded to transient operations, potentially exposing data over a covert channel.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (Moderate); Manual Analysis (Moderate); Automated Analysis (High)

### CWE-1423: Exposure of Sensitive Information caused by Shared Microarchitectural Predictor State that Influences Transient Execution

Shared microarchitectural predictor state may allow code to influence transient execution across a hardware boundary, potentially exposing data that is accessible beyond the boundary over a covert channel.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate); Automated Analysis (High); Automated Analysis (Moderate)

### CWE-1429: Missing Security-Relevant Feedback for Unexecuted Operations in Hardware Interface

The product has a hardware interface that silently discards operations in situations for which feedback would be security-relevant, such as the timely detection of failures or attacks.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Source Code (High); Manual Static Analysis - Source Code (Moderate)

### CWE-1431: Driving Intermediate Cryptographic State/Results to Hardware Module Outputs

The product uses a hardware module implementing a cryptographic algorithm that writes sensitive information about the intermediate state or results of its cryptographic operations via one of its output wires (typically the output port containing the final result).

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Source Code (High); Simulation / Emulation (High); Formal Verification (High); Manual Analysis (Opportunistic)

### CWE-14: Compiler Removal of Code to Clear Buffers

Sensitive memory is cleared according to the source code, but compiler optimizations leave the memory untouched when it is not read from again, aka "dead store removal.".

**Abstraction**: Variant

**Detection Hints**: Black Box (Limited); White Box

### CWE-121: Stack-based Buffer Overflow

A stack-based buffer overflow condition is a condition where the buffer being overwritten is allocated on the stack (i.e., is a local variable or, rarely, a parameter to a function).

**Abstraction**: Variant

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-122: Heap-based Buffer Overflow

A heap overflow condition is a buffer overflow, where the buffer that can be overwritten is allocated in the heap portion of memory, generally meaning that the buffer was allocated using a routine such as malloc().

**Abstraction**: Variant

**Detection Hints**: Fuzzing (High); Automated Dynamic Analysis (Moderate)

### CWE-126: Buffer Over-read

The product reads from a buffer using buffer access mechanisms such as indexes or pointers that reference memory locations after the targeted buffer.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-127: Buffer Under-read

The product reads from a buffer using buffer access mechanisms such as indexes or pointers that reference memory locations prior to the targeted buffer.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-129: Improper Validation of Array Index

The product uses untrusted input when calculating or using an array index, but the product does not validate or incorrectly validates the index to ensure the index references a valid position within the array.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis; Automated Dynamic Analysis (Moderate); Black Box

### CWE-158: Improper Neutralization of Null Byte or NUL Character

The product receives input from an upstream component, but it does not neutralize or incorrectly neutralizes NUL characters or null bytes when they are sent to a downstream component.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-192: Integer Coercion Error

Integer coercion refers to a set of flaws pertaining to the type casting, extension, or truncation of primitive data types.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-194: Unexpected Sign Extension

The product performs an operation on a number that causes it to be sign extended when it is transformed into a larger data type. When the original number is negative, this can produce unexpected values that lead to resultant weaknesses.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-195: Signed to Unsigned Conversion Error

The product uses a signed primitive and performs a cast to an unsigned primitive, which can produce an unexpected value if the value of the signed primitive can not be represented using an unsigned primitive.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-196: Unsigned to Signed Conversion Error

The product uses an unsigned primitive and performs a cast to a signed primitive, which can produce an unexpected value if the value of the unsigned primitive can not be represented using a signed primitive.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-243: Creation of chroot Jail Without Changing Working Directory

The product uses the chroot() system call to create a jail, but does not change the working directory afterward. This does not prevent access to files outside of the jail.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-244: Improper Clearing of Heap Memory Before Release ('Heap Inspection')

Using realloc() to resize buffers that store sensitive information can leave the sensitive information exposed to attack, because it is not removed from memory.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-401: Missing Release of Memory after Effective Lifetime

The product does not sufficiently track and release allocated memory after it has been used, making the memory unavailable for reallocation and reuse.

**Abstraction**: Variant

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High)

### CWE-415: Double Free

The product calls free() twice on the same memory address.

**Abstraction**: Variant

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-416: Use After Free

The product reuses or references memory after it has been freed. At some point afterward, the memory may be allocated again and saved in another pointer, while the original pointer references a location somewhere within the new allocation. Any operations using the original pointer are no longer valid because the memory "belongs" to the code that operates on the new pointer.

**Abstraction**: Variant

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-457: Use of Uninitialized Variable

The code uses a variable that has not been initialized, leading to unpredictable or unintended results.

**Abstraction**: Variant

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High)

### CWE-462: Duplicate Key in Associative List (Alist)

Duplicate keys in associative lists can lead to non-unique keys being mistaken for an error.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-467: Use of sizeof() on a Pointer Type

The code calls sizeof() on a pointer type, which can be an incorrect calculation if the programmer intended to determine the size of the data that is being pointed to.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-479: Signal Handler Use of a Non-reentrant Function

The product defines a signal handler that calls a non-reentrant function.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-481: Assigning instead of Comparing

The code uses an operator for assignment when the intention was to perform a comparison.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-482: Comparing instead of Assigning

The code uses an operator for comparison when the intention was to perform an assignment.

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

### CWE-558: Use of getlogin() in Multithreaded Application

The product uses the getlogin() function in a multithreaded context, potentially causing it to return incorrect values.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-560: Use of umask() with chmod-style Argument

The product calls umask() with an incorrect argument that is specified as if it is an argument to chmod().

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-587: Assignment of a Fixed Address to a Pointer

The product sets a pointer to a specific address other than NULL or 0.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis; Automated Dynamic Analysis (Moderate)

### CWE-588: Attempt to Access Child of a Non-structure Pointer

Casting a non-structure type to a structure type and accessing a field can lead to memory access errors or data corruption.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-590: Free of Memory not on the Heap

The product calls free() on a pointer to memory that was not allocated using associated heap allocation functions such as malloc(), calloc(), or realloc().

**Abstraction**: Variant

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-685: Function Call With Incorrect Number of Arguments

The product calls a function, procedure, or routine, but the caller specifies too many arguments, or too few arguments, which may lead to undefined behavior and resultant weaknesses.

**Abstraction**: Variant

**Detection Hints**: Other

### CWE-688: Function Call With Incorrect Variable or Reference as Argument

The product calls a function, procedure, or routine, but the caller specifies the wrong variable or reference as one of the arguments, which may lead to undefined behavior and resultant weaknesses.

**Abstraction**: Variant

**Detection Hints**: Other

### CWE-759: Use of a One-Way Hash without a Salt

The product uses a one-way cryptographic hash against an input that should not be reversible, such as a password, but the product does not also use a salt as part of the input.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High); Automated Static Analysis (SOAR Partial)

### CWE-760: Use of a One-Way Hash with a Predictable Salt

The product uses a one-way cryptographic hash against an input that should not be reversible, such as a password, but the product uses a predictable salt as part of the input.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-761: Free of Pointer not at Start of Buffer

The product calls free() on a pointer to a memory resource that was allocated on the heap, but the pointer is not at the start of the buffer.

**Abstraction**: Variant

**Detection Hints**: Dynamic Analysis with Automated Results Interpretation; Automated Dynamic Analysis (Moderate)

### CWE-762: Mismatched Memory Management Routines

The product attempts to return a memory resource to the system, but it calls a release function that is not compatible with the function that was originally used to allocate that resource.

**Abstraction**: Variant

**Detection Hints**: Dynamic Analysis with Automated Results Interpretation; Automated Dynamic Analysis (Moderate)

### CWE-768: Incorrect Short Circuit Evaluation

The product contains a conditional statement with multiple logical expressions in which one of the non-leading expressions may produce side effects. This may lead to an unexpected state in the program after the execution of the conditional, because short-circuiting logic may prevent the side effects from occurring.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-781: Improper Address Validation in IOCTL with METHOD_NEITHER I/O Control Code

The product defines an IOCTL that uses METHOD_NEITHER for I/O, but it does not validate or incorrectly validates the addresses that are provided.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-782: Exposed IOCTL with Insufficient Access Control

The product implements an IOCTL with functionality that should be restricted, but it does not properly enforce access control for the IOCTL.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-785: Use of Path Manipulation Function without Maximum-sized Buffer

The product invokes a function for normalizing paths or file names, but it provides an output buffer that is smaller than the maximum possible size, such as PATH_MAX.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-789: Memory Allocation with Excessive Size Value

The product allocates memory based on an untrusted, large size value, but it does not ensure that the size is within expected limits, allowing arbitrary amounts of memory to be allocated.

**Abstraction**: Variant

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-806: Buffer Access Using Size of Source Buffer

The product uses the size of a source buffer when reading from or writing to a destination buffer, which may cause it to access memory that is outside of the bounds of the buffer.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-828: Signal Handler with Functionality that is not Asynchronous-Safe

The product defines a signal handler that contains code sequences that are not asynchronous-safe, i.e., the functionality is not reentrant, or it can be interrupted.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-1222: Insufficient Granularity of Address Regions Protected by Register Locks

The product defines a large address region protected from modification by the same register lock control bit. This results in a conflict between the functional requirement that some addresses need to be writable by software during operation and the security requirement that the system configuration lock bit must be set during the boot process.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1239: Improper Zeroization of Hardware Register

The hardware product does not properly clear sensitive information from built-in registers when the user of the hardware block changes.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1255: Comparison Logic is Vulnerable to Power Side-Channel Attacks

A device's real time power consumption may be monitored during security token evaluation and the information gleaned may be used to determine the value of the reference token.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1330: Remanent Data Readable after Memory Erase

Confidential information stored in memory circuits is readable or recoverable after being cleared or erased.

**Abstraction**: Variant

**Detection Hints**: Architecture or Design Review; Dynamic Analysis with Manual Results Interpretation

### CWE-680: Integer Overflow to Buffer Overflow

The product performs a calculation to determine how much memory to allocate, but an integer overflow can occur that causes less memory to be allocated than expected, leading to a buffer overflow.

**Abstraction**: Compound

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis (Moderate)

### CWE-689: Permission Race Condition During Resource Copy

The product, while copying or cloning a resource, does not set the resource's permissions or access control until the copy is complete, leaving the resource exposed to other spheres while the copy is taking place.

**Abstraction**: Compound

**Detection Hints**: No specific detection method documented in CWE.

### CWE-690: Unchecked Return Value to NULL Pointer Dereference

The product does not check for an error after calling a function that can return with a NULL pointer if the function fails, which leads to a resultant NULL pointer dereference.

**Abstraction**: Compound

**Detection Hints**: Black Box; White Box; Automated Dynamic Analysis (Moderate)

## Summary

| Abstraction | Count |
|-------------|-------|
| Pillar      | 1     |
| Class       | 12    |
| Base        | 164   |
| Variant     | 46    |
| Compound    | 3     |
| **Total**   | **226** |
