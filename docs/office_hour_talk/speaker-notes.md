# Speaker Notes — Introduction to Structured Prompts with PromptKit

## Slide 1: Introduction to Structured Prompts with PromptKit
**Time**: 0:30 | **Cumulative**: 0:30

Welcome everyone. I'm Alan Jowett, and today I want to talk about something I think is going to change how we work with AI tools — structured, engineered prompts.

**Key point to emphasize**: Set the tone — this is practical, not theoretical.

---

## Slide 2: The Most Important Code You're Not Engineering
**Time**: 1:30 | **Cumulative**: 2:00

Think about the last time you used an AI tool — Copilot, ChatGPT, Claude. How much of the result quality came from the prompt you wrote? Probably most of it. Now think about how much engineering rigor you put into that prompt versus the code you wrote afterward. There's a huge gap. We version-control our code. We review it. We test it. But the prompts that drive our AI-assisted engineering? They're throwaway artifacts — copy-pasted, tweaked, and forgotten. Today I want to show you how to close that gap.

**Key point to emphasize**: The disconnect between how much prompts matter and how little rigor we apply to them.

**Transition**: "Let me show you specifically why this matters..."

---

## Slide 3: Why Ad-Hoc Prompting Fails at Scale
**Time**: 2:00 | **Cumulative**: 4:00

Here's the fundamental problem. LLMs are non-deterministic — you give the same prompt twice, you might get different results. But we make it worse by not applying any engineering discipline. Prompts aren't in source control. We don't test them. We don't share them. When someone on your team discovers a great prompt for code review, how does the rest of the team benefit? Usually, they don't. They write their own version from scratch. And when an LLM hallucinates or misses something critical, we blame the model. But often, the prompt was the problem.

**Key point to emphasize**: The five failure modes — make them feel each one.

**Transition**: "So what's the alternative?"

---

## Slide 4: What If Prompts Were Engineered Artifacts?
**Time**: 1:30 | **Cumulative**: 5:30

What if we treated prompts the way we treat code? What if they lived in Git, were composed from tested modules, and could be improved systematically? That's the thesis behind PromptKit. It's an open-source library — MIT licensed — that gives you composable, version-controlled prompt components. You don't write prompts from scratch. You compose them from proven building blocks. Let me show you how.

**Key point to emphasize**: "This is what PromptKit does." — pause for effect.

**Transition**: "Let me walk you through the architecture."

---

## Slide 5: Part 1 — How PromptKit Works
**Time**: 0:15 | **Cumulative**: 5:45

Let's start with the architecture — how PromptKit is structured and how the pieces fit together.

---

## Slide 6: Five Composable Layers
**Time**: 2:30 | **Cumulative**: 8:15

PromptKit has five composable layers. At the bottom, a Persona defines who the LLM is — its expertise, its tone, its behavioral constraints. Think of it as the LLM's job title and background. Protocols define how the LLM reasons — systematic methodologies like root-cause analysis, anti-hallucination guardrails, memory safety checks. Formats define what the output looks like — the structure and sections the LLM must produce. Taxonomies provide classification schemes for specific domains. And Templates are the task itself — they compose all the other layers and include task-specific instructions. Each layer is a separate Markdown file that can be mixed and matched.

**Key point to emphasize**: Each layer is a separate file — compose by reference, not copy-paste. This is the modularity that makes it work.

**Transition**: "Let me walk through each layer with examples."

---

## Slide 7: Layer 1 — Personas
**Time**: 1:30 | **Cumulative**: 9:45

The first layer is personas. A persona tells the LLM who it is — not just a name, but deep domain expertise, how it should approach problems, and what tone to use. We have 15 built-in personas covering software engineering, hardware design, embedded firmware, protocol engineering, and more. When you tell an LLM it's a senior systems engineer with deep expertise in memory management and concurrency, it reasons differently than when it's a generic assistant. And these aren't just one-liner descriptions — they're detailed behavioral specifications.

**Key point to emphasize**: Personas are *behavioral specifications*, not just job titles.

**Transition**: "Personas define who. Protocols define how..."

---

## Slide 8: Layer 2 — Protocols
**Time**: 1:30 | **Cumulative**: 11:15

