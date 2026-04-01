<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: presentation-design
type: reasoning
description: >
  Systematic reasoning protocol for designing technical presentations.
  Covers audience analysis, narrative arc construction, slide
  decomposition, visual design decisions, time budgeting, and
  demo choreography. Domain-agnostic.
applicable_to:
  - author-presentation
---

# Protocol: Presentation Design

Apply this protocol when designing a technical presentation from source
material. Execute all phases in order. Each phase produces structured
decisions that feed into subsequent phases.

## Phase 1: Audience Analysis

Before designing any content, characterize the audience:

1. **Expertise level**: What does the audience already know about this
   topic? Distinguish between domain expertise (they know the field)
   and topic expertise (they know this specific work).
2. **Expectations**: What does the audience expect to leave with?
   A decision? Understanding? Inspiration? Action items?
3. **Decision-making power**: Can this audience approve, fund, or
   act on the content? Or are they peers/learners?
4. **Attention constraints**: Is this a keynote (high energy, broad),
   a working session (deep, interactive), or a status update
   (concise, data-driven)?
5. **Prior context**: What has the audience already seen or read
   about this topic? What can be assumed vs. must be established?

**Output**: A 3–5 sentence audience profile that informs all
subsequent design decisions.

## Phase 2: Narrative Arc Design

Structure the presentation as a story, not a topic list:

1. **Hook** (first 60–90 seconds): What grabs attention? Options:
   - A surprising fact or metric from the source material
   - A problem the audience personally experiences
   - A provocative question
   - A brief demo or visual
2. **Problem statement**: What challenge, gap, or opportunity does
   this presentation address? Make the audience feel the problem
   before presenting solutions.
3. **Evidence / solution body**: The core content. Structure as:
   - **Chronological**: How we got here → where we are → where we're going
   - **Problem/solution pairs**: Each problem followed by its resolution
   - **Thesis/evidence**: Central claim supported by multiple evidence threads
   - **Comparison**: Option A vs. Option B with tradeoff analysis
   Choose the structure that best serves the audience profile from Phase 1.
4. **Key takeaways**: 2–4 concrete points the audience should remember.
   These must be statable in one sentence each.
5. **Call to action**: What should the audience do after this
   presentation? Be specific: "approve X", "try Y", "review Z".

**Output**: A narrative outline with the chosen structure and
rationale for why it suits this audience and content.

## Phase 3: Slide Decomposition

Transform the narrative arc into individual slides:

1. **One key message per slide**: Each slide communicates exactly
   one idea. If a slide has two messages, split it.
2. **Slide type classification**: Classify each slide as one of:
   - **Title**: Presentation title, speaker, date
   - **Section divider**: Marks a new section with a section title
   - **Content**: Text with an optional supporting visual
   - **Diagram**: Architecture, flow, or process diagram
   - **Data**: Chart, graph, table, or metric
   - **Code**: Code snippet or pseudocode
   - **Comparison**: Side-by-side options, before/after
   - **Quote / callout**: Highlighted quote or key statement
   - **Demo transition**: Slide before or after a live demo
   - **Summary**: Recap of key points
   - **Closing**: Final slide with contact, Q&A, or call to action
3. **Slide ordering**: Arrange slides to follow the narrative arc.
   Verify each slide leads logically to the next.
4. **Density check**: For a typical technical audience:
   - Target **1–2 minutes per slide** for content slides
   - Target **10–20 words of body text** per slide (not counting
     titles or speaker notes)
   - If a slide has more than 5 bullet points, decompose it
   - **Line budget**: A standard content textbox fits ~13 lines at
     18pt font with 8pt spacing. Plan content to stay within this
     budget. If a slide needs more, split it into two slides during
     planning — do not rely on font reduction at render time.
   - **No empty-line spacers**: Do not plan for blank lines between
     bullet groups. Use paragraph spacing instead.
5. **Transition logic**: For each slide, note what connects it to
   the next. If no logical connection exists, the ordering is wrong
   or a bridging slide is needed.

**Output**: A numbered slide plan with: slide number, type, key
message (one sentence), estimated time, and transition note.

## Phase 4: Visual Design Decisions

For each slide, determine the visual approach:

1. **Layout selection**: Choose from standard patterns:
   - **Title + subtitle**: For title and section divider slides
   - **Heading + bullets**: For content slides (use sparingly)
   - **Heading + visual**: For diagram, data, and comparison slides
   - **Full-bleed visual**: For impact moments (sparingly)
   - **Two-column**: For comparison and before/after slides
   - **Code block**: For code slides with syntax highlighting
2. **Visual elements**: For each content slide, determine:
   - Does this slide need a diagram? What type? (flowchart,
     architecture box diagram, sequence diagram, timeline)
   - Does this slide need a chart? What type? (bar, line, pie, table)
   - Can text be replaced with a visual? (prefer visuals over bullets)
3. **Consistency rules**:
   - Use the same layout for slides of the same type
   - Use consistent colors for recurring concepts
   - Limit the color palette to the chosen theme
   - Use the same font sizes for equivalent heading levels
4. **Accessibility**: Ensure sufficient color contrast, readable
   font sizes (minimum 18pt body, 28pt+ titles), and alt text
   concepts for any diagrams.

**Output**: Per-slide visual specification (layout pattern, visual
elements needed, any special formatting notes).

## Phase 5: Time Budget

Allocate time across the presentation:

1. **Compute available content time**: Total time minus:
   - Introduction / housekeeping: ~2 minutes
   - Q&A buffer: 10–15% of total time
   - Demo time (if applicable): as estimated in Phase 6
   - Transition buffer: ~30 seconds per major section transition
2. **Allocate per slide**: Assign time to each slide from the
   Phase 3 slide plan. Rules:
   - Title slide: 30–60 seconds
   - Section dividers: 15–30 seconds
   - Content slides: 1–2 minutes each
   - Data/diagram slides: 2–3 minutes (need explanation)
   - Code slides: 1–3 minutes depending on complexity
   - Summary/closing: 1–2 minutes
3. **Validate total**: Sum all allocations. If they exceed available
   content time:
   - Identify the lowest-value slides and propose cutting them
   - Identify slides that can be condensed (merge two into one)
   - Do NOT simply compress all timings — cut scope instead
4. **Pacing markers**: Flag key timing checkpoints (e.g., "by
   minute 10 you should be past the problem statement"). These
   help the speaker self-correct during delivery.

**Output**: A time-budget table: slide number, key message,
allocated time, cumulative time, and any pacing markers.

## Phase 6: Demo Choreography (If Applicable)

If the presentation includes a live demo:

1. **Demo scope**: Define exactly what will be demonstrated.
   Limit to 2–4 key moments — demos that try to show everything
   show nothing.
2. **Demo steps**: Number each step. For each:
   - What the speaker does (action)
   - What the audience sees (expected result)
   - What the speaker says (talking point)
   - What can go wrong (risk)
3. **Fallback slides**: For each demo step, prepare a fallback
   slide showing a screenshot or recording of the expected result.
   Demos fail in live presentations — always have a backup.
4. **Transition design**: Plan the transition into and out of the
   demo. Before: set context and tell the audience what to watch for.
   After: summarize what was demonstrated and connect to next section.
5. **Time estimate**: Estimate demo time including transitions.
   Add 30% buffer for technical hiccups.
6. **Environment checklist**: List what must be set up before the
   presentation (software running, data loaded, screen resolution,
   network access, etc.).

**Output**: A numbered demo plan with steps, risks, fallbacks,
and environment requirements.
