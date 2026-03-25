# PromptKit Execution Profiler (Issue #44)

The **PromptKit Profiler** is a React-based observability dashboard designed to transform unstructured LLM session logs into actionable engineering insights. It provides deep visibility into how the AI interprets and executes complex Java gRPC audits.

## ✨ Features

### 🔍 Epistemic Grounding Analysis

Visualizes the ratio of grounded facts versus reasoned inferences to ensure the audit remains tethered to the source code.

- **Grounded (Known)**: Verified code citations and direct state observations.
- **Reasoned (Inferred)**: Logical conclusions drawn from concurrency patterns.

### 🚨 Risk Hotspot Mapping

Aggregates detected defects by severity to prioritize remediation efforts for high-concurrency systems.

- **Critical**: Identified thread-safety violations such as TOCTOU races and missing cancel-handler cleanups.
- **High/Medium**: Allocation patterns causing GC pressure or unguarded error paths.

## 🚀 Quick Start

1. **Generate Log**: Run your audit with the GitHub CLI:
   `gh copilot -p "Read and execute assembled-prompt.md" | Tee-Object -FilePath grpc-audit.log`
2. **Launch UI**: Run `npm run dev` in `/tools/profiler-ui`.
3. **Analyze**: Upload `grpc-audit.log` to see the live data breakdown.

## 🛠️ Built With

- **React / Next.js**: Component architecture.
- **Recharts**: High-performance SVG data visualization.
- **Tailwind CSS**: Professional-grade utility styling.

---

_Developed as part of the PromptKit library contribution for Issue #44._
