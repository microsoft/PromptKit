<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: author-presentation
mode: interactive
description: >
  Interactive authoring of professional technical presentations.
  Multi-phase workflow: audience and context analysis, narrative
  design, slide planning, appearance preferences, content generation,
  and PowerPoint production via python-pptx. Produces a presentation
  kit with slides, speaker notes, timeline, and optional demo plan
  and PDF export.
persona: "{{persona}}"
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - guardrails/operational-constraints
  - reasoning/presentation-design
format: presentation-kit
params:
  persona: "Persona to use — select from library or describe a custom one"
  topic: "Presentation topic or title"
  description: "What the presentation should communicate — key messages, goals, thesis"
  source_material: "Key documents, findings, data, or prior conversation to draw from"
  audience: "Who will attend — role, expertise level, what they expect to leave with"
  time_allocation: "Total presentation time including Q&A (e.g., '30 minutes', '1 hour')"
  context: "Additional context — event type, constraints, style preferences, prior sessions"
input_contract: null
output_contract:
  type: presentation-kit
  description: >
    A complete presentation kit: PowerPoint slides (.pptx) generated
    via python-pptx with embedded speaker notes, a presentation
    timeline, a speaker notes document, and optionally a PDF export
    and demo plan.
---

# Task: Author Technical Presentation

You are tasked with working **interactively** with the user to produce
a professional, technically rigorous yet engaging presentation. You do
NOT generate slides immediately. Instead, you follow a multi-phase
process that ensures the presentation is well-structured, properly
paced, and visually coherent before any slides are produced.

## Inputs

**Topic**: {{topic}}

**Description**:
{{description}}

**Source Material**:
{{source_material}}

In addition to the explicit source material above, use **all context
available in this session** — prior conversation, loaded documents,
code, findings, or other artifacts the user has shared. The user may
have primed this session with extensive context before invoking this
template.

**Audience**: {{audience}}

**Time Allocation**: {{time_allocation}}

**Additional Context**:
{{context}}

## Phase 1 — Context and Audience Analysis

Before designing any slides, establish a shared understanding:

1. **Inventory the source material.** Review all provided context and
   list the key topics, findings, data points, and arguments available.
   Identify gaps — what important information is missing?
2. **Apply Phase 1 (Audience Analysis) of the presentation-design
   protocol.** Produce the audience profile.
3. **Clarify the presentation goal.** Ask the user:
   - What is the **single most important thing** the audience should
     take away?
   - Is this presentation meant to **inform**, **persuade**, **teach**,
     or **inspire action**?
   - Are there topics that MUST be covered vs. topics that are optional?
4. **Identify constraints.** Ask about:
   - Is there a required structure (e.g., company template, conference
     format)?
   - Are there topics to explicitly avoid?
   - Will there be Q&A? How much time?
   - Will there be a live demo? What would it show?

**Do NOT proceed to Phase 2 until the user confirms the context and
goals are understood correctly.**

## Phase 2 — Presentation Structure Design

Apply the presentation-design protocol (Phases 2–3) to create the
presentation blueprint:

1. **Design the narrative arc.** Propose a story structure:
   - What is the hook?
   - How is the problem/opportunity framed?
   - What evidence structure works best for this audience?
   - What are the 2–4 key takeaways?
   - What is the call to action?

2. **Decompose into slides.** Produce a numbered slide plan:

   | # | Type | Key Message | Est. Time |
   |---|------|-------------|-----------|
   | 1 | Title | {{topic}} — <speaker> | 0:30 |
   | 2 | Content | <hook> | 1:00 |
   | ... | ... | ... | ... |

3. **Challenge the structure.** Before the user confirms:
   - Is any slide trying to do too much? (split it)
   - Is the flow logical? Does each slide lead to the next?
   - Are there too many slides for the time? (cut or merge)
   - Is the hook strong enough for this audience?
   - Does the ending land with impact?

4. **Present the slide plan to the user for review.** Ask:
   - Does this structure cover what you need?
   - Should any slides be added, removed, or reordered?
   - Is the pacing right?

**Do NOT proceed to Phase 3 until the user approves the slide plan.**

## Phase 3 — Adversarial Plan Review

Before committing to content generation, apply adversarial reasoning
to stress-test the presentation plan. The goal is to **try to disprove
that this plan will succeed** — and fix weaknesses before investing
effort in content and slide production.

