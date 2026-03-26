<!-- SPDX-License-Identifier: MIT -->
<!-- Copyright (c) PromptKit Contributors -->

---
name: scaffold-test-project
description: >
  Scaffold a complete test project with build configuration, test
  class boilerplate, and test runner setup for a given framework
  and language. Supports multiple frameworks including gtest, pytest,
  jest, TAEF, Pester, and others.
persona: test-engineer
protocols:
  - guardrails/anti-hallucination
  - guardrails/self-verification
format: implementation-plan
params:
  project_name: "Name of the test project (used for file and class names)"
  language: "Programming language — e.g., C++, C#, Python, JavaScript, PowerShell"
  test_framework: "Test framework — e.g., gtest, pytest, jest, TAEF, Pester, catch2, xunit"
  target_directory: "(Optional) Directory where the test project will be created — default: current directory"
  source_under_test: "(Optional) Path to the source code being tested — for import/include setup"
  build_system: "(Optional) Build system — e.g., CMake, MSBuild, npm, pip. If not provided, infer from language/framework."
input_contract: null
output_contract:
  type: implementation-plan
  description: >
    A scaffolded test project with all required files, build
    configuration, and next steps for building and running tests.
---

# Task: Scaffold Test Project

You are tasked with scaffolding a complete, ready-to-build test project
for **{{project_name}}** using **{{test_framework}}** in **{{language}}**.

## Inputs

**Project Name**: {{project_name}}

**Language**: {{language}}

**Test Framework**: {{test_framework}}

**Target Directory**: {{target_directory}}

**Source Under Test**: {{source_under_test}}

**Build System**: {{build_system}}

## Instructions

1. **Determine project structure** based on {{language}} and {{test_framework}}:
   - Identify required files: build config, test source, test runner
     config, metadata
   - Determine naming conventions for the framework
   - Plan directory layout following {{language}} ecosystem conventions

2. **Create build configuration**:
   - For C++ / gtest: `CMakeLists.txt` with `FetchContent` or
     `find_package` for gtest
   - For C++ / catch2: `CMakeLists.txt` with header-only include or
     `FetchContent`
   - For C++ / TAEF: `SOURCES` file with TAEF headers and libraries
     (per MSDN TAEF documentation)
   - For Python / pytest: `pyproject.toml` or `setup.cfg` with pytest
     configuration and dependencies
   - For JavaScript / jest: `package.json` with jest config and
     devDependencies
   - For C# / xunit: `.csproj` with xunit and `Microsoft.NET.Test.Sdk`
     NuGet references
   - For PowerShell / Pester: test metadata and Pester configuration
     file
   - For other combinations: infer from {{build_system}} or document
     what is needed

3. **Create test source file(s)**:
   - Use {{project_name}} for class, module, and file naming
   - Include framework-specific imports and includes
   - If {{source_under_test}} is provided, add the appropriate
     import/include path
   - Create exactly 2 sample test methods demonstrating framework
     assertion idioms
   - Include setup/teardown scaffolding if the framework supports it
   - Add comments pointing to official framework documentation

4. **Create test runner configuration** (if applicable):
   - Test metadata files (e.g., `testmd.definition` for TAEF)
   - Runner config (e.g., `pytest.ini`, `jest.config.js`,
     `.runsettings`)
   - CI integration hints (e.g., `ctest`, `npx jest --ci`,
     `dotnet test`)

5. **Present file structure summary**:

   ```
   {{target_directory}}/
   ├── <build_config_file>
   ├── <test_source_file>
   └── <runner_config_file>
   ```

   List every file created with a one-line description of its purpose.

6. **Provide next steps**:
   - How to build the test project (copy-pasteable commands)
   - How to run tests locally (copy-pasteable commands)
   - How to integrate with CI (command or config snippet)

## Non-Goals

- Do NOT write actual test logic — only scaffolding with sample
  assertions that demonstrate framework usage.
- Do NOT modify existing project files outside {{target_directory}}.
- Do NOT install dependencies — only specify them in configuration
  files.
- Do NOT generate production source code — only test infrastructure.

## Quality Checklist

Before finalizing, verify:

- [ ] All required files for {{test_framework}} are created
- [ ] Build configuration is valid for the specified build system
- [ ] Test source compiles/runs with the sample assertions
- [ ] File and class names use {{project_name}} consistently
- [ ] Framework imports/includes are correct and complete
- [ ] Next steps include concrete, copy-pasteable commands
- [ ] Directory layout follows {{language}} ecosystem conventions
