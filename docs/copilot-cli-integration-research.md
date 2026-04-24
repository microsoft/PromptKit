# PromptKit × GitHub Copilot CLI — Native Integration Research

## Problem Statement

PromptKit's current entry point requires users to manually type **"Read and execute bootstrap.md"**
into an LLM session. The existing CLI (`npx promptkit`) automates this slightly by spawning
`copilot -i "Read and execute bootstrap.md"`, but the experience still feels like a bolt-on
addon rather than a native feature of the AI tooling.

**Goal**: Make PromptKit's prompt composition feel like a built-in capability of
GitHub Copilot CLI — discoverable, invokable with natural commands, and seamless.

---

## Current Architecture (Baseline)

```
User → promptkit CLI → spawns copilot -i "Read and execute bootstrap.md"
                          ↓
                    Copilot reads bootstrap.md in temp dir
                          ↓
                    LLM reads manifest.yaml, asks user, selects components
                          ↓
                    LLM reads .md files, assembles prompt verbatim
                          ↓
                    Writes assembled prompt to user's project
```

**Pain points**:
- Requires a separate `promptkit` CLI installation
- Spawns a *child* Copilot process (loses existing session context)
- No integration with Copilot's own discoverability (`/skills`, `/agent`, etc.)
- User can't naturally say "use PromptKit to investigate this bug" in an existing session
- No auto-invocation when PromptKit would be relevant
- **Context discontinuity across PromptKit-generated artifacts**: A user invokes PromptKit
  to generate an output — say, a custom agent for reviewing their firmware code. They begin
  working with that agent and, mid-session, discover a memory corruption bug they want to
  investigate systematically. PromptKit has an `investigate-bug` template with root-cause
  analysis and memory-safety protocols that would be ideal — but invoking it means leaving
  the current agent's session, losing its accumulated context and domain expertise, and
  starting fresh in a separate PromptKit workflow. The generated agent doesn't know how to
  call back into PromptKit, and PromptKit doesn't know about the agent it previously
  generated. This creates a disjointed experience where PromptKit's value is siloed into
  one-shot generation rather than being a continuously available capability within the
  user's workflow. The ideal experience would let the user say "use PromptKit's bug
  investigation methodology here" without breaking out of their current session or
  losing the specialized context they've built up.

---

## Copilot CLI Extension Points (Comprehensive Inventory)

### 1. Custom Instructions
**Purpose**: Persistent, always-loaded guidance for how Copilot should behave.

**Locations** (all auto-loaded):
- `.github/copilot-instructions.md` — repository-wide
- `.github/instructions/**/*.instructions.md` — path-specific (with `applyTo` glob frontmatter)
- `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` — in repo root and/or CWD
- `~/.copilot/copilot-instructions.md` — user-level (all projects)
- `COPILOT_CUSTOM_INSTRUCTIONS_DIRS` env var — additional locations

**Key characteristics**:
- Always injected into context (no opt-in/opt-out per session)
- Path-specific instructions only load when Copilot works on matching files
- Support `excludeAgent` frontmatter to limit to coding-agent or code-review only
- No slash command invocation — purely implicit
- Best for: coding standards, repo conventions, communication preferences

### 2. Skills
**Purpose**: Task-specific, on-demand instructions with optional scripts and resources.

**Locations** (first-found-wins dedup by `name` field):
1. `<project>/.github/skills/*/SKILL.md` (project)
2. `<project>/.agents/skills/*/SKILL.md` (project)
3. `<project>/.claude/skills/*/SKILL.md` (project)
4. `<parents>/.github/skills/` etc. (inherited, monorepo)
5. `~/.copilot/skills/*/SKILL.md` (personal-copilot)
6. `~/.agents/skills/*/SKILL.md` (personal-agents)
7. `~/.claude/skills/*/SKILL.md` (personal-claude)
8. Plugin `skills/` dirs (plugin)
9. `COPILOT_SKILLS_DIRS` env + config (custom)

