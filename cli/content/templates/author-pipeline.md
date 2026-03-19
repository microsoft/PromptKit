<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-pipeline
description: >
  Generate a production-ready CI/CD pipeline for a given application
  and target platform. Supports GitHub Actions, Azure DevOps, GitLab CI,
  and other DevOps platforms.
persona: devops-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/devops-platform-analysis
format: pipeline-spec
params:
  platform: "Target CI/CD platform (e.g., 'GitHub Actions', 'Azure DevOps', 'GitLab CI')"
  application: "Description of the application to build and deploy (language, framework, architecture)"
  goals: "What the pipeline should accomplish (build, test, deploy, release, etc.)"
  environments: "Target environments and deployment strategy (e.g., 'dev → staging → production with manual approval')"
  context: "Additional context — existing infrastructure, constraints, team preferences"
  audience: "Who will maintain this pipeline (e.g., 'DevOps specialists', 'application developers')"
input_contract: null
output_contract:
  type: pipeline-spec
  description: >
    A complete, production-ready CI/CD pipeline specification with YAML,
    prerequisites, design rationale, and customization guide.
---

# Task: Author CI/CD Pipeline

You are tasked with generating a production-ready CI/CD pipeline for the
following application and platform.

## Inputs

**Platform**: {{platform}}

**Application**: {{application}}

**Goals**: {{goals}}

**Environments**: {{environments}}

**Additional Context**: {{context}}

## Instructions

1. **Apply the devops-platform-analysis protocol** to understand the
   platform and decompose the pipeline requirements:
   - Lock to the specified platform's YAML schema and conventions
   - Identify required triggers, jobs, steps, and environments
   - Map secrets, variables, and service connections

2. **Apply the anti-hallucination protocol** throughout:
   - Use ONLY the platform's documented YAML syntax and features
   - Do NOT invent action names, task IDs, or API endpoints
   - If uncertain about a platform feature, flag it with
     `[VERIFY: <what to check>]` instead of guessing
   - Label platform-specific assumptions explicitly

3. **Design the pipeline structure** before writing YAML:
   - Determine job dependencies and execution order
   - Identify what can run in parallel
   - Plan caching and artifact strategies
   - Define environment promotion and approval gates

4. **Generate the complete pipeline YAML**:
   - Valid, properly indented YAML that can be committed directly
   - Inline comments explaining non-obvious decisions
   - Secrets referenced from platform-native stores (never hardcoded)
   - Permissions scoped to minimum required
   - Third-party actions/tasks pinned to specific versions

5. **Document prerequisites** — every secret, service connection,
   permission, and external dependency the pipeline requires.

6. **Provide customization guidance** — how to adapt the pipeline for
   different projects, environments, or team preferences.

7. **Format the output** according to the pipeline-spec format specification.

8. **Apply the self-verification protocol** before finalizing:
   - Verify YAML syntax is valid
   - Verify all referenced actions/tasks exist and versions are correct
   - Verify secret names are consistent between docs and YAML
   - Confirm all pipeline goals from the input are addressed

## Non-Goals

- Do NOT generate application code, Dockerfiles, or infrastructure
  definitions unless directly part of the pipeline.
- Do NOT implement deployment targets — only the pipeline that deploys to them.
- Do NOT optimize for a specific cloud provider unless specified in context.
- Adjust non-goals based on the specific context provided.

## Quality Checklist

Before presenting the pipeline, verify:

- [ ] YAML is valid and properly indented
- [ ] All platform-specific syntax matches the target platform
- [ ] Secrets are never hardcoded — all use platform secret stores
- [ ] Permissions are scoped to minimum required
- [ ] Third-party actions/tasks are pinned to specific versions or SHAs
- [ ] Error handling is present (retries, timeouts, failure conditions)
- [ ] Pipeline goals from the input are all addressed
- [ ] Prerequisites section lists everything needed to run the pipeline
- [ ] Customization guide covers common modification scenarios
