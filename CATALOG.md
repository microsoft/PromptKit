<!-- GENERATED FILE — do not edit manually. -->
<!-- Regenerate with: node scripts/generate-catalog.js -->

# PromptKit Component Catalog

> **171 components** across 5 layers — auto-generated from `manifest.yaml` (v0.4.0).

## Quick Reference

| Layer | Count | Description |
|-------|-------|-------------|
| Personas | 15 | Domain expert identities |
| Protocols | 56 | Guardrails (5), Analysis (18), Reasoning (33) |
| Formats | 24 | Output structure definitions |
| Taxonomies | 5 | Classification schemes |
| Templates | 71 | Task orchestration prompts |

## Templates by Category

### document-authoring (16)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `author-requirements-doc` | software-architect | requirements-doc | Generate a requirements document from a natural language description. Single-shot generation. For complex/ambiguous projects, use interactive-design instead. |
| `author-architecture-spec` | software-architect | architecture-spec | Generate an architecture specification document describing the structure, scope, and cross-cutting concerns of a software component or system. Covers protocol/system description, network and software architecture, interfaces, and architectural implications. |
| `interactive-design` | configurable | requirements-doc | Multi-phase interactive design session. Phase 1: reason, question, and challenge before generating. Phase 2: generate when told. Phase 3: iterative refinement. Use for complex or ambiguous projects. |
| `author-north-star` | software-architect | north-star-document | Interactive authoring of a north-star or architectural vision document. Evidence-grounded, section-by-section drafting with user review. Use for strategic direction documents. |
| `author-design-doc` | software-architect | design-doc | Generate a design document that addresses a requirements document. |
| `author-validation-plan` | systems-engineer | validation-plan | Generate a validation plan covering all requirements. |
| `reverse-engineer-requirements` | reverse-engineer | requirements-doc | Reverse-engineer a structured requirements document from existing source code. Analyzes implementation to extract behavioral contracts, API specifications, and invariants. |
| `audit-traceability` | specification-analyst | investigation-report | Audit requirements, design, and validation documents for specification drift. Cross-checks traceability, assumption consistency, constraint propagation, and coverage completeness. |
| `audit-code-compliance` | specification-analyst | investigation-report | Audit source code against requirements and design documents. Detects unimplemented requirements, undocumented behavior, and constraint violations. |
| `audit-test-compliance` | specification-analyst | investigation-report | Audit test code against a validation plan and requirements document. Detects unimplemented test cases, missing acceptance criterion assertions, and assertion mismatches. |
| `audit-integration-compliance` | specification-analyst | investigation-report | Audit cross-component integration points against an integration specification and per-component specs. Detects unspecified integration flows, interface contract mismatches, and untested integration paths. |
| `audit-spec-invariants` | configurable | investigation-report | Adversarial analysis of a specification against user-supplied invariants. Finds spec gaps, ambiguities, and contradictions that could lead to invariant violations in any conforming implementation. |
| `diff-specifications` | specification-analyst | investigation-report | Compare two versions of a specification at the invariant level. Classify each change by type (Added, Removed, Tightened, Relaxed, Modified, Clarified) and backward-compatibility impact. Produce migration guidance for implementers. |
| `author-interface-contract` | systems-engineer | interface-contract | Generate an interface contract between two components from a requirements document, optionally referencing a design document. Produces per-resource-per-state guarantee and obligation matrices with invariants and failure modes. |
| `audit-interface-contract` | specification-analyst | investigation-report | Audit an interface contract for completeness, internal consistency, and alignment with governing specifications. Checks matrix coverage, traceability, enforceability, and failure mode completeness. |
| `validate-budget` | specification-analyst | investigation-report | Validate a quantitative analysis (power budget, link budget, cost rollup, timing analysis, memory budget) against specification constraints. Extracts constraints and claims, verifies arithmetic, computes margins, and performs sensitivity analysis. |

### standards (4)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `extract-rfc-requirements` | specification-analyst | requirements-doc | Extract structured requirements from an RFC or internet-draft. Normalizes normative language, state machines, message formats, and cross-RFC dependencies into a requirements document. |
| `reconcile-requirements` | specification-analyst | requirements-doc | Reconcile multiple requirements documents from different sources (RFCs, implementations, specifications) into a unified spec. Classifies requirements by cross-source compatibility. |
| `extract-invariants` | specification-analyst | requirements-doc | Extract structured invariants (constraints, state machines, timing assumptions, error conditions) from a specification or source code. Produces a dense, filtered subset of a full requirements extraction. |
| `author-rfc` | protocol-architect | rfc-document | Author an RFC or internet-draft using the xml2rfc Version 3 vocabulary. Produces structurally valid xml2rfc XML from a project description, protocol design, or requirements document. |

### presentations (1)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `author-presentation` | configurable | presentation-kit | Interactive authoring of professional technical presentations. Multi-phase workflow: audience analysis, narrative design, slide planning, appearance preferences, content generation, and PowerPoint production via python-pptx. Produces a presentation kit with slides, speaker notes, timeline, and optional demo plan and PDF export. |

### code-generation (3)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `author-implementation-prompt` | implementation-engineer | requirements-doc | Produce a structured prompt for a coding agent to generate spec-compliant implementation code. Pairs with audit-code-compliance for a generate/verify loop. |
| `author-test-prompt` | test-engineer | validation-plan | Produce a structured prompt for a coding agent to generate spec-compliant test code. Pairs with audit-test-compliance for a generate/verify loop. |
| `author-workflow-prompts` | workflow-arbiter | multi-artifact | Generate prompt assets for a multi-agent coding workflow: coder, reviewer, validator, and orchestrator prompts. Designed for external orchestrators — PromptKit produces the prompts, not the runtime. |

### investigation (6)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `investigate-bug` | systems-engineer | investigation-report | Investigate a bug from a problem description. Apply root cause analysis and produce an investigation report. |
| `find-and-fix-bugs` | systems-engineer | investigation-report | Autonomous bug-finding workflow. Scan code for a specific class of bugs, apply fixes, build to verify, iterate on errors, and produce a findings report. |
| `fix-compiler-warnings` | systems-engineer | structured-findings | Systematic batch remediation of compiler warnings. Process warnings from SARIF or compiler output, apply rule-specific fix patterns, build-verify each fix, and discover new patterns. |
| `investigate-security` | security-auditor | investigation-report | Security audit of code or a system component. Systematic vulnerability analysis with severity classification. |
| `profile-session` | specification-analyst | investigation-report | Analyze a completed LLM session log to identify token inefficiencies and structural waste. Maps execution back to PromptKit components and produces optimization recommendations. |
| `classify-findings` | systems-engineer | structured-findings | Classify a set of findings against a reference catalog or taxonomy. Three-way classification (Exact Match / Variant / New Pattern) with justification, confidence analysis, and catalog update proposals. |

