// SPDX-License-Identifier: MIT
// cli/tests/launch.test.js ??? Launch module unit tests

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
      "content/ must exist ??? run 'npm run prepare' first"
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
    // and calls detectCli() with PATH set to mockDir only.
    // isOnPath() in launch.js scans PATH directories directly,
    // so mockDir is sufficient and no system binary directories are needed.
    function runDetectCli() {
      const testPath = mockDir;
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

    it("TC-CLI-072A: detectCli finds codex after claude", () => {
      removeMockCmd("copilot");
      removeMockCmd("gh");
      removeMockCmd("claude");
      createMockCmd("codex");
      assert.strictEqual(runDetectCli(), "codex");
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
      tmpDir = copyContentToTemp(contentDir);
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

  describe("Module exports and bootstrap prompt", () => {
    // Note: TC-CLI-080 (bootstrap prompt arg) and TC-CLI-081 (cmd/args per CLI)
    // are validated by the integration tests in "CWD preservation and staging
    // directory access" (TC-CLI-082/083), which assert --add-dir, absolute
    // bootstrap path, and correct spawn cwd for each CLI.
    it("launch module exports expected functions and source references bootstrap prompt", () => {
      const launchSrc = fs.readFileSync(launchModulePath, "utf8");

      // The bootstrap prompt now uses an absolute path, so check for the
      // constant prefix ("Read and execute ") rather than the exact string.
      const bootstrapPrefix = "Read and execute ";
      assert.ok(
        launchSrc.includes(bootstrapPrefix),
        "launch.js should contain the bootstrap prompt prefix"
      );
      assert.ok(
        launchSrc.includes("bootstrap.md"),
        "launch.js should reference bootstrap.md"
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

    it("TC-CLI-084: spawn is not called with shell: true (no arg-splitting regression)", () => {
      // The v0.6.0 bug was caused by shell: true in spawn() which split the
      // bootstrap prompt string into multiple arguments. This source-level check
      // ensures the option is never re-introduced.
      const launchSrc = fs.readFileSync(launchModulePath, "utf8");
      // Filter out comment lines to avoid false positives from comments that
      // mention shell: true while explaining why it must not be used.
      const nonCommentLines = launchSrc
        .split("\n")
        .filter((l) => !l.trim().startsWith("//"))
        .join("\n");
      assert.ok(
        !/\bshell\s*:\s*true\b/.test(nonCommentLines),
        "launch.js must not pass shell: true to spawn() ??? doing so splits the bootstrap prompt into multiple arguments"
      );
    });
  });

  describe("CWD preservation and staging directory access", () => {
    let cwdTestTmpDir;

    before(() => {
      cwdTestTmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pk-cwdtest-"));
    });

    after(() => {
      try {
        fs.rmSync(cwdTestTmpDir, { recursive: true, force: true });
      } catch {
        // best effort
      }
    });

    // Creates a mock CLI executable that records { cwd, args } to a JSON
    // file at captureFile, then exits.
    function createCapturingMock(mockBinDir, binName, captureFile) {
      const implScript = path.join(cwdTestTmpDir, `${binName}-impl.js`);
      fs.writeFileSync(
        implScript,
        [
          `const fs = require('fs');`,
          `fs.writeFileSync(`,
          `  ${JSON.stringify(captureFile)},`,
          `  JSON.stringify({ cwd: process.cwd(), args: process.argv.slice(2) })`,
          `);`,
        ].join("\n")
      );

      if (process.platform === "win32") {
        fs.writeFileSync(
          path.join(mockBinDir, `${binName}.cmd`),
          `@echo off\r\n"${process.execPath}" "${implScript}" %*\r\n`
        );
      } else {
        const p = path.join(mockBinDir, binName);
        fs.writeFileSync(p, `#!/bin/sh\n${JSON.stringify(process.execPath)} "${implScript}" "$@"\n`);
        fs.chmodSync(p, 0o755);
      }
    }

    // Run promptkit interactive --cli <cliName> from userCwd with mockBinDir
    // prepended to PATH.  Returns the parsed JSON capture written by the mock.
    function runAndCapture(cliName, mockBinDir, captureFile, userCwd) {
      const newPath = `${mockBinDir}${path.delimiter}${process.env.PATH || ""}`;
      try {
        execFileSync(
          process.execPath,
          [cliPath, "interactive", "--cli", cliName],
          {
            env: envWithPath(newPath),
            cwd: userCwd,
            encoding: "utf8",
            timeout: 15000,
          }
        );
      } catch {
        // The mock exits 0, so errors here are unexpected but we still want
        // to read whatever was captured.
      }
      assert.ok(
        fs.existsSync(captureFile),
        `mock ${cliName} should have written capture file`
      );
      return JSON.parse(fs.readFileSync(captureFile, "utf8"));
    }

    for (const cliName of ["claude", "copilot", "gh-copilot", "codex"]) {
      // TC-CLI-082 and TC-CLI-083 combined ??? run once per CLI
      it(`TC-CLI-082/083: ${cliName} spawned with originalCwd and --add-dir for staging dir`, () => {
        const mockBinDir = path.join(cwdTestTmpDir, `mock-bin-${cliName}`);
        fs.mkdirSync(mockBinDir, { recursive: true });
        const captureFile = path.join(cwdTestTmpDir, `${cliName}-capture.json`);

        // For gh-copilot the binary is "gh"; for others it matches cliName.
        const binName = cliName === "gh-copilot" ? "gh" : cliName;
        createCapturingMock(mockBinDir, binName, captureFile);

        // Use cwdTestTmpDir as the simulated user working directory.
        const userCwd = cwdTestTmpDir;
        const result = runAndCapture(cliName, mockBinDir, captureFile, userCwd);

        // TC-CLI-082: verify cwd is the user's original directory.
        const actualCwd = fs.realpathSync(result.cwd);
        const expectedCwd = fs.realpathSync(userCwd);
        assert.strictEqual(
          actualCwd,
          expectedCwd,
          `${cliName} should be spawned with the user's original cwd`
        );

        // TC-CLI-083: verify --add-dir is present and points to a
        // promptkit-* staging directory under os.tmpdir().
        const addDirIdx = result.args.indexOf("--add-dir");
        assert.ok(
          addDirIdx !== -1,
          `${cliName} args should include --add-dir`
        );
        const addDirValue = result.args[addDirIdx + 1];
        assert.ok(
          addDirValue && addDirValue.startsWith(os.tmpdir()) &&
            path.basename(addDirValue).startsWith("promptkit-"),
          `${cliName} --add-dir value should point to a promptkit-* staging dir under tmpdir`
        );

        // Also verify the bootstrap prompt uses an absolute path.
        const bootstrapArg = result.args.find((a) => a.includes("bootstrap.md"));
        assert.ok(
          bootstrapArg && path.isAbsolute(bootstrapArg.replace("Read and execute ", "")),
          `${cliName} bootstrap prompt should contain an absolute path to bootstrap.md`
        );
      });
    }
  });

  describe("--dry-run flag", () => {
    for (const cliName of ["copilot", "gh-copilot", "claude", "codex"]) {
      it(`TC-CLI-085: --dry-run prints spawn command for ${cliName} without launching`, () => {
        // --dry-run must print the command and args then exit 0 without
        // spawning the real LLM CLI.  We run with an empty PATH so that
        // no real CLI can be found, proving nothing was actually spawned.
        const emptyBinDir = fs.mkdtempSync(
          path.join(os.tmpdir(), "promptkit-dryrun-empty-")
        );
        if (process.platform === "win32" && cliName !== "gh-copilot") {
          // Provide a local .cmd shim so resolveSpawnCommand() can find it.
          fs.writeFileSync(
            path.join(emptyBinDir, `${cliName}.cmd`),
            "@echo off\r\nexit /b 0\r\n"
          );
        }

        let stdout = "";
        let exitCode = 0;
        try {
          try {
            stdout = execFileSync(
              process.execPath,
              [cliPath, "interactive", "--cli", cliName, "--dry-run"],
              {
                encoding: "utf8",
                timeout: 15000,
                env: envWithPath(emptyBinDir),
              }
            );
          } catch (err) {
            stdout = (err.stdout || "").toString();
            exitCode = err.status;
          }

          assert.strictEqual(exitCode, 0, `--dry-run should exit 0 for ${cliName}`);
          assert.ok(
            stdout.includes("DRY RUN"),
            `--dry-run output should contain 'DRY RUN' for ${cliName}`
          );

          // Parse the args line as JSON so we verify structure, not wording.
          const lines = stdout.split("\n");
          const cmdLine = lines.find((l) => l.trim().startsWith("cmd:"));
          const argsLine = lines.find((l) => l.trim().startsWith("args:"));
          assert.ok(cmdLine, `--dry-run output should include a 'cmd:' line for ${cliName}`);
          assert.ok(argsLine, `--dry-run output should include an 'args:' line for ${cliName}`);
          const parsedCmd = cmdLine.trim().slice("cmd:".length).trim();
          const parsedArgs = JSON.parse(argsLine.trim().slice("args:".length).trim());

          if (cliName === "gh-copilot") {
            assert.strictEqual(parsedCmd, "gh", "gh-copilot should spawn gh");
          } else if (process.platform === "win32") {
            assert.strictEqual(
              parsedCmd,
              `${cliName}.cmd`,
              `${cliName} should spawn the Windows .cmd shim`
            );
          } else {
            assert.strictEqual(parsedCmd, cliName, `${cliName} should spawn its bare command`);
          }

          // The bootstrap prompt must appear as exactly one element containing bootstrap.md,
          // not split across multiple elements (the shell: true regression).
          const bootstrapArgs = parsedArgs.filter((a) => a.includes("bootstrap.md"));
          assert.strictEqual(
            bootstrapArgs.length,
            1,
            `bootstrap.md should appear in exactly one arg for ${cliName} (shell-splitting regression)`
          );
          // The path in the bootstrap arg must be absolute.
          // Strip the known prefix rather than splitting on spaces (paths may contain spaces).
          const bootstrapArg = bootstrapArgs[0];
          const bootstrapPrefix = "Read and execute ";
          const bootstrapPath = bootstrapArg.startsWith(bootstrapPrefix)
            ? bootstrapArg.slice(bootstrapPrefix.length)
            : bootstrapArg;
          assert.ok(
            path.isAbsolute(bootstrapPath),
            `bootstrap arg must contain an absolute path for ${cliName}`
          );
        } finally {
          fs.rmSync(emptyBinDir, { recursive: true, force: true });
        }
      });
    }
  });
});

