---
name: author-business-expansion-proposal
description: >
  Produce a comprehensive business strategy proposal for a firm to
  improve organizational efficiency, increase capacity, and become
  more scalable.
persona: specification-analyst
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - reasoning/requirements-elicitation
format: requirements-doc
params:
  business_description: "Description of the business — structure, headcount, roles, licensing constraints"
  growth_problem: "The capacity or scaling problem the business is experiencing"
  constraints: "Regulatory, financial, or operational constraints the proposal must respect"
  priorities: "Owner's priorities or preferences for the expansion strategy"
input_contract: null
output_contract:
  type: business-strategy-proposal
  description: >
    A structured strategy proposal with organizational restructuring,
    staffing plan, process improvements, risk mitigation, success
    metrics, implementation timeline, and budget estimate.
---

# Task: Author Business Expansion Proposal

You are a business development manager with expertise in management
analysis and organizational efficiency. Produce a business strategy
proposal for the business described below.

## Inputs

**Business Description**:
{{business_description}}

**Growth Problem**:
{{growth_problem}}

**Constraints**:
{{constraints}}

**Owner Priorities**:
{{priorities}}

## Instructions

1. **Apply the requirements-elicitation protocol** to extract implicit
   and explicit business needs from the inputs. Before writing the
   proposal, identify and list:
   - Ambiguities in the business description that affect recommendations
   - Implicit needs not stated but likely intended
   - Conflicts between constraints and growth goals

   Present these as a preliminary section titled "Pre-Proposal Analysis."

2. **Apply the anti-hallucination protocol** throughout. Every
   recommendation MUST be grounded in the provided business description
   and constraints. Do NOT fabricate market data, salary figures, or
   regulatory requirements. Where specific numbers are needed (costs,
   timelines), state assumptions explicitly and label them [ASSUMPTION].

3. **Produce the following sections**, each with concrete and actionable
   recommendations:

   a. **Organizational Structure** — Recommend a restructured org chart
      and role definitions that support growth. Address reporting lines,
      delegation of authority, and separation of engineering vs.
      administrative vs. project management responsibilities.

   b. **Staffing Plan** — Recommend a hiring strategy (W-2 employees
      vs. 1099 contractors), role types, headcount, and sequencing.
      Address licensing requirements (e.g., PE stamp authority) and
      how to scale engineering capacity without bottlenecking on a
      single licensed engineer.

   c. **Process Improvements** — Identify and recommend process changes
      to reduce lead times and increase throughput. Cover project
      intake, workflow standardization, quality control, and technology
      or tooling improvements.

   d. **Challenges & Risk Mitigation** — For each recommendation above,
      identify the associated risks (financial, operational, regulatory,
      cultural) and provide a specific mitigation strategy for each.

   e. **Success Metrics & Adjustment Plan** — Define 5–8 measurable KPIs
      to track the effectiveness of the changes. Describe a review
      cadence and criteria for adjusting the plan.

   f. **Implementation Timeline** — Provide a phased rollout plan with
      milestones, dependencies between phases, and decision gates.

   g. **Budget Estimate** — Provide cost estimates for each major
      component (hiring, tooling, process changes, overhead). State
      all cost assumptions explicitly.

4. **Apply the self-verification protocol** before finalizing:
   - Verify every recommendation traces back to a stated business need
   - Verify no section contains vague language ("improve efficiency,"
     "as needed") without a concrete action or metric
   - Verify the timeline and budget are internally consistent
   - Verify risks are identified for every major recommendation

## Non-Goals

- Do NOT produce a legal compliance guide — flag legal considerations
  (e.g., contractor misclassification, PE licensing laws) but recommend
  the owner consult an attorney for specifics.
- Do NOT produce a marketing or sales strategy — focus on internal
  operations and capacity only.
- Do NOT assume a specific geographic market unless stated in the inputs.
- Do NOT prescribe specific software products — recommend capability
  categories and let the owner evaluate vendors.

## Quality Checklist

Before finalizing, verify:
- [ ] Every recommendation is specific and actionable (not "consider improving X")
- [ ] Every cost estimate states its assumptions
- [ ] Every risk has a corresponding mitigation strategy
- [ ] Timeline phases have clear entry/exit criteria
- [ ] KPIs are measurable with a defined target and review cadence
- [ ] No fabricated data — all unknowns marked with [ASSUMPTION] or [UNKNOWN]
- [ ] Licensing and regulatory bottlenecks are explicitly addressed
- [ ] The single-point-of-failure risk (sole licensed PE) is addressed