Protocols are where the real power is. They define how the LLM reasons — not just "think step by step," but detailed, multi-phase methodologies. There are three categories. Guardrails are cross-cutting safety protocols — anti-hallucination prevents fabrication, self-verification makes the LLM check its own work. Analysis protocols are domain-specific — memory safety for C, thread safety, security vulnerabilities, even schematic compliance for hardware. Reasoning protocols are systematic approaches — root-cause analysis with hypothesis generation, requirements elicitation, traceability audits. I'll spotlight two of these in detail shortly.

**Key point to emphasize**: 48 protocols — this is the depth that makes PromptKit different from a one-liner system prompt.

**Transition**: "Protocols and personas define the reasoning. Formats and taxonomies define the output..."

---

## Slide 9: Layers 3 & 4 — Formats and Taxonomies
**Time**: 1:00 | **Cumulative**: 12:15

Formats define what the output looks like. When you ask an LLM to investigate a bug, PromptKit ensures the output has specific sections — findings, root cause analysis, evidence, remediation plan — not just a wall of text. We have 21 formats for everything from investigation reports to design documents to presentation kits. In fact, this very presentation was designed using PromptKit's author-presentation template. Taxonomies provide classification labels. When a protocol finds an issue, it classifies it using a defined scheme — D1 through D16 for specification drift, for example. This makes findings actionable and comparable across reviews.

**Key point to emphasize**: "This presentation was built with PromptKit" — meta moment, gets a reaction.

**Transition**: "Now let's see how these layers come together in a template."

---

## Slide 10: Layer 5 — Templates
**Time**: 1:30 | **Cumulative**: 13:45

Templates are the orchestration layer. Each template composes the other four layers using YAML frontmatter. This example — investigate-bug — says: use the systems-engineer persona, apply anti-hallucination guardrails, self-verification, and root-cause analysis protocols, and output an investigation report. The parameters are what you provide — the problem description and code context. Everything else is standardized. And because templates declare what they produce and consume, they can be chained into pipelines — the output of one becomes the input of the next.

**Key point to emphasize**: YAML frontmatter is the composition mechanism. Simple, declarative, version-controllable.

**Transition**: "So what does the final assembled prompt actually look like?"

---

## Slide 11: How Components Snap Together
**Time**: 2:00 | **Cumulative**: 15:45

Here's what the assembled prompt actually looks like. PromptKit reads each component file and includes its full body text verbatim — no summarization, no abbreviation. The identity section comes from the persona file. The reasoning protocols section includes every phase and sub-step from each protocol. The output format section defines the required structure. And the task section is the template with your parameters filled in. The result is a single, coherent Markdown document that you can paste into any LLM session. The key point: because every component is included verbatim, the LLM gets the full reasoning methodology — not a watered-down summary.

**Key point to emphasize**: Verbatim inclusion — nothing is summarized or lost.

**Transition**: "Now let me zoom in on two protocols to show you the kind of reasoning discipline PromptKit enforces."

---

## Slide 12: Part 2 — Protocol Spotlights
**Time**: 0:15 | **Cumulative**: 16:00

Now let me zoom in on two protocols to show you the kind of reasoning discipline PromptKit enforces.

---

## Slide 13: Anti-Hallucination Protocol
**Time**: 2:30 | **Cumulative**: 18:30

The anti-hallucination protocol is probably the most impactful single component in PromptKit. It enforces epistemic honesty. Every claim the LLM makes must be labeled — is this directly known from the context I provided? Is it inferred, and if so, show me the reasoning chain? Or is it an assumption — and if so, flag it explicitly. The protocol also forbids fabrication. If the LLM doesn't know a function name, it writes UNKNOWN instead of making something up. If there are multiple interpretations, it must list them all instead of picking one silently. And there's a hard trigger: if more than 30% of the output is assumptions, the LLM must stop and ask for more context. This single protocol eliminates the majority of hallucination issues.

**Key point to emphasize**: The 30% threshold — a hard trigger that forces the LLM to ask for more context instead of guessing.

PAUSE — ask: "How many of you have had an LLM confidently make up a function name that doesn't exist?"

**Transition**: "That's a guardrail protocol. Let me show you a reasoning protocol..."

---

## Slide 14: Root-Cause Analysis Protocol
**Time**: 2:00 | **Cumulative**: 20:30

