<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: devops-platform-analysis
type: reasoning
description: >
  Systematic reasoning about DevOps platform constructs: pipelines,
  triggers, jobs, environments, secrets, approvals, and artifacts.
  Platform-agnostic methodology with platform-specific instantiation.
applicable_to:
  - author-pipeline
  - root-cause-ci-failure
  - review-infrastructure
---

# Protocol: DevOps Platform Analysis

Apply this protocol when analyzing, generating, or debugging DevOps
platform constructs (CI/CD pipelines, infrastructure-as-code, release
configurations). Execute phases in order.

## Phase 1: Platform Identification

1. **Identify the target platform** from user input (GitHub Actions,
   Azure DevOps, GitLab CI, Jenkins, etc.).
2. **Lock to platform conventions**: YAML schema, keyword vocabulary,
   trigger syntax, built-in variables, and API surface.
3. **State platform version / edition** if relevant (e.g., GitHub
   Enterprise Server vs. GitHub.com, Azure DevOps Server vs. Services).
4. If the platform is not specified, **ask** — do NOT guess.

## Phase 2: Construct Decomposition

1. **Decompose the workflow** into its structural elements:
   - **Triggers**: What events initiate the workflow? (push, PR,
     schedule, manual dispatch, webhook, pipeline completion)
   - **Stages / Jobs**: What logical units of work exist? What are
     their dependencies?
   - **Steps / Tasks**: What actions execute within each job?
   - **Environments**: What deployment targets exist? (dev, staging,
     production) What approval gates apply?
   - **Secrets / Variables**: What configuration is externalized?
     Where is it stored? (platform secrets, vault, environment variables)
   - **Artifacts**: What outputs are produced? How are they passed
     between jobs or retained?

2. **Map platform-specific constructs**:
   - GitHub Actions: workflows, jobs, steps, actions, reusable workflows
   - Azure DevOps: pipelines, stages, jobs, tasks, service connections,
     variable groups, environments with approvals
   - GitLab CI: pipelines, stages, jobs, scripts, environments, artifacts
   - Generalize for other platforms using the same structural model

## Phase 3: Dependency and Flow Analysis

1. **Trace the execution graph**: identify sequential vs. parallel paths,
   conditional execution (`if` / `condition`), and failure handling.
2. **Identify implicit dependencies**: shared state between jobs
   (artifact downloads, environment variables), external service
   dependencies (APIs, databases, registries).
3. **Check for correctness hazards**:
   - Race conditions between parallel jobs sharing state
   - Missing `needs` / `dependsOn` declarations
   - Overly broad triggers (e.g., `push: **` running on every file change)
   - Missing failure handling (no `continue-on-error`, no retry logic)

## Phase 4: Security and Compliance Check

1. **Secrets management**: Are secrets stored in platform-native vaults?
   Are they exposed to logs? Are they scoped to the minimum required
   environment?
2. **Supply chain**: Are third-party actions / tasks pinned to a commit
   SHA or tag? Are untrusted inputs sanitized before use in scripts?
3. **Permissions**: Are workflow permissions scoped (e.g., `permissions:`
   in GitHub Actions)? Are service connections least-privilege?
4. **Compliance gates**: Are required approvals, branch protections, and
   environment policies configured?

## Phase 5: Efficiency Assessment

1. **Caching**: Are dependency caches configured? Are cache keys specific
   enough to avoid stale hits?
2. **Parallelism**: Are independent jobs running in parallel? Could
   matrix strategies reduce duplication?
3. **Conditional execution**: Are expensive steps skipped when not needed
   (path filters, change detection)?
4. **Resource usage**: Are runner sizes appropriate? Are self-hosted
   runners used where cost-effective?