### code-analysis (10)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `review-code` | systems-engineer | investigation-report | Thorough code review for correctness, safety, security, and maintainability. Supports additional analysis protocols. |
| `review-cpp-code` | systems-engineer | investigation-report | C/C++ specialized code review combining general review with research-validated best practices and memory safety analysis. Optionally applies Win32 API or performance-critical C patterns. |
| `exhaustive-bug-hunt` | systems-engineer | exhaustive-review-report | Deep, adversarial, line-by-line code review optimized for defect discovery. Exhaustive path tracing with coverage proof and falsification discipline. Optionally applies kernel-specific analysis for OS code. |
| `reconstruct-behavior` | reverse-engineer | behavioral-model | Reconstruct a behavioral model from an existing engineering artifact. Extracts state machines, control/signal flow, and implicit invariants from code, schematics, netlists, configurations, firmware images, or protocol captures. |
| `review-schematic` | electrical-engineer | investigation-report | Audit a schematic or netlist against requirements and component datasheets. Checks power architecture, pin-level correctness, bus integrity, protection circuits, power sequencing, passive components, and completeness. |
| `validate-simulation` | electrical-engineer | investigation-report | Review circuit simulation output (SPICE, power budget, thermal analysis) against specification constraints. Verifies setup, extracts results, checks compliance, assesses corner-case coverage, and evaluates model validity. |
| `review-bom` | electrical-engineer | investigation-report | Audit a bill of materials against the schematic and requirements. Checks part number correctness, voltage and temperature ratings, package matches, cost compliance, sourcing risks, and completeness. |
| `review-layout` | electrical-engineer | investigation-report | Audit a PCB layout against schematic intent and requirements. Reviews DRC output, trace widths, impedance control, ground plane integrity, component placement, thermal design, and manufacturing constraints. |
| `audit-link-budget` | rf-engineer | investigation-report | Audit a wireless link budget for transmitter chain, path loss model validity, receiver chain, margin adequacy, regulatory compliance, and sensitivity to environmental assumptions. |
| `review-enclosure` | mechanical-engineer | investigation-report | Audit an enclosure design for an electronic assembly. Reviews PCB fit, environmental protection, thermal management, antenna compatibility, sensor access, manufacturing feasibility, and mounting provisions. |

### hardware-design (4)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `design-schematic` | electrical-engineer | — | Interactive schematic design session. Guides the user from project requirements through component selection to a complete KiCad schematic with adversarial audits at each gate. |
| `design-pcb-layout` | electrical-engineer | — | Interactive PCB layout session. Guides the user from a completed schematic through placement, automated routing, and DRC validation with layout-to-schematic feedback loop. |
| `emit-manufacturing-artifacts` | electrical-engineer | — | Interactive manufacturing artifact generation session. Produces fab-ready Gerbers, drill files, BOM, pick-and-place, and assembly drawings with fab-specific formatting for JLCPCB and PCBWay. |
| `hardware-design-workflow` | electrical-engineer | — | End-to-end hardware design workflow from initial idea to manufacturable artifacts. Guides through requirements, component selection, schematic, PCB layout, and manufacturing with adversarial audits and user review at every gate. |

### testing (2)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `discover-tests-for-changes` | test-engineer | triage-report | Analyze local code changes to identify affected components and discover relevant tests. Finds test files near changed code, checks test configuration, and recommends execution strategy. |
| `scaffold-test-project` | test-engineer | implementation-plan | Scaffold a complete test project with build configuration, test class boilerplate, and test runner setup for a given framework and language. |

### planning (1)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `plan-implementation` | software-architect | implementation-plan | Decompose a project into an actionable implementation plan with tasks, dependencies, and risk assessment. Supports `mode=refactoring` for safe, incremental refactoring plans. |

### agent-authoring (1)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `author-agent-instructions` | promptkit-contributor | agent-instructions | Assemble PromptKit components (persona, protocols) into composable agent skill files, custom agent definitions, or CLI skills. For GitHub Copilot, produces .github/instructions/*.instructions.md, .github/agents/*.agent.md, or .github/skills/*/SKILL.md. Also supports Claude Code (CLAUDE.md) and Cursor (.cursorrules). |

### contribution (4)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `extend-library` | promptkit-contributor | promptkit-pull-request | Guide a contributor through designing and building new PromptKit components. Interactive workflow producing PR-ready files. |
| `decompose-prompt` | promptkit-contributor | promptkit-pull-request | Reverse-engineer a hand-written prompt into PromptKit's semantic layers. Maps segments to existing components, flags improvements, and generates PR-ready files for novel components. |
| `audit-library-consistency` | specification-analyst | investigation-report | Audit the PromptKit component library for overlap, redundancy, inconsistency, and consolidation opportunities. Finds protocol duplication, template near-duplicates, terminology drift, and stale cross-references. |
| `audit-library-health` | specification-analyst | investigation-report | Comprehensive health audit of the PromptKit component library. Three-pass analysis covering structural consistency, corpus safety for assimilation risks, and runtime fitness assessment. Produces a unified investigation report with PR-ready remediation recommendations. |

### devops (7)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `author-pipeline` | devops-engineer | pipeline-spec | Generate a production-ready CI/CD pipeline for a given application and target platform. Supports GitHub Actions, Azure DevOps, GitLab CI. |
| `triage-issues` | devops-engineer | triage-report | Triage and prioritize open issues or work items. Classify by priority and effort, identify patterns, recommend a workflow. |
| `triage-pull-requests` | devops-engineer | triage-report | Triage open pull requests to identify which need review, are stale, have conflicts, or are ready to merge. Prioritize review effort. |
| `root-cause-ci-failure` | devops-engineer | investigation-report | Investigate a failing CI/CD pipeline run. Analyze logs, pipeline configuration, and platform behavior. Produce an investigation report. |
| `author-release` | devops-engineer | release-notes | Generate structured release notes from commits, PRs, and issues between two versions. Changelog, breaking changes, upgrade instructions. |
| `review-infrastructure` | devops-engineer | investigation-report | Review infrastructure-as-code (Terraform, Bicep, ARM, Pulumi, CloudFormation) for correctness, security, and best practices. |
| `generate-commit-message` | software-architect | — | Generate a structured commit message from staged git changes. Analyzes diffs to produce a Problem/Solution or Conventional Commits format message with file change summaries. |

### protocol-engineering (3)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `evolve-protocol` | protocol-architect | protocol-delta | Interactive protocol evolution session. Ingests an existing protocol specification, works with the user to design modifications, traces impact, verifies consistency, and produces a protocol delta document. |
| `analyze-protocol-conflicts` | protocol-architect | investigation-report | Compare two protocol specifications to identify semantic conflicts, incompatible assumptions, and interoperability hazards. Produces an investigation report with resolution recommendations. |
| `author-protocol-validation` | protocol-architect | protocol-validation-spec | Derive a protocol validation specification from a protocol spec. Produces a test blueprint covering state machine coverage, message format conformance, error handling, and interoperability scenarios. |

### engineering-workflow (8)

| Template | Persona | Format | Description |
|----------|---------|--------|-------------|
| `engineering-workflow` | configurable | — | Full incremental engineering workflow with human-in-the-loop review. Guides an agent through requirements discovery, specification changes, implementation changes, adversarial audits, and deliverable creation. Domain-agnostic. |
| `collaborate-requirements-change` | configurable | structured-patch | Interactive requirements discovery for incremental changes. Work with the user to understand, refine, and produce a structured requirements patch. Domain-agnostic. |
| `generate-spec-changes` | configurable | structured-patch | Generate design and validation specification changes from a requirements patch. Propagates each requirement change to design sections and validation entries. Domain-agnostic. |
| `generate-implementation-changes` | configurable | structured-patch | Generate implementation and verification changes from a specification patch. Propagates design and validation changes to implementation artifacts. Domain-agnostic. |
| `audit-spec-alignment` | specification-analyst | investigation-report | Adversarial audit of specification patches against user intent. Verifies requirements, design, and validation changes faithfully represent what the user asked for. Domain-agnostic. |
| `audit-implementation-alignment` | specification-analyst | investigation-report | Adversarial audit of implementation patches against specification deltas. Verifies implementation and verification changes correctly realize the specification changes. Domain-agnostic. |
| `spec-extraction-workflow` | configurable | — | Bootstrap any repository with a clean semantic baseline. Scans existing code, docs, tests, and issues, extracts draft specs, collaborates with the user to clarify intent, audits for consistency, and produces PR-ready spec files. Domain-agnostic complement to engineering-workflow. |
| `maintenance-workflow` | configurable | — | Periodic health check workflow. Re-audits requirements, design, validation, and implementation for drift, collaborates with the user to classify findings, generates corrective patches, and restores alignment. Domain-agnostic — completes the engineering lifecycle triad. |

