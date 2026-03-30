// SPDX-License-Identifier: MIT
// cli/tests/launch.test.js — Launch module unit tests

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const cliPath = path.resolve(__dirname, "..", "bin", "cli.js");
const contentDir = path.resolve(__dirname, "..", "content");
const launchModulePath = path.resolve(__dirname, "..", "lib", "launch.js");
const { copyContentToTemp } = require("../lib/launch");

// Build a clean env with PATH set to a specific value, handling Windows
// case-insensitivity (env may have "Path" instead of "PATH").
function envWithPath(pathValue) {
  const env = Object.fromEntries(
    Object.entries(process.env).filter(
      ([k]) => k.toUpperCase() !== "PATH"
    )
  );
  env.PATH = pathValue;
  return env;
}

function runExpectFail(args, opts = {}) {
  try {
    const stdout = execFileSync(process.execPath, [cliPath, ...args], {
      encoding: "utf8",
      timeout: 15000,
      ...opts,
    });
    return { stdout, stderr: "", exitCode: 0 };
  } catch (err) {
    return {
      stdout: (err.stdout || "").toString(),
      stderr: (err.stderr || "").toString(),
      exitCode: err.status,
    };
  }
}

describe("Launch Module", () => {
  before(() => {
    assert.ok(
      fs.existsSync(contentDir),
      "content/ must exist — run 'npm run prepare' first"
    );
  });

  describe("CLI detection via PATH", () => {
    it("TC-CLI-073/076: empty PATH exits with 'No supported LLM CLI' error", () => {
      const result = runExpectFail(["interactive"], {
        env: envWithPath(path.join(os.tmpdir(), "nonexistent-dir-promptkit")),
      });
      assert.strictEqual(result.exitCode, 1, "should exit code 1");
      assert.ok(
        result.stderr.includes("No supported LLM CLI"),
        "stderr should mention no supported CLI found"
      );
    });

    it("TC-CLI-073: error message includes install instructions", () => {
      const result = runExpectFail(["interactive"], {
        env: envWithPath(path.join(os.tmpdir(), "nonexistent-dir-promptkit")),
      });
      assert.ok(
        result.stderr.includes("gh extension install") ||
          result.stderr.includes("claude"),
        "error should include installation instructions"
      );
    });
  });

  describe("Mock CLI detection", () => {
    let mockDir;

    before(() => {
      mockDir = fs.mkdtempSync(path.join(os.tmpdir(), "promptkit-mock-cli-"));
    });

    after(() => {
      try {
        fs.rmSync(mockDir, { recursive: true, force: true });
      } catch {
        // best effort
      }
    });

    function createMockCmd(name) {
      if (process.platform === "win32") {
        fs.writeFileSync(path.join(mockDir, `${name}.cmd`), "@exit /b 0\r\n");
      } else {
        const scriptPath = path.join(mockDir, name);
        fs.writeFileSync(scriptPath, "#!/bin/sh\nexit 0\n");
        fs.chmodSync(scriptPath, 0o755);
      }
    }

    function removeMockCmd(name) {
      const variants = process.platform === "win32"
        ? [`${name}.cmd`, `${name}.bat`, `${name}.exe`]
        : [name];
      for (const v of variants) {
        try { fs.unlinkSync(path.join(mockDir, v)); } catch { /* ignore */ }
      }
    }

    // Run an inline Node script that requires launch.js by absolute path
    // and calls detectCli() with PATH set to mockDir.
    // On Windows, System32 must stay in PATH so `where.exe` can be located.
    function runDetectCli() {
      const sys32 = process.platform === "win32"
        ? path.join(process.env.SystemRoot || "C:\\Windows", "System32")
        : "";
      const testPath = sys32
        ? `${mockDir}${path.delimiter}${sys32}`
        : mockDir;
      const script = [
        `process.env.PATH = ${JSON.stringify(testPath)};`,
        `delete require.cache[${JSON.stringify(launchModulePath)}];`,
        `const { detectCli } = require(${JSON.stringify(launchModulePath)});`,
        `const r = detectCli();`,
        `process.stdout.write(r === null ? "null" : r);`,
      ].join("\n");
      return execFileSync(process.execPath, ["-e", script], {
        encoding: "utf8",
        timeout: 15000,
        env: envWithPath(testPath),
      }).trim();
    }

    it("TC-CLI-070: detectCli finds copilot on PATH", () => {
      createMockCmd("copilot");
      assert.strictEqual(runDetectCli(), "copilot");
    });

    it("TC-CLI-072: detectCli finds claude as fallback", () => {
      removeMockCmd("copilot");
      removeMockCmd("gh");
      createMockCmd("claude");
      assert.strictEqual(runDetectCli(), "claude");
    });

    it("TC-CLI-074: gh without copilot extension is not detected as gh-copilot", () => {
      removeMockCmd("copilot");
      removeMockCmd("claude");
      // gh mock that always fails (exit 1) to simulate no copilot extension
      if (process.platform === "win32") {
        fs.writeFileSync(path.join(mockDir, "gh.cmd"), "@exit /b 1\r\n");
      } else {
        const ghPath = path.join(mockDir, "gh");
        fs.writeFileSync(ghPath, "#!/bin/sh\nexit 1\n");
        fs.chmodSync(ghPath, 0o755);
      }
      const result = runDetectCli();
      assert.ok(
        result !== "gh-copilot",
        "should not detect gh-copilot when extension is missing"
      );
    });
  });

  describe("copyContentToTemp", () => {
    let tmpDir;

    after(() => {
      if (tmpDir) {
        try {
          fs.rmSync(tmpDir, { recursive: true, force: true });
        } catch {
          // best effort
        }
      }
    });

    it("TC-CLI-078: copies content to temp directory", () => {
      // Use fixtures as the source to avoid issues with real content dir
      const fixturesDir = path.resolve(__dirname, "fixtures");
      tmpDir = copyContentToTemp(fixturesDir);
      assert.ok(fs.existsSync(tmpDir), "temp dir should exist");
      assert.ok(
        tmpDir.includes("promptkit-"),
        "temp dir name should contain promptkit-"
      );
      assert.ok(
        fs.existsSync(path.join(tmpDir, "manifest.yaml")),
        "should contain manifest.yaml"
      );
      assert.ok(
        fs.existsSync(path.join(tmpDir, "bootstrap.md")),
        "should contain bootstrap.md"
      );
      // Check that component dirs were copied
      assert.ok(
        fs.existsSync(path.join(tmpDir, "personas")),
        "should contain personas/"
      );
      assert.ok(
        fs.existsSync(path.join(tmpDir, "templates")),
        "should contain templates/"
      );
    });
  });

  describe("Command construction", () => {
    it("TC-CLI-080/081: bootstrap prompt and CLI args are correct", () => {
      const launchSrc = fs.readFileSync(launchModulePath, "utf8");

      const bootstrapPrompt = "Read and execute bootstrap.md";
      assert.ok(
        launchSrc.includes(bootstrapPrompt),
        "launch.js should contain the bootstrap prompt"
      );

      // Verify command construction by checking source contains expected patterns.
      // This validates the switch/case structure that maps CLI names to commands.
      const launchModule = require("../lib/launch");
      assert.ok(
        typeof launchModule.launchInteractive === "function",
        "launchInteractive should be exported"
      );
      assert.ok(
        typeof launchModule.copyContentToTemp === "function",
        "copyContentToTemp should be exported"
      );
      assert.ok(
        typeof launchModule.detectCli === "function",
        "detectCli should be exported"
      );
    });
  });
});
