// SPDX-License-Identifier: MIT
// cli/tests/cli.test.js — CLI entry point integration tests

const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const cliPath = path.resolve(__dirname, "..", "bin", "cli.js");
const contentDir = path.resolve(__dirname, "..", "content");
const pkg = require("../package.json");

function run(args, opts = {}) {
  return execFileSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
    timeout: 15000,
    ...opts,
  });
}

function runExpectFail(args, opts = {}) {
  try {
    const stdout = run(args, opts);
    return { stdout, stderr: "", exitCode: 0 };
  } catch (err) {
    return {
      stdout: (err.stdout || "").toString(),
      stderr: (err.stderr || "").toString(),
      exitCode: err.status,
    };
  }
}

// Create a copy of the content dir with specific files removed
function makeTempContent(removeFiles) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "promptkit-test-"));
  // We need to create a mini CLI wrapper that points to the temp content dir
  // Actually, cli.js hardcodes contentDir relative to __dirname.
  // Instead, we copy the entire cli dir structure needed and modify content.
  const tmpCli = path.join(tmpDir, "cli");
  const tmpBin = path.join(tmpCli, "bin");
  const tmpLib = path.join(tmpCli, "lib");
  const tmpContent = path.join(tmpCli, "content");

  fs.mkdirSync(tmpBin, { recursive: true });
  fs.mkdirSync(tmpLib, { recursive: true });

  // Copy package.json
  fs.copyFileSync(
    path.resolve(__dirname, "..", "package.json"),
    path.join(tmpCli, "package.json")
  );

  // Copy bin/cli.js
  fs.copyFileSync(
    path.resolve(__dirname, "..", "bin", "cli.js"),
    path.join(tmpBin, "cli.js")
  );

  // Copy lib/launch.js
  fs.copyFileSync(
    path.resolve(__dirname, "..", "lib", "launch.js"),
    path.join(tmpLib, "launch.js")
  );

  // Copy node_modules (symlink for speed)
  const srcModules = path.resolve(__dirname, "..", "node_modules");
  const destModules = path.join(tmpCli, "node_modules");
  if (fs.existsSync(srcModules)) {
    // Use junction on Windows, symlink on others
    fs.symlinkSync(srcModules, destModules, "junction");
  }

  // Copy content dir
  copyDirRecursive(contentDir, tmpContent);

  // Remove specified files
  for (const file of removeFiles) {
    const target = path.join(tmpContent, file);
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true });
    }
  }

  return { tmpDir, cliJs: path.join(tmpBin, "cli.js") };
}

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function cleanTmp(tmpDir) {
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {
    // best effort
  }
}

describe("CLI Entry Point", () => {
  before(() => {
    // Ensure content dir exists
    assert.ok(
      fs.existsSync(contentDir),
      "content/ must exist — run 'npm run prepare' first"
    );
  });

  it("TC-CLI-001: --help lists interactive and list, not assemble", () => {
    const output = run(["--help"]);
    assert.ok(output.includes("interactive"), "should list interactive command");
    assert.ok(output.includes("list"), "should list list command");
    // "assemble" may appear in the program description as a verb;
    // verify it is not listed as a command in the Commands section.
    const commandsSection = output.split(/Commands:/i)[1] || "";
    assert.ok(
      !commandsSection.match(/^\s+assemble\b/m),
      "Commands section should NOT list an assemble command"
    );
  });

  it("TC-CLI-002: --version outputs package version", () => {
    const output = run(["--version"]);
    assert.strictEqual(output.trim(), pkg.version);
  });

  describe("TC-CLI-003: missing bootstrap.md exits with error", () => {
    let tmpDir, tmpCliJs;

    before(() => {
      const result = makeTempContent(["bootstrap.md"]);
      tmpDir = result.tmpDir;
      tmpCliJs = result.cliJs;
    });

    after(() => cleanTmp(tmpDir));

    it("exits code 1 with error about missing content", () => {
      const result = runExpectFail(["list"], {
        env: { PATH: process.env.PATH },
      });
      // Run against the temp CLI that has bootstrap.md removed
      try {
        execFileSync(process.execPath, [tmpCliJs, "list"], {
          encoding: "utf8",
          timeout: 15000,
        });
        assert.fail("should have thrown");
      } catch (err) {
        assert.strictEqual(err.status, 1, "exit code should be 1");
        const stderr = (err.stderr || "").toString();
        assert.ok(
          stderr.includes("bootstrap.md"),
          "error should mention bootstrap.md"
        );
      }
    });
  });

  describe("TC-CLI-003a: missing manifest.yaml exits with error", () => {
    let tmpDir, tmpCliJs;

    before(() => {
      const result = makeTempContent(["manifest.yaml"]);
      tmpDir = result.tmpDir;
      tmpCliJs = result.cliJs;
    });

    after(() => cleanTmp(tmpDir));

    it("exits code 1 with error about missing manifest", () => {
      try {
        execFileSync(process.execPath, [tmpCliJs, "list"], {
          encoding: "utf8",
          timeout: 15000,
        });
        assert.fail("should have thrown");
      } catch (err) {
        assert.strictEqual(err.status, 1, "exit code should be 1");
        const stderr = (err.stderr || "").toString();
        assert.ok(
          stderr.includes("manifest.yaml"),
          "error should mention manifest.yaml"
        );
      }
    });
  });

  it("TC-CLI-004: default command routes to interactive", () => {
    // Running with no args should attempt interactive mode.
    // Since no LLM CLI is likely on PATH in CI, expect the
    // "No supported LLM CLI" error, proving it routed to interactive.
    // On Windows, env var names are case-insensitive but spread creates
    // plain objects — clear all PATH variants to be safe.
    const cleanEnv = Object.fromEntries(
      Object.entries(process.env).filter(
        ([k]) => k.toUpperCase() !== "PATH"
      )
    );
    cleanEnv.PATH = path.join(os.tmpdir(), "nonexistent-dir-promptkit");
    const result = runExpectFail([], { env: cleanEnv });
    assert.strictEqual(result.exitCode, 1, "should exit 1 with no CLI");
    assert.ok(
      result.stderr.includes("No supported LLM CLI"),
      "should show LLM CLI not found error"
    );
  });

  it("TC-CLI-120: 'assemble' is not a valid command", () => {
    // Use a temp dir so we don't depend on CWD state
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "promptkit-cli-assemble-")
    );
    try {
      runExpectFail(["assemble", "investigate-bug"], { cwd: tmpDir });
      // No assembly file should be written in the temp dir
      const assembledFile = path.join(tmpDir, "assembled-prompt.md");
      assert.ok(
        !fs.existsSync(assembledFile),
        "no assembled-prompt.md should be written"
      );
      // Confirm --help Commands section does not list assemble
      const helpOutput = run(["--help"]);
      const commandsSection = helpOutput.split(/Commands:/i)[1] || "";
      assert.ok(
        !commandsSection.match(/^\s+assemble\b/m),
        "Commands section should not list assemble"
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
