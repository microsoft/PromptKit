// SPDX-License-Identifier: MIT
// Copyright (c) PromptKit Contributors

// cli/tests/update-check.test.js — unit tests for the update-check module.
// Exercises pure functions (version parsing, comparison, banner formatting)
// and the suppression-reason logic. Does not hit the network.

const { describe, it } = require("node:test");
const assert = require("node:assert");

const {
  parseVersion,
  isNewer,
  formatBanner,
  suppressionReason,
  checkForUpdate,
} = require("../lib/update-check");

describe("parseVersion", () => {
  it("parses plain semver", () => {
    assert.deepStrictEqual(parseVersion("1.2.3"), [1, 2, 3]);
  });

  it("strips leading 'v'", () => {
    assert.deepStrictEqual(parseVersion("v0.6.1"), [0, 6, 1]);
  });

  it("ignores prerelease and build metadata after patch", () => {
    assert.deepStrictEqual(parseVersion("1.2.3-rc.1"), [1, 2, 3]);
    assert.deepStrictEqual(parseVersion("1.2.3+build.5"), [1, 2, 3]);
  });

  it("returns null for garbage input", () => {
    assert.strictEqual(parseVersion(""), null);
    assert.strictEqual(parseVersion("not-a-version"), null);
    assert.strictEqual(parseVersion(undefined), null);
    assert.strictEqual(parseVersion(null), null);
    assert.strictEqual(parseVersion("1.2"), null);
  });
});

describe("isNewer", () => {
  it("detects major, minor, and patch bumps", () => {
    assert.strictEqual(isNewer("1.0.0", "0.9.9"), true);
    assert.strictEqual(isNewer("0.7.0", "0.6.9"), true);
    assert.strictEqual(isNewer("0.6.2", "0.6.1"), true);
  });

  it("returns false for equal versions", () => {
    assert.strictEqual(isNewer("0.6.1", "0.6.1"), false);
  });

  it("returns false when candidate is older", () => {
    assert.strictEqual(isNewer("0.5.0", "0.6.0"), false);
    assert.strictEqual(isNewer("0.6.0", "0.6.1"), false);
    assert.strictEqual(isNewer("0.9.9", "1.0.0"), false);
  });

  it("returns false on unparseable input", () => {
    assert.strictEqual(isNewer("bogus", "0.6.1"), false);
    assert.strictEqual(isNewer("0.6.1", "bogus"), false);
  });
});

describe("formatBanner", () => {
  it("produces a boxed banner containing both versions and the package", () => {
    const banner = formatBanner("@alan-jowett/promptkit", "0.6.1", "0.7.0");
    assert.match(banner, /Update available: 0\.6\.1 -> 0\.7\.0/);
    assert.match(banner, /npm i -g @alan-jowett\/promptkit/);
    // Four lines: top bar, two content lines, bottom bar.
    assert.strictEqual(banner.split("\n").length, 4);
  });

  it("pads content lines to the same width", () => {
    const banner = formatBanner("pkg", "1.0.0", "2.0.0");
    const lines = banner.split("\n");
    assert.strictEqual(lines[0].length, lines[3].length);
    assert.strictEqual(lines[1].length, lines[2].length);
    assert.strictEqual(lines[0].length, lines[1].length);
  });
});

describe("suppressionReason", () => {
  function withEnv(overrides, fn) {
    const saved = {};
    for (const key of Object.keys(overrides)) {
      saved[key] = process.env[key];
      if (overrides[key] === undefined) delete process.env[key];
      else process.env[key] = overrides[key];
    }
    try {
      return fn();
    } finally {
      for (const key of Object.keys(saved)) {
        if (saved[key] === undefined) delete process.env[key];
        else process.env[key] = saved[key];
      }
    }
  }

  it("returns 'NO_UPDATE_NOTIFIER' when the env var is '1'", () => {
    withEnv({ NO_UPDATE_NOTIFIER: "1", CI: undefined }, () => {
      assert.strictEqual(
        suppressionReason({ ttyOverride: true }),
        "NO_UPDATE_NOTIFIER"
      );
    });
  });

  it("returns 'CI' when CI env var is set", () => {
    withEnv({ NO_UPDATE_NOTIFIER: undefined, CI: "true" }, () => {
      assert.strictEqual(suppressionReason({ ttyOverride: true }), "CI");
    });
  });

  it("returns 'non-tty' when stdout is not a TTY", () => {
    withEnv({ NO_UPDATE_NOTIFIER: undefined, CI: undefined }, () => {
      assert.strictEqual(suppressionReason({ ttyOverride: false }), "non-tty");
    });
  });

  it("returns null when checks should proceed", () => {
    withEnv({ NO_UPDATE_NOTIFIER: undefined, CI: undefined }, () => {
      assert.strictEqual(suppressionReason({ ttyOverride: true }), null);
    });
  });

  it("force: true bypasses all suppressions", () => {
    withEnv({ NO_UPDATE_NOTIFIER: "1", CI: "true" }, () => {
      assert.strictEqual(
        suppressionReason({ force: true, ttyOverride: false }),
        null
      );
    });
  });
});

describe("checkForUpdate (suppression paths)", () => {
  it("returns null immediately when suppressed, without network I/O", async () => {
    const saved = process.env.NO_UPDATE_NOTIFIER;
    process.env.NO_UPDATE_NOTIFIER = "1";
    try {
      const result = await checkForUpdate("@alan-jowett/promptkit", "0.6.1");
      assert.strictEqual(result, null);
    } finally {
      if (saved === undefined) delete process.env.NO_UPDATE_NOTIFIER;
      else process.env.NO_UPDATE_NOTIFIER = saved;
    }
  });
});
