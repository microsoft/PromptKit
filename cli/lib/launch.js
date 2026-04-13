// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

// Detects LLM CLIs on PATH and launches bootstrap sessions.

const { execFileSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

function pathDirs() {
  return (process.env.PATH || "").split(path.delimiter).filter(Boolean);
}

function windowsPathExts() {
  return (process.env.PATHEXT || ".EXE;.COM;.BAT;.CMD")
    .split(";")
    .map((e) => e.toLowerCase());
}

function isExactFileOnPath(fileName) {
  for (const dir of pathDirs()) {
    try {
      fs.accessSync(path.join(dir, fileName), fs.constants.F_OK);
      return true;
    } catch {
      // not found in this directory, continue
    }
  }
  return false;
}

function isOnPath(cmd) {
  // Search PATH entries directly rather than shelling out to `which`/`where`.
  // This avoids requiring `which` to be on PATH itself (important in test
  // environments where PATH is restricted to a mock directory).
  const exts = process.platform === "win32" ? windowsPathExts() : [""];
  // On Windows, X_OK is not meaningful — any file with a matching PATHEXT
  // extension is considered executable, so we check for existence (F_OK) only.
  const accessFlag = process.platform === "win32" ? fs.constants.F_OK : fs.constants.X_OK;
  for (const dir of pathDirs()) {
    for (const ext of exts) {
      try {
        fs.accessSync(path.join(dir, cmd + ext), accessFlag);
        return true;
      } catch {
        // not found in this directory, continue
      }
    }
  }
  return false;
}

function resolveSpawnCommand(cmd) {
  if (process.platform !== "win32") return cmd;

  const shim = `${cmd}.cmd`;
  return isExactFileOnPath(shim) ? shim : cmd;
}

function quoteWindowsArg(arg) {
  if (arg === "") return '""';
  if (!/[\s"]/u.test(arg)) return arg;
  return `"${arg.replace(/(\\*)"/g, '$1$1\\"').replace(/(\\+)$/g, '$1$1')}"`;
}

function spawnCli(cmd, args, options) {
  if (process.platform === "win32" && /\.cmd$/i.test(cmd)) {
    const comspec = process.env.ComSpec || "cmd.exe";
    const commandLine = [cmd, ...args].map(quoteWindowsArg).join(" ");
    return spawn(comspec, ["/d", "/s", "/c", commandLine], {
      ...options,
      windowsVerbatimArguments: true,
    });
  }
  return spawn(cmd, args, options);
}

function detectCli() {
  // Check for GitHub Copilot CLI first (most common)
  if (isOnPath("copilot")) return "copilot";
  // Check for gh with copilot extension
  if (isOnPath("gh")) {
    try {
      execFileSync("gh", ["copilot", "--help"], { stdio: "ignore" });
      return "gh-copilot";
    } catch {
      // gh exists but no copilot extension
    }
  }
  if (isOnPath("claude")) return "claude";
  if (isOnPath("codex")) return "codex";
  return null;
}

function copyContentToTemp(contentDir) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "promptkit-"));
  copyDirRecursive(contentDir, tmpDir);
  return tmpDir;
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

function launchInteractive(contentDir, cliName, { dryRun = false } = {}) {
  let detected = null;
  const cli = cliName || (detected = detectCli());

  if (!cli) {
    console.error(
      "No supported LLM CLI found on PATH.\n\n" +
        "Install one of:\n" +
        "  - GitHub Copilot CLI: gh extension install github/gh-copilot\n" +
        "  - Claude Code: https://docs.anthropic.com/en/docs/claude-code\n" +
        "  - OpenAI Codex CLI: https://github.com/openai/codex\n\n" +
        "Alternatively, load bootstrap.md in your LLM manually from:\n" +
        `  ${contentDir}`
    );
    process.exit(1);
  }

  // Warn the user when auto-detection chose a fallback CLI
  if (!cliName && detected !== "copilot" && detected !== "gh-copilot") {
    console.warn(
      `Warning: GitHub Copilot CLI not found on PATH. ` +
        `Falling back to '${cli}'.\n` +
        `To use a specific CLI, pass --cli <name> (e.g., --cli copilot).\n`
    );
  }

  // Preserve the user's working directory before staging content.
  const originalCwd = process.cwd();

  // Copy content to a temp directory so the LLM can read the files
  const tmpDir = copyContentToTemp(contentDir);
  console.log(`PromptKit content staged at: ${tmpDir}`);
  console.log(`Launching ${cli}...\n`);

  // Use an absolute path so the LLM can locate bootstrap.md regardless of
  // which directory it treats as its working directory.
  const bootstrapPrompt = `Read and execute ${path.join(tmpDir, "bootstrap.md")}`;

  let cmd, args;
  switch (cli) {
    case "copilot":
      cmd = resolveSpawnCommand("copilot");
      // --add-dir grants file access to the staging directory.
      args = ["--add-dir", tmpDir, "-i", bootstrapPrompt];
      break;
    case "gh-copilot":
      cmd = "gh";
      args = ["copilot", "--add-dir", tmpDir, "-i", bootstrapPrompt];
      break;
    case "claude":
      // --add-dir grants file access to the staging directory.
      cmd = resolveSpawnCommand("claude");
      args = ["--add-dir", tmpDir, bootstrapPrompt];
      break;
    case "codex":
      cmd = resolveSpawnCommand("codex");
      args = ["--add-dir", tmpDir, bootstrapPrompt];
      break;
    default:
      console.error(`Unknown CLI: ${cli}`);
      process.exit(1);
  }

  // In dry-run mode, print the spawn command and args then exit without
  // actually launching the LLM CLI.  Useful for CI smoke tests and debugging.
  if (dryRun) {
    console.log("[DRY RUN] Would spawn:");
    console.log(`  cmd:  ${cmd}`);
    console.log(`  args: ${JSON.stringify(args)}`);
    console.log(`  cwd:  ${originalCwd}`);
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // best effort cleanup
    }
    return;
  }

  // All CLIs are spawned from the user's original directory so the LLM
  // session reflects the directory the user was working in.
  const child = spawnCli(cmd, args, {
    cwd: originalCwd,
    stdio: "inherit",
  });

  child.on("error", (err) => {
    console.error(`Failed to launch ${cli}: ${err.message}`);
    try {
      fs.rmSync(tmpDir, { recursive: true });
    } catch {
      // best effort cleanup
    }
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    // Clean up temp dir
    try {
      fs.rmSync(tmpDir, { recursive: true });
    } catch {
      // best effort cleanup
    }
    if (signal) {
      process.kill(process.pid, signal);
    }
    process.exit(code || 0);
  });
}

module.exports = { detectCli, launchInteractive, copyContentToTemp };
