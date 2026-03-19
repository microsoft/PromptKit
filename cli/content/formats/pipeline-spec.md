<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: pipeline-spec
type: format
description: >
  CI/CD pipeline specification with platform-specific YAML, design
  rationale, configuration requirements, and deployment notes.
produces: pipeline-spec
---

# Format: Pipeline Specification

The output MUST be a complete, production-ready pipeline specification.
Do NOT produce toy examples or incomplete configurations.

## Output Structure

### 1. Overview

- **Platform**: The target CI/CD platform
- **Purpose**: What this pipeline does (build, test, deploy, release, etc.)
- **Trigger Summary**: When the pipeline runs
- **Environment Summary**: What environments are targeted

### 2. Prerequisites

List everything that must be configured before this pipeline will work:

- Repository secrets and variables (name, purpose, where to obtain)
- Service connections or credentials
- Required platform features or permissions
- External dependencies (registries, deployment targets, APIs)

Present as a numbered checklist.

### 3. Pipeline YAML

The complete pipeline definition in a fenced code block with the
appropriate language tag (e.g., ```yaml).

Requirements:
- **Complete and copy-pasteable** — a user should be able to commit this
  file directly
- **Commented** — non-obvious decisions get inline comments explaining
  WHY, not WHAT
- **Secure by default** — secrets referenced (not hardcoded), permissions
  scoped, actions pinned
- **Production-grade** — includes error handling, timeouts, retries where
  appropriate

### 4. Design Rationale

Explain key decisions:
- Why this trigger strategy?
- Why this job structure (sequential vs. parallel)?
- Why these specific actions / tasks were chosen?
- What tradeoffs were made (speed vs. safety, simplicity vs. flexibility)?

### 5. Customization Guide

Describe how to adapt the pipeline:
- Which values to change for different projects
- How to add or remove stages
- How to switch deployment targets or environments
- Platform-specific gotchas or limitations

### 6. Limitations and Non-Goals

State what this pipeline does NOT cover and why.

## Formatting Rules

- Use the platform's canonical file name in the heading (e.g.,
  `.github/workflows/<name>.yml`, `azure-pipelines.yml`)
- YAML must be valid and properly indented
- Every section must be present; if not applicable, state "Not applicable"
- Do not omit sections
