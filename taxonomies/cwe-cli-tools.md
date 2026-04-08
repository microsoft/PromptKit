<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: cwe-cli-tools
type: taxonomy
domain: cli-tools
description: >
  CWE-derived classification scheme for Command-line tools and utilities.
  65 weakness classes from CWE version 4.19.1. Use to scope
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

# Taxonomy: CWE CLI Tools

This taxonomy contains 65 CWE weakness classes applicable to
Command-line tools and utilities. Derived from CWE version 4.19.1.

When performing a security audit scoped to the `cli-tools` domain,
**only** consider CWE IDs listed in this taxonomy. If you find something
plausible outside this subset, record it as `out-of-scope candidate`
with the CWE ID — do not expand scope.

## Classes

### CWE-284: Improper Access Control

The product does not restrict or incorrectly restricts access to a resource from an unauthorized actor.

**Abstraction**: Pillar

**Detection Hints**: No specific detection method documented in CWE.

### CWE-77: Improper Neutralization of Special Elements used in a Command ('Command Injection')

The product constructs all or part of a command using externally-influenced input from an upstream component, but it does not neutralize or incorrectly neutralizes special elements that could modify the intended command when it is sent to a downstream component.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-99: Improper Control of Resource Identifiers ('Resource Injection')

The product receives input from an upstream component, but it does not restrict or incorrectly restricts the input before it is used as an identifier for a resource that may be outside the intended sphere of control.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis (High)

### CWE-200: Exposure of Sensitive Information to an Unauthorized Actor

The product exposes sensitive information to an actor that is not explicitly authorized to have access to that information.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (High); Dynamic Analysis with Manual Results Interpretation (SOAR Partial); Manual Static Analysis - Source Code (High); Automated Static Analysis - Source Code (High)

### CWE-668: Exposure of Resource to Wrong Sphere

The product exposes a resource to the wrong control sphere, providing unintended actors with inappropriate access to the resource.

**Abstraction**: Class

**Detection Hints**: No specific detection method documented in CWE.

### CWE-841: Improper Enforcement of Behavioral Workflow

The product supports a session in which more than one behavior must be performed by an actor, but it does not properly ensure that the actor performs the behaviors in the required sequence.

**Abstraction**: Class

**Detection Hints**: Automated Static Analysis

### CWE-22: Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')

The product uses external input to construct a pathname that is intended to identify a file or directory that is located underneath a restricted parent directory, but the product does not properly neutralize special elements within the pathname that can cause the pathname to resolve to a location that is outside of the restricted directory.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High); Manual Static Analysis (High); Automated Static Analysis - Binary or Bytecode (High); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (High)

### CWE-36: Absolute Path Traversal

The product uses external input to construct a pathname that should be within a restricted directory, but it does not properly neutralize absolute path sequences such as "/abs/path" that can resolve to a location that is outside of that directory.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-41: Improper Resolution of Path Equivalence

The product is vulnerable to file system contents disclosure through path equivalence. Path equivalence involves the use of special characters in file and directory names. The associated manipulations are intended to generate multiple names for the same object.

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

### CWE-214: Invocation of Process Using Visible Sensitive Information

A process is invoked with sensitive command-line arguments, environment variables, or other elements that can be seen by other processes on the operating system.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-260: Password in Configuration File

The product stores a password in a configuration file that might be accessible to actors who do not know the password.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-276: Incorrect Default Permissions

During installation, installed file permissions are set to allow anyone to modify those files.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis - Binary or Bytecode (SOAR Partial); Manual Static Analysis - Binary or Bytecode (SOAR Partial); Dynamic Analysis with Automated Results Interpretation (SOAR Partial); Dynamic Analysis with Manual Results Interpretation (High); Manual Static Analysis - Source Code (High)

### CWE-363: Race Condition Enabling Link Following

The product checks the status of a file or directory before accessing it, which produces a race condition in which the file can be replaced with a link before the access is performed, causing the product to access the wrong file.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis

### CWE-379: Creation of Temporary File in Directory with Insecure Permissions

The product creates a temporary file in a directory whose permissions allow unintended actors to determine the file's existence or otherwise access that file.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

### CWE-480: Use of Incorrect Operator

The product accidentally uses the wrong operator, which changes the logic in security-relevant ways.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis; Manual Static Analysis

### CWE-921: Storage of Sensitive Data in a Mechanism without Access Control

