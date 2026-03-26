<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: winrt-design-patterns
type: analysis
description: >
  Analysis protocol for reviewing Windows Runtime API code against
  established WinRT design patterns. Covers activation contracts,
  deferrals, data store separation, device enumeration, Get/Find
  semantics, strongly-typed identifiers, Try pattern, and progress
  reporting.
language: C++
applicable_to:
  - review-code
  - investigate-bug
---

# Protocol: WinRT Design Patterns

Apply this protocol when reviewing code that defines or extends Windows
Runtime APIs. Evaluate each pattern in order. Flag every violation — WinRT
APIs ship as immutable binary contracts, so design errors cannot be fixed
after release without introducing a new type.

## WRT-001: Activation Contract Interface

**Source:** WinRT Design Patterns — Activation Contracts

**Trigger:** Any runtime class that represents an activation kind or any
interface deriving from `IActivatedEventArgs`.

**Review Criteria:** Verify that each activation contract declares a
dedicated interface inheriting from `IActivatedEventArgs`. The interface
name must follow the pattern `I<Kind>ActivatedEventArgs` (e.g.,
`IFileActivatedEventArgs`). The interface must expose only the properties
specific to that activation kind — do not merge unrelated properties into
a single activation interface. Confirm that the corresponding
`ActivationKind` enum value is defined and that the event args class
implements the correct interface.

**Code Example:**

```csharp
// Correct — dedicated interface with proper inheritance
public interface IFileActivatedEventArgs : IActivatedEventArgs
{
    IReadOnlyList<IStorageItem> Files { get; }
}

// Incorrect — missing IActivatedEventArgs inheritance
public interface IFileActivatedEventArgs
{
    IReadOnlyList<IStorageItem> Files { get; }
    ActivationKind Kind { get; } // manually duplicated
}
```

**Validation:** For each activation contract, confirm the interface inherits
from `IActivatedEventArgs`, follows the `I<Kind>ActivatedEventArgs` naming
convention, and does not duplicate properties already on the base interface.

## WRT-002: Effect Definition Pattern

**Source:** WinRT Design Patterns — Effect Definitions

**Trigger:** Any runtime class that represents an audio or video effect.

**Review Criteria:** Verify that audio effects implement
`IAudioEffectDefinition` and video effects implement
`IVideoEffectDefinition`. Each implementation must expose an
`ActivatableClassId` property (the class ID string used to activate the
effect at runtime) and a `Properties` property returning a
`PropertySet` of configuration values. Do not require callers to construct
the effect class directly — the definition serves as a lightweight
descriptor that the media pipeline activates on demand.

**Code Example:**

```csharp
// Correct — implements the definition interface
public class EchoEffect : IAudioEffectDefinition
{
    public string ActivatableClassId => "Contoso.EchoEffect";
    public PropertySet Properties { get; } = new PropertySet();
}

// Incorrect — concrete effect class with no definition interface
public class EchoEffect
{
    public void Apply(AudioFrame frame) { /* ... */ }
}
```

**Validation:** Confirm every effect class implements the appropriate
definition interface and exposes both `ActivatableClassId` and
`Properties`. Flag any effect that requires direct instantiation instead
of activation through the media pipeline.

## WRT-003: Data Store Manager/Store Separation

**Source:** WinRT Design Patterns — Data Store Access

**Trigger:** Any API surface that gates access to user data behind a
capability or consent prompt.

**Review Criteria:** Verify that the API splits into a static Manager class
and an instance Store class. The Manager exposes unprotected static methods
for discovery or metadata. Access to protected user data goes through
`RequestStoreAsync`, which triggers the consent prompt and returns the
Store instance. The Store class must never be directly activatable — callers
obtain it only through the Manager. Confirm that `RequestStoreAsync`
accepts an `AccessType` parameter when read/write distinction is needed.

**Code Example:**