**Key characteristics**:
- Loaded **on demand** — only when Copilot detects relevance or user invokes explicitly
- `SKILL.md` has YAML frontmatter: `name` (required), `description` (required), `license`, `allowed-tools`
- Entire skill directory is discoverable by Copilot (scripts, examples, data files)
- `allowed-tools` in frontmatter can pre-approve tools (e.g., `shell`) — security implications
- Invocation: `/skill-name`, natural language, or auto-detected from description
- `/skills list`, `/skills info`, `/skills reload`, `/skills add`, `/skills remove`
- Best for: repeatable workflows, specific task instructions, script-backed automation

### 3. Custom Agents
**Purpose**: Specialized AI personas with constrained toolsets, running in their own context window.

**Locations** (first-found-wins dedup by ID derived from filename):
1. `~/.copilot/agents/*.agent.md` (user)
2. `<project>/.github/agents/*.agent.md` (project)
3. `<parents>/.github/agents/*.agent.md` (inherited, monorepo)
4. `~/.claude/agents/*.agent.md` (user, .claude convention)
5. `<project>/.claude/agents/*.agent.md` (project)
6. `<parents>/.claude/agents/*.agent.md` (inherited)
7. Plugin `agents/` dirs (plugin, by install order)
8. Remote org/enterprise agents (remote, via API)

**Key characteristics**:
- YAML frontmatter: `name`, `description` (required), `tools` (list or omit for all), `infer` (bool), `model`
- `infer: true` enables auto-delegation — Copilot spawns a subagent when task matches
- Own context window — doesn't pollute main session, but also can't see main session context
- Max 30,000 characters for prompt body
- Invocation: `/agent`, `--agent=name`, natural language reference, or auto-inferred
- Best for: specialized personas, constrained tool access, tasks needing isolation

### 4. MCP Servers
**Purpose**: External tool providers that extend Copilot's capabilities.

**Configuration locations** (last-wins dedup by server name):
1. `~/.copilot/mcp-config.json` (lowest priority)
2. `.vscode/mcp.json` (workspace)
3. Plugin MCP configs (plugins)
4. `--additional-mcp-config` flag (highest priority)

**Key characteristics**:
- Adds callable tools to Copilot's toolset
- stdio-based transport (Copilot manages process lifecycle)
- Tools available in all sessions automatically
- Cross-client: MCP is an open protocol supported by Claude, VS Code, etc.
- Best for: programmatic capabilities, external system integration, deterministic operations

### 5. Hooks
**Purpose**: Lifecycle event handlers that execute shell commands at specific points during agent execution.

**Configuration locations**:
- `.github/hooks/hooks.json` (repository, must be on default branch for cloud agent)
- `hooks.json` in CWD (for CLI)
- Plugin `hooks.json` (via plugin)

**Available hook triggers**:

| Hook | When | Input | Can modify behavior? |
|------|------|-------|---------------------|
| `sessionStart` | New/resumed session | `{timestamp, cwd, source, initialPrompt}` | No (output ignored) |
| `sessionEnd` | Session completes | `{timestamp, cwd, reason}` | No |
| `userPromptSubmitted` | User submits prompt | `{timestamp, cwd, prompt}` | No (prompt modification not supported) |
| `preToolUse` | Before any tool runs | `{timestamp, cwd, toolName, toolArgs}` | **Yes** — can `deny` tool use |
| `postToolUse` | After tool completes | `{timestamp, cwd, toolName, toolArgs, toolResult}` | No |
| `errorOccurred` | Error during execution | `{timestamp, cwd, error}` | No |
| `agentStop` | Main agent stops | N/A | No |
| `subagentStop` | Subagent completes | N/A | No |

**Key characteristics**:
- Execute shell commands (bash/powershell), not LLM logic
- `preToolUse` is the most powerful — can approve/deny tool execution
- Multiple hooks per event, executed in order
- Configurable timeout (`timeoutSec`, default 30s)
- Can set environment variables and working directory per hook
- Best for: guardrails, audit logging, policy enforcement, external notifications