## Protocols

### guardrails (5)

| Protocol | Language | Used by | Description |
|----------|----------|---------|-------------|
| `anti-hallucination` | — | `author-requirements-doc`, `author-architecture-spec`, `interactive-design`, `author-north-star`, `author-design-doc`, `author-validation-plan`, `reverse-engineer-requirements`, `audit-traceability`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `audit-spec-invariants`, `diff-specifications`, `author-interface-contract`, `audit-interface-contract`, `validate-budget`, `extract-rfc-requirements`, `reconcile-requirements`, `extract-invariants`, `author-rfc`, `author-presentation`, `author-implementation-prompt`, `author-test-prompt`, `author-workflow-prompts`, `investigate-bug`, `find-and-fix-bugs`, `fix-compiler-warnings`, `investigate-security`, `profile-session`, `classify-findings`, `review-code`, `review-cpp-code`, `exhaustive-bug-hunt`, `reconstruct-behavior`, `review-schematic`, `validate-simulation`, `review-bom`, `review-layout`, `audit-link-budget`, `review-enclosure`, `design-schematic`, `design-pcb-layout`, `emit-manufacturing-artifacts`, `hardware-design-workflow`, `discover-tests-for-changes`, `scaffold-test-project`, `plan-implementation`, `author-agent-instructions`, `extend-library`, `decompose-prompt`, `audit-library-consistency`, `audit-library-health`, `author-pipeline`, `triage-issues`, `triage-pull-requests`, `root-cause-ci-failure`, `author-release`, `review-infrastructure`, `generate-commit-message`, `evolve-protocol`, `analyze-protocol-conflicts`, `author-protocol-validation`, `engineering-workflow`, `collaborate-requirements-change`, `generate-spec-changes`, `generate-implementation-changes`, `audit-spec-alignment`, `audit-implementation-alignment`, `spec-extraction-workflow`, `maintenance-workflow` | Prevents fabrication. Enforces epistemic labeling (KNOWN/INFERRED/ASSUMED), uncertainty disclosure, and source attribution. Apply to all tasks. |
| `self-verification` | — | `author-requirements-doc`, `author-architecture-spec`, `interactive-design`, `author-north-star`, `author-design-doc`, `author-validation-plan`, `reverse-engineer-requirements`, `audit-traceability`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `audit-spec-invariants`, `diff-specifications`, `author-interface-contract`, `audit-interface-contract`, `validate-budget`, `extract-rfc-requirements`, `reconcile-requirements`, `extract-invariants`, `author-rfc`, `author-presentation`, `author-implementation-prompt`, `author-test-prompt`, `author-workflow-prompts`, `investigate-bug`, `find-and-fix-bugs`, `fix-compiler-warnings`, `investigate-security`, `profile-session`, `classify-findings`, `review-code`, `review-cpp-code`, `exhaustive-bug-hunt`, `reconstruct-behavior`, `review-schematic`, `validate-simulation`, `review-bom`, `review-layout`, `audit-link-budget`, `review-enclosure`, `design-schematic`, `design-pcb-layout`, `emit-manufacturing-artifacts`, `hardware-design-workflow`, `discover-tests-for-changes`, `scaffold-test-project`, `plan-implementation`, `author-agent-instructions`, `extend-library`, `decompose-prompt`, `audit-library-consistency`, `audit-library-health`, `author-pipeline`, `triage-issues`, `triage-pull-requests`, `root-cause-ci-failure`, `author-release`, `review-infrastructure`, `generate-commit-message`, `evolve-protocol`, `analyze-protocol-conflicts`, `author-protocol-validation`, `engineering-workflow`, `collaborate-requirements-change`, `generate-spec-changes`, `generate-implementation-changes`, `audit-spec-alignment`, `audit-implementation-alignment`, `spec-extraction-workflow`, `maintenance-workflow` | Quality gate requiring the LLM to verify its own output before finalizing. Sampling checks, citation audits, coverage confirmation, consistency checks. |
| `operational-constraints` | — | `reverse-engineer-requirements`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `author-presentation`, `investigate-bug`, `find-and-fix-bugs`, `fix-compiler-warnings`, `investigate-security`, `review-code`, `review-cpp-code`, `reconstruct-behavior`, `discover-tests-for-changes`, `audit-library-health`, `engineering-workflow`, `generate-implementation-changes`, `audit-implementation-alignment`, `spec-extraction-workflow`, `maintenance-workflow` | Governs how the LLM scopes work, uses tools, manages context, and prefers deterministic analysis. Prevents over-ingestion and ensures reproducibility. |
| `minimal-edit-discipline` | — | `find-and-fix-bugs`, `fix-compiler-warnings` | Constrains code modifications to be minimal, type-preserving, encoding-safe, and verifiable. Prevents collateral damage from automated fixes, refactoring, and code generation. |
| `adversarial-falsification` | — | `exhaustive-bug-hunt`, `engineering-workflow`, `audit-spec-alignment`, `audit-implementation-alignment`, `spec-extraction-workflow`, `maintenance-workflow` | Enforces adversarial self-falsification discipline. Requires the reviewer to disprove every candidate finding before reporting it, reject known-safe patterns, and resist premature summarization. |

### analysis (18)

| Protocol | Language | Used by | Description |
|----------|----------|---------|-------------|
| `memory-safety-c` | C | `review-cpp-code` | Memory safety analysis for C. Covers allocation/deallocation pairing, pointer lifecycle, buffer boundaries, and undefined behavior. |
| `cpp-best-practices` | C++ | `review-cpp-code` | Research-validated C++ code review patterns based on academic literature and industry standards. Covers memory safety, concurrency, API design, performance, error handling, code clarity, and testing. |
| `memory-safety-rust` | Rust | — | Memory safety analysis for Rust. Focuses on unsafe blocks, FFI boundaries, interior mutability, and resource leaks. |
| `thread-safety` | — | — | Concurrency analysis. Covers data races, deadlocks, atomicity violations, and thread lifecycle. Language-agnostic. |
| `security-vulnerability` | — | `investigate-security`, `review-infrastructure` | Security vulnerability analysis. Trust boundaries, input validation, auth, crypto, and information disclosure. Language-agnostic. |
| `win32-api-conventions` | C | — | Win32 API conventions analysis. Covers function naming, struct and enum typedefs, parameter ordering, modern data types, const-correctness, Hungarian notation avoidance, and C compatibility of SDK headers. |
| `performance-critical-c-api` | C | — | Code review patterns for performance-critical C API design. Covers flat C API enforcement, caller-controlled memory, strongly-typed handles, standard portable types, UTF-8 string handling, minimal API surface, and specific error codes. |
| `winrt-design-patterns` | C++ | — | Analysis protocol for reviewing Windows Runtime API code against established WinRT design patterns. Covers activation contracts, deferrals, data store separation, device enumeration, Get/Find semantics, strongly-typed identifiers, and Try pattern. |
| `compiler-diagnostics-cpp` | C++ | `fix-compiler-warnings` | Systematic protocol for analyzing and remediating C++ compiler diagnostics. Covers variable shadowing, implicit conversions, unused variables, deprecated features, and pragma suppression handling with specific resolution strategies. |
| `msvc-clang-portability` | C++ | — | C++ cross-compiler portability analysis between MSVC and Clang/GCC. Identifies MSVC extensions and non-standard patterns that fail on standards-conforming compilers. Covers template rules, const correctness, exception specs, dependent types, implicit conversions, and deprecated features. |
| `kernel-correctness` | C | — | Correctness analysis for OS kernel and driver code. Lock/refcount symmetry, cleanup path completeness, PFN/PTE state transitions, interlocked sequences, charge/uncharge accounting, and known-safe kernel pattern suppression. |
| `schematic-compliance-audit` | — | `review-schematic`, `design-schematic`, `hardware-design-workflow` | Systematic schematic review protocol. Audits a netlist or schematic against requirements and datasheet specifications. Covers power architecture, pin-level verification, bus integrity, protection circuits, power sequencing, passive components, and completeness. |
| `simulation-validation` | — | `validate-simulation` | Systematic review of circuit simulation output (SPICE, power budget, thermal analysis) against specification constraints. Covers setup verification, result interpretation, constraint compliance, corner-case coverage, and model validity. |
| `bom-consistency` | — | `review-bom` | Systematic BOM review protocol. Audits a bill of materials against the schematic and requirements for part number correctness, voltage and temperature ratings, package matches, cost compliance, sourcing risks, and completeness. |
| `layout-design-review` | — | `review-layout`, `design-pcb-layout`, `hardware-design-workflow` | Systematic PCB layout review protocol. Audits layout decisions and DRC output against schematic intent and requirements. Covers trace widths, impedance control, ground plane integrity, component placement, thermal design, and manufacturing constraints. |
| `link-budget-audit` | — | `audit-link-budget` | Systematic link budget review protocol. Audits a wireless link budget for transmitter chain, path loss model selection, receiver chain, margin adequacy, regulatory compliance, and sensitivity to environmental assumptions. |
| `enclosure-design-review` | — | `review-enclosure` | Systematic enclosure design review protocol for electronic assemblies. Audits for PCB fit, thermal management, environmental protection, antenna compatibility, sensor access, manufacturing feasibility, and mounting provisions. |
| `component-selection-audit` | — | `design-schematic`, `hardware-design-workflow` | Adversarial audit of a component selection against requirements and real-world data. Independently verifies part numbers exist, datasheet specs match claims, sourcing data is current, and compatibility assertions hold. Catches hallucinated parts and stale specifications. |

