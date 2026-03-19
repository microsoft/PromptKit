<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: root-cause-ci-failure
description: >
  Investigate a failing CI/CD pipeline run to identify the root cause.
  Analyze logs, pipeline configuration, and platform behavior to produce
  an investigation report with remediation steps.
persona: devops-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/root-cause-analysis
  - reasoning/devops-platform-analysis
format: investigation-report
params:
  platform: "CI/CD platform (e.g., 'GitHub Actions', 'Azure DevOps', 'GitLab CI')"
  pipeline: "Pipeline name, workflow file, or run URL"
  failure_description: "Description of the failure — what is failing, since when, how often"
  logs: "Relevant CI/CD logs, error messages, or screenshots"
  context: "Additional context — recent changes, environment details, related issues"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A structured investigation report identifying the root cause of the
    CI/CD failure with evidence, remediation steps, and prevention measures.
---

# Task: Root-Cause CI/CD Failure

You are tasked with investigating a failing CI/CD pipeline run to identify
the root cause and recommend remediation.

## Inputs

**Platform**: {{platform}}

**Pipeline**: {{pipeline}}

**Failure Description**: {{failure_description}}

**Logs / Error Output**: {{logs}}

**Additional Context**: {{context}}

## Instructions

1. **Apply the devops-platform-analysis protocol** to understand the
   pipeline's structure:
   - Identify the platform, workflow configuration, and execution model
   - Decompose the pipeline into stages, jobs, and steps
   - Identify the specific job and step where the failure occurs

2. **Apply the root-cause-analysis protocol** systematically:
   - **Characterize the symptom**: What exactly is failing? What error
     messages or exit codes are produced? Is it deterministic or flaky?
   - **Generate hypotheses** (at least 3) before investigating:
     - Code-level: test failure, compilation error, linting violation
     - Infrastructure: runner issues, resource exhaustion, network timeouts
     - Configuration: YAML syntax, missing secrets, wrong permissions
     - Dependencies: version conflicts, registry outages, cache corruption
     - Platform: service degradation, API limits, quota exceeded
   - **Evaluate evidence** for each hypothesis against the logs and context
   - **Identify the root cause**, not just the proximate error message

3. **Apply the anti-hallucination protocol** throughout:
   - Base analysis ONLY on the provided logs, configuration, and context
   - Do NOT fabricate log lines, error messages, or pipeline behaviors
   - If the provided logs are insufficient, specify exactly what
     additional logs or information would be needed
   - Label inferences: "Based on the error at line X, I infer that..."

4. **Trace the failure path**:
   - From the trigger event through each stage to the failure point
   - Identify what changed between the last successful run and this failure
   - Check for environmental factors (time-based, load-based, order-dependent)

5. **Classify the failure type**:
   - **Deterministic**: Fails every time — likely a code or configuration change
   - **Flaky / Intermittent**: Fails sometimes — likely a race condition,
     resource issue, or external dependency
   - **Infrastructure**: Platform or runner issue, not related to the code
   - **Configuration drift**: Environment or secret changed outside the pipeline

6. **Recommend remediation**:
   - Immediate fix to unblock the pipeline
   - Long-term fix to prevent recurrence
   - Diagnostic steps if root cause cannot be fully determined from
     available information

7. **Format the output** according to the investigation-report format
   specification.

8. **Apply the self-verification protocol** before finalizing:
   - Re-verify that the root cause explains ALL observed symptoms
   - Confirm that the remediation addresses the root cause, not just a symptom
   - Check that cited log lines and error messages match the provided input

## Non-Goals

- Do NOT fix the code or pipeline — only investigate and recommend.
- Do NOT re-run the pipeline or execute any commands.
- Do NOT investigate unrelated pipeline stages that are passing.
- Do NOT redesign the pipeline architecture unless the root cause requires it.

## Quality Checklist

Before presenting the investigation report, verify:

- [ ] The root cause explains all observed symptoms
- [ ] At least 3 hypotheses were considered and evaluated
- [ ] Every finding cites specific evidence (log lines, config, context)
- [ ] Remediation is specific and actionable (not "fix the configuration")
- [ ] Failure type classification is stated
- [ ] Coverage section states what was and was not examined
- [ ] If root cause is uncertain, required next diagnostic steps are listed