**PromptKit relevance**:
- `sessionStart` hook could auto-load PromptKit context or validate setup
- `userPromptSubmitted` hook could detect PromptKit-relevant prompts and log/tag them
- `preToolUse` hook could enforce PromptKit assembly rules (e.g., prevent writing to PromptKit source files)
- `postToolUse` hook could validate assembled prompt output (e.g., check for `{{param}}` placeholders)
- `subagentStop` hook could capture output from a PromptKit agent for post-processing

### 6. LSP Server Configurations
**Purpose**: Language Server Protocol integration for code intelligence (go-to-definition, diagnostics, hover).

**Configuration locations**:
- `~/.copilot/lsp-config.json` (user-level, all projects)
- `.github/lsp.json` (repository-level)
- Plugin `lsp.json` (via plugin)

**Configuration format**:
```json
{
  "lspServers": {
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"],
      "fileExtensions": {
        ".ts": "typescript",
        ".tsx": "typescript"
      }
    }
  }
}
```

**Key characteristics**:
- Provides code intelligence to Copilot (diagnostics, symbols, references)
- Copilot CLI does NOT bundle LSP servers — they must be installed separately
- Configured per-language with file extension mappings
- Status viewable via `/lsp` command
- Not for adding LLM tools — purely for code understanding

**PromptKit relevance**:
- LSP servers enhance Copilot's ability to understand code that PromptKit prompts operate on
- A PromptKit plugin could bundle LSP configs for languages commonly used with PromptKit templates
- For example: when a user invokes `review-cpp-code`, the plugin's LSP config could ensure
  `clangd` is configured for `.c`/`.h` files, giving Copilot richer code understanding
- LSP is **complementary** to PromptKit, not a direct integration path for PromptKit itself
- Could also help validate PromptKit YAML files if a YAML language server is configured

### 7. Plugins
**Purpose**: Distributable packages that bundle agents, skills, hooks, MCP servers, and LSP configs.

**Plugin manifest** (`plugin.json`):
```json
{
  "name": "my-plugin",
  "description": "Plugin description",
  "version": "1.0.0",
  "author": { "name": "Author" },
  "license": "MIT",
  "agents": "agents/",
  "skills": ["skills/"],
  "hooks": "hooks.json",
  "mcpServers": ".mcp.json",
  "lspServers": "lsp.json"
}
```

**Installation sources**:
| Format | Example | Description |
|--------|---------|-------------|
| Marketplace | `plugin@marketplace` | Plugin from a registered marketplace |
| GitHub | `OWNER/REPO` | Root of a GitHub repository |
| GitHub subdir | `OWNER/REPO:PATH/TO/PLUGIN` | Subdirectory in a repository |
| Git URL | `https://github.com/o/r.git` | Any Git URL |
| Local path | `./my-plugin` or `/abs/path` | Local directory |

**Default marketplaces** (pre-registered):
- `github/copilot-plugins`
- `github/awesome-copilot`

**Key characteristics**:
- One-command install: `copilot plugin install SPEC`
- Cached at `~/.copilot/installed-plugins/`
- Components follow same precedence rules as manual installs (skills first-found-wins, MCP last-wins)
- Project-level components override plugin components (plugins cannot override project config)
- Marketplace support for discovery, versioning, and team distribution
- Plugin marketplace format (`marketplace.json`) enables curated plugin catalogs
- CLI commands: `install`, `uninstall`, `list`, `update`, `marketplace add/list/browse/remove`

**PromptKit relevance**: This is the **ideal distribution mechanism** for PromptKit integration.
A PromptKit plugin can bundle all integration components in a single installable unit.

---

## Integration Strategies

### Strategy A: PromptKit as a Copilot CLI Skill

**Concept**: Create a `SKILL.md` that teaches Copilot how to use PromptKit's manifest
and components to assemble prompts on demand.

**Structure** (personal skill — works across all projects):
```
~/.copilot/skills/promptkit/
├── SKILL.md                    # Instructions for Copilot
├── manifest.yaml               # PromptKit component index
├── bootstrap-core.md           # Stripped-down assembly instructions
├── personas/                   # All persona .md files
├── protocols/                  # All protocol .md files
├── formats/                    # All format .md files
├── templates/                  # All template .md files
└── taxonomies/                 # All taxonomy .md files
```