### reasoning (33)

| Protocol | Language | Used by | Description |
|----------|----------|---------|-------------|
| `root-cause-analysis` | — | `investigate-bug`, `root-cause-ci-failure` | Systematic root cause analysis. Symptom characterization, hypothesis generation, evidence evaluation, and causal chain tracing. |
| `requirements-elicitation` | — | `author-requirements-doc`, `interactive-design`, `hardware-design-workflow`, `engineering-workflow`, `collaborate-requirements-change`, `spec-extraction-workflow` | Requirements extraction from natural language. Produces numbered, atomic, testable requirements with RFC 2119 keywords. |
| `iterative-refinement` | — | `interactive-design`, `engineering-workflow`, `collaborate-requirements-change`, `spec-extraction-workflow`, `maintenance-workflow` | Protocol for revising documents through feedback cycles while preserving structural integrity, numbering, cross-references, and internal consistency. |
| `promptkit-design` | — | `extend-library` | Reasoning protocol for designing new PromptKit components. Scoping, component type selection, dependency analysis, and convention compliance. |
| `devops-platform-analysis` | — | `author-pipeline`, `root-cause-ci-failure` | Systematic reasoning about DevOps platform constructs: pipelines, triggers, jobs, environments, secrets, approvals, and artifacts. Platform-agnostic methodology with platform-specific instantiation. |
| `requirements-from-implementation` | — | `reverse-engineer-requirements`, `spec-extraction-workflow` | Systematic reasoning protocol for deriving structured requirements from existing source code. Transforms code understanding into testable, atomic requirements with acceptance criteria. |
| `traceability-audit` | — | `audit-traceability`, `engineering-workflow`, `audit-spec-alignment`, `spec-extraction-workflow`, `maintenance-workflow` | Systematic cross-document comparison protocol for auditing requirements, design, and validation artifacts. Builds traceability matrices and classifies divergence using the specification-drift taxonomy. |
| `code-compliance-audit` | — | `audit-code-compliance`, `engineering-workflow`, `audit-implementation-alignment`, `maintenance-workflow` | Systematic protocol for auditing source code against requirements and design documents. Maps specification claims to code behavior and classifies findings using the specification-drift taxonomy (D8–D10). |
| `test-compliance-audit` | — | `audit-test-compliance`, `engineering-workflow`, `audit-implementation-alignment`, `maintenance-workflow` | Systematic protocol for auditing test code against a validation plan and requirements document. Maps test case definitions to test implementations and classifies findings using the specification-drift taxonomy (D11–D13). |
| `integration-audit` | — | `audit-integration-compliance` | Systematic protocol for auditing cross-component integration points. Maps integration flows across component boundaries, verifies interface contracts, and checks integration test coverage. Classifies findings using the specification-drift taxonomy (D14–D16). |
| `rfc-extraction` | — | `extract-rfc-requirements` | Systematic protocol for extracting structured requirements from RFCs and internet-drafts. Handles normative language (RFC 2119), state machines, cross-RFC dependencies, ABNF grammars, and IANA/security considerations. |
| `invariant-extraction` | — | `extract-invariants`, `reconstruct-behavior` | Systematic protocol for extracting structured invariants (constraints, state machines, timing assumptions, ordering rules, error conditions) from specifications or source code. Produces a dense, filtered subset of a full requirements extraction. |
| `workflow-arbitration` | — | `author-workflow-prompts` | Protocol for evaluating progress in a multi-agent coding workflow. Determines whether reviewer findings are valid, coder responses are adequate, and whether the workflow should continue or terminate. |
| `requirements-reconciliation` | — | `reconcile-requirements` | Systematic protocol for reconciling multiple requirements documents from different sources into a unified specification. Classifies each requirement by cross-source compatibility (Universal, Majority, Divergent, Extension). |
| `finding-classification` | — | `classify-findings` | Systematic protocol for classifying findings (bugs, warnings, review comments, audit results) against a known taxonomy or pattern catalog. Performs three-way classification with justification, confidence analysis, and catalog update proposals. |
| `interface-contract-audit` | — | `audit-interface-contract` | Systematic audit of an interface contract for completeness, internal consistency, and alignment with governing specifications. Checks matrix coverage, guarantee traceability, obligation enforceability, invariant consistency, and failure mode completeness. |
| `exhaustive-path-tracing` | — | `exhaustive-bug-hunt` | Systematic per-file deep review protocol. Full-file reading, local structure mapping, high-risk function identification, exhaustive path tracing with cleanup/lock/refcount symmetry verification, and coverage ledger documentation. |
| `protocol-evolution` | — | `evolve-protocol` | Systematic protocol for modifying or extending existing protocol specifications. Specification ingestion, change request analysis, impact tracing, consistency verification, and delta generation. |
| `protocol-conflict-analysis` | — | `analyze-protocol-conflicts` | Systematic protocol for comparing two protocol specifications. Protocol decomposition, semantic overlap detection, contradiction analysis, interoperability assessment, and resolution recommendations. |
| `protocol-validation-design` | — | `author-protocol-validation` | Systematic protocol for deriving a validation specification from a protocol specification. Testable property identification, test case design, validation oracle definition, and coverage analysis. |
| `spec-invariant-audit` | — | `audit-spec-invariants` | Systematic adversarial analysis of a specification against user-supplied invariants. Constructs compliant-but-violating interpretations to find spec gaps, ambiguities, contradictions, and missing recovery paths. |
| `quantitative-constraint-validation` | — | `validate-budget` | Systematic validation of quantitative claims (budgets, rollups, margins) against specification constraints. Covers constraint extraction, arithmetic verification, unit checking, margin analysis, sensitivity analysis, and completeness. |
| `spec-evolution-diff` | — | `diff-specifications` | Systematic methodology for comparing two versions of a specification at the invariant level. Extracts invariants from both versions, classifies each delta by type and backward-compatibility impact, and produces migration guidance. |
| `session-profiling` | — | `profile-session` | Systematic analysis of LLM session logs to detect token inefficiencies, redundant reasoning, and structural waste. Maps execution back to PromptKit components and produces actionable optimization recommendations. |
| `change-propagation` | — | `engineering-workflow`, `generate-spec-changes`, `generate-implementation-changes`, `maintenance-workflow` | Systematic reasoning protocol for propagating changes through artifact layers while maintaining alignment. Covers impact analysis, change derivation, invariant checking, completeness verification, and conflict detection. Domain-agnostic. |
| `step-retrospective` | — | — | Protocol for learning from execution experience in iterative workflows. After completing a step, systematically analyze variances (tooling gaps, process gaps, knowledge gaps), trace root causes, and feed concrete improvements back into the tooling and process for the next iteration. |
| `presentation-design` | — | `author-presentation` | Systematic reasoning protocol for designing technical presentations. Covers audience analysis, narrative arc construction, slide decomposition, visual design decisions, time budgeting, and demo choreography. Domain-agnostic. |
| `component-selection` | — | `design-schematic`, `hardware-design-workflow` | Systematic reasoning protocol for selecting electronic components from requirements. Covers functional decomposition, candidate identification via real-time search, technical evaluation, sourcing verification, cross-component compatibility, and decision matrix generation. Scoped to core functional components. |
| `schematic-design` | — | `design-schematic`, `hardware-design-workflow` | Systematic reasoning protocol for designing a circuit schematic from requirements and selected components. Covers power architecture, supporting circuitry derivation from datasheets, signal routing, protection circuits, and KiCad .kicad_sch S-expression generation with explicit visual layout rules. |
| `pcb-layout-design` | — | `design-pcb-layout`, `hardware-design-workflow` | Systematic reasoning protocol for PCB layout and routing from a completed schematic. Covers layout requirements gathering, board definition, design rules, component placement, routing strategy, and automated execution via Python pcbnew API with FreeRouting autorouter and KiCad DRC validation loop. Supports 2-layer and 4-layer stackups. |
| `prompt-decomposition` | — | `decompose-prompt` | Systematic reasoning protocol for decomposing an existing hand-written prompt into PromptKit's semantic layers. Extracts persona, protocol, taxonomy, format, and task instruction segments. Maps each to existing library components or marks as novel for assimilation. |
| `manufacturing-artifact-generation` | — | `emit-manufacturing-artifacts`, `hardware-design-workflow` | Systematic reasoning protocol for generating manufacturing deliverables from a completed PCB design. Covers Gerber files, Excellon drill files, BOM formatting, pick-and-place centroid files, and assembly drawings with fab-specific formatting for JLCPCB, PCBWay, and other services. |
| `corpus-safety-audit` | — | `audit-library-health` | Systematic audit of a prompt component corpus for assimilation risks. Checks provenance and attribution, detects verbatim copying from external sources, screens for confidential or internal-only content, and verifies license compliance. |

