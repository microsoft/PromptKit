// SPDX-License-Identifier: MIT

const path = require("path");
const { execFileSync } = require("child_process");

const cliPath = path.resolve(__dirname, "..", "bin", "cli.js");

// Integration tests run the actual CLI as a subprocess.
// The CLI reads content copied from the repo root via the prepare script.

describe("cli integration", () => {

  describe("list command", () => {
    test("lists templates as JSON", () => {
      const result = runCli(["list", "--json"]);
      const templates = JSON.parse(result);

      expect(Array.isArray(templates)).toBe(true);
      expect(templates.length).toBeGreaterThan(0);
      expect(templates[0]).toHaveProperty("name");
      expect(templates[0]).toHaveProperty("category");
    });

    test("lists templates in human-readable format", () => {
      const result = runCli(["list"]);

      expect(result).toContain("Available PromptKit templates:");
      expect(result).toContain("investigate-bug");
    });
  });

  describe("assemble command", () => {
    const outputPath = path.join(
      require("os").tmpdir(),
      `promptkit-test-${Date.now()}.md`
    );

    afterAll(() => {
      try {
        require("fs").unlinkSync(outputPath);
      } catch {
        // ignore cleanup errors
      }
    });

    test("assembles a template to a file", () => {
      runCli(["assemble", "investigate-bug", "--output", outputPath]);

      const fs = require("fs");
      expect(fs.existsSync(outputPath)).toBe(true);

      const content = fs.readFileSync(outputPath, "utf8");
      expect(content).toContain("# Identity");
      expect(content).toContain("# Task");
    });

    test("substitutes params via --param", () => {
      runCli([
        "assemble",
        "investigate-bug",
        "--output",
        outputPath,
        "--param",
        "problem_description=test bug",
        "--param",
        "code_context=test context",
        "--param",
        "environment=test env",
      ]);

      const content = require("fs").readFileSync(outputPath, "utf8");
      expect(content).toContain("test bug");
      expect(content).toContain("test context");
      expect(content).not.toContain("{{problem_description}}");
    });

    test("reports unfilled parameters", () => {
      const result = runCli(["assemble", "investigate-bug", "--output", outputPath]);

      expect(result).toContain("unfilled parameter");
    });

    test("exits with error for unknown template", () => {
      expect(() => {
        runCli(["assemble", "nonexistent-template"]);
      }).toThrow();
    });
  });

  describe("--version", () => {
    test("prints the version number", () => {
      const result = runCli(["--version"]);
      expect(result.trim()).toMatch(/^\d+\.\d+\.\d+/);
    });
  });
});

/**
 * Runs the CLI with the given arguments. Ensures the content/ directory
 * is populated from the repo root via the prepare script before first use.
 */
function runCli(args) {
  // The CLI reads content from ../content relative to bin/cli.js.
  // We need the prepare script to have run, or we run it first.
  const contentDir = path.resolve(__dirname, "..", "content");
  const fs = require("fs");

  if (!fs.existsSync(path.join(contentDir, "manifest.yaml"))) {
    // Run prepare to copy content
    execFileSync(process.execPath, [
      path.resolve(__dirname, "..", "scripts", "copy-content.js"),
    ], { cwd: path.resolve(__dirname, "..") });
  }

  const result = execFileSync(
    process.execPath,
    [cliPath, ...args],
    {
      encoding: "utf8",
      cwd: path.resolve(__dirname, ".."),
      timeout: 10000,
    }
  );
  return result;
}
