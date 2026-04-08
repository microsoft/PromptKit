<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: cwe-managed-dotnet
type: taxonomy
domain: managed-dotnet
description: >
  CWE-derived classification scheme for .NET managed code (C#, F#, VB.NET).
  92 weakness classes from CWE version 4.19.1. Use to scope
  security audits to domain-relevant vulnerability classes only.
cwe_version: "4.19.1"
applicable_to:
  - investigate-security
  - review-code
  - review-cpp-code
  - exhaustive-bug-hunt
---

# Taxonomy: CWE Managed .NET

This taxonomy contains 92 CWE weakness classes applicable to
.NET managed code (C#, F#, VB.NET). Derived from CWE version 4.19.1.

When performing a security audit scoped to the `managed-dotnet` domain,
**only** consider CWE IDs listed in this taxonomy. If you find something
plausible outside this subset, record it as `out-of-scope candidate`
with the CWE ID — do not expand scope.

## Classes

### CWE-362: Concurrent Execution using Shared Resource with Improper Synchronization ('Race Condition')

The product contains a concurrent code sequence that requires temporary, exclusive access to a shared resource, but a timing window exists in which the shared resource can be modified by another code sequence operating concurrently.

**Abstraction**: Class

**Detection Hints**: Black Box; White Box; Automated Dynamic Analysis (Moderate); Automated Static Analysis - Binary or Bytecode (High); Dynamic Analysis with Automated Results Interpretation (SOAR Partial)

### CWE-913: Improper Control of Dynamically-Managed Code Resources

The product does not properly restrict reading from or writing to dynamically-managed code resources such as variables, objects, classes, attributes, functions, or executable instructions or statements.

**Abstraction**: Class

**Detection Hints**: Fuzzing (High)

### CWE-191: Integer Underflow (Wrap or Wraparound)

The product subtracts one value from another, such that the result is less than the minimum allowable integer value, which produces a value that is not equal to the correct result.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-197: Numeric Truncation Error

Truncation errors occur when a primitive is cast to a primitive of a smaller size and data is lost in the conversion.

**Abstraction**: Base

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High)

### CWE-209: Generation of Error Message Containing Sensitive Information

The product generates an error message that includes sensitive information about its environment, users, or associated data.

**Abstraction**: Base

**Detection Hints**: Manual Analysis (High); Automated Analysis (Moderate); Automated Dynamic Analysis (Moderate); Manual Dynamic Analysis; Automated Static Analysis

### CWE-248: Uncaught Exception

An exception is thrown from a function, but it is not caught.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-301: Reflection Attack in an Authentication Protocol

Simple authentication protocols are subject to reflection attacks if a malicious user can use the target machine to impersonate a trusted user.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

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

### CWE-434: Unrestricted Upload of File with Dangerous Type

The product allows the upload or transfer of dangerous file types that are automatically processed within its environment.

**Abstraction**: Base

**Detection Hints**: Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High); Architecture or Design Review (High)

### CWE-460: Improper Cleanup on Thrown Exception

The product does not clean up its state or incorrectly cleans up its state when an exception is thrown, leading to unexpected state or control flow.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-470: Use of Externally-Controlled Input to Select Classes or Code ('Unsafe Reflection')

The product uses external input with reflection to select which classes or code to use, but it does not sufficiently prevent the input from selecting improper classes or code.

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

### CWE-484: Omitted Break Statement in Switch

The product omits a break statement within a switch or similar construct, causing code associated with multiple conditions to execute. This can cause problems when the programmer only intended to execute code associated with one condition.

**Abstraction**: Base

**Detection Hints**: White Box; Black Box; Automated Static Analysis (High)

### CWE-487: Reliance on Package-level Scope

Java packages are not inherently closed; therefore, relying on them for code security is not a good practice.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-502: Deserialization of Untrusted Data

The product deserializes untrusted data without sufficiently ensuring that the resulting data will be valid.

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

### CWE-609: Double-Checked Locking

The product uses double-checked locking to access a resource without the overhead of explicit synchronization, but the locking is insufficient.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-617: Reachable Assertion

The product contains an assert() or similar statement that can be triggered by an attacker, which leads to an application exit or other behavior that is more severe than necessary.

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

### CWE-771: Missing Reference to Active Allocated Resource

The product does not properly maintain a reference to a resource that has been allocated, which prevents the resource from being reclaimed.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-917: Improper Neutralization of Special Elements used in an Expression Language Statement ('Expression Language Injection')

The product constructs all or part of an expression language (EL) statement in a framework such as a Java Server Page (JSP) using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended EL statement before it is executed.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-1235: Incorrect Use of Autoboxing and Unboxing for Performance Critical Operations

The code uses boxed primitives, which may introduce inefficiencies into performance-critical operations.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

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

### CWE-12: ASP.NET Misconfiguration: Missing Custom Error Page

An ASP .NET application must enable custom error pages in order to prevent attackers from mining information from the framework's built-in responses.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-95: Improper Neutralization of Directives in Dynamically Evaluated Code ('Eval Injection')

The product receives input from an upstream component, but it does not neutralize or incorrectly neutralizes code syntax before using the input in a dynamic evaluation call (e.g. "eval").

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

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

### CWE-192: Integer Coercion Error

Integer coercion refers to a set of flaws pertaining to the type casting, extension, or truncation of primitive data types.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-245: J2EE Bad Practices: Direct Management of Connections

The J2EE application directly manages connections, instead of using the container's connection management facilities.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-246: J2EE Bad Practices: Direct Use of Sockets

The J2EE application directly uses sockets instead of using framework method calls.

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

### CWE-536: Servlet Runtime Error Message Containing Sensitive Information

A servlet error message indicates that there exists an unhandled exception in the web application code and may provide useful information to an attacker.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-537: Java Runtime Error Message Containing Sensitive Information

In many cases, an attacker can leverage the conditions that cause unhandled exception errors in order to gain unauthorized access to the system.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-543: Use of Singleton Pattern Without Synchronization in a Multithreaded Context

The product uses the singleton pattern when creating a resource within a multithreaded environment.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-554: ASP.NET Misconfiguration: Not Using Input Validation Framework

The ASP.NET application does not use an input validation framework.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-555: J2EE Misconfiguration: Plaintext Password in Configuration File

The J2EE application stores a plaintext password in a configuration file.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-556: ASP.NET Misconfiguration: Use of Identity Impersonation

Configuring an ASP.NET application to run with impersonated credentials may give the application unnecessary privileges.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

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

## Summary

| Abstraction | Count |
|-------------|-------|
| Pillar      | 0     |
| Class       | 2     |
| Base        | 31    |
| Variant     | 59    |
| Compound    | 0     |
| **Total**   | **92** |
