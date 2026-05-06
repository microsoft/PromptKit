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

describe("checkForUpdate (cache paths)", () => {
  const updateCheck = require("../lib/update-check");
  const { _internals } = updateCheck;

  // Replace _internals with stubs for the duration of fn(). Tests run with
  // force: true (or ttyOverride) to bypass suppression.
  function withStubs(stubs, fn) {
    const saved = {
      readCache: _internals.readCache,
      writeCache: _internals.writeCache,
      fetchLatest: _internals.fetchLatest,
    };
    Object.assign(_internals, stubs);
    const savedNoNotifier = process.env.NO_UPDATE_NOTIFIER;
    const savedCi = process.env.CI;
    const savedIsTty = process.stdout.isTTY;
    delete process.env.NO_UPDATE_NOTIFIER;
    delete process.env.CI;
    process.stdout.isTTY = true;
    return Promise.resolve()
      .then(fn)
      .finally(() => {
        Object.assign(_internals, saved);
        if (savedNoNotifier === undefined) delete process.env.NO_UPDATE_NOTIFIER;
        else process.env.NO_UPDATE_NOTIFIER = savedNoNotifier;
        if (savedCi === undefined) delete process.env.CI;
        else process.env.CI = savedCi;
        process.stdout.isTTY = savedIsTty;
      });
  }

  const PKG = "@alan-jowett/promptkit";

  it("uses cached latest within TTL without calling fetchLatest", async () => {
    let fetchCalls = 0;
    const writes = [];
    const now = 1_700_000_000_000;
    const result = await withStubs(
      {
        readCache: () => ({
          pkg: PKG,
          latest: "0.7.0",
          checkedAt: now - 1000,
        }),
        writeCache: (data) => writes.push(data),
        fetchLatest: async () => {
          fetchCalls++;
          return "9.9.9";
        },
      },
      () => checkForUpdate(PKG, "0.6.1", { now })
    );
    assert.deepStrictEqual(result, { latest: "0.7.0", isUpdate: true });
    assert.strictEqual(fetchCalls, 0);
    assert.strictEqual(writes.length, 0);
  });

  it("expired cache triggers a fresh fetch and rewrites the cache", async () => {
    let fetchCalls = 0;
    const writes = [];
    const now = 1_700_000_000_000;
    const result = await withStubs(
      {
        readCache: () => ({
          pkg: PKG,
          latest: "0.7.0",
          checkedAt: now - (CACHE_TTL_MS_FOR_TESTS + 1),
        }),
        writeCache: (data) => writes.push(data),
        fetchLatest: async () => {
          fetchCalls++;
          return "0.8.0";
        },
      },
      () => checkForUpdate(PKG, "0.6.1", { now })
    );
    assert.deepStrictEqual(result, { latest: "0.8.0", isUpdate: true });
    assert.strictEqual(fetchCalls, 1);
    assert.deepStrictEqual(writes, [
      { pkg: PKG, latest: "0.8.0", checkedAt: now },
    ]);
  });

  it("returns isUpdate: false when cached latest is not newer", async () => {
    const now = 1_700_000_000_000;
    const result = await withStubs(
      {
        readCache: () => ({ pkg: PKG, latest: "0.6.1", checkedAt: now - 1000 }),
        writeCache: () => {},
        fetchLatest: async () => "9.9.9",
      },
      () => checkForUpdate(PKG, "0.6.1", { now })
    );
    assert.deepStrictEqual(result, { latest: "0.6.1", isUpdate: false });
  });

  it("ignores cache when pkg name does not match", async () => {
    let fetchCalls = 0;
    const now = 1_700_000_000_000;
    const result = await withStubs(
      {
        readCache: () => ({
          pkg: "other-pkg",
          latest: "9.9.9",
          checkedAt: now - 1000,
        }),
        writeCache: () => {},
        fetchLatest: async () => {
          fetchCalls++;
          return "0.8.0";
        },
      },
      () => checkForUpdate(PKG, "0.6.1", { now })
    );
    assert.strictEqual(fetchCalls, 1);
    assert.deepStrictEqual(result, { latest: "0.8.0", isUpdate: true });
  });

  it("treats unparseable cached latest as a miss and refetches", async () => {
    let fetchCalls = 0;
    const writes = [];
    const now = 1_700_000_000_000;
    const result = await withStubs(
      {
        readCache: () => ({
          pkg: PKG,
          latest: '"0.7.0"',
          checkedAt: now - 1000,
        }),
        writeCache: (data) => writes.push(data),
        fetchLatest: async () => {
          fetchCalls++;
          return "0.8.0";
        },
      },
      () => checkForUpdate(PKG, "0.6.1", { now })
    );
    assert.strictEqual(fetchCalls, 1);
    assert.deepStrictEqual(result, { latest: "0.8.0", isUpdate: true });
    assert.deepStrictEqual(writes, [
      { pkg: PKG, latest: "0.8.0", checkedAt: now },
    ]);
  });

  it("does not cache or return an unparseable latest from fetchLatest", async () => {
    const writes = [];
    const now = 1_700_000_000_000;
    const result = await withStubs(
      {
        readCache: () => null,
        writeCache: (data) => writes.push(data),
        fetchLatest: async () => "garbage",
      },
      () => checkForUpdate(PKG, "0.6.1", { now })
    );
    assert.strictEqual(result, null);
    assert.strictEqual(writes.length, 0);
  });

  it("returns null when fetchLatest returns null and writes nothing", async () => {
    const writes = [];
    const now = 1_700_000_000_000;
    const result = await withStubs(
      {
        readCache: () => null,
        writeCache: (data) => writes.push(data),
        fetchLatest: async () => null,
      },
      () => checkForUpdate(PKG, "0.6.1", { now })
    );
    assert.strictEqual(result, null);
    assert.strictEqual(writes.length, 0);
  });
});

// Mirror of the constant in update-check.js. Kept inline so the test file
// stays self-contained and does not reach into module-private state.
const CACHE_TTL_MS_FOR_TESTS = 24 * 60 * 60 * 1000;