The root-cause analysis protocol shows what structured reasoning looks like in practice. It's a 5-phase methodology. Phase 1 forces the LLM to precisely characterize the symptom before jumping to conclusions — what's the expected behavior, under what conditions does it fail, what's affected and what isn't. Phase 2 is critical — generate at least three hypotheses before investigating any of them, including at least one non-obvious hypothesis. This prevents anchoring bias. Phase 3 gathers evidence to confirm or eliminate each hypothesis. Phase 4 makes a crucial distinction — the proximate cause versus the root cause. A null pointer dereference is the proximate cause. The missing error handling that left the pointer uninitialized is the root cause. Phase 5 ensures the fix addresses the root cause and proposes preventive measures.

**Key point to emphasize**: "Generate >= 3 hypotheses before investigating ANY of them" — this is the key anti-anchoring rule.

**Transition**: "Now that you've seen the building blocks and how the reasoning protocols work, let's talk about the breadth of what you can do."

---

## Slide 15: Part 3 — What Can You Do With PromptKit?
**Time**: 0:15 | **Cumulative**: 20:45

Now that you've seen the building blocks and how the reasoning protocols work, let's talk about the breadth of what you can do with these components.

---

## Slide 16: 157 Components Across 6 Domains
**Time**: 1:30 | **Cumulative**: 22:15

PromptKit isn't just for software. It covers six engineering domains — software, hardware and electrical engineering, embedded firmware, protocol engineering, specification analysis, and DevOps. 157 components total. You can review C++ code, audit a schematic against requirements, investigate a CI failure, author an RFC, or triage pull requests — all with the same structured, composable approach. And because every template declares what it produces and consumes, they chain together into pipelines.

**Key point to emphasize**: The breadth — this is not a one-trick tool.

**Transition**: "And these templates chain together into a full engineering lifecycle..."

---

## Slide 17: The Engineering Lifecycle
**Time**: 2:00 | **Cumulative**: 24:15

The three lifecycle workflows are where everything comes together. Bootstrap scans any existing repository and extracts structured specifications — requirements, design, validation — from the code that's already there. You don't need to start from scratch. Evolve takes a requirements change and propagates it through every layer — specs, implementation, tests — with adversarial audits at each transition to catch inconsistencies before they ship. Maintain runs periodically to detect drift — where have the code and specs diverged? — and generates corrective patches. It's a continuous cycle. When maintain detects drift, it loops back to bootstrap. These are interactive workflows — they run in your LLM session and guide you through structured phases.

**Key point to emphasize**: "You don't need to start from scratch" — Bootstrap works on existing codebases.

**Transition**: "Let me show you what this looks like in practice with a real case study."

---

## Slide 18: Part 4 — Case Study
**Time**: 0:15 | **Cumulative**: 24:30

Let me tell you a real story about what PromptKit found in production.

---

## Slide 19: IoT Protocol Crypto Migration
**Time**: 1:30 | **Cumulative**: 26:00

Here's a real case study. Sonde is a production IoT runtime with over 260 requirements across 15 specification documents. The task was to replace the gateway's encryption scheme — moving from asymmetric key-pair pairing to AES-256-GCM with a pre-shared key. This affected every radio frame in the protocol. We used PromptKit's engineering workflow — 8 phases, from requirements discovery through implementation with adversarial audits at every transition. Right in Phase 1, the automated analysis discovered that the initial understanding of the crypto model was fundamentally wrong. The scope was far larger than originally estimated.

**Key point to emphasize**: Phase 1 catching a fundamental misunderstanding — this is what structured analysis does.

**Transition**: "But the most dramatic finding came in round 5..."

---

## Slide 20: Nonce Reuse Vulnerability
**Time**: 2:00 | **Cumulative**: 28:00

In round 5 of the automated specification review, PromptKit's adversarial analysis caught a critical vulnerability. The GCM nonce construction didn't include the message type. This meant a request and a response using the same pre-shared key could end up with the same nonce value. For AES-GCM, nonce reuse is catastrophic — it breaks the authentication guarantees entirely. The fix was straightforward: include the message type in the nonce construction. But here's the key insight — this finding survived six rounds of human review. Domain experts looked at this specification multiple times and didn't catch it. The structured, adversarial prompt did.

**Key point to emphasize**: "Survived 6 rounds of human review" — pause and let that sink in.

**Transition**: "So what's the lesson here?"

---

