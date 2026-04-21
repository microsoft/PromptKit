<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: investigate-trace
description: >
  Systematically investigate a performance, power, or behavioral issue
  using profiling traces, ETW/ETL captures, or telemetry data. Apply
  root cause analysis with iterative deepening and produce an
  investigation report.
persona: systems-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - reasoning/root-cause-analysis
format: investigation-report
params:
  problem_description: "Natural language description of the issue under investigation"
  trace_context: "Trace capture method, providers/profiles used, and analysis tool capabilities"
  environment: "OS, hardware, workload scenario, and capture conditions"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    A structured investigation report with findings, root cause analysis,
    evidence from trace data, and remediation plan.
---

# Task: Investigate Trace

You are tasked with investigating a performance, power, or behavioral issue
using profiling trace data and producing a structured investigation report.

## Inputs

**Problem Description**:
{{problem_description}}

**Trace / Telemetry Context**:
{{trace_context}}

**Environment**:
{{environment}}

## Instructions

1. **Apply the root-cause-analysis protocol** systematically:
   - Characterize the symptom precisely
   - Generate 3–5 competing hypotheses before investigating any
   - Evaluate evidence for each hypothesis
   - Apply iterative deepening (Phase 3a): broad survey → attribution →
     deep analysis → cross-component tracing
   - Apply cross-component causal chain analysis (Phase 4a) when
     multiple processes or components are involved
   - Identify the root cause, not just the proximate trigger

2. **Apply the anti-hallucination protocol** throughout:
   - Base analysis ONLY on the provided trace data and context
   - Direct observations from trace queries (metrics, measurements,
     counters) have implicit KNOWN status
   - Causal explanations and correlations MUST be explicitly labeled
     as INFERRED or ASSUMED
   - If you cannot determine the root cause from the available data,
     say so and describe exactly what additional traces or data
     categories are needed
   - Do NOT fabricate process names, PIDs, metric values, or trace
     events that are not evidenced in the provided data

3. **Format the output** according to the investigation-report format
   specification. **Use the full investigation report format** (all 8
   sections). Root cause investigation requires the causal chain,
   prevention, and open questions sections — do not use the abbreviated
   format.

4. **Call stack analysis is primary** — not optional:
   - For each top contributor identified in the broad survey, obtain
     call stacks grouped by process and thread
   - Identify the dominant call chains — these reveal the actual
     workload (e.g., file scanning vs. idle polling vs. network
     inspection vs. background sync)
   - Module-level attribution only tells you *where* — call stacks
     tell you *why*. Do NOT stop at module-level attribution.
   - When call stacks are unavailable, state this as a limitation and
     describe what the stacks would have revealed

5. **Energy-vs-metric divergence analysis**:
   - Compare each process's CPU sample percentage against its energy
     estimation percentage (or equivalent resource metric)
   - Processes with disproportionately high energy relative to CPU
     time indicate frequent wake/sleep patterns that prevent deep
     idle states — these are often worse for battery life than
     processes with high sustained CPU
   - Flag any process where the energy-to-CPU ratio exceeds 3:1 as
     a high-priority finding

6. **Cross-process amplification analysis**:
   - Analyze whether background processes amplify each other's impact
   - A file write by Process A may trigger scans by Process B,
     hashing by Process C, and network inspection by Process D
   - Trace these causal chains across process boundaries
   - Document the full amplification cascade:
     `Trigger → Reactor₁ → Reactor₂ → ... → Observed symptom`
   - This "amplification cascade" is often the true root cause of
     death-by-a-thousand-cuts performance or power drain

7. **Apply the self-verification protocol** before finalizing:
   - Sample at least 3–5 specific findings and re-verify against
     the trace data
   - Ensure every causal claim is labeled INFERRED or ASSUMED
   - Confirm coverage: state what data categories were examined and
     what was not

8. **Apply the operational-constraints protocol** when working with
   the trace:
   - Scope by data categories and time ranges before querying
   - Prefer deterministic methods (structured queries, aggregations)
   - Document your query strategy for reproducibility
   - Retrieve summary data first, drill into detail only for top
     contributors

9. **Remediation must be specific**:
   - Provide concrete fix recommendations (e.g., specific registry
     keys, power settings, driver configuration, scheduled task
     changes, service configuration, `powercfg` commands), not
     vague advice
   - Assess the risk of each proposed fix
   - Identify monitoring or alerting that would have caught this
     earlier
   - Suggest defensive measures to prevent recurrence

## Analysis Steps

Process the trace systematically using iterative deepening:

1. **Process the trace** with relevant data categories (e.g., CPU
   sampling, energy estimation, disk I/O, processor frequency,
   interrupt handling, processor idle states, device power state,
   process metadata, services)
2. **Broad survey**: Query top consumers by primary metric (CPU
   samples, energy estimation, disk I/O bytes) grouped by process.
   Rank by impact.
3. **Call stack analysis**: For the top 5–10 consumers, obtain call
   stacks. Identify dominant call chains to understand *what* each
   process was actually doing.
4. **Divergence check**: Compare CPU percentage vs. energy percentage
   for each top consumer. Flag disproportionate energy consumers.
5. **Cross-process tracing**: Identify amplification cascades where
   one process's activity triggers work in others.
6. **Supplementary analysis**: Check for:
   - Timer resolution requests preventing deep idle states
   - Interrupt/DPC activity and wake sources
   - Disk I/O patterns during expected-idle periods
   - Power state transitions and frequency scaling
   - Background service and scheduled task activity
   - Network-related wake events
7. **Synthesize**: Combine all layers into a coherent root cause
   analysis with causal chains.

## Non-Goals

Explicitly define what is OUT OF SCOPE for this investigation.
State each non-goal clearly so the investigation does not expand
beyond its intended boundaries. Examples:

- Do NOT investigate application-level bugs in the processes found —
  only identify them as contributors and recommend actions.
- Do NOT attempt to modify system configuration directly — only
  recommend changes.
- Do NOT investigate hardware defects (e.g., battery health,
  component failures).

Adjust these non-goals based on the specific investigation context
provided in {{problem_description}}.

## Investigation Plan

Before beginning analysis, produce a concrete step-by-step plan
tailored to this specific investigation. The plan should:

1. **Identify data categories**: Which trace data categories are
   relevant to this investigation?
2. **Define time ranges**: What time periods are relevant (idle
   periods, workload periods, transitions)?
3. **Enumerate metrics**: What metrics will be queried at each
   iterative deepening layer?
4. **Plan cross-process analysis**: Which processes are likely
   to interact, and what causal chains should be checked?
5. **Report**: Produce the output according to the specified format.

This plan replaces ad-hoc exploration with systematic analysis.

## Quality Checklist

Before finalizing, verify:

- [ ] Every finding cites specific evidence from the trace (process
      name, PID, metric values, timestamps, call stacks)
- [ ] Every finding has a severity rating with justification
- [ ] Root cause is identified, not just the proximate trigger
- [ ] Iterative deepening completed: broad survey → module → stack →
      cross-process for at least the top 5 contributors
- [ ] Energy-vs-CPU divergence checked for all top consumers
- [ ] Cross-process amplification cascades documented where present
- [ ] Remediation recommendations are specific and actionable
- [ ] At least 3 findings have been re-verified against the trace data
- [ ] Coverage statement documents what data categories were and were
      not examined
- [ ] No fabricated process names, PIDs, or metric values — unknowns
      marked with [UNKNOWN]