## Personas

| Persona | Used by | Description |
|---------|---------|-------------|
| `systems-engineer` | `author-validation-plan`, `author-interface-contract`, `investigate-bug`, `find-and-fix-bugs`, `fix-compiler-warnings`, `classify-findings`, `review-code`, `review-cpp-code`, `exhaustive-bug-hunt` | Senior systems engineer. Deep expertise in memory management, concurrency, performance, and debugging. Reasons from first principles. |
| `security-auditor` | `investigate-security` | Principal security engineer. Adversarial mindset. Specializes in vulnerability discovery, threat modeling, and secure design. |
| `software-architect` | `author-requirements-doc`, `author-architecture-spec`, `author-north-star`, `author-design-doc`, `plan-implementation`, `generate-commit-message` | Staff software architect. System design, API contracts, tradeoff analysis, and long-term maintainability. |
| `promptkit-contributor` | `author-agent-instructions`, `extend-library`, `decompose-prompt` | PromptKit contribution guide. Understands the library's architecture, conventions, and quality standards. Guides contributors through designing and building new components. |
| `devops-engineer` | `author-pipeline`, `triage-issues`, `triage-pull-requests`, `root-cause-ci-failure`, `author-release`, `review-infrastructure` | Senior DevOps / platform engineer. Deep expertise in CI/CD pipelines, release engineering, infrastructure-as-code, and platform APIs across GitHub Actions, Azure DevOps, GitLab CI, and other DevOps platforms. |
| `reverse-engineer` | `reverse-engineer-requirements`, `reconstruct-behavior` | Senior reverse engineer. Extracts specifications, contracts, and behavioral requirements from existing implementations. Separates essential behavior from implementation details. |
| `specification-analyst` | `audit-traceability`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `diff-specifications`, `audit-interface-contract`, `validate-budget`, `extract-rfc-requirements`, `reconcile-requirements`, `extract-invariants`, `profile-session`, `audit-library-consistency`, `audit-library-health`, `audit-spec-alignment`, `audit-implementation-alignment` | Senior specification analyst. Cross-examines requirements, design, and validation artifacts for consistency, completeness, and traceability. Adversarial toward completeness claims. |
| `workflow-arbiter` | `author-workflow-prompts` | Senior workflow arbiter. Evaluates multi-agent workflow progress, detects livelock and bikeshedding, and decides whether a coding/review/validation loop should continue or terminate. |
| `implementation-engineer` | `author-implementation-prompt` | Senior implementation engineer. Builds correct, maintainable code from specifications. Traces every implementation decision back to a requirement. |
| `test-engineer` | `author-test-prompt`, `discover-tests-for-changes`, `scaffold-test-project` | Senior test engineer. Writes thorough, specification-driven tests that verify every requirement and acceptance criterion. Prioritizes coverage breadth, negative cases, and boundary conditions. |
| `embedded-firmware-engineer` | — | Senior embedded firmware engineer. Deep expertise in boot sequences, flash memory management, OTA updates, power-fail-safe operations, watchdog timers, and device recovery mechanisms. Reasons about every failure mode at every execution point. |
| `electrical-engineer` | `review-schematic`, `validate-simulation`, `review-bom`, `review-layout`, `design-schematic`, `design-pcb-layout`, `emit-manufacturing-artifacts`, `hardware-design-workflow` | Senior electrical engineer. Deep expertise in power delivery, signal integrity, PCB design, component selection, and schematic review. Thinks in voltage domains and current paths. Conservative about datasheet margins. |
| `rf-engineer` | `audit-link-budget` | Senior RF systems engineer. Deep expertise in link budget analysis, antenna characterization, propagation modeling, transceiver design, regulatory compliance, and RF test and measurement. |
| `mechanical-engineer` | `review-enclosure` | Senior mechanical engineer. Deep expertise in enclosure design for electronics, 3D printing design-for-manufacturing, material selection, thermal management, environmental protection, and physical integration of PCB assemblies. |
| `protocol-architect` | `author-rfc`, `evolve-protocol`, `analyze-protocol-conflicts`, `author-protocol-validation` | Senior protocol architect. Deep expertise in protocol design, evolution, and formal specification. Reasons about state machines, message formats, backward compatibility, and interoperability across protocol layers. |

## Formats

