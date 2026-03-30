// SPDX-License-Identifier: MIT

const path = require("path");
const fs = require("fs");
const os = require("os");
const { execFileSync } = require("child_process");

// Must mock child_process before requiring launch module
jest.mock("child_process", () => ({
  execFileSync: jest.fn(),
  spawn: jest.fn(),
}));

const { detectCli, copyContentToTemp } = require("../lib/launch");

// Use the real repo content — no synthetic fixtures
const repoRoot = path.resolve(__dirname, "..", "..");

describe("launch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("detectCli", () => {
    test("returns 'copilot' when copilot is on PATH", () => {
      execFileSync.mockImplementation((cmd, args) => {
        if (args[0] === "copilot") return Buffer.from("");
        throw new Error("not found");
      });

      expect(detectCli()).toBe("copilot");
    });

    test("returns 'gh-copilot' when gh copilot extension is available", () => {
      const whereCmd = process.platform === "win32" ? "where" : "which";
      execFileSync.mockImplementation((cmd, args) => {
        if (cmd === whereCmd && args[0] === "copilot")
          throw new Error("not found");
        if (cmd === whereCmd && args[0] === "gh") return Buffer.from("");
        if (cmd === "gh" && args[0] === "copilot") return Buffer.from("");
        throw new Error("not found");
      });

      expect(detectCli()).toBe("gh-copilot");
    });

    test("returns 'claude' when only claude is on PATH", () => {
      execFileSync.mockImplementation((cmd, args) => {
        if (args && args[0] === "claude") return Buffer.from("");
        throw new Error("not found");
      });

      expect(detectCli()).toBe("claude");
    });

    test("returns null when no CLI is found", () => {
      execFileSync.mockImplementation(() => {
        throw new Error("not found");
      });

      expect(detectCli()).toBeNull();
    });

    test("prefers copilot over claude when both are available", () => {
      execFileSync.mockImplementation((cmd, args) => {
        if (args && (args[0] === "copilot" || args[0] === "claude")) {
          return Buffer.from("");
        }
        throw new Error("not found");
      });

      expect(detectCli()).toBe("copilot");
    });
  });

  describe("copyContentToTemp", () => {
    let tmpDir;

    afterEach(() => {
      if (tmpDir && fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true });
      }
    });

    test("copies content to a temp directory", () => {
      jest.restoreAllMocks();

      tmpDir = copyContentToTemp(repoRoot);

      expect(fs.existsSync(tmpDir)).toBe(true);
      expect(tmpDir).toContain("promptkit-");
      expect(fs.existsSync(path.join(tmpDir, "manifest.yaml"))).toBe(true);
      expect(
        fs.existsSync(path.join(tmpDir, "personas", "systems-engineer.md"))
      ).toBe(true);
    });

    test("creates a unique temp directory each time", () => {
      jest.restoreAllMocks();

      const tmpDir1 = copyContentToTemp(repoRoot);
      const tmpDir2 = copyContentToTemp(repoRoot);

      expect(tmpDir1).not.toBe(tmpDir2);

      fs.rmSync(tmpDir1, { recursive: true });
      fs.rmSync(tmpDir2, { recursive: true });
      tmpDir = null;
    });

    test("preserves directory structure", () => {
      jest.restoreAllMocks();

      tmpDir = copyContentToTemp(repoRoot);

      expect(
        fs.existsSync(path.join(tmpDir, "protocols", "guardrails", "anti-hallucination.md"))
      ).toBe(true);
      expect(
        fs.existsSync(path.join(tmpDir, "protocols", "reasoning", "root-cause-analysis.md"))
      ).toBe(true);
      expect(
        fs.existsSync(path.join(tmpDir, "formats", "investigation-report.md"))
      ).toBe(true);
    });

    test("copied files have same content as originals", () => {
      jest.restoreAllMocks();

      tmpDir = copyContentToTemp(repoRoot);

      const original = fs.readFileSync(
        path.join(repoRoot, "manifest.yaml"),
        "utf8"
      );
      const copied = fs.readFileSync(
        path.join(tmpDir, "manifest.yaml"),
        "utf8"
      );
      expect(copied).toBe(original);
    });
  });
});
