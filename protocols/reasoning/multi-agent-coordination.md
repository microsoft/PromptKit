<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: multi-agent-coordination
type: reasoning
description: >
  Coordination protocol for multiple AI agents working on a shared
  codebase. Covers agent identity cards, scope of authority, branch
  isolation, cross-agent review, shared state via git, and structured
  bug handoff workflows.
applicable_to: []
---

# Protocol: Multi-Agent Coordination

Apply this protocol when two or more AI agents (or AI agents plus
humans) work on the same codebase concurrently or sequentially.
Execute all phases when setting up coordination; reference individual
phases during ongoing work.

## Phase 1: Agent Identity Cards

For each participating agent (AI or human), create an identity card
documenting:

1. **Name**: a short, memorable identifier (e.g., "Cam", "Linux",
   "Windows", the human's name).
2. **Runtime/Platform**: which AI system or editor (e.g., "Copilot
   CLI", "Claude Code sandbox", "VS Code + Copilot", "human").
3. **Operating system**: the OS the agent runs on (affects path
   separators, shell syntax, available tools).
4. **Working directory**: the absolute path to the repository root
   on this agent's system.
5. **Branch prefix**: a unique prefix for all branches created by
   this agent (e.g., `cam/`, `linux/`, `windows/`). No two agents
   share a prefix.
6. **Git identity**: the name and email used for commits by this
   agent.
7. **Strengths**: what this agent is best at (e.g., "fast iteration
   on Linux builds", "Windows-specific debugging", "architecture
   decisions").
8. **Limitations**: known constraints (e.g., "no GUI access",
   "context window limited to 128K", "cannot run tests locally").
9. **Tools available**: which tools the agent can use (e.g., "bash,
   git, cargo", "PowerShell, MSBuild, Visual Studio").

Record all identity cards in a shared document accessible to all
participants (e.g., `docs/agents/` directory in the repository).

## Phase 2: Scope of Authority

Define explicit file-level permissions for each agent:

1. **Categorize every file or directory** into one of three access
   levels:

   | Level | Meaning | Example |
   |-------|---------|---------|
   | **Freely modifiable** | Agent may edit without prior approval | Test files, documentation, agent's own config |
   | **With care** | Agent may edit but must verify changes do not break other agents' work | Shared source files, build scripts |
   | **Do not modify** | Agent must not edit without explicit permission from the owner | Architecture-critical files, shared interfaces, CI config |

2. **Assign ownership**: for each "do not modify" file, name the
   owner (agent or human) who must approve changes.

3. **Document the scope** in a machine-readable format (e.g., a
   YAML file or a table in the coordination document) so agents
   can check permissions before editing.

4. **Default rule**: if a file is not listed, treat it as "with
   care" — the agent may edit but must verify.

## Phase 3: Branch Isolation and Git Workflow

Prevent conflicts through branch discipline:

1. **Each agent works on its own branch**, prefixed with its
   assigned prefix from Phase 1 (e.g., `cam/fix-parser`,
   `linux/add-tests`).

2. **No agent commits directly to `main`**. All changes go through
   branches and merges.

3. **Pull before starting work**: at the beginning of each work
   session, pull the latest `main` and rebase the working branch.

4. **Push frequently**: commit and push after each logical unit of
   work (not at the end of the session). This makes work visible
   to other agents and humans.

5. **Merge protocol**:
   - No agent merges its own branch into `main` without review
     from at least one other participant (agent or human).
   - The reviewer checks for: conflicts with other in-flight
     branches, adherence to scope of authority, build/test status.
   - If a conflict exists with another agent's branch, the two
     agents (or the human coordinator) must resolve it before
     merging.

## Phase 4: Cross-Agent Communication

Coordinate through the repository, not through chat:

1. **Status files**: maintain a shared status document (e.g.,
   `docs/status.md` or `.handoff/status.md`) where each agent
   records:
   - What it is currently working on (1-line summary)
   - What it has completed since last update
   - What it is blocked on (if anything)

2. **Bug handoff workflow**:
   - Agent A discovers a bug outside its scope of authority.
   - Agent A creates a status entry: `BUG: <description>,
     ASSIGNED: <agent-name>, FILES: <relevant paths>`.
   - Agent A commits and pushes the status update.
   - Other agents pull and check for new assignments.
   - The assigned agent picks up the bug, works on it, and
     updates the status entry when resolved.

3. **Decision escalation**: when an agent encounters a decision
   that affects architecture, shared interfaces, or multiple
   agents' work:
   - Record the decision point in the status document with
     options and tradeoffs.
   - Mark it as `DECISION NEEDED: <owner>` (typically the human
     coordinator).
   - Do NOT proceed with the architectural change until the
     decision owner responds.

## Phase 5: Human Coordination Role

Define the human's role in the multi-agent workflow:

1. **The human holds architecture and vision**. Agents execute
   within the boundaries set by the human. Agents do not make
   architectural decisions unilaterally.

2. **The human routes work**. When multiple agents are available,
   the human assigns tasks based on agent strengths, current
   workload, and scope of authority.

3. **The human resolves conflicts**. When two agents' work
   conflicts (merge conflicts, design disagreements, scope
   overlaps), the human decides the resolution.

4. **The human reviews cross-cutting changes**. Changes that
   affect multiple agents' scopes require human approval before
   merging.

5. **The human monitors for behavioral failures**. Using the
   `agent-behavioral-failures` taxonomy, the human watches for
   ABF-1 (safety bypass), ABF-3 (retry loops), and ABF-4
   (context hoarding) across agents and intervenes when patterns
   emerge.

## Phase 6: Coordination Health Checks

Periodically verify that coordination is working:

1. **Branch hygiene**: are all agents using their assigned
   prefixes? Are stale branches being cleaned up after merge?

2. **Scope compliance**: has any agent modified files outside its
   authority without approval? Check git log by author.

3. **Communication currency**: is the status document current?
   Are bug handoffs being picked up within a reasonable timeframe
   (define the expected response time, e.g., "within the current
   session or the next session start")?

4. **Merge backlog**: are branches accumulating without review?
   If more than 3 branches from a single agent are unmerged,
   pause new work and process the backlog.

5. **Conflict frequency**: are merge conflicts increasing? If
   two agents frequently conflict on the same files, revisit
   scope of authority assignments.
