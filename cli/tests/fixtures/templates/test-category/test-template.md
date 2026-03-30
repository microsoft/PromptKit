---
name: test-template
description: A test template for unit testing
persona: test-persona
protocols:
  - guardrails/test-guardrail
format: test-format
params:
  - name: topic
    description: The topic to test
input_contract:
  type: none
output_contract:
  type: test-output
---

# Test Template

Write about {{topic}}.