The product stores sensitive information in a file system or device that does not have built-in access control.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1112: Incomplete Documentation of Program Execution

The document does not fully define all mechanisms that are used to control or influence how product-specific programs are executed.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1249: Application-Level Admin Tool with Inconsistent View of Underlying Operating System

The product provides an application for administrators to manage parts of the underlying operating system, but the application does not accurately identify all of the relevant entities or resources that exist in the OS; that is, the application's model of the OS's state is inconsistent with the OS's actual state.

**Abstraction**: Base

**Detection Hints**: No specific detection method documented in CWE.

### CWE-1285: Improper Validation of Specified Index, Position, or Offset in Input

The product receives input that is expected to specify an index, position, or offset into an indexable resource such as a buffer or file, but it does not validate or incorrectly validates that the specified index/position/offset has the required properties.

**Abstraction**: Base

**Detection Hints**: Automated Static Analysis (High)

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

### CWE-69: Improper Handling of Windows ::DATA Alternate Data Stream

The product does not properly prevent access to, or detect usage of, alternate data streams (ADS).

**Abstraction**: Variant

**Detection Hints**: Automated Analysis

### CWE-72: Improper Handling of Apple HFS+ Alternate Data Stream Path

The product does not properly handle special paths that may identify the data or resource fork of a file on the HFS+ file system.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-313: Cleartext Storage in a File or on Disk

The product stores sensitive information in cleartext in a file, or on disk.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-457: Use of Uninitialized Variable

The code uses a variable that has not been initialized, leading to unpredictable or unintended results.

**Abstraction**: Variant

**Detection Hints**: Fuzzing (High); Automated Static Analysis (High)

### CWE-520: .NET Misconfiguration: Use of Impersonation

Allowing a .NET application to run at potentially escalated levels of access to the underlying operating and file systems can be dangerous and result in various forms of attacks.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-528: Exposure of Core Dump File to an Unauthorized Control Sphere

The product generates a core dump file in a directory, archive, or other resource that is stored, transferred, or otherwise made accessible to unauthorized actors.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-530: Exposure of Backup File to an Unauthorized Control Sphere

A backup file is stored in a directory or archive that is made accessible to unauthorized actors.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-541: Inclusion of Sensitive Information in an Include File

If an include file source is accessible, the file can contain usernames and passwords, as well as sensitive information pertaining to the application and system.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-553: Command Shell in Externally Accessible Directory

A possible shell file exists in /cgi-bin/ or other accessible directories. This is extremely dangerous and can be used by an attacker to execute commands on the web server.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-626: Null Byte Interaction Error (Poison Null Byte)

The product does not properly handle null bytes or NUL characters when passing data between different representations or components.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis

### CWE-646: Reliance on File Name or Extension of Externally-Supplied File

The product allows a file to be uploaded, but it relies on the file name or extension of the file to determine the appropriate behaviors. This could be used by attackers to cause the file to be misclassified and processed in a dangerous fashion.

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-651: Exposure of WSDL File Containing Sensitive Information

The Web services architecture may require exposing a Web Service Definition Language (WSDL) file that contains information on the publicly accessible services and how callers of these services should interact with them (e.g. what parameters they expect and what types they return).

**Abstraction**: Variant

**Detection Hints**: No specific detection method documented in CWE.

### CWE-942: Permissive Cross-domain Security Policy with Untrusted Domains

The product uses a web-client protection mechanism such as a Content Security Policy (CSP) or cross-domain policy file, but the policy includes untrusted domains with which the web client is allowed to communicate.

**Abstraction**: Variant

**Detection Hints**: Automated Static Analysis (High)

### CWE-1330: Remanent Data Readable after Memory Erase

Confidential information stored in memory circuits is readable or recoverable after being cleared or erased.

**Abstraction**: Variant

**Detection Hints**: Architecture or Design Review; Dynamic Analysis with Manual Results Interpretation

### CWE-61: UNIX Symbolic Link (Symlink) Following

The product, when opening a file or directory, does not sufficiently account for when the file is a symbolic link that resolves to a target outside of the intended control sphere. This could allow an attacker to cause the product to operate on unauthorized files.

**Abstraction**: Compound

**Detection Hints**: Automated Static Analysis

## Summary

| Abstraction | Count |
|-------------|-------|
| Pillar      | 1     |
| Class       | 5     |
| Base        | 16    |
| Variant     | 42    |
| Compound    | 1     |
| **Total**   | **65** |
