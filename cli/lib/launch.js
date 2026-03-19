// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

// Detects LLM CLIs on PATH and launches bootstrap sessions.

const { execFileSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

function isOnPath(cmd) {
  try {
    const whereCmd = process.platform === "win32" ? "where" : "which";
    execFileSync(whereCmd, [cmd], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
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

function launchInteractive(contentDir, cliName) {
  const cli = cliName || detectCli();

  if (!cli) {
    console.error(
      "No supported LLM CLI found on PATH.\n\n" +
        "Install one of:\n" +
        "  - GitHub Copilot CLI: gh extension install github/gh-copilot\n" +
        "  - Claude Code: https://docs.anthropic.com/en/docs/claude-code\n\n" +
        "Or use: promptkit assemble <template> --output prompt.md\n" +
        "to generate a prompt file you can paste into any LLM."
    );
    process.exit(1);
  }

  // Copy content to a temp directory so the LLM can read the files
  const tmpDir = copyContentToTemp(contentDir);
  console.log(`PromptKit content staged at: ${tmpDir}`);
  console.log(`Launching ${cli}...\n`);

  let cmd, args;
  switch (cli) {
    case "copilot":
      cmd = "copilot";
      args = ["-i", "Read and execute bootstrap.md"];
      break;
    case "gh-copilot":
      cmd = "gh";
      args = ["copilot", "-i", "Read and execute bootstrap.md"];
      break;
    case "claude":
      cmd = "claude";
      args = [];
      break;
    default:
      console.error(`Unknown CLI: ${cli}`);
      process.exit(1);
  }

  const child = spawn(cmd, args, {
    cwd: tmpDir,
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

  child.on("exit", (code) => {
    // Clean up temp dir
    try {
      fs.rmSync(tmpDir, { recursive: true });
    } catch {
      // best effort cleanup
    }
    process.exit(code || 0);
  });
}

module.exports = { detectCli, launchInteractive, copyContentToTemp };