**SKILL.md** would contain:
```yaml
---
name: promptkit
description: >
  Composable prompt assembly for engineering tasks. Use when asked to
  investigate bugs, review code, write requirements, design systems,
  audit specifications, plan implementations, or author CI/CD pipelines.
  Also use when the user mentions "promptkit" or asks for a structured
  engineering prompt.
---
```

Followed by condensed bootstrap instructions (read manifest, select components,
assemble verbatim, etc.).

**User experience**:
```
> /promptkit investigate the memory leak in packet_handler.c
> Use the promptkit skill to review this C++ code for thread safety
> What promptkit templates are available?
```

Or auto-invoked when Copilot detects relevance:
```
> I need to write a requirements doc for our new auth system
  [Copilot auto-selects promptkit skill based on description match]
```

**Pros**:
- Native Copilot UX — discoverable via `/skills list`, invokable via `/promptkit`
- Auto-detection when task matches skill description
- No separate CLI installation needed (content lives in skill directory)
- Works in existing session (no child process spawn)
- Personal skills (`~/.copilot/skills/`) work across all projects
- Project skills (`.github/skills/`) can be version-controlled per-repo

**Cons**:
- Skill directory would be large (~500KB+ of .md files)
- All content loaded into context when skill activates (context pressure)
- No programmatic assembly — still relies on LLM reading files
- Updating requires re-copying files (no `npm update`)

**Mitigation for context pressure**: The SKILL.md can instruct Copilot to read
manifest.yaml first for discovery, then only read the specific component files
needed for the selected template — not all files at once.

**Feasibility**: ✅ High — uses existing, stable Copilot CLI features

---

### Strategy B: PromptKit as Custom Agent(s)

**Concept**: Define PromptKit as one or more custom agents that Copilot can
delegate to for engineering prompt assembly tasks.

**Option B1: Single meta-agent**
```
~/.copilot/agents/promptkit.agent.md
```

```yaml
---
name: promptkit
description: >
  PromptKit prompt composition engine. Assembles task-specific prompts
  from composable components (personas, protocols, formats, templates).
  Use for structured engineering tasks: bug investigation, code review,
  requirements authoring, specification auditing, and more.
tools: ["read", "edit", "search", "create", "glob", "grep"]
infer: true
---
```

Body contains bootstrap instructions. Agent reads PromptKit files from a
known location (e.g., `~/.copilot/promptkit/` or a cloned repo).

**Option B2: Per-template agents**
```
~/.copilot/agents/
├── promptkit-investigate-bug.agent.md
├── promptkit-review-code.agent.md
├── promptkit-author-requirements.agent.md
├── promptkit-review-cpp.agent.md
└── ...
```

Each agent has the relevant persona + protocols pre-selected, with the
template instructions baked in. No manifest lookup needed.

**User experience**:
```
> /agent promptkit
> --agent=promptkit investigate the crash in main.c
> [auto-delegated when Copilot infers promptkit is relevant]
```