| Format | Produces | Consumes | Used by | Description |
|--------|----------|----------|---------|-------------|
| `requirements-doc` | requirements-document | — | `author-requirements-doc`, `interactive-design`, `reverse-engineer-requirements`, `extract-rfc-requirements`, `reconcile-requirements`, `extract-invariants`, `author-implementation-prompt` | Structured requirements document with numbered REQ-IDs, acceptance criteria, constraints, assumptions, and risks. |
| `design-doc` | design-document | requirements-document | `author-design-doc` | Software design document with architecture, API contracts, data models, tradeoff analysis, and open questions. |
| `validation-plan` | validation-plan | requirements-document | `author-validation-plan`, `author-test-prompt` | Test and validation plan with traceability matrix, test cases, risk prioritization, and pass/fail criteria. |
| `investigation-report` | investigation-report | — | `audit-traceability`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `audit-spec-invariants`, `diff-specifications`, `audit-interface-contract`, `validate-budget`, `investigate-bug`, `find-and-fix-bugs`, `investigate-security`, `profile-session`, `review-code`, `review-cpp-code`, `review-schematic`, `validate-simulation`, `review-bom`, `review-layout`, `audit-link-budget`, `review-enclosure`, `audit-library-consistency`, `audit-library-health`, `root-cause-ci-failure`, `review-infrastructure`, `analyze-protocol-conflicts`, `audit-spec-alignment`, `audit-implementation-alignment` | Investigation report with findings, root cause analysis, evidence, remediation plan, and prevention recommendations. |
| `multi-artifact` | artifact-set | — | `author-workflow-prompts` | Multi-file output format for tasks producing multiple deliverables (structured data, reports, coverage logs). Defines artifact manifests, per-artifact schemas, and cross-artifact consistency rules. |
| `promptkit-pull-request` | promptkit-contribution | — | `extend-library`, `decompose-prompt` | Output format for PromptKit contributions. Produces PR-ready component files, manifest update, and pull request description. |
| `pipeline-spec` | pipeline-spec | — | `author-pipeline` | CI/CD pipeline specification with platform-specific YAML, design rationale, configuration requirements, and deployment notes. |
| `triage-report` | triage-report | — | `discover-tests-for-changes`, `triage-issues`, `triage-pull-requests` | Prioritized triage report for issues, pull requests, or work items. Classifies items by priority, effort, and recommended action. |
| `release-notes` | release-notes | — | `author-release` | Structured release notes with changelog, breaking changes, upgrade instructions, and contributor acknowledgment. |
| `agent-instructions` | agent-instruction-file | — | `author-agent-instructions` | Output format for persistent agent instruction files, custom agent definitions, and CLI skills. Produces .github/instructions/, .github/agents/, .github/skills/, CLAUDE.md, and .cursorrules. Works with VS Code, JetBrains, GitHub.com, and the Copilot CLI. |
| `copilot-prompt-file` | copilot-prompt-file | — | — | Output format for GitHub Copilot prompt files (.github/prompts/*.prompt.md). Packages an assembled PromptKit prompt as a reusable slash command invokable in Copilot Chat. Full semantic fidelity — no content condensation. |
| `agentic-workflow` | agentic-workflow | — | — | Output format for GitHub Agentic Workflow files (.github/workflows/*.md). Packages an assembled PromptKit prompt as a scheduled or event-driven automation running in GitHub Actions with a coding agent. Requires `gh aw` CLI for compilation. |
| `implementation-plan` | implementation-plan | — | `scaffold-test-project`, `plan-implementation` | Output format for implementation and refactoring plans. Task breakdown, dependency ordering, risk assessment, and verification strategy. |
| `north-star-document` | north-star-document | — | `author-north-star` | Strategic north-star or architectural vision document. Describes the desired end state, guiding principles, and transition considerations — not the implementation plan. |
| `structured-findings` | structured-findings | — | `fix-compiler-warnings`, `classify-findings` | Output format for structured findings documents. Transforms raw diagnostic output (compiler warnings, linter results, security scans) into consolidated, classified findings with root cause analysis, severity assessment, and remediation guidance. |
| `exhaustive-review-report` | exhaustive-review-report | — | `exhaustive-bug-hunt` | Exhaustive code review report with per-file coverage ledgers, adversarial finding templates requiring falsification proof, and false-positive rejection logs. |
| `protocol-delta` | protocol-delta | requirements-document | `evolve-protocol` | Protocol specification amendment format. Supports amendment (section-by-section changes), redline (tracked changes), and standalone (revised specification) presentation styles. Tracks normative language changes, backward compatibility, and cross-reference updates. |
| `protocol-validation-spec` | protocol-validation-spec | requirements-document | `author-protocol-validation` | Protocol validation specification format. Structures conformance tests around state machine coverage, message format verification, error handling, negotiation, interoperability scenarios, and validation tool requirements. |
| `rfc-document` | rfc-document | requirements-document | `author-rfc` | RFC and internet-draft output format using the xml2rfc Version 3 vocabulary (RFC 7991). Produces structurally valid XML for the xml2rfc toolchain. Covers front matter, normative sections, ABNF, state machines, security/IANA considerations, and references. |
| `behavioral-model` | behavioral-model | — | `reconstruct-behavior` | Output format for reconstructed behavioral models. State machines with diagrams and transition tables, control/signal flow graphs, implicit invariants, and undefined behavior catalogs. Supports code, schematics, netlists, firmware images, configurations, and protocol captures. |
| `interface-contract` | interface-contract | requirements-document | `author-interface-contract` | Output format for interface contracts between two parties. Defines boundary resources, operating states, per-resource-per-state guarantees, consumer obligations, testable invariants, and failure modes. Domain-agnostic — works for hardware/firmware, service/service, library/consumer, and OS/driver boundaries. |
| `architecture-spec` | architecture-spec | — | `author-architecture-spec` | Architecture specification document with protocol/system description, network and software architecture, programming interfaces, persisted state, and cross-cutting implications (security, performance, management, observability, testing). |
| `structured-patch` | structured-patch | — | `collaborate-requirements-change`, `generate-spec-changes`, `generate-implementation-changes` | Traceable, structured patch format for incremental changes to existing artifacts. Each change entry links to its upstream motivation with Before/After content, traceability matrix, and invariant impact assessment. Domain-agnostic. |
| `presentation-kit` | presentation-kit | — | `author-presentation` | Output format for technical presentations. Produces a PowerPoint file via python-pptx, optional PDF export, embedded speaker notes, a presentation timeline, and an optional demo plan. All artifacts form a cohesive presentation kit. |

## Taxonomies

| Taxonomy | Domain | Used by | Description |
|----------|--------|---------|-------------|
| `stack-lifetime-hazards` | memory-safety | `investigate-bug`, `investigate-security`, `review-code` | Classification scheme (H1-H5) for stack lifetime and memory escape hazards at system boundaries. Covers stack address escape, async pend/complete lifetime violations, and writable views of read-only data. |
| `specification-drift` | specification-traceability | `audit-traceability`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `engineering-workflow`, `audit-spec-alignment`, `audit-implementation-alignment`, `spec-extraction-workflow`, `maintenance-workflow` | Classification scheme (D1-D16) for specification drift across requirements, design, validation, code, test, and integration artifacts. Covers untraced requirements, orphaned design decisions, assumption drift, coverage failures, code/test compliance gaps, and cross-component integration drift. |
| `cpp-review-patterns` | cpp-code-review | `review-cpp-code` | Classification scheme for C++ code review findings. Categorizes findings by pattern family (memory safety, concurrency, API design, performance, error handling, code clarity) with 19 labels and cross-references to analysis protocols. |
| `kernel-defect-categories` | kernel-correctness | `exhaustive-bug-hunt` | Classification scheme (K1-K14) for OS kernel and driver defects. Covers lock leaks, refcount imbalances, cleanup omissions, lifetime bugs, integer arithmetic errors, state machine races, accounting mismatches, and security boundary mistakes. |
| `protocol-change-categories` | protocol-engineering | `evolve-protocol` | Classification scheme (PC1-PC8) for protocol specification changes. Categorizes changes by impact on existing implementations and interoperability: editorial, clarification, backward-compatible extension, optional behavior change, state machine modification, message format change, security-impacting, and deprecation/removal. |

## Pipelines

### document-lifecycle

Full document lifecycle from requirements through validation. Each stage produces an artifact consumed by the next.

| Stage | Template | Consumes | Produces |
|-------|----------|----------|----------|
| 1 | `author-requirements-doc` | — | requirements-document |
| 2 | `author-design-doc` | requirements-document | design-document |
| 3 | `author-validation-plan` | requirements-document | validation-plan |
| 4 | `audit-traceability` | requirements-document, validation-plan | investigation-report |

### protocol-engineering

Protocol specification lifecycle from requirements extraction through evolution and validation. Stages after extraction can be used independently or sequentially.

| Stage | Template | Consumes | Produces |
|-------|----------|----------|----------|
| 1 | `extract-rfc-requirements` | — | requirements-document |
| 2 | `evolve-protocol` | — | protocol-delta |
| 3 | `author-protocol-validation` | — | protocol-validation-spec |
| 4 | `analyze-protocol-conflicts` | — | investigation-report |

### hardware-lifecycle

Full hardware design lifecycle from requirements through manufacturing. Interleaves generative design stages with adversarial audit stages. Stages consume the artifacts declared in their contracts and may be used independently or sequentially as those artifacts become available. Audit stages provide an independent review pass even when the preceding design stage includes a self-audit. The full workflow can also be run as a single interactive session using the hardware-design-workflow template.

| Stage | Template | Consumes | Produces |
|-------|----------|----------|----------|
| 1 | `author-requirements-doc` | — | requirements-document |
| 2 | `design-schematic` | — | artifact-set |
| 3 | `review-schematic` | requirements-document, artifact-set | investigation-report |
| 4 | `validate-simulation` | requirements-document | investigation-report |
| 5 | `review-bom` | requirements-document, artifact-set | investigation-report |
| 6 | `design-pcb-layout` | artifact-set | artifact-set |
| 7 | `review-layout` | requirements-document, artifact-set | investigation-report |
| 8 | `emit-manufacturing-artifacts` | artifact-set | artifact-set |

### engineering-workflow

Domain-agnostic incremental engineering workflow with human-in-the-loop review. Propagates changes through requirements, specifications, and implementation with adversarial audits at each transition. Phases can loop back based on audit verdicts or user feedback.

| Stage | Template | Consumes | Produces |
|-------|----------|----------|----------|
| 1 | `collaborate-requirements-change` | — | requirements-patch |
| 2 | `generate-spec-changes` | requirements-patch | spec-patch |
| 3 | `audit-spec-alignment` | requirements-patch, spec-patch | investigation-report |
| 4 | `generate-implementation-changes` | spec-patch | implementation-patch |
| 5 | `audit-implementation-alignment` | spec-patch, implementation-patch | investigation-report |

## Cross-Reference Index

### Which templates use a given protocol?

- **`adversarial-falsification`** → `exhaustive-bug-hunt`, `engineering-workflow`, `audit-spec-alignment`, `audit-implementation-alignment`, `spec-extraction-workflow`, `maintenance-workflow`
- **`anti-hallucination`** → `author-requirements-doc`, `author-architecture-spec`, `interactive-design`, `author-north-star`, `author-design-doc`, `author-validation-plan`, `reverse-engineer-requirements`, `audit-traceability`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `audit-spec-invariants`, `diff-specifications`, `author-interface-contract`, `audit-interface-contract`, `validate-budget`, `extract-rfc-requirements`, `reconcile-requirements`, `extract-invariants`, `author-rfc`, `author-presentation`, `author-implementation-prompt`, `author-test-prompt`, `author-workflow-prompts`, `investigate-bug`, `find-and-fix-bugs`, `fix-compiler-warnings`, `investigate-security`, `profile-session`, `classify-findings`, `review-code`, `review-cpp-code`, `exhaustive-bug-hunt`, `reconstruct-behavior`, `review-schematic`, `validate-simulation`, `review-bom`, `review-layout`, `audit-link-budget`, `review-enclosure`, `design-schematic`, `design-pcb-layout`, `emit-manufacturing-artifacts`, `hardware-design-workflow`, `discover-tests-for-changes`, `scaffold-test-project`, `plan-implementation`, `author-agent-instructions`, `extend-library`, `decompose-prompt`, `audit-library-consistency`, `audit-library-health`, `author-pipeline`, `triage-issues`, `triage-pull-requests`, `root-cause-ci-failure`, `author-release`, `review-infrastructure`, `generate-commit-message`, `evolve-protocol`, `analyze-protocol-conflicts`, `author-protocol-validation`, `engineering-workflow`, `collaborate-requirements-change`, `generate-spec-changes`, `generate-implementation-changes`, `audit-spec-alignment`, `audit-implementation-alignment`, `spec-extraction-workflow`, `maintenance-workflow`
- **`bom-consistency`** → `review-bom`
- **`change-propagation`** → `engineering-workflow`, `generate-spec-changes`, `generate-implementation-changes`, `maintenance-workflow`
- **`code-compliance-audit`** → `audit-code-compliance`, `engineering-workflow`, `audit-implementation-alignment`, `maintenance-workflow`
- **`compiler-diagnostics-cpp`** → `fix-compiler-warnings`
- **`component-selection`** → `design-schematic`, `hardware-design-workflow`
- **`component-selection-audit`** → `design-schematic`, `hardware-design-workflow`
- **`corpus-safety-audit`** → `audit-library-health`
- **`cpp-best-practices`** → `review-cpp-code`
- **`devops-platform-analysis`** → `author-pipeline`, `root-cause-ci-failure`
- **`enclosure-design-review`** → `review-enclosure`
- **`exhaustive-path-tracing`** → `exhaustive-bug-hunt`
- **`finding-classification`** → `classify-findings`
- **`integration-audit`** → `audit-integration-compliance`
- **`interface-contract-audit`** → `audit-interface-contract`
- **`invariant-extraction`** → `extract-invariants`, `reconstruct-behavior`
- **`iterative-refinement`** → `interactive-design`, `engineering-workflow`, `collaborate-requirements-change`, `spec-extraction-workflow`, `maintenance-workflow`
- **`kernel-correctness`** → —
- **`layout-design-review`** → `review-layout`, `design-pcb-layout`, `hardware-design-workflow`
- **`link-budget-audit`** → `audit-link-budget`
- **`manufacturing-artifact-generation`** → `emit-manufacturing-artifacts`, `hardware-design-workflow`
- **`memory-safety-c`** → `review-cpp-code`
- **`memory-safety-rust`** → —
- **`minimal-edit-discipline`** → `find-and-fix-bugs`, `fix-compiler-warnings`
- **`msvc-clang-portability`** → —
- **`operational-constraints`** → `reverse-engineer-requirements`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `author-presentation`, `investigate-bug`, `find-and-fix-bugs`, `fix-compiler-warnings`, `investigate-security`, `review-code`, `review-cpp-code`, `reconstruct-behavior`, `discover-tests-for-changes`, `audit-library-health`, `engineering-workflow`, `generate-implementation-changes`, `audit-implementation-alignment`, `spec-extraction-workflow`, `maintenance-workflow`
- **`pcb-layout-design`** → `design-pcb-layout`, `hardware-design-workflow`
- **`performance-critical-c-api`** → —
- **`presentation-design`** → `author-presentation`
- **`prompt-decomposition`** → `decompose-prompt`
- **`promptkit-design`** → `extend-library`
- **`protocol-conflict-analysis`** → `analyze-protocol-conflicts`
- **`protocol-evolution`** → `evolve-protocol`
- **`protocol-validation-design`** → `author-protocol-validation`
- **`quantitative-constraint-validation`** → `validate-budget`
- **`requirements-elicitation`** → `author-requirements-doc`, `interactive-design`, `hardware-design-workflow`, `engineering-workflow`, `collaborate-requirements-change`, `spec-extraction-workflow`
- **`requirements-from-implementation`** → `reverse-engineer-requirements`, `spec-extraction-workflow`
- **`requirements-reconciliation`** → `reconcile-requirements`
- **`rfc-extraction`** → `extract-rfc-requirements`
- **`root-cause-analysis`** → `investigate-bug`, `root-cause-ci-failure`
- **`schematic-compliance-audit`** → `review-schematic`, `design-schematic`, `hardware-design-workflow`
- **`schematic-design`** → `design-schematic`, `hardware-design-workflow`
- **`security-vulnerability`** → `investigate-security`, `review-infrastructure`
- **`self-verification`** → `author-requirements-doc`, `author-architecture-spec`, `interactive-design`, `author-north-star`, `author-design-doc`, `author-validation-plan`, `reverse-engineer-requirements`, `audit-traceability`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `audit-spec-invariants`, `diff-specifications`, `author-interface-contract`, `audit-interface-contract`, `validate-budget`, `extract-rfc-requirements`, `reconcile-requirements`, `extract-invariants`, `author-rfc`, `author-presentation`, `author-implementation-prompt`, `author-test-prompt`, `author-workflow-prompts`, `investigate-bug`, `find-and-fix-bugs`, `fix-compiler-warnings`, `investigate-security`, `profile-session`, `classify-findings`, `review-code`, `review-cpp-code`, `exhaustive-bug-hunt`, `reconstruct-behavior`, `review-schematic`, `validate-simulation`, `review-bom`, `review-layout`, `audit-link-budget`, `review-enclosure`, `design-schematic`, `design-pcb-layout`, `emit-manufacturing-artifacts`, `hardware-design-workflow`, `discover-tests-for-changes`, `scaffold-test-project`, `plan-implementation`, `author-agent-instructions`, `extend-library`, `decompose-prompt`, `audit-library-consistency`, `audit-library-health`, `author-pipeline`, `triage-issues`, `triage-pull-requests`, `root-cause-ci-failure`, `author-release`, `review-infrastructure`, `generate-commit-message`, `evolve-protocol`, `analyze-protocol-conflicts`, `author-protocol-validation`, `engineering-workflow`, `collaborate-requirements-change`, `generate-spec-changes`, `generate-implementation-changes`, `audit-spec-alignment`, `audit-implementation-alignment`, `spec-extraction-workflow`, `maintenance-workflow`
- **`session-profiling`** → `profile-session`
- **`simulation-validation`** → `validate-simulation`
- **`spec-evolution-diff`** → `diff-specifications`
- **`spec-invariant-audit`** → `audit-spec-invariants`
- **`step-retrospective`** → —
- **`test-compliance-audit`** → `audit-test-compliance`, `engineering-workflow`, `audit-implementation-alignment`, `maintenance-workflow`
- **`thread-safety`** → —
- **`traceability-audit`** → `audit-traceability`, `engineering-workflow`, `audit-spec-alignment`, `spec-extraction-workflow`, `maintenance-workflow`
- **`win32-api-conventions`** → —
- **`winrt-design-patterns`** → —
- **`workflow-arbitration`** → `author-workflow-prompts`

### Which templates use a given persona?

- **`devops-engineer`** → `author-pipeline`, `triage-issues`, `triage-pull-requests`, `root-cause-ci-failure`, `author-release`, `review-infrastructure`
- **`electrical-engineer`** → `review-schematic`, `validate-simulation`, `review-bom`, `review-layout`, `design-schematic`, `design-pcb-layout`, `emit-manufacturing-artifacts`, `hardware-design-workflow`
- **`embedded-firmware-engineer`** → —
- **`implementation-engineer`** → `author-implementation-prompt`
- **`mechanical-engineer`** → `review-enclosure`
- **`promptkit-contributor`** → `author-agent-instructions`, `extend-library`, `decompose-prompt`
- **`protocol-architect`** → `author-rfc`, `evolve-protocol`, `analyze-protocol-conflicts`, `author-protocol-validation`
- **`reverse-engineer`** → `reverse-engineer-requirements`, `reconstruct-behavior`
- **`rf-engineer`** → `audit-link-budget`
- **`security-auditor`** → `investigate-security`
- **`software-architect`** → `author-requirements-doc`, `author-architecture-spec`, `author-north-star`, `author-design-doc`, `plan-implementation`, `generate-commit-message`
- **`specification-analyst`** → `audit-traceability`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `diff-specifications`, `audit-interface-contract`, `validate-budget`, `extract-rfc-requirements`, `reconcile-requirements`, `extract-invariants`, `profile-session`, `audit-library-consistency`, `audit-library-health`, `audit-spec-alignment`, `audit-implementation-alignment`
- **`systems-engineer`** → `author-validation-plan`, `author-interface-contract`, `investigate-bug`, `find-and-fix-bugs`, `fix-compiler-warnings`, `classify-findings`, `review-code`, `review-cpp-code`, `exhaustive-bug-hunt`
- **`test-engineer`** → `author-test-prompt`, `discover-tests-for-changes`, `scaffold-test-project`
- **`workflow-arbiter`** → `author-workflow-prompts`

### Which templates use a given format?

- **`agent-instructions`** → `author-agent-instructions`
- **`agentic-workflow`** → —
- **`architecture-spec`** → `author-architecture-spec`
- **`behavioral-model`** → `reconstruct-behavior`
- **`copilot-prompt-file`** → —
- **`design-doc`** → `author-design-doc`
- **`exhaustive-review-report`** → `exhaustive-bug-hunt`
- **`implementation-plan`** → `scaffold-test-project`, `plan-implementation`
- **`interface-contract`** → `author-interface-contract`
- **`investigation-report`** → `audit-traceability`, `audit-code-compliance`, `audit-test-compliance`, `audit-integration-compliance`, `audit-spec-invariants`, `diff-specifications`, `audit-interface-contract`, `validate-budget`, `investigate-bug`, `find-and-fix-bugs`, `investigate-security`, `profile-session`, `review-code`, `review-cpp-code`, `review-schematic`, `validate-simulation`, `review-bom`, `review-layout`, `audit-link-budget`, `review-enclosure`, `audit-library-consistency`, `audit-library-health`, `root-cause-ci-failure`, `review-infrastructure`, `analyze-protocol-conflicts`, `audit-spec-alignment`, `audit-implementation-alignment`
- **`multi-artifact`** → `author-workflow-prompts`
- **`north-star-document`** → `author-north-star`
- **`pipeline-spec`** → `author-pipeline`
- **`presentation-kit`** → `author-presentation`
- **`promptkit-pull-request`** → `extend-library`, `decompose-prompt`
- **`protocol-delta`** → `evolve-protocol`
- **`protocol-validation-spec`** → `author-protocol-validation`
- **`release-notes`** → `author-release`
- **`requirements-doc`** → `author-requirements-doc`, `interactive-design`, `reverse-engineer-requirements`, `extract-rfc-requirements`, `reconcile-requirements`, `extract-invariants`, `author-implementation-prompt`
- **`rfc-document`** → `author-rfc`
- **`structured-findings`** → `fix-compiler-warnings`, `classify-findings`
- **`structured-patch`** → `collaborate-requirements-change`, `generate-spec-changes`, `generate-implementation-changes`
- **`triage-report`** → `discover-tests-for-changes`, `triage-issues`, `triage-pull-requests`
- **`validation-plan`** → `author-validation-plan`, `author-test-prompt`