1. **Audience-goal alignment test.** Re-read the audience profile
   from Phase 1 and the slide plan from Phase 2. For each slide, ask:
   - Does this slide serve the stated audience? Would they care about
     this content, or is it something the *speaker* finds interesting
     but the *audience* does not?
   - Does this slide advance the presentation's stated goal (inform,
     persuade, teach, inspire action)? If it is merely "nice to have,"
     flag it for potential removal.
   - If the audience has no prior context on this topic, is there a
     slide that establishes it? If not, the audience will be lost.

2. **Narrative coherence test.** Walk through the slide plan as if
   you are an audience member hearing it for the first time:
   - At each slide transition, can you explain *why* this slide
     follows the previous one? If not, there is a narrative gap.
   - Does the hook actually create curiosity or urgency, or is it
     generic ("Today I'll talk about X")?
   - Does the ending deliver a clear call to action, or does it
     trail off?
   - Is there a "so what?" moment — a slide where the audience's
     likely reaction is "why should I care?"

3. **Evidence grounding test.** For every claim, statistic, or
   technical assertion planned for the slides:
   - Is it actually present in the source material or session context?
   - If not, flag it as `[UNGROUNDED]` — it must be removed, sourced,
     or explicitly marked as `[ASSUMPTION]`.
   - Are there stronger pieces of evidence in the source material that
     were overlooked?

4. **Pacing stress test.** Apply adversarial pressure to the time
   budget:
   - If you removed the two lowest-value slides, would the
     presentation still achieve its goal? If yes, consider cutting them.
   - Are any slides allocated less than 1 minute? If so, they may not
     justify being standalone slides — merge them.
   - Is there enough time for the audience to absorb data-heavy or
     diagram-heavy slides? (These need 2–3 minutes, not 1.)
   - If the speaker runs 20% over time, which slides get cut? Identify
     them now — not during delivery.

5. **Failure mode analysis.** Consider how this presentation could fail:
   - **Wrong level of detail**: Too deep for executives? Too shallow
     for engineers? Verify against the audience profile.
   - **Missing context**: Does the presentation assume knowledge the
     audience may not have?
   - **Buried lead**: Is the most important message hidden on slide 15
     instead of slide 3?
   - **Demo dependency**: If a demo is planned, does the presentation
     still make sense if the demo fails entirely?
   - **Cognitive overload**: Are there consecutive dense slides without
     a breather (lighter slide, summary, or interaction)?

6. **Present findings to the user.** Report:
   - Slides that failed adversarial tests (with specific reasons)
   - Proposed changes (cut, merge, reorder, add, strengthen)
   - Any ungrounded claims found
   - Revised slide plan (if changes are needed)

**Do NOT proceed to Phase 4 until the user reviews the adversarial
findings and approves the revised (or unchanged) plan.**

## Phase 4 — Appearance Preferences

Before generating content, establish the visual direction:

1. **Offer theme presets.** Present these options and let the user
   choose or customize:

   | Preset | Style | Best For |
   |--------|-------|----------|
   | **Dark Tech** | Dark bg, cyan accent, modern | Tech talks, demos, engineering |
   | **Light Clean** | White bg, blue accent, minimal | Business updates, proposals |
   | **Warm Minimal** | Off-white bg, orange accent | Team meetings, workshops |
   | **Corporate Blue** | Light gray bg, blue accent | Executive briefings, reports |
   | **High Contrast** | Black bg, yellow accent | Accessibility-first, large venues |
   | **Custom** | User specifies all colors/fonts | Brand-specific presentations |

2. **Ask about preferences:**
   - Slide aspect ratio: 16:9 (default) or 4:3?
   - Slide density: minimal (few words, big visuals) or reference
     (more text for later reading)?
   - Any branding elements? (logo image path, footer text, company name)
   - Any font preferences? (otherwise use preset defaults)

3. **Ask about output options:**
   - Do you also want a **PDF export** of the slides?
   - Where should the output files be saved? (suggest current
     directory as default)

4. **Confirm the visual direction** before proceeding.

## Phase 5 — Content Generation

Now generate the full content for each slide:

1. **For each slide in the approved plan**, produce:
   - **Slide title** (concise, informative)
   - **Slide body content** (text, bullet points, or description of
     visual/diagram to generate)
   - **Speaker notes** (written in spoken language — what the speaker
     actually says, including transition phrases)
   - **Visual specification** (layout pattern, any diagrams or charts
     needed, data to visualize)