## Slide 21: What the Case Study Tells Us
**Time**: 1:30 | **Cumulative**: 29:30

The full migration resulted in 28 modified, 16 retired, and 8 new requirements across 9 specification documents. PromptKit caught a genuine cryptographic vulnerability that human experts missed repeatedly. But it's not a replacement for human judgment. In Phase 7, user review caught a frame ownership design error that all the automated review missed — the phone generates the PEER_REQUEST ESP-NOW frame, and the node is a pure relay. Only domain knowledge could catch that. The lesson: structured prompts amplify human expertise. They catch what humans miss, and humans catch what automation misses. Together, they're more reliable than either alone.

**Key point to emphasize**: "Structured prompts + human judgment > either alone" — this is the thesis of the talk, proven.

**Transition**: "Now let me show you PromptKit in action."

---

## Slide 22: Part 5 — Live Demo
**Time**: 0:15 | **Cumulative**: 29:45

Let's see PromptKit in action.

---

## Slide 23: Demo — Bootstrapping a Prompt
**Time**: 5:00 | **Cumulative**: 34:45

[Switch to terminal] Let me show you how this works in practice. I'm going to launch PromptKit and walk through an interactive session. Watch how it selects components, composes them, and produces a structured prompt.

**Key point to emphasize**: The interactive flow — the LLM selects components for you based on what you need.

---

## Slide 23b: Demo Fallback
**Time**: (only if demo fails)

[Use this slide if the demo fails] Here's what an assembled prompt looks like. Notice how every component is included in full — the persona text, every phase of every protocol, the format rules, and the task with parameters filled in. This is a single document you can paste into any LLM session.

---

## Slide 24: Part 6 — Getting Started
**Time**: 0:15 | **Cumulative**: 35:00

So how do you actually start using this?

---

## Slide 25: Three Ways to Use PromptKit
**Time**: 1:30 | **Cumulative**: 36:30

There are three ways to get started. The easiest is npx — you don't even need to clone the repo. Just run npx @alan-jowett/promptkit and it launches an interactive session. It auto-detects whether you're using GitHub Copilot or Claude Code. If you want full access to all the component files, clone the repo and point your LLM CLI at bootstrap.md. And if you're not using a CLI tool, you can paste the bootstrap prompt and manifest into any LLM session — ChatGPT, Claude, whatever — and follow the interactive flow. It works everywhere.

**Key point to emphasize**: "npx — no clone needed" — lowest barrier to entry.

**Transition**: "And if you want something more permanent..."

---

## Slide 26: Persistent Agent Instructions
**Time**: 1:30 | **Cumulative**: 38:00

Beyond one-off prompts, PromptKit can produce persistent instruction files. For GitHub Copilot, these are composable skill files under .github/instructions — each with a description and file-targeting via applyTo globs. For Claude Code, it produces a CLAUDE.md file. For Cursor, a .cursorrules file. These go into your repository. Every engineer on your team gets the same AI behavior. If your team decides that C code should always be reviewed for memory safety, that becomes a version-controlled skill file — not tribal knowledge.

**Key point to emphasize**: "Commit to your repo" — persistent, team-wide, version-controlled.

**Transition**: "Let me wrap up with the key takeaways."

---

## Slide 27: Key Takeaways
**Time**: 1:30 | **Cumulative**: 39:30

Let me leave you with five takeaways. First, prompts are code. Treat them that way. Second, compose from proven components instead of writing from scratch. Third, structured reasoning protocols bound the non-determinism inherent in LLMs — they won't eliminate it, but they make outputs dramatically more reliable. Fourth, test your prompts — PromptKit supports reference comparison testing. And fifth, structured prompts and human judgment are complementary. The nonce-reuse case study proves it — automation caught what humans missed, and humans caught what automation missed.

**Key point to emphasize**: Read each takeaway slowly — let them land.

**Transition**: "Here's where to find everything."

---

## Slide 28: Get Started with PromptKit
**Time**: 1:00 | **Cumulative**: 40:30

PromptKit is open source under MIT license. You can find it at aka.ms/PromptKit or install it with npx. The full repository has 157 components across 6 engineering domains. I encourage you to try it on your next task — whether that's investigating a bug, reviewing code, or writing a requirements document. Thank you! I'm happy to take questions.

**Key point to emphasize**: "Try it on your next task" — the call to action.
