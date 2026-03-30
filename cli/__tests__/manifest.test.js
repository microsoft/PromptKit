// SPDX-License-Identifier: MIT

const path = require("path");
const {
  loadManifest,
  getTemplates,
  getPersona,
  getProtocol,
  getFormat,
  getTaxonomy,
  resolveTemplateDeps,
} = require("../lib/manifest");

// Use the real repo content — no synthetic fixtures
const repoRoot = path.resolve(__dirname, "..", "..");

describe("manifest", () => {
  let manifest;

  beforeAll(() => {
    manifest = loadManifest(repoRoot);
  });

  describe("loadManifest", () => {
    test("parses manifest.yaml and returns an object", () => {
      expect(manifest).toBeDefined();
      expect(manifest.version).toBeDefined();
    });

    test("contains expected top-level keys", () => {
      expect(manifest.personas).toBeDefined();
      expect(manifest.protocols).toBeDefined();
      expect(manifest.formats).toBeDefined();
      expect(manifest.templates).toBeDefined();
      expect(manifest.taxonomies).toBeDefined();
    });

    test("throws on missing manifest file", () => {
      expect(() => loadManifest("/nonexistent/path")).toThrow();
    });
  });

  describe("getTemplates", () => {
    test("returns flat array of templates with category", () => {
      const templates = getTemplates(manifest);
      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
      for (const t of templates) {
        expect(t).toHaveProperty("name");
        expect(t).toHaveProperty("category");
        expect(t).toHaveProperty("path");
      }
    });

    test("preserves all template fields", () => {
      const templates = getTemplates(manifest);
      const bug = templates.find((t) => t.name === "investigate-bug");
      expect(bug).toBeDefined();
      expect(bug.persona).toBe("systems-engineer");
      expect(bug.protocols).toContain("anti-hallucination");
      expect(bug.protocols).toContain("root-cause-analysis");
      expect(bug.format).toBe("investigation-report");
    });

    test("returns empty array for manifest with no templates", () => {
      const templates = getTemplates({});
      expect(templates).toEqual([]);
    });
  });

  describe("getPersona", () => {
    test("finds persona by name", () => {
      const persona = getPersona(manifest, "systems-engineer");
      expect(persona).toBeDefined();
      expect(persona.path).toBe("personas/systems-engineer.md");
    });

    test("returns undefined for unknown persona", () => {
      expect(getPersona(manifest, "nonexistent")).toBeUndefined();
    });
  });

  describe("getProtocol", () => {
    test("finds guardrail protocol by short name", () => {
      const proto = getProtocol(manifest, "anti-hallucination");
      expect(proto).toBeDefined();
      expect(proto.path).toBe("protocols/guardrails/anti-hallucination.md");
    });

    test("finds reasoning protocol by short name", () => {
      const proto = getProtocol(manifest, "root-cause-analysis");
      expect(proto).toBeDefined();
      expect(proto.path).toBe("protocols/reasoning/root-cause-analysis.md");
    });

    test("returns null for unknown protocol", () => {
      expect(getProtocol(manifest, "nonexistent")).toBeNull();
    });
  });

  describe("getFormat", () => {
    test("finds format by name", () => {
      const format = getFormat(manifest, "investigation-report");
      expect(format).toBeDefined();
      expect(format.produces).toBe("investigation-report");
    });

    test("returns undefined for unknown format", () => {
      expect(getFormat(manifest, "nonexistent")).toBeUndefined();
    });
  });

  describe("getTaxonomy", () => {
    test("finds taxonomy by name", () => {
      const tax = getTaxonomy(manifest, "stack-lifetime-hazards");
      expect(tax).toBeDefined();
      expect(tax.path).toBe("taxonomies/stack-lifetime-hazards.md");
    });

    test("returns undefined for unknown taxonomy", () => {
      expect(getTaxonomy(manifest, "nonexistent")).toBeUndefined();
    });
  });

  describe("resolveTemplateDeps", () => {
    test("resolves all dependencies for investigate-bug", () => {
      const templates = getTemplates(manifest);
      const bug = templates.find((t) => t.name === "investigate-bug");
      const deps = resolveTemplateDeps(manifest, bug);

      expect(deps.persona).toBeDefined();
      expect(deps.persona.name).toBe("systems-engineer");
      expect(deps.protocols.length).toBeGreaterThanOrEqual(2);
      expect(deps.protocols.map((p) => p.name)).toContain("anti-hallucination");
      expect(deps.protocols.map((p) => p.name)).toContain("root-cause-analysis");
      expect(deps.format).toBeDefined();
      expect(deps.format.name).toBe("investigation-report");
    });

    test("resolves taxonomies when present", () => {
      const templates = getTemplates(manifest);
      const review = templates.find((t) => t.name === "review-code");
      const deps = resolveTemplateDeps(manifest, review);

      expect(deps.taxonomies.length).toBeGreaterThanOrEqual(1);
      expect(deps.taxonomies.map((t) => t.name)).toContain("stack-lifetime-hazards");
    });

    test("warns and filters out missing protocols", () => {
      const warnSpy = jest.spyOn(console, "warn").mockImplementation();
      const fakeTemplate = {
        persona: "systems-engineer",
        protocols: ["anti-hallucination", "nonexistent-protocol"],
        format: "investigation-report",
      };
      const deps = resolveTemplateDeps(manifest, fakeTemplate);

      expect(deps.protocols).toHaveLength(1);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("nonexistent-protocol")
      );
      warnSpy.mockRestore();
    });
  });
});