**Pros**:
- Runs in its own context window (doesn't pollute main session)
- `infer: true` enables auto-delegation
- Tool restrictions for safety (read-only for audits, etc.)
- Clean separation of concerns
- Per-template agents (B2) are pre-composed — faster, no manifest lookup

**Cons**:
- Custom agent loses the composability that makes PromptKit powerful (B2)
- Meta-agent (B1) still needs access to all component files
- Separate context window means it can't see what the main agent already knows
- Per-template agents (B2) create maintenance burden (N agents × updates)

**Feasibility**: ✅ High — custom agents are well-supported

---

### Strategy C: PromptKit MCP Server

**Concept**: Build an MCP server that exposes PromptKit's assembly engine as
tools that Copilot (or any MCP client) can call programmatically.

**Exposed tools**:
```
promptkit_list_templates     → Returns available templates with descriptions
promptkit_list_components    → Returns personas, protocols, formats, taxonomies
promptkit_get_template_info  → Returns template details (params, persona, protocols)
promptkit_assemble           → Assembles a complete prompt from template + params
promptkit_get_component      → Returns a single component's body text
```

**MCP server implementation** (Node.js, reuses existing CLI infrastructure):
```javascript
// Reads manifest.yaml, resolves components, assembles verbatim
server.tool("promptkit_assemble", {
  template: "investigate-bug",
  params: { context: "segfault in packet_handler.c", audience: "senior engineers" }
}) → returns assembled prompt as string
```

**Registration** (`~/.copilot/mcp-config.json`):
```json
{
  "mcpServers": {
    "promptkit": {
      "command": "npx",
      "args": ["@promptkit/mcp-server"],
      "type": "stdio"
    }
  }
}
```

**User experience**:
```
> I need to investigate a memory leak in our C code
  [Copilot calls promptkit_list_templates, finds investigate-bug]
  [Copilot calls promptkit_assemble with selected template]
  [Copilot uses assembled prompt as its working instructions]

> What PromptKit templates do I have?
  [Copilot calls promptkit_list_templates, displays results]
```

**Pros**:
- Programmatic, precise assembly (no LLM interpretation of bootstrap.md)
- Deterministic — same inputs always produce same output
- Works across ALL MCP-supporting clients (Copilot, Claude, VS Code, etc.)
- Clean separation — PromptKit runs as a service, Copilot consumes tools
- `npm update` to get latest PromptKit content
- No context window pressure (assembled prompt returned as tool output)
- Assembly can enforce the Verbatim Inclusion Rule in code (not LLM honor system)

**Cons**:
- Most engineering effort to build (new MCP server package)
- Requires Node.js runtime on user's machine
- MCP server process runs alongside Copilot
- Loses interactive template mode (MCP tools are request/response, not conversational)
- User must configure MCP server (though plugin could automate this)

**Feasibility**: ✅ Medium-High — requires new package but uses existing ecosystem

---

### Strategy D: PromptKit as a Plugin (Composite)

**Concept**: Package PromptKit as a Copilot CLI plugin that bundles skills,
custom agents, MCP server, hooks, and LSP configs. One-command installation.

**Plugin structure**:
```
promptkit-plugin/
├── plugin.json                 # Plugin manifest
├── skills/
│   └── promptkit/
│       ├── SKILL.md            # Main composition skill
│       └── [PromptKit content files]
├── agents/
│   ├── promptkit.agent.md      # Meta-agent for full composition
│   ├── promptkit-investigator.agent.md
│   └── promptkit-reviewer.agent.md
├── hooks.json                  # Lifecycle hooks
├── .mcp.json                   # MCP server config
└── lsp.json                    # LSP server configs for common languages
```

**plugin.json**:
```json
{
  "name": "promptkit",
  "description": "Composable prompt library for structured engineering tasks",
  "version": "0.5.0",
  "author": { "name": "PromptKit Contributors" },
  "license": "MIT",
  "keywords": ["prompts", "engineering", "code-review", "requirements", "investigation"],
  "repository": "https://github.com/microsoft/PromptKit",
  "agents": "agents/",
  "skills": ["skills/"],
  "hooks": "hooks.json",
  "mcpServers": ".mcp.json",
  "lspServers": "lsp.json"
}
```

**Installation**:
```
copilot plugin install microsoft/PromptKit
```
or from a marketplace:
```
/plugin install promptkit@copilot-plugins
```

**User experience**:
```
> /skills list
  promptkit - Composable prompt assembly for engineering tasks

> /agent
  promptkit - PromptKit composition engine
  promptkit-investigator - Bug investigation specialist
  promptkit-reviewer - Code review specialist

> /promptkit author a requirements doc for our payment system
```

**Pros**:
- One-command install, easy updates (`copilot plugin update promptkit`)
- Bundles ALL integration strategies in a single unit
- Distributable to teams via marketplace
- Clean install/uninstall lifecycle
- Most "native" feeling — appears in all Copilot discovery surfaces
- Can include hooks for guardrails and LSP for code intelligence

**Cons**:
- Plugin system is the newest Copilot CLI feature
- Combines complexity of multiple strategies
- Plugin packaging and marketplace publishing need investigation

**Feasibility**: ⚠️ Medium — plugin system is new but well-documented; this is the ideal end state

---

### Strategy E: Custom Instructions as Bootstrap

**Concept**: Use `~/.copilot/copilot-instructions.md` to teach Copilot about
PromptKit's existence, without any additional infrastructure.

**~/.copilot/copilot-instructions.md** (appended):
```markdown
## PromptKit

You have access to the PromptKit prompt library at ~/.promptkit/.
When the user asks you to investigate bugs, review code, write requirements,
design systems, audit specifications, or perform other structured engineering
tasks, read ~/.promptkit/manifest.yaml to discover available templates and
assemble prompts following the process in ~/.promptkit/bootstrap.md.
```

**Pros**:
- Zero infrastructure — just a markdown file
- Works immediately, no install

**Cons**:
- Instructions always loaded (wastes context even when not needed)
- No auto-discovery via `/skills` or `/agent`
- No `/promptkit` slash command
- Relies entirely on LLM following instructions correctly

**Feasibility**: ✅ Very High — trivial to implement

---

### Strategy F: Hooks for Guardrails and Automation

**Concept**: Use Copilot CLI hooks to add PromptKit-aware automation at
session and tool lifecycle points — complementary to other strategies.

**hooks.json**:
```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [
      {
        "type": "command",
        "bash": "./scripts/promptkit-session-init.sh",
        "powershell": "./scripts/promptkit-session-init.ps1",
        "comment": "Validate PromptKit content is available and log session start",
        "timeoutSec": 10
      }
    ],
    "postToolUse": [
      {
        "type": "command",
        "bash": "./scripts/promptkit-validate-output.sh",
        "powershell": "./scripts/promptkit-validate-output.ps1",
        "comment": "After file writes, check for unresolved {{param}} placeholders",
        "timeoutSec": 15
      }
    ]
  }
}
```

**Use cases for hooks in PromptKit context**:

| Hook | PromptKit Use Case |
|------|-------------------|
| `sessionStart` | Validate PromptKit content exists; log which templates are available; set up temp workspace |
| `userPromptSubmitted` | Detect PromptKit-relevant prompts for analytics/telemetry (what templates are popular?) |
| `preToolUse` | Prevent writes to PromptKit source files (protect library integrity) |
| `postToolUse` | Validate assembled prompts: check for `{{param}}` residuals, verify section headers present, confirm Verbatim Inclusion Rule compliance |
| `subagentStop` | Capture PromptKit agent output for quality metrics or post-processing |
| `sessionEnd` | Clean up temp PromptKit workspace; log assembly statistics |

**Pros**:
- Adds quality guardrails that other strategies lack
- Works alongside skills, agents, or MCP server
- Can enforce invariants (e.g., no unresolved placeholders) programmatically
- Provides observability (what templates are being used, how often)
- Shell-based — can run any validation logic

**Cons**:
- Hooks alone don't provide discovery or invocation — purely supplementary
- Adds latency to tool execution (hooks run synchronously)
- Shell scripts add maintenance surface
- `userPromptSubmitted` and `postToolUse` outputs are currently ignored (can only log, not modify)

**Feasibility**: ✅ High — well-documented and straightforward

---

### Strategy G: LSP Configuration for Enhanced Code Intelligence

**Concept**: Bundle LSP server configurations alongside PromptKit to improve
Copilot's code understanding when executing PromptKit templates that analyze code.

**lsp.json** (bundled in plugin):
```json
{
  "lspServers": {
    "clangd": {
      "command": "clangd",
      "args": ["--background-index"],
      "fileExtensions": {
        ".c": "c",
        ".h": "c",
        ".cpp": "cpp",
        ".cc": "cpp",
        ".cxx": "cpp",
        ".hpp": "cpp"
      }
    },
    "rust-analyzer": {
      "command": "rust-analyzer",
      "fileExtensions": {
        ".rs": "rust"
      }
    },
    "yaml-language-server": {
      "command": "yaml-language-server",
      "args": ["--stdio"],
      "fileExtensions": {
        ".yaml": "yaml",
        ".yml": "yaml"
      }
    }
  }
}
```

**How it enhances PromptKit**:
- When `review-cpp-code` template is used → `clangd` provides diagnostics, symbol resolution
- When `memory-safety-rust` protocol is active → `rust-analyzer` provides type info, borrow checker insights
- When editing `manifest.yaml` → YAML language server provides validation
- Copilot gets richer context about code structure, types, and errors
- Templates that analyze code (review-code, exhaustive-bug-hunt, find-and-fix-bugs) benefit most

**Important caveat**: LSP servers must be **installed separately** by the user — Copilot CLI
only manages configuration, not installation. The plugin should document prerequisites
and ideally the `sessionStart` hook can check for LSP server availability.

**Pros**:
- Improves quality of code analysis templates significantly
- Copilot sees real compiler diagnostics, not just text patterns
- YAML LSP helps maintain PromptKit's own manifest
- Zero-config for users who already have language servers installed

**Cons**:
- LSP servers are heavy external dependencies
- User must install them separately (can't be bundled)
- Only helps code-analysis templates, not document authoring ones
- Not a direct PromptKit integration — more of a quality enhancement

**Feasibility**: ✅ High — simple JSON config; value depends on user's existing tooling

---

## Comparison Matrix

| Dimension | Current CLI | Skill (A) | Agent (B) | MCP (C) | Plugin (D) | Instructions (E) | Hooks (F) | LSP (G) |
|-----------|-------------|-----------|-----------|---------|------------|-------------------|-----------|---------|
| **Discoverability** | None | `/skills` | `/agent` | Tools | All | None | N/A | `/lsp` |
| **Invocation** | `npx promptkit` | `/promptkit` | `/agent` | Auto | All | In prompt | Auto | Auto |
| **Session integration** | New session | Same | Own ctx | Same | Varies | Same | Same | Same |
| **Assembly fidelity** | LLM | LLM | LLM | **Deterministic** | Varies | LLM | Validates | N/A |
| **Context pressure** | N/A | High | Isolated | **Low** | Varies | Always | None | None |
| **Install effort** | npm | Copy | Copy | npm+config | **One cmd** | Edit file | Copy | Config |
| **Update effort** | npm | Re-copy | Re-copy | npm | **One cmd** | Edit | Re-copy | Manual |
| **Cross-client** | No | No | No | **Yes** | No | No | No | Partial |
| **Code intelligence** | No | No | No | No | Optional | No | No | **Yes** |
| **Guardrails** | No | No | No | Code-level | Optional | No | **Yes** | No |
| **Engineering effort** | Exists | Low | Low | Medium | Medium | Trivial | Low | Low |

---

## Recommended Approach: Plugin-First with Layered Components

Rather than a sequential phase approach, the strategies should be viewed as
**complementary components of a single plugin**. The plugin is the distribution
vehicle; skills, agents, MCP, hooks, and LSP are its contents.

### Core Plugin Components

| Component | Role in Plugin | Priority |
|-----------|---------------|----------|
| **Skill** (A) | Primary invocation path — `/promptkit` | P0 (must-have) |
| **MCP Server** (C) | Deterministic assembly engine | P0 (must-have) |
| **Meta-Agent** (B1) | Interactive templates + full composition | P1 (high-value) |
| **Hooks** (F) | Output validation, telemetry, guardrails | P1 (high-value) |
| **Per-Template Agents** (B2) | High-value pre-composed workflows | P2 (nice-to-have) |
| **LSP Config** (G) | Enhanced code intelligence | P2 (nice-to-have) |
| **Custom Instructions** (E) | Fallback / lightweight alternative | Standalone option |

### Recommended Plugin Architecture

```
promptkit/
├── plugin.json
│
├── skills/
│   └── promptkit/
│       ├── SKILL.md              # Invocation entry point — uses MCP tools
│       └── [minimal inline content for fallback if MCP unavailable]
│
├── agents/
│   ├── promptkit.agent.md        # Full composition meta-agent
│   ├── promptkit-investigator.agent.md   # Pre-composed: investigate-bug
│   ├── promptkit-reviewer.agent.md       # Pre-composed: review-code
│   └── promptkit-requirements.agent.md   # Pre-composed: author-requirements-doc
│
├── hooks.json                    # Validation + telemetry hooks
├── .mcp.json                     # PromptKit MCP server config
└── lsp.json                      # Recommended LSP configs for common languages
```

### How the Pieces Work Together

```
User: "Investigate the crash in packet_handler.c"
  │
  ▼
Copilot auto-detects relevance → invokes promptkit skill
  │
  ▼
Skill instructs Copilot to call MCP tools:
  1. promptkit_list_templates() → finds investigate-bug
  2. promptkit_get_template_info("investigate-bug") → learns params needed
  3. Copilot asks user for missing params (or infers from context)
  4. promptkit_assemble({template, params}) → returns complete prompt
  │
  ▼
Copilot adopts assembled prompt as working instructions
  │
  ▼
postToolUse hook validates: no {{param}} residuals, sections present
  │
  ▼
LSP (clangd) provides code intelligence while Copilot analyzes C code
```

For **interactive templates** (`mode: interactive`), the skill delegates to
the `promptkit.agent.md` custom agent, which runs in its own context window
and executes the multi-turn reasoning workflow directly.

---

## Open Questions

1. **Skill + MCP interaction**: Can a skill's instructions direct Copilot to
   call specific MCP tools? This is the key integration pattern — skill provides
   discovery/invocation, MCP provides deterministic assembly.

2. **Skill size limits**: PromptKit's content is ~500KB+ of Markdown. If the MCP
   server handles assembly, the skill only needs instructions + manifest (much smaller).
   But what if MCP is unavailable — can the skill fall back to direct file reading?

3. **Plugin MCP lifecycle**: When a plugin includes `.mcp.json`, does Copilot
   auto-start the MCP server process? If so, `npx @promptkit/mcp-server` could
   be the command — no global install needed.

4. **Hook output limitations**: `userPromptSubmitted` and `postToolUse` hook
   outputs are currently ignored. Can `postToolUse` at least log validation
   failures that the user sees, even if it can't modify tool output?

5. **Context window budget**: When the MCP server returns a 50KB assembled prompt
   as a tool result, how does this affect available context? Tool results may be
   more efficient than file reads since they're structured.

6. **Interactive templates in MCP**: MCP tools are request/response. For interactive
   templates (`mode: interactive`), the custom agent (B1) is likely needed. Can the
   MCP server provide a `promptkit_get_interactive_context` tool that returns the
   persona + protocols + template for the agent to use directly?

7. **Plugin marketplace publishing**: Can PromptKit be listed on `github/copilot-plugins`
   or `github/awesome-copilot`? What's the submission process?

8. **LSP server detection**: Can hooks or skills detect whether recommended LSP
   servers are installed and warn if not? This would improve the setup experience.

---

## Next Steps

1. **Prototype the plugin**: Create a minimal `plugin.json` + skill + one agent,
   install locally via `copilot plugin install ./promptkit-plugin`, and test.

2. **Build MCP server**: Implement `list_templates`, `get_template_info`, and
   `assemble` tools. Test with Copilot CLI via `.mcp.json`.

3. **Write hooks**: Create `postToolUse` validation hook that checks assembled
   prompt output for common issues.

4. **Test skill ↔ MCP interaction**: Verify that a skill can instruct Copilot
   to call MCP tools effectively.

5. **Measure context impact**: Compare context consumption between direct file
   reading (skill-only) vs. MCP tool results.

6. **Investigate marketplace listing**: Research how to publish to
   `github/copilot-plugins` or `github/awesome-copilot`.
