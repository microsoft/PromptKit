<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: review-code
description: >
  Perform a thorough code review focusing on correctness, safety,
  security, and maintainability. Optionally apply specific analysis
  protocols based on the code's characteristics.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
params:
  code: "The code to review"
  review_focus: "What to focus on — e.g., correctness, security, performance, all"
  language: "Programming language"
  additional_protocols: "Optional — specific protocols to apply (e.g., memory-safety-c, thread-safety)"
  context: "What this code does, where it fits in the system, any known concerns"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A code review report with findings categorized by severity,
    specific line references, and actionable remediation.
---

# Task: Code Review

You are tasked with performing a thorough **code review** of the
following code.

## Inputs

**Code**:
```{{language}}
{{code}}
```

**Language**: {{language}}

**Review Focus**: {{review_focus}}

**Context**: {{context}}

**Additional Protocols to Apply**: {{additional_protocols}}

## Instructions

1. **Apply the anti-hallucination protocol.** Base your review ONLY on the
   code provided. Do not assume behaviors that are not visible in the code.

2. **If additional protocols are specified** (e.g., `memory-safety-c`,
   `thread-safety`), apply them systematically in addition to the
   general review below.

3. **General review — execute all applicable checks**:

   ### Correctness
   - Does the code do what it claims to do?
   - Are edge cases handled (null, empty, boundary values, overflow)?
   - Are error paths correct — do they clean up resources, propagate errors
     appropriately, and avoid leaving the system in an inconsistent state?
   - Are return values checked where they should be?

   ### Safety
   - Are there memory safety issues (if applicable to the language)?
   - Are there concurrency issues (data races, deadlocks)?
   - Are there resource leaks (file handles, connections, memory)?

   ### Security
   - Is input validated before use in sensitive operations?
   - Are there injection risks (SQL, command, path traversal)?
   - Are secrets or credentials handled appropriately?
   - Are error messages revealing internal details?

   ### Maintainability
   - Is the code clear and readable?
   - Are abstractions appropriate (not too much, not too little)?
   - Are there obvious violations of SOLID, DRY, or other design principles?
   - Is error handling consistent with the codebase's conventions?

4. **Format each finding as**:

   ```
   [SEVERITY: Critical|High|Medium|Low|Nit]
   Location: <file>:<line> or <function>
   Issue: <concise description>
   Evidence: <code snippet or reasoning>
   Suggestion: <specific fix or improvement>
   ```

5. **Summarize** at the end:
   - Total findings by severity
   - Overall assessment (approve / approve with changes / request changes)
   - Top 3 most important things to fix

## Non-Goals

- Do NOT refactor the code — focus on identifying issues.
- Do NOT review code outside the provided scope unless it is
  directly called by or calls into the reviewed code.
- Do NOT comment on personal style preferences — focus on
  correctness, safety, security, and maintainability.

## Quality Checklist

Before finalizing, verify:

- [ ] Every finding cites a specific code location
- [ ] Every finding has a severity rating (Critical/High/Medium/Low/Nit)
- [ ] Every finding includes a concrete fix suggestion
- [ ] Findings are ordered by severity
- [ ] At least 3 findings have been re-verified against the source
- [ ] Overall assessment (approve / approve with changes / request changes) is stated
- [ ] Top 3 most important items are identified in the summary
