# Protocol: Self-Verification (Optimized)

Execute this protocol as a mandatory pre-submission gate. Instead of iterative phases, perform a single pass against the **Completeness Checklist**.

## Rules

1. **Gate Enforcement**: You MUST NOT finalize output until every item in the checklist is verified as 'Yes'.
2. **Evidence Requirement**: Verification of citations and sampling (Items 3 & 5) MUST be performed by re-reading the source context, not from memory.
3. **Failure Protocol**: If any check fails, resolve the defect and restart the verification from Item 1.

## Verification Checklist

Before finalizing, confirm:

- [ ] **Goal Alignment**: Stated success criteria and deliverables are fully met.
- [ ] **Artifact Integrity**: All requested formats are correct and well-formed.
- [ ] **Grounded Claims**: Every factual claim has a supporting citation or an explicit `[KNOWN/INFERRED/ASSUMED]` label.
- [ ] **Boundary Definition**: Explicitly stated what was NOT examined and why (Coverage Statement).
- [ ] **Spot Audit**: Sampled and re-verified at least 3 specific data points directly against the source material.
- [ ] **Internal Logic**: Output is consistent; recommendations do not conflict with stated constraints.
