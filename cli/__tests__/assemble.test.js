// SPDX-License-Identifier: MIT

const path = require("path");
const {
  assemble,
  loadComponent,
  stripFrontmatter,
} = require("../lib/assemble");
const { loadManifest, getTemplates } = require("../lib/manifest");

// Use the real repo content — no synthetic fixtures
const repoRoot = path.resolve(__dirname, "..", "..");

describe("assemble", () => {
  describe("stripFrontmatter", () => {
    // Pure function tests use inline strings — no files needed
    test("removes YAML frontmatter delimited by ---", () => {
      const input = "---\nname: test\ntype: foo\n---\n# Body\n\nContent here.";
      expect(stripFrontmatter(input)).toBe("# Body\n\nContent here.");
    });

    test("returns content unchanged when no frontmatter present", () => {
      const input = "# Just a heading\n\nSome content.";
      expect(stripFrontmatter(input)).toBe(input);
    });

    test("handles frontmatter with Windows-style line endings", () => {
      const input = "---\r\nname: test\r\n---\r\n# Body";
      expect(stripFrontmatter(input)).toBe("# Body");
    });

    test("trims leading/trailing whitespace after stripping", () => {
      const input = "---\nname: test\n---\n\n  # Body  \n\n";
      expect(stripFrontmatter(input)).toBe("# Body");
    });
  });

  describe("loadComponent", () => {
    test("loads a persona and strips HTML comments and frontmatter", () => {
      const body = loadComponent(repoRoot, "personas/systems-engineer.md");
      expect(body).not.toContain("SPDX-License-Identifier");
      expect(body).toContain("# Persona: Senior Systems Engineer");
    });

    test("loads a protocol and strips HTML comments and frontmatter", () => {
      const body = loadComponent(
        repoRoot,
        "protocols/guardrails/anti-hallucination.md"
      );
      expect(body).not.toContain("SPDX-License-Identifier");
      expect(body).toContain("# Protocol: Anti-Hallucination Guardrails");
    });

    test("returns null for missing component and warns", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();
      const result = loadComponent(repoRoot, "nonexistent.md");

      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("nonexistent.md")
      );
      warnSpy.mockRestore();
    });
  });

  describe("assemble (full)", () => {
    let manifest;

    beforeAll(() => {
      manifest = loadManifest(repoRoot);
    });

    test("assembles a complete prompt with all sections in order", () => {
      const templates = getTemplates(manifest);
      const bug = templates.find((t) => t.name === "investigate-bug");
      const result = assemble(repoRoot, manifest, bug);

      // Check section headers are present in order
      const identityPos = result.indexOf("# Identity");
      const protocolsPos = result.indexOf("# Reasoning Protocols");
      const formatPos = result.indexOf("# Output Format");
      const taskPos = result.indexOf("# Task");

      expect(identityPos).toBeGreaterThanOrEqual(0);
      expect(protocolsPos).toBeGreaterThan(identityPos);
      expect(formatPos).toBeGreaterThan(protocolsPos);
      expect(taskPos).toBeGreaterThan(formatPos);
    });

    test("includes real persona body text verbatim", () => {
      const templates = getTemplates(manifest);
      const bug = templates.find((t) => t.name === "investigate-bug");
      const result = assemble(repoRoot, manifest, bug);

      expect(result).toContain("# Persona: Senior Systems Engineer");
    });

    test("includes all protocol bodies", () => {
      const templates = getTemplates(manifest);
      const bug = templates.find((t) => t.name === "investigate-bug");
      const result = assemble(repoRoot, manifest, bug);

      expect(result).toContain("# Protocol: Anti-Hallucination Guardrails");
      expect(result).toContain("# Protocol: Root Cause Analysis");
    });

    test("includes taxonomy section when template references one", () => {
      const templates = getTemplates(manifest);
      const review = templates.find((t) => t.name === "review-code");
      const result = assemble(repoRoot, manifest, review);

      expect(result).toContain("# Classification Taxonomy");
    });

    test("includes format body text", () => {
      const templates = getTemplates(manifest);
      const bug = templates.find((t) => t.name === "investigate-bug");
      const result = assemble(repoRoot, manifest, bug);

      expect(result).toContain("# Format: Investigation Report");
    });

    test("substitutes parameters when provided", () => {
      const templates = getTemplates(manifest);
      const bug = templates.find((t) => t.name === "investigate-bug");
      const result = assemble(repoRoot, manifest, bug, {
        problem_description: "Use-after-free in socket handler",
        code_context: "See socket.c line 42",
        environment: "Linux x86_64",
      });

      expect(result).toContain("Use-after-free in socket handler");
      expect(result).toContain("See socket.c line 42");
      expect(result).not.toContain("{{problem_description}}");
    });

    test("leaves unfilled params as placeholders", () => {
      const templates = getTemplates(manifest);
      const bug = templates.find((t) => t.name === "investigate-bug");
      const result = assemble(repoRoot, manifest, bug, {
        problem_description: "memory leak",
      });

      expect(result).toContain("memory leak");
      expect(result).toContain("{{code_context}}");
    });

    test("does not contain YAML frontmatter or SPDX headers", () => {
      const templates = getTemplates(manifest);
      const bug = templates.find((t) => t.name === "investigate-bug");
      const result = assemble(repoRoot, manifest, bug);

      expect(result).not.toContain("SPDX-License-Identifier");
      // YAML frontmatter (---\nkey: val) should not appear; section dividers (---) are fine
      expect(result).not.toMatch(/^---\r?\n\w+:/m);
    });

    test("separates sections with --- dividers", () => {
      const templates = getTemplates(manifest);
      const bug = templates.find((t) => t.name === "investigate-bug");
      const result = assemble(repoRoot, manifest, bug);

      const sections = result.split("\n\n---\n\n");
      expect(sections.length).toBeGreaterThanOrEqual(4);
    });
  });
});
