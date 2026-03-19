# Testing Guide

PromptKit uses a **reference comparison methodology** to test prompt
quality. This guide walks through the practical steps of creating reference
prompts, running comparisons, and feeding gaps back into the library.

For the full specification, see [TESTING.md](../TESTING.md).

## Why Reference Comparison?

Traditional testing (unit tests, integration tests) doesn't work for
prompts because LLM output is non-deterministic. Instead, we test the
**prompt structure** — comparing what PromptKit generates against
hand-crafted reference prompts that are known to produce excellent results.

This works because PromptKit's composition model is deterministic: the
same template with the same parameters always produces the same prompt.
When a gap appears in the generated prompt, it maps directly to a specific
component (persona, protocol, format, or template) that needs improvement.

## Directory Structure

```
tests/
├── references/                          # Hand-crafted reference prompts
│   ├── investigate-stack-corruption.txt
│   ├── author-auth-requirements.txt
│   └── review-c-networking-code.txt
│
└── generated/                           # PromptKit-generated (gitignored)
    ├── investigate-stack-corruption.md
    ├── author-auth-requirements.md
    └── review-c-networking-code.md
```

- `tests/references/` — version-controlled, hand-crafted prompts
- `tests/generated/` — gitignored, regenerated from PromptKit for comparison

## Step 1: Create a Reference Prompt

Write a high-quality prompt for a specific task by hand. This is your
"known-good" — a prompt you've battle-tested and know produces excellent
LLM output.

**Reference prompt characteristics:**
- Task-specific (written for a concrete problem, not generic)
- Battle-tested (produced excellent results in practice)
- Complete (all context, constraints, deliverables included)

Save it to `tests/references/<descriptive-name>.txt`.

**Example:** A prompt you used to investigate a stack corruption bug,
including persona instructions, reasoning methodology, output format
expectations, and the specific problem context.

## Step 2: Generate the PromptKit Version

Use PromptKit to generate a prompt for the same task:

```bash
npx @alan-jowett/promptkit assemble investigate-bug \
  -p problem_description="Stack corruption when processing network packets" \
  -p code_context="See packet_handler.c lines 200-350" \
  -p environment="Linux x86_64, gcc 12, valgrind" \
  -o tests/generated/investigate-stack-corruption.md
```

## Step 3: Structured Gap Analysis

Compare the reference and generated prompts across five dimensions. For each
dimension, classify coverage as ✅ Covered, ⚠️ Partial, or ❌ Missing.

### Dimension 1: Task Framing

| Check | Question |
|-------|----------|
| Goal statement | Is the objective clearly stated? |
| Success criteria | Are concrete deliverables defined? |
| Non-goals | Is scope explicitly bounded (what NOT to do)? |
| Context definition | Are domain terms and boundaries defined? |

### Dimension 2: Reasoning Methodology

| Check | Question |
|-------|----------|
| Reasoning protocol | Is a systematic analysis method prescribed? |
| Hypothesis generation | Does it require multiple hypotheses before investigating? |
| Evidence requirements | Must claims be backed by citations or code? |
| Anti-hallucination | Are fabrication guardrails present? |

### Dimension 3: Output Specification

| Check | Question |
|-------|----------|
| Output format | Is the expected output structure defined? |
| Deliverable artifacts | Are specific files/documents listed? |
| Classification scheme | Is a domain-specific taxonomy provided? |
| Severity/ranking | Are prioritization criteria defined? |

### Dimension 4: Operational Guidance

| Check | Question |
|-------|----------|
| Scoping strategy | Does it tell the LLM how to scope its work? |
| Tool usage | Does it guide how to use available tools? |
| Step-by-step plan | Is a concrete procedural plan provided? |
| Parallelization | Does it suggest how to split work? |

### Dimension 5: Quality Assurance

| Check | Question |
|-------|----------|
| Self-verification | Must the LLM verify its own output? |
| Sampling checks | Must specific items be spot-checked? |
| Coverage statement | Must the LLM document what it examined? |
| Consistency check | Must findings be internally consistent? |

## Step 4: Write a Gap Report

Use this template:

```markdown
# Prompt Test Report: <task name>

## Reference: tests/references/<name>.txt
## Generated: tests/generated/<name>.md

## Gap Summary
| Dimension              | Score     | Critical Gaps                          |
|------------------------|-----------|----------------------------------------|
| Task Framing           | ✅ / ⚠️ / ❌ | Description of gaps                  |
| Reasoning Methodology  | ✅ / ⚠️ / ❌ | Description of gaps                  |
| Output Specification   | ✅ / ⚠️ / ❌ | Description of gaps                  |
| Operational Guidance   | ✅ / ⚠️ / ❌ | Description of gaps                  |
| Quality Assurance      | ✅ / ⚠️ / ❌ | Description of gaps                  |

## Detailed Gaps

### Gap 1: <description>
- **Reference has:** …
- **Generated has:** …
- **Impact:** What is lost without this?
- **Fix:** Which component to update (persona, protocol, format, template)
```

## Step 5: Feed Gaps Back

Each gap maps to a specific component improvement:

| Gap Type | Fix Location |
|----------|-------------|
| Missing reasoning methodology | Add or improve a protocol |
| Weak identity/expertise | Update the persona |
| Missing output sections | Update the format |
| Missing task instructions | Update the template |
| Missing guardrails | Add or update a guardrail protocol |

Create an issue or PR for each substantive gap, referencing the gap report.

## Regression Testing

When modifying existing components, re-run all reference comparisons:

1. Regenerate all prompts in `tests/generated/`
2. Re-run gap analysis for each
3. Verify:
   - Previously-covered dimensions remain covered
   - No new gaps introduced
   - Overall quality score improves or stays constant

## Automated Gap Analysis

You can use an LLM to perform Step 3 automatically. Feed it both prompts
with this instruction:

> Compare the reference prompt and the generated prompt across these five
> dimensions: Task Framing, Reasoning Methodology, Output Specification,
> Operational Guidance, Quality Assurance. For each dimension, classify
> coverage as ✅ Covered, ⚠️ Partial, or ❌ Missing. List specific gaps
> with impact and suggested fixes.

This is useful for batch-testing across many reference prompts.

## Example Workflow

```bash
# 1. Generate the PromptKit version
npx @alan-jowett/promptkit assemble review-code \
  -p code_to_review="networking stack in src/net/" \
  -p review_focus="Memory safety and error handling" \
  -p context="C codebase, Linux kernel-style conventions" \
  -o tests/generated/review-c-networking-code.md

# 2. Compare against reference
# (manual or LLM-assisted comparison)
diff tests/references/review-c-networking-code.txt \
     tests/generated/review-c-networking-code.md

# 3. Write gap report, file issues for substantive gaps

# 4. Fix components, re-run, verify gaps are closed
```
