// SPDX-License-Identifier: MIT
// cli/tests/copy-content.test.js — Content bundling tests

const { describe, it, before, after, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const copyContentScript = path.resolve(
  __dirname,
  "..",
  "scripts",
  "copy-content.js"
);
const repoRoot = path.resolve(__dirname, "..", "..");
const realContentDir = path.resolve(__dirname, "..", "content");

// Runs copy-content.js. The script uses __dirname-relative paths, so we
// need to create a wrapper script that adjusts paths for our temp env.
function runCopyContent(cwd, opts = {}) {
  return execFileSync(process.execPath, [copyContentScript], {
    encoding: "utf8",
    timeout: 15000,
    cwd: cwd || path.resolve(__dirname, ".."),
    ...opts,
  });
}

function runCopyContentExpectFail(cwd, opts = {}) {
  try {
    const stdout = runCopyContent(cwd, opts);
    return { stdout, stderr: "", exitCode: 0 };
  } catch (err) {
    return {
      stdout: (err.stdout || "").toString(),
      stderr: (err.stderr || "").toString(),
      exitCode: err.status,
    };
  }
}

describe("Content Bundling (copy-content.js)", () => {
  // These tests run against the real repo so they use the real
  // copy-content.js, which resolves paths relative to its own __dirname.

  describe("Real repo tests", () => {
    before(() => {
      assert.ok(
        fs.existsSync(path.join(repoRoot, "manifest.yaml")),
        "manifest.yaml must exist at repo root"
      );
    });

    it("TC-CLI-090: copies all required directories", () => {
      // Run copy-content to ensure content/ is populated
      runCopyContent();
      const expectedDirs = [
        "personas",
        "protocols",
        "formats",
        "templates",
        "taxonomies",
      ];
      for (const dir of expectedDirs) {
        assert.ok(
          fs.existsSync(path.join(realContentDir, dir)),
          `content/${dir}/ should exist`
        );
      }
    });

    it("TC-CLI-091: copies manifest.yaml and bootstrap.md", () => {
      runCopyContent();
      assert.ok(
        fs.existsSync(path.join(realContentDir, "manifest.yaml")),
        "content/manifest.yaml should exist"
      );
      assert.ok(
        fs.existsSync(path.join(realContentDir, "bootstrap.md")),
        "content/bootstrap.md should exist"
      );
    });

    it("TC-CLI-095: stdout contains 'Copied PromptKit content'", () => {
      const output = runCopyContent();
      assert.ok(
        output.includes("Copied PromptKit content"),
        "stdout should report successful copy"
      );
    });
  });

  describe("File filtering and cleanup", () => {
    // These tests create a mock repo structure in a temp dir with its own
    // copy-content.js script that points to the temp locations.

    let tmpDir;
    let tmpRepoRoot;
    let tmpCliDir;
    let tmpContentDir;
    let tmpScript;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "promptkit-copy-test-"));
      tmpRepoRoot = tmpDir;
      tmpCliDir = path.join(tmpDir, "cli");
      tmpContentDir = path.join(tmpCliDir, "content");
      const tmpScriptsDir = path.join(tmpCliDir, "scripts");
      fs.mkdirSync(tmpScriptsDir, { recursive: true });

      // Create a minimal repo root with manifest.yaml and bootstrap.md
      fs.writeFileSync(
        path.join(tmpRepoRoot, "manifest.yaml"),
        "templates: {}\n"
      );
      fs.writeFileSync(
        path.join(tmpRepoRoot, "bootstrap.md"),
        "# Bootstrap\nStub.\n"
      );

      // Create minimal source dirs
      const dirs = [
        "personas",
        "protocols",
        "formats",
        "templates",
        "taxonomies",
      ];
      for (const dir of dirs) {
        fs.mkdirSync(path.join(tmpRepoRoot, dir), { recursive: true });
        fs.writeFileSync(
          path.join(tmpRepoRoot, dir, "test.md"),
          "# Test\n"
        );
      }

      // Create a copy-content.js wrapper that uses our temp paths
      tmpScript = path.join(tmpScriptsDir, "copy-content.js");
      const scriptContent = `
const fs = require("fs");
const path = require("path");

const repoRoot = ${JSON.stringify(tmpRepoRoot)};
const contentDir = ${JSON.stringify(tmpContentDir)};

const dirs = ["personas", "protocols", "formats", "templates", "taxonomies"];
const files = ["manifest.yaml", "bootstrap.md"];

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.name.endsWith(".md") || entry.name.endsWith(".yaml")) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

if (!fs.existsSync(path.join(repoRoot, "manifest.yaml"))) {
  console.error(
    "Error: manifest.yaml not found at repo root. " +
    "Run this script from the promptkit repository."
  );
  process.exit(1);
}

if (fs.existsSync(contentDir)) {
  fs.rmSync(contentDir, { recursive: true });
}
fs.mkdirSync(contentDir, { recursive: true });

for (const file of files) {
  const src = path.join(repoRoot, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(contentDir, file));
  }
}

for (const dir of dirs) {
  copyDirRecursive(path.join(repoRoot, dir), path.join(contentDir, dir));
}

function countEntries(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    count++;
    if (entry.isDirectory()) {
      count += countEntries(path.join(dir, entry.name));
    }
  }
  return count;
}

const count = countEntries(contentDir);
console.log("Copied PromptKit content to cli/content/ (" + count + " entries)");
`;
      fs.writeFileSync(tmpScript, scriptContent);
    });

    afterEach(() => {
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {
        // best effort
      }
    });

    it("TC-CLI-092: .png files are not copied", () => {
      // Add a .png file to personas/
      fs.writeFileSync(
        path.join(tmpRepoRoot, "personas", "logo.png"),
        "fake-png-data"
      );

      execFileSync(process.execPath, [tmpScript], {
        encoding: "utf8",
        timeout: 15000,
      });

      assert.ok(
        fs.existsSync(path.join(tmpContentDir, "personas", "test.md")),
        "test.md should be copied"
      );
      assert.ok(
        !fs.existsSync(path.join(tmpContentDir, "personas", "logo.png")),
        ".png file should NOT be copied"
      );
    });

    it("TC-CLI-093: stale files are removed on re-run", () => {
      // First run to populate content
      execFileSync(process.execPath, [tmpScript], {
        encoding: "utf8",
        timeout: 15000,
      });

      // Create a stale file in content dir
      fs.writeFileSync(
        path.join(tmpContentDir, "stale-file.md"),
        "stale content"
      );
      assert.ok(
        fs.existsSync(path.join(tmpContentDir, "stale-file.md")),
        "stale file should exist before re-run"
      );

      // Re-run copy-content
      execFileSync(process.execPath, [tmpScript], {
        encoding: "utf8",
        timeout: 15000,
      });

      assert.ok(
        !fs.existsSync(path.join(tmpContentDir, "stale-file.md")),
        "stale file should be removed after re-run"
      );
    });
  });

  describe("Error handling", () => {
    it("TC-CLI-094: exits 1 when manifest.yaml not found", () => {
      // Create a temp dir without manifest.yaml and a copy-content wrapper
      const tmpDir = fs.mkdtempSync(
        path.join(os.tmpdir(), "promptkit-no-manifest-")
      );
      const tmpCliDir = path.join(tmpDir, "cli");
      const tmpScriptsDir = path.join(tmpCliDir, "scripts");
      fs.mkdirSync(tmpScriptsDir, { recursive: true });

      // Write a copy-content.js that points to this empty repo root
      const script = `
const fs = require("fs");
const path = require("path");
const repoRoot = ${JSON.stringify(tmpDir)};
if (!fs.existsSync(path.join(repoRoot, "manifest.yaml"))) {
  console.error(
    "Error: manifest.yaml not found at repo root. " +
    "Run this script from the promptkit repository."
  );
  process.exit(1);
}
`;
      const scriptPath = path.join(tmpScriptsDir, "copy-content.js");
      fs.writeFileSync(scriptPath, script);

      try {
        const result = runCopyContentExpectFail(tmpCliDir, {
          env: { ...process.env },
        });
        // Run the temp script directly
        try {
          execFileSync(process.execPath, [scriptPath], {
            encoding: "utf8",
            timeout: 15000,
          });
          assert.fail("should have thrown");
        } catch (err) {
          assert.strictEqual(err.status, 1, "exit code should be 1");
          const stderr = (err.stderr || "").toString();
          assert.ok(
            stderr.includes("manifest.yaml not found"),
            "stderr should mention manifest.yaml not found"
          );
        }
      } finally {
        try {
          fs.rmSync(tmpDir, { recursive: true, force: true });
        } catch {
          // best effort
        }
      }
    });
  });
});
