# Pipeline Guide

PromptKit templates can be chained into multi-stage workflows called
**pipelines**. Each template declares what artifact type it produces and
optionally what it consumes. The bootstrap engine uses these contracts to
validate chaining and suggest the next stage.

Pipelines describe **document flow**, not autonomous execution. PromptKit
does not run stages automatically or make decisions about what to do next.
You run each stage yourself, review the output, and decide when to proceed.
The pipeline structure simply tracks which artifacts connect to which
templates.

## How Pipelines Work

### Input/Output Contracts

Every template declares contracts in its YAML frontmatter:

```yaml
# author-requirements-doc
input_contract: null                    # no prerequisite
output_contract:
  type: requirements-document
  description: >
    A structured requirements document with numbered REQ-IDs.

# author-design-doc
input_contract:
  type: requirements-document           # consumes the above
  description: >
    A requirements document produced by author-requirements-doc.
output_contract:
  type: design-document
  description: >
    A structured design document with architecture and API contracts.
```

The `type` field is the contract — it's a string label that must match
between one template's `output_contract.type` and the next template's
`input_contract.type`.

### Pipeline Definition in the Manifest

The manifest registers pipelines under the `pipelines` section:

```yaml
pipelines:
  document-lifecycle:
    description: >
      Full document lifecycle from requirements through validation.
      Each stage produces an artifact consumed by the next.
    stages:
      - template: author-requirements-doc
        produces: requirements-document
      - template: author-design-doc
        consumes: requirements-document
        produces: design-document
      - template: author-validation-plan
        consumes: requirements-document
        produces: validation-plan
```

Each stage declares:
- `template` — the template name to execute
- `produces` — the artifact type this stage outputs
- `consumes` — the artifact type this stage requires as input (optional for
  the first stage)

### What the Bootstrap Engine Does

When you're working through a pipeline, the bootstrap engine:

1. **Validates contracts** — checks that the previous stage's output type
   matches the next stage's input type before offering the template
2. **Suggests the next stage** — after completing a stage, it tells you
   what comes next in the pipeline
3. **Passes artifacts forward** — the output of stage N becomes an input
   parameter of stage N+1

## The Document Lifecycle Pipeline

This is the built-in pipeline that demonstrates the full workflow:

```
┌────────────────────┐     ┌────────────────────┐     ┌────────────────────┐
│ author-             │     │ author-             │     │ author-             │
│ requirements-doc    │────▶│ design-doc          │     │ validation-plan     │
│                     │     │                     │     │                     │
│ Persona:            │     │ Persona:            │     │ Persona:            │
│   software-architect│     │   software-architect│     │   software-architect│
│                     │     │                     │     │                     │
│ Produces:           │     │ Consumes:           │     │ Consumes:           │
│   requirements-     │     │   requirements-     │────▶│   requirements-     │
│   document          │     │   document          │     │   document          │
│                     │     │ Produces:           │     │ Produces:           │
│                     │     │   design-document   │     │   validation-plan   │
└────────────────────┘     └────────────────────┘     └────────────────────┘
```

### Stage 1: Author Requirements Document

```bash
npx promptkit assemble author-requirements-doc \
  -p project_name="Auth Service" \
  -p description="OAuth2 authorization service with PKCE support" \
  -p stakeholders="Backend team, security team, API consumers" \
  -p audience="Expert engineers" \
  -o auth-requirements.md
```

Feed the assembled prompt to an LLM. The output is a structured requirements
document with numbered REQ-IDs (e.g., REQ-AUTH-001, REQ-AUTH-002) and
acceptance criteria.

### Stage 2: Author Design Document

Take the requirements document from Stage 1 and feed it as input:

```bash
npx promptkit assemble author-design-doc \
  -p project_name="Auth Service" \
  -p requirements_doc="<paste requirements output here>" \
  -p technical_context="Go microservice, PostgreSQL, Redis for sessions" \
  -p audience="Expert engineers" \
  -o auth-design.md
```

The design document addresses each REQ-ID from the requirements, providing
architecture decisions, API contracts, data models, and tradeoff analysis.

### Stage 3: Author Validation Plan

Take the requirements document and create a test plan:

```bash
npx promptkit assemble author-validation-plan \
  -p project_name="Auth Service" \
  -p requirements_doc="<paste requirements output here>" \
  -p technical_context="Go microservice, integration test framework" \
  -p audience="QA engineers" \
  -o auth-validation.md
```

The validation plan produces test cases with traceability back to REQ-IDs,
ensuring every requirement has corresponding test coverage.

## Creating Your Own Pipeline

### Step 1: Design the contract chain

Decide what artifact types flow between stages:

```
template-A  ──produces: my-spec──▶  template-B  ──produces: my-impl──▶  template-C
```

### Step 2: Set contracts in template frontmatter

```yaml
# Template A
output_contract:
  type: my-spec
  description: >
    A specification document.

# Template B
input_contract:
  type: my-spec
  description: >
    The specification from template A.
output_contract:
  type: my-impl
  description: >
    An implementation plan based on the spec.
```

### Step 3: Register the pipeline in manifest.yaml

```yaml
pipelines:
  my-workflow:
    description: >
      Custom workflow from spec through implementation.
    stages:
      - template: template-a
        produces: my-spec
      - template: template-b
        consumes: my-spec
        produces: my-impl
      - template: template-c
        consumes: my-impl
        produces: my-deliverable
```

### Step 4: Test the chain

Run each stage in sequence, passing outputs forward. Verify that:

- Each stage's output makes sense as input to the next
- Contract types match (the `type` strings are identical)
- The final deliverable meets your needs

## Tips

- **Contract types are just strings** — they're labels for artifact types,
  not enforced schemas. Choose descriptive names like
  `requirements-document`, not `doc1`.
- **Stages can share inputs** — notice that `author-validation-plan`
  consumes `requirements-document`, not `design-document`. Multiple stages
  can consume the same artifact.
- **Pipelines are advisory** — the bootstrap engine suggests next stages but
  doesn't enforce them. You can run any template at any time.
- **No autonomous execution** — pipelines do not run stages automatically.
  You control each step, review outputs, and decide when to proceed.
- **Interactive mode** works with pipelines too — the bootstrap engine will
  detect when you're mid-pipeline and offer the next stage. The user always
  drives the interaction.