2. **Apply the anti-hallucination protocol.** Every claim, statistic,
   and technical detail on the slides MUST be grounded in the provided
   source material or session context. Flag any assumptions with
   `[ASSUMPTION]`.

3. **Write speaker notes as spoken prose**, not bullet points. Include:
   - Opening line for each slide
   - Key points to emphasize
   - Transition phrase to next slide
   - Audience interaction cues (if any)
   - Data citations for any statistics

4. **Build the time budget** (Phase 5 of the presentation-design
   protocol). Produce the timeline with pacing checkpoints.

5. **If a demo was requested**, apply Phase 6 (Demo Choreography) of
   the presentation-design protocol. Produce the demo plan.

6. **Present all content to the user for review.** Show:
   - Full slide content (slide by slide)
   - Speaker notes highlights
   - Timeline summary
   - Demo plan (if applicable)

**Do NOT proceed to Phase 6 until the user approves the content or
requests changes. Iterate as needed — make surgical changes to
individual slides, do not regenerate everything.**

## Phase 6 — Slide Production

Once content is approved, generate the PowerPoint file:

1. **Write a self-contained Python script** using `python-pptx` that:
   - Creates every slide with the approved content
   - Applies the chosen theme (colors, fonts, sizing)
   - Embeds speaker notes in every content slide
   - Creates diagrams using native shapes or embedded images
   - Creates charts using python-pptx chart objects where applicable
   - Handles errors gracefully — if one slide fails, insert a
     placeholder slide preserving slide order and numbering (per
     the presentation-kit format's error handling rules), then
     continue with the rest

2. **Execute the Python script** to produce the .pptx file.

3. **If PDF was requested**, attempt conversion:
   - Try a PPTX-to-PDF converter if available (e.g., `pptx2pdf`
     or a similar PPTX-capable tool)
   - Fall back to `libreoffice --headless --convert-to pdf`
   - If neither is available, inform the user and provide manual
     export instructions

4. **Verify the output:**
   - Confirm the .pptx file was created and has non-zero size
   - Verify slide count matches the plan (including any placeholder
     slides emitted for generation failures)
   - Report the file path(s) and any slide-level errors to the user

## Phase 7 — Kit Assembly

Produce the remaining presentation kit artifacts as Markdown files:

1. **Speaker notes document** (`speaker-notes.md`) — Full speaker
   notes organized by slide, following the presentation-kit format.

2. **Presentation timeline** (`presentation-timeline.md`) — Time
   budget table with pacing checkpoints and contingency plans,
   following the presentation-kit format.

3. **Demo plan** (`demo-plan.md`, if applicable) — Demo steps,
   risks, fallbacks, and environment checklist, following the
   presentation-kit format.

4. **Verify cross-artifact consistency:**
   - Slide numbers match across all documents
   - Slide titles are identical in all references
   - Time allocations sum correctly
   - Every content slide has speaker notes in both the .pptx and
     the markdown document

5. **Present the complete kit** to the user with a summary of all
   files produced.

## Non-Goals

Define at the start of the session (or ask the user) what is
explicitly out of scope. Suggested defaults:

- **Not a design tool**: This template produces slides, not graphic
  design. Complex custom graphics should be created externally and
  provided as image files.
- **Not a teleprompter script**: Speaker notes are talking points
  and transitions, not a word-for-word speech transcript.
- **Not an animation engine**: python-pptx has limited animation
  support. Slide transitions and build animations are not included.
- **Not a video producer**: Video embedding is not supported via
  python-pptx.

Adjust non-goals based on the specific presentation context.

## Quality Checklist

Before presenting the final kit, verify:

- [ ] Every slide has exactly one key message
- [ ] Slide titles are concise and informative (not generic)
- [ ] No slide has more than 5 bullet points
- [ ] Font sizes meet minimums (28pt+ titles, 18pt+ body)
- [ ] Speaker notes are written in spoken prose, not bullets
- [ ] Every content slide has speaker notes (embedded and in doc)
- [ ] Timeline adds up to the stated total time
- [ ] Pacing checkpoints are realistic and actionable
- [ ] Demo plan has fallback slides for every demo step (if demo requested)
- [ ] All claims and statistics are grounded in source material
- [ ] No fabricated details — unknowns marked with [UNKNOWN]
- [ ] Cross-artifact slide numbers and titles are consistent
- [ ] Python script completes successfully; any slide-level errors are logged, and the resulting .pptx is valid with acceptable slide count and content
- [ ] Visual theme is consistently applied across all slides
