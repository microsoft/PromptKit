<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: cwe-kernel-mode-c-cpp
type: taxonomy
domain: kernel-mode-c-cpp
description: >
  CWE-derived classification scheme for OS kernel and driver code in C/C++.
  113 weakness classes from CWE version 4.19.1. Use to scope
  security audits to domain-relevant vulnerability classes only.
cwe_version: "4.19.1"
---

> This file contains data derived from the Common Weakness Enumeration
> (CWE™) maintained by The MITRE Corporation. © 2006–2026 The MITRE
> Corporation. Used under the CWE Terms of Use:
> https://cwe.mitre.org/about/termsofuse.html


# Taxonomy: CWE Kernel-Mode C/C++

This taxonomy contains 113 CWE weakness classes applicable to
OS kernel and driver code in C/C++. Derived from CWE version 4.19.1.

When performing a security audit scoped to the `kernel-mode-c-cpp` domain,
**only** consider CWE IDs listed in this taxonomy. If you find something
plausible outside this subset, record it as `out-of-scope candidate`
with the CWE ID — do not expand scope.

## Classes

### CWE-119: Improper Restriction of Operations within the Bounds of a Memory Buffer

The product performs operations on a memory buffer, but it reads from or writes to a memory location outside the buffer's intended boundary. This may result in read or write operations on unexpected memory locations that could be linked to other variables, data structures, or internal program data.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High); Automated Dynamic Analysis; Automated Dynamic Analysis (Moderate); Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial)

### CWE-362: Concurrent Execution using Shared Resource with Improper Synchronization ('Race Condition')

The product contains a concurrent code sequence that requires temporary, exclusive access to a shared resource, but a timing window exists in which the shared resource can be modified by another code sequence operating concurrently.

**Abstraction**: Class

**Detection Hints**: Black Box; White Box; Automated Dynamic Analysis (Moderate); Automated Static Analysis - Binary or Bytecode (High); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-704: Incorrect Type Conversion or Cast

The product does not correctly convert an object, resource, or structure from one type to a different type.

**Abstraction**: Class

**Detection Hints**: Fuzzing (High)

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

### CWE-242: Use of Inherently Dangerous Function

The product calls a function that can never be guaranteed to work safely.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-248: Uncaught Exception

An exception is thrown from a function, but it is not caught.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

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

### CWE-396: Declaration of Catch for Generic Exception

Catching overly broad exceptions promotes complex error handling code that is more likely to contain security vulnerabilities.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-397: Declaration of Throws for Generic Exception

The product throws or raises an overly broad exceptions that can hide important details and produce inappropriate responses to certain conditions.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-403: Exposure of File Descriptor to Unintended Control Sphere ('File Descriptor Leak')

A process does not close sensitive file descriptors before invoking a child process, which allows the child to perform unauthorized I/O operations using those descriptors.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

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

### CWE-766: Critical Data Element Declared Public

The product declares a critical variable, field, or member to be public when intended security policy requires it to be private.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-767: Access to Critical Private Variable via Public Method

The product defines a public method that reads or modifies a private variable.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

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

### CWE-1325: Improperly Controlled Sequential Memory Allocation

The product manages a group of objects or resources and performs a separate memory allocation for each object, but it does not properly limit the total amount of memory that is consumed by all of the combined objects.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1335: Incorrect Bitwise Shift of Integer

An integer value is specified to be shifted by a negative amount or an amount greater than or equal to the number of bits contained in the value causing an unexpected or indeterminate result.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-1341: Multiple Releases of Same Resource or Handle

The product attempts to close or release a resource or handle more than once, without any successful open between the close operations.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis; Automated Dynamic Analysis

### CWE-1423: Exposure of Sensitive Information caused by Shared Microarchitectural Predictor State that Influences Transient Execution

Shared microarchitectural predictor state may allow code to influence transient execution across a hardware boundary, potentially exposing data that is accessible beyond the boundary over a covert channel.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (Moderate); Automated Analysis (High); Automated Analysis (Moderate)

### CWE-1429: Missing Security-Relevant Feedback for Unexecuted Operations in Hardware Interface

The product has a hardware interface that silently discards operations in situations for which feedback would be security-relevant, such as the timely detection of failures or attacks.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Source Code (High); Manual Static Analysis - Source Code (Moderate)

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

### CWE-500: Public Static Field Not Marked Final

An object contains a public static field that is not marked final, which might allow it to be modified in unexpected ways.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-543: Use of Singleton Pattern Without Synchronization in a Multithreaded Context

The product uses the singleton pattern when creating a resource within a multithreaded environment.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

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
| Pillar      | 0     |
| Class       | 3     |
| Base        | 63    |
| Variant     | 44    |
| Compound    | 3     |
| **Total**   | **113** |