```csharp
// Correct — Manager / Store separation
public static class ContactManager
{
    public static async Task<ContactStore> RequestStoreAsync(
        ContactStoreAccessType accessType) { /* consent prompt */ }
}

public class ContactStore  // not directly activatable
{
    public IAsyncOperation<Contact> GetContactAsync(string id);
}

// Incorrect — single class exposing both static and protected members
public class ContactManager
{
    public static void DoSomethingUnprotected() { }
    public Contact GetContact(string id) { /* no consent gate */ }
}
```

**Validation:** Confirm the Manager class is static or has only static
members, the Store class is not directly activatable, and all protected
data access routes through `RequestStoreAsync`.

## WRT-004: Deferral Pattern

**Source:** WinRT Design Patterns — Deferrals

**Trigger:** Any event args class whose handler is expected to perform
asynchronous work before the sender can proceed.

**Review Criteria:** Verify that the event args class exposes a
`GetDeferral()` method returning a deferral object with a `Complete()`
method. The sender must wait for all outstanding deferrals to complete
before continuing. On the caller side, verify that `GetDeferral()` is
called before any `await` and that `Complete()` is called in a `finally`
block or equivalent guarantee. Do not use fire-and-forget `async void`
handlers without a deferral — the sender will proceed before the handler
finishes.

**Code Example:**

```csharp
// Correct — deferral acquired before async, completed in finally
async void OnSuspending(object sender, SuspendingEventArgs e)
{
    var deferral = e.SuspendingOperation.GetDeferral();
    try
    {
        await SaveStateAsync();
    }
    finally
    {
        deferral.Complete();
    }
}

// Incorrect — no deferral; sender proceeds before save finishes
async void OnSuspending(object sender, SuspendingEventArgs e)
{
    await SaveStateAsync(); // sender does not wait
}
```

**Validation:** For each event args type requiring async handling, confirm
`GetDeferral()` exists. For each handler of such events, confirm the
deferral is obtained before the first `await` and `Complete()` is called
on every code path.

## WRT-005: Device Enumeration Pattern

**Source:** WinRT Design Patterns — Device Enumeration

**Trigger:** Any runtime class that represents a hardware device or
peripheral accessible through `DeviceInformation`.

**Review Criteria:** Verify that the device class exposes a static
`GetDeviceSelector()` method returning an AQS filter string suitable for
`DeviceInformation.FindAllAsync`. Verify that a static `FromIdAsync(String)`
method exists so callers can cast a `DeviceInformation.Id` back to the
strongly-typed device class. The selector must be narrow enough to return
only devices of the correct type. Do not require callers to hand-craft AQS
strings.

**Code Example:**

```midl
// Correct — IDL declaring both required static methods
[static_name("ILampStatics")]
static String GetDeviceSelector();
static Windows.Foundation.IAsyncOperation<Lamp> FromIdAsync(String deviceId);

// Incorrect — missing FromIdAsync; callers cannot cast back
[static_name("ILampStatics")]
static String GetDeviceSelector();
// FromIdAsync omitted — no way to obtain a Lamp from a DeviceInformation
```

**Validation:** Confirm every device class has both `GetDeviceSelector()`
and `FromIdAsync(String)`. Run the selector through
`DeviceInformation.FindAllAsync` and verify it returns only devices of the
expected type.

## WRT-006: Get vs Find Semantics

**Source:** WinRT Design Patterns — Get/Find Method Semantics

**Trigger:** Any public method whose name starts with `Get` or `Find`.

**Review Criteria:** Verify that `Get` methods retrieve a single known
object by identifier and return the object directly (synchronously or via
`IAsyncOperation<T>`). A `Get` call with a valid identifier must not return
null — throw if the item does not exist. Verify that `Find` methods return
a collection (`IVectorView`, `IIterable`, or equivalent) and accept filter
or search parameters. `Find` methods may return an empty collection but
must never throw for zero results. Do not name a method `Get` if it
performs a search, and do not name it `Find` if it returns a scalar value.

