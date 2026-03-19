<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: review-infrastructure
description: >
  Review infrastructure-as-code (Terraform, Bicep, ARM, Pulumi,
  CloudFormation) for correctness, security, best practices, and
  operational readiness.
persona: devops-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
  - analysis/security-vulnerability
format: investigation-report
params:
  platform: "IaC platform (e.g., 'Terraform', 'Bicep', 'ARM', 'Pulumi', 'CloudFormation')"
  code: "Infrastructure-as-code files to review"
  scope: "What to focus on (e.g., 'full review', 'security only', 'cost optimization')"
  context: "Additional context — cloud provider, compliance requirements, existing infrastructure"
  audience: "Who will read the review (e.g., 'DevOps team', 'security team', 'cloud architect')"
input_contract: null
output_contract:
  type: investigation-report
  description: >
    An investigation report covering IaC correctness, security findings,
    best practice violations, and remediation recommendations.
---

# Task: Review Infrastructure-as-Code

You are tasked with reviewing infrastructure-as-code for correctness,
security, best practices, and operational readiness.

## Inputs

**IaC Platform**: {{platform}}

**Code to Review**: {{code}}

**Review Scope**: {{scope}}

**Additional Context**: {{context}}

## Instructions

1. **Apply the security-vulnerability protocol** to analyze the IaC for
   security issues:
   - Trust boundaries: Are network boundaries correctly defined?
   - Access control: Are IAM roles and policies least-privilege?
   - Encryption: Is data encrypted at rest and in transit?
   - Secrets: Are sensitive values externalized to vaults/key stores?
   - Public exposure: Are resources unintentionally public?

2. **Apply the anti-hallucination protocol** throughout:
   - Reference ONLY the actual resources and configurations in the
     provided code
   - Do NOT fabricate resource names, property values, or provider behaviors
   - If a provider's behavior for a specific configuration is uncertain,
     flag it with `[VERIFY: <what to check>]`
   - Label all inferences: "Based on the missing `encryption` block, I
     infer that this resource is not encrypted at rest."

3. **Review for correctness**:
   - Resource dependencies: Are `depends_on` / implicit dependencies correct?
   - State management: Is remote state configured? Is state locking enabled?
   - Naming conventions: Are resources consistently named?
   - Parameterization: Are environment-specific values parameterized
     (not hardcoded)?
   - Idempotency: Will re-applying this configuration cause unintended changes?

4. **Review for best practices**:
   - Module/component structure: Is the code modular and reusable?
   - Tagging/labeling: Are resources tagged for cost allocation and ownership?
   - Lifecycle management: Are `prevent_destroy` or retention policies set
     where appropriate?
   - Version pinning: Are provider versions and module versions pinned?

5. **Review for operational readiness**:
   - Monitoring: Are alerts, metrics, and logging configured?
   - Backup and recovery: Are backup policies defined?
   - Scaling: Are auto-scaling rules configured where appropriate?
   - Cost: Are resource sizes appropriate? Are reserved/spot instances
     used where cost-effective?

6. **Classify findings** by severity:
   - **Critical**: Security vulnerability, data loss risk, or compliance violation
   - **High**: Significant best practice violation or operational risk
   - **Medium**: Improvement opportunity with moderate impact
   - **Low**: Minor improvement or cosmetic issue

7. **Provide specific remediation** for each finding:
   - Show the corrected code or configuration
   - Explain why the change is important
   - Assess the risk of applying the fix

8. **Format the output** according to the investigation-report format
   specification.

9. **Apply the self-verification protocol** before finalizing:
   - Re-verify that referenced resource names and configurations match
     the input
   - Confirm that remediation code is syntactically valid
   - Check that severity ratings are consistent across similar findings

## Non-Goals

- Do NOT apply the infrastructure changes — only review and recommend.
- Do NOT review application code deployed by the infrastructure.
- Do NOT assess cloud provider pricing unless explicitly in scope.
- Do NOT recommend a different IaC tool — review within the chosen platform.

## Quality Checklist

Before presenting the review, verify:

- [ ] Every finding references a specific resource and configuration
- [ ] Severity ratings are consistent across similar findings
- [ ] Remediation includes corrected code, not just descriptions
- [ ] Security findings are evaluated against industry standards
- [ ] Coverage section states what files and resource types were reviewed
- [ ] If findings overlap with existing components, they are noted