**Code Example:**

```csharp
// Correct — Get returns a single object, Find returns a collection
public Contact GetContact(string contactId);        // throws if not found
public IReadOnlyList<Contact> FindContacts(string query);  // may be empty

// Incorrect — Get returning a collection
public IReadOnlyList<Contact> GetContacts(string query);

// Incorrect — Find returning a single object
public Contact FindContact(string contactId);
```

**Validation:** Audit every `Get` and `Find` method. Confirm `Get` methods
return a single object and throw on missing items. Confirm `Find` methods
return a collection and tolerate zero results.

## WRT-007: Strongly-Typed Identifiers

**Source:** WinRT Design Patterns — Strongly-Typed Identifiers

**Trigger:** Any API that uses a primitive type (`String`, `UInt32`, `Guid`)
as an entity identifier passed across method boundaries.

**Review Criteria:** Verify that identifiers are wrapped in a dedicated
struct with a single `Value` field of the underlying primitive type. This
prevents accidental interchange of semantically distinct identifiers (e.g.,
passing a `ContactId` where a `CalendarId` is expected). The struct should
be defined in MIDL/IDL and projected into all language bindings. Primitive
identifiers are acceptable only when the API surface has a single ID type
with no risk of confusion.

**Code Example:**

```midl
// Correct — strongly-typed identifier struct
struct ContactId
{
    String Value;
};

String GetContactName(ContactId id);

// Incorrect — bare String identifier
String GetContactName(String contactId);
// Caller can accidentally pass a calendarId string here
```

**Validation:** Identify every method parameter or property that represents
an entity identifier. Confirm a dedicated identifier struct exists unless
the API has only one identifier type. Flag any method that accepts more
than one bare primitive identifier of the same type.

## WRT-008: Try Pattern

**Source:** WinRT Design Patterns — Try Pattern

**Trigger:** Any method that may fail under normal conditions (not
exceptional errors) where callers are likely to attempt a fallback.

**Review Criteria:** Verify that a `TryXxx` variant exists alongside or
instead of the throwing version. The `TryXxx` method must return `Boolean`
indicating success and provide the result through an out parameter. Do not
throw exceptions for expected failures such as parsing invalid input,
looking up a missing key, or attempting a best-effort operation. The
throwing version, if it coexists, should delegate to the `TryXxx`
implementation and throw on failure.

**Code Example:**

```csharp
// Correct — TryParse for expected failure path
public static bool TryParse(string text, out Color result)
{
    // parse logic, returns false on invalid input
}

// Also acceptable — throwing version delegates to Try
public static Color Parse(string text)
{
    if (!TryParse(text, out var result))
        throw new FormatException("Invalid color: " + text);
    return result;
}

// Incorrect — only a throwing Parse, no TryParse
public static Color Parse(string text)
{
    // throws FormatException on invalid input — no Try alternative
}
```

**Validation:** For each method that throws on non-exceptional failure,
confirm a `TryXxx` counterpart exists. Verify the Try variant returns
`bool` and uses an out parameter for the result. Confirm neither variant
swallows unexpected exceptions.

## Output Format

For each finding, report:

```
[SEVERITY: High|Medium|Low]
Pattern: <WRT-NNN — pattern title>
Location: <file>:<line> or <type/method name>
Issue: <concise description>
Evidence: <code snippet demonstrating the violation>
Remediation: <specific fix recommendation>
Confidence: <High|Medium|Low — with justification if not High>
```

## References

- **WinRT Design Patterns** — Microsoft Learn:
  https://learn.microsoft.com/en-us/windows/apps/develop/winrt-design-patterns
- **Windows SDK Documentation** — Microsoft Learn:
  https://learn.microsoft.com/en-us/uwp/api/
- **MIDL 3.0 Reference** — Microsoft Learn:
  https://learn.microsoft.com/en-us/uwp/midl-3/
